/* Breadventure Land: the shared world (10 Nov 2026). One world for every player on the site (user, 9 Nov: "No separate classes.
   All players same world"). No server: the first signed-in visit after midnight claims a lock and runs the night for everyone.
   Used by adventurer-map.html (play) and /admin/ (controls). Needs firebase (database compat) and, for names/looks, nothing else.

   Realtime Database bland/
     world  = { started, day (date of the last night run, YYYY-MM-DD), chapter, boss: { '2,2': hp, … }, hit: { '2,2': { uid: true } },
                log: [summary lines of the last night], lock: { day, by, at } }
     state/{uid} = { at, health, mana, moves, visited[], lifted[], shield, dens: { k: { hp } | { back: dayNum } }, brews: {},
                     report: [html lines], reportDay, pending: { coins, items[] }, joined }      (written by the night run and by the player)
     pub/{uid}   = { name, look, eq, lvl, str, hp, mag, plan: { day: world.day, steps: ['7,3', …] }, t }   (written only by the player)
   A plan counts for the night after world.day it was made on, so old plans are ignored without anyone clearing them.
   Boss health never scales (user, 10 Nov: "Boss health shouldn't change once it's been unveiled"). */
const BL = (() => {
/* ===================== the world ===================== */
/* ~ sea, o lake, = river (all water: can't walk), B bridge over the river,
   F woods, f meadow, P fields, M peaks, S snow, m marsh, d dunes, s beach, T town,
   b Petri Swamp (bacteria), j Scrap Heap Hills (rust), r the Glowing Wastes (old reactor) */
const ROWS_TXT = [
  '~~~~~FSSSSM~~~~~~~~~',
  '~~FFFFPSSSMMM~~~~~~~',
  '~FFFFFPP=MMMMMM~~~~~',
  '~FFooFPP=PMMMMjj~~~~',
  '~sFoofPTBPPMMPjjjj~~',
  '~sFFfPTP=PPdddPjjrr~',
  '~smmPPfP=PddddPrrrr~',
  '~~mmmmPPBPdddPPrrrr~',
  '~~bmmmmP=PddPPrrrr~~',
  '~~bbbmPs=sPPddrr~~~~',
  '~bbbbbPP=PPPdd~~~~~~',
  '~~bbbbPPBPPs~~~~~~~~',
  '~~~~bb~~=~~~~~~~~~~~',
];
const COLS = 20, ROWS = 13, HEXR = 30, W3 = Math.sqrt(3) * HEXR;
const VB_W = Math.ceil(W3 * (COLS + 0.5) + 8), VB_H = Math.ceil(HEXR * 1.5 * (ROWS - 1) + 2 * HEXR + 8);
const T_AT = (c, r) => (ROWS_TXT[r] || '')[c] || '~';
const WATER = new Set(['~', 'o', '=']);
const LAND = {
  F: { col: '#5a9e4b', name: 'Greenhouse Woods', decor: [['tree', 3], ['pine', 2], ['mushroom', .3]] },
  f: { col: '#9fcf6e', name: 'Pollen Meadows', decor: [['flower', 2], ['tree', .5], ['grass', 1]] },
  P: { col: '#b9d77f', name: 'The Open Fields', decor: [['grass', 1.4], ['flower', .4], ['rock', .3]] },
  M: { col: '#b8b0a2', name: 'Gravity Peaks', decor: [['peak', 2], ['rock', .8]] },
  S: { col: '#e8edf3', name: 'Cold Store Hills', decor: [['snowpeak', 2], ['pine', .4]] },
  m: { col: '#7fa77a', name: 'Acid Marsh', decor: [['reeds', 1.5], ['bubble', .8], ['mushroom', .3]] },
  d: { col: '#e8cf8f', name: 'Dry Lab Dunes', decor: [['cactus', 1], ['rock', .6]] },
  s: { col: '#efe0b0', name: 'The Beach', decor: [['rock', .3]] },
  T: { col: '#e7d3a1', name: 'Homeroom Town', decor: [['house', 2]] },
  b: { col: '#79b4a3', name: 'The Petri Swamp', decor: [['germ', 1.5], ['reeds', .8], ['bubble', .6]] },
  j: { col: '#b38b6d', name: 'Scrap Heap Hills', decor: [['cog', 1.2], ['rock', .8]] },
  r: { col: '#c9cf7f', name: 'The Glowing Wastes', decor: [['barrel', 1], ['deadtree', .9], ['rock', .4]] },
  B: { col: null, name: 'Bridge over the River Tangent', decor: [] },
};
const WATER_NAME = { '~': ['The Revision Sea', 'Endless. Salty. You cannot swim in a lab coat.'], o: ['Lost Property Lake', 'Full of single gloves and PE kits. Too deep to wade.'], '=': ['The River Tangent', 'Flows off in a direction nobody expected. Cross at a bridge.'] };

const PLACES = {
  '7,4': { type: 'home', name: 'The Cakelab', icon: 'home', text: 'Your base: a lab that smells of baking. Everyone starts here and comes back here when knocked out. Safe — nothing attacks you here, and resting refills your Health.' },
  '6,5': { type: 'shop', name: 'The Tuck Shop', icon: 'shop', text: 'Spend your coins on brews. Stand here to buy; drink them anywhere (Spells & brews).', stock: true },
  '6,6': { type: 'event', name: 'Suspicious Puddle', icon: 'ask', text: 'Something glints at the bottom. A random event every night: a coin, a brew, or a very wet sock.' },
  /* chapter 1: the dragon's three guards, each holding a piece of the cage key */
  '2,2': { type: 'boss', ch: 1, science: 'b', name: 'The Spore Lord', icon: 'spore', max: 900, power: 6,
    text: 'A mushroom the size of a house, deep in Greenhouse Woods. Breathes clouds of spores and regrows faster than you can chop. Holds one piece of the cage key.', item: 'mito', loot: ['🔑 Key piece 1 of 3', 'Mitochondria Gauntlet (Lowkey Legendary)', '+40 coins each'] },
  '11,2': { type: 'boss', ch: 1, science: 'p', name: 'Granitus the Stone Golem', icon: 'golem', max: 1000, power: 8,
    text: 'A walking cliff in Gravity Peaks. It will not move unless an unbalanced force acts on it. You are the unbalanced force. Holds one piece of the cage key.', item: 'frictionless', loot: ['🔑 Key piece 2 of 3', 'Frictionless Slippers (Lowkey Legendary)', '+40 coins each'] },
  '4,7': { type: 'boss', ch: 1, science: 'c', name: 'The Acid Hydra', icon: 'hydra', max: 820, power: 7,
    text: 'Three heads, all of them sour. It lurks in the Acid Marsh and spits things that fizz. Holds one piece of the cage key.', item: 'shield', loot: ['🔑 Key piece 3 of 3', 'Periodic Table Shield (Rare)', '+40 coins each'] },
  '7,0': { type: 'worldboss', name: 'Crumbmaw the Dragon', icon: 'dragonzz', text: 'Asleep in its lair on a hoard of stolen lab equipment (and one stolen Professor). Far too strong for anyone alone. When it wakes, everyone fights it together.' },
  '7,1': { type: 'cage', name: 'The Professor\'s Cage', icon: 'prof', text: 'The Professor is locked in here, looking cross and slightly crumbly. The lock needs all three key pieces — win them from the Spore Lord, the Stone Golem and the Acid Hydra.' },
  /* chapter 2: wake up once the Professor is free */
  '3,10': { type: 'boss', ch: 2, science: 'b', name: 'The Superbug', icon: 'superbug', max: 1000, power: 8,
    text: 'A bacterium that has survived every antibiotic thrown at it, so now it is enormous and very smug. Lives in the Petri Swamp. Natural selection made it; you lot will unmake it.', item: 'grass', loot: ['Touch-Grass Boots (Rare)', 'Electrolyte Slushie', '+50 coins each'] },
  '16,4': { type: 'boss', ch: 2, science: 'c', name: 'The Rust Wyrm', icon: 'rustwyrm', max: 950, power: 9,
    text: 'A great iron serpent in Scrap Heap Hills, slowly oxidising. Every rainy night it gets a bit flakier and a lot angrier.', item: 'chainmail', loot: ['Chainmail of Covalent Bonds (Rare)', 'Fizzy Courage', '+50 coins each'] },
  '17,6': { type: 'boss', ch: 2, science: 'p', name: 'The Half-Life Horror', icon: 'halflife', max: 1100, power: 10,
    text: 'Something leaked out of the old reactor. Half of it has already decayed. The other half is very much still here.', item: 'kilt', loot: ['Kilt of Kinetic Energy (Rare)', 'Bottled Aura', '+50 coins each'] },
  '16,7': { type: 'dungeon', ch: 2, science: 'p', name: 'The Old Reactor', icon: 'reactor', text: 'A broken-down nuclear power station, cracked and humming. Explore it floor by floor (in a very sensible lead suit) for loot.' },
  '2,5': { type: 'dungeon', science: 'b', name: 'The Petri Dish Pit', icon: 'cave', text: 'Three floors deep. Each night inside explores one floor: small fights, random loot, sometimes a brew.' },
  '12,6': { type: 'dungeon', science: 'p', name: 'Black Hole Basement', icon: 'cave', text: 'Things go in. Some come out. Explore floor by floor for loot.' },
  '5,8': { type: 'dungeon', science: 'c', name: 'Fume Cupboard of Doom', icon: 'cave', text: 'Keep the sash down. Explore for loot and the odd cursed test tube.' },
  '18,7': { type: 'locked', name: 'The Ancient Gate', icon: 'gate', text: 'A stone gate humming with blue light at the far edge of the Glowing Wastes. Locked. It leads somewhere new — a later chapter.' },
  '0,4': { type: 'locked', name: 'The Broken Bridge', icon: 'bridge', text: 'Half a bridge, leading west into the sea mist. Someone will have to fix it one day — a later chapter (the Professor has plans).' },
  '12,4': { type: 'locked', name: 'The Abandoned Mine', icon: 'mine', text: 'Boarded up. A sign says “Closed for safety (and plot reasons)”. Strange noises at night. A later chapter.' },
};
/* small monsters you can beat on your own in a night or two (respawn 2 days after they're beaten) */
const DENS = {
  '5,3': ['Fruit Fly Swarm', 'boss', '#a16207', 'b', 30, 2, 'A buzzing cloud that came for the cake and stayed for the fight.'],
  '3,1': ['Slime Mould', 'boss', '#65a30d', 'b', 38, 3, 'Not quite a fungus, not quite an animal, definitely sticky.'],
  '12,3': ['Rogue Electron', 'ghost', '#38bdf8', 'p', 35, 3, 'Escaped from a shell and is very negative about it.'],
  '3,6': ['Acid Frog', 'cube', '#84cc16', 'c', 38, 3, 'pH 2 and proud. Don\'t lick it.'],
  '11,7': ['Static Sandling', 'ghost', '#eab308', 'p', 42, 3, 'Rubbed against too many sand dunes. Now it zaps.'],
  '2,9': ['Germ Gang', 'boss', '#10b981', 'b', 48, 4, 'Three bacteria in a trench coat. Divides when nervous.'],
  '17,4': ['Rust Mite', 'cube', '#c2410c', 'c', 48, 4, 'Eats iron, leaves flakes. Keep your sword dry.'],
  '16,8': ['Glow Rat', 'ghost', '#bef264', 'p', 55, 4, 'Lives near the reactor. Glows faintly. Nobody pets it.'],
};
Object.entries(DENS).forEach(([k, [name, shape, col, sci, max, power, text]]) => { PLACES[k] = { type: 'monster', name, icon: shape, col, science: sci, max, power, text }; });
const WILD = { F: 'a Grumpy Woodlouse', f: 'a Pollen Sprite', P: 'a Lost Proton', M: 'a Falling Rock', S: 'a Frostbite Imp', m: 'a Bog Bubble', d: 'a Dust Devil', b: 'a Stray Bacterium', j: 'a Loose Bolt', r: 'a Two-Headed Pigeon', T: 'a Runaway Shopping Trolley', s: 'a Crabby Crab' };
const HEAL = { mission: 2, card: 1, rest: 5 };   // Health per correct mission answer, per due flashcard, per night resting in the Cakelab
/* the crumb trail from the Cakelab to the dragon's lair (shows through the fog) */
const CRUMBS = ['7,3', '7,2'];

/* ===================== brews (the Tuck Shop's stock; coins come from missions, flashcards and the map) =====================
   now: used straight away (client); night: a flag on your state that tonight's fights read, then it wears off */
const BREWS = {
  slushie: { name: 'Electrolyte Slushie', ic: '🥤', cost: 20, when: 'now', what: 'Refills your Health straight away.' },
  aura: { name: 'Bottled Aura', ic: '✨', cost: 30, when: 'night', what: '+5 Strength in tonight\'s fights.' },
  fizz: { name: 'Fizzy Courage', ic: '🫧', cost: 40, when: 'night', what: 'Your hits do half as much again tonight.' },
  calm: { name: 'Decaf Panic', ic: '☕', cost: 25, when: 'night', what: 'You can\'t be knocked out tonight (you stop at 1 Health).' },
};
const BREW_OLD = { 'Fizzy Courage': 'fizz', 'Bottled Aura': 'aura', 'Electrolyte Slushie': 'slushie', 'Decaf Panic': 'calm' };   // dungeon finds before 10 Nov used names

/* ===================== geometry ===================== */
const key = (c, r) => c + ',' + r, unkey = k => k.split(',').map(Number);
function nb(c, r, dir) {
  const odd = r & 1;
  return [[c + 1, r], [c + odd, r + 1], [c - 1 + odd, r + 1], [c - 1, r], [c - 1 + odd, r - 1], [c + odd, r - 1]][dir];
}
const inMap = (c, r) => c >= 0 && r >= 0 && c < COLS && r < ROWS;
const neighbours = (c, r) => [0, 1, 2, 3, 4, 5].map(d => nb(c, r, d)).filter(([x, y]) => inMap(x, y));
const isWater = (c, r) => !inMap(c, r) || WATER.has(T_AT(c, r));
const cube = (c, r) => { const x = c - (r - (r & 1)) / 2; return [x, r, -x - r]; };
const dist = (a, b) => { const p = cube(...a), q = cube(...b); return Math.max(Math.abs(p[0] - q[0]), Math.abs(p[1] - q[1]), Math.abs(p[2] - q[2])); };
const hash = (c, r, s = 0) => { let h = (c * 374761393 + r * 668265263 + s * 2246822519) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const CH1 = ['2,2', '11,2', '4,7'];
const HOME = '7,4', SIGHT = 2, MOVE_BANK = 4, FIRST_MOVES = 6, DAILY_MOVES = 2;
const keysOf = w => CH1.filter(k => (w.boss || {})[k] === 0).length;
const sealedIn = (w, P) => P && (['locked', 'worldboss'].includes(P.type) || (P.type === 'cage' && w.chapter < 2 && keysOf(w) < 3) || (P.ch || 1) > w.chapter);
const walkableIn = (w, c, r) => inMap(c, r) && !isWater(c, r) && !sealedIn(w, PLACES[key(c, r)]);
const visibleOf = st => { const v = new Set(), seen = (st.visited || [HOME]).map(unkey), lifted = (st.lifted || []).map(unkey);
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (seen.some(p => dist(p, [c, r]) <= SIGHT) || lifted.some(p => dist(p, [c, r]) <= 4)) v.add(key(c, r));
  return v; };

/* ===================== dates ===================== */
const dstr = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const TODAY = (() => { const m = /[?&]today=(\d{4}-\d{2}-\d{2})/.exec(location.search); return m ? m[1] : dstr(new Date()); })();
const dayNum = s => Math.round(Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) / 864e5);
const BOSS_MAX = {}; Object.entries(PLACES).forEach(([k, P]) => { if (P.type === 'boss') BOSS_MAX[k] = P.max; });
const newWorld = () => ({ started: TODAY, day: TODAY, chapter: 1, boss: Object.assign({}, BOSS_MAX), hit: {}, log: [] });
const newState = hp => ({ at: HOME, health: hp, mana: 0, moves: FIRST_MOVES, visited: [HOME], lifted: [], shield: false, dens: {}, brews: {},
  report: null, reportDay: null, pending: null, joined: TODAY });

/* ===================== the night =====================
   resolve(world, pubs, states, today) → { world, states } (new objects). Everyone's planned steps happen in order, step by step:
   players on the same boss square at the same step fight it together; small monsters are per player (your own copy);
   knocked out = back to the Cakelab on a quarter of your Health, rest of your moves cancelled. Deterministic for a given day. */
function resolve(w0, pubs, st0, today) {
  const w = JSON.parse(JSON.stringify(w0)), S = JSON.parse(JSON.stringify(st0 || {}));
  let seed = 7; for (const ch of today) seed = (seed * 31 + ch.charCodeAt(0)) % 2147483647;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const elapsed = Math.max(1, Math.min(7, dayNum(today) - dayNum(w.day || today)));
  const tNum = dayNum(today);
  w.boss = Object.assign({}, BOSS_MAX, w.boss || {}); w.hit = w.hit || {};
  const P_ = uid => pubs[uid] || {};
  const ids = Object.keys(S);
  const lines = {}, out = {}, used = {}, visBefore = {}, pos = {}, rewards = {};
  const say = (u, h) => lines[u].push(h);
  const ouch = (u, h) => (S[u].shield ? Math.ceil(h / 2) : h);
  const strOf = u => ((P_(u).str || 10) + (S[u].aura ? 5 : 0)) * (S[u].fizz ? 1.5 : 1);
  const hurt = (u, h) => { S[u].health = Math.max(S[u].calm ? 1 : 0, S[u].health - h); };
  const give = (u, coins, item) => { const r = rewards[u] = rewards[u] || { coins: 0, items: [] }; r.coins += coins || 0; if (item) r.items.push(item); };
  const knockout = u => { out[u] = true; pos[u] = HOME; S[u].at = HOME; S[u].health = Math.max(1, Math.round((P_(u).hp || 15) / 4));
    say(u, `<p class="bad">💫 You are knocked out and wake up in the Cakelab on ${S[u].health} Health. Your other moves tonight are cancelled. Recharge with a mission (+${HEAL.mission} per right answer) or your flashcards (+${HEAL.card} per card).</p>`); };
  const plans = {};
  ids.forEach(u => {
    const st = S[u]; lines[u] = []; used[u] = 0; pos[u] = st.at || HOME; visBefore[u] = visibleOf(st);
    st.visited = st.visited || [HOME]; st.dens = st.dens || {}; st.brews = st.brews || {};
    const pl = P_(u).plan, steps = [];
    if (pl && pl.day === w0.day && Array.isArray(pl.steps)) {   // check every step: adjacent (or staying), walkable, within moves
      let at = pos[u];
      for (const k of pl.steps.slice(0, Math.max(0, st.moves || 0))) {
        const [c, r] = unkey(k);
        if (!(k === at || neighbours(...unkey(at)).some(([x, y]) => x === c && y === r)) || !walkableIn(w, c, r)) break;
        steps.push(k); at = k;
      }
    }
    plans[u] = steps;
  });
  const maxSteps = Math.max(0, ...ids.map(u => plans[u].length));
  for (let i = 0; i < maxSteps; i++) {
    const fights = {};   // boss square → attackers this step
    ids.forEach(u => {
      if (out[u] || i >= plans[u].length) return;
      const k = plans[u][i], P = PLACES[k], [c, r] = unkey(k), st = S[u];
      used[u]++;
      say(u, `<p>Move ${i + 1}: ${k === pos[u] ? 'You stay at' : 'You walk to'} <b>${P ? P.name : LAND[T_AT(c, r)].name}</b>.</p>`);
      pos[u] = k; st.at = k;
      if (!st.visited.includes(k)) st.visited.push(k);
      if (P && P.type === 'boss' && (P.ch || 1) <= w.chapter && w.boss[k] > 0) (fights[k] = fights[k] || []).push(u);
      else if (P && P.type === 'monster') {
        const d = st.dens[k]; let hp = !d ? P.max : d.back ? (d.back > tNum ? 0 : P.max) : d.hp;
        if (!hp) { say(u, `<p>The ${P.name} has gone to lick its wounds. Nothing to fight here tonight.</p>`); return; }
        const dmg = Math.round(strOf(u) * (0.6 + rnd() * 0.8)); hp = Math.max(0, hp - dmg);
        say(u, `<p class="good">You take on the ${P.name}: ${dmg} damage.</p>`);
        const hit = ouch(u, Math.round(P.power * (0.5 + rnd()))); hurt(u, hit);
        say(u, `<p class="bad">It fights back: −${hit} Health.</p>`);
        if (!hp) { st.dens[k] = { back: tNum + 2 }; give(u, 8); say(u, `<p class="lt">★ ${P.name} beaten! +8 coins. It'll be back in two days.</p>`); }
        else { st.dens[k] = { hp }; say(u, `<p>The ${P.name} limps off with ${hp} health left. Come back to finish it.</p>`); }
        if (st.health === 0) knockout(u);
      } else if (!P && rnd() < .3 && WILD[T_AT(c, r)]) {
        const hit = ouch(u, 1 + Math.floor(rnd() * 3)); hurt(u, hit);
        say(u, `<p>On the way you're jumped by <b>${WILD[T_AT(c, r)]}</b>. You see it off (−${hit} Health).</p>`);
        if (st.health === 0) knockout(u);
      } else if (P && P.type === 'dungeon') {
        const roll = rnd();
        if (roll < .35) { give(u, 12); say(u, `<p>You explore a floor of ${P.name} and find <span class="lt">12 coins</span>.</p>`); }
        else if (roll < .65) { const b = rnd() < .5 ? 'fizz' : 'aura'; st.brews[b] = (st.brews[b] || 0) + 1; say(u, `<p>You explore a floor of ${P.name} and find <span class="lt">a ${BREWS[b].name}</span>.</p>`); }
        else say(u, `<p>You explore a floor of ${P.name} and find a single damp glove. Useless.</p>`);
      } else if (P && P.type === 'event') {
        if (rnd() < .4) { give(u, 5); say(u, '<p>You poke the puddle and fish out <span class="lt">5 coins</span>.</p>'); } else say(u, '<p>You poke the puddle. It pokes back. You lose a sock.</p>');
      } else if (P && P.type === 'shop') say(u, '<p>The Tuck Shop is open. You browse, buy nothing, and leave with crumbs.</p>');
      else if (P && P.type === 'home') { const b = st.health; st.health = Math.min(P_(u).hp || 15, st.health + HEAL.rest); say(u, `<p class="good">You rest in the Cakelab: +${st.health - b} Health.</p>`); }
    });
    /* bosses: everyone on the square this step fights together */
    Object.entries(fights).forEach(([k, team]) => {
      const P = PLACES[k];
      const dmg = team.map(u => Math.round(strOf(u) * (0.6 + rnd() * 0.8))), total = dmg.reduce((a, b) => a + b, 0);
      w.boss[k] = Math.max(0, w.boss[k] - total);
      const hk = w.hit[k] = w.hit[k] || {};
      team.forEach((u, j) => {
        hk[u] = true;
        const others = team.length - 1;
        say(u, `<p class="good">You${others ? ` and ${others} other${others > 1 ? 's' : ''}` : ''} attack ${P.name}: ${total} damage (you did ${dmg[j]}).</p>`);
        if (w.boss[k] > 0) { const hit = ouch(u, Math.round(P.power * (0.5 + rnd()))); hurt(u, hit); say(u, `<p class="bad">${P.name} hits back. You lose ${hit} Health.</p>`); if (S[u].health === 0) knockout(u); }
      });
      if (w.boss[k] === 0) {
        const coins = (P.ch || 1) > 1 ? 50 : 40;
        Object.keys(hk).forEach(u => { if (S[u]) { give(u, coins, P.item); lines[u].push(`<p class="lt">★ ${P.name} is defeated! Everyone who fought it gets: ${P.loot.join(', ')}.</p>`); } });
        (w.log = w.log || []).push(`${P.name} was defeated by ${Object.keys(hk).length} player${Object.keys(hk).length > 1 ? 's' : ''}.`);
        if (CH1.includes(k)) ids.forEach(u => say(u, `<p class="new">🔑 Everyone now has <b>${keysOf(w)}/3</b> key pieces.</p>`));
      }
    });
  }
  /* chapter 2: the cage opens for everyone the night the third key piece is won */
  let rescued = false;
  if (w.chapter < 2 && keysOf(w) === 3) { w.chapter = 2; rescued = true; w.log.push('All three key pieces won: the Professor is free! Chapter 2 begins.'); }
  ids.forEach(u => {
    const st = S[u];
    if (rescued) lines[u].unshift('<p class="lt">🔓 With all three key pieces, the cage opens. <b>The Professor is free!</b> Chapter 2 begins.</p>');
    const vis = visibleOf(st);
    Object.entries(PLACES).forEach(([k, P]) => { if (vis.has(k) && !visBefore[u].has(k)) lines[u].push(`<p class="new">🗺 The fog clears: you can now see <b>${P.name}</b>.</p>`); });
    if (st.shield) lines[u].push('<p class="lt">🛡 Your Jam Shield took half of every hit tonight. It has worn off.</p>');
    ['aura', 'fizz', 'calm'].forEach(b => { if (st[b]) lines[u].push(`<p class="lt">${BREWS[b].ic} Your ${BREWS[b].name} has worn off.</p>`); st[b] = false; });
    st.shield = false;
    Object.keys(st.brews).forEach(n => { if (BREW_OLD[n]) { st.brews[BREW_OLD[n]] = (st.brews[BREW_OLD[n]] || 0) + st.brews[n]; delete st.brews[n]; } });
    st.moves = Math.min(MOVE_BANK, Math.max(0, (st.moves || 0) - used[u]) + DAILY_MOVES * elapsed);
    if (!plans[u].length) lines[u].push(`<p>You didn't plan any moves${elapsed > 1 ? ' for a while' : ''}, so you stayed at ${PLACES[st.at] ? PLACES[st.at].name : 'your spot'}.</p>`);
    if (rewards[u]) { const p = st.pending || { coins: 0, items: [] }; p.coins = (p.coins || 0) + rewards[u].coins; p.items = [...(p.items || []), ...rewards[u].items]; st.pending = p; }
    st.report = lines[u]; st.reportDay = today;
  });
  w.day = today; delete w.lock;
  w.lastNight = { day: today, players: ids.length, moved: ids.filter(u => plans[u].length).length };
  return { world: w, states: S, rescued };
}

/* ===================== reading and writing the shared world ===================== */
let db = null, uid = null, world = null, pubs = {}, states = {};
const ref = p => db.ref('bland' + (p ? '/' + p : ''));
function init(rtdb, user) { db = rtdb; uid = user ? user.uid : null; }
async function load() {
  const v = (await ref().once('value')).val() || {};
  world = v.world ? Object.assign(newWorld(), v.world) : null; pubs = v.pub || {}; states = v.state || {};
  return { world, pubs, states };
}
/* first player ever creates the world; a new player gets a state in the Cakelab */
async function join(profile) {
  if (!world) {
    const r = await ref('world').transaction(cur => cur || newWorld());
    world = Object.assign(newWorld(), r.snapshot.val());
  }
  if (!states[uid]) { states[uid] = newState(profile.hp); await ref('state/' + uid).set(states[uid]); }
  await publish(profile);
}
function publish(profile, plan) {
  const cur = pubs[uid] || {};
  const p = Object.assign({}, cur, profile, { t: Date.now() });
  if (plan !== undefined) p.plan = { day: world.day, steps: plan };
  pubs[uid] = p;
  return ref('pub/' + uid).set(p);
}
const savePlan = steps => publish({}, steps);
function saveMine(fields) { Object.assign(states[uid], fields); return ref('state/' + uid).update(fields); }
/* the night: run if the world's day is before today. A transaction on the lock stops two visitors running it at once. */
async function runNightIfDue(force) {
  if (!world || (!force && world.day >= TODAY)) return null;
  const lock = await ref('world/lock').transaction(cur => (cur && cur.day === TODAY && Date.now() - cur.at < 120000) ? undefined : { day: TODAY, by: uid, at: Date.now() });
  if (!lock.committed) return null;
  await load();
  if (!force && world.day >= TODAY) return null;
  if (force && world.day >= TODAY) world.day = dstr(new Date(Date.parse(TODAY + 'T12:00:00') - 864e5));   // admin: replay tonight
  const res = resolve(world, pubs, states, TODAY);
  const upd = { world: res.world };
  Object.entries(res.states).forEach(([u, st]) => { upd['state/' + u] = st; });
  await ref().update(upd);
  world = res.world; states = res.states;
  return res;
}
const me = () => states[uid];

return { ROWS_TXT, COLS, ROWS, T_AT, WATER, LAND, WATER_NAME, PLACES, DENS, WILD, HEAL, CRUMBS, CH1, HOME, SIGHT, MOVE_BANK,
  BREWS, key, unkey, nb, inMap, neighbours, isWater, cube, dist, hash, keysOf, sealedIn, walkableIn, visibleOf, TODAY, dayNum, dstr, BOSS_MAX,
  newWorld, newState, resolve, init, load, join, publish, savePlan, saveMine, runNightIfDue, me,
  get world() { return world; }, get pubs() { return pubs; }, get states() { return states; }, get uid() { return uid; } };
})();
