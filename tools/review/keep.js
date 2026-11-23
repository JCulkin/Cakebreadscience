/* Keep something checked after an edit the USER asked for (user, 20 Nov 2026: "if something is checked and i make edits to it,
   keep it as checked, don't put it back to review — unless YOU by your own account change it").
   Writes the item's new fingerprint to /admin/review-approved.json; the admin Review page and the Building the site box count it
   as checked until its content changes again.
     node tools/review/keep.js q B1.1-01 C1.40-d2 …                 question ids (written, calculation or diagram)
     node tools/review/keep.js w chemistry/ks3/1fg1_bonding_electrons_charge.html …   worksheet paths under worksheets/
     node tools/review/keep.js k B2.11 C1.43 …                      key words of spec points (/js/key-words.js)
   Options: --why "user asked: …" (shown on the Review page), --remove (drop an entry).
   Only for edits the user asked for, or for marking something checked when the user says so. A change Claude makes on its own
   (tidying, a fix nobody asked for) must NOT be kept: it goes back to review. Run from the repo root and commit the JSON. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..', '..');
const FILE = path.join(ROOT, 'admin', 'review-approved.json');
const args = process.argv.slice(2);
const kind = args.shift();
let why = '', remove = false; const ids = [];
for (let i = 0; i < args.length; i++) { if (args[i] === '--why') why = args[++i] || ''; else if (args[i] === '--remove') remove = true; else ids.push(args[i]); }
if (!['q', 'w', 'k'].includes(kind) || !ids.length) { console.error('usage: node tools/review/keep.js q|w|k <id…> [--why "…"] [--remove]'); process.exit(1); }

/* the same fingerprints as admin/review-lib.js */
globalThis.window = globalThis;
const dir = path.join(ROOT, 'interactive', 'spec-quiz');
for (const f of ['spec.js', 'questions.js', 'gens.js', '../cell-game/cells.js', 'diagrams.js', 'diagq.js'])
  vm.runInThisContext(fs.readFileSync(path.join(dir, f), 'utf8'), { filename: f });
vm.runInThisContext(fs.readFileSync(path.join(ROOT, 'js', 'key-words.js'), 'utf8'), { filename: 'key-words.js' });
vm.runInThisContext(fs.readFileSync(path.join(ROOT, 'admin', 'review-lib.js'), 'utf8'), { filename: 'review-lib.js' });
const REVIEW = globalThis.REVIEW, QUESTIONS = vm.runInThisContext('QUESTIONS');

const data = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : { q: {}, w: {} };
data.q = data.q || {}; data.w = data.w || {}; data.k = data.k || {};
const today = new Date().toISOString().slice(0, 10);
for (const id of ids) {
  if (remove) { delete data[kind][id]; console.log('removed', kind, id); continue; }
  if (kind === 'k') {
    if (!(globalThis.KEYWORDS || {})[id]) { console.error('no key words for', id); process.exitCode = 1; continue; }
    data.k[id] = { h: REVIEW.kHash(id), at: today, ...(why ? { why } : {}) };
  } else if (kind === 'q') {
    const q = QUESTIONS.find(x => x.id === id);
    if (!q) { console.error('no question with id', id); process.exitCode = 1; continue; }
    data.q[id] = { h: REVIEW.qHash(q), at: today, ...(why ? { why } : {}) };
  } else {
    const p = id.replace(/^\/?worksheets\//, ''), f = path.join(ROOT, 'worksheets', p);
    if (!fs.existsSync(f)) { console.error('no worksheet', p); process.exitCode = 1; continue; }
    const ms = f.replace(/\.html$/, '_ms.html');
    data.w[p] = { hr: REVIEW.rawHash(fs.readFileSync(f, 'utf8'), fs.existsSync(ms) ? fs.readFileSync(ms, 'utf8') : ''), at: today, ...(why ? { why } : {}) };
  }
  console.log('kept checked:', kind, id);
}
fs.writeFileSync(FILE, JSON.stringify(data, null, 1) + '\n');
