"use client";

import type { PrivateHealthInsurance } from "@/types/questionnaire";

type StepHealthInsuranceProps = {
  privateHealth: PrivateHealthInsurance | undefined;
  onChange: (value: PrivateHealthInsurance) => void;
};

const options: {
  value: PrivateHealthInsurance;
  label: string;
  description: string;
}[] = [
  {
    value: "yes",
    label: "Yes",
    description: "I have hospital cover or extras cover",
  },
  {
    value: "no",
    label: "No",
    description: "I don't have any private health insurance",
  },
];

export function StepHealthInsurance({
  privateHealth,
  onChange,
}: StepHealthInsuranceProps) {
  return (
    <fieldset>
      <legend className="mb-6 text-2xl font-semibold font-[family-name:var(--font-heading)] text-text-primary">
        Do you have private health insurance?
      </legend>
      <div
        className="flex flex-col gap-3"
        role="radiogroup"
        aria-label="Private health insurance status"
      >
        {options.map((option) => {
          const isSelected = privateHealth === option.value;
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
                name="privateHealth"
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="mt-1 h-5 w-5 shrink-0 accent-green"
                aria-describedby={`health-${option.value}-desc`}
              />
              <div className="min-w-0">
                <span className="block text-base font-semibold text-text-primary">
                  {option.label}
                </span>
                <span
                  id={`health-${option.value}-desc`}
                  className="block text-sm text-text-secondary mt-0.5"
                >
                  {option.description}
                </span>
              </div>
            </label>
          );
        })}
      </div>

      <div
        className="mt-6 rounded-xl border border-info/20 bg-info/5 p-4"
        role="note"
      >
        <p className="text-sm text-text-secondary">
          If you earn over $93,000 and don&apos;t have private hospital cover,
          you may pay the Medicare Levy Surcharge (1-1.5% of your income). A
          basic policy might cost less than the surcharge.
        </p>
      </div>
    </fieldset>
  );
}
