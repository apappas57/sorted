// Australian Government Benefits and Programs - 2025-26 Financial Year
// Sources: ATO, Services Australia, business.gov.au
// These are general guides only - eligibility depends on individual circumstances.

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GovernmentBenefit {
  id: string;
  name: string;
  category: 'tax-offset' | 'payment' | 'concession' | 'business' | 'housing' | 'health' | 'energy';
  description: string;
  eligibility: string[];
  howToApply: string;
  estimatedValue: string;
  url: string;
  relevantTo: ('employee' | 'sole_trader' | 'both' | 'casual' | 'not_working')[];
}

// ─── Government Benefits ─────────────────────────────────────────────────────

/**
 * Australian government benefits and programs relevant to the Sorted user base.
 * Focused on working-age Australians in the "missing middle" - earning too much
 * for free help but not enough for professional financial advice.
 *
 * Amounts are approximate and subject to indexation and individual assessment.
 */
export const GOVERNMENT_BENEFITS: GovernmentBenefit[] = [
  // ── Tax Offsets ──────────────────────────────────────────────────────────

  {
    id: 'lito',
    name: 'Low Income Tax Offset (LITO)',
    category: 'tax-offset',
    description:
      'Automatic tax offset of up to $700 for individuals earning under $66,667. Applied when you lodge your tax return - no separate application needed.',
    eligibility: [
      'Taxable income of $66,667 or less',
      'Full $700 offset for income up to $37,500',
      'Gradually reduces between $37,501 and $66,667',
      'Australian resident for tax purposes',
    ],
    howToApply: 'Automatically applied when you lodge your tax return. No action required.',
    estimatedValue: 'Up to $700/year',
    url: 'https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/tax-offsets/low-income-tax-offset',
    relevantTo: ['employee', 'sole_trader', 'both', 'casual', 'not_working'],
  },

  // ── Business Concessions ─────────────────────────────────────────────────

  {
    id: 'instant-asset-writeoff',
    name: 'Instant Asset Write-Off ($20,000)',
    category: 'business',
    description:
      'Small businesses can immediately deduct the full cost of eligible assets costing less than $20,000 each. Applies per asset, so multiple assets can be claimed. Extended to 30 June 2026.',
    eligibility: [
      'Business with aggregated annual turnover under $10 million',
      'Asset costs less than $20,000 (before GST if registered)',
      'Asset is first used or installed ready for use between 1 July 2025 and 30 June 2026',
      'Both new and second-hand assets eligible',
    ],
    howToApply: 'Claim in your business tax return. No pre-approval needed.',
    estimatedValue: 'Up to $20,000 deduction per asset',
    url: 'https://www.ato.gov.au/businesses-and-organisations/small-business-newsroom/20000-instant-asset-write-off-for-2025-26',
    relevantTo: ['sole_trader', 'both'],
  },
  {
    id: 'small-business-income-tax-offset',
    name: 'Small Business Income Tax Offset',
    category: 'business',
    description:
      'Tax offset of up to $1,000 for individuals with business income from an unincorporated small business (sole trader or partnership). The offset is 16% of the tax on your net small business income.',
    eligibility: [
      'Individual (not a company) with small business income',
      'Business has aggregated turnover under $5 million',
      'Offset is 16% of the income tax on net small business income',
      'Maximum offset is $1,000',
    ],
    howToApply: 'Automatically calculated when you lodge your tax return.',
    estimatedValue: 'Up to $1,000/year',
    url: 'https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/small-business-tax-concessions/small-business-income-tax-offset',
    relevantTo: ['sole_trader', 'both'],
  },

  // ── Income Support Payments ──────────────────────────────────────────────

  {
    id: 'jobseeker',
    name: 'JobSeeker Payment',
    category: 'payment',
    description:
      'Fortnightly payment for people aged 22 to Age Pension age who are looking for work, or earning under the income threshold. Must meet mutual obligation requirements.',
    eligibility: [
      'Aged 22 to Age Pension age',
      'Australian resident',
      'Looking for work or unable to work due to illness/injury (short term)',
      'Meet income and assets tests',
      'Meet mutual obligation requirements (e.g. applying for jobs, attending appointments)',
    ],
    howToApply: 'Apply online through myGov linked to Centrelink, or call Services Australia on 132 850.',
    estimatedValue: 'Up to $802.50/fortnight (single, no children) - indexed March and September',
    url: 'https://www.servicesaustralia.gov.au/jobseeker-payment',
    relevantTo: ['not_working', 'casual'],
  },
  {
    id: 'youth-allowance',
    name: 'Youth Allowance (Job Seekers)',
    category: 'payment',
    description:
      'Payment for young people aged 16-21 who are looking for full-time work or undertaking approved activities.',
    eligibility: [
      'Aged 16 to 21',
      'Looking for full-time work',
      'Australian resident',
      'Meet income and assets tests',
      'Not receiving another income support payment',
    ],
    howToApply: 'Apply online through myGov linked to Centrelink.',
    estimatedValue: 'Up to $620.80/fortnight (single, 18+, living away from home) - indexed',
    url: 'https://www.servicesaustralia.gov.au/youth-allowance-for-job-seekers',
    relevantTo: ['not_working', 'casual'],
  },
  {
    id: 'youth-allowance-student',
    name: 'Youth Allowance (Students)',
    category: 'payment',
    description:
      'Payment for full-time students and apprentices aged 16-24.',
    eligibility: [
      'Aged 16 to 24 (or 25+ if started course before turning 25)',
      'Full-time student or Australian Apprentice',
      'Australian resident',
      'Meet income and assets tests',
    ],
    howToApply: 'Apply online through myGov linked to Centrelink.',
    estimatedValue: 'Up to $620.80/fortnight (single, 18+, living away from home) - indexed',
    url: 'https://www.servicesaustralia.gov.au/youth-allowance-for-students-and-australian-apprentices',
    relevantTo: ['not_working', 'casual', 'employee'],
  },

  // ── Housing ──────────────────────────────────────────────────────────────

  {
    id: 'rent-assistance',
    name: 'Commonwealth Rent Assistance',
    category: 'housing',
    description:
      'Additional payment to help with the cost of renting. Paid on top of an eligible income support payment, Family Tax Benefit Part A, or ABSTUDY.',
    eligibility: [
      'Receiving an eligible income support payment (JobSeeker, Youth Allowance, etc.)',
      'Paying rent above the minimum threshold',
      'Rent must be for your principal home',
      'Not living in government housing',
    ],
    howToApply: 'Automatically assessed when you claim an eligible payment and provide your rent details to Centrelink.',
    estimatedValue: 'Up to $219.40/fortnight (single, no children) - indexed',
    url: 'https://www.servicesaustralia.gov.au/rent-assistance',
    relevantTo: ['not_working', 'casual', 'employee', 'sole_trader', 'both'],
  },

  // ── Health ───────────────────────────────────────────────────────────────

  {
    id: 'health-care-card',
    name: 'Low Income Health Care Card',
    category: 'health',
    description:
      'Concession card providing cheaper medicines under the PBS, bulk-billed GP visits (at participating practices), and access to state and local government concessions.',
    eligibility: [
      'Australian resident',
      'Gross income under $797/week (single) or $1,362/week (couple combined)',
      'Not receiving an income support payment that provides a card automatically',
      'No assets test',
    ],
    howToApply: 'Apply online through myGov linked to Centrelink, or at a Services Australia centre.',
    estimatedValue: 'Saves $300-$1,500/year on medicines, utilities, and transport concessions',
    url: 'https://www.servicesaustralia.gov.au/low-income-health-care-card',
    relevantTo: ['employee', 'sole_trader', 'both', 'casual', 'not_working'],
  },
  {
    id: 'pbs-safety-net',
    name: 'PBS Safety Net',
    category: 'health',
    description:
      'Once you or your family spend a certain amount on PBS medicines in a calendar year, you get cheaper or free medicines for the rest of the year.',
    eligibility: [
      'Any Australian with a Medicare card',
      'General patients: once you spend $1,637.20 on PBS medicines in a calendar year, scripts drop to $7.70',
      'Concession card holders: once you reach $262.40 in a year, scripts are free',
      'Must keep records of all PBS medicines purchased',
    ],
    howToApply: 'Ask your pharmacy to record your PBS purchases on a Safety Net card or in the Express Plus Medicare app.',
    estimatedValue: 'Varies - can save hundreds if you take multiple medications',
    url: 'https://www.servicesaustralia.gov.au/pharmaceutical-benefits-scheme-safety-net-thresholds',
    relevantTo: ['employee', 'sole_trader', 'both', 'casual', 'not_working'],
  },

  // ── Energy ───────────────────────────────────────────────────────────────

  {
    id: 'energy-bill-relief',
    name: 'Energy Bill Relief Fund',
    category: 'energy',
    description:
      'Federal government rebate on electricity bills for households. For 2025-26, eligible concession card holders may receive relief. Check with your state or territory for current availability.',
    eligibility: [
      'Australian household connected to the electricity grid',
      'Concession card holder (from 2025-26 onwards)',
      'Applied automatically by your electricity provider in most cases',
    ],
    howToApply: 'Generally applied automatically to your electricity bill. Check your state government website for current status.',
    estimatedValue: 'Varies by state - previously $75-$150 per quarter',
    url: 'https://www.energy.gov.au/energy-bill-relief-fund',
    relevantTo: ['employee', 'sole_trader', 'both', 'casual', 'not_working'],
  },
  {
    id: 'state-energy-concessions',
    name: 'State Energy Concessions',
    category: 'energy',
    description:
      'Each state and territory offers energy concessions for eligible residents, typically concession card holders. Can include percentage discounts on bills, annual credits, or bonus payments.',
    eligibility: [
      'Hold an eligible concession card (Health Care Card, Pensioner Concession Card, DVA Gold Card)',
      'Residential electricity account in your name',
      'Requirements vary by state - check your state government website',
    ],
    howToApply: 'Contact your electricity provider with your concession card details, or apply through your state government website.',
    estimatedValue: '$100-$500/year depending on state',
    url: 'https://www.energy.gov.au/rebates',
    relevantTo: ['employee', 'sole_trader', 'both', 'casual', 'not_working'],
  },

  // ── Concessions ──────────────────────────────────────────────────────────

  {
    id: 'transport-concession',
    name: 'Public Transport Concession',
    category: 'concession',
    description:
      'Reduced fares on public transport. Available to concession card holders, students, and seniors. Varies by state.',
    eligibility: [
      'Hold a valid concession card, student ID, or seniors card',
      'Requirements vary by state and transport provider',
    ],
    howToApply: 'Apply for a concession Opal/Myki/Go Card through your state transport authority.',
    estimatedValue: '$200-$1,000/year depending on usage',
    url: 'https://www.servicesaustralia.gov.au/concession-and-health-care-cards',
    relevantTo: ['employee', 'sole_trader', 'both', 'casual', 'not_working'],
  },
  {
    id: 'vet-fee-free',
    name: 'Fee-Free TAFE and VET',
    category: 'concession',
    description:
      'Fee-free vocational education and training places in priority areas. Covers course fees for eligible students in selected qualifications.',
    eligibility: [
      'Australian citizen or permanent resident',
      'Priority given to: aged 17-24, First Nations, unpaid carers, people with disability, women in non-traditional fields',
      'Must be enrolled in an eligible course at a participating provider',
      'Limited places available - check availability',
    ],
    howToApply: 'Check eligible courses at your local TAFE or registered training organisation. Apply directly with the provider.',
    estimatedValue: '$2,000-$15,000 (course fees saved)',
    url: 'https://www.dewr.gov.au/skills-reform/fee-free-tafe',
    relevantTo: ['employee', 'sole_trader', 'both', 'casual', 'not_working'],
  },
];

// ─── Helper Functions ────────────────────────────────────────────────────────

/** Get benefits relevant to a specific employment type. */
export function getBenefitsForEmploymentType(
  employmentType: 'employee' | 'sole_trader' | 'both' | 'casual' | 'not_working'
): GovernmentBenefit[] {
  return GOVERNMENT_BENEFITS.filter((b) => b.relevantTo.includes(employmentType));
}

/** Get benefits by category. */
export function getBenefitsByCategory(
  category: GovernmentBenefit['category']
): GovernmentBenefit[] {
  return GOVERNMENT_BENEFITS.filter((b) => b.category === category);
}

/** Get a single benefit by ID. */
export function getBenefitById(id: string): GovernmentBenefit | undefined {
  return GOVERNMENT_BENEFITS.find((b) => b.id === id);
}

/**
 * Estimate which benefits a user might be eligible for based on
 * basic inputs. Returns { eligible, possiblyEligible } arrays.
 */
export function estimateBenefitEligibility(input: {
  employmentType: 'employee' | 'sole_trader' | 'both' | 'casual' | 'not_working';
  annualIncome: number;
  isJobHunting: boolean;
  hasABN: boolean;
}): { eligible: GovernmentBenefit[]; possiblyEligible: GovernmentBenefit[] } {
  const eligible: GovernmentBenefit[] = [];
  const possiblyEligible: GovernmentBenefit[] = [];

  for (const benefit of GOVERNMENT_BENEFITS) {
    if (!benefit.relevantTo.includes(input.employmentType)) continue;

    switch (benefit.id) {
      case 'lito':
        if (input.annualIncome <= 66_667) eligible.push(benefit);
        break;
      case 'instant-asset-writeoff':
      case 'small-business-income-tax-offset':
        if (input.hasABN) eligible.push(benefit);
        break;
      case 'jobseeker':
        if (input.isJobHunting && input.employmentType === 'not_working') {
          possiblyEligible.push(benefit);
        }
        break;
      case 'youth-allowance':
        if (input.isJobHunting) possiblyEligible.push(benefit);
        break;
      case 'health-care-card':
        if (input.annualIncome <= 41_444) eligible.push(benefit); // ~$797/wk
        else if (input.annualIncome <= 52_000) possiblyEligible.push(benefit);
        break;
      case 'rent-assistance':
        if (input.employmentType === 'not_working') possiblyEligible.push(benefit);
        break;
      case 'energy-bill-relief':
      case 'state-energy-concessions':
        if (input.annualIncome <= 41_444) possiblyEligible.push(benefit);
        break;
      default:
        // Other benefits are informational
        if (benefit.relevantTo.includes(input.employmentType)) {
          possiblyEligible.push(benefit);
        }
    }
  }

  return { eligible, possiblyEligible };
}
