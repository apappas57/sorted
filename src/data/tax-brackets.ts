// Australian Tax Data for 2026-27 Financial Year (1 July 2026 - 30 June 2027)
//
// Every figure below was verified against a primary source (ATO Legal Database,
// legislation.gov.au, or Services Australia) on 4 August 2026.
//
// WARNING FOR FUTURE UPDATES: the ATO's consumer-facing "tax rates for
// Australian residents" page lagged a full financial year behind at the time of
// writing -- its newest table was still 2025-26 in August 2026. Build from the
// Legal Database consolidation of the Income Tax Rates Act 1986 and the PAYG
// withholding schedules (NAT 1004) instead, or you will silently ship last
// year's numbers.

// ─── Income Tax Brackets ─────────────────────────────────────────────────────

export interface TaxBracket {
  min: number;
  max: number | null; // null = no upper limit
  rate: number; // decimal, e.g. 0.15 = 15%
  base: number; // cumulative tax from lower brackets
}

/**
 * Individual income tax rates for Australian residents, 2026-27.
 * These do NOT include the Medicare levy (2%).
 *
 * The second marginal rate fell from 16% to 15% on 1 July 2026, legislated by
 * the Treasury Laws Amendment (More Cost of Living Relief) Act 2025 (Act 28 of
 * 2025), which inserted the 2026-27 table into Income Tax Rates Act 1986
 * Sch 7 Pt I cl 1.
 *
 * THE CLASSIC BUG HERE: dropping the rate to 15% but leaving the cumulative
 * base amounts at last year's $4,288 / $31,288 / $51,638. That overstates tax
 * by exactly $268 for every taxpayer earning above $45,000 -- which is the
 * entire value of the tax cut (1% x $26,800). The bases below are recalculated.
 *
 * Reconciliation: base(n) = base(n-1) + (width of bracket n-1 x rate of n-1)
 *   0 + ($45,000 - $18,200) x 0.15 = $4,020
 *   $4,020 + ($135,000 - $45,000) x 0.30 = $31,020
 *   $31,020 + ($190,000 - $135,000) x 0.37 = $51,370
 *
 * Source: https://www.ato.gov.au/law/view/print?DocID=PAC/19860107/Sch7-PtI-1
 */
export const TAX_BRACKETS_2026_27 = [
  { min: 0, max: 18_200, rate: 0, base: 0 },
  { min: 18_201, max: 45_000, rate: 0.15, base: 0 },
  { min: 45_001, max: 135_000, rate: 0.30, base: 4_020 },
  { min: 135_001, max: 190_000, rate: 0.37, base: 31_020 },
  { min: 190_001, max: null, rate: 0.45, base: 51_370 },
] satisfies TaxBracket[];

/**
 * Already legislated for 2027-28: the second rate falls again, 15% -> 14%,
 * giving bases of $3,752 / $30,752 / $51,102. Do NOT apply to 2026-27.
 */

/** Tax-free threshold for Australian residents. Flat, not indexed since 2015. */
export const TAX_FREE_THRESHOLD = 18_200 as const;

// ─── Standard Deduction (NEW for 2026-27) ────────────────────────────────────

/**
 * NEW: an automatic standard deduction for work-related expenses, up to $1,000,
 * first applying to the 2026-27 individual return. Enacted by the Treasury Laws
 * Amendment (Tax Reform No. 1) Act 2026 (Act 49 of 2026), assent 26 June 2026.
 *
 * Only available to residents who earn income from WORK -- people with only
 * business or investment income are not eligible. Taxpayers with more than
 * $1,000 of work-related expenses keep itemising as before.
 *
 * Cents-per-km and working-from-home fixed-rate claims sit INSIDE this
 * envelope, so the correct treatment is: take the greater of the taxpayer's
 * itemised work-related deductions and $1,000, not the sum.
 *
 * Source: https://www.ato.gov.au/about-ato/new-legislation/in-detail/individuals/standard-deduction-for-work-related-expenses
 */
export const STANDARD_WORK_DEDUCTION = 1_000 as const;

// ─── Medicare Levy ───────────────────────────────────────────────────────────

/** Medicare levy rate applied on top of income tax. */
export const MEDICARE_LEVY_RATE = 0.02 as const;

/**
 * Medicare levy reduction thresholds for low-income earners, 2026-27.
 * Below the lower threshold, no levy. Between lower and upper, the levy is
 * 10 cents per $1 above the lower threshold. Above the upper, the full 2%.
 *
 * STATUS: PROVISIONAL. These are the figures in force today (Medicare Levy Act
 * 1986 ss 3 and 8(5), as substituted by Act 58 of 2026, expressed to apply to
 * "the 2025-26 year of income and later years"). But these thresholds are
 * uplifted every year by an amending Act passed AFTER the year ends and applied
 * retrospectively. A CPI-scale uplift for 2026-27 is near-certain, likely
 * around the 2027-28 Budget. Recheck ~May 2027.
 *
 * NOTE the two different child increments -- they are not interchangeable, and
 * both apply from the FIRST child (unlike the MLS increment below, which starts
 * from the second).
 *
 * Source: https://www.ato.gov.au/law/view/print?DocID=PAC/19860110/3
 */
export const MEDICARE_LEVY_REDUCTION = {
  singleLowerThreshold: 28_011,
  singleUpperThreshold: 35_013,
  familyLowerThreshold: 47_238,
  familyUpperThreshold: 59_047,
  /** Added to the LOWER family threshold, per dependent child, from the first. */
  additionalChildLower: 4_338,
  /** Added to the UPPER family threshold, per dependent child, from the first. */
  additionalChildUpper: 5_423,
  /** Seniors and pensioners tax offset variants. */
  singleLowerThresholdSAPTO: 44_268,
  singleUpperThresholdSAPTO: 55_335,
  familyLowerThresholdSAPTO: 61_623,
  familyUpperThresholdSAPTO: 77_028,
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
 * Medicare Levy Surcharge (MLS) tiers for 2026-27. Thresholds are indexed and
 * ALL of them moved this year. Rates are flat and unchanged.
 *
 * Family thresholds are exactly 2x the single thresholds at every tier, and
 * increase by $1,500 per dependent child AFTER THE FIRST.
 *
 * TRAPS:
 *  - Tested on "income for MLS purposes", not taxable income. That is taxable
 *    income + reportable fringe benefits + reportable employer super +
 *    deductible personal super contributions + net investment losses.
 *  - The surcharge applies to the WHOLE of that income, not just the excess
 *    above the threshold.
 *  - MLS is IN ADDITION to the 2% levy, so a top-tier single without hospital
 *    cover pays 3.5% in total.
 *
 * Source: https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge/medicare-levy-surcharge-income-thresholds-and-rates
 */
export const MEDICARE_LEVY_SURCHARGE = [
  {
    tier: 0,
    singleMin: 0,
    singleMax: 105_000,
    familyMin: 0,
    familyMax: 210_000,
    rate: 0,
  },
  {
    tier: 1,
    singleMin: 105_001,
    singleMax: 123_000,
    familyMin: 210_001,
    familyMax: 246_000,
    rate: 0.01,
  },
  {
    tier: 2,
    singleMin: 123_001,
    singleMax: 164_000,
    familyMin: 246_001,
    familyMax: 328_000,
    rate: 0.0125,
  },
  {
    tier: 3,
    singleMin: 164_001,
    singleMax: null,
    familyMin: 328_001,
    familyMax: null,
    rate: 0.015,
  },
] satisfies MedicareLevySurchargeTier[];

/** Additional family threshold per dependent child AFTER the first. */
export const MLS_ADDITIONAL_CHILD = 1_500 as const;

// ─── HECS-HELP / Study and Training Loan ─────────────────────────────────────

export interface HecsRepaymentTier {
  min: number;
  max: number | null;
  marginalRate: number; // decimal - applied to income ABOVE the min (tiers 1-2)
  description: string;
}

/**
 * Study and training loan repayment thresholds and rates for 2026-27.
 *
 * Marginal system (introduced 2025-26): repayments are calculated on income
 * ABOVE the threshold, not on total income -- EXCEPT the top tier, which is a
 * flat 10% of the entire repayment income with no threshold subtraction and no
 * base. Getting that wrong overstates repayments massively.
 *
 * Rates are flat; every threshold is indexed to Average Weekly Earnings and all
 * of them moved this year by a uniform ~3.7731%.
 *
 * WATCH OUT: the ATO's own page contains a stale "$179,286" inside its 2026-27
 * Example 3. That is the 2025-26 boundary. Table 1 on the same page correctly
 * states $186,051. Do not code $179,286.
 *
 * Source: https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds
 */
export const HECS_REPAYMENT_TIERS = [
  {
    min: 0,
    max: 69_528,
    marginalRate: 0,
    description: 'No repayment required',
  },
  {
    min: 69_529,
    max: 129_717,
    marginalRate: 0.15,
    description: '15% on income above $69,528',
  },
  {
    min: 129_718,
    max: 186_050,
    marginalRate: 0.17,
    description: '$9,028 plus 17% on income above $129,717',
  },
  {
    min: 186_051,
    max: null,
    marginalRate: 0.10,
    description: '10% of total repayment income',
  },
] satisfies HecsRepaymentTier[];

/** Minimum income before study loan repayments kick in. */
export const HECS_THRESHOLD = 69_528 as const;

/**
 * Base amount owed at the $129,718 tier boundary.
 * ($129,717 - $69,528) x 0.15 = $9,028.35, published by the ATO as $9,028.
 */
export const HECS_TIER_2_BASE = 9_028 as const;

/**
 * Indexation applied to outstanding study loan balances on 1 June 2026.
 * (Lower of CPI or WPI.) The 1 June 2027 rate is not knowable yet.
 *
 * The one-off 20% study loan debt reduction has LAPSED -- it applied only to
 * balances existing on 1 June 2025 and processing is complete. Never apply it
 * to a 2026-27 balance.
 */
export const HECS_INDEXATION_RATE_2026 = 0.028 as const;

// ─── Low Income Tax Offset (LITO) ───────────────────────────────────────────

/**
 * Low Income Tax Offset for 2026-27. UNCHANGED -- flat, never indexed, and
 * untouched by the 2025 and 2026 tax-cut Acts.
 *
 * Non-refundable: it reduces tax payable to $0 only, and it does NOT reduce
 * the Medicare levy.
 *
 * Source: https://www.ato.gov.au/law/view/print?DocID=PAC/19970038/61-115
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
 * GST registration thresholds. Flat, never indexed, unchanged since 1 July 2007.
 * Taxi, limousine and ride-sourcing drivers must register regardless of turnover.
 */
export const GST_THRESHOLD = 75_000 as const;
export const GST_THRESHOLD_NONPROFIT = 150_000 as const;
export const GST_RATE = 0.10 as const;

// ─── Superannuation ──────────────────────────────────────────────────────────

/** Super guarantee rate. 12% is the final legislated step. */
export const SUPER_GUARANTEE_RATE = 0.12 as const;

/**
 * Superannuation thresholds for 2026-27.
 *
 * STRUCTURAL CHANGE: "Payday Super" commenced 1 July 2026. Super guarantee is
 * now due EACH PAYDAY rather than quarterly, and the maximum contribution base
 * became a single ANNUAL figure. The old $62,500-per-quarter base expired
 * 30 June 2026 -- any code multiplying a quarterly base by 4 is wrong.
 *
 * Source: https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds
 */
export const SUPER = {
  /** Annual, replacing the former $62,500/quarter. $32,500 x 100 / 12, rounded down to $10. */
  maxContributionBaseAnnual: 270_830,
  concessionalCap: 32_500,
  nonConcessionalCap: 130_000,
  division293Threshold: 250_000,
  coContributionMax: 500,
  coContributionLowerThreshold: 49_293,
  coContributionHigherThreshold: 64_293,
  listoMax: 500,
  listoIncomeThreshold: 37_000,
  fhssAnnualLimit: 15_000,
  fhssLifetimeLimit: 50_000,
} as const;

// ─── Instant Asset Write-Off ─────────────────────────────────────────────────

/**
 * Small business instant asset write-off for 2026-27.
 *
 * READ THIS BEFORE CHANGING THE NUMBER.
 *
 * The $20,000 threshold LAPSED on 30 June 2026 and was not re-legislated. With
 * the Income Tax (Transitional Provisions) Act 1997 Div 328 uplift expired, the
 * operative provision reverts to ITAA 1997 s 328-180, headed "Assets costing
 * less than $1,000". So $1,000 is the legislated position today.
 *
 * A permanent $20,000 threshold from 1 July 2026 is ANNOUNCED BUT NOT LAW. The
 * vehicle is the Treasury Laws Amendment (Tax Reform No. 2) Bill 2026,
 * introduced 25 June 2026, referred to the Senate Economics Legislation
 * Committee with a report due 13 August 2026. It has passed neither house. A
 * COSBOA submission argued for $150,000, so even the final figure is not
 * settled.
 *
 * We show the legislated $1,000 and surface `pendingThreshold` prominently
 * rather than advising anyone to make a purchase on the strength of a bill.
 *
 * RECHECK AFTER 13 AUGUST 2026.
 *
 * Sources:
 *   https://www.aph.gov.au/Parliamentary_Business/Bills_Legislation/Bills_Search_Results/Result?bId=r7502
 *   https://www.ato.gov.au/about-ato/new-legislation/in-detail/businesses/small-business-support-20000-dollar-instant-asset-write-off
 */
export const INSTANT_ASSET_WRITE_OFF = {
  /** Legislated and in force for 2026-27. */
  threshold: 1_000,
  maxTurnover: 10_000_000,
  validFrom: '2026-07-01',
  validTo: '2027-06-30',
  /** Announced, before Parliament, NOT yet law. */
  pendingThreshold: 20_000,
  pendingStatus:
    'The $20,000 instant asset write-off expired on 30 June 2026. A permanent $20,000 threshold is before Parliament (Treasury Laws Amendment (Tax Reform No. 2) Bill 2026); the Senate Economics Legislation Committee reports on 13 August 2026. Until it passes, the legislated threshold is $1,000. Check with your accountant before timing a large purchase.',
  pendingReviewDate: '2026-08-13',
} as const;

// ─── Deduction Rates ─────────────────────────────────────────────────────────

/**
 * Cents-per-kilometre rate for car expenses, 2026-27. Up from 88c.
 *
 * Legislated by the Income Tax Assessment (Cents per Kilometre Deduction Rate
 * for Car Expenses) Determination 2026 (F2026L00785), registered 23 June 2026.
 *
 * FORWARD-YEAR WARNING: 91c is a base rate of 89c plus a one-off 2c uplift that
 * applies to 2026-27 ONLY. Future indexation applies to the 89c base. Do not
 * compound next year's increase off 91c.
 *
 * The 5,000km cap is statutory (ITAA 1997 s 28-25(2)), flat, and per car -- the
 * annual determination sets only the rate. The rate covers ALL running costs
 * including depreciation; nothing may be claimed separately on top.
 *
 * Source: https://www.legislation.gov.au/F2026L00785
 */
export const CENTS_PER_KM_RATE = 0.91 as const;
export const CENTS_PER_KM_MAX_KMS = 5_000 as const;
export const CENTS_PER_KM_MAX_CLAIM = 4_550 as const; // 5,000 x $0.91

/**
 * Working-from-home fixed rate method, 2026-27. UNCHANGED at 70c/hour.
 *
 * Verified against PCG 2023/1 para 26A Table 1, whose "From 1 July 2024" row is
 * open-ended and therefore governs 2026-27. The rate was 67c for 2022-23 and
 * 2023-24 and was revised UP to 70c from 1 July 2024 -- Sorted was still using
 * 67c, two years stale.
 *
 * Covers electricity/gas, home and mobile internet, phone usage, stationery and
 * computer consumables -- none of which can be claimed separately on top.
 * Decline in value of desks, chairs and computers IS claimable separately.
 *
 * Record keeping: a record of TOTAL ACTUAL HOURS for the whole year is
 * required. "About 25 hours a week" is not acceptable under PCG 2023/1.
 *
 * Source: https://www.ato.gov.au/law/view/document?DocID=COG%2FPCG20231%2FNAT%2FATO%2F00001
 */
export const HOME_OFFICE_HOURLY_RATE = 0.70 as const;

/** Car limit for depreciation, 2026-27. Indexed annually. Max GST credit $6,353. */
export const CAR_DEPRECIATION_LIMIT = 69_883 as const;

/** FBT rate for the FBT year ending 31 March 2027. Flat since 2023. */
export const FBT_RATE = 0.47 as const;

// ─── Helper Functions ────────────────────────────────────────────────────────

/** Calculate income tax for a given taxable income (excludes Medicare levy). */
export function calculateIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  for (let i = TAX_BRACKETS_2026_27.length - 1; i >= 0; i--) {
    const bracket = TAX_BRACKETS_2026_27[i];
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

/**
 * Calculate the compulsory study loan repayment for a given repayment income.
 *
 * Note the top tier deliberately breaks the marginal pattern: it is a flat 10%
 * of the ENTIRE repayment income, per ATO Table 1. (ATO worked example:
 * $254,780 x 10% = $25,478.)
 */
export function calculateHecsRepayment(repaymentIncome: number): number {
  if (repaymentIncome <= HECS_THRESHOLD) return 0;

  if (repaymentIncome <= 129_717) {
    return (repaymentIncome - HECS_THRESHOLD) * 0.15;
  }
  if (repaymentIncome <= 186_050) {
    return HECS_TIER_2_BASE + (repaymentIncome - 129_717) * 0.17;
  }
  // Top tier: 10% of TOTAL repayment income
  return repaymentIncome * 0.10;
}
