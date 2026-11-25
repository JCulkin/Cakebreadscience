---
trigger: model_decision
description: Interactive lessons (interactive/lessons/) made from the teacher's PowerPoint decks — the slide style guide, draft → checked lifecycle with freeze.py, page and projector template, slide tags. Use when building or editing any lesson.
---
# Lessons (`interactive/lessons/`)

## Format
- Each lesson = one page (read on a phone/laptop) + a projector mode (`#present`, 1600×900 slides) from the same file.
- `lessons.json`: `subjects[].sections[].topics[]` = `{code, title, spec, status 'checked'|'draft', draftUpdated, versions[]}`.
- Files: `<subject>/<code>/draft/index.html` (+ `draft/img/`) · `<subject>/<code>/v<date>/` frozen checked versions (**never edit**) ·
  `<subject>/<code>/index.html` redirect (written by freeze.py) · `assets/lesson.css`, `lesson.js` (engine), `chem.js`, `bio.js`,
  `cells.js` (copy of `/interactive/cell-game/cells.js`), `diagrams.js` + `diagq.js` (frozen copies from spec-quiz) · `tags.css`.
- Landing page and lesson headers stay minimal (user): code, title, spec, Open / ▶ Present, a plain "Under review" chip on drafts. No badges,
  dates, progress bars, or links to older checked versions.

## Lifecycle (everything starts as a draft)
1. Edit the draft only; every edit bumps `data-updated` on `<body>` and `draftUpdated` in lessons.json.
2. The user reviews by projector slide number (Admin → Review → Lessons, or directly). Give him a numbered list/contact sheet of the slides.
3. When he says it's checked: `python tools/lessons/freeze.py <subject>/<code> --date <today>` (after adding a new lesson folder:
   `freeze.py --roots`). An edit he asks for on a checked lesson → freeze a new checked version. Your own changes → it stays a draft.
   After a rules sweep, only **big** changes send a checked lesson back to review.
4. `node tools/spec/build_index.js`, changelog line, push to staging.
- Review portal: his marks live in RTDB `school/review/l/{subject|code}`; he copies a "Mark checked / Needs a fix" message to whoever builds lessons.

## Slide style guide (the user's rules, 23 Nov 2026 — check every slide)
1. **A picture or diagram on every slide.** No word-only slides, no recap slide at the end (auto quiz/exam slides excepted).
2. **Clear visual hierarchy (don't crowd the visual field):** big readable type, but don't make every line giant (`big`) or crowd the slide. Use font-size contrast, **bold** selectively, and **indented lists** rather than walls of text or inline middle dots (`·`). Prefer hyphens (`-`) or indented sub-bullets over middle-dot lists.
3. Fewer, cleaner points; key terms kept, in **bold**.
4. Activity slides say the task ("Your turn: …, then click to check"). Discussion slides are pictures only.
5. Title and section slides: **genuinely high-resolution** picture (≥1600px wide) fills the screen, title in a cream box (`tslide`) that doesn't cover the main subject.
6. Our own clear diagrams (circle photo nodes with coloured rings, coloured boxes, revealed per click) instead of screenshots of text or blurry rasters.
7. Comparisons: same object drawn the same way in each panel; shared parts labelled once.
8. Photos of individual organisms, not scenery; short captions; many examples → rolodex.
9. **Question-bank diagrams first** (`dq` component, ids from `DQ.LIST` + a fixed seed) before drawing new ones.
10. Mnemonics/cartoons big; acrostics vertical (Mrs C Gren).
11. Ions = balls with a floating charge; dot-and-cross only where the spec asks (using the overlapping-lens model so shared electrons never overlap orbital rings). Equations = colour-coded boxes on one line where possible, with a **large, well-spaced arrow** separating reactants and products. Data tables colour-shaded, highest at top. Readable colours on dark slides.
12. Keep the deck's images, links (one linkcard per slide), order and examples. 13. **Never mention Separate Science.**
14. Kingdom order: animals, plants, fungi, bacteria, protoctists (then pathogens, viruses).
15. Tags only "Double Award only" / "Beyond GCSE" (`<i class="stag da|beyond"></i>` as a direct child of the slide; look in `tags.css`);
    no spec numbers on slides. Mixed slides stay untagged. Tag every new lesson.
16. Before pushing: look at every slide fully revealed for word-only slides, text off the slide or under the title, tiny pictures, overlaps.

## Page template
- `<body class="subj-biology|subj-chemistry|subj-physics" data-status="draft" data-updated="…" data-deck-ui="v2">`; header `.lhead`
  (`.kick`, `h1`, `.navrow` with `<a href="/interactive/lessons/">← All lessons</a>`, `.toc`); `<details class="specbox">` with the spec points
  word for word. lesson.js adds the home link — don't also load home-link.js.
- `<main class="wrap">` → one `<section id data-toc>` per sub-topic with `h2` + `<span class="spec">1.37</span>` chips (feed the spec index).
  Last section `#check` with `#qs`; questions in `#qsrc`.
- Slides in `#deck-src`: `<section class="ps">…</section>`; reveal steps `data-s`, `data-hide-from`, `data-hide-until`; auto slides
  `data-auto="quiz"|"exam"`. Inline SVGs need unique ids per copy. **Check every section is closed.**
- Scripts last: `cells.js`, then `diagrams.js` + `diagq.js` if there are diagram questions, then `bio.js` / `chem.js`, then `lesson.js`.
- Most drafts were generated by Claude's private builders; editing the HTML directly is fine, but say so in the commit (the builder would
  overwrite hand edits on its next run).

## Content
- Source decks are the user's PowerPoints in his Google Drive (`2. Science\<Subject>\…`). Follow the deck's order, wording, examples and
  images; fill spec gaps; fix factual slips and tell him. Never publish from `# Resources/`.
- Images: no watermarked publisher images or past-paper scans; keep Creative Commons credits; GIFs → MP4.
- Status (25 Nov): checked Biology 1, Biology 2a; under review Bio 2b, 2c, 2d, 2f, Chem 1a, 1f (checked version stays live), 1g, Physics 8.
