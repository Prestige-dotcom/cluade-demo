-- Prestige Control Tower data model (Cloudflare D1 / SQLite)
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS shops (
  id TEXT PRIMARY KEY,              -- 'oakland-park' | 'fort-lauderdale'
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  hours_json TEXT NOT NULL,         -- per-day open/close
  gbp_place_id TEXT,
  gbp_account_email TEXT
);

-- Every inbound contact from every channel. One row per lead.
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY,
  received_at TEXT NOT NULL,        -- ISO, ET stored as UTC
  source TEXT NOT NULL,             -- website|lsa_message|lsa_call|yelp|repairpal|surecritic|facebook_lead|email|phone_missed|sms|b2b
  shop_id TEXT REFERENCES shops(id),
  customer_id INTEGER REFERENCES customers(id),
  name TEXT, phone TEXT, email TEXT,
  vehicle TEXT, request TEXT, language TEXT DEFAULT 'en',
  after_hours INTEGER DEFAULT 0,
  first_agent_reply_at TEXT,
  first_human_reply_at TEXT,
  status TEXT NOT NULL DEFAULT 'new',   -- new|agent_replied|owner_call|booked|closed|lost|do_not_contact
  booked_at TEXT, appointment_at TEXT,
  external_ref TEXT,                -- gmail thread id, LSA lead id, Yelp lead url
  notes TEXT
);
CREATE INDEX IF NOT EXISTS leads_open ON leads(status, received_at);

-- Phone events from Quo (or replacement) webhooks.
CREATE TABLE IF NOT EXISTS calls (
  id INTEGER PRIMARY KEY,
  at TEXT NOT NULL,
  shop_id TEXT REFERENCES shops(id),
  direction TEXT NOT NULL,          -- inbound|outbound
  from_number TEXT, to_number TEXT,
  outcome TEXT,                     -- answered|missed|voicemail|text
  duration_s INTEGER,
  transcript TEXT,
  lead_id INTEGER REFERENCES leads(id)
);

-- Customers and vehicles imported from Mitchell 1 Manager SE exports.
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY,
  mitchell_id TEXT UNIQUE,
  name TEXT, phone TEXT, email TEXT,
  first_visit TEXT, last_visit TEXT,
  lifetime_spend_cents INTEGER DEFAULT 0,
  do_not_contact INTEGER DEFAULT 0,
  do_not_contact_reason TEXT
);
CREATE TABLE IF NOT EXISTS vehicles (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  year INTEGER, make TEXT, model TEXT, vin TEXT, plate TEXT
);
-- Repair orders: the Shop Board.
CREATE TABLE IF NOT EXISTS repair_orders (
  id INTEGER PRIMARY KEY,
  ro_number TEXT UNIQUE,
  shop_id TEXT REFERENCES shops(id),
  customer_id INTEGER REFERENCES customers(id),
  vehicle_id INTEGER REFERENCES vehicles(id),
  opened_at TEXT, promised_at TEXT, closed_at TEXT,
  status TEXT,                      -- booked|waiting|in_bay|parts|ready|picked_up
  total_cents INTEGER,
  declined_work TEXT,               -- text of declined lines, feeds Win-Back
  warranty_until TEXT,              -- 2 years / 24,000 miles
  review_requested_at TEXT
);

-- Reviews across platforms.
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY,
  platform TEXT NOT NULL,           -- google|yelp|repairpal|surecritic|facebook
  shop_id TEXT REFERENCES shops(id),
  external_id TEXT UNIQUE,
  author TEXT, rating INTEGER, body TEXT, posted_at TEXT,
  customer_id INTEGER REFERENCES customers(id),
  draft_reply TEXT, reply_status TEXT DEFAULT 'needs_reply',  -- needs_reply|approved|replied|reported
  replied_at TEXT
);

-- Search Everywhere: rankings, AI answers, first-party search data.
CREATE TABLE IF NOT EXISTS tracked_queries (
  id INTEGER PRIMARY KEY,
  query TEXT NOT NULL, shop_id TEXT REFERENCES shops(id),
  language TEXT DEFAULT 'en', intent TEXT, target_url TEXT, active INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS rank_snapshots (
  id INTEGER PRIMARY KEY,
  query_id INTEGER REFERENCES tracked_queries(id),
  checked_at TEXT NOT NULL, engine TEXT NOT NULL,   -- google_web|google_local_pack|google_maps
  position INTEGER, url TEXT, top_competitor TEXT, source TEXT  -- openseo tracker id
);
CREATE TABLE IF NOT EXISTS ai_answer_checks (
  id INTEGER PRIMARY KEY,
  prompt TEXT NOT NULL, engine TEXT NOT NULL,       -- google_ai_overview|chatgpt|gemini|perplexity|claude
  checked_at TEXT NOT NULL, prestige_named INTEGER, brands_named TEXT, cited_urls TEXT
);
CREATE TABLE IF NOT EXISTS gsc_daily (
  day TEXT, query TEXT, page TEXT, clicks INTEGER, impressions INTEGER, ctr REAL, position REAL,
  PRIMARY KEY (day, query, page)
);
CREATE TABLE IF NOT EXISTS ga4_daily (
  day TEXT, channel TEXT, sessions INTEGER, users INTEGER, calls INTEGER, forms INTEGER, estimates INTEGER,
  PRIMARY KEY (day, channel)
);
CREATE TABLE IF NOT EXISTS backlinks (
  id INTEGER PRIMARY KEY, domain TEXT, url TEXT, status TEXT,   -- opportunity|drafted|sent|live|rejected
  first_seen TEXT, live_at TEXT, owner_action TEXT
);
CREATE TABLE IF NOT EXISTS citations (
  platform TEXT, shop_id TEXT REFERENCES shops(id), url TEXT,
  status TEXT,                      -- missing|wrong|correct|claimed
  wrong_fields TEXT, checked_at TEXT,
  PRIMARY KEY (platform, shop_id)
);
CREATE TABLE IF NOT EXISTS competitors (
  id INTEGER PRIMARY KEY, name TEXT, domain TEXT, city TEXT,
  google_rating REAL, google_reviews INTEGER, notes TEXT, last_checked TEXT
);
CREATE TABLE IF NOT EXISTS competitor_moves (
  id INTEGER PRIMARY KEY, competitor_id INTEGER REFERENCES competitors(id),
  seen_at TEXT, kind TEXT, detail TEXT, source_url TEXT, threat TEXT
);

-- Paid: Google Ads and LSA.
CREATE TABLE IF NOT EXISTS ads_daily (
  day TEXT, account TEXT, campaign TEXT, ad_group TEXT,
  impressions INTEGER, clicks INTEGER, cost_cents INTEGER, calls INTEGER, forms INTEGER, conversions REAL,
  impression_share REAL, PRIMARY KEY (day, account, campaign, ad_group)
);
CREATE TABLE IF NOT EXISTS lsa_leads (
  id INTEGER PRIMARY KEY, received_at TEXT, kind TEXT,   -- message|call
  caller_name TEXT, caller_phone TEXT, job_type TEXT, charged_cents INTEGER,
  dispute_status TEXT, lead_id INTEGER REFERENCES leads(id)
);

-- Agents: registry, runs, ledger, proposals, owner actions.
CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,              -- trig_...
  name TEXT NOT NULL, lane TEXT NOT NULL, schedule TEXT, model TEXT,
  enabled INTEGER, needs_mac INTEGER DEFAULT 0, require_device INTEGER DEFAULT 0,
  may_message_customers INTEGER DEFAULT 0, may_edit_site INTEGER DEFAULT 0,
  may_edit_ads INTEGER DEFAULT 0, may_reply_reviews INTEGER DEFAULT 0, may_manage_tasks INTEGER DEFAULT 0,
  est_cost_per_run_cents INTEGER, prompt_version TEXT, retired INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS agent_runs (
  id INTEGER PRIMARY KEY, agent_id TEXT REFERENCES agents(id),
  fired_at TEXT, finished_at TEXT, status TEXT, failure_reason TEXT, session_id TEXT
);
CREATE TABLE IF NOT EXISTS events (                 -- replaces the Agent Reports sheet
  id INTEGER PRIMARY KEY, at TEXT NOT NULL, agent_id TEXT REFERENCES agents(id),
  status TEXT NOT NULL,             -- OK|PROBLEM|BLOCKED|HOLD
  did TEXT, numbers TEXT, owner_action TEXT, link TEXT
);
CREATE TABLE IF NOT EXISTS proposals (              -- agent proposes, owner approves
  id INTEGER PRIMARY KEY, at TEXT, agent_id TEXT REFERENCES agents(id),
  kind TEXT,                        -- review_reply|negative_keyword|bid|outreach_email|site_edit|gbp_post
  target TEXT, payload TEXT, status TEXT DEFAULT 'pending',   -- pending|approved|rejected|applied
  decided_at TEXT, applied_at TEXT
);
CREATE TABLE IF NOT EXISTS owner_actions (          -- replaces the TOP 10 tab
  id INTEGER PRIMARY KEY, created_at TEXT, rank INTEGER, title TEXT, why_money TEXT,
  owner TEXT, exact_step TEXT, link TEXT, due TEXT, status TEXT DEFAULT 'open', closed_at TEXT
);
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY, at TEXT, actor TEXT, system TEXT,    -- wordpress|google_ads|gbp|yelp|zapier|trigger
  action TEXT, before TEXT, after TEXT, revert_hint TEXT
);
CREATE TABLE IF NOT EXISTS content_intake (
  id INTEGER PRIMARY KEY, at TEXT, shop_id TEXT REFERENCES shops(id), kind TEXT,  -- photo|clip
  drive_file_id TEXT, used_for TEXT
);

-- Social growth and owner desks (added 2026-11-01)
CREATE TABLE IF NOT EXISTS social_accounts (
  platform TEXT PRIMARY KEY,         -- tiktok|instagram|youtube|x|facebook|linkedin|gbp
  handle TEXT, url TEXT, followers INTEGER, target INTEGER DEFAULT 10000, updated_at TEXT
);
CREATE TABLE IF NOT EXISTS social_followers_daily ( day TEXT, platform TEXT, followers INTEGER, PRIMARY KEY (day, platform) );
CREATE TABLE IF NOT EXISTS social_posts (
  id INTEGER PRIMARY KEY, planned_for TEXT, platform TEXT, format TEXT,   -- video|carousel|story|post|short
  series TEXT, keyword TEXT, hook TEXT, caption_en TEXT, caption_es TEXT, hashtags TEXT,
  media_drive_id TEXT, status TEXT DEFAULT 'planned',   -- planned|ready|scheduled|published|skipped
  published_url TEXT, views INTEGER, likes INTEGER, comments INTEGER, profile_visits INTEGER
);
CREATE TABLE IF NOT EXISTS fleet_accounts (
  id INTEGER PRIMARY KEY, company TEXT, segment TEXT, city TEXT, website TEXT, email TEXT, phone TEXT,
  contact TEXT, fit INTEGER, status TEXT,            -- researched|emailed|called|meeting|proposal|account|program|do_not_contact|lost
  next_step TEXT, next_date TEXT, decision TEXT, owner_notes TEXT, call_today INTEGER DEFAULT 0,
  source TEXT, last_touch TEXT, gmail_query TEXT, created_at TEXT, updated_at TEXT
);
