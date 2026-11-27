/* Screen-only cross-layer links for printable science worksheets.
 * Injects Flashcards, Practice, Study guide and Topic booklet links into
 * .screen-links (which css/print-sheet.css hides completely on @media print).
 * Zero print footprint and zero effect on printable A4 pagination. */
(function () {
  var bar = document.querySelector('.screen-links');
  if (!bar) return;
  var m = location.pathname.match(/\/worksheets\/(biology|chemistry|physics)\/(ks[34])\/([^/]+)\.html$/i);
  if (!m) return;

  var subj = m[1].toLowerCase();
  var stem = m[3].replace(/_ms$/i, '').replace(/_sa$/i, '');

  var MAP = {
    'biology/1_living_organisms':       { subs: ['B1a', 'B1b'], lesson: '/interactive/lessons/biology/1/' },
    'biology/1b_classifying_organisms': { subs: ['B1a', 'B1b'], lesson: '/interactive/lessons/biology/1/' },
    'biology/2ab_cells_organisation':   { subs: ['B2a', 'B2b'], lessons: [{ href: '/interactive/lessons/biology/2a/', text: 'Study guide (2a)' }, { href: '/interactive/lessons/biology/2b/', text: 'Study guide (2b)' }] },
    'biology/2c1_molecules_food_tests': { subs: ['B2c'], lesson: '/interactive/lessons/biology/2c/' },
    'biology/2c2_enzymes':              { subs: ['B2c'], lesson: '/interactive/lessons/biology/2c/' },
    'biology/2d_diffusion_osmosis':     { subs: ['B2d'], lesson: '/interactive/lessons/biology/2d/' },
    'biology/2e1_photosynthesis_plants':{ subs: ['B2e'] },
    'biology/2e2_human_nutrition':      { subs: ['B2e'] },
    'biology/2f_respiration':           { subs: ['B2f'], lesson: '/interactive/lessons/biology/2f/' },
    'biology/3a1_reproduction_plants':  { subs: ['B3a'] },
    'biology/3a2_human_reproduction':   { subs: ['B3a'] },
    'biology/4ab_ecosystems_feeding':   { subs: ['B4a', 'B4b'] },

    'chemistry/1a_states_of_matter':            { subs: ['C1a'], lesson: '/interactive/lessons/chemistry/1a/' },
    'chemistry/1b_elements_compounds_mixtures': { subs: ['C1b'] },
    'chemistry/1c_atomic_structure':            { subs: ['C1c'] },
    'chemistry/1d_periodic_table':              { subs: ['C1d'] },
    'chemistry/1e1_balancing_equations':        { subs: ['C1e'] },
    'chemistry/1e2_moles_1':                    { subs: ['C1e'] },
    'chemistry/1e3_reacting_masses':            { subs: ['C1e'] },
    'chemistry/1e4_empirical_formulae':         { subs: ['C1e'] },
    'chemistry/1e5_moles_2':                    { subs: ['C1e'] },
    'chemistry/1fg1_bonding_electrons_charge':  { subs: ['C1f', 'C1g'], lessons: [{ href: '/interactive/lessons/chemistry/1f/', text: 'Study guide (1f)' }, { href: '/interactive/lessons/chemistry/1g/', text: 'Study guide (1g)' }], booklet: '/booklets/chemistry/ionic-covalent-bonding.html' },
    'chemistry/1fg2_structure_properties':      { subs: ['C1f', 'C1g'], lessons: [{ href: '/interactive/lessons/chemistry/1f/', text: 'Study guide (1f)' }, { href: '/interactive/lessons/chemistry/1g/', text: 'Study guide (1g)' }], booklet: '/booklets/chemistry/ionic-covalent-bonding.html' },
    'chemistry/1_review':                       { subs: ['C1a', 'C1b', 'C1c', 'C1d', 'C1e', 'C1f', 'C1g'] },
    'chemistry/2d_reactivity_series':           { subs: ['C2d'] },
    'chemistry/2f_making_salts':                { subs: ['C2f'] },

    'physics/3b2_wave_speed':          { subs: ['P3b'] },
    'physics/3b3_wave_speed_problems': { subs: ['P3b'] },
    'physics/8bc_space_stars':         { subs: ['P8b', 'P8c'], lesson: '/interactive/lessons/physics/8/' },
    'physics/8_review':                { subs: ['P8b', 'P8c'], lesson: '/interactive/lessons/physics/8/' }
  };

  var info = MAP[subj + '/' + stem];
  if (!info) return;

  var items = [];
  if (info.subs && info.subs.length) {
    var fcHref = info.subs.length === 1
      ? '/Flashcards/?sub=' + encodeURIComponent(info.subs[0])
      : '/Flashcards/?subs=' + encodeURIComponent(info.subs.join(','));
    items.push({ href: fcHref, text: 'Flashcards' });
    items.push({ href: '/interactive/spec-quiz/practice.html?sub=' + encodeURIComponent(info.subs[0]), text: 'Practice' });
  }
  if (info.lessons && info.lessons.length) {
    for (var j = 0; j < info.lessons.length; j++) items.push(info.lessons[j]);
  } else if (info.lesson) {
    items.push({ href: info.lesson, text: 'Study guide' });
  }
  if (info.booklet) items.push({ href: info.booklet, text: 'Topic booklet' });
  if (!items.length) return;

  var anchor = bar.querySelector('.review-chip');
  var sep = document.createElement('span');
  sep.textContent = '·';
  sep.setAttribute('aria-hidden', 'true');
  sep.style.cssText = 'color:#999;user-select:none';
  bar.insertBefore(sep, anchor || null);

  for (var i = 0; i < items.length; i++) {
    var a = document.createElement('a');
    a.href = items[i].href;
    a.textContent = items[i].text;
    bar.insertBefore(a, anchor || null);
  }
})();
