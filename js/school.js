/* Teaching by year group (user, 17 Nov 2026): what has been taught in class, and work set for a year.
   Realtime Database (read: signed in; write: admins):
     school/taught/Y10/C1a = 'YYYY-MM-DD'                      sub-topic taught in class to Year 10
     school/assign/{id} = {title, years: {Y10: true}, items: ['C1a', 'C2.27'], target, set: 'YYYY-MM-DD', due, note, by, t, archived}
   Items are sub-topic keys (subject letter + topic + sub letter, as in QE.allSubs / practice.html?sub=) or spec point keys (C2.27).
   Progress = different questions from the items answered right on or after the set date (PROG.q[id].l), out of `target`.
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
  const forYear = (assign, y) => Object.entries(assign || {}).filter(([, a]) => a && !a.archived && a.years && a.years['Y' + y])
    .map(([id, a]) => Object.assign({ id }, a)).sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999'));
  async function load(rt) {
    const s = await rt.ref('school').once('value');
    const v = s.val() || {};
    return { taught: v.taught || {}, assign: v.assign || {} };
  }
  window.CBSSchool = { SUBS, POINT, isPoint, pointsOf, qsOf, label, shortLabel, practise, progress, forYear, load, YEARS: [8, 9, 10, 11] };
})();
