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

  /* ---------- the body ---------- */
  const BODY = layer(a => {
    a.r(15, 19, 10, 10, '#e5e7eb');                             // vest under everything
    a.r(11, 20, 3, 7, SKIN).r(26, 20, 3, 7, SKIN).r(11, 27, 3, 2, SKIN).r(26, 27, 3, 2, SKIN);
    a.r(16, 29, 3, 8, SKIN).r(21, 29, 3, 8, SKIN).r(15, 37, 4, 2, SKIN).r(21, 37, 4, 2, SKIN);
  });
  const HEAD = layer(a => {
    a.r(13, 5, 14, 14, SKIN).cut([13, 5], [26, 5], [13, 18], [26, 18]);
    a.r(12, 10, 1, 3, SKIN).r(27, 10, 1, 3, SKIN);                // ears
    a.d(INKC, [17, 11], [17, 12], [22, 11], [22, 12]).d('#fff', [17, 11], [22, 11]).d(INKC, [17, 12], [22, 12], [16, 11], [21, 11]);
    a.d(INKC, [18, 15], [19, 16], [20, 16], [21, 15]).d('#f4a3a3', [15, 14], [24, 14], [14, 14], [25, 14]);
    a.d('#6b3f1d', ...[[14, 5], [15, 5], [16, 5], [17, 5], [18, 5], [19, 5], [20, 5], [21, 5], [22, 5], [23, 5], [24, 5], [25, 5], [14, 6], [15, 6], [16, 6], [19, 6], [20, 6], [23, 6], [24, 6], [25, 6], [14, 7], [25, 7]]); // hair
  });

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
  function figure(eq) {
    const g = s => eq[s] && D[eq[s]] ? [D[eq[s]]] : [];
    return canvasFor([BODY, ...g('bottom'), ...g('shoes'), ...g('top'), HEAD, ...g('head'), ...g('rhand'), ...g('lhand')]).toDataURL();
  }
  function item(id) {                       // the item alone, cropped to a square with a 2-pixel margin
    const c = canvasFor([D[id]]), ctx = c.getContext('2d'), px = ctx.getImageData(0, 0, W, H).data;
    let x0 = W, y0 = H, x1 = 0, y1 = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (px[(y * W + x) * 4 + 3]) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    const s = Math.max(x1 - x0, y1 - y0) + 5, o = document.createElement('canvas'); o.width = o.height = s;
    o.getContext('2d').drawImage(c, x0, y0, x1 - x0 + 1, y1 - y0 + 1, Math.floor((s - (x1 - x0 + 1)) / 2), Math.floor((s - (y1 - y0 + 1)) / 2), x1 - x0 + 1, y1 - y0 + 1);
    return o.toDataURL();
  }
  return { figure, item, has: id => !!D[id], W, H };
})();
