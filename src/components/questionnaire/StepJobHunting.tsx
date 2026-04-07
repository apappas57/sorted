"use client";

import type { JobHuntingStatus } from "@/types/questionnaire";

type StepJobHuntingProps = {
  value: JobHuntingStatus | undefined;
  onChange: (value: JobHuntingStatus) => void;
};

const options: {
  value: JobHuntingStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "actively",
    label: "Yes, actively looking",
    description: "Currently applying for jobs or interviewing",
  },
  {
    value: "casually",
    label: "Keeping an eye out",
    description: "Open to the right opportunity but not urgently searching",
  },
  {
    value: "no",
    label: "No",
    description: "Happy where I am or not looking right now",
  },
];

export function StepJobHunting({ value, onChange }: StepJobHuntingProps) {
  return (
    <fieldset>
      <legend className="mb-6 text-2xl font-semibold font-[family-name:var(--font-heading)] text-text-primary">
        Are you currently looking for work?
      </legend>
      <div className="flex flex-col gap-3" role="radiogroup" aria-label="Job hunting status">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-colors duration-150 ${
                isSelected
                  ? "border-green bg-green-light"
                  : "border-border bg-bg-elevated hover:border-green/40"
              }`}
            >
              <input
                type="radio"
                name="jobHunting"
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="mt-1 h-5 w-5 shrink-0 accent-green"
                aria-describedby={`job-${option.value}-desc`}
              />
              <div className="min-w-0">
                <span className="block text-base font-semibold text-text-primary">
                  {option.label}
                </span>
                <span
                  id={`job-${option.value}-desc`}
                  className="block text-sm text-text-secondary mt-0.5"
                >
                  {option.description}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
