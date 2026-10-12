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

**2. Analyze** — Delegate heavy documents to specialized readers, then synthesize their cited summaries with firsthand reading of shareholder letters, fund letters, and scuttlebutt.

```
> Analyze Watsco using the analyze-company skill
```

## Setup

```bash
npm install
```

Requires:
- Node.js 18+
- A coding agent that can read project instructions and run the research tools
- [`playwright-cli`](https://github.com/anthropics/playwright-cli) on PATH

Project instructions live in `AGENTS.md`; each skill has a `SKILL.md` in `.agents/skills/`. Shared reader instructions live in `.agents/agents/`. Codex uses thin TOML adapters in `.codex/agents/`; Claude Code uses symlinks to the shared files. Other agents can load these instructions explicitly through their own tools. See the compatibility guidance in `AGENTS.md`.

Start a new Codex session from this repository after adding or changing adapters so the custom readers are loaded. The analysis skill requests delegation itself; clients without sub-agent support perform the reader tasks sequentially.

## Project Structure

```
AGENTS.md                # Shared project instructions
.agents/skills/          # Shared research skills
.agents/agents/          # Shared research-reader instructions
.codex/agents/           # Codex reader adapters
src/research/companies/  # Company sources and output
src/research/industries/ # Industry sources and output
```

## License

[MIT](LICENSE)
