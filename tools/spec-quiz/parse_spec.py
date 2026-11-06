"""Parse the Edexcel IGCSE Science (Double Award) spec text into a JSON tree.
Usage: python3 -I parse_spec.py spec.txt out.json"""
import re, sys, json

lines = [l.rstrip() for l in open(sys.argv[1], encoding="utf-8").read().replace("\f", "\n").split("\n")]

SKIP = re.compile(r"^(Pearson Edexcel International GCSE|Specification\s*[–-]\s*Issue|\d{1,3}$|Students should:?$|The following sub-topics|Specification points? .*$)")
subjects, subj, topic, sub, point = [], None, None, None, None
in_list = False
only_note = False

for raw in lines:
    l = re.sub(r"\s+", " ", raw.strip()) if not re.match(r"^(\d|\(?[a-z]\))", raw.strip()) else raw.strip()
    if not l:
        continue
    m = re.match(r"^(Biology|Chemistry|Physics) content$", l)
    if m:
        subj = {"name": m.group(1), "topics": []}; subjects.append(subj); topic = sub = point = None; continue
    if subj is None:
        continue
    # "Specification points ... only." notes can wrap onto the next line
    if only_note:
        if l.endswith("only.") or "only." in l:
            only_note = False
        continue
    if re.match(r"^Specification points? ", l):
        only_note = not l.endswith("only.")
        point = None
        continue
    if SKIP.match(l):
        if l.startswith("The following sub-topics"):
            in_list = True
        point = None if not l.startswith("Students") else point
        continue
    m = re.match(r"^(\d)\s+([A-Z][A-Za-z ,()'’-]+)$", l)
    if m and (not topic or int(m.group(1)) == len(subj["topics"]) + 1):
        topic = {"n": int(m.group(1)), "name": m.group(2), "subs": []}; subj["topics"].append(topic); sub = point = None; continue
    m = re.match(r"^\(?([a-z])\)\s+(.+)$", l)
    if m and topic:
        letter, name = m.group(1), m.group(2).strip()
        existing = [s for s in topic["subs"] if s["l"] == letter]
        if existing:
            sub = existing[0]; in_list = False
        else:
            sub = {"l": letter, "name": name, "points": []}; topic["subs"].append(sub)
        point = None; continue
    m = re.match(r"^(\d\.\d+)\s+(.*)$", l)
    if m and sub is not None:
        point = {"id": m.group(1), "text": m.group(2), "bullets": []}; sub["points"].append(point); continue
    if point is None:
        # free headings inside a sub-topic like "Flowering plants", "Humans", "Crop plants"
        if sub is not None and re.match(r"^[A-Z][a-z -]+$", l) and len(l) < 30:
            sub.setdefault("pending_heading", l)
        continue
    if l.startswith("•"):
        point["bullets"].append(l.lstrip("• ").strip())
    elif point["bullets"]:
        point["bullets"][-1] += " " + l
    else:
        point["text"] += " " + l

json.dump(subjects, open(sys.argv[2], "w"), indent=1, ensure_ascii=False)
for s in subjects:
    print(s["name"], sum(len(sb["points"]) for t in s["topics"] for sb in t["subs"]))
    for t in s["topics"]:
        print("  ", t["n"], t["name"], [ (sb["l"], sb["name"], len(sb["points"])) for sb in t["subs"]])
