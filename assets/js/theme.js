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
