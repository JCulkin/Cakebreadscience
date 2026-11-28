---
trigger: model_decision
description: Cakebread Lessons (interactive/lessons/) — Class Slides (deck.html) vs. Revision Notes (index.html, study.js), slide style guide, draft → checked lifecycle with freeze.py, templates and slide tags. Use when building or editing any lesson.
---
# Cakebread Lessons (`interactive/lessons/`)

## Official naming & strategy (Layer 1 — Understand)
Umbrella brand: **Cakebread Lessons** — split strictly into two named parts (**never** call lesson pages *"Study Guides"*, which is reserved by the school for printable test study guides in `/guide/`):
- **Class Slides (`draft/deck.html` / `#present`, 1600×900):** Teacher projector deck grounded in **Cognitive Load Theory** (Sweller), **Mayer's Multimedia Principles**, and **Formative Hinge Checks** (Wiliam):
  - **Dual Coding & Coherence:** Picture or diagram on every slide paired with spoken narration — never word-only slides, never individual flashcard drills or self-study widgets on slides.
  - **Segmenting & Signalling:** Stepped `data-s` reveals, bold key terms, colour-coded boxes/indents (`.ilist`) rather than walls of text.
  - **Hinge AfL:** Brief mid-lesson mini-whiteboard / whole-class checks at natural breakpoints before moving on.
  - **Spatial Contiguity:** Label directly on diagrams; share one label across comparisons.
- **Revision Notes (`draft/index.html`, `study.js` + `study.css`):** Student at-home catch-up and revision — **strict Edexcel IGCSE core content, Cognito / Seneca / Bitesize / Save My Exams style** (NOT a dump of Class Slides!):
  - **Segmenting:** One `<section class="step">` at a time + sticky progress bar (`All on one page` toggle for scanning/printing), short scannable paragraphs, crisp `.pts` bullets, and comparison `.cmp` tables.
  - **Visual discipline (Dual Coding + Coherence):** Include purposeful representational visuals (labelled SVGs, organism/process thumbnails on concept cards like MRS C GREN & 5 Kingdoms, practical apparatus, interactive `data-comp="cell"`/`particles`/`dq`). Strip only *seductive/decorative* clutter — classroom photo-gallery dumps, reading-passage worksheets, and external YouTube/Kahoot/Wordwall linkcard walls (those stay in `deck.html`). Never pair tiny text next to a huge awkward image in `.grid2`.
  - **Strict IGCSE focus:** Anything Beyond IGCSE is omitted or tucked inside a collapsed `<details class="beyond-block">`; DA-only steps/blocks use `.da-only` / `.da-block`.
  - **Worked-Example Fading:** `.worked` models paired with `<details class="your-turn">` (use `.worked-split` / `.worked-thumbs` to include a relevant photo or diagram where it helps anchor the answer).
  - **No repetition & sparse warnings:** Never add a `.key-box` that repeats a diagram or card grid directly above it; use `.mistake-box` / `.exam-tip` ONLY where there is a genuine, high-frequency exam trap not already stated above (1–2 per topic is typical).
  - **Immediate Retrieval & End-Page Order (`#check`):** `.micro-check` (1–2 MCQs with `data-why`) at the end of each step. The final `#check` step follows a strict clean order: **1. High-level Topic Summary (`.summary-box`, 3–4 bullets) → 2. Key words for this topic (`.kw-box`, auto-injected by `study.js`) → 3. Progressive reveal-as-you-go End-of-topic test (`#qs`, one question at a time + `Show all` toggle, 100% `data-why`) → 4. `.next-hub`**. `#check` is an *immediate comprehension check* only (`study.js` notes that spaced securing happens on two different days in Practice/Breadventure Land).
  - **Auto vocabulary & course:** `study.js` auto-loads `/js/key-words.js` (one consolidated **Key words for this topic** card on `#check` right before `#qs`, with Flashcards & Typing links), `/js/course.js` (auto-hides `.da-only`/`.da-block` + `'DA'` key words, DA steps & `.specbox` items for Single Award), `/js/spec-index.js` (auto-enriches `.next-hub` & links `.spec` chips to Spec Trackers), and `/js/auth-gate.js`.
  - **Handoffs (`.next-hub`):** Link to **Flashcards** (`?sub=`), **Practice Questions** (`practice.html?sub=`), **Breadventure Land** (`adventurer-mission.html?sub=`), matching **Worksheets**, and any matching **Exam Booklet** (`/booklets/…`). Never build a separate flashcard/SRS engine inside a lesson.

## Format & lifecycle
- **Format:** All lessons use the split architecture (`"split": true`): `draft/index.html` (`study.css` + `study.js`, with `#present` → `deck.html#present` redirect) + `draft/deck.html` (`lesson.css` + `lesson.js` + `tags.css`, clean launcher + `#qsrc` + `#deck-src`).
- `lessons.json`: `{code, title, spec, status 'checked'|'draft', studentStatus 'checked'|'draft', split: true, draftUpdated, versions[]}`. Frozen `<subject>/<code>/v<date>/` folders: **never edit**.
- Keep `/interactive/lessons/` landing & headers minimal: code, title, spec, Open / ▶ Present, plain "Under review" chip on drafts (no extra badges, dates, or older-version dropdowns).
- **Workflow:**
  1. Edit `draft/` only; bump `data-updated` on `<body>` and `draftUpdated` in `lessons.json`. **Whenever you edit a previously `checked` half (`deck.html` or `index.html`), ALWAYS flip its `status` or `studentStatus` back to `"draft"` in `lessons.json` and rebuild `diff/data.json`** so it automatically moves back into **Needs review** on `/staging-review/`!
  2. Teacher reviews **Class Slides** (by slide number, `school/review/l/{subj|code}`) and **Revision Notes** (`school/review/l/{subj|code|student}`) independently on Staging Review / Admin → Review → Lessons. Give a numbered slide list for slide edits.
  3. When marked checked (or user-asked edit on checked): `python tools/lessons/freeze.py <subject>/<code> --date <today>` (`--roots` after adding a new lesson folder) and update `status` / `studentStatus` in `lessons.json`. Unrequested edits stay draft.
  4. Run `node tools/spec/build_index.js`, `python tools/lessons/build_diff.py --base <commit-before-prompt> --label "before last prompt"`, update `VERSION_HISTORY.md` (read top ~40 lines only), push to `staging`.

## Slide style guide (check every projector slide)
1. **Picture or diagram on every slide.** No word-only slides, no recap slide at the end (auto quiz/exam slides excepted).
2. **Clear visual hierarchy:** big readable type without making every line giant (`big`); use **indents (`.ilist`) or colour-coded boxes/cards** (e.g. Bio 2c Slides 5, 13, 17) — prefer hyphens (`-`) or sub-bullets over middle-dot (`·`) lists.
3. Fewer, cleaner points; key terms in **bold**.
4. Activity slides state the task ("Your turn: …, then click to check"). Discussion slides = pictures only.
5. **High-resolution images only:** full-screen title/section photos ≥1600 px wide with a cream title box (`tslide`) clear of the main subject; content photos ≥1000 px on long edge (no blurry thumbnails).
6. Own crisp diagrams (coloured circle photo nodes, revealed boxes) over screenshots of text or blurry rasters. **Diagram labels must be classroom-readable** from the back of the room (target ≥26–32 px rendered at 1600×900, bold/high-contrast, wrapped onto 2 lines when long so wide labels never shrink the SVG).
7. Comparisons: same object drawn the same way in each panel; shared parts labelled once. Avoid boxes-within-boxes clutter — let particle containers and clean flow/cycle diagrams sit naked on the slide when a frame adds no meaning.
8. Individual organisms, not scenery; short captions; many examples → rolodex (`data-comp="rolodex"`, optional `data-sync="1"`).
9. **Question-bank diagrams first** (`data-comp="dq"`, id from `DQ.LIST` + fixed `data-seed`).
10. Mnemonics/cartoons big; acrostics vertical (Mrs C Gren).
11. Ions = balls with floating charge; dot-and-cross only where spec asks (overlapping-lens model, **no light shell fill**, nuclei nudged clear of overlap rings). Equations = colour-coded boxes on one line where possible, centred with vertically aligned reaction arrows and a large spaced arrow. Data tables colour-shaded, highest at top. Readable colours on dark slides.
12. Keep source deck's images, links (one `.linkcard` per slide), order and examples. **Never mention Separate Science.**
13. Kingdom order: animals, plants, fungi, bacteria, protoctists (then pathogens, viruses).
14. Slide tags: only `<i class="stag da|beyond"></i>` ("Double Award only" / "Beyond IGCSE") and activity badges `<i class="sico qc|wb"></i>` (Quick check / Whiteboards) as direct children of `section.ps`; no spec numbers on slides; mixed slides untagged. **Keep `<h2>` titles short enough to sit on one single line** clear of corner tags (even when both `.stag` and `.sico` are present).
15. **Exam Question Slide Standard:** dedicated exam-question slides pair a crisp question box + `[N]` mark badge + visual context with **individual mark-scheme rows** offering **more valid mark points than the max marks** (e.g. 5 points for `[3]`, `Any 3 linked points (max 3)`). For **Explain** questions, show explicit **causal links** (`↓ so… / therefore… / which causes…`) between numbered steps rather than disconnected bullets; never copy verbatim from the private Pearson Exam Bank (write original Edexcel-style questions).
16. **Vertical flex safety:** never stack `.ps .fig` (which has `height: 100%` in `lesson.css`) above another block inside a column slide — give top diagrams an explicit pixel height (`flex:none;height:…px`) and verify visually in headless Chrome at 1600×900 before pushing so nothing overflows or clips.

## Revision Notes template (`draft/index.html`)
- `<head>`: `#present` → `deck.html#present` redirect + `/interactive/lessons/assets/study.css`.
- `<body class="subj-biology|subj-chemistry|subj-physics" data-status="draft" data-updated="…" data-topic="subject/code">`; `.shead` (`.crumb` Home + All lessons + optional status chip, `.kick`, `h1`). Do **not** load `home-link.js`.
- `<main class="wrap">`: `<details class="specbox">` (verbatim spec points), then `<section class="step" id data-toc="Short label">` chunks with `<h2>Title <span class="spec">1.44</span></h2>`.
- Callouts: `.key-box`, `.exam-tip`, `.mistake-box`, `.worked` (+ `<details class="your-turn">`), `.da-only`/`.da-block`, `.beyond-only`/`.beyond-block`.
- End every content step with `.micro-check` (`.mq` with `data-a` & `data-why`, `.flip-q`, and/or `[data-comp="dq"]`).
- Final step `<section class="step" id="check" data-toc="End-of-topic test">`: `#qs` (built from hidden `#qsrc`), optional `[data-comp="dq"]`, and `.next-hub` (Flashcards + Practice + Questing + Worksheets + matching Topic Booklet).
- Scripts last: `cells.js` (if needed), `diagrams.js` + `diagq.js`, `bio.js`/`chem.js`, then `study.js`.

## Class Slides template (`draft/deck.html`)
- `<body class="subj-…" data-status="draft" data-updated="…" data-deck-ui="v2">`; `.lhead` + launcher card (`.pbtn,#hdrPresent{display:none!important}`). `lesson.js` adds the home link and loads `/js/auth-gate.js` — don't load `home-link.js`.
- Slides in `#deck-src`: `<section class="ps">…</section>`; `data-s`, `data-hide-from`, `data-hide-until`, `data-auto="quiz"|"exam"`. Unique inline SVG IDs per copy. **Check every `<section>` is closed.**
- Scripts last: `cells.js` (if needed), `diagrams.js` + `diagq.js`, `bio.js`/`chem.js`, then `lesson.js`. Note hand-edited HTML in commits/changelog.

## Sources & status
- Source decks: teacher's Google Drive (`2. Science\<Subject>\…`). Never publish from `# Resources/`, no watermarked/past-paper images, keep CC credits, GIFs → MP4.
- **Current status (all 10 lessons split):** Both checked (`Bio 1`, `Bio 2a`, `Bio 2c`, `Chem 1g`) · Class Slides checked / Revision Notes under review (`Bio 2b`, `Bio 2d`, `Chem 1f`) · Both under review (`Bio 2f`, `Chem 1a`, `Phys 8`).
- **Staging comparer rule:** `tools/lessons/build_diff.py` MUST always compare each lesson's `draft/` against its **most recently approved frozen snapshot (`v<latest>/`)** when one exists (falling back to `origin/main` only for lessons never frozen yet), ignoring `../img/` vs `img/` and lossless same-stem WebP conversions so only real visual/content changes appear. Rebuild `diff/data.json` + `/staging-review/` before handing staging over for review.
