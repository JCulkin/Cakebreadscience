/* Games need a signed-in, teacher-approved account (user, 17 Nov 2026). Put this FIRST in <head>:
     <script src="/js/game-gate.js"></script>                → restricted: sign-in + approval, play logged
     <script src="/js/game-gate.js" data-mode="log"></script> → open to everyone, plays logged when signed in
   The real check runs in a hidden frame (/play/check.html) with the site's own Firebase, so it never clashes with
   the Firebase version a game loads. Approval lives in Realtime Database gameAccess/{uid}.status; the admin console's
   Games tab approves and blocks. Not signed in / not approved → /play/?next=<this page>.
   (A static site can't truly hide its files; this stops normal use, and every play is logged.) */
(function () {
  var s = document.currentScript || {};
  var mode = (s.dataset && s.dataset.mode) === 'log' ? 'log' : 'gate';
  var KEY = 'cbs.games.ok';
  var here = location.pathname + location.search;
  var toGate = function () { location.replace('/play/?next=' + encodeURIComponent(here)); };

  if (mode === 'gate') {
    var ok = null;
    try { ok = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    if (!ok || !ok.uid) { toGate(); return; }   // never approved in this browser: go straight to the sign-in page
  }

  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin || !e.data || !e.data.cbsGate) return;
    if (mode === 'gate' && e.data.cbsGate === 'deny') toGate();
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
