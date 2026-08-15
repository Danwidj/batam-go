# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

- Add durable project-specific notes here as they are discovered through real work.
- No test framework is configured anywhere in this repo (no vitest/jest, no config, no test files, in either `package.json`). Before adding one, confirm the user actually wants that as a new tooling decision rather than adding it silently for a single task.
- The Canva whiteboard "Batam Hackathon" (design ID `DAHSRgYY5Wg`) is the wireframe source for all four tabs (Home, Map, Shop, Stats) — one page, 11 connected screens, no text layer. Read it via Canva MCP `export-design` (png, 6000-8000px wide) rather than trusting any fallback text description handed down secondhand — fallback descriptions in task briefs have been observed to diverge from the real design (e.g. a described "voucher badge" that doesn't actually appear on the POI popup).
- `frontend/src/data/home-mock.js` is a shared mock-data file imported by all four tabs' components. There's no CI here to catch a merge that silently drops another tab's exports (this happened once — see git history around the four tab PRs). When merging or rebasing changes that touch this file, diff it against each tab's imports, not just against the branch you're merging.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
