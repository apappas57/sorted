import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Disclaimer } from "@/components/ui/Disclaimer";

const steps = [
  {
    number: 1,
    title: "Answer",
    description:
      "Tell us about your work, income, and situation. Takes about 2 minutes.",
  },
  {
    number: 2,
    title: "Generate",
    description:
      "AI analyses your situation against current ATO rules, deductions, and benefits.",
  },
  {
    number: 3,
    title: "Act",
    description:
      "Get a personalised report with exactly what to do, in plain English.",
  },
] as const;

const reportSections = [
  {
    title: "Tax Set-Aside",
    description: "Know exactly how much to save each fortnight",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "BAS & GST",
    description: "Clear guidance on obligations and deadlines",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
        />
      </svg>
    ),
  },
  {
    title: "Deductions",
    description: "Deductions you might be missing",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
    ),
  },
  {
    title: "Debt Strategy",
    description: "Optimal payoff plan for your debts",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
        />
      </svg>
    ),
  },
  {
    title: "Benefits",
    description: "Government benefits you could be eligible for",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
  },
  {
    title: "Action Plan",
    description: "Prioritised checklist of what to do next",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
        />
      </svg>
    ),
  },
] as const;

const trustSignals = [
  {
    label: "Free forever",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
    ),
  },
  {
    label: "No signup required",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
        />
      </svg>
    ),
  },
  {
    label: "Open source (MIT)",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
        />
      </svg>
    ),
  },
  {
    label: "No data stored",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
  },
] as const;

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="px-4 pt-24 pb-20 sm:px-6 sm:pt-32 sm:pb-28">
        <div className="mx-auto max-w-[1120px] text-center">
          <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            Your money, sorted.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl">
            Free AI-powered financial navigator for Australians. Answer a few
            questions, get your personalised report. No signup. No fees. No data
            stored.
          </p>
          <div className="mt-10">
            <Button href="/get-sorted" size="lg">
              Get Sorted — it&apos;s free
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="bg-bg-surface px-4 py-20 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-[1120px]">
          <h2 className="text-center font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-text-secondary">
            Three steps. Two minutes. One clear plan.
          </p>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <Card key={step.number} className="text-center">
                <span className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-green text-sm font-bold text-white">
                  {step.number}
                </span>
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 text-text-secondary">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[1120px]">
          <h2 className="text-center font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            What you get
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-text-secondary">
            A personalised report covering everything you need to know for the
            2025-26 financial year.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reportSections.map((section) => (
              <Card key={section.title} icon={section.icon} title={section.title}>
                <p>{section.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-border bg-bg-surface px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-[1120px] grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {trustSignals.map((signal) => (
            <div
              key={signal.label}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-light text-green">
                {signal.icon}
              </span>
              <span className="text-sm font-semibold text-text-primary">
                {signal.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[1120px] text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Ready to get sorted?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-text-secondary">
            It takes two minutes, costs nothing, and could save you thousands.
          </p>
          <div className="mt-8">
            <Button href="/get-sorted" size="lg">
              Get Sorted — it&apos;s free
            </Button>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="px-4 pb-12 sm:px-6">
        <div className="mx-auto max-w-[1120px]">
          <Disclaimer />
        </div>
      </section>
    </>
  );
}
