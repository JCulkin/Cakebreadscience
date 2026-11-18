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
  const FRESH = /^\/(today|work)\b|practice\.html|adventurer-mission\.html/.test(location.pathname);   // pages where work gets done: never trust the cache
  /* is this piece of work still open for this student? */
  function open(a, id, u) {
    if (a.type === 'test') return !(((u.work || {})[id] || {}).done);
    const q = ((u.specQuiz || {}).q) || {}, set = a.set || '';
    if (a.pts && a.need) {
      const pts = new Set(a.pts);
      const got = Object.entries(q).filter(([qid, x]) => x && x.l && x.l >= set && pts.has(qid.slice(0, qid.lastIndexOf('-')))).length;
      return got < a.need;
    }
    if (window.CBSSchool && window.QUESTIONS) return !CBSSchool.progress({ q }, a).done;
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
      const [ud, as] = await Promise.all([within(firebase.firestore().collection('users').doc(me).get(), 6000), within(firebase.database().ref('school/assign').once('value'), 6000)]);
      if (me !== uid) return;
      const u = ud.exists ? ud.data() || {} : {}, y = u.year, all = as.val() || {}, d = today();
      const mine = Object.entries(all).filter(([, a]) => a && !a.archived && ((y && a.years && a.years['Y' + y]) || (a.students && a.students[me])));
      const left = mine.filter(([id, a]) => open(a, id, u));
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
