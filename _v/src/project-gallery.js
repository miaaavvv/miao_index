import { portfolio } from './portfolio-content.js?v=sleep-design-20261124';
import { screenshotForTheme, screenshotThemeForMinutes } from './project-image-theme.js?v=privacy-20261119';

const pick = (value, language) => typeof value === 'string' ? value : value[language] ?? value.en;
const twoDigits = value => String(value).padStart(2, '0');

// Return the case-gallery step for a deliberate horizontal swipe.
export function gallerySwipeStep(dx, dy) {
  if (Math.abs(dx) < 48 || Math.abs(dy) > Math.abs(dx) * .6) return 0;
  return dx < 0 ? 1 : -1;
}

export function initProjectGallery({ translate: t, lake }) {
  const viewer = document.getElementById('project-design-viewer');
  const body = document.getElementById('water-project-body');
  const detail = document.getElementById('water-project-detail');
  const image = document.getElementById('project-design-image');
  const stage = document.getElementById('project-design-stage');
  const closeButton = document.getElementById('project-design-viewer-close');
  const previous = document.getElementById('project-design-image-previous');
  const next = document.getElementById('project-design-image-next');
  let language = document.documentElement.lang || 'en';
  let selection = null;
  let opener;
  let swipe;
  let swiped = false;
  let screenshotTheme;

  function updateThumbnails() {
    if (detail.hidden) return;
    const projectId = body.querySelector('.water-detail-article')?.dataset.project;
    const project = portfolio.projects.find(item => item.id === projectId);
    if (!project?.designScreens) return;
    body.querySelectorAll('[data-design-index]').forEach(button => {
      const screen = project.designScreens[Number(button.dataset.designIndex)];
      if (!screen) return;
      const asset = screenshotForTheme(screen, screenshotTheme);
      const thumbnail = button.querySelector('img');
      if (thumbnail.getAttribute('src') !== asset.thumbnail) thumbnail.src = asset.thumbnail;
      thumbnail.width = asset.thumbnailWidth ?? 320;
      thumbnail.height = asset.thumbnailHeight ?? 695;
      thumbnail.style.aspectRatio = `${asset.width} / ${asset.height}`;
    });
    const status = body.querySelector('[data-gallery-theme-status]');
    if (status) status.textContent = pick(portfolio.labels[screenshotTheme === 'dark' ? 'nightScreens' : 'dayScreens'], language);
  }

  function updateTheme() {
    const theme = screenshotThemeForMinutes(lake.getTime().minutes);
    if (theme === screenshotTheme) return;
    screenshotTheme = theme;
    document.documentElement.dataset.projectScreenshotTheme = theme;
    updateThumbnails();
    render();
  }

  function render() {
    if (!selection) return;
    const { project, index } = selection;
    const screen = project.designScreens[index];
    const asset = screenshotForTheme(screen, screenshotTheme);
    document.getElementById('project-design-viewer-title').textContent = pick(screen.title, language);
    document.getElementById('project-design-viewer-counter').textContent = `${twoDigits(index + 1)} / ${twoDigits(project.designScreens.length)}`;
    document.getElementById('project-design-viewer-caption').textContent = pick(screen.caption, language);
    image.alt = `${pick(screen.title, language)} — ${pick(screen.caption, language)}`;
    image.width = asset.width;
    image.height = asset.height;
    // Full PNGs are requested only when viewing an individual screen.
    if (image.getAttribute('src') !== asset.src) image.src = asset.src;

  }

  function updateLanguage(value) {
    language = value;
    closeButton.setAttribute('aria-label', t('closeDesignViewer'));
    previous.setAttribute('aria-label', t('previousDesign'));
    next.setAttribute('aria-label', t('nextDesign'));
    updateThumbnails();
    render();
  }

  function close({ restoreFocus = true } = {}) {
    if (!selection) return;
    const index = selection.index;
    selection = null;
    swipe = null;
    viewer.close();
    image.removeAttribute('src');
    document.documentElement.classList.remove('is-design-viewer-open');
    if (restoreFocus) {
      const target = opener?.isConnected ? opener : body.querySelector(`[data-design-index="${index}"]`);
      target?.focus({ preventScroll: true });
    }
  }

  function move(index) {
    if (!selection) return;
    const length = selection.project.designScreens.length;
    selection.index = (index + length) % length;
    render();
  }

  body.addEventListener('click', event => {
    const button = event.target.closest('[data-design-index]');
    if (!button) return;
    const projectId = body.querySelector('.water-detail-article')?.dataset.project;
    const project = portfolio.projects.find(item => item.id === projectId);
    const index = Number(button.dataset.designIndex);
    if (!project?.designScreens?.[index]) return;
    opener = button;
    selection = { project, index };
    render();
    document.documentElement.classList.add('is-design-viewer-open');
    viewer.showModal();
    closeButton.focus({ preventScroll: true });
  });
  // A horizontal single-finger gesture changes images; vertical scrolling and
  // pinch zoom remain browser gestures. Never turn a two-finger pinch into a swipe.
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch') return;
    swiped = false;
    swipe = event.isPrimary ? { id: event.pointerId, x: event.clientX, y: event.clientY } : null;
  }, { passive: true });
  stage.addEventListener('pointercancel', () => { swipe = null; }, { passive: true });
  stage.addEventListener('pointerup', event => {
    if (!swipe || swipe.id !== event.pointerId || !selection) return;
    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y;
    swipe = null;
    const step = gallerySwipeStep(dx, dy);
    if (!step) return;
    swiped = true;
    move(selection.index + step);
  }, { passive: true });
  stage.addEventListener('click', event => {
    if (!swiped) return;
    swiped = false;
    event.preventDefault();
    event.stopPropagation();
  });
  closeButton.addEventListener('click', () => close());
  previous.addEventListener('click', () => move(selection.index - 1));
  next.addEventListener('click', () => move(selection.index + 1));
  viewer.addEventListener('click', event => {
    if (event.target === viewer || event.target === stage) close();
  });
  viewer.addEventListener('cancel', event => {
    event.preventDefault();
    event.stopPropagation();
    close();
  });
  viewer.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault(); event.stopPropagation(); close();
    } else if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault(); event.stopPropagation();
      move(event.key === 'Home' ? 0 : event.key === 'End' ? selection.project.designScreens.length - 1 : selection.index + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  new MutationObserver(() => {
    if (selection && (detail.hidden || detail.dataset.project !== selection.project.id)) close({ restoreFocus: false });
  }).observe(detail, {attributes:true, attributeFilter:['hidden', 'data-project']});
  document.addEventListener('miao:languagechange', event => updateLanguage(event.detail.language));
  new MutationObserver(updateTheme).observe(document.getElementById('time-range'), { attributes: true, attributeFilter: ['aria-valuetext'] });
  new MutationObserver(updateThumbnails).observe(body, { childList: true });
  updateTheme();
  updateLanguage(language);
}
