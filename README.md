# Cakebread Science

A collection of educational websites for IGCSE Edexcel students, featuring worksheets, interactive tools, flashcards, and games.

**Domain:** https://cakebreadscience.com

## 🌐 Project Structure

This repository contains **two separate educational sites**:

### 1. **Main Site** (Root Directory)
The primary IGCSE Edexcel resources site with printable worksheets (172 total) and curriculum tools.

**Homepage:** `index.html`

#### Folders:
- **`worksheets/`** - Subject-organized printable worksheets
  - `biology/` (50), `chemistry/` (51), `physics/` (50), `maths/` (19), cross-curricular (2)
  - Naming: `[section].[subsection]_[topic].html`
  - Print-optimized A4 layout

- **`specifications/`** - Interactive curriculum browsers
  - `maths.html` - Mathematics specification navigator
  - `science.html` - Integrated Biology/Chemistry/Physics navigator
  - `biology.html`, `chemistry.html`, `physics.html` - Individual subject navigators
  - All support per-user progress tracking synced to Firebase

- **`Flashcards/`** - Spaced repetition flashcard app
  - Firebase authentication (Google sign-in)
  - SM-2 algorithm for spaced repetition
  - Virtual pet system with gamification
  - Decks: Biology, Chemistry, Physics, Physics Equations
  - `blob-test.html` - Pet testing ground

- **`interactive/`** - Games and interactive tools
  - `chemical-tests/` - Chemical tests reference tool
  - `angle-rules/` - Geometry angle identification game
  - `triangle-solver_3.html` - Triangle solver
  - `organisms/` - Biology organisms classification tool (`game.html` + `gallery.html`)
  - `genetics-game/` - Genetics simulator
  - `food-webs/` - Food Webs tool: demonstration + interactive quiz modes, savanna & garden ecosystems
  - `ecological-pyramids/` - Ecological pyramids tool: 4 ecosystems, numbers/biomass/energy, true linear scale
  - `quadrilaterals/` - Quadrilateral/polygon classification quiz (WIP)

- **`admin/`** - Admin console (restricted access)
  - Firebase-authenticated; visible only to authorized admin emails
  - Flashcard Users tab: user stats (studied, learning, mastered, last access)
  - Spec Progress tab: per-student specification tracking with progress bars
  - Export/restore data backup tools

- **`admin/templates/`** - HTML/CSS templates for creating new worksheets

- **`css/`** - Shared stylesheets
  - `worksheet.css` - Base worksheet styles
  - `maths.css`, `biology.css`, `chemistry.css`, `physics.css` - Subject-specific color overrides
  - `index.css` - Homepage and navigation styles
  - `specifications.css` - Specification tracker styles

### 2. **Elevenstudents** (Separate Site)
A companion educational site with additional resources and games.

**Location:** `Elevenstudents/`
**Homepage:** `Elevenstudents/index.html`

#### Folders:
- **`Games/`** - Educational games with Firebase leaderboards
- **`Maths/`** - Mathematics resources
- **`Simulations/`** - Science simulations
- **`Extras/`** - Hidden/bonus content (`bonus-arcade.html`, `bonus-lab.html`, `adventure.html`, `minigames/`)

---

## 🎨 Design Principles

### Core Philosophy
- **No frameworks, no build tools** - Pure HTML/CSS/JS for maximum portability
- **Print-first design** - Worksheets optimized for A4 printing
- **Modular CSS** - Base styles + subject-specific color overrides
- **Template-based workflow** - Consistent structure across all worksheets

### Subject Color Scheme
- **Maths:** Blue (`#2255cc`)
- **Biology:** Green (`#005e22`)
- **Chemistry:** Red (`#c8001e`)
- **Physics:** Amber (`#d08000`)

### Site Design System (v2.0.0 — Lok)
- **Background:** Cream `#eeeae0`
- **Ink:** Jet black `#111111`
- **Accent:** Forest green `#005e22`
- **Fonts:** Barlow Condensed 900 (headings), Barlow 400/600 (body)
- **Style:** Zero border-radius, flat offset shadows (`3px 3px 0 #111`), unequal-width stripe motif

---

## 📂 File Organization

### Worksheets
```
worksheets/[subject]/[section].[subsection]_[topic].html
```
**Example:** `worksheets/maths/1.2_algebra-basics.html`

### CSS Structure
```
worksheets → ../../css/[subject].css
             ↓
        imports worksheet.css
             ↓
        overrides colors
```

### Interactive Tools
```
interactive/
├── [tool-name]/
│   ├── index.html
│   ├── [tool-name].js
│   └── [tool-name].css
```

---

## 🚀 Quick Start

### Adding a New Worksheet
1. Copy a template from `admin/templates/`
2. Save to `worksheets/{subject}/[section].[subsection]_[topic].html`
3. Update CSS path: `../../css/{subject}.css`
4. Add link to `worksheets/index.html`
5. Add to appropriate specification file (`specifications/maths.html` or `specifications/science.html`)

### Creating a New Interactive Tool
1. Create folder in `interactive/[tool-name]/`
2. Build with pure HTML/CSS/JS (no dependencies)
3. Add link to main `index.html` in the Interactive Tools section

### Adding Flashcard Decks
- Place `.apkg` files in `Flashcards/ANKI files/`
- Place media (images, audio) in `Flashcards/media/`
- App parses decks client-side using JSZip + sql.js

---

## 🎮 Flashcards App Features

### Spaced Repetition
- **Algorithm:** SM-2 (SuperMemo 2)
- **Rating:** 1-4 quality scale (Again, Hard, Good, Easy)
- **Stages:** New → Learning → Review → Mastered (21+ day interval)

### Virtual Pet System
- **Evolution:** 6 stages (Egg → Hatchling → Junior → Teen → Adult → Master)
- **Badges:** 6 achievement badges unlock accessories (bronze/silver/gold tiers)
- **Gamification:** Daily streak points, store with food & house items, daily feeding
- **Customization:** Floors, backgrounds, roofs, decorations

### Tech Stack
- **Auth:** Firebase Authentication (Google)
- **Database:** Cloud Firestore + Realtime Database
- **Libraries:** JSZip, sql.js (for .apkg parsing), Chart.js (for progress charts)

---

## 🔐 Admin Console (`admin/`)

Access is restricted to authorized emails (configured in `admin/index.html`).

**Features:**
- View all registered flashcard users and their study statistics
- Monitor specification progress per student/subject
- Export Firebase data backups (JSON)
- Restore data from backups

**Access:** Admin button appears on homepage only for authorized Google accounts.

---

## 🔧 Development Notes

### Git
Git is initialized; commit changes as needed. Line endings may vary (Windows CRLF / Unix LF) — safe to ignore.

### Python Scripts
- `interactive/organisms/download_organism_images.py` - Generates `organisms_data.js` from image files

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Print stylesheets optimized for Chrome/Edge

### Admin Emails
Admin access is currently hardcoded in two places:
- `index.html` (homepage admin button visibility)
- `admin/index.html` (admin console auth gate)

Keep these in sync when adding/removing admin users.

---

## 📊 Recent Updates

### 2026-06-23 - v2.5.0 Ecology Tools (Food Webs & Ecological Pyramids)
- **Food Webs** rebuilt from placeholder into a finished tool with Demonstration and Interactive (quiz) modes, savanna & garden ecosystems, energy-pyramid view, food-chain tracing, and a "remove a species" knock-on demo
- **Ecological Pyramids** finished and expanded to 4 ecosystems (Grassland, Oak Tree, Sea, Desert), showing the oak's irregular pyramid of numbers and the sea's inverted pyramid of biomass
- Switched pyramids to a true linear scale (~10% per level), single organism per level, kg/joule units, and added a food-chain box diagram under each pyramid
- Removed WIP banners from both tools; homepage footer bumped to v2.5.0

### 2026-06-02 - v2.4.0 Admin Fix, WIP Tools & Housekeeping
- Admin spec progress now reads from the `specProgress` collection directly, falling back to `users.specSubjects`
- Linked `ecological-pyramids` and `quadrilaterals` from the homepage Interactive card
- Deleted orphaned `Elevenstudents/Flashcards/` duplicate and `Flashcards/blob-test.html`

### 2026-05-26 - v2.3.0 Filter Compatibility & Cleanup
- Renamed `Elevenstudents/Secret/` → `Elevenstudents/Extras/`; renamed all secret-* files to neutral names
- Removed dead logo click-counter, cleaned Easter Egg / Konami references from HTML and JS
- Deleted orphaned `Elevenstudents/Flashcards/` duplicate (root `Flashcards/` is the active app)

### 2026-05-01 - v2.2.0 Chemical Tests Tool & Iggy v2
- Added `interactive/chemical-tests/index.html` — interactive Chemical Tests reference tool
- `Elevenstudents/Games/iggy.html` upgraded to Version 2 with 5 difficulty levels

### 2026-03-12 - v2.1.0 Admin Console & Refactor
- Added `admin/` folder with full admin console
- Moved user management out of Flashcards app into admin console
- Admin button on homepage: only visible to authorized accounts
- Specification tracker now syncs `specSubjects` progress summary to Firebase
- Fixed duplicate DOCTYPE declaration in `specifications/science.html`

### 2026-03-10 - v2.0.0 Design Overhaul (Lok)
- Complete visual restyle to "Lok" design system (retro constructivist aesthetic)
- Cream background, jet black ink, forest green accent throughout
- Barlow Condensed 900 headings, zero border-radius, flat offset box-shadows
- Unequal-width stripe motif on hero cards and page headers
- All subject pages, worksheets, flashcards, interactive tools, and Elevenstudents updated
- Subject `theme-color` meta tags corrected per subject (bio/chem/phys/maths)
- Version bumped to 2.0.0

### 2025-02-16 - Pet Visual Overhaul
- Replaced emoji decorations with hand-drawn SVG
- Added animated backgrounds (clouds, stars, moon)
- Enhanced floors with SVG textures
- Added blob shadow and master stage sparkles

### 2025-02-12 - Major Reorganization
- Restructured into 4 main sections (worksheets, specifications, interactive, Flashcards)
- Created new 2x2 hero grid index.html
- Updated all CSS paths

---

## 📝 To-Do

### Immediate
- [x] Finish Food Web Builder — done in v2.5.0 (now the Food Webs tool)
- [x] Finish Ecological Pyramids — done in v2.5.0
- [ ] Finish Quadrilaterals quiz (still WIP)
- [ ] Decide whether to show/hide remaining WIP tools in main nav

### Future Enhancements
- [ ] Create backup strategy for Firebase data
- [ ] Add more interactive tools
- [ ] Expand flashcard decks (Maths, Economics, etc.)
- [ ] Mobile app version of flashcard system
- [ ] Collaborative study features

---

## 📄 License

Educational use only. All content aligned with IGCSE Edexcel curriculum specifications.

---

## 👤 Author

This project is maintained as a personal educational resource collection.

**Last Updated:** June 2026
