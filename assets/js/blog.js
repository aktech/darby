// Blog index view switch: list <-> cards. Persists the choice per visitor.
(function () {
  var toggle = document.querySelector('[data-blog-view]');
  var feed = document.querySelector('[data-post-view]');
  if (!toggle || !feed) return;
  var KEY = 'darby-blog-view';

  function apply(view) {
    if (view !== 'cards') view = 'list';
    feed.setAttribute('data-post-view', view);
    var btns = toggle.querySelectorAll('[data-view-set]');
    for (var i = 0; i < btns.length; i++) {
      var on = btns[i].getAttribute('data-view-set') === view;
      btns[i].classList.toggle('is-active', on);
      btns[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  apply(saved || 'list');

  toggle.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-view-set]');
    if (!btn) return;
    var view = btn.getAttribute('data-view-set');
    try { localStorage.setItem(KEY, view); } catch (e) {}
    apply(view);
  });
})();
