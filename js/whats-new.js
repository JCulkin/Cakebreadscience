/* Cakebread Science — Dismiss-once feature popup helper (replaced the old top-of-page What's New banner, 28 Nov 2026).
   User rule: no permanent/inline "What's new" strip at the top of the homepage. New features worth pointing out
   use a clean, obvious dismiss-once popup (like the tutorial) that stays away once clicked away.
   Usage: call CBSAnnounce.show({ key: 'cbs.pop.xyz', badge: 'New', title: '...', body: '...', cta: { label, url } }). */
(function () {
  if (window.CBSAnnounce) return;
  function show(opts) {
    if (!opts || !opts.key || !opts.title) return;
    if (/^\/admin(\/|$)/.test(location.pathname || '')) return;
    try { if (localStorage.getItem(opts.key)) return; } catch (e) { return; }
    if (document.getElementById('cbs-pop-dim')) return;
    const st = document.createElement('style');
    st.textContent = `#cbs-pop-dim{position:fixed;inset:0;background:rgba(10,10,14,.62);z-index:2147482500;display:grid;place-items:center;padding:18px;font-family:'Barlow',Arial,sans-serif}
#cbs-pop{background:#fff;color:#111;border:3px solid #111;box-shadow:0 8px 0 #111;max-width:460px;width:100%;padding:20px 22px;position:relative;border-top:8px solid #00a03a}
#cbs-pop .badge{display:inline-block;background:#facc15;color:#111;border:1.5px solid #111;font:900 12px 'Barlow Condensed',Arial,sans-serif;text-transform:uppercase;letter-spacing:.8px;padding:2px 8px;margin-bottom:8px}
#cbs-pop h2{font:900 28px/1.02 'Barlow Condensed',Arial,sans-serif;text-transform:uppercase;margin:0 0 8px}
#cbs-pop p{font-size:15.5px;line-height:1.5;color:#222;margin:0}
#cbs-pop .acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
#cbs-pop .btn{font:900 18px 'Barlow Condensed',Arial,sans-serif;text-transform:uppercase;background:#facc15;color:#111;border:2px solid #111;box-shadow:0 3px 0 #000;padding:7px 15px;text-decoration:none;cursor:pointer}
#cbs-pop .btn.alt{background:#fff}
#cbs-pop .x{position:absolute;top:10px;right:10px;width:32px;height:32px;border:2px solid #111;background:#fff;font:700 16px Arial;cursor:pointer}`;
    document.head.appendChild(st);
    const dim = document.createElement('div');
    dim.id = 'cbs-pop-dim';
    dim.setAttribute('role', 'dialog');
    dim.setAttribute('aria-modal', 'true');
    const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    dim.innerHTML = `<div id="cbs-pop"><button type="button" class="x" aria-label="Close">✕</button>${opts.badge ? `<span class="badge">${esc(opts.badge)}</span>` : ''}<h2>${esc(opts.title)}</h2><p>${opts.body || ''}</p><div class="acts">${opts.cta ? `<a class="btn" id="cbsPopCta" href="${esc(opts.cta.url)}">${esc(opts.cta.label)}</a>` : ''}<button type="button" class="btn ${opts.cta ? 'alt' : ''}" id="cbsPopOk">Got it</button></div></div>`;
    const dismiss = () => { try { localStorage.setItem(opts.key, String(Date.now())); } catch (e) {} dim.remove(); };
    dim.querySelector('.x').onclick = dismiss;
    dim.querySelector('#cbsPopOk').onclick = dismiss;
    if (dim.querySelector('#cbsPopCta')) dim.querySelector('#cbsPopCta').onclick = dismiss;
    dim.addEventListener('click', e => { if (e.target === dim) dismiss(); });
    document.body.appendChild(dim);
  }
  window.CBSAnnounce = { show };
})();
