// Search modal. Backend chosen by <html data-search>: "fuse" (default) or "pagefind".
(function () {
  var trigger = document.querySelector('[data-search-trigger]');
  var modal = document.getElementById('search-modal');
  var input = document.querySelector('[data-search-input]');
  var results = document.querySelector('[data-search-results]');
  if (!trigger || !modal) return;
  var backend = document.documentElement.getAttribute('data-search') || 'fuse';
  var fuse = null, ready = false;

  function open() { modal.hidden = false; input.focus(); }
  function close() { modal.hidden = true; input.value = ''; results.innerHTML = ''; }
  trigger.addEventListener('click', open);
  modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
    if (e.key === 'Escape' && !modal.hidden) close();
  });

  function render(items) {
    results.innerHTML = items.slice(0, 8).map(function (r) {
      var it = r.item || r;
      return '<li><a href="' + it.url + '">' + it.title + '</a></li>';
    }).join('');
  }
  async function ensureFuse() {
    if (ready) return;
    var res = await fetch(document.documentElement.getAttribute('data-search-index') || '/index.json');
    var data = await res.json();
    fuse = new Fuse(data, { keys: ['title', 'content'], threshold: 0.35, ignoreLocation: true });
    ready = true;
  }
  input.addEventListener('input', async function () {
    var q = input.value.trim();
    if (!q) { results.innerHTML = ''; return; }
    if (backend === 'pagefind') {
      var pf = window.__pagefind || (window.__pagefind = await import('/pagefind/pagefind.js'));
      var search = await pf.search(q);
      var data = await Promise.all(search.results.slice(0, 8).map(function (r) { return r.data(); }));
      render(data.map(function (d) { return { title: d.meta.title, url: d.url }; }));
    } else {
      await ensureFuse();
      render(fuse.search(q));
    }
  });
})();
