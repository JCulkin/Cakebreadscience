/* Elements 1–20: online Top 10 boards (same Firebase Realtime Database as the Eleven Students games).
   Stored at elements20HighScores/<board>, each a Top 10 array of {name, score, date}, like snakeHighScores.
   Boards: s1_rounds, s1_random, s2_rounds, s2_random, all_rounds, all_random. Single-round practice and team games are not ranked. */
(function(){
let db=null;
try{if(window.firebase&&window.firebaseConfig){if(!firebase.apps.length)firebase.initializeApp(window.firebaseConfig);db=firebase.database();}}catch(e){console.warn('Scores offline',e);db=null;}
const ROOT='elements20HighScores';
const NAMES={s1:'Stage 1 · The table',s2:'Stage 2 · Electrons',all:'Everything'};
const boardName=b=>{const [c,o]=b.split('_');return `${NAMES[c]} · ${o==='random'?'Randomised':'Round by round'}`;};
// rude-name filter: a short list is enough to stop the obvious ones; anything else can be deleted in the Firebase console
const BAD=['fuck','shit','cunt','wank','twat','bitch','bastard','slut','whore','nigg','faggot','retard','penis','vagina','porn','asshole','arsehole','puta','mierda','coño','polla','joder','gilipollas'];
const clean=s=>String(s||'').replace(/[<>]/g,'').replace(/\s+/g,' ').trim().slice(0,20);
const rude=s=>{const t=s.toLowerCase().replace(/0/g,'o').replace(/[1!|]/g,'i').replace(/3/g,'e').replace(/[4@]/g,'a').replace(/[5$]/g,'s').replace(/[^a-zñ]/g,'');return BAD.some(w=>t.includes(w));};
function get(board){if(!db)return Promise.reject(new Error('offline'));
  return Promise.race([db.ref(ROOT+'/'+board).once('value').then(s=>{const v=s.val()||[];return (Array.isArray(v)?v:Object.values(v)).filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,10);}),
    new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),8000))]);}
const qualifies=(list,score)=>score>0&&(list.length<10||score>list[list.length-1].score);
function save(board,name,score){if(!db)return Promise.reject(new Error('offline'));const entry={name,score,date:new Date().toISOString()};
  return db.ref(ROOT+'/'+board).transaction(cur=>{let l=(Array.isArray(cur)?cur:cur?Object.values(cur):[]).filter(Boolean);l.push(entry);l.sort((a,b)=>b.score-a.score);return l.slice(0,10);})
    .then(r=>{const l=(r.snapshot.val()||[]);const i=l.findIndex(e=>e&&e.date===entry.date&&e.name===name);return {list:l,rank:i+1};});}
window.EScores={online:()=>!!db,get,save,qualifies,clean,rude,boardName};
})();
