"use client";

import { getStateOptions } from "@/data/states";
import type { AustralianState as AustralianStateType } from "@/types/questionnaire";

type StepStateProps = {
  value: AustralianStateType | undefined;
  onChange: (value: AustralianStateType) => void;
};

const stateOptions = getStateOptions();

export function StepState({ value, onChange }: StepStateProps) {
  return (
    <fieldset>
      <legend className="mb-6 text-2xl font-semibold font-[family-name:var(--font-heading)] text-text-primary">
        Which state or territory do you live in?
      </legend>
      <p className="mb-4 text-sm text-text-secondary">
        This helps us find state-specific benefits and concessions you might be
        eligible for.
      </p>
      <div className="relative">
        <label htmlFor="state-select" className="sr-only">
          State or territory
        </label>
        <select
          id="state-select"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value as AustralianStateType)}
          className="w-full appearance-none rounded-xl border-2 border-border bg-bg-elevated p-4 pr-12 text-base font-semibold text-text-primary transition-colors duration-150 focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20 cursor-pointer"
          aria-label="Select your state or territory"
        >
          <option value="" disabled>
            Select your state...
          </option>
          {stateOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>

      {value && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stateOptions.map((option) => {
            const isSelected = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value as AustralianStateType)}
                className={`rounded-lg border-2 px-3 py-3 text-center text-sm font-semibold transition-colors duration-150 cursor-pointer ${
                  isSelected
                    ? "border-green bg-green-light text-green-dark"
                    : "border-border bg-bg-elevated text-text-secondary hover:border-green/40"
                }`}
                aria-pressed={isSelected}
              >
                {option.value}
              </button>
            );
          })}
        </div>
      )}

      {!value && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stateOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value as AustralianStateType)}
              className="rounded-lg border-2 border-border bg-bg-elevated px-3 py-3 text-center text-sm font-semibold text-text-secondary transition-colors duration-150 hover:border-green/40 cursor-pointer"
              aria-pressed={false}
            >
              {option.value}
            </button>
          ))}
        </div>
      )}
    </fieldset>
  );
}
