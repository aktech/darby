// Toggle data-theme between light/dark and persist the choice.
(function () {
  const root = document.documentElement;
  function current() { return root.getAttribute('data-theme') || 'light'; }
  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  });
})();

// Scroll-spy: highlight the TOC link for the heading in view.
(function () {
  const links = Array.from(document.querySelectorAll('[data-toc-link]'));
  if (!links.length || !('IntersectionObserver' in window)) return;
  const map = {};
  links.forEach(function (l) { map[l.getAttribute('href').slice(1)] = l; });
  const obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        links.forEach(function (l) { l.classList.remove('active'); });
        const a = map[e.target.id]; if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '0px 0px -75% 0px' });
  document.querySelectorAll('.doc h2[id], .doc h3[id]').forEach(function (h) { obs.observe(h); });
})();
