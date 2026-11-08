/* Data for the Elements 1–20 game. Edexcel International GCSE Science (Double Award)
   Chemistry 1.14–1.24 (atomic structure, the Periodic Table) and 1.37–1.38 (ions). */
(function(){
// kind: 'metal' | 'nonmetal' | 'semi' (B and Si sit on the dividing line; often called metalloids)
// group: 1–7, or 0 for the noble gases; H is shown on its own (null group)
const E=[
 [1,'H','Hydrogen',null,1,'nonmetal','gas',1,[1]],
 [2,'He','Helium',0,1,'nonmetal','gas',4,[2]],
 [3,'Li','Lithium',1,2,'metal','solid',7,[2,1]],
 [4,'Be','Beryllium',2,2,'metal','solid',9,[2,2]],
 [5,'B','Boron',3,2,'semi','solid',11,[2,3]],
 [6,'C','Carbon',4,2,'nonmetal','solid',12,[2,4]],
 [7,'N','Nitrogen',5,2,'nonmetal','gas',14,[2,5]],
 [8,'O','Oxygen',6,2,'nonmetal','gas',16,[2,6]],
 [9,'F','Fluorine',7,2,'nonmetal','gas',19,[2,7]],
 [10,'Ne','Neon',0,2,'nonmetal','gas',20,[2,8]],
 [11,'Na','Sodium',1,3,'metal','solid',23,[2,8,1]],
 [12,'Mg','Magnesium',2,3,'metal','solid',24,[2,8,2]],
 [13,'Al','Aluminium',3,3,'metal','solid',27,[2,8,3]],
 [14,'Si','Silicon',4,3,'semi','solid',28,[2,8,4]],
 [15,'P','Phosphorus',5,3,'nonmetal','solid',31,[2,8,5]],
 [16,'S','Sulfur',6,3,'nonmetal','solid',32,[2,8,6]],
 [17,'Cl','Chlorine',7,3,'nonmetal','gas',35,[2,8,7]],
 [18,'Ar','Argon',0,3,'nonmetal','gas',40,[2,8,8]],
 [19,'K','Potassium',1,4,'metal','solid',39,[2,8,8,1]],
 [20,'Ca','Calcium',2,4,'metal','solid',40,[2,8,8,2]]
].map(([z,sym,name,group,period,kind,state,mass,config])=>({z,sym,name,group,period,kind,state,mass,config}));

const GROUP_NAMES={1:'alkali metals',7:'halogens',0:'noble gases'};
// Ions the spec requires (1.38): metals in Groups 1, 2, 3 and non-metals in Groups 5, 6, 7 (+ H+).
// Be and B are left out: at GCSE they are not treated as forming simple ions.
const IONS={Li:1,Na:1,K:1,Mg:2,Ca:2,Al:3,N:-3,P:-3,O:-2,S:-2,F:-1,Cl:-1};
const ION_NAMES={N:'nitride',P:'phosphide',O:'oxide',S:'sulfide',F:'fluoride',Cl:'chloride'};

// Misspellings/confusables used as wrong options for symbols
const FAKE_SYMBOLS={Sodium:['So','Sd','S'],Potassium:['P','Po','Pt'],Phosphorus:['Ph','Po','K'],Chlorine:['Ch','C','Cr'],Magnesium:['Mn','Ma','M'],Calcium:['C','Ka','Cm'],Argon:['A','Ag','Am'],Aluminium:['Am','A','Au'],Silicon:['S','Sc','Sl'],Sulfur:['Su','Sf','Si'],Fluorine:['Fl','Fr','Fe'],Neon:['N','Na','Nn'],Nitrogen:['Ni','Ng','Ne'],Beryllium:['Br','Bl','B'],Boron:['Bo','Br','Be'],Helium:['H','Hl','Hm'],Lithium:['L','Lt','Lm'],Carbon:['Ca','Cb','Co'],Oxygen:['Ox','Og','Os'],Hydrogen:['Hy','Hd','He']};

const DEFS=[
 {q:'A horizontal row in the Periodic Table is called a…',a:'period',o:['period','group','series','block'],why:'Rows are periods, columns are groups.',tag:'Periods and groups'},
 {q:'A vertical column in the Periodic Table is called a…',a:'group',o:['group','period','family line','shell'],why:'Columns are groups, rows are periods.',tag:'Periods and groups'},
 {q:'Elements in the Periodic Table are arranged in order of…',a:'atomic number',o:['atomic number','mass number','name, alphabetically','date of discovery'],why:'Atomic number (the number of protons) goes up by one each time.',tag:'How the table is arranged'},
 {q:'What does the atomic number of an element tell you?',a:'the number of protons in each atom',o:['the number of protons in each atom','the number of neutrons in each atom','the total number of protons and neutrons','the number of electron shells'],why:'Atomic number = protons. In an atom it also equals the number of electrons.',tag:'Atomic number'},
 {q:'Group 1 elements are called the…',a:'alkali metals',o:['alkali metals','halogens','noble gases','transition metals'],why:'Group 1: alkali metals (Li, Na, K…).',tag:'Group names'},
 {q:'Group 7 elements are called the…',a:'halogens',o:['halogens','noble gases','alkali metals','metalloids'],why:'Group 7: halogens (F, Cl, Br, I…).',tag:'Group names'},
 {q:'Group 0 elements are called the…',a:'noble gases',o:['noble gases','halogens','alkali metals','inert metals'],why:'Group 0: noble gases (He, Ne, Ar…).',tag:'Group names'},
 {q:'Elements in the same group have similar chemical properties because their atoms have…',a:'the same number of electrons in the outer shell',o:['the same number of electrons in the outer shell','the same number of shells','the same number of protons','the same mass number'],why:'Reactions involve outer-shell electrons, so the same number of outer electrons gives similar reactions.',tag:'Why groups are similar'},
 {q:'For an element in Groups 1–7, the group number tells you…',a:'the number of electrons in the outer shell',o:['the number of electrons in the outer shell','the number of occupied shells','the number of protons','the number of neutrons'],why:'Group 1 → 1 outer electron, Group 7 → 7 outer electrons.',tag:'Electrons and position'},
 {q:'The period number of an element tells you…',a:'the number of occupied electron shells',o:['the number of occupied electron shells','the number of outer electrons','the charge on its ion','its mass number'],why:'Period 3 elements (Na to Ar) all have electrons in 3 shells.',tag:'Electrons and position'},
 {q:'Why do the noble gases not readily react?',a:'their outer shell is full, so they don’t need to lose, gain or share electrons',o:['their outer shell is full, so they don’t need to lose, gain or share electrons','they have no electrons','they are all very heavy','they are metals'],why:'A full outer shell is a stable arrangement.',tag:'Noble gases'},
 {q:'Metals are found…',a:'on the left of the Periodic Table',o:['on the left of the Periodic Table','on the right of the Periodic Table','only in Group 0','only in period 1'],why:'Metals are on the left and in the middle; non-metals are on the right of the stepped line.',tag:'Metals and non-metals'}
];
const PROPS=[
 {q:'An element conducts electricity well as a solid. Is it a metal or a non-metal?',a:'metal',why:'Metals conduct electricity. Most non-metals don’t (graphite is an exception).'},
 {q:'An element is a poor conductor of electricity. Is it a metal or a non-metal?',a:'nonmetal',why:'Non-metals are generally poor conductors.'},
 {q:'An element’s oxide dissolves in water to make a solution with pH 2. Metal or non-metal?',a:'nonmetal',why:'Non-metal oxides are acidic.'},
 {q:'An element’s oxide reacts with acids to neutralise them. Metal or non-metal?',a:'metal',why:'Metal oxides are basic: they neutralise acids.'},
 {q:'An element’s oxide dissolves in water to make a solution with pH 12. Metal or non-metal?',a:'metal',why:'Soluble metal oxides form alkaline solutions.'},
 {q:'An element burns in oxygen. Its oxide turns universal indicator red in water. Metal or non-metal?',a:'nonmetal',why:'Red indicator means acidic, and non-metal oxides are acidic. (Example: sulfur dioxide.)'},
 {q:'An element is shiny and conducts electricity. Its oxide is basic. Metal or non-metal?',a:'metal',why:'Conducts electricity and forms a basic oxide: a metal.'},
 {q:'An element is a dull, brittle solid that doesn’t conduct. Its oxide is acidic. Metal or non-metal?',a:'nonmetal',why:'Poor conductor with an acidic oxide: a non-metal.'}
];
const ATOM=[
 {q:'Where in an atom are protons found?',a:'in the nucleus',o:['in the nucleus','in the shells','orbiting the nucleus','spread through the atom'],why:'Protons and neutrons are in the nucleus; electrons are in shells around it.',tag:'Sub-atomic particles'},
 {q:'Where in an atom are electrons found?',a:'in shells around the nucleus',o:['in shells around the nucleus','in the nucleus','attached to protons','between neutrons'],why:'Electrons occupy shells (energy levels) around the nucleus.',tag:'Sub-atomic particles'},
 {q:'What is the relative charge of an electron?',a:'−1',o:['−1','+1','0','−2'],why:'Proton +1, neutron 0, electron −1.',tag:'Sub-atomic particles'},
 {q:'What is the relative charge of a neutron?',a:'0',o:['0','+1','−1','+2'],why:'Neutrons are neutral.',tag:'Sub-atomic particles'},
 {q:'What is the relative charge of a proton?',a:'+1',o:['+1','−1','0','+2'],why:'Protons are positive.',tag:'Sub-atomic particles'},
 {q:'What is the relative mass of a proton?',a:'1',o:['1','0','1/1836 (very small)','2'],why:'Protons and neutrons each have relative mass 1.',tag:'Sub-atomic particles'},
 {q:'What is the relative mass of an electron?',a:'1/1836 (very small)',o:['1/1836 (very small)','1','0','−1'],why:'Electrons are about 1/1836 of the mass of a proton, so almost all the mass is in the nucleus.',tag:'Sub-atomic particles'},
 {q:'Why is an atom neutral overall?',a:'it has equal numbers of protons and electrons',o:['it has equal numbers of protons and electrons','it has equal numbers of protons and neutrons','neutrons cancel out the charges','electrons have no charge'],why:'+1 per proton and −1 per electron cancel out.',tag:'Sub-atomic particles'},
 {q:'Isotopes are atoms of the same element with different numbers of…',a:'neutrons',o:['neutrons','protons','electrons','shells'],why:'Same protons (same element), different neutrons, so different mass numbers.',tag:'Isotopes'},
 {q:'The mass number of an atom is the number of…',a:'protons + neutrons',o:['protons + neutrons','protons only','neutrons only','protons + electrons'],why:'Mass number = protons + neutrons (the particles in the nucleus).',tag:'Mass number'}
];
const ION_THEORY=[
 {q:'Metal atoms form ions by…',a:'losing electrons to form positive ions',o:['losing electrons to form positive ions','gaining electrons to form negative ions','losing protons','gaining protons'],why:'Metals lose their outer electrons. Fewer electrons than protons means a positive charge.',tag:'Forming ions'},
 {q:'Non-metal atoms form ions by…',a:'gaining electrons to form negative ions',o:['gaining electrons to form negative ions','losing electrons to form positive ions','gaining protons','losing neutrons'],why:'Non-metals gain electrons to fill their outer shell. More electrons than protons means a negative charge.',tag:'Forming ions'},
 {q:'When atoms form ions, they usually end up with…',a:'a full outer shell, like a noble gas',o:['a full outer shell, like a noble gas','an empty nucleus','one electron in the outer shell','the same number of electrons as before'],why:'Ions have the electronic configuration of the nearest noble gas.',tag:'Forming ions'},
 {q:'An ion has more electrons than protons. What is its charge?',a:'negative',o:['negative','positive','neutral','it depends on neutrons'],why:'Extra electrons (−) outnumber the protons (+).',tag:'Forming ions'}
];
window.EL={E,GROUP_NAMES,IONS,ION_NAMES,FAKE_SYMBOLS,DEFS,PROPS,ATOM,ION_THEORY,
  bySym:Object.fromEntries(E.map(e=>[e.sym,e])),
  groupLabel:g=>g===null?'(on its own)':'Group '+g,
  cfg:c=>c.join('.')};
})();
