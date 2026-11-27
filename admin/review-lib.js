/* Review portal helpers (19 Nov 2026), shared by /admin/review.html and the admin Overview.
   The user: "a page for me to systematically review [the question bank] … a big button for me to say it's good. Any time a
   question is ever changed it's got to be sent back to review." Same for worksheets ("what's been made and what is yet to review").

   How "changed → back to review" works: when the admin marks something good we save a fingerprint (hash) of its content.
   On every load the fingerprint is worked out again from the live content; if it differs, the item is back in "To review".
     Question fingerprint  = spec point + question + options + true/false + explanation + harder flag (+ the code of a generator)
     Worksheet fingerprint = the visible text and image list of the sheet and its mark scheme (so a site-wide script/style
                             change doesn't send every sheet back, but any wording, answer or picture change does)
   Saved in the Realtime Database (admins write, signed-in read — the existing `school` rule, so no new rule is needed):
     school/review/q/{key} = { h, at, st: 'ok'|'fix', note }   key = question id with '.' → ','   (P3.2-01 → P3,2-01)
     school/review/w/{key} = { h, at, st, note }               key = path with '.' → ',' and '/' → '|'
     school/review/k/{key} = { h, at, st, note }               key = spec point with '.' → ','  (key words, 22 Nov)
     school/review/l/{key} = { h, at, st, note, d }            key = 'biology|2b' (lessons, 24 Nov; h = the draft's visible text, d = its draftUpdated)
   Statuses: todo (never checked), changed (checked, then edited), fix (you said it needs fixing), ok (checked, unchanged). */
(function () {
  const key = s => String(s).replace(/\./g, ',').replace(/\//g, '|');
  /* cyrb53: small, fast, good enough to spot any edit */
  function hash(str) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0, ch; i < str.length; i++) { ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  }
  /* diagram questions (diagq.js) all share one tiny gen function, so their fingerprint uses the drawing's maker code (diagrams.js DG.M)
     and the question-type pattern instead — edit a drawing type and its questions come back for review */
  const dgOf = q => { const D = typeof DG !== 'undefined' ? DG : null, row = window.DQ && DQ.BY && DQ.BY[q.id];
    return (D && D.M && D.M[q.dg] ? String(D.M[q.dg]) : 'maker:' + q.dg) + '|' + (row && row.rx ? String(row.rx) : ''); };
  /* key words (22 Nov): one review item per spec point = its list of [word, meaning] in /js/key-words.js */
  const kHash = k => hash(JSON.stringify([k, (window.KEYWORDS || {})[k] || []]));
  /* flashcards (27 Nov): one review item per card = deck + spec + daOnly + front + back */
  const fcHash = c => hash(JSON.stringify([c.deck, c.spec || '', !!c.daOnly, c.front || '', c.back || '']));
  const qHash = q => hash(JSON.stringify([q.s, q.q || '', q.o || null, q.tf === undefined ? null : q.tf, q.x || '', !!q.hard, q.dg ? dgOf(q) : q.gen ? String(q.gen) : null]));
  function textOf(html) {
    const d = new DOMParser().parseFromString(html || '', 'text/html');
    d.querySelectorAll('script,style,noscript,template').forEach(e => e.remove());
    const imgs = [...d.querySelectorAll('img')].map(i => i.getAttribute('src') || '').join('|');
    return (d.body ? d.body.textContent : '').replace(/\s+/g, ' ').trim() + '\u0001' + imgs;
  }
  const status = (rec, h) => !rec ? 'todo' : rec.h !== h ? 'changed' : rec.st === 'fix' ? 'fix' : 'ok';
  /* Kept checked (user, 20 Nov: "if something is checked and I make edits to it, keep it as checked … unless YOU by your own
     account change it"). A chat that makes an edit the user asked for runs  node tools/review/keep.js q <id…> | w <path…>,
     which writes the new fingerprint to /admin/review-approved.json. That counts as checked until the content changes again.
     Worksheets use a plain-text fingerprint here (rawHash) because node has no DOM. */
  let APPROVED = { q: {}, w: {}, k: {}, fc: {} };
  const rawText = html => String(html || '').replace(/<(script|style|noscript|template)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<img\b[^>]*?\bsrc="([^"]*)"[^>]*>/gi, ' [img:$1] ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  const rawHash = (sheet, ms) => hash(rawText(sheet) + '\u0002' + rawText(ms));
  const full = (rec, h, kept) => rec && rec.h === h ? (rec.st === 'fix' ? 'fix' : 'ok') : kept ? 'ok' : !rec ? 'todo' : 'changed';
  const statusQ = (recs, id, h) => full(recs[key(id)], h, (APPROVED.q[id] || {}).h === h);
  const statusW = (recs, s) => full(recs[key(s.p)], s.h, !!s.hr && (APPROVED.w[s.p] || {}).hr === s.hr);
  /* Fast worksheet status when live HTML hasn't been fetched yet (used by /admin/ Overview): trusts saved marks / keptW */
  const statusWFast = (recs, s) => {
    if (s.h) return statusW(recs, s);
    const rec = recs[key(s.p)];
    if (rec) return rec.st === 'fix' ? 'fix' : 'ok';
    return APPROVED.w[s.p] ? 'ok' : 'todo';
  };
  const statusK = (recs, k) => full(recs[key(k)], kHash(k), (APPROVED.k[k] || {}).h === kHash(k));
  const statusFC = (recs, cid, h) => full((recs || {})[key(cid)], h, ((APPROVED.fc || {})[cid] || {}).h === h);
  const keptQ = id => APPROVED.q[id] || null, keptW = p => APPROVED.w[p] || null, keptK = k => APPROVED.k[k] || null, keptFC = cid => (APPROVED.fc || {})[cid] || null;
  const LABEL = { todo: 'To review', changed: 'Changed since checked', fix: 'Needs a fix', ok: 'Checked ✓' };

  /* the whole question bank in spec order (questions.js + gens.js must be loaded) */
  function questions() {
    const order = {};
    let i = 0; SPEC.forEach(s => s.topics.forEach(t => t.subs.forEach(sb => sb.points.forEach(p => { order[s.name[0] + p.id] = i++; }))));
    return QUESTIONS.map((q, n) => ({ q, n, o: order[q.s] ?? 1e6 })).sort((a, b) => a.o - b.o || a.n - b.n).map(x => x.q);
  }
  async function loadReview(rt) {
    const get = async p => { try { return (window.CBSSchool && CBSSchool.rtGet) ? await CBSSchool.rtGet(rt, p, 15000) : (await rt.ref(p).once('value')).val(); } catch (e) { return null; } };
    const [q, w, k, l, fc, ap] = await Promise.all([get('school/review/q'), get('school/review/w'), get('school/review/k'), get('school/review/l'), get('school/review/fc'),
      fetch('/admin/review-approved.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).catch(() => null)]);
    APPROVED = { q: (ap && ap.q) || {}, w: (ap && ap.w) || {}, k: (ap && ap.k) || {}, fc: (ap && ap.fc) || {} };
    return { q: q || {}, w: w || {}, k: k || {}, l: l || {}, fc: fc || {} };
  }
  async function save(rt, kind, id, rec) { await rt.ref(`school/review/${kind}/${key(id)}`).set(rec); }
  async function clear(rt, kind, id) { await rt.ref(`school/review/${kind}/${key(id)}`).remove(); }

  /* Lightweight list without fetching every worksheet HTML (1 request, used by /admin/ Overview) */
  async function sheetsList() {
    return ((await (await fetch('/admin/worksheets.json', { cache: 'no-store' })).json()) || {}).sheets || [];
  }
  /* worksheets: the list from /admin/worksheets.json, each fingerprinted from the live page (and its mark scheme) */
  /* archived sheets (worksheets/archive.html only) aren't shown to students, so they're listed but not read or reviewed */
  async function sheets(onProgress) {
    const all = ((await (await fetch('/admin/worksheets.json', { cache: 'no-store' })).json()) || {}).sheets || [];
    const list = all.filter(s => !s.archived);
    let done = 0;
    const one = async s => {
      const get = u => fetch('/worksheets/' + u, { cache: 'no-cache' }).then(r => r.ok ? r.text() : '').catch(() => '');
      const [a, b] = await Promise.all([get(s.p), s.ms ? get(s.ms) : '']);
      s.h = hash(textOf(a) + '\u0002' + textOf(b)); s.hr = rawHash(a, b); s.missing = !a;
      done++; if (onProgress) onProgress(done, list.length);
    };
    for (let i = 0; i < list.length; i += 8) await Promise.all(list.slice(i, i + 8).map(one));
    return all;
  }
  function counts(items, recs, idOf, hOf) {
    const c = { todo: 0, changed: 0, fix: 0, ok: 0, total: items.length };
    items.forEach(it => c[full(recs[key(idOf(it))], hOf(it), (APPROVED.q[idOf(it)] || {}).h === hOf(it))]++);
    return c;
  }
  window.REVIEW = { key, hash, qHash, kHash, fcHash, textOf, rawText, rawHash, status, statusQ, statusW, statusWFast, statusK, statusFC, keptQ, keptW, keptK, keptFC, LABEL, questions, loadReview, save, clear, sheets, sheetsList, counts };
})();
