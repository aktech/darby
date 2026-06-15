// Toggle mobile sidebar drawer.
(function () {
  const sidebar = document.getElementById('sidebar');
  document.querySelectorAll('[data-sidebar-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!sidebar) return;
      var open = sidebar.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function (e) {
    if (window.innerWidth > 960 || !sidebar || !sidebar.classList.contains('open')) return;
    if (!sidebar.contains(e.target) && !e.target.closest('[data-sidebar-toggle]')) {
      sidebar.classList.remove('open');
      document.querySelectorAll('[data-sidebar-toggle]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    }
  });
})();

// Generic dropdown toggle (version switcher): toggle, close on outside click and Escape.
(function () {
  var dropdowns = [];
  document.querySelectorAll('[data-dropdown-toggle]').forEach(function (btn) {
    var menu = btn.parentElement.querySelector('.version-menu');
    if (!menu) return;
    dropdowns.push({ btn: btn, menu: menu });
    function close() { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', function () {
      var willOpen = menu.hidden;
      menu.hidden = !willOpen;
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
    btn._closeDropdown = close;
  });
  document.addEventListener('click', function (e) {
    dropdowns.forEach(function (d) {
      if (!d.menu.hidden && !d.btn.parentElement.contains(e.target)) d.btn._closeDropdown();
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') dropdowns.forEach(function (d) { if (!d.menu.hidden) d.btn._closeDropdown(); });
  });
})();
