#!/usr/bin/env node
// Roster health check over registry/agents.json.
// Flags: duplicates, same-lane overlaps among enabled tasks, enabled tasks whose last run failed or was
// abandoned, Mac-bound tasks without requireDevice, hourly tasks on expensive models, paused tasks that
// still carry rule-breaking flags, and lane permission grants outside the lane owner.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
export const registry = JSON.parse(readFileSync(join(here, '..', 'registry', 'agents.json'), 'utf8'));

const EXPENSIVE = new Set(['claude-opus-5-5']);
const isHourly = s => /^\S+ \* \* \* \*/.test(s || '') || /^\S+ \d+-\d+ \* \* /.test(s || '');

export function checkRoster(reg = registry) {
  const a = reg.agents;
  const findings = [];
  const enabled = a.filter(x => x.enabled && !x.retired);

  // duplicates by declared duplicateOf
  for (const x of a) if (x.duplicateOf) findings.push({ kind: 'duplicate', agent: x.id, detail: `${x.name} duplicates ${x.duplicateOf}${x.enabled ? ' and is ENABLED' : ''}` });

  // same lane, both enabled, both act (not read-only)
  const byLane = {};
  for (const x of enabled) if (x.acts) (byLane[x.lane] ||= []).push(x);
  for (const [lane, list] of Object.entries(byLane)) if (list.length > 1) findings.push({ kind: 'lane-overlap', agent: list.map(x => x.id).join(','), detail: `${list.length} enabled acting agents in lane "${lane}": ${list.map(x => x.name).join(' | ')}` });

  // enabled but last run bad
  for (const x of enabled) if (['FAILED', 'ABANDONED'].includes(x.lastRun?.status)) findings.push({ kind: 'bad-last-run', agent: x.id, detail: `${x.name}: last run ${x.lastRun.status}${x.lastRun.reason ? ' (' + x.lastRun.reason + ')' : ''}` });

  // needs Mac but not bound
  for (const x of enabled) if (x.needsMac && !x.requireDevice) findings.push({ kind: 'device', agent: x.id, detail: `${x.name} needs the owner's Mac but "Require this computer" is off` });

  // hourly on expensive model
  for (const x of enabled) if (isHourly(x.schedule) && EXPENSIVE.has(x.model)) findings.push({ kind: 'cost', agent: x.id, detail: `${x.name} runs hourly on ${x.model}` });

  // permissions outside lane owner
  const laneOwner = { 'customer-leads': 'mayMessageCustomers', website: 'mayEditSite', ads: 'mayEditAds', reviews: 'mayReplyReviews', master: 'mayManageTasks', b2b: 'mayEmailProspects' };
  for (const x of a.filter(x => !x.retired)) {
    for (const [lane, perm] of Object.entries(laneOwner)) {
      if (x[perm] && x.lane !== lane) findings.push({ kind: 'permission', agent: x.id, detail: `${x.name} (lane ${x.lane}) has ${perm}, which belongs to lane "${lane}"${x.enabled ? '' : ' [paused]'}` });
    }
  }

  // paused but loaded
  for (const x of a.filter(x => !x.enabled && !x.retired)) if (x.riskFlags?.length) findings.push({ kind: 'paused-loaded', agent: x.id, detail: `${x.name} is paused but its prompt still: ${x.riskFlags.join('; ')}` });

  const totals = {
    agents: a.length,
    enabled: enabled.length,
    enabledRecurring: enabled.filter(x => !x.oneShot).length,
    paused: a.filter(x => !x.enabled && !x.retired && !x.oneShot).length,
    oneShot: a.filter(x => x.oneShot).length,
    retired: a.filter(x => x.retired).length,
    byModel: a.reduce((m, x) => ((m[x.model || 'default'] = (m[x.model || 'default'] || 0) + 1), m), {}),
  };
  return { totals, findings };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { totals, findings } = checkRoster();
  console.log('TOTALS', JSON.stringify(totals));
  const byKind = {};
  for (const f of findings) (byKind[f.kind] ||= []).push(f);
  for (const [kind, list] of Object.entries(byKind)) {
    console.log(`\n== ${kind} (${list.length})`);
    for (const f of list) console.log(`  ${f.agent}: ${f.detail}`);
  }
  console.log(`\n${findings.length} finding(s)`);
}
