# Social Growth engine and Fleet Desk

Added 2026-11-01 after the owner's request to reach the Google creator profile threshold (10,000 followers on YouTube, Instagram, X or TikTok, any one platform qualifies) and to run fleet accounts and leads from inside the Control Tower.

## 1. Where the accounts stand today (live reads)

| Platform | Handle | Followers | Source |
|---|---|---|---|
| TikTok | @prestige.oakland | 29 (Oct 26 baseline), 7 posts, 39 to 126 views each | TikTok Log sheet |
| Instagram | @prestigeoakland | not recorded by any agent | Facts doc |
| Facebook Page | Prestige auto repairs & tires Oakland Park | not recorded | Facts doc |
| YouTube | no channel confirmed | 0 | no record |
| X | no account confirmed | 0 | no record |
| LinkedIn | prestigeautorepairs (now connected in Buffer) | not recorded | Buffer |
| Google Business Profile | Oakland Park (now connected in Buffer) | 1,202 reviews | Buffer, Maps |

Reaching 10,000 on one platform from a 29-follower base is a 6 to 12 month program at daily cadence, not a week. The fastest realistic path for a repair shop is **TikTok plus Instagram Reels with the same vertical video**, because exotic and European repair footage travels on those two and both reward volume and consistency. YouTube Shorts is the third output of the same clip and builds the YouTube number for free.

## 2. What the engine will not do

The owner asked for automation that "subscribes other people". Follow-for-follow, mass-following, auto-liking, engagement pods and purchased followers violate the terms of TikTok, Instagram, X and YouTube, get accounts shadow-banned or removed, and produce followers that never book a repair. The engine does not do any of that, and the linter rejects agent prompts that ask for it. Everything below is compliant and works better for a local business.

## 3. The Social Growth engine

**Owner agent: Social Growth Commander** (one lane, replaces the social pieces of Campaign Engine, TikTok Growth and Video Studio scheduling; Video Studio stays the editor and publisher on the Mac).

**Supply, the only real constraint.** The shop produces 3 photos and 1 clip per high-ticket car per day with consent (plates and faces blurred). The Today screen shows the day's count. No supply, no growth; every other step is downstream.

**Daily output, every platform, from one clip:**
- 1 vertical video (30 to 60 s) edited in CapCut: hook in the first 2 seconds (the car, the problem, the number on the invoice or the sound), text overlays, captions, the shop name once, the Sunday fact on Oakland Park posts.
- Posted to TikTok, Instagram Reels, YouTube Shorts, Facebook Reels, and as a GBP video where it fits. X gets a 15 s cut or a photo with one sentence.
- 1 photo carousel on TikTok and Instagram (makes, before and after, bays).
- 3 Stories on Instagram and Facebook (behind the scenes, poll, question box).
- 1 GBP post (Buffer, no phone in text) and 1 LinkedIn post on Tuesday and Thursday (fleet angle).
- Spanish version every other day.

**Series that grow accounts (recurring formats people subscribe to):**
1. "What came in today": the exotic or European car in the bay, 20 seconds.
2. "Why it failed": one part, one cause, one fix (air suspension, oil leak, PDK, coolant). These map to the 32 attack keywords and link to the symptom pages.
3. "Dealer quote vs. our diagnosis": factual, no prices, no competitor names.
4. "Open Sunday": short Sunday-morning clips, the only shop open.
5. "Fleet Friday": a Sprinter or contractor truck, the fleet program in one line.
6. "Ask Max": answers to comments and DMs as 30 s videos (the comment-to-content loop).
7. Spanish Wednesday.

**Engagement the owner does, 20 minutes a day, from the Social screen:** reply to every comment within an hour, answer DMs, comment on 10 local accounts (car clubs, dealers, Cars and Coffee, rental companies, Broward news) with real sentences, duet or stitch 2 relevant local videos a week. This is the compliant version of "go to these platforms and interact" and it is what moves the algorithm.

**Amplification:** boost the best-performing post each week with $10 to $20 on TikTok and Instagram targeted to a 15-mile radius around each shop; collaborate with 2 local accounts a month (exotic rental partners from the B2B list, car clubs, detailers) on a shared video; geotag every post to the shop; use the 32 keywords as spoken words and captions, not only hashtags.

**Measurement (Social screen, weekly):** followers per platform, posts published per platform, views, profile visits, website taps, calls from social (GBP and link-in-bio UTM), best post of the week and why. Target curve for TikTok: 500 by Dec 31, 2,500 by Mar 31, 10,000 by Sep 30, 2027, contingent on daily posting. The Google creator profile is applied for the day one platform crosses 10,000.

**Tools already connected:** Buffer (GBP and LinkedIn today; connect Instagram, Facebook Page, TikTok, YouTube; the free plan allows 3 channels, so the $6 per channel plan is needed), CapCut on the Mac, vidIQ for YouTube titles, thumbnails and keyword scoring, OpusClip for cutting long clips, HeyGen for motion graphics only. Not used: Higgsfield or any AI-generated cars, people or scenes.

**Agent schedule:** Social Growth Commander runs daily 7:30 AM ET in the cloud: reads yesterday's intake, writes the day's post plan (platform, format, hook, caption EN and ES, hashtags, keyword, link) to the `social_posts` table and the Social screen, queues GBP and LinkedIn through Buffer, hands the video and TikTok jobs to Video Studio on the Mac, and records results at 7 PM. It never follows, likes or messages on the owner's behalf.

## 4. Fleet Desk

The B2B Prospecting Engine already holds about 385 prospects, 42 contacted, 1 partner meeting held (Agero) and 0 accounts. The owner wants every account in one place he can read, call from and annotate. The Fleet screen:

- One card per account: company, segment, city, contact, phone, email, fit score, status (researched, emailed, called, meeting, proposal, account, do-not-contact), next step, next date, owner notes, link to the Gmail thread.
- Owner can add an account by hand, change status, write a note, and mark "call today".
- The B2B engine writes new prospects and touches into the same table through the ledger endpoint (today: the owner's notes live in the Tower database and the engine's rows in the sheet, until the engine is repointed).
- Partner programs (Agero, Holman, Enterprise and Merchants through Auto Integrate, Element, Wheels, Openbay, AAA, insurers, GSA, local tow operators) appear as accounts of type "program" with the exact next step and the decision the owner must make, so nothing is signed or discounted by an agent.
- Gmail: each account card links to the Gmail search for its domain so the owner reads the thread in one tap; replies stay in Gmail. A later version imports thread summaries through the Gmail connector.

## 5. Leads Desk

Every lead from the Leads Log, plus anything the owner adds, in one list with source, vehicle, request, phone, shop, minutes waiting, status (new, agent replied, owner call, booked, lost) and notes. Owner marks booked or lost from the phone. Lead Fast Responder keeps writing to the Leads Log until it is repointed to the Tower endpoint.

## 6. What the owner must do for this to start

1. Connect Instagram, Facebook Page, TikTok and YouTube in Buffer (Share and schedule in CapCut too), upgrade Buffer to cover 6 channels.
2. Create the YouTube channel and X account under prestige@prestige.tires if they do not exist; same handle everywhere: prestige.oakland or prestigeautorepairs.
3. Film: 1 clip and 3 photos per high-ticket car, every day, into the Content Inbox.
4. 20 minutes a day of real replies and comments from the Social screen's checklist.
5. Approve the Social Growth Commander prompt (compiled from the template) and retire the overlapping Campaign Engine video slot.
