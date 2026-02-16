import AdmZip from 'adm-zip';
import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = join(__dirname, '..');
const APKG_DIR = join(ROOT, 'ANKI files');
const OUT_DIR = join(ROOT, 'data');

const DECKS = {
  'biology': 'IGCSE__Biology_v2.apkg',
  'chemistry': 'IGCSE__Chemistry_v3.apkg',
  'physics': 'IGCSE__Physics_v1.apkg',
  'physics-eqns': 'IGCSE__Physics-eqns_v1.apkg',
};

// Strip HTML tags
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').trim();
}

async function convertApkg(deckId, filename) {
  const apkgPath = join(APKG_DIR, filename);
  console.log(`\nProcessing ${deckId}: ${filename}`);
  
  try {
    // Extract .apkg (it's a zip file)
    const zip = new AdmZip(apkgPath);
    let collectionEntry = zip.getEntry('collection.anki2') || zip.getEntry('collection.anki21');
    
    if (!collectionEntry) {
      console.error(`  ❌ No collection.anki2/anki21 found`);
      return;
    }
    
    const dbData = collectionEntry.getData();
    
    // Load SQLite database
    const SQL = await initSqlJs();
    const db = new SQL.Database(dbData);
    
    // Query cards
    const result = db.exec(`
      SELECT cards.id, notes.flds
      FROM cards
      JOIN notes ON cards.nid = notes.id
    `);
    
    if (!result.length) {
      console.error(`  ❌ No cards found`);
      return;
    }
    
    const cards = [];
    result[0].values.forEach(([cardId, flds]) => {
      const fields = flds.split('\x1f'); // Anki field separator
      if (fields.length >= 2) {
        cards.push({
          id: cardId,
          front: stripHtml(fields[0]),
          back: stripHtml(fields[1])
        });
      }
    });
    
    db.close();
    
    // Write JSON
    mkdirSync(OUT_DIR, { recursive: true });
    const outPath = join(OUT_DIR, `${deckId}.json`);
    writeFileSync(outPath, JSON.stringify(cards, null, 2));
    
    console.log(`  ✅ Exported ${cards.length} cards → ${deckId}.json`);
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
  }
}

async function main() {
  console.log('Converting Anki decks to JSON...\n');
  
  for (const [deckId, filename] of Object.entries(DECKS)) {
    await convertApkg(deckId, filename);
  }
  
  console.log('\n✅ Done!');
}

main();
