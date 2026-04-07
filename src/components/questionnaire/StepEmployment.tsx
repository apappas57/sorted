"use client";

import type { EmploymentType } from "@/types/questionnaire";

type StepEmploymentProps = {
  value: EmploymentType | undefined;
  onChange: (value: EmploymentType) => void;
};

const options: { value: EmploymentType; label: string; description: string }[] =
  [
    {
      value: "employee",
      label: "Employee",
      description: "Full-time or part-time with an employer",
    },
    {
      value: "sole_trader",
      label: "Sole trader / Freelancer",
      description: "You run your own business or freelance",
    },
    {
      value: "both",
      label: "Employee with a side business",
      description: "You have a job and earn income on the side",
    },
    {
      value: "casual",
      label: "Casual worker",
      description: "Irregular or on-call work, no guaranteed hours",
    },
    {
      value: "not_working",
      label: "Not currently working",
      description: "Unemployed, studying, or between jobs",
    },
  ];

export function StepEmployment({ value, onChange }: StepEmploymentProps) {
  return (
    <fieldset>
      <legend className="mb-6 text-2xl font-semibold font-[family-name:var(--font-heading)] text-text-primary">
        What best describes your work situation?
      </legend>
      <div className="flex flex-col gap-3" role="radiogroup" aria-label="Employment type">
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
                name="employment"
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="mt-1 h-5 w-5 shrink-0 accent-green"
                aria-describedby={`employment-${option.value}-desc`}
              />
              <div className="min-w-0">
                <span className="block text-base font-semibold text-text-primary">
                  {option.label}
                </span>
                <span
                  id={`employment-${option.value}-desc`}
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
