/* Cakebread Science: the "Sign in" box at the top right of a page.
   One Google account across the site (same Firebase project as Cakebread Questing, the Spec Tracker, Long Answers and the leaderboards):
   signing in here signs you in on those pages too.
   Use: <div id="cbs-account"></div> anywhere, then load, in order: /js/firebase-config.js,
   firebase-app-compat.js and firebase-auth-compat.js (9.22.2), then this file.
   One sign-in box everywhere (user, 17 Nov 2026):
     <div id="cbs-account"></div>                 in a dark header (homepage style)
     <div id="cbs-account" class="light"></div>   in a pale header (spec trackers)
     <script src="/js/account.js" data-bar></script> with no box on the page: adds a slim black site bar at the top
       (Cakebread Science home link on the left, the box on the right) and replaces /js/home-link.js's pill.
   Shows: Sign in · or · (admins: ⚙️ Admin, 👥 Team quiz) To do → · first name · Sign out. Never the email address. */
(function () {
  if (!window.__cbsAuthGate) { const ag = document.createElement('script'); ag.src = '/js/auth-gate.js'; (document.head || document.documentElement).appendChild(ag); }
  if (!window.CBSTour && !/^\/admin(\/|$)/.test(location.pathname)) { const ts = document.createElement('script'); ts.src = '/js/tour.js'; (document.head || document.documentElement).appendChild(ts); }
  let box = document.getElementById('cbs-account');
  const me = document.currentScript;
  if (!box && me && me.hasAttribute('data-bar') && document.body) {
    window.__cbsHomeLink = true;   // the bar has the home link; stop home-link.js adding its bar/button
    document.querySelectorAll('.cbs-home-bar,.cbs-home-float').forEach(n => n.remove());
    const escA = t => String(t || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const bk = me.getAttribute('data-back'), bkl = me.getAttribute('data-back-label'), sec = me.getAttribute('data-section');
    const bar = document.createElement('div');
    bar.className = 'cbs-sitebar';
    bar.innerHTML = '<a class="h" href="/" title="Cakebread Science home"><img src="/img/mascot/head-pixel-hd.webp" alt="">Cakebread <b>Science</b></a>'
      + (bk ? `<span class="sep" aria-hidden="true">›</span><a class="crumb" href="${escA(bk)}">${escA(bkl || 'Back')}</a>` : '')
      + (sec ? `<span class="sec">${escA(sec)}</span>` : '')
      + '<div id="cbs-account"></div>';
    document.body.insertBefore(bar, document.body.firstChild);
    box = bar.querySelector('#cbs-account');
    /* pages whose body is a flex/grid layout (e.g. Flashcards, centred) would put the bar beside the content:
       pin it to the top instead and push the page down by its height */
    const bd = getComputedStyle(document.body).display;
    if (/flex|grid/.test(bd)) {
      bar.style.cssText = 'position:fixed;top:0;left:0;right:0';
      const pad0 = parseFloat(getComputedStyle(document.body).paddingTop) || 0;
      const fit = () => { document.body.style.paddingTop = (pad0 + bar.offsetHeight) + 'px'; };
      fit(); if (window.ResizeObserver) new ResizeObserver(fit).observe(bar); else addEventListener('resize', fit);
    }
  }
  if (!box) return;
  const css = document.createElement('style');
  css.textContent = `#cbs-account{display:flex;align-items:center;gap:8px;font-family:Barlow,Arial,sans-serif;font-size:15px;color:#ddd;white-space:nowrap}
#cbs-account button{font:700 15px Barlow,Arial,sans-serif;cursor:pointer;border-radius:6px}
#cbs-account .in{background:#eeeae0;color:#111;border:2px solid #eeeae0;padding:6px 14px;display:inline-flex;align-items:center;gap:8px}
#cbs-account .in:hover{background:#fff}
#cbs-account .in svg{width:16px;height:16px}
#cbs-account .who{font-weight:700;color:#eeeae0}
#cbs-account .who small{display:block;font-weight:600;font-size:11px;color:#888;letter-spacing:1px;text-transform:uppercase}
#cbs-account .out{background:none;color:#aaa;border:1px solid #555;padding:3px 9px;font-size:13px}
#cbs-account .out:hover{color:#fff;border-color:#aaa}
#cbs-account .adm{background:#dc2626;color:#fff;border:2px solid #111;padding:5px 12px;font:900 16px 'Barlow Condensed',Arial,sans-serif;text-transform:uppercase;text-decoration:none;border-radius:6px}
#cbs-account .adm:hover{background:#b91c1c}
#cbs-account .tq{background:#2563eb;color:#fff;border:2px solid #111;padding:5px 12px;font:900 16px 'Barlow Condensed',Arial,sans-serif;text-transform:uppercase;text-decoration:none;border-radius:6px}
#cbs-account .tq:hover{background:#1d4ed8}
#cbs-account{flex-wrap:wrap;justify-content:flex-end}
#cbs-account.light{color:#333}#cbs-account.light .who{color:#111}#cbs-account.light .who small{color:#777}
#cbs-account.light .in{background:#111;color:#fff;border-color:#111}#cbs-account.light .in:hover{background:#333}
#cbs-account.light .out{color:#555;border-color:#999}#cbs-account.light .out:hover{color:#111;border-color:#111}
.cbs-sitebar{display:flex;align-items:center;gap:8px 12px;flex-wrap:wrap;background:#111;border-bottom:3px solid #00a03a;padding:8px 18px;min-height:50px;position:relative;z-index:1000;font-family:Barlow,Arial,sans-serif;text-align:left;box-sizing:border-box}
.cbs-sitebar .h{display:inline-flex;align-items:center;gap:8px;text-decoration:none;color:#eeeae0;font:900 22px/1 'Barlow Condensed','Arial Narrow',Arial,sans-serif;text-transform:uppercase;letter-spacing:-.3px;transition:color .14s}
.cbs-sitebar .h b{color:#00a03a;font-weight:900;transition:color .14s}
.cbs-sitebar .h:hover{color:#fff}.cbs-sitebar .h:hover b{color:#4ade80}
.cbs-sitebar .h img{width:30px;height:30px;object-fit:contain;display:block;flex:none}
.cbs-sitebar .sep{color:#555;font-weight:700;user-select:none}
.cbs-sitebar .crumb{font-size:14px;font-weight:700;color:#d6d2c6;text-decoration:none}
.cbs-sitebar .crumb:hover{color:#facc15}
.cbs-sitebar .sec{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#9a968c}
.cbs-sitebar #cbs-account{margin-left:auto}
@media(max-width:520px){.cbs-sitebar{padding:7px 12px}.cbs-sitebar .h{font-size:19px}.cbs-sitebar .h img{width:26px;height:26px}.cbs-sitebar .sec{display:none}}
@media print{.cbs-sitebar,#cbs-account{display:none!important}}
#cbs-account .day{background:#facc15;color:#111;border:2px solid #111;padding:5px 12px;font:900 16px 'Barlow Condensed',Arial,sans-serif;text-transform:uppercase;text-decoration:none;border-radius:6px}
#cbs-account .hlp{background:none;color:#d6d2c6;border:1px solid #555;padding:3px 9px;font:700 13px Barlow,Arial,sans-serif;text-decoration:none;border-radius:6px}
#cbs-account .hlp:hover{color:#fff;border-color:#facc15}
#cbs-account .sim{background:#4c1d95;color:#fff;border:2px solid #facc15;padding:4px 10px;font:800 13px Barlow,Arial,sans-serif;border-radius:6px}
#cbs-account .sim:hover{background:#5b21b6}
#cbs-account.light .hlp{color:#444;border-color:#999}#cbs-account.light .hlp:hover{color:#111;border-color:#111}
#cbs-account .day.due{background:#dc2626;color:#fff;display:inline-flex;align-items:center;gap:6px}
#cbs-account .day .bang{background:#fff;color:#dc2626;border-radius:50%;width:18px;height:18px;display:inline-grid;place-items:center;font-size:14px;line-height:1;animation:cbsbang 1.2s ease-in-out infinite alternate}
@keyframes cbsbang{to{transform:scale(1.18)}}@media(prefers-reduced-motion:reduce){#cbs-account .day .bang{animation:none}}`;
  document.head.appendChild(css);
  const G = '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
  let auth = null;
  try {
    if (!window.firebase || !window.firebaseConfig) throw new Error('no firebase');
    if (!firebase.apps.length) firebase.initializeApp(window.firebaseConfig);
    auth = firebase.auth();
  } catch (e) { box.innerHTML = ''; return; }
  const first = u => ((u.displayName || u.email || 'Student').trim().split(/\s+/)[0]);
  function draw(u) {
    const hlp = location.pathname.startsWith('/how-to-use') ? '' : '<a class="hlp" href="/how-to-use/" title="How to use Cakebread Science &amp; replay page tours">❓ Guide</a>';
    const isStaging = !/^(www\.)?cakebreadscience\.com$/i.test(location.hostname) && !/^\/admin(\/|$)/.test(location.pathname || '');
    const simActive = isStaging && (() => { try { return localStorage.getItem('cbs.sim.y10') === '1'; } catch (e) { return false; } })();
    const simBtn = isStaging && !simActive ? '<button type="button" class="sim" title="Staging only: simulate signing in as a Year 10 student with homework, tests and progress">🧑‍🎓 Sim Y10</button>' : '';
    const wireSim = () => {
      const sb = box.querySelector('.sim');
      if (!sb) return;
      sb.onclick = () => {
        const go = () => { if (window.CBSSim) CBSSim.start(true); };
        if (window.CBSSim) return go();
        const sc = document.createElement('script'); sc.src = '/js/staging-sim.js'; sc.onload = go; document.head.appendChild(sc);
      };
    };
    if (u) {
      const admin = (window.ADMIN_EMAILS || ['culkincakebread@gmail.com', 'stem@elevenschool.com']).includes(u.email);
      box.innerHTML = `${simBtn}${admin ? '<a class="adm" href="/admin/" title="Admin console">⚙️ Admin</a><a class="tq" href="/interactive/spec-quiz/quiz.html?team" title="Team quiz for the board">👥 Team quiz</a>' : ''}${location.pathname.startsWith('/today') ? '' : '<a class="day" href="/today/">To do →</a>'}${hlp}<span class="who"><small>Signed in</small>${first(u).replace(/[<>&"]/g, '')}</span><button type="button" class="out">Sign out</button>`;
      box.querySelector('.out').onclick = () => auth.signOut();
      wireSim();
      badge();
    } else {
      box.innerHTML = `${simBtn}${hlp}<button type="button" class="in" title="Sign in with Google to save your progress across the site">${G}Sign in</button>`;
      box.querySelector('.in').onclick = () => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .catch(e => { if (e && e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') alert('Sign-in did not work: ' + (e.message || e)); });
      wireSim();
    }
  }
  /* open set work → the To do button turns red with a "!" (18 Nov, /js/openwork.js) */
  function badge() {
    const day = box.querySelector('.day'); if (!day) return;
    const go = () => CBSWork.onChange(w => { const d = box.querySelector('.day'); if (!d) return;
      if (w.n > 0) { d.classList.add('due'); d.innerHTML = `<span class="bang">!</span>To do · ${w.n}`; d.title = `${w.n} piece${w.n > 1 ? 's' : ''} of set work to do${w.late ? ` (${w.late} overdue)` : ''}`; }
      else { d.classList.remove('due'); d.textContent = 'To do →'; d.title = ''; } });
    if (window.CBSWork) return go();
    const s = document.createElement('script'); s.src = '/js/openwork.js'; s.onload = go; document.head.appendChild(s);
  }
  auth.onAuthStateChanged(draw);
})();
