/* Diagrams and graphs drawn in code (18 Nov 2026 test; user: "make me a test page with a bunch of diagrams of each type").
   Every maker takes a random source r and returns { title, spec, kind, svg, q, o: [correct, ...wrong], x }.
   Pure SVG strings: no image files, nothing for a school filter to block, new numbers every time.
   DG.make(name) → a question; DG.MAKERS lists them. */
const DG = (() => {
  const INK = '#111', GRID = '#d8d3c4', F = "font-family:Barlow,Arial,sans-serif";
  const rnd = () => ({ int: (a, b) => a + Math.floor(Math.random() * (b - a + 1)), pick: a => a[Math.floor(Math.random() * a.length)], f: () => Math.random() });
  const n = v => (Math.round(v * 100) / 100).toString();
  const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.size || 12}" text-anchor="${o.a || 'middle'}"${o.w ? ` font-weight="${o.w}"` : ''}${o.fill ? ` fill="${o.fill}"` : ''}${o.rot ? ` transform="rotate(${o.rot} ${x} ${y})"` : ''} style="${F}">${s}</text>`;
  const wrap = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;background:#fff">${body}</svg>`;
  const uniq = (ans, wrong, f = x => x) => { const seen = new Set([String(f(ans))]), out = []; wrong.forEach(w => { const k = String(f(w)); if (!seen.has(k) && w !== '' && !(typeof w === 'number' && (!isFinite(w) || w <= 0))) { seen.add(k); out.push(w); } }); return out.slice(0, 3); };

  /* ---------- a line graph with gridlines ---------- */
  function chart({ xmax, ymax, xstep, ystep, xl, yl, series, w = 380, h = 260, marks = [] }) {
    const L = 52, R = 14, Tp = 14, B = 42, px = x => L + x / xmax * (w - L - R), py = y => h - B - y / ymax * (h - Tp - B);
    let g = '';
    for (let x = 0; x <= xmax + 1e-9; x += xstep / 2) g += `<line x1="${px(x)}" y1="${py(0)}" x2="${px(x)}" y2="${py(ymax)}" stroke="${GRID}" stroke-width="${Math.abs(x / xstep - Math.round(x / xstep)) < 1e-6 ? 1 : .5}"/>`;
    for (let y = 0; y <= ymax + 1e-9; y += ystep / 2) g += `<line x1="${px(0)}" y1="${py(y)}" x2="${px(xmax)}" y2="${py(y)}" stroke="${GRID}" stroke-width="${Math.abs(y / ystep - Math.round(y / ystep)) < 1e-6 ? 1 : .5}"/>`;
    for (let x = 0; x <= xmax + 1e-9; x += xstep) g += T(px(x), py(0) + 15, n(x), { size: 11 });
    for (let y = 0; y <= ymax + 1e-9; y += ystep) g += T(px(0) - 6, py(y) + 4, n(y), { size: 11, a: 'end' });
    g += `<line x1="${px(0)}" y1="${py(0)}" x2="${px(xmax)}" y2="${py(0)}" stroke="${INK}" stroke-width="1.6"/><line x1="${px(0)}" y1="${py(0)}" x2="${px(0)}" y2="${py(ymax)}" stroke="${INK}" stroke-width="1.6"/>`;
    g += T((px(0) + px(xmax)) / 2, h - 8, xl, { size: 12, w: 600 }) + T(14, (py(0) + py(ymax)) / 2, yl, { size: 12, w: 600, rot: -90 });
    series.forEach(s => { g += `<polyline points="${s.pts.map(([x, y]) => px(x).toFixed(1) + ',' + py(y).toFixed(1)).join(' ')}" fill="none" stroke="${s.col || INK}" stroke-width="2.2" stroke-linejoin="round"${s.dash ? ' stroke-dasharray="6 4"' : ''}/>`;
      if (s.label) { const [x, y] = s.pts[s.lab || s.pts.length - 1]; g += T(px(x) + 6, py(y) - 6, s.label, { size: 12, w: 700, a: 'start', fill: s.col || INK }); } });
    marks.forEach(([x, y, lab]) => { g += `<circle cx="${px(x)}" cy="${py(y)}" r="3" fill="${INK}"/>` + T(px(x) + (lab.dx || 0), py(y) - 8, lab.t || lab, { size: 12, w: 700 }); });
    return wrap(w, h, g);
  }
  const curve = (f, a, b, k = 60) => Array.from({ length: k + 1 }, (_, i) => { const x = a + (b - a) * i / k; return [x, f(x)]; });

  const M = {};
  /* ---------- graphs ---------- */
  M.vt = r => { const v = r.pick([4, 6, 8, 10, 12, 15, 20]), t1 = r.pick([2, 4, 5]), t2 = t1 + r.pick([4, 5, 6]), t3 = t2 + r.pick([2, 3, 4, 5]);
    const svg = chart({ xmax: t3 + 1, ymax: Math.ceil(v * 1.25 / 2) * 2, xstep: 2, ystep: v > 10 ? 5 : 2, xl: 'Time (s)', yl: 'Velocity (m/s)', series: [{ pts: [[0, 0], [t1, v], [t2, v], [t3, 0]] }] });
    const dist = v * t1 / 2 + v * (t2 - t1) + v * (t3 - t2) / 2;
    if (r.int(0, 1)) return { title: 'Velocity–time graph', spec: 'P1.8', kind: 'graph', svg, q: `What is the acceleration during the first ${t1} s?`, o: [n(v / t1) + ' m/s²', ...uniq(v / t1, [v * t1, t1 / v, v]).map(x => n(x) + ' m/s²')], x: `Acceleration = gradient = change in velocity ÷ time = ${v} ÷ ${t1} = ${n(v / t1)} m/s².` };
    return { title: 'Velocity–time graph', spec: 'P1.9', kind: 'graph', svg, q: 'How far does the object travel in the whole journey?', o: [n(dist) + ' m', ...uniq(dist, [v * t3, v * (t2 - t1), dist / 2]).map(x => n(x) + ' m')], x: `Distance = area under the graph: triangle ${n(v * t1 / 2)} + rectangle ${v * (t2 - t1)} + triangle ${n(v * (t3 - t2) / 2)} = ${n(dist)} m.` }; };
  M.dt = r => { const d = r.pick([20, 40, 60, 80, 100]), t1 = r.pick([4, 5, 10]), t2 = t1 + r.pick([4, 5, 6]), t3 = t2 + r.pick([5, 10]);
    const svg = chart({ xmax: t3 + 2, ymax: d * 1.25, xstep: t3 > 20 ? 5 : 2, ystep: d / 4, xl: 'Time (s)', yl: 'Distance (m)', series: [{ pts: [[0, 0], [t1, d], [t2, d], [t3, 0]] }] });
    return r.int(0, 1) ? { title: 'Distance–time graph', spec: 'P1.3', kind: 'graph', svg, q: `What is the speed during the first ${t1} s?`, o: [n(d / t1) + ' m/s', ...uniq(d / t1, [d * t1, t1 / d, d / t2]).map(x => n(x) + ' m/s')], x: `Speed = gradient = distance ÷ time = ${d} ÷ ${t1} = ${n(d / t1)} m/s.` }
      : { title: 'Distance–time graph', spec: 'P1.3', kind: 'graph', svg, q: 'For how long is the object stationary?', o: [(t2 - t1) + ' s', ...uniq(t2 - t1, [t2, t1, t3 - t2, t3, t2 - t1 + 2]).map(v => v + ' s')], x: `A flat line means not moving: from ${t1} s to ${t2} s, so ${t2 - t1} s.` }; };
  M.fe = r => { const k = r.pick([2, 4, 5]), lim = r.pick([6, 8, 10]), xmax = lim + 4, F0 = r.pick([2, 4, 6].filter(x => x < lim));
    const ext = F => F <= lim ? F / k : lim / k + (F - lim) ** 1.6 / k * 0.6;   // straight (Hooke's law) up to P, then curving
    const svg = chart({ xmax, ymax: Math.ceil(ext(xmax) + 0.5), xstep: 2, ystep: 1, xl: 'Force (N)', yl: 'Extension (cm)', series: [{ pts: curve(ext, 0, xmax) }], marks: [[lim, ext(lim), { t: 'P', dx: -10 }]] });
    return r.int(0, 1) ? { title: 'Force–extension graph', spec: 'P1.23', kind: 'graph', svg, q: `What is the extension when the force is ${F0} N?`, o: [n(ext(F0)) + ' cm', ...uniq(ext(F0), [F0 * k, ext(F0) * 2, F0]).map(x => n(x) + ' cm')], x: `Read up from ${F0} N to the line, then across: ${n(ext(F0))} cm.` }
      : { title: 'Force–extension graph', spec: 'P1.23', kind: 'graph', svg, q: 'What happens to the spring after point P?', o: ['It no longer obeys Hooke\'s law: extension is not proportional to force', 'It snaps', 'The extension stops increasing', 'It obeys Hooke\'s law more closely'], x: 'The straight, sloping part is where extension is proportional to force (Hooke\'s law). After P the line curves: the limit of proportionality has been passed.' }; };
  M.half = r => { const A0 = r.pick([400, 800, 1200, 1600]), hl = r.pick([2, 3, 4, 5, 6]), u = r.pick(['hours', 'days', 'minutes']);
    const svg = chart({ xmax: hl * 4, ymax: A0, xstep: hl, ystep: A0 / 4, xl: `Time (${u})`, yl: 'Activity (Bq)', series: [{ pts: curve(t => A0 * 0.5 ** (t / hl), 0, hl * 4) }] });
    return { title: 'Radioactive decay curve', spec: 'P7.13', kind: 'graph', svg, q: 'What is the half-life of this isotope?', o: [`${hl} ${u}`, `${hl * 2} ${u}`, `${hl * 4} ${u}`, `${A0 / 2} ${u}`], x: `Half-life = time for the activity to halve: ${A0} → ${A0 / 2} Bq takes ${hl} ${u}.` }; };
  M.rate = r => { const V = r.pick([40, 50, 60, 80]), a = r.pick([8, 10, 12]), b = a * r.pick([2, 3]), tm = b * 4;
    const svg = chart({ xmax: tm, ymax: V * 1.2, xstep: tm / 6, ystep: V / 4, xl: 'Time (s)', yl: 'Volume of gas (cm³)', series: [{ pts: curve(t => V * (1 - Math.exp(-t / a)), 0, tm), label: 'A', lab: 12 }, { pts: curve(t => V * (1 - Math.exp(-t / b)), 0, tm), label: 'B', lab: 24, dash: 1 }] });
    return r.int(0, 1) ? { title: 'Rate of reaction curves', spec: 'C3.10', kind: 'graph', svg, q: 'Which line shows the reaction with the more concentrated acid? (The same mass of marble chips each time.)', o: ['A: it is steeper at the start', 'B: it takes longer, so more reacts', 'A: it makes more gas in the end', 'Both are the same concentration'], x: 'More concentrated acid → more frequent collisions → faster rate → steeper curve at the start. Both end at the same volume because the same amount of marble reacts.' }
      : { title: 'Rate of reaction curves', spec: 'C3.10', kind: 'graph', svg, q: 'What total volume of gas did each reaction produce?', o: [`${V} cm³`, ...uniq(V, [V * 1.2, V / 2, tm, V * 2]).map(v => `${n(v)} cm³`)], x: `Both lines level off at ${V} cm³: that's when the reaction has finished.` }; };
  M.enzyme = r => { const opt = r.pick([30, 35, 37, 40, 45]);
    const act = T0 => T0 <= opt ? 100 * Math.exp(-(((T0 - opt) / 18) ** 2)) : Math.max(0, 100 * (1 - ((T0 - opt) / 14) ** 2));
    const svg = chart({ xmax: 70, ymax: 120, xstep: 10, ystep: 20, xl: 'Temperature (°C)', yl: 'Rate of reaction (a.u.)', series: [{ pts: curve(act, 0, 70, 70) }] });
    return { title: 'Enzyme activity and temperature', spec: 'B2.10', kind: 'graph', svg, q: 'What is the optimum temperature for this enzyme, and why does the rate fall so quickly above it?', o: [`${opt} °C; the active site changes shape (denatures)`, `${opt} °C; the enzyme is killed`, `${opt + 15} °C; the substrate runs out`, `70 °C; molecules move fastest`], x: `The peak is at ${opt} °C. Above it the enzyme denatures: the active site changes shape so the substrate no longer fits. Enzymes aren't alive, so they aren't "killed".` }; };
  M.cool = r => { const mp = r.pick([45, 53, 62, 70, 80]), t0 = mp + r.pick([25, 35]), a = r.pick([3, 4, 5]), b = a + r.pick([5, 6, 8]);
    const f = t => t < a ? t0 - (t0 - mp) * t / a : t < b ? mp : mp - (t - b) * 4;
    const svg = chart({ xmax: b + 5, ymax: Math.ceil((t0 + 10) / 20) * 20, xstep: 2, ystep: 20, xl: 'Time (min)', yl: 'Temperature (°C)', series: [{ pts: [[0, t0], [a, mp], [b, mp], [b + 5, f(b + 5)]] }], marks: [[0, t0, { t: 'A', dx: 12 }], [a, mp, 'B'], [b, mp, 'C'], [b + 5, f(b + 5), { t: 'D', dx: -8 }]] });
    return r.int(0, 1) ? { title: 'Cooling curve', spec: 'C1.1', kind: 'graph', svg, q: 'What is the melting point of the substance?', o: [`${mp} °C`, `${t0} °C`, `${n(f(b + 5))} °C`, `${b} °C`], x: `The flat section is where it freezes: the temperature stays at the melting point, ${mp} °C, while energy is released as bonds form.` }
      : { title: 'Cooling curve', spec: 'C1.1', kind: 'graph', svg, q: 'Between which two points is the substance a mixture of liquid and solid?', o: ['B and C', 'A and B', 'C and D', 'A and D'], x: 'B → C is the flat part: it is freezing, so liquid and solid are both there. A → B is liquid cooling, C → D is solid cooling.' }; };
  M.table = r => { const base = r.pick([12, 18, 24, 31]), vals = [0, 1, 2].map(() => base + r.int(-2, 2)), bad = r.int(0, 2), anom = vals[bad] + r.pick([9, 11, -8]); const all = vals.slice(); all[bad] = anom;
    const good = vals.filter((_, i) => i !== bad), mean = (good[0] + good[1]) / 2, conc = r.pick(['0.5', '1.0', '1.5']);
    let g = '', cols = ['Concentration (mol/dm³)', 'Test 1', 'Test 2', 'Test 3', 'Mean'], wd = [150, 60, 60, 60, 60], x0 = 10;
    const cell = (x, y, w, s, head) => `<rect x="${x}" y="${y}" width="${w}" height="30" fill="${head ? '#eeeae0' : '#fff'}" stroke="${INK}"/>` + T(x + w / 2, y + 19, s, { size: 12, w: head ? 700 : 400 });
    let x = x0; cols.forEach((c, i) => { g += cell(x, 10, wd[i], c, 1); x += wd[i]; });
    x = x0; [conc, ...all, '?'].forEach((v, i) => { g += cell(x, 40, wd[i], v, 0); x += wd[i]; });
    const svg = wrap(410, 80, g);
    return { title: 'Results table', spec: 'C3.15', kind: 'table', svg, q: 'Time for the cross to disappear, in seconds. What is the mean, leaving out the anomalous result?', o: [n(mean) + ' s', ...uniq(mean, [(all[0] + all[1] + all[2]) / 3, anom, Math.max(...good)]).map(v => n(v) + ' s')], x: `Test ${bad + 1} (${anom} s) doesn't fit the others, so leave it out: (${good[0]} + ${good[1]}) ÷ 2 = ${n(mean)} s.` }; };

  /* ---------- chemistry diagrams ---------- */
  const shellPos = (k, i, rad) => { const ang = k <= 2 ? [0, Math.PI][i] : [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2][Math.floor(i / 2)] + (i % 2 ? .22 : -.22); return [Math.cos(ang - Math.PI / 2) * rad, Math.sin(ang - Math.PI / 2) * rad]; };
  const elec = (x, y, cross) => cross ? `<path d="M${x - 3.5} ${y - 3.5}l7 7M${x + 3.5} ${y - 3.5}l-7 7" stroke="#c8001e" stroke-width="2"/>` : `<circle cx="${x}" cy="${y}" r="3.2" fill="#1e3a8a"/>`;
  function ion(cx, cy, sym, shells, mark, charge) {   // shells: [[count, crossCount]]
    let g = `<circle cx="${cx}" cy="${cy}" r="14" fill="#eeeae0" stroke="${INK}"/>` + T(cx, cy + 5, sym, { size: 14, w: 700 });
    shells.forEach(([c, x], s) => { const rad = 24 + s * 16; g += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="#555"/>`;
      for (let i = 0; i < c; i++) { const [dx, dy] = shellPos(c > 2 ? 8 : 2, i, rad); g += elec(cx + dx, cy + dy, i >= c - x ? !mark : mark); } });
    const R0 = 24 + (shells.length - 1) * 16 + 10;
    return g + `<path d="M${cx - R0 + 6} ${cy - R0}h-6v${2 * R0}h6M${cx + R0 - 6} ${cy - R0}h6v${2 * R0}h-6" fill="none" stroke="${INK}" stroke-width="1.6"/>` + T(cx + R0 + 10, cy - R0 + 6, charge, { size: 14, w: 700 });
  }
  M.ionic = r => { const C = r.pick([
      { f: 'NaCl', n: 'sodium chloride', m: ['Na', [[2, 0], [8, 0]], '+'], a: ['Cl', [[2, 0], [8, 0], [8, 1]], '−'] },
      { f: 'MgO', n: 'magnesium oxide', m: ['Mg', [[2, 0], [8, 0]], '2+'], a: ['O', [[2, 0], [8, 2]], '2−'] },
      { f: 'LiF', n: 'lithium fluoride', m: ['Li', [[2, 0]], '+'], a: ['F', [[2, 0], [8, 1]], '−'] },
      { f: 'KCl', n: 'potassium chloride', m: ['K', [[2, 0], [8, 0], [8, 0]], '+'], a: ['Cl', [[2, 0], [8, 0], [8, 1]], '−'] }]);
    const svg = wrap(420, 200, ion(110, 100, C.m[0], C.m[1], 0, C.m[2]) + ion(300, 100, C.a[0], C.a[1], 1, C.a[2]) + `<g transform="translate(150 185)">${elec(0, -4, 0)}${T(10, 0, 'metal electron', { size: 11, a: 'start' })}${elec(110, -4, 1)}${T(120, 0, 'non-metal electron', { size: 11, a: 'start' })}</g>`);
    const others = ['NaCl', 'MgO', 'LiF', 'KCl', 'MgCl₂', 'Na₂O'].filter(x => x !== C.f);
    return { title: 'Dot-and-cross: ionic', spec: 'C1.40', kind: 'diagram', svg, q: 'Which compound does this diagram show?', o: [C.f, ...others.sort(() => r.f() - .5).slice(0, 3)], x: `${C.n}: ${C.m[0]} loses ${C.m[2] === '+' ? 'one electron' : 'two electrons'} (dots) to ${C.a[0]}, giving ${C.m[0]}${C.m[2]} and ${C.a[0]}${C.a[2]}, both with full outer shells.` }; };
  M.covalent = r => { const C = r.pick([
      { f: 'H₂O', c: 'O', out: ['H', 'H'], lp: 2, ang: [-55, 55] }, { f: 'NH₃', c: 'N', out: ['H', 'H', 'H'], lp: 1, ang: [-90, 30, 150] },
      { f: 'CH₄', c: 'C', out: ['H', 'H', 'H', 'H'], lp: 0, ang: [0, 90, 180, 270] }, { f: 'HCl', c: 'Cl', out: ['H'], lp: 3, ang: [180] }]);
    const cx = 200, cy = 110, Rc = 36, Rh = 24, d = 50; let g = '';
    C.ang.forEach((a, i) => { const t = a * Math.PI / 180, x = cx + Math.cos(t) * d, y = cy + Math.sin(t) * d; g += `<circle cx="${x}" cy="${y}" r="${Rh}" fill="#fff" stroke="#555"/>` + T(x + Math.cos(t) * 8, y + Math.sin(t) * 8 + 5, 'H', { size: 14, w: 700 }); });
    g = `<circle cx="${cx}" cy="${cy}" r="${Rc}" fill="#fff" stroke="#555"/>` + g + T(cx, cy + 5, C.c, { size: 16, w: 700 });
    C.ang.forEach(a => { const t = a * Math.PI / 180, mx = cx + Math.cos(t) * 30, my = cy + Math.sin(t) * 30, px = -Math.sin(t) * 5, py = Math.cos(t) * 5; g += elec(mx + px, my + py, 0) + elec(mx - px, my - py, 1); });
    const lps = C.f === 'H₂O' ? [140, 220] : C.f === 'NH₃' ? [90] : C.f === 'HCl' ? [270, 0, 90] : [];
    lps.forEach(a => { const t = a * Math.PI / 180, mx = cx + Math.cos(t) * Rc, my = cy + Math.sin(t) * Rc, px = -Math.sin(t) * 5, py = Math.cos(t) * 5; g += elec(mx + px, my + py, 0) + elec(mx - px, my - py, 0); });
    const svg = wrap(400, 220, g);
    const lpN = C.lp;
    return r.int(0, 1) ? { title: 'Dot-and-cross: covalent', spec: 'C1.46', kind: 'diagram', svg, q: 'Which molecule does this diagram show?', o: [C.f, ...['H₂O', 'NH₃', 'CH₄', 'HCl', 'Cl₂'].filter(x => x !== C.f).sort(() => r.f() - .5).slice(0, 3)], x: `${C.c} shares one pair of electrons with each of ${C.out.length} hydrogen atom${C.out.length > 1 ? 's' : ''}: ${C.f}.` }
      : { title: 'Dot-and-cross: covalent', spec: 'C1.46', kind: 'diagram', svg, q: `How many lone pairs (pairs not in a bond) does the ${C.c} atom have?`, o: [String(lpN), ...['0', '1', '2', '3', '4'].filter(x => x !== String(lpN)).sort(() => r.f() - .5).slice(0, 3)], x: `Count the pairs on ${C.c} that are not in an overlap: ${lpN}.` }; };
  M.displayed = r => { const C = r.pick([
      { nm: 'ethane', c: 2, db: 0 }, { nm: 'propane', c: 3, db: 0 }, { nm: 'butane', c: 4, db: 0 }, { nm: 'ethene', c: 2, db: 1 }, { nm: 'propene', c: 3, db: 1 }, { nm: 'but-1-ene', c: 4, db: 1 }, { nm: 'methane', c: 1, db: 0 }]);
    const sp = 56, x0 = 200 - (C.c - 1) * sp / 2, y = 90; let g = '';
    const atom = (x, y, s) => `<rect x="${x - 9}" y="${y - 11}" width="18" height="20" fill="#fff"/>` + T(x, y + 6, s, { size: 18, w: 700 });
    const bond = (x1, y1, x2, y2, dbl) => dbl ? `<line x1="${x1}" y1="${y1 - 4}" x2="${x2}" y2="${y2 - 4}" stroke="${INK}" stroke-width="2"/><line x1="${x1}" y1="${y1 + 4}" x2="${x2}" y2="${y2 + 4}" stroke="${INK}" stroke-width="2"/>` : `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="2"/>`;
    let hs = 0;
    for (let i = 0; i < C.c; i++) {
      const x = x0 + i * sp, order = k => (k < 0 || k >= C.c - 1) ? 0 : (C.db && k === 0 ? 2 : 1);   // bond order between carbon k and k+1
      if (i < C.c - 1) g += bond(x, y, x + sp, y, order(i) === 2);
      let need = 4 - order(i) - order(i - 1);
      const spots = [[0, -1], [0, 1]]; if (i === 0) spots.push([-1, 0]); if (i === C.c - 1) spots.push([1, 0]);
      spots.slice(0, need).forEach(([dx, dy]) => { g += bond(x, y, x + dx * 42, y + dy * 42) + atom(x + dx * 48, y + dy * 48, 'H'); hs++; });
    }
    for (let i = 0; i < C.c; i++) g += atom(x0 + i * sp, y, 'C');
    const svg = wrap(400, 180, g), formula = `C${C.c > 1 ? '<sub>' + C.c + '</sub>' : ''}H<sub>${hs}</sub>`;
    return r.int(0, 1) ? { title: 'Displayed formula', spec: C.db ? 'C4.26' : 'C4.21', kind: 'diagram', svg, q: 'Name this molecule.', o: [C.nm, ...['methane', 'ethane', 'propane', 'butane', 'ethene', 'propene', 'but-1-ene'].filter(x => x !== C.nm).sort(() => r.f() - .5).slice(0, 3)], x: `${C.c} carbon atom${C.c > 1 ? 's' : ''} (${['meth', 'eth', 'prop', 'but'][C.c - 1]}-)${C.db ? ' with a C=C double bond (-ene)' : ', all single bonds (-ane)'}: ${C.nm}.` }
      : { title: 'Displayed formula', spec: C.db ? 'C4.26' : 'C4.21', kind: 'diagram', svg, q: 'What is the molecular formula of this molecule?', o: [formula, `C${C.c > 1 ? '<sub>' + C.c + '</sub>' : ''}H<sub>${hs + 2}</sub>`, `C${C.c > 1 ? '<sub>' + C.c + '</sub>' : ''}H<sub>${Math.max(2, hs - 2)}</sub>`, `C<sub>${hs}</sub>H${C.c > 1 ? '<sub>' + C.c + '</sub>' : ''}`].filter((v, i, a) => a.indexOf(v) === i), x: `Count the atoms: ${C.c} C and ${hs} H.` }; };
  M.chrom = r => { const solv = r.pick([8, 10]), refs = { A: r.pick([1.5, 2, 2.5]), B: r.pick([3.5, 4]), C: r.pick([5, 5.5]), D: r.pick([6.5, 7]) }, inX = r.pick([['A', 'C'], ['B', 'D'], ['A', 'D'], ['B', 'C']]);
    const base = 210, cm = 18, ytop = base - solv * cm; let g = `<rect x="40" y="${ytop - 30}" width="300" height="${base - ytop + 60}" fill="#fffdf5" stroke="${INK}"/>`;
    g += `<line x1="40" y1="${base}" x2="340" y2="${base}" stroke="#555" stroke-dasharray="4 3"/>` + T(344, base + 4, 'start line', { size: 11, a: 'start' }) + `<line x1="40" y1="${ytop}" x2="340" y2="${ytop}" stroke="#2563eb" stroke-dasharray="6 3"/>` + T(344, ytop + 4, 'solvent front', { size: 11, a: 'start', fill: '#2563eb' });
    for (let i = 0; i <= solv; i++) g += `<line x1="22" y1="${base - i * cm}" x2="${i % 2 ? 28 : 32}" y2="${base - i * cm}" stroke="${INK}"/>` + (i % 2 ? '' : T(16, base - i * cm + 4, i, { size: 10, a: 'end' }));
    g += `<line x1="22" y1="${base}" x2="22" y2="${ytop}" stroke="${INK}"/>` + T(20, ytop - 12, 'cm', { size: 10, a: 'end' });
    const lanes = ['A', 'B', 'C', 'D', 'X'], col = { A: '#dc2626', B: '#2563eb', C: '#16a34a', D: '#a855f7' };
    lanes.forEach((L, i) => { const x = 75 + i * 58; g += T(x, base + 22, L, { size: 13, w: 700 }) + `<circle cx="${x}" cy="${base}" r="2" fill="#555"/>`;
      (L === 'X' ? inX : [L]).forEach(s => { g += `<ellipse cx="${x}" cy="${base - refs[s] * cm}" rx="9" ry="7" fill="${col[s]}" opacity=".8"/>`; }); });
    const svg = wrap(420, base + 40, g), s = inX[1], rf = refs[s] / solv;
    return r.int(0, 1) ? { title: 'Chromatogram', spec: 'C1.12', kind: 'diagram', svg, q: 'Which dyes are in mixture X?', o: [inX.join(' and '), ...[['A', 'B'], ['C', 'D'], ['A', 'C'], ['B', 'D'], ['A', 'D'], ['B', 'C']].map(p => p.join(' and ')).filter(p => p !== inX.join(' and ')).sort(() => r.f() - .5).slice(0, 3)], x: `X's spots are at the same heights as ${inX.join(' and ')}.` }
      : { title: 'Chromatogram', spec: 'C1.12', kind: 'diagram', svg, q: `Use the scale. What is the R<sub>f</sub> value of dye ${s}?`, o: [n(rf), ...uniq(n(rf), [solv / refs[s], refs[s] / 10, 1 - rf, rf * 2, rf / 2, refs[s]].map(n))], x: `R<sub>f</sub> = distance moved by the spot ÷ distance moved by the solvent = ${refs[s]} ÷ ${solv} = ${n(rf)}.` }; };

  /* ---------- physics diagrams ---------- */
  M.ray = r => { const i = r.pick([30, 40, 45, 50, 60]), nn = 1.5, rr = Math.asin(Math.sin(i * Math.PI / 180) / nn) * 180 / Math.PI;
    const ox = 200, oy = 100, L = 90; let g = `<rect x="70" y="${oy}" width="260" height="110" fill="#e0f2fe" stroke="${INK}"/>` + T(300, oy + 100, 'glass', { size: 12 }) + T(300, oy - 80, 'air', { size: 12 });
    g += `<line x1="${ox}" y1="${oy - 90}" x2="${ox}" y2="${oy + 105}" stroke="#555" stroke-dasharray="5 4"/>` + T(ox + 6, oy - 78, 'normal', { size: 11, a: 'start' });
    const ti = i * Math.PI / 180, tr = rr * Math.PI / 180, ix = ox - Math.sin(ti) * L, iy = oy - Math.cos(ti) * L, rx = ox + Math.sin(tr) * L, ry = oy + Math.cos(tr) * L;
    g += `<line x1="${ix}" y1="${iy}" x2="${ox}" y2="${oy}" stroke="#dc2626" stroke-width="2.4"/><line x1="${ox}" y1="${oy}" x2="${rx}" y2="${ry}" stroke="#dc2626" stroke-width="2.4"/>`;
    const arc = (a0, a1, rad, lab) => { const p = a => [ox + Math.sin(a * Math.PI / 180) * rad, oy - Math.cos(a * Math.PI / 180) * rad], [x0, y0] = p(a0), [x1, y1] = p(a1), m = p((a0 + a1) / 2);
      return `<path d="M${x0} ${y0} A${rad} ${rad} 0 0 ${a1 > a0 ? 1 : 0} ${x1} ${y1}" fill="none" stroke="${INK}"/>` + T(m[0] + Math.sin((a0 + a1) / 2 * Math.PI / 180) * 12, m[1] - Math.cos((a0 + a1) / 2 * Math.PI / 180) * 12 + 4, lab, { size: 13, w: 700 }); };
    const lab = r.pick([['a', 'b', 'c', 'd'], ['p', 'q', 'r', 's']]);
    g += arc(-i, 0, 34, lab[0]) + arc(-90, -i, 52, lab[1]) + arc(180, 180 - rr, 34, lab[2]) + arc(180 - rr, 90, 52, lab[3]);
    const svg = wrap(400, 220, g);
    return r.int(0, 1) ? { title: 'Ray diagram: refraction', spec: 'P3.16', kind: 'diagram', svg, q: 'Which angle is the angle of refraction?', o: [lab[2], lab[0], lab[3], lab[1]], x: `Angles are measured from the normal. The refracted ray is inside the glass, so the angle of refraction is ${lab[2]}. (${lab[0]} is the angle of incidence.)` }
      : { title: 'Ray diagram: refraction', spec: 'P3.18', kind: 'diagram', svg, q: `Angle ${lab[0]} = ${i}° and angle ${lab[2]} = ${n(rr)}°. What is the refractive index of the glass?`, o: ['1.5', n(i / rr), n(Math.sin(rr * Math.PI / 180) / Math.sin(ti)), n(rr / i)].filter((v, k, a) => a.indexOf(v) === k), x: `n = sin i ÷ sin r = sin ${i}° ÷ sin ${n(rr)}° = 1.5.` }; };
  M.circuit = r => { const V = r.pick([6, 9, 12]), R1 = r.pick([2, 3, 4, 6]), R2 = r.pick([2, 3, 6, 12]), par = r.int(0, 1);
    let g = ''; const ln = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="2"/>`;
    const res = (x, y, lab) => `<rect x="${x - 22}" y="${y - 9}" width="44" height="18" fill="#fff" stroke="${INK}" stroke-width="2"/>` + T(x, y - 14, lab, { size: 12, w: 700 });
    const meter = (x, y, s) => `<circle cx="${x}" cy="${y}" r="13" fill="#fff" stroke="${INK}" stroke-width="2"/>` + T(x, y + 5, s, { size: 13, w: 700 });
    const cell = (x, y) => `<rect x="${x - 8}" y="${y - 16}" width="16" height="32" fill="#fff"/>` + ln(x - 5, y - 15, x - 5, y + 15) + `<line x1="${x + 5}" y1="${y - 8}" x2="${x + 5}" y2="${y + 8}" stroke="${INK}" stroke-width="4"/>` + T(x, y + 32, V + ' V', { size: 12, w: 700 });
    if (!par) { g += ln(60, 50, 340, 50) + ln(340, 50, 340, 170) + ln(340, 170, 60, 170) + ln(60, 170, 60, 50) + res(150, 50, R1 + ' Ω') + res(260, 50, R2 + ' Ω') + meter(340, 110, 'A') + cell(200, 170); }
    else { g += ln(60, 40, 340, 40) + ln(60, 110, 340, 110) + ln(60, 40, 60, 190) + ln(340, 40, 340, 190) + ln(60, 190, 340, 190) + res(200, 40, R1 + ' Ω') + res(200, 110, R2 + ' Ω') + meter(110, 190, 'A') + cell(260, 190); }
    const I = par ? V / R1 + V / R2 : V / (R1 + R2), svg = wrap(400, 230, g);
    return { title: par ? 'Circuit: parallel' : 'Circuit: series', spec: 'P2.19', kind: 'diagram', svg, q: 'What is the reading on the ammeter?', o: [n(I) + ' A', ...uniq(I, par ? [V / (R1 + R2), V / R1, V * (R1 + R2)] : [V / R1 + V / R2, V / R1, V * (R1 + R2)]).map(v => n(v) + ' A')],
      x: par ? `Each branch gets the full ${V} V: ${V} ÷ ${R1} = ${n(V / R1)} A and ${V} ÷ ${R2} = ${n(V / R2)} A. The ammeter is in the main wire, so it reads the total: ${n(I)} A.` : `In series the resistances add: ${R1} + ${R2} = ${R1 + R2} Ω. I = V ÷ R = ${V} ÷ ${R1 + R2} = ${n(I)} A.` }; };

  /* ---------- biology diagrams ---------- */
  M.punnett = r => { const t = r.pick([{ A: 'T', a: 't', dom: 'tall', rec: 'short' }, { A: 'B', a: 'b', dom: 'brown eyes', rec: 'blue eyes' }, { A: 'R', a: 'r', dom: 'round seeds', rec: 'wrinkled seeds' }]);
    const cross = r.pick([[[t.A, t.a], [t.A, t.a]], [[t.A, t.a], [t.a, t.a]], [[t.A, t.A], [t.a, t.a]], [[t.A, t.a], [t.A, t.A]]]);
    const [p1, p2] = cross, kids = [p2[0], p2[1]].flatMap(g2 => [p1[0], p1[1]].map(g1 => [g1, g2].sort((x, y) => x === t.A ? -1 : y === t.A ? 1 : 0).join('')));
    const recN = kids.filter(k => k === t.a + t.a).length; let g = '';
    const box = (x, y, s, head) => `<rect x="${x}" y="${y}" width="70" height="50" fill="${head ? '#eeeae0' : '#fff'}" stroke="${INK}" stroke-width="1.6"/>` + T(x + 35, y + 32, s, { size: 20, w: head ? 700 : 400 });
    g += T(155, 22, `Parent 1 (${p1.join('')}) gametes`, { size: 12, w: 600 }) + T(22, 120, `Parent 2 (${p2.join('')})`, { size: 12, w: 600, rot: -90 });
    g += box(50, 30, '', 1) + box(120, 30, p1[0], 1) + box(190, 30, p1[1], 1) + box(50, 80, p2[0], 1) + box(50, 130, p2[1], 1);
    kids.forEach((k, i) => { g += box(120 + (i % 2) * 70, 80 + Math.floor(i / 2) * 50, k); });
    const svg = wrap(290, 190, g), frac = ['0', '1 in 4 (25%)', '2 in 4 (50%)', '3 in 4 (75%)', '4 in 4 (100%)'];
    return { title: 'Punnett square', spec: 'B3.23', kind: 'diagram', svg, q: `${t.A} = ${t.dom} (dominant), ${t.a} = ${t.rec}. What is the probability that a child is ${t.rec}?`, o: [frac[recN], ...frac.filter((_, i) => i !== recN).sort(() => r.f() - .5).slice(0, 3)], x: `Only ${t.a}${t.a} shows the recessive feature. ${recN} of the 4 boxes is ${t.a}${t.a}, so ${frac[recN]}.` }; };
  M.pedigree = r => { const dad = r.int(0, 1), aff = r.int(0, 2), kids = r.pick([3, 4]); let g = '';
    const person = (x, y, male, ill, lab) => (male ? `<rect x="${x - 14}" y="${y - 14}" width="28" height="28" fill="${ill ? INK : '#fff'}" stroke="${INK}" stroke-width="2"/>` : `<circle cx="${x}" cy="${y}" r="14" fill="${ill ? INK : '#fff'}" stroke="${INK}" stroke-width="2"/>`) + T(x, y + 32, lab, { size: 12, w: 700 });
    const ln = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="2"/>`;
    g += ln(164, 40, 236, 40) + ln(200, 40, 200, 80) + person(150, 40, 1, 0, '1') + person(250, 40, 0, 0, '2');
    const xs = Array.from({ length: kids }, (_, i) => 200 + (i - (kids - 1) / 2) * 70); g += ln(xs[0], 80, xs[kids - 1], 80);
    xs.forEach((x, i) => { g += ln(x, 80, x, 106) + person(x, 120, (i + dad) % 2 === 0, i === aff, String(i + 3)); });
    g += `<g transform="translate(20 190)"><rect x="0" y="-10" width="12" height="12" fill="#fff" stroke="${INK}"/>${T(18, 0, 'male', { size: 11, a: 'start' })}<circle cx="70" cy="-4" r="6" fill="#fff" stroke="${INK}"/>${T(80, 0, 'female', { size: 11, a: 'start' })}<rect x="130" y="-10" width="12" height="12" fill="${INK}"/>${T(148, 0, 'has the condition', { size: 11, a: 'start' })}</g>`;
    const svg = wrap(400, 205, g);
    return r.int(0, 1) ? { title: 'Family pedigree', spec: 'B3.24', kind: 'diagram', svg, q: 'The condition is caused by a recessive allele (n). What are the genotypes of parents 1 and 2?', o: ['Both Nn', 'Both nn', 'Both NN', 'NN and nn'], x: `Neither parent has the condition, but child ${aff + 3} does (nn). Each parent must have passed on an n, so both are Nn (carriers).` }
      : { title: 'Family pedigree', spec: 'B3.24', kind: 'diagram', svg, q: 'The condition is recessive. What is the chance that the parents\' next child has the condition?', o: ['1 in 4 (25%)', '1 in 2 (50%)', '0', '3 in 4 (75%)'], x: 'Both parents are carriers (Nn × Nn): NN, Nn, Nn, nn → 1 in 4 chance of nn. Each child is a separate chance.' }; };

  const MAKERS = [['vt', 'P1.8'], ['dt', 'P1.3'], ['fe', 'P1.23'], ['half', 'P7.13'], ['rate', 'C3.10'], ['enzyme', 'B2.10'], ['cool', 'C1.1'], ['table', 'C3.15'],
    ['ionic', 'C1.40'], ['covalent', 'C1.46'], ['displayed', 'C4.21'], ['chrom', 'C1.12'], ['ray', 'P3.16'], ['circuit', 'P2.19'], ['punnett', 'B3.23'], ['pedigree', 'B3.24']];
  function make(name) { const q = M[name](rnd()); q.o = q.o.slice(0, 4); return q; }
  return { make, MAKERS, M };
})();
