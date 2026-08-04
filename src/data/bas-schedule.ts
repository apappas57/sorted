// BAS (Business Activity Statement) Schedule for 2026-27 Financial Year
// Verified 4 August 2026 against the ATO registered-agent lodgment program
// (page updated 1 July 2026).
// https://www.ato.gov.au/tax-and-super-professionals/for-tax-professionals/prepare-and-lodge/registered-agent-lodgment-program/due-dates-by-obligation-type/activity-statements

// ─── Types ───────────────────────────────────────────────────────────────────

export interface QuarterlyBASDates {
  quarter: 1 | 2 | 3 | 4;
  label: string;
  periodStart: string; // ISO date
  periodEnd: string; // ISO date
  dueDate: string; // ISO date - for self-lodgers
  onlineDueDate: string; // ISO date - 2-week concession for online self-lodgers
  agentDueDate: string; // ISO date - extended date via registered BAS/tax agent
}

// ─── Quarterly BAS Dates ─────────────────────────────────────────────────────

/**
 * Quarterly BAS lodgement and payment due dates for 2026-27.
 *
 * Q2 is the only weekend shift this year: 28 February 2027 falls on a Sunday,
 * so the effective date is Monday 1 March 2027. Q2 also gets no concession from
 * either channel, because the 28 February date already embeds a one-month
 * extension -- the ATO's agent table literally reads "Not applicable".
 *
 * The `onlineDueDate` 2-week concession is NOT automatic. It requires both
 * RECEIVING and LODGING online, and excludes monthly activity statements,
 * monthly GST payers with quarterly PAYG instalments, large business clients,
 * and quarterly instalment notices (forms R, S, T).
 *
 * Q4's agent date is formally provisional -- the ATO page carries "To be
 * confirmed when the Lodgment program 2027-28 is developed".
 */
export const QUARTERLY_BAS_DATES = [
  {
    quarter: 1 as const,
    label: 'Q1 July-September 2026',
    periodStart: '2026-07-01',
    periodEnd: '2026-09-30',
    dueDate: '2026-10-28',
    onlineDueDate: '2026-11-11',
    agentDueDate: '2026-11-25',
  },
  {
    quarter: 2 as const,
    label: 'Q2 October-December 2026',
    periodStart: '2026-10-01',
    periodEnd: '2026-12-31',
    // 28 Feb 2027 is a Sunday, so the deadline moves to Monday 1 March 2027.
    dueDate: '2027-03-01',
    onlineDueDate: '2027-03-01', // No concession for Q2
    agentDueDate: '2027-03-01', // No extension for Q2
  },
  {
    quarter: 3 as const,
    label: 'Q3 January-March 2027',
    periodStart: '2027-01-01',
    periodEnd: '2027-03-31',
    dueDate: '2027-04-28',
    onlineDueDate: '2027-05-12',
    agentDueDate: '2027-05-26',
  },
  {
    quarter: 4 as const,
    label: 'Q4 April-June 2027',
    periodStart: '2027-04-01',
    periodEnd: '2027-06-30',
    dueDate: '2027-07-28',
    onlineDueDate: '2027-08-11',
    agentDueDate: '2027-08-25',
  },
] satisfies QuarterlyBASDates[];

// ─── Monthly BAS ─────────────────────────────────────────────────────────────

/**
 * Monthly BAS is due on the 21st of the following month.
 * Required when GST turnover is $20M or more.
 */
export const MONTHLY_BAS_DUE_DAY = 21 as const;

/** Turnover threshold above which monthly BAS is required. */
export const MONTHLY_BAS_TURNOVER_THRESHOLD = 20_000_000 as const;

// ─── Annual BAS ──────────────────────────────────────────────────────────────

/**
 * Annual GST return for the 2026-27 year, for voluntary registrants under
 * $75,000 turnover. Due 31 October 2027 for self-lodgers (28 February 2028 via
 * a registered agent).
 */
export const ANNUAL_BAS_DUE_DATE = '2027-10-31' as const;

// ─── Key Dates ───────────────────────────────────────────────────────────────

/** Important tax and BAS dates for 2026-27. */
export const KEY_DATES_2026_27 = [
  { date: '2026-07-01', label: 'Start of 2026-27 financial year' },
  { date: '2026-10-28', label: 'Q1 BAS due' },
  { date: '2026-10-31', label: '2025-26 tax return due (self-lodgers)' },
  { date: '2027-03-01', label: 'Q2 BAS due (28 Feb falls on a Sunday)' },
  { date: '2027-03-31', label: '2025-26 tax return due (via agent, most)' },
  { date: '2027-04-28', label: 'Q3 BAS due' },
  { date: '2027-06-30', label: 'End of 2026-27 financial year' },
  { date: '2027-07-28', label: 'Q4 BAS due' },
] as const;

// ─── Helper Functions ────────────────────────────────────────────────────────

/**
 * Returns the next upcoming BAS due date relative to a given date.
 * Defaults to today if no date is provided.
 *
 * Returns null once every due date in the table has passed. That is a signal
 * the table needs rolling to the next financial year, NOT a normal state --
 * it silently returned null for months after the 2025-26 dates elapsed.
 */
export function getNextBASDueDate(fromDate?: Date): QuarterlyBASDates | null {
  const now = fromDate ?? new Date();
  const nowStr = now.toISOString().split('T')[0];

  for (const quarter of QUARTERLY_BAS_DATES) {
    if (quarter.dueDate >= nowStr) {
      return quarter;
    }
  }

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
 * Returns null if every date in the current table has passed.
 */
export function daysUntilNextBAS(fromDate?: Date): number | null {
  const now = fromDate ?? new Date();
  const next = getNextBASDueDate(now);
  if (!next) return null;

  const dueDate = new Date(next.dueDate);
  const diffMs = dueDate.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
