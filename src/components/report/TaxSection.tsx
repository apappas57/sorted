"use client";

import type { TaxSection as TaxSectionData } from "@/types/report";
import { Card } from "@/components/ui/Card";

type TaxSectionProps = {
  data: TaxSectionData;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function TaxSection({ data }: TaxSectionProps) {
  const breakdownRows = [
    {
      label: "Estimated tax rate",
      value: formatPercent(data.estimatedTaxRate),
    },
    {
      label: "Annual tax estimate",
      value: formatCurrency(data.annualTaxEstimate),
    },
    {
      label: "Medicare levy (2%)",
      value: formatCurrency(data.medicareLevy),
    },
  ];

  if (data.hecsRepayment > 0) {
    breakdownRows.push({
      label: "HECS-HELP repayment",
      value: formatCurrency(data.hecsRepayment),
    });
  }

  return (
    <section aria-labelledby="tax-heading">
      <h2
        id="tax-heading"
        className="text-2xl font-bold font-[family-name:var(--font-heading)] text-text-primary mb-6"
      >
        Tax Set-Aside
      </h2>

      {/* Hero card with fortnightly amount */}
      <Card className="mb-6 border-green/20 bg-green-light/30">
        <div className="text-center py-4">
          <p className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-2">
            Set aside each fortnight
          </p>
          <p className="text-5xl font-bold font-[family-name:var(--font-heading)] text-green sm:text-6xl">
            {formatCurrency(data.fortnightlySetAside)}
          </p>
          <p className="mt-2 text-sm text-text-muted">per fortnight</p>
        </div>
      </Card>

      {/* Breakdown table */}
      <Card title="Breakdown" className="mb-6">
        <div className="divide-y divide-border">
          {breakdownRows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <span className="text-text-secondary">{row.label}</span>
              <span className="font-semibold text-text-primary tabular-nums">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Explanation */}
      {data.explanation && (
        <p className="text-sm text-text-secondary mb-4 leading-relaxed">
          {data.explanation}
        </p>
      )}

      {/* Tips */}
      {data.tips.length > 0 && (
        <Card title="Tips">
          <ul className="space-y-2">
            {data.tips.map((tip, index) => (
              <li key={index} className="flex gap-3 text-sm">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-green"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                  />
                </svg>
                <span className="text-text-secondary">{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </section>
  );
}
