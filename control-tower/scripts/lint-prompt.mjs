#!/usr/bin/env node
// Lint an agent prompt body against rules/banned.json.
// Usage: node scripts/lint-prompt.mjs <file.md> [--lane <laneId>]
// Exits 1 on any error-level finding. Also exported as lintPrompt(body, lane, rules).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
export const defaultRules = JSON.parse(readFileSync(join(here, '..', 'rules', 'banned.json'), 'utf8'));

function findAll(text, pattern) {
  const re = new RegExp(pattern, 'gi');
  const hits = [];
  let m;
  while ((m = re.exec(text)) && hits.length < 20) {
    const line = text.slice(0, m.index).split('\n').length;
    hits.push({ line, match: m[0] });
    if (m[0].length === 0) re.lastIndex++;
  }
  return hits;
}

export function lintPrompt(body, lane = null, rules = defaultRules) {
  const findings = [];
  const add = (id, severity, why, hits) => hits.forEach(h => findings.push({ id, severity, why, ...h }));

  for (const r of rules.alwaysBanned) add(r.id, r.severity || 'error', r.why, findAll(body, r.pattern));
  for (const r of rules.napCheck.wrongPairs) add('nap', 'error', r.why, findAll(body, r.pattern));
  for (const r of rules.laneOnly) {
    if (lane === r.lane) continue;
    add(`lane:${r.lane}`, 'error', r.why, findAll(body, r.pattern));
  }
  add('routine-email', 'error', rules.routineEmail.why, findAll(body, rules.routineEmail.pattern));
  if (!rules.pricesOutsideReplies.allowedLanes.includes(lane)) {
    add('price', 'warn', rules.pricesOutsideReplies.why, findAll(body, rules.pricesOutsideReplies.pattern));
  }
  return findings;
}

export function summarize(findings) {
  const errors = findings.filter(f => f.severity === 'error').length;
  const warns = findings.length - errors;
  return { errors, warns, ok: errors === 0 };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [file, ...rest] = process.argv.slice(2);
  if (!file) { console.error('usage: lint-prompt.mjs <file.md> [--lane <laneId>]'); process.exit(2); }
  const laneIdx = rest.indexOf('--lane');
  const lane = laneIdx >= 0 ? rest[laneIdx + 1] : null;
  const body = readFileSync(file, 'utf8');
  const findings = lintPrompt(body, lane);
  for (const f of findings) console.log(`${f.severity.toUpperCase()} line ${f.line} [${f.id}] "${f.match}": ${f.why}`);
  const s = summarize(findings);
  console.log(`\n${s.errors} error(s), ${s.warns} warning(s)`);
  process.exit(s.ok ? 0 : 1);
}
