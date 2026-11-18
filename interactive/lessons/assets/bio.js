/* Cakebread Science lessons: biology components (needs assets/cells.js, a copy of the Cell Spotter engine)
   cell             labelled cell diagram   data-type animal|plant|yeast|hypha|rod|coccus|amoeba|chlorella|virus
                                            data-labels="nucleus,wall"  data-seed  data-style colour|exam  data-steps="1" (slides: one label per click)
   kingdom-explorer five kingdoms + viruses: diagram + features, new-drawing button
   tf               true/false statements   children .tfi data-a="t|f" data-why="…"
   kingdom-quiz     which kingdom? picture quiz   data-img base path (default img/)
   gallery          photo grid with click-to-enlarge   children figure>img+figcaption
*/
(function(){
const L = window.Lesson = window.Lesson || {}; L.comps = L.comps || {};
const C = L.comps, $ = (s, r=document) => r.querySelector(s), $$ = (s, r=document) => [...r.querySelectorAll(s)];
const isDeck = el => !!el.closest('#stage');
const f1 = n => Math.round(n*10)/10;

/* ---------- extra cell types drawn here (same 400 x 280 frame as cells.js) ---------- */
const EXTRA_PARTS = {
  pseudo:{name:'Pseudopodium'}, fvac:{name:'Food vacuole'}, cvac:{name:'Contractile vacuole'},
  coat:{name:'Protein coat'}, genes:{name:'Genetic material (DNA or RNA)'}
};
function blob(cx, cy, rx, ry, lobes, seed){
  const pts = []; for(let i=0;i<120;i++){ const t = i/120*Math.PI*2;
    let k = 1; lobes.forEach(([a,w,h]) => { let d = Math.atan2(Math.sin(t-a), Math.cos(t-a)); k += h*Math.exp(-(d*d)/(2*w*w)); });
    k += 0.03*Math.sin(5*t+seed);
    pts.push([cx+rx*k*Math.cos(t), cy+ry*k*Math.sin(t)]); }
  return { d: 'M'+pts.map(p => f1(p[0])+' '+f1(p[1])).join('L')+'Z', pts };
}
function amoeba(seed){
  const s = seed||1, lobes = [[0.2,0.28,0.55],[2.3,0.3,0.45],[4.0,0.22,0.35],[5.3,0.25,0.25]];
  const b = blob(190,140,108,72,lobes,s), inner = blob(190,140,100,65,lobes,s);
  const tip = b.pts[Math.round(0.2/(Math.PI*2)*120)];
  const svg = `<path d="${b.d}" fill="#eef7f0" stroke="#4e8a5a" stroke-width="3"/><path d="${inner.d}" fill="#dcefe0" opacity=".7"/>
    <circle cx="170" cy="138" r="24" fill="#b39ddb" stroke="#4527a0" stroke-width="2"/><circle cx="165" cy="134" r="7" fill="#4527a0" opacity=".7"/>
    <circle cx="232" cy="112" r="15" fill="#e3f2fd" stroke="#1e88e5" stroke-width="2"/>
    <circle cx="140" cy="182" r="13" fill="#fff8e1" stroke="#8d6e63" stroke-width="2"/><circle cx="140" cy="182" r="5" fill="#8d6e63"/>
    <circle cx="225" cy="172" r="10" fill="#fff8e1" stroke="#8d6e63" stroke-width="2"/><circle cx="225" cy="172" r="4" fill="#8d6e63"/>`;
  return {svg, w:400, h:280, kind:'Amoeba (protoctist)', parts:{membrane:b.pts[40], cytoplasm:[205,150], nucleus:[170,138], cvac:[232,112], fvac:[140,182], pseudo:tip}, has:['membrane','cytoplasm','nucleus','cvac','fvac','pseudo']};
}
function chlorella(){
  const svg = `<circle cx="200" cy="140" r="112" fill="none" stroke="#2e7d32" stroke-width="9"/>
    <circle cx="200" cy="140" r="106" fill="#f1f8e9" stroke="#689f38" stroke-width="2"/>
    <path d="M118 104 A92 92 0 1 0 282 104 L262 112 A74 74 0 1 1 138 112 Z" fill="#66bb6a" stroke="#1b5e20" stroke-width="2"/>
    <circle cx="200" cy="118" r="26" fill="#b39ddb" stroke="#4527a0" stroke-width="2"/><circle cx="194" cy="113" r="8" fill="#4527a0" opacity=".7"/>`;
  return {svg, w:400, h:280, kind:'Chlorella (protoctist)', parts:{wall:[200,30], membrane:[296,140], chloro:[200,222], nucleus:[200,118], cytoplasm:[240,90]}, has:['wall','membrane','chloro','nucleus','cytoplasm']};
}
function virus(){
  const R = 104, cx = 200, cy = 140, pts = [...Array(6)].map((_,i) => [cx+R*Math.cos(Math.PI/6+i*Math.PI/3), cy+R*Math.sin(Math.PI/6+i*Math.PI/3)]);
  let caps = ''; for(let ring=1; ring<=2; ring++) for(let i=0;i<6;i++){ const a=Math.PI/6+i*Math.PI/3; for(let j=0;j<ring*2;j++){ const t=j/(ring*2); const p=[cx+R*(ring===2?0.93:0.93)*Math.cos(a)*(1-t)+R*0.93*Math.cos(a+Math.PI/3)*t, cy+R*0.93*Math.sin(a)*(1-t)+R*0.93*Math.sin(a+Math.PI/3)*t]; if(ring===2) caps+=`<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="7" fill="#ce93d8" stroke="#6a1b9a" stroke-width="1.2"/>`; } }
  let rna = 'M150 140'; for(let i=0;i<14;i++){ rna += ` Q${160+i*7} ${i%2?110:170} ${157+i*7} 140`; }
  const svg = `<polygon points="${pts.map(p=>p.map(f1).join(',')).join(' ')}" fill="#f3e5f5" stroke="#6a1b9a" stroke-width="4"/>${caps}
    <path d="${rna}" fill="none" stroke="#e53935" stroke-width="4" stroke-linecap="round"/>`;
  return {svg, w:400, h:280, kind:'Virus (not a cell)', parts:{coat:pts[0], genes:[200,140]}, has:['coat','genes']};
}
const EXTRA = {amoeba, chlorella, virus};
const KIND = {animal:'Animal cell', plant:'Plant cell', yeast:'Yeast cell', hypha:'Fungal hypha (e.g. Mucor)', rod:'Rod-shaped bacterium', coccus:'Spherical bacterium'};
function getCell(type, style, seed){
  if(EXTRA[type]) return EXTRA[type](seed);
  if(!window.Cells) throw new Error('cells.js not loaded');
  return window.Cells.cell(type, style||'colour', seed||7);
}
function partName(k, type){
  if(k==='nucleus' && type==='hypha') return 'Nuclei (many)';
  if(k==='wall') return {plant:'Cell wall (cellulose)', yeast:'Cell wall (chitin)', hypha:'Cell wall (chitin)', rod:'Cell wall', coccus:'Cell wall', chlorella:'Cell wall'}[type] || 'Cell wall';
  return (EXTRA_PARTS[k] || (window.Cells && window.Cells.PARTS[k]) || {name:k}).name;
}
/* draw a cell with leader-line labels down both sides */
function labelled(type, opts){
  opts = opts || {}; const c = getCell(type, opts.style, opts.seed);
  const keys = (opts.labels || c.has).filter(k => c.parts[k]);
  const fs = opts.big ? 21 : 15, gap = fs*1.55;
  const items = keys.map(k => ({k, p:c.parts[k], name:partName(k, type)}));
  const M = Math.max(opts.big ? 200 : 150, 24 + fs*0.56*Math.max(...items.map(it => it.name.length)));
  const sides = {L:[], R:[]}; items.forEach(it => sides[it.p[0] < 200 ? 'L' : 'R'].push(it));
  // balance sides
  while(sides.L.length > sides.R.length+1){ sides.L.sort((a,b)=>b.p[0]-a.p[0]); sides.R.push(sides.L.shift()); }
  while(sides.R.length > sides.L.length+1){ sides.R.sort((a,b)=>a.p[0]-b.p[0]); sides.L.push(sides.R.shift()); }
  let out = '', n = 0;
  for(const side of ['L','R']){
    const arr = sides[side].sort((a,b) => a.p[1]-b.p[1]);
    arr.forEach(it => it.y = Math.max(14, Math.min(266, it.p[1])));
    for(let i=1;i<arr.length;i++) arr[i].y = Math.max(arr[i].y, arr[i-1].y+gap);
    for(let i=arr.length-1;i>=0;i--){ const lim = i===arr.length-1 ? 270 : arr[i+1].y-gap; arr[i].y = Math.min(arr[i].y, lim); }
    arr.forEach(it => {
      n++; const tx = side==='L' ? -12 : 412, lx = side==='L' ? -6 : 406;
      const step = opts.steps ? ` data-s="${keys.indexOf(it.k)+1}"` : '';
      out += `<g class="lab"${step}><line x1="${lx}" y1="${f1(it.y)}" x2="${f1(it.p[0])}" y2="${f1(it.p[1])}" stroke="#111" stroke-width="${opts.big?2:1.4}"/><circle cx="${f1(it.p[0])}" cy="${f1(it.p[1])}" r="${opts.big?4:3}" fill="#111"/>
        <text x="${tx}" y="${f1(it.y + fs*0.35)}" text-anchor="${side==='L'?'end':'start'}" font-size="${fs}" font-weight="700" font-family="Barlow,Arial,sans-serif" fill="#111">${it.name}</text></g>`;
    });
  }
  return `<svg viewBox="${-M} 0 ${400+2*M} 280" role="img" aria-label="${c.kind || KIND[type] || type} with labels"><g>${c.svg}</g>${out}</svg>`;
}
L.cellSVG = labelled;
C['cell'] = el => {
  const big = isDeck(el);
  const draw = seed => { el.innerHTML = labelled(el.dataset.type, {labels: el.dataset.labels ? el.dataset.labels.split(',') : null, seed: seed, style: el.dataset.style, big, steps: el.dataset.steps==='1'}); };
  draw(+(el.dataset.seed || 7));
};

/* ---------- kingdom explorer ---------- */
const KINGDOMS = [
 {id:'plants', name:'Plants', col:'#2e7d32', cells:['plant'], rows:{
   'Cells':'Multicellular', 'Nucleus':'Yes (eukaryotic)', 'Cell wall':'Yes: cellulose', 'Chloroplasts':'Yes: they photosynthesise (make their own food)',
   'Carbohydrate store':'Starch or sucrose', 'Movement':'Generally can’t move from place to place; no nervous coordination', 'Examples':'Flowering plants: a cereal (maize) and a herbaceous legume (peas or beans)'}},
 {id:'animals', name:'Animals', col:'#c0392b', cells:['animal'], rows:{
   'Cells':'Multicellular', 'Nucleus':'Yes (eukaryotic)', 'Cell wall':'No', 'Chloroplasts':'No: they feed on other organisms',
   'Carbohydrate store':'Glycogen', 'Movement':'Usually move from place to place; have nervous coordination', 'Examples':'Mammals (humans), insects (housefly, mosquito)'}},
 {id:'fungi', name:'Fungi', col:'#8d5524', cells:['hypha','yeast'], rows:{
   'Cells':'Mostly a mycelium of thread-like hyphae with many nuclei; some single-celled (yeast)', 'Nucleus':'Yes (eukaryotic)', 'Cell wall':'Yes: chitin', 'Chloroplasts':'No',
   'Nutrition':'Saprotrophic: secrete digestive enzymes onto food outside the body, then absorb the products', 'Carbohydrate store':'Glycogen', 'Examples':'Mucor (bread mould, hyphae), yeast (single-celled)'}},
 {id:'protoctists', name:'Protoctists', col:'#00838f', cells:['amoeba','chlorella'], rows:{
   'Cells':'Microscopic, mostly single-celled', 'Nucleus':'Yes (eukaryotic)', 'Like animals':'Amoeba (lives in pond water)', 'Like plants':'Chlorella (has chloroplasts)',
   'Pathogen':'Plasmodium causes malaria', 'Note':'The “dustbin” kingdom: organisms that don’t fit the other groups'}},
 {id:'bacteria', name:'Bacteria', col:'#6a1b9a', cells:['rod','coccus'], rows:{
   'Cells':'Microscopic, single-celled', 'Nucleus':'No (prokaryotic): one circular chromosome of DNA', 'Also has':'Cell wall, cell membrane, cytoplasm, plasmids (small loops of DNA)',
   'Nutrition':'Most feed off other living or dead organisms; some photosynthesise', 'Examples':'Lactobacillus bulgaricus (rod-shaped, makes yoghurt from milk); Pneumococcus (spherical, causes pneumonia)'}},
 {id:'viruses', name:'Viruses', col:'#555', cells:['virus'], rows:{
   'Living?':'No: not made of cells', 'Structure':'Protein coat around one type of genetic material: DNA or RNA', 'Size':'Smaller than bacteria',
   'Reproduce':'Only inside living cells (parasites); can infect every type of organism', 'Examples':'Tobacco mosaic virus (stops chloroplasts forming → discoloured leaves), influenza (flu), HIV (causes AIDS)'}}
];
C['kingdom-explorer'] = el => {
  el.classList.add('tool'); let k = 0, ci = 0, seed = 7;
  el.innerHTML = `<div class="bar">${KINGDOMS.map((g,i)=>`<button class="btn" data-i="${i}" style="--kc:${g.col}">${g.name}</button>`).join('')}</div><div class="body"><div class="pic" style="flex-direction:column"></div><div class="info"></div></div>`;
  const draw = () => {
    const g = KINGDOMS[k];
    $$('.bar .btn', el).forEach((b,i) => { b.classList.toggle('on', i===k); b.style.background = i===k ? g.col : ''; b.style.borderColor = i===k ? g.col : ''; });
    const t = g.cells[ci];
    $('.pic', el).innerHTML = labelled(t, {seed}) + `<div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;justify-content:center">${g.cells.length>1 ? g.cells.map((c,i)=>`<button class="btn sm ${i===ci?'on':''}" data-c="${i}">${(KIND[c]||getCell(c).kind).replace(/ \(.*\)/,'')}</button>`).join('') : ''}${t==='virus'?'':'<button class="btn sm re">↻ Another drawing</button>'}</div>`;
    $('.info', el).innerHTML = `<h4 style="color:${g.col}">${g.name}</h4><dl class="facts">${Object.entries(g.rows).map(([a,b])=>`<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl>`;
    $$('.pic [data-c]', el).forEach(b => b.onclick = () => { ci = +b.dataset.c; draw(); });
    const re = $('.pic .re', el); if(re) re.onclick = () => { seed = 1 + Math.floor(Math.random()*99999); draw(); };
  };
  $$('.bar .btn', el).forEach(b => b.onclick = () => { k = +b.dataset.i; ci = 0; draw(); });
  draw();
};

/* ---------- true / false ---------- */
C['tf'] = el => {
  const items = $$('.tfi', el).map(d => ({q:d.innerHTML, a:d.dataset.a==='t', why:d.dataset.why||''}));
  if(isDeck(el)){
    el.innerHTML = `<ol class="tfdeck">${items.map((it,i)=>`<li><span>${it.q}</span><b class="tfans ${it.a?'t':'f'}" data-s="${i+1}">${it.a?'✔ True':'✘ False'}</b></li>`).join('')}</ol>`;
    return;
  }
  let got = 0, done = 0;
  el.classList.add('tfbox');
  el.innerHTML = items.map((it,i)=>`<div class="tfrow"><div class="tfq">${i+1}. ${it.q}</div><div class="tfb"><button class="btn t">True</button><button class="btn f">False</button></div><div class="tffb"></div></div>`).join('') + `<div class="tfscore"></div>`;
  $$('.tfrow', el).forEach((r,i) => $$('button', r).forEach(b => b.onclick = () => {
    if(r.dataset.done) return; r.dataset.done = 1; done++;
    const ok = b.classList.contains('t') === items[i].a; if(ok) got++;
    b.classList.add(ok ? 'right' : 'wrong');
    $('.tffb', r).innerHTML = `<b style="color:${ok?'var(--green)':'var(--acc2)'}">${ok?'Correct':'Not quite'}: ${items[i].a?'True':'False'}.</b> ${items[i].why}`;
    $('.tfscore', el).textContent = `${got} / ${done} correct`;
  }));
};

/* ---------- which kingdom? ---------- */
const QUIZ = [['yeast','Yeast','fungi'],['chlorella','Chlorella','protoctists'],['amoeba','Amoeba','protoctists'],['lactobacillus','Lactobacillus bulgaricus','bacteria'],
  ['mushrooms','Mushrooms','fungi'],['moss','Moss','plants'],['corals','Coral','animals'],['jellyfish','Jellyfish','animals'],['mucor','Mucor (bread mould)','fungi'],
  ['pneumococcus','Pneumococcus','bacteria'],['ferns','Fern','plants'],['snail','Snail','animals'],['turkey-tail','Turkey tail','fungi'],['tmv','Tobacco mosaic virus','viruses'],
  ['influenza','Influenza','viruses'],['oak','Oak tree','plants']];
C['kingdom-quiz'] = el => {
  const base = el.dataset.img || 'img/'; el.classList.add('tool');
  let order = QUIZ.map((_,i)=>i).sort(()=>Math.random()-.5), i = 0, got = 0;
  const draw = () => {
    if(i >= order.length){ el.innerHTML = `<div style="padding:20px;text-align:center"><div style="font:900 40px 'Barlow Condensed',sans-serif">${got} / ${order.length}</div><button class="btn again">Play again</button></div>`; $('.again',el).onclick = () => { order.sort(()=>Math.random()-.5); i = 0; got = 0; draw(); }; return; }
    const [img, name, ans] = QUIZ[order[i]];
    el.innerHTML = `<div class="kq"><img src="${base}${img}.webp" alt="${name}"><div><div class="kqn">${i+1} / ${order.length} · <b>${name}</b></div><p style="margin:6px 0">Which group does it belong to?</p><div class="kqb">${KINGDOMS.map(g=>`<button class="btn" data-k="${g.id}">${g.name}</button>`).join('')}</div><div class="kqf"></div></div></div>`;
    $$('.kqb .btn', el).forEach(b => b.onclick = () => {
      if(el.dataset.lock) return; el.dataset.lock = 1; const ok = b.dataset.k === ans; if(ok) got++;
      b.classList.add(ok?'right':'wrong'); $(`.kqb [data-k="${ans}"]`, el).classList.add('right');
      $('.kqf', el).innerHTML = `${ok?'✔ Correct':'✘ It’s '+KINGDOMS.find(g=>g.id===ans).name}${ans==='viruses'?' (not a kingdom: viruses aren’t living)':''} <button class="btn sm nx">Next →</button>`;
      $('.nx', el).onclick = () => { delete el.dataset.lock; i++; draw(); };
    });
  };
  draw();
};

/* ---------- gallery with lightbox ---------- */
C['gallery'] = el => {
  el.classList.add('gal');
  $$('figure', el).forEach(f => f.addEventListener('click', () => {
    const img = $('img', f), cap = $('figcaption', f);
    const box = document.createElement('div'); box.className = 'lightbox';
    box.innerHTML = `<img src="${img.src}" alt="${img.alt}"><div>${cap ? cap.innerHTML : ''}</div>`;
    box.onclick = () => box.remove(); document.body.appendChild(box);
  }));
};
})();
