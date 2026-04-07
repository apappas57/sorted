"use client";

import type { GSTStatus } from "@/types/questionnaire";

type StepGSTProps = {
  value: GSTStatus | undefined;
  onChange: (value: GSTStatus) => void;
};

const options: { value: GSTStatus; label: string; description: string }[] = [
  {
    value: "registered",
    label: "Yes, I'm registered for GST",
    description: "You charge GST and lodge BAS returns",
  },
  {
    value: "not_registered",
    label: "No, I'm not registered",
    description: "You don't currently charge or remit GST",
  },
  {
    value: "unsure",
    label: "I'm not sure",
    description: "We'll help you figure this out",
  },
];

export function StepGST({ value, onChange }: StepGSTProps) {
  return (
    <fieldset>
      <legend className="mb-6 text-2xl font-semibold font-[family-name:var(--font-heading)] text-text-primary">
        Are you registered for GST?
      </legend>
      <div className="flex flex-col gap-3" role="radiogroup" aria-label="GST registration status">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-colors duration-150 ${
                isSelected
                  ? "border-green bg-green-light"
                  : "border-border bg-bg-elevated hover:border-green/40"
              }`}
            >
              <input
                type="radio"
                name="gstStatus"
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="mt-1 h-5 w-5 shrink-0 accent-green"
                aria-describedby={`gst-${option.value}-desc`}
              />
              <div className="min-w-0">
                <span className="block text-base font-semibold text-text-primary">
                  {option.label}
                </span>
                <span
                  id={`gst-${option.value}-desc`}
                  className="block text-sm text-text-secondary mt-0.5"
                >
                  {option.description}
                </span>
              </div>
            </label>
          );
        })}
      </div>

      <div className="mt-4 rounded-lg bg-bg-surface border border-border px-4 py-3">
        <div className="flex gap-3">
          <svg
            className="mt-0.5 h-5 w-5 shrink-0 text-info"
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
            You must register for GST if your business turns over $75,000 or
            more per year. Below that, registration is optional but can have
            benefits.{" "}
            <a
              href="https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green font-medium underline underline-offset-2 hover:text-green-dark"
            >
              Learn more at ato.gov.au
            </a>
          </p>
        </div>
      </div>
    </fieldset>
  );
}
