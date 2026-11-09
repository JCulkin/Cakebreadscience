/* Question bank for Cakebread Questing (formerly the Spec Quiz). Every question has a PERMANENT id: spec point + number, e.g. 'P3.5-03' = Physics 3.5, question 3.
   Campaign progress is saved against these ids, so NEVER renumber, reuse or delete an id: give a new question the next free number
   for its point, and if a question is wrong, fix its wording rather than replacing it. Randomised calculations live in gens.js.
   M(id, question, [correct, wrong, wrong, wrong], explanation)  → multiple choice (options are shuffled at runtime)
   T(id, statement, true|false, explanation)                     → true or false
   MH / TH → the same, marked ★ harder (worth double in team mode; shown only if 'Include harder questions' is ticked)
   Keep to the Edexcel International GCSE Science (Double Award) wording and scope. */
const QUESTIONS = [];
const _sp = id => id.split('-')[0];
function M(id, q, o, x) { QUESTIONS.push({ id, s: _sp(id), q, o, x }); }
function T(id, q, tf, x) { QUESTIONS.push({ id, s: _sp(id), q, tf, x }); }
function MH(id, q, o, x) { QUESTIONS.push({ id, s: _sp(id), q, o, x, hard: true }); }   // ★ harder
function TH(id, q, tf, x) { QUESTIONS.push({ id, s: _sp(id), q, tf, x, hard: true }); }

/* ===================== PHYSICS 3(b) Properties of waves ===================== */
M('P3.2-01', 'In a <b>transverse</b> wave, the oscillations are…',
  ['at right angles to the direction of energy transfer', 'parallel to the direction of energy transfer', 'in circles around the direction of travel', 'only in the direction the wave is moving'],
  'Transverse: oscillations are <b>perpendicular</b> to the direction the wave transfers energy (e.g. light, water ripples).');
M('P3.2-02', 'Which of these is a <b>longitudinal</b> wave?',
  ['Sound', 'Light', 'Microwaves', 'Ripples on water'],
  'Sound is longitudinal. All electromagnetic waves and water ripples are transverse.');
T('P3.2-03', 'Longitudinal waves have compressions and rarefactions.', true,
  'True. The oscillations are parallel to the direction of travel, so particles bunch up (compressions) and spread out (rarefactions).');
T('P3.2-04', 'Light waves are longitudinal.', false,
  'False. Light (and every electromagnetic wave) is <b>transverse</b>.');
M('P3.3-01', 'What is the <b>amplitude</b> of a wave?',
  ['The maximum displacement of a point from its rest position', 'The distance from a peak to a trough', 'The number of waves passing a point each second', 'The time taken for one complete wave'],
  'Amplitude is measured from the rest (middle) position to a peak, not peak to trough.');
M('P3.3-02', 'What is the <b>wavelength</b> of a wave?',
  ['The distance from a point on one wave to the same point on the next wave', 'The distance from a peak to the next trough, measured along the wave', 'The height of a peak measured from the middle (rest) position', 'The distance the wave travels in one second through the medium'],
  'Wavelength (λ) is one complete wave, e.g. peak to the next peak.');
M('P3.3-03', 'What is the <b>frequency</b> of a wave?',
  ['The number of waves passing a point each second', 'The time taken for one complete wave', 'The distance travelled by the wave each second', 'The number of peaks on a diagram'],
  'Frequency is measured in hertz (Hz). 1 Hz = one wave per second.');
M('P3.3-04', 'What is the <b>period</b> of a wave?',
  ['The time taken for one complete wave to pass a point', 'The number of waves passing a point each second', 'The length of one complete wave', 'The time for the wave to reach its maximum amplitude'],
  'The period (T) is measured in seconds.');
M('P3.3-05', 'What is a <b>wavefront</b>?',
  ['A line joining points that are in step, such as all the peaks', 'The leading edge of the very first wave sent out by the source', 'The highest point reached by a wave above its rest position', 'An arrow showing the direction in which the wave is travelling'],
  'On a wavefront diagram each line is a wavefront; the gap between neighbouring wavefronts is one wavelength.');
T('P3.3-06', 'The distance from a peak to the next trough is one wavelength.', false,
  'False. Peak to trough is only <b>half</b> a wavelength. Peak to the next peak is one wavelength.');
T('P3.4-01', 'Waves transfer matter from one place to another.', false,
  'False. Waves transfer <b>energy and information</b> without transferring matter.');
M('P3.4-02', 'A cork floating on a pond bobs up and down as ripples pass, but does not move along with them. What does this show?',
  ['Waves transfer energy without transferring matter', 'Water waves are longitudinal, so the cork moves sideways', 'The ripples have too little energy to move the cork along', 'The cork is too heavy to be carried along by the water'],
  'The water (and cork) only oscillates about a fixed position. The energy moves on; the matter does not.');
M('P3.5-01', 'A wave has a frequency of 50 Hz and a wavelength of 2 m. What is its speed?',
  ['100 m/s', '25 m/s', '52 m/s', '0.04 m/s'],
  'v = f × λ = 50 × 2 = <b>100 m/s</b>.');
M('P3.5-02', 'A sound wave travels at 340 m/s and has a frequency of 170 Hz. What is its wavelength?',
  ['2 m', '0.5 m', '510 m', '57 800 m'],
  'λ = v ÷ f = 340 ÷ 170 = <b>2 m</b>.');
M('P3.5-03', 'A wave has a speed of 12 m/s and a wavelength of 3 m. What is its frequency?',
  ['4 Hz', '36 Hz', '0.25 Hz', '15 Hz'],
  'f = v ÷ λ = 12 ÷ 3 = <b>4 Hz</b>.');
T('P3.5-04', 'If the speed of a wave stays the same and its frequency doubles, its wavelength halves.', true,
  'True. v = f × λ, so if v is fixed, doubling f halves λ.');
M('P3.6-01', 'A wave has a time period of 0.02 s. What is its frequency?',
  ['50 Hz', '0.02 Hz', '5 Hz', '500 Hz'],
  'f = 1 ÷ T = 1 ÷ 0.02 = <b>50 Hz</b>.');
M('P3.6-02', 'A wave has a frequency of 4 Hz. What is its time period?',
  ['0.25 s', '4 s', '0.4 s', '2.5 s'],
  'T = 1 ÷ f = 1 ÷ 4 = <b>0.25 s</b>.');
M('P3.7-01', 'A microwave has a frequency of 1.0 × 10¹⁰ Hz and a wavelength of 0.03 m. What is its speed?',
  ['3 × 10⁸ m/s', '3 × 10¹¹ m/s', '3.3 × 10¹¹ m/s', '3 × 10⁻¹² m/s'],
  'v = f × λ = 1.0 × 10¹⁰ × 0.03 = <b>3 × 10⁸ m/s</b>, the speed of all electromagnetic waves in free space.');
M('P3.7-02', 'A radio station broadcasts at a frequency of 200 000 Hz. Radio waves travel at 3 × 10⁸ m/s. What is the wavelength?',
  ['1500 m', '6 × 10¹³ m', '0.0015 m', '667 m'],
  'λ = v ÷ f = 300 000 000 ÷ 200 000 = <b>1500 m</b>.');
M('P3.8-01', 'An ambulance drives <b>towards</b> you with its siren on. Compared with a stationary siren, you hear…',
  ['a higher frequency (higher pitch)', 'a lower frequency (lower pitch)', 'the same frequency but louder', 'the same frequency and pitch'],
  'Doppler effect: the waves get bunched up in front of a moving source, so the observed wavelength is shorter and the frequency is higher.');
M('P3.8-02', 'A source of waves moves <b>away</b> from an observer. What happens to the observed wavelength and frequency?',
  ['Wavelength increases, frequency decreases', 'Wavelength decreases, frequency increases', 'Both increase', 'Both stay the same'],
  'Behind a moving source the waves are stretched out: longer wavelength, lower frequency.');
T('P3.8-03', 'The Doppler effect only happens with sound waves.', false,
  'False. It happens with all waves, including light (e.g. red-shift of distant galaxies).');
T('P3.9-01', 'All waves can be reflected and refracted.', true,
  'True. This is true for sound, light, water waves and all electromagnetic waves.');
M('P3.9-02', 'What is <b>refraction</b>?',
  ['A change in direction when a wave changes speed entering a new medium', 'A wave bouncing back off a surface at the same angle it arrived', 'A wave gradually losing energy as it travels through a material', 'A wave spreading out after it passes through a narrow gap'],
  'Refraction happens because the wave changes speed at the boundary between two materials.');

/* ===================== PHYSICS 3(c) The electromagnetic spectrum ===================== */
M('P3.10-01', 'How do the speeds of different electromagnetic waves compare in free space (a vacuum)?',
  ['They all travel at the same speed', 'Gamma rays are the fastest', 'Radio waves are the fastest', 'It depends on their amplitude'],
  'All electromagnetic waves travel at the same speed in free space: 3 × 10⁸ m/s.');
T('P3.10-02', 'Light is part of a continuous spectrum of electromagnetic waves.', true,
  'True. Visible light is just the part of the electromagnetic spectrum our eyes can detect.');
T('P3.10-03', 'Electromagnetic waves need a medium (such as air) to travel through.', false,
  'False. Electromagnetic waves can travel through free space (a vacuum), which is how light reaches us from the Sun.');
M('P3.11-01', 'Which list is in order of <b>decreasing wavelength</b>?',
  ['radio, microwave, infrared, visible, ultraviolet, x-ray, gamma', 'gamma, x-ray, ultraviolet, visible, infrared, microwave, radio', 'radio, infrared, microwave, visible, ultraviolet, gamma, x-ray', 'microwave, radio, infrared, visible, x-ray, ultraviolet, gamma'],
  'Longest wavelength (radio) to shortest (gamma). Frequency increases in the same direction.');
M('P3.11-02', 'Which electromagnetic wave has the <b>highest frequency</b>?',
  ['Gamma rays', 'Radio waves', 'X-rays', 'Ultraviolet'],
  'Gamma rays have the highest frequency and shortest wavelength.');
M('P3.11-03', 'Which electromagnetic wave has the <b>longest wavelength</b>?',
  ['Radio waves', 'Microwaves', 'Gamma rays', 'Infrared'],
  'Radio waves have the longest wavelength and lowest frequency.');
M('P3.11-04', 'Which part of the electromagnetic spectrum lies between <b>infrared</b> and <b>ultraviolet</b>?',
  ['Visible light', 'Microwaves', 'X-rays', 'Radio waves'],
  'Order: radio, microwave, infrared, <b>visible</b>, ultraviolet, x-ray, gamma.');
M('P3.11-05', 'Which colour of visible light has the <b>longest wavelength</b>?',
  ['Red', 'Violet', 'Green', 'Blue'],
  'Red (next to infrared) has the longest wavelength; violet (next to ultraviolet) has the shortest.');
M('P3.11-06', 'Which list of colours is in order of <b>decreasing wavelength</b>?',
  ['red, orange, yellow, green, blue, indigo, violet', 'violet, indigo, blue, green, yellow, orange, red', 'red, yellow, orange, green, blue, violet, indigo', 'blue, green, red, orange, yellow, indigo, violet'],
  'ROYGBIV: red has the longest wavelength, violet the shortest.');
T('P3.11-07', 'X-rays have a longer wavelength than ultraviolet.', false,
  'False. X-rays come after ultraviolet, so they have a <b>shorter</b> wavelength and higher frequency.');
M('P3.12-01', 'Which electromagnetic radiation is used to <b>sterilise</b> food and medical equipment?',
  ['Gamma rays', 'Infrared', 'Microwaves', 'Radio waves'],
  'Gamma rays kill bacteria, so they sterilise food and medical equipment.');
M('P3.12-02', 'Night vision equipment detects…',
  ['infrared', 'ultraviolet', 'x-rays', 'microwaves'],
  'Warm objects emit infrared, which night vision equipment detects. Infrared is also used in heaters.');
M('P3.12-03', 'Which electromagnetic radiation is used for <b>satellite transmissions</b> and cooking?',
  ['Microwaves', 'Radio waves', 'Gamma rays', 'Visible light'],
  'Microwaves: cooking and satellite transmissions.');
M('P3.12-04', 'Optical fibres usually carry…',
  ['visible light', 'gamma rays', 'radio waves', 'microwaves'],
  'Visible light: optical fibres and photography.');
M('P3.12-05', 'Which electromagnetic radiation is used in <b>fluorescent lamps</b>?',
  ['Ultraviolet', 'Infrared', 'X-rays', 'Radio waves'],
  'The ultraviolet is absorbed by the coating on the tube, which then glows with visible light.');
M('P3.12-06', 'Which radiation is used to see the internal structure of objects, such as broken bones?',
  ['X-rays', 'Ultraviolet', 'Infrared', 'Microwaves'],
  'X-rays pass through soft tissue but are absorbed by bone and dense materials.');
M('P3.12-07', 'Which electromagnetic radiation is used for <b>broadcasting</b> TV and radio?',
  ['Radio waves', 'Gamma rays', 'Ultraviolet', 'X-rays'],
  'Radio waves: broadcasting and communications.');
M('P3.13-01', 'Too much <b>ultraviolet</b> can cause…',
  ['damage to surface cells and blindness', 'internal heating of body tissue', 'skin burns from heat', 'no harm at all'],
  'UV damages surface cells (skin) and the eyes. Protect yourself with sunscreen and sunglasses.');
M('P3.13-02', 'Excessive exposure to <b>microwaves</b> can cause…',
  ['internal heating of body tissue', 'damage to surface skin cells', 'blindness and sunburn', 'mutations and cancer in DNA'],
  'Microwaves are absorbed by water in body tissue and heat it from the inside. The metal case of a microwave oven protects you.');
M('P3.13-03', 'Which electromagnetic radiation can cause <b>skin burns</b>?',
  ['Infrared', 'Radio waves', 'Microwaves', 'Visible light'],
  'Infrared is heat radiation; too much burns the skin.');
M('P3.13-04', 'Which electromagnetic radiation can cause <b>cancer and mutation</b>?',
  ['Gamma rays', 'Infrared', 'Radio waves', 'Visible light'],
  'Gamma rays are ionising. Protection: lead or thick concrete shielding and limiting exposure time.');
M('P3.13-05', 'Which is a simple way to protect yourself from <b>ultraviolet</b>?',
  ['Wear sunscreen and sunglasses', 'Stand behind a sheet of paper', 'Turn off your mobile phone', 'Stay near a radiator'],
  'Sunscreen and sunglasses absorb UV before it reaches skin cells and eyes.');

/* ===================== PHYSICS 7(b) Radioactivity ===================== */
M('P7.2-01', 'How many protons and neutrons are in a nucleus of <span class="nuc"><sup>14</sup><sub>6</sub>C</span>?',
  ['6 protons, 8 neutrons', '6 protons, 14 neutrons', '14 protons, 6 neutrons', '8 protons, 6 neutrons'],
  'The bottom number (6) is the proton number. Neutrons = 14 − 6 = <b>8</b>.');
T('P7.2-02', 'The nucleus of an atom contains protons and electrons.', false,
  'False. The nucleus contains <b>protons and neutrons</b>. Electrons are outside the nucleus.');
M('P7.3-01', 'What is the <b>mass (nucleon) number</b> of an atom?',
  ['The number of protons plus neutrons', 'The number of protons only', 'The number of neutrons only', 'The number of protons plus electrons'],
  'Protons and neutrons are both nucleons, so the nucleon number is their total.');
M('P7.3-02', 'Isotopes of an element have…',
  ['the same number of protons but a different number of neutrons', 'the same number of neutrons but a different number of protons', 'a different number of protons and electrons', 'the same mass number but different atomic numbers'],
  'Same proton (atomic) number = same element. Different neutrons = different mass number.');
T('P7.4-01', 'You can predict exactly when a particular unstable nucleus will decay.', false,
  'False. Radioactive decay is a <b>random</b> process.');
M('P7.4-02', 'Alpha, beta and gamma radiation are emitted from…',
  ['unstable nuclei', 'the electron shells of atoms', 'stable nuclei', 'any atom that is heated'],
  'They are ionising radiations emitted from unstable nuclei, in a random process.');
M('P7.5-01', 'What is an <b>alpha particle</b>?',
  ['2 protons and 2 neutrons (a helium nucleus)', 'A fast-moving electron from the nucleus', 'A high-frequency electromagnetic wave', 'A single neutron knocked out of the nucleus'],
  'α = ⁴₂He: 2 protons + 2 neutrons.');
M('P7.5-02', 'What is a <b>beta (β⁻) particle</b>?',
  ['A high-speed electron emitted from the nucleus', 'A helium nucleus of 2 protons and 2 neutrons', 'An electromagnetic wave with no mass or charge', 'A proton that escapes from an unstable nucleus'],
  'A neutron in the nucleus turns into a proton and a fast electron, which is emitted.');
M('P7.5-03', 'Which radiation is an <b>electromagnetic wave</b>?',
  ['Gamma', 'Alpha', 'Beta', 'Neutron'],
  'Gamma rays are high-frequency electromagnetic waves with no mass and no charge.');
M('P7.5-04', 'Which radiation is the most <b>penetrating</b>?',
  ['Gamma', 'Alpha', 'Beta', 'They are all the same'],
  'Gamma is only reduced by thick lead or concrete. Alpha is stopped by paper; beta by a few mm of aluminium.');
M('P7.5-05', 'Which radiation is the most strongly <b>ionising</b>?',
  ['Alpha', 'Beta', 'Gamma', 'They are all the same'],
  'Alpha is the most ionising (and least penetrating). Gamma is the least ionising.');
M('P7.5-06', 'Which radiation is stopped by a sheet of paper?',
  ['Alpha', 'Beta', 'Gamma', 'None of them'],
  'Alpha: paper (or a few cm of air). Beta: a few mm of aluminium. Gamma: thick lead or concrete.');
M('P7.6-01', 'A source gives a high count rate. Placing a sheet of paper in front of it makes the count drop to background level. The source emits…',
  ['alpha only', 'beta only', 'gamma only', 'beta and gamma'],
  'Only alpha is stopped by paper. If anything else were emitted, the count would stay above background.');
M('P7.7-01', 'What happens to a nucleus when it emits an <b>alpha</b> particle?',
  ['Atomic number falls by 2, mass number falls by 4', 'Atomic number rises by 1, mass number unchanged', 'Both numbers unchanged', 'Mass number falls by 1, atomic number unchanged'],
  'It loses 2 protons and 2 neutrons.');
M('P7.7-02', 'What happens to a nucleus when it emits a <b>beta</b> particle?',
  ['Atomic number rises by 1, mass number unchanged', 'Atomic number falls by 1, mass number unchanged', 'Atomic number falls by 2, mass number falls by 4', 'Both numbers unchanged'],
  'A neutron turns into a proton, so there is one more proton but the same total of nucleons.');
T('P7.7-03', 'Emitting a gamma ray does not change the atomic number or mass number of a nucleus.', true,
  'True. Gamma is energy only: no mass and no charge.');
M('P7.7-04', 'What happens to a nucleus when it emits a <b>neutron</b>?',
  ['Mass number falls by 1, atomic number unchanged', 'Atomic number falls by 1, mass number unchanged', 'Both fall by 1', 'Mass number rises by 1'],
  'It loses one nucleon but no protons, so it is a different isotope of the same element.');
M('P7.8-01', 'Complete the equation: <span class="nuc"><sup>238</sup><sub>92</sub>U</span> → <span class="nuc"><sup>234</sup><sub>90</sub>Th</span> + <b>?</b>',
  ['<span class="nuc"><sup>4</sup><sub>2</sub>He</span> (alpha)', '<span class="nuc"><sup>0</sup><sub>−1</sub>e</span> (beta)', 'γ (gamma)', '<span class="nuc"><sup>1</sup><sub>0</sub>n</span> (neutron)'],
  'Mass: 238 = 234 + 4. Charge: 92 = 90 + 2. So the missing particle is ⁴₂He, an alpha particle.');
M('P7.8-02', 'Complete the equation: <span class="nuc"><sup>14</sup><sub>6</sub>C</span> → <span class="nuc"><sup>14</sup><sub>7</sub>N</span> + <b>?</b>',
  ['<span class="nuc"><sup>0</sup><sub>−1</sub>e</span> (beta)', '<span class="nuc"><sup>4</sup><sub>2</sub>He</span> (alpha)', 'γ (gamma)', '<span class="nuc"><sup>1</sup><sub>0</sub>n</span> (neutron)'],
  'Mass: 14 = 14 + 0. Charge: 6 = 7 + (−1). So the missing particle is a beta particle.');
M('P7.9-01', 'Which of these can detect ionising radiation?',
  ['A Geiger-Müller detector', 'A voltmeter', 'A thermometer', 'A magnifying glass'],
  'Geiger-Müller detectors and photographic film both detect ionising radiation.');
M('P7.10-01', 'Which is a source of background radiation from <b>space</b>?',
  ['Cosmic rays', 'Radon gas', 'Rocks such as granite', 'Food and drink'],
  'Cosmic rays come from space. Radon gas and rocks are sources from the Earth.');
T('P7.10-02', 'Background radiation only comes from man-made sources.', false,
  'False. Most background radiation is natural: radon gas, rocks, food and cosmic rays from space.');
M('P7.11-01', 'What is the unit of <b>activity</b> of a radioactive source?',
  ['Becquerel (Bq)', 'Hertz (Hz)', 'Joule (J)', 'Sievert per hour'],
  'Activity is measured in becquerels: 1 Bq = 1 decay per second.');
T('P7.11-02', 'The activity of a radioactive source decreases over time.', true,
  'True. As unstable nuclei decay there are fewer left to decay, so the activity falls.');
M('P7.12-01', 'What is the <b>half-life</b> of a radioactive isotope?',
  ['The time taken for half the unstable nuclei in a sample to decay', 'Half the time it takes for all the nuclei to decay', 'The time taken for a source to stop being radioactive', 'Half the age of the source'],
  'Equivalently: the time for the activity (or count rate) to fall to half.');
T('P7.12-02', 'All radioactive isotopes have the same half-life.', false,
  'False. Half-lives vary from fractions of a second to billions of years.');
M('P7.13-01', 'A source has an activity of 800 Bq and a half-life of 2 hours. What is its activity after 6 hours?',
  ['100 Bq', '200 Bq', '400 Bq', '0 Bq'],
  '6 h = 3 half-lives: 800 → 400 → 200 → <b>100 Bq</b>.');
M('P7.13-02', 'The activity of a source falls from 160 Bq to 20 Bq in 24 days. What is its half-life?',
  ['8 days', '12 days', '6 days', '3 days'],
  '160 → 80 → 40 → 20 is 3 half-lives. 24 ÷ 3 = <b>8 days</b>.');
M('P7.14-01', 'A factory checks the thickness of paper by passing radiation through it. Which radiation should it use?',
  ['Beta', 'Alpha', 'Gamma', 'Any of them'],
  'Alpha would be completely stopped and gamma would pass straight through. Beta is partly absorbed, so the count changes with thickness.');
M('P7.14-02', 'Which is a medical use of radioactivity?',
  ['Using gamma rays to kill cancer cells (radiotherapy)', 'Using alpha particles to take images of broken bones', 'Using beta particles to warm and cook hospital food', 'Using radon gas to clean and sterilise wounds'],
  'Others include tracers to see inside the body and gamma sterilisation of medical equipment.');
M('P7.15-01', 'What is meant by <b>contamination</b>?',
  ['Radioactive material gets onto or into an object or person', 'An object is exposed to radiation from a source outside it', 'An object becomes radioactive after being irradiated', 'Radiation is blocked by a shield'],
  'Contamination: the radioactive atoms are on or inside you, so you keep being exposed. Irradiation: exposure to radiation from outside.');
T('P7.15-02', 'An object that has been irradiated becomes radioactive.', false,
  'False. Irradiation does not make an object radioactive. That is why gamma-sterilised food is safe to eat.');
M('P7.16-01', 'Why is ionising radiation dangerous to living organisms?',
  ['It can damage cells and tissue and cause mutations', 'It makes the whole body permanently radioactive', 'It only harms metals and electronic equipment', 'It makes cells grow faster and become stronger'],
  'Ionising radiation can damage or kill cells and cause mutations in DNA, which may lead to cancer.');
M('P7.16-02', 'Why is the disposal of radioactive waste a problem?',
  ['Some of it stays radioactive for thousands of years', 'It is far too heavy to move to a safe storage site', 'It quickly turns into gamma rays once it is buried', 'It stops being dangerous as soon as it is put underground'],
  'Long half-life waste must be stored securely, often deep underground, so it cannot leak into the environment.');

/* ===================== CHEMISTRY 1(d) The Periodic Table ===================== */
M('C1.18-01', 'Elements in the Periodic Table are arranged in order of…',
  ['atomic number', 'relative atomic mass', 'date of discovery', 'number of neutrons'],
  'The modern Periodic Table is in order of atomic (proton) number.');
M('C1.18-02', 'In the Periodic Table, a horizontal row is called a…',
  ['period', 'group', 'shell', 'family'],
  'Rows are periods; columns are groups.');
T('C1.18-03', 'The vertical columns in the Periodic Table are called groups.', true,
  'True. Elements in the same group have the same number of outer electrons.');
M('C1.19-01', 'Magnesium is in Group 2, Period 3. What is its electronic configuration?',
  ['2.8.2', '2.2', '2.8.3', '3.2'],
  'Period 3 → 3 shells. Group 2 → 2 outer electrons. So <b>2.8.2</b>.');
M('C1.19-02', 'Potassium is in Group 1, Period 4. What is its electronic configuration?',
  ['2.8.8.1', '2.8.1', '2.8.9', '2.8.18.1'],
  'Period 4 → 4 shells. Group 1 → 1 outer electron. So <b>2.8.8.1</b> (19 electrons).');
M('C1.19-03', 'Nitrogen is in Group 5, Period 2. What is its electronic configuration?',
  ['2.5', '2.8.5', '5.2', '2.3'],
  'Period 2 → 2 shells. Group 5 → 5 outer electrons. So <b>2.5</b>.');
M('C1.20-01', 'An element does not conduct electricity and its oxide dissolves in water to give a solution of pH 2. The element is…',
  ['a non-metal', 'a metal', 'a noble gas', 'impossible to classify'],
  'Non-metals are poor conductors and form <b>acidic</b> oxides. Metals conduct and form basic oxides.');
T('C1.20-02', 'Metal oxides are basic.', true,
  'True. Metal oxides are bases; those that dissolve in water form alkaline solutions. Non-metal oxides are acidic.');
M('C1.21-01', 'Which of these elements is a <b>non-metal</b>?',
  ['Sulfur', 'Sodium', 'Magnesium', 'Aluminium'],
  'Non-metals are on the right of the Periodic Table. Sulfur is in Group 6.');
M('C1.21-02', 'Where are the metals found in the Periodic Table?',
  ['On the left and in the centre', 'On the right, next to Group 0', 'Only along the top row (Period 1)', 'Only in Groups 6 and 7'],
  'Metals are on the left and in the middle; non-metals are on the right.');
M('C1.22-01', 'An element has the electronic configuration 2.8.6. Where is it in the Periodic Table?',
  ['Group 6, Period 3', 'Group 3, Period 6', 'Group 8, Period 2', 'Group 6, Period 2'],
  'Outer electrons = group number (6). Number of occupied shells = period (3). It is sulfur.');
T('C1.22-02', 'Atoms of every Group 0 element have 8 outer electrons.', false,
  'False. Helium has only 2 electrons, but its shell is full.');
M('C1.23-01', 'Why do elements in the same group have similar chemical properties?',
  ['They have the same number of outer electrons', 'They have the same number of shells', 'They have the same atomic number', 'They have the same number of neutrons'],
  'Chemical reactions involve outer electrons, so the same number of outer electrons gives similar reactions.');
M('C1.24-01', 'Why do the noble gases not readily react?',
  ['They have a full outer shell of electrons', 'They have no electrons in their outer shell', 'They are gases, so their atoms are far apart', 'They have no neutrons in their nucleus'],
  'A full outer shell is stable, so they do not need to lose, gain or share electrons.');

/* ===================== CHEMISTRY 1(f) Ionic bonding ===================== */
M('C1.37-01', 'How does a sodium atom (2.8.1) form a sodium ion?',
  ['It loses 1 electron to form Na⁺', 'It gains 1 electron to form Na⁻', 'It gains 7 electrons to form Na⁷⁻', 'It loses 1 proton to form Na⁺'],
  'Losing one electron leaves a full outer shell (2.8) and one more proton than electrons.');
M('C1.37-02', 'How does a chlorine atom (2.8.7) form a chloride ion?',
  ['It gains 1 electron to form Cl⁻', 'It loses 1 electron to form Cl⁺', 'It loses 7 electrons to form Cl⁷⁺', 'It gains 1 proton to form Cl⁺'],
  'Gaining one electron gives a full outer shell (2.8.8) and a 1− charge.');
T('C1.37-03', 'Metal atoms gain electrons to form negative ions.', false,
  'False. Metal atoms <b>lose</b> electrons to form <b>positive</b> ions. Non-metals gain electrons to form negative ions.');
T('C1.37-04', 'When an atom becomes an ion, its number of protons stays the same.', true,
  'True. Only electrons are lost or gained. The proton number stays the same, so it is still the same element.');
M('C1.38-01', 'What is the charge on an ion of a <b>Group 3</b> metal, such as aluminium?',
  ['3+', '3−', '5−', '1+'],
  'Group 3 metals lose 3 electrons: Al³⁺.');
M('C1.38-02', 'What is the charge on an ion formed by a <b>Group 5</b> non-metal, such as nitrogen?',
  ['3−', '5+', '5−', '3+'],
  'Nitrogen (2.5) gains 3 electrons to fill its outer shell: N³⁻.');
M('C1.38-03', 'What is the formula of the <b>sulfate</b> ion?',
  ['SO₄²⁻', 'SO₃²⁻', 'S²⁻', 'SO₄⁻'],
  'Sulfate is SO₄²⁻. (S²⁻ is sulfide.)');
M('C1.38-04', 'What is the formula of the <b>ammonium</b> ion?',
  ['NH₄⁺', 'NH₃', 'NH₄⁻', 'NO₃⁻'],
  'Ammonium is NH₄⁺, one of the few positive ions that is not a metal. NO₃⁻ is nitrate.');
M('C1.38-05', 'Which ion is <b>iron(III)</b>?',
  ['Fe³⁺', 'Fe²⁺', 'Fe³⁻', 'Fe⁺'],
  'The Roman numeral gives the charge: iron(III) is Fe³⁺, iron(II) is Fe²⁺.');
M('C1.38-06', 'Which pair of ions both have a charge of 1−?',
  ['Hydroxide and nitrate', 'Sulfate and carbonate', 'Hydroxide and carbonate', 'Nitrate and sulfate'],
  'OH⁻ and NO₃⁻ are 1−. SO₄²⁻ and CO₃²⁻ are 2−.');
T('C1.38-07', 'The silver ion is Ag²⁺.', false,
  'False. The silver ion is <b>Ag⁺</b>. (Cu²⁺, Fe²⁺, Pb²⁺ and Zn²⁺ are the 2+ ones.)');
M('C1.39-01', 'What is the formula of magnesium chloride?',
  ['MgCl₂', 'MgCl', 'Mg₂Cl', 'Mg₂Cl₃'],
  'Mg²⁺ needs two Cl⁻ ions to balance the charge: <b>MgCl₂</b>.');
M('C1.39-02', 'What is the formula of aluminium oxide?',
  ['Al₂O₃', 'AlO', 'Al₃O₂', 'AlO₃'],
  'Al³⁺ and O²⁻: 2 × (+3) = +6 and 3 × (−2) = −6. So <b>Al₂O₃</b>.');
M('C1.39-03', 'What is the formula of calcium hydroxide?',
  ['Ca(OH)₂', 'CaOH', 'CaOH₂', 'Ca₂OH'],
  'Ca²⁺ needs two OH⁻ ions. Brackets show there are two whole hydroxide ions: <b>Ca(OH)₂</b>.');
M('C1.39-04', 'What is the formula of ammonium sulfate?',
  ['(NH₄)₂SO₄', 'NH₄SO₄', 'NH₄(SO₄)₂', '(NH₄)₃SO₄'],
  'Two NH₄⁺ ions balance one SO₄²⁻ ion: <b>(NH₄)₂SO₄</b>.');
M('C1.39-05', 'What is the formula of sodium oxide?',
  ['Na₂O', 'NaO', 'NaO₂', 'Na₂O₂'],
  'Two Na⁺ ions balance one O²⁻ ion: <b>Na₂O</b>.');
M('C1.40-01', 'When magnesium (2.8.2) reacts with oxygen (2.6), how many electrons are transferred from each magnesium atom?',
  ['2', '1', '6', '8'],
  'Mg loses 2 electrons and O gains 2, forming Mg²⁺ and O²⁻.');
M('C1.40-02', 'When calcium reacts with chlorine to form CaCl₂, what happens to the electrons?',
  ['Calcium gives one electron to each of two chlorine atoms', 'Calcium gives two electrons to one chlorine atom', 'Each chlorine atom gives one electron to calcium', 'Calcium and chlorine share a pair of electrons'],
  'Each Cl atom needs only one electron, so two Cl atoms are needed to take calcium’s two outer electrons.');
T('C1.40-03', 'In a dot-and-cross diagram, ions are drawn in square brackets with their charge outside.', true,
  'True. For example [Na]⁺ and [Cl]⁻, showing only the outer shells.');
M('C1.41-01', 'What is an <b>ionic bond</b>?',
  ['The electrostatic attraction between oppositely charged ions', 'A shared pair of electrons', 'The attraction between a nucleus and its own electrons', 'A force between neighbouring molecules'],
  'Positive and negative ions attract each other strongly in all directions.');
M('C1.42-01', 'Why does sodium chloride have a high melting point?',
  ['Lots of energy is needed to overcome the strong attractions between ions', 'Lots of energy is needed to break the covalent bonds inside its molecules', 'Its molecules are held together by strong intermolecular forces', 'Its delocalised electrons hold the lattice tightly together'],
  'A giant ionic lattice has many strong attractions between oppositely charged ions in all directions.');
M('C1.42-02', 'Magnesium oxide (Mg²⁺ O²⁻) has a much higher melting point than sodium chloride (Na⁺ Cl⁻). Why?',
  ['Its ions have higher charges, so the attractions are stronger', 'It contains strong covalent bonds as well as ionic bonds', 'Its ions are larger, so they are held further apart', 'Its ions are free to move, which makes it more stable'],
  'Bigger charges give stronger electrostatic attractions, which need more energy to overcome.');
T('C1.43-01', 'Solid sodium chloride conducts electricity because it contains ions.', false,
  'False. In the solid, the ions are held in fixed positions and cannot move.');
M('C1.43-02', 'Why does molten sodium chloride conduct electricity?',
  ['Its ions are free to move', 'Its electrons are free to move', 'Its molecules are free to move', 'It contains metal atoms'],
  'Ionic compounds conduct when molten or in aqueous solution because the <b>ions</b> can move. It is not electrons.');
M('C1.43-03', 'In which state does an ionic compound <b>not</b> conduct electricity?',
  ['Solid', 'Molten', 'Dissolved in water', 'It conducts in all states'],
  'Solid: ions fixed. Molten or aqueous: ions free to move, so it conducts.');

/* ===================== CHEMISTRY 1(g) Covalent bonding ===================== */
M('C1.44-01', 'What is a <b>covalent bond</b>?',
  ['A shared pair of electrons between two atoms', 'The transfer of electrons from a metal to a non-metal', 'The attraction between oppositely charged ions', 'A sea of delocalised electrons'],
  'Covalent bonds usually form between non-metal atoms.');
M('C1.44-02', 'Covalent bonds usually form between…',
  ['non-metal atoms', 'metal atoms', 'a metal and a non-metal', 'noble gas atoms'],
  'Metal + non-metal usually gives ionic bonding. Non-metal + non-metal gives covalent bonding.');
M('C1.45-01', 'What holds the two atoms together in a covalent bond?',
  ['The attraction between the shared pair of electrons and both nuclei', 'The attraction between a positive ion and a negative ion', 'The attraction between the two positively charged nuclei', 'Magnetic forces between the electrons in each atom'],
  'Both positive nuclei are attracted to the negative shared pair between them.');
M('C1.46-01', 'How many electrons are shared between the two atoms in a nitrogen molecule (N₂)?',
  ['6', '2', '3', '4'],
  'N₂ has a triple bond: 3 shared pairs = <b>6</b> electrons.');
M('C1.46-02', 'How many lone (non-bonding) pairs of electrons are on the oxygen atom in water (H₂O)?',
  ['2', '1', '0', '4'],
  'Oxygen has 6 outer electrons: 2 are used in the two O–H bonds and 4 form 2 lone pairs.');
M('C1.46-03', 'Which molecule contains a <b>double</b> bond?',
  ['Ethene, C₂H₄', 'Ethane, C₂H₆', 'Methane, CH₄', 'Hydrogen chloride, HCl'],
  'Ethene has a C=C double bond. Carbon dioxide (O=C=O) and oxygen (O=O) also have double bonds.');
M('C1.46-04', 'How many covalent bonds are in a molecule of ammonia (NH₃)?',
  ['3', '1', '4', '5'],
  'Three N–H single bonds, plus one lone pair on the nitrogen.');
M('C1.46-05', 'How many covalent bonds are in a molecule of ethane (C₂H₆)?',
  ['7', '6', '8', '2'],
  'Six C–H bonds plus one C–C bond = <b>7</b>.');
T('C1.46-06', 'A carbon dioxide molecule contains two double bonds.', true,
  'True. O=C=O: carbon shares two pairs of electrons with each oxygen.');
M('C1.47-01', 'Why do substances with simple molecular structures have low melting and boiling points?',
  ['The intermolecular forces are weak and need little energy to overcome', 'The covalent bonds inside the molecules are weak and break easily', 'The ions in the structure are only loosely held in place', 'The molecules are very large, so they slide past each other'],
  'Melting and boiling only overcome the forces <b>between</b> molecules, not the strong covalent bonds inside them.');
T('C1.47-02', 'When water boils, the covalent bonds inside the water molecules break.', false,
  'False. Only the weak intermolecular forces are overcome. The H₂O molecules stay whole.');
M('C1.48-01', 'Which halogen has the highest boiling point?',
  ['Iodine, I₂ (Mr 254)', 'Bromine, Br₂ (Mr 160)', 'Chlorine, Cl₂ (Mr 71)', 'Fluorine, F₂ (Mr 38)'],
  'Larger molecules (higher Mr) have stronger intermolecular forces, so more energy is needed to separate them.');
M('C1.48-02', 'Why does boiling point generally increase with relative molecular mass for simple molecular substances?',
  ['Intermolecular forces get stronger as molecules get bigger', 'Covalent bonds get stronger as molecules get bigger', 'Bigger molecules contain ions', 'Bigger molecules have fewer electrons'],
  'More electrons and bigger molecules → stronger forces between molecules.');
M('C1.49-01', 'Why do substances with giant covalent structures have very high melting points?',
  ['Many strong covalent bonds must be broken', 'They have strong intermolecular forces', 'They contain ions in a lattice', 'They have delocalised electrons'],
  'In a giant covalent structure every atom is joined by covalent bonds, and melting means breaking lots of them.');
M('C1.50-01', 'Why is <b>diamond</b> very hard?',
  ['Each carbon atom is covalently bonded to four others in a rigid structure', 'It has layers of carbon atoms held together by weak forces', 'It is made of small, tightly packed C₆₀ molecules', 'It has delocalised electrons holding the atoms in place'],
  'Four strong covalent bonds per atom in a 3D network make diamond extremely hard.');
M('C1.50-02', 'Why does <b>graphite</b> conduct electricity?',
  ['Each carbon is bonded to only three others, leaving delocalised electrons', 'It contains carbon ions that are free to move between the layers', 'Its layers can slide over each other, carrying charge with them', 'It has weak intermolecular forces that let electricity through'],
  'The delocalised electrons move between and along the layers.');
M('C1.50-03', 'Why is graphite soft and slippery?',
  ['Its layers are held together by weak forces, so they slide over each other', 'Its covalent bonds are weak, so the atoms slide apart easily', 'It is made of small molecules that roll over each other', 'It contains ions that repel each other when it is rubbed'],
  'Bonds within each layer are strong, but the forces between layers are weak.');
M('C1.50-04', 'Which form of carbon is made of simple molecules?',
  ['C₆₀ fullerene', 'Diamond', 'Graphite', 'All of them'],
  'C₆₀ is a simple molecule, so it has a much lower melting point than diamond or graphite, which are giant structures.');
T('C1.51-01', 'Covalent compounds usually do not conduct electricity.', true,
  'True. They have no ions or free electrons to carry charge. (Graphite is the exception you need to know, but it is an element.)');

/* ===================== Extra + harder (★) questions on existing points (added 6 Nov 2026) ===================== */
MH('P3.3-07', 'The distance from the 1st crest to the 5th crest of a wave is 8 m. What is the wavelength?',
  ['2 m', '1.6 m', '8 m', '40 m'],
  'From the 1st to the 5th crest is <b>4</b> wavelengths, not 5. 8 ÷ 4 = <b>2 m</b>.');
MH('P3.4-03', 'A loud sound makes a window rattle, but the air near the speaker does not travel to the window. What does this show?',
  ['Sound waves transfer energy without transferring the air', 'Sound waves carry air particles from the speaker to the window', 'Sound is a transverse wave', 'The window makes its own sound'],
  'The air particles only vibrate back and forth about fixed positions. The energy is passed on to the window.');
MH('P3.6-03', 'A wave has a time period of 2 ms (0.002 s). What is its frequency?',
  ['500 Hz', '0.5 Hz', '2 Hz', '2000 Hz'],
  'f = 1 ÷ T = 1 ÷ 0.002 = <b>500 Hz</b>. Convert ms to s first.');
MH('P3.7-03', 'Red light has a wavelength of 6 × 10⁻⁷ m and travels at 3 × 10⁸ m/s. What is its frequency?',
  ['5 × 10¹⁴ Hz', '2 × 10⁻¹⁵ Hz', '1.8 × 10² Hz', '5 × 10⁻¹⁴ Hz'],
  'f = v ÷ λ = 3 × 10⁸ ÷ 6 × 10⁻⁷ = <b>5 × 10¹⁴ Hz</b>.');
MH('P3.8-04', 'Light from a distant galaxy arrives with a longer wavelength than expected. What does this tell us?',
  ['The galaxy is moving away from us', 'The galaxy is moving towards us', 'The galaxy is not moving', 'The light has slowed down in space'],
  'Doppler effect: a source moving away gives a longer observed wavelength (shifted towards red).');
T('P3.9-03', 'Sound waves can be reflected.', true,
  'True. An echo is a reflected sound wave.');
MH('P3.9-04', 'Light slows down as it passes from air into glass. Its frequency stays the same. What happens to its wavelength?',
  ['It gets shorter', 'It gets longer', 'It stays the same', 'It becomes zero'],
  'v = f × λ. If v falls and f is unchanged, λ must fall too.');
MH('P3.11-08', 'Which electromagnetic wave could have a wavelength of about 10⁻¹² m?',
  ['Gamma rays', 'Radio waves', 'Infrared', 'Microwaves'],
  'That is far shorter than an atom. Only gamma rays (and the shortest x-rays) have wavelengths that small.');
MH('P3.12-08', 'Why are gamma rays, not ultraviolet, used to sterilise food that is already sealed in packets?',
  ['Gamma rays pass through the packaging and kill the bacteria inside', 'Ultraviolet would heat and partly cook the food inside the packet', 'Gamma rays make the food radioactive, so the bacteria then die', 'Ultraviolet cannot kill bacteria, even on an open surface'],
  'Gamma is very penetrating. UV is absorbed at the surface. (Irradiated food does not become radioactive.)');
MH('P3.13-06', 'Why do radiographers stand behind a lead screen when taking X-ray images?',
  ['They are exposed many times a day, so must reduce their total dose', 'X-rays only harm adults, not the children who are being scanned', 'The lead screen makes the X-ray image sharper and clearer', 'X-rays cannot travel through air, so the screen stops reflections'],
  'One X-ray is a small dose, but repeated exposure every day would add up. Lead absorbs X-rays.');
MH('P7.2-03', 'How many more neutrons does a uranium-238 nucleus have than a uranium-235 nucleus?',
  ['3', '0', '235', '92'],
  'Both have 92 protons (same element). 238 − 235 = <b>3</b> more neutrons.');
M('P7.3-03', 'What does the atomic (proton) number tell you?',
  ['The number of protons in the nucleus', 'The number of neutrons in the nucleus', 'The number of protons plus neutrons', 'The mass of the atom'],
  'The atomic number decides which element it is.');
MH('P7.4-03', 'A Geiger counter next to a source records 52, 47, 55 and 49 counts in four 10-second intervals. Why are the readings different?',
  ['Radioactive decay is random', 'The source is running out', 'The detector is broken', 'The source decays faster when it is warm'],
  'Decay is random, so the count in each interval varies around an average.');
MH('P7.6-02', 'Paper in front of a source makes no difference. 3 mm of aluminium reduces the count a lot, but it stays above background. Thick lead brings it down to background. The source emits…',
  ['beta and gamma', 'alpha and beta', 'alpha only', 'gamma only'],
  'No change with paper → no alpha. Big drop with aluminium → beta. Still above background until lead → gamma too.');
T('P7.6-03', 'In the penetration practical, you should measure the background count first and subtract it from your readings.', true,
  'True. Background radiation is always there, so it must be taken away to find the count from the source.');
T('P7.9-02', 'Photographic film darkens when it is exposed to ionising radiation.', true,
  'True. That is how film badges measure how much radiation a worker has received.');
M('P7.9-03', 'Why do some workers wear film badges?',
  ['To monitor how much ionising radiation they have received', 'To block the radiation before it reaches their body', 'To turn the radiation into harmless visible light', 'To show their name and job in the radiation area'],
  'The film darkens more the more radiation it receives. It detects; it does not protect.');
M('P7.10-03', 'In many places, which natural source gives the largest share of background radiation?',
  ['Radon gas from rocks and the ground', 'Cosmic rays from the Sun and space', 'Nuclear power stations and their waste', 'Mobile phones and wi-fi routers'],
  'Radon is a radioactive gas that seeps out of rocks such as granite. Mobile phones do not emit ionising radiation.');
MH('P7.11-03', 'A source has an activity of 300 Bq. How many nuclei decay in one minute?',
  ['18 000', '300', '5', '3000'],
  '300 Bq = 300 decays per second. 300 × 60 = <b>18 000</b>.');
T('P7.12-03', 'After two half-lives, a quarter of the original unstable nuclei remain.', true,
  'True. ½ × ½ = ¼.');
MH('P7.13-03', 'A graph shows the count rate of a source falling from 600 counts/min to 150 counts/min in 10 minutes. What is the half-life?',
  ['5 minutes', '10 minutes', '2.5 minutes', '7.5 minutes'],
  '600 → 300 → 150 is 2 half-lives. 10 ÷ 2 = <b>5 minutes</b>.');
M('P7.14-03', 'Which radiation is used in smoke detectors?',
  ['Alpha', 'Beta', 'Gamma', 'Neutron'],
  'Alpha ionises the air so a small current flows. Smoke absorbs the alpha particles, the current drops and the alarm sounds.');
MH('P7.14-04', 'Why is a gamma emitter with a short half-life chosen as a medical tracer?',
  ['Gamma escapes the body to be detected; a short half-life limits the dose', 'Gamma is the most ionising, so it shows up most clearly on the image', 'A short half-life means it never decays while inside the body', 'Gamma makes the organ glow, so doctors can see it with their eyes'],
  'It must be detectable outside the body (penetrating) and not stay active in the body for long.');
M('P7.15-03', 'Why is contamination usually more dangerous than irradiation?',
  ['The radioactive material stays on or in you, so exposure continues', 'Contamination only happens with gamma, the most penetrating type', 'Irradiation makes you radioactive, but contamination does not', 'Contamination always comes from space, so it can’t be blocked'],
  'Once you are contaminated, you keep being exposed until the material is removed or decays.');
M('P7.16-03', 'Which is a sensible way to reduce the risk when using a radioactive source in the lab?',
  ['Hold it with tongs, point it away from people and keep exposure short', 'Hold it in your hand so you have a firm grip and do not drop it', 'Keep it in your pocket between experiments so it does not get lost', 'Stand close to it so you can read the Geiger counter accurately'],
  'Distance, short time and shielding all reduce the dose.');
MH('P7.5-07', 'Why are alpha particles the most ionising radiation?',
  ['They have a large charge and mass, so they collide with many atoms', 'They travel faster than any other radiation, so they hit harder', 'They have no charge, so nothing slows them down as they travel', 'They are electromagnetic waves with a very high frequency'],
  'Strong ionisation means they use up their energy fast, which is also why they are the least penetrating.');
MH('P7.7-05', 'A nucleus emits one alpha particle and then two beta particles. What is the overall change?',
  ['Atomic number unchanged, mass number falls by 4', 'Atomic number falls by 2, mass number falls by 4', 'Atomic number rises by 2, mass number unchanged', 'Both unchanged'],
  'Alpha: Z − 2, A − 4. Two betas: Z + 2. Overall Z is unchanged and A falls by 4.');
MH('P7.8-03', 'Radium-226 (<span class="nuc"><sup>226</sup><sub>88</sub>Ra</span>) emits an alpha particle. Which nucleus is formed?',
  ['<span class="nuc"><sup>222</sup><sub>86</sub>Rn</span>', '<span class="nuc"><sup>226</sup><sub>89</sub>Ac</span>', '<span class="nuc"><sup>224</sup><sub>86</sub>Rn</span>', '<span class="nuc"><sup>222</sup><sub>88</sub>Ra</span>'],
  'Mass number 226 − 4 = 222. Atomic number 88 − 2 = 86 (radon).');

MH('C1.18-04', 'Argon (Ar 39.9) is placed before potassium (Ar 39.1) even though argon atoms are heavier on average. Why?',
  ['The table is in order of atomic number, and argon has fewer protons', 'The table is in order of discovery, and argon was discovered first', 'Metals always go after non-metals, so potassium has to come later', 'Argon has more neutrons, so it is placed earlier in the table'],
  'Argon has 18 protons, potassium 19. Ordering by atomic number puts elements with similar properties in the same group.');
MH('C1.20-03', 'Element X conducts electricity, and its oxide reacts with acids to form a salt and water. X is…',
  ['a metal', 'a non-metal', 'a noble gas', 'impossible to tell'],
  'Conducting and having a basic oxide are both properties of metals.');
T('C1.21-03', 'Hydrogen is a metal because it is at the top of Group 1.', false,
  'False. Hydrogen is a non-metal. It is usually placed on its own at the top of the table.');
M('C1.22-03', 'How many occupied electron shells does an element in Period 4 have?',
  ['4', '1', '8', '2'],
  'The period number = the number of occupied shells.');
M('C1.23-02', 'Lithium, sodium and potassium all react with water to give hydrogen and an alkaline solution. Why do they react in a similar way?',
  ['They each have one outer electron', 'They have the same number of shells', 'They have the same mass', 'They are all liquids'],
  'Same number of outer electrons → similar chemical reactions.');
T('C1.23-03', 'Elements in the same period have similar chemical properties.', false,
  'False. Elements in the same <b>group</b> have similar properties. Across a period they change from metals to non-metals.');
T('C1.24-02', 'Noble gases readily gain electrons to form negative ions.', false,
  'False. Their outer shells are already full, so they do not need to gain, lose or share electrons.');
MH('C1.24-03', 'Argon has the configuration 2.8.8. Why is it used inside some light bulbs instead of air?',
  ['It is unreactive, so the hot filament does not react with it', 'It glows brightly as soon as electricity passes through it', 'It conducts electricity well, so the bulb uses less energy', 'It reacts with the filament to make a protective coating'],
  'A full outer shell makes argon unreactive. Oxygen in air would react with the hot filament.');
MH('C1.37-05', 'A particle has 16 protons and 18 electrons. What is it?',
  ['A sulfide ion, S²⁻', 'A sulfur atom', 'An argon atom', 'A sulfur ion, S²⁺'],
  '16 protons = sulfur. Two extra electrons give a 2− charge.');
MH('C1.38-08', 'Which ion has the same electronic configuration as a neon atom (2.8)?',
  ['Na⁺', 'K⁺', 'Cl⁻', 'Li⁺'],
  'Na (2.8.1) loses one electron → 2.8. K⁺ and Cl⁻ are 2.8.8; Li⁺ is 2.');
MH('C1.39-06', 'What is the formula of iron(III) sulfate?',
  ['Fe₂(SO₄)₃', 'FeSO₄', 'Fe₃(SO₄)₂', 'Fe(SO₄)₃'],
  'Fe³⁺ and SO₄²⁻: 2 × (+3) = +6 and 3 × (−2) = −6.');
MH('C1.39-07', 'What is the formula of lead(II) nitrate?',
  ['Pb(NO₃)₂', 'PbNO₃', 'Pb₂NO₃', 'PbNO₃₂'],
  'Pb²⁺ needs two NO₃⁻ ions. Brackets show two whole nitrate ions.');
MH('C1.40-04', 'Aluminium (2.8.3) reacts with fluorine (2.7) to form AlF₃. What happens to the electrons?',
  ['One aluminium atom gives one electron to each of three fluorine atoms', 'Three aluminium atoms each give one electron to one fluorine atom', 'Aluminium and fluorine share three pairs of electrons', 'Each fluorine atom gives three electrons to aluminium'],
  'Al loses 3 electrons (Al³⁺); each F gains 1 (F⁻). So three F atoms are needed.');
T('C1.41-02', 'In an ionic lattice, each ion is attracted to the oppositely charged ions around it in all directions.', true,
  'True. That is why the lattice is a giant, strong structure.');
MH('C1.41-03', 'Which pair of ions attract each other most strongly (assume the same distance apart)?',
  ['Mg²⁺ and O²⁻', 'Na⁺ and Cl⁻', 'K⁺ and Br⁻', 'Li⁺ and F⁻'],
  'Higher charges give stronger electrostatic attraction.');
T('C1.42-03', 'Ionic compounds have high melting points because a lot of energy is needed to break covalent bonds.', false,
  'False. It is the strong electrostatic attractions between <b>ions</b> that must be overcome. There are no covalent bonds to break.');
T('C1.44-03', 'A single covalent bond contains two electrons.', true,
  'True. One shared pair = one single bond.');
MH('C1.45-02', 'In a hydrogen molecule (H₂), what are the shared electrons attracted to?',
  ['Both nuclei', 'Only one nucleus', 'Each other', 'Nothing: they are free to move'],
  'The negative shared pair is attracted to both positive nuclei, which holds the atoms together.');
T('C1.45-03', 'Covalent bonds are weak.', false,
  'False. Covalent bonds are strong. It is the forces <b>between</b> simple molecules that are weak.');
MH('C1.46-07', 'In methane (CH₄), how many electrons are in the outer shell of each hydrogen atom?',
  ['2', '1', '4', '8'],
  'Each H shares one pair with carbon, so it has 2 electrons: a full first shell.');
MH('C1.47-03', 'Chlorine (Cl₂) is a gas at room temperature. Why?',
  ['The intermolecular forces between Cl₂ molecules are weak', 'The covalent bond between the two Cl atoms is weak', 'Chlorine is made of ions', 'Chlorine has a giant structure'],
  'Little energy is needed to separate the molecules, so its boiling point is below room temperature.');
MH('C1.48-03', 'Which of these alkanes has the highest boiling point?',
  ['Butane, C₄H₁₀ (Mr 58)', 'Propane, C₃H₈ (Mr 44)', 'Ethane, C₂H₆ (Mr 30)', 'Methane, CH₄ (Mr 16)'],
  'Highest Mr → strongest intermolecular forces → highest boiling point.');
M('C1.49-02', 'Which of these has a giant covalent structure?',
  ['Diamond', 'Water', 'Carbon dioxide', 'Sodium chloride'],
  'Water and carbon dioxide are simple molecules. Sodium chloride is ionic.');
MH('C1.49-03', 'Why does diamond have a much higher melting point than C₆₀ fullerene?',
  ['Melting diamond breaks covalent bonds; melting C₆₀ only overcomes weak forces', 'Diamond has far more carbon atoms in each molecule than C₆₀ has', 'C₆₀ contains ions, and ionic attractions are weaker than covalent bonds', 'Diamond has delocalised electrons that hold its atoms more tightly'],
  'Diamond is a giant covalent structure. C₆₀ is made of separate molecules.');
MH('C1.50-05', 'Graphite conducts electricity but diamond does not. Why?',
  ['In graphite each carbon bonds to 3 others, leaving free electrons; in diamond all 4 are used', 'Graphite contains carbon ions that are free to move, but diamond does not', 'Diamond is too hard and dense for any electrons to move through it', 'Graphite is a metal, while diamond is a non-metal form of carbon'],
  'Diamond has no free electrons because each carbon bonds to four others.');
M('C1.51-02', 'Why do simple covalent substances not conduct electricity?',
  ['They have no ions or free electrons to carry charge', 'Their molecules are too large to move through the substance', 'Their covalent bonds are too strong to let electrons pass', 'They are always gases, and gases cannot conduct'],
  'Charge can only flow if there are charged particles that can move.');
T('C1.51-03', 'A solution of sugar (a covalent compound) in pure water conducts electricity.', false,
  'False. Sugar dissolves as molecules, not ions, so there is nothing to carry the charge.');

/* ===================== BIOLOGY 2(a) Level of organisation, 2(b) Cell structure (added 6 Nov 2026) ===================== */
M('B2.1-01', 'Which list is in order from smallest to largest?',
  ['organelle, cell, tissue, organ, organ system', 'cell, organelle, tissue, organ, organ system', 'organelle, tissue, cell, organ, organ system', 'cell, tissue, organelle, organ system, organ'],
  'Organelles make up cells, cells make up tissues, tissues make up organs, organs make up organ systems.');
M('B2.1-02', 'What is a <b>tissue</b>?',
  ['A group of similar cells working together to do a job', 'A structure inside a cell with a particular job', 'Several organs working together to do a job', 'A single cell with a special shape for its job'],
  'Example: muscle tissue is made of muscle cells.');
M('B2.1-03', 'Which of these is an <b>organ</b>?',
  ['The heart', 'A red blood cell', 'A mitochondrion', 'Muscle tissue'],
  'An organ is made of several tissues working together. A mitochondrion is an organelle.');
T('B2.1-04', 'An organ system is a group of organs working together.', true,
  'True. For example the digestive system: stomach, small intestine, pancreas and more.');
MH('B2.1-05', 'A leaf contains several tissues (e.g. palisade and xylem) working together. What level of organisation is a leaf?',
  ['An organ', 'A tissue', 'An organelle', 'An organ system'],
  'Several different tissues working together = an organ.');
M('B2.2-01', 'Which structure is found in plant cells but <b>not</b> in animal cells?',
  ['Cell wall', 'Nucleus', 'Cell membrane', 'Mitochondria'],
  'Plant cells have a cellulose cell wall. Both have a nucleus, membrane and mitochondria.');
M('B2.2-02', 'What is the plant cell wall made of?',
  ['Cellulose', 'Starch', 'Chitin', 'Protein'],
  'Plant cell walls are cellulose. Fungal cell walls are chitin.');
M('B2.2-03', 'Which structure is a large space in a plant cell filled with cell sap?',
  ['The vacuole', 'The nucleus', 'The chloroplast', 'The cytoplasm'],
  'Plant cells have a large permanent vacuole.');
T('B2.2-04', 'All plant cells contain chloroplasts.', false,
  'False. Cells that get no light, such as root cells, have no chloroplasts.');
MH('B2.2-05', 'A cell has a cell wall, chloroplasts and a large permanent vacuole. Which cell could it be?',
  ['A palisade cell from a leaf', 'A cheek cell from the mouth', 'A red blood cell', 'A root hair cell'],
  'Chloroplasts + cell wall + vacuole = a plant cell that photosynthesises. Root hair cells have no chloroplasts.');
M('B2.3-01', 'What is the function of the <b>nucleus</b>?',
  ['It contains genetic material and controls the cell’s activities', 'It is where aerobic respiration releases energy from glucose', 'It is where proteins are made from amino acids', 'It controls which substances enter and leave the cell'],
  'The nucleus contains the chromosomes (DNA).');
M('B2.3-02', 'Where does aerobic respiration happen?',
  ['Mitochondria', 'Ribosomes', 'Nucleus', 'Vacuole'],
  'Mitochondria release energy from glucose in aerobic respiration.');
M('B2.3-03', 'What is the function of <b>ribosomes</b>?',
  ['Making proteins (protein synthesis)', 'Absorbing light for photosynthesis', 'Storing cell sap to keep the cell firm', 'Releasing energy in aerobic respiration'],
  'Ribosomes are tiny structures in the cytoplasm where proteins are made.');
M('B2.3-04', 'What does the <b>cell membrane</b> do?',
  ['Controls which substances enter and leave the cell', 'Makes the cell rigid and stops it bursting', 'Absorbs light energy for photosynthesis', 'Contains the genetic material of the cell'],
  'The membrane is partially permeable. The cell wall is what makes plant cells rigid.');
M('B2.3-05', 'What is the function of <b>chloroplasts</b>?',
  ['They absorb light for photosynthesis', 'They release energy in respiration', 'They make proteins', 'They control the cell'],
  'Chloroplasts contain chlorophyll, which absorbs light energy.');
T('B2.3-06', 'Most of the cell’s chemical reactions happen in the cytoplasm.', true,
  'True. The cytoplasm is a jelly where many reactions take place.');
MH('B2.3-07', 'Muscle cells contain many more mitochondria than most cells. Why?',
  ['Muscles need a lot of energy, released by aerobic respiration in mitochondria', 'Mitochondria make the proteins that muscle fibres are built from', 'Mitochondria contract and relax, which makes the whole muscle move', 'Mitochondria store the glucose and oxygen that muscles need'],
  'More mitochondria → more aerobic respiration → more energy for contraction.');
MH('B2.3-08', 'A plant that has lost a lot of water wilts. Which structure’s job is most affected?',
  ['The vacuole, which keeps the cell firm when full of cell sap', 'The nucleus, which controls how fast the plant grows', 'The chloroplasts, which make food and keep the leaf green', 'The cell membrane, which lets water out of the cell'],
  'Full vacuoles push against the cell wall and keep cells firm. When they lose water, the plant wilts.');
M('B2.4-01', 'Which structures are found in <b>both</b> plant and animal cells?',
  ['Nucleus, cytoplasm, cell membrane, mitochondria and ribosomes', 'Cell wall, chloroplasts, permanent vacuole and nucleus', 'Nucleus, cell wall, cell membrane, cytoplasm and ribosomes', 'Chloroplasts, mitochondria, ribosomes, nucleus and cytoplasm'],
  'Plant cells also have a cell wall, chloroplasts and a large permanent vacuole.');
T('B2.4-02', 'Animal cells have a cell wall.', false,
  'False. Animal cells have a cell membrane but no cell wall.');
T('B2.4-03', 'Both plant and animal cells contain mitochondria.', true,
  'True. Plants respire all the time, just like animals.');
MH('B2.4-04', 'Which three structures could you use to tell a leaf cell from an animal cell under a microscope?',
  ['Cell wall, chloroplasts and large permanent vacuole', 'Nucleus, cytoplasm and cell membrane', 'Ribosomes, mitochondria and nucleus', 'Cell membrane, chloroplasts and ribosomes'],
  'Only plant cells have these three. (Ribosomes are too small to see with a light microscope anyway.)');

/* ===================== CHEMISTRY 1(c) Atomic structure (added 6 Nov 2026) ===================== */
M('C1.14-01', 'What is an <b>atom</b>?',
  ['The smallest particle of an element that can take part in a reaction', 'Two or more particles of an element chemically bonded together', 'A particle with a charge, formed by losing or gaining electrons', 'A mixture of protons, neutrons and electrons from different elements'],
  'Everything is made of atoms.');
M('C1.14-02', 'What is a <b>molecule</b>?',
  ['Two or more atoms chemically bonded together', 'A single atom of a noble gas such as neon', 'A charged particle made by losing electrons', 'A mixture of two elements that are not bonded'],
  'Examples: O₂, H₂O, CO₂.');
T('C1.14-03', 'A molecule can contain atoms of only one element.', true,
  'True. O₂ and N₂ are molecules of elements. H₂O is a molecule of a compound.');
MH('C1.14-04', 'Which of these is made of molecules?',
  ['Water, H₂O', 'Neon, Ne', 'Iron, Fe', 'Sodium chloride, NaCl'],
  'Neon exists as single atoms, iron is a metal and sodium chloride is a giant ionic lattice.');
M('C1.15-01', 'What are the relative masses of a proton, a neutron and an electron?',
  ['1, 1, about 1/1836', '1, 0, 1', '1, 1, 1', '0, 1, 1/1836'],
  'Protons and neutrons have about the same mass. Electrons are almost 2000 times lighter.');
M('C1.15-02', 'What is the relative charge of a neutron?',
  ['0', '+1', '−1', '+2'],
  'Proton +1, neutron 0, electron −1.');
M('C1.15-03', 'Where is almost all the mass of an atom?',
  ['In the nucleus', 'In the electron shells', 'Spread evenly through the atom', 'In the empty space'],
  'Protons and neutrons (in the nucleus) carry nearly all the mass.');
T('C1.15-04', 'An electron has about the same mass as a proton.', false,
  'False. An electron is about 1/1836 of the mass of a proton.');
MH('C1.15-05', 'Why does an atom have no overall charge?',
  ['It has the same number of protons as electrons', 'Its neutrons cancel out the charge of its protons', 'Its electrons have no charge, so nothing to balance', 'Its nucleus has no charge, so the atom has none'],
  'Each +1 from a proton is balanced by a −1 from an electron.');
M('C1.16-01', 'What is the <b>mass number</b> of an atom?',
  ['The total number of protons and neutrons', 'The total number of protons and electrons', 'The number of protons in the nucleus', 'The number of neutrons in the nucleus'],
  'Atomic number = protons. Mass number = protons + neutrons.');
M('C1.16-02', 'What are <b>isotopes</b>?',
  ['Atoms of the same element with different numbers of neutrons', 'Atoms of different elements with the same mass number', 'Atoms with different numbers of protons', 'Ions of the same element'],
  'Same atomic number, different mass number.');
T('C1.16-03', 'Isotopes of an element have different numbers of protons.', false,
  'False. Changing the number of protons makes a different element. Isotopes differ in neutrons.');
MH('C1.16-04', 'Why do isotopes of an element have the same chemical properties?',
  ['They have the same number of electrons, arranged the same way', 'They have the same number of neutrons in the nucleus', 'They have exactly the same mass as each other', 'They have the same mass number but different protons'],
  'Chemical reactions depend on electrons, and isotopes have identical electronic configurations.');
M('C1.16-05', 'What is the <b>relative atomic mass</b> (Ar) of an element?',
  ['The average mass of its atoms compared with 1/12 of a carbon-12 atom', 'The mass number of the most common isotope of that element', 'The total number of protons and electrons in one atom', 'The actual mass of one atom of the element, in grams'],
  'It is an average that takes account of all the isotopes and how common they are.');
M('C1.17-01', 'Chlorine is 75% chlorine-35 and 25% chlorine-37. What is its relative atomic mass?',
  ['35.5', '36', '35', '37'],
  '(75 × 35 + 25 × 37) ÷ 100 = (2625 + 925) ÷ 100 = <b>35.5</b>.');
M('C1.17-02', 'Why is the relative atomic mass of chlorine (35.5) not a whole number?',
  ['It is an average of the masses of its isotopes', 'Chlorine atoms contain half a neutron', 'Electrons add half a mass unit', 'It has been rounded wrongly'],
  'No single atom has a mass of 35.5: it is a weighted average.');
MH('C1.17-03', 'Copper is 69% copper-63 and 31% copper-65. What is its relative atomic mass to 1 decimal place?',
  ['63.6', '64.0', '63.4', '64.4'],
  '(69 × 63 + 31 × 65) ÷ 100 = (4347 + 2015) ÷ 100 = <b>63.62 → 63.6</b>.');

/* ===================== PHYSICS 3(d) Light and sound (added 6 Nov 2026) ===================== */
T('P3.14-01', 'Light waves are transverse.', true,
  'True. All electromagnetic waves, including light, are transverse.');
M('P3.14-02', 'Which of these can happen to light waves?',
  ['They can be reflected and refracted', 'They can be reflected but not refracted', 'They can be refracted but not reflected', 'Neither'],
  'Mirrors reflect light; lenses and glass blocks refract it.');
M('P3.15-01', 'A ray of light hits a plane mirror with an angle of incidence of 35°. What is the angle of reflection?',
  ['35°', '55°', '70°', '145°'],
  'Law of reflection: angle of incidence = angle of reflection.');
M('P3.15-02', 'Angles of incidence and reflection are measured from…',
  ['the normal', 'the mirror surface', 'the horizontal', 'the light source'],
  'The normal is the line at 90° to the surface where the ray hits it.');
MH('P3.15-03', 'A ray hits a mirror at 20° to the <b>surface</b> of the mirror. What is the angle of reflection?',
  ['70°', '20°', '40°', '160°'],
  'Angle to the normal = 90° − 20° = 70°. The angle of reflection equals this.');
M('P3.16-01', 'Light travels from air into a glass block at an angle. Which way does it bend?',
  ['Towards the normal', 'Away from the normal', 'It does not bend', 'Along the surface'],
  'Light slows down entering glass and bends towards the normal.');
M('P3.16-02', 'Light leaves a glass block into air at an angle. Which way does it bend?',
  ['Away from the normal', 'Towards the normal', 'It does not bend', 'Back into the glass every time'],
  'Light speeds up entering air and bends away from the normal.');
MH('P3.16-03', 'A ray enters a glass block along the normal (at 90° to the surface). What happens?',
  ['It carries straight on without changing direction, but slows down', 'It bends towards the normal, because it slows down in the glass', 'It bends away from the normal, because it speeds up in the glass', 'It is totally internally reflected back out of the block'],
  'An angle of incidence of 0° gives an angle of refraction of 0°. The speed still changes.');
M('P3.17-01', 'In the refraction practical, why do you mark the path of each ray with small crosses?',
  ['So you can join them up and measure the angles accurately', 'So the light ray shows up more brightly on the paper', 'So the ray does not reflect off the edge of the block', 'So you can work out the speed of light in the glass'],
  'You remove the block, draw the rays with a ruler and measure angles with a protractor.');
MH('P3.17-02', 'Why is a semi-circular block useful for investigating refraction?',
  ['A ray aimed at the centre meets the curved face along the normal', 'Its curved face stops any of the light being reflected', 'Its curved shape splits white light into a spectrum', 'Light travels faster through a semi-circular block'],
  'Only one surface bends the ray, which makes the angles easy to measure.');
T('P3.17-03', 'A triangular prism can split white light into a spectrum of colours.', true,
  'True. Each colour refracts by a slightly different amount (dispersion).');
M('P3.18-01', 'A ray enters glass with an angle of incidence of 50° and an angle of refraction of 30°. What is the refractive index? (sin 50° = 0.766, sin 30° = 0.5)',
  ['1.53', '1.67', '0.65', '20'],
  'n = sin i ÷ sin r = 0.766 ÷ 0.5 = <b>1.53</b>.');
T('P3.18-02', 'Refractive index has no units.', true,
  'True. It is a ratio of two sines.');
M('P3.19-01', 'In the glass block practical, how can you find the refractive index from several rays?',
  ['Plot sin i against sin r; the gradient is n', 'Measure the thickness of the block', 'Time how long light takes to cross the block', 'Plot i against r; the y-intercept is n'],
  'Using several rays and a graph gives a more reliable value than one ray.');
MH('P3.19-02', 'A student measures i and r for rays through a glass block and calculates n = 1.48, 1.52, 1.51, 1.49. What is the best value to give?',
  ['The mean: 1.50', 'The highest: 1.52', 'The first: 1.48', 'The range: 0.04'],
  '(1.48 + 1.52 + 1.51 + 1.49) ÷ 4 = 1.50. Repeating and averaging reduces the effect of random errors.');
M('P3.20-01', 'How do optical fibres carry light along a curved path?',
  ['Total internal reflection', 'Refraction out of the fibre', 'Diffraction', 'Absorption and re-emission'],
  'The light keeps hitting the inside surface at more than the critical angle, so it is totally reflected.');
M('P3.20-02', 'Why are prisms used in periscopes and binoculars instead of mirrors?',
  ['Total internal reflection in a prism reflects almost all the light', 'Prisms are much lighter and cheaper to make than mirrors', 'Prisms split the light into colours, which looks clearer', 'Mirrors cannot reflect light around a 90° corner'],
  'A 45° prism turns light through 90° by total internal reflection, giving a bright, clear image.');
T('P3.20-03', 'Total internal reflection can happen when light travels from air into glass.', false,
  'False. It only happens when light goes from a denser material (glass) towards a less dense one (air).');
M('P3.21-01', 'What is the <b>critical angle</b>?',
  ['The angle of incidence in the denser material that gives refraction at 90°', 'The angle of incidence at which light first enters the glass block', 'The angle between the two faces of a triangular prism', 'The angle at which all of the light is absorbed by the glass'],
  'Above the critical angle, all the light is reflected back inside.');
MH('P3.21-02', 'Light in glass hits the surface with an angle of incidence bigger than the critical angle. What happens?',
  ['It is totally internally reflected', 'It refracts out along the surface', 'It passes straight out without bending', 'It stops'],
  'At exactly the critical angle the ray runs along the surface; above it, total internal reflection.');
M('P3.22-01', 'Glass has a refractive index of 1.5. What is its critical angle? (sin⁻¹ 0.667 = 41.8°)',
  ['42°', '56°', '67°', '1.5°'],
  'sin c = 1 ÷ n = 1 ÷ 1.5 = 0.667, so c ≈ <b>42°</b>.');
MH('P3.22-02', 'Diamond has a critical angle of 24.4° (sin 24.4° = 0.413). What is its refractive index?',
  ['2.42', '0.41', '1.41', '4.13'],
  'n = 1 ÷ sin c = 1 ÷ 0.413 = <b>2.42</b>. The small critical angle is why diamonds sparkle.');
T('P3.23-01', 'Sound waves are longitudinal.', true,
  'True. The air particles vibrate back and forth in the same direction as the wave travels.');
M('P3.23-02', 'What is an <b>echo</b>?',
  ['A reflected sound wave', 'A refracted sound wave', 'A sound that is too high to hear', 'A sound in a vacuum'],
  'Sound reflects off hard surfaces like walls and cliffs.');
MH('P3.23-03', 'Why can sound not travel through a vacuum (e.g. space)?',
  ['Sound needs particles to vibrate and pass the wave on', 'Sound is an electromagnetic wave, which needs air', 'Sound travels too slowly to cross empty space', 'A vacuum absorbs all of the energy in sound'],
  'Sound is a longitudinal mechanical wave. Light can cross a vacuum; sound cannot.');
M('P3.23-04', 'Sound changes speed when it passes into a different medium. What can this cause?',
  ['Refraction: a change of direction', 'Total internal reflection every time', 'A change of frequency', 'The sound becoming transverse'],
  'Like light, sound refracts when its speed changes, e.g. between warm and cold air.');
M('P3.14-03', 'Which of these shows that light can be refracted?',
  ['A straw looks bent where it goes into a glass of water', 'You can see your face clearly in a flat mirror', 'You hear an echo when you shout in a large hall', 'A dark shadow forms behind an object in sunlight'],
  'The light changes speed and direction as it leaves the water, so the straw appears bent.');
T('P3.19-03', 'To measure the refractive index of a glass block reliably, you should use several rays with different angles of incidence.', true,
  'True. Several readings (or a graph of sin i against sin r) give a more reliable value than one ray.');
T('P3.21-03', 'At the critical angle, the refracted ray travels along the boundary between the two materials.', true,
  'True. The angle of refraction is 90°. Any bigger angle of incidence gives total internal reflection.');

/* ===================== BIOLOGY 1(a) Characteristics, 1(b) Variety of living organisms (added 7 Nov 2026) ===================== */
M('B1.1-01', 'Which of these is <b>not</b> one of the characteristics shared by all living organisms?',
  ['They all photosynthesise', 'They all respire', 'They all excrete waste', 'They all respond to their surroundings'],
  'Only plants (and some protoctists and bacteria) photosynthesise. All living things need nutrition, respire, excrete, respond, move, control internal conditions, reproduce, grow and develop.');
M('B1.1-02', 'What is <b>excretion</b>?',
  ['Removing waste products made by the body’s chemical reactions', 'Getting rid of undigested food from the end of the gut', 'Taking in food and breaking it down into small molecules', 'Releasing energy from glucose inside every living cell'],
  'Excretion removes metabolic waste such as carbon dioxide and urea. Getting rid of undigested food is egestion, not excretion.');
T('B1.1-03', 'Plants are not living because they cannot move from place to place.', false,
  'False. Plants move parts of themselves, e.g. leaves turn towards light and flowers open and close. Movement is still a characteristic of life.');
M('B1.1-04', 'Keeping body temperature steady is an example of which characteristic of living things?',
  ['Controlling internal conditions', 'Nutrition and feeding', 'Growth and development', 'Excretion of waste heat'],
  'Living things control their internal conditions (homeostasis).');
MH('B1.1-05', 'A car uses fuel, releases waste gases, moves and responds to the driver. Why is it still not alive?',
  ['It cannot reproduce, grow or develop by itself', 'It is made of metal instead of living cells', 'It cannot get rid of the waste that it makes', 'It does not need any energy to keep going'],
  'A living thing must show all the characteristics. A car cannot reproduce, grow or develop.');
M('B1.2-01', 'Which feature do plant cells have that animal cells do not?',
  ['Chloroplasts and a cellulose cell wall', 'A nucleus and a partially permeable membrane', 'Mitochondria and ribosomes in the cytoplasm', 'Cytoplasm and a nucleus containing DNA'],
  'Plants are multicellular, have chloroplasts for photosynthesis and cellulose cell walls.');
M('B1.2-02', 'How do <b>animals</b> usually store carbohydrate?',
  ['As glycogen', 'As starch', 'As cellulose', 'As chitin'],
  'Animals often store carbohydrate as glycogen. Plants store it as starch or sucrose.');
M('B1.2-03', 'What are the cell walls of <b>fungi</b> made of?',
  ['Chitin', 'Cellulose', 'Starch', 'Glycogen'],
  'Fungal cell walls are chitin. Plant cell walls are cellulose.');
M('B1.2-04', 'What is <b>saprotrophic nutrition</b>?',
  ['Secreting enzymes onto food outside the body, then absorbing the products', 'Making food by photosynthesis, using light energy and chlorophyll', 'Swallowing food and then digesting it inside a gut with enzymes', 'Living inside another organism and absorbing food from its blood'],
  'Fungi feed this way: extracellular digestion followed by absorption.');
M('B1.2-05', 'The thread-like structures that make up the body of a fungus such as <i>Mucor</i> are called…',
  ['hyphae', 'villi', 'plasmids', 'chloroplasts'],
  'Hyphae form a network called a mycelium. Each hypha contains many nuclei.');
M('B1.2-06', 'Which of these is a <b>protoctist</b>?',
  ['<i>Amoeba</i>', '<i>Mucor</i>', '<i>Lactobacillus</i>', 'Maize'],
  'Protoctists are microscopic single-celled organisms, e.g. <i>Amoeba</i>, <i>Chlorella</i> and <i>Plasmodium</i>. <i>Mucor</i> is a fungus; <i>Lactobacillus</i> is a bacterium.');
T('B1.2-07', 'Yeast is a single-celled fungus.', true,
  'True. Most fungi are made of hyphae, but some, like yeast, are single-celled.');
MH('B1.2-08', '<i>Chlorella</i> is single-celled and has chloroplasts. <i>Amoeba</i> is single-celled and has no chloroplasts. Which group do both belong to?',
  ['Protoctists', 'Plants', 'Fungi', 'Bacteria'],
  'Protoctists are a varied group of single-celled organisms: some are plant-like (<i>Chlorella</i>), some animal-like (<i>Amoeba</i>).');
MH('B1.2-09', 'An organism is multicellular, has no cell walls, has nervous co-ordination and stores glycogen. What is it?',
  ['An animal', 'A plant', 'A fungus', 'A protoctist'],
  'No cell wall + nervous co-ordination + glycogen = animal. Fungi also store glycogen but have chitin cell walls.');
M('B1.3-01', 'Which structure do bacterial cells <b>not</b> have?',
  ['A nucleus', 'A cell wall', 'Plasmids', 'A cell membrane'],
  'Bacteria are prokaryotes: no nucleus. Their DNA is a circular chromosome loose in the cytoplasm, plus small rings called plasmids.');
M('B1.3-02', 'What are <b>plasmids</b>?',
  ['Small rings of DNA found in bacteria', 'The cell walls of bacteria', 'Tiny organelles that carry out photosynthesis', 'The threads that make up a fungus'],
  'Bacteria have a circular chromosome plus extra small rings of DNA called plasmids.');
M('B1.3-03', '<i>Lactobacillus bulgaricus</i> is a rod-shaped bacterium. What is it used for?',
  ['Making yoghurt from milk', 'Making bread dough rise', 'Causing pneumonia in the lungs', 'Causing malaria in humans'],
  '<i>Pneumococcus</i> causes pneumonia, <i>Plasmodium</i> causes malaria and yeast makes bread rise.');
T('B1.3-04', 'All bacteria are pathogens.', false,
  'False. Most bacteria are harmless or useful (e.g. <i>Lactobacillus</i> in yoghurt). Some, like <i>Pneumococcus</i>, are pathogens.');
MH('B1.3-05', 'How is the DNA of a bacterium arranged?',
  ['A circular chromosome in the cytoplasm, plus plasmids', 'Several chromosomes held inside a nucleus', 'A strand of RNA surrounded by a protein coat', 'Spread through many nuclei in long threads'],
  'Bacteria have no nucleus. Chromosomes in a nucleus = eukaryotes; many nuclei in threads = fungal hyphae; protein coat = virus.');
M('B1.4-01', 'What is a <b>pathogen</b>?',
  ['A microorganism that causes disease', 'Any single-celled organism', 'A cell that fights infection', 'A chemical that kills bacteria'],
  'Pathogens can be fungi, bacteria, protoctists or viruses.');
T('B1.4-02', 'Viruses are living organisms.', false,
  'False. Viruses are not living organisms: they have no cellular structure and can only reproduce inside living cells.');
M('B1.4-03', 'What is a virus made of?',
  ['A protein coat around either DNA or RNA', 'A cell wall, membrane and cytoplasm', 'A nucleus surrounded by cytoplasm', 'Hyphae containing many nuclei'],
  'Viruses have no cells: just a protein coat and one type of nucleic acid.');
M('B1.4-04', 'Which disease is caused by a <b>protoctist</b>?',
  ['Malaria', 'Pneumonia', 'Influenza (flu)', 'AIDS'],
  'Malaria is caused by <i>Plasmodium</i>. Pneumonia: <i>Pneumococcus</i> (bacterium). Flu and AIDS: viruses.');
M('B1.4-05', 'How does the tobacco mosaic virus damage tobacco plants?',
  ['It stops chloroplasts forming, so leaves become discoloured', 'It digests the cellulose cell walls, so the leaves fall apart', 'It blocks the xylem vessels, so the whole plant wilts', 'It feeds on the roots, so the plant cannot take in water'],
  'Without chloroplasts in patches, the leaf has a mottled “mosaic” pattern and photosynthesises less.');
MH('B1.4-06', 'Why can a virus only reproduce inside a living cell?',
  ['It has no cell structure, so it uses the host cell to copy itself', 'It needs the host cell’s wall to protect its protein coat', 'It is too large to survive for long outside a cell', 'It needs the cell’s chloroplasts to make its own food'],
  'Viruses are parasites: they take over the host cell to copy their nucleic acid and make new protein coats.');
T('B1.4-07', 'Viruses are smaller than bacteria.', true,
  'True. Viruses are much smaller than bacteria.');

/* ===================== CHEMISTRY 1(a) States of matter (added 7 Nov 2026) ===================== */
M('C1.1-01', 'Which describes the particles in a <b>solid</b>?',
  ['Close together in a regular pattern, vibrating about fixed positions', 'Close together but randomly arranged, moving past each other', 'Far apart and randomly arranged, moving quickly in all directions', 'Far apart in a regular pattern, vibrating about fixed positions'],
  'Solid: regular, close, vibrate. Liquid: close, random, slide past each other. Gas: far apart, random, fast.');
M('C1.1-02', 'Which describes the particles in a <b>liquid</b>?',
  ['Close together, randomly arranged and able to move past each other', 'Close together in neat rows and only able to vibrate on the spot', 'Far apart, randomly arranged and moving quickly in straight lines', 'Far apart in a regular pattern and not moving at all'],
  'That is why liquids flow and take the shape of their container but can’t easily be compressed.');
M('C1.1-03', 'In which state do the particles have the <b>most</b> energy?',
  ['Gas', 'Liquid', 'Solid', 'All have the same energy'],
  'Gas particles move fastest, so they have the most kinetic energy.');
T('C1.1-04', 'Liquids can be compressed easily because their particles are far apart.', false,
  'False. Liquid particles are close together (touching), so liquids hardly compress. Gases compress easily because their particles are far apart.');
MH('C1.1-05', 'Why does a liquid take the shape of its container but keep the same volume?',
  ['Its particles can move past each other but stay close together', 'Its particles are far apart and move freely in all directions', 'Its particles are fixed in a regular pattern but can vibrate', 'Its particles expand until they fill the whole container'],
  'Particles sliding past each other = flows. Particles still touching = fixed volume.');
M('C1.2-01', 'What is the change from a gas to a liquid called?',
  ['Condensing', 'Evaporating', 'Melting', 'Freezing'],
  'Melting (s→l), freezing (l→s), boiling/evaporating (l→g), condensing (g→l), sublimation (s→g).');
M('C1.2-02', 'What is the change directly from a solid to a gas called?',
  ['Sublimation', 'Evaporation', 'Condensation', 'Melting'],
  'For example, solid carbon dioxide (dry ice) sublimes.');
M('C1.2-03', 'When a solid melts, what happens to its particles?',
  ['They gain energy, vibrate more and break free of fixed positions', 'They lose energy, vibrate less and move closer together', 'They gain energy and spread far apart, moving very quickly', 'They stop vibrating and slide past each other instead'],
  'Heating gives particles energy to overcome some of the forces holding them in place.');
T('C1.2-04', 'When a liquid freezes, its particles gain energy.', false,
  'False. The particles <b>lose</b> energy to the surroundings and settle into a regular arrangement.');
MH('C1.2-05', 'While ice is melting, its temperature stays at 0 °C even though it is being heated. Why?',
  ['The energy is used to overcome forces between particles, not to raise the temperature', 'The thermometer cannot measure any temperature above 0 °C while ice is present', 'Ice cannot absorb any heat energy at all until every bit of it has melted', 'The heat energy is reflected away by the shiny surface of the ice'],
  'During a change of state, energy goes into breaking forces between particles, so the temperature stays constant.');
M('C1.3-01', 'A purple crystal of potassium manganate(VII) is placed in water. After a while all the water is pale purple. What explains this?',
  ['The particles diffuse and spread out evenly', 'The water particles turn purple', 'The crystal reacts with the water', 'The crystal particles sink to the bottom'],
  'Diffusion: particles move randomly and spread from high to low concentration.');
M('C1.3-02', 'A coloured solution is diluted several times. The colour gets paler but never disappears completely. What does this show?',
  ['It is made of tiny particles, which become more spread out', 'The particles get smaller each time the solution is diluted', 'Some of the particles are destroyed each time water is added', 'The water particles slowly change colour to match the dye'],
  'There are huge numbers of tiny particles. Diluting spreads them out, so there are fewer in each drop.');
MH('C1.3-03', 'Cotton wool soaked in ammonia is put at one end of a tube and cotton wool soaked in hydrogen chloride at the other. A white ring forms nearer the hydrogen chloride end. Why?',
  ['Ammonia particles are lighter, so they diffuse faster and travel further', 'Hydrogen chloride particles are lighter, so they diffuse faster', 'Both gases diffuse at the same speed, so they meet in the middle', 'The white ring forms where the tube is warmest, near that end'],
  'NH₃ (Mr 17) is lighter than HCl (Mr 36.5), so it diffuses faster.');
T('C1.3-04', 'Gases diffuse more slowly at higher temperatures.', false,
  'False. At higher temperatures the particles move faster, so gases diffuse <b>faster</b>.');
M('C1.4-01', 'Salt is dissolved in water. Which is the <b>solvent</b>?',
  ['Water', 'Salt', 'Salt water', 'The beaker'],
  'Solute (salt) dissolves in the solvent (water) to make a solution (salt water).');
M('C1.4-02', 'What is a <b>saturated solution</b>?',
  ['A solution in which no more solute will dissolve at that temperature', 'A solution that contains only water and no dissolved substances', 'A solution in which the solute has spread out evenly everywhere', 'A solution that has been heated until all the water evaporated'],
  'Add more solute to a saturated solution and it will just sit at the bottom.');
M('C1.4-03', 'What is a <b>solute</b>?',
  ['The substance that dissolves', 'The liquid that does the dissolving', 'The mixture that forms', 'The solid left after filtering'],
  'Solute + solvent → solution.');
T('C1.4-04', 'A solution is a mixture of a solute and a solvent.', true,
  'True. Dissolving does not make a new substance, so a solution is a mixture.');

/* ===================== CHEMISTRY 1(b) Elements, compounds and mixtures (added 7 Nov 2026) ===================== */
M('C1.8-01', 'Which of these is a <b>compound</b>?',
  ['Water, H₂O', 'Oxygen, O₂', 'Air', 'Iron, Fe'],
  'A compound contains two or more elements chemically combined. O₂ and Fe are elements; air is a mixture.');
M('C1.8-02', 'Which of these is a <b>mixture</b>?',
  ['Sea water', 'Carbon dioxide', 'Sodium chloride', 'Copper'],
  'Sea water is water with dissolved salts, not chemically combined.');
M('C1.8-03', 'What is an <b>element</b>?',
  ['A substance made of only one type of atom', 'A substance made of two types of atom bonded together', 'Two or more substances mixed but not bonded', 'Any substance that is a solid'],
  'Every element has its own symbol in the Periodic Table.');
T('C1.8-04', 'The substances in a mixture are chemically bonded together.', false,
  'False. In a mixture the substances are not chemically combined, so they can be separated by physical methods.');
MH('C1.8-05', 'Iron filings and sulfur powder are stirred together. Which statement is correct?',
  ['It is a mixture: a magnet can pull out the iron', 'It is a compound: the iron and sulfur are bonded', 'It is an element: it contains only iron', 'It is a compound: it has a fixed formula'],
  'They are not chemically combined until heated. Heating them makes the compound iron sulfide.');
M('C1.9-01', 'How can you tell if a substance is <b>pure</b>?',
  ['It melts or boils at one fixed temperature', 'It melts over a range of temperatures', 'It is colourless', 'It dissolves in water'],
  'Mixtures melt and boil over a range of temperatures.');
MH('C1.9-02', 'Pure water boils at 100 °C. A sample of water boils between 101 °C and 103 °C. What does this tell you?',
  ['It is impure: it contains dissolved substances', 'It is pure, but the thermometer is wrong', 'It is pure water at a different pressure', 'It is a compound, not a mixture'],
  'Impurities change the boiling point and make it happen over a range.');
T('C1.9-03', 'A mixture always melts at one exact temperature.', false,
  'False. A pure substance has a fixed melting point; a mixture usually melts over a range of temperatures.');
M('C1.10-01', 'Which method separates an insoluble solid from a liquid?',
  ['Filtration', 'Crystallisation', 'Simple distillation', 'Chromatography'],
  'The solid stays in the filter paper as the residue; the liquid passes through as the filtrate.');
M('C1.10-02', 'Which method gets pure water from salt water?',
  ['Simple distillation', 'Filtration', 'Chromatography', 'Fractional distillation'],
  'The water boils, then is cooled in a condenser and collected. The salt stays behind.');
M('C1.10-03', 'Which method gets solid salt crystals from salt solution?',
  ['Crystallisation', 'Filtration', 'Chromatography', 'Condensation'],
  'Heat to evaporate some water, then leave to cool so crystals form.');
M('C1.10-04', 'Which method separates a mixture of liquids with different boiling points, such as ethanol and water?',
  ['Fractional distillation', 'Filtration', 'Crystallisation', 'Simple distillation'],
  'A fractionating column lets the liquids separate as each boils off at its own temperature.');
MH('C1.10-05', 'In simple distillation, what is the job of the condenser?',
  ['To cool the vapour so it turns back into a liquid', 'To heat the mixture so that the liquid boils', 'To trap solid impurities so they are filtered out', 'To keep the vapour hot so it does not condense'],
  'Cold water flows around the condenser, so the vapour condenses and drips into the collecting flask.');
M('C1.11-01', 'A chromatogram of an ink shows three spots. What does this tell you?',
  ['The ink contains at least three different substances', 'The ink is a pure substance that has split into three', 'The ink was dissolved in three different solvents', 'The ink is insoluble, so it left three marks behind'],
  'Each spot is a different dissolved substance. (Insoluble substances stay on the start line.)');
MH('C1.11-02', 'On a chromatogram, an unknown ink has spots at the same heights as dyes A and C. What can you conclude?',
  ['The ink probably contains dyes A and C', 'The ink is pure', 'The ink contains A, B and C', 'The ink contains neither A nor C'],
  'Spots that travel the same distance in the same solvent are likely the same substance.');
T('C1.11-03', 'A pure substance gives only one spot on a chromatogram.', true,
  'True. A mixture of soluble substances gives more than one spot.');
M('C1.12-01', 'A spot travels 3.0 cm and the solvent front travels 6.0 cm. What is the Rf value?',
  ['0.5', '2.0', '3.0', '9.0'],
  'Rf = distance moved by spot ÷ distance moved by solvent = 3.0 ÷ 6.0 = <b>0.5</b>.');
T('C1.12-02', 'An Rf value can be greater than 1.', false,
  'False. A spot cannot travel further than the solvent, so Rf is always between 0 and 1.');
M('C1.13-01', 'Why is the start line on chromatography paper drawn in <b>pencil</b>?',
  ['Pencil does not dissolve in the solvent, so it won’t run', 'Pencil lines are easier to see than ink when wet', 'Pencil helps the solvent soak up the paper faster', 'Pencil stops the spots of ink spreading sideways'],
  'An ink line would dissolve and add extra spots.');
M('C1.13-02', 'Why must the start line be <b>above</b> the solvent level in the beaker?',
  ['Otherwise the spots dissolve into the solvent in the beaker', 'So that the bottom of the paper does not get wet at all', 'So the solvent travels up the paper more quickly', 'So the pencil line stays dry and can still be seen'],
  'If the spots are under the solvent, they wash off into it.');

/* ===================== CHEMISTRY 1(e) Formulae, equations and calculations (added 7 Nov 2026) ===================== */
M('C1.25-01', 'Which is the correctly balanced equation for magnesium burning in oxygen?',
  ['2Mg + O₂ → 2MgO', 'Mg + O₂ → MgO', 'Mg + O → MgO', 'Mg + O₂ → MgO₂'],
  'Two O atoms on the left need 2MgO on the right, then 2Mg to balance magnesium.');
M('C1.25-02', 'Balance: <b>?</b>H₂ + O₂ → 2H₂O',
  ['2', '1', '4', '3'],
  '2H₂ + O₂ → 2H₂O: 4 H atoms and 2 O atoms on each side.');
M('C1.25-03', 'What does the state symbol (aq) mean?',
  ['Dissolved in water', 'Liquid', 'Gas', 'Solid'],
  '(s) solid, (l) liquid, (g) gas, (aq) aqueous = dissolved in water.');
MH('C1.25-04', 'Balance: CH₄ + <b>?</b>O₂ → CO₂ + 2H₂O',
  ['2', '1', '3', '4'],
  'On the right there are 2 + 2 = 4 O atoms, so you need 2O₂.');
T('C1.25-05', 'Balancing an equation means changing the small numbers in the formulae.', false,
  'False. You only change the big numbers in front of formulae. Changing H₂O to H₂O₂ would make a different substance.');
M('C1.26-01', 'What is the relative formula mass (Mr) of carbon dioxide, CO₂? (C = 12, O = 16)',
  ['44', '28', '40', '56'],
  '12 + (2 × 16) = <b>44</b>.');
M('C1.26-02', 'What is the Mr of calcium hydroxide, Ca(OH)₂? (Ca = 40, O = 16, H = 1)',
  ['74', '57', '58', '114'],
  '40 + 2 × (16 + 1) = 40 + 34 = <b>74</b>.');
M('C1.27-01', 'What is the unit for the amount of a substance?',
  ['The mole (mol)', 'The gram (g)', 'The litre (dm³)', 'The relative formula mass'],
  'One mole of a substance has a mass in grams equal to its Ar or Mr.');
T('C1.27-02', 'One mole of carbon atoms has a mass of 6 g.', false,
  'False. The Ar of carbon is 12, so one mole has a mass of <b>12 g</b>. (6 is carbon’s atomic number.)');
M('C1.28-01', 'How many moles are in 36 g of water (Mr = 18)?',
  ['2 mol', '0.5 mol', '18 mol', '648 mol'],
  'moles = mass ÷ Mr = 36 ÷ 18 = <b>2 mol</b>.');
M('C1.28-02', 'What is the mass of 0.5 mol of sodium chloride (Mr = 58.5)?',
  ['29.25 g', '117 g', '58.5 g', '0.0085 g'],
  'mass = moles × Mr = 0.5 × 58.5 = <b>29.25 g</b>.');
M('C1.29-01', '2Mg + O₂ → 2MgO. How many moles of MgO are made from 3 moles of Mg?',
  ['3 mol', '1.5 mol', '6 mol', '2 mol'],
  'The ratio Mg : MgO is 2 : 2 = 1 : 1, so 3 mol Mg → <b>3 mol MgO</b>.');
MH('C1.29-02', 'CaCO₃ → CaO + CO₂. What mass of CaO is made from 50 g of CaCO₃? (Mr CaCO₃ = 100, CaO = 56)',
  ['28 g', '50 g', '56 g', '22 g'],
  '50 ÷ 100 = 0.5 mol CaCO₃ → 0.5 mol CaO (1 : 1). 0.5 × 56 = <b>28 g</b>.');
M('C1.30-01', 'The theoretical yield is 20 g but only 15 g is made. What is the percentage yield?',
  ['75%', '133%', '25%', '5%'],
  'percentage yield = actual ÷ theoretical × 100 = 15 ÷ 20 × 100 = <b>75%</b>.');
MH('C1.30-02', 'Which is <b>not</b> a reason why the percentage yield of a reaction is less than 100%?',
  ['The reactants were weighed accurately', 'Some product was lost when it was filtered', 'The reaction did not go to completion', 'Some reactants made other products instead'],
  'Accurate weighing does not lose product. The others all reduce the amount of product collected.');
M('C1.31-01', 'Copper(II) sulfate crystals are heated until they turn white. The mass falls. What has been lost?',
  ['Water of crystallisation', 'Copper', 'Sulfur dioxide', 'Oxygen'],
  'Blue hydrated CuSO₄·5H₂O loses its water to become white anhydrous CuSO₄. The loss in mass is the water.');
MH('C1.31-02', 'Why is a metal oxide heated repeatedly until its mass stops changing?',
  ['To make sure the reaction is complete', 'To make the crucible cooler', 'To remove the lid', 'To make the oxide react with the crucible'],
  'Heating to constant mass means no more change is happening, so the reaction has finished.');
M('C1.32-01', 'What is an <b>empirical formula</b>?',
  ['The simplest whole-number ratio of atoms of each element in a compound', 'The actual number of atoms of each element in a molecule', 'The formula of an element', 'The formula showing all the bonds'],
  'For example, ethane C₂H₆ has the empirical formula CH₃.');
M('C1.32-02', 'The molecular formula of glucose is C₆H₁₂O₆. What is its empirical formula?',
  ['CH₂O', 'C₆H₁₂O₆', 'C₂H₄O₂', 'CHO'],
  'Divide by the highest common factor, 6: C₁H₂O₁.');
M('C1.33-01', 'A compound contains 12 g of carbon (Ar 12) and 4 g of hydrogen (Ar 1). What is its empirical formula?',
  ['CH₄', 'C₃H', 'CH', 'C₁₂H₄'],
  'C: 12 ÷ 12 = 1 mol. H: 4 ÷ 1 = 4 mol. Ratio 1 : 4 → <b>CH₄</b>.');
MH('C1.33-02', 'A hydrocarbon has the empirical formula CH₂ and an Mr of 42. What is its molecular formula?',
  ['C₃H₆', 'CH₂', 'C₂H₄', 'C₄H₈'],
  'CH₂ has a mass of 14. 42 ÷ 14 = 3, so (CH₂)₃ = <b>C₃H₆</b>.');
M('C1.36-01', 'In the experiment to find the formula of magnesium oxide, why is the crucible lid lifted from time to time?',
  ['To let oxygen in so the magnesium can burn', 'To let the magnesium oxide escape as smoke', 'To let the crucible cool down between heatings', 'To stop the crucible cracking from the heat'],
  'Lift it only briefly so that oxygen gets in but little white smoke (MgO) escapes.');
MH('C1.36-02', 'Magnesium is heated in a crucible. Mass of Mg = 0.24 g; mass of oxide = 0.40 g. What is the formula of the oxide? (Mg = 24, O = 16)',
  ['MgO', 'MgO₂', 'Mg₂O', 'Mg₂O₃'],
  'O = 0.40 − 0.24 = 0.16 g. Mg: 0.24 ÷ 24 = 0.01 mol; O: 0.16 ÷ 16 = 0.01 mol. Ratio 1 : 1 → <b>MgO</b>.');
T('C1.36-03', 'When copper(II) oxide is reduced by heating it in a stream of hydrogen, the solid loses mass.', true,
  'True. The oxygen is removed from the copper(II) oxide, leaving copper. The loss in mass is the oxygen.');

/* ===================== PHYSICS 7(c) Fission and fusion (added 7 Nov 2026) ===================== */
M('P7.17-01', 'Which of these nuclear processes can be a source of energy?',
  ['Fission, fusion and radioactive decay', 'Only fission in nuclear power stations', 'Only fusion inside stars like the Sun', 'Only radioactive decay of unstable nuclei'],
  'All three release energy from the nucleus.');
T('P7.17-02', 'Radioactive decay releases energy.', true,
  'True. For example, the heat from radioactive decay helps keep the inside of the Earth hot.');
M('P7.18-01', 'What starts the fission of a uranium-235 nucleus?',
  ['A neutron colliding with it', 'An electron colliding with it', 'Heating it to millions of degrees', 'A gamma ray hitting it'],
  'The U-235 nucleus absorbs a neutron, becomes unstable and splits.');
M('P7.18-02', 'In what form is most of the energy from a fission released?',
  ['Kinetic energy of the fission products', 'Light energy given out by the uranium', 'Chemical energy stored in new bonds', 'Electrical energy of the free electrons'],
  'The daughter nuclei and neutrons fly apart very fast. This kinetic energy heats the reactor.');
MH('P7.18-03', 'Why are neutrons, not protons, used to start fission?',
  ['Neutrons have no charge, so they are not repelled by the positive nucleus', 'Neutrons are much heavier than protons', 'Neutrons are negatively charged and attracted to the nucleus', 'Protons would make the nucleus radioactive'],
  'A proton would be pushed away by the positive charge of the nucleus.');
M('P7.19-01', 'What does the fission of U-235 produce?',
  ['Two radioactive daughter nuclei and a few neutrons', 'One larger nucleus and a fast-moving alpha particle', 'Two stable daughter nuclei and a few electrons', 'Hydrogen and helium nuclei and a gamma ray'],
  'Usually two or three neutrons are released along with the two daughter nuclei.');
T('P7.19-02', 'The daughter nuclei produced by fission are radioactive.', true,
  'True. This is why spent nuclear fuel is radioactive waste.');
M('P7.20-01', 'How is a chain reaction set up?',
  ['Neutrons released by one fission go on to split other U-235 nuclei', 'The daughter nuclei join back together to make new U-235 nuclei', 'Electrons released by each fission go on to start the next one', 'Gamma rays released by each fission split the nearby nuclei'],
  'Each fission releases 2–3 neutrons, which can cause more fissions.');
MH('P7.20-02', 'Each fission releases about 3 neutrons. What would happen if every one of them caused another fission?',
  ['The number of fissions would grow rapidly, out of control', 'The reaction would stop after the very first fission', 'The number of fissions would stay exactly the same', 'All the uranium would turn into lead straight away'],
  '1 → 3 → 9 → 27… That is why reactors must control the number of neutrons.');
M('P7.21-01', 'What do <b>control rods</b> do in a nuclear reactor?',
  ['Absorb neutrons to control the rate of fission', 'Slow neutrons down so they cause fission', 'Absorb radiation to protect workers', 'Carry heat away to the boiler'],
  'Lowering the rods absorbs more neutrons, slowing the chain reaction.');
M('P7.21-02', 'What does the <b>moderator</b> do in a nuclear reactor?',
  ['Slows down neutrons so they are more likely to cause fission', 'Absorbs neutrons so that the chain reaction stops completely', 'Stops radiation escaping from the core into the building', 'Speeds up neutrons so they hit nuclei harder and split them'],
  'Slow neutrons are more easily absorbed by U-235 nuclei. Graphite or water is used.');
MH('P7.21-03', 'The reactor is getting too hot. What should the operators do?',
  ['Lower the control rods further into the core', 'Raise the control rods out of the core', 'Remove the moderator', 'Add more uranium fuel'],
  'More control rod in the core absorbs more neutrons, so fewer fissions happen.');
T('P7.21-04', 'Control rods slow neutrons down.', false,
  'False. Control rods <b>absorb</b> neutrons. It is the moderator that slows them down.');
M('P7.22-01', 'Why is a nuclear reactor surrounded by thick concrete shielding?',
  ['To absorb ionising radiation so it does not escape', 'To slow down the neutrons so they cause more fission', 'To keep the core hot so the reaction keeps going', 'To reflect neutrons back so the reaction goes faster'],
  'The shielding protects workers and the environment from radiation, especially gamma rays and neutrons.');
MH('P7.22-02', 'Which of these is <b>not</b> a job of the shielding around a reactor?',
  ['Controlling the rate of the chain reaction', 'Absorbing gamma radiation', 'Absorbing neutrons that escape the core', 'Protecting people who work nearby'],
  'The rate is controlled by the control rods, not the shielding.');
M('P7.23-01', 'What is the difference between fission and fusion?',
  ['Fission splits a large nucleus; fusion joins small nuclei', 'Fission joins small nuclei; fusion splits a large nucleus', 'Fission happens in stars; fusion happens in power stations', 'Fission releases energy; fusion takes in energy'],
  'Both release energy.');
T('P7.23-02', 'Nuclear power stations today use fusion to generate electricity.', false,
  'False. They use fission. Fusion power is still being developed.');
M('P7.24-01', 'What is nuclear fusion?',
  ['Small nuclei joining to form a larger nucleus, releasing energy', 'A large nucleus splitting into two smaller ones, releasing energy', 'An unstable nucleus emitting an alpha particle and a gamma ray', 'Two atoms joining together by sharing a pair of electrons'],
  'For example, hydrogen nuclei fuse to make helium.');
MH('P7.24-02', 'In fusion, the mass of the new nucleus is slightly less than the total mass of the nuclei that joined. What happened to the missing mass?',
  ['It was released as energy', 'It escaped as fast electrons', 'It turned into extra neutrons', 'It was simply measured wrongly'],
  'The loss of mass is accompanied by a release of energy.');
M('P7.25-01', 'What is the energy source of stars?',
  ['Nuclear fusion', 'Nuclear fission', 'Burning hydrogen gas in oxygen', 'Radioactive decay of uranium'],
  'In the Sun, hydrogen nuclei fuse to make helium.');
M('P7.26-01', 'Why does fusion need very high temperatures and pressures?',
  ['Positive nuclei repel, so they must move very fast to get close', 'The nuclei have to be melted before they are able to join', 'High temperatures create the neutrons that start the reaction', 'Fusion only releases energy if the surroundings are already hot'],
  'Electrostatic repulsion between protons must be overcome.');
T('P7.26-02', 'Fusion can happen at room temperature if the nuclei are close together.', false,
  'False. At low temperatures the nuclei move too slowly to overcome the electrostatic repulsion between their protons.');
MH('P7.26-03', 'Why is it so hard to build a fusion power station on Earth?',
  ['It is very hard to reach and contain the extreme temperatures needed', 'There is not enough hydrogen on Earth to use as a fuel', 'Fusion produces far less energy than burning fossil fuels', 'Fusion only works with uranium, which is rare and expensive'],
  'The fuel must be hotter than the centre of the Sun and held so it does not touch the walls.');

/* ===================== Top-up to ≥5 per point: Chemistry + Biology (added 7 Nov 2026) ===================== */
M('B2.4-05', 'Which structure is found in animal cells as well as plant cells?',
  ['Mitochondria', 'A cellulose cell wall', 'Chloroplasts', 'A large permanent vacuole'],
  'Mitochondria are in both, because both respire.');
M('C1.3-05', 'A drop of food colouring is added to a beaker of hot water and another to cold water. What would you expect?',
  ['The colour spreads faster in the hot water', 'The colour spreads faster in the cold water', 'The colour spreads at the same rate in both', 'The colour only spreads in the cold water'],
  'Particles move faster at higher temperatures, so diffusion is faster.');
T('C1.4-05', 'A solvent is the substance that dissolves in a liquid.', false,
  'False. The solute dissolves; the solvent is the liquid it dissolves in.');
M('C1.9-04', 'A sample of solid melts between 78 °C and 84 °C. What does this suggest?',
  ['It is a mixture', 'It is a pure element', 'It is a pure compound', 'It cannot be melted'],
  'Melting over a range of temperatures shows it is impure (a mixture).');
T('C1.9-05', 'Adding salt to water changes the temperature at which the water boils.', true,
  'True. Salt water is a mixture, so it does not boil at exactly 100 °C.');
M('C1.11-04', 'In chromatography, a spot stays on the start line. What does this tell you?',
  ['That substance is insoluble in the solvent used', 'That substance is the most soluble in the solvent', 'That substance is pure water from the solvent', 'That the pencil line has dissolved in the solvent'],
  'A substance only moves up the paper if it dissolves in the solvent.');
MH('C1.11-05', 'A food colouring gives one spot with water as the solvent. Can you be sure it is pure?',
  ['No: it might separate into more spots in a different solvent', 'Yes: a single spot on a chromatogram always means it is pure', 'No: a pure substance should always give exactly two spots', 'Yes: water dissolves every dye, so it would show any others'],
  'Two dyes might travel the same distance in one solvent. Repeating with other solvents is a better test.');
M('C1.12-03', 'Dye X has an Rf value of 0.80 and dye Y has an Rf value of 0.30. Which statement is true?',
  ['X travelled further up the paper than Y', 'Y travelled further up the paper than X', 'Both travelled the same distance', 'Neither dye dissolved in the solvent'],
  'A higher Rf means the dye travelled a bigger fraction of the solvent’s distance.');
MH('C1.12-04', 'An unknown dye has Rf = 0.45. Known dyes, run in the same solvent, have: red 0.30, yellow 0.45, blue 0.70. What is the unknown dye?',
  ['Yellow', 'Red', 'Blue', 'A mixture of red and blue'],
  'In the same solvent, the same substance gives the same Rf value.');
M('C1.13-03', 'Why is a lid put on the beaker during paper chromatography?',
  ['To stop the solvent evaporating from the paper', 'To keep light out so the dyes do not fade', 'To stop the paper falling into the solvent', 'To keep the solvent warm so it moves faster'],
  'If the solvent evaporates from the paper, the spots would not move properly.');
T('C1.13-04', 'The spots of ink should be put below the level of the solvent.', false,
  'False. The start line must be above the solvent, or the spots dissolve into the solvent in the beaker.');
MH('C1.13-05', 'Why should the spots on the start line be small and concentrated?',
  ['So they separate into clear, distinct spots that are easy to measure', 'So they dissolve more slowly and do not wash off the paper', 'So the solvent cannot reach them until the experiment is over', 'So the Rf value comes out bigger and is easier to calculate'],
  'Large spots spread out and overlap, making it hard to see or measure separate substances.');
T('C1.14-05', 'Neon exists as single atoms, not molecules.', true,
  'True. Noble gases have full outer shells, so they exist as single atoms.');
MH('C1.17-04', 'Boron has two isotopes, boron-10 and boron-11. Its relative atomic mass is 10.8. Which isotope is more common?',
  ['Boron-11', 'Boron-10', 'They are equally common', 'You cannot tell'],
  '10.8 is closer to 11 than to 10, so most boron atoms must be boron-11.');
M('C1.18-05', 'What is the same for all the elements in one <b>period</b>?',
  ['The number of occupied electron shells', 'The number of outer electrons', 'Their chemical properties', 'Their state at room temperature'],
  'Period = row = number of shells. Group = column = number of outer electrons.');
M('C1.19-04', 'Calcium is in Group 2, Period 4. What is its electronic configuration?',
  ['2.8.8.2', '2.8.2', '2.8.10', '2.2.8.8'],
  'Period 4 → 4 shells. Group 2 → 2 outer electrons. 2 + 8 + 8 + 2 = 20 electrons.');
M('C1.20-04', 'Sulfur dioxide dissolves in water to form an acidic solution. What does this tell you about sulfur?',
  ['It is a non-metal', 'It is a metal', 'It is a noble gas', 'It is a transition metal'],
  'Non-metal oxides are acidic.');
T('C1.20-05', 'All metals are good conductors of electricity.', true,
  'True. Conducting electricity is one way to identify a metal. (Graphite is a non-metal that conducts, but it is the main exception.)');
M('C1.21-04', 'Which of these is a <b>metal</b>?',
  ['Calcium', 'Chlorine', 'Phosphorus', 'Argon'],
  'Calcium is in Group 2, on the left of the table.');
MH('C1.21-05', 'Element Q is in Group 6, Period 3. Is it a metal or a non-metal?',
  ['A non-metal (it is sulfur)', 'A metal (it is magnesium)', 'A metal (it is aluminium)', 'A non-metal (it is oxygen)'],
  'Group 6 is on the right of the table. Group 6, Period 3 is sulfur.');
M('C1.22-04', 'An element has 3 occupied shells and 7 outer electrons. Which element is it?',
  ['Chlorine', 'Fluorine', 'Nitrogen', 'Argon'],
  'Period 3, Group 7 = chlorine (2.8.7). Fluorine is Period 2.');
M('C1.23-04', 'Fluorine, chlorine and bromine all react with sodium in a similar way. Why?',
  ['They all have 7 outer electrons', 'They all have the same number of shells', 'They are all gases at room temperature', 'They all have the same mass'],
  'Same group = same number of outer electrons = similar reactions.');
MH('C1.23-05', 'Rubidium is below potassium in Group 1. Predict how rubidium reacts with water.',
  ['It reacts in a similar way, making an alkali and hydrogen', 'It does not react at all, because it is lower in the group', 'It reacts like a noble gas, because it has a full outer shell', 'It reacts to make an acidic solution and oxygen gas'],
  'Elements in the same group have similar chemical properties because they have the same number of outer electrons.');
M('C1.24-04', 'Why does helium not react even though it has only 2 electrons?',
  ['Its only shell is full, and the first shell holds just 2', 'It has no protons in its nucleus to attract electrons', 'It is too light and small to collide with other atoms', 'Its 2 electrons are already shared with other atoms'],
  'A full outer shell is stable, whether it holds 2 or 8 electrons.');
T('C1.24-05', 'Noble gases exist as single atoms because they do not readily form bonds.', true,
  'True. With full outer shells, noble gas atoms do not need to bond.');
M('C1.26-03', 'What is the Mr of sulfuric acid, H₂SO₄? (H = 1, S = 32, O = 16)',
  ['98', '49', '50', '96'],
  '(2 × 1) + 32 + (4 × 16) = 2 + 32 + 64 = <b>98</b>.');
MH('C1.26-04', 'What is the Mr of ammonium sulfate, (NH₄)₂SO₄? (N = 14, H = 1, S = 32, O = 16)',
  ['132', '114', '118', '214'],
  '2 × (14 + 4) + 32 + 64 = 36 + 32 + 64 = <b>132</b>.');
M('C1.27-03', 'What is the mass of one mole of sodium atoms? (Na = 23)',
  ['23 g', '1 g', '11 g', '46 g'],
  'One mole of an element has a mass in grams equal to its Ar.');
M('C1.27-04', 'One mole of water (H₂O) has a mass of…',
  ['18 g', '3 g', '10 g', '16 g'],
  'Mr = (2 × 1) + 16 = 18, so one mole has a mass of 18 g.');
TH('C1.27-05', 'One mole of oxygen molecules (O₂) has the same mass as one mole of oxygen atoms (O).', false,
  'False. One mole of O₂ has a mass of 32 g; one mole of O atoms has a mass of 16 g.');
M('C1.28-03', 'Which equation links moles, mass and Mr?',
  ['moles = mass ÷ Mr', 'moles = Mr ÷ mass', 'moles = mass × Mr', 'moles = mass − Mr'],
  'Rearranged: mass = moles × Mr.');
MH('C1.28-04', 'Which sample contains the most moles? (Mr: H₂O 18, CO₂ 44, NaCl 58.5)',
  ['They all contain the same number of moles', '29.25 g of sodium chloride, because it has the biggest mass', '9 g of water, because water has the smallest Mr', '22 g of carbon dioxide, because it is a gas'],
  'Water: 9 ÷ 18 = 0.5 mol. CO₂: 22 ÷ 44 = 0.5 mol. NaCl: 29.25 ÷ 58.5 = 0.5 mol. A bigger mass does not always mean more moles.');
M('C1.29-03', 'Fe₂O₃ + 3CO → 2Fe + 3CO₂. How many moles of iron are made from 1 mole of Fe₂O₃?',
  ['2 mol', '1 mol', '3 mol', '0.5 mol'],
  'The equation shows 1 Fe₂O₃ : 2 Fe.');
T('C1.29-04', 'In a reaction, the total mass of the products equals the total mass of the reactants.', true,
  'True. Atoms are not created or destroyed, only rearranged (conservation of mass).');
M('C1.30-03', 'What is the formula for percentage yield?',
  ['actual yield ÷ theoretical yield × 100', 'theoretical yield ÷ actual yield × 100', 'actual yield − theoretical yield', 'actual yield × theoretical yield ÷ 100'],
  'Percentage yield is always 100% or less.');
T('C1.30-04', 'A percentage yield of 120% means the reaction worked extremely well.', false,
  'False. You cannot get more product than the theoretical yield. Over 100% usually means the product was still wet or impure.');
M('C1.31-03', 'To find the formula of copper(II) oxide, it is heated in a stream of hydrogen or methane. What is left at the end?',
  ['Copper', 'Copper(II) oxide', 'Water', 'Copper hydroxide'],
  'The oxygen is removed (reduction). The mass lost is the mass of oxygen.');
MH('C1.31-04', 'Hydrated copper(II) sulfate (blue) is heated. 2.50 g becomes 1.60 g of white anhydrous solid. What mass of water was lost?',
  ['0.90 g', '1.60 g', '2.50 g', '4.10 g'],
  '2.50 − 1.60 = <b>0.90 g</b> of water of crystallisation.');
M('C1.31-05', 'Why is the crucible lid kept on (lifted only briefly) when heating magnesium?',
  ['To stop magnesium oxide escaping, which would make the mass too low', 'To stop any air getting in, so the magnesium does not burn', 'To make the magnesium burn faster and more completely', 'To keep the crucible cool enough to pick up safely'],
  'Losing some white MgO smoke would give a mass of oxide that is too small.');
M('C1.32-03', 'What is a <b>molecular formula</b>?',
  ['The actual number of atoms of each element in one molecule', 'The simplest whole-number ratio of atoms of each element', 'The formula of an ion, showing its charge as well', 'A diagram showing every bond between the atoms'],
  'Ethene: molecular formula C₂H₄, empirical formula CH₂.');
M('C1.32-04', 'Which compound has the same empirical and molecular formula?',
  ['Methane, CH₄', 'Ethane, C₂H₆', 'Glucose, C₆H₁₂O₆', 'Hydrogen peroxide, H₂O₂'],
  'CH₄ cannot be simplified. C₂H₆ → CH₃, C₆H₁₂O₆ → CH₂O, H₂O₂ → HO.');
TH('C1.32-05', 'Ethene (C₂H₄) and propene (C₃H₆) have the same empirical formula.', true,
  'True. Both simplify to CH₂.');
M('C1.33-03', 'A compound is 40 g calcium (Ar 40), 12 g carbon (Ar 12) and 48 g oxygen (Ar 16). What is its empirical formula?',
  ['CaCO₃', 'CaCO', 'CaC₂O₃', 'Ca₂CO₃'],
  'Ca 1 mol, C 1 mol, O 3 mol → <b>CaCO₃</b>.');
MH('C1.33-04', 'A compound has the empirical formula CH and an Mr of 78. What is its molecular formula?',
  ['C₆H₆', 'CH', 'C₃H₃', 'C₆H₁₂'],
  'CH has a mass of 13. 78 ÷ 13 = 6, so <b>C₆H₆</b> (benzene).');
M('C1.36-04', 'In the copper(II) oxide reduction experiment, why is the hydrogen (or methane) left flowing while the copper cools?',
  ['To stop the hot copper reacting with air and turning back into oxide', 'To cool the copper down faster so it can be weighed sooner', 'To push any remaining water vapour out so it can be weighed', 'To make more copper form from the hydrogen gas'],
  'Hot copper would re-oxidise if air got in.');
T('C1.36-05', 'When magnesium is burned to make magnesium oxide, the mass of the solid decreases.', false,
  'False. The mass <b>increases</b>, because oxygen from the air combines with the magnesium.');
M('C1.40-05', 'In a dot-and-cross diagram for sodium chloride, what does the chloride ion look like?',
  ['[Cl]⁻ with 8 outer electrons: 7 dots and 1 cross', '[Cl]⁺ with 6 outer electrons', 'Cl with 7 outer electrons and no charge', '[Cl]²⁻ with 8 crosses'],
  'Chlorine’s 7 electrons are shown as one symbol; the electron gained from sodium is the other symbol.');
M('C1.41-04', 'Why does a positive sodium ion attract a negative chloride ion?',
  ['Opposite charges attract (electrostatic attraction)', 'They share a pair of electrons between them', 'Both ions are magnetic, so they pull together', 'The heavier ion pulls the lighter one by gravity'],
  'An ionic bond is the electrostatic attraction between oppositely charged ions.');
T('C1.41-05', 'An ionic bond is a shared pair of electrons between two ions.', false,
  'False. That describes a covalent bond. An ionic bond is the electrostatic attraction between oppositely charged ions.');
M('C1.42-04', 'Which property do giant ionic compounds usually have?',
  ['High melting and boiling points', 'Low melting points', 'They are gases at room temperature', 'They are soft and slippery'],
  'Lots of energy is needed to overcome the strong attractions throughout the lattice.');
T('C1.42-05', 'Sodium chloride is a solid at room temperature because its ions are held strongly in a giant lattice.', true,
  'True. Its melting point is 801 °C.');
T('C1.43-04', 'Sodium chloride solution does not conduct electricity.', false,
  'False. When it is dissolved, the ions are free to move and carry charge, so the solution conducts.');
MH('C1.43-05', 'Why does solid sodium chloride not conduct, even though it is made of charged particles?',
  ['The ions are held in fixed positions and cannot move', 'It has no charged particles at all when it is solid', 'Its electrons are all used up in covalent bonds', 'The positive and negative ions cancel each other out'],
  'Charged particles must be free to move for a current to flow.');
M('C1.44-04', 'How many electrons are shared in a <b>double</b> covalent bond?',
  ['4', '2', '1', '8'],
  'A double bond is two shared pairs = 4 electrons.');
M('C1.44-05', 'In a molecule of hydrogen chloride (HCl), how many pairs of electrons are shared?',
  ['1', '2', '7', '8'],
  'H and Cl each need one more electron, so they share one pair: a single bond.');
M('C1.45-04', 'Why are the atoms in a covalent bond held strongly together?',
  ['Both positive nuclei are attracted to the negative shared electrons', 'A positive ion and a negative ion are attracted to each other', 'The two positive nuclei are attracted directly to each other', 'The shared electrons repel each other and push the atoms together'],
  'This electrostatic attraction is strong, so covalent bonds are strong.');
MH('C1.45-05', 'Which statement about covalent bonds is correct?',
  ['They are strong, and hold atoms by attraction to a shared pair', 'They are weak, which is why simple molecules melt easily', 'They form when electrons are transferred from metal to non-metal', 'They only form between metal atoms in a sea of electrons'],
  'Covalent bonds are strong. Simple molecular substances melt easily because the forces between molecules are weak, not the bonds.');
M('C1.47-04', 'Which is most likely to be a simple molecular substance?',
  ['A liquid that boils at 80 °C and does not conduct', 'A hard solid that only melts above 1500 °C', 'A solid that conducts electricity when molten', 'A shiny solid that conducts when solid'],
  'Low boiling point + no conduction = simple molecular.');
T('C1.47-05', 'Simple molecular substances are often gases or liquids at room temperature.', true,
  'True. Weak intermolecular forces need little energy to overcome.');
M('C1.48-04', 'Which has the higher boiling point, ethane (C₂H₆, Mr 30) or pentane (C₅H₁₂, Mr 72)?',
  ['Pentane', 'Ethane', 'They are the same', 'It depends on the container'],
  'Pentane has a higher Mr and stronger intermolecular forces.');
T('C1.48-05', 'Larger simple molecules generally have higher boiling points.', true,
  'True. Intermolecular forces get stronger as relative molecular mass increases.');
M('C1.49-04', 'Silicon dioxide (sand) has a very high melting point. Why?',
  ['It has a giant covalent structure with many strong bonds to break', 'It has strong intermolecular forces between its small molecules', 'It is made of ions held in a giant lattice by strong attractions', 'It has delocalised electrons that hold its atoms tightly together'],
  'Silicon dioxide, like diamond, is a giant covalent structure.');
T('C1.49-05', 'Substances with giant covalent structures are usually solids at room temperature.', true,
  'True. A very large amount of energy is needed to break all their covalent bonds.');
M('C1.51-04', 'Which of these conducts electricity?',
  ['Graphite', 'Diamond', 'Sulfur', 'Water ice'],
  'Graphite has delocalised electrons. Most covalent substances do not conduct.');
T('C1.51-05', 'Pure water is a good conductor of electricity.', false,
  'False. Pure water is a covalent substance and is a very poor conductor. Tap water conducts slightly because of dissolved ions.');

/* ===================== Top-up to ≥5 per point: Physics (added 7 Nov 2026) ===================== */
MH('P3.2-05', 'A slinky spring is pushed and pulled along its length. Which kind of wave is this, and why?',
  ['Longitudinal: the coils move back and forth along the direction the wave travels', 'Transverse: the coils move up and down at right angles to the wave', 'Longitudinal: the coils move up and down at right angles to the wave', 'Transverse: the coils move along the direction the wave travels'],
  'Pushing and pulling along the length makes compressions and rarefactions.');
M('P3.4-04', 'Which of these shows that waves can transfer <b>information</b>?',
  ['A radio receiving a broadcast', 'A ball rolling down a hill', 'Water flowing in a river', 'Wind blowing leaves'],
  'Radio waves carry information from the transmitter to the receiver without any matter travelling.');
T('P3.4-05', 'When a sound wave travels across a room, the air particles move from one side of the room to the other.', false,
  'False. The particles vibrate about fixed positions. Only the energy travels across the room.');
M('P3.6-04', 'A pendulum swings back and forth 5 times every second. What is its time period?',
  ['0.2 s', '5 s', '0.5 s', '2 s'],
  'f = 5 Hz, so T = 1 ÷ 5 = <b>0.2 s</b>.');
M('P3.7-04', 'A sound wave has a frequency of 680 Hz in air, where sound travels at 340 m/s. What is its wavelength?',
  ['0.5 m', '2 m', '231 200 m', '1020 m'],
  'λ = v ÷ f = 340 ÷ 680 = <b>0.5 m</b>.');
M('P3.8-05', 'A car sounds its horn as it drives past you. How does the pitch change?',
  ['Higher as it approaches, then lower as it moves away', 'Lower as it approaches, then higher as it moves away', 'It stays the same the whole time', 'It gets higher the whole time'],
  'Doppler effect: shorter wavelength in front of a moving source, longer behind it.');
M('P3.9-05', 'Which of these is an example of <b>reflection</b>?',
  ['An echo from a cliff', 'A straw looking bent in water', 'A rainbow from a prism', 'A swimming pool looking shallower than it is'],
  'The other three are caused by refraction.');
M('P3.10-04', 'What is the speed of all electromagnetic waves in free space?',
  ['3 × 10⁸ m/s', '340 m/s', '3 × 10⁶ m/s', 'It depends on the wave'],
  '300 000 000 m/s. 340 m/s is roughly the speed of sound in air.');
M('P3.10-05', 'Which of these is <b>not</b> part of the electromagnetic spectrum?',
  ['Sound waves', 'Microwaves', 'Ultraviolet', 'X-rays'],
  'Sound is a longitudinal mechanical wave. The EM spectrum: radio, microwave, infrared, visible, UV, x-ray, gamma.');
M('P3.14-04', 'What kind of wave is light?',
  ['Transverse', 'Longitudinal', 'Mechanical', 'Sound'],
  'Light is an electromagnetic wave, and all electromagnetic waves are transverse.');
T('P3.14-05', 'Light can be reflected but not refracted.', false,
  'False. Light can be reflected (mirrors) and refracted (lenses, glass blocks).');
M('P3.15-04', 'The angle between the incident ray and the reflected ray is 80°. What is the angle of incidence?',
  ['40°', '80°', '160°', '10°'],
  'The normal is halfway between them, so each angle is 80 ÷ 2 = <b>40°</b>.');
M('P3.16-04', 'On a ray diagram, what is the <b>normal</b>?',
  ['A line at 90° to the surface where the ray hits', 'A line drawn along the surface of the mirror', 'The path that the reflected ray travels along', 'A line joining the light source to the mirror'],
  'Angles are always measured between the ray and the normal.');
MH('P3.16-05', 'A ray passes through a rectangular glass block at an angle. How does the ray leaving the block compare with the ray entering it?',
  ['It is parallel to the entering ray but shifted sideways', 'It travels back the way it came', 'It bends further from the original direction', 'It travels along the surface of the block'],
  'It bends towards the normal going in and away from the normal by the same amount coming out.');
M('P3.17-04', 'In the refraction practical with a rectangular block, what should you draw first on the paper?',
  ['The outline of the block and a normal where the ray enters', 'The refracted ray inside the block, using a ruler', 'The angle of refraction, measured with a protractor', 'The critical angle, marked on the far side of the block'],
  'You need the outline and normal to measure the angles of incidence and refraction.');
MH('P3.17-05', 'Why is the experiment best done in a darkened room?',
  ['So the thin ray of light can be seen clearly and marked accurately', 'Because light refracts by a larger angle when it is dark', 'To stop the glass block getting hot from the room lights', 'So the ray box uses less electricity during the experiment'],
  'A clear, thin ray gives more accurate marks and angle measurements.');
M('P3.18-03', 'Light enters water (n = 1.33) at an angle. What does the refractive index tell you?',
  ['How much the light slows down and bends in the water', 'How much of the light is reflected by the water surface', 'How much light the water absorbs before it reaches the bottom', 'How quickly the water moves when the light shines on it'],
  'A bigger refractive index means the light slows more and bends more.');
T('P3.18-04', 'A material with a higher refractive index bends light more.', true,
  'True. For the same angle of incidence, the angle of refraction is smaller.');
M('P3.19-04', 'In the glass block practical, why is a protractor needed?',
  ['To measure the angles of incidence and refraction', 'To measure the thickness and width of the glass block', 'To measure how long the ray takes to cross the block', 'To measure the wavelength of the light from the ray box'],
  'You then calculate n = sin i ÷ sin r.');
MH('P3.19-05', 'A student plots sin i (y-axis) against sin r (x-axis). The line has a gradient of 1.5. What is the refractive index?',
  ['1.5', '0.67', '3.0', '1.0'],
  'sin i = n × sin r, so the gradient is n = <b>1.5</b>.');
M('P3.20-04', 'Why are optical fibres useful for endoscopes and communications?',
  ['Light travels along them around bends with very little loss', 'They make light travel faster than it does through air', 'They turn the light into electricity at the far end', 'They split white light into colours to carry more data'],
  'Total internal reflection keeps the light inside the fibre.');
T('P3.20-05', 'Total internal reflection only happens when the angle of incidence is greater than the critical angle.', true,
  'True. And the light must be going from a denser material into a less dense one.');
M('P3.21-04', 'What happens when light in glass hits the boundary at <b>less</b> than the critical angle?',
  ['Most of it refracts out into the air, bending away from the normal', 'All of it is totally internally reflected back into the glass', 'It travels exactly along the boundary between glass and air', 'It is absorbed by the glass and turns into heat energy'],
  'Only above the critical angle is all the light reflected.');
T('P3.21-05', 'The critical angle is measured from the normal.', true,
  'True. Like all angles of incidence, it is measured between the ray and the normal.');
M('P3.22-03', 'Material A has a critical angle of 40°; material B has a critical angle of 30°. Which has the higher refractive index?',
  ['B', 'A', 'They are the same', 'You cannot tell'],
  'sin c = 1 ÷ n, so a smaller critical angle means a bigger refractive index.');
T('P3.22-04', 'A material with a refractive index of 1.0 has a critical angle of 90°.', true,
  'True. sin c = 1 ÷ 1 = 1, so c = 90°: total internal reflection could never happen.');
T('P3.23-05', 'Sound waves cannot be refracted.', false,
  'False. Sound changes speed and direction when it passes between materials, e.g. warm and cold air.');
M('P7.2-04', 'Where are the electrons in an atom?',
  ['Outside the nucleus, in shells', 'In the nucleus with the protons', 'In the nucleus with the neutrons', 'Spread evenly through the nucleus'],
  'Protons and neutrons are in the nucleus; electrons are outside it.');
M('P7.3-04', 'Carbon-12 and carbon-14 are isotopes. What is different about them?',
  ['The number of neutrons', 'The number of protons', 'The number of electrons in a neutral atom', 'Their atomic number'],
  'Both have 6 protons. C-12 has 6 neutrons; C-14 has 8.');
TH('P7.3-05', 'Two atoms with the same mass number must be the same element.', false,
  'False. Only the atomic (proton) number decides the element. For example, carbon-14 and nitrogen-14 have the same mass number.');
M('P7.4-04', 'What does <b>ionising</b> radiation do to atoms?',
  ['Knocks electrons off them, turning them into ions', 'Splits their nuclei in two, releasing more neutrons', 'Makes the atoms themselves become radioactive', 'Heats them up until the substance melts or boils'],
  'Removing electrons creates charged ions. This is what damages cells.');
T('P7.4-05', 'Alpha, beta and gamma are all emitted from the nucleus.', true,
  'True. They come from unstable nuclei, not from the electron shells.');
M('P7.6-04', 'In the penetration practical, why is the background count measured first?',
  ['So it can be subtracted from each reading', 'To check the radioactive source is working', 'To give the Geiger counter time to warm up', 'To find the half-life of the source used'],
  'Background radiation is always present.');
M('P7.6-05', 'Which safety step is needed in the penetration practical?',
  ['Handle the source with tongs and put it back in its lead box quickly', 'Wear sunglasses to protect your eyes from the gamma rays', 'Hold the source close to your body so you cannot drop it', 'Leave the source out of its box so you can use it again later'],
  'Distance, short time and shielding reduce the dose.');
M('P7.8-04', 'In a balanced nuclear equation, what must be the same on both sides?',
  ['The total of the mass numbers and the total of the atomic numbers', 'The number of nuclei on the left and the number on the right', 'The total number of electrons around the nuclei on each side', 'The names and symbols of the elements on each side'],
  'Mass (top numbers) and charge (bottom numbers) are conserved.');
MH('P7.8-05', 'Strontium-90 (<span class="nuc"><sup>90</sup><sub>38</sub>Sr</span>) decays by beta emission. What nucleus is formed?',
  ['<span class="nuc"><sup>90</sup><sub>39</sub>Y</span>', '<span class="nuc"><sup>90</sup><sub>37</sub>Rb</span>', '<span class="nuc"><sup>86</sup><sub>36</sub>Kr</span>', '<span class="nuc"><sup>89</sup><sub>38</sub>Sr</span>'],
  'Beta: mass number stays 90, atomic number goes up by 1 to 39 (yttrium).');
M('P7.9-04', 'What does a Geiger-Müller tube measure?',
  ['The count rate of ionising radiation', 'The temperature of a radioactive source', 'The mass of the source in grams', 'The half-life of the source directly'],
  'It clicks or counts each time ionising radiation passes through it.');
T('P7.9-05', 'A Geiger-Müller detector protects you by stopping ionising radiation.', false,
  'False. It <b>detects</b> ionising radiation; it does not block it.');
M('P7.10-04', 'Which of these is a source of background radiation from the Earth?',
  ['Rocks such as granite', 'Cosmic rays', 'The Sun’s visible light', 'Radio waves'],
  'Some rocks contain radioactive elements, and radon gas seeps out of the ground.');
MH('P7.10-05', 'Why do airline pilots receive a higher dose of background radiation than most people?',
  ['They spend a lot of time high up, where there is less atmosphere to absorb cosmic rays', 'The metal in the plane’s body is slightly radioactive and gives them a dose', 'They breathe more radon gas because the air in the cabin is recycled', 'The jet fuel in the wings is radioactive and gives off gamma rays'],
  'The atmosphere absorbs much of the cosmic radiation, so there is more at high altitude.');
M('P7.12-04', 'A sample contains 1000 unstable nuclei. Its half-life is 2 hours. Roughly how many unstable nuclei are left after 2 hours?',
  ['500', '1000', '250', '0'],
  'One half-life: half of them have decayed.');
MH('P7.12-05', 'Why do scientists use half-life instead of “the time for all the nuclei to decay”?',
  ['Decay is random, so you can’t say when the last nucleus will decay', 'All of the nuclei in a sample decay at exactly the same moment', 'Every radioactive isotope has a half-life of exactly one year', 'The last few nuclei in any sample can never decay at all'],
  'The number left halves every half-life, so it never reaches exactly zero in a predictable time.');
M('P7.13-04', 'A source has a half-life of 5 days. What fraction of its activity is left after 15 days?',
  ['1/8', '1/3', '1/4', '1/16'],
  '15 days = 3 half-lives: ½ × ½ × ½ = <b>1/8</b>.');
M('P7.14-05', 'Which radiation is used to sterilise medical equipment?',
  ['Gamma rays', 'Alpha particles', 'Beta particles', 'Neutrons'],
  'Gamma passes through the packaging and kills microorganisms.');
T('P7.15-04', 'Irradiation stops as soon as you move away from the source.', true,
  'True. Contamination is different: the radioactive material stays on or in you.');
M('P7.15-05', 'Radon gas is breathed in and some decays inside the lungs. Is this contamination or irradiation?',
  ['Contamination', 'Irradiation', 'Neither', 'Both'],
  'The radioactive material is inside the body, so it is contamination.');
T('P7.16-04', 'Ionising radiation can cause mutations in DNA.', true,
  'True. Mutations can lead to cancer.');
MH('P7.16-05', 'How can the risks from radioactive waste be reduced?',
  ['Seal it in containers and store it securely deep underground', 'Dilute it in a large river so the radiation is spread out', 'Burn it in an incinerator to destroy the radioactivity', 'Bury it in shallow pits near towns so it is easy to check'],
  'Long-lived waste must be isolated from people and the environment for a very long time.');
M('P7.17-03', 'Where does the energy released in a nuclear reaction come from?',
  ['The nucleus', 'The electron shells', 'Chemical bonds between atoms', 'Burning the fuel in oxygen'],
  'Nuclear reactions change the nucleus. Chemical reactions involve electrons.');
MH('P7.17-04', 'Compared with burning the same mass of coal, how much energy does nuclear fission release?',
  ['Millions of times more', 'About the same amount', 'Much less than coal', 'Exactly twice as much'],
  'Nuclear reactions release vastly more energy per kilogram than chemical reactions.');
M('P7.18-04', 'What does a U-235 nucleus become just after it absorbs a neutron?',
  ['An unstable U-236 nucleus that splits', 'A stable U-234 nucleus that stays whole', 'A helium nucleus and two free protons', 'A U-235 ion with an extra negative charge'],
  'Absorbing the neutron makes U-236, which is very unstable and splits.');
T('P7.18-05', 'In fission, two small nuclei join to make a larger nucleus.', false,
  'False. That is fusion. In fission a large nucleus splits into two smaller nuclei.');
M('P7.19-03', 'Roughly how many neutrons are released in one fission of U-235?',
  ['2 or 3', 'None', 'About 100', 'Exactly 1'],
  'Usually two or three. These can go on to cause more fissions.');
MH('P7.19-04', 'Why must used nuclear fuel be handled as radioactive waste?',
  ['It contains radioactive daughter nuclei made by fission', 'It has all turned into lead, which is a toxic metal', 'It contains no uranium at all, so it cannot be reused', 'It has become extremely cold after leaving the reactor'],
  'The fission products are unstable and emit radiation.');
T('P7.19-05', 'Fission of U-235 always produces the same two daughter nuclei.', false,
  'False. Many different pairs of daughter nuclei are possible.');
M('P7.20-03', 'Why is a chain reaction possible in uranium-235?',
  ['Each fission releases neutrons that can cause more fissions', 'Uranium atoms are strongly attracted to each other', 'Each fission releases protons that split other nuclei', 'Uranium is a metal, so it conducts the energy along'],
  'One neutron in, 2–3 neutrons out.');
T('P7.20-04', 'In a nuclear power station, the chain reaction is controlled so that on average one neutron from each fission causes another fission.', true,
  'True. This keeps the rate of fission (and heat output) steady.');
MH('P7.20-05', 'What would happen to a chain reaction if most neutrons escaped from the fuel without hitting U-235 nuclei?',
  ['It would die out', 'It would speed up', 'It would become fusion', 'It would carry on at the same rate'],
  'Fewer than one new fission per fission means the reaction stops.');
M('P7.21-05', 'What is the moderator usually made of?',
  ['Graphite or water', 'Boron or cadmium', 'Lead', 'Concrete'],
  'Boron and cadmium absorb neutrons, so they are used in control rods.');
M('P7.22-03', 'What is the shielding around a reactor made of?',
  ['Thick steel and concrete', 'Thin aluminium foil', 'Plastic and glass', 'Paper and cardboard'],
  'Thick, dense materials absorb gamma rays and neutrons.');
T('P7.22-04', 'The shielding around a reactor stops radiation escaping to the surroundings.', true,
  'True. It protects workers and the public.');
M('P7.22-05', 'Who does the shielding around a nuclear reactor mainly protect?',
  ['Workers and the public near the reactor', 'The uranium fuel inside the core', 'The control rods and the moderator', 'The neutrons inside the reactor'],
  'It absorbs radiation that would otherwise escape from the core.');
M('P7.23-03', 'Which process happens in the core of the Sun?',
  ['Fusion', 'Fission', 'Alpha decay', 'Combustion'],
  'Hydrogen nuclei fuse to make helium.');
M('P7.23-04', 'Which uses large, heavy nuclei as its fuel?',
  ['Fission', 'Fusion', 'Both', 'Neither'],
  'Fission splits heavy nuclei like U-235. Fusion joins light nuclei like hydrogen.');
TH('P7.23-05', 'Both fission and fusion release energy.', true,
  'True. Fission releases energy by splitting heavy nuclei; fusion by joining light ones.');
M('P7.24-03', 'Which nuclei fuse in the Sun?',
  ['Hydrogen nuclei, making helium', 'Uranium nuclei, making barium', 'Helium nuclei, making hydrogen', 'Carbon nuclei, making oxygen'],
  'Hydrogen nuclei join to form helium nuclei.');
T('P7.24-04', 'In fusion, a large nucleus splits into smaller nuclei.', false,
  'False. That is fission. In fusion, smaller nuclei join to make a larger nucleus.');
MH('P7.24-05', 'Which statement about the mass in fusion is correct?',
  ['The mass of the products is slightly less than the mass of the nuclei that fused', 'The mass of the products is more than the mass of the nuclei that fused', 'The mass is exactly the same before and after', 'All the mass is turned into energy'],
  'A small loss of mass goes with the release of energy.');
M('P7.25-02', 'Why do stars give out so much light and heat?',
  ['Fusion in their cores releases huge amounts of energy', 'They are burning huge amounts of coal and natural gas', 'Fission of uranium in their cores releases energy', 'They reflect light that comes from other, brighter stars'],
  'Fusion is the energy source for stars.');
T('P7.25-03', 'Stars get their energy from nuclear fission.', false,
  'False. Stars are powered by nuclear fusion.');
MH('P7.25-04', 'Why can fusion happen in the core of a star?',
  ['The temperature and pressure are extremely high', 'There is a lot of uranium there', 'It is very cold, so nuclei slow down and stick', 'Stars are made of neutrons only'],
  'Only at very high temperatures do nuclei move fast enough to overcome their repulsion.');
M('P7.26-04', 'What force must be overcome for two nuclei to fuse?',
  ['The electrostatic repulsion between their positive charges', 'The magnetic attraction between their spinning protons', 'The gravitational pull of the rest of the star on them', 'The attraction between their electrons and the other nucleus'],
  'Both nuclei are positive, so they repel. They need very high speeds to get close enough.');
T('P7.26-05', 'Higher temperatures make fusion more likely because nuclei move faster.', true,
  'True. Faster nuclei can get close enough to fuse despite repelling each other.');

/* ===================== PHYSICS 1(b) Movement and position (added 7 Nov 2026) ===================== */
M('P1.3-01', 'On a distance–time graph, what does a horizontal (flat) line show?',
  ['The object is stationary', 'The object is moving at a steady speed', 'The object is accelerating', 'The object is slowing down'],
  'Distance is not changing, so the object is not moving.');
M('P1.3-02', 'On a distance–time graph, what does the gradient (slope) show?',
  ['Speed', 'Acceleration', 'Distance travelled', 'Time taken'],
  'Gradient = change in distance ÷ change in time = speed.');
M('P1.3-03', 'On a distance–time graph, two straight lines are drawn for cars A and B. A’s line is steeper. What does this mean?',
  ['A is moving faster than B', 'A is moving slower than B', 'A is accelerating and B is not', 'A has travelled for longer than B'],
  'A steeper gradient means a greater speed.');
MH('P1.3-04', 'A distance–time graph is a curve that gets steeper and steeper. What is the object doing?',
  ['Speeding up (accelerating)', 'Moving at a constant speed', 'Slowing down', 'Standing still'],
  'An increasing gradient means increasing speed.');
T('P1.3-05', 'A straight sloping line on a distance–time graph shows a constant speed.', true,
  'True. A constant gradient means a constant speed.');
M('P1.4-01', 'A cyclist travels 300 m in 60 s. What is her average speed?',
  ['5 m/s', '18 000 m/s', '0.2 m/s', '240 m/s'],
  'average speed = distance ÷ time = 300 ÷ 60 = <b>5 m/s</b>.');
M('P1.4-02', 'A car travels at an average speed of 20 m/s for 15 s. How far does it go?',
  ['300 m', '1.33 m', '35 m', '0.75 m'],
  'distance = speed × time = 20 × 15 = <b>300 m</b>.');
MH('P1.4-03', 'A runner covers 400 m in 50 s and then another 400 m in 70 s. What is her average speed for the whole run?',
  ['6.7 m/s', '6.9 m/s', '8.0 m/s', '5.7 m/s'],
  'Total distance 800 m ÷ total time 120 s = <b>6.7 m/s</b>. (Averaging the two speeds, 8 and 5.7, gives the wrong answer.)');
M('P1.5-01', 'In an experiment to find the average speed of a toy car, what must you measure?',
  ['The distance travelled and the time taken', 'The mass of the car and the time taken', 'The force on the car and its mass', 'Only the time taken'],
  'average speed = distance moved ÷ time taken.');
M('P1.5-02', 'How could you make your measurement of the time for a toy car to travel 1 m more accurate?',
  ['Use light gates connected to a timer instead of a stopwatch', 'Use a longer and heavier toy car on the same track', 'Measure the distance with a shorter ruler marked in cm', 'Only do the test once, so the car does not wear out'],
  'Light gates remove human reaction time from the timing.');
T('P1.5-03', 'Repeating a timing and taking the mean makes the result more reliable.', true,
  'True. Averaging reduces the effect of random errors, such as reaction time.');
MH('P1.5-04', 'A student drops a tennis ball and times its fall with a stopwatch. Why is the measured time likely to be too long?',
  ['Her reaction time delays stopping the watch', 'The ball speeds up as it falls to the floor', 'Air resistance on the ball is zero indoors', 'The stopwatch always starts before she drops it'],
  'There is a delay between seeing the ball land and pressing stop.');
M('P1.6-01', 'A car speeds up from 0 to 20 m/s in 4 s. What is its acceleration?',
  ['5 m/s²', '80 m/s²', '0.2 m/s²', '24 m/s²'],
  'a = (v − u) ÷ t = (20 − 0) ÷ 4 = <b>5 m/s²</b>.');
M('P1.6-02', 'What is the unit of acceleration?',
  ['m/s²', 'm/s', 'N/kg', 'm²/s'],
  'Acceleration is change in velocity (m/s) per second: m/s².');
M('P1.6-03', 'A bus slows from 15 m/s to 5 m/s in 5 s. What is its acceleration?',
  ['−2 m/s²', '2 m/s²', '−4 m/s²', '50 m/s²'],
  'a = (5 − 15) ÷ 5 = <b>−2 m/s²</b>. The minus sign shows it is slowing down (decelerating).');
MH('P1.6-04', 'A ball accelerates at 3 m/s² from rest for 4 s. What is its final velocity?',
  ['12 m/s', '0.75 m/s', '7 m/s', '1.33 m/s'],
  'v = u + a × t = 0 + 3 × 4 = <b>12 m/s</b>.');
M('P1.7-01', 'On a velocity–time graph, what does a horizontal line above the time axis show?',
  ['Constant velocity', 'The object is stationary', 'Constant acceleration', 'The object is slowing down'],
  'Velocity is not changing, so acceleration is zero. (On a distance–time graph a flat line means stationary.)');
M('P1.7-02', 'On a velocity–time graph, what does a straight line sloping downwards show?',
  ['Constant deceleration', 'Constant velocity', 'The object is stationary', 'Increasing acceleration'],
  'Velocity is decreasing steadily.');
T('P1.7-03', 'A velocity–time graph and a distance–time graph of the same journey look the same.', false,
  'False. They show different things: e.g. constant speed is a sloping line on a distance–time graph but a flat line on a velocity–time graph.');
MH('P1.7-04', 'A velocity–time graph shows a line sloping up, then flat, then sloping down to zero. Describe the motion.',
  ['Speeds up, travels at constant velocity, then slows to a stop', 'Goes up a hill, along the top, then down the other side', 'Stationary, then moving, then stationary', 'Slows down, stops, then speeds up'],
  'A velocity–time graph shows how velocity changes, not the shape of the route.');
M('P1.8-01', 'How do you find acceleration from a velocity–time graph?',
  ['Calculate the gradient', 'Find the area under the line', 'Read the highest point', 'Measure the length of the line'],
  'Gradient = change in velocity ÷ time = acceleration.');
M('P1.8-02', 'On a velocity–time graph, the line rises from 2 m/s to 10 m/s over 4 s. What is the acceleration?',
  ['2 m/s²', '2.5 m/s²', '3 m/s²', '32 m/s²'],
  'gradient = (10 − 2) ÷ 4 = <b>2 m/s²</b>.');
T('P1.8-03', 'A steeper line on a velocity–time graph means a greater acceleration.', true,
  'True. The gradient is the acceleration.');
M('P1.9-01', 'How do you find the distance travelled from a velocity–time graph?',
  ['Find the area under the line', 'Calculate the gradient', 'Read the final velocity', 'Multiply the gradient by the time'],
  'Area between the line and the time axis = distance travelled.');
M('P1.9-02', 'A car travels at a constant 15 m/s for 10 s. What area is under its velocity–time graph for this time?',
  ['150 m', '1.5 m', '25 m', '0.67 m'],
  'Rectangle: 15 × 10 = <b>150 m</b>, the distance travelled.');
MH('P1.9-03', 'A car accelerates steadily from rest to 20 m/s in 8 s. How far does it travel in this time?',
  ['80 m', '160 m', '2.5 m', '28 m'],
  'The area is a triangle: ½ × 8 × 20 = <b>80 m</b>.');
M('P1.10-01', 'Which equation links final speed, initial speed, acceleration and distance?',
  ['v² = u² + 2as', 'v = u² + 2as', 'v² = u + 2as²', 's = u² + 2av'],
  'v² = u² + (2 × a × s). It is given on the exam paper ("use"), but you must be able to use it.');
M('P1.10-02', 'A ball starts from rest and accelerates at 2 m/s² over 25 m. What is its final speed?',
  ['10 m/s', '100 m/s', '50 m/s', '7.1 m/s'],
  'v² = 0 + 2 × 2 × 25 = 100, so v = √100 = <b>10 m/s</b>.');
MH('P1.10-03', 'A car travelling at 20 m/s brakes and stops in 40 m. What is its deceleration?',
  ['5 m/s²', '10 m/s²', '0.5 m/s²', '2 m/s²'],
  '0 = 20² + 2 × a × 40 → 0 = 400 + 80a → a = −5 m/s². The deceleration is <b>5 m/s²</b>.');

/* ===================== PHYSICS 1(c) Forces, movement, shape and momentum (added 7 Nov 2026) ===================== */
M('P1.11-01', 'Which of these can a force <b>not</b> change about an object on its own?',
  ['Its mass', 'Its speed', 'Its shape', 'Its direction of motion'],
  'Forces change speed, direction or shape. Mass stays the same.');
T('P1.11-02', 'A force can change the shape of an object.', true,
  'True. For example, squashing a ball or stretching a spring.');
M('P1.11-03', 'A footballer kicks a moving ball sideways. Which effect of a force does this show?',
  ['A change of direction', 'A change of mass', 'A change of state', 'No effect at all'],
  'Forces can change speed, direction or shape.');
M('P1.12-01', 'Which force acts between two charged balloons?',
  ['Electrostatic force', 'Gravitational force only', 'Friction', 'Upthrust'],
  'Charged objects attract or repel each other with an electrostatic force.');
M('P1.12-02', 'Which force keeps the Moon in orbit around the Earth?',
  ['Gravitational force', 'Electrostatic force', 'Magnetic force', 'Friction'],
  'Gravity acts between any two masses.');
T('P1.12-03', 'Gravitational and electrostatic forces can act without the objects touching.', true,
  'True. They are non-contact forces. Friction and air resistance are contact forces.');
M('P1.13-01', 'What is the difference between a vector and a scalar quantity?',
  ['A vector has size and direction; a scalar has size only', 'A vector has size only; a scalar has size and direction', 'A vector is always bigger than a scalar', 'A scalar can only be a speed'],
  'For example, velocity is a vector; speed is a scalar.');
M('P1.13-02', 'Which of these is a scalar?',
  ['Speed', 'Velocity', 'Force', 'Acceleration'],
  'Speed has size only. Velocity, force and acceleration all have a direction too.');
MH('P1.13-03', 'A car drives once around a circular track at a steady 20 m/s. Which statement is true?',
  ['Its speed stays the same but its velocity changes', 'Its velocity stays the same but its speed changes', 'Both its speed and velocity stay the same', 'Neither is a vector'],
  'Velocity includes direction, which is constantly changing on a circle.');
T('P1.13-04', 'Distance is a vector quantity.', false,
  'False. Distance is a scalar. Displacement (distance in a stated direction) is the vector.');
M('P1.14-01', 'Why is force a vector quantity?',
  ['It has both size and direction', 'It is measured in newtons', 'It can be very large', 'It always causes movement'],
  'A force of 10 N to the left has a different effect from 10 N to the right.');
T('P1.14-02', 'Force is a scalar quantity.', false,
  'False. Force has size and direction, so it is a vector.');
M('P1.14-03', 'On a force diagram, what does the length of an arrow show?',
  ['The size of the force', 'The mass of the object', 'The speed of the object', 'How long the force lasts'],
  'The arrow’s length shows size; its direction shows the direction of the force.');
M('P1.15-01', 'A box is pushed with 30 N to the right while friction acts with 10 N to the left. What is the resultant force?',
  ['20 N to the right', '40 N to the right', '20 N to the left', '3 N to the right'],
  'Forces in opposite directions subtract: 30 − 10 = <b>20 N</b> in the direction of the bigger force.');
M('P1.15-02', 'Two people push a car in the same direction with 200 N and 300 N. What is the resultant force?',
  ['500 N', '100 N', '250 N', '60 000 N'],
  'Forces in the same direction add.');
MH('P1.15-03', 'An object has a resultant force of zero acting on it. It is moving. What happens?',
  ['It carries on at a constant velocity', 'It gradually slows down and stops', 'It speeds up in the direction it moves', 'It changes direction and turns back'],
  'Balanced forces mean no acceleration: it keeps moving at the same speed in the same direction.');
M('P1.16-01', 'In which direction does friction act on a moving object?',
  ['Opposite to the direction of motion', 'In the same direction as the motion', 'Always straight down, towards the ground', 'Always upwards, away from the ground'],
  'Friction opposes motion.');
T('P1.16-02', 'Air resistance is a type of friction.', true,
  'True. It opposes the motion of objects moving through air.');
M('P1.16-03', 'Why do car tyres have tread?',
  ['To increase friction with the road so the car can grip and brake', 'To reduce friction with the road so the car can go faster', 'To make the tyres lighter so the car uses less fuel', 'To reduce air resistance on the wheels at high speed'],
  'Friction between tyres and road lets a car accelerate, turn and stop.');
M('P1.17-01', 'What resultant force makes a 1200 kg car accelerate at 2 m/s²?',
  ['2400 N', '600 N', '1202 N', '0.0017 N'],
  'F = m × a = 1200 × 2 = <b>2400 N</b>.');
M('P1.17-02', 'A 5 kg trolley has a resultant force of 20 N on it. What is its acceleration?',
  ['4 m/s²', '100 m/s²', '0.25 m/s²', '15 m/s²'],
  'a = F ÷ m = 20 ÷ 5 = <b>4 m/s²</b>.');
MH('P1.17-03', 'The same force acts on a full trolley and an empty trolley. Which accelerates more, and why?',
  ['The empty one: a smaller mass gives a bigger acceleration', 'The full one: a bigger mass gives a bigger acceleration', 'Both the same: the same force gives the same acceleration', 'The full one: its extra weight pushes it forwards'],
  'a = F ÷ m, so a smaller mass gives a bigger acceleration.');
M('P1.18-01', 'What is the weight of a 50 kg person on Earth? (g = 10 N/kg)',
  ['500 N', '5 N', '50 N', '60 N'],
  'W = m × g = 50 × 10 = <b>500 N</b>.');
M('P1.18-02', 'What is the difference between mass and weight?',
  ['Mass is the amount of matter (kg); weight is the force of gravity on it (N)', 'Mass is the force of gravity on it (N); weight is the amount of matter (kg)', 'They are the same quantity, just measured in different units', 'Weight never changes, but mass depends on the gravitational field'],
  'Your mass is the same on the Moon, but your weight is less.');
MH('P1.18-03', 'An astronaut has a mass of 80 kg. On the Moon, g = 1.6 N/kg. What is her weight there?',
  ['128 N', '800 N', '80 N', '50 N'],
  'W = 80 × 1.6 = <b>128 N</b>. Her mass is still 80 kg.');
T('P1.18-04', 'Your mass is smaller on the Moon than on Earth.', false,
  'False. Mass stays the same. Your weight is smaller because the Moon’s gravitational field strength is lower.');
M('P1.19-01', 'What is the stopping distance of a car?',
  ['Thinking distance + braking distance', 'Thinking distance − braking distance', 'Braking distance only', 'The distance before the driver sees a hazard'],
  'Thinking distance: travelled during the driver’s reaction time. Braking distance: travelled once the brakes are on.');
M('P1.19-02', 'What is <b>thinking distance</b>?',
  ['The distance travelled during the driver’s reaction time', 'The distance travelled while the brakes are applied', 'The distance to the hazard', 'The total stopping distance'],
  'The car keeps moving at full speed while the driver reacts.');
T('P1.19-03', 'Braking distance is the distance travelled while the driver is reacting.', false,
  'False. That is thinking distance. Braking distance is travelled after the brakes are applied.');
M('P1.20-01', 'Which factor increases the <b>thinking</b> distance?',
  ['The driver being tired', 'Worn brake pads', 'An icy road surface', 'Bald, worn tyres'],
  'Tiredness, alcohol, drugs and distractions increase reaction time. The others affect braking distance.');
M('P1.20-02', 'Which factor increases the <b>braking</b> distance?',
  ['A wet or icy road', 'The driver using a phone', 'The driver drinking alcohol', 'The driver being tired'],
  'Less friction between tyres and road means a longer braking distance.');
MH('P1.20-03', 'Why does a heavily loaded van need a longer braking distance than an empty one at the same speed?',
  ['A larger mass needs a larger force to decelerate at the same rate', 'The driver of a loaded van always takes longer to react', 'Heavier vans have less friction between the tyres and road', 'The engine of a loaded van pushes it forward while braking'],
  'a = F ÷ m: with the same braking force, a bigger mass decelerates less, so it travels further.');
T('P1.20-04', 'Driving faster increases both thinking distance and braking distance.', true,
  'True. More distance is covered during the reaction time, and there is more kinetic energy to remove when braking.');
M('P1.21-01', 'A skydiver falls at a steady (terminal) velocity. What can you say about the forces on her?',
  ['Air resistance equals her weight', 'Air resistance is greater than her weight', 'Her weight is greater than air resistance', 'There are no forces acting'],
  'Balanced forces → zero resultant force → no acceleration.');
M('P1.21-02', 'Just after a skydiver jumps, why does she accelerate?',
  ['Her weight is bigger than the air resistance', 'Air resistance is bigger than her weight', 'The forces are balanced', 'There is no gravity in the air'],
  'At first she is slow, so air resistance is small and there is a large resultant force downwards.');
MH('P1.21-03', 'Why does a skydiver slow down when she opens her parachute?',
  ['The air resistance becomes much bigger than her weight', 'Her weight decreases', 'Gravity stops acting', 'The parachute pulls her upwards with a magnetic force'],
  'The larger area increases air resistance, giving a resultant force upwards until a new, lower terminal velocity is reached.');
T('P1.21-04', 'At terminal velocity, the resultant force on a falling object is zero.', true,
  'True. Weight and air resistance are balanced.');
M('P1.22-01', 'In the spring experiment, what is the <b>extension</b>?',
  ['The new length minus the original length', 'The new length of the spring', 'The original length of the spring', 'The force added'],
  'Measure the original length first, then subtract it from each new length.');
M('P1.22-02', 'How is the force on a spring changed in the experiment?',
  ['By adding masses (weights) to a hanger', 'By heating the spring with a Bunsen burner', 'By cutting the spring to make it shorter', 'By pulling on it harder with your hand'],
  'Each 100 g mass adds about 1 N of weight.');
MH('P1.22-03', 'How can you make length readings in the spring practical more accurate?',
  ['Read the ruler at eye level, using a pointer on the spring', 'Use the shortest ruler you can, so it is easier to read', 'Add all the masses at once to save time between readings', 'Read the ruler from below so you can see the scale clearly'],
  'Eye level avoids parallax error; a pointer marks the same point each time.');
T('P1.22-04', 'A rubber band gives a straight-line force–extension graph all the way.', false,
  'False. Rubber bands give a curved graph. Springs give a straight line at first.');
M('P1.23-01', 'What does Hooke’s law say?',
  ['Extension is directly proportional to force, up to a limit', 'Extension is always exactly equal to the force applied', 'Extension is inversely proportional to the force applied', 'Extension decreases steadily as the force increases'],
  'This is the initial straight, linear part of the force–extension graph.');
M('P1.23-02', 'A spring obeys Hooke’s law. A 2 N force stretches it by 4 cm. What will a 6 N force stretch it by?',
  ['12 cm', '8 cm', '6 cm', '24 cm'],
  'Force × 3 → extension × 3: 4 × 3 = <b>12 cm</b>.');
MH('P1.23-03', 'On a force–extension graph for a spring, the line is straight and then starts to curve. What does the curve show?',
  ['The spring no longer obeys Hooke’s law', 'The spring is obeying Hooke’s law more closely', 'The spring has become shorter', 'The force has stopped increasing'],
  'Beyond the limit of proportionality, extension is no longer proportional to force.');
M('P1.24-01', 'What is <b>elastic</b> behaviour?',
  ['Returning to the original shape when the force is removed', 'Staying stretched in a new shape after the force is removed', 'Breaking suddenly when only a small force is applied', 'Getting heavier the more it is stretched by a force'],
  'A spring stretched only a little behaves elastically.');
T('P1.24-02', 'If a spring is stretched too far, it may not return to its original shape.', true,
  'True. It has been permanently deformed and no longer behaves elastically.');
M('P1.24-03', 'Which of these shows elastic behaviour?',
  ['A rubber band that goes back to its original length', 'Modelling clay that stays squashed after pressing', 'A drinks can that stays crushed after stepping on it', 'A paperclip that stays bent after being opened out'],
  'The others are permanently deformed (plastic behaviour).');

/* ===================== PHYSICS 2(b) Mains electricity (added 7 Nov 2026) ===================== */
M('P2.2-01', 'What does a <b>fuse</b> do?',
  ['Melts and breaks the circuit if the current gets too big', 'Stores charge so the appliance keeps working in a power cut', 'Increases the current so the appliance works more quickly', 'Connects the metal case to the ground to stop shocks'],
  'This stops wires overheating and catching fire.');
M('P2.2-02', 'Why is the metal case of a kettle connected to the <b>earth wire</b>?',
  ['If the live wire touches the case, current flows to earth and the fuse blows', 'So the kettle heats up faster by drawing extra current from the ground', 'So the kettle uses less energy by sending some current back to earth', 'So the earth wire carries the current back to the power station normally'],
  'Without earthing, the case could become live and give a fatal shock.');
M('P2.2-03', 'What does <b>double insulation</b> mean?',
  ['A plastic case and no exposed metal parts, so no earth wire is needed', 'A cable with two earth wires instead of one, for extra protection', 'A fuse with twice the normal rating, so it never blows by accident', 'Two separate plugs, so the appliance still works if one fails'],
  'Double-insulated appliances have this symbol: a square inside a square.');
MH('P2.2-04', 'What is one advantage of a circuit breaker over a fuse?',
  ['It can be reset after it trips, instead of being replaced', 'It lets a bigger current flow safely before it trips', 'It does not need to be connected to the live wire', 'It keeps working even when the electricity is off'],
  'Circuit breakers also switch off faster than fuses.');
T('P2.2-05', 'The fuse is connected in the live wire.', true,
  'True. Then when it melts, the appliance is disconnected from the high voltage.');
M('P2.3-01', 'Why does a resistor get hot when a current flows through it?',
  ['Energy is transferred to thermal energy as charges collide with ions', 'The resistor stores the electrical energy until it is switched off', 'The current flows backwards through it and rubs against the wire', 'The resistor absorbs heat from the air around the circuit'],
  'This heating effect is used in kettles, toasters and electric heaters.');
M('P2.3-02', 'Which appliance makes use of the heating effect of a current?',
  ['A toaster', 'A radio', 'A mobile phone', 'A doorbell'],
  'Also kettles, irons, hair dryers and electric heaters.');
T('P2.3-03', 'The heating effect of a current is always useful.', false,
  'False. It is useful in a kettle, but in wires, computers and light bulbs it wastes energy.');
MH('P2.3-04', 'Why do the cables for an electric cooker need to be thicker than those for a lamp?',
  ['The cooker draws a much larger current, which would overheat thin wires', 'Thick wires look safer, so people are less likely to touch them', 'The cooker uses a lower voltage, so it needs extra copper to carry it', 'Lamps need a higher resistance, so their wires must be thinner'],
  'A larger current produces more heating in a wire, so cookers need low-resistance, thick cables.');
M('P2.4-01', 'A kettle runs on 230 V and draws 10 A. What is its power?',
  ['2300 W', '23 W', '240 W', '0.043 W'],
  'P = I × V = 10 × 230 = <b>2300 W</b>.');
M('P2.4-02', 'A 920 W microwave runs on 230 V. What current does it draw?',
  ['4 A', '211 600 A', '0.25 A', '690 A'],
  'I = P ÷ V = 920 ÷ 230 = <b>4 A</b>.');
MH('P2.4-03', 'A hair dryer is rated 920 W, 230 V. Fuses of 3 A, 5 A and 13 A are available. Which should be fitted?',
  ['5 A', '3 A', '13 A', 'No fuse is needed'],
  'I = 920 ÷ 230 = 4 A. Choose the fuse just above the normal current: 3 A would blow in normal use, and 13 A would let too big a current flow before blowing.');
T('P2.4-04', 'The fuse in a plug should have a rating just above the normal current of the appliance.', true,
  'True. Too small and it blows in normal use; too big and it may not protect the cable.');
M('P2.5-01', 'A 12 V heater draws 2 A for 60 s. How much energy is transferred?',
  ['1440 J', '24 J', '144 J', '720 J'],
  'E = I × V × t = 2 × 12 × 60 = <b>1440 J</b>.');
M('P2.5-02', 'Which equation links energy, current, voltage and time?',
  ['E = I × V × t', 'E = I × R', 'E = I ÷ V × t', 'E = Q ÷ t'],
  'Energy transferred = current × voltage × time.');
MH('P2.5-03', 'A 230 V lamp draws 0.5 A. How much energy does it transfer in 1 minute?',
  ['6900 J', '115 J', '27.6 J', '6.9 J'],
  'E = I × V × t = 0.5 × 230 × 60 = <b>6900 J</b>. Remember to convert minutes to seconds.');
M('P2.6-01', 'What kind of current does a battery supply?',
  ['Direct current (d.c.)', 'Alternating current (a.c.)', 'Both at once', 'Neither'],
  'Direct current flows in one direction only.');
M('P2.6-02', 'What is <b>alternating current</b> (a.c.)?',
  ['Current that keeps changing direction', 'Current that flows in one direction only', 'Current from a battery', 'Current that is always zero'],
  'Mains electricity is a.c.');
T('P2.6-03', 'Mains electricity is direct current.', false,
  'False. Mains electricity is alternating current (a.c.). Cells and batteries supply direct current (d.c.).');
MH('P2.6-04', 'On an oscilloscope, which trace shows direct current from a battery?',
  ['A flat horizontal line above zero', 'A wave going above and below zero', 'A line that keeps reversing', 'A zig-zag that crosses zero'],
  'd.c. stays the same and in one direction. a.c. goes above and below zero.');

/* ===================== PHYSICS 2(c) Energy and voltage in circuits (added 7 Nov 2026) ===================== */
M('P2.7-01', 'Why are lights in a house wired in <b>parallel</b>?',
  ['Each light can be switched separately and gets the full voltage', 'It uses less wire, so it is cheaper to fit in a new house', 'All the lights go off together, which is safer when one breaks', 'It makes the current the same through every light in the house'],
  'In parallel, if one bulb fails the others stay on.');
M('P2.7-02', 'In an old set of fairy lights wired in series, one bulb breaks. What happens?',
  ['All the bulbs go out', 'Only that bulb goes out', 'The other bulbs get brighter', 'Nothing changes'],
  'In series there is only one path, so a break stops the current everywhere.');
MH('P2.7-03', 'Why might a simple torch with one switch and one bulb be wired in series?',
  ['One switch controls everything and only one path is needed', 'So that the bulb gets more current than the cells', 'Because parallel circuits cannot have switches', 'To make the battery last longer than in any other circuit'],
  'Series is fine when you want one switch to control all the components together.');
T('P2.7-04', 'In a parallel circuit, if one branch breaks, the other branches still work.', true,
  'True. Each branch has its own path back to the supply.');
M('P2.8-01', 'In a series circuit, how does the current compare at different points?',
  ['It is the same everywhere', 'It is biggest near the battery', 'It gets used up by each component', 'It is zero after the first bulb'],
  'Current is not used up; it is the same all the way round a series circuit.');
M('P2.8-02', 'More identical bulbs are added in series to a circuit. What happens to the current?',
  ['It decreases', 'It increases', 'It stays the same', 'It becomes zero immediately'],
  'More resistance in series → smaller current for the same voltage.');
MH('P2.8-03', 'In a series circuit, a cell is replaced by one with double the voltage. What happens to the current?',
  ['It doubles (if the resistance stays the same)', 'It halves, because the voltage is shared', 'It stays the same, because current is fixed', 'It goes up four times, because it is squared'],
  'I = V ÷ R, so doubling V doubles I.');
T('P2.8-04', 'Current gets used up as it flows through a bulb.', false,
  'False. The current is the same before and after the bulb. It is energy that is transferred, not current used up.');
M('P2.9-01', 'What does the I–V graph of a resistor at constant temperature look like?',
  ['A straight line through the origin', 'A curve that gets flatter', 'Zero current in one direction', 'A horizontal line'],
  'Current is directly proportional to voltage.');
M('P2.9-02', 'How does the resistance of a filament lamp change as the current increases?',
  ['It increases, because the filament gets hotter', 'It decreases, because the filament gets hotter', 'It stays the same', 'It falls to zero'],
  'That is why its I–V graph curves and gets flatter.');
M('P2.9-03', 'What is special about the I–V graph of a diode?',
  ['Current only flows in one direction', 'It is a straight line through the origin', 'Current flows equally both ways', 'The current is always zero'],
  'A diode has a very high resistance in the reverse direction.');
MH('P2.9-04', 'To investigate how current varies with voltage, where should the voltmeter and ammeter be connected?',
  ['Ammeter in series with it; voltmeter in parallel across it', 'Ammeter and voltmeter both in series with it', 'Ammeter and voltmeter both in parallel across it', 'Ammeter in parallel across it; voltmeter in series'],
  'A variable resistor or variable power supply is used to change the voltage.');
M('P2.10-01', 'The resistance in a circuit is increased. What happens to the current (if the voltage is unchanged)?',
  ['It decreases', 'It increases', 'It stays the same', 'It reverses direction'],
  'More resistance → less current.');
T('P2.10-02', 'Adding a resistor in series makes the current in a circuit smaller.', true,
  'True. The total resistance increases.');
MH('P2.10-03', 'A variable resistor is used to dim a lamp. How does it work?',
  ['Increasing its resistance reduces the current through the lamp', 'Increasing its resistance increases the voltage of the cell', 'It stores energy so the lamp needs less', 'It changes a.c. into d.c.'],
  'Less current means the lamp transfers energy more slowly, so it is dimmer.');
M('P2.11-01', 'How does the resistance of a light-dependent resistor (LDR) change as it gets brighter?',
  ['It decreases', 'It increases', 'It stays the same', 'It becomes infinite'],
  'LDRs are used in circuits that switch lights on automatically when it gets dark.');
M('P2.11-02', 'How does the resistance of a thermistor change as it gets hotter?',
  ['It decreases', 'It increases', 'It stays the same', 'It doubles every degree'],
  'Thermistors are used in temperature sensors, e.g. in fire alarms and thermostats.');
MH('P2.11-03', 'A circuit switches on a street lamp when it gets dark. Which component senses the light level?',
  ['An LDR', 'A thermistor', 'A diode', 'A fuse'],
  'In the dark, the LDR’s resistance rises, which can be used to switch the lamp on.');
T('P2.11-04', 'A thermistor’s resistance increases when it is heated.', false,
  'False. A thermistor’s resistance <b>decreases</b> as its temperature increases.');
M('P2.12-01', 'How can you tell, without a meter, that a current is flowing in a simple circuit?',
  ['A lamp or LED in the circuit lights up', 'The wires change colour as they warm up', 'The battery gets slightly bigger', 'The switch moves on its own'],
  'Lamps and LEDs indicate that a current is flowing.');
M('P2.12-02', 'Why are LEDs often used as indicator lights on electrical equipment?',
  ['They show a current is flowing and use very little energy', 'They make the current bigger so the device works better', 'They protect the circuit by melting, just like a fuse', 'They only work with a.c., so they show mains is connected'],
  'An LED is a light-emitting diode: it lights when current flows through it the right way.');
T('P2.12-03', 'An LED will light up whichever way round it is connected.', false,
  'False. An LED is a diode, so current flows (and it lights) in one direction only.');
M('P2.12-04', 'A lamp in a circuit does not light. Which is a possible reason?',
  ['There is a break in the circuit', 'The current is far too large', 'The cell voltage is too high', 'The wires are too thick'],
  'No current, no light.');
M('P2.13-01', 'A resistor has a current of 2 A through it and a voltage of 12 V across it. What is its resistance?',
  ['6 Ω', '24 Ω', '0.17 Ω', '14 Ω'],
  'R = V ÷ I = 12 ÷ 2 = <b>6 Ω</b>.');
M('P2.13-02', 'A 10 Ω resistor has 0.5 A flowing through it. What is the voltage across it?',
  ['5 V', '20 V', '0.05 V', '10.5 V'],
  'V = I × R = 0.5 × 10 = <b>5 V</b>.');
M('P2.13-03', 'What is the unit of resistance?',
  ['The ohm (Ω)', 'The volt (V)', 'The ampere (A)', 'The watt (W)'],
  'V = I × R, so 1 Ω = 1 V per A.');
MH('P2.13-04', 'A 230 V supply is connected to a heater of resistance 46 Ω. What current flows?',
  ['5 A', '10 580 A', '0.2 A', '184 A'],
  'I = V ÷ R = 230 ÷ 46 = <b>5 A</b>.');
M('P2.14-01', 'What is electric current?',
  ['The rate of flow of charge', 'The energy carried by each charge', 'The force that pushes electrons', 'The amount of charge stored in a battery'],
  'Current = charge ÷ time.');
T('P2.14-02', 'A bigger current means more charge flows past a point each second.', true,
  'True. 1 A = 1 coulomb per second.');
M('P2.14-03', 'Which unit is the same as one ampere?',
  ['One coulomb per second', 'One joule per coulomb', 'One volt per ohm squared', 'One watt per second'],
  'I = Q ÷ t, so 1 A = 1 C/s.');
M('P2.15-01', 'A current of 3 A flows for 20 s. How much charge flows?',
  ['60 C', '6.7 C', '23 C', '0.15 C'],
  'Q = I × t = 3 × 20 = <b>60 C</b>.');
M('P2.15-02', 'What is the unit of charge?',
  ['The coulomb (C)', 'The ampere (A)', 'The joule (J)', 'The volt (V)'],
  'Q = I × t: amps × seconds = coulombs.');
MH('P2.15-03', '1200 C of charge flows through a lamp in 10 minutes. What is the current?',
  ['2 A', '120 A', '12 000 A', '0.5 A'],
  'I = Q ÷ t = 1200 ÷ 600 s = <b>2 A</b>. Convert minutes to seconds first.');
M('P2.16-01', 'In a metal wire, what moves to carry the current?',
  ['Negatively charged electrons', 'Positively charged ions', 'Positively charged protons', 'Uncharged neutrons'],
  'Metals have free (delocalised) electrons that can move.');
T('P2.16-02', 'In a metal wire, the current is a flow of positive charges.', false,
  'False. In metals the charges that move are negatively charged electrons.');
MH('P2.16-03', 'Why do metals conduct electricity well?',
  ['They contain free electrons that can move through the metal', 'Their atoms are positively charged and attract the current', 'They contain ions that are free to move when solid', 'They are always warm, which helps the current flow'],
  'The delocalised electrons can drift through the metal lattice when a voltage is applied.');
M('P2.17-01', '3 A flows into a junction. 1 A leaves along one branch. What current leaves along the other branch?',
  ['2 A', '4 A', '3 A', '1 A'],
  'Current in = current out: 3 = 1 + <b>2 A</b>.');
M('P2.17-02', 'Why is current conserved at a junction?',
  ['Charge can’t be created or destroyed, so what flows in must flow out', 'The junction stores some of the charge, then lets it go later', 'Current is used up at junctions, so the branches carry less', 'Electrons speed up at a junction, so the current stays the same'],
  'The total current into a junction equals the total current out.');
T('P2.17-03', 'The total current entering a junction equals the total current leaving it.', true,
  'True. Current is conserved.');
MH('P2.17-04', 'A parallel circuit has two branches carrying 0.4 A and 0.6 A. What does the ammeter next to the battery read?',
  ['1.0 A', '0.2 A', '0.5 A', '0.24 A'],
  'The branch currents add: 0.4 + 0.6 = <b>1.0 A</b>.');
M('P2.18-01', 'Two lamps are connected in parallel to a 6 V battery. What is the voltage across each lamp?',
  ['6 V', '3 V', '12 V', '0 V'],
  'Components in parallel have the same voltage across them.');
T('P2.18-02', 'Components connected in parallel have the same voltage across them.', true,
  'True. Each branch is connected directly across the supply.');
MH('P2.18-03', 'A 12 V supply has a 4 Ω and a 6 Ω resistor connected in parallel. What is the voltage across the 6 Ω resistor?',
  ['12 V', '7.2 V', '4.8 V', '6 V'],
  'In parallel, every branch has the full supply voltage.');
M('P2.18-04', 'In a parallel circuit, how does the voltage across each branch compare with the supply voltage?',
  ['Each branch has the same voltage as the supply', 'The voltages of the branches add up to the supply', 'Each branch has half the supply voltage', 'The voltage is zero in each branch'],
  'In series the voltages add up; in parallel they are the same.');
M('P2.19-01', 'A 2 Ω and a 4 Ω resistor are in series. What is the total resistance?',
  ['6 Ω', '2 Ω', '8 Ω', '1.33 Ω'],
  'In series, resistances add: 2 + 4 = <b>6 Ω</b>.');
M('P2.19-02', 'A 3 Ω and a 9 Ω resistor are in series with a 6 V battery. What current flows?',
  ['0.5 A', '2 A', '0.67 A', '72 A'],
  'Total R = 12 Ω. I = V ÷ R = 6 ÷ 12 = <b>0.5 A</b>.');
MH('P2.19-03', 'A 2 Ω and a 4 Ω resistor are in series with a 12 V supply. What is the voltage across the 4 Ω resistor?',
  ['8 V', '4 V', '6 V', '12 V'],
  'I = 12 ÷ 6 = 2 A. V = I × R = 2 × 4 = <b>8 V</b>. (The 2 Ω gets the other 4 V.)');
T('P2.19-04', 'In a series circuit, the voltages across the components add up to the supply voltage.', true,
  'True. The energy from the supply is shared between the components.');
M('P2.20-01', 'What is meant by a voltage of 1 volt?',
  ['1 joule of energy transferred per coulomb of charge', '1 coulomb of charge flowing past each second', '1 joule of energy transferred each second', '1 coulomb of charge per joule of energy'],
  'Voltage is energy transferred per unit charge.');
T('P2.20-02', 'A volt is a joule per coulomb.', true,
  'True. Voltage = energy ÷ charge.');
M('P2.20-03', 'A 9 V battery is used. How much energy does each coulomb of charge carry from the battery?',
  ['9 J', '1 J', '0.11 J', '18 J'],
  '9 V means 9 J per coulomb.');
M('P2.21-01', '50 C of charge passes through a 12 V lamp. How much energy is transferred?',
  ['600 J', '4.2 J', '62 J', '0.24 J'],
  'E = Q × V = 50 × 12 = <b>600 J</b>.');
M('P2.21-02', 'Which equation links energy transferred, charge and voltage?',
  ['E = Q × V', 'E = I × R', 'E = Q ÷ t', 'E = V ÷ Q'],
  'Energy transferred = charge × voltage.');
MH('P2.21-03', 'A charge of 30 C transfers 360 J of energy as it passes through a motor. What is the voltage across the motor?',
  ['12 V', '10 800 V', '0.083 V', '390 V'],
  'V = E ÷ Q = 360 ÷ 30 = <b>12 V</b>.');
M('P1.8-04', 'A velocity–time graph has a horizontal line. What is the acceleration?',
  ['Zero', 'Constant and positive', 'Constant and negative', 'Increasing'],
  'A flat line has a gradient of zero, so the velocity is not changing.');
T('P1.9-04', 'The area under a velocity–time graph gives the acceleration.', false,
  'False. The area gives the distance travelled. The gradient gives the acceleration.');
M('P1.11-04', 'A goalkeeper catches a fast ball. Which effect does the force from her gloves have?',
  ['It changes the ball’s speed, slowing it to a stop', 'It changes the ball’s mass', 'It makes the ball heavier', 'It has no effect on the ball'],
  'Forces can change speed (including stopping an object), direction or shape.');
M('P1.12-04', 'Which of these is a <b>contact</b> force?',
  ['Friction', 'Gravitational force', 'Electrostatic force', 'Magnetic force'],
  'Friction needs surfaces to touch. The others act at a distance.');
MH('P1.14-04', 'Two forces of 5 N act on an object. Which statement is correct?',
  ['The resultant could be anything from 0 N to 10 N, depending on their directions', 'The resultant must be 10 N', 'The resultant must be 0 N', 'The resultant must be 5 N'],
  'Because force is a vector, the direction matters: same direction 10 N, opposite directions 0 N.');
TH('P1.16-04', 'Friction always slows objects down, so it is never useful.', false,
  'False. Friction slows things down, but it is also useful: it lets us walk, and lets car tyres grip and brakes work.');
M('P1.19-04', 'A driver sees a hazard. During which part of the stopping distance is the car still travelling at full speed?',
  ['Thinking distance', 'Braking distance', 'Both parts equally', 'Neither part'],
  'The brakes are not yet on while the driver is reacting.');
MH('P1.23-04', 'A spring stretches 3 cm with a 6 N load. Assuming Hooke’s law, what load gives a 5 cm extension?',
  ['10 N', '8 N', '30 N', '2.5 N'],
  'The spring stretches 0.5 cm per newton (3 ÷ 6), so 5 cm needs 5 ÷ 0.5 = <b>10 N</b>.');
T('P1.24-04', 'A material that stays stretched after the force is removed is behaving elastically.', false,
  'False. Elastic behaviour means returning to the original shape. Staying stretched is permanent (plastic) deformation.');
M('P2.10-04', 'Two identical lamps are connected one after the other (in series) instead of one lamp. What happens to the current from the cell?',
  ['It gets smaller', 'It gets bigger', 'It stays the same', 'It doubles'],
  'More resistance in series → smaller current.');
M('P2.14-04', 'What are the units of current, charge and time?',
  ['Amperes, coulombs and seconds', 'Volts, joules and seconds', 'Amperes, joules and minutes', 'Ohms, coulombs and seconds'],
  'Current (A) = charge (C) ÷ time (s).');
M('P2.16-04', 'Why are copper wires used for electrical cables?',
  ['Copper has many free electrons, so it conducts electricity well', 'Copper is a poor conductor, so it is safe to touch', 'Copper contains ions that carry the current', 'Copper is magnetic'],
  'Free (delocalised) electrons make metals like copper good conductors.');
MH('P2.20-04', 'A 6 V battery and a 12 V battery each push 1 C of charge round a circuit. Which statement is correct?',
  ['The 12 V battery gives each coulomb twice as much energy', 'Both give the same energy to each coulomb', 'The 6 V battery gives more energy to each coulomb', 'Voltage has nothing to do with energy'],
  'Voltage = energy per unit charge: 12 J/C compared with 6 J/C.');

/* ===================== CHEMISTRY 2(a) Group 1 (added 7 Nov 2026) ===================== */
M('C2.1-01', 'What are the products when sodium reacts with water?',
  ['Sodium hydroxide and hydrogen', 'Sodium oxide and hydrogen', 'Sodium hydroxide and oxygen', 'Sodium chloride and water'],
  '2Na + 2H₂O → 2NaOH + H₂. The same type of reaction happens with lithium and potassium.');
M('C2.1-02', 'Why are lithium, sodium and potassium called the <b>alkali</b> metals?',
  ['They react with water to form alkaline solutions', 'They are mined from alkaline soils and rocks', 'They form neutral solutions when added to water', 'They react with alkalis to form acidic salts'],
  'The metal hydroxide formed dissolves to give an alkaline solution.');
T('C2.1-03', 'Lithium, sodium and potassium all float on water and fizz as they react.', true,
  'True. They are less dense than water and give off hydrogen. These similar reactions show they are a family.');
M('C2.1-04', 'Universal indicator is added to the water after sodium has reacted with it. What colour does it go?',
  ['Purple', 'Red', 'Green', 'Yellow'],
  'Sodium hydroxide is a strong alkali, so the indicator turns blue/purple.');
MH('C2.1-05', 'Which balanced equation shows potassium reacting with water?',
  ['2K + 2H₂O → 2KOH + H₂', 'K + H₂O → KOH + H₂', '2K + H₂O → K₂O + H₂', 'K + 2H₂O → KOH₂ + H₂'],
  'Two K, four H and two O on each side.');
M('C2.2-01', 'Which is the most reactive: lithium, sodium or potassium?',
  ['Potassium', 'Lithium', 'Sodium', 'They are all equally reactive'],
  'Reactivity increases down Group 1.');
M('C2.2-02', 'Which observation shows that potassium is more reactive than sodium?',
  ['Potassium bursts into a lilac flame; sodium does not catch fire', 'Potassium sinks in water, while sodium floats on the surface', 'Potassium makes an acidic solution; sodium makes an alkali', 'Potassium does not fizz in water, while sodium fizzes a lot'],
  'Lithium fizzes steadily, sodium melts into a ball and whizzes around, potassium ignites.');
MH('C2.2-03', 'Why does reactivity increase down Group 1?',
  ['The outer electron is further from the nucleus, so it is lost more easily', 'The atoms have more outer electrons, so they lose more of them', 'The atoms get smaller, so the outer electron is easier to reach', 'The nucleus attracts the outer electron more strongly further down'],
  'More shells → outer electron further away and more shielded → weaker attraction → lost more easily.');
T('C2.2-04', 'Freshly cut sodium is shiny but quickly goes dull in air.', true,
  'True. It reacts with oxygen in the air (tarnishes). Potassium tarnishes even faster.');
M('C2.2-05', 'Why are Group 1 metals stored under oil?',
  ['To stop them reacting with air and water', 'To keep them cool so they do not melt', 'To keep them shiny for displaying', 'To stop them dissolving in the air'],
  'They react quickly with oxygen and moisture in air.');
M('C2.3-01', 'Rubidium is below potassium in Group 1. Predict how it reacts with water.',
  ['Even more violently than potassium', 'Less vigorously than lithium', 'It does not react', 'Exactly like lithium'],
  'Reactivity increases down Group 1, so rubidium is more reactive than potassium.');
M('C2.3-02', 'What would you predict about the melting point of caesium, near the bottom of Group 1?',
  ['It is lower than potassium’s', 'It is higher than lithium’s', 'It is the same as sodium’s', 'Caesium cannot melt'],
  'Melting points decrease down Group 1.');
T('C2.3-03', 'Caesium hydroxide, formed when caesium reacts with water, is an alkali.', true,
  'True. All Group 1 metals react with water to form an alkaline hydroxide and hydrogen.');
MH('C2.3-04', 'Francium is at the bottom of Group 1. What is its likely charge as an ion?',
  ['1+', '2+', '1−', '7+'],
  'Like every Group 1 metal, it has one outer electron to lose.');

/* ===================== CHEMISTRY 2(b) Group 7 (added 7 Nov 2026) ===================== */
M('C2.5-01', 'What does bromine look like at room temperature?',
  ['A red-brown liquid', 'A pale yellow-green gas', 'A grey-black solid', 'A colourless gas'],
  'Chlorine: pale yellow-green gas. Bromine: red-brown liquid. Iodine: grey-black solid (purple vapour).');
M('C2.5-02', 'What colour is chlorine gas?',
  ['Pale yellow-green', 'Red-brown', 'Purple', 'Colourless'],
  'Chlorine is a poisonous pale yellow-green gas.');
M('C2.5-03', 'How do the melting and boiling points change down Group 7?',
  ['They increase', 'They decrease', 'They stay the same', 'They go up and then down'],
  'The molecules get bigger, so the intermolecular forces get stronger.');
T('C2.5-04', 'Iodine is a grey-black solid that forms a purple vapour when warmed.', true,
  'True.');
MH('C2.5-05', 'How does the colour of the halogens change down the group?',
  ['It gets darker', 'It gets lighter', 'It stays the same', 'They are all colourless'],
  'Pale yellow-green (Cl₂) → red-brown (Br₂) → grey-black (I₂).');
M('C2.6-01', 'Astatine is below iodine in Group 7. What would you predict it looks like?',
  ['A dark solid', 'A pale gas', 'A colourless liquid', 'A yellow gas'],
  'Following the trend: darker colour and higher melting point down the group.');
M('C2.6-02', 'Fluorine is above chlorine in Group 7. What would you predict about its reactivity?',
  ['It is more reactive than chlorine', 'It is less reactive than iodine', 'It is unreactive', 'It has the same reactivity as iodine'],
  'Reactivity decreases down Group 7, so fluorine is the most reactive halogen.');
T('C2.6-03', 'Astatine would be expected to be more reactive than iodine.', false,
  'False. Reactivity decreases down Group 7, so astatine should be less reactive than iodine.');
MH('C2.6-04', 'Fluorine is a gas at room temperature. Predict its state compared with chlorine’s boiling point.',
  ['It has a lower boiling point than chlorine', 'It has a higher boiling point than chlorine', 'It has the same boiling point as bromine', 'It is a solid at room temperature'],
  'Boiling points increase down the group, so fluorine (above chlorine) has a lower one.');
M('C2.7-01', 'Chlorine water is added to potassium bromide solution. What happens?',
  ['The solution turns orange as bromine is displaced', 'Nothing happens, as chlorine is less reactive', 'Chlorine is displaced and bubbles off as a gas', 'A white precipitate of potassium chloride forms'],
  'Chlorine is more reactive than bromine: Cl₂ + 2KBr → 2KCl + Br₂.');
M('C2.7-02', 'Which mixture will <b>not</b> react?',
  ['Iodine + potassium chloride solution', 'Chlorine + potassium iodide solution', 'Bromine + potassium iodide solution', 'Chlorine + potassium bromide solution'],
  'Iodine is less reactive than chlorine, so it cannot displace it.');
MH('C2.7-03', 'Complete: Cl₂ + 2NaI → <b>?</b>',
  ['2NaCl + I₂', 'NaCl₂ + I₂', '2NaI + Cl₂', 'Na₂Cl + I'],
  'Chlorine displaces iodine from sodium iodide.');
T('C2.7-04', 'Displacement reactions show that reactivity decreases down Group 7.', true,
  'True. A halogen displaces any halide below it in the group, but not one above it.');
M('C2.7-05', 'Bromine water is added to potassium iodide solution and the mixture turns brown. What does this show?',
  ['Bromine is more reactive than iodine', 'Iodine is more reactive than bromine', 'Potassium is more reactive than bromine', 'No reaction has happened'],
  'Bromine has displaced iodine, which colours the solution brown.');

/* ===================== CHEMISTRY 2(c) Gases in the atmosphere (added 7 Nov 2026) ===================== */
M('C2.9-01', 'Approximately what percentage of dry air is nitrogen?',
  ['78%', '21%', '1%', '50%'],
  'Nitrogen 78%, oxygen 21%, argon 0.9%, carbon dioxide 0.04%.');
M('C2.9-02', 'Approximately what percentage of dry air is oxygen?',
  ['21%', '78%', '0.04%', '1%'],
  'About one fifth of the air is oxygen.');
M('C2.9-03', 'Which gas makes up about 0.9% of dry air?',
  ['Argon', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'],
  'Argon is the third most abundant gas in dry air.');
T('C2.9-04', 'Carbon dioxide makes up about 4% of dry air.', false,
  'False. Carbon dioxide is only about 0.04% of dry air.');
M('C2.10-01', 'Damp iron wool is left in a measuring tube upside down over water for a week. The water rises. Why?',
  ['The iron rusts and uses up the oxygen in the trapped air', 'The iron produces a gas that pushes the water up', 'Water evaporates into the tube', 'The nitrogen dissolves in the water'],
  'Oxygen is removed, so the gas volume falls by about one fifth.');
MH('C2.10-02', 'In an experiment, 100 cm³ of air is passed over hot copper until the volume stops changing. What final volume is expected?',
  ['About 79 cm³', 'About 21 cm³', 'About 100 cm³', 'About 50 cm³'],
  'The copper reacts with the oxygen (about 21%), leaving about 79 cm³.');
T('C2.10-03', 'Phosphorus burning in a bell jar over water can be used to find the percentage of oxygen in air.', true,
  'True. The phosphorus uses up the oxygen and the water level rises to replace it.');
M('C2.10-04', 'Why must you wait for the apparatus to cool before reading the final gas volume?',
  ['Hot gas expands, so the volume reading would be too big', 'The copper would melt and block the tube if moved', 'The water in the trough would boil and add steam', 'Oxygen is released again from the copper as it cools'],
  'Gas volumes must be compared at the same temperature.');
M('C2.11-01', 'What is seen when magnesium burns in oxygen?',
  ['A bright white flame and a white powder forms', 'A blue flame and a choking gas forms', 'A squeaky pop and water forms', 'No visible change'],
  '2Mg + O₂ → 2MgO.');
M('C2.11-02', 'What is made when sulfur burns in oxygen?',
  ['Sulfur dioxide, an acidic gas', 'Sulfur hydroxide, an alkali', 'Sulfuric acid, a liquid', 'Hydrogen sulfide'],
  'S + O₂ → SO₂. Sulfur burns with a blue flame.');
M('C2.11-03', 'What is the only product when hydrogen burns in oxygen?',
  ['Water', 'Hydrogen peroxide', 'Carbon dioxide', 'Hydrogen oxide gas and heat only'],
  '2H₂ + O₂ → 2H₂O.');
MH('C2.11-04', 'The oxides of magnesium and sulfur are each added to water with universal indicator. What do you see?',
  ['MgO: blue/purple (alkaline); SO₂: red (acidic)', 'Both solutions turn red (acidic)', 'Both solutions turn purple (alkaline)', 'MgO: red (acidic); SO₂: purple (alkaline)'],
  'Metal oxides are basic; non-metal oxides are acidic.');
M('C2.12-01', 'What gas is given off when copper(II) carbonate is heated?',
  ['Carbon dioxide', 'Oxygen', 'Hydrogen', 'Carbon monoxide'],
  'CuCO₃ → CuO + CO₂ (thermal decomposition).');
M('C2.12-02', 'What colour change is seen when copper(II) carbonate is heated?',
  ['Green to black', 'Blue to white', 'Black to green', 'White to yellow'],
  'Green copper(II) carbonate decomposes to black copper(II) oxide.');
T('C2.12-03', 'Thermal decomposition means breaking a substance down using heat.', true,
  'True. For example, metal carbonates break down into a metal oxide and carbon dioxide.');
MH('C2.12-04', 'How could you show that the gas from heating copper(II) carbonate is carbon dioxide?',
  ['Bubble it through limewater, which turns milky', 'Hold a glowing splint in it, which relights', 'Hold a lighted splint in it, which pops', 'Hold damp red litmus in it, which turns blue'],
  'Limewater turns milky (cloudy) with carbon dioxide.');
M('C2.13-01', 'Why does increasing carbon dioxide in the atmosphere matter?',
  ['It is a greenhouse gas and may contribute to climate change', 'It destroys the ozone layer, letting in more ultraviolet light', 'It is poisonous to breathe, even at the levels in normal air', 'It makes the air less dense, so aeroplanes cannot fly as well'],
  'Greenhouse gases absorb heat radiated from the Earth.');
T('C2.13-02', 'Carbon dioxide is a greenhouse gas.', true,
  'True. Increasing amounts may contribute to climate change.');
M('C2.13-03', 'Which human activity adds most carbon dioxide to the atmosphere?',
  ['Burning fossil fuels', 'Planting trees', 'Using solar panels', 'Recycling paper'],
  'Burning coal, oil and gas releases carbon dioxide.');
M('C2.14-01', 'In the copper experiment to find the percentage of oxygen, why is the air pushed back and forth over the hot copper many times?',
  ['So that all the oxygen reacts with the copper', 'To cool the copper so it does not melt', 'To add extra oxygen from outside the syringes', 'To stop the syringe plungers from sticking'],
  'Repeat until the volume stops changing, so all the oxygen has been used up.');
MH('C2.14-02', 'Starting volume of air: 50.0 cm³. Final volume after reaction with hot copper: 39.5 cm³. What percentage of the air was oxygen?',
  ['21%', '79%', '10.5%', '26.6%'],
  'Oxygen used = 50.0 − 39.5 = 10.5 cm³. 10.5 ÷ 50.0 × 100 = <b>21%</b>.');
T('C2.14-03', 'In the iron wool experiment, the iron wool should be dry so it reacts faster.', false,
  'False. Iron needs both oxygen and water to rust, so the iron wool must be damp.');

/* ===================== CHEMISTRY 2(d) Reactivity series (added 7 Nov 2026) ===================== */
M('C2.15-01', 'Which metal reacts most vigorously with cold water?',
  ['Potassium', 'Magnesium', 'Zinc', 'Copper'],
  'Potassium, sodium, lithium and calcium react with cold water; magnesium only very slowly.');
M('C2.15-02', 'Which metal does <b>not</b> react with dilute hydrochloric acid?',
  ['Copper', 'Magnesium', 'Zinc', 'Iron'],
  'Copper, silver and gold are below hydrogen, so they do not react with dilute acids.');
M('C2.15-03', 'Magnesium reacts very slowly with cold water but quickly with steam. What does steam give?',
  ['Magnesium oxide and hydrogen', 'Magnesium hydroxide and oxygen', 'Magnesium oxide and oxygen', 'Magnesium hydride'],
  'Mg + H₂O(g) → MgO + H₂.');
T('C2.15-04', 'Metals that react with acids produce a salt and hydrogen.', true,
  'True. For example, Zn + 2HCl → ZnCl₂ + H₂.');
M('C2.16-01', 'Magnesium is added to copper(II) sulfate solution. What happens?',
  ['Copper is displaced and the blue colour fades', 'Nothing happens, as magnesium is less reactive', 'Magnesium is displaced and coats the copper', 'The solution turns a darker shade of blue'],
  'Mg + CuSO₄ → MgSO₄ + Cu. Magnesium is more reactive than copper.');
M('C2.16-02', 'Which reaction would <b>not</b> happen?',
  ['Copper + zinc sulfate solution', 'Zinc + copper(II) sulfate solution', 'Magnesium + iron(II) sulfate solution', 'Iron + copper(II) sulfate solution'],
  'Copper is less reactive than zinc, so it cannot displace it.');
MH('C2.16-03', 'Aluminium powder is heated with iron(III) oxide (the thermite reaction). What forms?',
  ['Aluminium oxide and iron', 'Aluminium and iron oxide (no reaction)', 'Iron and oxygen gas', 'Aluminium iron alloy'],
  '2Al + Fe₂O₃ → Al₂O₃ + 2Fe. Aluminium is more reactive, so it takes the oxygen.');
T('C2.16-04', 'A more reactive metal can displace a less reactive metal from a solution of its salt.', true,
  'True. Displacement reactions are used to place metals in a reactivity series.');
M('C2.17-01', 'Which list is in order of decreasing reactivity?',
  ['potassium, sodium, lithium, calcium, magnesium, aluminium, zinc, iron, copper, silver, gold', 'gold, silver, copper, iron, zinc, aluminium, magnesium, calcium, lithium, sodium, potassium', 'potassium, sodium, calcium, lithium, magnesium, zinc, aluminium, iron, copper, gold, silver', 'sodium, potassium, lithium, calcium, aluminium, magnesium, zinc, copper, iron, silver, gold'],
  'The spec order: K, Na, Li, Ca, Mg, Al, Zn, Fe, Cu, Ag, Au.');
M('C2.17-02', 'Which metal is the least reactive?',
  ['Gold', 'Silver', 'Copper', 'Iron'],
  'Gold is at the bottom of the reactivity series: it is found uncombined in nature.');
M('C2.17-03', 'Which metal is between magnesium and zinc in the reactivity series?',
  ['Aluminium', 'Calcium', 'Iron', 'Copper'],
  '… calcium, magnesium, aluminium, zinc, iron …');
MH('C2.17-04', 'Metal X displaces copper but not zinc from their salt solutions. Where is X in the reactivity series?',
  ['Between zinc and copper', 'Above zinc, near magnesium', 'Below copper, near silver', 'Above potassium, at the top'],
  'X is more reactive than copper but less reactive than zinc. Iron fits.');
M('C2.18-01', 'What does iron need in order to rust?',
  ['Both oxygen and water', 'Only oxygen from the air', 'Only water, with no air', 'Carbon dioxide and water'],
  'Iron + oxygen + water → hydrated iron(III) oxide (rust).');
MH('C2.18-02', 'Three nails are set up: A in dry air with drying agent, B in boiled water with oil on top, C in tap water open to air. Which rusts?',
  ['Only C', 'Only A', 'A and B', 'All three'],
  'A has no water; B has no oxygen (boiled water, oil layer). Only C has both.');
T('C2.18-03', 'Iron rusts faster in salty water.', true,
  'True. Salt speeds up rusting, which is why cars rust faster where roads are salted.');
M('C2.18-04', 'What is rust?',
  ['Hydrated iron(III) oxide', 'Iron carbonate', 'Iron chloride', 'Pure iron that has gone brown'],
  'Rust is iron(III) oxide with water combined in it.');
M('C2.19-01', 'How does painting a bicycle frame stop it rusting?',
  ['It is a barrier that keeps out oxygen and water', 'It makes the iron more reactive', 'It sacrifices itself instead of the iron', 'It turns the iron into steel'],
  'Paint, oil, grease and plastic coatings are barrier methods.');
M('C2.19-02', 'What is <b>galvanising</b>?',
  ['Coating iron with a layer of zinc', 'Coating iron with paint', 'Coating iron with copper', 'Heating iron to make it harder'],
  'The zinc is a barrier, and it also protects sacrificially if scratched.');
M('C2.19-03', 'Blocks of magnesium are attached to a ship’s steel hull. How does this stop rusting?',
  ['Magnesium is more reactive, so it corrodes instead of the iron', 'Magnesium is less reactive, so it forms a barrier against water', 'Magnesium makes the steel waterproof by coating the whole hull', 'Magnesium reacts with any rust that forms and turns it back to iron'],
  'This is sacrificial protection.');
MH('C2.19-04', 'A galvanised bucket is scratched through to the iron. Why does the iron still not rust?',
  ['Zinc is more reactive than iron, so the zinc corrodes instead', 'The zinc grows back over the scratch', 'Iron cannot rust once it has touched zinc', 'Zinc is less reactive and protects it as a barrier'],
  'Zinc gives sacrificial protection as well as acting as a barrier.');
T('C2.19-05', 'Using a less reactive metal, such as copper, attached to iron gives sacrificial protection.', false,
  'False. The sacrificial metal must be more reactive than iron, such as zinc or magnesium.');
M('C2.20-01', 'What is oxidation, in terms of electrons?',
  ['Loss of electrons', 'Gain of electrons', 'Gain of protons', 'Loss of neutrons'],
  'OIL RIG: Oxidation Is Loss, Reduction Is Gain (of electrons).');
M('C2.20-02', 'CuO + H₂ → Cu + H₂O. Which substance is reduced?',
  ['Copper(II) oxide', 'Hydrogen', 'Copper', 'Water'],
  'Copper(II) oxide loses oxygen, so it is reduced. Hydrogen gains oxygen, so it is oxidised.');
MH('C2.20-03', 'Mg + CuSO₄ → MgSO₄ + Cu. What is the reducing agent?',
  ['Magnesium', 'Copper(II) ions', 'Sulfate ions', 'Copper'],
  'Magnesium loses electrons (Mg → Mg²⁺ + 2e⁻), so it is oxidised and acts as the reducing agent.');
M('C2.20-04', 'What is a <b>redox</b> reaction?',
  ['A reaction in which oxidation and reduction both happen', 'A reaction that only involves the reduction of a metal', 'A reaction between an acid and an alkali to make a salt', 'A reaction that changes the colour of a solution to red'],
  'When one substance loses electrons, another must gain them.');
T('C2.20-05', 'Reduction is the gain of oxygen.', false,
  'False. Reduction is the loss of oxygen (or gain of electrons). Oxidation is gain of oxygen.');
M('C2.21-01', 'Equal pieces of magnesium, zinc and iron are added to the same acid. Which gives the fastest bubbling?',
  ['Magnesium', 'Zinc', 'Iron', 'All the same'],
  'Magnesium is highest in the reactivity series of the three.');
M('C2.21-02', 'In the metals-and-acids practical, which variable must be kept the same for a fair test?',
  ['The concentration and volume of acid', 'The type of metal used each time', 'The amount of bubbling produced', 'The colour of the final solution'],
  'Also the size of the metal pieces and the starting temperature.');
MH('C2.21-03', 'How else, besides bubbling, could you compare the reactivity of metals with acid?',
  ['Measure the temperature rise', 'Measure the colour of the metal', 'Weigh the acid before adding the metal', 'Measure the pH of the metal'],
  'More reactive metals release energy faster, giving a bigger temperature rise.');
T('C2.21-04', 'Copper fizzes slowly in dilute hydrochloric acid.', false,
  'False. Copper does not react with dilute hydrochloric acid at all.');

/* ===================== CHEMISTRY 2(e) Acids, alkalis and titrations (added 7 Nov 2026) ===================== */
M('C2.28-01', 'What colour is methyl orange in an <b>acid</b>?',
  ['Red', 'Yellow', 'Pink', 'Blue'],
  'Methyl orange: red in acid, yellow in alkali.');
M('C2.28-02', 'What colour is phenolphthalein in an <b>alkali</b>?',
  ['Pink', 'Colourless', 'Red', 'Yellow'],
  'Phenolphthalein: colourless in acid, pink in alkali.');
M('C2.28-03', 'What colour does blue litmus turn in an acid?',
  ['Red', 'Blue (no change)', 'Green', 'Purple'],
  'Litmus: red in acid, blue in alkali.');
T('C2.28-04', 'Phenolphthalein is pink in acid.', false,
  'False. Phenolphthalein is colourless in acid and pink in alkali.');
M('C2.29-01', 'A solution has a pH of 2. How is it classified?',
  ['Strongly acidic', 'Weakly acidic', 'Neutral', 'Strongly alkaline'],
  '0–3 strongly acidic, 4–6 weakly acidic, 7 neutral, 8–10 weakly alkaline, 11–14 strongly alkaline.');
M('C2.29-02', 'A solution has a pH of 9. How is it classified?',
  ['Weakly alkaline', 'Strongly alkaline', 'Weakly acidic', 'Neutral'],
  'pH 8–10 is weakly alkaline.');
T('C2.29-03', 'A solution with pH 7 is neutral.', true,
  'True. Pure water has a pH of 7.');
MH('C2.29-04', 'Which pH is most likely for sodium hydroxide solution?',
  ['14', '7', '9', '1'],
  'Sodium hydroxide is a strong alkali (11–14).');
M('C2.30-01', 'What colour is universal indicator in a neutral solution?',
  ['Green', 'Red', 'Purple', 'Yellow'],
  'Red (strong acid) → orange/yellow → green (neutral) → blue → purple (strong alkali).');
M('C2.30-02', 'Why is universal indicator more useful than litmus?',
  ['It shows an approximate pH, not just acid or alkali', 'It works in acids, while litmus only works in alkalis', 'It stays colourless, so the solution is easy to see', 'It changes the pH of the solution to make it neutral'],
  'Universal indicator is a mixture of indicators giving a range of colours.');
T('C2.30-03', 'Universal indicator turns purple in a strong alkali.', true,
  'True.');
MH('C2.30-04', 'A solution turns universal indicator orange-yellow. What is its approximate pH?',
  ['5', '1', '7', '11'],
  'Orange/yellow means weakly acidic (about 4–6).');
M('C2.31-01', 'Which ions make a solution acidic?',
  ['Hydrogen ions, H⁺', 'Hydroxide ions, OH⁻', 'Sodium ions, Na⁺', 'Chloride ions, Cl⁻'],
  'Acids in aqueous solution are a source of H⁺ ions.');
M('C2.31-02', 'Which ions make a solution alkaline?',
  ['Hydroxide ions, OH⁻', 'Hydrogen ions, H⁺', 'Oxide ions, O²⁻', 'Sulfate ions, SO₄²⁻'],
  'Alkalis in aqueous solution are a source of OH⁻ ions.');
T('C2.31-03', 'Hydrochloric acid contains hydroxide ions.', false,
  'False. Acids are a source of hydrogen ions (H⁺). Alkalis provide hydroxide ions.');
M('C2.32-01', 'What forms when an alkali neutralises an acid?',
  ['A salt and water', 'Hydrogen gas only', 'Carbon dioxide and water', 'A stronger acid'],
  'For example, HCl + NaOH → NaCl + H₂O.');
MH('C2.32-02', 'Which ionic equation shows neutralisation?',
  ['H⁺ + OH⁻ → H₂O', 'Na⁺ + Cl⁻ → NaCl', 'H⁺ + Cl⁻ → HCl', '2H⁺ → H₂'],
  'The hydrogen ions from the acid react with the hydroxide ions from the alkali.');
T('C2.32-03', 'Adding enough alkali to an acid can make the solution neutral.', true,
  'True. The alkali neutralises the acid.');

/* ===================== CHEMISTRY 2(f) Acids, bases and salt preparations (added 7 Nov 2026) ===================== */
M('C2.34-01', 'Which of these salts is <b>insoluble</b> in water?',
  ['Silver chloride', 'Sodium chloride', 'Potassium nitrate', 'Ammonium sulfate'],
  'Common chlorides are soluble, except silver and lead(II) chloride.');
M('C2.34-02', 'Which of these is soluble in water?',
  ['All nitrates', 'Barium sulfate', 'Calcium carbonate', 'Copper(II) hydroxide'],
  'All nitrates are soluble.');
M('C2.34-03', 'Which carbonate is soluble?',
  ['Sodium carbonate', 'Calcium carbonate', 'Copper(II) carbonate', 'Zinc carbonate'],
  'Carbonates are insoluble except sodium, potassium and ammonium carbonates.');
T('C2.34-04', 'Barium sulfate is soluble in water.', false,
  'False. Common sulfates are soluble except barium, calcium and lead(II) sulfate.');
MH('C2.34-05', 'Which hydroxide is described as slightly soluble?',
  ['Calcium hydroxide', 'Sodium hydroxide', 'Copper(II) hydroxide', 'Iron(III) hydroxide'],
  'Sodium and potassium hydroxide are soluble; calcium hydroxide is slightly soluble; others are insoluble.');
M('C2.35-01', 'In terms of protons, what does an acid do?',
  ['It donates protons (H⁺ ions)', 'It accepts protons (H⁺ ions)', 'It donates electrons (e⁻)', 'It accepts hydroxide ions only'],
  'Acid = proton donor. Base = proton acceptor.');
M('C2.36-01', 'What is a <b>base</b>, in terms of proton transfer?',
  ['A proton acceptor', 'A proton donor', 'An electron donor', 'A neutron acceptor'],
  'For example, OH⁻ accepts an H⁺ to become H₂O.');
T('C2.36-02', 'An acid is a proton donor.', true,
  'True. A proton is an H⁺ ion.');
MH('C2.35-02', 'In the reaction HCl + NH₃ → NH₄Cl, which substance acts as the base?',
  ['Ammonia, because it accepts a proton to form NH₄⁺', 'Hydrogen chloride, because it donates a proton', 'Ammonium chloride, because it is a salt', 'Neither: no protons are transferred'],
  'HCl donates H⁺ (acid); NH₃ accepts it (base).');
MH('C2.36-03', 'When an acid reacts with a hydroxide, what happens to the protons?',
  ['They are transferred from the acid to the hydroxide ions, forming water', 'They are destroyed in the reaction, which is why the acid is used up', 'They are transferred to the metal ions, forming the salt', 'They stay attached to the acid, which is why the solution stays acidic'],
  'H⁺ + OH⁻ → H₂O.');
M('C2.37-01', 'What is the salt made when zinc reacts with hydrochloric acid?',
  ['Zinc chloride', 'Zinc sulfate', 'Zinc nitrate', 'Zinc hydroxide'],
  'Hydrochloric acid makes chlorides, sulfuric acid makes sulfates, nitric acid makes nitrates.');
M('C2.37-02', 'What are the products when an acid reacts with a metal carbonate?',
  ['A salt, water and carbon dioxide', 'A salt and hydrogen gas only', 'A salt and water only', 'A base, water and carbon dioxide'],
  'For example, CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂.');
M('C2.37-03', 'What are the products when an acid reacts with a metal oxide?',
  ['A salt and water', 'A salt and hydrogen', 'A salt, water and carbon dioxide', 'An alkali and hydrogen'],
  'For example, CuO + H₂SO₄ → CuSO₄ + H₂O.');
MH('C2.37-04', 'Which acid would you use to make magnesium nitrate?',
  ['Nitric acid', 'Hydrochloric acid', 'Sulfuric acid', 'Carbonic acid'],
  'Nitrates are made from nitric acid, e.g. with magnesium oxide or carbonate.');
T('C2.37-05', 'Sulfuric acid reacts with magnesium to form magnesium sulfate and hydrogen.', true,
  'True. Mg + H₂SO₄ → MgSO₄ + H₂.');
M('C2.38-01', 'What is an <b>alkali</b>?',
  ['A base that is soluble in water', 'Any acid that is weak', 'A metal that reacts with water', 'A salt that dissolves'],
  'All alkalis are bases, but not all bases are alkalis.');
M('C2.38-02', 'Which of these can act as a base?',
  ['Copper(II) oxide', 'Hydrochloric acid', 'Sodium chloride', 'Carbon dioxide'],
  'Metal oxides, metal hydroxides and ammonia can act as bases.');
T('C2.38-03', 'All bases are alkalis.', false,
  'False. Only bases that dissolve in water are alkalis. Copper(II) oxide is a base but not an alkali.');
MH('C2.38-04', 'Ammonia solution turns red litmus blue. Why is ammonia classed as a base?',
  ['It accepts protons and neutralises acids', 'It contains metal ions that make it basic', 'It donates protons to the water it dissolves in', 'It is a gas, and all gases are bases'],
  'NH₃ + H⁺ → NH₄⁺.');
M('C2.39-01', 'To make a pure, dry salt from an insoluble base and an acid, why is the base added in <b>excess</b>?',
  ['To make sure all the acid is used up', 'To make the salt more colourful', 'To speed up evaporation', 'So the salt is wet'],
  'The leftover solid base is then easily filtered off.');
M('C2.39-02', 'After reacting excess insoluble base with acid, what is the next step?',
  ['Filter to remove the unreacted base', 'Add more acid', 'Boil the mixture dry immediately', 'Add universal indicator'],
  'Then heat the filtrate to concentrate it and leave it to crystallise.');
MH('C2.39-03', 'Why is the salt solution only partly evaporated, then left to cool, instead of boiled dry?',
  ['To get well-formed crystals that keep their water of crystallisation', 'To let the salt dissolve again so that the solution stays pure', 'Because boiling the solution would turn the salt back into an acid', 'To give the excess base time to react with the remaining acid'],
  'Boiling dry can decompose hydrated salts and gives a powder instead of crystals.');
T('C2.39-04', 'Filtration is used to remove the excess insoluble reactant.', true,
  'True. The salt solution passes through as the filtrate.');
M('C2.42-01', 'What is the colour of hydrated copper(II) sulfate crystals?',
  ['Blue', 'White', 'Black', 'Green'],
  'Blue CuSO₄·5H₂O. Anhydrous copper(II) sulfate is white.');
M('C2.42-02', 'Which two reactants are used to make copper(II) sulfate crystals in the required practical?',
  ['Copper(II) oxide and dilute sulfuric acid', 'Copper and dilute sulfuric acid', 'Copper(II) oxide and hydrochloric acid', 'Copper and sodium sulfate solution'],
  'Copper does not react with dilute sulfuric acid, so its oxide is used.');
MH('C2.42-03', 'How do you know when you have added excess copper(II) oxide to the warm sulfuric acid?',
  ['Black solid remains and no more dissolves', 'The solution turns from blue to colourless', 'Bubbles of gas stop being given off', 'The solution turns from blue to green'],
  'Unreacted black copper(II) oxide stays in the beaker.');
T('C2.42-04', 'The sulfuric acid is warmed so that the copper(II) oxide reacts faster.', true,
  'True. Do not boil it.');

/* ===================== CHEMISTRY 2(g) Chemical tests (added 7 Nov 2026) ===================== */
M('C2.44-01', 'What is the test for hydrogen?',
  ['A lighted splint gives a squeaky pop', 'A glowing splint relights', 'Limewater turns milky', 'Damp litmus paper is bleached'],
  'Hydrogen burns with a squeaky pop.');
M('C2.44-02', 'What is the test for oxygen?',
  ['A glowing splint relights', 'A lighted splint gives a squeaky pop', 'Limewater turns milky', 'Damp red litmus turns blue'],
  'Oxygen relights a glowing splint.');
M('C2.44-03', 'What is the test for carbon dioxide?',
  ['Bubble it through limewater, which turns milky', 'Put a glowing splint in it, which relights', 'Put a lighted splint in it, which pops', 'Hold damp red litmus in it, which turns blue'],
  'Limewater is calcium hydroxide solution.');
M('C2.44-04', 'What is the test for ammonia?',
  ['Damp red litmus paper turns blue', 'Damp blue litmus paper is bleached', 'Limewater turns milky', 'A glowing splint relights'],
  'Ammonia is an alkaline gas.');
M('C2.44-05', 'What is the test for chlorine?',
  ['Damp litmus paper is bleached white', 'Damp red litmus paper turns blue', 'A lighted splint gives a squeaky pop', 'Limewater turns milky and cloudy'],
  'Blue litmus may turn red first, then is bleached.');
M('C2.45-01', 'In a flame test, what is the wire dipped in first to clean it?',
  ['Concentrated hydrochloric acid', 'Distilled water from a wash bottle', 'Sodium hydroxide solution', 'Limewater solution'],
  'A nichrome or platinum wire is cleaned in acid, then dipped in the sample and held in a blue (roaring) Bunsen flame.');
MH('C2.45-02', 'Why must the flame test wire be cleaned before each test?',
  ['Traces of other metal ions would colour the flame', 'The wire needs to be hot before the test starts', 'Cleaning stops the wire melting in the flame', 'The acid turns the Bunsen flame blue'],
  'Even small amounts of sodium give a strong yellow flame.');
T('C2.45-03', 'A flame test is done using a yellow (safety) Bunsen flame.', false,
  'False. Use a blue flame so its colour does not hide the colour from the metal ion.');
M('C2.46-01', 'Which ion gives a <b>lilac</b> flame?',
  ['K⁺', 'Na⁺', 'Li⁺', 'Cu²⁺'],
  'Li⁺ red, Na⁺ yellow, K⁺ lilac, Ca²⁺ orange-red, Cu²⁺ blue-green.');
M('C2.46-02', 'What colour flame does sodium give?',
  ['Yellow', 'Lilac', 'Red', 'Blue-green'],
  'Sodium compounds give a strong yellow flame.');
M('C2.46-03', 'A compound gives a blue-green flame. Which ion is present?',
  ['Cu²⁺', 'Ca²⁺', 'Li⁺', 'K⁺'],
  'Copper(II) ions give a blue-green flame.');
MH('C2.46-04', 'Which two ions give flame colours that are easily confused, both being red-ish?',
  ['Li⁺ (red) and Ca²⁺ (orange-red)', 'Na⁺ (yellow) and K⁺ (lilac)', 'Cu²⁺ (blue-green) and K⁺ (lilac)', 'Na⁺ (yellow) and Cu²⁺ (blue-green)'],
  'Lithium is red; calcium is orange-red.');
M('C2.47-01', 'Sodium hydroxide solution is added to a solution and a blue precipitate forms. Which ion is present?',
  ['Cu²⁺', 'Fe²⁺', 'Fe³⁺', 'NH₄⁺'],
  'Cu²⁺ blue, Fe²⁺ green, Fe³⁺ orange-brown precipitate.');
M('C2.47-02', 'What colour precipitate does iron(III) give with sodium hydroxide solution?',
  ['Orange-brown', 'Green', 'Blue', 'White'],
  'Iron(II) gives a green precipitate.');
M('C2.47-03', 'How do you test for ammonium ions (NH₄⁺)?',
  ['Warm with sodium hydroxide; the gas turns damp red litmus blue', 'Add dilute acid; the gas given off turns limewater milky', 'Add silver nitrate solution; a white precipitate forms', 'Do a flame test with a clean wire; a lilac flame appears'],
  'NH₄⁺ + OH⁻ → NH₃ + H₂O.');
MH('C2.47-04', 'A green precipitate forms with sodium hydroxide, which slowly turns orange-brown at the surface. What was in the solution?',
  ['Fe²⁺ ions', 'Cu²⁺ ions', 'Fe³⁺ ions', 'NH₄⁺ ions'],
  'Iron(II) hydroxide is green; it is slowly oxidised by air to orange-brown iron(III) hydroxide.');
M('C2.48-01', 'Dilute nitric acid and silver nitrate solution are added to a solution. A yellow precipitate forms. Which ion is present?',
  ['Iodide, I⁻', 'Chloride, Cl⁻', 'Bromide, Br⁻', 'Sulfate, SO₄²⁻'],
  'Cl⁻ white, Br⁻ cream, I⁻ yellow precipitate.');
M('C2.48-02', 'How do you test for sulfate ions?',
  ['Add dilute HCl then barium chloride solution: white precipitate', 'Add dilute nitric acid then silver nitrate: yellow precipitate', 'Add sodium hydroxide solution: blue precipitate forms', 'Do a flame test with a clean wire: yellow flame appears'],
  'Barium sulfate is insoluble.');
M('C2.48-03', 'How do you test for carbonate ions?',
  ['Add dilute acid; the gas given off turns limewater milky', 'Add silver nitrate; a white precipitate forms', 'Add sodium hydroxide; a gas turns red litmus blue', 'Do a flame test; a red flame appears'],
  'Carbonates react with acids to give carbon dioxide.');
MH('C2.48-04', 'Why is the solution acidified with nitric acid before adding silver nitrate in the halide test?',
  ['To remove carbonate ions, which would also give a precipitate', 'To make the precipitate a brighter, clearer colour to see', 'To provide the chloride ions needed to form the precipitate', 'To speed up the reaction so the precipitate forms quickly'],
  'Hydrochloric acid cannot be used, because it contains chloride ions itself.');
T('C2.48-05', 'Silver chloride is a white precipitate.', true,
  'True. Silver bromide is cream and silver iodide is yellow.');
M('C2.49-01', 'Anhydrous copper(II) sulfate is used to test for water. What is seen?',
  ['It turns from white to blue', 'It turns from blue to white', 'It fizzes', 'It turns from green to black'],
  'Water rehydrates the white powder to blue hydrated copper(II) sulfate.');
T('C2.49-02', 'The anhydrous copper(II) sulfate test shows that a liquid is pure water.', false,
  'False. It shows water is present, but not that the liquid is pure. Any solution containing water would turn it blue.');
MH('C2.49-03', 'A colourless liquid turns anhydrous copper(II) sulfate blue. What can you conclude?',
  ['The liquid contains water', 'The liquid is pure water', 'The liquid is an acid', 'The liquid contains copper'],
  'To show it is pure water, test its boiling or freezing point.');
M('C2.50-01', 'How can you show that a sample of water is pure?',
  ['Check that it boils at exactly 100 °C', 'Add anhydrous copper(II) sulfate', 'Check that it is clear and colourless', 'Check that it has no smell'],
  'Impurities change the boiling and freezing points.');
MH('C2.50-02', 'A water sample boils at 102 °C. What does this show?',
  ['It is impure: dissolved substances raise its boiling point', 'It is pure: all pure water boils between 100 and 105 °C', 'The thermometer must be broken, because water can’t do that', 'It contains no dissolved substances, so it boils higher'],
  'Pure water boils at 100 °C (at normal atmospheric pressure).');
T('C2.50-03', 'Pure water freezes at 0 °C.', true,
  'True. A physical test for purity is to check its melting/freezing or boiling point.');
M('C2.13-04', 'Which of these is a greenhouse gas?',
  ['Carbon dioxide', 'Nitrogen', 'Argon', 'Oxygen'],
  'Carbon dioxide absorbs heat radiated by the Earth.');
MH('C2.14-04', 'Why does using too little iron wool in the oxygen experiment give a result below 21%?',
  ['Not all the oxygen is used up', 'The iron wool adds extra oxygen', 'The water level falls too far', 'Nitrogen reacts with the iron'],
  'There must be enough iron to react with all the oxygen in the trapped air.');
M('C2.31-04', 'A solution contains more OH⁻ ions than H⁺ ions. What is it?',
  ['Alkaline', 'Acidic', 'Neutral', 'A salt'],
  'Hydroxide ions make a solution alkaline.');
M('C2.32-04', 'Sodium hydroxide is added to hydrochloric acid until the solution is neutral. Which salt forms?',
  ['Sodium chloride', 'Sodium hydroxide', 'Hydrogen chloride', 'Sodium sulfate'],
  'NaOH + HCl → NaCl + H₂O.');
T('C2.35-03', 'When an acid reacts with a base, protons are transferred from the acid to the base.', true,
  'True. Acids are proton donors; bases are proton acceptors.');
M('C2.35-04', 'Which ion is a proton?',
  ['H⁺', 'OH⁻', 'H⁻', 'O²⁻'],
  'A hydrogen atom that has lost its electron is just a proton.');
T('C2.36-04', 'A base is a proton donor.', false,
  'False. A base is a proton <b>acceptor</b>. An acid is a proton donor.');
M('C2.45-04', 'Where in the Bunsen flame should the wire be held for a flame test?',
  ['In the edge of a blue (roaring) flame', 'Inside the yellow safety flame', 'Below the flame, near the gas tap', 'Inside the cold blue cone at the base'],
  'A hot, non-luminous flame shows the colour clearly.');
M('C2.49-04', 'Which colour change shows that water is present when it is added to anhydrous copper(II) sulfate?',
  ['White to blue', 'Blue to white', 'Blue to pink', 'Colourless to green'],
  'Blue hydrated copper(II) sulfate forms.');
M('C2.50-04', 'Which is a <b>physical</b> test for pure water?',
  ['Measuring its boiling point', 'Adding anhydrous copper(II) sulfate', 'Adding universal indicator', 'Adding cobalt chloride paper'],
  'The other tests are chemical and only show that water is present.');
M('P1.17-04', 'What is the unit of force?',
  ['The newton (N)', 'The kilogram (kg)', 'The joule (J)', 'The watt (W)'],
  'F = m × a: 1 N is the force that gives 1 kg an acceleration of 1 m/s².');
M('P1.18-05', 'What is the unit of gravitational field strength?',
  ['N/kg', 'kg/N', 'm/s', 'N'],
  'g = W ÷ m, so its unit is newtons per kilogram. On Earth g ≈ 10 N/kg.');
T('P1.4-04', 'Speed is measured in metres per second (m/s).', true,
  'True. Speed = distance (m) ÷ time (s).');
M('P2.4-05', 'What is the unit of power?',
  ['The watt (W)', 'The volt (V)', 'The joule (J)', 'The ampere (A)'],
  '1 W = 1 joule per second.');
T('P2.21-04', 'Energy transferred is measured in watts.', false,
  'False. Energy is measured in joules (J). The watt is the unit of power: joules per second.');
M('P3.3-08', 'What is the unit of frequency?',
  ['The hertz (Hz)', 'The second (s)', 'The metre (m)', 'The metre per second (m/s)'],
  '1 Hz = one wave per second.');
T('P3.6-05', 'The time period of a wave is measured in hertz.', false,
  'False. Time period is measured in seconds (s). Frequency is measured in hertz (Hz).');
M('P3.15-05', 'In what unit are the angles of incidence and reflection measured?',
  ['Degrees (°)', 'Metres (m)', 'Hertz (Hz)', 'Newtons (N)'],
  'Angles are measured from the normal with a protractor.');
M('P7.13-05', 'A half-life is given as “8”. Which unit could it be in?',
  ['Days (any unit of time)', 'Becquerels', 'Counts', 'Metres'],
  'Half-life is a time: seconds, minutes, hours, days or years. Activity is measured in becquerels.');

/* ===================== BIOLOGY 2(c) Biological molecules (added 7 Nov 2026) ===================== */
M('B2.7-01', 'Which elements are found in carbohydrates?',
  ['Carbon, hydrogen and oxygen', 'Carbon, hydrogen and nitrogen', 'Carbon, oxygen and nitrogen', 'Hydrogen, oxygen and sulfur'],
  'Carbohydrates and lipids contain C, H and O only. Proteins also contain nitrogen.');
M('B2.7-02', 'Which type of molecule contains <b>nitrogen</b>?',
  ['Proteins', 'Carbohydrates', 'Lipids', 'Glucose'],
  'Proteins contain C, H, O and N (and sometimes S).');
T('B2.7-03', 'Lipids contain nitrogen.', false,
  'False. Lipids contain only carbon, hydrogen and oxygen. Proteins contain nitrogen.');
MH('B2.7-04', 'A food molecule contains carbon, hydrogen, oxygen and nitrogen. What could it be?',
  ['A protein', 'Starch', 'A fat', 'Glycogen'],
  'Only proteins contain nitrogen out of these.');
M('B2.8-01', 'Starch and glycogen are made from many molecules of…',
  ['simple sugars (glucose)', 'amino acids', 'fatty acids and glycerol', 'nucleotides'],
  'Starch (plants) and glycogen (animals) are long chains of glucose.');
M('B2.8-02', 'What are proteins made from?',
  ['Amino acids', 'Glucose', 'Fatty acids and glycerol', 'Starch'],
  'Proteins are long chains of amino acids.');
M('B2.8-03', 'What are lipids made from?',
  ['Fatty acids and glycerol', 'Amino acids', 'Glucose', 'Glycogen'],
  'A lipid (fat or oil) is made of glycerol joined to fatty acids.');
T('B2.8-04', 'Glycogen is made from amino acids.', false,
  'False. Glycogen is made from glucose (a simple sugar).');
M('B2.9-01', 'Which reagent is used to test for <b>starch</b>?',
  ['Iodine solution', 'Benedict’s solution', 'Biuret solution', 'Ethanol'],
  'Iodine turns from orange-brown to blue-black.');
M('B2.9-02', 'What is the positive result of Benedict’s test for glucose?',
  ['Blue changes to brick red after heating', 'Orange-brown changes to blue-black', 'Blue changes to purple', 'A cloudy white emulsion forms'],
  'The solution is heated in a water bath. Green, yellow and orange show smaller amounts of sugar.');
M('B2.9-03', 'What is the positive result of the biuret test for protein?',
  ['Blue changes to purple (lilac)', 'Blue changes to brick red', 'Orange-brown changes to blue-black', 'Colourless changes to cloudy white'],
  'Biuret solution stays blue if there is no protein.');
M('B2.9-04', 'How do you test a food for fat?',
  ['Shake with ethanol, then add water: a cloudy white emulsion', 'Add iodine solution: it turns from orange-brown to blue-black', 'Heat with Benedict’s solution: it turns from blue to brick red', 'Add biuret solution: it turns from blue to purple'],
  'This is the emulsion test.');
MH('B2.9-05', 'Which food test needs heating?',
  ['Benedict’s test for glucose', 'Iodine test for starch', 'Biuret test for protein', 'Emulsion test for fat'],
  'The Benedict’s mixture is heated in a water bath at about 80 °C. Use a water bath, not a flame.');
M('B2.10-01', 'What is an enzyme?',
  ['A biological catalyst that speeds up reactions', 'A hormone that controls growth', 'A type of carbohydrate that stores energy', 'A cell that fights infection'],
  'Enzymes are proteins that speed up metabolic reactions without being used up.');
T('B2.10-02', 'Enzymes are used up in the reactions they catalyse.', false,
  'False. Like all catalysts, enzymes are not used up; they can be used again and again.');
M('B2.10-03', 'What type of molecule are enzymes?',
  ['Proteins', 'Carbohydrates', 'Lipids', 'Minerals'],
  'Enzymes are proteins, so their shape can be changed by heat and pH.');
MH('B2.10-04', 'Why are enzymes needed in living cells?',
  ['They speed up reactions that would be far too slow at body temperature', 'They raise the body temperature so that reactions are able to happen', 'They provide the energy that is needed for every reaction in the cell', 'They are the raw materials that are used up in metabolic reactions'],
  'Without enzymes, metabolic reactions would be too slow to keep us alive.');
M('B2.11-01', 'What happens to an enzyme at a temperature well above its optimum?',
  ['Its active site changes shape (it is denatured)', 'It works faster than ever, because molecules move faster', 'It turns into a different enzyme with a new job', 'It is used up more quickly, so more must be made'],
  'The substrate no longer fits the active site, so the rate falls.');
M('B2.11-02', 'Why does the rate of an enzyme reaction increase from 10 °C to 30 °C?',
  ['Molecules move faster, so they collide more often', 'The active site gets bigger, so more substrate fits', 'More enzyme is made by the cells as it warms up', 'The substrate changes shape to fit the active site'],
  'More kinetic energy → more collisions between enzyme and substrate.');
M('B2.11-03', 'What is the optimum temperature for most human enzymes?',
  ['About 37 °C', 'About 0 °C', 'About 100 °C', 'About 60 °C'],
  'Body temperature.');
T('B2.11-04', 'A denatured enzyme starts working again when it is cooled down.', false,
  'False. Denaturing is permanent: the active site has changed shape and does not go back.');
MH('B2.11-05', 'An enzyme is kept at 5 °C and works very slowly. It is then warmed to 37 °C. What happens?',
  ['It works faster, because the cold did not denature it', 'It stays slow, because the cold denatured its active site', 'It stops working, because warming always denatures enzymes', 'It speeds up only if some fresh enzyme is added as well'],
  'Low temperatures slow enzymes down but do not change the shape of the active site.');
M('B2.12-01', 'In the amylase and starch experiment, how do you know when all the starch has been digested?',
  ['A drop no longer turns iodine blue-black', 'The mixture turns brick red on heating', 'Bubbles of gas stop forming in the tube', 'The mixture turns purple with biuret'],
  'Samples are added to iodine on a spotting tile every 30 seconds.');
M('B2.12-02', 'How are the different temperatures kept steady in the enzyme practical?',
  ['Using water baths', 'Using a Bunsen burner', 'By stirring quickly', 'By adding ice to the tubes'],
  'Each tube is left in a water bath at a set temperature.');
MH('B2.12-03', 'Why are the enzyme and starch solutions left in the water bath for a few minutes before being mixed?',
  ['So both reach the right temperature before the reaction starts', 'So the enzyme is denatured before the starch is added', 'So the starch has time to dissolve fully in the water', 'So the iodine can react with the starch before mixing'],
  'Otherwise the reaction would start at the wrong temperature.');
T('B2.12-04', 'In the enzyme practical, the volume and concentration of the enzyme should be kept the same.', true,
  'True. Only the temperature should be changed for a fair test.');
M('B2.13-01', 'Why does a change in pH affect an enzyme?',
  ['It can change the shape of the active site', 'It makes the enzyme molecules move faster', 'It adds extra substrate to the reaction', 'It changes the temperature of the enzyme'],
  'Away from its optimum pH, the substrate no longer fits as well.');
M('B2.13-02', 'The enzyme pepsin works in the stomach. What is its likely optimum pH?',
  ['About 2', 'About 7', 'About 9', 'About 14'],
  'The stomach is acidic because of hydrochloric acid.');
T('B2.13-03', 'All enzymes have the same optimum pH.', false,
  'False. Each enzyme has its own optimum pH, matching where it works (e.g. pepsin ~2, amylase ~7).');
MH('B2.13-04', 'Amylase from saliva enters the stomach. What happens to it?',
  ['It stops working, because the acid changes its active site', 'It works faster, because acid is its optimum pH', 'It turns into pepsin and starts digesting protein', 'It carries on working at exactly the same rate'],
  'Salivary amylase works best around pH 7.');

/* ===================== BIOLOGY 2(d) Movement of substances into and out of cells (added 7 Nov 2026) ===================== */
M('B2.15-01', 'What is <b>diffusion</b>?',
  ['The net movement of particles from a high to a low concentration', 'The movement of water through a membrane only', 'Movement against a concentration gradient using energy', 'The movement of particles from a low to a high concentration'],
  'Diffusion is passive: it needs no energy from respiration.');
M('B2.15-02', 'What is <b>osmosis</b>?',
  ['Net movement of water through a partially permeable membrane, dilute → concentrated', 'Net movement of any substance from a high to a low concentration, through any membrane', 'Movement of glucose into cells against a concentration gradient, using energy', 'Net movement of water through a partially permeable membrane, concentrated → dilute'],
  'Water moves from where there is more water (dilute solution) to where there is less (concentrated solution).');
M('B2.15-03', 'What is <b>active transport</b>?',
  ['Movement against a concentration gradient, using energy from respiration', 'Movement down a concentration gradient, without using any energy', 'Movement of water across a partially permeable membrane by osmosis', 'Movement of gas particles spreading out evenly across a room'],
  'For example, root hair cells take up mineral ions from dilute soil water.');
T('B2.15-04', 'Active transport does not need any energy.', false,
  'False. Active transport needs energy from respiration, because it moves substances against a concentration gradient.');
MH('B2.15-05', 'Root hair cells take in nitrate ions even when the soil has a lower concentration of nitrate than the cell. Which process is this?',
  ['Active transport', 'Diffusion', 'Osmosis', 'Transpiration'],
  'Moving ions from low to high concentration needs energy.');
M('B2.16-01', 'Which change would make diffusion into a cell <b>faster</b>?',
  ['A steeper concentration gradient', 'A lower temperature', 'A longer diffusion distance', 'A smaller surface area'],
  'Also: higher temperature, shorter distance and larger surface area.');
M('B2.16-02', 'Which cube has the largest surface area to volume ratio?',
  ['1 cm cube', '2 cm cube', '3 cm cube', '4 cm cube'],
  'A 1 cm cube: SA 6 cm², volume 1 cm³ → 6 : 1. Bigger cubes have smaller ratios.');
MH('B2.16-03', 'Why do large organisms need specialised exchange surfaces, while single cells do not?',
  ['They have a small surface area to volume ratio, so diffusion is too slow', 'They have a large surface area to volume ratio, so they lose too much water', 'Large organisms do not use oxygen, so they need a different way to get food', 'Diffusion is faster over long distances, so they need to slow it down'],
  'As size increases, volume grows faster than surface area.');
T('B2.16-04', 'Lowering the temperature speeds up diffusion.', false,
  'False. Higher temperatures speed up diffusion; lower temperatures slow it down.');
M('B2.17-01', 'Potato cylinders are placed in different sugar solutions. Why are the cylinders weighed before and after?',
  ['To measure the mass change caused by water moving in or out', 'To see how much sugar the potato makes in the solution', 'To find out the temperature of each sugar solution', 'To measure the rate of photosynthesis in the potato'],
  'A gain in mass means water entered; a loss means water left.');
MH('B2.17-02', 'A potato cylinder loses mass in a concentrated sugar solution. Why?',
  ['Water leaves the cells by osmosis into the more concentrated solution', 'Sugar leaves the potato cells by diffusion into the solution', 'The potato cells respire and use up their stored starch', 'Water enters the potato cells by osmosis from the solution'],
  'Water moves from the dilute cell contents to the concentrated solution.');
M('B2.17-03', 'In the potato osmosis practical, why are the cylinders blotted dry before reweighing?',
  ['To remove surface solution that would add extra mass', 'To speed up osmosis so the results are quicker', 'To kill the potato cells so they stop changing', 'To stop the potato turning brown in the air'],
  'Only water inside the potato should be measured.');
T('B2.17-04', 'Visking tubing can be used as a model of a partially permeable membrane.', true,
  'True. Small molecules like water and glucose pass through; large ones like starch cannot.');

/* ===================== BIOLOGY 2(e) Nutrition (added 7 Nov 2026) ===================== */
M('B2.18-01', 'In photosynthesis, which energy change happens?',
  ['Light energy to chemical energy', 'Chemical energy to light energy', 'Heat energy to light energy', 'Chemical energy to kinetic energy'],
  'Light energy is absorbed by chlorophyll and stored as chemical energy in glucose.');
M('B2.18-02', 'Why is photosynthesis important for nearly all life on Earth?',
  ['It makes food (glucose) and releases oxygen', 'It removes oxygen from the air', 'It releases energy from glucose', 'It produces carbon dioxide for animals'],
  'Producers make the food that feeds food chains.');
T('B2.18-03', 'Photosynthesis happens in the mitochondria.', false,
  'False. Photosynthesis happens in the chloroplasts. Mitochondria are where aerobic respiration happens.');
M('B2.19-01', 'What is the word equation for photosynthesis?',
  ['carbon dioxide + water → glucose + oxygen', 'glucose + oxygen → carbon dioxide + water', 'carbon dioxide + oxygen → glucose + water', 'glucose + water → carbon dioxide + oxygen'],
  'Light energy and chlorophyll are needed.');
M('B2.19-02', 'Which is the balanced symbol equation for photosynthesis?',
  ['6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O', 'CO₂ + H₂O → C₆H₁₂O₆ + O₂', '6CO₂ + 6O₂ → C₆H₁₂O₆ + 6H₂O'],
  'The reverse of aerobic respiration.');
MH('B2.19-03', 'Where do the raw materials for photosynthesis come from?',
  ['CO₂ from the air through stomata; water from the soil through roots', 'CO₂ from the soil through roots; water from the air through stomata', 'Both CO₂ and water from the soil, taken in through the roots', 'Both CO₂ and water from the air, taken in through the stomata'],
  'Water travels up the xylem to the leaves.');
M('B2.20-01', 'What is a <b>limiting factor</b> in photosynthesis?',
  ['The factor in shortest supply, which stops the rate going higher', 'Any factor that damages or kills the plant if there is too much', 'The amount of oxygen in the air around the leaves', 'The colour of the leaf, which decides which light is absorbed'],
  'Light intensity, carbon dioxide concentration and temperature can all be limiting.');
M('B2.20-02', 'On a sunny, cold morning, which factor is most likely to limit photosynthesis?',
  ['Temperature', 'Light intensity', 'Oxygen concentration', 'Water in the leaf'],
  'Enzymes in photosynthesis work slowly when it is cold.');
MH('B2.20-03', 'Increasing light intensity no longer increases the rate of photosynthesis. What could explain this?',
  ['Another factor, such as CO₂ or temperature, is now limiting', 'The plant has run out of chlorophyll in its leaves', 'Light always stops having any effect above a set level', 'The plant has stopped respiring, so it has no energy'],
  'Once light is not limiting, increasing it further has no effect.');
T('B2.20-04', 'Very high temperatures can slow down photosynthesis.', true,
  'True. The enzymes involved can be denatured.');
M('B2.21-01', 'Why is the leaf’s palisade layer near the top surface?',
  ['To absorb as much light as possible, with its many chloroplasts', 'To store water near the surface where the leaf loses most', 'To let carbon dioxide out of the leaf as quickly as possible', 'To protect the cells underneath from insects and disease'],
  'Palisade cells are packed with chloroplasts.');
M('B2.21-02', 'What is the role of the air spaces in the spongy mesophyll?',
  ['Gases can diffuse quickly to and from the cells', 'They store the glucose made in photosynthesis', 'They absorb the light that passes the palisade', 'They carry water up from the roots to the leaf'],
  'They give a large surface area for gas exchange.');
M('B2.21-03', 'What controls the opening and closing of stomata?',
  ['Guard cells', 'Palisade cells', 'Xylem vessels', 'The waxy cuticle'],
  'Stomata let carbon dioxide in and oxygen and water vapour out.');
MH('B2.21-04', 'Why are most leaves broad and thin?',
  ['Broad: large area to absorb light; thin: short distance for gases', 'Broad: stores more water; thin: lets more light pass straight through', 'Broad: keeps the leaf warm; thin: makes the leaf lighter to hold up', 'Broad: reduces water loss; thin: lets the wind cool the leaf down'],
  'Both features increase the rate of photosynthesis.');
T('B2.21-05', 'The waxy cuticle on a leaf reduces water loss.', true,
  'True. It is transparent so light can still pass through.');
M('B2.22-01', 'Why do plants need <b>magnesium</b> ions?',
  ['To make chlorophyll', 'To make amino acids', 'To make cellulose', 'To make starch'],
  'Magnesium deficiency causes yellow leaves.');
M('B2.22-02', 'Why do plants need <b>nitrate</b> ions?',
  ['To make amino acids and proteins', 'To make chlorophyll for the leaves', 'To make glucose in photosynthesis', 'To make the cellulose cell walls'],
  'Nitrate deficiency causes poor, stunted growth.');
MH('B2.22-03', 'A plant has yellow leaves and grows poorly. Which mineral ion is it most likely short of?',
  ['Magnesium (needed for chlorophyll)', 'Nitrate (needed for starch)', 'Calcium (needed for glucose)', 'Sodium (needed for cellulose)'],
  'Without enough chlorophyll the leaves turn yellow and photosynthesise less.');
T('B2.22-04', 'Plants absorb mineral ions from the soil through their roots.', true,
  'True. Often by active transport.');
M('B2.23-01', 'In the starch test on a leaf, why is the leaf boiled in ethanol?',
  ['To remove the chlorophyll so the colour change shows', 'To kill any bacteria living on the leaf surface', 'To add starch to the leaf so the test works', 'To make the iodine react faster with the starch'],
  'The leaf is first boiled in water to kill it, then warmed in ethanol (in a water bath, as ethanol is flammable).');
M('B2.23-02', 'A plant is kept in the dark for 48 hours before an experiment. Why?',
  ['To destarch it, so any starch found later was made in the experiment', 'To make it grow faster once it is put back into the light', 'To make it produce more chlorophyll in its leaves', 'To stop it respiring so it does not use up its glucose'],
  'Without light, the plant uses up its stored starch.');
MH('B2.23-03', 'A variegated leaf (green and white) is tested for starch. Which parts turn blue-black?',
  ['Only the parts that were green', 'Only the white parts', 'The whole leaf', 'None of the leaf'],
  'The white parts have no chlorophyll, so they cannot photosynthesise.');
M('B2.23-04', 'How can you show that pondweed gives off oxygen in photosynthesis?',
  ['Collect the gas and show it relights a glowing splint', 'Collect the gas and show it turns limewater milky', 'Collect the gas and show it burns with a squeaky pop', 'Show the water turns blue-black when iodine is added'],
  'Counting bubbles also measures the rate of photosynthesis.');
T('B2.23-05', 'Sodium hydroxide can be placed with a plant to remove carbon dioxide from the air around it.', true,
  'True. This shows that carbon dioxide is needed for photosynthesis.');
M('B2.24-01', 'Which list shows everything in a balanced diet?',
  ['Carbohydrate, protein, lipid, vitamins, minerals, water and fibre', 'Carbohydrate, protein and lipid, with no need for anything else', 'Vitamins, minerals and water, which together give all our energy', 'Protein, fibre and water, with carbohydrate only for athletes'],
  'All seven are needed in appropriate proportions.');
T('B2.24-02', 'A balanced diet means eating equal amounts of every food group.', false,
  'False. It means eating each nutrient in the right proportions, not equal amounts.');
MH('B2.24-03', 'Why can eating too much food lead to health problems even if it is all “healthy” food?',
  ['Extra energy is stored as fat, which can lead to obesity', 'Healthy foods contain no energy, so the body runs short', 'Eating too much food stops the gut from digesting it', 'The body cannot store any extra nutrients, so they are wasted'],
  'Energy intake should match energy use.');
M('B2.24-04', 'Why is water an important part of the diet?',
  ['It is needed for chemical reactions and to transport substances', 'It provides lots of energy for respiration in the cells', 'It is used to build and repair muscle and other tissues', 'It contains fibre, which helps food move through the gut'],
  'Most chemical reactions in the body take place in solution.');
M('B2.25-01', 'What is the main function of <b>protein</b> in the diet?',
  ['Growth and repair of cells', 'Giving quick energy', 'Helping food move through the gut', 'Helping blood to clot'],
  'Sources include meat, fish, eggs and beans.');
M('B2.25-02', 'Which vitamin is needed to absorb calcium and keep bones strong?',
  ['Vitamin D', 'Vitamin A', 'Vitamin C', 'Iron'],
  'Lack of vitamin D causes rickets. It is made in the skin in sunlight and found in oily fish.');
M('B2.25-03', 'Why is <b>iron</b> needed in the diet?',
  ['To make haemoglobin in red blood cells', 'To make bones and teeth hard and strong', 'To help food move through the gut', 'To prevent scurvy and keep gums healthy'],
  'Lack of iron causes anaemia. Sources include red meat and spinach.');
M('B2.25-04', 'What does <b>dietary fibre</b> do?',
  ['Helps food move through the gut and prevents constipation', 'Provides most of the energy we need for respiration', 'Builds and repairs cells, especially in growing children', 'Carries oxygen around the body in the blood'],
  'Fibre gives the gut muscles something to push against.');
M('B2.25-05', 'Which vitamin helps prevent scurvy?',
  ['Vitamin C', 'Vitamin A', 'Vitamin D', 'Calcium'],
  'Found in citrus fruit. Needed for healthy skin and gums.');
MH('B2.25-06', 'Vitamin A is found in carrots and liver. What is it needed for?',
  ['Good vision, especially in dim light', 'Strong bones and teeth', 'Healthy skin and gums', 'Making haemoglobin'],
  'Lack of vitamin A can cause night blindness.');
M('B2.26-01', 'Who needs the most energy from food each day?',
  ['A very active teenage athlete', 'An elderly person who sits most of the day', 'A young child', 'An office worker who does no exercise'],
  'Energy needs increase with activity level and during growth.');
M('B2.26-02', 'Why does a pregnant woman need more energy in her diet?',
  ['To provide energy for the growing fetus', 'Because she becomes less active', 'To make her own bones grow longer', 'Because her cells stop respiring'],
  'She also needs extra protein, calcium and iron.');
T('B2.26-03', 'Energy requirements vary with age, activity and pregnancy.', true,
  'True.');
MH('B2.26-04', 'Why do teenagers often need more energy than adults of the same activity level?',
  ['They are still growing', 'They have a lower body temperature', 'They respire less', 'They have smaller muscles'],
  'Growth uses energy and materials.');
M('B2.27-01', 'Which organ makes amylase, protease and lipase and releases them into the small intestine?',
  ['The pancreas', 'The liver', 'The gall bladder', 'The large intestine'],
  'Pancreatic juice enters the duodenum.');
M('B2.27-02', 'What is the main job of the <b>colon</b> (large intestine)?',
  ['Absorbing water from undigested food', 'Digesting protein with pepsin', 'Producing and storing bile', 'Absorbing glucose into the blood'],
  'The rectum then stores the faeces until egestion.');
M('B2.27-03', 'Where are most digested food molecules absorbed into the blood?',
  ['The ileum (small intestine)', 'The stomach', 'The oesophagus', 'The rectum'],
  'The ileum has villi with a huge surface area.');
M('B2.27-04', 'Which part of the alimentary canal contains hydrochloric acid?',
  ['The stomach', 'The duodenum', 'The mouth', 'The colon'],
  'The acid kills bacteria and gives the best pH for pepsin.');
T('B2.27-05', 'The oesophagus carries food from the mouth to the stomach.', true,
  'True. Food is pushed along it by peristalsis.');
M('B2.28-01', 'What is <b>peristalsis</b>?',
  ['Waves of muscle contraction that push food along the gut', 'The breakdown of fat into small droplets by bile', 'The absorption of digested food into the villi', 'The chewing and grinding of food by the teeth'],
  'Circular and longitudinal muscles contract in waves.');
T('B2.28-02', 'Peristalsis only happens in the oesophagus.', false,
  'False. It happens all along the alimentary canal.');
MH('B2.28-03', 'How does fibre help peristalsis?',
  ['It adds bulk for the gut muscles to push against', 'It contains enzymes that digest food faster', 'It makes the gut muscles relax and stretch', 'It is absorbed into the blood to give energy'],
  'Low-fibre diets can lead to constipation.');
M('B2.28-04', 'Which muscles in the gut wall contract to cause peristalsis?',
  ['Circular and longitudinal muscles', 'Skeletal muscles in the abdomen', 'The diaphragm and intercostal muscles', 'The heart muscle'],
  'Contracting circular muscle behind the food squeezes it forward.');
M('B2.29-01', 'Which enzyme digests starch into maltose?',
  ['Amylase', 'Protease', 'Lipase', 'Maltase'],
  'Maltase then digests maltose into glucose.');
M('B2.29-02', 'What are the products of lipid digestion?',
  ['Fatty acids and glycerol', 'Amino acids', 'Glucose', 'Maltose'],
  'Lipases break down lipids.');
M('B2.29-03', 'What do protease enzymes produce?',
  ['Amino acids', 'Glucose', 'Fatty acids', 'Starch'],
  'Proteases break proteins into amino acids.');
MH('B2.29-04', 'Why must large molecules like starch be digested before they are absorbed?',
  ['They are too big to pass through the gut wall into the blood', 'They are poisonous until enzymes break them down', 'They would dissolve the walls of the blood vessels', 'They contain no energy until they are digested'],
  'Only small, soluble molecules can be absorbed.');
T('B2.29-05', 'Maltase digests starch into maltose.', false,
  'False. Amylase digests starch into maltose; maltase then digests maltose into glucose.');
M('B2.30-01', 'Where is bile made?',
  ['In the liver', 'In the gall bladder', 'In the pancreas', 'In the stomach'],
  'Bile is made in the liver and stored in the gall bladder.');
T('B2.30-02', 'Bile is made in the gall bladder.', false,
  'False. Bile is made in the liver and stored in the gall bladder.');
M('B2.30-03', 'Which organ <b>stores</b> bile?',
  ['The gall bladder', 'The liver', 'The pancreas', 'The small intestine'],
  'Bile is made in the liver.');
MH('B2.30-04', 'A person has their gall bladder removed. Can they still digest fat?',
  ['Yes, less efficiently: the liver still makes bile, but it can’t be stored', 'No: bile is made in the gall bladder, so none would be produced', 'Yes, normally: the gall bladder digests protein, not fat', 'No: lipase is made in the gall bladder, so fat can’t be digested'],
  'The bile drips into the intestine continuously instead.');
M('B2.31-01', 'How does bile help the digestion of fats?',
  ['It emulsifies fats into droplets, increasing the surface area for lipase', 'It is an enzyme that breaks fats down into fatty acids and glycerol', 'It absorbs the fats straight into the blood through the villi', 'It makes the fats more acidic so stomach enzymes can digest them'],
  'Bile is not an enzyme.');
M('B2.31-02', 'Why is bile alkaline?',
  ['To neutralise stomach acid entering the small intestine', 'To digest proteins that the stomach did not break down', 'To kill bacteria that survive the stomach acid', 'To make food move faster along the small intestine'],
  'Enzymes in the small intestine work best at a slightly alkaline pH.');
T('B2.31-03', 'Bile is an enzyme that breaks fat down into fatty acids and glycerol.', false,
  'False. Bile emulsifies fat; the enzyme lipase does the chemical digestion.');
MH('B2.31-04', 'Why does emulsifying fat speed up its digestion?',
  ['Smaller droplets have a larger surface area for lipase', 'It turns the fat into amino acids, which are easier to absorb', 'It raises the temperature in the small intestine', 'It lowers the pH to the optimum for lipase'],
  'More surface area → more contact with the enzyme.');
M('B2.32-01', 'How are villi adapted for absorption?',
  ['Large surface area, thin walls and a good blood supply', 'Thick walls and few blood vessels, to stop leaks', 'A small surface area, to save energy in the gut', 'A waxy coating, to stop food sticking to them'],
  'Each villus also has a lacteal that absorbs fatty acids and glycerol.');
M('B2.32-02', 'Why are the walls of villi only one cell thick?',
  ['To give a short distance for absorption', 'To make the villi strong and rigid', 'To stop large food particles passing', 'To store fat inside each villus'],
  'Shorter diffusion distance → faster absorption.');
MH('B2.32-03', 'What is the role of the dense network of capillaries in each villus?',
  ['To carry absorbed food away, keeping a steep concentration gradient', 'To digest the food using enzymes made in the blood', 'To produce the enzymes that are released into the gut', 'To squeeze food along the gut by pumping blood'],
  'Removing absorbed molecules keeps diffusion fast.');
T('B2.32-04', 'Microvilli on the cells of villi increase the surface area even more.', true,
  'True.');

/* ===================== BIOLOGY 2(f) Respiration (added 7 Nov 2026) ===================== */
M('B2.34-01', 'What does respiration produce that cells use as their energy source?',
  ['ATP', 'Glucose', 'Oxygen', 'Carbon dioxide'],
  'Respiration releases energy from glucose to make ATP.');
T('B2.34-02', 'Respiration is the same as breathing.', false,
  'False. Respiration is a chemical reaction in cells that releases energy. Breathing (ventilation) moves air in and out of the lungs.');
MH('B2.34-03', 'Which cells respire?',
  ['All living cells, in plants and animals, all the time', 'Only animal cells, because plants photosynthesise instead', 'Only plant cells, and only when it is dark', 'Only muscle cells, and only during exercise'],
  'Plants respire day and night.');
M('B2.34-04', 'Where in the cell does aerobic respiration take place?',
  ['Mitochondria', 'Nucleus', 'Chloroplasts', 'Cell membrane'],
  'Cells that need lots of energy have many mitochondria.');
M('B2.35-01', 'What is ATP used for in cells?',
  ['Providing energy for processes such as muscle contraction', 'Storing the genetic information that controls the cell', 'Making the cellulose that strengthens the cell wall', 'Absorbing the light energy needed for photosynthesis'],
  'ATP is the energy carrier in cells.');
T('B2.35-02', 'ATP provides energy for cells.', true,
  'True.');
MH('B2.35-03', 'Which process directly uses energy from ATP?',
  ['Active transport', 'Diffusion', 'Osmosis', 'The spreading of a smell'],
  'Diffusion and osmosis are passive.');
M('B2.35-04', 'Which of these uses energy released in respiration?',
  ['Building proteins from amino acids', 'Diffusion of oxygen into the blood', 'Osmosis into root hair cells', 'Light passing through a leaf'],
  'Making large molecules needs energy.');
M('B2.36-01', 'Which is true of <b>anaerobic</b> respiration compared with aerobic respiration?',
  ['It releases less energy per glucose and needs no oxygen', 'It releases more energy and needs oxygen', 'It releases the same energy but makes no waste', 'It only happens in plants'],
  'Aerobic respiration releases much more energy.');
M('B2.36-02', 'When do human muscles respire anaerobically?',
  ['During hard exercise, when not enough oxygen reaches them', 'When resting, because breathing slows down', 'Only while asleep, when the lungs are inactive', 'Never: human muscles always respire aerobically'],
  'Lactic acid builds up and causes muscle fatigue.');
MH('B2.36-03', 'Why does aerobic respiration release more energy than anaerobic respiration?',
  ['Glucose is broken down completely to carbon dioxide and water', 'It uses more glucose for each reaction than anaerobic does', 'It happens much faster than anaerobic respiration', 'It does not need any enzymes to break glucose down'],
  'In anaerobic respiration, glucose is only partly broken down.');
T('B2.36-04', 'Anaerobic respiration needs oxygen.', false,
  'False. Anaerobic respiration happens without oxygen; aerobic respiration needs it.');
M('B2.37-01', 'What is the word equation for aerobic respiration?',
  ['glucose + oxygen → carbon dioxide + water', 'carbon dioxide + water → glucose + oxygen', 'glucose → lactic acid', 'glucose → ethanol + carbon dioxide'],
  'Energy is released (as ATP).');
M('B2.37-02', 'Which is the balanced symbol equation for aerobic respiration?',
  ['C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O', '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', 'C₆H₁₂O₆ + O₂ → CO₂ + H₂O', 'C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂'],
  'This is the reverse of the photosynthesis equation.');
T('B2.37-03', 'Aerobic respiration produces carbon dioxide and water.', true,
  'True.');
M('B2.38-01', 'What is the word equation for anaerobic respiration in animals?',
  ['glucose → lactic acid', 'glucose → ethanol + carbon dioxide', 'glucose + oxygen → carbon dioxide + water', 'glucose → lactic acid + carbon dioxide'],
  'No carbon dioxide is made in animal anaerobic respiration.');
M('B2.38-02', 'What is the word equation for anaerobic respiration in plants (and yeast)?',
  ['glucose → ethanol + carbon dioxide', 'glucose → lactic acid', 'glucose + oxygen → ethanol', 'carbon dioxide + water → glucose'],
  'This is fermentation, used to make bread rise and in brewing.');
MH('B2.38-03', 'Yeast is used to make bread rise. Which product of anaerobic respiration does this?',
  ['Carbon dioxide', 'Ethanol', 'Lactic acid', 'Oxygen'],
  'Bubbles of CO₂ get trapped in the dough. The ethanol evaporates during baking.');
T('B2.38-04', 'Anaerobic respiration in human muscles produces carbon dioxide.', false,
  'False. In animals, anaerobic respiration produces only lactic acid.');
M('B2.39-01', 'Germinating peas are put in a vacuum flask with a thermometer. What is the control?',
  ['A flask of boiled (dead) peas', 'A flask with no thermometer', 'A flask in the dark', 'A flask of dry, ungerminated peas only'],
  'Boiled peas cannot respire, so any temperature rise in the test flask is due to respiration. (Both are rinsed in disinfectant to kill microbes.)');
M('B2.39-02', 'Hydrogencarbonate indicator is red in normal air. What colour does it turn when carbon dioxide levels rise?',
  ['Yellow', 'Purple', 'Blue-black', 'Brick red'],
  'More CO₂ makes it more acidic: red → orange → yellow. Less CO₂ turns it purple.');
MH('B2.39-03', 'Why are the seeds in the respiration experiment rinsed in disinfectant?',
  ['To kill microorganisms, whose respiration would also release heat', 'To speed up germination so the seeds respire faster', 'To feed the seeds with extra sugar for respiration', 'To stop the seeds absorbing water from the air'],
  'Then only the seeds’ respiration is measured.');
T('B2.39-04', 'Limewater can be used to show that respiring organisms release carbon dioxide.', true,
  'True. It turns milky (cloudy).');

/* ===================== BIOLOGY 2(g) Gas exchange (added 7 Nov 2026) ===================== */
M('B2.46-01', 'Which list shows the path air takes into the lungs?',
  ['Trachea → bronchi → bronchioles → alveoli', 'Bronchi → trachea → alveoli → bronchioles', 'Alveoli → bronchioles → bronchi → trachea', 'Trachea → bronchioles → alveoli → bronchi'],
  'The trachea branches into two bronchi, then many bronchioles, ending in alveoli.');
M('B2.46-02', 'What is the job of the pleural membranes?',
  ['To reduce friction as the lungs move', 'To carry air into the lungs', 'To exchange gases with the blood', 'To push air out of the lungs'],
  'Fluid between the membranes lets the lungs slide smoothly against the ribs.');
M('B2.46-03', 'What separates the thorax from the abdomen?',
  ['The diaphragm', 'The ribs', 'The trachea', 'The pleural membranes'],
  'The diaphragm is a sheet of muscle below the lungs.');
T('B2.46-04', 'The intercostal muscles are found between the ribs.', true,
  'True. "Inter" means between and "costal" means ribs.');
M('B2.47-01', 'What happens when you breathe in?',
  ['Intercostal muscles and diaphragm contract; chest volume increases', 'Intercostal muscles and diaphragm relax; chest volume increases', 'Intercostal muscles contract; diaphragm relaxes; volume decreases', 'Diaphragm moves up; chest volume decreases'],
  'The ribs move up and out and the diaphragm flattens, so the pressure inside falls and air flows in.');
M('B2.47-02', 'Why does air flow into the lungs when the chest volume increases?',
  ['The pressure inside falls below atmospheric pressure', 'The pressure inside rises above atmospheric pressure', 'The lungs suck the air in by themselves', 'The alveoli push the air inwards'],
  'Air moves from higher to lower pressure.');
MH('B2.47-03', 'What happens to the diaphragm when you breathe out (at rest)?',
  ['It relaxes and moves up into a dome shape', 'It contracts and flattens downwards', 'It contracts and moves up', 'It stays still while the ribs move'],
  'Relaxing the diaphragm and intercostal muscles reduces the chest volume, raising the pressure.');
T('B2.47-04', 'When you breathe in, the diaphragm relaxes and moves up.', false,
  'False. When you breathe in, the diaphragm contracts and flattens. It relaxes and domes up when you breathe out.');
M('B2.48-01', 'Which feature of alveoli helps gas exchange?',
  ['Walls one cell thick, giving a short diffusion distance', 'Thick walls, which stop the alveoli bursting', 'Few capillaries, so the blood moves slowly past', 'A dry surface, so gases do not dissolve'],
  'Alveoli also have a huge surface area, a moist lining and a rich blood supply.');
M('B2.48-02', 'Why do the lungs contain millions of alveoli?',
  ['To give a very large surface area for gas exchange', 'To make the lungs heavier and more stable', 'To store oxygen for use during exercise', 'To filter dust out of the air'],
  'More surface area → faster diffusion.');
MH('B2.48-03', 'How does breathing (ventilation) help gas exchange in the alveoli?',
  ['It keeps the oxygen concentration high in the alveoli, so the gradient stays steep', 'It pushes oxygen through the alveolus walls by force, so it enters faster', 'It cools the blood in the lungs so that it can carry more oxygen', 'It removes water from the alveoli so that the walls stay dry'],
  'Blood flow on the other side keeps carrying oxygen away, maintaining the gradient too.');
T('B2.48-04', 'Oxygen moves from the alveoli into the blood by active transport.', false,
  'False. Oxygen moves by diffusion, from high concentration in the alveoli to low concentration in the blood.');
M('B2.49-01', 'Which substance in tobacco smoke reduces the amount of oxygen the blood can carry?',
  ['Carbon monoxide', 'Tar', 'Nicotine', 'Carbon dioxide'],
  'Carbon monoxide combines with haemoglobin in red blood cells.');
M('B2.49-02', 'How does tar in cigarette smoke harm the lungs?',
  ['It contains carcinogens and damages cilia, so mucus builds up', 'It makes the alveolus walls thicker, so they are less likely to burst', 'It reduces the amount of nicotine that gets into the blood', 'It speeds up the heart rate by acting as a hormone'],
  'Tar can cause lung cancer and bronchitis.');
MH('B2.49-03', 'Smokers with emphysema are often breathless. Why?',
  ['The alveolus walls break down, so there is less surface for gas exchange', 'Their alveoli fill up with extra oxygen that the blood cannot use', 'Their blood carries too much oxygen, which harms the muscles', 'Their diaphragm stops working, so they cannot breathe in'],
  'Fewer, larger air spaces mean less oxygen gets into the blood.');
M('B2.49-04', 'How can smoking increase the risk of coronary heart disease?',
  ['Nicotine and carbon monoxide damage arteries and raise blood pressure', 'Tar blocks the trachea, so less air reaches the heart muscle', 'Smoke lowers the heart rate so far that the heart muscle weakens', 'Smoking increases the number of alveoli, which strains the heart'],
  'This can lead to fatty deposits that narrow the coronary arteries.');
T('B2.49-05', 'Nicotine is the addictive substance in tobacco smoke.', true,
  'True. It also increases heart rate and narrows blood vessels.');
M('B2.50-01', 'How could you show that exhaled air contains more carbon dioxide than inhaled air?',
  ['Bubble both through limewater and see which turns milky faster', 'Test both with a glowing splint and see which relights', 'Test both with damp red litmus paper', 'Hold a lighted splint in both and listen for a pop'],
  'Hydrogencarbonate indicator also works: it turns yellow faster with exhaled air.');
M('B2.50-02', 'What happens to breathing rate during exercise?',
  ['It increases, to supply more oxygen and remove more carbon dioxide', 'It decreases, so the muscles get less oxygen', 'It stays the same, because the heart does the extra work', 'It stops for a short time'],
  'Breathing also gets deeper.');
MH('B2.50-03', 'A student counts breaths per minute at rest and after exercise. Why should she wait until her breathing returns to normal before repeating?',
  ['So each test starts from the same resting rate', 'So her muscles have time to grow between tests', 'So the room temperature has time to change', 'So she can practise breathing faster next time'],
  'Starting from the same baseline makes the results comparable.');
T('B2.50-04', 'During exercise, both breathing rate and depth of breathing increase.', true,
  'True.');

/* ===================== BIOLOGY 2(h) Transport (added 7 Nov 2026) ===================== */
M('B2.51-01', 'Why can a single-celled organism like <i>Amoeba</i> rely on diffusion alone?',
  ['It has a large surface area to volume ratio and short distances', 'It has a small surface area to volume ratio and long distances', 'It does not need oxygen or food at all', 'It has a heart that pumps substances around it'],
  'Substances can diffuse to every part quickly enough.');
T('B2.51-02', 'Single-celled organisms have a large surface area compared with their volume.', true,
  'True.');
MH('B2.51-03', 'If an <i>Amoeba</i> grew much larger, why might diffusion no longer supply it with enough oxygen?',
  ['Its volume would increase faster than its surface area', 'Its surface area would increase faster than its volume', 'Oxygen cannot diffuse into larger cells at all', 'Larger cells need no oxygen'],
  'Its surface area to volume ratio would fall and the distances to the centre would increase.');
M('B2.51-04', 'What limits the size of single-celled organisms?',
  ['Diffusion becomes too slow over larger distances', 'They cannot absorb enough light for their energy', 'They run out of DNA once they grow past a set size', 'They would need a skeleton to hold a larger shape'],
  'Diffusion is only fast over short distances.');
M('B2.52-01', 'Why do large multicellular organisms need a transport system?',
  ['Their small surface area to volume ratio and long distances make diffusion too slow', 'Their large surface area to volume ratio makes them lose too much water', 'Their cells do not need oxygen, so it must be removed', 'They cannot carry out diffusion at all'],
  'Blood (animals) and xylem and phloem (plants) carry substances long distances.');
T('B2.52-02', 'Humans can rely on diffusion alone to get oxygen to all their cells.', false,
  'False. The distances are too great, so we need lungs, blood and a heart.');
MH('B2.52-03', 'Which two features do all transport systems of large organisms have?',
  ['A network of vessels and a way of moving substances through them', 'A heart to pump blood and a pair of lungs to add oxygen to it', 'Xylem to carry water and phloem to carry sugars around', 'Large surface areas and no need for any vessels at all'],
  'Plants move substances by transpiration and translocation; animals pump blood.');
M('B2.52-04', 'Why does a whale need a circulatory system but a bacterium does not?',
  ['Most whale cells are too far from the surface for diffusion', 'Bacteria are larger than whales, so they need no transport', 'Whales do not respire, so they need a system to bring food', 'Bacteria have tiny hearts that pump their cytoplasm around'],
  'Diffusion is fast only over very short distances.');
M('B2.53-01', 'What does phloem transport?',
  ['Sucrose and amino acids', 'Water and mineral ions', 'Oxygen and carbon dioxide', 'Starch and cellulose'],
  'Phloem carries food made in the leaves to other parts of the plant.');
M('B2.53-02', 'In which direction(s) can phloem carry substances?',
  ['Both up and down the plant', 'Only up from the roots', 'Only down from the leaves', 'Only sideways into leaves'],
  'Sucrose goes wherever it is needed: growing tips, roots, fruits and storage organs.');
T('B2.53-03', 'Phloem transports water from the roots to the leaves.', false,
  'False. That is xylem. Phloem transports sucrose and amino acids.');
MH('B2.53-04', 'A ring of bark (containing phloem) is removed from a tree trunk. What happens to the roots over time?',
  ['They are starved of sugars from the leaves and eventually die', 'They receive more water than usual, so they swell and burst', 'They grow faster, because more sugar stays in the trunk', 'Nothing happens to them, because xylem carries their food'],
  'Sucrose can no longer travel down past the ring.');
M('B2.54-01', 'What does xylem transport?',
  ['Water and mineral ions', 'Sucrose and amino acids', 'Oxygen only', 'Starch and glucose'],
  'Xylem carries water and minerals from the roots to the rest of the plant.');
M('B2.54-02', 'In which direction does xylem carry water?',
  ['Up from the roots to the leaves', 'Down from the leaves to the roots', 'Both up and down', 'Only into the flowers'],
  'Water is lost from the leaves and replaced from below.');
T('B2.54-03', 'Xylem transports sucrose to the roots.', false,
  'False. Xylem transports water and mineral ions upwards. Phloem transports sucrose.');
MH('B2.54-04', 'A celery stalk is stood in water with red dye. Where does the red colour appear when the stalk is cut across?',
  ['In the xylem vessels', 'In the phloem only', 'Evenly through the whole stalk', 'Only in the outer skin'],
  'The dyed water travels up the xylem.');
M('B2.59-01', 'Which is the liquid part of the blood?',
  ['Plasma', 'Platelets', 'Red blood cells', 'White blood cells'],
  'Blood = red cells, white cells, platelets and plasma.');
M('B2.59-02', 'What do platelets do?',
  ['Help the blood to clot', 'Carry oxygen', 'Make antibodies', 'Carry carbon dioxide'],
  'They are fragments of cells that help seal wounds.');
T('B2.59-03', 'Blood is made of red blood cells, white blood cells, platelets and plasma.', true,
  'True.');
MH('B2.59-04', 'A blood sample is spun in a centrifuge. Which part makes up just over half the volume?',
  ['Plasma', 'Red blood cells', 'White blood cells', 'Platelets'],
  'Plasma is about 55% of blood; red cells make up most of the rest.');
M('B2.60-01', 'Which substance is carried in the <b>plasma</b>?',
  ['Urea', 'Oxygen bound to haemoglobin', 'Haemoglobin', 'Antibodies inside red cells'],
  'Plasma carries carbon dioxide, digested food, urea, hormones and heat energy.');
M('B2.60-02', 'How are hormones carried around the body?',
  ['Dissolved in the plasma', 'Inside red blood cells', 'Along nerves', 'Attached to platelets'],
  'Hormones travel in the blood to their target organs.');
T('B2.60-03', 'Plasma transports heat energy around the body.', true,
  'True. This helps spread heat from active organs.');
MH('B2.60-04', 'Glucose absorbed in the small intestine needs to reach the brain. How does it travel?',
  ['Dissolved in the plasma', 'Inside red blood cells', 'Carried by white blood cells', 'Along the nerves'],
  'Digested food molecules dissolve in the plasma.');
M('B2.61-01', 'Why do red blood cells have no nucleus?',
  ['There is more room for haemoglobin', 'So they can divide more quickly', 'So they can make antibodies', 'So they can respire aerobically'],
  'More haemoglobin means more oxygen carried.');
M('B2.61-02', 'Why are red blood cells a biconcave disc shape?',
  ['To give a large surface area for oxygen to diffuse in and out', 'To store more glucose for the cell to use in respiration', 'To help them stick together when a clot needs to form', 'To help them surround and engulf invading bacteria'],
  'The shape also lets them squeeze through capillaries.');
M('B2.61-03', 'What does haemoglobin do?',
  ['It combines with oxygen to carry it around the body', 'It digests bacteria that enter the bloodstream', 'It makes antibodies to fight specific pathogens', 'It helps the blood clot to seal wounds quickly'],
  'Oxygen + haemoglobin → oxyhaemoglobin in the lungs; it releases the oxygen in the tissues.');
T('B2.61-04', 'Red blood cells have a large nucleus.', false,
  'False. Red blood cells have no nucleus, which leaves more room for haemoglobin.');
M('B2.62-01', 'What do <b>phagocytes</b> do?',
  ['Engulf and digest pathogens', 'Produce antibodies', 'Carry oxygen', 'Help blood to clot'],
  'Phagocytes are a type of white blood cell.');
M('B2.62-02', 'What do <b>lymphocytes</b> do?',
  ['Produce antibodies specific to a pathogen', 'Engulf pathogens and digest them inside', 'Carry carbon dioxide back to the lungs', 'Transport hormones to their target organs'],
  'Antibodies fit the specific antigens on a particular pathogen.');
T('B2.62-03', 'One type of antibody can destroy every type of pathogen.', false,
  'False. Antibodies are specific: each fits only one particular antigen.');
MH('B2.62-04', 'Why do people rarely catch measles twice?',
  ['Lymphocytes remember it and make antibodies quickly next time', 'Phagocytes stop working after the first measles infection', 'The measles virus cannot get into the body a second time', 'Red blood cells carry measles antibodies for the rest of life'],
  'Memory lymphocytes give a faster, bigger response, so the person is immune.');
M('B2.65-01', 'Which chamber of the heart pumps blood to the body?',
  ['The left ventricle', 'The right ventricle', 'The left atrium', 'The right atrium'],
  'The left ventricle pumps oxygenated blood into the aorta.');
M('B2.65-02', 'Why does the left ventricle have a thicker muscle wall than the right ventricle?',
  ['It pumps blood all round the body, so it needs a higher pressure', 'It pumps blood only to the lungs, which are further away', 'It receives blood from the body, so it must hold more', 'It contains more valves that need support'],
  'The right ventricle only pumps blood to the nearby lungs.');
M('B2.65-03', 'What is the job of the valves in the heart?',
  ['To stop blood flowing backwards', 'To pump blood around the body', 'To add oxygen to the blood', 'To control the heart rate'],
  'Valves make sure blood flows one way: atria → ventricles → arteries.');
MH('B2.65-04', 'Which blood vessel carries oxygenated blood from the lungs to the heart?',
  ['The pulmonary vein', 'The pulmonary artery', 'The vena cava', 'The aorta'],
  'It is the only vein that carries oxygenated blood.');
T('B2.65-05', 'The right side of the heart pumps oxygenated blood to the body.', false,
  'False. The left side pumps oxygenated blood to the body; the right side pumps deoxygenated blood to the lungs.');
M('B2.66-01', 'Why does heart rate increase during exercise?',
  ['To deliver more oxygen and glucose to muscles and remove CO₂', 'To cool the body by pumping blood away from the skin', 'Because the muscles need less oxygen while exercising', 'To slow down respiration so the muscles do not tire'],
  'Muscles respire faster during exercise.');
M('B2.66-02', 'Which hormone increases heart rate when you are frightened?',
  ['Adrenaline', 'Insulin', 'Oestrogen', 'Testosterone'],
  'Adrenaline prepares the body for "fight or flight".');
MH('B2.66-03', 'A fit person’s heart rate returns to normal more quickly after exercise than an unfit person’s. Why?',
  ['Their heart pumps more blood each beat, so it recovers sooner', 'Their heart has no valves, so blood flows through more easily', 'Their muscles produce no carbon dioxide during exercise', 'Their blood has no plasma, so it is easier to pump'],
  'Training strengthens the heart muscle.');
T('B2.66-04', 'Adrenaline slows the heart down.', false,
  'False. Adrenaline speeds up the heart rate.');
M('B2.67-01', 'Which of these increases the risk of coronary heart disease?',
  ['A diet high in saturated fat', 'Regular exercise', 'Not smoking', 'A diet high in fibre'],
  'Other risk factors: smoking, high blood pressure, lack of exercise, obesity and stress.');
M('B2.67-02', 'What happens in coronary heart disease?',
  ['Fatty deposits narrow the coronary arteries, so heart muscle gets less oxygen', 'The heart valves stop working, so blood flows backwards into the atria', 'The lungs fill with fluid, so gas exchange stops and the heart weakens', 'The blood stops clotting, so the heart cannot seal small leaks'],
  'This can cause a heart attack.');
MH('B2.67-03', 'Why does regular exercise lower the risk of coronary heart disease?',
  ['It helps control weight and blood pressure and lowers cholesterol', 'It makes the coronary arteries narrower so blood flows faster', 'It raises blood pressure so the heart muscle gets stronger', 'It stops the heart ever beating fast, which protects it'],
  'Lack of exercise is a major risk factor.');
T('B2.67-04', 'Smoking increases the risk of coronary heart disease.', true,
  'True.');
M('B2.68-01', 'Which blood vessels have thick, muscular, elastic walls?',
  ['Arteries', 'Veins', 'Capillaries', 'All of them equally'],
  'Arteries carry blood at high pressure away from the heart.');
M('B2.68-02', 'Why do veins have valves?',
  ['To stop blood flowing backwards, because the pressure is low', 'To pump blood away from the heart towards the organs', 'To let oxygen diffuse out of the blood into the tissues', 'To make blood flow faster in veins than in arteries'],
  'Veins carry blood back to the heart at low pressure.');
M('B2.68-03', 'Why are capillary walls only one cell thick?',
  ['To give a short distance for substances to diffuse', 'To withstand the very high pressure of the blood', 'To stop blood flowing backwards to the arteries', 'To carry blood back to the heart as fast as possible'],
  'Capillaries are where exchange with the tissues happens.');
MH('B2.68-04', 'Which vessel has a large lumen (space inside) and thin walls?',
  ['A vein', 'An artery', 'A capillary', 'The aorta'],
  'A large lumen reduces resistance to the slow, low-pressure blood.');
M('B2.69-01', 'Which blood vessel carries blood from the heart to the lungs?',
  ['The pulmonary artery', 'The pulmonary vein', 'The aorta', 'The vena cava'],
  'Arteries carry blood away from the heart.');
M('B2.69-02', 'Which blood vessel carries blood to the kidneys?',
  ['The renal artery', 'The renal vein', 'The hepatic vein', 'The pulmonary artery'],
  '"Renal" means kidney; "hepatic" means liver.');
M('B2.69-03', 'Which vessel brings deoxygenated blood from the body back to the heart?',
  ['The vena cava', 'The aorta', 'The pulmonary vein', 'The renal artery'],
  'It empties into the right atrium.');
MH('B2.69-04', 'Why is human circulation called a <b>double</b> circulation?',
  ['Blood goes through the heart twice in each full circuit of the body', 'There are two separate hearts, one for each side of the body', 'Every organ is supplied by two arteries instead of one', 'Blood flows in both directions in every blood vessel'],
  'One circuit to the lungs, one to the rest of the body.');

/* ===================== BIOLOGY 2(i) Excretion (added 7 Nov 2026) ===================== */
M('B2.70-01', 'In bright light, which gas does a leaf give out overall?',
  ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Water vapour only'],
  'Photosynthesis is faster than respiration, so there is a net release of oxygen.');
M('B2.70-02', 'In the dark, which gas does a leaf give out?',
  ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'],
  'Only respiration is happening.');
M('B2.70-03', 'Through which structures are waste gases lost from a leaf?',
  ['Stomata', 'Xylem vessels', 'Root hairs', 'Chloroplasts'],
  'Stomata are pores, mostly on the lower surface.');
MH('B2.70-04', 'Where does the oxygen given out by a leaf come from?',
  ['It is a waste product of photosynthesis', 'It is a waste product of respiration', 'It is absorbed from the soil', 'It is made from nitrogen'],
  'Carbon dioxide is the waste product of respiration.');
T('B2.70-05', 'Plants only respire at night.', false,
  'False. Plants respire all the time, day and night.');
M('B2.71-01', 'What do the kidneys excrete?',
  ['Urea, excess water and excess ions', 'Carbon dioxide and water vapour', 'Undigested food and fibre', 'Bile and digestive enzymes'],
  'Urea is made in the liver from excess amino acids.');
M('B2.71-02', 'What do the lungs excrete?',
  ['Carbon dioxide (and water vapour)', 'Urea and excess salts', 'Undigested food', 'Oxygen and nitrogen'],
  'Carbon dioxide is a waste product of respiration.');
M('B2.71-03', 'Which organ excretes sweat containing water, salts and a little urea?',
  ['The skin', 'The lungs', 'The liver', 'The small intestine'],
  'The skin, lungs and kidneys are organs of excretion.');
T('B2.71-04', 'Removing faeces is an example of excretion.', false,
  'False. Faeces are mostly undigested food that never entered the cells. Getting rid of them is egestion.');

/* ===================== BIOLOGY 2(j) Co-ordination and response (added 7 Nov 2026) ===================== */
M('B2.80-01', 'Why do organisms need to respond to changes in their environment?',
  ['To increase their chances of survival', 'To use up any spare energy they have', 'To make themselves grow more slowly', 'To stop themselves from reproducing'],
  'For example, moving away from danger or towards food.');
T('B2.80-02', 'Plants as well as animals respond to changes in their environment.', true,
  'True. For example, shoots grow towards light.');
M('B2.80-03', 'A woodlouse moves from a dry, bright area into a damp, dark one. What is this?',
  ['A response to a change in the environment', 'An example of excretion of waste products', 'An example of photosynthesis in animals', 'Homeostasis happening inside its cells'],
  'Damp, dark places help woodlice avoid drying out and being eaten.');
MH('B2.80-04', 'Which is an example of an organism responding to a change in its <b>external</b> environment?',
  ['A cat’s pupils shrinking in bright light', 'Insulin lowering blood glucose after a meal', 'The kidneys making more concentrated urine', 'Cells respiring to make ATP'],
  'The other three are responses to internal changes.');
M('B2.81-01', 'What is <b>homeostasis</b>?',
  ['Keeping a constant internal environment', 'Responding to the direction of light', 'Growing in response to gravity', 'Producing offspring of the same kind'],
  'Examples: body temperature and body water content.');
M('B2.81-02', 'Which of these is an example of homeostasis?',
  ['Keeping body temperature at about 37 °C', 'Digesting a meal in the stomach', 'Growing taller during puberty', 'Breathing faster when scared'],
  'Body water content is another example.');
T('B2.81-03', 'Body water content is controlled by homeostasis.', true,
  'True. The kidneys play a major part.');
MH('B2.81-04', 'Why is it important to keep body temperature close to 37 °C?',
  ['Enzymes work best near 37 °C and could be denatured if too hot', 'Cells stop respiring completely once the body is above 30 °C', 'Blood would start to freeze if the body went above 37 °C', 'Hormones can only be made at exactly 37 °C and no other'],
  'Too cold slows enzymes; too hot denatures them.');
M('B2.82-01', 'What is the correct order of a co-ordinated response?',
  ['Stimulus → receptor → effector → response', 'Receptor → stimulus → response → effector', 'Effector → receptor → stimulus → response', 'Stimulus → effector → receptor → response'],
  'A co-ordinator (e.g. the brain) links the receptor and effector.');
M('B2.82-02', 'What is an <b>effector</b>?',
  ['A muscle or gland that produces a response', 'A cell that detects a stimulus', 'A change in the environment', 'A nerve that carries impulses to the brain'],
  'Muscles contract; glands secrete.');
M('B2.82-03', 'What is a <b>receptor</b>?',
  ['A cell or organ that detects a stimulus', 'A muscle that contracts to make a response', 'A gland that releases a hormone into blood', 'A change in the environment, such as light'],
  'For example, light receptors in the retina.');
T('B2.82-04', 'A stimulus is a change in the environment that an organism can detect.', true,
  'True.');
M('B2.83-01', 'Which stimulus do plant shoots respond to by growing towards it?',
  ['Light', 'Gravity', 'Darkness', 'Wind'],
  'This is positive phototropism.');
T('B2.83-02', 'Plants do not respond to stimuli because they have no nervous system.', false,
  'False. Plants respond to stimuli such as light and gravity, using hormones such as auxin.');
M('B2.83-03', 'Why is it useful for a plant shoot to grow towards light?',
  ['It can absorb more light for photosynthesis', 'It can absorb more water through its leaves', 'It can reach more minerals in the air', 'It avoids being reached by pollinators'],
  'More light → more photosynthesis → more glucose.');
MH('B2.83-04', 'Which two stimuli are plant roots and shoots mainly responding to when a seed germinates underground?',
  ['Gravity and light', 'Sound and touch', 'Temperature and sound', 'Oxygen and nitrogen'],
  'Roots grow down (gravity); shoots grow up and towards light.');
M('B2.84-01', 'How do roots respond to gravity?',
  ['They grow downwards (positive geotropism)', 'They grow upwards (negative geotropism)', 'They grow sideways', 'They do not respond'],
  'Shoots show negative geotropism: they grow upwards, against gravity.');
M('B2.84-02', 'What is <b>phototropism</b>?',
  ['A growth response to light', 'A growth response to gravity', 'A response to touch', 'The making of food using light'],
  'Shoots are positively phototropic.');
M('B2.84-03', 'How do plant shoots respond to gravity?',
  ['They grow upwards, away from gravity', 'They grow downwards, towards gravity', 'They grow sideways along the ground', 'They do not respond to gravity'],
  'This is negative geotropism.');
MH('B2.84-04', 'A seedling is laid on its side in the dark. What happens after a few days?',
  ['The shoot bends upwards and the root bends downwards', 'The shoot and root both bend downwards', 'The shoot and root both grow straight sideways', 'The shoot bends downwards and the root upwards'],
  'With no light, the responses are to gravity.');
M('B2.85-01', 'Where is auxin made in a shoot?',
  ['In the shoot tip', 'In the roots', 'In the leaves only', 'In the flowers'],
  'It moves down from the tip.');
M('B2.85-02', 'When light comes from one side, how does auxin make a shoot bend towards it?',
  ['Auxin collects on the shaded side, making those cells elongate more', 'Auxin collects on the lit side, making those cells grow more', 'Auxin is destroyed on the shaded side, so the lit side grows', 'Auxin makes the cells on the lit side shrink'],
  'Faster growth on the shaded side bends the shoot towards the light.');
T('B2.85-03', 'Auxin is a plant hormone.', true,
  'True. It controls the phototropic response of shoots.');
MH('B2.85-04', 'A shoot tip is covered with a foil cap and lit from one side. What happens?',
  ['It grows straight up: the covered tip can’t detect the light', 'It bends towards the light even more strongly than usual', 'It bends away from the light, towards the darker side', 'It stops growing, because auxin can no longer be made'],
  'The tip detects light and makes auxin; covering it prevents the response.');
M('B2.86-01', 'How does nervous communication compare with hormonal communication?',
  ['Nervous: faster, short-lived. Hormonal: slower, longer-lasting', 'Nervous: slower, longer-lasting. Hormonal: faster, short-lived', 'Both equally fast, and both use chemicals carried in the blood', 'Nervous uses the blood; hormonal uses electrical impulses in nerves'],
  'Nerves use electrical impulses; hormones travel in the blood.');
M('B2.86-02', 'How do hormones travel to their target organs?',
  ['In the blood', 'Along nerves', 'Through the air', 'Through the gut'],
  'Hormones are made in glands and carried in the plasma.');
T('B2.86-03', 'Hormonal responses are usually faster than nervous responses.', false,
  'False. Nervous responses are faster; hormonal responses are slower but last longer.');
MH('B2.86-04', 'Which response is most likely to be controlled by hormones?',
  ['Changes at puberty over several years', 'Pulling your hand away from a flame', 'Blinking when something flies at your eye', 'Catching a ball'],
  'Hormonal effects are slow and long-lasting.');
M('B2.87-01', 'What makes up the central nervous system (CNS)?',
  ['The brain and spinal cord', 'The brain and the eyes', 'All the nerves in the body', 'The spinal cord and the muscles'],
  'Nerves link the CNS to sense organs and effectors.');
T('B2.87-02', 'The central nervous system is made of the brain and spinal cord.', true,
  'True.');
M('B2.87-03', 'What links the sense organs to the central nervous system?',
  ['Nerves', 'Blood vessels', 'Hormones', 'Muscles'],
  'Nerves are bundles of neurones.');
MH('B2.87-04', 'A person’s spinal cord is damaged in the neck. Why might they lose feeling in their legs?',
  ['Impulses from the legs can no longer reach the brain', 'The legs stop making blood cells after the injury', 'Hormones can no longer travel to the leg muscles', 'The receptors in the legs are all destroyed'],
  'The spinal cord carries impulses between the body and the brain.');
M('B2.88-01', 'In what form is information carried along nerves?',
  ['Electrical impulses', 'Hormones in the blood', 'Sound waves', 'Light signals'],
  'This makes nervous responses rapid.');
M('B2.88-02', 'Which neurones carry impulses <b>from</b> receptors to the CNS?',
  ['Sensory neurones', 'Motor neurones', 'Relay neurones', 'Hormone neurones'],
  'Motor neurones carry impulses from the CNS to effectors.');
T('B2.88-03', 'Sensory neurones carry impulses from the CNS to effectors.', false,
  'False. Motor neurones carry impulses to effectors. Sensory neurones carry impulses from receptors to the CNS.');
MH('B2.88-04', 'Light enters the eye and you press a button. Put the path in order.',
  ['Receptor → sensory neurone → CNS → motor neurone → effector', 'Effector → motor neurone → CNS → sensory neurone → receptor', 'Receptor → motor neurone → CNS → sensory neurone → effector', 'CNS → receptor → sensory neurone → effector → motor neurone'],
  'Sensory in, motor out.');
M('B2.89-01', 'What is a <b>synapse</b>?',
  ['A small gap between two neurones', 'The end of a muscle', 'A type of receptor in the skin', 'A gland that makes hormones'],
  'Impulses cross the gap using chemicals.');
M('B2.89-02', 'How does an impulse cross a synapse?',
  ['Neurotransmitter diffuses across the gap and starts an impulse in the next neurone', 'The electrical impulse jumps straight across the gap to the next neurone', 'Blood flowing through the gap carries the impulse to the next neurone', 'The two neurones touch at the synapse and pass the impulse directly'],
  'This also makes sure impulses travel in one direction only.');
MH('B2.89-03', 'Why can impulses only travel one way across a synapse?',
  ['Neurotransmitter is released by one side and detected only by the other', 'The gap is too wide for impulses to cross in the opposite direction', 'Impulses can only travel downwards, towards the feet', 'Synapses contain valves that stop impulses going backwards'],
  'Only the first neurone releases neurotransmitter; only the second has receptors for it.');
T('B2.89-04', 'Neurotransmitters cross a synapse by diffusion.', true,
  'True.');
M('B2.90-01', 'In the reflex arc for pulling a finger away from a hot object, what is the effector?',
  ['A muscle in the arm', 'The temperature receptor in the skin', 'The spinal cord', 'The relay neurone'],
  'The muscle contracts to move the hand away.');
M('B2.90-02', 'Why are reflexes fast?',
  ['The impulse does not go through the conscious part of the brain', 'Reflexes use hormones', 'Reflexes involve no neurones', 'Impulses travel faster in the arm than in the brain'],
  'The pathway goes through the spinal cord via a relay neurone.');
M('B2.90-03', 'Which neurone in a reflex arc is found inside the spinal cord, linking the other two?',
  ['The relay neurone', 'The sensory neurone', 'The motor neurone', 'The optic nerve'],
  'Receptor → sensory → relay → motor → effector.');
MH('B2.90-04', 'Why are reflexes useful?',
  ['They protect the body by acting automatically and quickly', 'They let us think carefully before deciding what to do', 'They only work when we are asleep, to keep us safe', 'They control how fast we grow during childhood'],
  'Thinking would take too long when touching something hot.');
M('B2.91-01', 'Which part of the eye contains light receptors?',
  ['The retina', 'The cornea', 'The iris', 'The lens'],
  'Rods and cones in the retina detect light.');
M('B2.91-02', 'What does the iris do?',
  ['Controls the size of the pupil and so how much light enters', 'Focuses light onto the retina by changing its shape', 'Carries impulses from the retina to the brain', 'Protects the front of the eye and refracts light'],
  'The iris is the coloured part of the eye.');
M('B2.91-03', 'What carries impulses from the retina to the brain?',
  ['The optic nerve', 'The ciliary muscle', 'The suspensory ligaments', 'The cornea'],
  'The retina is the receptor; the brain interprets the image.');
MH('B2.91-04', 'Which two parts of the eye refract (bend) light to focus it on the retina?',
  ['The cornea and the lens', 'The iris and the pupil', 'The retina and the optic nerve', 'The ciliary muscle and the iris'],
  'The cornea does most of the bending; the lens fine-tunes the focus.');
M('B2.92-01', 'How does the eye focus on a <b>near</b> object?',
  ['Ciliary muscles contract, suspensory ligaments slacken, and the lens becomes fatter', 'Ciliary muscles relax, suspensory ligaments tighten, and the lens becomes thinner', 'The iris contracts, and the pupil gets bigger', 'The retina moves closer to the lens'],
  'A fatter lens bends light more.');
M('B2.92-02', 'What happens to the pupil in bright light?',
  ['It gets smaller, to protect the retina', 'It gets bigger, to let in more light', 'It stays the same size', 'It closes completely'],
  'The circular muscles of the iris contract.');
MH('B2.92-03', 'When you look at a distant object, what shape is the lens?',
  ['Thin: ciliary muscles relax and the ligaments pull tight', 'Fat: ciliary muscles contract and the ligaments slacken', 'Thin: ciliary muscles contract and the ligaments slacken', 'Fat: ciliary muscles relax and the ligaments pull tight'],
  'Distant objects need less refraction.');
T('B2.92-04', 'In dim light, the pupil gets smaller.', false,
  'False. In dim light the pupil gets larger, to let more light in.');
M('B2.93-01', 'How does sweating help cool the body?',
  ['Water in sweat evaporates, taking heat energy from the skin', 'Sweat reflects heat away from the skin', 'Sweat makes the blood vessels move closer to the skin', 'Sweat stops the body making heat'],
  'Evaporation uses heat energy from the body.');
M('B2.93-02', 'What is <b>vasodilation</b>?',
  ['Arterioles near the skin widen, so more heat is lost from the blood', 'Arterioles near the skin narrow, so less heat is lost from the blood', 'Blood vessels move nearer to the skin surface to lose more heat', 'Sweat glands stop making sweat so that the skin warms up'],
  'This happens when the body is too hot.');
M('B2.93-03', 'What happens to blood vessels in the skin when the body is too cold?',
  ['Arterioles narrow (vasoconstriction), so less heat is lost', 'Arterioles widen (vasodilation), so more heat is lost', 'Blood vessels move deeper into the body', 'Blood stops flowing completely'],
  'Shivering also releases heat from respiration in muscles.');
T('B2.93-04', 'In vasodilation, blood vessels move closer to the surface of the skin.', false,
  'False. Blood vessels do not move. The arterioles widen, so more blood flows through the capillaries near the surface.');
MH('B2.93-05', 'Why does a person look pale when they are very cold?',
  ['Vasoconstriction reduces blood flow to the skin surface', 'Their blood loses its haemoglobin in the cold', 'Sweating removes the colour from their skin', 'Vasodilation sends more blood to the skin surface'],
  'Less blood near the surface reduces heat loss.');
M('B2.94-01', 'Which hormone lowers blood glucose?',
  ['Insulin', 'Adrenaline', 'Testosterone', 'Oestrogen'],
  'Insulin is made in the pancreas; it makes the liver and muscles take up glucose and store it as glycogen.');
M('B2.94-02', 'Where is adrenaline made?',
  ['The adrenal glands', 'The pancreas', 'The testes', 'The ovaries'],
  'Adrenaline prepares the body for action: faster heart rate and more glucose in the blood.');
M('B2.94-03', 'Which hormone causes male secondary sexual characteristics, such as a deeper voice?',
  ['Testosterone', 'Oestrogen', 'Progesterone', 'Insulin'],
  'Testosterone is made in the testes.');
M('B2.94-04', 'Which hormone, made in the ovaries, maintains the lining of the uterus?',
  ['Progesterone', 'Testosterone', 'Insulin', 'Adrenaline'],
  'Oestrogen (also from the ovaries) causes female secondary sexual characteristics and repairs the uterus lining.');
MH('B2.94-05', 'A person’s pancreas makes too little insulin. What happens to their blood glucose after a meal?',
  ['It rises too high and stays high', 'It falls too low and stays low', 'It stays exactly at a normal level', 'It is converted into adrenaline'],
  'This is type 1 diabetes; it is treated with insulin injections.');
M('B2.18-04', 'Which substance absorbs the light energy for photosynthesis?',
  ['Chlorophyll', 'Haemoglobin', 'Starch', 'Cellulose'],
  'Chlorophyll is the green pigment in chloroplasts.');
MH('B2.19-04', 'In the photosynthesis equation, what are written above the arrow because they are needed but not used up?',
  ['Light and chlorophyll', 'Oxygen and glucose', 'Water and carbon dioxide', 'Starch and minerals'],
  'Light provides the energy; chlorophyll absorbs it.');
M('B2.37-04', 'Which substance is a <b>reactant</b> in aerobic respiration?',
  ['Oxygen', 'Carbon dioxide', 'Water', 'Lactic acid'],
  'glucose + oxygen → carbon dioxide + water.');

/* ===================== CHEMISTRY 3(a) Energetics (added 7 Nov 2026) ===================== */
M('C3.1-01', 'What is an <b>exothermic</b> reaction?',
  ['One that gives out heat energy to the surroundings', 'One that takes in heat energy from the surroundings', 'One that only happens when it is heated strongly', 'One that neither gives out nor takes in any energy'],
  'The temperature of the surroundings rises.');
M('C3.1-02', 'Which of these is <b>endothermic</b>?',
  ['Thermal decomposition of calcium carbonate', 'Burning methane in air', 'Neutralising an acid with an alkali', 'Magnesium reacting with acid'],
  'Thermal decomposition needs a constant supply of heat.');
T('C3.1-03', 'Combustion reactions are endothermic.', false,
  'False. Fuels give out heat energy when they burn, so combustion is exothermic.');
MH('C3.1-04', 'Ammonium nitrate dissolves in water and the beaker feels cold. What does this show?',
  ['Dissolving it is endothermic: heat is taken in from the water and surroundings', 'Dissolving it is exothermic: heat is given out to the surroundings', 'No energy change happens, the water was simply cold', 'The ammonium nitrate has reacted with oxygen in the air'],
  'Cold packs use endothermic dissolving.');
M('C3.1-05', 'In an exothermic reaction, what happens to the temperature of the reaction mixture?',
  ['It rises', 'It falls', 'It stays exactly the same', 'It falls, then rises sharply'],
  'Heat energy is released into the mixture and surroundings.');
M('C3.2-01', 'Why is a polystyrene cup with a lid used for calorimetry of reactions in solution?',
  ['It is a good insulator, so less heat is lost to the surroundings', 'It reacts with the solution to speed up the reaction', 'It conducts heat quickly to the thermometer', 'It stops the solution from changing colour'],
  'Heat loss is the main source of error.');
M('C3.2-02', 'What must be measured to find the heat energy change in a calorimetry experiment?',
  ['The mass of the water or solution and its temperature change', 'The volume of the gas given off and the time it takes', 'The mass of the solid and the colour of the solution', 'The starting temperature and the time the reaction lasts'],
  'Then use Q = mcΔT.');
MH('C3.2-03', 'In a combustion experiment, a spirit burner heats water in a copper can. Why is the result usually lower than the data-book value?',
  ['Much of the heat is lost to the surroundings instead of the water', 'Copper reacts with the fuel and absorbs its energy', 'The water gains more energy than the fuel releases', 'The thermometer always reads too high'],
  'Incomplete combustion also releases less energy than expected.');
T('C3.2-04', 'Stirring the solution during calorimetry makes the temperature reading less accurate.', false,
  'False. Stirring spreads the heat evenly, so the reading is more accurate.');
M('C3.3-01', '50 g of water warms by 10 °C. How much heat energy did it gain? (c = 4.2 J/g °C)',
  ['2100 J', '500 J', '210 J', '21 000 J'],
  'Q = m × c × ΔT = 50 × 4.2 × 10 = <b>2100 J</b>.');
M('C3.3-02', 'In Q = mcΔT, what does ΔT stand for?',
  ['The change in temperature', 'The final temperature', 'The time taken', 'The total energy'],
  'ΔT = final temperature − starting temperature.');
T('C3.3-03', 'In Q = mcΔT for a reaction in solution, m is the mass of the solution (or water) that is heated.', true,
  'True. Not the mass of the solid reactant.');
M('C3.4-01', 'What is the unit of molar enthalpy change, ΔH?',
  ['kJ/mol', 'J/g °C', 'kJ/g', 'mol/kJ'],
  'ΔH = −Q ÷ moles, usually given in kilojoules per mole.');
M('C3.4-02', 'Why is ΔH negative for an exothermic reaction?',
  ['The chemicals lose energy to the surroundings', 'The chemicals gain energy from the surroundings', 'The temperature of the surroundings falls', 'Fewer moles of product are made'],
  'Negative ΔH = exothermic; positive ΔH = endothermic.');
MH('C3.4-03', '0.05 mol of acid is neutralised and the solution gains 2800 J. What is ΔH?',
  ['−56 kJ/mol', '+56 kJ/mol', '−140 kJ/mol', '−0.14 kJ/mol'],
  'Q = 2.8 kJ. ΔH = −2.8 ÷ 0.05 = <b>−56 kJ/mol</b> (negative because it is exothermic).');
M('C3.8-01', 'Zinc powder is added to copper(II) sulfate solution in a polystyrene cup. The temperature rises from 20 °C to 32 °C. What type of change is this?',
  ['An exothermic displacement reaction', 'An endothermic displacement reaction', 'An endothermic neutralisation', 'A change with no energy transfer'],
  'The temperature rose, so heat energy was given out.');
M('C3.8-02', 'When measuring the temperature change of a neutralisation, why record the starting temperature of both solutions?',
  ['To find the true temperature change caused by the reaction', 'To work out the volume of each solution being mixed', 'To check that neither solution has become acidic', 'To find out how long the whole reaction will last'],
  'Use the average starting temperature if they differ.');
MH('C3.8-03', 'Which change would make a calorimetry result more accurate?',
  ['Adding a lid to the cup to reduce heat loss', 'Using a glass beaker instead of a polystyrene cup', 'Reading the thermometer only once at the end', 'Using a much larger volume of air in the cup'],
  'Less heat lost means the measured temperature change is closer to the true value.');
T('C3.8-04', 'Dissolving a salt in water always makes the temperature rise.', false,
  'False. Some salts, such as ammonium nitrate, dissolve endothermically and the temperature falls.');

/* ===================== CHEMISTRY 3(b) Rates of reaction (added 7 Nov 2026) ===================== */
M('C3.9-01', 'How can you measure the rate of reaction between marble chips and hydrochloric acid?',
  ['Measure the volume of gas given off over time with a gas syringe', 'Measure the colour of the acid at the start', 'Measure the mass of the marble chips before the start only', 'Measure the pH of the acid once, after an hour'],
  'Or measure the loss of mass as carbon dioxide escapes.');
M('C3.9-02', 'In the sodium thiosulfate and acid reaction, how is the rate measured?',
  ['Time how long it takes for a cross under the flask to disappear', 'Measure the volume of hydrogen gas given off every 10 s', 'Weigh the flask every minute to find the loss in mass', 'Measure the temperature rise of the mixture with a probe'],
  'A yellow precipitate of sulfur forms and hides the cross.');
MH('C3.9-03', 'In the marble chips experiment, why is a cotton wool plug put in the neck of the flask on the balance?',
  ['It lets carbon dioxide escape but stops acid spraying out', 'It stops any gas from escaping', 'It speeds up the reaction', 'It absorbs the carbon dioxide so it can be weighed'],
  'Mass lost = mass of CO₂ given off.');
T('C3.9-04', 'A catalyst can be investigated by comparing the rate of a reaction with and without it.', true,
  'True. For example, hydrogen peroxide decomposing with and without manganese(IV) oxide.');
M('C3.10-01', 'Which change would <b>slow down</b> a reaction?',
  ['Lowering the temperature', 'Using a catalyst', 'Using powder instead of lumps', 'Increasing the concentration of acid'],
  'The other three all speed reactions up.');
M('C3.10-02', 'Increasing the pressure of a reacting gas has what effect on the rate?',
  ['It increases the rate', 'It decreases the rate', 'It has no effect', 'It stops the reaction'],
  'The gas particles are closer together.');
T('C3.10-03', 'Using lumps instead of powder makes a reaction faster.', false,
  'False. Powder has a larger surface area, so it reacts faster than lumps of the same mass.');
MH('C3.10-04', 'Which graph line for volume of gas against time shows the fastest reaction?',
  ['The line with the steepest slope at the start', 'The line that starts latest', 'The flattest line', 'The line that ends at the lowest volume'],
  'The gradient of the line is the rate.');
M('C3.11-01', 'Why does increasing concentration increase the rate of reaction?',
  ['There are more particles in the same volume, so collisions are more frequent', 'The particles move faster, so every collision has more energy', 'The activation energy becomes lower, so more particles react', 'The particles become larger, so they are easier to collide with'],
  'More frequent collisions → more successful collisions per second.');
M('C3.11-02', 'Why does increasing temperature increase the rate of reaction?',
  ['Particles move faster, collide more often, and more collisions have enough energy to react', 'The particles become bigger, so they collide much more often than before', 'The activation energy is lowered, so every collision leads to a reaction', 'More particles are made in the same volume, so collisions are more frequent'],
  'Both the frequency and energy of collisions increase.');
MH('C3.11-03', 'Why does crushing marble chips into powder make them react faster with acid?',
  ['A larger surface area is exposed, so collisions with acid particles are more frequent', 'Crushing gives the particles more energy', 'Crushing lowers the activation energy', 'Powder has more particles in total than the same mass of lumps'],
  'Only particles on the surface can be hit.');
T('C3.11-04', 'For particles to react, they must collide with enough energy.', true,
  'True. The minimum energy needed is the activation energy.');
M('C3.12-01', 'What is a <b>catalyst</b>?',
  ['A substance that speeds up a reaction but is chemically unchanged at the end', 'A substance that speeds up a reaction and is used up as it does so', 'A substance that slows down a reaction and is unchanged at the end', 'A reactant that is added in excess so the reaction goes to completion'],
  'Catalysts can be reused.');
T('C3.12-02', 'A catalyst is used up during a reaction.', false,
  'False. A catalyst is chemically unchanged at the end of the reaction.');
M('C3.12-03', 'Which substance is used as a catalyst for the decomposition of hydrogen peroxide?',
  ['Manganese(IV) oxide', 'Sodium chloride', 'Copper(II) sulfate crystals', 'Calcium carbonate'],
  'It makes oxygen bubble off much faster.');
MH('C3.12-04', 'How could you show that manganese(IV) oxide is unchanged after catalysing a reaction?',
  ['Filter it off, dry it and show its mass is the same as at the start', 'Show that the reaction mixture has changed colour', 'Show that oxygen relights a glowing splint', 'Measure the temperature of the solution'],
  'Its mass and chemical identity are unchanged.');
M('C3.13-01', 'How does a catalyst speed up a reaction?',
  ['It provides an alternative pathway with a lower activation energy', 'It gives the particles more kinetic energy', 'It increases the concentration of the reactants', 'It raises the temperature of the mixture'],
  'More collisions now have enough energy to react.');
T('C3.13-02', 'A catalyst lowers the activation energy of a reaction.', true,
  'True. It does this by providing an alternative reaction pathway.');
MH('C3.13-03', 'On a reaction profile, how does the catalysed reaction differ from the uncatalysed one?',
  ['The peak (activation energy) is lower, but the reactants and products are at the same levels', 'The peak is the same height, but the products are at a much lower energy level', 'The peak is higher and the products end up at a lower energy level than before', 'There is no peak at all, and the products are at the same level as the reactants'],
  'A catalyst does not change the overall energy change.');
M('C3.13-04', 'What is the <b>activation energy</b> of a reaction?',
  ['The minimum energy particles need to collide and react', 'The total energy given out by the reaction', 'The energy stored in the products', 'The energy needed to melt the reactants'],
  'Catalysts lower it.');
M('C3.15-01', 'Large and small marble chips of the same total mass react with the same acid. Which gives off carbon dioxide faster?',
  ['The small chips', 'The large chips', 'Both the same', 'Neither reacts'],
  'Smaller chips have a larger total surface area.');
M('C3.15-02', 'In the marble chips practical, why must the total mass of chips be the same each time?',
  ['So that only one variable (size or concentration) is changed', 'So the reaction always takes one minute', 'So the acid changes colour at the same time', 'So that no gas is produced'],
  'This makes it a fair test.');
MH('C3.15-03', 'When the acid concentration is doubled (with excess marble), how does the final volume of CO₂ compare, if the volume of acid is the same?',
  ['It is doubled, because there is twice as much acid to react', 'It stays the same, because only the rate changes', 'It is halved', 'No gas is made'],
  'If acid is the limiting reactant, doubling its amount doubles the product.');
T('C3.15-04', 'Increasing the concentration of hydrochloric acid makes marble chips react faster.', true,
  'True. There are more acid particles in the same volume, so collisions are more frequent.');
M('C3.16-01', 'How is the rate of decomposition of hydrogen peroxide measured in the catalyst practical?',
  ['Collect the oxygen in a gas syringe and record its volume at regular times', 'Measure the temperature of the hydrogen peroxide only', 'Count the number of solid particles added', 'Measure the pH of the solution every minute'],
  'The best catalyst gives the fastest rate of oxygen production.');
M('C3.16-02', 'In the catalyst practical, what should be kept the same for each solid tested?',
  ['The mass of solid and the volume and concentration of hydrogen peroxide', 'The colour of the solid and the size of the flask used each time', 'The time taken to collect the gas and the volume of oxygen made', 'The temperature of the room and the type of solid being tested'],
  'Only the type of solid is changed.');
T('C3.16-03', 'Hydrogen peroxide decomposes to water and oxygen.', true,
  'True. 2H₂O₂ → 2H₂O + O₂.');
MH('C3.16-04', 'Two solids are tested. Solid A gives 40 cm³ of oxygen in 30 s; solid B gives 40 cm³ in 90 s. What can you conclude?',
  ['A is the better catalyst', 'B is the better catalyst', 'Neither is a catalyst', 'Both are equally good catalysts'],
  'A produced the same volume three times faster.');
M('C3.17-01', 'What does the symbol ⇌ show in an equation?',
  ['The reaction is reversible', 'The reaction is very fast', 'A catalyst is used', 'The reaction gives out heat'],
  'The products can react to re-form the reactants.');
T('C3.17-02', 'Once the products of a reversible reaction form, they can never turn back into the reactants.', false,
  'False. In a reversible reaction the products can react to re-form the reactants.');
M('C3.17-03', 'Which of these is a reversible reaction?',
  ['Heating hydrated copper(II) sulfate', 'Burning magnesium in oxygen', 'Burning methane in air', 'Neutralising hydrochloric acid with sodium hydroxide'],
  'Adding water to the white anhydrous solid turns it blue again.');
M('C3.18-01', 'Blue hydrated copper(II) sulfate is heated. What is seen?',
  ['It turns white as water is given off', 'It turns black as copper is formed', 'It turns green and melts', 'Nothing happens'],
  'CuSO₄·5H₂O ⇌ CuSO₄ + 5H₂O. Adding water reverses it.');
M('C3.18-02', 'Ammonium chloride is heated at the bottom of a test tube. What happens?',
  ['It decomposes into ammonia and hydrogen chloride, which re-form ammonium chloride at the cool top', 'It melts into a colourless liquid that then boils away completely out of the open tube', 'It reacts with oxygen to form a black solid that stays at the bottom of the test tube', 'It decomposes into nitrogen and chlorine gases, which escape and do not re-form a solid'],
  'NH₄Cl ⇌ NH₃ + HCl.');
MH('C3.18-03', 'Water is added to white anhydrous copper(II) sulfate. What else happens apart from the colour change?',
  ['The mixture gets hot, because the reverse reaction is exothermic', 'The mixture gets cold, because the reverse reaction is endothermic', 'A gas is given off', 'Nothing else happens'],
  'If the forward reaction is endothermic, the reverse is exothermic by the same amount.');
T('C3.18-04', 'The white solid that forms at the top of the tube when ammonium chloride is heated is ammonium chloride.', true,
  'True. Ammonia and hydrogen chloride recombine where the tube is cooler.');

/* ===================== PHYSICS 4 Energy resources and energy transfers (added 7 Nov 2026) ===================== */
M('P4.2-01', 'A stretched spring stores energy in which store?',
  ['Elastic potential', 'Gravitational potential', 'Chemical', 'Nuclear'],
  'Elastic stores fill when objects are stretched, squashed or bent.');
M('P4.2-02', 'A battery-powered torch is switched on. What is the main energy transfer?',
  ['Chemical store → (electrically) → light and thermal energy', 'Kinetic store → (mechanically) → chemical store', 'Nuclear store → (by heating) → kinetic store', 'Thermal store → (by radiation) → chemical store'],
  'The battery\'s chemical store empties.');
M('P4.2-03', 'Food and fuels are examples of which energy store?',
  ['Chemical', 'Thermal', 'Kinetic', 'Magnetic'],
  'Energy is released by chemical reactions such as respiration or combustion.');
T('P4.2-04', 'Energy cannot be transferred by sound.', false,
  'False. Sound is one way of transferring energy by radiation (waves).');
MH('P4.2-05', 'A ball is thrown straight up. Ignoring air resistance, which store increases as it rises?',
  ['Gravitational potential', 'Kinetic', 'Chemical', 'Elastic potential'],
  'Kinetic store empties into the gravitational store as it slows.');
M('P4.3-01', 'What does the principle of conservation of energy say?',
  ['Energy cannot be created or destroyed, only transferred', 'Energy is used up whenever a device does useful work', 'Energy is created when fuels are burned in a power station', 'Energy is always transferred usefully if the device is new'],
  'Total energy in = total energy out.');
M('P4.3-02', 'A motor is supplied with 500 J. It transfers 350 J to its kinetic store. How much is wasted?',
  ['150 J', '850 J', '350 J', '500 J'],
  'Total out = total in, so 500 − 350 = <b>150 J</b>, mostly by heating.');
T('P4.3-03', 'In a perfect energy transfer, some energy is destroyed.', false,
  'False. Energy is never destroyed; it is only transferred to other stores, often wasted.');
MH('P4.3-04', 'A falling ball lands and stops. Where has its kinetic energy gone?',
  ['Mostly to thermal stores of the ball and ground, and some to sound', 'It has been destroyed by the impact with the hard ground below', 'Back into the chemical store of the ball, ready to bounce again', 'Into the gravitational store of the ground, which stores it forever'],
  'The energy spreads out (dissipates) to the surroundings.');
M('P4.4-01', 'A lamp is supplied with 200 J and gives out 40 J of light. What is its efficiency?',
  ['0.2 (20%)', '0.4 (40%)', '5 (500%)', '0.8 (80%)'],
  'Efficiency = useful ÷ total = 40 ÷ 200 = <b>0.2</b>.');
M('P4.4-02', 'Which is the correct equation for efficiency?',
  ['useful energy output ÷ total energy input', 'total energy input ÷ useful energy output', 'useful energy output × total energy input', 'wasted energy ÷ useful energy output'],
  'Multiply by 100 for a percentage.');
T('P4.4-03', 'A device can have an efficiency greater than 100%.', false,
  'False. That would mean energy was created.');
MH('P4.4-04', 'A motor is 25% efficient and gives 300 J of useful work. How much energy was supplied?',
  ['1200 J', '75 J', '325 J', '900 J'],
  'Total = useful ÷ efficiency = 300 ÷ 0.25 = <b>1200 J</b>.');
M('P4.5-01', 'In a Sankey diagram, what does the width of each arrow show?',
  ['The amount of energy transferred', 'The speed of the transfer', 'The type of energy store', 'The time the device is used'],
  'Wide arrows mean lots of energy.');
M('P4.5-02', 'What is the main wasted energy in a filament lamp?',
  ['Thermal energy to the surroundings', 'Sound energy to the surroundings', 'Kinetic energy of the filament', 'Chemical energy in the filament'],
  'Filament lamps are very inefficient: most energy heats the surroundings.');
MH('P4.5-03', 'In a Sankey diagram, the input arrow is 10 squares wide and the useful arrow is 3 squares. What is the efficiency?',
  ['30%', '70%', '3%', '13%'],
  '3 ÷ 10 = 0.3 = <b>30%</b>.');
T('P4.5-04', 'In an electric kettle, energy transferred to the thermal store of the water is useful.', true,
  'True. Energy heating the kettle body and air is wasted.');
M('P4.6-01', 'How is thermal energy transferred through a metal spoon?',
  ['Conduction', 'Convection', 'Radiation only', 'Evaporation'],
  'Particles vibrate and pass energy on; free electrons help in metals.');
M('P4.6-02', 'Which method of thermal energy transfer can travel through a vacuum?',
  ['Radiation', 'Conduction', 'Convection', 'All three of these'],
  'Infrared radiation needs no particles. That is how heat reaches us from the Sun.');
T('P4.6-03', 'Convection can happen in solids.', false,
  'False. Convection needs a fluid (liquid or gas) whose particles can move around.');
MH('P4.6-04', 'Why are metals much better conductors than non-metals?',
  ['They have free (delocalised) electrons that carry energy quickly', 'Their particles are much further apart, so they move about freely', 'They are always at a higher temperature before they are heated', 'Their atoms cannot vibrate, so energy passes through them directly'],
  'Free electrons move through the metal and transfer energy.');
M('P4.7-01', 'Why does warm air rise?',
  ['It expands, becomes less dense and floats up', 'Its particles get bigger, so it gets lighter', 'It contracts, so it becomes much more dense', 'Cold air is attracted downwards by the ground'],
  'This sets up a convection current.');
M('P4.7-02', 'Why is the heating element in a kettle at the bottom?',
  ['Heated water rises and cooler water sinks, so convection heats all the water', 'Water conducts heat downwards well, so the bottom must be heated first', 'Radiation travels upwards more easily from the bottom of the kettle', 'The element is heavy, so placing it low stops the kettle falling over'],
  'Convection currents circulate the water.');
MH('P4.7-03', 'On a sunny day at the coast, why does a breeze blow from the sea towards the land?',
  ['Land heats up faster; warm air rises over it and cooler air from the sea moves in', 'The sea heats up faster, so warm air above it is pushed towards the land', 'Radiation from the Sun pushes the air above the sea inland during the day', 'Cold air above the land sinks and flows out towards the warmer sea water'],
  'This is a convection current on a large scale.');
T('P4.7-04', 'A radiator heats a room mainly by setting up convection currents in the air.', true,
  'True. Despite its name, most energy is transferred by convection.');
M('P4.8-01', 'Which surface is the best emitter of infrared radiation?',
  ['Dull black', 'Shiny silver', 'Shiny white', 'Polished metal'],
  'Dull black surfaces are the best emitters and absorbers.');
M('P4.8-02', 'Which surface is the best <b>reflector</b> of infrared radiation?',
  ['Shiny silver', 'Dull black', 'Matt dark green', 'Rough dark grey'],
  'Shiny light surfaces are poor absorbers and poor emitters.');
T('P4.8-03', 'A cooler object emits more infrared radiation than a hotter identical object.', false,
  'False. Emission increases with temperature, so the hotter object emits more.');
MH('P4.8-04', 'An object stays at a constant temperature. What must be true?',
  ['It absorbs radiation at the same rate as it emits it', 'It emits no radiation at all', 'It absorbs no radiation at all', 'It emits more radiation than it absorbs'],
  'If it emitted more than it absorbed, it would cool down.');
M('P4.9-01', 'In the Leslie cube experiment, what is measured to compare the surfaces?',
  ['The infrared radiation emitted by each face, using a detector at the same distance', 'The mass of each face of the cube, using an electronic balance on each side', 'The colour change of the water inside the cube after it has been heated up', 'The time taken for the water inside the cube to boil with each face facing up'],
  'The cube is filled with hot water so every face is at the same temperature.');
M('P4.9-02', 'Rods of different metals have wax on one end and are heated at the other. What does the first wax to melt show?',
  ['That metal is the best conductor', 'That metal is the worst conductor', 'That metal is the best emitter of radiation', 'That the wax is the best insulator'],
  'Energy was conducted along that rod fastest.');
MH('P4.9-03', 'To compare radiation absorbed by black and silver plates, why must the heater be the same distance from both?',
  ['So both plates receive the same amount of radiation: a fair test', 'So the two plates can conduct heat across to each other', 'So stronger convection currents are set up near the plates', 'So the wax on both plates will melt at exactly the same time'],
  'Only the surface colour should change.');
T('P4.9-04', 'A crystal of potassium manganate(VII) in water can be used to show convection currents.', true,
  'True. The purple colour follows the moving water when it is heated.');
M('P4.10-01', 'Why does loft insulation reduce energy loss from a house?',
  ['It traps air, which is a poor conductor, and stops convection', 'It reflects all of the heat back down into the rooms below', 'It conducts heat away from the house quickly to the outside', 'It absorbs heat from the house and then destroys that energy'],
  'Trapped air cannot form convection currents.');
M('P4.10-02', 'How does double glazing reduce heat loss?',
  ['The gap between the panes reduces conduction', 'The extra glass reflects all radiation', 'The glass becomes a better conductor', 'It lets more convection happen'],
  'A gas or vacuum gap conducts very poorly.');
MH('P4.10-03', 'A vacuum flask has a silvered inner wall. Which transfer does the silvering reduce?',
  ['Radiation', 'Conduction', 'Convection', 'Evaporation'],
  'The vacuum stops conduction and convection; the stopper reduces evaporation.');
T('P4.10-04', 'Cavity wall insulation works by trapping pockets of air.', true,
  'True. Trapped air is a poor conductor and cannot convect.');
M('P4.11-01', 'A 20 N force pushes a box 3 m. How much work is done?',
  ['60 J', '6.7 J', '23 J', '0.15 J'],
  'W = F × d = 20 × 3 = <b>60 J</b>.');
M('P4.11-02', 'What is the unit of work done?',
  ['Joule (J)', 'Newton (N)', 'Watt (W)', 'Newton per metre (N/m)'],
  '1 J = 1 N × 1 m.');
T('P4.11-03', 'If you push hard on a wall and it does not move, you do no work on it.', true,
  'True. Work is only done if the force moves something in its direction.');
MH('P4.11-04', '450 J of work is done pushing a trolley 15 m. What is the force?',
  ['30 N', '6750 N', '465 N', '0.033 N'],
  'F = W ÷ d = 450 ÷ 15 = <b>30 N</b>.');
M('P4.12-01', 'A person does 500 J of work lifting a box. How much energy is transferred?',
  ['500 J', '250 J', '1000 J', '0 J'],
  'Work done = energy transferred.');
T('P4.12-02', 'Work done against friction transfers energy to thermal stores.', true,
  'True. Rubbing surfaces warm up.');
M('P4.12-03', 'When a car brakes, work is done by friction. Where does the kinetic energy go?',
  ['To thermal stores of the brakes and surroundings', 'To the chemical store of the fuel', 'To the gravitational store of the car', 'It disappears completely'],
  'The brakes get hot.');
MH('P4.12-04', 'A 2 N friction force acts on a sliding block for 5 m. How much does the thermal store increase by?',
  ['10 J', '2.5 J', '7 J', '0.4 J'],
  'Work against friction = 2 × 5 = <b>10 J</b>, all transferred by heating.');
M('P4.13-01', 'A 2 kg box is lifted 3 m. What is its gain in GPE? (g = 10 N/kg)',
  ['60 J', '6 J', '15 J', '600 J'],
  'GPE = m × g × h = 2 × 10 × 3 = <b>60 J</b>.');
M('P4.13-02', 'Which is the equation for gravitational potential energy?',
  ['GPE = m × g × h', 'GPE = ½ × m × v²', 'GPE = F × t', 'GPE = m ÷ (g × h)'],
  'Mass × gravitational field strength × height.');
T('P4.13-03', 'Doubling the height an object is lifted makes its gain in GPE four times bigger.', false,
  'False. GPE = mgh is proportional to height, so doubling the height doubles the GPE.');
M('P4.14-01', 'What is the equation for kinetic energy?',
  ['KE = ½ × m × v²', 'KE = m × g × h', 'KE = m × v', 'KE = ½ × m × v'],
  'Speed is squared.');
M('P4.14-02', 'A 4 kg ball moves at 3 m/s. What is its kinetic energy?',
  ['18 J', '6 J', '12 J', '36 J'],
  'KE = ½ × 4 × 3² = <b>18 J</b>.');
TH('P4.14-03', 'Doubling the speed of a car doubles its kinetic energy.', false,
  'False. KE depends on v², so doubling the speed makes the KE four times bigger.');
M('P4.15-01', 'A ball is dropped from a height. Ignoring air resistance, what happens to its GPE as it falls?',
  ['It is transferred to its kinetic store', 'It stays the same until it lands', 'It is destroyed', 'It is transferred to its chemical store'],
  'GPE lost = KE gained.');
MH('P4.15-02', 'A 1 kg ball falls 5 m. Ignoring air resistance, how fast is it moving just before it lands? (g = 10 N/kg)',
  ['10 m/s', '50 m/s', '5 m/s', '100 m/s'],
  'GPE = 1 × 10 × 5 = 50 J = ½ × 1 × v², so v² = 100 and v = <b>10 m/s</b>.');
T('P4.15-03', 'With air resistance, a falling object gains less kinetic energy than the GPE it loses.', true,
  'True. Some energy is transferred to thermal stores of the object and air.');
M('P4.15-04', 'A roller coaster car rolls down a slope. Why is it slower at the bottom than the ideal calculation predicts?',
  ['Work is done against friction and air resistance', 'Its mass increases as it falls', 'Gravity gets weaker at the bottom', 'Energy is created at the top of the slope'],
  'That work transfers energy to thermal stores.');
M('P4.16-01', 'What is power?',
  ['The rate of transfer of energy', 'The total energy transferred', 'The force on an object', 'The energy stored in a battery'],
  'Power = energy transferred ÷ time.');
M('P4.16-02', 'What is the unit of power?',
  ['Watt (W)', 'Joule (J)', 'Newton (N)', 'Ampere (A)'],
  '1 W = 1 J/s.');
T('P4.16-03', 'A more powerful motor transfers energy faster.', true,
  'True. Power is the rate of energy transfer.');
MH('P4.16-04', 'Two students run up the same stairs. They have the same mass, but A takes less time. What is true?',
  ['They do the same work, but A has a greater power', 'A does more work and has a greater power', 'B does more work, so B has a greater power', 'They do the same work and have the same power'],
  'Same mass and height → same work; less time → more power.');
M('P4.17-01', 'A motor does 600 J of work in 20 s. What is its power?',
  ['30 W', '12 000 W', '580 W', '0.033 W'],
  'P = W ÷ t = 600 ÷ 20 = <b>30 W</b>.');
M('P4.17-02', 'A 60 W lamp is on for 10 s. How much energy does it transfer?',
  ['600 J', '6 J', '70 J', '0.17 J'],
  'E = P × t = 60 × 10 = <b>600 J</b>.');
MH('P4.17-03', 'A 2000 W kettle transfers 300 000 J. How long is it on for?',
  ['150 s', '600 s', '15 s', '1500 s'],
  't = E ÷ P = 300 000 ÷ 2000 = <b>150 s</b>.');
T('P4.17-04', 'A 100 W device transfers 100 J of energy every minute.', false,
  'False. 1 W = 1 J/s, so it transfers 100 J every second (6000 J a minute).');

/* ===================== PHYSICS 5 Solids, liquids and gases (added 7 Nov 2026) ===================== */
M('P5.3-01', 'What is the equation for density?',
  ['density = mass ÷ volume', 'density = volume ÷ mass', 'density = mass × volume', 'density = mass − volume'],
  'ρ = m ÷ V.');
M('P5.3-02', 'A block has mass 600 g and volume 200 cm³. What is its density?',
  ['3 g/cm³', '0.33 g/cm³', '120 000 g/cm³', '400 g/cm³'],
  'ρ = 600 ÷ 200 = <b>3 g/cm³</b>.');
T('P5.3-03', 'An object will float in water if it is less dense than water.', true,
  'True. Water has a density of about 1 g/cm³ (1000 kg/m³).');
MH('P5.3-04', 'A metal has density 8000 kg/m³. What is the mass of 0.002 m³ of it?',
  ['16 kg', '4 000 000 kg', '0.00000025 kg', '8002 kg'],
  'm = ρ × V = 8000 × 0.002 = <b>16 kg</b>.');
M('P5.4-01', 'How can you find the volume of an irregular stone?',
  ['Lower it into a measuring cylinder of water and measure the rise in water level', 'Measure its length, width and height with a ruler and multiply them together', 'Weigh it on a balance and divide the mass by the density of water in g/cm³', 'Heat it in a water bath and measure how much its length expands as it warms'],
  'The volume of water displaced equals the stone\'s volume.');
M('P5.4-02', 'Which apparatus is used to measure the mass of an object for a density practical?',
  ['A top-pan (electronic) balance', 'A measuring cylinder with water', 'A newton meter (spring balance)', 'A metre rule and a set square'],
  'Zero the balance first.');
MH('P5.4-03', 'Why should you read the measuring cylinder at eye level at the bottom of the meniscus?',
  ['To avoid parallax error and get an accurate volume', 'To make the water level rise up to the next mark', 'To stop the water from evaporating while reading', 'To measure the mass of the object more accurately'],
  'Reading from above or below gives the wrong value.');
T('P5.4-04', 'The volume of a regular cuboid can be found from length × width × height.', true,
  'True. Use a ruler or vernier callipers.');
M('P5.5-01', 'What is the equation for pressure?',
  ['pressure = force ÷ area', 'pressure = area ÷ force', 'pressure = force × area', 'pressure = mass ÷ volume'],
  'p = F ÷ A, in pascals (Pa) or N/m².');
M('P5.5-02', 'A 600 N person stands on 0.03 m² of floor. What pressure do they exert?',
  ['20 000 Pa', '18 Pa', '0.00005 Pa', '600 Pa'],
  'p = 600 ÷ 0.03 = <b>20 000 Pa</b>.');
T('P5.5-03', 'Snowshoes reduce the pressure on snow by reducing the area in contact.', false,
  'False. They increase the area, so the same force gives a lower pressure.');
MH('P5.5-04', 'Why does a sharp knife cut better than a blunt one?',
  ['The same force acts on a smaller area, giving a greater pressure', 'A sharp knife exerts a larger force', 'A sharp knife has a larger area of contact', 'The pressure is the same; only the force changes'],
  'p = F ÷ A: smaller A means larger p.');
M('P5.6-01', 'In a liquid at rest, in which directions does the pressure at a point act?',
  ['Equally in all directions', 'Only downwards, with depth', 'Only upwards, on objects', 'Only sideways, on the walls'],
  'That is why water spurts out sideways from holes in a container.');
T('P5.6-02', 'At a particular depth in a liquid, the pressure pushes only downwards.', false,
  'False. The pressure at a point in a fluid acts equally in all directions.');
M('P5.6-03', 'Holes are made at the same depth on different sides of a water bottle. How do the jets compare?',
  ['They all spurt out equally far', 'Only the jet on one side comes out', 'The upward-facing jet is strongest', 'No water comes out of the side holes'],
  'Pressure at the same depth acts equally in all directions.');
MH('P5.6-04', 'Why is the wall of a dam much thicker at the bottom?',
  ['Pressure increases with depth and pushes sideways on the wall', 'The water at the bottom is less dense', 'The pressure only acts downwards on the base', 'The air pressure is greater at the bottom'],
  'Pressure at a point acts in all directions, including sideways against the wall.');
M('P5.7-01', 'What is the equation for the pressure difference in a liquid?',
  ['pressure difference = height × density × g', 'pressure difference = force × area', 'pressure difference = density ÷ height', 'pressure difference = mass × g'],
  'p = h × ρ × g.');
M('P5.7-02', 'What is the pressure difference 2 m below the surface of water? (ρ = 1000 kg/m³, g = 10 N/kg)',
  ['20 000 Pa', '2000 Pa', '5000 Pa', '200 Pa'],
  'p = 2 × 1000 × 10 = <b>20 000 Pa</b>.');
T('P5.7-03', 'The pressure in a liquid increases with depth.', true,
  'True. p = hρg, so it is proportional to depth.');
MH('P5.7-04', 'A diver goes from 5 m to 15 m deep in sea water (ρ = 1030 kg/m³, g = 10 N/kg). How much does the pressure on her increase?',
  ['103 000 Pa', '154 500 Pa', '51 500 Pa', '10 300 Pa'],
  'Δh = 10 m, so Δp = 10 × 1030 × 10 = <b>103 000 Pa</b>.');
M('P5.15-01', 'How do gas molecules exert a pressure on the walls of a container?',
  ['They collide with the walls, exerting a force', 'They stick to the walls', 'They push out by expanding', 'They are attracted strongly to the walls'],
  'Pressure = total force of collisions ÷ area.');
M('P5.15-02', 'How do gas molecules move?',
  ['Randomly, at high speeds in all directions', 'In straight lines towards the top of the container', 'Only by vibrating about fixed positions', 'Slowly in one direction only'],
  'Brownian motion of smoke particles is evidence for this.');
T('P5.15-03', 'Gas molecules in a container are all moving at the same speed.', false,
  'False. They have a range of speeds in random directions.');
MH('P5.15-04', 'More gas is pumped into a rigid container at constant temperature. Why does the pressure increase?',
  ['More molecules hit the walls each second', 'Each molecule hits the walls harder', 'The molecules become larger', 'The walls move inwards'],
  'Same speed, but more frequent collisions.');
M('P5.16-01', 'What is the value of absolute zero in °C?',
  ['−273 °C', '0 °C', '−100 °C', '−373 °C'],
  'Absolute zero is 0 K.');
M('P5.16-02', 'What happens to the particles of a substance at absolute zero?',
  ['They have the minimum possible kinetic energy', 'They move at their fastest speed', 'They turn into a gas', 'They split into smaller particles'],
  'You cannot get any colder.');
T('P5.16-03', 'Nothing can be cooled below absolute zero.', true,
  'True. The particles cannot have less kinetic energy than at absolute zero.');
MH('P5.16-04', 'Why is there a lowest possible temperature but no highest?',
  ['Particles can always gain more kinetic energy, but cannot have less than the minimum', 'The Kelvin scale only goes up to 273 K, so higher temperatures cannot be defined', 'Very hot particles turn completely into energy and so they disappear from the gas', 'There is a highest temperature too, but thermometers are not able to measure it'],
  'Temperature is linked to particle kinetic energy.');
M('P5.17-01', 'What is 27 °C in kelvin?',
  ['300 K', '246 K', '27 K', '−246 K'],
  'K = °C + 273 = 27 + 273 = <b>300 K</b>.');
M('P5.17-02', 'What is 373 K in °C?',
  ['100 °C', '646 °C', '0 °C', '−100 °C'],
  '°C = K − 273 = <b>100 °C</b>.');
T('P5.17-03', 'A temperature change of 1 K is the same as a change of 1 °C.', true,
  'True. The two scales only differ in where zero is.');
MH('P5.17-04', 'What is −73 °C in kelvin?',
  ['200 K', '346 K', '−346 K', '73 K'],
  '−73 + 273 = <b>200 K</b>.');
M('P5.18-01', 'Why do gas molecules move faster when heated?',
  ['They gain kinetic energy from the heating', 'They become lighter as they warm up', 'They lose energy each time they hit the walls', 'The heating makes each molecule larger'],
  'Heating increases the average kinetic energy, so the average speed rises.');
T('P5.18-02', 'Increasing the temperature of a gas decreases the average speed of its molecules.', false,
  'False. Heating gives the molecules more kinetic energy, so they move faster on average.');
M('P5.18-03', 'A gas is cooled. What happens to the average speed of its molecules?',
  ['It decreases', 'It increases', 'It stays exactly the same', 'It drops to zero immediately'],
  'Less kinetic energy means slower molecules.');
MH('P5.18-04', 'A sealed gas is heated at constant volume. Why does its pressure rise?',
  ['Molecules move faster, so they hit the walls more often and harder', 'More molecules are made by heating, so there are more collisions', 'The molecules expand, so they fill up more of the space inside', 'The walls of the container get thinner, so they are pushed more'],
  'Both the frequency and force of collisions increase.');
M('P5.19-01', 'The Kelvin temperature of a gas is proportional to what?',
  ['The average kinetic energy of its molecules', 'The average volume of each of its molecules', 'The total number of molecules in the container', 'The mass of each molecule in the container'],
  'Double the Kelvin temperature → double the average KE.');
MH('P5.19-02', 'A gas is heated from 200 K to 400 K. What happens to the average kinetic energy of its molecules?',
  ['It doubles', 'It stays the same', 'It halves', 'It increases by 200 times'],
  'Average KE ∝ Kelvin temperature.');
T('P5.19-03', 'Heating a gas from 10 °C to 20 °C doubles the average kinetic energy of its molecules.', false,
  'False. Use kelvin: 283 K → 293 K is only about a 3.5% increase.');
M('P5.19-04', 'At which temperature do gas molecules have the greatest average kinetic energy?',
  ['400 K', '300 K', '100 °C', '0 °C'],
  '400 K = 127 °C, the hottest of these.');
M('P5.20-01', 'A fixed mass of gas is squashed to a smaller volume at constant temperature. What happens to its pressure?',
  ['It increases', 'It decreases', 'It stays the same', 'It drops to zero'],
  'Molecules hit the walls more often.');
M('P5.20-02', 'A sealed can of gas is heated (constant volume). What happens to the pressure?',
  ['It increases', 'It decreases', 'It stays the same', 'It first falls, then rises'],
  'This is why aerosol cans must not be heated.');
T('P5.20-03', 'For a fixed mass of gas at constant temperature, halving the volume halves the pressure.', false,
  'False. Halving the volume doubles the pressure (p ∝ 1/V).');
MH('P5.20-04', 'Why does the pressure of a gas increase when its volume is decreased at constant temperature?',
  ['Molecules hit the walls more often, because there is less space', 'Molecules move faster and hit the walls harder than before', 'Each molecule gains mass, so it pushes harder on the walls', 'The molecules begin to stick together into bigger clumps'],
  'Speed is unchanged because the temperature is unchanged.');
M('P5.21-01', 'Which equation links pressure and Kelvin temperature of a fixed mass of gas at constant volume?',
  ['p₁ ÷ T₁ = p₂ ÷ T₂', 'p₁ × T₁ = p₂ × T₂', 'p₁ × V₁ = p₂ × V₂', 'p₁ + T₁ = p₂ + T₂'],
  'T must be in kelvin.');
M('P5.21-02', 'A gas at 100 kPa and 300 K is heated to 600 K at constant volume. What is the new pressure?',
  ['200 kPa', '50 kPa', '100 kPa', '400 kPa'],
  'p₂ = 100 × 600 ÷ 300 = <b>200 kPa</b>.');
TH('P5.21-03', 'Heating a gas at constant volume from 20 °C to 40 °C doubles its pressure.', false,
  'False. In kelvin that is 293 K → 313 K, so the pressure only rises by about 7%.');
M('P5.22-01', 'Which equation links pressure and volume of a fixed mass of gas at constant temperature?',
  ['p₁ × V₁ = p₂ × V₂', 'p₁ ÷ V₁ = p₂ ÷ V₂', 'p₁ × T₁ = p₂ × T₂', 'p₁ + V₁ = p₂ + V₂'],
  'This is Boyle\'s law.');
M('P5.22-02', 'A gas has a volume of 4 m³ at 100 kPa. It is squashed to 2 m³ at constant temperature. What is the new pressure?',
  ['200 kPa', '50 kPa', '400 kPa', '800 kPa'],
  'p₂ = 100 × 4 ÷ 2 = <b>200 kPa</b>.');
MH('P5.22-03', 'A syringe holds 30 cm³ of air at 100 kPa. The plunger is pushed until the pressure is 150 kPa. What is the new volume?',
  ['20 cm³', '45 cm³', '15 cm³', '25 cm³'],
  'V₂ = 100 × 30 ÷ 150 = <b>20 cm³</b>.');
T('P5.22-04', 'For a fixed mass of gas at constant temperature, pressure ÷ volume stays the same.', false,
  'False. It is pressure × volume that stays the same (p₁V₁ = p₂V₂).');
M('C3.17-04', 'In a reversible reaction, what is true of the energy change in the two directions?',
  ['If one direction is exothermic, the other is endothermic by the same amount', 'Both directions are always exothermic by the same amount', 'Both directions are always endothermic by the same amount', 'The reverse reaction has no energy change at all'],
  'The same amount of energy is transferred, in opposite directions.');

/* ===================== PHYSICS 6 Magnetism and electromagnetism (added 7 Nov 2026) ===================== */
M('P6.2-01', 'Which of these is a magnetic material?',
  ['Nickel', 'Copper', 'Aluminium', 'Brass'],
  'Iron, steel, nickel and cobalt are magnetic.');
M('P6.2-02', 'Two north poles are brought close together. What happens?',
  ['They repel', 'They attract', 'Nothing happens', 'They attract, then repel'],
  'Like poles repel; unlike poles attract.');
T('P6.2-03', 'A magnet will attract a piece of copper.', false,
  'False. Copper is not a magnetic material.');
MH('P6.2-04', 'A bar of metal is attracted to both ends of a magnet. What does this show?',
  ['It is a magnetic material, but not a magnet', 'It must be a permanent magnet, with two poles', 'It is not a magnetic material of any kind', 'It is a north pole, attracted by both ends'],
  'Only repulsion proves something is a magnet.');
M('P6.3-01', 'Why is soft iron used for the core of an electromagnet?',
  ['It magnetises and demagnetises easily', 'It stays magnetised permanently', 'It is a very good insulator', 'It cannot be magnetised at all'],
  'The magnet can be switched off.');
M('P6.3-02', 'Which material is magnetically <b>hard</b>?',
  ['Steel', 'Soft iron', 'Copper', 'Plastic'],
  'Hard materials keep their magnetism, so they make permanent magnets.');
T('P6.3-03', 'Magnetically hard materials are good for making permanent magnets.', true,
  'True. They are hard to magnetise but keep their magnetism.');
MH('P6.3-04', 'A scrapyard crane uses an electromagnet. Why would a steel core be a poor choice?',
  ['Steel stays magnetised, so the scrap would not drop when the current is off', 'Steel cannot be magnetised by an electric current flowing round it', 'Steel is far too light to lift the heavy scrap off the ground', 'Steel conducts heat too well and would melt the coil of the crane'],
  'A soft iron core loses its magnetism when the current is switched off.');
M('P6.4-01', 'Which way do magnetic field lines point outside a magnet?',
  ['From north to south', 'From south to north', 'Round in circles', 'Away from both poles'],
  'They show the direction a north pole would be pushed.');
M('P6.4-02', 'What does it mean when magnetic field lines are close together?',
  ['The field is stronger there', 'The field is weaker there', 'There is no field there', 'The field has changed direction'],
  'Field lines are most crowded at the poles.');
T('P6.4-03', 'Magnetic field lines can cross each other.', false,
  'False. They never cross, because the field can only have one direction at each point.');
MH('P6.4-04', 'What does a magnetic field line show?',
  ['The direction of the force on a north pole placed at that point', 'The path that an electron always follows near a magnet', 'The direction of the force on a south pole at that point', 'The places where the magnet is hottest and most active'],
  'Arrows go from N to S.');
M('P6.5-01', 'A steel paperclip hangs from a magnet and attracts another paperclip. Why?',
  ['The first paperclip has become an induced magnet', 'The paperclips are permanent magnets', 'Static charge holds them together', 'The magnet repels the second paperclip'],
  'Magnetism is induced in magnetic materials in a field.');
T('P6.5-02', 'An induced magnet always attracts the permanent magnet that induced it.', true,
  'True. The near end of the induced magnet becomes the opposite pole.');
M('P6.5-03', 'What happens to an induced magnet made of soft iron when it is taken out of the field?',
  ['It loses most of its magnetism', 'It becomes a stronger magnet', 'It becomes a permanent magnet', 'It reverses its poles'],
  'Soft iron is magnetically soft.');
MH('P6.5-04', 'The north pole of a magnet touches one end of an iron nail. What pole forms at that end of the nail?',
  ['A south pole', 'A north pole', 'No pole', 'Both poles'],
  'Opposite poles form, so the nail is attracted.');
M('P6.6-01', 'How can you show the field pattern around a bar magnet?',
  ['Use a plotting compass and mark the direction at many points', 'Measure the mass of the magnet on an electronic balance', 'Hold a thermometer near each pole and record the readings', 'Connect a voltmeter across the two poles of the magnet'],
  'Iron filings sprinkled on paper also show the pattern.');
M('P6.6-02', 'Two bar magnets are placed with their north poles facing. What is found midway between them?',
  ['A neutral point where the fields cancel', 'The strongest part of the field', 'A uniform field', 'A new south pole'],
  'The two fields point in opposite directions there.');
T('P6.6-03', 'Iron filings show both the shape and the direction of a magnetic field.', false,
  'False. They show the shape only; a plotting compass is needed for the direction.');
MH('P6.6-04', 'Why does a plotting compass point along a field line?',
  ['It is a small magnet, so its north pole is pushed along the field direction', 'It is attracted to the iron filings that lie along each field line', 'It always points to the Earth\'s north pole, whatever is nearby', 'It is made of copper, which lines up with any electric current'],
  'Away from strong magnets, it lines up with the Earth\'s field.');
M('P6.7-01', 'How can two bar magnets produce a uniform field?',
  ['Place a north pole facing a south pole, close and parallel', 'Place two north poles facing each other, close together', 'Place the magnets end to end so that they are touching', 'Place the magnets at right angles to each other, apart'],
  'The field lines between them are parallel and equally spaced.');
M('P6.7-02', 'What do the field lines in a uniform field look like?',
  ['Parallel and equally spaced', 'Circles around a point', 'Curved and crowded at one end', 'Crossing in the middle'],
  'The strength and direction are the same everywhere.');
T('P6.7-03', 'In a uniform magnetic field, the field is strongest in the middle.', false,
  'False. A uniform field has the same strength and direction at every point.');
MH('P6.7-04', 'Where is a uniform magnetic field found with two flat magnets?',
  ['In the gap between opposite poles facing each other', 'Around the outside of the two magnets, near the ends', 'In the gap between two like poles facing each other', 'At the two ends of the magnets that are furthest apart'],
  'The lines run straight across the gap from N to S.');
M('P6.8-01', 'What is produced around a wire carrying an electric current?',
  ['A magnetic field', 'A gravitational field only', 'A uniform electric current', 'Nothing'],
  'The field lines are circles around the wire.');
M('P6.8-02', 'What shape is the magnetic field around a long straight wire carrying a current?',
  ['Concentric circles around the wire', 'Straight lines parallel to the wire', 'Like a bar magnet\'s field', 'Uniform parallel lines'],
  'The field gets weaker further from the wire.');
T('P6.8-03', 'Reversing the current in a wire does not change the direction of its magnetic field.', false,
  'False. Reversing the current reverses the field.');
MH('P6.8-04', 'How can the magnetic field of a coil of wire (solenoid) be made stronger?',
  ['More turns, more current, or a soft iron core', 'Fewer turns and less current', 'Using a plastic core', 'Making the wire shorter and thinner'],
  'This is how an electromagnet works.');
M('P6.12-01', 'Why is there a force on a current-carrying wire in a magnetic field?',
  ['The wire\'s own magnetic field interacts with the magnet\'s field', 'The magnet attracts the copper atoms inside the wire', 'The current in the wire heats the magnet and it expands', 'The electrons are repelled by the north pole of the magnet'],
  'This is the motor effect.');
M('P6.12-02', 'In a loudspeaker, what makes the cone vibrate?',
  ['An alternating current in a coil in a magnetic field', 'A direct current heating the paper cone unevenly', 'A spinning magnet fixed to the middle of the cone', 'Air pressure from a small fan inside the speaker'],
  'The force on the coil keeps changing direction.');
M('P6.12-03', 'What does the split-ring commutator in a d.c. motor do?',
  ['Reverses the current every half turn so the coil keeps spinning', 'Increases the voltage of the supply as the coil turns faster', 'Stops the coil from spinning too fast by adding resistance', 'Makes the magnetic field stronger each time the coil turns'],
  'Without it the coil would just rock back and forth.');
T('P6.12-04', 'A wire carrying a current parallel to a magnetic field feels the maximum force.', false,
  'False. The force is greatest when the current is perpendicular to the field, and zero when parallel.');
MH('P6.12-05', 'How could you make a d.c. motor spin faster?',
  ['Increase the current or use a stronger magnet', 'Reverse the direction of the current', 'Use fewer turns on the coil', 'Remove the commutator'],
  'Reversing the current only changes the direction.');
M('P6.13-01', 'In the left-hand rule, what does the first finger represent?',
  ['The magnetic field (N to S)', 'The conventional current', 'The force (the motion)', 'The voltage of the supply'],
  'thuMb = Motion, First = Field, seCond = Current.');
M('P6.13-02', 'In the left-hand rule, what does the thumb represent?',
  ['The force (motion)', 'The magnetic field', 'The current', 'The resistance'],
  'All three are at right angles.');
T('P6.13-03', 'In the left-hand rule, the second finger shows the direction of the conventional current.', true,
  'True. Current flows from + to −.');
MH('P6.13-04', 'A wire carries current into the page in a field pointing left to right. Using the left-hand rule, which way is the force?',
  ['Upwards (towards the top of the page)', 'Downwards (towards the bottom of the page)', 'To the left, against the direction of the field', 'Out of the page, opposite to the current'],
  'First finger right, second finger into the page → thumb points up.');
M('P6.14-01', 'What happens to the force on a wire if the current is doubled?',
  ['It doubles', 'It halves', 'It stays the same', 'It reverses'],
  'Force increases with current.');
M('P6.14-02', 'What happens to the force on a wire if the direction of the magnetic field is reversed?',
  ['The force reverses direction', 'The force becomes twice as big', 'The force disappears', 'Nothing changes'],
  'Reversing both field and current gives the original direction.');
T('P6.14-03', 'Using a stronger magnet decreases the force on a current-carrying wire.', false,
  'False. A stronger field gives a bigger force.');
MH('P6.14-04', 'Both the current and the magnetic field direction are reversed. What happens to the force?',
  ['It stays in the same direction', 'It reverses its direction', 'It becomes zero straight away', 'It doubles in size but not direction'],
  'Two reversals cancel out.');
M('P6.15-01', 'When is a voltage induced in a wire?',
  ['When it moves through a magnetic field, cutting field lines', 'When it is held still right next to a strong magnet', 'When it is heated strongly with a Bunsen burner', 'When it is placed in a beaker of salty water'],
  'A changing field through a coil also induces a voltage.');
M('P6.15-02', 'A magnet is pushed into a coil connected to a meter. Which change gives a <b>bigger</b> induced voltage?',
  ['Pushing the magnet in faster', 'Pushing it in more slowly', 'Using fewer turns on the coil', 'Holding the magnet still inside'],
  'More turns or a stronger magnet also help.');
T('P6.15-03', 'Pulling a magnet out of a coil induces a voltage in the opposite direction to pushing it in.', true,
  'True.');
MH('P6.15-04', 'A magnet rests inside a coil. Why does the meter read zero?',
  ['The magnetic field through the coil is not changing', 'The magnet has lost its magnetism', 'The coil has too many turns', 'The meter is in parallel with the coil'],
  'Induction needs movement or a changing field.');
M('P6.16-01', 'In a simple generator, what is rotated to produce electricity?',
  ['A coil in a magnetic field (or a magnet in a coil)', 'A battery connected in a closed circuit', 'A resistor placed between two magnets', 'A plastic disc spinning close to a magnet'],
  'This induces an alternating voltage.');
M('P6.16-02', 'Which would increase the output voltage of a generator?',
  ['Rotating the coil faster', 'Using a weaker magnet', 'Using fewer turns of wire', 'Rotating the coil more slowly'],
  'Faster rotation, more turns or a stronger field.');
T('P6.16-03', 'A simple a.c. generator produces a current that changes direction.', true,
  'True. Each half turn reverses the induced voltage.');
MH('P6.16-04', 'A generator is turned twice as fast. What happens to its output?',
  ['The peak voltage and the frequency both increase', 'Only the frequency increases; the peak voltage stays the same', 'Only the peak voltage increases; the frequency stays the same', 'Neither changes, because the same coil and magnet are used'],
  'Faster cutting of field lines → bigger voltage, more cycles per second.');

/* ===================== PHYSICS 8 Astrophysics (added 7 Nov 2026) ===================== */
M('P8.2-01', 'What is a galaxy?',
  ['A large collection of billions of stars', 'A star with its planets', 'A large collection of billions of galaxies', 'A cloud of dust where stars form'],
  'The universe contains billions of galaxies.');
M('P8.2-02', 'Which galaxy is our solar system in?',
  ['The Milky Way', 'Andromeda', 'The Large Magellanic Cloud', 'Orion'],
  'The Sun is one of billions of stars in it.');
T('P8.2-03', 'A galaxy is a large collection of billions of universes.', false,
  'False. The universe is a collection of billions of galaxies; a galaxy is billions of stars.');
MH('P8.2-04', 'Which list is in order of size, smallest first?',
  ['Planet, solar system, galaxy, universe', 'Solar system, planet, galaxy, universe', 'Galaxy, solar system, planet, universe', 'Planet, galaxy, solar system, universe'],
  'Galaxies contain billions of stars, many with their own planets.');
M('P8.3-01', 'Why does an astronaut weigh less on the Moon than on Earth?',
  ['The Moon\'s gravitational field strength is lower', 'The astronaut\'s mass is smaller there', 'There is no air on the Moon', 'The Moon is further from the Sun'],
  'Mass stays the same; weight = m × g changes.');
M('P8.3-02', 'A 60 kg astronaut is on the Moon (g = 1.6 N/kg). What is their weight?',
  ['96 N', '60 N', '600 N', '37.5 N'],
  'W = m × g = 60 × 1.6 = <b>96 N</b>.');
T('P8.3-03', 'Gravitational field strength is the same on every planet.', false,
  'False. It depends on the planet\'s mass and radius.');
MH('P8.3-04', 'Why is g bigger on Jupiter than on Earth?',
  ['Jupiter has a much greater mass', 'Jupiter is further from the Sun', 'Jupiter spins more slowly', 'Jupiter has more moons'],
  'More mass → stronger gravitational field (at its surface).');
M('P8.4-01', 'What force keeps the planets in orbit around the Sun?',
  ['Gravity', 'Magnetism', 'Friction', 'Air resistance'],
  'It also keeps moons, satellites and comets in orbit.');
M('P8.4-02', 'What keeps an artificial satellite in orbit around the Earth?',
  ['The Earth\'s gravitational pull', 'Its rocket engines running all the time', 'The Sun\'s magnetic field', 'There is no force; it just floats'],
  'Gravity provides the force towards the centre.');
T('P8.4-03', 'The Moon orbits the Earth because of gravitational force.', true,
  'True.');
MH('P8.4-04', 'In which direction does gravity act on a satellite in a circular orbit?',
  ['Towards the centre of the Earth', 'In the direction it is moving', 'Away from the Earth', 'Backwards, opposite to its motion'],
  'This changes its direction, not its speed.');
M('P8.5-01', 'What shape is the orbit of a comet?',
  ['Highly elliptical (a stretched oval)', 'Almost circular', 'A straight line', 'A perfect circle around a planet'],
  'Comets pass close to the Sun, then travel far out.');
M('P8.5-02', 'Where does a comet travel fastest?',
  ['When it is closest to the Sun', 'When it is furthest from the Sun', 'It travels at the same speed all the time', 'Halfway between'],
  'The pull of gravity is strongest close to the Sun.');
T('P8.5-03', 'Comets orbit planets, while moons orbit the Sun.', false,
  'False. Moons orbit planets; planets and comets orbit the Sun.');
MH('P8.5-04', 'How does a planet\'s orbit differ from a comet\'s?',
  ['A planet\'s orbit is nearly circular; a comet\'s is very elliptical', 'A planet orbits the Earth; a comet orbits the Sun', 'A planet\'s orbit is elliptical; a comet\'s is circular', 'They are exactly the same shape'],
  'A comet\'s distance from the Sun changes greatly.');
M('P8.6-01', 'Which equation links orbital speed, orbital radius and time period?',
  ['v = 2πr ÷ T', 'v = T ÷ 2πr', 'v = 2πT ÷ r', 'v = r ÷ T'],
  '2πr is the circumference of the orbit.');
MH('P8.6-02', 'A satellite orbits at radius 7 000 000 m with a period of 6000 s. What is its orbital speed? (π ≈ 3.14)',
  ['About 7300 m/s', 'About 1170 m/s', 'About 3700 m/s', 'About 44 000 m/s'],
  'v = 2πr ÷ T = 2 × 3.14 × 7 000 000 ÷ 6000 ≈ <b>7300 m/s</b>.');
T('P8.6-03', 'In the equation v = 2πr ÷ T, T is the time for one complete orbit.', true,
  'True. T is the time period.');
M('P8.6-04', 'What does 2πr represent for a circular orbit?',
  ['The distance travelled in one orbit', 'The time taken for one orbit', 'The speed of the orbiting object', 'The area inside the orbit'],
  'The circumference of the circle.');
M('P8.7-01', 'Which colour star is the hottest?',
  ['Blue', 'Red', 'Orange', 'Yellow'],
  'Order, hottest first: blue, white, yellow, orange, red.');
M('P8.7-02', 'Which colour star is the coolest?',
  ['Red', 'Blue', 'White', 'Yellow'],
  'Red stars are about 3000 K at the surface.');
T('P8.7-03', 'Stars can be classified by their colour.', true,
  'True. Colour gives the surface temperature.');
MH('P8.7-04', 'Which list puts stars in order from hottest to coolest?',
  ['Blue, white, yellow, red', 'Red, yellow, white, blue', 'Yellow, blue, red, white', 'White, blue, red, yellow'],
  'Our Sun is a yellow star.');
M('P8.8-01', 'What does the colour of a star tell us?',
  ['Its surface temperature', 'Its distance from Earth', 'Its age only', 'Its number of planets'],
  'Hotter stars emit more blue light.');
T('P8.8-02', 'A red star is hotter than a blue star.', false,
  'False. Blue stars are the hottest; red stars are the coolest.');
M('P8.8-03', 'The Sun is yellow. How does its temperature compare with a blue star?',
  ['The Sun is cooler', 'The Sun is hotter', 'They are the same temperature', 'The Sun has no temperature'],
  'Blue stars are hotter than yellow stars.');
MH('P8.8-04', 'Why does a hotter star look bluer?',
  ['It emits more of its light at shorter wavelengths', 'It is much closer to the Earth than other stars', 'It contains far more blue-coloured gas than others', 'It is moving away from us faster than other stars'],
  'Hotter objects emit radiation with a peak at shorter wavelengths.');
M('P8.9-01', 'What is the first stage in the life of a star like the Sun?',
  ['Nebula', 'Red giant', 'White dwarf', 'Main sequence star'],
  'A cloud of dust and gas collapses under gravity.');
M('P8.9-02', 'What will the Sun become after the red giant stage?',
  ['A white dwarf', 'A black hole', 'A neutron star', 'A supernova'],
  'Only much more massive stars explode as supernovae.');
T('P8.9-03', 'The order of stages for a Sun-sized star is: nebula, main sequence, red giant, white dwarf.', true,
  'True.');
MH('P8.9-04', 'Why does a main sequence star stay stable for billions of years?',
  ['The outward pressure from fusion balances the inward pull of gravity', 'It has no gravity, so nothing pulls its outer layers inwards', 'It is not hot enough for its gases to expand outwards at all', 'Its fusion has stopped, so it no longer changes in any way'],
  'When the hydrogen runs out, the balance changes and it becomes a red giant.');
M('P8.10-01', 'What happens at the end of the life of a star much more massive than the Sun?',
  ['It explodes as a supernova', 'It quietly becomes a white dwarf', 'It turns back into a nebula', 'It becomes a planet'],
  'After the red supergiant stage.');
M('P8.10-02', 'What can be left behind after a supernova?',
  ['A neutron star or a black hole', 'A white dwarf and nothing else', 'A red giant like the Sun\'s', 'A new main sequence star'],
  'The most massive stars leave black holes.');
T('P8.10-03', 'A massive star becomes a white dwarf before it explodes as a supernova.', false,
  'False. It becomes a red supergiant, then a supernova.');
MH('P8.10-04', 'Which sequence is for a star much more massive than the Sun?',
  ['Nebula → main sequence → red supergiant → supernova → neutron star or black hole', 'Nebula → main sequence → red giant → white dwarf, with no supernova at the end', 'Nebula → red supergiant → main sequence → white dwarf → nebula again', 'Main sequence → nebula → supernova → red giant → white dwarf → black hole'],
  'Sun-sized stars end as white dwarfs instead.');

/* ===================== CHEMISTRY 4 Organic chemistry (added 7 Nov 2026) ===================== */
M('C4.1-01', 'What is a hydrocarbon?',
  ['A compound of hydrogen and carbon only', 'A compound containing hydrogen, carbon and oxygen', 'A mixture of hydrogen and carbon elements', 'Any compound that contains carbon'],
  'Alkanes and alkenes are hydrocarbons.');
M('C4.1-02', 'Which of these is a hydrocarbon?',
  ['C₃H₈', 'C₂H₅OH', 'CO₂', 'CH₃Cl'],
  'Only C and H atoms.');
T('C4.1-03', 'Ethanol, C₂H₅OH, is a hydrocarbon.', false,
  'False. It contains oxygen as well as carbon and hydrogen.');
MH('C4.1-04', 'Which statement about hydrocarbons is correct?',
  ['They are compounds that contain only C and H atoms, bonded together', 'They are mixtures of hydrogen gas and carbon powder', 'They always contain at least one C=C double bond', 'They always contain oxygen as well as C and H'],
  'Hydrocarbons can be saturated (alkanes) or unsaturated (alkenes).');
M('C4.2-01', 'What is the empirical formula of ethane, C₂H₆?',
  ['CH₃', 'C₂H₆', 'CH₂', 'C₂H₄'],
  'Simplest whole-number ratio: 2 : 6 = 1 : 3.');
M('C4.2-02', 'What does a <b>displayed</b> formula show?',
  ['Every atom and every bond in the molecule', 'Only the number of each type of atom', 'The simplest ratio of atoms', 'The general formula for the series'],
  'Each bond is drawn as a line.');
M('C4.2-03', 'Which is the structural formula of propane?',
  ['CH₃CH₂CH₃', 'C₃H₈', 'CₙH₂ₙ₊₂', 'CH₄'],
  'A structural formula shows the atoms on each carbon without drawing every bond.');
T('C4.2-04', 'The molecular formula shows the actual number of atoms of each element in a molecule.', true,
  'True. For butane, C₄H₁₀.');
MH('C4.2-05', 'Butene has the molecular formula C₄H₈. What is its empirical formula?',
  ['CH₂', 'C₄H₈', 'C₂H₄', 'CH₄'],
  '4 : 8 = 1 : 2. All alkenes have the empirical formula CH₂.');
M('C4.3-01', 'What is a <b>homologous series</b>?',
  ['A family of compounds with the same general formula and similar chemical properties', 'A set of compounds with the same molecular formula but different structures', 'A mixture of hydrocarbons with similar boiling points', 'A series of reactions that produce polymers'],
  'Each member differs from the next by CH₂.');
M('C4.3-02', 'What is a <b>functional group</b>?',
  ['The atom or group of atoms that decides how a compound reacts', 'The longest carbon chain in a molecule', 'The number of hydrogen atoms in a molecule', 'The fraction of crude oil a compound comes from'],
  'For alkenes it is C=C.');
M('C4.3-03', 'What are <b>isomers</b>?',
  ['Compounds with the same molecular formula but different structures', 'Compounds with the same structure but different molecular formulae', 'Atoms of the same element with different numbers of neutrons', 'Compounds in the same fraction of crude oil'],
  'Butane and methylpropane are isomers of C₄H₁₀.');
T('C4.3-04', 'Members of a homologous series show a gradual trend in physical properties, such as boiling point.', true,
  'True. Boiling point rises as the chain gets longer.');
MH('C4.3-05', 'Consecutive members of a homologous series differ by what?',
  ['A CH₂ group', 'A CH₃ group', 'One carbon atom only', 'A C=C double bond'],
  'Methane CH₄, ethane C₂H₆, propane C₃H₈…');
M('C4.4-01', 'What does the prefix <b>prop-</b> tell you about a molecule?',
  ['It has 3 carbon atoms in its main chain', 'It has 3 hydrogen atoms in total', 'It has a C=C double bond in its chain', 'It has 4 carbon atoms in its main chain'],
  'meth- 1, eth- 2, prop- 3, but- 4, pent- 5.');
M('C4.4-02', 'What does the ending <b>-ene</b> tell you?',
  ['The compound is an alkene, with a C=C double bond', 'The compound is an alkane with only single bonds', 'The compound contains oxygen', 'The compound is a polymer'],
  'The ending names the homologous series.');
M('C4.4-03', 'What is the name of CH₃CH₂CH₂CH₃?',
  ['Butane', 'Propane', 'Butene', 'Pentane'],
  'Four carbons, all single bonds.');
T('C4.4-04', 'Ethene contains two carbon atoms.', true,
  'True. eth- means 2 carbons; -ene means a C=C bond.');
MH('C4.4-05', 'What is the name of CH₂=CHCH₂CH₃?',
  ['But-1-ene', 'But-2-ene', 'Propene', 'Butane'],
  'Four carbons, with the double bond starting at carbon 1.');
M('C4.5-01', 'How many different unbranched structures are there for C₄H₈ alkenes?',
  ['Two: but-1-ene and but-2-ene', 'One: butene only', 'Three: but-1-, -2- and -3-ene', 'Four, one for each carbon'],
  'The C=C can be at the end or in the middle of the chain.');
M('C4.5-02', 'C₄H₁₀ has two structures. What are they?',
  ['Butane and methylpropane', 'Butane and butene', 'Propane and methylpropane', 'Butane and pentane'],
  'One straight chain, one branched.');
T('C4.5-03', 'Isomers have the same structural formula but different molecular formulae.', false,
  'False. Isomers have the same molecular formula but different structures.');
MH('C4.5-04', 'Which pair are isomers?',
  ['But-1-ene and but-2-ene', 'Ethane and ethene', 'Propane and butane', 'Methane and methanol'],
  'Both are C₄H₈.');
M('C4.6-01', 'Ethene reacts with bromine to form 1,2-dibromoethane. What type of reaction is this?',
  ['Addition', 'Substitution', 'Combustion', 'Neutralisation'],
  'Two molecules join to make one product.');
M('C4.6-02', 'Methane reacts with chlorine in UV light to form chloromethane and HCl. What type of reaction is this?',
  ['Substitution', 'Addition', 'Combustion', 'Thermal decomposition'],
  'A hydrogen atom is swapped for a chlorine atom.');
T('C4.6-03', 'Burning propane in oxygen is a combustion reaction.', true,
  'True.');
MH('C4.6-04', 'Why do alkanes react with halogens by substitution, not addition?',
  ['Alkanes are saturated, so there is no double bond to add across', 'Alkanes contain a C=C double bond, which halogens cannot reach', 'Halogens never react with any hydrocarbon, alkane or alkene', 'Alkanes contain oxygen atoms that are swapped for halogen atoms'],
  'An atom must be replaced instead.');
M('C4.7-01', 'What is crude oil?',
  ['A mixture of hydrocarbons', 'A single pure compound', 'A mixture of alcohols', 'A pure element'],
  'Most of them are alkanes.');
T('C4.7-02', 'Crude oil is a pure substance.', false,
  'False. It is a mixture of many hydrocarbons.');
M('C4.7-03', 'Why must crude oil be separated before use?',
  ['It is a mixture whose hydrocarbons have different uses', 'It is too pure to burn without first being mixed', 'It is a solid at room temperature and cannot flow', 'It contains only one compound, which is not useful'],
  'Fractional distillation separates it.');
MH('C4.7-04', 'Crude oil is a mixture, not a compound. What evidence supports this?',
  ['It boils over a wide range of temperatures', 'It has a single fixed boiling point', 'It cannot be separated by physical methods', 'It always has the same formula'],
  'A pure substance has a fixed boiling point.');
M('C4.8-01', 'Where in a fractionating column is it hottest?',
  ['At the bottom', 'At the top', 'In the middle', 'It is the same temperature throughout'],
  'The column has a temperature gradient: hot at the bottom, cool at the top.');
M('C4.8-02', 'How does fractional distillation separate crude oil?',
  ['Hydrocarbons condense at different heights because they have different boiling points', 'Hydrocarbons react with each other at different temperatures to form new fractions', 'The heaviest molecules float up to the top while the lightest sink to the bottom', 'A catalyst in the column splits the long molecules into much shorter molecules'],
  'It is a physical process; no chemical reaction happens.');
T('C4.8-03', 'In a fractionating column, fractions with low boiling points are collected at the top.', true,
  'True. They stay as gases until they reach the cool top.');
MH('C4.8-04', 'Where does a hydrocarbon with a boiling point of 250 °C condense?',
  ['Where the column temperature falls just below 250 °C', 'At the very top of the column, with the gases', 'At the very bottom, left behind as a residue', 'Nowhere, because it stays as a gas throughout'],
  'Each fraction condenses at the level just cooler than its boiling point.');
M('C4.9-01', 'What is kerosene used for?',
  ['Aircraft fuel', 'Road surfaces', 'Bottled gas for cooking', 'Ship fuel'],
  'Bitumen is used for roads; refinery gases for bottled gas.');
M('C4.9-02', 'What is bitumen used for?',
  ['Surfacing roads and roofs', 'Fuel for cars', 'Fuel for aircraft', 'Bottled gas for heating'],
  'It is the thickest fraction, from the bottom of the column.');
M('C4.9-03', 'Which fraction is used as fuel for petrol cars?',
  ['Gasoline', 'Diesel', 'Fuel oil', 'Bitumen'],
  'Diesel is used in diesel engines, lorries and trains.');
T('C4.9-04', 'Fuel oil is used as fuel for ships and some power stations.', true,
  'True.');
MH('C4.9-05', 'Which list gives the fractions in order from the top of the column to the bottom?',
  ['Refinery gases, gasoline, kerosene, diesel, fuel oil, bitumen', 'Bitumen, fuel oil, diesel, kerosene, gasoline, refinery gases', 'Gasoline, refinery gases, diesel, kerosene, bitumen, fuel oil', 'Refinery gases, kerosene, gasoline, fuel oil, diesel, bitumen'],
  'Smallest, lowest-boiling molecules at the top.');
M('C4.10-01', 'How does viscosity change from refinery gases to bitumen?',
  ['It increases (they get thicker)', 'It decreases (they get runnier)', 'It stays the same', 'It increases, then decreases'],
  'Longer molecules have stronger forces between them.');
M('C4.10-02', 'What colour is bitumen compared with gasoline?',
  ['Much darker (black)', 'Lighter (colourless)', 'The same colour', 'Bright yellow'],
  'Fractions get darker as chains get longer.');
T('C4.10-03', 'Fractions with longer molecules have higher boiling points.', true,
  'True. There are stronger forces between the molecules.');
MH('C4.10-04', 'Why do fractions with longer chains have higher boiling points?',
  ['There are stronger intermolecular forces between larger molecules', 'Their covalent bonds are weaker, so the molecules hold on longer', 'They contain more oxygen atoms, which raises the boiling point', 'Their molecules are lighter, so they need more heat to escape'],
  'More energy is needed to separate the molecules. The covalent bonds do not break when boiling.');
M('C4.11-01', 'What is a fuel?',
  ['A substance that releases heat energy when it is burned', 'A substance that absorbs heat when it is burned', 'Any substance found in crude oil', 'A substance that cannot be burned'],
  'Combustion of fuels is exothermic.');
T('C4.11-02', 'A fuel takes in heat energy from the surroundings when it burns.', false,
  'False. A fuel releases heat energy when it burns.');
M('C4.11-03', 'Which of these is <b>not</b> a fuel?',
  ['Bitumen', 'Diesel', 'Kerosene', 'Gasoline'],
  'Bitumen is used to make roads, not burned for energy.');
MH('C4.11-04', 'Why is methane a good fuel for a gas cooker?',
  ['It burns easily and releases a lot of heat energy', 'It absorbs heat when it burns', 'It does not produce any carbon dioxide', 'It is a liquid at room temperature'],
  'Its complete combustion still releases CO₂.');
M('C4.12-01', 'What are the products of the complete combustion of a hydrocarbon?',
  ['Carbon dioxide and water', 'Carbon monoxide and water', 'Carbon and hydrogen', 'Carbon dioxide and hydrogen'],
  'There is plenty of oxygen.');
M('C4.12-02', 'Which product forms during <b>incomplete</b> combustion but not complete combustion?',
  ['Carbon monoxide', 'Water', 'Carbon dioxide', 'Oxygen'],
  'Soot (carbon) can also form.');
T('C4.12-03', 'Incomplete combustion happens when there is not enough oxygen.', true,
  'True.');
MH('C4.12-04', 'Which is the balanced equation for the complete combustion of methane?',
  ['CH₄ + 2O₂ → CO₂ + 2H₂O', 'CH₄ + O₂ → CO₂ + H₂O', '2CH₄ + 3O₂ → 2CO + 4H₂O', 'CH₄ + 2O₂ → C + 2H₂O'],
  'Count the O atoms: 4 on each side.');
M('C4.13-01', 'Why is carbon monoxide poisonous?',
  ['It reduces the capacity of the blood to carry oxygen', 'It makes the blood much more acidic than usual', 'It burns the lining of the lungs when breathed in', 'It stops the heart muscle from contracting at all'],
  'It combines with the blood instead of oxygen.');
T('C4.13-02', 'Carbon monoxide can be detected easily by its strong smell.', false,
  'False. It is colourless and odourless, which is why detectors are needed.');
M('C4.13-03', 'Why are carbon monoxide detectors fitted in homes with gas boilers?',
  ['A faulty boiler may burn gas incompletely and make CO, which cannot be seen or smelt', 'Gas boilers always produce carbon monoxide, even when they are working correctly', 'Carbon monoxide has a strong smell that people find unpleasant and want to avoid', 'They are needed to detect leaks of carbon dioxide gas from the main gas supply pipe'],
  'A poor air supply leads to incomplete combustion.');
MH('C4.13-04', 'What symptom would carbon monoxide poisoning most likely cause?',
  ['Drowsiness and headaches, due to less oxygen reaching the cells', 'A red rash spreading over the skin of the arms', 'A large increase in the sugar level of the blood', 'Better concentration and a faster reaction time'],
  'It can lead to unconsciousness and death.');
M('C4.14-01', 'How are oxides of nitrogen formed in car engines?',
  ['Nitrogen and oxygen from the air react at the high temperature', 'Nitrogen compounds in the petrol react with water vapour', 'They are released from the petrol unchanged as it burns', 'Carbon dioxide from burning reacts with nitrogen in petrol'],
  'Petrol does not contain nitrogen.');
T('C4.14-02', 'The nitrogen in oxides of nitrogen from car engines comes from the air.', true,
  'True.');
M('C4.14-03', 'Why do oxides of nitrogen form in engines but not when nitrogen and oxygen just mix in air?',
  ['The engine reaches a very high temperature', 'The engine contains a catalyst for it', 'Petrol contains lots of nitrogen', 'Air contains no oxygen'],
  'Nitrogen is unreactive at normal temperatures.');
MH('C4.14-04', 'Which gas is formed when nitrogen reacts with oxygen in an engine?',
  ['Nitrogen dioxide (NO₂)', 'Ammonia (NH₃)', 'Nitric acid (HNO₃)', 'Carbon monoxide (CO)'],
  'NO and NO₂ are both formed.');
M('C4.15-01', 'Why does burning some fuels produce sulfur dioxide?',
  ['The fuel contains sulfur impurities which burn', 'Sulfur in the air reacts with oxygen', 'Carbon dioxide reacts with water', 'Nitrogen reacts with oxygen'],
  'Sulfur + oxygen → sulfur dioxide.');
T('C4.15-02', 'Sulfur dioxide comes from sulfur in the air reacting in engines.', false,
  'False. It comes from sulfur impurities in the fuel.');
M('C4.15-03', 'Which equation shows sulfur burning?',
  ['S + O₂ → SO₂', 'S + H₂O → SO₂', 'S + CO₂ → SO₂', 'S + N₂ → SO₂'],
  'Fuels can have sulfur removed before use.');
MH('C4.15-04', 'How can the amount of sulfur dioxide from burning fuels be reduced?',
  ['Remove sulfur from the fuel before it is burned', 'Burn the fuel at a higher temperature', 'Burn the fuel with less oxygen', 'Add more sulfur to the fuel'],
  'Power stations also remove SO₂ from waste gases.');
M('C4.16-01', 'How does sulfur dioxide cause acid rain?',
  ['It dissolves in rainwater to form an acidic solution', 'It makes clouds alkaline', 'It reacts with carbon dioxide to make rain', 'It removes oxygen from rain'],
  'Oxides of nitrogen also dissolve to make acid rain.');
M('C4.16-02', 'Which is a problem caused by acid rain?',
  ['It damages buildings, statues and trees and makes lakes acidic', 'It traps heat in the atmosphere and causes global warming', 'It breaks down the ozone layer high in the atmosphere', 'It makes rivers and lakes more alkaline than normal'],
  'Limestone buildings react with the acid.');
T('C4.16-03', 'Oxides of nitrogen contribute to acid rain.', true,
  'True. They dissolve in water to form acidic solutions.');
MH('C4.16-04', 'Why does acid rain damage limestone statues?',
  ['The acid reacts with calcium carbonate in the limestone', 'The acid freezes in cracks and splits the stone apart', 'The acid makes the limestone magnetic, so dust sticks', 'Limestone dissolves quickly in pure water, even without acid'],
  'Carbon dioxide is given off.');
M('C4.17-01', 'What does catalytic cracking produce?',
  ['Shorter-chain alkanes and alkenes', 'Longer-chain alkanes only', 'Carbon dioxide and water', 'Polymers'],
  'A long-chain alkane is broken into smaller molecules.');
M('C4.17-02', 'Which catalyst is used in catalytic cracking?',
  ['Silica or alumina', 'Iron', 'Manganese(IV) oxide', 'Nickel'],
  'At a temperature of about 600–700 °C.');
M('C4.17-03', 'Which equation shows cracking?',
  ['C₁₀H₂₂ → C₈H₁₈ + C₂H₄', 'C₂H₄ + Br₂ → C₂H₄Br₂', 'CH₄ + 2O₂ → CO₂ + 2H₂O', 'nC₂H₄ → (C₂H₄)ₙ'],
  'An alkane is broken into a shorter alkane and an alkene.');
T('C4.17-04', 'Cracking happens at room temperature without a catalyst.', false,
  'False. It needs silica or alumina at about 600–700 °C.');
MH('C4.17-05', 'C₁₂H₂₆ is cracked to give C₈H₁₈ and one other product. What is it?',
  ['C₄H₈', 'C₄H₁₀', 'C₄H₆', 'C₂₀H₄₄'],
  'Carbons: 12 − 8 = 4. Hydrogens: 26 − 18 = 8. C₄H₈ is an alkene.');
M('C4.18-01', 'Why is cracking necessary?',
  ['There is more demand for short-chain fractions than crude oil supplies', 'Long-chain fractions are always more useful than short-chain ones', 'Crude oil contains far too many short chains and not enough long', 'It removes sulfur from fuels so that they no longer cause acid rain'],
  'Long-chain fractions are in surplus.');
T('C4.18-02', 'Cracking turns less useful long-chain fractions into more useful ones.', true,
  'True. It also makes alkenes for polymers.');
M('C4.18-03', 'Which useful substance, made by cracking, is used to make polymers?',
  ['Alkenes such as ethene', 'Bitumen from the bottom', 'Methane from natural gas', 'Fuel oil for ships'],
  'Alkenes are unsaturated, so they can join up.');
MH('C4.18-04', 'Crude oil contains 10% gasoline, but demand is 25%. How do refineries meet the demand?',
  ['Crack excess long-chain fractions into gasoline-sized molecules', 'Distil the crude oil a second time to get more gasoline', 'Add water to the gasoline fraction to increase its volume', 'Burn the fuel oil fraction to turn it into gasoline'],
  'Supply and demand are balanced by cracking.');
M('C4.19-01', 'What is the general formula for alkanes?',
  ['CₙH₂ₙ₊₂', 'CₙH₂ₙ', 'CₙH₂ₙ₋₂', 'CₙHₙ'],
  'For example, propane C₃H₈.');
M('C4.19-02', 'What is the formula of the alkane with 6 carbon atoms?',
  ['C₆H₁₄', 'C₆H₁₂', 'C₆H₁₀', 'C₆H₆'],
  '2 × 6 + 2 = 14.');
T('C4.19-03', 'Ethane has the formula C₂H₄.', false,
  'False. Ethane is C₂H₆; C₂H₄ is ethene.');
MH('C4.19-04', 'An alkane has 20 hydrogen atoms. How many carbon atoms does it have?',
  ['9', '10', '18', '11'],
  '2n + 2 = 20, so n = 9.');
M('C4.20-01', 'Why are alkanes called <b>saturated</b>?',
  ['They contain only single C–C bonds', 'They contain a C=C double bond', 'They are dissolved in water', 'They contain oxygen atoms'],
  'Each carbon has the maximum number of H atoms.');
T('C4.20-02', 'Alkanes are saturated hydrocarbons.', true,
  'True. They contain only single bonds.');
M('C4.20-03', 'Which hydrocarbon is saturated?',
  ['C₃H₈', 'C₃H₆', 'C₂H₄', 'C₄H₈'],
  'It fits CₙH₂ₙ₊₂.');
MH('C4.20-04', 'Why do saturated hydrocarbons not decolourise bromine water at room temperature?',
  ['They have no C=C double bond for bromine to add across', 'They do not mix with bromine water at all, so cannot react', 'They react with the water instead of with the bromine', 'They contain too few carbon atoms to react with bromine'],
  'Alkanes are relatively unreactive.');
M('C4.21-01', 'How many bonds does each carbon atom form in an alkane?',
  ['4', '2', '3', '1'],
  'Each hydrogen forms 1.');
M('C4.21-02', 'What is the name of the unbranched alkane with five carbon atoms?',
  ['Pentane', 'Butane', 'Hexane', 'Pentene'],
  'C₅H₁₂.');
T('C4.21-03', 'In a displayed formula of methane, the carbon has four single bonds to hydrogen atoms.', true,
  'True.');
MH('C4.21-04', 'How many C–H bonds are in a propane molecule?',
  ['8', '3', '6', '10'],
  'C₃H₈ has 8 hydrogens, each bonded once to carbon. There are also 2 C–C bonds.');
M('C4.22-01', 'What is needed for methane to react with bromine?',
  ['Ultraviolet light', 'A nickel catalyst', 'Water', 'Darkness and cold'],
  'UV light starts the substitution reaction.');
M('C4.22-02', 'What are the products when methane reacts with bromine in UV light?',
  ['Bromomethane and hydrogen bromide', 'Dibromomethane and hydrogen gas', 'Carbon dioxide and water vapour', 'Methene and hydrogen bromide'],
  'CH₄ + Br₂ → CH₃Br + HBr.');
T('C4.22-03', 'In a substitution reaction, one atom is replaced by another.', true,
  'True. An H atom is replaced by a halogen atom.');
MH('C4.22-04', 'Ethane reacts with chlorine in UV light (mono-substitution). What is the organic product?',
  ['Chloroethane, C₂H₅Cl', 'Dichloroethane, C₂H₄Cl₂', 'Chloroethene, C₂H₃Cl', 'Ethene, C₂H₄'],
  'C₂H₆ + Cl₂ → C₂H₅Cl + HCl.');
M('C4.23-01', 'What is the functional group of the alkenes?',
  ['C=C', 'C–C', 'C–H', 'O–H'],
  'A carbon–carbon double bond.');
T('C4.23-02', 'Alkenes contain only single carbon–carbon bonds.', false,
  'False. Alkenes contain a C=C double bond.');
M('C4.23-03', 'Which molecule has the functional group C=C?',
  ['Propene', 'Propane', 'Methane', 'Ethane'],
  'The -ene ending shows it.');
MH('C4.23-04', 'Why is the C=C double bond called the functional group of alkenes?',
  ['It is the part of the molecule that takes part in their typical reactions', 'It makes alkenes the heaviest hydrocarbons in each crude oil fraction', 'It is the only covalent bond in the whole molecule of every alkene', 'It stops alkenes from burning, unlike the alkanes which burn easily'],
  'For example, addition of bromine.');
M('C4.24-01', 'What is the general formula for alkenes?',
  ['CₙH₂ₙ', 'CₙH₂ₙ₊₂', 'CₙH₂ₙ₋₂', 'CₙHₙ₊₂'],
  'For example, ethene C₂H₄.');
M('C4.24-02', 'What is the formula of propene?',
  ['C₃H₆', 'C₃H₈', 'C₃H₄', 'C₂H₄'],
  '2 × 3 = 6.');
T('C4.24-03', 'Butene has the formula C₄H₁₀.', false,
  'False. Butene is C₄H₈; C₄H₁₀ is butane.');
MH('C4.24-04', 'Which formula could be an alkene?',
  ['C₅H₁₀', 'C₅H₁₂', 'C₅H₈', 'C₅H₁₄'],
  'Fits CₙH₂ₙ with n = 5.');
M('C4.25-01', 'Why are alkenes called <b>unsaturated</b>?',
  ['They contain a C=C double bond', 'They contain only single bonds', 'They contain oxygen', 'They do not dissolve in water'],
  'More atoms can be added across the double bond.');
T('C4.25-02', 'Alkenes are saturated hydrocarbons.', false,
  'False. The C=C double bond makes them unsaturated.');
M('C4.25-03', 'Which hydrocarbon is unsaturated?',
  ['C₂H₄', 'C₂H₆', 'CH₄', 'C₃H₈'],
  'Ethene has a C=C bond.');
MH('C4.25-04', 'An unsaturated hydrocarbon reacts with hydrogen. What forms?',
  ['A saturated alkane', 'A longer alkene', 'Carbon dioxide and water', 'A polymer'],
  'H₂ adds across the C=C bond in an addition reaction.');
M('C4.26-01', 'What is the name of the alkene with two carbon atoms?',
  ['Ethene', 'Ethane', 'Methene', 'Propene'],
  'C₂H₄, CH₂=CH₂.');
M('C4.26-02', 'What is the structural formula of propene?',
  ['CH₂=CHCH₃', 'CH₃CH₂CH₃', 'CH₂=CH₂', 'CH₃CH=CHCH₃'],
  'Three carbons with one C=C.');
T('C4.26-03', 'In ethene, each carbon atom forms a double bond to the other carbon and single bonds to two hydrogen atoms.', true,
  'True. Each carbon still forms 4 bonds in total.');
MH('C4.26-04', 'What is the name of CH₃CH=CHCH₃?',
  ['But-2-ene', 'But-1-ene', 'Butane', 'Propene'],
  'The double bond starts at carbon 2.');
M('C4.27-01', 'What forms when ethene reacts with bromine?',
  ['1,2-dibromoethane', 'Bromoethane and HBr', 'Bromoethene', 'Ethane and bromine water'],
  'C₂H₄ + Br₂ → C₂H₄Br₂.');
M('C4.27-02', 'What type of reaction happens when bromine reacts with an alkene?',
  ['Addition', 'Substitution', 'Combustion', 'Cracking'],
  'The two bromine atoms add across the double bond.');
T('C4.27-03', 'When bromine reacts with propene, the product is 1,2-dibromopropane.', true,
  'True. C₃H₆ + Br₂ → C₃H₆Br₂.');
MH('C4.27-04', 'Why does the alkene\'s C=C bond become a single bond when bromine adds?',
  ['One bond of the double bond breaks so each carbon can bond to a bromine atom', 'The bromine removes one carbon atom, leaving a shorter single-bonded chain', 'Hydrogen atoms are replaced by bromine atoms, so the bond type must change', 'The molecule splits into two halves, and each half bonds to a bromine atom'],
  'Each carbon still forms four bonds.');
M('C4.28-01', 'What colour change happens when bromine water is shaken with an alkene?',
  ['Orange to colourless', 'Colourless to orange', 'Orange to purple', 'No change'],
  'Alkanes leave it orange.');
M('C4.28-02', 'Bromine water is shaken with an alkane. What is seen?',
  ['It stays orange', 'It turns colourless', 'It turns blue', 'It turns milky'],
  'Alkanes have no C=C bond.');
T('C4.28-03', 'Both alkanes and alkenes decolourise bromine water.', false,
  'False. Only alkenes decolourise it; alkanes leave it orange.');
MH('C4.28-04', 'A hydrocarbon has formula C₆H₁₂ and decolourises bromine water. What can you conclude?',
  ['It is an alkene: it contains a C=C bond', 'It is an alkane: only single bonds', 'It contains oxygen, which reacts', 'It is a polymer with a long chain'],
  'C₆H₁₂ fits CₙH₂ₙ and reacts by addition.');
M('C4.44-01', 'What is an addition polymer made from?',
  ['Many small molecules called monomers joined together', 'Many large molecules split apart into small pieces', 'A single alkane molecule with a very long chain', 'Water and carbon dioxide joined up in long chains'],
  'Alkenes are the monomers.');
M('C4.44-02', 'Which monomer makes poly(ethene)?',
  ['Ethene', 'Ethane', 'Propene', 'Chloroethene'],
  'The double bonds open up and the molecules join.');
T('C4.44-03', 'Alkanes can be used as monomers to make addition polymers.', false,
  'False. Monomers need a C=C double bond, so alkenes are used.');
MH('C4.44-04', 'What happens to the C=C bonds when ethene forms poly(ethene)?',
  ['They open up into single bonds, joining the monomers in a long chain', 'They break apart completely, so every ethene turns into ethane', 'They stay as double bonds, linking the monomers side by side', 'They react with oxygen from the air to join the chains together'],
  'Poly(ethene) is saturated.');
M('C4.45-01', 'What is the repeat unit of poly(ethene)?',
  ['–CH₂–CH₂–', '–CH=CH–', 'CH₂=CH₂', '–CH₂–CHCl–'],
  'The repeat unit has single bonds and bonds sticking out at each end.');
M('C4.45-02', 'Which polymer has the repeat unit –CF₂–CF₂–?',
  ['Poly(tetrafluoroethene), PTFE', 'Poly(chloroethene), PVC', 'Poly(propene)', 'Poly(ethene)'],
  'PTFE is used for non-stick pans.');
T('C4.45-03', 'The repeat unit of an addition polymer contains a C=C double bond.', false,
  'False. The double bond opens up, so the repeat unit has only single C–C bonds.');
MH('C4.45-04', 'What is the repeat unit of poly(propene)?',
  ['–CH₂–CH(CH₃)–', '–CH₂–CH₂–CH₂–', 'CH₂=CHCH₃', '–CH(CH₃)=CH₂–'],
  'Propene is CH₂=CHCH₃; the CH₃ is a side group.');
M('C4.46-01', 'A polymer has the repeat unit –CH₂–CHCl–. What is the monomer?',
  ['Chloroethene, CH₂=CHCl', 'Chloroethane, CH₃CH₂Cl', 'Ethene, CH₂=CH₂', 'Dichloroethene'],
  'Put the C=C back between the two carbons.');
M('C4.46-02', 'How do you find the monomer from a repeat unit?',
  ['Change the C–C in the main chain to C=C and remove the extension bonds', 'Add an oxygen atom to each carbon atom in the repeat unit', 'Double the number of hydrogen atoms shown in the repeat unit', 'Remove all the side groups and keep only the carbon atoms'],
  'Side groups stay where they are.');
T('C4.46-03', 'The monomer of poly(tetrafluoroethene) is CF₂=CF₂.', true,
  'True.');
MH('C4.46-04', 'What is the repeat unit of the polymer made from CH₂=CHCN?',
  ['–CH₂–CH(CN)–', '–CH=CH(CN)–', 'CH₂=CHCN', '–CH₂–CH₂–CN–'],
  'The double bond opens; the CN side group stays.');
M('C4.47-01', 'Why do addition polymers cause problems in landfill?',
  ['They are inert and do not biodegrade', 'They decompose very quickly', 'They dissolve in rainwater', 'They react with soil to form acids'],
  'They can last for hundreds of years.');
M('C4.47-02', 'What is a problem with burning addition polymers?',
  ['Toxic gases can be produced', 'They release no energy at all', 'They do not burn at all', 'They only produce oxygen'],
  'PVC releases hydrogen chloride; incomplete combustion releases CO.');
T('C4.47-03', 'Addition polymers are easily broken down by bacteria.', false,
  'False. Most are not biodegradable.');
MH('C4.47-04', 'Why are most addition polymers so unreactive?',
  ['Their long chains have only strong single C–C and C–H bonds, like alkanes', 'They contain many reactive C=C double bonds along every chain', 'They are ionic compounds held together by strong electrostatic forces', 'They are dissolved in water, which stops them from reacting with oxygen'],
  'This is why they are hard to dispose of.');

/* ===================== BIOLOGY 3 Reproduction and inheritance (added 7 Nov 2026) ===================== */
M('B3.1-01', 'Which is a feature of <b>asexual</b> reproduction?',
  ['One parent; offspring genetically identical', 'Two parents; offspring genetically varied', 'Gametes fuse to form a zygote', 'Meiosis produces the offspring'],
  'Asexual reproduction uses mitosis.');
M('B3.1-02', 'Which is an advantage of sexual reproduction?',
  ['It produces variation, so a species can adapt to change', 'It is faster and needs only one parent to find a mate', 'All offspring are identical to the parent', 'No gametes need to be produced'],
  'Variation helps a species survive changes in the environment.');
T('B3.1-03', 'Asexual reproduction involves the fusion of gametes.', false,
  'False. Sexual reproduction involves the fusion of gametes; asexual reproduction does not.');
MH('B3.1-04', 'Why can asexual reproduction be an advantage for a plant in a stable environment?',
  ['It is quick and copies a well-adapted parent exactly', 'It produces lots of variation in the offspring each year', 'It needs a partner, so genes are mixed', 'It lets the plant evolve faster than others'],
  'A disadvantage: one disease could affect all the identical offspring.');
M('B3.2-01', 'What is formed when a male and female gamete fuse?',
  ['A zygote', 'An embryo', 'A gamete', 'A placenta'],
  'The zygote divides by mitosis to form an embryo.');
M('B3.2-02', 'What happens to the zygote after fertilisation?',
  ['It divides by mitosis and develops into an embryo', 'It divides by meiosis to form four new gametes quickly', 'It fuses with another zygote', 'It stays as a single cell for months'],
  'Cell division forms a ball of cells, then an embryo.');
T('B3.2-03', 'Fertilisation is the fusion of a sperm nucleus with an egg nucleus.', true,
  'True. In plants, a pollen nucleus fuses with an ovule nucleus.');
MH('B3.2-04', 'A zygote contains how many sets of chromosomes?',
  ['Two: one set from each parent', 'One: only from the mother', 'One: only from the father', 'Four: two from each parent'],
  'Gametes are haploid, so the zygote is diploid.');
M('B3.3-01', 'Which feature is typical of a wind-pollinated flower?',
  ['Feathery stigmas hanging outside the flower', 'Large petals with bright colours and a scent', 'Sweet nectar produced deep inside the flower', 'Sticky, spiky pollen grains held on anthers'],
  'Feathery stigmas catch pollen from the air.');
M('B3.3-02', 'Why do insect-pollinated flowers have brightly coloured petals?',
  ['To attract insects to the flower', 'To catch pollen blown in the wind', 'To make more pollen grains', 'To protect the ovary from rain'],
  'Scent and nectar attract insects too.');
M('B3.3-03', 'What is the job of the <b>anther</b>?',
  ['To produce pollen', 'To catch pollen', 'To make nectar', 'To hold the ovules'],
  'The anther is on the end of the filament (together, the stamen).');
T('B3.3-04', 'Wind-pollinated flowers produce small amounts of sticky, spiky pollen.', false,
  'False. They produce large amounts of light, smooth pollen; sticky, spiky pollen suits insects.');
MH('B3.3-05', 'Grass flowers have anthers that hang outside the flower on long filaments. Why?',
  ['So the wind can easily carry the pollen away', 'So insects can land on them and collect the nectar', 'So the anthers can make nectar', 'So the pollen stays inside the flower'],
  'Insect-pollinated flowers keep anthers inside, where insects brush past.');
M('B3.4-01', 'After pollination, what grows down through the style to the ovary?',
  ['A pollen tube', 'A seed coat', 'The stigma', 'A root hair'],
  'It carries the male nucleus to the ovule.');
M('B3.4-02', 'After fertilisation, what does the ovule become?',
  ['A seed', 'A fruit', 'A petal', 'A pollen grain'],
  'The ovary becomes the fruit.');
T('B3.4-03', 'After fertilisation, the ovary develops into the seed.', false,
  'False. The ovary becomes the fruit; the ovules inside become the seeds.');
MH('B3.4-04', 'What is the order of events from pollination to seed formation?',
  ['Pollination → pollen tube grows → fertilisation → seed forms', 'Fertilisation → pollination → pollen tube grows → seed forms', 'Pollen tube grows → pollination → seed forms → fertilisation', 'Pollination → seed forms → fertilisation → pollen tube grows'],
  'The pollen tube must reach the ovule before fertilisation.');
M('B3.5-01', 'Which three conditions do seeds need to germinate?',
  ['Water, oxygen and a suitable temperature', 'Light, water and carbon dioxide from the air', 'Soil, light and fertiliser', 'Oxygen, light and soil'],
  'Light is not needed: the seed has its own food store.');
M('B3.5-02', 'In a germination experiment, seeds are kept in boiled, cooled water with a layer of oil on top. Which condition is being tested?',
  ['Oxygen', 'Light', 'Temperature', 'Water'],
  'Boiling removes dissolved oxygen; the oil stops more dissolving.');
T('B3.5-03', 'Seeds need light to germinate.', false,
  'False. They need water, oxygen and warmth. Light is needed later, for photosynthesis.');
MH('B3.5-04', 'Seeds on dry cotton wool do not germinate, but seeds on damp cotton wool do. What is the control variable that must be the same?',
  ['Temperature (and oxygen)', 'The amount of water', 'Whether the seeds germinate', 'The number of seeds that grow'],
  'Only the water is changed.');
M('B3.6-01', 'Where does a germinating seed get its energy before it has leaves?',
  ['From the food store in the seed', 'From photosynthesis in its leaves', 'From the soil, through its roots', 'From light absorbed by the seed coat'],
  'Starch is broken down to glucose and respired.');
M('B3.6-02', 'Why does the dry mass of a germinating seed decrease at first?',
  ['The stored food is used up in respiration', 'Water is absorbed and replaces the food', 'The seed photosynthesises too slowly', 'Minerals are taken in from the soil'],
  'Once leaves form, photosynthesis increases the dry mass.');
T('B3.6-03', 'A seedling can only make its own food once it can carry out photosynthesis.', true,
  'True. Until then it relies on its food reserves.');
MH('B3.6-04', 'What do enzymes do to the starch in a germinating seed?',
  ['Break it down to sugars for respiration and growth', 'Turn it into protein to build a thicker seed coat', 'Store it as fat in the leaves', 'Convert it to oxygen for the seedling'],
  'Amylase digests starch to maltose, then glucose.');
M('B3.7-01', 'Strawberry plants send out runners that grow into new plants. What type of reproduction is this?',
  ['Natural asexual reproduction', 'Artificial asexual reproduction', 'Sexual reproduction', 'Pollination'],
  'The new plants are clones.');
M('B3.7-02', 'A gardener takes cuttings from a plant. What is true of the new plants?',
  ['They are genetically identical to the parent', 'They are genetically different from the parent', 'They were produced by fertilisation', 'They each have two parent plants'],
  'Cuttings are artificial asexual reproduction.');
T('B3.7-03', 'Taking cuttings is a natural method of asexual reproduction.', false,
  'False. Cuttings are artificial; runners are natural.');
MH('B3.7-04', 'Why might a grower dip cuttings in rooting powder?',
  ['It contains plant hormones that make roots grow quickly', 'It kills all of the bacteria in the soil near the stem', 'It makes the cutting produce flowers within a few days', 'It supplies the glucose the cutting needs to photosynthesise'],
  'Roots let the cutting take up water and minerals.');
M('B3.8-01', 'Where are sperm produced?',
  ['In the testes', 'In the prostate gland', 'In the sperm duct', 'In the urethra'],
  'The scrotum keeps the testes slightly cooler than the body.');
M('B3.8-02', 'Where does fertilisation usually happen in a woman?',
  ['In the oviduct', 'In the uterus', 'In the ovary', 'In the vagina'],
  'The fertilised egg then moves to the uterus.');
M('B3.8-03', 'Why does the uterus have a thick lining?',
  ['So an embryo can implant and be nourished', 'So that eggs can be produced inside it', 'So that sperm can be made and stored there', 'So the oviduct can contract more strongly'],
  'The lining is rich in blood vessels.');
T('B3.8-04', 'The oviduct is lined with cilia that move the egg towards the uterus.', true,
  'True.');
MH('B3.8-05', 'Why do glands add fluid to sperm?',
  ['To give nutrients and a liquid for the sperm to swim in', 'To produce many more sperm cells inside the glands', 'To make the sperm cells haploid before they are released', 'To stop the sperm moving until they reach the uterus'],
  'The prostate gland and seminal vesicles produce semen.');
M('B3.9-01', 'What is the role of <b>oestrogen</b> in the menstrual cycle?',
  ['It makes the uterus lining thicken', 'It keeps the lining intact after ovulation', 'It makes the egg leave the ovary', 'It breaks down the uterus lining'],
  'Progesterone then maintains the lining.');
M('B3.9-02', 'What is the role of <b>progesterone</b> in the menstrual cycle?',
  ['It maintains the thick lining of the uterus', 'It starts the growth of the lining after menstruation', 'It produces the egg cell', 'It causes the lining to break down'],
  'When progesterone falls, menstruation starts.');
T('B3.9-03', 'Oestrogen and progesterone are both produced by the testes.', false,
  'False. They are produced by the ovaries.');
MH('B3.9-04', 'Why does a fall in progesterone lead to menstruation?',
  ['Progesterone is no longer maintaining the uterus lining, so it breaks down', 'Low progesterone causes a new egg to be released at once, which breaks the lining', 'Progesterone makes the lining thicker as it falls', 'It makes oestrogen rise sharply and destroy the egg'],
  'If an embryo implants, progesterone stays high.');
M('B3.11-01', 'What is the role of the placenta?',
  ['To exchange food, oxygen and waste between mother and embryo', 'To protect the embryo from knocks and bumps inside the uterus', 'To produce new eggs ready for the next possible pregnancy', 'To mix the blood of the mother and the embryo together freely'],
  'The two bloodstreams stay separate.');
M('B3.11-02', 'Which substance passes from the embryo\'s blood to the mother\'s blood?',
  ['Carbon dioxide', 'Glucose and amino acids', 'Oxygen', 'Amino acids'],
  'Urea also passes from embryo to mother.');
T('B3.11-03', 'In the placenta, the mother\'s blood mixes with the embryo\'s blood.', false,
  'False. They are close but separate; substances diffuse across.');
MH('B3.11-04', 'How is the placenta adapted for exchange?',
  ['It has villi giving a large surface area and a thin barrier', 'It has a thick wall that stops diffusion of any harmful waste', 'It has a small surface area, so it uses less of the mother\'s energy', 'It joins the two bloodstreams so that blood flows directly across'],
  'Short diffusion distance, large surface area, good blood supply.');
M('B3.12-01', 'How is the developing embryo protected?',
  ['By the amniotic fluid, which cushions it', 'By the placenta, which surrounds it completely', 'By the uterus lining breaking down', 'By the oviduct, which holds it'],
  'The fluid is held in the amniotic sac.');
T('B3.12-02', 'Amniotic fluid supplies the embryo with all of its food.', false,
  'False. Food comes via the placenta; amniotic fluid protects the embryo from bumps.');
M('B3.12-03', 'Where is the amniotic fluid found?',
  ['In the amniotic sac around the embryo', 'Inside the placenta\'s blood vessels', 'Inside the umbilical cord\'s vessels', 'In the oviduct, above the uterus'],
  'The membranes form a fluid-filled bag.');
MH('B3.12-04', 'Why is amniotic fluid better than air at protecting the embryo?',
  ['A liquid cannot be compressed, so it absorbs and spreads out shocks', 'It provides all of the food that the embryo needs to grow and develop', 'It carries oxygen straight to the embryo\'s lungs throughout pregnancy', 'It keeps the embryo completely dry so that infections cannot get in'],
  'It also keeps the temperature steady.');
M('B3.13-01', 'Which hormone causes the development of male secondary sexual characteristics?',
  ['Testosterone', 'Oestrogen', 'Progesterone', 'Insulin'],
  'It is produced in the testes.');
M('B3.13-02', 'Which is a female secondary sexual characteristic caused by oestrogen?',
  ['Breasts develop and hips widen', 'The voice breaks and deepens', 'Facial hair starts to grow', 'Muscles develop much more'],
  'The others are caused by testosterone.');
T('B3.13-03', 'Secondary sexual characteristics are fully developed at birth.', false,
  'False. They develop at puberty.');
MH('B3.13-04', 'Which change happens at puberty in both boys and girls?',
  ['Pubic and underarm hair grows', 'The voice breaks and deepens', 'Breasts develop', 'Sperm production starts'],
  'Both testosterone and oestrogen cause body hair growth.');
M('B3.14-01', 'What is a gene?',
  ['A section of DNA that codes for a specific protein', 'The whole of the DNA found inside an organism', 'A whole chromosome found inside the nucleus', 'A different form of an inherited characteristic'],
  'The genome is the entire DNA.');
M('B3.14-02', 'What is the <b>genome</b> of an organism?',
  ['The entire DNA of the organism', 'One section of DNA coding for a protein', 'All of the proteins in a cell', 'The pair of sex chromosomes'],
  'The human genome was fully sequenced in 2003.');
T('B3.14-03', 'A gene codes for a specific carbohydrate.', false,
  'False. A gene codes for a specific protein.');
MH('B3.14-04', 'How can a gene affect a characteristic such as eye colour?',
  ['It codes for a protein, such as an enzyme that makes a pigment', 'It travels to the eye and colours the iris directly itself', 'It is itself a coloured pigment molecule found in the eye', 'It changes the shape of the chromosome that is in the eye'],
  'Proteins carry out the instructions in the gene.');
M('B3.15-01', 'Where are genes found?',
  ['On chromosomes in the nucleus', 'In the cytoplasm, around the nucleus', 'In the cell membrane', 'Inside the ribosomes'],
  'Chromosomes are long molecules of DNA.');
T('B3.15-02', 'Chromosomes are found in the cell membrane.', false,
  'False. Chromosomes are in the nucleus.');
M('B3.15-03', 'Which list is in order of size, largest first?',
  ['Nucleus, chromosome, gene', 'Gene, chromosome, nucleus', 'Chromosome, nucleus, gene', 'Nucleus, gene, chromosome'],
  'Each chromosome carries many genes.');
MH('B3.15-04', 'Red blood cells have no nucleus. What does this mean?',
  ['They contain no chromosomes, so no DNA', 'They contain more genes than other cells', 'Their genes are in the cell membrane', 'They make new chromosomes when needed'],
  'This leaves more room for haemoglobin.');
M('B3.19-01', 'What is an <b>allele</b>?',
  ['A different form of a gene', 'A whole chromosome pair', 'A type of large protein', 'The entire DNA of a cell'],
  'For example, the alleles for brown and blue eyes.');
T('B3.19-02', 'Different alleles of a gene can give rise to different inherited characteristics.', true,
  'True.');
M('B3.19-03', 'How many alleles for each gene does a body cell normally have?',
  ['Two', 'One', 'Four', '23'],
  'One on each chromosome of a pair.');
MH('B3.19-04', 'Why do brothers and sisters often look different?',
  ['They inherit different combinations of alleles from their parents', 'They have completely different genes from each other and from their parents', 'Only one of them inherits genes from the father', 'They have different numbers of chromosomes'],
  'Meiosis and random fertilisation shuffle alleles.');
M('B3.20-01', 'What does <b>heterozygous</b> mean?',
  ['Having two different alleles of a gene', 'Having two identical alleles of a gene', 'Having only one allele of a gene', 'Showing the recessive characteristic'],
  'For example Bb.');
M('B3.20-02', 'What is the <b>phenotype</b>?',
  ['The characteristic that is shown', 'The alleles that are present', 'The number of chromosomes', 'The entire DNA of an organism'],
  'The genotype is the alleles, e.g. Bb.');
M('B3.20-03', 'A recessive allele is only expressed when…',
  ['two copies are present', 'one copy is present', 'a dominant allele is present', 'the organism is heterozygous'],
  'For example, bb.');
T('B3.20-04', 'A homozygous dominant genotype could be written as BB.', true,
  'True. Two identical, dominant alleles.');
MH('B3.20-05', 'A plant is tall (T dominant). Which genotypes could it have?',
  ['TT or Tt', 'Tt only, never TT', 'TT only', 'tt only'],
  'A test cross with a tt plant would show which.');
M('B3.22-01', 'What does <b>polygenic</b> inheritance mean?',
  ['A characteristic is controlled by several genes', 'A characteristic is controlled by one gene', 'A gene has only one allele', 'A characteristic is only environmental'],
  'Most features are polygenic.');
M('B3.22-02', 'Which characteristic is most likely to be polygenic?',
  ['Height', 'Blood group', 'Cystic fibrosis', 'Ability to roll the tongue'],
  'Polygenic features show a continuous range.');
T('B3.22-03', 'Most phenotypic features are controlled by a single gene.', false,
  'False. Most result from polygenic inheritance.');
MH('B3.22-04', 'Why do polygenic characteristics show continuous variation?',
  ['Many genes each add a small effect, giving a range of values', 'One gene with two alleles gives a range of many different values', 'Only the environment controls them', 'They are always recessive'],
  'For example, height or skin colour.');
M('B3.23-01', 'Two heterozygous parents (Bb × Bb) are crossed. What is the expected ratio of dominant to recessive phenotypes?',
  ['3 : 1', '1 : 1', '1 : 2 : 1', 'All dominant'],
  'BB, Bb, Bb (dominant) : bb (recessive).');
M('B3.23-02', 'What does a Punnett square show?',
  ['The possible genotypes of offspring from a cross', 'The number of chromosomes inside each of the parents\' cells', 'The order of the bases along one gene', 'The stages of mitosis in a dividing cell'],
  'Gametes go along the top and side.');
M('B3.23-03', 'What gametes can a parent with genotype Aa produce?',
  ['A and a', 'Aa only', 'AA and aa', 'A only'],
  'Each gamete carries one allele.');
T('B3.23-04', 'Crossing BB with bb gives all heterozygous offspring.', true,
  'True. All offspring are Bb.');
MH('B3.23-05', 'A cross between Bb and bb is carried out. What is the expected ratio of offspring genotypes?',
  ['1 Bb : 1 bb', '3 Bb : 1 bb', '1 BB : 2 Bb : 1 bb', 'All Bb'],
  'Half get B from the Bb parent, half get b.');
M('B3.24-01', 'In a family pedigree chart, what does a square usually represent?',
  ['A male', 'A female', 'An affected person only', 'A marriage'],
  'Circles are females; shaded symbols are affected.');
M('B3.24-02', 'Two unaffected parents have an affected child. What does this show about the condition?',
  ['It is caused by a recessive allele', 'It is caused by a dominant allele', 'It is not inherited at all', 'It is caused by the environment only'],
  'Both parents must be carriers (heterozygous).');
T('B3.24-03', 'In a pedigree chart, shaded symbols usually show people with the condition.', true,
  'True.');
MH('B3.24-04', 'Two affected parents have an unaffected child. What does this show?',
  ['The condition is dominant and both parents are heterozygous', 'The condition is recessive and both parents are carriers', 'Both parents are homozygous recessive for the condition', 'The condition cannot be inherited from parents at all'],
  'If it were recessive, two affected (aa) parents could only have aa children.');
M('B3.25-01', 'Two carriers of cystic fibrosis (Ff × Ff) have a child. What is the probability the child has cystic fibrosis?',
  ['25% (1 in 4)', '50% (1 in 2)', '75% (3 in 4)', '0%'],
  'Only ff has the condition.');
M('B3.25-02', 'A heterozygous parent (Tt) and a homozygous recessive parent (tt) have a child. What is the probability the child shows the recessive phenotype?',
  ['50%', '25%', '75%', '100%'],
  'Tt × tt → Tt, Tt, tt, tt.');
T('B3.25-03', 'If two carriers already have one affected child, the chance the next child is affected is still 1 in 4.', true,
  'True. Each fertilisation is independent.');
MH('B3.25-04', 'Two Bb parents have a child that shows the dominant phenotype. What is the probability that this child is heterozygous?',
  ['2 in 3', '1 in 2', '1 in 4', '3 in 4'],
  'Dominant offspring are BB, Bb, Bb: two of the three are Bb.');
M('B3.26-01', 'What are the sex chromosomes of a human male?',
  ['XY', 'XX', 'YY', 'XXY'],
  'Females are XX.');
T('B3.26-02', 'The sex of a person is controlled by all 23 pairs of chromosomes.', false,
  'False. One pair controls it: XX in females, XY in males.');
M('B3.26-03', 'Which sex chromosomes can be found in a woman\'s eggs?',
  ['X only', 'Y only', 'X or Y', 'XX'],
  'Every egg carries one X.');
MH('B3.26-04', 'Which parent decides the sex of the baby?',
  ['The father, because sperm carry X or Y', 'The mother, because eggs carry X or Y', 'Both parents equally decide it', 'Neither; it depends on the uterus'],
  'All eggs carry X.');
M('B3.27-01', 'What is the probability that a baby will be a boy?',
  ['50%', '25%', '75%', '100%'],
  'XX × XY → XX, XX, XY, XY.');
M('B3.27-02', 'In a genetic diagram for sex determination, what are the gametes from the father?',
  ['X and Y', 'X and X', 'Y and Y', 'XY only'],
  'Half the sperm carry X, half carry Y.');
T('B3.27-03', 'A couple with three daughters is more likely to have a son next time.', false,
  'False. The chance is still 50% each time.');
MH('B3.27-04', 'A sperm carrying an X chromosome fertilises an egg. What is the sex of the baby?',
  ['Female (XX)', 'Male (XY)', 'Either, with equal chance', 'It depends on the egg'],
  'The egg always gives an X.');
M('B3.28-01', 'What does mitosis produce?',
  ['Two genetically identical diploid cells', 'Four genetically different haploid cells', 'Two genetically different haploid cells', 'Four genetically identical diploid cells'],
  'The chromosomes are copied first.');
T('B3.28-02', 'Mitosis produces cells with the same number of chromosomes as the parent cell.', true,
  'True.');
M('B3.28-03', 'A cell with 46 chromosomes divides by mitosis. How many chromosomes are in each new cell?',
  ['46', '23', '92', '12'],
  'Mitosis keeps the number the same.');
MH('B3.28-04', 'Why must DNA be copied before mitosis?',
  ['So each new cell gets a full, identical set of chromosomes', 'So the new cells have twice as many chromosomes as the parent', 'So the new cells are genetically different', 'So the cell can become a gamete'],
  'Copies are separated to opposite ends of the cell.');
M('B3.29-01', 'Which of these uses mitosis?',
  ['Repairing a cut in the skin', 'Making sperm cells in testes', 'Making egg cells in ovaries', 'Fertilisation of an egg cell'],
  'Growth, repair, cloning and asexual reproduction use mitosis.');
M('B3.29-02', 'Why is mitosis used in asexual reproduction?',
  ['It makes identical copies of the parent\'s cells', 'It halves the number of chromosomes in each new cell', 'It mixes genes from two parents', 'It produces gametes'],
  'The offspring are clones.');
T('B3.29-03', 'Gametes are produced by mitosis.', false,
  'False. Gametes are produced by meiosis.');
MH('B3.29-04', 'A zygote grows into a baby. Which type of cell division is mainly involved?',
  ['Mitosis', 'Meiosis', 'Fertilisation', 'Binary fission'],
  'All body cells are genetically identical to the zygote.');
M('B3.30-01', 'What does meiosis produce?',
  ['Four genetically different haploid cells', 'Two genetically identical diploid cells', 'Four genetically identical diploid cells', 'Two genetically different diploid cells'],
  'These cells are gametes.');
M('B3.30-02', 'Where does meiosis happen in humans?',
  ['In the testes and ovaries', 'In the skin, bones and muscles', 'In the stomach', 'In all body cells'],
  'Meiosis makes gametes.');
T('B3.30-03', 'Meiosis doubles the number of chromosomes.', false,
  'False. It halves it, from 46 to 23 in humans.');
MH('B3.30-04', 'Why must gametes be haploid?',
  ['So the zygote has the normal diploid number after fertilisation', 'So the zygote has twice the normal number of chromosomes', 'So the gametes can go on to divide by mitosis after release', 'So that all of the gametes made are genetically identical'],
  '23 + 23 = 46.');
M('B3.31-01', 'Why does random fertilisation produce variation?',
  ['Any one of many different sperm can fuse with any egg', 'Every sperm cell made by one man is genetically identical', 'The egg always chooses the best of the sperm', 'Fertilisation simply copies the mother\'s genes'],
  'Each gamete has a different combination of alleles.');
T('B3.31-02', 'Offspring from sexual reproduction are genetically identical to each other.', false,
  'False. Except identical twins, they vary.');
M('B3.31-03', 'Which two processes together produce genetic variation in offspring?',
  ['Meiosis and random fertilisation', 'Mitosis and growth', 'Mitosis and repair', 'Respiration and photosynthesis'],
  'Meiosis makes different gametes; fertilisation combines them at random.');
MH('B3.31-04', 'Why are identical twins genetically identical, but non-identical twins not?',
  ['Identical twins come from one zygote that splits; non-identical twins come from two different eggs and sperm', 'Identical twins have the same mother and father; non-identical twins have the same mother but different fathers', 'Identical twins are made by meiosis; non-identical twins by mitosis', 'Non-identical twins have more chromosomes than identical twins'],
  'Any differences between identical twins are environmental.');
M('B3.32-01', 'What is the diploid number of chromosomes in human cells?',
  ['46', '23', '92', '44'],
  '23 pairs.');
M('B3.32-02', 'How many chromosomes are in a human sperm cell?',
  ['23', '46', '22', '92'],
  'Gametes are haploid.');
T('B3.32-03', 'A human skin cell contains 23 chromosomes.', false,
  'False. Body cells are diploid: 46 chromosomes.');
MH('B3.32-04', 'How many pairs of chromosomes are in a human body cell?',
  ['23', '46', '22', '11'],
  '22 pairs of non-sex chromosomes and one pair of sex chromosomes.');
M('B3.33-01', 'Which variation is caused only by the environment?',
  ['A scar from an accident', 'Natural eye colour at birth', 'Blood group', 'Natural hair colour'],
  'Genes had no effect on the scar.');
M('B3.33-02', 'Which characteristic is affected by both genes and the environment?',
  ['Body mass', 'Blood group', 'Eye colour', 'A scar'],
  'Diet and exercise affect it too.');
T('B3.33-03', 'All variation within a species is caused by genes alone.', false,
  'False. Variation can be genetic, environmental, or a combination of both.');
MH('B3.33-04', 'Identical twins raised apart have different body masses. What does this show?',
  ['The environment affects body mass', 'Body mass is only genetic', 'The twins have different genes', 'Body mass is not affected by diet'],
  'Their genes are identical, so differences must be environmental.');
M('B3.34-01', 'What is a mutation?',
  ['A rare, random change in genetic material', 'A planned change in the genes of an organism', 'A different form of a characteristic', 'A change caused by exercise'],
  'Mutations can be inherited if they occur in gametes.');
M('B3.34-02', 'What is the effect of most mutations?',
  ['Little or no effect on the phenotype', 'They always give a big survival advantage', 'They always cause disease', 'They always kill the cell'],
  'A few are harmful; very few are beneficial.');
T('B3.34-03', 'Mutations are frequent and planned changes in DNA.', false,
  'False. They are rare and random.');
MH('B3.34-04', 'Which mutation could be passed on to offspring?',
  ['One in a cell that divides to form gametes', 'One in a skin cell on the arm that divides', 'One in a muscle cell of the leg', 'One in a red blood cell'],
  'Only changes in gamete-forming cells are inherited.');
M('B3.38-01', 'In natural selection, which individuals are most likely to survive and reproduce?',
  ['Those best adapted to their environment', 'The largest individuals in every case', 'Those that were born first', 'Those with the most mutations'],
  'They pass their alleles on.');
M('B3.38-02', 'What starts the process of natural selection?',
  ['Variation within a population', 'All individuals being identical', 'Every individual surviving', 'A lack of competition'],
  'Some variants are better adapted.');
T('B3.38-03', 'Natural selection can lead to evolution over many generations.', true,
  'True. Advantageous alleles become more common.');
MH('B3.38-04', 'Which is the correct order for natural selection?',
  ['Variation → competition → best adapted survive → reproduce → alleles passed on', 'Competition → reproduce → variation → best adapted survive → alleles passed on', 'Survive → variation → reproduce → competition → alleles passed on', 'Alleles passed on → variation → competition → reproduce → survive'],
  'Over many generations the population changes.');
M('B3.39-01', 'How do antibiotic-resistant bacteria become more common?',
  ['Resistant bacteria survive the antibiotic and reproduce', 'Antibiotics cause bacteria to become resistant on purpose', 'Non-resistant bacteria reproduce faster', 'Resistant bacteria are made by vaccines'],
  'This is natural selection.');
M('B3.39-02', 'How does resistance first appear in a population of bacteria?',
  ['A random mutation', 'The bacteria learn to resist', 'The antibiotic changes the bacteria on purpose', 'The patient becomes resistant'],
  'The antibiotic then selects for it.');
T('B3.39-03', 'Finishing a course of antibiotics helps to reduce the spread of resistant bacteria.', true,
  'True. It kills more of the bacteria, so fewer partly resistant ones survive.');
MH('B3.39-04', 'Why are infections with antibiotic-resistant bacteria hard to control?',
  ['Antibiotics no longer kill them, so they spread from person to person', 'They are really viruses, so no antibiotic has ever worked on them', 'They cannot reproduce at all, so they stay inside the same person', 'They only infect plants, so doctors are unable to reach the bacteria'],
  'MRSA is an example.');

/* ===================== BIOLOGY 4 Ecology and the environment (added 7 Nov 2026) ===================== */
M('B4.1-01', 'What is a <b>population</b>?',
  ['All the organisms of one species in an area', 'All the organisms of every species in an area', 'The place where an organism lives', 'A community and its non-living surroundings'],
  'A community is all the populations together.');
M('B4.1-02', 'What is an <b>ecosystem</b>?',
  ['A community and its physical environment', 'All the organisms of one species in an area', 'Only the plants in an area', 'The place where one species lives'],
  'Living and non-living parts interact.');
M('B4.1-03', 'What is a <b>habitat</b>?',
  ['The place where an organism lives', 'All the organisms of one species', 'All the living things in an area', 'The food that an organism eats'],
  'For example, a rock pool.');
T('B4.1-04', 'A community is made up of one population of a single species.', false,
  'False. A community is all the populations of different species in an area.');
MH('B4.1-05', 'A pond contains frogs, fish, pondweed, water and mud. Which describes all of these together?',
  ['An ecosystem', 'A community', 'A population', 'A habitat'],
  'It includes non-living parts (water, mud).');
M('B4.2-01', 'What is a quadrat used for?',
  ['Sampling the number of organisms in an area', 'Measuring the temperature of the soil at each site', 'Catching flying insects', 'Measuring the pH of water'],
  'A square frame, often 1 m × 1 m.');
M('B4.2-02', 'Why should quadrats be placed randomly?',
  ['To avoid bias in the results', 'To find the most organisms', 'To save time on the field trip', 'So all quadrats land in the same spot'],
  'Random coordinates are often used.');
MH('B4.2-03', 'A field is 100 m². Five 1 m² quadrats contain 4, 6, 2, 5 and 3 daisies. What is the estimated daisy population?',
  ['400', '20', '4', '2000'],
  'Mean = 20 ÷ 5 = 4 per m². 4 × 100 = <b>400</b>.');
T('B4.2-04', 'Using more quadrats gives a more reliable estimate of population size.', true,
  'True. It reduces the effect of unusual samples.');
M('B4.5-01', 'Which is an <b>abiotic</b> factor?',
  ['Temperature', 'Predators', 'Disease', 'Competition'],
  'Abiotic = non-living.');
M('B4.5-02', 'Which is a <b>biotic</b> factor?',
  ['The number of predators', 'The amount of light', 'The pH of the soil', 'The water temperature'],
  'Biotic = living.');
T('B4.5-03', 'Competition for food is an abiotic factor.', false,
  'False. Competition involves living organisms, so it is biotic.');
MH('B4.5-04', 'Few plants grow under a dense tree. Which factor most likely explains this?',
  ['Low light intensity under the tree', 'Too much carbon dioxide from the tree', 'A high soil temperature', 'A lack of any predators'],
  'Light is an abiotic factor limiting photosynthesis.');
M('B4.6-01', 'What is a <b>producer</b>?',
  ['An organism that makes its own food by photosynthesis', 'An animal that eats plants and makes them into its food', 'An animal that eats other animals', 'An organism that breaks down dead material'],
  'Producers start every food chain.');
M('B4.6-02', 'In the food chain grass → rabbit → fox, what is the fox?',
  ['Secondary consumer', 'Primary consumer', 'Producer', 'Tertiary consumer'],
  'The rabbit is the primary consumer.');
M('B4.6-03', 'What is the role of <b>decomposers</b>?',
  ['To break down dead organisms and waste', 'To make food from carbon dioxide by photosynthesis', 'To eat living plants', 'To hunt other animals'],
  'Bacteria and fungi; they recycle nutrients.');
T('B4.6-04', 'A tertiary consumer eats secondary consumers.', true,
  'True.');
MH('B4.6-05', 'In seaweed → periwinkle → crab → seagull, which organism is the tertiary consumer?',
  ['Seagull', 'Crab', 'Periwinkle', 'Seaweed'],
  'Seaweed producer, periwinkle primary, crab secondary.');
M('B4.7-01', 'What do the arrows in a food chain show?',
  ['The direction of energy transfer', 'Which animal eats which plant', 'The direction animals move', 'The size of each population'],
  'The arrow points to the organism that eats.');
M('B4.7-02', 'What is a <b>food web</b>?',
  ['Many interlinked food chains in an ecosystem', 'A single long food chain with many trophic levels', 'A diagram showing numbers of organisms', 'The place where decomposers live'],
  'Most animals eat more than one thing.');
M('B4.7-03', 'Why is a pyramid of biomass always a pyramid shape?',
  ['Biomass is lost at each trophic level', 'There are always more animals than plants', 'Producers are smaller than consumers', 'Each level gains biomass from the next'],
  'A pyramid of numbers can be inverted, e.g. one tree with many insects.');
T('B4.7-04', 'A pyramid of numbers is always a true pyramid shape.', false,
  'False. One large tree can feed many caterpillars, giving an inverted shape.');
MH('B4.7-05', 'A pyramid of numbers for oak tree → caterpillars → birds is not a pyramid shape. Why?',
  ['One large oak tree supports thousands of caterpillars', 'Birds are much more numerous than the caterpillars they eat', 'Oak trees are consumers', 'Caterpillars are producers'],
  'A pyramid of biomass would still be a pyramid.');
M('B4.8-01', 'Which substance is passed along a food chain when an animal eats a plant?',
  ['Biomass, containing energy', 'Light energy from the Sun', 'Oxygen from the plant', 'Water only'],
  'Carbon compounds and energy move up the chain.');
T('B4.8-02', 'Energy is transferred from one trophic level to the next when organisms are eaten.', true,
  'True.');
M('B4.8-03', 'Where does the energy in almost all food chains originally come from?',
  ['The Sun', 'The soil', 'Decomposers', 'Water'],
  'Producers capture light energy in photosynthesis.');
MH('B4.8-04', 'Why do food chains rarely have more than five trophic levels?',
  ['So much energy is lost at each level that too little is left', 'Animals at the top of the chain are much too large to feed', 'Decomposers eat all the top consumers before they can breed', 'Producers cannot make enough oxygen for long food chains'],
  'Roughly 90% is lost at each step.');
M('B4.9-01', 'About what percentage of energy is passed from one trophic level to the next?',
  ['10%', '50%', '90%', '1%'],
  'About 90% is lost.');
M('B4.9-02', 'Which is a way energy is lost between trophic levels?',
  ['Heat from respiration', 'Energy used in photosynthesis', 'Absorbing sunlight', 'Taking in oxygen'],
  'Also undigested food (faeces) and parts not eaten.');
T('B4.9-03', 'Most of the energy in an organism is passed on to the next trophic level.', false,
  'False. Only about 10% is passed on.');
MH('B4.9-04', 'Grass contains 10 000 kJ. Roughly how much reaches the secondary consumer in grass → rabbit → fox?',
  ['100 kJ', '1000 kJ', '10 kJ', '9000 kJ'],
  '10% of 10 000 = 1000 kJ for the rabbit; 10% of that = <b>100 kJ</b>.');
M('B4.10-01', 'Which process removes carbon dioxide from the atmosphere?',
  ['Photosynthesis', 'Respiration', 'Combustion', 'Decomposition'],
  'Plants turn CO₂ into glucose.');
M('B4.10-02', 'How do decomposers return carbon to the atmosphere?',
  ['By respiring as they break down dead material', 'By photosynthesising under the soil surface', 'By burning dead organisms in the ground', 'By storing all the carbon as fossil fuels'],
  'Carbon dioxide is released.');
M('B4.10-03', 'Which process releases carbon stored in fossil fuels?',
  ['Combustion', 'Photosynthesis', 'Feeding', 'Fossilisation'],
  'Burning fuels releases CO₂.');
T('B4.10-04', 'Animals return carbon dioxide to the atmosphere by respiration.', true,
  'True.');
MH('B4.10-05', 'How does carbon in a plant become part of an animal?',
  ['The animal eats the plant and digests its carbon compounds', 'The animal breathes in carbon from the plant', 'The plant releases carbon into the soil for the animal', 'The animal photosynthesises using the plant\'s leaves'],
  'Feeding passes carbon compounds along the food chain.');
M('B4.12-01', 'Why is carbon monoxide harmful?',
  ['It combines with haemoglobin and reduces oxygen transport', 'It dissolves in rain and forms acid rain that harms lungs', 'It is a greenhouse gas that destroys the ozone layer above', 'It makes water in lakes and rivers very strongly alkaline'],
  'It is produced by incomplete combustion.');
M('B4.12-02', 'What is a biological effect of acid rain caused by sulfur dioxide?',
  ['Trees are damaged and fish in lakes die', 'More fish survive in the more acidic lakes', 'Plants grow faster', 'Oxygen levels in the blood fall'],
  'Acid rain lowers the pH of lakes and soil.');
T('B4.12-03', 'Sulfur dioxide dissolves in rain to form acid rain.', true,
  'True.');
MH('B4.12-04', 'Why might lichens be absent from a city centre?',
  ['Lichens are sensitive to sulfur dioxide pollution', 'There is far too much light in city centres', 'Cities have too few predators to feed lichens', 'Lichens need high levels of carbon monoxide'],
  'Lichens can be used as indicators of air pollution.');
M('B4.13-01', 'Which of these is a greenhouse gas?',
  ['Methane', 'Oxygen', 'Nitrogen', 'Argon'],
  'Others: water vapour, CO₂, nitrous oxide, CFCs.');
T('B4.13-02', 'Oxygen is a greenhouse gas.', false,
  'False. Water vapour, CO₂, methane, nitrous oxide and CFCs are greenhouse gases; oxygen is not.');
M('B4.13-03', 'Which group contains only greenhouse gases?',
  ['Carbon dioxide, methane, CFCs', 'Oxygen, nitrogen, methane', 'Carbon dioxide, oxygen, argon', 'Nitrogen, CFCs, helium'],
  'Nitrous oxide and water vapour are too.');
MH('B4.13-04', 'Which greenhouse gas is mainly made by human activity and also damages the ozone layer?',
  ['CFCs', 'Water vapour', 'Methane', 'Carbon dioxide'],
  'CFCs were used in fridges and aerosols.');
M('B4.14-01', 'Which human activity releases large amounts of methane?',
  ['Rearing cattle and growing rice', 'Planting new forests on farmland', 'Using solar panels', 'Recycling waste paper'],
  'Landfill sites also release methane.');
M('B4.14-02', 'How does deforestation increase carbon dioxide levels?',
  ['Fewer trees remove CO₂, and burning trees releases more', 'Trees produce carbon dioxide, so removing them helps', 'It adds more oxygen to the air', 'It stops respiration in animals'],
  'Trees store carbon.');
T('B4.14-03', 'Burning fossil fuels increases the level of carbon dioxide in the air.', true,
  'True.');
MH('B4.14-04', 'Which human activity releases nitrous oxide?',
  ['Using nitrogen fertilisers on fields', 'Cutting down large areas of forest', 'Fitting solar panels on roofs', 'Recycling plastic bottles'],
  'Bacteria in soil convert some fertiliser into N₂O.');
M('B4.15-01', 'How do greenhouse gases warm the Earth?',
  ['They absorb heat radiated from the Earth and re-emit it', 'They let all the heat from the Earth escape into space', 'They reflect sunlight away from the Earth', 'They make the ozone layer thicker'],
  'More gas means an enhanced greenhouse effect.');
M('B4.15-02', 'Which is a possible consequence of global warming?',
  ['Rising sea levels as ice melts', 'More ice at the poles', 'Lower sea levels everywhere', 'A cooler climate worldwide'],
  'Also more extreme weather and changes in species distribution.');
T('B4.15-03', 'Without any greenhouse effect, the Earth would be much colder.', true,
  'True. The natural greenhouse effect keeps the Earth warm enough for life.');
MH('B4.15-04', 'Why might global warming reduce biodiversity?',
  ['Some species cannot adapt or move as their habitats change', 'Warmer weather always increases the number of species', 'It removes all predators from ecosystems', 'It stops plants from photosynthesising'],
  'Coral bleaching is one example.');
M('B4.16-01', 'Why does untreated sewage in a river cause fish to die?',
  ['Bacteria decomposing the sewage use up the oxygen', 'The sewage is a poison that dissolves the fish\'s gills', 'The sewage adds too much oxygen', 'The sewage makes the water too cold'],
  'Aerobic bacteria respire and lower the oxygen level.');
T('B4.16-02', 'Sewage in rivers increases the number of bacteria.', true,
  'True. They feed on the organic matter.');
M('B4.16-03', 'Which organisms might increase in a river polluted by sewage?',
  ['Bacteria and organisms that tolerate low oxygen', 'Fish that need lots of dissolved oxygen to survive', 'Mayfly larvae and stonefly larvae', 'Freshwater shrimps and water plants'],
  'Sludgeworms and rat-tailed maggots are indicator species.');
MH('B4.16-04', 'Why can sewage pollution spread disease?',
  ['It can contain pathogens, such as cholera bacteria', 'It adds oxygen to the water, which helps viruses grow', 'It kills all bacteria in the water', 'It makes the water too clean'],
  'Sewage must be treated before release.');
M('B4.17-01', 'What starts eutrophication?',
  ['Fertiliser minerals leaching into water', 'Too much dissolved oxygen in the water', 'A lack of nitrates in the water', 'Fish eating the algae'],
  'Nitrates and phosphates cause algae to grow.');
M('B4.17-02', 'In eutrophication, why do plants below the surface die?',
  ['Algae on the surface block the light', 'They receive too much light from the Sun', 'They absorb too much oxygen', 'Fish eat all of them'],
  'Without light, they cannot photosynthesise.');
T('B4.17-03', 'In eutrophication, fish die because the water contains too much oxygen.', false,
  'False. Bacteria decomposing dead plants use up the oxygen.');
MH('B4.17-04', 'Which is the correct sequence of eutrophication?',
  ['Minerals → algae grow → light blocked → plants die → bacteria use oxygen → fish die', 'Algae grow → minerals → fish die → light blocked → plants die → bacteria grow', 'Fish die → minerals → algae grow → bacteria use oxygen → plants die', 'Minerals → fish die → algae grow → plants die → light blocked'],
  'Decomposition by aerobic bacteria removes the oxygen.');

/* ===================== BIOLOGY 5 Use of biological resources (added 7 Nov 2026) ===================== */
M('B5.1-01', 'How do glasshouses increase crop yield?',
  ['They keep crops warm and protected, increasing photosynthesis', 'They block all of the light, so the crops grow more slowly', 'They keep the crops very cold, so they need less water', 'They remove carbon dioxide, so the crops need less food'],
  'Conditions can be controlled.');
M('B5.1-02', 'What is an advantage of a polythene tunnel?',
  ['It is cheaper than a glasshouse but still warms the crops', 'It blocks out the sunlight completely from the crops', 'It lets in many more pests than an open field does', 'It lowers the temperature so the crops grow slower'],
  'Crops can be grown out of season.');
T('B5.1-03', 'Glasshouses let farmers grow some crops all year round.', true,
  'True.');
MH('B5.1-04', 'Why might a farmer use paraffin heaters in a glasshouse in winter?',
  ['They raise the temperature and release CO₂, both increasing photosynthesis', 'They lower the carbon dioxide level so that insect pests are killed', 'They block out light so that the crops do not wilt in the winter', 'They release oxygen to help the crops respire faster in the cold'],
  'Burning releases heat and carbon dioxide.');
M('B5.2-01', 'Why does adding carbon dioxide in a glasshouse increase yield?',
  ['CO₂ is a raw material for photosynthesis', 'CO₂ kills the insect pests that eat the crops', 'CO₂ provides minerals for the crops', 'CO₂ cools the glasshouse down'],
  'If CO₂ is the limiting factor.');
M('B5.2-02', 'Why does increasing temperature only increase yield up to a point?',
  ['Above the optimum, enzymes are denatured', 'Plants stop needing any light when they are warm', 'Carbon dioxide runs out when warm', 'Water stops evaporating when warm'],
  'Heating also costs money.');
T('B5.2-03', 'Increasing carbon dioxide always increases the rate of photosynthesis, however much is added.', false,
  'False. Once another factor (light or temperature) becomes limiting, more CO₂ has no effect.');
MH('B5.2-04', 'A grower doubles the CO₂ in a glasshouse but the yield does not rise. Why?',
  ['Another factor, such as light or temperature, is now limiting', 'Plants cannot use carbon dioxide for photosynthesis in a glasshouse', 'Too much oxygen is being produced', 'The crops have stopped respiring'],
  'The limiting factor controls the rate.');
M('B5.3-01', 'Why do farmers add fertiliser?',
  ['To supply minerals such as nitrates for plant growth', 'To supply glucose for the crops to photosynthesise', 'To kill the insect pests that eat the crop leaves', 'To supply carbon dioxide directly to the crop roots'],
  'Nitrates are needed to make proteins.');
M('B5.3-02', 'Why do plants need nitrates?',
  ['To make amino acids and proteins', 'To make glucose in photosynthesis', 'To make chlorophyll only', 'To absorb water'],
  'Magnesium is needed for chlorophyll.');
T('B5.3-03', 'Fertiliser increases crop yield by supplying minerals.', true,
  'True. NPK fertilisers supply nitrogen, phosphorus and potassium.');
MH('B5.3-04', 'Why do farmers need to add fertiliser to fields year after year?',
  ['Harvesting removes the minerals taken up by the crops', 'Rain adds too many minerals to the soil each year', 'Plants make minerals and store them in the soil', 'Fertiliser kills the crops if not replaced'],
  'The crops are taken away instead of decaying back into the soil.');
M('B5.4-01', 'What is <b>biological control</b>?',
  ['Using a natural predator to control a pest', 'Spraying a chemical made from plants to kill pests', 'Using fertiliser to grow bigger crops', 'Using a glasshouse to keep pests out'],
  'For example, ladybirds eating aphids.');
M('B5.4-02', 'What is a disadvantage of pesticides?',
  ['They can kill helpful insects and build up in food chains', 'They take a very long time to act, so crops are eaten first', 'They never kill the pests', 'They are always more expensive than predators'],
  'Pests can also become resistant.');
T('B5.4-03', 'A disadvantage of biological control is that the predator may eat other useful species.', true,
  'True. It can also be slower than pesticides.');
MH('B5.4-04', 'Why might a farmer choose pesticides rather than biological control?',
  ['Pesticides act quickly and kill most of the pests at once', 'Pesticides never harm any other species', 'Biological control always wipes out the pest completely', 'Pesticides help the pest population grow'],
  'Biological control rarely removes the pest entirely.');
M('B5.5-01', 'Why does bread dough rise when yeast is added?',
  ['Yeast respires and produces carbon dioxide', 'Yeast produces oxygen by photosynthesis', 'Yeast absorbs water and swells', 'Yeast produces alcohol which expands'],
  'The CO₂ bubbles are trapped in the dough.');
M('B5.5-02', 'What happens to the ethanol made by yeast in bread?',
  ['It evaporates during baking', 'It makes the bread rise', 'It stays in the bread', 'It turns into carbon dioxide'],
  'Baking also kills the yeast.');
T('B5.5-03', 'Yeast is a bacterium used in making bread.', false,
  'False. Yeast is a single-celled fungus.');
MH('B5.5-04', 'Why is dough left in a warm place before baking?',
  ['Yeast enzymes work faster, so more CO₂ is produced', 'The heat kills the yeast before baking, so it rises', 'Warmth stops the yeast from respiring', 'Warmth produces more oxygen in the dough'],
  'Too hot would denature the enzymes.');
M('B5.6-01', 'How can you measure the rate of anaerobic respiration in yeast?',
  ['Count the bubbles of CO₂ given off per minute', 'Measure the volume of oxygen given off per minute', 'Measure the mass of yeast at the end', 'Count the number of yeast cells added'],
  'Or measure the volume of gas in a syringe.');
M('B5.6-02', 'Why is a layer of oil put on top of the yeast and sugar solution?',
  ['To stop oxygen getting in, so respiration is anaerobic', 'To feed the yeast with oil as an extra food source', 'To keep the solution warm so the yeast works faster', 'To let the carbon dioxide escape from the solution faster'],
  'The water is often boiled first to remove dissolved oxygen.');
T('B5.6-03', 'Yeast produces carbon dioxide during anaerobic respiration.', true,
  'True. Glucose → ethanol + carbon dioxide.');
MH('B5.6-04', 'Yeast is tested at 20, 30, 40 and 60 °C. Bubbling is fastest at 40 °C and stops at 60 °C. Why?',
  ['Enzymes work best near 40 °C and are denatured at 60 °C', 'Yeast only respires at temperatures above 50 °C', 'The sugar is all used up at 40 °C, then it stops', 'The oil layer stops working at higher temperatures'],
  'Enzymes control respiration.');
M('B5.7-01', 'Which bacterium is used to make yoghurt?',
  ['Lactobacillus', 'Salmonella bacteria', 'Yeast', 'E. coli'],
  'It ferments lactose to lactic acid.');
M('B5.7-02', 'Why does milk thicken when it is made into yoghurt?',
  ['Lactic acid lowers the pH, which makes the milk proteins clot', 'The bacteria add extra water, which makes the milk go thicker', 'The milk is boiled for hours until most of the water has gone', 'Yeast produces bubbles of carbon dioxide that fill the milk'],
  'The acid also gives the sour taste.');
T('B5.7-03', 'The milk is pasteurised before Lactobacillus is added to make yoghurt.', true,
  'True. This kills unwanted bacteria.');
MH('B5.7-04', 'Why is the milk kept at about 40 °C while yoghurt is made?',
  ['It is the optimum temperature for the Lactobacillus enzymes', 'It kills the Lactobacillus bacteria before they spread', 'It stops the milk from becoming acidic as it is stored', 'It removes all the lactose sugar from the milk quickly'],
  'Then it is cooled to stop the reaction.');
M('B5.8-01', 'Why is a fermenter fitted with a water jacket?',
  ['To keep the temperature at the optimum', 'To add nutrients to the microorganisms', 'To stir the mixture', 'To remove the product'],
  'Respiration produces heat, which must be removed.');
M('B5.8-02', 'Why must a fermenter be sterilised before use (aseptic precautions)?',
  ['To stop other microorganisms contaminating it', 'To make the product more acidic', 'To help the microorganisms photosynthesise', 'To increase the temperature quickly'],
  'Contaminants would compete or make harmful products.');
M('B5.8-03', 'Why is the mixture in a fermenter stirred?',
  ['To keep the microorganisms, nutrients and temperature evenly mixed', 'To kill any unwanted microorganisms that get into the fermenter', 'To cool the mixture down rapidly once the product has been made', 'To stop any oxygen at all from getting into the fermenter mixture'],
  'Paddles mix the contents.');
T('B5.8-04', 'The pH inside a fermenter is monitored and kept at the optimum.', true,
  'True. This keeps enzymes working well.');
MH('B5.8-05', 'Why is sterile air bubbled into some fermenters?',
  ['To supply oxygen for aerobic respiration without adding contaminants', 'To remove all of the nutrients from the mixture after the reaction', 'To lower the temperature of the mixture inside the fermenter to 0 °C', 'To make the microorganisms respire anaerobically and make ethanol'],
  'The air is filtered first.');
M('B5.10-01', 'What is <b>selective breeding</b>?',
  ['Humans choosing parents with useful characteristics to breed', 'Inserting a gene from another species into the parents\' DNA', 'Organisms choosing their own mates in the wild', 'Making identical copies by cuttings'],
  'Repeated over many generations.');
M('B5.10-02', 'Which is an example of selective breeding in plants?',
  ['Breeding wheat with a high yield', 'Putting a jellyfish gene into a plant', 'Taking a cutting of a geranium', 'Growing tomatoes in a glasshouse'],
  'Also disease resistance, taste and size.');
T('B5.10-03', 'Selective breeding can develop crops resistant to disease.', true,
  'True.');
MH('B5.10-04', 'What is a disadvantage of selective breeding?',
  ['It reduces genetic variation, so a new disease could affect all of them', 'It always produces far more variation than breeding in the wild does', 'It is very fast, so the results appear after only one generation', 'It inserts genes from other species, which may spread to wild plants'],
  'Inbreeding can also cause health problems.');
M('B5.11-01', 'A farmer wants cows that produce more milk. What should the farmer do?',
  ['Breed the cows that produce the most milk, over many generations', 'Feed all of the cows extra food for a year, then breed them', 'Insert a milk gene taken from a goat into every one of the cows', 'Breed the cows that produce the least milk, to balance the herd'],
  'Bulls from high-yield mothers are used too.');
T('B5.11-02', 'Selective breeding of animals produces results in a single generation.', false,
  'False. It takes many generations.');
M('B5.11-03', 'Which characteristic might be selected for in sheep?',
  ['Thick, high-quality wool', 'Short life span', 'Low resistance to disease', 'Small amount of meat'],
  'Farmers choose features that are useful to them.');
MH('B5.11-04', 'Why do some selectively bred dog breeds have health problems?',
  ['Inbreeding increases the chance of inheriting two harmful recessive alleles', 'Selective breeding removes all recessive alleles from the breed completely', 'Dogs are bred to have extra chromosomes, which causes health problems', 'The dogs carry genes from other species, which their bodies reject'],
  'Breeding from close relatives reduces variation.');
M('B5.12-01', 'What do <b>restriction enzymes</b> do?',
  ['Cut DNA at specific sites', 'Join pieces of DNA together', 'Copy DNA in a fermenter', 'Digest proteins in the gut'],
  'They leave sticky ends.');
M('B5.12-02', 'What does <b>ligase</b> do?',
  ['Joins pieces of DNA together', 'Cuts DNA at specific sites', 'Breaks down starch', 'Makes copies of plasmids'],
  'It joins the gene into a plasmid.');
T('B5.12-03', 'The same restriction enzyme is used to cut both the gene and the plasmid.', true,
  'True. This gives matching sticky ends.');
MH('B5.12-04', 'Why are "sticky ends" useful in genetic modification?',
  ['Matching unpaired bases let the gene and plasmid join easily', 'They stop the two pieces of DNA from ever joining together', 'They make the DNA cut itself into many smaller pieces', 'They allow the gene to make a brand new type of protein'],
  'Ligase then seals the join.');
M('B5.13-01', 'What is a <b>vector</b> in genetic modification?',
  ['Something that carries DNA into another cell', 'An enzyme that cuts DNA at set sites in a cell', 'A protein that is made from the gene', 'A bacterium that causes a disease'],
  'Plasmids and viruses can act as vectors.');
M('B5.13-02', 'What is a plasmid?',
  ['A small ring of DNA found in bacteria', 'A protein that cuts DNA into pieces', 'A virus that only infects plant cells', 'The nucleus found inside a bacterium'],
  'Bacteria do not have a nucleus.');
T('B5.13-03', 'Viruses can be used as vectors to insert DNA into cells.', true,
  'True. They naturally inject their DNA into cells.');
MH('B5.13-04', 'What is <b>recombinant DNA</b>?',
  ['DNA made by joining DNA from two different sources', 'DNA that has been copied many times in a fermenter', 'DNA that has been cut into pieces by an enzyme', 'DNA that is found only in viruses, not in bacteria'],
  'For example, a plasmid containing the human insulin gene.');
M('B5.14-01', 'How are bacteria used to make human insulin?',
  ['The human insulin gene is inserted into bacteria, which make insulin', 'Bacteria take in insulin from human blood and then store it for later', 'Living bacteria are injected into people with diabetes to make insulin', 'The bacteria are bred selectively over many generations to make insulin'],
  'They are then grown in a fermenter.');
M('B5.14-02', 'Why are bacteria grown in a fermenter to make insulin?',
  ['So they reproduce quickly and make large amounts', 'To kill them all before the insulin is made', 'To stop them making insulin', 'To mix them with human cells'],
  'Conditions are kept at the optimum.');
T('B5.14-03', 'Genetically modified bacteria make insulin that is identical to human insulin.', true,
  'True. They have the human gene.');
MH('B5.14-04', 'Which is the correct order for making insulin with bacteria?',
  ['Cut out gene → insert into plasmid → put plasmid in bacteria → grow in fermenter', 'Grow in fermenter → cut out gene → insert into plasmid → put plasmid in bacteria', 'Insert into plasmid → cut out gene → grow in fermenter → put plasmid in bacteria', 'Put plasmid in bacteria → cut out gene → grow in fermenter → insert into plasmid'],
  'Then extract and purify the insulin.');
M('B5.15-01', 'How can genetically modified crops improve food production?',
  ['They can be made resistant to pests or herbicides', 'They always grow well without any water at all', 'They need no light at all to grow quickly', 'They produce all of their own fertiliser'],
  'Higher yields; Golden Rice has added vitamin A.');
M('B5.15-02', 'What is an advantage of insect-resistant GM crops?',
  ['Less pesticide needs to be sprayed', 'They need more pesticide than normal', 'They cannot be eaten by humans', 'They always grow more slowly'],
  'The plant makes a toxin harmful to the insect.');
T('B5.15-03', 'Some people worry that genes from GM crops could spread to wild plants.', true,
  'True. This is one concern about GM crops.');
MH('B5.15-04', 'Why might a farmer grow herbicide-resistant GM crops?',
  ['The field can be sprayed to kill weeds without killing the crop', 'The crop makes its own herbicide, which kills the insects that eat it', 'Weeds are made resistant to the herbicide', 'The crop no longer needs any water'],
  'Less competition from weeds increases yield.');
M('B5.16-01', 'What does <b>transgenic</b> mean?',
  ['Containing genetic material transferred from a different species', 'Produced by selective breeding of the same species over many generations', 'A clone of the parent organism made from a cutting', 'Having many more chromosomes than normal for its species'],
  'For example, bacteria with a human gene.');
T('B5.16-02', 'A transgenic organism has been produced by selective breeding.', false,
  'False. A transgenic organism contains a gene from another species.');
M('B5.16-03', 'Which is an example of a transgenic organism?',
  ['A bacterium containing the human insulin gene', 'A cow selectively bred over many years for milk', 'A strawberry plant grown from a runner', 'A wheat plant grown in a glasshouse'],
  'The gene came from a different species.');
MH('B5.16-04', 'A plant has a gene from a bacterium that makes it resistant to insects. Why is it described as transgenic?',
  ['Its genetic material includes DNA from a different species', 'It was produced by selective breeding of wheat plants', 'It is an exact clone of its parent, grown from a runner', 'It was grown in a polythene tunnel to protect it from pests'],
  'Trans- = across (species).');
