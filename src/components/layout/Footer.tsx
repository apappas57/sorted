import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/Badge";

export function Footer() {
  return (
    <footer
      className="mt-auto border-t border-border bg-bg-surface"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Top row: branding + links */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-lg font-bold font-[family-name:var(--font-heading)] text-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 rounded-sm"
            >
              Sorted
            </Link>
            <Badge variant="neutral">MIT</Badge>
          </div>

          <nav className="flex items-center gap-4 text-sm" aria-label="Footer navigation">
            <a
              href={siteConfig.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 rounded-sm"
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub
            </a>

            <span className="text-border" aria-hidden="true">|</span>

            <a
              href={siteConfig.donationsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 rounded-sm"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              Keep Sorted Free
            </a>
          </nav>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-xs text-text-muted leading-relaxed">
          {siteConfig.disclaimer}
        </p>

        {/* Copyright */}
        <p className="mt-3 text-center text-xs text-text-muted">
          {new Date().getFullYear()} Sorted. Open source under the{" "}
          <a
            href={`${siteConfig.repo}/blob/main/LICENSE`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green rounded-sm"
          >
            MIT License
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
