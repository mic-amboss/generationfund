---
name: analyze-company
description: Synthesize collected research sources into a structured company deep dive. Use this skill whenever the user asks to analyze a company, write a deep dive, profile a business, summarize what we know about a company, or wants to understand a business in depth — even if they don't say "analyze" explicitly. Requires sources to already be collected via research-company.
allowed_tools: Read, Write, Edit, Glob, Grep, Agent
---

# analyze-company

Read all collected source material for a company and synthesize it into a structured deep dive. This is about understanding the *business and its people* as an investigative journalist would do — not the stock. No valuation, no price targets, no market dynamics.

## Prerequisites

Source material must already exist in `src/research/sources/<company-slug>/` with a `sources.md` index (collected via the `research-company` skill). If sources haven't been collected yet, tell the user and offer to run research first.

## Workflow

### Step 1 — Survey available sources

Read `src/research/sources/<company-slug>/sources.md` to understand what's available. Identify the most important documents for each section of the deep dive.

### Step 2 — Extract information via sub-agents

The source documents (especially annual reports and proxy filings) are long. Spawn sub-agents to read them and extract only the relevant information. This keeps the main context clean for synthesis.

Spawn these extraction agents in parallel:

**Agent 1 — Business & Financials** (reads: annual reports, 10-Ks, investor day transcripts)
Extract:
- CEO/Chairman shareholder letters (full text — these reveal management thinking)
- Business description and segment breakdown
- Revenue, margin, and growth trajectory (5-year trend)
- Capital allocation philosophy (dividends, buybacks, acquisitions, reinvestment)
- Key strategic initiatives and how they've evolved
- Competitive position as described by management

**Agent 2 — People & Governance** (reads: proxy filings, annual reports, company website via sources)
Extract:
- Full board of directors: name, role, age, tenure, committee memberships, other current/previous notable roles, background
- Full executive team: name, title, tenure, background, previous roles
- CEO/Chairman history — who held the role, when, transitions
- Compensation structure: base, bonus, equity, performance metrics, any unusual arrangements
- Board stock ownership requirements or guidelines
- Any notable departures, additions, or governance changes in last 5 years
- Founder/family involvement and succession dynamics

**Agent 3 — Ownership & Transactions** (reads: proxy filings, analysis, fund letters, news)
Extract:
- Insider ownership: who owns what, changes over time
- Family/founder stakes
- Institutional holders — especially long-term fundamental investors and any activists
- Notable fund managers who have written about the company and their thesis
- Significant insider buying/selling patterns
- Any notable corporate transactions (acquisitions, divestitures, spinoffs)

**Agent 4 — Culture & Peculiarities** (reads: all sources, especially transcripts, analysis, fund letters)
Extract:
- Distinctive management practices or cultural elements
- Unusual compensation or incentive structures
- Anything that makes this company different from peers
- Recurring themes across shareholder letters
- What long-term investors highlight as special about this business
- Management quotes that reveal philosophy or character
- Red flags or concerns raised by analysts/investors

Each agent should return a structured markdown summary with specific facts, names, numbers, and direct quotes where relevant. Instruct agents to cite which source document each piece of information comes from.

### Step 3 — Read analysis and transcripts directly

High-value sources should be read in the main context directly:
- Third-party analysis (Substack posts, SA deep dives, VIC writeups) — these often give a good overview and might include unique insights and opinions, also critical ones
- Fund letters mentioning the company — these often contain the sharpest assessments

### Step 4 — Write the deep dive

Read the template from `.claude/skills/analyze-company/TEMPLATE.md` and synthesize all extracted information into the deep dive. Save to:

```
src/research/output/<company-slug>/deep-dive.md
```

Writing guidance:
- Write with conviction. State what the evidence shows, don't hedge everything with "appears to" and "seems to"
- Use specific numbers, dates, and names — vague summaries are useless
- Include direct quotes from shareholder letters and transcripts when they reveal management thinking
- The "People" section is the heart of this document — detailed portraits of the key 5-10 people who shaped the company, plus an overview table of all directors and officers
- The "Unique Insights" section is what makes this deep dive valuable — Peel out the specifics about this company and it's people, how do they think, what do they value, what do they do differently than others? - the things you'd only learn by reading the primary sources carefully
- Cite sources inline using markdown links (e.g. "[2024 Annual Report](src/research/sources/<company-slug>/ir/2024-annual-report.pdf)") so the reader can dig deeper
- 

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
