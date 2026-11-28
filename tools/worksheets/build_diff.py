#!/usr/bin/env python3
"""Build staging-only split-screen printables diff data (worksheets/diff/data.json).

Compares every live printable — Science/Maths worksheets AND Topic Booklets (plus their
_ms.html mark schemes, excluding interactive/physics-long-answer) — against a git baseline
(default: origin/main), and always includes every unchecked science printable so nothing
slips past the PRINTABLES tab of /staging-review/.

Usage:
  python tools/worksheets/build_diff.py
  python tools/worksheets/build_diff.py --base <commit> --label "before last prompt"
"""
import argparse
import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
WS_DIR = ROOT / "worksheets"
BOOKLETS_DIR = ROOT / "booklets"
DIFF_DIR = WS_DIR / "diff"
BASE_ASSETS_DIR = DIFF_DIR / "base-assets"
SUBJECTS = [
    ("biology", "Biology"),
    ("chemistry", "Chemistry"),
    ("physics", "Physics"),
    ("maths", "Maths"),
    ("cross-curricular", "Cross-curricular"),
]
BOOKLET_SUBJS = ("biology", "chemistry", "physics")


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


def git_ls_html(ref: str, folder: str) -> set[str]:
    res = subprocess.run(
        ["git", "-C", str(ROOT), "ls-tree", "-r", "--name-only", ref, folder],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    if res.returncode != 0:
        return set()
    return {line.strip().replace("\\", "/") for line in res.stdout.splitlines() if line.strip().endswith(".html")}


def norm_html(s: str | None) -> str:
    if not s:
        return ""
    return re.sub(r"\s+", " ", s).strip()


def clean_preview_html(s: str | None) -> str | None:
    if s is None:
        return None
    return re.sub(
        r'<script\b[^>]*src=["\'][^"\']*(?:home-link|auth-gate|account|sheet-links)\.js["\'][^>]*>\s*</script>',
        "",
        s,
        flags=re.I,
    )


def clean_text(s: str) -> str:
    t = re.sub(r"<[^>]+>", "", s)
    t = t.replace("&amp;", "&").replace("&ndash;", "–").replace("&mdash;", "—")
    return re.sub(r"\s+", " ", t).strip()


def extract_title(html: str, fallback: str, is_booklet: bool) -> str:
    m = (
        re.search(r'class="cv-title"[^>]*>(.*?)</div>', html, re.I | re.S)
        or re.search(r"<title>(.*?)</title>", html, re.I | re.S)
        if is_booklet
        else re.search(r"<h1\b[^>]*>(.*?)</h1>", html, re.I | re.S)
        or re.search(r"<title>(.*?)</title>", html, re.I | re.S)
    )
    if not m:
        return fallback
    t = re.sub(r"\s*·\s*Topic Booklet$", "", clean_text(m.group(1)), flags=re.I)
    return t or fallback


def extract_spec(html: str, is_booklet: bool) -> str:
    pat = r'class="cv-sub"[^>]*>(.*?)</div>' if is_booklet else r'class="(?:ps-spec|spec-ref)"[^>]*>(.*?)</div>'
    m = re.search(pat, html, re.I | re.S)
    return clean_text(m.group(1))[:120] if m else ""


def tier_of(rel: str, is_booklet: bool) -> str:
    if is_booklet:
        return "Topic booklet"
    if "/ks3/" in rel:
        return "KS3"
    if rel.endswith("_sa.html"):
        return "KS4 · Single Award"
    if "/ks4/" in rel:
        return "KS4"
    return "Sheet"


def count_pages(html: str | None) -> int:
    if not html:
        return 0
    return len(re.findall(r'<div\b[^>]*class=["\'][^"\']*\bpage\b', html, re.I))


def snapshot_base_assets(base_ref: str) -> dict[str, bool]:
    BASE_ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    changed = {}
    assets = (
        ("print-sheet.css", "css/print-sheet.css"),
        ("biology.css", "css/biology.css"),
        ("chemistry.css", "css/chemistry.css"),
        ("physics.css", "css/physics.css"),
        ("maths.css", "css/maths.css"),
        ("booklet.css", "booklets/assets/booklet.css"),
    )
    for name, rel in assets:
        old_txt = git_show(base_ref, rel)
        cur_p = ROOT / rel
        cur_txt = cur_p.read_text(encoding="utf-8", errors="replace") if cur_p.exists() else None
        norm_eol = lambda s: None if s is None else s.replace("\r\n", "\n")
        changed[name] = old_txt is not None and norm_eol(old_txt) != norm_eol(cur_txt)
        if old_txt is not None:
            (BASE_ASSETS_DIR / name).write_text(old_txt, encoding="utf-8")
    return changed


def load_approved() -> set[str]:
    p = ROOT / "admin" / "review-approved.json"
    if not p.exists():
        return set()
    try:
        j = json.loads(p.read_text(encoding="utf-8"))
        return set(j.get("w", {}).keys()) | set(j.get("b", {}).keys())
    except Exception:
        return set()


def archived_set() -> set[str]:
    arch = WS_DIR / "archive.html"
    if not arch.exists():
        return set()
    txt = arch.read_text(encoding="utf-8", errors="replace")
    return set(re.findall(r'href="((?:biology|chemistry|physics|maths|cross-curricular)/[^"#?]+\.html)"', txt))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="origin/main", help="Git ref to compare staging printables against")
    ap.add_argument("--label", default=None, help="Human-readable baseline label shown in the comparer UI")
    args = ap.parse_args()

    base_label = args.label or ("live main" if args.base in ("origin/main", "main") else args.base)
    DIFF_DIR.mkdir(parents=True, exist_ok=True)
    asset_changed = snapshot_base_assets(args.base)
    archived = archived_set()
    approved = load_approved()

    cur_files: set[str] = set()
    for sid, _ in SUBJECTS:
        sdir = WS_DIR / sid
        if not sdir.exists():
            continue
        for p in sdir.rglob("*.html"):
            rel = p.relative_to(ROOT).as_posix()
            sub_rel = rel[len("worksheets/"):]
            if sub_rel.endswith("_ms.html") or sub_rel in archived:
                continue
            cur_files.add(rel)

    for sid in BOOKLET_SUBJS:
        bdir = BOOKLETS_DIR / sid
        if not bdir.exists():
            continue
        for p in bdir.rglob("*.html"):
            rel = p.relative_to(ROOT).as_posix()
            if rel.endswith("_ms.html"):
                continue
            cur_files.add(rel)

    base_files = {
        r for r in git_ls_html(args.base, "worksheets")
        if any(r.startswith(f"worksheets/{sid}/") for sid, _ in SUBJECTS)
        and not r.endswith("_ms.html")
        and r[len("worksheets/"):] not in archived
    } | {
        r for r in git_ls_html(args.base, "booklets")
        if any(r.startswith(f"booklets/{sid}/") for sid in BOOKLET_SUBJS)
        and not r.endswith("_ms.html")
    }

    subj_names = dict(SUBJECTS)
    all_rels = sorted(cur_files | base_files, key=lambda r: (0 if r.startswith("booklets/") else 1, r))
    items = []

    for rel in all_rels:
        is_booklet = rel.startswith("booklets/")
        sub_rel = rel if is_booklet else rel[len("worksheets/"):]
        sid = rel.split("/")[1] if is_booklet else sub_rel.split("/", 1)[0]
        ms_rel = rel[:-5] + "_ms.html"

        cur_p = ROOT / rel
        cur_ms_p = ROOT / ms_rel
        new_html = cur_p.read_text(encoding="utf-8", errors="replace") if cur_p.exists() else None
        new_ms = cur_ms_p.read_text(encoding="utf-8", errors="replace") if cur_ms_p.exists() else None
        old_html = git_show(args.base, rel)
        old_ms = git_show(args.base, ms_rel)

        sheet_changed = norm_html(old_html) != norm_html(new_html)
        ms_changed = norm_html(old_ms) != norm_html(new_ms)
        css_affected = (
            asset_changed.get("print-sheet.css", False)
            or asset_changed.get(f"{sid}.css", False)
            or (is_booklet and asset_changed.get("booklet.css", False))
        )
        under_review = bool(new_html and re.search(r"under\s+review|review-chip", new_html, re.I))
        is_science_printable = is_booklet or sid in ("biology", "chemistry", "physics")
        checked = (not under_review) and (sub_rel in approved or not is_science_printable)

        if not sheet_changed and not ms_changed and not (css_affected and new_html and old_html) and not under_review:
            continue

        if old_html is None and new_html is not None:
            kind = "added"
        elif new_html is None and old_html is not None:
            kind = "removed"
        elif not sheet_changed and not ms_changed and not css_affected:
            kind = "unchanged"
        else:
            kind = "changed"

        ref_html = new_html or old_html or ""
        title = extract_title(ref_html, pathlib.Path(rel).stem, is_booklet)
        spec = extract_spec(ref_html, is_booklet)
        base_url = "/" + rel.rsplit("/", 1)[0] + "/"
        raw_id = ("booklet-" + rel[len("booklets/"):-5]) if is_booklet else sub_rel[:-5]

        items.append({
            "id": re.sub(r"[^a-z0-9]+", "-", raw_id.lower()).strip("-"),
            "format": "booklet" if is_booklet else "worksheet",
            "subject": sid,
            "subjectName": subj_names.get(sid, sid.title()),
            "tier": tier_of(sub_rel, is_booklet),
            "path": sub_rel,
            "url": "/" + rel,
            "msUrl": "/" + ms_rel if (new_ms or old_ms) else None,
            "baseUrl": base_url,
            "title": title,
            "spec": spec,
            "kind": kind,
            "checked": checked,
            "underReview": under_review,
            "sheetChanged": sheet_changed or css_affected,
            "msChanged": ms_changed,
            "oldPages": count_pages(old_html),
            "newPages": count_pages(new_html),
            "hasMs": bool(new_ms or old_ms),
            "oldHtml": clean_preview_html(old_html),
            "newHtml": clean_preview_html(new_html),
            "oldMsHtml": clean_preview_html(old_ms),
            "newMsHtml": clean_preview_html(new_ms),
        })

    out = {
        "baseRef": args.base,
        "baseLabel": base_label,
        "baseCommit": git_rev_short(args.base),
        "headCommit": git_rev_short("HEAD"),
        "assetChanged": asset_changed,
        "sheets": items,
    }
    data_path = DIFF_DIR / "data.json"
    data_text = json.dumps(out, ensure_ascii=False, separators=(",", ":"))
    data_path.write_text(data_text, encoding="utf-8")

    counts = {
        "booklets": sum(1 for x in items if x["format"] == "booklet"),
        "worksheets": sum(1 for x in items if x["format"] == "worksheet"),
        "underReview": sum(1 for x in items if x["underReview"]),
    }
    print(f"Wrote {data_path.relative_to(ROOT)} ({len(data_text)/1024:.1f} KB) · {len(items)} printables vs {base_label} ({out['baseCommit']}) {counts}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
