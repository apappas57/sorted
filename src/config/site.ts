export const siteConfig = {
  name: "Sorted",
  tagline: "Your money, sorted.",
  description:
    "Free AI-powered financial navigator for Australians. Answer a few questions, get your personalised tax, deductions, and benefits report. No signup, no fees, no data stored.",
  url: "https://imsorted.au",
  repo: "https://github.com/apappas57/sorted",
  license: "MIT",
  donationsUrl: "https://buymeacoffee.com/groundwork",
  financialYear: "2025-26",
  nav: [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Get Sorted", href: "/get-sorted" },
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
