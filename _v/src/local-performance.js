// Read panels at normal DOM speed while the background water runs gently at 30fps.
export function initPerformance(lake) {
  const html = document.documentElement;
  const interfaceRoot = document.querySelector('.interface');
  const panels = [...document.querySelectorAll('.local-tool-panel')];
  let reading;
  function update() {
    const active = html.classList.contains('is-water-project-detail-open')
      || interfaceRoot.classList.contains('is-about-open')
      || interfaceRoot.classList.contains('is-waveform-open')
      || panels.some(panel => !panel.hidden);
    if (reading === active) return;
    reading = active;
    html.classList.toggle('is-scene-reading', active);
    lake.setReadingMode(active);
  }
  const observer = new MutationObserver(update);
  observer.observe(html, {attributes:true, attributeFilter:['class']});
  observer.observe(interfaceRoot, {attributes:true, attributeFilter:['class']});
  panels.forEach(panel => observer.observe(panel, {attributes:true, attributeFilter:['hidden']}));
  update();
}
