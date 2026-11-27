/* Cakebread Science — Site-wide sign-in & admin approval gate (26 Nov 2026)
   Unauthenticated / unapproved visitors can only access:
     - Always-open menus & utility pages (Home, Leaderboards, Play, Admin, Comparers, index menus)
     - The FIRST presentation (lesson) of each subject: Biology 1, Chemistry 1a, Physics 8
     - The FIRST worksheet of each subject (with mark scheme):
         Biology KS4/KS3 1_living_organisms · Chemistry KS4/KS3 1a_states_of_matter
         Physics KS4 3b2_wave_speed (+ _sa) · Physics KS3 8bc_space_stars · Maths 1.1_integers_negative_numbers
     - 1 free sample mission (or 1 free Practice set) in Cakebread Questing, then sign-in required.
   Anyone can create/request an account by signing in with Google.
   Approval lives in RTDB gameAccess/{uid}.status ('pending'|'approved'|'blocked'), managed in /admin/.
   Existing students (Firestore users/{uid} with real prior activity) are grandfathered unless explicitly 'blocked'. */
(function () {
  if (window.__cbsAuthGate) return;
  window.__cbsAuthGate = true;

  var MISSION_KEY = 'cbs.free.missions';
  var SESSION_KEY = 'cbs.auth.ok';
  var PREVIEW_KEY = 'cbs.auth.previewBypass';
  var FREE_MISSION_LIMIT = 1;
  var CACHE_MS = 30 * 60 * 1000;
  var DEFAULT_ADMINS = ['culkincakebread@gmail.com', 'stem@elevenschool.com'];

  var isPreviewHost = function () {
    var h = (location.hostname || '').toLowerCase();
    if (/^(www\.)?cakebreadscience\.com$/.test(h)) return false;
    return !/[?&]testgate=1(?:&|$)/.test(location.search || '');
  };
  var isFramed = function () {
    try { return window.self !== window.top; } catch (e) { return true; }
  };

  function normPath(p) {
    var s = String(p || '/').split('#')[0].split('?')[0].replace(/\/+/g, '/');
    if (!s.startsWith('/')) s = '/' + s;
    s = s.replace(/\/index\.html$/i, '/');
    return s;
  }

  /* Free taster patterns */
  var OPEN_EXACT = new Set([
    '/', '/404.html', '/test.html', '/recipes.html',
    '/interactive/lessons/',
    '/worksheets/', '/worksheets/science.html', '/worksheets/maths.html',
    '/worksheets/cross-curricular.html', '/worksheets/archive.html',
    '/booklets/',
    '/specifications/', '/specifications/science.html', '/specifications/maths.html',
    '/interactive/spec-quiz/', '/interactive/spec-quiz/adventurer-home.html'
  ]);
  var OPEN_PREFIX = [
    '/admin/', '/play/', '/leaderboards/', '/mascot/',
    '/staging-review/', '/worksheets/diff/', '/interactive/lessons/diff/'
  ];
  var FREE_LESSON_RE = /^\/interactive\/lessons\/(biology\/1|chemistry\/1a|physics\/8)(\/|$)/i;
  var FREE_WORKSHEET_RE = /^\/worksheets\/(biology\/ks[34]\/1_living_organisms|chemistry\/ks[34]\/1a_states_of_matter|physics\/ks4\/3b2_wave_speed(?:_sa)?|physics\/ks3\/8bc_space_stars|maths\/1\.1_integers_negative_numbers)(?:_ms)?\.html$/i;
  var MISSION_RE = /^\/interactive\/spec-quiz\/(adventurer-mission|practice)\.html$/i;

  function accessFor(pathname) {
    var p = normPath(pathname);
    var pl = p.toLowerCase();
    if (OPEN_EXACT.has(pl)) return 'open';
    for (var i = 0; i < OPEN_PREFIX.length; i++) {
      if (pl.startsWith(OPEN_PREFIX[i])) return 'open';
    }
    if (FREE_LESSON_RE.test(pl)) return 'free-lesson';
    if (FREE_WORKSHEET_RE.test(pl)) return 'free-worksheet';
    if (MISSION_RE.test(pl)) return 'mission';
    return 'require';
  }

  function isFreeHref(href) {
    try {
      var u = new URL(href, location.href);
      if (u.origin !== location.origin) return true;
      var m = accessFor(u.pathname);
      return m === 'open' || m === 'free-lesson' || m === 'free-worksheet';
    } catch (e) { return false; }
  }

  function freeMissionsUsed() {
    try { return Math.max(0, parseInt(localStorage.getItem(MISSION_KEY) || '0', 10) || 0); }
    catch (e) { return 0; }
  }
  function recordFreeMission() {
    if (state.status === 'approved') return freeMissionsUsed();
    var n = freeMissionsUsed() + 1;
    try { localStorage.setItem(MISSION_KEY, String(n)); } catch (e) {}
    return n;
  }

  function readCache() {
    try {
      var v = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (v && v.uid && v.ok && Date.now() - (v.t || 0) < CACHE_MS) return v;
    } catch (e) {}
    return null;
  }
  function writeCache(uid) {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ uid: uid, ok: true, t: Date.now() })); } catch (e) {}
  }
  function clearCache() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
  }
  function hasPreviewBypass() {
    return isPreviewHost();
  }

  var state = { status: 'checking', user: null, reason: '', mode: accessFor(location.pathname) };
  var listeners = [];
  function emit() {
    window.__cbsAuthApproved = (state.status === 'approved');
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](state); } catch (e) {}
    }
  }
  function onStatus(fn) {
    listeners.push(fn);
    try { fn(state); } catch (e) {}
  }

  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };

  /* ---------- Gate overlay UI ---------- */
  var styleInjected = false;
  function ensureStyle() {
    if (styleInjected) return;
    styleInjected = true;
    var st = document.createElement('style');
    st.id = 'cbs-auth-style';
    st.textContent =
      'html.cbs-auth-locked{overflow:hidden!important}' +
      '#cbs-auth-gate{position:fixed;inset:0;z-index:2147483640;background:rgba(238,234,224,.97);color:#111;display:flex;align-items:center;justify-content:center;padding:20px;font-family:Barlow,Arial,sans-serif;overflow:auto;text-align:center}' +
      '#cbs-auth-gate .card{background:#fff;border:3px solid #111;box-shadow:0 6px 0 #111;max-width:480px;width:100%;padding:26px 24px;text-align:center}' +
      '#cbs-auth-gate img.prof{width:92px;height:92px;object-fit:contain;display:block;margin:0 auto 8px}' +
      '#cbs-auth-gate h1{font-family:"Barlow Condensed","Arial Narrow",Arial,sans-serif;font-weight:900;text-transform:uppercase;font-size:clamp(28px,6vw,38px);line-height:1.05;margin:4px 0 10px;color:#111}' +
      '#cbs-auth-gate p{font-size:16px;line-height:1.45;color:#333;margin:0 auto 12px;max-width:42ch}' +
      '#cbs-auth-gate .small{font-size:13.5px;color:#666}' +
      '#cbs-auth-gate .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:#111;color:#eeeae0;border:2px solid #111;font:900 18px "Barlow Condensed","Arial Narrow",Arial,sans-serif;text-transform:uppercase;letter-spacing:.4px;padding:10px 18px;text-decoration:none;margin:4px;cursor:pointer;border-radius:4px}' +
      '#cbs-auth-gate .btn:hover{background:#005e22;border-color:#005e22;color:#fff}' +
      '#cbs-auth-gate .btn.alt{background:#fff;color:#111}' +
      '#cbs-auth-gate .btn.alt:hover{background:#f3f0e7;color:#111;border-color:#111}' +
      '#cbs-auth-gate .btn svg{width:18px;height:18px;flex:none}' +
      '#cbs-auth-gate .tasters{margin-top:14px;padding-top:12px;border-top:2px solid #eeeae0;text-align:left}' +
      '#cbs-auth-gate .tasters h2{font:900 14px "Barlow Condensed","Arial Narrow",Arial,sans-serif;text-transform:uppercase;letter-spacing:.7px;color:#555;margin:0 0 8px;text-align:center}' +
      '#cbs-auth-gate .tgrid{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}' +
      '#cbs-auth-gate .tgrid a{font:700 13px Barlow,Arial,sans-serif;color:#111;background:#f7f4ec;border:1.5px solid #111;padding:4px 9px;text-decoration:none;border-radius:4px}' +
      '#cbs-auth-gate .tgrid a:hover{background:#facc15}' +
      '#cbs-auth-gate .wait{display:inline-block;width:11px;height:11px;border-radius:50%;background:#facc15;border:1.5px solid #111;margin-right:7px;vertical-align:middle;animation:cbsWait 1.3s infinite}' +
      '@keyframes cbsWait{50%{opacity:.25}}' +
      '#cbs-auth-gate .who{font-size:13.5px;color:#666;margin-top:12px}' +
      '#cbs-auth-gate .who button,#cbs-auth-gate .pvbtn{background:none;border:0;color:#005e22;text-decoration:underline;font:inherit;cursor:pointer;padding:2px 4px}' +
      '#cbs-auth-gate .pvnote{margin-top:12px;font-size:12.5px;color:#777}' +
      '@media print{html.cbs-auth-locked body>*:not(#cbs-auth-gate){display:none!important}}';
    (document.head || document.documentElement).appendChild(st);
  }

  var G_ICON = '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';

  var TASTERS_HTML =
    '<div class="tasters"><h2>Free sample pages (no login needed)</h2><div class="tgrid">' +
    '<a href="/interactive/lessons/biology/1/v2026-11-26/">🧬 Bio lesson 1</a>' +
    '<a href="/interactive/lessons/chemistry/1a/draft/">🧪 Chem lesson 1a</a>' +
    '<a href="/interactive/lessons/physics/8/draft/">⚡ Phys lesson 8</a>' +
    '<a href="/worksheets/biology/ks4/1_living_organisms.html">📄 Bio sheet 1</a>' +
    '<a href="/worksheets/chemistry/ks4/1a_states_of_matter.html">📄 Chem sheet 1a</a>' +
    '<a href="/worksheets/physics/ks4/3b2_wave_speed.html">📄 Phys sheet 1</a>' +
    '<a href="/worksheets/maths/1.1_integers_negative_numbers.html">📄 Maths sheet 1</a>' +
    '</div></div>';

  function faceImg(name) {
    return '<img class="prof" src="/img/mascot/head-' + name + '.webp" alt="">';
  }
  function previewLine() {
    if (!isPreviewHost()) return '';
    return '<div class="pvnote">Staging preview deploy · <button type="button" class="pvbtn" id="cbsAuthPv">Continue without sign-in</button></div>';
  }
  function whoLine(u) {
    if (!u) return '';
    var nm = ((u.displayName || '').trim().split(/\s+/)[0]) || 'Student';
    return '<div class="who">Signed in as <b>' + esc(nm) + '</b> · <button type="button" id="cbsAuthOut">Use another account</button></div>';
  }

  var overlay = null;
  function showOverlay(html) {
    ensureStyle();
    document.documentElement.classList.add('cbs-auth-locked');
    var mount = function () {
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'cbs-auth-gate';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        document.body.appendChild(overlay);
      }
      overlay.innerHTML = '<div class="card">' + html + '</div>';
      var si = overlay.querySelector('#cbsAuthIn');
      if (si) si.onclick = doSignIn;
      var so = overlay.querySelector('#cbsAuthOut');
      if (so) so.onclick = function () {
        clearCache();
        if (window.firebase && firebase.auth) firebase.auth().signOut();
      };
      var pv = overlay.querySelector('#cbsAuthPv');
      if (pv) pv.onclick = function () {
        try { sessionStorage.setItem(PREVIEW_KEY, '1'); } catch (e) {}
        hideOverlay();
        state.status = 'approved'; state.reason = 'preview'; emit();
      };
      var retry = overlay.querySelector('#cbsAuthRetry');
      if (retry) retry.onclick = function () { location.reload(); };
    };
    if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount, { once: true });
  }
  function hideOverlay() {
    document.documentElement.classList.remove('cbs-auth-locked');
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    overlay = null;
  }

  function renderSignIn(kind) {
    var isMission = kind === 'mission';
    var h = isMission ? 'Free sample mission complete!' : 'Sign in to continue';
    var p = isMission
      ? 'You have completed your free sample mission. Sign in with your Google account to unlock unlimited missions, XP, flashcards, lessons and worksheets.'
      : 'Cakebread Science is for students with an approved account. Sign in with Google to get full access — new accounts are approved by your teacher.';
    var missionLink = !isMission && freeMissionsUsed() < FREE_MISSION_LIMIT
      ? '<a class="btn alt" href="/interactive/spec-quiz/adventurer-mission.html">⚔ Try 1 free mission</a>' : '';
    showOverlay(
      faceImg('happy') +
      '<h1>' + h + '</h1>' +
      '<p>' + p + '</p>' +
      '<div><button type="button" class="btn" id="cbsAuthIn">' + G_ICON + 'Sign in with Google</button></div>' +
      '<div style="margin-top:4px">' + missionLink + '<a class="btn alt" href="/">← Home</a></div>' +
      TASTERS_HTML +
      previewLine()
    );
  }
  function renderPending(u) {
    showOverlay(
      faceImg('think') +
      '<h1>Waiting for approval</h1>' +
      '<p><span class="wait"></span>Your account request has been sent to your teacher. This page will unlock automatically as soon as they approve it in Admin.</p>' +
      '<p class="small">While you wait, you can still view the free sample lesson and worksheet for each subject.</p>' +
      '<div><a class="btn alt" href="/">← Home</a></div>' +
      TASTERS_HTML +
      whoLine(u) +
      previewLine()
    );
  }
  function renderBlocked(u) {
    showOverlay(
      faceImg('worried') +
      '<h1>Account paused</h1>' +
      '<p>Your account does not currently have access to this page. Ask your teacher if you think this is a mistake.</p>' +
      '<div><a class="btn alt" href="/">← Home</a></div>' +
      whoLine(u) +
      previewLine()
    );
  }
  function renderOffline(u) {
    showOverlay(
      faceImg('worried') +
      '<h1>Could not check your account</h1>' +
      '<p>This page needs to check your sign-in, and this network did not respond in time. Try again in a moment.</p>' +
      '<div><button type="button" class="btn" id="cbsAuthRetry">Try again</button><a class="btn alt" href="/">← Home</a></div>' +
      TASTERS_HTML +
      whoLine(u) +
      previewLine()
    );
  }

  function doSignIn() {
    ensureFirebase().then(function (ok) {
      if (!ok || !window.firebase || !firebase.auth) {
        alert('Google sign-in could not load on this network.');
        return;
      }
      firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(function (e) {
        if (e && e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') {
          alert('Sign-in did not work: ' + (e.message || e));
        }
      });
    });
  }

  /* ---------- Lazy-load Firebase compat scripts only if missing ---------- */
  var loadPromise = null;
  function loadScript(src) {
    return new Promise(function (resolve) {
      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        if (existing.dataset.cbsLoaded === '1') return resolve(true);
        existing.addEventListener('load', function () { resolve(true); }, { once: true });
        existing.addEventListener('error', function () { resolve(false); }, { once: true });
        setTimeout(function () { resolve(true); }, 3500);
        return;
      }
      var s = document.createElement('script');
      s.src = src;
      s.onload = function () { s.dataset.cbsLoaded = '1'; resolve(true); };
      s.onerror = function () { resolve(false); };
      (document.head || document.documentElement).appendChild(s);
    });
  }
  function ensureFirebase() {
    if (loadPromise) return loadPromise;
    var FB_BASE = 'https://www.gstatic.com/firebasejs/9.22.2/';
    loadPromise = Promise.resolve()
      .then(function () { return window.firebaseConfig ? true : loadScript('/js/firebase-config.js'); })
      .then(function () { return window.ADMIN_EMAILS ? true : loadScript('/js/admin-config.js'); })
      .then(function () { return window.firebase ? true : loadScript(FB_BASE + 'firebase-app-compat.js'); })
      .then(function () {
        if (!window.firebase) return false;
        var need = [];
        if (!firebase.auth) need.push(loadScript(FB_BASE + 'firebase-auth-compat.js'));
        if (!firebase.database) need.push(loadScript(FB_BASE + 'firebase-database-compat.js'));
        if (!firebase.firestore) need.push(loadScript(FB_BASE + 'firebase-firestore-compat.js'));
        return Promise.all(need).then(function () {
          try {
            if (!firebase.apps.length && window.firebaseConfig) firebase.initializeApp(window.firebaseConfig);
            return !!(firebase.apps.length && firebase.auth);
          } catch (e) { return false; }
        });
      });
    return loadPromise;
  }

  function hasExistingActivity(doc) {
    if (!doc || !doc.exists) return false;
    var d = doc.data() || {};
    if ([8, 9, 10, 11].indexOf(d.year) >= 0) return true;
    if (d.specQuiz && (d.specQuiz.xp || d.specQuiz.missions || (d.specQuiz.q && Object.keys(d.specQuiz.q).length))) return true;
    if (d.progress && Object.keys(d.progress).length) return true;
    if (d.specSubjects && Object.keys(d.specSubjects).length) return true;
    if (d.longAnswers && Object.keys(d.longAnswers).length) return true;
    if (d.questing && (d.questing.coins || (d.questing.bag && d.questing.bag.length))) return true;
    return false;
  }

  function shouldEnforceNow() {
    if (isFramed() || hasPreviewBypass()) return false;
    var m = state.mode;
    if (m === 'require') return true;
    if (m === 'mission') return freeMissionsUsed() >= FREE_MISSION_LIMIT;
    return false;
  }

  function checkMissionGate() {
    if (state.status === 'approved' || hasPreviewBypass() || isFramed()) return true;
    if (freeMissionsUsed() < FREE_MISSION_LIMIT) return true;
    renderSignIn('mission');
    return false;
  }

  /* ---------- Start auth & approval check ---------- */
  var enforce = shouldEnforceNow();
  if (enforce && !readCache()) {
    showOverlay(faceImg('think') + '<h1>Cakebread Science</h1><p>Checking your account…</p>' + previewLine());
  }

  var rtUnsub = null;
  function runCheck() {
    if (isFramed()) {
      state.status = 'open'; state.reason = 'framed'; emit(); return;
    }
    if (hasPreviewBypass()) {
      hideOverlay(); state.status = 'approved'; state.reason = 'preview'; emit(); return;
    }
    var authHeard = false;
    var failTimer = enforce ? setTimeout(function () {
      if (!authHeard && state.status !== 'approved') {
        state.status = 'offline'; state.reason = 'timeout'; emit();
        if (shouldEnforceNow()) renderOffline(state.user);
      }
    }, 6500) : null;

    ensureFirebase().then(function (ok) {
      if (!ok) {
        if (failTimer) clearTimeout(failTimer);
        state.status = 'offline'; state.reason = 'no-firebase'; emit();
        if (shouldEnforceNow()) renderOffline(null);
        return;
      }
      var auth = firebase.auth();
      auth.onAuthStateChanged(function (u) {
        authHeard = true;
        if (failTimer) { clearTimeout(failTimer); failTimer = null; }
        if (rtUnsub) { try { rtUnsub(); } catch (e) {} rtUnsub = null; }
        state.user = u || null;

        if (!u) {
          clearCache();
          state.status = 'signed-out'; state.reason = 'no-user'; emit();
          if (shouldEnforceNow()) renderSignIn(state.mode);
          else hideOverlay();
          return;
        }

        var admins = window.ADMIN_EMAILS || DEFAULT_ADMINS;
        if (admins.indexOf(u.email) >= 0) {
          writeCache(u.uid);
          state.status = 'approved'; state.reason = 'admin'; emit();
          hideOverlay();
          return;
        }

        // Check RTDB gameAccess/{uid} live so teacher approval unlocks immediately
        if (!firebase.database) {
          state.status = 'offline'; state.reason = 'no-rtdb'; emit();
          if (shouldEnforceNow()) renderOffline(u);
          return;
        }
        var ref = firebase.database().ref('gameAccess/' + u.uid);
        var rtHeard = false;
        var rtTimer = enforce ? setTimeout(function () {
          if (!rtHeard && state.status !== 'approved') {
            state.status = 'offline'; state.reason = 'rtdb-timeout'; emit();
            if (shouldEnforceNow()) renderOffline(u);
          }
        }, 6500) : null;

        var checkedGrandfather = false;
        var onVal = function (snap) {
          rtHeard = true;
          if (rtTimer) { clearTimeout(rtTimer); rtTimer = null; }
          var v = snap.val();
          if (v && v.status === 'approved') {
            writeCache(u.uid);
            state.status = 'approved'; state.reason = 'approved'; emit();
            hideOverlay();
            return;
          }
          if (v && v.status === 'blocked') {
            clearCache();
            state.status = 'blocked'; state.reason = 'blocked'; emit();
            if (shouldEnforceNow()) renderBlocked(u);
            else hideOverlay();
            return;
          }
          if (v && v.status === 'pending') {
            clearCache();
            state.status = 'pending'; state.reason = 'pending'; emit();
            if (shouldEnforceNow()) renderPending(u);
            else hideOverlay();
            return;
          }
          // No gameAccess record yet: check if existing student in Firestore before creating pending request
          if (checkedGrandfather) return;
          checkedGrandfather = true;
          var fsCheck = (firebase.firestore)
            ? firebase.firestore().collection('users').doc(u.uid).get().catch(function () { return null; })
            : Promise.resolve(null);
          fsCheck.then(function (doc) {
            if (hasExistingActivity(doc)) {
              writeCache(u.uid);
              state.status = 'approved'; state.reason = 'existing-student'; emit();
              hideOverlay();
              return;
            }
            // Brand-new account: create pending request if on a gated page (or always on sign-in so admin sees them)
            clearCache();
            state.status = 'pending'; state.reason = 'pending'; emit();
            if (shouldEnforceNow()) renderPending(u);
            ref.set({
              status: 'pending',
              name: u.displayName || '',
              email: u.email || '',
              t: firebase.database.ServerValue.TIMESTAMP
            }).catch(function () {});
          });
        };
        var onErr = function () {
          rtHeard = true;
          if (rtTimer) { clearTimeout(rtTimer); rtTimer = null; }
          state.status = 'offline'; state.reason = 'rtdb-error'; emit();
          if (shouldEnforceNow()) renderOffline(u);
        };
        ref.on('value', onVal, onErr);
        rtUnsub = function () { ref.off('value', onVal); };
      });
    });
  }

  runCheck();

  window.CBSAuth = {
    accessFor: accessFor,
    isFreeHref: isFreeHref,
    freeMissionsUsed: freeMissionsUsed,
    recordFreeMission: recordFreeMission,
    checkMissionGate: checkMissionGate,
    showGate: function (kind) { renderSignIn(kind || 'require'); },
    FREE_MISSION_LIMIT: FREE_MISSION_LIMIT,
    onStatus: onStatus,
    get state() { return state; }
  };
})();
