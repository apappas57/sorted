"use client";

import type { ActionsSection } from "@/types/report";
import { Card } from "@/components/ui/Card";

type ActionChecklistProps = {
  data: ActionsSection;
};

type PriorityGroup = {
  key: keyof ActionsSection;
  title: string;
  badgeColor: string;
  iconColor: string;
};

const PRIORITY_GROUPS: PriorityGroup[] = [
  {
    key: "immediate",
    title: "Do this now",
    badgeColor: "bg-red-100 text-red-700",
    iconColor: "text-red-500",
  },
  {
    key: "thisWeek",
    title: "This week",
    badgeColor: "bg-amber-100 text-amber-700",
    iconColor: "text-amber-500",
  },
  {
    key: "thisMonth",
    title: "This month",
    badgeColor: "bg-blue-100 text-blue-700",
    iconColor: "text-blue-500",
  },
  {
    key: "beforeEOFY",
    title: "Before end of financial year",
    badgeColor: "bg-green-light text-green-dark",
    iconColor: "text-green",
  },
];

export function ActionChecklist({ data }: ActionChecklistProps) {
  const hasActions = PRIORITY_GROUPS.some(
    (group) => data[group.key].length > 0
  );

  if (!hasActions) return null;

  return (
    <section aria-labelledby="actions-heading">
      <h2
        id="actions-heading"
        className="text-2xl font-bold font-[family-name:var(--font-heading)] text-text-primary mb-6"
      >
        Action Checklist
      </h2>

      <div className="space-y-6">
        {PRIORITY_GROUPS.map((group) => {
          const items = data[group.key];
          if (items.length === 0) return null;

          return (
            <Card key={group.key}>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${group.badgeColor}`}
                >
                  {group.title}
                </span>
              </div>
              <ul className="space-y-3">
                {items.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    {/* Decorative checkbox */}
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-current ${group.iconColor}`}
                      aria-hidden="true"
                    >
                      <svg
                        className="h-3 w-3 opacity-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </span>
                    <span className="text-sm text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
