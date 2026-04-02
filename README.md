# Generation Fund

AI-assisted investment research workspace powered by [Claude Code](https://claude.ai/code).

## What is this?

A structured system for collecting and analyzing investment research material using Claude Code skills. The workflow automates the tedious parts of fundamental research — finding, downloading, and organizing source material across dozens of sites — so you can focus on thinking.

## How it works

**1. Research a company** — Claude searches across IR websites, earnings transcripts, analyst writeups, fund letters, and news to build a comprehensive source library.

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
- [Claude Code](https://claude.ai/code)
- [`playwright-cli`](https://github.com/anthropics/playwright-cli) on PATH

## Project Structure

```
.claude/skills/           # Claude Code skills (research-company, analyze-company, ...)
src/research/sources/     # Collected source material per company (gitignored)
src/research/output/      # Research output
```

## License

[MIT](LICENSE)
