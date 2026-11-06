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
  ['The distance from a point on one wave to the same point on the next wave', 'The distance from a peak to the next trough', 'The height of a peak above the rest position', 'The distance the wave travels in one second'],
  'Wavelength (λ) is one complete wave, e.g. peak to the next peak.');
M('P3.3-03', 'What is the <b>frequency</b> of a wave?',
  ['The number of waves passing a point each second', 'The time taken for one complete wave', 'The distance travelled by the wave each second', 'The number of peaks on a diagram'],
  'Frequency is measured in hertz (Hz). 1 Hz = one wave per second.');
M('P3.3-04', 'What is the <b>period</b> of a wave?',
  ['The time taken for one complete wave to pass a point', 'The number of waves passing a point each second', 'The length of one complete wave', 'The time for the wave to reach its maximum amplitude'],
  'The period (T) is measured in seconds.');
M('P3.3-05', 'What is a <b>wavefront</b>?',
  ['A line joining points on a wave that are in step, such as all the peaks', 'The first wave produced by a source', 'The highest point on a wave', 'The direction the wave travels in'],
  'On a wavefront diagram each line is a wavefront; the gap between neighbouring wavefronts is one wavelength.');
T('P3.3-06', 'The distance from a peak to the next trough is one wavelength.', false,
  'False. Peak to trough is only <b>half</b> a wavelength. Peak to the next peak is one wavelength.');
T('P3.4-01', 'Waves transfer matter from one place to another.', false,
  'False. Waves transfer <b>energy and information</b> without transferring matter.');
M('P3.4-02', 'A cork floating on a pond bobs up and down as ripples pass, but does not move along with them. What does this show?',
  ['Waves transfer energy without transferring matter', 'Water waves are longitudinal', 'The waves have no energy', 'The cork is too heavy to move'],
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
  ['A change in direction when a wave changes speed as it passes into a different medium', 'A wave bouncing off a surface', 'A wave losing energy as it travels', 'A wave spreading out after passing through a gap'],
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
  ['internal heating of body tissue', 'skin cancer', 'blindness', 'mutations in DNA'],
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
  ['2 protons and 2 neutrons (a helium nucleus)', 'A high-speed electron', 'An electromagnetic wave', 'A single neutron'],
  'α = ⁴₂He: 2 protons + 2 neutrons.');
M('P7.5-02', 'What is a <b>beta (β⁻) particle</b>?',
  ['A high-speed electron emitted from the nucleus', 'A helium nucleus', 'An electromagnetic wave', 'A proton'],
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
  ['Using gamma rays to kill cancer cells (radiotherapy)', 'Using alpha particles to see broken bones', 'Using beta particles to cook food', 'Using radon gas to sterilise equipment'],
  'Others include tracers to see inside the body and gamma sterilisation of medical equipment.');
M('P7.15-01', 'What is meant by <b>contamination</b>?',
  ['Radioactive material gets onto or into an object or person', 'An object is exposed to radiation from a source outside it', 'An object becomes radioactive after being irradiated', 'Radiation is blocked by a shield'],
  'Contamination: the radioactive atoms are on or inside you, so you keep being exposed. Irradiation: exposure to radiation from outside.');
T('P7.15-02', 'An object that has been irradiated becomes radioactive.', false,
  'False. Irradiation does not make an object radioactive. That is why gamma-sterilised food is safe to eat.');
M('P7.16-01', 'Why is ionising radiation dangerous to living organisms?',
  ['It can damage cells and tissue and cause mutations', 'It makes the body radioactive forever', 'It only damages metals', 'It makes cells grow faster and stronger'],
  'Ionising radiation can damage or kill cells and cause mutations in DNA, which may lead to cancer.');
M('P7.16-02', 'Why is the disposal of radioactive waste a problem?',
  ['Some of it stays radioactive for thousands of years', 'It is too heavy to move', 'It quickly turns into gamma rays', 'It is not dangerous once buried'],
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
  ['On the left and in the centre', 'Only in Group 0', 'On the top right', 'Only in Period 1'],
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
  ['They have a full outer shell of electrons', 'They have no electrons', 'They are gases', 'They have no neutrons'],
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
  ['Lots of energy is needed to overcome the strong electrostatic attractions between ions', 'The covalent bonds inside its molecules are strong', 'It has weak forces between molecules', 'Its electrons are free to move'],
  'A giant ionic lattice has many strong attractions between oppositely charged ions in all directions.');
M('C1.42-02', 'Magnesium oxide (Mg²⁺ O²⁻) has a much higher melting point than sodium chloride (Na⁺ Cl⁻). Why?',
  ['Its ions have higher charges, so the attractions are stronger', 'It contains covalent bonds', 'It has weaker attractions between ions', 'Its ions are free to move'],
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
  ['The electrostatic attraction between the shared pair of electrons and both nuclei', 'The attraction between two positive ions', 'The repulsion between the two nuclei', 'Magnetic forces between the electrons'],
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
  ['The intermolecular forces are weak and need little energy to overcome', 'The covalent bonds are weak', 'The ions are held loosely', 'The molecules are very large'],
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
  ['Each carbon atom is covalently bonded to four others in a rigid giant structure', 'It has layers that slide over each other', 'It is made of small C₆₀ molecules', 'It has delocalised electrons'],
  'Four strong covalent bonds per atom in a 3D network make diamond extremely hard.');
M('C1.50-02', 'Why does <b>graphite</b> conduct electricity?',
  ['Each carbon atom is bonded to only three others, leaving delocalised electrons that can move', 'It contains ions that can move', 'Its layers slide over each other', 'It has weak intermolecular forces'],
  'The delocalised electrons move between and along the layers.');
M('C1.50-03', 'Why is graphite soft and slippery?',
  ['Its layers are held together by weak forces, so they slide over each other', 'Its covalent bonds are weak', 'It is made of small molecules', 'It contains ions'],
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
  ['Gamma rays can pass through the packaging and kill bacteria inside', 'Ultraviolet would cook the food', 'Gamma rays make the food radioactive so bacteria die', 'Ultraviolet cannot kill bacteria'],
  'Gamma is very penetrating. UV is absorbed at the surface. (Irradiated food does not become radioactive.)');
MH('P3.13-06', 'Why do radiographers stand behind a lead screen when taking X-ray images?',
  ['They are exposed many times a day, so they must reduce their total dose', 'X-rays only harm adults', 'The lead makes the X-ray image clearer', 'X-rays cannot pass through air'],
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
  ['To monitor how much ionising radiation they have been exposed to', 'To stop radiation reaching them', 'To make radiation harmless', 'To detect sound'],
  'The film darkens more the more radiation it receives. It detects; it does not protect.');
M('P7.10-03', 'In many places, which natural source gives the largest share of background radiation?',
  ['Radon gas from rocks and the ground', 'Cosmic rays', 'Nuclear power stations', 'Mobile phones'],
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
  ['Gamma escapes the body to be detected, and the short half-life means the patient is not exposed for long', 'Gamma is the most ionising, so it shows up best', 'A short half-life means it never decays inside the body', 'Gamma makes the organ glow'],
  'It must be detectable outside the body (penetrating) and not stay active in the body for long.');
M('P7.15-03', 'Why is contamination usually more dangerous than irradiation?',
  ['The radioactive material stays on or in you, so the exposure continues', 'Contamination only happens with gamma', 'Irradiation makes you radioactive', 'Contamination is always from space'],
  'Once you are contaminated, you keep being exposed until the material is removed or decays.');
M('P7.16-03', 'Which is a sensible way to reduce the risk when using a radioactive source in the lab?',
  ['Hold it with long tongs, point it away from people and keep exposure time short', 'Hold it in your hand so you do not drop it', 'Keep it in your pocket between experiments', 'Taste a small amount to check it'],
  'Distance, short time and shielding all reduce the dose.');
MH('P7.5-07', 'Why are alpha particles the most ionising radiation?',
  ['They have a large charge and mass, so they collide strongly with atoms and lose energy quickly', 'They travel faster than light', 'They have no charge', 'They are electromagnetic waves'],
  'Strong ionisation means they use up their energy fast, which is also why they are the least penetrating.');
MH('P7.7-05', 'A nucleus emits one alpha particle and then two beta particles. What is the overall change?',
  ['Atomic number unchanged, mass number falls by 4', 'Atomic number falls by 2, mass number falls by 4', 'Atomic number rises by 2, mass number unchanged', 'Both unchanged'],
  'Alpha: Z − 2, A − 4. Two betas: Z + 2. Overall Z is unchanged and A falls by 4.');
MH('P7.8-03', 'Radium-226 (<span class="nuc"><sup>226</sup><sub>88</sub>Ra</span>) emits an alpha particle. Which nucleus is formed?',
  ['<span class="nuc"><sup>222</sup><sub>86</sub>Rn</span>', '<span class="nuc"><sup>226</sup><sub>89</sub>Ac</span>', '<span class="nuc"><sup>224</sup><sub>86</sub>Rn</span>', '<span class="nuc"><sup>222</sup><sub>88</sub>Ra</span>'],
  'Mass number 226 − 4 = 222. Atomic number 88 − 2 = 86 (radon).');

MH('C1.18-04', 'Argon (Ar 39.9) is placed before potassium (Ar 39.1) even though argon atoms are heavier on average. Why?',
  ['The table is in order of atomic number, and argon has fewer protons', 'Argon was discovered first', 'Potassium is a metal so it goes later', 'It is a mistake in the table'],
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
  ['It is unreactive, so the hot filament does not react with it', 'It glows brightly when cold', 'It conducts electricity well', 'It is a metal'],
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
  ['Melting diamond breaks strong covalent bonds; melting C₆₀ only overcomes weak intermolecular forces', 'Diamond has more carbon atoms per molecule', 'C₆₀ contains ions', 'Diamond has delocalised electrons'],
  'Diamond is a giant covalent structure. C₆₀ is made of separate molecules.');
MH('C1.50-05', 'Graphite conducts electricity but diamond does not. Why?',
  ['In graphite each carbon uses only 3 electrons in bonds, leaving delocalised electrons; in diamond all 4 are used', 'Graphite contains ions', 'Diamond is too hard for electrons to move', 'Graphite is a metal'],
  'Diamond has no free electrons because each carbon bonds to four others.');
M('C1.51-02', 'Why do simple covalent substances not conduct electricity?',
  ['They have no ions or free electrons to carry charge', 'Their molecules are too large', 'Their covalent bonds are too strong', 'They are always gases'],
  'Charge can only flow if there are charged particles that can move.');
T('C1.51-03', 'A solution of sugar (a covalent compound) in pure water conducts electricity.', false,
  'False. Sugar dissolves as molecules, not ions, so there is nothing to carry the charge.');

/* ===================== BIOLOGY 2(a) Level of organisation, 2(b) Cell structure (added 6 Nov 2026) ===================== */
M('B2.1-01', 'Which list is in order from smallest to largest?',
  ['organelle, cell, tissue, organ, organ system', 'cell, organelle, tissue, organ, organ system', 'organelle, tissue, cell, organ, organ system', 'cell, tissue, organelle, organ system, organ'],
  'Organelles make up cells, cells make up tissues, tissues make up organs, organs make up organ systems.');
M('B2.1-02', 'What is a <b>tissue</b>?',
  ['A group of similar cells working together to do a particular job', 'A structure inside a cell', 'Several organs working together', 'A single cell with a special shape'],
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
  ['A palisade cell from a leaf', 'A cheek cell', 'A red blood cell', 'A root hair cell'],
  'Chloroplasts + cell wall + vacuole = a plant cell that photosynthesises. Root hair cells have no chloroplasts.');
M('B2.3-01', 'What is the function of the <b>nucleus</b>?',
  ['It contains genetic material and controls the activities of the cell', 'It is where aerobic respiration happens', 'It makes proteins', 'It controls what enters and leaves the cell'],
  'The nucleus contains the chromosomes (DNA).');
M('B2.3-02', 'Where does aerobic respiration happen?',
  ['Mitochondria', 'Ribosomes', 'Nucleus', 'Vacuole'],
  'Mitochondria release energy from glucose in aerobic respiration.');
M('B2.3-03', 'What is the function of <b>ribosomes</b>?',
  ['Making proteins (protein synthesis)', 'Photosynthesis', 'Storing cell sap', 'Supporting the cell'],
  'Ribosomes are tiny structures in the cytoplasm where proteins are made.');
M('B2.3-04', 'What does the <b>cell membrane</b> do?',
  ['Controls which substances enter and leave the cell', 'Makes the cell rigid', 'Absorbs light for photosynthesis', 'Contains the genetic material'],
  'The membrane is partially permeable. The cell wall is what makes plant cells rigid.');
M('B2.3-05', 'What is the function of <b>chloroplasts</b>?',
  ['They absorb light for photosynthesis', 'They release energy in respiration', 'They make proteins', 'They control the cell'],
  'Chloroplasts contain chlorophyll, which absorbs light energy.');
T('B2.3-06', 'Most of the cell’s chemical reactions happen in the cytoplasm.', true,
  'True. The cytoplasm is a jelly where many reactions take place.');
MH('B2.3-07', 'Muscle cells contain many more mitochondria than most cells. Why?',
  ['Muscles need a lot of energy, which is released by aerobic respiration in mitochondria', 'Mitochondria make muscle proteins', 'Mitochondria make muscles contract by themselves', 'Mitochondria store glucose'],
  'More mitochondria → more aerobic respiration → more energy for contraction.');
MH('B2.3-08', 'A plant that has lost a lot of water wilts. Which structure’s job is most affected?',
  ['The vacuole, which keeps the cell firm when full of cell sap', 'The nucleus, which controls growth', 'The chloroplasts, which make the leaf green', 'The ribosomes, which make proteins'],
  'Full vacuoles push against the cell wall and keep cells firm. When they lose water, the plant wilts.');
M('B2.4-01', 'Which structures are found in <b>both</b> plant and animal cells?',
  ['Nucleus, cytoplasm, cell membrane, mitochondria and ribosomes', 'Cell wall, chloroplasts and vacuole', 'Only the nucleus', 'Cell wall and cell membrane'],
  'Plant cells also have a cell wall, chloroplasts and a large permanent vacuole.');
T('B2.4-02', 'Animal cells have a cell wall.', false,
  'False. Animal cells have a cell membrane but no cell wall.');
T('B2.4-03', 'Both plant and animal cells contain mitochondria.', true,
  'True. Plants respire all the time, just like animals.');
MH('B2.4-04', 'Which three structures could you use to tell a leaf cell from an animal cell under a microscope?',
  ['Cell wall, chloroplasts and large permanent vacuole', 'Nucleus, cytoplasm and membrane', 'Ribosomes, mitochondria and nucleus', 'Cell membrane, ribosomes and cytoplasm'],
  'Only plant cells have these three. (Ribosomes are too small to see with a light microscope anyway.)');

/* ===================== CHEMISTRY 1(c) Atomic structure (added 6 Nov 2026) ===================== */
M('C1.14-01', 'What is an <b>atom</b>?',
  ['The smallest particle of an element that can take part in a chemical reaction', 'Two or more atoms bonded together', 'A charged particle', 'A mixture of elements'],
  'Everything is made of atoms.');
M('C1.14-02', 'What is a <b>molecule</b>?',
  ['Two or more atoms chemically bonded together', 'A single atom of a noble gas', 'A charged particle', 'A mixture of two elements'],
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
  ['It has the same number of protons (+) as electrons (−)', 'Neutrons cancel out the protons', 'Electrons have no charge', 'The nucleus has no charge'],
  'Each +1 from a proton is balanced by a −1 from an electron.');
M('C1.16-01', 'What is the <b>mass number</b> of an atom?',
  ['The total number of protons and neutrons', 'The number of protons', 'The number of electrons', 'The number of neutrons'],
  'Atomic number = protons. Mass number = protons + neutrons.');
M('C1.16-02', 'What are <b>isotopes</b>?',
  ['Atoms of the same element with different numbers of neutrons', 'Atoms of different elements with the same mass number', 'Atoms with different numbers of protons', 'Ions of the same element'],
  'Same atomic number, different mass number.');
T('C1.16-03', 'Isotopes of an element have different numbers of protons.', false,
  'False. Changing the number of protons makes a different element. Isotopes differ in neutrons.');
MH('C1.16-04', 'Why do isotopes of an element have the same chemical properties?',
  ['They have the same number of electrons, arranged the same way', 'They have the same number of neutrons', 'They have the same mass', 'They have no electrons'],
  'Chemical reactions depend on electrons, and isotopes have identical electronic configurations.');
M('C1.16-05', 'What is the <b>relative atomic mass</b> (Ar) of an element?',
  ['The average mass of its atoms compared with 1/12 of the mass of a carbon-12 atom', 'The mass number of its most common isotope', 'The number of protons', 'The mass of one atom in grams'],
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
  ['It carries straight on without changing direction, but slows down', 'It bends towards the normal', 'It bends away from the normal', 'It is totally internally reflected'],
  'An angle of incidence of 0° gives an angle of refraction of 0°. The speed still changes.');
M('P3.17-01', 'In the refraction practical, why do you mark the path of each ray with small crosses?',
  ['So you can join them up afterwards and measure the angles accurately', 'To make the ray brighter', 'To stop the ray reflecting', 'To find the speed of light'],
  'You remove the block, draw the rays with a ruler and measure angles with a protractor.');
MH('P3.17-02', 'Why is a semi-circular block useful for investigating refraction?',
  ['A ray aimed at the centre enters the curved face along the normal, so it only refracts at the flat face', 'It stops all reflection', 'It splits light into colours', 'It makes the ray travel faster'],
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
  ['Total internal reflection in the prism reflects almost all the light', 'Prisms are lighter than mirrors', 'Prisms split the light into colours', 'Mirrors cannot reflect light'],
  'A 45° prism turns light through 90° by total internal reflection, giving a bright, clear image.');
T('P3.20-03', 'Total internal reflection can happen when light travels from air into glass.', false,
  'False. It only happens when light goes from a denser material (glass) towards a less dense one (air).');
M('P3.21-01', 'What is the <b>critical angle</b>?',
  ['The angle of incidence in the denser material at which the angle of refraction is 90°', 'The angle at which light enters the glass', 'The angle of a prism', 'The angle at which light is absorbed'],
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
  ['Sound needs particles to vibrate and pass the wave on', 'Sound is an electromagnetic wave', 'Sound is too slow', 'The vacuum absorbs it'],
  'Sound is a longitudinal mechanical wave. Light can cross a vacuum; sound cannot.');
M('P3.23-04', 'Sound changes speed when it passes into a different medium. What can this cause?',
  ['Refraction: a change of direction', 'Total internal reflection every time', 'A change of frequency', 'The sound becoming transverse'],
  'Like light, sound refracts when its speed changes, e.g. between warm and cold air.');
M('P3.14-03', 'Which of these shows that light can be refracted?',
  ['A straw looks bent where it goes into a glass of water', 'You can see your face in a mirror', 'An echo in a large hall', 'A shadow forms behind an object'],
  'The light changes speed and direction as it leaves the water, so the straw appears bent.');
T('P3.19-03', 'To measure the refractive index of a glass block reliably, you should use several rays with different angles of incidence.', true,
  'True. Several readings (or a graph of sin i against sin r) give a more reliable value than one ray.');
T('P3.21-03', 'At the critical angle, the refracted ray travels along the boundary between the two materials.', true,
  'True. The angle of refraction is 90°. Any bigger angle of incidence gives total internal reflection.');
