# Cakebread Science — how we work (for Antigravity and any other AI agent)

This file is always loaded. Topic rules in `.agents/rules/` load on demand (index at the end). **If the user tells you something different now, the user wins** — say so, so the rules stay current.

## The site and the user
- **cakebreadscience.com**: one teacher's science site (Years 8–11 at one school). Static HTML/CSS/JS, **no build step**, Netlify hosting, Firebase sign-in/data. Repo `github.com/JCulkin/Cakebreadscience` is **public**.
- Course: **Pearson Edexcel International GCSE Science (Double Award)**, B / C / P, **no tiers**. **Single Award** = subset of Double Award with the same point numbers (`/js/course.js`). KS3 (Years 8–9) = simpler version of the same spec. **Never mention or teach Separate Science.**
- **"The user"** = the teacher. Blunt, direct answers — no flattery, no hedging; lead with the answer. If he is wrong, say so and why. Fix mistakes in his material and tell him.
- Student copy: plain British English, short sentences, zero jargon.

## Learning strategy & research principles
Edexcel IGCSE Science (4SD0 / 4SS0) tests **AO1 Knowledge (~40%)**, **AO2 Application & Calculations (~40%)**, and **AO3 Practical & Data (~20%)**. Each area owns one job — never duplicate another layer:
1. **Lessons (`interactive/lessons/`) — Understand:** **Projector deck (`deck.html`)** = whole-class teacher-led visuals, stepped reveals & mid-lesson hinge AfL (Cognitive Load / Mayer Dual Coding / Wiliam; zero self-study clutter). **Student study guide (`study.js`)** = chunked catch-up with Worked Example → *Now you try*, Common Mistakes refutation, immediate micro-checks (*not* spaced securing), auto-injected Examiner Key Words (`/js/key-words.js`), auto Single Award filter (`/js/course.js`), and handoffs to Flashcards/Practice/Questing/Worksheets/Booklets. (Details: `lessons.md`.)
2. **Flashcards & Key Words (`/Flashcards/`, `/js/key-words.js`, `Type Fast or Perish v2`) — Memorise:** Cold AO1 recall + exact examiner wording via SM-2 spaced repetition (Testing Effect / Roediger & Karpicke; Cepeda). Atomic prompts, bulleted idea units, 1–4 rating. Missed cards (`PROG.weak`) feed next-day Questing/Practice. (`flashcards.md`.)
3. **Questing & Practice (`interactive/spec-quiz/`) — Apply & Prove:** L1 recall entry → L2/L3 calculations, diagrams & misconception refutation (plausible distractors + elaborative feedback). **Two-different-days securing + 21-day rust decay** (Bjork's desirable difficulties; Second Wind excluded). **Option A cap:** flashcards count for ≤ half of securing; quiz proves transfer. (`questing.md`, `question-bank.md`.)
4. **Worksheets, Topic Booklets & 6-Markers (`worksheets/`, `booklets/`, `interactive/physics-long-answer/`) — Write Exam Answers:** Faded scaffolding & attempt-first self-explanation. **Worksheets** (2–4 sides, single-lesson scaffolded practice) · **Topic Booklets** (10–14 pp whole-topic workbooks) · **6-Markers** (online black-then-purple self-marking + `learned.html` gap bank). (`worksheets.md`.)
5. **Hubs & Topic Interactives (`today/`, `guide/`, `specifications/`, `interactive/*`) — Route & Calibrate:** Spec Trackers pair self-rated confidence vs. 2-day proof (`Check these` fights the Illusion of Competence); `To do` & Study Guides route across all 4 layers; `/js/key-words.js` is the single vocabulary source; curriculum interactives build visual/symbolic fluency to free working memory. (`admin-and-students.md`, `games.md`.)

## Hard rules (never break these)
1. **Never push or merge to `main`.** Work on `staging` only (`main` costs 15 Netlify credits/deploy, 300/month, renews 29th). **Only the dedicated Antigravity release chat** (`Cakebread Science - Release (staging -> main)`) may merge `staging` → `main` when the user says **"release"** / **"publish to main"** (`release.md`).
2. **Never commit Pearson past-paper material** (real exam questions, mark schemes, diagrams or scans — repo is public). Original questions *in the style of* past papers are fine. (Local exam tool: `exams-local.md`.)
3. **Question & flashcard IDs are permanent** (`P3.5-03`, `C1.46-d1`, Anki timestamps): progress saves against them. Fix wording in place; never renumber, reuse or delete.
4. **The user reviews everything.** Never mark content checked yourself unless he asks.
5. **Student pages:** never show email addresses; no teacher/admin notes; no "class" (one shared world: "everyone"); visible home link on phone & desktop; every Firebase call has a timeout and degrades cleanly when Firebase is blocked (school filter).
6. **Never cut down the spec.** Always show full Edexcel point text + bullets (`SPECPT` in `/js/spec-point.js`).
7. **Printed material must read in greyscale** (nothing told apart by colour alone).
8. **Firebase rules are the user's.** New DB paths need a rule he adds in Firebase console — give him the exact rule; never enter credentials.
9. **No extra repo docs/READMEs** — only `AGENTS.md` and `.agents/rules/*.md`.
10. **Keep rule files lean (prevent instruction dilution):** `AGENTS.md` must stay under **15 KB**; keep `.agents/rules/*.md` focused on *current* rules only — delete retired/legacy rules once superseded, and never duplicate a rule across two files (point to the owning file).
11. **Don't read full `admin/VERSION_HISTORY.md`:** read only the top ~40 lines (`## [Unreleased]`) when adding a changelog entry — never pull the full history into context.

## Git workflow (multiple AI chats share `staging`)
- **Before starting and before pushing:** `git fetch origin && git rebase origin/staging`. Small focused commits, stage only your own files (`git add -- …`), never force-push or reformat untouched files.
- Don't commit as `Claude <noreply@anthropic.com>` (reserved for Claude).
- **Changelog:** add one plain-English bullet under `## [Unreleased]` (`#### Added` / `Changed` / `Fixed`) in `admin/VERSION_HISTORY.md` (read top ~40 lines only). On rebase conflict, keep both sides.
- **Generated files:** after changing questions, flashcards, lessons, worksheets, booklets, long answers or equations, run `node tools/spec/build_index.js` and commit `js/spec-index.js` (+ `admin/worksheets.json` only if more than its `built` date changed). On conflict in `js/spec-index.js`, rerun the builder.
- Open release PR #8 preview: `https://deploy-preview-8--cakebreadscience.netlify.app`.
- **Hand-editing generated HTML** (worksheets, most lesson drafts, item sprites — built by private Claude workspaces): say *"hand-edited HTML"* in the commit message and changelog so builders don't silently overwrite it.

## New pages & review lifecycle
- New page = `<meta name="robots" content="noindex">` + card on `test.html`; add to homepage/`sitemap.xml` and drop `noindex` only when approved.
- Every page needs a `/` home link (header or `<script src="/js/home-link.js"></script>` before `</body>`; `data-mode="float"` for full-screen games). Sign-in box = `/js/account.js` only.
- `/admin/review.html` fingerprints questions, worksheets, lessons and key words — **any edit re-queues the item automatically**.
  - **User-requested edit on a checked item (or "mark X checked"):** keep checked with `node tools/review/keep.js q|w|k <ids/paths> --why "user asked: …"` and commit `admin/review-approved.json` (lessons: `python tools/lessons/freeze.py <subject>/<code>`).
  - **Unrequested tidy/fix:** do nothing — let it re-queue for review.

## The spec (one source)
- `interactive/spec-quiz/spec.js` (verbatim spec; keys `B2.27`, `C1.46`, `P3.5`; sub-topics `B2e`, `C1a`, `P8b`; Topic 0 / physics `(a)` = units/skills; Maths not in `spec.js`).
- Single Award: `/js/course.js` (`CBSCourse`: `SA`, `SA_TEXT`, `DA_ONLY`), set by admin in `users/{uid}.course = 'SA'`. Load right after `diagq.js` on student pages; static text supports `data-course-sa="…"`.
- Spec chips link to `/specifications/<subject>.html#B2.27`. Key words: `/js/key-words.js` (`KEYWORDS['B2.11'] = [[word, meaning, 'DA'?], …]`).
- Deep links: `practice.html` & `adventurer-mission.html` (`?point=|?sub=|?subs=…&n=15`), `/Flashcards/` (`?spec=|?sub=|?subs=…&t=…`), `/work/?id=…`, `/guide/?id=…`, `/admin/review.html#questions|#worksheets|#lessons|#keywords`.

## Firebase (`elevenstudents-76f31`, compat SDK 9.22.2)
- Config `/js/firebase-config.js`; admins `/js/admin-config.js`. Google sign-in only.
- **Firestore:** `users/{uid}` (fields `specQuiz`, `specQuizSummary`, `questing`, `progress`, `settings`, `longAnswers`, `year`, `course`, `work`), `specProgress/{uid}`, `teams/{id}`. **Every student-side write to `users/{uid}` must merge** (`{merge: true}` / `update`).
- **RTDB:** `school` (`taught`, `assign`, `review`, `guides`), `gameScores`, `specQuizBoard`, `specQuizReports`, `bland`, `gameAccess`, `gameLog`, legacy `*HighScores`. RTDB drops empty arrays/objects (`x.list || []`). On student pages use `CBSSchool.rtGet(rt, path, ms)` (SDK + REST fallback), never read whole `school`.
- School filter allowlist: `gstatic.com`, `elevenstudents-76f31.firebaseapp.com`, `accounts.google.com`, `apis.google.com`, `identitytoolkit.googleapis.com`, `securetoken.googleapis.com`, `firestore.googleapis.com`, `*.firebasedatabase.app`, `*.firebaseio.com` (incl. `wss://`), `fonts.googleapis.com`, `fonts.gstatic.com`. Don't add external domains without telling the user.

## Look & Testing
- Cream `#eeeae0`, black `#111`, Barlow / Barlow Condensed. Subject colours (`css/{subject}.css`): Physics `#d08000` 🚀, Chemistry `#c8001e` 🧪, Biology `#005e22` 🌿, Maths 🧮. Mascot `/img/mascot/`. Check 390 px phone width; no hover-only UI.
- Before pushing: `node --check` on edited JS/inline scripts · `node tools/spec-quiz/check_bank.js interactive/spec-quiz` (**problems 0**) · `python tools/test/links.py .` · `python tools/test/smoke.py` (with `python -m http.server 8765`, fake Firebase `tools/test/fakefb.js`, 0 page errors) · `python tools/test/homelinks.py . list.txt`. **Always state what was only tested against fake Firebase or not run locally.**

## Repo map & `.agents/rules/` index
- `index.html` · `today/` · `specifications/` · `interactive/spec-quiz/` · `Flashcards/` · `interactive/lessons/` · `worksheets/` · `booklets/` · `work/` · `guide/` · `admin/` · `interactive/*` · `Elevenstudents/` · `leaderboards/` · `play/` · `js/` · `tools/` · `test.html`.
- `release.md` — merging `staging` → `main` (release chat only).
- `questing.md` — Cakebread Questing engine, securing rules, Breadventure Land, script order, globals.
- `question-bank.md` — questions, generators, diagram makers, difficulty levels, quality rules.
- `flashcards.md` — Flashcards & `/js/key-words.js` (AO1 recall, permanent IDs, SM-2, Single Award).
- `lessons.md` — Projector decks vs. Student Study Guides (`study.js`), slide style guide, `freeze.py`.
- `worksheets.md` — Worksheets, Topic Booklets & 6-Markers (codes, KS3/KS4, SA twins, print/greyscale).
- `admin-and-students.md` — Admin console, Review portal, Study Guides, set work, `To do`, auth gate, shared scripts.
- `games.md` — Topic interactives, leaderboards, game gate, `Elevenstudents/`.
- `exams-local.md` — Local-only private past-paper tool (never in repo).
