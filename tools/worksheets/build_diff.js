#!/usr/bin/env node
/**
 * Node equivalent of tools/worksheets/build_diff.py (for environments where Python is unavailable).
 * Compares every live printable — Science/Maths worksheets AND Topic Booklets (plus their _ms.html
 * mark schemes, excluding interactive/physics-long-answer) — against a git baseline (default: origin/main)
 * and writes worksheets/diff/data.json + worksheets/diff/base-assets/.
 * Every unchecked printable (not in admin/review-approved.json) is always included so nothing slips
 * past the PRINTABLES tab of /staging-review/.
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
const BOOKLETS_DIR = path.join(ROOT, 'booklets');
const DIFF_DIR = path.join(WS_DIR, 'diff');
const BASE_ASSETS_DIR = path.join(DIFF_DIR, 'base-assets');

const SUBJECTS = [
  ['biology', 'Biology'],
  ['chemistry', 'Chemistry'],
  ['physics', 'Physics'],
  ['maths', 'Maths'],
  ['cross-curricular', 'Cross-curricular'],
];

const BOOKLET_SUBJS = ['biology', 'chemistry', 'physics'];

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

function gitLsHtml(ref, folder) {
  try {
    const out = execFileSync('git', ['-C', ROOT, 'ls-tree', '-r', '--name-only', ref, folder], {
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

function cleanText(s) {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTitle(html, fallback, isBooklet) {
  const m = isBooklet
    ? html.match(/class="cv-title"[^>]*>([\s\S]*?)<\/div>/i) || html.match(/<title>([\s\S]*?)<\/title>/i)
    : html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<title>([\s\S]*?)<\/title>/i);
  if (!m) return fallback;
  const t = cleanText(m[1]).replace(/\s*·\s*Topic Booklet$/i, '');
  return t || fallback;
}

function extractSpec(html, isBooklet) {
  const m = isBooklet
    ? html.match(/class="cv-sub"[^>]*>([\s\S]*?)<\/div>/i)
    : html.match(/class="(?:ps-spec|spec-ref)"[^>]*>([\s\S]*?)<\/div>/i);
  if (!m) return '';
  return cleanText(m[1]).slice(0, 120);
}

function tierOf(rel, isBooklet) {
  if (isBooklet) return 'Topic booklet';
  if (rel.includes('/ks3/')) return 'KS3';
  if (rel.endsWith('_sa.html')) return 'KS4 · Single Award';
  if (rel.includes('/ks4/')) return 'KS4';
  return 'Sheet';
}

function countPages(html) {
  if (!html) return 0;
  return (html.match(/<div\b[^>]*class=["'][^"']*\bpage\b/gi) || []).length;
}

function snapshotBaseAssets(baseRef) {
  fs.mkdirSync(BASE_ASSETS_DIR, { recursive: true });
  const changed = {};
  const assets = [
    ['print-sheet.css', 'css/print-sheet.css'],
    ['biology.css', 'css/biology.css'],
    ['chemistry.css', 'css/chemistry.css'],
    ['physics.css', 'css/physics.css'],
    ['maths.css', 'css/maths.css'],
    ['booklet.css', 'booklets/assets/booklet.css'],
  ];
  for (const [name, rel] of assets) {
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

function loadApproved() {
  const p = path.join(ROOT, 'admin/review-approved.json');
  if (!fs.existsSync(p)) return new Set();
  try {
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    return new Set([...Object.keys(j.w || {}), ...Object.keys(j.b || {})]);
  } catch {
    return new Set();
  }
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
  const approved = loadApproved();

  // 1. Live worksheets
  const curFiles = new Set();
  for (const [sid] of SUBJECTS) {
    for (const full of walkHtml(path.join(WS_DIR, sid))) {
      const rel = path.relative(ROOT, full).replace(/\\/g, '/');
      const subRel = rel.slice('worksheets/'.length);
      if (subRel.endsWith('_ms.html') || archived.has(subRel)) continue;
      curFiles.add(rel);
    }
  }
  // 2. Live Topic Booklets (excludes interactive/physics-long-answer)
  for (const sid of BOOKLET_SUBJS) {
    for (const full of walkHtml(path.join(BOOKLETS_DIR, sid))) {
      const rel = path.relative(ROOT, full).replace(/\\/g, '/');
      if (rel.endsWith('_ms.html')) continue;
      curFiles.add(rel);
    }
  }

  const baseFiles = new Set();
  for (const r of gitLsHtml(args.base, 'worksheets')) {
    if (SUBJECTS.some(([sid]) => r.startsWith(`worksheets/${sid}/`)) && !r.endsWith('_ms.html')) {
      if (!archived.has(r.slice('worksheets/'.length))) baseFiles.add(r);
    }
  }
  for (const r of gitLsHtml(args.base, 'booklets')) {
    if (BOOKLET_SUBJS.some(sid => r.startsWith(`booklets/${sid}/`)) && !r.endsWith('_ms.html')) {
      baseFiles.add(r);
    }
  }

  const subjNames = Object.fromEntries(SUBJECTS);
  const allRels = [...new Set([...curFiles, ...baseFiles])].sort((a, b) => {
    const ab = a.startsWith('booklets/') ? 0 : 1;
    const bb = b.startsWith('booklets/') ? 0 : 1;
    return ab !== bb ? ab - bb : a.localeCompare(b);
  });

  const items = [];

  for (const rel of allRels) {
    const isBooklet = rel.startsWith('booklets/');
    const subRel = isBooklet ? rel : rel.slice('worksheets/'.length);
    const sid = isBooklet ? rel.split('/')[1] : subRel.split('/')[0];
    const msRel = rel.slice(0, -5) + '_ms.html';

    const curP = path.join(ROOT, rel);
    const curMsP = path.join(ROOT, msRel);
    const newHtml = fs.existsSync(curP) ? fs.readFileSync(curP, 'utf8') : null;
    const newMs = fs.existsSync(curMsP) ? fs.readFileSync(curMsP, 'utf8') : null;
    const oldHtml = gitShow(args.base, rel);
    const oldMs = gitShow(args.base, msRel);

    const sheetChanged = normHtml(oldHtml) !== normHtml(newHtml);
    const msChanged = normHtml(oldMs) !== normHtml(newMs);
    const cssAffected = Boolean(
      assetChanged['print-sheet.css'] ||
      assetChanged[`${sid}.css`] ||
      (isBooklet && assetChanged['booklet.css'])
    );
    const underReview = Boolean(newHtml && /under\s+review|review-chip/i.test(newHtml));
    const isSciencePrintable = isBooklet || ['biology', 'chemistry', 'physics'].includes(sid);
    const checked = !underReview && (approved.has(subRel) || !isSciencePrintable);

    // Include every changed printable AND every unchecked science printable
    if (!sheetChanged && !msChanged && !(cssAffected && newHtml && oldHtml) && !underReview) continue;

    let kind = 'changed';
    if (oldHtml === null && newHtml !== null) kind = 'added';
    else if (newHtml === null && oldHtml !== null) kind = 'removed';
    else if (!sheetChanged && !msChanged && !cssAffected) kind = 'unchanged';

    const refHtml = newHtml || oldHtml || '';
    const stem = path.basename(rel, '.html');
    const title = extractTitle(refHtml, stem, isBooklet);
    const spec = extractSpec(refHtml, isBooklet);
    const baseUrl = '/' + rel.slice(0, rel.lastIndexOf('/')) + '/';

    items.push({
      id: (isBooklet ? 'booklet-' + rel.slice('booklets/'.length, -5) : subRel.slice(0, -5))
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
      format: isBooklet ? 'booklet' : 'worksheet',
      subject: sid,
      subjectName: subjNames[sid] || sid,
      tier: tierOf(subRel, isBooklet),
      path: subRel,
      url: '/' + rel,
      msUrl: newMs || oldMs ? '/' + msRel : null,
      baseUrl,
      title,
      spec,
      kind,
      checked,
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
    booklets: items.filter(x => x.format === 'booklet').length,
    worksheets: items.filter(x => x.format === 'worksheet').length,
    underReview: items.filter(x => x.underReview).length,
    changed: items.filter(x => x.kind === 'changed').length,
    added: items.filter(x => x.kind === 'added').length,
    removed: items.filter(x => x.kind === 'removed').length,
  };
  console.log(
    `Wrote worksheets/diff/data.json (${(dataText.length / 1024).toFixed(1)} KB) · ${items.length} printables vs ${baseLabel} (${out.baseCommit}) ${JSON.stringify(counts)}`
  );
}

main();
