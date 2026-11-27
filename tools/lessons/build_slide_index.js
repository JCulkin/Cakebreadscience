#!/usr/bin/env node
/* Build js/lesson-slides.js — maps every Edexcel spec point (e.g. 'C1.40', 'B2.13') and sub-topic ('C1f')
   to the exact Class Slide (URL + slide number + slide heading) so Admin's Misconception Radar can jump
   straight to the exact projector slide needed to reteach a struggling area.
   Run: node tools/lessons/build_slide_index.js */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const LESSONS_JSON = path.join(ROOT, 'interactive/lessons/lessons.json');
const SPEC_JS = path.join(ROOT, 'interactive/spec-quiz/spec.js');
const OUT = path.join(ROOT, 'js/lesson-slides.js');

const lj = JSON.parse(fs.readFileSync(LESSONS_JSON, 'utf8'));

// Load SPEC to map sub-topic codes ('B1', 'B2c', 'C1f', 'P8') and match spec point text keywords to slides
const vm = require('vm');
const specCtx = { window: {} };
vm.runInNewContext(fs.readFileSync(SPEC_JS, 'utf8') + '\n;window.__SPEC = SPEC;', specCtx);
const SPEC = specCtx.window.__SPEC || [];

const SUB_PTS = {};
const PT_TEXT = {};
const PT_SUB = {};
const STOP = new Set(['that','this','with','from','into','their','they','them','there','these','those','have','which','when','where','what','understand','know','explain','describe','state','recall','using','used','between','about','such','other','more','most','only','some','each','both','over','under','through','during','than','then','also','does','will','would','should','could','make','made','form','forms','how','why','are','for','and','the','not','can','but','all','one','two','three','four','five','different','include','including','examples','example','simple','terms','idea','ideas','basic','main']);
function tok(s) {
  return String(s || '').toLowerCase().replace(/<[^>]+>/g, ' ').replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/).filter(w => w.length >= 4 && !STOP.has(w));
}

SPEC.forEach(s => {
  const L = s.name[0];
  s.topics.forEach(t => t.subs.forEach(sb => {
    if (sb.name === 'Units') return;
    const subKey = L + t.n + sb.l;
    SUB_PTS[subKey] = sb.points.map(p => L + p.id);
    sb.points.forEach(p => {
      const k = L + p.id;
      PT_SUB[k] = subKey;
      PT_TEXT[k] = [p.text, p.h, p.detail, ...(p.bullets || [])].filter(Boolean).join(' ');
    });
  }));
});

const SUBJ_L = { biology: 'B', chemistry: 'C', physics: 'P' };

// Parse spec range like "1.1–1.4" or "2.7–2.14B" into list of matching spec point keys in that subject
function expandSpecRange(L, specStr) {
  const out = new Set();
  const s = String(specStr || '');
  const allPts = Object.keys(PT_TEXT).filter(k => k[0] === L);
  const numOf = k => {
    const m = k.slice(1).match(/^(\d+)\.(\d+)/);
    return m ? [+m[1], +m[2]] : null;
  };
  s.split(/[,;]+/).forEach(part => {
    part = part.trim();
    const rm = part.match(/(\d+)\.(\d+)[A-Za-z]?\s*[–-]\s*(\d+)\.(\d+)/);
    if (rm) {
      const [t1, p1, t2, p2] = [+rm[1], +rm[2], +rm[3], +rm[4]];
      allPts.forEach(k => {
        const np = numOf(k);
        if (!np) return;
        const v = np[0] * 1000 + np[1];
        if (v >= t1 * 1000 + p1 && v <= t2 * 1000 + p2) out.add(k);
      });
      return;
    }
    const sm = part.match(/(\d+)\.(\d+)/);
    if (sm) {
      const pref = L + sm[1] + '.' + sm[2];
      allPts.forEach(k => { if (k === pref || k.startsWith(pref)) out.add(k); });
    }
  });
  return [...out];
}

function stripTags(h) {
  return String(h || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}

function parseSlides(html) {
  const m = html.match(/<div[^>]+id=["']deck-src["'][^>]*>([\s\S]*?)<\/div>\s*(?:<script|<\/body)/i) || html.match(/<div[^>]+id=["']deck-src["'][^>]*>([\s\S]*)/i);
  const src = m ? m[1] : html;
  const slides = [];
  const re = /<section\b([^>]*)>([\s\S]*?)<\/section>/gi;
  let sm, idx = 0;
  while ((sm = re.exec(src))) {
    const attrs = sm[1] || '', inner = sm[2] || '';
    if (!/\bclass=["'][^"']*\bps\b/i.test(attrs) || /data-auto=/i.test(attrs)) continue;
    idx++;
    const hm = inner.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/i);
    const title = hm ? stripTags(hm[1]).slice(0, 80) : '';
    const text = stripTags(inner);
    const isTitle = /\btslide\b/i.test(attrs) || idx === 1;
    slides.push({ n: idx, title, text, isTitle, tokens: new Set(tok(title + ' ' + title + ' ' + text)) });
  }
  return slides;
}

const bySub = {}; // 'C1f' -> { url, title, slides: N }
const byPt = {};  // 'C1.40' -> { url, n, title, lesson }

(lj.subjects || []).forEach(subj => {
  const L = SUBJ_L[subj.id];
  if (!L) return;
  (subj.sections || []).forEach(sec => (sec.topics || []).forEach(t => {
    if (!t.status) return;
    const vers = (t.versions || []).slice().sort();
    const useChecked = t.status === 'checked' && vers.length;
    const relDeck = useChecked
      ? `interactive/lessons/${subj.id}/${t.code}/v${vers[vers.length - 1]}/${t.split ? 'deck.html' : 'index.html'}`
      : `interactive/lessons/${subj.id}/${t.code}/draft/${t.split ? 'deck.html' : 'index.html'}`;
    let fp = path.join(ROOT, relDeck);
    let url = '/' + relDeck;
    if (!fs.existsSync(fp)) {
      const alt = `interactive/lessons/${subj.id}/${t.code}/draft/${t.split ? 'deck.html' : 'index.html'}`;
      fp = path.join(ROOT, alt);
      url = '/' + alt;
    }
    if (!fs.existsSync(fp)) return;
    const slides = parseSlides(fs.readFileSync(fp, 'utf8'));
    if (!slides.length) return;
    const pts = expandSpecRange(L, t.spec);
    const subs = new Set(pts.map(k => PT_SUB[k]).filter(Boolean));
    subs.forEach(sk => {
      if (!bySub[sk]) bySub[sk] = { url, title: `${subj.name} ${t.code} · ${t.title}`, slides: slides.length };
    });
    // Match each spec point in this lesson to its highest-scoring teaching slide
    pts.forEach(pk => {
      const pToks = tok(PT_TEXT[pk]);
      let best = null, bestScore = -1;
      slides.forEach(sl => {
        if (sl.isTitle && slides.length > 1) return;
        let score = 0;
        const titleLower = sl.title.toLowerCase();
        pToks.forEach(w => {
          if (sl.tokens.has(w)) score += 1;
          if (titleLower.includes(w)) score += 3;
        });
        // Bonus if slide explicitly mentions the spec number
        if (sl.text.includes(pk.slice(1))) score += 6;
        if (score > bestScore) { bestScore = score; best = sl; }
      });
      if (!best) best = slides.find(sl => !sl.isTitle) || slides[0];
      byPt[pk] = { url, n: best.n, title: best.title || t.title, lesson: `${subj.name} ${t.code}` };
    });
  }));
});

const outSrc = `/* Generated by tools/lessons/build_slide_index.js — do not edit by hand.\n   Maps spec points & sub-topics to the exact Class Slide (URL + slide number) for Admin Misconception Radar. */\nwindow.LESSON_SLIDES = ${JSON.stringify({ bySub, byPt })};\n`;
fs.writeFileSync(OUT, outSrc, 'utf8');
console.log(`Wrote js/lesson-slides.js: ${Object.keys(bySub).length} sub-topics, ${Object.keys(byPt).length} spec points indexed.`);
