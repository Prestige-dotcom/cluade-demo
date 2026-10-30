#!/usr/bin/env node
// Compile a full agent prompt from rules/facts.json + templates/agent.md + a lane body.
// Usage: node scripts/compile-prompt.mjs <agentId-or-name> <body.md> [--model m] [--schedule cron] [--minutes n] [--mac]
// Refuses to compile if the body fails the linter.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { lintPrompt, summarize } from './lint-prompt.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
export const facts = JSON.parse(readFileSync(join(root, 'rules', 'facts.json'), 'utf8'));
const template = readFileSync(join(root, 'templates', 'agent.md'), 'utf8');
const registry = JSON.parse(readFileSync(join(root, 'registry', 'agents.json'), 'utf8'));

export function findAgent(key) {
  return registry.agents.find(a => a.id === key || a.slug === key || a.name.toLowerCase() === String(key).toLowerCase());
}

export function compilePrompt({ agent, body, model, schedule, minutes = 15, finishLine = '{N} items, 0 messages sent.', eventsEndpoint = 'https://prestige.tires/admin/api/events' }) {
  const lane = facts.lanes[agent.lane] || { owner: agent.name.toUpperCase() };
  const findings = lintPrompt(body, agent.lane);
  const s = summarize(findings);
  if (!s.ok) {
    const err = new Error(`body fails lint: ${s.errors} error(s)`);
    err.findings = findings;
    throw err;
  }
  const shopsBlock = facts.shops.map(sh =>
    `${sh.name}: ${sh.address} — ${sh.phone}. ${sh.hours}.${sh.afterHoursDropBox ? ' After-hours key drop box.' : ' No after-hours drop-off.'} Review link ${sh.reviewLink}`
  ).join('\n');
  const pricesBlock = agent.lane === 'customer-leads'
    ? `Prices allowed ONLY in direct replies to customers who asked: labor $${facts.pricesDirectRepliesOnly.laborPerHour}/hour; oil change conventional $${facts.pricesDirectRepliesOnly.oilChange.conventional}, synthetic blend $${facts.pricesDirectRepliesOnly.oilChange.syntheticBlend}, full synthetic $${facts.pricesDirectRepliesOnly.oilChange.fullSynthetic}, Euro synthetic $${facts.pricesDirectRepliesOnly.oilChange.euroSynthetic}, extra quart $${facts.pricesDirectRepliesOnly.oilChange.extraQuart}. Never in ads, posts, pages or B2B email.`
    : 'Prices: never state any price. If a customer asks, hand the lead to Lead Fast Responder.';
  const vars = {
    compiledAt: new Date().toISOString().slice(0, 10),
    factsVersion: facts.version,
    laneOwner: lane.owner,
    laneOnlyOneThat: lane.onlyOneThat ? ` (the only task that ${lane.onlyOneThat})` : lane.scope ? ` (${lane.scope})` : '',
    eventsEndpoint,
    reportingSheet: facts.reporting.sheetId,
    agentName: agent.name,
    ownerEmail: facts.business.email,
    urgentReasons: facts.reporting.urgentEmailOnly.join('; '),
    quietHours: facts.reporting.quietHoursET,
    backlogSheet: facts.reporting.backlogSheetId,
    deviceNote: agent.needsMac ? 'This task RUNS ON THE OWNER\'S COMPUTER; if Chrome tools are unavailable, stop and report BLOCKED with the exact step.' : 'Cloud only.',
    publicName: facts.business.publicName,
    ownerName: facts.business.owner.name,
    signCustomers: facts.business.owner.signCustomers,
    signCandidates: facts.business.owner.signCandidates,
    website: facts.business.website,
    estimateUrl: facts.business.estimateUrl,
    warrantyUrl: facts.business.warrantyUrl,
    businessStarted: facts.business.businessStarted,
    shopsBlock,
    approvedClaims: facts.approvedClaims.join('; '),
    notApproved: facts.notApproved.join('; '),
    notUs: facts.notUs.join('; '),
    gbpPostRule: facts.gbpPostRule,
    tiktok: facts.business.social.tiktok,
    instagram: facts.business.social.instagram,
    facebook: facts.business.social.facebook,
    deadHandles: facts.business.deadHandles.join(', '),
    pricesBlock,
    laneId: agent.lane,
    model: model || agent.model || 'default',
    schedule: schedule || agent.schedule || 'manual',
    minutes,
    body: body.trim(),
    finishLine,
  };
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in vars ? String(vars[k]) : `{{${k}}}`));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [key, bodyFile, ...rest] = process.argv.slice(2);
  if (!key || !bodyFile) { console.error('usage: compile-prompt.mjs <agentId|slug> <body.md> [--model m] [--schedule cron] [--minutes n]'); process.exit(2); }
  const agent = findAgent(key);
  if (!agent) { console.error(`unknown agent: ${key}`); process.exit(2); }
  const opt = (flag) => { const i = rest.indexOf(flag); return i >= 0 ? rest[i + 1] : undefined; };
  try {
    process.stdout.write(compilePrompt({ agent, body: readFileSync(bodyFile, 'utf8'), model: opt('--model'), schedule: opt('--schedule'), minutes: opt('--minutes') ? Number(opt('--minutes')) : undefined }));
  } catch (e) {
    console.error(e.message);
    for (const f of e.findings || []) console.error(`  ${f.severity} line ${f.line} [${f.id}] "${f.match}": ${f.why}`);
    process.exit(1);
  }
}
