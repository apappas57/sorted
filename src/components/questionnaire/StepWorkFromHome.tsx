"use client";

import { useState, useCallback } from "react";
import type { WorkFromHome } from "@/types/questionnaire";

type StepWorkFromHomeProps = {
  workFromHome: WorkFromHome | undefined;
  onChange: (value: WorkFromHome) => void;
  workFromHomeHours: number | undefined;
  onHoursChange: (value: number | undefined) => void;
};

const options: { value: WorkFromHome; label: string; description: string }[] = [
  {
    value: "yes",
    label: "Yes, most days",
    description: "I work from home 3+ days per week",
  },
  {
    value: "sometimes",
    label: "Sometimes",
    description: "I work from home 1-2 days per week",
  },
  {
    value: "no",
    label: "No",
    description: "I work on-site or at a workplace",
  },
];

export function StepWorkFromHome({
  workFromHome,
  onChange,
  workFromHomeHours,
  onHoursChange,
}: StepWorkFromHomeProps) {
  const [hoursDisplay, setHoursDisplay] = useState(
    workFromHomeHours != null ? String(workFromHomeHours) : ""
  );

  const showHours = workFromHome === "yes" || workFromHome === "sometimes";

  const handleHoursChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, "");
      setHoursDisplay(raw);
      onHoursChange(raw ? Number(raw) : undefined);
    },
    [onHoursChange]
  );

  return (
    <fieldset>
      <legend className="mb-6 text-2xl font-semibold font-[family-name:var(--font-heading)] text-text-primary">
        Do you work from home?
      </legend>
      <div className="flex flex-col gap-3" role="radiogroup" aria-label="Work from home status">
        {options.map((option) => {
          const isSelected = workFromHome === option.value;
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
                name="workFromHome"
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="mt-1 h-5 w-5 shrink-0 accent-green"
                aria-describedby={`wfh-${option.value}-desc`}
              />
              <div className="min-w-0">
                <span className="block text-base font-semibold text-text-primary">
                  {option.label}
                </span>
                <span
                  id={`wfh-${option.value}-desc`}
                  className="block text-sm text-text-secondary mt-0.5"
                >
                  {option.description}
                </span>
              </div>
            </label>
          );
        })}
      </div>

      {showHours && (
        <div className="mt-6 rounded-xl border border-border bg-bg-surface p-4">
          <label
            htmlFor="wfh-hours"
            className="block text-base font-semibold text-text-primary mb-2"
          >
            How many hours per week do you work from home?
          </label>
          <p className="text-sm text-text-secondary mb-3">
            This helps calculate your home office deduction. The ATO allows $0.67 per hour.
          </p>
          <input
            id="wfh-hours"
            type="text"
            inputMode="numeric"
            value={hoursDisplay}
            onChange={handleHoursChange}
            placeholder="e.g. 20"
            className="w-full rounded-lg border border-border bg-bg-elevated py-3 px-4 text-text-primary placeholder:text-text-muted focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20 transition-colors"
            aria-label="Hours per week working from home"
          />
        </div>
      )}
    </fieldset>
  );
}
