/* The Adventurer — shared bits for the clickable mock (9 Nov 2026).
   Nav bar across all the Adventurer pages, the pretend saved game (localStorage), the stat rules, and the 12×12 pixel icons
   used by the map, base camp and mission pages. Needs adventurer-pixel.js loaded first (for portraits). */
const ADV = (() => {
  const KEY = 'cbs.adventurer.state';
  /* Totals of non-Units spec points per science (Double Award): used for progress bars. */
  const TOTAL = { b: 134, c: 130, p: 139 };
  const SCI = { b: 'Biology', c: 'Chemistry', p: 'Physics' };
  const DEF = () => ({
    v: 1, day: 1, xp: 640, coins: 35, secured: { p: 22, b: 15, c: 19 }, health: 27,
    moves: 2, plan: [], at: '7,4', visited: ['7,4', '8,4', '9,4', '9,3', '10,2', '11,2'],
    brews: { 'Bottled Aura': 2, 'Electrolyte Slushie': 1, 'Fizzy Courage': 1 },
    bag: [], lastLoot: null, missionsToday: 0, reportSeen: 0, report: null,
  });
  const load = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  let S = Object.assign(DEF(), load(KEY) || {});
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const reset = () => { try { localStorage.removeItem(KEY); } catch (e) {} S = DEF(); };

  /* look, name, gear (saved by the creator and wardrobe pages) */
  const look = () => load('cbs.adventurer.base') || PIXEL.DEFAULT;
  const hasLook = () => !!load('cbs.adventurer.base');
  const nick = () => localStorage.getItem('cbs.adventurer.nick') || 'Brave Neutron';
  const eq = () => load('cbs.adventurer.eq') || { head: 'nocap', top: 'labcoat', bottom: 'inertia', shoes: 'brownian', lhand: 'shield', rhand: 'glove' };

  /* stats = quiz half (secured spec points) + game half (level) + gear. Level comes from map XP, capped by the quiz. */
  const LV = { str: 2, hp: 3, mag: 1 };
  const GEAR = 2;
  const securedTotal = () => S.secured.p + S.secured.b + S.secured.c;
  const levelCap = () => 2 + Math.floor(securedTotal() / 8);
  const xpFor = l => 100 * l * (l - 1) / 2;
  const rawLevel = () => { let l = 1; while (xpFor(l + 1) <= S.xp) l++; return l; };
  const level = () => Math.min(rawLevel(), levelCap());
  const stats = () => {
    const l = level();
    const s = { l, str: S.secured.p + LV.str * l + GEAR, hp: S.secured.b + LV.hp * l, mag: S.secured.c + LV.mag * l };
    if (S.health > s.hp) S.health = s.hp;
    return s;
  };

  /* ---------- nav bar ---------- */
  const PAGES = [
    ['start', 'adventurer-start.html', 'Spec Quiz'],
    ['home', 'adventurer-home.html', 'Base camp'],
    ['mission', 'adventurer-mission.html', 'Mission'],
    ['map', 'adventurer-map.html', 'Map'],
    ['wardrobe', 'adventurer-wardrobe.html', 'Wardrobe'],
    ['look', 'adventurer-create.html', 'My look'],
  ];
  function nav(active) {
    const css = document.createElement('style');
    css.textContent = `.advnav{position:sticky;top:0;z-index:50;background:#1b1b1f;border-bottom:3px solid #00a03a;display:flex;align-items:center;gap:2px;padding:0 10px;overflow-x:auto;scrollbar-width:none}
.advnav::-webkit-scrollbar{display:none}
.advnav a{color:#ddd;text-decoration:none;font:700 15px Barlow,Arial,sans-serif;padding:10px 11px;white-space:nowrap;border-bottom:3px solid transparent;margin-bottom:-3px}
.advnav a:hover{color:#fff}
.advnav a.on{color:#fff;border-bottom-color:#facc15}
.advnav .mock{margin-left:auto;display:flex;gap:8px;align-items:center;white-space:nowrap;font:700 11px Barlow,Arial;color:#facc15;text-transform:uppercase;letter-spacing:1px;padding-left:12px}
.advnav .mock button{font:700 11px Barlow,Arial;background:none;border:1px solid #666;color:#bbb;padding:2px 6px;cursor:pointer;text-transform:uppercase;letter-spacing:1px}
.advnav .mock a{font-size:11px;padding:2px 0;color:#bbb;border:0}`;
    document.head.appendChild(css);
    const n = document.createElement('nav');
    n.className = 'advnav';
    n.setAttribute('aria-label', 'Adventurer pages');
    n.innerHTML = PAGES.map(([k, href, label]) => `<a href="${href}" class="${k === active ? 'on' : ''}"${k === active ? ' aria-current="page"' : ''}>${label}</a>`).join('')
      + `<span class="mock">Mock-up <button type="button" id="advReset" title="Start the pretend game again">Reset</button><a href="/test.html">Test page</a></span>`;
    const h = document.querySelector('header');
    (h ? h.after(n) : document.body.prepend(n));
    n.querySelector('#advReset').onclick = () => {
      if (!confirm('Reset the pretend game (level, map, loot)? Your look and gear stay.')) return;
      reset(); save(); location.reload();
    };
  }

  /* ---------- 12×12 pixel icons ---------- */
  const PAL = { K: '#1b1b1f', W: '#fff', R: '#e11d48', G: '#22c55e', g: '#166534', B: '#92400e', b: '#2563eb', Y: '#facc15', y: '#e9d48b',
    S: '#9ca3af', s: '#4b5563', P: '#7c3aed', O: '#f97316', C: '#67e8f9', c: '#bfe9f5', L: '#a3e635', D: '#475569', N: '#78350f', w: '#cbd5e1' };
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
  function icon(name, swap) {
    const k = name + (swap || '');
    if (cache[k]) return cache[k];
    const g = ICONS[name], c = document.createElement('canvas'); c.width = c.height = 12;
    const x = c.getContext('2d');
    g.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '.') return; x.fillStyle = (swap && ch === 'R') ? swap : PAL[ch]; x.fillRect(i, j, 1, 1); }));
    return cache[k] = c.toDataURL();
  }

  return { get S() { return S; }, save, reset, look, hasLook, nick, eq, LV, GEAR, TOTAL, SCI, securedTotal, levelCap, xpFor, rawLevel, level, stats, nav, icon, ICONS };
})();
