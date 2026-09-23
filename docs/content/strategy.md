# Content strategy: same-day or it didn't happen

## What went wrong in Dubai
The Day 1–7 films were beautiful and slow. By the time they were posted, the Breakpoint conversation had moved on, and nothing tied them to an outcome such as sponsor enquiries, sign-ups or followers.

## The new model

**Speed, volume and a destination.** Post during the conversation, post a lot, and give every post somewhere to send people.

| Layer | What | When | Who |
|---|---|---|---|
| **Live** | Stories, photos and quote posts from sessions; Saga Sessions streamed on X | During | Content lead and residents |
| **Moments** | 20–60s vertical clips with burned-in captions, from sessions, the studio, the door and dinners | **Within 2 h** | Shooter-editors |
| **Daily recap** | A 60–90s recap of the day, plus a photo dump | **Posted by 23:00 each night** | Lead editor |
| **Studio episodes** | 15-min conversations, cut into 3 clips each and a full episode | Clips same day; episodes within 48 h | Studio editor |
| **Threads** | "What we learned at [session]" and partner spotlights | Next morning | Content lead |
| **Hero film** | **One** 2–3 min film of the week | **Within 7 days** | Lead editor |

## The crew

| Role | Count | Kit |
|---|---|---|
| **Content lead / producer**: runs the account, approves and posts, updates the tracker | 1 | Laptop, phone |
| **Shooter-editor**: shoots on a phone and gimbal or a mirrorless camera, edits on site | 2 | Camera, gimbal, wireless lavs, laptop (Premiere/CapCut) |
| **Photographer**: people, the door and dinners; photos delivered to the shared drive nightly | 1 | |
| **Studio operator**: runs the set, records and hands files straight to the editors | 1 (can be a shooter on quiet days) | 2–3 cameras, 3 mics, lights |

**The edit bay:** a desk in the house with power, fast Wi-Fi and a drive. Editors cut there, not in a hotel across town.

## Built before the week (by 30 Oct)
- **Caption style** (font, colours, safe zones) and **lower-third template**
- Intro and outro stingers (≤ 2 s)
- **Quote card template** for photos with a quote
- **Partner mention formats**, approved by each sponsor ahead of time so we never wait on sign-off
- A **shared drive** with a folder per day and per resident, so guests can grab their own clips

## Posting rules
1. Every post tags **the people in it** and **the partner who owns the moment**.
2. **Captions are always on.** Most views are muted.
3. **The first second has to earn the second second.** Lead with the best line, not the logo.
4. Nothing shows the house exterior, the street or a live location (see [security](../planning/risk-and-compliance.md#personal-security-for-residents)).
5. Residents get a **daily content focus** in the nightly briefing and pre-cut assets in their folder. Make it easy to meet the charter.

## Conversion: making content count

Every piece of content does one of three jobs.

| Job | Call to action | Measured by |
|---|---|---|
| **Build the audience** | Follow [@SagaMobileDAO](https://x.com/SagaMobileDAO) | Follower growth, profile visits |
| **Fill the room** | Register for [session] on Luma | Luma registrations per post (UTM links) |
| **Sell the next house** | "Partner with the next SagaDAO House" → link or DM | **Inbound sponsor enquiries** |

- **Pinned post all week:** "SagaDAO House London: the programme, and how to partner with us."
- A simple **"Partner with us" page** (Tally form or Notion) for enquiries, linked in bio.
- **Log every enquiry** in `data/sponsors.json` with stage `prospect` and tag `next-house`.
- The post-event sponsor reports and a public **"By the numbers" post** are the proof we show next time.

## Metrics we track

Keep these in `data/content.json` → `metrics`, updated nightly:
- Posts published (house, residents, partners)
- Median time from moment to post
- Impressions, engagements and video views
- Followers gained
- Luma registrations from content links
- Inbound sponsor enquiries
