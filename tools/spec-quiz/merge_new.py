"""Append new questions (written with bare spec ids) to questions.js, numbering each from the next free number for its point.
Usage: python3 -I merge_new.py questions.js add1.js [add2.js ...]"""
import re, sys
qf = sys.argv[1]; src = open(qf, encoding='utf-8').read()
used = {}
for spec, n in re.findall(r"^(?:MH|TH|M|T)\('([BCP]\d+\.\d+)-(\d+)'", src, flags=re.M):
    used[spec] = max(used.get(spec, 0), int(n))
added = 0
for f in sys.argv[2:]:
    t = open(f, encoding='utf-8').read()
    def num(m):
        global added
        spec = m.group(2); used[spec] = used.get(spec, 0) + 1; added += 1
        return f"{m.group(1)}('{spec}-{used[spec]:02d}',"
    t = re.sub(r"^(MH|TH|M|T)\('([BCP]\d+\.\d+)',", num, t, flags=re.M)
    src = src.rstrip() + '\n' + t
open(qf, 'w', encoding='utf-8').write(src)
print('added', added)
