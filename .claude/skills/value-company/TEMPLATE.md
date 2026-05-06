---
tags:
  - valuation
  - company/[slug]
created: [YYYY-MM-DD]
updated: [YYYY-MM-DD]
ticker: [TICKER]
archetype: [vertical-saas / serial-acquirer / razor-and-blade / network / asset-heavy / insurance-float / branded-consumer / platform / media-content / pharma]
required_return: 15%
triangulated_irr: [X.X%]
verdict: [Underwrites @ 15%+ / Sub-target / Pass on price / Research gap]
workbook: ../output/valuation.xlsx
---

# [Company Name] — Valuation

## Executive verdict

One paragraph. Triangulated 10-year IRR + bucket + the single biggest swing variable. The reader knows whether this clears the price hurdle in 30 seconds.

---

## Archetype and driver tree

**Archetype:** [name]

**Why this archetype:** 1–2 sentences linking the deep dive's business description to the chosen driver tree. If the company spans archetypes, name the secondary one and explain why the primary dominates.

**Lens 1 driver tree (key forecasted variables):**

- [variable 1 — what it is, how forecast]
- [variable 2 — …]
- [variable 3 — …]

---

## Lens 1 — Bottom-up driver model

**10-year forecast, exit-multiple terminal, IRR vs. current price.**

### Key assumptions

| Variable | Year 1 | Year 5 | Year 10 | Anchor |
|---|---|---|---|---|
| [primary growth driver] | | | | [historical / management / analog] |
| [margin or unit economic] | | | | |
| [reinvestment / capital intensity] | | | | |
| Exit multiple | n/a | n/a | [X×] | [vs. entry / vs. peer / vs. mature analog] |

### Terminal handling

What exit multiple is applied at year 10, and why. If exit > entry, name the multiple-expansion bet explicitly.

### Result

- Year-10 equity value per share: $[X]
- Cumulative distributions to year 10: $[X]
- **Lens 1 IRR: [X.X%]**
- Confidence: [high / med / low] — based on how much of the IRR depends on assumptions vs. observable history.

---

## Lens 2 — Destination analysis (20-year end-state)

**TAM × share × margin × multiple → end-state market cap → annualize back.**

| Component | Today | 2046 | Source / analog |
|---|---|---|---|
| TAM | $[X]bn | $[X]bn | [TAM growth rate × source] |
| Market share | [X%] | [X%] | [analog: e.g., "Costco 10% of US grocery"] |
| Revenue conversion (margin / take rate) | [X%] | [X%] | [mature peer] |
| Operating margin (steady state) | [X%] | [X%] | |
| Terminal multiple | [X×] | [X×] | [mature peer] |
| Net dilution / buyback rate (annual) | n/a | [±X%] | |

- End-state market cap: $[X]bn
- End-state per-share value: $[X]
- **Lens 2 IRR: [X.X%]**
- Confidence: [high / med / low] — flag low if the end-state is genuinely speculative (early-stage platforms, optionality plays).

---

## Lens 3 — IRR decomposition

**Sanity check: where does the IRR come from?**

| Component | Contribution to IRR |
|---|---|
| FCF yield (or earnings yield) at entry | [X.X%] |
| Forecasted growth in FCF (or EPS) | [X.X%] |
| Multiple change: (Exit / Entry)^(1/10) - 1 | [±X.X%] |
| Net dilution / buyback yield | [±X.X%] |
| **Total** | **[X.X%]** |

**Multiple-expansion check:** If multiple change contributes >+300bps, this is partly a re-rating bet — disqualifying for a compounder thesis. State the conclusion.

---

## Convergence panel

| Lens | IRR | Confidence |
|---|---|---|
| 1. Driver model | [X.X%] | [high / med / low] |
| 2. Destination | [X.X%] | [high / med / low] |
| 3. Decomposition | [X.X%] | [high / med / low] |

**Triangulated IRR estimate: [X.X%]** (weighted by confidence; default = simple average if all confidence is med+).

**Where the lenses converge:** [summary]

**Where they diverge (and what the gap means):** [summary — the gap is the research question]

---

## Sensitivity — the swing variables

The 2–3 assumptions whose ±1σ move shifts IRR by ≥300bps. These are what the thesis actually hinges on.

| Variable | Base | -1σ | +1σ | IRR @ -1σ | IRR @ +1σ |
|---|---|---|---|---|---|
| | | | | | |
| | | | | | |
| | | | | | |

WACC / discount-rate sensitivity is deliberately omitted — for compounders it's noise.

---

## Verdict

- **Bucket**: [Underwrites @ 15%+ / Sub-target / Pass on price / Research gap]
- **Triangulated IRR**: [X.X%]
- **Margin of safety**: [Triangulated IRR − 15%] = [X.X%]

### Triggers

- **Add at**: $[price] (implies triangulated IRR ≥ [X]%)
- **Trim at**: $[price] (implies triangulated IRR < [X]%)
- **Re-evaluate if**: [specific observable — e.g., "net retention drops below 110%" / "M&A multiple paid creeps above 1.5× revenue" / "TAM-share assumption needs updating after [event]"]

---

## Open questions

What couldn't be modelled with confidence and what additional research would close each gap. A model output that hides its assumptions hides its risk.

---

*This valuation answers only the price criterion. The four-criteria verdict requires `evaluate-company` (positive checklist → `thesis.md`) and `red-team-company` (kill list → `premortem.md`) to also clear. A "Underwrites @ 15%+" verdict here is necessary but not sufficient.*
