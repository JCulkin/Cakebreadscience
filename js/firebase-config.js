window.firebaseConfig = {
    apiKey: "AIzaSyANnocUqbtGDJgHj1MtnhCdhmnUfJnTJb8",
    authDomain: "elevenstudents-76f31.firebaseapp.com",
    databaseURL: "https://elevenstudents-76f31-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "elevenstudents-76f31",
    storageBucket: "elevenstudents-76f31.firebasestorage.app",
    messagingSenderId: "692298982954",
    appId: "1:692298982954:web:d0aeab82f81dd18af8c553",
    measurementId: "G-W9RMF38FLL"
};

/* School Wi-Fi transport layer (27 Nov 2026):
   - Auto-configures Firestore with experimentalAutoDetectLongPolling so SSL-inspecting school proxies don't stall streams.
   - Provides full HTTPS REST fallbacks for RTDB (get/set/update/push/ETag transactions) and Firestore (get/merge-set),
     routed through same-origin /_fb/rtdb/* and /_fb/fs/* Netlify proxies on live/staging hosts so school filters that
     block WebSockets or *.firebasedatabase.app / firestore.googleapis.com don't break Questing, Breadventure Land, or To do.
   - Tracks recent failures and provides probe() for bottom-of-screen diagnostics. */
(function () {
  if (window.CBSNet) return;
  const CFG = window.firebaseConfig || {};
  const RTDB_DIRECT = String(CFG.databaseURL || '').replace(/\/+$/, '');
  const FS_DIRECT = CFG.projectId ? `https://firestore.googleapis.com/v1/projects/${CFG.projectId}/databases/(default)/documents` : '';
  const USE_PROXY = typeof location !== 'undefined' && /^https?:$/.test(location.protocol) && !/^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(location.hostname);
  const RTDB_PROXY = '/_fb/rtdb';
  const FS_PROXY = '/_fb/fs';
  const K_RT = 'cbs.net.rtdb', K_FS = 'cbs.net.fs';
  const ssGet = k => { try { return sessionStorage.getItem(k); } catch (e) { return null; } };
  const ssSet = (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} };
  const clean = p => String(p || '').replace(/^\/+|\/+$/g, '');
  const encPath = p => clean(p).split('/').filter(Boolean).map(encodeURIComponent).join('/');
  const within = (p, ms = 12000, label = 'timeout') => new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error(label)), ms);
    Promise.resolve(p).then(v => { clearTimeout(t); ok(v); }, e => { clearTimeout(t); no(e); });
  });

  const log = [];
  let lastTransport = { rtdb: 'auto', fs: 'auto' };
  function note(op, path, err) {
    const msg = err && err.message ? err.message : String(err || 'unknown error');
    log.push({ t: Date.now(), op, path: path || '', msg: msg.slice(0, 180) });
    if (log.length > 25) log.shift();
  }

  /* Track whether RTDB WebSocket SDK is actually connected */
  let rtConnected = false, rtWatched = false, fsConfigured = false;
  function watchRt() {
    if (rtWatched || !window.firebase || !firebase.database) return;
    try {
      if (!firebase.apps.length) firebase.initializeApp(CFG);
      rtWatched = true;
      firebase.database().ref('.info/connected').on('value', s => { rtConnected = !!s.val(); });
    } catch (e) {}
  }
  function fsDb() {
    if (!window.firebase || !firebase.firestore) return null;
    if (!firebase.apps.length) firebase.initializeApp(CFG);
    const db = firebase.firestore();
    if (!fsConfigured) {
      fsConfigured = true;
      try { if (typeof db.settings === 'function') db.settings({ experimentalAutoDetectLongPolling: true, merge: true }); } catch (e) {}
    }
    return db;
  }
  function rtDb() {
    if (!window.firebase || !firebase.database) return null;
    if (!firebase.apps.length) firebase.initializeApp(CFG);
    watchRt();
    return firebase.database();
  }
  async function token(ms = 6000) {
    const u = window.firebase && firebase.auth && firebase.auth().currentUser;
    if (!u || typeof u.getIdToken !== 'function') return null;
    return within(u.getIdToken(), ms, 'auth token timeout');
  }
  function hasRealAuth() {
    const u = window.firebase && firebase.auth && firebase.auth().currentUser;
    return !!(u && typeof u.getIdToken === 'function');
  }

  /* ---------- RTDB REST (same-origin proxy first on live/staging, direct fallback) ---------- */
  async function rtFetch(path, opts = {}, ms = 12000) {
    const tok = await token();
    const ep = encPath(path);
    const qs = tok ? `?auth=${encodeURIComponent(tok)}` : '';
    const bases = USE_PROXY ? [RTDB_PROXY, RTDB_DIRECT] : [RTDB_DIRECT];
    let lastErr = null;
    for (let i = 0; i < bases.length; i++) {
      const base = bases[i]; if (!base) continue;
      const url = `${base}${ep ? '/' + ep : ''}.json${qs}`;
      const ac = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer = ac ? setTimeout(() => ac.abort(), ms) : null;
      try {
        const res = await within(fetch(url, Object.assign({ cache: 'no-store' }, opts, ac ? { signal: ac.signal } : {})), ms, `HTTP timeout (${i === 0 && USE_PROXY ? 'proxy' : 'direct'})`);
        if (timer) clearTimeout(timer);
        if (res.status === 412) return { status: 412, etag: res.headers.get('etag'), data: await res.json().catch(() => null), via: base === RTDB_PROXY ? 'proxy' : 'direct' };
        if (res.status === 404 && base === RTDB_PROXY && i + 1 < bases.length) { lastErr = new Error('proxy 404'); continue; }
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          const err = new Error(`RTDB ${base === RTDB_PROXY ? 'proxy' : 'direct'} HTTP ${res.status}${txt ? ': ' + txt.slice(0, 80) : ''}`);
          if (res.status === 401 || res.status === 403) throw err;   // real auth/rule denial: don't mask
          lastErr = err; continue;
        }
        lastTransport.rtdb = base === RTDB_PROXY ? 'proxy' : 'direct-rest';
        return { status: res.status, etag: res.headers.get('etag'), data: await res.json().catch(() => null), via: base === RTDB_PROXY ? 'proxy' : 'direct' };
      } catch (e) {
        if (timer) clearTimeout(timer);
        lastErr = e;
        if (e && /HTTP 40[13]/.test(e.message)) throw e;
      }
    }
    throw lastErr || new Error('RTDB request failed');
  }

  function preferRestRt() {
    if (ssGet(K_RT) === 'rest') return true;
    return !rtConnected && USE_PROXY && hasRealAuth();
  }

  async function rtGet(path, ms = 12000, opts = {}) {
    const db = rtDb();
    const canRest = hasRealAuth() || !!opts.public;
    if (!db && !canRest) throw new Error('Firebase offline');
    if (canRest && ssGet(K_RT) === 'rest') {
      try { return (await rtFetch(path, { method: 'GET' }, ms)).data; }
      catch (e) { note('rtGet', path, e); throw e; }
    }
    if (!canRest) {
      try {
        const snap = await within(db.ref(clean(path)).once('value'), ms, 'RTDB SDK timeout');
        lastTransport.rtdb = 'sdk'; return snap.val();
      } catch (e) { note('rtGet', path, e); throw e; }
    }
    let sdkDone = false;
    const sdk = db ? db.ref(clean(path)).once('value').then(s => { sdkDone = true; lastTransport.rtdb = 'sdk'; return s.val(); }) : Promise.reject(new Error('no sdk'));
    const rest = (async () => {
      await new Promise(r => setTimeout(r, rtConnected ? 1500 : 350));
      if (sdkDone) throw new Error('sdk won');
      const r = await rtFetch(path, { method: 'GET' }, Math.max(4000, ms - 400));
      if (!sdkDone) ssSet(K_RT, 'rest');
      return r.data;
    })();
    const race = Promise.any ? Promise.any([sdk, rest]) : sdk;
    try { return await within(race, ms, `RTDB read timeout (${clean(path)})`); }
    catch (e) {
      const msg = e && e.errors ? e.errors.map(x => x && x.message).filter(m => m && m !== 'sdk won').join(' | ') : (e && e.message) || String(e);
      const err = new Error(msg || 'RTDB read failed');
      note('rtGet', path, err); throw err;
    }
  }

  async function rtSet(path, val, ms = 12000) {
    const db = rtDb();
    const canRest = hasRealAuth();
    if (canRest && preferRestRt()) {
      try {
        await rtFetch(path, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(val === undefined ? null : val) }, ms);
        ssSet(K_RT, 'rest'); return;
      } catch (e) { note('rtSet', path, e); throw e; }
    }
    if (!db) {
      if (!canRest) throw new Error('Firebase offline');
      try { await rtFetch(path, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(val === undefined ? null : val) }, ms); return; }
      catch (e) { note('rtSet', path, e); throw e; }
    }
    try {
      await within(db.ref(clean(path)).set(val), canRest ? Math.min(3500, ms) : ms, 'RTDB SDK write timeout');
      lastTransport.rtdb = 'sdk';
    } catch (e) {
      if (!canRest) { note('rtSet', path, e); throw e; }
      try {
        await rtFetch(path, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(val === undefined ? null : val) }, ms);
        ssSet(K_RT, 'rest');
      } catch (e2) {
        const err = new Error(`SDK: ${e.message}; REST: ${e2.message}`);
        note('rtSet', path, err); throw err;
      }
    }
  }

  async function rtUpdate(path, fields, ms = 12000) {
    const db = rtDb();
    const canRest = hasRealAuth();
    if (canRest && preferRestRt()) {
      try {
        await rtFetch(path, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fields || {}) }, ms);
        ssSet(K_RT, 'rest'); return;
      } catch (e) { note('rtUpdate', path, e); throw e; }
    }
    if (!db) {
      if (!canRest) throw new Error('Firebase offline');
      try { await rtFetch(path, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fields || {}) }, ms); return; }
      catch (e) { note('rtUpdate', path, e); throw e; }
    }
    try {
      await within(db.ref(clean(path)).update(fields), canRest ? Math.min(3500, ms) : ms, 'RTDB SDK update timeout');
      lastTransport.rtdb = 'sdk';
    } catch (e) {
      if (!canRest) { note('rtUpdate', path, e); throw e; }
      try {
        await rtFetch(path, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fields || {}) }, ms);
        ssSet(K_RT, 'rest');
      } catch (e2) {
        const err = new Error(`SDK: ${e.message}; REST: ${e2.message}`);
        note('rtUpdate', path, err); throw err;
      }
    }
  }

  async function rtPush(path, val, ms = 12000) {
    const db = rtDb();
    const canRest = hasRealAuth();
    if (canRest && preferRestRt()) {
      try {
        const r = await rtFetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(val) }, ms);
        ssSet(K_RT, 'rest'); return r.data && r.data.name;
      } catch (e) { note('rtPush', path, e); throw e; }
    }
    if (!db) {
      if (!canRest) throw new Error('Firebase offline');
      const r = await rtFetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(val) }, ms);
      return r.data && r.data.name;
    }
    try {
      const ref = await within(db.ref(clean(path)).push(val), canRest ? Math.min(3500, ms) : ms, 'RTDB SDK push timeout');
      lastTransport.rtdb = 'sdk'; return ref && ref.key;
    } catch (e) {
      if (!canRest) { note('rtPush', path, e); throw e; }
      try {
        const r = await rtFetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(val) }, ms);
        ssSet(K_RT, 'rest'); return r.data && r.data.name;
      } catch (e2) {
        const err = new Error(`SDK: ${e.message}; REST: ${e2.message}`);
        note('rtPush', path, err); throw err;
      }
    }
  }

  /* Atomic transaction: uses SDK when live-connected, else Firebase REST X-Firebase-ETag + If-Match with retry on HTTP 412 */
  async function rtTxRest(path, updateFn, ms = 12000) {
    for (let attempt = 0; attempt < 5; attempt++) {
      const cur = await rtFetch(path, { method: 'GET', headers: { 'X-Firebase-ETag': 'true' } }, ms);
      const next = updateFn(cur.data == null ? null : JSON.parse(JSON.stringify(cur.data)));
      if (next === undefined) return { committed: false, value: cur.data };
      const headers = { 'Content-Type': 'application/json' };
      if (cur.etag) headers['If-Match'] = cur.etag;
      const put = await rtFetch(path, { method: 'PUT', headers, body: JSON.stringify(next) }, ms);
      if (put.status === 412) continue;   // concurrent write — retry with fresh value
      ssSet(K_RT, 'rest');
      return { committed: true, value: next };
    }
    throw new Error('RTDB transaction conflict (retried 5x)');
  }

  async function rtTx(path, updateFn, ms = 12000) {
    const db = rtDb();
    const canRest = hasRealAuth();
    if (canRest && preferRestRt()) {
      try { return await rtTxRest(path, updateFn, ms); }
      catch (e) { note('rtTx', path, e); throw e; }
    }
    if (!db) {
      if (!canRest) throw new Error('Firebase offline');
      try { return await rtTxRest(path, updateFn, ms); }
      catch (e) { note('rtTx', path, e); throw e; }
    }
    try {
      const r = await within(db.ref(clean(path)).transaction(updateFn), canRest ? Math.min(4000, ms) : ms, 'RTDB SDK transaction timeout');
      lastTransport.rtdb = 'sdk';
      return { committed: !!(r && r.committed), value: r && r.snapshot ? r.snapshot.val() : null };
    } catch (e) {
      if (!canRest) { note('rtTx', path, e); throw e; }
      try { return await rtTxRest(path, updateFn, ms); }
      catch (e2) {
        const err = new Error(`SDK: ${e.message}; REST: ${e2.message}`);
        note('rtTx', path, err); throw err;
      }
    }
  }

  /* ---------- Firestore REST v1 converter & fallback ---------- */
  function toFsVal(v) {
    if (v === null) return { nullValue: null };
    const t = typeof v;
    if (t === 'boolean') return { booleanValue: v };
    if (t === 'number') return Number.isInteger(v) && Math.abs(v) <= 9007199254740991 ? { integerValue: String(v) } : { doubleValue: isFinite(v) ? v : 0 };
    if (t === 'string') return { stringValue: v };
    if (Array.isArray(v)) return { arrayValue: { values: v.filter(x => x !== undefined).map(toFsVal) } };
    if (t === 'object') {
      const fields = {};
      Object.keys(v).forEach(k => { if (v[k] !== undefined) fields[k] = toFsVal(v[k]); });
      return { mapValue: { fields } };
    }
    return { stringValue: String(v) };
  }
  function fromFsVal(v) {
    if (!v || typeof v !== 'object') return null;
    if ('nullValue' in v) return null;
    if ('booleanValue' in v) return !!v.booleanValue;
    if ('integerValue' in v) return Number(v.integerValue);
    if ('doubleValue' in v) return Number(v.doubleValue);
    if ('stringValue' in v) return v.stringValue;
    if ('timestampValue' in v) return v.timestampValue;
    if ('arrayValue' in v) return (v.arrayValue.values || []).map(fromFsVal);
    if ('mapValue' in v) {
      const o = {}, f = v.mapValue.fields || {};
      Object.keys(f).forEach(k => { o[k] = fromFsVal(f[k]); });
      return o;
    }
    return null;
  }
  function fromFsDoc(doc) {
    const o = {}, f = (doc && doc.fields) || {};
    Object.keys(f).forEach(k => { o[k] = fromFsVal(f[k]); });
    return o;
  }
  const maskEsc = s => /^[A-Za-z_][A-Za-z0-9_]*$/.test(s) ? s : '`' + String(s).replace(/`/g, '\\`') + '`';

  async function fsFetch(relPath, opts = {}, ms = 10000) {
    const tok = await token();
    if (!tok) throw new Error('no auth token');
    const bases = USE_PROXY ? [FS_PROXY, FS_DIRECT] : [FS_DIRECT];
    let lastErr = null;
    for (let i = 0; i < bases.length; i++) {
      const base = bases[i]; if (!base) continue;
      const url = `${base}/${relPath}`;
      const ac = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer = ac ? setTimeout(() => ac.abort(), ms) : null;
      try {
        const headers = Object.assign({ Authorization: 'Bearer ' + tok }, opts.headers || {});
        const res = await within(fetch(url, Object.assign({ cache: 'no-store' }, opts, { headers }, ac ? { signal: ac.signal } : {})), ms, `Firestore HTTP timeout (${base === FS_PROXY ? 'proxy' : 'direct'})`);
        if (timer) clearTimeout(timer);
        if (res.status === 404) {
          const txt = await res.text().catch(() => '');
          if (base === FS_PROXY && !/NOT_FOUND|"error"/.test(txt) && i + 1 < bases.length) { lastErr = new Error('proxy 404'); continue; }
          lastTransport.fs = base === FS_PROXY ? 'proxy' : 'direct-rest';
          return { status: 404, data: null };
        }
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          const err = new Error(`Firestore ${base === FS_PROXY ? 'proxy' : 'direct'} HTTP ${res.status}${txt ? ': ' + txt.slice(0, 80) : ''}`);
          if (res.status === 401 || res.status === 403) throw err;
          lastErr = err; continue;
        }
        lastTransport.fs = base === FS_PROXY ? 'proxy' : 'direct-rest';
        return { status: res.status, data: await res.json().catch(() => null) };
      } catch (e) {
        if (timer) clearTimeout(timer);
        lastErr = e;
        if (e && /HTTP 40[13]/.test(e.message)) throw e;
      }
    }
    throw lastErr || new Error('Firestore request failed');
  }

  async function fsGet(col, docId, ms = 8000) {
    const db = fsDb();
    const canRest = hasRealAuth();
    const path = `${encodeURIComponent(col)}/${encodeURIComponent(docId)}`;
    if (canRest && ssGet(K_FS) === 'rest') {
      try {
        const r = await fsFetch(path, { method: 'GET' }, ms);
        if (r.status === 404 || !r.data) return { exists: false, id: docId, data: () => undefined };
        const d = fromFsDoc(r.data);
        return { exists: true, id: docId, data: () => d };
      } catch (e) { note('fsGet', `${col}/${docId}`, e); throw e; }
    }
    if (!canRest) {
      if (!db) throw new Error('Firestore offline');
      try { const snap = await within(db.collection(col).doc(docId).get(), ms, 'Firestore SDK timeout'); lastTransport.fs = 'sdk'; return snap; }
      catch (e) { note('fsGet', `${col}/${docId}`, e); throw e; }
    }
    let sdkDone = false;
    const sdk = db ? db.collection(col).doc(docId).get().then(s => { sdkDone = true; lastTransport.fs = 'sdk'; return s; }) : Promise.reject(new Error('no sdk'));
    const rest = (async () => {
      await new Promise(r => setTimeout(r, 1800));
      if (sdkDone) throw new Error('sdk won');
      const r = await fsFetch(path, { method: 'GET' }, Math.max(4000, ms - 1500));
      if (!sdkDone) ssSet(K_FS, 'rest');
      if (r.status === 404 || !r.data) return { exists: false, id: docId, data: () => undefined };
      const d = fromFsDoc(r.data);
      return { exists: true, id: docId, data: () => d };
    })();
    const race = Promise.any ? Promise.any([sdk, rest]) : sdk;
    try { return await within(race, ms, `Firestore read timeout (${col}/${docId})`); }
    catch (e) {
      const msg = e && e.errors ? e.errors.map(x => x && x.message).filter(m => m && m !== 'sdk won').join(' | ') : (e && e.message) || String(e);
      const err = new Error(msg || 'Firestore read failed');
      note('fsGet', `${col}/${docId}`, err); throw err;
    }
  }

  async function fsSetMerge(col, docId, obj, opts = {}) {
    const ms = opts.ms || 10000;
    const db = fsDb();
    const canRest = hasRealAuth();
    const restWrite = async () => {
      const fields = {}, masks = [];
      const mergeMaps = new Set(opts.mergeMaps || []);
      Object.keys(obj || {}).forEach(k => {
        const v = obj[k]; if (v === undefined) return;
        fields[k] = toFsVal(v);
        if (mergeMaps.has(k) && v && typeof v === 'object' && !Array.isArray(v)) {
          Object.keys(v).forEach(sub => { if (v[sub] !== undefined) masks.push(`${maskEsc(k)}.${maskEsc(sub)}`); });
        } else masks.push(maskEsc(k));
      });
      const qs = masks.map(m => 'updateMask.fieldPaths=' + encodeURIComponent(m)).join('&');
      await fsFetch(`${encodeURIComponent(col)}/${encodeURIComponent(docId)}${qs ? '?' + qs : ''}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields })
      }, ms);
      ssSet(K_FS, 'rest');
    };
    if (canRest && ssGet(K_FS) === 'rest') {
      try { await restWrite(); return; } catch (e) { note('fsSet', `${col}/${docId}`, e); throw e; }
    }
    if (!db) {
      if (!canRest) throw new Error('Firestore offline');
      try { await restWrite(); return; } catch (e) { note('fsSet', `${col}/${docId}`, e); throw e; }
    }
    try {
      await within(db.collection(col).doc(docId).set(obj, { merge: true }), canRest ? Math.min(4500, ms) : ms, 'Firestore SDK write timeout');
      lastTransport.fs = 'sdk';
    } catch (e) {
      if (!canRest) { note('fsSet', `${col}/${docId}`, e); throw e; }
      try { await restWrite(); }
      catch (e2) {
        const err = new Error(`SDK: ${e.message}; REST: ${e2.message}`);
        note('fsSet', `${col}/${docId}`, err); throw err;
      }
    }
  }

  /* ---------- Live school-network diagnostic probe ---------- */
  async function probe() {
    const out = [];
    const u = window.firebase && firebase.auth && firebase.auth().currentUser;
    const run = async (name, fn) => {
      const t0 = Date.now();
      try { const detail = await fn(); out.push({ name, ok: true, ms: Date.now() - t0, detail: detail || 'OK' }); }
      catch (e) { out.push({ name, ok: false, ms: Date.now() - t0, detail: (e && e.message) || String(e) }); }
    };
    let tok = null;
    await run('Google sign-in token', async () => {
      if (!u) throw new Error('Not signed in');
      if (typeof u.getIdToken !== 'function') return 'Signed in (test mode)';
      tok = await within(u.getIdToken(), 5000, 'Token timed out');
      return 'Signed in';
    });
    const qs = tok ? `?auth=${encodeURIComponent(tok)}` : '';
    const testUrl = async (url, headers) => {
      const r = await within(fetch(url, { cache: 'no-store', headers }), 5000, 'Timed out (5s)');
      if (!r.ok && r.status !== 404) throw new Error(`HTTP ${r.status}`);
      return `HTTP ${r.status}`;
    };
    const tests = [];
    if (USE_PROXY) {
      tests.push(run('Site proxy → Realtime DB (/_fb/rtdb)', () => testUrl(`${RTDB_PROXY}/bland/world/day.json${qs}`)));
      if (tok && u) tests.push(run('Site proxy → Firestore (/_fb/fs)', () => testUrl(`${FS_PROXY}/users/${encodeURIComponent(u.uid)}`, { Authorization: 'Bearer ' + tok })));
    }
    tests.push(run('Direct Realtime DB (firebasedatabase.app)', () => testUrl(`${RTDB_DIRECT}/bland/world/day.json${qs}`)));
    if (tok && u) tests.push(run('Direct Firestore (firestore.googleapis.com)', () => testUrl(`${FS_DIRECT}/users/${encodeURIComponent(u.uid)}`, { Authorization: 'Bearer ' + tok })));
    tests.push(run('Realtime DB live WebSocket (SDK)', async () => {
      const db = rtDb(); if (!db) throw new Error('SDK not loaded');
      if (rtConnected) return 'Connected';
      await within(db.ref('bland/world/day').once('value'), 4000, 'Blocked or timed out (4s)');
      return 'Connected';
    }));
    await Promise.all(tests);
    return out;
  }

  window.CBSNet = {
    USE_PROXY, RTDB_PROXY, FS_PROXY, RTDB_DIRECT, FS_DIRECT,
    within, fsDb, rtDb, token, hasRealAuth,
    rtGet, rtSet, rtUpdate, rtPush, rtTx,
    fsGet, fsSetMerge, toFsVal, fromFsVal, fromFsDoc,
    probe, note, get log() { return log.slice(); }, get transport() { return Object.assign({}, lastTransport); },
    get rtConnected() { return rtConnected; }
  };
})();
