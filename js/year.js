/* Year group (user, 17 Nov 2026): every account picks Year 8, 9, 10 or 11 ONCE; after that only the admin console can change it
   (the Firestore rules refuse a student changing users/{uid}.year once set).
   Saved on Firestore users/{uid} as {year: 8|9|10|11, yearAt: ms, yearBy: 'self'|'admin'}.
   Load after firebase-config + firebase app/auth compat (Firestore compat is loaded here if the page lacks it):
     <script src="/js/year.js"></script>
   Signed in with no year → a "Which year are you in?" box (admins are never asked).
   API: CBSYear.year (number or null), CBSYear.ask() opens the box (only while no year is set), CBSYear.onChange(fn). Event 'cbs-year' on window. */
(function () {
  if (window.CBSYear) return;
  const subs = [];
  const Y = window.CBSYear = { year: null, uid: null, ask, onChange: f => { subs.push(f); if (Y.uid) f(Y.year); } };
  const emit = () => { Y.known = !!Y.uid;   // known = this account's year has been read (or the read failed)
    subs.forEach(f => { try { f(Y.year); } catch (e) {} }); window.dispatchEvent(new CustomEvent('cbs-year', { detail: Y.year })); };
  const isAdmin = u => (window.ADMIN_EMAILS || ['culkincakebread@gmail.com', 'stem@elevenschool.com']).includes(u.email);

  const css = document.createElement('style');
  css.textContent = `.cbs-year-bg{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:2147483100;display:grid;place-items:center;padding:16px}
.cbs-year{background:#fff;color:#111;border:3px solid #111;box-shadow:0 5px 0 #111;max-width:420px;width:100%;padding:22px;text-align:center;font-family:Barlow,Arial,sans-serif}
.cbs-year h2{font:900 30px/1 'Barlow Condensed','Arial Narrow',Arial,sans-serif;text-transform:uppercase;margin:6px 0 8px}
.cbs-year p{color:#444;margin:0 0 14px;font-size:16px}
.cbs-year img{width:72px;height:72px;object-fit:contain}
.cbs-year .ys{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.cbs-year .ys button{font:900 22px 'Barlow Condensed','Arial Narrow',Arial,sans-serif;text-transform:uppercase;padding:12px;border:2px solid #111;background:#eeeae0;cursor:pointer}
.cbs-year .ys button:hover,.cbs-year .ys button.on{background:#facc15}
.cbs-year .x{margin-top:12px;background:none;border:0;color:#666;text-decoration:underline;cursor:pointer;font:inherit}
.cbs-year .err{color:#b91c1c;font-size:14px;margin-top:8px}`;

  let fs = null;
  function needFirestore(cb) {
    if (firebase.firestore) return cb();
    const s = document.createElement('script');
    s.src = 'https://www.gstatic.com/firebasejs/' + (firebase.SDK_VERSION || '9.22.2') + '/firebase-firestore-compat.js';
    s.onload = cb; document.head.appendChild(s);
  }
  function ask() {
    if (!Y.uid || Y.year || document.querySelector('.cbs-year-bg')) return;
    if (!css.isConnected) document.head.appendChild(css);
    const bg = document.createElement('div');
    bg.className = 'cbs-year-bg';
    bg.innerHTML = `<div class="cbs-year" role="dialog" aria-modal="true" aria-labelledby="cbsYh"><img src="/img/mascot/head-think.webp" alt="">
      <h2 id="cbsYh">Which year are you in?</h2><p>So you see the work set for your year and what's been covered in class. Choose carefully: only your teacher can change it afterwards.</p>
      <div class="ys">${[8, 9, 10, 11].map(n => `<button type="button" data-y="${n}"${Y.year === n ? ' class="on"' : ''}>Year ${n}</button>`).join('')}</div>
      <div class="err" hidden></div></div>`;
    document.body.appendChild(bg);
    const close = () => bg.remove();
    bg.querySelectorAll('[data-y]').forEach(b => b.onclick = () => {
      const y = +b.dataset.y;
      fs.collection('users').doc(Y.uid).set({ year: y, yearAt: Date.now(), yearBy: 'self' }, { merge: true })
        .then(() => { Y.year = y; close(); emit(); })
        .catch(e => { const er = bg.querySelector('.err'); er.hidden = false; er.textContent = 'Could not save: ' + (e.code || e.message); });
    });
  }
  function start() {
    if (!window.firebase || !window.firebaseConfig) return;
    try { if (!firebase.apps.length) firebase.initializeApp(window.firebaseConfig); } catch (e) { return; }
    needFirestore(() => {
      fs = firebase.firestore();
      firebase.auth().onAuthStateChanged(u => {
        Y.uid = u ? u.uid : null; Y.year = null; Y.known = false;
        if (!u) { emit(); return; }
        fs.collection('users').doc(u.uid).get().then(d => {
          const y = d.exists ? (d.data() || {}).year : null;
          Y.year = [8, 9, 10, 11].includes(y) ? y : null; emit();
          if (!Y.year && !isAdmin(u)) ask();
        }).catch(() => emit());
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
