/* Cell diagram engine for the Cell Spotter game.
   Draws plant, animal, fungal (yeast + hypha) and bacterial (rod + coccus) cells as SVG
   in two styles, "colour" (textbook, several colour themes) and "exam" (black line drawing),
   plus circular fields of cells "under the microscope". Every drawing is randomised:
   shape, size, proportions, organelle numbers and positions, rotation, mirroring, colours.
   Every nameable structure is tagged data-part="<id>" and has a label anchor in .parts. */
(function(){
const TAU=Math.PI*2;
function rng(seed){let a=(seed>>>0)||1;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const f1=n=>Math.round(n*10)/10;
const between=(r,a,b)=>a+r()*(b-a);
const ipick=(r,a)=>a[Math.floor(r()*a.length)];
const irange=(r,a,b)=>a+Math.floor(r()*(b-a+1));

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

const BASE={bg:'#ffffff',cyto:'#fff3d6',cytoB:'#f6dcb0',mem:'#d35400',memW:2.4,wallP:'#43a047',wallF:'#a1887f',wallB:'#7b1fa2',nuc:'#9575cd',nucS:'#4527a0',nucl:'#4527a0',mito:'#ff8a65',mitoS:'#bf360c',chl:'#66bb6a',chlS:'#1b5e20',vac:'#d6ecfa',vacS:'#64b5f6',ribo:'#5d4037',pla:'#e53935',chr:'#1565c0',cap:'rgba(123,31,162,.10)',flag:'#8e6e9e'};
const THEMES=[{},
 {cyto:'#eaf4fb',cytoB:'#e3effa',mem:'#1e88e5',nuc:'#f48fb1',nucS:'#ad1457',nucl:'#880e4f',mito:'#ffb74d',mitoS:'#e65100',chl:'#7cb342',chlS:'#33691e',vac:'#fff9c4',vacS:'#f9a825',wallP:'#689f38',wallF:'#795548',wallB:'#5e35b1',ribo:'#37474f',pla:'#d81b60',chr:'#283593',cap:'rgba(94,53,177,.10)',flag:'#7e57c2'},
 {cyto:'#fde7ef',cytoB:'#fbe9d0',mem:'#c2185b',nuc:'#b39ddb',nucS:'#512da8',nucl:'#311b92',mito:'#80cbc4',mitoS:'#00695c',chl:'#9ccc65',chlS:'#33691e',vac:'#e1f5fe',vacS:'#4fc3f7',wallP:'#2e7d32',wallF:'#a1887f',wallB:'#8e24aa',ribo:'#4e342e',pla:'#f4511e',chr:'#1976d2',cap:'rgba(142,36,170,.10)',flag:'#ab47bc'},
 {cyto:'#f1f8e9',cytoB:'#f3e5c8',mem:'#558b2f',nuc:'#90caf9',nucS:'#1565c0',nucl:'#0d47a1',mito:'#ef9a9a',mitoS:'#c62828',chl:'#43a047',chlS:'#1b5e20',vac:'#ede7f6',vacS:'#9575cd',wallP:'#33691e',wallF:'#6d4c41',wallB:'#4a148c',ribo:'#212121',pla:'#ff6f00',chr:'#0d47a1',cap:'rgba(74,20,140,.09)',flag:'#6d4c41'}
];
const EXAM={bg:'#ffffff',cyto:'#ffffff',cytoB:'#ffffff',mem:'#111',memW:1.6,wallP:'#111',wallF:'#111',wallB:'#111',nuc:'#e9e9e9',nucS:'#111',nucl:'#555',mito:'#fff',mitoS:'#111',chl:'#fff',chlS:'#111',vac:'#fff',vacS:'#111',ribo:'#111',pla:'#111',chr:'#111',cap:'none',flag:'#111'};
function palette(style,r){if(style==='exam'){const lw=between(r,1.3,2.1);return Object.assign({},EXAM,{memW:lw,nuc:ipick(r,['#e9e9e9','#ffffff','#dcdcdc']),nucl:ipick(r,['#555','#111','#888'])});}
  return Object.assign({},BASE,ipick(r,THEMES));}

/* ---------- helpers ---------- */
function blobPath(cx,cy,rx,ry,r,wob=1){const p1=r()*TAU,p2=r()*TAU,p3=r()*TAU,pts=[];
  for(let i=0;i<96;i++){const t=i/96*TAU,k=1+wob*(0.05*Math.sin(3*t+p1)+0.035*Math.sin(5*t+p2)+0.02*Math.sin(2*t+p3));pts.push([cx+rx*k*Math.cos(t),cy+ry*k*Math.sin(t)]);}
  return {d:'M'+pts.map(p=>f1(p[0])+' '+f1(p[1])).join('L')+'Z',pts};}
function ellipsePath(cx,cy,rx,ry){const RX=f1(rx),RY=f1(ry),D=f1(2*RX);return `M${f1(cx-RX)} ${f1(cy)}a${RX} ${RY} 0 1 0 ${D} 0a${RX} ${RY} 0 1 0 ${-D} 0Z`;}
function rrPath(x,y,w,h,rr){rr=Math.min(rr,w/2,h/2);const A=`A${f1(rr)} ${f1(rr)} 0 0 1 `;return `M${f1(x+rr)} ${f1(y)}H${f1(x+w-rr)}${A}${f1(x+w)} ${f1(y+rr)}V${f1(y+h-rr)}${A}${f1(x+w-rr)} ${f1(y+h)}H${f1(x+rr)}${A}${f1(x)} ${f1(y+h-rr)}V${f1(y+rr)}${A}${f1(x+rr)} ${f1(y)}Z`;}
function place(r,n,inside,ok,tries=5000){const out=[];let g=0;while(out.length<n&&g++<tries){const p=inside(r);if(p&&ok(p,out))out.push(p);}return out;}
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const minD=(p,arr)=>arr.length?Math.min(...arr.map(q=>dist(p,q))):1e9;
function best(r,gen,score,n=700){let b=null,bs=-1e9;for(let i=0;i<n;i++){const p=gen();const sc=score(p);if(sc>bs){bs=sc;b=p;}}return b;}
function mitoSVG(x,y,ang,P,s=1){const rx=16*s,ry=7.5*s;let zig='';for(let i=0;i<5;i++){const xx=-rx*0.65+i*rx*0.33;zig+=`${i?'L':'M'}${f1(xx)} ${i%2?f1(ry*0.55):f1(-ry*0.55)}`;}
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)})"><ellipse rx="${f1(rx)}" ry="${f1(ry)}" fill="${P.mito}" stroke="${P.mitoS}" stroke-width="1.6"/><path d="${zig}" fill="none" stroke="${P.mitoS}" stroke-width="1.1"/><ellipse rx="${f1(rx+5)}" ry="${f1(ry+5)}" fill="transparent"/></g>`;}
function chloroSVG(x,y,ang,P,s=1){const rx=14*s,ry=7*s;let gr='';for(let i=-1;i<=1;i++)gr+=`<line x1="${f1(i*rx*0.45-3*s)}" y1="${f1(-ry*0.45)}" x2="${f1(i*rx*0.45+3*s)}" y2="${f1(-ry*0.45)}"/><line x1="${f1(i*rx*0.45-3*s)}" y1="${f1(ry*0.1)}" x2="${f1(i*rx*0.45+3*s)}" y2="${f1(ry*0.1)}"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)})"><ellipse rx="${f1(rx)}" ry="${f1(ry)}" fill="${P.chl}" stroke="${P.chlS}" stroke-width="1.5"/><g stroke="${P.chlS}" stroke-width="1.6">${gr}</g><ellipse rx="${f1(rx+4)}" ry="${f1(ry+4)}" fill="transparent"/></g>`;}
function nucleusSVG(x,y,r,P,rand){const b=blobPath(x,y,r,r*between(rand,0.82,0.98),rand,0.5);const a=rand()*TAU,d=rand()*r*0.35;
  return `<path d="${b.d}" fill="${P.nuc}" stroke="${P.nucS}" stroke-width="2"/><circle cx="${f1(x+Math.cos(a)*d)}" cy="${f1(y+Math.sin(a)*d)}" r="${f1(r*between(rand,0.22,0.34))}" fill="${P.nucl}" opacity=".75"/>`;}
function ribosSVG(pts,P){return pts.map(p=>`<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="2.3" fill="${P.ribo}"/><circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="7" fill="transparent"/>`).join('');}
function wallBand(d,t,P,col){return P===EXAM||P.cyto==='#ffffff'&&P.mem==='#111'
  ?`<path d="${d}" fill="none" stroke="#111" stroke-width="${f1(t)}"/><path d="${d}" fill="none" stroke="#fff" stroke-width="${f1(t-3.4)}"/>`
  :`<path d="${d}" fill="none" stroke="${col}" stroke-width="${f1(t)}"/>`;}
function wrap(inner,w,h,cls=''){return `<svg class="cellsvg ${cls}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img">${inner}</svg>`;}
const isExam=P=>P.mem==='#111'&&P.cyto==='#ffffff';

/* ---------- single detailed cells (drawn around centre 200,140) ---------- */
function animal(style,seed){const r=rng(seed),P=palette(style,r),cx=200,cy=140;
  const shape=ipick(r,['blob','blob','round','long','flat']);
  const [rx,ry,wob]={blob:[between(r,140,160),between(r,95,110),1.3],round:[between(r,118,132),0,0.8],long:[between(r,165,182),between(r,68,80),1.0],flat:[between(r,140,158),between(r,95,108),2.6]}[shape];
  const RY=ry||rx*between(r,0.9,1.0);
  const out=blobPath(cx,cy,rx,RY,r,wob),safe=1-0.105*wob-0.03;
  const inEl=(p,s)=>((p[0]-cx)/(rx*s))**2+((p[1]-cy)/(RY*s))**2<1;
  const nr=between(r,shape==='long'?20:24,shape==='long'?28:36);
  const nucP=place(r,1,()=>[cx+(r()*2-1)*rx*0.5,cy+(r()*2-1)*RY*0.45],p=>inEl(p,safe-(nr+8)/Math.min(rx,RY)))[0]||[cx,cy];
  const ms=between(r,0.7,1.15);
  const mitos=place(r,irange(r,3,8),()=>[cx+(r()*2-1)*rx,cy+(r()*2-1)*RY],(p,o)=>inEl(p,safe-0.07)&&dist(p,nucP)>nr+24*ms&&o.every(q=>dist(p,q)>38*ms));
  const ribs=place(r,irange(r,20,48),()=>[cx+(r()*2-1)*rx,cy+(r()*2-1)*RY],(p,o)=>inEl(p,safe)&&dist(p,nucP)>nr+9&&minD(p,mitos)>20*ms+3&&o.every(q=>dist(p,q)>11));
  const free=best(r,()=>[cx+(r()*2-1)*rx,cy+(r()*2-1)*RY],p=>inEl(p,safe-0.12)?Math.min(dist(p,nucP)-nr-6,minD(p,mitos)-18*ms-4,minD(p,ribs)-9):-1e9);
  const ribA=ribs.filter(p=>inEl(p,safe-0.12)).sort((a,b)=>minD(b,mitos)-minD(a,mitos))[0]||ribs[0];
  let s=`<path d="${out.d}" fill="${P.cyto}" data-part="cytoplasm"/>`;
  s+=`<g data-part="nucleus">${nucleusSVG(nucP[0],nucP[1],nr,P,r)}</g>`;
  s+=`<g data-part="mito">${mitos.map(p=>mitoSVG(p[0],p[1],r()*180,P,ms)).join('')}</g>`;
  s+=`<g data-part="ribo">${ribosSVG(ribs,P)}</g>`;
  s+=`<g data-part="membrane"><path d="${out.d}" fill="none" stroke="${P.mem}" stroke-width="${f1(P.memW+0.6)}"/><path d="${out.d}" fill="none" stroke="#000" stroke-opacity="0" stroke-width="14"/></g>`;
  const e=1+0.105*wob;
  return {svg:s,ext:[rx*e+4,RY*e+4],rot:180,group:'animal',kind:'Animal cell',parts:{cytoplasm:free,nucleus:nucP,mito:mitos[0],ribo:ribA,membrane:out.pts[Math.floor(r()*96)]},has:['nucleus','cytoplasm','membrane','mito','ribo']};}

function plant(style,seed){const r=rng(seed),P=palette(style,r),cx=200,cy=140;
  const tall=r()<0.25;const w=tall?between(r,190,235):between(r,250,340),h=tall?between(r,250,300):between(r,170,232),t=between(r,9,13),cr=between(r,4,16);
  const x=cx-w/2,y=cy-h/2,ix=x+t,iy=y+t,iw=w-2*t,ih=h-2*t;
  const nr=between(r,15,21),side=ipick(r,tall?['T','B','L','R']:['L','R','T','B','L','R']);
  const M={L:between(r,20,34),R:between(r,20,34),T:between(r,20,30),B:between(r,20,30)};M[side]=2*nr+16;
  const vx=ix+M.L,vy=iy+M.T,vw=iw-M.L-M.R,vh=ih-M.T-M.B,vr=between(r,16,Math.min(42,vw/2,vh/2));
  const inStrip=p=>p[0]>ix+7&&p[0]<ix+iw-7&&p[1]>iy+7&&p[1]<iy+ih-7&&!(p[0]>vx-8&&p[0]<vx+vw+8&&p[1]>vy-8&&p[1]<vy+vh+8);
  const along=between(r,0.2,0.8);
  const nucP=side==='L'?[ix+M.L/2,iy+30+along*(ih-60)]:side==='R'?[ix+iw-M.R/2,iy+30+along*(ih-60)]:side==='T'?[ix+30+along*(iw-60),iy+M.T/2]:[ix+30+along*(iw-60),iy+ih-M.B/2];
  const cs=between(r,0.8,1.12);
  const inSafe=p=>p[0]>ix+12&&p[0]<ix+iw-12&&p[1]>iy+12&&p[1]<iy+ih-12&&!(p[0]>vx-14&&p[0]<vx+vw+14&&p[1]>vy-14&&p[1]<vy+vh+14);
  const free=place(r,1,()=>[ix+r()*iw,iy+r()*ih],p=>inSafe(p)&&dist(p,nucP)>nr+16)[0]||[ix+14,iy+14];
  const chl=place(r,irange(r,6,16),()=>[ix+r()*iw,iy+r()*ih],(p,o)=>inStrip(p)&&dist(p,nucP)>nr+16&&dist(p,free)>20*cs+12&&o.every(q=>dist(p,q)>30*cs));
  const mitos=place(r,irange(r,1,4),()=>[ix+r()*iw,iy+r()*ih],(p,o)=>inStrip(p)&&dist(p,nucP)>nr+14&&dist(p,free)>26&&minD(p,chl)>24&&o.every(q=>dist(p,q)>30));
  const ribs=place(r,irange(r,12,30),()=>[ix+r()*iw,iy+r()*ih],(p,o)=>inStrip(p)&&dist(p,nucP)>nr+7&&dist(p,free)>15&&minD(p,chl)>17*cs&&minD(p,mitos)>16&&o.every(q=>dist(p,q)>11));
  const angFor=p=>{const dl=p[0]-ix,dr=ix+iw-p[0],dt=p[1]-iy,db=iy+ih-p[1];return Math.min(dt,db)<Math.min(dl,dr)?r()*30-15:90+r()*30-15;};
  let s=`<path d="${rrPath(ix,iy,iw,ih,Math.max(3,cr-t/2))}" fill="${P.cyto}" data-part="cytoplasm"/>`;
  s+=`<g data-part="vacuole"><path d="${rrPath(vx,vy,vw,vh,vr)}" fill="${P.vac}" stroke="${P.vacS}" stroke-width="1.8"/></g>`;
  s+=`<g data-part="nucleus">${nucleusSVG(nucP[0],nucP[1],nr,P,r)}</g>`;
  s+=`<g data-part="chloro">${chl.map(p=>chloroSVG(p[0],p[1],angFor(p),P,cs)).join('')}</g>`;
  s+=`<g data-part="mito">${mitos.map(p=>mitoSVG(p[0],p[1],r()*180,P,0.7)).join('')}</g>`;
  s+=`<g data-part="ribo">${ribosSVG(ribs,P)}</g>`;
  const wallD=rrPath(x+t/2,y+t/2,w-t,h-t,cr);
  s+=`<g data-part="wall">${wallBand(wallD,t,P,P.wallP)}<path d="${wallD}" fill="none" stroke="#000" stroke-opacity="0" stroke-width="${f1(t+4)}"/></g>`;
  const memD=rrPath(ix+1.5,iy+1.5,iw-3,ih-3,Math.max(3,cr-t/2));
  s+=`<g data-part="membrane"><path d="${memD}" fill="none" stroke="${P.mem}" stroke-width="${f1(P.memW)}"/><path d="${memD}" fill="none" stroke="#000" stroke-opacity="0" stroke-width="6"/></g>`;
  // wall and membrane anchors on two different straight sides, away from corners
  const ws=ipick(r,['L','R']),ms=ws==='L'?'R':'L',u=between(r,0.3,0.7);
  const onWall={L:[x+t/2,y+h*u],R:[x+w-t/2,y+h*u],T:[x+w*u,y+t/2],B:[x+w*u,y+h-t/2]}[ws];
  const v=between(r,0.3,0.7),onMem={L:[ix+1.5,iy+ih*v],R:[ix+iw-1.5,iy+ih*v],T:[ix+iw*v,iy+1.5],B:[ix+iw*v,iy+ih-1.5]}[ms];
  return {svg:s,ext:[w/2+2,h/2+2],rot:10,group:'plant',kind:'Plant cell',parts:{cytoplasm:free,vacuole:[vx+vw/2,vy+vh/2],nucleus:nucP,chloro:chl[0],mito:mitos[0],ribo:ribs[0],wall:onWall,membrane:onMem},has:['nucleus','cytoplasm','membrane','wall','mito','chloro','ribo','vacuole']};}

function yeast(style,seed){const r=rng(seed),P=palette(style,r),t=between(r,7,9.5);
  const rx=between(r,105,132),ry=rx*between(r,0.68,0.82),nb=ipick(r,[0,1,1,1,2]);
  const cx=200-(nb?14:0),cy=140+(nb?6:0);
  const buds=[];let a0=-0.5+between(r,-0.5,0.4);for(let i=0;i<nb;i++){const a=i?a0+Math.PI+between(r,-0.6,0.6):a0,bs=between(r,0.24,0.4);buds.push({a,rx:rx*bs,ry:rx*bs*0.82});}
  buds.forEach(b=>{b.x=cx+(rx+b.rx*0.55)*Math.cos(b.a);b.y=cy+(ry+b.ry*0.55)*Math.sin(b.a);});
  const inEl=(p,s)=>((p[0]-cx)/(rx*s))**2+((p[1]-cy)/(ry*s))**2<1;
  const vr=between(r,20,34),nr=between(r,17,24);
  const vacP=place(r,1,()=>[cx+(r()*2-1)*rx*0.5,cy+(r()*2-1)*ry*0.45],p=>inEl(p,0.8-vr/ry))[0]||[cx+20,cy];
  const nucP=place(r,1,()=>[cx+(r()*2-1)*rx*0.6,cy+(r()*2-1)*ry*0.5],p=>inEl(p,0.8-nr/ry)&&dist(p,vacP)>vr+nr+12)[0]||[cx-50,cy];
  const mitos=place(r,irange(r,2,4),()=>[cx+(r()*2-1)*rx,cy+(r()*2-1)*ry],(p,o)=>inEl(p,0.72)&&dist(p,nucP)>nr+22&&dist(p,vacP)>vr+22&&o.every(q=>dist(p,q)>42));
  const ribs=place(r,irange(r,18,34),()=>[cx+(r()*2-1)*rx,cy+(r()*2-1)*ry],(p,o)=>inEl(p,0.82)&&dist(p,nucP)>nr+8&&dist(p,vacP)>vr+8&&minD(p,mitos)>21&&o.every(q=>dist(p,q)>11));
  const free=best(r,()=>[cx+(r()*2-1)*rx,cy+(r()*2-1)*ry],p=>inEl(p,0.74)?Math.min(dist(p,nucP)-nr-6,dist(p,vacP)-vr-6,minD(p,mitos)-20,minD(p,ribs)-9):-1e9);
  let s='';
  buds.forEach(b=>{s+=`<path d="${ellipsePath(b.x,b.y,b.rx-4,b.ry-4)}" fill="${P.cyto}" data-part="cytoplasm"/>`;
    s+=`<g data-part="wall">${wallBand(ellipsePath(b.x,b.y,b.rx,b.ry),t*0.8,P,P.wallF)}<path d="${ellipsePath(b.x,b.y,b.rx,b.ry)}" fill="none" stroke="#000" stroke-opacity="0" stroke-width="12"/></g>`;
    s+=`<g data-part="membrane"><path d="${ellipsePath(b.x,b.y,b.rx-t*0.8+0.5,b.ry-t*0.8+0.5)}" fill="none" stroke="${P.mem}" stroke-width="${f1(P.memW)}"/></g>`;});
  s+=`<path d="${ellipsePath(cx,cy,rx-t,ry-t)}" fill="${P.cyto}" data-part="cytoplasm"/>`;
  s+=`<g data-part="vacuole"><circle cx="${f1(vacP[0])}" cy="${f1(vacP[1])}" r="${f1(vr)}" fill="${P.vac}" stroke="${P.vacS}" stroke-width="1.8"/></g>`;
  s+=`<g data-part="nucleus">${nucleusSVG(nucP[0],nucP[1],nr,P,r)}</g>`;
  s+=`<g data-part="mito">${mitos.map(p=>mitoSVG(p[0],p[1],r()*180,P,0.85)).join('')}</g>`;
  s+=`<g data-part="ribo">${ribosSVG(ribs,P)}</g>`;
  s+=`<g data-part="wall">${wallBand(ellipsePath(cx,cy,rx-t/2,ry-t/2),t,P,P.wallF)}<path d="${ellipsePath(cx,cy,rx-t/2,ry-t/2)}" fill="none" stroke="#000" stroke-opacity="0" stroke-width="${f1(t+4)}"/></g>`;
  s+=`<g data-part="membrane"><path d="${ellipsePath(cx,cy,rx-t-1.5,ry-t-1.5)}" fill="none" stroke="${P.mem}" stroke-width="${f1(P.memW)}"/><path d="${ellipsePath(cx,cy,rx-t-1.5,ry-t-1.5)}" fill="none" stroke="#000" stroke-opacity="0" stroke-width="6"/></g>`;
  // anchors on the main cell, away from buds
  const far=a=>buds.every(b=>Math.abs(Math.atan2(Math.sin(a-b.a),Math.cos(a-b.a)))>0.9);
  let wa=0;for(let k=0;k<40;k++){wa=r()*TAU;if(far(wa))break;}let ma=wa+Math.PI;for(let k=0;k<40;k++){ma=wa+Math.PI+between(r,-0.8,0.8);if(far(ma))break;}
  const ext=[rx+(nb?Math.max(...buds.map(b=>Math.abs(Math.cos(b.a))*b.rx*1.6)):0)+6,ry+(nb?Math.max(...buds.map(b=>Math.abs(Math.sin(b.a))*b.ry*1.6)):0)+6];
  return {svg:s,ext,rot:180,group:'fungus',kind:'Yeast cell (fungus)',parts:{cytoplasm:free,vacuole:vacP,nucleus:nucP,mito:mitos[0],ribo:ribs[0],wall:[cx+(rx-t*0.3)*Math.cos(wa),cy+(ry-t*0.3)*Math.sin(wa)],membrane:[cx+(rx-t-1.5)*Math.cos(ma),cy+(ry-t-1.5)*Math.sin(ma)]},has:['nucleus','cytoplasm','membrane','wall','mito','ribo','vacuole']};}

function hypha(style,seed){const r=rng(seed),P=palette(style,r),ph=r()*TAU,amp=between(r,5,24),wl=between(r,55,95);
  const cyF=x=>140+amp*Math.sin(x/wl+ph);const X0=-60,X1=460,ow=between(r,30,40),t=between(r,8,10);
  const line=off=>{let d='';for(let x=X0;x<=X1;x+=5)d+=(x===X0?'M':'L')+x+' '+f1(cyF(x)+off);return d;};
  const band=(a,b)=>{let d='';for(let x=X0;x<=X1;x+=5)d+=(x===X0?'M':'L')+x+' '+f1(cyF(x)+a);for(let x=X1;x>=X0;x-=5)d+='L'+x+' '+f1(cyF(x)+b);return d+'Z';};
  const nn=irange(r,4,7),gap=340/nn,nucs=[];for(let i=0;i<nn;i++){const x=40+i*gap+(r()-0.5)*gap*0.3;nucs.push([x,cyF(x)+(r()-0.5)*(ow-t-14)]);}
  const inner=ow-t;
  const mitos=place(r,irange(r,2,5),()=>{const x=20+r()*360;return [x,cyF(x)+(r()-0.5)*(inner-10)*1.5];},(p,o)=>Math.abs(p[1]-cyF(p[0]))<inner-9&&minD(p,nucs)>30&&o.every(q=>dist(p,q)>44));
  const ribs=place(r,irange(r,18,30),()=>{const x=10+r()*380;return [x,cyF(x)+(r()-0.5)*2*inner];},(p,o)=>Math.abs(p[1]-cyF(p[0]))<inner-6&&minD(p,nucs)>17&&minD(p,mitos)>20&&o.every(q=>dist(p,q)>11));
  const free=best(r,()=>{const x=50+r()*300;return [x,cyF(x)+(r()-0.5)*inner];},p=>Math.min(minD(p,nucs)-16,minD(p,mitos)-18,minD(p,ribs)-9,inner-6-Math.abs(p[1]-cyF(p[0]))));
  const ex=isExam(P);
  let s=`<path d="${band(-inner,inner)}" fill="${P.cyto}" data-part="cytoplasm"/>`;
  s+=`<g data-part="nucleus">${nucs.map(p=>`<g transform="translate(${f1(p[0])} ${f1(p[1])})"><ellipse rx="12" ry="9.5" fill="${P.nuc}" stroke="${P.nucS}" stroke-width="1.8"/><circle cx="3" cy="-2" r="3.2" fill="${P.nucl}" opacity=".75"/><ellipse rx="16" ry="13" fill="transparent"/></g>`).join('')}</g>`;
  s+=`<g data-part="mito">${mitos.map(p=>mitoSVG(p[0],p[1],(r()-0.5)*40,P,0.8)).join('')}</g>`;
  s+=`<g data-part="ribo">${ribosSVG(ribs,P)}</g>`;
  s+=`<g data-part="wall"><path d="${band(-ow,-inner)}" fill="${ex?'#fff':P.wallF}" stroke="${ex?'#111':'none'}" stroke-width="1.4"/><path d="${band(inner,ow)}" fill="${ex?'#fff':P.wallF}" stroke="${ex?'#111':'none'}" stroke-width="1.4"/><path d="${line(-ow-1)}" fill="none" stroke="#000" stroke-opacity="0" stroke-width="9"/><path d="${line(ow+1)}" fill="none" stroke="#000" stroke-opacity="0" stroke-width="9"/></g>`;
  s+=`<g data-part="membrane"><path d="${line(-inner-1)}" fill="none" stroke="${P.mem}" stroke-width="${f1(P.memW)}"/><path d="${line(inner+1)}" fill="none" stroke="${P.mem}" stroke-width="${f1(P.memW)}"/><path d="${line(-inner-1)}" fill="none" stroke="#000" stroke-opacity="0" stroke-width="4"/><path d="${line(inner+1)}" fill="none" stroke="#000" stroke-opacity="0" stroke-width="4"/></g>`;
  const wx=between(r,250,320),mx=between(r,80,150);const top=r()<0.5?-1:1;
  return {svg:s,ext:null,rot:8,group:'fungus',kind:'Fungal hypha (e.g. Mucor)',parts:{cytoplasm:free,nucleus:nucs[Math.floor(nn/2)],mito:mitos.find(p=>p[0]>60&&p[0]<340)||mitos[0],ribo:ribs.find(p=>p[0]>60&&p[0]<340)||ribs[0],wall:[wx,cyF(wx)+top*(ow-2)],membrane:[mx,cyF(mx)-top*(inner+1)]},has:['nucleus','cytoplasm','membrane','wall','mito','ribo']};}

function bacterium(style,seed,shape){const r=rng(seed),P=palette(style,r),t=between(r,6,8),cx=200,cy=140;let outer,inner,inside,wallPt,memPt,extra='',ext;
  let rodW=0,rodH=0,rodR=0;
  if(shape==='rod'){const w=between(r,220,310),h=between(r,88,124),x=cx-w/2,y=cy-h/2;rodW=w;rodH=h;
    outer=rrPath(x+t/2,y+t/2,w-t,h-t,(h-t)/2);inner=rrPath(x+t+1.5,y+t+1.5,w-2*t-3,h-2*t-3,(h-2*t-3)/2);
    inside=(p,m=0)=>{const rr=h/2-t-m;const qx=Math.max(x+h/2,Math.min(x+w-h/2,p[0]));return Math.hypot(p[0]-qx,p[1]-cy)<rr;};
    const flags=ipick(r,[0,1,1,2,3]),fl=[];for(let i=0;i<flags;i++){const end=i===1?-1:1,off=i===2?between(r,-0.5,0.5)*h*0.6:between(r,-0.15,0.15)*h;fl.push([end,off]);}
    fl.forEach(([end,off])=>{const sx=end>0?x+w-2:x+2,ph=r()*TAU,amp=between(r,6,12);let d=`M${f1(sx)} ${f1(cy+off)}`;for(let i=1;i<=12;i++)d+=`L${f1(sx+end*i*6)} ${f1(cy+off+Math.sin(i*0.9+ph)*amp)}`;extra+=`<path d="${d}" fill="none" stroke="${P.flag}" stroke-width="2"/>`;});
    if(!isExam(P)&&r()<0.5)extra=`<path d="${rrPath(x-9,y-9,w+18,h+18,h/2+9)}" fill="${P.cap}" stroke="none"/>`+extra;
    const lw=fl.some(f=>f[0]<0),rw=fl.some(f=>f[0]>0),ta=(lw?between(r,0.55,0.9):between(r,0.15,0.4))*(r()<0.5?1:-1),tb=(rw?between(r,0.55,0.9):between(r,0.15,0.4))*(r()<0.5?1:-1);
    const rw1=h/2-t*0.3,rm=h/2-t-2.5;wallPt=[x+h/2-rw1*Math.cos(ta),cy+rw1*Math.sin(ta)];memPt=[x+w-h/2+rm*Math.cos(tb),cy+rm*Math.sin(tb)];
    ext=[w/2+(fl.length?78:12),h/2+(fl.length?16:12)];}
  else{const R=between(r,86,112);rodR=R;outer=ellipsePath(cx,cy,R-t/2,R-t/2);inner=ellipsePath(cx,cy,R-t-1.5,R-t-1.5);inside=(p,m=0)=>Math.hypot(p[0]-cx,p[1]-cy)<R-t-m;
    if(!isExam(P)&&r()<0.4)extra=`<circle cx="${cx}" cy="${cy}" r="${f1(R+9)}" fill="${P.cap}"/>`;
    const wa=r()*TAU,ma=wa+Math.PI+between(r,-0.7,0.7);wallPt=[cx+(R-t*0.3)*Math.cos(wa),cy+(R-t*0.3)*Math.sin(wa)];memPt=[cx+(R-t-2.5)*Math.cos(ma),cy+(R-t-2.5)*Math.sin(ma)];ext=[R+12,R+12];}
  // chromosome: tangled closed loop, size and tangle vary
  const ph=r()*TAU,k1=irange(r,5,9),k2=irange(r,10,15),a1=between(r,0.18,0.32),a2=between(r,0.08,0.18),kmax=1+a1+a2;let sc;
  if(shape==='rod'){const hh=(rodH/2-t-14)/kmax;sc=[Math.min(between(r,48,70),(rodW/2-rodH/2+hh*0.6)),Math.min(between(r,18,26),hh)];}else{const lim=(rodR-t-16)/kmax;sc=[Math.min(between(r,30,44),lim),Math.min(between(r,28,40),lim)];}
  const ccx=cx+(shape==='rod'?between(r,-12,12):0),ccy=cy+(shape==='rod'?0:between(r,-8,8));let cd='';const chrPts=[];
  for(let i=0;i<=180;i++){const a=i/180*TAU,k=1+a1*Math.sin(k1*a+ph)+a2*Math.sin(k2*a+ph*2);const p=[ccx+sc[0]*k*Math.cos(a),ccy+sc[1]*k*Math.sin(a)];chrPts.push(p);cd+=(i?'L':'M')+f1(p[0])+' '+f1(p[1]);}
  const nearChr=(p,m)=>chrPts.some(q=>dist(p,q)<m);
  const rp=()=>[cx-160+r()*320,cy-100+r()*200];
  let pls=place(r,irange(r,1,shape==='rod'?4:3),rp,(p,o)=>inside(p,18)&&!nearChr(p,20)&&o.every(q=>dist(p,q)>36));
  if(!pls.length)pls=[best(r,rp,p=>inside(p,14)?Math.min(...chrPts.map(q=>dist(p,q)))-12:-1e9,1500)];
  const ribs=place(r,irange(r,16,30),rp,(p,o)=>inside(p,6)&&!nearChr(p,11)&&minD(p,pls)>16&&o.every(q=>dist(p,q)>11));
  const free=best(r,rp,p=>inside(p,9)?Math.min(Math.min(...chrPts.map(q=>dist(p,q)))-8,minD(p,pls)-14,minD(p,ribs)-9):-1e9);
  let s=extra+`<path d="${inner}" fill="${P.cytoB}" data-part="cytoplasm"/>`;
  s+=`<g data-part="chromo"><path d="${cd}Z" fill="none" stroke="${P.chr}" stroke-width="2.4" stroke-linejoin="round"/><path d="${cd}Z" fill="none" stroke="#000" stroke-opacity="0" stroke-width="9"/></g>`;
  s+=`<g data-part="plasmid">${pls.map(p=>`<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="${f1(between(r,6,9.5))}" fill="none" stroke="${P.pla}" stroke-width="2.4"/><circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="13" fill="transparent"/>`).join('')}</g>`;
  s+=`<g data-part="ribo">${ribosSVG(ribs,P)}</g>`;
  s+=`<g data-part="wall">${wallBand(outer,t,P,P.wallB)}<path d="${outer}" fill="none" stroke="#000" stroke-opacity="0" stroke-width="${f1(t+4)}"/></g>`;
  s+=`<g data-part="membrane"><path d="${inner}" fill="none" stroke="${P.mem}" stroke-width="${f1(P.memW)}"/><path d="${inner}" fill="none" stroke="#000" stroke-opacity="0" stroke-width="6"/></g>`;
  const chrPt=chrPts.reduce((a,b)=>b[1]<a[1]?b:a);
  return {svg:s,ext,rot:shape==='rod'?35:180,group:'bacteria',kind:shape==='rod'?'Rod-shaped bacterium (e.g. Lactobacillus)':'Spherical bacterium (e.g. Pneumococcus)',parts:{cytoplasm:free,chromo:chrPt,plasmid:pls[0],ribo:ribs[0],wall:wallPt,membrane:memPt},has:['cytoplasm','membrane','wall','ribo','plasmid','chromo']};}

const CELLS={animal,plant,yeast,hypha,rod:(s,sd)=>bacterium(s,sd,'rod'),coccus:(s,sd)=>bacterium(s,sd,'coccus')};
/* Rotate, mirror and fit each drawing into the 400 x 280 frame, moving the label anchors with it. */
function cell(type,style,seed){const c=CELLS[type](style,seed),r=rng((seed^0x5bd1e995)>>>0);
  const deg=(r()*2-1)*c.rot,flip=r()<0.5?-1:1,a=deg*Math.PI/180,co=Math.cos(a),si=Math.sin(a);
  let s;if(c.ext){const [hw,hh]=c.ext;s=Math.min(1,188/(Math.abs(hw*co)+Math.abs(hh*si)),128/(Math.abs(hw*si)+Math.abs(hh*co)));}else s=1.08;
  const T=p=>{const dx=(p[0]-200)*s*flip,dy=(p[1]-140)*s;return [200+dx*co-dy*si,140+dx*si+dy*co];};
  c.svg=`<g transform="translate(200 140) rotate(${f1(deg)}) scale(${(s*flip).toFixed(3)} ${s.toFixed(3)}) translate(-200 -140)">${c.svg}</g>`;
  for(const k in c.parts)if(c.parts[k])c.parts[k]=T(c.parts[k]);
  c.w=400;c.h=280;c.type=type;c.style=style;c.seed=seed;return c;}

/* ---------- fields of cells "under the microscope" ---------- */
function field(type,seed){const r=rng(seed),W=400,H=300,cx=200,cy=150,R=146;let body='',bg='#f3efe2',scale='',cap='';
  const jit=a=>(r()-0.5)*a;
  if(type==='onion'){const st=ipick(r,[
      {n:'stained with iodine',bg:'#f1e3b4',f:'#ead39a',s:'#7a5a1c',k:'#8a5f16',kn:'#5a3a08'},
      {n:'unstained',bg:'#ececea',f:'#e2e2dc',s:'#8f8f88',k:'#b0aea4',kn:'#8a887e'},
      {n:'red onion, unstained',bg:'#f3e9ee',f:'#c76a8f',s:'#7a2d4d',k:'#8f3f62',kn:'#5f1f3c',pale:true},
      {n:'stained with methylene blue',bg:'#e6f0f7',f:'#bfd9ea',s:'#2f5f8a',k:'#1f4f8f',kn:'#0e2f5f'}]);
    bg=st.bg;cap='Onion epidermis cells, '+st.n;scale='100 µm';const rows=irange(r,4,8),rh=H/rows,cw=between(r,90,180);
    for(let i=0;i<rows;i++){let x=-60-r()*40;const y=i*rh+jit(6);while(x<W+40){const w=cw*between(r,0.75,1.25);const pts=[[x+jit(8),y+jit(5)],[x+w+jit(8),y+jit(5)],[x+w+jit(8),y+rh+jit(5)],[x+jit(8),y+rh+jit(5)]];
      body+=`<path d="M${pts.map(p=>f1(p[0])+' '+f1(p[1])).join('L')}Z" fill="${st.pale&&r()<0.3?'#e8c9d6':st.f}" stroke="${st.s}" stroke-width="${f1(between(r,2,3.2))}"/>`;
      if(r()<0.8){const nx=x+w*(0.2+r()*0.6),ny=y+rh*(0.3+r()*0.4),nrx=Math.min(rh*0.22,8+r()*4);body+=`<ellipse cx="${f1(nx)}" cy="${f1(ny)}" rx="${f1(nrx)}" ry="${f1(nrx*0.75)}" fill="${st.k}" opacity=".85"/><circle cx="${f1(nx+2)}" cy="${f1(ny-1)}" r="2.2" fill="${st.kn}"/>`;}
      x+=w;}}}
  else if(type==='elodea'){bg=ipick(r,['#dcebc4','#e6f0d2','#d4e7c0']);cap='Leaf cells of pondweed (Elodea), showing chloroplasts';scale='50 µm';
    const rows=irange(r,5,9),rh=H/rows,cw=between(r,45,90),nch=irange(r,10,26),chc=ipick(r,['#3f8f2a','#2e7d32','#558b2f']);
    for(let i=0;i<rows;i++){let x=-30-r()*30;const y=i*rh+jit(4);while(x<W+30){const w=cw*between(r,0.8,1.25);
      body+=`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(rh)}" rx="4" fill="#e9f3d6" stroke="#6c8a3c" stroke-width="2.2"/>`;
      for(let k=0;k<nch;k++){let px,py;if(r()<0.5){px=x+5+r()*(w-10);py=r()<0.5?y+6+r()*5:y+rh-6-r()*5;}else{py=y+6+r()*(rh-12);px=r()<0.5?x+6+r()*5:x+w-6-r()*5;}
        body+=`<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="4.2" ry="3.2" fill="${chc}" opacity=".9"/>`;}
      x+=w;}}}
  else if(type==='cheek'){const st=ipick(r,[
      {n:'stained with methylene blue',bg:'#eef3f8',f:'#c9dcf0',s:'#7aa0c8',k:'#1f4f8f',d:'#5878a8'},
      {n:'unstained',bg:'#efefed',f:'#e4e4e0',s:'#a3a39c',k:'#9b9a92',d:'#999'},
      {n:'stained with iodine',bg:'#f6efdc',f:'#efdcb0',s:'#b08a45',k:'#7a5418',d:'#a07a3a'}]);
    bg=st.bg;cap='Human cheek cells, '+st.n;scale='50 µm';
    const n=irange(r,5,12),sz=between(r,28,52);
    for(let k=0;k<n;k++){const px=30+r()*340,py=30+r()*240,s=sz*between(r,0.8,1.2);const b=blobPath(px,py,s,s*(0.7+r()*0.35),r,3.2);
      body+=`<path d="${b.d}" fill="${st.f}" fill-opacity=".75" stroke="${st.s}" stroke-width="1.6"/>`;
      body+=`<path d="M${f1(px-s*0.6)} ${f1(py+s*0.2)}q${f1(s*0.4)} ${f1(-s*0.25)} ${f1(s*0.9)} ${f1(-s*0.05)}" fill="none" stroke="${st.s}" stroke-opacity=".5" stroke-width="1.2"/>`;
      body+=`<ellipse cx="${f1(px+jit(14))}" cy="${f1(py+jit(10))}" rx="${f1(6+r()*3)}" ry="${f1(5+r()*2)}" fill="${st.k}"/>`;}
    for(let k=0;k<30;k++)body+=`<circle cx="${f1(r()*W)}" cy="${f1(r()*H)}" r="${f1(0.8+r())}" fill="${st.d}" opacity=".5"/>`;}
  else if(type==='yeast'){const blue=r()<0.4;bg=blue?'#eef2f8':'#eceae4';cap='Yeast cells (a single-celled fungus), some budding'+(blue?', stained with methylene blue':'');scale='10 µm';
    const sz=between(r,11,17),cs=place(r,irange(r,14,30),()=>[r()*W,r()*H],(p,o)=>o.every(q=>dist(p,q)>sz*2.3));
    cs.forEach(p=>{const a=r()*180,rx=sz*between(r,0.9,1.15),ry=rx*between(r,0.7,0.88),dead=blue&&r()<0.2;const f=blue?(dead?'#3f5fa8':'#cfdcf0'):'#d9d2c3',st=blue?'#3a5a90':'#5f574a';
      body+=`<g transform="translate(${f1(p[0])} ${f1(p[1])}) rotate(${f1(a)})"><ellipse rx="${f1(rx)}" ry="${f1(ry)}" fill="${f}" stroke="${st}" stroke-width="2"/>${!dead&&r()<0.6?`<circle cx="${f1(jit(6))}" cy="${f1(jit(4))}" r="${f1(rx*0.35)}" fill="#f4f1ea" stroke="#9a907f" stroke-width="1"/>`:''}${r()<0.45?`<ellipse cx="${f1(rx+rx*0.35)}" cy="0" rx="${f1(rx*0.45)}" ry="${f1(rx*0.4)}" fill="${f}" stroke="${st}" stroke-width="1.8"/>`:''}</g>`;});}
  else if(type==='hyphae'){const blue=r()<0.45;bg=blue?'#f1f4f9':'#efede6';cap='Mould hyphae (fungus) with spore cases (sporangia)'+(blue?', stained with cotton blue':'');scale='100 µm';
    const sc=blue?'#2f4f9a':'#6d6a60',ic=blue?'#9fb4e0':'#e2dfd5',spc=blue?'#1f2f6a':'#3c3a35';
    const tips=[],nt=irange(r,6,11);for(let k=0;k<nt;k++){const fromLeft=k%3===0;let x=fromLeft?-10:r()*W,y=fromLeft?r()*H:H+10,a=fromLeft?jit(0.8):-Math.PI/2+jit(1.2);let d=`M${f1(x)} ${f1(y)}`;for(let i=0;i<34;i++){a+=jit(0.25);x+=Math.cos(a)*10;y+=Math.sin(a)*10;d+=`L${f1(x)} ${f1(y)}`;if((i===12||i===22)&&r()<0.7){tips.push([x,y,a+(r()<0.5?-0.9:0.9)]);}}
      body+=`<path d="${d}" fill="none" stroke="${sc}" stroke-width="5" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${ic}" stroke-width="2.4" stroke-linecap="round"/>`;tips.push([x,y,a]);}
    const spP=between(r,0.4,0.85);tips.forEach(([x,y,a])=>{let d=`M${f1(x)} ${f1(y)}`,xx=x,yy=y;for(let i=0;i<8;i++){a+=jit(0.2);xx+=Math.cos(a)*9;yy+=Math.sin(a)*9;d+=`L${f1(xx)} ${f1(yy)}`;}
      body+=`<path d="${d}" fill="none" stroke="${sc}" stroke-width="4" stroke-linecap="round"/>`;if(r()<spP)body+=`<circle cx="${f1(xx)}" cy="${f1(yy)}" r="${f1(9+r()*4)}" fill="${spc}"/>`;});}
  else if(type==='rods'){const pos=r()<0.5;bg=pos?'#f4f2fa':'#f9f1f4';const col=pos?ipick(r,['#4a148c','#5e35b1']):ipick(r,['#c2185b','#a01f7a','#d81b60']);
    cap='Rod-shaped bacteria ('+(pos?'purple':'pink')+' after Gram staining)';scale='5 µm';
    const n=irange(r,60,140),L=between(r,9,20),Wd=between(r,4,6),chains=r()<0.35;
    for(let k=0;k<n;k++){let x=r()*W,y=r()*H;const a=r()*180,m=chains?irange(r,1,4):1;for(let i=0;i<m;i++){const l=L*between(r,0.8,1.2);body+=`<rect x="${f1(-l/2)}" y="${f1(-Wd/2)}" width="${f1(l)}" height="${f1(Wd)}" rx="${f1(Wd/2)}" fill="${col}" transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a)})"/>`;x+=Math.cos(a*Math.PI/180)*(l+1);y+=Math.sin(a*Math.PI/180)*(l+1);}}}
  else if(type==='cocci'){const pos=r()<0.7,col=pos?ipick(r,['#4a2a8c','#3949ab','#5e35b1']):'#c2185b',arr=ipick(r,['clusters','chains','pairs']);bg=pos?'#f4f2fa':'#f9f1f4';
    cap='Spherical bacteria (stained), in '+arr;scale='5 µm';const rr=between(r,3,4.4);
    for(let k=0;k<(arr==='clusters'?18:45);k++){let x=r()*W,y=r()*H;
      if(arr==='clusters'){const n=irange(r,4,14);for(let i=0;i<n;i++){body+=`<circle cx="${f1(x+jit(rr*7))}" cy="${f1(y+jit(rr*7))}" r="${f1(rr)}" fill="${col}"/>`;}}
      else{const a=r()*TAU,n=arr==='pairs'?2:irange(r,3,8);let ang=a;for(let i=0;i<n;i++){body+=`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr)}" fill="${col}"/>`;if(arr==='chains')ang+=jit(0.5);x+=Math.cos(ang)*rr*2.05;y+=Math.sin(ang)*rr*2.05;}}}}
  const id='f'+seed+type;
  const inner=`<defs><clipPath id="c${id}"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath><filter id="b${id}"><feGaussianBlur stdDeviation="${f1(between(r,0.4,0.9))}"/></filter><radialGradient id="v${id}"><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient></defs>
  <rect width="${W}" height="${H}" fill="#121212"/><g clip-path="url(#c${id})"><rect width="${W}" height="${H}" fill="${bg}"/><g filter="url(#b${id})" transform="rotate(${f1(between(r,-25,25))} ${cx} ${cy})">${body}</g><circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#v${id})"/></g>
  <g><line x1="${W-92}" y1="${H-16}" x2="${W-32}" y2="${H-16}" stroke="#fff" stroke-width="3"/><text x="${W-62}" y="${H-24}" fill="#fff" font-size="12" text-anchor="middle" font-family="Barlow, sans-serif">${scale}</text></g>`;
  const group={onion:'plant',elodea:'plant',cheek:'animal',yeast:'fungus',hyphae:'fungus',rods:'bacteria',cocci:'bacteria'}[type];
  return {svg:inner,w:W,h:H,group,caption:cap,type};}

window.Cells={PARTS,GROUPS,cell,field,wrap,rng,CELL_TYPES:Object.keys(CELLS),FIELD_TYPES:['onion','elodea','cheek','yeast','hyphae','rods','cocci']};
})();
