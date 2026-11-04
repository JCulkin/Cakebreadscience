#!/usr/bin/env python3
"""Freeze an approved lesson draft into a dated, permanent version.

usage:  python3 tools/lessons/freeze.py chemistry/1f [--date 2026-11-12]
        python3 tools/lessons/freeze.py --roots        # (re)write every topic's root redirect

What it does
  1. copies interactive/lessons/<topic>/draft/  ->  interactive/lessons/<topic>/v<date>/
  2. snapshots the shared engine (lesson.css, lesson.js, chem.js...) into v<date>/_assets/
     and rewrites the page to use that copy, so later engine changes can't alter a checked version
  3. marks the page checked:  data-status="checked" data-version="<date>"
  4. updates interactive/lessons/lessons.json  (status "checked", adds the version)
  5. rewrites interactive/lessons/<topic>/index.html to redirect to the newest version
Run from the repo root. Commit the result; never edit a v<date>/ folder afterwards.
"""
import sys, os, re, json, shutil, datetime

ROOT = os.path.join('interactive', 'lessons')
ASSET_URL = '/interactive/lessons/assets/'

def load():
    return json.load(open(os.path.join(ROOT, 'lessons.json'), encoding='utf-8'))

def save(m):
    m['updated'] = datetime.date.today().isoformat()
    json.dump(m, open(os.path.join(ROOT, 'lessons.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

def find(m, topic):
    subj, code = topic.split('/')
    for s in m['subjects']:
        if s['id'] != subj: continue
        for sec in s['sections']:
            for t in sec['topics']:
                if t['code'] == code: return t
    sys.exit(f'{topic} not found in lessons.json')

def write_root(topic, t):
    vers = sorted(t.get('versions', []))
    target = f'v{vers[-1]}/' if vers else 'draft/'
    html = f'''<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="robots" content="noindex, nofollow">
<title>{t["code"]} {t["title"]} · Cakebread Science</title><meta http-equiv="refresh" content="0; url={target}">
<script>location.replace('{target}'+location.search+location.hash)</script></head>
<body><p><a href="{target}">{t["code"]} {t["title"]}</a></p></body></html>
'''
    open(os.path.join(ROOT, topic, 'index.html'), 'w', encoding='utf-8').write(html)

def freeze(topic, date):
    src = os.path.join(ROOT, topic, 'draft'); dst = os.path.join(ROOT, topic, 'v' + date)
    if not os.path.isdir(src): sys.exit(f'no draft at {src}')
    if os.path.exists(dst): sys.exit(f'{dst} already exists: versions are permanent; use another --date')
    shutil.copytree(src, dst)
    page = os.path.join(dst, 'index.html'); s = open(page, encoding='utf-8').read()
    used = sorted(set(re.findall(re.escape(ASSET_URL) + r'([\w.-]+)', s)))
    os.makedirs(os.path.join(dst, '_assets'))
    for f in used: shutil.copy(os.path.join(ROOT, 'assets', f), os.path.join(dst, '_assets', f))
    s = s.replace(ASSET_URL, '_assets/')
    s = re.sub(r'data-status="draft"', f'data-status="checked" data-version="{date}" data-topic="{topic}"', s, count=1)
    open(page, 'w', encoding='utf-8').write(s)
    m = load(); t = find(m, topic)
    t['status'] = 'checked'; t.setdefault('versions', [])
    if date not in t['versions']: t['versions'].append(date)
    t['versions'].sort(); save(m); write_root(topic, t)
    print(f'frozen {topic} -> {dst}  (assets: {", ".join(used)})')

if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: sys.exit(__doc__)
    if a[0] == '--roots':
        m = load()
        for s in m['subjects']:
            for sec in s['sections']:
                for t in sec['topics']:
                    if t.get('status'): write_root(f"{s['id']}/{t['code']}", t)
        print('roots written'); sys.exit()
    date = a[a.index('--date') + 1] if '--date' in a else datetime.date.today().isoformat()
    freeze(a[0], date)
