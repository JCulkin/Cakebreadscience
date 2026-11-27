/* "What's new" box (v5.0.0, 18 Nov 2026; items and key updated for v5.1.0, 23 Nov). Shown once per browser until dismissed; one dismissal hides it on every page.
   <script src="/js/whats-new.js" data-place="prepend" data-target="main.wrap"></script>
   data-place: "prepend" = first thing inside the target; default = just before the target (for pages that redraw <main>).
   For the next round of news, change KEY (e.g. cbs.whatsnew.v6) so it shows again. */
(function () {
  const KEY = 'cbs.whatsnew.v60';
  try { if (localStorage.getItem(KEY)) return; } catch (e) { return; }
  const me = document.currentScript;
  const ITEMS = [
    ['🏠', 'Student Home', 'signed-in students now land straight on their homework, upcoming tests & 1-click Revise button', '/today/'],
    ['🎯', '2-day spaced homework', '1 short mission on 2 different days with a live progress bar', '/today/'],
    ['🎓', 'New Revision Notes', 'step-by-step notes, quick checks & self-marked exam questions', '/interactive/lessons/'],
    ['🃏', 'Upgraded Flashcards', '100% of the IGCSE spec, Examiner Key Words deck & mixed due review', '/Flashcards/'],
    ['❓', 'How to use this site', 'quick student guide & interactive page tours', '/how-to-use/']
  ];
  const css = `.cbs-new{position:relative;max-width:1100px;margin:14px auto;background:#fff;border:2px solid #111;box-shadow:0 4px 0 #111;padding:12px 44px 12px 14px;font-family:'Barlow',Arial,sans-serif;color:#111;line-height:1.35}
.cbs-new-wrap{padding:0 18px}.cbs-new-wrap .cbs-new{max-width:1064px}.cbs-new-wrap.in{padding:0}.cbs-new-wrap.in .cbs-new{max-width:none;margin-top:0}
.cbs-new h2{font:900 20px/1 'Barlow Condensed',Arial,sans-serif;text-transform:uppercase;margin:0 0 8px;display:flex;align-items:center;gap:8px}
.cbs-new h2 i{font-style:normal;background:#facc15;border:1.5px solid #111;padding:1px 6px;font-size:13px;letter-spacing:.5px}
.cbs-new ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:3px 18px}
.cbs-new li{font-size:14.5px}
.cbs-new li a{color:#005e22;font-weight:800;text-decoration:none}.cbs-new li a:hover{text-decoration:underline}
.cbs-new p{margin:8px 0 0;font-size:13.5px;color:#555}
.cbs-new .x{position:absolute;top:8px;right:8px;width:30px;height:30px;border:1.5px solid #111;background:#fff;font:700 16px Arial;cursor:pointer;line-height:1}
.cbs-new .x:hover{background:#facc15}
.cbs-new .ok{margin-top:8px;font:800 14px 'Barlow',Arial;background:#111;color:#fff;border:0;padding:5px 14px;cursor:pointer}
@media(max-width:600px){.cbs-new{padding:10px 40px 10px 12px;margin:10px auto}.cbs-new h2{font-size:18px;margin-bottom:6px}.cbs-new li{font-size:14px}.cbs-new p{font-size:13px;margin-top:6px}.cbs-new .ok{margin-top:6px}}
@media print{.cbs-new-wrap{display:none}}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  const wrap = document.createElement('div'); wrap.className = 'cbs-new-wrap';
  wrap.innerHTML = `<section class="cbs-new" role="region" aria-label="What's new"><h2><i>NEW</i> New on Cakebread Science</h2>
    <ul>${ITEMS.map(([ic, name, what, url]) => `<li>${ic} <a href="${url}">${name}</a>: ${what}</li>`).join('')}</ul>
    <p>One Google sign-in (top right) now saves your progress everywhere.</p>
    <button type="button" class="ok">Got it</button><button type="button" class="x" aria-label="Close">✕</button></section>`;
  const close = () => { try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {} wrap.remove(); };
  wrap.querySelector('.x').onclick = close; wrap.querySelector('.ok').onclick = close;
  const place = () => {
    const t = document.querySelector((me && me.dataset.target) || 'main') || document.body.firstElementChild;
    if (me && me.dataset.place === 'prepend') { wrap.classList.add('in'); t.prepend(wrap); } else t.before(wrap);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', place); else place();
})();
