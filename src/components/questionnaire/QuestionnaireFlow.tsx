"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type {
  QuestionnaireAnswers,
  QuestionnaireStep,
  EmploymentType,
  ABNStatus,
  GSTStatus,
  HECSStatus,
  JobHuntingStatus,
  DebtEntry,
  AustralianState,
  WorkFromHome,
  CarForWork,
  AnnualKmsRange,
  PrivateHealthInsurance,
  HousingStatus,
  AgeRange,
  FamilyStatus,
  BusinessDeductions,
  NovatedLeaseStatus,
} from "@/types/questionnaire";
import type { ReportData } from "@/types/report";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { ReportView } from "@/components/report/ReportView";
import { StepEmployment } from "./StepEmployment";
import { StepSalary } from "./StepSalary";
import { StepABN } from "./StepABN";
import { StepGST } from "./StepGST";
import { StepWorkFromHome } from "./StepWorkFromHome";
import { StepCarForWork } from "./StepCarForWork";
import { StepHealthInsurance } from "./StepHealthInsurance";
import { StepHECS } from "./StepHECS";
import { StepPersonalDebt } from "./StepPersonalDebt";
import { StepHousing } from "./StepHousing";
import { StepLifeSituation } from "./StepLifeSituation";
import { StepJobHunting } from "./StepJobHunting";
import { StepState } from "./StepState";
import { StepBusinessDeductions } from "./StepBusinessDeductions";
import { siteConfig } from "@/config/site";
import {
  SseFrameParser,
  type ReportStreamErrorData,
  type ReportStreamTickData,
  type SseFrame,
} from "@/lib/report-stream";

// ─── Step Configuration ───────────────────────────────────────────────────────

const ALL_STEPS: QuestionnaireStep[] = [
  "employment",
  "salary",
  "abn",
  "gst",
  "work_from_home",
  "car_for_work",
  "health_insurance",
  "business_deductions",
  "hecs",
  "debt",
  "housing",
  "life_situation",
  "job_hunting",
  "state",
];

const STEP_LABELS: Record<QuestionnaireStep, string> = {
  employment: "Work situation",
  salary: "Annual Salary",
  abn: "ABN & income",
  gst: "GST status",
  work_from_home: "Work From Home",
  car_for_work: "Car For Work",
  health_insurance: "Health Insurance",
  business_deductions: "Business Deductions",
  hecs: "Study loan",
  debt: "Personal debt",
  housing: "Housing",
  life_situation: "Life Situation",
  job_hunting: "Job search",
  state: "Location",
};

const LOADING_MESSAGES = [
  "Crunching your numbers...",
  `Checking ATO rates for ${siteConfig.financialYear}...`,
  "Working out your tax and Medicare levy...",
  "Finding deductions you might be missing...",
  "Comparing vehicle and home office methods...",
  "Looking up state-specific benefits...",
  "Checking what you may be leaving on the table...",
  "Building your personalised report...",
  "Almost there, putting it all together...",
];

// ─── Initial State ────────────────────────────────────────────────────────────

const INITIAL_ANSWERS: Partial<QuestionnaireAnswers> = {
  debts: [],
};

// ─── Device-Local Persistence ─────────────────────────────────────────────────
//
// The app is server-stateless by design, so sessionStorage is the only place
// answers survive a page reload. iOS suspending the page mid-generation used to
// evaporate 12+ questions of work; now answers are saved as they are entered,
// and an in-flight flag lets a reload-during-generation land on honest copy
// with a one-tap regenerate.

const ANSWERS_STORAGE_KEY = "sorted.answers.v1";
const INFLIGHT_STORAGE_KEY = "sorted.inflight.v1";

// Liveness thresholds for the SSE stream. The server heartbeats every ~10s,
// so ~30s of silence means three missed ticks: the connection is dead even if
// reader.read() never rejects (Wi-Fi to cellular hand-off, NAT idle drop, the
// documented Safari cases where a request just stops). Without this, a dead
// stream leaves the loading screen up forever with the wake lock held.
const STREAM_STALE_MS = 30_000;
const STREAM_STALE_CHECK_MS = 5_000;

/**
 * Restore persisted answers with a defensive shape-check. Corrupt or stale
 * data must degrade to fewer answers (or none), never a crash -- the server
 * revalidates everything on submit anyway.
 */
function readStoredAnswers(): Partial<QuestionnaireAnswers> | null {
  try {
    const raw = sessionStorage.getItem(ANSWERS_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    const record = parsed as Record<string, unknown>;
    if (!Array.isArray(record.debts)) return null;
    // Drop debt entries that are not object-shaped before they reach render.
    record.debts = record.debts.filter(
      (d) =>
        d !== null &&
        typeof d === "object" &&
        typeof (d as Record<string, unknown>).type === "string"
    );
    return record as Partial<QuestionnaireAnswers>;
  } catch {
    // Unreadable storage or invalid JSON -- discard silently.
    return null;
  }
}

function clearStoredAnswers(): void {
  try {
    sessionStorage.removeItem(ANSWERS_STORAGE_KEY);
  } catch {
    // Storage unavailable (private browsing, quota) -- nothing to clear.
  }
}

function setInflightFlag(on: boolean): void {
  try {
    if (on) {
      sessionStorage.setItem(INFLIGHT_STORAGE_KEY, "1");
    } else {
      sessionStorage.removeItem(INFLIGHT_STORAGE_KEY);
    }
  } catch {
    // Storage unavailable -- the reload-recovery copy just will not show.
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function QuestionnaireFlow() {
  // Answer state
  const [answers, setAnswers] =
    useState<Partial<QuestionnaireAnswers>>(INITIAL_ANSWERS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Submit/report state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  // Permanent errors (service outage) must not invite a retry.
  const [errorPermanent, setErrorPermanent] = useState(false);
  // A connection-class failure mid-generation leaves complete answers behind,
  // so "Try again" can regenerate in one tap instead of re-walking the steps.
  const [retryRegenerates, setRetryRegenerates] = useState(false);
  // Set when a reload happened while a report was generating (in-flight flag
  // found in sessionStorage on mount).
  const [wasInterrupted, setWasInterrupted] = useState(false);
  // Restore-before-persist gate for sessionStorage (see effects below).
  const [storageReady, setStorageReady] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);

  const stepContainerRef = useRef<HTMLDivElement>(null);
  // Screen wake lock held while generating (see the wake-lock effect).
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const wakeLockWantedRef = useRef(false);
  // True if the page went hidden during generation -- lets a failure explain
  // honestly that the phone locked or switched apps, not "connection error".
  const wentHiddenRef = useRef(false);

  // Rotate loading messages while submitting.
  //
  // Report generation measured 61-85s in production. The messages are paced to
  // span that, and elapsed seconds are shown from 20s so a long wait reads as
  // progress rather than a hung page -- the previous version ran out of
  // messages at 18s and then sat frozen on "Almost there..." for another
  // minute, which looks broken right after the user has answered 12 questions.
  useEffect(() => {
    if (!isSubmitting) return;
    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) =>
        prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 9000);
    return () => clearInterval(interval);
  }, [isSubmitting]);

  // Elapsed-time counter for the loading state. This is the client-side
  // fallback; server tick events overwrite it with server-truth every ~10s.
  useEffect(() => {
    if (!isSubmitting) {
      setElapsedSeconds(0);
      return;
    }
    const tick = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(tick);
  }, [isSubmitting]);

  // Restore persisted answers once on mount, and detect a reload that happened
  // mid-generation. StrictMode runs this twice; both passes are idempotent
  // (the persist effect below stays off until storageReady flips, so the
  // second pass re-reads identical storage).
  useEffect(() => {
    const stored = readStoredAnswers();
    if (stored) {
      setAnswers(stored);
    }
    try {
      if (sessionStorage.getItem(INFLIGHT_STORAGE_KEY)) {
        sessionStorage.removeItem(INFLIGHT_STORAGE_KEY);
        setWasInterrupted(true);
      }
    } catch {
      // Storage unavailable -- treat as a fresh visit.
    }
    setStorageReady(true);
  }, []);

  // Persist answers as they change. Gated on storageReady so the mount-time
  // INITIAL_ANSWERS render cannot clobber stored answers before restore runs,
  // and skipped for the pristine object so start-over leaves storage clean.
  useEffect(() => {
    if (!storageReady || answers === INITIAL_ANSWERS) return;
    try {
      sessionStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // Storage unavailable -- persistence is best-effort.
    }
  }, [answers, storageReady]);

  // Acquire the screen wake lock. Progressive enhancement: feature-detected,
  // and never throws where unsupported or denied.
  const acquireWakeLock = useCallback(async () => {
    if (typeof navigator === "undefined" || !("wakeLock" in navigator)) return;
    try {
      const sentinel = await navigator.wakeLock.request("screen");
      if (wakeLockWantedRef.current) {
        // Release any superseded sentinel (a no-op if it already auto-released
        // when the page hid) before storing the fresh one.
        wakeLockRef.current?.release().catch(() => undefined);
        wakeLockRef.current = sentinel;
      } else {
        // Generation finished (or the effect tore down) while the request was
        // in flight -- do not leak a lock nobody will release.
        sentinel.release().catch(() => undefined);
      }
    } catch {
      // Denied or unsupported -- generation carries on without it.
    }
  }, []);

  // Hold a screen wake lock while generating so the phone does not auto-lock
  // during the ~1 minute wait (the 6 Aug production failure: iOS suspended the
  // page, the fetch died, and a report the server had finished evaporated).
  // Wake locks auto-release when the page hides, so re-acquire on return to
  // visible, and record that the page went hidden so a subsequent failure can
  // tell the truth about why.
  useEffect(() => {
    if (!isSubmitting) return;
    wakeLockWantedRef.current = true;
    void acquireWakeLock();

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        wentHiddenRef.current = true;
      } else if (wakeLockWantedRef.current) {
        void acquireWakeLock();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      wakeLockWantedRef.current = false;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      const sentinel = wakeLockRef.current;
      wakeLockRef.current = null;
      sentinel?.release().catch(() => undefined);
    };
  }, [isSubmitting, acquireWakeLock]);

  // ─── Conditional Step Logic ───────────────────────────────────────────────

  const activeSteps = useMemo<QuestionnaireStep[]>(() => {
    return ALL_STEPS.filter((step) => {
      const emp = answers.employment;

      // Salary step: only if employee, both, or casual
      if (step === "salary") {
        return emp === "employee" || emp === "both" || emp === "casual";
      }
      // ABN step: only if sole_trader, both, or casual
      if (step === "abn") {
        return emp === "sole_trader" || emp === "both" || emp === "casual";
      }
      // GST step: only if has ABN or side income (not "no")
      if (step === "gst") {
        return (
          answers.abnStatus === "has_abn" ||
          answers.abnStatus === "side_income_no_abn"
        );
      }
      // Car for work: only if employed (not not_working)
      if (step === "car_for_work") {
        return emp !== "not_working";
      }
      // Health insurance: only if estimated total income > $93,000
      if (step === "health_insurance") {
        const salary = answers.annualSalary ?? 0;
        const revenue = answers.annualRevenue ?? 0;
        return salary + revenue > 93000;
      }
      // Business deductions: only if sole_trader or both (has business income)
      if (step === "business_deductions") {
        return emp === "sole_trader" || emp === "both";
      }
      return true;
    });
  }, [
    answers.employment,
    answers.abnStatus,
    answers.annualSalary,
    answers.annualRevenue,
  ]);

  const currentStep = activeSteps[currentStepIndex];
  const totalSteps = activeSteps.length;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  // ─── Validation ───────────────────────────────────────────────────────────

  const isCurrentStepValid = useMemo<boolean>(() => {
    switch (currentStep) {
      case "employment":
        return answers.employment != null;
      case "salary":
        return answers.annualSalary != null && answers.annualSalary > 0;
      case "abn":
        return answers.abnStatus != null;
      case "gst":
        return answers.gstStatus != null;
      case "work_from_home":
        return answers.workFromHome != null;
      case "car_for_work":
        return answers.carForWork != null;
      case "health_insurance":
        return answers.privateHealth != null;
      case "business_deductions":
        // Always valid -- all fields default to 0
        return true;
      case "hecs":
        return answers.hecsDebt != null;
      case "debt":
        // Always valid -- empty array means "none"
        return true;
      case "housing":
        return answers.housingStatus != null;
      case "life_situation":
        return answers.ageRange != null && answers.familyStatus != null;
      case "job_hunting":
        return answers.jobHunting != null;
      case "state":
        return answers.state != null;
      default:
        return false;
    }
  }, [currentStep, answers]);

  // ─── Navigation ───────────────────────────────────────────────────────────

  const scrollToTop = useCallback(() => {
    stepContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const goNext = useCallback(() => {
    if (!isCurrentStepValid) return;
    if (isLastStep) return;
    setCurrentStepIndex((prev) => prev + 1);
    scrollToTop();
  }, [isCurrentStepValid, isLastStep, scrollToTop]);

  const goBack = useCallback(() => {
    if (isFirstStep) return;
    setCurrentStepIndex((prev) => prev - 1);
    scrollToTop();
  }, [isFirstStep, scrollToTop]);

  // ─── Answer Handlers ──────────────────────────────────────────────────────

  const setEmployment = useCallback(
    (value: EmploymentType) => {
      setAnswers((prev) => {
        const next = { ...prev, employment: value };
        // Clear ABN/GST answers if no longer relevant
        if (
          value !== "sole_trader" &&
          value !== "both" &&
          value !== "casual"
        ) {
          delete next.abnStatus;
          delete next.annualRevenue;
          delete next.gstStatus;
        }
        // Clear business deductions if no longer a business owner
        if (value !== "sole_trader" && value !== "both") {
          delete next.businessDeductions;
        }
        // Clear salary if no longer relevant
        if (
          value !== "employee" &&
          value !== "both" &&
          value !== "casual"
        ) {
          delete next.annualSalary;
        }
        // Clear car_for_work if not working
        if (value === "not_working") {
          delete next.carForWork;
          delete next.estimatedWorkKms;
          delete next.annualKms;
          delete next.hasNovatedLease;
        }
        // Clear novated lease if sole trader only (not an employee)
        if (value === "sole_trader") {
          delete next.hasNovatedLease;
        }
        return next;
      });
    },
    []
  );

  const setABNStatus = useCallback((value: ABNStatus) => {
    setAnswers((prev) => {
      const next = { ...prev, abnStatus: value };
      // Clear revenue if "no"
      if (value === "no") {
        delete next.annualRevenue;
        delete next.gstStatus;
      }
      return next;
    });
  }, []);

  const setAnnualRevenue = useCallback((value: number | undefined) => {
    setAnswers((prev) => ({ ...prev, annualRevenue: value }));
  }, []);

  const setGSTStatus = useCallback((value: GSTStatus) => {
    setAnswers((prev) => ({ ...prev, gstStatus: value }));
  }, []);

  const setHECSDebt = useCallback((value: HECSStatus) => {
    setAnswers((prev) => {
      const next = { ...prev, hecsDebt: value };
      if (value !== "yes") {
        delete next.hecsAmount;
      }
      return next;
    });
  }, []);

  const setHECSAmount = useCallback((value: number | undefined) => {
    setAnswers((prev) => ({ ...prev, hecsAmount: value }));
  }, []);

  const setDebts = useCallback((debts: DebtEntry[]) => {
    setAnswers((prev) => ({ ...prev, debts }));
  }, []);

  const setJobHunting = useCallback((value: JobHuntingStatus) => {
    setAnswers((prev) => ({ ...prev, jobHunting: value }));
  }, []);

  const setState = useCallback((value: AustralianState) => {
    setAnswers((prev) => ({ ...prev, state: value }));
  }, []);

  const setAnnualSalary = useCallback((value: number | undefined) => {
    setAnswers((prev) => ({ ...prev, annualSalary: value }));
  }, []);

  const setWorkFromHome = useCallback((value: WorkFromHome) => {
    setAnswers((prev) => ({ ...prev, workFromHome: value }));
  }, []);

  const setWorkFromHomeHours = useCallback((value: number | undefined) => {
    setAnswers((prev) => ({ ...prev, workFromHomeHours: value }));
  }, []);

  const setCarForWork = useCallback((value: CarForWork) => {
    setAnswers((prev) => {
      const next = { ...prev, carForWork: value };
      if (value === "no") {
        delete next.estimatedWorkKms;
        delete next.annualKms;
        delete next.hasNovatedLease;
      }
      return next;
    });
  }, []);

  const setNovatedLease = useCallback((value: NovatedLeaseStatus) => {
    setAnswers((prev) => ({ ...prev, hasNovatedLease: value }));
  }, []);

  const setEstimatedWorkKms = useCallback((value: number | undefined) => {
    setAnswers((prev) => ({ ...prev, estimatedWorkKms: value }));
  }, []);

  const setAnnualKms = useCallback((value: AnnualKmsRange) => {
    setAnswers((prev) => ({ ...prev, annualKms: value }));
  }, []);

  const setPrivateHealth = useCallback((value: PrivateHealthInsurance) => {
    setAnswers((prev) => ({ ...prev, privateHealth: value }));
  }, []);

  const setBusinessDeductions = useCallback((value: BusinessDeductions) => {
    setAnswers((prev) => ({ ...prev, businessDeductions: value }));
  }, []);

  const setHousingStatus = useCallback((value: HousingStatus) => {
    setAnswers((prev) => ({ ...prev, housingStatus: value }));
  }, []);

  const setWeeklyRent = useCallback((value: number | undefined) => {
    setAnswers((prev) => ({ ...prev, weeklyRent: value }));
  }, []);

  const setAgeRange = useCallback((value: AgeRange) => {
    setAnswers((prev) => ({ ...prev, ageRange: value }));
  }, []);

  const setFamilyStatus = useCallback((value: FamilyStatus) => {
    setAnswers((prev) => ({ ...prev, familyStatus: value }));
  }, []);

  // ─── Submit ───────────────────────────────────────────────────────────────

  const startGeneration = useCallback(async () => {
    setIsSubmitting(true);
    setLoadingMessageIndex(0);
    setElapsedSeconds(0);
    setError(null);
    setErrorPermanent(false);
    setRetryRegenerates(false);
    setWasInterrupted(false);
    wentHiddenRef.current = false;
    setInflightFlag(true);

    // Declared OUTSIDE the try so the catch can consult it: a stream failure
    // that arrives AFTER the terminal frame was handled (TCP reset behind the
    // final data packet, suspension between the report frame and clean EOF)
    // must not poison already-delivered state.
    let sawTerminalEvent = false;

    // Liveness watchdog. If no bytes arrive for STREAM_STALE_MS, abort the
    // fetch; the rejection lands in the catch below, which already shows the
    // honest copy and offers one-tap regeneration.
    const controller = new AbortController();
    let lastEventAt = Date.now();
    const stalenessWatchdog = setInterval(() => {
      if (Date.now() - lastEventAt > STREAM_STALE_MS) {
        controller.abort();
      }
    }, STREAM_STALE_CHECK_MS);

    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
        signal: controller.signal,
      });

      const contentType = response.headers.get("content-type") ?? "";

      // Rate-limit and validation failures are still plain JSON, decided
      // before the server starts streaming. Handle them exactly as before.
      if (!contentType.includes("text/event-stream")) {
        if (response.status === 429) {
          setError(
            "You've used your 3 free reports today. Come back tomorrow!"
          );
          return;
        }

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          setError(
            data?.error ?? "Something went wrong generating your report. Please try again."
          );
          return;
        }

        // Plain JSON success: an older deploy still serving the pre-stream
        // shape during rollout.
        const data = await response.json();
        setReport(data);
        clearStoredAnswers();
        return;
      }

      // SSE path: tick events while the server works, then a single terminal
      // report or error event.
      if (!response.body) {
        throw new Error("Streaming response had no body.");
      }

      const handleFrame = (frame: SseFrame): void => {
        if (frame.event === "tick") {
          try {
            const tick = JSON.parse(frame.data) as ReportStreamTickData;
            if (typeof tick.elapsedSeconds === "number") {
              // Server truth replaces the client-only timer; the local
              // interval keeps counting between ticks as a fallback.
              setElapsedSeconds(tick.elapsedSeconds);
            }
          } catch {
            // A malformed tick is harmless -- the local timer keeps going.
          }
        } else if (frame.event === "report") {
          const data = JSON.parse(frame.data) as ReportData;
          setReport(data);
          clearStoredAnswers();
          sawTerminalEvent = true;
        } else if (frame.event === "error") {
          let message =
            "Something went wrong generating your report. Please try again.";
          let permanent = false;
          try {
            const payload = JSON.parse(frame.data) as ReportStreamErrorData;
            if (typeof payload.error === "string" && payload.error) {
              message = payload.error;
            }
            permanent = payload.permanent === true;
          } catch {
            // Fall through to the generic message.
          }
          setError(message);
          setErrorPermanent(permanent);
          sawTerminalEvent = true;
        }
      };

      const reader = response.body.getReader();
      // Streaming mode: the decoder buffers multi-byte UTF-8 split across
      // chunk boundaries; the parser buffers frames split across chunks.
      const decoder = new TextDecoder();
      const parser = new SseFrameParser();

      // Stream open counts as liveness; every arriving chunk refreshes it.
      lastEventAt = Date.now();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        lastEventAt = Date.now();
        for (const frame of parser.push(
          decoder.decode(value, { stream: true })
        )) {
          handleFrame(frame);
        }
      }
      // Flush anything the decoder or parser still holds.
      for (const frame of parser.push(decoder.decode())) {
        handleFrame(frame);
      }

      if (!sawTerminalEvent) {
        // The stream died before a result arrived (network drop, page
        // suspension) -- surface it through the catch below.
        throw new Error("Stream ended before a result arrived.");
      }
    } catch {
      // A failure AFTER the terminal frame was already handled (report
      // delivered, or a server-classified error shown) must not overwrite
      // that state with retryable connection copy. The finally still runs.
      if (sawTerminalEvent) return;
      // The request or stream died client-side. If the page went hidden during
      // the wait, say so honestly instead of blaming the connection. Either
      // way the answers are saved and a single tap retries.
      setError(
        wentHiddenRef.current
          ? "It looks like your phone locked or switched apps while your report was generating, so the connection dropped. Your answers are saved. Tap Try again to generate your report."
          : "Could not connect to the server. Check your internet connection and try again."
      );
      setErrorPermanent(false);
      setRetryRegenerates(true);
    } finally {
      clearInterval(stalenessWatchdog);
      setIsSubmitting(false);
      setInflightFlag(false);
    }
  }, [answers]);

  const handleSubmit = useCallback(() => {
    if (!isCurrentStepValid) return;
    void startGeneration();
  }, [isCurrentStepValid, startGeneration]);

  // ─── Loading State ────────────────────────────────────────────────────────

  if (isSubmitting) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <Spinner size="lg" />
        <p className="mt-6 text-lg font-medium text-text-primary text-center font-[family-name:var(--font-heading)]">
          {LOADING_MESSAGES[loadingMessageIndex]}
        </p>
        <p className="mt-2 text-sm text-text-muted text-center">
          This usually takes about a minute. Please keep this page open.
        </p>
        {elapsedSeconds >= 20 && (
          <p className="mt-1 text-xs text-text-muted text-center tabular-nums">
            {elapsedSeconds}s elapsed
            {elapsedSeconds >= 90 && " - still working, hang tight"}
          </p>
        )}
      </div>
    );
  }

  // ─── Report State ─────────────────────────────────────────────────────────

  if (report) {
    return (
      <ReportView
        data={report}
        onReset={() => {
          setReport(null);
          setAnswers(INITIAL_ANSWERS);
          setCurrentStepIndex(0);
          // A late stream failure can never poison this screen now, but clear
          // error state anyway so Start over always lands on the
          // questionnaire, not a stale "Something went wrong".
          setError(null);
          setErrorPermanent(false);
          setRetryRegenerates(false);
          clearStoredAnswers();
          scrollToTop();
        }}
      />
    );
  }

  // ─── Error State ──────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center px-4 text-center">
        <div className="rounded-full bg-red-50 p-4 mb-4">
          <svg
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-text-primary font-[family-name:var(--font-heading)] mb-2">
          Something went wrong
        </h2>
        <p className="text-text-secondary mb-6 max-w-md">{error}</p>
        <Button
          onClick={() => {
            setError(null);
            setErrorPermanent(false);
            if (retryRegenerates) {
              setRetryRegenerates(false);
              void startGeneration();
            }
          }}
        >
          {/* A permanent outage must not invite a retry that cannot succeed. */}
          {errorPermanent ? "Back to my answers" : "Try again"}
        </Button>
      </div>
    );
  }

  // ─── Interrupted State (reload during generation) ─────────────────────────

  if (wasInterrupted) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center px-4 text-center">
        <div className="rounded-full bg-amber-50 p-4 mb-4">
          <svg
            className="h-8 w-8 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-text-primary font-[family-name:var(--font-heading)] mb-2">
          Your report was interrupted
        </h2>
        <p className="text-text-secondary mb-6 max-w-md">
          The page closed or reloaded while your report was generating. Your
          answers are saved, so you can generate it again without starting
          over.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button
            onClick={() => {
              void startGeneration();
            }}
            size="lg"
          >
            Generate my report
          </Button>
          <Button
            variant="secondary"
            onClick={() => setWasInterrupted(false)}
          >
            Review my answers
          </Button>
        </div>
      </div>
    );
  }

  // ─── Questionnaire ────────────────────────────────────────────────────────

  return (
    <div ref={stepContainerRef}>
      {/* Progress */}
      <ProgressBar
        currentStep={currentStepIndex + 1}
        totalSteps={totalSteps}
        label={STEP_LABELS[currentStep]}
        className="mb-8"
      />

      {/* Current Step */}
      <div className="min-h-[320px]">
        {currentStep === "employment" && (
          <StepEmployment
            value={answers.employment}
            onChange={setEmployment}
          />
        )}
        {currentStep === "salary" && (
          <StepSalary
            annualSalary={answers.annualSalary}
            onChange={setAnnualSalary}
          />
        )}
        {currentStep === "abn" && (
          <StepABN
            abnStatus={answers.abnStatus}
            annualRevenue={answers.annualRevenue}
            onChangeABN={setABNStatus}
            onChangeRevenue={setAnnualRevenue}
          />
        )}
        {currentStep === "gst" && (
          <StepGST value={answers.gstStatus} onChange={setGSTStatus} />
        )}
        {currentStep === "work_from_home" && (
          <StepWorkFromHome
            workFromHome={answers.workFromHome}
            onChange={setWorkFromHome}
            workFromHomeHours={answers.workFromHomeHours}
            onHoursChange={setWorkFromHomeHours}
          />
        )}
        {currentStep === "car_for_work" && (
          <StepCarForWork
            carForWork={answers.carForWork}
            onChange={setCarForWork}
            estimatedWorkKms={answers.estimatedWorkKms}
            onKmsChange={setEstimatedWorkKms}
            annualKms={answers.annualKms}
            onAnnualKmsChange={setAnnualKms}
            hasNovatedLease={answers.hasNovatedLease}
            onNovatedLeaseChange={setNovatedLease}
            showNovatedLeaseQuestion={
              answers.employment === "employee" || answers.employment === "both"
            }
          />
        )}
        {currentStep === "health_insurance" && (
          <StepHealthInsurance
            privateHealth={answers.privateHealth}
            onChange={setPrivateHealth}
          />
        )}
        {currentStep === "business_deductions" && (
          <StepBusinessDeductions
            deductions={answers.businessDeductions}
            onChange={setBusinessDeductions}
          />
        )}
        {currentStep === "hecs" && (
          <StepHECS
            hecsDebt={answers.hecsDebt}
            hecsAmount={answers.hecsAmount}
            onChangeDebt={setHECSDebt}
            onChangeAmount={setHECSAmount}
          />
        )}
        {currentStep === "debt" && (
          <StepPersonalDebt
            debts={answers.debts ?? []}
            onChange={setDebts}
          />
        )}
        {currentStep === "housing" && (
          <StepHousing
            housingStatus={answers.housingStatus}
            onChange={setHousingStatus}
            weeklyRent={answers.weeklyRent}
            onRentChange={setWeeklyRent}
          />
        )}
        {currentStep === "life_situation" && (
          <StepLifeSituation
            ageRange={answers.ageRange}
            onAgeChange={setAgeRange}
            familyStatus={answers.familyStatus}
            onFamilyChange={setFamilyStatus}
          />
        )}
        {currentStep === "job_hunting" && (
          <StepJobHunting
            value={answers.jobHunting}
            onChange={setJobHunting}
          />
        )}
        {currentStep === "state" && (
          <StepState value={answers.state} onChange={setState} />
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-4">
        {!isFirstStep ? (
          <Button variant="secondary" onClick={goBack}>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Back
          </Button>
        ) : (
          <div />
        )}

        {isLastStep ? (
          <Button
            onClick={handleSubmit}
            disabled={!isCurrentStepValid}
            size="lg"
          >
            Get My Report
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
              />
            </svg>
          </Button>
        ) : (
          <Button onClick={goNext} disabled={!isCurrentStepValid}>
            Next
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </Button>
        )}
      </div>

      {/* Disclaimer */}
      <Disclaimer className="mt-8" />
    </div>
  );
}
