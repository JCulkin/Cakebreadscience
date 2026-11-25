# Smoke test: opens ~40 pages signed in / as admin / signed out with a fake Firebase (fakefb.js) and prints any page errors.
# Run from the repo root: python -m http.server 8765  (in another terminal), then: python tools/test/smoke.py   (~3 min)
# Needs: pip install playwright && python -m playwright install chromium
import asyncio
from playwright.async_api import async_playwright
B='http://localhost:8765'; import os; FAKE=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'fakefb.js'),encoding='utf-8').read()
PAGES=['/','/404.html','/today/','/interactive/spec-quiz/','/interactive/spec-quiz/adventurer-home.html','/interactive/spec-quiz/adventurer-mission.html',
'/interactive/spec-quiz/adventurer-map.html','/interactive/spec-quiz/adventurer-wardrobe.html','/interactive/spec-quiz/adventurer-create.html','/interactive/spec-quiz/quiz.html',
'/interactive/spec-quiz/practice.html','/interactive/spec-quiz/reports.html','/Flashcards/','/booklets/','/specifications/science.html','/specifications/biology.html',
'/specifications/chemistry.html','/specifications/physics.html','/specifications/maths.html','/leaderboards/','/admin/','/admin/review.html','/admin/study-guide.html','/admin/showcase.html','/guide/?id=x','/interactive/spec-quiz/practice.html?subs=C1a,C1.37&n=15','/interactive/elements-game/','/interactive/cell-game/',
'/interactive/typing-game/','/interactive/lessons/','/interactive/lessons/chemistry/1f/draft/','/play/','/work/?id=x','/Elevenstudents/','/Elevenstudents/Games/snake.html',
'/worksheets/science.html','/interactive/physics-long-answer/','/interactive/physics-equations/','/test.html','/mascot/']
USER={'uid':'u1','displayName':'Tess Ten','email':'t@x.com'}; ADMIN={'uid':'adm','displayName':'T','email':'culkincakebread@gmail.com'}
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for label,u in (('signed in',USER),('admin',ADMIN),('signed out',None)):
      ctx=await b.new_context(viewport={'width':1300,'height':900})
      async def rt(route):
        x=route.request.url
        if x.startswith(B): return await route.continue_()
        await route.fulfill(status=200,body=FAKE if 'firebase-app' in x else '',content_type='application/javascript')
      await ctx.route('**/*',rt)
      pg=await ctx.new_page(); await pg.goto(B+'/404.html')
      await pg.evaluate("u=>{localStorage.clear();localStorage.setItem('__fake_db',JSON.stringify({fs:{users:{u1:{displayName:'Tess Ten',email:'t@x.com',year:10}}},rt:{}}));if(u)localStorage.setItem('__fake_user',JSON.stringify(u));localStorage.setItem('cbs.games.ok',JSON.stringify({uid:'adm'}))}",u)
      bad=0
      for path in PAGES:
        errs=[]; pg.on('pageerror',h:=lambda e:errs.append(str(e)[:110]))
        try: await pg.goto(B+path,wait_until='domcontentloaded',timeout=20000); await pg.wait_for_timeout(1200)
        except Exception as e: errs.append('LOAD '+str(e)[:60])
        pg.remove_listener('pageerror',h)
        errs=[e for e in errs if 'is not defined' not in e or not any(k in e for k in ('Chart','p5','THREE','Phaser','JSZip'))]
        if errs: bad+=1; print(f'[{label}] {path}: {errs[:2]}')
      print(label,'done, pages with errors:',bad); await ctx.close()
    await b.close()
asyncio.run(main())
