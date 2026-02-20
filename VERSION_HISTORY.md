# Cakebread Science - Version History

## [1.1.0] - TBD
### 🔄 In Development

#### Updates Coming
- Clean up debug logging
- Security audit for production release
- Version tracking system implemented

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
