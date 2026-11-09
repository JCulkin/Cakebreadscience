/* Cakebread Science: shared leaderboards for every game.
   Sign in with Google (same Firebase project and accounts as the Spec Tracker, Flashcards and Cakebread Questing).
   Names come from the Google account: first name + last initial (like the Cakebread Questing board).
   Realtime Database: gameScores/<board>/<uid> = { name, score, t }  (one row per student per board: their best score)
   Needs, before this file: firebase-app-compat, firebase-auth-compat, firebase-database-compat (9.22.2) and /js/firebase-config.js.
   Teacher: the Realtime Database rules need, for example:
     "gameScores": { ".read": true, "$board": { "$uid": { ".write": "auth != null && auth.uid === $uid" } } }            */
(function(){
const GAMES={
  elements:{name:'Elements 1–20',url:'/interactive/elements-game/',boards:{
    elements_s1_rounds:'Stage 1 · Round by round',elements_s1_random:'Stage 1 · Randomised',
    elements_s2_rounds:'Stage 2 · Round by round',elements_s2_random:'Stage 2 · Randomised',
    elements_all_rounds:'Everything · Round by round',elements_all_random:'Everything · Randomised'}},
  cell:{name:'What The Cell',url:'/interactive/cell-game/',boards:{
    cell_normal_full:'Normal · Full game',cell_normal_all:'Normal · Marathon',cell_hard_full:'Hard · Full game',cell_hard_all:'Hard · Marathon'}},
  typing:{name:'Type Fast or Perish',url:'/interactive/typing-game/',boards:{typing_sprint:'Sixty-Second Sprint',typing_storm:'Hard mode'}}
};
const boardLabel=b=>{for(const g of Object.values(GAMES))if(g.boards[b])return g.name+' · '+g.boards[b];return b;};
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let auth=null,db=null,user=null,ready=false;const subs=[];
try{if(window.firebase&&window.firebaseConfig){if(!firebase.apps.length)firebase.initializeApp(window.firebaseConfig);
  auth=firebase.auth?firebase.auth():null;db=firebase.database?firebase.database():null;}}catch(e){console.warn('Leaderboards offline',e);}
const PKEY='cbs:pendingScore';
const pending={get(){try{return JSON.parse(sessionStorage.getItem(PKEY));}catch(e){return null;}},set(v){try{v?sessionStorage.setItem(PKEY,JSON.stringify(v)):sessionStorage.removeItem(PKEY);}catch(e){}}};
if(auth)auth.onAuthStateChanged(async u=>{user=u;ready=true;
  if(u){const p=pending.get();if(p&&p.board&&p.score>0){try{await submit(p.board,p.score,p.extra);}catch(e){}pending.set(null);}}
  subs.forEach(f=>{try{f(u);}catch(e){}});});
else ready=true;
// the student's chosen Cakebread Questing name (checked when they set it on the My look page), else first name + initial
function nameOf(u){let c='';try{c=(localStorage.getItem('cbs.adventurer.nick')||'').trim().replace(/\s+/g,' ');}catch(e){}
  if(c&&c.length>=2&&c.length<=16&&/^[\p{L}][\p{L}' \-]*$/u.test(c))return c;
  const n=(u&&u.displayName||'Student').trim().split(/\s+/);return n[0]+(n.length>1?' '+n[n.length-1][0]+'.':'');}
function signIn(){if(!auth)return Promise.reject(new Error('offline'));return auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());}
function signOut(){return auth?auth.signOut():Promise.resolve();}
// save a score: keeps the student's best only
function submit(board,score,extra){if(!db||!user)return Promise.reject(new Error('not signed in'));const u=user;
  return db.ref('gameScores/'+board+'/'+u.uid).transaction(cur=>{if(cur&&cur.score>=score){cur.name=nameOf(u);return cur;}return Object.assign({name:nameOf(u),score,t:Date.now()},extra?{extra}:{});})
    .then(r=>{const v=r.snapshot.val()||{};return {best:v.score||score,improved:(v.score===score)};});}
/* Scores from before sign-in (8–9 Nov 2026: a typed name, no account) stay on the boards, read from the old frozen lists. Same scoring rules as now. */
const LEGACY=b=>{let m=b.match(/^elements_(.+)$/);if(m)return 'elements20HighScores/'+m[1];m=b.match(/^typing_(sprint|storm)$/);if(m)return 'typingHighScores/'+m[1];return null;};
function legacy(board){const path=LEGACY(board);if(!path||!db)return Promise.resolve([]);
  return db.ref(path).once('value').then(s=>{const v=s.val()||[];return (Array.isArray(v)?v:Object.values(v)).filter(x=>x&&typeof x.score==='number').map((x,i)=>({uid:'legacy:'+i,name:String(x.name||'?').slice(0,20),score:x.score,t:Date.parse(x.date)||0,legacy:true}));}).catch(()=>[]);}
function top(board){if(!db)return Promise.reject(new Error('offline'));
  return Promise.race([Promise.all([db.ref('gameScores/'+board).once('value'),legacy(board)]).then(([s,old])=>{const v=s.val()||{};return Object.entries(v).filter(([,x])=>x&&typeof x.score==='number').map(([uid,x])=>({uid,name:x.name,score:x.score,t:x.t,extra:x.extra})).concat(old).sort((a,b)=>b.score-a.score||a.t-b.t);}),
    new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),9000))]);}
function css(){if(document.getElementById('lbcss'))return;const s=document.createElement('style');s.id='lbcss';s.textContent=`
.lbx{margin-top:14px;font-family:inherit}
.lbx h3{margin:0 0 6px;font-family:'Barlow Condensed',sans-serif;font-weight:700;text-transform:uppercase;font-size:20px}
.lbx ol{list-style:none;margin:0;padding:0;border:2px solid #111;background:#fff}
.lbx li{display:grid;grid-template-columns:40px 1fr auto;gap:8px;align-items:center;padding:7px 12px;border-top:1px solid #d8d3c4;font-size:16px}
.lbx li:first-child{border-top:0}
.lbx li .rk{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:20px;color:#555}
.lbx li:nth-child(1) .rk{color:#c9a227}.lbx li:nth-child(2) .rk{color:#8a8f98}.lbx li:nth-child(3) .rk{color:#b0703c}
.lbx li .nm{font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.lbx li .nm .old{margin-left:8px;font-size:11px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:.5px}
.lbx li .sc small{font-family:'Barlow',sans-serif;font-weight:600;font-size:13px;color:#1d4ed8}
.lbx li .sc{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:22px;color:#005e22}
.lbx li.me{background:#fff3c4}
.lbx li.gap{display:block;text-align:center;color:#888;padding:2px;font-size:14px}
.lbx .empty{padding:10px 12px;color:#555;border:2px dashed #d8d3c4}
.lbx .lbsign{margin:0 0 10px;padding:12px 14px;background:#fff3c4;border:2px solid #b45309;display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px}
.lbx .lbsign b{font-size:17px}
.lbx .lbsaved{margin:0 0 10px;padding:10px 14px;background:#e3f5e8;border-left:6px solid #00a03a;font-size:16px}
.lbx .gbtn2{display:inline-flex;align-items:center;gap:8px;background:#fff;border:2px solid #111;padding:8px 14px;font:inherit;font-weight:700;cursor:pointer}
.lbx .gbtn2:hover{background:#111;color:#fff}
.lbx .who{font-size:13px;color:#555;margin-top:6px}.lbx .who button{background:none;border:0;color:#005e22;text-decoration:underline;font:inherit;cursor:pointer;padding:0}`;document.head.appendChild(s);}
const G_ICON='<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg>';
function listHtml(list,meUid){if(!list.length)return '<div class="empty">No scores yet. Be the first!</div>';
  const myIdx=meUid?list.findIndex(x=>x.uid===meUid):-1;let rows=list.slice(0,10).map((e,i)=>`<li class="${e.uid===meUid?'me':''}"><span class="rk">${i+1}</span><span class="nm">${esc(e.name)}${e.legacy?'<small class="old" title="Saved before sign-in, with a typed name">before sign-in</small>':''}</span><span class="sc">${e.score}${e.extra?`<small> · ${esc(e.extra)}</small>`:''}</span></li>`).join('');
  if(myIdx>=10){const e=list[myIdx];rows+=`<li class="gap">⋯</li><li class="me"><span class="rk">${myIdx+1}</span><span class="nm">${esc(e.name)}</span><span class="sc">${e.score}${e.extra?`<small> · ${esc(e.extra)}</small>`:''}</span></li>`;}
  return `<ol>${rows}</ol>`;}
/* panel(el, board, {score, title}) — draws the board; with a score it saves it (signed in) or asks the student to sign in */
function panel(el,board,o={}){if(!el)return;css();const tok=String(Math.random());el.dataset.lbtok=tok;const title=o.title||('Leaderboard · '+boardLabel(board));
  const draw=async()=>{if(el.dataset.lbtok!==tok)return;
    if(!db){el.innerHTML=`<div class="lbx"><h3>${esc(title)}</h3><div class="empty">The leaderboard needs an internet connection.</div></div>`;return;}
    el.innerHTML=`<div class="lbx"><h3>${esc(title)}</h3><div class="empty">Loading…</div></div>`;
    let note='';
    if(o.score>0){if(user){try{const r=await submit(board,o.score,o.extra);note=`<div class="lbsaved">${r.improved?'🏆 Saved! You’re on the leaderboard as <b>'+esc(nameOf(user))+'</b>':'Your best is still <b>'+r.best+'</b>. This score wasn’t higher, so the board is unchanged.'}</div>`;}
        catch(e){note='<div class="lbsaved" style="background:#fdecea;border-color:#c62828">Couldn’t save your score (no connection?).</div>';}}
      else{pending.set({board,score:o.score,extra:o.extra});note=`<div class="lbsign"><b>Sign in to save your score (${o.score}) to the leaderboard.</b><button class="gbtn2" data-lbsign>${G_ICON}Sign in with Google</button></div>`;}}
    let list;try{list=await top(board);}catch(e){if(el.dataset.lbtok!==tok)return;el.innerHTML=`<div class="lbx">${note}<h3>${esc(title)}</h3><div class="empty">Couldn’t load the leaderboard right now.</div></div>`;bind();return;}
    if(el.dataset.lbtok!==tok)return;
    const who=user?`<div class="who">Signed in as ${esc(nameOf(user))} · <button data-lbout>sign out</button></div>`:(o.score>0?'':`<div class="who"><button data-lbsign>Sign in with Google</button> to put your scores on the leaderboard.</div>`);
    el.innerHTML=`<div class="lbx">${note}<h3>${esc(title)}</h3>${listHtml(list,user&&user.uid)}${who}</div>`;bind();};
  function bind(){el.querySelectorAll('[data-lbsign]').forEach(b=>b.onclick=()=>signIn().catch(e=>{if(e&&e.code!=='auth/popup-closed-by-user')alert('Sign-in didn’t work: '+(e.message||e));}));
    el.querySelectorAll('[data-lbout]').forEach(b=>b.onclick=()=>signOut());}
  // redraw when the sign-in state changes (after signing in, the pending score is saved first, then the board redraws)
  const sub=()=>{if(el.dataset.lbtok!==tok||!document.body.contains(el)){const i=subs.indexOf(sub);if(i>=0)subs.splice(i,1);return;}draw();};
  subs.push(sub);if(ready)draw();}
window.LB={GAMES,boardLabel,panel,top,submit,signIn,signOut,nameOf,onUser:f=>{subs.push(f);if(ready)f(user);},get user(){return user;},online:()=>!!db};
})();
