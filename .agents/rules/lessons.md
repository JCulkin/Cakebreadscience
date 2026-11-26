---
trigger: model_decision
description: Interactive lessons (interactive/lessons/) made from the teacher's PowerPoint decks — the slide style guide, draft → checked lifecycle with freeze.py, page and projector template, slide tags. Use when building or editing any lesson.
---
# Lessons (`interactive/lessons/`)

## Role in the site learning strategy & research principles
Lessons own **Layer 1 (first-pass understanding & visual mental models)**, with a strict architectural and pedagogical split between the two audiences:
- **Teacher projector deck (`draft/deck.html` / `#present`, 1600×900):** Grounded in **Cognitive Load Theory (Sweller)** and **Mayer's Multimedia Principles**:
  - **Dual Coding & Modality:** Every slide pairs a clear picture or diagram with spoken teacher explanation — never word-only slides or paragraphs students try to read while listening.
  - **Coherence:** Strip decorative clutter and **never** put individual flashcard drills, self-study toolbars, or independent practice widgets into projector slides (they break whole-class pacing).
  - **Segmenting & Signalling:** Use stepped `data-s` reveals, bold key terms, and colour-coded boxes/indents (`.ilist`) rather than walls of text or giant undifferentiated lines.
  - **Formative Assessment / Hinge Questions (Wiliam):** Include brief mid-lesson mini-whiteboard or whole-class hinge checks at natural breakpoints to catch misconceptions live before moving on.
  - **Spatial Contiguity:** Label directly on diagrams; share one label across side-by-side comparisons.
- **Student-facing study guide (`draft/index.html`, `study.js` + `study.css`):** Built for independent catch-up and revision, grounded in:
  - **Segmenting (Mayer):** One focused `<section class="step">` at a time with sticky progress bar (plus `All on one page` toggle for scanning/printing).
  - **Worked-Example Effect + Fading (Sweller / Renkl):** `.worked` step-by-step models paired with `<details class="your-turn">` immediate practice.
  - **Refutation Texts (Tippett):** `.mistake-box` explicitly names and corrects high-frequency exam misconceptions (*never say "enzymes are killed"*).
  - **Immediate Retrieval / Rosenshine's Check for Understanding:** `.micro-check` (1–3 quick questions at the end of every step) + `#check` end-of-topic self-check. **Important:** `#check` is an *immediate comprehension check* only — `study.js` tells students it does **not** secure a spec point; spaced securing happens on two different days in Practice or Cakebread Questing.
  - **Single-Source Vocabulary & Course Filtering:** `study.js` automatically loads `/js/key-words.js` (injecting an **Examiner key words** box into each step from its `<span class="spec">` chips) and `/js/course.js` (auto-hiding `.da-only`/`.da-block` and `'DA'` key words and filtering `<details class="specbox">` for Single Award students).
  - **Cross-Layer Handoff (`.next-hub`):** Every split student study guide ends with links into **Flashcards** (`?sub=…`), **Practice** (`practice.html?sub=…`), **Cakebread Questing** (`adventurer-mission.html?sub=…`), matching **Worksheets**, and any matching **Topic Booklet** (`/booklets/…`). Never reinvent a separate flashcard engine or spaced-repetition store inside a lesson.

## Format
- **Split lessons (`"split": true`, preferred for all new lessons & migrations; piloted on Chemistry 1g & Biology 2c, 26 Nov 2026; rollback tag `pre-student-unbind-2026-11-26`):**
  - `draft/index.html` = dedicated **Student Study Guide** (`assets/study.css` + `assets/study.js`), with `<script>if(location.hash==='#present')location.replace('deck.html'+location.search+'#present');</script>` in `<head>`.
  - `draft/deck.html` = dedicated **Teacher Projector Deck** (`assets/lesson.css` + `assets/lesson.js` + `tags.css`): clean Classroom Projector Deck launcher + `#qsrc` + `#deck-src` (1600×900 slides). `freeze.py` and `build_diff.py` automatically handle both single-file and split lessons.
- **Legacy single-file lessons:** one page (`draft/index.html`) holds both the reading page and `#deck-src` projector slides (`lesson.css` + `lesson.js`). Migrate these to the split architecture when revisiting them.
- `lessons.json`: `subjects[].sections[].topics[]` = `{code, title, spec, status 'checked'|'draft', split?, draftUpdated, versions[]}`.
- Files: `<subject>/<code>/draft/index.html` (+ `draft/deck.html` when split, + `draft/img/`) · `<subject>/<code>/v<date>/` frozen checked versions (**never edit**) ·
  `<subject>/<code>/index.html` redirect (written by freeze.py) · `assets/lesson.css`, `lesson.js`, `study.css`, `study.js`, `chem.js`, `bio.js`,
  `cells.js` (copy of `/interactive/cell-game/cells.js`), `diagrams.js` + `diagq.js` (frozen copies from spec-quiz) · `tags.css`.
- Landing page and lesson headers stay minimal (user): code, title, spec, Open / ▶ Present, a plain "Under review" chip on drafts. No badges,
  dates, progress bars, or links to older checked versions.

## Lifecycle (everything starts as a draft)
1. Edit the draft only; every edit bumps `data-updated` on `<body>` and `draftUpdated` in lessons.json.
2. The user reviews by projector slide number (Admin → Review → Lessons, or directly). Give him a numbered list/contact sheet of the slides.
3. When he says it's checked: `python tools/lessons/freeze.py <subject>/<code> --date <today>` (after adding a new lesson folder:
   `freeze.py --roots`). An edit he asks for on a checked lesson → freeze a new checked version. Your own changes → it stays a draft.
   After a rules sweep, only **big** changes send a checked lesson back to review.
4. `node tools/spec/build_index.js`, `python tools/lessons/build_diff.py --base <commit-before-prompt> --label "before last prompt"` (refreshes the staging-only split-screen comparer at `/interactive/lessons/diff/` so it shows only the latest prompt's changes, not cumulative changes since `origin/main`), changelog line, push to staging.
- Review portal: his marks live in RTDB `school/review/l/{subject|code}`; he copies a "Mark checked / Needs a fix" message to whoever builds lessons.

## Slide style guide (the user's rules, 23–26 Nov 2026 — check every slide)
1. **A picture or diagram on every slide.** No word-only slides, no recap slide at the end (auto quiz/exam slides excepted).
2. **Clear visual hierarchy (don't crowd the visual field):** big readable type, but don't make every line giant (`big`) or crowd the slide. Present information using **indents (`.ilist`) or colour-coded boxes/cards** (as in Biology 2c Slides 5, 13, 17) rather than walls of text or inline middle dots (`·`). Prefer hyphens (`-`) or indented sub-bullets over middle-dot lists.
3. Fewer, cleaner points; key terms kept, in **bold**.
4. Activity slides say the task ("Your turn: …, then click to check"). Discussion slides are pictures only.
5. **Always high-resolution images:** Title and section slides must use a **genuinely high-resolution** picture (≥1600px wide) that fills the screen, with the title in a cream box (`tslide`) that doesn't cover the main subject. Content photos should also be high-resolution (≥1000px on the long edge) — never blurry low-res thumbnails.
6. Our own clear diagrams (circle photo nodes with coloured rings, coloured boxes, revealed per click) instead of screenshots of text or blurry rasters.
7. Comparisons: same object drawn the same way in each panel; shared parts labelled once.
8. Photos of individual organisms, not scenery; short captions; many examples → rolodex.
9. **Question-bank diagrams first** (`dq` component, ids from `DQ.LIST` + a fixed seed) before drawing new ones.
10. Mnemonics/cartoons big; acrostics vertical (Mrs C Gren).
11. Ions = balls with a floating charge; dot-and-cross only where the spec asks (using the overlapping-lens model with **no light background fill** on the shells and nuclei nudged away from shared overlaps so orbital rings don't cross nuclei). Equations = colour-coded boxes on one line where possible, centred with **reaction arrows vertically aligned** when stacked, and a **large, well-spaced arrow** separating reactants and products. Data tables colour-shaded, highest at top. Readable colours on dark slides.
12. Keep the deck's images, links (one linkcard per slide), order and examples. 13. **Never mention Separate Science.**
14. Kingdom order: animals, plants, fungi, bacteria, protoctists (then pathogens, viruses).
15. Tags only "Double Award only" / "Beyond IGCSE" (`<i class="stag da|beyond"></i>` as a direct child of the slide; look in `tags.css`);
    no spec numbers on slides. Mixed slides stay untagged. Tag every new lesson.
16. **No lazy abbreviations on slides:** write `melting and boiling points` in full — never `m.p.` / `b.p.`. Keep projector slides punchy without clipping words awkwardly.
17. **Quick Checks vs Mini-Whiteboards (`tags.css` corner symbols):**
    - Use `<i class="sico qc"></i>` (**Quick check** corner badge) for fast oral/hands-up/recall/MCQ hinge checks during the lesson.
    - Use `<i class="sico wb"></i>` (**Whiteboards** corner badge) **only** when the task genuinely asks students to **draw/sketch something worthwhile** (a graph, force diagram, ray diagram, dot-and-cross diagram, etc.) that justifies getting whiteboards out. If whiteboards are already out from a drawing slide, a quick-fire follow-on check on the very next slide may use them too.
18. Before pushing: look at every slide fully revealed for word-only slides, text off the slide or under the title, tiny pictures, overlaps.
19. **Revisit backlog (26 Nov 2026):**
    - **Chemistry 1a** still needs a broader revisit with high-resolution image and box/indent presentation standards (**Physics 8** completed 26 Nov 2026).
    - **Mini-whiteboard sweep (reminder):** sweep all lesson decks later to incorporate genuine Mini-Whiteboard drawing tasks (graphs, force diagrams, dot-and-cross, etc.) with `<i class="sico wb"></i>` (and follow-on checks while whiteboards are already out).

## Split Student Study Guide template (`draft/index.html` — preferred)
- `<head>`: `<script>if(location.hash==='#present')location.replace('deck.html'+location.search+'#present');</script>` + `/interactive/lessons/assets/study.css`.
- `<body class="subj-biology|subj-chemistry|subj-physics" data-status="draft" data-updated="…" data-topic="subject/code">`; header `.shead` (`.crumb` with Home + All lessons + optional status chip, `.kick`, `h1`). Do **not** load `home-link.js` (`study.js` auto-loads `/js/auth-gate.js`, `/js/course.js`, and `/js/key-words.js`).
- `<main class="wrap">` starts with `<details class="specbox">` (full Edexcel spec text word-for-word — `study.js` auto-filters it for Single Award students).
- Content chunks: `<section class="step" id data-toc="Short label">` with `<h2>Title <span class="spec">1.44</span></h2>` (spec chips feed `build_index.js`, auto-injected **Examiner key words** per step, and the bottom per-point Practice links).
- Callouts: `.key-box` (core idea), `.exam-tip` (examiner mark-scheme phrasing), `.mistake-box` (refutation of common misconceptions), `.worked` + `<details class="your-turn">` (worked example → faded practice), `.da-only`/`.da-block` (auto-hidden for Single Award), `.beyond-only`/`.beyond-block` (optional extension).
- Every content step ends with `.micro-check` (`.mq` MCQs with `data-a` & `data-why`, `.flip-q` recall prompts, and/or `[data-comp="dq"]` seeded diagram questions).
- Final step `<section class="step" id="check" data-toc="End-of-topic test">`: `#qs` populated from hidden `#qsrc` (MCQs + self-marked long answers with checkboxes), optional `[data-comp="dq"]`, and `.next-hub` linking **Flashcards** (`?sub=…`), **Practice** (`practice.html?sub=…`), **Cakebread Questing** (`adventurer-mission.html?sub=…`), matching **Worksheets**, and any matching **Topic Booklet** (`/booklets/…`).
- Scripts last: `cells.js` (if needed), `diagrams.js` + `diagq.js`, `bio.js` / `chem.js`, then `study.js`.

## Teacher Projector Deck (`draft/deck.html`) & Legacy single-file template (`lesson.js`)
- `<body class="subj-biology|subj-chemistry|subj-physics" data-status="draft" data-updated="…" data-deck-ui="v2">`; header `.lhead`
  (`.kick`, `h1`, `.navrow` with `<a href="/interactive/lessons/">← All lessons</a>`, `.toc`); `<details class="specbox">` with the spec points
  word for word. `lesson.js` adds the home link and auto-loads `/js/auth-gate.js` — don't also load `home-link.js`.
- `<main class="wrap">` → on legacy single-file lessons, one `<section id data-toc>` per sub-topic with `h2` + `<span class="spec">1.37</span>` chips (feed the spec index); last section `#check` with `#qs`; questions in `#qsrc`. On split `deck.html`, keep `<main class="wrap">` as a clean Classroom Projector Deck launcher + `#qsrc` + `#deck-src`.
- Slides in `#deck-src`: `<section class="ps">…</section>`; reveal steps `data-s`, `data-hide-from`, `data-hide-until`; auto slides
  `data-auto="quiz"|"exam"`. Inline SVGs need unique ids per copy. **Check every section is closed.**
- Scripts last: `cells.js`, then `diagrams.js` + `diagq.js` if there are diagram questions, then `bio.js` / `chem.js`, then `lesson.js`.
- Most drafts were generated by Claude's private builders; editing the HTML directly is fine, but say so in the commit (the builder would
  overwrite hand edits on its next run).

## Content
- Source decks are the user's PowerPoints in his Google Drive (`2. Science\<Subject>\…`). Follow the deck's order, wording, examples and
  images; fill spec gaps; fix factual slips and tell him. Never publish from `# Resources/`.
- Images: no watermarked publisher images or past-paper scans; keep Creative Commons credits; GIFs → MP4.
- Status (26 Nov 2026):
  - **Checked (single-file, live `v2026-11-26` / `v2026-11-25`):** Biology `1`, `2a`, `2b`, `2f`; Chemistry `1f`.
  - **Split pilot drafts (`"split": true`, frozen `v2026-11-26` stays live):** Biology `2c`, Chemistry `1g`.
  - **Under review (single-file drafts, not yet split):** Biology `2d`, Chemistry `1a`, Physics `8`.
