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
  /* rows 13–16: solid rock between the two layers (thick enough that nothing on top can see or reach below) */
  '####################',
  '####################',
  '####################',
  '####################',
  /* rows 17–25: the Underworld (17 Nov 2026). Same grid, so moves, fog, fights and the night all work as on top.
     # rock, L lava, u the Sunless Lake (none can be crossed) · c Hollow Road, g Glowshroom Grove, x Crystal Gallery, a Ember Flats, k Fossil Beds */
  '###gg#####xxxx######',
  '##gggcc##cxxxxc#aa##',
  '#ggguucccccxxcccaaa#',
  '#gguuucc#cc##ccLLaa#',
  '##gcuccc##kkkccLLaaa',
  '###ccc#ckkkkk#ccLaa#',
  '####cccckkkk##cccaa#',
  '#####c##kkk####ca###',
  '####################',
];
const SURF_ROWS = 13, UNDER0 = 17, MINE = '12,4', LIFT = '9,19';   // the lift joins the two layers: ride it from the mine once you've dug through
const COLS = 20, ROWS = ROWS_TXT.length, HEXR = 30, W3 = Math.sqrt(3) * HEXR;
const VB_W = Math.ceil(W3 * (COLS + 0.5) + 8), VB_H = Math.ceil(HEXR * 1.5 * (ROWS - 1) + 2 * HEXR + 8);
const T_AT = (c, r) => (ROWS_TXT[r] || '')[c] || '~';
const WATER = new Set(['~', 'o', '=', '#', 'L', 'u']);   // everything you can't walk on
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
  c: { col: '#6b6475', name: 'The Hollow Road', decor: [['rock', .6], ['spire', .6]] },
  g: { col: '#3f6b63', name: 'Glowshroom Grove', decor: [['glowcap', 2.2], ['spire', .3]] },
  x: { col: '#5b6aa8', name: 'The Crystal Gallery', decor: [['gem', 2], ['rock', .3]] },
  a: { col: '#7a4a3a', name: 'The Ember Flats', decor: [['ember', 1.5], ['rock', .5]] },
  k: { col: '#8a7f6a', name: 'The Fossil Beds', decor: [['bone', 1.6], ['rock', .5]] },
};
const WATER_NAME = { '~': ['The Revision Sea', 'Endless. Salty. You cannot swim in a lab coat.'], o: ['Lost Property Lake', 'Full of single gloves and PE kits. Too deep to wade.'], '=': ['The River Tangent', 'Flows off in a direction nobody expected. Cross at a bridge.'],
  '#': ['Solid rock', 'No way through. It has been here for 300 million years and is not moving for you.'], L: ['The Lava Lake', 'Molten rock. Hot enough to melt your shoes, your sword and your plans.'], u: ['The Sunless Lake', 'Black, still and very cold. Something ripples. Best not.'] };

const PLACES = {
  '7,4': { type: 'home', name: 'The Cakelab', icon: 'home', text: 'Your base: a lab that smells of baking. Everyone starts here and comes back here when knocked out. Safe — nothing attacks you here, and resting refills your Health.' },
  '6,5': { type: 'shop', name: 'The Tuck Shop', icon: 'shop', text: 'Spend your coins on brews. Stand here to buy; drink them anywhere (Spells & brews).', stock: true },
  '6,6': { type: 'event', name: 'Suspicious Puddle', icon: 'ask', text: 'Something glints at the bottom. A random event every night: a coin, a brew, or a very wet sock.' },
  /* the starter boss (17 Nov balance pass): two squares from the Cakelab, beatable alone by a brand-new player in about
     three nights without being knocked out, and back two days after it falls so every new player gets one */
  '6,2': { type: 'boss', ch: 1, starter: true, respawn: 2, science: 'b', name: 'The Crumb Goblin', icon: 'goblin', max: 90, power: 2, tier: 'Starter', coins: 25, brew: 'slushie',
    text: 'Crumbmaw\'s lookout, guarding the crumb trail with a stolen cake fork. Small, greedy and beatable on your own: a good first boss. It comes back two days after it falls.', loot: ['+25 coins each', 'an Electrolyte Slushie each'] },
  /* chapter 1: the dragon's three guards, each holding a piece of the cage key */
  '2,2': { type: 'boss', ch: 1, science: 'b', name: 'The Spore Lord', icon: 'spore', max: 650, power: 5, tier: 'Tough',
    text: 'A mushroom the size of a house, deep in Greenhouse Woods. Breathes clouds of spores and regrows faster than you can chop. Holds one piece of the cage key.', item: 'mito', loot: ['🔑 Key piece 1 of 3', 'Mitochondria Gauntlet (Lowkey Legendary)', '+40 coins each'] },
  '11,2': { type: 'boss', ch: 1, science: 'p', name: 'Granitus the Stone Golem', icon: 'golem', max: 800, power: 6, tier: 'Very tough',
    text: 'A walking cliff in Gravity Peaks. It will not move unless an unbalanced force acts on it. You are the unbalanced force. Holds one piece of the cage key.', item: 'frictionless', loot: ['🔑 Key piece 2 of 3', 'Frictionless Slippers (Lowkey Legendary)', '+40 coins each'] },
  '4,7': { type: 'boss', ch: 1, science: 'c', name: 'The Acid Hydra', icon: 'hydra', max: 450, power: 4, tier: 'Next step',
    text: 'Three heads, all of them sour. It lurks in the Acid Marsh and spits things that fizz. Holds one piece of the cage key.', item: 'shield', loot: ['🔑 Key piece 3 of 3', 'Periodic Table Shield (Rare)', '+40 coins each'] },
  '7,0': { type: 'worldboss', name: 'Crumbmaw the Dragon', icon: 'dragonzz', text: 'Asleep in its lair on a hoard of stolen lab equipment (and one stolen Professor). Far too strong for anyone alone. When it wakes, everyone fights it together.' },
  '7,1': { type: 'cage', name: 'The Professor\'s Cage', icon: 'prof', text: 'The Professor is locked in here, looking cross and slightly crumbly. The lock needs all three key pieces — win them from the Spore Lord, the Stone Golem and the Acid Hydra.' },
  /* chapter 2: wake up once the Professor is free */
  '3,10': { type: 'boss', ch: 2, science: 'b', name: 'The Superbug', icon: 'superbug', max: 1000, power: 6, tier: 'Tough',
    text: 'A bacterium that has survived every antibiotic thrown at it, so now it is enormous and very smug. Lives in the Petri Swamp. Natural selection made it; you lot will unmake it.', item: 'grass', loot: ['Touch-Grass Boots (Rare)', 'Electrolyte Slushie', '+50 coins each'] },
  '16,4': { type: 'boss', ch: 2, science: 'c', name: 'The Rust Wyrm', icon: 'rustwyrm', max: 1000, power: 7, tier: 'Tough',
    text: 'A great iron serpent in Scrap Heap Hills, slowly oxidising. Every rainy night it gets a bit flakier and a lot angrier.', item: 'chainmail', loot: ['Chainmail of Covalent Bonds (Rare)', 'Fizzy Courage', '+50 coins each'] },
  '17,6': { type: 'boss', ch: 2, science: 'p', name: 'The Half-Life Horror', icon: 'halflife', max: 1200, power: 8, tier: 'Very tough',
    text: 'Something leaked out of the old reactor. Half of it has already decayed. The other half is very much still here.', item: 'kilt', loot: ['Kilt of Kinetic Energy (Rare)', 'Bottled Aura', '+50 coins each'] },
  '16,7': { type: 'dungeon', ch: 2, science: 'p', name: 'The Old Reactor', icon: 'reactor', subs: ['P7b', 'P7c'], rooms: ['the control room', 'the turbine hall', 'the reactor core'], text: 'A broken-down nuclear power station, cracked and humming. Three floors of radioactivity questions (wear a very sensible lead suit).' },
  '2,5': { type: 'dungeon', science: 'b', name: 'The Petri Dish Pit', icon: 'cave', subs: ['B1b', 'B2b', 'B2c', 'B5a', 'B5c'], rooms: ['the agar slopes', 'the colony caves', 'the incubator'], text: 'Three floors deep and faintly warm. Every floor is a room of questions on cells, microbes and enzymes.' },
  '12,6': { type: 'dungeon', science: 'p', name: 'Black Hole Basement', icon: 'cave', subs: ['P8b', 'P8c', 'P1c'], rooms: ['the orbit stairs', 'the red giant gallery', 'the event horizon'], text: 'Things go in. Some come out. Three floors of questions on gravity, orbits and stars.' },
  '5,8': { type: 'dungeon', science: 'c', name: 'Fume Cupboard of Doom', icon: 'cave', subs: ['C2e', 'C2f', 'C2g', 'C3b'], rooms: ['the reagent shelves', 'the titration tunnel', 'the back of the cupboard'], text: 'Keep the sash down. Three floors of questions on acids, salts, tests and rates.' },
  '18,7': { type: 'locked', name: 'The Ancient Gate', icon: 'gate', text: 'A stone gate humming with blue light at the far edge of the Glowing Wastes. Locked. It leads somewhere new — a later chapter.' },
  '0,4': { type: 'locked', name: 'The Broken Bridge', icon: 'bridge', text: 'Half a bridge, leading west into the sea mist. Someone will have to fix it one day — a later chapter (the Professor has plans).' },
  /* the mine (17 Nov): five floors, and your depth is kept from day to day. Clear the bottom floor once and the lift to the Underworld is yours. */
  '12,4': { type: 'dungeon', keep: true, name: 'The Abandoned Mine', icon: 'mine', subs: ['C2a', 'C2d', 'C1f', 'C3a', 'P4b', 'P4c', 'P6b'],
    rooms: ['the boarded-up entrance', 'the cart tracks', 'the flooded gallery', 'the old workings', 'the deep seam'],
    text: 'Somebody has pulled the boards off. Five floors of questions on metals, energy and magnets, and you keep your place from one day to the next. Strange noises come up from the very bottom.' },
  /* ---------- the Underworld ---------- */
  '9,19': { type: 'lift', name: 'The Mine Lift', icon: 'lift', text: 'A rusty cage on a very long cable. It goes up to the Abandoned Mine and, more reluctantly, back down.' },
  '18,21': { type: 'boss', ch: 1, deep: true, coins: 100, science: 'p', name: 'Magmaw', icon: 'magmaw', max: 1500, power: 9, tier: 'Hardest',
    text: 'A boulder with a furnace for a mouth, sitting by the Lava Lake at the hot end of the Ember Flats. It has been warming the Underworld for a very long time and has opinions about heat.', brew: 'fizz', loot: ['+100 coins each', 'a Fizzy Courage each'] },
  '9,23': { type: 'dungeon', science: 'b', name: 'The Bone Library', icon: 'cave', subs: ['B3a', 'B3b', 'B4b', 'B5b'], rooms: ['the fossil stacks', 'the family-tree room', 'the extinct wing'], text: 'Every shelf is a rock layer. Three floors of questions on reproduction, inheritance and energy in ecosystems.' },
  '11,17': { type: 'dungeon', science: 'c', name: 'The Crystal Vault', icon: 'cave', subs: ['C1c', 'C1d', 'C1f', 'C1g'], rooms: ['the ionic hall', 'the covalent corridor', 'the giant lattice'], text: 'Everything in here has a very regular structure. Three floors of questions on atoms, the Periodic Table and bonding.' },
};
/* small monsters you can beat on your own in a night or two (respawn 2 days after they're beaten) */
const DENS = {
  '5,3': ['Fruit Fly Swarm', 'bat', '#a16207', 'b', 30, 2, 'A buzzing cloud that came for the cake and stayed for the fight.'],
  '3,1': ['Slime Mould', 'slime', '#65a30d', 'b', 38, 3, 'Not quite a fungus, not quite an animal, definitely sticky.'],
  '12,3': ['Rogue Electron', 'star', '#38bdf8', 'p', 35, 3, 'Escaped from a shell and is very negative about it.'],
  '3,6': ['Acid Frog', 'jelly', '#84cc16', 'c', 38, 3, 'pH 2 and proud. Don\'t lick it.'],
  '11,7': ['Static Sandling', 'cloud', '#eab308', 'p', 42, 3, 'Rubbed against too many sand dunes. Now it zaps.'],
  '2,9': ['Germ Gang', 'spike', '#10b981', 'b', 48, 4, 'Three bacteria in a trench coat. Divides when nervous.'],
  '17,4': ['Rust Mite', 'crab', '#c2410c', 'c', 48, 4, 'Eats iron, leaves flakes. Keep your sword dry.'],
  '16,8': ['Glow Rat', 'imp', '#bef264', 'p', 55, 4, 'Lives near the reactor. Glows faintly. Nobody pets it.'],
  /* the Underworld: tougher than anything on top */
  '3,18': ['Glowshroom Gobbler', 'plant', '#2dd4bf', 'b', 60, 5, 'Makes its own light but not its own food: there is no photosynthesis down here.'],
  '12,18': ['Lattice Lurker', 'crystal', '#67e8f9', 'c', 65, 5, 'A giant ionic lattice with a short temper. High melting point, low patience.'],
  '6,21': ['Lodestone Lurker', 'magnet', '#ef4444', 'p', 68, 5, 'Only attracts iron, steel, nickel and cobalt. Takes that personally.'],
  '10,22': ['Fossil Fidget', 'worm', '#d6d3d1', 'b', 70, 5, 'Extinct for 300 million years and still fidgeting.'],
  '17,19': ['Convection Wisp', 'flame', '#fb923c', 'p', 75, 6, 'Hot, less dense and rising. Will not stop telling you about it.'],
};
Object.entries(DENS).forEach(([k, [name, shape, col, sci, max, power, text]]) => { PLACES[k] = { type: 'monster', name, icon: shape, col, science: sci, max, power, text }; });
const WILD = { F: 'a Grumpy Woodlouse', f: 'a Pollen Sprite', P: 'a Lost Proton', M: 'a Falling Rock', S: 'a Frostbite Imp', m: 'a Bog Bubble', d: 'a Dust Devil', b: 'a Stray Bacterium', j: 'a Loose Bolt', r: 'a Two-Headed Pigeon', T: 'a Runaway Shopping Trolley', s: 'a Crabby Crab',
  c: 'a Dripping Stalactite', g: 'a Spore Puff', x: 'a Sharp Reflection', a: 'a Spitting Ember', k: 'a Restless Trilobite' };
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
/* spells (mana) and dungeon floor coins: the numbers live here so the map and the admin showcase read the same list (17 Nov) */
const SPELL_INFO = [
  { id: 'heal', ic: '💚', name: 'Patch Up', cost: 3, what: '+5 Health now.' },
  { id: 'shield', ic: '🛡', name: 'Jam Shield', cost: 4, what: 'Take half damage tonight.' },
  { id: 'fog', ic: '🌫', name: 'Lift the Fog', cost: 5, what: 'Clears the fog 4 steps around where you are now, for good.' },
];
const FLOOR_COINS = [8, 12, 15, 18, 22];
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
/* 17 Nov balance pass: bosses already hurt in the live world keep the same share of damage under their new maximum */
const OLD_MAX = { '2,2': 900, '11,2': 1000, '4,7': 820, '3,10': 1000, '16,4': 950, '17,6': 1100, '18,21': 1300 };
function bossNow(w) {
  const b = Object.assign({}, BOSS_MAX, (w && w.boss) || {});
  if (w && !w.bal) Object.keys(OLD_MAX).forEach(k => { if (w.boss && w.boss[k] != null && w.boss[k] > 0) b[k] = Math.max(1, Math.min(BOSS_MAX[k], Math.round(w.boss[k] * BOSS_MAX[k] / OLD_MAX[k]))); });
  Object.keys(b).forEach(k => { if (BOSS_MAX[k] != null) b[k] = Math.min(b[k], BOSS_MAX[k]); });
  return b;
}
const newWorld = () => ({ started: TODAY, day: TODAY, chapter: 1, boss: Object.assign({}, BOSS_MAX), hit: {}, log: [], bal: 1 });
/* bonus = extra moves given by the teacher (admin console): no cap, kept until used, spent after the normal moves */
const movesOf = st => ((st && st.moves) || 0) + ((st && st.bonus) || 0);
const newState = hp => ({ at: HOME, health: hp, mana: 0, moves: FIRST_MOVES, visited: [HOME], lifted: [], shield: false, dens: {}, brews: {},
  report: null, reportDay: null, pending: null, joined: TODAY });

/* ---------- boss stories (16 Nov): a few lines each, used in the morning report and the map panel.
   meet = the first time you fight it, taunt = when it is hit, low = when it drops under a third, fall = its defeat.
   Each boss is built on a misconception from its science; keep the science inside the Double Award spec. ---------- */
const BOSS_STORY = {
  '6,2': { meet: 'A small green goblin with a cake fork jumps out. “Crumbs only spread if someone carries them,” it squeaks. (Not so: particles spread out on their own, from where there are lots to where there are few. That\'s diffusion, and it needs no energy.)',
    taunt: ['“Mine! All the crumbs are MINE!”', '“Active transport? Far too much effort.”', 'It hides a crumb behind its back. Badly.'],
    low: 'The Crumb Goblin is out of breath and nearly out of crumbs.', fall: 'The Crumb Goblin drops its fork and scarpers north. It\'ll be back for more crumbs in a couple of days.' },
  '2,2': { meet: 'The Spore Lord looms out of the mist. “Fungi are just plants that forgot to be green,” it booms. (They are not: no chlorophyll, no photosynthesis, walls of chitin.)',
    taunt: ['“I feed on the dead. You look tired.”', '“Chop away. My hyphae go for miles.”', '“Spores! Spores for everyone!”'],
    low: 'The Spore Lord’s cap is sagging and it has stopped making speeches.', fall: 'The Spore Lord folds up like a wet umbrella. In the mush where it stood, something glints: a piece of a key.' },
  '11,2': { meet: 'Granitus opens two amber eyes. “I DO NOT MOVE. THINGS ONLY MOVE WHEN PUSHED, AND STOP WHEN THE PUSHING STOPS.” (Newton would like a word about that second part.)',
    taunt: ['“BALANCED FORCES. I STAY PUT.”', '“YOUR FORCE IS SMALL. MY MASS IS NOT.”', '“THAT TICKLED. SLIGHTLY.”'],
    low: 'Cracks are spreading across Granitus. An unbalanced force is doing exactly what unbalanced forces do.', fall: 'Granitus topples, very slowly, and then all at once. A piece of a key rolls out of the rubble.' },
  '4,7': { meet: 'Three heads rise from the marsh. “All acids burn through anything,” hisses one. “Even lemon juice?” asks another. They start arguing. (Weak acids are in your lunch.)',
    taunt: ['“pH 1 and proud of it!”', '“Neutralise THIS.” (Spits. Misses.)', 'Two heads blame the third for that one.'],
    low: 'The Acid Hydra is down to hissing with one head at a time. The marsh around it has gone suspiciously neutral.', fall: 'The Hydra fizzes, bubbles and dissolves into salt and water. Bobbing in the puddle: a piece of a key.' },
  '3,10': { meet: 'The Superbug swaggers over. “Antibiotics made me STRONGER. I mutated on purpose!” (It did not: the mutation was random. The antibiotic just killed off its rivals.)',
    taunt: ['“I’ve survived penicillin. You’re nothing.”', '“Resistance is… well, me.”', '“Divide and conquer! Mostly divide.”'],
    low: 'The Superbug has stopped dividing and started sweating.', fall: 'The Superbug pops. Natural selection giveth, and you lot taketh away.' },
  '16,4': { meet: 'A long iron shape uncoils from the scrap. “Rust is just dirt,” the Wyrm rasps. “It wipes off.” (It does not: rusting is a chemical reaction of iron with water and oxygen.)',
    taunt: ['“I’m not flaking. YOU’RE flaking.”', '“Oxidation is a lifestyle.”', 'A bit falls off. It pretends not to notice.'],
    low: 'The Rust Wyrm is more orange powder than serpent now.', fall: 'The Rust Wyrm crumbles into a heap of iron(III) oxide. Somebody should have galvanised it.' },
  '18,21': { meet: 'The boulder opens one glowing eye. “HEAT RISES,” Magmaw rumbles. “EVERYONE KNOWS THAT.” (Not quite: hot <i>fluids</i> rise, because they are less dense. Heat itself goes from hot to cold, in any direction.)',
    taunt: ['“I AM A VERY GOOD CONDUCTOR.” (It is rock. It is not.)', '“COLD IS COMING IN!” (Cold does not move. Heat is going out.)', 'Magmaw radiates smugly. It is dull and black, so it is rather good at that.'],
    low: 'Magmaw is glowing dull red instead of white. It is transferring energy to the surroundings faster than it would like.', fall: 'Magmaw cools, cracks and goes dark: just a boulder now. The Ember Flats are noticeably less ember.' },
  '17,6': { meet: 'A flickering shape drifts out of the reactor. “After one half-life I’ll be gone,” it whispers. (No: after one half-life, half of it is left. And half of that after the next.)',
    taunt: ['“You can’t rush decay.”', '“Half of me didn’t feel that.”', '“Tick. Tick. Tick.”'],
    low: 'The Half-Life Horror keeps halving. There is not much left to halve.', fall: 'The Horror halves one last time, and then there is nothing left to count.' },
};
/* ---------- weekly events (16 Nov): one a week, the same for everyone, picked from the date ---------- */
const EVENTS = [
  { id: 'coins', ic: '🪙', name: 'Market week', text: 'Small monsters and the puddle pay double coins.' },
  { id: 'rage', ic: '😡', name: 'Boss rage week', text: 'Bosses hit half as hard again, but they get careless: your attacks do 25% more damage.' },
  { id: 'quiet', ic: '🌿', name: 'Quiet week', text: 'The wild critters are staying home. Nothing jumps you on open land.' },
  { id: 'rest', ic: '🛏', name: 'Cosy week', text: 'A night’s rest in the Cakelab heals twice as much.' },
  { id: 'rally', ic: '📣', name: 'Rally week', text: 'Fighting a boss side by side gives double the rally bonus.' },
];
const eventOf = day => EVENTS[Math.floor((dayNum(day) + 3) / 7) % EVENTS.length];   // weeks run Monday to Sunday
const RALLY = 0.1;   // +10% boss damage for each ally on the square at the same step (max +40%)

/* ===================== the night (rewritten 17 Nov: moves now happen when you make them) =====================
   Walking, small monsters, critters, the puddle, resting, shops and dungeons all happen at once on the map page.
   Only boss fights wait: stepping onto a living boss makes camp (state.camp = {k, n, day}); every move spent there is one
   attack at midnight, and everyone camped at the same boss fights together, round by round (rally = the others in that round).
   resolve(world, pubs, states, today) → { world, states, rescued } (new objects). Deterministic for a given day.
   Also: refills moves, wears off tonight's brews and shield, writes each player's short morning report. */
function resolve(w0, pubs, st0, today) {
  const w = JSON.parse(JSON.stringify(w0)), S = JSON.parse(JSON.stringify(st0 || {}));
  let seed = 7; for (const ch of today) seed = (seed * 31 + ch.charCodeAt(0)) % 2147483647;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const elapsed = Math.max(1, Math.min(7, dayNum(today) - dayNum(w.day || today)));
  const EV = eventOf(w0.day || today).id;   // the event of the day the camps were made
  const P_ = uid => pubs[uid] || {};
  const nameOf = u => (P_(u).name || 'Someone').split(' ')[0];
  const list = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
  w.boss = bossNow(w); w.bal = 1; w.hit = w.hit || {}; w.back = w.back || {};
  /* bosses that come back (the starter): full health again on the day they're due, with a fresh list of who hit them */
  Object.entries(w.back).forEach(([k, d]) => { if (dayNum(today) >= d && PLACES[k]) { w.boss[k] = PLACES[k].max; w.hit[k] = {}; delete w.back[k]; } });
  const ids = Object.keys(S).filter(u => S[u] && S[u].at);   // a state the admin made just to hold extra moves waits until its player joins
  const lines = {}, out = {}, rewards = {}, fought = {};
  const say = (u, h) => lines[u].push(h);
  const ouch = (u, h) => (S[u].shield ? Math.ceil(h / 2) : h);
  const strOf = u => ((P_(u).str || 10) + (S[u].aura ? 5 : 0)) * (S[u].fizz ? 1.5 : 1);
  const hurt = (u, h) => { S[u].health = Math.max(S[u].calm ? 1 : 0, S[u].health - h); };
  const give = (u, coins, item) => { const r = rewards[u] = rewards[u] || { coins: 0, items: [] }; r.coins += coins || 0; if (item) r.items.push(item); };
  ids.forEach(u => { lines[u] = []; S[u].dens = S[u].dens || {}; S[u].brews = S[u].brews || {}; });
  /* the camps: by boss, each player with the number of attacks they queued */
  const camps = {};
  ids.forEach(u => { const c = S[u].camp, P = c && PLACES[c.k];
    if (c && c.day === w0.day && S[u].at === c.k && P && P.type === 'boss' && (P.ch || 1) <= w.chapter && w.boss[c.k] > 0 && c.n > 0) (camps[c.k] = camps[c.k] || []).push([u, c.n]); });
  Object.entries(camps).forEach(([k, team]) => {
    const P = PLACES[k], ST = BOSS_STORY[k] || {}, hk = w.hit[k] = w.hit[k] || {}, start = w.boss[k];
    const rounds = Math.max(...team.map(([, n]) => n)), dealt = {};
    team.forEach(([u]) => { if (!hk[u] && ST.meet) say(u, `<p class="new">${ST.meet}</p>`); hk[u] = true; dealt[u] = 0; fought[u] = P.name; });
    for (let i = 0; i < rounds && w.boss[k] > 0; i++) {
      const now = team.filter(([u, n]) => n > i && !out[u]).map(([u]) => u); if (!now.length) break;
      const bonus = Math.min(4, now.length - 1) * RALLY * (EV === 'rally' ? 2 : 1), mult = (1 + bonus) * (EV === 'rage' ? 1.25 : 1);
      now.forEach(u => { const d = Math.round(strOf(u) * (0.6 + rnd() * 0.8) * mult); dealt[u] += d; w.boss[k] = Math.max(0, w.boss[k] - d); });
      if (w.boss[k] > 0) now.forEach(u => { const h = ouch(u, Math.round(P.power * (0.5 + rnd()) * (EV === 'rage' ? 1.5 : 1))); hurt(u, h); dealt['hit_' + u] = (dealt['hit_' + u] || 0) + h;
        if (S[u].health === 0) { out[u] = true; S[u].at = HOME; S[u].health = Math.max(1, Math.round((P_(u).hp || 15) / 4)); } });
    }
    const total = start - w.boss[k], ST2 = BOSS_STORY[k] || {};
    team.forEach(([u, n]) => {
      const mates = team.filter(([x]) => x !== u).map(([x]) => nameOf(x));
      say(u, `<p class="good">⚔ At midnight ${mates.length ? `you and ${list(mates)} attack ${P.name} together` : `you attack ${P.name}`}: ${total} damage in all${mates.length ? ` (you did ${dealt[u]})` : ''}.${mates.length ? ` 📣 Rally bonus for fighting side by side.` : ''}</p>`);
      if (dealt['hit_' + u]) say(u, `<p class="bad">${P.name} hits back: −${dealt['hit_' + u]} Health.</p>`);
      if (out[u]) say(u, `<p class="bad">💫 You are knocked out and wake up in the Cakelab on ${S[u].health} Health. Missions (+${HEAL.mission} per right answer) and flashcards (+${HEAL.card} per card) heal you.</p>`);
      else if (w.boss[k] > 0) say(u, w.boss[k] <= P.max / 3 && start > P.max / 3 && ST2.low ? `<p class="new">${ST2.low}</p>` : ST2.taunt ? `<p>${P.name}: <i>${ST2.taunt[Math.floor(rnd() * ST2.taunt.length)]}</i></p>` : '');
    });
    if (w.boss[k] === 0) {
      const coins = P.coins || ((P.ch || 1) > 1 ? 50 : 40);
      Object.keys(hk).forEach(u => { if (S[u]) { lines[u] = lines[u] || []; give(u, coins, P.item); if (P.brew) { S[u].brews = S[u].brews || {}; S[u].brews[P.brew] = (S[u].brews[P.brew] || 0) + 1; }
        if (ST2.fall) lines[u].push(`<p class="new">${ST2.fall}</p>`); lines[u].push(`<p class="lt">★ ${P.name} is defeated! Everyone who fought it gets: ${P.loot.join(', ')}.</p>`); } });
      if (P.respawn) w.back[k] = dayNum(today) + P.respawn;
      (w.log = w.log || []).push(`${P.name} was defeated by ${Object.keys(hk).length} player${Object.keys(hk).length > 1 ? 's' : ''}.`);
      if (CH1.includes(k)) ids.forEach(u => say(u, `<p class="new">🔑 Everyone now has <b>${keysOf(w)}/3</b> key pieces.</p>`));
    }
  });
  /* chapter 2: the cage opens for everyone the night the third key piece is won */
  let rescued = false;
  if (w.chapter < 2 && keysOf(w) === 3) { w.chapter = 2; rescued = true; (w.log = w.log || []).push('All three key pieces won: the Professor is free! Chapter 2 begins.'); }
  ids.forEach(u => {
    const st = S[u];
    if (rescued) lines[u].unshift('<p class="lt">🔓 With all three key pieces, the cage opens. <b>The Professor is free!</b> Chapter 2 begins.</p>');
    if (st.shield) lines[u].push('<p class="lt">🛡 Your Jam Shield has worn off.</p>');
    ['aura', 'fizz', 'calm'].forEach(b => { if (st[b]) lines[u].push(`<p class="lt">${BREWS[b].ic} Your ${BREWS[b].name} has worn off.</p>`); st[b] = false; });
    st.shield = false; st.camp = null;
    Object.keys(st.brews).forEach(n => { if (BREW_OLD[n]) { st.brews[BREW_OLD[n]] = (st.brews[BREW_OLD[n]] || 0) + st.brews[n]; delete st.brews[n]; } });
    /* new moves: moves were already spent as they were made. Someone who joined today keeps their 6 first-day moves. */
    const before = st.moves || 0;
    if (st.joined !== today) st.moves = Math.max(before, Math.min(MOVE_BANK, before + DAILY_MOVES * elapsed));
    if (rewards[u]) { const p = st.pending || { coins: 0, items: [] }; p.coins = (p.coins || 0) + rewards[u].coins; p.items = [...(p.items || []), ...rewards[u].items]; st.pending = p; }
    const others = ids.filter(x => x !== u && fought[x] && fought[x] !== fought[u]).map(x => `<b>${nameOf(x)}</b> fought ${fought[x]}${out[x] ? ' and was knocked out' : ''}`);
    if (others.length) lines[u].push(`<p>👣 Elsewhere last night: ${others.join('; ')}.</p>`);
    const ev1 = eventOf(today); if (ev1.id !== EV || dayNum(today) % 7 === 4) lines[u].push(`<p class="lt">${ev1.ic} This week is <b>${ev1.name}</b>: ${ev1.text}</p>`);
    lines[u].push(`<p>🌙 A new day: you have <b>${movesOf(st)}</b> move${movesOf(st) === 1 ? '' : 's'}.</p>`);
    st.report = lines[u]; st.reportDay = today; st.big = !!(fought[u] || rescued || lines[u].some(l => /defeated!/.test(l)));   // big = worth a pop-up
  });
  w.day = today; delete w.lock;
  w.lastNight = { day: today, players: ids.length, moved: Object.keys(fought).length };
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
  if (!states[uid] || !states[uid].at) { states[uid] = Object.assign(newState(profile.hp), states[uid] || {}); await ref('state/' + uid).set(states[uid]); }   // (may already hold extra moves from the teacher)
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
/* teamwork (16 Nov): give a brew to, or patch up, another player (their state is writable by any signed-in player) */
async function aid(to, what, from) {
  if (what.brew) await ref(`state/${to}/brews/${what.brew}`).transaction(n => (n || 0) + 1);
  if (what.heal) await ref(`state/${to}/health`).transaction(h => Math.min((pubs[to] || {}).hp || 15, (h || 0) + what.heal));
  await ref(`state/${to}/inbox`).transaction(a => (a || []).concat(what.brew ? `🎁 ${from} gave you ${BREWS[what.brew].ic} ${BREWS[what.brew].name}.` : `🩹 ${from} patched you up: +${what.heal} Health.`).slice(-5));
  if (states[to]) { if (what.brew) { states[to].brews = states[to].brews || {}; states[to].brews[what.brew] = (states[to].brews[what.brew] || 0) + 1; } }
}
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
  const NIGHT_FIELDS = ['at', 'health', 'moves', 'bonus', 'camp', 'report', 'reportDay', 'big', 'pending', 'shield', 'aura', 'fizz', 'calm', 'brews'];
  Object.entries(res.states).forEach(([u, st]) => { if (!st || !st.at) return; NIGHT_FIELDS.forEach(f => { upd[`state/${u}/${f}`] = st[f] === undefined ? null : st[f]; }); });
  await ref().update(upd);
  world = res.world; states = res.states;
  return res;
}
const me = () => states[uid];

return { SURF_ROWS, UNDER0, MINE, LIFT, ROWS_TXT, COLS, ROWS, T_AT, WATER, LAND, WATER_NAME, PLACES, DENS, WILD, HEAL, CRUMBS, CH1, HOME, SIGHT, MOVE_BANK,
  FIRST_MOVES, DAILY_MOVES, movesOf, BREWS, SPELL_INFO, FLOOR_COINS, bossNow, key, unkey, nb, inMap, neighbours, isWater, cube, dist, hash, keysOf, sealedIn, walkableIn, visibleOf, TODAY, dayNum, dstr, BOSS_MAX,
  newWorld, newState, resolve, init, load, join, publish, savePlan, saveMine, aid, runNightIfDue, me, BOSS_STORY, EVENTS, eventOf, RALLY,
  get world() { return world; }, get pubs() { return pubs; }, get states() { return states; }, get uid() { return uid; } };
})();
