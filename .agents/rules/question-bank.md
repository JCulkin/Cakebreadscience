---
trigger: model_decision
description: The question bank (interactive/spec-quiz/questions.js, gens.js, diagrams.js, diagq.js) — writing or fixing questions, generators, code-drawn diagram questions, difficulty levels, quality rules, the bank checker. Use whenever questions or diagram makers are added or changed.
---
# The question bank

## Files and ids
- `interactive/spec-quiz/questions.js`: `M(id, question, [correct, wrong, wrong, wrong], why)` (**correct first**; pages shuffle),
  `T(id, statement, true|false, why)`, `MH` / `TH` = ★ harder. Ids `<point>-NN` (`P3.5-03`).
- `gens.js`: generators `G('P3.5-g1', r => ({q, o, x}), hard)` / `eqGen`; calculation ids go in `CALC_IDS`.
  Gotcha: `R.opts` drops non-positive values and `R.n` returns a string — pass raw numbers; build negative/zero options by hand.
- `diagrams.js` (`DG`): ~57 code-drawn diagram makers (graphs, circuits, dot-and-cross, cells, heart, eye, food webs, Sankey, ray
  diagrams…), pure SVG, **seeded**: `DG.make(name, hard, seed)` redraws the same picture in any browser. Browse them at
  `/interactive/spec-quiz/diagram-lab.html`.
- `diagq.js` (`DQ`): 219 permanent diagram question ids `<point>-dN`; `LIST` rows `[id, maker, ★, regex the question must match]`.
  `DQ.make(id[, seed])`, `DQ.fig(q)` (drawing above the question, tap to enlarge), `DQ.order(opts)` for letter answers.
  Save `q.seed` with any stored answer (set-work tests do) so the same drawing can be shown again.
- **Ids are permanent**: never renumber, reuse or delete; fix wording in place; new ones get the next free number.
  Add questions in bulk with `python tools/spec-quiz/merge_new.py questions.js scratch.js` (scratch uses bare ids like `M('B2.8', …)`).
- Nuclide notation: `<span class="nuc"><sup>14</sup><sub>6</sub>C</span>`.

## Levels (every question has `q.lv`)
- 1 recall · 2 explain / apply / calculate / read a diagram · 3 ★ several steps, data or a trap. Set automatically by `setLevel(q)` in
  questions.js; hand overrides in `LEVEL[id]`. `q.hard` must equal `lv === 3`.

## Quality rules (the user's and Claude's audits)
- **Wrong options = real student mistakes, similar length to the right one, no joke options.** First drafts tend to make the correct option the
  longest and true/false mostly true: check both (keep T/F about half true; correct option longest in at most ~25%).
- List the existing questions on a point before writing new ones (no duplicates). Stay inside the **Double Award** spec wording.
- Diagrams: either drawn to scale and labelled "Drawn to scale" (with a scale bar if a reading is asked) or labelled "Not to scale".
  Dot-and-cross: outer shells only by default; shared electrons in one column in the overlap; lone pairs on the shell; repeated ions stacked.
  Vary units and prefixes (not always cm or s). Double Award only (no electrolysis, transformers, moments, solubility curves…).
- Single Award: questions beyond the Single Award wording are listed in `/js/course.js` `DA_ONLY`; add to it when you write one.
- Students report questions (⚑) → `/interactive/spec-quiz/reports.html`; fix the wording in place, never change the id.

## Checks (after every change)
- `node tools/spec-quiz/check_bank.js interactive/spec-quiz` → **problems 0** (it also rolls each diagram id 40 times and checks levels).
- `node tools/spec/build_index.js` → commit `js/spec-index.js`.
- Any change re-queues the question for the user's review automatically (fingerprint). If he asked for the edit on a checked question:
  `node tools/review/keep.js q <ids> --why "user asked: …"` and commit `admin/review-approved.json`.

## Pages that show bank questions
Load `/interactive/cell-game/cells.js`, `/interactive/spec-quiz/diagrams.js`, then `diagq.js` after `gens.js` (once); put `DQ.fig(q)` above
the question text; pass options through `DQ.order`; save `q.seed` with stored answers. Pages that only count questions need just `diagq.js`.
Lessons use **frozen copies** in `interactive/lessons/assets/` — tell the user if you change a maker the lessons use.

## Key words — `/js/key-words.js`
- See `.agents/rules/flashcards.md` for the single-source-of-truth rules (`window.KEYWORDS`, optional `'DA'` Single Award flag, Review → Key words).
