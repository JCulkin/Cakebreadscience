/* Randomised calculation questions. Each generator is ONE question in the bank (one stable id, e.g. 'P3.5-g1'),
   but makes fresh numbers every time it is shown, so the answer can't be memorised.
   G(id, fn, hard?)  fn(r) returns { q, o: [correct, wrong, wrong, wrong], x }. r = random helpers. Needs questions.js. */
function G(id, fn, hard) { QUESTIONS.push({ id, s: id.split('-')[0], gen: fn, hard: !!hard }); }

const R = {
  int: (a, b) => a + Math.floor(Math.random() * (b - a + 1)),
  pick: a => a[Math.floor(Math.random() * a.length)],
  // tidy number for display: up to 3 significant figures, no trailing zeros
  n(v) { if (!isFinite(v)) return '—'; const a = Math.abs(v); if (a !== 0 && (a >= 1e6 || a < 1e-3)) return R.sci(v); return String(+v.toPrecision(3)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); },
  sci(v) { const e = Math.floor(Math.log10(Math.abs(v))); const m = +(v / 10 ** e).toPrecision(3); const sup = String(e).replace(/-/g, '⁻').replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]); return `${m} × 10${sup}`; },
  // make 4 distinct options from the correct value and candidate wrong values (all numbers, with a unit)
  opts(correct, wrongs, unit) {
    const f = v => R.n(v) + (unit ? ' ' + unit : '');
    const out = [f(correct)];
    for (const w of wrongs) { const s = f(w); if (!out.includes(s) && isFinite(w) && w > 0) out.push(s); if (out.length === 4) break; }
    let k = 2; while (out.length < 4) { const s = f(correct * k); if (!out.includes(s)) out.push(s); k = k === 2 ? 0.5 : k * 3; }
    return out;
  }
};

/* ---------- Physics ---------- */
G('P3.5-g1', r => {
  const f = r.pick([2, 4, 5, 10, 20, 25, 50, 100, 200, 250, 400, 500]), l = r.pick([0.2, 0.5, 1.5, 2, 3, 4, 0.25, 0.8, 1.2]);
  const v = f * l, ask = r.int(0, 2);
  if (ask === 0) return { q: `A wave has a frequency of ${R.n(f)} Hz and a wavelength of ${R.n(l)} m. What is its speed?`, o: R.opts(v, [f / l, l / f, f + l], 'm/s'), x: `v = f × λ = ${R.n(f)} × ${R.n(l)} = <b>${R.n(v)} m/s</b>.` };
  if (ask === 1) return { q: `A wave travels at ${R.n(v)} m/s with a wavelength of ${R.n(l)} m. What is its frequency?`, o: R.opts(f, [v * l, l / v, v - l], 'Hz'), x: `f = v ÷ λ = ${R.n(v)} ÷ ${R.n(l)} = <b>${R.n(f)} Hz</b>.` };
  return { q: `A wave travels at ${R.n(v)} m/s with a frequency of ${R.n(f)} Hz. What is its wavelength?`, o: R.opts(l, [v * f, f / v, v - f], 'm'), x: `λ = v ÷ f = ${R.n(v)} ÷ ${R.n(f)} = <b>${R.n(l)} m</b>.` };
});
G('P3.6-g1', r => {
  const T = r.pick([0.01, 0.02, 0.04, 0.05, 0.1, 0.2, 0.25, 0.5, 2, 4, 5]), f = 1 / T;
  if (r.int(0, 1)) return { q: `A wave has a time period of ${R.n(T)} s. What is its frequency?`, o: R.opts(f, [T, T * 10, f * 10], 'Hz'), x: `f = 1 ÷ T = 1 ÷ ${R.n(T)} = <b>${R.n(f)} Hz</b>.` };
  return { q: `A wave has a frequency of ${R.n(f)} Hz. What is its time period?`, o: R.opts(T, [f, T * 10, T / 10], 's'), x: `T = 1 ÷ f = 1 ÷ ${R.n(f)} = <b>${R.n(T)} s</b>.` };
});
G('P3.7-g1', r => {
  const c = 3e8, pairs = [['radio', [1500, 300, 100, 3, 10]], ['microwave', [0.03, 0.1, 0.12, 0.01]], ['infrared', [1e-5, 3e-6]], ['visible light', [6e-7, 5e-7, 4e-7]]];
  const [kind, ls] = r.pick(pairs), l = r.pick(ls), f = c / l;
  return { q: `A ${kind} wave has a wavelength of ${R.n(l)} m. Electromagnetic waves travel at 3 × 10⁸ m/s. What is its frequency?`, o: R.opts(f, [c * l, l / c, f / 10], 'Hz'), x: `f = v ÷ λ = 3 × 10⁸ ÷ ${R.n(l)} = <b>${R.n(f)} Hz</b>.` };
}, true);
G('P3.18-g1', r => {
  const deg = Math.PI / 180;
  for (;;) {
    const i = r.pick([30, 35, 40, 45, 50, 55, 60, 65, 70]), n = r.pick([1.33, 1.4, 1.5, 1.6]);
    const rr = Math.round(Math.asin(Math.sin(i * deg) / n) / deg); if (rr < 10) continue;
    const si = Math.sin(i * deg), sr = Math.sin(rr * deg), ans = si / sr;
    return { q: `A ray enters a block with an angle of incidence of ${i}° and an angle of refraction of ${rr}°. What is the refractive index? (sin ${i}° = ${si.toFixed(3)}, sin ${rr}° = ${sr.toFixed(3)})`,
      o: [ans.toFixed(2), (sr / si).toFixed(2), (i / rr).toFixed(2) === ans.toFixed(2) ? (ans + 0.2).toFixed(2) : (i / rr).toFixed(2), (si * sr).toFixed(2)].filter((v, k, a) => a.indexOf(v) === k).concat([(ans + 0.3).toFixed(2), (ans - 0.25).toFixed(2)]).slice(0, 4),
      x: `n = sin i ÷ sin r = ${si.toFixed(3)} ÷ ${sr.toFixed(3)} = <b>${ans.toFixed(2)}</b>.` };
  }
}, true);
G('P3.22-g1', r => {
  const n = r.pick([1.3, 1.33, 1.4, 1.45, 1.5, 1.6, 1.7, 2.0, 2.4]), s = 1 / n, c = Math.asin(s) * 180 / Math.PI;
  return { q: `A material has a refractive index of ${n}. What is its critical angle? (sin⁻¹ ${s.toFixed(3)} = ${c.toFixed(1)}°)`,
    o: [c, 90 - c, c * 1.5, c / 2, c + 10, c - 8].map(v => `${v.toFixed(1)}°`).filter((v, k, a) => a.indexOf(v) === k).slice(0, 4),
    x: `sin c = 1 ÷ n = 1 ÷ ${n} = ${s.toFixed(3)}, so c = <b>${c.toFixed(1)}°</b>.` };
}, true);
G('P7.2-g1', r => {
  const iso = [['C', 6, 12], ['C', 6, 14], ['N', 7, 14], ['O', 8, 16], ['Na', 11, 23], ['Co', 27, 60], ['Sr', 38, 90], ['I', 53, 131], ['Cs', 55, 137], ['Ra', 88, 226], ['U', 92, 235], ['U', 92, 238], ['Pu', 94, 239], ['Am', 95, 241], ['K', 19, 40], ['H', 1, 3]];
  const [el, z, a] = r.pick(iso), nn = a - z;
  const ask = r.int(0, 1), nuc = `<span class="nuc"><sup>${a}</sup><sub>${z}</sub>${el}</span>`;
  const opt = (p, q) => `${p} protons, ${q} neutrons`;
  return { q: `How many protons and neutrons are in a nucleus of ${nuc}?`,
    o: [opt(z, nn), opt(nn, z), opt(z, a), opt(a, z)].filter((v, k, x) => x.indexOf(v) === k).concat([opt(z, nn + 1), opt(z + 1, nn)]).slice(0, 4),
    x: `The bottom number (${z}) is the proton number. Neutrons = ${a} − ${z} = <b>${nn}</b>.` };
});
G('P7.13-g1', r => {
  const h = r.pick([2, 3, 4, 5, 6, 8, 10, 12, 20, 30]), unit = r.pick(['hours', 'days', 'minutes', 'years']), k = r.int(2, 4), a0 = r.pick([160, 320, 400, 640, 800, 1200, 1600, 2000, 4800]);
  const a = a0 / 2 ** k;
  if (r.int(0, 1)) return { q: `A source has an activity of ${a0} Bq and a half-life of ${h} ${unit}. What is its activity after ${h * k} ${unit}?`, o: R.opts(a, [a0 / k, a * 2, a0 / (2 * k * h)], 'Bq'), x: `${h * k} ${unit} = ${k} half-lives: ${[...Array(k + 1)].map((_, i) => a0 / 2 ** i).join(' → ')} Bq. Answer: <b>${R.n(a)} Bq</b>.` };
  return { q: `The activity of a source falls from ${a0} Bq to ${R.n(a)} Bq in ${h * k} ${unit}. What is its half-life?`, o: R.opts(h, [h * k / 2, h * k, h * 2], unit), x: `${[...Array(k + 1)].map((_, i) => a0 / 2 ** i).join(' → ')} is ${k} half-lives. ${h * k} ÷ ${k} = <b>${h} ${unit}</b>.` };
});

/* ---------- Chemistry ---------- */
const EL20 = [['hydrogen', 'H', 1, 1, 1], ['helium', 'He', 2, 0, 1], ['lithium', 'Li', 3, 1, 2], ['beryllium', 'Be', 4, 2, 2], ['boron', 'B', 5, 3, 2], ['carbon', 'C', 6, 4, 2], ['nitrogen', 'N', 7, 5, 2], ['oxygen', 'O', 8, 6, 2], ['fluorine', 'F', 9, 7, 2], ['neon', 'Ne', 10, 0, 2],
  ['sodium', 'Na', 11, 1, 3], ['magnesium', 'Mg', 12, 2, 3], ['aluminium', 'Al', 13, 3, 3], ['silicon', 'Si', 14, 4, 3], ['phosphorus', 'P', 15, 5, 3], ['sulfur', 'S', 16, 6, 3], ['chlorine', 'Cl', 17, 7, 3], ['argon', 'Ar', 18, 0, 3], ['potassium', 'K', 19, 1, 4], ['calcium', 'Ca', 20, 2, 4]];
const cfg = z => { const s = []; let left = z; for (const cap of [2, 8, 8, 2]) { if (left <= 0) break; s.push(Math.min(cap, left)); left -= cap; } return s.join('.'); };
G('C1.19-g1', r => {
  const e = r.pick(EL20.slice(2)), [name, , z, g, p] = e, right = cfg(z);
  const wrong = [cfg(z + 1), cfg(z - 1), right.split('.').reverse().join('.'), `${right}.1`, cfg(z + 8 <= 20 ? z + 8 : z - 8)].filter(w => w !== right);
  return { q: `${name[0].toUpperCase() + name.slice(1)} is in ${g ? 'Group ' + g : 'Group 0'}, Period ${p}. What is its electronic configuration?`, o: [right, ...[...new Set(wrong)].slice(0, 3)], x: `Period ${p} → ${p} occupied shells. ${g ? `Group ${g} → ${g} outer electrons.` : 'Group 0 → full outer shell.'} So <b>${right}</b> (${z} electrons).` };
});
G('C1.22-g1', r => {
  const e = r.pick(EL20.slice(2)), [, , z, g, p] = e, c = cfg(z);
  const lab = (gg, pp) => `Group ${gg}, Period ${pp}`;
  const right = lab(g, p);
  const wrong = [lab(p, g || 8), lab(g, p + 1), lab(g ? g + 1 : 1, p), lab(g, p - 1 || 2)].filter(w => w !== right);
  return { q: `An element has the electronic configuration ${c}. Where is it in the Periodic Table?`, o: [right, ...[...new Set(wrong)].slice(0, 3)], x: `${p} occupied shells → Period ${p}. ${g ? g + ' outer electron' + (g > 1 ? 's' : '') + ' → Group ' + g : 'Full outer shell → Group 0'}.` };
});
const CAT = [['sodium', 'Na', 1], ['potassium', 'K', 1], ['lithium', 'Li', 1], ['magnesium', 'Mg', 2], ['calcium', 'Ca', 2], ['aluminium', 'Al', 3], ['silver', 'Ag', 1], ['copper(II)', 'Cu', 2], ['iron(II)', 'Fe', 2], ['iron(III)', 'Fe', 3], ['zinc', 'Zn', 2], ['lead(II)', 'Pb', 2], ['ammonium', 'NH₄', 1, true]];
const AN = [['chloride', 'Cl', 1], ['bromide', 'Br', 1], ['oxide', 'O', 2], ['sulfide', 'S', 2], ['nitride', 'N', 3], ['hydroxide', 'OH', 1, true], ['nitrate', 'NO₃', 1, true], ['sulfate', 'SO₄', 2, true], ['carbonate', 'CO₃', 2, true]];
const sub = n => n === 1 ? '' : String(n).replace(/\d/g, d => '₀₁₂₃₄₅₆₇₈₉'[d]);
const gcd = (a, b) => b ? gcd(b, a % b) : a;
function formula(c, a, nc, na) { const part = (sym, n, poly) => n === 1 ? sym : (poly ? `(${sym})${sub(n)}` : sym + sub(n)); return part(c[1], nc, c[3]) + part(a[1], na, a[3]); }
G('C1.39-g1', r => {
  for (;;) {
    const c = r.pick(CAT), a = r.pick(AN); if (c[3] && a[1] === 'N') continue;
    const l = c[2] * a[2] / gcd(c[2], a[2]), nc = l / c[2], na = l / a[2];
    if (nc === 1 && na === 1 && r.int(0, 2)) continue;   // prefer the interesting ones
    const right = formula(c, a, nc, na);
    const wrong = [formula(c, a, 1, 1), formula(c, a, na, nc), formula(c, a, a[2], c[2]), formula(c, a, nc, na + 1), formula(c, a, nc + 1, na), formula(c, a, 2, 3), formula(c, a, 3, 2)].filter(w => w !== right);
    const opts = [right, ...[...new Set(wrong)]].slice(0, 4); if (opts.length < 4) continue;
    const ch = (n, sg) => (n === 1 ? '' : '⁰¹²³⁴⁵⁶⁷⁸⁹'[n]) + sg;
    return { q: `What is the formula of ${c[0]} ${a[0]}?`, o: opts, x: `${c[1]}${ch(c[2], '⁺')} and ${a[1]}${ch(a[2], '⁻')}: ${nc} × (+${c[2]}) = +${nc * c[2]} and ${na} × (−${a[2]}) = −${na * a[2]}. So <b>${right}</b>.` };
  }
}, true);
G('C1.17-g1', r => {
  const sets = [['chlorine', 35, 37], ['bromine', 79, 81], ['copper', 63, 65], ['boron', 10, 11], ['lithium', 6, 7], ['gallium', 69, 71], ['silver', 107, 109], ['rubidium', 85, 87]];
  const [el, m1, m2] = r.pick(sets), p1 = r.pick([20, 25, 30, 40, 60, 70, 75, 80, 90]), p2 = 100 - p1;
  const ar = (p1 * m1 + p2 * m2) / 100, f = v => v.toFixed(1);
  const opts = [f(ar), f((m1 + m2) / 2), f((p2 * m1 + p1 * m2) / 100), f(ar + 0.5), f(ar - 0.3), f(ar + 0.8)].filter((v, k, a) => a.indexOf(v) === k).slice(0, 4);
  return { q: `A sample of ${el} is ${p1}% ${el}-${m1} and ${p2}% ${el}-${m2}. What is its relative atomic mass, to 1 decimal place?`, o: opts, x: `(${p1} × ${m1} + ${p2} × ${m2}) ÷ 100 = ${p1 * m1 + p2 * m2} ÷ 100 = <b>${f(ar)}</b>.` };
}, true);

/* ---------- Chemistry 1(b), 1(e) calculations (added 7 Nov 2026) ---------- */
G('C1.12-g1', r => {
  const sol = r.pick([5, 6, 8, 10, 12]), spot = +(sol * r.pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 0.8])).toFixed(1), rf = spot / sol;
  return { q: `On a chromatogram, the solvent front moved ${sol} cm and a spot moved ${spot} cm. What is the Rf value of the spot?`, o: R.opts(rf, [sol / spot, sol - spot, rf + 0.15], ''), x: `Rf = distance moved by spot ÷ distance moved by solvent = ${spot} ÷ ${sol} = <b>${R.n(rf)}</b>.` };
});
const AR = { H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, Al: 27, S: 32, Cl: 35.5, K: 39, Ca: 40, Cu: 63.5, Zn: 65, Fe: 56 };
const CMPDS = [['water', 'H₂O', { H: 2, O: 1 }], ['carbon dioxide', 'CO₂', { C: 1, O: 2 }], ['methane', 'CH₄', { C: 1, H: 4 }], ['ammonia', 'NH₃', { N: 1, H: 3 }],
  ['sodium chloride', 'NaCl', { Na: 1, Cl: 1 }], ['magnesium oxide', 'MgO', { Mg: 1, O: 1 }], ['calcium carbonate', 'CaCO₃', { Ca: 1, C: 1, O: 3 }], ['sulfuric acid', 'H₂SO₄', { H: 2, S: 1, O: 4 }],
  ['sodium hydroxide', 'NaOH', { Na: 1, O: 1, H: 1 }], ['magnesium chloride', 'MgCl₂', { Mg: 1, Cl: 2 }], ['aluminium oxide', 'Al₂O₃', { Al: 2, O: 3 }], ['calcium hydroxide', 'Ca(OH)₂', { Ca: 1, O: 2, H: 2 }],
  ['copper(II) oxide', 'CuO', { Cu: 1, O: 1 }], ['ethane', 'C₂H₆', { C: 2, H: 6 }], ['potassium chloride', 'KCl', { K: 1, Cl: 1 }], ['zinc sulfate', 'ZnSO₄', { Zn: 1, S: 1, O: 4 }], ['iron(III) oxide', 'Fe₂O₃', { Fe: 2, O: 3 }]];
const mr = c => Object.entries(c[2]).reduce((a, [e, n]) => a + AR[e] * n, 0);
const arList = c => Object.keys(c[2]).map(e => `${e} = ${AR[e]}`).join(', ');
G('C1.26-g1', r => {
  const c = r.pick(CMPDS), m = mr(c), plain = Object.keys(c[2]).reduce((a, e) => a + AR[e], 0);
  const wrong = [plain, m + AR[Object.keys(c[2])[0]], Object.entries(c[2]).reduce((a, [e, n]) => a + AR[e] + n, 0), m - 1, m + 16];
  return { q: `What is the relative formula mass (Mr) of ${c[0]}, ${c[1]}? (${arList(c)})`, o: R.opts(m, wrong, ''), x: `${Object.entries(c[2]).map(([e, n]) => (n > 1 ? n + ' × ' : '') + AR[e]).join(' + ')} = <b>${R.n(m)}</b>.` };
});
G('C1.28-g1', r => {
  const c = r.pick(CMPDS), m = mr(c), mol = r.pick([0.1, 0.2, 0.25, 0.5, 2, 3, 4]), mass = +(mol * m).toFixed(2);
  if (r.int(0, 1)) return { q: `How many moles are in ${R.n(mass)} g of ${c[0]} (Mr = ${R.n(m)})?`, o: R.opts(mol, [mass * m, m / mass, mol * 10], 'mol'), x: `moles = mass ÷ Mr = ${R.n(mass)} ÷ ${R.n(m)} = <b>${R.n(mol)} mol</b>.` };
  return { q: `What is the mass of ${R.n(mol)} mol of ${c[0]} (Mr = ${R.n(m)})?`, o: R.opts(mass, [m / mol, mol / m, m], 'g'), x: `mass = moles × Mr = ${R.n(mol)} × ${R.n(m)} = <b>${R.n(mass)} g</b>.` };
});
G('C1.29-g1', r => {
  const rx = r.pick([
    ['2Mg + O₂ → 2MgO', 'magnesium', 24, 1, 'magnesium oxide', 40, 1],
    ['CaCO₃ → CaO + CO₂', 'calcium carbonate', 100, 1, 'calcium oxide', 56, 1],
    ['2Na + Cl₂ → 2NaCl', 'sodium', 23, 1, 'sodium chloride', 58.5, 1],
    ['CuO + H₂ → Cu + H₂O', 'copper(II) oxide', 79.5, 1, 'copper', 63.5, 1],
    ['2H₂ + O₂ → 2H₂O', 'hydrogen', 2, 1, 'water', 18, 1],
    ['CH₄ + 2O₂ → CO₂ + 2H₂O', 'methane', 16, 1, 'carbon dioxide', 44, 1],
    ['N₂ + 3H₂ → 2NH₃', 'nitrogen', 28, 1, 'ammonia', 17, 2]]);
  const [eq, a, ma, ra, b, mb, rb] = rx, mol = r.pick([0.1, 0.2, 0.25, 0.5, 1, 2]), massA = +(mol * ma).toFixed(2), massB = +(mol * rb / ra * mb).toFixed(2);
  return { q: `${eq}. What mass of ${b} is made from ${R.n(massA)} g of ${a}? (Mr ${a} = ${ma}, ${b} = ${mb})`, o: R.opts(massB, [massA, mol * mb * (rb === 1 ? 2 : 0.5), massA * mb / 100, massB * 2], 'g'),
    x: `moles of ${a} = ${R.n(massA)} ÷ ${ma} = ${R.n(mol)} mol. Ratio ${ra} : ${rb}, so ${R.n(mol * rb / ra)} mol of ${b}. Mass = ${R.n(mol * rb / ra)} × ${mb} = <b>${R.n(massB)} g</b>.` };
}, true);
G('C1.30-g1', r => {
  const th = r.pick([10, 12, 16, 20, 25, 40, 50, 80]), pct = r.pick([40, 50, 60, 75, 80, 85, 90]), act = +(th * pct / 100).toFixed(1);
  return { q: `The theoretical yield of a reaction is ${th} g, but only ${act} g of product is collected. What is the percentage yield?`, o: R.opts(pct, [th / act * 100, 100 - pct, th - act], '%').map(v => v.replace(' %', '%')), x: `percentage yield = actual ÷ theoretical × 100 = ${act} ÷ ${th} × 100 = <b>${pct}%</b>.` };
});
G('C1.33-g1', r => {
  const f = r.pick([['C', 'H', 1, 4], ['C', 'H', 1, 2], ['C', 'H', 1, 3], ['Mg', 'O', 1, 1], ['Cu', 'O', 1, 1], ['Fe', 'O', 2, 3], ['Na', 'O', 2, 1], ['Al', 'O', 2, 3], ['C', 'O', 1, 2], ['S', 'O', 1, 3], ['N', 'H', 1, 3], ['Ca', 'Cl', 1, 2]]);
  const [x, y, nx, ny] = f, k = r.pick([0.1, 0.2, 0.5, 1, 2]), mx = +(nx * k * AR[x]).toFixed(2), my = +(ny * k * AR[y]).toFixed(2);
  const fm = (a, b) => `${x}${sub(a)}${y}${sub(b)}`;
  const right = fm(nx, ny), wrong = [fm(ny, nx), fm(1, 1), fm(nx * 2, ny), fm(nx, ny + 1), fm(nx + 1, ny), fm(2, 1), fm(1, 2), fm(2, 3)].filter(w => w !== right);
  return { q: `A compound contains ${R.n(mx)} g of ${x} and ${R.n(my)} g of ${y}. What is its empirical formula? (${x} = ${AR[x]}, ${y} = ${AR[y]})`, o: [right, ...[...new Set(wrong)].slice(0, 3)],
    x: `${x}: ${R.n(mx)} ÷ ${AR[x]} = ${R.n(nx * k)} mol. ${y}: ${R.n(my)} ÷ ${AR[y]} = ${R.n(ny * k)} mol. Ratio ${nx} : ${ny} → <b>${right}</b>.` };
}, true);
G('P7.11-g1', r => {
  const a = r.pick([20, 50, 120, 200, 300, 450, 600, 1500, 2000]), t = r.pick([['1 minute', 60], ['10 seconds', 10], ['1 hour', 3600], ['30 seconds', 30]]), n = a * t[1];
  return { q: `A radioactive source has an activity of ${a} Bq. How many nuclei decay in ${t[0]}?`, o: R.opts(n, [a, a / t[1], n / 60 === a ? n * 10 : n / 60], ''), x: `${a} Bq = ${a} decays per second. ${a} × ${t[1]} = <b>${R.n(n)}</b>.` };
});
G('P3.15-g1', r => {
  const toSurface = r.int(0, 1), a = r.pick([10, 15, 20, 25, 30, 35, 40, 50, 55, 60, 65, 70]), refl = toSurface ? 90 - a : a;
  return { q: `A ray of light hits a plane mirror at ${a}° to the ${toSurface ? 'surface of the mirror' : 'normal'}. What is the angle of reflection?`, o: R.opts(refl, [toSurface ? a : 90 - a, 2 * a, 180 - a], '°').map(s => s.replace(' °', '°')),
    x: `${toSurface ? `Angle of incidence (to the normal) = 90° − ${a}° = ${refl}°. ` : ''}Angle of reflection = angle of incidence = <b>${refl}°</b>.` };
});

/* ---------- Physics 1 and 2 equations (added 7 Nov 2026) ---------- */
function eqGen(id, spec, hard) { G(id, r => { const c = spec(r); return { q: c.q, o: R.opts(c.ans, c.wrong, c.unit), x: c.x }; }, hard); }
eqGen('P1.4-g1', r => { const v = r.pick([2, 4, 5, 8, 10, 12, 15, 20, 25, 30]), t = r.pick([4, 5, 8, 10, 12, 20, 30, 60]), d = v * t;
  return r.int(0, 1) ? { q: `An object travels ${d} m in ${t} s. What is its average speed?`, ans: v, wrong: [d * t, t / d, d - t], unit: 'm/s', x: `speed = distance ÷ time = ${d} ÷ ${t} = <b>${v} m/s</b>.` }
    : { q: `An object moves at ${v} m/s for ${t} s. How far does it travel?`, ans: d, wrong: [v / t, t / v, v + t], unit: 'm', x: `distance = speed × time = ${v} × ${t} = <b>${d} m</b>.` }; });
eqGen('P1.6-g1', r => { const a = r.pick([0.5, 1, 2, 2.5, 3, 4, 5]), t = r.pick([2, 4, 5, 6, 8, 10]), u = r.pick([0, 0, 2, 4, 5, 10]), v = u + a * t;
  return { q: `A car speeds up from ${u} m/s to ${R.n(v)} m/s in ${t} s. What is its acceleration?`, ans: a, wrong: [v / t, (v - u) * t, (v + u) / t], unit: 'm/s²', x: `a = (v − u) ÷ t = (${R.n(v)} − ${u}) ÷ ${t} = <b>${R.n(a)} m/s²</b>.` }; });
eqGen('P1.10-g1', r => { const v = r.pick([4, 6, 8, 10, 12, 20]), a = r.pick([1, 2, 4, 5]), s = v * v / (2 * a);
  return { q: `An object starts from rest and accelerates at ${a} m/s² over a distance of ${R.n(s)} m. What is its final speed?`, ans: v, wrong: [v * v, 2 * a * s / 2, Math.sqrt(a * s)], unit: 'm/s', x: `v² = u² + 2as = 0 + 2 × ${a} × ${R.n(s)} = ${v * v}, so v = √${v * v} = <b>${v} m/s</b>.` }; });
eqGen('P1.15-g1', r => { const a = r.pick([20, 35, 50, 80, 120, 300]), b = r.pick([5, 10, 15, 25, 40, 100]), same = r.int(0, 1);
  return { q: same ? `Two forces of ${a} N and ${b} N act on an object in the same direction. What is the resultant force?` : `A force of ${a} N acts to the right and a force of ${b} N acts to the left. What is the size of the resultant force?`,
    ans: same ? a + b : Math.abs(a - b), wrong: same ? [Math.abs(a - b), a * b, (a + b) / 2] : [a + b, a * b, (a + b) / 2], unit: 'N', x: same ? `Same direction: add. ${a} + ${b} = <b>${a + b} N</b>.` : `Opposite directions: subtract. ${a} − ${b} = <b>${Math.abs(a - b)} N</b> ${a > b ? 'to the right' : 'to the left'}.` }; });
eqGen('P1.17-g1', r => { const m = r.pick([2, 5, 10, 50, 80, 1000, 1200, 1500]), a = r.pick([0.5, 2, 3, 4, 5]), F = m * a;
  return r.int(0, 1) ? { q: `What resultant force gives a ${m} kg object an acceleration of ${a} m/s²?`, ans: F, wrong: [m / a, a / m, m + a], unit: 'N', x: `F = m × a = ${m} × ${a} = <b>${R.n(F)} N</b>.` }
    : { q: `A resultant force of ${R.n(F)} N acts on a ${m} kg object. What is its acceleration?`, ans: a, wrong: [F * m, m / F, F - m], unit: 'm/s²', x: `a = F ÷ m = ${R.n(F)} ÷ ${m} = <b>${a} m/s²</b>.` }; });
eqGen('P1.18-g1', r => { const [place, g] = r.pick([['Earth', 10], ['Earth', 10], ['the Moon', 1.6], ['Mars', 3.7], ['Jupiter', 25]]), m = r.pick([2, 5, 10, 40, 50, 60, 70, 80]), W = m * g;
  return { q: `What is the weight of a ${m} kg object on ${place}, where g = ${g} N/kg?`, ans: W, wrong: [m / g, m, m + g], unit: 'N', x: `W = m × g = ${m} × ${g} = <b>${R.n(W)} N</b>.` }; });
eqGen('P2.4-g1', r => { const V = r.pick([230, 230, 12, 6]), I = r.pick([0.5, 2, 3, 4, 5, 8, 10]), P = V * I;
  return r.int(0, 1) ? { q: `An appliance draws ${I} A from a ${V} V supply. What is its power?`, ans: P, wrong: [V / I, I / V, V + I], unit: 'W', x: `P = I × V = ${I} × ${V} = <b>${R.n(P)} W</b>.` }
    : { q: `A ${R.n(P)} W appliance runs on ${V} V. What current does it draw?`, ans: I, wrong: [P * V, V / P, P - V], unit: 'A', x: `I = P ÷ V = ${R.n(P)} ÷ ${V} = <b>${I} A</b>.` }; });
eqGen('P2.5-g1', r => { const V = r.pick([6, 12, 230]), I = r.pick([0.5, 2, 3, 5]), [tl, t] = r.pick([['10 s', 10], ['30 s', 30], ['1 minute', 60], ['2 minutes', 120]]), E = I * V * t;
  return { q: `A device on a ${V} V supply draws ${I} A for ${tl}. How much energy is transferred?`, ans: E, wrong: [I * V, I * V * t / 60 === I * V ? E * 2 : I * V * (t / 60), I * t], unit: 'J', x: `E = I × V × t = ${I} × ${V} × ${t} s = <b>${R.n(E)} J</b>.` }; });
eqGen('P2.13-g1', r => { const I = r.pick([0.2, 0.5, 1, 2, 3, 4]), R_ = r.pick([2, 3, 5, 6, 10, 12, 20, 50]), V = I * R_, k = r.int(0, 2);
  if (k === 0) return { q: `A current of ${I} A flows through a ${R_} Ω resistor. What is the voltage across it?`, ans: V, wrong: [R_ / I, I / R_, R_ + I], unit: 'V', x: `V = I × R = ${I} × ${R_} = <b>${R.n(V)} V</b>.` };
  if (k === 1) return { q: `A resistor has ${R.n(V)} V across it and ${I} A through it. What is its resistance?`, ans: R_, wrong: [V * I, I / V, V - I], unit: 'Ω', x: `R = V ÷ I = ${R.n(V)} ÷ ${I} = <b>${R_} Ω</b>.` };
  return { q: `A supply of ${R.n(V)} V is connected across a ${R_} Ω resistor. What current flows?`, ans: I, wrong: [V * R_, R_ / V, V - R_ > 0 ? V - R_ : V + R_], unit: 'A', x: `I = V ÷ R = ${R.n(V)} ÷ ${R_} = <b>${I} A</b>.` }; });
eqGen('P2.15-g1', r => { const I = r.pick([0.5, 1, 2, 3, 5]), [tl, t] = r.pick([['10 s', 10], ['20 s', 20], ['1 minute', 60], ['5 minutes', 300]]), Q = I * t;
  return { q: `A current of ${I} A flows for ${tl}. How much charge flows?`, ans: Q, wrong: [t / I, I * (t >= 60 ? t / 60 : t * 2), I + t], unit: 'C', x: `Q = I × t = ${I} × ${t} s = <b>${R.n(Q)} C</b>.` }; });
eqGen('P2.19-g1', r => { const a = r.pick([2, 3, 4, 5, 6, 10]), b = r.pick([2, 4, 6, 8, 10, 14]), I = r.pick([0.5, 1, 2]), V = I * (a + b);
  return { q: `A ${a} Ω and a ${b} Ω resistor are in series with a supply of ${R.n(V)} V. What current flows?`, ans: I, wrong: [V / a, V / b, V * (a + b)], unit: 'A', x: `Total resistance = ${a} + ${b} = ${a + b} Ω. I = V ÷ R = ${R.n(V)} ÷ ${a + b} = <b>${I} A</b>.` }; }, true);
eqGen('P2.21-g1', r => { const Q = r.pick([5, 10, 20, 30, 50, 100]), V = r.pick([1.5, 3, 6, 9, 12, 230]), E = Q * V;
  return r.int(0, 1) ? { q: `${Q} C of charge passes through a component with ${V} V across it. How much energy is transferred?`, ans: E, wrong: [V / Q, Q / V, Q + V], unit: 'J', x: `E = Q × V = ${Q} × ${V} = <b>${R.n(E)} J</b>.` }
    : { q: `${Q} C of charge transfers ${R.n(E)} J of energy. What is the voltage?`, ans: V, wrong: [E * Q, Q / E, E - Q], unit: 'V', x: `V = E ÷ Q = ${R.n(E)} ÷ ${Q} = <b>${V} V</b>.` }; });

/* ---------- calculation questions (need working out, so hard to do on the projector) ----------
   Team mode leaves these out unless "Include calculation questions" is ticked. Add new calculation ids here. */
/* ---- added 7 Nov 2026: Chemistry 3, Physics 4, Physics 5 (wrong values are raw numbers; R.n only for display) ---- */
eqGen('C3.3-g1', r => { const m = r.pick([50, 100, 200]), dT = r.pick([2, 4, 5, 6, 8, 10, 15]), Q = m * 4.2 * dT;
  return r.int(0, 1) ? { q: `${m} g of water warms by ${dT} °C. How much heat energy does it gain? (c = 4.2 J/g °C)`, ans: Q, wrong: [m * dT, m * 4.2, Q * 10, Q / 10], unit: 'J', x: `Q = m × c × ΔT = ${m} × 4.2 × ${dT} = <b>${R.n(Q)} J</b>.` }
    : { q: `${m} g of water gains ${R.n(Q)} J of heat energy. By how much does its temperature rise? (c = 4.2 J/g °C)`, ans: dT, wrong: [dT * 4.2, Q / m, m / dT, dT * 10], unit: '°C', x: `ΔT = Q ÷ (m × c) = ${R.n(Q)} ÷ (${m} × 4.2) = <b>${dT} °C</b>.` }; });
G('C3.4-g1', r => { const mol = r.pick([0.02, 0.025, 0.04, 0.05, 0.1]), dH = r.pick([40, 50, 56, 60, 80, 120]), Q = mol * dH * 1000, ex = r.int(0, 2) > 0;
  const sg = v => (v > 0 ? '+' : '−') + R.n(Math.abs(v)) + ' kJ/mol', c = ex ? -dH : dH;
  const o = [sg(c), sg(-c), sg(c * 1000), sg(c / 10)];
  return { q: `${mol} mol of reactant is used up. The solution ${ex ? 'warms up, gaining' : 'cools down, losing'} ${R.n(Q)} J of heat energy. What is ΔH?`, o,
    x: `Q = ${R.n(Q)} J = ${R.n(Q / 1000)} kJ. ΔH = ${ex ? '−' : '+'}Q ÷ moles = ${R.n(Q / 1000)} ÷ ${mol} = <b>${sg(c)}</b> (${ex ? 'exothermic: the solution warmed' : 'endothermic: the solution cooled'}).` }; }, true);
eqGen('P4.4-g1', r => { const tot = r.pick([100, 200, 400, 500, 800, 1000, 2000]), pct = r.pick([10, 20, 25, 30, 40, 60, 75, 80, 90]), use = tot * pct / 100;
  return r.int(0, 2) ? { q: `A device is supplied with ${R.n(tot)} J and transfers ${R.n(use)} J usefully. What is its efficiency?`, ans: pct, wrong: [100 - pct, tot / use * 100, pct / 10, pct * 2], unit: '%', x: `efficiency = useful ÷ total = ${R.n(use)} ÷ ${R.n(tot)} = ${R.n(pct / 100)} = <b>${pct}%</b>.` }
    : { q: `A device is ${pct}% efficient and is supplied with ${R.n(tot)} J. How much energy is transferred usefully?`, ans: use, wrong: [tot - use, tot * pct, tot / pct, use * 10], unit: 'J', x: `useful = efficiency × total = ${R.n(pct / 100)} × ${R.n(tot)} = <b>${R.n(use)} J</b>.` }; });
eqGen('P4.11-g1', r => { const F = r.pick([5, 10, 15, 20, 25, 40, 50, 80, 120, 200]), d = r.pick([2, 3, 4, 5, 6, 8, 10, 12, 20]), W = F * d;
  return r.int(0, 2) ? { q: `A force of ${F} N moves an object ${d} m in the direction of the force. How much work is done?`, ans: W, wrong: [F / d, F + d, W * 10, d / F], unit: 'J', x: `W = F × d = ${F} × ${d} = <b>${R.n(W)} J</b>.` }
    : { q: `${R.n(W)} J of work is done moving an object ${d} m. What force was used?`, ans: F, wrong: [W * d, W - d, F * 10, d / W], unit: 'N', x: `F = W ÷ d = ${R.n(W)} ÷ ${d} = <b>${F} N</b>.` }; });
eqGen('P4.13-g1', r => { const m = r.pick([0.5, 1, 2, 3, 4, 5, 10, 20, 50, 60]), h = r.pick([2, 3, 4, 5, 8, 10, 15, 20]), E = m * 10 * h;
  return r.int(0, 2) ? { q: `A ${m} kg object is lifted ${h} m. What is its gain in gravitational potential energy? (g = 10 N/kg)`, ans: E, wrong: [m * h, m * 10, m * 10 / h, E * 10], unit: 'J', x: `GPE = m × g × h = ${m} × 10 × ${h} = <b>${R.n(E)} J</b>.` }
    : { q: `A ${m} kg object gains ${R.n(E)} J of gravitational potential energy. How high was it lifted? (g = 10 N/kg)`, ans: h, wrong: [E / m, E / 10, h * 10, E * m], unit: 'm', x: `h = GPE ÷ (m × g) = ${R.n(E)} ÷ (${m} × 10) = <b>${h} m</b>.` }; });
eqGen('P4.14-g1', r => { const m = r.pick([1, 2, 4, 5, 10, 50, 80, 1000]), v = r.pick([2, 3, 4, 5, 6, 10, 20]), E = 0.5 * m * v * v;
  return r.int(0, 2) ? { q: `An object of mass ${R.n(m)} kg moves at ${v} m/s. What is its kinetic energy?`, ans: E, wrong: [m * v * v, 0.5 * m * v, m * v], unit: 'J', x: `KE = ½ × m × v² = ½ × ${R.n(m)} × ${v}² = <b>${R.n(E)} J</b>.` }
    : { q: `An object moving at ${v} m/s has ${R.n(E)} J of kinetic energy. What is its mass?`, ans: m, wrong: [m * 2, E / v, m / 2, E / (v * v)], unit: 'kg', x: `m = 2 × KE ÷ v² = 2 × ${R.n(E)} ÷ ${v * v} = <b>${R.n(m)} kg</b>.` }; }, true);
eqGen('P4.17-g1', r => { const P = r.pick([20, 40, 50, 60, 100, 200, 500, 1000, 2000]), t = r.pick([5, 10, 20, 30, 60, 120]), E = P * t, k = r.int(0, 2);
  if (k === 0) return { q: `A machine transfers ${R.n(E)} J in ${t} s. What is its power?`, ans: P, wrong: [E * t, E - t, P * 10, t / E], unit: 'W', x: `P = E ÷ t = ${R.n(E)} ÷ ${t} = <b>${R.n(P)} W</b>.` };
  if (k === 1) return { q: `A ${R.n(P)} W device is used for ${t} s. How much energy does it transfer?`, ans: E, wrong: [P / t, P + t, E * 10, t / P], unit: 'J', x: `E = P × t = ${R.n(P)} × ${t} = <b>${R.n(E)} J</b>.` };
  return { q: `A ${R.n(P)} W motor does ${R.n(E)} J of work. How long does it take?`, ans: t, wrong: [E * P, P / E, t * 10, t / 10], unit: 's', x: `t = E ÷ P = ${R.n(E)} ÷ ${R.n(P)} = <b>${t} s</b>.` }; });
eqGen('P5.3-g1', r => { const rho = r.pick([0.8, 2, 2.5, 2.7, 3, 7.8, 8, 11.3, 19.3]), V = r.pick([2, 4, 5, 10, 20, 50, 100]), m = rho * V, k = r.int(0, 2);
  if (k === 0) return { q: `An object has a mass of ${R.n(m)} g and a volume of ${V} cm³. What is its density?`, ans: rho, wrong: [V / m, m * V, rho * 10, rho / 10], unit: 'g/cm³', x: `ρ = m ÷ V = ${R.n(m)} ÷ ${V} = <b>${rho} g/cm³</b>.` };
  if (k === 1) return { q: `A material has a density of ${rho} g/cm³. What is the mass of ${V} cm³ of it?`, ans: m, wrong: [V / rho, rho / V, rho + V, m * 10], unit: 'g', x: `m = ρ × V = ${rho} × ${V} = <b>${R.n(m)} g</b>.` };
  return { q: `An object of mass ${R.n(m)} g is made of a material of density ${rho} g/cm³. What is its volume?`, ans: V, wrong: [m * rho, rho / m, V * 10, V / 10], unit: 'cm³', x: `V = m ÷ ρ = ${R.n(m)} ÷ ${rho} = <b>${V} cm³</b>.` }; });
eqGen('P5.5-g1', r => { const F = r.pick([20, 50, 100, 200, 500, 600, 800, 1000, 5000]), A = r.pick([0.01, 0.02, 0.04, 0.05, 0.1, 0.2, 0.5, 2]), p = F / A;
  return r.int(0, 2) ? { q: `A force of ${R.n(F)} N acts on an area of ${A} m². What is the pressure?`, ans: p, wrong: [F * A, A / F, F, p * 10], unit: 'Pa', x: `p = F ÷ A = ${R.n(F)} ÷ ${A} = <b>${R.n(p)} Pa</b>.` }
    : { q: `A pressure of ${R.n(p)} Pa acts on an area of ${A} m². What is the force?`, ans: F, wrong: [p / A, A / p, F * 10, F / 10], unit: 'N', x: `F = p × A = ${R.n(p)} × ${A} = <b>${R.n(F)} N</b>.` }; });
eqGen('P5.7-g1', r => { const h = r.pick([0.5, 1, 2, 3, 5, 8, 10, 20, 50]), L = r.pick([['water', 1000], ['sea water', 1030], ['oil', 800], ['mercury', 13600]]), p = h * L[1] * 10;
  return { q: `What is the pressure difference ${h} m below the surface of ${L[0]}? (ρ = ${R.n(L[1])} kg/m³, g = 10 N/kg)`, ans: p, wrong: [h * L[1], L[1] * 10 / h, p * 10, p / 100], unit: 'Pa', x: `p = h × ρ × g = ${h} × ${R.n(L[1])} × 10 = <b>${R.n(p)} Pa</b>.` }; });
G('P5.17-g1', r => { const c = r.pick([-273, -200, -173, -73, -20, 0, 20, 27, 37, 100, 127, 227, 327]), k = c + 273;
  const cs = v => (v < 0 ? '−' + Math.abs(v) : String(v)) + ' °C', ks = v => v + ' K';
  const uniq = (first, cands) => { const o = [first]; for (const s of cands) if (!o.includes(s) && o.length < 4) o.push(s); return o; };
  if (r.int(0, 1)) return { q: `What is ${cs(c).replace(' °C', '')} °C in kelvin?`, o: uniq(ks(k), [ks(Math.abs(c - 273)), ks(Math.abs(c)), ks(k + 100), ks(k + 273), ks(k + 10)]), x: `K = °C + 273 = ${c} + 273 = <b>${k} K</b>.` };
  return { q: `What is ${k} K in °C?`, o: uniq(cs(c), [cs(k + 273), cs(k), cs(-c), cs(c + 100), cs(c - 100)]), x: `°C = K − 273 = ${k} − 273 = <b>${cs(c)}</b>.` }; });
eqGen('P5.21-g1', r => { const p1 = r.pick([50, 80, 100, 120, 150, 200]), T1 = r.pick([200, 250, 300, 400]), f = r.pick([0.5, 1.2, 1.5, 2, 3]), T2 = T1 * f, p2 = p1 * f;
  return r.int(0, 1) ? { q: `A fixed mass of gas at constant volume is at ${p1} kPa and ${T1} K. It is ${f > 1 ? 'heated' : 'cooled'} to ${R.n(T2)} K. What is the new pressure?`, ans: p2, wrong: [p1 / f, p1 + T2 - T1, p1, p2 * 2], unit: 'kPa', x: `p₂ = p₁ × T₂ ÷ T₁ = ${p1} × ${R.n(T2)} ÷ ${T1} = <b>${R.n(p2)} kPa</b>.` }
    : { q: `A sealed gas at ${p1} kPa and ${T1} K changes to ${R.n(p2)} kPa at constant volume. What is its new temperature?`, ans: T2, wrong: [T1 / f, T2 - 273, T1, T2 * 2], unit: 'K', x: `T₂ = T₁ × p₂ ÷ p₁ = ${T1} × ${R.n(p2)} ÷ ${p1} = <b>${R.n(T2)} K</b>.` }; }, true);
eqGen('P5.22-g1', r => { const p1 = r.pick([50, 80, 100, 120, 150, 200]), V1 = r.pick([10, 20, 40, 60, 100, 120]), f = r.pick([0.5, 0.25, 2, 4]), p2 = p1 * f, V2 = V1 / f;
  return r.int(0, 1) ? { q: `A gas has a volume of ${V1} cm³ at ${p1} kPa. At constant temperature its pressure changes to ${R.n(p2)} kPa. What is its new volume?`, ans: V2, wrong: [V1 * f, V1, V2 * 2, V2 / 2], unit: 'cm³', x: `V₂ = p₁ × V₁ ÷ p₂ = ${p1} × ${V1} ÷ ${R.n(p2)} = <b>${R.n(V2)} cm³</b>.` }
    : { q: `A gas at ${p1} kPa has a volume of ${V1} cm³. It is ${f > 1 ? 'compressed' : 'allowed to expand'} to ${R.n(V2)} cm³ at constant temperature. What is the new pressure?`, ans: p2, wrong: [p1 / f, p1, p2 * 2, p2 / 2], unit: 'kPa', x: `p₂ = p₁ × V₁ ÷ V₂ = ${p1} × ${V1} ÷ ${R.n(V2)} = <b>${R.n(p2)} kPa</b>.` }; });

const CALC_IDS = new Set(['P3.5-01', 'P3.5-02', 'P3.5-03', 'P3.6-01', 'P3.6-02', 'P3.6-03', 'P3.6-04', 'P3.7-01', 'P3.7-02', 'P3.7-03', 'P3.7-04',
  'P7.11-03', 'P7.13-01', 'P7.13-02', 'P7.13-03', 'P3.18-01', 'P3.19-02', 'P3.22-01', 'P3.22-02',
  'C1.12-01', 'C1.17-01', 'C1.17-03', 'C1.26-01', 'C1.26-02', 'C1.26-03', 'C1.26-04', 'C1.28-01', 'C1.28-02', 'C1.28-04',
  'C1.29-02', 'C1.30-01', 'C1.31-04', 'C1.33-01', 'C1.33-02', 'C1.33-03', 'C1.33-04', 'C1.36-02',
  'P3.5-g1', 'P3.6-g1', 'P3.7-g1', 'P3.18-g1', 'P3.22-g1', 'P7.13-g1', 'P7.11-g1', 'C1.17-g1', 'C1.12-g1', 'C1.26-g1', 'C1.28-g1', 'C1.29-g1', 'C1.30-g1', 'C1.33-g1',
  'C3.3-g1', 'C3.4-g1', 'P4.4-g1', 'P4.11-g1', 'P4.13-g1', 'P4.14-g1', 'P4.17-g1', 'P5.3-g1', 'P5.5-g1', 'P5.7-g1', 'P5.17-g1', 'P5.21-g1', 'P5.22-g1',
  'P1.4-g1', 'P1.6-g1', 'P1.10-g1', 'P1.15-g1', 'P1.17-g1', 'P1.18-g1', 'P2.4-g1', 'P2.5-g1', 'P2.13-g1', 'P2.15-g1', 'P2.19-g1', 'P2.21-g1',
  'P1.4-01', 'P1.4-02', 'P1.6-01', 'P1.6-03', 'P1.6-04', 'P1.8-02', 'P1.9-02', 'P1.9-03', 'P1.10-02', 'P1.10-03', 'P1.17-01', 'P1.17-02', 'P1.18-01', 'P1.18-03', 'P2.4-01', 'P2.4-02', 'P2.4-03', 'P2.5-01', 'P2.5-03', 'P2.13-01', 'P2.13-02', 'P2.13-04', 'P2.15-01', 'P2.15-03', 'P2.19-02', 'P2.19-03', 'P2.21-01', 'P2.21-03', 'C2.14-02',
  'C3.3-01', 'C3.4-03', 'P4.3-02', 'P4.4-01', 'P4.4-04', 'P4.5-03', 'P4.11-01', 'P4.11-04', 'P4.12-04', 'P4.13-01', 'P4.14-02', 'P4.15-02', 'P4.17-01', 'P4.17-02', 'P4.17-03', 'P5.3-02', 'P5.3-04', 'P5.5-02', 'P5.7-02', 'P5.7-04', 'P5.17-01', 'P5.17-02', 'P5.17-04', 'P5.21-02', 'P5.22-02', 'P5.22-03']);
QUESTIONS.forEach(q => { if (CALC_IDS.has(q.id)) q.calc = true; });
