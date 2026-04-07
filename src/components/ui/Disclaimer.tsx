import { siteConfig } from "@/config/site";

type DisclaimerProps = {
  text?: string;
  className?: string;
};

export function Disclaimer({ text, className = "" }: DisclaimerProps) {
  const disclaimerText = text ?? siteConfig.disclaimer;

  return (
    <div
      className={`rounded-lg bg-bg-surface border border-border px-4 py-3 ${className}`.trim()}
      role="note"
      aria-label="Disclaimer"
    >
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
          {disclaimerText}
        </p>
      </div>
    </div>
  );
}
