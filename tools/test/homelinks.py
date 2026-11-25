# Every page needs a visible link back to the homepage on desktop and phone.
# With the local server on 8765: python tools/test/homelinks.py . list.txt   (list.txt = one page path per line, e.g. today/index.html).
# It also blocks every outside request, so it doubles as the 'page still draws with Firebase blocked' check.
import sys,os,asyncio,json
from playwright.async_api import async_playwright
root=sys.argv[1]; pages=[l.strip() for l in open(sys.argv[2]) if l.strip()]
JS='''()=>{const out=[];for(const a of document.querySelectorAll('a[href]')){let u;try{u=new URL(a.getAttribute('href'),location.href)}catch(e){continue}
 if(u.origin!==location.origin||!(u.pathname==='/'||u.pathname==='/index.html'))continue;const r=a.getBoundingClientRect();const cs=getComputedStyle(a);
 if(r.width<4||r.height<4||cs.visibility==='hidden'||+cs.opacity===0)continue; let e=a,ok=true;while(e){const c=getComputedStyle(e);if(c.display==='none'){ok=false;break}e=e.parentElement}
 if(!ok)continue; out.push(Math.round(r.top+scrollY))} return out}'''
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    res={}
    for w,h,tag in ((1300,850,'D'),(390,800,'P')):
      ctx=await b.new_context(viewport={'width':w,'height':h},is_mobile=(tag=='P'),has_touch=(tag=='P'))
      async def rt(route):
        u=route.request.url
        if u.startswith('http://localhost:8765'): await route.continue_()
        else: await route.fulfill(status=200,body='',content_type='application/javascript')
      await ctx.route('**/*',rt)
      for pg in pages:
        page=await ctx.new_page(); errs=[]
        page.on('pageerror',lambda e:errs.append(str(e)[:90]))
        try:
          await page.goto('http://localhost:8765/'+pg,wait_until='domcontentloaded',timeout=15000); await page.wait_for_timeout(700)
          v=await page.evaluate(JS)
        except Exception as e: v=None; errs.append('LOAD '+str(e)[:60])
        res.setdefault(pg,{})[tag]=(v,errs); await page.close()
      await ctx.close()
    await b.close()
  bad=0
  for pg,d in res.items():
    msg=[]
    for tag,(v,errs) in d.items():
      if not v: msg.append(tag+':NO VISIBLE HOME')
      elif min(v)>400: msg.append(f'{tag}:home only at y={min(v)}')
      if errs: msg.append(tag+':ERR '+errs[0])
    if msg: bad+=1; print(pg,' | '.join(msg))
  print('checked',len(res),'flagged',bad)
asyncio.run(main())
