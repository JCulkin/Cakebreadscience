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
  const elec = (x, y, cross) => cross ? `<path d="M${(x - 3.5).toFixed(1)} ${(y - 3.5).toFixed(1)}l7 7M${(x + 3.5).toFixed(1)} ${(y - 3.5).toFixed(1)}l-7 7" stroke="#c8001e" stroke-width="2"/>` : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="#1e3a8a"/>`;
  const sh = (a, r) => a.slice().sort(() => r.f() - .5);
  const others = (ans, pool, r) => sh(pool.filter(x => x !== ans), r).slice(0, 3);
  /* up to 8 electrons in 4 pairs (top, right, bottom, left); 2 on a first shell sit top and bottom */
  const ringXY = (cnt, i, rad) => { const ang = cnt <= 2 && rad < 30 ? [0, Math.PI][i] : [0, Math.PI / 2, Math.PI, 1.5 * Math.PI][Math.floor(i / 2) % 4] + (i % 2 ? .3 : -.3); return [Math.sin(ang) * rad, -Math.cos(ang) * rad]; };

  /* ---------- ionic dot-and-cross: outer shells only (GCSE standard), sometimes full shells, and formation diagrams ---------- */
  const EL = { Li: [2, 1], Na: [2, 8, 1], K: [2, 8, 8, 1], Mg: [2, 8, 2], Ca: [2, 8, 8, 2], F: [2, 7], Cl: [2, 8, 7], O: [2, 6], S: [2, 8, 6] };
  const NAMES = { Li: 'lithium', Na: 'sodium', K: 'potassium', Mg: 'magnesium', Ca: 'calcium', F: 'fluoride', Cl: 'chloride', O: 'oxide', S: 'sulfide' };
  /* one particle: shells = electron counts inside out; outerOther = how many outer electrons came from the other atom; brackets for ions */
  function particle(cx, cy, sym, shells, own, outerOther, charge, full) {
    let g = `<circle cx="${cx}" cy="${cy}" r="13" fill="#eeeae0" stroke="${INK}"/>` + T(cx, cy + 5, sym, { size: 13, w: 700 });
    const list = full ? shells : shells.slice(-1), base = full ? 0 : shells.length - 1;
    list.forEach((cnt, k) => { const rad = 30 + (full ? k : 0) * 14; if (!(cnt === 0 && !full && charge)) g += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="#666"/>`;
      const last = k === list.length - 1;
      for (let i = 0; i < cnt; i++) { const [dx, dy] = ringXY(cnt, i, rad); g += elec(cx + dx, cy + dy, (last && i >= cnt - outerOther) ? !own : own); } });
    const R0 = !full && list[0] === 0 ? 22 : 30 + (full ? list.length - 1 : 0) * 14 + 9;
    if (charge) g += `<path d="M${cx - R0 + 6} ${cy - R0}h-6v${2 * R0}h6M${cx + R0 - 6} ${cy - R0}h6v${2 * R0}h-6" fill="none" stroke="${INK}" stroke-width="1.6"/>` + T(cx + R0 + 9, cy - R0 + 7, charge, { size: 14, w: 700 });
    return { g, R: R0 };
  }
  M.ionic = r => {
    const C = r.pick(r.hard ? [['Mg', 'Cl', 1, 2], ['Ca', 'Cl', 1, 2], ['Na', 'O', 2, 1], ['K', 'O', 2, 1], ['Li', 'O', 2, 1], ['Mg', 'O', 1, 1], ['Ca', 'S', 1, 1], ['Na', 'Cl', 1, 1]]
      : [['Na', 'Cl', 1, 1], ['K', 'Cl', 1, 1], ['Li', 'F', 1, 1], ['Mg', 'O', 1, 1], ['Ca', 'O', 1, 1], ['Na', 'F', 1, 1]]);
    const [m, a, nm, na] = C, lose = EL[m].slice(-1)[0], gain = 8 - EL[a].slice(-1)[0];
    const sub = k => k > 1 ? '₂' : '', formula = `${m}${sub(nm)}${a}${sub(na)}`;
    const mode = r.hard && r.f() < .5 ? 'form' : r.f() < .25 ? 'full' : 'outer';
    const qMark = `${lose === 1 ? '+' : lose + '+'}`, aMark = `${gain === 1 ? '−' : gain + '−'}`;
    let svg, W;
    if (mode === 'form') {   /* before → after: atoms with their outer electrons, an arrow, then the ions */
      const atoms = [...Array(nm).fill(m), ...Array(na).fill(a)], gap = 14;
      const before = atoms.map((s, i) => [s, i < nm]), after = before;
      const wB = 39 * 2, wAm = 22 * 2 + 30, wAa = 39 * 2 + 30;
      W = 30 + atoms.length * (wB + gap) + 70 + after.reduce((t, [, met]) => t + (met ? wAm : wAa) + gap, 0) + 10;
      let g = '', x = 30;
      before.forEach(([s, metal]) => { x += wB / 2; g += particle(x, 95, s, [EL[s].slice(-1)[0]], metal ? 0 : 1, 0, '', false).g; x += wB / 2 + gap; });
      g += `<path d="M${x} 95h40" stroke="${INK}" stroke-width="2.5"/><path d="M${x + 48} 95l-10 -6v12z" fill="${INK}"/>`; x += 70;
      after.forEach(([s, metal]) => { const ww = metal ? wAm : wAa; x += ww / 2 - 10; g += metal ? particle(x, 95, s, [0], 0, 0, qMark, false).g : particle(x, 95, s, [8], 1, gain, aMark, false).g; x += ww / 2 + 10 + gap; });
      g += T(W - 10, 185, 'outer shells only', { size: 11, fill: '#555', a: 'end' });
      svg = wrap(W, 195, g + `<g transform="translate(20 178)">${elec(0, -4, 0)}${T(8, 0, m, { size: 11, a: 'start' })}${elec(40, -4, 1)}${T(48, 0, a, { size: 11, a: 'start' })}</g>`);
    } else {
      const full = mode === 'full', ions = [...Array(nm).fill('m'), ...Array(na).fill('a')];
      const order = nm === 2 ? ['m', 'a', 'm'] : na === 2 ? ['a', 'm', 'a'] : ['m', 'a'];
      const step = full ? 175 : 130; W = Math.max(380, order.length * step + 40); let g = '', x = W / 2 - (order.length - 1) * step / 2;
      order.forEach(t => { const p = t === 'm' ? particle(x, 100, m, full ? EL[m].slice(0, -1) : [0], 0, 0, qMark, full) : particle(x, 100, a, full ? [...EL[a].slice(0, -1), 8] : [8], 1, gain, aMark, full); g += p.g; x += step; });
      g += `<g transform="translate(${W / 2 - 110} ${full ? 205 : 185})">${elec(0, -4, 0)}${T(8, 0, `${m} electron`, { size: 11, a: 'start' })}${elec(110, -4, 1)}${T(118, 0, `${a} electron`, { size: 11, a: 'start' })}</g>`;
      svg = wrap(W, full ? 215 : 195, g);
    }
    const q = r.int(0, 2), title = mode === 'form' ? 'Dot-and-cross: forming ions' : `Dot-and-cross: ionic${mode === 'full' ? ' (all shells)' : ''}`;
    if (q === 0) return { title, spec: 'C1.40', kind: 'diagram', svg, q: 'Which compound does this diagram show?', o: [formula, ...others(formula, ['NaCl', 'KCl', 'LiF', 'MgO', 'CaO', 'NaF', 'MgCl₂', 'CaCl₂', 'Na₂O', 'K₂O', 'Li₂O', 'CaS', 'MgCl', 'NaO'], r)], x: `${NAMES[m]} ${NAMES[a]}: each ${m} atom loses ${lose} electron${lose > 1 ? 's' : ''} and each ${a} atom gains ${gain}, so the formula is ${formula}.` };
    if (q === 1) return { title, spec: 'C1.38', kind: 'diagram', svg, q: `What is the charge on the ${NAMES[a]} ion?`, o: [aMark.replace('−', '−'), ...others(aMark, ['−', '2−', '3−', '+', '2+'], r)], x: `${a} has ${EL[a].slice(-1)[0]} outer electrons and gains ${gain} to fill its outer shell: ${gain} extra negative charge${gain > 1 ? 's' : ''}, so ${aMark}.` };
    return { title, spec: 'C1.40', kind: 'diagram', svg, q: `How many electrons does each ${m} atom lose?`, o: [String(lose), ...others(String(lose), ['1', '2', '3', '6', '7', '8'], r)], x: `${m} is in group ${lose}: it loses its ${lose} outer electron${lose > 1 ? 's' : ''} to get a full outer shell, becoming ${m}${qMark}.` };
  };

  /* ---------- covalent dot-and-cross: overlapping outer shells, shared pairs in the overlap ---------- */
  const MOLS = {
    'H₂': { atoms: [['H', 0], ['H', 1]], bonds: [[0, 1, 1]], lp: [0, 0] }, 'Cl₂': { atoms: [['Cl', 0], ['Cl', 1]], bonds: [[0, 1, 1]], lp: [3, 3] },
    'HCl': { atoms: [['H', 1], ['Cl', 0]], bonds: [[0, 1, 1]], lp: [0, 3] }, 'O₂': { atoms: [['O', 0], ['O', 1]], bonds: [[0, 1, 2]], lp: [2, 2] },
    'N₂': { atoms: [['N', 0], ['N', 1]], bonds: [[0, 1, 3]], lp: [1, 1] },
    'H₂O': { c: ['O', 2], lig: [['H', 0, 1, 0], ['H', 90, 1, 0]] }, 'NH₃': { c: ['N', 1], lig: [['H', 180, 1, 0], ['H', 0, 1, 0], ['H', 90, 1, 0]] },
    'CH₄': { c: ['C', 0], lig: [['H', 0, 1, 0], ['H', 90, 1, 0], ['H', 180, 1, 0], ['H', 270, 1, 0]] }, 'CO₂': { c: ['C', 0], lig: [['O', 0, 2, 2], ['O', 180, 2, 2]] },
  };
  const RAD = s => s === 'H' ? 24 : 34;
  function molecule(f) {
    const D = MOLS[f], at = [], bonds = [];
    const dist = (a, b, o) => RAD(a) + RAD(b) - 20 - (o - 1) * 3;
    if (D.c) { at.push({ s: D.c[0], x: 0, y: 0, lp: D.c[1], mark: 0 }); D.lig.forEach(([s, ang, o, lp]) => { const d = dist(D.c[0], s, o), t = ang * Math.PI / 180; at.push({ s, x: Math.cos(t) * d, y: Math.sin(t) * d, lp, mark: 1 }); bonds.push([0, at.length - 1, o]); }); }
    else { const d = dist(D.atoms[0][0], D.atoms[1][0], D.bonds[0][2]); D.atoms.forEach(([s, mk], i) => at.push({ s, x: i ? d : 0, y: 0, lp: D.lp[i], mark: mk })); bonds.push(...D.bonds); }
    const xs = at.map(a => a.x), ys = at.map(a => a.y), pad = 44, cxm = (Math.min(...xs) + Math.max(...xs)) / 2, cym = (Math.min(...ys) + Math.max(...ys)) / 2;
    const W = Math.max(230, Math.max(...xs) - Math.min(...xs) + 2 * pad), H = Math.max(150, Math.max(...ys) - Math.min(...ys) + 2 * pad), x0 = cxm - W / 2, y0 = cym - H / 2;
    let g = '';
    at.forEach(a => { g += `<circle cx="${a.x}" cy="${a.y}" r="${RAD(a.s)}" fill="#93c5fd" fill-opacity=".22" stroke="${INK}" stroke-width="1.5"/>`; });   // see-through, so each overlap shows as a darker lens
    const dirs = at.map(() => []);
    bonds.forEach(([i, j, o]) => {
      const A = at[i], B = at[j], dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d, px = -uy, py = ux;
      const a = (d * d + RAD(A.s) ** 2 - RAD(B.s) ** 2) / (2 * d), mx = A.x + ux * a, my = A.y + uy * a;   // centre of the overlap
      for (let k = 0; k < o; k++) { const off = (k - (o - 1) / 2) * 11; g += elec(mx - ux * 4.5 + px * off, my - uy * 4.5 + py * off, A.mark) + elec(mx + ux * 4.5 + px * off, my + uy * 4.5 + py * off, B.mark); }
      dirs[i].push(Math.atan2(dy, dx)); dirs[j].push(Math.atan2(-dy, -dx));
    });
    at.forEach((a, i) => {
      const R = RAD(a.s), base = dirs[i][0] || 0, slots = (dirs[i].length === 1 && a.lp === 2 ? [Math.PI / 2, -Math.PI / 2] : [Math.PI, Math.PI / 2, -Math.PI / 2, 0]).map(o => base + o).filter(t => dirs[i].every(b => Math.abs(Math.atan2(Math.sin(t - b), Math.cos(t - b))) > .6));
      slots.slice(0, a.lp).forEach(t => { const cx = a.x + Math.cos(t) * R, cy = a.y + Math.sin(t) * R, px = -Math.sin(t) * 5.5, py = Math.cos(t) * 5.5; g += elec(cx + px, cy + py, a.mark) + elec(cx - px, cy - py, a.mark); });
      const out = dirs[i].length === 1 ? (a.s === 'H' ? -8 : -10) : 0, t0 = dirs[i][0] || 0;
      g += T(a.x + Math.cos(t0) * out, a.y + Math.sin(t0) * out + 6, a.s, { size: 17, w: 700 });
    });
    return `<svg viewBox="${x0} ${y0} ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-height:260px;background:#fff" preserveAspectRatio="xMidYMid meet">${g}</svg>`;
  }
  M.covalent = r => {
    const pool = r.hard ? ['O₂', 'N₂', 'CO₂', 'H₂O', 'NH₃', 'Cl₂'] : ['H₂', 'Cl₂', 'HCl', 'H₂O', 'NH₃', 'CH₄'], f = r.pick(pool), D = MOLS[f], svg = molecule(f);
    const bondsOf = D.c ? D.lig.reduce((t, l) => t + l[2], 0) : D.bonds[0][2], center = D.c ? D.c[0] : D.atoms[0][0], lpC = D.c ? D.c[1] : D.lp[0];
    const multi = !D.c && D.bonds[0][2] > 1 ? (D.bonds[0][2] === 2 ? 'a double bond' : 'a triple bond') : f === 'CO₂' ? 'two double bonds' : null;
    const q = r.int(0, multi ? 3 : 2);
    if (q === 0) return { title: 'Dot-and-cross: covalent', spec: 'C1.46', kind: 'diagram', svg, q: 'Which molecule does this diagram show?', o: [f, ...others(f, ['H₂', 'Cl₂', 'HCl', 'H₂O', 'NH₃', 'CH₄', 'O₂', 'N₂', 'CO₂'], r)], x: `Count the atoms and the shared pairs in the overlaps: ${f}.` };
    if (q === 1) return { title: 'Dot-and-cross: covalent', spec: 'C1.46', kind: 'diagram', svg, q: `How many pairs of electrons are shared in ${f}?`, o: [String(bondsOf), ...others(String(bondsOf), ['1', '2', '3', '4', '6', '8'], r)], x: `Count the dot-and-cross pairs in the overlaps: ${bondsOf}.` };
    if (q === 2) return { title: 'Dot-and-cross: covalent', spec: 'C1.46', kind: 'diagram', svg, q: `How many lone pairs (pairs not shared) does ${D.c ? 'the ' + center + ' atom' : 'each ' + center + ' atom'} have?`, o: [String(lpC), ...others(String(lpC), ['0', '1', '2', '3', '4'], r)], x: `Count the pairs on ${center} that are outside the overlaps: ${lpC}.` };
    return { title: 'Dot-and-cross: covalent', spec: 'C1.46', kind: 'diagram', svg, q: `What kind of bonding does ${f} have?`, o: [multi, ...others(multi, ['a single bond', 'a double bond', 'a triple bond', 'two double bonds', 'an ionic bond'], r)], x: `${multi === 'a triple bond' ? 'Three' : 'Two'} shared pairs between the same two atoms make ${multi === 'a triple bond' ? 'a triple' : 'a double'} bond.` };
  };

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
      const k = kind === 'series2' ? 2 : 3, Rs = Array.from({ length: k }, () => r.pick([2, 3, 4, 6, 8, 12])), Rt = Rs.reduce((a, b) => a + b, 0), I = V / Rt, vi = r.int(0, k - 1);
      let g = wire([[50, 70], [350, 70], [350, 190], [50, 190], [50, 70]]); const xs = Rs.map((_, i) => 50 + (i + 1) * 300 / (k + 1));
      xs.forEach((x, i) => { g += SYM.res(x, 70) + lab(x, 95, `R${i + 1} = ${Rs[i]} Ω`); });
      g += SYM.A(350, 130) + SYM[V > 9 ? 'batt' : 'cell'](170, 190) + lab(170, 222, `${V} V`) + SYM.sw(260, 190);
      g += wire([[xs[vi] - 32, 70], [xs[vi] - 32, 28], [xs[vi] + 32, 28], [xs[vi] + 32, 70]]) + dotJ(xs[vi] - 32, 70) + dotJ(xs[vi] + 32, 70) + SYM.V(xs[vi], 28);
      const svg = wrap(400, 235, g), q = r.int(0, 2);
      if (q === 0) return { title: 'Circuit: series', spec: 'P2.19', kind: 'diagram', svg, q: 'The switch is closed. What does the ammeter read?', o: [n(I) + ' A', ...uniq(n(I), [V / Rs[0], V * Rt, Rt / V, V / Rs.length].map(v => n(v))).map(v => v + ' A')], x: `Series: R = ${Rs.join(' + ')} = ${Rt} Ω. I = V ÷ R = ${V} ÷ ${Rt} = ${n(I)} A.` };
      if (q === 1) return { title: 'Circuit: series', spec: 'P2.19', kind: 'diagram', svg, q: 'The switch is closed. What does the voltmeter read?', o: [n(I * Rs[vi]) + ' V', ...uniq(n(I * Rs[vi]), [V, V / k, V - I * Rs[vi], Rs[vi], V * 2, I, Rt].map(v => n(v))).map(v => v + ' V')], x: `I = ${V} ÷ ${Rt} = ${n(I)} A, the same everywhere in a series circuit. V = I × R = ${n(I)} × ${Rs[vi]} = ${n(I * Rs[vi])} V.` };
      return { title: 'Circuit: series', spec: 'P2.19', kind: 'diagram', svg, q: 'What is the total resistance of the circuit?', o: [Rt + ' Ω', ...uniq(Rt, [Math.max(...Rs), Rs.reduce((a, b) => a * b, 1), n(1 / Rs.reduce((a, b) => a + 1 / b, 0))].map(Number)).map(v => n(v) + ' Ω')], x: `In series, resistances add: ${Rs.join(' + ')} = ${Rt} Ω.` };
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
    const z = r.int(r.hard ? 11 : 3, r.hard ? 20 : 18), sh0 = config(z), cx = 140, cy = 120;
    let g = `<circle cx="${cx}" cy="${cy}" r="14" fill="#fde68a" stroke="${INK}"/>` + T(cx, cy + 5, '?', { size: 14, w: 700 });
    sh0.forEach((c, k) => { const rad = 28 + k * 22; g += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="#666"/>`; for (let i = 0; i < c; i++) { const [dx, dy] = ringXY(c, i, rad); g += elec(cx + dx, cy + dy, 1); } });
    const svg = wrap(280, 240, g), cfg = sh0.join('.'), grp = z === 2 ? 0 : sh0[sh0.length - 1] === 8 ? 0 : sh0[sh0.length - 1], q = r.int(0, 2);
    if (q === 0) return { title: 'Electron shells', spec: 'C1.22', kind: 'diagram', svg, q: 'Which element has this electronic configuration?', o: [ELN[z - 1], ...others(ELN[z - 1], [ELN[z - 2], ELN[z] || ELN[z - 3], ELN[(z + 7) % 20], ELN[(z + 9) % 20]].filter(Boolean), r)], x: `${z} electrons (${cfg}), so ${z} protons: ${ELN[z - 1]} (${ELS[z - 1]}).` };
    if (q === 1) return { title: 'Electron shells', spec: 'C1.22', kind: 'diagram', svg, q: 'What is the electronic configuration shown?', o: [cfg, ...others(cfg, [config(z - 1).join('.'), config(z + 1).join('.'), sh0.slice().reverse().join('.'), [Math.min(z, 2), z - 2].join('.')], r)], x: `Count the electrons in each shell from the inside: ${cfg}.` };
    return { title: 'Electron shells', spec: 'C1.24', kind: 'diagram', svg, q: 'Which group and period of the Periodic Table is this element in?', o: [...new Set([`Group ${grp}, period ${sh0.length}`, `Group ${sh0.length}, period ${grp}`, `Group ${grp}, period ${sh0.length + 1}`, `Group ${grp + 1}, period ${sh0.length}`, `Group ${sh0.length + 1}, period ${grp}`])], x: `Number of shells = period (${sh0.length}). Electrons in the outer shell = group (${grp || '0 — a full outer shell'}).` };
  };

  /* Sankey diagram: black and white, each transfer its own outlined band, widths to scale */
  M.sankey = r => {
    const dev = r.pick([['electric motor', 'kinetic', ['thermal', 'sound']], ['filament lamp', 'light', ['thermal']], ['LED lamp', 'light', ['thermal']], ['kettle', 'heating the water', ['heating the air', 'sound']], ['television', 'light and sound', ['thermal']], ['car engine', 'kinetic', ['thermal', 'sound']]]);
    const E = r.pick([100, 200, 400, 500, 1000]), useP = { 'filament lamp': 10, 'LED lamp': r.pick([70, 80]), kettle: r.pick([80, 90]), 'car engine': r.pick([20, 30]), television: r.pick([40, 50]) }[dev[0]] || r.pick([40, 60, 75]);
    const use = E * useP / 100, waste = E - use, ws = dev[2].length === 2 ? [waste * .8, waste * .2] : [waste];
    const sc = 160 / E, y0 = 40, H = 160, xi = 110, ybot = y0 + H + 34, gap = 3;
    let g = `<rect x="20" y="${y0}" width="${xi - 20}" height="${H}" fill="#fff" stroke="${INK}" stroke-width="2"/>` + T(65, y0 + H / 2 - 2, `${E} J`, { size: 14, w: 700 }) + T(65, y0 + H / 2 + 15, 'electrical', { size: 12 });
    const band = (a, t) => [a + (t > 10 ? gap / 2 : .5), Math.max(3, t - (t > 10 ? gap : 1))];   // a little gap between bands so each reads as its own box
    const [ua, ut] = band(y0, use * sc), ux = 400, uh = Math.min(16, ut / 2 + 6);
    g += `<path d="M${xi} ${ua}H${ux}L${ux + uh} ${ua + ut / 2}L${ux} ${ua + ut}H${xi}z" fill="#fff" stroke="${INK}" stroke-width="2"/>`
      + T(ux + uh + 8, ua + ut / 2, `${use} J`, { size: 13, w: 700, a: 'start' }) + T(ux + uh + 8, ua + ut / 2 + 15, `${dev[1]} (useful)`, { size: 11, a: 'start' });
    let y = y0 + use * sc; const turn = ws.length === 2 ? [300, 165] : [220];
    ws.forEach((w, i) => { const [a, t] = band(y, w * sc), xb = turn[i], tip = Math.min(14, Math.max(8, t / 2));
      g += `<path d="M${xi} ${a}H${xb + t}V${ybot}L${xb + t / 2} ${ybot + tip}L${xb} ${ybot}V${a + t}H${xi}z" fill="#fff" stroke="${INK}" stroke-width="2"/>`
        + T(xb + t / 2, ybot + tip + 16, `${n(w)} J`, { size: 13, w: 700 }) + T(xb + t / 2, ybot + tip + 31, `${dev[2][i]} (wasted)`, { size: 11 });
      y += w * sc; });
    g += T(530, 22, 'Drawn to scale', { size: 11, a: 'end', fill: '#555' });
    const svg = wrap(540, ybot + 90, g), eff = use / E * 100, q = r.int(0, ws.length === 2 ? 2 : 1);
    if (q === 0) return { title: 'Sankey diagram', spec: 'P4.4', kind: 'diagram', svg, q: `What is the efficiency of the ${dev[0]}?`, o: [n(eff) + '%', ...uniq(n(eff), [waste / E * 100, E / use, use / waste * 100, eff / 2].map(n)).map(v => v + '%')], x: `Efficiency = useful energy out ÷ total energy in × 100 = ${use} ÷ ${E} × 100 = ${n(eff)}%.` };
    if (q === 1) return { title: 'Sankey diagram', spec: 'P4.3', kind: 'diagram', svg, q: 'How much energy is wasted altogether?', o: [waste + ' J', ...uniq(waste, [use, E, ws[0] === waste ? E + use : ws[0], E - waste / 2]).map(v => n(v) + ' J')], x: `Energy is conserved: wasted = in − useful = ${E} − ${use} = ${waste} J.` };
    return { title: 'Sankey diagram', spec: 'P4.3', kind: 'diagram', svg, q: 'Why is the arrow for sound so much thinner than the others?', o: ['Less energy is transferred as sound', 'Sound is a less useful kind of energy', 'Sound travels more slowly', 'Sound energy is destroyed'], x: `The width of each arrow is to scale with the energy it carries: only ${n(ws[1])} J of the ${E} J goes to sound.` };
  };

  /* transverse wave: drawn with a centred axis */
  M.wave = r => {
    const A = r.pick([1, 2, 3, 4]), lam = r.pick([4, 5, 6, 8, 10]), xmax = lam * 2.5, Y = A + 1, w = 400, h = 240, L = 50, R = 20, top = 20, bot = h - 40;
    const px = x => L + x / xmax * (w - L - R), py = y => top + (Y - y) / (2 * Y) * (bot - top);
    let g = ''; for (let y = -Y; y <= Y; y++) g += `<line x1="${L}" y1="${py(y)}" x2="${w - R}" y2="${py(y)}" stroke="${GRID}"/>` + T(L - 6, py(y) + 4, y, { size: 11, a: 'end' });
    const xs = lam / 2; for (let x = 0; x <= xmax + 1e-9; x += xs) g += `<line x1="${px(x)}" y1="${top}" x2="${px(x)}" y2="${bot}" stroke="${GRID}"/>` + T(px(x), bot + 16, n(x), { size: 11 });
    g += `<line x1="${L}" y1="${py(0)}" x2="${w - R}" y2="${py(0)}" stroke="#666" stroke-dasharray="5 3"/><line x1="${L}" y1="${top}" x2="${L}" y2="${bot}" stroke="${INK}" stroke-width="1.6"/>`;
    g += `<polyline points="${curve(x => A * Math.sin(2 * Math.PI * x / lam), 0, xmax, 160).map(([x, y]) => px(x).toFixed(1) + ',' + py(y).toFixed(1)).join(' ')}" fill="none" stroke="#dc2626" stroke-width="2.4"/>`;
    g += T((L + w - R) / 2, h - 6, 'Distance (cm)', { size: 12, w: 600 }) + T(14, (top + bot) / 2, 'Displacement (cm)', { size: 12, w: 600, rot: -90 });
    const svg = wrap(w, h, g), f = r.pick([2, 5, 10, 20]);
    const q = r.int(0, r.hard ? 2 : 1);
    if (q === 0) return { title: 'Wave', spec: 'P3.3', kind: 'graph', svg, q: 'What is the wavelength of this wave?', o: [lam + ' cm', ...uniq(lam, [lam / 2, lam * 2, A, 2 * A]).map(v => n(v) + ' cm')], x: `Wavelength = distance from one peak to the next (one full wave): ${lam} cm.` };
    if (q === 1) return { title: 'Wave', spec: 'P3.3', kind: 'graph', svg, q: 'The dashed line is the rest position. What is the amplitude?', o: [A + ' cm', ...uniq(A, [2 * A, lam, lam / 2, A + 1]).map(v => n(v) + ' cm')], x: `Amplitude = height of a peak above the rest position: ${A} cm (not peak to trough, which is ${2 * A} cm).` };
    const v = f * lam / 100; return { title: 'Wave', spec: 'P3.5', kind: 'graph', svg, q: `The frequency is ${f} Hz. What is the wave speed?`, o: [n(v) + ' m/s', ...uniq(n(v), [f * lam, f / lam, lam / f / 100, v * 2].map(n)).map(x => x + ' m/s')], x: `v = f × λ = ${f} × ${lam / 100} m = ${n(v)} m/s. (Convert cm to m first.)` };
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
    const scaled = r.f() < .5, bal = r.f() < .3, k = .25, scaleN = 200;
    const fw = scaled ? r.pick([300, 400, 500, 600]) : r.pick([100, 200, 300, 400, 600]);
    const bk = bal ? fw : scaled ? r.pick([200, 300, 400, 500].filter(x => x !== fw)) : r.pick([50, 100, 150, 200, 250].filter(x => x !== fw));
    const vert = scaled ? r.pick([200, 300, 400]) : r.pick([200, 500, 800]), len = v => scaled ? v * k : 70;
    const measure = scaled && !bal && r.f() < .6;
    const cx = 230, cy = 50 + len(vert), bw = 50, bh = 35, H = cy + bh + len(vert) + 45;
    const fa = (x1, y1, x2, y2, c) => arrow(x1, y1, x2, y2, c, 3);
    let g = `<rect x="${cx - bw}" y="${cy - bh}" width="${2 * bw}" height="${2 * bh}" fill="#e5e7eb" stroke="${INK}" stroke-width="2"/>`;
    g += fa(cx + bw, cy, cx + bw + len(fw), cy, '#16a34a') + T(cx + bw + len(fw) / 2, cy - 10, fw + ' N', { size: 13, w: 700 }) + T(cx + bw + len(fw) / 2, cy + bh + 16, 'driving force', { size: 11 });
    g += fa(cx - bw, cy, cx - bw - len(bk), cy, '#dc2626') + T(cx - bw - len(bk) / 2, cy - 10, measure ? '?' : bk + ' N', { size: 13, w: 700 }) + T(cx - bw - len(bk) / 2, cy + bh + 16, 'friction + drag', { size: 11 });
    g += fa(cx, cy - bh, cx, cy - bh - len(vert), '#2563eb') + T(cx + 8, cy - bh - len(vert) + 12, vert + ' N', { size: 13, w: 700, a: 'start' }) + T(cx + 8, cy - bh - len(vert) + 26, 'reaction force', { size: 11, a: 'start' });
    g += fa(cx, cy + bh, cx, cy + bh + len(vert), '#2563eb') + T(cx + 8, cy + bh + len(vert) - 4, vert + ' N weight', { size: 13, w: 700, a: 'start' });
    g += scaled ? `<g transform="translate(14 ${H - 14})"><path d="M0 -6v6h${scaleN * k}v-6" fill="none" stroke="${INK}" stroke-width="2"/>${T(scaleN * k + 6, 0, `= ${scaleN} N`, { size: 12, w: 700, a: 'start' })}${T(0, -14, 'Drawn to scale', { size: 12, w: 700, a: 'start' })}</g>`
      : T(14, H - 14, 'Not to scale', { size: 12, w: 700, a: 'start', fill: '#555' });
    const svg = wrap(460, H, g), res = fw - bk, title = 'Forces diagram';
    if (measure) return { title, spec: 'P1.15', kind: 'diagram', svg, q: 'The diagram is drawn to scale. Use the scale bar: what is the friction + drag force?', o: [bk + ' N', ...others(bk + ' N', [100, 200, 300, 400, 500, 600, 800].map(v => v + ' N'), r)], x: `The red arrow is ${bk / scaleN} times as long as the ${scaleN} N scale bar: ${bk / scaleN} × ${scaleN} = ${bk} N. (So the resultant is ${fw} − ${bk} = ${res} N forwards.)` };
    const ans = bal ? '0 N' : `${Math.abs(res)} N to the ${res > 0 ? 'right' : 'left'}`;
    return r.int(0, 1) || bal ? { title, spec: 'P1.15', kind: 'diagram', svg, q: 'What is the resultant force on the object?', o: [ans, ...others(ans, bal ? [`${fw + bk} N to the right`, `${fw} N to the right`, `${2 * vert} N downwards`] : [`${fw + bk} N to the right`, `${Math.abs(res)} N to the ${res > 0 ? 'left' : 'right'}`, '0 N', `${fw + bk + 2 * vert} N`], r)], x: bal ? 'Up = down and forwards = backwards: the forces are balanced, so the resultant is 0 N (it stays still or keeps moving at a steady speed).' : `Up and down cancel. Horizontally: ${fw} − ${bk} = ${Math.abs(res)} N to the ${res > 0 ? 'right' : 'left'}.` }
      : { title, spec: 'P1.16', kind: 'diagram', svg, q: 'The object is moving to the right. What happens to its speed?', o: [res > 0 ? 'It speeds up' : 'It slows down', res > 0 ? 'It slows down' : 'It speeds up', 'It stays the same', 'It stops straight away'], x: `The resultant force is ${Math.abs(res)} N ${res > 0 ? 'forwards, so it accelerates' : 'backwards, so it decelerates'}.` };
  };

  /* food web */
  M.foodweb = r => {
    const W = r.pick([
      { n: { grass: [80, 220], clover: [230, 220], rabbit: [60, 140], slug: [170, 140], vole: [280, 140], thrush: [140, 60], fox: [60, 30], owl: [280, 50] }, e: [['grass', 'rabbit'], ['grass', 'vole'], ['clover', 'slug'], ['clover', 'vole'], ['grass', 'slug'], ['slug', 'thrush'], ['rabbit', 'fox'], ['vole', 'owl'], ['vole', 'fox'], ['thrush', 'owl']], p: ['grass', 'clover'], c1: ['rabbit', 'slug', 'vole'], top: ['fox', 'owl'] },
      { n: { algae: [100, 220], 'pond weed': [260, 220], 'water flea': [70, 140], snail: [190, 140], tadpole: [300, 140], 'water beetle': [120, 60], stickleback: [260, 70], heron: [190, 20] }, e: [['algae', 'water flea'], ['algae', 'tadpole'], ['pond weed', 'snail'], ['algae', 'snail'], ['pond weed', 'tadpole'], ['water flea', 'water beetle'], ['water flea', 'stickleback'], ['tadpole', 'stickleback'], ['snail', 'water beetle'], ['water beetle', 'heron'], ['stickleback', 'heron']], p: ['algae', 'pond weed'], c1: ['water flea', 'snail', 'tadpole'], top: ['heron'] }]);
    let g = ''; W.e.forEach(([a, b]) => { const [x1, y1] = W.n[a], [x2, y2] = W.n[b], d = Math.hypot(x2 - x1, y2 - y1); g += arrow(x1 + (x2 - x1) * 14 / d, y1 + (y2 - y1) * 14 / d, x2 - (x2 - x1) * 16 / d, y2 - (y2 - y1) * 16 / d, '#555', 1.6); });
    Object.entries(W.n).forEach(([k, [x, y]]) => { g += `<rect x="${x - k.length * 3.6 - 6}" y="${y - 11}" width="${k.length * 7.2 + 12}" height="22" rx="11" fill="${W.p.includes(k) ? '#dcfce7' : '#fff'}" stroke="${INK}"/>` + T(x, y + 4, k, { size: 12, w: 600 }); });
    const svg = wrap(360, 245, g), q = r.int(0, 2), c1 = r.pick(W.c1);
    if (q === 0) return { title: 'Food web', spec: 'B4.4', kind: 'diagram', svg, q: 'Which of these is a primary consumer?', o: [c1, ...others(c1, [...W.p, ...W.top, ...Object.keys(W.n).filter(k => !W.p.includes(k) && !W.c1.includes(k) && !W.top.includes(k))], r)], x: `A primary consumer eats producers (plants/algae). Arrows from ${W.p.join(' or ')} point to ${c1}.` };
    if (q === 1) return { title: 'Food web', spec: 'B4.4', kind: 'diagram', svg, q: 'What do the arrows in a food web show?', o: ['The direction energy is transferred', 'Which animal eats the arrow\'s target', 'The direction animals move', 'Where waste goes'], x: 'Arrows point from the food to the feeder: the direction biomass and energy are transferred.' };
    const p0 = W.p[0]; return { title: 'Food web', spec: 'B4.4', kind: 'diagram', svg, q: `Which organisms are producers?`, o: [W.p.join(' and '), ...others(W.p.join(' and '), [`${W.c1[0]} and ${W.c1[1]}`, W.top.join(' and '), `${p0} and ${W.c1[0]}`], r)], x: `Producers make their own food by photosynthesis; nothing points into them: ${W.p.join(' and ')}.` };
  };

  /* pyramid of biomass with numbers (biology maths): sometimes to scale (bar width ∝ biomass), otherwise marked not to scale */
  M.pyramid = r => {
    const L = r.pick([['grass', 'grasshoppers', 'frogs', 'snakes'], ['phytoplankton', 'zooplankton', 'small fish', 'seals'], ['oak tree leaves', 'caterpillars', 'blue tits', 'sparrowhawks']]);
    const scaled = r.f() < .4, levels = scaled ? 3 : 4;
    const b0 = r.pick([1000, 2000, 5000]), b = [b0, b0 * (scaled ? r.pick([20, 25, 40]) : r.pick([10, 10, 20])) / 100]; b.push(b[1] * (scaled ? r.pick([20, 25, 40]) : r.pick([10, 20])) / 100); if (!scaled) b.push(b[2] * 10 / 100);
    let g = ''; const maxW = 320, hgt = 38, cx = 200, wOf = (v, i) => scaled ? Math.max(2, maxW * v / b0) : Math.max(L[i].length * 7.5 + 16, maxW * Math.pow(v / b0, .35));
    b.forEach((v, i) => { const w = wOf(v, i), y = 210 - i * (hgt + 4), fits = w >= L[i].length * 7.5 + 12;
      g += `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="${hgt}" fill="${['#86efac', '#fde68a', '#fdba74', '#fca5a5'][i]}" stroke="${INK}"/>`
        + (fits ? T(cx, y + 16, L[i], { size: 12, w: 700 }) + T(cx, y + 31, n(v) + ' g/m²', { size: 11 }) : `<line x1="${cx + w / 2 + 2}" y1="${y + hgt / 2}" x2="${cx + 40}" y2="${y + hgt / 2}" stroke="#888"/>` + T(cx + 44, y + 16, L[i], { size: 12, w: 700, a: 'start' }) + T(cx + 44, y + 31, n(v) + ' g/m²', { size: 11, a: 'start' })); });
    g += T(390, 22, scaled ? 'Drawn to scale (bar width ∝ biomass)' : 'Not to scale', { size: 11, w: 700, a: 'end', fill: '#555' });
    const svg = wrap(400, 260, g), lvl = r.int(0, levels - 2), eff = b[lvl + 1] / b[lvl] * 100, q = r.int(0, 1);
    if (q === 0) return { title: 'Pyramid of biomass', spec: 'B4.7', kind: 'diagram', svg, q: `What percentage of the biomass of the ${L[lvl]} is passed on to the ${L[lvl + 1]}?`, o: [n(eff) + '%', ...uniq(n(eff), [100 - eff, b[lvl] / b[lvl + 1], b[lvl + 1], eff * 10].map(n)).map(v => v + '%')], x: `${n(b[lvl + 1])} ÷ ${n(b[lvl])} × 100 = ${n(eff)}%.` };
    return { title: 'Pyramid of biomass', spec: 'B4.8', kind: 'diagram', svg, q: 'Why is less biomass found at each higher level?', o: ['Energy is lost at each level, e.g. in respiration, movement and waste', 'Animals higher up are smaller', 'Plants make biomass out of nothing', 'Predators only eat some of the time'], x: 'Only a small fraction is passed on: much is used for respiration (released as heat), lost in faeces and urine, or never eaten.' };
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

  /* magnetic field of a bar magnet: lines leave the north pole, curve round and go into the south pole */
  M.magnet = r => {
    const nLeft = r.int(0, 1), askPole = r.int(0, 1), cx = 230, cy = 140, hw = 70, hh = 18, xL = cx - hw, xR = cx + hw;
    const dir = nLeft ? 0 : 180;   // along the top and bottom arcs the field runs N → S
    let g = '';
    [[5, 45, 26], [10, 100, 60], [14, 165, 98], [17, 235, 138]].forEach(([dy, ex, hy]) => [-1, 1].forEach(s => {
      const y = cy + s * dy, yc = cy + s * (dy + hy);
      g += `<path d="M${xL} ${y}C${xL - ex} ${yc} ${xR + ex} ${yc} ${xR} ${y}" fill="none" stroke="#444" stroke-width="1.6"/>`;
      g += arrowHead(cx + (dir ? -4 : 4), cy + s * (dy + .75 * hy), dir, '#444', 9);   // the top of a symmetric curve is at t = 0.5, 3/4 of the way to the control height
    }));
    g += `<line x1="18" y1="${cy}" x2="${xL}" y2="${cy}" stroke="#444" stroke-width="1.6"/><line x1="${xR}" y1="${cy}" x2="442" y2="${cy}" stroke="#444" stroke-width="1.6"/>`
      + arrowHead(nLeft ? 60 : 110, cy, nLeft ? 180 : 0, '#444', 9) + arrowHead(nLeft ? 400 : 350, cy, nLeft ? 180 : 0, '#444', 9);
    const lab = s => askPole ? '?' : s;
    g += `<rect x="${xL}" y="${cy - hh}" width="${hw}" height="${2 * hh}" fill="${askPole ? '#d1d5db' : nLeft ? '#fecaca' : '#bfdbfe'}" stroke="${INK}" stroke-width="2"/><rect x="${cx}" y="${cy - hh}" width="${hw}" height="${2 * hh}" fill="${askPole ? '#d1d5db' : nLeft ? '#bfdbfe' : '#fecaca'}" stroke="${INK}" stroke-width="2"/>`
      + T(cx - hw / 2, cy + 7, lab(nLeft ? 'N' : 'S'), { size: 20, w: 700 }) + T(cx + hw / 2, cy + 7, lab(nLeft ? 'S' : 'N'), { size: 20, w: 700 });
    g += `<circle cx="${xL - 14}" cy="${cy - 26}" r="4.5" fill="${INK}"/>` + T(xL - 26, cy - 30, 'P', { size: 14, w: 700 }) + `<circle cx="${cx + 190}" cy="${cy - 110}" r="4.5" fill="${INK}"/>` + T(cx + 202, cy - 106, 'Q', { size: 14, w: 700, a: 'start' });
    const svg = wrap(460, 280, g);
    return askPole ? { title: 'Magnetic field of a bar magnet', spec: 'P6.4', kind: 'diagram', svg, q: 'Which end of the bar magnet is the north pole?', o: [nLeft ? 'The left end' : 'The right end', nLeft ? 'The right end' : 'The left end', 'Both ends', 'You can\'t tell from the field lines'], x: 'Field lines come out of the north pole and go into the south pole. Follow the arrows back to the end they leave from.' }
      : { title: 'Magnetic field of a bar magnet', spec: 'P6.4', kind: 'diagram', svg, q: 'Where is the magnetic field stronger, at P or at Q?', o: ['P: the field lines are closer together', 'Q: it is further from the magnet', 'The same everywhere', 'Q: the field lines are curved'], x: 'The closer together the field lines, the stronger the field. They are most crowded near the poles.' };
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

  const MAKERS = [['vt', 'P1.8'], ['dt', 'P1.3'], ['forces', 'P1.15'], ['fe', 'P1.23'], ['wave', 'P3.3'], ['ray', 'P3.16'], ['sankey', 'P4.4'], ['circuit', 'P2.19'], ['iv', 'P2.10'], ['magnet', 'P6.4'], ['half', 'P7.13'],
    ['atom', 'C1.22'], ['ionic', 'C1.40'], ['covalent', 'C1.46'], ['chrom', 'C1.12'], ['cool', 'C1.1'], ['rate', 'C3.10'], ['profile', 'C3.5'], ['table', 'C3.15'], ['displayed', 'C4.21'],
    ['cell', 'B2.2'], ['enzyme', 'B2.10'], ['photo', 'B2.20'], ['punnett', 'B3.23'], ['pedigree', 'B3.24'], ['foodweb', 'B4.4'], ['pyramid', 'B4.7'], ['bars', '—']];
  function make(name, hard) { const r = rnd(); r.hard = !!hard; const q = M[name](r); q.o = q.o.slice(0, 4); return q; }
  return { make, MAKERS, M };
})();
