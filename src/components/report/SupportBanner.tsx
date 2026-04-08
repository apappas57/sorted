import { siteConfig } from "@/config/site";

export function SupportBanner() {
  return (
    <div className="no-print rounded-xl border border-border bg-bg-surface px-6 py-6 text-center">
      <p className="text-sm text-text-secondary leading-relaxed">
        Sorted is free and open source. Each report costs a few cents in AI
        processing. Your support keeps it running.
      </p>

      <a
        href={siteConfig.donationsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#FFDD00] px-5 py-2.5 text-base font-semibold text-[#1a1a1a] shadow-sm transition-all duration-150 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFDD00] focus-visible:ring-offset-2"
      >
        <span className="text-lg" aria-hidden="true">
          ☕
        </span>
        Buy me a coffee
      </a>
    </div>
  );
}
