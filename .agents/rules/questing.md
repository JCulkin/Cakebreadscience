---
trigger: model_decision
description: Cakebread Questing (interactive/spec-quiz/) — the revision game, its engine and securing rules, Breadventure Land map, missions, Practice, Quick quiz, items, Stats, Flashcards-in-Questing. Use when editing anything in interactive/spec-quiz/, Flashcards/ or the To do page's game parts.
---
# Cakebread Questing (`interactive/spec-quiz/`)

## Role in the site learning strategy & research principles
- Owns **Layer 3 (application, misconception busting & spaced proof)** alongside plain Practice (`practice.html`):
  - **Desirable Difficulties & Distributed Practice (Bjork):** Two-different-days securing + 21-day rust decay prove durable retention; immediate **Second Wind** retries are intentionally *excluded* from securing so short-term correction doesn't fake long-term mastery.
  - **Interleaving & Scaffolding:** `buildMission` mixes ready-to-secure → rusty → missed → new and climbs L1 → L2 → L3.
  - **Misconception Refutation & Transfer:** Plausible misconception distractors + elaborative feedback; Option A caps flashcards at half of securing so quiz questions prove AO2/AO3 transfer.

## Names (the user's)
- The whole thing is **Cakebread Questing**; the map is always **Breadventure Land**. Game home = **the Cakelab** (`adventurer-home.html`).
  The mascot is the Professor; the dragon is Crumbmaw. One shared world, no classes, ≤ ~5 players at once.
- Pixel art is drawn in code (sprite grids in `adventurer-shell.js` `ADV.ICONS`, items as layers in `adventurer-pixel.js`). No downloaded assets.
- **Everything must also work without the game**: wherever a point offers "⚔️ Quiz me", also offer "📝 Prove it" (`practice.html?point=KEY`).
- Most numbers (stats, boss health, coins, unlock levels, moves) are Claude's and still untested with real students: change them only if asked.
- The 61 misconceptions (`misconceptions.js`), boss stories and item jokes are first drafts the user hasn't reviewed. Keep jokes school-safe
  (teen-meme words, nothing about bodies or dating, nothing gory). The science in them must stay inside the Double Award spec.

## Pages
- `index.html` Questing menu · `adventurer-home.html` Cakelab · `adventurer-mission.html` missions (10 questions vs a sub-topic's
  misconception; 7 hits defeat it; second wind on missed questions — not recorded) · `practice.html` **Practice** = plain mode, same engine
  and progress, no game · `adventurer-map.html` Breadventure Land · `adventurer-wardrobe.html` · `adventurer-create.html` (look) ·
  `adventurer-stats.html` (percentages only, never totals — the user wants what's to come hidden) · `quiz.html` Quick quiz / team quiz
  (nothing saved; levels 1/2/3 chips) · `reports.html` (admins: reported questions) · `diagram-lab.html` (test page for diagram makers).
- Deep links: `?point=B2.27`, `?sub=B2e`, `?subs=C1a,C2.5&n=15&t=<title>` (5–30 questions; results offer "Another n").
- Plain mode: `localStorage cbs.plain = '1'` sends mission deep links to Practice.

## Script order (every Questing page and `/Flashcards/`)
firebase-config → firebase app/auth/firestore/database compat 9.22.2 → `spec.js` → `questions.js` → `gens.js` →
(`/interactive/cell-game/cells.js` + `diagrams.js` on pages that show questions) → `diagq.js` (every page that loads gens.js; **never twice**) →
`/js/course.js` (student pages only; not showcase, quiz.html, reports) → `cards.js` → `questing-engine.js` → `adventurer-items.js` →
`adventurer-pixel.js` → (`bland.js` on map, Cakelab, To do, admin, showcase) → `adventurer-shell.js` (not on Flashcards or Practice) →
(`misconceptions.js` on mission, Cakelab, showcase).
- **Never redeclare these globals on a page:** `M`, `T`, `MH`, `TH`, `QUESTIONS`, `G`, `R`, `sub`, `AR`, `AN`, `CAT`, `cfg`, `gcd`, `mr`,
  `formula`, `eqGen`, `CALC_IDS`, `EL20`, `CMPDS`, `arList`, `MISCON`, `DG`, `DQ`, `KEYWORDS`.
- **`QE` and `MISCON` are top-level `const`s, not on `window`**: test with `typeof QE !== 'undefined'`.
- `window.QE_PASSIVE = true` before loading = no Firebase (admin console, showcase).

## The engine — `questing-engine.js` (QE)
- **Secured question** = right first time on two different days; a wrong answer drops it back; true/false counts half.
- **Secured spec point** = secured questions + capped secured flashcards ≥ min(4, its question value). Flashcards contribute at most **half** of `need` (`Math.floor(need / 2)`, normally 2 of 4), so flashcards alone cannot secure a spec point — students must prove the rest with quiz questions.
  **Rusty** after 21 days without a correct answer; one correct polishes it. These rules drive trackers, To do, study guides and admin.
- XP 5 / 7 / 10 per right answer at question level 1 / 2 / 3; +20 per secured question; +100 first time a point is secured.
- `buildMission(keys, fill, {n, avoid})`: ready-to-secure → rusty → got wrong → new (~40% L1 / 40% L2 / 20% L3), sorted by level,
  at most 2 diagram questions per 10. Other API: `recordAnswer`, `finishMission`, `picks`, `allSubs`, `pointState(key)`,
  `POINT_QS`, `inst(q)` (generator → concrete question), `onChange`, `report`, `log(icon, msg)`, `tally`, `mark`.
- **Data:** Firestore `users/{uid}.specQuiz` (progress: `q: {id: {c, d, l, n, r}}`, xp, dc per-day counts, cards, weak…),
  `specQuizSummary` (incl. `points: {'B2.27': 's'|'r'|'l'}` for trackers), `users/{uid}.questing` (coins, bag, look, eq, nick,
  best, tally, seen, log). Local copies in localStorage; signed-out progress merges in on sign-in (maxes / unions).
- Board: RTDB `specQuizBoard/{uid}` (self-reported; "most correct" = rolling last 7 days via `d7`, not Monday–Sunday).
- **Names:** a typed adventurer name stays private until the admin approves it (`checkName` rules: 2–16 letters, rude-word lists,
  no staff titles). Leaderboards otherwise use first name + initial.

## Shell, levels and items — `adventurer-shell.js` (ADV), `adventurer-items.js`
- Features unlock by level (`ADV.UNLOCKS`, `ADV.can(id)`): L1 clothes & single-hand items · L2 spells/mana, hats · L3 two-handed items · L4 shop, brews, weekly events ·
  L5 dungeons · L6 shield, helping · L7 fog, the Abandoned Mine → the Underworld. Common/Uncommon non-hat single-hand items, boss drops and Main Character items (the 3 weekly legendaries) have no level limit. Nothing owned is ever taken away.
- Level from XP, capped at 2 + 1 per 5 secured points (4 on Single Award). Stats: Strength (Physics), Health (Biology), Magic (Chemistry) + per level + gear.
  Science affinity: Biology/Chemistry specialists hit matching-science monsters and bosses as hard as Strength; Magic also boosts Patch Up (+1 per 5 Magic) and overnight mana regen (+1 + floor(mag/10) a night).
- Items (94): `slot` head/top/bottom/shoes/hand, `side`, `two` (two-handed), `r` rarity (**Common · Uncommon · Rare · Lowkey Iconic · Mythic**;
  weekly science items are **Main Character** items), `lv`, `s` science, `str/hp/mag`, `fx` ability, `from`, `d` joke, `dark` (cursed chests).
  A science set (≥ 4 slots from one science; remaining slots can hold anything) = +15% and a coloured glow.
- `ADV.S` = this browser's copy of the map state, owned by one account (`S.owner`; shared school computers reset it).

## Breadventure Land — `bland.js` (BL) + `adventurer-map.html`
- One shared world in RTDB `bland/`: `world` (day, chapter, boss health, hits, chests, finds, log…), `state/{uid}` (position, health, mana,
  moves, bonus, camp, brews…), `pub/{uid}` (public profile incl. `fx`). Any signed-in player can write `world` and `state` (needed for the
  night); `pub` is own-only. Known trade-off: trusted, small group.
- **Moves happen instantly** (user's rule) except boss fights: camp on a boss square, one attack per move, fought at midnight with everyone
  camped there (`BL.resolve`, run by the first browser to open the map after midnight). Walking away refunds the camp.
  Small monsters = one bank question each. 6 moves on day one, +2 a night (bank up to 4), +1 for the day's first revision;
  teacher's extra moves in `state.bonus` (`BL.movesOf(st)` = moves + bonus — use it everywhere moves are shown).
- Treasure chests spawn each night, visible through the fog, first to reach one wins it (claimed by transaction), some are mimics.
- Dungeons = floors of bank questions (once a day each); the mine (5 floors) opens the Underworld (rows 17–25 of the same grid).
- The night writes `world` field by field and players' states only in `NIGHT_FIELDS`, so it can't overwrite someone moving at that moment.

## Flashcards — `/Flashcards/`
- See `.agents/rules/flashcards.md` for full rules (data, permanent IDs, SM-2, Single Award, deep links, and `js/key-words.js`).
- Card secured = Good/Easy on two different days (counts for up to half of a spec point's securing target). Today's cards (≤ 15) done = the day's revision (+1 move, loot).

## Admin pieces for the game
- `/admin/showcase.html` = everything in the game drawn live from the files (open without sign-in; holds no student data).
- Admin → Breadventure Land tab: players, bosses, give extra moves, drop/remove chests, run tonight's night now.
- Admin → Students → a student → "Their character" (gear, bag, map state, last night's report, activity log `users/{uid}.questing.log`).
