// Physics Long Answer Practice — question bank.
// Shared by index.html (questions) and learned.html (learning bank).
// Each question gets a stable id from its topic and title, used for saving answers.
// Don't change a question's title once students have answered it, or its saved answers will be orphaned.

const ENERGY = [
  {
    title: "Energy stores and conservation of energy",
    spec: "4.2, 4.3",
    marks: 5,
    question: `<p>A student holds a rubber ball above the floor and drops it. The ball bounces, but each bounce is lower than the one before.</p>
      <p class="ask">Describe the energy transfers from when the ball is dropped to when it reaches the top of its first bounce. Explain why the ball does not return to its starting height.</p>`,
    guide: [
      "Energy stores you can use: <b>chemical, kinetic, gravitational, elastic, thermal, magnetic, electrostatic, nuclear</b>.",
      "Ways energy is transferred: <b>mechanically, electrically, by heating, by radiation</b> (light and sound).",
      "Go in order: falling → hitting the floor → rising again. Name the store that is emptying and the one that is filling at each stage.",
      "<b>Conservation of energy:</b> energy cannot be created or destroyed, only transferred between stores.",
      "Never say energy is “lost” or “used up”. Say where it goes."
    ],
    scheme: [
      ["1", "As it falls: energy in the <b>gravitational</b> store decreases and energy in the <b>kinetic</b> store increases", 1],
      ["2", "On hitting the floor: energy transferred to the <b>elastic</b> store as the ball squashes / deforms", 1],
      ["3", "As it rises: elastic → kinetic → gravitational store", 1],
      ["4", "At the top of the bounce the kinetic store is (momentarily) empty / ball is (momentarily) stationary", 1],
      ["5", "On impact, energy is transferred to the <b>thermal</b> store of the ball / floor (by heating)", 1],
      ["6", "Energy is transferred away by <b>sound</b> when the ball hits the floor", 1],
      ["7", "<b>Air resistance</b> does work on the ball, transferring energy to the thermal store of the air", 1],
      ["8", "Total energy is conserved, so <b>less energy ends up in the gravitational store</b>, so the ball reaches a lower height", 1]
    ],
    max: 5,
    maxText: "Any 5 from 8",
    notes: [
      "MP1: <b>allow</b> GPE / gravitational potential energy and KE. <b>Reject</b> “potential energy” on its own.",
      "MP2: <b>allow</b> elastic potential energy / strain energy.",
      "MP5–7: <b>allow</b> “wasted / dissipated as heat or sound” for one mark only if no store or pathway is named.",
      "MP7: <b>allow</b> “friction with the air”. <b>Reject</b> “friction” on its own.",
      "MP8: <b>reject</b> “energy is lost” / “energy is used up” / “energy is destroyed”. <b>Allow</b> “energy is wasted / dissipated” if it says where it goes.",
      "MP8: must link the smaller gravitational store to the lower height.",
      "<b>Max 4</b> if the answer doesn't explain why the bounce is lower (no MP5–8).",
      "<b>Ignore</b> “energy turns into…”. Transfer between stores is the expected language, but it isn't penalised."
    ],
    tip: "The examiner wants a chain of named stores in the right order. Writing “potential energy turns into energy” scores nothing."
  },

  {
    title: "Efficiency of lamps",
    spec: "4.4, 4.5",
    marks: 6,
    question: `<p>Every second, a filament lamp is supplied with 60 J of electrical energy. It transfers 6 J of this energy as light.</p>
      <p class="part"><span class="ask">(a) Calculate the efficiency of the filament lamp.</span> <span class="sum">(2)</span></p>
      <p class="part"><span class="ask">(b) State what happens to the rest of the energy supplied to the lamp.</span> <span class="sum">(1)</span></p>
      <p class="part">An LED lamp gives out the same amount of light (6 J every second) but is supplied with only 8 J of electrical energy every second.</p>
      <p class="part"><span class="ask">(c) Explain, using efficiency, why replacing filament lamps with LED lamps is better.</span> <span class="sum">(3)</span></p>`,
    guide: [
      "<b>efficiency = (useful energy output ÷ total energy supplied) × 100%</b>",
      "Efficiency has no units. It's a percentage (or a decimal less than 1).",
      "Useful energy is the energy transferred the way you <b>want</b>. For a lamp, that's light.",
      "Conservation of energy: useful + wasted = total supplied.",
      "For (c), you need a number <b>and</b> a consequence. Think about what a household or power station would notice."
    ],
    scheme: [
      ["a1", "Substitution: (6 ÷ 60) × 100", 1, "a"],
      ["a2", "<b>10%</b> (or 0.1)", 1, "a"],
      ["b1", "(54 J) transferred to the <b>thermal store</b> of the surroundings / wasted by <b>heating</b> the surroundings", 1, "b"],
      ["c1", "LED efficiency = (6 ÷ 8) × 100 = <b>75%</b>", 1, "c"],
      ["c2", "LED wastes 2 J per second compared with 54 J for the filament lamp", 1, "c"],
      ["c3", "LED is more efficient so <b>less energy is wasted</b> (as heat)", 1, "c"],
      ["c4", "<b>Less energy needs to be supplied</b> for the same light output", 1, "c"],
      ["c5", "so <b>lower electricity bills</b> / cheaper to run", 1, "c"],
      ["c6", "<b>less fuel burned</b> in power stations / less CO₂ released / fossil fuels last longer", 1, "c"]
    ],
    groups: { a: 2, b: 1, c: 3 },
    max: 6,
    maxText: "Total 6 · (c) any 3 from 6",
    notes: [
      "(a) Correct answer with no working scores <b>2 marks</b>.",
      "(a) <b>Reject</b> 10 with a unit such as J or W. <b>Reject</b> 1000% (inverted) — scores 0.",
      "(b) <b>Allow</b> “heat”, “wasted as thermal energy”. <b>Ignore</b> “lost” if heating is given. <b>Reject</b> “lost” on its own.",
      "c1: <b>allow</b> 0.75.",
      "c3: “LED is more efficient” on its own is not enough. The consequence (less wasted) is needed.",
      "<b>Max 2</b> in (c) if no efficiency value or energy comparison is given (no c1 or c2).",
      "<b>Allow</b> “LED doesn't get as hot, so lasts longer / is safer” as an extra creditworthy point in (c).",
      "<b>Ignore</b> “LEDs are brighter” — the light output is the same."
    ],
    tip: "“Better because it's more efficient” is a restatement, not an explanation. Always say what higher efficiency means in practice."
  },

  {
    title: "Reducing energy transfer: the vacuum flask",
    spec: "4.6, 4.10",
    marks: 6,
    question: `<p>A vacuum flask keeps hot drinks hot. It has a double-walled glass bottle with a vacuum between the walls. The inner surfaces of the walls are silvered (shiny). The flask is closed with a plastic stopper.</p>
      <p class="ask">Explain how the features of the vacuum flask reduce the transfer of thermal energy from the hot drink.</p>`,
    guide: [
      "Thermal energy is transferred by <b>conduction</b>, <b>convection</b> and <b>radiation</b>. Each feature reduces at least one of these.",
      "For every feature: name it, say <b>which</b> transfer it reduces, and explain <b>how</b>.",
      "Conduction and convection both need particles. What is in a vacuum?",
      "Radiation (infrared) doesn't need particles, so the vacuum can't stop it. Which feature deals with radiation?",
      "Don't forget the stopper — think about both the material and what it stops leaving the top of the flask."
    ],
    scheme: [
      ["1", "Vacuum: there are <b>no particles</b> (between the walls)", 1],
      ["2", "so <b>no conduction or convection</b> across the gap", 1],
      ["3", "Silvered surfaces are <b>poor emitters</b> / <b>reflect</b> infrared radiation (back towards the drink)", 1],
      ["4", "so energy transfer by <b>radiation</b> is reduced", 1],
      ["5", "Stopper is made of plastic, which is a <b>poor conductor / insulator</b>, reducing conduction", 1],
      ["6", "Stopper stops <b>convection</b> currents / hot air (or vapour) escaping from the top", 1],
      ["7", "Glass is a poor conductor / the bottle is held on insulating supports, reducing conduction", 1],
      ["8", "<b>Air trapped</b> between the outer case and the bottle is a poor conductor (and can't move, so no convection)", 1],
      ["9", "Stopper reduces <b>evaporation</b>, which would cool the drink", 1]
    ],
    max: 6,
    maxText: "Any 6 from 9",
    notes: [
      "MP2: <b>reject</b> “the vacuum stops radiation” — this loses MP2.",
      "MP3: <b>reject</b> “shiny surfaces absorb heat” or “reflect heat” without infrared/radiation. <b>Allow</b> “reflect heat radiation”.",
      "MP4 can only be awarded if radiation is linked to the silvered surfaces.",
      "MP5: <b>reject</b> “plastic keeps the heat in” without the poor conductor idea.",
      "MP6: <b>reject</b> “heat rises”. It must be hot air / particles that rise or escape.",
      "<b>Reject</b> “stops the cold getting in” anywhere — energy moves from hot to cold.",
      "Points must be linked to the correct feature. “Reduces conduction, convection and radiation” with no features scores 0."
    ],
    tip: "The vacuum stops conduction and convection only. Radiation can cross a vacuum — that's how the Sun heats the Earth. Mixing this up is the most common lost mark."
  },

  {
    title: "Convection in a room",
    spec: "4.6, 4.7",
    marks: 4,
    question: `<p>A room is heated by a heater placed near the floor on one side of the room.</p>
      <p class="ask">Explain how the whole room is heated by convection.</p>`,
    guide: [
      "Convection happens in <b>fluids</b> (liquids and gases), because their particles can move from place to place.",
      "Start with the air right next to the heater. What happens to its particles when they gain energy?",
      "Link the particles' spacing to the <b>density</b> of the air.",
      "What happens to warm air and cooler air — and what replaces the air that moves away?",
      "Finish with the name of the overall pattern of moving air."
    ],
    scheme: [
      ["1", "Air near the heater is warmed: particles <b>gain (kinetic) energy</b> / move faster and <b>move further apart</b> / the air expands", 1],
      ["2", "so the warm air becomes <b>less dense</b>", 1],
      ["3", "Warm air <b>rises</b>", 1],
      ["4", "Warm air spreads out across the ceiling (to the far side of the room)", 1],
      ["5", "Air <b>cools</b>, becomes <b>denser</b> and <b>sinks</b>", 1],
      ["6", "Cooler air moves along the floor towards the heater to <b>replace</b> the rising warm air", 1],
      ["7", "and is heated in turn, setting up a <b>convection current</b> that circulates around the room", 1],
      ["8", "Heater is near the floor so the cold air, which sinks to the floor, is heated", 1]
    ],
    max: 4,
    maxText: "Any 4 from 8",
    notes: [
      "MP1: <b>reject</b> “particles expand” / “particles get bigger” — this loses MP1.",
      "MP2: <b>reject</b> “particles become less dense”. It's the air that is less dense.",
      "MP3: <b>reject</b> “heat rises”.",
      "MP5: “denser” or “sinks” alone is enough if cooling is implied.",
      "MP7: <b>allow</b> a correctly drawn diagram with arrows showing the circulation.",
      "<b>Max 3</b> if density is never mentioned (no MP2 or MP5).",
      "<b>Ignore</b> references to conduction or radiation from the heater."
    ],
    tip: "“Heat rises” scores nothing. Heat is energy, not a substance. It's the warm, less dense air that rises."
  },

  {
    title: "Practical: emission of infrared radiation",
    spec: "4.8, 4.9",
    marks: 6,
    question: `<p>A Leslie cube is a hollow metal cube. Each of its four vertical faces has a different surface: matt black, shiny black, matt white and shiny silver.</p>
      <p class="ask">Describe how a Leslie cube can be used to investigate how the type of surface affects how much infrared radiation it emits. Include the results you would expect.</p>`,
    guide: [
      "Hot objects emit infrared radiation. The <b>hotter</b> the object, the more it emits.",
      "The cube needs to be hot, and every face must start at the <b>same temperature</b>. How do you do that?",
      "What can detect infrared radiation and give you a number?",
      "Think about what must stay the same for each face, so the only difference is the surface. Distance is a big one.",
      "Finish with a prediction: which surface is the best emitter, and which is the worst?"
    ],
    scheme: [
      ["1", "Fill the Leslie cube with <b>hot water</b> (e.g. from a kettle)", 1, "m"],
      ["2", "Place an <b>infrared detector</b> / thermometer with a blackened bulb facing one surface", 1, "m"],
      ["3", "Keep the detector the <b>same distance</b> from each face", 1, "m"],
      ["4", "Take a reading for <b>each</b> surface (quickly / at the same time after filling, so the water temperature is the same)", 1, "m"],
      ["5", "<b>Repeat</b> and calculate a <b>mean</b> for each surface", 1, "m"],
      ["6", "Use the <b>same detector</b> for every surface", 1, "m"],
      ["7", "Wait for the reading to <b>stabilise</b> before recording it", 1, "m"],
      ["8", "<b>Matt black</b> is the best emitter (highest reading)", 1, "r"],
      ["9", "<b>Shiny silver</b> is the worst emitter (lowest reading)", 1, "r"],
      ["10", "Dark / matt surfaces emit more than light / shiny surfaces", 1, "r"]
    ],
    groups: { m: 5, r: 2 },
    max: 6,
    maxText: "Any 6 from 10 · max 5 for method, max 2 for results",
    notes: [
      "MP2: <b>allow</b> IR sensor, IR thermometer, thermopile, data logger with IR sensor. <b>Reject</b> “a thermometer inside the cube”.",
      "MP3: <b>reject</b> “same position” without the distance idea.",
      "MP4: <b>allow</b> “use a stirrer / check the water temperature before each reading”.",
      "MP5: “repeat” without “mean” gets <b>no credit</b>.",
      "MP8 and MP9: <b>allow</b> “dark/dull” for matt black and “light/shiny” for shiny silver.",
      "MP10 cannot be awarded as well as both MP8 and MP9.",
      "<b>Alternative method:</b> identical cans with different surfaces, filled with the same volume of water at the same starting temperature; measure temperature drop over the same time. Allow MP1–5 for an equivalent step in this method; the can that cools fastest is the best emitter.",
      "<b>Ignore</b> safety points unless they replace a missing step."
    ],
    tip: "Students usually lose marks on controls. Say exactly what stays the same: the distance to each face and the water temperature."
  },

  {
    title: "Insulating a house",
    spec: "4.6, 4.10",
    marks: 6,
    question: `<p>Energy is transferred from a warm house to the cold air outside.</p>
      <p class="ask">Describe three ways of reducing the transfer of energy from a house. For each one, explain how it reduces energy transfer.</p>`,
    guide: [
      "Three methods × 2 marks: <b>1 for the method</b> (say where it goes), <b>1 for how it works</b>.",
      "The explanation must name the type of transfer reduced: <b>conduction</b>, <b>convection</b> or <b>radiation</b>.",
      "Many insulators work by <b>trapping air</b>. Air is a poor conductor — but only if it can't move around.",
      "Think about the roof, the walls, the windows and the doors.",
      "Only your first three methods will be marked."
    ],
    scheme: [
      ["1a", "First method: named and located", 1],
      ["1b", "First method: how it reduces energy transfer", 1],
      ["2a", "Second method: named and located", 1],
      ["2b", "Second method: how it reduces energy transfer", 1],
      ["3a", "Third method: named and located", 1],
      ["3b", "Third method: how it reduces energy transfer", 1]
    ],
    max: 6,
    maxText: "Total 6",
    subTable: {
      heading: "Acceptable methods and explanations",
      rows: [
        ["Loft insulation", "Fibreglass / wool laid in the loft", "Traps air (a poor conductor) so reduces conduction; air can't move so convection is reduced"],
        ["Cavity wall insulation", "Foam / beads injected into the gap between walls", "Traps air in small pockets, stopping convection currents in the cavity; foam and trapped air are poor conductors"],
        ["Double glazing", "Two panes of glass with a gap", "Air / gas / vacuum in the gap is a poor conductor, reducing conduction"],
        ["Draught excluders", "Strips around doors and windows", "Stop warm air escaping / cold air entering, reducing convection"],
        ["Curtains / thick carpets", "At windows / on floors", "Trap a layer of air, reducing conduction (and convection)"],
        ["Foil behind radiators", "Shiny foil on the wall", "Reflects infrared radiation back into the room"]
      ]
    },
    notes: [
      "Only mark the <b>first three</b> methods.",
      "An explanation (b) can only be awarded if it matches a correct method (a).",
      "<b>Reject</b> “keeps the cold out” — energy moves out, cold doesn't move in.",
      "<b>Reject</b> “insulation absorbs the heat”.",
      "<b>Reject</b> “air is a good insulator” on its own — the air must be <b>trapped</b> for convection to be reduced. <b>Allow</b> “air is a poor conductor” for conduction.",
      "<b>Ignore</b> double glazing explained as “two layers so it's thicker”. That isn't the main reason."
    ],
    tip: "Trapped air is the answer behind almost every insulation question. Say that it's trapped, and say whether that reduces conduction, convection or both."
  },

  {
    title: "Work done and power",
    spec: "4.11, 4.12, 4.16, 4.17",
    marks: 5,
    question: `<p>A student pushes a heavy box 12 m across a floor. She uses a constant force of 150 N. It takes her 20 s.</p>
      <p class="part"><span class="ask">(a) Calculate the work done by the student.</span> <span class="sum">(2)</span></p>
      <p class="part"><span class="ask">(b) Calculate the power of the student.</span> <span class="sum">(2)</span></p>
      <p class="part"><span class="ask">(c) State what is meant by power.</span> <span class="sum">(1)</span></p>`,
    guide: [
      "<b>work done = force × distance moved</b> in the direction of the force &nbsp;(W = F × d)",
      "<b>power = work done ÷ time taken</b> &nbsp;(P = W ÷ t)",
      "Work done is the same as <b>energy transferred</b>, so it's measured in joules (J).",
      "Power is measured in watts (W). 1 W = 1 J/s.",
      "Show the equation, the substitution and the answer with units."
    ],
    scheme: [
      ["a1", "Substitution: W = 150 × 12", 1],
      ["a2", "W = <b>1800 J</b>", 1],
      ["b1", "Substitution: P = 1800 ÷ 20", 1],
      ["b2", "P = <b>90 W</b>", 1],
      ["c1", "Power is the <b>rate</b> of doing work / energy transferred <b>per second</b>", 1]
    ],
    max: 5,
    maxText: "Total 5",
    notes: [
      "(a) and (b): correct answer with no working scores full marks.",
      "(a) <b>Allow</b> 1.8 kJ. Wrong or missing unit: max 1.",
      "(b) <b>Allow</b> error carried forward from (a): their (a) ÷ 20, correctly evaluated, scores 2.",
      "(b) <b>Allow</b> J/s.",
      "(c) <b>Reject</b> “how much energy something has” / “how strong something is” / “how fast it does work” without the rate idea. <b>Allow</b> “work done ÷ time” or “energy transferred per unit time”."
    ],
    tip: "If you get a part wrong, you can still get full marks on the next part by using your wrong answer correctly. Never leave a later part blank."
  },

  {
    title: "Gravitational and kinetic energy: the diver",
    spec: "4.13, 4.14, 4.15",
    marks: 6,
    question: `<p>A diver of mass 60 kg climbs to a diving board 10 m above the water.</p>
      <p>Gravitational field strength, g = 10 N/kg.</p>
      <p class="part"><span class="ask">(a) Calculate the gravitational potential energy gained by the diver.</span> <span class="sum">(2)</span></p>
      <p class="part"><span class="ask">(b) The diver falls from the board into the water. Assume there is no air resistance. Calculate the diver's speed as she enters the water.</span> <span class="sum">(3)</span></p>
      <p class="part"><span class="ask">(c) Explain why her real speed will be lower than your answer to (b).</span> <span class="sum">(1)</span></p>`,
    guide: [
      "<b>GPE = mass × gravitational field strength × height</b> &nbsp;(GPE = m × g × h)",
      "<b>KE = ½ × mass × speed²</b> &nbsp;(KE = ½ × m × v²)",
      "Conservation of energy: if no energy is wasted, all the energy from the gravitational store goes into the kinetic store.",
      "Rearranging KE = ½mv² for v: multiply by 2, divide by m, then <b>square root</b>. Don't forget the last step.",
      "For (c), think about what the assumption in (b) ignored."
    ],
    scheme: [
      ["a1", "Substitution: GPE = 60 × 10 × 10", 1],
      ["a2", "GPE = <b>6000 J</b>", 1],
      ["b1", "KE gained = GPE lost = 6000 J", 1],
      ["b2", "Rearrangement/substitution: v² = (2 × 6000) ÷ 60 (= 200)", 1],
      ["b3", "v = <b>14 m/s</b> (14.1 m/s)", 1],
      ["c1", "<b>Air resistance</b> does work against her / some energy is transferred to the <b>thermal store</b> of the surroundings, so less goes into her kinetic store", 1]
    ],
    max: 6,
    maxText: "Total 6",
    notes: [
      "(a) Correct answer with no working scores <b>2 marks</b>. <b>Allow</b> 6 kJ.",
      "(b) Correct answer with no working scores <b>3 marks</b>.",
      "(b) 200 m/s (no square root) scores <b>2 marks</b>.",
      "(b) 100 m/s or 10 m/s (½ forgotten) scores <b>b1 only</b>.",
      "(b) <b>Allow</b> error carried forward from (a).",
      "(c) <b>Reject</b> “energy is lost” without saying where. <b>Reject</b> “friction” on its own — must be with the air."
    ],
    tip: "In a GPE → KE question, the mass cancels out if you rearrange carefully — but in the exam, just follow the steps. The square root is the step most often forgotten."
  }
];

const WAVES = [
  {
    title: "Transverse and longitudinal waves",
    spec: "3.2, 3.4, 3.14, 3.23",
    marks: 4,
    question: `<p>Light and sound are both waves.</p>
      <p class="ask">Explain the difference between transverse and longitudinal waves. Use light and sound as examples in your answer.</p>`,
    guide: [
      "You need to say which type each wave is: light and sound are <b>not</b> the same type.",
      "The key idea is the <b>direction of the vibrations</b> compared with the <b>direction the wave travels</b> (the direction energy is transferred).",
      "“Up and down” or “side to side” on their own won't score. Always compare to the direction of travel.",
      "One type of wave has special names for the regions where particles are squashed together and spread apart. Use them."
    ],
    scheme: [
      ["1", "Light is <b>transverse</b> <b>and</b> sound is <b>longitudinal</b>", 1],
      ["2", "Transverse: vibrations/oscillations are <b>perpendicular</b> (at right angles) to the direction of wave travel / energy transfer", 1],
      ["3", "Longitudinal: vibrations/oscillations are <b>parallel</b> to the direction of wave travel / energy transfer", 1],
      ["4", "Longitudinal waves have <b>compressions</b> and <b>rarefactions</b>", 1],
      ["5", "Both transfer <b>energy</b> (and information) <b>without transferring matter</b>", 1],
      ["6", "Transverse waves have <b>peaks (crests) and troughs</b>", 1],
      ["7", "Sound needs a <b>medium</b> (particles) to travel through; light can travel through a <b>vacuum</b>", 1],
      ["8", "A correct further example: other transverse waves (e.g. any EM wave, water ripples) or longitudinal waves (e.g. ultrasound)", 1]
    ],
    max: 4,
    maxText: "Any 4 from 8",
    notes: [
      "MP1: both needed for the mark.",
      "MP2/MP3: <b>reject</b> “up and down” / “side to side” / “back and forth” with no reference to the direction of travel.",
      "MP2/MP3: <b>allow</b> a correctly labelled diagram for either point.",
      "MP4: both terms needed. <b>Ignore</b> incorrect spelling if the meaning is clear.",
      "<b>Reject</b> “particles travel along with the wave” — this contradicts MP5 and loses MP5.",
      "<b>Max 2</b> if neither MP2 nor MP3 is awarded — the direction comparison is the core of the question.",
      "MP8: <b>reject</b> “sound waves are transverse” or any EM wave given as longitudinal."
    ],
    tip: "Most students get MP1 and then write “transverse goes up and down, longitudinal goes side to side”, which scores nothing more. The comparison with the direction of travel is the whole point."
  },

  {
    title: "Wave speed, frequency and period",
    spec: "3.1, 3.5, 3.6, 3.7",
    marks: 5,
    question: `<p>A radio station broadcasts radio waves with a frequency of 98.0 MHz.</p>
      <p>The speed of electromagnetic waves is 3.0 × 10<sup>8</sup> m/s.</p>
      <p class="part"><span class="ask">(a) Calculate the wavelength of the radio waves.</span> <span class="sum">(3)</span></p>
      <p class="part"><span class="ask">(b) Calculate the time period of the radio waves.</span> <span class="sum">(2)</span></p>`,
    guide: [
      "Write the equation first, then rearrange, then substitute. Each step can earn a mark even if your final answer is wrong.",
      "<b>wave speed = frequency × wavelength</b> &nbsp;(v = f × λ)",
      "<b>frequency = 1 ÷ time period</b> &nbsp;(f = 1/T)",
      "Check your prefixes: <b>M</b> means mega = × 10<sup>6</sup>. Convert to Hz before you substitute.",
      "Give units with your answer: m for wavelength, s for time period."
    ],
    scheme: [
      ["a1", "Rearrangement: λ = v ÷ f", 1],
      ["a2", "Substitution with frequency in Hz: λ = 3.0 × 10<sup>8</sup> ÷ 98.0 × 10<sup>6</sup>", 1],
      ["a3", "λ = <b>3.1 m</b> (3.06 m)", 1],
      ["b1", "Substitution: T = 1 ÷ 98.0 × 10<sup>6</sup>", 1],
      ["b2", "T = <b>1.0 × 10<sup>−8</sup> s</b> (1.02 × 10<sup>−8</sup> s)", 1]
    ],
    max: 5,
    maxText: "Total 5",
    notes: [
      "(a) Correct answer with no working scores <b>3 marks</b>.",
      "(a) <b>Allow</b> any answer that rounds to 3.1 m (e.g. 3.06, 3.061).",
      "(a) 3.06 × 10<sup>6</sup> m or 3.06 × 10<sup>−6</sup> m (MHz not converted, or converted wrongly) scores <b>a1 only</b>.",
      "(a) Missing or wrong unit: <b>max 2</b>.",
      "(b) Correct answer with no working scores <b>2 marks</b>.",
      "(b) <b>Allow</b> error carried forward from a wrong frequency conversion for b2 only (e.g. 1.02 × 10<sup>−2</sup> s scores 1).",
      "(b) <b>Allow</b> T = λ ÷ v as an alternative method using their answer to (a)."
    ],
    tip: "The MHz conversion is where this question is designed to catch you. If your wavelength is millions of metres or millionths of a metre, check your prefix."
  },

  {
    title: "The Doppler effect",
    spec: "3.8",
    marks: 4,
    question: `<p>An ambulance with its siren on drives past a person standing on the pavement. As the ambulance comes towards the person, the siren sounds higher-pitched. As it moves away, the siren sounds lower-pitched. The siren's own frequency never changes.</p>
      <p class="ask">Explain why the person hears a change in pitch.</p>`,
    guide: [
      "<b>Doppler effect:</b> a change in the observed frequency and wavelength of a wave when its source moves relative to an observer.",
      "Pitch depends on <b>frequency</b>. Your answer must talk about frequency, not just pitch.",
      "Picture the wavefronts leaving the siren. What happens to the gaps between them in front of and behind the ambulance?",
      "The <b>speed of sound in air stays the same</b>. Use v = f × λ to link wavelength to frequency.",
      "Cover both directions: approaching <b>and</b> moving away."
    ],
    scheme: [
      ["1", "(When approaching) wavefronts are bunched up / closer together in front of the ambulance", 1],
      ["2", "so the (observed) <b>wavelength is shorter</b>", 1],
      ["3", "speed of sound is unchanged, so the (observed) <b>frequency is higher</b>", 1],
      ["4", "<b>More waves</b> reach the person <b>per second</b> when the ambulance approaches", 1],
      ["5", "(When moving away) wavefronts are spread out / <b>wavelength is longer</b>", 1],
      ["6", "so the observed <b>frequency is lower</b> / fewer waves reach the person per second", 1],
      ["7", "The frequency of the siren itself does not change; only the <b>observed</b> frequency changes", 1],
      ["8", "The <b>faster</b> the ambulance moves, the bigger the change in frequency", 1]
    ],
    max: 4,
    maxText: "Any 4 from 8",
    notes: [
      "MP1: <b>allow</b> “each wave is emitted closer to the observer than the last”.",
      "MP3: <b>reject</b> “the sound waves travel faster”. This is the most common error. It loses MP3.",
      "MP3/MP6: “higher/lower pitch” on its own gets <b>no credit</b>, because it repeats the question. It must say frequency.",
      "<b>Reject</b> “the siren changes frequency” / “the ambulance makes a different sound”. It contradicts the question and loses MP7.",
      "<b>Max 3</b> if only one direction (approaching <b>or</b> moving away) is explained.",
      "<b>Reject</b> amplitude or loudness linked to pitch.",
      "<b>Ignore</b> any reference to the person moving."
    ],
    tip: "The top answers give the full chain: wavefronts → wavelength → frequency. Students who jump straight from “ambulance moving” to “higher frequency” usually get 1 or 2 marks."
  },

  {
    title: "Uses of electromagnetic waves",
    spec: "3.10, 3.11, 3.12",
    marks: 6,
    question: `<p>Electromagnetic waves are used in homes, hospitals and communications.</p>
      <p class="ask">Choose three different types of electromagnetic wave. For each one, describe a use and explain why that type of wave is suitable for the use.</p>`,
    guide: [
      "Order of the EM spectrum (decreasing wavelength, increasing frequency): <b>radio, microwave, infrared, visible, ultraviolet, X-ray, gamma</b>.",
      "Each wave type is worth 2 marks: <b>1 for the use, 1 for why it works</b>. A use with no reason caps you at 3/6.",
      "The “why” is about what the wave <b>does</b>: what it passes through, what absorbs it, what it heats, what it kills.",
      "Pick three types you're confident about. Only your first three will be marked.",
      "Be specific: “medical uses” won't score, “seeing broken bones” will."
    ],
    scheme: [
      ["1a", "First type: a correct, specific use", 1],
      ["1b", "First type: a correct reason it is suitable", 1],
      ["2a", "Second type: a correct, specific use", 1],
      ["2b", "Second type: a correct reason it is suitable", 1],
      ["3a", "Third type: a correct, specific use", 1],
      ["3b", "Third type: a correct reason it is suitable", 1]
    ],
    max: 6,
    maxText: "Total 6",
    subTable: {
      heading: "Acceptable uses and reasons",
      rows: [
        ["Radio", "Broadcasting (TV/radio), communications", "Long wavelength, so it travels long distances / diffracts around hills and buildings"],
        ["Microwaves", "Cooking", "Absorbed by water (molecules) in food, which heats it"],
        ["Microwaves", "Satellite transmissions / communication", "Pass through the atmosphere"],
        ["Infrared", "Heaters / grills / toasters", "Absorbed by objects and heats them / transfers thermal energy"],
        ["Infrared", "Night-vision equipment", "Warm objects (people, animals) emit infrared, which can be detected"],
        ["Visible", "Optical fibres", "Total internal reflection carries light along the fibre"],
        ["Visible", "Photography", "Detected by the camera sensor / film (and our eyes)"],
        ["Ultraviolet", "Fluorescent lamps", "Absorbed by the coating and re-emitted as visible light"],
        ["X-ray", "Seeing inside the body / broken bones / airport security", "Pass through soft tissue (less dense material) but are absorbed by bone (denser material)"],
        ["Gamma", "Sterilising food / medical equipment", "Kills bacteria / microorganisms"]
      ]
    },
    notes: [
      "Only mark the <b>first three</b> wave types given.",
      "A reason (b) can only be awarded if it matches a correct use (a) for the same wave type.",
      "<b>Reject</b> vague uses: “medical”, “communication” (for anything other than radio/microwave), “heating” for microwaves without food/cooking.",
      "<b>Reject</b> “X-rays go through skin” on its own: the contrast with bone is needed for the reason.",
      "<b>Reject</b> “gamma rays clean equipment”. Kills bacteria/microorganisms is needed.",
      "<b>Ignore</b> statements about dangers. They're not asked for, and they don't lose marks.",
      "Two uses for the <b>same</b> wave type count as one type only."
    ],
    tip: "This is easy marks if you give a reason every time. Students lose half the marks by listing uses and never explaining them."
  },

  {
    title: "Dangers of electromagnetic waves",
    spec: "3.13",
    marks: 6,
    question: `<p>Too much exposure to some types of electromagnetic radiation can harm the human body.</p>
      <p class="ask">Describe the harmful effect of microwaves, ultraviolet and gamma rays on the body. For each one, describe a way people can protect themselves.</p>`,
    guide: [
      "Three types × 2 marks each: <b>1 for the harmful effect, 1 for a protective measure</b>.",
      "Each wave type does a <b>different</b> kind of damage. Think about where it acts: inside the body, at the surface, or in cells' DNA.",
      "“It's dangerous” or “it gives you radiation” won't score. Name the actual effect.",
      "Protection should be practical and specific: what would a person actually <b>do</b> or <b>use</b>?"
    ],
    scheme: [
      ["1", "Microwaves: <b>internal heating</b> of body tissue", 1],
      ["2", "Microwaves: metal mesh / casing on microwave ovens / don't use an oven with a damaged door / limit time near strong sources", 1],
      ["3", "Ultraviolet: damage to <b>surface cells</b> / skin cancer / sunburn / <b>blindness</b> / eye damage", 1],
      ["4", "Ultraviolet: sun cream / sunscreen / sunglasses / cover skin / limit time in the sun", 1],
      ["5", "Gamma: <b>cancer</b> / <b>mutation</b> / damage to DNA or cells", 1],
      ["6", "Gamma: <b>lead</b> shielding / thick concrete / limit exposure time / keep a distance / handle sources with tongs", 1]
    ],
    max: 6,
    maxText: "Total 6",
    notes: [
      "MP1: <b>reject</b> “cancer” or “burns the skin” for microwaves.",
      "MP2: <b>ignore</b> “don't stand near a microwave” unless it's linked to limiting exposure or a damaged oven.",
      "MP3: <b>allow</b> premature skin ageing. <b>Reject</b> “causes infrared burns”.",
      "MP4: <b>reject</b> “stay indoors forever” / “don't go outside”. It must be a reasonable precaution.",
      "MP5: <b>reject</b> “radiation poisoning” on its own.",
      "MP6: <b>reject</b> a film badge or dosimeter. It <b>monitors</b> exposure, it doesn't protect.",
      "MP6: <b>reject</b> “wear protective clothing” without saying lead.",
      "Effects and protection given for the wrong wave type score 0."
    ],
    tip: "Learn the spec's exact pairs: microwaves → internal heating, infrared → skin burns, UV → surface cells and blindness, gamma → cancer and mutation. Examiners look for those words."
  },

  {
    title: "Practical: refractive index of a glass block",
    spec: "3.17, 3.18, 3.19",
    marks: 6,
    question: `<p>A student has a rectangular glass block, a ray box, a protractor, a sheet of paper and a pencil.</p>
      <p class="ask">Describe how the student could use this equipment to find the refractive index of the glass.</p>`,
    guide: [
      "This is a <b>method</b> question. Write it in steps, as if someone else has to follow it.",
      "<b>refractive index = sin(angle of incidence) ÷ sin(angle of refraction)</b> &nbsp;(n = sin i / sin r)",
      "You need to measure both angles. Where are they measured from? (Hint: it's not the surface of the block.)",
      "How will you record where the ray went, so you can draw it after you move the block?",
      "One measurement isn't reliable. What would you do to improve the result, and how do you get a final value of n?"
    ],
    scheme: [
      ["1", "Place the block on the paper and <b>draw around</b> it", 1],
      ["2", "Shine a (narrow) ray of light into the block <b>at an angle</b> to one side", 1],
      ["3", "Mark the path of the ray entering and leaving the block (e.g. with crosses/dots), then remove the block and <b>join the points</b> to show the ray inside", 1],
      ["4", "Draw the <b>normal</b> where the ray enters the block", 1],
      ["5", "Use the protractor to measure the <b>angle of incidence (i)</b> and <b>angle of refraction (r)</b> from the normal", 1],
      ["6", "<b>Repeat</b> for several different angles of incidence", 1],
      ["7", "Calculate <b>n = sin i ÷ sin r</b> each time and find the <b>mean</b> / plot sin i against sin r and the gradient = n", 1],
      ["8", "Use a <b>narrow</b> ray of light (e.g. through a single slit)", 1],
      ["9", "Do the experiment in a <b>darkened room</b> so the ray is easy to see", 1],
      ["10", "Mark points on the ray <b>far apart</b> / use a sharp pencil, so the ray is drawn accurately", 1]
    ],
    max: 6,
    maxText: "Any 6 from 10",
    notes: [
      "MP2: <b>ignore</b> “shine light at the block” with no mention of an angle.",
      "MP4: <b>allow</b> “a line at 90° to the surface”. <b>Reject</b> “a line along the surface”.",
      "MP5: both angles needed. <b>Reject</b> angles measured from the surface of the block.",
      "MP6: <b>reject</b> “repeat the experiment” with no change of angle, unless a mean is calculated for the same angle — then allow MP6.",
      "MP7: the equation must be correct and used, not just stated. <b>Reject</b> n = i ÷ r (angles not sines).",
      "<b>Max 4</b> if the answer gives no way of calculating n (no MP7)."
    ],
    tip: "The normal is the most commonly missed mark. Both angles are always measured from the normal, never from the edge of the block."
  },

  {
    title: "Critical angle and optical fibres",
    spec: "3.20, 3.21, 3.22",
    marks: 5,
    question: `<p>Optical fibres are thin strands of glass used to carry information as pulses of light.</p>
      <p>The glass in an optical fibre has a refractive index of 1.5.</p>
      <p class="part"><span class="ask">(a) Calculate the critical angle of the glass.</span> <span class="sum">(2)</span></p>
      <p class="part"><span class="ask">(b) Explain how light is transmitted along the optical fibre.</span> <span class="sum">(3)</span></p>`,
    guide: [
      "<b>sin c = 1 ÷ n</b>, where c is the critical angle and n is the refractive index.",
      "To get c from sin c, use <b>sin<sup>−1</sup></b> on your calculator. Make sure it's in degrees mode.",
      "<b>Critical angle:</b> the angle of incidence at which the refracted ray travels along the boundary (angle of refraction = 90°).",
      "For (b), compare the angle the light hits the inside of the fibre with the critical angle. What happens when it's bigger?",
      "Use the full name of the process. “It reflects” on its own isn't enough."
    ],
    scheme: [
      ["a1", "Substitution: sin c = 1 ÷ 1.5 (= 0.67)", 1, "a"],
      ["a2", "c = <b>42°</b> (41.8°)", 1, "a"],
      ["b1", "Light hits the boundary / inside surface of the fibre at an angle (of incidence) <b>greater than the critical angle</b>", 1, "b"],
      ["b2", "so it undergoes <b>total internal reflection</b>", 1, "b"],
      ["b3", "This happens <b>repeatedly</b> along the fibre", 1, "b"],
      ["b4", "Light is travelling from glass to a less dense material (air / cladding) / from higher to lower refractive index", 1, "b"],
      ["b5", "<b>No light is refracted out</b>, so the signal is not lost / can travel long distances", 1, "b"],
      ["b6", "Light still follows the fibre when it is <b>bent / curved</b> (as long as the bend isn't too sharp)", 1, "b"]
    ],
    groups: { a: 2, b: 3 },
    max: 5,
    maxText: "Total 5 · (b) any 3 from 6",
    notes: [
      "(a) Correct answer with no working scores <b>2 marks</b>.",
      "(a) <b>Allow</b> 41.8° or any value rounding to 42°.",
      "(a) 0.67 given as the final answer (sin<sup>−1</sup> not taken) scores a1 only.",
      "(a) 0.73 (calculator in radians) scores a1 only.",
      "b1: <b>reject</b> “equal to the critical angle” or “bigger than 90°”.",
      "b1: <b>allow</b> “bigger than 42°” or their answer to (a).",
      "b2: <b>reject</b> “reflects off the walls/sides” without “total internal”.",
      "b3: <b>ignore</b> “bounces along the fibre” unless linked to total internal reflection in b2.",
      "<b>Max 2</b> in (b) if total internal reflection is never named (no b2)."
    ],
    tip: "Total internal reflection needs two conditions: going from a denser material to a less dense one (glass to air), and the angle being bigger than the critical angle. State the angle condition every time."
  },

  {
    title: "Refraction through a glass block",
    spec: "3.9, 3.14, 3.15, 3.16",
    marks: 4,
    question: `<p>A ray of light in air hits the side of a rectangular glass block at an angle of incidence of 40°. It passes through the block and comes out of the opposite side.</p>
      <p class="ask">Describe and explain what happens to the direction of the ray as it enters and leaves the block.</p>`,
    guide: [
      "<b>Refraction:</b> the change in direction of a wave when it crosses a boundary between two materials.",
      "Describe the direction using the <b>normal</b>: does the ray bend towards it or away from it?",
      "Explain using <b>speed</b>: what happens to the speed of light in glass compared with air?",
      "Cover both boundaries: going <b>in</b> and coming <b>out</b>.",
      "Think about the final direction of the ray compared with the ray that went in."
    ],
    scheme: [
      ["1", "On entering: the ray bends <b>towards the normal</b>", 1],
      ["2", "because light <b>slows down</b> in glass", 1],
      ["3", "On leaving: the ray bends <b>away from the normal</b> (because it speeds up)", 1],
      ["4", "The ray leaves <b>parallel</b> to the original ray (but displaced sideways)", 1],
      ["5", "Angle of refraction inside the glass is <b>less than 40°</b>", 1],
      ["6", "Ray leaves at <b>40°</b> to the normal / angle of emergence = angle of incidence", 1],
      ["7", "On entering, the <b>wavelength decreases</b> (frequency stays the same)", 1],
      ["8", "A ray travelling <b>along the normal</b> would not change direction", 1]
    ],
    max: 4,
    maxText: "Any 4 from 8",
    notes: [
      "MP1/MP3: <b>reject</b> “bends towards/away from the block” or “bends down/up”. It must be relative to the normal.",
      "MP5 and MP1 can both be awarded — one describes the bending, the other gives the angle.",
      "<b>Max 2</b> if there is no explanation in terms of speed (no MP2 and no speeding up in MP3).",
      "MP2: <b>allow</b> “glass is denser so light travels slower”. <b>Reject</b> “glass is denser” on its own.",
      "MP2: <b>reject</b> “light loses energy”.",
      "<b>Allow</b> a correctly drawn and labelled ray diagram for MP1, MP3 and MP4.",
      "<b>Ignore</b> references to wavelength or frequency unless incorrect. If frequency is said to change, lose MP2."
    ],
    tip: "“Bends” is never enough. Every direction statement in a refraction answer needs the words towards or away from the normal."
  }
];

const FORCES = [
  {
    title: "Velocity-time graphs: a car journey",
    spec: "1.6, 1.7, 1.8, 1.9",
    marks: 6,
    question: `<p>A car starts from rest and accelerates uniformly to 20 m/s in 8 s. It then travels at a constant 20 m/s for 12 s. It then decelerates uniformly and stops 5 s later.</p>
      <p class="part"><span class="ask">(a) Calculate the acceleration of the car during the first 8 s.</span> <span class="sum">(2)</span></p>
      <p class="part"><span class="ask">(b) Calculate the total distance travelled by the car.</span> <span class="sum">(4)</span></p>`,
    guide: [
      "<b>acceleration = change in velocity ÷ time taken</b> &nbsp;(a = (v − u) ÷ t)",
      "Sketch the velocity-time graph first: velocity on the y-axis, time on the x-axis. It will have three sections.",
      "On a velocity-time graph, the <b>gradient</b> gives the acceleration and the <b>area under the line</b> gives the distance travelled.",
      "Split the area into simple shapes. Area of a triangle = ½ × base × height.",
      "Units: acceleration in m/s², distance in m."
    ],
    scheme: [
      ["a1", "Substitution: a = (20 − 0) ÷ 8", 1, "a"],
      ["a2", "a = <b>2.5 m/s²</b>", 1, "a"],
      ["b1", "Distance while accelerating = ½ × 8 × 20 = <b>80 m</b>", 1, "b"],
      ["b2", "Distance at constant speed = 12 × 20 = <b>240 m</b>", 1, "b"],
      ["b3", "Distance while decelerating = ½ × 5 × 20 = <b>50 m</b>", 1, "b"],
      ["b4", "Total distance = <b>370 m</b>", 1, "b"]
    ],
    groups: { a: 2, b: 4 },
    max: 6,
    maxText: "Total 6",
    notes: [
      "(a) Correct answer with no working scores <b>2 marks</b>. Wrong or missing unit: max 1.",
      "(b) Correct answer with no working scores <b>4 marks</b>.",
      "(b) <b>Allow</b> the average-speed method for any section (e.g. average speed 10 m/s × 8 s = 80 m).",
      "(b) <b>Allow</b> the trapezium method: ½ × (25 + 12) × 20 = 370 m scores 4.",
      "(b) 500 m (20 × 25, treating the whole journey as constant speed) scores <b>b2 only</b> if 240 m is seen, otherwise 0.",
      "(b) <b>Allow</b> error carried forward for b4 if one section is wrong and the addition is correct."
    ],
    tip: "Draw the graph even if the question doesn't ask for it. It turns a wordy journey into three simple shapes."
  },

  {
    title: "Practical: investigating the motion of a toy car",
    spec: "1.4, 1.5",
    marks: 6,
    question: `<p>A student lets a toy car roll down a ramp. She wants to find out how the height of the ramp affects the average speed of the car.</p>
      <p class="ask">Describe how the student could carry out this investigation.</p>`,
    guide: [
      "<b>average speed = distance moved ÷ time taken</b>",
      "You need to say how to <b>measure</b> both the distance and the time, and with what equipment.",
      "What is the independent variable? How will you change it and measure it, and how many values will you use?",
      "Name the things you'd keep the same. “Keep it a fair test” scores nothing on its own.",
      "Timing by hand has a big error. Is there a better way, or a way to reduce the effect of the error?"
    ],
    scheme: [
      ["1", "Measure the <b>distance</b> the car travels (e.g. between two marks on the ramp) with a metre rule / tape measure", 1],
      ["2", "Measure the <b>time</b> taken with a stopwatch", 1],
      ["3", "Calculate average speed = <b>distance ÷ time</b>", 1],
      ["4", "Change the <b>height</b> of the ramp (e.g. by adding blocks/books) and measure it with a ruler; use at least <b>5</b> heights", 1],
      ["5", "Release the car from the <b>same starting point</b> each time / don't push the car", 1],
      ["6", "Keep the <b>same car</b>, ramp surface and distance each time", 1],
      ["7", "<b>Repeat</b> for each height and calculate a <b>mean</b>", 1],
      ["8", "Use <b>light gates</b> (and a data logger) or video to reduce timing errors from reaction time", 1]
    ],
    max: 6,
    maxText: "Any 6 from 8",
    notes: [
      "MP2: <b>allow</b> light gates or video analysis for MP2 as well as MP8.",
      "MP4: <b>reject</b> “change the height” with no method or number of values.",
      "MP6: <b>ignore</b> “same amount” / “fair test”. A specific variable must be named.",
      "MP7: “repeat” without “mean” gets <b>no credit</b>.",
      "<b>Allow</b> “plot a graph of average speed against height” as an extra creditworthy point in place of MP7."
    ],
    tip: "Practical method questions are marked on precision. Say what you measure, what you measure it with, and what you keep the same."
  },

  {
    title: "Forces on a skydiver",
    spec: "1.15, 1.16, 1.17, 1.21",
    marks: 6,
    question: `<p>A skydiver jumps from a plane. After some time she reaches terminal velocity. Later, she opens her parachute.</p>
      <p class="ask">Explain how the forces on the skydiver change her motion, from leaving the plane until she reaches a new terminal velocity with her parachute open.</p>`,
    guide: [
      "Two forces act: her <b>weight</b> (down) and <b>air resistance</b> (up).",
      "Work out the <b>resultant force</b> at each stage. A resultant force causes acceleration; zero resultant force means constant velocity.",
      "Air resistance depends on <b>speed</b> and on <b>surface area</b>. Which of these changes at each stage?",
      "Go in order: just after jumping → speeding up → terminal velocity → parachute opens → new terminal velocity.",
      "Use “accelerates”, “decelerates” and “constant velocity” — not just “goes faster” or “goes slower”."
    ],
    scheme: [
      ["1", "At first, the only force is her <b>weight</b> (air resistance is zero), so she <b>accelerates</b> downwards", 1],
      ["2", "As her speed increases, <b>air resistance increases</b>", 1],
      ["3", "The <b>resultant force decreases</b>, so her acceleration decreases", 1],
      ["4", "Eventually air resistance <b>equals</b> her weight", 1],
      ["5", "Resultant force is <b>zero</b>, so she moves at constant velocity / <b>terminal velocity</b>", 1],
      ["6", "When the parachute opens, the larger <b>surface area</b> makes air resistance <b>greater than her weight</b>", 1],
      ["7", "Resultant force is <b>upwards</b>, so she <b>decelerates</b> / slows down", 1],
      ["8", "As she slows, air resistance decreases until it equals her weight again, giving a new, <b>lower terminal velocity</b>", 1]
    ],
    max: 6,
    maxText: "Any 6 from 8",
    notes: [
      "<b>Max 4</b> if the parachute stage is not discussed (no MP6–8).",
      "MP1: <b>allow</b> “accelerates at 10 m/s²” / “accelerates at g”.",
      "MP4: <b>allow</b> “forces are balanced”.",
      "MP5: <b>reject</b> “she stops moving” or “she stops accelerating so she stops”.",
      "MP7: <b>reject</b> “she goes upwards” — this contradicts the physics and loses MP7.",
      "<b>Allow</b> “drag” or “friction with the air” for air resistance. <b>Reject</b> “gravity increases”."
    ],
    tip: "The most common error is saying the skydiver moves upwards when the parachute opens. She keeps falling — she just slows down."
  },

  {
    title: "Stopping distances",
    spec: "1.19, 1.20",
    marks: 6,
    question: `<p>A driver sees a hazard in the road ahead and has to stop the car.</p>
      <p class="ask">Explain how the stopping distance of the car is made up, and how different factors can affect it.</p>`,
    guide: [
      "Stopping distance has <b>two parts</b>: one before the brakes are applied and one after. Name and define both.",
      "Some factors affect the <b>driver</b>; others affect the <b>car or the road</b>. Say which part of the stopping distance each one changes.",
      "Spec factors to cover: <b>speed, mass, road condition, reaction time</b>.",
      "For each factor, say whether the distance gets longer or shorter. “Affects” on its own doesn't score.",
      "Think about friction between the tyres and the road."
    ],
    scheme: [
      ["1", "Stopping distance = <b>thinking distance + braking distance</b>", 1],
      ["2", "Thinking distance: distance travelled during the driver's <b>reaction time</b>", 1],
      ["3", "Braking distance: distance travelled after the brakes are applied, until the car stops", 1],
      ["4", "Greater <b>speed</b> increases both thinking and braking distance", 1],
      ["5", "Tiredness / alcohol / drugs / distraction increase <b>reaction time</b>, so increase thinking distance", 1],
      ["6", "Greater <b>mass</b> (e.g. passengers, luggage) increases braking distance", 1],
      ["7", "Wet / icy road reduces <b>friction</b>, increasing braking distance", 1],
      ["8", "Worn tyres / worn brakes reduce friction, increasing braking distance", 1]
    ],
    max: 6,
    maxText: "Any 6 from 8",
    notes: [
      "<b>Max 4</b> if only one of thinking distance or braking distance is discussed.",
      "MP4: <b>allow</b> “speed affects both”. Both parts must be implied.",
      "MP5: <b>reject</b> “alcohol increases braking distance”.",
      "MP6: <b>allow</b> “heavier car takes longer to stop”.",
      "MP7: <b>reject</b> “wet roads increase thinking distance”.",
      "<b>Ignore</b> “bad weather” unless linked to the road surface or visibility."
    ],
    tip: "Always link each factor to the correct part. Drink-driving affects thinking distance; icy roads affect braking distance. Mixing these up loses the mark."
  },

  {
    title: "Practical: Hooke's law",
    spec: "1.22, 1.23, 1.24",
    marks: 6,
    question: `<p>A student investigates how the extension of a spring depends on the force applied to it.</p>
      <p class="ask">Describe how the student could carry out the investigation, and how the results would show whether the spring obeys Hooke's law.</p>`,
    guide: [
      "<b>extension = new length − original length</b>. You must measure the original length first.",
      "How will you apply a known force? A mass of 100 g has a weight of about 1 N.",
      "How do you read a ruler accurately next to a spring?",
      "<b>Hooke's law:</b> extension is directly proportional to the force applied — up to a limit. What graph shape shows this?",
      "<b>Elastic behaviour:</b> the material returns to its original shape when the force is removed. How could you check this?"
    ],
    scheme: [
      ["1", "Hang the spring from a clamp stand and measure its <b>original length</b> with a ruler", 1, "m"],
      ["2", "Add <b>masses / weights</b> in equal steps (e.g. 100 g = 1 N)", 1, "m"],
      ["3", "Measure the new length each time and calculate <b>extension = new length − original length</b>", 1, "m"],
      ["4", "Read the ruler at <b>eye level</b> / use a pointer attached to the spring", 1, "m"],
      ["5", "Remove the masses to check the spring <b>returns to its original length</b> (elastic) / repeat and take a mean", 1, "m"],
      ["6", "Plot a graph of <b>force against extension</b>", 1, "r"],
      ["7", "A <b>straight line through the origin</b> shows extension is proportional to force (Hooke's law)", 1, "r"],
      ["8", "If the graph <b>curves</b> at large forces, the limit of proportionality has been passed", 1, "r"]
    ],
    groups: { m: 5, r: 2 },
    max: 6,
    maxText: "Any 6 from 8 · max 5 for method, max 2 for results",
    notes: [
      "MP2: <b>reject</b> “add weights” with no mention of equal or known steps.",
      "MP3: extension must be calculated, not just “measure the length”.",
      "MP6: <b>allow</b> extension against force.",
      "MP7: both “straight line” and “through the origin” are needed. <b>Allow</b> “directly proportional”.",
      "<b>Ignore</b> safety points (goggles, clamp to bench) unless they replace a missing step — then allow max 1."
    ],
    tip: "Students lose marks by measuring length but never calculating extension. Hooke's law is about extension, not length."
  },

  {
    title: "Resultant force and acceleration",
    spec: "1.6, 1.15, 1.17",
    marks: 5,
    question: `<p>A car of mass 1200 kg is driving along a straight, flat road. The driving force from the engine is 3000 N. The total resistive force (friction and air resistance) is 600 N.</p>
      <p class="part"><span class="ask">(a) Calculate the resultant force on the car.</span> <span class="sum">(1)</span></p>
      <p class="part"><span class="ask">(b) Calculate the acceleration of the car.</span> <span class="sum">(2)</span></p>
      <p class="part"><span class="ask">(c) The car starts from rest. Calculate the time it takes to reach 24 m/s, assuming the acceleration stays the same.</span> <span class="sum">(2)</span></p>`,
    guide: [
      "Forces in opposite directions along a line: <b>subtract</b> to find the resultant.",
      "<b>force = mass × acceleration</b> &nbsp;(F = m × a) — the force here is the <b>resultant</b> force, not the driving force.",
      "<b>acceleration = change in velocity ÷ time taken</b> &nbsp;(a = (v − u) ÷ t)",
      "“Starts from rest” means the initial velocity u = 0.",
      "Rearrange before substituting, and give units every time."
    ],
    scheme: [
      ["a1", "Resultant force = 3000 − 600 = <b>2400 N</b> (forwards)", 1, "a"],
      ["b1", "Substitution: a = 2400 ÷ 1200", 1, "b"],
      ["b2", "a = <b>2.0 m/s²</b>", 1, "b"],
      ["c1", "Rearrangement/substitution: t = (24 − 0) ÷ 2.0", 1, "c"],
      ["c2", "t = <b>12 s</b>", 1, "c"]
    ],
    groups: { a: 1, b: 2, c: 2 },
    max: 5,
    maxText: "Total 5",
    notes: [
      "(b) 2.5 m/s² (using 3000 N instead of the resultant) scores <b>b1 only</b> if the method is shown, otherwise 0.",
      "(b) <b>Allow</b> error carried forward from (a).",
      "(c) <b>Allow</b> error carried forward from (b): 24 ÷ their (b), correctly evaluated, scores 2.",
      "Correct answers with no working score full marks for that part.",
      "Missing or wrong units: lose the final mark in that part (once only across the question)."
    ],
    tip: "F = ma always uses the resultant force. If you use the driving force, every later part is wrong too."
  },

  {
    title: "Scalars, vectors and forces",
    spec: "1.11, 1.12, 1.13, 1.14",
    marks: 4,
    question: `<p>Speed and velocity are both measured in m/s, but speed is a scalar and velocity is a vector.</p>
      <p class="ask">Explain the difference between scalar and vector quantities. A car drives around a roundabout at a constant speed of 10 m/s. Explain why its velocity is changing and what this tells you about the forces acting on it.</p>`,
    guide: [
      "Scalars and vectors both have a size (magnitude). What extra thing does a vector have?",
      "Give at least one correct example of each — not speed and velocity, since the question already gives those.",
      "Think about what happens to the car's <b>direction</b> as it goes round.",
      "A change in velocity means the object is accelerating. What does an object need in order to accelerate?",
      "Forces can change an object's speed, shape <b>or direction</b>."
    ],
    scheme: [
      ["1", "A scalar has <b>magnitude (size) only</b>", 1],
      ["2", "A vector has <b>magnitude and direction</b>", 1],
      ["3", "A correct further example of each: scalar (e.g. distance, mass, time, energy) <b>and</b> vector (e.g. force, displacement, acceleration, weight)", 1],
      ["4", "The car's <b>direction</b> is changing, so its velocity is changing (even though its speed isn't)", 1],
      ["5", "A changing velocity means the car is <b>accelerating</b>", 1],
      ["6", "So there must be a <b>resultant (unbalanced) force</b> on the car (towards the centre of the roundabout)", 1]
    ],
    max: 4,
    maxText: "Any 4 from 6",
    notes: [
      "MP3: one correct example of each is needed. <b>Reject</b> if any example is wrongly classified.",
      "MP4: <b>reject</b> “velocity changes because the speed changes” — the question says constant speed.",
      "MP6: <b>allow</b> “forces are not balanced”. <b>Reject</b> “there is no resultant force because the speed is constant”.",
      "<b>Max 2</b> if the roundabout part is not attempted."
    ],
    tip: "Constant speed does not mean constant velocity. Any change of direction is an acceleration, and that needs a resultant force."
  },

  {
    title: "Braking distance using v² = u² + 2as",
    spec: "1.6, 1.10",
    marks: 5,
    question: `<p>A cyclist travelling at 8.0 m/s brakes and stops in a distance of 10 m. Assume the deceleration is uniform.</p>
      <p class="part"><span class="ask">(a) Calculate the deceleration of the cyclist.</span> <span class="sum">(3)</span></p>
      <p class="part"><span class="ask">(b) Calculate the time taken for the cyclist to stop.</span> <span class="sum">(2)</span></p>`,
    guide: [
      "<b>(final speed)² = (initial speed)² + (2 × acceleration × distance)</b> &nbsp;(v² = u² + 2as)",
      "Write down what you know: u, v, s. When the cyclist stops, v = 0.",
      "Rearrange for a before substituting. A deceleration comes out as a negative acceleration.",
      "<b>acceleration = change in velocity ÷ time taken</b> — rearrange for t in part (b).",
      "Don't forget to square the speed."
    ],
    scheme: [
      ["a1", "Substitution: 0² = 8.0² + 2 × a × 10", 1, "a"],
      ["a2", "Rearrangement: a = −64 ÷ 20", 1, "a"],
      ["a3", "Deceleration = <b>3.2 m/s²</b>", 1, "a"],
      ["b1", "Rearrangement/substitution: t = (0 − 8.0) ÷ (−3.2) / t = 8.0 ÷ 3.2", 1, "b"],
      ["b2", "t = <b>2.5 s</b>", 1, "b"]
    ],
    groups: { a: 3, b: 2 },
    max: 5,
    maxText: "Total 5",
    notes: [
      "(a) Correct answer with no working scores <b>3 marks</b>.",
      "(a) <b>Allow</b> −3.2 m/s² (acceleration of −3.2).",
      "(a) 0.4 m/s² (speed not squared: 8 ÷ 20) scores <b>a1 only</b> if the equation is written correctly.",
      "(b) <b>Allow</b> error carried forward from (a).",
      "(b) <b>Allow</b> the average-speed method: average speed = 4.0 m/s, t = 10 ÷ 4.0 = 2.5 s."
    ],
    tip: "Write u, v, a, s and t down the side of your working and fill in what you know. It tells you which equation to use."
  }
];

const ELECTRICITY = [
  {
    title: "Electrical safety: earthing, fuses and double insulation",
    spec: "2.2",
    marks: 6,
    question: `<p>A kettle has a metal case. The case is connected to the earth wire, and the plug contains a fuse.</p>
      <p class="ask">Explain how the earth wire and the fuse protect the user if a fault makes the live wire touch the metal case. Explain why some appliances, such as hairdryers, do not need an earth wire.</p>`,
    guide: [
      "Start with the fault: what would happen to someone touching the case if there were no earth wire?",
      "The earth wire is a path for the current. What kind of path, and where does it go?",
      "A fuse is a thin wire with a rating. What happens to it when the current goes above that rating?",
      "The safety features work as a <b>sequence</b>. Explain each step in order.",
      "For the hairdryer, think about what its case is made of."
    ],
    scheme: [
      ["1", "If the live wire touches the case, the <b>case becomes live</b> and the user could get an electric shock", 1],
      ["2", "The earth wire provides a <b>low-resistance path</b> (to the ground)", 1],
      ["3", "A <b>large current</b> flows through the live wire and the earth wire", 1],
      ["4", "The current is <b>greater than the fuse rating</b>", 1],
      ["5", "The fuse <b>melts / blows</b>, breaking the circuit / disconnecting the live wire", 1],
      ["6", "So the case is no longer live / no shock / no fire", 1],
      ["7", "Double-insulated appliances have a case made of <b>plastic / an insulator</b>", 1],
      ["8", "So the case <b>cannot become live</b>, and no earth wire is needed", 1],
      ["9", "A <b>circuit breaker</b> does the same job as a fuse: it switches off (faster) when the current is too big and can be reset", 1]
    ],
    max: 6,
    maxText: "Any 6 from 9",
    notes: [
      "MP2: <b>reject</b> “the earth wire takes the electricity away” without the low-resistance / path idea.",
      "MP3: <b>reject</b> “current flows to earth instead of through the person” on its own — the large current is needed for MP4–5.",
      "MP5: <b>reject</b> “the fuse breaks” without melting/blowing or breaking the circuit.",
      "<b>Max 4</b> if the double insulation part is not attempted.",
      "<b>Ignore</b> references to the neutral wire unless incorrect."
    ],
    tip: "The earth wire alone doesn't stop the danger — it causes a big current that blows the fuse. Examiners want both steps linked."
  },

  {
    title: "Power, current and choosing a fuse",
    spec: "2.4, 2.5",
    marks: 6,
    question: `<p>A hairdryer is connected to the 230 V mains supply. Its power is 1.2 kW.</p>
      <p class="part"><span class="ask">(a) Calculate the current in the hairdryer.</span> <span class="sum">(2)</span></p>
      <p class="part"><span class="ask">(b) Fuses are available with ratings of 3 A, 5 A and 13 A. Choose the best fuse for the hairdryer and explain your choice.</span> <span class="sum">(2)</span></p>
      <p class="part"><span class="ask">(c) Calculate the energy transferred by the hairdryer in 10 minutes.</span> <span class="sum">(2)</span></p>`,
    guide: [
      "<b>power = current × voltage</b> &nbsp;(P = I × V)",
      "<b>energy transferred = current × voltage × time</b> &nbsp;(E = I × V × t)",
      "Convert first: kW to W (× 1000), minutes to seconds (× 60).",
      "A fuse should be rated <b>just above</b> the normal working current. What would happen if it were rated below it?",
      "Give units: A for current, J for energy."
    ],
    scheme: [
      ["a1", "Rearrangement/substitution: I = 1200 ÷ 230", 1, "a"],
      ["a2", "I = <b>5.2 A</b>", 1, "a"],
      ["b1", "<b>13 A</b> fuse", 1, "b"],
      ["b2", "It is the lowest rating <b>above</b> the normal current / a 5 A fuse would blow in normal use", 1, "b"],
      ["c1", "Substitution: E = 5.2 × 230 × 600 (or 1200 × 600)", 1, "c"],
      ["c2", "E = <b>720 000 J</b> (7.2 × 10⁵ J)", 1, "c"]
    ],
    groups: { a: 2, b: 2, c: 2 },
    max: 6,
    maxText: "Total 6",
    notes: [
      "(a) <b>Allow</b> 5.22 A. 0.0052 A (kW not converted) scores a1 only.",
      "(b) b2 can only be awarded if 13 A is chosen. <b>Allow</b> error carried forward from (a) — e.g. if their current is 4 A, choosing 5 A with a correct reason scores 2.",
      "(b) <b>Reject</b> “13 A because it's the biggest” / “safest”.",
      "(c) <b>Allow</b> 717 600 J or any answer that rounds to 7.2 × 10⁵ J.",
      "(c) 12 000 J (minutes not converted) scores <b>c1 only</b> if the method is clear."
    ],
    tip: "Fuse choice is a two-step check: work out the current, then pick the smallest fuse that's bigger than it. Not the biggest, not the closest."
  },

  {
    title: "Practical: current-voltage graph for a filament lamp",
    spec: "2.9",
    marks: 6,
    question: `<p>A student wants to find out how the current in a filament lamp changes as the voltage across it changes.</p>
      <p class="ask">Describe how the student could carry out this investigation. Describe and explain the shape of the graph of current against voltage that she would get.</p>`,
    guide: [
      "Which meter measures current, and how is it connected? Which meter measures voltage, and how is it connected?",
      "How will you <b>change</b> the voltage across the lamp?",
      "How many readings, and over what range? How can you get readings for negative voltages?",
      "Describe the graph shape in words: is it a straight line? Does it pass through the origin?",
      "Explain the shape: what happens to the filament as the current increases, and how does that affect its resistance?"
    ],
    scheme: [
      ["1", "<b>Ammeter in series</b> with the lamp", 1, "m"],
      ["2", "<b>Voltmeter in parallel</b> with the lamp", 1, "m"],
      ["3", "Use a <b>variable resistor</b> / variable power supply to change the voltage", 1, "m"],
      ["4", "Record the current for a <b>range of voltages</b> (at least 5 values)", 1, "m"],
      ["5", "<b>Reverse</b> the connections to the supply to get negative values", 1, "m"],
      ["6", "Plot a graph of <b>current against voltage</b>", 1, "m"],
      ["7", "Graph is a <b>curve</b> through the origin: current increases <b>less</b> for each equal increase in voltage / gradient decreases", 1, "r"],
      ["8", "Because the filament gets <b>hotter</b>, so its <b>resistance increases</b>", 1, "r"]
    ],
    groups: { m: 5, r: 2 },
    max: 6,
    maxText: "Any 6 from 8 · max 5 for method, max 2 for results",
    notes: [
      "MP1/MP2: <b>allow</b> a correct circuit diagram.",
      "MP4: <b>reject</b> “take readings” with no range or number.",
      "MP7: <b>allow</b> a correct sketch. <b>Reject</b> “straight line” or “current decreases”.",
      "MP8: <b>reject</b> “resistance increases” with no reason. <b>Allow</b> “atoms/ions vibrate more, so electrons collide more”.",
      "<b>Allow</b> “switch off between readings to stop the lamp overheating” as an extra point in place of MP5."
    ],
    tip: "Ammeter in series, voltmeter in parallel — get these the wrong way round and you lose two easy marks."
  },

  {
    title: "Series and parallel circuits for house lighting",
    spec: "2.7, 2.17, 2.18",
    marks: 4,
    question: `<p>The lights in a house are connected in parallel, not in series.</p>
      <p class="ask">Explain why a parallel circuit is more suitable than a series circuit for house lighting.</p>`,
    guide: [
      "Think about what a homeowner needs: switching lights on and off, and what happens if a bulb breaks.",
      "In parallel, what is the <b>voltage</b> across each branch? In series, what happens to the voltage?",
      "Current is conserved at a junction: the current into a junction equals the current out.",
      "Compare both circuit types for each point you make.",
      "Link voltage to brightness."
    ],
    scheme: [
      ["1", "Each light can be <b>switched on and off independently</b>", 1],
      ["2", "If one lamp <b>breaks / blows</b>, the others stay on", 1],
      ["3", "Each lamp gets the <b>full mains voltage</b> (230 V) / the voltage across parallel branches is the same", 1],
      ["4", "So each lamp is at <b>full brightness</b>", 1],
      ["5", "In series, the voltage is <b>shared</b> between the lamps, so they would be dimmer", 1],
      ["6", "In series, one break stops the current in the <b>whole circuit</b>", 1],
      ["7", "Adding more lamps in parallel doesn't change the brightness of the others; the current splits at the junctions", 1]
    ],
    max: 4,
    maxText: "Any 4 from 7",
    notes: [
      "MP3: <b>reject</b> “each lamp gets the same current” — the current depends on the lamp.",
      "MP4: must be linked to the voltage idea in MP3 or MP5.",
      "MP6: <b>allow</b> “in series, if one goes out they all go out”.",
      "<b>Ignore</b> “parallel uses less electricity” — it doesn't."
    ],
    tip: "Two of the four marks come from voltage. Students who only talk about bulbs breaking usually get 2 out of 4."
  },

  {
    title: "LDRs and thermistors",
    spec: "2.8, 2.10, 2.11, 2.12",
    marks: 4,
    question: `<p>A student connects a light-dependent resistor (LDR) in series with a lamp and a battery.</p>
      <p class="ask">Describe and explain what happens to the lamp when the room gets darker. Then describe how the resistance of a thermistor changes with temperature.</p>`,
    guide: [
      "Start with the LDR: what happens to its resistance in the dark?",
      "In a series circuit, what happens to the <b>total resistance</b> when one component's resistance changes?",
      "The battery voltage stays the same. What happens to the <b>current</b>? (V = I × R)",
      "Link current to the lamp's brightness.",
      "For the thermistor, give the direction of the change: as temperature increases, resistance…?"
    ],
    scheme: [
      ["1", "In the dark, the <b>resistance of the LDR increases</b>", 1],
      ["2", "So the <b>total resistance</b> of the circuit increases", 1],
      ["3", "So the <b>current decreases</b> (the battery voltage is unchanged)", 1],
      ["4", "So the lamp gets <b>dimmer</b> (or goes out)", 1],
      ["5", "A thermistor's resistance <b>decreases</b> as temperature <b>increases</b>", 1],
      ["6", "The lamp shows whether there is a current in the circuit", 1]
    ],
    max: 4,
    maxText: "Any 4 from 6",
    notes: [
      "MP1: <b>reject</b> “LDR resistance decreases in the dark” — this loses MP1.",
      "MP3: <b>reject</b> “current is used up”.",
      "MP2–4: <b>allow</b> error carried forward from a wrong MP1 if the reasoning is consistent (max 2).",
      "MP5: <b>allow</b> “resistance increases as temperature decreases”.",
      "<b>Max 3</b> if the thermistor part is not attempted."
    ],
    tip: "LDR: light down, resistance up. Thermistor: temperature up, resistance down. Learn both — they go in opposite directions."
  },

  {
    title: "Calculating current and voltage in a series circuit",
    spec: "2.13, 2.19",
    marks: 5,
    question: `<p>A 12 V battery is connected in series with a 4.0 Ω resistor and a 2.0 Ω resistor.</p>
      <p class="part"><span class="ask">(a) Calculate the total resistance of the circuit.</span> <span class="sum">(1)</span></p>
      <p class="part"><span class="ask">(b) Calculate the current in the circuit.</span> <span class="sum">(2)</span></p>
      <p class="part"><span class="ask">(c) Calculate the voltage across the 4.0 Ω resistor.</span> <span class="sum">(2)</span></p>`,
    guide: [
      "In <b>series</b>, total resistance = sum of the resistances.",
      "<b>voltage = current × resistance</b> &nbsp;(V = I × R)",
      "In a series circuit, the current is the <b>same</b> everywhere.",
      "For (c), use the current from (b) with the resistance of just that one resistor.",
      "Check: the voltages across the two resistors should add up to the battery voltage."
    ],
    scheme: [
      ["a1", "Total resistance = 4.0 + 2.0 = <b>6.0 Ω</b>", 1, "a"],
      ["b1", "Rearrangement/substitution: I = 12 ÷ 6.0", 1, "b"],
      ["b2", "I = <b>2.0 A</b>", 1, "b"],
      ["c1", "Substitution: V = 2.0 × 4.0", 1, "c"],
      ["c2", "V = <b>8.0 V</b>", 1, "c"]
    ],
    groups: { a: 1, b: 2, c: 2 },
    max: 5,
    maxText: "Total 5",
    notes: [
      "(b) <b>Allow</b> error carried forward from (a).",
      "(c) <b>Allow</b> error carried forward from (b).",
      "(c) <b>Allow</b> the ratio method: 4 ÷ 6 × 12 = 8.0 V.",
      "(c) 12 V (assuming each resistor gets the full voltage) scores 0.",
      "Correct answers with no working score full marks for that part."
    ],
    tip: "In series: current is the same everywhere, voltage is shared. In parallel: voltage is the same, current is shared."
  },

  {
    title: "Charge, current and energy",
    spec: "2.14, 2.15, 2.16, 2.20, 2.21",
    marks: 6,
    question: `<p>A phone charger supplies a current of 2.0 A at a voltage of 5.0 V. The phone charges for 30 minutes.</p>
      <p class="part"><span class="ask">(a) Calculate the charge that flows in 30 minutes.</span> <span class="sum">(2)</span></p>
      <p class="part"><span class="ask">(b) Calculate the energy transferred to the phone.</span> <span class="sum">(2)</span></p>
      <p class="part"><span class="ask">(c) State what is meant by a voltage of 5.0 V.</span> <span class="sum">(1)</span></p>
      <p class="part"><span class="ask">(d) State what an electric current in a metal wire is.</span> <span class="sum">(1)</span></p>`,
    guide: [
      "<b>charge = current × time</b> &nbsp;(Q = I × t) — time must be in <b>seconds</b>.",
      "<b>energy transferred = charge × voltage</b> &nbsp;(E = Q × V)",
      "<b>Current</b> is the rate of flow of charge. Charge is measured in coulombs (C).",
      "<b>Voltage</b> is linked to energy and charge: 1 volt = 1 joule per coulomb.",
      "In a metal, which particles are free to move?"
    ],
    scheme: [
      ["a1", "Substitution: Q = 2.0 × 1800", 1, "a"],
      ["a2", "Q = <b>3600 C</b>", 1, "a"],
      ["b1", "Substitution: E = 3600 × 5.0", 1, "b"],
      ["b2", "E = <b>18 000 J</b>", 1, "b"],
      ["c1", "<b>5.0 J</b> of energy is transferred <b>per coulomb</b> of charge", 1, "c"],
      ["d1", "A flow of (negatively charged) <b>electrons</b>", 1, "d"]
    ],
    groups: { a: 2, b: 2, c: 1, d: 1 },
    max: 6,
    maxText: "Total 6",
    notes: [
      "(a) 60 C (minutes not converted) scores <b>a1 only</b> if the method is clear.",
      "(b) <b>Allow</b> error carried forward from (a). <b>Allow</b> E = I × V × t = 2.0 × 5.0 × 1800.",
      "(c) <b>Reject</b> “5 J per second” (that's power). <b>Allow</b> “5 J/C”.",
      "(d) <b>Reject</b> “flow of charge” on its own, “flow of protons”, “flow of electricity”."
    ],
    tip: "Most lost marks in electricity calculations come from not converting minutes to seconds. Do it first, before anything else."
  },

  {
    title: "The heating effect of a current, a.c. and d.c.",
    spec: "2.3, 2.6",
    marks: 5,
    question: `<p>Many household appliances contain a resistor that gets hot when there is a current in it.</p>
      <p class="ask">Explain why a resistor gets hot when there is a current in it, and give two household uses of this heating effect. State the difference between the electricity supplied by the mains and by a battery.</p>`,
    guide: [
      "Think about the moving electrons and the particles that make up the metal.",
      "What happens when they <b>collide</b>? Where does the energy go?",
      "Use energy store language: energy is transferred electrically, then to the <b>thermal</b> store.",
      "Uses: think of appliances that are <b>meant</b> to get hot.",
      "Mains is <b>a.c.</b>, a battery is <b>d.c.</b> — say what each means for the direction of the current."
    ],
    scheme: [
      ["1", "Electrons <b>collide</b> with the ions / atoms in the metal (lattice)", 1],
      ["2", "Energy is transferred to the ions, which <b>vibrate more</b>", 1],
      ["3", "So the <b>thermal energy</b> store of the resistor increases / temperature rises", 1],
      ["4", "One correct use (e.g. kettle, toaster, electric heater, hairdryer, iron, immersion heater, oven)", 1, "u"],
      ["5", "A second, different correct use", 1, "u"],
      ["6", "Mains is <b>a.c.</b>: the current <b>repeatedly changes direction</b>", 1],
      ["7", "A battery gives <b>d.c.</b>: the current flows in <b>one direction only</b>", 1]
    ],
    groups: { u: 2 },
    max: 5,
    maxText: "Any 5 from 7",
    notes: [
      "MP1: <b>reject</b> “electrons rub against the wire” / “friction”.",
      "MP4/MP5: <b>reject</b> filament lamp as a use (the heating is unwanted). <b>Ignore</b> fridge, TV.",
      "MP6: <b>reject</b> “a.c. goes back and forth in the wire” only if no reference to current.",
      "MP6/MP7: <b>allow</b> “alternating current” / “direct current” with a correct description only."
    ],
    tip: "“The electricity makes it hot” scores nothing. The marks are for the mechanism: electrons collide with ions, ions vibrate more."
  }
];

const SLG = [
  {
    title: "Practical: density of an irregular object",
    spec: "5.3, 5.4",
    marks: 6,
    question: `<p>A student has a small stone with an irregular shape.</p>
      <p class="ask">Describe how the student could find the density of the stone.</p>`,
    guide: [
      "<b>density = mass ÷ volume</b> &nbsp;(ρ = m ÷ V)",
      "You need two measurements. What instrument measures mass?",
      "You can't measure an irregular shape with a ruler. How can water help you find its volume?",
      "How do you read a measuring cylinder accurately?",
      "Units: g/cm³ or kg/m³. 1 cm³ of water = 1 ml."
    ],
    scheme: [
      ["1", "Measure the <b>mass</b> using a (top-pan) <b>balance</b>", 1],
      ["2", "Part-fill a <b>measuring cylinder</b> with water and record the volume", 1],
      ["3", "Lower the stone in (fully <b>submerged</b>) and record the new volume", 1],
      ["4", "Volume of stone = <b>difference</b> between the two readings", 1],
      ["5", "Alternative: fill a <b>displacement (eureka) can</b> to the spout, add the stone and collect the water that overflows in a measuring cylinder", 1],
      ["6", "Read the measuring cylinder at <b>eye level</b> / from the bottom of the meniscus", 1],
      ["7", "Density = <b>mass ÷ volume</b>", 1],
      ["8", "<b>Repeat</b> and take a mean / give the correct unit (g/cm³)", 1]
    ],
    max: 6,
    maxText: "Any 6 from 8",
    notes: [
      "MP5 is an alternative to MP2–4: the displacement can method scores <b>max 3</b> for the volume steps.",
      "MP3: <b>reject</b> “put the stone in the water” without reading the new volume.",
      "MP7: <b>reject</b> volume ÷ mass.",
      "<b>Ignore</b> “use a ruler to measure the stone”. It can't score, but doesn't lose marks if the water method is also given."
    ],
    tip: "Volume by displacement is the whole point of this practical. Two readings, then subtract."
  },

  {
    title: "Pressure in liquids",
    spec: "5.5, 5.6, 5.7",
    marks: 5,
    question: `<p>A diver swims 12 m below the surface of the sea. The density of sea water is 1030 kg/m³ and g = 10 N/kg.</p>
      <p class="part"><span class="ask">(a) Calculate the pressure difference between the surface and a depth of 12 m.</span> <span class="sum">(2)</span></p>
      <p class="part"><span class="ask">(b) The glass in the diver's mask has an area of 0.020 m². Calculate the force on the glass due to this pressure difference.</span> <span class="sum">(2)</span></p>
      <p class="part"><span class="ask">(c) Explain why the water also pushes on the diver's back, not just from above.</span> <span class="sum">(1)</span></p>`,
    guide: [
      "<b>pressure difference = height × density × gravitational field strength</b> &nbsp;(p = h × ρ × g)",
      "<b>pressure = force ÷ area</b> &nbsp;(p = F ÷ A) — rearrange for F.",
      "Pressure is measured in pascals (Pa). 1 Pa = 1 N/m².",
      "For (c), think about the direction pressure acts at a point in a liquid."
    ],
    scheme: [
      ["a1", "Substitution: p = 12 × 1030 × 10", 1, "a"],
      ["a2", "p = <b>123 600 Pa</b> (1.24 × 10⁵ Pa)", 1, "a"],
      ["b1", "Rearrangement/substitution: F = 123 600 × 0.020", 1, "b"],
      ["b2", "F = <b>2500 N</b> (2472 N)", 1, "b"],
      ["c1", "Pressure at a point in a liquid acts <b>equally in all directions</b>", 1, "c"]
    ],
    groups: { a: 2, b: 2, c: 1 },
    max: 5,
    maxText: "Total 5",
    notes: [
      "(a) <b>Allow</b> 124 kPa. Unit required for a2.",
      "(b) <b>Allow</b> error carried forward from (a). <b>Allow</b> any answer rounding to 2500 N.",
      "(b) 6 180 000 N (dividing instead of multiplying) scores 0.",
      "(c) <b>Reject</b> “water surrounds the diver” on its own."
    ],
    tip: "Pressure in a liquid depends on depth and density only — not on the shape or width of the container."
  },

  {
    title: "Gas pressure and temperature",
    spec: "5.15, 5.18, 5.20",
    marks: 6,
    question: `<p>A sealed metal can contains air. The can is heated, and its volume does not change.</p>
      <p class="ask">Explain, in terms of molecules, why the pressure of the air in the can increases.</p>`,
    guide: [
      "Start with how gas molecules move, and how this creates a pressure on the walls.",
      "<b>pressure = force ÷ area</b>. Where does the force on the walls come from?",
      "What happens to the molecules' <b>average speed / kinetic energy</b> when the temperature rises?",
      "Two separate effects: how <b>often</b> molecules hit the walls, and how <b>hard</b>.",
      "The volume is constant — so the area of the walls doesn't change."
    ],
    scheme: [
      ["1", "Molecules move <b>randomly</b> / in all directions at high speed", 1],
      ["2", "Molecules <b>collide with the walls</b> of the can", 1],
      ["3", "Each collision exerts a <b>force</b> on the wall", 1],
      ["4", "Pressure is the total force on the walls per unit <b>area</b>", 1],
      ["5", "Heating increases the molecules' <b>average speed / kinetic energy</b>", 1],
      ["6", "So molecules hit the walls <b>more often</b> (more collisions per second)", 1],
      ["7", "And with <b>more force</b> / harder", 1],
      ["8", "So the pressure increases (as the volume / wall area is constant)", 1]
    ],
    max: 6,
    maxText: "Any 6 from 8",
    notes: [
      "MP5: <b>reject</b> “molecules expand / get bigger” — this loses MP5.",
      "MP6: <b>reject</b> “molecules collide with each other more” on its own.",
      "MP6: <b>allow</b> “more frequent collisions”. <b>Reject</b> “more collisions” with no time reference.",
      "<b>Reject</b> “more molecules” — the can is sealed.",
      "<b>Max 4</b> if temperature is never linked to molecular speed or energy (no MP5)."
    ],
    tip: "Hotter gas molecules hit the walls more often and harder. Both are separate marks — say both."
  },

  {
    title: "Absolute zero and the Kelvin scale",
    spec: "5.16, 5.17, 5.19",
    marks: 4,
    question: `<p class="part"><span class="ask">(a) Explain what is meant by absolute zero, and why there is a lowest possible temperature.</span> <span class="sum">(2)</span></p>
      <p class="part"><span class="ask">(b) Convert 27 °C to kelvin, and 100 K to degrees Celsius.</span> <span class="sum">(2)</span></p>`,
    guide: [
      "Temperature is linked to the movement of particles. The Kelvin temperature is proportional to the <b>average kinetic energy</b> of the molecules.",
      "What would the particles be doing at the lowest possible temperature?",
      "Absolute zero = <b>−273 °C</b> = <b>0 K</b>.",
      "<b>K = °C + 273</b> &nbsp; and &nbsp; <b>°C = K − 273</b>",
      "There's no degree symbol with kelvin: write 300 K, not 300 °K."
    ],
    scheme: [
      ["a1", "Absolute zero is <b>−273 °C / 0 K</b>, the lowest possible temperature", 1, "a"],
      ["a2", "Molecules have the <b>minimum</b> (no) kinetic energy / stop moving, so the temperature can't go lower", 1, "a"],
      ["a3", "Kelvin temperature is <b>proportional</b> to the average kinetic energy of the molecules", 1, "a"],
      ["b1", "27 °C = <b>300 K</b>", 1, "b"],
      ["b2", "100 K = <b>−173 °C</b>", 1, "b"]
    ],
    groups: { a: 2, b: 2 },
    max: 4,
    maxText: "Total 4 · (a) any 2 from 3",
    notes: [
      "a2: <b>allow</b> “particles have no energy” / “particles don't vibrate”.",
      "a2: <b>reject</b> “particles freeze”.",
      "b2: <b>reject</b> 173 °C (sign missing).",
      "b1: <b>reject</b> 300 °C or 300 °K."
    ],
    tip: "Converting to kelvin is the first step in every gas-law calculation. If you use °C in p/T, the answer is always wrong."
  },

  {
    title: "Gas law calculations",
    spec: "5.17, 5.21, 5.22",
    marks: 5,
    question: `<p class="part">A car tyre contains air at a pressure of 250 kPa when the temperature is 17 °C. After a long drive, the temperature of the air is 47 °C. The volume of the tyre does not change.</p>
      <p class="part"><span class="ask">(a) Calculate the new pressure of the air in the tyre.</span> <span class="sum">(3)</span></p>
      <p class="part">A syringe contains 60 cm³ of air at 100 kPa. The plunger is pushed in slowly until the volume is 20 cm³. The temperature does not change.</p>
      <p class="part"><span class="ask">(b) Calculate the new pressure of the air in the syringe.</span> <span class="sum">(2)</span></p>`,
    guide: [
      "Constant volume: <b>p₁ ÷ T₁ = p₂ ÷ T₂</b> — temperatures must be in <b>kelvin</b>.",
      "Constant temperature: <b>p₁ × V₁ = p₂ × V₂</b>",
      "<b>K = °C + 273</b>",
      "You can keep pressure in kPa and volume in cm³, as long as you're consistent on both sides.",
      "Sense check: should the pressure go up or down in each case?"
    ],
    scheme: [
      ["a1", "Convert both temperatures: <b>290 K</b> and <b>320 K</b>", 1, "a"],
      ["a2", "Substitution: p₂ = 250 × 320 ÷ 290", 1, "a"],
      ["a3", "p₂ = <b>276 kPa</b>", 1, "a"],
      ["b1", "Substitution: p₂ = 100 × 60 ÷ 20", 1, "b"],
      ["b2", "p₂ = <b>300 kPa</b>", 1, "b"]
    ],
    groups: { a: 3, b: 2 },
    max: 5,
    maxText: "Total 5",
    notes: [
      "(a) 691 kPa (temperatures left in °C) scores <b>0</b> for a1 and a3; a2 can be awarded if the equation is correctly rearranged — max 1.",
      "(a) <b>Allow</b> 275.9 kPa or any value rounding to 276 kPa.",
      "(b) 33 kPa (inverted ratio) scores b1 only if the equation p₁V₁ = p₂V₂ is written.",
      "Correct answers with no working score full marks for that part."
    ],
    tip: "In gas laws, always convert °C to K first. It's the single most common mistake, and it's in nearly every exam."
  },

  {
    title: "Gas pressure and volume",
    spec: "5.15, 5.20",
    marks: 4,
    question: `<p>A sealed syringe contains air. The plunger is pushed in slowly so that the temperature of the air stays the same.</p>
      <p class="ask">Explain, in terms of molecules, why the pressure of the air increases.</p>`,
    guide: [
      "The number of molecules doesn't change. What does change when the volume gets smaller?",
      "Think about how often molecules hit the walls in a smaller space.",
      "The temperature is constant. What does that tell you about the molecules' average speed?",
      "Link the collisions to force per unit area.",
      "Can you describe the relationship between pressure and volume?"
    ],
    scheme: [
      ["1", "The same number of molecules are in a <b>smaller volume</b> / closer together", 1],
      ["2", "So molecules hit the walls <b>more often</b> (more collisions per second)", 1],
      ["3", "Temperature is constant, so the <b>average speed / kinetic energy</b> of the molecules is unchanged", 1],
      ["4", "So there is a greater total force per unit area / <b>pressure increases</b>", 1],
      ["5", "Pressure is <b>inversely proportional</b> to volume / p × V is constant / halving the volume doubles the pressure", 1]
    ],
    max: 4,
    maxText: "Any 4 from 5",
    notes: [
      "MP2: <b>reject</b> “more collisions” with no time reference. <b>Allow</b> “more frequent collisions”.",
      "MP3: <b>reject</b> “molecules move faster” — this loses MP3.",
      "<b>Reject</b> “molecules get squashed / smaller”.",
      "<b>Ignore</b> collisions between molecules."
    ],
    tip: "Compressing a gas at constant temperature doesn't make molecules faster — it just makes them hit the walls more often."
  }
];

const MAGNETISM = [
  {
    title: "Practical: magnetic field patterns",
    spec: "6.4, 6.6, 6.7",
    marks: 6,
    question: `<p>A student has a bar magnet, a second bar magnet, a plotting compass, a sheet of paper and a pencil.</p>
      <p class="ask">Describe how the student could use a plotting compass to show the magnetic field pattern around a bar magnet. Describe how she could use the two magnets to produce a uniform magnetic field.</p>`,
    guide: [
      "A <b>magnetic field line</b> shows the direction of the force on a north pole at each point.",
      "A plotting compass needle points along the field. How do you use it to build up a line, dot by dot?",
      "Where do you start each line, and how do you show its direction?",
      "One line isn't a field pattern. How do you get more?",
      "<b>Uniform field:</b> field lines are parallel and equally spaced. Which poles need to face each other?"
    ],
    scheme: [
      ["1", "Place the magnet on the paper and <b>draw round it</b>", 1, "m"],
      ["2", "Place the plotting compass near the <b>north pole</b>", 1, "m"],
      ["3", "Mark a <b>dot</b> where the compass needle points", 1, "m"],
      ["4", "<b>Move the compass</b> so its tail is at the dot, and mark the next dot; repeat", 1, "m"],
      ["5", "<b>Join the dots</b> to make a field line, with an arrow from <b>N to S</b>", 1, "m"],
      ["6", "<b>Repeat</b> from different starting points around the magnet", 1, "m"],
      ["7", "Uniform field: place the two magnets with <b>opposite poles facing</b> (N facing S), a short distance apart", 1, "u"],
      ["8", "Field lines between them are <b>parallel and equally spaced</b>", 1, "u"]
    ],
    groups: { m: 4, u: 2 },
    max: 6,
    maxText: "Any 6 from 8 · max 4 for compass method, max 2 for uniform field",
    notes: [
      "<b>Allow</b> iron filings sprinkled on paper over the magnet for <b>max 1</b> in the method (it shows the shape but not the direction).",
      "MP5: <b>reject</b> arrows from S to N.",
      "MP7: <b>reject</b> “like poles facing” — this gives a neutral point, not a uniform field.",
      "MP8: <b>allow</b> a correctly drawn diagram."
    ],
    tip: "Field lines always go from north to south outside the magnet. Forget the arrows and you lose the mark."
  },

  {
    title: "Magnetically hard and soft materials",
    spec: "6.2, 6.3, 6.5",
    marks: 4,
    question: `<p>The electromagnet on a scrapyard crane has a core made of iron. Permanent magnets are made of steel.</p>
      <p class="ask">Explain the difference between magnetically hard and soft materials, using these examples. Explain why an iron paper clip is attracted to a magnet.</p>`,
    guide: [
      "One type of material is easy to magnetise <b>and</b> easy to demagnetise. The other keeps its magnetism.",
      "Which property does a crane need, so it can drop the scrap? Which does a fridge magnet need?",
      "<b>Induced magnetism:</b> some materials become magnets when placed in a magnetic field.",
      "For the paper clip, think about which pole is induced at the end nearest the magnet."
    ],
    scheme: [
      ["1", "Soft magnetic materials (iron) are <b>easily magnetised</b>", 1],
      ["2", "and <b>lose their magnetism easily</b> / quickly when the field is removed", 1],
      ["3", "Hard magnetic materials (steel) are hard to magnetise but <b>keep their magnetism</b> — used for permanent magnets", 1],
      ["4", "The crane's iron core loses its magnetism when the current is switched off, so the <b>scrap is released</b>", 1],
      ["5", "Magnetism is <b>induced</b> in the paper clip when it is in the magnet's field", 1],
      ["6", "The end nearest the magnet becomes the <b>opposite pole</b>, so it is attracted", 1]
    ],
    max: 4,
    maxText: "Any 4 from 6",
    notes: [
      "MP1/MP2: <b>reject</b> “soft materials are weak magnets”.",
      "MP3: <b>reject</b> “steel is a stronger magnet” on its own.",
      "MP6: <b>reject</b> “paper clips are magnetic so they attract” on its own.",
      "<b>Max 2</b> if hard/soft properties are not linked to either example."
    ],
    tip: "Soft and hard are about how easily magnetism comes and goes — not how strong the magnet is."
  },

  {
    title: "The motor effect",
    spec: "6.8, 6.12, 6.13, 6.14",
    marks: 6,
    question: `<p>A wire is placed between the poles of a horseshoe magnet, at right angles to the magnetic field. When a current flows in the wire, the wire moves.</p>
      <p class="ask">Explain why there is a force on the wire. Describe how the size and direction of the force can be changed.</p>`,
    guide: [
      "An electric current in a conductor produces a <b>magnetic field</b> around it.",
      "What happens when two magnetic fields overlap?",
      "<b>Fleming's left-hand rule:</b> First finger = Field, seCond finger = Current, thuMb = Motion.",
      "Size of force: think about the two things that make the fields stronger.",
      "Direction of force: what could you reverse?"
    ],
    scheme: [
      ["1", "The current produces a <b>magnetic field</b> around the wire", 1, "w"],
      ["2", "This field <b>interacts</b> with the field of the permanent magnet", 1, "w"],
      ["3", "Producing a <b>force</b> on the wire (the motor effect)", 1, "w"],
      ["4", "Direction is given by <b>Fleming's left-hand rule</b> (field, current, motion at right angles)", 1, "w"],
      ["5", "<b>Increase the current</b> → bigger force", 1, "c"],
      ["6", "Use a <b>stronger magnet</b> → bigger force", 1, "c"],
      ["7", "<b>Reverse the current</b> → force reverses", 1, "c"],
      ["8", "<b>Reverse the magnetic field</b> (swap the poles) → force reverses", 1, "c"],
      ["9", "No force if the wire is <b>parallel</b> to the field / force is biggest at right angles", 1, "c"]
    ],
    groups: { w: 3, c: 4 },
    max: 6,
    maxText: "Any 6 from 9 · max 3 for why, max 4 for changes",
    notes: [
      "MP2: <b>reject</b> “the magnet attracts the wire” — this loses MP2.",
      "MP7/MP8: <b>reject</b> “reverse both” — the force stays in the same direction.",
      "<b>Allow</b> “turn the magnet round” for MP8.",
      "<b>Ignore</b> “more turns” — this is a single wire."
    ],
    tip: "The wire isn't attracted to the magnet. Two fields interact to give a force at right angles to both."
  },

  {
    title: "How a loudspeaker works",
    spec: "6.12",
    marks: 5,
    question: `<p>A loudspeaker has a coil of wire attached to a paper cone. The coil sits in the magnetic field of a permanent magnet.</p>
      <p class="ask">Explain how the loudspeaker produces a sound when it is connected to an alternating current (a.c.) supply.</p>`,
    guide: [
      "This is an application of the <b>motor effect</b>: a current-carrying wire in a magnetic field feels a force.",
      "An alternating current keeps changing direction. What does that do to the direction of the force?",
      "Follow the chain: current → force → coil → cone → air → sound.",
      "Sound is a <b>longitudinal</b> wave made by vibrations.",
      "What sets the pitch of the sound?"
    ],
    scheme: [
      ["1", "<b>Alternating current</b> flows in the coil", 1],
      ["2", "The coil is in the <b>magnetic field</b> of the permanent magnet, so there is a <b>force</b> on it (motor effect)", 1],
      ["3", "The force <b>changes direction</b> each time the current changes direction", 1],
      ["4", "So the coil and cone <b>vibrate</b> back and forth", 1],
      ["5", "The cone makes the <b>air vibrate</b> / produces compressions and rarefactions, which is the sound wave", 1],
      ["6", "The <b>frequency</b> of the a.c. sets the frequency / pitch of the sound", 1],
      ["7", "A bigger current gives a bigger force / bigger amplitude / louder sound", 1]
    ],
    max: 5,
    maxText: "Any 5 from 7",
    notes: [
      "MP2: <b>reject</b> “the magnet attracts and repels the coil” without the motor effect / force idea.",
      "MP3: <b>reject</b> “the magnet changes direction”.",
      "MP4: <b>allow</b> “moves in and out”.",
      "MP6: <b>reject</b> “frequency of the current makes it louder”."
    ],
    tip: "Write it as a chain: a.c. → changing force → vibrating cone → vibrating air. Every link is a mark."
  },

  {
    title: "Electromagnetic induction",
    spec: "6.15",
    marks: 5,
    question: `<p>A coil of wire is connected to a sensitive centre-zero ammeter. A student pushes a bar magnet into the coil, holds it still inside the coil, then pulls it out.</p>
      <p class="ask">Describe and explain what the ammeter shows at each stage. Describe how the student could make the reading larger.</p>`,
    guide: [
      "A voltage is <b>induced</b> in a coil when the magnetic field through it <b>changes</b>.",
      "Go through the three stages in order: pushing in, holding still, pulling out.",
      "A centre-zero ammeter can deflect either way. Which stages give opposite deflections?",
      "Size of the induced voltage: think about speed, strength and the coil.",
      "Is the magnet moving relative to the coil when it's held still?"
    ],
    scheme: [
      ["1", "Pushing in: the needle <b>deflects</b> (a current / voltage is induced)", 1],
      ["2", "Holding still: <b>no reading</b> / needle returns to zero", 1],
      ["3", "Pulling out: the needle deflects in the <b>opposite direction</b>", 1],
      ["4", "A voltage is only induced when the magnetic field through the coil is <b>changing</b> / when there is relative motion", 1],
      ["5", "Move the magnet <b>faster</b> → bigger reading", 1],
      ["6", "Use a <b>stronger magnet</b> → bigger reading", 1],
      ["7", "Use a coil with <b>more turns</b> → bigger reading", 1]
    ],
    max: 5,
    maxText: "Any 5 from 7",
    notes: [
      "MP2: <b>reject</b> “the reading stays the same” (ambiguous). It must be zero.",
      "MP3: <b>reject</b> “it deflects again” without opposite direction.",
      "MP4: <b>reject</b> “the magnet makes electricity”.",
      "<b>Allow</b> “put an iron core in the coil” as an extra point for a bigger reading.",
      "<b>Ignore</b> “bigger magnet” unless clearly meaning stronger."
    ],
    tip: "The key word is “change”. No change in the field, no induced voltage — that's why holding the magnet still gives zero."
  },

  {
    title: "Generating electricity",
    spec: "6.15, 6.16, 2.6",
    marks: 6,
    question: `<p>A bicycle dynamo has a magnet that rotates inside a coil of wire. The dynamo is connected to a lamp.</p>
      <p class="ask">Explain how the dynamo produces a voltage and why the current in the lamp is alternating. Describe how the size of the voltage can be increased.</p>`,
    guide: [
      "The magnet rotates. What happens to the <b>magnetic field through the coil</b>?",
      "Name the process that produces the voltage.",
      "Think about the field direction through the coil after half a turn of the magnet.",
      "If the voltage changes direction, what kind of current does it produce?",
      "Size of the voltage: speed, magnet strength, the coil — and is there anything you can put inside the coil?"
    ],
    scheme: [
      ["1", "As the magnet rotates, the <b>magnetic field through the coil changes</b> / the coil cuts field lines", 1, "h"],
      ["2", "A <b>voltage is induced</b> in the coil (electromagnetic induction)", 1, "h"],
      ["3", "The circuit is complete, so a <b>current</b> flows and the lamp lights", 1, "h"],
      ["4", "The <b>field direction</b> through the coil <b>reverses</b> every half turn", 1, "h"],
      ["5", "So the induced voltage <b>changes direction</b>, giving alternating current", 1, "h"],
      ["6", "Rotate the magnet <b>faster</b> → bigger voltage (and higher frequency)", 1, "f"],
      ["7", "Use a <b>stronger magnet</b> → bigger voltage", 1, "f"],
      ["8", "Use <b>more turns</b> on the coil → bigger voltage", 1, "f"],
      ["9", "Wind the coil on an <b>iron core</b> → bigger voltage", 1, "f"]
    ],
    groups: { h: 4, f: 3 },
    max: 6,
    maxText: "Any 6 from 9 · max 4 for how, max 3 for factors",
    notes: [
      "MP2: <b>reject</b> “the magnet produces current” without induction / changing field.",
      "MP5: <b>reject</b> “a.c. because the magnet goes round” without the direction change.",
      "<b>Allow</b> “rotating a coil in a magnetic field” as an equivalent description for MP1.",
      "<b>Ignore</b> “bigger magnet” unless clearly meaning stronger."
    ],
    tip: "Faster rotation gives a bigger voltage and a higher frequency. Only the voltage is asked for here, but mentioning both shows you understand it."
  }
];

const RADIOACTIVITY = [
  {
    title: "Alpha, beta and gamma radiation",
    spec: "7.4, 7.5",
    marks: 6,
    question: `<p>Unstable nuclei can emit alpha particles, beta particles and gamma rays.</p>
      <p class="ask">Compare alpha, beta and gamma radiation in terms of what they are, how ionising they are, and how penetrating they are.</p>`,
    guide: [
      "Three properties × three types. A table in your head (or on paper) helps.",
      "<b>Nature:</b> what is each one made of? One is a wave.",
      "<b>Ionising:</b> which knocks electrons off atoms most easily? It's linked to size and charge.",
      "<b>Penetrating:</b> what stops each one? Name a specific material and thickness.",
      "Use comparison words: most, least, more than."
    ],
    scheme: [
      ["1", "Alpha is <b>2 protons and 2 neutrons</b> / a helium nucleus", 1],
      ["2", "Beta is a (fast-moving) <b>electron</b> (from the nucleus)", 1],
      ["3", "Gamma is an <b>electromagnetic wave</b>", 1],
      ["4", "Alpha is the <b>most ionising</b>", 1],
      ["5", "Gamma is the <b>least ionising</b> (beta is in between)", 1],
      ["6", "Alpha is stopped by <b>paper</b> / skin / a few cm of air", 1],
      ["7", "Beta is stopped by a <b>few mm of aluminium</b>", 1],
      ["8", "Gamma is only reduced by <b>thick lead</b> / thick concrete", 1]
    ],
    max: 6,
    maxText: "Any 6 from 8",
    notes: [
      "MP2: <b>reject</b> “beta is an electron from the shell / orbit”.",
      "MP3: <b>allow</b> “high-frequency EM radiation”. <b>Reject</b> “gamma is a particle”.",
      "MP8: <b>reject</b> “gamma is stopped by lead” with no reference to thickness. <b>Allow</b> “several cm of lead”.",
      "<b>Max 4</b> if only two of the three properties (nature, ionising, penetrating) are discussed."
    ],
    tip: "Ionising and penetrating go in opposite orders: alpha is most ionising but least penetrating; gamma is the reverse."
  },

  {
    title: "Practical: penetrating power of radiation",
    spec: "7.6, 7.9",
    marks: 6,
    question: `<p>A teacher has a radioactive source that may emit alpha, beta and gamma radiation, a Geiger–Müller (GM) tube and counter, and sheets of paper, aluminium and lead.</p>
      <p class="ask">Describe how the teacher could find out which types of radiation the source emits.</p>`,
    guide: [
      "There is always some radiation present even with no source. What must you measure first, and why?",
      "How do you keep the experiment fair from one absorber to the next?",
      "Put the absorbers in order. What does each one stop?",
      "Radioactive decay is <b>random</b>. How does that affect how you take readings?",
      "How do you decide from the readings which types are present?"
    ],
    scheme: [
      ["1", "Measure the <b>background count</b> (rate) with no source present", 1],
      ["2", "Place the source a <b>fixed distance</b> from the GM tube", 1],
      ["3", "Measure the count rate with <b>no absorber</b>", 1],
      ["4", "Place <b>paper</b>, then <b>aluminium</b>, then <b>lead</b> between the source and the tube", 1],
      ["5", "Measure the count rate for each absorber over the <b>same time</b>", 1],
      ["6", "<b>Subtract the background</b> count from each reading", 1],
      ["7", "<b>Repeat</b> and take a mean (decay is random)", 1],
      ["8", "If paper reduces the count → <b>alpha</b>; if aluminium reduces it further → <b>beta</b>; if lead is needed to reduce it → <b>gamma</b>", 1],
      ["9", "Safety: handle the source with <b>tongs</b> / keep it at arm's length / store it in a lead box", 1]
    ],
    max: 6,
    maxText: "Any 6 from 9",
    notes: [
      "<b>Max 1</b> for safety points.",
      "MP4: all three absorbers are needed, in a sensible order.",
      "MP8: <b>allow</b> any two correct deductions for the mark.",
      "MP7: “repeat” without “mean” gets <b>no credit</b>.",
      "<b>Reject</b> “wear a lead apron” as a school lab safety measure."
    ],
    tip: "Background radiation is the step most often forgotten. Without it, you can't tell whether an absorber has stopped everything."
  },

  {
    title: "Isotopes and beta decay",
    spec: "7.2, 7.3, 7.7, 7.8",
    marks: 5,
    question: `<p>Carbon-14 has an atomic (proton) number of 6 and a mass (nucleon) number of 14.</p>
      <p class="part"><span class="ask">(a) Describe the structure of a carbon-14 atom.</span> <span class="sum">(2)</span></p>
      <p class="part"><span class="ask">(b) Carbon-12 is also an isotope of carbon. State what is meant by an isotope.</span> <span class="sum">(1)</span></p>
      <p class="part"><span class="ask">(c) Carbon-14 decays by emitting a beta particle and forms nitrogen. State the mass number and atomic number of the nitrogen nucleus formed, and explain your answer.</span> <span class="sum">(2)</span></p>`,
    guide: [
      "<b>Atomic (proton) number</b> = number of protons. <b>Mass (nucleon) number</b> = protons + neutrons.",
      "Number of neutrons = mass number − atomic number.",
      "Where are the protons, neutrons and electrons in an atom?",
      "In beta decay, a neutron in the nucleus changes into a proton and an electron, and the electron is emitted.",
      "Nuclear equations must balance: mass numbers on each side add up, and so do atomic numbers."
    ],
    scheme: [
      ["a1", "<b>6 protons</b> and <b>8 neutrons</b> in the nucleus", 1, "a"],
      ["a2", "<b>6 electrons</b> orbiting / in shells around the nucleus", 1, "a"],
      ["b1", "Same number of <b>protons</b>, different number of <b>neutrons</b>", 1, "b"],
      ["c1", "Mass number stays <b>14</b> (a neutron becomes a proton, so the total number of nucleons is unchanged)", 1, "c"],
      ["c2", "Atomic number increases by 1 to <b>7</b>", 1, "c"]
    ],
    groups: { a: 2, b: 1, c: 2 },
    max: 5,
    maxText: "Total 5",
    notes: [
      "a1: both numbers needed. <b>Reject</b> 14 neutrons.",
      "b1: <b>reject</b> “same element with different mass” on its own. <b>Allow</b> “same atomic number, different mass number”.",
      "c1/c2: <b>allow</b> a correctly balanced nuclear equation: ¹⁴₆C → ¹⁴₇N + ⁰₋₁e (scores 2).",
      "c2: <b>reject</b> atomic number 5 (beta treated as losing a proton)."
    ],
    tip: "In beta decay the mass number doesn't change, but the atomic number goes up by one. In alpha decay, mass number drops by 4 and atomic number by 2."
  },

  {
    title: "Half-life",
    spec: "7.11, 7.12, 7.13",
    marks: 5,
    question: `<p>A sample of a radioactive isotope has an activity of 800 Bq. The half-life of the isotope is 6 hours.</p>
      <p class="part"><span class="ask">(a) State what is meant by half-life.</span> <span class="sum">(1)</span></p>
      <p class="part"><span class="ask">(b) Calculate the activity of the sample after 24 hours.</span> <span class="sum">(2)</span></p>
      <p class="part"><span class="ask">(c) Calculate how long it takes for the activity to fall to 100 Bq.</span> <span class="sum">(2)</span></p>`,
    guide: [
      "Activity is measured in <b>becquerels (Bq)</b>: decays per second.",
      "Half-life is about how long it takes for something to halve. What exactly halves?",
      "Count the half-lives first: how many 6-hour periods are in 24 hours?",
      "Then halve the activity that many times. Writing it out as a chain (800 → 400 → …) avoids mistakes.",
      "For (c), work backwards: how many halvings from 800 to 100?"
    ],
    scheme: [
      ["a1", "Time taken for <b>half the (unstable) nuclei</b> to decay / for the <b>activity</b> (or count rate) to <b>halve</b>", 1, "a"],
      ["b1", "24 ÷ 6 = <b>4 half-lives</b> / 800 → 400 → 200 → 100 → 50", 1, "b"],
      ["b2", "Activity = <b>50 Bq</b>", 1, "b"],
      ["c1", "800 → 400 → 200 → 100 = <b>3 half-lives</b>", 1, "c"],
      ["c2", "Time = 3 × 6 = <b>18 hours</b>", 1, "c"]
    ],
    groups: { a: 1, b: 2, c: 2 },
    max: 5,
    maxText: "Total 5",
    notes: [
      "(a) <b>Reject</b> “time for half the atoms to disappear” / “half the time it takes to decay” / “time for the mass to halve”.",
      "(b) 200 Bq (activity divided by 4) scores 0.",
      "(b) and (c): correct answers with no working score full marks.",
      "(c) <b>Allow</b> 18 h. 24 h scores c1 only if 3 half-lives is stated but multiplied wrongly."
    ],
    tip: "Count half-lives, then halve that many times. Dividing by the number of half-lives (800 ÷ 4) is the classic wrong answer."
  },

  {
    title: "Uses of radioactivity",
    spec: "7.14",
    marks: 6,
    question: `<p>Radioactive isotopes are used in medicine and industry.</p>
      <p class="ask">Choose three different uses. For each one, describe the use and explain why the type of radiation (and its half-life) is suitable.</p>`,
    guide: [
      "Each use is worth 2 marks: <b>1 for the use</b>, <b>1 for why the radiation is suitable</b>.",
      "The “why” depends on <b>penetrating power</b> (does it need to get through the body or material?) and <b>ionising power</b> (does it need to kill cells?).",
      "Think about half-life too: should the source stay active for hours, or for years?",
      "Be specific: “medical uses” won't score, “a tracer to check a patient's kidneys” will.",
      "Only your first three uses will be marked."
    ],
    scheme: [
      ["1a", "First use: described correctly", 1],
      ["1b", "First use: why the radiation / half-life is suitable", 1],
      ["2a", "Second use: described correctly", 1],
      ["2b", "Second use: why the radiation / half-life is suitable", 1],
      ["3a", "Third use: described correctly", 1],
      ["3b", "Third use: why the radiation / half-life is suitable", 1]
    ],
    max: 6,
    maxText: "Total 6",
    subTable: {
      heading: "Acceptable uses and reasons",
      rows: [
        ["Medical tracer", "Injected / swallowed to show how an organ works", "Gamma penetrates the body to be detected outside; short half-life so it doesn't stay active in the body"],
        ["Radiotherapy", "Treating cancer", "Gamma beams penetrate the body and kill cancer cells"],
        ["Sterilising", "Medical equipment / food", "Gamma kills bacteria and penetrates the packaging"],
        ["Thickness monitoring", "Paper / aluminium foil production", "Beta is partly absorbed, so a change in count rate shows a change in thickness; long half-life so the count stays steady"],
        ["Smoke detector", "Detecting smoke in homes", "Alpha ionises the air; smoke absorbs the alpha, so the current drops and the alarm sounds"],
        ["Leak detection", "Finding leaks in underground pipes", "Gamma tracer penetrates the ground; short half-life"],
        ["Dating", "Carbon-14 dating of old organic material", "Known half-life lets the age be worked out from the activity remaining"]
      ]
    },
    notes: [
      "Only mark the <b>first three</b> uses.",
      "A reason (b) can only be awarded if it matches a correct use (a).",
      "<b>Reject</b> alpha for any use that requires penetration (tracers, sterilising).",
      "<b>Reject</b> “gamma because it's the strongest” — penetrating or ionising must be specified.",
      "<b>Ignore</b> safety statements."
    ],
    tip: "The type of radiation is always chosen for a reason: to get through something, or to be stopped by something. Say which."
  },

  {
    title: "Irradiation, contamination and radioactive waste",
    spec: "7.10, 7.15, 7.16",
    marks: 6,
    question: `<p>People who work with radioactive materials must be protected from both irradiation and contamination.</p>
      <p class="ask">Explain the difference between irradiation and contamination. Describe the dangers of ionising radiation and how the risks from radioactive waste can be reduced.</p>`,
    guide: [
      "<b>Irradiation:</b> being exposed to radiation from a source <b>outside</b> you.",
      "<b>Contamination:</b> radioactive material getting <b>onto or into</b> something.",
      "Which is more dangerous once it's happened, and why?",
      "Ionising radiation can damage cells and DNA. What can that lead to?",
      "Waste can stay radioactive for a very long time. How is it stored safely?"
    ],
    scheme: [
      ["1", "Irradiation: exposure to radiation from a source <b>outside</b> the body; the object does <b>not become radioactive</b>", 1],
      ["2", "Contamination: radioactive material gets <b>onto or into</b> the body / an object", 1],
      ["3", "Contamination continues until the material is <b>removed</b> or decays, so it can be more dangerous", 1],
      ["4", "Ionising radiation <b>damages cells and tissue</b>", 1],
      ["5", "It can cause <b>mutations</b> in DNA, which can lead to <b>cancer</b>", 1],
      ["6", "Some waste has a <b>long half-life</b>, so it stays radioactive for thousands of years", 1],
      ["7", "Waste is sealed in containers (glass / steel / concrete) and <b>buried deep underground</b> in stable rock", 1],
      ["8", "Stored securely / away from water supplies / monitored", 1]
    ],
    max: 6,
    maxText: "Any 6 from 8",
    notes: [
      "MP1: <b>reject</b> “irradiation makes things radioactive”.",
      "MP5: <b>reject</b> “radiation causes cancer” on its own without mutation/DNA/cell damage. <b>Allow</b> MP4 for it.",
      "MP7: <b>reject</b> “thrown into the sea” / “put in landfill”.",
      "<b>Max 4</b> if the difference between irradiation and contamination isn't explained."
    ],
    tip: "An irradiated object is not radioactive afterwards. Food sterilised with gamma rays is safe to eat — that's the difference."
  },

  {
    title: "Fission and nuclear reactors",
    spec: "7.17, 7.18, 7.19, 7.20, 7.21, 7.22",
    marks: 6,
    question: `<p>Nuclear power stations release energy from the fission of uranium-235.</p>
      <p class="ask">Describe how fission of uranium-235 leads to a chain reaction, and explain how the chain reaction is controlled in a nuclear reactor.</p>`,
    guide: [
      "Start with what triggers fission: what does a U-235 nucleus absorb?",
      "What does the nucleus split into, and what else is released?",
      "<b>Chain reaction:</b> how can one fission cause more fissions?",
      "Reactor parts: the <b>moderator</b>, the <b>control rods</b> and the <b>shielding</b>. Say what each one does to neutrons or radiation.",
      "In what form is the energy released?"
    ],
    scheme: [
      ["1", "A U-235 nucleus absorbs a (slow) <b>neutron</b>", 1],
      ["2", "It becomes unstable and <b>splits</b> into two smaller (radioactive) <b>daughter nuclei</b>", 1],
      ["3", "Releasing <b>2 or 3 neutrons</b> and <b>energy</b> (as kinetic energy of the products)", 1],
      ["4", "These neutrons cause further fissions → a <b>chain reaction</b>", 1],
      ["5", "The <b>moderator</b> (graphite / water) <b>slows down</b> neutrons so they are more likely to be absorbed", 1],
      ["6", "<b>Control rods</b> (boron) <b>absorb neutrons</b>", 1],
      ["7", "Control rods are lowered / raised to control the rate, so that on average <b>one neutron</b> from each fission causes another", 1],
      ["8", "<b>Shielding</b> (thick concrete / steel) absorbs radiation, protecting workers", 1]
    ],
    max: 6,
    maxText: "Any 6 from 8",
    notes: [
      "MP1: <b>reject</b> “a proton hits the nucleus” / “an atom splits” without neutron absorption.",
      "MP5: <b>reject</b> “the moderator slows down the reaction” — this loses MP5.",
      "MP6: <b>reject</b> “control rods slow down neutrons” — this loses MP6.",
      "<b>Max 4</b> if the reactor parts are not discussed."
    ],
    tip: "The moderator and control rods are always confused. Moderator slows neutrons down; control rods absorb them."
  },

  {
    title: "Nuclear fusion",
    spec: "7.23, 7.24, 7.25, 7.26",
    marks: 5,
    question: `<p>Stars release energy by nuclear fusion.</p>
      <p class="ask">Explain the difference between nuclear fusion and nuclear fission. Explain why fusion only happens at very high temperatures and pressures.</p>`,
    guide: [
      "Fission <b>splits</b> nuclei. Fusion…?",
      "Where does the energy released by fusion come from? Think about mass.",
      "All nuclei contain protons. What charge do they have, and what happens when two nuclei get close?",
      "High <b>temperature</b>: what does it do to how fast nuclei move?",
      "High <b>pressure</b>: what does it do to how close together the nuclei are?"
    ],
    scheme: [
      ["1", "Fission: a large nucleus <b>splits</b> into smaller nuclei", 1],
      ["2", "Fusion: small nuclei <b>join</b> to form a larger nucleus", 1],
      ["3", "In fusion, some <b>mass is lost</b> and released as energy", 1],
      ["4", "Nuclei are <b>positively charged</b> (protons), so they <b>repel</b> each other (electrostatic repulsion)", 1],
      ["5", "High <b>temperature</b> gives nuclei enough <b>kinetic energy</b> / speed to overcome the repulsion", 1],
      ["6", "High <b>pressure</b> / density brings nuclei close together so they <b>collide more often</b>", 1],
      ["7", "Fusion is the <b>energy source of stars</b> (e.g. hydrogen fusing into helium in the Sun)", 1]
    ],
    max: 5,
    maxText: "Any 5 from 7",
    notes: [
      "MP2: <b>reject</b> “atoms join” — it must be nuclei. <b>Allow</b> “nuclei fuse”.",
      "MP4: <b>reject</b> “protons attract” / “electrons repel”.",
      "MP5: <b>reject</b> “heat makes them stick together”.",
      "<b>Max 3</b> if the reason for high temperature is not linked to repulsion."
    ],
    tip: "The high temperature isn't to “start” the reaction — it's so nuclei move fast enough to get close despite repelling each other."
  }
];

const ASTRO = [
  {
    title: "Gravity and orbits",
    spec: "8.4, 8.5",
    marks: 6,
    question: `<p>Moons, planets, comets and artificial satellites all move in orbits.</p>
      <p class="ask">Explain how gravity causes objects to orbit. Describe the differences between the orbits of moons, planets and comets, and explain why a comet's speed changes during its orbit.</p>`,
    guide: [
      "Gravitational force acts <b>towards</b> the larger body. Does it change the object's speed, its direction, or both?",
      "What does each type of object orbit? (Planets orbit…, moons orbit…, comets orbit…)",
      "Compare the <b>shape</b> of the orbits: nearly circular or very stretched (elliptical)?",
      "How does the strength of gravity change with distance from the Sun?",
      "Link the comet's changing distance to its changing speed."
    ],
    scheme: [
      ["1", "Gravitational force acts <b>towards the centre</b> of the larger body (the Sun / planet)", 1],
      ["2", "This force continuously <b>changes the direction</b> of motion, keeping the object in a curved path / orbit", 1],
      ["3", "Planets orbit the <b>Sun</b>; moons orbit <b>planets</b>; comets orbit the Sun", 1],
      ["4", "Planets (and moons) have <b>nearly circular</b> orbits", 1],
      ["5", "Comets have very <b>elliptical</b> (stretched) orbits", 1],
      ["6", "A comet <b>speeds up</b> as it gets closer to the Sun and <b>slows down</b> as it moves away", 1],
      ["7", "Because the gravitational force is <b>stronger closer to the Sun</b>", 1],
      ["8", "Comets have much <b>longer orbital periods</b> / orbits can be in a different plane to the planets'", 1]
    ],
    max: 6,
    maxText: "Any 6 from 8",
    notes: [
      "MP2: <b>reject</b> “gravity pulls it round in a circle” without the direction idea.",
      "MP3: all three needed. <b>Allow</b> artificial satellites orbit the Earth as an extra.",
      "MP5: <b>allow</b> “oval”. <b>Reject</b> “irregular”.",
      "MP7: <b>reject</b> “the Sun pulls it faster” without reference to distance or force strength."
    ],
    tip: "Gravity in an orbit changes direction, not just speed. That's why something can orbit at a constant speed and still be accelerating."
  },

  {
    title: "Orbital speed and gravitational field strength",
    spec: "8.2, 8.3, 8.6",
    marks: 6,
    question: `<p>A communications satellite orbits the Earth once every 24 hours. Its orbital radius is 42 000 km.</p>
      <p class="part"><span class="ask">(a) Calculate the orbital speed of the satellite in m/s.</span> <span class="sum">(3)</span></p>
      <p class="part"><span class="ask">(b) The gravitational field strength on the Moon is 1.6 N/kg. On Earth it is 10 N/kg. Explain why they are different.</span> <span class="sum">(2)</span></p>
      <p class="part"><span class="ask">(c) Put these in order of size, smallest first: the Milky Way, the universe, our solar system.</span> <span class="sum">(1)</span></p>`,
    guide: [
      "<b>orbital speed = (2 × π × orbital radius) ÷ time period</b> &nbsp;(v = 2πr ÷ T)",
      "Convert first: km to m (× 1000) and hours to seconds (× 3600).",
      "Gravitational field strength depends on the <b>mass</b> of the planet or moon (and its size).",
      "<b>Universe</b>: billions of galaxies. <b>Galaxy</b>: billions of stars.",
      "Give your speed in standard form if it helps: 1 km = 10³ m."
    ],
    scheme: [
      ["a1", "Conversion: r = 4.2 × 10⁷ m and T = 86 400 s", 1, "a"],
      ["a2", "Substitution: v = 2 × π × 4.2 × 10⁷ ÷ 86 400", 1, "a"],
      ["a3", "v = <b>3100 m/s</b> (3054 m/s)", 1, "a"],
      ["b1", "Gravitational field strength depends on the <b>mass</b> of the body", 1, "b"],
      ["b2", "The Moon has a much <b>smaller mass</b> than the Earth, so its field is weaker", 1, "b"],
      ["c1", "<b>Solar system → Milky Way → universe</b>", 1, "c"]
    ],
    groups: { a: 3, b: 2, c: 1 },
    max: 6,
    maxText: "Total 6",
    notes: [
      "(a) Correct answer with no working scores <b>3 marks</b>. <b>Allow</b> any value rounding to 3.1 × 10³ m/s.",
      "(a) 3.05 m/s or 3054 km/s (km not converted, or units confused) scores a2 only.",
      "(a) 1.1 × 10⁷ (hours not converted) scores a2 only.",
      "(b) <b>Allow</b> “depends on mass and radius”. <b>Reject</b> “the Moon has less gravity” on its own.",
      "(b) <b>Reject</b> “there's no atmosphere on the Moon”."
    ],
    tip: "Orbital speed questions always need two conversions. Do km → m and hours → s before anything else."
  },

  {
    title: "The life cycle of a star like the Sun",
    spec: "8.9",
    marks: 6,
    question: `<p>The Sun is a main sequence star.</p>
      <p class="ask">Describe the life cycle of a star with a similar mass to the Sun, from its formation to the end of its life.</p>`,
    guide: [
      "The stages in the spec: <b>nebula → main sequence star → red giant → white dwarf</b>.",
      "For each stage, say <b>what happens</b> and <b>why</b> — not just the name.",
      "What force pulls the nebula together? What starts when it gets hot enough?",
      "Why is a main sequence star stable for so long? Think about two forces balancing.",
      "What runs out to end the main sequence stage?"
    ],
    scheme: [
      ["1", "Starts as a <b>nebula</b>: a cloud of dust and gas (mainly hydrogen)", 1],
      ["2", "<b>Gravity</b> pulls the gas together; it gets hotter (forming a protostar)", 1],
      ["3", "<b>Fusion</b> of hydrogen into helium begins → <b>main sequence</b> star", 1],
      ["4", "It is stable because the outward pressure (from fusion energy) <b>balances</b> the inward pull of gravity", 1],
      ["5", "When the <b>hydrogen runs out</b>, it expands into a <b>red giant</b>", 1],
      ["6", "The outer layers drift away (planetary nebula)", 1],
      ["7", "The core is left as a <b>white dwarf</b>: small, hot and dense", 1],
      ["8", "The white dwarf slowly <b>cools</b> (becoming a black dwarf)", 1]
    ],
    max: 6,
    maxText: "Any 6 from 8",
    notes: [
      "<b>Max 3</b> for a list of stage names in the correct order with no description.",
      "MP3: <b>reject</b> “burning hydrogen” / “combustion”. It must be fusion.",
      "MP4: <b>allow</b> “forces are balanced” only if both forces are named.",
      "<b>Reject</b> supernova, neutron star or black hole for a Sun-sized star — this loses MP7."
    ],
    tip: "A list of stage names gets you three marks at most. The rest comes from saying what happens and why."
  },

  {
    title: "Star colour and the life cycle of massive stars",
    spec: "8.7, 8.8, 8.10",
    marks: 6,
    question: `<p>Stars can be classified by their colour. Some stars have a much larger mass than the Sun.</p>
      <p class="part"><span class="ask">(a) Explain how the colour of a star is related to its temperature.</span> <span class="sum">(2)</span></p>
      <p class="part"><span class="ask">(b) Describe what happens to a star with a much larger mass than the Sun after its main sequence stage.</span> <span class="sum">(4)</span></p>`,
    guide: [
      "A star's colour depends on its <b>surface temperature</b>.",
      "Think of a metal being heated: it glows red first, then yellow, then white. Stars follow the same order, and go further.",
      "Massive stars follow a different path from the Sun after the main sequence. They don't become white dwarfs.",
      "What kind of giant? What kind of explosion? What can be left behind?",
      "The answer depends on how massive the star is. Give both possible endings."
    ],
    scheme: [
      ["a1", "Colour depends on the star's (surface) <b>temperature</b>", 1, "a"],
      ["a2", "<b>Red</b> stars are the <b>coolest</b>; <b>blue</b> (blue-white) stars are the <b>hottest</b>", 1, "a"],
      ["b1", "When the hydrogen runs out it becomes a <b>red supergiant</b>", 1, "b"],
      ["b2", "It explodes as a <b>supernova</b>", 1, "b"],
      ["b3", "The core is left as a <b>neutron star</b>", 1, "b"],
      ["b4", "If the star is very massive, the core becomes a <b>black hole</b>", 1, "b"],
      ["b5", "The supernova spreads elements into space, forming new nebulae", 1, "b"]
    ],
    groups: { a: 2, b: 4 },
    max: 6,
    maxText: "Total 6 · (b) any 4 from 5",
    notes: [
      "a2: <b>allow</b> the full order red → orange → yellow → white → blue as temperature increases.",
      "a2: <b>reject</b> “red is hottest”.",
      "b1: <b>allow</b> “red giant” only if “super” or “larger than the Sun's” is implied.",
      "b3/b4: <b>reject</b> “white dwarf” for a massive star — loses b3."
    ],
    tip: "Blue stars are hotter than red ones — the opposite of the colours on a tap. Hot = blue, cool = red."
  }
];

const TOPICS = [
  { id: "forces", num: 1, color: "#2457d6", name: "Forces and motion", section: "Physics section 1", questions: FORCES },
  { id: "electricity", num: 2, color: "#b8650b", name: "Electricity", section: "Physics section 2", questions: ELECTRICITY },
  { id: "waves", num: 3, color: "#0e8487", name: "Waves and the electromagnetic spectrum", section: "Physics section 3", questions: WAVES },
  { id: "energy", num: 4, color: "#c73a4f", name: "Energy resources and energy transfers", section: "Physics section 4", questions: ENERGY },
  { id: "slg", num: 5, color: "#6a4c93", name: "Solids, liquids and gases", section: "Physics section 5", questions: SLG },
  { id: "magnetism", num: 6, color: "#1f8a4c", name: "Magnetism and electromagnetism", section: "Physics section 6", questions: MAGNETISM },
  { id: "radioactivity", num: 7, color: "#a8177f", name: "Radioactivity and particles", section: "Physics section 7", questions: RADIOACTIVITY },
  { id: "astro", num: 8, color: "#3d4f66", name: "Astrophysics", section: "Physics section 8", questions: ASTRO }
];

(function assignIds() {
  const slug = s => s.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  TOPICS.forEach(t => t.questions.forEach((q, i) => {
    q.id = t.id + "-" + slug(q.title);
    q.n = i + 1;
  }));
})();
