/* Topic booklets: graph drawer.
   <div class="graph" data-g='{"w":80,"h":55,
      "x":{"min":0,"max":10,"major":2,"minor":5,"label":"Time (s)"},
      "y":{"min":0,"max":20,"major":5,"minor":5,"label":"Speed (m/s)"},
      "lines":[{"pts":[[0,0],[4,20]],"dash":false,"w":1.4}],
      "shade":[{"pts":[[0,0],[4,20],[4,0]],"c":"#fde8eb"}],
      "dots":[[2,10]], "labels":[{"x":2,"y":12,"t":"A"}]}'></div>
   w/h = size of the plotting area in mm on paper. minor = minor divisions per major square
   (0 = no minor grid). "plain": true draws axes only (no grid) for sketch graphs.
   Also: <div class="dc" data-mol="H2O"></div> and <div class="dc" data-ionic="NaCl" data-view="after">
   use the lessons' dot-and-cross engine (interactive/lessons/assets/chem.js) when it is loaded. */
(function () {
  const S = 4; // svg units per mm
  const f = n => +n.toFixed(2);

  function graph(g) {
    const W = g.w * S, H = g.h * S, L = 13 * S, B = 10 * S, T = 3 * S, R = 4 * S;
    const X = g.x, Y = g.y;
    const px = v => L + (v - X.min) / (X.max - X.min) * W;
    const py = v => T + H - (v - Y.min) / (Y.max - Y.min) * H;
    let s = "";
    if (!g.plain) {
      const grid = (A, isX, step, col, sw) => {
        for (let v = A.min; v <= A.max + 1e-9; v += step) {
          const p = isX ? px(v) : py(v);
          s += isX ? `<line x1="${f(p)}" y1="${T}" x2="${f(p)}" y2="${T + H}" stroke="${col}" stroke-width="${sw}"/>`
                   : `<line x1="${L}" y1="${f(p)}" x2="${L + W}" y2="${f(p)}" stroke="${col}" stroke-width="${sw}"/>`;
        }
      };
      if (X.minor) grid(X, true, X.major / X.minor, "#d9d9d9", 0.7);
      if (Y.minor) grid(Y, false, Y.major / Y.minor, "#d9d9d9", 0.7);
      grid(X, true, X.major, "#9a9a9a", 1);
      grid(Y, false, Y.major, "#9a9a9a", 1);
    }
    (g.shade || []).forEach(sh => {
      s += `<polygon points="${sh.pts.map(p => f(px(p[0])) + "," + f(py(p[1]))).join(" ")}" fill="${sh.c || "#ffe2a8"}" fill-opacity="${sh.o || 0.75}" stroke="none"/>`;
    });
    // axes
    s += `<line x1="${L}" y1="${T + H}" x2="${L + W + (g.plain ? 8 : 0)}" y2="${T + H}" stroke="#111" stroke-width="2"/>`;
    s += `<line x1="${L}" y1="${T + H}" x2="${L}" y2="${T - (g.plain ? 8 : 0)}" stroke="#111" stroke-width="2"/>`;
    if (g.plain) {
      s += `<path d="M${L + W + 8} ${T + H}l-9 -5v10z" fill="#111"/><path d="M${L} ${T - 8}l-5 9h10z" fill="#111"/>`;
    }
    // tick labels
    if (!g.noticks) {
      for (let v = X.min; v <= X.max + 1e-9; v += X.major) {
        s += `<text x="${f(px(v))}" y="${T + H + 13}" font-size="11" text-anchor="middle">${+v.toFixed(3)}</text>`;
      }
      for (let v = Y.min; v <= Y.max + 1e-9; v += Y.major) {
        s += `<text x="${L - 5}" y="${f(py(v) + 4)}" font-size="11" text-anchor="end">${+v.toFixed(3)}</text>`;
      }
    } else {
      s += `<text x="${L - 5}" y="${T + H + 13}" font-size="11" text-anchor="end">0</text>`;
    }
    s += `<text x="${L + W / 2}" y="${T + H + 30}" font-size="12.5" font-weight="bold" text-anchor="middle">${X.label || ""}</text>`;
    s += `<text transform="translate(${L - 36} ${T + H / 2}) rotate(-90)" font-size="12.5" font-weight="bold" text-anchor="middle">${Y.label || ""}</text>`;
    (g.lines || []).forEach(ln => {
      const d = ln.curve
        ? "M" + ln.pts.map(p => f(px(p[0])) + " " + f(py(p[1]))).join(" L")
        : "M" + ln.pts.map(p => f(px(p[0])) + " " + f(py(p[1]))).join(" L");
      s += `<path d="${d}" fill="none" stroke="${ln.c || "#111"}" stroke-width="${(ln.w || 1.6) * 2}" stroke-linejoin="round" stroke-linecap="round"${ln.dash ? ' stroke-dasharray="8 6"' : ""}/>`;
    });
    (g.dots || []).forEach(p => {
      const x = px(p[0]), y = py(p[1]);
      s += `<path d="M${f(x - 5)} ${f(y - 5)}L${f(x + 5)} ${f(y + 5)}M${f(x - 5)} ${f(y + 5)}L${f(x + 5)} ${f(y - 5)}" stroke="#111" stroke-width="2"/>`;
    });
    (g.labels || []).forEach(l => {
      s += `<text x="${f(px(l.x) + (l.dx || 0) * S)}" y="${f(py(l.y) + (l.dy || 0) * S)}" font-size="${l.size || 13}" font-weight="bold" text-anchor="${l.a || "middle"}" fill="${l.c || "#111"}">${l.t}</text>`;
    });
    const vw = L + W + R + (g.plain ? 10 : 0), vh = T + H + B + 24;
    return `<svg viewBox="0 0 ${vw} ${vh}" width="${f(vw / S)}mm" height="${f(vh / S)}mm" font-family="Segoe UI, Arial, sans-serif">${s}</svg>`;
  }

  function render(root) {
    (root || document).querySelectorAll(".graph[data-g]").forEach(el => {
      try { el.innerHTML = graph(JSON.parse(el.dataset.g)); }
      catch (e) { el.textContent = "Graph error: " + e.message; console.error(e, el.dataset.g); }
    });
    const L = window.Lesson;
    if (L && L.molSVG) {
      (root || document).querySelectorAll(".dc[data-mol]").forEach(el => { el.innerHTML = L.molSVG(el.dataset.mol, 1); });
      (root || document).querySelectorAll(".dc[data-ionic]").forEach((el, i) => {
        el.innerHTML = L.ionicSVG(el.dataset.ionic, el.dataset.view || "after", { lw: 1, uid: "b" + i });
      });
      if (L.comps && L.comps["nacl-lattice"]) {
        (root || document).querySelectorAll(".nacl").forEach(el => L.comps["nacl-lattice"](el));
      }
    }
  }
  // Force diagrams: <div class="fd" data-f='[["r",10,"10 N"],["l",4,"4 N"]]' data-obj="box|car|ball"></div>
  // dir r/l/u/d, size sets arrow length (relative), label text.
  function forces(root) {
    (root || document).querySelectorAll(".fd[data-f]").forEach((el, n) => {
      const F = JSON.parse(el.dataset.f), max = Math.max(1, ...F.map(f => f[1]));
      const cx = 150, cy = 70, hw = 34, hh = 24;
      let s = `<defs><marker id="fa${n}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#7a4a00"/></marker></defs>`;
      const obj = el.dataset.obj || "box";
      if (obj === "car") s += `<path d="M${cx-46} ${cy+14}h92v-16l-16-4-14-14h-34l-16 14-12 4z" fill="#fef0cc" stroke="#111" stroke-width="2"/><circle cx="${cx-26}" cy="${cy+16}" r="9" fill="#333"/><circle cx="${cx+26}" cy="${cy+16}" r="9" fill="#333"/>`;
      else if (obj === "ball") s += `<circle cx="${cx}" cy="${cy}" r="24" fill="#fef0cc" stroke="#111" stroke-width="2"/>`;
      else s += `<rect x="${cx-hw}" y="${cy-hh}" width="${2*hw}" height="${2*hh}" rx="3" fill="#fef0cc" stroke="#111" stroke-width="2"/>`;
      if (el.dataset.label) s += `<text x="${cx}" y="${cy + 5}" font-size="13" text-anchor="middle" fill="#7a4a00">${el.dataset.label}</text>`;
      F.forEach(([d, size, lab]) => {
        const L = 15 + 80 * size / max;
        let x1, y1, x2, y2, tx, ty, ta = "middle";
        if (d === "r") { x1 = cx + hw; y1 = cy; x2 = x1 + L; y2 = cy; tx = (x1 + x2) / 2; ty = cy - 8; }
        if (d === "l") { x1 = cx - hw; y1 = cy; x2 = x1 - L; y2 = cy; tx = (x1 + x2) / 2; ty = cy - 8; }
        if (d === "u") { x1 = cx; y1 = cy - hh; x2 = cx; y2 = y1 - L * .45; tx = cx + 8; ty = (y1 + y2) / 2 + 4; ta = "start"; }
        if (d === "d") { x1 = cx; y1 = cy + hh; x2 = cx; y2 = y1 + L * .45; tx = cx + 8; ty = (y1 + y2) / 2 + 4; ta = "start"; }
        s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#7a4a00" stroke-width="4" marker-end="url(#fa${n})"/>`;
        s += `<text x="${tx}" y="${ty}" font-size="14" font-weight="bold" text-anchor="${ta}">${lab}</text>`;
      });
      el.innerHTML = `<svg viewBox="0 0 300 140" style="width:100%;height:100%" font-family="Segoe UI, Arial, sans-serif">${s}</svg>`;
    });
  }

  // Answer lines: <div class="lines" style="--n:3"></div> → 3 ruled lines.
  // Add class "fill" to the last lines block on a page to extend it to the bottom of the page.
  function lines(root) {
    (root || document).querySelectorAll(".lines").forEach(el => {
      if (el.dataset.done) return;
      const n = parseInt(getComputedStyle(el).getPropertyValue("--n")) || 3;
      el.innerHTML = "<i></i>".repeat(n);
      el.dataset.done = 1;
    });
  }
  function fill(root) {
    const mm = 96 / 25.4;
    (root || document).querySelectorAll(".page").forEach(pg => {
      const f = pg.querySelector(".lines.fill");
      if (!f) return;
      const foot = pg.querySelector(".foot");
      const kids = [...pg.children].filter(k => k !== foot);
      const bottom = Math.max(...kids.map(k => k.getBoundingClientRect().bottom));
      const limit = foot ? foot.getBoundingClientRect().top : pg.getBoundingClientRect().bottom - 7 * mm;
      const extra = Math.floor((limit - bottom - 2 * mm) / (7 * mm));
      for (let k = 0; k < extra; k++) f.appendChild(document.createElement("i"));
    });
  }
  function all() { render(); forces(); lines(); (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => fill()); }
  window.Booklet = { graph, render, forces, lines, fill };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", all);
  else all();
})();
