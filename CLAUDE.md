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
│   └── output/                   # Deep-dives produced by analyze-company
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

## Skills

- **research-company** — Collect source material for a single company. Invoke for any research request mentioning a company name or ticker.
- **analyze-company** — Synthesize a company's collected sources into a structured deep-dive. Requires sources collected via `research-company`.
- **research-industry** — Collect source material for an industry/sector (frameworks, primers, fund-letter commentary, VC maps, trade press). Invoke when the user wants to understand a sector as a hunting ground for compounders.
- **analyze-industry** — Synthesize an industry's collected sources into a structured deep-dive applying 11 diagnostic frameworks (Buffett binary, BCG Advantage Matrix, Mauboussin moats, Helmer 7 Powers, Dorsey 4 sources, Sleep SES, Akre reinvestment, Smith exclusion, NZS Resilience/Optionality/NZS, Christensen disruption, Five Forces). Requires sources collected via `research-industry`.

## Workflow

1. **Industry-first** — Run `research-industry` then `analyze-industry` on a sector. This produces a ranked shortlist of 5-10 public players whose structural position justifies a follow-on company deep-dive.
2. **Company deep-dive** — For each shortlisted name, run `research-company` then `analyze-company`. The output frames whether the company belongs in the watchlist.
3. **Watchlist curation** — Maintain `src/research/watchlists/future-compounders.md` and similar cross-entity artifacts.

## Dependencies

- Node.js (for extraction scripts): `npm install`
- `playwright-cli` on PATH (browser automation for authenticated content)
- Auth state stored in `.playwright-cli/auth-state.json` (gitignored)

## Conventions

- All sources go under `src/research/companies/<slug>/sources/` or `src/research/industries/<slug>/sources/` with a `sources.md` index
- All outputs go under `src/research/<entity-type>/<slug>/output/`
- PDFs downloaded via `curl`, web pages extracted via `playwright-cli` + Readability/Turndown
- Research sessions: start `playwright-cli -s=research open --headed`, load auth state, collect sequentially, close when done
- Relative source links in deep-dives use `../sources/...` (the output and sources folders are siblings under the entity directory)
