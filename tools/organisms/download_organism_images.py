import json
import os
import re
import time
import urllib.parse
import urllib.request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "organisms_data.js")
OUTPUT_DIR = os.path.join(BASE_DIR, "images")
OUTPUT_JS = os.path.join(BASE_DIR, "organisms_images.js")

API_BASE = "https://api.inaturalist.org/v1/taxa"
LOCALE = "en-GB"
PREFERRED_PLACE_ID = "6857"


def read_section_organisms_js(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    start = content.find("const sectionOrganisms")
    if start == -1:
        raise RuntimeError("sectionOrganisms not found in organisms_data.js")

    start_brace = content.find("{", start)
    end = content.rfind("};")
    if start_brace == -1 or end == -1:
        raise RuntimeError("Unable to parse organisms_data.js")

    js_object = content[start_brace:end + 1]
    json_like = js_object
    # Quote object keys
    json_like = re.sub(r"([,{]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:", r'\1"\2":', json_like)
    # Convert single-quoted strings to double-quoted strings
    json_like = re.sub(r"'([^'\\]*(?:\\.[^'\\]*)*)'", r'"\1"', json_like)
    # Remove trailing commas before } or ]
    json_like = re.sub(r",\s*([}\]])", r"\1", json_like)
    return json.loads(json_like)


def fetch_taxon(scientific_name: str, retries: int = 2) -> dict | None:
    params = {
        "q": scientific_name,
        "per_page": "10",
        "locale": LOCALE,
        "preferred_place_id": PREFERRED_PLACE_ID,
        "rank": "subspecies,species,genus,order,class,phylum",
    }
    url = f"{API_BASE}?{urllib.parse.urlencode(params)}"
    last_error = None
    for attempt in range(retries + 1):
        try:
            with urllib.request.urlopen(url) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            break
        except Exception as exc:
            last_error = exc
            if attempt < retries:
                time.sleep(0.5)
            else:
                raise

    results = data.get("results", [])
    if not results:
        return None

    scientific_lower = scientific_name.lower()
    exact = next((t for t in results if t.get("name", "").lower() == scientific_lower and t.get("rank") in ("species", "subspecies")), None)
    species = next((t for t in results if t.get("rank") in ("species", "subspecies")), None)
    return exact or species or results[0]


def download_image(url: str, out_path: str) -> None:
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with urllib.request.urlopen(url) as resp:
        data = resp.read()
    with open(out_path, "wb") as f:
        f.write(data)


def write_image_map_file(image_map: dict) -> None:
    with open(OUTPUT_JS, "w", encoding="utf-8") as f:
        f.write("window.organismImages = ")
        f.write(json.dumps(image_map, indent=2))
        f.write(";\n")


def main():
    organisms = read_section_organisms_js(DATA_FILE)

    all_organisms = []
    for kingdom in ("animals", "plants", "fungi", "bacteria", "protoctists"):
        items = organisms.get(kingdom, [])
        for item in items:
            all_organisms.append((kingdom, item))

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    image_map = {}
    if os.path.exists(OUTPUT_JS):
        try:
            with open(OUTPUT_JS, "r", encoding="utf-8") as f:
                content = f.read()
                start = content.find("{")
                end = content.rfind("}")
                if start != -1 and end != -1:
                    image_map = json.loads(content[start:end + 1]) or {}
        except Exception:
            image_map = {}

    total = len(all_organisms)
    try:
        for idx, (kingdom, item) in enumerate(all_organisms, start=1):
            scientific = item.get("scientific")
            if not scientific:
                continue

            print(f"[{idx}/{total}] ({kingdom}) {scientific}")
            try:
                existing = image_map.get(scientific)
                if existing:
                    existing_path = os.path.join(OUTPUT_DIR, existing)
                    if os.path.exists(existing_path):
                        print("  Skip (already downloaded)")
                        continue

                taxon = fetch_taxon(scientific)
                if not taxon:
                    print(f"  No taxon found for {scientific}")
                    continue

                taxon_name = taxon.get("name", "").lower()
                if taxon_name != scientific.lower():
                    print(f"  Skip (mismatch): got {taxon.get('name')}")
                    continue

                photo = taxon.get("default_photo") or {}
                photo_url = photo.get("medium_url") or photo.get("url")
                if not photo_url:
                    print(f"  No photo for {scientific}")
                    continue

                ext = os.path.splitext(urllib.parse.urlparse(photo_url).path)[1].lower() or ".jpg"
                safe_name = scientific.lower().replace(" ", "_")
                file_name = f"{safe_name}{ext}"
                out_path = os.path.join(OUTPUT_DIR, file_name)

                download_image(photo_url, out_path)
                image_map[scientific] = file_name
                write_image_map_file(image_map)
                print(f"  Saved {file_name}")
            except Exception as exc:
                print(f"  Error: {exc}")

            time.sleep(0.2)
    except KeyboardInterrupt:
        write_image_map_file(image_map)
        print("\nStopped early. Progress saved to organisms_images.js")
        return

    write_image_map_file(image_map)

    print("Done. Wrote image map to organisms_images.js")


if __name__ == "__main__":
    main()
