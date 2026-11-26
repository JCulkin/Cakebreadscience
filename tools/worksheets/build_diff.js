#!/usr/bin/env node
/**
 * Node equivalent of tools/worksheets/build_diff.py (for environments where Python is unavailable).
 * Compares every live worksheet (and its _ms.html mark scheme) against a git baseline
 * (default: origin/main) and writes worksheets/diff/data.json + worksheets/diff/base-assets/.
 *
 * Usage:
 *   node tools/worksheets/build_diff.js
 *   node tools/worksheets/build_diff.js --base <commit> --label "before last prompt"
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const WS_DIR = path.join(ROOT, 'worksheets');
const DIFF_DIR = path.join(WS_DIR, 'diff');
const BASE_ASSETS_DIR = path.join(DIFF_DIR, 'base-assets');

const SUBJECTS = [
  ['biology', 'Biology'],
  ['chemistry', 'Chemistry'],
  ['physics', 'Physics'],
  ['maths', 'Maths'],
  ['cross-curricular', 'Cross-curricular'],
];

function gitShow(ref, relPath) {
  try {
    return execFileSync('git', ['-C', ROOT, 'show', `${ref}:${relPath}`], {
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return null;
  }
}

function gitRevShort(ref) {
  try {
    return execFileSync('git', ['-C', ROOT, 'rev-parse', '--short', ref], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return ref;
  }
}

function gitLsWorksheets(ref) {
  try {
    const out = execFileSync('git', ['-C', ROOT, 'ls-tree', '-r', '--name-only', ref, 'worksheets'], {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return new Set(
      out
        .split(/\r?\n/)
        .map(l => l.trim().replace(/\\/g, '/'))
        .filter(l => l.endsWith('.html'))
    );
  } catch {
    return new Set();
  }
}

function normHtml(s) {
  return s ? s.replace(/\s+/g, ' ').trim() : '';
}

function cleanPreviewHtml(s) {
  if (s === null || s === undefined) return null;
  return s.replace(
    /<script\b[^>]*src=["'][^"']*(?:home-link|auth-gate|account|sheet-links)\.js["'][^>]*>\s*<\/script>/gi,
    ''
  );
}

function extractTitle(html, fallback) {
  const m = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<title>([\s\S]*?)<\/title>/i);
  if (!m) return fallback;
  const t = m[1]
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/\s+/g, ' ')
    .trim();
  return t || fallback;
}

function extractSpec(html) {
  const m = html.match(/class="(?:ps-spec|spec-ref)"[^>]*>([\s\S]*?)<\/div>/i);
  if (!m) return '';
  return m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 120);
}

function tierOf(relUnderWs) {
  if (relUnderWs.includes('/ks3/')) return 'KS3';
  if (relUnderWs.endsWith('_sa.html')) return 'KS4 · Single Award';
  if (relUnderWs.includes('/ks4/')) return 'KS4';
  return 'Sheet';
}

function countPages(html) {
  if (!html) return 0;
  return (html.match(/<div\b[^>]*class=["'][^"']*\bpage\b/gi) || []).length;
}

function snapshotBaseAssets(baseRef) {
  fs.mkdirSync(BASE_ASSETS_DIR, { recursive: true });
  const changed = {};
  for (const name of ['print-sheet.css', 'biology.css', 'chemistry.css', 'physics.css', 'maths.css']) {
    const rel = `css/${name}`;
    const oldTxt = gitShow(baseRef, rel);
    const curP = path.join(ROOT, rel);
    const curTxt = fs.existsSync(curP) ? fs.readFileSync(curP, 'utf8') : null;
    const normEol = s => (s === null ? null : s.replace(/\r\n/g, '\n'));
    changed[name] = oldTxt !== null && normEol(oldTxt) !== normEol(curTxt);
    if (oldTxt !== null) {
      fs.writeFileSync(path.join(BASE_ASSETS_DIR, name), oldTxt, 'utf8');
    }
  }
  return changed;
}

function archivedSet() {
  const arch = path.join(WS_DIR, 'archive.html');
  if (!fs.existsSync(arch)) return new Set();
  const txt = fs.readFileSync(arch, 'utf8');
  const set = new Set();
  for (const m of txt.matchAll(/href="((?:biology|chemistry|physics|maths|cross-curricular)\/[^"#?]+\.html)"/g)) {
    set.add(m[1]);
  }
  return set;
}

function walkHtml(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function parseArgs(argv) {
  let base = 'origin/main';
  let label = null;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--base' && argv[i + 1]) base = argv[++i];
    else if (argv[i] === '--label' && argv[i + 1]) label = argv[++i];
  }
  return { base, label };
}

function main() {
  const args = parseArgs(process.argv);
  const baseLabel = args.label || (args.base === 'origin/main' || args.base === 'main' ? 'live main' : args.base);
  fs.mkdirSync(DIFF_DIR, { recursive: true });
  const assetChanged = snapshotBaseAssets(args.base);
  const archived = archivedSet();

  const curSheets = new Set();
  for (const [sid] of SUBJECTS) {
    for (const full of walkHtml(path.join(WS_DIR, sid))) {
      const rel = path.relative(ROOT, full).replace(/\\/g, '/');
      const subRel = rel.slice('worksheets/'.length);
      if (subRel.endsWith('_ms.html') || archived.has(subRel)) continue;
      curSheets.add(rel);
    }
  }

  const baseAll = gitLsWorksheets(args.base);
  const baseSheets = new Set();
  for (const r of baseAll) {
    if (SUBJECTS.some(([sid]) => r.startsWith(`worksheets/${sid}/`)) && !r.endsWith('_ms.html')) {
      if (!archived.has(r.slice('worksheets/'.length))) baseSheets.add(r);
    }
  }

  const subjNames = Object.fromEntries(SUBJECTS);
  const allRels = [...new Set([...curSheets, ...baseSheets])].sort();
  const items = [];

  for (const rel of allRels) {
    const subRel = rel.slice('worksheets/'.length);
    const sid = subRel.split('/')[0];
    const msRel = rel.slice(0, -5) + '_ms.html';

    const curP = path.join(ROOT, rel);
    const curMsP = path.join(ROOT, msRel);
    const newHtml = fs.existsSync(curP) ? fs.readFileSync(curP, 'utf8') : null;
    const newMs = fs.existsSync(curMsP) ? fs.readFileSync(curMsP, 'utf8') : null;
    const oldHtml = gitShow(args.base, rel);
    const oldMs = gitShow(args.base, msRel);

    const sheetChanged = normHtml(oldHtml) !== normHtml(newHtml);
    const msChanged = normHtml(oldMs) !== normHtml(newMs);
    const cssAffected = Boolean(assetChanged['print-sheet.css'] || assetChanged[`${sid}.css`]);
    if (!sheetChanged && !msChanged && !(cssAffected && newHtml && oldHtml)) continue;

    let kind = 'changed';
    if (oldHtml === null && newHtml !== null) kind = 'added';
    else if (newHtml === null && oldHtml !== null) kind = 'removed';

    const refHtml = newHtml || oldHtml || '';
    const stem = path.basename(rel, '.html');
    const title = extractTitle(refHtml, stem);
    const spec = extractSpec(refHtml);
    const underReview = Boolean(newHtml && /under\s+review|review-chip/i.test(newHtml));
    const baseUrl = '/' + rel.slice(0, rel.lastIndexOf('/')) + '/';

    items.push({
      id: subRel.slice(0, -5).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      subject: sid,
      subjectName: subjNames[sid] || sid,
      tier: tierOf(subRel),
      path: subRel,
      url: '/' + rel,
      msUrl: newMs || oldMs ? '/' + msRel : null,
      baseUrl,
      title,
      spec,
      kind,
      underReview,
      sheetChanged: sheetChanged || cssAffected,
      msChanged,
      oldPages: countPages(oldHtml),
      newPages: countPages(newHtml),
      hasMs: Boolean(newMs || oldMs),
      oldHtml: cleanPreviewHtml(oldHtml),
      newHtml: cleanPreviewHtml(newHtml),
      oldMsHtml: cleanPreviewHtml(oldMs),
      newMsHtml: cleanPreviewHtml(newMs),
    });
  }

  const out = {
    baseRef: args.base,
    baseLabel,
    baseCommit: gitRevShort(args.base),
    headCommit: gitRevShort('HEAD'),
    assetChanged,
    sheets: items,
  };

  const dataPath = path.join(DIFF_DIR, 'data.json');
  const dataText = JSON.stringify(out);
  fs.writeFileSync(dataPath, dataText, 'utf8');

  const counts = {
    changed: items.filter(x => x.kind === 'changed').length,
    added: items.filter(x => x.kind === 'added').length,
    removed: items.filter(x => x.kind === 'removed').length,
  };
  console.log(
    `Wrote worksheets/diff/data.json (${(dataText.length / 1024).toFixed(1)} KB) · ${items.length} worksheets changed vs ${baseLabel} (${out.baseCommit}) ${JSON.stringify(counts)}`
  );
}

main();
