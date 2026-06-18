// Mobile drawers. Each [data-drawer-toggle] button controls the element named in
// its aria-controls (the left burger -> #sidebar section tree, the right
// three-dots -> #mobilenav navbar items). A toggle whose target is absent on the
// page (e.g. the burger on a page with no sidebar) hides itself. Opening one
// drawer closes the other; an outside click or Escape closes any open drawer.
(function () {
  var toggles = Array.prototype.slice.call(document.querySelectorAll('[data-drawer-toggle]'));
  if (!toggles.length) return;

  var pairs = toggles.map(function (btn) {
    return { btn: btn, panel: document.getElementById(btn.getAttribute('aria-controls')) };
  });

  function closeAll(except) {
    pairs.forEach(function (p) {
      if (!p.panel || p.panel === except) return;
      p.panel.classList.remove('open');
      p.btn.setAttribute('aria-expanded', 'false');
    });
  }

  pairs.forEach(function (p) {
    if (!p.panel) { p.btn.style.display = 'none'; return; } // no target on this page
    p.btn.addEventListener('click', function (e) {
      e.stopPropagation();
      closeAll(p.panel);
      var open = p.panel.classList.toggle('open');
      p.btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  document.addEventListener('click', function (e) {
    if (window.innerWidth > 960) return;
    pairs.forEach(function (p) {
      if (!p.panel || !p.panel.classList.contains('open')) return;
      if (!p.panel.contains(e.target) && e.target !== p.btn && !p.btn.contains(e.target)) {
        p.panel.classList.remove('open');
        p.btn.setAttribute('aria-expanded', 'false');
      }
    });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(null); });
})();
// The version switcher opens on hover / keyboard focus via CSS (:hover, :focus-within) - no JS needed.
