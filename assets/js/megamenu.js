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

    var isOpen = false;       // is the dropdown currently shown
    var lastIndex = -1;       // last hovered trigger index (kept across opens)
    var closeTimer = null;

    function place(id, trigger) {
      var panel = panels[id];
      if (!panel) return;
      var idx = triggers.indexOf(trigger);
      // Hover left->right (idx increasing) => new content enters from the right and
      // slides left; right->left => enters from the left and slides right. Direction
      // is kept across separate hovers so a Resources->Community move always slides,
      // even if the menu closed in between.
      var dir = (lastIndex === -1 || idx === lastIndex) ? 0 : (idx > lastIndex ? 1 : -1);

      triggers.forEach(function (t) { t.classList.toggle('mm-current', t === trigger); });

      var w = panel.offsetWidth;
      var h = panel.offsetHeight;
      var x = trigger.offsetLeft;
      // Keep the panel inside the viewport's right edge.
      var navLeft = nav.getBoundingClientRect().left;
      var maxX = window.innerWidth - 12 - w - navLeft;
      if (x > maxX) x = Math.max(0, maxX);

      // Snap the background into place when opening from closed; morph when moving
      // between triggers while already open.
      if (!isOpen) bg.style.transition = 'none';
      bg.style.width = w + 'px';
      bg.style.height = h + 'px';
      bg.style.transform = 'translateX(' + x + 'px)';
      if (!isOpen) { void bg.offsetWidth; bg.style.transition = ''; }

      // Panels live INSIDE .mm-bg (overflow:hidden). True carousel: the new panel
      // enters fully off the hover-direction edge (a whole panel width) and slides
      // to rest, while the previous one slides the full width out the other side.
      // Clipping makes the two halves tile like Stripe's, not a small nudge.
      Object.keys(panels).forEach(function (k) {
        var pnl = panels[k];
        var pw = pnl.offsetWidth || w;
        if (k === id) {
          if (dir !== 0) {
            pnl.style.transition = 'none';
            pnl.style.transform = 'translateX(' + (dir * pw) + 'px)';
            void pnl.offsetWidth; // commit the start position
            pnl.style.transition = '';
          }
          pnl.classList.add('active');
          pnl.style.transform = 'translateX(0)';
        } else {
          if (dir !== 0 && pnl.classList.contains('active')) {
            pnl.style.transform = 'translateX(' + (-dir * pw) + 'px)';
          }
          pnl.classList.remove('active');
        }
      });

      isOpen = true;
      lastIndex = idx;
    }

    function open(id, trigger) { clearTimeout(closeTimer); nav.classList.add('mm-open'); place(id, trigger); }
    function close() {
      nav.classList.remove('mm-open');
      isOpen = false; // keep lastIndex so the next hover still slides directionally
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
