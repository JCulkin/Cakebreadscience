/* One admin menu for every admin page (22 Nov 2026). User: "The admin area has ballooned a bit and the top sliding bar no
   longer makes sense. Tidy access up somehow. Don't remove anything, just tidy it."
   23 Nov, user: "that top bar still better looking. Fold game leaderboards into Games. Fold game showcase into Breadventure
   Land … Move backup by itself over to the right." → labelled groups of tabs with an underline for the current one; the
   Leaderboards panel now shows inside Games and the Game showcase is reached from Breadventure Land (both still exist:
   /admin/#boards opens Games, and showcase.html lights up Breadventure Land); Backup sits alone on the right.
   On /admin/ the console's own tabs switch in place (index.html's #tabs click handler, data-t); on the other admin pages the
   same items are plain links back to /admin/#tab.
   Use: <nav id="adminNav"></nav> (or nothing: it goes after the first <header>), then <script src="/admin/admin-nav.js"></script>.
   Games keeps id="gTab" (the console writes the pending-approvals count into it). */
(function () {
  /* [tab or page, label, other pages/tabs that light it up] */
  const GROUPS = [
    ['Students', [['overview', 'Overview'], ['students', 'Students'], ['map', 'Spec map'], ['teach', 'Teaching']]],
    ['Content', [['questions', 'Questions'], ['/admin/review.html', 'Review'], ['/admin/study-guide.html', 'Study guides']]],
    ['Games', [['games', 'Games', ['boards']], ['bland', 'Breadventure Land', ['/admin/showcase.html']]]],
    ['Site', [['backup', 'Backup']], true]   // true = pushed to the right
  ];
  const onConsole = /^\/admin\/?(index\.html)?$/.test(location.pathname);
  const css = `.anav{background:#151515;padding:0 22px;display:flex;flex-wrap:wrap;align-items:flex-end;gap:0 26px;font-family:'Barlow',Arial,sans-serif;border-bottom:1px solid #2a2a2a}
.anav[hidden]{display:none!important}
.anav .g{display:flex;flex-direction:column;padding-top:7px}
.anav .g.end{margin-left:auto}
.anav .gl{font:700 10px 'Barlow',Arial;letter-spacing:1.6px;text-transform:uppercase;color:#7a7a7a;padding:0 10px 1px}
.anav .row{display:flex;flex-wrap:wrap}
.anav a{color:#c9c9c9;text-decoration:none;font:800 15px/1 'Barlow',Arial;padding:7px 10px 9px;border-bottom:3px solid transparent;white-space:nowrap;transition:color .12s,border-color .12s}
.anav a:hover{color:#fff;border-bottom-color:#555}
.anav a.on{color:#eeeae0;border-bottom-color:#00a03a}
@media(max-width:700px){.anav{padding:0 10px;gap:0 12px}.anav a{font-size:14px;padding:6px 8px 8px}.anav .g.end{margin-left:0}}
@media print{.anav{display:none!important}}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  let nav = document.getElementById('adminNav') || (onConsole && document.getElementById('tabs'));
  if (!nav) { nav = document.createElement('nav'); const h = document.querySelector('header'); h ? h.after(nav) : document.body.prepend(nav); }
  nav.classList.add('anav');
  const here = location.pathname.replace(/index\.html$/, '');
  const tab = () => location.hash.slice(1) || 'overview';
  const isOn = (t, also) => (t[0] === '/' ? here === t : onConsole && tab() === t) || (also || []).some(a => a[0] === '/' ? here === a : onConsole && tab() === a);
  nav.innerHTML = GROUPS.map(([label, items, end]) => `<div class="g${end ? ' end' : ''}"><span class="gl">${label}</span><div class="row">${items.map(([t, name, also]) => {
    const page = t[0] === '/';
    return `<a href="${page ? t : '/admin/#' + t}"${page ? '' : ` data-t="${t}"`}${t === 'games' ? ' id="gTab"' : ''} class="${isOn(t, also) ? 'on' : ''}">${name}</a>`;
  }).join('')}</div></div>`).join('');
})();
