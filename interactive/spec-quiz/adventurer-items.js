/* The Adventurer: item list shared by the creator and wardrobe pages (9 Nov 2026).
   Jokes live here so they can be swapped each term. slot: head | top | bottom | shoes | lhand (viewer's right) | rhand (viewer's left).
   r = rarity, s = science (b/c/p) for set bonuses, st = joke stats (change nothing). Pictures: adventurer-pixel.js. */
const ADV_ITEMS = [
  {"id":"paperhat","slot":"head","name":"Paper Hat","r":"common","st":{"aura":0,"brain":1,"vibes":1},"from":"Starter outfit","d":"Folded from a revision timetable. Still more organised than you."},
  {"id":"avogadro","slot":"head","name":"Hat of Avogadro","r":"rare","s":"c","st":{"aura":4,"brain":6,"vibes":2},"from":"Chemistry 1 · Silver","d":"Contains 6.02 × 10²³ smaller hats."},
  {"id":"nocap","slot":"head","name":"No-Cap Cap","r":"uncommon","st":{"aura":3,"brain":1,"vibes":3},"from":"Mission drop","d":"Physically unable to lie. Useless at true/false anyway."},
  {"id":"delulu","slot":"head","name":"Delulu Goggles","r":"lowkey","st":{"aura":5,"brain":-2,"vibes":7},"from":"Mission drop (rare roll)","d":"You see the answer you wanted. +2 Vibes, −2 accuracy."},
  {"id":"halo","slot":"head","name":"Halo of Main Character Energy","r":"unhinged","st":{"aura":12,"brain":0,"vibes":8},"from":"Physics 3 · Gold","d":"The camera follows you now. Background characters whisper."},
  {"id":"jumper","slot":"top","name":"School Jumper","r":"common","st":{"aura":0,"brain":1,"vibes":0},"from":"Starter outfit","d":"Name label says someone else's name. You've never asked."},
  {"id":"labcoat","slot":"top","name":"Lab Coat With One Mystery Stain","r":"uncommon","s":"c","st":{"aura":2,"brain":3,"vibes":1},"from":"Chemistry 2 · Bronze","d":"Nobody knows. Nobody asks."},
  {"id":"npc","slot":"top","name":"NPC T-Shirt","r":"uncommon","st":{"aura":-1,"brain":2,"vibes":4},"from":"Mission drop","d":"Says “Greetings, traveller” when poked."},
  {"id":"chainmail","slot":"top","name":"Chainmail of Covalent Bonds","r":"rare","s":"c","st":{"aura":4,"brain":5,"vibes":2},"from":"Chemistry 1 · Gold","d":"Shares electrons, not snacks."},
  {"id":"joggers","slot":"bottom","name":"Grey Joggers","r":"common","st":{"aura":0,"brain":0,"vibes":2},"from":"Starter outfit","d":"Comfortable. Shapeless. Honest."},
  {"id":"inertia","slot":"bottom","name":"Trousers of Moderate Inertia","r":"uncommon","s":"p","st":{"aura":2,"brain":3,"vibes":1},"from":"Physics 1 · Silver","d":"Hard to get going. Hard to stop."},
  {"id":"kilt","slot":"bottom","name":"Kilt of Kinetic Energy","r":"rare","s":"p","st":{"aura":6,"brain":3,"vibes":5},"from":"Physics 4 · Gold","d":"½mv² of pure swish."},
  {"id":"oddsocks","slot":"shoes","name":"Odd Socks","r":"common","st":{"aura":0,"brain":0,"vibes":1},"from":"Starter outfit","d":"One is red. One is a different red. Both are damp."},
  {"id":"brownian","slot":"shoes","name":"Socks of Brownian Motion","r":"uncommon","s":"p","st":{"aura":2,"brain":2,"vibes":3},"from":"Mission drop","d":"Random, jittery, never a matching pair."},
  {"id":"grass","slot":"shoes","name":"Touch-Grass Boots","r":"rare","s":"b","st":{"aura":5,"brain":2,"vibes":6},"from":"Biology 4 · Silver","d":"Grass grows wherever you step. You were warned."},
  {"id":"frictionless","slot":"shoes","name":"Frictionless Slippers","r":"lowkey","s":"p","st":{"aura":7,"brain":1,"vibes":6},"from":"Physics 1 · Gold","d":"Stopping distance: yes."},
  {"id":"crisps","slot":"lhand","name":"Empty Crisp Packet","r":"common","st":{"aura":0,"brain":0,"vibes":-1},"from":"Starter outfit","d":"Rustles menacingly. Contains air and regret."},
  {"id":"shield","slot":"lhand","name":"Periodic Table Shield","r":"rare","s":"c","st":{"aura":4,"brain":6,"vibes":1},"from":"Chemistry 2 · Silver","d":"The noble gases refuse to get involved."},
  {"id":"clipboard","slot":"lhand","name":"Clipboard of Authority","r":"uncommon","st":{"aura":4,"brain":2,"vibes":2},"from":"Mission drop","d":"Nobody questions someone with a clipboard."},
  {"id":"ruler","slot":"rhand","name":"Slightly Bent Ruler","r":"common","st":{"aura":0,"brain":1,"vibes":0},"from":"Starter outfit","d":"30 cm of pure intimidation. Well, 29.4 cm."},
  {"id":"glove","slot":"rhand","name":"Newton's Third Glove","r":"rare","s":"p","st":{"aura":6,"brain":4,"vibes":3},"from":"Physics 1 · Bronze","d":"Every slap gets an equal and opposite slap."},
  {"id":"mito","slot":"rhand","name":"Mitochondria Gauntlet","r":"lowkey","s":"b","st":{"aura":8,"brain":5,"vibes":6},"from":"Biology 2 · Gold","d":"The powerhouse of the hand."},
  {"id":"pipette","slot":"rhand","name":"Pipette of Precise Disappointment","r":"uncommon","s":"c","st":{"aura":1,"brain":4,"vibes":-1},"from":"Chemistry 2 · Bronze","d":"Delivers exactly 25.0 cm³ of sadness."},
  {"id":"calc67","slot":"rhand","name":"The 6-7 Calculator","r":"unhinged","st":{"aura":67,"brain":-6,"vibes":7},"from":"Mission drop (1 in 67)","d":"Answers every question with “six… seven…”."},
  {"id":"syringe","slot":"rhand","name":"Syringe of Plot Armour","r":"legend","s":"b","st":{"aura":30,"brain":10,"vibes":10},"from":"Most correct Biology answers in the last 7 days","d":"You cannot be written out of this storyline.","legend":"Biology","holder":"Priya K. · 86 correct in the last 7 days"},
  {"id":"pebble","slot":"lhand","name":"The Philosopher's Pebble","r":"legend","s":"c","st":{"aura":30,"brain":10,"vibes":10},"from":"Most correct Chemistry answers in the last 7 days","d":"Turns lead into slightly shinier lead.","legend":"Chemistry","holder":"Leo M. · 71 correct in the last 7 days"},
  {"id":"dodgeball","slot":"lhand","name":"Definitely-Not-Uranium Dodgeball","r":"legend","s":"p","st":{"aura":30,"brain":10,"vibes":10},"from":"Most correct Physics answers in the last 7 days","d":"Half-life: one PE lesson.","legend":"Physics","holder":"You! · 94 correct in the last 7 days"}
];
const ADV_RARITY = {common:'Common', uncommon:'Uncommon', rare:'Rare', lowkey:'Lowkey Legendary', unhinged:'Absolutely Unhinged', legend:'Legendary'};
const ADV_SLOTS = [{k:'head',name:'Head'},{k:'top',name:'Top'},{k:'bottom',name:'Bottom'},{k:'shoes',name:'Shoes'},{k:'rhand',name:'Right hand'},{k:'lhand',name:'Left hand'}];
