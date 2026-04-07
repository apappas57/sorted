"use client";

import { useState, useCallback } from "react";
import type { HECSStatus } from "@/types/questionnaire";

type StepHECSProps = {
  hecsDebt: HECSStatus | undefined;
  hecsAmount: number | undefined;
  onChangeDebt: (value: HECSStatus) => void;
  onChangeAmount: (value: number | undefined) => void;
};

const options: { value: HECSStatus; label: string; description: string }[] = [
  {
    value: "yes",
    label: "Yes, I have a HELP loan",
    description: "HECS-HELP, FEE-HELP, VET Student, or SA-HELP",
  },
  {
    value: "no",
    label: "No",
    description: "No outstanding study loan",
  },
  {
    value: "unsure",
    label: "I'm not sure",
    description: "We'll factor in the possibility",
  },
];

function formatDollar(value: string): string {
  const num = value.replace(/[^0-9]/g, "");
  if (!num) return "";
  return Number(num).toLocaleString("en-AU");
}

export function StepHECS({
  hecsDebt,
  hecsAmount,
  onChangeDebt,
  onChangeAmount,
}: StepHECSProps) {
  const [amountDisplay, setAmountDisplay] = useState(
    hecsAmount != null ? formatDollar(String(hecsAmount)) : ""
  );

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, "");
      setAmountDisplay(formatDollar(raw));
      onChangeAmount(raw ? Number(raw) : undefined);
    },
    [onChangeAmount]
  );

  return (
    <fieldset>
      <legend className="mb-6 text-2xl font-semibold font-[family-name:var(--font-heading)] text-text-primary">
        Do you have a HECS-HELP or study loan?
      </legend>
      <div className="flex flex-col gap-3" role="radiogroup" aria-label="HECS-HELP debt status">
        {options.map((option) => {
          const isSelected = hecsDebt === option.value;
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
                name="hecsDebt"
                value={option.value}
                checked={isSelected}
                onChange={() => onChangeDebt(option.value)}
                className="mt-1 h-5 w-5 shrink-0 accent-green"
                aria-describedby={`hecs-${option.value}-desc`}
              />
              <div className="min-w-0">
                <span className="block text-base font-semibold text-text-primary">
                  {option.label}
                </span>
                <span
                  id={`hecs-${option.value}-desc`}
                  className="block text-sm text-text-secondary mt-0.5"
                >
                  {option.description}
                </span>
              </div>
            </label>
          );
        })}
      </div>

      {hecsDebt === "yes" && (
        <div className="mt-6 rounded-xl border border-border bg-bg-surface p-4">
          <label
            htmlFor="hecs-amount"
            className="block text-base font-semibold text-text-primary mb-2"
          >
            How much do you owe? (optional)
          </label>
          <p className="text-sm text-text-secondary mb-3">
            Check your myGov account for the exact amount, or give us a rough
            estimate.
          </p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-medium">
              $
            </span>
            <input
              id="hecs-amount"
              type="text"
              inputMode="numeric"
              value={amountDisplay}
              onChange={handleAmountChange}
              placeholder="e.g. 25,000"
              className="w-full rounded-lg border border-border bg-bg-elevated py-3 pl-8 pr-4 text-text-primary placeholder:text-text-muted focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20 transition-colors"
              aria-label="HECS-HELP loan amount in dollars"
            />
          </div>
        </div>
      )}
    </fieldset>
  );
}
