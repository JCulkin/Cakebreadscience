# Worksheets: Standards and Plan

How worksheets on cakebreadscience.com are built, named, styled and printed. Read this before making or changing a worksheet.

## What exists (Nov 2026)

| Folder | Count | Index page |
|---|---|---|
| `worksheets/physics/` | 31 topic sheets | `worksheets/science.html` |
| `worksheets/chemistry/` | 14 topic sheets | `worksheets/science.html` |
| `worksheets/biology/` | 18 topic sheets | `worksheets/science.html` |
| `worksheets/maths/` | 19 sheets | `worksheets/maths.html` |
| `worksheets/cross-curricular/` | 1 sheet | `worksheets/cross-curricular.html` |

There is no `worksheets/index.html`; the three pages above are the indexes.
Spec coverage per sheet is tracked in `WORKSHEET_COVERAGE.md`.

## Two kinds of worksheet

### 1. Topic sheets (the existing bank)
- One sheet per subtopic, covering the whole subtopic at an introductory level: definitions, calculations, a practical question.
- Flowing web page that also prints. Uses `css/{subject}.css`, which imports `css/worksheet.css`.
- Mark scheme sits at the bottom of the same file (class `mark-scheme`).
- Equations use MathJax.
- Templates: `admin/templates/{SUBJECT}_TEMPLATE.html`.

### 2. Practice and Challenge sheets (new layer, from Nov 2026)
- Sit on top of a topic sheet and drill one skill in depth (e.g. wave-speed calculations).
  - **Practice**: reminders, worked examples, scaffolded sections building from single-step to multi-step.
  - **Challenge**: fewer, harder multi-step questions with large working space, marks per question. Aimed at high-ability Year 11.
- Built as fixed A4 pages (`<div class="page">` = one side of A4), so they always print on exactly the intended number of sides.
- Shared stylesheet: `css/print-sheet.css`. It reads the subject colour variables, so pages link both `css/{subject}.css` and `css/print-sheet.css`.
- Mark scheme is a **separate file** (`..._ms.html`), linked from the sheet but not printed with it.
- Equations are plain Unicode text (v = f × λ, 6.5 × 10⁻⁷ m), not MathJax. They print instantly and reliably. Use MathJax only if a sheet needs real fractions, roots or stacked notation.

## Naming

Filenames follow the subtopic code used in `science.html`:

```
worksheets/{subject}/{code}_{short_title}.html                 topic sheet
worksheets/{subject}/{code}_{short_title}_practice.html        practice sheet
worksheets/{subject}/{code}_{short_title}_practice_ms.html     its mark scheme
worksheets/{subject}/{code}_{short_title}_challenge.html       challenge sheet
worksheets/{subject}/{code}_{short_title}_challenge_ms.html    its mark scheme
```

Example: `physics/3b_wave_speed.html`, `physics/3b_wave_speed_practice.html`, `physics/3b_wave_speed_challenge.html`.

Maths sheets use the older `1.1_topic_name.html` pattern; leave them as they are.

## Subject identity

Every sheet must show which science it is at a glance:

| Subject | Main colour | Dark colour | Symbol |
|---|---|---|---|
| Physics | `#d08000` amber | `#7a4a00` | 🚀 |
| Chemistry | `#c8001e` red | `#8c0013` | 🧪 |
| Biology | `#005e22` green | `#004d1a` | 🌿 |
| Maths | see `css/maths.css` | | 🧮 |

The colours live in `css/{subject}.css` as CSS variables. Never hard-code them in a sheet.
On mark schemes, answers are highlighted green, except on biology sheets, where they are highlighted blue so they don't blend into the subject colour.

## Header (all sheets)

Three lines, always:
1. **Title**: the topic in plain words (e.g. "Waves: Using the Equations").
2. **Subtitle**: `IGCSE Edexcel {Subject}`, plus `· Practice` or `· Challenge` for the new layer.
3. **Spec line**: the exact spec points and a short description (e.g. "3.1, 3.5–3.7 · wave speed, frequency and period, units and conversions"). List every spec point a question relies on, including ones borrowed from another topic.

## Guiding principles

1. **Fill an even number of printed pages.** The questions part of a sheet (not the mark scheme) must end on the last line of an even page (2 or 4 sides), with no awkward half-empty last page. If a sheet runs onto a page it doesn't fill, grow the answer boxes on questions that need more room until it fills the page, or trim; don't leave the space blank. Check by printing to PDF before publishing.
2. **Answer space matches the task.** One line for a fact, 2–3 lines for a short explanation, a working box for calculations, bigger boxes for multi-step, diagrams and dot-and-cross. Students should never run out of room on a question worth 3+ marks.
3. **Stay inside the Double Award spec** (`specifications/science.html`) unless a sheet is explicitly labelled as extension.
4. **Progression within a sheet**: recall → single-step → multi-step → unfamiliar context.
5. **Every answer needs a unit**, and mark schemes say so.
6. **Mark schemes**: aligned to question numbers, show working step by step, highlight the final answer, and add a short tip for the usual mistake where useful.

## Quality checklist (per sheet)

- [ ] Three-line header with correct spec points
- [ ] Subject colour and symbol come from the subject CSS
- [ ] Questions strictly within spec (or labelled extension)
- [ ] Prints to an even number of A4 sides with no part-empty page (questions only)
- [ ] Answer boxes sized to the task
- [ ] Mark scheme complete, numbered to match, answers checked by calculation
- [ ] No spelling or unit errors

## Publishing

- New sheets are added to the test area first (see the project's website workflow): files go in their real subject folder, but they are linked only from test pages (`test.html`, `worksheets/science-test.html`), not from the live `science.html`, until approved.
- Test pages carry `<meta name="robots" content="noindex, nofollow">`.
- Netlify deploys on every push to `main`. Batch changes into as few pushes as possible.

## Open decisions

- Whether to roll Practice/Challenge sheets out across other subtopics after the 3b pilot.
- Whether to move topic-sheet mark schemes into separate files (would stop answers printing with the questions).
- The ~50-sheets-per-subject target from the original plan: current bank is 31/14/18, but each topic sheet covers a wide spec range, so the number matters less than coverage depth. See `WORKSHEET_COVERAGE.md`.
