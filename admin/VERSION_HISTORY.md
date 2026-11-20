# Cakebread Science — Version History

---

## [Unreleased]
- **Full spec wording everywhere:** the spec trackers, Practice and the Review page now show everything in the official specification. Physics equations appear under their point (word and symbol versions); the spec's scope notes appear as a small "Spec note" line (e.g. C4.6 "knowledge of reaction mechanisms is not required", which used to run straight into the sentence); the long descriptions for Biology 1.2, 1.3 and 1.4 fold away behind "… more" (1.2 as Plants / Animals / Fungi / Protoctists tabs) and print in full; section labels such as "Flowering plants" and "Humans" are back. Practice also shows the bullet points it was missing
- Lessons: slide tags "Double Award only" and "Beyond GCSE" (big, top-right) on every lesson, drafts and checked versions; their look lives in one file, /interactive/lessons/tags.css.
- Lessons: new Biology drafts (under review): 2d Movement of substances into and out of cells (39 slides) and 2f Respiration (24 slides), with own diagrams (diffusion, osmosis, active transport, factors, agar cubes, Visking tubing, plant cells in water, potato graph) and colour-coded equations.
- **Admin Review portal** (`/admin/review.html`, ✅ Review tab): go through the whole question bank one question at a time — spec point, question, answer, explanation, diagrams and calculation examples, any student reports — with a big **✓ It's good** button (or Enter), **Needs a fix** with a note, skip/back, filters by status, subject and sub-topic, and jump to an id. Worksheets get the same: every sheet made, with its mark scheme, marked Good or Needs a fix. **Anything edited after you checked it goes back to review automatically** (each check saves a fingerprint of the content). The Building the site box shows questions and worksheets checked / to review
- Admin Overview: **Building the site** box — lessons checked / under review per subject, worksheets per subject (sub-topics and spec points covered; worksheets, practice and challenge sheets), maths worksheets by spec section, and how many spec points have questions, flashcards and a worksheet. Counted live from the lesson list, worksheet pages and spec index
- Lessons: new Biology drafts (under review): 2a Levels of organisation (17 slides), 2b Cell structure (34 slides), 2c Biological molecules, food tests and enzymes (47 slides); own diagrams (levels ladder, elements, building blocks, food-test colours, lock-and-key steps, temperature and pH graphs). Cell diagrams on slides now draw bigger.
- Lessons: simpler lesson list and headers: no "Checked" badge, no dates on "Under review", no how-it-works box, progress line or format-trial link.
- Lessons: Biology 1 Living organisms checked and frozen as v2026-11-18.
- Lessons: removed mentions of Separate Science (Biology 1 course slide and paper 2; Chemistry 1a solubility note).

#### Added
- Science (Single Award) students: set a student's course in the admin console (Students → open the student → Course; new Course column). A Single Award student only sees the 249 Single Award spec points (with the Single Award wording on the 15 narrower points), their questions and flashcards, everywhere on the student side. The team quiz is unchanged. 8 new questions on litmus, galvanising/barrier methods and the carbonate test.
- **219 diagram and graph questions in the question bank** (93 spec points, 34 of them ★ harder): code-drawn graphs, circuits, ray diagrams, Sankey diagrams, magnetic fields, dot-and-cross diagrams, apparatus, the heart, eye, leaf, gut, food webs and more, with a new drawing every time. They appear in missions, Practice, the Quick/Team quiz (new "Include diagram and graph questions" toggle; at most a third of a quiz), Breadventure Land fights and dungeons, and set-work tests (each student gets their own drawing; the teacher sees the same one). Tap a drawing to enlarge it. At most 2 in a 10-question mission. Each drawing has a code (seed), so a reported question shows the reporter's exact drawing on the reports page
- **Lessons: new presenting controls (trial on 1f Ionic bonding):** a **Next slide ⏭** button (Shift+→) that skips any remaining reveals and goes straight to the next slide, a **⏮ Slide** button (Shift+←), and **▦ All slides** (G) — a grid of every slide, fully revealed, to jump to any point. The normal Next (→, space, click, clicker Page Down) still steps through reveals. Other lessons get these once approved
- **Lesson 1f Ionic bonding is checked** — the first lesson out of review (version 18 Nov 2026, `/interactive/lessons/chemistry/1f/`); it now appears in the spec trackers' resources
- **New lesson (under review): Biology 1 Living organisms** (`/interactive/lessons/biology/1/`) — built from the Topic 1 deck: MRS C GREN, the five kingdoms + viruses, pathogens; all the deck's photos and videos kept, organised by kingdom with photo galleries; new labelled cell diagrams (plant, animal, yeast, Mucor, Amoeba, Chlorella, bacteria, virus), a kingdom explorer, true/false checks and a "Which group?" picture quiz; a "Mrs C Gren" cartoon and a slide for each life process with pictures and diagrams; a new classification diagram; plants grouped into non-flowering and flowering (with crop examples); our own photo classification trees for plants, animals, fungi, protoctists and bacteria; our own bacteria-shapes and mycorrhiza diagrams; kingdoms in the order animals, plants, fungi, bacteria, protoctists; key points as cards above each labelled cell; 79 projector slides. The Lessons page now has a Biology tab

#### Changed
- **Lessons:** the ✎ Review notes system is gone (feedback now goes straight into the lessons chat); lessons not yet checked show an **Under review** tag. Big images with a plain coloured background now set the slide/frame to the same colour, and photos can be shown as soft-edged circles (used for the "cat-ions" kittens)
- **Lesson 1f Ionic bonding:** hydroxide (OH⁻, ball-and-stick with its charge) replaces phosphate; the ion-charge periodic table first shows only Groups 1, 2 and 3–7; fuller "Ionic compounds" and "Ionic lattices" slides (including conductivity); a colour-shaded melting-point table (simple molecular / ionic / giant covalent: methane, CO₂, water, CaCl₂, NaCl, SiO₂, MgO, diamond, graphite) on the page and on "Why high melting points?"; bigger cake-sale mnemonic; dark crystals slide

---

## [5.0.0] - 2026-11-18
### One site: one spec tracker, one sign-in, To do, and revision that works with or without the game

#### Added
- **One spec tracker:** Biology, Chemistry, Physics and the All subjects overview rebuilt as one tracker in the site's look, driven by real progress. Each spec point shows its status from Practice / Questing / Flashcards (Not started, Learning x/y, Secured, Rusty, No quiz yet), the student's own rating (Not yet / Unsure / Confident, saved to their account), "Covered in class" for their year, and links: Prove it (Practice, no game needed), mission, flashcards and worksheets/resources for that point. Filters: Not started, Learning, Rusty, Secured, Check these (confident but not proved), Covered in class. Every point has its own link (e.g. `/specifications/biology.html#B2.27`) for worksheets to point at. Old ticks and red/amber/green ratings carry over automatically. To do and the admin Students tab now show the "confident" %. Maths tracker unchanged
- **To do works with the tracker:** a new **Check these** list (points the student rated Confident but hasn't proved), a **Prove it** button (Practice Questions, no game needed) beside Quiz me on every point, point codes link to that point on the tracker, and the Spec trackers links open the All subjects page. The tracker opens on a filter from a link (`?f=check`)
- **Flashcards redesigned in the site's look:** big heading, the Cakebread Questing panel as a dark game banner, decks as bold tiles in their subject colours (Biology green, Chemistry red, Physics amber) with a Study button, a bolder card with Question / Answer labels in the deck's colour, clear rating buttons, an end screen with links to the Cakelab and Practice; links to To do and Practice Questions; the duplicate Home button removed
- **One sign-in box everywhere:** the same top-right box (Sign in, or To do → · first name · Sign out, plus Admin and Team quiz for admins) on the spec trackers, Physics 6-markers and learning bank, leaderboards, Quick quiz, Practice, Flashcards and tests; the old per-page sign-in buttons are gone, and no page shows a student's email address any more
- Homepage: **a new Cakebread Questing banner** showing Breadventure Land ("the revision game"); **Practice Questions** and **Flashcards** get their own cards; Quick quiz is now an admin-only **Team quiz** button in the header (opens straight into the team game)
- **My day is now called To do** (header button, Questing bar, page title)
- Admin Teaching tab: **All years** view — every sub-topic with a tick box for Year 8, 9, 10 and 11 (and one for all years), to compare and fill in every year at once
- **Practice Questions shows "Set by your teacher"**: the student's unfinished work for their year at the top, with Start the test / Carry on and practise buttons
- **"New on Cakebread Science" box** at the top of the homepage and To do introducing the new features (Questing, spec trackers, Practice Questions, Flashcards, To do); once closed it stays closed
- A red **Admin** button in the header next to To do, for admin accounts only (replaces the small floating button at the bottom of the homepage)
- **Cakebread Questing:** features unlock as you level up (the game starts simple); a **Stats** page (game completion, revision, map, collection); the Wardrobe shows only what you own; admin **Game showcase** page
- **Breadventure Land:** moves happen when you make them (only boss fights wait for midnight); a starter boss by the Cakelab and bosses in a clear order with gentler hits; treasure chests everyone can see through the fog, with 47 new items to win; the admin can give extra moves
- **Elevenstudents:** AskGPT and Rompe Ladrillos by Hector (with the games sign-in, a home button and phone fixes); Maths and Essays sections removed from the gallery; tabs fit on phones

#### Fixed
- Pablo's game (Elevenstudents) had an unfilled Firebase setup, so its sign-in never worked; it now uses the site's account
- **Restricted games fail safe:** a game stays hidden until the player's approval is confirmed; if it can't be confirmed within 10 seconds (e.g. the network blocks Firebase) the player goes to the sign-in page instead of playing (a student had played Wholesome Snake without approval)
- My day and set-work tests never wait forever: every database call has a time limit, the page always draws, and it says which part of Firebase couldn't be reached (to diagnose the school network)
- Breadventure Land: new students' moves
- Spec tracker ratings: the account now wins over an old copy in another browser, and a rating that couldn't be saved (e.g. the school network blocking Firebase) is saved on the next visit
- Homepage footer → v5.0.0

---

## [4.1.1] - 2026-11-17
### Fixed
- My day no longer gets stuck on "Loading your day…" for students who had cleared their Breadventure Land moves (and now shows a short version instead of hanging if anything else goes wrong), so set work shows up
- The same problem on the Breadventure Land map (other players' panel) and the admin Breadventure Land tab
- Homepage footer → v4.1.1

---

## [4.1.0] - 2026-11-17
### Teaching by year group, set work, games access and a way home from every page

#### Added
- **Year groups:** every student picks Year 8, 9, 10 or 11 once (only the teacher can change it afterwards)
- **Admin Teaching tab:** tick what each year has been taught in class, and set work for a year — either a **test** (one go, scored, same questions for everyone; see each score, the average and how each question went) or **practise until N right**
- **My day:** "Set by your teacher" (start / carry on a test, see your score, practise progress) and "Covered in class"
- **Games need sign-in and the teacher's approval:** Elevenstudents games, extras and maths, and the Stock Market Challenge; new `/play/` sign-in page; admin **Games** tab to approve, block and see every play (simulations and our own science games stay open, plays logged)
- **A way back to the homepage on every page**, phone and desktop (Professor-head button at the far left of the Questing bar)
- Question bank: 328 new questions — every spec point now has at least five (2,133 total)
- Breadventure Land: the Underworld (dig through the Abandoned Mine), boss stories, weekly events, rally bonus, helping other players, plan a whole route with one tap, region names, new dragon, redrawn bosses
- Missions: a misconception per mission and 16 new monsters, second wind on missed questions, streaks, keyboard answers, fight again / next mission; plain **Practice** mode with no game; rolling last-7-days board and legendaries
- Booklets: Forces and Motion (Physics) and Ionic & Covalent Bonding (Chemistry), with mark schemes
- Worksheets: the Practice/Challenge sheets are live on the science worksheets page; Chemistry 1a States of Matter Practice sheet
- Elevenstudents: Duelo de Campeones by Anxo (fixed)

#### Changed
- Type Fast or Perish: WPM counted like a standard typing test
- Admin: Students tab shows and filters by year; "Gone quiet" moved to the bottom of the Overview

---

## [4.0.0] - 2026-11-10
### One Revision Journey: Breadventure Land, Flashcards in Questing, My Day, the Professor

#### Cakebread Questing
- **Breadventure Land is live as one shared world** for everyone who plays: plan moves on the map, and each night (run by the first visit after midnight) everyone's moves resolve together — fight the chapter-1 bosses side by side to win the three key pieces and free the Professor, then chapter 2 wakes. Eight small monsters you can beat alone, wild critters, dungeons, a morning report, other players on the map, boss rewards (coins + items)
- **Health, mana and moves come from revision:** right mission answers and flashcard reviews recharge Health and mana; the day's first mission or today's flashcards gives +1 move. Spells (Patch Up, Jam Shield, Lift the Fog) and the **Tuck Shop** brews, bought with real coins
- **Base camp is now the Cakelab**, with a Breadventure Land picture card at the top
- **Flashcards are part of Questing:** every card reviewed earns XP, Health, mana and coins; finishing today's cards drops loot; secured cards help secure spec points; cards you struggle with come back as a suggested mission. The Study Blob pet is gone. Cards load instantly (no more unpacking the Anki files in the browser) and Flashcards uses the same Google sign-in as the rest of the site (students sign in once more)
- Students can choose their adventurer name; **new names wait for the teacher's approval**
- Missions: the Professor reacts to every answer and gives a verdict at the end; `?point=` missions start on a single spec point

#### Added
- **My day** (`/today/`): what to do today (mission, cards, map moves) and what to revise next — nearly secured points, flashcard weak spots, rusty points. "My day →" button in the homepage header when signed in
- **Spec trackers link to everything (One spec, step 1):** each spec point shows its Cakebread Questing status (secured / rusty / learning, or "quiz: not tried" when you rated it but haven't proved it), Quiz me, its flashcards, and the lessons, worksheets, 6-mark questions and equations that cover it
- **The Professor**, the cake-slice scientist mascot: favicon and home-screen icons, homepage logo, Questing sprite, reaction faces, mission verdicts, a new 404 page
- **Admin console rebuilt:** overview with the name-approval queue, students (with a detail drawer: rename, hide, progress, strengths and weak spots), a spec map of every student × spec point, question statistics, leaderboard clean-up, Breadventure Land controls, backup and restore

#### Changed
- Homepage: the black Cakebread Questing banner is the hub for revising the spec — **Play →** plus **Quick quiz** (solo or team game on the board) and **Flashcards** inside it; the Leaderboards and Physics Long Answers cards are gone (the games link to `/leaderboards/`; the 6-markers live in **Question Booklets**); one **Spec Trackers** card, whose page now has Biology, Chemistry, Physics and Maths together
- Quick quiz goes straight to "Choose the content", remembers what you last ticked (nothing on a first visit) and goes back to the homepage
- No teacher notes on student pages; no "class" wording in Questing (one world for everyone)

#### Fixed
- Clicking a point on the spec trackers now opens it
- Spec trackers no longer scroll sideways on phones
- Homepage footer → v4.0.0

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
