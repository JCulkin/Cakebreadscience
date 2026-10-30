// Physics Long Answer Practice — saving and tracking.
//
// Uses the same Firebase project and Google sign-in as the spec tracker and flashcards.
// Data is stored on the student's own user document:
//
//   users/{uid}.longAnswers.physics.{questionId} = {
//     first, firstAt,        // first answer (locked once the mark scheme is revealed)
//     add, addAt,            // additional answer: what the student learned
//     revealedAt,            // when the mark scheme was first revealed
//     ticks: { "1": 1, "2": 2, ... },   // 1 = in first answer, 2 = learned, 0 = not ticked
//     firstScore, learnedScore, max,
//     updatedAt
//   }
//   users/{uid}.longAnswersSummary.physics = { attempted, learnedPoints, firstMarks, possibleMarks, updatedAt }
//   users/{uid}.lastAccess
//
// When nobody is signed in, answers are kept in this browser only (localStorage).
// On sign-in, those answers are merged into the account (newest version of each question wins).

window.LongAnswerStore = (() => {
  const SUBJECT = "physics";
  const ANON_KEY = "longanswer-v1-physics-anon";
  const keyFor = uid => uid ? `longanswer-v1-physics-${uid}` : ANON_KEY;

  let data = {};
  let auth = null, db = null, user = null;
  let firebaseReady = false;
  let status = "local";            // local | loading | saving | saved | error
  let pending = new Set();
  let timer = null;
  const listeners = [];

  const emit = () => listeners.forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
  const setStatus = s => { status = s; emit(); };

  // ---------- local ----------
  const readLocal = uid => {
    try { return JSON.parse(localStorage.getItem(keyFor(uid)) || "{}") || {}; }
    catch (e) { return {}; }
  };
  const writeLocal = () => {
    try { localStorage.setItem(keyFor(user && user.uid), JSON.stringify(data)); } catch (e) { /* storage full or blocked */ }
  };

  // ---------- scoring ----------
  // ticks: { label: 0|1|2 }. withLearned = false counts only first-answer ticks.
  const score = (q, ticks, withLearned) => {
    ticks = ticks || {};
    const groups = q.groups || {};
    let loose = 0;
    const byGroup = {};
    q.scheme.forEach(r => {
      const st = ticks[r[0]] || 0;
      if (!(st === 1 || (withLearned && st === 2))) return;
      const g = r[3];
      if (g && groups[g] !== undefined) byGroup[g] = (byGroup[g] || 0) + r[2];
      else loose += r[2];
    });
    let total = loose;
    for (const g in byGroup) total += Math.min(byGroup[g], groups[g]);
    return Math.min(total, q.max);
  };

  const findQuestion = id => {
    if (typeof TOPICS === "undefined") return null;
    for (const t of TOPICS) for (const q of t.questions) if (q.id === id) return q;
    return null;
  };

  const summary = () => {
    let attempted = 0, learnedPoints = 0, firstMarks = 0, possibleMarks = 0;
    for (const id in data) {
      const e = data[id];
      if (!e.revealedAt) continue;
      attempted++;
      firstMarks += e.firstScore || 0;
      possibleMarks += e.max || 0;
      learnedPoints += Object.values(e.ticks || {}).filter(v => v === 2).length;
    }
    return { attempted, learnedPoints, firstMarks, possibleMarks, updatedAt: new Date().toISOString() };
  };

  // ---------- remote ----------
  const flush = async () => {
    timer = null;
    if (!firebaseReady || !user || !db || pending.size === 0) return;
    const ids = [...pending];
    pending = new Set();
    const subjectMap = {};
    ids.forEach(id => { subjectMap[id] = data[id]; });
    setStatus("saving");
    try {
      await db.collection("users").doc(user.uid).set({
        email: user.email || null,
        displayName: user.displayName || null,
        lastAccess: new Date().toISOString(),
        longAnswers: { [SUBJECT]: subjectMap },
        longAnswersSummary: { [SUBJECT]: summary() }
      }, { merge: true });
      setStatus(pending.size ? "saving" : "saved");
    } catch (err) {
      console.error("Long answer save failed", err);
      ids.forEach(id => pending.add(id));   // try again on the next change
      setStatus("error");
    }
  };
  const queue = id => {
    pending.add(id);
    if (!user) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(flush, 800);
  };

  const loadRemote = async uid => {
    const snap = await db.collection("users").doc(uid).get();
    const d = snap.exists ? snap.data() : {};
    return (d.longAnswers && d.longAnswers[SUBJECT]) || {};
  };

  const onUser = async u => {
    user = u;
    if (!u) {
      data = readLocal(null);
      setStatus("local");
      return;
    }
    setStatus("loading");
    try {
      const remote = await loadRemote(u.uid);
      const merged = { ...remote };
      const sources = [readLocal(u.uid), readLocal(null)];
      const toPush = [];
      sources.forEach(src => {
        for (const id in src) {
          if (!merged[id] || (src[id].updatedAt || 0) > (merged[id].updatedAt || 0)) {
            merged[id] = src[id];
            toPush.push(id);
          }
        }
      });
      data = merged;
      writeLocal();
      try { localStorage.removeItem(ANON_KEY); } catch (e) {}
      if (toPush.length) { toPush.forEach(id => pending.add(id)); await flush(); }
      else setStatus("saved");
    } catch (err) {
      console.error("Long answer load failed", err);
      data = { ...readLocal(u.uid), ...readLocal(null) };
      setStatus("error");
    }
  };

  // ---------- public ----------
  const api = {
    get status() { return status; },
    get user() { return user; },
    get available() { return firebaseReady; },
    get isAdmin() { return !!(user && Array.isArray(window.ADMIN_EMAILS) && window.ADMIN_EMAILS.includes(user.email)); },
    get all() { return data; },
    score,
    findQuestion,

    entry(id) { return data[id] || {}; },

    update(id, patch) {
      const q = findQuestion(id);
      const e = { ...(data[id] || {}), ...patch, updatedAt: Date.now() };
      if (q) {
        e.max = q.max;
        e.firstScore = score(q, e.ticks, false);
        e.learnedScore = score(q, e.ticks, true);
      }
      data[id] = e;
      writeLocal();
      queue(id);
      emit();
      return e;
    },

    onChange(fn) { listeners.push(fn); },

    async signIn() {
      if (!auth) return;
      try { await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); }
      catch (e) { console.error("Sign-in failed", e); }
    },
    async signOut() {
      if (!auth) return;
      if (pending.size) await flush();
      await auth.signOut();
    },

    // For the learning bank: another student's answers (admins only, subject to Firestore rules).
    async loadFor(uid) { return loadRemote(uid); },
    async listStudents() {
      const snap = await db.collection("users").get();
      const out = [];
      snap.forEach(d => {
        const v = d.data();
        if (v.longAnswers && v.longAnswers[SUBJECT]) {
          out.push({ uid: d.id, name: v.displayName || v.email || d.id, email: v.email || "" });
        }
      });
      return out.sort((a, b) => a.name.localeCompare(b.name));
    },

    init() {
      data = readLocal(null);
      const cfg = window.firebaseConfig;
      if (!(cfg && cfg.apiKey && window.firebase && firebase.auth && firebase.firestore)) {
        setStatus("local");
        return;
      }
      try {
        if (!firebase.apps.length) firebase.initializeApp(cfg);
        auth = firebase.auth();
        db = firebase.firestore();
        firebaseReady = true;
        auth.onAuthStateChanged(onUser);
      } catch (e) {
        console.error("Firebase init failed", e);
        setStatus("local");
      }
      window.addEventListener("beforeunload", () => { if (pending.size && user) flush(); });
    }
  };
  return api;
})();
