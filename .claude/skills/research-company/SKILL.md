---
name: research-company
description: Run deep research on a company — find and collect qualified source material (annual reports, proxy filings, earnings transcripts, analyst reports, fund letters, articles, employee sentiment, customer reviews) and save it to the company's source directory. Use this skill whenever the user asks to research a company, gather investment materials, build a research dossier, analyze a stock, or collect sources on a business — even if they don't explicitly say "research."
allowed_tools: WebSearch, Fetch, bash(curl:*), bash(playwright-cli:*), bash(npx tsx .claude/skills/research-company/scripts/extract-markdown.ts:*),
---

# research-company

Collect high-quality source material on a company for investment research. Search across authoritative sources, download or extract each document, and organize everything into the company's source directory.

## Directory Structure

All sources go into `src/research/companies/<company-slug>/sources/` where `<company-slug>` is a lowercase, hyphenated name (e.g. `berkshire-hathaway`, `constellation-software`).

```
src/research/companies/<company-slug>/
├── sources/
│   ├── sources.md          # Index of all collected sources
│   ├── ir/                 # Investor relations materials (PDFs)
│   ├── transcripts/        # Earnings call & investor day transcripts
│   ├── podcasts/           # Long-form podcasts (Colossus, TIP, Acquired, etc.)
│   ├── analysis/           # Third-party analysis and writeups
│   ├── scuttlebutt/        # Expert/insider calls, employee sentiment, customer reviews, industry sentiment
│   └── news/               # News articles and investigative reports
└── output/                 # Deep-dives produced by analyze-company
```

## Source Hierarchy

Search and collect following source material:

1. **Company IR website** — Shareholder letters, annual reports (10-K), proxy filings (DEF 14A), investor day presentations, and important press releases.
2. **Earnings call & Investor Day transcripts** — on [seekingalpha.com](https://seekingalpha.com).
3. **Long-form podcast transcripts** — from [Colossus](https://www.colossus.com/) (Invest Like the Best, Business Breakdowns, Founders), [The Investors Podcast Network](https://www.theinvestorspodcast.com/), and [Acquired](https://www.acquired.fm/).Direct insights from CEOs, investors and industry experts plus company specific analysis.
4. **Third-party analysis** — on [seekingalpha.com](https://seekingalpha.com), [valueinvestorsclub.com](https://valueinvestorsclub.com) and [substack.com](https://substack.com). Long-term fundamental analysis only. Skip short-term trading ideas, technical analysis, and momentum-based articles.
5. **Fund letters and reports** — from quality fundamental investors who have written about the company. These are often the most insightful sources — track down the original PDFs from fund websites when possible.
6. **Scuttlebutt** — Primary research that filings can't reach: 
  - expert calls (e.g. [InPractise](https://inpractise.com/), etc.)
  - employee sentiment (e.g. [Glassdoor](https://www.glassdoor.com/), etc.) 
  - customer reviews (e.g. Gartner, Forrester for B2B tech)
  - sentiment / deep scuttlebutt on Reddit, X/Twitter
7. **News and investigative reporting** — from reputable or industry-specific sources.

Focus on the last 5 years. Use `WebSearch` for initial discovery, then navigate directly to collect.

## Platform Navigation

Navigate these platform's structured pages directly rather than relying on web search to discover content. Web search misses results that are easily found via the platform's own navigation. Those platform's content needs authentication to access.

### Seeking Alpha
- **Transcripts**: `https://seekingalpha.com/symbol/<TICKER>/earnings/transcripts`
- **Analysis**: `https://seekingalpha.com/symbol/<TICKER>/analysis`

### Value Investors Club
- **Search**: `https://valueinvestorsclub.com/search/<company-name>`

### Substack
- Use `WebSearch` with `site:substack.com <company> <ticker>` — Substack has no central search across publications.

### Colossus
- **Search**: `https://www.colossus.com/?s=<company-name>`
- Each episode page has a transcript section with a "Download PDF" button, use this to download the transcript.
 - *Business Breakdowns* episodes are particularly valuable: each is a 60-90 minute structured deconstruction of a single company.

### The Investors Podcast Network
- **Search**: `https://www.theinvestorspodcast.com/?s=<company-name>`
- Each episode page has a transcript section, which needs to be expanded via the "Read More" button to show the full transcript.

### Acquired
- **Transcript**: `https://www.acquired.fm/episodes/<company-name>#transcript`

### Fund Letters
- Use `WebSearch` to find fund letters mentioning the company. Look for the original PDF on the fund's website (e.g. `<fund>.com/letters/`). SA and Insider Monkey often republish excerpts, which are useful for discovering funds that hold the position, but always try to get the original.


### In Practise
- High quality primary research, expert calls. Most content paywalled, but some sources are free (filter for free only). 
- **Search**: `https://inpractise.com/explore?query=<company-name>&filterFree=true` 

### Glassdoor
- **Search**: `site:glassdoor.com <company>`
- Requires login, heavy Cloudflare bot protection — use authenticated `playwright-cli` session

### Customer Reviews
- **B2B Tech**: `g2.com`, `capterra.com`, `gartner.com/peer-insights`
- **Consumer apps**: App Store + Play Store reviews
- **DTC / retail / hospitality**: Trustpilot, Yelp, Google Reviews, TripAdvisor

### Reddit
- Append `.json` to any Reddit URL for structured data — no auth needed, free, works today
- **Search across all of Reddit**: `https://www.reddit.com/search.json?q=<company>&sort=top&limit=100&t=year`
- **Subreddit-scoped search**: `https://www.reddit.com/r/<sub>/search.json?q=<company>&restrict_sr=1&t=year`
- **Full comment tree for a thread**: append `.json` to the thread URL
- Rate-limit: ~1 req/sec is safe; no API key required

### X / Twitter
- Use `site:x.com <company>` via Google for cached snapshots
- For deeper passes, navigate via `playwright-cli` session (auth required)

## Collecting Sources

### PDF Files (annual reports, filings, presentations)

Materials on IR websites (sometimes also fund letters and reports) are typically available as PDFs. Download directly:

```bash
curl -L -o src/research/companies/<company-slug>/sources/ir/<filename>.pdf "<url>"
```

### Web Pages (articles, transcripts, writeups)

For content only available as a web page, use `playwright-cli` to extract both a PDF snapshot and a clean markdown version.

**Step 0 — Start session and load auth state** (once per research session):

```bash
playwright-cli -s=research-<company-name> open --headed
playwright-cli -s=research-<company-name> state-load .playwright-cli/auth-state.json
```

**Step 1 — Navigate to the page:**

```bash
playwright-cli -s=research-<company-name> goto "<url>"
```

Use `playwright-cli -s=research-<company-name> snapshot` to verify the page loaded correctly and authentication is active.

**Step 2 — Save as PDF:**

```bash
playwright-cli -s=research-<company-name> pdf > src/research/companies/<company-slug>/sources/<subfolder>/<filename>.pdf
```

**Step 3 — Extract HTML and convert to markdown:**

```bash
# Extract the page's HTML
playwright-cli -s=research-<company-name> eval "document.documentElement.outerHTML" > /tmp/page.html

# Convert to clean markdown using the bundled script
npx tsx .claude/skills/research-company/scripts/extract-markdown.ts \
  /tmp/page.html \
  src/research/companies/<company-slug>/sources/<subfolder>/<filename>.md \
  --url="<source-url>"
```

The extraction script uses Mozilla's Readability to isolate article content and Turndown to produce clean markdown. Each file gets a header with the title, source URL, and extraction date.

**Step 4 — Close the page when done collecting from that site:**

```bash
playwright-cli -s=research-<company-name> close
```

### Scuttlebutt

Deep scuttlebutt research is usually best stored as a **synthesis** rather than raw sources — themes, sentiment trend, representative quotes with links back to the original. This is especially true for Reddit and X, where the raw firehose is huge and most signal lives in patterns across many posts.

A useful pattern: pull JSON via Reddit's `.json` endpoints (or other API), have the model distill themes and quotes, save a single `scuttlebutt/reddit-<topic>-<date>.md` with the synthesis + links — not 200 individual post dumps.

### File Naming Convention

Use descriptive, slugified filenames with dates where applicable:

```
ir/2024-annual-report.pdf
ir/2024-proxy-statement.pdf
transcripts/2024-q4-earnings-transcript.md
transcripts/2025-investor-day-transcript.md
podcasts/colossus-episode-name-2014.md
podcasts/tip-episode-name-2023.md
podcasts/acquired-company-part-1-2022.md
analysis/vic-username-2022.md
analysis/sa-title-slug-2024.md
analysis/giverny-capital-q4-2025-letter.md
scuttlebutt/inpractise-former-vp-engineering-2025.md
scuttlebutt/glassdoor-snapshot-2026-05.pdf
scuttlebutt/reddit-r-sysadmin-thread-2025-11.md
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

## Podcast Interviews
| File | Description | Show | Date |
|------|-------------|------|------|
| podcasts/colossus-invest-like-the-best-leonard-2014.md | Mark Leonard interview | Invest Like the Best | 2014-05 |

## Analysis & Writeups
| File | Description | Source | Date |
|------|-------------|--------|------|
| analysis/seekingalpha-deep-dive-2024.md | "Title of Article" | Seeking Alpha | 2024-06-01 |

## Scuttlebutt
| File | Description | Source | Date |
|------|-------------|--------|------|
| scuttlebutt/inpractise-former-vp-eng.md | Former VP Engineering interview | In Practise | 2025-09 |
| scuttlebutt/glassdoor-snapshot.pdf | Glassdoor review snapshot (rating trend + top themes) | Glassdoor | 2026-05 |
| scuttlebutt/g2-reviews-snapshot.md | G2 reviews, "why switched away" themes | G2 | 2026-05 |

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
