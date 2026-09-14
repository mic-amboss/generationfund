# Generation Fund

AI-assisted investment research workspace with shared instructions and skills for coding agents.

## What is this?

A structured system for collecting and analyzing investment research material using shared agent skills. The workflow automates the tedious parts of fundamental research — finding, downloading, and organizing source material across dozens of sites — so you can focus on thinking.

## How it works

**1. Research a company** — Your agent searches across IR websites, earnings transcripts, analyst writeups, fund letters, and news to build a comprehensive source library.

```
> Research Watsco (WSO)
```

This collects annual reports, 10-Ks, proxy statements, earnings call transcripts, Seeking Alpha analysis, Value Investors Club writeups, Substack deep dives, fund letters, and relevant news — all organized and indexed.

**2. Analyze** — *(coming soon)* Synthesize collected sources into investment analysis.

## Setup

```bash
npm install
```

Requires:
- Node.js 18+
- A coding agent that can read project instructions and run the research tools
- [`playwright-cli`](https://github.com/anthropics/playwright-cli) on PATH

Project instructions live in `AGENTS.md`; each skill has a `SKILL.md` in `.agents/skills/`. Claude Code uses symlinks to the same files. Agents without automatic discovery can read these files explicitly; see the compatibility guidance in `AGENTS.md`.

## Project Structure

```
AGENTS.md                # Shared project instructions (CLAUDE.md links here)
.agents/skills/          # Shared research skills (.claude/skills links here)
.agents/agents/          # Research-agent definitions (.claude/agents links here)
src/research/companies/  # Company sources and output
src/research/industries/ # Industry sources and output
```

## License

[MIT](LICENSE)
