#!/usr/bin/env node
// Build the execution plan from keywords/master.json:
//   plan/content-calendar.md   blog + page briefs in attack order (one per weekday)
//   plan/gbp-kit.md            Business Profile services, description, Q&A, post themes per shop
//   plan/site-changes.md       pages to create/update with title tags, schema and internal links
//   plan/backlinks.md          linkable assets and outreach targets per asset
//   plan/plan.json             machine-readable version for the app and for agents
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { lintPrompt, summarize } from './lint-prompt.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const master = JSON.parse(readFileSync(join(root, 'keywords', 'master.json'), 'utf8'));
const facts = JSON.parse(readFileSync(join(root, 'rules', 'facts.json'), 'utf8'));

const attack = master.keywords.filter(k => k.tier === 'A');
const maps = master.keywords.filter(k => k.tier === 'B');
const local = master.keywords.filter(k => k.tier === 'C');

// Attack order: value first (cpc * volume where known), then blogs before pages so AEO content lands early.
const score = k => (k.vol || 50) * (k.cpc || 5) * (k.arena === 'blog' ? 1.3 : 1);
const ordered = [...attack].sort((a, b) => score(b) - score(a));

function nextWeekday(d) { const x = new Date(d); do { x.setDate(x.getDate() + 1); } while ([0, 6].includes(x.getDay())); return x; }
let day = new Date('2026-11-03T12:00:00Z');
const calendar = ordered.map((k, i) => {
  const date = day.toISOString().slice(0, 10); day = nextWeekday(day);
  const brief = {
    order: i + 1, date, keyword: k.kw, arena: k.arena, url: k.page || null,
    title: k.blog || `${k.kw.replace(/\b\w/g, c => c.toUpperCase())} | Prestige Auto Repairs & Tires`,
    h1: k.blog || k.kw,
    answerFirst: `Open with a 40 to 60 word direct answer to "${k.kw}" that names the shop, the make or repair, photo inspection and written estimate, and the 2-year/24,000-mile warranty.`,
    sections: k.arena === 'blog'
      ? ['Symptoms owners notice', 'Causes we see in South Florida heat and humidity', 'How we diagnose (tools, time, photos)', 'Repair options and what changes the scope', 'When to stop driving', 'Both shops and hours (Oakland Park 7 days; Fort Lauderdale Mon to Sat)', '5 FAQs with FAQPage schema (last one: walk-ins, link /get-estimate/)']
      : ['What we do for this make or service', 'Equipment and factory procedures', 'Photo inspection and written estimate process', 'Warranty', 'Shop selector with hours', '5 FAQs with FAQPage schema'],
    schema: k.arena === 'blog' ? ['Article (author Max)', 'FAQPage', 'HowTo where steps exist', 'Speakable', 'VideoObject'] : ['Service', 'FAQPage', 'AutoRepair (both shops)'],
    media: '3 real photos of this repair or make from the Content Inbox, plates blurred; one 45 to 60 second vertical clip (Video Studio) embedded and posted to TikTok, Reels, Shorts and the Oakland Park GBP.',
    internalLinks: ['matching make hub', '/get-estimate/', '/oakland-park-fl/', '/fort-lauderdale-fl/', '/warranty/', 'one related symptom page'],
    spanish: k.es ? `Spanish twin targeting "${k.es}" with hreflang` : 'Spanish twin with hreflang',
    gbp: k.gbp || null,
    backlink: k.backlink || null,
    tracker: 'add to both OpenSEO trackers; weekly AI prompt where listed',
  };
  return brief;
});

// GBP kit per shop
const shops = facts.shops;
const services = [...new Set(master.keywords.map(k => k.gbp).filter(Boolean).filter(g => g.startsWith('service')).map(g => g.replace(/^service( \(ES\))?: /, '')))];
const categories = [...new Set(master.keywords.map(k => k.gbp).filter(Boolean).filter(g => g.startsWith('category')).map(g => g.replace(/^category: /, '')))];
const descriptionFor = (shop) => shop.id === 'oakland-park'
  ? `Independent European, exotic and EV repair in Oakland Park, open 7 days a week from 8 AM to 7 PM. ASE-certified, factory-trained technicians service BMW, MINI, Mercedes-Benz (including Sprinter), Audi, Volkswagen, Porsche, Land Rover, Jaguar, Volvo, Ferrari, Lamborghini, McLaren, Bentley, Rolls-Royce, Maserati, Aston Martin, Tesla and hybrids, plus domestic and Japanese cars. Diagnostics, brakes, A/C, engine and transmission, suspension and air suspension, electrical, tires and alignment, in-house body, paint and glass, pre-purchase inspections, flood and collision repair, and help with insurance and extended-warranty claims. Photo inspections and written estimates before any work. 2-year/24,000-mile warranty on repairs. Walk-ins welcome. Hablamos español. Fleet accounts with priority scheduling and consolidated billing. After-hours key drop box.`
  : `Independent European, exotic and EV repair in Fort Lauderdale, Monday to Saturday 8 AM to 7 PM. ASE-certified, factory-trained technicians service BMW, MINI, Mercedes-Benz (including Sprinter), Audi, Volkswagen, Porsche, Land Rover, Jaguar, Volvo, Ferrari, Lamborghini, McLaren, Bentley, Rolls-Royce, Maserati, Aston Martin, Tesla and hybrids, plus domestic and Japanese cars. Diagnostics, brakes, A/C, engine and transmission, suspension and air suspension, electrical, tires and alignment, in-house body, paint and glass, pre-purchase inspections, flood and collision repair, and help with insurance and extended-warranty claims. Photo inspections and written estimates before any work. 2-year/24,000-mile warranty on repairs. Walk-ins welcome. Hablamos español. Fleet accounts with priority scheduling and consolidated billing.`;
const qa = [
  ['Are you open on Sunday?', shop => shop.id === 'oakland-park' ? 'Yes. Our Oakland Park shop is open 7 days a week, 8 AM to 7 PM, including Sunday. Walk-ins are welcome.' : 'Our Fort Lauderdale shop is open Monday to Saturday, 8 AM to 7 PM. Our Oakland Park shop is open Sunday 8 AM to 7 PM.'],
  ['Do you work on Tesla and hybrids?', () => 'Yes. We service Tesla and hybrid vehicles: brakes, suspension, tires, 12V systems, A/C and diagnostics. High-voltage battery work is assessed case by case after diagnosis.'],
  ['Do you repair Ferrari, Lamborghini and other exotics?', () => 'Yes. We service Ferrari, Lamborghini, McLaren, Bentley, Rolls-Royce, Maserati and Aston Martin with factory-level diagnostic tools, photo inspections and written estimates.'],
  ['What warranty do you offer?', () => 'Repairs carry a 2-year/24,000-mile warranty. Details are on prestige.tires/warranty.'],
  ['Do you speak Spanish?', () => 'Sí. Hablamos español en ambos talleres.'],
  ['Can I drop my car off after hours?', shop => shop.id === 'oakland-park' ? 'Yes. The Oakland Park lot is open 24 hours with a key drop box at the front door; we call you in the morning.' : 'After-hours drop-off is available at our Oakland Park shop (key drop box). Fort Lauderdale accepts vehicles during business hours.'],
  ['Do you offer fleet accounts?', () => 'Yes. Fleet, dealer and commercial accounts get priority scheduling and consolidated billing. Ask for the fleet program at either shop.'],
  ['Do you give estimates before work?', () => 'Yes. Every job starts with a photo inspection and a written estimate before any work is done.'],
  ['Do you do body and paint work?', () => 'Yes. Collision, body, paint and glass are done in-house, including help with insurance claims.'],
  ['Do you repair flood-damaged cars?', () => 'Yes. We inspect, document with photos and repair flood-damaged vehicles and help with the insurance claim.'],
];
const postThemes = ['Make spotlight (real car in the bay)', 'Repair explained (symptom page link)', 'Open 7 days / hours reminder (Oakland Park only)', 'Team and equipment', 'Fleet and Sprinter', 'Spanish post', 'Review spotlight (quote, first name only)'];

const gbpKit = shops.map(shop => ({
  shop: shop.name, address: shop.address, phone: shop.phone, hours: shop.hours,
  primaryCategory: 'Auto repair shop',
  additionalCategories: [...new Set(['Mechanic', 'Car repair and maintenance service', 'Brake shop', 'Transmission shop', 'Auto air conditioning service', 'Auto electrical service', 'Oil change service', 'Tire shop', 'Wheel alignment service', 'Auto body shop', 'Auto glass shop', 'Auto tune up service', 'Car inspection station', ...categories])].slice(0, 9),
  description: descriptionFor(shop),
  services,
  qa: qa.map(([q, a]) => ({ q, a: a(shop) })),
  postRule: facts.gbpPostRule,
  postThemes,
  photoQuota: '20 in week 1, then 5 per week: shop front, bays, lifts, diagnostic tools, team, one per make',
  bookingLink: facts.business.estimateUrl,
  reviewLink: shop.reviewLink,
}));

// Site changes
const siteChanges = {
  create: ordered.filter(k => k.page).map(k => ({ url: k.page, keyword: k.kw, arena: k.arena })),
  titleRules: ['Lead with the repair or make, then the city, then "Prestige Auto Repairs & Tires"', 'Oakland Park pages add "Open 7 Days"', 'Under 60 characters', 'No superlatives or prices'],
  global: ['Organization schema with sameAs to GBP (both), Yelp, RepairPal, Facebook, Instagram, TikTok, YouTube, LinkedIn, Apple Maps, Bing', 'AutoRepair schema per shop with geo, openingHoursSpecification and areaServed', 'llms.txt lists every page in this plan', 'IndexNow on publish', 'Sticky click-to-call bar with the correct shop number', 'Footer line distinguishing the business from other "Prestige" shops'],
  mapsKeywords: maps.map(k => ({ kw: k.kw, vol: k.vol, wonBy: k.gbp })),
  localKeywords: local.map(k => ({ kw: k.kw, vol: k.vol, page: k.page })),
};

// Backlinks
const assets = {};
for (const k of attack.filter(k => k.backlink)) (assets[k.backlink] ||= []).push(k.kw);
const backlinks = Object.entries(assets).map(([asset, kws]) => ({ asset, keywords: kws }));
const standingTargets = ['City of Oakland Park business directory', 'Greater Fort Lauderdale Chamber of Commerce', 'Wilton Manors Business Association', 'Living in Oakland Park', 'PCA Florida region, BMW CCA Everglades, MBCA South Florida chapters', 'Cars and Coffee Fort Lauderdale (sponsor one morning)', 'Local news pieces on flood season (expert quote)', 'Exotic rental and Turo fleet partners (partner page)', 'Insurance agents and body-shop referral lists', 'RepairPal, SureCritic, Carfax, Yelp, BBB, Apple Business Connect, Bing Places (citations with matching NAP)'];

// Lint every generated text through the banned-copy rules
const texts = [...gbpKit.map(g => g.description), ...gbpKit.flatMap(g => g.qa.map(x => x.a)), ...calendar.map(c => c.title)];
const problems = texts.flatMap(t => lintPrompt(t, 'website').filter(f => f.severity === 'error').map(f => ({ text: t.slice(0, 60), ...f })));
if (problems.length) { console.error('Generated copy fails lint:', problems); process.exit(1); }

mkdirSync(join(root, 'plan'), { recursive: true });
const md = [];
md.push(`# Content calendar (attack set, one per weekday from Nov 3)\n`);
for (const c of calendar) md.push(`## ${c.order}. ${c.date} · ${c.keyword} (${c.arena})\n- URL: ${c.url || 'GBP/LSA only'}\n- Title: ${c.title}\n- Open: ${c.answerFirst}\n- Sections: ${c.sections.join('; ')}\n- Schema: ${c.schema.join(', ')}\n- Media: ${c.media}\n- Links: ${c.internalLinks.join(', ')}\n- Spanish: ${c.spanish}\n- GBP: ${c.gbp || 'none'}\n- Backlink: ${c.backlink || 'none'}\n`);
writeFileSync(join(root, 'plan', 'content-calendar.md'), md.join('\n'));

const g = [`# Google Business Profile kit\n\nRule: ${facts.gbpPostRule}\n`];
for (const s of gbpKit) {
  g.push(`## ${s.shop}\n${s.address} · ${s.phone} · ${s.hours}\n\n**Primary category:** ${s.primaryCategory}\n**Additional categories (max 9):** ${s.additionalCategories.join('; ')}\n\n**Description (750 chars max, trim if needed):**\n${s.description}\n\n**Services to add (one per line, with a 300-character description each):**\n${s.services.map(x => '- ' + x).join('\n')}\n\n**Owner Q&A to seed:**\n${s.qa.map(x => `- Q: ${x.q}\n  A: ${x.a}`).join('\n')}\n\n**Post themes (rotate daily):** ${s.postThemes.join(' · ')}\n**Photos:** ${s.photoQuota}\n**Booking link:** ${s.bookingLink}\n**Review link:** ${s.reviewLink}\n`);
}
writeFileSync(join(root, 'plan', 'gbp-kit.md'), g.join('\n'));

const sc = [`# Site changes\n\n## Pages to create or rebuild (attack order)\n${siteChanges.create.map(p => `- ${p.url}  ←  "${p.keyword}" (${p.arena})`).join('\n')}\n\n## Title rules\n${siteChanges.titleRules.map(x => '- ' + x).join('\n')}\n\n## Global\n${siteChanges.global.map(x => '- ' + x).join('\n')}\n\n## High-volume "near me" set (won in Maps and LSA, not pages)\n${siteChanges.mapsKeywords.map(k => `- ${k.kw} (${k.vol ?? 'n/a'}/mo): ${k.wonBy}`).join('\n')}\n\n## Local set (location pages)\n${siteChanges.localKeywords.map(k => `- ${k.kw} (${k.vol ?? 'n/a'}/mo) → ${k.page || 'GBP'}`).join('\n')}\n`];
writeFileSync(join(root, 'plan', 'site-changes.md'), sc.join('\n'));

const bl = [`# Backlinks\n\nRule: drafts only, owner approves every send; no paid links, no link schemes.\n\n## Linkable assets (build these pages first, then pitch)\n${backlinks.map(b => `- ${b.asset}\n  keywords: ${b.keywords.join(', ')}`).join('\n')}\n\n## Standing targets (4 real links a month)\n${standingTargets.map(x => '- ' + x).join('\n')}\n`];
writeFileSync(join(root, 'plan', 'backlinks.md'), bl.join('\n'));

writeFileSync(join(root, 'plan', 'plan.json'), JSON.stringify({ generated: new Date().toISOString().slice(0, 10), calendar, gbpKit, siteChanges, backlinks, standingTargets, counts: { attack: attack.length, maps: maps.length, local: local.length, aiPrompts: master.aiPrompts.length } }, null, 2));
console.log(`plan built: ${attack.length} attack keywords, ${maps.length} maps keywords, ${local.length} local keywords, ${master.aiPrompts.length} AI prompts, ${calendar.length} calendar items`);
