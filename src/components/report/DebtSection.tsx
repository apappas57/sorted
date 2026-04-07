"use client";

import type { DebtSection as DebtSectionData } from "@/types/report";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type DebtSectionProps = {
  data: DebtSectionData;
};

const STRATEGY_LABELS: Record<string, { label: string; variant: "success" | "info" | "warning" }> = {
  avalanche: { label: "Avalanche Method", variant: "success" },
  snowball: { label: "Snowball Method", variant: "info" },
  consolidate: { label: "Consolidation", variant: "warning" },
};

export function DebtSection({ data }: DebtSectionProps) {
  const strategyKey = data.strategy.toLowerCase();
  const strategyInfo = STRATEGY_LABELS[strategyKey] ?? {
    label: data.strategy,
    variant: "info" as const,
  };

  return (
    <section aria-labelledby="debt-heading">
      <h2
        id="debt-heading"
        className="text-2xl font-bold font-[family-name:var(--font-heading)] text-text-primary mb-6"
      >
        Debt Strategy
      </h2>

      {/* Strategy badge */}
      <div className="mb-6">
        <Badge variant={strategyInfo.variant} className="text-sm px-3 py-1">
          Recommended: {strategyInfo.label}
        </Badge>
      </div>

      {/* Priority order */}
      {data.priorityOrder.length > 0 && (
        <Card title="Priority Order" className="mb-6">
          <ol className="space-y-3">
            {data.priorityOrder.map((item, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green text-white text-xs font-bold">
                  {index + 1}
                </span>
                <span className="text-text-secondary text-sm pt-0.5">
                  {item}
                </span>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {/* Explanation */}
      {data.explanation && (
        <Card title="Why this strategy" className="mb-6">
          <p className="text-text-secondary leading-relaxed text-sm">
            {data.explanation}
          </p>
        </Card>
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
