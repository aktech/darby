// Copy the code inside a .code-block to the clipboard.
(function () {
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const block = btn.closest('.code-block');
      const code = block ? block.querySelector('code, pre') : null;
      if (!code) return;
      navigator.clipboard.writeText(code.innerText).then(function () {
        btn.classList.add('copied');
        setTimeout(function () { btn.classList.remove('copied'); }, 1500);
      });
    });
  });
})();
