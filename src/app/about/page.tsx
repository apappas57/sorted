import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { INSTANT_ASSET_WRITE_OFF } from "@/data/tax-brackets";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who builds Sorted, how it works, what happens to your answers, and when the ATO rates were last checked.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-text-primary font-[family-name:var(--font-heading)]">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-text-secondary leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-bold text-text-primary font-[family-name:var(--font-heading)] sm:text-4xl">
        About Sorted
      </h1>
      <p className="mt-4 text-lg text-text-secondary leading-relaxed">
        Sorted is a free tool that estimates your tax, finds deductions you may
        have missed, and points you at government benefits you might be eligible
        for. It is built for Australians in the missing middle: people who earn
        too much for most support, but not enough to keep an accountant on call.
      </p>

      <Section title="What happens to your answers">
        <p>
          Nothing is stored. There is no signup, no account, and no database.
          Your answers are sent once to generate your report, and they are gone
          when you close the tab. If you refresh the page, your report is gone
          too, so save or share it before you leave.
        </p>
        <p>
          Sorted does not ask for your name, your tax file number, your bank
          details, or your email address, and it never will. If a version of
          this tool ever asks you for those, it is not this one.
        </p>
      </Section>

      <Section title="Who builds it">
        <p>
          Sorted is built and maintained by {siteConfig.operator}, who runs{" "}
          <a
            href={siteConfig.operatorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green underline underline-offset-2 hover:brightness-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green rounded-sm"
          >
            {siteConfig.operatorBusiness}
          </a>
          , a digital studio in Melbourne working with trade businesses.
        </p>
        <p>
          It is free because it costs very little to run and it is genuinely
          useful. There is no paid tier and nothing is upsold to you inside your
          report. If it saves you money and you want to say thanks, there is a
          coffee link in the footer. That is the whole business model.
        </p>
        <p>
          The entire source code is public under the MIT licence, including
          every tax rate and the exact prompt used to build your report. If you
          want to check the numbers rather than take our word for it, you can{" "}
          <a
            href={siteConfig.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green underline underline-offset-2 hover:brightness-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green rounded-sm"
          >
            read them on GitHub
          </a>
          .
        </p>
      </Section>

      <Section title="Where the numbers come from">
        <p>
          Every rate and threshold is checked against a primary source: the ATO,
          Services Australia, or the legislation itself. Not a summary, and not
          another calculator.
        </p>
        <Card title={`ATO rates last verified: ${siteConfig.ratesVerified}`}>
          <p className="text-sm text-text-secondary leading-relaxed">
            Current for the {siteConfig.financialYear} financial year. Rates get
            indexed, legislated and occasionally repealed mid-year, so this date
            matters more than it looks. Two things worth knowing right now:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            <li className="flex gap-2">
              <span aria-hidden="true" className="text-green">
                &bull;
              </span>
              <span>
                <strong className="text-text-primary">
                  The instant asset write-off is unsettled.
                </strong>{" "}
                The $
                {INSTANT_ASSET_WRITE_OFF.pendingThreshold.toLocaleString(
                  "en-AU"
                )}{" "}
                threshold expired on 30 June 2026. Under current law it is $
                {INSTANT_ASSET_WRITE_OFF.threshold.toLocaleString("en-AU")} per
                item. A permanent $
                {INSTANT_ASSET_WRITE_OFF.pendingThreshold.toLocaleString(
                  "en-AU"
                )}{" "}
                is before Parliament but is not yet law, so Sorted estimates on
                the legislated figure and tells you when it applies to you. If
                you are timing a large purchase, talk to your accountant first.
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true" className="text-green">
                &bull;
              </span>
              <span>
                <strong className="text-text-primary">
                  Some thresholds are provisional.
                </strong>{" "}
                The Medicare levy low-income thresholds are indexed by an Act
                passed after the financial year ends and applied backwards, so
                the figures in force today are the best available rather than
                the final ones.
              </span>
            </li>
          </ul>
        </Card>
      </Section>

      <Section title="What Sorted is not">
        <p>
          It is not financial advice, tax advice, or legal advice, and it is not
          a substitute for a registered tax agent. It produces an estimate from
          a short questionnaire, which means it does not know about the specific
          circumstances that often matter most.
        </p>
        <p>
          Treat your report as a list of things worth asking about, not a
          lodgement. Anything that looks significant is worth confirming with a
          registered tax agent before you act on it.
        </p>
      </Section>

      <div className="mt-12 flex flex-col items-center gap-4 border-t border-border pt-10">
        <p className="text-center text-text-secondary">
          Ready to see what you might be leaving on the table?
        </p>
        <Link href="/get-sorted">
          <Button size="lg">Get my report</Button>
        </Link>
        <p className="text-center text-xs text-text-muted">
          Free, no signup, about a minute.
        </p>
      </div>
    </div>
  );
}
