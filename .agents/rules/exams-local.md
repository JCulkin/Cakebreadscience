---
trigger: model_decision
description: The teacher's private exam question bank and exam builder (past-paper based). Use when the user asks to make an exam, test, revision pack or mark scheme from past papers, or mentions the exam bank.
---
# The exam question bank — local only, never in this repo

- The user builds class tests and revision packs from Edexcel past-paper questions (his ExamWizard exports) plus our own questions.
  **It lives only in his private folder `G:\My Drive\THE WEBSITE\Exam bank`** (Google Drive, never shared). Layout: `Exams\<year-term>\`
  finished PDFs, `Sources\` his ExamWizard PDFs (read-only), `_system (don't edit)\exam-bank-data.tar.gz` = the tool (`examtool/`: Python
  extraction with PyMuPDF/tesseract, a node renderer to .docx/PDF, `bank/bank.json`, `log/exams_given.json`).
- **Nothing from it goes into this repo, the website or anything published** (Pearson copyright). It may *read* this repo
  (`spec.js`, `course.js`, `key-words.js`, `diagrams.js`, `questions.js`) but never push.
- Naming (project instruction): "Term 3 - KS4 - Science depth - Energy and electromagnetism" (+ " - Revision practice"; KS4 adds
  " (Double Award)" / " (Single Award)"). If term, KS3/KS4 or breadth/depth isn't given, ask.
- The user's checklist for every set: a **real test** (cover page "B": black banner "2026/27 TERM 1 · TEST · …", dotted Name and Date, marks/time,
  "Your mark __/total" box, instructions panel, no footer on the cover) + separate mark-scheme PDF, and a **revision pack** (~20% longer, mark scheme
  inside starting on a new page); they never share a question. About half our own recall questions, half real Edexcel questions, matched to what
  the group has been taught. **Every PDF has an even number of printed pages** (double-sided printing). Big clear word boxes (one cell per word).
  Mark schemes students can use: plain table (Question | Answer | Accept / does not score | Mark), a "How to mark your work" box, a small source
  line under each Edexcel answer. No "(Total for Question …)" lines; marks "(n)" on the right; greyscale-safe; no wasted space.
- Course facts: Double Award has no tiers; Single Award is a subset with the same numbering; keys `B2.27`; current term 2026/27 Term 1.
