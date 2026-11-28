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
.cbs-year .mhead{font-size:13.5px;font-weight:700;color:#333;margin:14px 0 6px;text-align:left}
.cbs-year .ms{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px}
.cbs-year .ms button{padding:8px 9px;border:2px solid #111;background:#f6f4ee;cursor:pointer;text-align:left;font-family:Barlow,Arial,sans-serif;line-height:1.25}
.cbs-year .ms button b{display:block;font:900 15.5px/1.1 'Barlow Condensed','Arial Narrow',Arial,sans-serif;text-transform:uppercase;color:#111}
.cbs-year .ms button span{display:block;font-size:12px;color:#555;margin-top:2px}
.cbs-year .ms button.on{background:#facc15;box-shadow:0 2px 0 #111}
.cbs-year .x{margin-top:12px;background:none;border:0;color:#666;text-decoration:underline;cursor:pointer;font:inherit}
.cbs-year .err{color:#b91c1c;font-size:14px;margin-top:8px}`;

  const CACHE_KEY = 'cbs.year.cache';
  const readYearCache = uid => { try { const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); return c && c.u === uid && [8, 9, 10, 11].includes(c.y) ? c.y : null; } catch (e) { return null; } };
  const writeYearCache = (uid, y) => { try { if (uid && [8, 9, 10, 11].includes(y)) localStorage.setItem(CACHE_KEY, JSON.stringify({ u: uid, y })); } catch (e) {} };
  let fs = null;
  function needFirestore(cb) {
    if (firebase.firestore) return cb();
    const s = document.createElement('script');
    s.src = 'https://www.gstatic.com/firebasejs/' + (firebase.SDK_VERSION || '9.22.2') + '/firebase-firestore-compat.js';
    s.onload = cb; s.onerror = cb; document.head.appendChild(s);
  }
  function ask() {
    if (!Y.uid || Y.year || document.querySelector('.cbs-year-bg')) return;
    if (!css.isConnected) document.head.appendChild(css);
    let plainMode = !!(window.CBSMode && CBSMode.isPlain());
    const bg = document.createElement('div');
    bg.className = 'cbs-year-bg';
    bg.innerHTML = `<div class="cbs-year" role="dialog" aria-modal="true" aria-labelledby="cbsYh"><img src="/img/mascot/head-think.webp" alt="">
      <h2 id="cbsYh">Which year are you in?</h2><p>So you see the work set for your year and what's been covered in class. Choose carefully: only your teacher can change it afterwards.</p>
      <div class="mhead">Revision style <span style="font-weight:400;color:#666">(switch anytime on Student Home)</span></div>
      <div class="ms">
        <button type="button" data-m="0" class="${plainMode ? '' : 'on'}" aria-pressed="${!plainMode}"><b>⚔️ Breadventure Land</b><span>Missions, loot &amp; world map</span></button>
        <button type="button" data-m="1" class="${plainMode ? 'on' : ''}" aria-pressed="${plainMode}"><b>📝 Plain Practice</b><span>Hide the game — same IGCSE progress</span></button>
      </div>
      <div class="mhead" style="margin-top:12px">Tap your year to start</div>
      <div class="ys">${[8, 9, 10, 11].map(n => `<button type="button" data-y="${n}"${Y.year === n ? ' class="on"' : ''}>Year ${n}</button>`).join('')}</div>
      <div class="err" hidden></div></div>`;
    document.body.appendChild(bg);
    const close = () => bg.remove();
    bg.querySelectorAll('[data-m]').forEach(mb => mb.onclick = () => {
      plainMode = mb.dataset.m === '1';
      bg.querySelectorAll('[data-m]').forEach(x => {
        const on = (x.dataset.m === '1') === plainMode;
        x.classList.toggle('on', on);
        x.setAttribute('aria-pressed', String(on));
      });
    });
    bg.querySelectorAll('[data-y]').forEach(b => b.onclick = () => {
      const y = +b.dataset.y;
      const body = { year: y, yearAt: Date.now(), yearBy: 'self', settings: { plainMode } };
      (window.CBSNet ? CBSNet.fsSetMerge('users', Y.uid, body, { ms: 8000, mergeMaps: ['settings'] }) : fs.collection('users').doc(Y.uid).set(body, { merge: true }))
        .then(() => { Y.year = y; writeYearCache(Y.uid, y); if (window.CBSMode) CBSMode.set(plainMode, { localOnly: true }); close(); emit(); if (window.CBSWork) CBSWork.refresh(); })
        .catch(e => { const er = bg.querySelector('.err'); er.hidden = false; er.textContent = 'Could not save: ' + (e.code || e.message); });
    });
  }
  function start() {
    if (!window.firebase || !window.firebaseConfig) return;
    try { if (!firebase.apps.length) firebase.initializeApp(window.firebaseConfig); } catch (e) { return; }
    needFirestore(() => {
      fs = window.CBSNet ? CBSNet.fsDb() : (firebase.firestore ? firebase.firestore() : null);
      firebase.auth().onAuthStateChanged(u => {
        Y.uid = u ? u.uid : null; Y.year = null; Y.known = false;
        if (!u) { emit(); return; }
        /* Use cached year immediately so To do / Upcoming tests never vanish while school Wi-Fi is slow */
        const cached = readYearCache(u.uid);
        if (cached) { Y.year = cached; emit(); }
        const p = window.CBSNet ? CBSNet.fsGet('users', u.uid, 6000) : (fs ? fs.collection('users').doc(u.uid).get() : Promise.reject(new Error('no firestore')));
        p.then(d => {
          const data = d && d.exists ? (d.data() || {}) : {};
          if (window.CBSMode && d && d.exists) CBSMode.syncFromDoc(data);
          const y = data.year || null;
          if ([8, 9, 10, 11].includes(y)) { Y.year = y; writeYearCache(u.uid, y); }
          else if (!cached) Y.year = null;
          emit();
          if (!Y.year && !isAdmin(u)) ask();
        }).catch(() => emit());
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
