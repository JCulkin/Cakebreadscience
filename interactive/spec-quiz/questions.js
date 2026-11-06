/* Question bank for the Spec Quiz. Every question is tied to one spec point, e.g. 'P3.5' = Physics 3.5, 'C1.38' = Chemistry 1.38.
   M(spec, question, [correct, wrong, wrong, wrong], explanation)  → multiple choice (options are shuffled at runtime)
   T(spec, statement, true|false, explanation)                     → true or false
   Keep to the Edexcel International GCSE Science (Double Award) wording and scope. */
const QUESTIONS = [];
function M(s, q, o, x) { QUESTIONS.push({ s, q, o, x }); }
function T(s, q, tf, x) { QUESTIONS.push({ s, q, tf, x }); }

/* ===================== PHYSICS 3(b) Properties of waves ===================== */
M('P3.2', 'In a <b>transverse</b> wave, the oscillations are…',
  ['at right angles to the direction of energy transfer', 'parallel to the direction of energy transfer', 'in circles around the direction of travel', 'only in the direction the wave is moving'],
  'Transverse: oscillations are <b>perpendicular</b> to the direction the wave transfers energy (e.g. light, water ripples).');
M('P3.2', 'Which of these is a <b>longitudinal</b> wave?',
  ['Sound', 'Light', 'Microwaves', 'Ripples on water'],
  'Sound is longitudinal. All electromagnetic waves and water ripples are transverse.');
T('P3.2', 'Longitudinal waves have compressions and rarefactions.', true,
  'True. The oscillations are parallel to the direction of travel, so particles bunch up (compressions) and spread out (rarefactions).');
T('P3.2', 'Light waves are longitudinal.', false,
  'False. Light (and every electromagnetic wave) is <b>transverse</b>.');
M('P3.3', 'What is the <b>amplitude</b> of a wave?',
  ['The maximum displacement of a point from its rest position', 'The distance from a peak to a trough', 'The number of waves passing a point each second', 'The time taken for one complete wave'],
  'Amplitude is measured from the rest (middle) position to a peak, not peak to trough.');
M('P3.3', 'What is the <b>wavelength</b> of a wave?',
  ['The distance from a point on one wave to the same point on the next wave', 'The distance from a peak to the next trough', 'The height of a peak above the rest position', 'The distance the wave travels in one second'],
  'Wavelength (λ) is one complete wave, e.g. peak to the next peak.');
M('P3.3', 'What is the <b>frequency</b> of a wave?',
  ['The number of waves passing a point each second', 'The time taken for one complete wave', 'The distance travelled by the wave each second', 'The number of peaks on a diagram'],
  'Frequency is measured in hertz (Hz). 1 Hz = one wave per second.');
M('P3.3', 'What is the <b>period</b> of a wave?',
  ['The time taken for one complete wave to pass a point', 'The number of waves passing a point each second', 'The length of one complete wave', 'The time for the wave to reach its maximum amplitude'],
  'The period (T) is measured in seconds.');
M('P3.3', 'What is a <b>wavefront</b>?',
  ['A line joining points on a wave that are in step, such as all the peaks', 'The first wave produced by a source', 'The highest point on a wave', 'The direction the wave travels in'],
  'On a wavefront diagram each line is a wavefront; the gap between neighbouring wavefronts is one wavelength.');
T('P3.3', 'The distance from a peak to the next trough is one wavelength.', false,
  'False. Peak to trough is only <b>half</b> a wavelength. Peak to the next peak is one wavelength.');
T('P3.4', 'Waves transfer matter from one place to another.', false,
  'False. Waves transfer <b>energy and information</b> without transferring matter.');
M('P3.4', 'A cork floating on a pond bobs up and down as ripples pass, but does not move along with them. What does this show?',
  ['Waves transfer energy without transferring matter', 'Water waves are longitudinal', 'The waves have no energy', 'The cork is too heavy to move'],
  'The water (and cork) only oscillates about a fixed position. The energy moves on; the matter does not.');
M('P3.5', 'A wave has a frequency of 50 Hz and a wavelength of 2 m. What is its speed?',
  ['100 m/s', '25 m/s', '52 m/s', '0.04 m/s'],
  'v = f × λ = 50 × 2 = <b>100 m/s</b>.');
M('P3.5', 'A sound wave travels at 340 m/s and has a frequency of 170 Hz. What is its wavelength?',
  ['2 m', '0.5 m', '510 m', '57 800 m'],
  'λ = v ÷ f = 340 ÷ 170 = <b>2 m</b>.');
M('P3.5', 'A wave has a speed of 12 m/s and a wavelength of 3 m. What is its frequency?',
  ['4 Hz', '36 Hz', '0.25 Hz', '15 Hz'],
  'f = v ÷ λ = 12 ÷ 3 = <b>4 Hz</b>.');
T('P3.5', 'If the speed of a wave stays the same and its frequency doubles, its wavelength halves.', true,
  'True. v = f × λ, so if v is fixed, doubling f halves λ.');
M('P3.6', 'A wave has a time period of 0.02 s. What is its frequency?',
  ['50 Hz', '0.02 Hz', '5 Hz', '500 Hz'],
  'f = 1 ÷ T = 1 ÷ 0.02 = <b>50 Hz</b>.');
M('P3.6', 'A wave has a frequency of 4 Hz. What is its time period?',
  ['0.25 s', '4 s', '0.4 s', '2.5 s'],
  'T = 1 ÷ f = 1 ÷ 4 = <b>0.25 s</b>.');
M('P3.7', 'A microwave has a frequency of 1.0 × 10¹⁰ Hz and a wavelength of 0.03 m. What is its speed?',
  ['3 × 10⁸ m/s', '3 × 10¹¹ m/s', '3.3 × 10¹¹ m/s', '3 × 10⁻¹² m/s'],
  'v = f × λ = 1.0 × 10¹⁰ × 0.03 = <b>3 × 10⁸ m/s</b>, the speed of all electromagnetic waves in free space.');
M('P3.7', 'A radio station broadcasts at a frequency of 200 000 Hz. Radio waves travel at 3 × 10⁸ m/s. What is the wavelength?',
  ['1500 m', '6 × 10¹³ m', '0.0015 m', '667 m'],
  'λ = v ÷ f = 300 000 000 ÷ 200 000 = <b>1500 m</b>.');
M('P3.8', 'An ambulance drives <b>towards</b> you with its siren on. Compared with a stationary siren, you hear…',
  ['a higher frequency (higher pitch)', 'a lower frequency (lower pitch)', 'the same frequency but louder', 'the same frequency and pitch'],
  'Doppler effect: the waves get bunched up in front of a moving source, so the observed wavelength is shorter and the frequency is higher.');
M('P3.8', 'A source of waves moves <b>away</b> from an observer. What happens to the observed wavelength and frequency?',
  ['Wavelength increases, frequency decreases', 'Wavelength decreases, frequency increases', 'Both increase', 'Both stay the same'],
  'Behind a moving source the waves are stretched out: longer wavelength, lower frequency.');
T('P3.8', 'The Doppler effect only happens with sound waves.', false,
  'False. It happens with all waves, including light (e.g. red-shift of distant galaxies).');
T('P3.9', 'All waves can be reflected and refracted.', true,
  'True. This is true for sound, light, water waves and all electromagnetic waves.');
M('P3.9', 'What is <b>refraction</b>?',
  ['A change in direction when a wave changes speed as it passes into a different medium', 'A wave bouncing off a surface', 'A wave losing energy as it travels', 'A wave spreading out after passing through a gap'],
  'Refraction happens because the wave changes speed at the boundary between two materials.');

/* ===================== PHYSICS 3(c) The electromagnetic spectrum ===================== */
M('P3.10', 'How do the speeds of different electromagnetic waves compare in free space (a vacuum)?',
  ['They all travel at the same speed', 'Gamma rays are the fastest', 'Radio waves are the fastest', 'It depends on their amplitude'],
  'All electromagnetic waves travel at the same speed in free space: 3 × 10⁸ m/s.');
T('P3.10', 'Light is part of a continuous spectrum of electromagnetic waves.', true,
  'True. Visible light is just the part of the electromagnetic spectrum our eyes can detect.');
T('P3.10', 'Electromagnetic waves need a medium (such as air) to travel through.', false,
  'False. Electromagnetic waves can travel through free space (a vacuum), which is how light reaches us from the Sun.');
M('P3.11', 'Which list is in order of <b>decreasing wavelength</b>?',
  ['radio, microwave, infrared, visible, ultraviolet, x-ray, gamma', 'gamma, x-ray, ultraviolet, visible, infrared, microwave, radio', 'radio, infrared, microwave, visible, ultraviolet, gamma, x-ray', 'microwave, radio, infrared, visible, x-ray, ultraviolet, gamma'],
  'Longest wavelength (radio) to shortest (gamma). Frequency increases in the same direction.');
M('P3.11', 'Which electromagnetic wave has the <b>highest frequency</b>?',
  ['Gamma rays', 'Radio waves', 'X-rays', 'Ultraviolet'],
  'Gamma rays have the highest frequency and shortest wavelength.');
M('P3.11', 'Which electromagnetic wave has the <b>longest wavelength</b>?',
  ['Radio waves', 'Microwaves', 'Gamma rays', 'Infrared'],
  'Radio waves have the longest wavelength and lowest frequency.');
M('P3.11', 'Which part of the electromagnetic spectrum lies between <b>infrared</b> and <b>ultraviolet</b>?',
  ['Visible light', 'Microwaves', 'X-rays', 'Radio waves'],
  'Order: radio, microwave, infrared, <b>visible</b>, ultraviolet, x-ray, gamma.');
M('P3.11', 'Which colour of visible light has the <b>longest wavelength</b>?',
  ['Red', 'Violet', 'Green', 'Blue'],
  'Red (next to infrared) has the longest wavelength; violet (next to ultraviolet) has the shortest.');
M('P3.11', 'Which list of colours is in order of <b>decreasing wavelength</b>?',
  ['red, orange, yellow, green, blue, indigo, violet', 'violet, indigo, blue, green, yellow, orange, red', 'red, yellow, orange, green, blue, violet, indigo', 'blue, green, red, orange, yellow, indigo, violet'],
  'ROYGBIV: red has the longest wavelength, violet the shortest.');
T('P3.11', 'X-rays have a longer wavelength than ultraviolet.', false,
  'False. X-rays come after ultraviolet, so they have a <b>shorter</b> wavelength and higher frequency.');
M('P3.12', 'Which electromagnetic radiation is used to <b>sterilise</b> food and medical equipment?',
  ['Gamma rays', 'Infrared', 'Microwaves', 'Radio waves'],
  'Gamma rays kill bacteria, so they sterilise food and medical equipment.');
M('P3.12', 'Night vision equipment detects…',
  ['infrared', 'ultraviolet', 'x-rays', 'microwaves'],
  'Warm objects emit infrared, which night vision equipment detects. Infrared is also used in heaters.');
M('P3.12', 'Which electromagnetic radiation is used for <b>satellite transmissions</b> and cooking?',
  ['Microwaves', 'Radio waves', 'Gamma rays', 'Visible light'],
  'Microwaves: cooking and satellite transmissions.');
M('P3.12', 'Optical fibres usually carry…',
  ['visible light', 'gamma rays', 'radio waves', 'microwaves'],
  'Visible light: optical fibres and photography.');
M('P3.12', 'Which electromagnetic radiation is used in <b>fluorescent lamps</b>?',
  ['Ultraviolet', 'Infrared', 'X-rays', 'Radio waves'],
  'The ultraviolet is absorbed by the coating on the tube, which then glows with visible light.');
M('P3.12', 'Which radiation is used to see the internal structure of objects, such as broken bones?',
  ['X-rays', 'Ultraviolet', 'Infrared', 'Microwaves'],
  'X-rays pass through soft tissue but are absorbed by bone and dense materials.');
M('P3.12', 'Which electromagnetic radiation is used for <b>broadcasting</b> TV and radio?',
  ['Radio waves', 'Gamma rays', 'Ultraviolet', 'X-rays'],
  'Radio waves: broadcasting and communications.');
M('P3.13', 'Too much <b>ultraviolet</b> can cause…',
  ['damage to surface cells and blindness', 'internal heating of body tissue', 'skin burns from heat', 'no harm at all'],
  'UV damages surface cells (skin) and the eyes. Protect yourself with sunscreen and sunglasses.');
M('P3.13', 'Excessive exposure to <b>microwaves</b> can cause…',
  ['internal heating of body tissue', 'skin cancer', 'blindness', 'mutations in DNA'],
  'Microwaves are absorbed by water in body tissue and heat it from the inside. The metal case of a microwave oven protects you.');
M('P3.13', 'Which electromagnetic radiation can cause <b>skin burns</b>?',
  ['Infrared', 'Radio waves', 'Microwaves', 'Visible light'],
  'Infrared is heat radiation; too much burns the skin.');
M('P3.13', 'Which electromagnetic radiation can cause <b>cancer and mutation</b>?',
  ['Gamma rays', 'Infrared', 'Radio waves', 'Visible light'],
  'Gamma rays are ionising. Protection: lead or thick concrete shielding and limiting exposure time.');
M('P3.13', 'Which is a simple way to protect yourself from <b>ultraviolet</b>?',
  ['Wear sunscreen and sunglasses', 'Stand behind a sheet of paper', 'Turn off your mobile phone', 'Stay near a radiator'],
  'Sunscreen and sunglasses absorb UV before it reaches skin cells and eyes.');

/* ===================== PHYSICS 7(b) Radioactivity ===================== */
M('P7.2', 'How many protons and neutrons are in a nucleus of <span class="nuc"><sup>14</sup><sub>6</sub>C</span>?',
  ['6 protons, 8 neutrons', '6 protons, 14 neutrons', '14 protons, 6 neutrons', '8 protons, 6 neutrons'],
  'The bottom number (6) is the proton number. Neutrons = 14 − 6 = <b>8</b>.');
T('P7.2', 'The nucleus of an atom contains protons and electrons.', false,
  'False. The nucleus contains <b>protons and neutrons</b>. Electrons are outside the nucleus.');
M('P7.3', 'What is the <b>mass (nucleon) number</b> of an atom?',
  ['The number of protons plus neutrons', 'The number of protons only', 'The number of neutrons only', 'The number of protons plus electrons'],
  'Protons and neutrons are both nucleons, so the nucleon number is their total.');
M('P7.3', 'Isotopes of an element have…',
  ['the same number of protons but a different number of neutrons', 'the same number of neutrons but a different number of protons', 'a different number of protons and electrons', 'the same mass number but different atomic numbers'],
  'Same proton (atomic) number = same element. Different neutrons = different mass number.');
T('P7.4', 'You can predict exactly when a particular unstable nucleus will decay.', false,
  'False. Radioactive decay is a <b>random</b> process.');
M('P7.4', 'Alpha, beta and gamma radiation are emitted from…',
  ['unstable nuclei', 'the electron shells of atoms', 'stable nuclei', 'any atom that is heated'],
  'They are ionising radiations emitted from unstable nuclei, in a random process.');
M('P7.5', 'What is an <b>alpha particle</b>?',
  ['2 protons and 2 neutrons (a helium nucleus)', 'A high-speed electron', 'An electromagnetic wave', 'A single neutron'],
  'α = ⁴₂He: 2 protons + 2 neutrons.');
M('P7.5', 'What is a <b>beta (β⁻) particle</b>?',
  ['A high-speed electron emitted from the nucleus', 'A helium nucleus', 'An electromagnetic wave', 'A proton'],
  'A neutron in the nucleus turns into a proton and a fast electron, which is emitted.');
M('P7.5', 'Which radiation is an <b>electromagnetic wave</b>?',
  ['Gamma', 'Alpha', 'Beta', 'Neutron'],
  'Gamma rays are high-frequency electromagnetic waves with no mass and no charge.');
M('P7.5', 'Which radiation is the most <b>penetrating</b>?',
  ['Gamma', 'Alpha', 'Beta', 'They are all the same'],
  'Gamma is only reduced by thick lead or concrete. Alpha is stopped by paper; beta by a few mm of aluminium.');
M('P7.5', 'Which radiation is the most strongly <b>ionising</b>?',
  ['Alpha', 'Beta', 'Gamma', 'They are all the same'],
  'Alpha is the most ionising (and least penetrating). Gamma is the least ionising.');
M('P7.5', 'Which radiation is stopped by a sheet of paper?',
  ['Alpha', 'Beta', 'Gamma', 'None of them'],
  'Alpha: paper (or a few cm of air). Beta: a few mm of aluminium. Gamma: thick lead or concrete.');
M('P7.6', 'A source gives a high count rate. Placing a sheet of paper in front of it makes the count drop to background level. The source emits…',
  ['alpha only', 'beta only', 'gamma only', 'beta and gamma'],
  'Only alpha is stopped by paper. If anything else were emitted, the count would stay above background.');
M('P7.7', 'What happens to a nucleus when it emits an <b>alpha</b> particle?',
  ['Atomic number falls by 2, mass number falls by 4', 'Atomic number rises by 1, mass number unchanged', 'Both numbers unchanged', 'Mass number falls by 1, atomic number unchanged'],
  'It loses 2 protons and 2 neutrons.');
M('P7.7', 'What happens to a nucleus when it emits a <b>beta</b> particle?',
  ['Atomic number rises by 1, mass number unchanged', 'Atomic number falls by 1, mass number unchanged', 'Atomic number falls by 2, mass number falls by 4', 'Both numbers unchanged'],
  'A neutron turns into a proton, so there is one more proton but the same total of nucleons.');
T('P7.7', 'Emitting a gamma ray does not change the atomic number or mass number of a nucleus.', true,
  'True. Gamma is energy only: no mass and no charge.');
M('P7.7', 'What happens to a nucleus when it emits a <b>neutron</b>?',
  ['Mass number falls by 1, atomic number unchanged', 'Atomic number falls by 1, mass number unchanged', 'Both fall by 1', 'Mass number rises by 1'],
  'It loses one nucleon but no protons, so it is a different isotope of the same element.');
M('P7.8', 'Complete the equation: <span class="nuc"><sup>238</sup><sub>92</sub>U</span> → <span class="nuc"><sup>234</sup><sub>90</sub>Th</span> + <b>?</b>',
  ['<span class="nuc"><sup>4</sup><sub>2</sub>He</span> (alpha)', '<span class="nuc"><sup>0</sup><sub>−1</sub>e</span> (beta)', 'γ (gamma)', '<span class="nuc"><sup>1</sup><sub>0</sub>n</span> (neutron)'],
  'Mass: 238 = 234 + 4. Charge: 92 = 90 + 2. So the missing particle is ⁴₂He, an alpha particle.');
M('P7.8', 'Complete the equation: <span class="nuc"><sup>14</sup><sub>6</sub>C</span> → <span class="nuc"><sup>14</sup><sub>7</sub>N</span> + <b>?</b>',
  ['<span class="nuc"><sup>0</sup><sub>−1</sub>e</span> (beta)', '<span class="nuc"><sup>4</sup><sub>2</sub>He</span> (alpha)', 'γ (gamma)', '<span class="nuc"><sup>1</sup><sub>0</sub>n</span> (neutron)'],
  'Mass: 14 = 14 + 0. Charge: 6 = 7 + (−1). So the missing particle is a beta particle.');
M('P7.9', 'Which of these can detect ionising radiation?',
  ['A Geiger-Müller detector', 'A voltmeter', 'A thermometer', 'A magnifying glass'],
  'Geiger-Müller detectors and photographic film both detect ionising radiation.');
M('P7.10', 'Which is a source of background radiation from <b>space</b>?',
  ['Cosmic rays', 'Radon gas', 'Rocks such as granite', 'Food and drink'],
  'Cosmic rays come from space. Radon gas and rocks are sources from the Earth.');
T('P7.10', 'Background radiation only comes from man-made sources.', false,
  'False. Most background radiation is natural: radon gas, rocks, food and cosmic rays from space.');
M('P7.11', 'What is the unit of <b>activity</b> of a radioactive source?',
  ['Becquerel (Bq)', 'Hertz (Hz)', 'Joule (J)', 'Sievert per hour'],
  'Activity is measured in becquerels: 1 Bq = 1 decay per second.');
T('P7.11', 'The activity of a radioactive source decreases over time.', true,
  'True. As unstable nuclei decay there are fewer left to decay, so the activity falls.');
M('P7.12', 'What is the <b>half-life</b> of a radioactive isotope?',
  ['The time taken for half the unstable nuclei in a sample to decay', 'Half the time it takes for all the nuclei to decay', 'The time taken for a source to stop being radioactive', 'Half the age of the source'],
  'Equivalently: the time for the activity (or count rate) to fall to half.');
T('P7.12', 'All radioactive isotopes have the same half-life.', false,
  'False. Half-lives vary from fractions of a second to billions of years.');
M('P7.13', 'A source has an activity of 800 Bq and a half-life of 2 hours. What is its activity after 6 hours?',
  ['100 Bq', '200 Bq', '400 Bq', '0 Bq'],
  '6 h = 3 half-lives: 800 → 400 → 200 → <b>100 Bq</b>.');
M('P7.13', 'The activity of a source falls from 160 Bq to 20 Bq in 24 days. What is its half-life?',
  ['8 days', '12 days', '6 days', '3 days'],
  '160 → 80 → 40 → 20 is 3 half-lives. 24 ÷ 3 = <b>8 days</b>.');
M('P7.14', 'A factory checks the thickness of paper by passing radiation through it. Which radiation should it use?',
  ['Beta', 'Alpha', 'Gamma', 'Any of them'],
  'Alpha would be completely stopped and gamma would pass straight through. Beta is partly absorbed, so the count changes with thickness.');
M('P7.14', 'Which is a medical use of radioactivity?',
  ['Using gamma rays to kill cancer cells (radiotherapy)', 'Using alpha particles to see broken bones', 'Using beta particles to cook food', 'Using radon gas to sterilise equipment'],
  'Others include tracers to see inside the body and gamma sterilisation of medical equipment.');
M('P7.15', 'What is meant by <b>contamination</b>?',
  ['Radioactive material gets onto or into an object or person', 'An object is exposed to radiation from a source outside it', 'An object becomes radioactive after being irradiated', 'Radiation is blocked by a shield'],
  'Contamination: the radioactive atoms are on or inside you, so you keep being exposed. Irradiation: exposure to radiation from outside.');
T('P7.15', 'An object that has been irradiated becomes radioactive.', false,
  'False. Irradiation does not make an object radioactive. That is why gamma-sterilised food is safe to eat.');
M('P7.16', 'Why is ionising radiation dangerous to living organisms?',
  ['It can damage cells and tissue and cause mutations', 'It makes the body radioactive forever', 'It only damages metals', 'It makes cells grow faster and stronger'],
  'Ionising radiation can damage or kill cells and cause mutations in DNA, which may lead to cancer.');
M('P7.16', 'Why is the disposal of radioactive waste a problem?',
  ['Some of it stays radioactive for thousands of years', 'It is too heavy to move', 'It quickly turns into gamma rays', 'It is not dangerous once buried'],
  'Long half-life waste must be stored securely, often deep underground, so it cannot leak into the environment.');

/* ===================== CHEMISTRY 1(d) The Periodic Table ===================== */
M('C1.18', 'Elements in the Periodic Table are arranged in order of…',
  ['atomic number', 'relative atomic mass', 'date of discovery', 'number of neutrons'],
  'The modern Periodic Table is in order of atomic (proton) number.');
M('C1.18', 'In the Periodic Table, a horizontal row is called a…',
  ['period', 'group', 'shell', 'family'],
  'Rows are periods; columns are groups.');
T('C1.18', 'The vertical columns in the Periodic Table are called groups.', true,
  'True. Elements in the same group have the same number of outer electrons.');
M('C1.19', 'Magnesium is in Group 2, Period 3. What is its electronic configuration?',
  ['2.8.2', '2.2', '2.8.3', '3.2'],
  'Period 3 → 3 shells. Group 2 → 2 outer electrons. So <b>2.8.2</b>.');
M('C1.19', 'Potassium is in Group 1, Period 4. What is its electronic configuration?',
  ['2.8.8.1', '2.8.1', '2.8.9', '2.8.18.1'],
  'Period 4 → 4 shells. Group 1 → 1 outer electron. So <b>2.8.8.1</b> (19 electrons).');
M('C1.19', 'Nitrogen is in Group 5, Period 2. What is its electronic configuration?',
  ['2.5', '2.8.5', '5.2', '2.3'],
  'Period 2 → 2 shells. Group 5 → 5 outer electrons. So <b>2.5</b>.');
M('C1.20', 'An element does not conduct electricity and its oxide dissolves in water to give a solution of pH 2. The element is…',
  ['a non-metal', 'a metal', 'a noble gas', 'impossible to classify'],
  'Non-metals are poor conductors and form <b>acidic</b> oxides. Metals conduct and form basic oxides.');
T('C1.20', 'Metal oxides are basic.', true,
  'True. Metal oxides are bases; those that dissolve in water form alkaline solutions. Non-metal oxides are acidic.');
M('C1.21', 'Which of these elements is a <b>non-metal</b>?',
  ['Sulfur', 'Sodium', 'Magnesium', 'Aluminium'],
  'Non-metals are on the right of the Periodic Table. Sulfur is in Group 6.');
M('C1.21', 'Where are the metals found in the Periodic Table?',
  ['On the left and in the centre', 'Only in Group 0', 'On the top right', 'Only in Period 1'],
  'Metals are on the left and in the middle; non-metals are on the right.');
M('C1.22', 'An element has the electronic configuration 2.8.6. Where is it in the Periodic Table?',
  ['Group 6, Period 3', 'Group 3, Period 6', 'Group 8, Period 2', 'Group 6, Period 2'],
  'Outer electrons = group number (6). Number of occupied shells = period (3). It is sulfur.');
T('C1.22', 'Atoms of every Group 0 element have 8 outer electrons.', false,
  'False. Helium has only 2 electrons, but its shell is full.');
M('C1.23', 'Why do elements in the same group have similar chemical properties?',
  ['They have the same number of outer electrons', 'They have the same number of shells', 'They have the same atomic number', 'They have the same number of neutrons'],
  'Chemical reactions involve outer electrons, so the same number of outer electrons gives similar reactions.');
M('C1.24', 'Why do the noble gases not readily react?',
  ['They have a full outer shell of electrons', 'They have no electrons', 'They are gases', 'They have no neutrons'],
  'A full outer shell is stable, so they do not need to lose, gain or share electrons.');

/* ===================== CHEMISTRY 1(f) Ionic bonding ===================== */
M('C1.37', 'How does a sodium atom (2.8.1) form a sodium ion?',
  ['It loses 1 electron to form Na⁺', 'It gains 1 electron to form Na⁻', 'It gains 7 electrons to form Na⁷⁻', 'It loses 1 proton to form Na⁺'],
  'Losing one electron leaves a full outer shell (2.8) and one more proton than electrons.');
M('C1.37', 'How does a chlorine atom (2.8.7) form a chloride ion?',
  ['It gains 1 electron to form Cl⁻', 'It loses 1 electron to form Cl⁺', 'It loses 7 electrons to form Cl⁷⁺', 'It gains 1 proton to form Cl⁺'],
  'Gaining one electron gives a full outer shell (2.8.8) and a 1− charge.');
T('C1.37', 'Metal atoms gain electrons to form negative ions.', false,
  'False. Metal atoms <b>lose</b> electrons to form <b>positive</b> ions. Non-metals gain electrons to form negative ions.');
T('C1.37', 'When an atom becomes an ion, its number of protons stays the same.', true,
  'True. Only electrons are lost or gained. The proton number stays the same, so it is still the same element.');
M('C1.38', 'What is the charge on an ion of a <b>Group 3</b> metal, such as aluminium?',
  ['3+', '3−', '5−', '1+'],
  'Group 3 metals lose 3 electrons: Al³⁺.');
M('C1.38', 'What is the charge on an ion formed by a <b>Group 5</b> non-metal, such as nitrogen?',
  ['3−', '5+', '5−', '3+'],
  'Nitrogen (2.5) gains 3 electrons to fill its outer shell: N³⁻.');
M('C1.38', 'What is the formula of the <b>sulfate</b> ion?',
  ['SO₄²⁻', 'SO₃²⁻', 'S²⁻', 'SO₄⁻'],
  'Sulfate is SO₄²⁻. (S²⁻ is sulfide.)');
M('C1.38', 'What is the formula of the <b>ammonium</b> ion?',
  ['NH₄⁺', 'NH₃', 'NH₄⁻', 'NO₃⁻'],
  'Ammonium is NH₄⁺, one of the few positive ions that is not a metal. NO₃⁻ is nitrate.');
M('C1.38', 'Which ion is <b>iron(III)</b>?',
  ['Fe³⁺', 'Fe²⁺', 'Fe³⁻', 'Fe⁺'],
  'The Roman numeral gives the charge: iron(III) is Fe³⁺, iron(II) is Fe²⁺.');
M('C1.38', 'Which pair of ions both have a charge of 1−?',
  ['Hydroxide and nitrate', 'Sulfate and carbonate', 'Hydroxide and carbonate', 'Nitrate and sulfate'],
  'OH⁻ and NO₃⁻ are 1−. SO₄²⁻ and CO₃²⁻ are 2−.');
T('C1.38', 'The silver ion is Ag²⁺.', false,
  'False. The silver ion is <b>Ag⁺</b>. (Cu²⁺, Fe²⁺, Pb²⁺ and Zn²⁺ are the 2+ ones.)');
M('C1.39', 'What is the formula of magnesium chloride?',
  ['MgCl₂', 'MgCl', 'Mg₂Cl', 'Mg₂Cl₃'],
  'Mg²⁺ needs two Cl⁻ ions to balance the charge: <b>MgCl₂</b>.');
M('C1.39', 'What is the formula of aluminium oxide?',
  ['Al₂O₃', 'AlO', 'Al₃O₂', 'AlO₃'],
  'Al³⁺ and O²⁻: 2 × (+3) = +6 and 3 × (−2) = −6. So <b>Al₂O₃</b>.');
M('C1.39', 'What is the formula of calcium hydroxide?',
  ['Ca(OH)₂', 'CaOH', 'CaOH₂', 'Ca₂OH'],
  'Ca²⁺ needs two OH⁻ ions. Brackets show there are two whole hydroxide ions: <b>Ca(OH)₂</b>.');
M('C1.39', 'What is the formula of ammonium sulfate?',
  ['(NH₄)₂SO₄', 'NH₄SO₄', 'NH₄(SO₄)₂', '(NH₄)₃SO₄'],
  'Two NH₄⁺ ions balance one SO₄²⁻ ion: <b>(NH₄)₂SO₄</b>.');
M('C1.39', 'What is the formula of sodium oxide?',
  ['Na₂O', 'NaO', 'NaO₂', 'Na₂O₂'],
  'Two Na⁺ ions balance one O²⁻ ion: <b>Na₂O</b>.');
M('C1.40', 'When magnesium (2.8.2) reacts with oxygen (2.6), how many electrons are transferred from each magnesium atom?',
  ['2', '1', '6', '8'],
  'Mg loses 2 electrons and O gains 2, forming Mg²⁺ and O²⁻.');
M('C1.40', 'When calcium reacts with chlorine to form CaCl₂, what happens to the electrons?',
  ['Calcium gives one electron to each of two chlorine atoms', 'Calcium gives two electrons to one chlorine atom', 'Each chlorine atom gives one electron to calcium', 'Calcium and chlorine share a pair of electrons'],
  'Each Cl atom needs only one electron, so two Cl atoms are needed to take calcium’s two outer electrons.');
T('C1.40', 'In a dot-and-cross diagram, ions are drawn in square brackets with their charge outside.', true,
  'True. For example [Na]⁺ and [Cl]⁻, showing only the outer shells.');
M('C1.41', 'What is an <b>ionic bond</b>?',
  ['The electrostatic attraction between oppositely charged ions', 'A shared pair of electrons', 'The attraction between a nucleus and its own electrons', 'A force between neighbouring molecules'],
  'Positive and negative ions attract each other strongly in all directions.');
M('C1.42', 'Why does sodium chloride have a high melting point?',
  ['Lots of energy is needed to overcome the strong electrostatic attractions between ions', 'The covalent bonds inside its molecules are strong', 'It has weak forces between molecules', 'Its electrons are free to move'],
  'A giant ionic lattice has many strong attractions between oppositely charged ions in all directions.');
M('C1.42', 'Magnesium oxide (Mg²⁺ O²⁻) has a much higher melting point than sodium chloride (Na⁺ Cl⁻). Why?',
  ['Its ions have higher charges, so the attractions are stronger', 'It contains covalent bonds', 'It has weaker attractions between ions', 'Its ions are free to move'],
  'Bigger charges give stronger electrostatic attractions, which need more energy to overcome.');
T('C1.43', 'Solid sodium chloride conducts electricity because it contains ions.', false,
  'False. In the solid, the ions are held in fixed positions and cannot move.');
M('C1.43', 'Why does molten sodium chloride conduct electricity?',
  ['Its ions are free to move', 'Its electrons are free to move', 'Its molecules are free to move', 'It contains metal atoms'],
  'Ionic compounds conduct when molten or in aqueous solution because the <b>ions</b> can move. It is not electrons.');
M('C1.43', 'In which state does an ionic compound <b>not</b> conduct electricity?',
  ['Solid', 'Molten', 'Dissolved in water', 'It conducts in all states'],
  'Solid: ions fixed. Molten or aqueous: ions free to move, so it conducts.');

/* ===================== CHEMISTRY 1(g) Covalent bonding ===================== */
M('C1.44', 'What is a <b>covalent bond</b>?',
  ['A shared pair of electrons between two atoms', 'The transfer of electrons from a metal to a non-metal', 'The attraction between oppositely charged ions', 'A sea of delocalised electrons'],
  'Covalent bonds usually form between non-metal atoms.');
M('C1.44', 'Covalent bonds usually form between…',
  ['non-metal atoms', 'metal atoms', 'a metal and a non-metal', 'noble gas atoms'],
  'Metal + non-metal usually gives ionic bonding. Non-metal + non-metal gives covalent bonding.');
M('C1.45', 'What holds the two atoms together in a covalent bond?',
  ['The electrostatic attraction between the shared pair of electrons and both nuclei', 'The attraction between two positive ions', 'The repulsion between the two nuclei', 'Magnetic forces between the electrons'],
  'Both positive nuclei are attracted to the negative shared pair between them.');
M('C1.46', 'How many electrons are shared between the two atoms in a nitrogen molecule (N₂)?',
  ['6', '2', '3', '4'],
  'N₂ has a triple bond: 3 shared pairs = <b>6</b> electrons.');
M('C1.46', 'How many lone (non-bonding) pairs of electrons are on the oxygen atom in water (H₂O)?',
  ['2', '1', '0', '4'],
  'Oxygen has 6 outer electrons: 2 are used in the two O–H bonds and 4 form 2 lone pairs.');
M('C1.46', 'Which molecule contains a <b>double</b> bond?',
  ['Ethene, C₂H₄', 'Ethane, C₂H₆', 'Methane, CH₄', 'Hydrogen chloride, HCl'],
  'Ethene has a C=C double bond. Carbon dioxide (O=C=O) and oxygen (O=O) also have double bonds.');
M('C1.46', 'How many covalent bonds are in a molecule of ammonia (NH₃)?',
  ['3', '1', '4', '5'],
  'Three N–H single bonds, plus one lone pair on the nitrogen.');
M('C1.46', 'How many covalent bonds are in a molecule of ethane (C₂H₆)?',
  ['7', '6', '8', '2'],
  'Six C–H bonds plus one C–C bond = <b>7</b>.');
T('C1.46', 'A carbon dioxide molecule contains two double bonds.', true,
  'True. O=C=O: carbon shares two pairs of electrons with each oxygen.');
M('C1.47', 'Why do substances with simple molecular structures have low melting and boiling points?',
  ['The intermolecular forces are weak and need little energy to overcome', 'The covalent bonds are weak', 'The ions are held loosely', 'The molecules are very large'],
  'Melting and boiling only overcome the forces <b>between</b> molecules, not the strong covalent bonds inside them.');
T('C1.47', 'When water boils, the covalent bonds inside the water molecules break.', false,
  'False. Only the weak intermolecular forces are overcome. The H₂O molecules stay whole.');
M('C1.48', 'Which halogen has the highest boiling point?',
  ['Iodine, I₂ (Mr 254)', 'Bromine, Br₂ (Mr 160)', 'Chlorine, Cl₂ (Mr 71)', 'Fluorine, F₂ (Mr 38)'],
  'Larger molecules (higher Mr) have stronger intermolecular forces, so more energy is needed to separate them.');
M('C1.48', 'Why does boiling point generally increase with relative molecular mass for simple molecular substances?',
  ['Intermolecular forces get stronger as molecules get bigger', 'Covalent bonds get stronger as molecules get bigger', 'Bigger molecules contain ions', 'Bigger molecules have fewer electrons'],
  'More electrons and bigger molecules → stronger forces between molecules.');
M('C1.49', 'Why do substances with giant covalent structures have very high melting points?',
  ['Many strong covalent bonds must be broken', 'They have strong intermolecular forces', 'They contain ions in a lattice', 'They have delocalised electrons'],
  'In a giant covalent structure every atom is joined by covalent bonds, and melting means breaking lots of them.');
M('C1.50', 'Why is <b>diamond</b> very hard?',
  ['Each carbon atom is covalently bonded to four others in a rigid giant structure', 'It has layers that slide over each other', 'It is made of small C₆₀ molecules', 'It has delocalised electrons'],
  'Four strong covalent bonds per atom in a 3D network make diamond extremely hard.');
M('C1.50', 'Why does <b>graphite</b> conduct electricity?',
  ['Each carbon atom is bonded to only three others, leaving delocalised electrons that can move', 'It contains ions that can move', 'Its layers slide over each other', 'It has weak intermolecular forces'],
  'The delocalised electrons move between and along the layers.');
M('C1.50', 'Why is graphite soft and slippery?',
  ['Its layers are held together by weak forces, so they slide over each other', 'Its covalent bonds are weak', 'It is made of small molecules', 'It contains ions'],
  'Bonds within each layer are strong, but the forces between layers are weak.');
M('C1.50', 'Which form of carbon is made of simple molecules?',
  ['C₆₀ fullerene', 'Diamond', 'Graphite', 'All of them'],
  'C₆₀ is a simple molecule, so it has a much lower melting point than diamond or graphite, which are giant structures.');
T('C1.51', 'Covalent compounds usually do not conduct electricity.', true,
  'True. They have no ions or free electrons to carry charge. (Graphite is the exception you need to know, but it is an element.)');
