/* Games need a signed-in, teacher-approved account (user, 17 Nov 2026). Put this FIRST in <head>:
     <script src="/js/game-gate.js"></script>                → restricted: sign-in + approval, play logged
     <script src="/js/game-gate.js" data-mode="log"></script> → open to everyone, plays logged when signed in
   The real check runs in a hidden frame (/play/check.html) with the site's own Firebase, so it never clashes with
   the Firebase version a game loads. Approval lives in Realtime Database gameAccess/{uid}.status; the admin console's
   Games tab approves and blocks.
   FAILS SAFE (17 Nov, a student played without approval): a restricted page stays hidden behind "Checking you can
   play…" until the frame says ok; a 'deny', or no answer within 10 s (e.g. the network blocks Firebase), sends the
   player to /play/?next=<this page>. (A static site can't truly hide its files; this stops normal use.) */
(function () {
  var s = document.currentScript || {};
  var mode = (s.dataset && s.dataset.mode) === 'log' ? 'log' : 'gate';
  var KEY = 'cbs.games.ok';
  var here = location.pathname + location.search;
  var done = false;
  var toGate = function (why) { if (done) return; done = true; location.replace('/play/?next=' + encodeURIComponent(here) + (why ? '&why=' + why : '')); };

  if (mode === 'gate') {
    var ok = null;
    try { ok = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    if (!ok || !ok.uid) { toGate(); return; }   // never approved in this browser: go straight to the sign-in page
    var root = document.documentElement;
    root.classList.add('cbs-gating');
    var st = document.createElement('style');
    st.textContent = 'html.cbs-gating body{visibility:hidden!important}' +
      'html.cbs-gating::before{content:"Checking you can play…";visibility:visible;position:fixed;inset:0;display:flex;align-items:center;justify-content:center;' +
      'background:#eeeae0;color:#111;font:700 20px Barlow,Arial,sans-serif;z-index:2147483647}';
    (document.head || root).appendChild(st);
    setTimeout(function () { if (!done) toGate('check'); }, 10000);
  }

  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin || !e.data || !e.data.cbsGate || mode !== 'gate' || done) return;
    if (e.data.cbsGate === 'ok') { done = true; document.documentElement.classList.remove('cbs-gating'); }
    else toGate(e.data.cbsGate === 'offline' ? 'check' : '');
  });

  function addFrame() {
    var f = document.createElement('iframe');
    f.src = '/play/check.html?mode=' + mode + '&page=' + encodeURIComponent(location.pathname) + '&title=' + encodeURIComponent(document.title || '');
    f.title = 'Game sign-in check';
    f.setAttribute('aria-hidden', 'true');
    f.tabIndex = -1;
    f.style.cssText = 'position:absolute;width:1px;height:1px;border:0;left:-9999px;top:-9999px;visibility:hidden';
    document.body.appendChild(f);
  }
  if (document.body) addFrame(); else document.addEventListener('DOMContentLoaded', addFrame);
})();
