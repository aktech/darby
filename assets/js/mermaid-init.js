// Render ```mermaid fences with a hand-drawn (Excalidraw-like) look, themed to
// Darby's palette, and re-render on dark/light toggle. Author writes no HTML.
(function () {
  if (!window.mermaid) return;
  var FONT = '"Shantell Sans", "Segoe Print", "Comic Sans MS", cursive';

  function vars(dark) {
    return dark ? {
      background: 'transparent',
      primaryColor: '#1c1633', primaryBorderColor: '#8b5cf6', primaryTextColor: '#ededef',
      secondaryColor: '#241c3d', secondaryBorderColor: '#6d5bbf', secondaryTextColor: '#ededef',
      tertiaryColor: '#14101f', tertiaryBorderColor: '#3a2f63', tertiaryTextColor: '#cdd2e0',
      lineColor: '#8b5cf6', textColor: '#dcdce2',
      clusterBkg: '#100c1c', clusterBorder: '#3a2f63',
      nodeBorder: '#8b5cf6', edgeLabelBackground: '#000000',
      noteBkgColor: '#241c3d', noteBorderColor: '#8b5cf6', noteTextColor: '#ededef'
    } : {
      background: 'transparent',
      primaryColor: '#ece7f8', primaryBorderColor: '#5b3cc4', primaryTextColor: '#241b3d',
      secondaryColor: '#f3eefc', secondaryBorderColor: '#8b6fd8', secondaryTextColor: '#241b3d',
      tertiaryColor: '#faf8ff', tertiaryBorderColor: '#cdbfeb', tertiaryTextColor: '#1e293b',
      lineColor: '#5b3cc4', textColor: '#33324a',
      clusterBkg: '#faf8ff', clusterBorder: '#cdbfeb',
      nodeBorder: '#5b3cc4', edgeLabelBackground: '#ffffff',
      noteBkgColor: '#f3eefc', noteBorderColor: '#5b3cc4', noteTextColor: '#241b3d'
    };
  }

  function render() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      look: 'handDrawn',
      handDrawnSeed: 4,
      theme: 'base',
      fontFamily: FONT,
      themeVariables: vars(dark),
      flowchart: { curve: 'basis', padding: 16, htmlLabels: true }
    });
    document.querySelectorAll('pre.mermaid').forEach(function (el) {
      if (el.dataset.src == null) el.dataset.src = el.textContent;
      else el.innerHTML = el.dataset.src;
      el.removeAttribute('data-processed');
    });
    try { window.mermaid.run({ querySelector: 'pre.mermaid' }); } catch (e) {}
  }

  render();
  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () { setTimeout(render, 60); });
  });
})();
