# Spec Quiz tools

`interactive/spec-quiz/spec.js` is generated from the Edexcel International GCSE Science (Double Award) spec PDF:

    pdftotext -layout spec.pdf lay.txt
    python3 -I parse_spec.py lay.txt spec.json
    python3 -I build_specjs.py spec.json ../../interactive/spec-quiz/spec.js

Physics equations are typed in by hand in `build_specjs.py` (EQ) because the PDF fractions don't extract cleanly.

## Adding questions
Edit `interactive/spec-quiz/questions.js`. Each question is tied to one spec point id: subject letter + spec number (`B2.3`, `C1.38`, `P3.5`).
- `M(id, question, [correct, wrong, wrong, wrong], explanation)` — put the correct option FIRST; options are shuffled when shown.
- `T(id, statement, true|false, explanation)`.
- Nuclide notation: `<span class="nuc"><sup>14</sup><sub>6</sub>C</span>`.
The picker counts questions per point automatically; points with none show "no questions yet".
