---
name: red-team-company
description: Stress-test a company against the Generation Fund negative checklist via structured red-teaming and pre-mortem. Use this skill after a deep dive exists (via analyze-company), typically alongside or after evaluate-company. Produces kill-list scoring, pattern-matching against historical disasters (Valeant, Enron, Goosehead, etc.), a written pre-mortem, and a final go/no-go recommendation. Can revisit primary source material to verify red flags.
allowed_tools: Read, Write, Edit, Glob, Grep, Agent
---

# red-team-company

Stress-test a company against the Generation Fund negative checklist ([`src/NEGATIVE-CHECKLIST.md`](../../../src/NEGATIVE-CHECKLIST.md)). Produce a structured red-team / pre-mortem document with verdict: **Proceed**, **Re-evaluate**, or **Pass**.

The job is to **kill the position**, not to approve it. Every great compounder triggers some [WARN] items; the discipline is explicit acknowledgment in writing of what we're accepting before capital is committed.

## Prerequisites

- Deep dive at `src/research/companies/<company-slug>/output/deep-dive.md`
- Source material at `src/research/companies/<company-slug>/sources/`
- `src/NEGATIVE-CHECKLIST.md` (the kill list)
- *Optional but strongly recommended*: an existing `thesis.md` from `evaluate-company` — the red-team is most effective when there's a written bull thesis to attack

## Token Efficiency

Same principle as `evaluate-company`. Read the deep dive once. Spot-check primary sources only when an item cannot be scored from the deep dive. Sub-agent only for multi-document targeted verification.

## Workflow

### Step 1 — Load the negative checklist and prior artifacts

Read:
- `src/NEGATIVE-CHECKLIST.md` (the kill list — all 7 sections)
- `src/research/companies/<company-slug>/output/deep-dive.md`
- *If exists*: `src/research/companies/<company-slug>/output/thesis.md`
- `src/PHILOSOPHY.md` for the too-hard pile and process commitments

### Step 2 — Score every [KILL] and [WARN] item

For each item, the question is phrased so that "no" is sound. Assign:

- **✓ Cleared** — answer is no, with cited evidence
- **✗ Triggered** — answer is yes, with cited evidence
- **❓ Insufficient evidence** — cannot determine from deep dive

For [KILL] items, the standard for "Cleared" is high. **When in doubt, mark Triggered or Insufficient and verify** — false negatives on the kill list are the most expensive mistake this skill exists to prevent.

### Step 3 — Resolve gaps via primary sources

For every ❓ and every borderline ✗, verify against primary sources. Two paths (same as `evaluate-company`):

**A. Direct read** — for specific document spot-checks (proxy related-party section, 10-K Item 1A risk factors, transcript Q&A on a specific topic).

**B. Sub-agent** — for multi-document targeted verification:

| Agent | Best uses in red-team mode |
|-------|----------------------------|
| `proxy-reader` | Related-party flows, family-officer overlap, supervoting structure, insider compensation, controlled-company exemption |
| `annual-report-reader` | Cash flow vs. NI divergence, off-balance-sheet items, SBC trajectory, working-capital deterioration, goodwill/intangibles |
| `transcript-reader` | Management forthrightness on hard questions, missed guidance, evasion patterns, drift in language over time |
| `news-reader` | Restatements, regulatory action, prior-company red flags on executives, short-seller reports |

Pass **narrow, targeted prompts** focused on the specific red flag — not a comprehensive re-extraction.

Example: *"Read the most recent proxy. Identify every related-party transaction, including: (1) parties involved, (2) dollar value 2024 and 2025, (3) approval mechanism, (4) any direction-of-flow change. Quote with citations. Do not summarize executive compensation or beneficial ownership unless directly tied to a related-party item."*

### Step 4 — Pattern-match against historical disasters

Section 7 of the negative checklist is the most distinctive Pabrai-style discipline. For each archetype (Valeant/Wirecard, Enron, GE/IBM, Kraft Heinz, Goosehead, WeWork/Theranos, PG&E, Nifty Fifty, Luckin):

- Is there *any* surface-level resemblance? (be honest — most great companies share *some* traits with failed ones)
- If yes: what specifically looks similar, and what specifically is different?

A "yes" on resemblance does not kill the position. **The difference must be articulated in writing.** Vague "this is different because management is good" is not acceptable — name the structural fact that breaks the pattern.

### Step 5 — Write the pre-mortem

A free-form section: *"It is 2036. This position is down 70% from our entry. What happened?"*

This is the highest-value artifact in the document. Write 4–8 paragraphs as a journalist with the benefit of hindsight, drawing on:
- The negative-checklist findings (where [KILL] and [WARN] items triggered)
- The deep dive's open questions
- The pattern-matches in step 4
- Industry-specific failure modes that don't appear in the generic checklist

The goal is to construct the **most plausible bear-case narrative** — not to dismiss it. If the pre-mortem reads as a strawman, redo it.

Spend more effort here than anywhere else in the document.

### Step 6 — Rank failure modes

Pull the highest-likelihood × highest-magnitude risks identified across the checklist and pre-mortem into a ranked list. For each:

- **The risk** (one sentence)
- **Likelihood** (subjective: low / medium / high — with reasoning)
- **Magnitude if it occurs** (capital impairment scale: partial / substantial / total)
- **Leading indicator** — what would tell us early that the risk is materializing?

This ranked list is the central artifact of the pre-mortem — it defines what would invalidate the thesis and which leading indicators we monitor going forward.

### Step 7 — Final recommendation

Produce one of three:

- **Proceed** — All [KILL] cleared; all [WARN] either cleared or explicitly acknowledged with specific reasoning
- **Re-evaluate** — Multiple [WARN] triggered without compelling rebuttal; likely watchlist
- **Pass** — Any [KILL] triggered

The recommendation must match the underlying scoring. Do not bend.

For accepted [WARN] items, the acknowledgment must be **specific and structural**:
- ✅ *"We accept the geographic concentration in TX/LA/CA because (a) it's the necessary consequence of the climate-driven captive-to-independent migration thesis, (b) carrier diversification within those states is high, and (c) the same risk is the source of the tailwind."*
- ❌ *"We acknowledge the geographic concentration risk."* (vague — provides no learning loop)

### Step 8 — Write the red-team file

Save to `src/research/companies/<company-slug>/output/premortem.md` using the template at `.claude/skills/red-team-company/TEMPLATE.md`.

Writing guidance:

- The **pre-mortem is the centerpiece** — write it as narrative, not bullet points
- The **pattern-match section** requires explicit "this is different because [structural fact]" reasoning for every match
- **Be willing to kill the position.** The mandate of this checklist is to kill, not approve
- **No hedging.** If a [KILL] is triggered, the recommendation is Pass. Do not negotiate with the criteria
- **No advocacy.** This document is the bear case; do not soften it for tone

### Step 9 — Self-review

- [ ] Every [KILL] item scored with citation
- [ ] Every [WARN] item either cleared with evidence or explicitly acknowledged with specific reasoning
- [ ] Pre-mortem reads as a plausible bear narrative, not a strawman (would a smart skeptic recognize their own argument?)
- [ ] Pattern-matches answered with specific structural differences, not dismissals
- [ ] Recommendation matches the underlying scoring — no negotiation

Then present a one-paragraph summary to the user (recommendation + top 3 risks + the most important [WARN] being accepted) and link to the file.

## Re-evaluation cadence

This skill is also the right tool for **quarterly thesis review** when monitoring for thesis drift. In that mode:

- Read the prior `premortem.md` first
- Re-score against the latest filings, transcripts, and news
- Pay particular attention to [WARN] items that were accepted at entry — has the underlying assumption changed?
- Save as `premortem-YYYY-QN.md` (preserve history)

The quarterly red-team is what catches a Goosehead-style slow-motion deterioration before it becomes a 70% drawdown.
