"use client";

import type { DeductionsSection as DeductionsSectionData } from "@/types/report";
import { Card } from "@/components/ui/Card";

type DeductionsSectionProps = {
  data: DeductionsSectionData;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function DeductionsSection({ data }: DeductionsSectionProps) {
  return (
    <section aria-labelledby="deductions-heading">
      <h2
        id="deductions-heading"
        className="text-2xl font-bold font-[family-name:var(--font-heading)] text-text-primary mb-6"
      >
        Deductions
      </h2>

      {/* Category cards */}
      <div className="space-y-4 mb-6">
        {data.categories.map((category) => (
          <Card key={category.name} className="mb-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="font-semibold text-text-primary font-[family-name:var(--font-heading)]">
                {category.name}
              </h3>
              <span className="shrink-0 text-sm font-semibold text-green tabular-nums">
                ~{formatCurrency(category.estimatedValue)}
              </span>
            </div>
            <ul className="space-y-1.5">
              {category.items.map((item, index) => (
                <li key={index} className="flex gap-2 text-sm">
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
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  <span className="text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {/* Total estimated deductions */}
      <Card className="border-green/20 bg-green-light/30 mb-6">
        <div className="flex items-center justify-between">
          <span className="font-medium text-text-primary">
            Total estimated deductions
          </span>
          <span className="text-2xl font-bold font-[family-name:var(--font-heading)] text-green tabular-nums">
            {formatCurrency(data.totalEstimatedDeductions)}
          </span>
        </div>
      </Card>

      {/* Explanation / ATO rules */}
      {data.explanation && (
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
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
            <p className="text-sm text-text-secondary leading-relaxed">
              {data.explanation}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
