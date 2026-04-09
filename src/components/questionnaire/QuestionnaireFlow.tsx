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
  "Checking ATO rates for 2025-26...",
  "Finding deductions you might be missing...",
  "Looking up state-specific benefits...",
  "Building your personalised report...",
  "Almost there...",
];

// ─── Initial State ────────────────────────────────────────────────────────────

const INITIAL_ANSWERS: Partial<QuestionnaireAnswers> = {
  debts: [],
};

// ─── Component ────────────────────────────────────────────────────────────────

export function QuestionnaireFlow() {
  // Answer state
  const [answers, setAnswers] =
    useState<Partial<QuestionnaireAnswers>>(INITIAL_ANSWERS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Submit/report state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);

  const stepContainerRef = useRef<HTMLDivElement>(null);

  // Rotate loading messages while submitting
  useEffect(() => {
    if (!isSubmitting) return;
    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) =>
        prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [isSubmitting]);

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
      }
      return next;
    });
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

  const handleSubmit = useCallback(async () => {
    if (!isCurrentStepValid) return;

    setIsSubmitting(true);
    setLoadingMessageIndex(0);
    setError(null);

    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

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

      const data = await response.json();
      setReport(data);
    } catch {
      setError(
        "Could not connect to the server. Check your internet connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, isCurrentStepValid]);

  // ─── Loading State ────────────────────────────────────────────────────────

  if (isSubmitting) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <Spinner size="lg" />
        <p className="mt-6 text-lg font-medium text-text-primary text-center font-[family-name:var(--font-heading)]">
          {LOADING_MESSAGES[loadingMessageIndex]}
        </p>
        <p className="mt-2 text-sm text-text-muted text-center">
          This usually takes 10-15 seconds
        </p>
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
          }}
        >
          Try again
        </Button>
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
