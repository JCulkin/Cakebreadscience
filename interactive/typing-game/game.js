/* Type Fast or Perish: Sixty-Second Sprint (normal) and Hard mode. Needs words.js and /js/leaderboards.js. */
(function(){
const $=id=>document.getElementById(id);
const W=window.TW;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const store={get(k){try{return JSON.parse(localStorage.getItem('tfp:'+k));}catch(e){return null;}},set(k,v){try{localStorage.setItem('tfp:'+k,JSON.stringify(v));}catch(e){}}};
const KCOL={b:'var(--bio)',c:'var(--chem)',p:'var(--phys)',s:'var(--silly)'};
const KNAME={b:'Biology',c:'Chemistry',p:'Physics',s:'Nonsense'};
const QUIPS=['Splendid!','Marvellous!','Improbable!','Bravo!','Tremendous!','Utterly absurd!','Jolly good!','Most irregular!','Ridiculous!','Fish-tastic!'];
let G=null; // current game
function show(id){['menu','play','results','hiscores'].forEach(x=>$(x).classList.toggle('hidden',x!==id));window.scrollTo(0,0);}

/* random word: 75% science, 25% nonsense; no repeats until the deck is used up */
function deck(){let bag=[];return function(avoid){if(bag.length<5)bag=bag.concat(shuffle(W.SCI.concat(W.SILLY.filter(()=>Math.random()<0.75))));
  for(let i=0;i<bag.length&&i<40;i++){const w=bag[i];if(!avoid||!avoid(w)){bag.splice(i,1);return w;}}return bag.shift();};}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const multOf=streak=>Math.min(4,1+Math.floor(streak/5));
function toast(parent,txt,col,side){if(side)parent.querySelectorAll('.toast.side').forEach(x=>x.remove());const t=document.createElement('div');t.className='toast'+(side?' side':'');t.textContent=txt;if(col)t.style.color=col;parent.appendChild(t);setTimeout(()=>t.remove(),1100);}

function countdown(then){show('play');$('hud').innerHTML='';$('hint').textContent='';const st=$('stage');let n=3;
  const tick=()=>{if(!G)return;if(n===0){then();return;}st.innerHTML=`<div class="count">${n}</div>`;n--;G.cd=setTimeout(tick,650);};tick();}

/* ===================== SPRINT ===================== */
const SPRINT_T=60;
const LINE=5;
function startSprint(){G={mode:'sprint',next:deck(),line:[],pos:0,score:0,streak:0,chars:0,keys:0,errors:0,done:0,missed:{},dirty:false,prev:'',best:0};
  newLine();countdown(runSprint);}
function newLine(){G.line=[];G.pos=0;for(let i=0;i<LINE;i++)G.line.push(G.next(x=>G.line.some(y=>y.w===x.w)));}
function runSprint(){const st=$('stage');
  st.innerHTML=`<div class="timebar" id="tb"><i></i></div><div class="combo" id="combo"></div><div class="tagrow" id="tag"></div><div class="line" id="line"></div>
    <input class="typebox" id="tb_in" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Type the highlighted word">`;
  $('hint').textContent='Type the highlighted word. Backspace to fix mistakes. A new line of 5 comes when you finish.';
  const inp=$('tb_in');inp.focus();G.t0=performance.now();
  const draw=()=>{const v=inp.value.toLowerCase();
    $('line').innerHTML=G.line.map((w,k)=>{const t=w.w;
      if(k<G.pos)return `<span class="lw done" style="--k:${KCOL[w.t]}">${esc(t)}</span>`;
      if(k>G.pos)return `<span class="lw" style="--k:${KCOL[w.t]}">${esc(t)}</span>`;
      let h='';for(let i=0;i<t.length;i++){const ch=esc(t[i]===' '?' ':t[i]);if(i<v.length)h+=`<span class="${v[i]===t[i].toLowerCase()?'ok':'bad'}">${ch}</span>`;else h+=`<span class="${i===v.length?'cur':''}">${ch}</span>`;}
      if(v.length>t.length)h+=`<span class="bad">${esc(v.slice(t.length))}</span>`;
      return `<span class="lw now" style="--k:${KCOL[w.t]}">${h}</span>`;}).join('');
    const w=G.line[G.pos];$('tag').innerHTML=`<span class="tag" style="--k:${KCOL[w.t]}">${KNAME[w.t]}</span>`;
    const m=multOf(G.streak);$('combo').textContent=m>1?'×'+m:'';};
  const hud=()=>{const el=(performance.now()-G.t0)/60000;$('hud').innerHTML=`<div class="stat score"><small>Score</small><b>${G.score}</b></div><div class="stat"><small>Words</small><b>${G.done}</b></div><div class="stat"><small>Speed</small><b>${el>0.05?Math.round(G.chars/5/el):0} wpm</b></div><div class="stat"><small>Streak</small><b>${G.streak}</b></div>`;};
  inp.addEventListener('input',()=>{if(!G||G.over)return;let v=inp.value.replace(/^\s+/,'');if(v!==inp.value)inp.value=v;
    const t=G.line[G.pos].w.toLowerCase(),lv=v.toLowerCase();
    if(v.length>G.prev.length){G.keys+=v.length-G.prev.length;if(!t.startsWith(lv)){G.errors++;G.dirty=true;inp.classList.remove('err');void inp.offsetWidth;inp.classList.add('err');}}
    G.prev=v;
    if(lv===t){const w=G.line[G.pos];const clean=!G.dirty;G.streak=clean?G.streak+1:0;const m=multOf(G.streak),pts=w.w.length*10*m;
      G.score+=pts;G.chars+=w.w.length;G.done++;if(!clean&&w.t!=='s')G.missed[w.w]=w.t;
      const old=multOf(G.streak-1);if(clean&&m>old){toast($('stage'),'Combo ×'+m+'!','var(--green)',1);const c=$('combo');c.classList.add('pop');setTimeout(()=>c.classList.remove('pop'),200);}
      else if(w.t==='s')toast($('stage'),pick(QUIPS),null,1);
      G.pos++;if(G.pos>=G.line.length){newLine();const L=$('line');L.classList.remove('fresh');void L.offsetWidth;L.classList.add('fresh');}
      G.dirty=false;inp.value='';G.prev='';hud();}
    draw();});
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')e.preventDefault();});
  draw();hud();
  G.timer=setInterval(()=>{const left=Math.max(0,SPRINT_T-(performance.now()-G.t0)/1000);const tb=$('tb');if(tb){tb.firstChild.style.width=(left/SPRINT_T*100)+'%';tb.classList.toggle('low',left<=10);}
    hud();if(left<=0){clearInterval(G.timer);endGame();}},100);
  $('stage').onclick=()=>inp.focus();}

/* ===================== STORM ===================== */
const EVENTS=[
 {id:'mirror',name:'Mirror world',tip:'The words are back to front. Type them forwards.'},
 {id:'tiny',name:'Shrink ray',tip:'Everything has gone very, very small.'},
 {id:'dark',name:'Lights out',tip:'New words vanish after a second. Remember them!'},
 {id:'rise',name:'Gravity has resigned',tip:'Words now rise from the ground. Stop them reaching the top!'},
 {id:'wobble',name:'Jelly mode',tip:'The sky has turned to jelly.'}];
function startStorm(){G={mode:'storm',next:deck(),words:[],score:0,streak:0,chars:0,keys:0,errors:0,done:0,lives:3,level:1,missed:{},lock:null,prev:'',ev:null,evNext:20,clock:0,spawnIn:0.4,paused:false};
  countdown(runStorm);}
function runStorm(){const st=$('stage');
  st.innerHTML=`<div class="sky" id="sky"></div><input class="typebox" id="tb_in" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Type a falling word">`;
  $('hint').textContent='Type any word to lock on · Esc to pause';
  const sky=$('sky'),inp=$('tb_in');for(let i=0;i<60;i++){const s=document.createElement('i');s.className='star';s.style.left=Math.random()*100+'%';s.style.top=Math.random()*100+'%';sky.appendChild(s);}
  inp.focus();G.sky=sky;G.inp=inp;
  const H=()=>sky.clientHeight;
  const hud=()=>{$('hud').innerHTML=`<div class="stat score"><small>Score</small><b>${G.score}</b></div><div class="stat"><small>Level</small><b>${G.level}</b></div><div class="stat"><small>Words</small><b>${G.done}</b></div><div class="stat"><small>Combo</small><b>×${multOf(G.streak)}</b></div><div class="stat"><small>Lives</small><span class="lives">${'❤️'.repeat(G.lives)}${'🖤'.repeat(Math.max(0,3-G.lives))}</span></div>`;};
  const spawn=()=>{const used=new Set(G.words.map(x=>x.w[0].toLowerCase()));
    let w;const gold=G.level>=2&&!G.words.some(x=>x.gold)&&Math.random()<0.06&&!used.has('t');
    if(gold)w={w:'towel',t:'s',gold:true};else w=G.next(x=>used.has(x.w[0].toLowerCase())||x.w.length>(G.level<3?16:26));
    const el=document.createElement('div');el.className='fw k-'+w.t+(w.gold?' gold':'')+' fresh';el.innerHTML=`<span class="t"></span><span class="r">${esc(w.w)}</span>`;
    const rise=G.ev&&G.ev.id==='rise';const o={w:w.w,t:w.t,gold:!!w.gold,el,x:8+Math.random()*84,y:rise?H()-44:-30,dir:rise?-1:1,born:G.clock,ph:Math.random()*6};
    sky.appendChild(el);{const half=(el.offsetWidth/2+6)/sky.clientWidth*100;o.x=Math.max(half,Math.min(100-half,o.x));}el.style.left=o.x+'%';el.style.top=o.y+'px';setTimeout(()=>el.classList.remove('fresh'),60);G.words.push(o);};
  const paint=o=>{const v=o===G.lock?G.inp.value.length:0;o.el.querySelector('.t').textContent=o.w.slice(0,v);o.el.querySelector('.r').textContent=o.w.slice(v);o.el.classList.toggle('lock',o===G.lock);};
  const remove=(o,boom)=>{G.words=G.words.filter(x=>x!==o);if(G.lock===o){G.lock=null;inp.value='';G.prev='';}if(boom){o.el.classList.add('boom');setTimeout(()=>o.el.remove(),300);}else o.el.remove();};
  const startEvent=()=>{const e=pick(EVENTS.filter(x=>!G.lastEv||x.id!==G.lastEv));G.ev=e;G.lastEv=e.id;G.evEnd=G.clock+9;sky.classList.add(e.id);
    const b=document.createElement('div');b.className='event';b.id='evb';b.innerHTML=`⚠ Improbability event: ${e.name}<small>${e.tip}</small>`;sky.appendChild(b);setTimeout(()=>b.classList.add('mini'),3000);};
  const endEvent=()=>{sky.classList.remove(G.ev.id);G.ev=null;const b=$('evb');if(b)b.remove();G.evNext=G.clock+(G.level>=6?12:18);};
  inp.addEventListener('input',()=>{if(!G||G.over||G.paused){inp.value=G?G.prev:'';return;}let v=inp.value.replace(/^\s+/,'');const lv=v.toLowerCase();
    if(v.length>G.prev.length)G.keys+=v.length-G.prev.length;
    if(!v){if(G.lock){const o=G.lock;G.lock=null;paint(o);}G.prev='';inp.value='';return;}
    let tgt=G.lock&&G.lock.w.toLowerCase().startsWith(lv)?G.lock:null;
    if(!tgt){const c=G.words.filter(o=>o.w.toLowerCase().startsWith(lv)).sort((a,b)=>a.dir===1?b.y-a.y:a.y-b.y);tgt=c[0]||null;}
    if(!tgt){G.errors++;G.streak=0;inp.value=G.prev;inp.classList.remove('err');void inp.offsetWidth;inp.classList.add('err');hud();return;}
    const old=G.lock;G.lock=tgt;if(old&&old!==tgt)paint(old);inp.value=v;G.prev=v;paint(tgt);
    if(lv===tgt.w.toLowerCase()){G.streak++;const m=multOf(G.streak);G.score+=tgt.w.length*10*G.level*m;G.chars+=tgt.w.length;G.done++;
      if(tgt.gold){toast(st,'Towel deployed! Sky cleared','var(--gold)');G.words.slice().forEach(o=>{if(o!==tgt){G.score+=50;remove(o,true);}});}
      else if(tgt.t==='s'&&Math.random()<0.5)toast(st,pick(QUIPS));
      remove(tgt,true);const lv2=1+Math.floor(G.done/8);if(lv2>G.level){G.level=lv2;toast(st,'Level '+lv2,'#fff');}
      hud();}});
  inp.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();pause(true);}if(e.key==='Enter')e.preventDefault();});
  let last=performance.now();
  const loop=now=>{if(!G||G.over||G.mode!=='storm')return;const dt=Math.min(0.05,(now-last)/1000);last=now;
    if(!G.paused){G.clock+=dt;const h=H(),spd=20+G.level*7,gap=Math.max(0.6,2.7-G.level*0.23);
      G.spawnIn-=dt;if(G.spawnIn<=0){spawn();G.spawnIn=gap*(0.7+Math.random()*0.6);}
      if(!G.ev&&G.level>=2&&G.clock>=G.evNext)startEvent();sky.classList.toggle('up',!!(G.ev&&G.ev.id==='rise')||G.words.some(o=>o.dir===-1));if(G.ev&&G.clock>=G.evEnd)endEvent();
      G.words.slice().forEach(o=>{o.y+=o.dir*spd*dt*(o.gold?0.8:1);let x=o.x;if(G.ev&&G.ev.id==='wobble')x=o.x+Math.sin(G.clock*3+o.ph)*6;
        o.el.style.top=o.y+'px';o.el.style.left=x+'%';
        if(o.dir===1?o.y>h-30:o.y<-4){if(!o.gold){G.lives--;G.streak=0;if(o.t!=='s')G.missed[o.w]=o.t;
            const sp=document.createElement('div');sp.className='splat';sp.textContent='SPLAT!';sp.style.left=x+'%';if(o.dir===-1){sp.style.bottom='auto';sp.style.top='8px';}sky.appendChild(sp);setTimeout(()=>sp.remove(),1000);}
          remove(o,false);hud();if(G.lives<=0){G.over=true;setTimeout(endGame,700);}}});}
    G.raf=requestAnimationFrame(loop);};
  hud();G.raf=requestAnimationFrame(loop);
  st.onclick=()=>{if(G&&G.paused)pause(false);inp.focus();};}
function pause(on){if(!G||G.mode!=='storm'||G.over)return;G.paused=on;const old=document.querySelector('.paused');if(old)old.remove();
  if(on){const p=document.createElement('div');p.className='paused';p.innerHTML='<div>Paused<small>Click or press any key to carry on</small></div>';G.sky.appendChild(p);}
  else G.inp.focus();}
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause(true);});
window.addEventListener('blur',()=>pause(true));
document.addEventListener('keydown',e=>{if(G&&G.paused&&e.key!=='Escape'){e.preventDefault();pause(false);}},true);

/* ===================== RESULTS ===================== */
function verdict(mode,score){const r=mode==='sprint'?[[9000,'Typing at the speed of improbability.'],[6000,'Fingers of lightning. Your keyboard needs a lie down.'],[3500,'Very respectable. The wombats are impressed.'],[1500,'A solid start. Practice makes perfect (and so do towels).'],[0,'The teapot believes in you.']]
  :[[15000,'Survived the storm. Legend.'],[8000,'Weathered it like a seasoned space hitchhiker.'],[4000,'Not bad at all. The sky fought back.'],[1500,'The words won this time.'],[0,'Squashed flatter than a crumpet.']];return r.find(x=>score>=x[0])[1];}
function endGame(){if(!G)return;clearInterval(G.timer);cancelAnimationFrame(G.raf);G.over=true;const g=G;
  const el=g.mode==='sprint'?SPRINT_T/60:g.clock/60,wpm=el>0?Math.round(g.chars/5/el):0,acc=g.keys?Math.round((g.keys-g.errors)/g.keys*100):100;
  const key='best:'+g.mode,best=store.get(key)||0,nb=g.score>best;if(nb)store.set(key,g.score);
  const missed=Object.entries(g.missed);
  $('results').innerHTML=`<div class="card"><div class="in">
    <h2>${g.mode==='sprint'?'Sixty-Second Sprint':'Hard mode'}${g.mode==='storm'?' · game over':''}</h2>
    <div class="heads"><div><small>Points</small><div class="bigscore">${g.score}</div></div><div><small>Typing speed</small><div class="bigscore wpm">${wpm}<span> wpm</span></div></div></div>
    <div class="small">${nb?'New personal best!':best?'Your best: '+best+' points':''}</div>
    <p class="how">${g.mode==='sprint'?'Points: 10 for every letter you type, times your combo (×1, rising to ×4 after every 5 words in a row with no mistakes). Long words and clean typing score most.':'Points: 10 for every letter, times the level you were on, times your combo (up to ×4). Surviving longer at higher levels is what scores big.'} Speed (wpm) counts every 5 correct letters as one word, the standard way typing tests measure it.</p>
    ${g.mode==='sprint'?speedScale(wpm):`<p class="verdict">${verdict(g.mode,g.score)}</p>`}
    <div class="statgrid"><div><small>Words</small><b>${g.done}</b></div><div><small>Accuracy</small><b>${acc}%</b></div>${g.mode==='storm'?`<div><small>Level reached</small><b>${g.level}</b></div><div><small>Survived</small><b>${Math.round(g.clock)} s</b></div>`:''}</div>
    ${missed.length?`<h3>Practise spelling these</h3><div class="missed">${missed.map(([w,t])=>`<span style="--k:${KCOL[t]}">${esc(w)}</span>`).join('')}</div>`:''}
    <div id="hsArea"></div>
    <div class="modes"><button class="btn big green" id="again">Play again</button><button class="btn big alt" id="tomenu">Menu</button></div></div></div>`;
  $('again').onclick=()=>g.mode==='sprint'?startSprint():startStorm();$('tomenu').onclick=menu;show('results');
  resultsBoard(g.mode,g.score,wpm);}
/* where does your speed sit? Benchmarks: ~52 wpm average for 168,000 adult keyboard typists, fastest about 120 (Aalto/Cambridge 2018);
   ~38 wpm average typing on a phone (Aalto/Cambridge/ETH 2019, 37,000 people). This game's wpm is a little harder than a typing test: science words are long and every mistake must be fixed. */
function speedScale(w){const MAX=130,pc=v=>Math.min(100,v/MAX*100);
  const band=w>=120?'As fast as the very fastest typists in a study of 168,000 people. Remarkable.':w>=80?'Very fast: well above the average adult, heading for professional speeds.':w>=52?'Faster than the average adult typing on a keyboard (52 wpm).':w>=38?'Faster than the average person typing on a phone (38 wpm), but below the adult keyboard average of 52.':w>=20?'Below the average adult. Typing without looking at the keys is the quickest way to speed up.':'Just getting started. Keep going: everyone starts here.';
  const mk=(v,l,up)=>`<div class="mk ${up?'up':''}" style="left:${pc(v)}%"><i></i><span>${l}</span></div>`;
  return `<div class="scale"><h3>How fast is that?</h3><div class="track"><div class="fill" style="width:${pc(w)}%"></div>${mk(38,'Phone average 38',0)}${mk(52,'Adult average 52',1)}${mk(120,'Fastest 120',0)}<div class="you" style="left:${pc(w)}%"><b>You ${w}</b></div></div>
    <p>${band}</p><p class="small">Averages are for adults on a typing test (studies by Aalto University and the University of Cambridge). This game is a bit harder than a typing test, because the science words are long and every mistake has to be fixed.</p></div>`;}

/* ===================== HIGH SCORES ===================== */
function resultsBoard(board,score,wpm){const el=$('hsArea');if(!el||!window.LB)return;LB.panel(el,'typing_'+board,{score,extra:wpm+' wpm',title:'Leaderboard · '+(board==='sprint'?'Sixty-Second Sprint':'Hard mode')});}
function hiscores(){location.href='/leaderboards/#typing';}

/* ===================== MENU ===================== */
function stop(){if(G){clearInterval(G.timer);clearTimeout(G.cd);cancelAnimationFrame(G.raf);G.over=true;}G=null;}
function menu(){stop();const b1=store.get('best:sprint'),b2=store.get('best:storm');$('bestSprint').textContent=b1?'Your best: '+b1:'';$('bestStorm').textContent=b2?'Your best: '+b2:'';show('menu');}
$('sprintBtn').onclick=startSprint;$('stormBtn').onclick=startStorm;$('hsBtn').onclick=hiscores;
$('quit').onclick=()=>{if(G&&G.mode==='storm')pause(true);if(confirm('Quit this game?'))menu();else if(G&&G.mode==='storm')pause(false);};
window.TGame={startSprint,startStorm,menu,get G(){return G;}};
menu();
})();
