/* Components (periodic table, shell diagrams) and question generators for the Elements 1–20 game. */
(function(){
const D=window.EL,E=D.E,bySym=D.bySym;
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const KIND={metal:'metal',nonmetal:'non-metal',semi:'semi-metal (metalloid)'};
const chg=n=>n>0?(n===1?'+':n+'+'):(n===-1?'−':(-n)+'−');
const chgOpt=n=>n>0?'+'+n:'−'+(-n);

/* ---------- periodic table (first 20): familiar layout, narrow labelled gap where the transition metals go ---------- */
// opts: label 'full'|'sym'|'symz'|'cfg'|'blank'; colour 'kind'|null; hl {sym:'class'}; heads bool; click bool; small bool; step bool;
//       names bool (group names alkali metals / halogens / noble gases + coloured strips; off in questions so they don't give answers away)
const GCOL=e=>e.group===null||e.group===1?2:e.group===2?3:e.group===0?10:e.group+2;
const GNAME={1:'alkali metals',7:'halo­gens',0:'noble gases'};
function table(o={}){const label=o.label||'symz',hl=o.hl||{},heads=o.heads!==false;
  let h=`<div class="ptwrap ${o.small?'small':''}"><div class="ptable ${o.click?'clickable':''} ${o.names?'acc':''}">`;
  if(heads){[1,2,3,4,5,6,7,0].forEach(g=>{const c=g===1?2:g===2?3:g===0?10:g+2;
      h+=`<div class="ph gh ${g===1?'g1':g===7?'g7':g===0?'g0':''}" style="grid-column:${c};grid-row:1"><b>${g}</b>${o.names&&GNAME[g]?`<small>${GNAME[g]}</small>`:''}</div>`;});
    for(let p=1;p<=4;p++)h+=`<div class="ph pr" style="grid-column:1;grid-row:${p+1}">${p}</div>`;}
  h+=`<div class="tmlabel" style="grid-row:${heads?'3/6':'2/5'}">transition metals</div>`;
  E.forEach(e=>{const cls=['pcell',o.colour==='kind'?'k-'+e.kind:'',e.group===null?'hydro':'',e.group===1?'g1':e.group===7?'g7':e.group===0?'g0':'',hl[e.sym]||'',o.step&&['Be','Al','Ca'].includes(e.sym)?'stepR':'',o.step&&e.sym==='B'?'stepB':''].join(' ');
    let inner='';if(label==='full')inner=`<span class="z">${e.z}</span><b>${e.sym}</b><span class="nm">${e.name}</span>`;
    else if(label==='symz')inner=`<span class="z">${e.z}</span><b>${e.sym}</b>`;
    else if(label==='sym')inner=`<b>${e.sym}</b>`;
    else if(label==='cfg')inner=`<b>${e.sym}</b><span class="nm cf">${D.cfg(e.config)}</span>`;
    h+=`<button type="button" class="${cls}" style="grid-column:${GCOL(e)};grid-row:${e.period+(heads?1:0)}" data-sym="${e.sym}" ${o.click?'':'tabindex="-1"'} aria-label="${label==='blank'?'Period '+e.period+', '+(e.group===null?'hydrogen position':'group '+e.group):e.name}">${inner}</button>`;});
  if(heads)h+=`<div class="pfoot"><span>groups go down ↓</span><span>periods go across →</span></div>`;
  return h+'</div></div>';}

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
  const ion=D.IONS[e.sym],o=e.config[e.config.length-1],lo=Math.max(1,e.z-3-Math.floor(Math.random()*3)),hi=Math.min(20,lo+5);
  const c=[];
  c.push(pick([`I’m a ${KIND[e.kind]}${e.state==='gas'?' and a gas at room temperature':''}.`,`I’m ${e.state==='gas'?'a gas':'a solid'} at room temperature, and I’m a ${KIND[e.kind]}.`,`My atomic number is somewhere between ${lo} and ${hi}.`]));
  c.push(e.group===null?pick(['I’m in period 1 and I sit on my own at the top of the table.','My atoms have just one occupied shell, and I’m not a noble gas.']):pick([`I’m in period ${e.period}.`,`My atoms have ${e.config.length} occupied shell${e.config.length>1?'s':''}.`]));
  c.push(e.group===null?'I have just one electron.':pick([D.GROUP_NAMES[e.group]?`I’m one of the ${D.GROUP_NAMES[e.group]}.`:`My atoms have ${o} electron${o>1?'s':''} in their outer shell.`,`My atoms have ${o} electron${o>1?'s':''} in their outer shell${e.group===0?' (a full shell)':''}.`,ion?`I form ions with a ${chg(ion)} charge.`:`I’m in ${D.groupLabel(e.group)}.`]));
  c.push(pick([`My electronic configuration is ${D.cfg(e.config)}.`,`My nucleus contains ${e.z} proton${e.z>1?'s':''}.`,`My atoms have ${e.z} electron${e.z>1?'s':''}.`]));
  return {kind:'place',mystery:true,clues:c,target:e.sym,label:'blank',prompt:'Who am I? Tap me on the table.',explain:`I’m <b>${e.name}</b> (${e.sym}), element ${e.z}.`,tag:e.name+': position'};}}
];
/* ---------- extra question types (added 6 Nov 2026 for more variety) ---------- */
const SYMS=E.map(e=>e.sym);
const twoLetter=E.filter(e=>e.sym.length===2);
const ionStr=s=>{const q=D.IONS[s];return s+'<sup>'+chg(q)+'</sup>';};
const ionCfgOf=s=>{const e=bySym[s],q=D.IONS[s];return q>0?e.config.slice(0,-1):[...e.config.slice(0,-1),8];};
const EXTRA={
 symbols:[
  ()=>{const e=pick(twoLetter),a=e.sym,b=a[0]+a[1].toUpperCase(),c=a.toLowerCase(),d=a[0].toLowerCase()+a[1].toUpperCase();
    return fixedMcq(shuffle([a,b,c,d]),a,{prompt:`Which is the correct way to write the symbol for <b>${e.name}</b>?`,explain:`<b>${a}</b>: the first letter is always a capital, the second letter is always small.`,tag:'Writing symbols',big:true});},
  ()=>{const fakes=[...new Set(Object.values(D.FAKE_SYMBOLS).flat())].filter(f=>!SYMS.includes(f)&&f.length===2),f=pick(fakes),real=shuffle(SYMS).slice(0,3);
    return fixedMcq(shuffle([f,...real]),f,{prompt:`Three of these are symbols of the first 20 elements. Which one is <b>not</b>?`,explain:`<b>${f}</b> is not one of them. The others: ${real.map(x=>x+' = '+bySym[x].name).join(', ')}.`,tag:'Element symbols',big:true});},
  ()=>{const e=pick(E.filter(x=>x.sym[0]!==x.name[0]||['Na','K','Mg','Cl','Ar','Ca','Si','Be','He','Ne','Al'].includes(x.sym)));
    return mcq(e.sym,shuffle(SYMS.filter(x=>x!==e.sym&&(x[0]===e.sym[0]||x[0]===e.name[0]))).concat(shuffle(SYMS)),{prompt:`<b>${e.name}</b>: pick its symbol.`,explain:`${e.name} is <b>${e.sym}</b>.`,tag:e.name+' ('+e.sym+')',big:true});}],
 numbers:[
  ()=>{const e=pick(E);return mcq(String(e.z),[e.mass,e.z+1,e.z-1,e.mass-e.z,e.z*2].filter(x=>x>0&&x!==e.z).map(String),{prompt:`How many <b>protons</b> are in an atom of <b>${e.name}</b>?`,explain:`The atomic number tells you the number of protons. ${e.name} is element ${e.z}, so <b>${e.z}</b> protons.`,tag:e.name+' ('+e.z+')'});},
  ()=>{const e=pick(E.filter(x=>x.z<20)),n=E[e.z];return mcq(n.name,nearEls(e,4).filter(x=>x!==n).map(x=>x.name),{prompt:`Which element comes straight <b>after ${e.name}</b> (element ${e.z})?`,explain:`Atomic numbers go up by one each time: after ${e.z} comes ${n.z}, <b>${n.name}</b>.`,tag:n.name+' ('+n.z+')'});},
  ()=>{const four=shuffle(E).slice(0,4),best=four.slice().sort((a,b)=>b.z-a.z)[0],small=Math.random()<0.5;const t=small?four.slice().sort((a,b)=>a.z-b.z)[0]:best;
    return fixedMcq(four.map(x=>x.name),t.name,{prompt:`Which of these has the <b>${small?'smallest':'largest'}</b> atomic number?`,explain:four.slice().sort((a,b)=>a.z-b.z).map(x=>`${x.name} ${x.z}`).join(', ')+`. So <b>${t.name}</b>.`,tag:'Atomic numbers'});}],
 place:[
  ()=>{const e=pick(E);return {kind:'place',target:e.sym,label:'blank',prompt:`Tap element number <b>${e.z}</b>.`,explain:`Element ${e.z} is <b>${e.name}</b> (${e.sym}), ${posText(e)}.`,tag:e.name+': position'};},
  ()=>{const g=pick([2,3,4,5,6]),es=notH.filter(x=>x.group===g);return {kind:'place',target:es.map(x=>x.sym),label:'blank',prompt:`Tap <b>any</b> element in <b>Group ${g}</b>.`,explain:`Group ${g} is the ${['','','second','third','fourth','fifth','sixth'][g]} column you count: ${es.map(x=>x.name).join(', ')}.`,tag:'Groups and periods'};},
  ()=>{const p=pick([2,3]),k=pick(['metal','nonmetal']),es=E.filter(x=>x.period===p&&x.kind===k);return {kind:'place',target:es.map(x=>x.sym),label:'symz',prompt:`Tap <b>any ${k==='metal'?'metal':'non-metal'}</b> in <b>period ${p}</b>.`,explain:`${k==='metal'?'Metals':'Non-metals'} in period ${p}: ${es.map(x=>x.name).join(', ')}.${p===2?' Boron':' Silicon'} is a semi-metal, so it doesn’t count.`,tag:'Metals and non-metals'};}],
 groups:[
  ()=>{const g=pick([1,2,3,4,5,6,7,0]),pair=shuffle(notH.filter(x=>x.group===g)).slice(0,2);const right=pair.map(x=>x.name).join(' and ');
    const wrong=[];for(let t=0;t<40&&wrong.length<3;t++){const a=pick(notH),b=pick(notH.filter(x=>x.group!==a.group&&x!==a));const w=a.name+' and '+b.name;if(!wrong.includes(w))wrong.push(w);}
    return mcq(right,wrong,{prompt:'Which two elements are in the <b>same group</b>?',explain:`<b>${right}</b> are both in ${D.groupLabel(g)}.`,tag:'Groups and periods'});},
  ()=>{const e=pick(notH),same=E.filter(x=>x.period===e.period&&x!==e);if(!same.length)return EXTRA.groups[0]();const a=pick(same);
    return mcq(a.name,shuffle(E.filter(x=>x.period!==e.period)).map(x=>x.name),{prompt:`Which element is in the <b>same period</b> as ${e.name}?`,explain:`${e.name} is in period ${e.period}, and so is <b>${a.name}</b>. A period is a row.`,tag:'Groups and periods'});},
  ()=>{const g=pick([1,7,0]),e=pick(notH.filter(x=>x.group===g));return fixedMcq(['alkali metals','halogens','noble gases','transition metals'],D.GROUP_NAMES[g],{prompt:`${e.name} belongs to which family?`,explain:`${e.name} is in ${D.groupLabel(g)}: the <b>${D.GROUP_NAMES[g]}</b>.`,tag:'Group names'});}],
 metals:[
  ()=>{const want=pick(['nonmetal','metal']),odd=pick(E.filter(x=>x.kind===want)),rest=shuffle(E.filter(x=>x.kind===(want==='metal'?'nonmetal':'metal'))).slice(0,3);
    return fixedMcq(shuffle([odd,...rest]).map(x=>x.name),odd.name,{prompt:`Which one of these is a <b>${want==='metal'?'metal':'non-metal'}</b>?`,explain:`<b>${odd.name}</b> is the ${want==='metal'?'metal':'non-metal'}. ${rest.map(x=>x.name).join(', ')} are ${want==='metal'?'non-metals':'metals'}.`,tag:'Metals and non-metals'});},
  ()=>{const e=pick(E);const a=e.state==='gas'?'Gas':'Solid';return fixedMcq(['Solid','Liquid','Gas'],a,{prompt:`Is <b>${e.name}</b> a solid, liquid or gas at room temperature?`,explain:`${e.name} is a <b>${e.state}</b>.${e.state==='gas'?' The gases in the first 20 are H, He, N, O, F, Ne, Cl and Ar.':' None of the first 20 elements is a liquid at room temperature.'}`,tag:'States of the elements',big:true});},
  ()=>{const k=pick(['metal','nonmetal']);const n=E.filter(x=>x.kind===k).length;return mcq(String(n),[n+1,n-1,n+2,n-2,20-n].filter(x=>x>0&&x!==n).map(String),{prompt:`How many of the first 20 elements are <b>${k==='metal'?'metals':'non-metals'}</b>? (B and Si are semi-metals.)`,visual:table({label:'sym',colour:'kind',small:true,step:true}),explain:`Count them on the table: <b>${n}</b>.`,tag:'Metals and non-metals'});}],
 build:[],
 detective:[
  ()=>{const e=pick(notH);return mcq(D.groupLabel(e.group),[1,2,3,4,5,6,7,0].filter(g=>g!==e.group).map(D.groupLabel),{prompt:'Which <b>group</b> is this atom in?',visual:`<div class="bohrbox">${bohr(e.config)}</div>`,explain:`Count the outer shell: ${e.config[e.config.length-1]} electron${e.config[e.config.length-1]>1?'s':''}${e.group===0?' (full)':''} → <b>${D.groupLabel(e.group)}</b>. It’s ${e.name}.`,tag:'Reading shell diagrams'});},
  ()=>{const e=pick(E);return mcq('Period '+e.period,['Period 1','Period 2','Period 3','Period 4'].filter(p=>p!=='Period '+e.period),{prompt:'Which <b>period</b> is this atom in?',visual:`<div class="bohrbox">${bohr(e.config)}</div>`,explain:`Count the shells: ${e.config.length} → <b>period ${e.period}</b>. It’s ${e.name}.`,tag:'Reading shell diagrams'});}],
 links:[
  ()=>{const e=pick(E),o=e.config[e.config.length-1];return mcq(String(o),[1,2,3,4,5,6,7,8].filter(x=>x!==o).map(String),{prompt:`How many electrons are in the <b>outer shell</b> of ${e.name} (${D.cfg(e.config)})?`,explain:`The last number is the outer shell: <b>${o}</b>.${e.group?` That matches ${D.groupLabel(e.group)}.`:''}`,tag:'Electrons and position'});},
  ()=>{const e=pick(E),n=e.config.length;return mcq(String(n),['1','2','3','4','5'].filter(x=>x!==String(n)),{prompt:`How many <b>occupied shells</b> does an atom of ${e.name} have?`,explain:`${e.name} is in period ${e.period}, so <b>${n}</b> shell${n>1?'s':''} (${D.cfg(e.config)}).`,tag:'Electrons and position'});}],
 ions:[
  ()=>{const target=pick([[2,8],[2,8,8]]),t=D.cfg(target),gas=t==='2.8'?'neon':'argon';const right=Object.keys(D.IONS).filter(s=>D.cfg(ionCfgOf(s))===t),wrong=Object.keys(D.IONS).filter(s=>D.cfg(ionCfgOf(s))!==t);const a=pick(right);
    return mcq(ionStr(a),shuffle(wrong).map(ionStr),{prompt:`Which ion has the same electronic configuration as <b>${gas}</b> (${t})?`,explain:`${bySym[a].name} ${D.IONS[a]>0?'loses':'gains'} ${Math.abs(D.IONS[a])} electron${Math.abs(D.IONS[a])>1?'s':''} to become <b>${ionStr(a)}</b>, ${t}.`,tag:'Ion configurations',html:true});},
  ()=>{const s=pick(Object.keys(D.IONS)),e=bySym[s],q=D.IONS[s],n=e.z-q;return mcq(String(n),[e.z,e.z+q,n+1,n-1].filter(x=>x>0&&x!==n).map(String),{prompt:`How many <b>electrons</b> are in the ${ionStr(s)} ion?`,explain:`${e.name} has ${e.z} electrons as an atom. It ${q>0?'loses':'gains'} ${Math.abs(q)}, so the ion has <b>${n}</b>.`,tag:'Ion configurations'});}],
 atoms:[
  ()=>{const e=pick(E),nn=e.mass-e.z;return mcq(String(e.mass),[e.z,nn,e.mass+1,e.mass-1,e.z*2+1].filter(x=>x>0&&x!==e.mass).map(String),{prompt:`An atom has <b>${e.z} protons</b> and <b>${nn} neutrons</b>. What is its mass number?`,explain:`Mass number = protons + neutrons = ${e.z} + ${nn} = <b>${e.mass}</b>.`,tag:'Protons, neutrons, electrons'});},
  ()=>{const e=pick(E),nn=e.mass-e.z;const f=E.find(x=>x.z===nn&&x!==e);return mcq(e.name,(f?[f.name]:[]).concat(nearEls(e,4).map(x=>x.name)),{prompt:`An atom has <b>${e.z} protons</b> and <b>${nn} neutrons</b>. Which element is it?`,explain:`The number of protons decides the element: ${e.z} protons is <b>${e.name}</b>. Neutrons don’t change which element it is.`,tag:'Protons, neutrons, electrons'});}],
 mystery:[]};
ROUNDS.forEach(R=>{const ex=EXTRA[R.id];if(!ex||!ex.length)return;const base=R.gen,k=ex.length,share=k/(k+3);R.gen=function(){return Math.random()<share?pick(ex)():base.call(R);};});

/* ---------- no-repeat memory: avoid questions seen recently (kept in this browser) ---------- */
const MEM_KEY='el20:recent';let MEM={};try{MEM=JSON.parse(localStorage.getItem(MEM_KEY))||{};}catch(e){MEM={};}
const strip=x=>String(x||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const qkey=q=>strip(q.prompt)+'|'+(q.kind==='mcq'?strip(q.options[q.correct]):[].concat(q.target||'').join(',')+(q.el?q.el.sym:''))+'|'+(q.visual&&q.visual.includes('nuclide')?strip(q.visual):'');
function remember(id,k){const a=MEM[id]=(MEM[id]||[]).filter(x=>x!==k);a.push(k);if(a.length>60)a.splice(0,a.length-60);try{localStorage.setItem(MEM_KEY,JSON.stringify(MEM));}catch(e){}}
// one fresh question from a round: tries hard to avoid anything in the recent memory or this game
function fresh(id,game){const R=ROUNDS.find(r=>r.id===id),recent=new Set(MEM[id]||[]);let best=null;
  for(let t=0;t<80;t++){const q=R.gen(),k=qkey(q);if(game&&game.has(k))continue;if(!best)best={q,k};if(!recent.has(k)){best={q,k};break;}}
  if(!best){const q=R.gen();best={q,k:qkey(q)};}
  if(game)game.add(best.k);remember(id,best.k);best.q.round=id;return best.q;}
// Build a list of n questions for a round
function make(id,n,game){game=game||new Set();const out=[];for(let i=0;i<n;i++)out.push(fresh(id,game));return out;}
window.ER={ROUNDS,make,table,bohr,shuffle,pick,esc,chg};
})();
