import json
import os
import sqlite3
import zipfile
from pathlib import Path

# Usage: python apkg_to_json.py
# Converts .apkg files in Flashcards/ANKI files/ to JSON in Flashcards/data/

ROOT = Path(__file__).resolve().parents[1]
APKG_DIR = ROOT / 'ANKI files'
OUT_DIR = ROOT / 'data'
OUT_DIR.mkdir(parents=True, exist_ok=True)

DECKS = {
    'biology': 'IGCSE__Biology_v2.apkg',
    'chemistry': 'IGCSE__Chemistry_v3.apkg',
    'physics': 'IGCSE__Physics_v1.apkg',
    'physics-eqns': 'IGCSE__Physics-eqns_v1.apkg',
}


def extract_collection(apkg_path: Path, work_dir: Path) -> Path:
    """Extract collection.anki2/collection.anki21 from the .apkg into work_dir and return path."""
    with zipfile.ZipFile(apkg_path, 'r') as z:
        name = None
        if 'collection.anki2' in z.namelist():
            name = 'collection.anki2'
        elif 'collection.anki21' in z.namelist():
            name = 'collection.anki21'
        else:
            raise FileNotFoundError('collection.anki2/collection.anki21 not found in apkg')
        out_path = work_dir / name
        with z.open(name) as src, open(out_path, 'wb') as dst:
            dst.write(src.read())
        return out_path


def read_cards_from_collection(collection_path: Path):
    conn = sqlite3.connect(str(collection_path))
    try:
        cur = conn.cursor()
        cur.execute(
            '''SELECT cards.id, notes.flds FROM cards JOIN notes ON cards.nid = notes.id'''
        )
        cards = []
        for card_id, flds in cur.fetchall():
            # Anki field separator is \x1f
            parts = flds.split('\x1f')
            front = parts[0] if parts else ''
            back = parts[1] if len(parts) > 1 else ''
            cards.append({
                'id': card_id,
                'front': front,
                'back': back,
            })
        return cards
    finally:
        conn.close()


def convert_all():
    tmp_dir = OUT_DIR / '_tmp'
    tmp_dir.mkdir(parents=True, exist_ok=True)
    for deck_id, filename in DECKS.items():
        apkg_path = APKG_DIR / filename
        if not apkg_path.exists():
            print(f'[WARN] Missing apkg: {apkg_path}')
            continue
        try:
            coll_path = extract_collection(apkg_path, tmp_dir)
            cards = read_cards_from_collection(coll_path)
            out_file = OUT_DIR / f'{deck_id}.json'
            with open(out_file, 'w', encoding='utf-8') as f:
                json.dump(cards, f, ensure_ascii=False, indent=2)
            print(f'[OK] {deck_id}: {len(cards)} cards -> {out_file}')
        except Exception as e:
            print(f'[ERROR] {deck_id}: {e}')
    # Clean up temp files
    for p in tmp_dir.glob('collection.anki*'):
        try:
            os.remove(p)
        except Exception:
            pass


if __name__ == '__main__':
    convert_all()
