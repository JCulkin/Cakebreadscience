---
trigger: model_decision
description: Games and interactives (interactive/cell-game, elements-game, typing-game, older interactives), shared leaderboards, game access gate, and the Elevenstudents/ section of students' own games. Use when editing a game, adding a student's game or touching leaderboards.
---
# Games, interactives and Eleven Students

## Role in the site learning strategy
- **Curriculum interactives** (`Elements 1–20`, `What The Cell`, `Type Fast or Perish v2`, `Physics Equations`, `Waves`, `Chemical Tests`, `Food Webs`, etc.) build **visual/symbolic automaticity & fluency** so core facts don't clog working memory during multi-step AO2/AO3 problems (indexed in `tools/spec/build_index.js`).
- **`Elevenstudents/`** are student-made reward games — keep them clearly separate from core curriculum tools and gated behind `/js/game-gate.js`.

## Game access
- Games need a signed-in, teacher-approved account: `<script src="/js/game-gate.js"></script>` **first in `<head>`**
  (`data-mode="log"` = log only, never blocks). Approval at `/play/`; the teacher approves in Admin → Games.
- Full-screen games load `<script src="/js/home-link.js" data-mode="float"></script>` before `</body>` (keep the top-left 48 px clear,
  or `data-pos="bottom"`).

## Leaderboards — `/js/leaderboards.js` (LB), page `/leaderboards/`
- RTDB `gameScores/<board>/<uid>` = {name, score, t, extra}, best kept (transaction). Name = approved Questing name, else first name + initial.
- Boards `elements_{s1|s2|all}_{rounds|random}`, `cell_{normal|hard}_{full|all}`, `typing_v2_{sprint|storm}` (with `typing_{sprint|storm}` + `typingHighScores` kept read-only as the v1 archive). Old name-only boards
  (`elements20HighScores`, `typingHighScores`) are read-only history: never delete them. A new board path needs a Firebase rule from the user if `gameScores` doesn't use a `$board` wildcard.

## The games
- **What The Cell** `/interactive/cell-game/`: `cells.js` = seeded SVG cell engine (also used by lessons, worksheets and the question bank —
  change carefully), 9 rounds, team mode with steals, 108 Wikimedia micrographs with credits (`img/wiki/photos.js`, `credits.html`).
  Only spec 2.2 structures + plasmid / circular chromosome are named.
- **Elements 1–20** `/interactive/elements-game/`: spec C1.14–1.24, 1.37–1.38; table design "D" (user's); solo and team modes.
- **Type Fast or Perish v2** `/interactive/typing-game/`: draws directly from `/js/key-words.js` (plus core Double-Award spec terms, UK spelling, zero Separate-Science-only words) + silly phrases (no named creators, no swearing). Uses `typing_v2_{sprint|storm}` boards with read-only access to the archived v1 leaderboards.
- Older: Physics Equations Trainer, Waves (live); Stock Market Challenge (test page). `interactive/organisms/images/` licences unknown.
- Images from the web: only CC0 / public domain / CC BY / CC BY-SA, record title, author, licence, URL, and publish credits.

## Eleven Students — `/Elevenstudents/` (students' own AI-made games)
- `index.html` gallery (retro look, tabs Games / Simulations). The newest game = `project-card featured-card` with a flashing NEW badge
  (only one NEW at a time); Light Switch Puzzle keeps its VERSION 2 tag.
- **Adding a student's game:** save as `Elevenstudents/Games/<student>-<name>.html`; first commit = the original unchanged; second commit
  = fixes. Keep the student's language, design, jokes and credit; add game-gate, `/favicon.png`, the floating home link, "by Name"; list the
  fixes in a comment at the top. Gameplay changes beyond bug fixes: small only, and tell the user how to undo them.
  Draft first (noindex + test.html card, no gallery card) unless the user says to add it straight away.
- "No changes, comments" = report bugs and appropriateness only; don't edit.
- Compare a new upload with earlier ones (students send copies or old drafts).
- **Appropriateness (school site):** cartoon violence OK; real people as targets not OK (swap for made-up names); rename brand names
  in titles; nothing collected from players.
- p5.js gotchas: a phone tap fires `mousePressed` twice (ignore presses within 400 ms of a state change); scale movement by `deltaTime`
  (120 Hz screens); `touchMoved(){return false}` + `touch-action:none` to stop dragging scrolling the page.
- Test on desktop and a phone size with real taps: no page errors, no sideways overflow, and wait 3 s untouched (games that end on their own).
