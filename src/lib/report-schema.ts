import { z } from "zod";
import type { ReportData } from "@/types/report";

const taxSectionSchema = z.object({
  estimatedTaxRate: z.number(),
  fortnightlySetAside: z.number(),
  annualTaxEstimate: z.number(),
  medicareLevy: z.number(),
  hecsRepayment: z.number(),
  explanation: z.string(),
  tips: z.array(z.string()),
});

const basSectionSchema = z.object({
  required: z.boolean(),
  frequency: z.string(),
  nextDueDate: z.string(),
  gstRecommendation: z.string(),
  explanation: z.string(),
  tips: z.array(z.string()),
});

const deductionCategorySchema = z.object({
  name: z.string(),
  items: z.array(z.string()),
  estimatedValue: z.number(),
});

const deductionsSectionSchema = z.object({
  categories: z.array(deductionCategorySchema),
  totalEstimatedDeductions: z.number(),
  explanation: z.string(),
});

const debtSectionSchema = z.object({
  strategy: z.string(),
  priorityOrder: z.array(z.string()),
  explanation: z.string(),
  tips: z.array(z.string()),
});

const benefitItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  howToApply: z.string(),
  estimatedValue: z.string(),
});

const benefitsSectionSchema = z.object({
  eligible: z.array(benefitItemSchema),
  possiblyEligible: z.array(benefitItemSchema),
});

const actionsSectionSchema = z.object({
  immediate: z.array(z.string()),
  thisWeek: z.array(z.string()),
  thisMonth: z.array(z.string()),
  beforeEOFY: z.array(z.string()),
});

export const reportSchema = z.object({
  tax: taxSectionSchema,
  bas: basSectionSchema,
  deductions: deductionsSectionSchema,
  debt: debtSectionSchema,
  benefits: benefitsSectionSchema,
  actions: actionsSectionSchema,
});

/**
 * Validate raw data against the report schema. Throws on invalid input.
 */
export function parseReportResponse(raw: unknown): ReportData {
  return reportSchema.parse(raw);
}
