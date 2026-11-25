# Internal link check: python tools/test/links.py .   Prints BROKEN <page> <link>. Expected hits: two '([^' in admin/index.html,
# the maths template and tools/pptx/b_template.html.
import os,re,sys,urllib.parse
root=sys.argv[1]; bad=[]; pages=0
for dp,dn,fn in os.walk(root):
    if '.git' in dp: continue
    for f in fn:
        if not f.endswith('.html'): continue
        p=os.path.join(dp,f); pages+=1
        s=open(p,encoding='utf-8',errors='ignore').read()
        for m in re.finditer(r'''(?:href|src)=["']([^"'#?]+)''',s):
            u=m.group(1)
            if re.match(r'^(https?:|mailto:|data:|javascript:|tel:|//)',u) or '${' in u or '{' in u or u.strip()=='' : continue
            u=urllib.parse.unquote(u)
            t=os.path.normpath(os.path.join(root,u.lstrip('/')) if u.startswith('/') else os.path.join(dp,u))
            if os.path.isdir(t): t=os.path.join(t,'index.html')
            if not os.path.exists(t): bad.append((os.path.relpath(p,root),u))
print(pages,'pages'); 
for b in bad: print('BROKEN',*b)
