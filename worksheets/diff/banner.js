/* Staging-only top bar linking to the unified No-Sign-In Staging Review Hub.
   Does nothing on the live production domain (cakebreadscience.com). */
(function(){
  if (/^(www\.)?cakebreadscience\.com$/i.test(location.hostname)) return;
  if (document.getElementById('staging-diff-bar')) return;
  var s = document.createElement('script');
  s.src = '/interactive/lessons/diff/banner.js';
  document.head.appendChild(s);
})();
