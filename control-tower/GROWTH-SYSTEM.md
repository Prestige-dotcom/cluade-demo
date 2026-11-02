# Prestige Growth System: final description

Date: 2026-10-30. Built on the Control Tower spec (README.md) plus live demand, Maps and competitor data pulled today. Every number below is from a tool read, not an estimate, unless marked.

---

## 0. The honest frame

"1000% growth" is bounded by bays and technicians, not by marketing. Two shops at roughly 8 bays and 3 to 5 technicians each can absorb about 2 to 3 times today's car count before the constraint becomes hiring and a third location. So the system below is built in two gears:

- **Gear 1 (now to 90 days): fill both shops to capacity with high-ticket work.** Target: 3x booked high-ticket jobs (European, exotic, transmission, engine, collision, fleet) and the Fort Lauderdale shop running as full as Oakland Park.
- **Gear 2 (90 days to 18 months): scale what Gear 1 proves.** Fleet contracts, a third location or extended hours at Fort Lauderdale, technician hiring pipeline, and the brand owning "European and exotic repair, open 7 days" across Broward in Google, Maps and every AI assistant.

Accuracy of action comes from one rule: **nothing runs that is not measured, and nothing is measured in prose.** Every action in this document has a number it moves and a place that number is stored.

---

## 1. What the market actually looks like (live data, today)

### Demand (monthly US search volume, Google Ads data; local share is a fraction)
| Search | Volume | Difficulty | Signal |
|---|---|---|---|
| mechanic near me | 673,000 | 24 | The real river. Won only in Google Maps and LSA, not with pages |
| auto repair near me | 450,000 | 25 | Same |
| bmw mechanic near me | 14,800 | 0 | Brand + near me: Maps and LSA |
| mercedes mechanic near me | 8,100 | 0 | Same |
| european auto repair near me | 6,600 | 1 | Same |
| hybrid repair near me | 2,400 | 0 | Open lane, nobody local owns it |
| mercedes air suspension repair | 1,600 | 0, low competition | National AEO page opportunity; press releases rank today |
| ev repair shop near me | 1,300 | 0 | Open lane |
| car repair fort lauderdale | 720 | 0 | Biggest city term |
| flood damaged car repair | 320 | 0, low competition | Seasonal, news ranks, no shops |
| bmw oil leak repair cost | 210 | 0 | Informational, $8.82 CPC, AI-answer bait |
| independent mercedes mechanic | 170 | 0, $13.71 CPC | Dealer-alternative intent |
| auto repair open sunday near me | 170 | 25 | Only Prestige is open Sunday in the whole top 20 |
| porsche pdk service | 140 | 0, $22 CPC | Highest-value intent on the list |
| bmw repair fort lauderdale, mercedes repair fort lauderdale | 30 each | 0 | The city-modifier pages chase 10 to 30 searches a month each |

**Conclusion.** The 126-page site is aimed at the smallest pool (city-modifier terms of 10 to 50 a month). The large pool ("near me", brand plus "near me") is decided by the Google Maps pack, Local Services Ads and the Business Profile, where Prestige is currently losing despite having the most reviews. The medium pool (symptom and repair-type terms like air suspension, oil leak, PDK, flood) is national, low-competition, and is what AI assistants cite; Prestige has almost none of those pages.

### Google Maps, "european auto repair", searched from Oakland Park (zoom 12)
| Rank | Business | Rating | Reviews | Sunday | Closes |
|---|---|---|---|---|---|
| 1 | Black Horse Automotive (Oakland Park) | 4.9 | 262 | closed | 6 PM, Sat 3 PM |
| 2 | 4 Rings European Autowerx (Oakland Park) | 4.9 | 255 | closed | 5 PM, no Sat |
| 3 | European Authority (Fort Lauderdale) | 5.0 | 17 | closed | 6 PM, no Sat |
| 4 | Prestige European Auto Repair (711 W Broward) | 4.8 | 1,345 | closed | 5:30 PM, no Sat |
| 5 | Prestigious Euro Cars | 4.6 | 197 | closed | 5 PM, no Sat |
| 6 | Autobahn Performance (Oakland Park) | 4.8 | 613 | closed | 6 PM, no Sat |
| 7 | German Auto Masters (Oakland Park) | 5.0 | 88 | closed | 5 PM |
| 8 | Euromotive Inc (Oakland Park, unclaimed) | 4.9 | 50 | closed | 6 PM |
| 20 | **Prestige Auto Repairs & Tires** | 4.8 | 1,202 | **open** | **7 PM, 7 days** |

**Conclusion.** Prestige has the second-largest review count in the market and ranks last. That is not a reviews problem. It is a relevance and prominence problem on the Business Profile itself: the name has no category words, "European" and the brands are not in the profile's services and description the way Google reads them, posts had phone numbers and were rejected, photos are 244 against Autobahn's 426 and Euromotive Performance's 2,585, and the website the profile links to is a slow WordPress site behind a stale CDN. Every competitor above is closed Sunday and most close at 5 or 6 PM. Prestige is the only shop open 7 days until 7 PM. That fact appears nowhere in the ranking signals.

### Google Maps, "bmw repair", searched from the Fort Lauderdale shop
Prestige is not in the top 20. Rank 1 is Prestige European Auto Repair (the other company, 1,345 reviews), which also wins AI answers for "best independent European mechanic". Rank 10 is **"BMW Coding & Diagnostic Services", 2.7 stars, 7 reviews, listed at 930 NE 4th Ave, Fort Lauderdale, your address**, open "7 AM to 2 AM". That listing is either a previous tenant or a hijack. It dilutes your address in Google's index and must be reported or claimed.

### Competitor pattern
Twenty shops in the two map pulls. None open Sunday. Three open Saturday mornings only. Average review count of the top 8 is about 350 (Prestige 1,202). Most have 15 to 200 photos. Several have booking links in the profile (4 Rings, Euromotive Performance, Vertical Automotive). Prestige's profile has no booking link. Jimmy's German owns the Sprinter query with one dedicated page. Autobahn of Boca owns Boca European. Prestige European (the other company) owns the brand-confusion queries.

### Paid
Google Ads Search at about $26 a day produced 213 clicks, $804 and 6 conversions in 30 days ($134 per conversion). LSA at about $1,700 a week produced 2,817 lifetime leads and is reviewed by nobody. Performance Max in the second account has 270,000 impressions at 0.33% CTR with "new tires" in its search themes.

---

## 2. What we are blind to (added to the system)

These are the items no agent, sheet or prompt covers today.

1. **The Maps pack is the business and nobody owns it.** 80 agents, zero whose lane is "Business Profile ranking factors" (categories, services, attributes, Q&A, photos, booking link, review velocity and response, post cadence, hours). Yext posts once a day and that is all.
2. **Fort Lauderdale is invisible.** No Maps presence for brand terms at its own address, a conflicting listing at the same address, GBP under a separate Gmail, no location page, 157 reviews.
3. **Hours are the unused weapon.** Open 7 days to 7 PM, alone in the market, and it is not in the profile description, the ads headlines, the site title tags, or the AI-answer pages.
4. **Review velocity, not review count.** 1,202 reviews with a 56-count of 1-star. Google weights recency. No Mitchell 1 export has ever reached Review Requests, so zero review requests have gone out in the system's life.
5. **Yelp 1.8 and RepairPal 3.8** are what ChatGPT and Perplexity read when Google is tied. Both are untreated.
6. **Search Console and GA4 are connected to nothing.** The system cannot see which queries already bring impressions, so it writes pages blind.
7. **No conversion tracking per channel.** Calls, forms and estimate requests are not key events in GA4, LSA calls have no numbers in any store, and the phone system is dead. Growth cannot be proven.
8. **No AEO/AIO content program for the national symptom queries** (air suspension, oil leaks, PDK, flood, coolant leaks, check-engine codes by brand) with FAQPage, HowTo and Speakable schema, author bylines, real photos and video. These are what AI Overviews and ChatGPT cite.
9. **Entity disambiguation.** Four "Prestige" shops within 15 miles. No Organization schema with `sameAs`, no Wikidata or Crunchbase entity, no consistent brand name across Yelp, RepairPal, BBB, Apple, Bing. AI models conflate you with Prestige European.
10. **Spanish.** Broward is 30%+ Spanish-speaking. Competitors have zero Spanish pages. Prestige has three. No Spanish GBP services, no Spanish LSA ad, no Spanish TikTok.
11. **Video and photo supply.** The single biggest lever for GBP prominence and TikTok reach is real photos per week. Nothing counts them. Owner-dependent.
12. **Fleet and B2B conversion.** 346 prospects researched, 0 contracts, outreach on bounce hold, no fleet landing page application form, government vendor registrations not started.
13. **Agero and insurer tow-in referrals.** Agero wants to send tows. That is inbound high-ticket volume with no marketing cost, blocked on one phone call.
14. **Capacity and hiring.** Technician count caps everything. Hiring posts are blocked by a Facebook login. No capacity number anywhere.
15. **Pricing architecture.** Labor at $150/hour is below the dealer and in line with independents. No tiered packages (pre-purchase inspection, fleet plan, exotic annual service) that could be sold as products in Maps and ads.
16. **Reactivation of the existing base.** Mitchell 1 holds every past customer. Win-Back has never run with data. The cheapest 30% revenue lift in any repair shop is declined work and overdue service reminders to existing customers.
17. **Measurement cadence.** Weekly scorecards with "not found" rows. The system needs daily rank snapshots per shop, weekly AI-answer runs, daily lead counts, and a monthly revenue-by-source number from Mitchell 1.
18. **Token budget and agent sprawl.** 24 lost runs in one day. Fewer, stronger agents with a database beat 80 prompts with sheets.

---

## 3. The final system: eight engines, one tower

Everything below runs through the Control Tower (database, ledger, approvals, roster) described in README.md. Each engine has an owner agent, a weekly number, and the store it writes to.

### Engine 1: Maps Dominance (new lane, highest priority)
Owner: **GBP Commander** (new agent, replaces Yext post, Content Queue drafts and the GBP pieces of Growth Autopilot).
Weekly numbers: Maps rank for 12 tracked searches per shop (OpenSEO local rank grid, 5x5 around each shop), profile actions (calls, directions, website clicks from GBP Performance API), new reviews per week, photos added per week.
Actions in the first 14 days:
- Both profiles: primary category Auto repair shop; add every secondary category competitors use (Mechanic, Brake shop, Transmission shop, Auto air conditioning service, Auto electrical service, Oil change service, Tire shop, Wheel alignment service, Auto body shop, Auto glass shop, Car inspection station, Auto tune up service). Prestige already has 9; fill to the cap.
- Description rewritten around the differentiators Google reads: European and exotic makes by name, EV and hybrid, open 7 days 8 to 7 (Oakland Park), Se habla español, ASE-certified, 2-year/24,000-mile warranty, photo inspections, in-house body paint and glass. No phone numbers in posts.
- Services list: one entry per make and per repair type with 300-character descriptions, in English and Spanish names where Google allows.
- Attributes: women-owned or veteran-owned only if true; wheelchair accessible; appointment required = no; onsite services; language assistance Spanish.
- Booking link on both profiles to /get-estimate/ (Reserve with Google through a partner later).
- Q&A: seed 10 owner questions and answers per profile (Sunday hours, EV, exotic, warranty, Spanish, drop box, fleet, financing not offered, towing not offered, pickup).
- Photos: 20 real photos per profile in week 1 (bays, lifts, diagnostic equipment, each shop front, team, 10 cars by make), then 5 a week from the Content Inbox counter. Geotag and name files with make and city.
- Posts: one a day per profile, no phone or URL in text, CTA button only, city-correct, from a 30-day calendar generated by the engine.
- Reviews: same-day request to every closed repair order (Engine 5) by text with the direct review link; reply to every review within 24 hours (Review Defense stays the replier). Target 15 to 25 new Google reviews a week across both shops, which at current volume is a realistic 1 in 4 customers.
- Fort Lauderdale: report or claim the "BMW Coding & Diagnostic Services" listing at 930 NE 4th Ave; publish the Fort Lauderdale location page and point the GBP website field at it; merge the prestigeauto390@gmail.com profile into the main Google account as an additional owner so agents can read it.
- Spam fighting within the rules: suggest edits on unclaimed or keyword-stuffed competitor listings only where Google's guidelines are clearly violated (no attacks, no fake reports).

### Engine 2: Lead Capture and Speed (Lead Desk)
Owner: **Lead Fast Responder** on the Lead Desk, plus phone webhooks.
Weekly numbers: leads by source, median minutes to first human reply, booked rate, no-reply count at 15 and 60 minutes.
Actions: Quo renewed or replaced by Nov 1 with missed-call text-back on both lines, call recording and transcripts into the ledger; LSA app numbers entered daily by the front desk until the LSA API is wired; RepairPal and SureCritic notices forwarded from prestigeauto44250@gmail.com; Yelp task bound to the Mac; Facebook Lead Ads Zap reconnected; every lead gets a human call within 15 minutes 8 to 7 and a text within 2 minutes after hours. Target: 90% of leads replied within 15 minutes, booked rate from unknown to a measured 35%.

### Engine 3: Search Everywhere (SEO, AEO, GEO, AIO, SXO)
Owner: **Search Everywhere Chief** on the new static site (cut over from WordPress this week; the Chief and the Daily Growth Worker become one lane).
Weekly numbers: Search Console clicks and impressions per page group (brand pages, symptom pages, city pages, Spanish), average position for 60 tracked queries per shop, AI-answer mentions per engine, Core Web Vitals pass rate, pages indexed.
Content program, in priority order:
1. **Symptom and repair pages (AEO/AIO), national intent, low competition**: Mercedes air suspension repair; BMW oil leak repair cost and causes; Porsche PDK service; Range Rover air suspension fault; Audi timing chain; Mercedes check engine codes; Tesla 12V and suspension; hybrid battery diagnosis; flood-damaged car repair steps and insurance; coolant leak by make. Each: direct answer in the first 60 words, FAQPage and HowTo schema, Speakable, author byline (Max, 20 years), real photos, a 60-second vertical video embedded with VideoObject, internal links to the matching make page and both shop pages, Spanish twin. These are the pages ChatGPT, Perplexity and AI Overviews quote.
2. **"Open Sunday" and "open late" pages and titles** for both shops and for Broward. Only Prestige can truthfully claim them.
3. **Make hubs** (BMW, Mercedes, Audi, Porsche, Land Rover, Volvo, Ferrari, Lamborghini, Maserati, Bentley, Tesla) with a shop selector, not 24 thin city variants.
4. **Fort Lauderdale location page** and **Oakland Park location page** with embedded map, hours, photos, reviews feed, and the Sunday fact.
5. **Dealer-alternative comparison page** with a factual checklist, no price claims.
6. **Fleet, Sprinter, rental and dealer reconditioning pages** with an application form (Engine 6).
7. **Spanish versions** of every page above with hreflang.
Technical: llms.txt lists every page above; Organization schema with `sameAs` to GBP, Yelp, RepairPal, Facebook, Instagram, TikTok, YouTube, LinkedIn, Apple Maps, Bing; `AutoRepair` schema per shop with geo, hours and `areaServed`; IndexNow on every publish; weekly Lighthouse; no page over 2.5 s LCP on mobile.
Entity: register the business on Wikidata, Crunchbase, Apple Business Connect, Bing Places, BBB, Foursquare, Nextdoor, Chamber of Commerce with the exact same name, address, phone and description; add the About page line distinguishing Prestige Auto Repairs & Tires from the other Prestige shops.
Backlinks: 4 real links a month from Oakland Park and Fort Lauderdale sources (city business directory, chamber, Living in Oakland Park, car clubs, sponsorship of a Cars and Coffee), each tied to a linkable asset (the independent-mechanic checklist, the flood guide, the Sunday-open fact).

### Engine 4: Paid Precision (Google Ads and LSA)
Owner: **Growth Autopilot** with an approval queue; owner approves bids and budgets in the Tower.
Weekly numbers: cost per booked job by campaign, LSA cost per valid lead, dispute rate, impression share on brand and "near me" terms, search-term waste percentage.
Actions: LSA becomes the primary paid channel with a weekly review of every lead, disputes filed within 48 hours for wrong-service and spam calls, Spanish LSA ads, both shops verified; Search campaign restructured into four ad groups (brand, European makes plus "near me", exotic, high-ticket repair types) with call assets, location assets for both shops, callouts for 7 days and Sunday, Spanish ad group; PMax search themes cleaned of "new tires" and all tire terms; auto-apply recommendations off; backup payment method added; conversion import from the Lead Desk so Google optimizes to booked jobs, not form fills. Budget moves only after four weeks of cost per booked job data.

### Engine 5: Shop Data and Retention (Mitchell 1)
Owner: **Shop Board importer** (job, not an agent) plus Review Requests and Win-Back.
Weekly numbers: closed repair orders, average ticket, declined work dollars, review requests sent, win-back messages sent, reactivated customers, revenue by lead source.
Actions: nightly Mitchell 1 export (customers, vehicles, ROs, invoices, declined jobs) to Drive, imported to the Tower; same-day review text to every closed RO; declined-work follow-up at 7 and 30 days; service-interval reminders by make and mileage; lead source captured on every RO so revenue per channel is real. This engine is the cheapest revenue in the plan and has produced zero to date because the export never happened.

### Engine 6: Fleet, B2B and Referral Partners
Owner: **B2B Prospecting Engine** (resumes Nov 3 under a 3% bounce cap) plus the owner's call list.
Weekly numbers: meetings booked, accounts opened, fleet vehicles under agreement, partner tow-ins received.
Actions: Agero call this week (tow-in referrals at zero marketing cost); 9 government fleet vendor registrations; fleet application form live; segment pages finished (property management, insurer partners, delivery vans, contractor trucks); 5 owner calls a week from the Morning Brief; one in-person visit a week to the top prospect; a fleet service agreement template (priority scheduling, consolidated billing, photo inspections, no discounts).

### Engine 7: Reputation and Entity Defense
Owner: **Review Defense** plus Violations Guard.
Weekly numbers: rating and count per platform, reply time, negative reviews resolved offline, brand-confusion mentions.
Actions: Yelp from 1.8 to 3.5 within 90 days by resolving the 8 low reviews personally, asking satisfied customers who already use Yelp to post (never solicited on Yelp's terms, just the profile link on receipts), and keeping the profile complete; RepairPal from 3.8 to 4.5 by fixing the wrong phone and hours and replying to all 25 reviews; SureCritic feed into the Tower; monthly audit of the four "Prestige" look-alikes and AI-answer mentions; Organization schema and `sameAs` consistency.

### Engine 8: Content and Video Supply
Owner: **Video Studio** and **TikTok Growth** on the Mac, fed by a daily photo quota.
Weekly numbers: real photos captured per shop, clips captured, posts published per platform, TikTok views and profile visits, YouTube Shorts views, GBP photo views.
Actions: front desk shoots 3 photos and 1 clip per high-ticket car with consent (plates blurred), uploads to the Content Inbox; the counter on the Today screen shows the week's quota; Video Studio publishes one vertical video a day to TikTok, Reels, Shorts and GBP; every symptom page gets its video; Spanish captions on alternate days; HeyGen only for motion graphics around real footage.

---

## 4. The keyword and query set the system tracks (per shop, daily)

**Maps and "near me" (won in GBP and LSA):** mechanic near me; auto repair near me; european auto repair near me; bmw mechanic near me; mercedes mechanic near me; audi repair near me; porsche repair near me; range rover repair near me; exotic car repair near me; tesla repair near me; hybrid repair near me; ev repair shop near me; transmission repair near me; auto body shop near me; auto repair open sunday near me; auto repair open now; mecánico cerca de mí; taller mecánico cerca de mí.

**City and shop terms (won with location pages and GBP):** car repair fort lauderdale; auto repair oakland park; bmw repair fort lauderdale; mercedes repair fort lauderdale; european auto repair fort lauderdale; exotic car repair fort lauderdale; sprinter van repair fort lauderdale; fleet vehicle repair broward; auto repair wilton manors; auto repair pompano beach; auto body shop fort lauderdale; car ac repair fort lauderdale; transmission repair fort lauderdale.

**Symptom and repair-type terms (won with AEO pages, cited by AI):** mercedes air suspension repair; bmw oil leak repair cost; porsche pdk service; range rover air suspension fault; audi timing chain replacement; mercedes check engine light causes; tesla suspension repair; hybrid battery replacement near me; flood damaged car repair; coolant leak repair cost; pre purchase inspection exotic car; independent mercedes mechanic; dealer alternative bmw service; best european car repair shop in fort lauderdale.

**AI-assistant prompts (OpenSEO AI tracker, weekly, four engines, expand from 6 to 30):** who services Ferrari and Lamborghini in Fort Lauderdale besides the dealer; best independent BMW mechanic near Fort Lauderdale; European car repair open on Sunday near Oakland Park; independent Mercedes specialist with warranty in Broward; where to fix Range Rover air suspension in South Florida; Tesla repair not at Tesla in Fort Lauderdale; Sprinter van fleet repair Fort Lauderdale; Spanish-speaking European mechanic Fort Lauderdale; who repairs flood-damaged cars in Broward; dealer alternative for Porsche service Fort Lauderdale.

---

## 5. Pinpoint targets and dates

| By | Target | Measured in |
|---|---|---|
| Nov 1 | Phones live (Quo renewed or replaced), chargeback evidence filed, DST duplicate deleted | Tower Today screen |
| Nov 7 | GSC and GA4 connected in OpenSEO; both rank trackers running daily; AI tracker first run; Lead Desk live with Apps Script and Lead Fast Responder writing to it; Mitchell 1 first export imported | Tower Search Everywhere, Lead Desk |
| Nov 14 | Both GBPs rebuilt (categories, services, description, Q&A, booking link, 20 photos each); conflicting listing at 930 NE 4th Ave reported; Fort Lauderdale location page live; static site cut over; the 22 paused agents retired; agent count under 25 | Maps rank grid, roster check |
| Nov 30 | 10 symptom pages live with video and Spanish twins; LSA weekly review running; Search campaign restructured; review requests going out same day; 60+ new Google reviews since Nov 7 | GSC, Ads, GBP Performance |
| Dec 31 | Oakland Park in the Maps top 3 for 8 of 12 tracked searches; Fort Lauderdale in the top 10 for 6 of 12; Prestige named in at least 1 of 4 AI engines for 10 of 30 prompts; leads replied under 15 minutes 90% of the time; booked rate measured and above 35%; Yelp above 3.0; first fleet agreement signed | Tower |
| Mar 31 | Both shops at capacity on high-ticket work (measured as bay utilization from Mitchell 1); revenue by source for every channel; decision on a third location or extended Fort Lauderdale hours and a technician hiring plan | Mitchell 1 import, Tower |

---

## 6. What to stop

- Writing more city-modifier pages (10 to 50 searches a month each) until the Maps pack and symptom pages are done.
- Hourly opus-5-5 agents and the hourly Watchdog.
- Any agent that is paused and carries discounts, SMS campaigns, takedowns or applications: retire them.
- Three Nov 5 Ads reminders and two DST shifts: keep one of each.
- Routine owner emails: everything goes to the Tower, URGENT only by email or push.
- Campaign Engine video slot and the dead TikTok handle.
- Hand-copying leads into sheets.

---

## 7. Owner actions this week (the only ones that unblock the system)

1. Quo: identity verification and Renew, or choose a replacement line, before Nov 1.
2. Chargeback 2626001286: upload evidence before Nov 1.
3. Call Will Elmsebli at Agero to switch on tow-in referrals.
4. OpenSEO: connect Search Console and GA4 in Integrations; add $10 to $20 of credits a month.
5. Google: add the main account as owner on the Fort Lauderdale Business Profile; report the "BMW Coding & Diagnostic Services" listing at your address.
6. Mac: turn on "Require this computer" for Yelp, TikTok, Yext, Video Studio, Growth Autopilot, Review Defense, Violations Guard; keep one Chrome connected and signed in to the Facebook Page admin and LinkedIn.
7. Mitchell 1: export customers, vehicles and closed ROs to the Content Inbox tonight, then nightly.
8. Shoot 20 real photos per shop this week.
9. Confirm the oil-change prices Lead Fast Responder quotes, or tell it to stop.
10. Announce the WordPress to static cut-over so one lane edits the site.

---

## 8. Coverage notes
Keyword volumes are US national from Google Ads data; local volume is a fraction and the "near me" pool is only winnable in Maps and LSA. Two Maps pulls were made (one query per shop) because OpenSEO credits are at about 100; a full 12-query, 5x5 grid per shop is the first job once credits are added. Search Console, GA4 and Mitchell 1 data were not available to read. Competitor review counts and hours are live from Google Maps today.
