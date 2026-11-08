/* Spec Quiz: CAMPAIGN mode. Work through the whole spec alone; progress saved to the student's account (Firebase) or this browser.
   Needs spec.js, questions.js, gens.js, rewards.js, quiz.js.

   RULES
   - A question is SECURED when answered right first time in two different sessions on different days. A wrong answer drops it
     back (secured → needs one more correct on a later day; otherwise back to zero).
   - True/false questions count half towards a spec point (50% guess chance).
   - A spec point is SECURED when its secured questions are worth at least min(4, total value of its questions).
   - A secured point goes RUSTY if none of its questions has been answered correctly for 21 days. One correct answer polishes it.
   - XP: 5 per correct answer (10 if ★ harder), +20 when a question is secured, +100 the first time a spec point is secured.

   SAVED DATA
   Firestore users/{uid}.specQuiz = PROG (below) and users/{uid}.specQuizSummary = { xp, rank, securedQ, securedP, correct, updatedAt }
   Realtime Database specQuizBoard/{uid} = { name, xp, rank, pts, wk, wkCorrect, bio, chem, phys, hide, t }  (leaderboards + legends)
   PROG = { v, q: { id: { c: 0|1|2, d: day of last qualifying correct, l: day of last correct, n: answered, r: right } },
            xp, correct, hard, subj: { Biology, Chemistry, Physics }, weeks: { '2026-W45': correct that week }, missions, unrusted,
            earned: { rewardId: day }, hide, updatedAt } */

const CAMP = { mission: null, tab: 'map', subj: 'Physics' };
const RUST_DAYS = 21, MISSION_LEN = 10;

/* ---------- dates ---------- */
const TODAY = (() => { const m = /[?&]today=(\d{4}-\d{2}-\d{2})/.exec(location.search); if (m) return m[1]; const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); })();
const dayNum = s => Math.round(Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) / 864e5);
function isoWeek(s) {
  const d = new Date(Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10))); const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day); const y0 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return d.getUTCFullYear() + '-W' + String(Math.ceil(((d - y0) / 864e5 + 1) / 7)).padStart(2, '0');
}
const WEEK = isoWeek(TODAY);
function prevWeek(wk) { const [y, w] = wk.split('-W').map(Number); const d = new Date(Date.UTC(y, 0, 4 + (w - 1) * 7 - 7)); return isoWeek(d.toISOString().slice(0, 10)); }

/* ---------- progress store (local + Firebase) ---------- */
const blank = () => ({ v: 1, q: {}, xp: 0, correct: 0, hard: 0, subj: { Biology: 0, Chemistry: 0, Physics: 0 }, weeks: {}, missions: 0, unrusted: 0, earned: {}, hide: false, updatedAt: 0 });
let PROG = blank();
const FB = { ok: false, auth: null, db: null, rtdb: null, user: null, status: 'local', board: null, boardErr: null };
const localKey = uid => 'specquiz.camp.' + (uid || 'anon');
function readLocal(uid) { try { return Object.assign(blank(), JSON.parse(localStorage.getItem(localKey(uid))) || {}); } catch (e) { return blank(); } }
function writeLocal() { try { localStorage.setItem(localKey(FB.user && FB.user.uid), JSON.stringify(PROG)); } catch (e) {} }

function mergeProg(a, b) {
  const o = blank();
  for (const id of new Set([...Object.keys(a.q), ...Object.keys(b.q)])) {
    const x = a.q[id], y = b.q[id];
    o.q[id] = !x ? y : !y ? x : ((y.n || 0) > (x.n || 0) || ((y.n || 0) === (x.n || 0) && (y.l || '') > (x.l || '')) ? y : x);
  }
  for (const k of ['xp', 'correct', 'hard', 'missions', 'unrusted', 'updatedAt']) o[k] = Math.max(a[k] || 0, b[k] || 0);
  for (const k in o.subj) o.subj[k] = Math.max((a.subj || {})[k] || 0, (b.subj || {})[k] || 0);
  for (const src of [a.weeks || {}, b.weeks || {}]) for (const k in src) o.weeks[k] = Math.max(o.weeks[k] || 0, src[k]);
  for (const src of [a.earned || {}, b.earned || {}]) for (const k in src) o.earned[k] = o.earned[k] && o.earned[k] < src[k] ? o.earned[k] : src[k];
  o.hide = !!(a.hide || b.hide);
  return o;
}

function initFirebase() {
  try {
    if (typeof firebase === 'undefined' || !window.firebaseConfig) return;
    if (!firebase.apps.length) firebase.initializeApp(window.firebaseConfig);
    FB.auth = firebase.auth(); FB.db = firebase.firestore(); FB.rtdb = firebase.database ? firebase.database() : null; FB.ok = true;
    FB.auth.onAuthStateChanged(onUser);
  } catch (e) { console.warn('Firebase unavailable', e); FB.ok = false; }
}
async function onUser(u) {
  FB.user = u;
  if (!u) { PROG = readLocal(null); FB.status = 'local'; campRedraw(); return; }
  FB.status = 'loading'; campRedraw();
  try {
    const snap = await FB.db.collection('users').doc(u.uid).get();
    const remote = Object.assign(blank(), (snap.exists && snap.data().specQuiz) || {});
    PROG = mergeProg(mergeProg(remote, readLocal(u.uid)), readLocal(null));
    try { localStorage.removeItem(localKey(null)); } catch (e) {}
    checkRewards(); writeLocal(); await saveRemote();
  } catch (e) { console.error('Campaign load failed', e); PROG = mergeProg(readLocal(u.uid), readLocal(null)); FB.status = 'error'; }
  loadBoard(); campRedraw();
}
async function saveRemote() {
  if (!FB.ok || !FB.user) return;
  FB.status = 'saving'; campStatus();
  const st = stats();
  try {
    await FB.db.collection('users').doc(FB.user.uid).set({
      email: FB.user.email || null, displayName: FB.user.displayName || null, lastAccess: new Date().toISOString(),
      specQuiz: PROG, specQuizSummary: { xp: PROG.xp, rank: rankFor(PROG.xp).name, securedQ: st.securedQ, securedP: st.securedP, correct: PROG.correct, updatedAt: new Date().toISOString() }
    }, { merge: true });
    FB.status = 'saved';
  } catch (e) { console.error('Campaign save failed', e); FB.status = 'error'; }
  campStatus();
  saveBoard(st);
}
function boardName() { const n = (FB.user && FB.user.displayName || 'Student').trim().split(/\s+/); return n[0] + (n.length > 1 ? ' ' + n[n.length - 1][0] + '.' : ''); }
async function saveBoard(st) {
  if (!FB.rtdb || !FB.user) return;
  try {
    await FB.rtdb.ref('specQuizBoard/' + FB.user.uid).set({ name: boardName(), xp: PROG.xp, rank: rankFor(PROG.xp).i, pts: st.securedP, wk: WEEK, wkCorrect: PROG.weeks[WEEK] || 0,
      bio: PROG.subj.Biology || 0, chem: PROG.subj.Chemistry || 0, phys: PROG.subj.Physics || 0, hide: !!PROG.hide, t: Date.now() });
    FB.boardErr = null; loadBoard();
  } catch (e) { console.warn('Leaderboard save failed', e); FB.boardErr = 'save'; }
}
async function loadBoard() {
  if (!FB.rtdb) return;
  try { const snap = await FB.rtdb.ref('specQuizBoard').once('value'); FB.board = snap.val() || {}; FB.boardErr = null; }
  catch (e) { console.warn('Leaderboard load failed', e); FB.boardErr = 'load'; }
  if (CAMP.tab === 'board' || CAMP.tab === 'gear') campRedraw();
}

/* ---------- state calculations ---------- */
const qWeight = q => ('tf' in q ? 0.5 : 1);
const POINT_QS = {}; QUESTIONS.forEach(q => (POINT_QS[q.s] = POINT_QS[q.s] || []).push(q));
const qState = id => PROG.q[id] || { c: 0, n: 0, r: 0 };
function pointState(key) {
  const qs = POINT_QS[key] || []; if (!qs.length) return { has: false };
  let total = 0, sec = 0, seen = 0, last = '';
  for (const q of qs) { const s = qState(q.id); total += qWeight(q); if (s.c === 2) sec += qWeight(q); if (s.n) seen++; if (s.l && s.l > last) last = s.l; }
  const need = Math.min(4, total), secured = sec >= need - 1e-9;
  const rusty = secured && last && dayNum(TODAY) - dayNum(last) > RUST_DAYS;
  return { has: true, total, sec, need, seen, secured, rusty, started: seen > 0, state: rusty ? 'rusty' : secured ? 'secured' : seen ? 'learning' : 'new' };
}
const subKey = (s, t, sb) => s.name[0] + t.n + sb.l;
function subState(sb) {
  const pts = sb.points.filter(p => POINT_QS[p.key]); if (!pts.length) return null;
  const st = pts.map(p => pointState(p.key));
  return { n: pts.length, secured: st.filter(x => x.secured).length, rusty: st.filter(x => x.rusty).length, started: st.some(x => x.started), done: st.every(x => x.secured) };
}
function stats() {
  let securedQ = 0, securedP = 0, withQ = 0, rustyP = 0;
  for (const q of QUESTIONS) if (qState(q.id).c === 2) securedQ++;
  for (const k in POINT_QS) { withQ++; const p = pointState(k); if (p.secured) securedP++; if (p.rusty) rustyP++; }
  let streak = 0, wk = PROG.weeks[WEEK] ? WEEK : prevWeek(WEEK);
  while (PROG.weeks[wk]) { streak++; wk = prevWeek(wk); }
  return { securedQ, securedP, withQ, rustyP, totalQ: QUESTIONS.length, streak };
}

/* ---------- rewards ---------- */
function rewardList() {
  const out = [];
  // A topic counts as complete only when EVERY sub-topic in it (apart from 'Units') has questions and is secured,
  // so a topic or subject badge can't be won while most of it has no questions yet.
  SPEC.forEach(s => {
    let subjAll = [], subjReady = true;
    s.topics.forEach(t => {
      let topAll = [], ready = true;
      t.subs.forEach(sb => { const st = subState(sb); if (!st) { if (sb.name !== 'Units') ready = false; return; } const k = subKey(s, t, sb); out.push({ id: 'sb:' + k, kind: 'sub', s, t, sb, done: st.done }); topAll.push(st.done); });
      if (topAll.length) { const done = ready && topAll.every(Boolean); out.push({ id: 'tp:' + s.name[0] + t.n, kind: 'topic', s, t, done, ready }); subjAll.push(done); }
      else subjReady = false;
    });
    if (subjAll.length) out.push({ id: 'sj:' + s.name, kind: 'subj', s, done: subjReady && subjAll.every(Boolean), ready: subjReady });
  });
  const st = stats(), val = { correct: PROG.correct, missions: PROG.missions, securedQ: st.securedQ, securedP: st.securedP, hard: PROG.hard, streak: st.streak, unrusted: PROG.unrusted };
  MILESTONES.forEach(m => out.push({ id: m.id, kind: 'mile', m, done: (val[m.stat] || 0) >= m.n }));
  GEAR.forEach(g => { const tp = out.find(r => r.id === 'tp:' + g.topic); out.push({ id: g.id, kind: 'gear', g, done: !!(tp && tp.done) }); });
  GEAR_MILESTONES.forEach(g => out.push({ id: g.id, kind: 'gearm', g, done: st.securedQ >= g.n }));
  return out;
}
function checkRewards() { const fresh = []; for (const r of rewardList()) if (r.done && !PROG.earned[r.id]) { PROG.earned[r.id] = TODAY; fresh.push(r); } return fresh; }

/* ---------- answering ---------- */
function recordAnswer(q, ok) {
  const s = Object.assign({ c: 0, n: 0, r: 0 }, PROG.q[q.id]), before = pointState(q.s), notes = [];
  const rankBefore = rankFor(PROG.xp);
  s.n++;
  if (ok) {
    s.r++; const wasLast = s.l; s.l = TODAY;
    PROG.correct++; PROG.weeks[WEEK] = (PROG.weeks[WEEK] || 0) + 1;
    const subj = POINTS[q.s].subject; PROG.subj[subj] = (PROG.subj[subj] || 0) + 1;
    const xp = q.hard ? 10 : 5; PROG.xp += xp; if (q.hard) PROG.hard++;
    notes.push(`+${xp} XP`);
    if (s.c === 0) { s.c = 1; s.d = TODAY; notes.push('Answer it right again <b>on another day</b> to secure it.'); }
    else if (s.c === 1 && s.d < TODAY) { s.c = 2; s.d = TODAY; PROG.xp += 20; notes.push('🔒 <b>Question secured!</b> +20 XP'); }
    else if (s.c === 1) notes.push('Already counted today: come back on another day to secure it.');
    else notes.push('Still secured ✔');
    if (before.rusty) { PROG.unrusted++; notes.push('🧽 Rust polished off this spec point!'); }
  } else {
    if (s.c === 2) { s.c = 1; s.d = TODAY; notes.push('This one is no longer secured: get it right on another day to win it back.'); }
    else if (s.c === 1) { s.c = 0; notes.push('Back to the start for this question.'); }
  }
  PROG.q[q.id] = s;
  const after = pointState(q.s);
  if (after.secured && !before.secured) {
    notes.push(`📌 <b>Spec point ${POINTS[q.s].subject} ${POINTS[q.s].id} secured!</b>`);
    if (!PROG.earned['p:' + q.s]) { PROG.earned['p:' + q.s] = TODAY; PROG.xp += 100; notes.push('+100 XP'); }
  }
  PROG.updatedAt = Date.now();
  const rankAfter = rankFor(PROG.xp);
  if (rankAfter.i > rankBefore.i) notes.push(`🎖️ <b>Promoted to ${rankAfter.name}!</b>`);
  writeLocal();
  return notes;
}

/* ---------- missions ---------- */
function buildMission(subFilter) {
  const pool = QUESTIONS.filter(q => !subFilter || subFilter.has(q.s));
  const today = dayNum(TODAY), pick = [], used = new Set();
  const take = (list, n) => { for (const q of shuffle(list)) { if (n <= 0 || pick.length >= MISSION_LEN) break; if (!used.has(q.id)) { used.add(q.id); pick.push(q); n--; } } };
  const ready = pool.filter(q => { const s = qState(q.id); return s.c === 1 && s.d < TODAY; });
  const rusty = pool.filter(q => pointState(q.s).rusty);
  const learning = pool.filter(q => { const s = qState(q.id); return s.n && s.c === 0; });
  const fresh = pool.filter(q => !qState(q.id).n);
  take(ready, 4); take(rusty, 2); take(learning, 2);
  // new questions: keep them focused on the suggested sub-topic(s) so a mission isn't all over the spec
  const focus = subFilter ? null : suggestion();
  if (focus) take(fresh.filter(q => focus.keys.has(q.s)), MISSION_LEN);
  take(fresh, MISSION_LEN); take(learning, MISSION_LEN);
  take(pool.filter(q => qState(q.id).c === 1), MISSION_LEN);
  take(pool, MISSION_LEN);                                   // everything secured already: keep practising
  return shuffle(pick).map(inst);
}
function allSubs() { const out = []; SPEC.forEach(s => s.topics.forEach(t => t.subs.forEach(sb => { const st = subState(sb); if (st) out.push({ s, t, sb, st, key: subKey(s, t, sb), keys: new Set(sb.points.map(p => p.key).filter(k => POINT_QS[k])) }); }))); return out; }
function suggestion() {
  const subs = allSubs(), unfinished = subs.filter(x => !x.st.done);
  return unfinished.filter(x => x.st.started).sort((a, b) => b.st.secured / b.st.n - a.st.secured / a.st.n)[0] || unfinished.find(x => x.s.name === CAMP.subj) || unfinished[0] || null;
}

function startMission(sub) {
  const qs = buildMission(sub ? sub.keys : null);
  CAMP.mission = { qs, qi: -1, right: 0, xp0: PROG.xp, rank0: rankFor(PROG.xp), sec0: stats(), title: sub ? `Train: ${sub.s.name} ${sub.t.n}(${sub.sb.l}) ${sub.sb.name}` : 'Mission', sub, res: [] };
  SOLO = TEAM = null; show('play'); nextMissionQ();
}
function missionHud() {
  const m = CAMP.mission, r = rankFor(PROG.xp);
  const pips = m.qs.map((_, i) => `<i class="${i < m.res.length ? (m.res[i] ? 'done' : 'miss') : i === m.qi ? 'now' : ''}"></i>`).join('');
  $('hud').innerHTML = `<div><span class="meta">${esc(m.title)} · Question ${m.qi + 1} of ${m.qs.length}</span><div class="rname">Campaign</div><div class="pips">${pips}</div></div>
    <div class="hudrank">${insignia(r, 40)}<div class="score">${PROG.xp}<small>XP · ${esc(r.name.toUpperCase())}</small></div></div>`;
}
function nextMissionQ() {
  const m = CAMP.mission; m.qi++;
  if (m.qi >= m.qs.length) return missionEnd();
  const q = m.qs[m.qi]; missionHud();
  $('stage').innerHTML = '<div id="qbox"></div><div id="fb"></div><div class="nextrow" id="nextrow"></div>';
  const ctl = renderQ(q, $('qbox'), ok => {
    ctl.stop(); if (!ok) ctl.reveal();
    m.res.push(ok); if (ok) m.right++;
    const notes = recordAnswer(q, ok);
    missionHud();
    $('fb').innerHTML = `<div class="fb ${ok ? '' : 'bad'}"><b>${ok ? 'Correct!' : 'Not quite.'}</b> ${nuc(q.x)}<div class="campnote">${notes.join(' · ')}</div></div>`;
    $('nextrow').innerHTML = `<button class="btn big green" id="nx">${m.qi === m.qs.length - 1 ? 'Finish mission' : 'Next'} →</button>`;
    $('nx').onclick = nextMissionQ; $('nx').focus({ preventScroll: true });
  });
  KEYS = ctl;
}
function missionEnd() {
  KEYS = null; const m = CAMP.mission;
  PROG.missions++;
  const fresh = checkRewards(); PROG.updatedAt = Date.now(); writeLocal(); saveRemote();
  const st = stats(), r = rankFor(PROG.xp), promoted = r.i > m.rank0.i;
  const card = rw => rw.kind === 'gear' || rw.kind === 'gearm' ? `<div class="newrw">${gearSVG(rw.g.art, 84)}<b>${esc(rw.g.name)}</b><span>New gear</span></div>`
    : `<div class="newrw">${badgeSVG(rw, 84)}<b>${esc(badgeName(rw))}</b><span>New badge</span></div>`;
  $('results').innerHTML = `<div class="card"><div class="in">
    <h2>Mission complete</h2>
    <div class="mstats"><div><b>${m.right}/${m.qs.length}</b><span>correct</span></div><div><b>+${PROG.xp - m.xp0}</b><span>XP</span></div>
      <div><b>${st.securedQ - m.sec0.securedQ >= 0 ? '+' : ''}${st.securedQ - m.sec0.securedQ}</b><span>questions secured</span></div><div><b>${st.securedP - m.sec0.securedP >= 0 ? '+' : ''}${st.securedP - m.sec0.securedP}</b><span>spec points secured</span></div></div>
    ${promoted ? `<div class="promo">${insignia(r, 80)}<div><small>PROMOTED</small><b>${esc(r.name)}</b></div></div>` : ''}
    ${fresh.length ? `<h3>New rewards</h3><div class="newrws">${fresh.map(card).join('')}</div>` : ''}
    <p class="small" style="margin-top:12px">${FB.user ? 'Saving to your account…' : 'Saved in this browser only. Sign in with Google on the campaign screen to keep your progress safe and appear on the leaderboards.'}</p>
    <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn big green" id="again">Another mission</button><button class="btn big alt" id="tocamp">Campaign map</button></div>
  </div></div>`;
  $('again').onclick = () => startMission(m.sub);
  $('tocamp').onclick = openCampaign;
  CAMP.mission = null; show('results');
}

/* ---------- campaign screen ---------- */
function badgeName(rw) {
  if (rw.kind === 'sub') return `${rw.s.name} ${rw.t.n}(${rw.sb.l}) ${rw.sb.name}`;
  if (rw.kind === 'topic') return `${rw.s.name} ${rw.t.n}: ${rw.t.name}`;
  if (rw.kind === 'subj') return `${rw.s.name} complete`;
  return rw.m.name;
}
function badgeSVG(rw, size, locked) {
  if (rw.kind === 'mile') return patch({ color: '#6d28d9', icon: rw.m.icon, label: '', shape: 'square', locked, size });
  const col = SUBJ_HEX[rw.s.name];
  if (rw.kind === 'sub') return patch({ color: col, icon: TOPIC_ICON[rw.s.name[0] + rw.t.n], label: `${rw.s.name[0]}${rw.t.n}(${rw.sb.l})`, locked, size });
  if (rw.kind === 'topic') return patch({ color: shade(col, -15), icon: TOPIC_ICON[rw.s.name[0] + rw.t.n], label: `${rw.s.name[0]}${rw.t.n}`, shape: 'shield', locked, size });
  return patch({ color: '#111', icon: { Biology: '🧫', Chemistry: '⚗️', Physics: '🔭' }[rw.s.name], label: rw.s.name.toUpperCase(), shape: 'hex', locked, size });
}

function openCampaign() { if (TEAM && TEAM.stop) TEAM.stop(); SOLO = TEAM = KEYS = null; CAMP.mission = null; show('campaign'); campRedraw(); }
function campStatus() {
  const el = $('campSync'); if (!el) return;
  if (!FB.ok) { el.innerHTML = '<span class="sync warn">Saving to this browser only (account saving unavailable here)</span>'; return; }
  if (!FB.user) { el.innerHTML = '<span class="sync warn">Not signed in: progress is saved in this browser only.</span> <button class="btn green" id="signIn">Sign in with Google</button>'; $('signIn').onclick = () => FB.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(e => console.error(e)); return; }
  const lab = { loading: 'Loading…', saving: 'Saving…', saved: 'Saved ✓', error: 'Couldn’t save: will retry after your next mission', local: '' }[FB.status] || '';
  el.innerHTML = `<span class="sync ${FB.status === 'error' ? 'warn' : ''}">Signed in as <b>${esc(FB.user.displayName || FB.user.email || '')}</b> · ${lab}</span> <button class="linkbtn" id="signOut">Sign out</button>`;
  $('signOut').onclick = () => FB.auth.signOut();
}

function campRedraw() {
  if ($('campaign').classList.contains('hidden')) return;
  checkRewards(); writeLocal();
  const st = stats(), r = rankFor(PROG.xp), next = RANKS[r.i + 1], sug = suggestion();
  const pct = next ? Math.round((PROG.xp - r.xp) / (next.xp - r.xp) * 100) : 100;
  $('campaign').innerHTML = `<a class="back" href="#" id="cBack">← Spec Quiz menu</a>
    <div class="camphead card"><div class="in">
      <div class="who">${insignia(r, 84)}<div><small>RANK ${r.i + 1} OF ${RANKS.length}</small><h1>${esc(r.name)}</h1>
        <div class="xpbar"><i style="width:${pct}%"></i></div><div class="small">${PROG.xp} XP${next ? ` · ${next.xp - PROG.xp} XP to <b>${esc(next.name)}</b>` : ' · top rank!'}</div></div></div>
      <div class="cstats"><div><b>${st.securedP}<small>/${st.withQ}</small></b><span>spec points secured</span></div><div><b>${st.securedQ}<small>/${st.totalQ}</small></b><span>questions secured</span></div>
        <div><b>${PROG.weeks[WEEK] || 0}</b><span>correct this week</span></div><div><b>${st.streak}</b><span>week streak</span></div>${st.rustyP ? `<div class="rust"><b>${st.rustyP}</b><span>rusty points</span></div>` : ''}</div>
      <div id="campSync" class="campsync"></div>
      <div class="go"><button class="btn big green" id="goMission">Start mission →</button>
        <span class="small">${MISSION_LEN} questions: ones you're about to secure, rusty points, then new ones${sug ? ` from <b>${esc(sug.s.name)} ${sug.t.n}(${sug.sb.l}) ${esc(sug.sb.name)}</b>` : ''}.</span></div>
    </div></div>
    <div class="ctabs">${[['map', 'Map'], ['badges', 'Badges'], ['gear', 'Trattoria'], ['board', 'Leaderboards'], ['how', 'How it works']].map(([k, v]) => `<button class="chip ${CAMP.tab === k ? 'on' : ''}" data-tab="${k}">${v}</button>`).join('')}</div>
    <div id="ctab"></div>`;
  $('cBack').onclick = ev => { ev.preventDefault(); menu(); };
  $('goMission').onclick = () => startMission(null);
  $('campaign').querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { CAMP.tab = b.dataset.tab; campRedraw(); if (CAMP.tab === 'board' || CAMP.tab === 'gear') loadBoard(); });
  campStatus();
  ({ map: tabMap, badges: tabBadges, gear: tabGear, board: tabBoard, how: tabHow })[CAMP.tab]($('ctab'), sug);
}

function tabMap(box, sug) {
  const subjects = SPEC.map(s => { const subs = allSubs().filter(x => x.s === s); const n = subs.reduce((a, x) => a + x.st.n, 0), d = subs.reduce((a, x) => a + x.st.secured, 0); return { s, n, d }; });
  const s = SPEC.find(x => x.name === CAMP.subj);
  box.innerHTML = `<div class="subjtabs">${subjects.map(x => `<button class="subjtab ${x.s.name === CAMP.subj ? 'on' : ''}" data-subj="${x.s.name}" style="--sc:${SUBJ_HEX[x.s.name]}"><b>${x.s.name}</b><span>${x.d}/${x.n} points secured</span><i style="width:${x.n ? x.d / x.n * 100 : 0}%"></i></button>`).join('')}</div>
    <div class="cmap">${s.topics.map(t => {
      const subs = t.subs.map(sb => ({ sb, st: subState(sb) })), live = subs.filter(x => x.st), soon = subs.length - live.length;
      return `<div class="ctopic"><h3><span class="tnum">${t.n}</span> ${esc(t.name)} <span class="ticon">${TOPIC_ICON[s.name[0] + t.n] || ''}</span></h3>
        ${live.length ? live.map(({ sb, st }) => {
          const key = subKey(s, t, sb), isSug = sug && sug.key === key;
          const pts = sb.points.filter(p => POINT_QS[p.key]).map(p => { const ps = pointState(p.key); return `<span class="pdot ${ps.state}" title="${esc(p.id + ': ' + p.text)}">${p.id}<small>${ps.state === 'learning' ? ` ${+ps.sec.toFixed(1)}/${ps.need}` : ''}</small></span>`; }).join('');
          return `<div class="csub ${st.done ? 'done' : ''} ${isSug ? 'sug' : ''}">
            <div class="csubhead">${badgeSVG({ kind: 'sub', s, t, sb }, 46, !st.done)}<div class="csubname"><b>(${sb.l}) ${esc(sb.name)}</b>${isSug ? ' <span class="sugtag">Suggested next</span>' : ''}<div class="pbar"><i style="width:${st.secured / st.n * 100}%"></i></div><span class="small">${st.secured}/${st.n} spec points secured${st.rusty ? ` · <span style="color:#b45309">${st.rusty} rusty</span>` : ''}</span></div>
            <button class="btn alt" data-train="${key}">Train →</button></div>
            <div class="pdots">${pts}</div></div>`;
        }).join('') : ''}
        ${soon ? `<p class="small soon">${live.length ? '+ ' : ''}${soon} sub-topic${soon > 1 ? 's' : ''} coming soon</p>` : ''}</div>`;
    }).join('')}</div>
    <p class="small" style="margin-top:10px"><span class="pdot new">new</span> <span class="pdot learning">learning</span> <span class="pdot secured">secured</span> <span class="pdot rusty">rusty</span> Hover a spec point to see what it says.</p>`;
  box.querySelectorAll('[data-subj]').forEach(b => b.onclick = () => { CAMP.subj = b.dataset.subj; campRedraw(); });
  box.querySelectorAll('[data-train]').forEach(b => b.onclick = () => startMission(allSubs().find(x => x.key === b.dataset.train)));
}

function tabBadges(box) {
  const list = rewardList().filter(r => !r.kind.startsWith('gear'));
  const earned = list.filter(r => PROG.earned[r.id]).length;
  const grp = (title, items) => items.length ? `<h3>${title}</h3><div class="bgrid">${items.map(r => { const got = PROG.earned[r.id]; return `<div class="bcell ${got ? '' : 'off'}" title="${esc(r.kind === 'mile' ? r.m.desc : badgeName(r))}">${badgeSVG(r, 88, !got)}<b>${esc(badgeName(r))}</b><span>${got ? 'Earned ' + got : r.kind === 'mile' ? esc(r.m.desc) : 'Secure every spec point' + (r.ready === false ? ' (some sub-topics coming soon)' : '')}</span></div>`; }).join('')}</div>` : '';
  box.innerHTML = `<p class="small">${earned} of ${list.length} badges earned. Sub-topic badges come from securing every spec point in that sub-topic; topic and subject badges from securing all of them.</p>
    ${grp('Subjects', list.filter(r => r.kind === 'subj'))}${grp('Topics', list.filter(r => r.kind === 'topic'))}${grp('Sub-topics', list.filter(r => r.kind === 'sub'))}${grp('Milestones', list.filter(r => r.kind === 'mile'))}`;
}

function legendHolders() {
  const out = {}; if (!FB.board) return out;
  const rows = Object.entries(FB.board).map(([uid, v]) => ({ uid, ...v })).filter(v => !v.hide);
  for (const [subj, f] of [['Biology', 'bio'], ['Chemistry', 'chem'], ['Physics', 'phys']]) {
    const top = rows.filter(v => (v[f] || 0) > 0).sort((a, b) => (b[f] || 0) - (a[f] || 0) || (a.t || 0) - (b.t || 0))[0];
    if (top) out[subj] = { name: top.name, n: top[f], me: FB.user && top.uid === FB.user.uid };
  }
  return out;
}
function tabGear(box) {
  const hold = legendHolders(), st = stats();
  const topicGear = GEAR.map(g => { const got = PROG.earned[g.id]; const s = SPEC.find(x => x.name[0] === g.topic[0]), t = s.topics.find(x => x.n === +g.topic.slice(1));
    const live = t && t.subs.every(sb => subState(sb) || sb.name === 'Units');
    return `<div class="gcell ${got ? '' : 'off'}">${gearSVG(g.art, 96, !got)}<b>${esc(g.name)}</b><span>${got ? esc(g.blurb) : `Secure all of ${s.name} ${g.topic.slice(1)}: ${esc(t.name)}${live ? '' : ' (coming soon)'}`}</span></div>`; }).join('');
  const mileGear = GEAR_MILESTONES.map(g => { const got = PROG.earned[g.id]; return `<div class="gcell ${got ? '' : 'off'}">${gearSVG(g.art, 96, !got)}<b>${esc(g.name)}</b><span>${got ? esc(g.blurb) : `Secure ${g.n} question${g.n > 1 ? 's' : ''} (${st.securedQ}/${g.n})`}</span></div>`; }).join('');
  box.innerHTML = `<h3>Legendary trophies</h3><p class="small">One per subject, held by whoever has the most correct answers in that subject on the leaderboard. Anyone can take it off them.</p>
    <div class="legends">${Object.keys(LEGENDS).map(k => { const h = hold[k], L = LEGENDS[k]; return `<div class="lcell ${h && h.me ? 'mine' : ''}" style="--sc:${SUBJ_HEX[k]}">${legendSVG(k, 120, !(h && h.me))}<div><small>${k.toUpperCase()}</small><b>${esc(L.name)}</b><span>${esc(L.blurb)}</span>
      <em>${h ? (h.me ? `👑 You hold it! (${h.n} correct)` : `Held by ${esc(h.name)} (${h.n} correct). You have ${PROG.subj[k] || 0}.`) : FB.boardErr ? 'Leaderboard unavailable right now.' : FB.user ? 'Nobody holds it yet.' : 'Sign in to compete for it.'}</em></div></div>`; }).join('')}</div>
    <h3>Your trattoria: topic gear</h3><div class="ggrid">${topicGear}</div>
    <h3>Milestone gear</h3><div class="ggrid">${mileGear}</div>`;
}

function tabBoard(box) {
  const me = FB.user && FB.user.uid;
  const head = `<label class="toggle"><input type="checkbox" id="hideMe" ${PROG.hide ? '' : 'checked'} ${FB.user ? '' : 'disabled'}> Show me on the leaderboards (first name and initial only)</label>`;
  if (!FB.user) { box.innerHTML = `<p style="margin-top:10px">Sign in with Google (above) to see the leaderboards and appear on them.</p>`; return; }
  if (FB.boardErr === 'load' || (!FB.board && FB.boardErr)) { box.innerHTML = head + `<p class="note">The leaderboards can't be reached right now. (Teacher: the Realtime Database rules need to allow <code>specQuizBoard</code>.)</p>`; bindHide(); return; }
  if (!FB.board) { box.innerHTML = head + '<p class="small">Loading…</p>'; bindHide(); return; }
  const rows = Object.entries(FB.board).map(([uid, v]) => ({ uid, ...v })).filter(v => !v.hide || v.uid === me);
  const table = (title, sub, list, val, unit) => {
    const pos = list.findIndex(v => v.uid === me);
    const top = list.slice(0, 10).map((v, i) => `<li class="${v.uid === me ? 'me' : ''}"><span class="rk">${i + 1}</span>${insignia(RANKS[v.rank || 0], 26)}<span class="nm">${esc(v.name || '?')}</span><span class="sc">${val(v)} <small>${unit}</small></span></li>`).join('');
    return `<div class="lb"><h3>${title}</h3><p class="small">${sub}</p><ol>${top || '<li class="empty">Nobody yet. Be the first!</li>'}</ol>${pos >= 10 ? `<p class="small">You are <b>#${pos + 1}</b> with ${val(list[pos])} ${unit}.</p>` : ''}</div>`;
  };
  const week = rows.filter(v => v.wk === WEEK && v.wkCorrect > 0).sort((a, b) => b.wkCorrect - a.wkCorrect || (a.t || 0) - (b.t || 0));
  const all = rows.filter(v => (v.pts || 0) > 0 || (v.xp || 0) > 0).sort((a, b) => (b.pts || 0) - (a.pts || 0) || (b.xp || 0) - (a.xp || 0));
  box.innerHTML = head + `<div class="lbs">${table('This week: effort', 'Most correct answers since Monday. Anyone can win this one.', week, v => v.wkCorrect, 'correct')}
    ${table('All time: mastery', 'Most spec points secured.', all, v => v.pts || 0, 'points')}</div>`;
  bindHide();
}
function bindHide() { const el = $('hideMe'); if (el) el.onchange = () => { PROG.hide = !el.checked; PROG.updatedAt = Date.now(); writeLocal(); saveRemote(); }; }

function tabHow(box) {
  box.innerHTML = `<div class="card"><div class="in how">
    <h3>Securing questions</h3><p>Get a question right <b>first time</b> in a mission, then get it right again <b>on a different day</b>: it's secured 🔒. A wrong answer drops it back, so you have to win it again. Two in a row in the same lesson doesn't count: that's short-term memory, not learning.</p>
    <h3>Securing spec points</h3><p>A spec point is secured when about four of its questions are secured (or all of them, if it has fewer). True-or-false questions count half, because you could guess them.</p>
    <h3>Rust</h3><p>If you don't get any question on a secured spec point right for ${RUST_DAYS} days, it goes <b>rusty</b>. Missions include rusty points automatically; one correct answer polishes it.</p>
    <h3>XP and ranks</h3><p>+5 XP per correct answer (+10 for ★ harder), +20 when a question is secured, +100 the first time a spec point is secured. Ranks: ${RANKS.map(r => esc(r.name)).join(' → ')}.</p>
    <h3>Badges and gear</h3><p>Scout badges for every sub-topic, topic and subject you secure, plus milestones. Italian gear for each whole topic, and for securing 1, 10, 25, 50, 100, 175 and 250 questions. Three legendary trophies go to the students with the most correct answers in each subject.</p>
    <h3>Missions</h3><p>Each mission is ${MISSION_LEN} questions: questions you're ready to secure come first, then rusty points, then ones you got wrong, then new questions from your suggested sub-topic. Use <b>Train</b> on the map to work on one sub-topic.</p>
  </div></div>`;
}

$('campBtn').onclick = openCampaign;
PROG = readLocal(null);
initFirebase();
