# Generation Fund

AI-assisted investment research workspace. Claude Code skills automate the collection and analysis of source material for long-term fundamental investing — at both the **company** and **industry** level.

## Project Structure

```
src/research/
├── companies/<company-slug>/
│   ├── sources/                  # Collected source material (gitignored)
│   │   ├── sources.md            # Index
│   │   ├── ir/                   # Annual reports, 10-Ks, proxies
│   │   ├── transcripts/          # Earnings calls, investor days
│   │   ├── analysis/             # Fund letters, SA/VIC writeups
│   │   └── news/                 # News & investigative reporting
│   └── output/                   # Deep-dives, theses, pre-mortems, valuations
├── industries/<industry-slug>/
│   ├── sources/                  # Collected source material (gitignored)
│   │   ├── sources.md            # Index
│   │   ├── frameworks/           # Mauboussin, Helmer, Dorsey, etc. (per-industry)
│   │   ├── reports/              # Sell-side primers, consulting deep-dives
│   │   ├── vc-maps/              # Sequoia, Bessemer, a16z thematic essays
│   │   ├── investor-letters/     # Quality-investor commentary on the industry
│   │   ├── leading-players/      # Annual reports of top 3-5 incumbents (cross-comparison)
│   │   └── trade-press/          # Industry trade publications
│   └── output/                   # Industry deep-dives produced by analyze-industry
├── frameworks/                   # Shared library — Mauboussin, Helmer, Damodaran (referenced from many industries)
└── watchlists/                   # Cross-entity artifacts (e.g., future-compounders.md)

.claude/skills/                   # Claude Code skills
.claude/agents/                   # Sub-agents for research extraction
```

## Constitution

The fund's investment philosophy lives at the top of `src/`:

- **`src/PHILOSOPHY.md`** — Investment philosophy. Defines the goal (concentrated portfolio of generational compounders, 15+% over 10–20 years), the four criteria, the too-hard pile, portfolio construction, process commitments. The document of record.
- **`src/CHECKLIST.md`** — Positive checklist. [REQ] / [PREF] items mapped to the four criteria. The "what we want to see" list.
- **`src/NEGATIVE-CHECKLIST.md`** — Pabrai-style kill list and pre-mortem framework. [KILL] / [WARN] items + historical pattern-matches. The "what we cannot live with" list.

These three documents predate any specific company decision and do not bend to fit a name we want to own.

## Skills

- **research-company** — Collect source material for a single company. Invoke for any research request mentioning a company name or ticker.
- **analyze-company** — Synthesize a company's collected sources into a structured deep-dive. Requires sources collected via `research-company`.
- **evaluate-company** — Score a deep dive against the philosophy and positive checklist. Produces `thesis.md` with a verdict (Generational candidate / Quality but sub-generational / Watchlist / Pass) and a bull thesis written in the language of the four criteria.
- **red-team-company** — Stress-test against the negative checklist with kill-list scoring, pattern-matching against historical disasters, and a written pre-mortem. Produces `premortem.md` with a Proceed / Re-evaluate / Pass recommendation.
- **value-company** — Build a bespoke valuation model and triangulate a 10-year expected IRR via three lenses (driver model, destination analysis, IRR decomposition). Bespoke per business-model archetype, not a generic DCF. Produces `valuation.xlsx` + `valuation.md` with an IRR and a Reasonable-price verdict (Underwrites @ 15%+ / Sub-target / Pass on price). Run after `evaluate-company`.
- **research-industry** — Collect source material for an industry/sector (frameworks, primers, fund-letter commentary, VC maps, trade press). Invoke when the user wants to understand a sector as a hunting ground for compounders.
- **analyze-industry** — Synthesize an industry's collected sources into a structured deep-dive applying 11 diagnostic frameworks (Buffett binary, BCG Advantage Matrix, Mauboussin moats, Helmer 7 Powers, Dorsey 4 sources, Sleep SES, Akre reinvestment, Smith exclusion, NZS Resilience/Optionality/NZS, Christensen disruption, Five Forces). Requires sources collected via `research-industry`.

## Workflow

1. **Industry-first** — Run `research-industry` then `analyze-industry` on a sector. This produces a ranked shortlist of 5–10 public players whose structural position justifies a follow-on company deep-dive.
2. **Company deep-dive** — For each shortlisted name, run `research-company` then `analyze-company`. Descriptive synthesis only.
3. **Adjudicate quality** — Run `evaluate-company` (positive checklist) and `red-team-company` (negative checklist) against the deep dive. The evaluation produces the bull thesis and verdict; the red-team produces the pre-mortem and go/no-go.
4. **Adjudicate price** — Run `value-company` to triangulate a 10-year IRR vs. the 15% hurdle. Builds a bespoke driver model per archetype (SaaS, serial acquirer, network, etc.), runs three lens checks, and outputs an `Underwrites @ 15%+ / Sub-target / Pass on price` verdict.
5. **Watchlist curation** — Maintain `src/research/watchlists/future-compounders.md` and similar cross-entity artifacts.

The descriptive (`analyze-*`) and adjudicative (`evaluate-*`, `red-team-*`, `value-*`) layers are deliberately separate. Mixing advocacy into synthesis biases the synthesis.

## Dependencies

- Node.js (for extraction scripts): `npm install`
- `playwright-cli` on PATH (browser automation for authenticated content)
- Auth state stored in `.playwright-cli/auth-state.json` (gitignored)
- LibreOffice (`brew install --cask libreoffice`) — required by `xlsx` skill's `recalc.py` for formula recalculation
- `xlsx` skill — install via `npx skills add anthropics/skills@xlsx -y`. Files land in `.agents/skills/xlsx/` (gitignored), symlinked from `.claude/skills/xlsx`

## Conventions

- All sources go under `src/research/companies/<slug>/sources/` or `src/research/industries/<slug>/sources/` with a `sources.md` index
- All outputs go under `src/research/<entity-type>/<slug>/output/`
- PDFs downloaded via `curl`, web pages extracted via `playwright-cli` + Readability/Turndown
- Research sessions: start `playwright-cli -s=research open --headed`, load auth state, collect sequentially, close when done
- Relative source links in deep-dives use `../sources/...` (the output and sources folders are siblings under the entity directory)
