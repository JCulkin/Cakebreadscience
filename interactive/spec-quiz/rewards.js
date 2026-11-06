/* Campaign rewards: ranks (Star Wars × US Army), scout-style badges, Italian gear and the three legendary subject trophies.
   All drawings are inline SVG (viewBox 0 0 100 100). Needs spec.js. */

/* ---------- ranks: XP thresholds ---------- */
const RANKS = [
  ['Private', 0, 'chev', 0], ['Youngling', 60, 'order', 1], ['Private First Class', 150, 'chev', 1], ['Corporal', 300, 'chev', 2],
  ['Padawan', 500, 'order', 2], ['Sergeant', 800, 'chev', 3], ['Staff Sergeant', 1200, 'chev', 4], ['Lieutenant', 1700, 'bar', 1],
  ['Jedi Knight', 2300, 'order', 3], ['Captain', 3000, 'bar', 2], ['Major', 4000, 'leaf', 1], ['Colonel', 5200, 'eagle', 1],
  ['Jedi Master', 6600, 'order', 4], ['General', 8200, 'star', 4], ['Grand Master', 10000, 'order', 5]
].map(([name, xp, kind, n], i) => ({ i, name, xp, kind, n }));
function rankFor(xp) { let r = RANKS[0]; for (const k of RANKS) if (xp >= k.xp) r = k; return r; }

function insignia(rank, size = 64) {
  const { kind, n } = rank; let g = '';
  const gold = '#d4a017', silver = '#c0c6cf';
  if (kind === 'chev') {
    if (!n) g = `<circle cx="50" cy="50" r="30" fill="none" stroke="#6b7a4a" stroke-width="6"/><text x="50" y="58" text-anchor="middle" font-size="22" font-weight="900" fill="#6b7a4a" font-family="Barlow Condensed,sans-serif">PVT</text>`;
    for (let k = 0; k < n; k++) { const y = 26 + k * 15 - (n - 1) * 3; g += `<path d="M18 ${y + 16} L50 ${y} L82 ${y + 16} L82 ${y + 26} L50 ${y + 10} L18 ${y + 26} Z" fill="${gold}" stroke="#5c4300" stroke-width="2"/>`; }
  } else if (kind === 'bar') {
    for (let k = 0; k < n; k++) { const x = n === 1 ? 40 : 28 + k * 26; g += `<rect x="${x}" y="22" width="20" height="56" rx="3" fill="${silver}" stroke="#555" stroke-width="2"/>`; }
  } else if (kind === 'leaf') {
    g = `<path d="M50 14 C74 26 80 52 50 86 C20 52 26 26 50 14 Z" fill="${gold}" stroke="#5c4300" stroke-width="2"/><path d="M50 22 V82 M50 40 L38 32 M50 40 L62 32 M50 56 L36 48 M50 56 L64 48" stroke="#5c4300" stroke-width="2.5" fill="none"/>`;
  } else if (kind === 'eagle') {
    g = `<path d="M50 30 C42 22 22 18 8 26 C22 30 26 36 30 44 C34 52 42 54 46 58 L42 80 L50 72 L58 80 L54 58 C58 54 66 52 70 44 C74 36 78 30 92 26 C78 18 58 22 50 30 Z" fill="${silver}" stroke="#444" stroke-width="2"/><circle cx="50" cy="34" r="6" fill="${silver}" stroke="#444" stroke-width="2"/>`;
  } else if (kind === 'star') {
    for (let k = 0; k < n; k++) { const cx = 14 + k * 24, cy = 50; g += `<path d="${starPath(cx, cy, 11, 4.5)}" fill="${silver}" stroke="#444" stroke-width="1.5"/>`; }
  } else { // 'order': a glowing ring with n stars around it
    g = `<circle cx="50" cy="50" r="22" fill="#0b1d3a" stroke="#7dd3fc" stroke-width="4"/><circle cx="50" cy="50" r="12" fill="#7dd3fc" opacity=".85"/>`;
    for (let k = 0; k < n; k++) { const a = -Math.PI / 2 + k * 2 * Math.PI / n; g += `<path d="${starPath(50 + 36 * Math.cos(a), 50 + 36 * Math.sin(a), 8, 3.3)}" fill="#fde68a" stroke="#a16207" stroke-width="1.2"/>`; }
  }
  return `<svg class="insignia" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">${g}</svg>`;
}
function starPath(cx, cy, R, r) { let d = ''; for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r : R; d += (k ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1); } return d + 'Z'; }

/* ---------- scout patches ---------- */
const TOPIC_ICON = { B1: '🦠', B2: '🔬', B3: '🧬', B4: '🌿', B5: '🌾', C1: '⚛️', C2: '🧪', C3: '🔥', C4: '🛢️', P1: '🏎️', P2: '⚡', P3: '🌊', P4: '🔋', P5: '🎈', P6: '🧲', P7: '☢️', P8: '🪐' };
const SUBJ_HEX = { Biology: '#2e7d32', Chemistry: '#b45309', Physics: '#1d4ed8' };
let _pid = 0;
function patch({ color = '#555', icon = '★', label = '', shape = 'circle', locked = false, size = 96 }) {
  const id = 'p' + (++_pid), bg = locked ? '#d6d2c6' : color, edge = locked ? '#a8a294' : shade(color, -35);
  const outline = shape === 'shield' ? 'M50 4 L92 16 L88 58 C84 78 66 90 50 96 C34 90 16 78 12 58 L8 16 Z'
    : shape === 'hex' ? 'M50 3 L92 27 L92 73 L50 97 L8 73 L8 27 Z'
    : shape === 'square' ? 'M14 6 H86 Q94 6 94 14 V86 Q94 94 86 94 H14 Q6 94 6 86 V14 Q6 6 14 6 Z'
    : 'M50 3 A47 47 0 1 1 49.9 3 Z';
  const inner = shape === 'circle' ? 'M50 13 A37 37 0 1 1 49.9 13 Z' : null;
  const txt = locked ? '?' : icon;
  return `<svg class="patch ${locked ? 'locked' : ''}" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">
    <defs><pattern id="${id}t" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="4" fill="${edge}"/><rect width="2" height="4" fill="${shade(edge, 25)}"/></pattern>
      <pattern id="${id}w" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)"><rect width="3" height="3" fill="${bg}"/><rect width="3" height="1" fill="${shade(bg, 10)}"/></pattern>
      <path id="${id}a" d="M18 54 A32 32 0 0 1 82 54"/></defs>
    <path d="${outline}" fill="url(#${id}w)" stroke="url(#${id}t)" stroke-width="7"/>
    <path d="${inner || outline}" fill="none" stroke="${locked ? '#bdb8aa' : '#fffbe8'}" stroke-width="1.6" stroke-dasharray="3 2.4" ${inner ? '' : 'transform="translate(50 50) scale(.8) translate(-50 -50)"'}/>
    ${label ? `<text font-family="Barlow Condensed,sans-serif" font-weight="900" font-size="12" letter-spacing="1" fill="${locked ? '#8d887a' : '#fffbe8'}"><textPath href="#${id}a" startOffset="50%" text-anchor="middle">${label}</textPath></text>` : ''}
    <text x="50" y="${label ? 76 : 63}" text-anchor="middle" font-size="${label ? 30 : 40}" ${locked ? 'fill="#8d887a" font-weight="900" font-family="Barlow Condensed,sans-serif"' : ''}>${txt}</text></svg>`;
}
function shade(hex, pct) { const n = parseInt(hex.slice(1), 16); const f = c => Math.max(0, Math.min(255, Math.round(c + c * pct / 100 + (pct > 0 ? 255 * pct / 400 : 0)))); return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(f).map(c => c.toString(16).padStart(2, '0')).join(''); }

/* ---------- badge catalogue ---------- */
const MILESTONES = [
  ['m:c10', 'First Steps', 'Answer 10 questions correctly', 'correct', 10, '👣'], ['m:c50', 'Keen Bean', '50 correct answers', 'correct', 50, '🫘'],
  ['m:c100', 'Century', '100 correct answers', 'correct', 100, '💯'], ['m:c250', 'Quarter Thousand', '250 correct answers', 'correct', 250, '🎯'],
  ['m:c500', 'Half Grand', '500 correct answers', 'correct', 500, '🏅'], ['m:c1000', 'Thousand Club', '1000 correct answers', 'correct', 1000, '🏆'],
  ['m:m1', 'Into the Field', 'Finish your first mission', 'missions', 1, '🏕️'], ['m:m10', 'Trailblazer', 'Finish 10 missions', 'missions', 10, '🧭'],
  ['m:m25', 'Expedition Leader', 'Finish 25 missions', 'missions', 25, '⛰️'], ['m:m50', 'Explorer', 'Finish 50 missions', 'missions', 50, '🗺️'],
  ['m:s1', 'Locked In', 'Secure your first question', 'securedQ', 1, '🔒'], ['m:p1', 'First Point', 'Secure your first spec point', 'securedP', 1, '📌'],
  ['m:p10', 'Ten Points', 'Secure 10 spec points', 'securedP', 10, '🔟'], ['m:p25', 'Point Collector', 'Secure 25 spec points', 'securedP', 25, '📚'],
  ['m:h10', 'Brave', 'Answer 10 ★ harder questions correctly', 'hard', 10, '⭐'], ['m:h50', 'Fearless', 'Answer 50 ★ harder questions correctly', 'hard', 50, '🌟'],
  ['m:w2', 'Two Week Streak', 'Do a mission in 2 weeks in a row', 'streak', 2, '🔥'], ['m:w4', 'Month of Science', '4 weeks in a row', 'streak', 4, '📅'],
  ['m:w8', 'Unstoppable', '8 weeks in a row', 'streak', 8, '🚀'], ['m:r1', 'Polish the Rust', 'Bring a rusty spec point back to secured', 'unrusted', 1, '🧽']
].map(([id, name, desc, stat, n, icon]) => ({ id, name, desc, stat, n, icon }));

/* ---------- Italian gear ---------- */
const G_ = {
  moka: `<path d="M34 18 H66 L62 46 H38 Z" fill="#9aa3ad" stroke="#333" stroke-width="2.5"/><path d="M38 46 H62 L68 84 H32 Z" fill="#b8c0c8" stroke="#333" stroke-width="2.5"/><rect x="36" y="44" width="28" height="5" fill="#555"/><path d="M66 24 C82 24 82 46 64 44" fill="none" stroke="#222" stroke-width="6"/><path d="M34 22 L22 16 L26 26 Z" fill="#9aa3ad" stroke="#333" stroke-width="2"/><circle cx="50" cy="14" r="4" fill="#222"/>`,
  mixer: `<rect x="20" y="78" width="60" height="10" rx="3" fill="#c0392b" stroke="#333" stroke-width="2"/><path d="M62 78 V30 Q62 18 50 18 H26 Q18 18 18 26 V34 H58" fill="#e74c3c" stroke="#333" stroke-width="2.5"/><path d="M28 50 H56 Q54 76 42 76 Q30 76 28 50 Z" fill="#dfe6e9" stroke="#333" stroke-width="2.5"/><path d="M40 34 V54 Q40 60 46 58" fill="none" stroke="#333" stroke-width="3"/><ellipse cx="42" cy="52" rx="10" ry="3" fill="#f5deb3"/>`,
  pasta: `<rect x="22" y="30" width="46" height="30" rx="4" fill="#c0c6cf" stroke="#333" stroke-width="2.5"/><rect x="30" y="40" width="30" height="6" fill="#555"/><path d="M68 44 H80 V30" fill="none" stroke="#333" stroke-width="3"/><circle cx="80" cy="28" r="5" fill="#8e44ad"/><path d="M32 60 Q30 74 36 88 M40 60 Q40 76 44 88 M48 60 Q50 76 52 88 M56 60 Q58 74 60 88" stroke="#f4d03f" stroke-width="4" fill="none"/><rect x="20" y="58" width="50" height="6" fill="#888"/>`,
  basil: `<path d="M30 60 H70 L64 90 H36 Z" fill="#c0603a" stroke="#6e2f17" stroke-width="2.5"/><rect x="27" y="56" width="46" height="8" rx="2" fill="#d97648" stroke="#6e2f17" stroke-width="2"/><path d="M50 56 V30" stroke="#2e7d32" stroke-width="3"/><g fill="#43a047" stroke="#1b5e20" stroke-width="1.5"><ellipse cx="38" cy="44" rx="12" ry="7" transform="rotate(-25 38 44)"/><ellipse cx="62" cy="42" rx="12" ry="7" transform="rotate(25 62 42)"/><ellipse cx="44" cy="26" rx="10" ry="6" transform="rotate(-40 44 26)"/><ellipse cx="57" cy="22" rx="10" ry="6" transform="rotate(40 57 22)"/><ellipse cx="50" cy="12" rx="5" ry="8"/></g>`,
  parm: `<path d="M14 40 V64 Q50 80 86 64 V40" fill="#e9c46a" stroke="#7a5c12" stroke-width="2.5"/><ellipse cx="50" cy="40" rx="36" ry="12" fill="#f4dc8a" stroke="#7a5c12" stroke-width="2.5"/><path d="M50 40 L86 40 V64 L50 52 Z" fill="#fbe9b7" stroke="#7a5c12" stroke-width="2"/><g fill="#7a5c12" font-size="6" font-family="Barlow Condensed,sans-serif" font-weight="700"><text x="20" y="58">PARMIGIANO</text></g><g fill="#c9a33d"><circle cx="62" cy="46" r="1.6"/><circle cx="72" cy="50" r="1.3"/><circle cx="66" cy="54" r="1.4"/></g>`,
  peel: `<rect x="46" y="58" width="8" height="38" rx="3" fill="#a0522d" stroke="#4e2a12" stroke-width="2"/><path d="M50 4 C76 4 88 22 86 38 C84 52 66 60 50 60 C34 60 16 52 14 38 C12 22 24 4 50 4 Z" fill="#deb887" stroke="#4e2a12" stroke-width="2.5"/><circle cx="50" cy="32" r="22" fill="#f4a261" stroke="#9a5a1c" stroke-width="2"/><circle cx="50" cy="32" r="17" fill="#e63946"/><g fill="#fff8e1"><circle cx="44" cy="26" r="4"/><circle cx="57" cy="30" r="4"/><circle cx="47" cy="40" r="4"/></g><g fill="#2e7d32"><ellipse cx="54" cy="22" rx="3" ry="1.6"/><ellipse cx="40" cy="34" rx="3" ry="1.6"/></g>`,
  copper: `<path d="M18 40 H70 V72 Q70 84 58 84 H30 Q18 84 18 72 Z" fill="#c76a3a" stroke="#6d2f12" stroke-width="2.5"/><rect x="14" y="34" width="60" height="8" rx="3" fill="#e08a55" stroke="#6d2f12" stroke-width="2"/><path d="M74 40 L96 30" stroke="#6d2f12" stroke-width="7" stroke-linecap="round"/><path d="M26 50 Q30 70 40 76" stroke="#f0b48a" stroke-width="3" fill="none" opacity=".8"/><path d="M34 24 Q30 16 36 10 M46 26 Q42 16 48 8" stroke="#bbb" stroke-width="2.5" fill="none"/>`,
  gelato: `<path d="M12 36 H88 L80 24 H20 Z" fill="#e63946" stroke="#7a1520" stroke-width="2"/><path d="M20 24 L28 36 M36 24 L42 36 M52 24 L56 36 M68 24 L70 36" stroke="#fff" stroke-width="5"/><rect x="48" y="36" width="4" height="12" fill="#555"/><rect x="18" y="48" width="64" height="30" rx="4" fill="#f1faee" stroke="#333" stroke-width="2.5"/><g stroke="#333" stroke-width="1.5"><circle cx="34" cy="58" r="7" fill="#f4a3c4"/><circle cx="50" cy="58" r="7" fill="#a8e6a1"/><circle cx="66" cy="58" r="7" fill="#7b4a2e"/></g><text x="50" y="74" text-anchor="middle" font-size="8" font-weight="900" fill="#e63946" font-family="Barlow Condensed,sans-serif">GELATO</text><circle cx="28" cy="84" r="6" fill="#333"/><circle cx="72" cy="84" r="6" fill="#333"/>`,
  oil: `<rect x="26" y="24" width="48" height="66" rx="5" fill="#2e7d32" stroke="#103d12" stroke-width="2.5"/><rect x="40" y="12" width="20" height="14" rx="2" fill="#d4a017" stroke="#5c4300" stroke-width="2"/><rect x="30" y="40" width="40" height="32" fill="#f4e9c9" stroke="#103d12" stroke-width="1.5"/><text x="50" y="52" text-anchor="middle" font-size="7" font-weight="900" fill="#103d12" font-family="Barlow Condensed,sans-serif">OLIO EXTRA</text><text x="50" y="60" text-anchor="middle" font-size="7" font-weight="900" fill="#103d12" font-family="Barlow Condensed,sans-serif">VERGINE</text><path d="M38 68 Q50 62 62 68" stroke="#556b2f" stroke-width="2" fill="none"/><ellipse cx="44" cy="66" rx="2.5" ry="1.5" fill="#556b2f"/><ellipse cx="56" cy="66" rx="2.5" ry="1.5" fill="#556b2f"/>`,
  vespa: `<circle cx="24" cy="74" r="12" fill="#333"/><circle cx="24" cy="74" r="5" fill="#bbb"/><circle cx="78" cy="74" r="12" fill="#333"/><circle cx="78" cy="74" r="5" fill="#bbb"/><path d="M14 68 Q16 52 36 52 L56 52 Q60 44 70 44 L86 60 Q90 68 86 72 L66 72 Q62 62 52 64 L40 72 Z" fill="#7fc8c4" stroke="#1f5f5b" stroke-width="2.5"/><path d="M70 44 L66 20" stroke="#333" stroke-width="4"/><path d="M58 20 H74" stroke="#333" stroke-width="4" stroke-linecap="round"/><rect x="30" y="44" width="22" height="7" rx="3" fill="#6b3d1e"/><circle cx="74" cy="26" r="4" fill="#fff59d" stroke="#333" stroke-width="1.5"/>`,
  neon: `<rect x="6" y="26" width="88" height="44" rx="10" fill="#1a1a2e" stroke="#555" stroke-width="3"/><text x="50" y="55" text-anchor="middle" font-size="17" font-weight="900" fill="#ff4d6d" stroke="#ffd6de" stroke-width=".6" font-family="Barlow Condensed,sans-serif" letter-spacing="1" style="filter:drop-shadow(0 0 3px #ff4d6d)">PIZZERIA</text><path d="M30 26 L40 12 M70 26 L60 12" stroke="#777" stroke-width="2"/><g fill="#7cfc00"><circle cx="16" cy="36" r="2"/><circle cx="84" cy="60" r="2"/></g>`,
  radio: `<rect x="12" y="28" width="76" height="56" rx="12" fill="#a0522d" stroke="#4e2a12" stroke-width="2.5"/><circle cx="36" cy="56" r="16" fill="#f5deb3" stroke="#4e2a12" stroke-width="2"/><g stroke="#8b6b3d" stroke-width="1.5"><path d="M22 50 H50 M22 56 H50 M22 62 H50"/></g><rect x="58" y="40" width="24" height="12" rx="2" fill="#fff8dc" stroke="#4e2a12" stroke-width="1.5"/><path d="M62 46 H78" stroke="#c0392b" stroke-width="1.5"/><circle cx="64" cy="66" r="5" fill="#d4a017"/><circle cx="78" cy="66" r="5" fill="#d4a017"/><path d="M30 28 L20 10 M70 28 L80 10" stroke="#333" stroke-width="2"/><g fill="#2e7d32" font-size="10"><text x="84" y="22">♪</text></g>`,
  oven: `<path d="M10 86 V56 Q10 18 50 18 Q90 18 90 56 V86 Z" fill="#c0603a" stroke="#6e2f17" stroke-width="2.5"/><g stroke="#8f3f1f" stroke-width="1.5" fill="none"><path d="M18 40 H82 M14 54 H86 M12 68 H88"/></g><rect x="62" y="4" width="10" height="20" fill="#7a3a1c" stroke="#4e2a12" stroke-width="2"/><path d="M28 86 V64 Q28 46 50 46 Q72 46 72 64 V86 Z" fill="#2b1406" stroke="#4e2a12" stroke-width="2.5"/><path d="M36 84 Q34 70 42 62 Q42 72 48 74 Q46 62 54 56 Q56 70 62 72 Q66 78 64 84 Z" fill="#ff9f1c"/><path d="M42 84 Q42 76 48 72 Q50 78 54 78 Q58 80 58 84 Z" fill="#ffe066"/><rect x="6" y="84" width="88" height="8" fill="#7a7a7a"/>`,
  espresso: `<rect x="14" y="14" width="72" height="18" rx="3" fill="#b0b8c0" stroke="#333" stroke-width="2.5"/><rect x="18" y="32" width="64" height="48" fill="#c0392b" stroke="#333" stroke-width="2.5"/><circle cx="34" cy="44" r="7" fill="#f8f8f8" stroke="#333" stroke-width="2"/><path d="M34 44 L38 40" stroke="#c0392b" stroke-width="2"/><text x="34" y="56" text-anchor="middle" font-size="5" font-family="Barlow,sans-serif" fill="#fff">9 bar</text><rect x="50" y="40" width="22" height="8" rx="2" fill="#666"/><path d="M58 48 V54 M64 48 V54" stroke="#333" stroke-width="2"/><path d="M72 44 H86" stroke="#222" stroke-width="5" stroke-linecap="round"/><path d="M52 60 H70 V68 Q70 74 61 74 Q52 74 52 68 Z" fill="#fff" stroke="#333" stroke-width="2"/><rect x="14" y="80" width="72" height="8" fill="#8a9199" stroke="#333" stroke-width="2"/><path d="M58 56 V60" stroke="#6b3d1e" stroke-width="2"/>`,
  magnet: `<path d="M38 8 L54 10 L58 22 L66 30 L76 40 L82 52 L74 50 L66 58 L70 72 L62 70 L58 80 L50 88 L44 84 L52 74 L56 62 L50 50 L40 42 L32 30 L30 18 Z" fill="#43a047" stroke="#1b5e20" stroke-width="2.5"/><path d="M38 8 L54 10 L58 22 L44 26 L32 30 L30 18 Z" fill="#43a047"/><path d="M44 26 L58 22 L66 30 L60 42 L50 50 L40 42 Z" fill="#f5f5f5"/><path d="M60 42 L66 30 L76 40 L82 52 L74 50 L66 58 L70 72 L62 70 L58 80 L50 88 L44 84 L52 74 L56 62 L50 50 Z" fill="#e53935"/><path d="M38 8 L54 10 L58 22 L66 30 L76 40 L82 52 L74 50 L66 58 L70 72 L62 70 L58 80 L50 88 L44 84 L52 74 L56 62 L50 50 L40 42 L32 30 L30 18 Z" fill="none" stroke="#333" stroke-width="2.5"/><ellipse cx="28" cy="70" rx="8" ry="5" fill="#e53935" stroke="#333" stroke-width="2"/><ellipse cx="58" cy="90" rx="5" ry="3" fill="#43a047" stroke="#333" stroke-width="1.5"/>`,
  notebook: `<rect x="20" y="10" width="62" height="80" rx="3" fill="#f5ecd7" stroke="#5a4a2a" stroke-width="2.5"/><rect x="14" y="10" width="10" height="80" fill="#6d4c41" stroke="#3e2723" stroke-width="2"/><g stroke="#c9b991" stroke-width="1"><path d="M28 26 H76 M28 36 H76 M28 46 H76 M28 56 H76 M28 66 H76 M28 76 H76"/></g><g fill="none" stroke="#1d4ed8" stroke-width="1.8"><ellipse cx="52" cy="44" rx="18" ry="7"/><ellipse cx="52" cy="44" rx="18" ry="7" transform="rotate(60 52 44)"/><ellipse cx="52" cy="44" rx="18" ry="7" transform="rotate(-60 52 44)"/></g><circle cx="52" cy="44" r="3.5" fill="#c62828"/><text x="52" y="78" text-anchor="middle" font-size="8" font-style="italic" fill="#333" font-family="Georgia,serif">E. Fermi</text>`,
  telescope: `<path d="M14 54 L76 22 L82 34 L20 66 Z" fill="#a0522d" stroke="#4e2a12" stroke-width="2.5"/><path d="M76 22 L86 18 L92 30 L82 34 Z" fill="#d4a017" stroke="#5c4300" stroke-width="2"/><path d="M8 56 L14 54 L20 66 L14 68 Z" fill="#d4a017" stroke="#5c4300" stroke-width="2"/><path d="M48 46 L34 90 M48 46 L50 92 M48 46 L66 90" stroke="#4e2a12" stroke-width="3"/><g fill="#fde68a"><path d="${starPath(82, 66, 6, 2.5)}"/><path d="${starPath(30, 20, 5, 2)}"/></g><circle cx="62" cy="76" r="0"/>`,
  cup: `<path d="M24 40 H70 V60 Q70 80 47 80 Q24 80 24 60 Z" fill="#fff" stroke="#333" stroke-width="2.5"/><path d="M70 46 Q86 46 84 58 Q82 68 68 66" fill="none" stroke="#333" stroke-width="4"/><ellipse cx="47" cy="40" rx="23" ry="5" fill="#6b3d1e" stroke="#333" stroke-width="2"/><ellipse cx="47" cy="86" rx="34" ry="5" fill="#eee" stroke="#333" stroke-width="2"/><path d="M38 30 Q34 22 40 14 M50 30 Q46 20 52 12" stroke="#bbb" stroke-width="2.5" fill="none"/>`,
  apron: `<path d="M34 10 Q50 26 66 10" fill="none" stroke="#333" stroke-width="3"/><path d="M32 18 H68 L70 36 Q84 34 86 30 M30 36 Q16 34 14 30" fill="none" stroke="#333" stroke-width="3"/><path d="M32 18 H68 L72 36 L76 90 H24 L28 36 Z" fill="#fff" stroke="#333" stroke-width="2.5"/><path d="M28 36 L24 90 H36 L40 36 Z" fill="#2e7d32"/><path d="M72 36 L76 90 H64 L60 36 Z" fill="#c62828"/><rect x="38" y="56" width="24" height="16" fill="none" stroke="#333" stroke-width="2"/>`,
  hat: `<path d="M26 60 Q12 50 18 34 Q24 20 38 24 Q42 8 56 12 Q72 10 76 26 Q90 26 88 42 Q86 54 74 60 Z" fill="#fff" stroke="#333" stroke-width="2.5"/><rect x="26" y="58" width="48" height="24" rx="3" fill="#fff" stroke="#333" stroke-width="2.5"/><path d="M36 60 V82 M50 60 V82 M64 60 V82" stroke="#ddd" stroke-width="2"/><path d="M26 76 H74" stroke="#c62828" stroke-width="3"/><path d="M26 72 H74" stroke="#2e7d32" stroke-width="3"/>`,
  mezzaluna: `<path d="M14 58 Q50 98 86 58 Z" fill="#cfd8dc" stroke="#333" stroke-width="2.5"/><path d="M20 62 Q50 90 80 62" fill="none" stroke="#fff" stroke-width="2"/><rect x="18" y="26" width="10" height="34" rx="4" fill="#6d4c41" stroke="#333" stroke-width="2"/><rect x="72" y="26" width="10" height="34" rx="4" fill="#6d4c41" stroke="#333" stroke-width="2"/><g fill="#43a047"><ellipse cx="44" cy="88" rx="4" ry="2"/><ellipse cx="56" cy="90" rx="4" ry="2"/></g>`,
  cutter: `<circle cx="38" cy="40" r="26" fill="#cfd8dc" stroke="#333" stroke-width="2.5"/><circle cx="38" cy="40" r="20" fill="none" stroke="#fff" stroke-width="2"/><circle cx="38" cy="40" r="5" fill="#555"/><path d="M38 40 L62 64" stroke="#555" stroke-width="6"/><path d="M60 62 L86 88" stroke="#c62828" stroke-width="12" stroke-linecap="round"/>`,
  crate: `<rect x="12" y="44" width="76" height="40" fill="#deb887" stroke="#6b4a1e" stroke-width="2.5"/><path d="M12 58 H88 M12 72 H88" stroke="#a97f45" stroke-width="2"/><text x="50" y="70" text-anchor="middle" font-size="8" font-weight="900" fill="#6b4a1e" font-family="Barlow Condensed,sans-serif">SAN MARZANO</text><g stroke="#7a1520" stroke-width="1.5"><ellipse cx="24" cy="40" rx="8" ry="11" fill="#e63946"/><ellipse cx="40" cy="38" rx="8" ry="11" fill="#d62828"/><ellipse cx="56" cy="40" rx="8" ry="11" fill="#e63946"/><ellipse cx="72" cy="38" rx="8" ry="11" fill="#d62828"/></g><g fill="#2e7d32"><path d="M22 28 L24 32 L26 28 Z M38 26 L40 30 L42 26 Z M54 28 L56 32 L58 28 Z M70 26 L72 30 L74 26 Z"/></g>`,
  goldmoka: null
};
G_.goldmoka = G_.moka.replace(/#9aa3ad/g, '#e6b422').replace('#b8c0c8', '#f2cd5c') + `<g fill="#fff8c4"><path d="${starPath(76, 70, 7, 3)}"/><path d="${starPath(20, 50, 5, 2)}"/></g>`;

const GEAR = [
  // topic gear: earned by securing every spec point (that has questions) in the topic
  ['B1', 'Moka pot', 'moka', 'Stovetop coffee, the Bialetti way.'], ['B2', 'Dough mixer', 'mixer', 'Kneads pizza dough while you revise cells.'],
  ['B3', 'Pasta machine', 'pasta', 'Rolls perfect tagliatelle. Genes not included.'], ['B4', 'Pot of basil', 'basil', 'Fresh from the ecosystem.'],
  ['B5', 'Wheel of Parmigiano', 'parm', 'Made with microbes, aged for two years.'], ['C1', 'Pizza peel', 'peel', 'For sliding pizzas in and out of the oven.'],
  ['C2', 'Copper saucepan', 'copper', 'High on the reactivity series? No: perfect for ragù.'], ['C3', 'Gelato cart', 'gelato', 'An endothermic masterpiece.'],
  ['C4', 'Olive oil tin', 'oil', 'Extra virgin. Not a hydrocarbon, promise.'], ['P1', 'Vespa', 'vespa', 'Accelerates from 0 to “ciao” in no time.'],
  ['P2', 'Neon pizzeria sign', 'neon', 'Glows with a current of 0.1 A.'], ['P3', 'Vintage radio', 'radio', 'Tuned to long-wavelength opera.'],
  ['P4', 'Wood-fired oven', 'oven', '450 °C of pure energy transfer.'], ['P5', 'Espresso machine', 'espresso', 'Nine bar of pressure, every shot.'],
  ['P6', 'Italy fridge magnet', 'magnet', 'Magnetically soft? No, it is a boot.'], ['P7', 'Fermi’s notebook', 'notebook', 'Enrico Fermi, Italian nuclear pioneer.'],
  ['P8', 'Galileo’s telescope', 'telescope', 'He spotted Jupiter’s moons with one of these.']
].map(([topic, name, art, blurb]) => ({ id: 'g:' + topic, topic, name, art, blurb }));
const GEAR_MILESTONES = [
  [1, 'Espresso cup', 'cup', 'Your first secured question. Salute!'], [10, 'Chef’s apron', 'apron', 'Ten questions secured.'],
  [25, 'Chef’s hat', 'hat', '25 questions secured.'], [50, 'Mezzaluna', 'mezzaluna', 'A half-moon chopper for 50 secured questions.'],
  [100, 'Pizza cutter', 'cutter', '100 questions secured.'], [175, 'Crate of San Marzano tomatoes', 'crate', '175 questions secured.'],
  [250, 'Golden moka pot', 'goldmoka', '250 questions secured. Leggendario.']
].map(([n, name, art, blurb]) => ({ id: 'gm:' + n, n, name, art, blurb }));

function gearSVG(art, size = 90, locked = false) {
  return `<svg class="gear ${locked ? 'locked' : ''}" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">${G_[art] || ''}</svg>`;
}

/* ---------- legendary subject trophies (held by the student with the most correct answers in that subject) ---------- */
const LEGENDS = {
  Biology: { name: 'The Cure', blurb: 'A syringe holding the cure for cancer. Held by whoever has the most correct biology answers.', art:
    `<defs><radialGradient id="lgB"><stop offset="0" stop-color="#b9fbc0"/><stop offset="1" stop-color="#b9fbc0" stop-opacity="0"/></radialGradient></defs><circle cx="50" cy="50" r="46" fill="url(#lgB)"/>
     <g transform="rotate(-40 50 50)"><rect x="40" y="18" width="20" height="52" rx="3" fill="#e8f7ff" stroke="#333" stroke-width="2.5"/><rect x="42" y="38" width="16" height="30" fill="#39ff88" opacity=".9"/><g stroke="#333" stroke-width="1.5"><path d="M40 28 H46 M40 36 H48 M40 44 H46 M40 52 H48 M40 60 H46"/></g>
     <rect x="47" y="6" width="6" height="14" fill="#9aa3ad" stroke="#333" stroke-width="2"/><rect x="38" y="2" width="24" height="6" rx="2" fill="#c62828" stroke="#333" stroke-width="2"/><rect x="34" y="68" width="32" height="5" rx="2" fill="#9aa3ad" stroke="#333" stroke-width="2"/><path d="M50 73 V94" stroke="#555" stroke-width="2.5"/></g>
     <g fill="#fff"><path d="${starPath(78, 22, 6, 2.4)}"/><path d="${starPath(20, 74, 5, 2)}"/></g>` },
  Chemistry: { name: 'The Philosopher’s Stone', blurb: 'Turns lead into gold. Held by whoever has the most correct chemistry answers.', art:
    `<defs><radialGradient id="lgC"><stop offset="0" stop-color="#ffd166"/><stop offset="1" stop-color="#ffd166" stop-opacity="0"/></radialGradient><linearGradient id="lgC2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff6b6b"/><stop offset="1" stop-color="#8b0000"/></linearGradient></defs><circle cx="50" cy="48" r="46" fill="url(#lgC)"/>
     <path d="M50 12 L76 34 L66 76 L34 76 L24 34 Z" fill="url(#lgC2)" stroke="#4a0000" stroke-width="2.5"/><path d="M50 12 L58 36 L76 34 M58 36 L66 76 M58 36 L42 36 L50 12 M42 36 L24 34 M42 36 L34 76 M42 36 L50 56 L58 36 M50 56 L34 76 M50 56 L66 76" stroke="#4a0000" stroke-width="1.2" fill="none" opacity=".7"/>
     <path d="M44 22 L50 16 L52 28 Z" fill="#fff" opacity=".7"/><rect x="18" y="80" width="64" height="12" rx="3" fill="#d4a017" stroke="#5c4300" stroke-width="2"/><text x="50" y="89.5" text-anchor="middle" font-size="8" font-weight="900" fill="#5c4300" font-family="Barlow Condensed,sans-serif">Pb → Au</text>` },
  Physics: { name: 'The Bomb', blurb: 'A cartoon nuclear bomb. Held by whoever has the most correct physics answers.', art:
    `<defs><radialGradient id="lgP"><stop offset="0" stop-color="#ffe066"/><stop offset="1" stop-color="#ffe066" stop-opacity="0"/></radialGradient></defs><circle cx="50" cy="50" r="46" fill="url(#lgP)"/>
     <ellipse cx="46" cy="56" rx="34" ry="22" fill="#4a5a3a" stroke="#1d2614" stroke-width="2.5"/><path d="M80 56 L94 42 V70 Z" fill="#4a5a3a" stroke="#1d2614" stroke-width="2.5"/><path d="M14 56 H78" stroke="#1d2614" stroke-width="1.5" opacity=".5"/>
     <circle cx="40" cy="56" r="13" fill="#ffd60a" stroke="#1d2614" stroke-width="2"/><circle cx="40" cy="56" r="2.6" fill="#111"/><g fill="#111"><path d="M40 56 L46.5 44.7 A13 13 0 0 1 53 56 Z" transform="scale(.82) translate(8.8 12.3)"/><path d="M40 56 L46.5 44.7 A13 13 0 0 1 53 56 Z" transform="rotate(120 40 56) scale(.82) translate(8.8 12.3)"/><path d="M40 56 L46.5 44.7 A13 13 0 0 1 53 56 Z" transform="rotate(240 40 56) scale(.82) translate(8.8 12.3)"/></g>
     <path d="M20 36 Q14 26 22 20" stroke="#555" stroke-width="2.5" fill="none"/><path d="${starPath(23, 18, 6, 2.5)}" fill="#ff9f1c"/>` }
};
function legendSVG(subject, size = 110, locked = false) {
  return `<svg class="gear legend ${locked ? 'locked' : ''}" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">${LEGENDS[subject].art}</svg>`;
}
