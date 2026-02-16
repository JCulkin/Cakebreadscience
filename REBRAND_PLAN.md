# Website Tidy-Up and Domain Branding Plan

## Context

The AIR website is being rebranded to **cakebreadscience.com**. Currently, the site is a static educational website with IGCSE Edexcel curriculum resources (Math, Biology, Chemistry, Physics). The site has grown organically and needs:

1. **Consistent folder naming** - Currently "Specifications" is capitalized while all other folders are lowercase
2. **Domain branding** - Add cakebreadscience.com throughout the site (meta tags, documentation, etc.)
3. **Web standards** - Missing favicon, robots.txt, sitemap, proper SEO meta tags
4. **Documentation updates** - README and other docs need domain updates
5. **Git setup** - Git is initialized but needs .gitignore and proper configuration
6. **Code consistency** - 100+ HTML files need proper meta tags and branding

The site structure:
- `index.html` - Main landing page (2x2 hero grid)
- `worksheets/` - 48 printable worksheets by subject
- `specifications/` - Curriculum browsers (currently "Specifications" - capitalized!)
- `interactive/` - Games and tools (angle rules, organisms)
- `Flashcards/` - Spaced repetition app with Firebase (keeping elevenstudents Firebase, updating visible branding)
- `Elevenstudents/` - Separate companion site
- `templates/` - HTML templates for new worksheets
- `css/` - Shared stylesheets

## Critical Files to Modify

### Folder Structure
- **Rename:** `Specifications/` → `specifications/`
  - Update links in: `index.html`, `worksheets/index.html`

### New Files to Create
1. **Root directory:**
   - `.gitignore` - Exclude .venv, .vscode, .claude, etc.
   - `favicon.ico` and `favicon.png` - Site icon
   - `robots.txt` - SEO configuration
   - `sitemap.xml` - Site structure for search engines
   - `manifest.json` - PWA manifest

### Files to Update
1. **Documentation:**
   - `README.md` - Update project name, domain references

2. **Main pages (high priority):**
   - `index.html` - Add comprehensive meta tags
   - `worksheets/index.html` - Add meta tags
   - `Flashcards/index.html` - Update visible branding
   - `Elevenstudents/index.html` - Check if needs updates
   - `specifications/maths.html` - Add meta tags, update folder references
   - `specifications/science.html` - Add meta tags, update folder references

3. **Interactive tools:**
   - `interactive/angle-rules/index.html`
   - `interactive/organisms/game.html`
   - `interactive/organisms/gallery.html`

4. **Templates (update for future worksheets):**
   - `templates/MATHS_TEMPLATE.html`
   - `templates/BIOLOGY_TEMPLATE.html`
   - `templates/CHEMISTRY_TEMPLATE.html`
   - `templates/PHYSICS_TEMPLATE.html`

## Implementation Strategy

**Approach:** Foundation first → Structure → Assets → Content → Documentation
**Git Strategy:** Initial commit of current state → Feature branch → Incremental commits
**Time Estimate:** ~4 hours total (can be split across sessions)

### Phase 1: Git Foundation (15 min)
**Why first:** Preserves "before" state for rollback, creates clean history

1. Create `.gitignore`:
   ```gitignore
   # Python
   __pycache__/
   *.py[cod]
   *$py.class
   .venv/
   venv/
   *.pyc

   # IDE
   .vscode/
   .idea/
   *.swp
   *.swo
   *~

   # OS
   .DS_Store
   Thumbs.db
   desktop.ini

   # Claude
   .claude/

   # Logs
   *.log

   # Temporary files
   *.tmp
   *.temp
   .cache/
   ```

2. Initial commit:
   ```bash
   git add .
   git commit -m "Initial commit: Educational resource site (pre-rebrand)

   - 51 worksheets across Biology, Chemistry, Physics, Mathematics
   - Flashcards app with spaced repetition
   - Interactive tools: Angle Rules, Organisms
   - Elevenstudents companion site
   - Note: Contains 'Specifications' folder (to be renamed)"
   ```

3. Create feature branch:
   ```bash
   git checkout -b rebrand-cakebreadscience
   ```

### Phase 2: Folder Structure Cleanup (10 min)
**Critical:** Windows is case-insensitive, requires two-step rename for Git

1. Two-step rename (Git-safe):
   ```bash
   git mv Specifications specifications-temp
   git mv specifications-temp specifications
   ```

2. Verify references (already lowercase in index.html - confirmed safe):
   - `index.html` lines 170, 173

3. Test all links locally

4. Commit:
   ```bash
   git commit -m "Rename Specifications → specifications for consistency"
   ```

### Phase 3: Web Assets (45 min)

#### 3A. Favicon Creation
**Design:** Simple beaker icon (universal science symbol, scales well to 16×16)
**Colors:** Primary `#3498db` (blue theme) on white/transparent background

Required formats (2026 standards):
1. `favicon.ico` (32×32) - Legacy browser support
2. `icon.svg` - Scalable, modern browsers
3. `apple-touch-icon.png` (180×180) - iOS devices
4. `icon-192.png` (192×192) - Android/PWA
5. `icon-512.png` (512×512) - PWA maskable icon

**Approach:** Create SVG first, convert to required sizes

#### 3B. robots.txt
```txt
User-agent: *
Allow: /

Sitemap: https://cakebreadscience.com/sitemap.xml
```

#### 3C. sitemap.xml
Include all 51 worksheets + main sections (comprehensive for SEO)

**Structure & Priorities:**
- Homepage, section hubs (priority 1.0, weekly)
- Specifications (priority 0.9, monthly)
- Flashcards, interactive (priority 0.8, monthly)
- Individual worksheets (priority 0.6, yearly)
- Elevenstudents (priority 0.5, monthly)

**Include:** All 51 worksheets (unique educational content)
**Exclude:** Templates, CSS files, deprecated content

#### 3D. manifest.json
```json
{
  "name": "Cakebread Science",
  "short_name": "CakebreadSci",
  "description": "IGCSE Edexcel curriculum resources for Math, Biology, Chemistry, and Physics",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#667eea",
  "background_color": "#667eea",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Commit after this phase:**
```bash
git add favicon.* icon-* robots.txt sitemap.xml manifest.json
git commit -m "Add web assets: favicon, robots.txt, sitemap, PWA manifest"
```

### Phase 4: Meta Tags Template
Create a standardized meta tags block for all pages:

```html
<!-- Essential Meta Tags -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="[PAGE-SPECIFIC DESCRIPTION]">
<meta name="keywords" content="IGCSE, Edexcel, [subject], worksheets, revision, flashcards">
<meta name="author" content="Cakebread Science">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://cakebreadscience.com/[PAGE-PATH]">
<meta property="og:title" content="[PAGE-TITLE] - Cakebread Science">
<meta property="og:description" content="[PAGE-SPECIFIC DESCRIPTION]">
<meta property="og:site_name" content="Cakebread Science">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="[PAGE-TITLE] - Cakebread Science">
<meta name="twitter:description" content="[PAGE-SPECIFIC DESCRIPTION]">

<!-- Favicon -->
<link rel="icon" type="image/png" href="/favicon.png">

<!-- PWA Manifest -->
<link rel="manifest" href="/manifest.json">

<!-- Theme Color -->
<meta name="theme-color" content="#667eea">

<!-- Canonical URL -->
<link rel="canonical" href="https://cakebreadscience.com/[PAGE-PATH]">
```

### Phase 5: Meta Tags - Main Pages (30 min)
**Priority 1:** Core navigation pages (highest traffic, SEO value)

Update 5 main pages with comprehensive meta tags:

1. **index.html** (root):
   - Title: "Cakebread Science - IGCSE Edexcel Resources"
   - Description: "Free IGCSE Edexcel resources including worksheets, flashcards, interactive tools, and curriculum specifications for Math, Biology, Chemistry, and Physics."
   - Canonical: https://cakebreadscience.com/

2. **worksheets/index.html**:
   - Title: "Worksheets - Cakebread Science"
   - Description: "51 printable IGCSE Edexcel worksheets across Math, Biology, Chemistry, and Physics. Print-optimized for A4 paper."
   - Canonical: https://cakebreadscience.com/worksheets/

3. **Flashcards/index.html**:
   - Title: "Flashcards - Cakebread Science"
   - Description: "Spaced repetition flashcards for IGCSE Edexcel with virtual pet gamification. Study Biology, Chemistry, Physics, and Physics Equations."
   - Canonical: https://cakebreadscience.com/Flashcards/

4. **specifications/maths.html**:
   - Title: "Mathematics Specification - Cakebread Science"
   - Description: "Interactive IGCSE Edexcel Mathematics specification browser with linked worksheets."
   - Canonical: https://cakebreadscience.com/specifications/maths.html

5. **specifications/science.html**:
   - Title: "Science Specification - Cakebread Science"
   - Description: "Interactive IGCSE Edexcel Science specification browser for Biology, Chemistry, and Physics with linked worksheets."
   - Canonical: https://cakebreadscience.com/specifications/science.html

**Commit:**
```bash
git commit -am "Add comprehensive meta tags to main navigation pages"
```

### Phase 6: Meta Tags - Interactive & Templates (20 min)
**Priority 2:** Interactive tools + templates (future-proofing)

Interactive pages:
6. `interactive/angle-rules/index.html`
7. `interactive/organisms/game.html`
8. `interactive/organisms/gallery.html`

Templates (critical for consistency):
9. `templates/MATHS_TEMPLATE.html`
10. `templates/BIOLOGY_TEMPLATE.html`
11. `templates/CHEMISTRY_TEMPLATE.html`
12. `templates/PHYSICS_TEMPLATE.html`

**Commit:**
```bash
git commit -am "Add meta tags to interactive tools and update templates"
```

### Phase 7: Meta Tags - All Worksheets (60 min)
**Priority 3:** Batch update all 51 worksheets

Using find-replace patterns for efficiency:
- Add favicon reference: `<link rel="icon" type="image/png" href="/favicon.png">`
- Add description meta tag
- Add canonical URL pattern: `https://cakebreadscience.com/worksheets/{subject}/{filename}`
- Add author meta tag

**Commit:**
```bash
git commit -am "Add meta tags to all 51 worksheets for SEO"
```

### Phase 8: Documentation (15 min)
Update README.md:
- Replace "AIR - Academic & Interactive Resources" with "Cakebread Science"
- Add domain: cakebreadscience.com
- Update deployment section
- Correct worksheet count (51, not 48)

**Commit:**
```bash
git commit -am "Update README with Cakebread Science branding"
```

### Phase 9: Merge & Finalize
```bash
git checkout main
git merge rebrand-cakebreadscience
```

## Verification Plan

### After Each Phase

**Phase 1 (Git):**
```bash
# Verify .gitignore works
git status
# Should NOT show: .venv/, .vscode/, .claude/

# Verify initial commit
git log
```

**Phase 2 (Folder rename):**
```bash
# Verify rename in Git
git status
git log

# Test links locally
# Open index.html → click "Maths Spec" and "Science Spec" links
# Both should work correctly
```

**Phase 3 (Web assets):**
- Open `/favicon.ico` in browser - should display beaker icon
- Open `/robots.txt` - should show allow all and sitemap URL
- Open `/sitemap.xml` - should be valid XML with ~60-70 URLs
- Open `/manifest.json` - should be valid JSON
- Use Lighthouse in Chrome DevTools to check PWA readiness

**Phase 5-7 (Meta tags):**
For each updated page:
1. Open in browser
2. View source (Ctrl+U)
3. Verify presence of:
   - Description meta tag
   - Canonical URL
   - Open Graph tags (og:title, og:description, og:url)
   - Favicon link
4. Test with tools:
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)

**Phase 8 (Documentation):**
- Read README.md
- Verify all mentions of "AIR" replaced with "Cakebread Science"
- Verify domain mentioned
- Check worksheet count is 51 (not 48)

### Final Integration Test

1. **Navigation flow:**
   - Start at index.html
   - Click through to each main section
   - Verify all links work
   - Check browser tab shows favicon

2. **Git history:**
   ```bash
   git log --oneline
   # Should show ~7-9 commits with clear messages
   ```

3. **SEO check:**
   - Run Lighthouse audit on main pages
   - Aim for 90+ SEO score

4. **File structure:**
   ```bash
   ls -la
   # Should show lowercase "specifications" folder
   # Should show new files: favicon.*, robots.txt, sitemap.xml, manifest.json
   ```

## Important Notes & Gotchas

1. **Firebase Config:** Remains "elevenstudents-76f31" (per user preference), but user-facing branding displays "Cakebread Science"

2. **Domain URLs:** Using `https://cakebreadscience.com` for all absolute URLs (meta tags, sitemap, canonical)

3. **Windows Case Sensitivity:** MUST use two-step git mv for folder rename (Specifications → temp → specifications)

4. **Pure HTML/CSS/JS:** Maintaining no-build-tools approach - all assets manually created

5. **Worksheet Count:** Actually 51 worksheets, not 48 (README currently incorrect)

6. **Template Priority:** Critical to update templates - ensures all future worksheets have proper meta tags

7. **Print Optimization:** Worksheets are print-optimized - verify meta tags don't affect print rendering

8. **Elevenstudents:** Separate site, minimal changes needed (check if any cross-references need updating)

9. **Path References:** After folder rename, verify:
   - `index.html` specifications links (lines 170, 173)
   - Any CSS imports if they reference folder structure

10. **Sitemap Scale:** Including all 51 worksheets = ~70 total URLs in sitemap (within reasonable limits)
