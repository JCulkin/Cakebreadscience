/* Teaching by year group (user, 17 Nov 2026): what has been taught in class, and work set for a year.
   Realtime Database (read: signed in; write: admins):
     school/taught/Y10/C1a = 'YYYY-MM-DD'                      sub-topic taught in class to Year 10
     school/assign/{id} = {title, type: 'test'|'practise', years: {Y10: true}, students: {uid: true}, items: ['C1a', 'C2.27'],
                           qids (test), target (practise), pts + need (practise: spec points and how many to get right, for /js/openwork.js),
                           set: 'YYYY-MM-DD', due, note, by, t, edited, archived}
   Who sees a piece of work (18 Nov): everyone in a ticked year PLUS any ticked students (e.g. someone who hasn't chosen a year).
   Two types (user, 17 Nov): 'test' = a fixed set of questions (qids, same for everyone), one go at /work/?id=, score saved on
   users/{uid}.work[id] = {ans: {qid: 1|0}, n, started, done, score, at}; 'practise' (also old work with no type) =
   Items are sub-topic keys (subject letter + topic + sub letter, as in QE.allSubs / practice.html?sub=) or spec point keys (C2.27).
   different questions from the items answered right on or after the set date (PROG.q[id].l), out of `target`.
   Needs SPEC + QUESTIONS (spec.js, questions.js) loaded first. Used by /today/ and /admin/. */
(function () {
  const SUBS = {}, POINT = {}, QS = {};
  SPEC.forEach(s => s.topics.forEach(t => t.subs.forEach(sb => {
    if (sb.name === 'Units') return;
    const key = s.name[0] + t.n + sb.l;
    sb.points.forEach(p => { if (!p.key) p.key = s.name[0] + p.id; });
    SUBS[key] = { key, L: s.name[0], subj: s.name, topic: t.n, topicName: t.name, l: sb.l, name: sb.name, points: sb.points.map(p => p.key) };
    sb.points.forEach(p => { POINT[p.key] = { key: p.key, id: p.id, text: p.text, sub: key }; });
  })));
  QUESTIONS.forEach(q => (QS[q.s] = QS[q.s] || []).push(q.id));
  const isPoint = k => k.includes('.');
  const pointsOf = k => isPoint(k) ? (POINT[k] ? [k] : []) : (SUBS[k] ? SUBS[k].points : []);
  const qsOf = k => pointsOf(k).flatMap(p => QS[p] || []);
  const label = k => isPoint(k) ? `${({ B: 'Biology', C: 'Chemistry', P: 'Physics' })[k[0]] || ''} ${k.slice(1)}` : SUBS[k] ? `${SUBS[k].subj} ${k.slice(1)} · ${SUBS[k].name}` : k;
  const shortLabel = k => isPoint(k) ? k : SUBS[k] ? `${k.slice(1)} ${SUBS[k].name}` : k;
  const practise = k => '/interactive/spec-quiz/practice.html?' + (isPoint(k) ? 'point=' : 'sub=') + encodeURIComponent(k);
  /* Single Award students (/js/course.js, 20 Nov): practise work counts only questions on their course, and its target is
     sized for their course (needSA, saved on the work by the admin console): the teacher's number, unless that is more than half
     of the questions on their course: then half (or the same share as everyone else, if that is bigger), at least 1.
     needSA = min(need, round(SA questions × max(need ÷ all questions, ½))). Work with nothing on their course (needSA 0, or a test with nSA 0) isn't shown to them at all.
     course: 'SA' or '' for a given student (admin); left out = whoever is signed in on this page. */
  const CC = () => window.CBSCourse;
  const isSA = course => course === 'SA' || (course === undefined && !!CC() && CC().sa);
  function progress(prog, a, course) {
    const sa = isSA(course) && CC();
    let ids = [...new Set((a.items || []).flatMap(qsOf))]; const q = (prog && prog.q) || {};
    if (sa) ids = ids.filter(CC().inSAid);
    const got = ids.filter(id => q[id] && q[id].l && q[id].l >= (a.set || '')).length;
    let target = Math.min(a.target || 10, ids.length || 1);
    if (sa) target = !ids.length ? 0 : Math.min(ids.length, a.needSA > 0 ? a.needSA : target);
    if (!target) return { got: 0, target: 0, total: 0, done: true, none: true, points: [] };
    return { got: Math.min(got, target), target, total: ids.length, done: got >= target, points: [...new Set((a.items || []).flatMap(pointsOf))] };
  }
  /* nothing in this work is on a Single Award student's course */
  function offCourse(a, course) {
    if (!isSA(course)) return false;
    if (isTest(a)) return a.nSA === 0 || (!!CC() && !(a.qids || []).some(CC().inSAid));
    return a.needSA === 0 || (!!CC() && !(a.items || []).flatMap(qsOf).some(CC().inSAid));
  }
  /* a test's questions: n picked round-robin across the items so every item is covered */
  function pickTest(items, n) {
    const pools = items.map(k => shuffle(qsOf(k))).filter(p => p.length), out = [], seen = new Set();
    for (let r = 0; out.length < n && pools.some(p => p.length); r++) pools.forEach(p => { while (p.length && out.length < n) { const id = p.pop(); if (!seen.has(id)) { seen.add(id); out.push(id); break; } } });
    return out;
  }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const todayStr = () => (typeof QE !== 'undefined' && QE.TODAY) || (() => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); })();
  const isTest = a => a && a.type === 'test';
  const isSpaced = a => a && a.type === 'spaced';
  function spacedOf(userDoc, a, today) {   // {state: 'todo'|'started'|'done', daysDone, daysNeed, qPerDay, doneToday, days, scores, lastAt}
    const w = ((userDoc || {}).work || {})[a.id] || null;
    const daysNeed = Math.max(1, +a.days || 2), qPerDay = Math.max(5, +a.qPerDay || 10);
    const days = (w && w.days && typeof w.days === 'object') ? w.days : {};
    const keys = Object.keys(days).sort();
    const daysDone = keys.length;
    const td = today || todayStr();
    const doneToday = !!days[td];
    const state = (daysDone >= daysNeed || (w && w.done)) ? 'done' : daysDone > 0 ? 'started' : 'todo';
    const scores = keys.map(d => Object.assign({ day: d }, days[d]));
    const lastAt = (w && w.at) || scores.reduce((m, x) => Math.max(m, x.at || 0), 0);
    return { state, daysDone, daysNeed, qPerDay, doneToday, days, scores, lastAt };
  }
  async function recordSpaced(fs, uid, id, a, info) {
    if ((!fs && !window.CBSNet) || !uid || !id || !a) return null;
    const td = todayStr(), ref = fs && fs.collection ? fs.collection('users').doc(uid) : null;
    let cur = {};
    try {
      const doc = window.CBSNet ? await CBSNet.fsGet('users', uid, 8000) : (ref ? (await ref.get()).data() : null);
      cur = ((doc || {}).work || {})[id] || {};
    } catch (e) {}
    const days = Object.assign({}, cur.days || {});
    const prev = days[td];
    const entry = { n: info.n || a.qPerDay || 10, right: info.right || 0, mode: info.mode || 'quest', at: Date.now() };
    if (!prev || entry.right >= (prev.right || 0)) days[td] = entry;
    const daysNeed = Math.max(1, +a.days || 2);
    const done = Object.keys(days).length >= daysNeed;
    const next = { days, done, at: Date.now() };
    if (window.CBSNet) await CBSNet.fsSetMerge('users', uid, { work: { [id]: next } }, { ms: 8000, mergeMaps: ['work'] });
    else if (ref) await ref.set({ work: { [id]: next } }, { merge: true });
    return spacedOf({ work: { [id]: next } }, Object.assign({ id }, a), td);
  }
  function testOf(userDoc, a, course) {   // {state: 'todo'|'started'|'done', answered, n, score}
    const w = ((userDoc || {}).work || {})[a.id] || null;
    const sa = isSA(course);
    const n = sa && a.nSA > 0 ? a.nSA : (a.qids || []).length;
    if (!w) return { state: 'todo', answered: 0, n, score: 0 };
    const answered = Object.keys(w.ans || {}).length, score = Object.values(w.ans || {}).filter(Boolean).length;
    return { state: w.done ? 'done' : 'started', answered, n: w.n || n, score: w.done ? w.score : score, at: w.at, ans: w.ans || {} };
  }
  const isFor = (a, y, uid) => !!a && ((y && a.years && a.years['Y' + y]) || (uid && a.students && a.students[uid]));
  const forMe = (assign, y, uid, course) => Object.entries(assign || {}).filter(([, a]) => a && !a.archived && isFor(a, y, uid) && !offCourse(a, course))
    .map(([id, a]) => Object.assign({ id }, a)).sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999'));
  const forYear = (assign, y) => forMe(assign, y, null);
  /* the students who can see a piece of work, from a list of {uid, year} */
  const audience = (a, students) => (students || []).filter(s => isFor(a, s.year, s.uid) && !offCourse(a, s.course || ''));
  /* practise work: the spec points behind it and how many to get right (saved on the work so /js/openwork.js needs no question bank) */
  const practiseNeed = a => { const ids = [...new Set((a.items || []).flatMap(qsOf))], need = Math.min(a.target || 10, ids.length || 1), o = { pts: [...new Set((a.items || []).flatMap(pointsOf))], need };
    if (CC()) { const n = ids.filter(CC().inSAid).length; o.needSA = n ? Math.max(1, Math.min(need, Math.round(n * Math.max(need / ids.length, 0.5)))) : 0; }
    return o; };
  /* how many of a test's questions a Single Award student gets (saved as nSA) */
  const testSA = a => CC() ? (a.qids || []).filter(CC().inSAid).length : null;
  /* 18 Nov + 27 Nov: route RTDB reads through CBSNet (same-origin /_fb/rtdb HTTPS proxy on school Wi-Fi) */
  async function rtGet(rt, path, ms = 15000) {
    if (window.CBSNet) return CBSNet.rtGet(path, ms);
    const sdk = rt.ref(path).once('value').then(x => x.val());
    return new Promise((ok, no) => { const t = setTimeout(() => no(new Error('timeout')), ms); sdk.then(v => { clearTimeout(t); ok(v); }, e => { clearTimeout(t); no(e); }); });
  }
  const CACHE = 'cbs.school';
  const shape = v => ({ taught: (v || {}).taught || {}, assign: (v || {}).assign || {} });
  async function load(rt) {
    /* taught + assign only: school/review (the admin's question/worksheet review marks) is big and not for students */
    const [taught, assign] = await Promise.all([rtGet(rt, 'school/taught'), rtGet(rt, 'school/assign')]);
    const v = shape({ taught, assign });
    try { localStorage.setItem(CACHE, JSON.stringify({ t: Date.now(), v })); } catch (e) {}
    return v;
  }
  /* the last copy this browser loaded (shown, marked as saved, when the network won't answer) */
  const cached = () => { try { const c = JSON.parse(localStorage.getItem(CACHE) || 'null'); return c && c.v ? Object.assign(shape(c.v), { savedAt: c.t }) : null; } catch (e) { return null; } };
  async function loadOne(rt, id) {
    if (!id) return null;
    try {
      const a = await rtGet(rt, 'school/assign/' + id, 12000);
      if (a) return Object.assign({ id }, a);
    } catch (e) {}
    const c = cached();
    return c && c.assign && c.assign[id] ? Object.assign({ id }, c.assign[id]) : null;
  }
  const escH = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  /* Live homework progress bar shown during Practice & Questing when launched with ?hw=<id> */
  function hwBarHtml(a, info) {
    if (!a) return '';
    const title = escH(a.title || 'Homework');
    if (isSpaced(a)) {
      const answered = Math.min(info.answered || 0, info.total || 10), total = Math.max(1, info.total || a.qPerDay || 10);
      const dCur = Math.min((info.daysDone || 0) + (info.doneToday ? 0 : 1), info.daysNeed || a.days || 2);
      const dNeed = info.daysNeed || a.days || 2;
      const pct = Math.min(100, Math.round(answered / total * 100));
      const col = answered >= total ? '#16a34a' : '#eab308';
      return `<div class="hwbar" style="background:#fff;border:2px solid #111;border-left:6px solid ${col};padding:7px 12px;margin:0 0 10px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:14px">
        <span><b>📌 ${title}</b> <span style="color:#555">· Day ${dCur}/${dNeed}</span></span>
        <div style="flex:1;min-width:90px;height:10px;border:1.5px solid #111;background:#eeeae0;overflow:hidden"><i style="display:block;height:100%;width:${pct}%;background:${col};transition:width .25s"></i></div>
        <span><b>${answered}/${total}</b> questions</span></div>`;
    }
    const p = info.prog || progress(typeof QE !== 'undefined' ? QE.prog : null, a);
    const pct = p.target ? Math.min(100, Math.round(p.got / p.target * 100)) : 100;
    const col = p.done ? '#16a34a' : '#eab308';
    return `<div class="hwbar" style="background:#fff;border:2px solid #111;border-left:6px solid ${col};padding:7px 12px;margin:0 0 10px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:14px">
      <span><b>📌 ${title}</b></span>
      <div style="flex:1;min-width:90px;height:10px;border:1.5px solid #111;background:#eeeae0;overflow:hidden"><i style="display:block;height:100%;width:${pct}%;background:${col};transition:width .25s"></i></div>
      <span><b>${p.got}/${p.target}</b> right${p.done ? ' ✓' : ''}</span></div>`;
  }
  /* End-of-round homework status banner (clearly tells students when homework is done vs still to continue) */
  function hwDoneHtml(a, res, opts) {
    if (!a || !res) return '';
    const title = escH(a.title || 'Homework'), cid = (opts && opts.continueId) || 'hwCont';
    if (isSpaced(a)) {
      if (res.state === 'done') {
        return `<div class="card" style="margin:12px 0;border:2px solid #15803d;border-left:8px solid #16a34a;background:#f0fdf4;text-align:left">
          <h2 style="margin:0 0 4px;color:#166534">🎉 Homework complete!</h2>
          <p style="margin:0 0 10px">You finished all <b>${res.daysDone} of ${res.daysNeed} days</b> for <b>${title}</b>. Your teacher can see it's done.</p>
          <a class="btn green" href="/today/" style="background:#16a34a;color:#fff">← Back to To do</a></div>`;
      }
      return `<div class="card" style="margin:12px 0;border:2px solid #0369a1;border-left:8px solid #0284c7;background:#f0f9ff;text-align:left">
        <h2 style="margin:0 0 4px;color:#075985">✓ Day ${res.daysDone} of ${res.daysNeed} done!</h2>
        <p style="margin:0 0 10px">You've finished today's mission for <b>${title}</b>. Come back on another day for <b>Day ${Math.min(res.daysDone + 1, res.daysNeed)}</b> to finish this homework.</p>
        <a class="btn" href="/today/" style="background:#111;color:#fff">← Back to To do</a></div>`;
    }
    if (res.done) {
      return `<div class="card" style="margin:12px 0;border:2px solid #15803d;border-left:8px solid #16a34a;background:#f0fdf4;text-align:left">
        <h2 style="margin:0 0 4px;color:#166534">🎉 Homework complete!</h2>
        <p style="margin:0 0 10px">You reached <b>${res.got} of ${res.target}</b> right for <b>${title}</b>. Your teacher can see it's done.</p>
        <a class="btn green" href="/today/" style="background:#16a34a;color:#fff">← Back to To do</a></div>`;
    }
    const left = Math.max(1, res.target - res.got), pct = res.target ? Math.min(100, Math.round(res.got / res.target * 100)) : 0;
    return `<div class="card" style="margin:12px 0;border:2px solid #111;border-left:8px solid #dc2626;background:#fffbeb;text-align:left">
      <h2 style="margin:0 0 4px;color:#991b1b">📌 Not finished yet — ${left} more to go</h2>
      <p style="margin:0 0 8px"><b>${title}:</b> ${res.got} of ${res.target} different questions right so far.</p>
      <div style="height:10px;border:1.5px solid #111;background:#eeeae0;overflow:hidden;max-width:360px;margin-bottom:10px"><i style="display:block;height:100%;width:${pct}%;background:#eab308"></i></div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center"><button type="button" class="btn gold big" id="${cid}">Continue homework →</button><a class="btn alt" href="/today/">Finish later (To do)</a></div></div>`;
  }
  window.CBSSchool = { SUBS, POINT, isPoint, pointsOf, qsOf, label, shortLabel, practise, progress, offCourse, pickTest, isTest, isSpaced, spacedOf, recordSpaced, testOf, forYear, forMe, isFor, audience, practiseNeed, testSA, load, loadOne, hwBarHtml, hwDoneHtml, cached, rtGet, YEARS: [8, 9, 10, 11] };
})();
