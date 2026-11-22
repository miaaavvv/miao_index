import { portfolio } from './portfolio-content.js?v=privacy-20261119';
import { projectDetailMarkup } from './portfolio.js?v=privacy-20261119';
import { layoutProjectCoordinates } from './project-water-layout.js?v=mobile-20261118';

const pick = (value, language) => typeof value === 'string' ? value : value[language] ?? value.en;
const twoDigits = value => String(value).padStart(2, '0');

export function createWaterProjects({ lake, translate: t, navigationButton }) {
  const root = document.getElementById('water-project-layer');
  const pointHost = document.getElementById('water-project-points');
  const detail = document.getElementById('water-project-detail');
  const body = document.getElementById('water-project-body');
  const switcher = document.getElementById('water-project-switcher');
  const exit = document.getElementById('water-project-exit');
  const back = document.getElementById('water-project-back');
  const previous = document.getElementById('water-project-previous');
  const next = document.getElementById('water-project-next');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let language = document.documentElement.lang || 'en';
  let opened = false;
  let selected = null;
  let hideTimer;
  let layoutFrame;
  const lastPulses = new Map();

  const nodes = portfolio.projects.map((project, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'water-project-node interface-control';
    button.id = `water-project-${project.id}`;
    button.dataset.project = project.id;
    button.dataset.index = index;
    button.setAttribute('aria-controls', detail.id);
    button.setAttribute('aria-expanded', 'false');
    button.style.setProperty('--arrival-delay', `${index * 100}ms`);
    button.style.setProperty('--ripple-delay', `${index * -1.3}s`);
    button.innerHTML = `<span class="water-project-rings" aria-hidden="true"><span></span><span></span><span></span></span><span class="water-project-dot" aria-hidden="true"></span><span class="water-project-label"><span class="water-project-number">${twoDigits(index + 1)}</span><span class="water-project-name"></span></span><span class="water-project-preview" aria-hidden="true"></span>`;
    button.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch') pulse(index, 55);
    });
    button.addEventListener('focus', () => pulse(index, 55));
    button.addEventListener('click', () => {
      pulse(index, 160, true);
      select(index);
    });
    pointHost.append(button);
    const option = document.createElement('button');
    option.type = 'button';
    option.dataset.index = index;
    option.textContent = twoDigits(index + 1);
    option.addEventListener('click', () => select(index, { focus: false }));
    switcher.append(option);
    return button;
  });
  const options = [...switcher.children];

  function pulse(index, holdDuration, force = false) {
    if (!opened || root.inert || reducedMotion.matches) return;
    const now = performance.now();
    if (!force && now - (lastPulses.get(index) ?? -Infinity) < 1000) return;
    lastPulses.set(index, now);
    const dot = nodes[index].querySelector('.water-project-dot').getBoundingClientRect();
    lake.pulseWaterAt(dot.x + dot.width / 2, dot.y + dot.height / 2, holdDuration);
    nodes[index].classList.remove('is-pulsing');
    void nodes[index].offsetWidth;
    nodes[index].classList.add('is-pulsing');
  }

  function renderSelected({ resetScroll = false } = {}) {
    if (selected === null) return;
    const project = portfolio.projects[selected];
    const scrollTop = resetScroll ? 0 : detail.scrollTop;
    body.innerHTML = projectDetailMarkup(project, language, document.documentElement.dataset.projectScreenshotTheme || 'light');
    detail.dataset.project = project.id;
    document.getElementById('water-project-counter').textContent = `${twoDigits(selected + 1)} / ${twoDigits(nodes.length)}`;
    nodes.forEach((node, index) => {
      node.classList.toggle('is-selected', index === selected);
      node.setAttribute('aria-expanded', String(index === selected));
      options[index].setAttribute('aria-pressed', String(index === selected));
    });
    detail.scrollTop = scrollTop;
    previous.setAttribute('aria-label', `${t('previousProject')}: ${pick(portfolio.projects[(selected + nodes.length - 1) % nodes.length].navTitle, language)}`);
    next.setAttribute('aria-label', `${t('nextProject')}: ${pick(portfolio.projects[(selected + 1) % nodes.length].navTitle, language)}`);
  }

  function updateLanguage(value) {
    language = value;
    root.setAttribute('aria-label', t('waterProjects'));
    switcher.setAttribute('aria-label', t('switchProject'));
    back.setAttribute('aria-label', t('backToCoordinates'));
    document.getElementById('water-project-hint').textContent = t('waterProjectsHint');
    exit.textContent = t('exitProjects');
    previous.textContent = `← ${t('previousProject')}`;
    next.textContent = `${t('nextProject')} →`;
    nodes.forEach((node, index) => {
      const project = portfolio.projects[index];
      const name = pick(project.navTitle, language);
      node.querySelector('.water-project-name').textContent = name;
      node.querySelector('.water-project-preview').textContent = pick(project.subtitle, language);
      node.setAttribute('aria-label', `${twoDigits(index + 1)} ${name}`);
      options[index].setAttribute('aria-label', `${twoDigits(index + 1)} ${name}`);
    });
    renderSelected();
    requestLayout();
  }

  function positionPoints() {
    layoutFrame = undefined;
    if (!opened) return;
    const wideDrawer = innerWidth >= 1000 && selected !== null;
    const layout = layoutProjectCoordinates({ width: innerWidth, height: innerHeight, detailLeft: wideDrawer ? detail.offsetLeft : null });
    root.style.setProperty('--node-width', `${layout.nodeWidth}px`);
    root.style.setProperty('--anchor-x', `${layout.anchorX}px`);
    root.style.setProperty('--node-height', `${layout.nodeHeight}px`);
    root.classList.toggle('is-single-column', layout.singleColumn);
    root.inert = selected !== null && innerWidth < 1000;
    root.classList.toggle('is-sheet-behind', root.inert);
    // Shift the group together when a shoreline crosses the preferred positions.
    // Keeping the relative spacing avoids stacking hit targets in narrow views.
    const minimumY = innerWidth < 760 ? 196 : 152;
    let points = layout.points;
    let waterCount = points.filter(point => lake.isWaterAt(point.x, point.y)).length;
    for (const offset of [-16, 16, -32, 32, -48, 48, -64, 64, -80, -96, -112, -128, -144, -160]) {
      const candidates = layout.points.map(point => ({ x: point.x, y: point.y + offset }));
      if (candidates.some(point => point.y < minimumY || point.y > layout.maxY)) continue;
      const count = candidates.filter(point => lake.isWaterAt(point.x, point.y)).length;
      if (count > waterCount) { points = candidates; waterCount = count; }
      if (waterCount === nodes.length) break;
    }
    const placed = [];
    points.forEach((point, index) => {
      const isValid = candidate => {
        if (!lake.isWaterAt(candidate.x, candidate.y)) return false;
        return !placed.some(other => Math.abs(other.x - candidate.x) < layout.nodeWidth && Math.abs(other.y - candidate.y) < layout.nodeHeight);
      };
      let position = point;
      if (!isValid(point)) {
        search: for (const dy of [0, 16, 32, 48]) {
          for (const dx of [0, -24, 24, -48, 48, -80, 80]) {
            const candidate = { x: Math.max(layout.anchorX + 16, Math.min(layout.arenaWidth - layout.nodeWidth + layout.anchorX, point.x + dx)), y: Math.min(layout.maxY, point.y + dy) };
            if (isValid(candidate)) { position = candidate; break search; }
          }
        }
      }
      placed.push(position);
      nodes[index].dataset.surface = lake.isWaterAt(position.x, position.y) ? 'water' : 'fallback';
      nodes[index].style.left = `${position.x}px`;
      nodes[index].style.top = `${position.y}px`;
      nodes[index].style.setProperty('--ring-flatness', String(.20 + .06 * position.y / innerHeight));
    });
  }
  function requestLayout() {
    cancelAnimationFrame(layoutFrame);
    layoutFrame = requestAnimationFrame(positionPoints);
  }

  function open({ focus = true } = {}) {
    if (opened) return;
    clearTimeout(hideTimer);
    opened = true;
    selected = null;
    detail.hidden = true;
    root.hidden = false;
    root.inert = false;
    root.classList.remove('is-sheet-behind');
    navigationButton.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('is-water-projects-open');
    updateLanguage(language);
    positionPoints();
    requestAnimationFrame(() => { if (opened) root.classList.add('is-visible'); });
    if (focus) nodes[0].focus({ preventScroll: true });
  }

  function closeDetail({ restoreFocus = true } = {}) {
    if (selected === null) return;
    const index = selected;
    selected = null;
    detail.hidden = true;
    root.inert = false;
    root.classList.remove('is-sheet-behind');
    delete detail.dataset.project;
    document.documentElement.classList.remove('is-water-project-detail-open');
    nodes.forEach(node => { node.classList.remove('is-selected'); node.setAttribute('aria-expanded', 'false'); });
    requestLayout();
    if (restoreFocus && opened) nodes[index].focus({ preventScroll: true });
  }

  function close({ restoreFocus = false } = {}) {
    if (!opened) return;
    closeDetail({ restoreFocus: false });
    opened = false;
    root.inert = true;
    root.classList.remove('is-visible');
    navigationButton.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('is-water-projects-open');
    clearTimeout(hideTimer);
    if (reducedMotion.matches) root.hidden = true;
    else hideTimer = setTimeout(() => { if (!opened) root.hidden = true; }, 240);
    if (restoreFocus) navigationButton.focus({ preventScroll: true });
  }

  function select(index, { focus = true } = {}) {
    if (!opened) open({ focus: false });
    selected = (index + nodes.length) % nodes.length;
    detail.hidden = false;
    document.documentElement.classList.add('is-water-project-detail-open');
    renderSelected({ resetScroll: true });
    positionPoints();
    if (focus) detail.focus({ preventScroll: true });
  }

  root.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault(); event.stopPropagation(); close({ restoreFocus: true });
      return;
    }
    const node = event.target.closest('.water-project-node');
    if (!node || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault(); event.stopPropagation();
    const index = Number(node.dataset.index);
    const destination = event.key === 'Home' ? 0 : event.key === 'End' ? nodes.length - 1 : (index + (['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1) + nodes.length) % nodes.length;
    nodes[destination].focus({ preventScroll: true });
  });
  detail.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeDetail(); }
  });
  back.addEventListener('click', () => closeDetail());
  exit.addEventListener('click', () => close({ restoreFocus: true }));
  previous.addEventListener('click', () => select(selected - 1, { focus: false }));
  next.addEventListener('click', () => select(selected + 1, { focus: false }));
  document.addEventListener('pointerdown', event => {
    if (opened && selected !== null && event.target.matches('#water, #fallback-water')) closeDetail({ restoreFocus: false });
  });
  document.addEventListener('contextmenu', event => {
    if (opened && event.target.matches('#water, #fallback-water')) close();
  });
  document.addEventListener('miao:languagechange', event => updateLanguage(event.detail.language));
  document.addEventListener('visibilitychange', () => { root.dataset.paused = String(document.hidden); });
  window.addEventListener('resize', requestLayout, { passive: true });
  new MutationObserver(() => {
    if (opened && document.querySelector('.interface').matches('.is-about-open, .is-time-selected, .is-waveform-open')) close();
  }).observe(document.querySelector('.interface'), { attributes: true, attributeFilter: ['class'] });
  updateLanguage(language);
  return { open, close, closeDetail, get isOpen() { return opened; }, get selectedProject() { return selected === null ? null : portfolio.projects[selected].id; } };
}
