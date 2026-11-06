/* Elements 1–20: solo mode, team (projector) mode and Explore mode. Needs data.js and rounds.js. */
(function(){
const $=id=>document.getElementById(id);
const D=window.EL,R=window.ER,{ROUNDS,make,table,bohr,shuffle,esc,chg}=R;
const store={get(k){try{return JSON.parse(localStorage.getItem('el20:'+k));}catch(e){return null;}},set(k,v){try{localStorage.setItem('el20:'+k,JSON.stringify(v));}catch(e){}}};
const STAGES={1:{name:'Stage 1 · The table',col:'#005e22'},2:{name:'Stage 2 · Electrons',col:'#1d4ed8'},3:{name:'Boss round',col:'#b45309'}};
const TEAM_COLS=['#d62828','#1d4ed8','#2e7d32','#f59e0b','#7b1fa2','#0e7490'];
const TEAM_NAMES=['Red','Blue','Green','Gold','Purple','Teal'];
function show(id){['menu','solosetup','play','results','teamsetup','explore','hiscores'].forEach(x=>$(x).classList.toggle('hidden',x!==id));document.body.classList.toggle('proj',id==='play'&&!!TEAM||id==='explore'&&EXPLORE_BIG);window.scrollTo(0,0);}

/* ===================== Question renderer (shared by solo and team) ===================== */
/* render(q, el, cb): cb.answer(ok, info) when the player commits an answer.
   returns controller {retry(), reveal(), stop()} so team mode can offer a steal. */
function render(q,el,cb){
  let h=`<div class="prompt">${q.prompt}</div>`;
  if(q.kind==='mcq'){
    h+=q.visual?`<div class="visual">${q.visual}</div>`:'';
    h+=`<div class="opts ${q.big||q.options.length===2?'big':''} n${q.options.length}">${q.options.map((o,i)=>`<button class="opt" data-i="${i}"><span class="key">${'ABCD'[i]}</span><span>${o}</span></button>`).join('')}</div>`;
    el.innerHTML=h;const bs=[...el.querySelectorAll('.opt')];let locked=false;
    bs.forEach(b=>b.onclick=()=>{if(locked||b.disabled)return;const i=+b.dataset.i,ok=i===q.correct;
      if(ok){b.classList.add('right');lock();}else{b.classList.add('wrong');b.disabled=true;locked=true;}
      cb.answer(ok,{text:q.options[i]});});
    function lock(){locked=true;bs.forEach(x=>x.disabled=true);}
    return {key:k=>{const i='abcd1234'.indexOf(k.toLowerCase());if(i<0)return;const b=bs[i%4];if(b)b.click();},
      retry(){locked=false;},reveal(){lock();bs[q.correct].classList.add('right');},stop(){lock();}};}
  if(q.kind==='place'){
    if(q.mystery){h+=`<div class="clues">${q.clues.map((c,i)=>`<div class="clue ${i?'locked':''}" data-i="${i}"><small>Clue ${i+1}</small><span>${i?'Locked':c}</span></div>`).join('')}</div><div class="cluebar"><span class="worth" id="worth"></span><button class="btn alt" id="moreClue">Next clue</button></div>`;}
    h+=`<div class="visual">${table({label:q.label||'blank',click:true})}</div>`;
    el.innerHTML=h;const cells=[...el.querySelectorAll('.pcell[data-sym]')];let locked=false;
    const targets=[].concat(q.target);
    if(q.mystery){q.shown=1;const upd=()=>{el.querySelectorAll('.clue').forEach((c,i)=>{if(i<q.shown){c.classList.remove('locked');c.querySelector('span').textContent=q.clues[i];}});const w=el.querySelector('#worth');if(w)w.textContent=`Worth ${[100,75,50,25][q.shown-1]} points`;el.querySelector('#moreClue').disabled=q.shown>=4;};
      el.querySelector('#moreClue').onclick=()=>{if(q.shown<4){q.shown++;upd();}};upd();q._upd=upd;}
    cells.forEach(c=>c.onclick=()=>{if(locked||c.classList.contains('wrongcell'))return;const ok=targets.includes(c.dataset.sym);
      if(ok){c.classList.add('rightcell');showLabel(c);lock();}else{c.classList.add('wrongcell');showLabel(c);locked=true;}
      cb.answer(ok,{sym:c.dataset.sym});
      if(ok&&q.mystery){q.shown=4;q._upd();const w=el.querySelector('#worth');if(w)w.textContent='Solved!';}});
    function showLabel(c){const e=D.bySym[c.dataset.sym];c.innerHTML=`<span class="z">${e.z}</span><b>${e.sym}</b>`;}
    function lock(){locked=true;}
    return {retry(){locked=false;if(q.mystery&&q.shown<4){q.shown++;q._upd();}},reveal(){lock();cells.filter(c=>targets.includes(c.dataset.sym)).forEach(c=>{c.classList.add('rightcell');showLabel(c);});if(q.mystery){q.shown=4;q._upd();}},stop(){lock();},key(){}};}
  if(q.kind==='build'){const e=q.el;const cfg=[0,0,0,0];
    h+=`<div class="buildwrap ${q.visual?'withvis':''}">`+(q.visual?`<div class="visual">${q.visual}</div>`:'')+`<div class="builder"><div class="bohrbox" id="bview"></div><div class="shells">${[1,2,3,4].map(i=>`<div class="shell"><span class="sl">Shell ${i}</span><button class="pm" data-s="${i-1}" data-d="-1" aria-label="Remove electron from shell ${i}">−</button><b id="sc${i-1}">0</b><button class="pm" data-s="${i-1}" data-d="1" aria-label="Add electron to shell ${i}">+</button></div>`).join('')}
      <div class="cfgline">Configuration: <b id="cfgtxt">–</b></div><div class="cfgline small" id="ecount"></div><button class="btn green big" id="chk">Check</button></div></div></div>`;
    el.innerHTML=h;let locked=false;
    const draw=()=>{const used=cfg.filter((x,i)=>x>0||cfg.slice(i+1).some(y=>y>0));el.querySelector('#bview').innerHTML=bohr(used.length?used:[0],{label:e.sym});
      cfg.forEach((x,i)=>el.querySelector('#sc'+i).textContent=x);el.querySelector('#cfgtxt').textContent=used.length?used.join('.'):'–';
      const t=cfg.reduce((a,b)=>a+b,0);el.querySelector('#ecount').textContent=`${t} electron${t===1?'':'s'} placed`;};
    el.querySelectorAll('.pm').forEach(b=>b.onclick=()=>{if(locked)return;const i=+b.dataset.s,d=+b.dataset.d;cfg[i]=Math.max(0,Math.min(i===0?2:8,cfg[i]+d));draw();});
    el.querySelector('#chk').onclick=()=>{if(locked)return;const used=cfg.slice(0,4);while(used.length&&used[used.length-1]===0)used.pop();const ok=D.cfg(used)===D.cfg(e.config);
      el.querySelector('.builder').classList.add(ok?'okb':'badb');locked=true;cb.answer(ok,{text:used.join('.')||'nothing'});};
    draw();
    return {retry(){locked=false;el.querySelector('.builder').classList.remove('badb');},reveal(){locked=true;e.config.forEach((x,i)=>cfg[i]=x);for(let i=e.config.length;i<4;i++)cfg[i]=0;draw();el.querySelector('.builder').classList.remove('badb');el.querySelector('.builder').classList.add('okb');},stop(){locked=true;},key(){}};}
}

/* ===================== SOLO ===================== */
let SOLO=null,TEAM=null,EXPLORE_BIG=false;
const SOLO_MODES={s1:{name:'Stage 1 · The table',rounds:['symbols','numbers','place','groups','metals']},s2:{name:'Stage 2 · Electrons',rounds:['build','detective','links','ions','atoms']},all:{name:'Everything',rounds:['symbols','numbers','place','groups','metals','build','detective','links','ions','atoms','mystery']}};
const RAND_N=20;
// cfg: {round:id} for one round, or {content:'s1'|'s2'|'all', order:'rounds'|'random'}
function startSolo(cfg){SOLO={cfg,ri:-1,score:0,max:0,per:[],revise:{}};TEAM=null;
  if(cfg.round){SOLO.ids=[cfg.round];SOLO.key='round:'+cfg.round;}
  else if(cfg.order==='random'){const ids=SOLO_MODES[cfg.content].rounds,pool=[],used=new Set();let order=shuffle(ids),k=0;
    while(pool.length<RAND_N){if(k===order.length){order=shuffle(ids);k=0;}pool.push(make(order[k++],1,used)[0]);}
    SOLO.ids=['random'];SOLO.pool=shuffle(pool);SOLO.key=cfg.content+':random';SOLO.board=cfg.content+'_random';}
  else{SOLO.ids=SOLO_MODES[cfg.content].rounds;SOLO.key=cfg.content;SOLO.board=cfg.content+'_rounds';}
  nextSoloRound();show('play');}
function nextSoloRound(){SOLO.ri++;if(SOLO.ri>=SOLO.ids.length)return soloResults();const id=SOLO.ids[SOLO.ri];
  SOLO.cur=id==='random'?{R:{name:'Random mix'},qs:SOLO.pool,qi:-1,score:0,max:0,res:[]}:{R:ROUNDS.find(r=>r.id===id),qs:make(id,5),qi:-1,score:0,max:0,res:[]};
  SOLO.per.push(SOLO.cur);nextSoloQ();}
function nextSoloQ(){const cur=SOLO.cur;cur.qi++;if(cur.qi>=cur.qs.length)return nextSoloRound();const q=cur.qs[cur.qi];
  hudSolo();const st=$('stage');st.innerHTML='<div id="qbox"></div><div id="fb"></div><div class="nextrow" id="nextrow"></div>';
  let done=false;
  const ctl=render(q,$('qbox'),{answer(ok,info){if(done)return;done=true;ctl.stop();if(!ok)ctl.reveal();
    const pts=ok?(q.mystery?[100,75,50,25][(q.shown||1)-1]:100):0;cur.score+=pts;cur.max+=100;q._pts=pts;SOLO.score+=pts;SOLO.max+=100;cur.res.push(ok?'done':'miss');if(!ok)SOLO.revise[q.tag]=(SOLO.revise[q.tag]||0)+1;
    $('fb').innerHTML=`<div class="fb ${ok?'':'bad'}"><span class="pts">+${pts}</span><b>${ok?R.pick(['Correct!','Yes!','Spot on.','Nice.']):'Not quite.'}</b> ${!ok&&q.kind==='build'&&info?'You built <b>'+esc(info.text)+'</b>. ':''}${q.explain}</div>`;hudSolo();
    const last=cur.qi===cur.qs.length-1,lastR=SOLO.ri===SOLO.ids.length-1;$('nextrow').innerHTML=`<button class="btn big green" id="nx">${last?(lastR?'See results':'Next round'):'Next'} →</button>`;$('nx').onclick=nextSoloQ;$('nx').focus({preventScroll:true});$('nextrow').scrollIntoView({block:'nearest',behavior:'smooth'});}});
  KEYCTL=ctl;}
function hudSolo(){const cur=SOLO.cur,n=cur.qs.length,q=cur.qs[Math.min(cur.qi,n-1)],rand=SOLO.ids[0]==='random';
  const rn=rand?(ROUNDS.find(r=>r.id===q.round)||{name:''}).name:cur.R.name;
  $('hud').innerHTML=`<div><div class="meta">${rand?'Random mix · ':SOLO.ids.length>1?`Round ${SOLO.ri+1} of ${SOLO.ids.length} · `:''}Question ${Math.min(cur.qi+1,n)} of ${n}</div><div class="rname">${rn}</div><div class="pips ${n>10?'many':''}">${cur.qs.map((_,i)=>`<i class="${cur.res[i]||(i===cur.qi?'now':'')}"></i>`).join('')}</div></div><div class="score"><small>Score</small><span>${SOLO.score}</span></div>`;}
function soloResults(){const pct=SOLO.max?Math.round(SOLO.score/SOLO.max*100):0,key='best:'+SOLO.key,best=store.get(key)||0,nb=SOLO.score>best;if(nb)store.set(key,SOLO.score);
  const rev=Object.entries(SOLO.revise).sort((a,b)=>b[1]-a[1]);
  $('results').innerHTML=`<div class="card"><div class="bar6"><i style="flex:4;background:#005e22"></i><i style="flex:1;background:#111"></i><i style="flex:6;background:#005e22"></i><i style="flex:2;background:#111"></i></div><div class="in">
   <h2>${pct>=90?'Element expert!':pct>=70?'Great work':pct>=50?'Good effort':'Keep practising'}</h2><div class="bigscore">${SOLO.score}</div><div class="small">out of ${SOLO.max} (${pct}%)${nb?' · New personal best!':best?` · Your best: ${best}`:''}</div>
   <table class="rt"><tr><th>Round</th><th>Score</th></tr>${soloBreakdown().map(p=>`<tr><td>${p.name}</td><td>${p.score} / ${p.max}</td></tr>`).join('')}</table>
   ${rev.length?`<h3>Revise these</h3><ul class="revise">${rev.map(([t,n])=>`<li>${esc(t)}${n>1?` <span class="small">(×${n})</span>`:''}</li>`).join('')}</ul>`:'<p><b>Nothing to revise. Perfect!</b></p>'}
   <div id="hsArea"></div>
   <div class="modes"><button class="btn big green" id="again">Play again</button><button class="btn big alt" id="tomenu">Menu</button></div></div></div>`;
  if(SOLO.board)resultsBoard(SOLO.board,SOLO.score);
  const cfg=SOLO.cfg;$('again').onclick=()=>startSolo(cfg);$('tomenu').onclick=menu;show('results');}
function soloBreakdown(){if(SOLO.ids[0]!=='random')return SOLO.per.map(p=>({name:p.R.name,score:p.score,max:p.max}));
  const by={};SOLO.cur.qs.forEach((q,i)=>{if(i>SOLO.cur.qi)return;const r=ROUNDS.find(x=>x.id===q.round);const k=r?r.name:q.round;by[k]=by[k]||{name:k,score:0,max:0};by[k].max+=100;by[k].score+=q._pts||0;});
  return Object.values(by);}

/* ===================== HIGH SCORES ===================== */
const S=window.EScores;
const BOARDS=['s1_rounds','s1_random','s2_rounds','s2_random','all_rounds','all_random'];
function listHtml(list,me){return list.length?`<ol>${list.map((e,i)=>`<li class="${me&&i===me-1?'me':''}"><span class="rk">${i+1}</span><span class="nm">${esc(e.name)}</span><span class="sc">${e.score}</span></li>`).join('')}</ol>`:'<div class="empty">No scores yet. Be the first!</div>';}
function showBoard(el,board,o={}){if(!el)return;if(!S||!S.online()){el.innerHTML='';return;}
  const tok=Math.random();el.dataset.tok=tok;el.innerHTML=`<div class="hs"><h3>${o.title||'Top 10'}</h3><div class="small">Loading…</div></div>`;
  S.get(board).then(l=>{if(el.dataset.tok!=tok)return;el.innerHTML=`<div class="hs"><h3>${o.title||'Top 10'}</h3>${listHtml(l,o.me)}</div>`;})
   .catch(()=>{if(el.dataset.tok!=tok)return;el.innerHTML=`<div class="hs"><h3>${o.title||'Top 10'}</h3><div class="empty">Couldn’t load the high scores (no connection?).</div></div>`;});}
function resultsBoard(board,score){const el=$('hsArea');if(!el||!S||!S.online())return;el.innerHTML='<div class="hs small">Checking the Top 10…</div>';
  S.get(board).then(list=>{
    if(!S.qualifies(list,score)){el.innerHTML=`<div class="hs"><h3>Top 10 · ${S.boardName(board)}</h3>${listHtml(list)}</div>`;return;}
    const rank=list.filter(e=>e.score>=score).length+1;
    el.innerHTML=`<div class="hsform"><b>🎉 You made the Top 10! (#${rank})</b><div class="small">${S.boardName(board)}</div>
      <div class="row"><input id="hsName" maxlength="20" placeholder="Your name" autocomplete="off" aria-label="Your name"><button class="btn green" id="hsSave">Save score</button></div><div class="msg" id="hsMsg"></div></div>
      <div class="hs"><h3>Top 10 now</h3>${listHtml(list)}</div>`;
    const inp=$('hsName'),btn=$('hsSave'),msg=$('hsMsg');inp.value=store.get('hsname')||'';inp.focus({preventScroll:true});
    const go=()=>{const n=S.clean(inp.value);if(!n){msg.textContent='Type your name first.';return;}if(S.rude(n)){msg.textContent='Choose a different name.';return;}
      btn.disabled=true;msg.textContent='';store.set('hsname',n);
      S.save(board,n,score).then(r=>{el.innerHTML=`<div class="hs"><h3>${r.rank?`Saved: you’re #${r.rank}!`:'Saved, but you’ve already been pushed out of the Top 10!'}</h3>${listHtml(r.list,r.rank)}</div>`;})
       .catch(()=>{btn.disabled=false;msg.textContent='Couldn’t save (no connection?). Try again.';});};
    btn.onclick=go;inp.onkeydown=ev=>{if(ev.key==='Enter'){ev.preventDefault();ev.stopPropagation();go();}};})
   .catch(()=>{el.innerHTML='<div class="hs small">Couldn’t reach the high scores (no connection?).</div>';});}
let HSB='s1_rounds';
function hiscores(){const box=$('hiscores');
  box.innerHTML=`<a class="back" href="#" id="hsBack">← Menu</a><h1>High scores</h1><p class="lede">Top 10 for each solo setup. Single-round practice and team games aren’t ranked.</p>
    <div class="hsboards">${BOARDS.map(b=>`<button class="chip ${b===HSB?'on':''}" data-b="${b}">${S?S.boardName(b):b}</button>`).join('')}</div><div id="hsList"></div>`;
  box.querySelector('#hsBack').onclick=ev=>{ev.preventDefault();menu();};
  box.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{HSB=b.dataset.b;hiscores();});
  if(!S||!S.online())$('hsList').innerHTML='<div class="hs"><div class="empty">High scores need an internet connection.</div></div>';else showBoard($('hsList'),HSB,{title:S.boardName(HSB)});
  show('hiscores');}

/* ===================== SOLO SETUP ===================== */
function soloSetup(){const s=store.get('solocfg')||{content:'s1',order:'rounds'};const box=$('solosetup');
  const n=()=>s.order==='random'?RAND_N:SOLO_MODES[s.content].rounds.length*5;
  const rc=r=>{const b=store.get('best:round:'+r.id);return `<button class="rcard" data-id="${r.id}" style="--s:${STAGES[r.stage].col}"><span class="st">${STAGES[r.stage].name}</span><h3>${r.name}</h3><p>${r.desc}</p>${b?`<span class="best">Best: ${b} / 500</span>`:''}</button>`;};
  const draw=()=>{const best=store.get('best:'+s.content+(s.order==='random'?':random':''));
    box.innerHTML=`<a class="back" href="#" id="ssBack">← Menu</a><h1>Solo</h1>
    <div class="card"><div class="in setup">
     <h3>Questions from</h3><div class="chips">${[['s1','Stage 1 · The table'],['s2','Stage 2 · Electrons'],['all','Everything']].map(([k,v])=>`<button class="chip ${s.content===k?'on':''}" data-c="${k}">${v}</button>`).join('')}</div>
     <h3>Order</h3><div class="chips">${[['rounds','Round by round'],['random','Randomise']].map(([k,v])=>`<button class="chip ${s.order===k?'on':''}" data-o="${k}">${v}</button>`).join('')}</div>
     <p class="small" style="margin-top:6px">${s.order==='random'?`${RAND_N} questions, all mixed up.`:`5 questions from each round, one round at a time${s.content==='all'?', ending with the Mystery element boss round':''}.`}</p>
     <div class="modes"><button class="btn big green" id="ssGo">Start: ${n()} questions</button>${best?`<span class="small" style="align-self:center">Your best: ${best}</span>`:''}</div></div></div>
    <div id="ssBoard"></div>
    <details class="oneround"><summary>Or practise just one round</summary><div class="rounds">${ROUNDS.map(rc).join('')}</div></details>`;
    box.querySelector('#ssBack').onclick=ev=>{ev.preventDefault();menu();};
    box.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{s.content=b.dataset.c;draw();});
    box.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{s.order=b.dataset.o;draw();});
    box.querySelector('#ssGo').onclick=()=>{store.set('solocfg',s);startSolo({content:s.content,order:s.order});};
    box.querySelectorAll('.rcard').forEach(b=>b.onclick=()=>startSolo({round:b.dataset.id}));
    showBoard($('ssBoard'),s.content+'_'+s.order,{title:'Top 10 for this setup'});};
  draw();show('solosetup');}

/* ===================== TEAM ===================== */
let KEYCTL=null;
function teamSetup(){const s=store.get('teamcfg')||{n:4,names:TEAM_NAMES.slice(),content:'both',per:3,timer:30,steal:true};
  const box=$('teamsetup');
  const draw=()=>{box.innerHTML=`<a class="back" href="#" id="tsBack">← Menu</a><h1>Team game</h1><p class="lede">For the board: put the class into teams. Teams take turns. Tap the answer the team chooses (or press A–D). Get it wrong and the next team can steal it for half points.</p>
    <div class="card"><div class="in setup">
     <h3>1. How many teams?</h3><div class="chips">${[2,3,4,5,6].map(n=>`<button class="chip ${s.n===n?'on':''}" data-n="${n}">${n}</button>`).join('')}</div>
     <div class="teamnames">${Array.from({length:s.n},(_,i)=>`<label style="--c:${TEAM_COLS[i]}"><i></i><input value="${esc(s.names[i]||TEAM_NAMES[i])}" data-i="${i}" maxlength="18" aria-label="Team ${i+1} name"></label>`).join('')}</div>
     <h3>2. Questions from</h3><div class="chips">${[['s1','Stage 1: the table'],['s2','Stage 2: electrons'],['both','Both stages'],['mystery','Mystery elements only']].map(([k,v])=>`<button class="chip ${s.content===k?'on':''}" data-c="${k}">${v}</button>`).join('')}</div>
     <h3>3. Questions per team</h3><div class="chips">${[2,3,5,8].map(n=>`<button class="chip ${s.per===n?'on':''}" data-p="${n}">${n}</button>`).join('')}</div>
     <h3>4. Timer (optional)</h3><div class="chips">${[0,20,30,45,60].map(n=>`<button class="chip ${s.timer===n?'on':''}" data-t="${n}">${n?n+' s':'Off'}</button>`).join('')}</div>
     <p class="small" style="margin-top:6px">${s.timer?`Each team has ${s.timer} seconds to answer, or it passes on.`:'No timer: teams take as long as they need.'}</p>
     <label class="toggle"><input type="checkbox" id="steal" ${s.steal?'checked':''}> Steals: a wrong answer passes to a random other team for half points (not on two-choice questions)</label>
     <div class="modes"><button class="btn big green" id="tsGo">Start: ${s.n*s.per} questions</button></div></div></div>`;
    box.querySelector('#tsBack').onclick=ev=>{ev.preventDefault();menu();};
    box.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{s.n=+b.dataset.n;draw();});
    box.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{s.content=b.dataset.c;draw();});
    box.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{s.per=+b.dataset.p;draw();});
    box.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{s.timer=+b.dataset.t;draw();});
    box.querySelectorAll('.teamnames input').forEach(i=>i.oninput=()=>{s.names[+i.dataset.i]=i.value;});
    box.querySelector('#steal').onchange=ev=>{s.steal=ev.target.checked;};
    box.querySelector('#tsGo').onclick=()=>{store.set('teamcfg',s);startTeam(s);};};
  draw();show('teamsetup');}
function startTeam(s){const ids=s.content==='s1'?SOLO_MODES.s1.rounds:s.content==='s2'?SOLO_MODES.s2.rounds:s.content==='mystery'?['mystery']:ROUNDS.map(r=>r.id);
  const total=s.n*s.per;const pool=[];let k=0;const order=shuffle(ids);
  const used=new Set();while(pool.length<total){const id=order[k++%order.length];pool.push(make(id,1,used)[0]);}
  TEAM={cfg:s,teams:Array.from({length:s.n},(_,i)=>({name:(s.names[i]||TEAM_NAMES[i]).trim()||TEAM_NAMES[i],col:TEAM_COLS[i],score:0,right:0})),qs:pool,qi:-1};SOLO=null;
  nextTeamQ();show('play');}
function nextTeamQ(){TEAM.qi++;if(TEAM.qi>=TEAM.qs.length)return podium();const q=TEAM.qs[TEAM.qi],n=TEAM.teams.length;let turn=TEAM.qi%n,steal=false,over=false,timer=null;
  const R0=ROUNDS.find(r=>r.id===q.round);
  const hud=()=>{$('hud').innerHTML=`<div class="teamturn" style="--c:${TEAM.teams[turn].col}"><span class="meta">Question ${TEAM.qi+1} of ${TEAM.qs.length} · ${R0.name}</span><span class="tname">${steal?'STEAL! ':''}${esc(TEAM.teams[turn].name)}${steal?' (half points)':'’s turn'}</span></div>
    <div class="board">${TEAM.teams.map((t,i)=>`<div class="tscore ${i===turn&&!over?'now':''}" style="--c:${t.col}"><span>${esc(t.name)}</span><b>${t.score}</b></div>`).join('')}</div>`;};
  const st=$('stage');st.innerHTML='<div class="tbar hidden" id="tbar"><i></i><span></span></div><div id="qbox"></div><div id="fb"></div><div class="nextrow" id="nextrow"><button class="btn alt" id="reveal">Reveal answer</button></div>';
  const startTimer=()=>{clearInterval(timer);const T=TEAM.cfg.timer;if(!T)return;const bar=$('tbar');bar.classList.remove('hidden');const t0=Date.now();
    timer=setInterval(()=>{const left=Math.max(0,T-(Date.now()-t0)/1000);bar.querySelector('i').style.width=(left/T*100)+'%';bar.querySelector('span').textContent=Math.ceil(left)+' s';bar.classList.toggle('low',left<=5);if(left<=0){clearInterval(timer);onWrong(true);}},100);};
  const ctl=render(q,$('qbox'),{answer(ok){if(over)return;clearInterval(timer);ok?onRight():onWrong(false);}});KEYCTL=ctl;
  function onRight(){over=true;const base=q.mystery?[100,75,50,25][(q.shown||1)-1]:100,pts=steal?Math.round(base/2):base;TEAM.teams[turn].score+=pts;TEAM.teams[turn].right++;ctl.stop();
    $('fb').innerHTML=`<div class="fb"><span class="pts">+${pts}</span><b>${esc(TEAM.teams[turn].name)} ${steal?'steal it!':'got it!'}</b> ${q.explain}</div>`;finish();}
  function onWrong(timeout){if(TEAM.cfg.steal&&!steal&&n>1&&!(q.kind==='mcq'&&q.options.length<=2)){steal=true;{const others=TEAM.teams.map((_,i)=>i).filter(i=>i!==turn);turn=others[Math.floor(Math.random()*others.length)];}ctl.retry();hud();
      $('fb').innerHTML=`<div class="fb bad"><b>${timeout?'Time’s up!':'Not quite.'}</b> ${esc(TEAM.teams[turn].name)}, can you steal it?</div>`;startTimer();return;}
    over=true;ctl.stop();ctl.reveal();$('fb').innerHTML=`<div class="fb bad"><b>${timeout?'Time’s up.':'No points this time.'}</b> ${q.explain}</div>`;finish();}
  function finish(){clearInterval(timer);hud();$('nextrow').innerHTML=`<button class="btn big green" id="nx">${TEAM.qi===TEAM.qs.length-1?'Final scores':'Next question'} →</button>`;$('nx').onclick=nextTeamQ;$('nx').focus({preventScroll:true});}
  $('reveal').onclick=()=>{if(over)return;over=true;clearInterval(timer);ctl.stop();ctl.reveal();$('fb').innerHTML=`<div class="fb bad"><b>Answer revealed.</b> ${q.explain}</div>`;finish();};
  hud();startTimer();TEAM.stopTimer=()=>clearInterval(timer);}
function podium(){const ranked=TEAM.teams.slice().sort((a,b)=>b.score-a.score);const top=ranked[0].score,winners=ranked.filter(t=>t.score===top);
  $('results').innerHTML=`<div class="card podium"><div class="in"><h1>${winners.length>1?'It’s a tie!':esc(winners[0].name)+' win!'}</h1>
   <div class="pod">${ranked.map((t,i)=>`<div class="pl" style="--c:${t.col};--h:${Math.max(18,top?t.score/top*100:18)}%"><b>${t.score}</b><div class="col"></div><span>${i+1}. ${esc(t.name)}</span></div>`).join('')}</div>
   <div class="modes"><button class="btn big green" id="again">Play again</button><button class="btn big alt" id="tomenu">Menu</button></div></div></div>`;
  $('again').onclick=()=>startTeam(TEAM.cfg);$('tomenu').onclick=menu;document.body.classList.add('proj');show('results');document.body.classList.add('proj');}

/* ===================== EXPLORE ===================== */
const EXT={label:'full',kind:true,cfg:false};let EXSEL=null;
function explore(){const t=EXT;const box=$('explore');
  const info=e=>{if(!e)return '<p class="small">Tap any element to see everything about it.</p>';const ion=D.IONS[e.sym];
    return `<div class="einfo"><div class="ebig"><span class="z">${e.z}</span><b>${e.sym}</b><span>${e.name}</span></div>
      <table class="rt"><tr><td>Position</td><td>${e.group===null?'Period 1 (hydrogen sits on its own)':`${D.groupLabel(e.group)}${D.GROUP_NAMES[e.group]?' ('+D.GROUP_NAMES[e.group]+')':''}, period ${e.period}`}</td></tr>
      <tr><td>Type</td><td>${{metal:'Metal',nonmetal:'Non-metal',semi:'Semi-metal (metalloid)'}[e.kind]}, ${e.state} at room temperature</td></tr>
      <tr><td>Protons</td><td>${e.z}</td></tr><tr><td>Electrons</td><td>${e.z}</td></tr><tr><td>Neutrons</td><td>${e.mass-e.z} (mass number ${e.mass})</td></tr>
      <tr><td>Electronic configuration</td><td><b>${D.cfg(e.config)}</b></td></tr>
      <tr><td>Ion</td><td>${ion?`${e.sym}<sup>${chg(ion)}</sup> (${ion>0?'loses':'gains'} ${Math.abs(ion)})`:e.group===0?'None: full outer shell':'Not needed at GCSE'}</td></tr></table></div>
      <div class="bohrbox">${bohr(e.config,{label:e.sym})}</div>`;};
  box.innerHTML=`<a class="back" href="#" id="exBack">← Menu</a><h1>Explore the first 20</h1>
    <div class="chips">${[['label','full','Names'],['label','symz','Symbols + numbers'],['label','cfg','Electron configurations'],['label','blank','Blank (test yourself)']].map(([k,v,txt])=>`<button class="chip ${t[k]===v?'on':''}" data-k="${k}" data-v="${v}">${txt}</button>`).join('')}
      <button class="chip ${t.kind?'on':''}" id="exKind">Metal / non-metal colours</button><button class="chip ${EXPLORE_BIG?'on':''}" id="exBig">Big (projector)</button></div>
    <div class="exgrid"><div>${table({label:t.label,colour:t.kind?'kind':null,click:true,step:t.kind,names:true,hl:EXSEL?{[EXSEL]:'hl'}:{}})}
      <div class="legend">${t.kind?'<span><i class="k-metal"></i>Metal</span><span><i class="k-nonmetal"></i>Non-metal</span><span><i class="k-semi"></i>Semi-metal</span>':''}</div></div>
      <div class="card"><div class="in" id="exInfo">${info(EXSEL&&D.bySym[EXSEL])}</div></div></div>`;
  box.querySelector('#exBack').onclick=ev=>{ev.preventDefault();EXPLORE_BIG=false;menu();};
  box.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{t[b.dataset.k]=b.dataset.v;explore();});
  box.querySelector('#exKind').onclick=()=>{t.kind=!t.kind;explore();};
  box.querySelector('#exBig').onclick=()=>{EXPLORE_BIG=!EXPLORE_BIG;explore();};
  box.querySelectorAll('.pcell[data-sym]').forEach(c=>c.onclick=()=>{EXSEL=c.dataset.sym;explore();});
  show('explore');}

/* ===================== MENU ===================== */
function menu(){TEAM&&TEAM.stopTimer&&TEAM.stopTimer();TEAM=null;SOLO=null;KEYCTL=null;show('menu');}
$('soloBtn').onclick=soloSetup;$('hsBtn').onclick=()=>hiscores();$('teamBtn').onclick=teamSetup;$('exploreBtn').onclick=explore;
$('quit').onclick=()=>{if(confirm('Quit this game?'))menu();};
document.addEventListener('keydown',ev=>{if($('play').classList.contains('hidden'))return;if(ev.target.tagName==='INPUT')return;
  const nx=$('nx');if((ev.key==='Enter'||ev.key===' ')&&nx){ev.preventDefault();nx.click();return;}
  if(KEYCTL&&KEYCTL.key&&/^[a-dA-D1-4]$/.test(ev.key))KEYCTL.key(ev.key);});
window.EGame={startSolo,startTeam,render,menu};
menu();
})();
