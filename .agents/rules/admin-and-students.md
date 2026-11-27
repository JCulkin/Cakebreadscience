---
trigger: model_decision
description: Teacher admin console (admin/), Review portal, study guides, set work and tests, year groups, the students' To do page (today/), spec trackers (specifications/), homepage and site-wide shared scripts. Use when editing admin pages, student dashboards, the homepage or js/ shared scripts.
---
# Admin, students' pages and shared scripts

## Admin console — `/admin/` (admins only, noindex)
- **One grouped menu on every admin page: `/admin/admin-nav.js`** — Students (Overview, Students, Spec map, Teaching) · Content (Questions,
  Review, Study guides) · Games (Games incl. leaderboards, Breadventure Land incl. the showcase) · Site (Backup, on the right).
  **A new admin tab or page goes into `GROUPS` in that file** (`[tab or page, label, also]`) — no new link rows or tab bars.
  The user: "Don't remove anything" from admin; tidy it instead.
- `admin/index.html`: panels with `data-in="<tab>"` show inside that tab; `show(t)`. **KS3 (Y8–9) / KS4 (Y10–11) + granular Year 8–11 filters** are available across Students (`#sYear`), Spec Map (`#mYear`), Teaching (`teachBar`, All Set Work `#wYrFilt`, Set Work composer `KS3`/`KS4` quick-ticks), Study Guides (`/admin/study-guide.html`), and **🎯 Misconception Radar**.
- **Students:** ☰ Columns menu (`S_COLS`, incl. sortable `Homework`), **Outstanding homework only** filter, and collapsible **Clean up inactive accounts** panel (plus **Remove account** in the student drawer; deletes Firestore `users`/`specProgress` + RTDB data for non-admins; Google Auth stays in Firebase Console).
- **Teaching & 🎯 Misconception Radar:** Outstanding homework summary per year/KS and on All set work. **Misconception Radar** groups misses + over-confident tracker blind spots by year/KS and time window, linking straight to the exact Class Slide (`js/lesson-slides.js`, auto-built by `tools/spec/build_index.js` → `deck.html#present&slide=N`), a 5-Q board reteach quiz (`quiz.html?subs=…&n=5&auto=1`), a 5-Q **🔥 Warm-Up** (`quiz.html?warmup=1`), or pre-filled 2-day spaced homework.
- Spec map shows students' real names (`googleName`: first name + initial), never their game names.
- Admin → Students → a student: Course (Double / Single Award, sets `users/{uid}.course`), year, their character, activity.
- Loads the question bank with `QE_PASSIVE`; globals `GM`, `TCH`, `BUILD` are taken.

## Review portal — `/admin/review.html`
- Tabs Question bank / Worksheets / Lessons / Key words (`#questions`, `#worksheets`, `#lessons`, `#keywords`). Big "✓ It's good" buttons,
  Needs a fix, Send back. `/admin/review-lib.js` (`REVIEW`): cyrb53 fingerprints of content; marks in RTDB `school/review/q|w|k|l`;
  falls back to `/admin/review-approved.json` (written by `node tools/review/keep.js q|w|k <ids> --why "…"`).
- Lessons tab: status from `lessons.json` + the draft's fingerprint; "📋 Copy for the lessons chat" builds a plain-text handover
  (whoever builds lessons can't read the database).

## Study guides
- `/admin/study-guide.html` → printable A4 guide + the student's "Upcoming tests" card on To do + `/guide/?id=…`.
  Data `school/guides/{id} = {title, date, course 'DA'|'SA', years {Y10: true}, subs [...], pts [...], at, by}`. Renderer `/js/study-guide.js`
  (`CBSGuide`: `chosen`, `render`, `todo`, `progress`, `forMe`). User's design: title top left, course top right, no tick boxes, no common
  mistakes, compact key-words section bound to the chosen points (filtering `'DA'` terms on Single Award guides) above 4 lines of exam advice;
  exact spec points selectable. Online view links to Practice (`?subs=`), Questing (`?subs=`), Flashcards (`?subs=`), and matching Lessons.
- A guide is for one course only: Single Award students don't see a Double Award guide (a "Both" option was offered, not built).

## Set work, years, teaching
- `users/{uid}.year` 8–11, chosen once by the student (`/js/year.js`), changeable by the admin.
- `school/assign/{id}`: **spaced missions** (`type: 'spaced'`, **default** in Admin → Teaching: `days` [default 2] × `qPerDay` [default 10], logged in `users/{uid}.work[id].days[YYYY-MM-DD]`), practise work (sub-topics/points + `need`, `needSA`) or a test (`qids`, `nSA`) for years and/or named students (`students: {uid: true}`), due date, note, `edited`. Tests at `/work/?id=…` (answers + diagram seeds in `users/{uid}.work[id]`). Practice & Questing accept `?hw=<id>` for live homework progress bars (`CBSSchool.hwBarHtml`) and clear Continue / Day-1-done / Homework-complete end banners (`CBSSchool.hwDoneHtml`). `/js/openwork.js` turns the To do button red "! To do · N" (quieting Day-1-done spaced work until tomorrow).
- `school/taught/Y10/C1a` = what each year has been taught (admin Teaching tab; shows as "Covered in class" and powers the one-click `⚡ Start revising →` auto-launcher on `/today/?go=1` & `index.html`).

## Student Home (To do) — `/today/` & Student Onboarding (`/how-to-use/`, `/js/tour.js`)
- Signed-in non-admin students landing directly on `/` route straight to `/today/` (with `/?dir=1` keeping the full directory open); admins and signed-out visitors stay on `/`.
- **4-zone layout (redesigned 28 Nov):**
  1. **Header + Greeting:** pixel portrait, IGCSE secured count, 1-day-grace streak + `⚡ Don't know what to do?` 1-click CTA (`/today/?go=1`).
  2. **Unified 2-column To Do hub (`#todoHub`):** Left = **`📌 From your teacher`** (Homework + 📅 Upcoming tests + collapsed `✓ Completed`); Right = **`🎯 Suggested for you`** (Today loop + up to 3 clean target cards with `Practise →` and text links — no tiny icon soup).
  3. **Full-width Breadventure Land hero banner (`#questHero`):** dark pixel-art banner with live level/moves/mission pills and `Play World Map →` / `🧭 My Adventurer`.
  4. **Full-width `Your IGCSE progress` (`#progCard`) + `Explore the site` dock:** 3-column Biology/Chemistry/Physics bars + 14-day dots + full-width expandable **`📚 Covered in class`** drawer (3-column full-topic boxes), followed by the 6-tile monoline-SVG Explore dock.
- **Tutorial & Spotlight Tours:** `/how-to-use/` (linked via `❓ Help` in headers, plus subtle curious-student deep dive `/how-to-use/science-of-learning.html`, open in `auth-gate.js`) explains the site and memory science + lets students replay tours (`?tour=1`). `/js/tour.js` runs once per student page (`cbs.tour.v1`), dimmed spotlight + arrow + reminder to `❓ Help`, never runs on `/admin/`, `deck.html`, iframes, or for admins unless `?tour=1`. Every database read on `/today/` has a timeout and cached fallback.

## Spec trackers — `/specifications/`
- Thin pages + `/js/tracker.js` + `/css/tracker.css` + `/js/spec-point.js` + `/js/course.js`. Grounded in **Metacognitive Calibration** (fighting the Illusion of Competence — Bjork): status colour = objective 2-day proof (secured / rusty / learning) compared against student self-rated confidence (`specProgress/{uid}.conf`), surfacing over-confident unproved points via `?f=check`. Resource drawer lists lessons, worksheets, **topic booklets**, 6-markers, equations, topic interactives (`js/spec-index.js`) and Examiner Key Words (`js/key-words.js`). Maths tracker is the old page.

## Homepage and shared scripts
- `index.html`: Professor logo + "Cakebread Science", sign-in box (admins also ⚙️ Admin, 👥 Team quiz), footer version. **No inline "What's new" banner at the top of the homepage** (retired 28 Nov): new features worth pointing out use obvious dismiss-once modal popups (`CBSAnnounce.show(...)` in `/js/whats-new.js`) that stay gone once dismissed.
- Shared scripts: `/js/account.js` (one sign-in box, never shows emails) · `/js/auth-gate.js` (site-wide sign-in & admin approval gate; allows open menus, `/how-to-use/*`, `/research/`, first deck & worksheet of each subject, and 1 free sample mission; new Google accounts queue `pending` in `gameAccess/{uid}`) · `/js/home-link.js` · `/js/game-gate.js` · `/js/year.js` · `/js/school.js` · `/js/course.js` · `/js/spec-point.js` · `/js/study-guide.js` · `/js/key-words.js` · `/js/spec-index.js` + `/js/lesson-slides.js` (both generated by `node tools/spec/build_index.js`) · `/js/openwork.js` · `/js/tour.js` · `/js/whats-new.js` (popup helper) · `/js/staging-sim.js` (staging-only Y10 sandbox, disabled on live domain & `/admin/`).

## Open items the user knows about
- Flashcards needs Firebase to draw in some flows; worksheet "Under review" chips don't follow portal marks automatically; trackers linking KS3 sheets first for Years 8–9 and KS4 for 10–11; optional Firestore rule so students can't set their own `course`.
