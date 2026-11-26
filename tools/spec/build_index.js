/* One spec (10 Nov 2026): builds /js/spec-index.js — for every Double Award spec point, what on the site covers it.
   Run from the repo root after adding questions, flashcards, lessons, worksheets, long answers or equations:
       node tools/spec/build_index.js
   Sources (all read from the repo, nothing typed by hand):
     interactive/spec-quiz/spec.js        the spec (point keys like 'B2.27' = subject letter + number; Units sub-topics skipped)
     interactive/spec-quiz/questions.js   quiz questions per point (+ gens.js generators)
     Flashcards/data/*.json               flashcards per point (field `spec`)
     interactive/lessons/lessons.json     lessons with a draft or version; points from the draft's <span class="spec"> chips
     worksheets/{biology,chemistry,physics}/(ks4/|ks3/)*.html   the sheet's spec line (class="spec-ref", or "spec points a to b" in the meta description)
     interactive/physics-long-answer/questions-data.js   long answers (`spec: "4.2, 4.3"`)
     interactive/physics-equations/index.html            equations (`spec:'1.4'`)
   Output: const SPEC_INDEX = { res: [[kind, title, url], …], pts: { 'B2.27': { s: 'B2b', n: questions, c: cards, r: [res index…] } },
                                prac: { 'B2.9': 'words of the practical' } } */
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const rd = p => fs.readFileSync(path.join(ROOT, p), 'utf8');

/* ---- the spec ---- */
const ctx = vm.createContext({ console, Math, Date, JSON });
vm.runInContext(rd('interactive/spec-quiz/spec.js') + '\n;globalThis.SPEC = SPEC;', ctx);
const SPEC = ctx.SPEC, P = {}, ORDER = [], PRAC = {};
SPEC.forEach(s => s.topics.forEach(t => t.subs.forEach(sb => {
  if (sb.name === 'Units') return;
  sb.points.forEach(p => {
    const k = s.name[0] + p.id; P[k] = { s: s.name[0] + t.n + sb.l, n: 0, c: 0, r: [] }; ORDER.push(k);
    /* the spec tracker lists practicals without their number, so it matches them on these words */
    if (/^practical/i.test(p.text)) PRAC[k] = [...new Set((p.text + ' ' + (p.bullets || []).join(' ') + ' ' + (p.detail || '')).toLowerCase().match(/[a-z]{4,}/g))].join(' ');
  });
})));
const L = { biology: 'B', chemistry: 'C', physics: 'P' };
const num = k => k.slice(1).split('.').map(Number);
/* "1.17, 1.25–1.33" → keys that exist in the Double Award spec */
function expand(letter, text) {
  const out = [];
  for (const part of String(text).split(/[,;]| and /)) {
    const m = part.trim().match(/^(\d+)\.(\d+)(?:\s*[–\-—]|\s+to\s+)?\s*(?:(\d+)\.)?(\d+)?/);
    if (!m) continue;
    const t = +m[1], a = +m[2], t2 = m[3] ? +m[3] : t, b = m[4] ? +m[4] : a;
    for (const k of ORDER) {
      if (k[0] !== letter) continue;
      const [kt, kn] = num(k);
      if ((kt > t || (kt === t && kn >= a)) && (kt < t2 || (kt === t2 && kn <= b))) out.push(k);
    }
  }
  return [...new Set(out)];
}
const RES = [], resIdx = {};
function addRes(kind, title, url, keys) {
  const id = kind + '|' + url + '|' + title;
  if (!(id in resIdx)) { resIdx[id] = RES.length; RES.push([kind, title, url]); }
  for (const k of keys) if (P[k] && !P[k].r.includes(resIdx[id])) P[k].r.push(resIdx[id]);
}

/* ---- quiz questions ---- */
const qctx = vm.createContext({ console, Math, Date, JSON });
vm.runInContext(['interactive/spec-quiz/spec.js', 'interactive/spec-quiz/questions.js', 'interactive/spec-quiz/gens.js', 'interactive/spec-quiz/diagq.js'].map(rd).join('\n;\n') + '\n;globalThis.Q = QUESTIONS;', qctx);
for (const q of qctx.Q) if (P[q.s]) P[q.s].n++;

/* ---- flashcards ---- */
for (const f of fs.readdirSync(path.join(ROOT, 'Flashcards/data'))) {
  if (!f.endsWith('.json') || f === 'index.json') continue;
  for (const c of JSON.parse(rd('Flashcards/data/' + f))) if (c.spec && P[c.spec]) P[c.spec].c++;
}

/* ---- lessons ---- */
const LJ = JSON.parse(rd('interactive/lessons/lessons.json'));
for (const s of LJ.subjects) for (const sec of s.sections) for (const t of sec.topics) {
  if (!t.status && !(t.versions || []).length) continue;
  const letter = s.name[0], dir = `interactive/lessons/${s.id}/${t.code}`;
  let keys = [];
  const draft = path.join(ROOT, dir, 'draft/index.html');
  if (fs.existsSync(draft)) keys = [...new Set([...fs.readFileSync(draft, 'utf8').matchAll(/class="spec">\s*([\d.,\s–-]+)</g)].flatMap(m => expand(letter, m[1])))];
  if (!keys.length && t.spec) keys = expand(letter, t.spec);
  addRes('lesson', `${s.name} ${t.code} ${t.title}${t.status === 'draft' && !(t.versions || []).length ? ' (draft)' : ''}`, `/${dir}/`, keys);
}

/* ---- worksheets ---- */
// sheets listed on worksheets/archive.html are retired: no tracker links to them (worksheets chat, 19 Nov)
const ARCHIVED = new Set(fs.existsSync(path.join(ROOT, 'worksheets', 'archive.html'))
  ? [...fs.readFileSync(path.join(ROOT, 'worksheets', 'archive.html'), 'utf8').matchAll(/href="((?:biology|chemistry|physics)\/[^"#?]+\.html)"/g)].map(m => m[1]) : []);
for (const subj of Object.keys(L)) {
  const base = path.join(ROOT, 'worksheets', subj);
  // worksheets/{subj}/*.html plus the KS4 / KS3 sets in worksheets/{subj}/ks4|ks3/
  const files = [];
  for (const sub of ['', 'ks4', 'ks3']) {
    const dir = path.join(base, sub);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).sort()) if (f.endsWith('.html') && !f.endsWith('_ms.html')) files.push(sub ? `${sub}/${f}` : f);
  }
  for (const f of files) {
    if (ARCHIVED.has(`${subj}/${f}`)) continue;
    if (f.endsWith('_sa.html')) continue;   // Single Award twin of a sheet (worksheets chat): the worksheets home links it, trackers keep the Double Award one
    const h = fs.readFileSync(path.join(base, f), 'utf8');
    let spec = (h.match(/class="(?:spec-ref|ps-spec)"[^>]*>\s*([\d.,\s–\-—]+)/) || [])[1];
    if (!spec) { const m = h.match(/spec points ([\d.]+) (?:to|–) ([\d.]+)/i); if (m) spec = `${m[1]}–${m[2]}`; }
    if (!spec) continue;
    const title = ((h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || h.match(/<title>([^<·]*)/) || [])[1] || f).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
    const kind = f.startsWith('ks4/') ? 'KS4 worksheet' : f.startsWith('ks3/') ? 'KS3 worksheet' : /_practice/.test(f) ? 'Practice sheet' : /_challenge/.test(f) ? 'Challenge sheet' : 'Worksheet';
    addRes('sheet', `${kind}: ${title}`, `/worksheets/${subj}/${f}`, expand(L[subj], spec));
  }
}

/* ---- physics long answers ---- */
const lctx = vm.createContext({ console, Math, Date, JSON });
vm.runInContext(rd('interactive/physics-long-answer/questions-data.js') + '\n;globalThis.T = TOPICS;', lctx);
for (const t of lctx.T) for (const q of t.questions) if (q.spec) addRes('long', `6-marker: ${q.title}`, `/interactive/physics-long-answer/#${q.id}`, expand('P', q.spec));

/* ---- physics equations ---- */
for (const m of rd('interactive/physics-equations/index.html').matchAll(/\{id:'([^']+)',topic:\d+,spec:'([\d.]+)'[^}]*?title:'([^']+)'/g))
  addRes('eq', `Equation: ${m[3]}`, `/interactive/physics-equations/`, expand('P', m[2]));

/* ---- standalone topic interactives (games & simulations) ---- */
const GAMES = [
  ['B', '1.2–1.3, 2.2–2.4', 'What The Cell', '/interactive/cell-game/'],
  ['B', '1.2–1.4', 'Organisms Game', '/interactive/organisms/game.html'],
  ['B', '3.14–3.27', 'Genetics Simulator', '/interactive/genetics-game/'],
  ['B', '4.6–4.8', 'Food Webs', '/interactive/food-webs/'],
  ['B', '4.7–4.9', 'Ecological Pyramids', '/interactive/ecological-pyramids/'],
  ['C', '1.14–1.24, 1.37–1.38', 'Elements 1–20', '/interactive/elements-game/'],
  ['C', '2.44–2.50', 'Chemical Tests', '/interactive/chemical-tests/'],
  ['C', '2.5–2.8', 'Halogens Lab', '/interactive/halogen_lab_10.html'],
  ['P', '3.2–3.5', 'Transverse & Longitudinal Waves', '/interactive/waves/']
];
for (const [letter, spec, title, url] of GAMES) addRes('game', title, url, expand(letter, spec));

/* ---- write ---- */
const pts = {}; let covered = { quiz: 0, cards: 0, other: 0 };
for (const k of ORDER) { const p = P[k]; pts[k] = p; if (p.n) covered.quiz++; if (p.c) covered.cards++; if (p.r.length) covered.other++; }
const out = '/* Generated by tools/spec/build_index.js — do not edit by hand. What on the site covers each Double Award spec point.\n'
  + '   res = [kind, title, url]; pts[key] = { s: sub-topic, n: quiz questions, c: flashcards, r: indexes into res }; prac[key] = words (to match practicals). */\n'
  + 'const SPEC_INDEX = ' + JSON.stringify({ built: new Date().toISOString().slice(0, 10), res: RES, pts, prac: PRAC }) + ';\n';
fs.writeFileSync(path.join(ROOT, 'js/spec-index.js'), out);
const kinds = RES.reduce((o, r) => (o[r[0]] = (o[r[0]] || 0) + 1, o), {});
console.log(`${ORDER.length} points · quiz ${covered.quiz} · flashcards ${covered.cards} · lesson/sheet/long/eq ${covered.other} · resources`, kinds, `· ${(out.length / 1024).toFixed(1)} KB`);

/* ---- the worksheet list for the admin review portal ---- */
require('../review/list_worksheets.js');
