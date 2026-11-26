/* A way back to the Cakebread Science homepage on every page (user, 16 Nov 2026).
   Add just before </body>:
     <script src="/js/home-link.js"></script>                       → slim bar at the top of the page
     <script src="/js/home-link.js" data-back="/worksheets/science.html" data-back-label="Science worksheets"></script>
     <script src="/js/home-link.js" data-mode="float"></script>     → small round button (full-screen games)
   Optional data-pos="bottom" puts the round button bottom-left instead of top-left.
   Never shown when printing. */
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
    '.cbs-home-bar{display:flex;align-items:center;flex-wrap:wrap;gap:4px 8px;width:fit-content;max-width:100%;box-sizing:border-box;margin:0 0 12px;padding:4px 12px 4px 5px;background:#111;color:#eeeae0;border-radius:999px;font:700 14px/1.2 "Barlow Condensed","Arial Narrow",Arial,sans-serif;position:relative;z-index:1000;text-align:left}' +
    '.cbs-home-bar a{color:#eeeae0;text-decoration:none;display:inline-flex;align-items:center;gap:6px}' +
    '.cbs-home-bar a:hover{color:#facc15}' +
    '.cbs-home-bar img{width:24px;height:24px;object-fit:contain;display:block}' +
    '.cbs-home-bar .t{text-transform:uppercase;letter-spacing:.3px;font-size:15px}' +
    '.cbs-home-bar .t b{color:#facc15}' +
    '.cbs-home-bar .sep{color:#777}' +
    '.cbs-home-float{position:fixed;left:8px;top:8px;z-index:2147483000;display:flex;align-items:center;gap:6px;background:#fff;color:#111;border:2px solid #111;border-radius:999px;padding:2px;box-shadow:0 2px 0 #000;text-decoration:none;font:700 13px/1 Arial,sans-serif;opacity:.88}' +
    '.cbs-home-float.bottom{top:auto;bottom:8px}' +
    '.cbs-home-float img{width:28px;height:28px;object-fit:contain;display:block}' +
    '.cbs-home-float span{display:none;padding-right:8px}' +
    '.cbs-home-float:hover,.cbs-home-float:focus{opacity:1}' +
    '.cbs-home-float:hover span,.cbs-home-float:focus span{display:inline}' +
    '@media(max-width:520px){.cbs-home-bar .t{font-size:13px}.cbs-home-bar{font-size:13px}}' +
    '@media print{.cbs-home-bar,.cbs-home-float{display:none!important}}';

  function add() {
    document.head.appendChild(css);
    if (mode === 'float') {
      var a = document.createElement('a');
      a.className = 'cbs-home-float' + (d.pos === 'bottom' ? ' bottom' : '');
      a.href = '/';
      a.title = 'Cakebread Science home';
      a.setAttribute('aria-label', 'Cakebread Science home');
      a.innerHTML = '<img src="' + head + '" alt=""><span>Home</span>';
      document.body.appendChild(a);
      return;
    }
    var n = document.createElement('nav');
    n.className = 'cbs-home-bar';
    n.setAttribute('aria-label', 'Cakebread Science');
    n.innerHTML = '<a href="/" title="Cakebread Science home"><img src="' + head + '" alt=""><span class="t">Cakebread <b>Science</b></span></a>' +
      (d.back ? '<span class="sep">›</span><a href="' + esc(d.back) + '">' + esc(d.backLabel || 'Back') + '</a>' : '');
    document.body.insertBefore(n, document.body.firstChild);
  }
  if (document.body) add(); else document.addEventListener('DOMContentLoaded', add);
})();
