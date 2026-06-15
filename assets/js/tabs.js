// Switch tab panels within a [data-tabs] group.
(function () {
  document.querySelectorAll('[data-tabs]').forEach(function (group) {
    const btns = group.querySelectorAll('[data-tab-btn]');
    const panels = group.querySelectorAll('[data-tab-panel]');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const i = btn.getAttribute('data-tab-btn');
        btns.forEach(function (b) { b.classList.toggle('active', b === btn); });
        panels.forEach(function (p) { p.classList.toggle('active', p.getAttribute('data-tab-panel') === i); });
      });
    });
  });
})();
