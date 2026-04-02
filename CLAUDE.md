# Generation Fund

AI-assisted investment research workspace. Claude Code skills automate the collection and analysis of source material for long-term fundamental investing.

## Project Structure

```
src/research/sources/<company>/   # Collected source material per company (gitignored)
src/research/output/              # Research output (memos, analysis)
.claude/skills/                   # Claude Code skills
```

## Skills

- **research-company** — Collect source material (annual reports, transcripts, analysis, fund letters) for a company. Invoke with any research request mentioning a company name or ticker.

## Dependencies

- Node.js (for extraction scripts): `npm install`
- `playwright-cli` on PATH (browser automation for authenticated content)
- Auth state stored in `.playwright-cli/auth-state.json` (gitignored)

## Conventions

- Source files go in `src/research/sources/<company-slug>/` with a `sources.md` index
- PDFs downloaded via `curl`, web pages extracted via `playwright-cli` + Readability/Turndown
- Research sessions: start `playwright-cli -s=research open --headed`, load auth state, collect sequentially, close when done
