/* Worksheet list for the admin review portal (19 Nov 2026). Writes /admin/worksheets.json: every worksheet that has been made,
   with its title, subject, kind, whether students can see it (linked from a worksheets index page) and its mark scheme.
   Run from the repo root after adding worksheets (build_index.js runs it too):   node tools/review/list_worksheets.js
   Review state itself is not here: it lives in the Realtime Database at school/review/w (see admin/review-lib.js). */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const W = path.join(ROOT, 'worksheets');
const FOLDERS = ['biology', 'chemistry', 'physics', 'maths', 'cross-curricular'];
const indexHtml = fs.readdirSync(W).filter(f => f.endsWith('.html')).map(f => fs.readFileSync(path.join(W, f), 'utf8')).join('\n');
const linked = new Set([...indexHtml.matchAll(/href="(?:\/worksheets\/|\.\/)?((?:biology|chemistry|physics|maths|cross-curricular)\/[^"#?]+\.html)"/g)].map(m => m[1]));
const out = [];
for (const folder of FOLDERS) {
  const dir = path.join(W, folder);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.html') && !f.endsWith('_ms.html')).sort()) {
    const p = `${folder}/${f}`, html = fs.readFileSync(path.join(dir, f), 'utf8');
    const ms = f.replace(/\.html$/, '_ms.html');
    const title = ((html.match(/<title>([^<]*)<\/title>/i) || [])[1] || f).replace(/\s*[|–-]\s*Cakebread Science\s*$/i, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
    out.push({
      p, t: title, subj: folder,
      kind: /_challenge\b/.test(f) ? 'challenge' : /_practice\b/.test(f) ? 'practice' : 'sheet',
      live: linked.has(p),
      ms: fs.existsSync(path.join(dir, ms)) ? `${folder}/${ms}` : null
    });
  }
}
fs.writeFileSync(path.join(ROOT, 'admin/worksheets.json'), JSON.stringify({ built: new Date().toISOString().slice(0, 10), sheets: out }, null, 0) + '\n');
console.log(`worksheets: ${out.length} made · ${out.filter(s => s.live).length} on the worksheet pages · ${out.filter(s => s.ms).length} with mark schemes`);
