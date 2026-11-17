/* Cakebread Questing: shared bits for every Questing page.
   Top bar (with Google sign-in), the Adventurer's stats, story pop-ups and the 12×12 pixel icons.
   Real progress (XP, secured spec points, coins, loot, missions today) comes from questing-engine.js (QE), which
   saves to the student's account. The map state (moves, plan, position, health, brews, bosses) lives in the shared
   Breadventure Land (bland.js, Realtime Database); ADV.S keeps a copy in this browser so every page can draw at once.
   Needs, first: questing-engine.js (and its scripts) and adventurer-pixel.js. */
const ADV = (() => {
  const KEY = 'cbs.adventurer.state';
  /* Totals of non-Units spec points per science (Double Award): used for progress bars. */
  const TOTAL = { b: 134, c: 130, p: 139 };
  const SCI = { b: 'Biology', c: 'Chemistry', p: 'Physics' };
  const STARTER = { head: 'paperhat', top: 'jumper', bottom: 'joggers', shoes: 'oddsocks', lhand: 'crisps', rhand: 'ruler' };
  const DEF = () => ({
    v: 2, day: 1, health: null,
    moves: 6, plan: [], at: '7,4', visited: ['7,4'],   // map: 6 moves on day one, then 2 a day (+1 for the day's first mission)
    brews: {}, missionsSeen: 0, reportSeen: 0, report: null, chapter: 1, storySeen: false, rescueSeen: false,
    mana: 0, bonusDay: null, shield: false,   // mana for spells; the day the +1 revision move was last given; Shield spell for tonight
  });
  const load = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  /* real values live in the engine; the map state is plain data */
  function attach(o) {
    ['xp', 'secured', 'coins', 'bag', 'lastLoot', 'missionsToday'].forEach(k => delete o[k]);   // left over from the mock-up
    const def = (k, get, set) => Object.defineProperty(o, k, { get, set: set || (() => {}), enumerable: false, configurable: true });
    def('xp', () => QE.prog.xp);
    def('secured', () => QE.securedBySci());
    def('coins', () => QE.game.coins || 0, v => { QE.game.coins = v; QE.gameChanged(); });
    def('bag', () => QE.game.bag || [], v => { QE.game.bag = v; QE.gameChanged(); });
    def('lastLoot', () => QE.game.lastLoot, v => { QE.game.lastLoot = v; QE.gameChanged(); });
    def('missionsToday', () => QE.missionsToday());
    return o;
  }
  let stored = load(KEY);
  if (stored && stored.v !== 2) stored = null;   // the mock-up's pretend game: start again from the real numbers
  let S = attach(Object.assign(DEF(), stored || {}));
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  /* 17 Nov fix: this copy is one per browser, so on a shared school computer the next student saw the last one's moves
     ("No moves left today") and lost their +1 revision move. It now belongs to one account and starts fresh for another. */
  function claim() {
    if (!QE.known || !QE.user || S.owner === QE.user.uid) return;
    const keep = S.owner ? {} : { storySeen: S.storySeen, rescueSeen: S.rescueSeen, seenRep: S.seenRep, bossSeen: S.bossSeen };   // an older copy with no owner: probably theirs
    Object.keys(S).forEach(k => delete S[k]); Object.assign(S, DEF(), keep, { owner: QE.user.uid }); save();
  }
  claim(); QE.onChange(claim);
  const reset = () => { try { localStorage.removeItem(KEY); } catch (e) {} S = attach(DEF()); };

  /* look, name, gear (saved by the creator and wardrobe pages; the engine copies them into the account) */
  const look = () => load('cbs.adventurer.base') || PIXEL.DEFAULT;
  const hasLook = () => !!load('cbs.adventurer.base');
  const nick = () => { const n = localStorage.getItem('cbs.adventurer.nick'); return n && !QE.checkName(n) ? n : QE.user ? QE.googleName() : 'Adventurer'; };
  const eq = () => load('cbs.adventurer.eq') || Object.assign({}, STARTER);

  /* stats = quiz half (secured spec points) + level + gear. Level comes from XP, capped by spec points secured. */
  const LV = { str: 2, hp: 3, mag: 1 };
  const GEAR = 2;
  const BASE = { str: 8, hp: 15 };   // every adventurer starts with this, so a brand-new student can still win small fights
  const securedTotal = () => { const s = S.secured; return s.p + s.b + s.c; };
  const levelCap = () => 2 + Math.floor(securedTotal() / 8);
  const xpFor = l => 100 * l * (l - 1) / 2;
  const rawLevel = () => { let l = 1; while (xpFor(l + 1) <= S.xp) l++; return l; };
  const level = () => Math.min(rawLevel(), levelCap());
  const stats = () => {
    const l = level(), sec = S.secured;
    const s = { l, str: BASE.str + sec.p + LV.str * l + GEAR, hp: BASE.hp + sec.b + LV.hp * l, mag: sec.c + LV.mag * l };
    if (S.health == null || S.health > s.hp) S.health = s.hp;
    s.mana = 10 + s.mag;   // most mana a student can hold
    if (S.mana == null) S.mana = 0;
    if (S.mana > s.mana) S.mana = s.mana;
    return s;
  };

  /* ---------- revision → Breadventure Land: Health and mana earned by missions and flashcards wait in the engine's pool
     until a Questing page opens; the day's first revision (mission or today's flashcards) gives +1 move once a day. ---------- */
  const MOVE_CAP = 5;
  function collect() {
    const s = stats(), p = QE.takePool(), g = { hp: 0, mana: 0, move: false };
    if (p.hp) { const b = S.health; S.health = Math.min(s.hp, S.health + p.hp); g.hp = S.health - b; }
    if (p.mana) { const b = S.mana; S.mana = Math.min(s.mana, S.mana + p.mana); g.mana = S.mana - b; }
    if (QE.revisedToday() && S.bonusDay !== QE.TODAY) { S.bonusDay = QE.TODAY; S.moves = Math.min(MOVE_CAP, S.moves + 1); g.move = true; }
    /* the shared Breadventure Land picks these up next time the map opens (it holds the real Health, mana and moves) */
    if (p.hp || p.mana || g.move) { const o = S.out = S.out || { hp: 0, mana: 0, move: 0 }; o.hp += p.hp || 0; o.mana += p.mana || 0; if (g.move) o.move++; }
    if (g.hp || g.mana || g.move || p.hp || p.mana) save();
    return g;
  }
  let gained = { hp: 0, mana: 0, move: false };

  /* ---------- nav bar (one bar: brand, Cakelab, the two big actions, then small links) ---------- */
  const DRAGON = 'Crumbmaw';
  function nav(active) {
    const css = document.createElement('style');
    css.textContent = `body>header{display:none}
.advnav{position:sticky;top:0;z-index:50;background:#151518;border-bottom:3px solid #00a03a;display:flex;align-items:center;gap:6px;padding:7px 12px;overflow-x:auto;scrollbar-width:none;font-family:Barlow,Arial,sans-serif}
.advnav::-webkit-scrollbar{display:none}
.advnav a{text-decoration:none;white-space:nowrap}
.advnav .brand{font:900 21px 'Barlow Condensed',Arial,sans-serif;text-transform:uppercase;color:#eeeae0;letter-spacing:-.5px;margin-right:8px;line-height:1}
.advnav .brand b{color:#00a03a}
.advnav .site{flex:none;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:#eeeae0;border:2px solid #555;margin-right:2px}
.advnav .site:hover{border-color:#facc15}
.advnav .site img{width:26px;height:26px;object-fit:contain;display:block}
.advnav .tab{color:#ccc;font-weight:700;font-size:15px;padding:7px 11px;border-radius:7px;border:2px solid transparent;display:inline-flex;align-items:center;gap:6px}
.advnav .tab:hover{color:#fff;background:#ffffff14}
.advnav .tab.on{background:#eeeae0;color:#111}
.advnav .cta{font-size:17px;padding:8px 15px;color:#111;border:2px solid #111;box-shadow:0 3px 0 #000}
.advnav .cta.mission{background:#facc15}
.advnav .cta.map{background:#4ade80}
.advnav .cta:hover{filter:brightness(1.08);color:#111;background:auto}
.advnav .cta.mission:hover{background:#fde047}.advnav .cta.map:hover{background:#86efac}
.advnav .cta.on{outline:3px solid #fff;outline-offset:2px}
.advnav .dot{background:#e11d48;color:#fff;border-radius:10px;font-size:12px;font-weight:900;padding:0 6px;line-height:18px;animation:advpulse 1.6s infinite}
@keyframes advpulse{50%{transform:scale(1.18)}}
.advnav .sm{font-size:14px;padding:6px 8px}
.advnav .gap{flex:1;min-width:8px}
.advnav .acct{display:flex;gap:6px;align-items:center;white-space:nowrap;padding-left:8px;border-left:1px solid #333;color:#ccc;font-size:14px;font-weight:700}
.advnav .acct button{font:700 14px Barlow,Arial;background:#eeeae0;border:2px solid #111;color:#111;padding:4px 10px;border-radius:7px;cursor:pointer}
.advnav .acct button.out{background:none;border:1px solid #555;color:#aaa;font-size:12px;padding:2px 7px}
.advnav .acct .sv{font-size:11px;color:#888;font-weight:600}
.advnav .soon{background:#111;color:#4ade80;border-radius:10px;font-size:11px;font-weight:900;padding:0 6px;line-height:17px;text-transform:uppercase;letter-spacing:.5px}
@media(max-width:640px){.advnav{gap:4px;padding:6px 8px}.advnav .brand,.advnav .acct .nm,.advnav .acct .sv{display:none}.advnav .tab .lbl{display:none}.advnav .cta .lbl{display:inline}.advnav .cta{font-size:15px;padding:6px 10px}}`;
    document.head.appendChild(css);
    const noMission = !QE.revisedToday();   // the "!" goes once the day's revision is done: a mission or today's flashcards
    const n = document.createElement('nav');
    n.className = 'advnav';
    n.setAttribute('aria-label', 'Cakebread Questing');
    const tab = (k, href, icon, label, cls = '', badge = '') => `<a href="${href}" class="tab ${cls} ${k === active ? 'on' : ''}"${k === active ? ' aria-current="page"' : ''}>${icon}<span class="lbl">${label}</span>${badge}</a>`;
    n.innerHTML = `<a class="site" href="/" title="Cakebread Science home" aria-label="Cakebread Science home"><img src="/img/mascot/head-pixel-hd.webp" alt=""></a>`
      + `<a class="brand" href="index.html" title="Cakebread Questing menu">Cakebread <b>Questing</b></a>`
      + tab('home', 'adventurer-home.html', '🧁', 'Cakelab')
      + tab('mission', 'adventurer-mission.html', '⚔️', 'Mission', 'cta mission', noMission ? '<span class="dot">!</span>' : '')
      + tab('map', 'adventurer-map.html', '🗺️', 'Breadventure Land', 'cta map')
      + tab('cards', '/Flashcards/', '🃏', 'Flashcards')
      + tab('today', '/today/', '📅', 'My day')
      + `<span class="gap"></span>`
      + tab('wardrobe', 'adventurer-wardrobe.html', '👕', 'Wardrobe', 'sm')
      + tab('look', 'adventurer-create.html', '✏️', 'My look', 'sm')
      + `<span class="acct" id="advAcct"></span>`;
    document.body.prepend(n);
    const acct = n.querySelector('#advAcct');
    const draw = () => {
      const u = QE.user;
      if (!QE.online) { acct.innerHTML = '<span class="sv">Offline · saved in this browser</span>'; return; }
      if (!u && !QE.known) { acct.innerHTML = ''; return; }
      if (!u) { acct.innerHTML = `<span class="sv">Not signed in</span><button type="button" id="advIn">Sign in</button>`; acct.querySelector('#advIn').onclick = () => QE.signIn().catch(e => { if (e && e.code !== 'auth/popup-closed-by-user') alert('Sign-in did not work: ' + (e.message || e)); }); return; }
      const st = { saving: 'Saving…', saved: 'Saved ✓', error: 'Not saved', loading: 'Loading…' }[QE.status] || '';
      acct.innerHTML = `<span class="sv">${st}</span><span class="nm">${(u.displayName || 'Student').split(' ')[0]}</span><button type="button" class="out" id="advOut">Sign out</button>`;
      acct.querySelector('#advOut').onclick = () => QE.signOut();
    };
    draw(); QE.onChange(draw);
    gained = collect();
    if (gained.hp || gained.mana || gained.move) {
      const t = document.createElement('div');
      t.setAttribute('role', 'status');
      t.style.cssText = 'position:fixed;left:50%;bottom:18px;transform:translateX(-50%);background:#111;color:#fff;padding:9px 16px;border-radius:999px;font:700 15px Barlow,Arial;z-index:150;box-shadow:0 3px 0 #000;max-width:92vw;text-align:center;transition:opacity .5s';
      t.textContent = 'From your revision: ' + [gained.hp && `❤ +${gained.hp} Health`, gained.mana && `🔮 +${gained.mana} mana`, gained.move && '+1 move on Breadventure Land'].filter(Boolean).join(' · ');
      document.body.appendChild(t); setTimeout(() => { t.style.opacity = 0; setTimeout(() => t.remove(), 600); }, 4200);
    }
  }

  /* ---------- story pop-ups (chapter 1: the Professor is taken; the rescue) ---------- */
  function storyModal(html, btn, onClose) {
    const css = document.getElementById('advStoryCss') || Object.assign(document.createElement('style'), { id: 'advStoryCss', textContent: `.advstory{position:fixed;inset:0;background:#000b;z-index:200;display:flex;align-items:center;justify-content:center;padding:16px}
.advstory .bx{background:#fffaf0;border:4px solid #111;box-shadow:8px 8px 0 #0008;max-width:600px;width:100%;max-height:90vh;overflow:auto;padding:20px 22px;font-family:Barlow,Arial,sans-serif}
.advstory .ch{font-weight:700;letter-spacing:2px;font-size:12px;text-transform:uppercase;color:#b45309}
.advstory h2{font:900 30px 'Barlow Condensed',Arial;text-transform:uppercase;line-height:1;margin:2px 0 10px}
.advstory .pics{display:flex;align-items:flex-end;justify-content:center;gap:14px;background:linear-gradient(#cfe8f7 0 60%,#eef2f7 60%);border:2px solid #111;padding:12px;margin-bottom:12px}
.advstory .pics img{image-rendering:pixelated}
.advstory p{font-size:17px;margin:8px 0;line-height:1.45}
.advstory .go{display:block;width:100%;margin-top:14px;background:#facc15;border:2px solid #111;box-shadow:0 3px 0 #000;font:700 19px Barlow,Arial;padding:10px;cursor:pointer}
.advstory .mk{margin-top:10px;font-size:12px;color:#777;text-align:center}.advstory .mk button{font:inherit;background:none;border:1px solid #aaa;padding:2px 6px;cursor:pointer}` });
    document.head.appendChild(css);
    const m = document.createElement('div');
    m.className = 'advstory'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
    m.innerHTML = `<div class="bx">${html}<button class="go">${btn}</button></div>`;
    document.body.appendChild(m);
    const close = () => { m.remove(); onClose && onClose(); };
    m.querySelector('.go').onclick = close;
    m.querySelector('.go').focus();
    return m;
  }
  function storyIntro(onClose) {
    const m = storyModal(`<div class="ch">Chapter 1</div><h2>The Professor is missing</h2>
      <div class="pics"><img src="${icon('crumbs')}" width="60" alt=""><img src="${icon('prof')}" width="110" alt="The Professor" style="opacity:.35;filter:grayscale(1)"><img src="${icon('dragonzz')}" width="110" alt="${DRAGON} the dragon"></div>
      <p>You arrive at the <b>Cakelab</b> and it's empty. The Professor's coffee is still warm. There are scorch marks on the ceiling and a trail of <b>cake crumbs</b> leading north.</p>
      <p><b>${DRAGON}</b>, a dragon with a very sweet tooth, has carried the Professor off to its lair in the Cold Store Hills and locked him in a cage. It handed one piece of the cage key to each of its three guards: <b>the Spore Lord</b>, <b>Granitus the Stone Golem</b> and <b>the Acid Hydra</b>.</p>
      <p>No one can beat them alone. <b>Everyone who plays</b> has to win back all three key pieces to free the Professor. Revise to get stronger, then follow the crumbs.</p>`,
      'Follow the crumbs →', () => { S.storySeen = true; save(); onClose && onClose(); });
    return m;
  }
  function storyRescue(onClose) {
    return storyModal(`<div class="ch">Chapter 1 complete</div><h2>The Professor is free!</h2>
      <div class="pics"><img src="${icon('prof')}" width="120" alt="The Professor"></div>
      <p>With all three key pieces the cage clicks open. ${DRAGON} snores on. The Professor dusts off his sprinkles, straightens his lab coat and says: <i>“About time. I've been in there since Tuesday. Right — back to the Cakelab, there's science to do.”</i></p>
      <p><b>Chapter 2 begins:</b> new monsters are waking in the far corners of Breadventure Land — the <b>Superbug</b> in the Petri Swamp, the <b>Rust Wyrm</b> in Scrap Heap Hills and the <b>Half-Life Horror</b> at the old reactor.</p>`,
      'Back to the Cakelab →', () => { S.rescueSeen = true; save(); onClose && onClose(); });
  }
  /* key pieces = chapter-1 bosses the class has beaten */
  const CH1 = ['2,2', '11,2', '4,7'];
  const keys = () => CH1.filter(k => S.boss && S.boss[k] === 0).length;

  /* ---------- 12×12 pixel icons ---------- */
  const PAL = { K: '#1b1b1f', W: '#fff', R: '#e11d48', G: '#22c55e', g: '#166534', B: '#92400e', b: '#2563eb', Y: '#facc15', y: '#e9d48b',
    S: '#9ca3af', s: '#4b5563', P: '#7c3aed', O: '#f97316', C: '#67e8f9', c: '#bfe9f5', L: '#a3e635', D: '#475569', N: '#78350f', w: '#cbd5e1',
    E: '#7f1d1d', A: '#f59e0b', V: '#c4b5fd', Q: '#fde68a', T: '#0f766e', M: '#a21caf', U: '#57534e', Z: '#d6d3d1',
    h: '#ecfccb', I: '#f9a8d4', H: '#2dd4bf', F: '#fbbf24',
    e: '#fff6e3', J: '#f5b840', X: '#d4902a', p: '#f472b6',
    r: '#9f1239', l: '#fb7185', q: '#4c1d95' };   // r / l = darker / lighter shade of R (recoloured with it)
  const shade = (hex, f) => '#' + [1, 3, 5].map(i => { const v = parseInt(hex.slice(i, i + 2), 16); return Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f).toString(16).padStart(2, '0'); }).join('');
  const ICONS = {
    /* misconception monsters, 20×20 (16 Nov 2026; drawn with the shape kit): R = body colour, r / l = its shades */
    slime: ['....................', '....................', '....................', '......K......K......', '.....K.......R......', '.....RKKKKKKKK......', '....KKlllllllrKK....', '...KllRRRRRRRRlrK...', '...KlRRRRRRRRRRrK...', '..KlRRWWRRRRWWRRrK..', '..KlRRWKRRRRWKRRrK..', '..KlRRRRRRRRRRRRrK..', '..KrRRRRRRRRRRRRrK..', '...KlRRRRRRRRRRrK...', '...KlRRKKKKKKRRrK...', '...KlRRRWKWKRRRrK...', '...KlRrrRRRRrrRrK...', '..KlRrKKrRRrKKrRrK..', '..KrrK..KrrK..KrrK..', '...KK....KK....KK...'],
    bat: ['....................', '....................', '....................', '......K......K......', '......KK....KK......', 'K.....KKK..KrK.....K', 'KKK...K.KKKlrK...KKK', 'KlrKKK.KlllrK.KKKlrK', 'KlRllrKlRRRRrKlllRrK', 'KlRRRrKWWRRWWKlRRRrK', 'KrRrrKlWKRRKWrKrrRrK', '.KrKKKrRRRRRRrKKKrK.', '.KK..KKlRRRRrKK..KK.', '......KrKKKKrK......', '.......KWrrWK.......', '........KKKK........', '....................', '........K..K........', '.........KK.........', '....................'],
    cyclops: ['..........K.........', '..........K.........', '...K..KKKKKKKK..K...', '....KKlllllllrKK....', '....KlRRRKKRRRrK....', '...KlRRKKWWKKRRrK...', '..KlRRKWWWWWWKRRrK..', '..KlRRKWWWKKWKRRrK..', '..KlRKWWWKKKWWKRrK..', '..KlRRKWWKKKWKRRrK..', '..KlRRKWWKKKWKRRrK..', '..KrRRRKKWWKKRRRrK..', '...KrRRRRKKRRRRrK...', '....KrRRRRRRRRrK....', '.....KrKKKKKKrK.....', '.....KKKWKKWKKK.....', '.....KrK....KrK.....', '.....KrK....KrK.....', '....KKKK....KKKK....', '....KKKK....KKKK....'],
    spike: ['....................', '.........KK.........', '.........KK.........', '..K......KK.....KK..', '...KKK..KKKK.KKKK...', '...KrrKKKKKKKKrK....', '....KKlllllllrKK....', '....KlRRRRRRRRrK....', '...KKlWWRRRRWWrKK...', '.KKKKlWKRRRRWKrKKKK.', '.KKKrRRRRRRRRRRrKKK.', '...KKlRRRRRRRRrKK...', '....KlRRRRRRRRrK....', '....KrRKWKWKWRrK....', '....KKrKKKKKKrKK....', '...KrKKKKKKKKKKrK...', '...KK..........KK...', '..K..............K..', '....................', '....................'],
    imp: ['...K............K...', '...KK.........KKK...', '...KrKKKKKKKKKrK....', '....KKKlllllrKKK....', '....KKKRRRRRRKKK....', '....KlWWRRRRWWrK....', '....KlWKRRRRKWrK....', '....KlRRRRRRRRrK....', '....KlRRRRRRRRrK....', '....KrrKKKKKKrrK....', '.....KKrWrrWrKK...KK', '......KKKKKKKK....KK', '..KKKKlRRRRRRrKKR.KK', '...R.KlRRRRRRrK.KKrK', '.....KlRRRRRRrK.KrK.', '.....KrRRRRRRrKKrK..', '......KrrrrrrK.KK...', '......KKKKKKKK......', '......KrK..KrK......', '......KKK..KKK......'],
    worm: ['....................', '....KKKK............', '..KKlllrKK..........', '..KlRRRRrK....KKKK..', '.KlWWRRWWrK...KlrK..', '.KlWKRRWKrK...KlRrK.', '.KlRRRRRRrK...KlRrK.', '.KrRRRRRRrK...KlrrK.', '..KlKKKKrK....KlRrK.', '..KrRWRRrK....KlRrK.', '...KlRRRrK...KlrRrK.', '...KlRRRRrK..KlRRrK.', '...KlRRRRRrK.KlRRrK.', '...KrRRrRRRrKlRRRrK.', '...KlRRRRRRRlRRRRrK.', '...KlRRRRRrRRrRRRrK.', '...KrRRRRRRRRRRRrK..', '....KrrrrrrrrrrrrK..', '.....KKKKKKKKKKKKK..', '....................'],
    jelly: ['....................', '.....KKKKKKKKKK.....', '....KWWlllllllrK....', '...KWRRRRRRRRRRrK...', '..KlRRRRRRRRRRRRrK..', '..KlRRWWRRRRWWRRrK..', '..KlRRWKRRRRWKRRrK..', '..KlRRRRRRRRRRRRrK..', '..KlRRRRRRRRRRRRrK..', '..KlRRRRKWWKRRRRrK..', '..KrrrrrrKKrrrrrrK..', '..KKKKKKKKKKKKKKKK..', '...KrK..KrK..KrKKK..', '...KrK..KrK..KrKKK..', '...KrK..KrK..KrKKK..', '...KrK..KrK..KrKKK..', '...KrK..KrK..KrK....', '...KKK..KrK..KKK....', '........KrK.........', '........KKK.........'],
    robot: ['.........YYY........', '..........K.........', '..........K.........', '.....KKKKKKKKKK.....', '....KlllllllllrK....', '...KlKKKKKKKKKKrK...', '...KlKCCKKCCKKKrK...', '...KlKCCKKCCKKKrK...', '.KKKlKKKKKKKKKKrKKK.', '.KrKlKKKKKKKKKKrKrK.', '.KrKlRRRRRRRRRRrKrK.', '.KrKlRRRRRRRRRRrKrK.', '.KrKlRKWKWKWKWRrKrK.', '.KKKlRKKKKKKKKRrKKK.', '...KrYRRRRRRRRYrK...', '....KrrrrrrrrrrK....', '.....KKKKKKKKKK.....', '.....KlrK..KlrK.....', '.....KrrK..KrrK.....', '.....KKKK..KKKK.....'],
    flame: ['....................', '.........KK.........', '.........KrK........', '........KlrK........', '........KlRrK...K...', '.......KlRRRrK.KK...', '...K...KlRRRRrKrK...', '...KK.KKRRRRKKlrK...', '..KlrKWWRRRRWWRRrK..', '..KlRlWKRRRRWKRRrK..', '..KlRRRRRRRRRRRRrK..', '..KlRRRRRRRRRRRRrK..', '..KrRRRRRYRRRRRRrK..', '...KlRRRYYYRRRRrK...', '...KlRRYYYYYRRRrK...', '...KrRRYYYYYYRrK....', '....KlRYYKKYRRrK....', '....KrrrYYYYrrrK....', '.....KKKKKKKKKK.....', '....................'],
    crab: ['....................', '....................', '.KKKK.........KKKK..', 'KlllrK.......KlllrK.', 'KlRKrK.......KlRKrK.', 'KlRKrK.......KlRKrK.', 'KrrrrK.......KrrrrK.', '.KKKK.........KKKK..', '....KK.KKKKKK.KK....', '....KKKlllllrKKK....', '...KllWWRRRRWWlrK...', '..KlRRWKRRRRWKRRrK..', '..KlRRRRRRRRRRRRrK..', '..KlRRRRRRRRRRRRrK..', '..KrRRRRRRRRRRRRrK..', '..KKrrrKKKKKKrrrKK..', '..KKKKKrWrrWrKKKKK..', '..KK.KKKKKKKKKK.KK..', '..KK.KK......KK.KK..', '....................'],
    cloud: ['....................', '...........KKKK.....', '.........KKlllrKK...', '....KKKKKllWWRRlrK..', '..KKlllllRRRRRRRrK..', '..KlRRRRRRRRRRRRRrK.', '.KlRWRRRRRRRRRRRRrK.', '.KlRRRRRRRRRRRRRRrK.', '.KlRRRWWRRRRWWRRRrK.', '.KrRRRWKRRRRWKRRrK..', '..KlRRRRRRRRRRRRrK..', '.KlRRRRRRRRRRRRRRrK.', '.KlRRRRRRRRRRRRRRrK.', '.KlRRRRRKKKKRRRRRrK.', '.KrrrrrRRWWRRrrrrrK.', '..KKKKKrRRrrrKKKKK..', '.......KrrKKK.......', '........KK..........', '....................', '....................'],
    crystal: ['....................', '.........KK.........', '........KWrK........', '.......KlRrK........', '.......KWRRrK.......', '......KlWRRRrK......', '.....KlRRRRRRrKKK...', '...KKKlWRRRRRrKrK...', '..KlrKlWRRRRRrKRrK..', '.KlRRKlRRRRRRrKRRrK.', '.KlRRKlWWRRWWrKRRrK.', '.KrRRKlWKRRWKrKRRrK.', '..KlRKrRRRRRRrKRrK..', '..KlRrKlRRRRrKrRrK..', '..KlrKKlKKKKrKKlrK..', '..KlrKKlKRRKrKKlrK..', '..KrrKKlRRRRrKKlrK..', '...KrKKrrrrrrKKrK...', '...KKKKKKKKKKKKKK...', '....................'],
    plant: ['....................', '......KKKKKKKK......', '....KKlllllllrKK....', '...KllWWRRRRWWlrK...', '..KlRRWKRRRRWKRRrK..', '..KlRRRRRRRRRRRRrK..', '..KlRRRRRRRRRRRRrK..', '..KKWKWKWKWKWKWKKK..', '..KKKKppppppppKKKK..', '...KKKppppppppKKK...', '....KKWKWKWKWKWK....', '.K....KKKKKKKK....K.', '.KKK....KgggK...KKK.', '.KGGK...KgggK..KGGK.', '.KGGGKK.KgggKKKGGGK.', '.KKGGGK.KgggKKGGGKK.', '...KKK.KKKKKK.KKK...', '......KBBBBBBK......', '.....KKKKKKKKKK.....', '....................'],
    book: ['....................', '....................', '...KKKKKKKKKKKKKK...', '..KreeeeeeeeeeeeeK..', '..KreKKeeeeeKKeeeK..', '..KreeWWeeeWWeeeeK..', '..KreeWKeeeWKeeeeK..', '..KreeeeeeeeeeeeeK..', '..KreeeeeeeeeeeeeK..', '..KreeeeeeeeeeeeeK..', '..KreeeKeeeeKeeeeK..', '..KreeeeKKKKeeeeeK..', '..KreeeeeeeeeeeeeK..', '..KreeDDDDDDDDeeeK..', '..KreeeeeeeeeeeeeK..', '..KreeDDDDDeeeeeeK..', '..KreeeeeeeeeeeeeK..', '...KKKKKKKKKKKKKK...', '.....KrK....KrK.....', '.....KKK....KKK.....'],
    magnet: ['.......KKKKKK.......', '.....KKlllllrKK.....', '....KllRRRRRRlrK....', '...KlWWRRRRRRWWrK...', '..KlRWKRKKKKRKWRrK..', '..KlRRRrKKKKrRRRrK..', '.KlRRRrK....KrRRRrK.', '.KlRRrK......KrRRrK.', '.KlRrK........KlRrK.', '.KlRrK........KlRrK.', '.KlRrK........KlRrK.', '.KlRrK...Y....KlRrK.', '.KlRrK..Y.Y...KlRrK.', '.KlRrK...Y.Y..KlRrK.', '.KlRrK....Y...KlRrK.', '.KKKKK........KKKKK.', '.KwwwK........KwwwK.', '.KwwwK........KwwwK.', '.KKKKK........KKKKK.', '....................'],
    star: ['....................', '.........KK.........', '.........KK.........', '.........KK.........', '........KlrK........', '........KlrK........', '....KKKKlRRrKKKK....', '.KKKlllWWRRWWllrKKK.', '..KrRRRWKRRWKRRRrK..', '...KrRRRRRRRRRrrK...', '....KrRRRRRRRrKK....', '.....KlRKKKKrK......', '.....KlRRKKRRrK.....', '.....KlRRrrRRrK.....', '.....KlRrKKrRrK.....', '.....KrrK..KrrK.....', '....KrKK....KKK.....', '....KK........KK....', '....K..........K....', '....................'],
    boss: ['....KKKK....', '..KKRRRRKK..', '.KRRRRRRRRK.', 'KRRWWRRWWRRK', 'KRRWKRRWKRRK', 'KRRRRRRRRRRK', 'KRRKWKKWKRRK', 'KRRRKWWKRRRK', '.KRRRRRRRRK.', '.KRKRRRRKRK.', '.KK.KKKK.KK.', '............'],
    ghost: ['....KKKK....', '..KKRRRRKK..', '.KRRRRRRRRK.', '.KRWWRRWWRK.', 'KRRWKRRWKRRK', 'KRRRRRRRRRRK', 'KRRRRKKRRRRK', 'KRRRKRRKRRRK', 'KRRRRRRRRRRK', 'KRRRRRRRRRRK', 'KRKRRKKRRKRK', 'KK.KK..KK.KK'],
    cube: ['............', '.KKKKKKKKKK.', '.KRRRRRRRRK.', '.KRWWRRWWRK.', '.KRKWRRKWRK.', '.KRRRRRRRRK.', '.KRRKKKKRRK.', '.KRRRRRRRRK.', '.KRRRRRRRRK.', '.KKKKKKKKKK.', '..KK....KK..', '............'],
    shadow: ['....DDDD....', '..DDDDDDDD..', '.DDDDDDDDDD.', 'DDDYDDDDYDDD', 'DDDDDDDDDDDD', 'DDDDDDDDDDDD', 'DDDDDDDDDDDD', 'DDDDDDDDDDDD', '.DDDDDDDDDD.', '.DD.DDDD.DD.', '............', '............'],
    cave: ['............', '....SSSS....', '..SSSSSSSS..', '.SSSKKKKSSS.', '.SSKKKKKKSS.', 'SSKKKKKKKKSS', 'SSKKKYKKKKSS', 'SSKKKKKKKKSS', 'SSSKKKKKKSSS', 'ssssssssssss', '............', '............'],
    shop: ['............', '...RRRRRR...', '..RWRWRWRW..', '.RRRRRRRRRR.', '..BBBBBBBB..', '..BYYBBCCB..', '..BYYBBCCB..', '..BBBBBBBB..', '..BBBKKBBB..', '..BBBKKBBB..', '............', '............'],
    home: ['.....KK.....', '....KbbK....', '...KbbbbK...', '..KbbbbbbK..', '.KbbbbbbbbK.', '..BBBBBBBB..', '..BCCBBCCB..', '..BCCBBCCB..', '..BBBKKBBB..', '..BBBKKBBB..', '............', '............'],
    portal: ['....PPPP....', '..PPKKKKPP..', '.PKKCCCCKKP.', '.PKCCWWCCKP.', 'PKCCWWWWCCKP', 'PKCCWWWWCCKP', '.PKCCWWCCKP.', '.PKKCCCCKKP.', '..PPKKKKPP..', '....PPPP....', '..ssssssss..', '............'],
    ask: ['............', '....YYYY....', '...YKKKKY...', '...YK..KY...', '.......KY...', '......KY....', '.....KY.....', '.....KY.....', '............', '.....KY.....', '............', '............'],
    boat: ['............', '.....K......', '.....KW.....', '.....KWW....', '.....KWWW...', '.....K......', '.BBBBBBBBBB.', '..BBBBBBBB..', '...bbbbbb...', '............', '............', '............'],
    bridge: ['............', '............', 'N..N.....N..', 'NNNN.....NNN', 'NNNN..N..NNN', 'N..N...N.N..', 'N..N.....N..', '............', '............', '............', '............', '............'],
    mine: ['............', '.NNNNNNNNNN.', '.NKKKKKKKKN.', '.NYKKKKKKYN.', '.NKYKKKKYKN.', '.NKKYKKYKKN.', '.NKKKYYKKKN.', '.NKKYKKYKKN.', '.NKYKKKKYKN.', '.NYKKKKKKYN.', 'SSSSSSSSSSSS', '............'],
    lock: ['............', '....KKKK....', '...K....K...', '...K....K...', '..YYYYYYYY..', '..YYYKKYYY..', '..YYYKKYYY..', '..YYYYYYYY..', '............', '............', '............', '............'],

    /* map monsters (bigger sprites; any size works) */
    golem: ['............................', '..........KKKKKKKK..........', '.........KwwwwwwwsK.........', '........KKKKKKKKKKKK........', '........KKAAKKKKAAKK........', '........KKAAKKKKAAKK........', '........KKKKKKKKKKKK........', '........KwSSSSSSSSsK........', '........KsSKKKKKKSsK........', '...KK..KwKssssssssKsK..KK...', '..KwsKKwSSKKKKKKKKSSsKKwsK..', '.KwSSsKwSSSSSsSSSSSSsKwSSsK.', '.KwSSsKwSsSSSSsSSSSSsKwSSsK.', '.KwSSsKwSSsSSSSGSSSSsKwSSsK.', '.KwSSsKwSSsSSSSSGSSSsKwSSsK.', '.KwSSsKwGSSsSSSSSSSSsKwSSsK.', '.KwSSsKwSGSSSSSSSSSSsKwSSsK.', '.KwSSsKwSSSSSSSSSsSSsKwSSsK.', '.KsSSsKwSSSSSSSSSSsSsKsSSsK.', 'KKKKKKKwSSSSSSSSSSsSsKKKKKKK', 'KwwwwwKwSSSSSSSSSSSSsKwwwwsK', 'KwSSSSKsSSSSSSSSSSSSsKSSSSsK', 'KwSSSSsKssssssssssssKwSSSSsK', 'KssssssKKKKKKKKKKKKKKssssssK', 'KKKKKKKKKwSsK..KwSsKKKKKKKKK', '........KwSsK..KwSsK........', '........KsssK..KsssK........', '........KKKKK..KKKKK........'],
    golem_hurt: ['............................', '..........KKKKKKKK..........', '.........KwwwwwwwsK.....Y...', '...Y....KKKAKKKKAKKK...YWY..', '..YWY...KKAKAKKAKAKK....Y...', '...Y....KKKKKKKKKKKK........', '........KKKKKKKKKKKK........', '........KwSSSSSSSSsK........', '........KsSKKKKKKSsK........', '...KK..KwKssssssssKsK..KK...', '..KwsKKwSSKKKKKKKKSSsKKwsK..', '.KwSSsKwSSSSSsSSSKSSsKwSSsK.', '.KwSSsKwSsSSSSsSSSSSsKwSSsK.', '.KwSSsKwSSsSSKSGSSSSsKwSSsK.', '.KwSSsKwSSsSSKSSGSSSsKwSSsK.', '.KwSSsKwGSSsSSKSSSSSsKwSSsK.', '.KwSSsKwSGSSSKSSSSSSsKwSSsK.', '.KwSSsKwSSSSKSSSSsSSsKwSSsK.', '.KsSSsKwSSSSSKSSSSsSsKsSSsK.', 'KKKKKKKwSSSSSSKSSSsSsKKKKKKK', 'KwwwwwKwSSSSSSSSSSSSsKwwwwsK', 'KwSSSSKsSSSSSSSSSSSSsKSSSSsK', 'KwSSSSsKssssssssssssKwSSSSsK', 'KssssssKKKKKKKKKKKKKKssssssK', 'KKKKKKKKKwSsK..KwSsKKKKKKKKK', '........KwSsK..KwSsK........', '........KsssK..KsssK........', '........KKKKK..KKKKK........'],
    golem_down: ['...KKKKKK...................', '...KswwwKKKKKKKKK...........', '...KsSSwKswwwwwwwK..........', '...KsSSwKSSSSSSSSwK.........', '...KsSSwKSSSSSSSSsK.........', '...KsSSwKssssssssK..........', '...KssKKKKKKKKKKKK..........', '...KKKswwwwwwwwwwwK.........', 'KKKKKsSSSSSSSSSSSSwKKKKKK...', 'KswwKsSSSSSSSSSsSSKswKKKKK..', 'KsSSKsSSSSSSSssSSKsSSKSKKwK.', 'KsssKsSSSSSSsSSSSKsKSKSKKwK.', 'KKKKKsSSSSKSSSSSSKsKSKKKKwK.', '....KsSSSKSKSKKSsKsKSKKKKwK.', '....KsSSKSSSKSSsSKsKSKKKKwK.', 'KKKKKsSSSSSSSSSSSKsKSKKKKwK.', 'KswwKsSSSSSSSSSSSKsKSKSKKwK.', 'KsSSKsSSSSsSSSSSKKsSSKSKKsK.', 'KsssKsSSssSSSSSSSSKssKKKKK..', 'KKKKKsSSSSSSSSSSSSsKKKKKK...', '...KKKssssssssssssK.........', '...KswKKKKKKKKKKKK..........', '...KsSSwKswwwwwwwK..........', '...KsSSwKSSSSSSSSwK.........', '...KsSSwKSSSSSSSSsK.........', '...KsSSwKssssssssK..........', '...KssssKKKKKKKKK...........', '...KKKKKK...................'],
    spore: ['............................', '........KKKKKKKKKKKK........', '......KKlllllWWWWllrKK......', '....KKllRRRRRWWWWRRRlrKK....', '...KlWWWWRRRRWWWWRRRRRlrK...', '..KlRWWWWRRRRWWWWRRRRRRRrK..', '..KlRWWWWRRRRRRRRRRRRRRRrK..', '.KlRRWWWWRRRRRRRRRRRWWRRRrK.', '.KlRRRRRRRRRRRRRRRRWWWWRRrK.', '.KlRRRRRRRRRRRRRRRRWWWWRRrK.', '.KrRRRRRRRWWRRRRRRRRWWRRRrK.', '..KlRRRRRRWWRRRRRRRRRRRRrK..', '..KlRRRRRRRRRRRRRRRRRRRRrK..', '..KlRRRRRRRRRRRRRRRRRRRRrK..', '..KrrrrrrrrrrrrrrrrrrrrrrK..', '..KKKKKKKKKKKKKKKKKKKKKKKK..', '....K..K.KeyyyyyyXK.K..K....', '....K..KKeWWWyyWWWXKK..K....', '....G..GKeWKKyyKKWXKG..G....', '........KeWKKyyKKWXK........', '........KeyyyyyyyyXK........', '........KeyyyyyyyyXK........', '........KeyKKKKKKyXK........', '........KXyyWKWKyyXK........', '.........KXyyyyyyXK.........', '.........KKXXXXXXKK.........', '...........KKKKKK...........', '............................'],
    spore_hurt: ['............................', '........KKKKKKKKKKKK........', '...Y..KKlllllWWWWllrKK......', '..YWYKllRRRRRWWWWRRRlrKK.Y..', '...YlWWWWRRRRWWWWRRRRRlrYWY.', '..KlRWWWWRRRRWWWWRRRRRRRrY..', '..KlRWWWWRRRRRRRRRRRRRRRrK..', '.KlRRWWWWRRRRRRRRRRRWWRRRrK.', '.KlRRRRRRRRRRRRRRRRWWWWRRrK.', '.KlRRRRRRRRRRRRRRRRWWWWRRrK.', '.KrRRRRRRRWWRRRRRRRRWWRRRrK.', '..KlRRRRRRWWRRRRRRRRRRRRrK..', '..KlRRRRRRRRRRRRRRRRRRRRrK..', '..KlRRRRRRRRRRRRRRRRRRRRrK..', '..KrrrrrrrrrrrrrrrrrrrrrrK..', '..KKKKKKKKKKKKKKKKKKKKKKKK..', '....K..K.KeyyyyyyXK.K..K....', '....K..KKeKyyyyyyKXKK..K....', '....G..GKeyKyyyyKyXKG..G....', '........KeKyyyyyyKXK........', '........KeyyyyyyyyXK........', '........KeyyyyyyyyXK........', '........KeyyKKKKyyXK........', '........KXyyKppKyyXK........', '.........KXyKKKKyXK.........', '.........KKXXXXXXKK.........', '...........KKKKKK...........', '............................'],
    spore_down: ['............................', '............................', '.................KKKK.......', '............KKKKKsSSSKK.....', '............KsSSSssssSSK....', '.........SKKKssssssssssSK...', '............KssssssswwwwK...', '............KssssssswwwwSK..', '.........SKKKssssssswwwwSK..', '....KKKKKKK.KssssssswwwwsSK.', '..KKSwwwwwwKKssssssssssssSK.', '..KSwwwwKwKwKssswwsssssssSK.', '.KSwwwwwwKwwKssswwsssssssSK.', '.KSKKKwwKwKwKssssssssssssSK.', '.KSKSKwwwwwwKssssssssswwwwK.', '.KSKSKwwwwwwKssssssssswwwwK.', '.KSKKKwwKwKwKssssssssswwwwK.', '.KSwwwwwwKwwKssssssssswwwwK.', '..KSwwwwKwKSKssssssssssssSK.', '..KKSSSSSSSKKssssssssssssSK.', '....KKKKKKK.KssssswwssssssK.', '.........SKKKsssswwwwsssSK..', '............KsssswwwwssssK..', '............KssssswwsssSK...', '.........SKKKsssssssssssK...', '............KssssssssssK....', '............KKKKKssssKK.....', '.................KKKK.......'],
    hydra: ['............KKKK............', '..........KKYVYqKK..........', '...KKK....KVKPKPqK....KKK...', '.KKVVqKK..KVPPPPqK..KKVVqKK.', '.KYPYPqK..KqKWKPqK..KYPYPqK.', 'KVKPKPPqK.KKqqqqKK.KVKPKPPqK', 'KqPPPPPqK...KKKKK..KqPPPPPqK', '.KKWKPqK.....KVqK...KKWKPqK.', '.KKqqqKK.....KLqK...KKqqqKK.', '...KKKK......KVqK.....KKKK..', '.L.KVVqK.....KVqK....KVVqKL.', '..LKVPqK.....KVqK....KVPqL..', '...KVPPqK....KVqK....KVPqK..', '...KqPPqK....KVqK...KVPPqK..', '....KVPPqK...KVqK...KVPqK...', '....KqPPqK...KVqK...KVPqK...', '.....KVPPqK..KVqK..KVPqK....', '.....KqPPqKKKKVqKKKKVPqK....', '......KVPPqKVKVqKVKVPPqK....', '....KKKqPPqKPKVqKPKVPqKK....', '...KVVPKVPqKPKVqKPKVPqKqK...', '...KVPPKqqqKPKqqKPqqqqKqK...', '...KVPPPKKKKPKKKKPKKKKPqK...', '...KqqPPPPPPPqPPPPPPqPqqK...', '....KKqqPPPqPPPPPPPPqqKK....', '......KKqqqqqqqqqqqqKK......', '........KKKKKKKKKKKK........', '............................'],
    hydra_hurt: ['.........Y..KKKK....Y.......', '........YWYKKVKqKK.YWY......', '...KKK...YKVKPKPqK..Y.KKK...', '.KKVVqKK..KVPPPPqK..KKVVqKK.', '.KKPKPqK..KqKpKPqK..KKPKPqK.', 'KVKPKPPqK.KKqqqqKK.KVKPKPPqK', 'KqPPPPPqK...KKKKK..KqPPPPPqK', '.KKpKPqK.....KVqK...KKpKPqK.', '.KKqqqKK.....KLqK...KKqqqKK.', '...KKKK......KVqK.....KKKK..', '.L.KVVqK.....KVqK....KVVqKL.', '..LKVPqK.....KVqK....KVPqL..', '...KVPPqK....KVqK....KVPqK..', '...KqPPqK....KVqK...KVPPqK..', '....KVPPqK...KVqK...KVPqK...', '....KqPPqK...KVqK...KVPqK...', '.....KVPPqK..KVqK..KVPqK....', '.....KqPPqKKKKVqKKKKVPqK....', '......KVPPqKVKVqKVKVPPqK....', '....KKKqPPqKPKVqKPKVPqKK....', '...KVVPKVPqKPKVqKPKVPqKqK...', '...KVPPKqqqKPKqqKPqqqqKqK...', '...KVPPPKKKKPKKKKPKKKKPqK...', '...KqqPPPPPPPqPPPPPPqPqqK...', '....KKqqPPPqPPPPPPPPqqKK....', '......KKqqqqqqqqqqqqKK......', '........KKKKKKKKKKKK........', '............................'],
    hydra_down: ['.....................KK.....', '.................w.KKswKK...', '................w..KKsKKK...', '....KKKK......KKKKKsSssswK..', '...KswwwK...KKswwwKsKsKKwK..', '...KssswK.KKswssswKssssssK..', '..KsssssKKswssssssKKssssK...', '..KsssKKswssssssKK.KKssKK...', '.KsssKswssssssKK.....KK.....', '.KsssKssssssKK..............', '.KsssKssssKK..........KKKKK.', '.KsssKKKKKK...........KswwK.', '.KssssssswK..........KsKsKKK', '.KsssKKKKKKKKKKKKKKKKKsSsswK', '.KsssKswwwwwwwwwwwwwwKsKsKKK', '.KsssKsssssssssssssssKsssssK', '.KsssKKKKKKKKKKKKKKKKKKsssK.', '.KssssssswK...........KKKKK.', '.KsssKsKKKK.................', '.KsssKswwwKK.........KK.....', '..KssKsssswwKKK....KKswKK...', '..KssKsssssswwwKKK.KKsKKK...', '...KssKKKsssssswwwKsSssswK..', '...KssssKKKKssssswKsKsKKwK..', '....KKKK....KKssssKssssssK..', '..............KKwKKKssssK...', '.................w.KKssKK...', '.....................KK.....'],
    dragon: ['........K.............K.........', '.........K..........KK..........', '.........KKK.......KXK..........', 'K........KXK.KKKKKKKXK........K.', 'Kr........KKKlllllrKK........Kr.', 'Krr.......KKKKRRRRKKKK......Kr..', '.Krr......KYYYRRRRYYYK.....Krr..', '.Klrr....KlYKYRRRRYKYrK...KrrK..', '.KlRrK...KlYYYRRRRYYYrK..KlrrK..', '.KlRRrK..KlRRKKKKKKRRrK.KlrRrK..', '.KlRRrrK.KrRKlllllrKRrKKlrrRrK..', 'KlRRRRrrK.KKlKRRRRKrKKKlrrRRRrK.', 'KrrRRRRrK.KKlRRRRRRrKKKlrRRRRrr.', 'KrrrrRRrr..KKWKWKWKWK.KrRRRrrrK.', '.KrRRrrrK..KKKKKKKKKK.KrrrrRrK..', '..KlRRrrr.KlRKKKKKKRrK.rrRRrK...', '..KlRRrK.KlRRRRRRRRRRrKKrRRrK...', '..KrrrKrrKlRRYYYYYYRRrKrrrrrK...', '.KrKrrr.KlRRRYYYYYYRRRrK.rrrrK..', '.Krr....KlRRYFFFFFFYRRrK....rr..', '........KlRRYYYYYYYYRRrK......K.', '........KlRYYYYYYYYYYRrK....KKK.', '........KlRYYFFFFFFYYRrK...KrK..', '........KrRYYYYYYYYYYRrKKKKrKK..', '.........KlRYYYYYYYYRrKrKKKK....', '.........KrRYFFFFFFYRrKK........', '........KKKKKKYYYYKKKKKK........', '........KlllrKYYYYKlllrK........', '........KlRRrKKKKKKlRRrK........', '........KrrrrK....KrrrrK........', '........KWKWKW....KWKWKW........', '................................'],
    dragonzz: ['................................', '................................', '................................', '................................', '................................', '................................', '................................', '................................', '.................KK....K........', '................KlrK..KK........', '..K........K....KrrrKKrr........', '...K......KK...KlrRRllrrK.......', '...KKK....KKKKKlRrRRRrRrK.......', '...KXKKKKKKKllKlrRRRrRRRrKK.....', '...KKllllrKKRKlRrRRrRRRRrrr.....', '..KllRRRRRlrKlRrRRrRRRRrrr......', '..KlRRRRRRRrKrRrRrRRRrrrKK......', '.KlKKKKRRKKKrKrrrRRrrrrrKrK...K.', '.KKKKKKKRRRRrKrrrrrrKKKKRrK..KK.', '.KlllllrKRRRrKKKrrKRRRRRRrK.KK..', 'KlRRRRRRrKRRrKRRRRRRRRRRRrKKrK..', 'KlKRRKRRrKRrrRRRRRRRRRRRrKKrKK..', 'KlRRRRRRrKrrKRRrRRRRRRRrrKKK....', 'KrKKKKKKrKKKRRRRRRRrRRrrK.......', '.KrrrrrrKKKKrrrrrrrrrrKK........', '..KKKKKKKKKKKKKKKKKKKKKKKKKKK...', '..KeeeeeeeeWeeeeeeeeeeeWeeeAK...', '..KeYYYYYYYYYYYYYYYYYYYYYYYYAK..', '.KeWYYYYYYYYYYWYYYYYYYYYYYWYAK..', '.KAAAAAAWAAAAAAAAAAAWAAAAAAAAK..', 'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK.', '................................'],
    gate: ['....KKKKKKKK....', '...KUUUUUUUUK...', '..KUZZZZZZZZUK..', '..KUZKKKKKKZUK..', '..KUZKCCCCKZUK..', '..KUZKCWWCKZUK..', '..KUZKCCCCKZUK..', '..KUZKCCCCKZUK..', '..KUZKKKKKKZUK..', '.KKUUUUUUUUUUKK.', '.KUUUUUUUUUUUUK.'],

    /* the Professor (cake-slice scientist mascot, after the top-left pose on the user's sheet): frosting dome with sprinkles,
       sponge rim, big eyes, blush, lab coat open over the jam layers, flask. prof = no goggles (current pick); B goggles pushed up; C goggles on; D happy. */
    prof: ['.......KKKKKKK.............', '.....KKeeeeeeeKKK..........', '....KeeReeeYeeeebK.........', '...KeeeebeeeeeReeeK........', '..KeeYeeeeeGeeeeeeeK.......', '..KeeeeeIeeeeeeYeeeK.......', '.KeeeeeeeeeeeeeeeeeeK......', '.KKeeeKKeeeeKKeeeKKeK......', '.KXKKKXXKKKKXXKKKXXKK......', '.KJJJJJJJJJJJJJJJJJJK......', '.KJJKKKJJJJJJJKKKJJJK......', '.KJJKWKJJJJJJJKWKJJJK......', '.KJJKKKJJJJJJJKKKJJJK...C..', '.KJIIJJJKJJJKJJJIIJJK.C..C.', '..KJJJJJJKpKJJJJJJJK...KKK.', '..KXJJJJJJKJJJJJJJXK...KcK.', '.KKWWKJJJJJJJJJJKWWKK..KcK.', 'KWWWWKKJJJJJJJJKKWWWWKKHHHK', 'KWWWWWWKXXXXXXKWWWWWWKKHcHK', 'KWWKWWWWKJJJJKWWWWKWWKKHHHK', 'KWWKWWWWWKppKWWWWWKWWKKHHHK', 'KJJKWWWWWWKKWWWWWWKJJK.KKK.', '.KK.KWWWWWWWWWWWWK.KK......', '....KWWWWWKKWWWWWK.........', '.....KWWWK..KWWWK..........', '......KJK....KJK...........', '.....KKKK...KKKK...........'],
    profB: ['.......KKKKKKK.............', '.....KKeeeeeeeKKK..........', '....KeeReeeYeeeebK.........', '...KeeeebeeeeeReeeK........', '..KeeYeeeeeGeeeeeeeK.......', '..KeeeeeIeeeeeeYeeeK.......', '.KeeeeeeeeeeeeeeeeeeK......', '.KKeeeKKeeeeKKeeeKKeK......', '.KXKTHHHTTTTTTHHHTKXK......', '.KJJJJJJJJJJJJJJJJJJK......', '.KJJKKKJJJJJJJKKKJJJK......', '.KJJKWKJJJJJJJKWKJJJK......', '.KJJKKKJJJJJJJKKKJJJK...C..', '.KJIIJJJKJJJKJJJIIJJK.C..C.', '..KJJJJJJKpKJJJJJJJK...KKK.', '..KXJJJJJJKJJJJJJJXK...KcK.', '.KKWWKJJJJJJJJJJKWWKK..KcK.', 'KWWWWKKJJJJJJJJKKWWWWKKHHHK', 'KWWWWWWKXXXXXXKWWWWWWKKHcHK', 'KWWKWWWWKJJJJKWWWWKWWKKHHHK', 'KWWKWWWWWKppKWWWWWKWWKKHHHK', 'KJJKWWWWWWKKWWWWWWKJJK.KKK.', '.KK.KWWWWWWWWWWWWK.KK......', '....KWWWWWKKWWWWWK.........', '.....KWWWK..KWWWK..........', '......KJK....KJK...........', '.....KKKK...KKKK...........'],
    profC: ['.......KKKKKKK.............', '.....KKeeeeeeeKKK..........', '....KeeReeeYeeeebK.........', '...KeeeebeeeeeReeeK........', '..KeeYeeeeeGeeeeeeeK.......', '..KeeeeeIeeeeeeYeeeK.......', '.KeeeeeeeeeeeeeeeeeeK......', '.KKeeeKKeeeeKKeeeKKeK......', '.KXKKKXXKKKKXXKKKXXKK......', '.KJJJJJJJJJJJJJJJJJJK......', '.KJTTTTTJJJJJJTTTTTJK......', '.KJTHKHTTTTTTTTHKHTJK......', '.KJTTTTTJJJJJJTTTTTJK...C..', '.KJIIJJJKJJJKJJJIIJJK.C..C.', '..KJJJJJJKpKJJJJJJJK...KKK.', '..KXJJJJJJKJJJJJJJXK...KcK.', '.KKWWKJJJJJJJJJJKWWKK..KcK.', 'KWWWWKKJJJJJJJJKKWWWWKKHHHK', 'KWWWWWWKXXXXXXKWWWWWWKKHcHK', 'KWWKWWWWKJJJJKWWWWKWWKKHHHK', 'KWWKWWWWWKppKWWWWWKWWKKHHHK', 'KJJKWWWWWWKKWWWWWWKJJK.KKK.', '.KK.KWWWWWWWWWWWWK.KK......', '....KWWWWWKKWWWWWK.........', '.....KWWWK..KWWWK..........', '......KJK....KJK...........', '.....KKKK...KKKK...........'],
    profD: ['.......KKKKKKK.............', '.....KKeeeeeeeKKK..........', '....KeeReeeYeeeebK.........', '...KeeeebeeeeeReeeK........', '..KeeYeeeeeGeeeeeeeK.......', '..KeeeeeIeeeeeeYeeeK.......', '.KeeeeeeeeeeeeeeeeeeK......', '.KKeeeKKeeeeKKeeeKKeK......', '.KXKKKXXKKKKXXKKKXXKK......', '.KJJJJJJJJJJJJJJJJJJK......', '.KJJJJJJJJJJJJJJJJJJK......', '.KJJKJJKJJJJJJKJJKJJK......', '.KJJJKKJJJJJJJJKKJJJK...C..', '.KJIIJJJKJJJKJJJIIJJK.C..C.', '..KJJJJJJKpKJJJJJJJK...KKK.', '..KXJJJJJJKJJJJJJJXK...KcK.', '.KKWWKJJJJJJJJJJKWWKK..KcK.', 'KWWWWKKJJJJJJJJKKWWWWKKHHHK', 'KWWWWWWKXXXXXXKWWWWWWKKHcHK', 'KWWKWWWWKJJJJKWWWWKWWKKHHHK', 'KWWKWWWWWKppKWWWWWKWWKKHHHK', 'KJJKWWWWWWKKWWWWWWKJJK.KKK.', '.KK.KWWWWWWWWWWWWK.KK......', '....KWWWWWKKWWWWWK.........', '.....KWWWK..KWWWK..........', '......KJK....KJK...........', '.....KKKK...KKKK...........'],
    crumbs: ['............', '............', '............', '............', '...F........', '.......Q....', '..I.........', '.....F...Y..', '.Q......F...', '....Q.......', '............', '............'],
    superbug: ['..............K.............', '..............K.............', '..............K.............', '.............KK.............', '..........KKKLgKKK..........', '...g....KKLLLGGLLgKK....g...', '....K..KLhhGGGGGGGLgK..K....', '.....K.KhGGGGGGGGGGgK.K.....', '......KLGGGGGGGGGGGGgK......', '......KLKKGGGGGGGGKKgK......', '......KLGGKKGGGKKGGGgK......', '.....KLGGWWWGGGWWWGGGgK.....', '.....KLGGWKKGGGKKWGGGgK.....', '.gKK.KLGGWKKGGGKKWGGGgK.KKg.', '...KKKLGGGGGGGGGGGGGGgKKK...', '.....KLgGGGGGGGGGGGGGgK.....', '.....KgGGGGGGGGGGGGGggK.....', '......KLGGKKKKKKKKGGgK......', '......KLGGKWKWKWKKGGgK......', '......KggGGKKKKKKGGGgK......', '......KKLGGGGGGGGGGgKK......', '.....K.KggGGgGGGGGggK.K.....', '....K...KKgggGGgggKK...K....', '...g......KKKggKKK......g...', '.............KK.............', '..............K.............', '..............K.............', '..............K.............'],
    superbug_hurt: ['...Y..........K.........Y...', '..YWY.........K........YWY..', '...Y..........K.........Y...', '.............KK.............', '..........KKKLgKKK..........', '...g....KKLLLGGLLgKK....g...', '....K..KLhhGGGGGGGLgK..K....', '.....K.KhGGGGGGGGGGgK.K.....', '......KLGGGGGGGGGGGGgK......', '......KLGGGGGGGGGGGGgK......', '......KLGGGGGGGGGGGGgK......', '.....KLGGKGGGGGGGKGGGgK.....', '.....KLGGGKGGGGGKGGGGgK.....', '.gKK.KLGGKGGGGGGGKGGGgK.KKg.', '...KKKLGGGGGGGGGGGGGGgKKK...', '.....KLgGGGGGGGGGGGGGgK.....', '.....KgGGGGGGGGGGGGGggK.....', '......KLGGGKKKKKKGGGgK......', '......KLGGGKppppKGGGgK......', '......KggGGKKKKKKGGGgK......', '......KKLGGGGGGGGGGgKK......', '.....K.KggGGgGGGGGggK.K.....', '....K...KKgggGGgggKK...K....', '...g......KKKggKKK......g...', '.............KK.............', '..............K.............', '..............K.............', '..............K.............'],
    superbug_down: ['............................', '............................', '..............s.............', '..............K.............', '....s........KK.......s.....', '.....K.......K.......K......', '......K....KKKKKK...K.......', '.......KKKKswwwwwKKK........', '......KKswwSsSSSSwwwKK......', '.....KswsSSSSSSSSSSSwwK.....', '.....KsSSSSSSSKSKSSSSwK.....', '....KsSSSSSSSSSKSSSSSwwK....', '....KsSSKKKSSSKSKSSSSSwK....', '....KssSKSKSSSSSSSSSSSwK....', '...KsSSSKSKSSSSSSSSSSSSwK...', 'KKKKsSSSKSKSSSSSSSSSSSSsKKKK', '....KsSSKSKSSSKSKSSSSSwK....', '....KsSSKKKSSSSKSSSSSSwK....', '....KsSSSSSSSSKSKSSSSSsK....', '.....KsSSSSSSSSSSSSSSwK.....', '.....KssSSSSSSSSSSSSssK.....', '......KKssssSSSSSsssKK......', '.......KKKKssssssKKK........', '......K....KKKKKK...K.......', '.....K.......K.......K......', '....s........KK.......s.....', '..............K.............', '..............s.............'],
    /* the Underworld (17 Nov 2026): its boss, 28×28 like the others */
    magmaw: ['............................', '............................', '............................', '............................', '.....KK.............K.......', '.....KK............KKK......', '.....KKK..KKKKKKKK.KKK......', '....KKKKKKSSSOSSSDKKKK......', '....KKKKSSssssFsssSDKKK.....', '.....KSSssssssOsssssSDK.....', '....KSOsssssssssssssOsDK....', '...KSssFssssssssssssFssDK...', '...KSssOWWWsssssWWWOsssDK...', '..KSssssWOOsssssOOWsssssDK..', '..KSssssWOOsssssOOWsssssDK..', '..KSssssssssssssssssssssDK..', '..KSssssssssssssssssssssDK..', '..KSssssssKKKKKKKsssssssDK..', '..KKsssssKWOWOWOWKssssssKK..', '.KwsKsssKOOFFFFFOOKssssKwsK.', 'KwSSOKssKOFFFFFFFOKsssOwSSsK', 'KwSSsFOssKOFFFFFOKsssFKwSSsK', 'KsSSsKsOssKWKWKWKsssOsKsSSsK', '.KssKssssssssssssssssssKssK.', 'K.KKKDDDDDDDDDDDDDDDDDKDKKK.', 'W.WKWKKKKKKKKKKKKKKKKKWKWKW.', 'W.W.W....OF......O....W.W.W.', '..........O..O...FO.........'],
    magmaw_hurt: ['............................', '............................', '............................', '.........................Y..', '..Y..KK.............K...YWY.', '.YWY.KK............KKK...Y..', '..Y..KKK..KKKKKKKK.KKK......', '....KKKKKKSSSOSSSDKKKK......', '....KKKKSSssssFsssSDKKK.....', '.....KSSssssssOsssssSDK.....', '....KSOsssssssssssssOsDK....', '...KSssFssssssssssssFssDK...', '...KSssOKsssssssssKOsssDK...', '..KSssssOKsssssssKssssssDK..', '..KSssssKsssssssssKsssssDK..', '..KSssssssssssssssssssssDK..', '..KSssssssssssssssssssssDK..', '..KSssssssssssssssssssssDK..', '..KKssssssssssssssssssssKK..', '.KwsKssssssKKKKKKssssssKwsK.', 'KwSSOKsssssKOOOOKsssssOwSSsK', 'KwSSsFOssssKKKKKKssssFKwSSsK', 'KsSSsKsOssssssssssssOsKsSSsK', '.KssKssssssssssssssssssKssK.', 'K.KKKDDDDDDDDDDDDDDDDDKDKKK.', 'W.WKWKKKKKKKKKKKKKKKKKWKWKW.', 'W.W.W....OF......O....W.W.W.', '..........O..O...FO.........'],
    magmaw_down: ['.wwK.KKK....................', '....KswwK...................', '.wwKsSSSwKKKKKK.............', '..KKsSSSsKSSSSSKK...........', '.wwKKssSKssssssSSK.KK.......', '..KssKwKsssssssssSKKKKKK....', '..KsssSssssssssssSSKKKKK....', '..KssSsssssssssSwsSKKK......', '..KssssssssssKSKsssSK.......', '.SKsssssssssssKssssSK.......', 'SwKssssssssssKsKssssSK......', '..KsssKKKsssssssssssSK......', '..KsssKSKsssssssssssSK......', 'S.KsssKSKsssssssssssSK......', '..KsssKSKsssssssssSwSK......', '..KsssKSKsssssssssssSK......', '..KsssKKKssssKsKssssSK......', 'wSKsssssssssssKssssssK......', 'S.KssssssssssKsKsssSK.......', '..KssssssssssssSssssKKK.....', '..KssSsssssssssswSSKKKKK....', '..KssswssssssssssssKKKK.....', '.wwKsKKSssssssssssKK........', '..KsKswwKssssssssK..........', '.wwKsSSSwKsssssKK...........', '..KKsSSSsKKKKKK.............', '.wwKKsssK...................', '.....KKK....................'],
    rustwyrm: ['............................', '....................K...K...', '.................KKKKKKKK...', '................KFFFFFBKK...', '...............KKKKOOOOBK...', '..............KKOWWWOOOOBK..', '............KKKKOKKWOOOOBK..', '............KBBKOKKWOOOOBK..', '.............KKKOOOOOOOOBK..', '...............KBOOOOOOOOBKK', '............KWKWKBBBBBBOOOBK', '.K...............KKKKUKBOOBK', 'KBK....................KFOBK', '.KBK...................KFOBK', '.KBK.....KKKKKKKKKK...BFOOBK', '.KBBK.KKKFFFFFFFFFBKKKKFOOBK', '..KFBKFFFOOOOOOOOOOFFBKFOOBK', '..KBKFOOOOOOOOOOOOOOOOKBOOBK', '...KFOOOUOOOOOOOOBOOOOKFOOBK', '...KFOOBOOOOOOOOOOUOOOKFOBK.', '...KFOBBBOOOOOOOOBBOOOKFOBK.', '...KBOOOBBBBBBBBBBOOBOKFOBK.', '...KKBOOOOOUOOOOOOOOOOKBBBK.', '.....KBBBBOOOOOOOOOBBBKKKKK.', '......KKKBBBBBBBBBBKKK......', '.........KKKKKKKKKK.........', '............................', '............................'],
    rustwyrm_hurt: ['............................', '....................K...K...', '........Y........KKKKKKKK...', '.......YWY......KFFFFFBKK...', '........Y......KFOOOOOOBK...', '..............KKOOOKOOOOBK..', '............KKKKOOKOOOOOBKY.', '............KBBKOOOKOOOOBYWY', '.............KKKOOOOOOOOBKY.', '...............KBOOOOOOOOBKK', '............KKKKKBBBBBBOOOBK', '.K..........KppK.KKKKUKBOOBK', 'KBK....................KFOBK', '.KBK...................KFOBK', '.KBK.....KKKKKKKKKK...BFOOBK', '.KBBK.KKKFFFFFFFFFBKKKKFOOBK', '..KFBKFFFOOOOOOOOOOFFBKFOOBK', '..KBKFOOOOOOOOOOOOOOOOKBOOBK', '...KFOOOUOOOOOOOOBOOOOKFOOBK', '...KFOOBOOOOOOOOOOUOOOKFOBK.', '...KFOBBBOOOOOOOOBBOOOKFOBK.', '...KBOOOBBBBBBBBBBOOBOKFOBK.', '...KKBOOOOOUOOOOOOOOOOKBBBK.', '.....KBBBBOOOOOOOOOBBBKKKKK.', '......KKKBBBBBBBBBBKKK......', '.........KKKKKKKKKK.........', '............................', '............................'],
    rustwyrm_down: ['...............K............', '............KKKsK...........', '..........KKsssK............', '.....KKKKKswsKK.............', '.....KswwwKsK...............', '....KsSSSSwK................', '...KsSSsSSSwK...............', '...KsSSssSSwK...............', '...KsSssSsSwK...............', '..KssSsSSSSSwK..............', '..KsSSsSSSSSwK..............', '..KsSssSSSSSwK..............', '..KsSSsSSSSSwK..KK..KK......', '..KsSSsSSSSSwK..SK.KsK......', '..KsSSsSSSSSwK..SK.KsKK.....', '..KsSSsSSSSSwK..KKKKKKKK....', '..KsSSsSSSSSwK...KsSSSSwK...', '..KsSSssSsSSwK..KsSSKSKSwK..', '..KsSSSssSSSsK..KsSSSKSSwK..', '...KsSSSSSSwK...KsSSKSKSwK..', '...KsSsSSSSwK...KsSSSSSSwKK.', '...KsSSSSSSsK...ssSSSSSSwK..', '....KKKKKKKKKs..KsSSSSSSsK..', '....KswwwwswwwKKsSSSSSSsKK..', '....KsSSSSSSSSwwSSSssssKKKK.', '....KssssSSSSSSSSSsKKKK.....', '....KKKKKsssssssssK.........', '.........KKKKKKKKKK.........'],
    halflife: ['............................', '...........KKKKKK...........', '........KKKhhhLWLKKK........', '.......KhhhLLhhhhWWLK.......', '......KhLLLLLLLhhhhhLK......', '.....KhLLLLLLhhhhhhhhLK...h.', '....KhLLLLLLLLLhhhhhhhLK....', '....KhLLLLLLLhhhhhhhhhLK.h..', '...KhLLKKKKLLLLhKKKKhhhLK...', '...KhLLKYYKLLhhhKYYKhhhLK..h', '...KhLLKYKKLLLLhKYKKhhhLK...', '...KhLLLKKLLLhhhhKKhhhhLK...', '...KhLLLLLLLLLLhhhhhhhhLK.h.', '...KhLLLLLLLLhhhhhhhhhhLK...', '...KhLLLLLLLLKKhhhhhhhhLK...', '...KhLLLLLLKKKKKKhhhhhWLK...', '...KhLLLLLLKKKKKKhhhhWhLK...', '...KhLLLLLLKKKKKKhhhhhhLK...', '...KhLLLLLLKKKKKKhhhhhhLK...', '...KhLLLLLLLLKKhhhhhWhhLK...', '...KhLLLLLLLLLLhhhhhhhhWK...', '...KhLLLLLLLLhhhhhhhhhhLK...', '...KhLGGGGLLGGLLhhLLLLhLK...', '...KGGKKKKGGKhKKLLKKKKLLK...', '....KK....KK....KK....KK....', '....KK....KK....KK....KK....', '............................', '............................'],
    halflife_hurt: ['........................Y...', '...Y.......KKKKKK......YWY..', '..YWY...KKKhhhLWLKKK....Y...', '...Y...KhhhLLhhhhWWLK.......', '......KhLLLLLLLhhhhhLK......', '.....KhLLLLLLhhhhhhhhLK...h.', '....KhLLLLLLLLLhhhhhhhLK....', '....KhLLLLLLLhhhhhhhhhLK.h..', '...KhLLLLLLLLLLhhhhhhhhLK...', '...KhLLKLLKLLhhhKhhKhhhLK..h', '...KhLLLKKLLLLLhhKKhhhhLK...', '...KhLLLLLLLLhhhhhhhhhhLK...', '...KhLLLLLLLLLLhhhhhhhhLK.h.', '...KhLLLLLLLLhhhhhhhhhhLK...', '...KhLLLLLLLKKKKhhhhhhhLK...', '...KhLLLLLLKKKKKKhhhhhWLK...', '...KhLLLLLLKKKKKKhhhhWhLK...', '...KhLLLLLLKKKKKKhhhhhhLK...', '...KhLLLLLLKKKKKKhhhhhhLK...', '...KhLLLLLLLKKKKhhhhWhhLK...', '...KhLLLLLLLLLLhhhhhhhhWK...', '...KhLLLLLLLLhhhhhhhhhhLK...', '...KhLGGGGLLGGLLhhLLLLhLK...', '...KGGKKKKGGKhKKLLKKKKLLK...', '....KK....KK....KK....KK....', '....KK....KK....KK....KK....', '............................', '............................'],
    halflife_down: ['............................', '............................', '............................', '....KKKKKKKKKKKKKKKK........', '..KKSwwwwwwwwwwwwwwwKK......', '..KKSwwwwwwwwwwwwwwwwwK.....', '....KSwwwwwwwwwwwwwwwwwK....', '....KSwwwwwwwwwwwKKKwwwwK...', '....KSwwwwwwwwwwKKKKwwwwwK..', '....KSwwwwwwwwwwKKKKwwwwwK..', '..KKSwwwwwwwwwwwwKKKwwwwwK..', '..KKSwwwwKKKKwwwwwwwwwwwwwK.', '....KSwwKKKKKKwwwwwwwwwwwwK.', '....wSwwKKKKKKwwwwwwwwwwwwK.', '....KwwwKKKKKKwwwwwwwwwwwwK.', '....KwwwKKKKKKwwwwwwwwwwwwK.', '..KKwwwwwKKKKwwwwKKKwwwwwwK.', '..KKwwwwwwwwwwwwKKKKwwwwwK..', '....KwwwwwwwwwwwKKKKwwwwwK..', '....KwwwwwwwwwwwwKKKwwwwwK..', '....KwwwwwwwwwwwwwwwwwwwK...', '....KwwwwwwwwwwwwwwwwwwK....', '..KKwwwwwwwwwwwwwwwwwwK.....', '..KKwwwwwwwwwwwwwwwwKK......', '....KKKKKKKKKKKKKKKK........', '....................w.......', '...............w......w.....', '..................w.........'],
    reactor: ['....L..L..L.....', '.....L..L..L....', '...KKKKKKKKKK...', '...KZZZZZZZZK...', '....KZZZKZZK....', '....KZZZKZZK....', '...KZZZZZKZZK...', '..KZZZZZZKZZZK..', '..KZZYYZZZZZZK..', '..KZYKYZZZZZZK..', '.KZZZYZZZZZZZZK.', '.KZZZZZZZZZZZZK.', 'KKKKKKKKKKKKKKKK', 'LL..LLL...LL..LL'],
    germ: ['............', '............', '............', '....KKK.....', '...KGGGK....', '..KGLGGGK...', '..KGGGLGK.K.', '...KGGGK.K..', '....KKKKK...', '............', '............', '............'],
    barrel: ['............', '............', '...KKKKKK...', '...KYYYYK...', '...KYKKYK...', '...KYYKYK...', '...KYKKYK...', '...KYYYYK...', '...KKKKKK...', '..LL....LL..', '............', '............'],
    cog: ['............', '............', '....K..K....', '...KNKKNK...', '..KNNNNNNK..', '...KNKKNK...', '..KNNNNNNK..', '...KNKKNK...', '....K..K....', '............', '............', '............'],
    deadtree: ['............', '.....K......', '..K..K..K...', '...K.K.K....', '....KKK.....', '.....K......', '.....K......', '....KKK.....', '............', '............', '............', '............'],
    /* decoration */
    tree: ['.....gg.....', '...gGGGg....', '..gGGGGGg...', '.gGGGGGGGg..', '..gGGGGGg...', '.gGGGGGGGg..', 'gGGGGGGGGGg.', '..gggggggg..', '.....BB.....', '.....BB.....', '............', '............'],
    pine: ['.....g......', '....gGg.....', '....gGg.....', '...gGGGg....', '...gGGGg....', '..gGGGGGg...', '..gGGGGGg...', '.gGGGGGGGg..', 'ggggggggggg.', '.....B......', '.....B......', '............'],
    peak: ['............', '.....WW.....', '....WWSS....', '...SSSSSs...', '..SSSSSSss..', '.SSSSSSSsss.', 'SSSSSSSSssss', '............', '............', '............', '............', '............'],
    snowpeak: ['.....WW.....', '....WWWW....', '...WWWWwS...', '..WWWwSSSs..', '.WWwSSSSsss.', 'WwSSSSSSssss', '............', '............', '............', '............', '............', '............'],
    /* Underworld scenery (17 Nov 2026) */
    gem: ['............', '............', '.....c......', '....cCc.....', '....cCC.....', '...ccCCC.c..', '...cCCCC.cC.', '...cCCCC.CC.', '..sssssssss.', '............', '............', '............'],
    spire: ['............', '............', '.....w......', '.....S......', '....wSs.....', '....wSs.....', '...wSSs..w..', '...wSSs.wSs.', '..wSSSSswSSs', '..ssssssssss', '............', '............'],
    bone: ['............', '............', '............', '............', '.ZW.....WZ..', '.WWWWWWWWW..', '.ZW.....WZ..', '............', '............', '............', '............', '............'],
    glowcap: ['............', '............', '............', '............', '....HHHH....', '...HCHHCH...', '..HHHHHHHH..', '.....ee.....', '.....ee.....', '....eeee....', '............', '............'],
    ember: ['............', '............', '............', '............', '............', '.....A......', '....AOA.....', '....OEO..A..', '...UUUUU.O..', '............', '............', '............'],
    lift: ['.....SS.....', '.....SS.....', '.NNNNNNNNNN.', '.NYYYYYYYYN.', '.NKUKUKUKUN.', '.NKUKUKUKUN.', '.NKUKUKUKUN.', '.NKUKUKUKUN.', '.NKKKKKKKKN.', '.NNNNNNNNNN.', 'SSSSSSSSSSSS', '............'],
    rock: ['............', '............', '............', '............', '............', '....ssss....', '...sSSSSs...', '..sSSWSSSs..', '..sSSSSSSs..', '.ssssssssss.', '............', '............'],
    flower: ['............', '............', '............', '............', '...R....Y...', '..RYR..YOY..', '...R....Y...', '...g..g.g...', '..g.gg.g....', '...gg.gg....', '............', '............'],
    grass: ['............', '............', '............', '............', '............', '............', '..g...g.....', '..g.g.g..g..', '.gg.ggg.gg..', '............', '............', '............'],
    reeds: ['............', '..N.....N...', '..N..N..N...', '..g..N..g...', '..g..g..g...', '.gg..g.gg...', '..g.gg..g...', '..ggg.g.g...', '...gggggg...', '............', '............', '............'],
    mushroom: ['............', '............', '............', '............', '....RRRR....', '...RWRRWR...', '..RRRRRRRR..', '.....WW.....', '.....WW.....', '....WWWW....', '............', '............'],
    bubble: ['............', '...L........', '..L.L...L...', '...L...L.L..', '........L...', '....OO......', '...O..O.....', '....OO......', '............', '............', '............', '............'],
    cactus: ['............', '.....GG.....', '.....GG..G..', '..G..GG..G..', '..G..GG.GG..', '..GG.GGGG...', '...GGGG.....', '.....GG.....', '.....GG.....', '....yyyy....', '............', '............'],
    house: ['............', '....RRRR....', '...RRRRRR...', '..RRRRRRRR..', '...WWWWWW...', '...WCWWNW...', '...WWWWNW...', '...WWWWWW...', '............', '............', '............', '............'],
    wave: ['............', '............', '............', '............', '...cc...cc..', '..c..c.c..c.', '.c....c.....', '............', '............', '............', '............', '............'],
    flask: ['....KKKK....', '....KWWK....', '....KWWK....', '...KWWWWK...', '..KWWWWWWK..', '.KWGGGGGGWK.', '.KGGGLGGGGK.', '.KGGGGGLGGK.', '..KKKKKKKK..', '............', '............', '............'],
    coin: ['............', '....KKKK....', '...KYYYYK...', '..KYYWYYYK..', '..KYWYYYYK..', '..KYYYYYYK..', '..KYYYYYYK..', '...KYYYYK...', '....KKKK....', '............', '............', '............'],
    heart: ['............', '.KK....KK...', 'KRRK..KRRK..', 'KRWRKKRRRK..', 'KRRRRRRRRK..', '.KRRRRRRK...', '..KRRRRK....', '...KRRK.....', '....KK......', '............', '............', '............'],
  };
  const cache = {};
  // Sprites drawn from the mascot art (10 Nov 2026) are image files, not grids. icon() returns their URL.
  const IMG = { prof: '/img/mascot/professor-pixel.png', profHead: '/img/mascot/head-pixel.png' };
  // Professor reactions (smooth "pixel look" heads): happy, laugh, think, surprised, worried, determined
  const face = f => `/img/mascot/head-${f}.webp`;
  function icon(name, swap) {
    if (IMG[name]) return IMG[name];
    const k = name + (swap || '');
    if (cache[k]) return cache[k];
    const g = ICONS[name], c = document.createElement('canvas'), wd = Math.max(...g.map(r => r.length)); c.width = c.height = Math.max(wd, g.length);
    const x = c.getContext('2d');
    const ox = Math.floor((c.width - wd) / 2), oy = c.height - g.length;
    g.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '.') return; x.fillStyle = swap && ch === 'R' ? swap : swap && ch === 'r' ? shade(swap, -.32) : swap && ch === 'l' ? shade(swap, .38) : PAL[ch]; x.fillRect(i + ox, j + oy, 1, 1); }));
    return cache[k] = c.toDataURL();
  }

  return { get S() { return S; }, get gained() { return gained; }, collect, MOVE_CAP, save, reset, look, hasLook, nick, eq, LV, GEAR, BASE, TOTAL, SCI, securedTotal, levelCap, xpFor, rawLevel, level, stats, nav, icon, face, IMG, ICONS, DRAGON, storyIntro, storyRescue, keys, CH1 };
})();
