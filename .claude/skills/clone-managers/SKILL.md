---
name: clone-managers
description: Harvest the current portfolio holdings of our admired managers (Pabrai-style cloning) and turn them into a ranked idea queue for the company funnel. Use this skill whenever the user wants to clone/coattail superinvestors, review what the managers we admire are buying, run the quarterly holdings screen, refresh clone candidates, or generate company ideas from 13F / fund-letter holdings. Idea-generation only — due diligence is always independent.
allowed_tools: WebSearch, Fetch, Agent, Read, Write, bash(curl:*)
---

# clone-managers

Operationalizes the fund's commitment to **cloning admired managers as an idea-generation input** (PHILOSOPHY.md: "quarterly review of positions and letters from our curated list … Due diligence is independent").

This is **not position-mirroring.** We hold for 10–20 years and re-underwrite every name independently through the full funnel (`research-company` → `analyze-company` → `evaluate-company` → `red-team-company` → `value-company`). The clone is purely a *front-end idea source* — the same role `analyze-industry` plays when it emits a shortlist. The position-sizing doc names buying on borrowed conviction "the Pabrai failure mode"; this skill exists to feed the funnel, never to bypass it.

**The core insight:** naive 13F-cloning imports junk — Pabrai's US book is coal and offshore drilling, which fails our too-hard pile on sight. The clone we want is **overlap weighted by mandate-fit**: a name held by Akre + Smith + Rochon is a screaming signal *for us*; the same conviction from a commodity sleeve is noise. Always weight by manager mandate-fit and screen to our circle.

## Output

A single point-in-time markdown file per quarter:

```
src/research/watchlists/clone-candidates-<YYYY>-Q<N>.md
```

We do **not** maintain a holdings database or a Sheet. Each quarter is a fresh dated file; the trend is read by comparing against the prior quarter's file (`src/` lives on Google Drive, which retains version history). Deep multi-year history, when wanted, is rented from third parties — see "Automation stance" below.

**Data vintage:** the latest 13F-HR reflects the *prior* calendar quarter, filed up to 45 days later. Name the file by the **holdings quarter**, not the run date (e.g., a June 2026 run uses Q1-2026 holdings → `clone-candidates-2026-Q1.md`). Q2 13Fs (as-of June 30) do not file until ~mid-August.

## Manager roster & data sources

The "study the managers" deep-dives live in `src/research/managers/<slug>/output/deep-dive.md`. This skill harvests their *holdings*. Mandate-fit governs how heavily each manager's conviction is weighted in the overlap signal.

| Manager | Fund | Mandate fit | Source (code / CIK) | Notes |
|---|---|---|---|---|
| Chuck Akre | Akre Capital | **Core** | Dataroma `AC` | Concentrated quality-compounder book |
| François Rochon | Giverny Capital | **Core** | Dataroma `GC` · EDGAR CIK 0001641864 | Long tail; top-10 ≈ 55% |
| Guy Spier | Aquamarine | **Core** | Dataroma `aq` | ~7 names, Buffett-disciple |
| Li Lu | Himalaya Capital | **Core** | Dataroma `HC` | US-only in 13F; large non-US/China book NOT captured |
| Terry Smith | Fundsmith Equity | **Core** | Factsheet (no 13F) | Top-10 only, ~2.5-mo lag; Trustnet `LSFX1` or fundsmith.co.uk/factsheet |
| Chris Mayer | Woodlock House | **Core** | ❌ **none** (CIK 0001759792 = Form D only) | **No 13F ever filed** — permanent blind spot; holdings only anecdotal |
| Bill Ackman | Pershing Square | Caveated (activist) | Dataroma `psc` | Event/activist names; quality but special-situation |
| Ron Baron | Baron / BAMCO | Caveated (growth, 326 names) | EDGAR CIK 0001017918 (not on Dataroma) | Large/growthy; long book dilutes the overlap signal — read top-25 |
| Baillie Gifford | Scottish Mortgage | Caveated (venture/private) | Factsheet (Trustnet `ITSMT`) | Top-8 only; heavy unlisted (SpaceX/ByteDance) — inaccessible |
| Mohnish Pabrai | Pabrai Funds | **Excluded** (US book = commodity) | Dataroma `pi` | Capture for completeness; effectively ignore for our overlap |

*Closed / historical (study-only, no live feed): Nick Sleep (the famous three — Berkshire/Amazon/Costco), Peter Lynch, Motley Fool Gardners.*

**Effective on-mandate automatable set ≈ 6 managers.** Mayer (best small/mid-cap fit) is invisible to any feed; Pabrai is noise; the two non-US names disclose only top-8/10 with a lag. Roster additions should be recorded here.

Dataroma manager URL pattern: `https://www.dataroma.com/m/holdings.php?m=<CODE>`. EDGAR information table: find the latest 13F-HR for the CIK at `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=<CIK>&type=13F`.

## Method

### Step 1 — Harvest (fan out)

Spawn one subagent per 2–3 managers (the gathering is noisy; keep only the findings). Give each: the manager → fund → source-code/CIK mapping above; the instruction to prefer Dataroma, fall back to EDGAR, use factsheets for non-US; and the required return format. Each subagent returns, per manager: as-of date, source URL, and a table of holdings (`Ticker | Company | %Port | Shares | $Value | Activity`), total value, holding count, one notable line. Concentrated books in full; Baron top-25 by weight; non-US top-10/8.

### Step 2 — Signal 1: consensus overlap

Tally companies held by ≥2 managers (consolidate Alphabet GOOG/GOOGL, Berkshire A/B). Rank by **core-manager conviction, not raw count** — use tiers, never decimals:
- ★★★ = held by 3+ core managers
- ★★ = 2 core, or 1 core + caveated
- ★ = 1 core at high conviction

Berkshire is the Buffett-disciple default — flag it separately, it is not a fresh idea. Note that **a single high-conviction divergent bet can outweigh a broad thin consensus** (e.g., Li Lu's ~45% Alphabet > "owned by 4 funds at 2% each").

### Step 3 — Signal 2: new high-conviction buys

A concentrated manager opening a *large new* position is the loudest single idea trigger. List new positions and large adds (>~30%) by core managers; flag clusters (one manager opening several names in the same archetype at once is thematic signal).

### Step 4 — Screen to our circle

- **Drop the too-hard pile** (PHILOSOPHY.md): commodities, capital-intensive cyclicals/banks, binary bets, pure-fashion consumer, private/unlisted (SMT's SpaceX/ByteDance), turnarounds.
- **Confirm EU-retail accessibility** (jurisdiction memory): IBKR/ADR/UCITS reachable; flag China-ADR jurisdiction caution (e.g., PDD); drop inaccessible privates.
- **Flag already-adjudicated names** — cross-check existing `src/research/watchlists/`, company `output/`, and the project memory index. Do not re-queue a settled Pass/Watchlist unless a name hits its recorded re-test trigger.

### Step 5 — Rank the shortlist & write the file

Produce the ranked clone-candidate shortlist (survivors only) → these feed `research-company` in priority order. Then write the output file using the structure below. Cross-link candidates to relevant existing artifacts (e.g., a cornered-resource name → `archetype-i-cornered-resource-screen-*.md`).

### Step 6 — Meta-observations

The first-run alpha was *not* a name — it was the read that the whole quality crowd was net-trimming, corroborating our own price discipline. Always write 3–5 meta-observations: aggregate buying/selling posture, which archetypes the consensus concentrates in, the single loudest conviction signal, notable new-buy triggers.

## Output file structure

```markdown
# Clone Candidates — Q<N> <YYYY>

**Run date** · **Data vintage** · **Method** (one line; idea-generation only, DD independent)
> Point-in-time artifact note (no database; compare to prior quarter's file)

## Manager coverage & data status   ← the roster table, with ✅/⚠️/❌ data status per manager
## Signal 1 — Consensus overlap     ← table: Company | Held by (core bold) | ★ signal | Our status
## Signal 2 — New high-conviction buys
## Screen → ranked clone-candidate shortlist   ← survivors, numbered, priority order
   (+ "Flagged, not re-queued" and "Excluded (too-hard/inaccessible)" subsections)
## Meta-observations
## Data-coverage notes → tooling decision
## Next actions   ← which candidates to queue into research-company
## Appendix — point-in-time snapshots   ← compact `ticker · %port · activity` per manager (provenance for the diff)
```

## Automation stance

The first manual run (2026-Q1) cost ~4 parallel passes / ~30 min, off free sources only (Dataroma + EDGAR + factsheets). Findings on automating it:

- **~6 of 14 managers are cleanly automatable** (US 13F filers); free options exist — SEC's own [Form 13F Data Sets](https://www.sec.gov/data-research/sec-markets-data/form-13f-data-sets) (CUSIP-only, no tickers) or [FMP](https://site.financialmodelingprep.com/datasets/form-13f) free tier (ticker-resolved by CIK, 250 calls/day). Paid/richer: sec-api.io, WhaleWisdom (~$300/yr, auto-computes overlap). Dataroma already computes the overlap view for its covered managers but has no API (HTML/RSS only).
- **Two structural blind spots no tool fixes:** Mayer (no 13F) and the non-US pair (top-8/10 lagged factsheets).
- **Verdict: keep this a manual-quarterly *skill*, not a data pipeline.** The bottleneck was never data access — it is the judgment layer (mandate-fit weighting, the circle screen, the already-adjudicated check), which no feed does. Revisit FMP free-tier automation only if the roster expands materially or the artifact proves it generates ideas that survive the funnel.

## Cadence

Re-run quarterly, ~1 week after each 13F deadline (mid-Feb / mid-May / mid-Aug / mid-Nov). Diff the new file against the prior quarter to surface what changed across the admired books.

## Prerequisites

- `WebSearch` / `Fetch` for Dataroma, EDGAR, and factsheet pages
- `Agent` (subagent fan-out) for the harvest step
- No paid data subscription required for the manual loop
