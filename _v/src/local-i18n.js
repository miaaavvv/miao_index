import { renderPortfolio } from './portfolio.js?v=sleep-intro-image-20261125';
import { supportedLanguages, languageForCountry, browserCountry } from './language-utils.js';

const messages = {
  'zh-Hans': {
    scene: '场景', projects: '项目', about: '个人介绍', education: '教育经历', closeEducation: '关闭教育经历', closeAbout: '关闭个人介绍', quickNav: '快捷导航', navigation: '网站导航', language: '语言',
    sceneEffects: '场景与效果', changeScene: '切换场景', closeScene: '关闭场景', closeProjects: '关闭项目',
    mountainLake: '山间湖泊', lakeside: '林边湖岸', mountains: '群山倒影', lakeScenes: '湖面场景',
    view: '视角', sceneView: '场景视角', pureWater: '纯水面', distantView: '远景', timeTravel: '时光转换',
    breeze: '微风', ripple: '涟漪', light: '光线', breezeStrength: '微风强度', rippleStrength: '涟漪强度', lightLevel: '光线亮度', resetEffects: '恢复默认效果',
    noProjects: '还没有添加项目', projectHint: '项目作品将在这里展示。',
    playerVolume: '播放器音量', volume: '音量', volumeMuted: '音量（已静音）', masterVolume: '主音量', mute: '静音', unmute: '取消静音',
    changeTime: '调整时间', closeTime: '关闭时间调节', timeDial: '时光转换', timeOfDay: '昼夜时间', now: '现在', restoreTime: '恢复当前时间', am: '上午', pm: '下午',
    playMusic: '播放音乐', play: '播放', pause: '暂停', previous: '上一首', next: '下一首', waveform: '查看波形', closeWaveform: '关闭波形', songPosition: '播放进度',
    sceneOptions: '场景选项', lakeControls: '湖面控制', interactiveLake: '互动湖面', traveling: '正在前往',
    siteTitle: 'MIAO · 产品与 AI', aboutTitle: '关于 MIAO',
    closeDesignViewer: '关闭大图', previousDesign: '上一张界面图', nextDesign: '下一张界面图',
    waterProjects: '水面项目导航', backToCoordinates: '返回项目坐标', previousProject: '上一个项目', nextProject: '下一个项目',
  },
  'zh-Hant': {
    scene: '場景', projects: '專案', about: '個人介紹', education: '教育經歷', closeEducation: '關閉教育經歷', closeAbout: '關閉個人介紹', quickNav: '快捷導覽', navigation: '網站導覽', language: '語言',
    sceneEffects: '場景與效果', changeScene: '切換場景', closeScene: '關閉場景', closeProjects: '關閉專案',
    mountainLake: '山間湖泊', lakeside: '林邊湖岸', mountains: '群山倒影', lakeScenes: '湖面場景',
    view: '視角', sceneView: '場景視角', pureWater: '純水面', distantView: '遠景', timeTravel: '時光轉換',
    breeze: '微風', ripple: '漣漪', light: '光線', breezeStrength: '微風強度', rippleStrength: '漣漪強度', lightLevel: '光線亮度', resetEffects: '恢復預設效果',
    noProjects: '還沒有新增專案', projectHint: '專案作品將在這裡展示。',
    playerVolume: '播放器音量', volume: '音量', volumeMuted: '音量（已靜音）', masterVolume: '主音量', mute: '靜音', unmute: '取消靜音',
    changeTime: '調整時間', closeTime: '關閉時間調整', timeDial: '時光轉換', timeOfDay: '日夜時間', now: '現在', restoreTime: '恢復目前時間', am: '上午', pm: '下午',
    playMusic: '播放音樂', play: '播放', pause: '暫停', previous: '上一首', next: '下一首', waveform: '檢視波形', closeWaveform: '關閉波形', songPosition: '播放進度',
    sceneOptions: '場景選項', lakeControls: '湖面控制', interactiveLake: '互動湖面', traveling: '正在前往',
    siteTitle: 'MIAO · 產品與 AI', aboutTitle: '關於 MIAO',
    closeDesignViewer: '關閉大圖', previousDesign: '上一張介面圖', nextDesign: '下一張介面圖',
    waterProjects: '水面專案導覽', backToCoordinates: '返回專案座標', previousProject: '上一個專案', nextProject: '下一個專案',
  },
  en: {
    scene: 'Scene', projects: 'Projects', about: 'About', education: 'Education', closeEducation: 'Close education', closeAbout: 'Close about', quickNav: 'Quick navigation', navigation: 'Site navigation', language: 'Language',
    sceneEffects: 'Scene & effects', changeScene: 'Change scene', closeScene: 'Close scene', closeProjects: 'Close projects',
    mountainLake: 'Mountain lake', lakeside: 'Woodland shore', mountains: 'Mountain reflections', lakeScenes: 'Lake scenery',
    view: 'View', sceneView: 'Scene view', pureWater: 'Water surface', distantView: 'Landscape', timeTravel: 'Time travel',
    breeze: 'Breeze', ripple: 'Ripples', light: 'Light', breezeStrength: 'Breeze strength', rippleStrength: 'Ripple strength', lightLevel: 'Light level', resetEffects: 'Reset effects',
    noProjects: 'No projects yet', projectHint: 'Selected work will appear here.',
    playerVolume: 'Player volume', volume: 'Volume', volumeMuted: 'Volume (muted)', masterVolume: 'Master volume', mute: 'Mute', unmute: 'Unmute',
    changeTime: 'Change the time of day', closeTime: 'Close time controls', timeDial: 'Time travel', timeOfDay: 'Time of day', now: 'Now', restoreTime: 'Back to local time', am: 'a.m.', pm: 'p.m.',
    playMusic: 'Play music', play: 'Play', pause: 'Pause', previous: 'Previous track', next: 'Next track', waveform: 'Show waveform', closeWaveform: 'Close waveform', songPosition: 'Song position',
    sceneOptions: 'Scene options', lakeControls: 'Lake controls', interactiveLake: 'Interactive lake', traveling: 'Traveling',
    siteTitle: 'MIAO · Product & AI', aboutTitle: 'About MIAO',
    closeDesignViewer: 'Close image viewer', previousDesign: 'Previous screen', nextDesign: 'Next screen',
    waterProjects: 'Project coordinates on the water', backToCoordinates: 'Back to project coordinates', previousProject: 'Previous project', nextProject: 'Next project',
  },
};

const preferenceKey = 'miao.language.v1';
let activeLanguage = 'en';
let manualPreference = false;
let lake;
export function translate(key) { return messages[activeLanguage][key] ?? messages.en[key] ?? key; }
function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element && element.textContent !== value) element.textContent = value;
}
function setAttribute(selector, name, value) {
  const element = document.querySelector(selector);
  if (element && element.getAttribute(name) !== value) element.setAttribute(name, value);
}
function applyCoreLanguage() {
  if (!lake) return;
  const state = lake.getUiState();
  const time = lake.getTime();
  const t = translate;
  const track = state.track;
  const meridiem = t(time.minutes >= 720 ? 'pm' : 'am');
  const displayTime = `${Math.floor(time.minutes / 60) % 12 || 12}:${String(time.minutes % 60).padStart(2, '0')} ${meridiem}`;
  setAttribute('#time-label', 'aria-label', displayTime);
  setAttribute('#time-slider-value', 'aria-label', displayTime);
  setAttribute('#time-range', 'aria-valuetext', displayTime);
  setAttribute('#time-button', 'aria-label', t(state.timeOpen ? 'closeTime' : 'changeTime'));
  setAttribute('#time-scrubber', 'aria-label', t('timeDial'));
  setAttribute('#time-range', 'aria-label', t('timeOfDay'));
  setText('#time-slider-mode-current', t(state.live ? 'now' : 'restoreTime'));
  setAttribute('#time-slider-mode', 'aria-label', t(state.live ? 'now' : 'restoreTime'));
  setText('.time-meridiem .time-slot-value', meridiem);
  setText('#time-slider-meridiem', ` ${meridiem}`);
  setAttribute('#about-panel', 'aria-label', t('aboutTitle'));
  setAttribute('#site-title', 'aria-label', t('aboutTitle'));
  setAttribute('#track-previous', 'aria-label', t('previous'));
  setAttribute('#track-next', 'aria-label', t('next'));
  setAttribute('#track-waveform-range', 'aria-label', t('songPosition'));
  if (state.initialTrack) {
    setText('#track-current-title .track-current-title-text', t('playMusic'));
    setAttribute('#track-current-title', 'aria-label', t('playMusic'));
    setAttribute('#track-playback-toggle', 'aria-label', t('playMusic'));
  } else {
    setAttribute('#track-current-title', 'aria-label', `${t('waveform')}: ${track.title}`);
    setAttribute('#track-playback-toggle', 'aria-label', `${t(state.playing ? 'pause' : 'play')}: ${track.title} · ${track.artist}`);
    setAttribute('#track-waveform', 'aria-label', `${t('waveform')}: ${track.title} · ${track.artist}`);
  }
}
function applyLanguage(language, { persist = false } = {}) {
  if (!supportedLanguages.includes(language)) return;
  activeLanguage = language;
  if (persist) {
    manualPreference = true;
    try { localStorage.setItem(preferenceKey, language); } catch {}
  }
  document.documentElement.lang = language;
  const t = translate;
  document.title = t('siteTitle');
  document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const text = t(element.dataset.i18n);
    if (element.textContent !== text) element.textContent = text;
  });
  const textSelectors = {
    '[data-nav="scene"] .local-nav-label': 'scene', '[data-nav="projects"] .local-nav-label': 'projects', '[data-nav="about"] .local-nav-label': 'about',
    '#tool-scene h2': 'scene', '#tool-education h2': 'education', '[data-nav="education"] .local-nav-label': 'education',
    '[data-environment="disola"]': 'mountainLake', '[data-environment="lakeside"]': 'lakeside', '[data-environment="mountains"]': 'mountains',
    '.local-section-label': 'view', '[data-view="alt"]': 'pureWater', '[data-view="vast"]': 'distantView',
    'label[for="local-breeze"] span': 'breeze', 'label[for="local-ripple"] span': 'ripple', 'label[for="local-exposure"] span': 'light',
    '#local-reset-settings': 'resetEffects', '.local-empty-projects p': 'noProjects', '.local-empty-projects small': 'projectHint',
  };
  for (const [selector, key] of Object.entries(textSelectors)) setText(selector, t(key));
  const labels = {
    '.local-tools': 'quickNav', '.local-dock': 'navigation', '.local-language': 'language',
    '[data-nav="scene"]': 'scene', '[data-nav="projects"]': 'projects', '[data-nav="about"]': 'about',
    '#tool-scene': 'sceneEffects', '#tool-education': 'education', '[data-nav="education"]': 'education', '#tool-education [data-close]': 'closeEducation', '#resume-about-close': 'closeAbout',
    '#tool-scene [data-close]': 'closeScene',
    '[data-close-core="time"]': 'closeTime', '[data-close-core="waveform"]': 'closeWaveform',
    '.local-scene-options': 'lakeScenes', '.local-view-options': 'sceneView',
    '#local-breeze': 'breezeStrength', '#local-ripple': 'rippleStrength', '#local-exposure': 'lightLevel',
    '.local-audio': 'playerVolume', '#local-volume': 'masterVolume', '#context-links': 'sceneOptions', '.interface': 'lakeControls', '.lake': 'interactiveLake',
  };
  for (const [selector, key] of Object.entries(labels)) setAttribute(selector, 'aria-label', t(key));
  const volumeButton = document.getElementById('local-volume-toggle');
  const muted = volumeButton.classList.contains('is-muted');
  setAttribute('#local-volume-toggle', 'aria-label', t(muted ? 'volumeMuted' : 'volume'));
  setText('#local-mute', t(muted ? 'unmute' : 'mute'));
  // Preserve the output element in the volume label.
  const volumeLabel = document.querySelector('label[for="local-volume"]');
  if (volumeLabel?.firstChild?.nodeType === Node.TEXT_NODE) volumeLabel.firstChild.textContent = `${t('volume')} `;
  const traveling = document.getElementById('traveling-word');
  if (traveling?.firstChild?.nodeType === Node.TEXT_NODE) traveling.firstChild.textContent = t('traveling');
  renderPortfolio(language);
  document.dispatchEvent(new CustomEvent('miao:languagechange', { detail: { language } }));
  applyCoreLanguage();
}

export async function initLanguage(controls) {
  lake = controls;
  let preference;
  try { preference = localStorage.getItem(preferenceKey); } catch {}
  manualPreference = supportedLanguages.includes(preference);
  const country = browserCountry(navigator.languages || [navigator.language], Intl.DateTimeFormat().resolvedOptions().timeZone);
  applyLanguage(manualPreference ? preference : languageForCountry(country));
  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => applyLanguage(button.dataset.language, { persist: true })));
  const header = document.querySelector('.local-site-header');
  for (const event of ['pointerdown', 'pointermove', 'pointerup', 'click', 'keydown', 'keyup']) header.addEventListener(event, value => value.stopPropagation());
  new MutationObserver(applyCoreLanguage).observe(document.querySelector('.interface'), {
    subtree: true, childList: true, attributes: true,
    attributeFilter: ['aria-label', 'aria-hidden', 'data-playback'],
  });
  if (!manualPreference) {
    try {
      const response = await fetch('/api/region', { signal: AbortSignal.timeout(3000) });
      if (!response.ok) return;
      const { country: detectedCountry } = await response.json();
      if (detectedCountry && !manualPreference) {
        document.documentElement.dataset.region = detectedCountry;
        applyLanguage(languageForCountry(detectedCountry));
      }
    } catch { /* Keep the browser-region fallback; the page remains usable offline. */ }
  }
}
