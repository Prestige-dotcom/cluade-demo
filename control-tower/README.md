# Prestige Control Tower

One place to run Prestige Auto Repairs & Tires: every lead, call, car, customer, agent, ranking, review, ad dollar and competitor, with the rules that keep 80 AI agents honest.

This folder is the specification plus the first working core of the tool: the data model, the agent registry built from the live account, the facts and banned-copy rules, a prompt compiler and linter, a roster health check, and a static dashboard that reads the registry. The spec is written so a builder (human or agent) can start today.

---

## 1. Why this tool exists

Audit of the account on 2026-10-30 found:

| Fact | Evidence |
|---|---|
| 80 scheduled agents, ~32 enabled, 22 paused with rule-breaking prompts intact, 5 stale duplicates | trigger inventory |
| 24 runs lost on Oct 28 to the plan usage cap | Watchdog and Master rows |
| 0 of 24 tracked searches show Prestige; AI answers never name Prestige | Rank Scoreboard, Scorecard |
| Search Console and GA4 connected to nothing; both rank trackers never ran; AI tracker has no runs | OpenSEO live read |
| 19 LSA calls in 48 h with no name or number any agent can read; Yelp unchecked for days; 3 Yelp leads since August unanswered | Leads Log |
| Website leads waited 14 to 20 h because auto-confirmations were counted as replies | Lead Fast Responder rows |
| Mitchell 1 customer and repair-order data reaches the system only when the owner exports a CSV by hand (never happened) | Review Requests and Win-Back rows |
| Phone system (Quo) disabled; numbers deleted Nov 15; no missed-call text-back | TOP 10 row 1 |
| ~20 enabled prompts contradict their own SYSTEM RULES v2 header; 5 tasks edit WordPress, 4 edit Google Ads, 4 reply to reviews | prompt inventory |

Every one of these is a structure problem: no registry, no database, no device routing, no lint, no first-party measurement, no customer data feed. Another agent cannot fix structure. A tool can.

---

## 2. What the Control Tower is

A phone-first owner app with eight screens, one database, one rule engine and a set of feeds. It replaces the Agent Reports sheet, the TOP 10 tab, the Leads Log tab, the hourly Watchdog, the Daily Brief emails and hand-edited prompts.

### 2.1 Screens

| # | Screen | What you see | What you can do | Replaces |
|---|---|---|---|---|
| 1 | **Today** | Money at risk, leads waiting, cars in today, agents failing, one-line actions due today | Tap through to any item | Daily Brief, Evening Wrap, Morning brief artifact |
| 2 | **Lead Desk** | Every inbound lead from every source in one list: website form, Google LSA message and call, Yelp, RepairPal, SureCritic, Facebook Lead Ad, direct email, Quo missed call or text. Source, vehicle, request, shop, minutes since arrival, who replied, booked or not. Red timer at 15 min with no human reply. | Call, Text, Mark booked, Assign to shop, Hand to agent | Leads Log tab, Morning callbacks, URGENT callback emails |
| 3 | **Shop Board** | Cars on the lot and booked today for both shops from Mitchell 1: RO number, customer, vehicle, status (waiting, in bay, parts, ready, picked up), promised time, invoice total, warranty flag | Trigger review request on close, mark declined work for Win-Back, open customer | Mitchell 1 CSV exports that never arrive |
| 4 | **Customers** | One record per customer from Mitchell 1 plus every lead, call, review and message tied to them: vehicles, visit history, lifetime spend, last review, declined work, DO-NOT-CONTACT flag | Search, open, add note, start win-back draft | Scattered Gmail threads and sheet rows |
| 5 | **Search Everywhere** | Rankings per tracked search per shop (Oakland Park, Fort Lauderdale), local pack position, AI answer mentions by engine (Google AI Overview, ChatGPT, Gemini, Perplexity, Claude), Search Console clicks and impressions, GA4 organic sessions and key events, Core Web Vitals, backlinks won, citations fixed, competitor moves | Promote a gap to the Backlog, assign to Chief or Daily Growth Worker | Rank Scoreboard, Scorecard tab, SEO Daily logs |
| 6 | **Paid** | Google Ads (both accounts) and LSA: spend, clicks, calls, form leads, cost per lead by campaign and ad group, impression share, search terms flagged as waste; LSA leads with dispute status | Approve a negative keyword or bid change the agent proposes | Growth Autopilot emails, Nov 5 reminders |
| 7 | **Reputation** | Reviews across Google (both), Yelp, RepairPal, SureCritic, Facebook with sentiment, reply status, Zapier AI draft | Approve a reply, mark a review for policy report, see who to call | Review Defense sheet, Reviews tab |
| 8 | **Agents** | One card per scheduled task: lane, schedule, model, cost per run, last status, last report line, needs-Mac flag, Mac online or offline. Duplicates and lane conflicts flagged. Owner Actions list (the old TOP 10) with owner, due date, exact step, link. Facts & Rules editor. | Pause, resume, re-run, open prompt, close an action, edit a fact and regenerate all prompts | Agent Reports sheet, TOP 10, Watchdog, copy-paste trigger edits |

### 2.2 Rule engine

- **Prompt compiler.** Each agent is `lane + schedule + model + body`. SYSTEM RULES v2, the facts block and the reporting block are injected at build time from `rules/facts.json`. One fact change regenerates every prompt. See `scripts/compile-prompt.mjs`.
- **Linter.** Rejects a body that mentions discounts, "free", "#1", "premier", "dealer-level", towing, loaners, turnaround promises, the dead handle `@prestige.maxx`, the wrong shop phone, prices outside direct replies, or any `create_trigger` / `update_trigger` / `fire_trigger` call by a non-Master agent. Also flags "email the owner" in a routine body and review replies outside Review Defense. See `scripts/lint-prompt.mjs` and `rules/banned.json`.
- **Roster check.** Reads the registry, flags duplicates, same-lane overlaps, enabled tasks with a failed or abandoned last run, Mac-bound tasks without `requireDevice`, and hourly tasks on expensive models. See `scripts/roster-check.mjs`.
- **Ledger.** Append-only `events` table (agent, time, status, numbers, action, link). Agents call one HTTP endpoint instead of appending sheet rows.
- **Health from the source.** A cheap scheduled job reads scheduled-task run status through the API once an hour and writes to `agent_runs`. No LLM involved.
- **Device awareness.** Tasks tagged `needsMac` show amber when the Mac is offline and are not counted as failures.
- **SLA timers.** Lead with no human reply at 15 min: push to owner. 60 min: URGENT. After-hours leads get the quiet-hours rule (7 AM to 9 PM ET).

### 2.3 Feeds (where data comes from)

| Feed | Source | Method | Status today |
|---|---|---|---|
| Website forms and estimate requests | prestige.tires Apps Script | POST to `/api/leads` | Script exists, writes to sheet only |
| Google LSA messages and calls | LSA email notices (names and numbers only in LSA app) | Parse notices; owner pastes LSA caller list daily until API access, or use LSA API via Google Ads API | 19 calls unreadable |
| Yelp leads | Yelp for Business (owner Chrome) | Keep the Mac task; write results to ledger | Blocked in cloud |
| RepairPal, SureCritic bookings | Emails to prestigeauto44250@gmail.com | Forward to prestige@prestige.tires, parse | Forwarding not set |
| Facebook Lead Ads | Zapier | Zap exists, needs Page permission | Draft |
| Phone (missed calls, texts, call log) | Quo (or replacement) webhooks | Webhook to `/api/calls` | Quo disabled |
| Cars, ROs, customers, invoices | Mitchell 1 Manager SE | Nightly CSV export from the shop PC to Drive `Content Inbox/mitchell1/`, imported by a job; later a scheduled report via Mitchell 1 SocialCRM or a reporting export | Never exported |
| Rankings, AI answers, backlinks, SERP competitors | OpenSEO (project 01a881e8) | API; trackers already exist | Credits 145; trackers never run |
| Search Console | Google Search Console | Connect in OpenSEO Integrations, or Search Console API | Not connected |
| GA4 | Google Analytics 4 | Connect in OpenSEO Integrations, or GA Data API | Not connected |
| Google Ads, LSA spend | Google Ads API (Supermetrics connector already attached to agents) | Supermetrics `data_query` daily | Agent-only, no store |
| Google Business Profile (both) | GBP API or Yext (Oakland Park) | GBP Performance API for calls, directions, views | Not pulled |
| Reviews | Zapier GBP Zap (Oakland Park live), Yelp, RepairPal, SureCritic emails | Zap and parsers | Partial |
| Competitors | OpenSEO local SERP, Firecrawl on 8 competitor sites | Weekly job | Daily Watch does it in prose |
| Agent run status | Claude scheduled-task API | Hourly job | Watchdog does it with an LLM |

### 2.4 Architecture

- Cloudflare Pages app living in the `prestige-site` repo under `/admin/` (already exists) so the Daily Growth Worker can ship it with the same `npm run verify` gate.
- Cloudflare D1 (SQLite) for the ledger and operational tables; `schema.sql` here is D1-ready.
- Cloudflare Workers for `/api/*` endpoints and the hourly health and import jobs.
- Cloudflare Access with the owner's Google login; a second role for the front desk (Lead Desk and Shop Board only).
- Push notifications through the existing Claude scheduled-task push channel until the app has its own.
- Agents keep running as Claude scheduled tasks; they just read `rules/facts.json` and write to `/api/events` instead of Sheets.

### 2.5 Build order

1. **Week 1: Lead Desk and ledger.** D1 schema, `/api/leads`, `/api/events`, Lead Desk screen, Apps Script repointed, Lead Fast Responder writes events. Owner can call or text from the phone.
2. **Week 2: Agents screen.** Registry imported, hourly health job, Owner Actions migrated from TOP 10, pause and resume. Retire the hourly Watchdog.
3. **Week 3: Facts and compiler.** `facts.json` becomes the source; regenerate the 32 enabled prompts; delete the 5 duplicates; rename the 22 paused agents RETIRED.
4. **Week 4: Search Everywhere.** Connect GSC and GA4 in OpenSEO, fund credits, run both trackers daily and the AI tracker weekly, import to D1, competitor SERP weekly.
5. **Week 5: Shop Board and Customers.** Mitchell 1 nightly export to Drive, importer, customer merge, review-request and win-back triggers from closed ROs.
6. **Week 6: Paid and Reputation.** Supermetrics daily Ads and LSA pull, GBP Performance API, review feeds unified, approval flows.
7. **Then: phone webhooks** once Quo or its replacement is live; missed-call text-back from the shop line.

---

## 3. The systems you have, system by system

**Google Business Profile.** Oakland Park (4.8, ~1,200 reviews) managed by the main account and posted to daily through Yext 4953742. Fort Lauderdale (4.9, 157) sits under a separate Google account (prestigeauto390@gmail.com), posted to by hand from Content Queue drafts. Google rejected posts with phone numbers in text (rule added Oct 29). GBP Performance data (calls, directions, website clicks) is not pulled anywhere. Fort Lauderdale shows Sunday closed, which is correct.

**Google Search Console.** Property verified for the site owner but connected to no agent and not to OpenSEO. Request-indexing quota is used blind, 10 URLs a day. None of the 24 tracked queries show Prestige; nobody knows which queries already bring impressions.

**Google Analytics 4.** Exists per the Backlog (row 30 asks to confirm key events) but is connected to nothing. Calls, form submits and estimate requests are not measured as key events in any place the agents can read.

**Google Ads.** Two accounts. 654-967-6460 runs Leads-Search-1 at about $26 a day, keywords rebuilt Oct 29 around brand, "best European/exotic" and high-ticket repairs; 213 clicks, $804 and 6 conversions in 30 days. 105-298-1460 holds Performance Max with a "transmission ad" whose search themes include "new tires" and 270k impressions at 0.33% CTR. Auto-apply recommendations is on (23 applied Oct 19 to 25). A pending security request expires Nov 12. Agents operate Ads through your Chrome; no API store.

**Google Local Services Ads.** About $1,700 a week, the largest paid channel. 2,817 total leads in the inbox. No agent reviews performance or disputes bad leads. Caller numbers live only in the LSA app.

**Website.** prestige.tires on WordPress with FlyingCDN (30-day edge cache, no FlyingPress license). The replacement Astro static site is built, tested and deployed on Cloudflare from `Prestige-dotcom/prestige-site` (126 pages, hours fixed Oct 30), but cut-over is not announced, so five agents still edit WordPress. Live site still carries unapproved copy ("Premier", "dealer-level diagnostics without dealership prices", "free estimate", "coordinate a tow").

**Search Everywhere (SEO, AEO, GEO, AIO, SXO).** Chief scores it 7/6/3/6/7. Schema, FAQs and llms.txt exist; llms.txt omits flood, warranty, fleet, Sprinter and city pages. Backlink Builder has 8 opportunities and 0 links won. Citations: 31 listings exist, 19 wrong, about 37 missing (Account Kit built). Yelp 1.8 and RepairPal 3.8 drag trust while Google is 4.8.

**Competition.** Tracked: Black Horse Automotive, Autobahn Performance, Autobahn Auto Center (Boca), Euromotive, Motronix, Southport Auto Repair, Jimmy's German Auto Repair (owns the Sprinter query), Jesse's Garage, TR3 Performance, M-Tech Performance, dealers (BMW, Mercedes, Audi, Porsche, JLR, Ferrari of Fort Lauderdale). Brand confusion risk: Prestige European Auto Services at 711 W Broward (4.8, 1,342) is named in AI answers for "best independent European mechanic". Competitor weaknesses already identified: closed weekends, narrow brand lists, slow sites, no Spanish, few expensive-repair pages.

**AI search.** OpenSEO AI tracker configured for ChatGPT, Gemini, Google AI Overview and Perplexity with 6 prompts, weekly, first run Nov 6. Current state: 0 verified mentions. Press releases and news articles outrank shop pages for several target queries.

**Cloud and agents.** 80 Claude scheduled tasks on one Default cloud environment, 6 on opus-5-5, 22 on sonnet-5-5, 24 on haiku-4-5, 5 on haiku-5-5. Shared memory is about 35 Google files. Zapier Pro handles review intake. Connectors attached to agents: Gmail, Calendar, Drive, Docs, Sheets, Firecrawl, Parallel, OpenSEO, Supermetrics, HubSpot, Buffer, Figma, ElevenLabs, HeyGen, Higgsfield, Floot, Intercom, Semrush, Slack, Notion, BigQuery, vidIQ, OpusClip. Used in practice: Gmail, Sheets, Docs, Drive, Firecrawl, Parallel, Calendar, Chrome on your Mac. Unused: HubSpot, Buffer, Notion, Slack, ElevenLabs, Floot, BigQuery, Semrush (no API units).

**Phones and texting.** Quo disabled, subscription inactive, ID verification pending, numbers deleted Nov 15. No texting service; Hiring Autopilot writes SMS for the front desk to send by hand.

**Customer data.** Mitchell 1 Manager SE holds customers, vehicles, ROs, invoices and declined work. Nothing reads it. Review Requests and Win-Back have produced zero drafts because no export has ever been dropped in the Content Inbox.

**Video and social.** TikTok @prestige.oakland (photo carousels scheduled through Nov 1, then empty), CapCut and HeyGen connected but not authorized to publish, Buffer unused, Campaign Engine drafts posts that you must paste by hand, LinkedIn has no connector.

**Hiring.** Hiring Autopilot emails candidates hourly 8 to 7 (Indeed relay plus website), Hiring Posts posts daily through your Chrome (blocked: Facebook signed in as a personal profile, LinkedIn needs password).

**Compliance and finance.** Both LLCs active, annual reports filed, registered agent Horizon Financial Advisors. Open chargeback $2,365 due Nov 1. FlyingCDN trial converts Oct 31. DMARC at p=none, ready to move to quarantine.

---

## 4. What was missing from your prompt, now added

Your message named: the systems built, competition, master plan, rankings, backlinks, SEO/AEO/AIO and other AI searches, monitoring the agent system, new leads, calls and messages, cars coming in, customer accounts and storage through Mitchell 1, GBP, GA4, GSC, Google Ads, website, competition, AI search, cloud and research. These were not named and are now in the spec:

1. **Phones.** The tool is blind without the shop lines. Missed-call text-back, call log and voicemail transcripts are the first integration after Lead Desk. Decision needed by Nov 1: renew Quo or replace it.
2. **Local Services Ads as its own channel.** It is your biggest paid spend and nothing reviews it. The Paid screen treats LSA as a first-class source with dispute tracking.
3. **Reviews and reputation across five platforms,** not only Google. Yelp 1.8 and RepairPal 3.8 are the trust leak AI answers pick up.
4. **Citations and listings (NAP).** 19 wrong and 37 missing listings feed every AI engine wrong data. The Search Everywhere screen tracks citation health per platform.
5. **Core Web Vitals and site health** from the new static site's "Check site" workflow and Lighthouse, surfaced next to rankings.
6. **Conversion measurement.** GA4 key events for calls, forms and estimates, click-to-call tracking on both numbers, and which number is tracked after the phone migration. Without this, every ranking win is unprovable.
7. **Two-shop separation everywhere.** Rankings, GBP, reviews, leads and hours are per shop. Fort Lauderdale is a second business in Google's eyes and today has almost no coverage.
8. **Spanish.** The Broward Spanish market is large and under-served by competitors; the Search Everywhere screen tracks Spanish queries and pages separately.
9. **Fleet and B2B pipeline** as a revenue line: B2B Prospects (346), Partner Network (Agero), government vendor registrations, meetings. Lead Desk gets a B2B lane with its own SLA.
10. **Hiring** as a monitored pipeline: candidates, interviews, posts, since technician capacity caps everything else.
11. **Compliance and money calendar:** chargebacks, subscriptions, annual reports, DBA, tax receipts, ad account security requests, with due dates on the Today screen.
12. **Content supply.** Real photos and clips are the bottleneck for TikTok, GBP, video and ads. A simple intake counter ("photos this week per shop") on Today.
13. **Token and run budget.** Model, frequency and cost per agent, with a weekly cap, so Oct 28 does not repeat.
14. **Device routing and the one-Chrome rule** as a visible state, not an email.
15. **Rule enforcement as code,** not prose: linter, compiler, roster check, DO-NOT-CONTACT list honored by every feed.
16. **Approvals.** Agents propose (reply, negative keyword, bid, review response, outreach email); you approve with one tap. The current system either acts unattended or emails you a paragraph.
17. **Audit trail.** Who or which agent changed what, when, with a revert path. Today changes to WordPress, Ads and GBP are reconstructed from prose rows.
18. **Customer privacy.** Mitchell 1 data contains PII. The tool stores it in D1 under Cloudflare Access, never in prompts, Sheets or Docs. Candidate PII leaves prompts (two old hiring tasks hard-code names and phones).
19. **Retirement path for the old system.** Each screen names the sheet, tab or email it replaces, and the week it is switched off.

---

## 5. This folder

```
control-tower/
  README.md                this spec
  schema.sql               D1 / SQLite data model
  registry/agents.json     all 80 scheduled agents from the live account, with lane, model, flags
  rules/facts.json         structured CORE FACTS (identity, claims, not-approved, lanes)
  rules/banned.json        banned copy patterns used by the linter
  templates/agent.md       prompt template the compiler fills
  scripts/compile-prompt.mjs   build a full prompt from facts + lane + body
  scripts/lint-prompt.mjs      reject a prompt body that breaks the rules
  scripts/roster-check.mjs     duplicates, overlaps, failed enabled runs, device and cost flags
  tests/                   node:test coverage for the three scripts
  app/index.html           static Agents dashboard reading registry/agents.json
```

Run:

```
cd control-tower
npm test
node scripts/roster-check.mjs
node scripts/lint-prompt.mjs examples/bad-body.md
node scripts/compile-prompt.mjs lead-fast-responder examples/lead-body.md
npx serve app   # or open app/index.html
```
