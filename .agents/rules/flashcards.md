---
trigger: model_decision
description: Flashcards (Flashcards/) and Examiner Key Words (js/key-words.js) — AO1 cold recall role, permanent card IDs, SM-2 rules, Single Award filtering, media integrity, and deep links. Use whenever editing Flashcards or js/key-words.js.
---
# Flashcards & Examiner Key Words (`Flashcards/`, `js/key-words.js`)

## Role in the site learning strategy
- Flashcards own **Layer 2 (cold recall of AO1 facts + mark-scheme wording)**, kept alive over months via spaced repetition (SM-2).
- **Good flashcard targets:** definitions, examiner key words, chemical tests & colour changes, equations & units, ion charges/formulae, organelle/structure functions, circuit symbols, core AO3 practical steps/variables.
- **Bad flashcard targets:** long prose essays (belong in Worksheets / Long-Answer) and calculation/graph/diagram transfer drills (belong in Questing / Practice).
- **Keep self-grading fast and simple (1–4):** Again / Hard / Good / Easy with 1-tap / 1-key grading (no tickable checklists, no mandatory "type it first" box). Format multi-point backs as crisp bulleted idea units with bolded mark-scheme terms.

## Card data & permanent IDs
- Data files: `Flashcards/data/{biology,chemistry,physics,physics-eqns}.json` + `index.json` + `Flashcards/media/`.
- **Card IDs are permanent** (original Anki timestamps for existing cards; student SM-2 progress is stored in Firestore `users/{uid}.progress` keyed by `<deck>_<id>`). Never renumber, reuse, or delete an existing card ID.
- Single Award: cards that test Double-Award-only detail on one of the 15 narrowed Single Award points carry `daOnly: true` (filtered out automatically when `CBSCourse.sa` is true).
- Deep links supported by `Flashcards/index.html`: `?spec=B2.11`, `?sub=C1a`, `?topic=P3`, and `?subs=C1a,C2.5,C2.7&t=<title>` (used by Study Guides and Lessons).
- Offline / school filter: must still draw and work in local browser storage if Firebase is blocked or slow (with timeouts on Firestore reads/writes).

## Questing integration
- Card secured = rated Good or Easy on **two different days**.
- Daily goal (≤ 15 cards) = `+1 move` on Breadventure Land + loot drop; every due card = +2 XP (cap 60/day), +1 Health, +1 mana, +1 coin per 5 cards.
- **Securing cap (Option A):** Secured flashcards contribute up to **half** of a spec point's securing target (`Math.floor(need / 2)`, normally 2 of 4); the remaining half must be proved via Practice / Questing questions so application points cannot be secured by flashcards alone.
- Cards rated Again or Hard flag their spec point in `PROG.weak` for suggested Practice/Questing missions the next day.

## Examiner Key Words (`/js/key-words.js`)
- Single source of truth for mark-earning scientific & AO3 practical terms NOT already named in that sub-topic's spec wording.
- Format: `window.KEYWORDS = { 'B2.11': [['word', 'mark-scheme meaning'], ['da term', 'meaning', 'DA']] }`.
- Used by **Study Guides** (`js/study-guide.js`), **Spec Trackers** (`js/tracker.js`), **Type Fast or Perish v2** (`interactive/typing-game/`), **Admin → Review → Key words**, and **Flashcards**.
- Reviewed in `/admin/review.html#keywords` (`REVIEW.kHash`); any edit re-queues that spec point for teacher approval unless kept with `node tools/review/keep.js k <point> --why "user asked: …"`.
- **Copyright rule:** Local past-paper mark schemes may inform which general scientific terms matter, but zero Pearson text, mark-scheme lines, or paper codes may ever enter `js/key-words.js` or the repo.

## Checks & rebuilds
- After changing any card's `spec` tag or adding/removing cards: regenerate `interactive/spec-quiz/cards.js` (`CARD_COUNTS`), update `Flashcards/data/index.json` counts, and run `node tools/spec/build_index.js`.
- Syntax-check inline JS in `Flashcards/index.html`, run `python tools/test/links.py .`, and check 390 px phone layout.
