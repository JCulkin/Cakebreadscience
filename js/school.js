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
  const isTest = a => a && a.type === 'test';
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
  /* 18 Nov: one student's To do showed "Couldn't reach your teacher's work (Realtime Database)": the SDK's live connection
     (a websocket) can be blocked or very slow on some networks, and once() then never answers. rtGet() also asks the plain
     REST address (an ordinary HTTPS request with the student's sign-in token) after a moment, and takes whichever answers first. */
  async function rtGet(rt, path, ms = 15000) {
    let done = false;
    const sdk = rt.ref(path).once('value').then(x => { done = true; return x.val(); });
    const rest = (async () => {
      await new Promise(r => setTimeout(r, 1500));
      if (done) throw new Error('not needed');
      const u = firebase.auth().currentUser, base = (window.firebaseConfig || {}).databaseURL;
      if (!u || !base) throw new Error('no rest');
      const r = await fetch(`${base}/${path}.json?auth=${encodeURIComponent(await u.getIdToken())}`, { cache: 'no-store' });
      if (!r.ok) throw new Error('rest ' + r.status);
      return r.json();
    })();
    const all = Promise.any ? Promise.any([sdk, rest]) : sdk;
    return new Promise((ok, no) => { const t = setTimeout(() => no(new Error('timeout')), ms); all.then(v => { clearTimeout(t); ok(v); }, e => { clearTimeout(t); no(e); }); });
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
  window.CBSSchool = { SUBS, POINT, isPoint, pointsOf, qsOf, label, shortLabel, practise, progress, offCourse, pickTest, isTest, testOf, forYear, forMe, isFor, audience, practiseNeed, testSA, load, cached, rtGet, YEARS: [8, 9, 10, 11] };
})();
