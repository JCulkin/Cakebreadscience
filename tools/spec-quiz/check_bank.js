const fs=require('fs');const dir=process.argv[2];
const vm=require('vm');
for(const f of ['spec.js','questions.js','gens.js'])vm.runInThisContext(fs.readFileSync(dir+'/'+f,'utf8'),{filename:f});
const SPEC=vm.runInThisContext('SPEC'),QUESTIONS=vm.runInThisContext('QUESTIONS'),R=vm.runInThisContext('R');
const keys=new Set();SPEC.forEach(s=>s.topics.forEach(t=>t.subs.forEach(b=>b.points.forEach(p=>keys.add(s.name[0]+p.id)))));
let bad=0;const ids=new Set();
for(const q of QUESTIONS){
 if(ids.has(q.id)){console.log('dup id',q.id);bad++} ids.add(q.id);
 if(!keys.has(q.s)){console.log('bad spec',q.id);bad++}
 const N=q.gen?3000:1;
 for(let i=0;i<N;i++){const v=q.gen?q.gen(R):q;
  if(v.o){const o=v.o; if(o.length!==4||new Set(o).size!==4||o.some(x=>x==null||/undefined|Infinity|—/.test(x)||(/NaN/.test(x)&&q.s!=="C1.39"))){console.log('opts',q.id,JSON.stringify(o),v.q);bad++;break}}
  else if(typeof v.tf!=='boolean'){console.log('tf',q.id);bad++}
  if(/undefined|\bNaN\b(?!₃)/.test(v.q+v.x)&&q.s!=="C1.39"){console.log('text',q.id,v.q,v.x);bad++;break}}
}
const per={};QUESTIONS.forEach(q=>per[q.s]=(per[q.s]||0)+1);
console.log(QUESTIONS.length,'questions,',QUESTIONS.filter(q=>q.gen).length,'generators,',QUESTIONS.filter(q=>q.hard).length,'harder,',QUESTIONS.filter(q=>'tf' in q).length,'T/F,',Object.keys(per).length,'points; min per point',Math.min(...Object.values(per)),'; problems',bad);
console.log('thin:',Object.entries(per).filter(([k,v])=>v<3).map(e=>e.join(':')).join(' '));
if(process.argv[3]){for(const id of process.argv[3].split(',')){const q=QUESTIONS.find(x=>x.id===id);for(let i=0;i<3;i++){const v=q.gen(R);console.log(id,'|',v.q,'|',v.o.join(' / '),'|',v.x)}}}
