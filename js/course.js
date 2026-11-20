/* Course: Science (Double Award) or Science (Single Award) — 19 Nov 2026.
   User: "only I set which course the student is, and there's no team quiz for it. Just the single student has a different
   experience of the website is all."
   - users/{uid}.course = 'SA' for a Single Award student (missing = Double Award). Only the admin console sets it (Students →
     open a student → Course); students never choose it.
   - Single Award (Pearson Edexcel International GCSE Science (Single Award) 4SS0, Issue 4, Sept 2024) is a subset of Double
     Award with the SAME point numbers: 249 points (241 + the 8 physics Units points). 15 of them are narrower; their Single
     Award wording is in SA_TEXT and the questions that go beyond it are in DA_ONLY.
   - For a Single Award student this file trims SPEC, QUESTIONS and CARD_COUNTS in place as the page loads, so the spec
     trackers, missions, Practice, To do, Stats, the map, set-work tests and Flashcards only ever show Single Award content.
     Teacher pages (admin, the team quiz, reports) don't load it.
   - Load right after diagq.js (before cards.js / questing-engine.js); the engine calls CBSCourse.prune() again for CARD_COUNTS
     and CBSCourse.update(uid, course) when it reads the account. The course is cached per browser (localStorage cbs.course,
     tied to the last signed-in account in cbs.questing.uid); if the account's course differs from what the page was drawn
     with, the page reloads once.
   API: CBSCourse.sa (bool), .has(key), .inSA(q) / .inSAid(id) (on the Single Award course, whoever is signed in), .label, .exam,
   .prune(), .update(uid, course). Also loaded on the admin console (it trims nothing there) so set work can be sized for both courses. */
(function () {
  if (window.CBSCourse) return;
  const RANGES = {
    B: '1:1-4 2:1-4,7-13,15-16,18-21,23,27,29,34-38,46-48,51-52,59-62,65,68-69 3:1-4,8,13,15,19-20,23,25-27,31,33,38 4:1-2,5-10 5:1-2,5-6,12-16',
    C: '1:1-3,8-18,21,25-26,37-39,41-42,44,47,49 2:1-3,5-6,9-11,13-15,17-19,28-32,44-46,48-49 3:1-3,8-10,12,15 4:1-2,7,9-16,19-21,23-26,28,44-47',
    P: '1:1,3-9,11-12,16-20 2:1,4,6,8-10,12-14,16,19 3:1,3-5,7,9-15,17,20-21,23 4:1-5,11-17 5:1,5-6,15-20 6:1,4,6-8,12-14 7:1-6,10,12,14-19,22,25 8:1-5,7-9'
  };
  const SA = new Set();
  Object.entries(RANGES).forEach(([L, s]) => s.split(' ').forEach(part => { const [t, list] = part.split(':');
    list.split(',').forEach(r => { const [a, b] = r.split('-').map(Number); for (let n = a; n <= (b || a); n++) SA.add(`${L}${t}.${n}`); }); }));
  /* the 15 points Pearson narrows for Single Award ("There is a small change to specification point …") */
  const SA_TEXT = {
    'B2.2': { text: 'describe cell structures, including the nucleus, cytoplasm, cell membrane, cell wall, mitochondria, chloroplasts and vacuole' },
    'B2.3': { text: 'describe the functions of the nucleus, cytoplasm, cell membrane, cell wall, mitochondria, chloroplasts and vacuole' },
    'B3.4': { text: 'understand that the growth of the pollen tube followed by fertilisation leads to seed formation' },
    'B5.14': { text: 'understand how large amounts of human insulin can be manufactured from genetically modified bacteria' },
    'C1.38': { text: 'know the charges of these ions:', bullets: ['metals in Groups 1, 2 and 3', 'non-metals in Groups 5, 6 and 7', 'hydrogen (H⁺), hydroxide (OH⁻), ammonium (NH₄⁺), carbonate (CO₃²⁻), nitrate (NO₃⁻), sulfate (SO₄²⁻)'] },
    'C2.19': { text: 'understand how the rusting of iron may be prevented by:', bullets: ['barrier methods', 'galvanising'] },
    'C2.28': { text: 'describe the use of litmus to distinguish between acidic and alkaline solutions' },
    'C2.48': { text: 'describe a test for CO₃²⁻ using hydrochloric acid and identifying the gas evolved', bullets: null },
    'C4.2': { text: 'understand how to represent organic molecules using molecular formulae, general formulae, structural formulae and displayed formulae' },
    'C4.45': { text: 'understand how to draw the repeat unit of the addition polymer poly(ethene)' },
    'P2.4': { text: 'know and use the relationship between power, current and voltage' },
    'P2.9': { text: 'describe how current varies with voltage in wires, resistors and metal filament lamps, and how to investigate this experimentally' },
    'P3.14': { text: 'know that light waves can be reflected and refracted' },
    'P3.21': { text: 'explain what is meant by critical angle c' },
    'P3.23': { text: 'know that sound waves can be reflected and refracted' },
  };
  /* questions on those points that go beyond the Single Award wording (other ions, ribosomes, sacrificial protection, other
     indicators, halide/sulfate tests, empirical formulae, fruit, fermenters, fuses, diodes/LDRs/thermistors, transverse/longitudinal).
     Other polymers stay: Single Award 4.46 still asks students to deduce monomer ↔ repeat unit. */
  const DA_ONLY = new Set(['C1.38-05', 'C1.38-07', 'B2.3-03', 'P3.14-01', 'P3.14-04', 'P3.23-01', 'P2.4-03', 'P2.4-04', 'P2.9-03', 'P2.9-d1', 'P2.9-d2', 'P2.10-d1',
    'C2.19-03', 'C2.19-04', 'C2.19-05', 'C2.28-01', 'C2.28-02', 'C2.28-04', 'C2.28-05', 'C2.48-01', 'C2.48-02', 'C2.48-04', 'C2.48-05',
    'C4.2-01', 'C4.2-05', 'B2.4-01', 'B3.4-03', 'B3.4-05', 'B5.14-02', 'B5.14-04']);

  const KEY = 'cbs.course', UID = 'cbs.questing.uid', GUARD = 'cbs.course.reloaded';
  const get = k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };
  const cache = get(KEY);
  const teacherPage = /^\/admin\//.test(location.pathname) || window.QE_PASSIVE;
  const sa = !teacherPage && !!cache && cache.c === 'SA' && cache.u && cache.u === get(UID);
  const C = window.CBSCourse = {
    sa, SA, DA_ONLY, SA_TEXT,
    label: sa ? 'Science (Single Award)' : 'Science (Double Award)',
    exam: sa ? '3 papers (Biology, Chemistry, Physics), each 1 h 10 min and 60 marks' : '',
    has: key => !sa || !key || SA.has(key),
    /* diagram questions (diagq.js) roll again if the drawing's question or options use this (cell diagrams label ribosomes) */
    dqAvoid: sa ? /ribosom|protein synthesis|proteins are made/i : null,
    inSA: q => SA.has(q.s) && !DA_ONLY.has(q.id),
    inSAid: id => SA.has(id.slice(0, id.lastIndexOf('-'))) && !DA_ONLY.has(id),
    keepQ: q => !sa || C.inSA(q),
    prune, update
  };
  let done = { spec: false, qs: false, cards: false };
  function prune() {
    if (!sa) return;
    if (!done.spec && typeof SPEC !== 'undefined') { done.spec = true;
      SPEC.forEach(s => { s.topics.forEach(t => { t.subs.forEach(sb => {
        for (let i = sb.points.length - 1; i >= 0; i--) { const p = sb.points[i], k = s.name[0] + p.id; if (!SA.has(k)) sb.points.splice(i, 1); else if (SA_TEXT[k]) { p.text = SA_TEXT[k].text; if ('bullets' in SA_TEXT[k]) { if (SA_TEXT[k].bullets) p.bullets = SA_TEXT[k].bullets; else delete p.bullets; } } }
      }); for (let i = t.subs.length - 1; i >= 0; i--) if (!t.subs[i].points.length) t.subs.splice(i, 1); });
      for (let i = s.topics.length - 1; i >= 0; i--) if (!s.topics[i].subs.length) s.topics.splice(i, 1); }); }
    if (!done.qs && typeof QUESTIONS !== 'undefined') { done.qs = true;
      for (let i = QUESTIONS.length - 1; i >= 0; i--) if (!C.keepQ(QUESTIONS[i])) QUESTIONS.splice(i, 1); }
    if (!done.cards && typeof CARD_COUNTS !== 'undefined') { done.cards = true;
      Object.keys(CARD_COUNTS).forEach(k => { if (/^[BCP]\d/.test(k) && !SA.has(k)) delete CARD_COUNTS[k]; }); }
    if (window.SPEC_INDEX && SPEC_INDEX.pts) Object.keys(SPEC_INDEX.pts).forEach(k => { if (!SA.has(k)) delete SPEC_INDEX.pts[k]; });
  }
  /* the engine tells us the signed-in account's course (null when signed out); redraw once if the page was built for the other course */
  function update(uid, course) {
    if (teacherPage) return;
    const c = uid && course === 'SA' ? 'SA' : null;
    try { if (c) localStorage.setItem(KEY, JSON.stringify({ u: uid, c })); else localStorage.removeItem(KEY); } catch (e) {}
    if (!!c === sa) return;
    try { const g = (uid || '-') + ':' + c; if (sessionStorage.getItem(GUARD) === g) return; sessionStorage.setItem(GUARD, g); } catch (e) { return; }
    location.reload();
  }
  prune();
  /* static wording: <span data-course-sa="Single Award text">Double Award text</span> */
  if (sa) { const paint = () => document.querySelectorAll('[data-course-sa]').forEach(el => { el.textContent = el.getAttribute('data-course-sa'); });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paint); else paint(); }
})();
