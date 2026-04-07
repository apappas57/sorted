import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompt";
import { parseReportResponse } from "@/lib/report-schema";
import { sanitizeString, sanitizeNumber, isValidState } from "@/lib/sanitize";
import { siteConfig } from "@/config/site";
import type { QuestionnaireAnswers, AustralianState } from "@/types/questionnaire";

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

    // 6. Record the successful request for rate limiting
    recordRequest(ip);

    // 7. Return the validated report
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
