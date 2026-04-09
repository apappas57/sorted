"use client";

import { useState, useCallback } from "react";
import type { CarForWork, AnnualKmsRange } from "@/types/questionnaire";

type StepCarForWorkProps = {
  carForWork: CarForWork | undefined;
  onChange: (value: CarForWork) => void;
  estimatedWorkKms: number | undefined;
  onKmsChange: (value: number | undefined) => void;
  annualKms: AnnualKmsRange | undefined;
  onAnnualKmsChange: (value: AnnualKmsRange) => void;
};

const options: { value: CarForWork; label: string; description: string }[] = [
  {
    value: "yes",
    label: "Yes",
    description: "I drive to client sites, between offices, or for work errands",
  },
  {
    value: "no",
    label: "No",
    description: "I don't use my car for work purposes",
  },
];

const annualKmsOptions: {
  value: AnnualKmsRange;
  label: string;
  description: string;
}[] = [
  {
    value: "under_5000",
    label: "Under 5,000 km",
    description: "Mostly work from home or public transport",
  },
  {
    value: "5000_15000",
    label: "5,000 - 15,000 km",
    description: "Average city driving",
  },
  {
    value: "15000_25000",
    label: "15,000 - 25,000 km",
    description: "Regular commuter or mixed city/regional",
  },
  {
    value: "25000_40000",
    label: "25,000 - 40,000 km",
    description: "Typical for tradies and field workers",
  },
  {
    value: "over_40000",
    label: "Over 40,000 km",
    description: "Heavy road use, regional or multi-site work",
  },
];

function formatNumber(value: string): string {
  const num = value.replace(/[^0-9]/g, "");
  if (!num) return "";
  return Number(num).toLocaleString("en-AU");
}

export function StepCarForWork({
  carForWork,
  onChange,
  estimatedWorkKms,
  onKmsChange,
  annualKms,
  onAnnualKmsChange,
}: StepCarForWorkProps) {
  const [kmsDisplay, setKmsDisplay] = useState(
    estimatedWorkKms != null ? formatNumber(String(estimatedWorkKms)) : ""
  );

  const showKms = carForWork === "yes";

  const handleKmsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, "");
      setKmsDisplay(formatNumber(raw));
      onKmsChange(raw ? Number(raw) : undefined);
    },
    [onKmsChange]
  );

  return (
    <fieldset>
      <legend className="mb-6 text-2xl font-semibold font-[family-name:var(--font-heading)] text-text-primary">
        Do you use your own car for work-related travel?
      </legend>
      <p className="text-sm text-text-secondary mb-4">
        This doesn&apos;t include your regular commute to and from work.
      </p>
      <div className="flex flex-col gap-3" role="radiogroup" aria-label="Car for work status">
        {options.map((option) => {
          const isSelected = carForWork === option.value;
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
                name="carForWork"
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="mt-1 h-5 w-5 shrink-0 accent-green"
                aria-describedby={`car-${option.value}-desc`}
              />
              <div className="min-w-0">
                <span className="block text-base font-semibold text-text-primary">
                  {option.label}
                </span>
                <span
                  id={`car-${option.value}-desc`}
                  className="block text-sm text-text-secondary mt-0.5"
                >
                  {option.description}
                </span>
              </div>
            </label>
          );
        })}
      </div>

      {showKms && (
        <>
          {/* Annual total kilometres */}
          <div className="mt-6 rounded-xl border border-border bg-bg-surface p-4">
            <p className="text-base font-semibold text-text-primary mb-2">
              How many total kilometres do you drive per year?
            </p>
            <p className="text-sm text-text-secondary mb-3">
              Include all driving (work + personal). This helps estimate your
              total vehicle running costs for the logbook method.
            </p>
            <div
              className="flex flex-col gap-2"
              role="radiogroup"
              aria-label="Annual kilometres driven"
            >
              {annualKmsOptions.map((option) => {
                const isSelected = annualKms === option.value;
                return (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors duration-150 ${
                      isSelected
                        ? "border-green bg-green-light"
                        : "border-border bg-bg-elevated hover:border-green/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="annualKms"
                      value={option.value}
                      checked={isSelected}
                      onChange={() => onAnnualKmsChange(option.value)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-green"
                    />
                    <div className="min-w-0">
                      <span className="block text-sm font-semibold text-text-primary">
                        {option.label}
                      </span>
                      <span className="block text-xs text-text-secondary mt-0.5">
                        {option.description}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Work-related kilometres */}
          <div className="mt-4 rounded-xl border border-border bg-bg-surface p-4">
            <label
              htmlFor="work-kms"
              className="block text-base font-semibold text-text-primary mb-2"
            >
              Of those, roughly how many are work-related kilometres?
            </label>
            <p className="text-sm text-text-secondary mb-3">
              Driving to client sites, between jobs, picking up supplies -- not your
              regular commute. Tradies typically do 15,000-25,000 work km/year.
            </p>
            <div className="relative">
              <input
                id="work-kms"
                type="text"
                inputMode="numeric"
                value={kmsDisplay}
                onChange={handleKmsChange}
                placeholder="e.g. 20,000"
                className="w-full rounded-lg border border-border bg-bg-elevated py-3 px-4 text-text-primary placeholder:text-text-muted focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20 transition-colors"
                aria-label="Estimated work kilometres per year"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
                km
              </span>
            </div>
          </div>
        </>
      )}
    </fieldset>
  );
}
