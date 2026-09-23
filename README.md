# SagaDAO House · London 2026

The operating hub for the SagaDAO House at Solana Breakpoint 2026. Everything we need to plan, sell, host and film the week lives here: the plan, the sponsors, the guests, the programme, the excursions and the content.

| | |
|---|---|
| **House** | Sat 14 Nov – Thu 19 / Fri 20 Nov 2026 (checkout date to confirm) |
| **Breakpoint** | Sun 15 – Tue 17 Nov 2026, Olympia London (Hammersmith Road, W14 8UX) |
| **Residents** | 12 guests staying at the house |
| **Programme audience** | 300+ attendees across the week |
| **Partners** | 12 sponsors (target) |

## The standard

Dubai proved we can throw a party. London has to prove that SagaDAO House is **the place to be seen, to be heard and to be looked after** at Breakpoint. The goal is programming that sponsors want to pay for, content that goes out the same day, and a level of care people notice before they walk through the door.

Read [`docs/vision.md`](docs/vision.md) first, then [`docs/dubai-retro.md`](docs/dubai-retro.md).

## Map of the repo

```
docs/
  vision.md                 What "better than Dubai" means, and how we measure it
  dubai-retro.md            What went wrong last time and the fix for each
  planning/                 Timeline, budget, house & venue, risk & compliance, vendors, decisions
  programme/                Programme strategy and the day-by-day schedule
  sponsors/                 Packages, the sponsor playbook, and one file per partner
  guests/                   House Charter, guest journey, welcome kit, preference form, nightly briefing
  attendees/                The 300+ attendee arrival experience
  experiences/              London excursions and private experiences
  content/                  Same-day content engine, shot list, conversion plan
  concierge/                Service standards, daily runbook, welcome speech, emergency info
  post-event/               Sponsor report and retro templates
data/                       Structured source of truth (JSON) that feeds the dashboard
dashboard/                  The House dashboard (static, no server needed)
scripts/build.mjs           Validates data/ and regenerates dashboard/data.js
```

## The dashboard

Open `dashboard/index.html` in a browser. It works straight from disk; no server or install is needed.

It covers the countdown, this week's tasks, the sponsor pipeline and funding, rooms and charter status, the programme, excursions, content output and budget.

**Updating it:** edit the JSON in `data/`, then run:

```bash
node scripts/build.mjs        # validates data/ and rebuilds dashboard/data.js
```

Commit both the JSON and the regenerated `dashboard/data.js`.

## How we work in this repo

- **Docs are the playbook. `data/` is the live state.** If it has a status, an owner, a date or a number, it belongs in `data/`. If it explains how we do something, it belongs in `docs/`.
- **Decisions go in [`docs/planning/decisions-log.md`](docs/planning/decisions-log.md)** with the date and the reason, so the team can see why, not only what.
- **Keep the repo private.** It will hold guest names, flights, dietary and medical notes, and sponsor pricing. Never commit passport numbers, card details, wallet seeds or home addresses.
- **Lessons go in the retro as they happen.** Add them to [`docs/dubai-retro.md`](docs/dubai-retro.md) whenever you remember something from Dubai.
