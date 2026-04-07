import type { Metadata } from "next";
import { QuestionnaireFlow } from "@/components/questionnaire/QuestionnaireFlow";

export const metadata: Metadata = {
  title: "Get Sorted",
  description:
    "Answer a few questions about your work and finances, and get a personalised tax, deductions, and benefits report instantly.",
};

export default function GetSortedPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-text-primary sm:text-4xl">
          Let&apos;s get you sorted
        </h1>
        <p className="mt-3 text-text-secondary text-lg">
          Answer a few quick questions and we&apos;ll build your personalised
          financial report.
        </p>
      </div>
      <QuestionnaireFlow />
    </main>
  );
}
