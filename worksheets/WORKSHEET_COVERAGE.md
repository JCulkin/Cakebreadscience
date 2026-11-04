# Worksheet Coverage Map

Which spec points each science worksheet covers, taken from the spec line printed on each sheet (Nov 2026).
Spec = Pearson Edexcel International GCSE Science (Double Award), see `specifications/science.html`.
Standards for building sheets are in `worksheets.md`.

Coverage score key (for future audits):
- 0 = Missing
- 1 = Mentioned only
- 2 = Directly tested (intro level)
- 3 = Fully covered with varied question types

---

## Physics (31 topic sheets, plus 3b Practice and Challenge)

| Sheet | Spec line on sheet |
|---|---|
| `physics/1b_distance_time.html` | 1.3–1.4 |
| `physics/1c_velocity_time_suvat.html` | 1.6–1.10 |
| `physics/1d_forces_stopping_distance.html` | 1.15–1.21 |
| `physics/1e_momentum_elasticity.html` | 1.11–1.14, 1.22–1.24 |
| `physics/2b_series_parallel.html` | 2.7–2.19 |
| `physics/2c_ohms_law.html` | 2.9–2.13 |
| `physics/2d_charge_energy_power.html` | 2.4–2.5, 2.14–2.21 |
| `physics/2e_iv_characteristics.html` | 2.9–2.12 |
| `physics/2f_mains_electricity.html` | 2.2–2.6 |
| `physics/3b_wave_speed.html` | 3.1–3.8 |
| `physics/3b_wave_speed_practice.html` (+ `_ms`) | 3.1, 3.5–3.7 · Practice |
| `physics/3b_wave_speed_challenge.html` (+ `_ms`) | 1.4, 3.5–3.7 · Challenge |
| `physics/3c_em_spectrum.html` | 3.10–3.13 |
| `physics/3d_reflection_refraction.html` | 3.14–3.22 |
| `physics/3e_sound.html` | 3.2, 3.23 |
| `physics/4b_efficiency_sankey.html` | 4.2–4.5 |
| `physics/4c_thermal_transfer.html` | 4.6–4.10 |
| `physics/4d_work_power.html` | 4.11–4.17 |
| `physics/5b_density.html` | 5.3–5.4 |
| `physics/5c_pressure_fluids.html` | 5.5–5.7 |
| `physics/5d_gas_particles_temp.html` | 5.15–5.19 |
| `physics/5e_gas_laws.html` | 5.20–5.22 |
| `physics/6b_field_patterns.html` | 6.1–6.7 |
| `physics/6c_electromagnets.html` | 6.8–6.14 |
| `physics/6d_motor_effect.html` | 6.12–6.14 |
| `physics/6e_induction_generators.html` | 6.15–6.16 |
| `physics/7b_nuclear_equations.html` | 7.1–7.8 |
| `physics/7c_half_life.html` | 7.11–7.13 |
| `physics/7d_fission_fusion.html` | 7.17–7.26 |
| `physics/7e_radiation_safety.html` | 7.9–7.16 |
| `physics/8b_orbits_gravity.html` | 8.1–8.6 |
| `physics/8c_star_colour_temperature.html` | 8.7–8.8 |
| `physics/8d_stellar_evolution.html` | 8.9–8.10 |

Outside every sheet's spec line: 3.9 (all waves can be reflected and refracted) and the units points 1.1, 2.1, 4.1, 5.1 (units are practised throughout, but no sheet lists them). Everything else falls inside at least one range.

---

## Chemistry (14 topic sheets)

| Sheet | Spec line on sheet |
|---|---|
| `chemistry/1a_particles_separation.html` | 1.1–1.10 |
| `chemistry/1b_atomic_structure_bonding.html` | 1.14–1.51 |
| `chemistry/1c_stoichiometry_moles.html` | 1.17, 1.25–1.33 |
| `chemistry/2a_group1_alkali_metals.html` | 2.1–2.3 |
| `chemistry/2b_halogens.html` | 2.5–2.7 |
| `chemistry/2c_atmosphere.html` | 2.9–2.13 |
| `chemistry/2d_reactivity_series.html` | 2.15–2.20 |
| `chemistry/2e_acids_alkalis_titrations.html` | 2.28–2.32 |
| `chemistry/2f_acids_bases_salts.html` | 2.34–2.39 |
| `chemistry/2g_chemical_tests.html` | 2.44–2.50 |
| `chemistry/3a_energy_reactions.html` | 3.1–3.8 |
| `chemistry/3b_rates_equilibrium.html` | 3.9–3.18 |
| `chemistry/4a_crude_oil_alkanes.html` | 4.1–4.18 |
| `chemistry/4b_alkenes_further_organic.html` | 4.19–4.28 |

Known issues:
- `4b_alkenes_further_organic.html` includes alcohols and carboxylic acids (4.29+), which are Chemistry-only, not Double Award. Label as extension or remove.
- `1b_atomic_structure_bonding.html` spans 1.14–1.51 in one sheet; a candidate for splitting if the bank grows.
- Outside every sheet's spec line: 2.21 (acid + metal practical) and 2.42 (copper sulfate crystals practical).
- `4b` covers addition polymers (4.44–4.47) in its content, but its spec line stops at 4.28. Relabel.

---

## Biology (18 sheets)

| Sheet | Spec line on sheet |
|---|---|
| `biology/practical_variables.html` | Scientific skills |
| `biology/1a_characteristics_classification.html` | 1.1–1.4 |
| `biology/2a_cells_organisation.html` | 2.1–2.16 |
| `biology/2b_biological_molecules_enzymes.html` | 2.7–2.13 |
| `biology/2c_plant_nutrition.html` | 2.18–2.22 |
| `biology/2d_nutrition_digestion.html` | 2.24–2.32 |
| `biology/2e_respiration.html` | 2.34–2.38 |
| `biology/2f_human_gas_exchange.html` | 2.46–2.49 |
| `biology/2g_plant_transport.html` | 2.51–2.58 |
| `biology/2h_human_circulation.html` | 2.59–2.69 |
| `biology/2i_plant_gas_exchange.html` | 2.39–2.45, 2.70 |
| `biology/2j_human_excretion.html` | 2.70–2.75 |
| `biology/2k_plant_coordination.html` | 2.82–2.85 |
| `biology/2l_human_coordination.html` | 2.76–2.81 |
| `biology/3a_genetics_inheritance.html` | 3.1–3.33 |
| `biology/3b_evolution_selection.html` | 3.34–3.39 |
| `biology/4a_ecology.html` | 4.1–4.17 |
| `biology/5a_biological_resources.html` | 5.1–5.16 |

Known issues:
- Several spec lines use Biology-only numbering: 2.39–2.45, 2.55–2.58 and 2.72–2.79 are not in the Double Award spec. `2i`, `2g`, `2j` and `2l` need their spec lines (and possibly content) checking.
- `2l_human_coordination.html` is labelled 2.76–2.81 but its questions cover reflexes, synapses, homeostasis, blood glucose and temperature control, which is Double Award 2.80–2.94 territory. Relabel.

Gaps still to close (from the original plan; not yet re-checked against sheet content):
- 2.91–2.92 Eye structure, accommodation and light response
- 2.94 Hormones overview (adrenaline, insulin, testosterone, progesterone, oestrogen)
- 2.67 Coronary heart disease risk factors
- 2.23 Photosynthesis practicals (starch test; light/CO2/chlorophyll requirements)
- 2.39 Respiration practical (CO2/heat from respiring seeds)
- 3.3–3.4 Pollination and fertilisation in flowering plants
- 3.5 Seed germination practical
- 3.7 Asexual reproduction methods (natural and artificial)
- 3.22 Polygenic inheritance and variation
- 3.24 Pedigree diagrams
- 3.26–3.27 Sex determination using genetic diagrams

---

## Next audit steps
1. For each sheet, score each spec point 0–3 against the actual questions (not just the spec line).
2. Fix mislabelled spec lines (biology above).
3. Close the gaps listed, as topic sheets or as Practice sheets.
