# Cakebread Science — Version History

---

## [3.1.1] - 2026-11-09
### Tidier Homepage & One Spec Tracker Page

#### Changed
- Homepage Resources trimmed: the **Leaderboards** card and jump link are gone (each game, and Cakebread Questing, links to `/leaderboards/`); **Physics Long Answers** now lives inside **Question Booklets**
- One **Spec Trackers** card replaces "Science Spec Tracker" and "Maths Spec"; its page (`specifications/science.html`) now shows Biology, Chemistry, Physics and Maths together, and the Maths spec links back to it
- Cakebread Questing menu: "All leaderboards →" link under this week's board
- The black **Cakebread Questing** banner on the homepage is now the hub for revision on the spec: Play → (the adventure), plus **Quick quiz** (solo or team game on the board) and **Flashcards** inside it; the separate Flashcards card and the "Just want a quick quiz?" box at the bottom of the Questing page are gone
- Quick quiz page goes straight to "Choose the content" (intro text, Questing card and "Make a quiz" heading removed); its back link goes to the homepage; it remembers what you last ticked, and starts with nothing ticked on a first visit
- Homepage footer → v3.1.1

---

## [3.1.0] - 2026-11-09
### Cakebread Questing, Shared Leaderboards & Question Booklets

#### Cakebread Questing (`interactive/spec-quiz/`, replaces the Spec Quiz)
- The Spec Quiz is renamed **Cakebread Questing** everywhere; its menu is now the Questing page at the same address
- **The Adventurer:** students make a pixel adventurer (no gender field; hijab, turban/patka, kippah, glasses, hearing aid), with a **Base camp** (level, Strength / Health / Magic from secured spec points, coins, newest loot), **Missions** (10 real bank questions as a fight against a misconception, ⚑ report button on every question), a **Wardrobe** (six gear slots, loot from missions, weekly legendaries) and **My look**
- Runs on real progress: same rules as the old Campaign (right first time on two different days secures a question; enough secured questions secure the spec point; rust after 21 days), saved to the student's Google account. Existing Campaign progress carries over
- New `questing-engine.js` holds the progress rules and saving; the old Campaign screen (`campaign.js`, Italian gear, scout badges, ranks) is retired
- Legendaries go to the most correct answers in each science **this week**; the class board shows this week's most correct answers with each student's adventurer
- **Breadventure Land** (the class map, story chapter 1: free the Professor from Crumbmaw the dragon) is up as a clearly labelled **preview**: explore, plan moves, try a night. Nothing on the map is saved to the account yet and there are no class battles until the shared map is built
- The tick-the-spec picker is now **Quick quiz** (`quiz.html`): solo or team game on the board, nothing saved
- "Show me on the class leaderboards" switch on Base camp

#### Leaderboards
- Shared leaderboards for Elements 1–20, What The Cell and Type Fast or Perish: Google sign-in names, one row per student (best score), sign-in prompt to save; `/js/leaderboards.js`
- New combined page `/leaderboards/` (all games + Cakebread Questing), linked from the homepage. Scores from before sign-in stay on the boards, marked as such
- Type Fast or Perish shows words per minute next to points, explains the scoring and compares your speed with published averages

#### Added
- **Question Booklets** page (`/booklets/`): Physics 6-mark long-answer booklet (online, or print the booklet, guided booklet or mark schemes), with spaces for Chemistry, Biology and topic booklets
- Homepage: **Google sign-in at the top right** (`/js/account.js`; one account across the site), Cakebread Questing card, Question Booklets card; Resources now come before Interactives
- Sitemap: booklets and leaderboards pages

#### Changed
- Admin console button moved to the bottom right of the homepage (the sign-in box is top right)
- Homepage footer → v3.1.0

---

## [3.0.0] - 2026-11-07
### New Homepage, Spec Quiz & Classroom Games

#### Homepage (`index.html`)
- New design: jump links; three featured games; interactives grouped by subject (Biology, Chemistry, Physics, Maths); Resources (Lessons, Spec Quiz, Physics Long Answers, Spec Tracker, Flashcards, AI Tutor, Maths Spec); Worksheets; More (Elevenstudents + useful websites)
- Footer → v3.0.0

#### Added
- **Spec Quiz** (`interactive/spec-quiz/`): 1,805 multiple-choice and true/false questions covering every point of the Edexcel IGCSE Double Award spec, 46 randomised calculation generators, ★ harder questions
  - Make a quiz: tick spec points, play solo or as a team game (2–6 teams, timer, steals, podium, projector sizing)
  - **Campaign**: work through the whole spec; questions are secured on two different days, points go rusty after 21 days; XP, 15 ranks, scout badges, Italian gear, legendary trophies; weekly and all-time leaderboards; progress saved to the student's Google account
  - "⚑ Report this question" on every question + admin reports page (`reports.html`)
- **Elements 1–20** (`interactive/elements-game/`): 11 rounds on the first 20 elements (symbols, groups, electron configurations, ions, p/n/e), solo, team/projector and Explore modes, online Top 10
- **What The Cell** (`interactive/cell-game/`): 9 rounds on cell structures with drawn cells and 108 openly licensed micrographs (credits page, student Gallery), Normal/Hard, solo and team modes
- **Type Fast or Perish** (`interactive/typing-game/`): science key-word typing game, Sprint and Hard modes, online Top 10
- Physics Long Answer Practice, Physics Equations Trainer and Transverse & Longitudinal Waves linked from the homepage
- Sitemap: new games and quiz added

#### Testing page only (not linked from the homepage)
- Interactive lessons (drafts): Chemistry 1a States of matter, 1f Ionic bonding, 1g Covalent bonding, with projector mode and review notes
- Practice & Challenge worksheets: Physics 3b wave speed, Biology 1a, Chemistry 1b bonding
- Stock Market Challenge

#### Fixed
- Sitemap listed 31 worksheet pages that no longer exist; now lists the real worksheet pages
- Elevenstudents: broken High Scores links in Ian Pong and Pasha Jumpy, and the Solar System play button on the High Scores page

---

## [2.5.0] - 2026-06-23
### Ecology Tools — Food Webs & Ecological Pyramids

#### Food Webs (`interactive/food-webs/index.html`)
- Rebuilt the old "Food Web Builder" placeholder into a finished **Food Webs — IGCSE Ecology** tool (WIP sticker removed)
- Two modes: **Demonstration** (board-friendly) and **Interactive** (quiz)
- Two ecosystems: **Savanna** and **Garden**, each a full web of producers, consumers and decomposers
- Demonstration tools: **Energy pyramid** view, **Trace food chains**, **Remove a species** (shows knock-on effects), and **Reset**
- Click any organism to inspect its role, trophic level and feeding links; arrows point in the direction energy flows; legend covers producer → apex plus decomposers
- Interactive mode: 8-question session (identify role, arrow direction, trophic level, build-a-chain, predict-the-effect) with progress bar and score

#### Ecological Pyramids (`interactive/ecological-pyramids/index.html`)
- WIP banner removed; tool finished
- Expanded from 2 to **4 ecosystems**: Grassland, Oak Tree, Sea, Desert
  - **Oak Tree** demonstrates an irregular pyramid of numbers (one tree → tiny bottom row, bulging middle)
  - **Sea** demonstrates an inverted pyramid of biomass
- Switched from a square-root scale to a **true linear scale** (bars show the real ~10%-per-level drop) — appropriate for GCSE
- **Single organism per trophic level** on every pyramid
- Simplified units: **biomass in kg, energy in joules**
- Energy pyramid kept as one continuous stack (no longer split apart by "90% lost" rows)
- Added a **food-chain box diagram** in its own panel beneath each pyramid
- Widened the layout so pyramids use the full screen width, making the linear scale read better

#### Changed
- Homepage footer version → v2.5.0

---

## [2.4.0] - 2026-06-02
### Admin Fix, WIP Tools & Housekeeping

#### Fixed
- Admin console spec progress now reads from `specProgress` Firestore collection directly, falling back to `users.specSubjects` — previously showed nothing if the summary field hadn't been written

#### Added
- `interactive/ecological-pyramids/index.html` and `interactive/quadrilaterals/index.html` linked from homepage Interactive card (both WIP)

#### Removed
- Deleted orphaned `Elevenstudents/Flashcards/` directory (~120 files, duplicate of root `Flashcards/`)
- Deleted `Flashcards/blob-test.html` development artifact

#### Docs
- README updated: `Secret/` → `Extras/`, v2.2 and v2.3 added to Recent Updates, interactive tools list corrected

---

## [2.3.0] - 2026-05-26
### Filter Compatibility & Cleanup

#### Changed
- Renamed `Elevenstudents/Secret/` directory to `Elevenstudents/Extras/` to avoid content filter flagging
- Renamed `secret-aracde.html` → `bonus-arcade.html`, `secret-lab.html` → `bonus-lab.html`, `secret-adventure.html` → `adventure.html`
- Renamed `secret-games/` subfolder to `minigames/`
- Retitled "NOT SO SECRET ADVENTURE" game card to "The Big Adventure"
- Replaced `easter-egg-1`/`easter-egg-2` CSS class names with neutral `footer-link`/`footer-link-alt`
- Replaced `konami-notification` CSS class and `konami` element ID with `game-notification`/`game-notif`
- Renamed `konamiCode`/`konamiIndex` JS variables to `cheatCode`/`cheatIndex`
- Removed dead logo click-counter that pointed to non-existent `admin-panel.html`
- Removed inline comments referencing "Easter Egg", "Konami code", and "Secret arcade"

---

## [2.2.0] - 2026-05-01
### Chemical Tests Tool & Iggy v2

#### Added
- `interactive/chemical-tests/index.html` — new interactive Chemical Tests reference tool, linked from main homepage

#### Changed
- `Elevenstudents/Games/iggy.html` — Light Switch Puzzle upgraded to Version 2 with 5 difficulty levels (tutorial through "truly unreal")
- Elevenstudents index: featured card styling added for Iggy v2 with animated highlight badge

---

## [2.1.0] - 2026-03-12
### Admin Console & Refactor

#### Added
- `admin/index.html` — full admin console restricted to authorized Google accounts
  - Flashcard Users tab: study stats per user (studied, learning, mastered, last access)
  - Spec Progress tab: per-student specification progress with subject breakdowns
  - Export/restore JSON backup tools
- Admin button on main homepage (visible only to admin emails)
- Genetics simulator added to interactive tools

#### Changed
- Moved user management out of Flashcards app into admin console
- Specification tracker now syncs `specSubjects` progress summary to Firebase on save

#### Fixed
- Duplicate `<!DOCTYPE html>` declaration in `specifications/science.html`

---

## [2.0.0] - 2026-03-10
### Visual Design Overhaul — Lok

#### Changed
- Complete restyle to "Lok" design system: cream `#eeeae0` background, jet black `#111` ink, forest green `#005e22` accent
- Replaced purple gradient theme (`#667eea`/`#764ba2`) sitewide
- Fonts: Barlow Condensed 900 for headings, Barlow 400/600 for body
- Zero border-radius throughout; flat offset box-shadows (`3px 3px 0 #111`)
- Unequal-width stripe motif on hero cards and header bands
- Subject accent colours: Maths `#2255cc`, Biology `#005e22`, Chemistry `#c8001e`, Physics `#d08000`
- All worksheet `theme-color` meta tags updated to match subject colour
- Elevenstudents index, Flashcards app, interactive tools, and specification pages all updated
- Deleted style-test prototyping folder

---

## [1.0.0] - 2026-02-20
### Initial Production Release

#### Added
- Complete IGCSE Edexcel resource library
- **Flashcards System** — spaced repetition learning with Google authentication
  - Biology, Chemistry, Physics, and Physics Equations decks
  - Study Blob pet system with progression (Egg → Master)
  - Pet store with accessories and food items
  - Progress tracking, statistics, daily streaks, and badges
- **Worksheets & Solutions** — categorized by subject and topic
  - Biology (51 worksheets), Chemistry (40), Physics (50+), Maths (30+), Cross-curricular
- **Curriculum Specifications** — full syllabus coverage for all sciences and maths with progress tracking
- **Interactive Tools** — Food Web Builder, Organism Gallery, Angle Rules visualizer
- **Game Collection** (Elevenstudents) — 10+ student games with Firebase-backed leaderboards

#### Technical Stack
- Frontend: HTML5, CSS3, Vanilla JavaScript
- Auth: Firebase Authentication (Google Sign-in)
- Database: Firestore (user progress), Realtime Database (game scores)
- Libraries: Chart.js, JSZip, SQL.js (Anki compatibility), p5.js

#### Security
- Removed temporary test files before launch
- Disabled debug console logging in Flashcards module
- Firebase API keys are client-facing, protected by Firestore security rules

---

### Roadmap
- [ ] PWA / offline mode
- [ ] Mobile app (iOS/Android)
- [ ] Collaborative study groups
- [ ] AI-powered study recommendations
- [ ] Video lesson integration
- [ ] Community flashcard sharing
