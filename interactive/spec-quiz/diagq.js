/* Diagram questions in the bank (18 Nov 2026; user: "make them repeatable with codes as you say, add them to the bank").
   Each id is one drawing type from diagrams.js (DG) + one kind of question on one spec point. The ids are permanent, like every
   question id: progress is saved against them — never renumber, reuse or delete; add new ones with the next free number.
   A drawing comes from a seed (a whole number): the same id + seed always redraws exactly the same picture, numbers and options,
   in any browser. The seed travels with the question (q.seed) into reports (specQuizReports/…/seed) and set-work answers.
   Load after gens.js on every page that loads the bank, so question counts match everywhere. Pages that SHOW questions also load
   /interactive/cell-game/cells.js and diagrams.js (DQ.ok() is true there); everywhere else diagram questions are left out of
   anything that gets built. Row = [id, maker, ★ harder (1) or not (0), regular expression the question text must match]. */
var DQ = (function () {
  const LIST = [
    /* ---------- physics ---------- */
    ['P1.3-d1', 'dt', 0, '^For how long is the object stationary'], ['P1.3-d2', 'dt', 0, '^What is the speed during the first'],
    ['P1.8-d1', 'vt', 0, '^What is the acceleration during'], ['P1.8-d2', 'vt', 1, '^What is the deceleration between'],
    ['P1.9-d1', 'vt', 0, '^How far does the object travel'], ['P1.9-d2', 'vt', 1, '^What is the total distance travelled'],
    ['P1.15-d1', 'forces', 0, '^What is the resultant force'], ['P1.15-d2', 'forces', 0, 'Use the scale bar'],
    ['P1.16-d1', 'forces', 0, 'What happens to its speed'],
    ['P1.19-d1', 'stopping', 0, '^What is the total stopping distance'],
    ['P1.20-d1', 'stopping', 0, '^How does braking distance change'], ['P1.20-d2', 'stopping', 0, '^Which part of the stopping distance gets longer'],
    ['P1.22-d1', 'scales', 0, '^How long is the bar'], ['P1.22-d2', 'scales', 0, 'newton meter'],
    ['P1.23-d1', 'fe', 0, '^What happens to the spring after point'], ['P1.23-d2', 'fe', 0, '^What is the extension when'],
    ['P2.7-d1', 'circuit', 0, '^What is the voltage across the'], ['P2.7-d2', 'circuit', 1, 'breaks\\. What happens to'],
    ['P2.9-d1', 'circuit', 0, '^What is component'], ['P2.9-d2', 'circuit', 1, '^What is component'],
    ['P2.10-d1', 'iv', 0, 'current–voltage graph'],
    ['P2.11-d1', 'circuit', 0, 'resistance goes down when more light'],
    ['P2.13-d1', 'scales', 0, '^What does the (ammeter|voltmeter) read'],
    ['P2.17-d1', 'circuit', 0, '^Ammeter \\S+ reads'], ['P2.17-d2', 'circuit', 1, '^Ammeter \\S+ reads'],
    ['P2.17-d3', 'circuit', 0, 'in the main wire read'], ['P2.17-d4', 'circuit', 1, 'in the main wire read'],
    ['P2.19-d1', 'circuit', 0, 'switch is closed\\. What does the ammeter read'], ['P2.19-d2', 'circuit', 1, 'switch is closed\\. What does the ammeter read'],
    ['P2.19-d3', 'circuit', 0, 'switch is closed\\. What does the voltmeter read'], ['P2.19-d4', 'circuit', 1, 'switch is closed\\. What does the voltmeter read'],
    ['P2.19-d5', 'circuit', 0, 'total resistance of the circuit'], ['P2.19-d6', 'circuit', 1, 'total resistance of the circuit'],
    ['P2.19-d7', 'circuit', 1, '^V\\d reads'],
    ['P3.2-d1', 'wave', 0, 'regions labelled'],
    ['P3.3-d1', 'wave', 0, 'amplitude'], ['P3.3-d2', 'wave', 0, 'wavelength of this wave'], ['P3.3-d3', 'wave', 0, 'time period'],
    ['P3.5-d1', 'wave', 0, 'What is the frequency of this wave'], ['P3.5-d2', 'wave', 1, 'What is the wave speed'],
    ['P3.11-d1', 'emspec', 0, '^Which part of the spectrum'], ['P3.12-d1', 'emspec', 0, 'used for\\?$'],
    ['P3.15-d1', 'reflect', 0, 'between the ray and the mirror'], ['P3.15-d2', 'reflect', 0, 'between the incoming ray and the reflected ray'],
    ['P3.16-d1', 'reflect', 0, 'Which angle is the angle of reflection'],
    ['P3.16-d2', 'ray', 0, '^Which angle is the angle of refraction\\?$'], ['P3.16-d3', 'ray', 0, 'how does it bend'],
    ['P3.17-d1', 'ray', 0, 'comes out of the bottom of the block'], ['P3.17-d2', 'ray', 0, 'angle of refraction where the ray enters'],
    ['P3.18-d1', 'ray', 0, 'What is the refractive index of'], ['P3.18-d2', 'ray', 1, '^The refractive index of .* What is angle'],
    ['P3.21-d1', 'tir', 0, '^What is happening to the ray at'], ['P3.21-d2', 'tir', 0, '^The critical angle for .* What happens to the ray'],
    ['P3.21-d3', 'tir', 0, 'dashed ray is weak'], ['P3.21-d4', 'tir', 0, 'along the surface of the .* called'],
    ['P3.21-d5', 'tir', 0, 'must be true for this to happen'],
    ['P3.22-d1', 'tir', 1, 'What is the critical angle\\?$'],
    ['P4.3-d1', 'sankey', 0, 'usefully transferred as'], ['P4.3-d2', 'sankey', 0, 'wasted altogether'], ['P4.3-d3', 'sankey', 1, 'wasted altogether'],
    ['P4.3-d4', 'sankey', 0, '^How much energy is wasted as'], ['P4.3-d5', 'sankey', 0, 'sound arrow so much thinner'],
    ['P4.4-d1', 'sankey', 0, '^What is the efficiency of'], ['P4.4-d2', 'sankey', 1, '^What is the efficiency of'],
    ['P5.3-d1', 'density', 0, '^What is the density of'],
    ['P5.4-d1', 'density', 0, '^What is the volume of'], ['P5.4-d2', 'scales', 0, 'measuring cylinder'],
    ['P5.7-d1', 'pressure', 0, 'pressure due to the liquid greatest'], ['P5.7-d2', 'pressure', 0, '^The density of .* pressure due to the liquid'],
    ['P5.7-d3', 'pressure', 0, 'squirt furthest'],
    ['P5.16-d1', 'gaslaw', 0, 'goes through 0 K'], ['P5.17-d1', 'gaslaw', 0, ' K\\. What is that in °C'],
    ['P5.20-d1', 'gaslaw', 0, 'Why does the pressure go up when the volume'], ['P5.21-d1', 'gaslaw', 0, 'at constant volume'],
    ['P5.22-d1', 'gaslaw', 0, 'squashed to'],
    ['P6.4-d1', 'magnet', 0, 'Which end of the bar magnet is the north'], ['P6.4-d2', 'magnet', 0, 'stronger, at'],
    ['P6.4-d3', 'magnet', 0, 'attract or repel'], ['P6.4-d4', 'magnet', 0, 'halfway between the magnets'],
    ['P6.4-d5', 'magnet', 0, 'in the middle of the gap'], ['P6.4-d6', 'magnet', 0, 'Which pole is on the left'],
    ['P6.13-d1', 'motor', 0, 'Which way is the force on the wire'], ['P6.14-d1', 'motor', 0, 'make the force on the wire bigger'],
    ['P7.2-d1', 'nucleus', 0, 'Which symbol describes this atom'],
    ['P7.5-d1', 'penetration', 0, '^Which radiation is'], ['P7.5-d2', 'penetration', 0, '^What is radiation'],
    ['P7.13-d1', 'half', 0, 'half-life'], ['P7.13-d2', 'half', 1, 'half-life'],
    /* ---------- chemistry ---------- */
    ['C1.1-d1', 'particles', 0, '^Which box shows a (solid|liquid|gas)'], ['C1.1-d2', 'particles', 0, 'lines behind the particles'],
    ['C1.1-d3', 'cool', 0, 'mixture of liquid and solid'], ['C1.1-d4', 'cool', 0, 'melting point'],
    ['C1.2-d1', 'particles', 0, 'change from box'],
    ['C1.8-d1', 'particles', 0, 'Which box shows an element'], ['C1.8-d2', 'particles', 0, 'Which box shows a compound'],
    ['C1.8-d3', 'particles', 0, 'Which box shows a mixture'],
    ['C1.10-d1', 'separation', 0, 'Which separation technique'], ['C1.10-d2', 'separation', 0, '^What is part'],
    ['C1.10-d3', 'separation', 0, '^Which letter labels'], ['C1.10-d4', 'separation', 0, '^What does part'],
    ['C1.10-d5', 'separation', 0, 'cold water go into the condenser'],
    ['C1.12-d1', 'chrom', 0, '^Which dyes are in mixture'], ['C1.12-d2', 'chrom', 1, '^Which dyes are in mixture'],
    ['C1.12-d3', 'chrom', 0, 'At least how many different substances'], ['C1.12-d4', 'chrom', 1, 'At least how many different substances'],
    ['C1.12-d5', 'chrom', 0, 'could be pure substances'], ['C1.12-d6', 'chrom', 0, 'Rf value'], ['C1.12-d7', 'chrom', 1, 'Rf value'],
    ['C1.12-d8', 'chrom', 1, 'stayed on the start line'],
    ['C1.15-d1', 'nucleus', 0, 'overall charge'],
    ['C1.16-d1', 'nucleus', 0, 'mass number of this atom'], ['C1.16-d2', 'nucleus', 0, '^Which element is this'],
    ['C1.16-d3', 'nucleus', 0, '^Another atom of .* How many neutrons'],
    ['C1.22-d1', 'atom', 0, 'What is the electronic configuration shown'], ['C1.22-d2', 'atom', 1, 'What is the electronic configuration shown'],
    ['C1.22-d3', 'atom', 0, 'Which element has this electronic configuration'], ['C1.22-d4', 'atom', 1, 'Which element has this electronic configuration'],
    ['C1.24-d1', 'atom', 0, 'group and period'],
    ['C1.36-d1', 'ionic', 0, '^Which group of the Periodic Table is'],
    ['C1.38-d1', 'ionic', 0, '^What is the charge on the'], ['C1.38-d2', 'ionic', 1, '^What is the charge on the'],
    ['C1.40-d1', 'ionic', 0, 'Which compound does this diagram show'], ['C1.40-d2', 'ionic', 1, 'Which compound does this diagram show'],
    ['C1.40-d3', 'ionic', 0, 'How many electrons does each'], ['C1.40-d4', 'ionic', 1, 'How many electrons does each'],
    ['C1.46-d1', 'covalent', 0, 'Which molecule does this diagram show'], ['C1.46-d2', 'covalent', 1, 'Which molecule does this diagram show'],
    ['C1.46-d3', 'covalent', 0, 'How many pairs of electrons are shared'], ['C1.46-d4', 'covalent', 1, 'How many pairs of electrons are shared'],
    ['C1.46-d5', 'covalent', 0, 'lone pairs'], ['C1.46-d6', 'covalent', 1, 'lone pairs'],
    ['C1.46-d7', 'covalent', 0, 'outer shell of'], ['C1.46-d8', 'covalent', 1, 'outer shell of'],
    ['C1.46-d9', 'covalent', 1, 'What kind of bonding'],
    ['C2.14-d1', 'airO2', 0, 'percentage of the air was oxygen'], ['C2.14-d2', 'airO2', 0, 'What volume of oxygen reacted'],
    ['C2.16-d1', 'displace', 0, 'order of reactivity'], ['C2.16-d2', 'displace', 1, 'order of reactivity'],
    ['C2.16-d3', 'displace', 0, '^Which metal is the (least|most) reactive'], ['C2.16-d4', 'displace', 0, 'more reactive than'],
    ['C2.16-d5', 'displace', 0, '^Why did nothing happen'], ['C2.16-d6', 'displace', 0, '^Will .* react with a solution of'],
    ['C2.29-d1', 'ph', 0, 'Which one is'], ['C2.30-d1', 'ph', 0, 'approximate pH'],
    ['C3.1-d1', 'calorim', 0, 'exothermic or endothermic'],
    ['C3.2-d1', 'calorim', 0, 'What was the temperature change'], ['C3.2-d2', 'scales', 0, 'thermometer show'],
    ['C3.3-d1', 'calorim', 0, 'heat energy was transferred'],
    ['C3.1-d2', 'profile', 0, 'Is this reaction exothermic or endothermic'], ['C3.1-d3', 'profile', 0, 'overall energy change'],
    ['C3.13-d1', 'profile', 0, 'activation energy'],
    ['C3.10-d1', 'rate', 0, 'more concentrated acid'], ['C3.10-d2', 'rate', 0, 'total volume of gas'], ['C3.10-d3', 'rate', 0, 'total mass of carbon dioxide'],
    ['C3.15-d1', 'table', 0, 'leaving out the anomalous'],
    ['C4.8-d1', 'fraccol', 0, 'highest boiling point'], ['C4.8-d2', 'fraccol', 0, 'leave the column at different heights'],
    ['C4.9-d1', 'fraccol', 0, 'Which fraction is collected at'], ['C4.9-d2', 'fraccol', 0, 'used for\\?$'],
    ['C4.21-d1', 'displayed', 0, '^Name this molecule'], ['C4.21-d2', 'displayed', 0, 'molecular formula'],
    ['C4.26-d1', 'displayed', 0, '^Name this molecule'], ['C4.26-d2', 'displayed', 0, 'molecular formula'],
    /* ---------- biology ---------- */
    ['B2.2-d1', 'cell', 0, '^What is part'], ['B2.2-d2', 'cell', 0, 'job of part'], ['B2.2-d3', 'cell', 0, 'What kind of organism'],
    ['B2.10-d1', 'enzyme', 0, 'optimum temperature'],
    ['B2.15-d1', 'osmosis', 0, 'pure water\\) gain mass'],
    ['B2.17-d1', 'osmosis', 0, 'neither gain nor lose'], ['B2.17-d2', 'osmosis', 0, 'percentage change in mass at'],
    ['B2.20-d1', 'photo', 0, 'limiting the rate'],
    ['B2.21-d1', 'leaf', 0, '^What is part'], ['B2.21-d2', 'leaf', 0, '^Which letter labels'], ['B2.21-d3', 'leaf', 0, '^What does part'],
    ['B2.27-d1', 'gut', 0, '^What is part'], ['B2.27-d2', 'gut', 0, '^Which letter labels'], ['B2.27-d3', 'gut', 0, '^What does part'],
    ['B2.27-d4', 'gut', 0, 'small intestine so long'],
    ['B2.46-d1', 'thorax', 0, '^What is part'], ['B2.46-d2', 'thorax', 0, '^Which letter labels'], ['B2.46-d3', 'thorax', 0, '^What does part'],
    ['B2.47-d1', 'thorax', 0, 'diaphragm do when you breathe'],
    ['B2.65-d1', 'heart', 0, '^What is part'], ['B2.65-d2', 'heart', 0, '^Which letter labels'], ['B2.65-d3', 'heart', 0, '^What does part'],
    ['B2.65-d4', 'heart', 0, 'carries oxygenated blood'], ['B2.65-d5', 'heart', 0, 'thicker wall'],
    ['B2.90-d1', 'reflex', 0, '^What is part'], ['B2.90-d2', 'reflex', 0, '^Which letter labels'], ['B2.90-d3', 'reflex', 0, '^What does part'],
    ['B2.90-d4', 'reflex', 0, 'In what order does the impulse'],
    ['B2.91-d1', 'eye', 0, '^What is part'], ['B2.91-d2', 'eye', 0, '^Which letter labels'], ['B2.91-d3', 'eye', 0, '^What does part'],
    ['B2.92-d1', 'eye', 0, 'What happens to the pupil'],
    ['B3.3-d1', 'flower', 0, '^What is part'], ['B3.3-d2', 'flower', 0, '^Which letter labels'], ['B3.3-d3', 'flower', 0, '^What does part'],
    ['B3.3-d4', 'flower', 0, 'insects or by the wind'],
    ['B3.9-d1', 'menstrual', 0, 'Which line shows progesterone'], ['B3.9-d2', 'menstrual', 0, 'ovulation happen'],
    ['B3.9-d3', 'menstrual', 0, 'progesterone level falls'], ['B3.9-d4', 'menstrual', 0, 'uterus lining between'],
    ['B3.23-d1', 'punnett', 0, 'probability that a child'],
    ['B3.24-d1', 'pedigree', 0, 'genotypes of parents'], ['B3.24-d2', 'pedigree', 0, "chance that the parents' next child"],
    ['B4.2-d1', 'quadrat', 0, 'mean number of'], ['B4.2-d2', 'quadrat', 0, '^Estimate the number of'],
    ['B4.6-d1', 'foodweb', 0, '^Which of these is a'], ['B4.6-d2', 'foodweb', 1, '^Which of these is a'],
    ['B4.6-d3', 'foodweb', 0, 'trophic levels'], ['B4.6-d4', 'foodweb', 1, 'trophic levels'],
    ['B4.7-d1', 'foodweb', 0, '^Which of these does the'], ['B4.7-d2', 'foodweb', 1, '^Which of these does the'],
    ['B4.8-d1', 'foodweb', 0, 'What do the arrows'],
    ['B4.9-d1', 'pyramid', 0, '^What percentage of the'], ['B4.9-d2', 'pyramid', 0, '^Why is there less'],
    ['B4.10-d1', 'carbon', 0, '^Which process is shown by arrow'], ['B4.10-d2', 'carbon', 0, '^Which arrow shows'],
  ];
  const strip = s => String(s).replace(/<[^>]+>/g, '');
  const BY = {}; LIST.forEach(([id, maker, hard, re]) => { BY[id] = { id, spec: id.split('-')[0], maker, hard: !!hard, rx: new RegExp(re) }; });
  const ok = () => typeof DG !== 'undefined';
  const SEED_MAX = 2147483646, seedAt = (s0, k) => ((s0 - 1 + k * 7919) % SEED_MAX) + 1;
  /* make(id) → a new drawing for that id; make(id, seed) → that exact drawing again. Returns {q, o, x, svg, seed, title, kind} or null. */
  function make(id, seed) {
    const e = BY[id]; if (!e || !ok()) return null;
    if (seed) { const d = DG.make(e.maker, e.hard, seed); return { q: d.q, o: d.o, x: d.x, svg: d.svg, seed, title: d.title, kind: d.kind }; }
    const s0 = DG.newSeed(), av = window.CBSCourse && CBSCourse.dqAvoid; /* Single Award students: skip drawings that go beyond their course */
    for (let k = 0; k < 800; k++) { const s = seedAt(s0, k), d = DG.make(e.maker, e.hard, s); if (d.spec === e.spec && e.rx.test(strip(d.q)) && !(av && av.test(strip(d.q) + ' ' + d.o.map(strip).join(' ')))) return { q: d.q, o: d.o, x: d.x, svg: d.svg, seed: s, title: d.title, kind: d.kind }; }
    return null;
  }
  /* register in the bank: gen() is called by inst() wherever a question is built */
  if (typeof QUESTIONS !== 'undefined') LIST.forEach(([id, maker, hard]) => QUESTIONS.push({ id, s: id.split('-')[0], hard: !!hard, dg: maker,
    gen: () => make(id) || { q: '(Diagram question: open it in Practice or a mission to see the drawing.)', o: ['–', '–', '–', '–'], x: '' } }));
  /* ---------- showing them (missions, Practice, quick quiz, map, set work, admin, reports) ---------- */
  const isLetters = o => o.length > 1 && o.every(t => /^[A-Z][0-9]?$/.test(strip(t).trim()));
  function figure(q, cls = '') { return q && q.svg ? `<div class="dqfig ${cls}" role="img" aria-label="${(q.title || 'Diagram').replace(/"/g, '')}" title="Tap to enlarge">${q.svg}</div>` : ''; }
  let styled = false;
  function style() {
    if (styled || typeof document === 'undefined') return; styled = true;
    const s = document.createElement('style');
    s.textContent = '.dqfig{background:#fff;border:1px solid #e5e1d5;border-radius:10px;padding:6px;margin:4px 0 12px;cursor:zoom-in;color:#111}.dqfig svg{display:block;width:100%;height:auto;max-height:56vh}'
      + '.dqbig{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.82);display:flex;align-items:center;justify-content:center;padding:10px;cursor:zoom-out}'
      + '.dqbig>div{background:#fff;border-radius:10px;padding:8px;width:100%;max-width:1100px;max-height:96vh;overflow:auto}.dqbig svg{display:block;width:100%;height:auto;max-height:92vh}';
    document.head.appendChild(s);
    document.addEventListener('click', e => {
      const f = e.target.closest && e.target.closest('.dqfig'); if (!f || f.closest('.dqbig')) return;
      const b = document.createElement('div'); b.className = 'dqbig'; b.innerHTML = `<div>${f.innerHTML}</div>`; b.addEventListener('click', () => b.remove()); document.body.appendChild(b);
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.dqbig').forEach(b => b.remove()); });
  }
  /* HTML for the drawing above a question (empty for ordinary questions) */
  function fig(q, cls) { if (!q || !q.svg) return ''; style(); return figure(q, cls); }
  /* options that are just letters (\"Which letter labels…\") read best in order, with numbered keys so key A doesn't mean option \"C\" */
  function order(opts, textOf = x => x) { const L = opts.length && isLetters(opts.map(textOf)); return L ? { opts: opts.slice().sort((a, b) => strip(textOf(a)).localeCompare(strip(textOf(b)))), keys: '1234', letters: true } : { opts, keys: 'ABCD', letters: false }; }
  return { LIST, BY, ok, make, fig, order, isLetters, count: LIST.length };
})();
