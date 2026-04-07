"use client";

import type { BASSection as BASSectionData } from "@/types/report";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { QUARTERLY_BAS_DATES } from "@/data/bas-schedule";

type BASSectionProps = {
  data: BASSectionData;
};

function formatDate(isoDate: string): string {
  const date = new Date(isoDate + "T00:00:00");
  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getDaysUntil(isoDate: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(isoDate + "T00:00:00");
  const diffMs = target.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function BASSection({ data }: BASSectionProps) {
  const daysUntilDue = getDaysUntil(data.nextDueDate);
  const isOverdue = daysUntilDue < 0;
  const isUrgent = daysUntilDue >= 0 && daysUntilDue <= 14;

  return (
    <section aria-labelledby="bas-heading">
      <h2
        id="bas-heading"
        className="text-2xl font-bold font-[family-name:var(--font-heading)] text-text-primary mb-6"
      >
        BAS & GST
      </h2>

      {/* Status row */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Badge variant={data.required ? "warning" : "success"}>
          {data.required ? "BAS Required" : "BAS Not Required"}
        </Badge>
        <Badge variant="info">{data.frequency}</Badge>
      </div>

      {/* Next due date card */}
      {data.required && (
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-text-muted uppercase tracking-wide mb-1">
                Next BAS due
              </p>
              <p className="text-lg font-semibold text-text-primary">
                {formatDate(data.nextDueDate)}
              </p>
            </div>
            <Badge
              variant={isOverdue ? "warning" : isUrgent ? "warning" : "info"}
            >
              {isOverdue
                ? `Overdue by ${Math.abs(daysUntilDue)} days`
                : `Due in ${daysUntilDue} days`}
            </Badge>
          </div>
        </Card>
      )}

      {/* GST recommendation */}
      {data.gstRecommendation && (
        <Card title="GST Recommendation" className="mb-6">
          <p className="text-text-secondary leading-relaxed">
            {data.gstRecommendation}
          </p>
        </Card>
      )}

      {/* BAS schedule table */}
      {data.required && (
        <Card title="2025-26 BAS Schedule" className="mb-6">
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-text-muted">Quarter</th>
                  <th className="pb-3 font-medium text-text-muted">Period</th>
                  <th className="pb-3 font-medium text-text-muted text-right">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {QUARTERLY_BAS_DATES.map((q) => {
                  const isPast = getDaysUntil(q.dueDate) < 0;
                  return (
                    <tr
                      key={q.quarter}
                      className={isPast ? "text-text-muted" : ""}
                    >
                      <td className="py-3 font-medium">Q{q.quarter}</td>
                      <td className="py-3">{q.label}</td>
                      <td className="py-3 text-right tabular-nums">
                        {formatDate(q.dueDate)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

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
