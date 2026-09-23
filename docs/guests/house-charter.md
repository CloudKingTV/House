# The House Charter

Every resident signs this **before booking flights**. It sets out clearly and generously what they get and what we ask in return. Send it with the invitation; the room is only confirmed once it's signed.

Each guest's compliance is tracked daily in `data/guests.json` and shown on the dashboard. Adjust the numbers below before sending, then keep them identical for everyone.

---

## SagaDAO House London · Resident Charter
**14–20 November 2026 · Solana Breakpoint**

You've been invited to stay at SagaDAO House because of what you build and what you share. This charter explains the week and what we ask of you.

### What the House gives you
- A room at the House near Olympia (private or shared, as confirmed in your invitation), 14–20 November, **complimentary** (market value **£[rate] per night**)
- Airport pickup and drop-off by private car
- Breakfast every day; the Welcome Dinner, Resident Dinners and Farewell Dinner
- A welcome kit, and a personal content pack of your photos and clips from the week
- Priority access to every House session, the flagship night and the London experiences
- Introductions: tell us who you want to meet this week and we'll try to make it happen

### What we ask in return
Your room is complimentary **in exchange for** the commitments below. They're designed to fit around Breakpoint, not replace it.

1. **Be there for the moments that matter:** the Welcome Dinner (Sat 14), the 09:15 morning stand-up (10 minutes, over breakfast) and the Farewell Dinner.
2. **Post daily:** at least **1 original post on X per day** from the House or a House moment, tagging **@SagaMobileDAO**. Suggested angles and assets will be in the shared drive each morning.
3. **Amplify:** repost or quote the House account's featured post each day.
4. **Sit for the House Studio:** one **15-minute recorded conversation** at a time we agree together.
5. **Take a role:** host, speak at or moderate **at least one** House session (a breakfast, a Saga Session, Demo Hour or Office Hours).
6. **Show up for the flagship night:** be present as a host for at least the first two hours.
7. **Let us film you:** you consent to SagaDAO using photos and video of you from the week, now and afterwards, for SagaDAO and partner promotion.

### House rules
- **Never post the address, the street or the front door, and never share a live location.** Post house content after you've left a spot.
- No overnight guests who aren't on the resident list. Daytime guests are welcome if you let the house manager know.
- Quiet hours are **23:30–07:00** inside the house. The neighbours are real people and we'd like to come back.
- Treat staff, crew and the property like you'd want your own treated.
- Keep your devices locked, and don't discuss holdings or wallets on camera.

### If commitments aren't met
We'll check in with you daily; we'd rather help than invoice. But if the commitments above aren't met by the end of the week, the stay becomes billable at **£[rate] per night**, invoiced within 10 days.

### Sign
Name: ______________________ X handle: ______________

Signature: __________________ Date: ______________

---

## Compliance tracking (internal)

For each resident in `data/guests.json` → `charter.commitments`:

| Key | Commitment | Target |
|---|---|---|
| `posts` | Original X posts | 1 × nights at the house |
| `amplify` | Reposts or quotes of the featured post | 1 × days |
| `studio` | Studio sessions recorded | 1 |
| `role` | Programme roles taken | 1 |
| `flagship` | Present at the flagship night | 1 |
| `dinners` | Welcome Dinner and Farewell Dinner attended | 2 |

The content lead updates these each night at the recap.
