// Toggle data-theme and persist; sync the toggle's pressed state.
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
