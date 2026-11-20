/* Worksheet list for the admin review portal (19 Nov 2026). Writes /admin/worksheets.json: every worksheet that has been made,
   with its title, subject, kind, whether students can see it (linked from a worksheets index page) and its mark scheme.
   Run from the repo root after adding worksheets (build_index.js runs it too):   node tools/review/list_worksheets.js
   Review state itself is not here: it lives in the Realtime Database at school/review/w (see admin/review-lib.js). */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const W = path.join(ROOT, 'worksheets');
const FOLDERS = ['biology', 'chemistry', 'physics', 'maths', 'cross-curricular'];
/* live = linked from a worksheets index page students use; archived = only on worksheets/archive.html (retired by the
   worksheets chat, 19 Nov: not shown to students, so not in the review queue) */
const linksOf = files => new Set(files.filter(f => fs.existsSync(path.join(W, f))).flatMap(f => [...fs.readFileSync(path.join(W, f), 'utf8')
  .matchAll(/href="(?:\/worksheets\/|\.\/)?((?:biology|chemistry|physics|maths|cross-curricular)\/[^"#?]+\.html)"/g)].map(m => m[1])));
const INDEXES = fs.readdirSync(W).filter(f => f.endsWith('.html') && f !== 'archive.html');
const linked = linksOf(INDEXES), retired = linksOf(['archive.html']);
const out = [];
for (const folder of FOLDERS) {
  const dir = path.join(W, folder);
  if (!fs.existsSync(dir)) continue;
  // top-level sheets plus the new KS4 / KS3 sets in {folder}/ks4 and {folder}/ks3 (worksheets chat, 19 Nov)
  const files = [];
  for (const sub of ['', 'ks4', 'ks3']) {
    const d = path.join(dir, sub);
    if (fs.existsSync(d)) for (const f of fs.readdirSync(d).filter(f => f.endsWith('.html') && !f.endsWith('_ms.html')).sort()) files.push(sub ? `${sub}/${f}` : f);
  }
  for (const f of files) {
    const p = `${folder}/${f}`, html = fs.readFileSync(path.join(dir, f), 'utf8');
    const ms = f.replace(/\.html$/, '_ms.html');
    const title = ((html.match(/<title>([^<]*)<\/title>/i) || [])[1] || f).replace(/\s*[|–-]\s*Cakebread Science\s*$/i, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
    out.push({
      p, t: title, subj: folder,
      kind: f.endsWith('_sa.html') ? 'KS4 Single Award' : f.startsWith('ks4/') ? 'KS4' : f.startsWith('ks3/') ? 'KS3' : /_challenge\b/.test(f) ? 'challenge' : /_practice\b/.test(f) ? 'practice' : 'sheet',
      live: linked.has(p),
      archived: !linked.has(p) && retired.has(p),
      ms: fs.existsSync(path.join(dir, ms)) ? `${folder}/${ms}` : null
    });
  }
}
fs.writeFileSync(path.join(ROOT, 'admin/worksheets.json'), JSON.stringify({ built: new Date().toISOString().slice(0, 10), sheets: out }, null, 0) + '\n');
console.log(`worksheets: ${out.length} made · ${out.filter(s => s.live).length} on the worksheet pages · ${out.filter(s => s.archived).length} archived · ${out.filter(s => s.ms).length} with mark schemes`);
