---
name: research-industry
description: Run deep research on an industry — find and collect qualified source material (industry primers, frameworks, fund-letter commentary, VC market maps, trade-association reports, leading-player filings) and save it to the industry's source directory. Use this skill whenever the user asks to research an industry, understand a sector's economics, build a watchlist within a market, or find the structural pattern that produces compounders in a domain — even if they don't explicitly say "research."
allowed_tools: WebSearch, Fetch, bash(curl:*), bash(playwright-cli:*), bash(npx tsx .claude/skills/research-company/scripts/extract-markdown.ts:*),
---

# research-industry

Collect high-quality source material on an industry for fundamental investment research. Search across academic, sell-side, consulting, VC, and quality-investor traditions, download or extract each document, and organize everything into the industry's source directory.

The goal is to assemble enough source material to support a structured industry deep-dive that answers: *Is this a compounder factory? Why? What does the structural winner look like?*

## Directory Structure

All sources go into `src/research/industries/<industry-slug>/sources/` where `<industry-slug>` is a lowercase, hyphenated name (e.g. `vertical-market-software`, `specialty-insurance`, `pet-health`).

```
src/research/industries/<industry-slug>/
├── sources/
│   ├── sources.md          # Index of all collected sources
│   ├── frameworks/         # Academic & moat frameworks applied to this industry
│   ├── reports/            # Sell-side primers, consulting deep-dives, trade-association data
│   ├── vc-maps/            # Sequoia, Bessemer, a16z, USV market maps and thematic essays
│   ├── investor-letters/   # Quality-investor commentary on this industry
│   ├── podcasts/           # Long-form podcast interviews on industry structure (Colossus, TIP)
│   ├── leading-players/    # Annual reports / shareholder letters of top 3-5 incumbents (for cross-comparison)
│   └── trade-press/        # Industry trade publications and investigative reporting
└── output/                 # Industry deep-dives produced by analyze-industry
```

## Source Hierarchy

Search and collect material from these sources, roughly in order of importance for a quality-compounder lens:

1. **Quality-investor letters discussing the industry** — Buffett's Berkshire letters, Akre, Sleep & Zakaria (Nomad), Terry Smith (Fundsmith), Tom Gayner (Markel), Chuck Akre, David Poppe (Giverny), Pat Dorsey, Sequoia Fund, Capital Group letters. These are the *highest-signal* source for understanding what makes an industry a compounder factory — they apply diagnostic instinct earned over decades.

2. **Long-form podcast interviews on industry structure** — Colossus's *Business Breakdowns* episodes are essentially industry primers in podcast form (each is a 60-90 minute structured deconstruction of a single company that illuminates the underlying industry). *Invest Like the Best* episodes with quality investors and operators discussing a sector are equally high-signal. The Investors Podcast Network's podcasts often feature industry-level discussions with investors who own multiple names in a vertical.

3. **Academic & moat frameworks applied to this industry** — Michael Mauboussin papers (Measuring the Moat, Base Rate Book, Capital Allocation, ROIC and Intangible Assets), Aswath Damodaran sector data, Hamilton Helmer's 7 Powers analyses, Pat Dorsey's Five Rules sector chapters.

4. **Sell-side industry primers** — Bernstein "Black Books" (when available), initiation reports, sector primers from Goldman, Morgan Stanley, Stifel, William Blair, Baird. The structural skeleton + sector-specific accounting.

5. **VC market maps & thematic essays** — Sequoia "Market Maps," Bessemer "Roadmaps" + "State of the Cloud," a16z "Big Ideas" + thematic essays, Union Square Ventures "Thesis," NZS Capital "Complexity Investing." For evolving industries.

6. **Consulting deep-dives** — McKinsey, BCG, Bain industry insights — for value-chain decomposition and profit-pool analysis. Read with healthy skepticism (consultants are paid by incumbents).

7. **Trade-association data & industry trade press** — IBISWorld, Statista, Frost & Sullivan, sector-specific trade publications (e.g., Insurance Journal, Modern Healthcare, Auto News, Plastics News). Structural data + cultural context.

8. **Leading-player filings** — annual reports / shareholder letters of the 3-5 top public players in the industry. Use these for cross-comparison; do not deep-dive each (that's what `research-company` is for).

9. **News & investigative reporting** — for crises, regulatory shifts, disruption events that shape industry structure.

## Platform Navigation

Navigate each platform's structured pages directly rather than relying on web search alone.

### Quality-investor letters
- **Berkshire Hathaway**: `https://www.berkshirehathaway.com/letters/letters.html` — search across decades for industry mentions
- **Giverny Capital**: `https://www.givernycam.com/insights` (also republished on Seeking Alpha)
- **Markel**: annual reports at `https://www.markel.com/about-us/annual-reports`
- **Fundsmith**: `https://www.fundsmith.co.uk/news-media/`
- **Akre Capital**: `https://www.akrecapital.com/`
- Use `WebSearch`: `<industry name> "<investor name>" letter` for individual mentions

### Long-form podcasts
- **Colossus**:
  - **Search**: `https://www.colossus.com/?s=<industry-name>`
  - Each episode page has a transcript section with a "Download PDF" button, use this to download the transcript.
  - *Business Breakdowns* episodes are particularly valuable: each is a 60-90 minute structured deconstruction of a single company.
- **The Investors Podcast Network**:
  - **Search**: `https://www.theinvestorspodcast.com/?s=<industry-name>`
  - Each episode page has a transcript section, which needs to be expanded via the "Read More" button to show the full transcript.

### Mauboussin papers
- Counterpoint Global / Morgan Stanley IM publications: `https://www.morganstanley.com/im/en-us/individual-investor/insights/articles.html`
- The flagship papers (Measuring the Moat, Base Rate Book, Capital Allocation, ROIC and Intangible Assets, Stock Market Concentration) should be downloaded once into a *general* `src/research/frameworks/` directory and referenced from each industry's `frameworks/` folder via symlink or copy

### Damodaran data
- Industry datasets: `https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datacurrent.html` — find the relevant sector cuts (US, Global, EM)
- Blog: `https://aswathdamodaran.substack.com/`

### VC maps & thematic essays
- **Sequoia**: `https://www.sequoiacap.com/perspectives/` — search for the industry's market map
- **Bessemer**: `https://www.bvp.com/atlas` — Roadmap series and State of the Cloud
- **a16z**: `https://a16z.com/news-content/` — thematic essays
- **USV**: `https://www.usv.com/writing/`
- **NZS Capital**: `https://www.nzscapital.com/news`

### Sell-side primers
- Sell-side reports are mostly behind paywalls. Look for:
  - Free initiation report excerpts on `https://www.scribd.com/`
  - University finance program archives that publish historical primers
  - Sector-specific summaries on Substack (e.g., `worldlyinvest.com`, `nongaap.substack.com`, `bestanchorstocks.substack.com`)

### Consulting deep-dives
- **McKinsey**: `https://www.mckinsey.com/industries`
- **BCG**: `https://www.bcg.com/industries`
- **Bain**: `https://www.bain.com/insights/`

### Trade press
- Identify the leading 1-2 trade publications for the industry, then navigate their archives directly
- Use `WebSearch`: `<industry> trade publication` to identify them if unknown

Use `WebSearch` for initial discovery, then navigate directly to collect.

## Collecting Sources

Same mechanics as `research-company`:

### PDF Files (academic papers, fund letters, sell-side primers, annual reports)

```bash
curl -L -o src/research/industries/<industry-slug>/sources/<subfolder>/<filename>.pdf "<url>"
```

### Web Pages (essays, market maps, thematic posts, blog letters)

Use `playwright-cli` to extract both a PDF snapshot and a clean markdown version (same Step 0–4 flow as `research-company`).

```bash
playwright-cli -s=research open --headed
playwright-cli -s=research state-load .playwright-cli/auth-state.json
playwright-cli -s=research goto "<url>"
playwright-cli -s=research pdf > src/research/industries/<industry-slug>/sources/<subfolder>/<filename>.pdf
playwright-cli -s=research eval "document.documentElement.outerHTML" > /tmp/page.html
npx tsx .claude/skills/research-company/scripts/extract-markdown.ts \
  /tmp/page.html \
  src/research/industries/<industry-slug>/sources/<subfolder>/<filename>.md \
  --url="<source-url>"
playwright-cli -s=research close
```

### File Naming Convention

Use descriptive, slugified filenames with year and source identifier:

```
frameworks/mauboussin-measuring-the-moat-2016.pdf
frameworks/damodaran-sector-data-2025-vmsoftware.pdf
frameworks/helmer-7-powers-applied-to-saas-2023.md
reports/bernstein-life-insurance-primer-2023.pdf
reports/goldman-water-primer-2008.pdf
vc-maps/sequoia-generative-ai-market-map-2022.md
vc-maps/bessemer-state-of-the-cloud-2024.md
vc-maps/bessemer-vertical-ai-roadmap-2024.md
investor-letters/buffett-1990-letter-airlines-excerpt.md
investor-letters/sleep-zakaria-nomad-2010-costco-excerpt.md
investor-letters/giverny-q4-2025-watsco-hvac-thesis.md
investor-letters/akre-mastercard-thesis-2018.md
podcasts/colossus-business-breakdowns-vms-csu-2021.md
podcasts/colossus-invest-like-the-best-leonard-2014.md
podcasts/tip-we-study-billionaires-watsa-fairfax-2023.md
leading-players/csu-2024-shareholder-letter.pdf
leading-players/topicus-2024-shareholder-letter.pdf
trade-press/insurance-journal-captive-vs-independent-2024.md
trade-press/auto-news-dealer-rollup-2025.md
```

## Source Index

After collecting all materials, create a `sources.md` index in the industry directory:

```markdown
# [Industry Name] — Research Sources

Brief paragraph on industry definition, scope, why it deserves research focus, and what the open questions are that the source material should answer.

## Frameworks
| File | Description | Source | Date |
|------|-------------|--------|------|
| frameworks/mauboussin-measuring-the-moat-2016.pdf | Counterpoint Global moat framework | Morgan Stanley IM | 2016 |

## Industry Reports & Primers
| File | Description | Source | Date |
|------|-------------|--------|------|

## VC Market Maps & Thematic Essays
| File | Description | Source | Date |
|------|-------------|--------|------|

## Quality-Investor Letters
| File | Description | Investor | Date |
|------|-------------|----------|------|

## Podcast Interviews
| File | Description | Show | Date |
|------|-------------|------|------|

## Leading Players (for cross-comparison)
| File | Company | Description | Date |
|------|---------|-------------|------|

## Trade Press & News
| File | Description | Source | Date |
|------|-------------|--------|------|
```

## Quality Checklist

**Before collecting:**
- Define the industry boundary precisely. Is the unit of analysis the *industry* or a *profit pool* within it? (e.g., "insurance" is too broad — "specialty E&S commercial insurance" is the right unit). Document the boundary in `sources.md`.
- Identify the 5-10 leading public players up front — collecting their annual reports anchors the research.
- Identify which quality investors have written about this industry — these are the highest-signal sources.

**During collection:**
- One URL at a time through `playwright-cli` — sequential only.
- Verify extracted file sizes — primers should be 30K+, fund-letter excerpts 5-30K, framework papers 20-100K. Under 3K usually means a paywall, bot block, or redirect.
- Prioritize *primary sources* (the actual fund letter, the actual Mauboussin paper) over secondary summaries.
- For investor letters, when an entire letter is collected for one company in our company-research workspace, *cross-link* rather than duplicate (e.g., a Giverny letter discussing both Watsco and TWFG should be linked from both industry directories).

**Source filtering — collect:**
- Frameworks that *help diagnose* industries (Mauboussin, Damodaran, Helmer, Dorsey, Porter, Christensen)
- Long-form essays with clear point of view (Sequoia maps, USV theses, a16z thematics)
- Quality-investor commentary that explains *why* an industry produces or fails to produce compounders
- Trade publications with structural analysis (not just news)
- Annual reports of the 3-5 leading players (shareholder letters specifically)

**Source filtering — skip:**
- Stock-tip articles, "top 10 picks in X sector" listicles
- Industry forecasts that are mostly TAM-fluffing
- Pure macroeconomic commentary
- Promotional vendor whitepapers (most "thought leadership" from industry vendors)

**After collecting:**
- Build `sources.md` index with every file, description, source, and date.
- Note in `sources.md` what's *missing* — gaps direct future collection.

## Prerequisites

- Node.js dependencies installed at project root (`npm install`)
- `playwright-cli` available on the PATH
- The flagship Mauboussin papers downloaded once into a shared frameworks library (recommended: `src/research/frameworks/mauboussin/`) and referenced/symlinked from each industry's `frameworks/` folder
