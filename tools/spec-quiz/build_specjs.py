"""Clean the parsed spec JSON and write spec.js for the quiz.
Usage: python3 -I build_specjs.py spec.json out/spec.js"""
import json, re, sys

d = json.load(open(sys.argv[1], encoding="utf-8"))

HEADINGS = ["Flowering plants", "Humans", "Crop plants", "Micro-organisms"]
EQ = {
 "1.4": "average speed = distance moved ÷ time taken",
 "1.6": "acceleration = change in velocity ÷ time taken   a = (v − u) ÷ t",
 "1.10": "(final speed)² = (initial speed)² + (2 × acceleration × distance moved)   v² = u² + (2 × a × s)",
 "1.17": "force = mass × acceleration   F = m × a",
 "1.18": "weight = mass × gravitational field strength   W = m × g",
 "2.4": "power = current × voltage   P = I × V",
 "2.5": "energy transferred = current × voltage × time   E = I × V × t",
 "2.13": "voltage = current × resistance   V = I × R",
 "2.15": "charge = current × time   Q = I × t",
 "2.21": "energy transferred = charge × voltage   E = Q × V",
 "3.5": "wave speed = frequency × wavelength   v = f × λ",
 "3.6": "frequency = 1 ÷ time period   f = 1 ÷ T",
 "3.18": "n = sin i ÷ sin r",
 "3.22": "sin c = 1 ÷ n",
 "4.4": "efficiency = (useful energy output ÷ total energy output) × 100%",
 "4.11": "work done = force × distance moved   W = F × d",
 "4.13": "gravitational potential energy = mass × gravitational field strength × height   GPE = m × g × h",
 "4.14": "kinetic energy = ½ × mass × speed²   KE = ½ × m × v²",
 "4.17": "power = work done ÷ time taken   P = W ÷ t",
 "5.3": "density = mass ÷ volume   ρ = m ÷ V",
 "5.5": "pressure = force ÷ area   p = F ÷ A",
 "5.7": "pressure difference = height × density × gravitational field strength   p = h × ρ × g",
 "5.21": "p₁ ÷ T₁ = p₂ ÷ T₂",
 "5.22": "p₁V₁ = p₂V₂",
 "8.6": "orbital speed = (2 × π × orbital radius) ÷ time period   v = 2πr ÷ T",
}
TAIL = {"2.4": " and apply the relationship to the selection of appropriate fuses"}
UNITS_SUP = [("m/s2", "m/s²"), ("metre/second2", "metre/second²"), ("kilogram/metre3", "kilogram/metre³"), ("metre2 ", "metre² "), ("metre3 ", "metre³ "), ("(m2)", "(m²)"), ("(m3)", "(m³)"), ("CO32–", "CO₃²⁻"), ("SO42–", "SO₄²⁻"), ("NH4+", "NH₄⁺"), ("NO3-", "NO₃⁻"), ("Cu2+", "Cu²⁺"), ("Fe2+", "Fe²⁺"), ("Fe3+", "Fe³⁺"), ("Pb2+", "Pb²⁺"), ("Zn2+", "Zn²⁺"), ("Ca2+", "Ca²⁺"), ("Ag+", "Ag⁺"), ("(H+)", "(H⁺)"), ("(OH–)", "(OH⁻)"), ("Li+ ", "Li⁺ "), ("Na+ ", "Na⁺ "), ("K+ ", "K⁺ "), ("NH4+", "NH₄⁺"), ("Cl–,", "Cl⁻,"), ("Br– ", "Br⁻ "), ("I– ", "I⁻ "), ("SO42–", "SO₄²⁻"), ("CO32–", "CO₃²⁻"), ("(β−)", "(β⁻)"), ("14 6 C", "¹⁴₆C"), ("U-235", "U-235")]

FIXES = [("differentradioactive", "different radioactive"), ("includinggraphical", "including graphical"), ("thewithdrawal", "the withdrawal"), ("todifferences", "to differences"), ("thenext", "the next"), ("aregreenhouse", "are greenhouse"), ("onespecies", "one species"), ("andmetals", "and metals"), ("micro\u0002organisms", "micro-organisms"), ("Chlorofluorocarbons", "chlorofluorocarbons"), ("a simple molecular structures", "simple molecular structures")]
def clean(t):
    for a, b in FIXES:
        t = t.replace(a, b)
    t = re.sub(r"\s+\d{1,3}\s+Pearson Edexcel.*$", "", t)
    t = re.sub(r"\s+", " ", t).strip()
    for a, b in UNITS_SUP:
        t = t.replace(a, b)
    return t

out = []
for s in d:
    so = {"name": s["name"], "topics": []}
    for t in s["topics"]:
        to = {"n": t["n"], "name": t["name"], "subs": []}
        for sb in t["subs"]:
            sbo = {"l": sb["l"], "name": sb["name"], "points": []}
            heading = None
            for p in sb["points"]:
                text = clean(p["text"]); bullets = [clean(b) for b in p["bullets"]]
                next_heading = None
                for h in HEADINGS:
                    if text.endswith(" " + h):
                        text = text[: -len(h) - 1]; next_heading = h
                    if bullets and bullets[-1].endswith(" " + h):
                        bullets[-1] = bullets[-1][: -len(h) - 1]; next_heading = h
                    if bullets and bullets[-1] == h:
                        bullets.pop(); next_heading = h
                po = {"id": p["id"]}
                if s["name"] == "Physics" and p["id"] == "7.2":
                    text = "describe the structure of an atom in terms of protons, neutrons and electrons and use symbols such as ¹⁴₆C to describe particular nuclei"
                if s["name"] == "Chemistry" and p["id"] == "1.40":
                    text = text.replace(" only outer electrons", " (only outer electrons")+")"
                if s["name"] == "Chemistry" and p["id"] == "1.47":
                    text = text.replace(" the term ‘intermolecular’", " (the term ‘intermolecular’")+")"
                if s["name"] == "Physics" and p["id"] in EQ:
                    head = text.split(":")[0]
                    po["text"] = head + (TAIL.get(p["id"], ""))
                    po["eq"] = EQ[p["id"]]
                else:
                    # split long descriptive notes (biology 1.2–1.4) into text + detail
                    m = re.match(r"^(.*?)\s((?:Plants|Bacteria|Viruses):.*)$", text)
                    if m:
                        po["text"], po["detail"] = m.group(1), m.group(2)
                    else:
                        po["text"] = text
                if bullets:
                    po["bullets"] = bullets
                if heading:
                    po["h"] = heading
                heading = next_heading
                sbo["points"].append(po)
            to["subs"].append(sbo)
        so["topics"].append(to)
    out.append(so)

# Sub-topic headings that were captured before the first point of a sub-topic
FIRST_H = {("Biology", 2, "e"): "Flowering plants", ("Biology", 2, "g"): "Humans", ("Biology", 2, "i"): "Flowering plants", ("Biology", 5, "a"): "Crop plants"}
for s in out:
    for t in s["topics"]:
        for sb in t["subs"]:
            h = FIRST_H.get((s["name"], t["n"], sb["l"]))
            if h:
                sb["points"][0]["h"] = h
# 5.5 micro-organisms heading
for s in out:
    for t in s["topics"]:
        for sb in t["subs"]:
            for p in sb["points"]:
                if s["name"] == "Biology" and p["id"] == "5.5": p["h"] = "Micro-organisms"
                if s["name"] == "Biology" and p["id"] == "2.53": p["h"] = "Flowering plants"

js = ("/* Edexcel International GCSE Science (Double Award) specification, Issue 3 (Nov 2021): subject → topic → sub-topic → points.\n"
      "   Generated from the spec PDF by build_specjs.py. Point ids are e.g. 'P3.5' (subject letter + spec number). */\n"
      "const SPEC=" + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n")
open(sys.argv[2], "w", encoding="utf-8").write(js)
print(len(js), "bytes")
for s in out:
    for t in s["topics"]:
        for sb in t["subs"]:
            for p in sb["points"]:
                if "h" in p or "eq" in p or len(p["text"]) < 25 or "Pearson" in json.dumps(p):
                    print(s["name"][0], p["id"], p.get("h", ""), "|", p["text"][:90], "|", p.get("eq", ""))
