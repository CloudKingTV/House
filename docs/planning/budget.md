# Budget

Line items live in `data/budget.json` and roll up on the dashboard (planned, committed and paid, against sponsor revenue).

- **Costs are in GBP.** Most London suppliers invoice in GBP and add VAT at 20%. Always confirm whether a quote includes VAT.
- **Sponsorship is priced in USD.** Crypto partners think in USD and often pay in USDC. The dashboard converts using `fxUsdPerGbp` in `data/event.json`; update that rate when you invoice.

## Starting envelope

These are planning estimates for a week in Kensington during Breakpoint. Replace each one with a real quote as soon as you have it.

| Category | Low | High | Notes |
|---|---:|---:|---|
| House (6 nights, 12 beds, event-capable) | £25,000 | £60,000 | Breakpoint-week premium; event permission costs extra |
| Flagship venue (if separate) | £0 | £20,000 | £0 if the house can host it legally |
| Catering (residents' breakfasts and dinners, session food) | £8,000 | £15,000 | |
| Flagship night: food and bar | £12,000 | £25,000 | 300 guests; licensed bar company |
| Security: SIA door staff and overnight | £3,000 | £7,000 | Two nights of events plus overnight residence cover |
| Production: crew, kit, edit | £10,000 | £18,000 | Two shooter-editors, a photographer and a producer |
| Studio and AV / streaming | £3,000 | £8,000 | Podcast set, mics, lighting, stream encoder, Wi-Fi |
| Resident welcome kits (12) | £3,000 | £6,000 | £250–£500 per kit |
| Attendee gifts (300) | £4,500 | £9,000 | £15–£30 per gift; quality over quantity |
| Excursions and private experiences | £5,000 | £15,000 | Some can be sponsor-funded |
| Chauffeur and transport | £2,500 | £5,000 | Airport runs, the Olympia shuttle and excursions |
| House staff: manager, concierge, housekeeping | £4,000 | £8,000 | |
| Print, signage, florals, styling | £2,000 | £5,000 | |
| Insurance and licensing | £500 | £2,000 | Public liability; TEN is £21 each |
| Contingency (10%) | | | Always carry it |

## Rules

1. **Nothing is committed without a line in `data/budget.json`.**
2. **Sponsor-funded lines are tagged.** If a partner pays for the kit or an excursion, record it so the report can show exactly what they funded.
3. **Pay deposits only against signed contracts.** Get cancellation terms in writing.
