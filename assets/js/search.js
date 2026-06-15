// Search modal. Backend chosen by <html data-search>: "fuse" (default) or "pagefind".
(function () {
  var trigger = document.querySelector('[data-search-trigger]');
  var modal = document.getElementById('search-modal');
  var input = document.querySelector('[data-search-input]');
  var results = document.querySelector('[data-search-results]');
  var closeBtn = document.querySelector('[data-search-close]');
  if (!trigger || !modal) return;
  var backend = document.documentElement.getAttribute('data-search') || 'fuse';
  var fuse = null, ready = false, allData = [];
  var current = [];   // current result items
  var active = -1;    // active row index for keyboard nav

  async function open() {
    modal.hidden = false; input.focus();
    if (!input.value.trim() && backend !== 'pagefind') {
      try { await ensureFuse(); suggest(); } catch (e) { /* index unavailable: leave empty */ }
    }
  }
  function close() { modal.hidden = true; input.value = ''; results.innerHTML = ''; current = []; active = -1; }
  trigger.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  modal.addEventListener('click', function (e) { if (e.target === modal) close(); });

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Build a highlighted excerpt around the first matched range in `value`.
  function excerpt(value, indices) {
    if (!value) return '';
    if (!indices || !indices.length) return esc(value.slice(0, 120)) + (value.length > 120 ? '…' : '');
    // pick the longest matched range (most relevant)
    var best = indices.reduce(function (a, b) { return (b[1] - b[0]) > (a[1] - a[0]) ? b : a; });
    var i0 = best[0], i1 = best[1] + 1;
    var start = Math.max(0, i0 - 60), end = Math.min(value.length, i1 + 90);
    return (start > 0 ? '…' : '') +
      esc(value.slice(start, i0)) +
      '<mark>' + esc(value.slice(i0, i1)) + '</mark>' +
      esc(value.slice(i1, end)) +
      (end < value.length ? '…' : '');
  }

  function render(items) {
    current = items;
    active = items.length ? 0 : -1;
    if (!items.length) { results.innerHTML = '<li class="search-note">No results</li>'; return; }
    results.innerHTML = items.map(rowHTML).join('');
  }

  function rowHTML(it, i) {
    return '<li role="option" class="search-result' + (i === 0 ? ' active' : '') + '" data-idx="' + i + '">' +
      '<a href="' + esc(it.url) + '" tabindex="-1">' +
        '<span class="sr-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg></span>' +
        '<span class="sr-text">' +
          (it.section ? '<span class="sr-crumb">' + esc(it.section) + '</span>' : '') +
          '<span class="sr-title">' + esc(it.title) + '</span>' +
          (it.snippet ? '<span class="sr-snippet">' + it.snippet + '</span>' : '') +
        '</span>' +
        '<span class="sr-enter" aria-hidden="true">&crarr;</span>' +
      '</a></li>';
  }

  // Empty-state: show the first pages so the panel is never a blank void.
  function suggest() {
    var items = allData.slice(0, 6).map(function (d) {
      return { title: d.title, section: d.section, url: d.url, snippet: '' };
    });
    current = items;
    active = items.length ? 0 : -1;
    results.innerHTML = '<li class="search-section-label">Suggested pages</li>' + items.map(rowHTML).join('');
  }

  function setActive(i) {
    var rows = results.querySelectorAll('.search-result');
    if (!rows.length) return;
    active = (i + rows.length) % rows.length;
    rows.forEach(function (r, idx) { r.classList.toggle('active', idx === active); });
    rows[active].scrollIntoView({ block: 'nearest' });
  }

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); return; }
    if (modal.hidden) return;
    if (e.key === 'Escape') { close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter' && active >= 0 && current[active]) { window.location.href = current[active].url; }
  });
  results.addEventListener('mousemove', function (e) {
    var li = e.target.closest('.search-result');
    if (li) setActive(parseInt(li.getAttribute('data-idx'), 10));
  });

  async function ensureFuse() {
    if (ready) return;
    var res = await fetch(document.documentElement.getAttribute('data-search-index') || '/index.json');
    if (!res.ok) throw new Error('search index not found (' + res.status + ')');
    var data = await res.json();
    allData = data;
    fuse = new Fuse(data, {
      keys: [{ name: 'title', weight: 3 }, { name: 'section', weight: 1 }, { name: 'content', weight: 1 }],
      threshold: 0.35, ignoreLocation: true, includeMatches: true, minMatchCharLength: 2
    });
    ready = true;
  }

  function note(msg) { current = []; active = -1; results.innerHTML = '<li class="search-note">' + esc(msg) + '</li>'; }

  input.addEventListener('input', async function () {
    var q = input.value.trim();
    if (!q) { if (backend !== 'pagefind' && ready) { suggest(); } else { results.innerHTML = ''; current = []; active = -1; } return; }
    try {
      if (backend === 'pagefind') {
        var pf = window.__pagefind || (window.__pagefind = await import('/pagefind/pagefind.js'));
        var search = await pf.search(q);
        var data = await Promise.all(search.results.slice(0, 8).map(function (r) { return r.data(); }));
        render(data.map(function (d) { return { title: d.meta.title, section: (d.meta && d.meta.section) || '', url: d.url, snippet: d.excerpt }; }));
      } else {
        await ensureFuse();
        var hits = fuse.search(q).slice(0, 8);
        if (!hits.length) { note('No results'); return; }
        render(hits.map(function (h) {
          var cm = (h.matches || []).filter(function (m) { return m.key === 'content'; })[0];
          var tm = (h.matches || []).filter(function (m) { return m.key === 'title'; })[0];
          var snip = cm ? excerpt(cm.value, cm.indices) : (tm ? '' : excerpt(h.item.summary || h.item.content, null));
          return { title: h.item.title, section: h.item.section, url: h.item.url, snippet: snip };
        }));
      }
    } catch (e) {
      note('Search is unavailable');
    }
  });
})();
