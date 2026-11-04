# Cakebread lessons: workflow and authoring guide

Live at `/interactive/lessons/` (landing page, built from `interactive/lessons/lessons.json`).

## Lifecycle: draft → review → checked version
1. **Draft**: Claude builds/edits `interactive/lessons/<subject>/<code>/draft/index.html`.
   Every edit: bump `data-updated="YYYY-MM-DD"` on `<body>`, and in `lessons.json` set the topic's
   `"status": "draft"` and `"draftUpdated"`.
2. **Review**: the teacher opens the draft, presses **✎ Review**, clicks blocks / projector slides,
   types notes, then **Copy all notes** and pastes them into a chat. Each note names its location, e.g.
   `[How ions form › block 3]` = 3rd block inside that section (blocks = direct children of the
   section, with `.grid2/.grid3` children counted individually), or `[Projector slide 13: "…"]`.
   Apply every note; if a note is ambiguous, ask. Don't change things nobody asked about unless they're
   wrong, and list any such extra fixes in the reply.
3. **Approve**: when the teacher says "approve 1f", run from the repo root:
   `python3 tools/lessons/freeze.py chemistry/1f` (optionally `--date YYYY-MM-DD`).
   This copies the draft to `v<date>/`, snapshots the engine into `v<date>/_assets/`, marks it checked,
   updates `lessons.json` and points `<code>/index.html` at the newest version.
   **Never edit a `v<date>/` folder afterwards.** Changes always go into the draft and get a new version.
4. Push to `staging` (free preview). Merge to `main` only when the teacher says so (15 Netlify credits).

## Files
```
interactive/lessons/
  index.html            landing page (reads lessons.json)
  lessons.json          every spec topic; status, draftUpdated, versions[]
  assets/lesson.css     page + projector + review styles   (shared by all drafts)
  assets/lesson.js      engine: TOC, badges, questions, projector deck, review mode
  assets/chem.js        chemistry components
  chemistry/<code>/index.html      redirect to newest checked version (or draft) – written by freeze.py
  chemistry/<code>/draft/          the working draft (+ img/ for topic images)
  chemistry/<code>/v<date>/        frozen checked versions (self-contained)
  chemistry-1g/                    the original format trial (A–D) – archive
```

## Page template
Copy an existing draft (e.g. `chemistry/1f/draft/index.html`). Key parts:
- `<body class="subj-chemistry" data-status="draft" data-updated="…">` (`subj-biology` / `subj-physics` switch the accent colour)
- `<header class="lhead">` with `.kick`, `h1` (accent word in `<span>`), empty `.navrow` and `.toc` (filled by the engine)
- `<main class="wrap">` → one `<section id="…" data-toc="Short name">` per sub-topic, `h2` + `<span class="spec">1.37</span>` chips.
  Blocks: `p`, `.key` (definition), `.warn` (exam tip / common mistakes), `.card`, `.grid2/.grid3`, `table.cmp`, `figure`.
- Last section: `<section id="check"><h2>Check yourself</h2><div id="qs"></div></section>`
- `#qsrc` questions: `<div class="q" data-type="mc" data-a="1">` (0-based answer) `<p>question</p><ol><li>…</li></ol>`
  or `data-type="long" data-m="3"` with `<ul><li>mark-scheme point</li></ul>` and optional `<p class="tip">`.
  Add `data-deck="0"` to keep a question off the projector.
- `#deck-src` projector slides (1600×900 stage): `<section class="ps">…</section>`.
  Classes: `h2`, `.big`, `.mid`, `.small`, `.grey`, `.em`, `.row/.col/.fig`, `.two`, `.three`, `.stack`, `.overlay`, `.box`, `.mt/.mt2`, `.nt` (no uppercase, for formulae in titles).
  Click-to-reveal: `data-s="n"` (appears at step n), `data-hide-from="n"` (disappears at step n),
  `data-hide-until="n"` (hides electrons in a dot-and-cross until step n).
  Auto slides: `<section class="ps" data-auto="quiz"></section>`, `data-auto="exam"`.
- Scripts last: subject components (`chem.js`) then `lesson.js`.

## Components (`data-comp="…"`), chemistry
| component | options | use |
|---|---|---|
| `dc-explorer` | `data-mols="H2,Cl2,…"` | covalent dot-and-cross explorer (page) |
| `dc-mol` | `data-k`, + `data-hide-until` on slides | one covalent diagram |
| `dc-facts` | `data-k` | shared pairs / bond type / lone pairs text |
| `dc-deck` | `data-mols` | molecule picker for a slide |
| `ionic` | `data-k`, `data-view="before\|after"`, `data-arrow-step` | ionic dot-and-cross |
| `ionic-explorer` | `data-cpds` | ionic explorer (page) |
| `formula-builder` | – | ions → formula, charge tiles, "test me" |
| `nacl-lattice` | `data-n` | giant ionic lattice drawing |
| `ion-conduction` | `data-state` | solid / molten / aqueous + battery & bulb |
| `particles` | `data-state`, `data-controls="0"` | particle model sim (solid/liquid/gas, change names) |
| `state-triangle` | `data-steps="1"` | changes of state diagram |
| `heating-curve` | `data-steps="1"` | heating curve of water |
| `diffusion-tube` | – | NH₃ + HCl white ring sim |
| `dilution` | – | KMnO₄ dilution beakers |
| `bp-chart` | – | alkane boiling points |
Molecules/compounds available: see `MOL`/`SPEC` and `IONIC` in `chem.js` (add new ones there).

## Content rules
- Source: the teacher's decks in Google Drive `2. Science/<Subject>/<section>/` (connect via the desktop app).
  Follow their teaching order, wording and emphasis where sensible; fill spec gaps; skip Separate-only points.
- Images (teacher's decision, 5 Nov 2026): **include the images from the teacher's own decks**: diagrams,
  mnemonic cartoons, photos, animations. Place each one where it sits in the deck, on both the page
  (`<figure class="pic">`, `.sm`/`.lg` sizes) and the projector slide (`.fig > img`, `.imrow`). Extract with
  python-pptx, convert to WebP (≤1400px); animated GIFs → looping MP4 (`<video autoplay muted loop playsinline>`).
  Skip only things with no teaching value: spec-table screenshots, bare arrows/decoration, screenshots of
  external websites. Still exclude anything watermarked by another publisher (e.g. Save My Exams) and past-paper scans.
  Images live in `<code>/draft/img/` (copied into each frozen version). Write original questions in exam style.
- Run every page in a browser before pushing: no console errors, every projector slide fully revealed fits the stage.

## Converting a PowerPoint directly (approach B from the trial)
`tools/pptx/pptx2html.py deck.pptx outdir "Title" [skip,slides]` → positioned HTML slides
(needs python-pptx, ImageMagick, ffmpeg, LibreOffice for EMF/WMF). Template: `tools/pptx/b_template.html`, nav: `tools/pptx/nav.html`.
