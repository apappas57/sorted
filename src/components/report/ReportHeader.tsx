"use client";

import { Disclaimer } from "@/components/ui/Disclaimer";
import { siteConfig } from "@/config/site";

export function ReportHeader() {
  const generatedDate = new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="mb-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-text-primary sm:text-4xl">
          Your Financial Report
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Generated {generatedDate}
        </p>
      </div>

      <p className="text-lg text-text-secondary leading-relaxed">
        Based on your answers, here is what you need to know for{" "}
        <span className="font-semibold text-text-primary">
          {siteConfig.financialYear}
        </span>
        .
      </p>

      <Disclaimer className="mt-6" />
    </header>
  );
}
