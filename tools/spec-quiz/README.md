# Spec Quiz tools

`interactive/spec-quiz/spec.js` is generated from the Edexcel International GCSE Science (Double Award) spec PDF:

    pdftotext -layout spec.pdf lay.txt
    python3 -I parse_spec.py lay.txt spec.json
    python3 -I build_specjs.py spec.json ../../interactive/spec-quiz/spec.js

Physics equations are typed in by hand in `build_specjs.py` (EQ) because the PDF fractions don't extract cleanly.

## Adding questions
Edit `interactive/spec-quiz/questions.js`. Every question has a **permanent id**: spec point + number (`P3.5-03`). Campaign progress is saved against these ids, so never renumber, reuse or delete one — give a new question the next free number for its point, and fix wording in place.
- `M(id, question, [correct, wrong, wrong, wrong], explanation)` — correct option FIRST; options are shuffled when shown.
- `T(id, statement, true|false, explanation)`.
- `MH` / `TH` — the same, marked ★ harder (200 points in team mode; hidden if "Include harder questions" is unticked).
- Randomised calculations: `gens.js`, `G('P3.5-g1', r => ({ q, o: [correct, ...3 wrong], x }), hard?)`. Fresh numbers every time.
- Calculation questions: add their ids to `CALC_IDS` at the bottom of `gens.js`. Team mode leaves them out unless "Include calculation questions" is ticked (default off); solo has the same toggle (default on).
- Quality rules (audited 7 Nov): the correct option must NOT usually be the longest — write distractors of similar length that state real misconceptions; keep true/false roughly half true, half false. `merge_new.py`-style workflow: write new questions with bare spec ids (`M('P3.5', …)`) in a scratch file, then number them from the next free number per point.
- Nuclide notation: `<span class="nuc"><sup>14</sup><sub>6</sub>C</span>`.
- Check the bank: `node check_bank.js interactive/spec-quiz` (validates ids, spec points, options, and runs each generator 3000 times).

## Campaign (campaign.js, rewards.js)
- Question secured = right first time in two sessions on different days; wrong drops it back. T/F counts half. Point secured = secured value ≥ min(4, total). Rusty after 21 days without a correct answer on that point.
- XP: 5 per correct (10 if ★), +20 per question secured, +100 the first time a point is secured. 15 ranks mixing US Army and Star Wars (RANKS in rewards.js).
- Badges: sub-topic / topic / subject (topic and subject only once every non-Units sub-topic has questions) + 20 milestones. Gear: one Italian item per topic + 7 for questions secured. Legends: The Cure (Biology), Philosopher's Stone (Chemistry), The Bomb (Physics), held by the most correct answers in that subject on the board.
- Saved to Firestore `users/{uid}.specQuiz` (+ `specQuizSummary`), board in Realtime Database `specQuizBoard/{uid}`. Signed-out progress stays in localStorage and merges on sign-in.
- Test with a fake date: `?today=2026-12-10`.
