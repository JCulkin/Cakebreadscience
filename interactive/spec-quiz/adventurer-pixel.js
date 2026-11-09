/* Pixel-art version of The Adventurer (draft, 9 Nov 2026). Drawn from scratch — no third-party assets.
   Every layer is a set of filled pixels; the renderer adds a black outline round each layer and simple
   light-from-above shading, so items only need flat shapes. Coordinates are "base" pixels:
   head x13–26 y5–18, torso x15–24 y19–28, arms x11–13 / x26–28 y20–26, hands y27–28,
   legs x16–18 / x21–23 y29–36, feet y37–38. Viewer-left hand = character's right hand. */
const PIXEL = (() => {
  const OX = 1, OY = 12, W = 42, H = 54, INKC = '#1b1b1f', SKIN = '#f1c27d';
  const FONT = {
    N: ['1001', '1101', '1011', '1001', '1001'], O: ['111', '101', '101', '101', '111'], P: ['111', '101', '111', '100', '100'],
    C: ['111', '100', '100', '100', '111'], 6: ['111', '100', '111', '101', '111'], 7: ['111', '001', '010', '010', '010'] };
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const tone = (h, f) => '#' + hex(h).map(v => Math.max(0, Math.min(255, Math.round(f > 0 ? v + (255 - v) * f : v * (1 + f))))).map(v => v.toString(16).padStart(2, '0')).join('');

  function layer(fn) {
    const fill = new Map(), det = new Map(), key = (x, y) => x + ',' + y;
    const api = {
      r(x, y, w, h, c) { for (let i = x; i < x + w; i++) for (let j = y; j < y + h; j++) fill.set(key(i, j), c); return api; },
      e(cx, cy, rx, ry, c) { for (let i = Math.floor(cx - rx); i <= cx + rx; i++) for (let j = Math.floor(cy - ry); j <= cy + ry; j++) if (((i - cx) / rx) ** 2 + ((j - cy) / ry) ** 2 <= 1.05) fill.set(key(i, j), c); return api; },
      f(c, ...pts) { pts.forEach(([x, y]) => fill.set(key(x, y), c)); return api; },          // filled pixels (outlined)
      cut(...pts) { pts.forEach(([x, y]) => fill.delete(key(x, y))); return api; },
      d(c, ...pts) { pts.forEach(([x, y]) => det.set(key(x, y), c)); return api; },          // detail pixels (no outline, no shading)
      t(s, x, y, c) { let ox = x; [...s].forEach(ch => { FONT[ch].forEach((row, j) => [...row].forEach((b, i) => { if (b === '1') det.set(key(ox + i, y + j), c); })); ox += FONT[ch][0].length + 1; }); return api; },
    };
    fn(api);
    return { fill, det };
  }
  function paint(ctx, L) {
    const has = (x, y) => L.fill.has(x + ',' + y), put = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(x + OX, y + OY, 1, 1); };
    const out = new Set();
    for (const k of L.fill.keys()) { const [x, y] = k.split(',').map(Number); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => { if (!has(x + a, y + b)) out.add((x + a) + ',' + (y + b)); }); }
    out.forEach(k => { const [x, y] = k.split(',').map(Number); put(x, y, INKC); });
    for (const [k, c] of L.fill) { const [x, y] = k.split(',').map(Number); put(x, y, !has(x, y + 1) ? tone(c, -0.22) : !has(x, y - 1) ? tone(c, 0.28) : !has(x + 1, y) ? tone(c, -0.1) : c); }
    for (const [k, c] of L.det) { const [x, y] = k.split(',').map(Number); put(x, y, c); }
  }

  /* ---------- the base character (no gender field: one body for everyone; looks are separate choices) ----------
     A saved look is {v, skin, hair, hc, eyes, mouth, extras[]}. Options are referred to by id, so new ones can be
     added at the end of any list without breaking saved looks; an unknown id falls back to the first option. */
  const OPTIONS = {
    skin: [['s1', '#ffe0bd'], ['s2', '#f8d0a8'], ['s3', '#f1c27d'], ['s4', '#e0ac69'], ['s5', '#c68642'], ['s6', '#a46a3a'], ['s7', '#8d5524'], ['s8', '#5c3a21']]
      .map(([id, c], i) => ({ id, name: 'Tone ' + (i + 1), c })),
    hair: [
      { id: 'crop', name: 'Short' }, { id: 'spiky', name: 'Spiky' }, { id: 'swoop', name: 'Side swoop' }, { id: 'buzz', name: 'Buzz cut' },
      { id: 'bob', name: 'Bob' }, { id: 'long', name: 'Long' }, { id: 'pony', name: 'Ponytail' }, { id: 'buns', name: 'Space buns' },
      { id: 'curly', name: 'Big curls' }, { id: 'braids', name: 'Braids / locs' }, { id: 'mohawk', name: 'Mohawk' }, { id: 'bald', name: 'Bald' },
      { id: 'hijab', name: 'Hijab', cloth: true }, { id: 'turban', name: 'Turban / patka', cloth: true }],
    hc: [['black', '#221c19'], ['darkbrown', '#3b2417'], ['brown', '#6b3f1d'], ['auburn', '#8a3324'], ['ginger', '#c8642a'], ['darkblonde', '#b98a3e'],
      ['blonde', '#e3c16f'], ['grey', '#9ca3af'], ['white', '#eceff3'], ['blue', '#3b82f6'], ['pink', '#ec4899'], ['purple', '#8b5cf6'], ['green', '#22c55e']]
      .map(([id, c]) => ({ id, name: id, c })),
    cloth: [['cblack', '#1f2937'], ['navy', '#1e3a8a'], ['cwhite', '#f1f5f9'], ['maroon', '#7f1d1d'], ['teal', '#0f766e'], ['cgrey', '#6b7280'],
      ['sand', '#d6b98c'], ['cpink', '#f9a8d4'], ['violet', '#6d28d9'], ['orange', '#ea580c']].map(([id, c]) => ({ id, name: id, c })),
    eyes: [{ id: 'dot', name: 'Classic' }, { id: 'big', name: 'Big' }, { id: 'happy', name: 'Happy' }, { id: 'sleepy', name: 'Sleepy' }, { id: 'wink', name: 'Wink' }, { id: 'fierce', name: 'Determined' }],
    mouth: [{ id: 'smile', name: 'Smile' }, { id: 'grin', name: 'Grin' }, { id: 'flat', name: 'Neutral' }, { id: 'oh', name: 'Surprised' }, { id: 'smirk', name: 'Smirk' }, { id: 'tongue', name: 'Cheeky' }],
    extras: [{ id: 'blush', name: 'Rosy cheeks' }, { id: 'freckles', name: 'Freckles' }, { id: 'glasses', name: 'Glasses' }, { id: 'shades', name: 'Sunglasses' },
      { id: 'hearing', name: 'Hearing aid' }, { id: 'kippah', name: 'Kippah' }, { id: 'plaster', name: 'Plaster' }, { id: 'earrings', name: 'Earrings' }],
  };
  const DEFAULT = { v: 1, skin: 's3', hair: 'crop', hc: 'brown', eyes: 'dot', mouth: 'smile', extras: ['blush'] };
  const pick = (list, id) => list.find(o => o.id === id) || list[0];
  function norm(b) {
    b = Object.assign({}, DEFAULT, b || {});
    const hair = pick(OPTIONS.hair, b.hair);
    const colours = hair.cloth ? OPTIONS.cloth : OPTIONS.hc;
    return { skin: pick(OPTIONS.skin, b.skin).c, hair: hair.id, cloth: !!hair.cloth, hc: (colours.find(o => o.id === b.hc) || colours[hair.cloth ? 1 : 2]).c,
      eyes: pick(OPTIONS.eyes, b.eyes).id, mouth: pick(OPTIONS.mouth, b.mouth).id, extras: new Set(b.extras || []) };
  }

  const bodyL = B => layer(a => {
    a.r(15, 19, 10, 10, '#e5e7eb');
    a.r(11, 20, 3, 7, B.skin).r(26, 20, 3, 7, B.skin).r(11, 27, 3, 2, B.skin).r(26, 27, 3, 2, B.skin);
    a.r(16, 29, 3, 8, B.skin).r(21, 29, 3, 8, B.skin).r(15, 37, 4, 2, B.skin).r(21, 37, 4, 2, B.skin);
  });
  const headL = B => layer(a => { a.r(13, 5, 14, 14, B.skin).cut([13, 5], [26, 5], [13, 18], [26, 18]); a.r(12, 10, 1, 3, B.skin).r(27, 10, 1, 3, B.skin); });
  const top = (a, c) => a.r(13, 4, 14, 3, c).cut([13, 4], [26, 4]);
  const HAIR_BACK = {
    long: (a, c) => a.r(11, 5, 18, 17, c).cut([11, 5], [28, 5]),
    bob: (a, c) => a.r(11, 5, 18, 11, c).cut([11, 5], [28, 5]),
    pony: (a, c) => a.r(27, 6, 3, 3, c).r(28, 9, 3, 8, c).r(29, 17, 2, 2, c),
    braids: (a, c) => { a.r(11, 5, 18, 10, c); [11, 27].forEach(x => a.r(x, 15, 2, 10, c)); },
    hijab: (a, c) => a.r(11, 3, 18, 18, c).cut([11, 3], [28, 3]),
  };
  const HAIR_FRONT = {
    crop: (a, c) => { top(a, c); a.r(13, 7, 1, 2, c).r(26, 7, 1, 2, c); },
    spiky: (a, c) => { top(a, c); a.r(13, 7, 1, 2, c).r(26, 7, 1, 2, c); a.f(c, [14, 3], [15, 2], [17, 3], [18, 2], [20, 3], [21, 2], [23, 3], [24, 2], [25, 3]); },
    swoop: (a, c) => { top(a, c); a.r(13, 7, 7, 1, c).r(13, 8, 4, 1, c).r(13, 9, 2, 1, c).r(26, 7, 1, 2, c); },
    buzz: (a, c) => { for (let x = 14; x <= 25; x++) for (let y = 5; y <= 6; y++) if ((x + y) % 2 === 0) a.d(c, [x, y]); a.d(c, [13, 6], [26, 6]); },
    bob: (a, c) => { top(a, c); a.r(12, 7, 2, 9, c).r(26, 7, 2, 9, c).r(14, 7, 4, 1, c); },
    long: (a, c) => { top(a, c); a.r(12, 7, 2, 11, c).r(26, 7, 2, 11, c); },
    pony: (a, c) => { top(a, c); a.r(13, 7, 1, 2, c).r(26, 7, 1, 2, c); a.d('#ef4444', [27, 8], [28, 8]); },
    buns: (a, c) => { top(a, c); a.r(13, 7, 1, 2, c).r(26, 7, 1, 2, c); a.e(14, 2, 2.4, 2.4, c).e(25, 2, 2.4, 2.4, c); },
    curly: (a, c) => { a.e(19.5, 3.5, 9.5, 5.5, c).e(12, 9, 2.5, 4, c).e(27, 9, 2.5, 4, c); a.d(tone(c, -0.3), [15, 2], [18, 1], [21, 3], [24, 1], [26, 4], [13, 5], [17, 5], [23, 6], [12, 10], [27, 11]); },
    braids: (a, c) => { top(a, c); a.r(12, 7, 2, 8, c).r(26, 7, 2, 8, c); a.d(tone(c, -0.3), [15, 4], [18, 4], [21, 4], [24, 4], [12, 9], [12, 12], [27, 9], [27, 12]); },
    mohawk: (a, c) => { a.r(18, -1, 4, 7, c).cut([18, -1], [21, -1]); a.d(tone(c, -0.3), [19, 1], [20, 3]); },
    bald: (a, c) => {},
    hijab: (a, c) => { a.r(12, 3, 16, 5, c).cut([12, 3], [27, 3]).r(12, 8, 2, 12, c).r(26, 8, 2, 12, c).r(14, 19, 12, 2, c); a.d(tone(c, -0.18), [14, 5], [15, 6], [24, 6], [25, 5]); },
    turban: (a, c) => { a.e(19.5, 4, 8, 5, c).r(12, 6, 16, 3, c); a.d(tone(c, -0.25), [14, 4], [15, 3], [16, 2], [17, 1], [22, 6], [23, 5], [24, 4], [25, 3], [13, 7], [26, 7]); a.f(tone(c, 0.15), [19, 0], [20, 0]); },
  };
  const faceL = B => layer(a => {
    const K = INKC, W = '#fff', S = B.skin, x = B.extras;
    const E = {
      dot: () => a.d(K, [17, 11], [17, 12], [22, 11], [22, 12]).d(W, [17, 11], [22, 11]).d(K, [16, 11], [21, 11], [16, 12], [21, 12]),
      big: () => a.d(K, [16, 10], [17, 10], [16, 11], [17, 11], [16, 12], [17, 12], [21, 10], [22, 10], [21, 11], [22, 11], [21, 12], [22, 12]).d(W, [16, 10], [21, 10]),
      happy: () => a.d(K, [16, 12], [17, 11], [18, 12], [21, 12], [22, 11], [23, 12]),
      sleepy: () => a.d(K, [16, 12], [17, 12], [18, 12], [21, 12], [22, 12], [23, 12]).d(tone(S, -0.25), [16, 11], [17, 11], [18, 11], [21, 11], [22, 11], [23, 11]),
      wink: () => a.d(K, [16, 11], [17, 11], [16, 12], [17, 12], [21, 12], [22, 12], [23, 12]).d(W, [17, 11]),
      fierce: () => a.d(K, [16, 11], [17, 11], [16, 12], [17, 12], [21, 11], [22, 11], [21, 12], [22, 12], [15, 9], [16, 9], [17, 10], [22, 10], [23, 9], [24, 9]).d(W, [17, 11], [22, 11]),
    };
    const M = {
      smile: () => a.d(K, [18, 15], [19, 16], [20, 16], [21, 15]),
      grin: () => a.d(K, [17, 15], [22, 15], [18, 16], [19, 16], [20, 16], [21, 16]).d(W, [18, 15], [19, 15], [20, 15], [21, 15]),
      flat: () => a.d(K, [18, 16], [19, 16], [20, 16], [21, 16]),
      oh: () => a.d(K, [19, 15], [20, 15], [19, 17], [20, 17], [18, 16], [21, 16]).d('#7f1d1d', [19, 16], [20, 16]),
      smirk: () => a.d(K, [18, 16], [19, 16], [20, 16], [21, 15], [22, 14]),
      tongue: () => a.d(K, [18, 15], [19, 16], [20, 16], [21, 15]).d('#f472b6', [20, 17], [21, 17]),
    };
    E[B.eyes](); M[B.mouth]();
    if (x.has('blush')) a.d('#f4a3a3', [14, 14], [15, 14], [24, 14], [25, 14]);
    if (x.has('freckles')) a.d(tone(S, -0.35), [15, 13], [16, 14], [14, 15], [23, 13], [24, 14], [25, 15]);
    if (x.has('plaster')) a.d('#f5deb3', [23, 14], [24, 14], [25, 14]).d('#d6b98c', [24, 14]);
    if (x.has('glasses')) a.d(K, [15, 10], [15, 11], [15, 12], [16, 13], [17, 13], [18, 12], [18, 11], [18, 10], [16, 9], [17, 9], [19, 11], [20, 11],
      [21, 10], [21, 11], [21, 12], [22, 13], [23, 13], [24, 12], [24, 11], [24, 10], [22, 9], [23, 9]);
    if (x.has('shades')) a.d(K, ...[15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map(i => [i, 10]), [15, 11], [16, 11], [17, 11], [18, 11], [21, 11], [22, 11], [23, 11], [24, 11], [16, 12], [17, 12], [22, 12], [23, 12]).d('#60a5fa', [16, 11], [22, 11]);
    if (x.has('hearing') && !B.cloth) a.d('#38bdf8', [27, 9], [28, 10], [28, 11]);
    if (x.has('earrings') && !B.cloth) a.d('#facc15', [12, 13], [27, 13]);
  });
  const kippahL = B => layer(a => { a.r(17, 3, 6, 2, '#1e3a8a').cut([17, 3], [22, 3]); a.d('#93c5fd', [18, 4], [20, 4]); });
  const hairBackL = B => HAIR_BACK[B.hair] ? layer(a => HAIR_BACK[B.hair](a, B.hc)) : null;
  const hairFrontL = B => layer(a => HAIR_FRONT[B.hair](a, B.hc));

  /* ---------- items (same ids as the vector version) ---------- */
  const tri = (c) => a => { for (let i = 0; i <= 8; i++) a.r(19 - i, -3 + i, 2 + 2 * i, 1, c); };
  const D = {
    paperhat: layer(a => { tri('#fffdf5')(a); a.d('#9aa4b1', ...[15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map(x => [x, 1])); }),
    avogadro: layer(a => {
      a.r(10, 3, 20, 2, '#262626').r(14, -5, 12, 8, '#333').r(17, -6, 6, 1, '#262626').r(18, -9, 4, 3, '#333').r(19, -10, 2, 1, '#262626');
      a.d('#c8001e', ...[14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25].flatMap(x => [[x, 0], [x, 1]])).d('#c8001e', [18, -7], [19, -7], [20, -7], [21, -7]);
    }),
    nocap: layer(a => {
      a.r(13, 1, 14, 6, '#2563eb').cut([13, 1], [26, 1], [13, 2], [26, 2]).f('#2563eb', [14, 0], [15, 0], [24, 0], [25, 0]).r(16, 0, 8, 1, '#2563eb');
      a.r(24, 7, 9, 2, '#1e40af').r(19, -1, 2, 1, '#1e40af');
      a.t('NO', 16, 1, '#fff');
    }),
    delulu: layer(a => {
      a.r(12, 11, 16, 1, '#7c3aed');
      a.e(17, 12, 2.6, 2.6, '#f9a8d4').e(22.5, 12, 2.6, 2.6, '#f9a8d4');
      a.d('#fff', [16, 11], [21, 11]).d('#facc15', [9, 3], [8, 4], [10, 4], [9, 5], [30, 1], [29, 2], [31, 2], [30, 3]);
    }),
    halo: layer(a => { a.r(15, -4, 10, 1, '#facc15').r(14, -3, 1, 1, '#facc15').r(25, -3, 1, 1, '#facc15').r(15, -2, 10, 1, '#facc15'); a.d('#facc15', [11, -7], [12, -6], [28, -6], [29, -7], [20, -9], [20, -8]); }),

    jumper: layer(a => { a.r(15, 19, 10, 10, '#8a929c').r(11, 20, 3, 6, '#8a929c').r(26, 20, 3, 6, '#8a929c'); a.d('#6b7280', ...[15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map(x => [x, 28])).d(SKIN, [19, 19], [20, 19], [20, 20], [19, 20]); }),
    labcoat: layer(a => {
      a.r(15, 19, 10, 13, '#f8fafc').r(11, 20, 3, 7, '#f8fafc').r(26, 20, 3, 7, '#f8fafc');
      a.d('#cbd5e1', ...[22, 23, 24, 25, 26, 27, 28, 29, 30].map(y => [19, y])).d('#94a3b8', [18, 19], [21, 19], [19, 20], [20, 20]);
      a.d('#cbd5e1', [21, 23], [22, 23], [23, 23]).d('#8a6d3b', [16, 25], [17, 25], [16, 26], [17, 26], [18, 26], [17, 27]);
    }),
    npc: layer(a => { a.r(14, 19, 12, 10, '#16a34a').r(11, 20, 3, 3, '#16a34a').r(26, 20, 3, 3, '#16a34a'); a.t('NPC', 14, 22, '#fff'); }),
    chainmail: layer(a => {
      a.r(15, 19, 10, 10, '#cbd5e1').r(11, 20, 3, 6, '#cbd5e1').r(26, 20, 3, 6, '#cbd5e1');
      for (let y = 20; y <= 27; y++) for (let x = 15; x <= 24; x++) if ((x + y) % 2 === 0) a.d('#64748b', [x, y]);
      for (let y = 21; y <= 25; y += 2) a.d('#64748b', [12, y], [27, y]);
    }),

    joggers: layer(a => { a.r(15, 29, 10, 2, '#6b7280').r(15, 31, 4, 6, '#6b7280').r(21, 31, 4, 6, '#6b7280'); a.d('#4b5563', [15, 36], [16, 36], [17, 36], [18, 36], [21, 36], [22, 36], [23, 36], [24, 36]).d('#e5e7eb', [19, 29], [20, 30]); }),
    inertia: layer(a => {
      a.r(15, 29, 10, 2, '#7c4a1e').r(15, 31, 4, 6, '#7c4a1e').r(21, 31, 4, 6, '#7c4a1e');
      a.d('#4a2a0e', ...[15, 16, 17, 18, 21, 22, 23, 24].map(x => [x, 29]), [19, 29], [20, 29]).d('#facc15', [19, 29], [20, 29]);
      a.d(INKC, [9, 32], [10, 32], [11, 32], [8, 34], [9, 34], [10, 34], [29, 32], [30, 32], [31, 32], [30, 34], [31, 34], [32, 34]);
    }),
    kilt: layer(a => {
      a.r(15, 29, 10, 2, '#b91c1c').r(14, 31, 12, 2, '#b91c1c').r(13, 33, 14, 1, '#b91c1c');
      a.d('#1e3a8a', ...[29, 30, 31, 32, 33].flatMap(y => [[17, y], [22, y]]), ...[14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25].map(x => [x, 31])).d('#facc15', [17, 31], [22, 31]);
      a.d(INKC, [10, 33], [10, 32], [11, 31], [29, 33], [29, 32], [28, 31]);
    }),

    oddsocks: layer(a => { a.r(14, 35, 5, 4, '#dc2626').r(21, 35, 5, 4, '#f87171'); a.d('#b91c1c', [21, 36], [22, 36], [23, 36], [24, 36], [25, 36]); }),
    brownian: layer(a => {
      a.r(14, 35, 5, 4, '#a855f7').r(21, 35, 5, 4, '#22c55e');
      a.d('#fff', [15, 36], [17, 37], [16, 38]).d('#fff', ...[21, 22, 23, 24, 25].map(x => [x, 37]));
      a.d(INKC, [11, 33], [12, 34], [11, 35], [28, 32], [29, 33], [28, 34], [18, 41], [19, 40], [20, 41]);
    }),
    grass: layer(a => { a.r(14, 33, 5, 6, '#3f6212').r(13, 37, 1, 2, '#3f6212').r(21, 33, 5, 6, '#3f6212').r(26, 37, 1, 2, '#3f6212'); a.d('#22c55e', ...[11, 13, 15, 17, 19, 21, 23, 25, 27, 29].flatMap(x => [[x, 40], [x + (x % 4 ? 0 : 1), 39]])); }),
    frictionless: layer(a => { a.e(16, 37, 3.5, 2, '#fbcfe8').e(23.5, 37, 3.5, 2, '#fbcfe8'); a.d('#fff', [17, 36], [24, 36]).d('#9ca3af', [6, 36], [7, 36], [8, 36], [9, 36], [5, 38], [6, 38], [7, 38], [8, 38], [9, 38], [10, 38]); }),

    ruler: layer(a => { for (let i = 0; i <= 13; i++) { const x = 11 - Math.floor(i * 0.55), y = 26 - i; a.f('#fde68a', [x, y], [x + 1, y]); if (i % 3 === 0) a.d('#92400e', [x, y]); } }),
    glove: layer(a => {
      a.e(10, 27, 4, 4, '#dc2626').r(14, 26, 2, 2, '#dc2626').r(8, 31, 6, 2, '#f8fafc');
      a.d('#fca5a5', [8, 25], [9, 24]).d(INKC, [3, 19], [4, 20], [5, 21], [3, 20], [4, 19], [17, 19], [16, 20], [15, 21], [17, 20], [16, 19]);
    }),
    mito: layer(a => {
      a.e(9.5, 26.5, 5, 3.5, '#fb923c');
      a.d('#9a3412', [6, 26], [7, 25], [8, 26], [9, 27], [10, 26], [11, 25], [12, 26], [13, 27]).d('#facc15', [5, 17], [4, 18], [5, 19], [4, 20], [5, 21], [6, 18]);
    }),
    pipette: layer(a => { a.r(12, 10, 1, 17, '#e0f2fe').r(11, 15, 3, 4, '#e0f2fe').e(12, 8, 1.6, 2, '#f9a8d4'); a.d('#38bdf8', [12, 30], [12, 31], [11, 31], [12, 32]); }),
    calc67: layer(a => {
      a.r(5, 19, 9, 13, '#1f2937');
      a.d('#bbf7d0', ...[6, 7, 8, 9, 10, 11, 12].flatMap(x => [20, 21, 22, 23, 24, 25, 26].map(y => [x, y])));
      a.t('67', 6, 21, '#14532d');
      for (let y = 28; y <= 30; y += 2) for (let x = 6; x <= 12; x += 2) a.d('#9ca3af', [x, y]);
    }),
    syringe: layer(a => {
      a.r(10, 12, 5, 13, '#e0f2fe').r(12, 6, 1, 6, '#9ca3af').r(9, 25, 7, 1, '#9ca3af').r(12, 26, 1, 1, '#9ca3af');
      a.d('#4ade80', ...[11, 12, 13].flatMap(x => [15, 16, 17, 18, 19, 20, 21, 22, 23].map(y => [x, y]))).d('#fde047', [6, 6], [5, 7], [7, 7], [6, 8], [17, 9], [17, 11], [16, 10], [18, 10]);
    }),

    crisps: layer(a => {
      a.r(27, 21, 8, 10, '#facc15'); for (let x = 27; x <= 34; x += 2) a.f('#facc15', [x, 20], [x, 31]);
      a.e(30.5, 25.5, 2.2, 2.2, '#ef4444');
    }),
    shield: layer(a => {
      a.r(27, 19, 11, 9, '#f8fafc').r(28, 28, 9, 1, '#f8fafc').r(29, 29, 7, 1, '#f8fafc').r(30, 30, 5, 1, '#f8fafc').r(31, 31, 3, 1, '#f8fafc');
      const cell = (x, y, c) => a.d(c, [x, y], [x + 1, y], [x, y + 1], [x + 1, y + 1]);
      [20, 23, 26].forEach(y => { cell(28, y, '#f87171'); cell(35, y, '#a78bfa'); if (y > 20) { cell(30.5 | 0, y, '#fde68a'); cell(33, y, '#86efac'); } });
      cell(35, 17 + 3, '#a78bfa');
    }),
    clipboard: layer(a => {
      a.r(27, 19, 9, 13, '#b45309').r(30, 17, 3, 3, '#9ca3af');
      a.d('#fff', ...[28, 29, 30, 31, 32, 33, 34].flatMap(x => [21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(y => [x, y])));
      a.d('#9ca3af', ...[29, 30, 31, 32, 33].flatMap(x => [[x, 22], [x, 24], [x, 26]])).d('#16a34a', [29, 28], [30, 29], [31, 28], [32, 27], [33, 26]);
    }),
    pebble: layer(a => { a.e(31.5, 26, 4.5, 3.5, '#a78bfa'); a.d('#ede9fe', [29, 24], [30, 24], [30, 23]).d('#fde047', [36, 19], [35, 20], [37, 20], [36, 21], [26, 18], [25, 19], [27, 19], [26, 20]); }),
    dodgeball: layer(a => {
      a.e(32, 26, 5, 5, '#84cc16');
      a.d(INKC, [32, 26], [31, 23], [32, 23], [33, 23], [32, 24], [29, 27], [30, 27], [30, 28], [35, 27], [34, 27], [34, 28]);
      a.d('#d9f99d', [26, 21], [38, 21], [26, 31], [38, 31], [32, 19], [32, 33]);
    }),
  };

  function canvasFor(layers) {
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d'); layers.forEach(L => paint(ctx, L)); return c;
  }
  function layersFor(eq, base) {
    const B = norm(base), g = k => eq && eq[k] && D[eq[k]] ? [D[eq[k]]] : [];
    return [hairBackL(B), bodyL(B), ...g('bottom'), ...g('shoes'), ...g('top'), headL(B), hairFrontL(B), faceL(B),
      ...(B.extras.has('kippah') && !B.cloth && !(eq && eq.head) ? [kippahL(B)] : []), ...g('head'), ...g('rhand'), ...g('lhand')].filter(Boolean);
  }
  function figure(eq, base) { return canvasFor(layersFor(eq, base)).toDataURL(); }
  /* head-and-shoulders crop for option tiles */
  function portrait(base, eq) {
    const c = canvasFor(layersFor(eq || {}, base)), o = document.createElement('canvas'); o.width = 24; o.height = 24;
    o.width = 26; o.height = 26; o.getContext('2d').drawImage(c, 7 + OX, -5 + OY, 26, 26, 0, 0, 26, 26); return o.toDataURL();
  }
  function item(id) {                       // the item alone, cropped to a square with a 2-pixel margin
    const c = canvasFor([D[id]]), ctx = c.getContext('2d'), px = ctx.getImageData(0, 0, W, H).data;
    let x0 = W, y0 = H, x1 = 0, y1 = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (px[(y * W + x) * 4 + 3]) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    const s = Math.max(x1 - x0, y1 - y0) + 5, o = document.createElement('canvas'); o.width = o.height = s;
    o.getContext('2d').drawImage(c, x0, y0, x1 - x0 + 1, y1 - y0 + 1, Math.floor((s - (x1 - x0 + 1)) / 2), Math.floor((s - (y1 - y0 + 1)) / 2), x1 - x0 + 1, y1 - y0 + 1);
    return o.toDataURL();
  }
  return { figure, portrait, item, has: id => !!D[id], OPTIONS, DEFAULT, W, H };
})();
