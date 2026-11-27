/* Cakebread Science — Staging-Only Year 10 Student Simulator (/js/staging-sim.js, 27 Nov 2026).
   Strictly disabled on live production (cakebreadscience.com) and /admin/.
   Lets the teacher preview the entire student experience (Student Home, overdue/open/completed homework,
   2-day spaced missions, real scored test, upcoming study guides, Y10 covered-in-class full-topic boxes,
   due flashcards, Spec Tracker over-confident flags, Breadventure Land, and Spotlight Guided Tours)
   using an isolated localStorage sandbox — NEVER reads or writes real Firebase. */
(function () {
  if (typeof location === 'undefined' || /^(www\.)?cakebreadscience\.com$/i.test(location.hostname)) return;
  if (/^\/admin(\/|$)/.test(location.pathname || '')) return;
  if (window.CBSSim) return;

  var FLAG = 'cbs.sim.y10';
  var DBK = 'cbs.sim.db.v1';
  var SIM_UID = 'sim_y10';
  var SIM_USER = { uid: SIM_UID, displayName: 'Alex Ten', email: 'alex.y10@demo.cakebread' };

  function isOn() {
    try { return localStorage.getItem(FLAG) === '1'; } catch (e) { return false; }
  }
  function dstr(offsetDays) {
    var d = new Date(Date.now() + (offsetDays || 0) * 864e5);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  /* Build a rich, realistic Year 10 student dataset using real Edexcel spec codes & question IDs */
  function seedData() {
    var today = dstr(0), yest = dstr(-1), d2 = dstr(-2), d3 = dstr(-3), d5 = dstr(-5), d8 = dstr(-8), d25 = dstr(-25);
    var in3 = dstr(3), in4 = dstr(4), in5 = dstr(5), in6 = dstr(6), in14 = dstr(14);
    var now = Date.now(), past = now - 3600e3;

    // 17 genuinely secured spec points (4 Qs each -> fills Bio/Chem/Phys progress bars + 2 rusty points >21d old)
    var q = {};
    function secPt(p, dFirst, dLast) {
      for (var n = 1; n <= 4; n++) q[p + '-0' + n] = { n: 2, r: 2, c: 2, d: dFirst, l: dLast };
    }
    ['B1.1', 'B1.2', 'B1.3', 'B1.4', 'B2.1', 'B2.2'].forEach(function (p) { secPt(p, d8, d2); });
    ['C1.1', 'C1.2', 'C1.8', 'C1.37', 'C1.38'].forEach(function (p) { secPt(p, d8, d3); });
    ['P1.3', 'P1.4', 'P4.2', 'P8.2'].forEach(function (p) { secPt(p, d8, d3); });
    secPt('C1.14', d25, d25);
    secPt('P2.4', d25, d25);
    // Nearly secured (ready for Day 2) + partial practise for hw_pract (B2c)
    q['B2.3-01'] = { n: 1, r: 1, c: 1, d: yest, l: yest }; q['B2.3-02'] = { n: 1, r: 1, c: 1, d: yest, l: yest };
    q['B2.7-01'] = { n: 2, r: 2, c: 2, d: yest, l: today }; q['B2.7-02'] = { n: 1, r: 1, c: 1, d: today, l: today };
    q['B2.8-01'] = { n: 1, r: 1, c: 1, d: today, l: today }; q['B2.9-01'] = { n: 1, r: 1, c: 1, d: today, l: today };
    q['B2.10-01'] = { n: 1, r: 1, c: 1, d: today, l: today }; q['B2.11-01'] = { n: 1, r: 1, c: 1, d: today, l: today };
    q['C1.42-01'] = { n: 1, r: 1, c: 1, d: yest, l: yest }; q['P1.17-01'] = { n: 1, r: 1, c: 1, d: yest, l: yest };

    var daysAct = {};
    daysAct[today] = 1; daysAct[yest] = 1; daysAct[d2] = 1; daysAct[d3] = 1; daysAct[d5] = 1; daysAct[d8] = 1;
    var cd = {}; cd[yest] = { n: 12, done: true }; cd[d2] = { n: 10, done: true };

    // 14 real Year 10 flashcards due now so both Student Home and /Flashcards/ show live due cards
    var fcProg = {};
    [
      'biology_1675782928774', 'biology_1675782934495', 'biology_1675782941536', 'biology_1675782948862', 'biology_1675782958682',
      'chemistry_1675696422636', 'chemistry_1675696443829', 'chemistry_1675696492148', 'chemistry_1675696527529', 'chemistry_1675696547897',
      'physics_1478989549524', 'physics_1478989562164', 'physics_1478989578291', 'physics_1478989587928'
    ].forEach(function (k, idx) {
      fcProg[k] = { repetitions: 2, interval: 3, easiness: 2.5, nextReview: past - (idx + 1) * 60000 };
    });

    var userDoc = {
      displayName: SIM_USER.displayName,
      email: SIM_USER.email,
      year: 10,
      yearAt: now - 10 * 864e5,
      yearBy: 'self',
      course: null,
      lastAccess: new Date(now).toISOString(),
      progress: fcProg,
      specQuiz: {
        xp: 1240,
        missions: 11,
        correct: 86,
        updatedAt: now,
        q: q,
        weak: { 'B2.13': yest, 'C1.42': yest },
        cards: {}
      },
      questing: {
        nick: 'BeakerBoss',
        coins: 145,
        bag: ['labcoat', 'goggles', 'pipette', 'magnet'],
        eq: { head: 'goggles', top: 'labcoat', bottom: 'joggers', shoes: 'oddsocks', lhand: 'pipette', rhand: 'magnet' },
        days: daysAct,
        cd: cd,
        updatedAt: now,
        log: [
          { t: now - 3600e3, i: '⚔️', m: 'Mission 1f Ionic bonding: 8/10 right · +20 coins' },
          { t: now - 864e5, i: '🃏', m: 'Reviewed 12 flashcards' }
        ]
      },
      work: {
        hw_ionic: {
          days: (function () { var o = {}; o[today] = { n: 10, right: 8, mode: 'quest', at: now - 3600e3 }; return o; })(),
          done: false,
          at: now - 3600e3
        },
        hw_done1: {
          done: true, score: 9, n: 10, at: now - 4 * 864e5,
          ans: { 'B1.1-01': 1, 'B1.1-02': 1, 'B1.2-01': 1, 'B1.2-02': 1, 'B1.3-01': 1, 'B1.4-01': 1 }
        }
      }
    };

    // Spec Tracker confidence ratings (includes rated "Confident" on unproved points so "Check these" lights up!)
    var specProgDoc = {
      conf: {
        'B1.1': 3, 'B1.2': 3, 'B2.1': 3, 'B2.2': 3,
        'B2.15': 3, 'B2.16': 3, 'C1.41': 3, 'P1.18': 3,
        'B2.11': 2, 'C1.42': 2
      }
    };

    // Year 10 Covered in Class: 6 FULL topics + 5 in-progress sub-topics
    var taughtY10 = {};
    ['B1a','B1b', 'B4a','B4b','B4c','B4d', 'B2a','B2b','B2c','B2d','B2f',
     'C1a','C1b','C1c','C1d','C1e','C1f','C1g', 'C2a','C2b','C2c','C2d',
     'P1b','P1c', 'P2b','P2c', 'P4b','P4c', 'P3b', 'P8b','P8c'
    ].forEach(function (k) { taughtY10[k] = d5; });

    // Rich set of assignments (overdue 2-day spaced, test, Day-1-done spaced, in-progress practise, completed test)
    var assign = {
      hw_states: {
        title: 'States of matter revision',
        type: 'spaced',
        days: 2,
        qPerDay: 10,
        target: 10,
        years: { Y10: true },
        items: ['C1a'],
        pts: ['C1.1', 'C1.2', 'C1.3', 'C1.4'],
        need: 10,
        set: d5,
        due: yest,
        note: 'Complete one 10-question mission today, then come back on another day for Day 2.',
        by: 'teacher@demo.cakebread',
        t: now - 5 * 864e5
      },
      hw_cells_test: {
        title: 'Cell structure quick test',
        type: 'test',
        years: { Y10: true },
        items: ['B2b'],
        qids: ['B2.2-01', 'B2.2-02', 'B2.2-03', 'B2.3-01', 'B2.3-02', 'B2.4-01', 'B2.4-02', 'B2.4-03'],
        set: d2,
        due: in3,
        note: 'Closed book — one attempt, score goes to your teacher.',
        by: 'teacher@demo.cakebread',
        t: now - 2 * 864e5
      },
      hw_ionic: {
        title: 'Ionic bonding spaced mission',
        type: 'spaced',
        days: 2,
        qPerDay: 10,
        target: 10,
        years: { Y10: true },
        items: ['C1f'],
        pts: ['C1.37', 'C1.38', 'C1.39', 'C1.40', 'C1.41', 'C1.42', 'C1.43'],
        need: 10,
        set: d2,
        due: in5,
        note: 'Great job on Day 1 — return tomorrow for Day 2.',
        by: 'teacher@demo.cakebread',
        t: now - 2 * 864e5
      },
      hw_pract: {
        title: 'Biological molecules practise',
        type: 'practise',
        target: 10,
        years: { Y10: true },
        items: ['B2c'],
        pts: ['B2.7', 'B2.8', 'B2.9', 'B2.10', 'B2.11', 'B2.12', 'B2.13'],
        need: 10,
        set: yest,
        due: in4,
        note: 'Practise until you reach 10 different questions right.',
        by: 'teacher@demo.cakebread',
        t: now - 864e5
      },
      hw_done1: {
        title: 'Living organisms check',
        type: 'test',
        years: { Y10: true },
        items: ['B1a', 'B1b'],
        qids: ['B1.1-01', 'B1.1-02', 'B1.2-01', 'B1.2-02', 'B1.3-01', 'B1.4-01'],
        set: d8,
        due: d3,
        by: 'teacher@demo.cakebread',
        t: now - 8 * 864e5
      }
    };

    var guides = {
      g_bio2: {
        title: 'Biology Unit 2 Test',
        date: in6,
        course: 'DA',
        years: { Y10: true },
        subs: ['B2a', 'B2b', 'B2c', 'B2d', 'B2f'],
        at: now - 4 * 864e5,
        by: 'teacher@demo.cakebread'
      },
      g_chem1: {
        title: 'Chemistry States & Bonding Mock',
        date: in14,
        course: 'DA',
        years: { Y10: true },
        subs: ['C1a', 'C1f', 'C1g'],
        at: now - 3 * 864e5,
        by: 'teacher@demo.cakebread'
      }
    };

    return {
      fs: {
        users: (function () { var o = {}; o[SIM_UID] = userDoc; return o; })(),
        specProgress: (function () { var o = {}; o[SIM_UID] = specProgDoc; return o; })()
      },
      rt: {
        gameAccess: (function () { var o = {}; o[SIM_UID] = { status: 'approved', name: SIM_USER.displayName, email: SIM_USER.email, t: now - 10 * 864e5 }; return o; })(),
        school: {
          taught: { Y10: taughtY10 },
          assign: assign,
          guides: guides
        },
        bland: {
          world: { day: today, started: d8, chapter: 1, boss: {}, chests: { '6,4': { t: 'silver', d: 1 } }, log: ['BeakerBoss joined Breadventure Land!'] },
          state: (function () { var o = {}; o[SIM_UID] = { at: '7,4', visited: ['7,4', '6,4', '7,3'], moves: 3, moveDay: today, health: 28, mana: 14, brews: { tea: 1 } }; return o; })(),
          pub: (function () { var o = {}; o[SIM_UID] = { name: 'BeakerBoss', hp: 28, str: 18, mag: 14, lvl: 5, t: now }; return o; })()
        },
        specQuizBoard: (function () { var o = {}; o[SIM_UID] = { name: 'BeakerBoss', xp: 1240, pts: 18, t: now }; return o; })()
      }
    };
  }

  function loadDb() {
    try {
      var raw = JSON.parse(localStorage.getItem(DBK) || 'null');
      if (raw && raw.fs && raw.rt) return raw;
    } catch (e) {}
    var s = seedData();
    try { localStorage.setItem(DBK, JSON.stringify(s)); } catch (e) {}
    return s;
  }
  function saveDb(d) {
    try { localStorage.setItem(DBK, JSON.stringify(d)); } catch (e) {}
  }
  function clone(v) { return v === undefined ? undefined : JSON.parse(JSON.stringify(v)); }
  function deepMerge(target, src) {
    if (!src || typeof src !== 'object' || Array.isArray(src)) return clone(src);
    var out = Object.assign({}, target && typeof target === 'object' ? target : {});
    Object.keys(src).forEach(function (k) {
      if (src[k] && typeof src[k] === 'object' && !Array.isArray(src[k]) && out[k] && typeof out[k] === 'object' && !Array.isArray(out[k])) {
        out[k] = deepMerge(out[k], src[k]);
      } else {
        out[k] = clone(src[k]);
      }
    });
    return out;
  }
  function getP(o, path) {
    return String(path || '').split('/').filter(Boolean).reduce(function (a, k) { return a == null ? undefined : a[k]; }, o);
  }
  function setP(o, path, v) {
    var ks = String(path || '').split('/').filter(Boolean);
    if (!ks.length) return;
    var a = o;
    for (var i = 0; i < ks.length - 1; i++) {
      if (!a[ks[i]] || typeof a[ks[i]] !== 'object') a[ks[i]] = {};
      a = a[ks[i]];
    }
    if (v === null || v === undefined) delete a[ks[ks.length - 1]];
    else a[ks[ks.length - 1]] = v;
  }

  /* Build sandboxed Firebase compat implementation backed strictly by localStorage */
  function makeSimFirebase() {
    var subs = [];
    var signedIn = true;
    var authObj = {
      get currentUser() { return signedIn ? SIM_USER : null; },
      onAuthStateChanged: function (cb) { subs.push(cb); setTimeout(function () { cb(signedIn ? SIM_USER : null); }, 15); return function () {}; },
      signInWithPopup: function () { signedIn = true; subs.forEach(function (f) { setTimeout(function () { f(SIM_USER); }, 10); }); return Promise.resolve({ user: SIM_USER }); },
      signOut: function () { exit(); return Promise.resolve(); }
    };
    function docRef(col, id) {
      return {
        get: function () {
          var d = loadDb(), v = (d.fs[col] || {})[id];
          return Promise.resolve({ exists: !!v, data: function () { return clone(v); }, id: id });
        },
        update: function (val) {
          var d = loadDb(); d.fs[col] = d.fs[col] || {};
          var o = d.fs[col][id] = d.fs[col][id] || {};
          Object.keys(val || {}).forEach(function (k) { setP(o, k.replace(/\./g, '/'), clone(val[k])); });
          saveDb(d); return Promise.resolve();
        },
        set: function (val, opt) {
          var d = loadDb(); d.fs[col] = d.fs[col] || {};
          d.fs[col][id] = opt && opt.merge ? deepMerge(d.fs[col][id], val) : clone(val);
          saveDb(d); return Promise.resolve();
        },
        delete: function () {
          var d = loadDb(); if (d.fs[col]) delete d.fs[col][id];
          saveDb(d); return Promise.resolve();
        }
      };
    }
    function fsApi() {
      return {
        settings: function () {},
        collection: function (col) {
          return {
            doc: function (id) { return docRef(col, id); },
            get: function () {
              var d = loadDb(), c = d.fs[col] || {};
              var arr = Object.keys(c).map(function (id) { return { id: id, data: function () { return clone(c[id]); } }; });
              return Promise.resolve({ forEach: function (f) { arr.forEach(f); }, docs: arr });
            }
          };
        }
      };
    }
    function rtRef(path) {
      path = String(path || '');
      var snap = function () {
        var v = path === '.info/connected' ? true : clone(getP(loadDb().rt, path));
        return {
          val: function () { return v === undefined ? null : v; },
          exists: function () { return v !== undefined && v !== null; },
          key: path.split('/').filter(Boolean).pop() || null,
          forEach: function (f) { Object.keys(v || {}).forEach(function (k) { f({ key: k, val: function () { return v[k]; } }); }); }
        };
      };
      return {
        once: function () { return Promise.resolve(snap()); },
        get: function () { return Promise.resolve(snap()); },
        on: function (ev, cb) { setTimeout(function () { cb(snap()); }, 10); return cb; },
        off: function () {},
        set: function (v) { var d = loadDb(); setP(d.rt, path, clone(v)); saveDb(d); return Promise.resolve(); },
        update: function (v) { var d = loadDb(); Object.keys(v || {}).forEach(function (k) { setP(d.rt, path + '/' + k, clone(v[k])); }); saveDb(d); return Promise.resolve(); },
        remove: function () { var d = loadDb(); setP(d.rt, path, null); saveDb(d); return Promise.resolve(); },
        push: function (v) {
          var k = 'sim_' + Date.now() + Math.random().toString(36).slice(2, 5);
          var r = rtRef(path + '/' + k);
          if (v === undefined) return r;
          return r.set(v).then(function () { return r; });
        },
        transaction: function (fn) {
          var d = loadDb(), cur = clone(getP(d.rt, path)), nv = fn(cur);
          if (nv !== undefined) { setP(d.rt, path, clone(nv)); saveDb(d); }
          return Promise.resolve({ committed: nv !== undefined, snapshot: snap() });
        },
        child: function (p) { return rtRef(path + '/' + p); },
        orderByChild: function () { return this; },
        limitToLast: function () { return this; }
      };
    }
    var rtApi = function () { return { ref: rtRef }; };
    var simApp = { auth: function () { return authObj; }, firestore: fsApi, database: rtApi };
    return {
      simApp: simApp,
      authFn: Object.assign(function () { return authObj; }, { GoogleAuthProvider: function () {} }),
      fsFn: Object.assign(fsApi, { FieldValue: { serverTimestamp: function () { return Date.now(); } } }),
      rtFn: Object.assign(rtApi, { ServerValue: { get TIMESTAMP() { return Date.now(); } } })
    };
  }

  /* Replace window.firebase with our self-contained localStorage sandbox.
     Ignores subsequent UMD assignments from firebase-*-compat.js and provides no-op INTERNAL hooks
     so firebase-app/auth/firestore/database-compat.js load silently with zero real Firebase traffic. */
  function installProxy() {
    var sim = makeSimFirebase();
    var noop = function () {};
    var simFb = {
      apps: [sim.simApp],
      SDK_VERSION: '9.22.2',
      initializeApp: function () { return sim.simApp; },
      app: function () { return sim.simApp; },
      auth: sim.authFn,
      firestore: sim.fsFn,
      database: sim.rtFn,
      registerVersion: noop,
      _registerComponent: noop,
      onLog: noop,
      setLogLevel: noop,
      INTERNAL: {
        registerComponent: noop,
        registerVersion: noop,
        removeApp: noop,
        useAsService: noop,
        extendNamespace: noop,
        factories: {},
        deepExtend: function (t) { return t; },
        createSubscribe: function () { return function () { return noop; }; }
      }
    };
    simFb.default = simFb;
    try {
      Object.defineProperty(window, 'firebase', {
        configurable: true,
        enumerable: true,
        get: function () { return simFb; },
        set: noop
      });
    } catch (e) {
      try { window.firebase = simFb; } catch (e2) {}
    }
  }

  function clearSimCaches() {
    try {
      localStorage.removeItem('cbs.tour.v1');
      localStorage.removeItem('cbs.school');
      localStorage.removeItem('specquiz.camp.' + SIM_UID);
      localStorage.removeItem('cbs.questing.game.' + SIM_UID);
      localStorage.removeItem('cbs.questing.uid');
      sessionStorage.removeItem('cbs.dir');
      sessionStorage.removeItem('cbs.work.' + SIM_UID);
      sessionStorage.removeItem('cbs.questing.reloaded');
    } catch (e) {}
  }

  function start(goToday) {
    try {
      localStorage.setItem(FLAG, '1');
      localStorage.setItem(DBK, JSON.stringify(seedData()));
    } catch (e) {}
    clearSimCaches();
    if (goToday) location.href = '/today/';
    else location.reload();
  }
  function reset() {
    try { localStorage.setItem(DBK, JSON.stringify(seedData())); } catch (e) {}
    clearSimCaches();
    location.reload();
  }
  function exit() {
    try {
      localStorage.removeItem(FLAG);
      localStorage.removeItem(DBK);
    } catch (e) {}
    clearSimCaches();
    location.href = '/?dir=1';
  }

  /* Top staging bar when simulating (and compact trigger pill on staging pages without banner.js) */
  function renderBar() {
    if (!document.body || document.getElementById('cbs-sim-bar')) return;
    if (isOn()) {
      var bar = document.createElement('div');
      bar.id = 'cbs-sim-bar';
      bar.style.cssText = 'background:#4c1d95;color:#fff;border-bottom:3px solid #facc15;padding:7px 16px;font:700 13.5px/1.3 Barlow,Arial,sans-serif;display:flex;align-items:center;justify-content:space-between;gap:8px 12px;flex-wrap:wrap;position:relative;z-index:2147483000';
      bar.innerHTML = '<span><b style="background:#facc15;color:#111;padding:2px 7px;border-radius:3px;font-size:11.5px;text-transform:uppercase;letter-spacing:.6px;margin-right:7px">STAGING SIM</b>'
        + 'Viewing as <b>Alex Ten (Year 10)</b> · sandbox data only (real Firebase untouched)</span>'
        + '<span style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">'
        + '<a href="/today/" style="background:#facc15;color:#111;text-decoration:none;padding:4px 10px;border-radius:4px;font-weight:800">🏠 Student Home</a>'
        + '<button type="button" id="cbsSimTour" style="background:#fff;color:#111;border:0;padding:4px 10px;border-radius:4px;font:700 13px Barlow,Arial;cursor:pointer">✨ Replay tour</button>'
        + '<button type="button" id="cbsSimReset" style="background:none;color:#fde047;border:1.5px solid #fde047;padding:3px 9px;border-radius:4px;font:700 13px Barlow,Arial;cursor:pointer">↻ Reset demo</button>'
        + '<button type="button" id="cbsSimExit" style="background:#dc2626;color:#fff;border:0;padding:4px 10px;border-radius:4px;font:800 13px Barlow,Arial;cursor:pointer">✕ Exit sim</button>'
        + '</span>';
      document.body.insertBefore(bar, document.body.firstChild);
      bar.querySelector('#cbsSimReset').onclick = reset;
      bar.querySelector('#cbsSimExit').onclick = exit;
      bar.querySelector('#cbsSimTour').onclick = function () {
        if (window.CBSTour && CBSTour.detect && CBSTour.detect()) CBSTour.start();
        else location.href = '/today/?tour=1';
      };
    }
  }

  if (isOn()) {
    loadDb();
    installProxy();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderBar);
    else renderBar();
  }

  window.CBSSim = { isOn: isOn, start: start, reset: reset, exit: exit, seedData: seedData };
})();
