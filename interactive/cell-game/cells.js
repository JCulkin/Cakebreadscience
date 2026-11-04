/* Cell diagram engine for the Cell Spotter game.
   Draws plant, animal, fungal (yeast + hypha) and bacterial (rod + coccus) cells as SVG
   in three styles: "colour" (textbook), "exam" (black line drawing) and fields of cells
   "under the microscope". Every nameable structure is tagged data-part="<id>" so the
   game can ask students to tap it or label it. */
(function(){
const TAU=Math.PI*2;
function rng(seed){let a=(seed>>>0)||1;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const f1=n=>Math.round(n*10)/10;

const PARTS={
  nucleus:{name:'Nucleus',fn:'Contains genetic material (DNA) that controls the activities of the cell'},
  cytoplasm:{name:'Cytoplasm',fn:'Where most of the cell’s chemical reactions take place'},
  membrane:{name:'Cell membrane',fn:'Controls which substances enter and leave the cell'},
  wall:{name:'Cell wall',fn:'Strengthens and supports the cell'},
  mito:{name:'Mitochondria',fn:'Where aerobic respiration takes place, releasing energy for the cell'},
  chloro:{name:'Chloroplasts',fn:'Absorb light energy so the cell can carry out photosynthesis'},
  ribo:{name:'Ribosomes',fn:'Where proteins are made (protein synthesis)'},
  vacuole:{name:'Vacuole',fn:'Filled with cell sap; helps keep the cell firm'},
  plasmid:{name:'Plasmid',fn:'A small extra ring of DNA carrying a few genes'},
  chromo:{name:'Circular chromosome',fn:'One loop of DNA carrying most of the genes of a bacterium (it has no nucleus)'}
};
const GROUPS={animal:{name:'Animal',col:'#c0392b'},plant:{name:'Plant',col:'#2e7d32'},fungus:{name:'Fungus',col:'#8d5524'},bacteria:{name:'Bacteria',col:'#6a1b9a'}};

const PAL={
  colour:{bg:'#ffffff',cyto:'#fff3d6',cytoB:'#f6dcb0',mem:'#d35400',memW:2.4,wallP:'#43a047',wallF:'#a1887f',wallB:'#7b1fa2',nuc:'#9575cd',nucS:'#4527a0',nucl:'#4527a0',mito:'#ff8a65',mitoS:'#bf360c',chl:'#66bb6a',chlS:'#1b5e20',vac:'#d6ecfa',vacS:'#64b5f6',ribo:'#5d4037',pla:'#e53935',chr:'#1565c0',cap:'rgba(123,31,162,.10)',ink:'#333'},
  exam:{bg:'#ffffff',cyto:'#ffffff',cytoB:'#ffffff',mem:'#111',memW:1.6,wallP:'#111',wallF:'#111',wallB:'#111',nuc:'#e9e9e9',nucS:'#111',nucl:'#555',mito:'#fff',mitoS:'#111',chl:'#fff',chlS:'#111',vac:'#fff',vacS:'#111',ribo:'#111',pla:'#111',chr:'#111',cap:'none',ink:'#111'}
};

/* ---------- helpers ---------- */
function blobPath(cx,cy,rx,ry,r,wob=1){const p1=r()*TAU,p2=r()*TAU,p3=r()*TAU,pts=[];
  for(let i=0;i<96;i++){const t=i/96*TAU,k=1+wob*(0.05*Math.sin(3*t+p1)+0.035*Math.sin(5*t+p2)+0.02*Math.sin(2*t+p3));pts.push([cx+rx*k*Math.cos(t),cy+ry*k*Math.sin(t)]);}
  return {d:'M'+pts.map(p=>f1(p[0])+' '+f1(p[1])).join('L')+'Z',pts};}
function ellipsePath(cx,cy,rx,ry){return `M${cx-rx} ${cy}a${rx} ${ry} 0 1 0 ${2*rx} 0a${rx} ${ry} 0 1 0 ${-2*rx} 0Z`;}
function rrPath(x,y,w,h,rr){return `M${x+rr} ${y}H${x+w-rr}Q${x+w} ${y} ${x+w} ${y+rr}V${y+h-rr}Q${x+w} ${y+h} ${x+w-rr} ${y+h}H${x+rr}Q${x} ${y+h} ${x} ${y+h-rr}V${y+rr}Q${x} ${y} ${x+rr} ${y}Z`;}
function place(r,n,inside,ok,tries=4000){const out=[];let g=0;while(out.length<n&&g++<tries){const p=inside(r);if(p&&ok(p,out))out.push(p);}return out;}
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
function mitoSVG(x,y,ang,L,P,s=1){const rx=16*s,ry=7.5*s;let zig='';for(let i=0;i<5;i++){const xx=-rx*0.65+i*rx*0.33;zig+=`${i?'L':'M'}${f1(xx)} ${i%2?f1(ry*0.55):f1(-ry*0.55)}`;}
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)})"><ellipse rx="${rx}" ry="${ry}" fill="${P.mito}" stroke="${P.mitoS}" stroke-width="1.6"/><path d="${zig}" fill="none" stroke="${P.mitoS}" stroke-width="1.1"/><ellipse rx="${rx+5}" ry="${ry+5}" fill="transparent"/></g>`;}
function chloroSVG(x,y,ang,P,s=1){const rx=14*s,ry=7*s;let gr='';for(let i=-1;i<=1;i++)gr+=`<line x1="${f1(i*rx*0.45-3*s)}" y1="${f1(-ry*0.45)}" x2="${f1(i*rx*0.45+3*s)}" y2="${f1(-ry*0.45)}"/><line x1="${f1(i*rx*0.45-3*s)}" y1="${f1(ry*0.1)}" x2="${f1(i*rx*0.45+3*s)}" y2="${f1(ry*0.1)}"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)})"><ellipse rx="${rx}" ry="${ry}" fill="${P.chl}" stroke="${P.chlS}" stroke-width="1.5"/><g stroke="${P.chlS}" stroke-width="1.6">${gr}</g><ellipse rx="${rx+4}" ry="${ry+4}" fill="transparent"/></g>`;}
function nucleusSVG(x,y,r,P,rand){const b=blobPath(x,y,r,r*0.92,rand,0.5);return `<path d="${b.d}" fill="${P.nuc}" stroke="${P.nucS}" stroke-width="2"/><circle cx="${f1(x+r*0.25)}" cy="${f1(y-r*0.15)}" r="${f1(r*0.3)}" fill="${P.nucl}" opacity=".75"/>`;}
function ribosSVG(pts,P){return pts.map(p=>`<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="2.3" fill="${P.ribo}"/><circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="7" fill="transparent"/>`).join('');}
function wrap(inner,w,h,cls=''){return `<svg class="cellsvg ${cls}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img">${inner}</svg>`;}

/* ---------- single detailed cells ---------- */
/* Each returns {svg, parts:{id:[x,y]}, has:[ids], group, kind} ; viewBox 400 x 280 */
function animal(style,seed){const r=rng(seed),P=PAL[style],cx=200,cy=140,rx=150+r()*12,ry=100+r()*10;
  const out=blobPath(cx,cy,rx,ry,r,1.3);
  const inEl=(p,s)=>((p[0]-cx)/(rx*s))**2+((p[1]-cy)/(ry*s))**2<1;
  const nucP=[cx+(r()-0.5)*rx*0.6,cy+(r()-0.5)*ry*0.5],nr=30+r()*6;
  const mitos=place(r,5,()=>[cx+(r()*2-1)*rx,cy+(r()*2-1)*ry],(p,o)=>inEl(p,0.78)&&dist(p,nucP)>nr+26&&o.every(q=>dist(p,q)>40));
  const ribs=place(r,38,()=>[cx+(r()*2-1)*rx,cy+(r()*2-1)*ry],(p,o)=>inEl(p,0.86)&&dist(p,nucP)>nr+9&&mitos.every(q=>dist(p,q)>21)&&o.every(q=>dist(p,q)>11));
  const free=place(r,1,()=>[cx+(r()*2-1)*rx,cy+(r()*2-1)*ry],(p)=>inEl(p,0.7)&&dist(p,nucP)>nr+22&&mitos.every(q=>dist(p,q)>30)&&ribs.every(q=>dist(p,q)>12))[0]||[cx-rx*0.5,cy];
  const memPt=out.pts[Math.floor(r()*96)];
  let s=`<path d="${out.d}" fill="${P.cyto}" data-part="cytoplasm"/>`;
  s+=`<g data-part="nucleus">${nucleusSVG(nucP[0],nucP[1],nr,P,r)}</g>`;
  s+=`<g data-part="mito">${mitos.map(p=>mitoSVG(p[0],p[1],r()*180,0,P)).join('')}</g>`;
  s+=`<g data-part="ribo">${ribosSVG(ribs,P)}</g>`;
  s+=`<g data-part="membrane"><path d="${out.d}" fill="none" stroke="${P.mem}" stroke-width="${P.memW+0.6}"/><path d="${out.d}" fill="none" stroke="transparent" stroke-width="14"/></g>`;
  return {svg:s,w:400,h:280,group:'animal',kind:'Animal cell',parts:{cytoplasm:free,nucleus:nucP,mito:mitos[0],ribo:(ribs.filter(p=>inEl(p,0.72)).sort((a,b)=>Math.min(...mitos.map(q=>dist(b,q)))-Math.min(...mitos.map(q=>dist(a,q))))[0]||ribs[0]),membrane:memPt},has:['nucleus','cytoplasm','membrane','mito','ribo']};}

function plant(style,seed){const r=rng(seed),P=PAL[style];const x=36,y=26,w=328,h=228,t=11;
  const ix=x+t,iy=y+t,iw=w-2*t,ih=h-2*t;
  const vx=ix+50+r()*14,vy=iy+28+r()*6,vw=iw-50-44-r()*10-(vx-ix-50),vh=ih-56-r()*6;
  const inStrip=p=>p[0]>ix+7&&p[0]<ix+iw-7&&p[1]>iy+7&&p[1]<iy+ih-7&&!(p[0]>vx-8&&p[0]<vx+vw+8&&p[1]>vy-8&&p[1]<vy+vh+8);
  const nucP=[ix+(vx-ix)/2,iy+60+r()*(ih-120)],nr=19;
  const chl=place(r,10,()=>[ix+r()*iw,iy+r()*ih],(p,o)=>inStrip(p)&&dist(p,nucP)>nr+16&&o.every(q=>dist(p,q)>30));
  const mitos=place(r,3,()=>[ix+r()*iw,iy+r()*ih],(p,o)=>inStrip(p)&&dist(p,nucP)>nr+14&&chl.every(q=>dist(p,q)>24)&&o.every(q=>dist(p,q)>30));
  const ribs=place(r,24,()=>[ix+r()*iw,iy+r()*ih],(p,o)=>inStrip(p)&&dist(p,nucP)>nr+7&&chl.every(q=>dist(p,q)>17)&&mitos.every(q=>dist(p,q)>16)&&o.every(q=>dist(p,q)>11));
  const free=place(r,1,()=>[ix+r()*iw,iy+r()*ih],p=>inStrip(p)&&dist(p,nucP)>nr+12&&chl.every(q=>dist(p,q)>20)&&mitos.every(q=>dist(p,q)>20)&&ribs.every(q=>dist(p,q)>9))[0]||[ix+12,iy+12];
  const angFor=p=>{const dl=p[0]-ix,dr=ix+iw-p[0],dt=p[1]-iy,db=iy+ih-p[1];return Math.min(dt,db)<Math.min(dl,dr)?r()*30-15:90+r()*30-15;};
  let s='';
  s+=`<path d="${rrPath(ix,iy,iw,ih,6)}" fill="${P.cyto}" data-part="cytoplasm"/>`;
  s+=`<g data-part="vacuole"><path d="${rrPath(vx,vy,vw,vh,34)}" fill="${P.vac}" stroke="${P.vacS}" stroke-width="1.8"/></g>`;
  s+=`<g data-part="nucleus">${nucleusSVG(nucP[0],nucP[1],nr,P,r)}</g>`;
  s+=`<g data-part="chloro">${chl.map(p=>chloroSVG(p[0],p[1],angFor(p),P)).join('')}</g>`;
  s+=`<g data-part="mito">${mitos.map(p=>mitoSVG(p[0],p[1],r()*180,0,P,0.7)).join('')}</g>`;
  s+=`<g data-part="ribo">${ribosSVG(ribs,P)}</g>`;
  const wallD=rrPath(x+t/2,y+t/2,w-t,h-t,10);
  s+= style==='exam'
    ? `<g data-part="wall"><path d="${wallD}" fill="none" stroke="#111" stroke-width="${t}"/><path d="${wallD}" fill="none" stroke="#fff" stroke-width="${t-3.4}"/><path d="${wallD}" fill="none" stroke="transparent" stroke-width="${t+4}"/></g>`
    : `<g data-part="wall"><path d="${wallD}" fill="none" stroke="${P.wallP}" stroke-width="${t}"/><path d="${wallD}" fill="none" stroke="transparent" stroke-width="${t+4}"/></g>`;
  const memD=rrPath(ix+1.5,iy+1.5,iw-3,ih-3,6);
  s+=`<g data-part="membrane"><path d="${memD}" fill="none" stroke="${P.mem}" stroke-width="${P.memW}"/><path d="${memD}" fill="none" stroke="transparent" stroke-width="6"/></g>`;
  return {svg:s,w:400,h:280,group:'plant',kind:'Plant cell',parts:{cytoplasm:free,vacuole:[vx+vw/2,vy+vh/2],nucleus:nucP,chloro:chl[0],mito:mitos[0],ribo:ribs[0],wall:[x+t/2,y+h*0.3],membrane:[ix+iw-1.5,iy+ih*0.72]},has:['nucleus','cytoplasm','membrane','wall','mito','chloro','ribo','vacuole']};}

function yeast(style,seed){const r=rng(seed),P=PAL[style],cx=176,cy=146,rx=128,ry=96,t=8;
  const ba=-0.55+r()*0.3,bx=cx+(rx+20)*Math.cos(ba),by=cy+(ry+20)*Math.sin(ba);
  const inEl=(p,s)=>((p[0]-cx)/(rx*s))**2+((p[1]-cy)/(ry*s))**2<1;
  const vacP=[cx+15+(r()-0.5)*30,cy+(r()-0.5)*24],vr=30,nucP=[cx-48-r()*12,cy+(r()-0.5)*36],nr=22;
  const mitos=place(r,3,()=>[cx+(r()*2-1)*rx,cy+(r()*2-1)*ry],(p,o)=>inEl(p,0.74)&&dist(p,nucP)>nr+24&&dist(p,vacP)>vr+24&&o.every(q=>dist(p,q)>42));
  const ribs=place(r,28,()=>[cx+(r()*2-1)*rx,cy+(r()*2-1)*ry],(p,o)=>inEl(p,0.84)&&dist(p,nucP)>nr+8&&dist(p,vacP)>vr+8&&mitos.every(q=>dist(p,q)>21)&&o.every(q=>dist(p,q)>11));
  const free=place(r,1,()=>[cx+(r()*2-1)*rx,cy+(r()*2-1)*ry],p=>inEl(p,0.7)&&dist(p,nucP)>nr+14&&dist(p,vacP)>vr+14&&mitos.every(q=>dist(p,q)>26)&&ribs.every(q=>dist(p,q)>10))[0]||[cx,cy+ry*0.6];
  const wc=style==='exam'?'#111':P.wallF;
  const wallE=(X,Y,RX,RY)=>style==='exam'?`<path d="${ellipsePath(X,Y,RX,RY)}" fill="none" stroke="#111" stroke-width="${t}"/><path d="${ellipsePath(X,Y,RX,RY)}" fill="none" stroke="#fff" stroke-width="${t-3.2}"/>`:`<path d="${ellipsePath(X,Y,RX,RY)}" fill="none" stroke="${wc}" stroke-width="${t}"/>`;
  let s='';
  // bud (behind)
  s+=`<path d="${ellipsePath(bx,by,40,32)}" fill="${P.cyto}" data-part="cytoplasm"/>`;
  s+=`<g data-part="wall">${wallE(bx,by,44,36)}<path d="${ellipsePath(bx,by,44,36)}" fill="none" stroke="transparent" stroke-width="12"/></g>`;
  s+=`<g data-part="membrane"><path d="${ellipsePath(bx,by,39,31)}" fill="none" stroke="${P.mem}" stroke-width="${P.memW}"/></g>`;
  s+=`<path d="${ellipsePath(cx,cy,rx-t,ry-t)}" fill="${P.cyto}" data-part="cytoplasm"/>`;
  s+=`<g data-part="vacuole"><circle cx="${f1(vacP[0])}" cy="${f1(vacP[1])}" r="${vr}" fill="${P.vac}" stroke="${P.vacS}" stroke-width="1.8"/></g>`;
  s+=`<g data-part="nucleus">${nucleusSVG(nucP[0],nucP[1],nr,P,r)}</g>`;
  s+=`<g data-part="mito">${mitos.map(p=>mitoSVG(p[0],p[1],r()*180,0,P,0.85)).join('')}</g>`;
  s+=`<g data-part="ribo">${ribosSVG(ribs,P)}</g>`;
  s+=`<g data-part="wall">${wallE(cx,cy,rx-t/2,ry-t/2)}<path d="${ellipsePath(cx,cy,rx-t/2,ry-t/2)}" fill="none" stroke="transparent" stroke-width="${t+4}"/></g>`;
  s+=`<g data-part="membrane"><path d="${ellipsePath(cx,cy,rx-t-1.5,ry-t-1.5)}" fill="none" stroke="${P.mem}" stroke-width="${P.memW}"/><path d="${ellipsePath(cx,cy,rx-t-1.5,ry-t-1.5)}" fill="none" stroke="transparent" stroke-width="6"/></g>`;
  return {svg:s,w:400,h:280,group:'fungus',kind:'Yeast cell (fungus)',parts:{cytoplasm:free,vacuole:vacP,nucleus:nucP,mito:mitos[0],ribo:ribs[0],wall:[cx-(rx-t/2)*Math.cos(0.35),cy-(ry-t/2)*Math.sin(0.35)],membrane:[cx+(rx-t-1.5)*Math.cos(0.6),cy+(ry-t-1.5)*Math.sin(0.6)]},has:['nucleus','cytoplasm','membrane','wall','mito','ribo','vacuole']};}

function hypha(style,seed){const r=rng(seed),P=PAL[style],ph=r()*TAU;
  const cyF=x=>140+18*Math.sin(x/70+ph);const W=400,ow=36,t=9;
  const line=off=>{let d='';for(let x=-10;x<=W+10;x+=5)d+=(x===-10?'M':'L')+x+' '+f1(cyF(x)+off);return d;};
  const band=(a,b)=>{let d='';for(let x=-10;x<=W+10;x+=5)d+=(x===-10?'M':'L')+x+' '+f1(cyF(x)+a);for(let x=W+10;x>=-10;x-=5)d+='L'+x+' '+f1(cyF(x)+b);return d+'Z';};
  const nucs=[];for(let i=0;i<5;i++){const x=40+i*78+(r()-0.5)*18;nucs.push([x,cyF(x)+(r()-0.5)*14]);}
  const mitos=place(r,4,()=>{const x=20+r()*360;return [x,cyF(x)+(r()-0.5)*30];},(p,o)=>nucs.every(q=>dist(p,q)>30)&&o.every(q=>dist(p,q)>44));
  const ribs=place(r,26,()=>{const x=10+r()*380;return [x,cyF(x)+(r()-0.5)*40];},(p,o)=>Math.abs(p[1]-cyF(p[0]))<ow-t-6&&nucs.every(q=>dist(p,q)>17)&&mitos.every(q=>dist(p,q)>20)&&o.every(q=>dist(p,q)>11));
  const free=place(r,1,()=>{const x=30+r()*340;return [x,cyF(x)+(r()-0.5)*30];},p=>nucs.every(q=>dist(p,q)>24)&&mitos.every(q=>dist(p,q)>26)&&ribs.every(q=>dist(p,q)>10))[0]||[200,cyF(200)];
  let s=`<path d="${band(-(ow-t),ow-t)}" fill="${P.cyto}" data-part="cytoplasm"/>`;
  s+=`<g data-part="nucleus">${nucs.map(p=>`<g transform="translate(${f1(p[0])} ${f1(p[1])})"><ellipse rx="12" ry="9.5" fill="${P.nuc}" stroke="${P.nucS}" stroke-width="1.8"/><circle cx="3" cy="-2" r="3.2" fill="${P.nucl}" opacity=".75"/><ellipse rx="16" ry="13" fill="transparent"/></g>`).join('')}</g>`;
  s+=`<g data-part="mito">${mitos.map(p=>mitoSVG(p[0],p[1],(r()-0.5)*40,0,P,0.8)).join('')}</g>`;
  s+=`<g data-part="ribo">${ribosSVG(ribs,P)}</g>`;
  const wc=style==='exam'?'#111':P.wallF;
  s+=`<g data-part="wall"><path d="${band(-ow,-(ow-t))}" fill="${style==='exam'?'#fff':wc}" stroke="${style==='exam'?'#111':'none'}" stroke-width="1.4"/><path d="${band(ow-t,ow)}" fill="${style==='exam'?'#fff':wc}" stroke="${style==='exam'?'#111':'none'}" stroke-width="1.4"/><path d="${line(-ow-1)}" fill="none" stroke="transparent" stroke-width="9"/><path d="${line(ow+1)}" fill="none" stroke="transparent" stroke-width="9"/></g>`;
  s+=`<g data-part="membrane"><path d="${line(-(ow-t)-1)}" fill="none" stroke="${P.mem}" stroke-width="${P.memW}"/><path d="${line(ow-t+1)}" fill="none" stroke="${P.mem}" stroke-width="${P.memW}"/><path d="${line(-(ow-t)-1)}" fill="none" stroke="transparent" stroke-width="4"/><path d="${line(ow-t+1)}" fill="none" stroke="transparent" stroke-width="4"/></g>`;
  return {svg:s,w:400,h:280,group:'fungus',kind:'Fungal hypha (e.g. Mucor)',parts:{cytoplasm:free,nucleus:nucs[2],mito:mitos[0],ribo:ribs[0],wall:[300,cyF(300)-ow+2],membrane:[110,cyF(110)+ow-t+1]},has:['nucleus','cytoplasm','membrane','wall','mito','ribo']};}

function bacterium(style,seed,shape){const r=rng(seed),P=PAL[style],t=7;let outer,inner,cx=200,cy=140,inside,wallPt,memPt,flag='';
  if(shape==='rod'){const x=55,y=82,w=290,h=116;outer=rrPath(x+t/2,y+t/2,w-t,h-t,(h-t)/2);inner=rrPath(x+t+1.5,y+t+1.5,w-2*t-3,h-2*t-3,(h-2*t-3)/2);
    inside=(p,m=0)=>{const rr=h/2-t-m;const qx=Math.max(x+h/2,Math.min(x+w-h/2,p[0]));return Math.hypot(p[0]-qx,p[1]-cy)<rr;};wallPt=[x+t/2,cy-14];memPt=[x+w-t-1.5,cy+16];
    let fd=`M${x+w-2} ${cy}`;for(let i=1;i<=12;i++)fd+=`L${f1(x+w-2+i*6)} ${f1(cy+Math.sin(i*0.9)*10)}`;flag=`<path d="${fd}" fill="none" stroke="${style==='exam'?'#111':'#8e6e9e'}" stroke-width="2"/>`;
    if(style!=='exam'&&r()<0.6)flag=`<path d="${rrPath(x-9,y-9,w+18,h+18,h/2+9)}" fill="${P.cap}" stroke="none"/>`+flag;}
  else{const R=96;outer=ellipsePath(cx,cy,R-t/2,R-t/2);inner=ellipsePath(cx,cy,R-t-1.5,R-t-1.5);inside=(p,m=0)=>Math.hypot(p[0]-cx,p[1]-cy)<R-t-m;wallPt=[cx-(R-t/2)*Math.cos(0.4),cy-(R-t/2)*Math.sin(0.4)];memPt=[cx+(R-t-1.5)*Math.cos(0.5),cy+(R-t-1.5)*Math.sin(0.5)];}
  // chromosome: tangled closed loop
  const cr=shape==='rod'?[64,24]:[44,40],ph=r()*TAU;let cd='';const chrPts=[];
  for(let i=0;i<=160;i++){const a=i/160*TAU,k=1+0.28*Math.sin(7*a+ph)+0.16*Math.sin(13*a+ph*2);const p=[cx+cr[0]*k*Math.cos(a)+(shape==='rod'?-10:0),cy+cr[1]*k*Math.sin(a)];chrPts.push(p);cd+=(i?'L':'M')+f1(p[0])+' '+f1(p[1]);}
  const nearChr=(p,m)=>chrPts.some(q=>dist(p,q)<m);
  const box=shape==='rod'?[70,95,260,90]:[110,50,180,180];
  const rp=()=>[box[0]+r()*box[2],box[1]+r()*box[3]];
  const pls=place(r,shape==='rod'?3:2,rp,(p,o)=>inside(p,18)&&!nearChr(p,20)&&Math.hypot(p[0]-cx,p[1]-cy)>(shape==='rod'?30:30)&&o.every(q=>dist(p,q)>40));
  const ribs=place(r,24,rp,(p,o)=>inside(p,6)&&!nearChr(p,7)&&pls.every(q=>dist(p,q)>16)&&o.every(q=>dist(p,q)>11));
  const free=place(r,1,rp,p=>inside(p,10)&&!nearChr(p,14)&&pls.every(q=>dist(p,q)>20)&&ribs.every(q=>dist(p,q)>10))[0]||[cx,cy];
  let s=flag+`<path d="${inner}" fill="${P.cytoB}" data-part="cytoplasm"/>`;
  s+=`<g data-part="chromo"><path d="${cd}Z" fill="none" stroke="${P.chr}" stroke-width="2.4" stroke-linejoin="round"/><path d="${cd}Z" fill="none" stroke="transparent" stroke-width="9"/></g>`;
  s+=`<g data-part="plasmid">${pls.map(p=>`<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="${f1(7+r()*2)}" fill="none" stroke="${P.pla}" stroke-width="2.4"/><circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="13" fill="transparent"/>`).join('')}</g>`;
  s+=`<g data-part="ribo">${ribosSVG(ribs,P)}</g>`;
  s+= style==='exam'?`<g data-part="wall"><path d="${outer}" fill="none" stroke="#111" stroke-width="${t}"/><path d="${outer}" fill="none" stroke="#fff" stroke-width="${t-3.2}"/><path d="${outer}" fill="none" stroke="transparent" stroke-width="${t+4}"/></g>`
    :`<g data-part="wall"><path d="${outer}" fill="none" stroke="${P.wallB}" stroke-width="${t}"/><path d="${outer}" fill="none" stroke="transparent" stroke-width="${t+4}"/></g>`;
  s+=`<g data-part="membrane"><path d="${inner}" fill="none" stroke="${P.mem}" stroke-width="${P.memW}"/><path d="${inner}" fill="none" stroke="transparent" stroke-width="6"/></g>`;
  const chrPt=chrPts.reduce((a,b)=>b[1]<a[1]?b:a);
  return {svg:s,w:400,h:280,group:'bacteria',kind:shape==='rod'?'Rod-shaped bacterium (e.g. Lactobacillus)':'Spherical bacterium (e.g. Pneumococcus)',parts:{cytoplasm:free,chromo:chrPt,plasmid:pls[0],ribo:ribs[0],wall:wallPt,membrane:memPt},has:['cytoplasm','membrane','wall','ribo','plasmid','chromo']};}

const CELLS={animal,plant,yeast,hypha,rod:(s,sd)=>bacterium(s,sd,'rod'),coccus:(s,sd)=>bacterium(s,sd,'coccus')};
function cell(type,style,seed){const c=CELLS[type](style,seed);c.type=type;c.style=style;c.seed=seed;return c;}

/* ---------- fields of cells "under the microscope" ---------- */
function field(type,seed){const r=rng(seed),W=400,H=300,cx=200,cy=150,R=146;let body='',bg='#f3efe2',scale='',cap='';
  const jit=a=>(r()-0.5)*a;
  if(type==='onion'){bg='#f1e3b4';cap='Onion epidermis cells, stained with iodine';scale='100 µm';
    const rows=6,rh=H/rows;for(let i=0;i<rows;i++){let x=-60+r()*-40;const y=i*rh+jit(6);while(x<W+40){const w=110+r()*60;const pts=[[x+jit(8),y+jit(5)],[x+w+jit(8),y+jit(5)],[x+w+jit(8),y+rh+jit(5)],[x+jit(8),y+rh+jit(5)]];
      body+=`<path d="M${pts.map(p=>f1(p[0])+' '+f1(p[1])).join('L')}Z" fill="#ead39a" stroke="#7a5a1c" stroke-width="2.6"/>`;
      if(r()<0.85){const nx=x+w*(0.25+r()*0.5),ny=y+rh*(0.3+r()*0.4);body+=`<ellipse cx="${f1(nx)}" cy="${f1(ny)}" rx="${f1(8+r()*3)}" ry="${f1(6+r()*2)}" fill="#8a5f16" opacity=".85"/><circle cx="${f1(nx+2)}" cy="${f1(ny-1)}" r="2.2" fill="#5a3a08"/>`;}
      x+=w;}}}
  else if(type==='elodea'){bg='#dcebc4';cap='Leaf cells of pondweed (Elodea), showing chloroplasts';scale='50 µm';
    const rows=7,rh=H/rows;for(let i=0;i<rows;i++){let x=-30-r()*30;const y=i*rh+jit(4);while(x<W+30){const w=58+r()*24;
      body+=`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(rh)}" rx="4" fill="#e9f3d6" stroke="#6c8a3c" stroke-width="2.2"/>`;
      for(let k=0;k<16;k++){const side=r();let px,py;if(side<0.5){px=x+5+r()*(w-10);py=r()<0.5?y+6+r()*5:y+rh-6-r()*5;}else{py=y+6+r()*(rh-12);px=r()<0.5?x+6+r()*5:x+w-6-r()*5;}
        body+=`<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="4.2" ry="3.2" fill="#3f8f2a" opacity=".9"/>`;}
      x+=w;}}}
  else if(type==='cheek'){bg='#eef3f8';cap='Human cheek cells, stained with methylene blue';scale='50 µm';
    for(let k=0;k<9;k++){const px=30+r()*340,py=30+r()*240,s=34+r()*18;const b=blobPath(px,py,s,s*(0.7+r()*0.35),r,3.2);
      body+=`<path d="${b.d}" fill="#c9dcf0" fill-opacity=".75" stroke="#7aa0c8" stroke-width="1.6"/>`;
      body+=`<path d="M${f1(px-s*0.6)} ${f1(py+s*0.2)}q${f1(s*0.4)} ${f1(-s*0.25)} ${f1(s*0.9)} ${f1(-s*0.05)}" fill="none" stroke="#9db9d8" stroke-width="1.2"/>`;
      body+=`<ellipse cx="${f1(px+jit(14))}" cy="${f1(py+jit(10))}" rx="${f1(7+r()*2)}" ry="${f1(6+r()*2)}" fill="#1f4f8f"/>`;}
    for(let k=0;k<30;k++)body+=`<circle cx="${f1(r()*W)}" cy="${f1(r()*H)}" r="${f1(0.8+r())}" fill="#5878a8" opacity=".5"/>`;}
  else if(type==='yeast'){bg='#eceae4';cap='Yeast cells (a single-celled fungus), some budding';scale='10 µm';
    const cs=place(r,22,()=>[r()*W,r()*H],(p,o)=>o.every(q=>dist(p,q)>36));
    cs.forEach(p=>{const a=r()*180,rx=15+r()*4,ry=12+r()*3;body+=`<g transform="translate(${f1(p[0])} ${f1(p[1])}) rotate(${f1(a)})"><ellipse rx="${f1(rx)}" ry="${f1(ry)}" fill="#d9d2c3" stroke="#5f574a" stroke-width="2"/>${r()<0.6?`<circle cx="${f1(jit(6))}" cy="${f1(jit(4))}" r="${f1(5+r()*2)}" fill="#f4f1ea" stroke="#9a907f" stroke-width="1"/>`:''}${r()<0.45?`<ellipse cx="${f1(rx+5)}" cy="0" rx="7" ry="6" fill="#d9d2c3" stroke="#5f574a" stroke-width="1.8"/>`:''}</g>`;});}
  else if(type==='hyphae'){bg='#efede6';cap='Mould hyphae (fungus) with spore cases (sporangia)';scale='100 µm';
    const tips=[];for(let k=0;k<9;k++){const fromLeft=k%3===0;let x=fromLeft?-10:r()*W,y=fromLeft?r()*H:H+10,a=fromLeft?jit(0.8):-Math.PI/2+jit(1.2);let d=`M${f1(x)} ${f1(y)}`;for(let i=0;i<34;i++){a+=jit(0.25);x+=Math.cos(a)*10;y+=Math.sin(a)*10;d+=`L${f1(x)} ${f1(y)}`;if((i===12||i===22)&&r()<0.7){tips.push([x,y,a+(r()<0.5?-0.9:0.9)]);}}
      body+=`<path d="${d}" fill="none" stroke="#6d6a60" stroke-width="5" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#e2dfd5" stroke-width="2.4" stroke-linecap="round"/>`;tips.push([x,y,a]);}
    tips.forEach(([x,y,a])=>{let d=`M${f1(x)} ${f1(y)}`,xx=x,yy=y;for(let i=0;i<8;i++){a+=jit(0.2);xx+=Math.cos(a)*9;yy+=Math.sin(a)*9;d+=`L${f1(xx)} ${f1(yy)}`;}
      body+=`<path d="${d}" fill="none" stroke="#6d6a60" stroke-width="4" stroke-linecap="round"/>`;if(r()<0.75)body+=`<circle cx="${f1(xx)}" cy="${f1(yy)}" r="${f1(9+r()*4)}" fill="#3c3a35"/>`;});}
  else if(type==='rods'){bg='#f6f1f6';cap='Rod-shaped bacteria (stained)';scale='5 µm';
    for(let k=0;k<90;k++){const x=r()*W,y=r()*H,a=r()*180,l=12+r()*7;body+=`<rect x="${f1(-l/2)}" y="-2.6" width="${f1(l)}" height="5.2" rx="2.6" fill="#a01f7a" transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a)})"/>`;}}
  else if(type==='cocci'){bg='#f4f2fa';cap='Spherical bacteria (stained), often in pairs or chains';scale='5 µm';
    for(let k=0;k<45;k++){let x=r()*W,y=r()*H;const a=r()*TAU,n=1+Math.floor(r()*4);for(let i=0;i<n;i++){body+=`<circle cx="${f1(x)}" cy="${f1(y)}" r="3.6" fill="#4a2a8c"/>`;x+=Math.cos(a)*7.4;y+=Math.sin(a)*7.4;}}}
  const id='f'+seed+type;
  const inner=`<defs><clipPath id="c${id}"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath><filter id="b${id}"><feGaussianBlur stdDeviation="0.7"/></filter><radialGradient id="v${id}"><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient></defs>
  <rect width="${W}" height="${H}" fill="#121212"/><g clip-path="url(#c${id})"><rect width="${W}" height="${H}" fill="${bg}"/><g filter="url(#b${id})">${body}</g><circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#v${id})"/></g>
  <g><line x1="${W-92}" y1="${H-16}" x2="${W-32}" y2="${H-16}" stroke="#fff" stroke-width="3"/><text x="${W-62}" y="${H-24}" fill="#fff" font-size="12" text-anchor="middle" font-family="Barlow, sans-serif">${scale}</text></g>`;
  const group={onion:'plant',elodea:'plant',cheek:'animal',yeast:'fungus',hyphae:'fungus',rods:'bacteria',cocci:'bacteria'}[type];
  return {svg:inner,w:W,h:H,group,caption:cap,type};}

window.Cells={PARTS,GROUPS,cell,field,wrap,rng,CELL_TYPES:Object.keys(CELLS),FIELD_TYPES:['onion','elodea','cheek','yeast','hyphae','rods','cocci']};
})();
