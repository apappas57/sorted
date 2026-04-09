import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompt";
import { parseReportResponse } from "@/lib/report-schema";
import { sanitizeString, sanitizeNumber, isValidState } from "@/lib/sanitize";
import { validateTaxFigures } from "@/lib/tax-calculator";
import { siteConfig } from "@/config/site";
import type {
  QuestionnaireAnswers,
  AustralianState,
  WorkFromHome,
  CarForWork,
  AnnualKmsRange,
  PrivateHealthInsurance,
  HousingStatus,
  AgeRange,
  FamilyStatus,
} from "@/types/questionnaire";

// ─── Rate Limiting (in-memory) ──────────────────────────────────────────────

type RateLimitEntry = {
  timestamps: number[];
};

const rateLimitMap = new Map<string, RateLimitEntry>();

/** Remove expired entries to prevent memory leaks. Runs every 10 minutes. */
const CLEANUP_INTERVAL_MS = 600_000;
let lastCleanup = Date.now();

function cleanupExpiredEntries(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  const cutoff = now - siteConfig.rateLimit.windowMs;
  for (const [ip, entry] of rateLimitMap) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
    if (entry.timestamps.length === 0) {
      rateLimitMap.delete(ip);
    }
  }
}

function isRateLimited(ip: string): boolean {
  cleanupExpiredEntries();

  const now = Date.now();
  const cutoff = now - siteConfig.rateLimit.windowMs;
  const entry = rateLimitMap.get(ip);

  if (!entry) return false;

  // Filter out expired timestamps
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
  return entry.timestamps.length >= siteConfig.rateLimit.maxReports;
}

function recordRequest(ip: string): void {
  const entry = rateLimitMap.get(ip);
  if (entry) {
    entry.timestamps.push(Date.now());
  } else {
    rateLimitMap.set(ip, { timestamps: [Date.now()] });
  }
}

// ─── Validation Helpers ─────────────────────────────────────────────────────

const VALID_EMPLOYMENT_TYPES = new Set([
  "employee",
  "sole_trader",
  "both",
  "casual",
  "not_working",
]);

const VALID_ABN_STATUSES = new Set(["has_abn", "side_income_no_abn", "no"]);
const VALID_GST_STATUSES = new Set(["registered", "not_registered", "unsure"]);
const VALID_HECS_STATUSES = new Set(["yes", "no", "unsure"]);
const VALID_DEBT_TYPES = new Set([
  "credit_card",
  "car_loan",
  "personal_loan",
  "afterpay_bnpl",
]);
const VALID_JOB_HUNTING = new Set(["actively", "casually", "no"]);
const VALID_WORK_FROM_HOME = new Set(["yes", "sometimes", "no"]);
const VALID_CAR_FOR_WORK = new Set(["yes", "no"]);
const VALID_ANNUAL_KMS = new Set([
  "under_5000",
  "5000_15000",
  "15000_25000",
  "25000_40000",
  "over_40000",
]);
const VALID_PRIVATE_HEALTH = new Set(["yes", "no"]);
const VALID_HOUSING_STATUS = new Set(["renting", "mortgage", "neither"]);
const VALID_AGE_RANGE = new Set(["18-29", "30-39", "40-49", "50-59", "60+"]);
const VALID_FAMILY_STATUS = new Set([
  "single",
  "partner_no_kids",
  "partner_with_kids",
  "single_parent",
]);

type ValidationResult =
  | { ok: true; answers: QuestionnaireAnswers }
  | { ok: false; error: string };

function validateAndSanitize(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const raw = body as Record<string, unknown>;

  // --- Employment (required) ---
  if (!raw.employment || typeof raw.employment !== "string") {
    return { ok: false, error: "Employment type is required." };
  }
  const employment = sanitizeString(raw.employment);
  if (!VALID_EMPLOYMENT_TYPES.has(employment)) {
    return { ok: false, error: "Invalid employment type." };
  }

  // --- State (required) ---
  if (!raw.state || typeof raw.state !== "string") {
    return { ok: false, error: "State/territory is required." };
  }
  const state = sanitizeString(raw.state);
  if (!isValidState(state)) {
    return { ok: false, error: "Invalid Australian state or territory." };
  }

  // --- HECS (required) ---
  if (!raw.hecsDebt || typeof raw.hecsDebt !== "string") {
    return { ok: false, error: "HECS-HELP status is required." };
  }
  const hecsDebt = sanitizeString(raw.hecsDebt);
  if (!VALID_HECS_STATUSES.has(hecsDebt)) {
    return { ok: false, error: "Invalid HECS-HELP status." };
  }

  // --- Job Hunting (required) ---
  if (!raw.jobHunting || typeof raw.jobHunting !== "string") {
    return { ok: false, error: "Job hunting status is required." };
  }
  const jobHunting = sanitizeString(raw.jobHunting);
  if (!VALID_JOB_HUNTING.has(jobHunting)) {
    return { ok: false, error: "Invalid job hunting status." };
  }

  // --- Debts (required, can be empty array) ---
  if (!Array.isArray(raw.debts)) {
    return { ok: false, error: "Debts must be an array." };
  }
  const debts: QuestionnaireAnswers["debts"] = [];
  for (const d of raw.debts) {
    if (!d || typeof d !== "object") {
      return { ok: false, error: "Each debt entry must be an object." };
    }
    const debtObj = d as Record<string, unknown>;
    if (!debtObj.type || typeof debtObj.type !== "string") {
      return { ok: false, error: "Each debt entry must have a valid type." };
    }
    const debtType = sanitizeString(debtObj.type);
    if (!VALID_DEBT_TYPES.has(debtType)) {
      return { ok: false, error: `Invalid debt type: ${debtType}` };
    }
    const amount =
      debtObj.amount !== undefined
        ? sanitizeNumber(debtObj.amount, 0, 10_000_000)
        : undefined;
    debts.push({
      type: debtType as QuestionnaireAnswers["debts"][number]["type"],
      ...(amount !== null && amount !== undefined ? { amount } : {}),
    });
  }

  // --- Optional: ABN Status ---
  let abnStatus: QuestionnaireAnswers["abnStatus"] | undefined;
  if (raw.abnStatus !== undefined && raw.abnStatus !== null) {
    if (typeof raw.abnStatus !== "string") {
      return { ok: false, error: "Invalid ABN status." };
    }
    const cleaned = sanitizeString(raw.abnStatus);
    if (!VALID_ABN_STATUSES.has(cleaned)) {
      return { ok: false, error: "Invalid ABN status." };
    }
    abnStatus = cleaned as QuestionnaireAnswers["abnStatus"];
  }

  // --- Optional: Annual Revenue ---
  let annualRevenue: number | undefined;
  if (raw.annualRevenue !== undefined && raw.annualRevenue !== null) {
    const num = sanitizeNumber(raw.annualRevenue, 0, 100_000_000);
    if (num === null) {
      return { ok: false, error: "Invalid annual revenue amount." };
    }
    annualRevenue = num;
  }

  // --- Optional: GST Status ---
  let gstStatus: QuestionnaireAnswers["gstStatus"] | undefined;
  if (raw.gstStatus !== undefined && raw.gstStatus !== null) {
    if (typeof raw.gstStatus !== "string") {
      return { ok: false, error: "Invalid GST status." };
    }
    const cleaned = sanitizeString(raw.gstStatus);
    if (!VALID_GST_STATUSES.has(cleaned)) {
      return { ok: false, error: "Invalid GST status." };
    }
    gstStatus = cleaned as QuestionnaireAnswers["gstStatus"];
  }

  // --- Optional: HECS Amount ---
  let hecsAmount: number | undefined;
  if (raw.hecsAmount !== undefined && raw.hecsAmount !== null) {
    const num = sanitizeNumber(raw.hecsAmount, 0, 500_000);
    if (num === null) {
      return { ok: false, error: "Invalid HECS amount." };
    }
    hecsAmount = num;
  }

  // --- Optional: Annual Salary ---
  let annualSalary: number | undefined;
  if (raw.annualSalary !== undefined && raw.annualSalary !== null) {
    const num = sanitizeNumber(raw.annualSalary, 0, 10_000_000);
    if (num === null) {
      return { ok: false, error: "Invalid annual salary amount." };
    }
    annualSalary = num;
  }

  // --- Optional: Work From Home ---
  let workFromHome: WorkFromHome | undefined;
  if (raw.workFromHome !== undefined && raw.workFromHome !== null) {
    if (typeof raw.workFromHome !== "string") {
      return { ok: false, error: "Invalid work from home status." };
    }
    const cleaned = sanitizeString(raw.workFromHome);
    if (!VALID_WORK_FROM_HOME.has(cleaned)) {
      return { ok: false, error: "Invalid work from home status." };
    }
    workFromHome = cleaned as WorkFromHome;
  }

  // --- Optional: Work From Home Hours ---
  let workFromHomeHours: number | undefined;
  if (raw.workFromHomeHours !== undefined && raw.workFromHomeHours !== null) {
    const num = sanitizeNumber(raw.workFromHomeHours, 0, 168);
    if (num === null) {
      return { ok: false, error: "Invalid work from home hours." };
    }
    workFromHomeHours = num;
  }

  // --- Optional: Car For Work ---
  let carForWork: CarForWork | undefined;
  if (raw.carForWork !== undefined && raw.carForWork !== null) {
    if (typeof raw.carForWork !== "string") {
      return { ok: false, error: "Invalid car for work status." };
    }
    const cleaned = sanitizeString(raw.carForWork);
    if (!VALID_CAR_FOR_WORK.has(cleaned)) {
      return { ok: false, error: "Invalid car for work status." };
    }
    carForWork = cleaned as CarForWork;
  }

  // --- Optional: Estimated Work Kms ---
  let estimatedWorkKms: number | undefined;
  if (raw.estimatedWorkKms !== undefined && raw.estimatedWorkKms !== null) {
    const num = sanitizeNumber(raw.estimatedWorkKms, 0, 200_000);
    if (num === null) {
      return { ok: false, error: "Invalid estimated work kilometres." };
    }
    estimatedWorkKms = num;
  }

  // --- Optional: Annual Kms Range ---
  let annualKms: AnnualKmsRange | undefined;
  if (raw.annualKms !== undefined && raw.annualKms !== null) {
    if (typeof raw.annualKms !== "string") {
      return { ok: false, error: "Invalid annual kilometres range." };
    }
    const cleaned = sanitizeString(raw.annualKms);
    if (!VALID_ANNUAL_KMS.has(cleaned)) {
      return { ok: false, error: "Invalid annual kilometres range." };
    }
    annualKms = cleaned as AnnualKmsRange;
  }

  // --- Optional: Private Health Insurance ---
  let privateHealth: PrivateHealthInsurance | undefined;
  if (raw.privateHealth !== undefined && raw.privateHealth !== null) {
    if (typeof raw.privateHealth !== "string") {
      return { ok: false, error: "Invalid private health insurance status." };
    }
    const cleaned = sanitizeString(raw.privateHealth);
    if (!VALID_PRIVATE_HEALTH.has(cleaned)) {
      return { ok: false, error: "Invalid private health insurance status." };
    }
    privateHealth = cleaned as PrivateHealthInsurance;
  }

  // --- Optional: Housing Status ---
  let housingStatus: HousingStatus | undefined;
  if (raw.housingStatus !== undefined && raw.housingStatus !== null) {
    if (typeof raw.housingStatus !== "string") {
      return { ok: false, error: "Invalid housing status." };
    }
    const cleaned = sanitizeString(raw.housingStatus);
    if (!VALID_HOUSING_STATUS.has(cleaned)) {
      return { ok: false, error: "Invalid housing status." };
    }
    housingStatus = cleaned as HousingStatus;
  }

  // --- Optional: Weekly Rent ---
  let weeklyRent: number | undefined;
  if (raw.weeklyRent !== undefined && raw.weeklyRent !== null) {
    const num = sanitizeNumber(raw.weeklyRent, 0, 10_000);
    if (num === null) {
      return { ok: false, error: "Invalid weekly rent amount." };
    }
    weeklyRent = num;
  }

  // --- Optional: Age Range ---
  let ageRange: AgeRange | undefined;
  if (raw.ageRange !== undefined && raw.ageRange !== null) {
    if (typeof raw.ageRange !== "string") {
      return { ok: false, error: "Invalid age range." };
    }
    const cleaned = sanitizeString(raw.ageRange);
    if (!VALID_AGE_RANGE.has(cleaned)) {
      return { ok: false, error: "Invalid age range." };
    }
    ageRange = cleaned as AgeRange;
  }

  // --- Optional: Family Status ---
  let familyStatus: FamilyStatus | undefined;
  if (raw.familyStatus !== undefined && raw.familyStatus !== null) {
    if (typeof raw.familyStatus !== "string") {
      return { ok: false, error: "Invalid family status." };
    }
    const cleaned = sanitizeString(raw.familyStatus);
    if (!VALID_FAMILY_STATUS.has(cleaned)) {
      return { ok: false, error: "Invalid family status." };
    }
    familyStatus = cleaned as FamilyStatus;
  }

  const answers: QuestionnaireAnswers = {
    employment: employment as QuestionnaireAnswers["employment"],
    state: state as AustralianState,
    hecsDebt: hecsDebt as QuestionnaireAnswers["hecsDebt"],
    jobHunting: jobHunting as QuestionnaireAnswers["jobHunting"],
    debts,
    ...(abnStatus !== undefined ? { abnStatus } : {}),
    ...(annualRevenue !== undefined ? { annualRevenue } : {}),
    ...(gstStatus !== undefined ? { gstStatus } : {}),
    ...(hecsAmount !== undefined ? { hecsAmount } : {}),
    ...(annualSalary !== undefined ? { annualSalary } : {}),
    ...(workFromHome !== undefined ? { workFromHome } : {}),
    ...(workFromHomeHours !== undefined ? { workFromHomeHours } : {}),
    ...(carForWork !== undefined ? { carForWork } : {}),
    ...(estimatedWorkKms !== undefined ? { estimatedWorkKms } : {}),
    ...(annualKms !== undefined ? { annualKms } : {}),
    ...(privateHealth !== undefined ? { privateHealth } : {}),
    ...(housingStatus !== undefined ? { housingStatus } : {}),
    ...(weeklyRent !== undefined ? { weeklyRent } : {}),
    ...(ageRange !== undefined ? { ageRange } : {}),
    ...(familyStatus !== undefined ? { familyStatus } : {}),
  };

  return { ok: true, answers };
}

// ─── AI Call ────────────────────────────────────────────────────────────────

async function generateReport(
  answers: QuestionnaireAnswers,
  isRetry: boolean = false
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }

  const client = new Anthropic({ apiKey });

  const systemPrompt = isRetry
    ? buildSystemPrompt() +
      "\n\nIMPORTANT: Your previous response was invalid JSON. Return ONLY a raw JSON object. No markdown code fences, no explanation, no text outside the JSON. Start with { and end with }."
    : buildSystemPrompt();

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: buildUserPrompt(answers),
      },
    ],
  });

  // Extract text from the response
  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("AI_NO_TEXT_RESPONSE");
  }

  return textBlock.text;
}

// ─── Route Handler ──────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error:
            "You've used your 3 free reports today. Come back tomorrow!",
        },
        { status: 429 }
      );
    }

    // 2. Parse and validate input
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    const validation = validateAndSanitize(body);
    if (!validation.ok) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { answers } = validation;

    // 3. Check API key before making the call
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Service configuration error. Please try again later." },
        { status: 500 }
      );
    }

    // 4. Generate report with Claude
    let responseText: string;
    try {
      responseText = await generateReport(answers);
    } catch (err) {
      if (err instanceof Error && err.message === "MISSING_API_KEY") {
        return NextResponse.json(
          { error: "Service configuration error. Please try again later." },
          { status: 500 }
        );
      }
      console.error("[Sorted] Claude API error:", err instanceof Error ? err.message : err);
      return NextResponse.json(
        { error: "Failed to generate report. Please try again." },
        { status: 502 }
      );
    }

    // 5. Parse and validate the AI response
    let reportData;
    try {
      // Strip markdown code fences if present
      const cleaned = responseText
        .replace(/^```(?:json)?\s*\n?/i, "")
        .replace(/\n?```\s*$/i, "")
        .trim();
      const parsed = JSON.parse(cleaned);
      reportData = parseReportResponse(parsed);
    } catch (firstErr) {
      console.error("[Sorted] First parse failed:", firstErr instanceof Error ? firstErr.message : firstErr);
      console.error("[Sorted] Raw response (first 500 chars):", responseText?.slice(0, 500));
      // Retry once with stricter prompt
      try {
        const retryText = await generateReport(answers, true);
        const cleaned = retryText
          .replace(/^```(?:json)?\s*\n?/i, "")
          .replace(/\n?```\s*$/i, "")
          .trim();
        const parsed = JSON.parse(cleaned);
        reportData = parseReportResponse(parsed);
      } catch (retryErr) {
        console.error("[Sorted] Retry parse also failed:", retryErr instanceof Error ? retryErr.message : retryErr);
        return NextResponse.json(
          { error: "Failed to generate report. Please try again." },
          { status: 502 }
        );
      }
    }

    // 6. Validate tax figures against deterministic calculation
    const estimatedIncome =
      (answers.annualSalary ?? 0) + (answers.annualRevenue ?? 0);

    if (estimatedIncome > 0) {
      const hasPrivateHealth = answers.privateHealth === "yes";
      const validated = validateTaxFigures(
        {
          annualTaxEstimate: reportData.tax.annualTaxEstimate,
          medicareLevy: reportData.tax.medicareLevy,
          estimatedTaxRate: reportData.tax.estimatedTaxRate,
          fortnightlySetAside: reportData.tax.fortnightlySetAside,
        },
        estimatedIncome,
        hasPrivateHealth
      );

      if (validated.corrected) {
        reportData.tax.annualTaxEstimate = validated.annualTaxEstimate;
        reportData.tax.medicareLevy = validated.medicareLevy;
        reportData.tax.estimatedTaxRate = validated.estimatedTaxRate;
        reportData.tax.fortnightlySetAside = validated.fortnightlySetAside;
      }
    }

    // 7. Record the successful request for rate limiting
    recordRequest(ip);

    // 8. Return the validated report
    return NextResponse.json(reportData, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
