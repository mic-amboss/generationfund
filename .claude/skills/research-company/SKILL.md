---
name: research-company
description: Run deep research on a company — find and collect qualified source material (annual reports, proxy filings, earnings transcripts, analyst reports, fund letters, articles) and save it to the company's source directory. Use this skill whenever the user asks to research a company, gather investment materials, build a research dossier, analyze a stock, or collect sources on a business — even if they don't explicitly say "research."
allowed_tools: WebSearch, Fetch, bash(curl:*), bash(playwright-cli:*), bash(npx tsx .claude/skills/research-company/scripts/extract-markdown.ts:*),
---

# research-company

Collect high-quality source material on a company for investment research. Search across authoritative sources, download or extract each document, and organize everything into the company's source directory.

## Directory Structure

All sources go into `src/research/sources/<company-slug>/` where `<company-slug>` is a lowercase, hyphenated name (e.g. `berkshire-hathaway`, `constellation-software`).

```
src/research/sources/<company-slug>/
├── sources.md              # Index of all collected sources
├── ir/                     # Investor relations materials (PDFs)
├── transcripts/            # Earnings call transcripts
├── analysis/               # Third-party analysis and writeups
└── news/                   # News articles and investigative reports
```

## Source Hierarchy

Search and collect material from these sources, roughly in order of importance, focus on the last 5 years:

1. **Company IR website** — Shareholder letters, annual reports (10-K), proxy filings (DEF 14A), investor day presentations, and important press releases.
2. **Earnings call & Investor Day transcripts** — on [seekingalpha.com](https://seekingalpha.com).
3. **Third-party analysis** — on [seekingalpha.com](https://seekingalpha.com), [valueinvestorsclub.com](https://valueinvestorsclub.com) and [substack.com](https://substack.com). Long-term fundamental analysis only. Skip short-term trading ideas, technical analysis, and momentum-based articles.
4. **Fund letters and reports** — from quality fundamental investors who have written about the company. These are often the most insightful sources — track down the original PDFs from fund websites when possible.
5. **News and investigative reporting** — from reputable or industry-specific sources.

## Platform Navigation

Navigate each platform's structured pages directly rather than relying on web search to discover content. Web search misses results that are easily found via the platform's own navigation.

### Seeking Alpha
- **Transcripts**: `https://seekingalpha.com/symbol/<TICKER>/earnings/transcripts`
- **Analysis**: `https://seekingalpha.com/symbol/<TICKER>/analysis`

### Value Investors Club
- **Search**: `https://valueinvestorsclub.com/search/<company-name>`

### Substack
- Use `WebSearch` with `site:substack.com <company> <ticker>` — Substack has no central search across publications.

### Fund Letters
- Use `WebSearch` to find fund letters mentioning the company. Look for the original PDF on the fund's website (e.g. `<fund>.com/letters/`). SA and Insider Monkey often republish excerpts, which are useful for discovering funds that hold the position, but always try to get the original.

Use `WebSearch` for initial discovery, then navigate directly to collect.

## Collecting Sources

### PDF Files (annual reports, filings, presentations)

Materials on IR websites (sometimes also fund letters and reports) are typically available as PDFs. Download directly:

```bash
curl -L -o src/research/sources/<company-slug>/ir/<filename>.pdf "<url>"
```

### Web Pages (articles, transcripts, writeups)

For content only available as a web page, use `playwright-cli` to extract both a PDF snapshot and a clean markdown version.

**Step 0 — Start session and load auth state** (once per research session):

```bash
playwright-cli -s=research open --headed
playwright-cli -s=research state-load .playwright-cli/auth-state.json
```

**Step 1 — Navigate to the page:**

```bash
playwright-cli -s=research goto "<url>"
```

Use `playwright-cli -s=research snapshot` to verify the page loaded correctly and authentication is active.

**Step 2 — Save as PDF:**

```bash
playwright-cli -s=research pdf > src/research/sources/<company-slug>/<subfolder>/<filename>.pdf
```

**Step 3 — Extract HTML and convert to markdown:**

```bash
# Extract the page's HTML
playwright-cli -s=research eval "document.documentElement.outerHTML" > /tmp/page.html

# Convert to clean markdown using the bundled script
npx tsx .claude/skills/research-company/scripts/extract-markdown.ts \
  /tmp/page.html \
  src/research/sources/<company-slug>/<subfolder>/<filename>.md \
  --url="<source-url>"
```

The extraction script uses Mozilla's Readability to isolate article content and Turndown to produce clean markdown. Each file gets a header with the title, source URL, and extraction date.

**Step 4 — Close the page when done collecting from that site:**

```bash
playwright-cli -s=research close
```

### File Naming Convention

Use descriptive, slugified filenames with dates where applicable:

```
ir/2024-annual-report.pdf
ir/2024-proxy-statement.pdf
transcripts/2024-q4-earnings-transcript.md
transcripts/2025-investor-day-transcript.md
analysis/vic-username-2022.md
analysis/sa-title-slug-2024.md
analysis/giverny-capital-q4-2025-letter.md
news/watsco-com-acquisition-announcement-2025.md
```

## Source Index

After collecting all materials, create a `sources.md` index in the company directory. This is the map of everything collected — it helps quickly assess coverage and find specific documents.

```markdown
# [Company Name] — Research Sources

## Investor Relations
| File | Description | Date |
|------|-------------|------|
| ir/2024-annual-report.pdf | Annual Report / 10-K | 2024 |

## Transcripts
| File | Description | Date |
|------|-------------|------|
| transcripts/2024-q4-earnings-transcript.md | Q4 2024 Earnings Call | 2025-02 |

## Analysis & Writeups
| File | Description | Source | Date |
|------|-------------|--------|------|
| analysis/seekingalpha-deep-dive-2024.md | "Title of Article" | Seeking Alpha | 2024-06-01 |

## News
| File | Description | Source | Date |
|------|-------------|--------|------|
| news/wsj-acquisition-2025.md | "Headline" | WSJ | 2025-03-10 |
```

## Quality Checklist

**Before collecting:**
- Navigate platform pages directly (SA transcripts page, VIC search, etc.) — don't rely solely on web search
- Start `playwright-cli` with `--headed` and load auth state before hitting authenticated sites

**During collection:**
- One URL at a time through `playwright-cli` — it shares a single browser, sequential only
- Verify extracted file sizes — transcripts should be 30-50K, analysis 5-40K. Under 3K usually means a paywall, bot block, or redirect. Re-extract or discard
- `Could not parse CSS stylesheet` warnings from the extraction script are harmless — ignore them
- Avoid Yahoo Finance as a source — it redirects by locale and serves consent pages

**Analysis filtering — collect:**
- Business deep dives, competitive analysis, management assessments, capital allocation breakdowns, VIC writeups, quality fund letters

**Analysis filtering — skip:**
- Price targets, technical analysis, "top 10 stocks" listicles, momentum screens, short-term earnings previews, articles that are mostly charts with no original insight

**After collecting:**
- Build `sources.md` index with every file, description, source, and date
- Save auth state if you authenticated to any new sites during the session

## Prerequisites

- Node.js dependencies installed at project root (`npm install`)
- `playwright-cli` available on the PATH
