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
- `admin/index.html`: panels with `data-in="<tab>"` show inside that tab; `show(t)`. Students table has a ☰ Columns menu (`S_COLS`).
  Spec map shows students' real names (`googleName`: first name + initial), never their game names.
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
- `school/assign/{id}`: practise work (sub-topics/points + `need`, `needSA`) or a test (`qids`, `nSA`) for years and/or named students
  (`students: {uid: true}`), due date, note, `edited`. Tests at `/work/?id=…` (answers + diagram seeds in `users/{uid}.work[id]`).
  `/js/school.js` (`CBSSchool`: `forMe`, `progress`, `audience`, `load`, `rtGet`…). `/js/openwork.js` turns the To do button red "! To do · N".
- `school/taught/Y10/C1a` = what each year has been taught (admin Teaching tab; shows as "Covered in class").

## To do — `/today/` (students' dashboard; was "My day")
- Order (user, 23 Nov): greeting → **Upcoming tests** (per study guide: bar + "n of m spec points secured · k started", buttons 📄 Study guide /
  📝 Revise / ⚔️ Revise in Questing) → Today line → Set by your teacher → What to revise | The spec (with **Covered in class** as a closed
  `<details>` inside it) → Last 14 days. Every database read has a time limit; it shows a saved copy if the network blocks Firebase.

## Spec trackers — `/specifications/`
- Thin pages + `/js/tracker.js` + `/css/tracker.css` + `/js/spec-point.js` + `/js/course.js`. Grounded in **Metacognitive Calibration** (fighting the Illusion of Competence — Bjork): status colour = objective 2-day proof (secured / rusty / learning) compared against student self-rated confidence (`specProgress/{uid}.conf`), surfacing over-confident unproved points via `?f=check`. Resource drawer lists lessons, worksheets, **topic booklets**, 6-markers, equations, topic interactives (`js/spec-index.js`) and Examiner Key Words (`js/key-words.js`). Maths tracker is the old page.

## Homepage and shared scripts
- `index.html`: Professor logo + "Cakebread Science", sign-in box (admins also ⚙️ Admin, 👥 Team quiz), "What's new" box
  (`/js/whats-new.js`, dismissed per browser, key `cbs.whatsnew.v51`), footer version.
- `/js/account.js` the one sign-in box (never shows an email) · `/js/auth-gate.js` site-wide sign-in & admin approval gate (allows always-open menus, first presentation of each subject `biology/1`, `chemistry/1a`, `physics/8`, first worksheet + mark scheme of each subject, and 1 free sample mission/practice set; new Google accounts write `gameAccess/{uid}.status = 'pending'` and unlock live once approved in Admin → Overview or Games; existing Firestore students are grandfathered unless explicitly `'blocked'`) · `/js/home-link.js` way home · `/js/game-gate.js` game access ·
  `/js/year.js` · `/js/school.js` · `/js/course.js` · `/js/spec-point.js` · `/js/study-guide.js` · `/js/key-words.js` · `/js/spec-index.js`
  (generated) · `/js/openwork.js` · `/js/whats-new.js`.

## Open items the user knows about
- Flashcards needs Firebase to draw; worksheet "Under review" chips don't follow portal marks automatically; an admin "over-confident" list;
  trackers linking KS3 sheets for Years 8–9 and KS4 for 10–11; optional Firestore rule so students can't set their own `course`.
