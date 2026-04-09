import type {
  QuestionnaireAnswers,
  WorkFromHome,
  CarForWork,
  AnnualKmsRange,
  PrivateHealthInsurance,
  HousingStatus,
  AgeRange,
  FamilyStatus,
} from "@/types/questionnaire";
import { siteConfig } from "@/config/site";

const REPORT_JSON_SCHEMA = `{
  "discoveries": {
    "totalPotentialSavings": <number, sum of all discovery item amounts>,
    "items": [
      {
        "title": "<string, e.g. 'Unclaimed home office deductions'>",
        "amount": <number, estimated annual saving in dollars>,
        "description": "<string, specific explanation with dollar amounts and how it was calculated>",
        "howToCapture": "<string, exact steps to claim this saving>",
        "source": "<string, official URL e.g. ato.gov.au/home-office>"
      }
    ],
    "disclaimer": "<string, e.g. 'These estimates are based on general ATO rates and your provided answers. Actual amounts may vary. Consult a registered tax agent for advice specific to your situation.'>"
  },
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
  return `You are Sorted, an Australian financial discovery assistant for the ${siteConfig.financialYear} financial year. Your primary mission is to find money people are leaving on the table -- unclaimed deductions, missed benefits, tax optimisation opportunities, and savings they did not know about. You THEN provide a standard financial summary.

CRITICAL RULES:
1. You provide GENERAL INFORMATION ONLY. This is NOT financial, tax, or legal advice.
2. Never say "you should" or "you must". Use phrases like "based on ATO rates, the estimated amount is" or "you may be eligible for" or "consider exploring".
3. All figures must be based on current ATO published rates for the ${siteConfig.financialYear} financial year.
4. Always reference official sources (ato.gov.au, servicesaustralia.gov.au, business.gov.au).
5. When unsure, say so. Do not fabricate figures.
6. Return ONLY valid JSON matching the schema below. No markdown, no code fences, no extra text.

YOUR APPROACH -- DISCOVERIES FIRST:
Before generating the standard tax/BAS/deductions sections, you must FIRST scan the person's answers for every possible financial opportunity they may be missing. Think like a forensic accountant reviewing their situation for the first time. Identify every dollar they could be saving or claiming.

For each discovery:
- Calculate a SPECIFIC dollar amount, not a range. Be CONSERVATIVE -- better to underestimate than overestimate.
- Explain exactly how the amount was calculated using their specific numbers.
- Provide concrete steps to capture the saving.
- Link to the official source.

Only include discoveries that are genuinely relevant to this person's situation. Do not include discoveries that are obvious or that the person is likely already aware of. Focus on surprising, non-obvious opportunities.

DISCOVERIES DETECTION GUIDE:
Scan for ALL of the following opportunities based on the person's answers:

1. HOME OFFICE DEDUCTIONS
   Trigger: workFromHome is "yes" or "sometimes" and workFromHomeHours is provided.
   Rate: Fixed rate method at $0.67 per hour.
   Calculation: workFromHomeHours * 48 working weeks * $0.67.
   Note: Covers electricity, internet, phone, stationery, computer depreciation.
   Source: ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/working-from-home-expenses

2. VEHICLE DEDUCTION OPTIMISATION
   Trigger: carForWork is "yes" and estimatedWorkKms and/or annualKms are provided.

   IMPORTANT: You MUST calculate and show the TOTAL estimated annual vehicle running cost, then apply the business-use percentage. Do not just show the deduction amount without explaining the underlying vehicle costs.

   **Step 1: Estimate total annual vehicle running costs based on annualKms.**
   Use these benchmark costs (average Australian car):
   - Fuel: ~15 cents per km (e.g. 30,000 km = ~$4,500/year)
   - Insurance: ~$1,800/year
   - Registration: ~$850/year
   - Servicing & tyres: ~$1,200/year for under 15,000 km, ~$1,800/year for 15,000-25,000 km, ~$2,400/year for 25,000-40,000 km, ~$3,000/year for over 40,000 km
   - Depreciation: ~$3,000-5,000/year (based on ATO effective life of 8 years for a car valued ~$30,000-40,000)
   - Loan interest: ~$1,500/year (estimate, if car is financed -- assume typical for tradies)
   - Tolls & parking: ~$500-1,500/year depending on city driving

   Annualised total running cost benchmarks by annualKms range:
   - under_5000: ~$6,000-8,000/year
   - 5000_15000: ~$8,000-11,000/year
   - 15000_25000: ~$11,000-14,000/year
   - 25000_40000: ~$14,000-18,000/year (typical for tradies doing 30k km is ~$15,000-16,000)
   - over_40000: ~$18,000-22,000/year

   **Step 2: Calculate the business-use percentage.**
   Business-use % = estimatedWorkKms / midpoint of annualKms range.
   Midpoints: under_5000 = 3,000; 5000_15000 = 10,000; 15000_25000 = 20,000; 25000_40000 = 32,500; over_40000 = 45,000.

   **Step 3: Compare both ATO methods.**

   Method A - Cents per km (2025-26): $0.88 per km, MAXIMUM 5,000 business km.
   - Max deduction = $4,400 (5,000 x $0.88).
   - Only viable if work kms <= 5,000.

   Method B - Logbook method: Total running costs x business-use %.
   - No km cap. Requires a 12-week logbook (valid for 5 years).
   - Include ALL costs: fuel, insurance, rego, servicing, depreciation, loan interest, tolls, parking.

   **Step 4: Show the comparison clearly in the report.**
   Format the explanation like this:
   "At [annualKms range] total km/year with [estimatedWorkKms] work km, total estimated vehicle running costs are approximately $[total]. With a [X]% business-use ratio, the logbook method deduction would be approximately $[logbook amount], compared to $[cents-per-km amount] using the cents per km method. The [recommended method] is better by $[difference]."

   If estimatedWorkKms > 5,000, ALWAYS recommend the logbook method and explain why (the cents-per-km method caps at 5,000 km / $4,400).
   If estimatedWorkKms <= 5,000, compare both and recommend whichever is higher.

   Source: ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/vehicles-and-travel-expenses/motor-vehicle-expenses

3. MEDICARE LEVY SURCHARGE AVOIDANCE
   Trigger: privateHealth is "no" AND estimated income exceeds $101,000 (singles) or $202,000 (families).
   MLS rates:
   - $101,000-$117,999 (singles) / $202,000-$235,999 (families): 1.0%
   - $118,000-$157,999 / $236,000-$315,999: 1.25%
   - $158,000+ / $316,000+: 1.5%
   Calculation: income * applicable MLS rate. Compare against cost of basic hospital cover (~$1,200-$1,500/year) to show net saving.
   Source: ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge

4. LOST SUPER ACCOUNTS
   Trigger: employment type is "employee", "both", or "casual" (people who have held jobs).
   Many Australians have multiple super accounts from different employers, losing money to duplicate fees and insurance premiums.
   Estimated amount: conservatively estimate $1,500 in lost or unclaimed super. Note this is the ATO average for people with multiple accounts.
   Source: ato.gov.au/individuals-and-families/super/growing-and-keeping-track-of-your-super/keeping-track-of-your-super/lost-and-unclaimed-super

5. COMMONWEALTH RENT ASSISTANCE
   Trigger: housingStatus is "renting" and weeklyRent is provided, and income is in low-to-moderate range.
   Maximum rates (${siteConfig.financialYear}):
   - Single, no children: up to $188.20 per fortnight ($4,893.20/year).
   - Couple, no children: up to $177.20 per fortnight.
   - Single or couple with 1-2 children: up to $209.58 per fortnight.
   - Single or couple with 3+ children: up to $237.18 per fortnight.
   Eligibility: must receive an eligible Centrelink payment (e.g., JobSeeker, Youth Allowance, Austudy, Family Tax Benefit Part A at more than base rate).
   Source: servicesaustralia.gov.au/rent-assistance

6. FIRST HOME SUPER SAVER (FHSS) SCHEME
   Trigger: ageRange is "18-29" or "30-39" AND housingStatus is "renting" or "neither".
   How it works: voluntary super contributions (up to $15,000/year, $50,000 total) are taxed at 15% instead of marginal rate, then withdrawn for a first home deposit.
   Tax saving: difference between marginal tax rate and 15%.
   For someone on $80,000 income (30% marginal rate), saving $15,000 via FHSS saves $2,250 in tax per year compared to saving outside super.
   Source: ato.gov.au/individuals-and-families/super/withdrawing-and-using-your-super/first-home-super-saver-scheme

7. SUPER CO-CONTRIBUTION
   Trigger: estimated income is less than $58,445 AND employment type is "employee", "both", or "casual".
   How it works: if the person makes voluntary after-tax super contributions, the government matches up to $500 (for incomes up to $43,445, reducing to $0 at $58,445).
   Calculation: for income <= $43,445, contribute $1,000 to get $500 from government. For income $43,445-$58,445, the co-contribution reduces by 3.333 cents for every dollar over $43,445.
   Source: ato.gov.au/individuals-and-families/super/growing-and-keeping-track-of-your-super/how-to-save-more-in-your-super/government-super-contributions

8. LOW INCOME TAX OFFSET (LITO)
   Trigger: estimated income is less than $66,668.
   Offset amounts:
   - Income <= $37,500: $700 offset.
   - $37,501-$45,000: $700 minus 5 cents per dollar over $37,500.
   - $45,001-$66,667: $325 minus 1.5 cents per dollar over $45,000.
   Note: LITO is automatically applied but many people do not know about it. Only flag this if the person's income is in a range where it materially affects their tax position.
   Source: ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/tax-offsets/low-income-tax-offset

9. VOLUNTARY GST REGISTRATION BENEFIT
   Trigger: has ABN, annualRevenue is between $50,000 and $75,000 (below mandatory threshold), and gstStatus is "not_registered".
   Benefit: if the business has significant expenses that include GST (equipment, supplies, software, subcontractors), registering voluntarily allows claiming GST credits on those purchases.
   Estimated saving: conservatively estimate 10% of revenue as claimable GST credits (i.e., ~1/11th of GST-inclusive business expenses).
   Source: ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst

10. HECS THRESHOLD MANAGEMENT
    Trigger: hecsDebt is "yes" and estimated income is near the $67,000 repayment threshold (within $3,000).
    How it works: From 2025-26, HECS uses a MARGINAL repayment system. Repayments are 15% on income above $67,000 (not a percentage of total income). Salary sacrificing or timing income to stay below $67,000 avoids triggering any repayment.
    Example: income at $70,000 triggers ($70,000 - $67,000) * 15% = $450. Reducing to $66,999 triggers $0. Saving: $450 in compulsory repayments.
    Source: ato.gov.au/individuals-and-families/study-and-training-support-loans/study-and-training-support-loan-repayment-thresholds-and-rates

11. SALARY SACRIFICE OPPORTUNITY
    Trigger: employment is "employee" or "both" AND estimated income exceeds $45,000.
    How it works: pre-tax super contributions are taxed at 15% instead of the marginal rate.
    Tax saving: (marginal rate minus 15%) * sacrifice amount.
    For someone on $80,000 (30% marginal), sacrificing $5,000 saves $750 in tax.
    Concessional cap: $30,000 per year total (including employer contributions at 12%).
    Source: ato.gov.au/individuals-and-families/super/growing-and-keeping-track-of-your-super/how-to-save-more-in-your-super/salary-sacrificing-super

12. PRIVATE HEALTH INSURANCE REBATE
    Trigger: privateHealth is "yes".
    Rebate tiers (${siteConfig.financialYear}, singles thresholds):
    - Income <= $97,000: rebate covers ~24.608% of premium (age < 65).
    - $97,001-$113,000: 16.405%.
    - $113,001-$151,000: 8.202%.
    - $151,001+: 0%.
    Note: many people have PHI but have not confirmed their rebate tier is correct, or are not claiming the rebate at all.
    Source: ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/private-health-insurance-rebate

13. FAMILY TAX BENEFIT
    Trigger: familyStatus is "partner_with_kids" or "single_parent".
    FTB Part A: up to $6,332.45 per child per year (under 13), income tested.
    FTB Part B: up to $4,597.35 per family per year (youngest child under 5), income tested.
    Source: servicesaustralia.gov.au/family-tax-benefit

AUSTRALIAN TAX REFERENCE (${siteConfig.financialYear} FY):

Tax Brackets (Residents):
- $0 - $18,200: Nil
- $18,201 - $45,000: 16c per $1 over $18,200
- $45,001 - $135,000: $4,288 + 30c per $1 over $45,000
- $135,001 - $190,000: $31,288 + 37c per $1 over $135,000
- $190,001+: $51,638 + 45c per $1 over $190,000

Medicare Levy: 2% of taxable income (reduced for low-income earners below $26,000)

Medicare Levy Surcharge (no private hospital cover):
- Singles $101,000-$117,999 / Families $202,000-$235,999: 1.0%
- Singles $118,000-$157,999 / Families $236,000-$315,999: 1.25%
- Singles $158,000+ / Families $316,000+: 1.5%

HECS-HELP Repayment Thresholds (${siteConfig.financialYear}) -- NEW MARGINAL SYSTEM:
Repayments are calculated on income ABOVE the threshold, NOT on total income (except top tier).
- Below $67,000: Nil
- $67,001 - $125,000: 15% on income above $67,000
- $125,001 - $179,285: $8,700 plus 17% on income above $125,000
- $179,286+: 10% of total repayment income

Home Office Fixed Rate: $0.67 per hour (covers electricity, internet, phone, stationery, computer consumables).

Vehicle Deductions (2025-26):
- Cents-per-km method: $0.88 per km, maximum 5,000 business km per year (max deduction $4,400).
- Logbook method: total actual running costs x business-use percentage (no km cap). Requires a valid 12-week logbook.
- Typical total running cost for a car doing 30,000 km/year: ~$15,000-16,000 (fuel + insurance + rego + servicing + depreciation + loan interest + tolls).
- Always recommend logbook method when work kms exceed 5,000.

Commonwealth Rent Assistance (maximum fortnightly rates):
- Single, no children: $188.20/fortnight.
- Couple, no children: $177.20/fortnight.
- Single/couple with 1-2 children: $209.58/fortnight.
- Single/couple with 3+ children: $237.18/fortnight.

FHSS Scheme: max $15,000/year, $50,000 total in voluntary super contributions. Contributions taxed at 15% instead of marginal rate.

Super Co-contribution: government matches up to $500 for after-tax voluntary contributions. Full $500 for income up to $43,445, phasing out to $0 at $58,445.

GST Threshold: $75,000 annual turnover (must register). Below $75,000 is voluntary.

BAS Lodgement:
- Quarterly: due 28 days after quarter end (28 Oct, 28 Feb, 28 Apr, 28 Jul)
- Monthly: due 21 days after month end
- Annual: due with income tax return

Sole Trader Tax: Same individual rates, but must set aside for tax + super (12% from 1 July 2025).

Superannuation Guarantee Rate: 12% (from 1 July 2025).
Concessional Contributions Cap: $30,000 per year.

RESPONSE FORMAT:
Return a single JSON object matching this exact schema:

${REPORT_JSON_SCHEMA}

Populate every field. Use 0 for numeric fields that don't apply. Use empty arrays [] for list fields that don't apply. Use "N/A" for string fields that don't apply. The discoveries.items array may be empty if no discoveries are relevant, but always include the discoveries object with totalPotentialSavings of 0 in that case.`;
}

export function buildUserPrompt(answers: QuestionnaireAnswers): string {
  const lines: string[] = [
    `Generate a personalised financial discovery report for the ${siteConfig.financialYear} financial year based on these answers:`,
    "",
    `Employment: ${formatEmployment(answers.employment)}`,
  ];

  // Annual salary
  if (answers.annualSalary !== undefined) {
    lines.push(
      `Annual Salary (before tax): $${answers.annualSalary.toLocaleString("en-AU")}`
    );
  }

  // ABN & revenue
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

  // Work from home
  if (answers.workFromHome) {
    lines.push(`Works From Home: ${formatWorkFromHome(answers.workFromHome)}`);
    if (answers.workFromHomeHours !== undefined) {
      lines.push(
        `Work From Home Hours Per Week: ${answers.workFromHomeHours}`
      );
    }
  }

  // Car for work
  if (answers.carForWork) {
    lines.push(`Uses Own Car For Work: ${formatCarForWork(answers.carForWork)}`);
    if (answers.annualKms) {
      lines.push(
        `Total Annual Kilometres Driven (all purposes): ${formatAnnualKms(answers.annualKms)}`
      );
    }
    if (answers.estimatedWorkKms !== undefined) {
      lines.push(
        `Estimated Annual Work-Related Kilometres: ${answers.estimatedWorkKms.toLocaleString("en-AU")} km`
      );
    }
    if (answers.annualKms && answers.estimatedWorkKms !== undefined) {
      const midpoint = getAnnualKmsMidpoint(answers.annualKms);
      const businessPct = Math.min(
        100,
        Math.round((answers.estimatedWorkKms / midpoint) * 100)
      );
      lines.push(`Estimated Business-Use Percentage: ${businessPct}%`);
    }
  }

  // Private health insurance
  if (answers.privateHealth) {
    lines.push(
      `Private Health Insurance: ${formatPrivateHealth(answers.privateHealth)}`
    );
  }

  // HECS
  lines.push(`HECS-HELP Debt: ${formatHECS(answers.hecsDebt)}`);
  if (answers.hecsAmount !== undefined) {
    lines.push(
      `Estimated HECS Balance: $${answers.hecsAmount.toLocaleString("en-AU")}`
    );
  }

  // Personal debt
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

  // Housing
  if (answers.housingStatus) {
    lines.push(
      `Housing Situation: ${formatHousingStatus(answers.housingStatus)}`
    );
    if (answers.weeklyRent !== undefined) {
      lines.push(
        `Weekly Rent: $${answers.weeklyRent.toLocaleString("en-AU")}`
      );
    }
  }

  // Life situation
  if (answers.ageRange) {
    lines.push(`Age Range: ${formatAgeRange(answers.ageRange)}`);
  }
  if (answers.familyStatus) {
    lines.push(
      `Family Status: ${formatFamilyStatus(answers.familyStatus)}`
    );
  }

  lines.push(`Job Hunting: ${formatJobHunting(answers.jobHunting)}`);
  lines.push(`State/Territory: ${answers.state}`);

  // Estimated total income for discovery detection
  const estimatedIncome = estimateTotalIncome(answers);
  if (estimatedIncome > 0) {
    lines.push("");
    lines.push(
      `Estimated Total Annual Income: $${estimatedIncome.toLocaleString("en-AU")}`
    );
  }

  lines.push("");
  lines.push(
    `IMPORTANT: Start by identifying ALL financial discoveries (money on the table) relevant to this person's specific situation. Be conservative with amounts. Then provide the standard tax, BAS, deductions, debt, benefits, and actions sections.`
  );

  return lines.join("\n");
}

// --- Formatters ---

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

function formatABN(
  status: NonNullable<QuestionnaireAnswers["abnStatus"]>
): string {
  const map: Record<typeof status, string> = {
    has_abn: "Has an ABN",
    side_income_no_abn: "Has side income but no ABN",
    no: "No ABN",
  };
  return map[status];
}

function formatGST(
  status: NonNullable<QuestionnaireAnswers["gstStatus"]>
): string {
  const map: Record<typeof status, string> = {
    registered: "Registered for GST",
    not_registered: "Not registered for GST",
    unsure: "Unsure about GST registration",
  };
  return map[status];
}

function formatWorkFromHome(status: WorkFromHome): string {
  const map: Record<WorkFromHome, string> = {
    yes: "Yes, most days",
    sometimes: "Sometimes (1-2 days per week)",
    no: "No",
  };
  return map[status];
}

function formatCarForWork(status: CarForWork): string {
  const map: Record<CarForWork, string> = {
    yes: "Yes",
    no: "No",
  };
  return map[status];
}

function formatAnnualKms(range: AnnualKmsRange): string {
  const map: Record<AnnualKmsRange, string> = {
    under_5000: "Under 5,000 km/year",
    "5000_15000": "5,000 - 15,000 km/year",
    "15000_25000": "15,000 - 25,000 km/year",
    "25000_40000": "25,000 - 40,000 km/year",
    over_40000: "Over 40,000 km/year",
  };
  return map[range];
}

function getAnnualKmsMidpoint(range: AnnualKmsRange): number {
  const map: Record<AnnualKmsRange, number> = {
    under_5000: 3000,
    "5000_15000": 10000,
    "15000_25000": 20000,
    "25000_40000": 32500,
    over_40000: 45000,
  };
  return map[range];
}

function formatPrivateHealth(status: PrivateHealthInsurance): string {
  const map: Record<PrivateHealthInsurance, string> = {
    yes: "Yes, has private health insurance",
    no: "No private health insurance",
  };
  return map[status];
}

function formatHousingStatus(status: HousingStatus): string {
  const map: Record<HousingStatus, string> = {
    renting: "Renting",
    mortgage: "Paying a mortgage",
    neither: "Neither (living with family, etc.)",
  };
  return map[status];
}

function formatAgeRange(range: AgeRange): string {
  return range;
}

function formatFamilyStatus(status: FamilyStatus): string {
  const map: Record<FamilyStatus, string> = {
    single: "Single",
    partner_no_kids: "Partner, no kids",
    partner_with_kids: "Partner with kids",
    single_parent: "Single parent",
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

function formatDebtType(
  type: QuestionnaireAnswers["debts"][number]["type"]
): string {
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

/**
 * Estimate total annual income from available answers.
 * Used to give the AI a combined income figure for discovery detection.
 */
function estimateTotalIncome(answers: QuestionnaireAnswers): number {
  let total = 0;
  if (answers.annualSalary !== undefined) {
    total += answers.annualSalary;
  }
  if (answers.annualRevenue !== undefined) {
    total += answers.annualRevenue;
  }
  return total;
}
