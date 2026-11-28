/* Word banks for Type Fast or Perish v2.
   SCI: built live from /js/key-words.js (window.KEYWORDS — the site's reviewed Edexcel IGCSE Double Award
   examiner key words) plus core Double Award spec vocabulary, UK spellings, tagged b/c/p.
   SILLY: original nonsense in the spirit of absurd British comedy and cartoon silliness. No swearing, no quotes. */
window.TW=(function(){
const CORE={
  b:['nucleus','cytoplasm','mitochondria','ribosome','chloroplast','vacuole','cell wall','cell membrane','enzyme','active site','photosynthesis','chlorophyll','respiration','aerobic','anaerobic','lactic acid','glucose','starch','protein','lipid','amino acid','fatty acid','glycerol','diffusion','osmosis','active transport','xylem','phloem','haemoglobin','plasma','platelet','antibody','pathogen','phagocyte','lymphocyte','oesophagus','stomach','ileum','villi','bile','pancreas','amylase','protease','lipase','peristalsis','synapse','reflex arc','receptor','effector','hormone','insulin','adrenaline','oestrogen','testosterone','homeostasis','ecosystem','habitat','population','community','producer','consumer','decomposer','food chain','trophic level','biomass','carbon cycle','eutrophication','deforestation','biodiversity','chromosome','gene','allele','dominant','recessive','genotype','phenotype','homozygous','heterozygous','mitosis','meiosis','zygote','gamete','fertilisation','mutation','natural selection','evolution','variation','species','pollination','germination','auxin','phototropism'],
  c:['atom','element','compound','mixture','molecule','proton','neutron','electron','atomic number','mass number','isotope','relative atomic mass','periodic table','alkali metal','halogen','noble gas','ionic bond','covalent bond','ion','lattice','oxidation','reduction','redox','displacement','solute','solvent','solution','saturated','filtration','crystallisation','distillation','fractional distillation','chromatography','solubility','mole','acid','alkali','neutralisation','indicator','litmus','universal indicator','hydrogen','oxygen','nitrogen','chlorine','carbon dioxide','exothermic','endothermic','activation energy','catalyst','rate of reaction','reversible','hydrocarbon','alkane','alkene','crude oil','fraction','cracking','combustion','polymer','polymerisation','ethene','corrosion','rusting','sodium chloride','magnesium','potassium','calcium','aluminium','copper sulfate','carbonate','hydroxide','nitrate','sublimation','evaporation','condensation','empirical formula'],
  p:['velocity','acceleration','displacement','distance','speed','momentum','force','newton','resultant force','friction','air resistance','terminal velocity','weight','mass','stopping distance','reaction time','braking distance','elastic','extension','kinetic energy','efficiency','power','joule','watt','work done','conduction','convection','radiation','insulation','density','pressure','current','voltage','resistance','ohm','ampere','volt','series circuit','parallel circuit','resistor','thermistor','diode','fuse','charge','coulomb','wave','amplitude','wavelength','frequency','hertz','transverse','longitudinal','reflection','refraction','total internal reflection','critical angle','electromagnetic spectrum','radio waves','microwaves','infrared','visible light','ultraviolet','x-rays','gamma rays','magnet','magnetic field','electromagnet','motor effect','generator','induction','alpha','beta','gamma','half-life','radioactive decay','background radiation','fission','fusion','orbit','galaxy','universe','supernova','white dwarf','red giant','neutron star','black hole']
};
const seen=new Set(),SCI=[];
function addWord(raw,t){
  const parts=String(raw||'').replace(/\s*\([^)]*\)/g,'').split(/\s*\/\s*/);
  for(let p of parts){
    p=p.replace(/[–—]/g,'-').replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
    if(!/^[A-Za-z][A-Za-z0-9'\- ]{2,27}$/.test(p))continue;
    const key=p.toLowerCase();
    if(seen.has(key))continue;
    seen.add(key);
    SCI.push({w:p,t});
  }
}
/* 1. Pull every reviewed examiner key word from /js/key-words.js first */
const kw=window.KEYWORDS||{};
for(const [pt,list] of Object.entries(kw)){
  const t=pt[0]==='B'?'b':pt[0]==='C'?'c':pt[0]==='P'?'p':null;
  if(!t||!Array.isArray(list))continue;
  for(const item of list)if(Array.isArray(item)&&item[0])addWord(item[0],t);
}
/* 2. Add core Double Award spec words not repeated in key-words.js */
for(const t of ['b','c','p'])for(const w of CORE[t])addWord(w,t);

const SILLY=`kerfuffle;gobbledygook;flibbertigibbet;shenanigans;discombobulated;bamboozle;skedaddle;hullabaloo;brouhaha;codswallop;poppycock;balderdash;nincompoop;whippersnapper;cattywampus;lollygag;gubbins;wibble;splendiferous;rapscallion;
custard;spatula;wombat;llama;badger;haddock;trousers;teapot;crumpet;kipper;turnip;sprout;marmalade;penguin;walrus;platypus;ferret;pineapple;jellyfish;sea sponge;squid;towel;dressing gown;spoon;biscuit;
an unusually large herring;the ministry of hopping;a slightly damp parrot;improbably confident llama;existential teapot;galactic tea break;the wrong trousers for space;a towel of great importance;
bureaucratic hedgehog;sarcastic lighthouse;a shrubbery of moderate size;knights who say hello;very serious walk;interplanetary custard;depressed robot;self-aware toaster;pan-dimensional mice;
a whale falling from the sky;bowl of indifferent petunias;answer is probably forty-two;don't panic;mostly harmless;tea, earl grey, lukewarm;a fish-shaped sandwich;
jellyfishing licence;starfish with opinions;bubble blowing technique;underwater squirrel suit;a snail that meows;fry cook of the month;
flying circus;silly walk ministry;a fearsome rabbit;coconut horse noises;a breakfast that is mostly spam;a semi-ferocious hamster;the cheese shop has no cheese;
moustache wax;inflatable giraffe;thermonuclear porridge;spoon of destiny;gravy volcano;wobbly jelly;sock puppet uprising;sentient trifle;an alarmingly polite goose;
cosmic flannel;quantum crumpet;emergency trampoline;radioactive rubber duck;caffeinated sloth;philosophical potato;banana-powered rocket;tinfoil hat committee;
the vogons are writing poetry again;please stop licking the periodic table;bring a towel and a sandwich;this lesson has been cancelled by penguins`.split(/;\s*/).map(s=>s.trim()).filter(Boolean).map(w=>({w,t:'s'}));
return {SCI,SILLY};})();
