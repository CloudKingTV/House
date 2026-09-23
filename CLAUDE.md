# CLAUDE.md

This repo is the planning hub for **SagaDAO House London** (Solana Breakpoint 2026: house open 14–20 Nov, conference 15–17 Nov at Olympia). The owner is running it solo for now; a team will join later.

## Structure
- `docs/`: playbooks and checklists (markdown). How we do things.
- `data/`: the live state (JSON). Status, owners, dates, money. Schemas are in `data/README.md`.
- `dashboard/`: a static dashboard. `index.html`, `styles.css` and `app.js` are hand-written; `data.js` is **generated**.
- `scripts/build.mjs`: validates `data/` and regenerates `dashboard/data.js`. No dependencies; Node 18+.

## Rules
- After editing anything in `data/`, run `node scripts/build.mjs` and commit the regenerated `dashboard/data.js` with it.
- Record decisions in `docs/planning/decisions-log.md` (append; don't rewrite history).
- When the owner shares a memory from the Dubai house, add it under **Raw notes** in `docs/dubai-retro.md` and, if it implies a change, update the relevant playbook.
- Keep the tone premium, warm and direct. Use British spelling in guest-facing copy (London event).
- The budget envelope is **$50–65k all-in** (Dubai cost $55k and should have cost $40k). Flag anything that pushes the plan past it.
- Costs are in GBP; sponsorship is priced in USD. The FX rate is `event.json` → `fxUsdPerGbp`.
- **Privacy:** never commit passport numbers, card details, wallet seeds, home addresses or medical notes. Never put the house address in content-facing docs.
- Anything marked *verify* (venues, hospitals, lead times, prices) is a researched starting point and needs confirming before use.

## Dashboard
- Open `dashboard/index.html` directly in a browser; no server is needed.
- `node scripts/build.mjs --single <out.html>` writes a single-file version (all CSS, JS and data inlined) for sharing or hosting.
- Doc links resolve to `../docs/...` when opened from disk, and to the GitHub `main` branch otherwise.
