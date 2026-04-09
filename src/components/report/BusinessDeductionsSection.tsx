"use client";

import type { BusinessDeductionsSection as BusinessDeductionsSectionData } from "@/types/report";
import { Card } from "@/components/ui/Card";

type BusinessDeductionsSectionProps = {
  data: BusinessDeductionsSectionData;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function BusinessDeductionsSection({
  data,
}: BusinessDeductionsSectionProps) {
  if (!data.applicable) return null;

  return (
    <section aria-labelledby="business-deductions-heading">
      <h2
        id="business-deductions-heading"
        className="text-2xl font-bold font-[family-name:var(--font-heading)] text-text-primary mb-6"
      >
        Business Deductions
      </h2>

      {/* Instant Write-Off breakdown */}
      {data.instantWriteOff.total > 0 && (
        <Card className="mb-4">
          <h3 className="font-semibold text-text-primary font-[family-name:var(--font-heading)] mb-3">
            Instant Asset Write-Off (Under $20,000/item)
          </h3>
          {data.instantWriteOff.breakdown.length > 0 && (
            <div className="space-y-2 mb-3">
              {data.instantWriteOff.breakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-text-primary">
                      {item.category}
                    </span>
                    {item.note && (
                      <p className="text-xs text-text-secondary mt-0.5">
                        {item.note}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-green tabular-nums">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-sm font-medium text-text-primary">
              Total instant write-off
            </span>
            <span className="font-bold text-green tabular-nums">
              {formatCurrency(data.instantWriteOff.total)}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-text-secondary">
              Estimated tax saving
            </span>
            <span className="text-sm font-semibold text-green tabular-nums">
              {formatCurrency(data.instantWriteOff.taxSaving)}
            </span>
          </div>
        </Card>
      )}

      {/* Depreciation */}
      {data.depreciation.totalAssetValue > 0 && (
        <Card className="mb-4">
          <h3 className="font-semibold text-text-primary font-[family-name:var(--font-heading)] mb-3">
            Large Assets (Depreciation)
          </h3>
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                Total asset value
              </span>
              <span className="text-sm font-medium text-text-primary tabular-nums">
                {formatCurrency(data.depreciation.totalAssetValue)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                This year&apos;s depreciation
              </span>
              <span className="text-sm font-semibold text-green tabular-nums">
                {formatCurrency(data.depreciation.annualDepreciation)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">
                Estimated tax saving
              </span>
              <span className="text-sm font-semibold text-green tabular-nums">
                {formatCurrency(data.depreciation.taxSaving)}
              </span>
            </div>
          </div>
          {data.depreciation.explanation &&
            data.depreciation.explanation !== "N/A" && (
              <p className="text-xs text-text-secondary leading-relaxed">
                {data.depreciation.explanation}
              </p>
            )}
        </Card>
      )}

      {/* Home Office */}
      {data.homeOffice.annualDeduction > 0 && (
        <Card className="mb-4">
          <h3 className="font-semibold text-text-primary font-[family-name:var(--font-heading)] mb-3">
            Home Office
          </h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">
              Method: {data.homeOffice.method}
            </span>
            <span className="font-semibold text-green tabular-nums">
              {formatCurrency(data.homeOffice.annualDeduction)}
            </span>
          </div>
          {data.homeOffice.explanation &&
            data.homeOffice.explanation !== "N/A" && (
              <p className="text-xs text-text-secondary leading-relaxed">
                {data.homeOffice.explanation}
              </p>
            )}
        </Card>
      )}

      {/* Total business deductions */}
      <Card className="border-green/20 bg-green-light/30 mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-text-primary">
            Total business deductions
          </span>
          <span className="text-2xl font-bold font-[family-name:var(--font-heading)] text-green tabular-nums">
            {formatCurrency(data.totalDeductions)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            Estimated total tax saving
          </span>
          <span className="text-lg font-bold font-[family-name:var(--font-heading)] text-green tabular-nums">
            {formatCurrency(data.totalTaxSaving)}
          </span>
        </div>
      </Card>

      {/* Warnings */}
      {data.warnings.length > 0 && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 mb-4">
          <div className="flex gap-3">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <div>
              {data.warnings.map((warning, index) => (
                <p
                  key={index}
                  className="text-sm text-amber-800 leading-relaxed"
                >
                  {warning}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      {data.tips.length > 0 && (
        <div className="rounded-lg bg-bg-surface border border-border px-4 py-3">
          <div className="flex gap-3">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
              />
            </svg>
            <ul className="space-y-1">
              {data.tips.map((tip, index) => (
                <li key={index} className="text-sm text-text-secondary leading-relaxed">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
