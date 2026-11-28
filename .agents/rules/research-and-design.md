---
trigger: always_on
description: Evidence-informed pedagogy, cognitive/visual/print design, game psychology, and family learning standards for Cakebread Science. Loaded automatically by all agents.
---
# Research, Pedagogy & Design Standards (Site-Wide)

All content, UI, print sheets, games, and teacher/family features on **cakebreadscience.com** follow these evidence-based principles. Technical implementation rules stay in their owning files (`lessons.md`, `worksheets.md`, `questing.md`, `flashcards.md`, `games.md`, `admin-and-students.md`) — never duplicate them here.

## 1. Secondary Science Pedagogy & Classroom Practice
- **EEF *Improving Secondary Science* (7 pillars):** Always surface and refute **preconceptions**; scaffold **self-regulation**; explain the limits of **models**; build long-term **memory** via retrieval/spacing; make **practical work** purposeful (linking apparatus/variables to concepts); explicitly teach the **language of science** (`/js/key-words.js`); give **structured feedback** that students act on.
- **Rosenshine & Tom Sherrington:** Introduce ideas in small steps; check for understanding at hinge points before moving on; aim for ~80% guided success before independent practice; build weekly/monthly review loops.
- **CogSciSci & SLOP (Adam Boxer):** Move novices from explicit worked models into **Shed Loads of Practice (SLOP)** — high-volume, incremental practice that builds automaticity so basic recall/rearranging does not clog working memory during multi-step AO2/AO3 exam questions.
- **TeacherToolkit (Ross Morrison McGill) — Workload & DIRT:** Prioritise low-effort, high-impact routines. Feedback only works when students act on it (**DIRT** — Directed Improvement and Reflection Time: purple-pen/second-colour self-marking, fixing missed items, whole-class misconception review instead of unsustainable individual marking). Teach students *why* retrieval feels harder than re-reading.

## 2. Diagnostic Questions, Worked Examples & Variation (Craig Barton / Mr Barton)
- **Diagnostic distractors:** Every wrong MCQ option must diagnose a *specific* real misconception — never silly throwaway distractors. Feedback should explain *why* the misconception fails, not just state the right letter.
- **Worked-Example Effect & Example-Problem Pairs:** Pair a fully worked model side-by-side (or immediately above) a parallel *Now you try* problem before unguided practice, fading scaffolding progressively (Sweller; Barton).
- **Variation Theory:** When sequencing practice or calculation sets, hold most features constant and vary **one critical feature at a time** so learners notice what drives the change (*Reflect → Expect → Check → Explain*).
- **Split-attention & Silent clarity:** Let clean visual steps speak without bloated prose; place annotations directly on diagrams/working lines rather than in a separate legend.

## 3. Memory, Spacing & Metacognition
- **Testing Effect (Roediger & Karpicke; RetrievalPractice.org; The Learning Scientists):** Cold retrieval strengthens memory far more than re-reading or highlighting — even when an initial attempt is wrong and followed by clear feedback.
- **Desirable Difficulties (Robert & Elizabeth Bjork):** Distinguish short-term *performance* (retrieval strength) from durable *learning* (storage strength). Slight forgetting between sessions makes retrieval harder *and* boosts storage strength far more. Never let same-day retries (e.g. Second Wind) fake long-term mastery — keep **2-different-days securing + 21-day rust decay**.
- **Spacing & Interleaving (Cepeda; Rohrer):** Short sessions across different days (e.g. 10–15 questions on 2 different days) beat one long cramming sitting and prevent random clicking. Mix topics/methods once basics are secure so students practise *choosing* the right strategy.
- **Metacognitive Calibration (EEF Metacognition, +7 months):** Students routinely fall for the *Illusion of Competence*. Always pair self-rated confidence with objective proof (`Check these` on Spec Trackers) and teach a simple Plan → Monitor → Evaluate loop.
- **Homework (EEF Secondary Toolkit, +5 months):** Quality and curriculum link beat volume. Keep homework short, completable independently (practising already-taught classwork), and tightly tied to feedback.

## 4. Cognitively Clear Web & UI Design (NN/g, GOV.UK, WCAG, Caviglioli)
- **Minimise extraneous cognitive load (Sweller; NN/g):** One clear primary action per screen (e.g. `⚡ Start now` on Student Home); progressive disclosure (`<details>` drawers) for secondary lists; avoid competing banners, sidebars, or walls of choices (Hick's Law).
- **Scannable typography (WCAG 2.2 / BDA / GOV.UK):**
  - Body text ≥ `16px` on web (`17px` for reading-heavy study guides), line-height `1.45–1.6`, prose line length `55–75ch`, left-aligned (never justified).
  - Use **bold** for emphasis; avoid long blocks of ALL CAPS, heavy italics, or non-link underlining. Reserve `Barlow Condensed` uppercase strictly for short headings/buttons.
  - Warm cream `#eeeae0` + dark `#111` ink reduces harsh glare while maintaining AAA/AA contrast. Never convey status by colour alone — always pair with text labels, icons, or patterns.
  - Keep interactive touch targets comfortable (`≥36–44px` on mobile) and test at `390px` width with zero hover-only controls.
- **Functional colour & copy discipline:** Keep subject colours consistent everywhere (`Biology #005e22`, `Chemistry #c8001e`, `Physics #d08000`) — never swap them between pages. Always write **IGCSE** (never bare `GCSE`) on student/site copy. **Never put an inline "What's new" banner at the top of the homepage** — announce notable new features via obvious dismiss-once tutorial-style popups (`CBSAnnounce.show(...)` in `/js/whats-new.js`).

## 5. Cognitively Clear Printed Material (Worksheets, Booklets, Study Guides)
- **Caviglioli Dual Coding & Mayer Coherence:** Every diagram must teach or structure information (comparison table, process flow, hierarchy, labelled apparatus) — zero decorative clipart, background watermarks, or seductive details.
- **Spatial Contiguity:** Label directly on diagrams; integrate keys next to visuals so eyes don't bounce across the page.
- **Print legibility & dyslexia-friendly ergonomics (BDA):** Clean sans-serif (`≥10.5–11pt` body, `11–12pt` on KS3/SA/mark schemes where space allows), generous leading (`1.3–1.45`), left-aligned, chunked boxes with breathing room, no giant unstructured blank answer boxes, avoid italicised small-print instructions.
- **Greyscale & photocopy durability:** Everything must remain 100% readable in black-and-white photocopy (`-bw.svg`, strokes `≥0.35 mm`, symbols/labels/dashed lines instead of colour-only keys, light paper tints instead of solid dark toner blocks).

## 6. Educational Game Design & Motivation (Questing, Breadventure Land, Interactives)
- **Self-Determination Theory (Ryan & Deci):** Design for **Autonomy** (meaningful choice of topic/mode, always offering plain Practice alongside Questing), **Competence** (clear progress, fair L1→L2→L3 ramp, mastery-linked unlocks), and **Relatedness** (cooperative shared-world boss fights in Breadventure Land).
- **Sailer & Homner (2020) Meta-Analysis & Plass/Homer/Kinzer:** Meaningful **game fiction** (narrative, character, world) + **social collaboration** + **competence feedback** drive real cognitive ($g = 0.49$) and motivational ($g = 0.36$) gains — bare points/badges alone do not.
- **Guard against gamification traps:**
  - *No overjustification / spam-clicking:* Never tie rewards to raw click volume or high-bar correct counts that punish struggling students; tie power to real spaced memory (2-day securing, honest attempts).
  - *Graceful failure:* Missed questions teach (feedback + Second Wind) without humiliating penalties.
  - *Healthy competition:* Prefer rolling 7-day windows, cooperative bosses, and personal-best stats over demoralising permanent all-time leaderboards.

## 7. Families & Home Learning (EEF *Working with Parents*; Harris & Goodall)
- **Engagement over policing:** What matters most in secondary school is parents valuing learning, protecting a calm routine, and encouraging independence — *not* policing homework or acting as GCSE tutors (20–22% of secondary parents report lacking subject confidence).
- **Zero-content-barrier design:** Any student/family-facing revision aid (Study Guides `/guide/`, Flashcards, Key Words, `/research/#families`) must work without parents needing to know IGCSE science: clear questions with bolded mark-scheme terms, short 5-minute routines, and transparent upcoming-test summaries.

## 8. Staging Review Hub Scope
- Keep `/staging-review/` focused strictly on **items the teacher can actually inspect directly as a diff, showcase, or standalone document**:
  - Class Slides / Revision Notes → `interactive/lessons/lessons.json` + `interactive/lessons/diff/data.json` (`#decks` / `#guides`).
  - Worksheets & Topic Booklets → `worksheets/diff/data.json` (`#printables`).
  - Flashcards → `staging-review/flashcards-diff.json` (`#flashcards`).
  - **Showcases & Standalone Pages (`staging-review/site-changes.json` → `#site`):** **ONLY** add dedicated asset/screenshot showcase documents (e.g. `/staging-review/game-icons.html`), visual comparison sheets, or brand-new standalone pages to read end-to-end (e.g. `/research/`, `/how-to-use/`). **Do NOT log** general in-situ UI tweaks, buttons, filters, or behaviour changes (the teacher checks those directly in-situ on staging).

## 9. Public Reference Pages (Keep Aligned)
- **Teacher & family guide (with external links):** `/research/`
- **Curious-student deep dive (subtle link from `/how-to-use/`):** `/how-to-use/science-of-learning.html`
