/* Study guides (22 Nov 2026). User: "a tool just for admin where I can generate print outs of the specification for students
   to tell them what's in an exam … Just pick topics/sub topics, double or single. Common mistakes. Exam advice. Print pdf for me
   and also show it online already for students in the To do area with attached REVISE buttons that presents the student quiz
   questions from this subtopics (normal mode, or questing). Gives them 15 questions and they can repeat it and get more random."
   Data: RTDB school/guides/{id} = {title, date ('YYYY-MM-DD' or ''), course 'DA'|'SA', years {Y10: true}, subs ['C1a', …], at, by}
         (admin-written, read by signed-in students — the existing `school` rule).
   Needs spec.js; misconceptions.js for the common mistakes; /js/spec-point.js for the full wording; /js/course.js for Single
   Award wording (window.CBSCourse.SA / SA_TEXT). Used by /admin/study-guide.html, /guide/ and To do (CBSGuide.todo).
   Revise links: Practice / mission with ?subs=C1a,C1b&n=15&t=<title> (15 questions; "another 15" avoids the last ones). */
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
    ['Read the command word', `<b>State / Give / Name</b>: a short answer, no explanation needed. <b>Describe</b>: say what happens or what something is like (no reasons). <b>Explain</b>: give the reason why, using “because” or “so”. <b>Calculate</b>: show your working and give the unit. <b>Suggest</b>: use what you know in a new situation. <b>Compare</b>: say how both are similar and different, mentioning both. <b>Evaluate</b>: give points for and against, then a conclusion.`],
    ['Use the marks', 'The number of marks is the number of points the examiner wants. About one minute per mark. Two-mark “explain” questions usually need a fact and the reason linked to it.'],
    ['Calculations', 'Write the equation, put the numbers in, then the answer with its unit. Convert units first (g → kg, cm³ → dm³, ms → s). You can still get method marks if the final answer is wrong.'],
    ['Graphs and diagrams', 'Sharp pencil and a ruler. Label axes with the quantity and unit, plot points as small crosses, and draw a smooth curve or straight line of best fit (not dot to dot).'],
    ['Practicals', 'Know the method, the independent / dependent / control variables, how to make it fair and safe, and how to make results more reliable (repeat and take a mean).'],
    ['In the exam', 'Answer every question: a sensible guess can score. Underline key words in the question. Leave time to check units, significant figures and that you answered what was asked.']
  ];

  /* the guide document. mode 'print' (A4 handout) or 'online' (with Revise buttons) */
  function render(g, mode = 'online') {
    const course = g.course === 'SA' ? 'SA' : 'DA', chosen = new Set(g.subs || []);
    const list = subsFor(course).filter(sb => chosen.has(sb.key));
    const keys = list.map(sb => sb.key);
    const label = course === 'SA' ? 'Science (Single Award)' : 'Science (Double Award)';
    const dd = daysTo(g.date);
    const head = `<header class="sg-head"><div class="sg-kick">Cakebread Science · Study guide · ${label}</div>
      <h1>${esc(g.title || 'Study guide')}</h1>
      ${g.date ? `<p class="sg-date">📅 ${esc(fmtDate(g.date))}${mode === 'online' && dd !== null ? (dd > 1 ? ` · in ${dd} days` : dd === 1 ? ' · tomorrow' : dd === 0 ? ' · today' : '') : ''}</p>` : ''}
      <p class="sg-lede">Everything below can come up. Tick each point as you revise it: <span class="sg-box"></span> not yet <span class="sg-box"></span> unsure <span class="sg-box"></span> confident.</p>
      ${mode === 'online' && keys.length ? `<div class="sg-rev big"><span style="flex:1 1 100%"><b>Revise all of it:</b> ${N} questions at a time from these sub-topics, new ones each go.</span>
        <a class="sg-btn" href="${reviseUrl('plain', keys, g.title)}">📝 Revise</a><a class="sg-btn q" href="${reviseUrl('quest', keys, g.title)}">⚔️ Revise in Cakebread Questing</a></div>` : ''}
    </header>`;
    let lastTopic = '';
    const body = list.map(sb => {
      const pts = pointsFor(sb, course);
      const mis = (typeof MISCON !== 'undefined' && MISCON[sb.key]) || null;
      const th = sb.L + sb.topic !== lastTopic ? `<h2 class="sg-topic" style="--c:${COL[sb.L]}">${SUBJ[sb.L]} ${sb.topic} · ${esc(sb.topicName)}</h2>` : '';
      lastTopic = sb.L + sb.topic;
      return th + `<section class="sg-sub" style="--c:${COL[sb.L]}">
        <h3><span>${sb.topic}${sb.l}</span> ${esc(sb.name)}</h3>
        <table class="sg-pts"><tbody>${pts.map(p => `<tr><td class="sg-tick"><span class="sg-box"></span><span class="sg-box"></span><span class="sg-box"></span></td>
          <td class="sg-code">${esc(p.id)}</td><td class="sg-txt">${window.SPECPT ? SPECPT.heading(p) : ''}${esc(p.text)}${p.bullets ? `<ul>${p.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}${window.SPECPT ? SPECPT.extras(p) : ''}</td></tr>`).join('')}</tbody></table>
        ${mis ? `<div class="sg-mis"><b>Common mistake:</b> “${esc(mis.o)}” <b>Actually:</b> ${esc(mis.t)}</div>` : ''}
        ${mode === 'online' ? `<div class="sg-rev">Revise ${sb.topic}${sb.l}: <a class="sg-btn sm" href="${reviseUrl('plain', [sb.key], `${g.title || 'Study guide'} · ${sb.topic}${sb.l}`)}">📝 ${N} questions</a><a class="sg-btn sm q" href="${reviseUrl('quest', [sb.key], `${g.title || 'Study guide'} · ${sb.topic}${sb.l}`)}">⚔️ Questing</a></div>` : ''}
      </section>`;
    }).join('');
    const advice = `<section class="sg-adv"><h2 class="sg-topic" style="--c:#111">Exam advice</h2>${ADVICE.map(([h, t]) => `<p><b>${h}.</b> ${t}</p>`).join('')}
      ${mode === 'print' && keys.length ? `<p class="sg-web">Revise online: sign in at <b>cakebreadscience.com</b> → <b>To do</b> → this study guide → <b>Revise</b> (${N} questions at a time on exactly these topics).</p>` : ''}</section>`;
    return `<article class="sg sg-${mode}">${head}${list.length ? body : '<p>No sub-topics chosen yet.</p>'}${advice}</article>`;
  }

  const CSS = `.sg{font-family:'Barlow',Arial,sans-serif;color:#111;line-height:1.4;background:#fff}
.sg-head{border-bottom:3px solid #111;padding-bottom:8px;margin-bottom:10px}
.sg-kick{font:700 12px 'Barlow',Arial;letter-spacing:1.5px;text-transform:uppercase;color:#5a5a5a}
.sg h1{font:900 34px/1 'Barlow Condensed',Arial;text-transform:uppercase;margin:4px 0}
.sg-date{font-weight:700;margin:2px 0}.sg-lede{font-size:14px;color:#333;margin:4px 0}
.sg-box{display:inline-block;width:12px;height:12px;border:1.5px solid #111;border-radius:2px;vertical-align:-1px;margin:0 2px 0 6px}
.sg-topic{font:900 22px 'Barlow Condensed',Arial;text-transform:uppercase;color:var(--c);border-bottom:2px solid var(--c);margin:16px 0 6px;break-after:avoid}
.sg-sub{margin:8px 0 12px;break-inside:auto}
.sg-sub h3{font:900 17px 'Barlow Condensed',Arial;text-transform:uppercase;margin:6px 0 4px;break-after:avoid}
.sg-sub h3 span{background:var(--c);color:#fff;padding:0 6px;margin-right:4px}
.sg-pts{width:100%;border-collapse:collapse;font-size:13.5px}
.sg-pts td{border-bottom:1px solid #e3ddcf;padding:4px 4px;vertical-align:top}
.sg-pts tr{break-inside:avoid}
.sg-tick{width:66px;white-space:nowrap}.sg-tick .sg-box{margin:2px 2px 0 0}
.sg-code{width:38px;font-weight:900;color:var(--c)}
.sg-txt ul{margin:2px 0 0 18px}
.sg-mis{margin:6px 0 2px;font-size:13px;background:#fff7e0;border-left:4px solid #e0a800;padding:5px 8px;break-inside:avoid}
.sg-adv p{font-size:13.5px;margin:5px 0}
.sg-web{background:#eef4ff;border-left:4px solid #1d4ed8;padding:5px 8px}
.sg-rev{margin:6px 0 4px;font-size:14px;display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.sg-rev.big{background:#f6f4ee;border:2px solid #111;padding:8px 10px;margin-top:8px}
.sg-btn{display:inline-block;font:800 14px 'Barlow',Arial;background:#facc15;color:#111;border:2px solid #111;padding:5px 12px;text-decoration:none;border-radius:4px}
.sg-btn.q{background:#111;color:#fff}.sg-btn.sm{font-size:13px;padding:2px 9px}
@media print{.sg-rev{display:none}.sg{font-size:12px}.sg h1{font-size:28px}@page{size:A4;margin:12mm}}`;
  let styled = false;
  function style() { if (styled || typeof document === 'undefined') return; styled = true; const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); }

  /* guides for a student: their year (or any year if the guide has none ticked) and their course; until the day after the exam */
  function forMe(all, year, sa) {
    return Object.entries(all || {}).map(([id, g]) => Object.assign({ id }, g))
      .filter(g => g && !g.hidden && (g.subs || []).length)
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
      ${mine.map(g => { const d = daysTo(g.date), k = g.subs;
        return `<div class="sg-row" style="border-top:1px solid #e3ddcf;padding:8px 0"><b style="font-size:16px">📖 ${esc(g.title || 'Study guide')}</b>${g.date ? ` <span class="small muted">· ${esc(fmtDate(g.date))}${d > 1 ? ` · in ${d} days` : d === 1 ? ' · tomorrow' : d === 0 ? ' · today' : ''}</span>` : ''}
          <div class="sg-rev"><a class="sg-btn" style="background:#fff" href="/guide/?id=${encodeURIComponent(g.id)}">Open the guide</a><a class="sg-btn" href="${reviseUrl('plain', k, g.title)}">📝 Revise</a><a class="sg-btn q" href="${reviseUrl('quest', k, g.title)}">⚔️ Revise in Questing</a></div></div>`; }).join('')}</div>`;
  }
  window.CBSGuide = { N, subs, subsFor, pointsFor, render, style, forMe, loadAll, todo, reviseUrl, fmtDate, daysTo, ADVICE };
})();
