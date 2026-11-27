#!/usr/bin/env python3
"""Build staging-only Flashcards diff data (/staging-review/flashcards-diff.json)
and snapshot any replaced/deleted old Flashcards/media/* files into /staging-review/base-media/
so the Staging Review Hub can show true side-by-side Before vs After flashcards."""
import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "staging-review"
BASE_MEDIA = OUT_DIR / "base-media"
SUBJS = [("biology", "Biology"), ("chemistry", "Chemistry"), ("physics", "Physics")]
IMG_RE = re.compile(r'src=["\'](?:media/)?([^/"\']+\.(?:png|jpe?g|gif|webp|svg))["\']', re.I)


def git_show_bytes(ref: str, rel_path: str) -> bytes | None:
    res = subprocess.run(
        ["git", "-C", str(ROOT), "show", f"{ref}:{rel_path}"],
        capture_output=True,
    )
    return res.stdout if res.returncode == 0 else None


def git_rev_short(ref: str) -> str:
    res = subprocess.run(
        ["git", "-C", str(ROOT), "rev-parse", "--short", ref],
        capture_output=True,
        text=True,
    )
    return res.stdout.strip() if res.returncode == 0 else ref


def rewrite_media(html: str, prefix: str, extract_ref: str | None = None) -> str:
    if not html:
        return ""

    def repl(m: re.Match) -> str:
        fname = m.group(1)
        if extract_ref:
            dest = BASE_MEDIA / fname
            if not dest.exists():
                blob = git_show_bytes(extract_ref, f"Flashcards/media/{fname}")
                if blob is not None:
                    dest.parent.mkdir(parents=True, exist_ok=True)
                    dest.write_bytes(blob)
            if dest.exists():
                return f'src="{prefix}{fname}"'
        return f'src="/Flashcards/media/{fname}"'

    return IMG_RE.sub(repl, html)


def main() -> int:
    base_ref = sys.argv[1] if len(sys.argv) > 1 else "origin/main"
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    BASE_MEDIA.mkdir(parents=True, exist_ok=True)

    cards_out = []
    counts = {"image": 0, "added": 0, "reworked": 0}

    for sid, sname in SUBJS:
        rel = f"Flashcards/data/{sid}.json"
        cur_p = ROOT / rel
        if not cur_p.exists():
            continue
        new_list = json.loads(cur_p.read_text(encoding="utf-8"))
        old_bytes = git_show_bytes(base_ref, rel)
        old_list = json.loads(old_bytes.decode("utf-8")) if old_bytes else []
        old_map = {c["id"]: c for c in old_list}

        for c in new_list:
            cid = c["id"]
            oc = old_map.get(cid)
            if oc is None:
                counts["added"] += 1
                cards_out.append({
                    "id": cid,
                    "subject": sid,
                    "subjectName": sname,
                    "spec": c.get("spec", ""),
                    "sub": c.get("sub", ""),
                    "kind": "added",
                    "oldFront": "",
                    "oldBack": "",
                    "newFront": rewrite_media(c.get("front", ""), "/Flashcards/media/"),
                    "newBack": rewrite_media(c.get("back", ""), "/Flashcards/media/"),
                })
                continue

            if oc.get("front") == c.get("front") and oc.get("back") == c.get("back") and oc.get("spec") == c.get("spec"):
                continue

            old_imgs = set(IMG_RE.findall((oc.get("front", "") + " " + oc.get("back", ""))))
            new_imgs = set(IMG_RE.findall((c.get("front", "") + " " + c.get("back", ""))))
            kind = "image" if (old_imgs != new_imgs or (old_imgs and not new_imgs) or (new_imgs and not old_imgs)) else "reworked"
            counts[kind] += 1
            cards_out.append({
                "id": cid,
                "subject": sid,
                "subjectName": sname,
                "spec": c.get("spec", ""),
                "sub": c.get("sub", ""),
                "kind": kind,
                "oldFront": rewrite_media(oc.get("front", ""), "/staging-review/base-media/", extract_ref=base_ref),
                "oldBack": rewrite_media(oc.get("back", ""), "/staging-review/base-media/", extract_ref=base_ref),
                "newFront": rewrite_media(c.get("front", ""), "/Flashcards/media/"),
                "newBack": rewrite_media(c.get("back", ""), "/Flashcards/media/"),
            })

    payload = {
        "baseRef": base_ref,
        "baseCommit": git_rev_short(base_ref),
        "headCommit": git_rev_short("HEAD"),
        "counts": counts,
        "total": len(cards_out),
        "cards": cards_out,
    }
    out_file = OUT_DIR / "flashcards-diff.json"
    out_file.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    media_cnt = sum(1 for _ in BASE_MEDIA.glob("*")) if BASE_MEDIA.exists() else 0
    print(f"Wrote {out_file.relative_to(ROOT)} ({out_file.stat().st_size/1024:.1f} KB) · {len(cards_out)} changed cards {counts} · {media_cnt} old media snapshotted")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
