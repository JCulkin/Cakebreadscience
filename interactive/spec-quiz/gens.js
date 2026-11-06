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
