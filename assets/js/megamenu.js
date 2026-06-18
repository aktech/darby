// Mega-menu morph: one shared panel (.mm-bg) slides and resizes to sit under
// the hovered trigger while the matching content panel cross-fades in. The very
// first open snaps to size (no grow-from-zero); moving between triggers while
// open animates the morph. Progressive enhancement: with JS off the links in
// each panel are still in the DOM, just not revealed.
(function () {
  document.querySelectorAll('[data-megamenu]').forEach(function (nav) {
    var dd = nav.querySelector('[data-mm-dropdown]');
    if (!dd) return;
    var bg = dd.querySelector('[data-mm-bg]');
    var triggers = Array.prototype.slice.call(nav.querySelectorAll('[data-mm]'));
    if (!bg || !triggers.length) return;

    var panels = {};
    dd.querySelectorAll('[data-mm-panel]').forEach(function (p) {
      panels[p.getAttribute('data-mm-panel')] = p;
    });

    var firstOpen = true;
    var lastIndex = -1;
    var closeTimer = null;
    var SWIPE = 26; // px the content slides in the hover direction

    function place(id, trigger) {
      var panel = panels[id];
      if (!panel) return;
      var idx = triggers.indexOf(trigger);
      // Hover left->right (idx increasing) => content swipes left; right->left => swipes right.
      var dir = (lastIndex === -1) ? 0 : (idx > lastIndex ? 1 : idx < lastIndex ? -1 : 0);

      triggers.forEach(function (t) { t.classList.toggle('mm-current', t === trigger); });

      var w = panel.offsetWidth;
      var h = panel.offsetHeight;
      var x = trigger.offsetLeft;
      // Keep the panel inside the viewport's right edge.
      var navLeft = nav.getBoundingClientRect().left;
      var maxX = window.innerWidth - 12 - w - navLeft;
      if (x > maxX) x = Math.max(0, maxX);

      if (firstOpen) bg.style.transition = 'none';
      bg.style.width = w + 'px';
      bg.style.height = h + 'px';
      bg.style.transform = 'translateX(' + x + 'px)';
      if (firstOpen) { void bg.offsetWidth; bg.style.transition = ''; }

      Object.keys(panels).forEach(function (k) {
        var pnl = panels[k];
        if (k === id) {
          // Incoming panel: start offset in the hover direction, then settle to x.
          if (!firstOpen && dir !== 0) {
            pnl.style.transition = 'none';
            pnl.style.transform = 'translateX(' + (x + dir * SWIPE) + 'px)';
            void pnl.offsetWidth;
            pnl.style.transition = '';
          }
          pnl.classList.add('active');
          pnl.style.transform = 'translateX(' + x + 'px)';
        } else {
          pnl.classList.remove('active');
        }
      });

      firstOpen = false;
      lastIndex = idx;
    }

    function open(id, trigger) { clearTimeout(closeTimer); nav.classList.add('mm-open'); place(id, trigger); }
    function close() {
      nav.classList.remove('mm-open');
      firstOpen = true;
      lastIndex = -1;
      triggers.forEach(function (t) { t.classList.remove('mm-current'); });
      Object.keys(panels).forEach(function (k) { panels[k].classList.remove('active'); });
    }
    function scheduleClose() { clearTimeout(closeTimer); closeTimer = setTimeout(close, 140); }

    triggers.forEach(function (t) {
      var id = t.getAttribute('data-mm');
      t.addEventListener('mouseenter', function () { open(id, t); });
      t.addEventListener('focus', function () { open(id, t); });
    });
    nav.addEventListener('mouseleave', scheduleClose);
    dd.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
    nav.addEventListener('focusout', function () {
      if (!nav.contains(document.activeElement)) scheduleClose();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  });
})();
