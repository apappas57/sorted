// Australian States and Territories - Tax and Benefit Information
// Source: State revenue offices, state government websites
// Data accurate for 2025-26 financial year

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StateBenefit {
  name: string;
  description: string;
  url: string;
}

export interface AustralianState {
  code: string;
  name: string;
  payrollTax: {
    threshold: number; // Annual threshold below which no payroll tax applies
    rate: number; // Decimal, e.g. 0.0545 = 5.45%
    note?: string;
  };
  specificBenefits: StateBenefit[];
  revenueOfficeUrl: string;
}

// ─── State Data ──────────────────────────────────────────────────────────────

/**
 * Australian states and territories with payroll tax thresholds
 * and state-specific concessions and benefits.
 *
 * Payroll tax is paid by EMPLOYERS, not employees. Included here
 * because sole traders with staff need to know their obligations.
 *
 * Sources:
 * - NSW: https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/payroll-tax
 * - VIC: https://www.sro.vic.gov.au/payroll-tax
 * - QLD: https://www.qld.gov.au/running-a-business/employing/payroll-tax
 * - SA: https://www.revenuesa.sa.gov.au/payrolltax
 * - WA: https://www.wa.gov.au/organisation/department-of-finance/payroll-tax
 * - TAS: https://www.sro.tas.gov.au/payroll-tax
 * - NT: https://treasury.nt.gov.au/dtf/revenue/payroll-tax
 * - ACT: https://www.revenue.act.gov.au/payroll-tax
 */
export const AUSTRALIAN_STATES = [
  {
    code: 'NSW',
    name: 'New South Wales',
    payrollTax: {
      threshold: 1_200_000,
      rate: 0.0545,
    },
    specificBenefits: [
      {
        name: 'Energy Bill Relief',
        description:
          'National Energy Bill Relief credits for eligible households. Applied automatically to electricity bills.',
        url: 'https://www.energy.nsw.gov.au/households/grants-rebates/national-energy-bill-relief',
      },
      {
        name: 'Low Income Household Rebate',
        description:
          'Annual rebate on electricity bills for eligible low-income households and concession card holders.',
        url: 'https://www.energy.nsw.gov.au/households/grants-rebates/low-income-household-rebate',
      },
      {
        name: 'Active Kids Voucher',
        description:
          '$100 voucher per child per year for sport and fitness activities.',
        url: 'https://www.service.nsw.gov.au/transaction/apply-active-kids-voucher',
      },
      {
        name: 'Toll Relief',
        description:
          'Cashback on tolls for eligible drivers who spend over $60/week on Sydney tolls.',
        url: 'https://www.service.nsw.gov.au/transaction/apply-toll-relief',
      },
      {
        name: 'First Home Buyer Assistance',
        description:
          'Stamp duty exemption for properties up to $800,000 and concessions up to $1,000,000 for first home buyers.',
        url: 'https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer',
      },
    ],
    revenueOfficeUrl: 'https://www.revenue.nsw.gov.au',
  },
  {
    code: 'VIC',
    name: 'Victoria',
    payrollTax: {
      threshold: 1_000_000,
      rate: 0.0485,
      note: 'Threshold increased from $900,000 to $1,000,000 from 1 July 2025.',
    },
    specificBenefits: [
      {
        name: 'Power Saving Bonus',
        description:
          '$100 bonus for eligible concession card holders who compare energy deals through Victorian Energy Compare.',
        url: 'https://www.energy.vic.gov.au/for-households/power-saving-bonus-program',
      },
      {
        name: 'Victorian Energy Concession (17.5%)',
        description:
          '17.5% off electricity and gas bills for concession card holders. Applied to both usage and supply charges.',
        url: 'https://www.energy.vic.gov.au/households/help-paying-your-energy-bills',
      },
      {
        name: 'Utility Relief Grant',
        description:
          'Up to $650 towards overdue utility bills for those experiencing hardship.',
        url: 'https://services.dffh.vic.gov.au/utility-relief-grant-scheme',
      },
      {
        name: 'Victorian Homebuyer Fund',
        description:
          'Shared equity scheme where the Victorian Government contributes up to 25% of the purchase price.',
        url: 'https://www.sro.vic.gov.au/homebuyer',
      },
      {
        name: 'Free TAFE',
        description:
          'Fee-free TAFE courses in priority areas for eligible Victorians.',
        url: 'https://www.vic.gov.au/free-tafe',
      },
    ],
    revenueOfficeUrl: 'https://www.sro.vic.gov.au',
  },
  {
    code: 'QLD',
    name: 'Queensland',
    payrollTax: {
      threshold: 1_300_000,
      rate: 0.0475,
    },
    specificBenefits: [
      {
        name: 'Electricity Rebate',
        description:
          'Annual electricity rebate for eligible concession card holders in Queensland.',
        url: 'https://www.qld.gov.au/community/cost-of-living-support/concessions/energy-concessions/electricity-rebate',
      },
      {
        name: 'Cost of Living Rebate',
        description:
          'Rebate on electricity bills for Queensland households, applied automatically.',
        url: 'https://www.qld.gov.au/community/cost-of-living-support/concessions/energy-concessions',
      },
      {
        name: 'First Home Owner Grant',
        description:
          '$30,000 grant for eligible first home owners buying or building a new home valued at less than $750,000.',
        url: 'https://www.qld.gov.au/housing/buying-owning-home/financial-help-to-buy-home/first-home-owner-grant',
      },
      {
        name: 'Back to School Vouchers',
        description:
          'Vouchers to help families with the cost of school supplies.',
        url: 'https://www.qld.gov.au/education/schools/financial-help',
      },
    ],
    revenueOfficeUrl: 'https://www.treasury.qld.gov.au/taxation/',
  },
  {
    code: 'SA',
    name: 'South Australia',
    payrollTax: {
      threshold: 1_500_000,
      rate: 0.0495,
    },
    specificBenefits: [
      {
        name: 'Energy Concession',
        description:
          'Annual energy concession for eligible concession card holders. Applied directly to your electricity bill.',
        url: 'https://www.sa.gov.au/topics/energy-and-environment/financial-support-for-energy-bills',
      },
      {
        name: 'Cost of Living Concession',
        description:
          'Annual payment to help with the cost of living for eligible South Australians on low incomes.',
        url: 'https://www.sa.gov.au/topics/care-and-support/financial-support/concessions/cost-of-living-concession',
      },
      {
        name: 'HomeStart Loans',
        description:
          'Low deposit home loans for South Australians, including options with only 2% deposit.',
        url: 'https://www.homestart.com.au',
      },
      {
        name: 'First Home Owner Grant',
        description:
          '$15,000 grant for eligible first home owners building or buying a new home.',
        url: 'https://www.revenuesa.sa.gov.au/grants-and-concessions/first-home-owner-grant',
      },
    ],
    revenueOfficeUrl: 'https://www.revenuesa.sa.gov.au',
  },
  {
    code: 'WA',
    name: 'Western Australia',
    payrollTax: {
      threshold: 1_000_000,
      rate: 0.055,
    },
    specificBenefits: [
      {
        name: 'Household Electricity Credit',
        description:
          'Credit applied to Synergy or Horizon Power residential accounts for eligible households.',
        url: 'https://www.wa.gov.au/government/publications/household-electricity-credit',
      },
      {
        name: 'Energy Assistance Payment',
        description:
          'Annual payment for WA concession card holders to help with energy costs.',
        url: 'https://www.wa.gov.au/service/community-services/grants-and-subsidies/energy-assistance-payment',
      },
      {
        name: 'First Home Owner Grant',
        description:
          '$10,000 grant for first home buyers purchasing or building a new home.',
        url: 'https://www.wa.gov.au/organisation/department-of-finance/first-home-owner-grant',
      },
      {
        name: 'Keystart Home Loans',
        description:
          'Low deposit home loans (2%) for Western Australians who may not qualify with traditional lenders.',
        url: 'https://www.keystart.com.au',
      },
    ],
    revenueOfficeUrl: 'https://www.wa.gov.au/organisation/department-of-finance',
  },
  {
    code: 'TAS',
    name: 'Tasmania',
    payrollTax: {
      threshold: 1_250_000,
      rate: 0.04,
    },
    specificBenefits: [
      {
        name: 'Energy Concession',
        description:
          'Annual rebate on Aurora Energy bills for eligible concession card holders.',
        url: 'https://www.communities.tas.gov.au/concessions-and-financial-assistance',
      },
      {
        name: 'First Home Owner Grant',
        description:
          '$30,000 grant for eligible first home buyers purchasing or building a new home in Tasmania.',
        url: 'https://www.sro.tas.gov.au/first-home-owner',
      },
      {
        name: 'MyHome Shared Equity',
        description:
          'Tasmanian Government contributes up to 30% of the property price through a shared equity arrangement.',
        url: 'https://www.homes.tas.gov.au/home-ownership/myhome',
      },
    ],
    revenueOfficeUrl: 'https://www.sro.tas.gov.au',
  },
  {
    code: 'NT',
    name: 'Northern Territory',
    payrollTax: {
      threshold: 1_500_000,
      rate: 0.055,
    },
    specificBenefits: [
      {
        name: 'Electricity Concession',
        description:
          'Electricity concession for eligible concession card holders in the Northern Territory.',
        url: 'https://nt.gov.au/community/concessions-and-payments',
      },
      {
        name: 'First Home Owner Grant',
        description:
          '$10,000 grant for first home buyers in the Northern Territory.',
        url: 'https://treasury.nt.gov.au/dtf/revenue/first-home-owner-grant-scheme',
      },
      {
        name: 'HomeBuild Access',
        description:
          'Up to $20,000 grant for Territorians building a new home.',
        url: 'https://nt.gov.au/property/homeowner-assistance',
      },
    ],
    revenueOfficeUrl: 'https://treasury.nt.gov.au/dtf/revenue',
  },
  {
    code: 'ACT',
    name: 'Australian Capital Territory',
    payrollTax: {
      threshold: 2_000_000,
      rate: 0.0685,
    },
    specificBenefits: [
      {
        name: 'Energy Bill Relief',
        description:
          'Energy bill relief for eligible ACT households, applied directly to electricity bills.',
        url: 'https://www.actewagl.com.au/help-and-support/concessions-and-rebates/energy-bill-relief-fund',
      },
      {
        name: 'Utilities Concession',
        description:
          'Annual rebate on utilities for eligible concession card holders in the ACT.',
        url: 'https://www.revenue.act.gov.au/community-assistance/utilities-concession',
      },
      {
        name: 'Home Buyer Concession Scheme',
        description:
          'Stamp duty concession for eligible home buyers in the ACT. Full exemption for properties up to the threshold.',
        url: 'https://www.revenue.act.gov.au/home-buyer-assistance/home-buyer-concession-scheme',
      },
      {
        name: 'Sustainable Household Scheme',
        description:
          'Interest-free loans for rooftop solar, batteries, EV chargers, and energy-efficient appliances.',
        url: 'https://www.climatechoices.act.gov.au/policy-programs/sustainable-household-scheme',
      },
    ],
    revenueOfficeUrl: 'https://www.revenue.act.gov.au',
  },
] satisfies AustralianState[];

// ─── Helper Functions ────────────────────────────────────────────────────────

/** Get state data by code (e.g. 'VIC', 'NSW'). */
export function getStateByCode(code: string): AustralianState | undefined {
  return AUSTRALIAN_STATES.find(
    (s) => s.code === code.toUpperCase()
  );
}

/** Get all state codes. */
export function getStateCodes(): string[] {
  return AUSTRALIAN_STATES.map((s) => s.code);
}

/** Get state names for dropdown options. */
export function getStateOptions(): { value: string; label: string }[] {
  return AUSTRALIAN_STATES.map((s) => ({
    value: s.code,
    label: `${s.name} (${s.code})`,
  }));
}

/** Check if a business exceeds the payroll tax threshold for a given state. */
export function exceedsPayrollTaxThreshold(
  stateCode: string,
  annualWagesBill: number
): boolean {
  const state = getStateByCode(stateCode);
  if (!state) return false;
  return annualWagesBill > state.payrollTax.threshold;
}

/** Get state-specific benefits for a given state code. */
export function getStateBenefits(stateCode: string): StateBenefit[] {
  const state = getStateByCode(stateCode);
  return state?.specificBenefits ?? [];
}
