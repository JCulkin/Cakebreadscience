/* Cakebread Questing: shared bits for every Questing page.
   Top bar (with Google sign-in), the Adventurer's stats, story pop-ups and the 12×12 pixel icons.
   Real progress (XP, secured spec points, coins, loot, missions today) comes from questing-engine.js (QE), which
   saves to the student's account. The map state (moves, plan, position, health, brews, bosses) is Breadventure
   Land's own and stays in this browser until the shared class map is built.
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
  const reset = () => { try { localStorage.removeItem(KEY); } catch (e) {} S = attach(DEF()); };

  /* look, name, gear (saved by the creator and wardrobe pages; the engine copies them into the account) */
  const look = () => load('cbs.adventurer.base') || PIXEL.DEFAULT;
  const hasLook = () => !!load('cbs.adventurer.base');
  const nick = () => { const n = localStorage.getItem('cbs.adventurer.nick'); return n && !QE.checkName(n) ? n : n === '-' ? QE.googleName() : 'Brave Neutron'; };
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
    if (g.hp || g.mana || g.move) save();
    return g;
  }
  let gained = { hp: 0, mana: 0, move: false };

  /* ---------- nav bar (one bar: brand, Base camp, the two big actions, then small links) ---------- */
  const DRAGON = 'Crumbmaw';
  function nav(active) {
    const css = document.createElement('style');
    css.textContent = `body>header{display:none}
.advnav{position:sticky;top:0;z-index:50;background:#151518;border-bottom:3px solid #00a03a;display:flex;align-items:center;gap:6px;padding:7px 12px;overflow-x:auto;scrollbar-width:none;font-family:Barlow,Arial,sans-serif}
.advnav::-webkit-scrollbar{display:none}
.advnav a{text-decoration:none;white-space:nowrap}
.advnav .brand{font:900 21px 'Barlow Condensed',Arial,sans-serif;text-transform:uppercase;color:#eeeae0;letter-spacing:-.5px;margin-right:8px;line-height:1}
.advnav .brand b{color:#00a03a}
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
    n.innerHTML = `<a class="brand" href="index.html">Cakebread <b>Questing</b></a>`
      + tab('home', 'adventurer-home.html', '🏠', 'Base camp')
      + tab('mission', 'adventurer-mission.html', '⚔️', 'Mission', 'cta mission', noMission ? '<span class="dot">!</span>' : '')
      + tab('map', 'adventurer-map.html', '🗺️', 'Breadventure Land', 'cta map', '<span class="soon">preview</span>')
      + tab('cards', '/Flashcards/', '🃏', 'Flashcards')
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
      <p>No one can beat them alone. <b>Your whole class</b> has to win back all three key pieces to free the Professor. Revise to get stronger, then follow the crumbs.</p>`,
      'Follow the crumbs →', () => { S.storySeen = true; save(); onClose && onClose(); });
    return m;
  }
  function storyRescue(onClose) {
    return storyModal(`<div class="ch">Chapter 1 complete</div><h2>The Professor is free!</h2>
      <div class="pics"><img src="${icon('prof')}" width="120" alt="The Professor"></div>
      <p>With all three key pieces the cage clicks open. ${DRAGON} snores on. The Professor dusts off his sprinkles, straightens his goggles and says: <i>“About time. I've been in there since Tuesday. Right — back to the Cakelab, there's science to do.”</i></p>
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
    e: '#fff6e3', J: '#f5b840', X: '#d4902a', p: '#f472b6' };
  const ICONS = {
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
    golem: ['......KKKKKK......', '.....KZZZZZZK.....', '....KZwZZZZZZK....', '....KZAAZZAAZK....', '....KZZZZZZZZK....', '...KKZZKKKKZZKK...', '..KUUKZZZZZZKUUK..', '.KUZZKZgZZgZKZZUK.', 'KUZwZKZZZZZZKZwZUK', 'KUZZZKZZgZZZKZZZUK', 'KUZZKKZZZZZZKKZZUK', '.KKK.KUZZZZUK.KKK.', '.....KUZKKZUK.....', '....KUZZK.KZZUK...', '...KUZZZK.KZZZUK..', '...KKKKKK.KKKKKK..'],
    spore: ['.....KKKKKKK.....', '...KKRRRRRRRKK...', '..KRRWWRRRRWWRK..', '.KRRRWWRRRRWWRRK.', '.KRRRRRRWWRRRRRK.', 'KRRWWRRRWWRRRWWRK', 'KKKKKKKKKKKKKKKKK', '...KQQQQQQQQQK...', '...KQKKQQQKKQK...', '...KQKYQQQKYQK...', '...KQQQQQQQQQK...', '...KQQKWKWKQQK...', '..gKQQKKKKKQQKg..', '.gLKQQQQQQQQQKLg.', 'gLgKKQQQQQQQKKgLg', '..gggKKKKKKKggg..'],
    hydra: ['.KKKK....KKKK....KKKK.', 'KPPYPK..KPYYPK..KPYPPK', 'KWPPPK..KPPPPK..KPPPWK', '.KKPPK..KWKKWK..KPPKK.', '...KPK...KPPK...KPK...', '...KPK...KPPK...KPK...', '...KPPK..KPPK..KPPK...', '....KPPK.KPPK.KPPK....', '.....KPPKKPPKKPPK.....', '....KPPPPPPPPPPPPK....', '...KPPVVVVVVVVVPPPK...', '..KPPVVVVVVVVVVVPPPK..', '..KPPPPPPPPPPPPPPPPK..', '.KPPKPPKPPKPPKPPKPPK..', '..KK.KK.KK.KK.KK.KK...', '..L.....L......L......'],
    dragon: ['KK......K..K......KK', 'KRK.....KKKK.....KRK', 'KRRK...KRRRRK...KRRK', 'KRRRK.KRRRRRRK.KRRRK', 'KRRRRKRYKRRKYRKRRRRK', 'KERRRKRRRRRRRRKRRREK', '.KERRKRRRRRRRRKRREK.', '..KERKRWRRRRWRKREK..', '...KKKKRRRRRRKKKK...', '.....KRRQQQQRRK.....', '....KRRQQQQQQRRK....', '....KRRQQQQQQRRK....', '...KRRRKQQQQKRRRK...', '...KRRK.KKKK.KRRKKK.', '...KKK........KKERK.', '...............KKK..'],
    dragonzz: ['KK......K..K......KK', 'KRK.....KKKK.....KRK', 'KRRK...KRRRRK...KRRK', 'KRRRK.KRRRRRRK.KRRRK', 'KRRRRKRKKRRKKRKRRRRK', 'KERRRKRRRRRRRRKRRREK', '.KERRKRRRRRRRRKRREK.', '..KERKRRRRRRRRKREK..', '...KKKKRRRRRRKKKK...', '.....KRRQQQQRRK.....', '....KRRQQQQQQRRK....', '....KRRQQQQQQRRK....', '...KRRRKQQQQKRRRK...', '...KRRK.KKKK.KRRKKK.', '...KKK........KKERK.', '...............KKK..'],
    gate: ['....KKKKKKKK....', '...KUUUUUUUUK...', '..KUZZZZZZZZUK..', '..KUZKKKKKKZUK..', '..KUZKCCCCKZUK..', '..KUZKCWWCKZUK..', '..KUZKCCCCKZUK..', '..KUZKCCCCKZUK..', '..KUZKKKKKKZUK..', '.KKUUUUUUUUUUKK.', '.KUUUUUUUUUUUUK.'],

    /* the Professor (cake-slice scientist mascot, after the top-left pose on the user's sheet): frosting dome with sprinkles,
       sponge rim, big eyes, blush, lab coat open over the jam layers, flask. prof = no goggles (current pick); B goggles pushed up; C goggles on; D happy. */
    prof: ['.......KKKKKKK.............', '.....KKeeeeeeeKKK..........', '....KeeReeeYeeeebK.........', '...KeeeebeeeeeReeeK........', '..KeeYeeeeeGeeeeeeeK.......', '..KeeeeeIeeeeeeYeeeK.......', '.KeeeeeeeeeeeeeeeeeeK......', '.KKeeeKKeeeeKKeeeKKeK......', '.KXKKKXXKKKKXXKKKXXKK......', '.KJJJJJJJJJJJJJJJJJJK......', '.KJJKKKJJJJJJJKKKJJJK......', '.KJJKWKJJJJJJJKWKJJJK......', '.KJJKKKJJJJJJJKKKJJJK...C..', '.KJIIJJJKJJJKJJJIIJJK.C..C.', '..KJJJJJJKpKJJJJJJJK...KKK.', '..KXJJJJJJKJJJJJJJXK...KcK.', '.KKWWKJJJJJJJJJJKWWKK..KcK.', 'KWWWWKKJJJJJJJJKKWWWWKKHHHK', 'KWWWWWWKXXXXXXKWWWWWWKKHcHK', 'KWWKWWWWKJJJJKWWWWKWWKKHHHK', 'KWWKWWWWWKppKWWWWWKWWKKHHHK', 'KJJKWWWWWWKKWWWWWWKJJK.KKK.', '.KK.KWWWWWWWWWWWWK.KK......', '....KWWWWWKKWWWWWK.........', '.....KWWWK..KWWWK..........', '......KJK....KJK...........', '.....KKKK...KKKK...........'],
    profB: ['.......KKKKKKK.............', '.....KKeeeeeeeKKK..........', '....KeeReeeYeeeebK.........', '...KeeeebeeeeeReeeK........', '..KeeYeeeeeGeeeeeeeK.......', '..KeeeeeIeeeeeeYeeeK.......', '.KeeeeeeeeeeeeeeeeeeK......', '.KKeeeKKeeeeKKeeeKKeK......', '.KXKTHHHTTTTTTHHHTKXK......', '.KJJJJJJJJJJJJJJJJJJK......', '.KJJKKKJJJJJJJKKKJJJK......', '.KJJKWKJJJJJJJKWKJJJK......', '.KJJKKKJJJJJJJKKKJJJK...C..', '.KJIIJJJKJJJKJJJIIJJK.C..C.', '..KJJJJJJKpKJJJJJJJK...KKK.', '..KXJJJJJJKJJJJJJJXK...KcK.', '.KKWWKJJJJJJJJJJKWWKK..KcK.', 'KWWWWKKJJJJJJJJKKWWWWKKHHHK', 'KWWWWWWKXXXXXXKWWWWWWKKHcHK', 'KWWKWWWWKJJJJKWWWWKWWKKHHHK', 'KWWKWWWWWKppKWWWWWKWWKKHHHK', 'KJJKWWWWWWKKWWWWWWKJJK.KKK.', '.KK.KWWWWWWWWWWWWK.KK......', '....KWWWWWKKWWWWWK.........', '.....KWWWK..KWWWK..........', '......KJK....KJK...........', '.....KKKK...KKKK...........'],
    profC: ['.......KKKKKKK.............', '.....KKeeeeeeeKKK..........', '....KeeReeeYeeeebK.........', '...KeeeebeeeeeReeeK........', '..KeeYeeeeeGeeeeeeeK.......', '..KeeeeeIeeeeeeYeeeK.......', '.KeeeeeeeeeeeeeeeeeeK......', '.KKeeeKKeeeeKKeeeKKeK......', '.KXKKKXXKKKKXXKKKXXKK......', '.KJJJJJJJJJJJJJJJJJJK......', '.KJTTTTTJJJJJJTTTTTJK......', '.KJTHKHTTTTTTTTHKHTJK......', '.KJTTTTTJJJJJJTTTTTJK...C..', '.KJIIJJJKJJJKJJJIIJJK.C..C.', '..KJJJJJJKpKJJJJJJJK...KKK.', '..KXJJJJJJKJJJJJJJXK...KcK.', '.KKWWKJJJJJJJJJJKWWKK..KcK.', 'KWWWWKKJJJJJJJJKKWWWWKKHHHK', 'KWWWWWWKXXXXXXKWWWWWWKKHcHK', 'KWWKWWWWKJJJJKWWWWKWWKKHHHK', 'KWWKWWWWWKppKWWWWWKWWKKHHHK', 'KJJKWWWWWWKKWWWWWWKJJK.KKK.', '.KK.KWWWWWWWWWWWWK.KK......', '....KWWWWWKKWWWWWK.........', '.....KWWWK..KWWWK..........', '......KJK....KJK...........', '.....KKKK...KKKK...........'],
    profD: ['.......KKKKKKK.............', '.....KKeeeeeeeKKK..........', '....KeeReeeYeeeebK.........', '...KeeeebeeeeeReeeK........', '..KeeYeeeeeGeeeeeeeK.......', '..KeeeeeIeeeeeeYeeeK.......', '.KeeeeeeeeeeeeeeeeeeK......', '.KKeeeKKeeeeKKeeeKKeK......', '.KXKKKXXKKKKXXKKKXXKK......', '.KJJJJJJJJJJJJJJJJJJK......', '.KJJJJJJJJJJJJJJJJJJK......', '.KJJKJJKJJJJJJKJJKJJK......', '.KJJJKKJJJJJJJJKKJJJK...C..', '.KJIIJJJKJJJKJJJIIJJK.C..C.', '..KJJJJJJKpKJJJJJJJK...KKK.', '..KXJJJJJJKJJJJJJJXK...KcK.', '.KKWWKJJJJJJJJJJKWWKK..KcK.', 'KWWWWKKJJJJJJJJKKWWWWKKHHHK', 'KWWWWWWKXXXXXXKWWWWWWKKHcHK', 'KWWKWWWWKJJJJKWWWWKWWKKHHHK', 'KWWKWWWWWKppKWWWWWKWWKKHHHK', 'KJJKWWWWWWKKWWWWWWKJJK.KKK.', '.KK.KWWWWWWWWWWWWK.KK......', '....KWWWWWKKWWWWWK.........', '.....KWWWK..KWWWK..........', '......KJK....KJK...........', '.....KKKK...KKKK...........'],
    crumbs: ['............', '............', '............', '............', '...F........', '.......Q....', '..I.........', '.....F...Y..', '.Q......F...', '....Q.......', '............', '............'],
    superbug: ['..K..........K....', '.K.K..KKKKKK.K.K..', 'K...KKGGGGGGKK..K.', '...KGGGGGGGGGGK...', '..KGGLGGGGGLGGGK..', '.KGGWWKGGGWWKGGGK.', '.KGGWKKGGGWKKGGGK.', 'KGGGGGGGGGGGGGGGGK', 'KGGgGGKKKKKKGGgGGK', 'KGGGGKWKWKWKGGGGGK', '.KGGGGKKKKKKGGGGK.', '..KGGgGGGGGGGgGK..', '...KKGGGGGGGGKK...', '.K.K.KKKKKKKK.K.K.', 'K.........K......K'],
    rustwyrm: ['...........KKKK...', '..........KOOOOK..', '.........KOYOKOOK.', '.........KOOOOOOOK', '..........KOWKWKK.', '...........KOOK...', '....KKKK...KNOK...', '...KONNOK..KONK...', '..KOOKKOOK.KNOK...', '..KNK..KNOKKONK...', '..KOK...KONNOOK...', '..KNOK...KKKKK....', '...KOOK...........', '....KNOKKKK.......', '.....KOONNOK......', '......KKKKKK......'],
    halflife: ['....KKKKKKKK....', '..KKLLLLhhhhKK..', '.KLLLLLLhhhhhhK.', '.KLLKKLLhhKKhhK.', 'KLLLKKLLhhKKhhhK', 'KLLLLLLLhhhhhhhK', 'KLLKLLKLhKhhKhhK', 'KLLLKKLLhhKKhhhK', 'KLLLLLLLhhhhhhhK', 'KLLLLLLLhhhhhhhK', 'KLKLLKLLhKhhKhhK', 'KK.KK.KKKK.KK.KK'],
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
    g.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '.') return; x.fillStyle = (swap && ch === 'R') ? swap : PAL[ch]; x.fillRect(i + ox, j + oy, 1, 1); }));
    return cache[k] = c.toDataURL();
  }

  return { get S() { return S; }, get gained() { return gained; }, collect, MOVE_CAP, save, reset, look, hasLook, nick, eq, LV, GEAR, BASE, TOTAL, SCI, securedTotal, levelCap, xpFor, rawLevel, level, stats, nav, icon, face, IMG, ICONS, DRAGON, storyIntro, storyRescue, keys, CH1 };
})();
