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
  function chart({ xmax, ymax, xstep, ystep, xl, yl, series, w = 380, h = 260, marks = [], extra, noXticks }) {
    const L = 52, R = 14, Tp = 14, B = 42, px = x => L + x / xmax * (w - L - R), py = y => h - B - y / ymax * (h - Tp - B);
    let g = '';
    for (let x = 0; x <= xmax + 1e-9; x += xstep / 2) g += `<line x1="${px(x)}" y1="${py(0)}" x2="${px(x)}" y2="${py(ymax)}" stroke="${GRID}" stroke-width="${Math.abs(x / xstep - Math.round(x / xstep)) < 1e-6 ? 1 : .5}"/>`;
    for (let y = 0; y <= ymax + 1e-9; y += ystep / 2) g += `<line x1="${px(0)}" y1="${py(y)}" x2="${px(xmax)}" y2="${py(y)}" stroke="${GRID}" stroke-width="${Math.abs(y / ystep - Math.round(y / ystep)) < 1e-6 ? 1 : .5}"/>`;
    if (!noXticks) for (let x = 0; x <= xmax + 1e-9; x += xstep) g += T(px(x), py(0) + 15, n(x), { size: 11 });
    for (let y = 0; y <= ymax + 1e-9; y += ystep) g += T(px(0) - 6, py(y) + 4, n(y), { size: 11, a: 'end' });
    g += `<line x1="${px(0)}" y1="${py(0)}" x2="${px(xmax)}" y2="${py(0)}" stroke="${INK}" stroke-width="1.6"/><line x1="${px(0)}" y1="${py(0)}" x2="${px(0)}" y2="${py(ymax)}" stroke="${INK}" stroke-width="1.6"/>`;
    g += T((px(0) + px(xmax)) / 2, h - 8, xl, { size: 12, w: 600 }) + T(14, (py(0) + py(ymax)) / 2, yl, { size: 12, w: 600, rot: -90 });
    series.forEach(s => { g += `<polyline points="${s.pts.map(([x, y]) => px(x).toFixed(1) + ',' + py(y).toFixed(1)).join(' ')}" fill="none" stroke="${s.col || INK}" stroke-width="2.2" stroke-linejoin="round"${s.dash ? ' stroke-dasharray="6 4"' : ''}/>`;
      if (s.label) { const [x, y] = s.pts[s.lab || s.pts.length - 1]; g += T(px(x) + 6, py(y) - 6, s.label, { size: 12, w: 700, a: 'start', fill: s.col || INK }); } });
    marks.forEach(([x, y, lab]) => { g += `<circle cx="${px(x)}" cy="${py(y)}" r="3" fill="${INK}"/>` + T(px(x) + (lab.dx || 0), py(y) - 8, lab.t || lab, { size: 12, w: 700 }); });
    if (extra) g += extra(px, py);
    return wrap(w, h, g);
  }
  const curve = (f, a, b, k = 60) => Array.from({ length: k + 1 }, (_, i) => { const x = a + (b - a) * i / k; return [x, f(x)]; });

  const M = {};
  /* ---------- graphs ---------- */
  M.vt = r => { const [vu, au, du] = r.pick([['m/s', 'm/s²', 'm'], ['m/s', 'm/s²', 'm'], ['cm/s', 'cm/s²', 'cm']]), v = r.pick([4, 6, 8, 10, 12, 15, 20]), t1 = r.pick([2, 4, 5]), t2 = t1 + r.pick([4, 5, 6]), t3 = t2 + r.pick([2, 3, 4, 5]);
    const svg = chart({ xmax: t3 + 1, ymax: Math.ceil(v * 1.25 / 2) * 2, xstep: 2, ystep: v > 10 ? 5 : 2, xl: 'Time (s)', yl: `Velocity (${vu})`, series: [{ pts: [[0, 0], [t1, v], [t2, v], [t3, 0]] }] });
    const dist = v * t1 / 2 + v * (t2 - t1) + v * (t3 - t2) / 2;
    if (r.int(0, 1)) return { title: 'Velocity–time graph', spec: 'P1.8', kind: 'graph', svg, q: `What is the acceleration during the first ${t1} s?`, o: [n(v / t1) + ' ' + au, ...uniq(v / t1, [v * t1, t1 / v, v]).map(x => n(x) + ' ' + au)], x: `Acceleration = gradient = change in velocity ÷ time = ${v} ÷ ${t1} = ${n(v / t1)} ${au}.` };
    return { title: 'Velocity–time graph', spec: 'P1.9', kind: 'graph', svg, q: 'How far does the object travel in the whole journey?', o: [n(dist) + ' ' + du, ...uniq(dist, [v * t3, v * (t2 - t1), dist / 2]).map(x => n(x) + ' ' + du)], x: `Distance = area under the graph: triangle ${n(v * t1 / 2)} + rectangle ${v * (t2 - t1)} + triangle ${n(v * (t3 - t2) / 2)} = ${n(dist)} ${du}.` }; };
  M.dt = r => { const [du, tu, su] = r.pick([['m', 's', 'm/s'], ['m', 's', 'm/s'], ['km', 'h', 'km/h'], ['cm', 's', 'cm/s'], ['m', 'min', 'm/min'], ['km', 'min', 'km/min']]), d = r.pick([20, 40, 60, 80, 100]), t1 = r.pick([4, 5, 10]), t2 = t1 + r.pick([4, 5, 6]), t3 = t2 + r.pick([5, 10]);
    const svg = chart({ xmax: t3 + 2, ymax: d * 1.25, xstep: t3 > 20 ? 5 : 2, ystep: d / 4, xl: `Time (${tu})`, yl: `Distance (${du})`, series: [{ pts: [[0, 0], [t1, d], [t2, d], [t3, 0]] }] });
    return r.int(0, 1) ? { title: 'Distance–time graph', spec: 'P1.3', kind: 'graph', svg, q: `What is the speed during the first ${t1} ${tu}?`, o: [n(d / t1) + ' ' + su, ...uniq(d / t1, [d * t1, t1 / d, d / t2]).map(x => n(x) + ' ' + su)], x: `Speed = gradient = distance ÷ time = ${d} ÷ ${t1} = ${n(d / t1)} ${su}.` }
      : { title: 'Distance–time graph', spec: 'P1.3', kind: 'graph', svg, q: 'For how long is the object stationary?', o: [(t2 - t1) + ' ' + tu, ...uniq(t2 - t1, [t2, t1, t3 - t2, t3, t2 - t1 + 2]).map(v => v + ' ' + tu)], x: `A flat line means not moving: from ${t1} ${tu} to ${t2} ${tu}, so ${t2 - t1} ${tu}.` }; };
  M.fe = r => { const [eu, ef] = r.pick([['cm', 1], ['cm', 1], ['mm', 10]]), k = r.pick([2, 4, 5]), lim = r.pick([6, 8, 10]), xmax = lim + 4, F0 = r.pick([2, 4, 6].filter(x => x < lim));
    const ext = F => ef * (F <= lim ? F / k : lim / k + (F - lim) ** 1.6 / k * 0.6);   // straight (Hooke's law) up to P, then curving
    const svg = chart({ xmax, ymax: ef * Math.ceil(ext(xmax) / ef + 0.5), xstep: 2, ystep: ef, xl: 'Force (N)', yl: `Extension (${eu})`, series: [{ pts: curve(ext, 0, xmax) }], marks: [[lim, ext(lim), { t: 'P', dx: -10 }]] });
    return r.int(0, 1) ? { title: 'Force–extension graph', spec: 'P1.23', kind: 'graph', svg, q: `What is the extension when the force is ${F0} N?`, o: [n(ext(F0)) + ' ' + eu, ...uniq(ext(F0), [F0 * k, ext(F0) * 2, F0, ext(F0) / 10]).map(x => n(x) + ' ' + eu)], x: `Read up from ${F0} N to the line, then across: ${n(ext(F0))} ${eu}.` }
      : { title: 'Force–extension graph', spec: 'P1.23', kind: 'graph', svg, q: 'What happens to the spring after point P?', o: ['It no longer obeys Hooke\'s law: extension is not proportional to force', 'It snaps', 'The extension stops increasing', 'It obeys Hooke\'s law more closely'], x: 'The straight, sloping part is where extension is proportional to force (Hooke\'s law). After P the line curves: the limit of proportionality has been passed.' }; };
  M.half = r => { const A0 = r.pick([400, 800, 1200, 1600]), hl = r.pick([2, 3, 4, 5, 6]), u = r.pick(['seconds', 'minutes', 'hours', 'days', 'years']), [au, al] = r.pick([['Bq', 'Activity (Bq)'], ['kBq', 'Activity (kBq)'], ['counts/min', 'Count rate (counts per minute)'], ['counts/s', 'Count rate (counts per second)']]);
    const svg = chart({ xmax: hl * 4, ymax: A0, xstep: hl, ystep: A0 / 4, xl: `Time (${u})`, yl: al, series: [{ pts: curve(t => A0 * 0.5 ** (t / hl), 0, hl * 4) }] });
    return { title: 'Radioactive decay curve', spec: 'P7.13', kind: 'graph', svg, q: 'What is the half-life of this isotope?', o: [`${hl} ${u}`, `${hl * 2} ${u}`, `${hl * 4} ${u}`, `${A0 / 2} ${u}`], x: `Half-life = time for the ${au.startsWith('count') ? 'count rate' : 'activity'} to halve: ${A0} → ${A0 / 2} ${au} takes ${hl} ${u}.` }; };
  M.rate = r => { const mass = r.f() < .35, tu = r.pick(['s', 's', 'min']), V = mass ? r.pick([1.2, 1.6, 2, 2.4]) : r.pick([40, 50, 60, 80]), vu = mass ? 'g' : r.pick(['cm³', 'cm³', 'ml']), a = r.pick([8, 10, 12]), b = a * r.pick([2, 3]), tm = b * 4;
    const svg = chart({ xmax: tm, ymax: V * 1.2, xstep: tm / 6, ystep: V / 4, xl: `Time (${tu})`, yl: mass ? 'Mass lost (g)' : `Volume of gas (${vu})`, series: [{ pts: curve(t => V * (1 - Math.exp(-t / a)), 0, tm), label: 'A', lab: 12 }, { pts: curve(t => V * (1 - Math.exp(-t / b)), 0, tm), label: 'B', lab: 24, dash: 1 }] });
    return r.int(0, 1) ? { title: 'Rate of reaction curves', spec: 'C3.10', kind: 'graph', svg, q: 'Which line shows the reaction with the more concentrated acid? (The same mass of marble chips each time.)', o: ['A: it is steeper at the start', 'B: it takes longer, so more reacts', 'A: it makes more gas in the end', 'Both are the same concentration'], x: 'More concentrated acid → more frequent collisions → faster rate → steeper curve at the start. Both end at the same volume because the same amount of marble reacts.' }
      : { title: 'Rate of reaction curves', spec: 'C3.10', kind: 'graph', svg, q: mass ? 'What total mass of carbon dioxide was given off in each reaction?' : 'What total volume of gas did each reaction produce?', o: [`${V} ${vu}`, ...uniq(V, [V * 1.2, V / 2, tm, V * 2]).map(v => `${n(v)} ${vu}`)], x: `Both lines level off at ${V} ${vu}: that's when the reaction has finished.` }; };
  M.enzyme = r => { const opt = r.pick([30, 35, 37, 40, 45]);
    const act = T0 => T0 <= opt ? 100 * Math.exp(-(((T0 - opt) / 18) ** 2)) : Math.max(0, 100 * (1 - ((T0 - opt) / 14) ** 2));
    const svg = chart({ xmax: 70, ymax: 120, xstep: 10, ystep: 20, xl: 'Temperature (°C)', yl: 'Rate of reaction (a.u.)', series: [{ pts: curve(act, 0, 70, 70) }] });
    return { title: 'Enzyme activity and temperature', spec: 'B2.10', kind: 'graph', svg, q: 'What is the optimum temperature for this enzyme, and why does the rate fall so quickly above it?', o: [`${opt} °C; the active site changes shape (denatures)`, `${opt} °C; the enzyme is killed`, `${opt + 15} °C; the substrate runs out`, `70 °C; molecules move fastest`], x: `The peak is at ${opt} °C. Above it the enzyme denatures: the active site changes shape so the substrate no longer fits. Enzymes aren't alive, so they aren't "killed".` }; };
  M.cool = r => { const sec = r.f() < .4, tf = sec ? 60 : 1, mp = r.pick([45, 53, 62, 70, 80]), t0 = mp + r.pick([25, 35]), a = r.pick([3, 4, 5]), b = a + r.pick([5, 6, 8]);
    const f = t => t < a ? t0 - (t0 - mp) * t / a : t < b ? mp : mp - (t - b) * 4;
    const svg = chart({ xmax: (b + 5) * tf, ymax: Math.ceil((t0 + 10) / 20) * 20, xstep: 2 * tf, ystep: 20, xl: sec ? 'Time (s)' : 'Time (min)', yl: 'Temperature (°C)', series: [{ pts: [[0, t0], [a * tf, mp], [b * tf, mp], [(b + 5) * tf, f(b + 5)]] }], marks: [[0, t0, { t: 'A', dx: 12 }], [a * tf, mp, 'B'], [b * tf, mp, 'C'], [(b + 5) * tf, f(b + 5), { t: 'D', dx: -8 }]] });
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


  /* ================= 18 Nov round 2 (user feedback) ================= */
  const elec = (x, y, cross) => cross === 2 ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" fill="#fff" stroke="#15803d" stroke-width="1.8"/>` : cross ? `<path d="M${(x - 3.5).toFixed(1)} ${(y - 3.5).toFixed(1)}l7 7M${(x + 3.5).toFixed(1)} ${(y - 3.5).toFixed(1)}l-7 7" stroke="#c8001e" stroke-width="2"/>` : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="#1e3a8a"/>`;
  const sh = (a, r) => a.slice().sort(() => r.f() - .5);
  const others = (ans, pool, r) => sh(pool.filter(x => x !== ans), r).slice(0, 3);
  /* up to 8 electrons in 4 pairs (top, right, bottom, left); 2 on a first shell sit top and bottom */
  /* how electrons sit on a shell: RING = 'pairs' (in pairs at top/right/bottom/left), 'single' (one at each of the four points first, then pairing up), 'spread' (evenly round the shell). Set by each maker. */
  let RING = 'pairs';
  const ringXY = (cnt, i, rad) => { const Q4 = [0, Math.PI / 2, Math.PI, 1.5 * Math.PI]; let ang;
    if (cnt <= 2 && rad < 30) ang = [0, Math.PI][i];
    else if (RING === 'spread') ang = i / cnt * 2 * Math.PI + (cnt % 4 === 0 ? Math.PI / cnt : 0);
    else if (RING === 'single') { const slot = i % 4; ang = Q4[slot] + (cnt > slot + 4 ? (i < 4 ? -.3 : .3) : 0); }
    else ang = Q4[Math.floor(i / 2) % 4] + (i % 2 ? .3 : -.3);
    return [Math.sin(ang) * rad, -Math.cos(ang) * rad]; };

  /* ---------- chromatography: multi-spot dyes, smears, an insoluble spot on the start line ---------- */
  M.chrom = r => {
    const solv = 8, H = [1.2, 2, 2.8, 3.6, 4.4, 5.2, 6, 6.8], pool = sh(H, r), refs = {}, L = ['A', 'B', 'C', 'D'];
    const twoSpot = r.hard ? sh(L, r).slice(0, 2) : [r.pick(L)];
    L.forEach(l => { refs[l] = [pool.pop()]; if (twoSpot.includes(l)) refs[l].push(pool.pop()); });
    const insol = r.hard && r.f() < .6 ? r.pick(L.filter(l => refs[l].length === 1)) : null; if (insol) refs[insol].push(0);
    const inX = sh(L, r).slice(0, r.hard ? r.pick([2, 3]) : 2).sort(), xSpots = [...new Set(inX.flatMap(l => refs[l]))], smear = r.hard || r.f() < .4;
    const base = 205, cm = 17, ytop = base - solv * cm, col = { A: '#dc2626', B: '#2563eb', C: '#16a34a', D: '#a855f7', X: '#555' };
    let g = `<defs><filter id="blur"><feGaussianBlur stdDeviation="1.6"/></filter><linearGradient id="sm" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-opacity="0"/><stop offset="1" stop-opacity=".5"/></linearGradient></defs>`;
    g += `<rect x="40" y="${ytop - 26}" width="300" height="${base - ytop + 56}" fill="#fffdf5" stroke="${INK}"/><line x1="40" y1="${base}" x2="340" y2="${base}" stroke="#555" stroke-dasharray="4 3"/>` + T(344, base + 4, 'start line', { size: 11, a: 'start' })
      + `<line x1="40" y1="${ytop}" x2="340" y2="${ytop}" stroke="#2563eb" stroke-dasharray="6 3"/>` + T(344, ytop + 4, 'solvent front', { size: 11, a: 'start', fill: '#2563eb' });
    for (let i = 0; i <= solv; i++) g += `<line x1="22" y1="${base - i * cm}" x2="${i % 2 ? 27 : 31}" y2="${base - i * cm}" stroke="${INK}"/>` + (i % 2 ? '' : T(16, base - i * cm + 4, i, { size: 10, a: 'end' }));
    g += `<line x1="22" y1="${base}" x2="22" y2="${ytop}" stroke="${INK}"/>` + T(20, ytop - 10, 'cm', { size: 10, a: 'end' });
    const spot = (x, h, c, smr) => { const y = base - h * cm; return (smr && h > 0 ? `<rect x="${x - 6}" y="${y}" width="12" height="${h * cm * .55}" fill="${c}" opacity=".35" filter="url(#blur)" rx="6"/>` : '')
      + `<ellipse cx="${x}" cy="${y}" rx="${h ? 9 : 7}" ry="${h ? 7 : 5}" fill="${c}" opacity=".85" filter="url(#blur)"/>`; };
    [...L, 'X'].forEach((l, i) => { const x = 75 + i * 58; g += T(x, base + 22, l, { size: 13, w: 700 }) + `<circle cx="${x}" cy="${base}" r="2" fill="#555"/>`;
      if (l === 'X') inX.forEach(d => refs[d].forEach(h => { g += spot(x, h, col[d], smear); })); else refs[l].forEach(h => { g += spot(x, h, col[l], false); }); });
    const svg = wrap(420, base + 34, g), pairs = (k) => { const out = []; const c = (s, a) => { if (a.length === k) { out.push(a.join(', ')); return; } for (let i = s; i < 4; i++) c(i + 1, [...a, L[i]]); }; c(0, []); return out; };
    const qs = ['which', 'count', 'rf'].concat(twoSpot.length < 4 ? ['pure'] : []).concat(insol ? ['insol'] : []), q = r.pick(qs);
    const title = 'Chromatogram', spec = 'C1.12';
    if (q === 'which') { const ans = inX.join(', '); return { title, spec, kind: 'diagram', svg, q: 'Which dyes are in mixture X?', o: [ans, ...others(ans, [...pairs(2), ...pairs(3)], r)], x: `Every spot in X matches a spot at the same height in ${ans}${smear ? ' (the smear above the start line is just X\'s spots streaking: too much was put on)' : ''}.` }; }
    if (q === 'count') { const k = xSpots.length; return { title, spec, kind: 'diagram', svg, q: 'At least how many different substances are in X?', o: [String(k), ...others(String(k), ['1', '2', '3', '4', '5', '6'], r)], x: `Count the separate spots in X: ${k}${xSpots.includes(0) ? ' (including the one left on the start line, which didn\'t dissolve)' : ''}.` }; }
    if (q === 'pure') { const pure = L.filter(l => refs[l].length === 1), ans = pure.join(', '); return { title, spec, kind: 'diagram', svg, q: 'Which of A–D could be pure substances?', o: [ans, ...others(ans, ['A', 'B', 'C', 'D', 'A, B', 'C, D', 'A, C', 'B, D', 'A, B, C', 'B, C, D', 'A, B, C, D'], r)], x: `A pure substance gives a single spot: ${ans}.` }; }
    if (q === 'insol') return { title, spec, kind: 'diagram', svg, q: `Why has one spot of ${insol} stayed on the start line?`, o: ['That substance is insoluble in the solvent', 'It is the most soluble substance', 'The start line was drawn in ink', 'The solvent front hasn\'t reached it yet'], x: 'A substance that doesn\'t dissolve in the solvent isn\'t carried up the paper, so it stays on the start line.' };
    const d = r.pick(L.filter(l => refs[l][0] > 0)), h = refs[d][0], rf = h / solv;
    return { title, spec, kind: 'diagram', svg, q: `Use the scale. What is the R<sub>f</sub> value of ${refs[d].length > 1 ? 'the higher spot of ' : ''}dye ${d}?`.replace('the higher spot of dye', 'the higher spot of dye'), o: [n(Math.max(...refs[d]) / solv), ...uniq(n(Math.max(...refs[d]) / solv), [solv / Math.max(...refs[d]), Math.max(...refs[d]) / 10, 1 - Math.max(...refs[d]) / solv, Math.max(...refs[d])].map(n))], x: `R<sub>f</sub> = distance moved by the spot ÷ distance moved by the solvent = ${Math.max(...refs[d])} ÷ ${solv} = ${n(Math.max(...refs[d]) / solv)}.` };
  };

  /* ---------- circuits: series with voltmeters, parallel with branch ammeters, mixed, and symbols ---------- */
  const SYM = {
    res: (x, y) => `<rect x="${x - 20}" y="${y - 8}" width="40" height="16" fill="#fff" stroke="${INK}" stroke-width="2"/>`,
    lamp: (x, y) => `<circle cx="${x}" cy="${y}" r="12" fill="#fff" stroke="${INK}" stroke-width="2"/><path d="M${x - 8.5} ${y - 8.5}l17 17M${x + 8.5} ${y - 8.5}l-17 17" stroke="${INK}" stroke-width="2"/>`,
    diode: (x, y) => `<rect x="${x - 14}" y="${y - 12}" width="28" height="24" fill="#fff"/><path d="M${x - 9} ${y - 10}v20l18 -10z" fill="#fff" stroke="${INK}" stroke-width="2"/><path d="M${x + 9} ${y - 10}v20" stroke="${INK}" stroke-width="2.4"/>`,
    ldr: (x, y) => `<circle cx="${x}" cy="${y}" r="20" fill="#fff" stroke="${INK}" stroke-width="2"/>` + SYM.res(x, y).replace(/x="[^"]*" y="[^"]*" width="40" height="16"/, `x="${x - 13}" y="${y - 6}" width="26" height="12"`) + `<path d="M${x - 26} ${y - 26}l12 12M${x - 18} ${y - 30}l12 12" stroke="${INK}" stroke-width="1.6"/><path d="M${x - 14} ${y - 14}l-5 -1 4 -4zM${x - 6} ${y - 18}l-5 -1 4 -4z" fill="${INK}"/>`,
    therm: (x, y) => SYM.res(x, y) + `<path d="M${x - 24} ${y + 14}h7l26 -28" fill="none" stroke="${INK}" stroke-width="1.8"/>`,
    fuse: (x, y) => `<rect x="${x - 20}" y="${y - 7}" width="40" height="14" fill="#fff" stroke="${INK}" stroke-width="2"/><path d="M${x - 20} ${y}h40" stroke="${INK}" stroke-width="2"/>`,
    sw: (x, y) => `<rect x="${x - 18}" y="${y - 14}" width="36" height="20" fill="#fff"/><circle cx="${x - 14}" cy="${y}" r="2.5" fill="${INK}"/><circle cx="${x + 14}" cy="${y}" r="2.5" fill="${INK}"/><path d="M${x - 14} ${y}l26 -12" stroke="${INK}" stroke-width="2"/>`,
    vres: (x, y) => SYM.res(x, y) + `<path d="M${x - 22} ${y + 13}l40 -26" stroke="${INK}" stroke-width="1.8"/><path d="M${x + 22} ${y - 16}l-8 1 4 6z" fill="${INK}"/>`,
    cell: (x, y) => `<rect x="${x - 8}" y="${y - 16}" width="16" height="32" fill="#fff"/><path d="M${x - 5} ${y - 15}v30" stroke="${INK}" stroke-width="2"/><path d="M${x + 5} ${y - 8}v16" stroke="${INK}" stroke-width="4"/>`,
    batt: (x, y) => `<rect x="${x - 18}" y="${y - 16}" width="36" height="32" fill="#fff"/><path d="M${x - 15} ${y - 15}v30M${x + 3} ${y - 15}v30" stroke="${INK}" stroke-width="2"/><path d="M${x - 5} ${y - 8}v16M${x + 13} ${y - 8}v16" stroke="${INK}" stroke-width="4"/><path d="M${x - 5} ${y}h8" stroke="${INK}" stroke-width="1" stroke-dasharray="2 2"/>`,
    A: (x, y, lab = 'A') => `<circle cx="${x}" cy="${y}" r="13" fill="#fff" stroke="${INK}" stroke-width="2"/>` + T(x, y + 5, 'A', { size: 13, w: 700 }) + (lab !== 'A' ? T(x + 17, y - 12, lab, { size: 11, w: 700, a: 'start' }) : ''),
    V: (x, y, lab = 'V') => `<circle cx="${x}" cy="${y}" r="13" fill="#fff" stroke="${INK}" stroke-width="2"/>` + T(x, y + 5, 'V', { size: 13, w: 700 }) + (lab !== 'V' ? T(x + 17, y - 12, lab, { size: 11, w: 700, a: 'start' }) : ''),
  };
  const SYMNAME = { res: 'resistor', lamp: 'lamp', diode: 'diode', ldr: 'light-dependent resistor (LDR)', therm: 'thermistor', fuse: 'fuse', sw: 'switch (open)', vres: 'variable resistor' };
  const wire = (pts) => `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${INK}" stroke-width="2"/>`;
  const dotJ = (x, y) => `<circle cx="${x}" cy="${y}" r="3.5" fill="${INK}"/>`;
  const lab = (x, y, s) => T(x, y, s, { size: 12, w: 700 });
  M.circuit = r => {
    const kind = r.hard ? r.pick(['series3', 'parallel3', 'mixed', 'ident']) : r.pick(['series2', 'parallel2', 'ident']);
    const V = r.pick([6, 9, 12, 24]);
    if (kind === 'series2' || kind === 'series3') {
      const [RU, IU] = r.pick([['Ω', 'A'], ['Ω', 'A'], ['kΩ', 'mA']]), k = kind === 'series2' ? 2 : 3, Rs = Array.from({ length: k }, () => r.pick([2, 3, 4, 6, 8, 12])), Rt = Rs.reduce((a, b) => a + b, 0), I = V / Rt, vi = r.int(0, k - 1);
      let g = wire([[50, 70], [350, 70], [350, 190], [50, 190], [50, 70]]); const xs = Rs.map((_, i) => 50 + (i + 1) * 300 / (k + 1));
      xs.forEach((x, i) => { g += SYM.res(x, 70) + lab(x, 95, `R${i + 1} = ${Rs[i]} ${RU}`); });
      g += SYM.A(350, 130) + SYM[V > 9 ? 'batt' : 'cell'](170, 190) + lab(170, 222, `${V} V`) + SYM.sw(260, 190);
      g += wire([[xs[vi] - 32, 70], [xs[vi] - 32, 28], [xs[vi] + 32, 28], [xs[vi] + 32, 70]]) + dotJ(xs[vi] - 32, 70) + dotJ(xs[vi] + 32, 70) + SYM.V(xs[vi], 28);
      const svg = wrap(400, 235, g), q = r.int(0, 2);
      if (q === 0) return { title: 'Circuit: series', spec: 'P2.19', kind: 'diagram', svg, q: 'The switch is closed. What does the ammeter read?', o: [n(I) + ' ' + IU, ...uniq(n(I), [V / Rs[0], V * Rt, Rt / V, V / Rs.length, I * 1000].map(v => n(v))).map(v => v + ' ' + IU)], x: `Series: R = ${Rs.join(' + ')} = ${Rt} ${RU}. I = V ÷ R = ${V} ÷ ${Rt}${RU === 'kΩ' ? ' 000' : ''} = ${n(I)} ${IU}${RU === 'kΩ' ? ' (volts ÷ kilohms gives milliamps)' : ''}.` };
      if (q === 1) return { title: 'Circuit: series', spec: 'P2.19', kind: 'diagram', svg, q: 'The switch is closed. What does the voltmeter read?', o: [n(I * Rs[vi]) + ' V', ...uniq(n(I * Rs[vi]), [V, V / k, V - I * Rs[vi], Rs[vi], V * 2, I, Rt].map(v => n(v))).map(v => v + ' V')], x: `I = ${V} ÷ ${Rt} = ${n(I)} ${IU}, the same everywhere in a series circuit. V = I × R = ${n(I)} ${IU} × ${Rs[vi]} ${RU} = ${n(I * Rs[vi])} V.` };
      return { title: 'Circuit: series', spec: 'P2.19', kind: 'diagram', svg, q: 'What is the total resistance of the circuit?', o: [Rt + ' ' + RU, ...uniq(Rt, [Math.max(...Rs), Rs.reduce((a, b) => a * b, 1), n(1 / Rs.reduce((a, b) => a + 1 / b, 0))].map(Number)).map(v => n(v) + ' ' + RU)], x: `In series, resistances add: ${Rs.join(' + ')} = ${Rt} ${RU}.` };
    }
    if (kind === 'parallel2' || kind === 'parallel3') {
      const k = kind === 'parallel2' ? 2 : 3, comps = Array.from({ length: k }, () => r.pick(['res', 'res', 'lamp'])), Rs = Array.from({ length: k }, () => r.pick([2, 3, 4, 6, 8, 12].filter(R => (V * 100) % R === 0))), Is = Rs.map(R => V / R), It = Is.reduce((a, b) => a + b, 0);
      const ys = Array.from({ length: k }, (_, i) => 40 + i * 62), bot = ys[k - 1] + 70; let g = wire([[60, ys[0]], [60, bot], [340, bot], [340, ys[0]]]);
      ys.forEach((y, i) => { g += wire([[60, y], [340, y]]) + SYM[comps[i]](170, y) + lab(170, y - 16, `${Rs[i]} Ω`) + SYM.A(270, y, 'A' + (i + 1)); if (i) g += dotJ(60, y) + dotJ(340, y); });
      g += SYM.A(120, bot, 'A') + SYM[V > 9 ? 'batt' : 'cell'](250, bot) + lab(250, bot + 32, `${V} V`);
      const svg = wrap(400, bot + 45, g), q = r.int(0, 2);
      if (q === 0) return { title: `Circuit: parallel (${k} branches)`, spec: 'P2.17', kind: 'diagram', svg, q: 'What does ammeter A in the main wire read?', o: [n(It) + ' A', ...uniq(n(It), [V / Rs.reduce((a, b) => a + b, 0), Is[0], It / k, V * k].map(v => n(v))).map(v => v + ' A')], x: `Each branch has the full ${V} V across it: ${Rs.map((R, i) => `${V} ÷ ${R} = ${n(Is[i])} A`).join(', ')}. The current splits at the junctions, so the main wire carries the total: ${n(It)} A.` };
      if (q === 1) { const j = r.int(0, k - 1); return { title: `Circuit: parallel (${k} branches)`, spec: 'P2.17', kind: 'diagram', svg, q: `Ammeter A reads ${n(It)} A${k === 3 ? ` and ${Is.map((I, i) => i === j ? null : `A${i + 1} reads ${n(I)} A`).filter(Boolean).join(' and ')}` : ` and A${2 - j} reads ${n(Is[1 - j])} A`}. What does A${j + 1} read?`, o: [n(Is[j]) + ' A', ...uniq(n(Is[j]), [It, It + Is[(j + 1) % k], It / k, Is[(j + 1) % k], It * 2, It - Is[j] / 2].map(v => n(v))).map(v => v + ' A')], x: `Current is conserved at a junction: the branch currents add up to the main current. ${n(It)} − ${Is.filter((_, i) => i !== j).map(n).join(' − ')} = ${n(Is[j])} A.` }; }
      return { title: `Circuit: parallel (${k} branches)`, spec: 'P2.7', kind: 'diagram', svg, q: `What is the voltage across the ${Rs[0]} Ω ${comps[0] === 'lamp' ? 'lamp' : 'resistor'}?`, o: [V + ' V', ...uniq(V, [V / k, n(V * Rs[0] / Rs.reduce((a, b) => a + b, 0)), 0, V * k].map(Number)).map(v => n(v) + ' V')], x: `In parallel, every branch gets the full supply voltage: ${V} V.` };
    }
    if (kind === 'mixed') {   /* a resistor in series with two lamps in parallel; voltmeters across each part */
      const V1 = r.pick([2, 3, 4, 5].filter(x => x < V)), V2 = V - V1;
      let g = wire([[50, 90], [130, 90]]) + wire([[230, 90], [350, 90], [350, 235], [50, 235], [50, 90]]);
      g += wire([[130, 90], [130, 50], [230, 50], [230, 90]]) + wire([[130, 90], [130, 130], [230, 130], [230, 90]]) + dotJ(130, 90) + dotJ(230, 90);
      g += SYM.res(90, 90) + lab(90, 115, 'R') + SYM.lamp(180, 50) + lab(180, 32, 'L1') + SYM.lamp(180, 130) + lab(180, 155, 'L2');
      g += wire([[70, 90], [70, 190], [110, 190], [110, 90]]) + dotJ(70, 90) + dotJ(110, 90) + SYM.V(90, 190, 'V1');
      g += wire([[130, 130], [130, 190], [230, 190], [230, 130]]) + dotJ(130, 130) + dotJ(230, 130) + SYM.V(180, 190, 'V2') + SYM.A(350, 160) + SYM.batt(200, 235) + lab(200, 267, `${V} V`);
      const svg = wrap(400, 277, g);
      return r.int(0, 1) ? { title: 'Circuit: series and parallel', spec: 'P2.19', kind: 'diagram', svg, q: `V1 reads ${V1} V. What does V2 read?`, o: [V2 + ' V', ...uniq(V2, [V, V1, V / 2, V2 / 2].map(Number)).map(v => n(v) + ' V')], x: `The supply voltage is shared between the parts in series: ${V} − ${V1} = ${V2} V. Both lamps are in parallel, so each has ${V2} V across it.` }
        : { title: 'Circuit: series and parallel', spec: 'P2.7', kind: 'diagram', svg, q: 'Lamp L1 breaks. What happens to L2?', o: ['It stays on: it still has a complete loop', 'It goes off too', 'It goes off, but R still has a current', 'Nothing can flow through R any more'], x: 'L1 and L2 are in parallel, so L2 still has a complete loop through R. (It actually gets a little brighter: less total current means less voltage across R, so more across L2.)' };
    }
    /* identify components */
    const kinds = sh(['lamp', 'diode', 'ldr', 'therm', 'fuse', 'vres', 'sw', 'res'], r).slice(0, r.hard ? 4 : 3), xs = kinds.map((_, i) => 60 + (i + 1) * 280 / (kinds.length + 1));
    let g = wire([[60, 70], [340, 70], [340, 190], [60, 190], [60, 70]]); kinds.forEach((c, i) => { g += SYM[c](xs[i], 70) + lab(xs[i], c === 'ldr' ? 112 : 102, String.fromCharCode(80 + i)); });
    g += SYM.A(340, 130) + SYM.cell(200, 190);
    const svg = wrap(400, 220, g), j = r.int(0, kinds.length - 1), L2 = String.fromCharCode(80 + j);
    if (kinds.includes('ldr') && r.f() < .4) { const L3 = String.fromCharCode(80 + kinds.indexOf('ldr')); return { title: 'Circuit symbols', spec: 'P2.11', kind: 'diagram', svg, q: 'Which component\'s resistance goes down when more light shines on it?', o: [L3, ...kinds.map((_, i) => String.fromCharCode(80 + i)).filter(x => x !== L3)], x: `${L3} is a light-dependent resistor: its resistance falls as light intensity rises.` }; }
    return { title: 'Circuit symbols', spec: 'P2.9', kind: 'diagram', svg, q: `What is component ${L2}?`, o: [SYMNAME[kinds[j]], ...others(SYMNAME[kinds[j]], Object.values(SYMNAME), r)], x: `${L2} is the symbol for a ${SYMNAME[kinds[j]]}.` };
  };

  /* ---------- harder velocity–time: several stages, deceleration to a lower speed ---------- */
  const vtEasy = M.vt;
  M.vt = r => {
    if (!r.hard) return vtEasy(r);
    const vs = [0, r.pick([6, 8, 10]), 0, r.pick([2, 4]), 0], dts = [r.pick([2, 4]), r.pick([4, 6]), r.pick([2, 4]), r.pick([4, 6]), r.pick([2, 4])];
    vs[2] = vs[1]; vs[4] = 0; const pts = [[0, 0]]; let t = 0;
    [vs[1], vs[2], vs[3], vs[3], 0].forEach((v, i) => { t += dts[i]; pts.push([t, v]); });
    const area = (a, b) => { let s = 0; for (let i = 0; i < pts.length - 1; i++) { const [t0, v0] = pts[i], [t1, v1] = pts[i + 1]; s += (t1 - t0) * (v0 + v1) / 2; } return s; };
    const total = area(), svg = chart({ xmax: t + 2, ymax: vs[1] + 2, xstep: 2, ystep: 2, xl: 'Time (s)', yl: 'Velocity (m/s)', series: [{ pts }], marks: pts.slice(1, -1).map(([x, y], i) => [x, y, String.fromCharCode(65 + i)]) });
    const [tB, vB] = pts[2], [tC, vC] = pts[3], dec = (vB - vC) / (tC - tB);
    return r.int(0, 1) ? { title: 'Velocity–time graph (harder)', spec: 'P1.8', kind: 'graph', svg, q: 'What is the deceleration between B and C?', o: [n(dec) + ' m/s²', ...uniq(n(dec), [vB / (tC - tB), (vB - vC) * (tC - tB), vC / tC, vB / tC].map(n)).map(v => v + ' m/s²')], x: `Gradient = change in velocity ÷ time = (${vB} − ${vC}) ÷ (${tC} − ${tB}) = ${n(dec)} m/s² (slowing down).` }
      : { title: 'Velocity–time graph (harder)', spec: 'P1.9', kind: 'graph', svg, q: 'What is the total distance travelled?', o: [n(total) + ' m', ...uniq(n(total), [vs[1] * t, total * 2, total - vs[3] * dts[3], vs[1] * dts[1]].map(n)).map(v => v + ' m')], x: `Distance = area under the line. Split it into pieces: ${pts.slice(0, -1).map(([t0, v0], i) => { const [t1, v1] = pts[i + 1]; return n((t1 - t0) * (v0 + v1) / 2); }).join(' + ')} = ${n(total)} m.` };
  };

  /* ================= new types (18 Nov round 2) ================= */
  const arrowHead = (x, y, ang, c = INK, s = 8) => { const a = ang * Math.PI / 180, p = (d, o) => [x - Math.cos(a) * d - Math.sin(a) * o, y - Math.sin(a) * d + Math.cos(a) * o]; const [x1, y1] = p(s, s * .55), [x2, y2] = p(s, -s * .55); return `<path d="M${x} ${y}L${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}z" fill="${c}"/>`; };
  const arrow = (x1, y1, x2, y2, c = INK, w = 2) => { const s = 6 + w * 2, d = Math.hypot(x2 - x1, y2 - y1), ex = x2 - (x2 - x1) / d * (s - 1), ey = y2 - (y2 - y1) / d * (s - 1); return `<line x1="${x1}" y1="${y1}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="${c}" stroke-width="${w}" stroke-linecap="butt"/>` + arrowHead(x2, y2, Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI, c, s); };

  /* reaction profile (energy level diagram) */
  M.profile = r => {
    const exo = r.int(0, 1), R0 = r.pick([60, 80, 100]), dH = r.pick([20, 40, 60]), Ea = r.pick([60, 80, 100, 120].filter(e => e > dH)), P = exo ? R0 - dH : R0 + dH, peak = Math.max(R0, P) + Ea - (exo ? 0 : dH) + (exo ? 0 : 0);
    const top = R0 + Ea, ymax = Math.ceil((Math.max(top, P) + 30) / 40) * 40;
    const f = t => t < 20 ? R0 : t > 80 ? P : t <= 50 ? R0 + (top - R0) * (1 - Math.cos((t - 20) / 30 * Math.PI)) / 2 : P + (top - P) * (1 + Math.cos((t - 50) / 30 * Math.PI)) / 2;
    const labs = sh(['A', 'B', 'C'], r);
    const extra = (px, py) => `<line x1="${px(8)}" y1="${py(R0)}" x2="${px(95)}" y2="${py(R0)}" stroke="#888" stroke-dasharray="4 3"/>` + `<line x1="${px(50)}" y1="${py(P)}" x2="${px(95)}" y2="${py(P)}" stroke="#888" stroke-dasharray="4 3"/>`
      + arrow(px(35), py(R0), px(35), py(top) + 3, '#2563eb') + T(px(35) - 10, py((R0 + top) / 2), labs[0], { size: 14, w: 700, fill: '#2563eb' })
      + arrow(px(88), py(R0), px(88), py(P) + (exo ? -3 : 3), '#dc2626') + T(px(88) + 12, py((R0 + P) / 2), labs[1], { size: 14, w: 700, fill: '#dc2626' })
      + arrow(px(65), py(P), px(65), py(top) + 3, '#16a34a') + T(px(65) + 12, py((P + top) / 2), labs[2], { size: 14, w: 700, fill: '#16a34a' })
      + T(px(10), py(R0) - 8, 'reactants', { size: 11 }) + T(px(90), py(P) + (exo ? 16 : -8), 'products', { size: 11 });
    const svg = chart({ xmax: 100, ymax, xstep: 20, ystep: 40, xl: 'Progress of reaction', yl: 'Energy (kJ/mol)', series: [{ pts: curve(f, 0, 100, 100) }], extra, noXticks: true });
    const q = r.int(0, 2), title = 'Reaction profile', spec = 'C3.5';
    if (q === 0) return { title, spec, kind: 'graph', svg, q: 'Is this reaction exothermic or endothermic?', o: [exo ? 'Exothermic: the products have less energy than the reactants' : 'Endothermic: the products have more energy than the reactants', exo ? 'Endothermic: the products have less energy than the reactants' : 'Exothermic: the products have more energy than the reactants', 'Exothermic: the curve goes up first', 'Endothermic: it needs activation energy'], x: exo ? 'Products are lower than reactants: energy is given out to the surroundings, so ΔH is negative.' : 'Products are higher than reactants: energy is taken in from the surroundings, so ΔH is positive.' };
    if (q === 1) return { title, spec, kind: 'graph', svg, q: 'Which arrow shows the activation energy?', o: [labs[0], labs[1], labs[2]], x: `Activation energy is from the reactants up to the top of the hump: arrow ${labs[0]}. Arrow ${labs[1]} is the overall energy change.` };
    const ans = (exo ? '−' : '+') + dH + ' kJ/mol';
    return { title, spec: 'C3.6', kind: 'graph', svg, q: 'Use the graph. What is the overall energy change (ΔH)?', o: [ans, (exo ? '+' : '−') + dH + ' kJ/mol', (exo ? '−' : '+') + Ea + ' kJ/mol', '+' + top + ' kJ/mol'], x: `Reactants ${R0} kJ/mol, products ${P} kJ/mol: ΔH = ${P} − ${R0} = ${ans}${exo ? ' (exothermic)' : ' (endothermic)'}.` };
  };

  /* atom: electron shells */
  const ELS = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca'];
  const ELN = ['hydrogen', 'helium', 'lithium', 'beryllium', 'boron', 'carbon', 'nitrogen', 'oxygen', 'fluorine', 'neon', 'sodium', 'magnesium', 'aluminium', 'silicon', 'phosphorus', 'sulfur', 'chlorine', 'argon', 'potassium', 'calcium'];
  const config = z => { const s = []; let left = z; [2, 8, 8, 2].forEach(c => { if (left > 0) { s.push(Math.min(c, left)); left -= c; } }); return s; };
  M.atom = r => {
    const z = r.int(r.hard ? 11 : 1, r.hard ? 20 : 18), sh0 = config(z), cx = 140, cy = 120, mark = r.int(0, 1); RING = r.pick(['pairs', 'single', 'spread']);
    let g = `<circle cx="${cx}" cy="${cy}" r="14" fill="#fde68a" stroke="${INK}"/>` + T(cx, cy + 5, '?', { size: 14, w: 700 });
    sh0.forEach((c, k) => { const rad = 28 + k * 22; g += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="#666"/>`; for (let i = 0; i < c; i++) { const [dx, dy] = ringXY(c, i, rad); g += elec(cx + dx, cy + dy, mark); } });
    const svg = wrap(280, 240, g), cfg = sh0.join('.'), grp = z === 2 ? 0 : sh0[sh0.length - 1] === 8 ? 0 : sh0[sh0.length - 1], q = r.int(0, 2);
    if (q === 0) return { title: 'Electron shells', spec: 'C1.22', kind: 'diagram', svg, q: 'Which element has this electronic configuration?', o: [ELN[z - 1], ...others(ELN[z - 1], [ELN[z - 2], ELN[z] || ELN[z - 3], ELN[(z + 7) % 20], ELN[(z + 9) % 20]].filter(Boolean), r)], x: `${z} electrons (${cfg}), so ${z} protons: ${ELN[z - 1]} (${ELS[z - 1]}).` };
    if (q === 1) return { title: 'Electron shells', spec: 'C1.22', kind: 'diagram', svg, q: 'What is the electronic configuration shown?', o: [cfg, ...others(cfg, [...new Set([config(z - 1).join('.'), config(z + 1).join('.'), sh0.slice().reverse().join('.'), [Math.min(z, 2), z - 2].join('.'), config(z + 2).join('.')])].filter(x => x && !/(^|\.)0($|\.)|-/.test(x)), r)], x: `Count the electrons in each shell from the inside: ${cfg}.` };
    return { title: 'Electron shells', spec: 'C1.24', kind: 'diagram', svg, q: 'Which group and period of the Periodic Table is this element in?', o: [...new Set([`Group ${grp}, period ${sh0.length}`, `Group ${sh0.length}, period ${grp}`, `Group ${grp}, period ${sh0.length + 1}`, `Group ${grp + 1}, period ${sh0.length}`, `Group ${sh0.length + 1}, period ${grp}`])], x: `Number of shells = period (${sh0.length}). Electrons in the outer shell = group (${grp || '0 — a full outer shell'}).` };
  };

  /* current–voltage characteristics */
  M.iv = r => {
    const kind = r.pick(['res', 'lamp', 'diode']), w = 320, h = 260, cx = 160, cy = 130, s = 100;
    const f = { res: v => v * .8, lamp: v => Math.sign(v) * Math.pow(Math.abs(v), .45) * .8, diode: v => v < .55 ? 0 : (v - .55) * 4 }[kind];
    let g = `<line x1="20" y1="${cy}" x2="${w - 20}" y2="${cy}" stroke="${INK}" stroke-width="1.6"/><line x1="${cx}" y1="20" x2="${cx}" y2="${h - 20}" stroke="${INK}" stroke-width="1.6"/>` + T(w - 22, cy - 8, 'V', { size: 13, w: 700, a: 'end' }) + T(cx + 8, 30, 'I', { size: 13, w: 700, a: 'start' });
    for (let k = -4; k <= 4; k++) if (k) g += `<line x1="${cx + k * 25}" y1="${cy - 3}" x2="${cx + k * 25}" y2="${cy + 3}" stroke="${INK}"/><line x1="${cx - 3}" y1="${cy - k * 25}" x2="${cx + 3}" y2="${cy - k * 25}" stroke="${INK}"/>`;
    const pts = curve(f, -1.2, 1.2, 240).filter(([, i]) => Math.abs(i) <= 1.05).map(([v, i]) => [cx + v * s, cy - i * s]);
    g += `<polyline points="${pts.map(p => p.map(z => z.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="#dc2626" stroke-width="2.4"/>`;
    const svg = wrap(w, h, g), nm = { res: 'a resistor at constant temperature', lamp: 'a filament lamp', diode: 'a diode' }[kind];
    return { title: 'Current–voltage graph', spec: 'P2.10', kind: 'graph', svg, q: 'Which component gives this current–voltage graph?', o: [nm, ...others(nm, ['a resistor at constant temperature', 'a filament lamp', 'a diode', 'a fuse'], r)], x: { res: 'A straight line through the origin: current is proportional to voltage, so the resistance stays the same.', lamp: 'The line curves over: as the filament heats up its resistance rises, so the current grows more slowly.', diode: 'Current flows in one direction only, and only once the voltage passes about 0.6 V.' }[kind] };
  };

  /* forces on an object: sometimes drawn to scale (with a scale bar), otherwise every arrow the same length and marked not to scale */
  M.forces = r => {
    const [fu, ff] = r.pick([['N', 1], ['N', 1], ['kN', .01]]), F = v => n(v * ff) + ' ' + fu, scaled = r.f() < .5, bal = r.f() < .3, k = .25, scaleN = 200;
    const fw = scaled ? r.pick([300, 400, 500, 600]) : r.pick([100, 200, 300, 400, 600]);
    const bk = bal ? fw : scaled ? r.pick([200, 300, 400, 500].filter(x => x !== fw)) : r.pick([50, 100, 150, 200, 250].filter(x => x !== fw));
    const vert = scaled ? r.pick([200, 300, 400]) : r.pick([200, 500, 800]), len = v => scaled ? v * k : 70;
    const measure = scaled && !bal && r.f() < .6;
    const cx = 230, cy = 50 + len(vert), bw = 50, bh = 35, H = cy + bh + len(vert) + 45;
    const fa = (x1, y1, x2, y2, c) => arrow(x1, y1, x2, y2, c, 3);
    let g = `<rect x="${cx - bw}" y="${cy - bh}" width="${2 * bw}" height="${2 * bh}" fill="#e5e7eb" stroke="${INK}" stroke-width="2"/>`;
    g += fa(cx + bw, cy, cx + bw + len(fw), cy, '#16a34a') + T(cx + bw + len(fw) / 2, cy - 10, F(fw), { size: 13, w: 700 }) + T(cx + bw + len(fw) / 2, cy + bh + 16, 'driving force', { size: 11 });
    g += fa(cx - bw, cy, cx - bw - len(bk), cy, '#dc2626') + T(cx - bw - len(bk) / 2, cy - 10, measure ? '?' : F(bk), { size: 13, w: 700 }) + T(cx - bw - len(bk) / 2, cy + bh + 16, 'friction + drag', { size: 11 });
    g += fa(cx, cy - bh, cx, cy - bh - len(vert), '#2563eb') + T(cx + 8, cy - bh - len(vert) + 12, F(vert), { size: 13, w: 700, a: 'start' }) + T(cx + 8, cy - bh - len(vert) + 26, 'reaction force', { size: 11, a: 'start' });
    g += fa(cx, cy + bh, cx, cy + bh + len(vert), '#2563eb') + T(cx + 8, cy + bh + len(vert) - 4, F(vert) + ' weight', { size: 13, w: 700, a: 'start' });
    g += scaled ? `<g transform="translate(14 ${H - 14})"><path d="M0 -6v6h${scaleN * k}v-6" fill="none" stroke="${INK}" stroke-width="2"/>${T(scaleN * k + 6, 0, `= ${F(scaleN)}`, { size: 12, w: 700, a: 'start' })}${T(0, -14, 'Drawn to scale', { size: 12, w: 700, a: 'start' })}</g>`
      : T(14, H - 14, 'Not to scale', { size: 12, w: 700, a: 'start', fill: '#555' });
    const svg = wrap(460, H, g), res = fw - bk, title = 'Forces diagram';
    if (measure) return { title, spec: 'P1.15', kind: 'diagram', svg, q: 'The diagram is drawn to scale. Use the scale bar: what is the friction + drag force?', o: [F(bk), ...others(F(bk), [100, 200, 300, 400, 500, 600, 800].map(F), r)], x: `The red arrow is ${bk / scaleN} times as long as the ${F(scaleN)} scale bar: ${bk / scaleN} × ${scaleN} = ${F(bk)}. (So the resultant is ${fw} − ${bk} = ${F(res)} forwards.)` };
    const ans = bal ? F(0) : `${F(Math.abs(res))} to the ${res > 0 ? 'right' : 'left'}`;
    return r.int(0, 1) || bal ? { title, spec: 'P1.15', kind: 'diagram', svg, q: 'What is the resultant force on the object?', o: [ans, ...others(ans, bal ? [`${F(fw + bk)} to the right`, `${F(fw)} to the right`, `${F(2 * vert)} downwards`] : [`${F(fw + bk)} to the right`, `${F(Math.abs(res))} to the ${res > 0 ? 'left' : 'right'}`, F(0), `${F(fw + bk + 2 * vert)}`], r)], x: bal ? 'Up = down and forwards = backwards: the forces are balanced, so the resultant is 0 N (it stays still or keeps moving at a steady speed).' : `Up and down cancel. Horizontally: ${fw} − ${bk} = ${F(Math.abs(res))} to the ${res > 0 ? 'right' : 'left'}.` }
      : { title, spec: 'P1.16', kind: 'diagram', svg, q: 'The object is moving to the right. What happens to its speed?', o: [res > 0 ? 'It speeds up' : 'It slows down', res > 0 ? 'It slows down' : 'It speeds up', 'It stays the same', 'It stops straight away'], x: `The resultant force is ${F(Math.abs(res))} ${res > 0 ? 'forwards, so it accelerates' : 'backwards, so it decelerates'}.` };
  };

  /* pyramid of biomass with numbers (biology maths): sometimes to scale (bar width ∝ biomass), otherwise marked not to scale */
  M.pyramid = r => {
    const L = r.pick([['grass', 'grasshoppers', 'frogs', 'snakes'], ['phytoplankton', 'zooplankton', 'small fish', 'seals'], ['oak tree leaves', 'caterpillars', 'blue tits', 'sparrowhawks']]);
    const [what, pu, pf] = r.pick([['biomass', 'g/m²', 1], ['biomass', 'g/m²', 1], ['biomass', 'kg/m²', .001], ['energy', 'kJ/m²/year', 10]]), scaled = r.f() < .4, levels = scaled ? 3 : 4;
    const b0 = r.pick([1000, 2000, 5000]), b = [b0, b0 * (scaled ? r.pick([20, 25, 40]) : r.pick([10, 10, 20])) / 100]; b.push(b[1] * (scaled ? r.pick([20, 25, 40]) : r.pick([10, 20])) / 100); if (!scaled) b.push(b[2] * 10 / 100);
    let g = ''; const maxW = 320, hgt = 38, cx = 200, wOf = (v, i) => scaled ? Math.max(2, maxW * v / b0) : Math.max(L[i].length * 7.5 + 16, (n(v * pf) + ' ' + pu).length * 6.2 + 14, maxW * Math.pow(v / b0, .35));
    b.forEach((v, i) => { const w = wOf(v, i), y = 210 - i * hgt, fits = w >= Math.max(L[i].length * 7.5, (n(v * pf) + ' ' + pu).length * 6.2) + 10;
      g += `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="${hgt}" fill="${['#86efac', '#fde68a', '#fdba74', '#fca5a5'][i]}" stroke="${INK}"/>`
        + (fits ? T(cx, y + 16, L[i], { size: 12, w: 700 }) + T(cx, y + 31, n(v * pf) + ' ' + pu, { size: 11 }) : `<line x1="${cx + w / 2 + 2}" y1="${y + hgt / 2}" x2="${cx + 40}" y2="${y + hgt / 2}" stroke="#888"/>` + T(cx + 44, y + 16, L[i], { size: 12, w: 700, a: 'start' }) + T(cx + 44, y + 31, n(v * pf) + ' ' + pu, { size: 11, a: 'start' })); });
    g += T(390, 22, scaled ? `Drawn to scale (bar width ∝ ${what})` : 'Not to scale', { size: 11, w: 700, a: 'end', fill: '#555' });
    const svg = wrap(400, 260, g), lvl = r.int(0, levels - 2), eff = b[lvl + 1] / b[lvl] * 100, q = r.int(0, 1);
    if (q === 0) return { title: `Pyramid of ${what}`, spec: 'B4.7', kind: 'diagram', svg, q: `What percentage of the ${what} of the ${L[lvl]} is passed on to the ${L[lvl + 1]}?`, o: [n(eff) + '%', ...uniq(n(eff), [100 - eff, b[lvl] / b[lvl + 1], b[lvl + 1], eff * 10].map(n)).map(v => v + '%')], x: `${n(b[lvl + 1] * pf)} ÷ ${n(b[lvl] * pf)} × 100 = ${n(eff)}%.` };
    return { title: `Pyramid of ${what}`, spec: 'B4.8', kind: 'diagram', svg, q: `Why is there less ${what} at each higher level?`, o: ['Energy is lost at each level, e.g. in respiration, movement and waste', 'Animals higher up are smaller', 'Plants make biomass out of nothing', 'Predators only eat some of the time'], x: 'Only a small fraction is passed on: much is used for respiration (released as heat), lost in faeces and urine, or never eaten.' };
  };

  /* photosynthesis: limiting factors */
  M.photo = r => {
    const hi = r.pick([60, 70, 80]), lo = hi * r.pick([.5, .6]), k = 20;
    const f1 = x => hi * (1 - Math.exp(-x / k)), f2 = x => lo * (1 - Math.exp(-x / (k * .6)));
    const xa = r.pick([10, 15]), xb = r.pick([80, 90]);
    const svg = chart({ xmax: 100, ymax: 100, xstep: 20, ystep: 20, xl: 'Light intensity (a.u.)', yl: 'Rate of photosynthesis (a.u.)', series: [{ pts: curve(f1, 0, 100), label: 'high CO₂', lab: 40 }, { pts: curve(f2, 0, 100), label: 'low CO₂', lab: 50, dash: 1 }], marks: [[xa, f2(xa), 'X'], [xb, f2(xb), 'Y']] });
    return r.int(0, 1) ? { title: 'Photosynthesis: limiting factors', spec: 'B2.20', kind: 'graph', svg, q: 'What is limiting the rate of photosynthesis at point Y?', o: ['Carbon dioxide concentration', 'Light intensity', 'Chlorophyll', 'Oxygen concentration'], x: 'At Y more light makes no difference (the line is flat), but the high-CO₂ line is higher: carbon dioxide is the limiting factor.' }
      : { title: 'Photosynthesis: limiting factors', spec: 'B2.20', kind: 'graph', svg, q: 'What is limiting the rate of photosynthesis at point X?', o: ['Light intensity', 'Carbon dioxide concentration', 'Temperature only', 'Nothing: it is at its maximum'], x: 'At X the line is still rising: more light would increase the rate, so light intensity is the limiting factor.' };
  };

  /* bar chart */
  M.bars = r => {
    const D = r.pick([{ t: 'Blood group', y: 'Number of students', cats: ['O', 'A', 'B', 'AB'], base: [18, 15, 6, 3] }, { t: 'Seeds germinated', y: 'Seeds germinated (out of 30)', cats: ['5 °C', '15 °C', '25 °C', '35 °C'], base: [4, 16, 26, 12], t2: 'Temperature' }, { t: 'Fuel', y: 'Temperature rise (°C)', cats: ['ethanol', 'propanol', 'butanol', 'pentanol'], base: [12, 16, 22, 26] }]);
    const v = D.base.map(x => x + r.int(-2, 2)), ymax = Math.ceil(Math.max(...v) / 5) * 5 + 5, w = 380, h = 250, L = 52, B = 42, px = i => L + 25 + i * 72, py = y => h - B - y / ymax * (h - 14 - B);
    let g = ''; for (let y = 0; y <= ymax; y += 5) g += `<line x1="${L}" y1="${py(y)}" x2="${w - 10}" y2="${py(y)}" stroke="${GRID}"/>` + T(L - 6, py(y) + 4, y, { size: 11, a: 'end' });
    v.forEach((y, i) => { g += `<rect x="${px(i)}" y="${py(y)}" width="44" height="${py(0) - py(y)}" fill="#93c5fd" stroke="${INK}"/>` + T(px(i) + 22, py(0) + 15, D.cats[i], { size: 11 }); });
    g += `<line x1="${L}" y1="${py(0)}" x2="${w - 10}" y2="${py(0)}" stroke="${INK}" stroke-width="1.6"/><line x1="${L}" y1="${py(0)}" x2="${L}" y2="14" stroke="${INK}" stroke-width="1.6"/>` + T(14, (py(0) + 14) / 2, D.y, { size: 12, w: 600, rot: -90 }) + T((L + w) / 2, h - 6, D.t2 || D.t, { size: 12, w: 600 });
    const svg = wrap(w, h, g), i = r.int(0, 3), j = (i + 2) % 4, diff = Math.abs(v[i] - v[j]), tot = v.reduce((a, b) => a + b, 0);
    return (D.t !== 'Blood group' || r.int(0, 1)) ? { title: 'Bar chart', spec: '—', kind: 'graph', svg, q: `How many more is ${v[i] > v[j] ? D.cats[i] : D.cats[j]} than ${v[i] > v[j] ? D.cats[j] : D.cats[i]}?`, o: [String(diff), ...uniq(diff, [v[i] + v[j], Math.max(v[i], v[j]), diff + 2, diff * 2]).map(String)], x: `Read both bars: ${Math.max(v[i], v[j])} − ${Math.min(v[i], v[j])} = ${diff}.` }
      : { title: 'Bar chart', spec: '—', kind: 'graph', svg, q: `What percentage of the total is ${D.cats[i]}?`, o: [n(v[i] / tot * 100) + '%', ...uniq(n(v[i] / tot * 100), [v[i], 25, tot / v[i], v[i] / 100 * tot].map(n)).map(x => x + '%')], x: `Total = ${v.join(' + ')} = ${tot}. ${v[i]} ÷ ${tot} × 100 = ${n(v[i] / tot * 100)}%.` };
  };

  /* plant or animal cell, labelled */
  M.cell = r => {
    const plant = r.int(0, 1), cx = 170, cy = 120; let g = '', parts = {};
    if (plant) {
      g += `<rect x="40" y="30" width="260" height="180" rx="10" fill="#bbf7d0" stroke="#166534" stroke-width="7"/><rect x="48" y="38" width="244" height="164" rx="6" fill="#ecfccb" stroke="#4d7c0f" stroke-width="1.5"/>`
        + `<rect x="120" y="60" width="150" height="110" rx="40" fill="#e0f2fe" stroke="#0369a1"/>` + `<circle cx="85" cy="90" r="20" fill="#c4b5fd" stroke="#5b21b6"/><circle cx="85" cy="90" r="6" fill="#7c3aed"/>`;
      [[70, 160], [100, 185], [255, 185], [70, 130]].forEach(([x, y]) => { g += `<ellipse cx="${x}" cy="${y}" rx="13" ry="7" fill="#16a34a" stroke="#14532d"/>`; });
      parts = { 'cell wall': [40, 50], 'cell membrane': [48, 200], nucleus: [85, 90], vacuole: [195, 115], chloroplast: [255, 185], cytoplasm: [110, 185] };
    } else {
      g += `<path d="M60 120C50 60 120 30 180 40C260 50 300 90 290 140C280 200 200 215 140 205C80 195 65 170 60 120Z" fill="#fde68a" stroke="#92400e" stroke-width="2"/>` + `<circle cx="160" cy="115" r="26" fill="#c4b5fd" stroke="#5b21b6"/><circle cx="160" cy="115" r="7" fill="#7c3aed"/>`;
      [[230, 90], [110, 160], [240, 160]].forEach(([x, y]) => { g += `<ellipse cx="${x}" cy="${y}" rx="11" ry="5" fill="#fb923c" stroke="#9a3412"/>`; });
      parts = { 'cell membrane': [290, 140], nucleus: [160, 115], cytoplasm: [200, 185], mitochondrion: [230, 90] };
    }
    const keys = sh(Object.keys(parts), r).slice(0, 4).sort((a, b) => parts[a][1] - parts[b][1]), letters = ['A', 'B', 'C', 'D'];
    keys.forEach((k, i) => { const [x, y] = parts[k], lx = 350, ly = 40 + i * 50; g += `<line x1="${x}" y1="${y}" x2="${lx - 10}" y2="${ly}" stroke="${INK}"/>` + `<circle cx="${x}" cy="${y}" r="2.5" fill="${INK}"/>` + T(lx, ly + 5, letters[i], { size: 15, w: 700 }); });
    const svg = wrap(380, 240, g), t = r.int(0, keys.length - 1);
    if (r.f() < .35) return { title: plant ? 'Plant cell' : 'Animal cell', spec: 'B2.2', kind: 'diagram', svg, q: 'Is this a plant cell or an animal cell?', o: plant ? ['Plant: it has a cell wall, a large vacuole and chloroplasts', 'Animal: it has a nucleus', 'Plant: it has a cell membrane', 'Animal: it has no cell wall'] : ['Animal: no cell wall, no large vacuole, no chloroplasts', 'Plant: it has a nucleus', 'Plant: it has mitochondria', 'Animal: it has a cell wall'], x: plant ? 'Only plant cells have a cellulose cell wall, a permanent vacuole and chloroplasts.' : 'It has a nucleus, cytoplasm, a membrane and mitochondria but no cell wall, vacuole or chloroplasts: an animal cell.' };
    return { title: plant ? 'Plant cell' : 'Animal cell', spec: 'B2.2', kind: 'diagram', svg, q: `What is part ${letters[t]}?`, o: [keys[t], ...others(keys[t], ['nucleus', 'cell membrane', 'cell wall', 'cytoplasm', 'vacuole', 'chloroplast', 'mitochondrion', 'ribosome'], r)], x: `${letters[t]} points to the ${keys[t]}.` };
  };

  /* Sankey diagram (GCSE style): one block on the left that divides; one outline round the whole thing, so there are no
     lines between transfers; each transfer ends in its own arrowhead. Widths to scale. Sometimes on squared paper. */
  const SANKEY_DEV = [
    ['electric motor', 'electrical', 'kinetic', ['thermal', 'sound'], [8, 14]], ['filament lamp', 'electrical', 'light', ['thermal'], [2, 2]],
    ['LED lamp', 'electrical', 'light', ['thermal'], [14, 16]], ['kettle', 'electrical', 'thermal (water)', ['thermal (surroundings)', 'sound'], [16, 18]],
    ['car engine', 'chemical', 'kinetic', ['thermal', 'sound'], [4, 6]], ['television', 'electrical', 'light and sound', ['thermal'], [6, 10]],
    ['coal power station', 'chemical', 'electrical', ['thermal (surroundings)'], [7, 8]], ['solar cell', 'light', 'electrical', ['thermal'], [3, 4]],
    ['cyclist', 'chemical', 'kinetic', ['thermal', 'sound'], [4, 5]]];
  M.sankey = r => {
    const [name, inT, useT, wasteT, [k0, k1]] = r.pick(SANKEY_DEV), N = 20, sq = 8, grid = r.f() < (r.hard ? .6 : .3);
    const unit = r.pick(['J', 'J', 'kJ', 'MJ']), v = r.pick(unit === 'MJ' ? [1, 2, 5] : unit === 'kJ' ? [1, 2, 5, 10] : [5, 10, 20, 50]);
    const ku = r.int(k0, k1), kw = wasteT.length === 2 ? (a => [a, N - ku - a])(Math.max(1, Math.min(N - ku - 1, Math.round((N - ku) * (.7 + r.f() * .15))))) : [N - ku];
    const E = N * v, use = ku * v, ws = kw.map(k => k * v), waste = E - use, x0 = 20, y0 = 36, H = N * sq, ybot = y0 + H + 40;
    const turn = []; let xr = x0 + 15 * sq; for (let k = kw.length - 1; k >= 0; k--) { turn[k] = xr; xr += kw[k] * sq + 6 * sq; }   // lowest band turns first, each band clear of the one below
    const xu = Math.max(xr - sq, x0 + 32 * sq), WD = xu + 130;
    const hu = ku * sq, tipU = Math.min(18, hu / 2 + 4);
    let path = `M${x0} ${y0}H${xu}L${xu + tipU} ${y0 + hu / 2}L${xu} ${y0 + hu}`, a = y0 + hu; const tips = [];
    kw.forEach((k, i) => { const t = k * sq, xt = turn[i], tip = Math.min(16, t / 2 + 4); path += `H${xt + t}V${ybot}L${xt + t / 2} ${ybot + tip}L${xt} ${ybot}V${a + t}`; tips.push([xt + t / 2, ybot + tip]); a += t; });
    path += `H${x0}Z`;
    const hide = grid ? r.int(0, kw.length) : -1;   // on squared paper one value is left for the student to count
    const val = (x, i) => i === hide ? '?' : `${n(x)} ${unit}`;
    let g = '';
    if (grid) { for (let x = x0 - 2 * sq; x <= WD - 60; x += sq) g += `<line x1="${x}" y1="${y0 - 2 * sq}" x2="${x}" y2="${ybot + 3 * sq}" stroke="#d6e4f0" stroke-width="${(x - x0) % (5 * sq) ? .6 : 1.2}"/>`;
      for (let y = y0 - 2 * sq; y <= ybot + 3 * sq; y += sq) g += `<line x1="${x0 - 2 * sq}" y1="${y}" x2="${WD - 60}" y2="${y}" stroke="#d6e4f0" stroke-width="${(y - y0) % (5 * sq) ? .6 : 1.2}"/>`; }
    g += `<path d="${path}" fill="${grid ? 'rgba(255,255,255,.15)' : '#fff'}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`;
    g += T(x0 + 50, y0 + H / 2 - 2, `${E} ${unit}`, { size: 14, w: 700 }) + T(x0 + 50, y0 + H / 2 + 15, inT, { size: 12 });
    g += T(xu + tipU + 8, y0 + hu / 2, val(use, 0), { size: 13, w: 700, a: 'start' }) + T(xu + tipU + 8, y0 + hu / 2 + 15, useT, { size: 11, a: 'start' }) + T(xu + tipU + 8, y0 + hu / 2 + 29, '(useful)', { size: 11, a: 'start', fill: '#555' });
    kw.forEach((k, i) => { const [x, y] = tips[i]; g += T(x, y + 16, val(ws[i], i + 1), { size: 13, w: 700 }) + T(x, y + 31, wasteT[i], { size: 11 }) + T(x, y + 44, '(wasted)', { size: 11, fill: '#555' }); });
    g += grid ? T(WD - 10, 18, `1 small square = ${v} ${unit}`, { size: 12, w: 700, a: 'end' }) : T(WD - 10, 18, 'Drawn to scale', { size: 11, a: 'end', fill: '#555' });
    const svg = wrap(WD, ybot + 76, g), eff = use / E * 100, title = 'Sankey diagram';
    if (grid && hide >= 0) { const ans = hide === 0 ? use : ws[hide - 1], what = hide === 0 ? `usefully transferred as ${useT}` : `wasted as ${wasteT[hide - 1]}`, k = hide === 0 ? ku : kw[hide - 1];
      return { title, spec: 'P4.3', kind: 'diagram', svg, q: `How much energy is ${what}?`, o: [n(ans) + ' ' + unit, ...uniq(ans, [k, ans * 2, E - ans, ans + v, ans - v]).map(x => n(x) + ' ' + unit)], x: `Count the squares across that arrow: ${k} squares × ${v} ${unit} = ${n(ans)} ${unit}.` }; }
    const q = r.int(0, kw.length === 2 ? 2 : 1);
    if (q === 0) return { title, spec: 'P4.4', kind: 'diagram', svg, q: `What is the efficiency of the ${name}?`, o: [n(eff) + '%', ...uniq(n(eff), [waste / E * 100, E / use, use / waste * 100, eff / 2].map(n)).map(x => x + '%')], x: `Efficiency = useful energy out ÷ total energy in × 100 = ${use} ÷ ${E} × 100 = ${n(eff)}%.` };
    if (q === 1) return { title, spec: 'P4.3', kind: 'diagram', svg, q: 'How much energy is wasted altogether?', o: [n(waste) + ' ' + unit, ...uniq(waste, [use, E, ws[0] === waste ? E + use : ws[0], E - waste / 2]).map(x => n(x) + ' ' + unit)], x: `Energy is conserved: wasted = in − useful = ${E} − ${use} = ${n(waste)} ${unit}.` };
    return { title, spec: 'P4.3', kind: 'diagram', svg, q: `Why is the ${wasteT[1]} arrow so much thinner than the others?`, o: [`Less energy is transferred as ${wasteT[1]}`, `${wasteT[1][0].toUpperCase() + wasteT[1].slice(1)} is a less useful kind of energy`, `${wasteT[1][0].toUpperCase() + wasteT[1].slice(1)} energy is destroyed`, 'It is transferred more slowly'], x: `The width of each arrow is to scale with the energy it carries: only ${n(ws[1])} ${unit} of the ${E} ${unit}.` };
  };

  /* transverse and longitudinal waves: number of waves, wavelength, amplitude, units and axis all vary */
  function waveAxes({ xmax, xstep, Y, ystep, xl, yl, f, w = 420, h = 240 }) {
    const L = 52, R = 18, top = 16, bot = h - 40, px = x => L + x / xmax * (w - L - R), py = y => top + (Y - y) / (2 * Y) * (bot - top);
    let g = '';
    for (let y = -Y; y <= Y + 1e-9; y += ystep) g += `<line x1="${L}" y1="${py(y)}" x2="${w - R}" y2="${py(y)}" stroke="${GRID}"/>` + T(L - 6, py(y) + 4, n(y), { size: 11, a: 'end' });
    for (let x = 0; x <= xmax + 1e-9; x += xstep) g += `<line x1="${px(x)}" y1="${top}" x2="${px(x)}" y2="${bot}" stroke="${GRID}"/>` + T(px(x), bot + 16, n(x), { size: 11 });
    g += `<line x1="${L}" y1="${py(0)}" x2="${w - R}" y2="${py(0)}" stroke="#666" stroke-dasharray="5 3"/><line x1="${L}" y1="${top}" x2="${L}" y2="${bot}" stroke="${INK}" stroke-width="1.6"/>`;
    g += `<polyline points="${curve(f, 0, xmax, 240).map(([x, y]) => px(x).toFixed(1) + ',' + py(y).toFixed(1)).join(' ')}" fill="none" stroke="#dc2626" stroke-width="2.4"/>`;
    g += T((L + w - R) / 2, h - 6, xl, { size: 12, w: 600 }) + T(14, (top + bot) / 2, yl, { size: 12, w: 600, rot: -90 });
    return wrap(w, h, g);
  }
  M.wave = r => {
    const kind = r.pick(['dist', 'dist', 'time', 'long']), cyc = r.pick([1.5, 2, 2.5, 3, 4, 5]), title = 'Wave';
    if (kind === 'long') {   /* a longitudinal wave on a slinky, with a ruler */
      const U = r.pick([['cm', [2, 4, 5, 8, 10]], ['m', [0.5, 1, 2]], ['mm', [5, 10, 20]]]), lam = r.pick(U[1]), waves = r.pick([3, 4, 5]), len = lam * waves, w = 440, L = 30, R = 20, px = x => L + x / len * (w - L - R);
      let g = '', x = 0; const ph = r.f();
      while (x <= len) { g += `<line x1="${px(x).toFixed(1)}" y1="30" x2="${px(x).toFixed(1)}" y2="90" stroke="${INK}" stroke-width="1.6"/>`; x += lam / 13 * (1 + .6 * Math.sin(2 * Math.PI * (x / lam + ph))); }
      for (let i = 0; i <= waves * 2; i++) { const t = i * lam / 2; g += `<line x1="${px(t)}" y1="112" x2="${px(t)}" y2="${i % 2 ? 118 : 122}" stroke="${INK}"/>` + (i % 2 ? '' : T(px(t), 136, n(t), { size: 11 })); }
      g += `<line x1="${px(0)}" y1="112" x2="${px(len)}" y2="112" stroke="${INK}"/>` + T(w / 2, 154, `Distance (${U[0]})`, { size: 12, w: 600 });
      const cx = (((.75 - ph) % 1 + 1) % 1) * lam, rx = cx + lam / 2;   // coils are closest where the sine is −1   // first compression and the rarefaction after it
      g += T(px(cx), 22, 'C', { size: 13, w: 700, fill: '#2563eb' }) + T(px(rx), 22, 'R', { size: 13, w: 700, fill: '#2563eb' });
      const svg = wrap(w, 162, g);
      return r.int(0, 1) ? { title: 'Longitudinal wave', spec: 'P3.3', kind: 'diagram', svg, q: 'Use the scale. What is the wavelength of this wave?', o: [n(lam) + ' ' + U[0], ...uniq(lam, [lam / 2, lam * 2, len, lam * 3]).map(v => n(v) + ' ' + U[0])], x: `Wavelength = distance from the middle of one compression to the middle of the next: ${n(lam)} ${U[0]}.` }
        : { title: 'Longitudinal wave', spec: 'P3.1', kind: 'diagram', svg, q: 'What are the regions labelled C and R?', o: ['C = compression, R = rarefaction', 'C = rarefaction, R = compression', 'C = crest, R = trough', 'C = trough, R = crest'], x: 'Where the coils are squashed together is a compression; where they are spread out is a rarefaction. Crests and troughs are for transverse waves.' };
    }
    const A = r.pick([0.5, 1, 1.5, 2, 3, 4, 5, 6]), Y = A < 1 ? 1 : A <= 2 ? Math.ceil(A) + 1 : Math.ceil((A + 1) / 2) * 2, ystep = Y <= 3 ? .5 * (Y > 1 ? 2 : 1) : 2, ph = r.pick([0, .25, .5]);
    const yU = r.pick(['cm', 'cm', 'mm', 'm']);
    if (kind === 'time') {
      const [tU, Ts] = r.pick([['s', [0.2, 0.25, 0.5, 2, 4]], ['ms', [2, 4, 5, 10, 20]]]), Tp = r.pick(Ts), xmax = Tp * cyc, fr = tU === 'ms' ? 1000 / Tp : 1 / Tp;
      const svg = waveAxes({ xmax, xstep: Tp / 2, Y, ystep, xl: `Time (${tU})`, yl: `Displacement (${yU})`, f: x => A * Math.sin(2 * Math.PI * (x / Tp + ph)) });
      if (r.int(0, 1)) return { title: 'Wave: displacement–time', spec: 'P3.3', kind: 'graph', svg, q: 'What is the time period of this wave?', o: [n(Tp) + ' ' + tU, ...uniq(Tp, [Tp / 2, Tp * 2, xmax, A]).map(v => n(v) + ' ' + tU)], x: `Period = time for one complete wave (peak to next peak): ${n(Tp)} ${tU}.` };
      return { title: 'Wave: displacement–time', spec: 'P3.5', kind: 'graph', svg, q: 'What is the frequency of this wave?', o: [n(fr) + ' Hz', ...uniq(n(fr), [1 / Tp, Tp, 2 * fr, fr / 2, 1000 * Tp].map(n)).map(v => v + ' Hz')], x: `Period T = ${n(Tp)} ${tU}${tU === 'ms' ? ` = ${n(Tp / 1000)} s` : ''}. f = 1 ÷ T = ${n(fr)} Hz.` };
    }
    const [xU, lams] = r.pick([['cm', [2, 4, 5, 8, 10, 20]], ['m', [0.5, 1, 2, 4, 5]], ['mm', [2, 4, 5, 10]]]), lam = r.pick(lams), xmax = lam * cyc;
    const svg = waveAxes({ xmax, xstep: cyc > 3 ? lam : lam / 2, Y, ystep, xl: `Distance (${xU})`, yl: `Displacement (${yU})`, f: x => A * Math.sin(2 * Math.PI * (x / lam + ph)) });
    const q = r.int(0, r.hard ? 2 : 1);
    if (q === 0) return { title: 'Wave: displacement–distance', spec: 'P3.3', kind: 'graph', svg, q: 'What is the wavelength of this wave?', o: [n(lam) + ' ' + xU, ...uniq(lam, [lam / 2, lam * 2, xmax, lam * 1.5]).map(v => n(v) + ' ' + xU)], x: `Wavelength = distance from one peak to the next (one full wave): ${n(lam)} ${xU}. There are ${cyc} waves on the graph.` };
    if (q === 1) return { title: 'Wave: displacement–distance', spec: 'P3.3', kind: 'graph', svg, q: 'The dashed line is the rest position. What is the amplitude?', o: [n(A) + ' ' + yU, ...uniq(A, [2 * A, A + ystep, Y, 2 * Y]).map(v => n(v) + ' ' + yU)], x: `Amplitude = height of a peak above the rest position: ${n(A)} ${yU} (not peak to trough, which is ${n(2 * A)} ${yU}).` };
    const fq = r.pick([2, 5, 10, 20, 50]), lm = xU === 'm' ? lam : xU === 'cm' ? lam / 100 : lam / 1000, sp = fq * lm;
    return { title: 'Wave: displacement–distance', spec: 'P3.5', kind: 'graph', svg, q: `The frequency is ${fq} Hz. What is the wave speed?`, o: [n(sp) + ' m/s', ...uniq(n(sp), [fq * lam, fq / lm, sp * 10, sp / 10].map(n)).map(v => v + ' m/s')], x: `v = f × λ = ${fq} × ${n(lm)} m = ${n(sp)} m/s.${xU !== 'm' ? ' (Convert the wavelength to metres first.)' : ''}` };
  };

  /* magnetic fields traced from pole "charges": field lines never cross, they leave N and enter S.
     Single bar magnet (horizontal or vertical), two magnets attracting or repelling, or the uniform field between flat poles. */
  function traceField(Q, box, starts, hidden) {
    const E = (x, y) => { let ex = 0, ey = 0; Q.forEach(c => { const dx = x - c.x, dy = y - c.y, d3 = Math.pow(dx * dx + dy * dy, 1.5) + 1e-6; ex += c.q * dx / d3; ey += c.q * dy / d3; }); const m = Math.hypot(ex, ey) || 1; return [ex / m, ey / m]; };
    /* dir 1 = follow the field from an N pole; dir -1 = follow it backwards from an S pole, kept only if it never reaches an N pole (lines that arrive from outside the picture) */
    return starts.map(([x, y, dir = 1]) => { const pts = [[x, y]]; let px = x, py = y, closed = false;
      for (let i = 0; i < 1600; i++) { let [ax, ay] = E(px, py); ax *= dir; ay *= dir; let [bx, by] = E(px + ax, py + ay); bx *= dir; by *= dir; px += (ax + bx); py += (ay + by);
        pts.push([px, py]); if (Math.abs(px) > box[0] || Math.abs(py) > box[1]) break; if (Q.some(c => c.q === -dir && Math.hypot(px - c.x, py - c.y) < 3)) { closed = true; break; } }
      if (dir < 0) { if (closed) return { pts: [], vis: [] }; pts.reverse(); }
      const vis = pts.filter(p => !hidden(p)); return { pts, vis }; });
  }
  M.magnet = r => {
    const kind = r.hard ? r.pick(['single', 'attract', 'repel', 'uniform']) : r.pick(['single', 'single', 'attract', 'repel', 'uniform']);
    const vert = kind === 'single' && r.f() < .35, W = vert ? 340 : 480, H = vert ? 420 : 300, BX = vert ? [H / 2, W / 2] : [W / 2, H / 2];
    const hw = r.pick([55, 65, 75]), hh = r.pick([14, 17, 20]), m = r.pick([5, 6, 7]);
    const mags = [], Q = [];
    const bar = (cx, nLeft) => { mags.push({ x: cx - hw, y: -hh, w: 2 * hw, h: 2 * hh, nLeft }); const a = hw - hh * .7; Q.push({ x: cx + (nLeft ? -a : a), y: 0, q: 1, mate: Q.length + 1 }, { x: cx + (nLeft ? a : -a), y: 0, q: -1 }); };
    let gap = 0;
    if (kind === 'single') bar(0, r.int(0, 1) === 1);
    else if (kind === 'attract' || kind === 'repel') { gap = r.pick([60, 80, 100]); const off = hw + gap / 2, flip = r.int(0, 1) === 1;
      if (kind === 'attract') { bar(-off, flip); bar(off, flip); } else { bar(-off, flip); bar(off, !flip); } }
    else { const fw = 40, fh = r.pick([70, 90]), g2 = r.pick([90, 120, 150]) / 2, nLeft = r.int(0, 1) === 1, k = 9;
      mags.push({ x: -g2 - fw, y: -fh, w: fw, h: 2 * fh, nLeft, face: 1 }, { x: g2, y: -fh, w: fw, h: 2 * fh, nLeft, face: 2 });
      for (let i = 0; i < k; i++) { const y = -fh + 6 + i * (2 * fh - 12) / (k - 1); Q.push({ x: (nLeft ? -1 : 1) * (g2 + 4), y, q: 1 }, { x: (nLeft ? 1 : -1) * (g2 + 4), y, q: -1 }); } }
    const inMag = p => mags.some(b => p[0] > b.x - 1 && p[0] < b.x + b.w + 1 && p[1] > b.y - 1 && p[1] < b.y + b.h + 1);
    const starts = [];
    Q.forEach((c, i) => {
      if (kind === 'uniform') { if (c.q > 0) starts.push([c.x + (c.x < 0 ? 4 : -4), c.y]); return; }
      const mate = c.q > 0 ? Q[c.mate] : Q[i - 1], ref = Math.atan2(mate.y - c.y, mate.x - c.x);   // equal-flux starting angles round each pole
      for (let j = 1; j <= m; j++) { const th = Math.acos(1 - 2 * (j - .5) / m); [1, -1].forEach(s => starts.push([c.x + 3 * Math.cos(ref + s * th), c.y + 3 * Math.sin(ref + s * th), c.q])); } });
    const lines = traceField(Q, [BX[0] - 6, BX[1] - 6], starts, inMag);
    const map = vert ? ([x, y]) => [W / 2 + y, H / 2 + x] : ([x, y]) => [W / 2 + x, H / 2 + y];
    let g = ''; const heads = [];
    lines.forEach(({ vis }) => { if (vis.length < 15) return;
      g += `<polyline points="${vis.filter((_, i) => i % 2 === 0 || i === vis.length - 1).map(p => map(p).map(v => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="#444" stroke-width="1.5"/>`;
      const i = Math.floor(vis.length / 2), [ax, ay] = map(vis[i - 2]), [bx, by] = map(vis[i + 2]); heads.push([bx, by, Math.atan2(by - ay, bx - ax) * 180 / Math.PI]); });
    heads.forEach(([x, y, a]) => { g += arrowHead(x, y, a, '#444', 8); });
    const hidePoles = r.f() < .5;
    mags.forEach(b => { const [x1, y1] = map([b.x, b.y]), [x2, y2] = map([b.x + b.w, b.y + b.h]), X = Math.min(x1, x2), Y0 = Math.min(y1, y2), w = Math.abs(x2 - x1), h = Math.abs(y2 - y1);
      if (b.face) { const isN = (b.face === 1) === b.nLeft; g += `<rect x="${X}" y="${Y0}" width="${w}" height="${h}" fill="${hidePoles ? '#d1d5db' : isN ? '#fecaca' : '#bfdbfe'}" stroke="${INK}" stroke-width="2"/>` + T(X + w / 2, Y0 + h / 2 + 7, hidePoles ? '?' : isN ? 'N' : 'S', { size: 20, w: 700 }); return; }
      const half = vert ? [[X, Y0, w, h / 2], [X, Y0 + h / 2, w, h / 2]] : [[X, Y0, w / 2, h], [X + w / 2, Y0, w / 2, h]];
      half.forEach(([x, y, ww, hh2], i) => { const isN = (i === 0) === b.nLeft; g += `<rect x="${x}" y="${y}" width="${ww}" height="${hh2}" fill="${hidePoles ? '#d1d5db' : isN ? '#fecaca' : '#bfdbfe'}" stroke="${INK}" stroke-width="2"/>` + T(x + ww / 2, y + hh2 / 2 + 7, hidePoles ? '?' : isN ? 'N' : 'S', { size: 18, w: 700 }); }); });
    const title = kind === 'single' ? 'Magnetic field of a bar magnet' : kind === 'uniform' ? 'Magnetic field between two flat poles' : 'Magnetic field of two bar magnets';
    if (kind === 'single') {
      const b = mags[0], nEnd = b.nLeft ? (vert ? 'The top end' : 'The left end') : (vert ? 'The bottom end' : 'The right end'), sEnd = b.nLeft ? (vert ? 'The bottom end' : 'The right end') : (vert ? 'The top end' : 'The left end');
      if (hidePoles) return { title, spec: 'P6.4', kind: 'diagram', svg: wrap(W, H, g), q: 'Which end of the bar magnet is the north pole?', o: [nEnd, sEnd, 'Both ends', 'You can\'t tell from the field lines'], x: 'Field lines come out of the north pole and go into the south pole. Follow the arrows back to the end they leave from.' };
      const P = map([b.nLeft ? -hw - 14 : hw + 14, -hh - 10]), Qp = map([BX[0] * .78, -BX[1] * .82]);
      g += `<circle cx="${P[0]}" cy="${P[1]}" r="4.5" fill="${INK}"/>` + T(P[0] - 12, P[1] - 6, 'P', { size: 14, w: 700 }) + `<circle cx="${Qp[0]}" cy="${Qp[1]}" r="4.5" fill="${INK}"/>` + T(Qp[0] + 10, Qp[1] - 6, 'Q', { size: 14, w: 700, a: 'start' });
      return { title, spec: 'P6.4', kind: 'diagram', svg: wrap(W, H, g), q: 'Where is the magnetic field stronger, at P or at Q?', o: ['P: the field lines are closer together', 'Q: it is further from the magnet', 'The same everywhere', 'Q: the field lines are more curved'], x: 'The closer together the field lines, the stronger the field. They are most crowded near the poles.' };
    }
    if (kind === 'uniform') return hidePoles
      ? { title, spec: 'P6.4', kind: 'diagram', svg: wrap(W, H, g), q: 'Which pole is on the left?', o: [mags[0].nLeft ? 'North' : 'South', mags[0].nLeft ? 'South' : 'North', 'Both are north', 'You can\'t tell'], x: 'The field lines point from north to south across the gap. Look at which way the arrows go.' }
      : { title, spec: 'P6.4', kind: 'diagram', svg: wrap(W, H, g), q: 'What is the magnetic field like in the middle of the gap?', o: ['Uniform: the same strength and direction everywhere', 'Strongest in the middle of the gap', 'Zero, because the poles cancel out', 'It points from S to N'], x: 'The lines are straight, parallel and evenly spaced, so the field is uniform. (It points from N to S and only spreads out at the edges.)' };
    const facing = kind === 'attract' ? 'opposite poles facing' : 'like poles facing';
    if (hidePoles || kind === 'attract') return { title, spec: 'P6.4', kind: 'diagram', svg: wrap(W, H, g), q: 'Will these two magnets attract or repel each other?', o: [kind === 'attract' ? 'Attract: field lines join one magnet to the other' : 'Repel: the field lines push apart and don\'t join', kind === 'attract' ? 'Repel: field lines join one magnet to the other' : 'Attract: the field lines push apart and don\'t join', 'Neither: magnets only affect iron', 'You can\'t tell without the pole labels'], x: kind === 'attract' ? `Lines go straight across the gap from one magnet into the other (${facing}), so they attract.` : `The lines from the two facing poles bend away from each other and leave a point with no field in the middle (${facing}), so they repel.` };
    g += `<circle cx="${W / 2}" cy="${H / 2}" r="4" fill="#dc2626"/>` + T(W / 2 + 8, H / 2 - 8, 'X', { size: 14, w: 700, a: 'start', fill: '#dc2626' });
    return { title, spec: 'P6.4', kind: 'diagram', svg: wrap(W, H, g), q: 'What is at point X, halfway between the magnets?', o: ['A neutral point: the two fields cancel, so there is no magnetic field', 'The strongest part of the field', 'A third pole', 'A point where the field lines cross'], x: 'Like poles face each other, so their fields point in opposite directions and cancel at X. Field lines never cross.' };
  };

  /* cells: drawn with the What The Cell engine (/interactive/cell-game/cells.js, window.Cells) when the page has loaded it */
  const CELL_KIND = { animal: 'an animal cell', plant: 'a plant cell', yeast: 'a fungus (yeast)', hypha: 'a fungus (hypha)', rod: 'a bacterium', coccus: 'a bacterium' };
  const cellOld = M.cell;
  M.cell = r => {
    const C = typeof window !== 'undefined' && window.Cells; if (!C) return cellOld(r);
    const type = r.pick(r.hard ? ['animal', 'plant', 'yeast', 'hypha', 'rod', 'coccus'] : ['animal', 'plant', 'plant', 'animal', 'yeast', 'rod']), style = r.pick(['exam', 'colour']);
    const c = C.cell(type, style, Math.floor(r.f() * 1e9) + 1), keys = sh(c.has.filter(k => c.parts[k]), r).slice(0, 4);
    const left = keys.filter(k => c.parts[k][0] < 200).sort((a, b) => c.parts[a][1] - c.parts[b][1]), right = keys.filter(k => c.parts[k][0] >= 200).sort((a, b) => c.parts[a][1] - c.parts[b][1]);
    const letter = {}; let g = `<clipPath id="cellclip"><rect x="-4" y="0" width="408" height="280"/></clipPath><g clip-path="url(#cellclip)">${c.svg}</g>`, li = 0;
    [[left, -40], [right, 440]].forEach(([ks, lx]) => ks.forEach((k, i) => { const L = 'ABCD'[li++]; letter[k] = L; const ly = 40 + (i + .5) * (200 / ks.length), [x, y] = c.parts[k];
      g += `<line x1="${x}" y1="${y}" x2="${lx + (lx < 0 ? 14 : -14)}" y2="${ly}" stroke="${INK}" stroke-width="1.3"/><circle cx="${x}" cy="${y}" r="2.6" fill="${INK}"/>` + T(lx, ly + 6, L, { size: 17, w: 700 }); }));
    const svg = `<svg viewBox="-60 0 520 280" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;background:#fff">${g}</svg>`, k = r.pick(keys), L = letter[k], P = C.PARTS, title = 'Cell diagram';
    const q = r.int(0, 2);
    if (q === 0) return { title, spec: 'B2.2', kind: 'diagram', svg, q: `What is part ${L}?`, o: [P[k].name, ...others(P[k].name, Object.values(P).map(p => p.name), r)], x: `${L} is the ${P[k].name.toLowerCase()}: ${P[k].fn.toLowerCase()}.` };
    if (q === 1) return { title, spec: 'B2.2', kind: 'diagram', svg, q: `What is the job of part ${L}?`, o: [P[k].fn, ...others(P[k].fn, Object.values(P).map(p => p.fn), r)], x: `${L} is the ${P[k].name.toLowerCase()}.` };
    const ans = CELL_KIND[type], why = { animal: 'a nucleus but no cell wall, no chloroplasts and no large vacuole', plant: 'a cell wall, chloroplasts and a large permanent vacuole', yeast: 'a cell wall and a nucleus but no chloroplasts, and it is a single oval cell', hypha: 'a cell wall and several nuclei in long threads, but no chloroplasts', rod: 'no nucleus: a loop of DNA and plasmids instead', coccus: 'no nucleus: a loop of DNA and plasmids instead' }[type];
    return { title, spec: 'B2.2', kind: 'diagram', svg, q: 'What kind of organism is this cell from?', o: [ans, ...others(ans, [...new Set(Object.values(CELL_KIND))], r)], x: `It has ${why}, so it's ${ans}.` };
  };

  /* ---------- light: angle arcs measured clockwise from "up" ---------- */
  const at = (ox, oy, a, L) => [ox + Math.sin(a * Math.PI / 180) * L, oy - Math.cos(a * Math.PI / 180) * L];
  const angArc = (ox, oy, a0, a1, rad, lab, col = INK) => { const [x0, y0] = at(ox, oy, a0, rad), [x1, y1] = at(ox, oy, a1, rad), [mx, my] = at(ox, oy, (a0 + a1) / 2, rad + 13);
    return `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${rad} ${rad} 0 0 ${a1 > a0 ? 1 : 0} ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="${col}" stroke-width="1.3"/>` + (lab ? T(mx.toFixed(1), (my + 4).toFixed(1), lab, { size: 13, w: 700, fill: col }) : ''); };
  /* a ray from P to Q with an arrowhead part-way along */
  const rayLine = (P, Q, col = '#dc2626', dash) => { const mx = P[0] + (Q[0] - P[0]) * .55, my = P[1] + (Q[1] - P[1]) * .55;
    return `<line x1="${P[0].toFixed(1)}" y1="${P[1].toFixed(1)}" x2="${Q[0].toFixed(1)}" y2="${Q[1].toFixed(1)}" stroke="${col}" stroke-width="2.4"${dash ? ' stroke-dasharray="6 4" opacity=".6"' : ''}/>` + arrowHead(mx, my, Math.atan2(Q[1] - P[1], Q[0] - P[0]) * 180 / Math.PI, col, 10); };
  const normalLine = (ox, oy, a, L1, L2) => { const [x1, y1] = at(ox, oy, a, L1), [x2, y2] = at(ox, oy, a + 180, L2); return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#555" stroke-dasharray="5 4"/>`; };
  const deg = x => x * 180 / Math.PI, sinD = a => Math.sin(a * Math.PI / 180);
  const MEDIA = [['glass', 1.5], ['glass', 1.5], ['water', 1.33], ['Perspex', 1.49], ['diamond', 2.42]];

  /* refraction: air → medium or medium → air, single boundary or a whole rectangular block, ray from either side */
  M.ray = r => {
    const [med, nn] = r.pick(MEDIA), kind = r.pick(['in', 'in', 'out', 'block']), s = r.pick([1, -1]), lab = r.pick([['a', 'b', 'c', 'd'], ['p', 'q', 'r', 's'], ['w', 'x', 'y', 'z']]);
    const crit = deg(Math.asin(1 / nn)), title = 'Ray diagram: refraction';
    let i = kind === 'out' ? r.pick([10, 15, 20, 25, 30, 35].filter(a => a < crit - 4)) : r.pick([20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70]);
    const rr = kind === 'out' ? deg(Math.asin(nn * sinD(i))) : deg(Math.asin(sinD(i) / nn)), ox = 200, oy = kind === 'block' ? 70 : 115, L = 95;
    let g = '';
    if (kind === 'block') {
      const H = 110, x2 = ox + s * Math.tan(rr * Math.PI / 180) * H, oy2 = oy + H;
      g += `<rect x="40" y="${oy}" width="320" height="${H}" fill="#e0f2fe" stroke="${INK}"/>` + T(56, oy + H - 10, med, { size: 12, a: 'start' }) + T(56, oy - 46, 'air', { size: 12, a: 'start' });
      g += normalLine(ox, oy, 0, 60, 40) + normalLine(x2, oy2, 0, 40, 60);
      g += rayLine(at(ox, oy, -s * i, 80), [ox, oy]) + rayLine([ox, oy], [x2, oy2]) + rayLine([x2, oy2], at(x2, oy2, 180 - s * i, 70));
      g += angArc(ox, oy, s > 0 ? -i : 0, s > 0 ? 0 : i, 30, lab[0]) + angArc(ox, oy, s > 0 ? 180 - rr : 180, s > 0 ? 180 : 180 + rr, 30, lab[1]) + angArc(x2, oy2, s > 0 ? 180 - i : 180, s > 0 ? 180 : 180 + i, 30, lab[2]);
      const svg = wrap(400, oy2 + 80, g);
      return r.int(0, 1) ? { title: 'Ray through a glass block', spec: 'P3.17', kind: 'diagram', svg, q: 'What is true about the ray that comes out of the bottom of the block?', o: ['It is parallel to the ray that went in', 'It bends back to where it started', 'It carries straight on inside the block\'s direction', 'It is reflected back into the block'], x: `It bends towards the normal going in and away from the normal by the same amount coming out, so angle ${lab[2]} = angle ${lab[0]} and the ray leaves parallel to the ray that went in (just shifted sideways).` }
        : { title: 'Ray through a glass block', spec: 'P3.17', kind: 'diagram', svg, q: `Which angle is the angle of refraction where the ray enters the ${med}?`, o: [lab[1], lab[0], lab[2], 'none of them'], x: `Angles are measured from the normal. Inside the ${med}, between the ray and the normal, is ${lab[1]}.` };
    }
    const top = kind === 'in' ? 'air' : med, bot = kind === 'in' ? med : 'air', fillTop = kind === 'out';
    g += `<rect x="40" y="${fillTop ? 10 : oy}" width="320" height="${fillTop ? oy - 10 : 115}" fill="#e0f2fe" stroke="none"/><line x1="40" y1="${oy}" x2="360" y2="${oy}" stroke="${INK}" stroke-width="1.6"/>` + T(56, oy - 12, top, { size: 12, a: 'start' }) + T(56, oy + 22, bot, { size: 12, a: 'start' });
    g += normalLine(ox, oy, 0, 100, 105) + T(ox + 6, oy - 88, 'normal', { size: 11, a: 'start' });
    g += rayLine(at(ox, oy, -s * i, L), [ox, oy]) + rayLine([ox, oy], at(ox, oy, 180 - s * rr, L));
    g += angArc(ox, oy, s > 0 ? -i : 0, s > 0 ? 0 : i, 34, lab[0]) + angArc(ox, oy, s > 0 ? -90 : i, s > 0 ? -i : 90, 54, lab[1]) + angArc(ox, oy, s > 0 ? 180 - rr : 180, s > 0 ? 180 : 180 + rr, 34, lab[2]) + angArc(ox, oy, s > 0 ? 90 : 180 + rr, s > 0 ? 180 - rr : 270, 54, lab[3]);
    const svg = wrap(400, 235, g), air = kind === 'in' ? i : rr, inMed = kind === 'in' ? rr : i, q = r.int(0, r.hard ? 3 : 2);
    if (q === 0) return { title, spec: 'P3.16', kind: 'diagram', svg, q: 'Which angle is the angle of refraction?', o: [lab[2], lab[0], lab[3], lab[1]], x: `Angles are measured from the normal, not the surface. The refracted ray is the one after the boundary, so the angle of refraction is ${lab[2]}. (${lab[0]} is the angle of incidence.)` };
    if (q === 1) return { title, spec: 'P3.16', kind: 'diagram', svg, q: `As the light goes from ${top} into ${bot}, how does it bend?`, o: [kind === 'in' ? 'Towards the normal: it slows down' : 'Away from the normal: it speeds up', kind === 'in' ? 'Away from the normal: it speeds up' : 'Towards the normal: it slows down', 'It doesn\'t bend: it goes straight through', 'Away from the normal: it slows down'], x: kind === 'in' ? `Light slows down going into the ${med}, so it bends towards the normal (angle of refraction smaller than angle of incidence).` : `Light speeds up going from the ${med} into air, so it bends away from the normal.` };
    if (q === 2) { const ans = n(nn); return { title, spec: 'P3.18', kind: 'diagram', svg, q: `Angle ${lab[0]} = ${n(i)}° and angle ${lab[2]} = ${n(rr)}°. What is the refractive index of the ${med}?`, o: [ans, ...uniq(ans, [air / inMed, sinD(inMed) / sinD(air), inMed / air, 1 / nn + 1].map(n))], x: `n = sin(angle in air) ÷ sin(angle in the ${med}) = sin ${n(air)}° ÷ sin ${n(inMed)}° = ${ans}.` }; }
    const ans = n(Math.round(rr * 10) / 10); return { title, spec: 'P3.18', kind: 'diagram', svg, q: `The refractive index of the ${med} is ${nn}. Angle ${lab[0]} = ${i}°. What is angle ${lab[2]}?`, o: [ans + '°', ...uniq(ans, [i / nn, i * nn, 90 - rr, i].map(v => n(Math.round(v * 10) / 10))).map(v => v + '°')], x: kind === 'in' ? `sin r = sin i ÷ n = sin ${i}° ÷ ${nn} = ${n(sinD(i) / nn)}, so r = ${ans}°.` : `sin r = n × sin i = ${nn} × sin ${i}° = ${n(nn * sinD(i))}, so r = ${ans}°.` };
  };

  /* reflection in a plane mirror: mirror flat, or upright on the left or right; angles to the normal or to the mirror */
  M.reflect = r => {
    const N = r.pick([0, 0, 90, 270]), i = r.pick([20, 25, 30, 35, 40, 45, 50, 55, 60, 65]), s = r.pick([1, -1]), lab = r.pick([['a', 'b', 'c', 'd'], ['p', 'q', 'r', 's'], ['w', 'x', 'y', 'z']]);
    const [ox, oy] = N === 0 ? [200, 190] : N === 90 ? [70, 120] : [330, 120], W = 400, H = 235;
    const [m1x, m1y] = at(ox, oy, N + 90, 130), [m2x, m2y] = at(ox, oy, N - 90, 130);
    let g = `<line x1="${m1x}" y1="${m1y}" x2="${m2x}" y2="${m2y}" stroke="${INK}" stroke-width="4"/>`;
    for (let k = -120; k <= 120; k += 14) { const [hx, hy] = at(ox, oy, N + 90, k), [ex, ey] = at(hx, hy, N + 180 + 35, 12); g += `<line x1="${hx.toFixed(1)}" y1="${hy.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="${INK}"/>`; }
    g += normalLine(ox, oy, N, 150, 0) + (() => { const [tx, ty] = at(ox, oy, N, 150); return T(tx + (N === 0 ? 6 : 0), ty + (N === 0 ? 14 : -6), 'normal', { size: 11, a: N === 0 ? 'start' : 'middle' }); })() + (N === 0 ? T(m1x - 10, m1y - 8, 'mirror', { size: 11, a: 'end' }) : T(ox + (N === 90 ? 8 : -8), H - 6, 'mirror', { size: 11, a: N === 90 ? 'start' : 'end' }));
    g += rayLine(at(ox, oy, N - s * i, 150), [ox, oy]) + rayLine([ox, oy], at(ox, oy, N + s * i, 150));
    g += angArc(ox, oy, s > 0 ? N - i : N, s > 0 ? N : N + i, 40, lab[0]) + angArc(ox, oy, s > 0 ? N : N - i, s > 0 ? N + i : N, 40, lab[1]) + angArc(ox, oy, s > 0 ? N - 90 : N + i, s > 0 ? N - i : N + 90, 64, lab[2]) + angArc(ox, oy, s > 0 ? N + i : N - 90, s > 0 ? N + 90 : N - i, 64, lab[3]);
    const svg = wrap(W, H, g), title = 'Ray diagram: reflection', q = r.int(0, 2);
    if (q === 0) return { title, spec: 'P3.16', kind: 'diagram', svg, q: 'Which angle is the angle of reflection?', o: [lab[1], lab[0], lab[3], lab[2]], x: `Angles are measured from the normal. The reflected ray is the one leaving the mirror, so the angle of reflection is ${lab[1]} (and ${lab[0]}, the angle of incidence, is equal to it).` };
    if (q === 1) { const th = 90 - i; return { title, spec: 'P3.15', kind: 'diagram', svg, q: `Angle ${lab[2]}, between the ray and the mirror, is ${th}°. What is the angle of reflection?`, o: [i + '°', ...uniq(i, [th, 2 * th, 180 - 2 * th, 2 * i, 90 + i, i / 2]).map(v => v + '°')], x: `The angle of incidence is measured from the normal: 90° − ${th}° = ${i}°. Angle of reflection = angle of incidence = ${i}°.` }; }
    return { title, spec: 'P3.15', kind: 'diagram', svg, q: `The angle of incidence is ${i}°. What is the angle between the incoming ray and the reflected ray?`, o: [2 * i + '°', ...uniq(2 * i, [i, 90 - i, 180 - 2 * i, 180 - i, 4 * i]).map(v => v + '°')], x: `Angle of reflection = angle of incidence = ${i}°, and both are measured from the normal, so the rays are ${i}° + ${i}° = ${2 * i}° apart.` };
  };

  /* total internal reflection in a semicircular block: the ray aims at the centre O of the flat face */
  M.tir = r => {
    const [med, nn] = r.pick(MEDIA), c = deg(Math.asin(1 / nn)), cR = Math.round(c), s = r.pick([1, -1]);
    const kase = r.pick(['above', 'above', 'below', 'crit']), i = kase === 'crit' ? cR : kase === 'above' ? Math.min(80, cR + r.pick([8, 12, 18, 25])) : Math.max(10, cR - r.pick([10, 15, 20]));
    const mode = r.pick(kase === 'crit' ? ['drawn'] : ['predict', 'drawn', 'drawn']), ox = 200, oy = 80, R = 130, x = r.pick(['i', 'x', 'θ']);
    let g = `<path d="M${ox - R} ${oy}A${R} ${R} 0 0 0 ${ox + R} ${oy}Z" fill="#e0f2fe" stroke="${INK}" stroke-width="1.6"/>` + T(ox - R + 6, oy - 10, 'air', { size: 12, a: 'start' }) + T(ox - 40, oy + R - 22, med, { size: 12 });
    g += normalLine(ox, oy, 0, 70, R + 10);
    g += rayLine(at(ox, oy, 180 + s * i, R + 30), [ox, oy]) + angArc(ox, oy, s > 0 ? 180 : 180 - i, s > 0 ? 180 + i : 180, 44, x);
    if (mode === 'drawn') {
      const rout = kase === 'below' ? deg(Math.asin(Math.min(1, nn * sinD(i)))) : 90;
      if (kase !== 'above') g += rayLine([ox, oy], at(ox, oy, s * (kase === 'crit' ? 89 : rout), kase === 'crit' ? R + 20 : 120));
      g += rayLine([ox, oy], at(ox, oy, 180 - s * i, R), '#dc2626', kase !== 'above');   // dashed = the weak partial reflection
    }
    g += `<circle cx="${ox}" cy="${oy}" r="3" fill="${INK}"/>` + T(ox + s * -12, oy - 6, 'O', { size: 12, w: 700 });
    const svg = wrap(400, oy + R + 50, g), title = 'Total internal reflection';
    if (mode === 'predict') {
      const ans = kase === 'above' ? 'It is totally internally reflected' : 'It refracts out into the air, bending away from the normal';
      return { title, spec: 'P3.21', kind: 'diagram', svg, q: `The critical angle for ${med} is ${cR}°. Angle ${x} is ${i}°. What happens to the ray at O?`, o: [ans, ...others(ans, ['It is totally internally reflected', 'It refracts out into the air, bending away from the normal', 'It refracts out, bending towards the normal', 'It travels along the surface'], r)], x: kase === 'above' ? `${i}° is bigger than the critical angle (${cR}°), so all the light is reflected back into the ${med}.` : `${i}° is smaller than the critical angle (${cR}°), so most of the light refracts out (bending away from the normal) and a little is reflected.` };
    }
    if (kase === 'crit') return r.int(0, 1) || !r.hard ? { title, spec: 'P3.21', kind: 'diagram', svg, q: `The ray leaves O along the surface of the ${med}. What is angle ${x} called?`, o: ['The critical angle', 'The angle of refraction', 'The angle of reflection', 'The angle of total internal reflection'], x: 'When the angle of incidence makes the refracted ray travel along the boundary (angle of refraction 90°), it is the critical angle.' }
      : { title, spec: 'P3.22', kind: 'diagram', svg, q: `The refractive index of ${med} is ${nn}. What is the critical angle?`, o: [n(Math.round(c * 10) / 10) + '°', ...uniq(n(Math.round(c * 10) / 10), [deg(Math.asin(1 / nn / 2)), deg(Math.atan(1 / nn)), 90 / nn, deg(Math.acos(1 / nn))].map(v => n(Math.round(v * 10) / 10))).map(v => v + '°')], x: `sin c = 1 ÷ n = 1 ÷ ${nn} = ${n(1 / nn)}, so c = ${n(Math.round(c * 10) / 10)}°.` };
    if (kase === 'above') return r.int(0, 1) ? { title, spec: 'P3.21', kind: 'diagram', svg, q: 'What is happening to the ray at O?', o: ['Total internal reflection', 'Refraction', 'Diffraction', 'Dispersion'], x: `Angle ${x} (${i}°) is bigger than the critical angle for ${med} (${cR}°), so no light gets out: it is all reflected inside the ${med}.` }
      : { title, spec: 'P3.21', kind: 'diagram', svg, q: `Which of these must be true for this to happen?`, o: [`Angle ${x} is bigger than the critical angle`, `Angle ${x} is smaller than the critical angle`, 'The light is going from air into the block', 'The surface is a mirror'], x: 'Total internal reflection needs light going from a denser medium towards a less dense one (here into air) and an angle of incidence bigger than the critical angle.' };
    return { title, spec: 'P3.21', kind: 'diagram', svg, q: `The dashed ray is weak. Why does most of the light get out of the ${med}?`, o: [`Angle ${x} is less than the critical angle`, `Angle ${x} is more than the critical angle`, 'Light can never reflect inside glass', `The ${med} absorbs the reflected light`], x: `${i}° is below the critical angle (${cR}°): most of the light refracts out and only a little is reflected (the dashed ray).` };
  };

  /* ---------- ionic dot-and-cross: any metal + non-metal from the first 20 elements; outer shells only (GCSE standard), sometimes full shells, and formation diagrams ---------- */
  const EL = { Li: [2, 1], Na: [2, 8, 1], K: [2, 8, 8, 1], Be: [2, 2], Mg: [2, 8, 2], Ca: [2, 8, 8, 2], Al: [2, 8, 3], N: [2, 5], O: [2, 6], S: [2, 8, 6], F: [2, 7], Cl: [2, 8, 7] };
  const NAMES = { Li: 'lithium', Na: 'sodium', K: 'potassium', Be: 'beryllium', Mg: 'magnesium', Ca: 'calcium', Al: 'aluminium', N: 'nitride', O: 'oxide', S: 'sulfide', F: 'fluoride', Cl: 'chloride' };
  const SUBS = ['', '', '₂', '₃', '₄'], fml = (m, nm, a, na) => `${m}${SUBS[nm]}${a}${SUBS[na]}`, chg = (k, s) => (k === 1 ? '' : k) + s;
  /* one particle: shells = electron counts inside out; outerOther = how many outer electrons came from the other atom; brackets for ions */
  function particle(cx, cy, sym, shells, own, outerOther, charge, full) {
    let g = `<circle cx="${cx}" cy="${cy}" r="13" fill="#eeeae0" stroke="${INK}"/>` + T(cx, cy + 5, sym, { size: 13, w: 700 });
    const list = full ? shells : shells.slice(-1);
    list.forEach((cnt, k) => { const rad = 30 + (full ? k : 0) * 14; if (!(cnt === 0 && !full && charge)) g += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="#666"/>`;
      const last = k === list.length - 1;
      for (let i = 0; i < cnt; i++) { const [dx, dy] = ringXY(cnt, i, rad); g += elec(cx + dx, cy + dy, (last && i >= cnt - outerOther) ? !own : own); } });
    const R0 = !full && list[0] === 0 ? 22 : 30 + (full ? list.length - 1 : 0) * 14 + 9;
    if (charge) g += `<path d="M${cx - R0 + 6} ${cy - R0}h-6v${2 * R0}h6M${cx + R0 - 6} ${cy - R0}h6v${2 * R0}h-6" fill="none" stroke="${INK}" stroke-width="1.6"/>` + T(cx + R0 + 9, cy - R0 + 7, charge, { size: 14, w: 700 });
    return { g, R: R0 };
  }
  M.ionic = r => {
    const metals = ['Li', 'Na', 'K', 'Be', 'Mg', 'Ca', 'Al'], nons = ['F', 'Cl', 'O', 'S', 'N'], gcd = (a, b) => b ? gcd(b, a % b) : a;
    const all = []; metals.forEach(m => nons.forEach(a => { const qm = EL[m].slice(-1)[0], qa = 8 - EL[a].slice(-1)[0], l = qm * qa / gcd(qm, qa); all.push([m, a, l / qm, l / qa]); }));
    const pool = all.filter(([m, a, nm, na]) => r.hard ? nm + na <= 5 : nm + na <= 3 && !(m === 'Be' || a === 'N'));
    const [m, a, nm, na] = r.pick(r.hard ? pool : pool.concat(pool.filter(c => c[2] + c[3] === 2)));
    RING = r.pick(['pairs', 'pairs', 'single', 'spread']);
    const lose = EL[m].slice(-1)[0], gain = 8 - EL[a].slice(-1)[0], formula = fml(m, nm, a, na), tot = nm + na;
    const mode = r.hard && r.f() < .45 ? 'form' : tot <= 4 && r.f() < .25 ? 'full' : 'outer';
    const qMark = chg(lose, '+'), aMark = chg(gain, '−');
    /* repeated ions are stacked in a column (3 Li⁺ one above another next to the N³⁻), so the picture stays big on a phone */
    const ionM = () => particle(0, 0, m, mode === 'full' ? EL[m].slice(0, -1) : [0], 0, 0, qMark, mode === 'full'), ionA = () => particle(0, 0, a, mode === 'full' ? [...EL[a].slice(0, -1), 8] : [8], 1, gain, aMark, mode === 'full');
    const atomM = () => particle(0, 0, m, [lose], 0, 0, '', false), atomA = () => particle(0, 0, a, [8 - gain], 1, 0, '', false);
    /* two columns (metal, non-metal); a formation diagram puts the atoms above, an arrow, then the ions below, so it stays two columns wide */
    const blocks = mode === 'form' ? [[[atomM, nm], [atomA, na]], [[ionM, nm], [ionA, na]]] : [[[ionM, nm], [ionA, na]]];
    const Rk = blocks.map(bl => bl.map(([mk]) => mk().R)), colW = [0, 1].map(k => Math.max(...Rk.map(rr => 2 * rr[k] + 44)));
    const blockH = blocks.map((bl, b) => Math.max(...bl.map(([, cnt], k) => cnt * (2 * Rk[b][k] + 18)))), Wd = colW[0] + colW[1] + 30, WW = Math.max(300, Wd);
    let g = '', y = 14;
    blocks.forEach((bl, b) => { const cy = y + blockH[b] / 2; let x = (WW - Wd) / 2 + 18;
      bl.forEach(([mk, cnt], k) => { const st = 2 * Rk[b][k] + 18, cx = x + Rk[b][k] + 6; for (let i = 0; i < cnt; i++) g += `<g transform="translate(${cx.toFixed(1)} ${(cy + (i - (cnt - 1) / 2) * st).toFixed(1)})">${mk().g}</g>`; x += colW[k]; });
      y += blockH[b];
      if (b === 0 && blocks.length > 1) { g += `<path d="M${WW / 2} ${y + 6}v34" stroke="${INK}" stroke-width="2.5"/><path d="M${WW / 2} ${y + 48}l-7 -11h14z" fill="${INK}"/>`; y += 56; } });
    const H0 = y - 14;
    const legY = H0 + 40;
    g += `<g transform="translate(${WW / 2 - 110} ${legY})">${elec(0, -4, 0)}${T(8, 0, `${m} electron`, { size: 12, a: 'start' })}${elec(110, -4, 1)}${T(118, 0, `${a} electron`, { size: 12, a: 'start' })}</g>` + (mode !== 'full' ? T(WW - 8, legY + 18, 'outer shells only', { size: 11, fill: '#555', a: 'end' }) : '');
    const svg = wrap(WW, legY + 26, g);
    const q = r.int(0, 3), title = mode === 'form' ? 'Dot-and-cross: forming ions' : `Dot-and-cross: ionic${mode === 'full' ? ' (all shells)' : ''}`;
    const wrongF = [fml(m, 1, a, 1), fml(m, na, a, nm), fml(m, nm + 1, a, na), fml(m, nm, a, na + 1), fml(m, 1, a, 2), fml(m, 2, a, 1)].filter(f => f !== formula);
    if (q === 0) return { title, spec: 'C1.40', kind: 'diagram', svg, q: 'Which compound does this diagram show?', o: [formula, ...others(formula, [...new Set(wrongF)], r)], x: `${NAMES[m]} ${NAMES[a]}: each ${m} atom loses ${lose} electron${lose > 1 ? 's' : ''} and each ${a} atom gains ${gain}. Charges balance with ${nm} ${m}${qMark} to ${na} ${a}${aMark}: ${formula}.` };
    if (q === 1) return { title, spec: 'C1.38', kind: 'diagram', svg, q: `What is the charge on the ${NAMES[a]} ion?`, o: [aMark, ...others(aMark, ['−', '2−', '3−', '+', '2+', '3+'], r)], x: `${a} has ${EL[a].slice(-1)[0]} outer electrons and gains ${gain} to fill its outer shell: ${gain} extra negative charge${gain > 1 ? 's' : ''}, so ${aMark}.` };
    if (q === 2) return { title, spec: 'C1.40', kind: 'diagram', svg, q: `How many electrons does each ${m} atom lose?`, o: [String(lose), ...others(String(lose), ['1', '2', '3', '5', '6', '7'], r)], x: `${m} is in group ${lose}: it loses its ${lose} outer electron${lose > 1 ? 's' : ''} to get a full outer shell, becoming ${m}${qMark}.` };
    return { title, spec: 'C1.36', kind: 'diagram', svg, q: `Which group of the Periodic Table is ${m === 'Al' ? 'aluminium' : NAMES[m]} in?`, o: [`Group ${lose}`, ...others(`Group ${lose}`, ['Group 1', 'Group 2', 'Group 3', 'Group 5', 'Group 6', 'Group 7'], r)], x: `It loses ${lose} electron${lose > 1 ? 's' : ''} to form ${m}${qMark}, so it had ${lose} outer electron${lose > 1 ? 's' : ''}: group ${lose}.` };
  };

  /* ---------- covalent dot-and-cross: molecules from elements 1–20; lone pairs ON the shell, every shared pair stacked in one vertical column in the overlap ---------- */
  /* a: [symbol, lone pairs, mark (0 dot, 1 cross, 2 ring)], b: [i, j, bond order, direction from i to j in degrees, 0 = right, 90 = down] */
  const MOLS = {
    'H₂': { a: [['H', 0, 0], ['H', 0, 1]], b: [[0, 1, 1, 0]] }, 'F₂': { a: [['F', 3, 0], ['F', 3, 1]], b: [[0, 1, 1, 0]] }, 'Cl₂': { a: [['Cl', 3, 0], ['Cl', 3, 1]], b: [[0, 1, 1, 0]] },
    'HF': { a: [['F', 3, 0], ['H', 0, 1]], b: [[0, 1, 1, 180]] }, 'HCl': { a: [['Cl', 3, 0], ['H', 0, 1]], b: [[0, 1, 1, 180]] },
    'O₂': { a: [['O', 2, 0], ['O', 2, 1]], b: [[0, 1, 2, 0]] }, 'N₂': { a: [['N', 1, 0], ['N', 1, 1]], b: [[0, 1, 3, 0]] },
    'H₂O': { a: [['O', 2, 0], ['H', 0, 1], ['H', 0, 1]], b: [[0, 1, 1, 0], [0, 2, 1, 90]] }, 'H₂S': { a: [['S', 2, 0], ['H', 0, 1], ['H', 0, 1]], b: [[0, 1, 1, 0], [0, 2, 1, 90]] },
    'NH₃': { a: [['N', 1, 0], ['H', 0, 1], ['H', 0, 1], ['H', 0, 1]], b: [[0, 1, 1, 180], [0, 2, 1, 0], [0, 3, 1, 90]] }, 'PH₃': { a: [['P', 1, 0], ['H', 0, 1], ['H', 0, 1], ['H', 0, 1]], b: [[0, 1, 1, 180], [0, 2, 1, 0], [0, 3, 1, 90]] },
    'CH₄': { a: [['C', 0, 0], ['H', 0, 1], ['H', 0, 1], ['H', 0, 1], ['H', 0, 1]], b: [[0, 1, 1, 0], [0, 2, 1, 90], [0, 3, 1, 180], [0, 4, 1, 270]] },
    'SiH₄': { a: [['Si', 0, 0], ['H', 0, 1], ['H', 0, 1], ['H', 0, 1], ['H', 0, 1]], b: [[0, 1, 1, 0], [0, 2, 1, 90], [0, 3, 1, 180], [0, 4, 1, 270]] },
    'CCl₄': { a: [['C', 0, 0], ['Cl', 3, 1], ['Cl', 3, 1], ['Cl', 3, 1], ['Cl', 3, 1]], b: [[0, 1, 1, 0], [0, 2, 1, 90], [0, 3, 1, 180], [0, 4, 1, 270]] },
    'SiCl₄': { a: [['Si', 0, 0], ['Cl', 3, 1], ['Cl', 3, 1], ['Cl', 3, 1], ['Cl', 3, 1]], b: [[0, 1, 1, 0], [0, 2, 1, 90], [0, 3, 1, 180], [0, 4, 1, 270]] },
    'NCl₃': { a: [['N', 1, 0], ['Cl', 3, 1], ['Cl', 3, 1], ['Cl', 3, 1]], b: [[0, 1, 1, 180], [0, 2, 1, 0], [0, 3, 1, 90]] }, 'PCl₃': { a: [['P', 1, 0], ['Cl', 3, 1], ['Cl', 3, 1], ['Cl', 3, 1]], b: [[0, 1, 1, 180], [0, 2, 1, 0], [0, 3, 1, 90]] },
    'OF₂': { a: [['O', 2, 0], ['F', 3, 1], ['F', 3, 1]], b: [[0, 1, 1, 0], [0, 2, 1, 90]] }, 'SCl₂': { a: [['S', 2, 0], ['Cl', 3, 1], ['Cl', 3, 1]], b: [[0, 1, 1, 0], [0, 2, 1, 90]] },
    'CO₂': { a: [['C*', 0, 0], ['O', 2, 1], ['O', 2, 1]], b: [[0, 1, 2, 0], [0, 2, 2, 180]] },
    'HCN': { a: [['C', 0, 0], ['H', 0, 1], ['N', 1, 2]], b: [[0, 1, 1, 180], [0, 2, 3, 0]] },
    'C₂H₄': { a: [['C', 0, 0], ['C', 0, 2], ['H', 0, 1], ['H', 0, 1], ['H', 0, 1], ['H', 0, 1]], b: [[0, 1, 2, 0], [0, 2, 1, 125], [0, 3, 1, 235], [1, 4, 1, 55], [1, 5, 1, 305]] },
    'C₂H₆': { a: [['C', 0, 0], ['C', 0, 2], ['H', 0, 1], ['H', 0, 1], ['H', 0, 1], ['H', 0, 1], ['H', 0, 1], ['H', 0, 1]], b: [[0, 1, 1, 0], [0, 2, 1, 90], [0, 3, 1, 180], [0, 4, 1, 270], [1, 5, 1, 90], [1, 6, 1, 0], [1, 7, 1, 270]] },
    'CH₃Cl': { a: [['C', 0, 0], ['Cl', 3, 2], ['H', 0, 1], ['H', 0, 1], ['H', 0, 1]], b: [[0, 1, 1, 0], [0, 2, 1, 90], [0, 3, 1, 180], [0, 4, 1, 270]] },
  };
  const MOL_NAME = { 'H₂': 'hydrogen', 'F₂': 'fluorine', 'Cl₂': 'chlorine', 'HF': 'hydrogen fluoride', 'HCl': 'hydrogen chloride', 'O₂': 'oxygen', 'N₂': 'nitrogen', 'H₂O': 'water', 'H₂S': 'hydrogen sulfide', 'NH₃': 'ammonia', 'PH₃': 'phosphine', 'CH₄': 'methane', 'SiH₄': 'silane', 'CCl₄': 'tetrachloromethane', 'SiCl₄': 'silicon tetrachloride', 'NCl₃': 'nitrogen trichloride', 'PCl₃': 'phosphorus trichloride', 'OF₂': 'oxygen difluoride', 'SCl₂': 'sulfur dichloride', 'CO₂': 'carbon dioxide', 'HCN': 'hydrogen cyanide', 'C₂H₄': 'ethene', 'C₂H₆': 'ethane', 'CH₃Cl': 'chloromethane' };
  const RAD = s => s === 'H' ? 24 : s === 'C*' ? 42 : 34;   // C* = a bigger central carbon for CO₂, so both double bonds have room
  const OVER = (a, b, o) => o === 3 ? 32 : o === 2 ? 24 : (a === 'H' || b === 'H') ? 22 : 14;   // overlap depth: deep enough for a column of 2o electrons, shallow enough that neighbours don't touch
  function molecule(f) {
    const D = MOLS[f], at = D.a.map(([s, lp, mark]) => ({ s, lp, mark, x: null, y: 0 })), bonds = D.b.map(b => b.slice(0, 3));
    at[0].x = 0; let left = D.b.slice();
    while (left.length) { left = left.filter(([i, j, o, ang]) => { if (at[i].x === null) return true; const d = RAD(at[i].s) + RAD(at[j].s) - OVER(at[i].s, at[j].s, o), t = ang * Math.PI / 180; at[j].x = at[i].x + Math.cos(t) * d; at[j].y = at[i].y + Math.sin(t) * d; return false; }); }
    let g = '';
    at.forEach(a => { g += `<circle cx="${a.x.toFixed(1)}" cy="${a.y.toFixed(1)}" r="${RAD(a.s)}" fill="#93c5fd" fill-opacity=".22" stroke="${INK}" stroke-width="1.5"/>`; });   // see-through, so each overlap shows as a darker lens
    const dirs = at.map(() => []);
    bonds.forEach(([i, j, o]) => {
      const A = at[i], B = at[j], dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d, px = -uy, py = ux;
      const a = (d - RAD(B.s) + RAD(A.s)) / 2, mx = A.x + ux * a, my = A.y + uy * a;   // middle of the overlap
      for (let k = 0; k < 2 * o; k++) { const off = (k - (2 * o - 1) / 2) * 8; g += elec(mx + px * off, my + py * off, k % 2 ? B.mark : A.mark); }   // one column across the bond: dot, cross, dot, cross…
      dirs[i].push(Math.atan2(dy, dx)); dirs[j].push(Math.atan2(-dy, -dx));
    });
    at.forEach((a, i) => {
      const R = RAD(a.s), base = dirs[i][0] || 0, slots = (dirs[i].length === 1 ? [Math.PI / 2, -Math.PI / 2, Math.PI] : [Math.PI, Math.PI / 2, -Math.PI / 2, 0]).map(o => base + o).filter(t => dirs[i].every(b => Math.abs(Math.atan2(Math.sin(t - b), Math.cos(t - b))) > .6));
      slots.slice(0, a.lp).forEach(t => { const cx = a.x + Math.cos(t) * R, cy = a.y + Math.sin(t) * R, px = -Math.sin(t) * 5.5, py = Math.cos(t) * 5.5; g += elec(cx + px, cy + py, a.mark) + elec(cx - px, cy - py, a.mark); });   // lone pairs sit on the shell
      const ord = Math.max(1, ...bonds.filter(b => b[0] === i || b[1] === i).map(b => b[2])), out = dirs[i].length === 1 ? (a.s === 'H' ? -8 : -10 - 5 * (ord - 1)) : 0, t0 = dirs[i][0] || 0;
      g += T((a.x + Math.cos(t0) * out).toFixed(1), (a.y + Math.sin(t0) * out + 6).toFixed(1), a.s.replace('*', ''), { size: a.s.length > 1 && a.s !== 'C*' ? 15 : 17, w: 700 });
    });
    const x0 = Math.min(...at.map(a => a.x - RAD(a.s))) - 14, x1 = Math.max(...at.map(a => a.x + RAD(a.s))) + 14, y0 = Math.min(...at.map(a => a.y - RAD(a.s))) - 14, y1 = Math.max(...at.map(a => a.y + RAD(a.s))) + 14;
    const W = Math.max(230, x1 - x0), H = Math.max(150, y1 - y0), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    return `<svg viewBox="${(cx - W / 2).toFixed(1)} ${(cy - H / 2).toFixed(1)} ${W.toFixed(1)} ${H.toFixed(1)}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-height:280px;background:#fff" preserveAspectRatio="xMidYMid meet">${g}</svg>`;
  }
  M.covalent = r => {
    const easy = ['H₂', 'F₂', 'Cl₂', 'HF', 'HCl', 'H₂O', 'H₂S', 'NH₃', 'PH₃', 'CH₄', 'SiH₄'], hard = ['O₂', 'N₂', 'CO₂', 'C₂H₄', 'C₂H₆', 'HCN', 'CCl₄', 'SiCl₄', 'NCl₃', 'PCl₃', 'OF₂', 'SCl₂', 'CH₃Cl'];
    const f = r.pick(r.hard ? hard.concat(['H₂O', 'NH₃', 'CH₄']) : easy.concat(['O₂', 'N₂'])), D = MOLS[f], svg = molecule(f), title = 'Dot-and-cross: covalent';
    const shared = D.b.reduce((t, b) => t + b[2], 0), c0 = D.a[0][0].replace('*', ''), same = D.a.filter(x => x[0] === D.a[0][0]).length > 1, lp0 = D.a[0][1];
    const orders = D.b.map(b => b[2]), dbl = orders.filter(o => o === 2).length, tri = orders.includes(3);
    const multi = tri ? 'a triple bond' : dbl === 2 ? 'two double bonds' : dbl === 1 ? 'a double bond' : null;
    const outer0 = 2 * D.b.filter(b => b[0] === 0 || b[1] === 0).reduce((t, b) => t + b[2], 0) + 2 * lp0;
    const qs = ['which', 'shared', 'lone', 'outer'].concat(multi ? ['bond'] : []), q = r.pick(qs);
    if (q === 'which') return { title, spec: 'C1.46', kind: 'diagram', svg, q: 'Which molecule does this diagram show?', o: [f, ...others(f, Object.keys(MOLS).filter(k => k !== f), r)], x: `Count each kind of atom and the shared pairs: ${f} (${MOL_NAME[f]}).` };
    if (q === 'shared') return { title, spec: 'C1.46', kind: 'diagram', svg, q: `How many pairs of electrons are shared in ${f}?`, o: [String(shared), ...others(String(shared), ['1', '2', '3', '4', '5', '6', '8'], r)], x: `Count the electrons in the overlaps and halve: ${shared} pair${shared > 1 ? 's' : ''}.` };
    if (q === 'lone') return { title, spec: 'C1.46', kind: 'diagram', svg, q: `How many lone pairs (pairs not shared) does ${same && D.a.length === 2 ? 'each ' + c0 + ' atom' : 'the ' + c0 + ' atom'} have?`, o: [String(lp0), ...others(String(lp0), ['0', '1', '2', '3', '4'], r)], x: `Count the pairs on ${c0}'s shell that are outside the overlaps: ${lp0}.` };
    if (q === 'outer') return { title, spec: 'C1.46', kind: 'diagram', svg, q: `Counting shared electrons, how many electrons are in the outer shell of ${same ? 'each' : 'the'} ${c0} atom?`, o: [String(outer0), ...others(String(outer0), ['2', '4', '6', '7', '8', '10'], r)], x: `${outer0 === 2 ? 'Hydrogen' : c0}'s own electrons plus the ones it shares make ${outer0}: a full outer shell${outer0 === 8 ? ' (like a noble gas)' : ''}.` };
    return { title, spec: 'C1.46', kind: 'diagram', svg, q: `What kind of bonding does ${f} have?`, o: [multi, ...others(multi, ['single bonds only', 'a double bond', 'a triple bond', 'two double bonds', 'an ionic bond'], r)], x: tri ? 'Three shared pairs between the same two atoms make a triple bond.' : dbl === 2 ? 'Each oxygen shares two pairs with the carbon: two double bonds.' : 'Two shared pairs between the same two atoms make a double bond.' };
  };

  /* ---------- food webs: generated from an ecosystem's feeding links; simple chains to big webs; bottom-up or left-to-right ---------- */
  const ECOS = [
    { L: [['grass', 'oak leaves', 'clover', 'bramble'], ['rabbit', 'caterpillar', 'slug', 'aphid', 'vole', 'deer'], ['thrush', 'blue tit', 'hedgehog', 'ladybird', 'shrew', 'stoat'], ['fox', 'owl', 'sparrowhawk']],
      e: { rabbit: ['grass', 'clover'], caterpillar: ['oak leaves', 'bramble', 'clover'], slug: ['grass', 'clover', 'bramble'], aphid: ['bramble', 'oak leaves'], vole: ['grass', 'bramble'], deer: ['grass', 'oak leaves', 'bramble'],
        thrush: ['slug', 'caterpillar'], 'blue tit': ['caterpillar', 'aphid'], hedgehog: ['slug', 'caterpillar'], ladybird: ['aphid'], shrew: ['slug', 'caterpillar'], stoat: ['rabbit', 'vole'],
        fox: ['hedgehog', 'thrush', 'stoat'], owl: ['shrew', 'thrush', 'stoat'], sparrowhawk: ['blue tit', 'thrush'] } },
    { L: [['algae', 'pondweed'], ['water flea', 'pond snail', 'tadpole', 'mayfly larva'], ['water beetle', 'stickleback', 'dragonfly nymph', 'newt'], ['heron', 'pike', 'kingfisher']],
      e: { 'water flea': ['algae'], 'pond snail': ['algae', 'pondweed'], tadpole: ['algae', 'pondweed'], 'mayfly larva': ['algae'], 'water beetle': ['water flea', 'tadpole', 'mayfly larva'], stickleback: ['water flea', 'mayfly larva'], 'dragonfly nymph': ['tadpole', 'mayfly larva', 'water flea'], newt: ['tadpole', 'pond snail'], heron: ['stickleback', 'newt'], pike: ['stickleback', 'newt', 'water beetle'], kingfisher: ['stickleback', 'dragonfly nymph'] } },
    { L: [['phytoplankton', 'seaweed'], ['zooplankton', 'limpet', 'sea urchin', 'krill'], ['herring', 'crab', 'starfish', 'sand eel'], ['seal', 'puffin', 'cod']],
      e: { zooplankton: ['phytoplankton'], limpet: ['seaweed'], 'sea urchin': ['seaweed'], krill: ['phytoplankton'], herring: ['zooplankton', 'krill'], crab: ['limpet', 'sea urchin'], starfish: ['limpet'], 'sand eel': ['zooplankton'], seal: ['herring', 'crab'], puffin: ['sand eel', 'herring'], cod: ['sand eel', 'crab', 'herring'] } },
    { L: [['grass', 'acacia tree'], ['zebra', 'gazelle', 'giraffe', 'termite'], ['lion', 'cheetah', 'hyena', 'aardvark']],
      e: { zebra: ['grass'], gazelle: ['grass', 'acacia tree'], giraffe: ['acacia tree'], termite: ['grass', 'acacia tree'], lion: ['zebra', 'gazelle'], cheetah: ['gazelle'], hyena: ['zebra', 'gazelle'], aardvark: ['termite'] } }];
  const LEVEL = ['producer', 'primary consumer', 'secondary consumer', 'tertiary consumer'];
  M.foodweb = r => {
    const E = r.pick(ECOS), nL = E.L.length, size = r.hard ? r.pick(['small', 'big', 'big']) : r.pick(['chain', 'chain', 'small', 'big']);
    let lv = [];   // chosen organisms per level
    if (size === 'chain') {
      const top = Math.min(nL - 1, r.pick([2, 3, 3])); let cur = r.pick(E.L[top].filter(o => E.e[o])); const ch = [cur];
      for (let k = top; k > 0; k--) { cur = r.pick(E.e[cur].filter(f => E.L[k - 1].includes(f))); ch.unshift(cur); }
      lv = ch.map(o => [o]);
    } else {
      const want = size === 'small' ? [r.int(1, 2), r.int(1, 2), r.int(1, 2), 1] : [r.int(2, 3), r.int(3, 4), r.int(2, 3), r.int(1, 2)];
      lv[0] = sh(E.L[0], r).slice(0, want[0]);
      for (let k = 1; k < nL; k++) { const can = sh(E.L[k], r).filter(o => E.e[o].some(f => lv[k - 1].includes(f))); if (!can.length) break; lv[k] = can.slice(0, want[k]); }
      for (let k = lv.length - 2; k >= 0; k--) { const eaten = lv[k].filter(o => lv[k + 1].some(p => E.e[p].includes(o))); if (eaten.length) lv[k] = eaten; }   // every lower organism is eaten by something shown
    }
    const orgs = lv.flat(), level = {}; lv.forEach((row, k) => row.forEach(o => { level[o] = k; }));
    const edges = []; orgs.forEach(p => (E.e[p] || []).forEach(f => { if (level[f] === level[p] - 1) edges.push([f, p]); }));
    const horiz = r.f() < .3 || (size === 'chain' && r.f() < .5), n = lv.length, pos = {}, bw = o => o.length * 7.2 + 14;
    /* order each level by where its food sits (fewer crossing arrows), with a little randomness */
    const rows = [sh(lv[0], r)];
    for (let k = 1; k < n; k++) rows[k] = lv[k].map(o => { const fi = (E.e[o] || []).map(f => rows[k - 1].indexOf(f)).filter(i => i >= 0); return [o, fi.reduce((t, i) => t + i, 0) / Math.max(1, fi.length) + r.f() * .9]; }).sort((x, y) => x[1] - y[1]).map(x => x[0]);
    let W = 420, H = 260;
    if (horiz) {   /* columns left to right, each as wide as its longest name */
      const cw = rows.map(row => Math.max(...row.map(bw))), gap = Math.max(36, (W - 40 - cw.reduce((t, w) => t + w, 0)) / Math.max(1, n - 1)); W = Math.max(W, 40 + cw.reduce((t, w) => t + w, 0) + gap * (n - 1));
      let x = 20; rows.forEach((row, k) => { x += cw[k] / 2; row.forEach((o, j) => { pos[o] = [x + (row.length > 2 && j % 2 ? 8 : 0), 20 + (j + 1) / (row.length + 1) * (H - 40)]; }); x += cw[k] / 2 + gap; });
    } else {       /* rows bottom to top, boxes never overlapping */
      const rw = rows.map(row => row.reduce((t, o) => t + bw(o), 0) + 18 * (row.length - 1)); W = Math.max(W, Math.max(...rw) + 40);
      const rowH = n > 1 ? Math.max(56, 200 / (n - 1)) : 0; H = 60 + rowH * (n - 1) + 10;
      rows.forEach((row, k) => { const sumw = row.reduce((t, o) => t + bw(o), 0), sp = Math.max(18, (W - 40 - sumw) / (row.length + 1)); let x = 20 + (W - 40 - sumw - sp * (row.length - 1)) / 2;
        row.forEach((o, j) => { pos[o] = [x + bw(o) / 2, 30 + (n - 1 - k) * rowH + (row.length > 2 && j % 2 ? 14 : 0)]; x += bw(o) + sp; }); });
    }
    const clip = (o, dx, dy) => { const w = bw(o) / 2 + 3, h = 14, t = Math.min(dx ? w / Math.abs(dx) : 1e9, dy ? h / Math.abs(dy) : 1e9); return [pos[o][0] + dx * t, pos[o][1] + dy * t]; };
    let g = '';
    edges.forEach(([f, p]) => { const [x1, y1] = pos[f], [x2, y2] = pos[p], dx = x2 - x1, dy = y2 - y1, [ax, ay] = clip(f, dx, dy), [bx, by] = clip(p, -dx, -dy); g += arrow(ax, ay, bx, by, '#555', 1.6); });
    orgs.forEach(o => { const [x, y] = pos[o]; g += `<rect x="${(x - bw(o) / 2).toFixed(1)}" y="${y - 11}" width="${bw(o).toFixed(1)}" height="22" rx="11" fill="${level[o] === 0 ? '#dcfce7' : '#fff'}" stroke="${INK}"/>` + T(x.toFixed(1), y + 4, o, { size: 12, w: 600 }); });
    const svg = wrap(W, H, g), title = size === 'chain' ? 'Food chain' : 'Food web', spec = size === 'chain' ? 'B4.3' : 'B4.4';
    const tops = orgs.filter(o => !edges.some(([f]) => f === o)), nonTop = orgs.filter(o => !tops.includes(o));
    const qs = ['producer', 'primary', 'arrows', 'levels'].concat(n > 2 ? ['secondary'] : [], tops.length && nonTop.length >= 3 ? ['top'] : [], orgs.length >= 4 ? ['eats'] : []), q = r.pick(qs);
    const opts = (ans, pool, extra = []) => { const p = [...new Set(pool.filter(o => o !== ans))]; return [ans, ...others(ans, p.length >= 3 ? p : [...new Set(p.concat(sh(extra.filter(o => o !== ans && !p.includes(o)), r).slice(0, 3 - p.length)))], r)]; };   // too small a web: top up with organisms from the same habitat
    if (q === 'producer') { const p = r.pick(lv[0]); return { title, spec, kind: 'diagram', svg, q: 'Which of these is a producer?', o: opts(p, orgs.filter(o => level[o] > 0).concat(['the Sun', 'bacteria'])), x: `Producers make their own food by photosynthesis, so nothing points into them: ${lv[0].join(' and ')}.` }; }
    if (q === 'primary') { const p = r.pick(lv[1]); return { title, spec, kind: 'diagram', svg, q: 'Which of these is a primary consumer?', o: opts(p, orgs.filter(o => level[o] !== 1), E.L.flat().filter((o, k, A) => !E.L[1].includes(o))), x: `A primary consumer eats producers: the arrow into ${p} comes from ${edges.filter(e => e[1] === p).map(e => e[0]).join(' and ')}.` }; }
    if (q === 'secondary') { const p = r.pick(lv[2]); return { title, spec, kind: 'diagram', svg, q: 'Which of these is a secondary consumer?', o: opts(p, orgs.filter(o => level[o] !== 2), E.L.flat().filter(o => !E.L[2].includes(o))), x: `A secondary consumer eats primary consumers: ${p} eats ${edges.filter(e => e[1] === p).map(e => e[0]).join(' and ')}.` }; }
    if (q === 'top') { const p = r.pick(tops); return { title, spec, kind: 'diagram', svg, q: 'Which of these is a top predator (nothing in the web eats it)?', o: opts(p, nonTop, E.L.slice(0, -1).flat()), x: `No arrows leave ${p}: nothing in this ${size === 'chain' ? 'chain' : 'web'} eats it.` }; }
    if (q === 'eats') { const p = r.pick(orgs.filter(o => level[o] > 0)), food = r.pick(edges.filter(e => e[1] === p).map(e => e[0])); return { title, spec, kind: 'diagram', svg, q: `Which of these does the ${p} eat?`, o: opts(food, orgs.filter(o => o !== p && !edges.some(e => e[1] === p && e[0] === o)), E.L.flat().filter(o => o !== p && !(E.e[p] || []).includes(o))), x: `Arrows point from the food to the eater. The arrow${edges.filter(e => e[1] === p).length > 1 ? 's' : ''} into ${p} come${edges.filter(e => e[1] === p).length > 1 ? '' : 's'} from ${edges.filter(e => e[1] === p).map(e => e[0]).join(' and ')}.` }; }
    if (q === 'levels') return { title, spec, kind: 'diagram', svg, q: `How many trophic levels are there in this ${size === 'chain' ? 'food chain' : 'food web'}?`, o: [String(n), ...others(String(n), [...new Set(['2', '3', '4', '5', String(orgs.length)])], r)], x: `Producers, then ${LEVEL.slice(1, n).join(', ')}: ${n} levels.` };
    return { title, spec, kind: 'diagram', svg, q: `What do the arrows in a ${size === 'chain' ? 'food chain' : 'food web'} show?`, o: ['The direction energy is transferred', 'Which animal eats the arrow\'s target', 'The direction animals move', 'Where waste goes'], x: 'Arrows point from the food to the feeder: the direction biomass and energy are transferred.' };
  };

  /* =================== round 7 (18 Nov evening): second set of diagrams, Double Award only =================== */
  /* letters on parts: leader lines out to the left and right margins, lettered top to bottom so lines don't cross */
  function letterParts(parts, keys, W, top, bot, opt = {}) {
    const mid = opt.mid ?? W / 2, lx = opt.lx ?? 14, rx = opt.rx ?? W - 14, by = k => parts[k][1];
    const left = keys.filter(k => parts[k][0] < mid).sort((a, b) => by(a) - by(b)), right = keys.filter(k => parts[k][0] >= mid).sort((a, b) => by(a) - by(b));
    let g = '', li = 0; const letter = {};
    [[left, lx, 1], [right, rx, -1]].forEach(([ks, x0, d]) => ks.forEach((k, i) => { const L = 'ABCDEFGH'[li++]; letter[k] = L; const ly = top + (i + .5) * (bot - top) / ks.length, [x, y] = parts[k];
      g += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x0 + d * 13}" y2="${ly.toFixed(1)}" stroke="${INK}" stroke-width="1.2"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.5" fill="${INK}"/>` + T(x0, ly + 6, L, { size: 16, w: 700 }); }));
    return { g, letter };
  }
  /* the usual three questions on a labelled diagram: name the part, find the letter, or what it does */
  function partQ(r, title, spec, svg, letter, keys, NAME, FN) {
    const k = r.pick(keys), L = letter[k], q = r.int(0, FN && FN[k] ? 2 : 1), nm = NAME[k];
    if (q === 0) return { title, spec, kind: 'diagram', svg, q: `What is part ${L}?`, o: [nm, ...others(nm, [...new Set(Object.values(NAME))], r)], x: `${L} is the ${nm}${FN && FN[k] ? ': ' + FN[k][0].toLowerCase() + FN[k].slice(1) : ''}.` };
    if (q === 1) return { title, spec, kind: 'diagram', svg, q: `Which letter labels the ${nm}?`, o: [L, ...others(L, keys.map(x => letter[x]), r)], x: `The ${nm} is ${L}.` };
    return { title, spec, kind: 'diagram', svg, q: `What does part ${L} do?`, o: [FN[k], ...others(FN[k], [...new Set(Object.values(FN))], r)], x: `${L} is the ${nm}.` };
  }
  /* a line graph that can go below zero */
  function plot2({ xmin = 0, xmax, xstep, ymin = 0, ymax, ystep, xl, yl, series = [], marks = [], w = 400, h = 260, extra }) {
    const L = 58, R = 16, Tp = 14, B = 42, px = x => L + (x - xmin) / (xmax - xmin) * (w - L - R), py = y => h - B - (y - ymin) / (ymax - ymin) * (h - Tp - B);
    let g = '';
    for (let k = 0; xmin + k * xstep / 2 <= xmax + 1e-9; k++) { const x = xmin + k * xstep / 2; g += `<line x1="${px(x)}" y1="${py(ymin)}" x2="${px(x)}" y2="${py(ymax)}" stroke="${GRID}" stroke-width="${k % 2 ? .5 : 1}"/>` + (k % 2 ? '' : T(px(x), py(ymin) + 15, n(x), { size: 11 })); }
    for (let k = 0; ymin + k * ystep / 2 <= ymax + 1e-9; k++) { const y = ymin + k * ystep / 2; g += `<line x1="${px(xmin)}" y1="${py(y)}" x2="${px(xmax)}" y2="${py(y)}" stroke="${GRID}" stroke-width="${k % 2 ? .5 : 1}"/>` + (k % 2 ? '' : T(px(xmin) - 6, py(y) + 4, n(y), { size: 11, a: 'end' })); }
    const y0 = ymin < 0 && ymax > 0 ? 0 : ymin;
    g += `<line x1="${px(xmin)}" y1="${py(y0)}" x2="${px(xmax)}" y2="${py(y0)}" stroke="${INK}" stroke-width="1.6"/><line x1="${px(xmin)}" y1="${py(ymin)}" x2="${px(xmin)}" y2="${py(ymax)}" stroke="${INK}" stroke-width="1.6"/>`;
    g += T((px(xmin) + px(xmax)) / 2, h - 8, xl, { size: 12, w: 600 }) + T(14, (py(ymin) + py(ymax)) / 2, yl, { size: 12, w: 600, rot: -90 });
    series.forEach(s => { if (s.pts.length > 1 && !s.dotsOnly) g += `<polyline points="${s.pts.map(([x, y]) => px(x).toFixed(1) + ',' + py(y).toFixed(1)).join(' ')}" fill="none" stroke="${s.col || INK}" stroke-width="2.2"${s.dash ? ' stroke-dasharray="6 4"' : ''}/>`;
      if (s.dots) s.dots.forEach(([x, y]) => { g += `<path d="M${px(x) - 4} ${py(y) - 4}l8 8M${px(x) + 4} ${py(y) - 4}l-8 8" stroke="${s.col || INK}" stroke-width="1.8"/>`; });
      if (s.label) { const [x, y] = s.pts[s.lab ?? s.pts.length - 1]; g += T(px(x) + (s.dx || 6), py(y) - 7, s.label, { size: 13, w: 700, a: 'start', fill: s.col || INK }); } });
    marks.forEach(([x, y, lab]) => { g += `<circle cx="${px(x)}" cy="${py(y)}" r="3.5" fill="${INK}"/>` + T(px(x) + 8, py(y) - 8, lab, { size: 13, w: 700, a: 'start' }); });
    if (extra) g += extra(px, py);
    return wrap(w, h, g);
  }

  /* ---------- particle diagrams: states of matter, or element / compound / mixture (C1.1, C1.8) ---------- */
  M.particles = r => {
    const box = (x, y, inner) => `<rect x="${x}" y="${y}" width="110" height="110" fill="#fff" stroke="${INK}" stroke-width="1.6"/>${inner}`;
    const ball = (x, y, c, rad = 8) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad}" fill="${c}" stroke="${INK}"/>`;
    const L = ['A', 'B', 'C', 'D'];
    if (r.f() < .45) {   /* states */
      const order = sh(['solid', 'liquid', 'gas'], r), col = r.pick(['#93c5fd', '#fca5a5', '#86efac', '#fde68a']); let g = '';
      order.forEach((st, k) => { const x0 = 15 + k * 130, y0 = 15; let inner = '';
        if (st === 'solid') for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) inner += ball(x0 + 19 + j * 18, y0 + 19 + i * 18, col);
        else if (st === 'liquid') { const pts = []; for (let t = 0; pts.length < 18 && t < 3000; t++) { const p = [x0 + 12 + r.f() * 86, y0 + 50 + r.f() * 48]; if (pts.every(q => Math.hypot(q[0] - p[0], q[1] - p[1]) > 16.5 && Math.hypot(q[0] - p[0], q[1] - p[1]) < 60)) pts.push(p); } pts.forEach(p => { inner += ball(p[0], p[1], col); }); }
        else { const pts = []; for (let t = 0; pts.length < 6 && t < 3000; t++) { const p = [x0 + 12 + r.f() * 86, y0 + 12 + r.f() * 86]; if (pts.every(q => Math.hypot(q[0] - p[0], q[1] - p[1]) > 34)) pts.push(p); } pts.forEach(p => { inner += ball(p[0], p[1], col); }); }
        g += box(x0, y0, inner) + T(x0 + 55, y0 + 132, L[k], { size: 15, w: 700 }); });
      const svg = wrap(405, 160, g), want = r.pick(['solid', 'liquid', 'gas']), ans = L[order.indexOf(want)], title = 'Particle diagrams: states';
      if (r.int(0, 1)) return { title, spec: 'C1.1', kind: 'diagram', svg, q: `Which box shows a ${want}?`, o: [ans, ...L.slice(0, 3).filter(x => x !== ans)], x: { solid: 'A solid: particles touching in a regular pattern, vibrating in fixed positions.', liquid: 'A liquid: particles touching but arranged randomly, able to move past each other.', gas: 'A gas: particles far apart, moving quickly in all directions.' }[want] };
      const from = r.pick(['solid', 'liquid']), to = from === 'solid' ? 'liquid' : 'gas', name = from === 'solid' ? 'melting' : 'boiling (or evaporating)';
      return { title, spec: 'C1.2', kind: 'diagram', svg, q: `What is the change from box ${L[order.indexOf(from)]} to box ${L[order.indexOf(to)]} called?`, o: [name, ...others(name, ['melting', 'boiling (or evaporating)', 'freezing', 'condensing', 'subliming'], r)], x: `${from} → ${to} is ${name}: the particles gain energy and move further apart / more freely.` };
    }
    /* element / compound / mixture: four boxes of different kinds */
    const C1 = '#60a5fa', C2 = '#f87171', C3 = '#374151';
    const KINDS = { atoms: 'an element made of single atoms', diatomic: 'an element made of molecules', compound: 'a compound', mixEl: 'a mixture of two elements', mixElCpd: 'a mixture of an element and a compound', mixCpd: 'a mixture of two compounds' };
    const fill = (x0, y0, kind) => { const units = []; const n0 = kind === 'atoms' ? 9 : 6;
      for (let i = 0; i < n0; i++) units.push(kind === 'atoms' ? [[C1]] : kind === 'diatomic' ? [[C2, C2]] : kind === 'compound' ? [[C1, C3, C1]] : kind === 'mixEl' ? (i % 2 ? [[C1]] : [[C2, C2]]) : kind === 'mixElCpd' ? (i % 2 ? [[C2, C2]] : [[C1, C3]]) : (i % 2 ? [[C1, C3]] : [[C2, C2, C3]]));
      const pts = []; for (let t = 0; pts.length < units.length && t < 4000; t++) { const p = [x0 + 22 + r.f() * 66, y0 + 16 + r.f() * 78]; if (pts.every(q => Math.hypot(q[0] - p[0], q[1] - p[1]) > 27)) pts.push(p); }
      let s = ''; units.forEach((u, i) => { if (!pts[i]) return; const at0 = u[0], ang = r.f() * Math.PI, step = 12; at0.forEach((c, j) => { const off = (j - (at0.length - 1) / 2) * step; s += ball(pts[i][0] + Math.cos(ang) * off, pts[i][1] + Math.sin(ang) * off, c, 7.5); }); });
      return s; };
    const kinds = sh(Object.keys(KINDS), r).slice(0, 4); let g = '';
    kinds.forEach((k, i) => { const x0 = 15 + i * 125, y0 = 15; g += box(x0, y0, fill(x0, y0, k)) + T(x0 + 55, y0 + 132, L[i], { size: 15, w: 700 }); });
    const svg = wrap(520, 160, g), k = r.pick(kinds), ans = L[kinds.indexOf(k)];
    return { title: 'Particle diagrams: elements, compounds, mixtures', spec: 'C1.8', kind: 'diagram', svg, q: `Each colour is a different kind of atom. Which box shows ${KINDS[k]}?`, o: [ans, ...L.filter(x => x !== ans)], x: { atoms: 'One kind of atom, not joined: an element.', diatomic: 'One kind of atom, joined in pairs: an element made of molecules.', compound: 'Every particle is the same, made of different atoms chemically joined: a compound.', mixEl: 'Two different elements, not joined to each other: a mixture.', mixElCpd: 'An element and a compound mixed but not joined: a mixture.', mixCpd: 'Two different compounds mixed together: a mixture.' }[k] };
  };

  /* ---------- separating mixtures: filtration, simple and fractional distillation, crystallisation (C1.10) ---------- */
  function flask(x, y, rad) { return `<path d="M${x - 9} ${y - rad - 26}v24A${rad} ${rad} 0 1 0 ${x + 9} ${y - rad - 2}v-24" fill="#fff" stroke="${INK}" stroke-width="1.8"/><path d="M${x - rad * .93} ${y + 6}A${rad} ${rad} 0 0 0 ${x + rad * .93} ${y + 6}Z" fill="#bfdbfe" opacity=".8"/>`; }
  function bunsen(x, y) { return `<path d="M${x - 16} ${y}h32l-4 -8h-24z" fill="#9ca3af" stroke="${INK}"/><rect x="${x - 5}" y="${y - 44}" width="10" height="36" fill="#d1d5db" stroke="${INK}"/><path d="M${x} ${y - 66}q-9 12 0 22q9 -10 0 -22z" fill="#60a5fa" stroke="#1d4ed8"/>`; }
  function tripod(x, y, w = 70) { return `<path d="M${x - w / 2} ${y}h${w}M${x - w / 2 + 6} ${y}l-8 56M${x + w / 2 - 6} ${y}l8 56M${x} ${y}v56" stroke="${INK}" stroke-width="2"/><path d="M${x - w / 2 - 4} ${y - 3}h${w + 8}" stroke="#888" stroke-width="3" stroke-dasharray="3 2"/>`; }
  M.separation = r => {
    const kind = r.pick(['filtration', 'simple distillation', 'fractional distillation', 'crystallisation']);
    let g = '', parts = {}, NAME = {}, FN = {}, W = 440, H = 300;
    if (kind === 'filtration') {
      g += `<path d="M150 60h100l-40 60v40h-20v-40z" fill="#fff" stroke="${INK}" stroke-width="1.8"/><path d="M160 66h80l-40 54z" fill="none" stroke="#888" stroke-dasharray="4 3"/><path d="M178 92q22 10 44 0l-22 28z" fill="#a16207" opacity=".7"/>`
        + `<path d="M170 190h60v10l30 70h-120l30 -70z" fill="#fff" stroke="${INK}" stroke-width="1.8"/><path d="M146 252h108l8 18h-124z" fill="#bfdbfe"/><path d="M200 165v60" stroke="#60a5fa" stroke-width="2" stroke-dasharray="3 4"/>`;
      parts = { funnel: [244, 70], paper: [168, 72], residue: [200, 100], filtrate: [205, 262], flask: [244, 240] };
      NAME = { funnel: 'filter funnel', paper: 'filter paper', residue: 'residue', filtrate: 'filtrate', flask: 'conical flask' };
      FN = { paper: 'Lets the liquid through but traps the insoluble solid', residue: 'The insoluble solid left behind', filtrate: 'The liquid (or solution) that passes through' };
    } else if (kind === 'crystallisation') {
      g += `<path d="M150 120q50 50 100 0z" fill="#fff" stroke="${INK}" stroke-width="1.8"/><path d="M160 128q40 32 80 0z" fill="#bfdbfe"/><path d="M188 131l4 -5 4 5zM205 133l4 -6 4 6z" fill="#3b82f6"/>` + tripod(200, 150) + bunsen(200, 270) + `<path d="M178 104q4 -10 -2 -20M200 100q4 -10 -2 -20M222 104q4 -10 -2 -20" fill="none" stroke="#9ca3af" stroke-width="1.5"/>`;
      parts = { basin: [242, 124], solution: [215, 134], gauze: [158, 148], tripod: [240, 190], bunsen: [205, 238], steam: [221, 88] };
      NAME = { basin: 'evaporating basin', solution: 'solution', gauze: 'gauze', tripod: 'tripod', bunsen: 'Bunsen burner', steam: 'water vapour' };
      FN = { basin: 'Holds the solution while water evaporates', bunsen: 'Heats the solution to evaporate some of the water', steam: 'Water leaving as the solution is heated' };
    } else {
      const frac = kind === 'fractional distillation', fx = 110, fy = 200, topY = frac ? 70 : 125;
      g += flask(fx, fy, 38) + `<path d="M${fx - 9} ${fy - 64}V${topY}h18V${fy - 64}" fill="#fff" stroke="${INK}" stroke-width="1.8"/>`;
      if (frac) for (let i = 0; i < 9; i++) g += `<circle cx="${fx - 4 + (i % 2) * 8}" cy="${topY + 20 + i * 7}" r="3" fill="#e5e7eb" stroke="#888"/>`;
      g += `<path d="M${fx} ${topY - 30}v52" stroke="#dc2626" stroke-width="2"/><rect x="${fx - 3}" y="${topY - 34}" width="6" height="8" fill="#fff" stroke="${INK}"/>`;   // thermometer
      const sx = fx + 9, sy = topY + 8, ex = sx + 210, ey = sy + 90;   // side arm → condenser
      const ang = Math.atan2(ey - sy, ex - sx), px = -Math.sin(ang) * 14, py = Math.cos(ang) * 14;
      g += `<path d="M${sx} ${sy - 4}L${ex} ${ey - 4}M${sx} ${sy + 4}L${ex} ${ey + 4}" stroke="${INK}" stroke-width="1.8"/>`;
      const c0 = .25, c1 = .8, P = t => [sx + (ex - sx) * t, sy + (ey - sy) * t];
      const [a0, b0] = P(c0), [a1, b1] = P(c1);
      g += `<path d="M${a0 + px} ${b0 + py}L${a1 + px} ${b1 + py}L${a1 - px} ${b1 - py}L${a0 - px} ${b0 - py}Z" fill="#dbeafe" stroke="${INK}" stroke-width="1.8" fill-opacity=".7"/>`;
      g += `<path d="M${a1 + px} ${b1 + py}v18M${a0 - px} ${b0 - py}v-18" stroke="${INK}" stroke-width="5"/><path d="M${a1 + px} ${b1 + py}v18M${a0 - px} ${b0 - py}v-18" stroke="#fff" stroke-width="2"/>`;
      g += `<path d="M${ex - 26} ${ey + 14}h52v48h-52z" fill="#fff" stroke="${INK}" stroke-width="1.8"/><rect x="${ex - 24}" y="${ey + 44}" width="48" height="17" fill="#bfdbfe"/>`;
      g += tripod(fx, fy + 42, 80) + bunsen(fx, fy + 160);
      const win = [a1 + px, b1 + py + 18], wout = [a0 - px, b0 - py - 18];
      parts = { flask: [fx + 30, fy + 10], thermo: [fx + 2, topY - 26], condenser: [(a0 + a1) / 2 + px * .4, (b0 + b1) / 2 + py * .4], distillate: [ex + 10, ey + 52], bunsen: [fx + 4, fy + 120], win: win, wout: wout };
      if (frac) parts.column = [fx + 9, topY + 40];
      NAME = { flask: 'round-bottomed flask', thermo: 'thermometer', condenser: 'condenser', distillate: 'distillate', bunsen: 'Bunsen burner', win: 'cold water in', wout: 'water out', column: 'fractionating column' };
      FN = { thermo: 'Measures the temperature of the vapour going into the condenser', condenser: 'Cools the vapour so it condenses back to a liquid', distillate: 'The liquid collected after condensing', column: 'Separates liquids with different boiling points', bunsen: 'Heats the mixture so the liquid boils' };
      W = 460; H = 380;
    }
    let keys = sh(Object.keys(parts), r).slice(0, 4);
    if (kind.includes('distillation') && r.f() < .5) keys = sh(['win', 'wout', ...keys.filter(k => k !== 'win' && k !== 'wout')].slice(0, 4), r);
    const { g: lg, letter } = letterParts(parts, keys, W, 30, H - 20, { mid: kind.includes('distillation') ? 150 : W / 2 });
    const svg = wrap(W, H, g + lg), title = 'Separating mixtures';
    if (keys.includes('win') && keys.includes('wout') && r.f() < .6) return { title, spec: 'C1.10', kind: 'diagram', svg, q: 'Where should the cold water go into the condenser?', o: [letter.win, letter.wout, 'Either: it makes no difference', 'Through the top of the flask'], x: `Water goes in at the bottom (${letter.win}) and out at the top, so the condenser jacket stays completely full of cold water.` };
    if (r.f() < .35) { const t = kind; return { title, spec: 'C1.10', kind: 'diagram', svg, q: 'Which separation technique does this apparatus show?', o: [t, ...others(t, ['filtration', 'simple distillation', 'fractional distillation', 'crystallisation', 'paper chromatography'], r)], x: { filtration: 'A funnel and filter paper: filtration separates an insoluble solid from a liquid.', crystallisation: 'Heating a solution in an evaporating basin to drive off water: crystallisation.', 'simple distillation': 'Boil, then condense the vapour: simple distillation separates a liquid from a solution.', 'fractional distillation': 'A fractionating column between the flask and condenser: fractional distillation separates liquids with different boiling points.' }[t] }; }
    return partQ(r, title, 'C1.10', svg, letter, keys, NAME, FN);
  };

  /* ---------- displacement results table → reactivity order (C2.16) ---------- */
  M.displace = r => {
    const names = r.pick([['W', 'X', 'Y', 'Z'], ['P', 'Q', 'R', 'S'], ['magnesium', 'zinc', 'iron', 'copper'], ['zinc', 'iron', 'copper', 'silver']]), real = names[0].length > 1;
    const order = real ? names.slice() : sh(names, r);   // most reactive first
    const salt = m => real ? { magnesium: 'magnesium sulfate', zinc: 'zinc sulfate', iron: 'iron(II) sulfate', copper: 'copper(II) sulfate', silver: 'silver nitrate' }[m] : `${m} nitrate`;
    const cols = sh(names, r), rows = sh(names, r);
    let g = ''; const cw = 92, x0 = 108, y0 = 10, rh = 30;
    g += `<rect x="${x0 - 98}" y="${y0}" width="98" height="${rh * 1.4}" fill="#eeeae0" stroke="${INK}"/>` + T(x0 - 49, y0 + 18, 'metal ↓', { size: 10 }) + T(x0 - 49, y0 + 33, 'solution →', { size: 10 });
    cols.forEach((c, j) => { g += `<rect x="${x0 + j * cw}" y="${y0}" width="${cw}" height="${rh * 1.4}" fill="#eeeae0" stroke="${INK}"/>` + T(x0 + j * cw + cw / 2, y0 + 18, salt(c).split(' ').slice(0, -1).join(' '), { size: 11, w: 700 }) + T(x0 + j * cw + cw / 2, y0 + 33, salt(c).split(' ').slice(-1)[0], { size: 10 }); });
    rows.forEach((m, i) => { const y = y0 + rh * 1.4 + i * rh; g += `<rect x="${x0 - 98}" y="${y}" width="98" height="${rh}" fill="#eeeae0" stroke="${INK}"/>` + T(x0 - 49, y + 20, m, { size: 12, w: 700 });
      cols.forEach((c, j) => { const v = m === c ? '—' : order.indexOf(m) < order.indexOf(c) ? '✓' : '✗'; g += `<rect x="${x0 + j * cw}" y="${y}" width="${cw}" height="${rh}" fill="#fff" stroke="${INK}"/>` + T(x0 + j * cw + cw / 2, y + 21, v, { size: 16, w: 700, fill: v === '✓' ? '#16a34a' : v === '✗' ? '#dc2626' : '#888' }); }); });
    const svg = wrap(x0 + 4 * cw + 10, y0 + rh * 1.4 + 4 * rh + 22, g + T(x0 - 96, y0 + rh * 5.4 + 16, '✓ = reaction (the metal displaces the other metal)    ✗ = no reaction', { size: 10, a: 'start' })), title = 'Displacement reactions';
    const ord = order.join(', '), q = r.int(0, 2);
    if (q === 0) { const wrong = [order.slice().reverse().join(', '), [order[1], order[0], order[2], order[3]].join(', '), [order[0], order[2], order[1], order[3]].join(', '), [order[0], order[1], order[3], order[2]].join(', ')]; return { title, spec: 'C2.16', kind: 'table', svg, q: 'What is the order of reactivity, most reactive first?', o: [ord, ...others(ord, wrong, r)], x: `A metal displaces any metal less reactive than itself. ${order[0]} reacts with all three other solutions, ${order[3]} with none: ${ord}.` }; }
    if (q === 1) return { title, spec: 'C2.16', kind: 'table', svg, q: 'Which metal is the least reactive?', o: [order[3], ...order.slice(0, 3)], x: `${order[3]} doesn't displace any of the others (all ✗).` };
    const a = r.int(0, 2), b = r.int(a + 1, 3); return { title, spec: 'C2.16', kind: 'table', svg, q: `Will ${order[b]} react with a solution of ${salt(order[a])}?`, o: [`No: ${order[b]} is less reactive than ${order[a]}`, `Yes: ${order[b]} is more reactive than ${order[a]}`, 'Yes: all metals react with salt solutions', `Only if it is heated`], x: `Look along the ${order[b]} row: the ${salt(order[a])} column is ✗. A less reactive metal can't displace a more reactive one.` };
  };

  /* ---------- gas syringes: percentage of oxygen in air (C2.10, C2.14) ---------- */
  function syringe(x, y, vol, max, step) {   // horizontal gas syringe; plunger at vol on a scale 0…max
    const len = 220, px = v => x + v / max * len; let s = `<rect x="${x}" y="${y}" width="${len + 10}" height="30" fill="#f8fafc" stroke="${INK}" stroke-width="1.6"/><rect x="${x}" y="${y + 3}" width="${px(vol) - x}" height="24" fill="#e0f2fe"/>`;
    const labEvery = [10, 20, 25, 50].find(L => max / L <= 6 && Math.abs(L / step - Math.round(L / step)) < 1e-9) || 50;
    for (let k = 0; k * step <= max + 1e-9; k++) { const v = k * step, lab = Math.abs(v / labEvery - Math.round(v / labEvery)) < 1e-9, mid = k % 5 === 0; s += `<line x1="${px(v)}" y1="${y}" x2="${px(v)}" y2="${y + (lab ? 12 : mid ? 9 : 6)}" stroke="${INK}"/>` + (lab ? T(px(v), y - 4, n(v), { size: 11 }) : ''); }
    s += `<rect x="${px(vol) - 3}" y="${y + 2}" width="6" height="26" fill="#475569"/><rect x="${px(vol)}" y="${y + 12}" width="${x + len + 40 - px(vol)}" height="6" fill="#94a3b8"/><rect x="${x + len + 40}" y="${y + 2}" width="8" height="26" fill="#475569"/>`;
    return s;
  }
  M.airO2 = r => {
    const max = r.pick([100, 100, 120, 150]), step = max === 150 ? 5 : r.pick([2, 5]), start = r.pick([80, 90, 100].filter(v => v < max)), pct = r.pick([20, 21]), end = Math.round(start * (100 - pct) / 100 / step) * step, used = start - end, p = used / start * 100;
    let g = T(10, 26, 'Before heating the copper:', { size: 12, w: 700, a: 'start' }) + syringe(30, 46, start, max, step) + T(10, 118, 'After heating, cooled to room temperature:', { size: 12, w: 700, a: 'start' }) + syringe(30, 138, end, max, step) + T(310, 200, 'volume of air (cm³)', { size: 11, a: 'end' });
    const svg = wrap(320, 210, g), title = 'Oxygen in the air';
    return r.int(0, 1) ? { title, spec: 'C2.14', kind: 'diagram', svg, q: 'Air was passed over hot copper until the volume stopped changing. What percentage of the air was oxygen?', o: [n(p) + '%', ...uniq(n(p), [used, end / start * 100, used / end * 100, 100 - p].map(n)).map(v => v + '%')], x: `Oxygen used = ${start} − ${end} = ${used} cm³. ${used} ÷ ${start} × 100 = ${n(p)}%.` }
      : { title, spec: 'C2.14', kind: 'diagram', svg, q: 'What volume of oxygen reacted with the copper?', o: [used + ' cm³', ...uniq(used, [end, start, start + end, used + step]).map(v => v + ' cm³')], x: `Read both syringes: ${start} cm³ − ${end} cm³ = ${used} cm³ of oxygen used up.` };
  };

  /* ---------- thermometers and calorimetry (C3.2, C3.3) ---------- */
  function thermo(x, y, val, lo, hi, step, label) {   // vertical liquid thermometer, scale lo…hi, minor ticks every step
    const h = 200, py = v => y + h - (v - lo) / (hi - lo) * h; let s = `<rect x="${x - 7}" y="${y - 8}" width="14" height="${h + 16}" rx="7" fill="#fff" stroke="${INK}" stroke-width="1.6"/><circle cx="${x}" cy="${y + h + 18}" r="12" fill="#dc2626" stroke="${INK}" stroke-width="1.6"/><rect x="${x - 2.5}" y="${py(val)}" width="5" height="${y + h + 10 - py(val)}" fill="#dc2626"/>`;
    for (let k = 0; lo + k * step <= hi + 1e-9; k++) { const v = lo + k * step, big = k % 5 === 0; s += `<line x1="${x + 7}" y1="${py(v).toFixed(1)}" x2="${x + (big ? 17 : 12)}" y2="${py(v).toFixed(1)}" stroke="${INK}"/>` + (big ? T(x + 20, py(v) + 4, n(v), { size: 10, a: 'start' }) : ''); }
    return s + (label ? T(x, y - 16, label, { size: 12, w: 700 }) : '');
  }
  M.calorim = r => {
    const step = r.pick([0.5, 1, 2]), lo = r.pick([10, 15, 20]), hi = lo + step * 25, t0 = lo + step * r.int(3, 8), dir = r.f() < .7 ? 1 : -1, dT = step * r.int(4, 14) * dir, t1 = Math.min(hi, Math.max(lo, t0 + dT)), d = t1 - t0, m = r.pick([25, 50, 100]), c = 4.2;
    const g = thermo(90, 40, t0, lo, hi, step, 'start') + thermo(240, 40, t1, lo, hi, step, dir > 0 ? 'highest' : 'lowest') + T(170, 296, '°C', { size: 12 });
    const svg = wrap(340, 305, g), Q = m * c * Math.abs(d), title = 'Calorimetry', what = r.pick(['two solutions were mixed', 'a solid dissolved in the water', 'the acid was neutralised']), q = r.int(0, 2);
    if (q === 0) return { title, spec: 'C3.2', kind: 'diagram', svg, q: `The thermometers show the temperature before and after ${what}. What was the temperature change?`, o: [(d > 0 ? '+' : '−') + n(Math.abs(d)) + ' °C', ...uniq(n(Math.abs(d)), [Math.abs(d) + step, Math.abs(d) - step, t1, Math.abs(d) * 2].map(n)).map(v => (d > 0 ? '+' : '−') + v + ' °C')], x: `${n(t1)} − ${n(t0)} = ${d > 0 ? '+' : '−'}${n(Math.abs(d))} °C. Each small division is ${step} °C.` };
    if (q === 1) return { title, spec: 'C3.1', kind: 'diagram', svg, q: `Was the change exothermic or endothermic?`, o: [d > 0 ? 'Exothermic: the temperature went up' : 'Endothermic: the temperature went down', d > 0 ? 'Endothermic: the temperature went up' : 'Exothermic: the temperature went down', 'Neither: no energy was transferred', 'You can\'t tell from temperatures'], x: d > 0 ? 'Heat energy was given out to the water, so it got warmer: exothermic.' : 'Heat energy was taken in from the water, so it got colder: endothermic.' };
    return { title, spec: 'C3.3', kind: 'diagram', svg, q: `${m} g of water was used (c = 4.2 J/g °C). How much heat energy was transferred?`, o: [n(Q) + ' J', ...uniq(n(Q), [m * Math.abs(d), Q / 1000, m * c * t1, Q * 2].map(n)).map(v => v + ' J')], x: `Q = mcΔT = ${m} × 4.2 × ${n(Math.abs(d))} = ${n(Q)} J.` };
  };

  /* ---------- fractional distillation of crude oil (C4.8, C4.9) ---------- */
  M.fraccol = r => {
    const F = [['refinery gases', 'bottled gas for heating and cooking'], ['gasoline', 'fuel for cars'], ['kerosene', 'fuel for aircraft'], ['diesel', 'fuel for some cars and trains'], ['fuel oil', 'fuel for ships and power stations'], ['bitumen', 'surfacing roads and roofs']];
    const x = 170, top = 30, bot = 300; let g = `<path d="M${x - 40} ${bot}V${top + 20}q40 -30 80 0V${bot}z" fill="#f1f5f9" stroke="${INK}" stroke-width="2"/>`;
    const ys = F.map((_, i) => top + 18 + i * (bot - top - 30) / 5);
    ys.forEach((y, i) => { g += `<path d="M${x + 40} ${y}h70" stroke="${INK}" stroke-width="6"/><path d="M${x + 40} ${y}h70" stroke="#fff" stroke-width="3"/>` + arrowHead(x + 122, y, 0, INK, 9); if (i > 0 && i < 6) g += `<path d="M${x - 40} ${y - 14}h80" stroke="#94a3b8" stroke-dasharray="4 3"/>`; });
    g += `<path d="M20 ${bot - 22}h${x - 60}" stroke="${INK}" stroke-width="7"/><path d="M20 ${bot - 22}h${x - 60}" stroke="#fde68a" stroke-width="4"/>` + T(22, bot - 32, 'crude oil vapour', { size: 11, a: 'start' }) + `<rect x="25" y="${bot - 12}" width="80" height="22" fill="#fca5a5" stroke="${INK}"/>` + T(65, bot + 3, 'heater', { size: 11 });
    const showT = r.f() < .5; if (showT) g += T(x - 46, top + 30, '25 °C', { size: 11, a: 'end' }) + T(x - 46, bot - 62, '350 °C', { size: 11, a: 'end' });
    const L = ['A', 'B', 'C', 'D', 'E', 'F']; ys.forEach((y, i) => { g += T(x + 136, y + 5, L[i], { size: 15, w: 700, a: 'start' }); });
    const svg = wrap(340, 320, g), title = 'Fractional distillation of crude oil', i = r.int(0, 5), q = r.int(0, 3);
    if (q === 0) return { title, spec: 'C4.9', kind: 'diagram', svg, q: `Which fraction is collected at ${L[i]}?`, o: [F[i][0], ...others(F[i][0], F.map(f => f[0]), r)], x: `From the top: refinery gases, gasoline, kerosene, diesel, fuel oil, bitumen. ${L[i]} is ${F[i][0]}.` };
    if (q === 1) return { title, spec: 'C4.9', kind: 'diagram', svg, q: `What is the fraction collected at ${L[i]} used for?`, o: [F[i][1], ...others(F[i][1], F.map(f => f[1]), r)], x: `${L[i]} is ${F[i][0]}: ${F[i][1]}.` };
    if (q === 2) return { title, spec: 'C4.8', kind: 'diagram', svg, q: 'Which fraction has the highest boiling point?', o: ['F', 'A', 'C', 'D'], x: 'The column is hottest at the bottom. Fractions with the biggest molecules and highest boiling points condense low down and leave at the bottom (F, bitumen).' };
    return { title, spec: 'C4.8', kind: 'diagram', svg, q: 'Why do different fractions leave the column at different heights?', o: ['They have different boiling points, and the column is cooler higher up', 'Heavier molecules float to the top', 'Each fraction is made by a different reaction', 'The column is hottest at the top'], x: 'Vapour rises and cools. Each fraction condenses where the temperature drops below its boiling point.' };
  };

  /* ---------- pH and universal indicator (C2.29, C2.30) ---------- */
  const UI = ['#dc2626', '#ef4444', '#f97316', '#fb923c', '#fbbf24', '#facc15', '#d9f99d', '#4ade80', '#22c55e', '#14b8a6', '#3b82f6', '#2563eb', '#4f46e5', '#6d28d9', '#7c3aed'];
  const pHclass = p => p <= 3 ? 'strongly acidic' : p <= 6 ? 'weakly acidic' : p === 7 ? 'neutral' : p <= 10 ? 'weakly alkaline' : 'strongly alkaline';
  M.ph = r => {
    let g = ''; for (let p = 0; p <= 14; p++) g += `<rect x="${20 + p * 26}" y="20" width="26" height="30" fill="${UI[p]}" stroke="${INK}" stroke-width=".8"/>` + T(33 + p * 26, 66, p, { size: 11 });
    g += T(20, 84, 'pH', { size: 11, a: 'start' });
    const sols = sh([1, 2, 4, 5, 7, 9, 10, 12, 13, 14, 3, 6, 8, 11], r).slice(0, 4).sort((a, b) => a - b), tubes = sh(sols, r), L = ['A', 'B', 'C', 'D'];
    tubes.forEach((p, i) => { const x = 60 + i * 85; g += `<path d="M${x - 14} 100v90a14 14 0 0 0 28 0v-90" fill="#fff" stroke="${INK}" stroke-width="1.6"/><path d="M${x - 12} 140v50a12 12 0 0 0 24 0v-50z" fill="${UI[p]}"/>` + T(x, 228, L[i], { size: 15, w: 700 }); });
    const svg = wrap(430, 240, g), title = 'Universal indicator', want = r.pick(['strongly acidic', 'weakly acidic', 'neutral', 'weakly alkaline', 'strongly alkaline'].filter(c => tubes.some(p => pHclass(p) === c)));
    const ansI = tubes.findIndex(p => pHclass(p) === want), ans = L[ansI];
    if (r.int(0, 1)) return { title, spec: 'C2.29', kind: 'diagram', svg, q: `Universal indicator was added to four solutions. Which one is ${want}?`, o: [ans, ...L.filter(x => x !== ans)], x: `Match each colour to the chart: ${L[ansI]} is about pH ${tubes[ansI]}, which is ${want} (strongly acidic 0–3, weakly acidic 4–6, neutral 7, weakly alkaline 8–10, strongly alkaline 11–14).` };
    const i = r.int(0, 3), p = tubes[i]; return { title, spec: 'C2.30', kind: 'diagram', svg, q: `What is the approximate pH of solution ${L[i]}?`, o: [String(p), ...uniq(p, [14 - p, p + 3, p - 3, 7].filter(v => v >= 0 && v <= 14 && Math.abs(v - p) > 1)).map(String)], x: `Match the colour of ${L[i]} to the chart: about pH ${p} (${pHclass(p)}).` };
  };

  /* ---------- atoms: protons, neutrons and electrons (C1.15, C1.16, P7.2, P7.3) ---------- */
  const ISO = [['H', 1, [1, 2, 3]], ['He', 2, [4, 3]], ['Li', 3, [7, 6]], ['Be', 4, [9]], ['B', 5, [11, 10]], ['C', 6, [12, 13, 14]], ['N', 7, [14, 15]], ['O', 8, [16, 18]], ['F', 9, [19]], ['Ne', 10, [20, 22]]];
  M.nucleus = r => {
    const [sym, Z, As] = r.pick(ISO), A = r.pick(As), N = A - Z, cx = 160, cy = 140;
    const nuc = sh([...Array(Z).fill('p'), ...Array(N).fill('n')], r); let g = '';
    const rr = 7.5, pts = []; for (let i = 0; i < nuc.length; i++) { const a = i * 2.39996, d = rr * 1.16 * Math.sqrt(i); pts.push([cx + Math.cos(a) * d, cy + Math.sin(a) * d]); }
    const shells = config(Z); shells.forEach((c, k) => { const rad = 58 + k * 28; g += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="#999"/>`; for (let i = 0; i < c; i++) { const a = i / c * 2 * Math.PI - Math.PI / 2; g += `<circle cx="${(cx + Math.cos(a) * rad).toFixed(1)}" cy="${(cy + Math.sin(a) * rad).toFixed(1)}" r="5" fill="#1e3a8a"/>` + T((cx + Math.cos(a) * rad).toFixed(1), (cy + Math.sin(a) * rad + 3.5).toFixed(1), '−', { size: 9, w: 700, fill: '#fff' }); } });
    nuc.forEach((t, i) => { const [x, y] = pts[i]; g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr}" fill="${t === 'p' ? '#ef4444' : '#d1d5db'}" stroke="${INK}"/>` + (t === 'p' ? T(x.toFixed(1), (y + 4).toFixed(1), '+', { size: 10, w: 700, fill: '#fff' }) : ''); });
    g += `<g transform="translate(300 60)"><circle r="7" fill="#ef4444" stroke="${INK}"/>${T(0, 4, '+', { size: 10, w: 700, fill: '#fff' })}${T(14, 4, 'proton', { size: 12, a: 'start' })}<circle cy="26" r="7" fill="#d1d5db" stroke="${INK}"/>${T(14, 30, 'neutron', { size: 12, a: 'start' })}<circle cy="52" r="5" fill="#1e3a8a"/>${T(14, 56, 'electron', { size: 12, a: 'start' })}</g>`;
    const svg = wrap(400, 280, g), title = 'Inside an atom', q = r.int(0, 3), ELEM = ELN[Z - 1];
    if (q === 0) return { title, spec: 'C1.16', kind: 'diagram', svg, q: 'What is the mass number of this atom?', o: [String(A), ...uniq(A, [Z, N, A + Z, Z + shells.length, A - 1, A + 1, 2 * A, A + 2, A + 3]).map(String)], x: `Mass number = protons + neutrons = ${Z} + ${N} = ${A}.` };
    if (q === 1) return { title, spec: 'C1.16', kind: 'diagram', svg, q: 'Which element is this?', o: [ELEM, ...others(ELEM, ISO.map(e => ELN[e[1] - 1]), r)], x: `${Z} proton${Z > 1 ? 's' : ''}: atomic number ${Z} is ${ELEM}. (The number of neutrons doesn't change the element.)` };
    if (q === 2) { const ans = `<span class="nuc"><sup>${A}</sup><sub>${Z}</sub>${sym}</span>`; return { title, spec: 'P7.2', kind: 'diagram', svg, q: 'Which symbol describes this atom?', o: [ans, `<span class="nuc"><sup>${Z}</sup><sub>${A}</sub>${sym}</span>`, `<span class="nuc"><sup>${N}</sup><sub>${Z}</sub>${sym}</span>`, `<span class="nuc"><sup>${A + Z}</sup><sub>${Z}</sub>${sym}</span>`, `<span class="nuc"><sup>${A}</sup><sub>${A - Z || Z + 1}</sub>${sym}</span>`, `<span class="nuc"><sup>${A + 1}</sup><sub>${Z}</sub>${sym}</span>`].filter((v, k, a) => a.indexOf(v) === k).slice(0, 4), x: `Mass number (top) = ${A}, atomic number (bottom) = ${Z}.` }; }
    const other = As.find(a => a !== A); if (!other) return { title, spec: 'C1.15', kind: 'diagram', svg, q: 'What is the overall charge of this atom?', o: ['0: equal numbers of protons and electrons', `+${Z}`, `−${Z}`, `+${A}`], x: `${Z} protons (+) and ${Z} electrons (−) cancel: the atom is neutral.` };
    return { title, spec: 'C1.16', kind: 'diagram', svg, q: `Another atom of ${ELEM} has mass number ${other}. How many neutrons does it have?`, o: [String(other - Z), ...uniq(other - Z, [other, N, Z, other + Z]).map(String)], x: `Isotopes have the same number of protons (${Z}) but different numbers of neutrons: ${other} − ${Z} = ${other - Z}.` };
  };
  /* ---------- the heart, front view (B2.65, B2.69) ---------- */
  M.heart = r => {
    const plain = r.f() < .5, BL = plain ? '#e5e7eb' : '#bfdbfe', RD = plain ? '#e5e7eb' : '#fecaca', WALL = plain ? '#f8fafc' : '#fde2e4';
    const shrink = (d, cx, cy, k) => `<path d="${d}" transform="translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})"`;
    const tube = (d, c, w = 22) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 4}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round"/>`;
    const RA = 'M50 110Q50 84 76 84H150V178H50Z', LA = 'M210 84H284Q310 84 310 110V178H210Z';
    const RV = 'M50 188H174V318Q122 312 82 272Q50 238 50 188Z', LV = 'M186 188H312Q312 262 264 300Q230 326 186 322Z';
    let g = tube('M94 0V100', BL) + tube('M196 196V50Q196 22 228 22H300Q332 22 332 54V100', RD) + tube('M378 140H296', RD, 20) + tube('M163 196V60Q163 42 145 42H0', BL);
    [[RA, 100, 131, .8, BL], [LA, 260, 131, .8, RD], [RV, 112, 240, .8, BL], [LV, 248, 244, .62, RD]].forEach(([d, cx, cy, k, c]) => { g += `<path d="${d}" fill="${WALL}" stroke="${INK}" stroke-width="2"/>` + shrink(d, cx, cy, k) + ` fill="${c}" stroke="${INK}" stroke-width="1.2"/>`; });
    g += `<path d="M180 186v138" stroke="${INK}" stroke-width="7"/><path d="M180 186v138" stroke="${WALL}" stroke-width="4"/>`;   // septum
    g += `<path d="M70 176l20 22M130 176l-20 22M230 176l20 22M290 176l-20 22" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;   // valves between atria and ventricles
    if (!plain) g += arrow(94, 10, 94, 60, '#1d4ed8', 2) + arrow(163, 120, 163, 70, '#1d4ed8', 2) + arrow(60, 42, 20, 42, '#1d4ed8', 2) + arrow(372, 140, 330, 140, '#b91c1c', 2) + arrow(196, 120, 196, 66, '#b91c1c', 2) + arrow(332, 60, 332, 94, '#b91c1c', 2);
    const parts = { ra: [90, 140], la: [268, 140], rv: [100, 250], lv: [258, 244], aorta: [270, 22], pa: [40, 42], vc: [94, 70], pv: [356, 140], septum: [180, 290], valve: [80, 187] };
    const NAME = { ra: 'right atrium', la: 'left atrium', rv: 'right ventricle', lv: 'left ventricle', aorta: 'aorta', pa: 'pulmonary artery', vc: 'vena cava', pv: 'pulmonary vein', septum: 'septum', valve: 'valve' };
    const FN = { aorta: 'Carries oxygenated blood from the heart to the body', pa: 'Carries deoxygenated blood from the heart to the lungs', vc: 'Brings deoxygenated blood back from the body', pv: 'Brings oxygenated blood back from the lungs', valve: 'Stops blood flowing backwards', septum: 'Keeps oxygenated and deoxygenated blood apart', lv: 'Pumps blood out to the whole body' };
    const keys = sh(Object.keys(parts), r).slice(0, 5), W = 380, { g: lg, letter } = letterParts(parts, keys, W, 20, 310, { lx: -40, rx: 420, mid: 180 });
    const svg = `<svg viewBox="-60 -4 500 334" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;background:#fff">${g + lg}</svg>`, title = 'The heart';
    if (plain && r.f() < .3) { const ox = keys.filter(k => ['la', 'lv', 'aorta', 'pv'].includes(k)), de = keys.filter(k => ['ra', 'rv', 'pa', 'vc'].includes(k)); if (ox.length && de.length >= 2) { const k = r.pick(ox); return { title, spec: 'B2.65', kind: 'diagram', svg, q: 'Which of these labels a part that carries oxygenated blood?', o: [letter[k], ...others(letter[k], de.map(x => letter[x]), r)], x: `The left side of the heart (on the right of the picture, as you face the person) carries oxygenated blood from the lungs: ${letter[k]} is the ${NAME[k]}.` }; } }
    if (r.f() < .2) return { title, spec: 'B2.65', kind: 'diagram', svg, q: 'Why does the left ventricle have a thicker wall than the right ventricle?', o: ['It pumps blood all round the body, so it needs more force', 'It holds more blood', 'It carries deoxygenated blood', 'It pumps blood only to the lungs'], x: 'The left ventricle pumps blood to the whole body at high pressure; the right only pumps to the nearby lungs.' };
    return partQ(r, title, 'B2.65', svg, letter, keys, NAME, FN);
  };

  /* ---------- the eye, side section (B2.91, B2.92) ---------- */
  M.eye = r => {
    const flip = r.int(0, 1), W = 420, cx = 225, cy = 150, R = 105, X = x => flip ? W - x : x;
    let g = `<circle cx="${X(cx)}" cy="${cy}" r="${R}" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M${X(cx - 72)} ${cy - 76}A${R - 7} ${R - 7} 0 1 ${flip ? 0 : 1} ${X(cx - 72)} ${cy + 76}" fill="none" stroke="#dc2626" stroke-width="3"/>`;   // sclera + retina
    g += `<path d="M${X(cx - 92)} ${cy - 50}Q${X(cx - 140)} ${cy} ${X(cx - 92)} ${cy + 50}" fill="#e0f2fe" stroke="${INK}" stroke-width="2"/>`;   // cornea
    g += `<path d="M${X(cx - 98)} ${cy - 46}L${X(cx - 98)} ${cy - 15}M${X(cx - 98)} ${cy + 15}L${X(cx - 98)} ${cy + 46}" stroke="#7c3aed" stroke-width="6"/>`;   // iris
    g += `<ellipse cx="${X(cx - 75)}" cy="${cy}" rx="15" ry="38" fill="#fef9c3" stroke="${INK}" stroke-width="2"/>`;   // lens
    g += `<path d="M${X(cx - 75)} ${cy - 38}L${X(cx - 72)} ${cy - 68}M${X(cx - 75)} ${cy + 38}L${X(cx - 72)} ${cy + 68}" stroke="#555" stroke-width="1.4" stroke-dasharray="2 2"/>`;   // suspensory ligaments
    g += `<ellipse cx="${X(cx - 70)}" cy="${cy - 76}" rx="9" ry="7" fill="#fca5a5" stroke="${INK}"/><ellipse cx="${X(cx - 70)}" cy="${cy + 76}" rx="9" ry="7" fill="#fca5a5" stroke="${INK}"/>`;   // ciliary muscle
    g += `<path d="M${X(cx + 98)} ${cy - 12}L${X(cx + 175)} ${cy - 16}L${X(cx + 175)} ${cy + 16}L${X(cx + 98)} ${cy + 12}" fill="#fde68a" stroke="${INK}" stroke-width="1.6"/>`;   // optic nerve
    g += `<path d="M${X(cx + 101)} ${cy - 30}q-6 6 0 10" fill="none" stroke="${INK}"/>`;
    const parts = { cornea: [X(cx - 128), cy - 8], iris: [X(cx - 98), cy - 30], pupil: [X(cx - 104), cy + 4], lens: [X(cx - 75), cy + 18], retina: [X(cx + 50), cy - 82], optic: [X(cx + 150), cy + 6], ciliary: [X(cx - 70), cy + 76], ligament: [X(cx - 73), cy - 56], sclera: [X(cx + 70), cy + 77] };
    const NAME = { cornea: 'cornea', iris: 'iris', pupil: 'pupil', lens: 'lens', retina: 'retina', optic: 'optic nerve', ciliary: 'ciliary muscle', ligament: 'suspensory ligaments', sclera: 'sclera' };
    const FN = { cornea: 'Refracts light entering the eye', iris: 'Controls the size of the pupil', pupil: 'Lets light into the eye', lens: 'Focuses light onto the retina', retina: 'Contains light-sensitive receptor cells', optic: 'Carries impulses from the retina to the brain', ciliary: 'Contracts or relaxes to change the shape of the lens', sclera: 'Tough outer coat that protects the eye' };
    const keys = sh(Object.keys(parts), r).slice(0, 5), { g: lg, letter } = letterParts(parts, keys, W, 30, 270, { lx: -30, rx: W + 30 });
    const svg = `<svg viewBox="-50 0 ${W + 100} 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;background:#fff">${g + lg}</svg>`, title = 'The eye';
    if (r.f() < .2) { const bright = r.int(0, 1); return { title, spec: 'B2.92', kind: 'diagram', svg, q: `What happens to the pupil when the eye moves into ${bright ? 'bright' : 'dim'} light?`, o: [bright ? 'It gets smaller: the circular muscles of the iris contract' : 'It gets bigger: the radial muscles of the iris contract', bright ? 'It gets bigger: more light is needed' : 'It gets smaller: less light is needed', 'It stays the same: the lens adjusts instead', 'The retina moves closer to the lens'], x: bright ? 'In bright light the iris makes the pupil smaller to protect the retina.' : 'In dim light the iris makes the pupil bigger to let more light in.' }; }
    return partQ(r, title, 'B2.91', svg, letter, keys, NAME, FN);
  };

  /* ---------- leaf cross-section (B2.21, B2.70) ---------- */
  M.leaf = r => {
    const W = 420, x0 = 20, x1 = 400; let g = '';
    g += `<rect x="${x0}" y="20" width="${x1 - x0}" height="6" fill="#d9f99d" stroke="${INK}" stroke-width=".8"/>`;   // upper cuticle
    for (let x = x0; x < x1; x += 28) g += `<rect x="${x}" y="26" width="28" height="18" fill="#fff" stroke="${INK}"/>`;   // upper epidermis
    for (let x = x0; x < x1; x += 20) { g += `<rect x="${x + 1}" y="46" width="18" height="58" rx="6" fill="#bbf7d0" stroke="${INK}"/>`; for (let k = 0; k < 4; k++) g += `<circle cx="${x + 6 + (k % 2) * 8}" cy="${54 + k * 13}" r="3" fill="#16a34a"/>`; }   // palisade
    const vb = r.pick([140, 200, 260]), st = r.pick([90, 160, 320].filter(v => Math.abs(v - vb) > 50));
    for (let x = x0 + 14; x < x1 - 8; x += 30) for (let y = 120; y < 175; y += 30) { const xx = x + (y % 60 ? 12 : 0) + r.int(-3, 3), yy = y + r.int(-3, 3); if (Math.hypot(xx - vb, yy - 140) < 40) continue; g += `<ellipse cx="${xx}" cy="${yy}" rx="12" ry="10" fill="#dcfce7" stroke="${INK}"/><circle cx="${xx - 3}" cy="${yy}" r="2.4" fill="#16a34a"/>`; }   // spongy, with air spaces between
    g += `<circle cx="${vb}" cy="140" r="30" fill="#fef3c7" stroke="${INK}" stroke-width="1.6"/>`; for (let k = 0; k < 5; k++) g += `<circle cx="${vb - 14 + k * 7}" cy="${128 + (k % 2) * 6}" r="5" fill="#fff" stroke="${INK}" stroke-width="1.6"/>`; for (let k = 0; k < 4; k++) g += `<circle cx="${vb - 10 + k * 7}" cy="${154}" r="3.5" fill="#fde68a" stroke="${INK}"/>`;
    for (let x = x0; x < x1; x += 28) if (Math.abs(x + 14 - st) > 20) g += `<rect x="${x}" y="190" width="28" height="16" fill="#fff" stroke="${INK}"/>`;   // lower epidermis with a gap for the stoma
    g += `<ellipse cx="${st - 8}" cy="198" rx="8" ry="10" fill="#bbf7d0" stroke="${INK}"/><ellipse cx="${st + 8}" cy="198" rx="8" ry="10" fill="#bbf7d0" stroke="${INK}"/><rect x="${x0}" y="206" width="${x1 - x0}" height="4" fill="#d9f99d" stroke="${INK}" stroke-width=".6"/>`;
    const parts = { cuticle: [x0 + 300, 23], upper: [x0 + 60, 35], palisade: [x0 + 125, 75], spongy: [x0 + 30, 165], air: [x0 + 48, 150], xylem: [vb - 7, 128], phloem: [vb + 4, 154], guard: [st + 9, 202], stoma: [st, 198], lower: [x0 + 220, 198] };
    if (Math.abs(vb - 70) < 40) { parts.spongy = [x0 + 320, 165]; parts.air = [x0 + 300, 150]; }
    const NAME = { cuticle: 'waxy cuticle', upper: 'upper epidermis', palisade: 'palisade mesophyll', spongy: 'spongy mesophyll', air: 'air space', xylem: 'xylem', phloem: 'phloem', guard: 'guard cell', stoma: 'stoma', lower: 'lower epidermis' };
    const FN = { cuticle: 'Reduces water loss', upper: 'Thin and transparent, so light passes through', palisade: 'Packed with chloroplasts for photosynthesis', spongy: 'Has air spaces for gases to diffuse through', air: 'Lets gases diffuse to and from the cells', xylem: 'Carries water and mineral ions to the leaf', phloem: 'Carries sucrose and amino acids away from the leaf', guard: 'Opens and closes the stoma', stoma: 'Lets carbon dioxide in and oxygen and water vapour out' };
    const keys = sh(Object.keys(parts), r).slice(0, 5), { g: lg, letter } = letterParts(parts, keys, W, 10, 220, { lx: -30, rx: W + 30 });
    const svg = `<svg viewBox="-50 0 ${W + 100} 225" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;background:#fff">${g + lg}</svg>`;
    return partQ(r, 'Leaf cross-section', 'B2.21', svg, letter, keys, NAME, FN);
  };

  /* ---------- insect- and wind-pollinated flowers (B3.3) ---------- */
  M.flower = r => {
    const wind = r.f() < .35, W = 400, cx = 200; let g = '';
    g += `<path d="M${cx - 5} 300V210h10V300z" fill="#86efac" stroke="${INK}"/><path d="M${cx - 34} 214q34 -24 68 0q-34 10 -68 0z" fill="#bbf7d0" stroke="${INK}"/>`;   // stalk, receptacle
    g += `<path d="M${cx - 30} 212q-40 -6 -52 -30q30 6 50 24zM${cx + 30} 212q40 -6 52 -30q-30 6 -50 24z" fill="#4ade80" stroke="${INK}"/>`;   // sepals
    if (!wind) g += `<path d="M${cx - 26} 206q-80 -30 -96 -120q60 30 92 110zM${cx + 26} 206q80 -30 96 -120q-60 30 -92 110z" fill="${r.pick(['#f9a8d4', '#fde047', '#c4b5fd', '#fdba74'])}" stroke="${INK}" stroke-width="1.6"/>`;   // big petals
    else g += `<path d="M${cx - 22} 206q-20 -14 -24 -40q14 10 22 38zM${cx + 22} 206q20 -14 24 -40q-14 10 -22 38z" fill="#d6d3d1" stroke="${INK}"/>`;   // small dull petals
    g += `<path d="M${cx - 20} 208q-4 -40 20 -44q24 4 20 44z" fill="#fef3c7" stroke="${INK}" stroke-width="1.6"/><circle cx="${cx - 5}" cy="192" r="4" fill="#fff" stroke="${INK}"/><circle cx="${cx + 6}" cy="186" r="4" fill="#fff" stroke="${INK}"/>`;   // ovary + ovules
    g += `<path d="M${cx} 164V${wind ? 40 : 96}" stroke="${INK}" stroke-width="5"/><path d="M${cx} 164V${wind ? 40 : 96}" stroke="#fde68a" stroke-width="2.5"/>`;   // style
    if (wind) { for (let k = -3; k <= 3; k++) g += `<path d="M${cx} ${48 + Math.abs(k) * 4}l${k * 9} -22" stroke="${INK}" stroke-width="1.4"/>`; }   // feathery stigma outside
    else g += `<ellipse cx="${cx}" cy="94" rx="12" ry="6" fill="#fde68a" stroke="${INK}"/>`;   // sticky stigma
    const ns = r.int(2, 3); for (let i = 0; i < ns; i++) [-1, 1].forEach(s => { const bx = cx + s * (16 + i * 9), tx = cx + s * (wind ? 100 + i * 22 : 44 + i * 16), ty = wind ? 240 + i * 14 : 120 - i * 6;
      g += `<path d="M${bx} 206Q${(bx + tx) / 2 + s * 10} ${wind ? 210 : 160} ${tx} ${ty}" fill="none" stroke="${INK}" stroke-width="1.6"/><ellipse cx="${tx}" cy="${ty + (wind ? 10 : -6)}" rx="6" ry="10" fill="#facc15" stroke="${INK}"/>`; });   // stamens: filament + anther (hanging outside if wind)
    if (!wind) g += `<path d="M${cx - 12} 214q12 8 24 0" stroke="#16a34a" stroke-width="4" fill="none"/>`;   // nectary
    const ax = cx + (wind ? 100 : 44), ay = wind ? 250 : 114;
    const parts = { petal: [cx + (wind ? 40 : 100), wind ? 178 : 140], sepal: [cx - 70, 190], stigma: [cx + (wind ? 18 : 10), wind ? 34 : 92], style: [cx, wind ? 110 : 132], ovary: [cx + 14, 200], anther: [ax, ay], filament: [cx - (wind ? 70 : 34), wind ? 222 : 160], ovule: [cx - 5, 192] };
    if (!wind) parts.nectary = [cx + 10, 216];
    const NAME = { petal: 'petal', sepal: 'sepal', stigma: 'stigma', style: 'style', ovary: 'ovary', anther: 'anther', filament: 'filament', ovule: 'ovule', nectary: 'nectary' };
    const FN = { petal: wind ? 'Small and dull: no need to attract insects' : 'Large and brightly coloured to attract insects', sepal: 'Protected the flower when it was a bud', stigma: wind ? 'Feathery, hanging outside to catch pollen from the air' : 'Sticky surface where pollen lands', anther: 'Makes pollen', ovary: 'Contains the ovules', ovule: 'Contains the female gamete; becomes a seed', nectary: 'Makes sugary nectar to attract insects', filament: 'Holds up the anther' };
    const keys = sh(Object.keys(parts), r).slice(0, 5), { g: lg, letter } = letterParts(parts, keys, W, 30, 290, { lx: -30, rx: W + 30 });
    const svg = `<svg viewBox="-50 10 ${W + 100} 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;background:#fff">${g + lg}</svg>`, title = wind ? 'Wind-pollinated flower' : 'Insect-pollinated flower';
    if (r.f() < .3) return { title: 'Flower', spec: 'B3.3', kind: 'diagram', svg, q: 'Is this flower pollinated by insects or by the wind?', o: wind ? ['Wind: anthers and feathery stigma hang outside, small dull petals', 'Insects: it has petals', 'Insects: the stigma is inside the flower', 'Wind: it has a nectary'] : ['Insects: large coloured petals, nectary, stigma and anthers inside', 'Wind: the anthers are inside the flower', 'Wind: it has a style', 'Insects: the anthers hang outside'], x: wind ? 'Wind-pollinated flowers have exposed anthers and big feathery stigmas, and don\'t need bright petals or nectar.' : 'Insect-pollinated flowers attract insects with bright petals, scent and nectar; anthers and stigma are inside where insects brush past.' };
    return partQ(r, title, 'B3.3', svg, letter, keys, NAME, FN);
  };

  /* ---------- the thorax (B2.46, B2.47) ---------- */
  M.thorax = r => {
    const W = 400, cx = 200; let g = '';
    g += `<path d="M60 70q-30 80 -10 190h300q20 -110 -10 -190" fill="none" stroke="#aaa" stroke-width="2"/>`;   // chest outline
    for (let k = 0; k < 5; k++) { const y = 92 + k * 32; g += `<path d="M58 ${y}q20 -12 50 -6M342 ${y}q-20 -12 -50 -6" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M58 ${y}q20 -12 50 -6M342 ${y}q-20 -12 -50 -6" stroke="#f5f5f4" stroke-width="4" fill="none" stroke-linecap="round"/>`; if (k < 4) g += `<path d="M60 ${y + 16}l40 -4M340 ${y + 16}l-40 -4" stroke="#dc2626" stroke-width="2" stroke-dasharray="3 2"/>`; }   // ribs + intercostal muscles
    g += `<path d="M${cx - 10} 20V100h20V20z" fill="#fff" stroke="${INK}" stroke-width="1.6"/>`; for (let y = 28; y < 100; y += 9) g += `<path d="M${cx - 10} ${y}h20" stroke="#999"/>`;   // trachea with rings
    g += `<path d="M120 90q-30 60 -24 150q40 10 84 -10q10 -70 -6 -130q-30 -20 -54 -10zM280 90q30 60 24 150q-40 10 -84 -10q-10 -70 6 -130q30 -20 54 -10z" fill="#fecdd3" stroke="${INK}" stroke-width="1.6"/>`;   // lungs
    g += `<path d="M118 86q-34 62 -26 160q44 12 92 -10q10 -74 -6 -136q-34 -24 -60 -14z" fill="none" stroke="#7c3aed" stroke-width="1.4" stroke-dasharray="5 3"/>`;   // pleural membrane
    g += `<path d="M${cx} 100l-34 30M${cx} 100l34 30" stroke="${INK}" stroke-width="8"/><path d="M${cx} 100l-34 30M${cx} 100l34 30" stroke="#fff" stroke-width="5"/>`;   // bronchi
    [[cx - 34, 130, -1], [cx + 34, 130, 1]].forEach(([x, y, s]) => { g += `<path d="M${x} ${y}l${s * 18} 30M${x} ${y}l${s * 4} 40M${x + s * 18} ${y + 30}l${s * 14} 18M${x + s * 18} ${y + 30}l${s * 2} 26" stroke="${INK}" stroke-width="2"/>`; [[x + s * 32, y + 48], [x + s * 20, y + 56], [x + s * 4, y + 40]].forEach(([ax, ay]) => { g += `<circle cx="${ax}" cy="${ay + 4}" r="5" fill="#fda4af" stroke="${INK}"/>`; }); });   // bronchioles + alveoli
    g += `<path d="M50 262q150 -70 300 0" fill="none" stroke="#b45309" stroke-width="6"/>`;   // diaphragm
    const parts = { trachea: [cx + 10, 50], bronchus: [cx + 22, 116], bronchiole: [cx - 52, 160], alveoli: [cx + 66, 182], rib: [330, 156], intercostal: [72, 140], diaphragm: [cx + 90, 236], pleura: [96, 200], lung: [280, 210] };
    const NAME = { trachea: 'trachea', bronchus: 'bronchus', bronchiole: 'bronchiole', alveoli: 'alveoli', rib: 'rib', intercostal: 'intercostal muscles', diaphragm: 'diaphragm', pleura: 'pleural membranes', lung: 'lung' };
    const FN = { trachea: 'Carries air down to the bronchi', alveoli: 'Where gas exchange happens', intercostal: 'Move the ribs up and out when breathing in', diaphragm: 'Contracts and flattens to help you breathe in', pleura: 'Reduce friction as the lungs move', rib: 'Protects the lungs and heart' };
    const keys = sh(Object.keys(parts), r).slice(0, 5), { g: lg, letter } = letterParts(parts, keys, W, 20, 270, { lx: -30, rx: W + 30 });
    const svg = `<svg viewBox="-50 10 ${W + 100} 270" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;background:#fff">${g + lg}</svg>`, title = 'The thorax';
    if (r.f() < .25) { const inn = r.int(0, 1); return { title, spec: 'B2.47', kind: 'diagram', svg, q: `What does the diaphragm do when you breathe ${inn ? 'in' : 'out'}?`, o: inn ? ['Contracts and flattens', 'Relaxes and moves up into a dome', 'Stays still: only the ribs move', 'Contracts and moves up'] : ['Relaxes and moves up into a dome', 'Contracts and flattens', 'Pushes the ribs up and out', 'Stays still: only the ribs move'], x: inn ? 'Breathing in: diaphragm contracts and flattens, external intercostals pull the ribs up and out, the volume of the thorax increases and pressure falls, so air rushes in.' : 'Breathing out: diaphragm relaxes and domes up, ribs move down and in, volume falls and pressure rises, so air is pushed out.' }; }
    return partQ(r, title, 'B2.46', svg, letter, keys, NAME, FN);
  };

  /* ---------- the alimentary canal (B2.27, B2.30) ---------- */
  M.gut = r => {
    const W = 360; let g = `<path d="M180 20q-30 0 -30 30q0 25 30 25q30 0 30 -25q0 -30 -30 -30z" fill="#fff" stroke="#aaa"/>`;   // head
    g += `<path d="M180 64v100" stroke="${INK}" stroke-width="8"/><path d="M180 64v100" stroke="#fde2e4" stroke-width="5"/>`;   // oesophagus
    g += `<path d="M180 160q50 -14 64 20q10 36 -30 50q-24 6 -34 -12q20 -6 26 -26q2 -18 -26 -20z" fill="#fecaca" stroke="${INK}" stroke-width="1.6"/>`;   // stomach (person's left = viewer's right)
    g += `<path d="M100 150q50 -20 90 6q-10 40 -60 46q-40 2 -30 -52z" fill="#a16207" fill-opacity=".55" stroke="${INK}" stroke-width="1.6"/><ellipse cx="146" cy="200" rx="8" ry="6" fill="#4d7c0f" stroke="${INK}"/>`;   // liver + gall bladder
    g += `<path d="M150 236q40 -8 76 2q-4 8 -20 8q-30 -4 -56 0z" fill="#fde68a" stroke="${INK}"/>`;   // pancreas
    g += `<path d="M126 392V264Q126 248 142 248H232Q248 248 248 264V368Q248 386 228 388H190V422" fill="none" stroke="${INK}" stroke-width="13" stroke-linejoin="round"/><path d="M126 392V264Q126 248 142 248H232Q248 248 248 264V368Q248 386 228 388H190V422" fill="none" stroke="#fbcfe8" stroke-width="9" stroke-linejoin="round"/>`;   // large intestine round to the rectum
    const coil = 'M196 226Q206 240 196 262Q150 262 150 280Q150 296 175 296Q215 296 220 314Q222 332 190 334Q152 334 152 352Q152 370 196 368';
    g += `<path d="${coil}" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="${coil}" fill="none" stroke="#fde68a" stroke-width="5.5" stroke-linecap="round"/>`;   // small intestine
    const parts = { mouth: [180, 58], oesophagus: [180, 110], stomach: [236, 196], liver: [118, 168], gall: [146, 200], pancreas: [214, 240], small: [218, 312], large: [126, 320], rectum: [190, 410] };
    const NAME = { mouth: 'mouth', oesophagus: 'oesophagus', stomach: 'stomach', liver: 'liver', gall: 'gall bladder', pancreas: 'pancreas', small: 'small intestine', large: 'large intestine', rectum: 'rectum' };
    const FN = { oesophagus: 'Moves food to the stomach by peristalsis', stomach: 'Digests protein using protease in acid conditions', liver: 'Makes bile', gall: 'Stores bile', pancreas: 'Makes digestive enzymes (amylase, protease, lipase)', small: 'Absorbs digested food into the blood', large: 'Absorbs water from undigested food', rectum: 'Stores faeces' };
    const keys = sh(Object.keys(parts), r).slice(0, 5), { g: lg, letter } = letterParts(parts, keys, W, 30, 415, { lx: -30, rx: W + 30, mid: 180 });
    const svg = `<svg viewBox="-50 10 ${W + 100} 425" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;background:#fff">${g + lg}</svg>`;
    return partQ(r, 'The alimentary canal', 'B2.27', svg, letter, keys, NAME, FN);
  };

  /* ---------- reflex arc (B2.90) ---------- */
  M.reflex = r => {
    const W = 440; let g = `<circle cx="350" cy="110" r="66" fill="#f5f5f4" stroke="${INK}" stroke-width="2"/><path d="M322 74q28 28 0 72q28 -26 56 0q-28 -44 0 -72q-28 28 -56 0z" fill="#d6d3d1" stroke="#888"/>` + T(350, 196, 'spinal cord', { size: 11, fill: '#555' });
    g += `<path d="M262 120L178 196Q170 206 160 206H58Q40 206 40 218Q40 230 58 230H170Q190 230 202 214L282 140Z" fill="#fde2d0" stroke="${INK}" stroke-width="1.6"/>`;   // arm: upper arm up to the shoulder, forearm out to the hand
    g += `<ellipse cx="226" cy="160" rx="34" ry="13" transform="rotate(-42 226 160)" fill="#fca5a5" stroke="${INK}"/>`;   // biceps (effector)
    g += `<path d="M14 232q-8 -16 4 -30q2 12 8 6q4 12 -2 24z" fill="#fb923c" stroke="#c2410c"/>` + T(18, 250, 'heat', { size: 10, fill: '#c2410c' });
    g += `<circle cx="44" cy="218" r="4.5" fill="#2563eb"/><path d="M48 220H170Q200 220 230 200L300 150Q312 140 324 128" fill="none" stroke="#2563eb" stroke-width="3"/><circle cx="292" cy="156" r="7" fill="#93c5fd" stroke="${INK}"/>`;   // receptor + sensory neurone (cell body outside the cord)
    g += `<path d="M328 124L362 102" stroke="#16a34a" stroke-width="3"/><circle cx="345" cy="113" r="5" fill="#86efac" stroke="${INK}"/>`;   // relay neurone
    g += `<path d="M368 98Q330 40 280 70Q246 90 236 150" fill="none" stroke="#b91c1c" stroke-width="3"/><circle cx="362" cy="96" r="7" fill="#fca5a5" stroke="${INK}"/>`;   // motor neurone to the biceps
    g += arrow(100, 228, 140, 228, '#2563eb', 2) + arrow(300, 52, 278, 62, '#b91c1c', 2) + `<circle cx="326" cy="126" r="3" fill="${INK}"/><circle cx="365" cy="100" r="3" fill="${INK}"/>`;
    const parts = { receptor: [44, 218], sensory: [200, 214], relay: [345, 113], motor: [292, 58], effector: [218, 166], cord: [398, 140], synapse: [326, 126] };
    const NAME = { receptor: 'receptor', sensory: 'sensory neurone', relay: 'relay neurone', motor: 'motor neurone', effector: 'effector (muscle)', cord: 'spinal cord', synapse: 'synapse' };
    const FN = { receptor: 'Detects the stimulus (heat)', sensory: 'Carries impulses from the receptor to the spinal cord', relay: 'Passes impulses from the sensory to the motor neurone', motor: 'Carries impulses to the effector', effector: 'Contracts to pull the hand away', synapse: 'Gap where a chemical carries the signal to the next neurone' };
    const keys = sh(Object.keys(parts), r).slice(0, 5), { g: lg, letter } = letterParts(parts, keys, W, 30, 250, { lx: -30, rx: W + 30, mid: 250 });
    const svg = `<svg viewBox="-50 20 ${W + 100} 245" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;background:#fff">${g + lg}</svg>`, title = 'Reflex arc';
    if (r.f() < .3) { const ans = 'receptor → sensory neurone → relay neurone → motor neurone → effector'; return { title, spec: 'B2.90', kind: 'diagram', svg, q: 'In what order does the impulse travel?', o: [ans, 'receptor → motor neurone → relay neurone → sensory neurone → effector', 'effector → motor neurone → relay neurone → sensory neurone → receptor', 'receptor → relay neurone → sensory neurone → motor neurone → effector'], x: 'Stimulus → receptor → sensory neurone → relay neurone (spinal cord) → motor neurone → effector → response. The brain isn\'t needed, so it\'s fast.' }; }
    return partQ(r, title, 'B2.90', svg, letter, keys, NAME, FN);
  };

  /* ---------- the carbon cycle (B4.10) ---------- */
  M.carbon = r => {
    const BOX = { air: ['carbon dioxide in the air', 270, 30], plants: ['plants', 70, 150], animals: ['animals', 410, 150], dead: ['dead matter and waste', 200, 262], decomp: ['decomposers', 410, 262], fossil: ['fossil fuels', 60, 30] };
    const ARR = [['air', 'plants', 'photosynthesis'], ['plants', 'air', 'respiration'], ['animals', 'air', 'respiration'], ['plants', 'animals', 'feeding'], ['plants', 'dead', 'death'], ['animals', 'dead', 'death and waste'], ['dead', 'decomp', 'decay'], ['decomp', 'air', 'respiration (by decomposers)'], ['fossil', 'air', 'combustion']];
    const bw = k => BOX[k][0].length * 6.6 + 18, bh = 26, clip = (k, dx, dy) => { const w = bw(k) / 2 + 2, h = bh / 2 + 2, t = Math.min(dx ? w / Math.abs(dx) : 1e9, dy ? h / Math.abs(dy) : 1e9); return [BOX[k][1] + dx * t, BOX[k][2] + dy * t]; };
    let g = ''; const lab = sh(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'], r), letterOf = {};
    ARR.forEach(([a, b, p], i) => { const [x1, y1] = [BOX[a][1], BOX[a][2]], [x2, y2] = [BOX[b][1], BOX[b][2]], off = ARR.some(([c, d]) => c === b && d === a) ? 7 : 0, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L * off, ny = dx / L * off;
      const [ax, ay] = clip(a, dx, dy), [bx, by] = clip(b, -dx, -dy); g += arrow(ax + nx, ay + ny, bx + nx, by + ny, '#555', 1.8); const mx = (ax + bx) / 2 + nx * 2.4, my = (ay + by) / 2 + ny * 2.4; letterOf[i] = lab[i];
      g += `<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="9" fill="#fff" stroke="${INK}"/>` + T(mx.toFixed(1), (my + 4.5).toFixed(1), lab[i], { size: 12, w: 700 }); });
    Object.entries(BOX).forEach(([k, [t, x, y]]) => { g += `<rect x="${x - bw(k) / 2}" y="${y - bh / 2}" width="${bw(k)}" height="${bh}" rx="6" fill="${k === 'air' ? '#e0f2fe' : k === 'plants' ? '#dcfce7' : k === 'fossil' ? '#e7e5e4' : '#fff'}" stroke="${INK}"/>` + T(x, y + 4, t, { size: 12, w: 600 }); });
    const svg = wrap(480, 290, g), title = 'The carbon cycle', i = r.int(0, ARR.length - 1), proc = ARR[i][2].replace(' (by decomposers)', '').replace(' and waste', '');
    if (r.f() < .55) return { title, spec: 'B4.10', kind: 'diagram', svg, q: `Which process is shown by arrow ${lab[i]}?`, o: [proc, ...others(proc, ['photosynthesis', 'respiration', 'combustion', 'feeding', 'decay', 'death', 'fossilisation'], r)], x: `Arrow ${lab[i]} goes from ${BOX[ARR[i][0]][0]} to ${BOX[ARR[i][1]][0]}: ${ARR[i][2]}.` };
    const want = r.pick(['photosynthesis', 'combustion']), k = ARR.findIndex(a => a[2] === want), wrong = ARR.map((a, j) => j).filter(j => j !== k).map(j => lab[j]);
    return { title, spec: 'B4.10', kind: 'diagram', svg, q: `Which arrow shows ${want}?`, o: [lab[k], ...others(lab[k], wrong, r)], x: want === 'photosynthesis' ? 'Photosynthesis is the only process that takes carbon dioxide out of the air: the arrow from the air to the plants.' : 'Combustion of fossil fuels releases carbon dioxide into the air.' };
  };

  /* ---------- osmosis: % change in mass against concentration (B2.17) ---------- */
  M.osmosis = r => {
    const tissue = r.pick(['potato', 'carrot', 'beetroot', 'apple']), x0 = r.pick([0.2, 0.25, 0.3, 0.35, 0.4]), k = r.pick([22, 28, 35]), unit = r.pick(['mol/dm³', 'M']);
    const f = c => k * (x0 - c) / (0.3 + c * .6), cs = [0, 0.2, 0.4, 0.6, 0.8, 1.0], dots = cs.map(c => [c, Math.round((f(c) + (r.f() - .5) * 2) * 10) / 10]);
    const hiV = Math.max(...dots.map(d => d[1])), loV = Math.min(...dots.map(d => d[1])), ys = hiV - loV > 50 ? 10 : 5, ymax = Math.ceil(hiV / ys) * ys + ys, ymin = Math.floor(loV / ys) * ys - ys;
    const svg = plot2({ xmax: 1, xstep: 0.2, ymin, ymax, ystep: ys, xl: `Sugar solution concentration (${unit})`, yl: 'Change in mass (%)', series: [{ pts: curve(f, 0, 1, 40), dots }] }), title = `Osmosis in ${tissue}`;
    const q = r.int(0, 2);
    if (q === 0) return { title, spec: 'B2.17', kind: 'graph', svg, q: `At what concentration would the ${tissue} pieces neither gain nor lose mass?`, o: [n(x0) + ' ' + unit, ...uniq(n(x0), [0, x0 + 0.2, x0 / 2, 1].map(n)).map(v => v + ' ' + unit)], x: `Read where the line crosses 0% change: about ${n(x0)} ${unit}. There the solution has the same water concentration as the cells, so there's no net osmosis.` };
    if (q === 1) return { title, spec: 'B2.15', kind: 'graph', svg, q: `Why did the ${tissue} pieces in 0 ${unit} (pure water) gain mass?`, o: ['Water moved into the cells by osmosis', 'Sugar moved into the cells by diffusion', 'Water moved out of the cells by osmosis', 'The cells grew by mitosis'], x: 'Pure water has a higher water concentration than the cells, so water moves in through the partially permeable membrane by osmosis.' };
    const c = r.pick([0.6, 0.8, 1.0]), v = dots.find(d => d[0] === c)[1]; return { title, spec: 'B2.17', kind: 'graph', svg, q: `What was the percentage change in mass at ${c} ${unit}?`, o: [n(v) + '%', ...uniq(n(v), [-v, v / 2, v - ys, v + ys].map(n)).map(x => x + '%')], x: `Read the cross at ${c} ${unit}: ${n(v)}%. It's negative because water left the cells by osmosis.` };
  };

  /* ---------- menstrual cycle hormones (B3.9) ---------- */
  M.menstrual = r => {
    const len = r.pick([26, 28, 28, 30, 32]), ov = len - 14, A = r.pick(['A', 'X', 'P']), Bn = { A: 'B', X: 'Y', P: 'Q' }[A], oFirst = r.int(0, 1);
    const oest = d => 10 + 70 * Math.exp(-(((d - (ov - 1)) / 3.2) ** 2)) + 25 * Math.exp(-(((d - (ov + 7)) / 4) ** 2)), prog = d => 6 + 74 * Math.exp(-(((d - (ov + 7)) / 3.8) ** 2));
    const extra = (px, py) => `<rect x="${px(0)}" y="${py(100) + 2}" width="${px(5) - px(0)}" height="10" fill="#fca5a5"/>` + T(px(0) + 2, py(100) + 22, 'bleeding', { size: 10, a: 'start' });
    const svg = plot2({ xmax: len, xstep: 4, ymax: 100, ystep: 20, xl: 'Day of cycle', yl: 'Hormone level (a.u.)', series: [{ pts: curve(oFirst ? oest : prog, 0, len, 80), label: A, lab: Math.round(80 * (oFirst ? ov - 1 : ov + 7) / len), col: '#2563eb' }, { pts: curve(oFirst ? prog : oest, 0, len, 80), label: Bn, lab: Math.round(80 * (oFirst ? ov + 7 : ov - 1) / len), col: '#dc2626', dash: 1 }], extra });
    const title = 'Menstrual cycle hormones', pL = oFirst ? Bn : A, eL = oFirst ? A : Bn, q = r.int(0, 2);
    if (q === 0) return { title, spec: 'B3.9', kind: 'graph', svg, q: 'Which line shows progesterone?', o: [pL, eL, 'Both', 'Neither'], x: `Progesterone rises after ovulation (around day ${ov}) and keeps the uterus lining thick; it peaks in the second half of the cycle. Oestrogen peaks just before ovulation.` };
    if (q === 1) return { title, spec: 'B3.9', kind: 'graph', svg, q: 'On about which day does ovulation happen?', o: ['Day ' + ov, ...uniq(ov, [ov - 9, ov + 7, 1, len]).map(d => 'Day ' + d)], x: `Ovulation is just after the oestrogen peak, about day ${ov} (14 days before the end of a ${len}-day cycle).` };
    return { title, spec: 'B3.9', kind: 'graph', svg, q: 'What happens when the progesterone level falls at the end of the cycle?', o: ['The uterus lining breaks down (menstruation)', 'An egg is released', 'The uterus lining thickens', 'Oestrogen stops being made for good'], x: 'Progesterone maintains the uterus lining. If no embryo implants, progesterone falls and the lining breaks down: the period starts.' };
  };

  /* ---------- quadrats: estimating a population (B4.2) ---------- */
  M.quadrat = r => {
    const Lm = r.pick([10, 20, 25, 50]), Wm = r.pick([10, 20, 40]), plant = r.pick(['daisies', 'dandelions', 'buttercups', 'clover plants']), dens = r.pick([2, 3, 4, 5, 6]);
    /* the field with five numbered quadrats, then each quadrat enlarged underneath so the plants can be counted */
    const fx = 20, fy = 20, fw = 400, fh = 150, scale = Math.min(fw / Lm, fh / Wm), FW = Lm * scale, FH = Wm * scale, qs = Math.max(8, scale);
    let g = `<rect x="${fx}" y="${fy}" width="${FW}" height="${FH}" fill="#dcfce7" stroke="${INK}" stroke-width="1.6"/>`;
    const nq = 5, quads = []; for (let t = 0; quads.length < nq && t < 3000; t++) { const gap = t < 1500 ? 14 : 2, q = [fx + 4 + r.f() * (FW - qs - 8), fy + 12 + r.f() * (FH - qs - 16)]; if (quads.every(p => Math.abs(p[0] - q[0]) > qs + gap || Math.abs(p[1] - q[1]) > qs + gap)) quads.push(q); }   // always five
    const counts = quads.map(() => Math.max(0, dens + r.int(-2, 3)));
    quads.forEach(([x, y], i) => { g += `<rect x="${x}" y="${y}" width="${qs}" height="${qs}" fill="#fff" stroke="${INK}" stroke-width="1.4"/>` + T(x + qs / 2, y - 3, i + 1, { size: 11, w: 700 }); });
    g += T(fx + FW / 2, fy + FH + 16, `${Lm} m`, { size: 12, w: 700 }) + T(fx + FW + 14, fy + FH / 2, `${Wm} m`, { size: 12, w: 700, rot: 90 });
    const by = fy + FH + 40, bs = 70;
    quads.forEach((_, i) => { const x = 20 + i * 82; g += `<rect x="${x}" y="${by}" width="${bs}" height="${bs}" fill="#f0fdf4" stroke="${INK}" stroke-width="1.6"/>` + T(x + bs / 2, by + bs + 16, `quadrat ${i + 1}`, { size: 11 });
      const pts = []; for (let t = 0; pts.length < counts[i] && t < 2000; t++) { const p = [x + 10 + r.f() * (bs - 20), by + 10 + r.f() * (bs - 20)]; if (pts.every(q => Math.hypot(q[0] - p[0], q[1] - p[1]) > 15)) pts.push(p); }
      pts.forEach(([px, py]) => { for (let k = 0; k < 5; k++) { const a = k * 1.2566; g += `<circle cx="${(px + Math.cos(a) * 4).toFixed(1)}" cy="${(py + Math.sin(a) * 4).toFixed(1)}" r="3" fill="#fff" stroke="#a16207" stroke-width=".7"/>`; } g += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="2.6" fill="#facc15"/>`; }); });
    g += T(20, by + bs + 34, `Each quadrat is 1 m × 1 m. Each ✿ is one of the ${plant}.`, { size: 11, a: 'start' });
    const mean = counts.reduce((a, b) => a + b, 0) / nq, est = mean * Lm * Wm, svg = wrap(440, by + bs + 44, g), title = 'Quadrat sampling';
    if (r.int(0, 1)) return { title, spec: 'B4.2', kind: 'diagram', svg, q: `What is the mean number of ${plant} per quadrat?`, o: [n(mean), ...uniq(n(mean), [Math.max(...counts), counts.reduce((a, b) => a + b, 0), mean + 1, Math.min(...counts) || mean / 2].map(n))], x: `Counts: ${counts.join(', ')}. Mean = ${counts.reduce((a, b) => a + b, 0)} ÷ ${nq} = ${n(mean)}.` };
    return { title, spec: 'B4.2', kind: 'diagram', svg, q: `Estimate the number of ${plant} in the whole field.`, o: [n(est), ...uniq(n(est), [mean * (Lm + Wm), counts.reduce((a, b) => a + b, 0) * Lm, est / 2, mean * Lm].map(n))], x: `Mean per 1 m² quadrat = ${n(mean)}. Area = ${Lm} × ${Wm} = ${Lm * Wm} m². Estimate = ${n(mean)} × ${Lm * Wm} = ${n(est)}.` };
  };
  /* ---------- reading scales: measuring cylinder, thermometer, meter dial, newton meter, ruler ---------- */
  function cylinder(x, y, val, max, step, h = 220) {   // measuring cylinder (cm³) with a meniscus; reading = bottom of the meniscus
    const py = v => y + h - v / max * h; let s = `<path d="M${x - 24} ${y - 14}V${y + h + 6}h48V${y - 14}" fill="#fff" stroke="${INK}" stroke-width="1.8"/><path d="M${x - 34} ${y + h + 6}h68v8h-68z" fill="#e5e7eb" stroke="${INK}"/>`;
    s += `<path d="M${x - 23} ${py(val) - 5}Q${x} ${py(val) + 5} ${x + 23} ${py(val) - 5}V${y + h + 5}h-46z" fill="#bfdbfe"/><path d="M${x - 23} ${py(val) - 5}Q${x} ${py(val) + 5} ${x + 23} ${py(val) - 5}" fill="none" stroke="#1d4ed8" stroke-width="1.4"/>`;
    const labEvery = [1, 2, 5, 10, 20, 25, 50].find(L => max / L <= 10 && Math.abs(L / step - Math.round(L / step)) < 1e-9) || 50;
    for (let k = 0; k * step <= max + 1e-9; k++) { const v = k * step, lab = Math.abs(v / labEvery - Math.round(v / labEvery)) < 1e-9, mid = k % 5 === 0; s += `<line x1="${x - 24}" y1="${py(v).toFixed(1)}" x2="${x - 24 + (lab ? 15 : mid ? 11 : 7)}" y2="${py(v).toFixed(1)}" stroke="${INK}"/>` + (lab && v > 0 ? T(x - 30, py(v) + 4, n(v), { size: 11, a: 'end' }) : ''); }
    return s + T(x + 30, y + h, 'cm³', { size: 11, a: 'start' });
  }
  M.scales = r => {
    const kind = r.pick(['cylinder', 'thermo', 'dial', 'newton', 'ruler']), title = 'Reading scales', spec = kind === 'thermo' ? 'C3.2' : kind === 'dial' ? 'P2.13' : kind === 'newton' ? 'P1.22' : kind === 'ruler' ? 'P1.22' : 'P5.4';
    const opts = (ans, wrongs, unit) => [n(ans) + unit, ...uniq(n(ans), wrongs.map(n)).map(v => v + unit)];
    if (kind === 'cylinder') { const [max, step] = r.pick([[50, 1], [100, 2], [100, 1], [250, 5], [10, 0.2]]), val = step * r.int(Math.round(max / step * .2), Math.round(max / step * .85)), svg = wrap(200, 270, cylinder(110, 30, val, max, step));
      return { title, spec: 'P5.4', kind: 'diagram', svg, q: 'What volume of liquid is in the measuring cylinder?', o: opts(val, [val + step, val - step, val + step * 5, val * 2], ' cm³'), x: `Each small division is ${n(step)} cm³. Read at eye level from the bottom of the meniscus: ${n(val)} cm³.` }; }
    if (kind === 'thermo') { const step = r.pick([0.5, 1, 2]), lo = r.pick([-10, 0, 10, 20]), hi = lo + step * 25, val = lo + step * r.int(2, 23), svg = wrap(200, 290, thermo(90, 40, val, lo, hi, step) + T(150, 296 - 8, '°C', { size: 12 }));
      return { title, spec, kind: 'diagram', svg, q: 'What temperature does the thermometer show?', o: opts(val, [val + step, val - step, val + 5 * step, val + 1], ' °C'), x: `Each small division is ${n(step)} °C: the liquid is at ${n(val)} °C.` }; }
    if (kind === 'dial') { const amm = r.int(0, 1), [max, step] = r.pick(amm ? [[1, 0.02], [5, 0.1], [10, 0.2], [3, 0.1]] : [[5, 0.1], [10, 0.2], [15, 0.5], [3, 0.1]]), val = step * r.int(Math.round(max / step * .15), Math.round(max / step * .9)), cx = 160, cy = 170, R = 120;
      let g = `<path d="M${cx - R - 14} ${cy + 16}V${cy - R - 20}h${2 * R + 28}V${cy + 16}z" fill="#fff" stroke="${INK}" stroke-width="1.8"/>`; const ang = v => -60 + v / max * 120, nk = Math.round(max / step);
      for (let k = 0; k <= nk; k++) { const v = k * step, big = k % 5 === 0, [x1, y1] = at(cx, cy, ang(v), R), [x2, y2] = at(cx, cy, ang(v), R - (big ? 14 : 8)); g += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${INK}"/>`; if (big && (nk <= 30 || k % 10 === 0)) { const [tx, ty] = at(cx, cy, ang(v), R + 12); g += T(tx.toFixed(1), (ty + 4).toFixed(1), n(v), { size: 11 }); } }
      const [nx, ny] = at(cx, cy, ang(val), R - 4); g += `<line x1="${cx}" y1="${cy}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="#dc2626" stroke-width="2.4"/><circle cx="${cx}" cy="${cy}" r="6" fill="${INK}"/>` + T(cx, cy - 40, amm ? 'A' : 'V', { size: 22, w: 700 });
      const svg = wrap(320, 200, g), u = amm ? ' A' : ' V';
      return { title, spec, kind: 'diagram', svg, q: `What does the ${amm ? 'ammeter' : 'voltmeter'} read?`, o: opts(val, [val + step, val - step, val + 5 * step, val * 2], u), x: `Each small division is ${n(step)}${u}. The needle points to ${n(val)}${u}.` }; }
    if (kind === 'newton') { const [max, step] = r.pick([[5, 0.1], [10, 0.2], [10, 0.5], [20, 0.5], [1, 0.02]]), val = step * r.int(Math.round(max / step * .15), Math.round(max / step * .9)), x = 120, y = 40, h = 220, py = v => y + v / max * h;
      let g = `<rect x="${x - 26}" y="${y - 20}" width="52" height="${h + 40}" rx="6" fill="#fef3c7" stroke="${INK}" stroke-width="1.8"/><rect x="${x - 8}" y="${y - 6}" width="16" height="${h + 12}" fill="#fff" stroke="${INK}"/>`;
      for (let k = 0; k * step <= max + 1e-9; k++) { const v = k * step, big = k % 5 === 0; g += `<line x1="${x + 8}" y1="${py(v).toFixed(1)}" x2="${x + (big ? 22 : 15)}" y2="${py(v).toFixed(1)}" stroke="${INK}"/>` + (big ? T(x + 30, py(v) + 4, n(v), { size: 10, a: 'start' }) : ''); }
      g += `<path d="M${x - 6} ${py(val)}h12" stroke="#dc2626" stroke-width="3"/><path d="M${x} ${py(val)}V${y + h + 34}" stroke="${INK}" stroke-width="2"/><path d="M${x - 14} ${y + h + 34}h28v24h-28z" fill="#9ca3af" stroke="${INK}"/>` + T(x, y - 26, 'N', { size: 13, w: 700 });
      return { title, spec, kind: 'diagram', svg: wrap(220, y + h + 66, g), q: 'What is the reading on the newton meter?', o: opts(val, [val + step, val - step, max - val, val + 5 * step], ' N'), x: `Each small division is ${n(step)} N. The red marker is at ${n(val)} N.` }; }
    /* ruler: a spring's length, or an object's length that doesn't start at zero */
    const mm = r.int(0, 1), start = r.pick([0, 0, 1, 2, 3]), len = r.int(25, 85) / 10, x0 = 30, px = v => x0 + v * 40;
    let g = `<rect x="${x0 - 10}" y="80" width="${px(10) - x0 + 20}" height="40" fill="#fef9c3" stroke="${INK}"/>`;
    for (let k = 0; k <= 100; k++) { const v = k / 10, big = k % 10 === 0, half = k % 5 === 0; g += `<line x1="${px(v)}" y1="80" x2="${px(v)}" y2="${80 + (big ? 16 : half ? 11 : 7)}" stroke="${INK}" stroke-width=".8"/>` + (big ? T(px(v), 112, k / 10, { size: 10 }) : ''); }
    g += `<rect x="${px(start)}" y="46" width="${px(start + len) - px(start)}" height="26" rx="4" fill="#93c5fd" stroke="${INK}"/><path d="M${px(start)} 72V80M${px(start + len)} 72V80" stroke="${INK}" stroke-dasharray="2 2"/>` + T(x0 + 200, 136, 'cm', { size: 11 });
    const ans = mm ? Math.round(len * 10) : len, u = mm ? ' mm' : ' cm', svg = wrap(470, 145, g);
    return { title, spec, kind: 'diagram', svg, q: `How long is the bar${mm ? ', in mm' : ''}?`, o: opts(ans, mm ? [Math.round((start + len) * 10), ans + 1, ans - 1, ans + 10] : [start + len, len + .1, len - .1, len + 1], u), x: `Measure from the start of the bar (${start} cm) to its end (${n(start + len)} cm): ${n(len)} cm${mm ? ` = ${ans} mm` : ''}. ${start ? 'It doesn\'t start at 0, so subtract.' : ''}` };
  };

  /* ---------- density by displacement (P5.3, P5.4) ---------- */
  M.density = r => {
    const [max, step] = r.pick([[100, 2], [100, 1], [250, 5], [50, 1]]), v1 = step * r.int(Math.round(max / step * .3), Math.round(max / step * .5)), vol = step * r.int(Math.max(2, Math.round(max / step * .1)), Math.round(max / step * .35)), v2 = v1 + vol;
    const rho = r.pick([2.5, 2.7, 3, 7.9, 8.9, 1.2, 0.8].filter(d => d * vol < 2000)), m = Math.round(rho * vol * 10) / 10, obj = r.pick(['a stone', 'a metal bolt', 'a lump of plasticine', 'a key']);
    let g = T(95, 20, 'before', { size: 13, w: 700 }) + cylinder(95, 40, v1, max, step) + T(265, 20, 'after', { size: 13, w: 700 }) + cylinder(265, 40, v2, max, step) + `<path d="M255 ${40 + 220 - 14}l10 -10 12 6 -4 12z" fill="#78716c" stroke="${INK}"/>`;
    g += `<rect x="330" y="200" width="100" height="56" rx="6" fill="#e5e7eb" stroke="${INK}"/><rect x="340" y="210" width="80" height="24" fill="#111"/>` + T(380, 228, `${m.toFixed(1)} g`, { size: 14, w: 700, fill: '#4ade80' }) + T(380, 270, 'mass of the object', { size: 10 });
    const svg = wrap(440, 290, g), d = m / vol, title = 'Density by displacement';
    if (r.int(0, 1)) return { title, spec: 'P5.4', kind: 'diagram', svg, q: `What is the volume of ${obj}?`, o: [n(vol) + ' cm³', ...uniq(n(vol), [v2, v1, v1 + v2, vol + step].map(n)).map(v => v + ' cm³')], x: `The water rose from ${n(v1)} cm³ to ${n(v2)} cm³: volume = ${n(v2)} − ${n(v1)} = ${n(vol)} cm³.` };
    return { title, spec: 'P5.3', kind: 'diagram', svg, q: `What is the density of ${obj}?`, o: [n(d) + ' g/cm³', ...uniq(n(d), [m / v2, vol / m, m * vol / 100, m / v1].map(n)).map(v => v + ' g/cm³')], x: `Volume = ${n(v2)} − ${n(v1)} = ${n(vol)} cm³. ρ = m ÷ V = ${m.toFixed(1)} ÷ ${n(vol)} = ${n(d)} g/cm³.` };
  };

  /* ---------- stopping distances (P1.19, P1.20) ---------- */
  M.stopping = r => {
    const ALL = [[20, 6, 6], [30, 9, 14], [40, 12, 24], [50, 15, 38], [60, 18, 55], [70, 21, 75]], rows = sh(ALL, r).slice(0, r.pick([3, 4])).sort((a, b) => a[0] - b[0]), wet = r.f() < .25;
    const data = rows.map(([s, t, b]) => [s, t, wet ? b * 2 : b]), maxD = Math.ceil(Math.max(...data.map(d => d[1] + d[2])) / 20) * 20, step = maxD > 120 ? 40 : 20, x0 = 80, W = 420, px = d => x0 + d / maxD * (W - x0 - 20);
    let g = ''; for (let d = 0; d <= maxD; d += step / 2) g += `<line x1="${px(d)}" y1="10" x2="${px(d)}" y2="${30 + data.length * 44}" stroke="${GRID}" stroke-width="${d % step ? .5 : 1}"/>` + (d % step ? '' : T(px(d), 46 + data.length * 44, d, { size: 11 }));
    data.forEach(([s, t, b], i) => { const y = 22 + i * 44; g += T(x0 - 8, y + 17, `${s} mph`, { size: 12, w: 700, a: 'end' }) + `<rect x="${px(0)}" y="${y}" width="${px(t) - px(0)}" height="24" fill="#fde68a" stroke="${INK}"/><rect x="${px(t)}" y="${y}" width="${px(t + b) - px(t)}" height="24" fill="#fca5a5" stroke="${INK}"/>`; });
    g += T((x0 + W) / 2, 66 + data.length * 44, 'Distance (m)', { size: 12, w: 600 }) + `<rect x="${x0}" y="${76 + data.length * 44}" width="14" height="12" fill="#fde68a" stroke="${INK}"/>` + T(x0 + 20, 86 + data.length * 44, 'thinking distance', { size: 11, a: 'start' }) + `<rect x="${x0 + 150}" y="${76 + data.length * 44}" width="14" height="12" fill="#fca5a5" stroke="${INK}"/>` + T(x0 + 170, 86 + data.length * 44, `braking distance${wet ? ' (wet road)' : ''}`, { size: 11, a: 'start' });
    const svg = wrap(W, 96 + data.length * 44, g), title = 'Stopping distances', [s, t, b] = r.pick(data), q = r.int(0, 2);
    if (q === 0) return { title, spec: 'P1.19', kind: 'graph', svg, q: `What is the total stopping distance at ${s} mph?`, o: [t + b + ' m', ...uniq(t + b, [b, t, b - t, t + b + step / 2]).map(v => v + ' m')], x: `Stopping distance = thinking + braking = ${t} + ${b} = ${t + b} m.` };
    if (q === 1) { const which = r.pick(['tired', 'icy', 'phone']); const ans = which === 'icy' ? 'Braking distance' : 'Thinking distance'; return { title, spec: 'P1.20', kind: 'graph', svg, q: which === 'icy' ? 'Which part of the stopping distance gets longer on an icy road?' : which === 'tired' ? 'Which part of the stopping distance gets longer if the driver is tired?' : 'Which part of the stopping distance gets longer if the driver is using a phone?', o: [ans, ans === 'Braking distance' ? 'Thinking distance' : 'Braking distance', 'Neither', 'Both by the same amount'], x: which === 'icy' ? 'Less friction between tyres and road: the brakes take longer to stop the car, so braking distance increases.' : 'The driver\'s reaction time is longer, so the car travels further before the brakes are applied: thinking distance increases.' }; }
    return { title, spec: 'P1.20', kind: 'graph', svg, q: 'How does braking distance change as speed goes up?', o: ['It increases more and more quickly', 'It increases by the same amount each time', 'It stays the same', 'It decreases'], x: 'Thinking distance goes up steadily with speed, but braking distance rises much faster (it depends on the kinetic energy, which depends on speed squared).' };
  };

  /* ---------- the motor effect: Fleming's left-hand rule (P6.12–P6.14) ---------- */
  M.motor = r => {
    const vert = r.int(0, 1), nFirst = r.int(0, 1), mode = r.pick(['dot', 'dot', 'line']), W = 360, H = 260, cx = 180, cy = 130; let g = '';
    const B = vert ? [0, nFirst ? -1 : 1, 0] : [nFirst ? 1 : -1, 0, 0];   // x right, y up, z out of the page; field goes N → S
    const poles = vert ? [[cx - 70, 20, 140, 50, nFirst ? 'N' : 'S'], [cx - 70, 190, 140, 50, nFirst ? 'S' : 'N']] : [[20, cy - 70, 60, 140, nFirst ? 'N' : 'S'], [280, cy - 70, 60, 140, nFirst ? 'S' : 'N']];
    poles.forEach(([x, y, w, h, p]) => { g += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${p === 'N' ? '#fecaca' : '#bfdbfe'}" stroke="${INK}" stroke-width="2"/>` + T(x + w / 2, y + h / 2 + 8, p, { size: 22, w: 700 }); });
    for (let k = -2; k <= 2; k++) { if (k === 0) continue; const [x1, y1, x2, y2] = vert ? [cx + k * 26, 74, cx + k * 26, 186] : [84, cy + k * 26, 276, cy + k * 26]; g += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#94a3b8" stroke-dasharray="5 4"/>`; }
    let I;
    if (mode === 'dot') { const out = r.int(0, 1); I = [0, 0, out ? 1 : -1]; g += `<circle cx="${cx}" cy="${cy}" r="16" fill="#fff" stroke="${INK}" stroke-width="2.4"/>` + (out ? `<circle cx="${cx}" cy="${cy}" r="4.5" fill="${INK}"/>` : `<path d="M${cx - 10} ${cy - 10}l20 20M${cx + 10} ${cy - 10}l-20 20" stroke="${INK}" stroke-width="2.4"/>`) + T(cx, cy + (vert ? 36 : 40), out ? 'current out of the page' : 'current into the page', { size: 11 }); }
    else { const s = r.pick([1, -1]); I = vert ? [s, 0, 0] : [0, s, 0]; const [x1, y1, x2, y2] = vert ? [cx - 120, cy, cx + 120, cy] : [cx, cy + 105, cx, cy - 105]; g += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#b45309" stroke-width="6"/>` + arrow(...(vert ? (s > 0 ? [cx - 40, cy - 14, cx + 30, cy - 14] : [cx + 40, cy - 14, cx - 30, cy - 14]) : (s > 0 ? [cx + 16, cy + 40, cx + 16, cy - 30] : [cx + 16, cy - 40, cx + 16, cy + 30])), '#b45309', 2) + T(vert ? cx : cx + 24, vert ? cy - 22 : cy, 'I', { size: 14, w: 700, a: 'start', fill: '#b45309' }); }
    const F = [I[1] * B[2] - I[2] * B[1], I[2] * B[0] - I[0] * B[2], I[0] * B[1] - I[1] * B[0]];   // F = I × B
    const DIR = { '0,1,0': 'up', '0,-1,0': 'down', '1,0,0': 'to the right', '-1,0,0': 'to the left', '0,0,1': 'out of the page', '0,0,-1': 'into the page' }, ans = DIR[F.join(',')];
    const svg = wrap(W, H, g), title = 'The motor effect';
    if (r.f() < .75) return { title, spec: 'P6.13', kind: 'diagram', svg, q: 'Which way is the force on the wire?', o: [ans, ...others(ans, Object.values(DIR), r)], x: `Left hand: First finger = Field (N → S), seCond finger = Current, thuMb = Motion (force). Here the force is ${ans}.` };
    return { title, spec: 'P6.14', kind: 'diagram', svg, q: 'What would make the force on the wire bigger?', o: ['A bigger current or a stronger magnet', 'Reversing the current', 'Swapping the magnets round', 'Using a thinner wire with the same current'], x: 'The force increases with the size of the current and the strength of the magnetic field. Reversing either one only reverses the direction.' };
  };

  /* ---------- alpha, beta, gamma penetration (P7.5, P7.6) ---------- */
  M.penetration = r => {
    const L = sh(['X', 'Y', 'Z'], r), rays = { alpha: L[0], beta: L[1], gamma: L[2] }, order = sh(['alpha', 'beta', 'gamma'], r), W = 440;
    let g = `<rect x="10" y="40" width="44" height="150" rx="6" fill="#fde68a" stroke="${INK}"/>` + T(32, 120, 'source', { size: 11, rot: -90 });
    const bars = [['paper', 150, 4, '#f5f5f4'], ['aluminium (a few mm)', 250, 10, '#cbd5e1'], ['lead (several cm)', 350, 26, '#6b7280']];
    bars.forEach(([nm, x, w, c]) => { g += `<rect x="${x}" y="30" width="${w}" height="170" fill="${c}" stroke="${INK}"/>` + T(x + w / 2, 222, nm, { size: 11 }); });
    order.forEach((ray, i) => { const y = 70 + i * 45, stop = ray === 'alpha' ? 150 : ray === 'beta' ? 250 : 376; g += `<path d="M54 ${y}H${stop}" stroke="#dc2626" stroke-width="2.4"${ray === 'gamma' ? '' : ''}/>` + arrowHead(ray === 'gamma' ? 430 : stop, y, 0, '#dc2626', 9) + (ray === 'gamma' ? `<path d="M376 ${y}H430" stroke="#dc2626" stroke-width="1.2" stroke-dasharray="4 3"/>` : '') + T(80, y - 8, rays[ray], { size: 14, w: 700 }); });
    const svg = wrap(W, 235, g), title = 'Penetrating power', want = r.pick(['alpha', 'beta', 'gamma']), q = r.int(0, 1);
    if (q === 0) return { title, spec: 'P7.5', kind: 'diagram', svg, q: `Which radiation is ${want === 'alpha' ? 'alpha (α)' : want === 'beta' ? 'beta (β⁻)' : 'gamma (γ)'}?`, o: [rays[want], ...L.filter(x => x !== rays[want])], x: 'Alpha is stopped by paper, beta by a few millimetres of aluminium, and gamma is only reduced by thick lead.' };
    return { title, spec: 'P7.5', kind: 'diagram', svg, q: `What is radiation ${rays[want]}, and why does it ${want === 'gamma' ? 'get through so much' : 'stop where it does'}?`, o: { alpha: ['Alpha: big, heavily ionising helium nuclei, stopped by paper', 'Gamma: an electromagnetic wave', 'Beta: a fast electron', 'Alpha: it has no charge'], beta: ['Beta: fast electrons, stopped by a few mm of aluminium', 'Alpha: stopped by aluminium', 'Gamma: stopped by aluminium', 'Beta: a helium nucleus'], gamma: ['Gamma: an electromagnetic wave, weakly ionising, reduced by thick lead', 'Beta: passes through lead', 'Alpha: very penetrating', 'Gamma: a fast electron'] }[want], x: 'The more strongly a radiation ionises, the quicker it loses energy and the less it penetrates: alpha < beta < gamma.' };
  };

  /* ---------- the electromagnetic spectrum (P3.10, P3.11) ---------- */
  M.emspec = r => {
    const EM = ['radio waves', 'microwaves', 'infrared', 'visible light', 'ultraviolet', 'X-rays', 'gamma rays'], rev = r.int(0, 1), list = rev ? EM.slice().reverse() : EM.slice(), hide = sh([0, 1, 2, 3, 4, 5, 6], r).slice(0, r.pick([1, 2])), W = 470, w = 64;
    let g = ''; list.forEach((nm, i) => { const x = 10 + i * w, hid = hide.includes(i); g += `<rect x="${x}" y="40" width="${w}" height="44" fill="${hid ? '#fff' : ['#e0e7ff', '#dbeafe', '#fee2e2', '#fef9c3', '#ede9fe', '#e5e7eb', '#d1fae5'][EM.indexOf(nm)]}" stroke="${INK}"/>` + (hid ? T(x + w / 2, 68, 'PQ'[hide.indexOf(i)], { size: 16, w: 700 }) : nm.split(' ').map((s, k, a) => T(x + w / 2, 66 + (k - (a.length - 1) / 2) * 13, s, { size: 11 })).join('')); });
    g += arrow(rev ? W - 20 : 20, 110, rev ? 20 : W - 20, 110, INK, 2) + T(W / 2, 128, 'wavelength gets shorter, frequency gets higher', { size: 12, w: 600 });
    g = g.replace(/<\/svg>$/, '');
    const svg = wrap(W, 140, g), i = hide[0], ans = list[i], title = 'Electromagnetic spectrum';
    if (r.int(0, 2)) return { title, spec: 'P3.11', kind: 'diagram', svg, q: `Which part of the spectrum is P?`, o: [ans, ...others(ans, EM, r)], x: `In order of decreasing wavelength: radio, microwaves, infrared, visible, ultraviolet, X-rays, gamma. P is ${ans}.` };
    const k = r.int(0, 6); return { title, spec: 'P3.12', kind: 'diagram', svg, q: `What ${EM[k].endsWith('s') ? 'are' : 'is'} ${EM[k]} used for?`, o: [['broadcasting and communications', 'cooking and satellite transmissions', 'heaters and night-vision equipment', 'optical fibres and photography', 'fluorescent lamps and detecting forged bank notes', 'seeing inside bodies and objects', 'sterilising food and medical equipment'][k], ...others('', ['broadcasting and communications', 'cooking and satellite transmissions', 'heaters and night-vision equipment', 'optical fibres and photography', 'fluorescent lamps and detecting forged bank notes', 'seeing inside bodies and objects', 'sterilising food and medical equipment'].filter((_, j) => j !== k), r)], x: 'Radio: broadcasting · microwaves: cooking, satellites · infrared: heaters, night vision · visible: fibres, photography · UV: fluorescent lamps, security marks · X-rays: medical images · gamma: sterilising.' };
  };

  /* ---------- gas laws (P5.20–P5.22) ---------- */
  M.gaslaw = r => {
    const title = 'Gas pressure', kind = r.int(0, 1) ? 'pV' : 'pT';
    if (kind === 'pV') { const k = r.pick([200, 300, 400, 600]), vmax = r.pick([40, 50, 60]), V1 = r.pick([10, 20].filter(v => v < vmax)), V2 = r.pick([20, 30, 40].filter(v => v !== V1 && v < vmax)), p = V => k / V, pmax = Math.ceil(p(5) / 20) * 20 / (k > 300 ? 1 : 1);
      const ymax = Math.ceil(k / 8 / 10) * 10, svg = plot2({ xmax: vmax, xstep: 10, ymax, ystep: ymax > 50 ? 10 : 5, xl: 'Volume (cm³)', yl: 'Pressure (kPa)', series: [{ pts: curve(p, k / ymax, vmax, 80) }], marks: [[V1, p(V1), 'A']] });
      if (r.int(0, 1)) return { title: 'Pressure and volume', spec: 'P5.22', kind: 'graph', svg, q: `The gas at A is squashed to ${V1 / 2} cm³ at the same temperature. What is its new pressure?`, o: [n(p(V1) * 2) + ' kPa', ...uniq(n(p(V1) * 2), [p(V1) / 2, p(V1), p(V1) + V1 / 2, p(V1) * 4].map(n)).map(v => v + ' kPa')], x: `p₁V₁ = p₂V₂: ${n(p(V1))} × ${V1} = p₂ × ${V1 / 2}, so p₂ = ${n(p(V1) * 2)} kPa. Halving the volume doubles the pressure.` };
      return { title: 'Pressure and volume', spec: 'P5.20', kind: 'graph', svg, q: 'Why does the pressure go up when the volume is made smaller (same temperature)?', o: ['The molecules hit the walls more often', 'The molecules move faster', 'The molecules get bigger', 'There are more molecules'], x: 'Same number of molecules at the same speed, but in a smaller space they collide with the walls more often, so the pressure is higher.' }; }
    const T1 = r.pick([250, 300, 350]), p1 = r.pick([80, 100, 120]), slope = p1 / T1, svg = plot2({ xmax: 400, xstep: 100, ymax: Math.ceil(slope * 400 / 20) * 20, ystep: 20, xl: 'Temperature (K)', yl: 'Pressure (kPa)', series: [{ pts: [[0, 0], [400, slope * 400]], dash: 0 }], marks: [[T1, p1, 'B']] });
    const q = r.int(0, 2);
    if (q === 0) { const T2 = r.pick([T1 * 2, T1 * 1.5, T1 / 2].filter(t => t <= 600 && t >= 100)); return { title: 'Pressure and temperature', spec: 'P5.21', kind: 'graph', svg, q: `The gas at B (${p1} kPa, ${T1} K) is heated to ${n(T2)} K at constant volume. What is the new pressure?`, o: [n(p1 * T2 / T1) + ' kPa', ...uniq(n(p1 * T2 / T1), [p1 * T1 / T2, p1 + T2 - T1, p1, p1 * 2 + 1].map(n)).map(v => v + ' kPa')], x: `p₁/T₁ = p₂/T₂: p₂ = ${p1} × ${n(T2)} ÷ ${T1} = ${n(p1 * T2 / T1)} kPa.` }; }
    if (q === 1) return { title: 'Pressure and temperature', spec: 'P5.16', kind: 'graph', svg, q: 'The line goes through 0 K. What is 0 K in °C?', o: ['−273 °C', '0 °C', '−100 °C', '273 °C'], x: '0 K is absolute zero, −273 °C: the molecules would have no kinetic energy and exert no pressure.' };
    return { title: 'Pressure and temperature', spec: 'P5.17', kind: 'graph', svg, q: `Point B is at ${T1} K. What is that in °C?`, o: [`${T1 - 273} °C`, `${T1 + 273} °C`, `${T1} °C`, `${273 - T1} °C`], x: `°C = K − 273 = ${T1} − 273 = ${T1 - 273} °C.` };
  };

  /* ---------- pressure in a liquid (P5.6, P5.7) ---------- */
  M.pressure = r => {
    const jets = r.f() < .4, W = 360, H = 300; let g = '';
    if (jets) { g += `<path d="M60 40V260h120V40" fill="none" stroke="${INK}" stroke-width="2"/><rect x="62" y="60" width="116" height="198" fill="#bfdbfe"/>`;
      const hs = sh([100, 160, 220], r), L = ['P', 'Q', 'R']; [100, 160, 220].forEach((y, i) => { const d = (y - 60) * 1.1; g += `<path d="M180 ${y}q${d * .6} 0 ${d} ${260 - y}" fill="none" stroke="#3b82f6" stroke-width="3"/>` + T(170, y - 6, L[i], { size: 13, w: 700, a: 'end' }); });
      const svg = wrap(W, H, g); return { title: 'Pressure in a liquid', spec: 'P5.7', kind: 'diagram', svg, q: 'Why does water squirt furthest from hole R?', o: ['Pressure is greater deeper in the liquid', 'Hole R is bigger', 'Water is denser at the bottom', 'Air pressure pushes harder at the bottom'], x: 'Pressure difference = height × density × g: the deeper the hole, the greater the pressure pushing the water out.' }; }
    const liquid = r.pick([['water', 1000], ['sea water', 1030], ['oil', 800]]), depthU = r.int(0, 1) ? 'm' : 'cm', depths = sh(depthU === 'm' ? [1, 2, 3, 4, 5] : [20, 30, 40, 50, 60, 80], r).slice(0, 3).sort((a, b) => a - b), dmax = depthU === 'm' ? 6 : 100, py = d => 40 + d / dmax * 220;
    g += `<path d="M60 30V270h220V30" fill="none" stroke="${INK}" stroke-width="2"/><rect x="62" y="40" width="216" height="228" fill="#bfdbfe" opacity=".8"/>` + T(170, 34, 'surface', { size: 11 });
    const L = sh(['A', 'B', 'C'], r); depths.forEach((d, i) => { const x = 110 + i * 60; g += `<circle cx="${x}" cy="${py(d)}" r="5" fill="${INK}"/>` + T(x + 9, py(d) + 4, L[i], { size: 13, w: 700, a: 'start' }) + `<path d="M${x - 14} 40V${py(d)}" stroke="#555" stroke-dasharray="3 3"/>` + T(x - 18, (40 + py(d)) / 2, `${d} ${depthU}`, { size: 10, a: 'end' }); });
    g += T(300, 280, liquid[0], { size: 12, a: 'end' });
    const svg = wrap(W, H, g), q = r.int(0, 1), deep = depths[2], i = r.int(0, 2), h = depthU === 'm' ? depths[i] : depths[i] / 100, dp = h * liquid[1] * 10;
    if (q === 0) return { title: 'Pressure in a liquid', spec: 'P5.7', kind: 'diagram', svg, q: 'At which point is the pressure due to the liquid greatest?', o: [L[2], L[0], L[1], 'The same at all three'], x: `Pressure increases with depth (p = hρg), so the deepest point, ${L[2]}, has the greatest pressure.` };
    return { title: 'Pressure in a liquid', spec: 'P5.7', kind: 'diagram', svg, q: `The density of ${liquid[0]} is ${liquid[1]} kg/m³ and g = 10 N/kg. What is the pressure due to the liquid at ${L[i]}?`, o: [n(dp) + ' Pa', ...uniq(n(dp), [depths[i] * liquid[1] * 10, dp / 10, h * liquid[1], dp * 10].map(n)).map(v => v + ' Pa')], x: `p = hρg = ${n(h)} m × ${liquid[1]} × 10 = ${n(dp)} Pa.${depthU === 'cm' ? ` (Convert ${depths[i]} cm to ${n(h)} m first.)` : ''}` };
  };

  const MAKERS = [
    ['vt', 'P1.8'], ['dt', 'P1.3'], ['forces', 'P1.15'], ['stopping', 'P1.19'], ['fe', 'P1.23'], ['scales', 'P5.4'], ['density', 'P5.3'], ['circuit', 'P2.19'], ['iv', 'P2.9'],
    ['wave', 'P3.3'], ['emspec', 'P3.11'], ['reflect', 'P3.15'], ['ray', 'P3.16'], ['tir', 'P3.21'], ['sankey', 'P4.4'], ['pressure', 'P5.7'], ['gaslaw', 'P5.20'],
    ['magnet', 'P6.4'], ['motor', 'P6.13'], ['penetration', 'P7.5'], ['half', 'P7.13'],
    ['particles', 'C1.1'], ['cool', 'C1.1'], ['separation', 'C1.10'], ['chrom', 'C1.12'], ['nucleus', 'C1.16'], ['atom', 'C1.22'], ['ionic', 'C1.40'], ['covalent', 'C1.46'],
    ['airO2', 'C2.14'], ['displace', 'C2.16'], ['ph', 'C2.29'], ['calorim', 'C3.3'], ['profile', 'C3.5'], ['rate', 'C3.10'], ['table', 'C3.15'], ['fraccol', 'C4.8'], ['displayed', 'C4.21'],
    ['cell', 'B2.2'], ['enzyme', 'B2.11'], ['osmosis', 'B2.17'], ['photo', 'B2.20'], ['leaf', 'B2.21'], ['gut', 'B2.27'], ['thorax', 'B2.46'], ['heart', 'B2.65'], ['reflex', 'B2.90'], ['eye', 'B2.91'],
    ['flower', 'B3.3'], ['menstrual', 'B3.9'], ['punnett', 'B3.23'], ['pedigree', 'B3.24'], ['quadrat', 'B4.2'], ['foodweb', 'B4.4'], ['pyramid', 'B4.7'], ['carbon', 'B4.10'], ['bars', '—']];
  function make(name, hard) { const r = rnd(); r.hard = !!hard; const q = M[name](r); q.o = q.o.slice(0, 4); return q; }
  return { make, MAKERS, M };
})();
