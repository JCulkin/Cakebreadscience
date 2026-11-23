/* The full wording of a spec point, kept tidy (19 Nov 2026). User: "it can't be fully omitted — keep the spec looking clean
   but include that extra bit … an ellipsis you can click to expand". Used by the spec trackers, Practice and the admin Review page.
     SPECPT.extras(p)   → HTML to put after the point's main text: equation box, scope note, and (B1.2–1.4) the long
                          description folded behind "… more" (B1.2 split into Plants / Animals / Fungi / Protoctists tabs)
     SPECPT.heading(p)  → the spec's small section label ("Flowering plants", "Humans" …) when a point starts one, else ''
   Data from interactive/spec-quiz/spec.js: p.eq, p.note, p.detail, p.h. Printing opens every "more". No hover needed (phones). */
(function () {
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const css = `.spx-eq{display:inline-block;margin:5px 0 2px;font:700 14px 'Barlow',Arial,sans-serif;background:#eef4ff;border:1.5px solid #1d4ed8;color:#1e3a8a;padding:2px 9px;border-radius:4px}
.spx-note{display:block;margin-top:4px;font-size:13px;color:#5a5a5a;font-style:italic}
.spx-note::before{content:'Spec note: ';font-style:normal;font-weight:700}
.spx-more{display:block;margin-top:4px;font-size:14px}
.spx-more>summary{list-style:none;cursor:pointer;color:#444}
.spx-more>summary::-webkit-details-marker{display:none}
.spx-more>summary .lk{color:#005e22;font-weight:700;white-space:nowrap;text-decoration:underline}
.spx-more[open]>summary .pv{display:none}
.spx-more[open]>summary .lk::after{content:' less ▴'}
.spx-more:not([open])>summary .lk::after{content:' more ▾'}
.spx-tabs{display:flex;flex-wrap:wrap;gap:4px;margin:6px 0 4px}
.spx-tabs button{font:700 13px Barlow,Arial;border:1.5px solid #111;background:#fff;padding:2px 10px;cursor:pointer;border-radius:99px}
.spx-tabs button.on{background:#111;color:#fff}
.spx-body{background:#faf8f2;border-left:3px solid #c9c2b0;padding:6px 10px;color:#222;line-height:1.45}
.spx-body p+p{margin-top:6px}
.spx-h{font:700 12px 'Barlow',Arial,sans-serif;text-transform:uppercase;letter-spacing:1.5px;color:#5a5a5a;margin:10px 0 4px}
@media print{.spx-more>summary .lk,.spx-tabs{display:none}.spx-more .spx-sec{display:block!important}}`;
  let styled = false;
  function style() {
    if (styled || typeof document === 'undefined') return; styled = true;
    const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
    document.addEventListener('click', e => {
      const b = e.target.closest && e.target.closest('.spx-tabs button'); if (!b) return;
      e.preventDefault(); const box = b.closest('.spx-more');
      box.querySelectorAll('.spx-tabs button').forEach(x => x.classList.toggle('on', x === b));
      box.querySelectorAll('.spx-sec').forEach((x, i) => { x.hidden = String(i) !== b.dataset.i; });
    });
    window.addEventListener('beforeprint', () => document.querySelectorAll('.spx-more').forEach(d => { d.open = true; }));
  }
  /* "Plants: … Animals: … Fungi: … Protoctists: …" → [['Plants', '…'], …]; one section if there are no labels */
  function sections(detail) {
    const parts = String(detail).split(/(?:^|\s)(?=(?:Plants|Animals|Fungi|Protoctists|Bacteria|Viruses):\s)/).map(s => s.trim()).filter(Boolean);
    return parts.map(s => { const m = s.match(/^([A-Z][a-z]+):\s([\s\S]*)$/); return m ? [m[1], m[2]] : ['', s]; });
  }
  const preview = t => { const w = String(t).split(/\s+/); return w.slice(0, 12).join(' ') + (w.length > 12 ? '…' : ''); };
  function detailHtml(p) {
    const secs = sections(p.detail);
    const multi = secs.length > 1;
    const body = secs.map(([label, text], i) => `<div class="spx-sec spx-body"${multi && i ? ' hidden' : ''}>${label ? `<b>${esc(label)}:</b> ` : ''}${esc(text)}</div>`).join('');
    const pv = multi ? `Full spec wording for ${secs.map(s => s[0]).join(', ').replace(/, ([^,]*)$/, ' and $1')}` : preview(secs[0][0] ? secs[0][0] + ': ' + secs[0][1] : secs[0][1]);
    return `<details class="spx-more"><summary><span class="pv">${esc(pv)}</span> <span class="lk"></span></summary>`
      + (multi ? `<div class="spx-tabs">${secs.map(([l], i) => `<button type="button" data-i="${i}" class="${i ? '' : 'on'}">${esc(l)}</button>`).join('')}</div>` : '')
      + body + '</details>';
  }
  function extras(p) {
    if (!p) return '';
    style();
    /* word equation and symbol equation are separated by 3+ spaces in spec.js: show them as two boxes */
    return (p.eq ? String(p.eq).split(/\s{3,}/).map(e => `<span class="spx-eq">${esc(e)}</span>`).join(' ') : '')
      + (p.note ? `<span class="spx-note">${esc(p.note)}</span>` : '')
      + (p.detail ? detailHtml(p) : '');
  }
  function heading(p) { if (!p || !p.h) return ''; style(); return `<div class="spx-h">${esc(p.h)}</div>`; }
  /* the full point from spec.js by key ('B1.2'): engine/school copies keep only id + text */
  let BYKEY = null;
  function of(k) {
    if (!BYKEY) { BYKEY = {}; try { SPEC.forEach(s => s.topics.forEach(t => t.subs.forEach(sb => sb.points.forEach(p => { BYKEY[s.name[0] + p.id] = p; })))); } catch (e) {} }
    return BYKEY[k] || null;
  }
  window.SPECPT = { extras, heading, sections, of };
})();
