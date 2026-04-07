"use client";

import type { BenefitsSection as BenefitsSectionData } from "@/types/report";
import { Card } from "@/components/ui/Card";

type BenefitsSectionProps = {
  data: BenefitsSectionData;
};

export function BenefitsSection({ data }: BenefitsSectionProps) {
  const hasEligible = data.eligible.length > 0;
  const hasPossible = data.possiblyEligible.length > 0;

  if (!hasEligible && !hasPossible) return null;

  return (
    <section aria-labelledby="benefits-heading">
      <h2
        id="benefits-heading"
        className="text-2xl font-bold font-[family-name:var(--font-heading)] text-text-primary mb-6"
      >
        Benefits & Offsets
      </h2>

      {/* Eligible benefits */}
      {hasEligible && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-green uppercase tracking-wide mb-4">
            You are likely eligible for
          </h3>
          <div className="space-y-4">
            {data.eligible.map((benefit) => (
              <Card
                key={benefit.name}
                className="border-green/20 bg-green-light/20"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-semibold text-text-primary font-[family-name:var(--font-heading)]">
                      {benefit.name}
                    </h4>
                    {benefit.estimatedValue && (
                      <span className="shrink-0 text-sm font-semibold text-green tabular-nums">
                        {benefit.estimatedValue}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {benefit.description}
                  </p>
                  {benefit.howToApply && (
                    <div className="rounded-md bg-bg-surface/80 px-3 py-2 text-sm">
                      <span className="font-medium text-text-primary">
                        How to apply:{" "}
                      </span>
                      <span className="text-text-secondary">
                        {benefit.howToApply}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Possibly eligible benefits */}
      {hasPossible && (
        <div>
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-4">
            You may also be eligible for
          </h3>
          <div className="space-y-3">
            {data.possiblyEligible.map((benefit) => (
              <Card key={benefit.name} className="bg-bg-surface">
                <div className="flex flex-col gap-2">
                  <h4 className="font-semibold text-text-primary font-[family-name:var(--font-heading)]">
                    {benefit.name}
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {benefit.description}
                  </p>
                  {benefit.howToApply && (
                    <p className="text-sm text-text-muted">
                      <span className="font-medium">How to check: </span>
                      {benefit.howToApply}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
