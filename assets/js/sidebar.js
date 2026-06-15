// Toggle mobile sidebar drawer.
(function () {
  const sidebar = document.getElementById('sidebar');
  document.querySelectorAll('[data-sidebar-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () { if (sidebar) sidebar.classList.toggle('open'); });
  });
  document.addEventListener('click', function (e) {
    if (window.innerWidth > 960 || !sidebar || !sidebar.classList.contains('open')) return;
    if (!sidebar.contains(e.target) && !e.target.closest('[data-sidebar-toggle]')) sidebar.classList.remove('open');
  });
})();
