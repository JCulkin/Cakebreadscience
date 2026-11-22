/* The Adventurer: every item, shared by the creator, wardrobe, map, Cakelab, Stats and showcase pages (9 Nov 2026).
   Jokes live here so they can be swapped each term. Pictures: adventurer-pixel.js (same ids).
   22 Nov 2026 (user: "Most should actually boost your character… Some should also do unique things like extra moves or
   boosting teammates more. Hand items should be either hand. Some more powerful ones double hand… Combine the commonality
   and level requirements into one tag… a boost from having all the same science gear on… Your character glows a colour."):
   - slot: head | top | bottom | shoes | hand. Hand items go in either hand (side = the hand they're drawn in, r = viewer's
     left; the other hand gets a mirror image); two: 1 = needs both hands. Worn gear lives in eq {head, top, bottom, shoes,
     rhand, lhand}; a two-handed item sits in both hand slots.
   - r = rarity, lv = the level you need to wear it (hats 3+, things to hold 5+, legendaries 8: same as the unlocks), s = science
     (b/c/p) for science sets, str/hp/mag = Strength/Health/Magic it adds, fx = what else it does (ADV_FX below; used by the
     map page and, through pub/{uid}.fx, by the midnight boss fights in bland.js), dark = can come from cursed chests.
   - Stat budget (Claude's numbers): common 1, uncommon 2, rare 3, lowkey legendary 4, absolutely unhinged 5, legendary 6
     points; a two-handed item twice that; an fx costs about 1 point. Revision rewards (XP, securing) are never touched by gear.
   - Science set: at least 4 slots filled and every worn item from one science → +15% of that science's stat (at least +3),
     a small extra (ADV_SETS) and the figure glows the science's colour (adventurer-pixel.js).
   - The old joke stats (aura, brain cells, vibes) are gone. */
const ADV_ITEMS = [
  {"id": "paperhat", "slot": "head", "name": "Paper Hat", "r": "common", "lv": 3, "mag": 1, "from": "Starter outfit", "d": "Folded from a revision timetable. Still more organised than you."},
  {"id": "avogadro", "slot": "head", "name": "Hat of Avogadro", "r": "rare", "s": "c", "lv": 5, "mag": 3, "from": "Silver and golden chests", "d": "Contains 6.02 × 10²³ smaller hats."},
  {"id": "nocap", "slot": "head", "name": "No-Cap Cap", "r": "uncommon", "lv": 3, "str": 1, "hp": 1, "from": "Missions, flashcards and wooden chests", "d": "Physically unable to lie. Useless at true/false anyway."},
  {"id": "delulu", "slot": "head", "name": "Delulu Goggles", "r": "lowkey", "lv": 7, "str": 2, "mag": 1, "fx": {"monster": 25}, "from": "Golden chests", "d": "You see the answer you wanted. Small monsters see someone who really believes in themselves."},
  {"id": "halo", "slot": "head", "name": "Halo of Main Character Energy", "r": "unhinged", "lv": 9, "str": 2, "hp": 1, "mag": 1, "fx": {"rally": 15}, "from": "Golden chests (very rarely)", "d": "The camera follows you now. Background characters whisper."},
  {"id": "jumper", "slot": "top", "name": "School Jumper", "r": "common", "lv": 1, "hp": 1, "from": "Starter outfit", "d": "Name label says someone else's name. You've never asked."},
  {"id": "labcoat", "slot": "top", "name": "Lab Coat With One Mystery Stain", "r": "uncommon", "s": "c", "lv": 1, "mag": 1, "hp": 1, "from": "Missions, flashcards and wooden chests", "d": "Nobody knows. Nobody asks."},
  {"id": "npc", "slot": "top", "name": "NPC T-Shirt", "r": "uncommon", "lv": 2, "hp": 2, "from": "Missions, flashcards and wooden chests", "d": "Says “Greetings, traveller” when poked."},
  {"id": "chainmail", "slot": "top", "name": "Chainmail of Covalent Bonds", "r": "rare", "s": "c", "lv": 4, "hp": 2, "fx": {"armour": 15}, "from": "Chemistry 1 · Gold", "d": "Shares electrons, not snacks."},
  {"id": "joggers", "slot": "bottom", "name": "Grey Joggers", "r": "common", "lv": 1, "str": 1, "from": "Starter outfit", "d": "Comfortable. Shapeless. Honest."},
  {"id": "inertia", "slot": "bottom", "name": "Trousers of Moderate Inertia", "r": "uncommon", "s": "p", "lv": 1, "str": 2, "from": "Missions, flashcards and wooden chests", "d": "Hard to get going. Hard to stop."},
  {"id": "kilt", "slot": "bottom", "name": "Kilt of Kinetic Energy", "r": "rare", "s": "p", "lv": 4, "str": 2, "hp": 1, "from": "Physics 4 · Gold", "d": "½mv² of pure swish."},
  {"id": "oddsocks", "slot": "shoes", "name": "Odd Socks", "r": "common", "lv": 1, "hp": 1, "from": "Starter outfit", "d": "One is red. One is a different red. Both are damp."},
  {"id": "brownian", "slot": "shoes", "name": "Socks of Brownian Motion", "r": "uncommon", "s": "p", "lv": 2, "str": 1, "hp": 1, "from": "Missions, flashcards and wooden chests", "d": "Random, jittery, never a matching pair."},
  {"id": "grass", "slot": "shoes", "name": "Touch-Grass Boots", "r": "rare", "s": "b", "lv": 4, "hp": 3, "from": "Biology 4 · Silver", "d": "Grass grows wherever you step. You were warned."},
  {"id": "frictionless", "slot": "shoes", "name": "Frictionless Slippers", "r": "lowkey", "s": "p", "lv": 7, "str": 1, "fx": {"move": 1}, "from": "Physics 1 · Gold", "d": "Stopping distance: yes."},
  {"id": "crisps", "slot": "hand", "side": "l", "name": "Empty Crisp Packet", "r": "common", "lv": 5, "hp": 1, "from": "Starter outfit", "d": "Rustles menacingly. Contains air and regret."},
  {"id": "shield", "slot": "hand", "side": "l", "name": "Periodic Table Shield", "r": "rare", "s": "c", "lv": 6, "hp": 1, "mag": 1, "fx": {"guard": 20}, "from": "Chemistry 2 · Silver", "d": "The noble gases refuse to get involved."},
  {"id": "clipboard", "slot": "hand", "side": "l", "name": "Clipboard of Authority", "r": "uncommon", "lv": 5, "str": 1, "fx": {"rally": 10}, "from": "Missions, flashcards and wooden chests", "d": "Nobody questions someone with a clipboard."},
  {"id": "ruler", "slot": "hand", "side": "r", "name": "Slightly Bent Ruler", "r": "common", "lv": 5, "str": 1, "from": "Starter outfit", "d": "30 cm of pure intimidation. Well, 29.4 cm."},
  {"id": "glove", "slot": "hand", "side": "r", "name": "Newton's Third Glove", "r": "rare", "s": "p", "lv": 6, "str": 2, "fx": {"boss": 15}, "from": "Silver and golden chests", "d": "Every slap gets an equal and opposite slap."},
  {"id": "mito", "slot": "hand", "side": "r", "name": "Mitochondria Gauntlet", "r": "lowkey", "s": "b", "lv": 8, "str": 3, "hp": 1, "from": "Biology 2 · Gold", "d": "The powerhouse of the hand."},
  {"id": "pipette", "slot": "hand", "side": "r", "name": "Pipette of Precise Disappointment", "r": "uncommon", "s": "c", "lv": 5, "mag": 2, "from": "Missions, flashcards and wooden chests", "d": "Delivers exactly 25.0 cm³ of sadness."},
  {"id": "calc67", "slot": "hand", "side": "r", "name": "The 6-7 Calculator", "r": "unhinged", "lv": 5, "str": 6, "fx": {"boss": 7}, "from": "Missions (1 in 67)", "d": "Answers every question with “six… seven…”. +6 Strength, +7% boss damage. Obviously."},
  {"id": "tiara", "slot": "head", "name": "Tiara of Noble Gases", "r": "rare", "s": "c", "lv": 5, "mag": 2, "hp": 1, "from": "Silver and golden chests", "d": "Refuses to react to anything you say. Glows a bit when you pass a current through it."},
  {"id": "plague", "slot": "head", "name": "Plague Doctor Mask", "r": "lowkey", "s": "b", "lv": 7, "hp": 3, "fx": {"armour": 10}, "from": "Cursed chests (Underworld) and golden chests", "d": "Germ theory, but make it gothic. Still wash your hands.", "dark": 1},
  {"id": "cone", "slot": "head", "name": "Traffic Cone of Safety", "r": "common", "lv": 4, "fx": {"critter": 1}, "from": "Missions, flashcards and wooden chests", "d": "Health and safety approved. Nobody else is."},
  {"id": "toastcrown", "slot": "head", "name": "Crown of Slightly Burnt Toast", "r": "uncommon", "lv": 3, "hp": 2, "from": "Missions, flashcards and wooden chests", "d": "Heavy is the head that wears the crust."},
  {"id": "horns", "slot": "head", "name": "Tiny Horns of Mild Mischief", "r": "uncommon", "lv": 4, "str": 2, "from": "Cursed chests (Underworld) and golden chests", "d": "Didn't do the reading. Did, somehow, do the reading of everyone else's.", "dark": 1},
  {"id": "unicorn", "slot": "head", "name": "Unicorn Horn of Dispersion", "r": "rare", "s": "p", "lv": 5, "str": 2, "mag": 1, "from": "Silver and golden chests", "d": "Splits white light into a rainbow, and every group chat into drama."},
  {"id": "tinfoil", "slot": "head", "name": "Tinfoil Hat (Faraday Edition)", "r": "uncommon", "s": "p", "lv": 3, "str": 1, "mag": 1, "from": "Missions, flashcards and wooden chests", "d": "Blocks Wi-Fi, 5G and the homework group chat. Mostly the homework group chat."},
  {"id": "beanie", "slot": "head", "name": "Beanie of Thermal Insulation", "r": "common", "s": "p", "lv": 3, "hp": 1, "from": "Missions, flashcards and wooden chests", "d": "Cuts heat loss by conduction, convection and eye contact."},
  {"id": "crow", "slot": "head", "name": "A Crow That Lives on Your Head", "r": "rare", "lv": 6, "str": 1, "hp": 1, "fx": {"sight": 1}, "from": "Cursed chests (Underworld) and golden chests", "d": "It has opinions. They are mostly about shiny things, and you.", "dark": 1},
  {"id": "flowercrown", "slot": "head", "name": "Flower Crown of Pollination", "r": "uncommon", "s": "b", "lv": 3, "hp": 2, "from": "Missions, flashcards and wooden chests", "d": "Bees now treat you as a meeting point. Please don't swat the colleagues."},
  {"id": "ballgown", "slot": "top", "name": "Ballgown of Bioluminescence", "r": "rare", "s": "b", "lv": 4, "hp": 2, "mag": 1, "from": "Silver and golden chests", "d": "Glows in the dark, like a jellyfish that got invited to the ball."},
  {"id": "cape", "slot": "top", "name": "Cape of Inevitable Entropy", "r": "lowkey", "s": "p", "lv": 7, "str": 3, "mag": 1, "from": "Cursed chests (Underworld) and golden chests", "d": "Everything gets messier in the end. Starting with your bag.", "dark": 1},
  {"id": "hoodie", "slot": "top", "name": "Hoodie of Doing It Tomorrow", "r": "common", "lv": 1, "hp": 1, "from": "Missions, flashcards and wooden chests", "d": "Pocket contains: one unfinished worksheet, one (1) grape."},
  {"id": "paperarmour", "slot": "top", "name": "Armour of Alpha Shielding", "r": "uncommon", "s": "p", "lv": 2, "hp": 1, "fx": {"armour": 10}, "from": "Missions, flashcards and wooden chests", "d": "A single sheet of A4. Stops every alpha particle going. Stops nothing else at all."},
  {"id": "hivis", "slot": "top", "name": "Hi-Vis Vest of Fire Drills", "r": "common", "lv": 1, "hp": 1, "from": "Missions, flashcards and wooden chests", "d": "Gives you the authority to say “walk, don't run”."},
  {"id": "skeleton", "slot": "top", "name": "Skeleton Onesie", "r": "uncommon", "s": "b", "lv": 3, "str": 1, "hp": 1, "from": "Cursed chests (Underworld) and golden chests", "d": "Every bone printed on. Anatomically: generous.", "dark": 1},
  {"id": "puffer", "slot": "top", "name": "Puffer Jacket of Osmosis", "r": "uncommon", "s": "b", "lv": 2, "hp": 2, "from": "Missions, flashcards and wooden chests", "d": "Swells up whenever there's more water outside than in."},
  {"id": "sequin", "slot": "top", "name": "Sequin Jacket of Total Internal Reflection", "r": "rare", "s": "p", "lv": 5, "str": 2, "mag": 1, "from": "Silver and golden chests", "d": "Light gets in. Light does not get out. Neither, on a good night, do you."},
  {"id": "breadplate", "slot": "top", "name": "Breadplate Armour", "r": "uncommon", "lv": 3, "hp": 1, "fx": {"guard": 15}, "from": "Missions, flashcards and wooden chests", "d": "Crusty on the outside, soft on the inside. Some say it's a metaphor."},
  {"id": "tutu", "slot": "bottom", "name": "Tutu of Elastic Potential", "r": "uncommon", "s": "p", "lv": 2, "str": 1, "mag": 1, "from": "Missions, flashcards and wooden chests", "d": "Store energy. Twirl. Release energy. Repeat until dizzy."},
  {"id": "void", "slot": "bottom", "name": "Trousers of the Void", "r": "lowkey", "lv": 7, "str": 1, "hp": 1, "mag": 2, "from": "Cursed chests (Underworld) and golden chests", "d": "The pockets go on forever. Your phone is in there somewhere. So is a lost Year 9.", "dark": 1},
  {"id": "pyjamas", "slot": "bottom", "name": "Exam Season Pyjamas", "r": "common", "lv": 1, "fx": {"rest": 3}, "from": "Missions, flashcards and wooden chests", "d": "Worn for 72 hours straight. Do not ask. Do not sniff."},
  {"id": "jeans", "slot": "bottom", "name": "Jeans with a Pointless Tiny Pocket", "r": "common", "lv": 1, "str": 1, "from": "Missions, flashcards and wooden chests", "d": "The tiny pocket holds one (1) atom of hope."},
  {"id": "fossilshorts", "slot": "bottom", "name": "Fossil Record Shorts", "r": "uncommon", "s": "b", "lv": 2, "hp": 2, "from": "Missions, flashcards and wooden chests", "d": "Older than the jokes in this game. Only just."},
  {"id": "mermaid", "slot": "bottom", "name": "Mermaid Tail of Upthrust", "r": "rare", "s": "p", "lv": 5, "hp": 2, "str": 1, "from": "Silver and golden chests", "d": "Upthrust: yes. Walking: debatable. Shoes: somehow still on."},
  {"id": "cargo", "slot": "bottom", "name": "Cargo Shorts of Infinite Snacks", "r": "uncommon", "lv": 3, "fx": {"coins": 25}, "from": "Missions, flashcards and wooden chests", "d": "Eleven pockets. Every one of them has a biscuit in it. Nobody knows how."},
  {"id": "glassslip", "slot": "shoes", "name": "Glass Slippers of Refraction", "r": "rare", "s": "p", "lv": 5, "mag": 2, "str": 1, "from": "Silver and golden chests", "d": "Bend light, bend rules, leave one behind at the ball."},
  {"id": "doomboots", "slot": "shoes", "name": "Steel-Toe Boots of Impending Doom", "r": "uncommon", "lv": 3, "str": 2, "from": "Cursed chests (Underworld) and golden chests", "d": "Every step sounds like a minor key.", "dark": 1},
  {"id": "crocs", "slot": "shoes", "name": "Crocs in Sport Mode", "r": "common", "lv": 1, "str": 1, "from": "Missions, flashcards and wooden chests", "d": "Sport mode is the strap. Respect the strap."},
  {"id": "rollers", "slot": "shoes", "name": "Roller Skates of Constant Velocity", "r": "uncommon", "s": "p", "lv": 3, "str": 1, "fx": {"revise": 1}, "from": "Missions, flashcards and wooden chests", "d": "No resultant force, so no change in speed. Also no brakes."},
  {"id": "bunny", "slot": "shoes", "name": "Bunny Slippers of Comfort", "r": "common", "lv": 1, "hp": 1, "from": "Missions, flashcards and wooden chests", "d": "They judge you quietly. Both of them."},
  {"id": "magmaboots", "slot": "shoes", "name": "Magma Boots", "r": "lowkey", "s": "p", "lv": 8, "str": 3, "fx": {"monster": 25}, "from": "Cursed chests (Underworld) and golden chests", "d": "Leave little puddles of lava wherever you go. Caretakers have noticed.", "dark": 1},
  {"id": "springs", "slot": "shoes", "name": "Spring-Loaded Trainers", "r": "rare", "s": "p", "lv": 5, "str": 2, "hp": 1, "from": "Silver and golden chests", "d": "Extension is proportional to force. Up to the limit of proportionality. Then the ceiling."},
  {"id": "baguette", "slot": "hand", "side": "r", "two": 1, "name": "Baguette of Destiny", "r": "rare", "lv": 6, "str": 3, "hp": 2, "fx": {"boss": 10}, "from": "Silver and golden chests", "d": "A two-handed sword, technically. Goes stale at midnight."},
  {"id": "wand", "slot": "hand", "side": "r", "name": "Wand of Catalysis", "r": "rare", "s": "c", "lv": 6, "mag": 2, "fx": {"spell": 1}, "from": "Silver and golden chests", "d": "Speeds up any reaction and is never used up. Still not allowed in the exam hall."},
  {"id": "scythe", "slot": "hand", "side": "r", "two": 1, "name": "Scythe of Half-Lives", "r": "lowkey", "s": "p", "lv": 8, "str": 5, "mag": 2, "fx": {"monster": 25}, "from": "Cursed chests (Underworld) and golden chests", "d": "Takes exactly half of whatever's left. Every time. Forever.", "dark": 1},
  {"id": "duck", "slot": "hand", "side": "r", "name": "Rubber Duck of Explaining Things", "r": "common", "lv": 5, "mag": 1, "from": "Missions, flashcards and wooden chests", "d": "Explain your answer to the duck. The duck knows."},
  {"id": "magnifier", "slot": "hand", "side": "r", "name": "Magnifying Glass of Overthinking", "r": "uncommon", "lv": 5, "mag": 1, "fx": {"mimic": 1}, "from": "Missions, flashcards and wooden chests", "d": "Makes small problems look enormous. Also spots the teeth on a mimic before it spots you."},
  {"id": "bunsen", "slot": "hand", "side": "r", "name": "Bunsen Burner (Safety Flame)", "r": "uncommon", "s": "c", "lv": 5, "str": 1, "mag": 1, "from": "Missions, flashcards and wooden chests", "d": "Yellow, wobbly and easy to see. Like you in the school photo."},
  {"id": "lollipop", "slot": "hand", "side": "r", "name": "Giant Lollipop of Diffusion", "r": "uncommon", "s": "b", "lv": 5, "hp": 2, "from": "Missions, flashcards and wooden chests", "d": "The flavour moves from where there's lots to where there's little. Your tongue."},
  {"id": "mirror", "slot": "hand", "side": "l", "name": "Hand Mirror of Plane Reflection", "r": "uncommon", "s": "p", "lv": 5, "mag": 1, "str": 1, "from": "Missions, flashcards and wooden chests", "d": "Image: virtual, upright, the same size, fabulous."},
  {"id": "skulllamp", "slot": "hand", "side": "l", "name": "Skull Lantern of Mild Dread", "r": "rare", "s": "p", "lv": 6, "str": 1, "mag": 1, "fx": {"sight": 1}, "from": "Cursed chests (Underworld) and golden chests", "d": "Transfers energy by light, a little heat and a vague sense of dread.", "dark": 1},
  {"id": "teddy", "slot": "hand", "side": "l", "name": "Teddy (Slightly Haunted)", "r": "uncommon", "lv": 5, "hp": 1, "fx": {"heal": 3}, "from": "Cursed chests (Underworld) and golden chests", "d": "It was on the shelf. Now it's in your hand. You didn't pick it up.", "dark": 1},
  {"id": "phone1", "slot": "hand", "side": "l", "name": "Phone on 1%", "r": "common", "lv": 5, "mag": 1, "from": "Missions, flashcards and wooden chests", "d": "Stores just enough energy for one more panic."},
  {"id": "flask", "slot": "hand", "side": "l", "name": "Conical Flask of Something Purple", "r": "uncommon", "s": "c", "lv": 5, "mag": 2, "from": "Missions, flashcards and wooden chests", "d": "It's probably fine. It's probably fine. It's probably fine."},
  {"id": "cupcake", "slot": "hand", "side": "l", "name": "Emergency Cupcake", "r": "common", "lv": 5, "fx": {"heal": 2}, "from": "Missions, flashcards and wooden chests", "d": "For emergencies. Every moment is an emergency."},
  {"id": "chicken", "slot": "hand", "side": "l", "name": "The Rubber Chicken of Doom", "r": "unhinged", "lv": 9, "str": 2, "hp": 1, "mag": 1, "fx": {"boss": 20}, "from": "Golden chests (very rarely)", "d": "Squeaks in a minor key. Bosses take it personally."},
  {"id": "syringe", "slot": "hand", "side": "r", "name": "Syringe of Plot Armour", "r": "legend", "s": "b", "lv": 8, "hp": 4, "str": 1, "fx": {"heal": 5}, "from": "Most correct Biology answers in the last 7 days", "d": "You cannot be written out of this storyline.", "legend": "Biology"},
  {"id": "pebble", "slot": "hand", "side": "l", "name": "The Philosopher's Pebble", "r": "legend", "s": "c", "lv": 8, "mag": 4, "hp": 1, "fx": {"spell": 1}, "from": "Most correct Chemistry answers in the last 7 days", "d": "Turns lead into slightly shinier lead.", "legend": "Chemistry"},
  {"id": "dodgeball", "slot": "hand", "side": "l", "name": "Definitely-Not-Uranium Dodgeball", "r": "legend", "s": "p", "lv": 8, "str": 5, "fx": {"boss": 15}, "from": "Most correct Physics answers in the last 7 days", "d": "Half-life: one PE lesson.", "legend": "Physics"},
  {"id": "leafhat", "slot": "head", "name": "Leaf Hat of Photosynthesis", "r": "common", "s": "b", "lv": 3, "hp": 1, "from": "Missions, flashcards and wooden chests", "d": "Makes glucose in sunny weather. Turns brown and sad in the canteen."},
  {"id": "goggles", "slot": "head", "name": "Safety Goggles (Worn Correctly)", "r": "common", "s": "c", "lv": 3, "mag": 1, "from": "Missions, flashcards and wooden chests", "d": "On your eyes, not on your forehead. Legendary behaviour."},
  {"id": "apron", "slot": "top", "name": "Apron of Spilled Titrations", "r": "common", "s": "c", "lv": 1, "mag": 1, "from": "Missions, flashcards and wooden chests", "d": "Each stain is a slightly different shade of pink. One drop too many, every time."},
  {"id": "genes", "slot": "bottom", "name": "Designer Genes", "r": "common", "s": "b", "lv": 1, "hp": 1, "from": "Missions, flashcards and wooden chests", "d": "Inherited from your parents. Half from each, somehow, and they still don't fit."},
  {"id": "phleggings", "slot": "bottom", "name": "pH Scale Leggings", "r": "common", "s": "c", "lv": 1, "mag": 1, "from": "Missions, flashcards and wooden chests", "d": "Red at the ankles, purple at the top. Neutral, at best, in the middle."},
  {"id": "distill", "slot": "bottom", "name": "Trousers of Fractional Distillation", "r": "uncommon", "s": "c", "lv": 3, "mag": 1, "hp": 1, "from": "Missions, flashcards and wooden chests", "d": "Lightest fractions at the top, sticky bitumen at the bottom. Do not sit near a Bunsen."},
  {"id": "wellies", "slot": "shoes", "name": "Pollen-Dusted Wellies", "r": "common", "s": "b", "lv": 1, "hp": 1, "from": "Missions, flashcards and wooden chests", "d": "Every step leaves a little yellow cloud. Hay fever sufferers have filed a complaint."},
  {"id": "roothair", "slot": "shoes", "name": "Root Hair Slippers", "r": "uncommon", "s": "b", "lv": 2, "hp": 1, "str": 1, "from": "Missions, flashcards and wooden chests", "d": "A huge surface area for absorbing water. Mostly from puddles."},
  {"id": "galvboots", "slot": "shoes", "name": "Galvanised Boots", "r": "uncommon", "s": "c", "lv": 2, "mag": 1, "fx": {"armour": 10}, "from": "Missions, flashcards and wooden chests", "d": "A coat of zinc keeps the rust away. And the puddles. And, so far, the critters."},
  {"id": "crystalshoes", "slot": "shoes", "name": "Crystallisation Heels", "r": "rare", "s": "c", "lv": 4, "mag": 2, "hp": 1, "from": "Silver and golden chests", "d": "Grown slowly from a saturated solution. Do not leave them on a warm radiator."},
  {"id": "stethoscope", "slot": "hand", "side": "l", "name": "Stethoscope of Heart Sounds", "r": "uncommon", "s": "b", "lv": 5, "hp": 1, "fx": {"heal": 3}, "from": "Missions, flashcards and wooden chests", "d": "Lub-dub. Lub-dub. That's the valves closing, not your nerves. Probably."},
  {"id": "umbrella", "slot": "hand", "side": "r", "name": "Umbrella of Mild Protection", "r": "uncommon", "lv": 5, "hp": 1, "fx": {"guard": 15}, "from": "Missions, flashcards and wooden chests", "d": "Big enough for two. Three if one of you is the crow."},
  {"id": "folder", "slot": "hand", "side": "l", "name": "Revision Folder (Colour-Coded)", "r": "uncommon", "lv": 5, "hp": 1, "fx": {"armour": 10}, "from": "Missions, flashcards and wooden chests", "d": "Every tab a different colour. Mostly used as a shield."},
  {"id": "megaphone", "slot": "hand", "side": "r", "name": "Megaphone of Mild Encouragement", "r": "rare", "lv": 7, "str": 1, "hp": 1, "fx": {"rally": 15}, "from": "Silver and golden chests", "d": "“YOU'RE DOING GREAT, SWEETIE.” Bosses find it extremely annoying."},
  {"id": "net", "slot": "hand", "side": "r", "two": 1, "name": "Butterfly Net of Random Sampling", "r": "rare", "s": "b", "lv": 6, "hp": 3, "str": 2, "fx": {"monster": 25}, "from": "Silver and golden chests", "d": "Throw it anywhere, count what you catch, multiply up. Works on small monsters too."},
  {"id": "burette", "slot": "hand", "side": "r", "two": 1, "name": "Burette of Infinite Patience", "r": "rare", "s": "c", "lv": 6, "mag": 4, "hp": 2, "from": "Silver and golden chests", "d": "Drop… by… drop… until the colour changes. Then one more. It's always one more."},
  {"id": "magnet", "slot": "hand", "side": "r", "two": 1, "name": "Horseshoe Magnet of Attraction", "r": "rare", "s": "p", "lv": 6, "str": 3, "mag": 1, "fx": {"coins": 25}, "from": "Silver and golden chests", "d": "Pulls loose coins out of the ground. Only the iron ones, so mostly bottle caps."},
  {"id": "slinky", "slot": "hand", "side": "r", "two": 1, "name": "Slinky of Longitudinal Waves", "r": "uncommon", "s": "p", "lv": 5, "str": 2, "mag": 2, "from": "Missions, flashcards and wooden chests", "d": "Compressions, rarefactions and, eventually, a hopeless knot."},
  {"id": "trophy", "slot": "hand", "side": "r", "two": 1, "name": "Participation Trophy (Huge)", "r": "lowkey", "lv": 8, "str": 3, "hp": 2, "mag": 2, "fx": {"rally": 10}, "from": "Golden chests", "d": "Everyone gets one. Everyone fighting beside you hits a bit harder, out of pure validation."}
];
const ADV_RARITY = {common:'Common', uncommon:'Uncommon', rare:'Rare', lowkey:'Lowkey Legendary', unhinged:'Absolutely Unhinged', legend:'Legendary'};
const ADV_SLOTS = [{k:'head',name:'Head'},{k:'top',name:'Top'},{k:'bottom',name:'Bottom'},{k:'shoes',name:'Shoes'},{k:'rhand',name:'Right hand'},{k:'lhand',name:'Left hand'}];
const ADV_GROUPS = [{k:'head',name:'Head'},{k:'top',name:'Tops'},{k:'bottom',name:'Bottoms'},{k:'shoes',name:'Shoes'},{k:'hand',name:'Things to hold'}];

const ADV_BY = Object.fromEntries(ADV_ITEMS.map(i => [i.id, i]));
/* what an item's fx does (numbers in the item) */
const ADV_FX = {
  move: () => '+1 move every night on Breadventure Land',
  revise: () => '+1 extra move for your first revision of the day',
  rally: n => `Everyone fighting a boss beside you does +${n}% damage`,
  guard: n => `Everyone camped at a boss with you takes ${n}% less damage`,
  armour: n => `You take ${n}% less damage`,
  boss: n => `+${n}% damage to bosses`,
  monster: n => `+${n}% damage to small monsters`,
  coins: n => `+${n}% coins from monsters, chests, dungeons and the puddle`,
  rest: n => `Resting in the Cakelab heals +${n} more`,
  spell: n => `Spells cost ${n} less mana`,
  heal: n => `Patch Up heals +${n} more, for you or a friend`,
  mimic: () => 'You can spot a mimic before you open it',
  critter: () => 'Wild critters leave you alone',
  sight: () => 'You see 1 square further through the fog',
};
const ADV_FXCAP = { move: 1, revise: 1, armour: 50, guard: 50, boss: 60, monster: 60, coins: 100, spell: 2, mimic: 1, critter: 1, sight: 1 };
/* full science sets: 4+ slots filled, all from one science */
const ADV_SETS = {
  b: { name: 'Biology', col: '#22c55e', stat: 'hp', fx: { rest: 3 }, title: 'Certified Plant Whisperer' },
  c: { name: 'Chemistry', col: '#ef4444', stat: 'mag', fx: { spell: 1 }, title: 'Certified Lab Gremlin' },
  p: { name: 'Physics', col: '#f59e0b', stat: 'str', fx: { boss: 10 }, title: 'Certified Gravity Enjoyer' },
};
const ADV_STAT = { str: ['💪', 'Strength'], hp: ['❤', 'Health'], mag: ['✨', 'Magic'] };
const ADV_HANDS = ['rhand', 'lhand'];
/* can item i go in slot k? */
const ADV_FITS = (i, k) => !!i && (i.slot === k || (i.slot === 'hand' && ADV_HANDS.includes(k)));
/* wear item i (in hand slot k if given) → a new eq. A two-handed item fills both hands; one item can't be in both. */
function ADV_PUT(eq, i, k) {
  eq = Object.assign({}, eq || {});
  if (i.slot !== 'hand') { eq[i.slot] = i.id; return eq; }
  if (i.two) { eq.rhand = eq.lhand = i.id; return eq; }
  k = ADV_HANDS.includes(k) ? k : i.side === 'l' ? 'lhand' : 'rhand';
  const o = k === 'rhand' ? 'lhand' : 'rhand', two = id => id && ADV_BY[id] && ADV_BY[id].two;
  if (eq[o] === i.id || (two(eq[k]) && eq[o] === eq[k])) eq[o] = null;
  eq[k] = i.id; return eq;
}
function ADV_OFF(eq, k) { eq = Object.assign({}, eq || {}); const i = ADV_BY[eq[k]]; if (i && i.two) eq.rhand = eq.lhand = null; else eq[k] = null; return eq; }
/* everything the worn gear adds: {str, hp, mag, fx, set (b/c/p or null), slots (filled)} — set bonus % is added in ADV.stats() */
function ADV_GEAR(eq) {
  const g = { str: 0, hp: 0, mag: 0, fx: {}, set: null, slots: 0 }, seen = new Set(), sci = new Set();
  Object.entries(eq || {}).forEach(([k, id]) => { const i = ADV_BY[id]; if (!i || !ADV_FITS(i, k)) return; g.slots++; sci.add(i.s || '-');
    if (seen.has(id)) return; seen.add(id);
    ['str', 'hp', 'mag'].forEach(s => { g[s] += i[s] || 0; });
    Object.entries(i.fx || {}).forEach(([f, n]) => { g.fx[f] = (g.fx[f] || 0) + n; }); });
  if (g.slots >= 4 && sci.size === 1 && ADV_SETS[[...sci][0]]) { g.set = [...sci][0]; Object.entries(ADV_SETS[g.set].fx).forEach(([f, n]) => { g.fx[f] = (g.fx[f] || 0) + n; }); }
  Object.keys(g.fx).forEach(f => { if (ADV_FXCAP[f]) g.fx[f] = Math.min(ADV_FXCAP[f], g.fx[f]); });
  return g;
}
/* one tag: rarity and the level you need, e.g. "Rare · level 6" */
const ADV_TAG = i => `${ADV_RARITY[i.r]} · level ${i.lv || 1}`;
const ADV_WHERE = i => i.slot === 'hand' ? (i.two ? 'Two hands' : 'Either hand') : (ADV_SLOTS.find(s => s.k === i.slot) || { name: i.slot }).name;
/* "+2 💪 Strength · +1 ✨ Magic" and the fx lines */
const ADV_STATS_TXT = i => ['str', 'hp', 'mag'].filter(s => i[s]).map(s => `${i[s] > 0 ? '+' : '−'}${Math.abs(i[s])} ${ADV_STAT[s][0]} ${ADV_STAT[s][1]}`).join(' · ');
const ADV_FX_TXT = fx => Object.entries(fx || {}).filter(([f]) => ADV_FX[f]).map(([f, n]) => ADV_FX[f](n));
