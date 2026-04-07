"use client";

import { useState, useCallback } from "react";

type StepSalaryProps = {
  annualSalary: number | undefined;
  onChange: (value: number | undefined) => void;
};

function formatDollar(value: string): string {
  const num = value.replace(/[^0-9]/g, "");
  if (!num) return "";
  return Number(num).toLocaleString("en-AU");
}

export function StepSalary({ annualSalary, onChange }: StepSalaryProps) {
  const [salaryDisplay, setSalaryDisplay] = useState(
    annualSalary != null ? formatDollar(String(annualSalary)) : ""
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, "");
      setSalaryDisplay(formatDollar(raw));
      onChange(raw ? Number(raw) : undefined);
    },
    [onChange]
  );

  return (
    <fieldset>
      <legend className="mb-6 text-2xl font-semibold font-[family-name:var(--font-heading)] text-text-primary">
        What&apos;s your annual salary (before tax)?
      </legend>
      <p className="text-sm text-text-secondary mb-4">
        Your gross salary from your main job. Check your payslip or contract.
      </p>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-medium">
          $
        </span>
        <input
          id="annual-salary"
          type="text"
          inputMode="numeric"
          value={salaryDisplay}
          onChange={handleChange}
          placeholder="e.g. 75,000"
          className="w-full rounded-lg border border-border bg-bg-elevated py-3 pl-8 pr-4 text-lg text-text-primary placeholder:text-text-muted focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20 transition-colors"
          aria-label="Annual salary in dollars"
        />
      </div>
    </fieldset>
  );
}
