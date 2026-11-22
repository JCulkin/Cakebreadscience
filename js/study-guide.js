/* Study guides (22 Nov 2026). User: "a tool just for admin where I can generate print outs of the specification for students
   to tell them what's in an exam … Just pick topics/sub topics, double or single. Common mistakes. Exam advice. Print pdf for me
   and also show it online already for students in the To do area with attached REVISE buttons that presents the student quiz
   questions from this subtopics (normal mode, or questing). Gives them 15 questions and they can repeat it and get more random."
   22 Nov later: "remove the checkboxes … remove the common mistakes. Add a key words section instead … massively shorten exam
   advice … let me select and unselect exact spec points". Key words come from /js/key-words.js (window.KEYWORDS).
   Data: RTDB school/guides/{id} = {title, date ('YYYY-MM-DD' or ''), course 'DA'|'SA', years {Y10: true}, subs ['C1a', …],
         pts ['C1.4', …] (exact points; missing = every point of those sub-topics), at, by}
         (admin-written, read by signed-in students — the existing `school` rule).
   Needs spec.js; key-words.js; /js/spec-point.js for the full wording; /js/course.js for Single
   Award wording (window.CBSCourse.SA / SA_TEXT). Used by /admin/study-guide.html, /guide/ and To do (CBSGuide.todo).
   Revise links: Practice / mission with ?subs=C1a,C2.5,C2.7&n=15&t=<title> (sub-topic or point keys) (15 questions; "another 15" avoids the last ones). */
(function () {
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const N = 15, Q = '/interactive/spec-quiz/';
  const COL = { B: '#005e22', C: '#c8001e', P: '#d08000' }, SUBJ = { B: 'Biology', C: 'Chemistry', P: 'Physics' };

  /* the spec, sub-topic by sub-topic (from the full spec.js; Single Award filtering is done per guide) */
  let SUBS = null;
  function subs() {
    if (SUBS) return SUBS;
    SUBS = [];
    SPEC.forEach(s => s.topics.forEach(t => t.subs.forEach(sb => {
      if (sb.name === 'Units') return;
      const L = s.name[0];
      SUBS.push({ key: L + t.n + sb.l, L, subj: s.name, topic: t.n, topicName: t.name, l: sb.l, name: sb.name,
        points: sb.points.map(p => Object.assign({ key: p.key || L + p.id }, p)) });
    })));
    return SUBS;
  }
  const SAset = () => (window.CBSCourse && CBSCourse.SA) || null;
  const inCourse = (key, course) => course !== 'SA' || !SAset() || SAset().has(key);
  /* points of a sub-topic for this course, with Single Award wording where it is narrower */
  function pointsFor(sb, course) {
    return sb.points.filter(p => inCourse(p.key, course)).map(p => {
      const sa = course === 'SA' && window.CBSCourse && CBSCourse.SA_TEXT && CBSCourse.SA_TEXT[p.key];
      return sa ? Object.assign({}, p, typeof sa === 'string' ? { text: sa } : sa) : p;
    });
  }
  const subsFor = course => subs().filter(sb => pointsFor(sb, course).length);
  const reviseUrl = (mode, keys, title) => `${Q}${mode === 'quest' ? 'adventurer-mission.html' : 'practice.html'}?subs=${keys.join(',')}&n=${N}&t=${encodeURIComponent(title || '')}`;
  const fmtDate = d => { if (!d) return ''; try { return new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return d; } };
  function daysTo(d) { if (!d) return null; const a = new Date(d + 'T12:00:00'), b = new Date(); b.setHours(12, 0, 0, 0); return Math.round((a - b) / 864e5); }

  const ADVICE = [
    ['Command words', '<b>State</b> = a short fact. <b>Describe</b> = say what happens. <b>Explain</b> = say why (“because…”). <b>Calculate</b> = show working and give the unit. <b>Evaluate</b> = both sides, then a conclusion.'],
    ['Marks', 'One mark ≈ one point. A 3-mark question needs three separate points.'],
    ['Key words', 'Use the key words in your answers: they are often what the marks are for.'],
    ['Graphs', 'Label both axes with units, plot neatly in pencil, and draw a line or curve of best fit.']
  ];

  /* the points a guide covers: its sub-topics, narrowed to g.pts when exact points were picked (older guides: whole sub-topics) */
  function chosen(g) {
    const course = g.course === 'SA' ? 'SA' : 'DA', subsSet = new Set(g.subs || []), pts = g.pts ? new Set(g.pts) : null;
    return subsFor(course).filter(sb => subsSet.has(sb.key)).map(sb => {
      const all = pointsFor(sb, course), use = pts ? all.filter(p => pts.has(p.key)) : all;
      return { sb, all, pts: use, whole: use.length === all.length };
    }).filter(x => x.pts.length);
  }
  /* Revise tokens: a whole sub-topic as its key (C1a), part of one as its point keys (C1.4) */
  const tokens = list => list.flatMap(x => x.whole ? [x.sb.key] : x.pts.map(p => p.key));
  const flat = p => JSON.stringify([p.text, p.bullets, p.eq, p.note, p.detail]).toLowerCase();
  /* key words for these points that the spec wording doesn't already contain (each word once per guide) */
  function keyWords(pts, seen, txt) {
    const KW = window.KEYWORDS || {}; txt = txt || pts.map(flat).join(' ');
    const out = [];
    pts.forEach(p => (KW[p.key] || []).forEach(([w, m]) => {
      const core = w.toLowerCase().replace(/\s*\(.*?\)\s*/g, ' ').trim(), id = core;
      if (seen.has(id)) return; seen.add(id);
      if (core.length > 3 && new RegExp('(^|[^a-z])' + core.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(e?s)?([^a-z]|$)').test(txt)) return;   // whole words (or their plural) only
      out.push([w, m]);
    }));
    return out;
  }

  /* the guide document. mode 'print' (A4 handout) or 'online' (with Revise buttons) */
  function render(g, mode = 'online') {
    const course = g.course === 'SA' ? 'SA' : 'DA', list = chosen(g), keys = tokens(list), seen = new Set();
    /* key words (user, 22 Nov): bound to the ticked points, all in one section above the exam advice, grouped by sub-topic;
       a word already in the wording of any point on this guide is left out */
    const allTxt = list.flatMap(x => x.pts).map(flat).join(' ');
    const kwGroups = list.map(x => ({ x, kw: keyWords(x.pts, seen, allTxt) })).filter(k => k.kw.length);
    const label = course === 'SA' ? 'Single Award' : 'Double Award';
    const dd = daysTo(g.date), T = g.title || 'Study guide';
    const head = `<header class="sg-head"><div class="sg-hl"><h1>${esc(T)}</h1>
      ${g.date ? `<p class="sg-date">📅 ${esc(fmtDate(g.date))}${mode === 'online' && dd !== null ? (dd > 1 ? ` · in ${dd} days` : dd === 1 ? ' · tomorrow' : dd === 0 ? ' · today' : '') : ''}</p>` : ''}</div>
      <div class="sg-course">${label}</div></header>
      ${mode === 'online' && keys.length ? `<div class="sg-rev big"><span style="flex:1 1 100%"><b>Revise all of it:</b> ${N} questions at a time on exactly these points, new ones each go.</span>
        <a class="sg-btn" href="${reviseUrl('plain', keys, T)}">📝 Revise</a><a class="sg-btn q" href="${reviseUrl('quest', keys, T)}">⚔️ Revise in Cakebread Questing</a></div>` : ''}`;
    let lastTopic = '';
    const body = list.map(x => {
      const sb = x.sb, code = sb.topic + sb.l;
      const th = sb.L + sb.topic !== lastTopic ? `<h2 class="sg-topic" style="--c:${COL[sb.L]}">${SUBJ[sb.L]} ${sb.topic} · ${esc(sb.topicName)}</h2>` : '';
      lastTopic = sb.L + sb.topic;
      return th + `<section class="sg-sub" style="--c:${COL[sb.L]}">
        <h3><span>${code}</span> ${esc(sb.name)}</h3>
        <table class="sg-pts"><tbody>${x.pts.map(p => `<tr><td class="sg-code">${esc(p.id)}</td><td class="sg-txt">${window.SPECPT ? SPECPT.heading(p) : ''}${esc(p.text)}${p.bullets ? `<ul>${p.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}${window.SPECPT ? SPECPT.extras(p) : ''}</td></tr>`).join('')}</tbody></table>
        ${mode === 'online' ? `<div class="sg-rev">Revise ${code}: <a class="sg-btn sm" href="${reviseUrl('plain', tokens([x]), `${T} · ${code}`)}">📝 ${N} questions</a><a class="sg-btn sm q" href="${reviseUrl('quest', tokens([x]), `${T} · ${code}`)}">⚔️ Questing</a></div>` : ''}
      </section>`;
    }).join('');
    const kwSec = kwGroups.length ? `<section class="sg-kws"><h2 class="sg-topic" style="--c:#111">Key words</h2>
      <p class="sg-kwlede">Not in the spec wording above, but you need to know them and use them in your answers.</p>
      ${kwGroups.map(({ x, kw }) => `<div class="sg-kwg" style="--c:${COL[x.sb.L]}"><h4><span>${x.sb.topic}${x.sb.l}</span> ${esc(x.sb.name)}</h4><ul>${kw.map(([w, m]) => `<li><b>${esc(w)}</b>: ${esc(m)}</li>`).join('')}</ul></div>`).join('')}</section>` : '';
    const advice = `<section class="sg-adv"><h2 class="sg-topic" style="--c:#111">Exam advice</h2><ul>${ADVICE.map(([h, t]) => `<li><b>${h}:</b> ${t}</li>`).join('')}</ul></section>`;
    return `<article class="sg sg-${mode}">${head}${list.length ? body : '<p>No spec points chosen yet.</p>'}${kwSec}${advice}</article>`;
  }

  const CSS = `.sg{font-family:'Barlow',Arial,sans-serif;color:#111;line-height:1.4;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.sg-head{border-bottom:3px solid #111;padding-bottom:8px;margin-bottom:10px;display:flex;align-items:flex-start;gap:12px}
.sg-hl{flex:1;min-width:0}
.sg h1{font:900 34px/1 'Barlow Condensed',Arial;text-transform:uppercase;margin:0}
.sg-course{font:900 15px 'Barlow Condensed',Arial;text-transform:uppercase;letter-spacing:.5px;border:2px solid #111;padding:2px 8px;white-space:nowrap}
.sg-date{font-weight:700;margin:4px 0 0}
.sg-topic{font:900 22px 'Barlow Condensed',Arial;text-transform:uppercase;color:var(--c);border-bottom:2px solid var(--c);margin:16px 0 6px;break-after:avoid}
.sg-sub{margin:8px 0 12px;break-inside:auto}
.sg-sub h3{font:900 17px 'Barlow Condensed',Arial;text-transform:uppercase;margin:6px 0 4px;break-after:avoid}
.sg-sub h3 span{background:var(--c);color:#fff;padding:0 6px;margin-right:4px}
.sg-pts{width:100%;border-collapse:collapse;font-size:13.5px}
.sg-pts td{border-bottom:1px solid #e3ddcf;padding:4px 4px;vertical-align:top}
.sg-pts tr{break-inside:avoid}
.sg-code{width:38px;font-weight:900;color:var(--c)}
.sg-txt ul{margin:2px 0 0 18px}
.sg-kwlede{font-size:13px;color:#444;margin:-2px 0 6px}
.sg-kwg{margin:0 0 8px;border-left:4px solid var(--c);padding-left:8px}
.sg-kwg h4{font:900 14px 'Barlow Condensed',Arial;text-transform:uppercase;margin:0 0 2px;break-after:avoid}
.sg-kwg h4 span{color:var(--c)}
.sg-kwg ul{list-style:none;columns:2;column-gap:18px;font-size:13px}.sg-kwg li{break-inside:avoid;margin:1px 0}
@media(max-width:600px){.sg-kwg ul{columns:1}.sg h1{font-size:28px}}
.sg-adv ul{margin-left:18px;font-size:13.5px}.sg-adv li{margin:3px 0}
.sg-rev{margin:6px 0 4px;font-size:14px;display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.sg-rev.big{background:#f6f4ee;border:2px solid #111;padding:8px 10px;margin:0 0 8px}
.sg-btn{display:inline-block;font:800 14px 'Barlow',Arial;background:#facc15;color:#111;border:2px solid #111;padding:5px 12px;text-decoration:none;border-radius:4px}
.sg-btn.q{background:#111;color:#fff}.sg-btn.sm{font-size:13px;padding:2px 9px}
@media print{.sg-rev{display:none}.sg{font-size:12px}.sg h1{font-size:28px}@page{size:A4;margin:12mm}}`;
  let styled = false;
  function style() { if (styled || typeof document === 'undefined') return; styled = true; const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); }

  /* guides for a student: their year (or any year if the guide has none ticked) and their course; until the day after the exam */
  function forMe(all, year, sa) {
    return Object.entries(all || {}).map(([id, g]) => Object.assign({ id }, g))
      .filter(g => g && !g.hidden && (g.subs || []).length && (!g.pts || g.pts.length))
      .filter(g => (g.course === 'SA') === !!sa)
      .filter(g => !g.years || !Object.keys(g.years).length || (year && g.years['Y' + year]))
      .filter(g => { const d = daysTo(g.date); return d === null || d >= -1; })
      .sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
  }
  async function loadAll(rt) {
    if (window.CBSSchool && CBSSchool.rtGet) return (await CBSSchool.rtGet(rt, 'school/guides', 15000)) || {};
    return (await rt.ref('school/guides').once('value')).val() || {};
  }
  /* To do: one card listing this student's study guides */
  async function todo(el) {
    if (!el || !window.firebase || !firebase.database) return;
    style();
    let all = null; try { all = await loadAll(firebase.database()); } catch (e) { el.innerHTML = ''; return; }
    const y = window.CBSYear && CBSYear.year, sa = !!(window.CBSCourse && CBSCourse.sa);
    const mine = forMe(all, y, sa);
    if (!mine.length) { el.innerHTML = ''; return; }
    el.innerHTML = `<div class="card"><h2>Study guides</h2><p class="small muted" style="margin-bottom:6px">What's in your test, with ${N} revision questions at a time on exactly those topics.</p>
      ${mine.map(g => { const d = daysTo(g.date), k = tokens(chosen(g));
        return `<div class="sg-row" style="border-top:1px solid #e3ddcf;padding:8px 0"><b style="font-size:16px">📖 ${esc(g.title || 'Study guide')}</b>${g.date ? ` <span class="small muted">· ${esc(fmtDate(g.date))}${d > 1 ? ` · in ${d} days` : d === 1 ? ' · tomorrow' : d === 0 ? ' · today' : ''}</span>` : ''}
          <div class="sg-rev"><a class="sg-btn" style="background:#fff" href="/guide/?id=${encodeURIComponent(g.id)}">Open the guide</a><a class="sg-btn" href="${reviseUrl('plain', k, g.title)}">📝 Revise</a><a class="sg-btn q" href="${reviseUrl('quest', k, g.title)}">⚔️ Revise in Questing</a></div></div>`; }).join('')}</div>`;
  }
  window.CBSGuide = { N, subs, subsFor, pointsFor, chosen, tokens, keyWords, render, style, forMe, loadAll, todo, reviseUrl, fmtDate, daysTo, ADVICE };
})();
