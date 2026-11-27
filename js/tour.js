/* Cakebread Science — Site-wide interactive Spotlight Guided Tours (/js/tour.js, 27 Nov 2026).
   Dimmed backdrop + bright spotlight cutout + pointing arrow + non-ignorable step card (must step through or tap Skip).
   Shows once per page (localStorage 'cbs.tour.v1'); always ends/dismisses with a reminder pointing to ❓ Guide (/how-to-use/).
   Never runs on /admin/, projector decks (deck.html), iframes, print, or ?notour=1.
   Auto-starts only for signed-in non-admin students (append ?tour=1 on any supported page to preview/replay anytime). */
(function () {
  if (window.CBSTour) return;
  var STORE = 'cbs.tour.v1';
  var DEFAULT_ADMINS = ['culkincakebread@gmail.com', 'stem@elevenschool.com'];
  var params = new URLSearchParams(location.search || '');
  var FORCE = params.get('tour') === '1';
  var DISABLED = params.get('notour') === '1';

  try { if (window.self !== window.top) return; } catch (e) { return; }
  if (DISABLED) return;

  var path = (location.pathname || '/').replace(/\/index\.html$/i, '/').toLowerCase();
  if (/^\/admin(\/|$)/.test(path) || /\/deck\.html$/i.test(path) || /^\/how-to-use(\/|$)/.test(path)) return;

  function readDone() {
    try { return JSON.parse(localStorage.getItem(STORE) || '{}') || {}; } catch (e) { return {}; }
  }
  function markDone(id) {
    try { var d = readDone(); d[id] = Date.now(); localStorage.setItem(STORE, JSON.stringify(d)); } catch (e) {}
  }

  /* Page tour definitions: strictly 3–4 short, plain-English steps per page */
  var TOURS = {
    today: {
      waitFor: '#upNextCard, #teacherCard, #quickGo .qgo',
      steps: [
        { sel: '#quickGo .qgo', title: '⚡ One-click revision', body: 'Not sure what to do? Tap this button anytime — it automatically launches your homework first, or the best topic your class has covered.' },
        { sel: '#teacherCard', title: '📌 From your teacher', body: 'Your homework and upcoming tests live together here. Homework missions track live as you answer and tell you clearly when you\'re finished.' },
        { sel: '#upNextCard', title: '🎯 Up next for you', body: 'Your quick daily loop (Mission, Flashcards, Breadventure Land) plus your top 3 highest-value spec points to secure next.' },
        { sel: '#progCard', title: '📊 Progress & Covered in class', body: 'Green bars show spec points you\'ve proved on two different days. Tap "Covered in class" at the bottom to expand topics your class has finished.' }
      ]
    },
    home: {
      waitFor: '.quest, #resources',
      steps: [
        { sel: '#cbs-hw-banner:not([hidden])', title: '🏠 Your Student Home', body: 'Jump straight back to your personal dashboard (homework, tests and one-click revision) anytime from here.' },
        { sel: '.quest', title: '⚔️ Cakebread Questing', body: 'Answer IGCSE spec questions to power up your adventurer and team up with your class to defeat bosses on Breadventure Land.' },
        { sel: '#resources .res', title: '📚 Everything in one account', body: 'Practice Questions, Flashcards, Study Guides and Spec Trackers all share your progress — use whichever tool fits what you need.' }
      ]
    },
    cakelab: {
      waitFor: '#tMap',
      steps: [
        { sel: '#tMap', title: '🗺️ Breadventure Land', body: 'Your class\'s shared map! Use moves to explore, grab treasure chests and camp at bosses for tonight\'s fight.' },
        { sel: '#tMission', title: '⚔️ Today\'s mission', body: '10 questions against a science misconception. Getting questions right on two different days secures spec points — and your first revision each day gives +1 map move.' },
        { sel: '#tCards', title: '🃏 Flashcards count too', body: 'Reviewing flashcards refills your Health and Mana and counts up to half of securing each spec point.' },
        { sel: '#sci', title: '💪 Spec points power you up', body: 'Biology boosts Health, Chemistry boosts Magic, Physics boosts Strength — and securing points raises your level cap.' }
      ]
    },
    map: {
      waitFor: '#hud, #map',
      steps: [
        { sel: '#hud', title: '🗺️ Moves, Health & Mana', body: 'You get 2 fresh moves each day plus +1 move for your first revision. Revision also tops up your Health and Mana automatically.' },
        { sel: '#map', title: '👣 Tap glowing squares', body: 'Move around the map to clear the fog, open treasure chests, or reach a boss and camp there before midnight.' },
        { sel: '#questbar, #panel', title: '🏆 Work as a class', body: 'Everyone fights the same bosses together — check here to see who\'s camped and what\'s next.' }
      ]
    },
    practice: {
      waitFor: '#sugg, #topics',
      steps: [
        { sel: '#setwork .setw', title: '📌 Teacher homework', body: 'Any unfinished homework appears right here at the top — tap to launch with live progress tracking.' },
        { sel: '#sugg', title: '⚡ Suggested next', body: 'Fastest way to pick what will secure spec points quickest. Same questions and progress as Questing, with no game on top.' },
        { sel: '#topics', title: '🔬 Pick any topic or spec point', body: 'Expand "Spec points" on any row to drill one exact point or jump straight to its Study Guide.' }
      ]
    },
    flashcards: {
      waitFor: '#deckList, #totalDueToday',
      steps: [
        { sel: '#taughtToggleWrap, #totalDueToday', title: '🃏 Covered in class by default', body: 'Only topics your class has covered show up by default. Tick "Study ahead" anytime if you want to revise future topics.' },
        { sel: '#quickActs, #deckList', title: '⚡ Study all due (mixed)', body: 'Mixing due cards across subjects feels slightly harder — and memory research shows that extra effort makes exam recall stick far longer.' },
        { sel: '#topicBrowser', title: '🎯 Rate yourself honestly', body: 'Use 1–4 after flipping. Cards rated Good or Easy on two different days count up to half of securing a spec point!' }
      ]
    },
    tracker: {
      waitFor: '#trSum, #tracker',
      steps: [
        { sel: '#trSum', title: '📋 Proved vs Confident', body: 'Green means you\'ve proved a spec point on two different days in Practice or Questing — not just ticked a box.' },
        { sel: '#trFilters', title: '🔍 Catch blind spots', body: 'Rate how confident you feel on each point, then use the filters to spot points you rated "Confident" but haven\'t proved yet.' },
        { sel: '#tracker .topic, #tracker', title: '🎓 Tap any spec point', body: 'Click a point to open its matching Study Guide, Worksheet, Flashcards, Practice quiz and Examiner Key Words.' }
      ]
    },
    study: {
      waitFor: '.study-nav, .snav, section.step',
      steps: [
        { sel: '.study-nav, .snav', title: '🎓 Step-by-step Study Guide', body: 'Work through one short chunk at a time, or tap "All on one page" to view the whole topic.' },
        { sel: '.micro, .box, section.step', title: '✅ Quick checks & Examiner tips', body: 'Test yourself on every quick check before moving on — pulling answers from memory locks them in far better than re-reading.' },
        { sel: '.next-hub', title: '🚀 Lock it in next', body: 'When you finish the notes, jump straight into Flashcards, Practice or Questing on this exact topic.' }
      ]
    }
  };

  function detectTour() {
    if (path === '/today/') return 'today';
    if (path === '/') return 'home';
    if (path === '/interactive/spec-quiz/adventurer-home.html') return 'cakelab';
    if (path === '/interactive/spec-quiz/adventurer-map.html') return 'map';
    if (path === '/interactive/spec-quiz/practice.html') return 'practice';
    if (path === '/flashcards/') return 'flashcards';
    if (/^\/specifications\/(biology|chemistry|physics)\.html$/.test(path)) return 'tracker';
    if (/^\/interactive\/lessons\//.test(path) && (document.querySelector('.study-nav, .snav, section.step') || document.querySelector('script[src*="study.js"]'))) return 'study';
    return null;
  }

  function pickEl(selStr) {
    if (!selStr) return null;
    var parts = selStr.split(',');
    for (var i = 0; i < parts.length; i++) {
      try {
        var el = document.querySelector(parts[i].trim());
        if (el) {
          var r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden') return el;
        }
      } catch (e) {}
    }
    return null;
  }

  function hasBlockingModal() {
    return !!document.querySelector('#cbs-auth-gate, .cbs-year-bg, .advstory');
  }

  var styled = false;
  function ensureStyle() {
    if (styled) return;
    styled = true;
    var s = document.createElement('style');
    s.id = 'cbs-tour-css';
    s.textContent =
      '#cbs-tour-block{position:fixed;inset:0;z-index:2147483500;background:transparent;cursor:default}' +
      '#cbs-tour-spot{position:fixed;z-index:2147483501;pointer-events:none;border:3px solid #facc15;border-radius:8px;box-shadow:0 0 0 9999px rgba(10,10,14,.74),0 0 0 6px rgba(250,204,21,.35);transition:top .24s ease,left .24s ease,width .24s ease,height .24s ease}' +
      '#cbs-tour-card{position:fixed;z-index:2147483502;width:min(360px,calc(100vw - 24px));background:#fff;color:#111;border:3px solid #111;box-shadow:0 7px 0 #111;padding:15px 16px 14px;font-family:Barlow,Arial,sans-serif;line-height:1.42;border-radius:4px}' +
      '#cbs-tour-card h3{font:900 22px/1.05 "Barlow Condensed","Arial Narrow",Arial,sans-serif;text-transform:uppercase;margin:0 0 6px;color:#111}' +
      '#cbs-tour-card p{font-size:15px;color:#222;margin:0 0 12px}' +
      '#cbs-tour-card .tf{display:flex;align-items:center;gap:6px;flex-wrap:wrap}' +
      '#cbs-tour-card .stepn{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#666;margin-right:auto}' +
      '#cbs-tour-card button{font:700 14px Barlow,Arial,sans-serif;border:2px solid #111;padding:5px 11px;cursor:pointer;border-radius:4px;background:#fff;color:#111}' +
      '#cbs-tour-card button:hover{background:#f6f4ee}' +
      '#cbs-tour-card button.go{background:#facc15;color:#111;font-weight:800}#cbs-tour-card button.go:hover{background:#fde047}' +
      '#cbs-tour-card button.skip{border:0;background:none;color:#666;text-decoration:underline;padding:4px 6px;font-size:13px}#cbs-tour-card button.skip:hover{color:#111;background:none}' +
      '#cbs-tour-arrow{position:absolute;width:14px;height:14px;background:#fff;border-left:3px solid #111;border-top:3px solid #111;transform:rotate(45deg)}' +
      '#cbs-tour-arrow.up{top:-9px}' +
      '#cbs-tour-arrow.down{bottom:-9px;transform:rotate(225deg)}' +
      '#cbs-tour-remind{position:fixed;top:60px;right:14px;z-index:2147483503;max-width:340px;background:#111;color:#eeeae0;border:2px solid #facc15;box-shadow:0 5px 0 rgba(0,0,0,.35);padding:12px 14px;border-radius:6px;font-family:Barlow,Arial,sans-serif;font-size:14px;line-height:1.4}' +
      '#cbs-tour-remind b{color:#facc15;display:block;font:900 17px/1.1 "Barlow Condensed",Arial,sans-serif;text-transform:uppercase;margin-bottom:3px}' +
      '#cbs-tour-remind .ra{margin-top:8px;display:flex;gap:8px;align-items:center}' +
      '#cbs-tour-remind a{background:#facc15;color:#111;text-decoration:none;font-weight:800;padding:4px 10px;border-radius:4px;font-size:13px}' +
      '#cbs-tour-remind button{background:none;border:1px solid #666;color:#ccc;padding:3px 9px;border-radius:4px;cursor:pointer;font:inherit;font-size:12.5px;margin-left:auto}' +
      '@media print{#cbs-tour-block,#cbs-tour-spot,#cbs-tour-card,#cbs-tour-remind{display:none!important}}';
    (document.head || document.documentElement).appendChild(s);
  }

  function showReminder() {
    var old = document.getElementById('cbs-tour-remind'); if (old) old.remove();
    var box = document.createElement('div');
    box.id = 'cbs-tour-remind';
    box.setAttribute('role', 'status');
    box.innerHTML = '<b>❓ Need a reminder later?</b>You can read the full student guide or replay any page tour anytime via <b>❓ Guide</b> at the top.<div class="ra"><a href="/how-to-use/">Open Guide →</a><button type="button" id="cbsTourRmX">Got it</button></div>';
    document.body.appendChild(box);
    var kill = function () { if (box.parentNode) box.remove(); };
    var xb = box.querySelector('#cbsTourRmX'); if (xb) xb.onclick = kill;
    setTimeout(kill, 7500);
  }

  var active = false;
  function runTour(id) {
    if (active) return;
    var def = TOURS[id]; if (!def) return;
    var steps = def.steps.map(function (st) { return { st: st, el: pickEl(st.sel) }; }).filter(function (x) { return !!x.el; });
    if (!steps.length) return;
    active = true;
    ensureStyle();

    var block = document.createElement('div'); block.id = 'cbs-tour-block';
    var spot = document.createElement('div'); spot.id = 'cbs-tour-spot';
    var card = document.createElement('div'); card.id = 'cbs-tour-card';
    card.setAttribute('role', 'dialog'); card.setAttribute('aria-modal', 'true');
    document.body.append(block, spot, card);

    var idx = 0;
    function place() {
      if (!active) return;
      var cur = steps[idx];
      var el = pickEl(cur.st.sel) || cur.el;
      var r = el.getBoundingClientRect();
      var pad = 6;
      var top = Math.max(4, r.top - pad), left = Math.max(4, r.left - pad);
      var w = Math.min(window.innerWidth - 8 - left, r.width + pad * 2);
      var h = Math.min(window.innerHeight - 8 - top, r.height + pad * 2);
      spot.style.top = top + 'px'; spot.style.left = left + 'px';
      spot.style.width = Math.max(24, w) + 'px'; spot.style.height = Math.max(24, h) + 'px';

      var cw = card.offsetWidth || 340, ch = card.offsetHeight || 170;
      var spaceBelow = window.innerHeight - (top + h);
      var below = spaceBelow >= ch + 22 || top < ch + 22;
      var cTop = below ? Math.min(window.innerHeight - ch - 12, top + h + 14) : Math.max(12, top - ch - 14);
      var cx = left + w / 2;
      var cLeft = Math.max(12, Math.min(window.innerWidth - cw - 12, cx - cw / 2));
      card.style.top = cTop + 'px'; card.style.left = cLeft + 'px';

      var arr = card.querySelector('#cbs-tour-arrow');
      if (arr) {
        arr.className = below ? 'up' : 'down';
        var ax = Math.max(18, Math.min(cw - 32, cx - cLeft - 7));
        arr.style.left = ax + 'px';
      }
    }

    function renderStep() {
      var cur = steps[idx];
      var el = pickEl(cur.st.sel) || cur.el;
      try { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
      var last = idx === steps.length - 1;
      card.innerHTML = '<div id="cbs-tour-arrow" class="up"></div>'
        + '<h3>' + cur.st.title + '</h3>'
        + '<p>' + cur.st.body + '</p>'
        + '<div class="tf">'
        + '<span class="stepn">Step ' + (idx + 1) + ' of ' + steps.length + '</span>'
        + '<button type="button" class="skip" id="cbsTourSkip">Skip tour</button>'
        + (idx > 0 ? '<button type="button" id="cbsTourPrev">← Back</button>' : '')
        + '<button type="button" class="go" id="cbsTourNext">' + (last ? 'Got it ✓' : 'Next →') + '</button>'
        + '</div>';
      card.querySelector('#cbsTourSkip').onclick = close;
      if (idx > 0) card.querySelector('#cbsTourPrev').onclick = function () { idx--; renderStep(); };
      card.querySelector('#cbsTourNext').onclick = function () { if (last) close(); else { idx++; renderStep(); } };
      place();
      setTimeout(place, 260);
      setTimeout(place, 520);
    }

    function onKey(e) {
      if (!active) return;
      if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); var b = card.querySelector('#cbsTourNext'); if (b) b.click(); }
      else if (e.key === 'ArrowLeft' && idx > 0) { e.preventDefault(); idx--; renderStep(); }
    }
    function close() {
      active = false;
      markDone(id);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
      document.removeEventListener('keydown', onKey);
      [block, spot, card].forEach(function (n) { if (n && n.parentNode) n.remove(); });
      if (FORCE) {
        try {
          var u = new URL(location.href); u.searchParams.delete('tour');
          history.replaceState(null, '', u.pathname + u.search + u.hash);
        } catch (e) {}
      }
      showReminder();
    }

    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    document.addEventListener('keydown', onKey);
    renderStep();
  }

  function scheduleStart(id) {
    var def = TOURS[id]; if (!def) return;
    if (!FORCE && readDone()[id]) return;
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      if (tries > 50) { clearInterval(iv); return; }
      if (hasBlockingModal()) return;
      if (!pickEl(def.waitFor)) return;
      clearInterval(iv);
      setTimeout(function () { if (!hasBlockingModal()) runTour(id); }, 250);
    }, 500);
  }

  function boot() {
    var id = detectTour();
    if (!id) return;
    if (FORCE) { scheduleStart(id); return; }
    if (readDone()[id]) return;

    // On pages with Firebase Auth, only auto-run for signed-in non-admin students (never interrupt admins!)
    var isAdmin = function (email) { return !!(email && (window.ADMIN_EMAILS || DEFAULT_ADMINS).indexOf(email) >= 0); };
    if (window.firebase && firebase.auth && firebase.apps && firebase.apps.length) {
      var doneAuth = false;
      firebase.auth().onAuthStateChanged(function (u) {
        if (doneAuth || !u || isAdmin(u.email)) return;
        doneAuth = true;
        scheduleStart(id);
      });
    } else if (id === 'study') {
      // Student Study Guides don't always load firebase-auth; safe to run once per browser
      scheduleStart(id);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 350); });
  else setTimeout(boot, 350);

  window.CBSTour = {
    start: function (id) { FORCE = true; runTour(id || detectTour()); },
    reset: function () { try { localStorage.removeItem(STORE); } catch (e) {} },
    detect: detectTour
  };
})();
