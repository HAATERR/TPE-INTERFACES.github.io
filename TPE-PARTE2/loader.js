// Loader 5s exactos con porcentaje (sin GIF) — centrado y con offset
(function () {
  const loader = document.getElementById('loader');
  const percent = document.getElementById('loaderPercent');
  if (!loader || !percent) return;

  const DURATION = 5000; // ms
  const start = performance.now();

  function step(t) {
    const elapsed = t - start;
    const p = Math.min(1, elapsed / DURATION);
    const pct = Math.floor(p * 100);
    percent.textContent = `${pct}%`;
    if (p < 1) requestAnimationFrame(step);
    else setTimeout(hide, 120);
  }
  function hide() {
    loader.style.transition = 'opacity 260ms ease';
    loader.style.opacity = '0';
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }
  requestAnimationFrame(step);
})();
