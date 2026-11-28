/* Cakebread Science — Synthetic Lesson Exam Bank renderer
   Drop-in component for Class Slides (deck.html) and Revision Notes (index.html).
   Usage:
     <div data-comp="examq" data-id="B2f-01"></div>
     <div data-comp="examq" data-id="B2f-01" data-part="b"></div>
     <div data-comp="examq" data-topic="P8"></div>
   Renders diagrams live via diagrams.js (DG). Zero past-paper content. */
(function () {
  const BASE = '/interactive/lessons/assets/exam-bank/';
  const CSS_HREF = '/interactive/lessons/assets/exam-bank.css';
  const cache = {};

  function ensureCss() {
    if (typeof document === 'undefined') return;
    if (!document.querySelector('link[href*="exam-bank.css"]')) {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = CSS_HREF;
      (document.head || document.documentElement).appendChild(l);
    }
  }
  ensureCss();

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

  function renderTable(tbl, cls) {
    if (!tbl) return '';
    const head = `<thead><tr>${tbl.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
    const body = `<tbody>${tbl.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>`;
    return `<table class="${cls || 'eb-tbl'}">${head}${body}</table>`;
  }

  function renderNotesQuestion(q, onlyPart) {
    const parts = onlyPart ? q.parts.filter(p => p.label === onlyPart) : q.parts;
    const single = onlyPart ? parts[0] : null;
    const totMarks = parts.reduce((t, p) => t + p.marks, 0);
    const svg = (single && single.hideDiagram) ? '' : renderDiagram(q.diagram);
    const tbl = (single && single.hideTable) ? '' : renderTable(q.table, 'eb-tbl');
    const stim = (single && single.stimulus) ? single.stimulus : q.stimulus;
    const hasVis = !!(svg || tbl);
    const daClass = q.sa === false ? ' da-only' : '';

    const partsHtml = parts.map(p => {
      const ms = p.markScheme;
      const isChain = ms.style === 'chain';
      const pDa = p.sa === false ? ' da-only' : '';
      const ptsHtml = ms.points.map((pt, idx) => {
        const link = isChain && pt.link && idx < ms.points.length - 1
          ? `<div class="eb-link"><span>↓</span><i>${esc(pt.link)}</i></div>` : '';
        return `<label class="eb-pt"><input type="checkbox" data-max="${p.marks}"><span class="eb-pt-code">${esc(pt.code || 'M' + (idx + 1))}</span><span class="eb-pt-txt">${pt.text}</span></label>${link}`;
      }).join('');
      const acc = ms.accept && ms.accept.length ? `<div class="eb-acc"><b>Accept:</b> ${ms.accept.map(esc).join('; ')}</div>` : '';
      const rej = ms.reject && ms.reject.length ? `<div class="eb-rej"><b>Watch out (do not allow):</b> ${ms.reject.map(esc).join('; ')}</div>` : '';
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
          <div class="eb-stim-txt">${stim}${svg && tbl ? tbl : ''}</div>
          ${hasVis ? `<div class="eb-vis">${svg || tbl}</div>` : ''}
        </div>
        ${partsHtml}
      </div>
    </article>`;
  }

  function renderSlideQuestion(q, onlyPart, revealed, hideHd) {
    const part = onlyPart ? (q.parts.find(p => p.label === onlyPart) || q.parts[0]) : null;
    const parts = onlyPart ? [part] : q.parts;
    const totMarks = parts.reduce((t, p) => t + p.marks, 0);
    const stim = (part && part.stimulus) ? part.stimulus : q.stimulus;
    const svg = (part && part.hideDiagram) ? '' : renderDiagram(q.diagram);
    const tbl = (part && part.hideTable) ? '' : renderTable(q.table, 'eb-slide-tbl');
    const vis = svg ? `<div class="eb-slide-fig">${svg}</div>` : '';
    const tblHtml = tbl ? `<div class="eb-slide-fig eb-slide-fig-tbl">${tbl}</div>` : '';
    const hasRight = !!(vis || tblHtml);
    const tableOnly = !svg && !!tbl;
    const onCls = revealed ? ' on' : '';

    // Full-width dark question banner (clear, high-contrast, never crowds the mark scheme)
    const multi = parts.length > 1;
    const qLines = parts.map(p => {
      const lbl = multi ? `<span class="eb-plbl">(${p.label})</span> ` : '';
      const mk = multi ? ` <span class="eb-pmk-in">[${p.marks}]</span>` : '';
      return `<div class="eb-pq-s">${lbl}${p.text}${mk}</div>`;
    }).join('');
    const bannerCls = multi ? (parts.length >= 3 ? ' dense' : ' multi') : '';
    const banner = `<div class="eb-slide-banner${bannerCls}">
      <div class="eb-slide-banner-txt">
        <div class="eb-stim-s">${stim}</div>
        ${qLines}
      </div>
      <div class="eb-mk-pill">[${totMarks}]</div>
    </div>`;

    // Collect concise examiner watch-outs, prioritizing the highest-mark / Explain parts first
    const rejects = [];
    parts.slice().sort((a, b) => (b.marks - a.marks) || ((b.markScheme.style === 'chain' ? 1 : 0) - (a.markScheme.style === 'chain' ? 1 : 0))).forEach(p => {
      (p.markScheme.reject || []).forEach(r => {
        if (rejects.length < 2 && !rejects.includes(r)) rejects.push(r);
      });
    });

    let msHtml = '';
    let maxStep = 1;

    if (!multi) {
      // Single-part slide: stepped point-by-point reveal (matches gold-standard exam slide)
      const p = parts[0];
      const ms = p.markScheme;
      const isChain = ms.style === 'chain';
      const isCalc = ms.style === 'calc';
      const nPts = ms.points.length;
      maxStep = Math.max(1, nPts);
      const compactMs = nPts >= 4 ? ' compact' : '';
      const msTitle = isChain ? 'Mark scheme — linked chain' : isCalc ? 'Mark scheme — worked calculation' : 'Mark scheme';
      const rows = ms.points.map((pt, i) => {
        const st = i + 1;
        const link = isChain && pt.link && i < nPts - 1
          ? `<div class="eb-slide-link${onCls}" data-s="${st + 1}"><span>↓</span><i>${esc(pt.link)}</i></div>` : '';
        return `<div class="eb-slide-pt${onCls}" data-s="${st}"><span class="eb-slide-num">${i + 1}</span><span class="eb-slide-pt-txt">${pt.text}</span><span class="eb-slide-pt-mk">[1]</span></div>${link}`;
      }).join('');
      msHtml = `<div class="eb-slide-ms${compactMs}">
        <div class="eb-slide-ms-hd${onCls}" data-s="1">
          <span class="lbl">${msTitle}</span>
          <span class="rule">${esc(ms.rule || p.marks + ' marks')}</span>
        </div>
        <div class="eb-slide-pts">${rows}</div>
      </div>`;
    } else {
      // Multi-part slide: reveal ALL parts' mark schemes cleanly, part-by-part!
      maxStep = parts.length;
      const totalPts = parts.reduce((n, p) => n + p.markScheme.points.length, 0);
      const denseCls = (totalPts >= 5 || parts.length >= 3) ? ' dense' : '';
      const partBlocks = parts.map((p, pi) => {
        const st = pi + 1;
        const ms = p.markScheme;
        const isChain = ms.style === 'chain';
        // Ultra-clean 1-row card for 1-mark / 1-point parts
        if (ms.points.length === 1) {
          return `<div class="eb-mp-card eb-mp-one${onCls}" data-s="${st}">
            <span class="eb-mp-tag">(${p.label})</span>
            <span class="eb-mp-txt">${ms.points[0].text}</span>
            <span class="eb-mp-mk">[${p.marks}]</span>
          </div>`;
        }
        const ptsRows = ms.points.map((pt, idx) => {
          const arrow = isChain && idx > 0 ? '<span class="eb-mp-arr">↓</span>' : `<span class="eb-mp-dot">${idx + 1}</span>`;
          return `<div class="eb-mp-row">${arrow}<span class="eb-mp-txt">${pt.text}</span></div>`;
        }).join('');
        return `<div class="eb-mp-card${onCls}" data-s="${st}">
          <div class="eb-mp-hd">
            <span class="eb-mp-lbl"><span class="eb-mp-tag">(${p.label})</span> ${isChain ? 'Linked mark scheme' : 'Mark scheme'}</span>
            <span class="eb-mp-rule">${esc(ms.rule || p.marks + ' marks')}</span>
          </div>
          <div class="eb-mp-list">${ptsRows}</div>
        </div>`;
      }).join('');
      msHtml = `<div class="eb-slide-ms eb-slide-ms-multi${denseCls}">
        <div class="eb-slide-ms-hd${onCls}" data-s="1">
          <span class="lbl">Mark scheme — all parts</span>
          <span class="rule">Click to reveal (${parts.map(p => p.label).join(' → ')})</span>
        </div>
        <div class="eb-mp-stack">${partBlocks}</div>
      </div>`;
    }

    const trapBox = rejects.length
      ? `<div class="eb-slide-trap${onCls}" data-s="${maxStep}"><span class="eb-trap-lbl">Watch out — do not say:</span> ${rejects.map(esc).join('; ')}</div>`
      : '';
    const hdHtml = hideHd ? '' : `<div class="eb-slide-hd"><h2>Exam question — ${esc(q.id)}</h2></div>`;

    const rightCol = hasRight
      ? `<div class="eb-slide-r${tableOnly ? ' tbl-only' : ''}">${vis}${tblHtml}${trapBox}</div>`
      : '';
    const leftTrap = !hasRight ? trapBox : '';

    return {
      maxStep,
      html: `<div class="eb-slide">
        ${hdHtml}
        ${banner}
        <div class="eb-slide-row${tableOnly ? ' tbl-only' : ''}">
          <div class="eb-slide-l">${msHtml}${leftTrap}</div>
          ${rightCol}
        </div>
      </div>`
    };
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
    ensureCss();
    const id = el.dataset.id;
    const topic = el.dataset.topic || topicFromId(id);
    const onlyPart = el.dataset.part || '';
    const onSlide = el.dataset.mode === 'slide' || !!el.closest('#stage, #deck-src');
    const sec = onSlide ? el.closest('section.ps') : null;
    const hideHd = el.dataset.nohd === '1' || !!(sec && sec.querySelector(':scope > h2'));

    // Synchronously register a data-s="1" placeholder so lesson.js & diff/index.html
    // immediately count step 1 (p.max = 1) before the async JSON fetch resolves.
    if (onSlide && el.dataset.reveal !== '1') {
      el.innerHTML = '<div class="eb-slide"><div class="eb-slide-ms" data-s="1"></div></div>';
    }

    try {
      const data = await loadTopic(topic);
      const qs = id ? data.questions.filter(q => q.id === id) : data.questions;
      if (!qs.length) { el.textContent = 'Exam question not found: ' + (id || topic); return; }
      if (onSlide) {
        const pre = el.querySelector('[data-s="1"]');
        const alreadyShown = el.dataset.reveal === '1' || !!(pre && pre.classList.contains('on')) || !!(sec && sec.shown >= 1);
        const res = renderSlideQuestion(qs[0], onlyPart, alreadyShown, hideHd);
        el.innerHTML = res.html;
        if (sec) {
          sec.max = Math.max(sec.max || 0, res.maxStep);
          if (alreadyShown) {
            sec.shown = sec.max;
            el.querySelectorAll('[data-s]').forEach(e => e.classList.add('on'));
            const h = sec.querySelector('.hint');
            if (h) h.style.display = 'none';
          }
          if (qs[0].sa === false && !sec.querySelector(':scope > .stag.da')) {
            sec.insertAdjacentHTML('afterbegin', '<i class="stag da"></i>');
          }
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
  window.CBSExamBank = {
    loadManifest,
    loadTopic,
    renderNotesQuestion,
    renderSlideQuestion: (q, onlyPart, revealed, hideHd) => renderSlideQuestion(q, onlyPart, revealed, hideHd).html,
    wireSelfMark,
    mount
  };
})();
