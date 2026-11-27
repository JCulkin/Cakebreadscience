/* Staging-only top bar linking to the unified No-Sign-In Staging Review Hub.
   Does nothing on the live production domain (cakebreadscience.com). */
(function(){
  if (/^(www\.)?cakebreadscience\.com$/i.test(location.hostname)) return;
  if (location.pathname.indexOf('/staging-review/') === 0) return;
  Promise.all([
    fetch('/interactive/lessons/lessons.json', { cache: 'no-store' }).then(function(r){ return r.ok ? r.json() : null; }).catch(function(){ return null; }),
    fetch('/interactive/lessons/diff/data.json', { cache: 'no-store' }).then(function(r){ return r.ok ? r.json() : null; }).catch(function(){ return null; }),
    fetch('/worksheets/diff/data.json', { cache: 'no-store' }).then(function(r){ return r.ok ? r.json() : null; }).catch(function(){ return null; }),
    fetch('/staging-review/flashcards-diff.json', { cache: 'no-store' }).then(function(r){ return r.ok ? r.json() : null; }).catch(function(){ return null; })
  ]).then(function(res){
    var lj = res[0], ld = res[1], wd = res[2], fd = res[3];
    var deckRev = 0, guideRev = 0;
    if (lj && lj.subjects) {
      lj.subjects.forEach(function(s){
        (s.sections || []).forEach(function(sec){
          (sec.topics || []).forEach(function(t){
            if (!t.status) return;
            if (t.status !== 'checked') deckRev++;
            if (t.split && t.studentStatus !== 'checked') guideRev++;
          });
        });
      });
    } else if (ld && ld.lessons) {
      deckRev = ld.lessons.filter(function(l){ return l.status !== 'checked'; }).length;
    }
    var wCount = (wd && wd.sheets) ? wd.sheets.length : 0;
    var fCount = (fd && fd.total) ? fd.total : 0;
    var parts = [];
    if (deckRev) parts.push(deckRev + ' deck' + (deckRev === 1 ? '' : 's'));
    if (guideRev) parts.push(guideRev + ' study guide' + (guideRev === 1 ? '' : 's'));
    if (wCount) parts.push(wCount + ' worksheet' + (wCount === 1 ? '' : 's'));
    if (fCount) parts.push(fCount + ' flashcard' + (fCount === 1 ? '' : 's'));
    if (!parts.length) parts.push('Everything up to date');

    var simOn = false; try { simOn = localStorage.getItem('cbs.sim.y10') === '1'; } catch (e) {}
    var simBtn = simOn ? '' : '<button type="button" id="staging-sim-btn" style="background:#4c1d95;color:#fff;border:2px solid #111;padding:5px 12px;font:800 13.5px Barlow,Arial,sans-serif;border-radius:4px;cursor:pointer;white-space:nowrap">🧑‍🎓 Simulate Y10 student</button>';
    var bar = document.createElement('div');
    bar.id = 'staging-diff-bar';
    bar.style.cssText = 'background:#facc15;color:#111;border-bottom:3px solid #111;padding:9px 18px;font:700 14px/1.3 "Barlow",Arial,sans-serif;display:flex;align-items:center;justify-content:space-between;gap:10px 14px;flex-wrap:wrap;position:relative;z-index:40';
    bar.innerHTML = '<span><b style="background:#111;color:#facc15;padding:2px 8px;letter-spacing:1px;text-transform:uppercase;font-size:12px;margin-right:8px;border-radius:3px">STAGING</b>'
      + 'To review (no sign-in): <b>' + parts.join(' · ') + '</b></span>'
      + '<span style="display:flex;gap:7px;flex-wrap:wrap;align-items:center">'
      + simBtn
      + '<a href="/staging-review/" style="background:#111;color:#facc15;text-decoration:none;padding:6px 14px;font-weight:800;border-radius:4px;white-space:nowrap">Open Staging Review Hub →</a>'
      + '<a href="/staging-review/#decks" style="background:#fff;color:#111;border:2px solid #111;text-decoration:none;padding:4px 10px;font-weight:800;border-radius:4px;white-space:nowrap">Decks</a>'
      + '<a href="/staging-review/#guides" style="background:#fff;color:#111;border:2px solid #111;text-decoration:none;padding:4px 10px;font-weight:800;border-radius:4px;white-space:nowrap">Study guides</a>'
      + '<a href="/staging-review/#worksheets" style="background:#fff;color:#111;border:2px solid #111;text-decoration:none;padding:4px 10px;font-weight:800;border-radius:4px;white-space:nowrap">Worksheets</a>'
      + '<a href="/staging-review/#flashcards" style="background:#fff;color:#111;border:2px solid #111;text-decoration:none;padding:4px 10px;font-weight:800;border-radius:4px;white-space:nowrap">Flashcards</a>'
      + '</span>';
    document.body.insertBefore(bar, document.body.firstChild);
    var sb = bar.querySelector('#staging-sim-btn');
    if (sb) sb.onclick = function () {
      var launch = function () { if (window.CBSSim) CBSSim.start(true); };
      if (window.CBSSim) return launch();
      var sc = document.createElement('script'); sc.src = '/js/staging-sim.js'; sc.onload = launch; document.head.appendChild(sc);
    };
  });
})();
