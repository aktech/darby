// Sliding nav indicator: a pill that animates to the hovered tab and rests
// under the active one. Pure progressive enhancement; if JS is off the tabs
// still work, just without the moving highlight.
(function () {
  document.querySelectorAll('[data-nav-indicator]').forEach(function (nav) {
    var ind = nav.querySelector('.nav-tab-indicator');
    if (!ind) return;
    var tabs = Array.prototype.slice.call(nav.querySelectorAll('.nav-tab'));
    if (!tabs.length) return;

    function moveTo(el) {
      if (!el) { ind.classList.remove('ready'); return; }
      ind.style.width = el.offsetWidth + 'px';
      ind.style.transform = 'translateX(' + el.offsetLeft + 'px)';
      ind.classList.add('ready');
    }
    function activeTab() { return nav.querySelector('.nav-tab.active'); }
    function rest() { moveTo(activeTab()); }

    tabs.forEach(function (t) {
      t.addEventListener('mouseenter', function () { moveTo(t); });
      t.addEventListener('focus', function () { moveTo(t); });
    });
    nav.addEventListener('mouseleave', rest);
    nav.addEventListener('focusout', function () {
      // Only rest once focus has actually left the nav.
      if (!nav.contains(document.activeElement)) rest();
    });

    rest();
    window.addEventListener('resize', rest);
  });
})();
