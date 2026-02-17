# Cakebread Science

A collection of educational websites for IGCSE Edexcel students, featuring worksheets, interactive tools, flashcards, and games.

**Domain:** https://cakebreadscience.com

## 🌐 Project Structure

This repository contains **two separate educational sites**:

### 1. **Main Site** (Root Directory)
The primary IGCSE Edexcel resources site with a focus on printable worksheets (50 total) and curriculum tools.

**Homepage:** `index.html`

#### Folders:
- **`worksheets/`** - Subject-organized printable worksheets
  - `biology/`, `chemistry/`, `physics/`, `maths/`
  - Naming: `[section].[subsection]_[topic].html`
  - Print-optimized A4 layout

- **`specifications/`** - Interactive curriculum browsers
  - `maths.html` - Mathematics specification navigator
  - `science.html` - Biology, Chemistry, Physics specification navigator

- **`Flashcards/`** - Spaced repetition flashcard app
  - Firebase authentication (Google sign-in)
  - SM-2 algorithm for spaced repetition
  - Virtual pet system with gamification
  - Decks: Biology, Chemistry, Physics, Physics Equations
  - `blob-test.html` - Pet testing ground

- **`interactive/`** - Games and interactive tools
  - `angle-rules/` - Geometry angle identification game
  - `organisms/` - Biology organisms classification tool

- **`templates/`** - HTML/CSS templates for creating new worksheets

- **`css/`** - Shared stylesheets
  - `worksheet.css` - Base worksheet styles
  - `maths.css`, `biology.css`, `chemistry.css`, `physics.css` - Subject-specific color overrides

### 2. **Elevenstudents** (Separate Site)
A companion educational site with additional resources and games.

**Location:** `Elevenstudents/`
**Homepage:** `Elevenstudents/index.html`

#### Folders:
- **`Flashcards/`** - Additional flashcard decks
- **`Games/`** - Educational games
- **`Maths/`** - Mathematics resources
- **`Simulations/`** - Science simulations
- **`Secret/`** - Hidden/bonus content

---

## 🎨 Design Principles

### Core Philosophy
- **No frameworks, no build tools** - Pure HTML/CSS/JS for maximum portability
- **Print-first design** - Worksheets optimized for A4 printing
- **Modular CSS** - Base styles + subject-specific color overrides
- **Template-based workflow** - Consistent structure across all worksheets

### Subject Color Scheme
- **Maths:** Blue (`#3498db`)
- **Biology:** Green (`#27ae60`)
- **Chemistry:** Red (`#e74c3c`)
- **Physics:** Orange (`#f39c12`)

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
1. Copy a template from `templates/`
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
- **Database:** Cloud Firestore
- **Libraries:** JSZip, sql.js (for .apkg parsing), Chart.js (for progress charts)

---

## 🔧 Development Notes

### Git
Git is initialized; commit changes as needed.

### Python Scripts
- `interactive/organisms/download_organism_images.py` - Generates `organisms_data.js` from image files

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Print stylesheets optimized for Chrome/Edge

---

## 📊 Recent Updates

### 2025-02-12 - Major Reorganization
- ✅ Restructured into 4 main sections (worksheets, specifications, interactive, Flashcards)
- ✅ Created new 2x2 hero grid index.html
- ✅ Updated all CSS paths
- ✅ Fixed color consistency across site

### 2025-02-16 - Pet Visual Overhaul
- ✅ Replaced emoji decorations with hand-drawn SVG
- ✅ Added animated backgrounds (clouds, stars, moon)
- ✅ Enhanced floors with SVG textures
- ✅ Added blob shadow and master stage sparkles
- ✅ Improved book accessory SVG

### 2025-02-16 - Elevenstudents Integration
- ✅ Added Elevenstudents folder as separate site
- ✅ Cleaned up legacy files (old_gallery.html)
- ✅ Created comprehensive documentation

---

## 📝 To-Do

### Immediate
- [ ] Add link to Elevenstudents from main index.html
- [ ] Create backup strategy for Firebase data

### Future Enhancements
- [ ] Add more interactive tools
- [ ] Expand flashcard decks (Math, Economics, etc.)
- [ ] Mobile app version of flashcard system
- [ ] Collaborative study features

---

## 📄 License

Educational use only. All content aligned with IGCSE Edexcel curriculum specifications.

---

## 👤 Author

This project is maintained as a personal educational resource collection.

**Last Updated:** February 2026
