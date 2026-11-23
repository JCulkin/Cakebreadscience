/* One spec tracker (17 Nov 2026). One renderer for /specifications/{biology,chemistry,physics}.html (data-view="subject")
   and the overview /specifications/science.html (data-view="overview"), drawn from spec.js — no hand-written spec lists.

   Colour = EVIDENCE, from the same progress as Cakebread Questing (QE.pointState): questions answered in Practice
   Questions (no game needed), Questing missions, Quick-quiz-free work, and Flashcards. So the tracker works with or
   without the game.
     not started · learning · secured (right on two different days) · rusty (secured, not practised for 3 weeks)
     points with no quiz questions (e.g. units, some practicals) → "No quiz yet": confidence + resources only
   Confidence = the student's own rating (1 not yet · 2 unsure · 3 confident); it never changes the colour.
     "Check these" = confident but not secured.  Saved by spec code: Firestore specProgress/{uid}.conf = {'B2.27': 3}
     (signed out: localStorage). Old ticks/RAG (specProgress/{uid}.subjects[s].items, by old position id) are carried over
     once via window.SPEC_LEGACY: green or ticked → 3, amber → 2, red → 1. The old data is left untouched.
   Covered in class = school/taught/Y{year} (js/school.js, js/year.js).
   Every point has an anchor id = its key (e.g. #B2.27) for links from worksheets, lessons and To do.
   Needs: firebase compat (app/auth/firestore/database) + config, spec.js, questions.js, gens.js, cards.js,
   questing-engine.js, /js/spec-index.js, /js/school.js, /js/year.js, /js/spec-legacy.js. */
(function () {
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const within = (p, ms) => new Promise((ok, no) => { const t = setTimeout(() => no(new Error('timeout')), ms); Promise.resolve(p).then(v => { clearTimeout(t); ok(v); }, e => { clearTimeout(t); no(e); }); });
  const root = $('tracker'); if (!root) return;
  const VIEW = root.dataset.view || 'subject';
  const SUBJ = { biology: 'Biology', chemistry: 'Chemistry', physics: 'Physics' };
  const LET = { biology: 'B', chemistry: 'C', physics: 'P' };
  const subject = root.dataset.subject;
  const IDX = (typeof SPEC_INDEX !== 'undefined' && SPEC_INDEX) || window.SPEC_INDEX || { pts: {}, res: [] };
  const QEx = () => (typeof QE !== 'undefined' ? QE : window.QE);
  const Q = '/interactive/spec-quiz/';
  SPEC.forEach(s => s.topics.forEach(t => t.subs.forEach(sb => sb.points.forEach(p => { if (!p.key) p.key = s.name[0] + p.id; }))));
  const specOf = name => SPEC.find(s => s.name === name);

  /* ---------- status (evidence) ---------- */
  const ST = { none: 'Not started', learning: 'Learning', secured: 'Secured', rusty: 'Rusty', na: 'No quiz yet' };
  function status(k) {
    const E = QEx(), p = (E && E.POINT_QS[k]) ? E.pointState(k) : null;
    if (!p || !p.has) return { s: 'na' };
    return { s: p.rusty ? 'rusty' : p.secured ? 'secured' : p.started ? 'learning' : 'none', got: Math.min(p.need, (p.sec || 0) + (p.cSec || 0)), need: p.need };
  }

  /* ---------- confidence (self-rating) ---------- */
  let CONF = {}, uid = null, saveT = null, pending = {};
  const lsKey = () => 'cbs.tracker.conf.' + (uid || 'anon');
  const readLocal = k => { try { return JSON.parse(localStorage.getItem(k) || '{}') || {}; } catch (e) { return {}; } };
  const writeLocal = () => { try { localStorage.setItem(lsKey(), JSON.stringify(CONF)); } catch (e) {} };
  function migrate(subjects) {
    const out = {}, map = window.SPEC_LEGACY || {};
    Object.values(subjects || {}).forEach(sub => Object.entries((sub && sub.items) || {}).forEach(([id, e]) => {
      const k = map[id]; if (!k || !e) return;
      const v = e.rag === 'green' ? 3 : e.rag === 'amber' ? 2 : e.rag === 'red' ? 1 : e.checkbox ? 3 : 0;
      if (v) out[k] = v;
    }));
    return out;
  }
  /* The account is the source of truth. This browser keeps a copy (instant drawing) and a list of ratings
     that haven't reached the account yet (offline / school filter); those are pushed on the next load. */
  const unKey = () => 'cbs.tracker.conf.unsynced.' + uid;
  async function loadConf(user) {
    uid = user ? user.uid : null;
    CONF = readLocal(lsKey()); drawAll();
    if (!user || !window.firebase || !firebase.firestore) return;
    const anon = readLocal('cbs.tracker.conf.anon'), uns = readLocal(unKey());
    try {
      const snap = await within(firebase.firestore().collection('specProgress').doc(user.uid).get(), 6000);
      const d = (snap.exists && snap.data()) || {};
      let remote = d.conf || null, fresh = false;
      if (!remote) { remote = migrate(d.subjects); fresh = true; }
      CONF = Object.assign({}, remote, uns, anon);          // unsaved ratings from this browser win, then the account
      writeLocal();
      const push = Object.assign({}, fresh ? CONF : {}, uns, anon);
      if (Object.keys(push).length) { pending = push; saveRemote(fresh); }
      try { localStorage.removeItem('cbs.tracker.conf.anon'); } catch (e) {}
    } catch (e) { console.warn('tracker: confidence not loaded', e); }
    drawAll();
  }
  async function saveRemote(migrated) {
    if (!uid || !Object.keys(pending).length) return;
    const body = { conf: pending, confAt: Date.now() }; if (migrated) body.confMigrated = true;
    const sent = pending; pending = {};
    const uns = Object.assign(readLocal(unKey()), sent);
    try { localStorage.setItem(unKey(), JSON.stringify(uns)); } catch (e) {}
    try {
      await within(firebase.firestore().collection('specProgress').doc(uid).set(body, { merge: true }), 8000);
      const left = readLocal(unKey()); Object.keys(sent).forEach(k => { if (left[k] === sent[k]) delete left[k]; });
      try { Object.keys(left).length ? localStorage.setItem(unKey(), JSON.stringify(left)) : localStorage.removeItem(unKey()); } catch (e) {}
    } catch (e) { console.warn('tracker: confidence not saved yet (will retry)', e); }
  }
  function setConf(k, v) {
    CONF[k] = CONF[k] === v ? 0 : v; pending[k] = CONF[k]; writeLocal();
    clearTimeout(saveT); saveT = setTimeout(saveRemote, 800);
    drawRow(k); drawSummary();
  }

  /* ---------- covered in class ---------- */
  let TAUGHT = {}, YEAR = null;
  async function loadTaught() {
    YEAR = window.CBSYear && CBSYear.year;
    if (!YEAR || !window.CBSSchool || !window.firebase || !firebase.database) { TAUGHT = {}; drawAll(); return; }
    try { const d = await within(CBSSchool.load(firebase.database()), 6000); TAUGHT = d.taught['Y' + YEAR] || {}; } catch (e) { TAUGHT = {}; }
    drawAll();
  }

  /* ---------- resources from the one spec index ---------- */
  const KIND = { lesson: '🎓 Lesson', sheet: '📄 Worksheet', long: '✍️ 6-mark question', eq: '🧮 Equation' };
  const resOf = k => ((IDX.pts[k] || {}).r || []).map(i => IDX.res[i]).filter(Boolean);
  const cardsOf = k => (IDX.pts[k] || {}).c || (QEx() && QEx().CARDS_ON[k]) || 0;

  /* ---------- subject page ---------- */
  let FILTER = new URLSearchParams(location.search).get('f') || 'all';
  const FILTERS = [['all', 'All'], ['none', 'Not started'], ['learning', 'Learning'], ['rusty', 'Rusty'], ['secured', 'Secured'], ['check', 'Check these'], ['class', 'Covered in class']];
  function buildSubject() {
    const S = specOf(SUBJ[subject]), L = LET[subject];
    if (!FILTERS.some(f => f[0] === FILTER)) FILTER = 'all';
    root.innerHTML = `
      <div class="tr-head"><div class="tr-kick">Spec tracker · Edexcel International GCSE ${window.CBSCourse ? CBSCourse.label : 'Science (Double Award)'}</div>
        <h1>${SUBJ[subject]}</h1>
        <p class="tr-lede">A spec point turns <b class="c-secured">green</b> when you prove it: get its questions right on two different days in <a href="${Q}practice.html">Practice Questions</a> or Questing, or secure its flashcards. Your own rating just records how you feel.</p></div>
      <div class="tr-sum" id="trSum"></div>
      <div class="tr-filters" id="trFilters">${FILTERS.map(([k, t]) => `<button type="button" data-f="${k}"${k === FILTER ? ' class="on"' : ''}>${t}<span></span></button>`).join('')}</div>
      <nav class="tr-topics">${S.topics.map(t => `<a href="#t-${L}${t.n}">${t.n}. ${esc(t.name)}</a>`).join('')}</nav>
      ${S.topics.map(t => `<section class="tr-topic" id="t-${L}${t.n}"><h2><span>${t.n}</span>${esc(t.name)}<i class="tbar" data-tbar="${L}${t.n}"></i></h2>
        ${t.subs.map(sb => { const sk = L + t.n + sb.l;
          return `<div class="tr-sub" data-sub="${sk}"><h3><span class="sl">${t.n}${sb.l}</span> ${esc(sb.name)} <em class="cic" data-cic="${sk}" hidden>✓ Covered in class</em>
              ${sb.name !== 'Units' && CBSSchool.SUBS[sk] && CBSSchool.qsOf(sk).length ? `<a class="tr-subgo" href="${Q}practice.html?sub=${sk}">Practise ${t.n}${sb.l} →</a>` : ''}</h3>
            ${sb.points.map(p => (window.SPECPT ? SPECPT.heading(p) : '') + row(p, sk)).join('')}</div>`; }).join('')}
      </section>`).join('')}`;
    root.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { FILTER = b.dataset.f; root.querySelectorAll('[data-f]').forEach(x => x.classList.toggle('on', x === b)); applyFilter(); });
    root.addEventListener('click', e => {
      const c = e.target.closest('[data-conf]'); if (c) { setConf(c.closest('.tr-pt').dataset.k, +c.dataset.conf); return; }
      const r = e.target.closest('[data-res]'); if (r) { const box = r.closest('.tr-pt').querySelector('.tr-res'); box.hidden = !box.hidden; r.setAttribute('aria-expanded', !box.hidden); }
    });
    if (location.hash) { const t = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (t) setTimeout(() => { t.scrollIntoView({ block: 'center' }); t.classList.add('flash'); }, 300); }
  }
  function row(p, sk) {
    const k = p.key, res = resOf(k), nc = cardsOf(k), hasQ = QEx() && QEx().POINT_QS[k];
    const groups = {}; res.forEach(([kind, title, url]) => (groups[kind] = groups[kind] || []).push(`<a href="${esc(url)}">${esc(title)}</a>`));
    return `<div class="tr-pt" id="${k}" data-k="${k}" data-sub="${sk}">
      <div class="tr-main"><a class="code" href="#${k}" title="Link to this spec point">${k.slice(1)}</a>
        <div class="txt">${esc(p.text)}${p.bullets ? `<ul>${p.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}${window.SPECPT ? SPECPT.extras(p) : ''}</div></div>
      <div class="tr-side">
        <span class="pill" data-pill></span>
        <div class="conf" role="group" aria-label="How sure do you feel?"><button type="button" data-conf="1" title="Not yet">Not yet</button><button type="button" data-conf="2" title="Unsure">Unsure</button><button type="button" data-conf="3" title="Confident">Confident</button></div>
        <div class="acts">${hasQ ? `<a class="go" href="${Q}practice.html?point=${k}" title="Questions on this point, no game">Prove it →</a><a href="${Q}adventurer-mission.html?point=${k}" title="A Cakebread Questing mission on this point">⚔️</a>` : ''}${nc ? `<a href="/Flashcards/?spec=${k}" title="Flashcards on this point">🃏 ${nc}</a>` : ''}${res.length ? `<button type="button" data-res aria-expanded="false">📚 ${res.length}</button>` : ''}</div>
      </div>
      ${res.length ? `<div class="tr-res" hidden>${Object.entries(groups).map(([kind, links]) => `<div><b>${KIND[kind] || kind}</b> ${links.join(' · ')}</div>`).join('')}</div>` : ''}
    </div>`;
  }
  function drawRow(k) {
    const el = document.getElementById(k); if (!el) return;
    const st = status(k), c = CONF[k] || 0;
    el.dataset.s = st.s; el.dataset.c = c;
    el.querySelector('[data-pill]').textContent = st.s === 'learning' ? `Learning · ${Math.floor(st.got)}/${st.need}` : st.s === 'secured' ? 'Secured ✓' : ST[st.s];
    el.querySelectorAll('[data-conf]').forEach(b => b.classList.toggle('on', +b.dataset.conf === c));
    el.classList.toggle('check', c === 3 && st.s !== 'secured' && st.s !== 'na');
    el.classList.toggle('taught', !!TAUGHT[el.dataset.sub]);
  }
  function counts(L) {
    const c = { none: 0, learning: 0, secured: 0, rusty: 0, na: 0, check: 0, conf: 0, total: 0 };
    SPEC.find(s => s.name[0] === L).topics.forEach(t => t.subs.forEach(sb => sb.points.forEach(p => {
      const st = status(p.key).s; c[st]++; c.total++; if (CONF[p.key] === 3) { c.conf++; if (st !== 'secured' && st !== 'na') c.check++; }
    })));
    return c;
  }
  const bar = c => { const q = c.total - c.na || 1; return `<div class="sbar">${['secured', 'rusty', 'learning'].map(s => `<i class="c-${s}" style="width:${c[s] / q * 100}%"></i>`).join('')}</div>`; };
  function drawSummary() {
    const box = $('trSum'); if (!box) return;
    const c = counts(LET[subject]), q = c.total - c.na;
    box.innerHTML = `${bar(c)}<div class="snums"><span><b class="c-secured">${c.secured}</b> secured</span><span><b class="c-learning">${c.learning}</b> learning</span><span><b class="c-rusty">${c.rusty}</b> rusty</span><span><b>${c.none}</b> not started</span></div>
      <div class="snote">${uid ? '' : '<b>Not signed in:</b> progress is kept in this browser only. Sign in (top right) to save it to your account. · '}You rated <b>${c.conf}</b> point${c.conf === 1 ? '' : 's'} "Confident"${c.check ? ` — <a href="#" data-goto="check"><b>${c.check} to check</b></a> (not proved yet)` : ''}.${YEAR ? ` Year ${YEAR}: <b>${Object.keys(TAUGHT).filter(k => k[0] === LET[subject]).length}</b> sub-topics covered in class.` : ''}</div>`;
    const g = box.querySelector('[data-goto]'); if (g) g.onclick = e => { e.preventDefault(); root.querySelector('[data-f="check"]').click(); };
    const F = { all: c.total, none: c.none, learning: c.learning, rusty: c.rusty, secured: c.secured, check: c.check, class: root.querySelectorAll('.tr-pt.taught').length };
    root.querySelectorAll('[data-f]').forEach(b => { b.querySelector('span').textContent = F[b.dataset.f] != null ? ' ' + F[b.dataset.f] : ''; });
    root.querySelectorAll('[data-tbar]').forEach(t => { const L = t.dataset.tbar; const pts = [...root.querySelectorAll(`.tr-topic#t-${L} .tr-pt`)].filter(x => x.dataset.s !== 'na'); const sec = pts.filter(x => x.dataset.s === 'secured').length; t.textContent = pts.length ? `${sec}/${pts.length} secured` : ''; });
    root.querySelectorAll('[data-cic]').forEach(e => { e.hidden = !TAUGHT[e.dataset.cic]; });
  }
  function applyFilter() {
    root.classList.toggle('filtered', FILTER !== 'all');
    root.querySelectorAll('.tr-pt').forEach(el => {
      const show = FILTER === 'all' || (FILTER === 'check' ? el.classList.contains('check') : FILTER === 'class' ? el.classList.contains('taught') : el.dataset.s === FILTER);
      el.hidden = !show;
    });
    root.querySelectorAll('.tr-sub').forEach(s => { s.hidden = !s.querySelector('.tr-pt:not([hidden])'); });
    root.querySelectorAll('.tr-topic').forEach(s => { s.hidden = !s.querySelector('.tr-pt:not([hidden])'); });
  }

  /* ---------- overview page ---------- */
  function drawOverview() {
    root.innerHTML = `<div class="tr-head"><div class="tr-kick">Edexcel International GCSE · ${window.CBSCourse ? CBSCourse.label : 'Science (Double Award)'} and Maths</div><h1>Spec Trackers</h1>
      <p class="tr-lede">Every spec point in one place, with how much you've proved, how sure you feel, and everything on the site that teaches it.${window.CBSCourse && CBSCourse.sa ? ` Your course is <b>Science (Single Award)</b>: only its spec points are shown. The exam is ${CBSCourse.exam}.` : ''}</p></div>
      <div class="ov">${['biology', 'chemistry', 'physics'].map(s => { const c = counts(LET[s]), q = c.total - c.na;
        return `<a class="ovc s-${s}" href="${s}.html"><h2>${SUBJ[s]}</h2>${bar(c)}<p><b>${c.secured}</b> of ${q} secured · ${c.learning} learning${c.rusty ? ` · ${c.rusty} rusty` : ''}</p>
          <p class="muted">${c.conf} rated confident${c.check ? ` · <b>${c.check} to check</b>` : ''}</p><span class="go">Open ${SUBJ[s]} →</span></a>`; }).join('')}
        <a class="ovc s-maths" href="maths.html"><h2>Maths</h2><p class="muted">The maths specification with worksheets for each topic.</p><span class="go">Open Maths →</span></a></div>
      <p class="tr-lede" style="margin-top:14px">${uid ? '' : '<b>Not signed in:</b> progress shown is this browser only. '}Points turn green from <a href="${Q}practice.html">Practice Questions</a>, Cakebread Questing missions and <a href="/Flashcards/">Flashcards</a>.</p>`;
  }

  function drawAll() {
    if (VIEW === 'overview') return drawOverview();
    if (!root.querySelector('.tr-pt')) buildSubject();
    root.querySelectorAll('.tr-pt').forEach(el => drawRow(el.dataset.k));
    drawSummary(); applyFilter();
  }

  drawAll();
  if (QEx()) QEx().onChange(() => drawAll());
  try {
    if (!window.firebase || !window.firebaseConfig) throw new Error('no firebase');
    if (!firebase.apps.length) firebase.initializeApp(window.firebaseConfig);
    firebase.auth().onAuthStateChanged(u => { loadConf(u); });
  } catch (e) { loadConf(null); }
  if (window.CBSYear) CBSYear.onChange(() => loadTaught());
})();
