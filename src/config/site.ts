export const siteConfig = {
  name: "Sorted",
  tagline: "Your money, sorted.",
  description:
    "Free AI-powered financial navigator for Australians. Answer a few questions, get your personalised tax, deductions, and benefits report. No signup, no fees, no data stored.",
  url: "https://imsorted.au",
  repo: "https://github.com/apappas57/sorted",
  license: "MIT",
  donationsUrl: "https://buymeacoffee.com/imsorted",
  // Single source of truth for the financial year. Every user-facing mention of
  // the year must read this -- hardcoded copies across components are how the
  // site ended up advertising 2025-26 rates a month into 2026-27.
  financialYear: "2026-27",
  /**
   * Date the ATO rates in src/data were last verified against primary sources.
   * Shown publicly. Update it whenever you touch a rate, and see
   * docs/RECHECK-CALENDAR.md for when each figure next changes.
   */
  ratesVerified: "4 August 2026",
  operator: "Alex Pappas",
  operatorBusiness: "Groundwork Digital Studio",
  operatorUrl: "https://groundworkdigitalstudio.com.au",
  nav: [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Get Sorted", href: "/get-sorted" },
    { label: "About", href: "/about" },
    {
      label: "GitHub",
      href: "https://github.com/apappas57/sorted",
      external: true,
    },
  ],
  disclaimer:
    "Sorted provides general information only. It is not financial, tax, or legal advice. Always consult a qualified professional for advice specific to your situation.",
  rateLimit: {
    maxReports: 3,
    windowMs: 86_400_000, // 24 hours
  },
} as const;
