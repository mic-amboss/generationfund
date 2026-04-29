---
name: analyze-company
description: Synthesize collected research sources into a structured company deep dive. Use this skill whenever the user asks to analyze a company, write a deep dive, profile a business, summarize what we know about a company, or wants to understand a business in depth — even if they don't say "analyze" explicitly. Requires sources to already be collected via research-company.
allowed_tools: Read, Write, Edit, Glob, Grep, Agent
---

# analyze-company

Read all collected source material for a company and synthesize it into a structured deep dive. This is about understanding the *business and its people* as an investigative journalist would do — not the stock. No valuation, no price targets, no market dynamics.

## Prerequisites

Source material must already exist in `src/research/companies/<company-slug>/sources/` with a `sources.md` index (collected via the `research-company` skill). If sources haven't been collected yet, tell the user and offer to run research first.

## Token Efficiency

Context budget is the binding constraint. Every file read and every line of agent output costs tokens. Be deliberate:
- **Less is more** — a focused read of the right 5 pages beats skimming 50
- **Curate, don't dump** — pick the highest-signal sources for each agent, don't pass everything
- **Agents summarize, main context synthesizes** — agents should return concise structured summaries, not raw extracts

## Workflow

### Step 1 — Survey and curate sources

Read `src/research/companies/<company-slug>/sources/sources.md` to understand what's available. Then **curate** which sources go to each agent — don't pass everything.

**Source selection rules:**
- **Skip 10-Ks when glossy annual reports exist** for the same year — the glossy report contains the shareholder letter + business highlights, which is what we need. The 10-K adds little incremental value.
- **Cap documents per agent** — each agent should receive only what it can meaningfully process:
  - Proxy reader: most recent proxy + 1 older proxy (for change detection)
  - Annual report reader: 2-3 most recent glossy annual reports, 10-K only when there is no glossy annual report available
  - Transcript reader: 2-3 most recent earnings calls + investor day (if available)
  - News reader: company press releases and third-party news articles with interesting headlines only.
- **Shareholder letters and analysis stay in main context** — these are compact and high-signal, no need for sub-agents.

### Step 2 — Extract from heavy documents via sub-agents

Spawn four sub-agents in parallel using the pre-defined agents in `.claude/agents/`. Each agent handles a distinct, curated set of sources — no overlap.

| Agent | `subagent_type` | Sources to pass |
|-------|-----------------|-----------------|
| Proxy Reader | `proxy-reader` | Most recent proxy + 1 older proxy |
| Annual Report Reader | `annual-report-reader` | 2-3 most recent glossy annual reports (no 10-Ks) |
| Transcript Reader | `transcript-reader` | 2-3 most recent earnings calls + investor day |
| News Reader | `news-reader` | Company News, third-party news articles |

When spawning each agent, include the **full file paths** of only the curated sources in the prompt.

Each agent returns a structured markdown summary with `[filename, p. X-Y]` citations. Use these citations to spot-check specific pages in Step 4 if anything needs more depth or verification.

### Step 3 — Read analysis and fund letters in main context

In the main context, read only the high-signal sources firsthand:

- **Shareholder letters** — the most valuable primary source for understanding management thinking and priorities
- **Fund letters** — what long-term investors highlight as special (or concerning), often the most insightful sources
- **VIC writeups** — detailed, thesis-driven analysis from experienced investors
- **Deep Substack posts** — thorough independent analysis

After reading, note claims worth verifying against primary sources. Use sub-agent citations to spot-check specific pages.

The annual-report-reader will return **pointers** to shareholder letters (file + page range) rather than reproducing them. Read these pages directly in the main context — shareholder letters are the most valuable primary source for understanding management thinking and should be read firsthand, not through a summary.

### Step 4 — Write the deep dive

Read the template from `.claude/skills/analyze-company/TEMPLATE.md` and synthesize all extracted information into the deep dive. Save to:

```
src/research/companies/<company-slug>/output/deep-dive.md
```

Writing guidance:
- Fill in the YAML frontmatter: `tags` (always include `deep-dive` and `company/<slug>`, add `sector/<sector>` based on the business), `date` (today), `ticker`
- Write with conviction. State what the evidence shows, don't hedge everything with "appears to" and "seems to"
- Use specific numbers, dates, and names — vague summaries are useless
- Include direct quotes from shareholder letters and transcripts when they reveal management thinking
- The "People" section is the heart of this document — detailed portraits of the key 5-10 people who shaped the company, plus an overview table of all directors and officers
- The "Unique Insights" section is what makes this deep dive valuable — Peel out the specifics about this company and it's people, how do they think, what do they value, what do they do differently than others? - the things you'd only learn by reading the primary sources carefully
- Cite sources inline using **relative** markdown links from the output file's location (e.g. `[2024 Annual Report](../sources/ir/2024-annual-report.pdf)`) so links work in Obsidian and other markdown readers

### Step 5 — Review and refine

Re-read the draft against this checklist before presenting to the user.

**The bar:** Could someone who read only this document have an informed conversation with the CEO?

**Content checks:**
- [ ] People portraits are vivid and specific (quotes, decisions, style) — not just resumes
- [ ] Unique Insights section has genuinely surprising, non-obvious details
- [ ] History reads as narrative, not a bullet timeline
- [ ] Competitive advantages are honest — thin moats called out, not inflated
- [ ] Specific numbers, dates, and names throughout — no vague hand-waving
- [ ] Direct quotes from shareholder letters and transcripts where they reveal thinking
- [ ] No generic filler ("operates in the X industry", "provides Y solutions")
- [ ] No redundancy across sections

**Source checks:**
- [ ] All major sources were read and extracted from
- [ ] Gaps are named in Open Questions, not papered over
- [ ] Every claim cites its source via markdown link

**Not in scope (omit entirely):**
- Stock price, valuation, multiples
- Price targets, buy/sell recommendations
- Market sentiment, trading dynamics
- Technical analysis of any kind
