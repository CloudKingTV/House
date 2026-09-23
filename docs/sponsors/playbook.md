# Sponsor playbook

## Pipeline stages

Each sponsor lives in `data/sponsors.json` with a `stage`. The dashboard shows the pipeline.

| Stage | Meaning | Exit when |
|---|---|---|
| `prospect` | On the list, not yet contacted | First message sent |
| `contacted` | Outreach sent | They reply |
| `talks` | In conversation, deck shared | Verbal yes and tier agreed |
| `signed` | Agreement signed | Invoice paid |
| `paid` | Funds received | All deliverables done |
| `delivered` | All deliverables done, report sent | |
| `lost` | Declined. Record why in `notes`. | |

**Maths:** 12 signed sponsors will take roughly **30–40 prospects**. Send wave 1 to everyone by 2 Oct.

## Outreach

Keep it short. Write to the decision-maker (marketing lead, head of ecosystem or founder), not a generic inbox.

> **Subject:** SagaDAO House London, one partner slot for [their project]
>
> Hi [Name],
>
> We're running SagaDAO House during Breakpoint London (14–20 Nov): a house of builders and creators, 300+ attendees, and a programme of builder breakfasts, live-streamed sessions and an on-site studio, with same-day content throughout.
>
> I think [their project] should own [specific moment]: [one line on why it fits their narrative right now].
>
> Partners get the moment, the content, and a results report within a week. Deck attached; 15 minutes this week?

## Terms

Every sponsor signs on the [sponsor terms](terms.md): 50% on signing and the balance by 30 Oct, extras billed to the sponsor, and make-good rather than cash refunds. Walk them through it on the call, not just in the PDF.

## After they sign

1. **Within 48 hours:** kickoff call. Confirm deliverables, the people involved, assets, and approvals.
2. **Create their file** from [`_template.md`](_template.md) in `docs/sponsors/partners/`.
3. **Collect assets** by the 23 Oct deadline: logos (SVG), kit items, brand guidelines, speaker names and handles, and approved messaging.
4. **Map every deliverable to a date and a post** in `data/content.json` so nothing is promised without a plan to deliver it.
5. **Weekly update** to the sponsor until the event, and a daily one during the event week.

## During the week

- Each sponsor has **one person on our side** who greets their team, gets them seated and makes the intros they asked for.
- Screenshot every post that features them, as it happens, so the report is half-written by Friday.
- Collect **opt-in leads** from their moment (Luma check-ins for their session).

## After

- **+7 days:** results report ([template](../post-event/sponsor-report-template.md)).
- **+14 days:** a call to review the report and offer first look at the next house.

This is how the house earns future sponsors. The report itself is the sales tool for the next house.
