"use client";

import { useState, useCallback } from "react";
import type { ABNStatus } from "@/types/questionnaire";

type StepABNProps = {
  abnStatus: ABNStatus | undefined;
  annualRevenue: number | undefined;
  onChangeABN: (value: ABNStatus) => void;
  onChangeRevenue: (value: number | undefined) => void;
};

const options: { value: ABNStatus; label: string; description: string }[] = [
  {
    value: "has_abn",
    label: "Yes, I have an ABN",
    description: "Registered Australian Business Number",
  },
  {
    value: "side_income_no_abn",
    label: "I earn side income but no ABN",
    description: "Freelance, gig work, or cash jobs without an ABN",
  },
  {
    value: "no",
    label: "No",
    description: "No business income or side earnings",
  },
];

function formatDollar(value: string): string {
  const num = value.replace(/[^0-9]/g, "");
  if (!num) return "";
  return Number(num).toLocaleString("en-AU");
}

export function StepABN({
  abnStatus,
  annualRevenue,
  onChangeABN,
  onChangeRevenue,
}: StepABNProps) {
  const [revenueDisplay, setRevenueDisplay] = useState(
    annualRevenue != null ? formatDollar(String(annualRevenue)) : ""
  );

  const showRevenue =
    abnStatus === "has_abn" || abnStatus === "side_income_no_abn";

  const handleRevenueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, "");
      setRevenueDisplay(formatDollar(raw));
      onChangeRevenue(raw ? Number(raw) : undefined);
    },
    [onChangeRevenue]
  );

  return (
    <fieldset>
      <legend className="mb-6 text-2xl font-semibold font-[family-name:var(--font-heading)] text-text-primary">
        Do you have an ABN or earn side income?
      </legend>
      <div className="flex flex-col gap-3" role="radiogroup" aria-label="ABN status">
        {options.map((option) => {
          const isSelected = abnStatus === option.value;
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
                name="abnStatus"
                value={option.value}
                checked={isSelected}
                onChange={() => onChangeABN(option.value)}
                className="mt-1 h-5 w-5 shrink-0 accent-green"
                aria-describedby={`abn-${option.value}-desc`}
              />
              <div className="min-w-0">
                <span className="block text-base font-semibold text-text-primary">
                  {option.label}
                </span>
                <span
                  id={`abn-${option.value}-desc`}
                  className="block text-sm text-text-secondary mt-0.5"
                >
                  {option.description}
                </span>
              </div>
            </label>
          );
        })}
      </div>

      {showRevenue && (
        <div className="mt-6 rounded-xl border border-border bg-bg-surface p-4">
          <label
            htmlFor="annual-revenue"
            className="block text-base font-semibold text-text-primary mb-2"
          >
            Roughly how much do you earn per year through this?
          </label>
          <p className="text-sm text-text-secondary mb-3">
            An estimate is fine. This helps us calculate your tax obligations.
          </p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-medium">
              $
            </span>
            <input
              id="annual-revenue"
              type="text"
              inputMode="numeric"
              value={revenueDisplay}
              onChange={handleRevenueChange}
              placeholder="e.g. 45,000"
              className="w-full rounded-lg border border-border bg-bg-elevated py-3 pl-8 pr-4 text-text-primary placeholder:text-text-muted focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20 transition-colors"
              aria-label="Annual revenue in dollars"
            />
          </div>
        </div>
      )}
    </fieldset>
  );
}
