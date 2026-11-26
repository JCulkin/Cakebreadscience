/* Cakebread Science — Student Study Guide engine (Option B split architecture)
   Powers chunked Bitesize-style steps, Seneca-style inline micro-checks,
   course/extension filtering, self-marked end-of-topic tests, and Lesson.comps. */
(function(){
if (!window.__cbsAuthGate) { const ag = document.createElement('script'); ag.src = '/js/auth-gate.js'; (document.head || document.documentElement).appendChild(ag); }
const L = window.Lesson = window.Lesson || {};
L.comps = L.comps || {};
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const body = document.body;
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- component loader (compatible with chem.js, bio.js, diagq.js) ---------- */
L.initComps = function(root){
  $$('[data-comp]', root).forEach(el => {
    if(el._inited) return;
    const f = L.comps[el.dataset.comp];
    if(f){
      el._inited = true;
      try{ f(el); }catch(e){ console.error(e); el.textContent = 'Component error: ' + e.message; }
    }
  });
};

/* ---------- diagram questions (diagq.js) ---------- */
L.comps.dq = el => {
  if(typeof DQ === 'undefined' || !DQ.ok()){ el.remove(); return; }
  const id = el.dataset.id;
  const shuf = (o, seed) => {
    const a = o.map((t,i) => [t,i]);
    let s = seed >>> 0;
    for(let i = a.length - 1; i > 0; i--){
      s = (s * 1103515245 + 12345) >>> 0;
      const j = s % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const draw = seed => {
    const d = DQ.make(id, seed);
    if(!d){ el.textContent = ''; return; }
    let opts = shuf(d.o, d.seed);
    const ord = DQ.order(opts, x => x[0]);
    opts = ord.opts;
    const keys = ord.letters ? '1234' : 'ABCD';
    const pt = id.split('-')[0];
    el.innerHTML = `<div class="dq-fig">${d.svg}</div>
      <div class="dq-q">${d.q}</div>
      <div class="dq-o">${opts.map(([t,i],k) => `<button type="button" data-i="${i}">${ord.letters ? '' : `<b>${keys[k]}</b> `}${t}</button>`).join('')}</div>
      <div class="dq-x"></div>
      <div class="dq-bar"><button type="button" class="dq-new">↻ Another example</button><a href="/interactive/spec-quiz/practice.html?point=${pt}">📝 Practise ${pt} →</a></div>`;
    $$('.dq-o button', el).forEach(b => b.onclick = () => {
      if(el.classList.contains('done')) return;
      el.classList.add('done');
      $$('.dq-o button', el).forEach(x => x.classList.add(x.dataset.i === '0' ? 'ok' : (x === b ? 'no' : 'dim')));
      $('.dq-x', el).innerHTML = (b.dataset.i === '0' ? '<b style="color:var(--green)">✓ Correct.</b> ' : '<b style="color:var(--acc2)">✗ Not quite.</b> ') + (d.x || '');
      el.dispatchEvent(new CustomEvent('micro-answered', {bubbles:true}));
    });
    $('.dq-new', el).onclick = () => { el.classList.remove('done'); draw(); };
  };
  draw(el.dataset.seed ? +el.dataset.seed : undefined);
};

/* ---------- progress persistence ---------- */
const topicKey = 'cbs.study.' + (body.dataset.topic || location.pathname);
function loadState(){
  try{ return JSON.parse(localStorage.getItem(topicKey) || '{}'); }catch(e){ return {}; }
}
function saveState(st){
  try{ localStorage.setItem(topicKey, JSON.stringify(st)); }catch(e){}
}
const state = loadState();
state.done = state.done || {};

/* ---------- steps & sticky navigation ---------- */
const steps = $$('.wrap > section.step[id]');
let curIdx = 0;

function stepTitle(sec){
  if(sec.dataset.toc) return sec.dataset.toc;
  const h = $('h2', sec);
  return h ? h.childNodes[0].textContent.trim() : sec.id;
}

function buildNav(){
  if(!steps.length) return;

  const nav = document.createElement('nav');
  nav.className = 'study-nav';
  nav.setAttribute('aria-label', 'Lesson steps');
  nav.innerHTML = `<div class="study-nav-in">
    <div class="step-pills" id="stepPills">
      ${steps.map((s,i) => `<button type="button" class="step-pill${s.classList.contains('da-only')?' da-only':''}" data-i="${i}"><span class="sn">${i+1}</span><span>${esc(stepTitle(s))}</span></button>`).join('')}
    </div>
    <button type="button" class="ctrl-btn" id="btnMode" title="Switch between one step at a time and all on one page">All on one page</button>
  </div>
  <div class="prog-track"><div class="prog-fill" id="progFill"></div></div>`;

  const anchor = $('.stripes + .wrap') ? $('.wrap') : ($('.wrap') || document.body.firstChild);
  anchor.parentNode.insertBefore(nav, anchor);

  const visibleStepIdx = (from, dir) => {
    const hideDa = body.classList.contains('hide-da');
    let j = from + dir;
    while(j >= 0 && j < steps.length && hideDa && steps[j].classList.contains('da-only')) j += dir;
    return (j >= 0 && j < steps.length) ? j : -1;
  };

  // Add step kickers + prev/next footers inside each step
  steps.forEach((sec, i) => {
    const k = document.createElement('div');
    k.className = 'step-kicker';
    k.textContent = `Step ${i+1} of ${steps.length}`;
    sec.insertBefore(k, sec.firstChild);

    const prevTitle = i > 0 ? stepTitle(steps[i-1]) : '';
    const nextTitle = i < steps.length - 1 ? stepTitle(steps[i+1]) : '';
    const foot = document.createElement('div');
    foot.className = 'step-foot';
    foot.innerHTML = `
      <button type="button" class="nav-step prev" ${i===0?'disabled':''}>${i===0 ? '← Start' : '← ' + esc(prevTitle)}</button>
      <button type="button" class="nav-step next" ${i===steps.length-1?'disabled':''}>${i===steps.length-1 ? 'End of topic ✓' : 'Next: ' + esc(nextTitle) + ' →'}</button>`;
    $('.prev', foot).onclick = () => { const j = visibleStepIdx(i, -1); if(j >= 0) goTo(j, true); };
    $('.next', foot).onclick = () => { const j = visibleStepIdx(i, 1); if(j >= 0) goTo(j, true); };
    sec.appendChild(foot);
  });

  // Pill click handlers
  $$('.step-pill', nav).forEach(p => p.onclick = () => goTo(+p.dataset.i, true));

  // Mode toggle
  const btnMode = $('#btnMode');
  const setMode = mode => {
    const all = mode === 'all';
    body.classList.toggle('mode-all', all);
    body.classList.toggle('mode-steps', !all);
    btnMode.classList.toggle('on', all);
    btnMode.textContent = all ? 'Step-by-step' : 'All on one page';
    state.mode = mode;
    saveState(state);
    refreshNav();
  };
  btnMode.onclick = () => setMode(body.classList.contains('mode-all') ? 'steps' : 'all');
  setMode(state.mode === 'all' ? 'all' : 'steps');
}

function refreshNav(){
  if(!steps.length) return;
  const all = body.classList.contains('mode-all');
  const doneCount = steps.filter(s => state.done[s.id]).length;
  const pct = all
    ? Math.round((doneCount / steps.length) * 100)
    : Math.round(((curIdx + 1) / steps.length) * 100);
  const pf = $('#progFill'); if(pf) pf.style.width = pct + '%';
  const spec = $('details.specbox');
  if(spec) spec.hidden = !all && curIdx > 0;
  $$('#stepPills .step-pill').forEach((p, i) => {
    const id = steps[i].id;
    const isDone = !!state.done[id];
    const active = i === curIdx && !all;
    p.classList.toggle('active', active);
    p.classList.toggle('done', isDone);
    $('.sn', p).textContent = isDone ? '✓' : (i + 1);
    if(active) p.scrollIntoView({inline:'nearest', block:'nearest'});
  });
}

function goTo(i, scroll){
  if(i < 0 || i >= steps.length) return;
  curIdx = i;
  steps.forEach((s, j) => s.classList.toggle('cur', j === curIdx));
  refreshNav();
  if(history.replaceState) history.replaceState(null, '', '#' + steps[curIdx].id);
  if(scroll){
    if(body.classList.contains('mode-all')){
      steps[curIdx].scrollIntoView({behavior:'smooth', block:'start'});
    } else {
      const nav = $('.study-nav');
      const navH = nav ? nav.offsetHeight : 0;
      const target = curIdx === 0 ? 0 : Math.max(0, steps[curIdx].getBoundingClientRect().top + window.scrollY - navH - 12);
      window.scrollTo(0, target);
    }
  }
}

function markStepDone(sec){
  if(!sec || !sec.id) return;
  state.done[sec.id] = true;
  saveState(state);
  const badge = $('.micro-badge', sec);
  if(badge){ badge.textContent = '✓ Checked'; badge.classList.add('done'); }
  const nx = $('.step-foot .next', sec);
  if(nx && !nx.disabled) nx.classList.add('ready');
  refreshNav();
}

/* ---------- Seneca-style inline micro-checks inside each step ---------- */
function initMicroChecks(){
  $$('.micro-check').forEach(box => {
    const sec = box.closest('section.step');
    const items = $$('.mq, .flip-q, [data-comp="dq"]', box);
    const total = items.length;
    const badge = $('.micro-badge', box);

    const checkDone = () => {
      const answered = items.filter(it => it.dataset.answered === '1' || it.classList.contains('done')).length;
      if(badge){
        if(answered >= total && total > 0){
          badge.textContent = '✓ Checked';
          badge.classList.add('done');
          markStepDone(sec);
        } else {
          badge.textContent = `${answered} / ${total} done`;
        }
      }
    };

    // Multiple-choice micro-questions
    $$('.mq', box).forEach(q => {
      const ans = +q.dataset.a;
      const why = q.dataset.why || '';
      const opts = $$('.mq-opts button', q);
      const fb = $('.mq-fb', q);
      opts.forEach((btn, idx) => {
        btn.type = 'button';
        btn.onclick = () => {
          if(q.dataset.answered === '1') return;
          q.dataset.answered = '1';
          const ok = idx === ans;
          opts.forEach((o, j) => {
            o.disabled = true;
            if(j === ans) o.classList.add('right');
            else if(j === idx) o.classList.add('wrong');
            else o.classList.add('dim');
          });
          if(fb){
            fb.innerHTML = ok
              ? `<b class="ok">✓ Correct.</b> ${why}`
              : `<b class="no">✗ Not quite.</b> ${why}`;
          }
          checkDone();
        };
      });
    });

    // Click-to-reveal self-check prompts
    $$('.flip-q', box).forEach(det => {
      const ansDiv = $('.flip-ans', det);
      if(ansDiv && !$('.flip-rate', det)){
        ansDiv.insertAdjacentHTML('beforeend',
          `<div class="flip-rate"><span>Did you recall that?</span><button type="button" class="got">✓ Got it</button><button type="button" class="rev">Need to review</button></div>`);
        const got = $('.got', det), rev = $('.rev', det);
        got.onclick = () => { got.classList.add('on'); rev.classList.remove('on'); det.dataset.answered = '1'; checkDone(); };
        rev.onclick = () => { rev.classList.add('on'); got.classList.remove('on'); det.dataset.answered = '1'; checkDone(); };
      }
    });

    box.addEventListener('micro-answered', checkDone);
    if(sec && state.done[sec.id] && badge){
      badge.textContent = '✓ Checked';
      badge.classList.add('done');
    } else if(badge && total > 0){
      badge.textContent = `0 / ${total} done`;
    }
  });
}

/* ---------- End-of-topic test (#check from #qsrc) ---------- */
function initEndTest(){
  const src = $('#qsrc'), out = $('#qs');
  if(!src || !out) return;
  const qList = $$('.q', src).map(q => ({
    type: q.dataset.type,
    a: +q.dataset.a,
    m: +q.dataset.m || 1,
    why: q.dataset.why || '',
    q: $('p', q).innerHTML,
    o: $$('ol li', q).map(li => li.innerHTML),
    ms: $$('ul li', q).map(li => li.innerHTML),
    tip: ($('.tip', q) || {}).innerHTML
  }));
  const mcTotal = qList.filter(x => x.type === 'mc').length;
  let got = 0, tried = 0;

  out.insertAdjacentHTML('beforeend',
    `<p class="check-note"><b>Immediate check:</b> this checks what you just read, so it doesn't count towards securing a spec point yet. Come back on another day in <b>Practice</b> or <b>Cakebread Questing</b> to lock it into long-term memory.</p>` +
    `<div class="score-bar"><span>Multiple choice score</span><span class="sc">0 / ${mcTotal}</span></div>`);

  qList.forEach((x, i) => {
    const d = document.createElement('div');
    d.className = 'q';
    d.innerHTML = `<div class="qh"><span>${i+1}. ${x.q}</span><span class="mk">[${x.m} mark${x.m===1?'':'s'}]</span></div>`;
    if(x.type === 'mc'){
      const o = document.createElement('div');
      o.className = 'opts';
      const fb = document.createElement('div');
      fb.className = 'fb';
      x.o.forEach((t, j) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.innerHTML = t;
        b.onclick = () => {
          if(d.dataset.done) return;
          d.dataset.done = 1;
          tried++;
          b.classList.add(j === x.a ? 'right' : 'wrong');
          o.children[x.a].classList.add('right');
          $$('button', o).forEach(btn => btn.disabled = true);
          if(j === x.a){
            got++;
            fb.innerHTML = `<span style="color:var(--green)">✓ Correct.</span> ${x.why}`;
          } else {
            fb.innerHTML = `<span style="color:var(--acc2)">✗ Not quite: the right answer is highlighted.</span> ${x.why}`;
          }
          $('.sc', out).textContent = `${got} / ${mcTotal} (${tried} tried)`;
          if(tried === mcTotal){
            const sec = out.closest('section.step');
            if(sec) markStepDone(sec);
          }
        };
        o.appendChild(b);
      });
      d.append(o, fb);
    } else {
      d.insertAdjacentHTML('beforeend',
        `<textarea placeholder="Write your answer first, then open the mark scheme and tick off each point you got..."></textarea>
         <details><summary>Show mark scheme (${x.m} marks)</summary>
           <div class="msb">
             ${x.ms.map(m => `<label class="ms-item"><input type="checkbox"><span>${m}</span></label>`).join('')}
             <div class="ms-tally">Self-score: 0 / ${x.m}</div>
             ${x.tip ? `<p style="margin-top:6px">${x.tip}</p>` : ''}
           </div>
         </details>`);
      const cbs = $$('.ms-item input', d), tally = $('.ms-tally', d);
      cbs.forEach(cb => cb.onchange = () => {
        const n = cbs.filter(c => c.checked).length;
        tally.textContent = `Self-score: ${n} / ${x.m}`;
      });
    }
    out.appendChild(d);
  });
}

/* ---------- Single Award auto-filter (/js/course.js) ---------- */
function applyCourse(){
  let sa = false;
  if(window.CBSCourse) sa = !!CBSCourse.sa;
  else {
    try{
      const c = JSON.parse(localStorage.getItem('cbs.course') || 'null');
      const u = JSON.parse(localStorage.getItem('cbs.questing.uid') || 'null');
      sa = !!(c && c.c === 'SA' && c.u && c.u === u);
    }catch(e){}
  }
  body.classList.toggle('hide-da', sa);
  // Keep Prev/Next button labels in sync when DA-only steps are hidden for Single Award
  const vis = steps.map((s, i) => ({ s, i })).filter(x => !(sa && x.s.classList.contains('da-only')));
  vis.forEach((x, pos) => {
    const k = $('.step-kicker', x.s), prev = $('.step-foot .prev', x.s), next = $('.step-foot .next', x.s);
    if(k) k.textContent = `Step ${pos+1} of ${vis.length}`;
    if(prev){ prev.disabled = pos === 0; prev.textContent = pos === 0 ? '← Start' : '← ' + stepTitle(vis[pos-1].s); }
    if(next){ next.disabled = pos === vis.length - 1; next.textContent = pos === vis.length - 1 ? 'End of topic ✓' : 'Next: ' + stepTitle(vis[pos+1].s) + ' →'; }
    const pillSn = $(`.step-pill[data-i="${x.i}"] .sn`);
    if(pillSn) pillSn.textContent = String(pos + 1);
  });
  $$('.kw-box').forEach(box => { box.hidden = sa && $$('.kw-row:not(.da-only)', box).length === 0; });
  if(sa && window.CBSCourse && CBSCourse.SA){
    const sub = (body.className.match(/subj-(\w+)/) || [])[1];
    const letter = {biology:'B', chemistry:'C', physics:'P'}[sub];
    if(letter){
      $$('details.specbox ol li').forEach(li => {
        const b = $('b', li), num = b && b.textContent.trim();
        if(!num || !/^\d+\.\d+$/.test(num)) return;
        const key = letter + num;
        if(!CBSCourse.SA.has(key)) li.style.display = 'none';
        else if(CBSCourse.SA_TEXT && CBSCourse.SA_TEXT[key]){
          const sp = $('span', li);
          if(sp) sp.textContent = CBSCourse.SA_TEXT[key].text;
        }
      });
      // Hide DA-only diagram questions and spec-point practise chips on Single Award
      $$('[data-comp="dq"][data-id]').forEach(dq => {
        const pt = dq.dataset.id.split('-')[0];
        if(/^[BCP]\d+\.\d+$/.test(pt) && !CBSCourse.SA.has(pt)) dq.style.display = 'none';
      });
      $$('.practise a[href*="point="]').forEach(a => {
        const m = (a.getAttribute('href') || '').match(/point=([BCP]\d+\.\d+)/);
        if(m && !CBSCourse.SA.has(m[1])) a.style.display = 'none';
      });
    }
  }
}
function initCourse(){
  applyCourse();
  if(window.CBSCourse) return;
  const s = document.createElement('script');
  s.src = '/js/course.js';
  s.onload = () => { applyCourse(); enrichSiteResources(); };
  (document.head || document.documentElement).appendChild(s);
}

/* ---------- clickable .spec chips → Spec Tracker (/specifications/<subject>.html#B2.15) ---------- */
function initSpecLinks(){
  const sub = (body.className.match(/subj-(\w+)/) || [])[1];
  const letter = {biology:'B', chemistry:'C', physics:'P'}[sub];
  if(!sub || !letter) return;
  $$('.wrap .spec').forEach(sp => {
    if($('a', sp)) return;
    const num = sp.textContent.trim();
    if(!/^\d+\.\d+$/.test(num)) return;
    const code = letter + num;
    sp.innerHTML = `<a href="/specifications/${sub}.html#${code}" title="Open ${code} in the ${sub[0].toUpperCase()+sub.slice(1)} Spec Tracker">${num}</a>`;
  });
}

/* ---------- auto Examiner Key Words per step (/js/key-words.js) ---------- */
function renderKeyWords(){
  if(!window.KEYWORDS) return;
  const sub = (body.className.match(/subj-(\w+)/) || [])[1];
  const letter = {biology:'B', chemistry:'C', physics:'P'}[sub];
  if(!letter) return;
  steps.forEach(sec => {
    if(sec.id === 'check' || $('.kw-box', sec)) return;
    const pts = [...new Set($$('.spec', sec).map(e => e.textContent.trim()).filter(t => /^\d+\.\d+$/.test(t)))];
    if(!pts.length) return;
    const seen = new Set(), rows = [];
    pts.forEach(p => {
      const list = window.KEYWORDS[letter + p];
      if(!Array.isArray(list)) return;
      list.forEach(item => {
        const w = String(item[0] || '').trim(), m = String(item[1] || '').trim(), da = item[2] === 'DA';
        if(!w || seen.has(w.toLowerCase())) return;
        seen.add(w.toLowerCase());
        rows.push({ w, m, da });
      });
    });
    if(!rows.length) return;
    const visibleCount = body.classList.contains('hide-da') ? rows.filter(r => !r.da).length : rows.length;
    if(!visibleCount) return;
    const firstKey = letter + pts[0];
    const box = document.createElement('details');
    box.className = 'kw-box';
    box.open = true;
    box.innerHTML = `<summary><span class="callout-tag">Examiner key words</span><small>Exact wording that earns marks in exam answers</small></summary>` +
      `<dl class="kw-list">${rows.map(r => `<div class="kw-row${r.da ? ' da-only' : ''}"><dt>${esc(r.w)}</dt><dd>${esc(r.m)}</dd></div>`).join('')}</dl>` +
      `<div class="kw-foot"><a href="/Flashcards/?deck=keywords&spec=${encodeURIComponent(firstKey)}">🃏 Drill key words in Flashcards →</a><a href="/typing-game/">⌨️ Type Fast or Perish →</a></div>`;
    const anchor = $('.micro-check', sec) || $('.step-foot', sec);
    if(anchor) sec.insertBefore(box, anchor); else sec.appendChild(box);
  });
}
function initKeyWords(){
  if(window.KEYWORDS){ renderKeyWords(); return; }
  const s = document.createElement('script');
  s.src = '/js/key-words.js';
  s.onload = renderKeyWords;
  (document.head || document.documentElement).appendChild(s);
}

/* ---------- auto site-wide resource hub enrichment (/js/spec-index.js) ---------- */
function enrichSiteResources(){
  const hub = $('.next-hub .next-links');
  const idx = typeof SPEC_INDEX !== 'undefined' ? SPEC_INDEX : window.SPEC_INDEX;
  if(!hub || !idx || !idx.pts || !idx.res) return;
  const sub = (body.className.match(/subj-(\w+)/) || [])[1];
  const letter = {biology:'B', chemistry:'C', physics:'P'}[sub];
  if(!sub || !letter) return;
  const sa = body.classList.contains('hide-da') && window.CBSCourse && CBSCourse.SA;
  const pts = [...new Set($$('.wrap .spec').map(e => e.textContent.trim()).filter(t => /^\d+\.\d+$/.test(t)))].map(p => letter + p).filter(k => !sa || CBSCourse.SA.has(k));
  if(!pts.length) return;

  $$('a[data-auto-res="1"]', hub).forEach(a => a.remove());
  const existing = new Set($$('a', hub).map(a => a.getAttribute('href') || ''));
  const addLink = (href, label, cls) => {
    if(!href || existing.has(href)) return;
    existing.add(href);
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    a.dataset.autoRes = '1';
    if(cls) a.className = cls;
    hub.appendChild(a);
  };

  // Collect matching sub-topics & indexed resources (games, booklets, 6-markers, equations)
  const subs = [...new Set(pts.map(k => (idx.pts[k] || {}).s).filter(Boolean))];
  const seenRes = new Set();
  const games = [], booklets = [], longs = [], eqs = [];
  pts.forEach(k => {
    const row = idx.pts[k];
    if(!row || !row.r) return;
    row.r.forEach(rid => {
      if(seenRes.has(rid)) return;
      seenRes.add(rid);
      const r = idx.res[rid];
      if(!r) return;
      if(r[0] === 'game') games.push(r);
      else if(r[0] === 'booklet') booklets.push(r);
      else if(r[0] === 'long') longs.push(r);
      else if(r[0] === 'eq') eqs.push(r);
    });
  });

  // Add Examiner Key Words flashcards & Type Fast or Perish (Layer 2)
  if(subs.length){
    const q = subs.length === 1 ? `sub=${subs[0]}` : `subs=${subs.join(',')}`;
    addLink(`/Flashcards/?deck=keywords&${q}`, `🗝️ Examiner Key Words (${subs.join(', ')}) →`);
  }
  addLink('/typing-game/', '⌨️ Type Fast or Perish →');

  // Add matching Topic Games (Layer 5)
  games.forEach(r => addLink(r[2], `🎮 ${r[1]} →`));
  // Add matching Topic Booklets & 6-Markers & Equations (Layer 4)
  booklets.forEach(r => addLink(r[2], `📚 ${r[1]}`));
  longs.forEach(r => addLink(r[2], `✍️ ${r[1]}`));
  if(eqs.length) addLink('/interactive/physics-equations/', '📐 Physics Equations →');
  // Link straight to this topic on the Spec Tracker (Layer 5)
  addLink(`/specifications/${sub}.html#${pts[0]}`, `📋 ${sub[0].toUpperCase()+sub.slice(1)} Spec Tracker →`);
}
function initSiteResources(){
  if(typeof SPEC_INDEX !== 'undefined' || window.SPEC_INDEX){ enrichSiteResources(); return; }
  const s = document.createElement('script');
  s.src = '/js/spec-index.js';
  s.onload = enrichSiteResources;
  (document.head || document.documentElement).appendChild(s);
}

/* ---------- auto "Practise by spec point" chips ---------- */
function initPractiseLinks(){
  const chk = $('#check');
  if(!chk || $('.practise', chk)) return;
  const sub = (body.className.match(/subj-(\w+)/) || [])[1];
  const letter = {biology:'B', chemistry:'C', physics:'P'}[sub];
  if(!letter) return;
  const pts = [...new Set($$('.wrap .spec').map(e => e.textContent.trim()).filter(t => /^\d+\.\d+$/.test(t)))];
  if(!pts.length) return;
  chk.insertAdjacentHTML('beforeend',
    `<div class="practise"><h3>Practise by spec point</h3><div>${pts.map(p => `<a href="/interactive/spec-quiz/practice.html?point=${letter}${p}">📝 ${letter}${p}</a>`).join('')}</div></div>`);
}

/* ---------- boot ---------- */
initSpecLinks();
buildNav();
initCourse();
initMicroChecks();
initEndTest();
initPractiseLinks();
initKeyWords();
initSiteResources();
L.initComps(document);

// Respect initial URL hash (e.g. #dot, #tests, #check)
const h = location.hash.replace(/^#/, '');
const hIdx = h ? steps.findIndex(s => s.id === h) : -1;
goTo(hIdx >= 0 ? hIdx : 0, false);

window.addEventListener('hashchange', () => {
  const nh = location.hash.replace(/^#/, '');
  const idx = steps.findIndex(s => s.id === nh);
  if(idx >= 0 && idx !== curIdx) goTo(idx, true);
});
})();
