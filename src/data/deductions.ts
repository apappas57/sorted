// Common Tax Deductions for Australians - 2025-26 Financial Year
// Source: ATO - Deductions you can claim
// https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Deduction {
  name: string;
  description: string;
  typicalRange: string; // Human-readable estimate, e.g. "$200-$500"
  requirements: string[];
  atoLink?: string;
}

export interface DeductionCategory {
  id: string;
  name: string;
  icon: string; // emoji for UI display
  description: string;
  deductions: Deduction[];
}

// ─── Deduction Categories ────────────────────────────────────────────────────

/**
 * Tax deductions organised by category with typical ranges and ATO requirements.
 * All amounts are estimates only. Actual deductions depend on individual circumstances.
 *
 * Source: ATO - Deductions you can claim
 * https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim
 */
export const DEDUCTIONS_BY_TYPE = [
  {
    id: 'home-office',
    name: 'Home Office',
    icon: 'home',
    description: 'Expenses for working from home, including a dedicated workspace.',
    deductions: [
      {
        name: 'Fixed rate method',
        description:
          'Claim 67 cents per hour worked from home. Covers energy, phone, internet, stationery, and computer consumables.',
        typicalRange: '$500-$1,500/year',
        requirements: [
          'Keep a record of hours worked from home (e.g. timesheet, diary, roster)',
          'Must be working from home to fulfil employment duties, not just checking emails',
          'Cannot claim separate deductions for items covered by the 67c rate',
        ],
        atoLink:
          'https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/working-from-home-expenses/fixed-rate-method',
      },
      {
        name: 'Actual cost method',
        description:
          'Claim the actual costs of working from home. Requires detailed records of every expense.',
        typicalRange: '$1,000-$3,000/year',
        requirements: [
          'Receipts or bills for every expense claimed',
          'Diary of hours worked from home for at least a representative 4-week period',
          'Calculate the work-related portion of each expense',
          'Depreciation records for assets (desk, chair, computer)',
        ],
        atoLink:
          'https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/working-from-home-expenses/actual-cost-method',
      },
      {
        name: 'Office furniture and equipment',
        description:
          'Desk, chair, monitor, keyboard, and other equipment used for work. Items over $300 must be depreciated.',
        typicalRange: '$200-$2,000',
        requirements: [
          'Must be used for work purposes',
          'Items under $300 can be claimed in full immediately',
          'Items $300+ must be depreciated over their effective life',
          'Apportion if also used for personal purposes',
        ],
      },
    ],
  },
  {
    id: 'vehicle',
    name: 'Vehicle and Travel',
    icon: 'car',
    description: 'Work-related vehicle expenses for travel between work sites (not home to work commuting).',
    deductions: [
      {
        name: 'Cents per kilometre method',
        description:
          'Claim 88 cents per km for work-related travel, up to 5,000 km per year. No written evidence required but must be reasonable.',
        typicalRange: '$500-$4,400/year',
        requirements: [
          'Maximum 5,000 business km per year under this method',
          'Must be able to show how you calculated your business km',
          'Rate is 88 cents per km for 2025-26',
          'Does NOT include travel from home to your regular workplace',
        ],
        atoLink:
          'https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/vehicle-and-travel-expenses/motor-vehicle-expenses/cents-per-kilometre-method',
      },
      {
        name: 'Logbook method',
        description:
          'Claim the business-use percentage of actual car expenses. Requires a logbook kept for at least 12 continuous weeks.',
        typicalRange: '$2,000-$8,000/year',
        requirements: [
          'Keep a logbook for a minimum 12-week period',
          'Logbook is valid for 5 years (unless circumstances change)',
          'Keep all receipts for fuel, insurance, registration, maintenance, depreciation',
          'Calculate business-use percentage from logbook',
        ],
        atoLink:
          'https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/vehicle-and-travel-expenses/motor-vehicle-expenses/logbook-method',
      },
      {
        name: 'Parking and tolls',
        description:
          'Parking fees and tolls for work-related travel (not at your regular workplace).',
        typicalRange: '$200-$1,500/year',
        requirements: [
          'Must be for work-related travel, not commuting',
          'Keep receipts',
          'Parking at your regular workplace is NOT deductible',
        ],
      },
    ],
  },
  {
    id: 'tools',
    name: 'Tools and Equipment',
    icon: 'wrench',
    description: 'Tools, equipment, and technology required for work.',
    deductions: [
      {
        name: 'Tools of trade',
        description:
          'Hand tools, power tools, and equipment required for your job. Items under $300 claimed immediately; over $300 depreciated.',
        typicalRange: '$200-$5,000/year',
        requirements: [
          'Must be required for your work',
          'Items under $300: claim in full in the year of purchase',
          'Items $300+: depreciate over the effective life',
          'Keep receipts for all purchases',
        ],
      },
      {
        name: 'Computer and laptop',
        description:
          'Laptops, tablets, and computers used for work. Apportion if also used personally.',
        typicalRange: '$300-$2,500',
        requirements: [
          'Apportion between work and personal use',
          'Under $300: claim in full',
          'Over $300: depreciate (effective life 4 years for laptops)',
          'Keep a record of work-use percentage',
        ],
      },
      {
        name: 'Software and subscriptions',
        description:
          'Work-related software, cloud services, and digital subscriptions.',
        typicalRange: '$100-$1,000/year',
        requirements: [
          'Must be directly related to earning your income',
          'Apportion if partly personal',
          'Keep receipts or bank statements',
        ],
      },
    ],
  },
  {
    id: 'uniform',
    name: 'Clothing and Uniform',
    icon: 'shirt',
    description: 'Work uniforms, protective clothing, and laundry costs.',
    deductions: [
      {
        name: 'Compulsory uniform',
        description:
          'Clothing your employer requires you to wear that is unique and distinctive to the organisation.',
        typicalRange: '$150-$500/year',
        requirements: [
          'Must be compulsory to wear',
          'Must be unique and distinctive to the employer (e.g. logo)',
          'Conventional clothing (e.g. black pants, white shirt) is NOT deductible',
          'Keep receipts',
        ],
      },
      {
        name: 'Protective clothing',
        description:
          'Steel-capped boots, high-vis vests, hard hats, sun protection, and other occupation-specific protective gear.',
        typicalRange: '$100-$1,000/year',
        requirements: [
          'Must provide protection against risk of illness or injury',
          'Must be required for your work',
          'Sunglasses, sunscreen, and hats count if you work outdoors',
          'Keep receipts',
        ],
      },
      {
        name: 'Laundry and dry cleaning',
        description:
          'Costs of washing, drying, and ironing eligible work clothing. Claim $1 per load if mixed with personal items, or $2 per load if only work clothes.',
        typicalRange: '$50-$300/year',
        requirements: [
          'Only for eligible work clothing (uniforms, protective gear)',
          'Can claim up to $150 without written evidence',
          'Over $150 total laundry claims: need a diary or similar record',
          '$1/load (mixed) or $2/load (work-only)',
        ],
      },
    ],
  },
  {
    id: 'phone-internet',
    name: 'Phone and Internet',
    icon: 'phone',
    description: 'Work-related phone, mobile, and internet expenses.',
    deductions: [
      {
        name: 'Mobile phone',
        description:
          'Work-related portion of your mobile phone bill and handset costs.',
        typicalRange: '$200-$800/year',
        requirements: [
          'Apportion between work and personal use',
          'Keep phone bills showing work-related calls/data',
          'Keep a diary for a representative 4-week period to establish work-use %',
          'Handset: depreciate over 3 years if over $300',
        ],
      },
      {
        name: 'Internet',
        description:
          'Work-related portion of home internet costs.',
        typicalRange: '$100-$500/year',
        requirements: [
          'Apportion between work and personal use',
          'Cannot claim if already using the fixed-rate method for home office',
          'Keep a diary for a 4-week representative period',
          'Keep internet bills',
        ],
      },
    ],
  },
  {
    id: 'travel',
    name: 'Work Travel',
    icon: 'plane',
    description: 'Travel expenses for work, including overnight trips and meals.',
    deductions: [
      {
        name: 'Overnight travel',
        description:
          'Accommodation, meals, and incidentals when travelling overnight for work.',
        typicalRange: '$500-$5,000/year',
        requirements: [
          'Must be travelling for work purposes',
          'Keep receipts for accommodation and meals',
          'Can use ATO reasonable travel allowance amounts as a guide',
          'Travel diary required for trips of 6+ nights',
        ],
      },
      {
        name: 'Public transport and rideshare',
        description:
          'Fares for work-related travel (not regular commuting).',
        typicalRange: '$100-$1,000/year',
        requirements: [
          'Must be for work-related travel',
          'Not for travel between home and regular workplace',
          'Keep receipts or transaction records',
        ],
      },
    ],
  },
  {
    id: 'professional-development',
    name: 'Professional Development',
    icon: 'book',
    description: 'Self-education and professional development related to your current work.',
    deductions: [
      {
        name: 'Self-education expenses',
        description:
          'Course fees, textbooks, and study materials for education directly related to your current job.',
        typicalRange: '$500-$5,000/year',
        requirements: [
          'Must relate to your current employment (not a new career)',
          'Must maintain or improve skills for your current role',
          'Course fees, textbooks, stationery, student union fees are all claimable',
          'Travel to education institution is claimable',
        ],
        atoLink:
          'https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/self-education-expenses',
      },
      {
        name: 'Professional memberships and subscriptions',
        description:
          'Fees for professional associations, journals, and publications related to your work.',
        typicalRange: '$100-$500/year',
        requirements: [
          'Must be directly related to your work',
          'Union fees are deductible',
          'Professional journal subscriptions',
          'Keep receipts or statements',
        ],
      },
      {
        name: 'Conferences and seminars',
        description:
          'Registration fees and travel costs for work-related conferences.',
        typicalRange: '$200-$3,000/year',
        requirements: [
          'Must be directly related to your current work',
          'Keep registration receipts and travel records',
          'Meals and accommodation during conferences are claimable',
        ],
      },
    ],
  },
  {
    id: 'insurance',
    name: 'Insurance and Financial',
    icon: 'shield',
    description: 'Work-related insurance premiums and financial costs.',
    deductions: [
      {
        name: 'Income protection insurance',
        description:
          'Premiums for income protection insurance (not through super). Policies that pay a regular income if you cannot work due to illness or injury.',
        typicalRange: '$500-$2,000/year',
        requirements: [
          'Must be a policy that replaces income (not lump sum)',
          'Premiums paid through super are NOT claimable as a personal deduction',
          'Keep premium notices or receipts',
        ],
      },
      {
        name: 'Professional indemnity insurance',
        description:
          'Insurance premiums to protect against professional liability claims.',
        typicalRange: '$200-$2,000/year',
        requirements: [
          'Must be required for your work',
          'Keep premium receipts',
        ],
      },
      {
        name: 'Tax agent fees',
        description:
          'Fees paid to a registered tax agent for managing your tax affairs.',
        typicalRange: '$150-$500/year',
        requirements: [
          'Claimed in the year you pay the fee (not the year the return is for)',
          'Keep receipts from your tax agent',
        ],
      },
    ],
  },
  {
    id: 'sole-trader',
    name: 'Sole Trader / Business',
    icon: 'briefcase',
    description: 'Additional deductions available to sole traders and small businesses.',
    deductions: [
      {
        name: 'Business operating expenses',
        description:
          'Rent, utilities, insurance, and other costs of running your business.',
        typicalRange: '$1,000-$20,000/year',
        requirements: [
          'Must be incurred in running your business',
          'Apportion if premises are shared with personal use',
          'Keep all receipts and records for 5 years',
        ],
      },
      {
        name: 'Instant asset write-off',
        description:
          'Immediately deduct assets costing less than $20,000 (per asset) for businesses with turnover under $10M.',
        typicalRange: 'Up to $20,000 per asset',
        requirements: [
          'Aggregated turnover under $10 million',
          'Asset costs less than $20,000',
          'Asset must be first used or installed ready for use by 30 June 2026',
          'Both new and second-hand assets eligible',
        ],
        atoLink:
          'https://www.ato.gov.au/businesses-and-organisations/small-business-newsroom/20000-instant-asset-write-off-for-2025-26',
      },
      {
        name: 'Advertising and marketing',
        description:
          'Costs of advertising your business, including website, social media, and print.',
        typicalRange: '$200-$5,000/year',
        requirements: [
          'Must be for promoting your business',
          'Keep invoices and receipts',
          'Website hosting and domain fees included',
        ],
      },
      {
        name: 'Superannuation contributions',
        description:
          'Personal super contributions for sole traders. Concessional contributions up to $30,000/year are tax-deductible.',
        typicalRange: '$1,000-$30,000/year',
        requirements: [
          'Must lodge a notice of intent to claim with your super fund',
          'Super fund must acknowledge the notice before you lodge your tax return',
          'Concessional cap: $30,000 per year (2025-26)',
          'Unused cap amounts from prior years may be carried forward',
        ],
      },
    ],
  },
] satisfies DeductionCategory[];

// ─── Deductions by Business Type ─────────────────────────────────────────────

export interface BusinessTypeDeductions {
  type: string;
  label: string;
  description: string;
  relevantCategories: string[]; // IDs from DEDUCTIONS_BY_TYPE
  topDeductions: string[]; // Specific deduction names most relevant to this type
}

/**
 * Maps common business/work types to their most relevant deduction categories.
 * Used to personalise the report based on the user's employment type.
 */
export const DEDUCTIONS_BY_BUSINESS_TYPE = [
  {
    type: 'trades',
    label: 'Trades (plumber, electrician, builder, etc.)',
    description: 'Physical trade work, often mobile with tools and vehicles.',
    relevantCategories: ['vehicle', 'tools', 'uniform', 'sole-trader', 'insurance'],
    topDeductions: [
      'Tools of trade',
      'Protective clothing',
      'Logbook method',
      'Instant asset write-off',
      'Laundry and dry cleaning',
      'Income protection insurance',
    ],
  },
  {
    type: 'it-digital',
    label: 'IT / Digital / Tech',
    description: 'Software development, web design, IT support, digital marketing.',
    relevantCategories: ['home-office', 'tools', 'phone-internet', 'professional-development', 'sole-trader'],
    topDeductions: [
      'Fixed rate method',
      'Computer and laptop',
      'Software and subscriptions',
      'Self-education expenses',
      'Professional memberships and subscriptions',
      'Internet',
    ],
  },
  {
    type: 'creative',
    label: 'Creative (designer, photographer, writer)',
    description: 'Creative and artistic work, often freelance with specialised equipment.',
    relevantCategories: ['home-office', 'tools', 'sole-trader', 'professional-development', 'travel'],
    topDeductions: [
      'Computer and laptop',
      'Software and subscriptions',
      'Actual cost method',
      'Instant asset write-off',
      'Advertising and marketing',
      'Conferences and seminars',
    ],
  },
  {
    type: 'driver',
    label: 'Driver (rideshare, delivery, transport)',
    description: 'Driving-based work with high vehicle usage.',
    relevantCategories: ['vehicle', 'phone-internet', 'uniform', 'insurance', 'sole-trader'],
    topDeductions: [
      'Logbook method',
      'Parking and tolls',
      'Mobile phone',
      'Protective clothing',
      'Income protection insurance',
      'Business operating expenses',
    ],
  },
  {
    type: 'retail-hospitality',
    label: 'Retail / Hospitality',
    description: 'Customer-facing roles in shops, restaurants, cafes, and bars.',
    relevantCategories: ['uniform', 'travel', 'professional-development', 'phone-internet'],
    topDeductions: [
      'Compulsory uniform',
      'Laundry and dry cleaning',
      'Protective clothing',
      'Self-education expenses',
      'Public transport and rideshare',
    ],
  },
  {
    type: 'healthcare',
    label: 'Healthcare (nurse, allied health, carer)',
    description: 'Medical and health professionals.',
    relevantCategories: ['uniform', 'professional-development', 'vehicle', 'insurance', 'tools'],
    topDeductions: [
      'Protective clothing',
      'Self-education expenses',
      'Professional memberships and subscriptions',
      'Compulsory uniform',
      'Cents per kilometre method',
      'Income protection insurance',
    ],
  },
  {
    type: 'office-admin',
    label: 'Office / Admin / Professional',
    description: 'Office-based professional work, may include some WFH.',
    relevantCategories: ['home-office', 'phone-internet', 'professional-development', 'insurance', 'tools'],
    topDeductions: [
      'Fixed rate method',
      'Computer and laptop',
      'Self-education expenses',
      'Professional memberships and subscriptions',
      'Tax agent fees',
      'Mobile phone',
    ],
  },
] satisfies BusinessTypeDeductions[];

// ─── Helper Functions ────────────────────────────────────────────────────────

/** Get deduction categories relevant to a specific business type. */
export function getDeductionsForBusinessType(businessType: string): DeductionCategory[] {
  const mapping = DEDUCTIONS_BY_BUSINESS_TYPE.find((b) => b.type === businessType);
  if (!mapping) return DEDUCTIONS_BY_TYPE;

  return DEDUCTIONS_BY_TYPE.filter((cat) =>
    mapping.relevantCategories.includes(cat.id)
  );
}

/** Get all deduction category IDs. */
export function getAllDeductionCategoryIds(): string[] {
  return DEDUCTIONS_BY_TYPE.map((cat) => cat.id);
}

/** Look up a single deduction category by ID. */
export function getDeductionCategory(id: string): DeductionCategory | undefined {
  return DEDUCTIONS_BY_TYPE.find((cat) => cat.id === id);
}
