"use client";

import { useState, useCallback, useMemo } from "react";
import type { DebtType, DebtEntry } from "@/types/questionnaire";

type StepPersonalDebtProps = {
  debts: DebtEntry[];
  onChange: (debts: DebtEntry[]) => void;
};

const debtOptions: { value: DebtType; label: string }[] = [
  { value: "credit_card", label: "Credit card" },
  { value: "car_loan", label: "Car loan" },
  { value: "personal_loan", label: "Personal loan" },
  { value: "afterpay_bnpl", label: "Afterpay / BNPL" },
];

function formatDollar(value: string): string {
  const num = value.replace(/[^0-9]/g, "");
  if (!num) return "";
  return Number(num).toLocaleString("en-AU");
}

export function StepPersonalDebt({ debts, onChange }: StepPersonalDebtProps) {
  const [displays, setDisplays] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const d of debts) {
      if (d.amount != null) {
        init[d.type] = formatDollar(String(d.amount));
      }
    }
    return init;
  });

  const hasNone = debts.length === 0;
  const selectedTypes = useMemo(() => new Set(debts.map((d) => d.type)), [debts]);

  const toggleDebt = useCallback(
    (type: DebtType) => {
      if (selectedTypes.has(type)) {
        onChange(debts.filter((d) => d.type !== type));
        setDisplays((prev) => {
          const next = { ...prev };
          delete next[type];
          return next;
        });
      } else {
        onChange([...debts, { type }]);
      }
    },
    [debts, onChange, selectedTypes]
  );

  const selectNone = useCallback(() => {
    onChange([]);
    setDisplays({});
  }, [onChange]);

  const handleAmountChange = useCallback(
    (type: DebtType, rawValue: string) => {
      const raw = rawValue.replace(/[^0-9]/g, "");
      setDisplays((prev) => ({ ...prev, [type]: formatDollar(raw) }));
      onChange(
        debts.map((d) =>
          d.type === type ? { ...d, amount: raw ? Number(raw) : undefined } : d
        )
      );
    },
    [debts, onChange]
  );

  return (
    <fieldset>
      <legend className="mb-2 text-2xl font-semibold font-[family-name:var(--font-heading)] text-text-primary">
        Do you have any of these debts?
      </legend>
      <p className="mb-6 text-sm text-text-secondary">
        Select all that apply. Amounts are optional but help us give better
        advice.
      </p>
      <div className="flex flex-col gap-3" role="group" aria-label="Personal debts">
        {debtOptions.map((option) => {
          const isChecked = selectedTypes.has(option.value);
          return (
            <div key={option.value}>
              <label
                className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-colors duration-150 ${
                  isChecked
                    ? "border-green bg-green-light"
                    : "border-border bg-bg-elevated hover:border-green/40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleDebt(option.value)}
                  className="h-5 w-5 shrink-0 rounded accent-green"
                  aria-label={option.label}
                />
                <span className="text-base font-semibold text-text-primary">
                  {option.label}
                </span>
              </label>

              {isChecked && (
                <div className="mt-2 ml-9 mr-4 mb-1">
                  <label
                    htmlFor={`debt-amount-${option.value}`}
                    className="sr-only"
                  >
                    {option.label} amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-medium">
                      $
                    </span>
                    <input
                      id={`debt-amount-${option.value}`}
                      type="text"
                      inputMode="numeric"
                      value={displays[option.value] ?? ""}
                      onChange={(e) =>
                        handleAmountChange(option.value, e.target.value)
                      }
                      placeholder="Amount owed (optional)"
                      className="w-full rounded-lg border border-border bg-bg-elevated py-2.5 pl-8 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20 transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <label
          className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-colors duration-150 ${
            hasNone
              ? "border-green bg-green-light"
              : "border-border bg-bg-elevated hover:border-green/40"
          }`}
        >
          <input
            type="checkbox"
            checked={hasNone}
            onChange={selectNone}
            className="h-5 w-5 shrink-0 rounded accent-green"
            aria-label="No debts"
          />
          <span className="text-base font-semibold text-text-primary">
            None of the above
          </span>
        </label>
      </div>
    </fieldset>
  );
}
