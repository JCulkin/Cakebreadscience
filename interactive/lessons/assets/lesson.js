/* Cakebread Science lessons engine
   - builds TOC, status badge, questions, projector deck (from #deck-src), review mode (drafts)
   - components: elements with data-comp="name" are initialised by functions registered in Lesson.comps
*/
(function(){
const L = window.Lesson = window.Lesson || {};
L.comps = L.comps || {};
const $ = (s, r=document) => r.querySelector(s), $$ = (s, r=document) => [...r.querySelectorAll(s)];
const body = document.body;
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmtDate = d => { if(!d) return ''; const [y,m,dd]=d.split('-'); return `${+dd} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m-1]} ${y}`; };
L.initComps = function(root){ $$('[data-comp]', root).forEach(el => { if(el._inited) return; const f = L.comps[el.dataset.comp]; if(f){ el._inited = true; try{ f(el); }catch(e){ console.error(e); el.textContent = 'Component error: '+e.message; } } }); };

/* ---------- header extras ---------- */
function header(){
  const st = body.dataset.status || 'draft', upd = body.dataset.updated, ver = body.dataset.version;
  const nav = $('.lhead .navrow');
  if(nav){
    const badge = st === 'checked' ? `<span class="status checked">Checked · ${fmtDate(ver)}</span>` : `<span class="status draft">Draft · updated ${fmtDate(upd)}</span>`;
    nav.insertAdjacentHTML('beforeend', badge + `<button class="pbtn2" id="hdrPresent">▶ Present on projector</button>`);
  }
  const toc = $('.lhead .toc');
  if(toc && !toc.children.length){
    $$('.wrap > section[id]').forEach(s => { const h = $('h2', s); if(!h) return;
      const t = s.dataset.toc || h.childNodes[0].textContent.trim();
      toc.insertAdjacentHTML('beforeend', `<a href="#${s.id}">${esc(t)}</a>`); });
  }
}

/* ---------- questions ---------- */
let qList = [];
function questions(){
  const src = $('#qsrc'), out = $('#qs'); if(!src || !out) return;
  qList = $$('.q', src).map(q => ({ type:q.dataset.type, a:+q.dataset.a, m:+q.dataset.m||1, deck:q.dataset.deck!=='0',
    q:$('p', q).innerHTML, o:$$('ol li', q).map(li=>li.innerHTML), ms:$$('ul li', q).map(li=>li.innerHTML), tip:($('.tip', q)||{}).innerHTML }));
  let got=0, tried=0;
  out.insertAdjacentHTML('beforeend', `<div class="score"><span>Multiple choice score</span><span class="sc">0 / 0</span></div>`);
  qList.forEach((x,i) => {
    const d = document.createElement('div'); d.className = 'q';
    d.innerHTML = `<div class="qh"><span>${i+1}. ${x.q}</span><span class="mk">[${x.m}]</span></div>`;
    if(x.type === 'mc'){
      const o = document.createElement('div'); o.className='opts'; const fb = document.createElement('div'); fb.className='fb';
      x.o.forEach((t,j) => { const b = document.createElement('button'); b.innerHTML = t; b.onclick = () => {
        if(body.classList.contains('review') || d.dataset.done) return; d.dataset.done = 1; tried++;
        b.classList.add(j===x.a?'right':'wrong'); o.children[x.a].classList.add('right');
        if(j===x.a){ got++; fb.textContent='Correct.'; fb.style.color='var(--green)'; } else { fb.textContent='Not quite: the correct answer is highlighted.'; fb.style.color='var(--acc2)'; }
        $('.sc', out).textContent = got+' / '+tried; }; o.appendChild(b); });
      d.append(o, fb);
    } else {
      d.insertAdjacentHTML('beforeend', `<textarea placeholder="Write your answer, then check the mark scheme"></textarea><details><summary>Show mark scheme</summary><div class="msb"><ul>${x.ms.map(m=>'<li>'+m+'</li>').join('')}</ul>${x.tip?'<p style="margin-top:6px">'+x.tip+'</p>':''}</div></details>`);
    }
    out.appendChild(d);
  });
}

/* ---------- projector deck ---------- */
let deckApi = null;
function deck(){
  const src = $('#deck-src'); if(!src) return;
  const L4 = 'ABCD';
  // expand auto slides
  $$('section[data-auto]', src).forEach(sec => {
    const kind = sec.dataset.auto; let html = '';
    if(kind === 'quiz') qList.filter(q=>q.type==='mc' && q.deck).forEach((q,i) => {
      html += `<section class="ps"><h2>Quiz ${i+1}</h2><div class="big" style="font-size:58px">${q.q}</div><div class="opts">${q.o.map((o,j)=>`<div class="opt${j===q.a?' correct':''}" ${j===q.a?'data-s="1"':''}><b>${L4[j]}</b><span>${o}</span></div>`).join('')}</div></section>`; });
    if(kind === 'exam') qList.filter(q=>q.type==='long' && q.deck).forEach(q => {
      html += `<section class="ps"><h2>Exam question <span class="em">[${q.m}]</span></h2><div class="big" style="font-size:56px">${q.q}</div><ul class="ms" data-s="1" style="margin-top:40px">${q.ms.map(m=>'<li>'+m+'</li>').join('')}</ul></section>`; });
    sec.outerHTML = html;
  });
  const root = document.createElement('div'); root.id = 'deck';
  root.innerHTML = `<div id="stageWrap"><div id="stage"></div></div>
   <div class="dbar"><button id="dPrev">‹ Back</button><span id="dCount"></span><button id="dNext">Next ›</button><button id="dBlack" title="Blank screen (B)">■ Blank</button><button id="dFull" title="F">⛶ Full screen</button><button class="rvonly" id="dNote" title="N">✎ Note this slide</button><button class="rvonly" id="dNotes">Notes list</button><button id="dExit" title="Esc">✕ Exit</button></div>
   <div id="black"></div>`;
  document.body.appendChild(root);
  const stage = $('#stage');
  const slides = $$('section.ps', src);
  stage.innerHTML = slides.map((s,i) => `<section class="ps ${s.className.replace('ps','')}" ${s.getAttribute('style')?`style="${s.getAttribute('style')}"`:''} data-rid="slide ${i+1}"><div class="sbar"></div>${s.innerHTML}<div class="num">${i+1} / ${slides.length}</div></section>`).join('');
  src.remove();
  L.initComps(stage);
  const ps = $$('.ps', stage);
  ps.forEach(p => { p.max = Math.max(0, ...$$('[data-s],[data-hide-until],[data-hide-from]', p).map(e => +(e.dataset.s||e.dataset.hideUntil||e.dataset.hideFrom)));
    p.shown = 0; if(p.max) p.insertAdjacentHTML('beforeend','<div class="hint">click / → to reveal</div>'); });
  function apply(p){
    $$('[data-s]', p).forEach(e => e.classList.toggle('on', +e.dataset.s <= p.shown));
    $$('[data-hide-until]', p).forEach(e => e.classList.toggle('hidden-e', p.shown < +e.dataset.hideUntil));
    $$('[data-hide-from]', p).forEach(e => e.classList.toggle('gone', p.shown >= +e.dataset.hideFrom));
    const h = $('.hint', p); if(h) h.style.display = p.shown >= p.max ? 'none' : '';
    p.dispatchEvent(new CustomEvent('step', {detail:p.shown}));
  }
  let cur = 0;
  function show(i){ cur = Math.max(0, Math.min(ps.length-1, i)); ps.forEach((p,j) => p.classList.toggle('cur', j===cur)); apply(ps[cur]); $('#dCount').textContent = (cur+1)+' / '+ps.length; ps[cur].dispatchEvent(new CustomEvent('shown')); }
  function next(){ const p = ps[cur]; if(p.shown < p.max){ p.shown++; apply(p); } else show(cur+1); }
  function prev(){ const p = ps[cur]; if(p.shown > 0){ p.shown--; apply(p); } else show(cur-1); }
  function fit(){ const s = Math.min(innerWidth/1600, innerHeight/900), sw = $('#stageWrap'); sw.style.width = 1600*s+'px'; sw.style.height = 900*s+'px'; stage.style.transform = `scale(${s})`; }
  const isP = () => body.classList.contains('pm');
  function enter(){ body.classList.add('pm'); fit(); show(cur); }
  function exit(){ body.classList.remove('pm','rvopen'); $('#black').classList.remove('on'); if(document.fullscreenElement) document.exitFullscreen(); }
  const full = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(()=>{});
  const pb = document.createElement('button'); pb.className='pbtn'; pb.textContent='▶ Present'; pb.title='Projector mode'; pb.onclick=enter; document.body.appendChild(pb);
  const hb = $('#hdrPresent'); if(hb) hb.onclick = enter;
  $('#dNext').onclick = next; $('#dPrev').onclick = prev; $('#dExit').onclick = exit; $('#dFull').onclick = full;
  const blk = $('#black'); $('#dBlack').onclick = () => blk.classList.toggle('on'); blk.onclick = () => blk.classList.remove('on');
  $('#dNote').onclick = e => { e.stopPropagation(); L.noteFor && L.noteFor(ps[cur], innerWidth/2-180, 80); };
  $('#dNotes').onclick = e => { e.stopPropagation(); body.classList.toggle('rvopen'); };
  stage.addEventListener('click', e => {
    if(body.classList.contains('review')) return;           // review handles clicks
    if(e.target.closest('button,input,select,a,canvas,.nonav')) return;
    const r = stage.getBoundingClientRect(); (e.clientX < r.left + r.width/4) ? prev() : next();
  });
  addEventListener('keydown', e => {
    if(!isP() || e.target.closest('textarea,input')) return;
    if(['ArrowRight','ArrowDown',' ','PageDown','Enter'].includes(e.key)){ e.preventDefault(); next(); }
    else if(['ArrowLeft','ArrowUp','PageUp','Backspace'].includes(e.key)){ e.preventDefault(); prev(); }
    else if(e.key==='Escape') exit();
    else if(e.key==='f'||e.key==='F') full();
    else if(e.key==='b'||e.key==='B'||e.key==='.') blk.classList.toggle('on');
    else if((e.key==='n'||e.key==='N') && body.classList.contains('review')) $('#dNote').click();
    else if(e.key==='Home') show(0); else if(e.key==='End') show(ps.length-1);
  });
  let tx=null; addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, {passive:true});
  addEventListener('touchend', e => { if(!isP()||tx===null) return; const d = e.changedTouches[0].clientX - tx; if(Math.abs(d)>50){ d<0?next():prev(); } tx=null; });
  let mt; addEventListener('mousemove', () => { body.classList.add('mouse'); clearTimeout(mt); mt = setTimeout(()=>body.classList.remove('mouse'), 1500); });
  addEventListener('resize', () => { if(isP()) fit(); });
  deckApi = L.deck = { show, next, prev, enter, exit, count: ps.length, get cur(){ return cur; } };
  if(location.hash === '#present') enter();
}

/* ---------- review mode (drafts only) ---------- */
function review(){
  if((body.dataset.status||'draft') !== 'draft') return;
  const key = 'rv:' + location.pathname;
  let notes = []; try { notes = JSON.parse(localStorage.getItem(key)) || []; } catch(e){}
  let general = ''; try { general = localStorage.getItem(key+':g') || ''; } catch(e){}
  const save = () => { try { localStorage.setItem(key, JSON.stringify(notes)); localStorage.setItem(key+':g', general); } catch(e){} };
  // assign review ids to page blocks
  $$('.wrap > section[id]').forEach(sec => {
    const h2 = $('h2', sec), title = (h2 ? h2.childNodes[0].textContent : sec.id).trim(); let n = 0;
    const blocks = [];
    [...sec.children].forEach(c => { if(c.matches('.grid2,.grid3')) blocks.push(...c.children); else if(c.id !== 'qs') blocks.push(c); });
    blocks.forEach(b => { n++; b.dataset.rid = `${title.trim()} › block ${n}`; });
  });
  $$('#qs .q').forEach((q,i) => q.dataset.rid = `Check yourself › Q${i+1}`);
  const label = el => {
    if(el.classList.contains('ps')){ const h = $('h1,h2', el); return `Projector ${el.dataset.rid}${h?': "'+h.textContent.trim().slice(0,60)+'"':''}`; }
    return el.dataset.rid;
  };
  const snip = el => (el.classList.contains('ps') ? '' : (el.innerText||'').replace(/\s+/g,' ').trim().slice(0,90));
  // UI
  const rb = document.createElement('button'); rb.className='rvbtn'; rb.textContent='✎ Review'; document.body.appendChild(rb);
  const panel = document.createElement('div'); panel.id='rvPanel';
  panel.innerHTML = `<header><b>Review notes</b><button class="btn" id="rvClose" style="padding:2px 10px">Done</button></header>
   <div class="rvhelp">Click any block on the page to add a note. In projector mode use <b>✎ Note this slide</b> (or N). Notes are saved in this browser. When finished, <b>Copy all notes</b> and paste them into a chat with Claude.</div>
   <div id="rvList"></div>
   <div class="rvfoot"><label style="font-weight:700">General comments<textarea id="rvGen" placeholder="Overall thoughts, missing content, tone…"></textarea></label>
   <button class="main" id="rvCopy">Copy all notes</button><button id="rvClear">Clear all notes</button></div>`;
  document.body.appendChild(panel);
  const pop = document.createElement('div'); pop.id='rvPop';
  pop.innerHTML = `<div class="w"></div><textarea placeholder="What should change here?"></textarea><div class="a"><button class="del">Delete</button><button class="cancel">Cancel</button><button class="main ok">Save note</button></div>`;
  document.body.appendChild(pop);
  const gen = $('#rvGen'); gen.value = general; gen.oninput = () => { general = gen.value; save(); };
  let editing = null;
  function openPop(el, x, y, existing){
    editing = { el, existing };
    $('.w', pop).textContent = label(el) + (snip(el) ? ' — "' + snip(el) + '…"' : '');
    $('textarea', pop).value = existing ? existing.text : '';
    $('.del', pop).style.display = existing ? '' : 'none';
    pop.style.display = 'block';
    pop.style.left = Math.max(8, Math.min(innerWidth - pop.offsetWidth - 8, x)) + 'px';
    pop.style.top = Math.max(8, Math.min(innerHeight - pop.offsetHeight - 8, y)) + 'px';
    $('textarea', pop).focus();
  }
  L.noteFor = (el, x, y) => openPop(el, x, y, notes.find(n => n.rid === el.dataset.rid));
  $('.cancel', pop).onclick = () => { pop.style.display='none'; };
  $('.ok', pop).onclick = () => {
    const t = $('textarea', pop).value.trim(), el = editing.el;
    if(editing.existing){ if(t) editing.existing.text = t; else notes = notes.filter(n => n !== editing.existing); }
    else if(t) notes.push({ rid: el.dataset.rid, label: label(el), snip: snip(el), text: t, ts: Date.now() });
    save(); pop.style.display='none'; render();
  };
  $('.del', pop).onclick = () => { notes = notes.filter(n => n !== editing.existing); save(); pop.style.display='none'; render(); };
  document.addEventListener('click', e => {
    if(!body.classList.contains('review')) return;
    if(e.target.closest('#rvPanel,#rvPop,.rvbtn,.pbtn,.dbar,.lhead')) return;
    const el = e.target.closest('[data-rid]'); if(!el) return;
    if(body.classList.contains('pm') && el.classList.contains('ps') && e.target.closest('button')) return; // let slide buttons work
    e.preventDefault(); e.stopPropagation();
    L.noteFor(el, e.clientX + 10, e.clientY + 10);
  }, true);
  function render(){
    $$('.rvpin').forEach(p => p.remove()); $$('[data-rid].has-note').forEach(e => e.classList.remove('has-note'));
    const list = $('#rvList');
    list.innerHTML = notes.length ? '' : '<p style="color:#777;padding:6px 0">No notes yet.</p>';
    notes.forEach((n,i) => {
      const el = $(`[data-rid="${CSS.escape(n.rid)}"]`);
      if(el){ el.classList.add('has-note');
        if(!el.classList.contains('ps') && body.classList.contains('review')){ const r = el.getBoundingClientRect(); const p = document.createElement('div'); p.className='rvpin'; p.textContent = i+1; p.style.left = (r.right + scrollX - 14) + 'px'; p.style.top = (r.top + scrollY - 12) + 'px'; document.body.appendChild(p); } }
      const d = document.createElement('div'); d.className='n';
      d.innerHTML = `<div class="w"><b>${i+1}.</b> ${esc(n.label)}</div><div class="t">${esc(n.text)}</div><div class="a"><button class="go">Show</button><button class="ed">Edit</button></div>`;
      $('.go', d).onclick = () => { if(!el) return; if(el.classList.contains('ps')){ if(!body.classList.contains('pm')) deckApi.enter(); deckApi.show(+n.rid.split(' ')[1]-1); } else { if(body.classList.contains('pm')) deckApi.exit(); el.scrollIntoView({behavior:'smooth', block:'center'}); } };
      $('.ed', d).onclick = () => { if(el) openPop(el, innerWidth/2-180, 120, n); };
      list.appendChild(d);
    });
    rb.textContent = '✎ Review' + (notes.length ? ` (${notes.length})` : '');
  }
  function exportText(){
    const lines = [`REVIEW NOTES: ${document.title.split(' · Cakebread')[0]}`, `Page: ${location.pathname}  (draft updated ${body.dataset.updated||'?'})`, `Exported: ${new Date().toLocaleString('en-GB')}`, ''];
    if(general.trim()) lines.push('General:', general.trim(), '');
    notes.forEach((n,i) => { lines.push(`${i+1}. [${n.label}]${n.snip ? ' "' + n.snip + '…"' : ''}`); lines.push('   → ' + n.text.replace(/\n/g, '\n     ')); });
    return lines.join('\n');
  }
  $('#rvCopy').onclick = async () => {
    const t = exportText(), b = $('#rvCopy');
    try { await navigator.clipboard.writeText(t); }
    catch(e){ const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
    b.textContent = 'Copied ✓ Paste into your chat with Claude'; setTimeout(() => b.textContent = 'Copy all notes', 2500);
  };
  let armed = false;
  $('#rvClear').onclick = () => { const b = $('#rvClear'); if(!armed){ armed = true; b.textContent = 'Click again to delete all notes'; setTimeout(()=>{ armed=false; b.textContent='Clear all notes'; }, 3000); return; }
    notes = []; general = ''; gen.value=''; save(); render(); armed=false; b.textContent='Clear all notes'; };
  const toggle = on => { body.classList.toggle('review', on); render(); };
  rb.onclick = () => toggle(!body.classList.contains('review'));
  $('#rvClose').onclick = () => { if(body.classList.contains('pm')) body.classList.remove('rvopen'); else toggle(false); };
  addEventListener('resize', () => body.classList.contains('review') && render());
  L.review = { exportText, get notes(){ return notes; }, toggle };
  render();
  if(new URLSearchParams(location.search).has('review')) toggle(true);
}

/* ---------- checked versions: point to a newer one if it exists ---------- */
function newer(){
  if(body.dataset.status !== 'checked' || !body.dataset.topic) return;
  fetch('/interactive/lessons/lessons.json', {cache:'no-store'}).then(r => r.json()).then(m => {
    const [sid, code] = body.dataset.topic.split('/'); let t;
    m.subjects.forEach(s => s.id===sid && s.sections.forEach(sec => sec.topics.forEach(x => { if(x.code===code) t = x; })));
    const v = t && (t.versions||[]).slice().sort().pop();
    if(v && v > body.dataset.version){ const nav = $('.lhead .navrow'); if(nav) nav.insertAdjacentHTML('beforeend', `<a href="../v${v}/" style="background:#fff3b8;color:#111;padding:3px 8px;text-decoration:none;font-weight:700">A newer version (${fmtDate(v)}) is available →</a>`); }
  }).catch(()=>{});
}

function init(){ header(); newer(); L.initComps(document.querySelector('.wrap') || document); questions(); deck(); review(); }
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
