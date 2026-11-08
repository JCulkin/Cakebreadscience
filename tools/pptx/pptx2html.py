"""Approach B: convert a .pptx into positioned HTML (real text, CSS/SVG shapes, extracted images,
click-entrance animations kept as click-to-reveal steps).
usage: pptx2html.py deck.pptx outdir "Title" [skip,slide,numbers]
"""
import sys, os, re, html, json, hashlib, subprocess
from pptx import Presentation
from lxml import etree

NS = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
A = '{%s}' % NS['a']; P = '{%s}' % NS['p']; R = '{%s}' % NS['r']

src, outdir, title = sys.argv[1], sys.argv[2], sys.argv[3]
skip = set(int(x) for x in sys.argv[4].split(',')) if len(sys.argv) > 4 and sys.argv[4] else set()
os.makedirs(os.path.join(outdir, 'media'), exist_ok=True)
prs = Presentation(src)
SW, SH = prs.slide_width, prs.slide_height
W = 960.0; K = W / SW; H = SH * K
report = {'slides': [], 'warnings': []}

# ---------- theme ----------
master = prs.slide_masters[0]
theme_part = [r.target_part for r in master.part.rels.values() if r.reltype.endswith('/theme')][0]
theme = etree.fromstring(theme_part.blob)
scheme = {}
for el in theme.find('.//a:clrScheme', NS):
    tag = etree.QName(el).localname
    c = el.find('a:srgbClr', NS); s = el.find('a:sysClr', NS)
    scheme[tag] = c.get('val') if c is not None else (s.get('lastClr') if s is not None else '000000')
cmap = master._element.find('p:clrMap', NS)
alias = dict(cmap.attrib) if cmap is not None else {}
def scheme_col(name):
    name = alias.get(name, name)
    return scheme.get(name, '000000')

def mod_color(hexv, el):
    r, g, b = (int(hexv[i:i+2], 16) for i in (0, 2, 4))
    for m in el:
        t = etree.QName(m).localname; v = int(m.get('val', '0')) / 100000
        if t == 'lumMod': r, g, b = r*v, g*v, b*v
        elif t == 'lumOff': r, g, b = r+255*v, g+255*v, b+255*v
        elif t == 'tint': r, g, b = r+(255-r)*(1-v), g+(255-g)*(1-v), b+(255-b)*(1-v)
        elif t == 'shade': r, g, b = r*v, g*v, b*v
    alpha = el.find('a:alpha', NS)
    r, g, b = (max(0, min(255, int(x))) for x in (r, g, b))
    if alpha is not None:
        return f'rgba({r},{g},{b},{int(alpha.get("val"))/100000:.2f})'
    return f'#{r:02x}{g:02x}{b:02x}'

def color_of(parent):
    """parent contains srgbClr/schemeClr/etc"""
    if parent is None: return None
    for el in parent:
        t = etree.QName(el).localname
        if t == 'srgbClr': return mod_color(el.get('val'), el)
        if t == 'schemeClr': return mod_color(scheme_col(el.get('val')), el)
        if t == 'prstClr': return {'black': '#000', 'white': '#fff'}.get(el.get('val'), el.get('val'))
        if t == 'sysClr': return mod_color(el.get('lastClr', '000000'), el)
    return None

# ---------- text style inheritance ----------
def lvl_ppr(lst, lvl):
    if lst is None: return None
    return lst.find(f'a:lvl{lvl+1}pPr', NS)

def find_layout_ph(slide, ph):
    for src in (slide.slide_layout, slide.slide_layout.slide_master):
        for s in src.placeholders:
            try:
                if ph.idx and s.placeholder_format.idx == ph.idx: return s
            except Exception: pass
        for s in src.placeholders:
            if s.placeholder_format.type == ph.type: return s
    return None

def master_ph(ph_type):
    for s in master.placeholders:
        if s.placeholder_format.type == ph_type: return s
    return None

def style_chain(slide, shape, lvl):
    """list of pPr-like elements (lvlNpPr) from most to least specific (excluding paragraph itself)"""
    chain = []
    tx = shape._element.find('.//p:txBody', NS)
    if tx is not None: chain.append(lvl_ppr(tx.find('a:lstStyle', NS), lvl))
    txstyles = master._element.find('p:txStyles', NS)
    kind = 'other'
    if shape.is_placeholder:
        pf = shape.placeholder_format; t = str(pf.type)
        kind = 'title' if ('TITLE' in t and 'SUB' not in t) or 'CENTER_TITLE' in t else 'body'
        lp = find_layout_ph(slide, pf)
        if lp is not None:
            lt = lp._element.find('.//p:txBody', NS)
            if lt is not None: chain.append(lvl_ppr(lt.find('a:lstStyle', NS), lvl))
            mp = master_ph(lp.placeholder_format.type)
            if mp is not None:
                mt = mp._element.find('.//p:txBody', NS)
                if mt is not None: chain.append(lvl_ppr(mt.find('a:lstStyle', NS), lvl))
    st = txstyles.find({'title': 'p:titleStyle', 'body': 'p:bodyStyle', 'other': 'p:otherStyle'}[kind], NS)
    chain.append(lvl_ppr(st, lvl))
    return [c for c in chain if c is not None], kind

def get_prop(elems, fn):
    for e in elems:
        v = fn(e)
        if v is not None: return v
    return None

# ---------- geometry ----------
def xfrm_of(el):
    x = el.find('./p:spPr/a:xfrm', NS)
    if x is None: x = el.find('./p:grpSpPr/a:xfrm', NS)
    if x is None: x = el.find('./p:xfrm', NS)
    return x

def box(el, T, slide=None, shape=None):
    x = xfrm_of(el)
    if x is None or x.find('a:off', NS) is None:
        if shape is not None and shape.is_placeholder:
            lp = find_layout_ph(slide, shape.placeholder_format)
            if lp is not None:
                return T(lp.left, lp.top, lp.width, lp.height) + (0, False, False)
        return None
    off, ext = x.find('a:off', NS), x.find('a:ext', NS)
    bx = T(int(off.get('x')), int(off.get('y')), int(ext.get('cx')), int(ext.get('cy')))
    return bx + (int(x.get('rot', '0')) / 60000, x.get('flipH') == '1', x.get('flipV') == '1')

def ident(x, y, w, h): return (x, y, w, h)

def group_T(el, T):
    x = el.find('./p:grpSpPr/a:xfrm', NS)
    off, ext = x.find('a:off', NS), x.find('a:ext', NS)
    co, ce = x.find('a:chOff', NS), x.find('a:chExt', NS)
    ox, oy, ew, eh = int(off.get('x')), int(off.get('y')), int(ext.get('cx')), int(ext.get('cy'))
    cx, cy, cw, chh = int(co.get('x')), int(co.get('y')), int(ce.get('cx')) or 1, int(ce.get('cy')) or 1
    sx, sy = ew / cw, eh / chh
    def T2(x, y, w, h):
        return T(ox + (x - cx) * sx, oy + (y - cy) * sy, w * sx, h * sy)
    return T2

def px(v): return f'{v*K:.2f}px'

# ---------- fills / lines ----------
def fill_css(el):
    spPr = el.find('p:spPr', NS)
    if spPr is not None:
        if spPr.find('a:noFill', NS) is not None: return 'transparent'
        sf = spPr.find('a:solidFill', NS)
        if sf is not None: return color_of(sf)
        gf = spPr.find('a:gradFill', NS)
        if gf is not None:
            stops = [(int(g.get('pos')) / 1000, color_of(g)) for g in gf.findall('.//a:gs', NS)]
            return 'linear-gradient(180deg,' + ','.join(f'{c} {p:.0f}%' for p, c in stops) + ')'
    st = el.find('p:style/a:fillRef', NS)
    if st is not None and st.get('idx') != '0': return color_of(st)
    return 'transparent'

def line_css(el):
    ln = el.find('p:spPr/a:ln', NS)
    w = 0.75
    col = None
    if ln is not None:
        if ln.find('a:noFill', NS) is not None: return None, 0, False
        if ln.get('w'): w = int(ln.get('w')) / 12700
        sf = ln.find('a:solidFill', NS)
        if sf is not None: col = color_of(sf)
    if col is None:
        st = el.find('p:style/a:lnRef', NS)
        if st is not None and st.get('idx') != '0': col = color_of(st)
    dash = ln is not None and ln.find('a:prstDash', NS) is not None and ln.find('a:prstDash', NS).get('val') not in ('solid', None)
    return col, w * (W / 720), dash   # pt -> px at our 960px scale (slide is 720pt wide)

# ---------- media ----------
media_cache = {}
def save_media(part):
    key = hashlib.md5(part.blob).hexdigest()[:10]
    if key in media_cache: return media_cache[key]
    ext = part.partname.split('.')[-1].lower()
    raw = os.path.join(outdir, 'media', f'{key}.{ext}')
    open(raw, 'wb').write(part.blob)
    if ext == 'gif':
        # big animated gifs -> mp4 loop
        out = os.path.join(outdir, 'media', f'{key}.mp4')
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-movflags', 'faststart', '-pix_fmt', 'yuv420p',
                        '-vf', 'scale=trunc(min(iw\\,1280)/2)*2:-2', '-preset', 'veryfast', '-crf', '28', out])
        os.remove(raw); res = ('video', f'media/{key}.mp4')
    elif ext in ('emf', 'wmf'):
        out = os.path.join(outdir, 'media', f'{key}.png')
        subprocess.run(['soffice', '--headless', '--convert-to', 'png', '--outdir', os.path.join(outdir, 'media'), raw], capture_output=True)
        os.remove(raw); res = ('img', f'media/{key}.png')
    else:
        out = os.path.join(outdir, 'media', f'{key}.webp')
        subprocess.run(['convert', raw, '-resize', '1600x1600>', '-quality', '82', out])
        os.remove(raw); res = ('img', f'media/{key}.webp')
    media_cache[key] = res
    return res

# ---------- custom geometry ----------
def custgeom_svg(el, w, h, fill, stroke, sw):
    paths = []
    for pth in el.findall('.//a:custGeom/a:pathLst/a:path', NS):
        pw, ph = int(pth.get('w', '1')) or 1, int(pth.get('h', '1')) or 1
        sx, sy = w / pw, h / ph
        d = []
        for c in pth:
            t = etree.QName(c).localname
            pts = [(int(q.get('x')) * sx, int(q.get('y')) * sy) for q in c.findall('a:pt', NS)]
            if t == 'moveTo': d.append('M%.1f %.1f' % pts[0])
            elif t == 'lnTo': d.append('L%.1f %.1f' % pts[0])
            elif t == 'cubicBezTo': d.append('C' + ' '.join('%.1f %.1f' % p for p in pts))
            elif t == 'quadBezTo': d.append('Q' + ' '.join('%.1f %.1f' % p for p in pts))
            elif t == 'close': d.append('Z')
            elif t == 'arcTo': report['warnings'].append('arcTo in freeform approximated')
        paths.append(''.join(d))
    f = fill if fill != 'transparent' else 'none'
    return (f'<svg width="{w:.1f}" height="{h:.1f}" viewBox="0 0 {w:.1f} {h:.1f}" style="overflow:visible">' +
            ''.join(f'<path d="{d}" fill="{f}" stroke="{stroke or "none"}" stroke-width="{sw:.2f}"/>' for d in paths) + '</svg>')

def multiply_svg(w, h, fill, stroke, sw):
    # preset 'mathMultiply' (adj 23520): an X made of two bars
    t = min(w, h) * 0.2352
    import math
    cx, cy = w / 2, h / 2
    L = math.hypot(w, h) * 0.36
    def bar(angle):
        return (f'<rect x="{cx-L:.1f}" y="{cy-t/2:.1f}" width="{2*L:.1f}" height="{t:.1f}" '
                f'transform="rotate({angle} {cx:.1f} {cy:.1f})"/>')
    a = math.degrees(math.atan2(h, w))
    return (f'<svg width="{w:.1f}" height="{h:.1f}"><g fill="{fill}" stroke="{stroke or "none"}" stroke-width="{sw:.2f}">'
            + bar(a) + bar(-a) + '</g></svg>')

# ---------- text ----------
FONT_FALLBACK = {'Cambria': "'Caladea',Cambria,Georgia,serif", 'Kalam': "'Kalam',cursive", 'Arial': 'Arial,Helvetica,sans-serif',
                 'Calibri': "'Carlito',Calibri,sans-serif"}
def font_css(name):
    if not name: return None
    if name.startswith('+'):
        name = 'Arial'
    return FONT_FALLBACK.get(name, f"'{name}',sans-serif")

def text_html(slide, shape, el, bw, bh):
    tx = el.find('.//p:txBody', NS)
    if tx is None: return '', 0
    body = tx.find('a:bodyPr', NS)
    # inherit bodyPr from layout placeholder
    bodies = [body]
    if shape.is_placeholder:
        lp = find_layout_ph(slide, shape.placeholder_format)
        if lp is not None:
            lb = lp._element.find('.//p:txBody/a:bodyPr', NS)
            if lb is not None: bodies.append(lb)
    def bp(attr, default):
        for b in bodies:
            if b is not None and b.get(attr) is not None: return b.get(attr)
        return default
    l, t, r, b = (int(bp(k, d)) * K for k, d in (('lIns', 91440), ('tIns', 45720), ('rIns', 91440), ('bIns', 45720)))
    anchor = {'t': 'flex-start', 'ctr': 'center', 'b': 'flex-end'}[bp('anchor', 't')]
    scale = 1.0
    na = body.find('a:normAutofit', NS) if body is not None else None
    if na is not None and na.get('fontScale'): scale = int(na.get('fontScale')) / 100000
    out = []; nchars = 0
    for p in tx.findall('a:p', NS):
        ppr = p.find('a:pPr', NS)
        lvl = int(ppr.get('lvl', '0')) if ppr is not None else 0
        chain, kind = style_chain(slide, shape, lvl)
        pchain = ([ppr] if ppr is not None else []) + chain
        algn = get_prop(pchain, lambda e: e.get('algn')) or 'l'
        marL = get_prop(pchain, lambda e: e.get('marL')); indent = get_prop(pchain, lambda e: e.get('indent'))
        bu = None
        for e in pchain:
            if e.find('a:buNone', NS) is not None: bu = None; break
            c = e.find('a:buChar', NS)
            if c is not None: bu = c.get('char'); break
        def rpr_prop(rpr, fn):
            elems = ([rpr] if rpr is not None else []) + [e.find('a:defRPr', NS) for e in pchain if e.find('a:defRPr', NS) is not None]
            return get_prop(elems, fn)
        spc = get_prop(pchain, lambda e: (lambda s: int(s.get('val')) / 100000 if s is not None else None)(e.find('a:lnSpc/a:spcPct', NS)))
        sb = get_prop(pchain, lambda e: (lambda s: int(s.get('val')) / 100 if s is not None else None)(e.find('a:spcBef/a:spcPts', NS)))
        runs = []
        first_sz = None
        for rr in p:
            tag = etree.QName(rr).localname
            if tag == 'br': runs.append('<br>'); continue
            if tag not in ('r', 'fld'): continue
            rpr = rr.find('a:rPr', NS)
            txt = (rr.findtext('a:t', '', NS))
            nchars += len(txt)
            sz = rpr_prop(rpr, lambda e: e.get('sz'))
            sz = (int(sz) / 100 if sz else 18) * scale
            first_sz = first_sz or sz
            bold = rpr_prop(rpr, lambda e: e.get('b')) == '1'
            ital = rpr_prop(rpr, lambda e: e.get('i')) == '1'
            u = rpr_prop(rpr, lambda e: e.get('u'))
            base = rpr_prop(rpr, lambda e: e.get('baseline'))
            col = rpr_prop(rpr, lambda e: color_of(e.find('a:solidFill', NS)))
            font = rpr_prop(rpr, lambda e: e.find('a:latin', NS).get('typeface') if e.find('a:latin', NS) is not None else None)
            st = [f'font-size:{sz*W/720:.1f}px']
            if bold: st.append('font-weight:700')
            if ital: st.append('font-style:italic')
            if u and u != 'none': st.append('text-decoration:underline')
            if col: st.append(f'color:{col}')
            if font: st.append(f'font-family:{font_css(font)}')
            t_ = html.escape(txt)
            if base and int(base) != 0:
                tagn = 'sub' if int(base) < 0 else 'sup'
                t_ = f'<{tagn}>{t_}</{tagn}>'
            runs.append(f'<span style="{";".join(st)}">{t_}</span>')
        if first_sz is None:
            sz = rpr_prop(p.find('a:endParaRPr', NS), lambda e: e.get('sz'))
            first_sz = (int(sz) / 100 if sz else 18) * scale
        pst = [f'text-align:{ {"l":"left","ctr":"center","r":"right","just":"justify"}.get(algn,"left") }',
               f'font-size:{first_sz*W/720:.1f}px', f'line-height:{(spc or 1.0)*1.2:.2f}']
        if sb: pst.append(f'margin-top:{sb*W/720:.1f}px')
        if marL: pst.append(f'padding-left:{int(marL)*K:.1f}px')
        if indent: pst.append(f'text-indent:{int(indent)*K:.1f}px')
        inner = ''.join(runs) or '&nbsp;'
        if bu and runs: inner = f'<span class="bu">{html.escape(bu)}</span>' + inner
        out.append(f'<p style="{";".join(pst)}">{inner}</p>')
    css = f'padding:{t:.1f}px {r:.1f}px {b:.1f}px {l:.1f}px;justify-content:{anchor}'
    return f'<div class="tx" style="{css}">' + ''.join(out) + '</div>', nchars

# ---------- animations ----------
def click_groups(slide):
    """list of lists of shape ids revealed per click (entrance effects only)"""
    groups = []
    timing = slide._element.find('p:timing', NS)
    if timing is None: return groups
    for par in timing.iter(P + 'par'):
        ctn = par.find('p:cTn', NS)
        if ctn is None: continue
        if ctn.get('nodeType') in ('clickEffect',) and ctn.get('presetClass') == 'entr':
            ids = sorted({t.get('spid') for t in par.iter(P + 'spTgt')})
            groups.append(ids)
        elif ctn.get('nodeType') in ('withEffect', 'afterEffect') and ctn.get('presetClass') == 'entr' and groups:
            groups[-1].extend(t.get('spid') for t in par.iter(P + 'spTgt'))
    return groups

# ---------- slide background ----------
def bg_of(slide):
    for src in (slide, slide.slide_layout, master):
        bg = src._element.find('p:cSld/p:bg', NS)
        if bg is None: continue
        bgpr = bg.find('p:bgPr', NS)
        if bgpr is not None:
            sf = bgpr.find('a:solidFill', NS)
            if sf is not None: return color_of(sf)
            bf = bgpr.find('a:blipFill', NS)
            if bf is not None:
                rid = bf.find('a:blip', NS).get(R + 'embed')
                kind, url = save_media(src.part.related_part(rid))
                return f'url({url}) center/cover'
        ref = bg.find('p:bgRef', NS)
        if ref is not None: return color_of(ref)
    return '#fff'

# ---------- main shape walk ----------
from pptx.shapes.autoshape import Shape
def render_shapes(slide, shapes, T, reveal, stats):
    out = []
    for shape in shapes:
        el = shape._element
        tag = etree.QName(el).localname
        sid = el.find('.//p:cNvPr', NS).get('id')
        cls = ' class="sh step" data-step="%d"' % reveal[sid] if sid in reveal else ' class="sh"'
        if tag == 'grpSp':
            bx = box(el, T)
            inner = render_shapes(slide, shape.shapes, group_T(el, T), reveal, stats)
            if sid in reveal:
                out.append(f'<div class="step" data-step="{reveal[sid]}">{inner}</div>')
            else:
                out.append(inner)
            stats['groups'] += 1
            continue
        if shape.is_placeholder and str(shape.placeholder_format.type).split()[0] in ('SLIDE_NUMBER', 'DATE', 'FOOTER'):
            continue
        bx = box(el, T, slide, shape)
        if bx is None:
            stats['skipped'] += 1; continue
        x, y, w, h, rot, fh, fv = bx
        w_, h_ = w * K, h * K
        tf = []
        if rot: tf.append(f'rotate({rot}deg)')
        if fh: tf.append('scaleX(-1)')
        if fv: tf.append('scaleY(-1)')
        pos = f'left:{px(x)};top:{px(y)};width:{w_:.2f}px;height:{h_:.2f}px' + (f';transform:{" ".join(tf)}' if tf else '')
        if tag == 'pic':
            blip = el.find('.//a:blip', NS)
            rid = blip.get(R + 'embed') if blip is not None else None
            vid = el.find('.//p:nvPr/a:videoFile', NS)
            if rid is None:
                stats['skipped'] += 1; continue
            kind, url = save_media(slide.part.related_part(rid))
            src_rect = el.find('.//a:srcRect', NS)
            inner_style = 'width:100%;height:100%'
            if src_rect is not None and any(src_rect.get(k) for k in 'ltrb'):
                lr, tr_, rr_, br = (int(src_rect.get(k, '0')) / 100000 for k in 'ltrb')
                fw, fhh = 1 - lr - rr_, 1 - tr_ - br
                inner_style = (f'position:absolute;width:{100/fw:.2f}%;height:{100/fhh:.2f}%;'
                               f'left:{-lr/fw*100:.2f}%;top:{-tr_/fhh*100:.2f}%')
            stats['images'] += 1
            if kind == 'video':
                media = f'<video src="{url}" autoplay muted loop playsinline style="{inner_style};object-fit:fill"></video>'
            else:
                media = f'<img src="{url}" alt="" loading="lazy" style="{inner_style};object-fit:fill">'
            out.append(f'<div{cls} style="{pos};overflow:hidden">{media}</div>')
            continue
        if tag == 'cxnSp' or (tag == 'sp' and el.find('.//a:prstGeom', NS) is not None and el.find('.//a:prstGeom', NS).get('prst') == 'line'):
            col, sw, dash = line_css(el)
            x1, y1, x2, y2 = 0, 0, w_, h_
            if fh: x1, x2 = x2, x1
            if fv: y1, y2 = y2, y1
            pos2 = f'left:{px(x)};top:{px(y)};width:{w_:.2f}px;height:{h_:.2f}px'
            out.append(f'<div{cls} style="{pos2}"><svg width="{max(w_,1):.1f}" height="{max(h_,1):.1f}" style="overflow:visible">'
                       f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{col or "#fff"}" stroke-width="{sw:.2f}"'
                       f'{" stroke-dasharray=\"4 3\"" if dash else ""}/></svg></div>')
            stats['lines'] += 1
            continue
        if tag == 'graphicFrame':
            if shape.has_table:
                rows = []
                for row in shape.table.rows:
                    rows.append('<tr>' + ''.join(f'<td>{html.escape(c.text)}</td>' for c in row.cells) + '</tr>')
                out.append(f'<div{cls} style="{pos}"><table class="tbl">{"".join(rows)}</table></div>')
                stats['tables'] += 1
            else:
                stats['unsupported'] += 1
                report['warnings'].append(f'graphicFrame (chart/SmartArt/OLE) skipped')
            continue
        # sp
        fill = fill_css(el)
        col, sw, dash = line_css(el)
        prst = el.find('.//a:prstGeom', NS)
        prst = prst.get('prst') if prst is not None else ('cust' if el.find('.//a:custGeom', NS) is not None else 'rect')
        shape_html = ''
        if prst == 'ellipse':
            bstyle = f'border-radius:50%;background:{fill};' + (f'border:{sw:.2f}px {"dashed" if dash else "solid"} {col};box-sizing:border-box' if col else '')
            shape_html = f'<div style="position:absolute;inset:0;{bstyle}"></div>'
            stats['ovals'] += 1
        elif prst in ('rect', 'roundRect'):
            if fill != 'transparent' or col:
                rad = 'border-radius:8%;' if prst == 'roundRect' else ''
                shape_html = (f'<div style="position:absolute;inset:0;{rad}background:{fill};' +
                              (f'border:{sw:.2f}px solid {col};box-sizing:border-box' if col else '') + '"></div>')
        elif prst == 'mathMultiply':
            shape_html = multiply_svg(w_, h_, fill if fill != 'transparent' else '#fff', col, sw)
            stats['crosses'] += 1
        elif prst == 'cust':
            shape_html = custgeom_svg(el, w_, h_, fill, col, sw)
            stats['freeforms'] += 1
        else:
            # unknown preset: draw bounding box faintly so it's visible in the trial
            shape_html = f'<div style="position:absolute;inset:0;background:{fill};outline:1px dashed #f0f"></div>'
            stats['unsupported'] += 1
            report['warnings'].append(f'preset shape "{prst}" approximated as box')
        th, n = text_html(slide, shape, el, w_, h_)
        stats['chars'] += n
        out.append(f'<div{cls} style="{pos}">{shape_html}{th}</div>')
    return ''.join(out)

slides_html = []
for i, slide in enumerate(prs.slides, 1):
    if i in skip:
        slides_html.append((i, f'<div class="removed">Slide {i} removed: third-party copyright material</div>', 0, '#333'))
        continue
    groups = click_groups(slide)
    reveal = {}
    for gi, ids in enumerate(groups, 1):
        for sid in ids: reveal[sid] = gi
    stats = dict(images=0, ovals=0, crosses=0, groups=0, lines=0, freeforms=0, tables=0, unsupported=0, skipped=0, chars=0)
    body = render_shapes(slide, slide.shapes, ident, reveal, stats)
    notes = slide.notes_slide.notes_text_frame.text.strip() if slide.has_notes_slide else ''
    stats['steps'] = len(groups)
    report['slides'].append({'n': i, **stats})
    slides_html.append((i, body, len(groups), bg_of(slide), notes))

# ---------- page ----------
sections = []
for t in slides_html:
    i, body, steps, bg = t[:4]
    notes = t[4] if len(t) > 4 else ''
    sections.append(f'<section class="slide" data-n="{i}" data-steps="{steps}"><div class="stage" style="background:{bg}">{body}</div>'
                    + (f'<details class="notes"><summary>Teacher notes</summary>{html.escape(notes)}</details>' if notes else '') + '</section>')

page = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'b_template.html')).read()
page = page.replace('{{TITLE}}', html.escape(title)).replace('{{SLIDES}}', '\n'.join(sections))
open(os.path.join(outdir, 'index.html'), 'w').write(page)
json.dump(report, open(os.path.join(outdir, '..', 'b-report.json'), 'w'), indent=1)
print(json.dumps({k: sum(s[k] for s in report['slides']) for k in report['slides'][0] if k != 'n'}))
print(set(report['warnings']))
