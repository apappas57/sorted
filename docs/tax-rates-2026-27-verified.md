# FY2026-27 AUSTRALIAN TAX REFERENCE — RECONCILED
**Compiled 4 August 2026 for hardcoding into a TypeScript tax-estimate tool.**
Income year 1 July 2026 to 30 June 2027. FBT year 1 April 2026 to 31 March 2027.

---

## 0. HOW TO READ THIS

**Legislative status labels used throughout:**

| Label | Meaning |
|---|---|
| `LEGISLATED` | Law, in force for FY2026-27. Safe to hardcode. |
| `ANNOUNCED` | Government policy, **not yet law**. Do NOT hardcode as if in effect. |
| `LAPSED` | Was law for FY2025-26, expired 30 June 2026, not renewed. |
| `PROVISIONAL` | Currently the law, but a retrospective amendment is near-certain. Ship with a caveat. |
| `UNPUBLISHED` | No authority exists yet. Do not invent a number. |

**Verification-coverage labels** (how many independent passes landed on the figure):

| Label | Meaning |
|---|---|
| `[2-SOURCE]` | Researcher and adversarial verifier both confirmed. Highest confidence. |
| `[1-SOURCE]` | Researcher cited a primary source; verifier did not independently re-confirm. **Not refuted.** |
| `[ENTAILED]` | Verifier did not confirm this row directly, but the value is arithmetically or logically forced by an adjacent `[2-SOURCE]` row. Treated as confirmed. |
| `[DISPUTED]` | Researcher and verifier disagreed. Both positions stated below. |
| `[UNCONFIRMED]` | No primary source exists. Listed under DO NOT SHIP. |

**One structural note before anything else.** The ATO's consumer-facing page `ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents` was last updated 1 June 2026 and its newest table is **2025-26**. A developer who builds from that page alone will silently ship last year's numbers. The authoritative FY2026-27 sources are (a) the ATO Legal Database consolidation of the *Income Tax Rates Act 1986*, and (b) the ATO tax tables / PAYG withholding schedules page, updated 17 June 2026.

---

## 1. WHAT CHANGED FROM FY2025-26

**This is the most important section. Every row below differs from the FY2025-26 value you may already have hardcoded.**

### 1a. Changed values

| Figure | FY2025-26 | FY2026-27 | Why it moved |
|---|---|---|---|
| Second marginal rate (18,201–45,000) | 16% | **15%** | Legislated (Act 28 of 2025) |
| Bracket 3 cumulative base | $4,288 | **$4,020** | Flows from the 15% cut |
| Bracket 4 cumulative base | $31,288 | **$31,020** | Flows from the 15% cut |
| Bracket 5 cumulative base | $51,638 | **$51,370** | Flows from the 15% cut |
| MLS/PHI singles tier boundaries | 101,000 / 118,000 / 158,000 | **105,000 / 123,000 / 164,000** | Indexed (AWOTE) |
| MLS/PHI family tier boundaries | 202,000 / 236,000 / 316,000 | **210,000 / 246,000 / 328,000** | Indexed (AWOTE) |
| PHI rebate %, under 65, base tier | 24.288% (to 31 Mar 2026) | **24.118%** | Rebate Adjustment Factor, 1 Apr 2026 |
| PHI rebate %, 65–69, base tier | 28.337% | **28.139%** | Same |
| PHI rebate %, 70+, base tier | 32.385% | **32.158%** | Same |
| HELP minimum repayment threshold | $67,000 | **$69,528** | Indexed (AWE, +3.7731%) |
| HELP tier 2 upper bound | $125,000 | **$129,717** | Indexed |
| HELP tier 3 cumulative base | $8,700 | **$9,028** | Indexed |
| HELP tier 3 upper bound | $179,285 | **$186,050** | Indexed |
| HELP top-tier entry | $179,286 | **$186,051** | Indexed |
| HELP indexation rate applied 1 June | 3.2% (2025) | **2.8% (1 Jun 2026)** | CPI/WPI lower-of |
| Maximum super contribution base | $62,500 **per quarter** | **$270,830 per annum** | Structural: Payday Super |
| Concessional contributions cap | $30,000 | **$32,500** | Indexed (AWOTE, $2,500 steps) |
| Non-concessional cap (annual) | $120,000 | **$130,000** | 4x concessional cap |
| Non-concessional bring-forward (3yr) | $360,000 | **$390,000** | 3x annual cap (derived) |
| Co-contribution lower threshold | $47,488 | **$49,293** | Indexed |
| Co-contribution higher threshold | $62,488 | **$64,293** | Lower + $15,000 |
| General transfer balance cap | $2.0m | **$2.1m** | Indexed (CPI, $100k steps) |
| Small business CGT cap (lifetime) | $1,865,000 | **$1,935,000** | Indexed (AWOTE, $5k steps) |
| Car limit for depreciation | $69,674 | **$69,883** | Indexed (motor vehicle CPI) |
| Max GST credit on a car | $6,334 | **$6,353** | 1/11 of car limit |
| LCT threshold, fuel-efficient | (not fetched) | **$91,661** | Indexed |
| LCT threshold, other vehicles | (not fetched) | **$80,809** | Indexed |
| FBT record-keeping exemption | $10,664 | **$10,962** | Indexed |
| Cents per kilometre rate | 88c | **91c** | Indexed 89c base + one-off 2c uplift |
| Max cents/km claim per car | $4,400 | **$4,550** | 5,000km x 91c |
| Rent Assistance, single no children | $215.40/ft | **$219.40/ft** | Indexed 20 Mar 2026 |
| Rent Assistance, couple no children | $203.00/ft | **$206.80/ft** | Indexed 20 Mar 2026 |
| Rent Assistance, 1–2 children | $253.12/ft | **$257.88/ft** | Indexed 20 Mar 2026 |
| Rent Assistance, 3+ children | $286.02/ft | **$291.48/ft** | Indexed 20 Mar 2026 |
| FTB A max, child 0–12 | $227.36/ft | **$235.48/ft** | Indexed 1 Jul 2026 |
| FTB A max, child 13–19 | $295.82/ft | **$306.46/ft** | Indexed 1 Jul 2026 |
| FTB A base rate | $72.94/ft | **$75.60/ft** | Indexed 1 Jul 2026 |
| FTB A supplement (per child) | $938.05 | **$970.90** | Indexed 1 Jul 2026 |
| FTB B max, youngest 0–4 | $193.34/ft | **$200.34/ft** | Indexed 1 Jul 2026 |
| FTB B max, youngest 5–18 | $134.96/ft | **$139.86/ft** | Indexed 1 Jul 2026 |
| FTB B supplement (per family) | $459.90 | **$478.15** | Indexed 1 Jul 2026 |
| FTB B higher-earner nil limit | $120,007 | **$124,327** | Indexed |
| FTB B lower-earner limit, youngest <5 | $34,438 | **$35,661** | Indexed |
| FTB B lower-earner limit, youngest 5–18 | $26,828 | **$27,777** | Indexed |
| Norfolk Island SG transitional rate | 10% | **11%** | Legislated step |

### 1b. NEW for FY2026-27 (did not exist in FY2025-26)

| Measure | Value | Status |
|---|---|---|
| **Standard deduction for work-related expenses** | up to **$1,000**, automatic | `LEGISLATED` (Royal Assent 26 Jun 2026), applies to the 2026-27 return |
| **Division 296 tax on large super balances** | extra 15% above $3m TSB; further 10% above $10m | `LEGISLATED`, applies from 1 Jul 2026 |
| **Payday Super** | SG due each payday, base is "qualifying earnings" not OTE | `LEGISLATED`, from 1 Jul 2026 |

### 1c. EXPIRED / LAPSED — remove this logic

| Measure | What happened |
|---|---|
| **$20,000 instant asset write-off** | `LAPSED` 30 June 2026. Not re-legislated. See §5.1, this is the single highest-risk item in the whole document. |
| **Quarterly SG regime** | `LAPSED` 30 June 2026. Quarterly due dates (28 Oct/Jan/Apr/Jul) and the $62,500 quarterly maximum contribution base no longer exist. Replaced by Payday Super and an annual $270,830 base. |
| **One-off 20% study loan debt reduction** | `LAPSED`. One-off, applied to balances existing 1 June 2025, fully processed. Never apply to a FY2026-27 balance. |
| **PHI rebate rates 24.288% / 16.192% / 8.095% (and age-band equivalents)** | `LAPSED` 31 March 2026. Do not use for any FY2026-27 period. |
| **Small business 5-year simplified-depreciation re-entry lockout suspension** | Technically `LAPSED` 30 June 2026. Extension to 30 June 2027 sits in the same unpassed bill as the $20,000 IAWO. |

### 1d. Confirmed UNCHANGED (safe to carry forward)

Tax-free threshold $18,200; marginal rates 30/37/45%; bracket thresholds $45,000/$135,000/$190,000; LITO $700 and all its bands; Medicare levy 2%; MLS rates 1%/1.25%/1.5%; MLS child increment $1,500; SG rate 12%; co-contribution max $500; FHSS $15,000/$50,000; Division 293 threshold $250,000; LISTO $500 / $37,000; GST registration $75,000 / $150,000 NFP; FBT rate 47%; gross-up 2.0802 / 1.8868; reportable FBT $2,000 / $3,773; statutory formula 20%; WFH fixed rate 70c/hr; cents-per-km 5,000km cap; HELP marginal rates 15/17/10%; EV FBT exemption; PHEV exclusion.

---

## 2. DO NOT SHIP WITHOUT CHECKING

**Four items where no primary source supports a FY2026-27 number, or where the number in force today is expected to be overwritten. No figure has been invented to fill any of these gaps.**

### 2.1 Instant asset write-off threshold — `LAPSED`, contested `[1-SOURCE]`

- **Legislated position today (4 Aug 2026): $1,000.** The $20,000 concession lapsed 30 June 2026. When the *Income Tax (Transitional Provisions) Act 1997* Div 328 uplift lapses, the operative provision reverts to ITAA 1997 s 328-180, whose heading reads verbatim "Assets costing less than $1,000".
- **Announced but NOT law: $20,000 permanent from 1 July 2026.** Vehicle is the *Treasury Laws Amendment (Tax Reform No. 2) Bill 2026*. APH status: "Before Reps". Introduced 25 Jun 2026, referred to Senate Economics Legislation Committee, report due **13 August 2026**. Not passed either house. `[2-SOURCE]`
- **Why it is here:** the $1,000 reversion carries a `[1-SOURCE]` verification. The reasoning is sound (if $20,000 is not law, the statutory default applies) but the specific $1,000 default was not independently re-confirmed, and the ATO limits table simply ends at 30 June 2026 with no 2026-27 row at all.
- **Do:** show $1,000 with a prominent "announced but not yet law: $20,000 proposed" banner, OR decline to estimate. Do NOT hardcode $20,000. Note a COSBOA submission argued for $150,000, so the final legislated figure may not be $20,000 either.
- **Recheck: after 13 August 2026.**
- Sources: https://www.aph.gov.au/Parliamentary_Business/Bills_Legislation/Bills_Search_Results/Result?bId=r7502 and https://www.ato.gov.au/about-ato/new-legislation/in-detail/businesses/small-business-support-20000-dollar-instant-asset-write-off

### 2.2 PHI rebate percentages, 1 April 2027 to 30 June 2027 — `UNPUBLISHED`

- **No value exists.** The ATO states verbatim that "the rebate rates from 1 April 2027 will become available in March 2027."
- FY2026-27 is split into two rebate periods. Only the first (1 Jul 2026 to 31 Mar 2027) has published rates.
- Historically the Rebate Adjustment Factor reduces the rebate slightly each 1 April (24.608% then 24.288% then 24.118% for the under-65 base tier), but **do not extrapolate**.
- **Do:** either apply the 1 Jul 2026 rates across the whole year behind a visible caveat, or prompt the user that Q4 rates are pending.
- **Recheck: March 2027.**
- Source: https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/private-health-insurance-rebate/income-thresholds-and-rates-for-the-private-health-insurance-rebate

### 2.3 Medicare levy low-income thresholds — `PROVISIONAL`, all eight figures

- The values in §4.2 are the law **today**, substituted by Act No 58 of 2026 and expressed to apply to "the 2025-26 year of income and later years of income". So they legally govern FY2026-27 right now.
- **But they are indexed annually via a manual amending Act passed after the year ends and applied retrospectively.** Every recent year has been uplifted this way ($27,222 to $28,011 for 2025-26; $26,000 to $27,222 for 2024-25). A CPI-scale uplift for 2026-27 is near-certain, probably around the 2027-28 Budget.
- The ATO's own page still reads "In 2025-26, you don't have to pay the Medicare levy if..." and publishes no 2026-27 table.
- **Do:** use the figures, label them provisional in the UI, and diarise a recheck.
- **Recheck: ~May 2027.**

### 2.4 Figures derived by arithmetic rather than lifted from a published table

None of these are guesses, but none were read off a government table either. All reconcile (see §8), and the derivation method reproduces the ATO's published FY2025-26 figures exactly.

| Figure | Value | Derivation | Corroboration |
|---|---|---|---|
| Bracket cumulative bases | $4,020 / $31,020 / $51,370 | 15% x $26,800, then compounding | PwC Worldwide Tax Summaries 2026/27 (non-government). **Cross-check against ATO PAYG Schedule 1 (NAT 1004), published 17 Jun 2026, which embeds these amounts.** |
| Non-concessional bring-forward (3yr) | $390,000 | 3 x $130,000 | ATO states the 3x rule but does not print the dollar figure |
| Max GST credit on a car | $6,353 | $69,883 / 11 | Exact, no rounding residue |
| LCT prior-year comparatives | — | not fetched | FY2026-27 values are `[2-SOURCE]`; **the FY2025-26 comparatives are unverified** |
| HELP PAYG weekly trigger, FY2025-26 comparative (~$1,288) | — | inferred | FY2026-27 value $1,337 is fetched and confirmed; **the prior-year comparative is unverified** |
| Overseas/expat HELP obligations | unchanged | search summaries only | A non-government blog claimed a "1 July 2026 change for expats". **No .gov.au source corroborates it.** Verify directly before building expat logic. |

---

## 3. DISPUTED

### 3.1 "No ATO-published bracket table exists for FY2026-27" — **DISPUTED, verifier accepted**

- **Researcher claimed:** as at 4 Aug 2026 there is no ATO-published FY2026-27 resident bracket table, so the cumulative base amounts rest on legislation plus arithmetic.
- **Verifier refuted as overstated:** the narrow half is true (the ATO's "Tax rates, Australian resident" page was last updated 1 June 2026 and its newest table is 2025-26). But the ATO **has** affirmatively published the 2026-27 rates through two other channels: (a) the ATO Legal Database carries the statutory 2026-27 table (15/30/37/45) in *ITRA 1986* Sch 7 Pt I cl 1, and (b) the ATO Tax tables page, updated 17 June 2026, states the *More Cost of Living Relief Act 2025* rates "will apply to the 2026-27 income year resulting in updates to all 15 withholding schedules and 12 tax tables from 1 July 2026."
- **I accept the verifier.** The correct characterisation is a **stale guidance page, not an absence of ATO authority**. This *strengthens* confidence in the bracket figures rather than weakening it.
- **Consequence for the developer:** the practical warning still stands (do not build from the consumer rates page), but you have two live ATO cross-checks available: the Legal Database consolidation and NAT 1004.
- Source: https://www.ato.gov.au/tax-rates-and-codes/tax-tables-overview

### 3.2 Note on `[1-SOURCE]` rows generally — not a dispute

Several individually critical rows (tax-free threshold, the 15% rate, each bracket, LITO maximum) carry a `NOT-VERIFIED` verdict from the adversarial pass. **This is verification coverage, not doubt.** In every case:

- The **consolidated bracket table row**, which restates all five brackets and all three base amounts verbatim, **was CONFIRMED**; and
- The verifier's own §3.1 refutation independently quoted the ATO tax tables page confirming the 15% rate applies to 2026-27.

So the headline change is effectively two-source confirmed through a different route. I mark these `[ENTAILED]` below and treat them as safe.

---

## 4. DOMAIN: INCOME TAX

### 4.1 Resident bracket table, FY2026-27 — `LEGISLATED` `[2-SOURCE]`

| Taxable income | Rate | Tax on this income |
|---|---|---|
| $0 – $18,200 | Nil | Nil |
| $18,201 – $45,000 | **15%** | 15c per $1 over $18,200 |
| $45,001 – $135,000 | 30% | **$4,020** + 30c per $1 over $45,000 |
| $135,001 – $190,000 | 37% | **$31,020** + 37c per $1 over $135,000 |
| $190,001 + | 45% | **$51,370** + 45c per $1 over $190,000 |

Excludes Medicare levy (2%), MLS, LITO and all offsets. Assumes full-year Australian resident entitled to the full tax-free threshold.

**Legal authority:** *Income Tax Rates Act 1986* Sch 7 Pt I cl 1, table "Tax rates for resident taxpayers for the 2026-27 year of income", inserted by *Treasury Laws Amendment (More Cost of Living Relief) Act 2025* (Act No. 28 of 2025) Sch 1 items 1-2, registered 31 March 2025.
Source: https://www.ato.gov.au/law/view/print?DocID=PAC/19860107/Sch7-PtI-1&PiT=99991231235958
Amending Act text: https://www.ato.gov.au/law/view/pdf/acts/20250028.pdf
Tax-free threshold definition (s 3(1), flat $18,200, not indexed, unamended since 2015): https://www.ato.gov.au/law/view/print?DocID=PAC/19860107/3

**Confirmed clean:** the two new June 2026 Acts (*Treasury Laws Amendment (Tax Reform No. 1) Act 2026* = Act 49 of 2026, and *Income Tax Rates Amendment (Tax Reform No. 1) Act 2026*, both assented 26 June 2026) did **not** alter the resident marginal bracket table.

#### Requirement 5: cumulative base arithmetic reconciliation

Rule: `base(n) = base(n-1) + (width of bracket n-1 x rate of bracket n-1)`

| Bracket | Prior base | Bracket width below | Rate below | Computed base | Published | Reconciles? |
|---|---|---|---|---|---|---|
| $18,201+ | $0 | $18,200 | 0% | $0 | $0 | **YES** |
| $45,001+ | $0 | $45,000 − $18,200 = $26,800 | 15% | 0 + 4,020 = **$4,020** | $4,020 | **YES** |
| $135,001+ | $4,020 | $135,000 − $45,000 = $90,000 | 30% | 4,020 + 27,000 = **$31,020** | $31,020 | **YES** |
| $190,001+ | $31,020 | $190,000 − $135,000 = $55,000 | 37% | 31,020 + 20,350 = **$51,370** | $51,370 | **YES** |

**All four reconcile exactly. No flags.**

**Method validation against FY2025-26 (which the ATO does publish):** 16% x 26,800 = 4,288 ✓; 4,288 + 27,000 = 31,288 ✓; 31,288 + 20,350 = 51,638 ✓. The method reproduces the ATO's published prior-year table exactly, so the FY2026-27 derivation is sound.

**Sanity values:** $45,000 → $4,020. $60,000 → $8,520. $135,000 → $31,020. $190,000 → $51,370. $250,000 → $78,370. (All pre-Medicare, pre-offset.)

> **THE #1 BUG IN THIS DOMAIN:** updating the rate from 16% to 15% but leaving the base amounts at $4,288 / $31,288 / $51,638. That overstates tax by exactly **$268 for every taxpayer earning above $45,000**. The saving from the cut is capped at $268 (1% x $26,800).

```ts
// FY2026-27 resident brackets. Verify against ATO NAT 1004 (published 17 Jun 2026).
export const BRACKETS_2026_27 = [
  { min: 0,       max: 18_200,        rate: 0.00, base: 0      },
  { min: 18_200,  max: 45_000,        rate: 0.15, base: 0      },
  { min: 45_000,  max: 135_000,       rate: 0.30, base: 4_020  },
  { min: 135_000, max: 190_000,       rate: 0.37, base: 31_020 },
  { min: 190_000, max: Infinity,      rate: 0.45, base: 51_370 },
] as const;
```

### 4.2 Low Income Tax Offset (LITO) — `LEGISLATED`, UNCHANGED

| Relevant income | Offset |
|---|---|
| $0 – $37,500 | **$700** |
| $37,501 – $45,000 | $700 less 5c per $1 over $37,500 (falls $700 → $325) |
| $45,001 – $66,667 | $325 less 1.5c per $1 over $45,000 (falls $325 → $0) |
| $66,668 + | Nil |

`LEGISLATED` flat, **not indexed**. Table last substituted by Act No 52 of 2019; untouched by the 2025 or 2026 tax-cut Acts. `[2-SOURCE]` on both taper bands, `[ENTAILED]` on the $700 maximum and $37,500 threshold (both restated verbatim inside the confirmed taper rows).

Authority: *ITAA 1997* s 61-115(1) (rate table) and s 61-110 (entitlement, cut-out $66,667).
Source: https://www.ato.gov.au/law/view/print?DocID=PAC/19970038/61-115

**Reconciliation:** $700 − 5% x $7,500 = $325 at $45,000, which matches the second band's opening value ✓. $325 − 1.5% x $21,667 = −$0.005 ≈ $0 at $66,667 ✓.

**Implementation notes:** LITO is **non-refundable**. It reduces tax payable to $0 only, cannot be refunded, transferred or carried forward, and is applied **after** the gross tax calculation. **It does not reduce the Medicare levy.** Effective marginal rates including the taper: 20% across $37,501–$45,000; 31.5% across $45,001–$66,667 (both before Medicare levy).

### 4.3 Standard deduction for work-related expenses — **NEW**, `LEGISLATED` `[2-SOURCE]`

- **Up to $1,000, automatic**, first applies to the **2026-27 individual return**.
- ATO verbatim: "This measure is now law... will commence on 1 July 2026 and apply to the 2026-27 individual tax return. The standard deduction does not apply to the 2025-26 individual tax return."
- Enacted by *Treasury Laws Amendment (Tax Reform No. 1) Act 2026* (Act 49 of 2026) and *Income Tax Rates Amendment (Tax Reform No. 1) Act 2026*, Royal Assent 26 June 2026.
- **Eligibility:** Australian tax residents who **earn income from work**. People with only business or investment income are **not** eligible. Taxpayers with more than $1,000 of work-related expenses keep current itemising arrangements.
- **Claimable IN ADDITION:** non-work-related expenses (investment expenses, charitable donations), union and professional association fees, income protection insurance premiums.
- Anti-double-dipping rules block salary-packaged expenses already covered. Substantiation and capital allowance rules were updated.
- Budget estimate: average benefit $205 for 6.2 million workers.
- **Tool design:** compare the taxpayer's itemised work-related deductions (**including** cents-per-km and WFH fixed-rate claims, which sit inside the envelope) against $1,000 and apply the greater. Either handle it or state explicitly that the tool does not.
- Source: https://www.ato.gov.au/about-ato/new-legislation/in-detail/individuals/standard-deduction-for-work-related-expenses

### 4.4 Forward notes — do NOT apply to FY2026-27

**Already legislated, effective 1 July 2027:**
- Lowest marginal rate falls **15% → 14%**. Resulting 2027-28 table: $3,752 + 30c over $45,000; $30,752 + 37c over $135,000; $51,102 + 45c over $190,000. Same source (Sch 7 Pt I cl 1, "2027-28 year of income or a later year"). Thresholds and upper three rates unchanged.
- **Working Australians Tax Offset (WATO), max $250**, available **from 2027-28 only**. Non-refundable. Requires residency plus net labour income above the tax-free threshold. Source: https://www.ato.gov.au/about-ato/new-legislation/in-detail/individuals/working-australians-tax-offset
- The commentary figure of a "~$19,985 effective tax-free threshold in 2027-28" was **not** verified against a government source. Treat as low confidence.

---

## 5. DOMAIN: MEDICARE LEVY, MLS AND PRIVATE HEALTH INSURANCE

### 5.1 Medicare levy rate — `LEGISLATED`, UNCHANGED `[2-SOURCE]`

**2% of taxable income.** *Medicare Levy Act 1986* s 6(1): "The rate of levy payable by a person upon a taxable income is 2%." Flat, not indexed, unchanged since 1 July 2014.
Source: https://www.ato.gov.au/law/view/print?DocID=PAC/19860110/6

### 5.2 Medicare levy low-income reduction thresholds — `PROVISIONAL` (see §2.3)

| Category | Lower (no levy at or below) | Upper (full 2% above) |
|---|---|---|
| Single | **$28,011** `[1-SOURCE]` | **$35,013** `[1-SOURCE]` |
| Single, SAPTO | **$44,268** `[2-SOURCE]` | **$55,335** `[2-SOURCE]` |
| Family | **$47,238** `[ENTAILED]` | **$59,047** `[2-SOURCE]` |
| Family, SAPTO | **$61,623** `[2-SOURCE]` | **$77,028** `[2-SOURCE]` |
| **Per dependent child, added to lower** | **+$4,338** `[2-SOURCE]` | |
| **Per dependent child, added to upper** | | **+$5,423** `[2-SOURCE]` |

**Authority:** *Medicare Levy Act 1986* s 3 ("threshold amount", "phase-in limit") and s 8(5) ("family income threshold"), all substituted by **Act No 58 of 2026** Sch 5, effective 1 July 2026 and applicable to "the 2025-26 year of income and later years of income".
Sources: https://www.ato.gov.au/law/view/print?DocID=PAC/19860110/3 · https://www.ato.gov.au/law/view/print?DocID=PAC/19860110/8 · https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy/medicare-levy-reduction/medicare-levy-reduction-for-low-income-earners · https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy/medicare-levy-reduction/medicare-levy-reduction-family-income

**Mechanics:** between lower and upper, levy = **10 cents per $1 above the lower threshold**. Upper = lower / 0.8 (truncated).

**Reconciliation (all pass):**
- Single: 28,011 / 0.8 = 35,013.75 → $35,013 ✓. At the upper: 10% x (35,013 − 28,011) = $700.20 vs 2% x 35,013 = $700.26 ✓ (truncation residue).
- Single SAPTO: 44,268 / 0.8 = $55,335 exactly ✓. At the upper: 10% x 11,067 = $1,106.70 = 2% x 55,335 ✓ exactly.
- Family: 47,238 / 0.8 = 59,047.50 → $59,047 ✓. At the upper: 10% x 11,809 = $1,180.90 vs 2% x 59,047 = $1,180.94 ✓.
- Family SAPTO: 61,623 / 0.8 = 77,028.75 → $77,028 ✓.
- Child increment: 4,338 / 0.8 = 5,422.50 → **$5,423**. ⚠ **Flag:** this one rounds UP while every threshold truncates DOWN. Use the ATO's published $5,423, do not derive it with a floor.

**Traps:**
1. The **$4,338 child increment applies from the FIRST child**. Do not confuse it with the MLS **$1,500** increment, which applies only **after the first**.
2. Many calculators apply the child increment only to the lower threshold. **It applies to both**, at different amounts.
3. An individual only tests the FAMILY reduction if their **own** taxable income exceeds $35,013 ($55,335 with SAPTO).
4. SAPTO entitlement for singles ceases at rebate income $52,759, so the SAPTO upper threshold is only reachable in limited cases. If SAPTO reduces to zero before the upper limit, use the non-SAPTO thresholds.

### 5.3 Medicare Levy Surcharge — `LEGISLATED`, thresholds indexed and CHANGED

| Tier | Singles | Families | Rate |
|---|---|---|---|
| Base | $105,000 or less `[ENTAILED]` | $210,000 or less `[ENTAILED]` | **0%** |
| Tier 1 | $105,001 – $123,000 `[2-SOURCE]` | $210,001 – $246,000 `[2-SOURCE]` | **1%** |
| Tier 2 | $123,001 – $164,000 `[2-SOURCE]` | $246,001 – $328,000 `[2-SOURCE]` | **1.25%** |
| Tier 3 | $164,001 + `[2-SOURCE]` | $328,001 + `[2-SOURCE]` | **1.5%** |

Family thresholds **+$1,500 for each MLS dependent child AFTER THE FIRST** (`LEGISLATED` flat, not indexed, unchanged for many years).

Source: https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge/medicare-levy-surcharge-income-thresholds-and-rates (ATO page updated 22 June 2026, explicitly publishes a 2026-27 table). Cross-confirmed: https://www.privatehealth.gov.au/health_insurance/surcharges_incentives/insurance_rebate.htm

**Reconciliation:** family boundaries are exactly 2x singles at every tier (105,000x2 = 210,000 ✓; 123,000x2 = 246,000 ✓; 164,000x2 = 328,000 ✓). Base-tier ceilings are entailed by the confirmed Tier 1 floors.

**Traps:**
1. Thresholds test **"income for MLS purposes"**, not taxable income. That is: taxable income + reportable fringe benefits + reportable employer super + deductible personal super contributions + net investment losses + exempt foreign employment income + spouse's s 98 trust share.
2. The surcharge applies to the **whole** of income for MLS purposes, **not** just the excess above the threshold. ATO worked example: $117,000 x 1% = $1,170.
3. MLS is **in addition** to the 2% levy. A top-tier single without hospital cover pays **3.5% total**.
4. Family tiers apply to couples (including de facto) **and single parents**.

### 5.4 Private health insurance rebate

**Income thresholds: identical to the MLS thresholds in §5.3.** Indexed annually, changed 1 July 2026.
Source: https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/private-health-insurance-rebate/income-thresholds-and-rates-for-the-private-health-insurance-rebate

**Rebate percentages, 1 July 2026 to 31 March 2027** `[2-SOURCE]`:

| Age band (oldest person on the policy) | Base | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|---|
| Under 65 | **24.118%** | **16.079%** | **8.038%** | 0% |
| 65 – 69 | **28.139%** | **20.098%** | **12.058%** | 0% |
| 70 and over | **32.158%** | **24.118%** | **16.079%** | 0% |

**Rebate percentages, 1 April 2027 to 30 June 2027: `UNPUBLISHED`. See §2.2.**

**Reconciliation:** the nine non-zero values form a single uniform ladder in ~8.04 percentage-point steps: 32.158 / 28.139 / 24.118 / 20.098 / 16.079 / 12.058 / 8.038. Internally consistent. **Use the published values, do not derive them** (the step is not exactly base/3).

**Two different dates, and this is a common calculator bug:**
- Income **THRESHOLDS** change on **1 July**.
- Rebate **PERCENTAGES** change on **1 April**, via the Rebate Adjustment Factor (*Private Health Insurance Act 2007*; formula uses CPI growth versus the industry weighted-average premium increase).
- **FY2026-27 therefore has TWO rebate-percentage periods.** A tool applying one rate for the whole year is wrong.
- The 1 April 2026 rates carry forward unchanged into 1 Jul 2026 – 31 Mar 2027. They are not a new set.

**Further notes:** the rebate does not apply to the Lifetime Health Cover loading component of a premium (since 1 Jul 2013), nor to extras-only cover above the eligible amount. Rebate tier is age-banded on the **oldest** person covered.

---

## 6. DOMAIN: STUDY AND TRAINING LOANS (HELP / HECS)

**All figures from:** https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds (ATO page last updated 30 June 2026). Every row `[2-SOURCE]`.

### 6.1 FY2026-27 repayment table — `LEGISLATED`

| Repayment income | Calculation |
|---|---|
| $0 – $69,528 | Nil |
| $69,529 – $129,717 | 15c per $1 over $69,528 (base $0) |
| $129,718 – $186,050 | **$9,028** + 17c per $1 over $129,717 |
| **$186,051 +** | **10% of TOTAL repayment income** (not marginal, no base, from dollar one) |

```ts
// FY2026-27 study loan repayment. NOTE the top tier is NOT marginal.
export function helpRepayment2026_27(income: number): number {
  if (income >= 186_051) return income * 0.10;           // flat, whole income
  if (income >= 129_718) return 9_028 + (income - 129_717) * 0.17;
  if (income >= 69_529)  return (income - 69_528) * 0.15;
  return 0;
}
```

### 6.2 The two critical implementation traps

**TRAP 1 — the top tier breaks the marginal pattern.** Tier 4 is a flat **10% of the entire repayment income**, with **no threshold subtraction and no cumulative base**. ATO worked example 3: repayment income $254,780 x 10% = **$25,478**. A marginal-style calculation here overstates repayment massively.

**TRAP 2 — the ATO's own page contains a stale figure.** Inside its 2026-27 Example 3 the ATO writes "This is above the threshold of $179,286", which is the **2025-26** boundary. Table 1 on the same page authoritatively states **$186,051 and over**. **Do not code $179,286.**

### 6.3 Arithmetic reconciliation

- **Tier 3 base:** 0.15 x ($129,717 − $69,528) = 0.15 x $60,189 = **$9,028.35**. Published as **$9,028** (rounded down). ⚠ Use the ATO's published $9,028, but be aware the tier-4 boundary was derived from the **unrounded** $9,028.35, leaving a harmless ~32c discontinuity at the boundary.
- **Tier 4 crossover:** solve $9,028.35 + 0.17(X − $129,717) = 0.10X → 0.07X = $13,023.54 → X = **$186,050.57** → published boundary $186,051 ✓.
- **Method validation on FY2025-26:** 0.15 x ($125,000 − $67,000) = $8,700 ✓ (matches published). Crossover: 0.07X = $12,550 → X = $179,285.71 → $179,286 ✓ (matches published). Method is sound.
- **Indexation uniformity:** 69,528/67,000 = 1.037731; 129,717/125,000 = 1.037736; 186,050/179,285 = 1.037733. A single ~3.773% factor applied to every boundary, which independently corroborates that this is a genuine full indexed table and not a partial update.

### 6.4 Other HELP facts

| Item | FY2026-27 | Status |
|---|---|---|
| Marginal rates 15% / 17% / 10% | Unchanged | `LEGISLATED` flat. **Rates static, thresholds indexed.** |
| Threshold indexation basis | Average Weekly Earnings (AWE) | Will change again for 2027-28. Do not hardcode without an annual review. Source: https://www.ato.gov.au/individuals-and-families/study-and-training-support-loans/study-and-training-loans-what-s-new |
| Indexation applied to debts 1 June 2026 | **2.8%** (was 3.2% on 1 Jun 2025) | Lower of CPI or WPI. Source: https://www.ato.gov.au/tax-rates-and-codes/study-and-training-loan-indexation-rates plus studyassist.gov.au news item 7 May 2026. **The 1 June 2027 rate is not knowable. Do not assume 2.8%.** |
| One-off 20% debt reduction | **NOT AVAILABLE.** `LAPSED` | One-off, applied to balances existing 1 June 2025, processing complete. |
| PAYG weekly withholding trigger | **$1,337/week or more** (tax-free threshold claimed) | Reconciles: $69,528 / 52 = $1,337.08. Source: https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-weekly-tax-table |
| Loan types | HELP, VSL, SFSS, SSL, ABSTUDY SSL, AASL share **one** table | If your code has a legacy separate SFSS path, **remove it**. Repayment order: HELP, VSL, SFSS, SSL, ABSTUDY SSL, AASL. |

**Repayment income definition** (unchanged, and worth surfacing in the UI because users routinely enter taxable income alone and under-estimate): taxable income **excluding** assessable First Home Super Saver released amounts, **plus** reportable fringe benefits (even from exempt employers), **plus** total net investment loss including net rental losses, **plus** reportable super contributions, **plus** exempt foreign employment income.

---

## 7. DOMAIN: SUPERANNUATION

### 7.1 Contributions and SG

| Figure | FY2026-27 | FY2025-26 | Status |
|---|---|---|---|
| SG rate (general) | **12.00%** | 12.00% | `LEGISLATED` flat, final step. 12.00% also shown for "1 July 2027 onwards". `[2-SOURCE]` |
| Norfolk Island SG transitional | **11%** | 10% | `LEGISLATED` |
| **Maximum contribution base** | **$270,830 PER ANNUM** | $62,500 **per quarter** | **STRUCTURAL CHANGE.** `[2-SOURCE]` |
| Concessional cap | **$32,500** | $30,000 | Indexed AWOTE, $2,500 steps `[2-SOURCE]` |
| Non-concessional cap | **$130,000** | $120,000 | 4x concessional `[2-SOURCE]` |
| NCC 3-year bring-forward | **$390,000** (derived) | $360,000 | See §2.4 |
| NCC 2-year bring-forward | $260,000 (derived) | $240,000 | See §2.4 |
| Division 293 threshold | **$250,000** | $250,000 | `LEGISLATED` flat, "2017-18 onwards". Rate 15%. `[2-SOURCE]` |
| General transfer balance cap | **$2.1m** | $2.0m | Indexed CPI, $100k steps `[2-SOURCE]` |
| Small business CGT cap (lifetime) | **$1,935,000** | $1,865,000 | Indexed AWOTE, $5k steps `[2-SOURCE]` |

Sources: https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/super-guarantee · .../contributions-caps · .../transfer-balance-cap · .../division-293-tax

**HIGHEST-RISK ITEM IN THIS DOMAIN — the maximum contribution base.** The **quarterly** base expired 30 June 2026 with the end of quarterly SG. From 1 July 2026 it is a single **annual** $270,830. **Any tool still multiplying a quarterly base by 4, or applying $62,500/quarter, is wrong for FY2026-27.** Derivation (ATO formula): concessional cap x 100 / charge percentage = $32,500 x 100 / 12 = $270,833.33, rounded down to the nearest $10 = **$270,830** ✓.

**Payday Super, two changes in one:** (a) SG is now due **each payday**, not quarterly; (b) the earnings base changed from **ordinary time earnings (OTE)** to **"qualifying earnings"**. The full definitional difference was not verified in this pass, so **treat any OTE-based calculation as needing separate review**.

**Transfer balance cap off-by-one-year trap:** the NCC cap is **nil** for a year if total super balance at 30 June of the **prior** year is at or above the general transfer balance cap. For FY2026-27 contributions the test uses the balance at **30 June 2026** against the **$2.0m** cap that applied then, **not $2.1m**.

### 7.2 Government contributions and offsets

| Figure | FY2026-27 | FY2025-26 | Status |
|---|---|---|---|
| Co-contribution maximum | **$500** | $500 | `LEGISLATED` flat since 2012-13. Matching rate 50c per $1. |
| Co-contribution lower threshold | **$49,293** | $47,488 | Indexed AWOTE |
| Co-contribution higher threshold (cut-out) | **$64,293** | $62,488 | = lower + $15,000 ✓ |
| LISTO maximum | **$500** (min payment $10) | $500 | `LEGISLATED` flat since 2017. 15% of concessional contributions, capped. |
| LISTO income threshold | **$37,000** adjusted taxable income | $37,000 | `LEGISLATED` flat, **never indexed** |
| FHSS annual limit | **$15,000** | $15,000 | `LEGISLATED` flat since 2017 |
| FHSS lifetime total | **$50,000** | $50,000 | `LEGISLATED` flat since 1 Jul 2022 |

Sources: https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/government-contributions · https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/withdrawing-and-using-your-super/early-access-to-super/first-home-super-saver-scheme/about-fhss-release-amounts · .../about-your-contributions · https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/how-to-save-more-in-your-super/government-super-contributions/low-income-super-tax-offset

**Co-contribution taper:** 3.333 cents per dollar above the lower threshold, nil at the higher. Reconciles: $500 / $15,000 = 3.333% ✓.
**LISTO note worth surfacing:** $37,000 is now **below** the FY2026-27 annualised full-time minimum wage, so the eligible population is mostly part-time and casual. Also requires: not a temporary-resident visa holder at any time in the year (NZ citizens in Australia are eligible), and 10%+ of total income from business/employment.
**FHSS release note:** the $15,000/$50,000 figures are **contribution** limits. The maximum **release** is lower: 85% of the eligible concessional portion + 100% of the non-concessional portion + associated earnings. First-in-first-out across years.

### 7.3 Division 296 — **NEW REGIME, commences in the year you are estimating** `[2-SOURCE]`

- Applies **from 1 July 2026** to taxable super earnings attributable to the portion of total super balance above thresholds.
- **Large super balance threshold (LSBT): $3 million**, extra **15%**.
- **Very large super balance threshold (VLSBT): $10 million**, further extra **10%**.
- LSBT indexed to CPI in $150,000 increments; VLSBT in $500,000 increments.
- **For 2026-27 ONLY**, the test is TSB at the **END** of the income year. For later years it is TSB at either the start or the end.
- First assessments issue in the **second half of the 2027-28 income year**, so this affects FY2026-27 liability but not cash flow within it.
- Tax can generally be paid from the fund.
- Law: *Treasury Laws Amendment (Building a Stronger and Fairer Super System) Act 2026* and *Superannuation (Building a Stronger and Fairer Super System) Imposition Act 2026*.
- **Do not confuse with Division 293** (separate, $250,000 threshold, 15%).
- Source: https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions/division-296-tax/division-296-tax-on-large-super-balances

---

## 8. DOMAIN: BUSINESS

### 8.1 Instant asset write-off — see §2.1. **Do not ship without checking.**

Related and confirmed: **aggregated turnover cap under $10 million**, unchanged, `LEGISLATED` flat. Applied **per asset**, so multiple assets can each be written off. The historical $50m/$500m caps were COVID-era only and are long expired. Assets at or above the threshold are **not lost**: they go into the small business pool (15% first year, 30% thereafter), and pool balances under the threshold can be written off.

**Simplified depreciation 5-year re-entry lockout:** proposed to remain suspended to 30 June 2027, but that sits in the **same unpassed bill** as the $20,000 IAWO. Between 1 July 2026 and any Royal Assent, the current-law position is technically **unsuspended**. Confidence: medium.

### 8.2 GST

| Figure | FY2026-27 | Status |
|---|---|---|
| GST registration threshold, general | **$75,000** GST turnover | `LEGISLATED` flat, **never indexed**, unchanged since 1 July 2007 |
| GST registration threshold, not-for-profit | **$150,000** GST turnover | `LEGISLATED` flat |

Source: https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst
Notes: must register within 21 days of turnover reaching $75,000, or when starting a business you expect to reach it in year 1. Taxi/limousine/ride-sourcing must register **regardless of turnover**, as must anyone claiming fuel tax credits. The $150,000 figure also governs annual GST reporting eligibility for voluntarily-registered NFPs. Quarterly GST reporting is available where GST turnover is under $20 million.

### 8.3 Vehicles

| Figure | FY2026-27 | FY2025-26 | Status |
|---|---|---|---|
| Car limit for depreciation | **$69,883** | $69,674 | Indexed to motor-vehicle-CPI, changes yearly |
| Maximum GST credit on a car | **$6,353** | $6,334 | 1/11 of car limit. Reconciles exactly: 11 x 6,353 = 69,883 ✓ |
| LCT threshold, fuel-efficient | **$91,661** | not fetched | Indexed |
| LCT threshold, other vehicles | **$80,809** | not fetched | Indexed |

Source: https://www.ato.gov.au/businesses-and-organisations/small-business-newsroom/car-thresholds-from-1-july (published 9 June 2026, explicitly headed for 2026-27)

**Car limit scope:** applies where you first use or lease the vehicle in the 2026-27 income year. Applies to passenger vehicles (not motorcycles) designed to carry fewer than 9 passengers with a load under 1 tonne. Does **not** apply to vehicles modified for use by people with disability, or to genuine 1-tonne-plus utes and other non-passenger vehicles. **Cost above the limit can never be claimed under any depreciation rule.** No GST credit is ever available for luxury car tax paid, even on a business vehicle.
**Cross-domain:** the fuel-efficient LCT threshold ($91,661) is load-bearing for the **EV FBT exemption**, because an eligible electric car must never have been subject to LCT.

### 8.4 Fringe benefits tax, FBT year ending 31 March 2027

| Figure | Value | Status |
|---|---|---|
| FBT rate | **47%** | `LEGISLATED` flat. ATO verbatim: "A fringe benefits tax (FBT) rate of 47% applies across the 31 March 2023 to 31 March 2027 FBT years." |
| FBT year | **1 April 2026 to 31 March 2027** | Structural |
| Type 1 gross-up (GST-creditable) | **2.0802** | `LEGISLATED` flat |
| Type 2 gross-up (non-creditable) | **1.8868** | `LEGISLATED` flat. Also used for **reportable** fringe benefits regardless of type. |
| Reportable fringe benefits threshold | taxable value **over $2,000**; minimum grossed-up **$3,773** | `LEGISLATED` flat |
| **Record-keeping exemption threshold** | **$10,962** (was $10,664) | **INDEXED, CHANGED** |
| Car fringe benefit statutory formula rate | **20%** flat | `LEGISLATED` since 1 Apr 2014, regardless of distance |

Source: https://www.ato.gov.au/tax-rates-and-codes/fringe-benefits-tax-rates-and-thresholds (updated 20 May 2026)

**Do not conflate the FBT year with the income year.** The FBT year ending 31 March 2027 straddles income years FY2025-26 and FY2026-27. The ATO table stops at 31 March 2027, so the FBT year ending 31 March 2028 is not yet published. Instalments: 4 quarterly instalments required if prior-year FBT liability was $3,000 or more. Statutory formula exception: a pre-existing commitment entered into before 7:30pm AEST 10 May 2011 retains the old tiered rates.

### 8.5 Electric vehicles and FBT

**Exemption IN FORCE and unchanged for the FBT year ending 31 March 2027.** No FBT on private use of an eligible electric car meeting **all four**:
1. It is a zero or low emissions vehicle (**battery electric OR hydrogen fuel cell only**);
2. First held **and** used on or after 1 July 2022;
3. Used by a current employee or their associates;
4. **Luxury car tax has never been payable** on its importation or sale.

Vehicle must carry under 1 tonne and fewer than 9 passengers. **Motorcycles and scooters do not qualify even if electric.** Exempt associated car expenses: registration, insurance, repairs/maintenance, and fuel including electricity. **A home charging station is NOT an exempt car expense** (may instead be a property or expense payment fringe benefit). The benefit is **exempt but still reportable**. The LCT condition is tested at first retail sale and every subsequent sale, so second-hand buyers must check history against the $91,661 fuel-efficient threshold.
Source: https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax/types-of-fringe-benefits/fbt-on-cars-other-vehicles-parking-and-tolls/electric-cars-exemption (updated 1 April 2026)

**PHEVs are EXCLUDED.** From **1 April 2025** a plug-in hybrid is not a zero or low emissions vehicle under FBT law. **Common error: treating this as starting in 2026-27. It started 1 April 2025.** Transitional carve-out (the real trap): the exemption **can still apply** in the FBT year ending 31 March 2027 where there was a **binding financial commitment entered into before 1 April 2025**, the use was already exempt before that date, and the commitment is unbroken.

**Announced, NOT law:** Budget 2026-27 measure "Electric Car Discount, more sustainable fringe benefits tax treatment of electric cars", proposed start **1 April 2027**, which is the first day of the FBT year ending 31 March 2028. Legislative development listed as "TBD", no bill introduced. **Does not affect the FBT year ending 31 March 2027.** Source: https://www.ato.gov.au/about-ato/new-legislation/latest-news-on-tax-law-and-policy

### 8.6 Quarterly BAS due dates, FY2026-27 `[2-SOURCE]`

| Quarter | Self-lodger (standard) | Self-lodger ONLINE | Registered agent |
|---|---|---|---|
| Q1 Jul–Sep 2026 | Wed 28 Oct 2026 | Wed 11 Nov 2026 | Wed 25 Nov 2026 |
| Q2 Oct–Dec 2026 | **Sun 28 Feb 2027 → Mon 1 Mar 2027** | **Not applicable** | **Not applicable** (same date) |
| Q3 Jan–Mar 2027 | Wed 28 Apr 2027 | Wed 12 May 2027 | Wed 26 May 2027 |
| Q4 Apr–Jun 2027 | Wed 28 Jul 2027 | Wed 11 Aug 2027 | Wed 25 Aug 2027 |

Source: https://www.ato.gov.au/tax-and-super-professionals/for-tax-professionals/prepare-and-lodge/registered-agent-lodgment-program/due-dates-by-obligation-type/activity-statements (updated 1 July 2026)
Concession terms: https://www.ato.gov.au/online-services/businesses-and-organisations-online-services/lodgments-in-online-services-for-business/two-week-lodgment-concession-terms-and-conditions

**Q2 is the only weekend shift in FY2026-27.** 28 February 2027 falls on a **Sunday**, so the effective date is Monday 1 March 2027. Q2 gets **no** concession from either channel because the 28 February date already embeds a one-month extension; the ATO agent table literally reads "Not applicable". All other dates fall on Wednesdays with no public-holiday interaction (ANZAC Day 25 April 2027 is a Sunday, and any observed Monday holiday precedes the 28 April due date).

**The later dates are NOT automatic for everyone.** The 2-week self-lodger concession requires **receiving AND lodging online**, applies only to quarters with an original 28th-of-month due date, and **excludes**: monthly activity statements; monthly GST payers with quarterly PAYG instalments; quarterly PAYG instalments for consolidated head companies; large business clients on substituted accounting periods; and quarterly instalment **notices** (forms BAS R, S, T). "Large business client" means annual total income over $10m, GST turnover $20m+, or annual withholding over $1m. For agents, a client's **first** activity statement, or one whose predecessor was lodged on **paper**, gets the **earlier** date.
**Separate December concessions:** monthly GST reporters under $10m turnover lodging electronically get 21 February for the December monthly BAS; schools and associated bodies get 21 January.
**Caveat on Q4:** the ATO page carries "To be confirmed when the Lodgment program 2027-28 is developed", so the 25 August 2027 agent date is published but formally provisional.

---

## 9. DOMAIN: DEDUCTIONS AND FAMILY BENEFITS

### 9.1 Cents per kilometre — CHANGED `[2-SOURCE]`

**91 cents per kilometre**, up from 88c.

`LEGISLATED` via *Income Tax Assessment (Cents per Kilometre Deduction Rate for Car Expenses) Determination 2026* (**F2026L00785**), registered 23 June 2026, commences 1 July 2026, repealing the 2024 Determination. Section 6 verbatim: "For the purposes of subsection 28-25(1) of the Act, the rate of cents per kilometre for cars for the income year commencing on 1 July 2026 is 91 cents per kilometre."
Source: https://www.legislation.gov.au/F2026L00785/asmade/2026-06-23/text/original/pdf
Cross-confirmed: https://softwaredevelopers.ato.gov.au/CentsperKilometreDeductionRateforCarExpenses (published 30/06/2026, status Current)

> **FORWARD-YEAR COMPOSITION WARNING:** 91c = a **base rate of 89c** plus a **temporary one-off uplift of 2c that applies ONLY to 2026-27**. Future annual indexation is applied to the **89c base**, not to 91c. **Do not compound future indexation off 91c.**

**Maximum 5,000 business kilometres per car, per year.** `LEGISLATED` flat, not indexed, statutory cap in ITAA 1997 s 28-25(2). The annual determination sets only the rate, never the cap. **Maximum claim FY2026-27 = 5,000 x $0.91 = $4,550 per car** (was $4,400). The cap is **per car**, so two qualifying cars support up to 5,000km each.
Source: https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/income-and-deductions-for-business/deductions/deductions-for-motor-vehicle-expenses/cents-per-kilometre-method

The rate covers **all** running costs (registration, fuel, servicing, insurance) **and** depreciation. No separate claim for any of those.

### 9.2 Working from home, fixed rate method — UNCHANGED at 70c `[2-SOURCE]`

**70 cents per work hour.**

**Verified against the governing instrument, not the plain-English page.** PCG 2023/1 paragraph 26A, Table 1: 2022-23 = 67c; 2023-24 = 67c; **"From 1 July 2024" = 70c**. That row is **open-ended**, so it governs 2026-27 unless the PCG is amended. The 70c rate was inserted 16 April 2025 and there has been no later amendment.
Source: https://www.ato.gov.au/law/view/document?DocID=COG%2FPCG20231%2FNAT%2FATO%2F00001

**Why this looks ambiguous elsewhere:** the consumer-facing ATO page (updated 8 June 2026, i.e. before FY2026-27 began) lists only "2024-25 and 2025-26: use 70 cents per work hour" and does not yet name 2026-27. That is a page-not-yet-refreshed artefact, **not** evidence the rate lapsed. Re-check after the page refreshes for the 2027 return.

**Correction to a common misstatement of the history:** the rate was 67c for **both** 2022-23 and 2023-24, then revised **up** to 70c from 1 July 2024. It was **not** revised again for 2025-26 or 2026-27.

**What 70c covers (and therefore cannot be claimed separately):** energy (electricity and gas) for heating, cooling, lighting and running electronic items; home and mobile internet/data; mobile and home phone usage; stationery and computer consumables.
**Claimable separately on top:** decline in value of depreciating assets (computers, desks, chairs, bookshelves) and their repairs/maintenance; immediate deduction for items costing $300 or less used mainly for non-business income; and in limited dedicated-home-office cases, occupancy costs and cleaning.
**Record keeping:** a record of **total actual hours** worked from home for the whole income year is required. An estimate such as "about 25 hours a week" is **not acceptable** under PCG 2023/1.

### 9.3 Commonwealth Rent Assistance — CHANGED `[2-SOURCE]`

**Maximum fortnightly rates, current at 4 August 2026:**

| Family situation | Max/ft | Rent threshold/ft | Rent ceiling/ft |
|---|---|---|---|
| Single, no children | **$219.40** | $154.80 | $447.34 |
| Single, no children, **sharer** | **$146.27** | $154.80 | $349.83 |
| Couple, combined, no children | **$206.80** | $250.80 | $526.54 |
| One of a couple separated (illness / respite / prison), no children | **$219.40** | $154.80 | $447.34 |
| One of a couple temporarily separated, no children | **$206.80** | $154.80 | $430.54 |
| Single, 1–2 children | **$257.88** | $203.28 | $547.12 |
| Couple combined, 1–2 children | **$257.88** | $300.58 | $644.42 |
| Single, 3+ children | **$291.48** | $203.28 | $591.92 |
| Couple combined, 3+ children | **$291.48** | $300.58 | $689.22 |

Source: https://www.servicesaustralia.gov.au/how-much-rent-assistance-you-can-get?context=22206 (retrieved live 4 Aug 2026), cross-confirmed against Services Australia guide **co029-2607.pdf**, header "1 July to 19 September 2026".

**Calculation rule:** 75c per $1 of rent above the threshold, capped at the maximum. **All nine rows reconcile exactly:** e.g. single no children (447.34 − 154.80) x 0.75 = $219.405 → $219.40 ✓; couple (526.54 − 250.80) x 0.75 = $206.805 → $206.80 ✓; 1–2 children (547.12 − 203.28) x 0.75 = $257.88 ✓; 3+ children (591.92 − 203.28) x 0.75 = $291.48 ✓.

> **TIMING TRAP THE TOOL MUST HANDLE.** Rent Assistance is indexed **twice yearly, 20 March and 20 September**, and is **not** financial-year aligned. The rates above took effect **20 March 2026**, i.e. during FY2025-26, and carry into FY2026-27 unchanged. **The next indexation is 20 SEPTEMBER 2026, which falls INSIDE FY2026-27 and will change these figures mid-year.** A FY2026-27 estimator needs **date-dependent** RA rates, not one annual figure.

**Structural note:** the maximum for 1–2 children and for 3+ children is **identical for singles and couples**. Only the threshold and ceiling differ, so couples need higher rent to reach the same maximum. Singles/couples rates are SSAct rates paid with an income support payment or ABSTUDY; the with-children rates are FAAct rates normally paid with FTB Part A, requiring receipt of **more than the base rate** of FTB Part A.

⚠ **Minor data-quality flag:** the FY2025-26 comparative for the *couple, 1–2 children* **threshold** came through garbled in the research pass. The FY2026-27 value ($300.58) is confirmed; treat that one prior-year comparative as unverified.

### 9.4 Family Tax Benefit Part A — CHANGED `[2-SOURCE]`

| Rate | Per fortnight | Per year (incl. supplement) |
|---|---|---|
| Max, child 0–12 | **$235.48** | $7,110.20 |
| Max, child 13–15 | **$306.46** | $8,960.75 |
| Max, child 16–19 (meeting study requirements) | **$306.46** | $8,960.75 |
| **Base rate**, all ages 0–19 | **$75.60** | $2,941.90 |
| **FTB A supplement** (end of year, per child) | — | **up to $970.90** |
| Approved care organisation rate | $75.60 | $1,971.00 |

Source: https://www.servicesaustralia.gov.au/family-tax-benefit-part-payment-rates?context=22151 (updated 1 July 2026), cross-confirmed co029-2607.pdf. **Indexed annually on 1 July, so it changes every year.**

**The supplement page uniquely states both years explicitly**, which is strong direct confirmation of the year boundary: "For the 2025-26 financial year, it's a payment of up to $938.05 for each eligible child. For the 2026-27 financial year, it's a payment of up to $970.90 for each eligible child."

### 9.5 Family Tax Benefit Part B — CHANGED `[2-SOURCE]`

| Rate | Per fortnight | Per year (incl. supplement) |
|---|---|---|
| Max, youngest child 0–4 | **$200.34** | $5,701.30 |
| Max, youngest child 5–18 | **$139.86** | $4,124.50 |
| **FTB B supplement** (end of year, **per family**) | — | **up to $478.15** |

Source: https://www.servicesaustralia.gov.au/family-tax-benefit-part-b-payment-rates?context=22151 (updated 1 July 2026), cross-confirmed co029-2607.pdf. Indexed annually on 1 July.

**FTB B income test, FY2026-27:** higher earner nil-rate limit **$124,327** (was $120,007). Couple lower-earner limit **$35,661** when youngest is under 5 (was $34,438), **$27,777** when youngest is 5–18 (was $26,828).

**Traps:**
1. **Part B is paid PER FAMILY, not per child**, and is based on the age of the **youngest** child only. Part A is per child.
2. **Eligibility cliff:** for a child aged 13 up to the end of the calendar year they turn 18, Part B is payable **only** to a **single** parent, grandparent or great-grandparent. **Couple families lose Part B once the youngest child turns 13.**
3. Part B cannot be received during any period the taxpayer or partner gets Parental Leave Pay.
4. The **Part A supplement is per child**; the **Part B supplement is per family**.

### 9.6 FTB annual-figure arithmetic — do NOT multiply the fortnightly rate by 26

The published annual figures use **daily rate x 365**, not fortnightly x 26. All six reconcile exactly:

| Rate | fortnightly / 14 | x 365 | + supplement | Published |
|---|---|---|---|---|
| FTB A 0–12 | $16.82 | $6,139.30 | + $970.90 | **$7,110.20** ✓ |
| FTB A 13–19 | $21.89 | $7,989.85 | + $970.90 | **$8,960.75** ✓ |
| FTB A base | $5.40 | $1,971.00 | + $970.90 | **$2,941.90** ✓ |
| FTB B 0–4 | $14.31 | $5,223.15 | + $478.15 | **$5,701.30** ✓ |
| FTB B 5–18 | $9.99 | $3,646.35 | + $478.15 | **$4,124.50** ✓ |

`fortnightly x 26 + supplement` gives $7,093.38 for FTB A 0–12, which is **$16.82 short**. The annual figure **includes** the supplement; the fortnightly figure **does not**. Do not add the supplement twice, and do not use 26 fortnights.

**Also note:** Services Australia explicitly warns the FTB A **base rate is not a minimum**. A family can receive less than the base rate due to the income test.

---

## 10. CROSS-DOMAIN TRAPS (read before writing any code)

1. **$1,000 NAMING COLLISION.** The **$1,000 Instant Tax Deduction** (personal standard deduction for work-related expenses, `LEGISLATED`, in force from 1 July 2026) is a **completely different measure** from the **$1,000 instant asset write-off threshold** (the business depreciation default that applies because the $20,000 `LAPSED`). Conflating them produces badly wrong results. Different domains, different eligibility, same number, same year.

2. **Two different $-per-child increments.** Medicare levy low-income reduction: **+$4,338 / +$5,423, from the FIRST child**. MLS and PHI rebate: **+$1,500, only AFTER the first child**.

3. **Two different change dates for private health.** Income thresholds change **1 July**. Rebate percentages change **1 April**. FY2026-27 has two rebate-percentage periods and the second is unpublished.

4. **Three different indexation calendars.** Income year (1 Jul): most tax figures, FTB. FBT year (1 Apr): FBT figures. Half-yearly (20 Mar / 20 Sep): Rent Assistance. HELP debt indexation: 1 June.

5. **HELP top tier is not marginal.** Flat 10% of the whole repayment income above $186,051.

6. **Repayment income ≠ taxable income ≠ income for MLS purposes ≠ adjusted taxable income ≠ rebate income.** Five different bases are in play across this document. Do not reuse one input field for all of them.

7. **Super max contribution base is annual now, not quarterly.** And SG is due per payday, on "qualifying earnings", not per quarter on OTE.

8. **Transfer balance cap tests the PRIOR 30 June against the cap that applied THEN** ($2.0m for FY2026-27 contributions), not the current $2.1m.

9. **Two ATO pages carry known stale content.** The resident rates page (newest table 2025-26) and the HELP page's own Example 3 (cites the dead $179,286 boundary). Build from the Legal Database and the tax tables page instead.

10. **LITO does not reduce the Medicare levy.** Apply it to income tax only, after gross tax, floored at zero.

---

## 11. RECHECK CALENDAR

| Date | What |
|---|---|
| **13 Aug 2026** | Senate Economics Committee report on *Treasury Laws Amendment (Tax Reform No. 2) Bill 2026*. Determines the FY2026-27 instant asset write-off. |
| **20 Sep 2026** | Rent Assistance re-indexation, mid-FY. All RA figures change. |
| **Mar 2027** | ATO publishes PHI rebate percentages for 1 Apr 2027 to 30 Jun 2027. |
| **1 Apr 2027** | New PHI rebate period begins. New FBT year (ending 31 Mar 2028) figures needed. |
| **~May 2027** | Expected retrospective amending Act uplifting all eight Medicare levy low-income thresholds. |
| **1 Jun 2027** | HELP debt indexation rate for 2027 published. Do not assume 2.8%. |
| **1 Jul 2027** | Lowest marginal rate falls to 14%; WATO ($250) commences; all indexed thresholds move; EV FBT treatment measure proposed to start. |
| **Anytime** | Re-check the ATO resident rates page; when it finally publishes a 2026-27 table it will directly confirm the $4,020 / $31,020 / $51,370 base amounts. |