/* Staging-only top bar linking to the Split-Screen Worksheet Comparer.
   Does nothing on the live production domain (cakebreadscience.com). */
(function(){
  if (/^(www\.)?cakebreadscience\.com$/i.test(location.hostname)) return;
  fetch('/worksheets/diff/data.json', { cache: 'no-store' })
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(d){
      if (!d || !d.sheets || !d.sheets.length) return;
      var total = d.sheets.length;
      var bar = document.createElement('div');
      bar.id = 'staging-ws-diff-bar';
      bar.style.cssText = 'background:#facc15;color:#111;border-bottom:3px solid #111;padding:8px 18px;font:700 14px/1.3 "Barlow",Arial,sans-serif;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;position:relative;z-index:40';
      bar.innerHTML = '<span><b style="background:#111;color:#facc15;padding:2px 7px;letter-spacing:1px;text-transform:uppercase;font-size:12px;margin-right:8px">STAGING</b>'
        + total + ' worksheet' + (total === 1 ? '' : 's') + ' changed vs ' + (d.baseLabel || 'live')
        + '</span>'
        + '<a href="/worksheets/diff/" style="background:#111;color:#facc15;text-decoration:none;padding:5px 12px;font-weight:800;border-radius:4px;white-space:nowrap">Compare worksheet changes →</a>';
      document.body.insertBefore(bar, document.body.firstChild);
    })
    .catch(function(){});
})();
