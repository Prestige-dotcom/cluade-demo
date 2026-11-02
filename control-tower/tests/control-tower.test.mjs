import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { lintPrompt, summarize } from '../scripts/lint-prompt.mjs';
import { compilePrompt, findAgent, facts } from '../scripts/compile-prompt.mjs';
import { checkRoster, registry } from '../scripts/roster-check.mjs';

test('linter catches banned copy, NAP mistakes and lane violations', () => {
  const body = readFileSync(new URL('../examples/bad-body.md', import.meta.url), 'utf8');
  const f = lintPrompt(body, 'social');
  const ids = new Set(f.map(x => x.id));
  for (const want of ['discount', 'free', 'superlative', 'towing', 'dead-handle', 'nap', 'lane:master', 'lane:reviews', 'routine-email']) {
    assert.ok(ids.has(want), `expected finding ${want}, got ${[...ids].join(',')}`);
  }
  assert.equal(summarize(f).ok, false);
});

test('linter allows prices and customer messaging only in the customer-leads lane', () => {
  const body = 'Reply to the customer within 15 minutes. If asked, full synthetic oil change is $99.88. Text the customer the shop address.';
  const asLeads = lintPrompt(body, 'customer-leads');
  assert.equal(asLeads.filter(x => x.severity === 'error').length, 0);
  const asSocial = lintPrompt(body, 'social');
  assert.ok(asSocial.some(x => x.id === 'lane:customer-leads'));
  assert.ok(asSocial.some(x => x.id === 'price'));
});

test('clean body passes and compiles with facts injected', () => {
  const agent = findAgent('lead-fast-responder');
  const body = readFileSync(new URL('../examples/lead-body.md', import.meta.url), 'utf8');
  const out = compilePrompt({ agent, body, minutes: 10 });
  assert.match(out, /SYSTEM RULES v3/);
  assert.match(out, /\(954\) 562-8045/);
  assert.match(out, /closed Sunday/);
  assert.match(out, /@prestige\.oakland/);
  assert.match(out, /only task that messages customers about service/);
  assert.doesNotMatch(out, /\{\{\w+\}\}/, 'no unfilled template variables');
});

test('compiler refuses a body that fails lint', () => {
  const agent = findAgent('campaign-engine');
  assert.throws(() => compilePrompt({ agent, body: 'Post a 20% off coupon on TikTok @prestige.maxx today.' }), /fails lint/);
});

test('registry is consistent', () => {
  const ids = registry.agents.map(a => a.id);
  assert.equal(new Set(ids).size, ids.length, 'unique ids');
  for (const a of registry.agents) {
    assert.ok(facts.lanes[a.lane], `${a.name}: unknown lane ${a.lane}`);
    if (a.duplicateOf) assert.ok(ids.includes(a.duplicateOf), `${a.name}: duplicateOf points to unknown id`);
  }
});

test('roster check finds the known problems', () => {
  const { totals, findings } = checkRoster();
  assert.equal(totals.agents, registry.agents.length);
  const kinds = new Set(findings.map(f => f.kind));
  for (const k of ['duplicate', 'lane-overlap', 'bad-last-run', 'device', 'cost', 'permission', 'paused-loaded']) assert.ok(kinds.has(k), `expected ${k}`);
  assert.ok(findings.some(f => f.kind === 'duplicate' && f.agent === 'trig_01NVzGFmG3JBY94WZr6UUjCH'), 'Nov 5 duplicate reminder flagged');
  assert.ok(findings.some(f => f.kind === 'cost' && f.agent === 'trig_0169rSa2gKcuoeejjDGCUrcQ'), 'hourly opus Lead Fast Responder flagged');
});
