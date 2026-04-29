---
name: evaluate-company
description: Score a company against the Generation Fund investment philosophy and positive checklist. Use this skill after a deep dive exists (via analyze-company) to produce a structured evaluation, a bull thesis written in the language of the four criteria, full checklist scoring, and a verdict (Generational candidate / Quality but sub-generational / Watchlist / Pass). The evaluation can revisit primary source material when the deep dive is insufficient to score an item.
allowed_tools: Read, Write, Edit, Glob, Grep, Agent
---

# evaluate-company

Score a company against the Generation Fund investment philosophy ([`src/PHILOSOPHY.md`](../../../src/PHILOSOPHY.md)) and positive checklist ([`src/CHECKLIST.md`](../../../src/CHECKLIST.md)). Produce a structured evaluation that ends in one of four verdicts: **Generational candidate**, **Quality but sub-generational**, **Watchlist**, or **Pass**.

This is a *judgment* skill, not a *synthesis* skill. The deep dive (`analyze-company`) is descriptive; the evaluation is adjudicative. Keep them separate — do not let evaluation findings rewrite the deep dive.

## Prerequisites

- A deep dive must exist at `src/research/companies/<company-slug>/output/deep-dive.md` (via `analyze-company`).
- Source material must exist at `src/research/companies/<company-slug>/sources/` so primary-source verification is possible.
- `src/PHILOSOPHY.md` and `src/CHECKLIST.md` must exist (the constitution).

If the deep dive is missing, tell the user and offer to run `analyze-company` first.

## Token Efficiency

Same principle as `analyze-company`: context is the binding constraint.

- Read the deep dive once, in full
- Spot-check primary sources only when an item cannot be scored from the deep dive
- Spawn sub-agents only for **multi-document targeted verification**, never for general re-extraction
- Keep checklist citations short — quote the smallest sufficient evidence

## Workflow

### Step 1 — Load the constitution

Read both:
- `src/PHILOSOPHY.md` — criteria definitions, too-hard pile, portfolio construction
- `src/CHECKLIST.md` — positive checklist with [REQ] and [PREF] markers

These are non-negotiable. The criteria predate any specific company and do not bend to it.

### Step 2 — Load the deep dive

Read `src/research/companies/<company-slug>/output/deep-dive.md` in full. Take note of which sections of the deep dive map to which checklist items, and where the deep dive is thin or silent.

### Step 3 — Score the checklist

For each item in `CHECKLIST.md`, assign one of:

- **✅ Pass** — evidence in the deep dive clearly clears the item
- **❌ Fail** — evidence in the deep dive clearly fails the item
- **❓ Insufficient evidence** — the deep dive does not contain what's needed to judge

Cite specific evidence for every Pass and Fail. A score without a citation is an assertion, not a judgment.

### Step 4 — Resolve gaps via primary sources

For every **❓ Insufficient evidence** item, attempt to resolve it from the primary sources in `src/research/companies/<company-slug>/sources/`. Two paths:

**A. Direct read** — fastest path when the answer is in a specific document.
- Read the relevant file (use the `pages` parameter for PDFs)
- Quote the specific evidence in your scoring

**B. Sub-agent** — when verification spans multiple documents or requires structured extraction.
- Available agents (in `.claude/agents/`): `annual-report-reader`, `proxy-reader`, `transcript-reader`, `news-reader`
- Pass a **targeted, narrow** prompt — not a comprehensive extraction
- Example: *"Search the 2024 and 2025 annual reports for any disclosure of ROIC on incremental capital, capex IRR, or unit-economic returns on M&A. Quote exact numbers with [filename, p. X] citations. Do not summarize anything else."*

After resolving, update the score to ✅ or ❌. If the gap genuinely cannot be closed from available sources, leave as ❓ and list it in **Open evidence gaps** — unresolved ❓ on a [REQ] item counts as a failure for verdict purposes.

### Step 5 — Write the bull thesis in the language of the four criteria

In *3–5 paragraphs*, articulate the bull thesis explicitly mapped to the four criteria:

1. Why this is a **Great Business** — moats, ROIC, capital intensity, pricing power, balance-sheet quality
2. Why the **owner-operator(s)** are principled and idiosyncratic — specific decisions, capital allocation track record, communication style, partnership posture
3. Why the **runway** is long — TAM and share dynamics, reinvestment engine, structural tailwind, optionality
4. Why the **price** is reasonable — base / bull / bear forward IRR with shown work

This is itself a test. **If the bull thesis can only be expressed by stretching outside these four criteria, that is a finding** — note it explicitly and downgrade the verdict accordingly.

### Step 6 — Bar test against the league

Position the company against the philosophy's stated goal: *generational compounder in the league of CSU / Copart / Amazon / Costco / Hermès, compounding 15+% over 10–20 years.*

Buckets:

- **Generational candidate** — clears all [REQ], most [PREF], plausible 15+% IRR base case
- **Quality but sub-generational** — high quality, but moat depth, runway, or governance falls short of CSU-league (e.g., Brown & Brown is great, not generational)
- **Watchlist** — clears [REQ] but at wrong price, or several [PREF] gaps need to close
- **Pass** — fails one or more [REQ]

Be honest. Three out of four criteria is a pass.

### Step 7 — Write the evaluation file

Save to `src/research/companies/<company-slug>/output/thesis.md` using the template at `.claude/skills/evaluate-company/TEMPLATE.md`.

Writing guidance:

- Open with a one-paragraph **executive verdict** — the reader knows the bucket and the position-size recommendation in 30 seconds
- The **checklist scoring tables** are the core artifact — every item, every score, every citation
- **Be willing to say no.** A 95% pass rate would mean we're not actually filtering. Sub-5% is the goal.
- **Position-size recommendation** follows the philosophy's tiers: 3–5% initial, 8–12% on conviction (top 5–8 names only), trim above 15%
- **No advocacy.** The document adjudicates, it does not sell.

### Step 8 — Self-review

Re-read the draft against this checklist before presenting:

- [ ] Every [REQ] item has a score and a citation
- [ ] Bull thesis is written in the language of the four criteria, not generic narrative
- [ ] Verdict is explicit and matches the underlying scoring (no "this fails ROIC test, but it's a Core candidate")
- [ ] Open evidence gaps are named, not papered over
- [ ] No advocacy — adjudication, not selling

Then present a one-paragraph summary to the user (verdict + position-size recommendation + biggest concerns) and link to the file.

## Re-evaluation cadence

This skill is also the right tool for **quarterly thesis review** of an existing holding. In that mode:

- Read the prior `thesis.md` first
- Re-score against the latest filings and transcripts
- Note score drift item-by-item — drift is what catches a deteriorating thesis
- Save the new thesis as `thesis-YYYY-QN.md` (preserve history)
