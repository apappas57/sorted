import { z } from "zod";
import type { ReportData } from "@/types/report";

// Coerce values Claude might return inconsistently
const flexNumber = z.union([z.number(), z.string(), z.null()]).transform((v) => {
  if (v === null || v === undefined) return 0;
  if (typeof v === "string") {
    const cleaned = v.replace(/[^0-9.\-]/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return v;
});

const flexString = z.union([z.string(), z.null()]).transform((v) => v ?? "N/A");

const taxSectionSchema = z.object({
  estimatedTaxRate: flexNumber,
  fortnightlySetAside: flexNumber,
  annualTaxEstimate: flexNumber,
  medicareLevy: flexNumber,
  hecsRepayment: flexNumber,
  explanation: flexString,
  tips: z.array(z.string()).default([]),
});

const basSectionSchema = z.object({
  required: z.union([z.boolean(), z.string()]).transform((v) =>
    typeof v === "string" ? v.toLowerCase() === "true" || v.toLowerCase() === "yes" : v
  ),
  frequency: flexString,
  nextDueDate: flexString,
  gstRecommendation: flexString,
  explanation: flexString,
  tips: z.array(z.string()).default([]),
});

const deductionCategorySchema = z.object({
  name: z.string(),
  items: z.array(z.string()).default([]),
  estimatedValue: z.union([z.number(), z.string(), z.null()]).transform((v) => {
    if (v === null || v === undefined) return 0;
    if (typeof v === "string") {
      const cleaned = v.replace(/[^0-9.\-]/g, "");
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : num;
    }
    return v;
  }),
});

const deductionsSectionSchema = z.object({
  categories: z.array(deductionCategorySchema).default([]),
  totalEstimatedDeductions: flexNumber,
  explanation: flexString,
});

const debtSectionSchema = z.object({
  strategy: flexString,
  priorityOrder: z.array(z.string()).default([]),
  explanation: flexString,
  tips: z.array(z.string()).default([]),
});

const benefitItemSchema = z.object({
  name: z.string(),
  description: z.string().default(""),
  howToApply: z.string().default(""),
  estimatedValue: z.union([z.string(), z.number(), z.null()]).transform((v) =>
    v === null ? "Varies" : String(v)
  ),
});

const benefitsSectionSchema = z.object({
  eligible: z.array(benefitItemSchema).default([]),
  possiblyEligible: z.array(benefitItemSchema).default([]),
});

const actionsSectionSchema = z.object({
  immediate: z.array(z.string()).default([]),
  thisWeek: z.array(z.string()).default([]),
  thisMonth: z.array(z.string()).default([]),
  beforeEOFY: z.array(z.string()).default([]),
});

const discoveryItemSchema = z.object({
  title: flexString,
  amount: flexNumber,
  description: flexString,
  howToCapture: flexString,
  source: flexString,
});

const discoveriesSectionSchema = z.object({
  totalPotentialSavings: flexNumber,
  items: z.array(discoveryItemSchema).default([]),
  disclaimer: flexString,
});

const businessDeductionBreakdownSchema = z.object({
  category: z.string().default(""),
  amount: flexNumber,
  note: z.string().default(""),
});

const businessDeductionsSectionSchema = z.object({
  applicable: z.union([z.boolean(), z.string()]).transform((v) =>
    typeof v === "string" ? v.toLowerCase() === "true" || v.toLowerCase() === "yes" : v
  ),
  instantWriteOff: z.object({
    total: flexNumber,
    taxSaving: flexNumber,
    breakdown: z.array(businessDeductionBreakdownSchema).default([]),
  }).default({ total: 0, taxSaving: 0, breakdown: [] }),
  depreciation: z.object({
    totalAssetValue: flexNumber,
    annualDepreciation: flexNumber,
    taxSaving: flexNumber,
    explanation: flexString,
  }).default({ totalAssetValue: 0, annualDepreciation: 0, taxSaving: 0, explanation: "N/A" }),
  homeOffice: z.object({
    method: flexString,
    annualDeduction: flexNumber,
    explanation: flexString,
  }).default({ method: "N/A", annualDeduction: 0, explanation: "N/A" }),
  totalDeductions: flexNumber,
  totalTaxSaving: flexNumber,
  warnings: z.array(z.string()).default([]),
  tips: z.array(z.string()).default([]),
});

export const reportSchema = z.object({
  discoveries: discoveriesSectionSchema,
  tax: taxSectionSchema,
  bas: basSectionSchema,
  deductions: deductionsSectionSchema,
  businessDeductions: businessDeductionsSectionSchema.optional(),
  debt: debtSectionSchema,
  benefits: benefitsSectionSchema,
  actions: actionsSectionSchema,
});

/**
 * Validate raw data against the report schema. Throws on invalid input.
 */
export function parseReportResponse(raw: unknown): ReportData {
  return reportSchema.parse(raw) as ReportData;
}
