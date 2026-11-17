/* Teaching by year group (user, 17 Nov 2026): what has been taught in class, and work set for a year.
   Realtime Database (read: signed in; write: admins):
     school/taught/Y10/C1a = 'YYYY-MM-DD'                      sub-topic taught in class to Year 10
     school/assign/{id} = {title, type: 'test'|'practise', years: {Y10: true}, items: ['C1a', 'C2.27'], qids (test), target (practise),
                           set: 'YYYY-MM-DD', due, note, by, t, archived}
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
  function progress(prog, a) {
    const ids = [...new Set((a.items || []).flatMap(qsOf))], q = (prog && prog.q) || {};
    const got = ids.filter(id => q[id] && q[id].l && q[id].l >= (a.set || '')).length;
    const target = Math.min(a.target || 10, ids.length || 1);
    return { got: Math.min(got, target), target, total: ids.length, done: got >= target, points: [...new Set((a.items || []).flatMap(pointsOf))] };
  }
  /* a test's questions: n picked round-robin across the items so every item is covered */
  function pickTest(items, n) {
    const pools = items.map(k => shuffle(qsOf(k))).filter(p => p.length), out = [], seen = new Set();
    for (let r = 0; out.length < n && pools.some(p => p.length); r++) pools.forEach(p => { while (p.length && out.length < n) { const id = p.pop(); if (!seen.has(id)) { seen.add(id); out.push(id); break; } } });
    return out;
  }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const isTest = a => a && a.type === 'test';
  function testOf(userDoc, a) {   // {state: 'todo'|'started'|'done', answered, n, score}
    const w = ((userDoc || {}).work || {})[a.id] || null, n = (a.qids || []).length;
    if (!w) return { state: 'todo', answered: 0, n, score: 0 };
    const answered = Object.keys(w.ans || {}).length, score = Object.values(w.ans || {}).filter(Boolean).length;
    return { state: w.done ? 'done' : 'started', answered, n: w.n || n, score: w.done ? w.score : score, at: w.at, ans: w.ans || {} };
  }
  const forYear = (assign, y) => Object.entries(assign || {}).filter(([, a]) => a && !a.archived && a.years && a.years['Y' + y])
    .map(([id, a]) => Object.assign({ id }, a)).sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999'));
  async function load(rt) {
    const s = await rt.ref('school').once('value');
    const v = s.val() || {};
    return { taught: v.taught || {}, assign: v.assign || {} };
  }
  window.CBSSchool = { SUBS, POINT, isPoint, pointsOf, qsOf, label, shortLabel, practise, progress, pickTest, isTest, testOf, forYear, load, YEARS: [8, 9, 10, 11] };
})();
