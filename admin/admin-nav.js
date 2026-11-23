/* One admin menu for every admin page (22 Nov 2026). User: "The admin area has ballooned a bit and the top sliding bar no
   longer makes sense. Tidy access up somehow. Don't remove anything, just tidy it."
   Replaces the single side-scrolling tab bar (9 tabs + 3 yellow page links) with four labelled groups that wrap instead of
   scrolling. On /admin/ the console's own tabs switch in place (index.html's #tabs click handler, data-t); on the other admin
   pages the same items are plain links back to /admin/#tab.
   Use: <nav id="adminNav"></nav> (or nothing: it goes after the first <header>), then <script src="/admin/admin-nav.js"></script>.
   Games keeps id="gTab" (the console writes the pending-approvals count into it). */
(function () {
  const GROUPS = [
    ['Students', [['overview', 'Overview'], ['students', 'Students'], ['map', 'Spec map'], ['teach', 'Teaching']]],
    ['Content', [['questions', 'Questions'], ['/admin/review.html', '✅ Review'], ['/admin/study-guide.html', '📄 Study guides']]],
    ['Games', [['boards', 'Leaderboards'], ['bland', 'Breadventure Land'], ['games', 'Games'], ['/admin/showcase.html', '🎮 Game showcase']]],
    ['Site', [['backup', 'Backup']]]
  ];
  const onConsole = /^\/admin\/?(index\.html)?$/.test(location.pathname);
  const css = `.anav{background:#1b1b1b;padding:7px 22px 9px;display:flex;flex-wrap:wrap;gap:6px 22px;align-items:center;font-family:'Barlow',Arial,sans-serif}
.anav[hidden]{display:none!important}
.anav .g{display:flex;flex-wrap:wrap;align-items:center;gap:4px}
.anav .gl{font:700 10.5px 'Barlow',Arial;letter-spacing:1.3px;text-transform:uppercase;color:#8a8a8a;margin-right:3px}
.anav a{color:#ddd;text-decoration:none;font:700 14px 'Barlow',Arial;padding:3px 11px;border-radius:99px;border:1.5px solid #444;white-space:nowrap}
.anav a:hover{border-color:#aaa;color:#fff}
.anav a.on{background:#eeeae0;color:#111;border-color:#eeeae0}
@media(max-width:640px){.anav{padding:6px 12px 8px;gap:6px 14px}.anav .gl{flex:1 1 100%}}
@media print{.anav{display:none!important}}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  let nav = document.getElementById('adminNav') || (onConsole && document.getElementById('tabs'));
  if (!nav) { nav = document.createElement('nav'); const h = document.querySelector('header'); h ? h.after(nav) : document.body.prepend(nav); }
  nav.classList.add('anav');
  const here = location.pathname.replace(/index\.html$/, '');
  nav.innerHTML = GROUPS.map(([label, items]) => `<div class="g"><span class="gl">${label}</span>${items.map(([t, name]) => {
    const page = t[0] === '/';
    const href = page ? t : '/admin/#' + t;
    const on = page ? here === t : onConsole && (location.hash.slice(1) || 'overview') === t;
    return `<a href="${href}"${page ? '' : ` data-t="${t}"`}${t === 'games' ? ' id="gTab"' : ''} class="${on ? 'on' : ''}">${name}</a>`;
  }).join('')}</div>`).join('');
})();
