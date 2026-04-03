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

Read `src/research/sources/<company-slug>/sources.md` to understand what's available. Assign sources to relevant subagents when or to main-context reading.

### Step 2 — Extract from heavy documents via sub-agents

Spawn three sub-agents in parallel using the pre-defined agents in `.claude/agents/`. Each agent handles a distinct set of sources — no overlap between them.

| Agent | `subagent_type` | Sources to pass |
|-------|-----------------|-----------------|
| Proxy Reader | `proxy-reader` | All proxy statements (DEF 14A) |
| Annual Report Reader | `annual-report-reader` | Glossy annual reports + 10-K filings |
| Transcript Reader | `transcript-reader` | Earnings call + investor day transcripts |

When spawning each agent, include the list of source file paths (full paths) in the prompt so the agent knows which files to read.

Each agent returns a structured markdown summary with `[filename, p. X-Y]` citations. Use these citations to spot-check specific pages in Step 4 if anything needs more depth or verification.

### Step 3 — Read analysis and fund letters in main context

Third-party analysis, fund letters, and news are compact markdown files (5-40K each) and high-signal. Read them directly in the main context:
- Substack posts, SA deep dives, VIC writeups — outside perspectives, including critical ones
- Fund letters — what long-term investors highlight as special (or concerning), these are often the most insightful sources
- News articles — recent developments and corporate actions

After reading, note any claims or details worth verifying against the primary sources. Use the sub-agent citations to spot-check specific pages where needed.

If the subagent found shareholder letters from the CEO or chairman, consider re-reading them as part of the main context, these are very valuable sources for understanding management thinking and priorities.

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
