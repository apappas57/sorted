import type { QuestionnaireAnswers } from "@/types/questionnaire";
import { siteConfig } from "@/config/site";

const REPORT_JSON_SCHEMA = `{
  "tax": {
    "estimatedTaxRate": <number, percentage as decimal e.g. 0.325>,
    "fortnightlySetAside": <number, dollar amount>,
    "annualTaxEstimate": <number, dollar amount>,
    "medicareLevy": <number, dollar amount>,
    "hecsRepayment": <number, dollar amount or 0>,
    "explanation": "<string, 2-3 sentences explaining the estimate>",
    "tips": ["<string>"]
  },
  "bas": {
    "required": <boolean>,
    "frequency": "<string, e.g. 'quarterly' or 'monthly' or 'not applicable'>",
    "nextDueDate": "<string, e.g. '28 October 2025' or 'N/A'>",
    "gstRecommendation": "<string, whether they should register for GST>",
    "explanation": "<string, 2-3 sentences>",
    "tips": ["<string>"]
  },
  "deductions": {
    "categories": [
      {
        "name": "<string, category name>",
        "items": ["<string, specific deductible item>"],
        "estimatedValue": <number, estimated annual value>
      }
    ],
    "totalEstimatedDeductions": <number>,
    "explanation": "<string>"
  },
  "debt": {
    "strategy": "<string, e.g. 'avalanche' or 'snowball' or 'no debt'>",
    "priorityOrder": ["<string, debt type in recommended payoff order>"],
    "explanation": "<string, 2-3 sentences explaining the strategy>",
    "tips": ["<string>"]
  },
  "benefits": {
    "eligible": [
      {
        "name": "<string>",
        "description": "<string>",
        "howToApply": "<string, with URL to official source>",
        "estimatedValue": "<string, e.g. '$1,500 per year' or 'varies'>"
      }
    ],
    "possiblyEligible": [
      {
        "name": "<string>",
        "description": "<string>",
        "howToApply": "<string>",
        "estimatedValue": "<string>"
      }
    ]
  },
  "actions": {
    "immediate": ["<string, action to take today>"],
    "thisWeek": ["<string>"],
    "thisMonth": ["<string>"],
    "beforeEOFY": ["<string, action before 30 June>"]
  }
}`;

export function buildSystemPrompt(): string {
  return `You are Sorted, an Australian financial information assistant for the ${siteConfig.financialYear} financial year. You provide general information to help Australians understand their tax obligations, potential deductions, government benefits, and debt management options.

CRITICAL RULES:
1. You provide GENERAL INFORMATION ONLY. This is NOT financial, tax, or legal advice.
2. Never say "you should" or "you must". Use phrases like "based on ATO rates, the estimated amount is" or "you may be eligible for" or "consider exploring".
3. All figures must be based on current ATO published rates for the ${siteConfig.financialYear} financial year.
4. Always reference official sources (ato.gov.au, servicesaustralia.gov.au, business.gov.au).
5. When unsure, say so. Do not fabricate figures.
6. Return ONLY valid JSON matching the schema below. No markdown, no code fences, no extra text.

AUSTRALIAN TAX REFERENCE (${siteConfig.financialYear} FY):

Tax Brackets (Residents):
- $0 - $18,200: Nil
- $18,201 - $45,000: 16c per $1 over $18,200
- $45,001 - $135,000: $4,288 + 30c per $1 over $45,000
- $135,001 - $190,000: $31,288 + 37c per $1 over $135,000
- $190,001+: $51,638 + 45c per $1 over $190,000

Medicare Levy: 2% of taxable income (reduced for low-income earners below $26,000)

HECS-HELP Repayment Thresholds (${siteConfig.financialYear}):
- Below $54,435: Nil
- $54,435 - $62,850: 1.0%
- $62,851 - $66,620: 2.0%
- $66,621 - $70,618: 2.5%
- $70,619 - $74,855: 3.0%
- $74,856 - $79,346: 3.5%
- $79,347 - $84,107: 4.0%
- $84,108 - $89,154: 4.5%
- $89,155 - $94,503: 5.0%
- $94,504 - $100,174: 5.5%
- $100,175 - $106,185: 6.0%
- $106,186 - $112,556: 6.5%
- $112,557 - $119,309: 7.0%
- $119,310 - $126,467: 7.5%
- $126,468 - $134,056: 8.0%
- $134,057 - $142,100: 8.5%
- $142,101 - $150,626: 9.0%
- $150,627 - $159,663: 9.5%
- $159,664+: 10.0%

GST Threshold: $75,000 annual turnover (must register). Below $75,000 is voluntary.

BAS Lodgement:
- Quarterly: due 28 days after quarter end (28 Oct, 28 Feb, 28 Apr, 28 Jul)
- Monthly: due 21 days after month end
- Annual: due with income tax return

Sole Trader Tax: Same individual rates, but must set aside for tax + super (11.5% from 1 July 2025).

RESPONSE FORMAT:
Return a single JSON object matching this exact schema:

${REPORT_JSON_SCHEMA}

Populate every field. Use 0 for numeric fields that don't apply. Use empty arrays [] for list fields that don't apply. Use "N/A" for string fields that don't apply.`;
}

export function buildUserPrompt(answers: QuestionnaireAnswers): string {
  const lines: string[] = [
    `Generate a personalised financial information report for the ${siteConfig.financialYear} financial year based on these answers:`,
    "",
    `Employment: ${formatEmployment(answers.employment)}`,
  ];

  if (answers.abnStatus) {
    lines.push(`ABN Status: ${formatABN(answers.abnStatus)}`);
  }
  if (answers.annualRevenue !== undefined) {
    lines.push(
      `Estimated Annual Business/Side Revenue: $${answers.annualRevenue.toLocaleString("en-AU")}`
    );
  }
  if (answers.gstStatus) {
    lines.push(`GST Status: ${formatGST(answers.gstStatus)}`);
  }

  lines.push(`HECS-HELP Debt: ${formatHECS(answers.hecsDebt)}`);
  if (answers.hecsAmount !== undefined) {
    lines.push(
      `Estimated HECS Balance: $${answers.hecsAmount.toLocaleString("en-AU")}`
    );
  }

  if (answers.debts.length > 0) {
    lines.push(`Personal Debts:`);
    for (const debt of answers.debts) {
      const amount =
        debt.amount !== undefined
          ? ` ($${debt.amount.toLocaleString("en-AU")})`
          : "";
      lines.push(`  - ${formatDebtType(debt.type)}${amount}`);
    }
  } else {
    lines.push(`Personal Debts: None`);
  }

  lines.push(`Job Hunting: ${formatJobHunting(answers.jobHunting)}`);
  lines.push(`State/Territory: ${answers.state}`);

  return lines.join("\n");
}

function formatEmployment(type: QuestionnaireAnswers["employment"]): string {
  const map: Record<typeof type, string> = {
    employee: "Employee (PAYG)",
    sole_trader: "Sole Trader",
    both: "Employee + Sole Trader (side business)",
    casual: "Casual Worker",
    not_working: "Not Currently Working",
  };
  return map[type];
}

function formatABN(status: NonNullable<QuestionnaireAnswers["abnStatus"]>): string {
  const map: Record<typeof status, string> = {
    has_abn: "Has an ABN",
    side_income_no_abn: "Has side income but no ABN",
    no: "No ABN",
  };
  return map[status];
}

function formatGST(status: NonNullable<QuestionnaireAnswers["gstStatus"]>): string {
  const map: Record<typeof status, string> = {
    registered: "Registered for GST",
    not_registered: "Not registered for GST",
    unsure: "Unsure about GST registration",
  };
  return map[status];
}

function formatHECS(status: QuestionnaireAnswers["hecsDebt"]): string {
  const map: Record<typeof status, string> = {
    yes: "Yes, has HECS-HELP debt",
    no: "No HECS-HELP debt",
    unsure: "Unsure about HECS-HELP debt",
  };
  return map[status];
}

function formatDebtType(type: QuestionnaireAnswers["debts"][number]["type"]): string {
  const map: Record<typeof type, string> = {
    credit_card: "Credit Card",
    car_loan: "Car Loan",
    personal_loan: "Personal Loan",
    afterpay_bnpl: "Afterpay / Buy Now Pay Later",
  };
  return map[type];
}

function formatJobHunting(status: QuestionnaireAnswers["jobHunting"]): string {
  const map: Record<typeof status, string> = {
    actively: "Actively job hunting",
    casually: "Casually looking",
    no: "Not job hunting",
  };
  return map[status];
}
