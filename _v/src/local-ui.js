import { initPerformance } from './local-performance.js?v=1';
import { initProjectGallery } from './project-gallery.js?v=sleep-design-20261124';
import { initLanguage, translate } from './local-i18n.js?v=project-image-numbers-20261125';
import { localLakeControls as lake } from './alt-main.e37b8660abd26238.js?v=quick-entry-20261123';

import { createWaterProjects } from './project-water.js?v=project-image-numbers-20261125';

let projectWater;
const tools = document.querySelector('.local-tools');
const buttons = [...tools.querySelectorAll('[data-nav]')];
const panels = [...tools.querySelectorAll('.local-tool-panel')];
const about = buttons.find(button => button.dataset.nav === 'about');
const icons = {
  scene: '<path d="m3 17 5-8 4 6 3-4 6 9H3z"/><circle cx="17" cy="5" r="2"/>',
  projects: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  education: '<path d="m2 9 10-5 10 5-10 5zM6 11v6c4 3 8 3 12 0v-6M22 9v7"/>',
  about: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
};
buttons.forEach(button => {
  button.querySelector('.local-nav-icon').innerHTML = `<svg viewBox="0 0 24 24">${icons[button.dataset.nav]}</svg>`;
});

function closePanels({ restoreFocus = false } = {}) {
  const active = buttons.find(button => !['about', 'projects'].includes(button.dataset.nav) && button.getAttribute('aria-expanded') === 'true');
  panels.forEach(panel => { panel.hidden = true; });
  buttons.filter(button => !['about', 'projects'].includes(button.dataset.nav)).forEach(button => button.setAttribute('aria-expanded', 'false'));
  if (restoreFocus) active?.focus();
}
function syncSettings() {
  const settings = lake.getSettings();
  tools.querySelectorAll('[data-setting]').forEach(input => {
    input.value = settings[input.dataset.setting];
    document.getElementById(`${input.id}-value`).value = `${input.value}%`;
  });
  tools.querySelectorAll('[data-environment]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.environment === settings.environment)));
  tools.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === lake.getView())));

}
function openPanel(name) {
  projectWater?.close();
  closePanels();
  lake.closeOverlays();
  closeVolume();
  syncSettings();
  const button = buttons.find(button => button.dataset.nav === name);
  const panel = document.getElementById(button.getAttribute('aria-controls'));
  panel.hidden = false;
  panel.scrollTop = 0;
  panel.focus({ preventScroll: true });
  button.setAttribute('aria-expanded', 'true');
}
buttons.forEach(button => button.addEventListener('click', () => {
  if (button.dataset.nav === 'projects') {
    const wasOpen = projectWater.isOpen;
    closePanels();
    lake.closeOverlays();
    closeVolume();
    if (wasOpen) projectWater.close();
    else projectWater.open({ focus: true });
    return;
  }
  const wasOpen = button.getAttribute('aria-expanded') === 'true';
  projectWater.close();
  closePanels();
  lake.closeOverlays();
  closeVolume();
  if (wasOpen) return;
  if (button === about) lake.openAbout();
  else openPanel(button.dataset.nav);
}));
new MutationObserver(() => about.setAttribute('aria-expanded', String(document.getElementById('about-panel').getAttribute('aria-hidden') === 'false')))
  .observe(document.getElementById('about-panel'), { attributes: true, attributeFilter: ['aria-hidden'] });
tools.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => closePanels({ restoreFocus: true })));
document.addEventListener('pointerdown', event => {
  if (!event.target.closest('.local-dock, .local-tool-panel')) closePanels();
  if (!event.target.closest('.local-audio')) closeVolume();
});
tools.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (projectWater?.isOpen) projectWater.close({ restoreFocus: true });
    else closePanels({ restoreFocus: true });
  }
});
for (const event of ['pointerdown', 'pointermove', 'pointerup', 'click', 'contextmenu', 'keydown', 'keyup']) {
  tools.addEventListener(event, value => value.stopPropagation());
}
// Both entry points share the reference renderer's central vertical time dial.
function openTimeTravel() {
  projectWater?.close();
  closePanels();
  closeVolume();
  lake.closeOverlays();
  lake.openTime();
}
document.getElementById('time-button').addEventListener('click', event => {
  event.stopImmediatePropagation();
  openTimeTravel();
}, { capture: true });

const volume = document.getElementById('local-volume');
const volumeValue = document.getElementById('local-volume-value');
const muteButton = document.getElementById('local-mute');
const volumeToggle = document.getElementById('local-volume-toggle');
const volumePopover = document.getElementById('local-volume-popover');
const audioTools = document.querySelector('.local-audio');
let savedVolume = 100;
function closeVolume() {
  volumePopover.hidden = true;
  volumeToggle.setAttribute('aria-expanded', 'false');
}
function updateVolume(value) {
  volume.value = value;
  volumeValue.value = `${value}%`;
  muteButton.textContent = translate(value === 0 ? 'unmute' : 'mute');
  volumeToggle.classList.toggle('is-muted', value === 0);
  volumeToggle.setAttribute('aria-label', translate(value === 0 ? 'volumeMuted' : 'volume')); 
  lake.setVolume(value / 100);
}
volumeToggle.addEventListener('click', () => {
  const wasOpen = !volumePopover.hidden;
  closePanels();
  volumePopover.hidden = wasOpen;
  volumeToggle.setAttribute('aria-expanded', String(!wasOpen));
});
volume.addEventListener('input', () => {
  updateVolume(Number(volume.value));
  if (Number(volume.value)) savedVolume = Number(volume.value);
});
muteButton.addEventListener('click', () => updateVolume(Number(volume.value) === 0 ? savedVolume : 0));
audioTools.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closeVolume(); volumeToggle.focus(); }
});
for (const event of ['pointerdown', 'pointermove', 'pointerup', 'click', 'contextmenu', 'keydown', 'keyup']) {
  audioTools.addEventListener(event, value => value.stopPropagation());
}

function retainScenePanel() {
  try { sessionStorage.setItem('localLake.openScene', '1'); } catch {}
}
document.getElementById('local-change-scene').addEventListener('click', () => {
  retainScenePanel();
  document.getElementById('change-scene').click();
});
tools.querySelectorAll('[data-environment]').forEach(button => button.addEventListener('click', () => {
  lake.setSettings({ environment: button.dataset.environment });
  syncSettings();
}));
tools.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.view === lake.getView()) return;
  try {
    sessionStorage.setItem('localLake.nextScene', JSON.stringify({ environment: lake.getSettings().environment, view: button.dataset.view }));
  } catch { return; }
  retainScenePanel();
  location.reload();
}));
document.getElementById('local-time-travel').addEventListener('click', openTimeTravel);
tools.querySelectorAll('[data-setting]').forEach(input => input.addEventListener('input', () => {
  lake.setSettings({ [input.dataset.setting]: Number(input.value) });
  syncSettings();
}));
document.getElementById('local-reset-settings').addEventListener('click', () => {
  lake.resetSettings();
  syncSettings();
});
window.addEventListener('altbreezefollow', syncSettings);
syncSettings();
document.getElementById('about-panel').addEventListener('keydown', event => {
  if (event.key === 'Escape') { event.stopPropagation(); lake.closeOverlays(); about.focus(); }
});
document.getElementById('resume-about-close').addEventListener('click', () => { lake.closeOverlays(); about.focus(); });
try {
  if (sessionStorage.getItem('localLake.openScene') === '1') {
    sessionStorage.removeItem('localLake.openScene');
    openPanel('scene');
  }
} catch {}

projectWater = createWaterProjects({ lake, translate, navigationButton: buttons.find(button => button.dataset.nav === 'projects') });
initProjectGallery({ translate, lake });
initLanguage(lake);

initPerformance(lake);

// Keep each exit inside its dialog for touch and assistive technology.
document.querySelectorAll('[data-close-core]').forEach(button => {
  for (const event of ['pointerdown', 'pointermove', 'pointerup', 'keyup']) {
    button.addEventListener(event, value => value.stopPropagation());
  }
  button.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); button.click(); }
    event.stopPropagation();
  });
  button.addEventListener('click', event => {
    event.stopPropagation();
    lake.closeOverlays();
    // Reading-mode visibility is synchronized by a MutationObserver. Wait one
    // frame so the opener is visible before returning keyboard focus.
    requestAnimationFrame(() => document.getElementById(button.dataset.closeCore === 'time' ? 'time-button' : 'track-current-title').focus({ preventScroll: true }));
  });
});

// The entrance can release as soon as both the interface and a lake frame
// exist, even if an embedded browser delays a module script's load callback.
document.documentElement.setAttribute('data-miao-ui-ready', 'true');
document.dispatchEvent(new CustomEvent('miao:uiready'));
