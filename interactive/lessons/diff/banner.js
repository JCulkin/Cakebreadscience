/* Staging-only top bar linking to the Split-Screen Lesson & Worksheet Comparers.
   Does nothing on the live production domain (cakebreadscience.com). */
(function(){
  if (/^(www\.)?cakebreadscience\.com$/i.test(location.hostname)) return;
  var onLessons = location.pathname.indexOf('/interactive/lessons/') === 0;
  Promise.all([
    fetch('/interactive/lessons/diff/data.json', { cache: 'no-store' }).then(function(r){ return r.ok ? r.json() : null; }).catch(function(){ return null; }),
    onLessons ? Promise.resolve(null) : fetch('/worksheets/diff/data.json', { cache: 'no-store' }).then(function(r){ return r.ok ? r.json() : null; }).catch(function(){ return null; })
  ]).then(function(res){
    var ld = res[0], wd = res[1];
    var lCount = (ld && ld.lessons) ? ld.lessons.length : 0;
    var wCount = (wd && wd.sheets) ? wd.sheets.length : 0;
    if (!lCount && !wCount) return;
    var parts = [], links = [];
    if (lCount) {
      var rev = ld.lessons.filter(function(l){ return l.status !== 'checked'; }).length;
      parts.push(rev ? rev + ' lesson' + (rev===1?'':'s') + ' under review (' + lCount + ' changed)' : lCount + ' lesson' + (lCount===1?'':'s') + ' changed');
      links.push('<a href="/interactive/lessons/diff/" style="background:#111;color:#facc15;text-decoration:none;padding:5px 12px;font-weight:800;border-radius:4px;white-space:nowrap">Compare lessons →</a>');
    }
    if (wCount) {
      parts.push(wCount + ' worksheet' + (wCount===1?'':'s') + ' changed');
      links.push('<a href="/worksheets/diff/" style="background:#111;color:#facc15;text-decoration:none;padding:5px 12px;font-weight:800;border-radius:4px;white-space:nowrap">Compare worksheets →</a>');
    }
    var bar = document.createElement('div');
    bar.id = 'staging-diff-bar';
    bar.style.cssText = 'background:#facc15;color:#111;border-bottom:3px solid #111;padding:8px 18px;font:700 14px/1.3 "Barlow",Arial,sans-serif;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;position:relative;z-index:40';
    bar.innerHTML = '<span><b style="background:#111;color:#facc15;padding:2px 7px;letter-spacing:1px;text-transform:uppercase;font-size:12px;margin-right:8px">STAGING</b>'
      + parts.join(' · ') + '</span>'
      + '<span style="display:flex;gap:8px;flex-wrap:wrap">' + links.join('') + '</span>';
    document.body.insertBefore(bar, document.body.firstChild);
  });
})();
