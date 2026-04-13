# Cakebread Science - Version History

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
- Moved user management out of Flashcards app into admin console (separation of concerns)
- Specification tracker now syncs `specSubjects` progress summary to Firebase on save

#### Fixed
- Duplicate `<!DOCTYPE html>` declaration in `specifications/science.html`

---

## [2.0.0] - 2026-03-10
### Visual Design Overhaul — Lok

#### Changed
- Complete restyle to "Lok" design system: cream `#eeeae0` background, jet black `#111` ink, forest green `#005e22` accent
- Replaced purple gradient theme (`#667eea`/`#764ba2`) sitewide
- Fonts: Barlow Condensed 900 for all headings, Barlow 400/600 for body
- Zero border-radius throughout; flat offset box-shadows (`3px 3px 0 #111`)
- Unequal-width stripe motif on hero cards and header bands
- Subject accent colours corrected: Maths `#2255cc`, Biology `#005e22`, Chemistry `#c8001e`, Physics `#d08000`
- All worksheet `theme-color` meta tags updated to match subject colour
- Elevenstudents index, Flashcards app, interactive tools, specification pages all updated
- Deleted style-test prototyping folder

---

## [1.0.0] - 2026-02-20
### 🎉 Initial Production Release

#### Added
- Complete IGCSE Edexcel resource library
- **Flashcards System** - Spaced repetition learning with Google authentication
  - Biology, Chemistry, Physics, and Physics Equations decks
  - Study Blob pet system with progression (Egg → Master)
  - Pet store with accessories and food items
  - Progress tracking and statistics
  - Daily study streaks and badges
- **Worksheets & Solutions** - Categorized by subject and topic
  - Biology worksheets (51 total)
  - Chemistry worksheets (40 total)
  - Physics worksheets (50+ total)
  - Maths worksheets (30+ total)
  - Cross-curricular resources
- **Curriculum Specifications** - Full syllabus coverage for all sciences and maths
  - Science (integrated view)
  - Biology, Chemistry, Physics, Maths specifications
  - Progress tracking for specification points
- **Interactive Tools**
  - Food Web Builder
  - Organism Gallery with image database
  - Angle Rules visualizer
- **Game Collection** (Elevenstudents subsection)
  - 10+ educational games with high score tracking
  - Firebase-backed leaderboards
  - Student showcase section

#### Technical Stack
- Frontend: HTML5, CSS3, JavaScript (Vanilla)
- Authentication: Firebase Authentication (Google Sign-in)
- Database: Firestore for user progress, Realtime Database for game scores
- Libraries: Chart.js for analytics, JSZip for flashcard parsing, SQL.js for Anki compatibility
- Responsive design optimized for desktop and mobile

#### Security Improvements (Pre-Launch)
- Removed temporary test files (`tmp_check_links.py`, `tmp_test.py`)
- Disabled debug console logging in Flashcards module
- **Note:** Firebase API keys are client-facing (protected by Firestore security rules)

#### Known Limitations
- Flashcards require manual APKG file export from Anki
- Game high scores stored per user session
- Offline functionality limited to cached flashcard data

---

### Future Roadmap
- [ ] PWA (Progressive Web App) support for offline mode
- [ ] Mobile app versions (iOS/Android)
- [ ] Collaborative study groups
- [ ] AI-powered study recommendations
- [ ] Video lesson integration
- [ ] Community flashcard sharing
- [ ] Enhanced game graphics and gameplay
