"use client";

import type { DiscoveriesSection as DiscoveriesSectionData } from "@/types/report";
import { Card } from "@/components/ui/Card";

type DiscoveriesSectionProps = {
  data: DiscoveriesSectionData;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function DiscoveriesSection({ data }: DiscoveriesSectionProps) {
  const hasItems = data.items.length > 0;

  if (!hasItems) {
    return (
      <section aria-labelledby="discoveries-heading" className="mb-4">
        <Card className="bg-bg-surface">
          <div className="text-center py-4">
            <p className="text-lg font-semibold font-[family-name:var(--font-heading)] text-text-primary mb-2">
              No additional savings found
            </p>
            <p className="text-sm text-text-secondary leading-relaxed max-w-lg mx-auto">
              Based on your answers, we didn&apos;t find specific savings
              opportunities. This is a good sign - you may already be
              well-optimised!
            </p>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section aria-labelledby="discoveries-heading">
      {/* Hero card - the screenshot moment */}
      <div className="rounded-xl bg-gradient-to-br from-green to-green-dark p-8 text-white mb-8 print:border print:border-green print:bg-white print:text-text-primary">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wide opacity-90 print:text-text-secondary">
            Potential savings found
          </p>
          <p className="text-5xl font-bold font-[family-name:var(--font-heading)] mt-3 sm:text-6xl tabular-nums">
            {formatCurrency(data.totalPotentialSavings)}
          </p>
          <p className="mt-3 text-base opacity-80 print:text-text-muted">
            per year based on your answers
          </p>
        </div>
      </div>

      {/* Section heading */}
      <h2
        id="discoveries-heading"
        className="text-2xl font-bold font-[family-name:var(--font-heading)] text-text-primary mb-6"
      >
        Money You May Be Leaving on the Table
      </h2>

      {/* Discovery items */}
      <div className="space-y-4">
        {data.items.map((item, index) => (
          <Card
            key={index}
            className="border-l-4 border-l-green border-green/20"
          >
            <div className="flex flex-col gap-3">
              {/* Amount + title */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
                <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-text-primary">
                  {item.title}
                </h3>
                <span className="text-2xl font-bold text-green tabular-nums shrink-0">
                  {formatCurrency(item.amount)}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-text-secondary leading-relaxed">
                {item.description}
              </p>

              {/* How to capture */}
              {item.howToCapture && (
                <div className="rounded-lg bg-bg-surface px-4 py-3 flex gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-green"
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
                  <div>
                    <p className="text-xs font-semibold text-text-primary uppercase tracking-wide mb-1">
                      How to capture this
                    </p>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {item.howToCapture}
                    </p>
                  </div>
                </div>
              )}

              {/* Source link */}
              {item.source && (
                <p className="text-xs text-text-muted">
                  Source:{" "}
                  <a
                    href={
                      item.source.startsWith("http")
                        ? item.source
                        : `https://${item.source}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-text-secondary transition-colors"
                  >
                    {item.source}
                  </a>
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Disclaimer */}
      {data.disclaimer && (
        <p className="mt-6 text-xs text-text-muted leading-relaxed">
          {data.disclaimer}
        </p>
      )}
    </section>
  );
}
