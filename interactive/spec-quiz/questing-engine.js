/* Cakebread Questing: the progress engine (no page code). Shared by every Questing page.
   Needs, before this file: /js/firebase-config.js, firebase-app/auth/firestore/database compat (9.22.2), spec.js, questions.js, gens.js.

   Same rules and the same saved data as the Campaign it replaces (9 Nov 2026), so students keep their progress:
   - A question is SECURED when answered right first time on two different days. A wrong answer drops it back.
   - True/false questions count half towards a spec point. A spec point is SECURED when its secured questions are worth
     at least min(4, total). A secured point goes RUSTY after 21 days with no correct answer; one correct answer polishes it.
   - XP: 5 per correct answer (10 if ★ harder), +20 when a question is secured, +100 the first time a spec point is secured.

   SAVED DATA
   Firestore users/{uid}.specQuiz = PROG, users/{uid}.specQuizSummary, users/{uid}.questing = GAME
   Realtime Database specQuizBoard/{uid} = { name, xp, rank, pts, wk, wkCorrect, bio, chem, phys, wb, wc, wp (this week per science), look, eq, hide, t }
   PROG = { v, q: { id: { c: 0|1|2, d, l, n, r } }, xp, correct, hard, subj, weeks, missions, unrusted, earned, hide, updatedAt }
   GAME = { coins, bag: [itemId], lastLoot, days: { 'YYYY-MM-DD': missions finished }, look, eq, nick, updatedAt }
   Local copies: localStorage specquiz.camp.<uid|anon> (PROG, same key as the old Campaign) and cbs.questing.game.<uid|anon>. */
const QE = (() => {
  const RUST_DAYS = 21, MISSION_LEN = 10;

  /* ---------- spec ---------- */
  const POINTS = {};
  SPEC.forEach(s => s.topics.forEach(t => t.subs.forEach(sb => sb.points.forEach(p => {
    p.key = s.name[0] + p.id; POINTS[p.key] = { key: p.key, id: p.id, text: p.text, subject: s.name, topic: t.n, sub: sb.l };
  }))));
  const POINT_QS = {}; QUESTIONS.forEach(q => (POINT_QS[q.s] = POINT_QS[q.s] || []).push(q));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const inst = q => (q.gen ? { ...q, ...q.gen(R) } : q);

  /* ---------- dates ---------- */
  const TODAY = (() => { const m = /[?&]today=(\d{4}-\d{2}-\d{2})/.exec(location.search); if (m) return m[1]; const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); })();
  const dayNum = s => Math.round(Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) / 864e5);
  function isoWeek(s) {
    const d = new Date(Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10))); const day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day); const y0 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return d.getUTCFullYear() + '-W' + String(Math.ceil(((d - y0) / 864e5 + 1) / 7)).padStart(2, '0');
  }
  const WEEK = isoWeek(TODAY);

  /* ranks only for the leaderboard record (Questing shows levels instead) */
  const RANK_XP = [0, 60, 150, 300, 500, 800, 1200, 1700, 2300, 3000, 4000, 5200, 6600, 8200, 10000];
  const rankIndex = xp => { let i = 0; RANK_XP.forEach((x, k) => { if (xp >= x) i = k; }); return i; };

  /* ---------- local stores ---------- */
  const ls = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} },
  };
  const UID_KEY = 'cbs.questing.uid';
  const blank = () => ({ v: 1, q: {}, xp: 0, correct: 0, hard: 0, subj: { Biology: 0, Chemistry: 0, Physics: 0 }, weeks: {}, ws: {}, missions: 0, unrusted: 0, earned: {}, hide: false, updatedAt: 0 });
  const gblank = () => ({ coins: 0, bag: [], lastLoot: null, days: {}, look: null, eq: null, nick: null, updatedAt: 0 });
  const progKey = uid => 'specquiz.camp.' + (uid || 'anon');
  const gameKey = uid => 'cbs.questing.game.' + (uid || 'anon');
  const readProg = uid => Object.assign(blank(), ls.get(progKey(uid)) || {});
  const readGame = uid => Object.assign(gblank(), ls.get(gameKey(uid)) || {});

  function mergeProg(a, b) {
    const o = blank();
    for (const id of new Set([...Object.keys(a.q), ...Object.keys(b.q)])) {
      const x = a.q[id], y = b.q[id];
      o.q[id] = !x ? y : !y ? x : ((y.n || 0) > (x.n || 0) || ((y.n || 0) === (x.n || 0) && (y.l || '') > (x.l || '')) ? y : x);
    }
    for (const k of ['xp', 'correct', 'hard', 'missions', 'unrusted', 'updatedAt']) o[k] = Math.max(a[k] || 0, b[k] || 0);
    for (const k in o.subj) o.subj[k] = Math.max((a.subj || {})[k] || 0, (b.subj || {})[k] || 0);
    for (const src of [a.weeks || {}, b.weeks || {}]) for (const k in src) o.weeks[k] = Math.max(o.weeks[k] || 0, src[k]);
    for (const src of [a.ws || {}, b.ws || {}]) for (const w in src) { o.ws[w] = o.ws[w] || {}; for (const k in src[w]) o.ws[w][k] = Math.max(o.ws[w][k] || 0, src[w][k]); }
    for (const src of [a.earned || {}, b.earned || {}]) for (const k in src) o.earned[k] = o.earned[k] && o.earned[k] < src[k] ? o.earned[k] : src[k];
    o.hide = !!(a.hide || b.hide);
    return o;
  }
  function mergeGame(a, b) {
    const newer = (b.updatedAt || 0) > (a.updatedAt || 0) ? b : a;
    const o = Object.assign(gblank(), newer);
    o.bag = [...new Set([...(a.bag || []), ...(b.bag || [])])];
    o.days = {}; for (const src of [a.days || {}, b.days || {}]) for (const k in src) o.days[k] = Math.max(o.days[k] || 0, src[k]);
    o.coins = Math.max(a.coins || 0, b.coins || 0);
    for (const k of ['look', 'eq', 'nick']) if (!o[k]) o[k] = a[k] || b[k] || null;
    return o;
  }

  /* start from the last account used in this browser, so pages draw at once; Firebase then confirms it */
  let uid0 = ls.get(UID_KEY);
  let PROG = readProg(uid0), GAME = readGame(uid0);
  const sig = () => [uid0 || '', PROG.updatedAt || 0, GAME.updatedAt || 0].join('|');
  const startSig = sig();

  /* the look/gear/name the creator and wardrobe pages keep in their own localStorage keys */
  const LOOK_KEYS = { look: 'cbs.adventurer.base', eq: 'cbs.adventurer.eq', nick: 'cbs.adventurer.nick' };
  function readLookLocal() { return { look: ls.get(LOOK_KEYS.look), eq: ls.get(LOOK_KEYS.eq), nick: localStorage.getItem(LOOK_KEYS.nick) }; }
  function writeLookLocal(g) {
    try {
      if (g.look) localStorage.setItem(LOOK_KEYS.look, JSON.stringify(g.look));
      if (g.eq) localStorage.setItem(LOOK_KEYS.eq, JSON.stringify(g.eq));
      if (g.nick) localStorage.setItem(LOOK_KEYS.nick, g.nick);
    } catch (e) {}
  }
  function syncLookIntoGame() {
    const l = readLookLocal(); let changed = false;
    for (const k of ['look', 'eq', 'nick']) if (l[k] && JSON.stringify(l[k]) !== JSON.stringify(GAME[k])) { GAME[k] = l[k]; changed = true; }
    if (changed) GAME.updatedAt = Date.now();
    return changed;
  }

  /* ---------- Firebase ---------- */
  const FB = { ok: false, auth: null, db: null, rtdb: null, user: null, status: 'local', known: false };
  const listeners = [];
  const emit = () => listeners.forEach(f => { try { f(); } catch (e) { console.error(e); } });
  let busy = false;

  function writeLocal() { const u = FB.user ? FB.user.uid : (FB.known ? null : uid0); ls.set(progKey(u), PROG); ls.set(gameKey(u), GAME); }

  function securedStats() {
    let securedQ = 0, securedP = 0;
    const per = { Biology: 0, Chemistry: 0, Physics: 0 };
    for (const q of QUESTIONS) if (qState(q.id).c === 2) securedQ++;
    for (const k in POINT_QS) { const p = pointState(k); if (p.secured) { securedP++; per[POINTS[k] ? POINTS[k].subject : 'Physics']++; } }
    return { securedQ, securedP, per };
  }
  function boardName() { const n = (FB.user && FB.user.displayName || 'Student').trim().split(/\s+/); return n[0] + (n.length > 1 ? ' ' + n[n.length - 1][0] + '.' : ''); }
  async function saveRemote() {
    if (!FB.ok || !FB.user) return;
    FB.status = 'saving'; emit();
    const st = securedStats();
    try {
      await FB.db.collection('users').doc(FB.user.uid).set({
        email: FB.user.email || null, displayName: FB.user.displayName || null, lastAccess: new Date().toISOString(),
        specQuiz: PROG, questing: GAME,
        specQuizSummary: { xp: PROG.xp, rank: rankIndex(PROG.xp), securedQ: st.securedQ, securedP: st.securedP, correct: PROG.correct, updatedAt: new Date().toISOString() }
      }, { merge: true });
      FB.status = 'saved';
    } catch (e) { console.error('Questing save failed', e); FB.status = 'error'; }
    emit();
    if (FB.rtdb) {
      try {
        await FB.rtdb.ref('specQuizBoard/' + FB.user.uid).set({ name: boardName(), xp: PROG.xp, rank: rankIndex(PROG.xp), pts: st.securedP, wk: WEEK, wkCorrect: PROG.weeks[WEEK] || 0,
          bio: PROG.subj.Biology || 0, chem: PROG.subj.Chemistry || 0, phys: PROG.subj.Physics || 0,
          wb: ((PROG.ws || {})[WEEK] || {}).B || 0, wc: ((PROG.ws || {})[WEEK] || {}).C || 0, wp: ((PROG.ws || {})[WEEK] || {}).P || 0,
          look: GAME.look || null, eq: GAME.eq || null, hide: !!PROG.hide, t: Date.now() });
      } catch (e) { console.warn('Leaderboard save failed', e); }
    }
  }
  let saveTimer = null;
  function save(now) { writeLocal(); clearTimeout(saveTimer); if (now) return saveRemote(); saveTimer = setTimeout(saveRemote, 600); return Promise.resolve(); }

  async function onUser(u) {
    FB.user = u; FB.known = true;
    const before = sig();
    if (!u) {
      ls.del(UID_KEY); uid0 = null;
      PROG = readProg(null); GAME = readGame(null); syncLookIntoGame(); writeLocal(); FB.status = 'local';
    } else {
      FB.status = 'loading'; emit();
      try {
        const snap = await FB.db.collection('users').doc(u.uid).get();
        const data = (snap.exists && snap.data()) || {};
        const remote = Object.assign(blank(), data.specQuiz || {}), remoteG = Object.assign(gblank(), data.questing || {});
        PROG = mergeProg(mergeProg(remote, readProg(u.uid)), readProg(null));
        GAME = mergeGame(mergeGame(remoteG, readGame(u.uid)), readGame(null));
        if ((remoteG.updatedAt || 0) >= (GAME.updatedAt || 0)) writeLookLocal(GAME); else syncLookIntoGame();
        ls.del(progKey(null)); ls.del(gameKey(null));
        ls.set(UID_KEY, u.uid); uid0 = u.uid;
        writeLocal(); await saveRemote();
      } catch (e) {
        console.error('Questing load failed', e);
        PROG = mergeProg(readProg(u.uid), readProg(null)); GAME = mergeGame(readGame(u.uid), readGame(null));
        ls.set(UID_KEY, u.uid); uid0 = u.uid; writeLocal(); FB.status = 'error';
      }
    }
    emit();
    /* if what's on screen was drawn from older data (another device, or just signed in/out), redraw once */
    if (sig() !== startSig && before !== sig() && !busy) {
      const guard = 'cbs.questing.reloaded';
      try { if (sessionStorage.getItem(guard) !== sig()) { sessionStorage.setItem(guard, sig()); location.reload(); } } catch (e) {}
    }
  }
  function initFirebase() {
    try {
      if (typeof firebase === 'undefined' || !window.firebaseConfig) return;
      if (!firebase.apps.length) firebase.initializeApp(window.firebaseConfig);
      FB.auth = firebase.auth(); FB.db = firebase.firestore(); FB.rtdb = firebase.database ? firebase.database() : null; FB.ok = true;
      FB.auth.onAuthStateChanged(onUser);
    } catch (e) { console.warn('Firebase unavailable', e); FB.ok = false; }
  }
  function signIn() { if (!FB.ok) return Promise.reject(new Error('offline')); return FB.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); }
  function signOut() { return FB.ok ? FB.auth.signOut() : Promise.resolve(); }

  /* ---------- progress maths ---------- */
  const qWeight = q => ('tf' in q ? 0.5 : 1);
  const qState = id => PROG.q[id] || { c: 0, n: 0, r: 0 };
  function pointState(key) {
    const qs = POINT_QS[key] || []; if (!qs.length) return { has: false };
    let total = 0, sec = 0, seen = 0, last = '';
    for (const q of qs) { const s = qState(q.id); total += qWeight(q); if (s.c === 2) sec += qWeight(q); if (s.n) seen++; if (s.l && s.l > last) last = s.l; }
    const need = Math.min(4, total), secured = sec >= need - 1e-9;
    const rusty = secured && last && dayNum(TODAY) - dayNum(last) > RUST_DAYS;
    return { has: true, total, sec, need, seen, secured, rusty, started: seen > 0, state: rusty ? 'rusty' : secured ? 'secured' : seen ? 'learning' : 'new' };
  }
  function subState(sb) {
    const pts = sb.points.filter(p => POINT_QS[p.key]); if (!pts.length) return null;
    const st = pts.map(p => pointState(p.key));
    const ready = sb.points.reduce((n, p) => n + (POINT_QS[p.key] || []).filter(q => { const s = qState(q.id); return s.c === 1 && s.d < TODAY; }).length, 0);
    return { n: pts.length, secured: st.filter(x => x.secured).length, rusty: st.filter(x => x.rusty).length, started: st.some(x => x.started), done: st.every(x => x.secured), ready };
  }
  /* sub-topics with questions (Units hidden): { key 'P3b', L, subj, topic 'P3', name, keys:Set, nq, st } */
  function allSubs() {
    const out = [];
    SPEC.forEach(s => s.topics.forEach(t => t.subs.forEach(sb => {
      if (sb.name === 'Units') return;
      const st = subState(sb); if (!st) return;
      const keys = new Set(sb.points.map(p => p.key).filter(k => POINT_QS[k]));
      const nq = [...keys].reduce((n, k) => n + POINT_QS[k].length, 0);
      out.push({ key: s.name[0] + t.n + sb.l, L: s.name[0], subj: s.name, topic: s.name[0] + t.n, name: sb.name, keys, nq, st });
    })));
    return out;
  }
  function suggestion() {
    const subs = allSubs(), unfinished = subs.filter(x => !x.st.done);
    return unfinished.filter(x => x.st.started).sort((a, b) => b.st.secured / b.st.n - a.st.secured / a.st.n)[0] || unfinished[0] || subs[0] || null;
  }
  /* three suggested fights for the mission screen: next on your path, something to win back (ready or rusty), something new */
  function picks() {
    const subs = allSubs(), out = [], used = new Set();
    const add = (sub, tag, why) => { if (sub && !used.has(sub.key)) { used.add(sub.key); out.push({ sub, tag, why }); } };
    add(suggestion(), 'Suggested', 'Next on your path');
    const rusty = subs.filter(x => x.st.rusty).sort((a, b) => b.st.rusty - a.st.rusty)[0];
    const ready = subs.filter(x => x.st.ready && !used.has(x.key)).sort((a, b) => b.st.ready - a.st.ready)[0];
    if (rusty) add(rusty, 'Rusty', `${rusty.st.rusty} spec point${rusty.st.rusty === 1 ? '' : 's'} gone rusty`);
    else if (ready) add(ready, 'Ready to secure', `${ready.st.ready} question${ready.st.ready === 1 ? '' : 's'} ready to lock in`);
    const last = out.length ? out[out.length - 1].sub.L : '';
    const fresh = subs.filter(x => !x.st.started && !used.has(x.key));
    add(fresh.find(x => x.L !== last && x.L !== (out[0] && out[0].sub.L)) || fresh[0], 'Fresh', 'Not started yet');
    if (out.length < 3) add(subs.find(x => !used.has(x.key) && !x.st.done), 'Keep going', 'More practice');
    return out;
  }
  function stats() {
    const s = securedStats(); let rustyP = 0, withQ = 0;
    for (const k in POINT_QS) { withQ++; if (pointState(k).rusty) rustyP++; }
    return Object.assign(s, { rustyP, withQ, totalQ: QUESTIONS.length });
  }
  /* secured spec points per science, as the Adventurer uses them: { b, c, p } */
  function setHide(h) { PROG.hide = !!h; PROG.updatedAt = Date.now(); save(true); }
  function securedBySci() { const p = securedStats().per; return { b: p.Biology, c: p.Chemistry, p: p.Physics }; }

  /* ---------- answering ---------- */
  function recordAnswer(q, ok) {
    const s = Object.assign({ c: 0, n: 0, r: 0 }, PROG.q[q.id]), before = pointState(q.s), notes = [];
    s.n++;
    if (ok) {
      s.r++; s.l = TODAY;
      PROG.correct++; PROG.weeks[WEEK] = (PROG.weeks[WEEK] || 0) + 1;
      const subj = POINTS[q.s] ? POINTS[q.s].subject : 'Physics'; PROG.subj[subj] = (PROG.subj[subj] || 0) + 1;
      PROG.ws = PROG.ws || {}; const w = PROG.ws[WEEK] = PROG.ws[WEEK] || {}; w[subj[0]] = (w[subj[0]] || 0) + 1;
      const xp = q.hard ? 10 : 5; PROG.xp += xp; if (q.hard) PROG.hard++;
      notes.push(`+${xp} XP`);
      if (s.c === 0) { s.c = 1; s.d = TODAY; notes.push('Get it right again <b>on another day</b> to secure it.'); }
      else if (s.c === 1 && s.d < TODAY) { s.c = 2; s.d = TODAY; PROG.xp += 20; notes.push('🔒 <b>Question secured!</b> +20 XP'); }
      else if (s.c === 1) notes.push('Already counted today: come back another day to secure it.');
      else notes.push('Still secured ✔');
      if (before.rusty) { PROG.unrusted++; notes.push('🧽 Rust polished off this spec point!'); }
    } else {
      if (s.c === 2) { s.c = 1; s.d = TODAY; notes.push('No longer secured: get it right on another day to win it back.'); }
      else if (s.c === 1) { s.c = 0; notes.push('Back to the start for this question.'); }
    }
    PROG.q[q.id] = s;
    const after = pointState(q.s);
    if (after.secured && !before.secured && POINTS[q.s]) {
      notes.push(`📌 <b>Spec point ${POINTS[q.s].subject} ${POINTS[q.s].id} secured!</b>`);
      if (!PROG.earned['p:' + q.s]) { PROG.earned['p:' + q.s] = TODAY; PROG.xp += 100; notes.push('+100 XP'); }
    }
    PROG.updatedAt = Date.now();
    writeLocal();
    return notes;
  }
  /* ten questions: ready to secure → rusty → got wrong before → new, from the chosen spec points;
     if they don't have ten questions between them, the rest come from `fill` (e.g. the whole topic) */
  function buildMission(keys, fill) {
    const pick = [], used = new Set();
    const take = (list, n) => { for (const q of shuffle(list)) { if (n <= 0 || pick.length >= MISSION_LEN) break; if (!used.has(q.id)) { used.add(q.id); pick.push(q); n--; } } };
    const fillFrom = pool => {
      const ready = pool.filter(q => { const s = qState(q.id); return s.c === 1 && s.d < TODAY; });
      const rusty = pool.filter(q => pointState(q.s).rusty);
      const learning = pool.filter(q => { const s = qState(q.id); return s.n && s.c === 0; });
      const fresh = pool.filter(q => !qState(q.id).n);
      take(ready, 4); take(rusty, 2); take(learning, 2);
      take(fresh, MISSION_LEN); take(learning, MISSION_LEN);
      take(pool.filter(q => qState(q.id).c === 1), MISSION_LEN);
      take(pool, MISSION_LEN);
    };
    fillFrom(QUESTIONS.filter(q => !keys || keys.has(q.s)));
    if (fill && pick.length < MISSION_LEN) fillFrom(QUESTIONS.filter(q => fill.has(q.s)));
    return shuffle(pick).map(inst);
  }
  /* a finished mission: counts it, adds coins and loot, saves everything */
  function finishMission({ coins = 0, loot = null } = {}) {
    PROG.missions++; PROG.updatedAt = Date.now();
    GAME.coins = (GAME.coins || 0) + coins;
    if (loot) { GAME.bag = [...new Set([...(GAME.bag || []), loot])]; GAME.lastLoot = loot; }
    GAME.days[TODAY] = (GAME.days[TODAY] || 0) + 1;
    GAME.updatedAt = Date.now();
    return save(true);
  }
  function missionsToday() { return GAME.days[TODAY] || 0; }
  function gameChanged() { GAME.updatedAt = Date.now(); save(); }

  /* ---------- the class board (Realtime Database, signed-in only) ---------- */
  function board() {
    if (!FB.rtdb || !FB.user) return Promise.reject(new Error(FB.user ? 'offline' : 'signin'));
    return FB.rtdb.ref('specQuizBoard').once('value').then(s => {
      const v = s.val() || {};
      return Object.entries(v).filter(([, x]) => x && !x.hide).map(([uid, x]) => Object.assign({ uid, me: uid === FB.user.uid }, x));
    });
  }

  /* ---------- "Report this question" (same store as the quick quiz) ---------- */
  const REPORT_REASONS = ['The marked answer is wrong', 'More than one answer is right', 'The wording is confusing', 'Spelling or typing mistake', 'Not on the spec / too hard', 'Something else'];
  function report(q, options, correctIdx, pickedIdx, reason, comment) {
    const u = FB.user, n = u && u.displayName ? u.displayName.trim().split(/\s+/) : null;
    const rep = { qid: q.id, reason, comment: (comment || '').slice(0, 400), shown: (q.q || '').replace(/<[^>]+>/g, '').slice(0, 400),
      options: options.map(o => String(o).replace(/<[^>]+>/g, '').slice(0, 120)), correct: correctIdx, picked: pickedIdx, mode: 'questing',
      name: n ? n[0] + (n.length > 1 ? ' ' + n[n.length - 1][0] + '.' : '') : '', uid: u ? u.uid : '', t: Date.now() };
    try { if (!FB.ok || !FB.rtdb) throw new Error('offline'); return FB.rtdb.ref('specQuizReports').push(rep); }
    catch (e) { return Promise.reject(e); }
  }

  /* keep the look in the account when the creator/wardrobe pages change it */
  if (syncLookIntoGame()) writeLocal();
  initFirebase();

  return {
    get prog() { return PROG; }, get game() { return GAME; }, get user() { return FB.user; }, get status() { return FB.status; }, get known() { return FB.known; },
    get online() { return FB.ok; }, set busy(v) { busy = !!v; }, get busy() { return busy; },
    TODAY, WEEK, RUST_DAYS, MISSION_LEN, POINTS, POINT_QS, onChange: f => listeners.push(f),
    signIn, signOut, save, setHide, gameChanged, syncLook: () => { if (syncLookIntoGame()) save(); },
    qState, pointState, subState, allSubs, suggestion, picks, stats, securedBySci,
    recordAnswer, buildMission, finishMission, missionsToday, board, report, REPORT_REASONS, shuffle,
  };
})();
