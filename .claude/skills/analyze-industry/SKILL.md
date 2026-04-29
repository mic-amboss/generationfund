---
name: analyze-industry
description: Synthesize collected research sources into a structured industry deep dive. Use this skill whenever the user asks to analyze an industry, profile a sector's economics, write up a market structure, or wants a holistic qualitative understanding of an industry as a hunting ground for quality compounders — even if they don't say "analyze" explicitly. Requires sources to already be collected via research-industry.
allowed_tools: Read, Write, Edit, Glob, Grep, Agent
---

# analyze-industry

Read all collected source material for an industry and synthesize it into a structured deep dive. The goal is qualitative understanding of the industry's history, value chain, business models, economics, competitive structure, and the pattern that produces (or fails to produce) compounders.

This is *not* a market forecast, TAM-sizing exercise, or stock-pick document. It is the structural diagnosis that frames *which* companies in the industry deserve a follow-on `research-company` workflow.

## Prerequisites

Source material must already exist in `src/research/industries/<industry-slug>/sources/` with a `sources.md` index (collected via the `research-industry` skill). If sources haven't been collected yet, tell the user and offer to run research first.

## Token Efficiency

Context budget is the binding constraint. Be deliberate:
- **Less is more** — a focused read of the right 5 papers beats skimming 50.
- **Curate, don't dump** — pick the highest-signal sources for each agent, don't pass everything.
- **Agents summarize, main context synthesizes** — agents return concise structured summaries with `[filename, p. X]` citations.
- **Frameworks compress signal** — Mauboussin's Base Rate Book and Helmer's 7 Powers can replace dozens of unstructured opinion pieces.

## Workflow

### Step 1 — Survey and curate sources

Read `src/research/industries/<industry-slug>/sources/sources.md` to understand what's available. Then **curate** which sources go to each agent — don't pass everything.

**Source selection rules:**
- **Quality-investor letters and Mauboussin/Helmer/Dorsey frameworks stay in main context** — these are compact and high-signal, do not delegate.
- **Sell-side primers and consulting deep-dives are agent-extracted** — these are long, structurally dense, and contain industry-specific accounting / KPI material that needs distillation.
- **VC market maps are agent-extracted** for the visual landscape data; the thesis text stays in main context.
- **Leading-player annual reports are agent-extracted** for cross-comparison numbers (margins, ROIC, capital allocation).

### Step 2 — Extract from heavy documents via sub-agents

Spawn three sub-agents in parallel using the `general-purpose` agent type. Each agent handles a distinct, curated set of sources — no overlap.

| Agent | Sources to pass | What to extract |
|-------|-----------------|-----------------|
| **Primer extractor** | 1-3 sell-side primers + 1-2 consulting deep-dives | Value chain, profit pools, sector accounting peculiarities, structural cycle history, sector-specific KPI cheat sheet |
| **VC-landscape extractor** | 2-4 VC market maps + thematic essays | Player landscape (logos by category), maturity curve, thematic investment thesis, transformative pressures |
| **Cross-comparison extractor** | Annual reports of top 3-5 incumbents | Side-by-side margins, ROIC, growth, capital allocation breakdown, organic vs. inorganic growth, balance sheet posture, *and* explicit shareholder-letter quotes that reveal industry-specific operating philosophy |

When spawning each agent, include the **full file paths** of only the curated sources in the prompt, plus the specific extraction questions above.

### Step 3 — Read frameworks and quality-investor letters in main context

In the main context, read firsthand:

- **All quality-investor letters** discussing this industry — the most valuable signal. Look for *why* they argue an industry produces (or fails to produce) compounders. Examples: Buffett on airlines, Sleep on Costco/Amazon, Akre on Mastercard/Moody's, Smith on consumer staples, Poppe on HVAC.
- **Mauboussin's papers relevant to this industry** — typically Measuring the Moat (industry section), Base Rate Book (the relevant size-bucket distribution table), Stock Market Concentration if available.
- **Damodaran sector data** — industry-level ROIC, WACC, margins, capex/sales, EV/EBIT.
- **The headline VC market map(s)** — visual structure + thesis.

After reading, take inventory of which **structural diagnostic frameworks** apply to this industry and what evidence supports each verdict.

### Step 4 — Run the diagnostic frameworks

Apply each framework explicitly. The deep-dive must show the work, not just the conclusion.

| Framework | Source | Industry-level question to answer |
|---|---|---|
| **Five Forces** | Porter | Strength of: rivalry, new entrants, substitutes, supplier power, buyer power |
| **BCG Advantage Matrix** | BCG | Volume / Specialization / Fragmented / Stalemate quadrant |
| **Buffett binary** | Berkshire letters | Capital intensity (heavy/moderate/light), pricing power (weak/moderate/strong), commodity nature (high/moderate/low) — verdict: pursue/avoid/selective |
| **Akre's reinvestment moat** | Akre framework | Is there room to redeploy capital at high rates of return? For how long? |
| **Sleep's Scale Economies Shared** | Nomad letters | Does the dominant model share scale with customers (self-reinforcing flywheel) or extract from them? |
| **Smith's exclusion filter** | Fundsmith | Structurally cyclical / capital-heavy / levered by default? If yes to multiple, raise the bar. |
| **Mauboussin's market-share stability** | Measuring the Moat | 5-year average absolute change in market share — under 2% suggests structural stability |
| **Helmer's 7 Powers (industry-level)** | 7 Powers | Which of the 7 powers does the industry's structure *permit* and which does it *foreclose*? |
| **Dorsey's 4 moat sources** | Five Rules | Are intangible assets / switching costs / network effects / cost advantages structurally available? |
| **Christensen disruption** | Innovator's Dilemma | Who is the low-end / new-market attacker? What is their improvement trajectory? |
| **NZS Resilience/Optionality/Non-Zero-Sum** | NZS Capital | Score top players on each dimension |

### Step 5 — Write the deep dive

Read the template from `.claude/skills/analyze-industry/TEMPLATE.md` and synthesize all extracted information. Save to:

```
src/research/industries/<industry-slug>/output/industry-deep-dive.md
```

Writing guidance:
- Fill in the YAML frontmatter: `tags` always include `industry-deep-dive` and `industry/<slug>`; add `compounder-verdict/<verdict>` based on diagnosis (factory / selective / mostly-traps / avoid).
- Write with conviction. State what the evidence shows. Don't hedge everything with "appears to" and "seems to."
- Use specific numbers, dates, and names — vague summaries are useless.
- Include direct quotes from quality-investor letters where they reveal industry diagnostic instinct.
- The **THESIS** must be one sentence, falsifiable, and stated up front.
- The **ECONOMIC FINGERPRINT** ladder (Good/Better/Best per metric) and the **PROFIT POOL DECOMPOSITION** are the most useful quantitative artifacts — make them concrete.
- The **LEADING PLAYERS** section is the bridge to the company-research workflow — rank top 5-10 with explicit rationale, structural position, and the operator traits the winner will have.
- The **IDIOSYNCRATIC OBSERVATIONS** section is where the alpha sits — the things you'd only notice by reading the primary sources carefully.
- Cite sources inline using **relative** markdown links from the output file's location (e.g. `[Bessemer State of the Cloud 2024](../sources/vc-maps/bessemer-state-of-the-cloud-2024.md)`).

### Step 6 — Review and refine

Re-read the draft against this checklist before presenting to the user.

**The bar:** Could a quality-compounder investor read this document and immediately know which 5-10 public companies in the industry deserve a deep-dive, *and why*?

**Content checks:**
- [ ] One-sentence thesis is sharp, falsifiable, and stated up front
- [ ] Economic fingerprint (Good/Better/Best ladder) has actual numbers per metric
- [ ] Profit-pool decomposition shows where money actually accumulates
- [ ] At least 6 of the 11 diagnostic frameworks have been explicitly applied
- [ ] Leading-players ranking is specific, with the structural reason each ranks where it does
- [ ] Idiosyncratic observations are genuinely surprising, non-obvious
- [ ] Direct quotes from quality investors capture diagnostic instinct
- [ ] No generic filler ("the industry is large and growing," "many players compete")
- [ ] Falsifiers are concrete (specific events that would change the verdict)

**Source checks:**
- [ ] All quality-investor letters in the source directory have been read in main context
- [ ] All Mauboussin/Helmer/Damodaran framework papers relevant to the industry have been applied
- [ ] Cross-comparison of top 3-5 players includes side-by-side numbers
- [ ] Gaps are named in Open Questions
- [ ] Every claim cites its source via markdown link

**Not in scope (omit entirely):**
- Stock prices, valuation multiples, price targets
- 12-month earnings forecasts
- Macroeconomic forecasting beyond the 10-20 year structural horizon
- TAM-fluffing ("the $X trillion market by 2030")
- Investment recommendations on individual stocks (that comes from `analyze-company`)
