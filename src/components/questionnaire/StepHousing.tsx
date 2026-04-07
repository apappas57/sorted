"use client";

import { useState, useCallback } from "react";
import type { HousingStatus } from "@/types/questionnaire";

type StepHousingProps = {
  housingStatus: HousingStatus | undefined;
  onChange: (value: HousingStatus) => void;
  weeklyRent: number | undefined;
  onRentChange: (value: number | undefined) => void;
};

const options: {
  value: HousingStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "renting",
    label: "Renting",
    description: "I rent my home",
  },
  {
    value: "mortgage",
    label: "Paying a mortgage",
    description: "I own my home and have a mortgage",
  },
  {
    value: "neither",
    label: "Neither",
    description: "Living with family, employer housing, or other",
  },
];

function formatDollar(value: string): string {
  const num = value.replace(/[^0-9]/g, "");
  if (!num) return "";
  return Number(num).toLocaleString("en-AU");
}

export function StepHousing({
  housingStatus,
  onChange,
  weeklyRent,
  onRentChange,
}: StepHousingProps) {
  const [rentDisplay, setRentDisplay] = useState(
    weeklyRent != null ? formatDollar(String(weeklyRent)) : ""
  );

  const handleRentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, "");
      setRentDisplay(formatDollar(raw));
      onRentChange(raw ? Number(raw) : undefined);
    },
    [onRentChange]
  );

  return (
    <fieldset>
      <legend className="mb-6 text-2xl font-semibold font-[family-name:var(--font-heading)] text-text-primary">
        What&apos;s your housing situation?
      </legend>
      <div
        className="flex flex-col gap-3"
        role="radiogroup"
        aria-label="Housing status"
      >
        {options.map((option) => {
          const isSelected = housingStatus === option.value;
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
                name="housingStatus"
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="mt-1 h-5 w-5 shrink-0 accent-green"
                aria-describedby={`housing-${option.value}-desc`}
              />
              <div className="min-w-0">
                <span className="block text-base font-semibold text-text-primary">
                  {option.label}
                </span>
                <span
                  id={`housing-${option.value}-desc`}
                  className="block text-sm text-text-secondary mt-0.5"
                >
                  {option.description}
                </span>
              </div>
            </label>
          );
        })}
      </div>

      {housingStatus === "renting" && (
        <div className="mt-6 rounded-xl border border-border bg-bg-surface p-4">
          <label
            htmlFor="weekly-rent"
            className="block text-base font-semibold text-text-primary mb-2"
          >
            How much rent do you pay per week?
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-medium">
              $
            </span>
            <input
              id="weekly-rent"
              type="text"
              inputMode="numeric"
              value={rentDisplay}
              onChange={handleRentChange}
              placeholder="e.g. 400"
              className="w-full rounded-lg border border-border bg-bg-elevated py-3 pl-8 pr-4 text-text-primary placeholder:text-text-muted focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20 transition-colors"
              aria-label="Weekly rent in dollars"
            />
          </div>
        </div>
      )}

      <p className="mt-4 text-sm text-text-secondary">
        This helps check if you&apos;re eligible for Commonwealth Rent
        Assistance or First Home Buyer schemes.
      </p>
    </fieldset>
  );
}
