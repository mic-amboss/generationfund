---
name: value-company
description: Build a bespoke valuation model for a generational-compounder candidate and triangulate the expected 10-year IRR via three lenses — bottom-up driver model, destination analysis (Sleep style), and IRR decomposition (Damodaran/Bogle). Use this skill after a deep dive (and ideally a thesis) exists. The output is an Excel workbook plus `valuation.md` with a triangulated IRR and a Reasonable-price verdict (Underwrites @ 15%+ / Sub-target / Pass on price). Models are built bespoke per business-model archetype (vertical SaaS, serial acquirer, network, asset-heavy compounder, insurance/float, branded consumer, platform, media/content, pharma, razor-and-blade), not from a generic template.
allowed_tools: Read, Write, Edit, Glob, Grep, Bash, Agent
---

# value-company

Produce a triangulated 10-year IRR estimate for a candidate company and write a verdict against the Generation Fund's 15%+ price hurdle.

This skill is **adjudicative on price**, sibling to `evaluate-company` (positive-checklist verdict) and `red-team-company` (negative-checklist verdict). Together they answer the four-criteria question. This skill answers criterion 4: **is the price reasonable?**

## The IRR-first principle

We do not output a "fair value" or "intrinsic value per share." Forward DCFs that pinpoint a fair value are false precision for 10–20-year compounders, where 60–70% of the value lives in years 6+ and is highly sensitive to terminal assumptions.

Instead we output an **expected 10-year IRR** and judge it against the 15% hurdle. Three independent lenses must converge on the IRR for the verdict to be robust:

- **Lens 1 — Bottom-up driver model** (primary). Model the actual unit economics of the business for 10 years, apply a pragmatic exit multiple, solve for IRR.
- **Lens 2 — Destination analysis** (Sleep-style). Imagine the 20-year end-state. TAM × share × margin × multiple → end-state market cap → annualize back to IRR.
- **Lens 3 — IRR decomposition** (Damodaran/Bogle). FCF yield + growth + multiple change ± dilution. A 5-minute sanity check.

Convergent IRRs across the three lenses → conviction. Divergence → research question. The gap *is* the analysis.

## Prerequisites

- Deep dive at `src/research/companies/<slug>/output/deep-dive.md` (via `analyze-company`).
- Recommended: thesis at `…/output/thesis.md` (via `evaluate-company`) — its bull case sets the trajectory the model must underwrite.
- Optional: pre-mortem at `…/output/premortem.md` (via `red-team-company`) — its kill list seeds the bear scenario probabilities.
- Sources at `src/research/companies/<slug>/sources/` for citing every blue-input cell.
- The `xlsx` skill (already installed at `.agents/skills/xlsx/`) — this skill **defers to xlsx** for color coding, formula discipline, source citations in cell comments, number formatting, and `recalc.py`. Do not re-implement those conventions here.

If the deep dive is missing, tell the user and offer to run `analyze-company` first.

## Workflow

### Step 1 — Load context

Read the deep dive in full. If `thesis.md` and/or `premortem.md` exist, read them too. Note:

- The bull thesis trajectory (revenue, margins, ROIC) — the model must show what underwriting that trajectory at the current price implies for IRR.
- The bear/kill items from the pre-mortem — these set the bear-case scenario.
- The historical data needed for the Inputs tab (5y revenue, EBIT, FCF, ROIC, reinvestment, share count, debt). If any of these are missing from the deep dive, pull from `sources/ir/` directly.

### Step 2 — Pick the archetype

Match the business to one of the ten archetypes below. The archetype determines the **Lens 1 driver tree** — what we forecast and how. If the company spans two archetypes (e.g., a SaaS company that's also a serial acquirer like Topicus), pick the dominant one for Lens 1 and note the secondary in `valuation.md`. For true mixed models, build a hybrid Lens 1 with both driver trees.

State the chosen archetype to the user and confirm before building. The choice frames everything downstream.

### Step 3 — Gather market data

- Current share price (cite source + date)
- Diluted shares outstanding
- Net debt (total debt − cash & equivalents − marketable securities)
- Required return / hurdle rate: **default 15%** (Generation Fund target). Use this as the discount rate for Lens 1 and 2 unless there is a specific reason to deviate (e.g., explicit risk premium for a turnaround). Document the choice.
- Current trading multiple (P/E, EV/EBITDA, EV/FCF — pick what's relevant to the archetype) for Lens 3 entry-multiple anchor.

### Step 4 — Build Lens 1 (bottom-up driver model)

Bespoke 10-year forecast using the archetype's driver tree (see archetype recipes below).

**Verification gates** — show the user and confirm before continuing:
1. Inputs block (historical 5y + current market data) — confirm before projecting
2. Driver assumptions for the projection period — confirm before computing FCF
3. Year-10 FCF (or relevant terminal metric) and chosen exit multiple — confirm before solving for IRR
4. Computed IRR vs. current price

**Pragmatic terminal**: pick an exit multiple defensible vs. peers and the company's compounding profile *at year 10* (not today). If exit multiple > entry multiple, you are betting on multiple expansion — name it explicitly. For most generational compounders the exit multiple should be **below or equal to the entry multiple** (multiple compression is the conservative default) unless there's a structural reason (e.g., a SaaS still scaling profitability at year 10).

**IRR formula** (10-year hold, no dividend reinvestment):
```
IRR = ((Year10_Equity_Value + Σ_t Distribution_t × (1+r)^(10-t)) / Current_Price)^(1/10) - 1
```
For non-payers (most compounders): `IRR = (Year10_Equity_Value / Current_Price)^(1/10) - 1`.

### Step 5 — Build Lens 2 (destination analysis)

20-year end-state imagination. For 2046 (or current year + 20):

- **TAM in 20 years** — start with current TAM, apply a defensible TAM growth rate. Cite the source for current TAM.
- **Plausible market share at maturity** — anchor on peer analogs (what did Walmart hit, what did Costco hit, what did Visa hit). State the analog explicitly.
- **Steady-state operating margin** — where does this business settle vs. mature peers?
- **Terminal multiple at maturity** — what multiple does a mature, slower-growing version of this business deserve?
- **Net dilution / buyback rate** — apply over the 20 years.

```
End-state market cap = TAM_2046 × share × revenue_to_FCF_conversion × terminal_multiple
End-state equity per share = End-state market cap / (current shares × (1 + net_dilution_rate)^20)
IRR_lens2 = (End-state equity per share / current price)^(1/20) - 1
```

Lens 2 is most useful when the end-state is *thinkable*. For some businesses (early-stage platforms, optionality plays) the end-state is genuinely speculative and Lens 2 should be flagged as low-confidence.

### Step 6 — Build Lens 3 (IRR decomposition)

Five-minute sanity check. Decompose expected IRR into its sources:

```
IRR ≈ FCF_yield_today + FCF_growth_rate + (Exit_multiple / Entry_multiple)^(1/n) - 1 - net_dilution_rate
```

Or for earnings-anchored businesses:
```
IRR ≈ E/P + EPS_growth + (Exit_PE / Entry_PE)^(1/n) - 1 + dividend_yield - dilution_rate
```

The point is forced explicitness. **If multiple expansion contributes >300bps to IRR, the thesis is partly a re-rating bet.** That is disqualifying for a compounder thesis — flag it.

### Step 7 — Convergence panel

Pull the three IRRs into the Summary tab:

| Lens | IRR | Confidence |
|---|---|---|
| 1. Driver model | x.x% | high/med/low |
| 2. Destination | x.x% | high/med/low |
| 3. Decomposition | x.x% | high/med/low |

**Verdict logic:**
- All three ≥15% with high/med confidence → **Underwrites @ 15%+**
- Lenses cluster 12–15% → **Sub-target** (watchlist; re-evaluate at lower price)
- Any lens <10% with the others not strongly supportive → **Pass on price**
- Lenses diverge by >500bps → **Research gap** — name it; no verdict yet

### Step 8 — Sensitivity

For Lens 1, identify the **2–3 assumptions whose ±1σ move shifts IRR by ≥300bps**. These are the "swing variables" — what the thesis actually hinges on. Build a small sensitivity block (per `xlsx` skill conventions: odd dimensions, base centered, fully formula-populated) on each assumption.

This is far more useful than WACC sensitivity (which is sideshow noise for compounders).

### Step 9 — Write `valuation.md`

Save to `src/research/companies/<slug>/output/valuation.md` using the template at `.claude/skills/value-company/TEMPLATE.md`. Save the workbook to `…/output/valuation.xlsx`.

Writing guidance:
- Open with executive verdict: triangulated IRR + bucket + the swing variable
- State the archetype and why
- Show all three lens IRRs with key assumptions
- Name where they converge and where they don't
- Sensitivity: the 2–3 swing variables, each with the ±300bps move

### Step 10 — Self-review

Before presenting:
- [ ] Every blue-input cell in the workbook has a source comment per `xlsx` conventions
- [ ] `recalc.py` reports zero formula errors
- [ ] Lens 1 driver tree matches the archetype, not a generic DCF
- [ ] Exit multiple ≤ entry multiple OR the multiple-expansion bet is named
- [ ] Lens 3 decomposition does NOT have >300bps from multiple expansion (or, if it does, it is flagged as a re-rating bet)
- [ ] Verdict matches the lenses (no "Lens 1 says 11% but I rounded up to Underwrites")
- [ ] Sensitivity identifies the actual swing variables, not WACC noise

Then present a one-paragraph summary (triangulated IRR + verdict + biggest swing variable) and link to the file.

---

## Business-model archetypes

Pick one. Each archetype defines the Lens 1 driver tree.

### 1. Vertical SaaS

> *Examples: Veeva, Tyler Technologies, ServiceNow, Workday, etc.*

**Driver tree:**
```
Customers_t = Customers_(t-1) × (1 - gross_churn) + new_logos_t
ARPU_t = ARPU_(t-1) × (1 + price_increase + net_expansion_from_upsell)
Revenue_t = Customers_t × ARPU_t
Gross_profit = Revenue × gross_margin (mature SaaS: 75–85%)
S&M = function of new_logo_target × CAC; flag if LTV/CAC < 3 or payback > 24 months
R&D = % of revenue (declines as company matures)
G&A = % of revenue (leverages strongly with scale)
EBIT = Gross_profit - S&M - R&D - G&A
FCF ≈ EBIT × (1 - tax) + D&A - CapEx (light) - SBC adjustment (critical for SaaS)
```

**Critical**: SBC is real cost. Subtract it from FCF or you're flattering the model. Net dilution from SBC must show up in Lens 3.

**Exit multiple**: EV/FCF or EV/ARR. Mature SaaS at year 10 → 5–8× EV/sales or 20–30× FCF, depending on growth profile.

### 2. Serial acquirer

> *Examples: Constellation Software, Topicus, Lifco, Roper, etc.*

**Driver tree:**
```
Organic growth: typically 0–5%, anchored to historical
Reinvestment growth: M&A_spend × (1 / multiple_paid) × organic_growth_at_acquired_co
Total growth = organic + reinvestment growth
M&A spend funded by: FCF + selective debt
```

**Critical inputs:**
- Historical reinvestment rate (M&A capex / FCF, multi-year average)
- Multiple paid on M&A (e.g., CSU pays ~1× revenue / ~5–8× EBITDA)
- ROIIC (return on incremental invested capital) — the structural anchor; cite from filings
- Addressable acquisition universe (years of runway at current pace)

**Failure mode**: assuming reinvestment continues forever. Model an explicit decay or runway exhaustion in years 7–10.

**Exit multiple**: EV/FCF on consolidated FCF. Compounders earn premium multiples at year 10 *only if* runway is still visible. If not, model multiple compression.

### 3. Razor-and-blade / consumables

> *Examples: ResMed, Stryker (implantables), Illumina, Coca-Cola (concentrate), Hershey.*

**Driver tree:**
```
Install_base_t = Install_base_(t-1) × (1 - replacement_rate) + new_units_t
Consumables_revenue = Install_base × consumption_per_unit × price
Hardware/razor revenue = new_units × ASP
Total_revenue = Consumables + Hardware
FCF margin: typically high; follow historical
```

**Critical**: track install base growth and replacement cycle separately. Pricing power on consumables is the moat.

**Exit multiple**: EV/EBIT or P/E. Stable cash gen → 18–25× P/E typical.

### 4. Network / marketplace

> *Examples: Visa, Mastercard, Airbnb, eBay, MercadoLibre, Booking.*

**Driver tree:**
```
GMV_t = Users_t × frequency × AOV
Revenue_t = GMV × take_rate
Take_rate trajectory: anchor on history; flag if rising (signals pricing power) or falling (signals competition)
Operating leverage: huge; OpEx scales sub-linearly with GMV
EBIT_margin trajectory: model expansion path explicitly
FCF: high conversion; few working-capital surprises
```

**Critical**: distinguish two-sided network effects (Visa, Airbnb) from aggregator dynamics (Booking). The former have stronger moats.

**Exit multiple**: EV/EBIT or P/E. Networks compound with scale → 20–30× P/E sustainable.

### 5. Asset-heavy compounder (rail / pipeline / utility / storage)

> *Examples: Union Pacific, Canadian National, Enbridge, Brookfield Infrastructure.*

**Driver tree:**
```
Invested_capital_t = Invested_capital_(t-1) + reinvestment_t - depreciation
ROIC: stable, regulated or contracted
EBIT = Invested_capital × ROIC
FCF = EBIT × (1-tax) + D&A - CapEx
Reinvestment runway: function of asset class growth (rail volumes, pipeline throughput, etc.)
```

**Critical**: reinvestment rate × ROIIC = growth. ROIIC for asset-heavy is often 8–12% — beware "compounder" narratives where the math doesn't math.

**Exit multiple**: EV/EBITDA. Mature at 10–14×.

### 6. Insurance / float

> *Examples: Berkshire (insurance), Markel, Fairfax, Progressive.*

**Driver tree:**
```
Float_t = Float_(t-1) × (1 + premium_growth) + reserve_releases
Investment_income = Float × yield (split between fixed-income and equity portions)
Underwriting_profit = Premiums × (1 - combined_ratio) — TARGET: combined ratio < 100% (cost of float < 0)
BVPS_growth = (Net_income / Equity) × retention rate
```

**Critical**: underwriting discipline (combined ratio history) is the moat. Float without underwriting discipline is a leveraged bond fund.

**Exit multiple**: P/B, anchored to ROE. ROE > cost of equity → P/B > 1; the premium is a function of (ROE − cost of equity) / (cost of equity − growth).

### 7. Branded consumer / pricing power

> *Examples: Hermès, LVMH, Constellation Brands, Costco (membership/private label), See's Candies.*

**Driver tree:**
```
Volume_growth: low single digits (units / sq ft / stores)
Price_growth: real pricing + inflation pass-through
Mix_shift: premiumization tailwind
Revenue_growth = (1 + volume) × (1 + price) × (1 + mix) - 1
Gross_margin: stable / expanding (pricing power flows through)
EBIT margin: leverages with scale
```

**Critical**: pricing power must show in historical real price increases. If price growth = inflation, no pricing power — likely commodity disguised.

**Exit multiple**: P/E. Premium consumer → 25–35× P/E sustainable for the very best (Hermès); branded at 18–22×.

### 8. Platform (exchanges, payment networks, app stores)

> *Examples: ICE, CME, Nasdaq, Visa/Mastercard (also network), Apple App Store, Adyen.*

**Driver tree:**
```
Volume_t = function of underlying activity (trades, transactions, app downloads)
Take_rate / fee_per_transaction: stable or declining (regulatory/competitive pressure)
Revenue = Volume × take_rate
Operating leverage: extreme; near-zero variable cost
Incremental margin: 70–90%
```

**Critical**: regulatory exposure on take rate (Apple, Visa). Model a stress scenario where take rate compresses 100–300bps — see what happens to IRR.

**Exit multiple**: EV/EBIT 20–28×. Platforms with regulatory overhang trade at discount to pure networks.

### 9. Media / content (subscription, ad-supported, IP licensing)

> *Examples: Spotify (subscription), Netflix (subscription + content), Disney (IP), Universal Music (publishing/royalties).*

**Driver tree (subscription):**
```
Subs_t = Subs_(t-1) × (1 - churn) + gross_adds_t
ARPU_t = ARPU_(t-1) × (1 + price_increase) — flag history of pricing
Revenue = Subs × ARPU × 12
Content cost: amortized; model as % of revenue (Netflix-style)
Marketing: scales with gross adds
```

**Driver tree (IP licensing / royalties):**
```
Catalog_revenue: stable royalty base, modest growth (streaming tailwind)
New_release_revenue: hit-driven, harder to forecast — model conservatively
Take rates by service (Spotify, YouTube, etc.) — track changes
```

**Critical**: subscription models depend on pricing power AND content investment efficiency. Royalty/IP businesses are the cleaner archetype — owned IP with structural tailwind from streaming has been a great compounder template (UMG).

**Exit multiple**: P/E or EV/EBIT for subscription (15–22×); royalty businesses often deserve premium (22–28×) due to capital-light reinvestment.

### 10. Pharma / biotech

> *Examples: Novo Nordisk, Eli Lilly, Vertex, Regeneron.*

**Driver tree:**
```
On-market revenue:
  For each drug: peak sales × patent life curve - LOE cliff (typically 70–90% revenue loss in 12 months)
  Sum across portfolio
Pipeline NPV:
  For each Phase 2/3 candidate: peak sales × probability of approval × discount factor
  Risk-adjust by phase (Ph3 ~50%, Ph2 ~25%, Ph1 ~10%)
Operating leverage: high R&D, gross margins 80%+
```

**Critical**: LOE (loss of exclusivity) cliffs are non-negotiable; model them year-by-year. Pharma "compounders" with a single dominant drug facing LOE in 5–7 years are not actually compounders.

**Exit multiple**: P/E 15–22× for diversified pharma; specialty/biotech can deserve 20–30× if pipeline is strong.

---

## Workbook structure

Defer to the `xlsx` skill for color coding, formatting, formula discipline, source-cited cell comments, and `recalc.py`. The skill-specific structure is:

**Five tabs:**

| Tab | Purpose |
|---|---|
| `Inputs` | Market data (price, shares, debt), 5y historical financials. All blue-input + sourced. |
| `Lens1-Driver` | Bespoke 10-year forecast per archetype. The driver tree IS the tab. |
| `Lens2-Destination` | 20-year end-state IRR (TAM × share × margin × multiple). |
| `Lens3-Decomp` | Five-line IRR decomposition. |
| `Summary` | Convergence panel + sensitivity + verdict. |

**Required-return cell** (default 15%) is a single named cell on `Inputs` referenced by both Lens 1 (as discount rate for any cashflow PVs) and Lens 2 (for back-solving end-state implied IRR vs. hurdle). Centralizing this ensures one number to override.

**File**: `src/research/companies/<slug>/output/valuation.xlsx`

After saving:
```bash
python /Users/mic/projects/generationfund/.agents/skills/xlsx/scripts/recalc.py <path-to-valuation.xlsx>
```

Fix any errors until status is `success` per `xlsx` skill.

## Re-evaluation cadence

Re-run this skill on a holding when:
- Price moves materially (>20% in either direction)
- A driver-tree input changes (e.g., a serial acquirer's multiple paid drifts up; a SaaS company's net retention drops below 110%)
- Quarterly review alongside `evaluate-company`

Save the new workbook as `valuation-YYYY-QN.xlsx` to preserve history. The `valuation.md` should diff vs. prior — what changed, what didn't, and whether the verdict moved.

---

*This skill adjudicates only the price criterion. A "Underwrites @ 15%+" verdict here is necessary but not sufficient — the four-criteria verdict requires `evaluate-company` (positive checklist) and `red-team-company` (kill list) to also clear.*
