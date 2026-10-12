---
tags:
  - premortem
  - company/[slug]
created: [YYYY-MM-DD]
updated: [YYYY-MM-DD]
ticker: [TICKER]
recommendation: [Proceed / Re-evaluate / Pass]
---

# [Company Name] — Pre-Mortem

## Executive recommendation

One paragraph. The recommendation, the top 3 risks (ranked), the single most important [WARN] item being accepted if we proceed.

---

## Pre-mortem: it is 2036 and this position is down 70%

A narrative bear case in 4–8 paragraphs. What happened, drawing from the negative-checklist findings, the deep dive's open questions, and the historical pattern matches.

The pre-mortem must read as a plausible journalist's account with hindsight, not a strawman. If a smart skeptic of the position wouldn't recognize their own argument here, redo it.

---

## Negative checklist scoring

Single source of truth: [`src/NEGATIVE-CHECKLIST.md`](../../../../NEGATIVE-CHECKLIST.md). Copy every item from the live checklist verbatim into the tables below — one row per item, in checklist order, under the matching section heading. Do not paraphrase, do not reorder, do not drop items.

Scoring rubric: **✓ Cleared** / **✗ Triggered** / **❓ Insufficient evidence**. Every Cleared or Triggered requires a citation — `[deep-dive.md §X]` or `[source-file, p. N]`.

[KILL] items default to Triggered when in doubt — false negatives on the kill list are the most expensive mistake this checklist exists to prevent.

### 1. Moat / business erosion

| Item | Score | Evidence |
|---|---|---|
| *(one row per NEGATIVE-CHECKLIST.md §1 item, verbatim)* |  |  |

### 2. Management / character / governance

| Item | Score | Evidence |
|---|---|---|
| *(one row per NEGATIVE-CHECKLIST.md §2 item, verbatim)* |  |  |

### 3. Accounting / financial integrity

| Item | Score | Evidence |
|---|---|---|
| *(one row per NEGATIVE-CHECKLIST.md §3 item, verbatim)* |  |  |

### 4. Capital allocation / balance sheet

| Item | Score | Evidence |
|---|---|---|
| *(one row per NEGATIVE-CHECKLIST.md §4 item, verbatim)* |  |  |

### 5. Industry / structural / external

| Item | Score | Evidence |
|---|---|---|
| *(one row per NEGATIVE-CHECKLIST.md §5 item, verbatim)* |  |  |

### 6. Behavioral / personal biases

This section examines *us*, not the company.

| Item | Score | Evidence / acknowledgment |
|---|---|---|
| *(one row per NEGATIVE-CHECKLIST.md §6 item, verbatim)* |  |  |

### 7. Historical pattern matches

For each archetype listed in `NEGATIVE-CHECKLIST.md §7`, name the resemblance (if any) and the structural difference. One row per archetype, verbatim.

| Archetype | Resemblance? | What's similar | Structural difference |
|---|---|---|---|
| *(one row per NEGATIVE-CHECKLIST.md §7 archetype, verbatim)* |  |  |  |

---

## Failure modes ranked

Top 3–5 risks in order of (likelihood × magnitude).

| Rank | Risk | Likelihood | Magnitude | Leading indicator |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

---

## Accepted [WARN] items (if proceeding)

For each [WARN] triggered, the **specific structural reasoning** for why we accept it. Vague acknowledgment is not acceptable here.

- **[Item name]**: [Why we accept this risk, structurally — not "we acknowledge it"]
- ...

---

## Final recommendation

**[Proceed / Re-evaluate / Pass]**

One paragraph of reasoning that ties the recommendation to the underlying scoring. If proceeding, the most important risk that the position is being held *despite*, and the leading indicator we will monitor.

---

*The ranked failure modes above define what would invalidate the thesis and which leading indicators we monitor in quarterly review.*
