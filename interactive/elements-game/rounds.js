/* Components (periodic table, shell diagrams) and question generators for the Elements 1–20 game. */
(function(){
const D=window.EL,E=D.E,bySym=D.bySym;
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const KIND={metal:'metal',nonmetal:'non-metal',semi:'semi-metal (metalloid)'};
const col=e=>e.group===null?1:e.group===0?8:e.group;
const chg=n=>n>0?(n===1?'+':n+'+'):(n===-1?'−':(-n)+'−');
const chgOpt=n=>n>0?'+'+n:'−'+(-n);

/* ---------- periodic table (first 20, short form) ---------- */
// opts: label 'full'|'sym'|'symz'|'blank'; colour 'kind'|null; hl {sym:'class'}; heads bool; click bool
function table(o={}){const label=o.label||'symz',hl=o.hl||{};
  let h=`<div class="ptable ${o.small?'small':''} ${o.click?'clickable':''}">`;
  if(o.heads!==false){h+='<div class="ph corner"></div>';[1,2,3,4,5,6,7,0].forEach(g=>h+=`<div class="ph gh">${g}</div>`);}
  for(let p=1;p<=4;p++){if(o.heads!==false)h+=`<div class="ph pr">${p}</div>`;
    for(let c=1;c<=8;c++){const e=E.find(x=>x.period===p&&col(x)===c);
      if(!e){h+='<div class="pcell empty"></div>';continue;}
      const cls=['pcell',o.colour==='kind'?'k-'+e.kind:'',e.group===null?'hydro':'',hl[e.sym]||'',o.step&&['Be','Al'].includes(e.sym)?'stepR':'',o.step&&e.sym==='B'?'stepB':'',o.step&&e.sym==='Ca'?'stepR':''].join(' ');
      let inner='';if(label==='full')inner=`<span class="z">${e.z}</span><b>${e.sym}</b><span class="nm">${e.name}</span>`;
      else if(label==='symz')inner=`<span class="z">${e.z}</span><b>${e.sym}</b>`;
      else if(label==='sym')inner=`<b>${e.sym}</b>`;
      else if(label==='cfg')inner=`<b>${e.sym}</b><span class="nm">${D.cfg(e.config)}</span>`;
      else inner='';
      h+=`<button type="button" class="${cls}" data-sym="${e.sym}" ${o.click?'':'tabindex="-1"'} aria-label="${o.label==='blank'?'Period '+e.period+', column '+c:e.name}">${inner}</button>`;}}
  if(o.heads!==false)h+=`<div class="pfoot"><span>↑ group</span><span>← period</span></div>`;
  return h+'</div>';}

/* ---------- shell (Bohr) diagram ---------- */
function bohr(config,o={}){const n=config.length,S=o.size||260,c=S/2,rs=[0,40,62,84,106].map(r=>r*S/260),nr=24*S/260;
  let s=`<svg class="bohr" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}" role="img" aria-label="Shell diagram">`;
  for(let i=1;i<=n;i++)s+=`<circle cx="${c}" cy="${c}" r="${rs[i]}" fill="none" stroke="#111" stroke-width="1.6"/>`;
  s+=`<circle cx="${c}" cy="${c}" r="${nr}" fill="#fde68a" stroke="#111" stroke-width="1.6"/><text x="${c}" y="${c+7*S/260}" text-anchor="middle" font-size="${20*S/260}" font-weight="700" font-family="Barlow, sans-serif">${esc(o.label??'?')}</text>`;
  config.forEach((k,i)=>{const r=rs[i+1];const pos=[];
    if(i===0){if(k>0)pos.push(-90);if(k>1)pos.push(90);}
    else{const base=[-90,0,90,180];for(let j=0;j<k;j++){if(k<=4)pos.push(base[j]);else if(j<4)pos.push(j<k-4?base[j]-12:base[j]);else pos.push(base[j-4]+12);}}
    pos.forEach(a=>{const x=c+r*Math.cos(a*Math.PI/180),y=c+r*Math.sin(a*Math.PI/180),cs=o.cross&&i===n-1?1:0;
      s+=cs?`<g stroke="#c62828" stroke-width="2.4"><line x1="${x-5}" y1="${y-5}" x2="${x+5}" y2="${y+5}"/><line x1="${x-5}" y1="${y+5}" x2="${x+5}" y2="${y-5}"/></g>`:`<circle cx="${x}" cy="${y}" r="${5.2*S/260}" fill="#1d4ed8"/>`;});});
  s+='</svg>';
  if(o.charge)s=`<span class="ionwrap"><span class="br">[</span>${s}<span class="br">]</span><sup>${chg(o.charge)}</sup></span>`;
  return s;}

/* ---------- helpers ---------- */
function mcq(correct,wrongs,extra={}){const seen=new Set([correct]),ws=[];for(const w of wrongs){if(!seen.has(w)&&ws.length<3){seen.add(w);ws.push(w);}}
  const opts=shuffle([correct,...ws]);return Object.assign({kind:'mcq',options:opts,correct:opts.indexOf(correct)},extra);}
const fixedMcq=(opts,correct,extra)=>Object.assign({kind:'mcq',options:opts,correct:opts.indexOf(correct)},extra);
function nearEls(e,n=3,filter=()=>true){return shuffle(E.filter(x=>x!==e&&filter(x))).sort((a,b)=>Math.abs(a.z-e.z)-Math.abs(b.z-e.z)).slice(0,n+2).slice(0,n);}
const notH=E.filter(e=>e.group!==null);
const posText=e=>e.group===null?'period 1, on its own at the top':`${D.groupLabel(e.group)}, period ${e.period}`;

/* ---------- ROUNDS ---------- */
const ROUNDS=[
{id:'symbols',stage:1,name:'Symbol snap',desc:'Element names and symbols, both ways round. Watch out for the tricky ones.',gen(){const e=pick(E);
  if(Math.random()<0.55){const fakes=(D.FAKE_SYMBOLS[e.name]||[]).concat(nearEls(e,3).map(x=>x.sym));
    return mcq(e.sym,shuffle(fakes),{prompt:`What is the symbol for <b>${e.name}</b>?`,explain:`${e.name} is <b>${e.sym}</b>.${['Na','K'].includes(e.sym)?' Its symbol comes from its Latin name.':''}`,tag:e.name+' ('+e.sym+')',big:true});}
  const others=shuffle(E.filter(x=>x!==e&&(x.sym[0]===e.sym[0]||x.name[0]===e.sym[0]))).map(x=>x.name).concat(nearEls(e,3).map(x=>x.name));
  return mcq(e.name,others,{prompt:`Which element has the symbol <b class="sym">${e.sym}</b>?`,explain:`<b>${e.sym}</b> is ${e.name}.`,tag:e.name+' ('+e.sym+')'});}},

{id:'numbers',stage:1,name:'Number match',desc:'Match each element to its atomic number.',gen(){const e=pick(E);
  if(Math.random()<0.5)return mcq(String(e.z),shuffle([e.z-1,e.z+1,e.z+2,e.z-2,e.z+8,e.z-8].filter(z=>z>=1&&z<=20)).map(String),{prompt:`What is the atomic number of <b>${e.name}</b> (${e.sym})?`,explain:`${e.name} is element <b>${e.z}</b>: it has ${e.z} proton${e.z>1?'s':''}.`,tag:e.name+' ('+e.z+')'});
  return mcq(e.name,nearEls(e,4).map(x=>x.name),{prompt:`Which element has atomic number <b>${e.z}</b>?`,explain:`Element ${e.z} is <b>${e.name}</b> (${e.sym}).`,tag:e.name+' ('+e.z+')'});}},

{id:'place',stage:1,name:'Place it',desc:'Tap where the element belongs on a blank Periodic Table.',gen(){const r=Math.random();
  if(r<0.6){const e=pick(E);return {kind:'place',target:e.sym,label:'blank',prompt:`Tap where <b>${e.name}</b> (${e.sym}) goes.`,explain:`${e.name} is in ${posText(e)}.`,tag:e.name+': position'};}
  if(r<0.85){const e=pick(notH);return {kind:'place',target:e.sym,label:'blank',prompt:`Tap the element in <b>${D.groupLabel(e.group)}, period ${e.period}</b>.`,explain:`That’s <b>${e.name}</b> (${e.sym}). Groups go down, periods go across.`,tag:'Groups and periods'};}
  const g=pick([1,7,0]),es=notH.filter(x=>x.group===g),e=pick(es);return {kind:'place',target:es.map(x=>x.sym),label:'symz',prompt:`Tap any one of the <b>${D.GROUP_NAMES[g]}</b>.`,explain:`The ${D.GROUP_NAMES[g]} are Group ${g}: ${es.map(x=>x.name).join(', ')}.`,tag:'Group names'};}},

{id:'groups',stage:1,name:'Groups & periods',desc:'Which group? Which period? What do the words mean?',gen(){const r=Math.random();
  if(r<0.35){const d=pick(D.DEFS.filter(x=>!/outer shell|occupied|noble gases not/.test(x.q)));return fixedMcq(shuffle(d.o),d.a,{prompt:d.q,explain:d.why,tag:d.tag});}
  const e=pick(notH);
  if(r<0.6)return mcq(D.groupLabel(e.group),shuffle([1,2,3,4,5,6,7,0].filter(g=>g!==e.group)).map(D.groupLabel),{prompt:`Which group is <b>${e.name}</b> (${e.sym}) in?`,visual:table({label:'symz',hl:{[e.sym]:'hl'},small:true}),explain:`${e.name} is in <b>${D.groupLabel(e.group)}</b>${D.GROUP_NAMES[e.group]?', the '+D.GROUP_NAMES[e.group]:''}. Count the columns: 1, 2, then 3 to 7, then 0.`,tag:'Groups and periods'});
  if(r<0.8)return mcq('Period '+e.period,['Period 1','Period 2','Period 3','Period 4'].filter(p=>p!=='Period '+e.period),{prompt:`Which period is <b>${e.name}</b> (${e.sym}) in?`,visual:table({label:'symz',hl:{[e.sym]:'hl'},small:true}),explain:`${e.name} is in <b>period ${e.period}</b>: the ${['first','second','third','fourth'][e.period-1]} row.`,tag:'Groups and periods'});
  return mcq(e.name,nearEls(e,3,x=>x.group!==null).map(x=>x.name),{prompt:`Which element is in <b>${D.groupLabel(e.group)}, period ${e.period}</b>?`,explain:`${D.groupLabel(e.group)}, period ${e.period} is <b>${e.name}</b>.`,tag:'Groups and periods'});}},

{id:'metals',stage:1,name:'Metal or non-metal?',desc:'Sort elements and use properties: conductivity and acidic or basic oxides.',gen(){
  if(Math.random()<0.6){const e=pick(E.filter(x=>x.kind!=='semi'));const a=e.kind==='metal'?'Metal':'Non-metal';
    return fixedMcq(['Metal','Non-metal'],a,{prompt:`Is <b>${e.name}</b> (${e.sym}) a metal or a non-metal?`,visual:table({label:'symz',colour:null,hl:{[e.sym]:'hl'},small:true,step:true}),explain:`${e.name} is a <b>${a.toLowerCase()}</b>. ${e.kind==='metal'?'Metals are on the left of the stepped line.':e.sym==='H'?'Hydrogen is a non-metal, even though it is often drawn above Group 1.':'Non-metals are on the right of the stepped line.'}`,tag:'Metals and non-metals',big:true});}
  const p=pick(D.PROPS);return fixedMcq(['Metal','Non-metal'],p.a==='metal'?'Metal':'Non-metal',{prompt:p.q,explain:p.why,tag:'Metal and non-metal properties',big:true});}},

{id:'build',stage:2,name:'Shell builder',desc:'Put the electrons into their shells: 2, then 8, then 8.',gen(){const e=pick(E);const showPos=Math.random()<0.5&&e.group!==null;
  return {kind:'build',el:e,prompt:showPos?`Build the electronic configuration of the <b>highlighted</b> element.`:`Build the electronic configuration of <b>${e.name}</b> (atomic number ${e.z}).`,visual:showPos?table({label:'sym',hl:{[e.sym]:'hl'},small:true}):'',
    explain:`${e.name} has ${e.z} electron${e.z>1?'s':''}: <b>${D.cfg(e.config)}</b>. Fill shells in order: up to 2 in the first, then up to 8 in the second and third.${e.group!==null?` It’s in period ${e.period} (${e.period} shells) and ${D.groupLabel(e.group)} (${e.group||8} outer electrons).`:''}`,tag:'Electronic configurations'};}},

{id:'detective',stage:2,name:'Diagram detective',desc:'Read a shell diagram: which element is it?',gen(){const e=pick(E);
  if(Math.random()<0.65)return mcq(e.name,nearEls(e,4).map(x=>x.name),{prompt:'Which element’s atom is shown?',visual:`<div class="bohrbox">${bohr(e.config)}</div>`,explain:`Count the electrons: ${D.cfg(e.config)} = ${e.z} electrons, so ${e.z} protons. That’s <b>${e.name}</b>.`,tag:'Reading shell diagrams'});
  return mcq(D.cfg(e.config),nearEls(e,4).map(x=>D.cfg(x.config)),{prompt:'Write the electronic configuration shown.',visual:`<div class="bohrbox">${bohr(e.config)}</div>`,explain:`Count each shell from the centre outwards: <b>${D.cfg(e.config)}</b> (${e.name}).`,tag:'Reading shell diagrams'});}},

{id:'links',stage:2,name:'Electrons & the table',desc:'Link electronic configuration to group and period, and explain why groups behave alike.',gen(){const r=Math.random();
  if(r<0.3){const d=pick(D.DEFS.filter(x=>/outer shell|occupied|noble gases not/.test(x.q)));return fixedMcq(shuffle(d.o),d.a,{prompt:d.q,explain:d.why,tag:d.tag});}
  const e=pick(notH);const c=D.cfg(e.config);
  if(r<0.55)return mcq(D.groupLabel(e.group),[1,2,3,4,5,6,7,0].filter(g=>g!==e.group).sort((a,b)=>Math.abs(a-e.group)-Math.abs(b-e.group)).map(D.groupLabel),{prompt:`An atom has the electronic configuration <b class="cfg">${c}</b>. Which group is it in?`,explain:`${e.config[e.config.length-1]} electron${e.config[e.config.length-1]>1?'s':''} in the outer shell${e.group===0?' (a full outer shell)':''} → <b>${D.groupLabel(e.group)}</b>. It’s ${e.name}.`,tag:'Electrons and position'});
  if(r<0.8)return mcq('Period '+e.period,['Period 1','Period 2','Period 3','Period 4'].filter(p=>p!=='Period '+e.period),{prompt:`An atom has the electronic configuration <b class="cfg">${c}</b>. Which period is it in?`,explain:`${e.config.length} occupied shell${e.config.length>1?'s':''} → <b>period ${e.period}</b>. It’s ${e.name}.`,tag:'Electrons and position'});
  const g=e.group;const same=notH.filter(x=>x.group===g&&x!==e);if(!same.length)return ROUNDS.find(x=>x.id==='links').gen();const f=pick(same);
  return mcq(f.name,shuffle(notH.filter(x=>x.group!==g)).sort((a,b)=>Math.abs(a.period-f.period)-Math.abs(b.period-f.period)).map(x=>x.name),{prompt:`Which element has <b>similar chemical properties</b> to ${e.name} (${c})?`,explain:`<b>${f.name}</b> (${D.cfg(f.config)}) is also in ${D.groupLabel(g)}: same number of outer electrons, so similar reactions.`,tag:'Why groups are similar'});}},

{id:'ions',stage:2,name:'Ion factory',desc:'Lose or gain electrons? What charge? What configuration?',gen(){const r=Math.random();
  if(r<0.18){const d=pick(D.ION_THEORY);return fixedMcq(shuffle(d.o),d.a,{prompt:d.q,explain:d.why,tag:d.tag});}
  const sym=pick(Object.keys(D.IONS)),e=bySym[sym],q=D.IONS[sym],n=Math.abs(q);
  const ionName=q>0?`${e.name} ion`:`${D.ION_NAMES[sym]} ion`;
  const ionCfg=q>0?e.config.slice(0,-1):[...e.config.slice(0,-1),8];
  const last=e.config.length-1,plus=e.config.map((x,i)=>i===last?x+n:x),minus=e.config.map((x,i)=>i===last?x-n:x).filter(x=>x>0);
  if(r<0.45)return mcq(chgOpt(q),['+1','+2','+3','−1','−2','−3'].filter(x=>x!==chgOpt(q)).sort(()=>Math.random()-0.5).sort((a,b)=>(b[0]===chgOpt(q)[0])-(a[0]===chgOpt(q)[0])),{prompt:`What is the charge on the ion formed by <b>${e.name}</b> (${D.groupLabel(e.group)})?`,explain:`${e.name} ${q>0?'loses':'gains'} ${n} electron${n>1?'s':''} to get a full outer shell, so it forms <b>${e.sym}<sup>${chg(q)}</sup></b>.`,tag:'Ion charges'});
  if(r<0.7){const opts=['loses 1 electron','loses 2 electrons','loses 3 electrons','gains 1 electron','gains 2 electrons','gains 3 electrons'];const a=`${q>0?'loses':'gains'} ${n} electron${n>1?'s':''}`;
    return mcq(a,shuffle(opts.filter(x=>x!==a)),{prompt:`When a <b>${e.name}</b> atom (${D.cfg(e.config)}) forms an ion, it…`,explain:`${e.config[e.config.length-1]} outer electron${e.config[e.config.length-1]>1?'s':''}: it’s easier to ${q>0?'lose them':'gain '+n+' more to make 8'}. It forms <b>${e.sym}<sup>${chg(q)}</sup></b>.`,tag:'Forming ions'});}
  return mcq(D.cfg(ionCfg),shuffle([D.cfg(e.config),D.cfg(q>0?plus:minus),'2','2.8','2.8.8','2.8.8.8'].filter(x=>x!==D.cfg(ionCfg))),{prompt:`What is the electronic configuration of the <b>${ionName}</b>, ${e.sym}<sup>${chg(q)}</sup>?`,visual:`<div class="bohrbox">${bohr(e.config,{label:e.sym})}</div><p class="cap">The ${e.name} atom, ${D.cfg(e.config)}</p>`,explain:`${e.sym} ${q>0?'loses':'gains'} ${n} electron${n>1?'s':''}: ${D.cfg(e.config)} → <b>${D.cfg(ionCfg)}</b>, the same as a noble gas.`,tag:'Ion configurations'});}},

{id:'atoms',stage:2,name:'Atom anatomy',desc:'Protons, neutrons and electrons: where they are, and how many.',gen(){
  if(Math.random()<0.4){const d=pick(D.ATOM);return fixedMcq(shuffle(d.o),d.a,{prompt:d.q,explain:d.why,tag:d.tag});}
  const e=pick(E),nn=e.mass-e.z,what=pick(['protons','neutrons','electrons']),ans=what==='neutrons'?nn:e.z;
  const wr=[e.mass,what==='neutrons'?e.z:nn,ans+1,ans-1,e.mass+e.z].filter(x=>x>=0&&x!==ans).map(String);
  return mcq(String(ans),wr,{prompt:`How many <b>${what}</b> are in this atom?`,visual:`<div class="nuclide"><span class="ms">${e.mass}</span><span class="zz">${e.z}</span><b>${e.sym}</b></div>`,explain:`Top number = mass number (${e.mass}), bottom = atomic number (${e.z}). Protons = ${e.z}, electrons = ${e.z}, neutrons = ${e.mass} − ${e.z} = ${nn}.`,tag:'Protons, neutrons, electrons'});}},

{id:'mystery',stage:3,name:'Mystery element',desc:'Clues appear one by one. Tap the element on the table with as few clues as you can.',gen(){const e=pick(E);
  const c=[];c.push(`I’m a ${KIND[e.kind]}${e.state==='gas'?' and a gas at room temperature':''}.`);
  c.push(e.group===null?'I’m in period 1 and I sit on my own at the top of the table.':`I’m in period ${e.period}.`);
  c.push(e.group===null?'I have just one electron.':D.GROUP_NAMES[e.group]?`I’m one of the ${D.GROUP_NAMES[e.group]}.`:`My atoms have ${e.group} electrons in their outer shell.`);
  c.push(`My electronic configuration is ${D.cfg(e.config)}.`);
  return {kind:'place',mystery:true,clues:c,target:e.sym,label:'blank',prompt:'Who am I? Tap me on the table.',explain:`I’m <b>${e.name}</b> (${e.sym}), element ${e.z}.`,tag:e.name+': position'};}}
];
// Build a list of n questions for a round, avoiding immediate repeats
function make(id,n){const R=ROUNDS.find(r=>r.id===id),out=[],seen=new Set();let g=0;while(out.length<n&&g++<200){const q=R.gen();const k=q.prompt+(q.target||'')+(q.el?q.el.sym:'')+(q.visual||'').length;if(seen.has(k)&&g<150)continue;seen.add(k);q.round=id;out.push(q);}return out;}
window.ER={ROUNDS,make,table,bohr,shuffle,pick,esc,chg};
})();
