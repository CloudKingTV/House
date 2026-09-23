# Budget

**Envelope: $50–65k all-in** (about £37–48k at 1.34). The plan is set to the midpoint, about **$58k (£43.2k)**, including a 10% contingency.

For comparison, Dubai cost about **$55k** and, without the mistakes, should have cost about **$40k**. London is more expensive, so the plan has less room for error, not more.

Line items live in `data/budget.json` and roll up on the dashboard (planned, committed and paid, against sponsor revenue and the envelope).

- **Costs are in GBP.** Most London suppliers invoice in GBP and add VAT at 20%. Always confirm whether a quote includes VAT.
- **Sponsorship is priced in USD.** The dashboard converts using `fxUsdPerGbp` in `data/event.json`; update that rate when you invoice.

## The plan

| Line | Planned | Notes |
|---|---:|---|
| House: 5 bedrooms, 14–20 Nov | £4,480 | **$6,000 quote.** Vet it before signing (see [house & venue](house-and-venue.md)). |
| Flagship venue | £5,000 | Aim for a **minimum-spend buyout**, so the bar spend doubles as venue hire, or a partner-hosted venue (£0) |
| Resident breakfasts and 3 dinners | £3,500 | Breakfast at the house; the Welcome, Resident and Farewell dinners |
| Flagship night: bar and food | £6,000 | Counts toward the venue's minimum spend. A capped tab plus a partner-sponsored drink. |
| SIA security, flagship night | £2,000 | |
| Production: shooter-editor, photographer, edit | £5,000 | The content lead is in-house. Phone-first plus one mirrorless camera. |
| Studio kit hire, mics, stream | £1,500 | Hire rather than buy |
| Resident welcome kits (8 × £300) | £2,400 | The Welcome Kit is a partner slot |
| Attendee gifts (300 × £8) | £2,400 | A pin plus the field guide card, unless a partner funds more |
| Excursions | £1,500 | Signature experiences should be partner-funded |
| Cars: airport and excursions | £1,500 | |
| House manager and housekeeping | £2,000 | |
| Print, signage, florals | £1,200 | |
| Insurance and licensing | £800 | Public liability; a TEN costs £21, if needed |
| **Contingency (10%)** | £3,928 | Spent only with a decision-log entry |
| **Total** | **£43,208 ≈ $57,900** | |

## Where the money comes from

The draft [packages](../sponsors/packages.md) total **$74,000** if all 12 slots sell. The plan breaks even at about **78% sell-through**, and anything above that is margin or can go back into the guest experience.

## Rules (Dubai lesson #6)

1. **One budget owner.** Nothing is booked or paid without a line in `data/budget.json`.
2. **Written quote first**, with VAT and cancellation terms shown. Pay deposits only against signed contracts.
3. **A weekly budget check** every Monday until the event, and a daily one during the week.
4. **Partner-funded lines are tagged**, so the report shows exactly what each partner paid for.
5. **If a line goes over, another line comes down.** The envelope doesn't move.
