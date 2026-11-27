/* Cakebread Questing quick quiz: spec picker (subject → topic → sub-topic → points), solo mode and team (projector) mode.
   Needs spec.js (SPEC) and questions.js (QUESTIONS). Question spec ids: subject letter + point id, e.g. 'P3.5'. */
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem('specquiz.' + k)); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem('specquiz.' + k, JSON.stringify(v)); } catch (e) {} }
};
const SUBJ_COL = { Biology: 'var(--bio)', Chemistry: 'var(--chem)', Physics: 'var(--phys)' };
const TEAM_COLS = ['#d62828', '#1d4ed8', '#2e7d32', '#f59e0b', '#7b1fa2', '#0e7490'];
const TEAM_NAMES = ['Red', 'Blue', 'Green', 'Gold', 'Purple', 'Teal'];

/* nuclide notation: <span class="nuc"><sup>A</sup><sub>Z</sub>X</span> → stacked numbers */
const nuc = h => h.replace(/<span class="nuc"><sup>(.*?)<\/sup><sub>(.*?)<\/sub>/g, '<span class="nuc"><span class="ns"><i>$1</i><i>$2</i></span>');

/* Physics 'Units' sub-topics are not shown (user's choice, 7 Nov): unit questions live inside the sub-topics that use them. */
SPEC.forEach(s => s.topics.forEach(t => { t.subs = t.subs.filter(sb => sb.name !== 'Units'); }));

/* ---------- index the spec ---------- */
const POINTS = {};          // key → {key, id, text, subject, topic, sub, ...}
SPEC.forEach(s => s.topics.forEach(t => t.subs.forEach(sb => sb.points.forEach(p => {
  const key = s.name[0] + p.id;
  POINTS[key] = { ...p, key, subject: s.name, topic: t, sub: sb };
}))));
const QBY = {};             // key → [questions]
QUESTIONS.forEach((q, i) => {
  q.i = i;
  if (!POINTS[q.s]) { console.warn('Question tied to unknown spec point', q.s, q.q); return; }
  if (q.dg && !(typeof DQ !== 'undefined' && DQ.ok())) return;   // diagram questions only where diagrams.js is loaded
  (QBY[q.s] = QBY[q.s] || []).push(q);
});
const qCount = keys => keys.reduce((n, k) => n + (QBY[k] ? QBY[k].length : 0), 0);
SPEC.forEach(s => s.topics.forEach(t => t.subs.forEach(sb => sb.points.forEach(p => { p.key = s.name[0] + p.id; }))));
const keysOfSub = sb => sb.points.map(p => p.key);

/* ---------- selection ---------- */
const withQs = () => Object.keys(QBY);
let SEL = new Set(store.get('sel') || []);   // last visit's ticks; nothing ticked on a first visit (user, 9 Nov)
let OPEN = new Set(store.get('open') || []);
const saveSel = () => store.set('sel', [...SEL]);
const saveOpen = () => store.set('open', [...OPEN]);

function nodeKeys(kind, obj) {
  if (kind === 'subj') return obj.topics.flatMap(t => t.subs.flatMap(keysOfSub));
  if (kind === 'topic') return obj.subs.flatMap(keysOfSub);
  return keysOfSub(obj);
}

function pill(n) { return n ? `<span class="pill">${n} question${n === 1 ? '' : 's'}</span>` : '<span class="pill none">no questions yet</span>'; }

function drawTree() {
  const html = SPEC.map((s, si) => {
    const sid = 's' + si;
    const topics = s.topics.map((t, ti) => {
      const tid = sid + 't' + ti;
      const subs = t.subs.map((sb, bi) => {
        const bid = tid + 'b' + bi;
        let lastH = null;
        const pts = sb.points.map(p => {
          const n = (QBY[p.key] || []).length;
          let h = '';
          if (p.h && p.h !== lastH) { h = `<li class="pthead">${esc(p.h)}</li>`; lastH = p.h; }
          return h + `<li><label class="pt ${n ? '' : 'empty'}"><input type="checkbox" data-key="${p.key}" ${SEL.has(p.key) ? 'checked' : ''}>
            <span class="pid">${p.id}</span>
            <span class="ptx">${esc(p.text)}${p.eq ? `<span class="eq">${esc(p.eq)}</span>` : ''}${p.note ? `<span class="det"><i>Note: ${esc(p.note)}</i></span>` : ''}${p.bullets ? `<ul>${p.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}${p.detail ? `<span class="det">${esc(p.detail)}</span>` : ''}</span>
            ${pill(n)}</label></li>`;
        }).join('');
        return node('sub', bid, `(${sb.l})`, sb.name, nodeKeys('sub', sb), `<ul class="points">${pts}</ul>`);
      }).join('');
      return node('topic', tid, t.n, t.name, nodeKeys('topic', t), `<ul>${subs}</ul>`);
    }).join('');
    return node('subj', sid, '', s.name, nodeKeys('subj', s), `<ul>${topics}</ul>`, SUBJ_COL[s.name]);
  }).join('');
  $('tree').innerHTML = html;
  $('tree').querySelectorAll('.node').forEach(el => setCheck(el));
  updateCount();
}

function node(kind, id, num, name, keys, inner, col) {
  const n = qCount(keys);
  return `<li class="node ${kind} ${n ? '' : 'empty'} ${OPEN.has(id) ? 'open' : ''}" data-id="${id}" data-keys="${keys.join(' ')}" ${col ? `style="--sc:${col}"` : ''}>
    <div class="row"><span style="width:${kind === 'subj' ? 12 : 0}px"></span><input type="checkbox" class="cb" aria-label="Include ${esc(name)}">
    <button class="exp" aria-expanded="${OPEN.has(id)}"><span class="chev">▶</span>${num !== '' ? `<span class="num">${num}</span>` : ''}<span class="nm">${esc(name)}</span></button>${pill(n)}</div>${inner}</li>`;
}

/* a box counts as ticked when all its points WITH questions are ticked (or all points, if none have questions yet) */
function liveKeys(keys) { const q = keys.filter(k => QBY[k]); return q.length ? q : keys; }
function setCheck(el) {
  const all = el.dataset.keys.split(' '), keys = liveKeys(all);
  const on = keys.filter(k => SEL.has(k)).length;
  const cb = el.querySelector(':scope > .row > .cb');
  cb.checked = on === keys.length;
  cb.indeterminate = !cb.checked && all.some(k => SEL.has(k));
}

function refreshChecks() {
  $('tree').querySelectorAll('.node').forEach(setCheck);
  $('tree').querySelectorAll('.pt input').forEach(i => { i.checked = SEL.has(i.dataset.key); });
  updateCount();
}

/* lv = the difficulty levels to include, e.g. [1, 2] (questions.js); anything else = all levels */
const lvOk = (lv, q) => !Array.isArray(lv) || lv.includes(q.lv || 1);
const keepQ = (q, lv, calc, diag) => lvOk(lv, q) && (calc || !q.calc) && (diag !== false || !q.dg);
function selectedPool(lv = null, calc = true, diag = true) { return [...SEL].flatMap(k => QBY[k] || []).filter(q => keepQ(q, lv, calc, diag)); }
/* saved settings from before levels had hard: true|false */
const cfgLv = s => { if (!Array.isArray(s.lv) || !s.lv.length) s.lv = s.hard === false ? [1, 2] : [1, 2, 3]; delete s.hard; return s; };
const TEAM_PTS = { 1: 100, 2: 150, 3: 200 };
const lvChips = s => `<h3 style="margin-top:16px">Levels</h3><div class="chips">${[1, 2, 3].map(l => `<button class="chip ${s.lv.includes(l) ? 'on' : ''}" data-lv="${l}">Level ${l}${l === 3 ? ' ★' : ''}</button>`).join('')}</div>
        <p class="small" style="margin-top:6px">Level 1: facts and definitions. Level 2: explain, apply, calculate. Level 3 ★: several steps or a trap.</p>`;
const lvWire = (box, s, draw) => box.querySelectorAll('[data-lv]').forEach(b => b.onclick = () => { const l = +b.dataset.lv, on = s.lv.includes(l); if (on && s.lv.length === 1) return; s.lv = on ? s.lv.filter(x => x !== l) : s.lv.concat(l).sort(); draw(); });

function updateCount() {
  const pool = selectedPool();
  const pts = new Set(pool.map(q => q.s)).size, byLv = [1, 2, 3].map(l => pool.filter(q => (q.lv || 1) === l).length);
  $('selCount').innerHTML = pool.length ? `<b>${pool.length}</b> questions from ${pts} spec point${pts === 1 ? '' : 's'} <span class="small" style="color:#bbb">(level 1: ${byLv[0]} · level 2: ${byLv[1]} · level 3 ★: ${byLv[2]})</span>` : '<b>0</b> questions: tick some spec points with questions';
  $('soloBtn').disabled = $('teamBtn').disabled = !pool.length;
}

$('tree').addEventListener('click', e => {
  const exp = e.target.closest('.exp');
  if (exp) {
    const li = exp.closest('.node'); li.classList.toggle('open');
    const open = li.classList.contains('open'); exp.setAttribute('aria-expanded', open);
    open ? OPEN.add(li.dataset.id) : OPEN.delete(li.dataset.id); saveOpen();
  }
});
$('tree').addEventListener('change', e => {
  const t = e.target;
  if (t.classList.contains('cb')) {
    const keys = t.closest('.node').dataset.keys.split(' ');
    const on = liveKeys(keys).every(k => SEL.has(k));
    keys.forEach(k => on ? SEL.delete(k) : SEL.add(k));
  } else if (t.dataset.key) {
    t.checked ? SEL.add(t.dataset.key) : SEL.delete(t.dataset.key);
  }
  saveSel(); refreshChecks();
});
$('selAll').onclick = () => { SEL = new Set(withQs()); saveSel(); refreshChecks(); };
$('selNone').onclick = () => { SEL.clear(); saveSel(); refreshChecks(); };
$('expAll').onclick = () => { $('tree').querySelectorAll('.node').forEach(li => { li.classList.add('open'); OPEN.add(li.dataset.id); }); saveOpen(); };
$('colAll').onclick = () => { $('tree').querySelectorAll('.node').forEach(li => li.classList.remove('open')); OPEN.clear(); saveOpen(); };

/* ---------- screens ---------- */
let SOLO = null, TEAM = null, KEYS = null;
function show(id) {
  ['menu', 'solosetup', 'teamsetup', 'play', 'results'].forEach(x => $(x).classList.toggle('hidden', x !== id));
  document.body.classList.toggle('proj', !!TEAM && (id === 'play' || id === 'results'));
  window.scrollTo(0, 0);
}
function menu() { if (TEAM && TEAM.stop) TEAM.stop(); SOLO = TEAM = KEYS = null; show('menu'); }
$('quit').onclick = menu;

function scopeText() {
  const pts = [...new Set(selectedPool().map(q => q.s))];
  const by = {};
  pts.forEach(k => { const p = POINTS[k]; const lab = `${p.subject} ${p.topic.n}(${p.sub.l}) ${p.sub.name}`; by[lab] = (by[lab] || 0) + 1; });
  return Object.keys(by).join(' · ');
}

/* build a quiz of n questions spread evenly over the selected spec points */
function buildQuiz(n, lv = null, calc = true, diag = true) {
  const groups = shuffle([...SEL].filter(k => QBY[k]).map(k => shuffle(QBY[k].filter(q => keepQ(q, lv, calc, diag)))).filter(g => g.length));
  const out = [], cap = Math.ceil(n / 3); let nd = 0;   // diagram questions: at most a third of the quiz
  const can = q => !q.dg || nd < cap;
  while (out.length < n && groups.some(g => g.some(can))) groups.forEach(g => { if (out.length >= n) return; const j = g.map(can).lastIndexOf(true); if (j < 0) return; const q = g.splice(j, 1)[0]; if (q.dg) nd++; out.push(q); });
  return shuffle(out).sort((a, b) => (a.lv || 1) - (b.lv || 1)).map(inst);   // climbs from level 1 to level 3
}

/* ---------- "Report this question" ----------
   Reports go to Realtime Database specQuizReports/{pushId}; only admins can read them (reports.html).
   One report per question per page visit, max 10 per visit. If sending fails they wait in localStorage and are retried. */
const REPORT_REASONS = ['The marked answer is wrong', 'More than one answer is right', 'The wording is confusing', 'Spelling or typing mistake', 'Not on the spec / too hard', 'Something else'];
const REPORTED = new Set();
function reportPayload(q, opts, pickedIdx, reason, comment) {
  const u = (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && firebase.auth && firebase.auth().currentUser) || null;
  const n = u && u.displayName ? u.displayName.trim().split(/\s+/) : null;
  return {
    qid: q.id, reason, comment: (comment || '').slice(0, 400),
    shown: (q.q || '').replace(/<[^>]+>/g, '').slice(0, 400), ...(q.seed ? { seed: q.seed } : {}),
    options: opts.map(o => (o.t || '').replace(/<[^>]+>/g, '').slice(0, 120)),
    correct: opts.findIndex(o => o.ok), picked: pickedIdx === null ? -1 : pickedIdx,
    mode: TEAM ? 'team' : 'solo',
    name: n ? n[0] + (n.length > 1 ? ' ' + n[n.length - 1][0] + '.' : '') : '', uid: u ? u.uid : '',
    t: Date.now()
  };
}
function pushReport(rep) {
  try {
    if (typeof firebase === 'undefined' || !firebase.apps || !firebase.apps.length || !firebase.database) return Promise.reject(new Error('offline'));
    return firebase.database().ref('specQuizReports').push(rep);
  } catch (e) { return Promise.reject(e); }
}
function queueReport(rep) { const q = store.get('reportQueue') || []; q.push(rep); store.set('reportQueue', q.slice(-30)); }
function flushReports() {
  const q = store.get('reportQueue') || []; if (!q.length) return;
  store.set('reportQueue', []);
  q.forEach(rep => pushReport(rep).catch(() => queueReport(rep)));
}
setTimeout(flushReports, 4000);
function reportUI(box, q, opts, getPicked) {
  const link = box.querySelector('.replink'), panel = box.querySelector('.repbox');
  if (REPORTED.has(q.id)) { link.textContent = '⚑ Reported, thank you'; link.disabled = true; }
  link.onclick = () => {
    if (link.disabled) return;
    panel.classList.toggle('hidden');
    if (panel.innerHTML) return;
    panel.innerHTML = `<b>What’s wrong with this question?</b>
      <div class="chips">${REPORT_REASONS.map((r, i) => `<button type="button" class="chip" data-r="${i}">${esc(r)}</button>`).join('')}</div>
      <textarea maxlength="400" placeholder="Optional: tell us more (e.g. what you think the answer should be)"></textarea>
      <div class="reprow"><button type="button" class="btn green repsend" disabled>Send report</button><button type="button" class="btn alt repcancel">Cancel</button><span class="repmsg"></span></div>`;
    let reason = null;
    panel.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { reason = REPORT_REASONS[+b.dataset.r]; panel.querySelectorAll('[data-r]').forEach(x => x.classList.toggle('on', x === b)); panel.querySelector('.repsend').disabled = false; });
    panel.querySelector('.repcancel').onclick = () => panel.classList.add('hidden');
    panel.querySelector('.repsend').onclick = () => {
      if (!reason) return;
      if (REPORTED.size >= 10) { panel.querySelector('.repmsg').textContent = 'That’s the limit for this visit. Thank you!'; return; }
      const rep = reportPayload(q, opts, getPicked(), reason, panel.querySelector('textarea').value);
      REPORTED.add(q.id);
      const done = (ok) => { panel.innerHTML = ok ? '<b>Thank you!</b> Your teacher will check this question.' : '<b>Saved.</b> It couldn’t be sent right now, so it will be sent next time you open the quiz.'; link.textContent = '⚑ Reported, thank you'; link.disabled = true; };
      panel.querySelector('.repsend').disabled = true;
      pushReport(rep).then(() => done(true)).catch(() => { queueReport(rep); done(false); });
    };
  };
}

/* a question ready to show: generators make fresh numbers each time */
function inst(q) { return q.gen ? { ...q, ...q.gen(R) } : q; }
const QBYID = {}; QUESTIONS.forEach(q => { QBYID[q.id] = q; });

/* ---------- render one question ---------- */
function renderQ(q, box, onAnswer) {
  const p = POINTS[q.s];
  const isTF = 'tf' in q;
  let opts = isTF ? [{ t: 'True', ok: q.tf === true }, { t: 'False', ok: q.tf === false }] : shuffle(q.o.map((t, i) => ({ t, ok: i === 0 })));
  let keys = isTF ? ['T', 'F'] : ['A', 'B', 'C', 'D'];
  if (q.svg && typeof DQ !== 'undefined') { const d = DQ.order(opts, o => o.t); opts = d.opts; if (d.letters) keys = ['1', '2', '3', '4']; }   // letter answers in order, numbered keys
  box.innerHTML = `<span class="qtag" style="--sc:${SUBJ_COL[p.subject]}">${p.subject} ${p.id} <span class="tf">· ${isTF ? 'True or false?' : 'Multiple choice'}</span>${q.lv ? `<span class="hardtag lv${q.lv}">${lvLabel(q)}</span>` : ''}</span>
    ${typeof DQ !== 'undefined' ? DQ.fig(q) : ''}<div class="prompt">${nuc(q.q)}</div>
    <div class="opts ${isTF ? 'n2' : ''}">${opts.map((o, i) => `<button class="opt" data-i="${i}"><span class="key">${keys[i]}</span><span>${nuc(o.t)}</span></button>`).join('')}</div>
    <div class="qfoot"><button class="replink" type="button">⚑ Report this question</button><div class="repbox hidden"></div></div>`;
  const btns = [...box.querySelectorAll('.opt')];
  let locked = false, picked = null;
  reportUI(box, q, opts, () => picked);
  const ctl = {
    keys, isTF, answer: opts.findIndex(o => o.ok),
    pick(i) { if (locked || !btns[i] || btns[i].disabled) return; const ok = opts[i].ok; if (picked === null) picked = i; btns[i].classList.add(ok ? 'right' : 'wrong'); if (!ok) btns[i].disabled = true; onAnswer(ok, i); },
    stop() { locked = true; btns.forEach(b => b.disabled = true); },
    reveal() { btns.forEach((b, i) => { if (opts[i].ok) b.classList.add('right'); else b.classList.add('dead'); }); },
    retry() { /* wrong buttons stay crossed out; others stay live */ }
  };
  btns.forEach((b, i) => b.onclick = () => ctl.pick(i));
  return ctl;
}

document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 'Enter') { const nx = $('nx'); if (nx && !$('play').classList.contains('hidden')) { e.preventDefault(); nx.click(); } return; }
  if (!KEYS) return;
  const i = KEYS.keys.indexOf(e.key.toUpperCase());
  if (i >= 0) KEYS.pick(i);
});

/* ---------- solo ---------- */
$('soloBtn').onclick = () => {
  const s = cfgLv(Object.assign({ n: 10, calc: true, diag: true }, store.get('solocfg') || {}));
  const box = $('solosetup');
  const draw = () => {
    const total = selectedPool(s.lv, s.calc, s.diag).length;
    if (!total && !(s.calc && s.lv.length === 3 && s.diag)) { s.calc = s.diag = true; s.lv = [1, 2, 3]; return draw(); }
    const choices = [5, 10, 20, 30].filter(n => n < total).concat([total]);
    if (!choices.includes(s.n)) s.n = Math.min(10, total);
    box.innerHTML = `<a class="back" href="#" id="ssBack">← Choose content</a><h1>Solo</h1>
      <p class="scope">${esc(scopeText())}</p>
      <div class="card" style="margin-top:14px"><div class="in setup">
        <h3>How many questions?</h3>
        <div class="chips">${choices.map(n => `<button class="chip ${s.n === n ? 'on' : ''}" data-n="${n}">${n === total ? `All ${n}` : n}</button>`).join('')}</div>
        ${lvChips(s)}
        <label class="toggle"><input type="checkbox" id="calcOn" ${s.calc ? 'checked' : ''}> Include calculation questions</label>
        <label class="toggle"><input type="checkbox" id="diagOn" ${s.diag ? 'checked' : ''}> Include diagram and graph questions</label>
        <div style="margin-top:18px"><button class="btn big green" id="ssGo">Start →</button></div>
      </div></div>`;
    box.querySelector('#ssBack').onclick = ev => { ev.preventDefault(); menu(); };
    box.querySelectorAll('[data-n]').forEach(b => b.onclick = () => { s.n = +b.dataset.n; draw(); });
    lvWire(box, s, draw);
    box.querySelector('#calcOn').onchange = ev => { s.calc = ev.target.checked; draw(); };
    box.querySelector('#diagOn').onchange = ev => { s.diag = ev.target.checked; draw(); };
    box.querySelector('#ssGo').onclick = () => { store.set('solocfg', s); startSolo(s.n, s.lv, s.calc, s.diag); };
  };
  draw(); show('solosetup');
};

function startSolo(n, lv, calc, diag) {
  SOLO = { qs: buildQuiz(n, lv, calc, diag), qi: -1, score: 0, res: [], n, lv, calc, diag };
  TEAM = null; show('play'); nextSolo();
}
function soloHud() {
  const pips = SOLO.qs.map((_, i) => `<i class="${i < SOLO.res.length ? (SOLO.res[i] ? 'done' : 'miss') : i === SOLO.qi ? 'now' : ''}"></i>`).join('');
  const label = SOLO.title || 'Solo';
  const yBar = SOLO.warmup
    ? `<div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center;margin-top:6px">${['Y8', 'Y9', 'Y10', 'Y11'].map(y => `<button type="button" class="chip ${SOLO.year === y ? 'on' : ''}" data-wy="${y}" style="padding:3px 9px;font-size:13px">${y.replace('Y', 'Year ')}</button>`).join('')}<button type="button" class="chip" id="wNew5" style="padding:3px 9px;font-size:13px;background:#facc15;color:#111;border-color:#111">↻ New 5</button></div>`
    : '';
  $('hud').innerHTML = `<div><span class="meta">Question ${SOLO.qi + 1} of ${SOLO.qs.length}${SOLO.sub ? ' · ' + esc(SOLO.sub) : ''}</span><div class="rname">${esc(label)}</div><div class="pips">${pips}</div>${yBar}</div><div class="score">${SOLO.score}<small>CORRECT</small></div>`;
  if (SOLO.warmup) {
    $('hud').querySelectorAll('[data-wy]').forEach(b => b.onclick = () => launchWarmup(b.dataset.wy, SOLO.exclude));
    const nw = $('wNew5'); if (nw) nw.onclick = () => launchWarmup(SOLO.year, SOLO.exclude);
  }
}
function nextSolo() {
  SOLO.qi++;
  if (SOLO.qi >= SOLO.qs.length) return soloResults();
  const q = SOLO.qs[SOLO.qi];
  soloHud();
  $('stage').innerHTML = '<div id="qbox"></div><div id="fb"></div><div class="nextrow" id="nextrow"></div>';
  const ctl = renderQ(q, $('qbox'), ok => {
    ctl.stop(); if (!ok) ctl.reveal();
    SOLO.res.push(ok); if (ok) SOLO.score++;
    soloHud();
    $('fb').innerHTML = `<div class="fb ${ok ? '' : 'bad'}"><b>${ok ? 'Correct!' : 'Not quite.'}</b> ${nuc(q.x)}</div>`;
    $('nextrow').innerHTML = `<button class="btn big green" id="nx">${SOLO.qi === SOLO.qs.length - 1 ? 'See results' : 'Next'} →</button>`;
    $('nx').onclick = nextSolo; $('nx').focus({ preventScroll: true });
  });
  KEYS = ctl;
}
function soloResults() {
  KEYS = null;
  const n = SOLO.qs.length, pct = Math.round(SOLO.score / n * 100);
  const missed = SOLO.qs.filter((q, i) => !SOLO.res[i]);
  const pts = [...new Set(missed.map(q => q.s))];
  $('results').innerHTML = `<div class="card"><div class="in">
    <h2>Results</h2><div class="bigscore">${SOLO.score} / ${n}</div>
    <p style="font-size:18px;margin-top:4px">${pct}% · ${pct === 100 ? 'Perfect!' : pct >= 80 ? 'Great work.' : pct >= 50 ? 'Good start. Revise the points below.' : 'Go back over the points below, then try again.'}</p>
    ${pts.length ? `<h3>Revise these spec points</h3><ul class="revise">${pts.map(k => { const p = POINTS[k]; return `<li style="--sc:${SUBJ_COL[p.subject]}"><b>${p.subject} ${p.id}</b>${esc(p.text)}${missed.filter(q => q.s === k).map(q => `<span class="q">✗ ${nuc(q.q)}</span>`).join('')}</li>`; }).join('')}</ul>` : ''}
    <div style="margin-top:18px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn big green" id="again">${SOLO.warmup ? '↻ Another 5 Warm-Up questions' : 'Play again'}</button><button class="btn big alt" id="tomenu">Change content</button></div>
  </div></div>`;
  $('again').onclick = () => SOLO.warmup ? launchWarmup(SOLO.year, SOLO.exclude) : startSolo(SOLO.n, SOLO.lv, SOLO.calc, SOLO.diag);
  $('tomenu').onclick = menu;
  show('results');
}

/* ---------- team ---------- */
/* ?team (the admin's "Team quiz" button, 17 Nov): team game only */
if (new URLSearchParams(location.search).has('team')) { $('soloBtn').hidden = true; $('teamBtn').textContent = 'Set up the teams →'; $('teamBtn').classList.remove('alt'); $('teamBtn').classList.add('green'); }
$('teamBtn').onclick = () => {
  const s = cfgLv(Object.assign({ n: 4, names: TEAM_NAMES.slice(), per: 3, timer: 30, steal: true, calc: false, diag: true }, store.get('teamcfg') || {}));
  const box = $('teamsetup');
  const draw = () => {
    const total = selectedPool(s.lv, s.calc, s.diag).length;
    if (!total && !(s.calc && s.diag && s.lv.length === 3)) { s.calc = s.diag = true; s.lv = [1, 2, 3]; return draw(); }
    const perChoices = [2, 3, 5, 8, 10].filter(p => p * s.n <= total);
    if (!perChoices.length) perChoices.push(Math.max(1, Math.floor(total / s.n)));
    if (!perChoices.includes(s.per)) s.per = perChoices.reduce((a, b) => Math.abs(b - 3) < Math.abs(a - 3) ? b : a);
    box.innerHTML = `<a class="back" href="#" id="tsBack">← Choose content</a><h1>Team game</h1>
      <p class="lede">For the board. Teams take turns; tap the answer the team chooses (or press A–D / T–F). A wrong answer can be stolen by another team for half points.</p>
      <p class="scope">${esc(scopeText())}</p>
      <div class="card" style="margin-top:14px"><div class="in setup">
        <h3>1. How many teams?</h3><div class="chips">${[2, 3, 4, 5, 6].map(n => `<button class="chip ${s.n === n ? 'on' : ''}" data-n="${n}">${n}</button>`).join('')}</div>
        <div class="teamnames">${Array.from({ length: s.n }, (_, i) => `<label style="--c:${TEAM_COLS[i]}"><i></i><input value="${esc(s.names[i] || TEAM_NAMES[i])}" data-i="${i}" maxlength="18" aria-label="Team ${i + 1} name"></label>`).join('')}</div>
        <h3>2. Questions per team</h3><div class="chips">${perChoices.map(n => `<button class="chip ${s.per === n ? 'on' : ''}" data-p="${n}">${n}</button>`).join('')}</div>
        <p class="small" style="margin-top:6px">${s.n * s.per} questions in total (${total} available in the content you ticked).</p>
        <h3>3. Timer (optional)</h3><div class="chips">${[0, 20, 30, 45, 60].map(n => `<button class="chip ${s.timer === n ? 'on' : ''}" data-t="${n}">${n ? n + ' s' : 'Off'}</button>`).join('')}</div>
        <label class="toggle"><input type="checkbox" id="steal" ${s.steal ? 'checked' : ''}> Steals: a wrong answer passes to a random other team for half points (not on true-or-false questions)</label>
        ${lvChips(s).replace('Level 3 ★: several steps or a trap.', 'Level 3 ★: several steps or a trap. Points: 100, 150 and 200 (half for a steal).')}
        <label class="toggle"><input type="checkbox" id="calcOn" ${s.calc ? 'checked' : ''}> Include calculation questions (off by default: they need working out, which is slow on the board)</label>
        <label class="toggle"><input type="checkbox" id="diagOn" ${s.diag ? 'checked' : ''}> Include diagram and graph questions</label>
        <div style="margin-top:18px"><button class="btn big green" id="tsGo">Start: ${s.n * s.per} questions →</button></div>
      </div></div>`;
    box.querySelector('#tsBack').onclick = ev => { ev.preventDefault(); menu(); };
    box.querySelectorAll('[data-n]').forEach(b => b.onclick = () => { s.n = +b.dataset.n; draw(); });
    box.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { s.per = +b.dataset.p; draw(); });
    box.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { s.timer = +b.dataset.t; draw(); });
    box.querySelectorAll('.teamnames input').forEach(i => i.oninput = () => { s.names[+i.dataset.i] = i.value; });
    box.querySelector('#steal').onchange = ev => { s.steal = ev.target.checked; };
    lvWire(box, s, draw);
    box.querySelector('#calcOn').onchange = ev => { s.calc = ev.target.checked; draw(); };
    box.querySelector('#diagOn').onchange = ev => { s.diag = ev.target.checked; draw(); };
    box.querySelector('#tsGo').onclick = () => { store.set('teamcfg', s); startTeam(s); };
  };
  draw(); show('teamsetup');
};

function startTeam(s) {
  SOLO = null;
  TEAM = { cfg: s, teams: Array.from({ length: s.n }, (_, i) => ({ name: (s.names[i] || '').trim() || TEAM_NAMES[i], col: TEAM_COLS[i], score: 0, right: 0 })), qs: buildQuiz(s.n * s.per, s.lv, s.calc, s.diag), qi: -1 };
  show('play'); nextTeamQ();
}

function nextTeamQ() {
  if (TEAM.stop) TEAM.stop();
  TEAM.qi++;
  if (TEAM.qi >= TEAM.qs.length) return podium();
  const q = TEAM.qs[TEAM.qi], n = TEAM.teams.length;
  let turn = TEAM.qi % n, steal = false, over = false, timer = null;
  const hud = () => {
    $('hud').innerHTML = `<div class="teamturn" style="--c:${TEAM.teams[turn].col}"><span class="meta">Question ${TEAM.qi + 1} of ${TEAM.qs.length}${` · ${lvLabel(q)}: ${TEAM_PTS[q.lv] || 100} points`}</span><span class="tname">${steal ? 'STEAL! ' : ''}${esc(TEAM.teams[turn].name)}${steal ? ' (half points)' : '’s turn'}</span></div>
      <div class="board">${TEAM.teams.map((t, i) => `<div class="tscore ${i === turn && !over ? 'now' : ''}" style="--c:${t.col}"><span>${esc(t.name)}</span><b>${t.score}</b></div>`).join('')}</div>`;
  };
  $('stage').innerHTML = `<div class="tbar hidden" id="tbar"><i></i><span></span></div><div id="qbox"></div><div id="fb"></div>
    <div class="nextrow" id="nextrow"><button class="btn alt" id="reveal">Reveal answer</button></div>`;
  const startTimer = () => {
    clearInterval(timer); const T = TEAM.cfg.timer; if (!T) return;
    const bar = $('tbar'); bar.classList.remove('hidden'); const t0 = Date.now();
    timer = setInterval(() => {
      const left = Math.max(0, T - (Date.now() - t0) / 1000);
      bar.querySelector('i').style.width = (left / T * 100) + '%';
      bar.querySelector('span').textContent = Math.ceil(left) + ' s';
      bar.classList.toggle('low', left <= 5);
      if (left <= 0) { clearInterval(timer); onWrong(true); }
    }, 100);
  };
  const ctl = renderQ(q, $('qbox'), ok => { if (over) return; clearInterval(timer); ok ? onRight() : onWrong(false); });
  KEYS = ctl;
  function onRight() {
    over = true; const base = TEAM_PTS[q.lv] || 100, pts = steal ? base / 2 : base;
    TEAM.teams[turn].score += pts; TEAM.teams[turn].right++; ctl.stop();
    $('fb').innerHTML = `<div class="fb"><span class="pts">+${pts}</span><b>${esc(TEAM.teams[turn].name)} ${steal ? 'steal it!' : 'got it!'}</b> ${nuc(q.x)}</div>`;
    finish();
  }
  function onWrong(timeout) {
    if (TEAM.cfg.steal && !steal && n > 1 && !ctl.isTF) {
      steal = true; const others = TEAM.teams.map((_, i) => i).filter(i => i !== turn);
      turn = others[Math.floor(Math.random() * others.length)];
      hud();
      $('fb').innerHTML = `<div class="fb bad"><b>${timeout ? 'Time’s up!' : 'Not quite.'}</b> ${esc(TEAM.teams[turn].name)}, can you steal it?</div>`;
      startTimer(); return;
    }
    over = true; ctl.stop(); ctl.reveal();
    $('fb').innerHTML = `<div class="fb bad"><span class="pts">+0</span><b>${timeout ? 'Time’s up!' : 'Not quite.'}</b> ${nuc(q.x)}</div>`;
    finish();
  }
  function finish() {
    clearInterval(timer); KEYS = null; hud();
    $('nextrow').innerHTML = `<button class="btn big green" id="nx">${TEAM.qi === TEAM.qs.length - 1 ? 'Final scores' : 'Next question'} →</button>`;
    $('nx').onclick = nextTeamQ; $('nx').focus({ preventScroll: true });
  }
  $('reveal').onclick = () => { if (over) return; over = true; clearInterval(timer); ctl.stop(); ctl.reveal(); $('fb').innerHTML = `<div class="fb bad"><b>Answer revealed.</b> ${nuc(q.x)}</div>`; finish(); };
  TEAM.stop = () => clearInterval(timer);
  hud(); startTimer();
}

function podium() {
  KEYS = null;
  const ranked = TEAM.teams.slice().sort((a, b) => b.score - a.score), top = ranked[0].score, win = ranked.filter(t => t.score === top);
  $('results').innerHTML = `<div class="card podium"><div class="in">
    <h1>${win.length > 1 ? 'It’s a tie!' : esc(win[0].name) + ' win!'}</h1>
    <div class="pod">${ranked.map((t, i) => `<div class="pl" style="--c:${t.col};--h:${Math.max(6, top ? t.score / top * 100 : 6)}%"><b>${t.score}</b><div class="col"></div><span>${i + 1}. ${esc(t.name)}</span><span class="small">${t.right} right</span></div>`).join('')}</div>
    <div style="margin-top:22px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center"><button class="btn big green" id="again">Play again</button><button class="btn big alt" id="tomenu">Change content</button></div>
  </div></div>`;
  $('again').onclick = () => startTeam(TEAM.cfg);
  $('tomenu').onclick = menu;
  show('results');
}

drawTree();

/* ---------- Brain Warm-Up (?warmup=1) & Admin Reteach Quiz (?subs=...&n=5&auto=1) ---------- */
const SUB_KEYS_MAP = {};
SPEC.forEach(s => s.topics.forEach(t => t.subs.forEach(sb => {
  const sk = s.name[0] + t.n + sb.l;
  SUB_KEYS_MAP[sk.toUpperCase()] = keysOfSub(sb);
})));

async function fetchTaughtFor(yearKey) {
  try {
    if (window.CBSNet && CBSNet.rtGet) {
      const v = await CBSNet.rtGet('school/taught/' + yearKey, 6000);
      if (v && typeof v === 'object') return Object.keys(v);
    }
    if (window.firebase && firebase.apps && firebase.apps.length && firebase.database) {
      const snap = await Promise.race([
        firebase.database().ref('school/taught/' + yearKey).once('value'),
        new Promise((_, no) => setTimeout(() => no(new Error('timeout')), 6000))
      ]);
      const v = snap && snap.val();
      if (v && typeof v === 'object') return Object.keys(v);
    }
  } catch (e) {}
  return [];
}

async function launchWarmup(yearKey, excludeCode) {
  const Y = /^Y(8|9|10|11)$/.test(yearKey || '') ? yearKey : (store.get('warmupYear') || 'Y10');
  store.set('warmupYear', Y);
  const ex = String(excludeCode || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  let taughtSubs = await fetchTaughtFor(Y);
  let filtered = taughtSubs.filter(sk => !ex || !sk.toUpperCase().startsWith(ex));
  let pts = [...new Set(filtered.flatMap(sk => SUB_KEYS_MAP[sk.toUpperCase()] || []))].filter(k => QBY[k]);
  let subNote = `${Y.replace('Y', 'Year ')} · ${filtered.length} covered topic${filtered.length === 1 ? '' : 's'} (easy recall)`;
  if (pts.length < 5) {
    // Fallback if year has fewer than 5 covered topics or Firebase is offline
    pts = withQs().filter(k => !ex || !k.toUpperCase().startsWith(ex));
    subNote = `${Y.replace('Y', 'Year ')} · mixed easy recall across all topics`;
  }
  SEL = new Set(pts);
  let qs = buildQuiz(5, [1], false, false);
  if (qs.length < 5) qs = buildQuiz(5, [1, 2], true, true);
  SOLO = { qs, qi: -1, score: 0, res: [], n: 5, lv: [1], calc: false, diag: false, warmup: true, year: Y, exclude: excludeCode || '', title: '🔥 Brain Warm-Up', sub: subNote };
  TEAM = null; show('play'); nextSolo();
}

(function bootUrlModes() {
  const sp = new URLSearchParams(location.search);
  if (sp.get('warmup') === '1') {
    launchWarmup(sp.get('year') || '', sp.get('exclude') || '');
    return;
  }
  const subsParam = sp.get('subs') || sp.get('point') || '';
  if (subsParam) {
    const tokens = subsParam.split(',').map(s => s.trim()).filter(Boolean);
    const pts = [];
    tokens.forEach(tok => {
      if (POINTS[tok]) pts.push(tok);
      else if (SUB_KEYS_MAP[tok.toUpperCase()]) pts.push(...SUB_KEYS_MAP[tok.toUpperCase()]);
    });
    if (pts.length) {
      SEL = new Set(pts);
      refreshChecks();
      if (sp.get('auto') === '1') {
        const n = Math.max(1, Math.min(20, +(sp.get('n') || 5)));
        const qs = buildQuiz(n, [1, 2, 3], true, true);
        if (qs.length) {
          SOLO = { qs, qi: -1, score: 0, res: [], n: qs.length, lv: [1, 2, 3], calc: true, diag: true, title: '⚡ Board Reteach', sub: tokens.join(', ') };
          TEAM = null; show('play'); nextSolo();
        }
      }
    }
  }
})();
