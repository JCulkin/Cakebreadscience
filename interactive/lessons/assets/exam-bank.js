/* Cakebread Science — Synthetic Lesson Exam Bank renderer
   Drop-in component for Class Slides (deck.html) and Revision Notes (index.html).
   Usage:
     <div data-comp="examq" data-id="B2f-01"></div>
     <div data-comp="examq" data-id="B2f-01" data-part="b"></div>
     <div data-comp="examq" data-topic="P8"></div>
   Renders diagrams live via diagrams.js (DG). Zero past-paper content. */
(function () {
  const BASE = '/interactive/lessons/assets/exam-bank/';
  const cache = {};

  function esc(s) {
    return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  function topicFromId(id) {
    return String(id || '').split('-')[0];
  }

  async function loadTopic(code) {
    if (!cache[code]) {
      cache[code] = fetch(BASE + code + '.json', { cache: 'no-store' }).then(r => {
        if (!r.ok) throw new Error('Could not load exam bank topic ' + code);
        return r.json();
      });
    }
    return cache[code];
  }

  async function loadManifest() {
    if (!cache._manifest) {
      cache._manifest = fetch(BASE + 'manifest.json', { cache: 'no-store' }).then(r => {
        if (!r.ok) throw new Error('Could not load exam bank manifest');
        return r.json();
      });
    }
    return cache._manifest;
  }

  function renderDiagram(diag) {
    if (!diag) return '';
    if (diag.source === 'dg' && typeof DG !== 'undefined') {
      const d = DG.make(diag.maker, !!diag.hard, diag.seed);
      return d && d.svg ? d.svg : '';
    }
    if (diag.source === 'chem' && window.Lesson && typeof Lesson[diag.fn] === 'function') {
      return Lesson[diag.fn](diag.arg) || '';
    }
    return '';
  }

  function renderTable(tbl) {
    if (!tbl) return '';
    const head = `<thead><tr>${tbl.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
    const body = `<tbody>${tbl.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>`;
    return `<table class="eb-tbl">${head}${body}</table>`;
  }

  function renderNotesQuestion(q, onlyPart) {
    const parts = onlyPart ? q.parts.filter(p => p.label === onlyPart) : q.parts;
    const totMarks = parts.reduce((t, p) => t + p.marks, 0);
    const svg = renderDiagram(q.diagram);
    const tbl = renderTable(q.table);
    const hasVis = !!(svg || tbl);
    const daClass = q.sa === false ? ' da-only' : '';

    const partsHtml = parts.map((p, pi) => {
      const ms = p.markScheme;
      const isChain = ms.style === 'chain';
      const pDa = p.sa === false ? ' da-only' : '';
      const ptsHtml = ms.points.map((pt, idx) => {
        const link = isChain && pt.link && idx < ms.points.length - 1
          ? `<div class="eb-link"><span>↓</span><i>${esc(pt.link)}</i></div>` : '';
        return `<label class="eb-pt"><input type="checkbox" data-max="${p.marks}"><span class="eb-pt-code">${esc(pt.code || 'M' + (idx + 1))}</span><span class="eb-pt-txt">${pt.text}</span></label>${link}`;
      }).join('');
      const acc = ms.accept && ms.accept.length ? `<div class="eb-acc"><b>Accept:</b> ${ms.accept.map(esc).join(' · ')}</div>` : '';
      const rej = ms.reject && ms.reject.length ? `<div class="eb-rej"><b>Reject / watch out:</b> ${ms.reject.map(esc).join(' · ')}</div>` : '';
      return `<div class="eb-part${pDa}">
        <div class="eb-pq"><span>${parts.length > 1 ? `<b>(${p.label})</b> ` : ''}<span class="eb-cmd">${esc(p.command)}</span> ${p.text.replace(new RegExp('^' + p.command + '\\s+', 'i'), '')}${p.sa === false ? ' <span class="eb-badge da">DA</span>' : ''}</span><span class="eb-pmk">[${p.marks}]</span></div>
        <textarea class="eb-ans" placeholder="Write your answer before opening the mark scheme…"></textarea>
        <details class="eb-ms-det">
          <summary><span>Show mark scheme</span><span class="eb-ms-score" data-score>0 / ${p.marks}</span></summary>
          <div class="eb-ms-in">
            <div class="eb-ms-top"><span>${isChain ? 'Linked chain mark scheme' : ms.style === 'calc' ? 'Worked calculation mark scheme' : 'Mark scheme'}</span><span>${esc(ms.rule || p.marks + ' marks')}</span></div>
            <div class="eb-ms-pts">${ptsHtml}</div>
            ${acc || rej ? `<div class="eb-notes">${acc}${rej}</div>` : ''}
          </div>
        </details>
      </div>`;
    }).join('');

    return `<article class="eb-card${daClass}" data-qid="${esc(q.id)}">
      <div class="eb-head">
        <div class="eb-head-l"><span class="eb-id">${esc(q.id)}</span><span class="eb-title">${esc(q.title)}</span></div>
        <div class="eb-badges">${q.spec.map(s => `<span class="eb-badge spec">${esc(s)}</span>`).join('')}${q.sa === false ? '<span class="eb-badge da">Double Award only</span>' : ''}<span class="eb-badge marks">${totMarks} ${totMarks === 1 ? 'mark' : 'marks'}</span></div>
      </div>
      <div class="eb-body">
        <div class="eb-stim${hasVis ? ' has-vis' : ''}">
          <div class="eb-stim-txt">${q.stimulus}${svg && tbl ? tbl : ''}</div>
          ${hasVis ? `<div class="eb-vis">${svg || tbl}</div>` : ''}
        </div>
        ${partsHtml}
      </div>
    </article>`;
  }

  function renderSlideQuestion(q, onlyPart, revealed) {
    const part = onlyPart ? (q.parts.find(p => p.label === onlyPart) || q.parts[0]) : q.parts[0];
    const parts = onlyPart ? [part] : q.parts;
    const totMarks = parts.reduce((t, p) => t + p.marks, 0);
    const svg = renderDiagram(q.diagram);
    const tbl = renderTable(q.table);
    const vis = svg ? `<div class="eb-slide-fig">${svg}</div>` : '';
    const tblHtml = tbl ? `<div class="eb-slide-fig">${tbl}</div>` : '';

    // Pick focus part for detailed mark-scheme rows (either requested part or highest-mark part)
    const focus = onlyPart ? part : q.parts.slice().sort((a, b) => b.marks - a.marks)[0];
    const ms = focus.markScheme;
    const isChain = ms.style === 'chain';
    const msRows = ms.points.map((pt, i) => {
      const link = isChain && pt.link && i < ms.points.length - 1
        ? `<div class="eb-slide-link"><span>↓</span><i>${esc(pt.link)}</i></div>` : '';
      return `<div class="eb-slide-pt"><span class="eb-slide-num">${i + 1}</span><span class="eb-slide-pt-txt">${pt.text}</span><span class="eb-slide-pt-mk">[1]</span></div>${link}`;
    }).join('');
    const trap = ms.reject && ms.reject.length ? `<div class="eb-slide-trap"><b>Do not allow:</b> ${ms.reject.slice(0, 2).map(esc).join(' · ')}</div>` : '';
    const qLines = parts.map(p => `<div class="eb-pq-s">${parts.length > 1 ? `(${p.label}) ` : ''}${p.text} <span style="color:var(--acc,#005e22)">[${p.marks}]</span></div>`).join('');

    return `<div class="eb-slide">
      <div class="eb-slide-hd">
        <h2>Exam question · ${esc(q.id)}</h2>
        <span class="eb-mk">${totMarks} ${totMarks === 1 ? 'mark' : 'marks'}</span>
      </div>
      <div class="eb-slide-row">
        <div class="eb-slide-l">
          <div class="eb-slide-q">
            <div class="eb-stim-s">${q.stimulus}</div>
            ${qLines}
          </div>
          <div class="eb-slide-ms"${revealed ? '' : ' data-s="1"'}>
            <div class="eb-slide-ms-hd">
              <span class="lbl">Mark scheme${parts.length > 1 ? ` — Part (${focus.label})` : ''}${isChain ? ' · linked chain' : ''}</span>
              <span class="rule">${esc(ms.rule || focus.marks + ' marks')}</span>
            </div>
            <div>${msRows}</div>
            ${trap}
          </div>
        </div>
        ${vis || tblHtml ? `<div class="eb-slide-r">${vis}${tblHtml}</div>` : ''}
      </div>
    </div>`;
  }

  function wireSelfMark(root) {
    root.querySelectorAll('.eb-ms-det').forEach(det => {
      const boxes = [...det.querySelectorAll('input[type="checkbox"]')];
      const badge = det.querySelector('[data-score]');
      if (!boxes.length || !badge) return;
      const max = +boxes[0].dataset.max || boxes.length;
      const update = () => {
        let c = 0;
        boxes.forEach(b => {
          b.closest('.eb-pt').classList.toggle('checked', b.checked);
          if (b.checked) c++;
        });
        badge.textContent = Math.min(c, max) + ' / ' + max;
      };
      boxes.forEach(b => b.addEventListener('change', update));
    });
  }

  async function mount(el) {
    const id = el.dataset.id;
    const topic = el.dataset.topic || topicFromId(id);
    const onlyPart = el.dataset.part || '';
    const onSlide = el.dataset.mode === 'slide' || !!el.closest('#stage, #deck-src');
    try {
      const data = await loadTopic(topic);
      const qs = id ? data.questions.filter(q => q.id === id) : data.questions;
      if (!qs.length) { el.textContent = 'Exam question not found: ' + (id || topic); return; }
      if (onSlide) {
        el.innerHTML = renderSlideQuestion(qs[0], onlyPart, el.dataset.reveal === '1');
        if (qs[0].sa === false) {
          const sec = el.closest('section.ps');
          if (sec && !sec.querySelector('.stag.da')) sec.insertAdjacentHTML('afterbegin', '<i class="stag da"></i>');
        }
      } else {
        el.innerHTML = `<div class="eb-wrap">${qs.map(q => renderNotesQuestion(q, onlyPart)).join('')}</div>`;
        wireSelfMark(el);
      }
    } catch (e) {
      el.textContent = 'Could not load exam question: ' + e.message;
    }
  }

  const L = window.Lesson = window.Lesson || {};
  L.comps = L.comps || {};
  L.comps.examq = mount;
  window.CBSExamBank = { loadManifest, loadTopic, renderNotesQuestion, renderSlideQuestion, wireSelfMark, mount };
})();
