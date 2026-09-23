# data/

The live state of the house. The dashboard reads these files. After any edit, run:

```bash
node scripts/build.mjs
```

That validates every file and regenerates `dashboard/data.js`. Commit both.

Dates are always `YYYY-MM-DD`. Times are London time, `HH:MM`.

## Files

| File | What it holds |
|---|---|
| `event.json` | Dates, capacity, key deadlines, goals, the five Dubai fixes, open decisions, FX rate |
| `tasks.json` | Every task, with area, due date and status (`todo`, `doing`, `blocked`, `done`) |
| `sponsors.json` | Tiers and slots, plus the sponsor pipeline |
| `guests.json` | Residents, their rooms and charter compliance |
| `programme.json` | The day-by-day programme |
| `experiences.json` | London excursions and their booking status |
| `content.json` | Content targets, metrics and a log of notable posts |
| `budget.json` | Budget lines in GBP: planned, committed, paid |

## Adding a sponsor

Append to `sponsors` in `sponsors.json`:

```json
{
  "id": "acme",
  "name": "Acme Protocol",
  "tier": "programme",
  "owns": "Saga Sessions Night 1",
  "stage": "talks",
  "valueUsd": 15000,
  "contact": "Jane Doe, Head of Ecosystem",
  "nextStep": "Send contract",
  "nextStepDue": "2026-10-05",
  "deliverables": [
    { "title": "Named session, Night 1", "due": "2026-11-15", "done": false }
  ],
  "tags": [],
  "notes": ""
}
```

- `tier`: one of the tier ids (`founding`, `programme`, `experience`)
- `stage`: one of `prospect`, `contacted`, `talks`, `signed`, `paid`, `delivered`, `lost`
- Tag enquiries for the next house with `"tags": ["next-house"]`

## Adding a resident

Append to `guests` in `guests.json`:

```json
{
  "id": "alex",
  "name": "Alex Example",
  "handle": "@alex",
  "room": "01",
  "status": "accepted",
  "charterSigned": true,
  "preferencesReceived": false,
  "dossierSent": false,
  "arrival": { "date": "2026-11-14", "time": "11:20", "flight": "BA123", "airport": "LHR T5" },
  "departure": { "date": "2026-11-20", "time": "14:00", "flight": "", "airport": "LHR" },
  "carBooked": false,
  "commitments": { "posts": 0, "amplify": 0, "studio": 0, "role": 0, "flagship": 0, "dinners": 0 },
  "wantsToMeet": "",
  "notes": ""
}
```

- `room`: a room id from `rooms` (e.g. `"01"`), or `null` if not yet assigned. Each room has a `beds` count, and the build fails if a room is over-assigned. Update `rooms` once the floor plan is confirmed.
- `commitments`: counts done so far. Targets live in `commitmentTargets`.
- **No medical notes, passport numbers or home addresses here.**

## Budget lines

Each line in `budget.json` has `plannedGbp`, `committedGbp` and `paidGbp`. Optional flags:
- `"estimate": true` until a written quote replaces the number
- `"partnerFunded": true` when a sponsor pays for it (including extras they asked for; see `docs/sponsors/terms.md`)

## Logging a notable post

Append to `log` in `content.json`:

```json
{ "date": "2026-11-15", "title": "Night 1 opener clip", "url": "https://x.com/...", "sponsor": "acme", "impressions": 0, "minutesToPost": 95 }
```
