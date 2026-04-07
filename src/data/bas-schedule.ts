// BAS (Business Activity Statement) Schedule for 2025-26 Financial Year
// Source: ATO - Due dates for lodging and paying your BAS
// https://www.ato.gov.au/businesses-and-organisations/preparing-lodging-and-paying/business-activity-statements-bas/due-dates-for-lodging-and-paying-your-bas

// ─── Types ───────────────────────────────────────────────────────────────────

export interface QuarterlyBASDates {
  quarter: 1 | 2 | 3 | 4;
  label: string;
  periodStart: string; // ISO date
  periodEnd: string; // ISO date
  dueDate: string; // ISO date - for self-lodgers
  agentDueDate: string; // ISO date - extended date via registered BAS/tax agent
}

// ─── Quarterly BAS Dates ─────────────────────────────────────────────────────

/**
 * Quarterly BAS lodgement and payment due dates for 2025-26.
 *
 * If a due date falls on a weekend or public holiday, the deadline
 * moves to the next business day.
 *
 * Q2 does not get a later agent date because the standard due date
 * already includes a one-month extension (28 Feb instead of 28 Jan).
 *
 * Source: ATO - Due dates for lodging and paying your BAS
 * https://www.ato.gov.au/businesses-and-organisations/preparing-lodging-and-paying/business-activity-statements-bas/due-dates-for-lodging-and-paying-your-bas
 */
export const QUARTERLY_BAS_DATES = [
  {
    quarter: 1 as const,
    label: 'Q1 July-September 2025',
    periodStart: '2025-07-01',
    periodEnd: '2025-09-30',
    dueDate: '2025-10-28',
    agentDueDate: '2025-11-25',
  },
  {
    quarter: 2 as const,
    label: 'Q2 October-December 2025',
    periodStart: '2025-10-01',
    periodEnd: '2025-12-31',
    dueDate: '2026-02-28',
    agentDueDate: '2026-02-28', // No extension for Q2
  },
  {
    quarter: 3 as const,
    label: 'Q3 January-March 2026',
    periodStart: '2026-01-01',
    periodEnd: '2026-03-31',
    dueDate: '2026-04-28',
    agentDueDate: '2026-05-26',
  },
  {
    quarter: 4 as const,
    label: 'Q4 April-June 2026',
    periodStart: '2026-04-01',
    periodEnd: '2026-06-30',
    dueDate: '2026-07-28',
    agentDueDate: '2026-08-25',
  },
] satisfies QuarterlyBASDates[];

// ─── Monthly BAS ─────────────────────────────────────────────────────────────

/**
 * Monthly BAS is due on the 21st of the following month.
 * Required when GST turnover is $20M or more.
 *
 * Source: ATO - How to lodge your BAS
 * https://www.ato.gov.au/businesses-and-organisations/preparing-lodging-and-paying/business-activity-statements-bas/how-to-lodge-your-bas
 */
export const MONTHLY_BAS_DUE_DAY = 21 as const;

/** Turnover threshold above which monthly BAS is required. */
export const MONTHLY_BAS_TURNOVER_THRESHOLD = 20_000_000 as const;

// ─── Annual BAS ──────────────────────────────────────────────────────────────

/**
 * Annual GST return. Voluntary GST registrants with turnover under
 * $75,000 may be eligible to report annually.
 * Due date: 28 February following the end of the financial year.
 *
 * Source: ATO - Annual GST return
 */
export const ANNUAL_BAS_DUE_DATE = '2026-10-31' as const; // For 2025-26 FY (if lodging via agent, 28 Feb 2027)

// ─── Key Dates ───────────────────────────────────────────────────────────────

/**
 * Important tax and BAS dates for 2025-26.
 */
export const KEY_DATES_2025_26 = [
  { date: '2025-07-01', label: 'Start of 2025-26 financial year' },
  { date: '2025-10-28', label: 'Q1 BAS due' },
  { date: '2025-10-31', label: '2024-25 tax return due (self-lodgers)' },
  { date: '2026-02-28', label: 'Q2 BAS due' },
  { date: '2026-03-31', label: '2024-25 tax return due (via agent, most)' },
  { date: '2026-04-28', label: 'Q3 BAS due' },
  { date: '2026-06-30', label: 'End of 2025-26 financial year' },
  { date: '2026-07-28', label: 'Q4 BAS due' },
] as const;

// ─── Helper Functions ────────────────────────────────────────────────────────

/**
 * Returns the next upcoming BAS due date relative to a given date.
 * Defaults to today if no date is provided.
 */
export function getNextBASDueDate(fromDate?: Date): QuarterlyBASDates | null {
  const now = fromDate ?? new Date();
  const nowStr = now.toISOString().split('T')[0];

  for (const quarter of QUARTERLY_BAS_DATES) {
    if (quarter.dueDate >= nowStr) {
      return quarter;
    }
  }

  // All 2025-26 due dates have passed
  return null;
}

/**
 * Returns the monthly BAS due date for a given month.
 * Due on the 21st of the following month.
 */
export function getMonthlyBASDueDate(year: number, month: number): Date {
  // Move to next month
  const nextMonth = month + 1;
  const dueYear = nextMonth > 12 ? year + 1 : year;
  const dueMonth = nextMonth > 12 ? 1 : nextMonth;

  return new Date(dueYear, dueMonth - 1, MONTHLY_BAS_DUE_DAY);
}

/**
 * Determines whether quarterly or monthly BAS is appropriate
 * based on annual turnover.
 */
export function getRecommendedBASFrequency(
  annualTurnover: number
): 'monthly' | 'quarterly' | 'annual' {
  if (annualTurnover >= MONTHLY_BAS_TURNOVER_THRESHOLD) {
    return 'monthly';
  }
  if (annualTurnover >= 75_000) {
    return 'quarterly';
  }
  // Under GST threshold - annual reporting if voluntarily registered
  return 'annual';
}

/**
 * Returns the number of days until the next BAS due date.
 * Returns null if all 2025-26 dates have passed.
 */
export function daysUntilNextBAS(fromDate?: Date): number | null {
  const now = fromDate ?? new Date();
  const next = getNextBASDueDate(now);
  if (!next) return null;

  const dueDate = new Date(next.dueDate);
  const diffMs = dueDate.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
