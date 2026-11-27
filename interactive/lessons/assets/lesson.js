/* Cakebread Science lessons engine
   - builds TOC, status badge, questions, projector deck (from #deck-src)
   - components: elements with data-comp="name" are initialised by functions registered in Lesson.comps
*/
(function(){
if (!window.__cbsAuthGate) { const ag = document.createElement('script'); ag.src = '/js/auth-gate.js'; (document.head || document.documentElement).appendChild(ag); }
const L = window.Lesson = window.Lesson || {};
L.comps = L.comps || {};
const $ = (s, r=document) => r.querySelector(s), $$ = (s, r=document) => [...r.querySelectorAll(s)];
const body = document.body;
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmtDate = d => { if(!d) return ''; const [y,m,dd]=d.split('-'); return `${+dd} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m-1]} ${y}`; };
L.initComps = function(root){ $$('[data-comp]', root).forEach(el => { if(el._inited) return; if(root === document && el.closest('#deck-src')) return; const f = L.comps[el.dataset.comp]; if(f){ el._inited = true; try{ f(el); }catch(e){ console.error(e); el.textContent = 'Component error: '+e.message; } } }); };

/* ---------- rolodex: a stack of examples per column; click the card, ▲▼ or scroll to flip (22 Nov) ---------- */
L.comps.rolodex = el => {
  const cols = $$('.rcol', el), sync = el.dataset.sync === '1';
  const ctl = cols.map(col => {
    const items = $$('.ritem', col), card = $('.rcard', col), cap = $('.rcap', col), cnt = $('.rc', col), crd = $('.rcr', col);
    let i = 0, busy = 0;
    const paint = () => { items.forEach((x,j) => x.classList.toggle('on', j===i)); cap.innerHTML = items[i].dataset.cap || ''; if(crd) crd.innerHTML = items[i].dataset.cr || ''; cnt.textContent = (i+1)+' / '+items.length; };
    const go = d => { if(busy) return; busy = 1; card.classList.remove('fu','fd'); void card.offsetWidth; card.classList.add(d>0?'fd':'fu');
      setTimeout(() => { i = (i + d + items.length) % items.length; paint(); }, 150); setTimeout(() => busy = 0, 320); };
    paint();
    return {col, card, go};
  });
  const trigger = (c, d) => { if(sync) ctl.forEach(x => x.go(d)); else c.go(d); };
  ctl.forEach(c => {
    const stop = (e, d) => { e.preventDefault(); e.stopPropagation(); trigger(c, d); };
    $('.rn', c.col).onclick = e => stop(e, 1); $('.rp', c.col).onclick = e => stop(e, -1); c.card.onclick = e => stop(e, 1);
    c.card.addEventListener('wheel', e => { if(Math.abs(e.deltaY) < 3) return; stop(e, e.deltaY > 0 ? 1 : -1); }, {passive:false});
  });
};

/* ---------- diagram questions from the question bank (diagq.js ids, fixed seed on slides, "another example" on the page) ---------- */
L.comps.dq = el => {
  if(typeof DQ === 'undefined' || !DQ.ok()) { el.remove(); return; }
  const id = el.dataset.id, onSlide = !!el.closest('#stage, #deck-src');
  const shuf = (o, seed) => { const a = o.map((t,i) => [t,i]); let s = seed >>> 0; for(let i = a.length-1; i > 0; i--){ s = (s * 1103515245 + 12345) >>> 0; const j = s % (i+1); [a[i],a[j]] = [a[j],a[i]]; } return a; };
  const draw = seed => {
    const d = DQ.make(id, seed); if(!d){ el.textContent = ''; return; }
    let opts = shuf(d.o, d.seed); const ord = DQ.order(opts, x => x[0]); opts = ord.opts;
    const keys = ord.letters ? '1234' : 'ABCD', pt = id.split('-')[0];
    if(onSlide){
      el.innerHTML = `<div class="dqs-fig">${d.svg}</div><div class="dqs-side"><div class="dqs-q">${d.q}</div><div class="dqs-o">${opts.map(([t,i],k) =>
        `<div class="${i===0?'ok':''}"${i===0?' data-s="1"':''}>${ord.letters?'':`<b>${keys[k]}</b>`}${t}</div>`).join('')}</div><div class="dqs-x" data-s="1">${d.x||''}</div></div>`;
      return;
    }
    el.innerHTML = `<div class="dq-fig">${d.svg}</div><div class="dq-q">${d.q}</div><div class="dq-o">${opts.map(([t,i],k) => `<button data-i="${i}">${ord.letters?'':`<b>${keys[k]}</b> `}${t}</button>`).join('')}</div>
      <div class="dq-x"></div><div class="dq-bar"><button class="dq-new">↻ Another example</button><a href="/interactive/spec-quiz/practice.html?point=${pt}">📝 Practise ${pt} →</a></div>`;
    $$('.dq-o button', el).forEach(b => b.onclick = () => { if(el.classList.contains('done')) return; el.classList.add('done');
      $$('.dq-o button', el).forEach(x => x.classList.add(x.dataset.i === '0' ? 'ok' : (x === b ? 'no' : 'dim')));
      $('.dq-x', el).innerHTML = (b.dataset.i === '0' ? '<b>✓ Correct.</b> ' : '<b>✗ Not quite.</b> ') + (d.x || ''); });
    $('.dq-new', el).onclick = () => { el.classList.remove('done'); draw(); };
  };
  draw(el.dataset.seed ? +el.dataset.seed : undefined);
};

/* ---------- "practise these points" links, built from the spec chips on the page ---------- */
function practise(){
  const chk = $('#check'); if(!chk || $('.practise', chk)) return;
  const sub = (body.className.match(/subj-(\w+)/)||[])[1], letter = {biology:'B', chemistry:'C', physics:'P'}[sub]; if(!letter) return;
  const pts = [...new Set($$('.wrap .spec').map(e => e.textContent.trim()).filter(t => /^\d+\.\d+$/.test(t)))];
  if(!pts.length) return;
  chk.insertAdjacentHTML('beforeend', `<div class="practise"><h3>Practise these points</h3><div>${pts.map(p => `<a href="/interactive/spec-quiz/practice.html?point=${letter}${p}">📝 ${letter}${p}</a>`).join('')}</div></div>`);
}

/* ---------- header extras ---------- */
function header(){
  const st = body.dataset.status || 'draft', upd = body.dataset.updated, ver = body.dataset.version;
  const nav = $('.lhead .navrow');
  if(nav){
    if(!nav.querySelector('a[href="/"]')) nav.insertAdjacentHTML('afterbegin', `<a href="/" title="Cakebread Science home">🏠 Home</a>`);
    const badge = st === 'checked' ? '' : `<span class="status draft">Under review</span>`;
    const ex = body.dataset.topic ? '&exclude=' + encodeURIComponent(body.dataset.topic.replace(/^[a-z]/i, c => c.toUpperCase()).replace('/', '')) : '';
    nav.insertAdjacentHTML('beforeend', badge + `<a class="pbtn2" style="background:#facc15;color:#111;text-decoration:none;border:2px solid #111" href="/interactive/spec-quiz/quiz.html?warmup=1${ex}" target="_blank" title="5 quick easy recall questions from topics covered before">🔥 Brain Warm-Up</a><button class="pbtn2" id="hdrPresent">▶ Present on projector</button>`);
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
        if(d.dataset.done) return; d.dataset.done = 1; tried++;
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
  // long true/false slides: split into slides of at most 5 statements, big type (user rule: big fonts)
  $$('section.ps', src).forEach(sec => {
    const tf = $('[data-comp="tf"]', sec); if(!tf) return;
    const items = $$('.tfi', tf); if(items.length <= 6) return;
    const n = Math.ceil(items.length / 5), per = Math.ceil(items.length / n), h = $('h2', sec), title = h ? h.innerHTML : 'True or false?';
    let html = '';
    for(let k = 0; k < n; k++){
      const part = items.slice(k*per, (k+1)*per).map(x => x.outerHTML).join('');
      html += `<section class="${sec.className}"><h2>${title} (${k+1} of ${n})</h2><div class="tfbig"><div data-comp="tf" data-start="${k*per+1}">${part}</div></div></section>`;
    }
    sec.outerHTML = html;
  });
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
   <div class="dbar"><button class="v2only" id="dPrevS" title="Previous slide (Shift+←)">⏮ Slide</button><button id="dPrev" title="Back one step (←)">‹ Back</button><span id="dCount"></span><button id="dNext" title="Next step or slide (→, space, click)">Next ›</button><button class="v2only" id="dNextS" title="Next slide, fully revealed (Shift+→)">Next slide ⏭</button><button class="v2only" id="dAll" title="All slides (G)">▦ All slides</button><button id="dWarmup" title="5 quick recall questions from topics covered before">🔥 Warm-Up</button><button id="dBlack" title="Blank screen (B)">■ Blank</button><button id="dFull" title="F">⛶ Full screen</button><button id="dExit" title="Esc">✕ Exit</button></div>
   <div id="black"></div><div id="overview"><div class="ovhead"><b>All slides</b><span>Click a slide to jump to it · Esc to close</span><button id="ovClose">✕ Close</button></div><div class="ovgrid"></div></div>`;
  document.body.appendChild(root);
  const stage = $('#stage');
  const slides = $$('section.ps', src);
  stage.innerHTML = slides.map((s,i) => `<section class="ps ${s.className.replace('ps','')}" ${s.hasAttribute('data-nomatch')?'data-nomatch ':''}${s.getAttribute('style')?`style="${s.getAttribute('style')}"`:''}><div class="sbar"></div>${s.innerHTML}<div class="num">${i+1} / ${slides.length}</div></section>`).join('');
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
  function nextSlide(){ if(cur < ps.length-1){ ps[cur+1].shown = ps[cur+1].max; show(cur+1); } }
  function prevSlide(){ if(cur > 0){ ps[cur-1].shown = 0; show(cur-1); } }
  /* overview: grid of every slide, fully revealed; click to jump */
  const ov = $('#overview'), ovGrid = $('.ovgrid', ov); let ovBuilt = false;
  const ovOpen = () => ov.classList.contains('on');
  function ovScale(){ $$('.ovs', ov).forEach(t => { const w = t.clientWidth; if(w) t.firstChild.style.transform = `scale(${w/1600})`; }); }
  function overview(){
    if(!ovBuilt){
      ps.forEach((p,i) => {
        const t = document.createElement('div'); t.className = 'ovt'; t.dataset.i = i;
        const c = p.cloneNode(true); c.classList.add('cur');
        $$('.hint', c).forEach(h => h.remove()); $$('video', c).forEach(v => { v.removeAttribute('autoplay'); v.muted = true; });
        const h = $('h1,h2', p), lines = (h || p).innerText.split('\n').map(x => x.trim()).filter(Boolean), title = (h ? lines.join(' ') : (lines[0] || 'Slide')).slice(0,60);
        t.innerHTML = '<div class="ovs"></div>'; t.firstChild.appendChild(c);
        t.insertAdjacentHTML('beforeend', `<div class="ovl"><b>${i+1}</b> ${title.replace(/</g,'&lt;')}</div>`);
        t.onclick = () => { ovClose(); ps[i].shown = 0; show(i); };
        ovGrid.appendChild(t);
      });
      ovBuilt = true;
    }
    $$('.ovt', ov).forEach((t,i) => t.classList.toggle('cur', i === cur));
    ov.classList.add('on'); ovScale();
    const ct = $('.ovt.cur', ov); if(ct) ct.scrollIntoView({block:'center'});
  }
  function ovClose(){ ov.classList.remove('on'); }
  function fit(){ const s = Math.min(innerWidth/1600, innerHeight/900), sw = $('#stageWrap'); sw.style.width = 1600*s+'px'; sw.style.height = 900*s+'px'; stage.style.transform = `scale(${s})`; }
  const isP = () => body.classList.contains('pm');
  function enter(){ body.classList.add('pm'); fit(); show(cur); }
  function exit(){ ovClose(); body.classList.remove('pm','rvopen'); $('#black').classList.remove('on'); if(document.fullscreenElement) document.exitFullscreen(); }
  const full = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(()=>{});
  const pb = document.createElement('button'); pb.className='pbtn'; pb.textContent='▶ Present'; pb.title='Projector mode'; pb.onclick=enter; document.body.appendChild(pb);
  const hb = $('#hdrPresent'); if(hb) hb.onclick = enter;
  $('#dNext').onclick = next; $('#dPrev').onclick = prev;
  $('#dNextS').onclick = nextSlide; $('#dPrevS').onclick = prevSlide; $('#dAll').onclick = () => ovOpen() ? ovClose() : overview(); $('#ovClose').onclick = ovClose; $('#dExit').onclick = exit; $('#dFull').onclick = full;
  $('#dWarmup').onclick = () => {
    const ex = body.dataset.topic ? '&exclude=' + encodeURIComponent(body.dataset.topic.replace(/^[a-z]/i, c => c.toUpperCase()).replace('/', '')) : '';
    window.open('/interactive/spec-quiz/quiz.html?warmup=1' + ex, '_blank');
  };
  const blk = $('#black'); $('#dBlack').onclick = () => blk.classList.toggle('on'); blk.onclick = () => blk.classList.remove('on');
  stage.addEventListener('click', e => {
    if(e.target.closest('button,input,select,a,canvas,.nonav')) return;
    const r = stage.getBoundingClientRect(); (e.clientX < r.left + r.width/4) ? prev() : next();
  });
  addEventListener('keydown', e => {
    if(!isP() || e.target.closest('textarea,input')) return;
    const v2 = body.dataset.deckUi !== 'v1';
    if(ovOpen()){ if(e.key==='Escape'||e.key==='g'||e.key==='G'){ e.preventDefault(); ovClose(); } return; }
    if(v2 && e.shiftKey && e.key==='ArrowRight'){ e.preventDefault(); nextSlide(); }
    else if(v2 && e.shiftKey && e.key==='ArrowLeft'){ e.preventDefault(); prevSlide(); }
    else if(v2 && (e.key==='g'||e.key==='G')){ e.preventDefault(); overview(); }
    else if(['ArrowRight','ArrowDown',' ','PageDown','Enter'].includes(e.key)){ e.preventDefault(); next(); }
    else if(['ArrowLeft','ArrowUp','PageUp','Backspace'].includes(e.key)){ e.preventDefault(); prev(); }
    else if(e.key==='Escape') exit();
    else if(e.key==='f'||e.key==='F') full();
    else if(e.key==='b'||e.key==='B'||e.key==='.') blk.classList.toggle('on');
    else if(e.key==='Home') show(0); else if(e.key==='End') show(ps.length-1);
  });
  let tx=null; addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, {passive:true});
  addEventListener('touchend', e => { if(!isP()||tx===null) return; const d = e.changedTouches[0].clientX - tx; if(Math.abs(d)>50){ d<0?next():prev(); } tx=null; });
  let mt; addEventListener('mousemove', () => { body.classList.add('mouse'); clearTimeout(mt); mt = setTimeout(()=>body.classList.remove('mouse'), 1500); });
  addEventListener('resize', () => { if(isP()) fit(); if(ovOpen()) ovScale(); });
  deckApi = L.deck = { show, next, prev, nextSlide, prevSlide, overview, enter, exit, count: ps.length, get cur(){ return cur; } };
  const hStr = location.hash || '', qSlide = new URLSearchParams(location.search).get('slide');
  const hSlide = (hStr.match(/slide=(\d+)/i) || [])[1] || qSlide;
  if (hSlide && +hSlide >= 1) cur = Math.min(ps.length - 1, +hSlide - 1);
  if (/^#present\b/i.test(hStr) || hSlide) enter();
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

/* ---------- match backgrounds to big images with a plain background ----------
   For each projector slide's largest image (≥ 30% of the slide) and each page figure.pic image:
   sample the edge; if it is one solid colour, give the slide / frame that colour (and white text if dark).
   Opt out with data-nomatch on the slide/figure. */
function edgeColour(img){
  try{
    const w = img.naturalWidth, h = img.naturalHeight; if(!w || !h) return null;
    const c = document.createElement('canvas'), k = Math.min(1, 200 / Math.max(w, h)); c.width = Math.max(4, w*k|0); c.height = Math.max(4, h*k|0);
    const x = c.getContext('2d'); x.drawImage(img, 0, 0, c.width, c.height);
    const pts = []; const W = c.width-1, H = c.height-1;
    for(let i=0;i<=10;i++){ pts.push([W*i/10|0,0],[W*i/10|0,H],[0,H*i/10|0],[W,H*i/10|0]); }
    const px = pts.map(([a,b]) => x.getImageData(a,b,1,1).data);
    if(px.some(d => d[3] < 200)) return null;                       // transparent edges: leave alone
    const m = [0,1,2].map(ch => px.reduce((t,d) => t+d[ch], 0) / px.length);
    const sd = Math.sqrt(px.reduce((t,d) => t + [0,1,2].reduce((u,ch) => u + (d[ch]-m[ch])**2, 0), 0) / px.length / 3);
    if(sd > 9) return null;                                          // busy edge (photo): leave alone
    const lum = (0.2126*m[0] + 0.7152*m[1] + 0.0722*m[2]) / 255;
    if(lum > 0.96) return null;                                      // white already blends in
    return { css: `rgb(${m.map(v => Math.round(v)).join(',')})`, dark: lum < 0.45 };
  }catch(e){ return null; }
}
function whenLoaded(img, f){ if(img.complete && img.naturalWidth) f(); else img.addEventListener('load', f, {once:true}); }
function matchBg(){
  $$('#stage .ps').forEach(p => {
    if(p.hasAttribute('data-nomatch') || p.classList.contains('tslide')) return;
    const imgs = $$('img', p).filter(i => !i.closest('.linkcard,.ovs,.soft,.terms'));
    if(!imgs.length) return;
    let done = 0;
    imgs.forEach(img => whenLoaded(img, () => {
      if(++done < imgs.length) return;
      const area = i => { const r = i.getBoundingClientRect(), s = $('#stage').getBoundingClientRect(); return (r.width*r.height) / Math.max(1, s.width*s.height); };
      const vis = imgs.filter(i => i.offsetParent !== null);
      const big = (vis.length ? vis : imgs).map(i => [i, i.naturalWidth*i.naturalHeight]).sort((a,b) => b[1]-a[1])[0][0];
      if(vis.length && area(big) < 0.3) return;
      const c = edgeColour(big); if(!c) return;
      p.style.background = c.css; p.classList.add('matched'); p.classList.toggle('darkbg', c.dark);
    }));
  });
  $$('.wrap figure.pic').forEach(f => {
    if(f.hasAttribute('data-nomatch')) return;
    const img = $('img', f); if(!img || img.classList.contains('soft')) return;
    whenLoaded(img, () => { const c = edgeColour(img); if(!c) return; f.style.background = c.css; f.classList.toggle('darkbg', c.dark); });
  });
}

function init(){ header(); newer(); const wrap = document.querySelector('.wrap'); if(wrap) L.initComps(wrap); questions(); practise(); deck(); matchBg(); }
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
