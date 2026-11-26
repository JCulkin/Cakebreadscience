#!/usr/bin/env python3
"""Build staging-only split-screen lesson diff data (interactive/lessons/diff/data.json).

Compares every lesson draft against a git baseline (default: origin/main) and extracts
ONLY the slides that were changed, added, removed, or moved — omitting unchanged slides.
Also snapshots changed shared assets (chem.js, bio.js, lesson.css, tags.css) from the
baseline into interactive/lessons/diff/base-assets/ so the Before pane renders old CSS/JS
diagrams faithfully without duplicating any lesson images.
"""
import argparse
import difflib
import html as html_lib
import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
LESSONS_DIR = ROOT / "interactive" / "lessons"
DIFF_DIR = LESSONS_DIR / "diff"
BASE_ASSETS_DIR = DIFF_DIR / "base-assets"


def git_show(ref: str, rel_path: str) -> str | None:
    res = subprocess.run(
        ["git", "-C", str(ROOT), "show", f"{ref}:{rel_path}"],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    return res.stdout if res.returncode == 0 else None


def git_rev_short(ref: str) -> str:
    res = subprocess.run(
        ["git", "-C", str(ROOT), "rev-parse", "--short", ref],
        capture_output=True,
        text=True,
    )
    return res.stdout.strip() if res.returncode == 0 else ref


def extract_deck_src(html: str) -> str:
    m = re.search(r'<div\b[^>]*\bid=["\']deck-src["\'][^>]*>', html, re.I)
    if not m:
        return ""
    # Scan forward matching nested <div>...</div>
    pos = m.end()
    depth = 1
    for tok in re.finditer(r'<(/?)div\b[^>]*>', html[pos:], re.I):
        if tok.group(1) == "/":
            depth -= 1
            if depth == 0:
                return html[pos : pos + tok.start()]
        else:
            if not tok.group(0).rstrip().endswith("/>"):
                depth += 1
    return html[pos:]


def extract_slides(html: str) -> list[dict]:
    deck = extract_deck_src(html)
    if not deck:
        return []
    slides = []
    pos = 0
    num = 0
    while True:
        m = re.search(r'<section\b[^>]*>', deck[pos:], re.I)
        if not m:
            break
        start = pos + m.start()
        open_tag = m.group(0)
        # Find matching </section>
        scan = pos + m.end()
        depth = 1
        end = len(deck)
        for tok in re.finditer(r'<(/?)section\b[^>]*>', deck[scan:], re.I):
            if tok.group(1) == "/":
                depth -= 1
                if depth == 0:
                    end = scan + tok.end()
                    break
            else:
                depth += 1
        block = deck[start:end]
        pos = end
        # Skip auto-expanded quiz/exam placeholders from slide diffing
        if re.search(r'\bdata-auto\s*=', open_tag, re.I):
            continue
        if not re.search(r'\bclass\s*=\s*["\'][^"\']*\bps\b', open_tag, re.I):
            continue
        num += 1
        hm = re.search(r'<h[12]\b[^>]*>(.*?)</h[12]>', block, re.I | re.S)
        raw_title = hm.group(1) if hm else ""
        title = re.sub(r'<br\s*/?>', ' ', raw_title, flags=re.I)
        title = html_lib.unescape(re.sub(r'<[^>]+>', '', title))
        title = re.sub(r'\s+', ' ', title).strip() or f"Slide {num}"
        plain = re.sub(r'<style\b.*?</style>', ' ', block, flags=re.I | re.S)
        plain = re.sub(r'<[^>]+>', ' ', plain)
        plain = re.sub(r'\s+', ' ', plain).strip()
        imgs = sorted(set(re.findall(r'(?:src|href)=["\'](img/[^"\']+)["\']', block, re.I)))
        comps = sorted(set(re.findall(r'data-comp=["\']([^"\']+)["\']', block, re.I)))
        slides.append({
            "num": num,
            "html": block.strip(),
            "norm": re.sub(r'\s+', ' ', block).strip(),
            "title": title,
            "titleKey": re.sub(r'[^a-z0-9]+', ' ', title.lower()).strip(),
            "plain": plain,
            "imgs": imgs,
            "comps": comps,
        })
    return slides


def extract_head_styles(html: str) -> str:
    head_m = re.search(r'<head\b[^>]*>(.*?)</head>', html, re.I | re.S)
    if not head_m:
        return ""
    styles = re.findall(r'<style\b[^>]*>(.*?)</style>', head_m.group(1), re.I | re.S)
    return "\n".join(s.strip() for s in styles if s.strip())


def extract_scripts(html: str) -> list[str]:
    srcs = re.findall(r'<script\b[^>]*\bsrc=["\']([^"\']+)["\']', html, re.I)
    # Keep lesson component scripts, drop lesson.js (the comparer mounts slides itself)
    out = []
    for s in srcs:
        base = s.rsplit("/", 1)[-1]
        if base in ("lesson.js", "home-link.js"):
            continue
        out.append(s)
    return out


def slide_similarity(a: dict, b: dict) -> float:
    if a["norm"] == b["norm"]:
        return 1.0
    h_sim = difflib.SequenceMatcher(None, a["titleKey"], b["titleKey"]).ratio() if (a["titleKey"] or b["titleKey"]) else 0.0
    t_sim = difflib.SequenceMatcher(None, a["plain"][:600], b["plain"][:600]).ratio()
    i_sim = 0.0
    if a["imgs"] or b["imgs"]:
        sa, sb = set(a["imgs"]), set(b["imgs"])
        i_sim = len(sa & sb) / max(1, len(sa | sb))
    return 0.45 * h_sim + 0.40 * t_sim + 0.15 * i_sim


def changed_chem_components(old_js: str | None, new_js: str | None) -> set[str]:
    """Return the exact set of chem.js data-comp names whose rendering code changed."""
    if not old_js or not new_js or old_js == new_js:
        return set()

    def split_comps(src: str) -> dict[str, str]:
        matches = list(re.finditer(r"C\[['\"]([^'\"]+)['\"]\]\s*=", src))
        out: dict[str, str] = {}
        for idx, m in enumerate(matches):
            name = m.group(1)
            end = matches[idx + 1].start() if idx + 1 < len(matches) else len(src)
            chunk = src[m.start():end]
            # Trim trailing section comment or IIFE closing belonging to the end of the file / next component
            chunk = re.split(r"\n/\*\s*(?:={4,}|-{4,})", chunk, maxsplit=1)[0]
            chunk = re.sub(r"\n\}\)\(\);\s*$", "", chunk)
            out[name] = chunk.strip()
        return out

    def slice_between(src: str, start_pat: str, end_pat: str) -> str:
        ms = re.search(start_pat, src)
        if not ms:
            return ""
        me = re.search(end_pat, src[ms.start():])
        return src[ms.start(): ms.start() + me.start()] if me else src[ms.start():]

    changed: set[str] = set()
    old_c = split_comps(old_js)
    new_c = split_comps(new_js)
    for name in set(old_c) | set(new_c):
        if old_c.get(name) != new_c.get(name):
            changed.add(name)

    # Shared helpers that feed multiple components
    helper_deps = [
        (r"/\*\s*=+\s*covalent dot-and-cross", r"function molFacts\(", ("dc-mol", "dc-deck", "dc-explorer")),
        (r"function molFacts\(", r"C\['dc-mol'\]", ("dc-facts", "dc-explorer")),
        (r"/\*\s*=+\s*ionic dot-and-cross", r"C\['ionic'\]", ("ionic", "ionic-explorer")),
        (r"/\*\s*=+\s*ionic formula builder", r"C\['formula-builder'\]", ("formula-builder",)),
        (r"/\*\s*=+\s*particle simulations", r"C\['particles'\]", ("particles",)),
        (r"const SUBST\s*=", r"C\['state-predictor'\]", ("state-predictor",)),
        (r"const COND_SUB\s*=", r"C\['conduct-test'\]", ("conduct-test",)),
    ]
    for sp, ep, deps in helper_deps:
        if slice_between(old_js, sp, ep) != slice_between(new_js, sp, ep):
            changed.update(deps)

    return changed


def align_and_diff(old_slides: list[dict], new_slides: list[dict], changed_chem_comps: set[str]) -> list[dict]:
    old_norms = [s["norm"] for s in old_slides]
    new_norms = [s["norm"] for s in new_slides]
    sm = difflib.SequenceMatcher(None, old_norms, new_norms, autojunk=False)

    # First collect unmatched old & new indices across non-equal opcodes to detect pure moves
    ops = sm.get_opcodes()
    unmatched_old: dict[str, list[int]] = {}
    unmatched_new: dict[str, list[int]] = {}
    for tag, i1, i2, j1, j2 in ops:
        if tag == "equal":
            continue
        for i in range(i1, i2):
            unmatched_old.setdefault(old_norms[i], []).append(i)
        for j in range(j1, j2):
            unmatched_new.setdefault(new_norms[j], []).append(j)

    # Pair exact-HTML moves
    moved_old_to_new: dict[int, int] = {}
    moved_new_set: set[int] = set()
    for norm, o_idxs in unmatched_old.items():
        n_idxs = unmatched_new.get(norm, [])
        for oi, nj in zip(o_idxs, n_idxs):
            moved_old_to_new[oi] = nj
            moved_new_set.add(nj)

    entries: list[dict] = []

    def needs_chem_engine_diff(s: dict) -> bool:
        if not changed_chem_comps:
            return False
        return any(c in changed_chem_comps for c in s["comps"])

    for tag, i1, i2, j1, j2 in ops:
        if tag == "equal":
            for oi, nj in zip(range(i1, i2), range(j1, j2)):
                os, ns = old_slides[oi], new_slides[nj]
                if needs_chem_engine_diff(ns):
                    entries.append({
                        "kind": "changed",
                        "oldNum": os["num"],
                        "newNum": ns["num"],
                        "title": ns["title"],
                        "note": "Updated diagram renderer (chem.js)",
                        "oldHtml": os["html"],
                        "newHtml": ns["html"],
                        "_sort": (ns["num"], 0),
                    })
            continue

        o_rem = [i for i in range(i1, i2) if i not in moved_old_to_new]
        n_rem = [j for j in range(j1, j2) if j not in moved_new_set]

        # Record moved slides anchored at their new position
        for j in range(j1, j2):
            if j in moved_new_set:
                oi = next(k for k, v in moved_old_to_new.items() if v == j)
                os, ns = old_slides[oi], new_slides[j]
                kind = "changed" if needs_chem_engine_diff(ns) else "moved"
                entries.append({
                    "kind": kind,
                    "oldNum": os["num"],
                    "newNum": ns["num"],
                    "title": ns["title"],
                    "note": f"Moved from Slide {os['num']} → {ns['num']}",
                    "oldHtml": os["html"],
                    "newHtml": ns["html"],
                    "_sort": (ns["num"], 0),
                })

        # Pair remaining old & new slides within this hunk by similarity
        pairs = []
        for oi in o_rem:
            for nj in n_rem:
                score = slide_similarity(old_slides[oi], new_slides[nj])
                if score >= 0.36:
                    pairs.append((score, oi, nj))
        pairs.sort(reverse=True)
        used_o, used_n = set(), set()
        for score, oi, nj in pairs:
            if oi in used_o or nj in used_n:
                continue
            used_o.add(oi)
            used_n.add(nj)
            os, ns = old_slides[oi], new_slides[nj]
            entries.append({
                "kind": "changed",
                "oldNum": os["num"],
                "newNum": ns["num"],
                "title": ns["title"],
                "oldHtml": os["html"],
                "newHtml": ns["html"],
                "_sort": (ns["num"], 0),
            })

        # Unpaired removals (anchor just before j1+1)
        anchor_new = j1 + 1
        for oi in o_rem:
            if oi in used_o:
                continue
            os = old_slides[oi]
            entries.append({
                "kind": "removed",
                "oldNum": os["num"],
                "newNum": None,
                "title": os["title"],
                "oldHtml": os["html"],
                "newHtml": None,
                "_sort": (anchor_new - 0.5, os["num"]),
            })

        # Unpaired additions
        for nj in n_rem:
            if nj in used_n:
                continue
            ns = new_slides[nj]
            entries.append({
                "kind": "added",
                "oldNum": None,
                "newNum": ns["num"],
                "title": ns["title"],
                "oldHtml": None,
                "newHtml": ns["html"],
                "_sort": (ns["num"], 0),
            })

    entries.sort(key=lambda e: e["_sort"])
    for e in entries:
        e.pop("_sort", None)
    return entries


def snapshot_base_assets(base_ref: str) -> dict[str, bool]:
    BASE_ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    changed_flags = {}
    asset_map = {
        "lesson.css": "interactive/lessons/assets/lesson.css",
        "tags.css": "interactive/lessons/tags.css",
        "chem.js": "interactive/lessons/assets/chem.js",
        "bio.js": "interactive/lessons/assets/bio.js",
        "cells.js": "interactive/lessons/assets/cells.js",
        "diagrams.js": "interactive/lessons/assets/diagrams.js",
        "diagq.js": "interactive/lessons/assets/diagq.js",
    }
    for name, rel in asset_map.items():
        old_txt = git_show(base_ref, rel)
        cur_p = ROOT / rel
        cur_txt = cur_p.read_text(encoding="utf-8", errors="replace") if cur_p.exists() else None
        is_changed = old_txt is not None and old_txt != cur_txt
        changed_flags[name] = is_changed
        if old_txt is not None:
            (BASE_ASSETS_DIR / name).write_text(old_txt, encoding="utf-8")
    return changed_flags


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="origin/main", help="Git ref to compare staging drafts against")
    ap.add_argument("--label", default=None, help="Human-readable baseline label shown in the comparer UI")
    args = ap.parse_args()

    base_label = args.label or ("live main" if args.base in ("origin/main", "main") else args.base)

    DIFF_DIR.mkdir(parents=True, exist_ok=True)
    asset_changed = snapshot_base_assets(args.base)
    old_chem_js = git_show(args.base, "interactive/lessons/assets/chem.js")
    cur_chem_p = ROOT / "interactive/lessons/assets/chem.js"
    cur_chem_js = cur_chem_p.read_text(encoding="utf-8", errors="replace") if cur_chem_p.exists() else None
    chem_comps_changed = changed_chem_components(old_chem_js, cur_chem_js)

    manifest = json.loads((LESSONS_DIR / "lessons.json").read_text(encoding="utf-8"))
    lessons_out = []
    missing_imgs = []

    for subj in manifest["subjects"]:
        sid = subj["id"]
        sname = subj["name"]
        for sec in subj["sections"]:
            for t in sec["topics"]:
                code = t["code"]
                rel_deck = f"interactive/lessons/{sid}/{code}/draft/deck.html"
                rel_idx = f"interactive/lessons/{sid}/{code}/draft/index.html"
                cur_path = ROOT / rel_deck if (ROOT / rel_deck).exists() else ROOT / rel_idx
                if not cur_path.exists():
                    continue
                new_html = cur_path.read_text(encoding="utf-8", errors="replace")
                old_html = git_show(args.base, rel_deck)
                if old_html is None:
                    old_html = git_show(args.base, rel_idx)

                new_slides = extract_slides(new_html)
                old_slides = extract_slides(old_html) if old_html else []
                is_new_lesson = old_html is None

                if is_new_lesson:
                    entries = [
                        {
                            "kind": "added",
                            "oldNum": None,
                            "newNum": s["num"],
                            "title": s["title"],
                            "oldHtml": None,
                            "newHtml": s["html"],
                        }
                        for s in new_slides
                    ]
                else:
                    entries = align_and_diff(old_slides, new_slides, chem_comps_changed)

                if not entries:
                    continue

                # Verify old image files still exist on disk
                img_dir = cur_path.parent
                for e in entries:
                    if e.get("oldHtml"):
                        for im in set(re.findall(r'(?:src|href)=["\'](img/[^"\']+)["\']', e["oldHtml"], re.I)):
                            if not (img_dir / im).exists():
                                missing_imgs.append(f"{sid}/{code}: {im}")

                counts = {k: sum(1 for e in entries if e["kind"] == k) for k in ("changed", "added", "removed", "moved")}
                lessons_out.append({
                    "id": f"{sid}-{code}",
                    "subject": sid,
                    "subjectName": sname,
                    "code": code,
                    "title": t["title"],
                    "spec": t.get("spec", ""),
                    "status": t.get("status", "draft"),
                    "draftUpdated": t.get("draftUpdated", ""),
                    "isNew": is_new_lesson,
                    "baseUrl": f"/interactive/lessons/{sid}/{code}/draft/",
                    "oldTotal": len(old_slides),
                    "newTotal": len(new_slides),
                    "counts": counts,
                    "oldStyles": extract_head_styles(old_html) if old_html else "",
                    "newStyles": extract_head_styles(new_html),
                    "oldScripts": extract_scripts(old_html) if old_html else [],
                    "newScripts": extract_scripts(new_html),
                    "slides": entries,
                })

    out = {
        "baseRef": args.base,
        "baseLabel": base_label,
        "baseCommit": git_rev_short(args.base),
        "headCommit": git_rev_short("HEAD"),
        "assetChanged": asset_changed,
        "lessons": lessons_out,
    }
    data_path = DIFF_DIR / "data.json"
    data_text = json.dumps(out, ensure_ascii=False, separators=(",", ":"))
    data_path.write_text(data_text, encoding="utf-8")

    print(f"Wrote {data_path.relative_to(ROOT)} ({len(data_text)/1024:.1f} KB) · {len(lessons_out)} lessons changed vs {base_label} ({out['baseCommit']})")
    if chem_comps_changed:
        print("  chem.js changed components:", ", ".join(sorted(chem_comps_changed)))
    for l in lessons_out:
        c = l["counts"]
        tag = "NEW" if l["isNew"] else f"status={l['status']}"
        print(f"  {l['subject']}/{l['code']:3s} [{tag:14s}] old={l['oldTotal']:2d} new={l['newTotal']:2d} | changed={c['changed']} added={c['added']} removed={c['removed']} moved={c['moved']}")
    if missing_imgs:
        print("MISSING OLD IMAGES:", missing_imgs)
    return 0


if __name__ == "__main__":
    sys.exit(main())
