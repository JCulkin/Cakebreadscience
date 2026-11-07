/* Question bank for the Spec Quiz. Every question has a PERMANENT id: spec point + number, e.g. 'P3.5-03' = Physics 3.5, question 3.
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
