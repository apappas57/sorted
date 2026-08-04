# Sorted — recheck calendar

Rates verified 4 August 2026. Each item below has a known date on which it may
change. Sorted has no automated staleness check, so this file is the backstop.

Full sourced reference with per-figure citations: `tax-rates-2026-27-verified.md`

| When | What | Why |
|---|---|---|
| **13 Aug 2026** | **Instant asset write-off** | Senate Economics Legislation Committee reports on the Treasury Laws Amendment (Tax Reform No. 2) Bill 2026. If it passes, the threshold goes from the legislated $1,000 to $20,000 and `INSTANT_ASSET_WRITE_OFF` in `src/data/tax-brackets.ts` must change, along with the pending-legislation copy in `StepBusinessDeductions.tsx`, `prompt.ts`, `benefits.ts` and `deductions.ts`. |
| **20 Sep 2026** | Commonwealth Rent Assistance | Indexed twice yearly (20 Mar / 20 Sep). The September uplift falls *inside* FY2026-27, so the rates in `prompt.ts` go stale mid-year. |
| **Mar 2027** | Private health insurance rebate | Rebate percentages reset every 1 April. The rates from 1 April 2027 are not published until ~March 2027. FY2026-27 spans two rebate periods. |
| **~May 2027** | Medicare levy low-income thresholds | Currently PROVISIONAL. They are uplifted each year by an amending Act passed *after* the year ends and applied retrospectively. |
| **1 Jun 2027** | Study loan indexation rate | Applied to outstanding balances annually. The 2027 rate is not knowable in advance — do not assume 2.8% carries over. |
| **1 Jul 2027** | Everything | New financial year. Second marginal rate is **already legislated** to fall 15% -> 14%, giving bases of $3,752 / $30,752 / $51,102. The Working Australians Tax Offset (max $250) also starts. |

## Standing warnings

- **The ATO's consumer-facing "tax rates for Australian residents" page lags a
  full financial year.** In August 2026 its newest table was still 2025-26.
  Build from the Legal Database consolidation of the Income Tax Rates Act 1986
  and the PAYG withholding schedules (NAT 1004) instead.
- **When the marginal rate changes, recalculate the cumulative base amounts.**
  Changing the rate alone and leaving the bases is the classic bug — it
  overstated tax by exactly $268 for every taxpayer above $45,000 in 2026-27.
- **Cents per km:** the 2026-27 rate of 91c is an 89c base plus a one-off 2c
  uplift for this year only. Future indexation applies to the 89c base.
- **Model IDs get retired.** `claude-sonnet-4-20250514` was retired 15 Jun 2026
  and took the whole tool offline for ~7 weeks because the route returned a
  generic "try again" error. `ANTHROPIC_MODEL` now overrides the default
  without a redeploy, and permanent API failures log as FATAL.
