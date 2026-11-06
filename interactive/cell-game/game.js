/* What The Cell: game logic. Needs cells.js. */
(function(){
const $=id=>document.getElementById(id);
const C=window.Cells,P=C.PARTS,G=C.GROUPS;
const GK=['animal','plant','fungus','bacteria'];
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const seed=()=>Math.floor(Math.random()*1e9);
const gname=g=>G[g].name;
const store={get(k){try{return JSON.parse(localStorage.getItem('cellspotter:'+k));}catch(e){return null;}},set(k,v){try{localStorage.setItem('cellspotter:'+k,JSON.stringify(v));}catch(e){}}};

/* ---------------- media pools ---------------- */
const PHOTOS=[
 {src:'img/saccharomyces_cerevisiae.jpg',group:'fungus',cap:'Yeast cells (scanning electron microscope). Some are budding.',clue:'Small oval cells, some with buds growing off them: yeast, a single-celled fungus.'},
 {src:'img/candida_albicans.jpg',group:'fungus',cap:'Candida, a fungus, growing threads (hyphae) and round spores.',clue:'Thread-like hyphae with round spores: a fungus.'},
 {src:'img/rhizopus_stolonifer.jpeg',group:'fungus',cap:'Bread mould: a tangle of hyphae with black spore cases.',clue:'A mesh of thin threads (a mycelium of hyphae) with dark spore cases: a mould, which is a fungus.'},
 {src:'img/mucor_mucedo.jpg',group:'fungus',cap:'Mucor mould growing as a fluffy mycelium.',clue:'The fluffy white mass is a mycelium made of hyphae: Mucor, a fungus.'},
 {src:'img/escherichia_coli.jpg',group:'bacteria',cap:'E. coli, rod-shaped bacteria (scanning electron microscope). The scale bar is 1 µm.',clue:'Tiny rod-shaped cells, only about 2 µm long: bacteria.'},
 {src:'img/lactobacillus_acidophilus.jpg',group:'bacteria',cap:'Lactobacillus, rod-shaped bacteria like those used to make yoghurt.',clue:'Tiny rods in chains: Lactobacillus bacteria.'},
 {src:'img/streptococcus_pneumoniae.jpg',group:'bacteria',cap:'Pneumococcus, spherical bacteria that cause pneumonia (stained).',clue:'Tiny round cells, mostly in pairs: Pneumococcus bacteria.'},
 {src:'img/bacillus_subtilis.jpg',group:'bacteria',cap:'Rod-shaped bacteria (stained). The scale bar is 10 µm.',clue:'Very small rod-shaped cells with no visible nucleus: bacteria.'},
 {src:'img/staphylococcus_aureus.jpg',group:'bacteria',cap:'Spherical bacteria in clusters (stained).',clue:'Masses of tiny round cells: spherical bacteria.'}
];
/* Openly licensed Wikimedia photos (img/wiki/photos.js), with a GCSE clue per type */
const WIKI_CLUE={
 'onion-epidermis':'Box-shaped cells fitted together like bricks, each with a cell wall and a nucleus. No chloroplasts, because onion bulbs grow underground, but it\u2019s still a plant.',
 'elodea-leaf':'Box-shaped cells with cell walls, full of green chloroplasts: plant leaf cells.',
 'moss-leaf':'Cells with walls, packed with green chloroplasts: plant cells.',
 'leaf-section':'Tightly packed cells with walls, including tall palisade cells near the top surface: plant tissue from a leaf.',
 'stomata':'Two guard cells around a pore (a stoma) in a leaf: plant cells.',
 'root-tip':'Box-shaped cells with walls and large nuclei, some dividing: plant root cells.',
 'cheek':'Irregular, flat cells with no cell wall, each with a nucleus: animal cells.',
 'blood':'Red blood cells (which have no nucleus) and a white blood cell: animal cells.',
 'neuron':'Nerve cells with long branches and no cell wall: animal cells.',
 'other':'No cell wall, no chloroplasts, and each cell has a nucleus (except mammal red blood cells): animal cells.',
 'yeast':'Small oval cells, some budding: yeast, a single-celled fungus.',
 'mould':'Thread-like hyphae carrying spores: a mould, which is a fungus.',
 'conidiophores':'Hyphae ending in round heads of spores: a mould, which is a fungus.',
 'hyphae':'A mesh of thin threads (hyphae): a fungus.',
 'rods':'Tiny rod-shaped cells, far smaller than plant or animal cells, with no nucleus: bacteria.',
 'cocci':'Tiny round cells in clusters or chains, only about 1 \u00b5m across: bacteria.',
 'lactobacillus':'Tiny rods: Lactobacillus, the type of bacteria used to make yoghurt.',
 'electron':'Cells only a micrometre or two long with no nucleus: bacteria. The colours are added.'
};
(window.WIKI_PHOTOS||[]).forEach(w=>PHOTOS.push({src:w.src,group:w.group,cap:w.cap+'. Photo: '+w.artist+', '+w.lic+'.',clue:WIKI_CLUE[w.type]||'',wiki:true}));
const FIELD_CLUE={
 onion:'Box-shaped cells fitted together like bricks, each with a cell wall and a nucleus. No chloroplasts, because onion bulbs grow underground, but it’s still a plant.',
 elodea:'Box-shaped cells with walls, packed with green chloroplasts: plant leaf cells.',
 cheek:'Irregular, floppy shapes with no cell wall, each with a nucleus: animal cells.',
 yeast:'Small oval cells, some budding: yeast, a single-celled fungus.',
 hyphae:'Long branching threads (hyphae) with dark spore cases on stalks: a mould, which is a fungus.',
 rods:'Look at the scale bar: these rods are only a few micrometres long, far smaller than plant or animal cells. Bacteria.',
 cocci:'Tiny round cells in pairs and chains, only about 1 µm across: bacteria.'
};
const CELL_CLUE={
 animal:'A nucleus, but no cell wall, no chloroplasts and no large vacuole: an animal cell.',
 plant:'Cell wall, chloroplasts and a large permanent vacuole: a plant cell.',
 yeast:'A cell wall and a nucleus but no chloroplasts, and a bud growing off it: yeast, a fungus.',
 hypha:'A long thread (hypha) with a wall and many nuclei: a fungus such as Mucor.',
 rod:'No nucleus. The DNA is a circular chromosome, with plasmids: a bacterium.',
 coccus:'No nucleus. The DNA is a circular chromosome, with plasmids: a spherical bacterium.'
};
function photoHTML(p){return `<img src="${p.src}" alt="Microscope image" loading="eager">`;}
function fieldItem(type){const f=C.field(type,seed());return {html:C.wrap(f.svg,f.w,f.h),group:f.group,cap:f.caption,clue:FIELD_CLUE[type],kind:'field',key:'field:'+type};}
function cellItem(type,style){const c=C.cell(type,style||pick(['colour','exam']),seed());return {html:C.wrap(c.svg,c.w,c.h),group:c.group,cap:c.kind+(c.style==='exam'?' (exam-style diagram)':' (diagram)'),clue:CELL_CLUE[type],kind:'cell',key:'cell:'+type,white:true,cell:c};}
function photoItem(p){return {html:photoHTML(p),group:p.group,cap:p.cap,clue:p.clue,kind:'photo',key:p.src};}
const FIELDS_BY={plant:['onion','elodea'],animal:['cheek'],fungus:['yeast','hyphae'],bacteria:['rods','cocci']};
const CELLS_BY={plant:['plant'],animal:['animal'],fungus:['yeast','hypha'],bacteria:['rod','coccus']};
/* Difficulty: normal = drawings + drawn microscope views + the few clear photos; hard = mostly the real Wikimedia lab photos */
let DIFF=store.get('diff')==='hard'?'hard':'normal';
function anyItem(group,kinds=['photo','photo','field','cell'],avoid=new Set()){
  if(DIFF==='hard')kinds=['photo','photo','photo','photo','photo','field'];
  for(let t=0;t<30;t++){const k=pick(kinds);let it;
    if(k==='photo'){const ps=PHOTOS.filter(p=>p.group===group&&(DIFF==='hard'?p.wiki:!p.wiki));if(!ps.length)continue;it=photoItem(pick(ps));}
    else if(k==='field')it=fieldItem(pick(FIELDS_BY[group]));
    else it=cellItem(pick(CELLS_BY[group]));
    if(!avoid.has(it.key)||t>25){avoid.add(it.key);return it;}}
}
function groupsSeq(n){let out=[];while(out.length<n)out=out.concat(shuffle(GK));return out.slice(0,n);}

/* ---------------- content banks ---------------- */
const HAS={animal:['nucleus','cytoplasm','membrane','mito','ribo'],plant:['nucleus','cytoplasm','membrane','wall','mito','chloro','ribo','vacuole'],fungus:['nucleus','cytoplasm','membrane','wall','mito','ribo'],bacteria:['cytoplasm','membrane','wall','ribo','plasmid','chromo']};
const NOT={animal:['wall','chloro','plasmid','chromo'],plant:['plasmid','chromo'],fungus:['chloro','chromo'],bacteria:['nucleus','mito','chloro']};
const SORT=[
 {q:'a nucleus',a:['animal','plant','fungus'],why:'Bacteria have no nucleus. Their DNA is a circular chromosome, plus plasmids, loose in the cytoplasm.',tag:'Nucleus'},
 {q:'a cell membrane',a:GK,why:'Every cell has a membrane to control what goes in and out.',tag:'Cell membrane'},
 {q:'cytoplasm',a:GK,why:'Every cell has cytoplasm, where most chemical reactions happen.',tag:'Cytoplasm'},
 {q:'ribosomes',a:GK,why:'All cells make proteins, so all cells have ribosomes.',tag:'Ribosomes'},
 {q:'a cell wall',a:['plant','fungus','bacteria'],why:'Only animal cells have no wall. Plant walls are cellulose, fungal walls are chitin, and bacterial walls are neither.',tag:'Cell wall'},
 {q:'mitochondria',a:['animal','plant','fungus'],why:'Bacteria have no mitochondria. Plant cells have them as well as chloroplasts.',tag:'Mitochondria'},
 {q:'chloroplasts',a:['plant'],why:'Only plant cells have chloroplasts, and not all of them (root cells don’t).',tag:'Chloroplasts'},
 {q:'plasmids',a:['bacteria'],why:'Plasmids are small extra rings of DNA. At GCSE they are a bacterial feature.',tag:'Plasmid'},
 {q:'a circular chromosome instead of a nucleus',a:['bacteria'],why:'Bacteria are prokaryotes: no nucleus, just one loop of DNA.',tag:'Circular chromosome'},
 {q:'a cell wall made of cellulose',a:['plant'],why:'Cellulose walls are a plant feature. Fungi use chitin.',tag:'Cell wall (cellulose)'},
 {q:'a cell wall made of chitin',a:['fungus'],why:'Chitin walls are a fungal feature.',tag:'Cell wall (chitin)'},
 {q:'a large permanent vacuole containing cell sap',a:['plant'],why:'The large permanent vacuole full of cell sap is a plant cell feature.',tag:'Vacuole'},
 {q:'thread-like hyphae',a:['fungus'],why:'Moulds like Mucor are made of hyphae, which form a mycelium.',tag:'Hyphae'},
 {q:'can store carbohydrate as glycogen',a:['animal','fungus'],why:'Animals store glycogen, and fungi may too. Plants store starch or sucrose.',tag:'Glycogen and starch'},
 {q:'can store carbohydrate as starch',a:['plant'],why:'Plants store carbohydrate as starch (or sucrose).',tag:'Glycogen and starch'},
 {q:'can be single-celled',a:['fungus','bacteria'],why:'Bacteria are always single-celled, and some fungi (yeast) are too. At GCSE, plants and animals are multicellular.',tag:'Single-celled organisms'},
 {q:'can photosynthesise',a:['plant','bacteria'],why:'Plants photosynthesise, and the spec says some bacteria can too. Fungi and animals can’t.',tag:'Photosynthesis'}
];
const TF=[
 ['Bacteria have a nucleus.',false,'Bacteria have no nucleus. Their DNA is a circular chromosome plus plasmids.','Nucleus'],
 ['Bacterial DNA is found as a circular chromosome and plasmids.',true,'Correct. This is because bacteria have no nucleus.','Circular chromosome'],
 ['Plant cell walls are made of cellulose.',true,'Yes. Fungal walls are chitin.','Cell wall (cellulose)'],
 ['Fungal cell walls are made of cellulose.',false,'Fungal walls are made of chitin.','Cell wall (chitin)'],
 ['Animal cells have a cell wall.',false,'Animal cells have a membrane but no wall.','Cell wall'],
 ['Mitochondria are found in animal, plant and fungal cells.',true,'Yes, but not in bacteria.','Mitochondria'],
 ['Bacteria contain mitochondria.',false,'Bacteria have no mitochondria.','Mitochondria'],
 ['All plant cells contain chloroplasts.',false,'Root cells and onion bulb cells have none, because they get no light.','Chloroplasts'],
 ['Ribosomes are found in all four types of cell.',true,'Every cell makes proteins, so every cell has ribosomes.','Ribosomes'],
 ['Ribosomes are where proteins are made.',true,'That’s their job: protein synthesis.','Ribosomes'],
 ['The cell membrane controls what enters and leaves the cell.',true,'Yes. The wall doesn’t do this; it strengthens and supports.','Cell membrane'],
 ['The cell wall controls what enters and leaves the cell.',false,'That’s the membrane. The wall strengthens and supports the cell.','Cell wall'],
 ['Most chemical reactions take place in the cytoplasm.',true,'Yes.','Cytoplasm'],
 ['Fungi can photosynthesise.',false,'Fungi have no chloroplasts. They feed saprotrophically by secreting enzymes onto food.','Photosynthesis'],
 ['Some bacteria can photosynthesise.',true,'The spec says some can, though most feed on other living or dead things.','Photosynthesis'],
 ['Yeast is a single-celled fungus.',true,'Yes. It reproduces by budding.','Single-celled organisms'],
 ['Mucor is made of thread-like hyphae.',true,'Its hyphae form a mycelium.','Hyphae'],
 ['Fungal hyphae contain many nuclei.',true,'Yes, the spec says so.','Hyphae'],
 ['Plant cells usually have a large permanent vacuole filled with cell sap.',true,'Yes.','Vacuole'],
 ['Plasmids are small rings of DNA.',true,'Yes, found in bacteria.','Plasmid'],
 ['Animal cells store carbohydrate as starch.',false,'Animals store glycogen. Plants store starch.','Glycogen and starch'],
 ['Fungi may store carbohydrate as glycogen.',true,'Yes, like animals.','Glycogen and starch'],
 ['Bacteria are multicellular.',false,'Bacteria are single-celled.','Single-celled organisms'],
 ['Chloroplasts absorb light energy for photosynthesis.',true,'Yes.','Chloroplasts'],
 ['Aerobic respiration takes place in the mitochondria.',true,'Yes, releasing energy for the cell.','Mitochondria'],
 ['Bacterial cells are much smaller than plant and animal cells.',true,'Bacteria are a few micrometres long; plant cells are often 50–100 µm.','Bacteria size'],
 ['Lactobacillus is a spherical bacterium.',false,'Lactobacillus is rod-shaped. Pneumococcus is spherical.','Named examples'],
 ['Pneumococcus is a pathogen that causes pneumonia.',true,'Yes.','Named examples'],
 ['The nucleus contains genetic material that controls the activities of the cell.',true,'Yes.','Nucleus'],
 ['Yeast cells have a nucleus.',true,'Fungi are eukaryotes, so their cells have a nucleus.','Nucleus']
];
const MYSTERY=[
 {name:'Mucor',group:'fungus',clues:['I can’t photosynthesise.','My body is a mycelium made of thread-like structures.','Those threads (hyphae) contain many nuclei and have walls made of chitin.','I grow on old bread and digest it by secreting enzymes onto it.'],media:()=>photoItem(PHOTOS[3])},
 {name:'Yeast',group:'fungus',clues:['I’m single-celled.','My cell has a nucleus and a cell wall.','My cell wall is made of chitin, not cellulose.','Bakers and brewers use me, and I reproduce by budding.'],media:()=>photoItem(PHOTOS[0])},
 {name:'Lactobacillus bulgaricus',group:'bacteria',clues:['I’m single-celled and microscopic.','I have a cell wall, but it isn’t made of cellulose or chitin.','I have no nucleus: my DNA is a circular chromosome, plus plasmids.','I’m rod-shaped and I turn milk into yoghurt.'],media:()=>photoItem(PHOTOS[5])},
 {name:'Pneumococcus',group:'bacteria',clues:['I’m single-celled and only about 1 µm across.','I have no nucleus.','I have plasmids and a circular chromosome.','I’m spherical and I’m a pathogen that causes pneumonia.'],media:()=>photoItem(PHOTOS[6])},
 {name:'Pea plant',group:'plant',clues:['I’m multicellular.','My cells have walls made of cellulose.','Some of my cells contain chloroplasts and I photosynthesise.','I store carbohydrate as starch. My group includes peas and maize.'],media:()=>({html:'<img src="img/pisum_sativum.jpg" alt="Pea plant flower">',cap:'Pea plant (Pisum sativum), in flower.'})},
 {name:'Maize',group:'plant',clues:['I’m multicellular.','I can make my own food.','My leaf cells contain chloroplasts and have cellulose walls.','I’m a cereal crop; my seeds are corn.'],media:()=>({html:'<img src="img/zea_mays.jpeg" alt="Maize plant">',cap:'Maize (Zea mays).'})},
 {name:'Pondweed (Elodea)',group:'plant',clues:['I’m multicellular.','My cells have a large permanent vacuole full of cell sap.','My leaf cells are packed with chloroplasts.','I live underwater; teachers use me to show photosynthesis making bubbles of oxygen.'],media:()=>({html:'<img src="img/elodea_canadensis.jpg" alt="Pondweed">',cap:'Canadian pondweed (Elodea).'})},
 {name:'Housefly',group:'animal',clues:['I’m multicellular.','My cells have a nucleus but no cell wall.','I can’t photosynthesise; I feed on organic substances made by other living things.','I store carbohydrate as glycogen, I have a nervous system and I can fly.'],media:()=>({html:'<img src="img/musca_domestica.jpeg" alt="Housefly">',cap:'Housefly (Musca domestica).'})},
 {name:'Human',group:'animal',clues:['I’m multicellular.','My cells have no chloroplasts and no cell wall.','My cells store carbohydrate as glycogen.','You can scrape some of my cells off the inside of your cheek.'],media:()=>fieldItem('cheek')},
 {name:'Mushroom',group:'fungus',clues:['I’m multicellular.','I can’t photosynthesise.','My cell walls are made of chitin.','I feed by saprotrophic nutrition; the part you eat is made of tightly packed hyphae.'],media:()=>({html:'<img src="img/agaricus_bisporus.jpg" alt="Mushrooms">',cap:'Mushrooms (Agaricus).'})},
 {name:'E. coli',group:'bacteria',clues:['I’m single-celled.','I have a cell wall and a cell membrane, but no nucleus.','I’m only about 2 µm long.','I’m rod-shaped and live in your gut.'],media:()=>photoItem(PHOTOS[4])}
];

/* ---------------- UI helpers ---------------- */
const stage=()=>$('stage');
function groupButtons(){return `<div class="groups">${GK.map(g=>`<button class="gbtn" data-g="${g}" style="--g:${G[g].col}">${G[g].name}</button>`).join('')}</div>`;}
function mediaBox(it,extra=''){return `<div class="media ${it.white?'white':''} ${extra}">${it.html}</div>`;}
function feedback(ok,pts,html){return `<div class="fb ${ok?'':'bad'}"><span class="pts">+${pts}</span><b>${ok?pick(['Correct!','Yes!','Spot on.','Nice.']):'Not quite.'}</b> ${html}</div>`;}
let NOTIMER=false; // team games can switch the countdowns off
function timer(sec,onEnd){if(NOTIMER){const el=document.createElement('div');return {el,left:()=>sec,stop:()=>{}};}const el=document.createElement('div');el.className='timer';el.innerHTML='<i></i>';const bar=el.firstChild;const t0=performance.now();let stop=false,raf;
  const tick=now=>{if(stop)return;const f=Math.max(0,1-(now-t0)/1000/sec);bar.style.width=(f*100)+'%';if(f<=0){stop=true;onEnd&&onEnd();return;}raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);
  return {el,left:()=>Math.max(0,sec-(performance.now()-t0)/1000),stop:()=>{stop=true;cancelAnimationFrame(raf);}};}
function bindGroups(root,correct,onAnswer){const bs=[...root.querySelectorAll('.gbtn')];bs.forEach(b=>b.onclick=()=>{bs.forEach(x=>{x.disabled=true;if(x.dataset.g===correct)x.classList.add('right');});if(b.dataset.g!==correct)b.classList.add('wrong');onAnswer(b.dataset.g===correct,b.dataset.g);});return ()=>{bs.forEach(x=>{x.disabled=true;if(x.dataset.g===correct)x.classList.add('right');});};}

/* ---------------- ROUNDS ---------------- */
/* Each round: make() -> list of question builders. A builder is run(done) where done(points, max, reviseTags[]). */
const ROUNDS=[
{id:'who',name:'Who am I?',desc:'One cell or a microscope view. Animal, plant, fungus or bacteria? Faster answers score more.',
 make(){const avoid=new Set();return groupsSeq(5).map(g=>()=>{const it=anyItem(g,['photo','photo','photo','field','cell'],avoid);
  return done=>{const s=stage();s.innerHTML=`<div class="prompt">Which group does this come from?</div><div id="tm"></div>${mediaBox(it)}${groupButtons()}<div id="fb"></div>`;
   let answered=false;const T=timer(12,()=>{if(answered)return;answered=true;reveal();fin(false,0);});s.querySelector('#tm').appendChild(T.el);
   const reveal=bindGroups(s,g,(ok)=>{if(answered)return;answered=true;T.stop();fin(ok,ok?Math.round(50+50*T.left()/12):0);});
   function fin(ok,pts){s.querySelector('#fb').innerHTML=feedback(ok,pts,`<b>${gname(g)}.</b> ${it.clue}<div class="small" style="margin-top:4px">${it.cap}</div>`);done(pts,100,ok?[]:[gname(g)+' cells: how to recognise them']);}
  };});}},

{id:'spot',name:'Spot it',desc:'Tap the named part on the diagram. Two tries per question.',
 make(){const types=shuffle(C.CELL_TYPES).concat(shuffle(C.CELL_TYPES));return types.slice(0,5).map(t=>()=>{const c=C.cell(t,pick(['colour','colour','exam']),seed());const target=pick(c.has);
  return done=>{const s=stage();s.innerHTML=`<div class="prompt">Tap the <b>${P[target].name.toLowerCase()}</b>.</div><div class="media white spot">${C.wrap(c.svg,c.w,c.h)}</div><div class="cap">${c.kind}</div><div id="fb"></div>`;
   let tries=0,over=false;const svg=s.querySelector('svg');
   svg.addEventListener('click',ev=>{if(over)return;const el=ev.target.closest('[data-part]');if(!el)return;const got=el.dataset.part;tries++;
     if(got===target){over=true;hl();const pts=tries===1?100:50;s.querySelector('#fb').innerHTML=feedback(true,pts,`That’s the ${P[target].name.toLowerCase()}. ${P[target].fn}.`);done(pts,100,tries>1?[P[target].name]:[]);}
     else if(tries<2){s.querySelector('#fb').innerHTML=`<div class="fb bad"><b>That’s the ${P[got].name.toLowerCase()}.</b> Try again: one more go.</div>`;}
     else{over=true;hl();s.querySelector('#fb').innerHTML=feedback(false,0,`You tapped the ${P[got].name.toLowerCase()}. The <b>${P[target].name.toLowerCase()}</b> is highlighted. ${P[target].fn}.`);done(0,100,[P[target].name]);}});
   function hl(){svg.querySelectorAll(`[data-part="${target}"]`).forEach(e=>e.classList.add('hl'));}
  };});}},

{id:'label',name:'Label it',desc:'Name the four labelled parts, A to D, like an exam diagram.',
 make(){return shuffle(C.CELL_TYPES).slice(0,5).map(t=>()=>{const c=C.cell(t,pick(['exam','exam','colour']),seed());
  let chosen;for(let tr=0;tr<200;tr++){chosen=shuffle(c.has.filter(k=>c.parts[k])).slice(0,4);
   if(chosen.includes('ribo')&&chosen.includes('cytoplasm'))continue;
   if(chosen.every((k,i)=>chosen.every((k2,j)=>j<=i||Math.hypot(c.parts[k][0]-c.parts[k2][0],c.parts[k][1]-c.parts[k2][1])>=45)))break;}
  return done=>{const OX=58,OY=8,W=516,H=296;const L=['A','B','C','D'];
   const pts=chosen.map(k=>({k,x:c.parts[k][0]+OX,y:c.parts[k][1]+OY}));
   let left=pts.filter(p=>p.x<W/2),right=pts.filter(p=>p.x>=W/2);
   while(left.length>3){left.sort((a,b)=>b.x-a.x);right.push(left.shift());}while(right.length>3){right.sort((a,b)=>a.x-b.x);left.push(right.shift());}
   left.sort((a,b)=>a.y-b.y);right.sort((a,b)=>a.y-b.y);
   const even=t==='hypha';const GAP=36;
   const lay=(arr,x)=>{arr.forEach((p,i)=>{p.lx=x;p.ly=even?(arr.length===1?p.y:40+i*(H-80)/(arr.length-1)):p.y;p.ly=Math.max(20,Math.min(H-20,p.ly));});
     for(let i=1;i<arr.length;i++)arr[i].ly=Math.max(arr[i].ly,arr[i-1].ly+GAP);
     for(let i=arr.length-1;i>=0;i--){const lim=H-20-(arr.length-1-i)*GAP;if(arr[i].ly>lim)arr[i].ly=lim;if(i<arr.length-1&&arr[i].ly>arr[i+1].ly-GAP)arr[i].ly=arr[i+1].ly-GAP;}};
   lay(left,20);lay(right,W-20);
   const order=shuffle(pts);order.forEach((p,i)=>p.L=L[i]);
   let lines='';pts.forEach(p=>{const ex=p.lx<W/2?p.lx+14:p.lx-14;lines+=`<line x1="${ex}" y1="${p.ly}" x2="${p.x}" y2="${p.y}" stroke="#111" stroke-width="1.6"/><circle cx="${p.x}" cy="${p.y}" r="3" fill="#111"/><circle cx="${p.lx}" cy="${p.ly}" r="13" fill="#111"/><text x="${p.lx}" y="${p.ly+6}" text-anchor="middle" fill="#fff" font-family="Barlow Condensed, sans-serif" font-weight="700" font-size="18">${p.L}</text>`;});
   const svg=`<svg class="cellsvg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><g transform="translate(${OX} ${OY})">${c.svg}</g>${lines}</svg>`;
   const opts=shuffle(c.has);
   const s=stage();s.innerHTML=`<div class="prompt">Name the parts labelled <b>A</b> to <b>D</b>.</div><div class="media white">${svg}</div><div class="cap">${c.kind}</div>
    <div class="labels">${order.slice().sort((a,b)=>a.L<b.L?-1:1).map(p=>`<label><span class="lt">${p.L}</span><select data-k="${p.k}"><option value="">Choose…</option>${opts.map(o=>`<option value="${o}">${P[o].name}</option>`).join('')}</select></label>`).join('')}</div>
    <div class="nextrow" style="justify-content:flex-start"><button class="btn green" id="chk">Check labels</button></div><div id="fb"></div>`;
   const sels=[...s.querySelectorAll('select')];const chk=s.querySelector('#chk');
   chk.onclick=()=>{if(sels.some(x=>!x.value)){s.querySelector('#fb').innerHTML='<div class="fb bad">Choose a name for every letter first.</div>';return;}
     chk.disabled=true;let n=0;const miss=[];sels.forEach(x=>{x.disabled=true;const ok=x.value===x.dataset.k;if(ok)n++;else{miss.push(P[x.dataset.k].name);x.insertAdjacentHTML('afterend',`<span class="fix">→ ${P[x.dataset.k].name}</span>`);}x.classList.add(ok?'right':'wrong');});
     const pts2=n*25;s.querySelector('#fb').innerHTML=feedback(n===4,pts2,`${n} of 4 correct.${miss.length?' Check: '+miss.join(', ')+'.':''}`);done(pts2,100,miss);};
  };});}},

{id:'zoom',name:'Zoom reveal',desc:'The picture starts zoomed in and blurry, then slowly pulls back. Answer early for more points.',
 make(){const avoid=new Set();return groupsSeq(5).map(g=>()=>{const it=anyItem(g,['photo','photo','field'],avoid);
  return done=>{const s=stage();const ox=20+Math.random()*60,oy=20+Math.random()*60;
   s.innerHTML=`<div class="prompt">What is it? Answer as soon as you know.</div><div class="media zoombox" id="zb">${it.html}</div>${groupButtons()}<div id="fb"></div>`;
   const inner=s.querySelector('#zb').firstElementChild;inner.style.transformOrigin=`${ox}% ${oy}%`;inner.style.transition='none';inner.style.transform='scale(6)';inner.style.filter='blur(7px)';
   const t0=performance.now();let answered=false;
   requestAnimationFrame(()=>requestAnimationFrame(()=>{inner.style.transition='';inner.style.transform='scale(1)';inner.style.filter='blur(0)';}));
   const snap=()=>{inner.style.transition='transform .4s,filter .4s';inner.style.transform='scale(1)';inner.style.filter='blur(0)';};
   bindGroups(s,g,ok=>{if(answered)return;answered=true;const left=NOTIMER?12:Math.max(0,12-(performance.now()-t0)/1000);snap();const pts=ok?Math.round(30+70*left/12):0;
     s.querySelector('#fb').innerHTML=feedback(ok,pts,`<b>${gname(g)}.</b> ${it.clue}<div class="small" style="margin-top:4px">${it.cap}</div>`);done(pts,100,ok?[]:[gname(g)+' cells: how to recognise them']);});
  };});}},

{id:'sort',name:'Sort it',desc:'Which groups have this feature? Tick every one that does.',
 make(){return shuffle(SORT).slice(0,5).map(it=>()=>done=>{const s=stage();
   s.innerHTML=`<div class="prompt">Which types of cell have…</div><div class="sortq">${it.q}?</div><p class="small" style="text-align:center">Tick all that apply. Think of a typical cell from each group.</p>${groupButtons()}<div class="nextrow" style="justify-content:center"><button class="btn green" id="chk">Check</button></div><div id="fb"></div>`;
   const bs=[...s.querySelectorAll('.gbtn')];bs.forEach(b=>b.onclick=()=>b.classList.toggle('on'));
   s.querySelector('#chk').onclick=function(){this.disabled=true;const chosen=bs.filter(b=>b.classList.contains('on')).map(b=>b.dataset.g);
     const ok=GK.every(g=>chosen.includes(g)===it.a.includes(g));
     bs.forEach(b=>{b.disabled=true;const should=it.a.includes(b.dataset.g),did=chosen.includes(b.dataset.g);b.classList.remove('on');if(should)b.classList.add('right');else if(did)b.classList.add('wrong');});
     s.querySelector('#fb').innerHTML=feedback(ok,ok?100:0,`<b>${it.a.length===4?'All four':it.a.map(gname).join(', ')}.</b> ${it.why}`);done(ok?100:0,100,ok?[]:[it.tag]);};
 });}},

{id:'job',name:'Job match',desc:'Match each part to its job, or say what a highlighted part does.',
 make(){const keys=shuffle(Object.keys(P));return keys.slice(0,5).map((k,i)=>()=>done=>{const s=stage();
   if(i%2===0){const others=shuffle(Object.keys(P).filter(x=>x!==k)).slice(0,3);const opts=shuffle([k,...others]);
     s.innerHTML=`<div class="prompt">Which part does this job?</div><div class="statement" style="font-size:22px">“${P[k].fn}”</div><div class="opts">${opts.map(o=>`<button class="opt" data-k="${o}">${P[o].name}</button>`).join('')}</div><div id="fb"></div>`;
     bindOpts(s,'k',k,ok=>{s.querySelector('#fb').innerHTML=feedback(ok,ok?100:0,`<b>${P[k].name}:</b> ${P[k].fn}.`);done(ok?100:0,100,ok?[]:[P[k].name]);});}
   else{const types=C.CELL_TYPES.filter(t=>C.cell(t,'colour',1).has.includes(k));const c=C.cell(pick(types),'colour',seed());
     const others=shuffle(Object.keys(P).filter(x=>x!==k&&P[x].fn!==P[k].fn)).slice(0,3);const opts=shuffle([k,...others]);
     s.innerHTML=`<div class="prompt">What is the job of the <b>highlighted</b> part?</div><div class="media white jobhl dim">${C.wrap(c.svg,c.w,c.h)}</div><div class="opts">${opts.map(o=>`<button class="opt" data-k="${o}">${P[o].fn}</button>`).join('')}</div><div id="fb"></div>`;
     s.querySelectorAll(`[data-part="${k}"]`).forEach(e=>e.classList.add('hl'));
     bindOpts(s,'k',k,ok=>{s.querySelector('#fb').innerHTML=feedback(ok,ok?100:0,`That’s the <b>${P[k].name.toLowerCase()}</b>. ${P[k].fn}.`);done(ok?100:0,100,ok?[]:[P[k].name]);});}
 });}},

{id:'tf',name:'True or false?',desc:'Quick-fire statements. Eight seconds each.',
 make(){return shuffle(TF).slice(0,5).map(([q,a,why,tag])=>()=>done=>{const s=stage();
   s.innerHTML=`<div id="tm"></div><div class="statement">${q}</div><div class="tfbtns"><button class="btn green" data-v="1">True</button><button class="btn" style="background:var(--red);border-color:var(--red)" data-v="0">False</button></div><div id="fb"></div>`;
   let over=false;const T=timer(8,()=>{if(over)return;over=true;lock();fin(false,true);});s.querySelector('#tm').appendChild(T.el);
   const bs=[...s.querySelectorAll('.tfbtns .btn')];const lock=()=>bs.forEach(b=>{b.disabled=true;if((b.dataset.v==='1')===a)b.style.outline='4px solid #ffb300';});
   bs.forEach(b=>b.onclick=()=>{if(over)return;over=true;T.stop();lock();fin((b.dataset.v==='1')===a);});
   function fin(ok,timeout){s.querySelector('#fb').innerHTML=feedback(ok,ok?100:0,`${timeout?'Out of time. ':''}It’s <b>${a?'true':'false'}</b>. ${why}`);done(ok?100:0,100,ok?[]:[tag]);}
 });}},

{id:'odd',name:'Odd one out',desc:'Four cells or four parts. One doesn’t belong. Find it.',
 make(){return [0,1,2,3,4].map(i=>()=>done=>{const s=stage();
   if(i%2===0){const [gx,gy]=shuffle(GK);const avoid=new Set();const items=[anyItem(gx,undefined,avoid),anyItem(gx,undefined,avoid),anyItem(gx,undefined,avoid),anyItem(gy,undefined,avoid)];const order=shuffle([0,1,2,3]);
     s.innerHTML=`<div class="prompt">Three of these come from the same group. Tap the <b>odd one out</b>.</div><div class="quad">${order.map(j=>`<button class="tile" data-j="${j}">${items[j].html}<span class="tag hidden">${gname(items[j].group)}</span></button>`).join('')}</div><div id="fb"></div>`;
     const ts=[...s.querySelectorAll('.tile')];ts.forEach(t=>t.onclick=()=>{if(t.disabled)return;const ok=t.dataset.j==='3';ts.forEach(x=>{x.disabled=true;x.querySelector('.tag').classList.remove('hidden');if(x.dataset.j==='3')x.classList.add('right');});if(!ok)t.classList.add('wrong');
       s.querySelector('#fb').innerHTML=feedback(ok,ok?100:0,`Three are <b>${gname(gx).toLowerCase()}</b>. The odd one out is <b>${gname(gy).toLowerCase()}</b>: ${items[3].clue}`);done(ok?100:0,100,ok?[]:[gname(gy)+' cells: how to recognise them']);});}
   else{const g=pick(GK),odd=pick(NOT[g]),ins=shuffle(HAS[g].filter(k=>k!=='cytoplasm'&&k!=='membrane')).slice(0,3);const opts=shuffle([odd,...ins]);
     s.innerHTML=`<div class="prompt">Which of these is <b>not</b> found in a typical <b>${gname(g).toLowerCase()}</b> cell?</div><div class="opts">${opts.map(o=>`<button class="opt" data-k="${o}">${P[o].name}</button>`).join('')}</div><div id="fb"></div>`;
     bindOpts(s,'k',odd,ok=>{s.querySelector('#fb').innerHTML=feedback(ok,ok?100:0,`A ${gname(g).toLowerCase()} cell has no <b>${P[odd].name.toLowerCase()}</b>. It does have: ${HAS[g].map(k=>P[k].name.toLowerCase()).join(', ')}.`);done(ok?100:0,100,ok?[]:[P[odd].name]);});}
 });}},

{id:'mystery',name:'Mystery organism',desc:'Clues appear one at a time. Name the group with as few clues as you can.',
 make(){return shuffle(MYSTERY).slice(0,5).map(m=>()=>done=>{const s=stage();let shown=1,over=false;
   const render=()=>{s.querySelector('#clues').innerHTML=m.clues.map((c,i)=>i<shown||over?`<div class="clue"><small>Clue ${i+1}</small>${c}</div>`:`<div class="clue locked"><small>Clue ${i+1}</small>Locked</div>`).join('');
     s.querySelector('#more').disabled=over||shown>=4;s.querySelector('#worth').textContent=over?'':`Worth ${[100,75,50,25][shown-1]} points now`;};
   s.innerHTML=`<div class="prompt">Who am I? Which group do I belong to?</div><div class="clues" id="clues"></div><div class="nextrow" style="justify-content:space-between;align-items:center"><span class="small" id="worth"></span><button class="btn alt" id="more">Next clue</button></div>${groupButtons()}<div id="fb"></div>`;
   s.querySelector('#more').onclick=()=>{shown++;render();};render();
   bindGroups(s,m.group,ok=>{over=true;const pts=ok?[100,75,50,25][shown-1]:0;render();const md=m.media();
     s.querySelector('#fb').innerHTML=feedback(ok,pts,`I’m <b>${m.name}</b>, ${{animal:'an animal',plant:'a plant',fungus:'a fungus',bacteria:'a bacterium'}[m.group]}.<div class="reveal"><div class="media ${md.white?'white':''}">${md.html}</div><div class="small">${md.cap}</div></div>`);
     done(pts,100,ok?[]:['Named examples: '+m.name]);});
 });}}
];
function bindOpts(s,attr,correct,cb){const bs=[...s.querySelectorAll('.opt')];bs.forEach(b=>b.onclick=()=>{const ok=b.dataset[attr]===correct;bs.forEach(x=>{x.disabled=true;if(x.dataset[attr]===correct)x.classList.add('right');});if(!ok)b.classList.add('wrong');cb(ok);});}

/* ---------------- game flow ---------------- */
let GAME=null,TEAM=null;
function show(id){['menu','solo','play','results','teamsetup'].forEach(x=>$(x).classList.toggle('hidden',x!==id));document.body.classList.toggle('proj',!!TEAM&&(id==='play'||id==='results'));
  $('teamhud').classList.toggle('hidden',!TEAM);$('solohud').classList.toggle('hidden',!!TEAM);window.scrollTo(0,0);}
function startGame(mode,roundIds){TEAM=null;NOTIMER=false;GAME={mode,rounds:roundIds.map(id=>ROUNDS.find(r=>r.id===id)),ri:-1,score:0,max:0,per:[],revise:{}};nextRound();show('play');}
function nextRound(){GAME.ri++;if(GAME.ri>=GAME.rounds.length)return finish();const R=GAME.rounds[GAME.ri];GAME.cur={R,qs:R.make(),qi:-1,score:0,max:0,res:[]};GAME.per.push(GAME.cur);nextQ();}
function nextQ(){const cur=GAME.cur;cur.qi++;if(cur.qi>=cur.qs.length)return nextRound();hud();
  const run=cur.qs[cur.qi]();run((pts,max,tags)=>{cur.score+=pts;cur.max+=max;GAME.score+=pts;GAME.max+=max;cur.res.push(pts>=max*0.75?'done':'miss');(tags||[]).forEach(t=>GAME.revise[t]=(GAME.revise[t]||0)+1);hud();
    const last=cur.qi===cur.qs.length-1,lastRound=GAME.ri===GAME.rounds.length-1;
    stage().insertAdjacentHTML('beforeend',`<div class="nextrow"><button class="btn big green" id="nx">${last?(lastRound?'See results':'Next round'):'Next'} →</button></div>`);
    const nx=$('nx');nx.onclick=nextQ;nx.focus({preventScroll:true});nx.scrollIntoView({behavior:'smooth',block:'nearest'});});}
function hud(){const cur=GAME.cur;$('hudMeta').textContent=GAME.rounds.length>1?`Round ${GAME.ri+1} of ${GAME.rounds.length} · Question ${Math.min(cur.qi+1,5)} of 5`:`Question ${Math.min(cur.qi+1,5)} of 5`;
  $('hudRound').innerHTML=cur.R.name+' '+dtag();$('hudScore').textContent=GAME.score;
  $('pips').innerHTML=cur.qs.map((_,i)=>`<i class="${cur.res[i]||(i===cur.qi?'now':'')}"></i>`).join('');}
function finish(){if(GAME.mode.startsWith('round:'))GAME.mode='round:'+GAME.rounds[0].id;const pct=GAME.max?Math.round(GAME.score/GAME.max*100):0;const key='best:'+DIFF+':'+GAME.mode;const best=store.get(key)||0;const isBest=GAME.score>best;if(isBest)store.set(key,GAME.score);
  if(GAME.rounds.length===1){const rk='best:'+DIFF+':round:'+GAME.rounds[0].id;if(GAME.score>(store.get(rk)||0))store.set(rk,GAME.score);}
  const rev=Object.entries(GAME.revise).sort((a,b)=>b[1]-a[1]);
  $('results').innerHTML=`<div class="card"><div class="bar6"><i style="flex:4;background:#005e22"></i><i style="flex:1;background:#111"></i><i style="flex:6;background:#005e22"></i><i style="flex:2;background:#111"></i></div><div style="padding:18px">
    <h2>${pct>=90?'Cell expert!':pct>=70?'Great spotting':pct>=50?'Good effort':'Keep practising'}</h2>
    <div class="bigscore">${GAME.score}</div><div class="small">out of ${GAME.max} (${pct}%)${isBest?' · New personal best!':best?` · Your best: ${best}`:''}</div>
    <table><tr><th>Round</th><th style="text-align:right">Score</th></tr>${GAME.per.map(p=>`<tr><td>${p.R.name}</td><td class="r">${p.score} / ${p.max}</td></tr>`).join('')}</table>
    ${rev.length?`<h3 style="margin-top:18px">Revise these</h3><ul class="revise">${rev.map(([t,n])=>`<li>${t}${n>1?` <span class="small">(×${n})</span>`:''}</li>`).join('')}</ul>`:'<p style="margin-top:14px"><b>No mistakes to revise.</b></p>'}
    <div class="modes" style="margin-top:18px"><button class="btn big green" id="again">Play again</button><button class="btn big alt" id="toMenu">Menu</button></div></div></div>`;
  const again=GAME.rounds.map(r=>r.id),mode=GAME.mode;
  $('again').onclick=()=>startGame(mode,mode==='full'?shuffle(ROUNDS.map(r=>r.id)).slice(0,5):again);$('toMenu').onclick=soloMenu;show('results');}
function dtag(){return `<span class="dtag ${DIFF}">${DIFF==='hard'?'Hard':'Normal'}</span>`;}
function menu(){GAME=null;TEAM=null;document.querySelectorAll('.diff').forEach(b=>b.classList.toggle('on',b.dataset.d===DIFF));show('menu');}
function soloMenu(){GAME=null;TEAM=null;$('soloDiff').outerHTML=`<span class="dtag ${DIFF}" id="soloDiff">${DIFF==='hard'?'Hard':'Normal'}</span>`;
  $('roundList').innerHTML=ROUNDS.map((r,i)=>{const b=store.get('best:'+DIFF+':round:'+r.id);return `<button class="rcard" data-id="${r.id}"><div class="bar6"><i style="flex:4;background:#005e22"></i><i style="flex:1;background:#111"></i><i style="flex:6;background:#005e22"></i><i style="flex:2;background:#111"></i></div><div class="in"><span class="rnum">${i+1}</span><span><h3>${r.name}</h3><p>${r.desc}</p>${b?`<div class="best">Best: ${b} / 500</div>`:''}</span></div></button>`;}).join('');
  $('roundList').querySelectorAll('.rcard').forEach(b=>b.onclick=()=>startGame('round:'+b.dataset.id,[b.dataset.id]));
  const bf=store.get('best:'+DIFF+':full'),ba=store.get('best:'+DIFF+':all');$('bestLine').textContent=[bf?`Full game best: ${bf} / 2500`:'',ba?`Marathon best: ${ba} / 4500`:''].filter(Boolean).join(' · ');show('solo');}
document.querySelectorAll('.diff').forEach(b=>b.onclick=()=>{DIFF=b.dataset.d;store.set('diff',DIFF);menu();});
$('soloBtn').onclick=soloMenu;$('soloBack').onclick=e=>{e.preventDefault();menu();};
$('playFull').onclick=()=>startGame('full',shuffle(ROUNDS.map(r=>r.id)).slice(0,5));
$('playAll').onclick=()=>startGame('all',ROUNDS.map(r=>r.id));
/* ---------------- TEAM MODE (board / projector) ---------------- */
const TEAM_COLS=['#d62828','#1d4ed8','#2e7d32','#f59e0b','#7b1fa2','#0e7490'];
const TEAM_NAMES=['Red','Blue','Green','Gold','Purple','Teal'];
const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function teamSetup(){const s=store.get('teamcfg')||{};s.n=s.n||4;s.names=s.names||TEAM_NAMES.slice();s.per=s.per||3;
  if(s.timer===undefined)s.timer=true;s.rounds=(s.rounds||ROUNDS.map(r=>r.id)).filter(id=>ROUNDS.some(r=>r.id===id));if(!s.rounds.length)s.rounds=ROUNDS.map(r=>r.id);
  const box=$('teamsetup');
  const draw=()=>{box.innerHTML=`<a class="back" href="#" id="tsBack">← Menu</a><h1>Team game ${dtag()}</h1><p class="lede">For the board: split the class into teams. Teams take turns, one question each. Tap the answer the team chooses.</p>
    <div class="card" style="margin-top:14px"><div class="setup">
     <h3>1. How many teams?</h3><div class="chips">${[2,3,4,5,6].map(n=>`<button class="chip ${s.n===n?'on':''}" data-n="${n}">${n}</button>`).join('')}</div>
     <div class="teamnames">${Array.from({length:s.n},(_,i)=>`<label style="--c:${TEAM_COLS[i]}"><i></i><input value="${esc(s.names[i]||TEAM_NAMES[i])}" data-i="${i}" maxlength="18" aria-label="Team ${i+1} name"></label>`).join('')}</div>
     <h3>2. Which rounds?</h3><div class="chips"><button class="chip ${s.rounds.length===ROUNDS.length?'on':''}" id="allR">All rounds</button>${ROUNDS.map(r=>`<button class="chip ${s.rounds.includes(r.id)&&s.rounds.length<ROUNDS.length?'on':''}" data-r="${r.id}">${r.name}</button>`).join('')}</div>
     <p class="small" style="margin-top:6px">Mixed in a random order. Tap single rounds to choose just those.</p>
     <h3>3. Timer</h3><div class="chips"><button class="chip ${s.timer?'on':''}" data-t="1">On</button><button class="chip ${!s.timer?'on':''}" data-t="0">Off</button></div>
     <p class="small" style="margin-top:6px">On: Who am I and True or false have a countdown, and fast answers score more on Who am I and Zoom reveal. Off: no countdowns, and every correct answer scores full points.</p>
     <h3>4. Questions per team</h3><div class="chips">${[2,3,5,8].map(n=>`<button class="chip ${s.per===n?'on':''}" data-p="${n}">${n}</button>`).join('')}</div>
     <div class="modes"><button class="btn big green" id="tsGo">Start: ${s.n*s.per} questions</button></div></div></div>`;
    box.querySelector('#tsBack').onclick=e=>{e.preventDefault();menu();};
    box.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{s.n=+b.dataset.n;draw();});
    box.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{s.per=+b.dataset.p;draw();});
    box.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{s.timer=b.dataset.t==='1';draw();});
    box.querySelector('#allR').onclick=()=>{s.rounds=ROUNDS.map(r=>r.id);draw();};
    box.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{const id=b.dataset.r;if(s.rounds.length===ROUNDS.length)s.rounds=[id];else if(s.rounds.includes(id)){s.rounds=s.rounds.filter(x=>x!==id);if(!s.rounds.length)s.rounds=ROUNDS.map(r=>r.id);}else s.rounds.push(id);draw();});
    box.querySelectorAll('.teamnames input').forEach(i=>i.oninput=()=>{s.names[+i.dataset.i]=i.value;});
    box.querySelector('#tsGo').onclick=()=>{store.set('teamcfg',s);startTeam(s);};};
  draw();show('teamsetup');}
function startTeam(s){const total=s.n*s.per,bank={},qs=[];let order=shuffle(s.rounds),k=0;
  while(qs.length<total){if(k===order.length){order=shuffle(s.rounds);k=0;}const id=order[k++];const R=ROUNDS.find(r=>r.id===id);
    if(!bank[id]||!bank[id].length)bank[id]=R.make();qs.push({R,q:bank[id].shift()});}
  GAME=null;NOTIMER=s.timer===false;TEAM={cfg:s,teams:Array.from({length:s.n},(_,i)=>({name:(s.names[i]||TEAM_NAMES[i]).trim()||TEAM_NAMES[i],col:TEAM_COLS[i],score:0})),qs,qi:-1};
  show('play');nextTeamQ();}
function teamHud(turn,over,gain){const t=TEAM.teams[turn],q=TEAM.qs[TEAM.qi];
  $('teamhud').innerHTML=`<div class="teamturn" style="--c:${t.col}"><span class="meta">${DIFF==='hard'?'Hard · ':''}Question ${TEAM.qi+1} of ${TEAM.qs.length} · ${q.R.name}</span><span class="tname">${over?`${esc(t.name)} ${gain?'+'+gain:'+0'}`:esc(t.name)+'’s turn'}</span></div>
   <div class="board">${TEAM.teams.map((x,i)=>`<div class="tscore ${i===turn?'now':''} ${i===turn&&gain?'bump':''}" style="--c:${x.col}"><span>${esc(x.name)}</span><b>${x.score}</b></div>`).join('')}</div>`;}
function nextTeamQ(){TEAM.qi++;if(TEAM.qi>=TEAM.qs.length)return podium();const turn=TEAM.qi%TEAM.teams.length,q=TEAM.qs[TEAM.qi];teamHud(turn,false,0);
  const run=q.q();run(pts=>{if(!TEAM)return;TEAM.teams[turn].score+=pts;teamHud(turn,true,pts);
    const last=TEAM.qi===TEAM.qs.length-1;stage().insertAdjacentHTML('beforeend',`<div class="nextrow"><button class="btn big green" id="nx">${last?'Final scores':'Next team'} →</button></div>`);
    const nx=$('nx');nx.onclick=nextTeamQ;nx.focus({preventScroll:true});nx.scrollIntoView({behavior:'smooth',block:'nearest'});});}
function podium(){const ranked=TEAM.teams.slice().sort((a,b)=>b.score-a.score),top=ranked[0].score,win=ranked.filter(t=>t.score===top);
  $('results').innerHTML=`<div class="card podium"><div style="padding:18px"><h1>${win.length>1?'It’s a tie!':esc(win[0].name)+' win!'}</h1>
   <div class="pod">${ranked.map((t,i)=>`<div class="pl" style="--c:${t.col};--h:${Math.max(12,top?t.score/top*100:12)}%"><b>${t.score}</b><div class="col"></div><span>${i+1}. ${esc(t.name)}</span></div>`).join('')}</div>
   <div class="modes" style="justify-content:center"><button class="btn big green" id="again">Play again</button><button class="btn big alt" id="toMenu">Menu</button></div></div></div>`;
  const cfg=TEAM.cfg;$('again').onclick=()=>startTeam(cfg);$('toMenu').onclick=menu;show('results');}
document.addEventListener('keydown',e=>{const nx=$('nx');if(e.key==='Enter'&&nx&&document.activeElement!==nx&&!$('play').classList.contains('hidden')&&!/INPUT|SELECT/.test(e.target.tagName)){e.preventDefault();nx.click();}});
$('playTeam').onclick=teamSetup;
$('quit').onclick=()=>{if(confirm('Quit this game? Your score will be lost.'))menu();};
window.CellGame={ROUNDS,SORT,TF,MYSTERY,HAS,NOT,startGame,startTeam,get TEAM(){return TEAM;}};
menu();
})();
