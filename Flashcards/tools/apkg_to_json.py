"""Convert the Anki decks in Flashcards/ANKI files/ to JSON the Flashcards page loads (Flashcards/data/<deck>.json).

Usage (from the repo root):  python3 -I Flashcards/tools/apkg_to_json.py
Needs: pip install zstandard   (new Anki exports keep the cards in a zstd-compressed collection.anki21b)

Each card: {"id": Anki card id (students' progress is saved against it — never change), "front", "back",
            "spec": "B2.27" (subject letter + Double Award spec number, from the deck's 3rd field) or null,
            "topic": "B2"}.
The 3rd field holds the spec number ("2.27", "1.02", or just a topic like "2"). Numbers that aren't Double Award points
in interactive/spec-quiz/spec.js (e.g. Biology-only numbering) keep "topic" but get "spec": null.
Also copies any card images missing from Flashcards/media/ out of the decks (8 were missing until 10 Nov 2026), and writes
interactive/spec-quiz/cards.js: CARD_COUNTS = { 'B2.27': n, ... } so the Questing engine knows how many
cards each spec point has without loading the decks."""
import json, re, sqlite3, sys, tempfile, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
APKG_DIR = ROOT / 'Flashcards' / 'ANKI files'
OUT_DIR = ROOT / 'Flashcards' / 'data'
SPEC_JS = ROOT / 'interactive' / 'spec-quiz' / 'spec.js'
COUNTS_JS = ROOT / 'interactive' / 'spec-quiz' / 'cards.js'

DECKS = {  # deck id (used in progress keys `${deck}_${cardId}`) → (file, subject letter, display name)
    'biology': ('IGCSE__Biology_v2.apkg', 'B', 'Biology'),
    'chemistry': ('IGCSE__Chemistry_v3.apkg', 'C', 'Chemistry'),
    'physics': ('IGCSE__Physics_v1.apkg', 'P', 'Physics'),
    'physics-eqns': ('IGCSE__Physics-eqns_v1.apkg', 'P', 'Physics equations'),
}


def spec_points():
    src = SPEC_JS.read_text(encoding='utf-8')
    data = json.loads(src[src.index('['):src.rindex(']') + 1])
    keys = set()
    for s in data:
        for t in s['topics']:
            for sb in t['subs']:
                if sb['name'] == 'Units':
                    continue
                for p in sb['points']:
                    keys.add(s['name'][0] + p['id'])
    return keys


def read_collection(apkg):
    z = zipfile.ZipFile(apkg)
    names = z.namelist()
    if 'collection.anki21b' in names:
        import zstandard
        raw = zstandard.ZstdDecompressor().decompressobj().decompress(z.read('collection.anki21b'))
    else:
        raw = z.read('collection.anki21' if 'collection.anki21' in names else 'collection.anki2')
    tmp = Path(tempfile.mkdtemp()) / 'c.db'
    tmp.write_bytes(raw)
    con = sqlite3.connect(str(tmp))
    rows = con.execute('SELECT cards.id, notes.flds FROM cards JOIN notes ON cards.nid = notes.id ORDER BY cards.id').fetchall()
    con.close()
    return rows


def _varint(b, i):
    n = sh = 0
    while True:
        x = b[i]; i += 1; n |= (x & 0x7f) << sh; sh += 7
        if x < 0x80:
            return n, i


def extract_media(apkg):
    """New-format decks: 'media' is a zstd protobuf list of entries {1: file name}; file k in the zip is entry k (zstd)."""
    z = zipfile.ZipFile(apkg)
    if 'collection.anki21b' not in z.namelist():
        return 0
    import zstandard
    dec = lambda b: zstandard.ZstdDecompressor().decompressobj().decompress(b)
    m, i, names = dec(z.read('media')), 0, []
    while i < len(m) and m[i] == 0x0a:
        ln, i = _varint(m, i + 1); ent, i = m[i:i + ln], i + ln
        j, name = 0, None
        while j < len(ent):
            t = ent[j]; j += 1
            if t & 7 == 2:
                l, j = _varint(ent, j)
                if t >> 3 == 1:
                    name = ent[j:j + l].decode('utf-8', 'replace')
                j += l
            elif t & 7 == 0:
                _, j = _varint(ent, j)
            else:
                break
        names.append(name)
    media, added = ROOT / 'Flashcards' / 'media', 0
    for k, name in enumerate(names):
        if name and not (media / name).exists() and str(k) in z.namelist():
            (media / name).write_bytes(dec(z.read(str(k)))); added += 1
    return added


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    points = spec_points()
    counts, report = {}, []
    index = {}
    for deck, (fname, L, name) in DECKS.items():
        cards, tagged = [], 0
        for cid, flds in read_collection(APKG_DIR / fname):
            f = flds.split('\x1f') + ['', '', '']
            raw = re.sub(r'<[^>]+>|&nbsp;', '', f[2]).strip()
            m = re.match(r'^(\d+)(?:\.(\d+))?', raw)
            topic = L + m.group(1) if m else None
            spec = f'{L}{int(m.group(1))}.{int(m.group(2))}' if m and m.group(2) else None
            if spec and spec not in points:
                spec = None
            if spec:
                tagged += 1
                counts[spec] = counts.get(spec, 0) + 1
            cards.append({'id': cid, 'front': f[0], 'back': f[1], 'spec': spec, 'topic': topic})
        extract_media(APKG_DIR / fname)
        (OUT_DIR / f'{deck}.json').write_text(json.dumps(cards, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
        index[deck] = {'name': name, 'subject': L, 'cards': len(cards)}
        report.append(f'{deck}: {len(cards)} cards, {tagged} tagged to a Double Award spec point')
    (OUT_DIR / 'index.json').write_text(json.dumps(index, indent=1), encoding='utf-8')
    COUNTS_JS.write_text('/* Flashcards per Double Award spec point. Generated by Flashcards/tools/apkg_to_json.py — do not edit by hand. */\n'
                         'const CARD_COUNTS = ' + json.dumps(dict(sorted(counts.items())), separators=(',', ':')) + ';\n', encoding='utf-8')
    print('\n'.join(report))
    print(f'{len(counts)} spec points have flashcards')


if __name__ == '__main__':
    main()
