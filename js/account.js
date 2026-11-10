/* Cakebread Science: the "Sign in" box at the top right of a page.
   One Google account across the site (same Firebase project as Cakebread Questing, the Spec Tracker, Long Answers and the leaderboards):
   signing in here signs you in on those pages too.
   Use: <div id="cbs-account"></div> anywhere, then load, in order: /js/firebase-config.js,
   firebase-app-compat.js and firebase-auth-compat.js (9.22.2), then this file. */
(function () {
  const box = document.getElementById('cbs-account');
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
#cbs-account .day{background:#facc15;color:#111;border:2px solid #111;padding:5px 12px;font:900 16px 'Barlow Condensed',Arial,sans-serif;text-transform:uppercase;text-decoration:none;border-radius:6px}`;
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
    if (u) {
      box.innerHTML = `${location.pathname.startsWith('/today') ? '' : '<a class="day" href="/today/">My day →</a>'}<span class="who"><small>Signed in</small>${first(u).replace(/[<>&"]/g, '')}</span><button type="button" class="out">Sign out</button>`;
      box.querySelector('.out').onclick = () => auth.signOut();
    } else {
      box.innerHTML = `<button type="button" class="in" title="Sign in with Google to save your progress across the site">${G}Sign in</button>`;
      box.querySelector('.in').onclick = () => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .catch(e => { if (e && e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') alert('Sign-in did not work: ' + (e.message || e)); });
    }
  }
  auth.onAuthStateChanged(draw);
})();
