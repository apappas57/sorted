/**
 * Deterministic Australian tax calculator for 2025-26.
 *
 * Used to validate AI-generated tax figures. If the AI's numbers deviate
 * from the deterministic calculation by more than the allowed tolerance,
 * the deterministic values replace the AI's values.
 */

import {
  calculateIncomeTax,
  calculateLITO,
  MEDICARE_LEVY_RATE,
  MEDICARE_LEVY_REDUCTION,
  MEDICARE_LEVY_SURCHARGE,
  type MedicareLevySurchargeTier,
} from "@/data/tax-brackets";

export interface DeterministicTaxResult {
  incomeTax: number;
  lito: number;
  incomeTaxAfterLITO: number;
  medicareLevy: number;
  medicareLevySurcharge: number;
  totalTax: number;
  effectiveRate: number;
  fortnightlySetAside: number;
}

/**
 * Calculate the full Medicare levy, accounting for the low-income reduction.
 *
 * - Below the lower threshold: no levy.
 * - Between lower and upper: reduced levy (10% of amount over lower threshold,
 *   but capped at the standard 2% of income).
 * - Above the upper threshold: standard 2% of income.
 */
function calculateMedicareLevy(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  if (taxableIncome <= MEDICARE_LEVY_REDUCTION.singleLowerThreshold) {
    return 0;
  }

  const standardLevy = taxableIncome * MEDICARE_LEVY_RATE;

  if (taxableIncome <= MEDICARE_LEVY_REDUCTION.singleUpperThreshold) {
    // Reduced levy: 10% of the amount over the lower threshold
    const reduced =
      (taxableIncome - MEDICARE_LEVY_REDUCTION.singleLowerThreshold) * 0.1;
    return Math.min(reduced, standardLevy);
  }

  return standardLevy;
}

/**
 * Calculate the Medicare Levy Surcharge for someone without private hospital cover.
 * Returns 0 if they have private health insurance or income is below the threshold.
 */
function calculateMLS(
  taxableIncome: number,
  hasPrivateHealth: boolean
): number {
  if (hasPrivateHealth || taxableIncome <= 0) return 0;

  for (let i = MEDICARE_LEVY_SURCHARGE.length - 1; i >= 0; i--) {
    const tier: MedicareLevySurchargeTier = MEDICARE_LEVY_SURCHARGE[i];
    if (taxableIncome >= tier.singleMin) {
      return Math.round(taxableIncome * tier.rate * 100) / 100;
    }
  }

  return 0;
}

/**
 * Calculate a complete deterministic tax result for a given taxable income.
 *
 * @param taxableIncome - Annual taxable income
 * @param hasPrivateHealth - Whether the person has private hospital cover
 * @returns Full tax breakdown
 */
export function calculateDeterministicTax(
  taxableIncome: number,
  hasPrivateHealth: boolean = true
): DeterministicTaxResult {
  if (taxableIncome <= 0) {
    return {
      incomeTax: 0,
      lito: 0,
      incomeTaxAfterLITO: 0,
      medicareLevy: 0,
      medicareLevySurcharge: 0,
      totalTax: 0,
      effectiveRate: 0,
      fortnightlySetAside: 0,
    };
  }

  const incomeTax = calculateIncomeTax(taxableIncome);
  const lito = calculateLITO(taxableIncome);

  // LITO reduces income tax but cannot reduce it below zero
  const incomeTaxAfterLITO = Math.max(0, incomeTax - lito);

  const medicareLevy = calculateMedicareLevy(taxableIncome);
  const medicareLevySurcharge = calculateMLS(taxableIncome, hasPrivateHealth);

  const totalTax = incomeTaxAfterLITO + medicareLevy + medicareLevySurcharge;
  const effectiveRate = taxableIncome > 0 ? totalTax / taxableIncome : 0;
  const fortnightlySetAside = Math.ceil(totalTax / 26);

  return {
    incomeTax: Math.round(incomeTax * 100) / 100,
    lito: Math.round(lito * 100) / 100,
    incomeTaxAfterLITO: Math.round(incomeTaxAfterLITO * 100) / 100,
    medicareLevy: Math.round(medicareLevy * 100) / 100,
    medicareLevySurcharge: Math.round(medicareLevySurcharge * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    effectiveRate: Math.round(effectiveRate * 10000) / 10000,
    fortnightlySetAside,
  };
}

/** Maximum allowed deviation (in dollars) before overriding the AI's figures. */
export const TAX_VALIDATION_TOLERANCE = 500;

/**
 * Validate and correct AI-generated tax figures against deterministic calculations.
 *
 * If the AI's annual tax estimate or Medicare levy deviates from the deterministic
 * calculation by more than $500, the deterministic values replace the AI's values.
 *
 * @returns The corrected tax section fields (only the fields that may be overridden)
 */
export function validateTaxFigures(
  aiTax: {
    annualTaxEstimate: number;
    medicareLevy: number;
    estimatedTaxRate: number;
    fortnightlySetAside: number;
  },
  taxableIncome: number,
  hasPrivateHealth: boolean = true
): {
  annualTaxEstimate: number;
  medicareLevy: number;
  estimatedTaxRate: number;
  fortnightlySetAside: number;
  corrected: boolean;
} {
  if (taxableIncome <= 0) {
    return { ...aiTax, corrected: false };
  }

  const deterministic = calculateDeterministicTax(
    taxableIncome,
    hasPrivateHealth
  );

  // Check if the AI's total tax (annualTaxEstimate) is off by more than tolerance.
  // The AI's annualTaxEstimate should represent total tax payable (income tax + Medicare).
  const aiTotal = aiTax.annualTaxEstimate;
  const deterministicTotal = deterministic.totalTax;
  const totalDiff = Math.abs(aiTotal - deterministicTotal);

  // Check Medicare levy specifically
  const medicareDiff = Math.abs(
    aiTax.medicareLevy - deterministic.medicareLevy
  );

  const needsCorrection =
    totalDiff > TAX_VALIDATION_TOLERANCE ||
    medicareDiff > TAX_VALIDATION_TOLERANCE;

  if (needsCorrection) {
    console.warn(
      `[Sorted] Tax validation: AI total=$${aiTotal}, deterministic=$${deterministicTotal} (diff=$${totalDiff.toFixed(0)}). ` +
        `AI Medicare=$${aiTax.medicareLevy}, deterministic=$${deterministic.medicareLevy} (diff=$${medicareDiff.toFixed(0)}). ` +
        `Correcting to deterministic values.`
    );
    return {
      annualTaxEstimate: Math.round(deterministicTotal),
      medicareLevy: Math.round(deterministic.medicareLevy),
      estimatedTaxRate: deterministic.effectiveRate,
      fortnightlySetAside: deterministic.fortnightlySetAside,
      corrected: true,
    };
  }

  return { ...aiTax, corrected: false };
}
