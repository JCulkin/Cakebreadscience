/* Used by tools/test/smoke.py. Fake Firebase compat SDK for tests: auth (popup sign-in), Firestore (users docs) and Realtime Database, all kept in
   localStorage so data survives page loads like the real thing. */
(function () {
  if (window.firebase) return;
  const DBK = '__fake_db', UK = '__fake_user';
  const load = () => { try { return JSON.parse(localStorage.getItem(DBK)) || { fs: {}, rt: {} }; } catch (e) { return { fs: {}, rt: {} }; } };
  const store = d => localStorage.setItem(DBK, JSON.stringify(d));
  const clone = v => v === undefined ? undefined : JSON.parse(JSON.stringify(v));
  let user = null; try { user = JSON.parse(localStorage.getItem(UK)); } catch (e) {}
  const subs = [];
  const auth = {
    get currentUser() { return user; },
    onAuthStateChanged(cb) { subs.push(cb); setTimeout(() => cb(user), 30); return () => {}; },
    signInWithPopup() { user = { uid: 'u1', displayName: 'Test Student', email: 'test@example.com' }; localStorage.setItem(UK, JSON.stringify(user)); subs.forEach(f => setTimeout(() => f(user), 10)); return Promise.resolve({ user }); },
    signOut() { user = null; localStorage.removeItem(UK); subs.forEach(f => setTimeout(() => f(null), 10)); return Promise.resolve(); },
  };
  function doc(col, id) {
    return {
      get() { const d = load(); const v = (d.fs[col] || {})[id]; return Promise.resolve({ exists: !!v, data: () => clone(v), id }); },
      update(val) { const d = load(); d.fs[col] = d.fs[col] || {}; const o = d.fs[col][id] = d.fs[col][id] || {}; Object.entries(val).forEach(([k, v]) => { const ks = k.split('.'); let a = o; ks.slice(0, -1).forEach(x => { a[x] = a[x] && typeof a[x] === 'object' ? a[x] : {}; a = a[x]; }); a[ks[ks.length - 1]] = clone(v); }); store(d); return Promise.resolve(); },
      set(val, opt) { const d = load(); d.fs[col] = d.fs[col] || {}; d.fs[col][id] = opt && opt.merge ? Object.assign(d.fs[col][id] || {}, clone(val)) : clone(val); store(d); return Promise.resolve(); },
    };
  }
  const firestore = () => ({ collection: col => ({ doc: id => doc(col, id), get: () => { const d = load(); const c = d.fs[col] || {}; return Promise.resolve({ forEach: f => Object.entries(c).forEach(([id, v]) => f({ id, data: () => clone(v) })), docs: Object.entries(c).map(([id, v]) => ({ id, data: () => clone(v) })) }); } }) });
  const getP = (o, path) => path.split('/').filter(Boolean).reduce((a, k) => a == null ? undefined : a[k], o);
  const setP = (o, path, v) => { const ks = path.split('/').filter(Boolean); let a = o; ks.slice(0, -1).forEach(k => { a[k] = a[k] && typeof a[k] === 'object' ? a[k] : {}; a = a[k]; }); if (v === null || v === undefined) delete a[ks[ks.length - 1]]; else a[ks[ks.length - 1]] = v; };
  function ref(path) {
    path = path || '';
    const snap = () => { const v = clone(getP(load().rt, path)); return { val: () => v === undefined ? null : v, exists: () => v !== undefined, key: path.split('/').pop(), forEach: f => { Object.entries(v || {}).forEach(([k, x]) => f({ key: k, val: () => x })); } }; };
    return {
      once: () => Promise.resolve(snap()), get: () => Promise.resolve(snap()),
      on(ev, cb) { setTimeout(() => cb(snap()), 10); return cb; }, off() {},
      set(v) { const d = load(); setP(d.rt, path, clone(v)); store(d); return Promise.resolve(); },
      update(v) { const d = load(); Object.entries(v).forEach(([k, x]) => setP(d.rt, path + '/' + k, clone(x))); store(d); return Promise.resolve(); },
      push(v) { const k = 'p' + Date.now() + Math.random().toString(36).slice(2, 6); const r = ref(path + '/' + k); if (v === undefined) return r; return r.set(v).then(() => r); },
      transaction(fn) { const d = load(); const nv = fn(clone(getP(d.rt, path))); if (nv !== undefined) setP(d.rt, path, clone(nv)); store(d); return Promise.resolve({ committed: true, snapshot: snap() }); },
      child: p => ref(path + '/' + p), orderByChild() { return this; }, limitToLast() { return this; },
    };
  }
  const app = { auth: () => auth, firestore, database: () => ({ ref }) };
  window.firebase = {
    apps: [], initializeApp() { this.apps.push(app); return app; }, app: () => app,
    auth: Object.assign(() => auth, { GoogleAuthProvider: function () {} }),
    firestore: Object.assign(() => firestore(), { FieldValue: { serverTimestamp: () => Date.now() } }),
    database: Object.assign(() => ({ ref }), { ServerValue: { get TIMESTAMP() { return Date.now(); } } }),
  };
})();
