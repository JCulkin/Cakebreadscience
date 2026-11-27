/* Cakebread Science lessons: chemistry components
   dc-explorer, dc-mol, dc-facts, dc-deck   covalent dot-and-cross (1g)
   ionic, ionic-explorer                    ionic dot-and-cross (1f)
   formula-builder                          ionic formulae (1f)
   nacl-lattice, ion-conduction             giant ionic lattice, conductivity (1f)
   particles, diffusion-tube, dilution, heating-curve   states of matter (1a)
   bp-chart                                 alkane boiling points (1g)
*/
(function(){
const L = window.Lesson = window.Lesson || {}; L.comps = L.comps || {};
const C = L.comps;
const $ = (s, r=document) => r.querySelector(s), $$ = (s, r=document) => [...r.querySelectorAll(s)];
const isDeck = el => !!el.closest('#stage');

/* ====================== covalent dot-and-cross ====================== */
const VAL = {H:1,C:4,N:5,O:6,F:7,Cl:7,Br:7};
const R = {H:42,C:52,N:52,O:52,F:52,Cl:56,Br:58};
const OV = 28;
const SPEC = {
 H2:{name:'Hydrogen',f:'H<sub>2</sub>',atoms:[['H','x','#4aa3ff'],['H','o','#4aa3ff']],tree:[[0,1,1,0]]},
 Cl2:{name:'Chlorine',f:'Cl<sub>2</sub>',atoms:[['Cl','x','#c03cc0'],['Cl','o','#c03cc0']],tree:[[0,1,1,0]]},
 HCl:{name:'Hydrogen chloride',f:'HCl',atoms:[['Cl','x','#8a9a9a'],['H','o','#4aa3ff']],tree:[[0,1,1,0]]},
 O2:{name:'Oxygen',f:'O<sub>2</sub>',atoms:[['O','x','#e04848'],['O','o','#e04848']],tree:[[0,1,2,0]]},
 N2:{name:'Nitrogen',f:'N<sub>2</sub>',atoms:[['N','x','#f0901c'],['N','o','#f0901c']],tree:[[0,1,3,0]]},
 H2O:{name:'Water',f:'H<sub>2</sub>O',atoms:[['O','x','#e04848'],['H','o','#4aa3ff'],['H','o','#4aa3ff']],tree:[[0,1,1,-135],[0,2,1,-45]]},
 NH3:{name:'Ammonia',f:'NH<sub>3</sub>',atoms:[['N','x','#f0901c'],['H','o','#4aa3ff'],['H','o','#4aa3ff'],['H','o','#4aa3ff']],tree:[[0,1,1,180],[0,2,1,0],[0,3,1,-90]]},
 CO2:{name:'Carbon dioxide',f:'CO<sub>2</sub>',atoms:[['C','x','#666'],['O','o','#e04848'],['O','o','#e04848']],tree:[[0,1,2,180],[0,2,2,0]]},
 CH4:{name:'Methane',f:'CH<sub>4</sub>',atoms:[['C','x','#666'],['H','o','#4aa3ff'],['H','o','#4aa3ff'],['H','o','#4aa3ff'],['H','o','#4aa3ff']],tree:[[0,1,1,180],[0,2,1,0],[0,3,1,-90],[0,4,1,90]]},
 C2H6:{name:'Ethane',f:'C<sub>2</sub>H<sub>6</sub>',atoms:[['C','x','#666'],['C','o','#666'],['H','o','#4aa3ff'],['H','o','#4aa3ff'],['H','o','#4aa3ff'],['H','x','#4aa3ff'],['H','x','#4aa3ff'],['H','x','#4aa3ff']],tree:[[0,1,1,0],[0,2,1,180],[0,3,1,-90],[0,4,1,90],[1,5,1,0],[1,6,1,-90],[1,7,1,90]]},
 C2H4:{name:'Ethene',f:'C<sub>2</sub>H<sub>4</sub>',atoms:[['C','x','#666'],['C','o','#666'],['H','o','#4aa3ff'],['H','o','#4aa3ff'],['H','x','#4aa3ff'],['H','x','#4aa3ff']],tree:[[0,1,2,0],[0,2,1,-125],[0,3,1,125],[1,4,1,-55],[1,5,1,55]]},
 CH3Cl:{name:'Chloromethane',f:'CH<sub>3</sub>Cl',atoms:[['C','x','#666'],['H','o','#4aa3ff'],['H','o','#4aa3ff'],['H','o','#4aa3ff'],['Cl','o','#8a9a9a']],tree:[[0,1,1,180],[0,2,1,0],[0,3,1,-90],[0,4,1,90]]},
};
const MOL = {};
for(const [k,m] of Object.entries(SPEC)){
  const pos=[[0,0]];
  m.tree.forEach(([p,c,n,ang])=>{const d=R[m.atoms[p][0]]+R[m.atoms[c][0]]-OV,t=ang*Math.PI/180;pos[c]=[pos[p][0]+d*Math.cos(t),pos[p][1]+d*Math.sin(t)];});
  MOL[k]={name:m.name,f:m.f,atoms:m.atoms.map((a,i)=>[a[0],pos[i][0],pos[i][1],a[1],a[2]]),bonds:m.tree.map(([p,c,n])=>[p,c,n])};
}
L.MOL = MOL;
function eMark(x,y,m,c,lw){
  lw=lw||1;
  if(m==='x'){const s=4.2;return `<g class="el" stroke="${c}" stroke-width="${2.6*Math.min(lw,1.3)}" stroke-linecap="round"><line x1="${x-s}" y1="${y-s}" x2="${x+s}" y2="${y+s}"/><line x1="${x-s}" y1="${y+s}" x2="${x+s}" y2="${y-s}"/></g>`;}
  return `<circle class="el" cx="${x}" cy="${y}" r="4.3" fill="${c}"/>`;
}
const sep=(p,q)=>Math.abs(Math.atan2(Math.sin(p-q),Math.cos(p-q)));
function bestAngles(used,n){
  const Cn=[...Array(8)].map((_,k)=>k*Math.PI/4); let best=[],bs=-1;
  const rec=(st,ch)=>{ if(ch.length===n){const all=[...used,...ch];let m=9;for(let x=0;x<all.length;x++)for(let y=x+1;y<all.length;y++)m=Math.min(m,sep(all[x],all[y]));if(m>bs+1e-9){bs=m;best=[...ch];}return;}
    for(let k=st;k<Cn.length;k++){ch.push(Cn[k]);rec(k+1,ch);ch.pop();} };
  rec(0,[]); return best;
}
function molSVG(key,lw){
  lw=lw||1; const M=MOL[key],A=M.atoms; let shells='',cores='',els='';
  const angs=A.map(()=>[]);
  M.bonds.forEach(([i,j,n])=>{
    const a=A[i],b=A[j],dx=b[1]-a[1],dy=b[2]-a[2],d=Math.hypot(dx,dy),ux=dx/d,uy=dy/d;
    const ra=R[a[0]],rb=R[b[0]],t=(d*d+ra*ra-rb*rb)/(2*d);
    const mx=a[1]+ux*t,my=a[2]+uy*t,px=-uy,py=ux,gap=12,total=2*n;
    for(let k=0;k<total;k++){const off=(k-(total-1)/2)*gap,own=k%2===0?a:b;els+=eMark(mx+px*off,my+py*off,own[3],'#111',lw);}
    angs[i].push(Math.atan2(dy,dx)); angs[j].push(Math.atan2(-dy,-dx));
  });
  const lpc=lonePairs(M);
  A.forEach((a,i)=>{ if(lpc[i]<=0) return; bestAngles(angs[i],lpc[i]).forEach(t=>{
      const r=R[a[0]],cx=a[1]+Math.cos(t)*r,cy=a[2]+Math.sin(t)*r,px=-Math.sin(t),py=Math.cos(t);
      els+=eMark(cx+px*6,cy+py*6,a[3],'#111',lw)+eMark(cx-px*6,cy-py*6,a[3],'#111',lw); }); });
  A.forEach(a=>{
    shells+=`<circle cx="${a[1]}" cy="${a[2]}" r="${R[a[0]]}" fill="none" stroke="#111" stroke-width="${1.6*lw}"/>`;
    cores+=`<circle cx="${a[1]}" cy="${a[2]}" r="${a[0]==='H'?11:16}" fill="${a[4]}"/><text x="${a[1]}" y="${a[2]+5.5}" text-anchor="middle" font-size="${a[0].length>1?14:16}" font-weight="700" fill="#fff" font-family="Barlow,Arial,sans-serif">${a[0]}</text>`;
  });
  const xs=A.map(a=>a[1]),ys=A.map(a=>a[2]),pad=66;
  const vb=[Math.min(...xs)-pad,Math.min(...ys)-pad,Math.max(...xs)-Math.min(...xs)+2*pad,Math.max(...ys)-Math.min(...ys)+2*pad];
  return `<svg viewBox="${vb.map(v=>v.toFixed(1)).join(' ')}" role="img" aria-label="Dot-and-cross diagram of ${M.name}">${shells}${cores}${els}</svg>`;
}
function lonePairs(M){return M.atoms.map((a,i)=>{const used=M.bonds.reduce((s,[p,q,n])=>s+((p===i||q===i)?n:0),0);return (VAL[a[0]]-used)/2;});}
function molFacts(key){
  const M=MOL[key],A=M.atoms,lpc=lonePairs(M);
  const pairs=M.bonds.reduce((s,b)=>s+b[2],0), lp=lpc.reduce((s,n)=>s+n,0);
  const types=[...new Set(M.bonds.map(b=>['','single','double','triple'][b[2]]))].join(' + ');
  const lines=[...new Set(A.map(a=>a[0]))].map(s=>{const i=A.findIndex(a=>a[0]===s);const share=M.bonds.reduce((t,[p,q,n])=>t+((p===i||q===i)?n:0),0);return `<b>${s}</b> has ${VAL[s]} outer electron${VAL[s]>1?'s':''}, shares ${share} pair${share>1?'s':''}, so ends with ${s==='H'?2:8}.`}).join('<br>');
  return {pairs,lp,types,lines,M};
}
L.molSVG=molSVG; L.molFacts=molFacts;
C['dc-mol'] = el => { el.innerHTML = molSVG(el.dataset.k, isDeck(el)?2.4:1); };
C['dc-facts'] = el => { const f=molFacts(el.dataset.k); el.innerHTML = `<b>${f.pairs}</b> shared pair${f.pairs>1?'s':''}<br>${f.types} bond${f.M.bonds.length>1?'s':''}<br><b>${f.lp}</b> lone pair${f.lp==1?'':'s'}`; };
C['dc-explorer'] = el => {
  const keys=(el.dataset.mols||Object.keys(MOL).join(',')).split(','); let hide=false, cur=keys[0];
  el.classList.add('tool');
  el.innerHTML=`<div class="bar">${keys.map(k=>`<button class="btn" data-k="${k}">${MOL[k].f}</button>`).join('')}</div><div class="body"><div class="pic"></div><div class="info"></div></div>`;
  const draw=()=>{ $$('.bar .btn',el).forEach(b=>b.classList.toggle('on',b.dataset.k===cur));
    const pic=$('.pic',el); pic.innerHTML=molSVG(cur); pic.classList.toggle('hidden-e',hide);
    const f=molFacts(cur);
    $('.info',el).innerHTML=`<h4>${f.M.name}<small>${f.M.f}</small></h4><dl class="facts"><dt>Shared pairs</dt><dd>${f.pairs}</dd><dt>Bond type</dt><dd>${f.types} covalent</dd><dt>Lone pairs</dt><dd>${f.lp}</dd></dl><div class="why">${f.lines}</div><div style="margin-top:10px"><button class="btn tog">${hide?'Show electrons':'Hide electrons (draw it yourself first)'}</button></div>`;
    $('.tog',el).onclick=()=>{hide=!hide;draw();}; };
  $$('.bar .btn',el).forEach(b=>b.onclick=()=>{cur=b.dataset.k;draw();}); draw();
};
C['dc-deck'] = el => {   // explorer for projector slides
  const keys=(el.dataset.mols||Object.keys(MOL).join(',')).split(',');
  el.style.cssText+='display:flex;flex-direction:column;flex:1;min-height:0';
  el.innerHTML=`<div class="btns">${keys.map((k,i)=>`<button data-k="${k}" class="${i?'':'on'}">${MOL[k].f}</button>`).join('')}</div><div class="fig" style="flex:1">${molSVG(keys[0],2.4)}</div>`;
  $$('button',el).forEach(b=>b.onclick=()=>{$$('button',el).forEach(x=>x.classList.toggle('on',x===b));$('.fig',el).innerHTML=molSVG(b.dataset.k,2.4);});
};

/* ====================== ionic dot-and-cross ====================== */
const EL = { Li:{g:1,c:'#b04dd8',n:'lithium'}, Na:{g:1,c:'#b04dd8',n:'sodium'}, K:{g:1,c:'#b04dd8',n:'potassium'},
  Mg:{g:2,c:'#3b8f5a',n:'magnesium'}, Ca:{g:2,c:'#3b8f5a',n:'calcium'}, Al:{g:3,c:'#7a7a7a',n:'aluminium'},
  N:{g:5,c:'#f0901c',n:'nitrogen',ion:'nitride'}, O:{g:6,c:'#e04848',n:'oxygen',ion:'oxide'}, S:{g:6,c:'#c9a000',n:'sulfur',ion:'sulfide'},
  F:{g:7,c:'#2a9d8f',n:'fluorine',ion:'fluoride'}, Cl:{g:7,c:'#2a9d8f',n:'chlorine',ion:'chloride'}, Br:{g:7,c:'#a0522d',n:'bromine',ion:'bromide'} };
const IONIC = {
  NaCl:{f:'NaCl',name:'Sodium chloride',atoms:[['Na',0,0],['Cl',1,0]]},
  NaF:{f:'NaF',name:'Sodium fluoride',atoms:[['Na',0,0],['F',1,0]]},
  LiF:{f:'LiF',name:'Lithium fluoride',atoms:[['Li',0,0],['F',1,0]]},
  KBr:{f:'KBr',name:'Potassium bromide',atoms:[['K',0,0],['Br',1,0]]},
  MgO:{f:'MgO',name:'Magnesium oxide',atoms:[['Mg',0,0],['O',1,0]]},
  CaS:{f:'CaS',name:'Calcium sulfide',atoms:[['Ca',0,0],['S',1,0]]},
  CaCl2:{f:'CaCl<sub>2</sub>',name:'Calcium chloride',atoms:[['Cl',-1,0],['Ca',0,0],['Cl',1,0]]},
  MgCl2:{f:'MgCl<sub>2</sub>',name:'Magnesium chloride',atoms:[['Cl',-1,0],['Mg',0,0],['Cl',1,0]]},
  Na2O:{f:'Na<sub>2</sub>O',name:'Sodium oxide',atoms:[['Na',-1,0],['O',0,0],['Na',1,0]]},
  Li3N:{f:'Li<sub>3</sub>N',name:'Lithium nitride',atoms:[['Li',-1,0],['N',0,0],['Li',1,0],['Li',0,-1]]},
  AlF3:{f:'AlF<sub>3</sub>',name:'Aluminium fluoride',atoms:[['F',-1,0],['Al',0,0],['F',1,0],['F',0,1]]},
};
L.IONIC = IONIC;
const SLOT = [-90,0,90,180].flatMap(a=>[a-10,a+10]).map(a=>a*Math.PI/180); // 8 slots: pairs at N,E,S,W
const ORDER = [0,2,4,6,1,3,5,7]; // singles first, then pair up
function ionicPlan(key){
  const cpd=IONIC[key], SP=150, Rs=50;
  const atoms=cpd.atoms.map(([s,x,y])=>({s, x:x*SP, y:y*SP, metal:EL[s].g<=3, g:EL[s].g}));
  atoms.forEach(a=>{ a.need = a.metal ? 0 : 8-a.g; a.give = a.metal ? a.g : 0; });
  const transfers=[];
  atoms.filter(a=>a.metal).forEach(m=>{ for(let k=0;k<m.give;k++){
    const t=atoms.filter(a=>!a.metal&&a.need>0).sort((p,q)=>Math.hypot(p.x-m.x,p.y-m.y)-Math.hypot(q.x-m.x,q.y-m.y))[0];
    t.need--; transfers.push({from:m,to:t}); } });
  // place slots
  atoms.forEach(a=>{ a.slots=new Array(8).fill(null); });
  transfers.forEach(tr=>{
    const m=tr.from, t=tr.to;
    const dirM=Math.atan2(t.y-m.y,t.x-m.x), dirT=Math.atan2(m.y-t.y,m.x-t.x);
    const pick=(a,dir)=>{ let best=-1,bd=9; for(let i=0;i<8;i++){ if(a.slots[i]) continue; const d=sep(SLOT[i],dir); if(d<bd-1e-6){bd=d;best=i;} } return best; };
    tr.fs=pick(m,dirM); m.slots[tr.fs]='give';
    tr.ts=pick(t,dirT); t.slots[tr.ts]='gain';
  });
  atoms.filter(a=>!a.metal).forEach(a=>{ let n=a.g; for(const i of ORDER){ if(n<=0) break; if(!a.slots[i]){ a.slots[i]='own'; n--; } } });
  return {cpd, atoms, transfers, Rs};
}
function ionicSVG(key, view, opt){
  opt=opt||{}; const lw=opt.lw||1; const {cpd,atoms,transfers,Rs}=ionicPlan(key);
  const pos=(a,i)=>[a.x+Math.cos(SLOT[i])*Rs, a.y+Math.sin(SLOT[i])*Rs];
  let s='';
  const xMark=(x,y)=>eMark(x,y,'x','#111',lw), oMark=(x,y)=>eMark(x,y,'o','#111',lw);
  const charge=a=>{ const q=a.metal?a.g:8-a.g; return (q>1?q:'')+(a.metal?'+':'−'); };
  atoms.forEach(a=>{
    const col=EL[a.s].c;
    if(view==='before'){
      s+=`<circle cx="${a.x}" cy="${a.y}" r="${Rs}" fill="none" stroke="#111" stroke-width="${1.6*lw}"/>`;
      s+=`<circle cx="${a.x}" cy="${a.y}" r="17" fill="${col}"/><text x="${a.x}" y="${a.y+5.5}" text-anchor="middle" font-size="${a.s.length>1?14:17}" font-weight="700" fill="#fff" font-family="Barlow,Arial,sans-serif">${a.s}</text>`;
      a.slots.forEach((t,i)=>{ if(!t||t==='gain') return; const [x,y]=pos(a,i); s+= a.metal?xMark(x,y):oMark(x,y); });
    } else {
      const r = a.metal ? 24 : Rs, br = r+12;
      if(!a.metal) s+=`<circle cx="${a.x}" cy="${a.y}" r="${Rs}" fill="none" stroke="#111" stroke-width="${1.6*lw}"/>`;
      s+=`<circle cx="${a.x}" cy="${a.y}" r="17" fill="${col}"/><text x="${a.x}" y="${a.y+5.5}" text-anchor="middle" font-size="${a.s.length>1?14:17}" font-weight="700" fill="#fff" font-family="Barlow,Arial,sans-serif">${a.s}</text>`;
      if(!a.metal) a.slots.forEach((t,i)=>{ const [x,y]=pos(a,i); s+= t==='gain'?xMark(x,y):oMark(x,y); });
      const L0=a.x-br, R0=a.x+br, T=a.y-br, B=a.y+br, k=8;
      s+=`<path d="M${L0+k} ${T}H${L0}V${B}H${L0+k}M${R0-k} ${T}H${R0}V${B}H${R0-k}" fill="none" stroke="#111" stroke-width="${2.2*lw}"/>`;
      s+=`<text x="${R0+4}" y="${T+4}" font-size="${a.metal?20:22}" font-weight="700" font-family="Barlow,Arial,sans-serif" fill="#111">${charge(a)}</text>`;
    }
  });
  if(view==='before'){
    let ar='';
    transfers.forEach(tr=>{ const [x1,y1]=pos(tr.from,tr.fs), [x2,y2]=pos(tr.to,tr.ts);
      const mx=(x1+x2)/2, my=(y1+y2)/2, dx=x2-x1, dy=y2-y1, d=Math.hypot(dx,dy)||1, off=Math.min(40,d*0.35);
      const cx=mx-dy/d*off, cy=my+dx/d*off;
      ar+=`<path d="M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}" fill="none" stroke="var(--acc,#8c0013)" stroke-width="${2.4*lw}" marker-end="url(#ah-${opt.uid})"/>`;
      ar+=`<g opacity=".55">${xMark(x2,y2)}</g>`; });
    s+=`<g class="arrows"${opt.arrowStep?` data-s="${opt.arrowStep}"`:''}>${ar}</g>`;
  }
  const xs=atoms.map(a=>a.x), ys=atoms.map(a=>a.y), pad=Rs+42;
  const vb=[Math.min(...xs)-pad, Math.min(...ys)-pad, Math.max(...xs)-Math.min(...xs)+2*pad+16, Math.max(...ys)-Math.min(...ys)+2*pad];
  return `<svg viewBox="${vb.join(' ')}" role="img" aria-label="${cpd.name} ${view==='before'?'atoms before electron transfer':'ions after electron transfer'}"><defs><marker id="ah-${opt.uid}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--acc,#8c0013)"/></marker></defs>${s}</svg>`;
}
let uidN=0;
function ionicFacts(key){
  const {cpd,atoms}=ionicPlan(key); const m=atoms.find(a=>a.metal), n=atoms.find(a=>!a.metal);
  const nm=atoms.filter(a=>a.metal).length, nn=atoms.filter(a=>!a.metal).length;
  const q=k=>(k>1?k:'');
  return {cpd, lines:`<b>${EL[m.s].n[0].toUpperCase()+EL[m.s].n.slice(1)}</b> (Group ${m.g}) loses ${m.g} electron${m.g>1?'s':''} → ${m.s}<sup>${q(m.g)}+</sup><br><b>${EL[n.s].n[0].toUpperCase()+EL[n.s].n.slice(1)}</b> (Group ${n.g}) gains ${8-n.g} electron${8-n.g>1?'s':''} → ${n.s}<sup>${q(8-n.g)}−</sup><br>${nm} ${m.s}<sup>${q(m.g)}+</sup> : ${nn} ${n.s}<sup>${q(8-n.g)}−</sup> balances the charges (${nm*m.g}+ and ${nn*(8-n.g)}−).`};
}
L.ionicSVG=ionicSVG;
C['ionic'] = el => { const deck=isDeck(el); el.innerHTML = ionicSVG(el.dataset.k, el.dataset.view||'after', {lw:deck?2:1, uid:'i'+(uidN++), arrowStep:el.dataset.arrowStep}); };
C['ionic-explorer'] = el => {
  const keys=(el.dataset.cpds||Object.keys(IONIC).join(',')).split(','); let cur=keys[0], view='before';
  el.classList.add('tool');
  el.innerHTML=`<div class="bar">${keys.map(k=>`<button class="btn" data-k="${k}">${IONIC[k].f}</button>`).join('')}</div><div class="body"><div class="pic"></div><div class="info"></div></div>`;
  const draw=()=>{ $$('.bar .btn',el).forEach(b=>b.classList.toggle('on',b.dataset.k===cur));
    $('.pic',el).innerHTML=ionicSVG(cur,view,{uid:'e'+(uidN++)}); const f=ionicFacts(cur);
    $('.info',el).innerHTML=`<h4>${f.cpd.name}<small>${f.cpd.f}</small></h4><div style="display:flex;gap:6px;margin:10px 0"><button class="btn v1 ${view==='before'?'on':''}">1 · Atoms</button><button class="btn v2 ${view==='after'?'on':''}">2 · Ions</button></div><div class="why">${f.lines}</div><p style="font-size:14px;color:#555;margin-top:8px">${view==='before'?'Arrows show electrons moving from the metal to the non-metal.':'Crosses (×) show electrons that came from the metal. Outer shells only.'}</p>`;
    $('.v1',el).onclick=()=>{view='before';draw();}; $('.v2',el).onclick=()=>{view='after';draw();}; };
  $$('.bar .btn',el).forEach(b=>b.onclick=()=>{cur=b.dataset.k;view='before';draw();}); draw();
};

/* ====================== ionic formula builder ====================== */
const CAT = [['Na','+',1,'sodium'],['K','+',1,'potassium'],['Li','+',1,'lithium'],['H','+',1,'hydrogen'],['NH4','+',1,'ammonium',1],['Ag','+',1,'silver'],
  ['Mg','2+',2,'magnesium'],['Ca','2+',2,'calcium'],['Ba','2+',2,'barium'],['Cu','2+',2,'copper(II)'],['Fe','2+',2,'iron(II)'],['Zn','2+',2,'zinc'],['Pb','2+',2,'lead(II)'],
  ['Fe','3+',3,'iron(III)'],['Al','3+',3,'aluminium']];
const AN = [['Cl','−',1,'chloride'],['Br','−',1,'bromide'],['I','−',1,'iodide'],['F','−',1,'fluoride'],['OH','−',1,'hydroxide',1],['NO3','−',1,'nitrate',1],
  ['O','2−',2,'oxide'],['S','2−',2,'sulfide'],['SO4','2−',2,'sulfate',1],['CO3','2−',2,'carbonate',1],['N','3−',3,'nitride']];
const subs = s => s.replace(/(\d+)/g,'<sub>$1</sub>');
const ionHTML = i => `${subs(i[0])}<sup>${i[1]}</sup>`;
function formula(c,a){ const g=(x,y)=>y?g(y,x%y):x, l=c[2]*a[2]/g(c[2],a[2]), nc=l/c[2], na=l/a[2];
  const part=(i,n)=> n===1 ? subs(i[0]) : (i[4] ? `(${subs(i[0])})<sub>${n}</sub>` : subs(i[0])+`<sub>${n}</sub>`);
  return {html:part(c,nc)+part(a,na), nc, na, l, name:`${c[3]} ${a[3]}`}; }
function wrongFormulas(c,a,right){
  const out=new Set(); const p=(i,n)=> n===1?subs(i[0]):(i[4]?`(${subs(i[0])})<sub>${n}</sub>`:subs(i[0])+`<sub>${n}</sub>`), pnb=(i,n)=> n===1?subs(i[0]):subs(i[0])+`<sub>${n}</sub>`;
  out.add(p(c,1)+p(a,1)); out.add(p(c,a[2])+p(a,c[2])); out.add(p(c,right.na)+p(a,right.nc)); out.add(pnb(c,right.nc)+pnb(a,right.na)); out.add(p(c,c[2])+p(a,a[2]));
  out.delete(right.html); return [...out];
}
C['formula-builder'] = el => {
  el.classList.add('tool'); let ci=6, ai=0, mode='build';
  el.innerHTML=`<div class="bar"><span class="lbl">Positive ion</span>${CAT.map((c,i)=>`<button class="btn c" data-i="${i}">${ionHTML(c)}</button>`).join('')}</div>
   <div class="bar"><span class="lbl">Negative ion</span>${AN.map((a,i)=>`<button class="btn a" data-i="${i}">${ionHTML(a)}</button>`).join('')}</div>
   <div style="padding:16px" class="fbout"></div>
   <div class="bar" style="border-top:2px solid var(--ink);border-bottom:0"><button class="btn quiz">Test me: pick the right formula</button></div>`;
  const out=$('.fbout',el);
  const tile=(t,ch,n,cls)=>`<span style="display:inline-block;border:2px solid #111;padding:4px 8px;margin:3px;background:${cls==='c'?'#ffe1e4':'#dceefe'};font-weight:700">${t}<span style="margin-left:6px;letter-spacing:2px;color:${cls==='c'?'#c8001e':'#0b4f8a'}">${ch.repeat(n)}</span></span>`;
  const draw=()=>{
    $$('.btn.c',el).forEach(b=>b.classList.toggle('on',+b.dataset.i===ci)); $$('.btn.a',el).forEach(b=>b.classList.toggle('on',+b.dataset.i===ai));
    const c=CAT[ci], a=AN[ai], f=formula(c,a);
    out.innerHTML=`<div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center"><div style="font:900 52px 'Barlow Condensed',Arial Narrow,sans-serif">${f.html}</div><div style="font-size:18px">${f.name}</div></div>
     <div style="margin-top:10px">${Array(f.nc).fill(tile(ionHTML(c),'+',c[2],'c')).join('')}</div>
     <div>${Array(f.na).fill(tile(ionHTML(a),'−',a[2],'a')).join('')}</div>
     <div class="why" style="margin-top:10px">${f.nc} × ${c[2]}+ = <b>${f.l}+</b> and ${f.na} × ${a[2]}− = <b>${f.l}−</b>. The charges cancel, so the compound is neutral.${(c[4]&&f.nc>1)||(a[4]&&f.na>1)?' Brackets are needed because there is more than one of a polyatomic ion.':''}</div>`;
  };
  const quiz=()=>{
    ci=Math.floor(Math.random()*CAT.length); ai=Math.floor(Math.random()*AN.length); const c=CAT[ci], a=AN[ai], f=formula(c,a);
    if(c[0]==='H'&&a[0]==='OH'){ return quiz(); }
    const opts=[f.html,...wrongFormulas(c,a,f).sort(()=>Math.random()-.5).slice(0,3)].sort(()=>Math.random()-.5);
    $$('.btn.c,.btn.a',el).forEach(b=>b.classList.remove('on'));
    out.innerHTML=`<div style="font-size:20px;font-weight:700">What is the formula of <span style="color:var(--acc)">${f.name}</span>?</div><div style="font-size:16px;color:#555">Ions: ${ionHTML(c)} and ${ionHTML(a)}</div>
      <div class="qopts" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">${opts.map(o=>`<button class="btn" style="font-size:24px;padding:6px 16px">${o}</button>`).join('')}</div><div class="fb" style="margin-top:8px;font-weight:600"></div>`;
    $$('.qopts .btn',out).forEach(b=>b.onclick=()=>{ const ok=b.innerHTML===f.html; b.style.background=ok?'#e3f4e8':'#fde8eb'; b.style.borderColor=ok?'#005e22':'#c8001e';
      $('.fb',out).innerHTML=ok?'Correct! <button class="btn nx">Next</button>':`Not quite. ${f.html} is right: ${f.nc} × ${c[2]}+ balances ${f.na} × ${a[2]}−. <button class="btn nx">Next</button>`; $('.nx',out).onclick=quiz; });
  };
  $$('.btn.c',el).forEach(b=>b.onclick=()=>{ci=+b.dataset.i;draw();}); $$('.btn.a',el).forEach(b=>b.onclick=()=>{ai=+b.dataset.i;draw();});
  $('.quiz',el).onclick=quiz; draw();
};

/* ====================== giant ionic lattice ====================== */
C['nacl-lattice'] = el => {
  const n=+(el.dataset.n||4), s=58, out=[];
  const P=(x,y,z)=>[ (x-z)*s*0.87, (x+z)*s*0.5 - y*s ];
  for(let y=0;y<n;y++) for(let z=0;z<n;z++) for(let x=0;x<n;x++) out.push([x,y,z]);
  out.sort((a,b)=>(a[0]+a[2]-a[1]*0.01)-(b[0]+b[2]-b[1]*0.01) || a[1]-b[1]);
  let lines='', balls='';
  const lineOf=(a,b)=>{const p=P(...a),q=P(...b);return `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}"/>`;};
  for(let y=0;y<n;y++) for(let z=0;z<n;z++) for(let x=0;x<n;x++){ if(x<n-1) lines+=lineOf([x,y,z],[x+1,y,z]); if(y<n-1) lines+=lineOf([x,y,z],[x,y+1,z]); if(z<n-1) lines+=lineOf([x,y,z],[x,y,z+1]); }
  // draw back-to-front: smaller x+z drawn first, higher y later
  out.sort((a,b)=>(a[0]+a[2])-(b[0]+b[2]) || a[1]-b[1]);
  out.forEach(([x,y,z])=>{ const [px,py]=P(x,y,z), na=(x+y+z)%2===0;
    balls+= na ? `<circle cx="${px}" cy="${py}" r="13" fill="#b04dd8" stroke="#111" stroke-width="1.5"/><text x="${px}" y="${py+5}" text-anchor="middle" font-size="15" font-weight="700" fill="#fff" font-family="Barlow,Arial,sans-serif">+</text>`
      : `<circle cx="${px}" cy="${py}" r="21" fill="#2a9d8f" stroke="#111" stroke-width="1.5"/><text x="${px}" y="${py+6}" text-anchor="middle" font-size="19" font-weight="700" fill="#fff" font-family="Barlow,Arial,sans-serif">−</text>`; });
  const xs=out.map(p=>P(...p)[0]), ys=out.map(p=>P(...p)[1]);
  const vb=[Math.min(...xs)-30,Math.min(...ys)-30,Math.max(...xs)-Math.min(...xs)+60,Math.max(...ys)-Math.min(...ys)+60];
  el.innerHTML=`<svg ${isDeck(el)?'':'style="max-height:340px;width:100%"'} viewBox="${vb.join(' ')}" role="img" aria-label="Giant ionic lattice of sodium chloride: alternating positive sodium ions and negative chloride ions in a cube"><g stroke="#999" stroke-width="2">${lines}</g>${balls}</svg>`;
};

/* ====================== particle simulations ====================== */
function canvasFor(el, w, h){ const c=document.createElement('canvas'); c.width=w; c.height=h; c.className='particles'; el.appendChild(c); return c; }
const STATES = { solid:{k:0.08,g:0,v:0.35}, liquid:{k:0,g:0.12,v:1.6}, gas:{k:0,g:0,v:5.5} };
const CHANGE = { 'solid>liquid':'Melting','liquid>gas':'Boiling / evaporating','gas>liquid':'Condensing','liquid>solid':'Freezing','solid>gas':'Sublimation','gas>solid':'Deposition' };
C['particles'] = el => {
  const W=380, H=320, r=15, cols=6, rows=6, N=cols*rows;
  const controls=el.dataset.controls!=='0', deck=isDeck(el);
  el.style.position='relative';
  if(controls) el.insertAdjacentHTML('beforeend', `<div class="pbtns" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">${['solid','liquid','gas'].map(s=>`<button class="btn" data-st="${s}" style="${deck?'font-size:30px;padding:6px 16px;border-width:4px':''}">${s[0].toUpperCase()+s.slice(1)}</button>`).join('')}<span class="chg" style="font-weight:700;color:var(--acc);align-self:center;${deck?'font-size:34px;':'font-size:18px;'}margin-left:8px"></span></div>`);
  const cv=canvasFor(el,W,H), ctx=cv.getContext('2d');
  if(deck){ cv.style.width='100%'; cv.style.height='auto'; cv.style.border='5px solid #111'; } else { cv.style.border='2px solid #111'; if(controls){ cv.style.maxWidth='440px'; cv.style.margin='0 auto'; } }
  let state=el.dataset.state||'solid';
  const sites=[]; const ox=(W-cols*2*r)/2+r, oy=H-rows*2*r+r-2;
  for(let j=0;j<rows;j++) for(let i=0;i<cols;i++) sites.push([ox+i*2*r, oy+j*2*r]);
  const P=sites.map(([x,y])=>({x,y,vx:(Math.random()-.5),vy:(Math.random()-.5)}));
  if(state==='gas') P.forEach(p=>{p.x=r+Math.random()*(W-2*r);p.y=r+Math.random()*(H-2*r);});
  const setState=s=>{ const ch=CHANGE[state+'>'+s]; state=s; if(controls){ $$('.pbtns .btn',el).forEach(b=>b.classList.toggle('on',b.dataset.st===s)); $('.chg',el).textContent=ch?('→ '+ch+(['Melting','Boiling / evaporating','Sublimation'].includes(ch)?' (energy in)':' (energy out)')):''; } };
  if(controls) $$('.pbtns .btn',el).forEach(b=>b.onclick=()=>setState(b.dataset.st));
  setState(state); if(controls) $('.chg',el).textContent='';
  el._setState=setState;
  function step(){
    const S=STATES[state];
    P.forEach((p,i)=>{ if(S.k){ p.vx+=(sites[i][0]-p.x)*S.k; p.vy+=(sites[i][1]-p.y)*S.k; p.vx*=0.82; p.vy*=0.82; p.vx+=(Math.random()-.5)*S.v; p.vy+=(Math.random()-.5)*S.v; }
      else { p.vy+=S.g; } });
    for(let a=0;a<N;a++) for(let b=a+1;b<N;b++){ const p=P[a],q=P[b],dx=q.x-p.x,dy=q.y-p.y,d=Math.hypot(dx,dy); if(d<2*r&&d>0.01){ const o=(2*r-d)/2,nx=dx/d,ny=dy/d; p.x-=nx*o;p.y-=ny*o;q.x+=nx*o;q.y+=ny*o;
        if(!S.k){ const rv=(q.vx-p.vx)*nx+(q.vy-p.vy)*ny; if(rv<0){ p.vx+=rv*nx;p.vy+=rv*ny;q.vx-=rv*nx;q.vy-=rv*ny; } } } }
    if(!S.k){ let e=0; P.forEach(p=>e+=p.vx*p.vx+p.vy*p.vy); const f=Math.sqrt(S.v*S.v*N/(e||1)); const blend=0.12; P.forEach(p=>{ p.vx*=1+(f-1)*blend; p.vy*=1+(f-1)*blend; if(state==='liquid'){p.vx+=(Math.random()-.5)*0.6;p.vy+=(Math.random()-.5)*0.6;} }); }
    P.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; if(p.x<r){p.x=r;p.vx=Math.abs(p.vx);} if(p.x>W-r){p.x=W-r;p.vx=-Math.abs(p.vx);} if(p.y<r){p.y=r;p.vy=Math.abs(p.vy);} if(p.y>H-r){p.y=H-r;p.vy=-Math.abs(p.vy);} });
  }
  function draw(){ ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    P.forEach(p=>{ ctx.beginPath(); ctx.arc(p.x,p.y,r-1,0,7); ctx.fillStyle='#4aa3ff'; ctx.fill(); ctx.lineWidth=2; ctx.strokeStyle='#0b4f8a'; ctx.stroke(); }); }
  let vis=true; const io=new IntersectionObserver(es=>{vis=es[0].isIntersecting;}); io.observe(cv);
  (function loop(){ if(vis&&cv.offsetParent!==null){ step(); step(); draw(); } requestAnimationFrame(loop); })();
};

C['diffusion-tube'] = el => {
  const W=900, H=190, deck=isDeck(el), tube={x0:70,x1:830,y0:60,y1:130};
  el.insertAdjacentHTML('beforeend', `<div style="display:flex;gap:8px;margin-bottom:8px;align-items:center"><button class="btn go" style="${deck?'font-size:30px;padding:6px 16px;border-width:4px':''}">▶ Start</button><button class="btn rs" style="${deck?'font-size:30px;padding:6px 16px;border-width:4px':''}">Reset</button><span class="msg" style="font-weight:700;color:var(--acc);${deck?'font-size:32px':''}"></span></div>`);
  const cv=canvasFor(el,W,H), ctx=cv.getContext('2d'); cv.style.border=deck?'5px solid #111':'2px solid #111';
  let A=[], B=[], ring=[], running=false, t=0;
  const reset=()=>{ A=[];B=[];ring=[];t=0;running=false; $('.msg',el).textContent=''; $('.go',el).textContent='▶ Start'; draw(); };
  const spawn=()=>{ for(let i=0;i<2;i++){ A.push({x:tube.x0+8,y:tube.y0+8+Math.random()*(tube.y1-tube.y0-16)}); B.push({x:tube.x1-8,y:tube.y0+8+Math.random()*(tube.y1-tube.y0-16)}); } };
  const walk=(p,s)=>{ p.x+=(Math.random()-.5)*s*2; p.y+=(Math.random()-.5)*s*2; p.x=Math.max(tube.x0+4,Math.min(tube.x1-4,p.x)); p.y=Math.max(tube.y0+4,Math.min(tube.y1-4,p.y)); };
  function step(){ if(t<500) spawn(); t++;
    A.forEach(p=>walk(p,9.0)); B.forEach(p=>walk(p,6.1));   // speed ∝ 1/√M : NH3 (17) vs HCl (36.5)
    for(let i=A.length-1;i>=0;i--){ const a=A[i]; const j=B.findIndex(b=>Math.abs(b.x-a.x)<7&&Math.abs(b.y-a.y)<14); if(j>=0){ ring.push({x:(a.x+B[j].x)/2,y:a.y}); A.splice(i,1); B.splice(j,1);
      if(ring.length===12){ const fr=(ring[0].x-tube.x0)/(tube.x1-tube.x0); $('.msg',el).textContent=`White ring forms ${Math.round(fr*100)}% of the way along: closer to the HCl end.`; } } }
  }
  function draw(){ ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#f3f3f3'; ctx.fillRect(tube.x0,tube.y0,tube.x1-tube.x0,tube.y1-tube.y0); ctx.strokeStyle='#111'; ctx.lineWidth=3; ctx.strokeRect(tube.x0,tube.y0,tube.x1-tube.x0,tube.y1-tube.y0);
    ctx.fillStyle='#ddd'; ctx.fillRect(tube.x0-40,tube.y0-6,40,tube.y1-tube.y0+12); ctx.fillRect(tube.x1,tube.y0-6,40,tube.y1-tube.y0+12);
    ctx.font='bold 20px Barlow, Arial'; ctx.fillStyle='#111'; ctx.textAlign='left'; ctx.fillText('cotton wool soaked in ammonia, NH₃ (Mr 17)',tube.x0-40,40); ctx.textAlign='right'; ctx.fillText('hydrochloric acid, HCl (Mr 36.5)',tube.x1+40,165);
    A.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,4,0,7);ctx.fillStyle='#4aa3ff';ctx.fill();});
    B.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,5,0,7);ctx.fillStyle='#e04848';ctx.fill();});
    ring.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,6,0,7);ctx.fillStyle='#fff';ctx.fill();ctx.lineWidth=1.5;ctx.strokeStyle='#777';ctx.stroke();});
  }
  $('.go',el).onclick=()=>{ running=!running; $('.go',el).textContent=running?'❚❚ Pause':'▶ Start'; };
  $('.rs',el).onclick=reset;
  (function loop(){ if(running&&cv.offsetParent!==null){ for(let k=0;k<3;k++) step(); draw(); } requestAnimationFrame(loop); })();
  reset();
};

C['dilution'] = el => {
  const n=5; let s='';
  for(let i=0;i<n;i++){ const x=20+i*150, a=Math.pow(0.42,i);
    s+=`<path d="M${x} 40 v120 q0 14 14 14 h82 q14 0 14 -14 v-120" fill="none" stroke="#111" stroke-width="3"/>`;
    s+=`<path d="M${x+2} 70 v90 q0 12 12 12 h82 q12 0 12 -12 v-90 z" fill="rgba(128,0,128,${a.toFixed(3)})"/>`;
    s+=`<text x="${x+55}" y="200" text-anchor="middle" font-size="16" font-family="Barlow,Arial,sans-serif" font-weight="700">${i===0?'start':'×10 dilution'}</text>`;
    if(i<n-1) s+=`<path d="M${x+118} 110 h24" stroke="#8c0013" stroke-width="3" marker-end="url(#dah)"/>`;
  }
  el.innerHTML=`<svg viewBox="0 0 760 215" role="img" aria-label="Five beakers of potassium manganate(VII) solution, each diluted ten times; the purple colour fades but is still visible"><defs><marker id="dah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#8c0013"/></marker></defs>${s}</svg>`;
};

C['heating-curve'] = el => {
  const steps = el.dataset.steps==='1'; const ds = i => steps?` data-s="${i}"`:'';
  const X=t=>70+t*6.2, Y=T=>300-(T+30)*1.45;
  const pts=[[0,-25],[10,0],[30,0],[50,100],[80,100],[88,125]];
  const path=pts.map((p,i)=>(i?'L':'M')+X(p[0])+' '+Y(p[1])).join('');
  const lbl=(t,T,txt,i,anchor='middle',dy=-12)=>`<text x="${X(t)}" y="${Y(T)+dy}" text-anchor="${anchor}" font-size="17" font-weight="700" font-family="Barlow,Arial,sans-serif"${ds(i)}>${txt}</text>`;
  el.innerHTML=`<svg viewBox="0 0 640 340" role="img" aria-label="Heating curve for water: temperature rises, stays flat at 0 °C while melting, rises, stays flat at 100 °C while boiling, then rises again">
   <line x1="70" y1="300" x2="620" y2="300" stroke="#111" stroke-width="2.5"/><line x1="70" y1="300" x2="70" y2="20" stroke="#111" stroke-width="2.5"/>
   <text x="600" y="325" text-anchor="end" font-size="15" font-family="Barlow,Arial,sans-serif">time (heating at a steady rate) →</text>
   <text x="20" y="160" font-size="15" font-family="Barlow,Arial,sans-serif" transform="rotate(-90 20 160)" text-anchor="middle">temperature / °C</text>
   <text x="62" y="${Y(0)+5}" text-anchor="end" font-size="14" font-family="Barlow,Arial,sans-serif">0</text><text x="62" y="${Y(100)+5}" text-anchor="end" font-size="14" font-family="Barlow,Arial,sans-serif">100</text>
   <line x1="70" x2="620" y1="${Y(0)}" y2="${Y(0)}" stroke="#bbb" stroke-dasharray="4 4"/><line x1="70" x2="620" y1="${Y(100)}" y2="${Y(100)}" stroke="#bbb" stroke-dasharray="4 4"/>
   <path d="${path}" fill="none" stroke="var(--acc,#8c0013)" stroke-width="5" stroke-linejoin="round"/>
   <text x="74" y="226" font-size="17" font-weight="700" font-family="Barlow,Arial,sans-serif"${ds(1)}>solid</text>${lbl(22,0,'melting: solid + liquid',2)}${lbl(40,50,'liquid',1,'end',0)}${lbl(65,100,'boiling: liquid + gas',3)}${lbl(88,125,'gas',1,'end',-10)}
   <text x="475" y="215" text-anchor="middle" font-size="14" fill="#555" font-family="Barlow,Arial,sans-serif"${ds(4)}>flat sections: energy breaks forces between particles,</text><text x="475" y="231" text-anchor="middle" font-size="14" fill="#555" font-family="Barlow,Arial,sans-serif"${ds(4)}>so the temperature stays constant</text>
  </svg>`;
};

C['ion-conduction'] = el => {
  const W=600,H=350, deck=isDeck(el); let state=el.dataset.state||'solid', on=false;
  const bs=deck?'font-size:28px;padding:6px 14px;border-width:4px':'';
  el.insertAdjacentHTML('beforeend', `<div class="ib" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;align-items:center">${[['solid','Solid'],['molten','Molten'],['aqueous','Dissolved in water']].map(([k,t])=>`<button class="btn st" data-st="${k}" style="${bs}">${t}</button>`).join('')}<button class="btn pw" style="${bs};margin-left:8px">🔋 Connect battery</button></div>`);
  const cv=canvasFor(el,W,H), ctx=cv.getContext('2d'); cv.style.border=deck?'5px solid #111':'2px solid #111';
  const box={x0:80,x1:520,y0:70,y1:310};
  const ions=[]; const n=5;
  for(let j=0;j<n;j++) for(let i=0;i<n*2-2;i++){ const plus=(i+j)%2===0; ions.push({q:plus?1:-1,sx:box.x0+70+i*38,sy:box.y0+50+j*38}); }
  ions.forEach(p=>{p.x=p.sx;p.y=p.sy;});
  const water=[...Array(70)].map(()=>({x:box.x0+10+Math.random()*(box.x1-box.x0-20),y:box.y0+10+Math.random()*(box.y1-box.y0-20)}));
  const upd=()=>{ $$('.st',el).forEach(b=>b.classList.toggle('on',b.dataset.st===state)); $('.pw',el).classList.toggle('on',on); };
  $$('.st',el).forEach(b=>b.onclick=()=>{state=b.dataset.st; if(state==='solid') ions.forEach(p=>{p.x=p.sx;p.y=p.sy;}); upd();});
  $('.pw',el).onclick=()=>{on=!on;upd();}; upd();
  const mobile=()=>state!=='solid';
  function step(){ ions.forEach(p=>{
      if(!mobile()){ p.x=p.sx+(Math.random()-.5)*3; p.y=p.sy+(Math.random()-.5)*3; return; }
      p.x+=(Math.random()-.5)*5 + (on? -p.q*1.1 : 0); p.y+=(Math.random()-.5)*5;
      const rr=p.q>0?9:13; p.x=Math.max(box.x0+18+rr,Math.min(box.x1-18-rr,p.x)); p.y=Math.max(box.y0+rr,Math.min(box.y1-rr,p.y)); });
    if(state==='aqueous') water.forEach(w=>{ w.x+=(Math.random()-.5)*6; w.y+=(Math.random()-.5)*6; w.x=Math.max(box.x0+20,Math.min(box.x1-20,w.x)); w.y=Math.max(box.y0+5,Math.min(box.y1-5,w.y)); });
  }
  function draw(){ ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle= state==='molten'?'#fff1e0': state==='aqueous'?'#eaf5ff':'#fafafa'; ctx.fillRect(box.x0,box.y0,box.x1-box.x0,box.y1-box.y0);
    ctx.strokeStyle='#111'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(box.x0,box.y0); ctx.lineTo(box.x0,box.y1); ctx.lineTo(box.x1,box.y1); ctx.lineTo(box.x1,box.y0); ctx.stroke();
    ctx.fillStyle='#555'; ctx.fillRect(box.x0+4,box.y0-30,14,box.y1-box.y0-10); ctx.fillRect(box.x1-18,box.y0-30,14,box.y1-box.y0-10);
    ctx.font='bold 22px Barlow, Arial'; ctx.fillStyle='#111'; ctx.textAlign='center'; ctx.fillText('−',box.x0+11,box.y0-36); ctx.fillText('+',box.x1-11,box.y0-36);
    // circuit + bulb
    const lit = on && mobile();
    ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(box.x0+11,box.y0-30); ctx.lineTo(box.x0+11,22); ctx.lineTo(W/2-24,22); ctx.moveTo(W/2+24,22); ctx.lineTo(box.x1-11,22); ctx.lineTo(box.x1-11,box.y0-30); ctx.stroke();
    if(lit){ ctx.beginPath(); ctx.arc(W/2,22,30,0,7); ctx.fillStyle='rgba(255,220,0,.45)'; ctx.fill(); }
    ctx.beginPath(); ctx.arc(W/2,22,15,0,7); ctx.fillStyle=lit?'#ffd400':'#eee'; ctx.fill(); ctx.stroke();
    if(!on){ ctx.fillStyle='#fff'; ctx.fillRect(W/2+60,14,40,16); }
    if(state==='aqueous') water.forEach(w=>{ ctx.beginPath(); ctx.arc(w.x,w.y,4,0,7); ctx.fillStyle='#9cc9f0'; ctx.fill(); });
    ions.forEach(p=>{ const rr=p.q>0?9:13; ctx.beginPath(); ctx.arc(p.x,p.y,rr,0,7); ctx.fillStyle=p.q>0?'#b04dd8':'#2a9d8f'; ctx.fill(); ctx.lineWidth=1.5; ctx.strokeStyle='#111'; ctx.stroke();
      ctx.fillStyle='#fff'; ctx.font='bold '+(p.q>0?13:17)+'px Arial'; ctx.textAlign='center'; ctx.fillText(p.q>0?'+':'−',p.x,p.y+(p.q>0?4.5:6)); });
    ctx.fillStyle='#111'; ctx.font='bold 18px Barlow, Arial'; ctx.textAlign='left';
    ctx.fillText(!on?'Battery off': lit?'Bulb lights: ions move to the electrodes':'Bulb off: ions are fixed in the lattice', 20, H-10);
  }
  (function loop(){ if(cv.offsetParent!==null){ step(); draw(); } requestAnimationFrame(loop); })();
};

/* ====================== charts ====================== */
C['bp-chart'] = el => {
  const deck=isDeck(el), fs=deck?1.45:1;
  const d=[['CH₄',16,-162],['C₂H₆',30,-89],['C₃H₈',44,-42],['C₄H₁₀',58,-1],['C₅H₁₂',72,36],['C₆H₁₄',86,69]];
  const x0=40,w=290,y0=28,h=150,min=-180,max=90,Y=v=>y0+h-(v-min)/(max-min)*h,zero=Y(0);
  let s=`<line x1="${x0}" x2="${x0+w}" y1="${zero}" y2="${zero}" stroke="#111"/><text x="${x0-4}" y="${zero+4}" text-anchor="end" font-size="${11*fs}">0 °C</text>`;
  d.forEach(([f,mr,bp],i)=>{const bw=34,x=x0+10+i*47,y=Math.min(Y(bp),zero),hh=Math.abs(Y(bp)-zero);
    s+=`<rect x="${x}" y="${y}" width="${bw}" height="${hh}" fill="${bp<0?'#4aa3ff':'#c8001e'}"/><text x="${x+bw/2}" y="${bp<0?y+hh+13*fs:y-4}" text-anchor="middle" font-size="${11*fs}" font-weight="700">${bp}</text><text x="${x+bw/2}" y="${y0+h+22*fs}" text-anchor="middle" font-size="${12*fs}">${f}</text><text x="${x+bw/2}" y="${y0+h+36*fs}" text-anchor="middle" font-size="${10*fs}" fill="#555">Mr ${mr}</text>`;});
  s+=`<text x="${x0+4}" y="${y0+4}" font-size="${11*fs}" fill="#555">boiling point / °C</text>`;
  el.innerHTML=`<svg viewBox="0 -6 340 ${232+(fs-1)*60}" role="img" aria-label="Boiling points of alkanes rise with relative molecular mass" font-family="Barlow,Arial,sans-serif">${s}</svg>`;
};
C['state-triangle'] = el => {
  const steps=el.dataset.steps==='1', ds=i=>steps?` data-s="${i}"`:'';
  const N={S:[150,330],L:[490,330],G:[320,70]};
  const node=(k,t)=>`<g><rect x="${N[k][0]-75}" y="${N[k][1]-34}" width="150" height="68" fill="#fff" stroke="#111" stroke-width="3"/><text x="${N[k][0]}" y="${N[k][1]+10}" text-anchor="middle" font-size="28" font-weight="900" font-family="Barlow Condensed,Arial Narrow,sans-serif">${t}</text></g>`;
  const arr=(a,b,off,txt,col,i,lx,ly,anc)=>{ const [x1,y1]=N[a],[x2,y2]=N[b],dx=x2-x1,dy=y2-y1,d=Math.hypot(dx,dy),ux=dx/d,uy=dy/d,px=-uy*off,py=ux*off;
    const sx=x1+ux*95+px, sy=y1+uy*55+py, ex=x2-ux*95+px, ey=y2-uy*55+py;
    return `<g${ds(i)}><line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="${col}" stroke-width="5" marker-end="url(#st-${col.slice(1)})"/><text x="${lx}" y="${ly}" text-anchor="${anc}" font-size="21" font-weight="700" fill="${col}" font-family="Barlow,Arial,sans-serif">${txt}</text></g>`; };
  const hot='#c8001e', cold='#0b4f8a';
  el.innerHTML=`<svg viewBox="0 0 640 400" role="img" aria-label="Changes of state: melting, freezing, boiling or evaporating, condensing, sublimation and deposition"><defs>${[hot,cold].map(c=>`<marker id="st-${c.slice(1)}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10z" fill="${c}"/></marker>`).join('')}</defs>
   ${arr('S','L',-14,'melting',hot,1,320,300,'middle')}${arr('L','S',-14,'freezing',cold,1,320,390,'middle')}
   ${arr('L','G',-14,'boiling / evaporating',hot,2,428,185,'start')}${arr('G','L',-14,'condensing',cold,2,428,212,'start')}
   ${arr('S','G',14,'sublimation',hot,3,212,185,'end')}${arr('G','S',14,'deposition',cold,3,212,212,'end')}
   ${node('S','SOLID')}${node('L','LIQUID')}${node('G','GAS')}
   <text x="12" y="24" font-size="17" font-weight="700" fill="${hot}" font-family="Barlow,Arial,sans-serif">red: heat energy in</text><text x="12" y="46" font-size="17" font-weight="700" fill="${cold}" font-family="Barlow,Arial,sans-serif">blue: heat energy out</text></svg>`;
};
/* ---- 1a: predict the state from melting and boiling points ---- */
const SUBST = [['Hydrogen',-259,-253],['Mercury',-39,357],['Water',0,100],['Ethanol',-114,78],['Potassium',63,759],['Iron',1538,2862],['Oxygen',-218,-183],['Bromine',-7,59]];
C['state-predictor'] = el => {
  el.classList.add('tool'); const deck=isDeck(el), fs=deck?'font-size:30px':'';
  el.innerHTML=`<div class="bar"><span class="lbl">Substance</span>${SUBST.map((x,i)=>`<button class="btn sb" data-i="${i}" style="${fs}">${x[0]}</button>`).join('')}</div>
   <div style="padding:14px;${deck?'font-size:34px':''}"><div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center">
    <label>Melting point <input class="mp" type="number" style="width:90px;font:inherit;padding:2px 6px"> °C</label>
    <label>Boiling point <input class="bp" type="number" style="width:90px;font:inherit;padding:2px 6px"> °C</label>
    <label>Temperature <input class="tt" type="number" value="25" style="width:80px;font:inherit;padding:2px 6px"> °C</label></div>
    <div class="sv" style="margin-top:12px"></div></div>`;
  const mp=$('.mp',el), bp=$('.bp',el), tt=$('.tt',el), out=$('.sv',el);
  const draw=()=>{ const m=+mp.value, b=+bp.value, t=+tt.value;
    if(isNaN(m)||isNaN(b)||b<=m){ out.innerHTML='<b>Boiling point must be higher than melting point.</b>'; return; }
    const st = t<m?'SOLID':t<b?'LIQUID':'GAS', at = (t===m)?' (exactly at the melting point: could be solid or liquid)':(t===b)?' (exactly at the boiling point: could be liquid or gas)':'';
    const lo=Math.min(m,t)-Math.max(30,(b-m)*0.25), hi=Math.max(b,t)+Math.max(30,(b-m)*0.25), X=v=>20+(v-lo)/(hi-lo)*560;
    out.innerHTML=`<svg viewBox="0 0 600 110" style="width:100%;max-width:${deck?'1400px':'600px'}${deck?';height:300px':''}" font-family="Barlow,Arial,sans-serif">
      <rect x="20" y="30" width="${X(m)-20}" height="34" fill="#9cc9f0"/><rect x="${X(m)}" y="30" width="${X(b)-X(m)}" height="34" fill="#4aa3ff"/><rect x="${X(b)}" y="30" width="${580-X(b)}" height="34" fill="#ffd2d2"/>
      <text x="${(20+X(m))/2}" y="52" text-anchor="middle" font-size="14" font-weight="700">solid</text><text x="${(X(m)+X(b))/2}" y="52" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">liquid</text><text x="${(X(b)+580)/2}" y="52" text-anchor="middle" font-size="14" font-weight="700">gas</text>
      <text x="${X(m)}" y="82" text-anchor="middle" font-size="12">${m} °C</text><text x="${X(b)}" y="82" text-anchor="middle" font-size="12">${b} °C</text>
      <path d="M${X(t)} 20 l-7 -12 h14z" fill="#8c0013"/><line x1="${X(t)}" x2="${X(t)}" y1="20" y2="70" stroke="#8c0013" stroke-width="3"/><text x="${X(t)}" y="100" text-anchor="middle" font-size="13" font-weight="700" fill="#8c0013">${t} °C</text></svg>
      <div style="font-weight:700;margin-top:6px">At ${t} °C it is a <span style="color:var(--acc)">${st}</span>${at}.</div>
      <div style="font-size:${deck?'26px':'14px'};color:#555;margin-top:4px">Below the melting point → solid · between the melting and boiling points → liquid · above the boiling point → gas.</div>`; };
  $$('.sb',el).forEach(b=>b.onclick=()=>{ const x=SUBST[+b.dataset.i]; mp.value=x[1]; bp.value=x[2]; $$('.sb',el).forEach(y=>y.classList.toggle('on',y===b)); draw(); });
  [mp,bp,tt].forEach(i=>i.oninput=draw); $$('.sb',el)[2].click();
};

/* ---- 1a: bromine diffusing into air ---- */
C['bromine-jar'] = el => {
  const W=300,H=420,deck=isDeck(el),r=6,mid=H/2;
  el.insertAdjacentHTML('beforeend',`<div style="display:flex;gap:8px;margin-bottom:8px"><button class="btn go" style="${deck?'font-size:30px;padding:6px 16px;border-width:4px':''}">Remove the divider</button><button class="btn rs" style="${deck?'font-size:30px;padding:6px 16px;border-width:4px':''}">Reset</button></div>`);
  const cv=canvasFor(el,W,H), ctx=cv.getContext('2d'); cv.style.border=deck?'5px solid #111':'2px solid #111'; if(!deck){cv.style.maxWidth='220px';cv.style.margin='0 auto';cv.style.display='block';}
  let P=[], open=false;
  const reset=()=>{ open=false; P=[]; for(let i=0;i<70;i++) P.push({br:true,x:20+Math.random()*(W-40),y:mid+15+Math.random()*(mid-30)}); for(let i=0;i<70;i++) P.push({br:false,x:20+Math.random()*(W-40),y:15+Math.random()*(mid-30)}); P.forEach(p=>{const a=Math.random()*7;p.vx=Math.cos(a)*2.2;p.vy=Math.sin(a)*2.2;}); $('.go',el).disabled=false; };
  $('.go',el).onclick=()=>{open=true;$('.go',el).disabled=true;}; $('.rs',el).onclick=reset; reset();
  function step(){ P.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; if(Math.random()<0.08){const a=Math.random()*7;p.vx=Math.cos(a)*2.2;p.vy=Math.sin(a)*2.2;}
      if(p.x<12||p.x>W-12) p.vx*=-1; if(p.y<12||p.y>H-12) p.vy*=-1;
      if(!open){ if(p.br&&p.y<mid+8){p.y=mid+8;p.vy=Math.abs(p.vy);} if(!p.br&&p.y>mid-8){p.y=mid-8;p.vy=-Math.abs(p.vy);} }
      p.x=Math.max(12,Math.min(W-12,p.x)); p.y=Math.max(12,Math.min(H-12,p.y)); }); }
  function draw(){ ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H); ctx.strokeStyle='#111'; ctx.lineWidth=4; ctx.strokeRect(6,6,W-12,H-12);
    if(!open){ ctx.fillStyle='#555'; ctx.fillRect(0,mid-3,W,6); }
    P.forEach(p=>{ ctx.beginPath(); ctx.arc(p.x,p.y,r,0,7); ctx.fillStyle=p.br?'#a0522d':'#cfe3f5'; ctx.fill(); if(!p.br){ctx.lineWidth=1;ctx.strokeStyle='#7aa';ctx.stroke();} }); }
  (function loop(){ if(cv.offsetParent!==null){ step(); draw(); } requestAnimationFrame(loop); })();
};

/* ---- 1a: particle boxes for dissolving ---- */
C['solute-boxes'] = el => {
  const box=(title, fill)=>{ let s=''; const Wb=200,Hb=170;
    const water=[]; for(let j=0;j<6;j++) for(let i=0;i<8;i++) water.push([18+i*23+(j%2)*10, 28+j*23]);
    s+=`<rect x="4" y="12" width="${Wb}" height="${Hb}" fill="#fff" stroke="#111" stroke-width="3"/>`;
    fill(water).forEach(([x,y,c])=>{ s+=`<circle cx="${x}" cy="${y}" r="${c==='w'?9:7}" fill="${c==='w'?'#9cc9f0':c}" stroke="${c==='w'?'#4a88c0':'#111'}" stroke-width="1.2"/>`; });
    return `<figure style="text-align:center"><svg viewBox="0 0 210 190" style="width:100%;max-width:${isDeck(el)?'430px':'240px'}">${s}</svg><figcaption${isDeck(el)?' style="font-size:34px"':''}><b>${title}</b></figcaption></figure>`; };
  const mixed = w => { const idx=[3,9,14,20,27,33,38,44]; return w.map((p,i)=>[p[0],p[1],idx.includes(i)?'#e04848':'w']); };
  const clump = w => { const out=w.map(p=>[p[0],p[1],'w']); [[95,150],[109,150],[123,150],[102,137],[116,137],[109,124],[88,163],[130,163]].forEach(([x,y],k)=>{ out[40+ (k%8)]=[x,y,'#d4a64a']; }); return out; };
  el.innerHTML=`<div class="grid3" style="margin:0">${box('Water only', w=>w.map(p=>[p[0],p[1],'w']))}${box('Salt dissolved (soluble)', mixed)}${box('Flour (insoluble)', clump)}</div>`;
};
})();
