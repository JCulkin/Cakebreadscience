/* Open set work, for the "To do !" buttons (user, 18 Nov 2026: "I want a ! and change to the todo button when students have open work to do").
   Works on any page with firebase app + auth compat (loads Firestore / Realtime Database compat itself if the page lacks them)
   and needs no question bank: practise work carries `pts` + `need` (saved by the admin console; see /js/school.js).
   CBSWork.onChange(fn) → fn({n, late}) whenever the count is known; CBSWork.refresh() re-reads (skips the 1-minute cache).
   Reads users/{uid} (year, work, specQuiz.q) and school/assign once, with time limits; any failure = no badge, never an error. */
(function () {
  if (window.CBSWork) return;
  const subs = [], KEY = 'cbs.work.';
  const W = window.CBSWork = { n: 0, late: 0, known: false, onChange(f) { subs.push(f); if (W.known) f(W); }, refresh: () => run(true) };
  const emit = () => { W.known = true; subs.forEach(f => { try { f(W); } catch (e) {} }); };
  const within = (p, ms) => new Promise((ok, no) => { const t = setTimeout(() => no(new Error('timeout')), ms); Promise.resolve(p).then(v => { clearTimeout(t); ok(v); }, e => { clearTimeout(t); no(e); }); });
  const load = src => new Promise(ok => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = ok; document.head.appendChild(s); });
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  let uid = null;
  /* Realtime Database read with a plain-HTTPS fallback (the live connection is blocked on some networks; see /js/school.js) */
  function rtGet(path) {
    if (window.CBSSchool && CBSSchool.rtGet) return CBSSchool.rtGet(firebase.database(), path, 12000);
    let done = false;
    const sdk = firebase.database().ref(path).once('value').then(x => { done = true; return x.val(); });
    const rest = (async () => { await new Promise(r => setTimeout(r, 1500)); if (done) throw new Error('not needed'); const u = firebase.auth().currentUser, base = (window.firebaseConfig || {}).databaseURL;
      if (!u || !base) throw new Error('no rest'); const r = await fetch(`${base}/${path}.json?auth=${encodeURIComponent(await u.getIdToken())}`, { cache: 'no-store' }); if (!r.ok) throw new Error('rest'); return r.json(); })();
    return within(Promise.any ? Promise.any([sdk, rest]) : sdk, 12000);
  }
  const FRESH = /^\/(today|work)\b|practice\.html|adventurer-mission\.html/.test(location.pathname);   // pages where work gets done: never trust the cache
  /* is this piece of work still open for this student (and needing action today)? */
  function open(a, id, u, d) {
    const sa = u.course === 'SA';   // Single Award students: work sized for their course (nSA / needSA, see /js/school.js)
    if (a.type === 'test') return !(sa && a.nSA === 0) && !(((u.work || {})[id] || {}).done);
    if (a.type === 'spaced') {
      if (sa && a.needSA === 0) return false;
      const w = (u.work || {})[id] || {}, days = (w.days && typeof w.days === 'object') ? w.days : {};
      const need = Math.max(1, +a.days || 2);
      if (w.done || Object.keys(days).length >= need) return false;
      // Already completed today's mission: stay quiet until tomorrow (unless already overdue)
      if (days[d] && !(a.due && a.due < d)) return false;
      return true;
    }
    if (sa && a.needSA === 0) return false;
    const q = ((u.specQuiz || {}).q) || {}, set = a.set || '';
    if (a.pts && a.need) {
      const pts = new Set(a.pts);
      const got = Object.entries(q).filter(([qid, x]) => x && x.l && x.l >= set && pts.has(qid.slice(0, qid.lastIndexOf('-')))).length;
      return got < (sa && a.needSA > 0 ? a.needSA : a.need);
    }
    if (window.CBSSchool && window.QUESTIONS) return !CBSSchool.progress({ q }, a, sa ? 'SA' : '').done;
    return true;   // old work saved before pts/need: counted as open until the admin console has added them
  }
  async function run(force) {
    if (!uid) return;
    const me = uid;
    if (!force) { try { const c = JSON.parse(sessionStorage.getItem(KEY + me) || 'null'); if (c && Date.now() - c.t < 60000) { W.n = c.n; W.late = c.late; emit(); return; } } catch (e) {} }
    const v = firebase.SDK_VERSION || '9.22.2';
    if (!firebase.firestore) await load(`https://www.gstatic.com/firebasejs/${v}/firebase-firestore-compat.js`);
    if (!firebase.database) await load(`https://www.gstatic.com/firebasejs/${v}/firebase-database-compat.js`);
    if (!firebase.firestore || !firebase.database) return;
    try {
      const [ud, as] = await Promise.all([within(firebase.firestore().collection('users').doc(me).get(), 6000), rtGet('school/assign')]);
      if (me !== uid) return;
      const u = ud.exists ? ud.data() || {} : {}, y = u.year, all = as || {}, d = today();
      const mine = Object.entries(all).filter(([, a]) => a && !a.archived && ((y && a.years && a.years['Y' + y]) || (a.students && a.students[me])));
      const left = mine.filter(([id, a]) => open(a, id, u, d));
      W.n = left.length; W.late = left.filter(([, a]) => a.due && a.due < d).length;
      try { sessionStorage.setItem(KEY + me, JSON.stringify({ t: Date.now(), n: W.n, late: W.late })); } catch (e) {}
      emit();
    } catch (e) { /* blocked or slow network: no badge */ }
  }
  function start() {
    if (!window.firebase || !window.firebaseConfig) return;
    try { if (!firebase.apps.length) firebase.initializeApp(window.firebaseConfig); } catch (e) { return; }
    firebase.auth().onAuthStateChanged(u => { uid = u ? u.uid : null; W.n = 0; W.late = 0; if (!u) { emit(); return; } run(FRESH); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
