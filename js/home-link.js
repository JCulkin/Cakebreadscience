/* Unified Cakebread Science home bar for pages without a site header (streamlined 26 Nov 2026).
   Add just before </body>:
     <script src="/js/home-link.js"></script>
     <script src="/js/home-link.js" data-section="Maths worksheets"></script>
     <script src="/js/home-link.js" data-back="/worksheets/science.html" data-back-label="Science worksheets"></script>
     <script src="/js/home-link.js" data-mode="float"></script>     → compact floating button (full-screen games)
   Optional data-pos="bottom" puts the floating button bottom-left instead of top-left.
   Never shown when printing; skipped if /js/account.js data-bar already drew .cbs-sitebar. */
(function () {
  if (!window.__cbsAuthGate) { var ag = document.createElement('script'); ag.src = '/js/auth-gate.js'; (document.head || document.documentElement).appendChild(ag); }
  if (window.__cbsHomeLink) return;
  window.__cbsHomeLink = true;
  var s = document.currentScript || {};
  var d = s.dataset || {};
  var mode = d.mode || 'bar';
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var head = '/img/mascot/head-pixel-hd.webp';

  var css = document.createElement('style');
  css.textContent =
    '.cbs-home-bar{display:flex;align-items:center;flex-wrap:wrap;gap:6px 10px;width:100%;box-sizing:border-box;margin:0;padding:8px 18px;min-height:48px;background:#111;color:#eeeae0;border-bottom:3px solid #00a03a;font-family:Barlow,Arial,sans-serif;position:relative;z-index:1000;text-align:left}' +
    '.cbs-home-bar a{color:#eeeae0;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:color .14s,border-color .14s,background .14s}' +
    '.cbs-home-bar .brand{font:900 22px/1 "Barlow Condensed","Arial Narrow",Arial,sans-serif;text-transform:uppercase;letter-spacing:-.3px}' +
    '.cbs-home-bar .brand b{color:#00a03a;font-weight:900;transition:color .14s}' +
    '.cbs-home-bar .brand:hover{color:#fff}.cbs-home-bar .brand:hover b{color:#4ade80}' +
    '.cbs-home-bar img{width:30px;height:30px;object-fit:contain;display:block;flex:none}' +
    '.cbs-home-bar .sep{color:#555;font-weight:700;user-select:none}' +
    '.cbs-home-bar .crumb{font-size:14px;font-weight:700;color:#d6d2c6}' +
    '.cbs-home-bar .crumb:hover{color:#facc15}' +
    '.cbs-home-bar .sec{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#9a968c}' +
    '.cbs-home-bar .homebtn{margin-left:auto;font:700 13px/1 Barlow,Arial,sans-serif;color:#eeeae0;border:1.5px solid #444;border-radius:999px;padding:5px 12px;white-space:nowrap}' +
    '.cbs-home-bar .homebtn:hover{background:#005e22;border-color:#00a03a;color:#fff}' +
    '.cbs-home-float{position:fixed;left:10px;top:10px;z-index:2147483000;display:flex;align-items:center;gap:7px;background:#111;color:#eeeae0;border:2px solid #00a03a;border-radius:999px;padding:3px;box-shadow:0 3px 10px rgba(0,0,0,.35);text-decoration:none;font:700 13px/1 Barlow,Arial,sans-serif;opacity:.92;transition:opacity .15s,border-color .15s}' +
    '.cbs-home-float.bottom{top:auto;bottom:10px}' +
    '.cbs-home-float img{width:28px;height:28px;object-fit:contain;display:block}' +
    '.cbs-home-float span{display:none;padding-right:10px;white-space:nowrap}' +
    '.cbs-home-float:hover,.cbs-home-float:focus{opacity:1;border-color:#facc15}' +
    '.cbs-home-float:hover span,.cbs-home-float:focus span{display:inline}' +
    '@media(max-width:520px){.cbs-home-bar{padding:7px 12px}.cbs-home-bar .brand{font-size:19px}.cbs-home-bar img{width:26px;height:26px}.cbs-home-bar .sec{display:none}}' +
    '@media print{.cbs-home-bar,.cbs-home-float{display:none!important}}';

  function add() {
    if (document.querySelector('.cbs-sitebar')) return;
    document.head.appendChild(css);
    if (mode === 'float') {
      var a = document.createElement('a');
      a.className = 'cbs-home-float' + (d.pos === 'bottom' ? ' bottom' : '');
      a.href = '/';
      a.title = 'Cakebread Science home';
      a.setAttribute('aria-label', 'Cakebread Science home');
      a.innerHTML = '<img src="' + head + '" alt=""><span>← Home</span>';
      document.body.appendChild(a);
      return;
    }
    var n = document.createElement('nav');
    n.className = 'cbs-home-bar';
    n.setAttribute('aria-label', 'Cakebread Science');
    var mid = '';
    if (d.back) mid += '<span class="sep" aria-hidden="true">›</span><a class="crumb" href="' + esc(d.back) + '">' + esc(d.backLabel || 'Back') + '</a>';
    if (d.section) mid += '<span class="sec">' + esc(d.section) + '</span>';
    n.innerHTML = '<a class="brand" href="/" title="Cakebread Science home"><img src="' + head + '" alt="">Cakebread <b>Science</b></a>' +
      mid + '<a class="homebtn" href="/" title="Back to Cakebread Science homepage">← Home</a>';
    document.body.insertBefore(n, document.body.firstChild);
    /* pages whose body is flex/grid: pin bar to top so it never sits beside centred content */
    var bd = getComputedStyle(document.body).display;
    if (/flex|grid/.test(bd)) {
      n.style.cssText = 'position:fixed;top:0;left:0;right:0';
      var pad0 = parseFloat(getComputedStyle(document.body).paddingTop) || 0;
      var fit = function () { document.body.style.paddingTop = (pad0 + n.offsetHeight) + 'px'; };
      fit(); if (window.ResizeObserver) new ResizeObserver(fit).observe(n); else addEventListener('resize', fit);
    }
  }
  if (document.body) add(); else document.addEventListener('DOMContentLoaded', add);
})();
