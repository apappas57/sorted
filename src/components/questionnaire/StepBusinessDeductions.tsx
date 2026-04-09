"use client";

import { useState, useCallback, useMemo } from "react";
import type { BusinessDeductions, HomeOfficeMethod } from "@/types/questionnaire";

type StepBusinessDeductionsProps = {
  deductions: BusinessDeductions | undefined;
  onChange: (value: BusinessDeductions) => void;
};

const DEFAULT_DEDUCTIONS: BusinessDeductions = {
  toolsAndEquipment: 0,
  technology: 0,
  vehicleExpenses: 0,
  homeOfficeMethod: "hours",
  homeOfficeHoursPerWeek: 0,
  subscriptions: 0,
  professionalDevelopment: 0,
  clothing: 0,
  otherDeductions: 0,
  totalAssetPurchases: 0,
};

type DeductionField = {
  key: keyof BusinessDeductions;
  label: string;
  helper: string;
  placeholder: string;
};

const DEDUCTION_FIELDS: DeductionField[] = [
  {
    key: "toolsAndEquipment",
    label: "Tools & Equipment",
    helper:
      "Power tools, hand tools, machinery, equipment under $20,000 each. These are instantly deductible.",
    placeholder: "e.g. 15,000",
  },
  {
    key: "technology",
    label: "Technology",
    helper:
      "Laptops, phones, tablets, monitors, printers, software subscriptions used for work",
    placeholder: "e.g. 3,000",
  },
  {
    key: "vehicleExpenses",
    label: "Vehicle Expenses",
    helper:
      "Loan repayments, insurance, registration, or other vehicle costs not already captured in the car step above",
    placeholder: "e.g. 5,000",
  },
  {
    key: "subscriptions",
    label: "Subscriptions & Memberships",
    helper:
      "Accounting software, cloud storage, industry memberships, trade licences, insurance premiums",
    placeholder: "e.g. 2,000",
  },
  {
    key: "professionalDevelopment",
    label: "Professional Development",
    helper:
      "Courses, certifications, conferences, training materials related to your current work",
    placeholder: "e.g. 1,500",
  },
  {
    key: "clothing",
    label: "Protective Clothing",
    helper:
      "Sun protection, steel-cap boots, hi-vis, uniforms with logos. NOT plain clothing.",
    placeholder: "e.g. 800",
  },
  {
    key: "otherDeductions",
    label: "Other Business Expenses",
    helper:
      "Advertising, office supplies, rent for business premises, or anything else not covered above",
    placeholder: "e.g. 1,000",
  },
];

function formatDollar(value: string): string {
  const num = value.replace(/[^0-9]/g, "");
  if (!num) return "";
  return Number(num).toLocaleString("en-AU");
}

export function StepBusinessDeductions({
  deductions,
  onChange,
}: StepBusinessDeductionsProps) {
  const current = deductions ?? DEFAULT_DEDUCTIONS;

  // Display state for each currency field
  const [displays, setDisplays] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const field of DEDUCTION_FIELDS) {
      const val = current[field.key] as number;
      init[field.key] = val > 0 ? formatDollar(String(val)) : "";
    }
    init.totalAssetPurchases =
      current.totalAssetPurchases > 0
        ? formatDollar(String(current.totalAssetPurchases))
        : "";
    init.homeOfficeHoursPerWeek =
      current.homeOfficeHoursPerWeek > 0
        ? String(current.homeOfficeHoursPerWeek)
        : "";
    return init;
  });

  const handleDollarChange = useCallback(
    (key: keyof BusinessDeductions, raw: string) => {
      const cleaned = raw.replace(/[^0-9]/g, "");
      setDisplays((prev) => ({ ...prev, [key]: formatDollar(cleaned) }));
      onChange({
        ...current,
        [key]: cleaned ? Number(cleaned) : 0,
      });
    },
    [current, onChange]
  );

  const handleMethodChange = useCallback(
    (method: HomeOfficeMethod) => {
      onChange({
        ...current,
        homeOfficeMethod: method,
      });
    },
    [current, onChange]
  );

  const handleHoursChange = useCallback(
    (raw: string) => {
      const cleaned = raw.replace(/[^0-9]/g, "");
      setDisplays((prev) => ({ ...prev, homeOfficeHoursPerWeek: cleaned }));
      onChange({
        ...current,
        homeOfficeHoursPerWeek: cleaned ? Number(cleaned) : 0,
      });
    },
    [current, onChange]
  );

  // Running total of instant write-off deductions
  const instantWriteOffTotal = useMemo(() => {
    return (
      (current.toolsAndEquipment || 0) +
      (current.technology || 0) +
      (current.vehicleExpenses || 0) +
      (current.subscriptions || 0) +
      (current.professionalDevelopment || 0) +
      (current.clothing || 0) +
      (current.otherDeductions || 0)
    );
  }, [current]);

  const homeOfficeEstimate = useMemo(() => {
    if (current.homeOfficeMethod === "hours" && current.homeOfficeHoursPerWeek > 0) {
      return current.homeOfficeHoursPerWeek * 48 * 0.67;
    }
    return 0;
  }, [current.homeOfficeMethod, current.homeOfficeHoursPerWeek]);

  const grandTotal = instantWriteOffTotal + homeOfficeEstimate;

  return (
    <fieldset>
      <legend className="mb-2 text-2xl font-semibold font-[family-name:var(--font-heading)] text-text-primary">
        Business Deductions
      </legend>
      <p className="text-sm text-text-secondary mb-6">
        Enter your approximate business expenses for the year. These reduce your
        taxable income. Estimates are fine.
      </p>

      <div className="flex flex-col gap-4">
        {/* Deduction input fields */}
        {DEDUCTION_FIELDS.map((field) => (
          <div
            key={field.key}
            className="rounded-xl border border-border bg-bg-surface p-4"
          >
            <label
              htmlFor={`deduction-${field.key}`}
              className="block text-base font-semibold text-text-primary mb-1"
            >
              {field.label}
            </label>
            <p className="text-sm text-text-secondary mb-3">{field.helper}</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-medium">
                $
              </span>
              <input
                id={`deduction-${field.key}`}
                type="text"
                inputMode="numeric"
                value={displays[field.key] ?? ""}
                onChange={(e) =>
                  handleDollarChange(
                    field.key,
                    e.target.value
                  )
                }
                placeholder={field.placeholder}
                className="w-full rounded-lg border border-border bg-bg-elevated py-3 pl-8 pr-4 text-text-primary placeholder:text-text-muted focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20 transition-colors"
                aria-label={`${field.label} in dollars`}
              />
            </div>
          </div>
        ))}

        {/* Home Office section */}
        <div className="rounded-xl border border-border bg-bg-surface p-4">
          <p className="text-base font-semibold text-text-primary mb-1">
            Home Office
          </p>
          <p className="text-sm text-text-secondary mb-3">
            Claim 67c/hour (fixed rate method) or actual expenses. The fixed
            rate covers electricity, internet, phone, and stationery.
          </p>
          <div
            className="flex gap-3 mb-3"
            role="radiogroup"
            aria-label="Home office claim method"
          >
            {(
              [
                { value: "hours" as const, label: "Fixed rate (67c/hour)" },
                { value: "actual" as const, label: "Actual expenses" },
              ] as const
            ).map((option) => {
              const isSelected = current.homeOfficeMethod === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors duration-150 ${
                    isSelected
                      ? "border-green bg-green-light text-text-primary"
                      : "border-border bg-bg-elevated text-text-secondary hover:border-green/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="homeOfficeMethod"
                    value={option.value}
                    checked={isSelected}
                    onChange={() => handleMethodChange(option.value)}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
          {current.homeOfficeMethod === "hours" && (
            <div>
              <label
                htmlFor="home-office-hours"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Hours per week working from home
              </label>
              <input
                id="home-office-hours"
                type="text"
                inputMode="numeric"
                value={displays.homeOfficeHoursPerWeek ?? ""}
                onChange={(e) => handleHoursChange(e.target.value)}
                placeholder="e.g. 20"
                className="w-full rounded-lg border border-border bg-bg-elevated py-3 px-4 text-text-primary placeholder:text-text-muted focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20 transition-colors"
                aria-label="Hours per week working from home"
              />
              {homeOfficeEstimate > 0 && (
                <p className="mt-2 text-sm text-green font-medium">
                  Estimated deduction: $
                  {Math.round(homeOfficeEstimate).toLocaleString("en-AU")}/year
                </p>
              )}
            </div>
          )}
          {current.homeOfficeMethod === "actual" && (
            <p className="text-sm text-text-secondary">
              With the actual method, you claim real expenses (electricity,
              internet, depreciation on furniture, etc). The AI report will
              recommend whichever method gives you a better result.
            </p>
          )}
        </div>

        {/* Large assets over $20K */}
        <div className="rounded-xl border border-border bg-bg-surface p-4">
          <label
            htmlFor="deduction-totalAssetPurchases"
            className="block text-base font-semibold text-text-primary mb-1"
          >
            Large Assets Over $20,000
          </label>
          <p className="text-sm text-text-secondary mb-3">
            Items over $20,000 each are depreciated over their effective life,
            not claimed in full this year
          </p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-medium">
              $
            </span>
            <input
              id="deduction-totalAssetPurchases"
              type="text"
              inputMode="numeric"
              value={displays.totalAssetPurchases ?? ""}
              onChange={(e) =>
                handleDollarChange("totalAssetPurchases", e.target.value)
              }
              placeholder="e.g. 50,000"
              className="w-full rounded-lg border border-border bg-bg-elevated py-3 pl-8 pr-4 text-text-primary placeholder:text-text-muted focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20 transition-colors"
              aria-label="Total large asset purchases over twenty thousand dollars"
            />
          </div>
        </div>
      </div>

      {/* Running total */}
      {grandTotal > 0 && (
        <div className="mt-6 rounded-xl border-2 border-green bg-green-light p-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-text-primary">
              Total Deductions (Instant Write-Off)
            </span>
            <span className="text-xl font-bold text-green font-[family-name:var(--font-heading)]">
              ${Math.round(grandTotal).toLocaleString("en-AU")}
            </span>
          </div>
          {current.totalAssetPurchases > 0 && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-green/20">
              <span className="text-sm text-text-secondary">
                + Large assets (depreciated)
              </span>
              <span className="text-sm font-semibold text-text-secondary">
                ${current.totalAssetPurchases.toLocaleString("en-AU")}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Instant asset write-off note */}
      <div className="mt-4 rounded-lg bg-bg-elevated border border-border p-3">
        <p className="text-xs text-text-secondary">
          Under the Instant Asset Write-Off, items under $20,000 each are fully
          deductible in the year of purchase (2025-26 FY). This is per item, not
          a total cap. Items over $20,000 are depreciated over their effective
          life.
        </p>
      </div>
    </fieldset>
  );
}
