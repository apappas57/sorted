// Australian Tax Data for 2025-26 Financial Year (1 July 2025 - 30 June 2026)
// Source: ATO - Tax rates for Australian residents
// https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents

// ─── Income Tax Brackets ─────────────────────────────────────────────────────

export interface TaxBracket {
  min: number;
  max: number | null; // null = no upper limit
  rate: number; // decimal, e.g. 0.16 = 16%
  base: number; // cumulative tax from lower brackets
}

/**
 * Individual income tax rates for Australian residents, 2025-26.
 * These do NOT include the Medicare levy (2%).
 *
 * Source: ATO 2025-26 resident tax rates
 * https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents
 */
export const TAX_BRACKETS_2025_26 = [
  { min: 0, max: 18_200, rate: 0, base: 0 },
  { min: 18_201, max: 45_000, rate: 0.16, base: 0 },
  { min: 45_001, max: 135_000, rate: 0.30, base: 4_288 },
  { min: 135_001, max: 190_000, rate: 0.37, base: 31_288 },
  { min: 190_001, max: null, rate: 0.45, base: 51_638 },
] satisfies TaxBracket[];

/** Tax-free threshold for Australian residents. */
export const TAX_FREE_THRESHOLD = 18_200 as const;

// ─── Medicare Levy ───────────────────────────────────────────────────────────

/**
 * Medicare levy rate applied on top of income tax.
 * Source: ATO - Medicare levy
 * https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy
 */
export const MEDICARE_LEVY_RATE = 0.02 as const;

/**
 * Medicare levy reduction thresholds for low-income earners (2025-26).
 * Below the lower threshold, no Medicare levy is payable.
 * Between lower and upper, a reduced rate applies.
 *
 * Source: ATO - Medicare levy reduction for low-income earners
 * https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy/medicare-levy-reduction
 */
export const MEDICARE_LEVY_REDUCTION = {
  singleLowerThreshold: 26_000,
  singleUpperThreshold: 32_500,
  familyLowerThreshold: 43_846,
  familyUpperThreshold: 54_808,
  additionalChildAmount: 4_027,
} as const;

// ─── Medicare Levy Surcharge ─────────────────────────────────────────────────

export interface MedicareLevySurchargeTier {
  tier: number;
  singleMin: number;
  singleMax: number | null;
  familyMin: number;
  familyMax: number | null;
  rate: number; // decimal
}

/**
 * Medicare Levy Surcharge (MLS) tiers for 2025-26.
 * Applies to taxpayers without private hospital cover whose income
 * exceeds the base threshold.
 *
 * Family thresholds increase by $1,500 per dependent child after the first.
 *
 * Source: ATO - Medicare levy surcharge income, thresholds and rates
 * https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge/medicare-levy-surcharge-income-thresholds-and-rates
 */
export const MEDICARE_LEVY_SURCHARGE = [
  {
    tier: 0,
    singleMin: 0,
    singleMax: 100_999,
    familyMin: 0,
    familyMax: 201_999,
    rate: 0,
  },
  {
    tier: 1,
    singleMin: 101_000,
    singleMax: 117_999,
    familyMin: 202_000,
    familyMax: 235_999,
    rate: 0.01,
  },
  {
    tier: 2,
    singleMin: 118_000,
    singleMax: 157_999,
    familyMin: 236_000,
    familyMax: 315_999,
    rate: 0.0125,
  },
  {
    tier: 3,
    singleMin: 158_000,
    singleMax: null,
    familyMin: 316_000,
    familyMax: null,
    rate: 0.015,
  },
] satisfies MedicareLevySurchargeTier[];

/** Additional family threshold per dependent child after the first. */
export const MLS_ADDITIONAL_CHILD = 1_500 as const;

// ─── HECS-HELP / Study and Training Loan ─────────────────────────────────────

export interface HecsRepaymentTier {
  min: number;
  max: number | null;
  marginalRate: number; // decimal - applied to income ABOVE the min (for tiers 1-2)
  description: string;
}

/**
 * HECS-HELP repayment thresholds and rates for 2025-26.
 *
 * NEW from 2025-26: Marginal repayment system.
 * Repayments are calculated on income above the threshold, NOT on total income
 * (except for the top tier which is 10% of total repayment income).
 *
 * Source: ATO - Study and training loan repayment thresholds and rates
 * https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds
 */
export const HECS_REPAYMENT_TIERS = [
  {
    min: 0,
    max: 67_000,
    marginalRate: 0,
    description: 'No repayment required',
  },
  {
    min: 67_001,
    max: 125_000,
    marginalRate: 0.15,
    description: '15% on income above $67,000',
  },
  {
    min: 125_001,
    max: 179_285,
    marginalRate: 0.17,
    description: '$8,700 plus 17% on income above $125,000',
  },
  {
    min: 179_286,
    max: null,
    marginalRate: 0.10,
    description: '10% of total repayment income',
  },
] satisfies HecsRepaymentTier[];

/** Minimum income before HECS repayments kick in. */
export const HECS_THRESHOLD = 67_000 as const;

/**
 * Base amount owed at the $125,001 tier boundary.
 * ($125,000 - $67,000) * 0.15 = $8,700
 */
export const HECS_TIER_2_BASE = 8_700 as const;

// ─── Low Income Tax Offset (LITO) ───────────────────────────────────────────

/**
 * Low Income Tax Offset for 2025-26.
 * Automatically applied when you lodge your tax return.
 *
 * - Full offset ($700) for income up to $37,500
 * - Phase-out 1: reduces by 5c per $1 over $37,500 (to $45,000)
 * - Phase-out 2: reduces by 1.5c per $1 over $45,000 (to $66,667)
 *
 * Source: ATO - Low income tax offset
 * https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/tax-offsets/low-income-tax-offset
 */
export const LITO = {
  maxOffset: 700,
  fullOffsetThreshold: 37_500,
  phaseOut1: {
    start: 37_500,
    end: 45_000,
    reductionRate: 0.05, // 5 cents per dollar
  },
  phaseOut2: {
    start: 45_000,
    end: 66_667,
    reductionRate: 0.015, // 1.5 cents per dollar
  },
} as const;

// ─── GST ─────────────────────────────────────────────────────────────────────

/**
 * GST registration threshold. You MUST register for GST if your business
 * turnover is $75,000 or more (or $150,000 for non-profits).
 *
 * Source: ATO - Registering for GST
 * https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst
 */
export const GST_THRESHOLD = 75_000 as const;
export const GST_THRESHOLD_NONPROFIT = 150_000 as const;
export const GST_RATE = 0.10 as const;

// ─── Superannuation ──────────────────────────────────────────────────────────

/**
 * Superannuation guarantee rate for 2025-26.
 * Source: ATO - Super guarantee percentage
 * https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/super-guarantee
 */
export const SUPER_GUARANTEE_RATE = 0.12 as const; // 12% from 1 July 2025

// ─── Instant Asset Write-Off ─────────────────────────────────────────────────

/**
 * Small business instant asset write-off threshold for 2025-26.
 * Businesses with aggregated turnover under $10M can instantly deduct
 * assets costing less than $20,000 (per asset).
 *
 * Source: ATO - $20,000 instant asset write-off for 2025-26
 * https://www.ato.gov.au/businesses-and-organisations/small-business-newsroom/20000-instant-asset-write-off-for-2025-26
 */
export const INSTANT_ASSET_WRITE_OFF = {
  threshold: 20_000,
  maxTurnover: 10_000_000,
  validFrom: '2025-07-01',
  validTo: '2026-06-30',
} as const;

// ─── Helper Functions ────────────────────────────────────────────────────────

/** Calculate income tax for a given taxable income (excludes Medicare levy). */
export function calculateIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  for (let i = TAX_BRACKETS_2025_26.length - 1; i >= 0; i--) {
    const bracket = TAX_BRACKETS_2025_26[i];
    if (taxableIncome >= bracket.min) {
      return bracket.base + (taxableIncome - bracket.min + 1) * bracket.rate;
    }
  }
  return 0;
}

/** Calculate LITO for a given taxable income. */
export function calculateLITO(taxableIncome: number): number {
  if (taxableIncome <= LITO.fullOffsetThreshold) {
    return LITO.maxOffset;
  }
  if (taxableIncome <= LITO.phaseOut1.end) {
    return LITO.maxOffset - (taxableIncome - LITO.phaseOut1.start) * LITO.phaseOut1.reductionRate;
  }
  if (taxableIncome <= LITO.phaseOut2.end) {
    const afterPhase1 = LITO.maxOffset - (LITO.phaseOut1.end - LITO.phaseOut1.start) * LITO.phaseOut1.reductionRate;
    return afterPhase1 - (taxableIncome - LITO.phaseOut2.start) * LITO.phaseOut2.reductionRate;
  }
  return 0;
}

/** Calculate HECS repayment for a given repayment income. */
export function calculateHecsRepayment(repaymentIncome: number): number {
  if (repaymentIncome <= HECS_THRESHOLD) return 0;

  if (repaymentIncome <= 125_000) {
    return (repaymentIncome - HECS_THRESHOLD) * 0.15;
  }
  if (repaymentIncome <= 179_285) {
    return HECS_TIER_2_BASE + (repaymentIncome - 125_000) * 0.17;
  }
  // Top tier: 10% of TOTAL repayment income
  return repaymentIncome * 0.10;
}
