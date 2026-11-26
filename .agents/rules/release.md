---
trigger: model_decision
description: Release checklist for merging staging into main (publishing the site). Use only when the user says "release", "publish to main" or "launch it".
---
# Releasing staging → main

**Release-chat only:** Only the dedicated Antigravity release chat (`Cakebread Science - Release (staging -> main)`) may merge
`staging` → `main` or trigger a production deploy, and only when the user says **"release" / "publish to main"**. All other chats
must stop at `staging` and direct the user to the release chat to publish. Each production deploy costs 15 Netlify credits (300 a month,
renewing on the 29th); previews are free. Versions: major = platform change, minor = new feature, patch = fixes/content.
Last release: **v5.1.0 "Worksheets, study guides and the Review portal"** (23 Nov 2026, PR #7). Next PR: #8.

1. `git fetch origin`; list commits since the last release (`git log origin/main..origin/staging`).
2. **Database paths:** `git diff origin/main..origin/staging | grep -oE "\.ref\(['\`][^'\`]+|collection\(['\"][a-zA-Z]+"` and compare
   with the published rules; also read commits that mention new data (new fields inside existing objects aren't caught by the grep).
   List anything new so the user adds the rule **before** the merge.
3. **Past-paper check:** make sure no real exam questions, mark schemes or scans were committed.
4. `node tools/spec-quiz/check_bank.js interactive/spec-quiz` → must say problems 0.
5. `node tools/spec/build_index.js`; commit `js/spec-index.js` / `admin/worksheets.json` if they really changed.
6. Tests (local server on 8765): `python tools/test/smoke.py` (no page errors in any of the three runs),
   `python tools/test/links.py .` (expected hits only: two `([^` in admin/index.html, the maths template, `tools/pptx/b_template.html`),
   home links on changed pages: `git diff --name-only --diff-filter=AM origin/main..HEAD | grep html$ > changed.txt`, then
   `python tools/test/homelinks.py . changed.txt` (admin pages and Flashcards are expected flags when Firebase is blocked).
7. Sitemap/noindex: approved live pages in `sitemap.xml`; drafts and "Under review" worksheets stay noindex; archived worksheets out.
8. Changelog & rule hygiene: in `admin/VERSION_HISTORY.md` tidy `## [Unreleased]` (duplicates, missing commits) and rename it `## [x.y.z] - date`;
   README "Recent updates"; homepage footer version (`index.html`); if students get news, update `/js/whats-new.js` ITEMS and bump
   its storage key (e.g. `cbs.whatsnew.v51` → `v52`); remove released items' cards from `test.html`. Confirm `AGENTS.md` is under 15 KB and prune any retired/legacy rules in `.agents/rules/`.
9. Check nothing was pushed since your checks (PR head = the SHA you checked). Rename the PR to the version and merge **pinned to that SHA**:
   `gh api repos/JCulkin/Cakebreadscience/pulls/<n>/merge -X PUT -f sha=<sha> -f merge_method=merge`
   (`gh pr list` may fail; use `gh api "repos/JCulkin/Cakebreadscience/pulls?state=open"`).
10. Wait a minute and confirm the Netlify production deploy for the merge commit is "ready" (Netlify dashboard, or
    `gh api repos/JCulkin/Cakebreadscience/commits/<sha>/statuses`).
11. Fast-forward staging to main: `git push origin origin/main:refs/heads/staging`; check with `git ls-remote origin main staging`.
12. Open the next PR (title "Next release (staging → main)", head staging, base main) when new work lands.
13. Tell the user: version, what's in it, any Firebase rules he must add, what was only tested against the fake Firebase.
