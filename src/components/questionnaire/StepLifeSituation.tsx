"use client";

import type { AgeRange, FamilyStatus } from "@/types/questionnaire";

type StepLifeSituationProps = {
  ageRange: AgeRange | undefined;
  onAgeChange: (value: AgeRange) => void;
  familyStatus: FamilyStatus | undefined;
  onFamilyChange: (value: FamilyStatus) => void;
};

const ageOptions: { value: AgeRange; label: string }[] = [
  { value: "18-29", label: "18-29" },
  { value: "30-39", label: "30-39" },
  { value: "40-49", label: "40-49" },
  { value: "50-59", label: "50-59" },
  { value: "60+", label: "60+" },
];

const familyOptions: {
  value: FamilyStatus;
  label: string;
}[] = [
  { value: "single", label: "Single" },
  { value: "partner_no_kids", label: "Partner, no kids" },
  { value: "partner_with_kids", label: "Partner with kids" },
  { value: "single_parent", label: "Single parent" },
];

export function StepLifeSituation({
  ageRange,
  onAgeChange,
  familyStatus,
  onFamilyChange,
}: StepLifeSituationProps) {
  return (
    <div className="flex flex-col gap-8">
      <fieldset>
        <legend className="mb-4 text-2xl font-semibold font-[family-name:var(--font-heading)] text-text-primary">
          What&apos;s your age range?
        </legend>
        <div
          className="flex flex-wrap gap-2"
          role="radiogroup"
          aria-label="Age range"
        >
          {ageOptions.map((option) => {
            const isSelected = ageRange === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-2 rounded-xl border-2 px-4 py-2.5 transition-colors duration-150 ${
                  isSelected
                    ? "border-green bg-green-light"
                    : "border-border bg-bg-elevated hover:border-green/40"
                }`}
              >
                <input
                  type="radio"
                  name="ageRange"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => onAgeChange(option.value)}
                  className="h-4 w-4 shrink-0 accent-green"
                />
                <span className="text-sm font-semibold text-text-primary">
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="border-t border-border" aria-hidden="true" />

      <fieldset>
        <legend className="mb-4 text-2xl font-semibold font-[family-name:var(--font-heading)] text-text-primary">
          What&apos;s your family situation?
        </legend>
        <div
          className="flex flex-col gap-3"
          role="radiogroup"
          aria-label="Family status"
        >
          {familyOptions.map((option) => {
            const isSelected = familyStatus === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-colors duration-150 ${
                  isSelected
                    ? "border-green bg-green-light"
                    : "border-border bg-bg-elevated hover:border-green/40"
                }`}
              >
                <input
                  type="radio"
                  name="familyStatus"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => onFamilyChange(option.value)}
                  className="h-5 w-5 shrink-0 accent-green"
                />
                <span className="text-base font-semibold text-text-primary">
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <p className="text-sm text-text-secondary">
        This helps identify age-specific schemes (like First Home Super Saver
        for under-40s) and family benefits.
      </p>
    </div>
  );
}
