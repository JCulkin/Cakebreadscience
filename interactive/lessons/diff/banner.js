/* Staging-only top bar linking to the Split-Screen Lesson Comparer.
   Does nothing on the live production domain (cakebreadscience.com). */
(function(){
  if (/^(www\.)?cakebreadscience\.com$/i.test(location.hostname)) return;
  fetch('/interactive/lessons/diff/data.json', { cache: 'no-store' })
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(d){
      if (!d || !d.lessons || !d.lessons.length) return;
      var review = d.lessons.filter(function(l){ return l.status !== 'checked'; }).length;
      var total = d.lessons.length;
      var bar = document.createElement('div');
      bar.id = 'staging-diff-bar';
      bar.style.cssText = 'background:#facc15;color:#111;border-bottom:3px solid #111;padding:8px 18px;font:700 14px/1.3 "Barlow",Arial,sans-serif;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;position:relative;z-index:40';
      bar.innerHTML = '<span><b style="background:#111;color:#facc15;padding:2px 7px;letter-spacing:1px;text-transform:uppercase;font-size:12px;margin-right:8px">STAGING</b>'
        + (review ? review + ' lesson' + (review===1?'':'s') + ' under review (' + total + ' changed vs live)' : total + ' lesson' + (total===1?'':'s') + ' changed vs live')
        + '</span>'
        + '<a href="/interactive/lessons/diff/" style="background:#111;color:#facc15;text-decoration:none;padding:5px 12px;font-weight:800;border-radius:4px;white-space:nowrap">Compare lesson changes →</a>';
      document.body.insertBefore(bar, document.body.firstChild);
    })
    .catch(function(){});
})();
