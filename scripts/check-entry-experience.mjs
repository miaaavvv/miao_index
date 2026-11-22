import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../_v/src/entry-experience.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

// A deliberately small browser boundary, with the real page's IDs and data
// attributes. No GPU, network or wall-clock waits are involved in these checks.
function entrance({ webgl2 = true, wechat = false, clipboard = 'success', mutation = true, browserLanguage = 'zh-CN' } = {}) {
  const nodes = new Map();
  const all = [];
  const timers = [];
  const observers = [];
  const appended = [];
  const navigations = [];
  let now = 0;
  let document;
  class Element {
    constructor(tag = 'div', attributes = {}) {
      this.tagName = tag.toUpperCase(); this.attributes = { ...attributes };
      this.id = attributes.id ?? ''; this.hidden = 'hidden' in attributes;
      this.inert = 'inert' in attributes; this.disabled = 'disabled' in attributes; this.textContent = ''; this.value = '';
      this.events = new Map(); this.selected = false;
      const classes = new Set((attributes.class ?? '').split(/\s+/).filter(Boolean));
      this.classList = {
        add: (...names) => names.forEach(name => classes.add(name)),
        remove: (...names) => names.forEach(name => classes.delete(name)),
        contains: name => classes.has(name),
        toggle(name, force = !classes.has(name)) { force ? classes.add(name) : classes.delete(name); return force; },
      };
    }
    getAttribute(name) { return this.attributes[name] ?? null; }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    addEventListener(type, listener) { const list = this.events.get(type) ?? []; list.push(listener); this.events.set(type, list); }
    fire(type, values = {}) {
      const event = { currentTarget: this, target: this, preventDefault() { this.defaultPrevented = true; }, ...values };
      for (const listener of this.events.get(type) ?? []) listener(event);
      return event;
    }
    click() { return this.fire('click'); }
    focus() { document.activeElement = this; }
    select() { this.selected = true; }
    querySelectorAll(selector) {
      if (this.id === 'browser-guide' && selector === 'button,input') {
        return ['browser-guide-close', 'browser-link', 'browser-copy'].map(id => nodes.get(id));
      }
      return [];
    }
  }
  for (const match of html.matchAll(/<([a-z][\w-]*)\b([^<>]*)>/gi)) {
    const attributes = {};
    for (const [, name, quoted, unquoted] of match[2].matchAll(/([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'))?/g)) {
      attributes[name] = quoted ?? unquoted ?? '';
    }
    const node = new Element(match[1], attributes);
    if (node.id) nodes.set(node.id, node);
    all.push(node);
  }
  const root = new Element('html', { class: 'is-alt-layout is-arriving' });
  const lake = all.find(node => (node.attributes.class ?? '').split(/\s+/).includes('lake'));
  const body = new Element('body'); body.appendChild = node => { appended.push(node); return node; };
  const documentEvents = new Map();
  document = {
    documentElement: root, body, activeElement: body,
    getElementById: id => nodes.get(id),
    querySelector: selector => selector === '.lake' ? lake : null,
    querySelectorAll(selector) {
      const match = /^([a-z]+)?\[([\w-]+)\]$/.exec(selector);
      return match ? all.filter(node => match[2] in node.attributes && (!match[1] || node.tagName === match[1].toUpperCase())) : [];
    },
    createElement(tag) {
      const node = new Element(tag);
      if (tag === 'script') node.noModule = false;
      if (tag === 'canvas') node.getContext = kind => kind === 'webgl2' && webgl2
        ? { getExtension: () => ({ loseContext() {} }) } : null;
      return node;
    },
    addEventListener(type, callback) { documentEvents.set(type, callback); },
  };
  const location = { reload() { navigations.push('reload'); }, assign(url) { navigations.push(url); } };
  Object.defineProperty(location, 'href', { get: () => 'https://miaaavvv.github.io/miao_index/?source=hr#projects', set: value => navigations.push(value) });
  const navigator = { userAgent: wechat ? 'Mozilla/5.0 iPhone MicroMessenger/8.0' : 'Mozilla/5.0 Chrome/140 Safari/537', language: browserLanguage };
  if (clipboard !== 'missing') navigator.clipboard = { writeText: () => clipboard === 'reject' ? Promise.reject(new Error('Clipboard denied')) : Promise.resolve() };
  const sandbox = {
    document, navigator, location, Promise, fetch() {}, AbortController,
    localStorage: { getItem() { return null; } },
    setTimeout(callback, delay = 0) { timers.push({ callback, at: now + delay }); return timers.length; },
    clearTimeout() {},
    open(url) { navigations.push(url); return null; },
  };
  if (mutation) sandbox.MutationObserver = class {
    constructor(callback) { this.callback = callback; }
    observe(target, options) { observers.push({ target, options, callback: this.callback }); }
    disconnect() {}
  };
  sandbox.window = sandbox;
  vm.runInNewContext(source, sandbox, { filename: 'entry-experience.js', timeout: 1000 });
  const advance = milliseconds => {
    now += milliseconds;
    for (let i = 0; i < timers.length;) {
      if (timers[i].at <= now) timers.splice(i, 1)[0].callback(); else i++;
    }
  };
  return {
    node: id => nodes.get(id), root, lake, appended, navigations, document, advance,
    keywords: () => all.filter(node => /^rotate\d+$/.test(node.getAttribute('data-entry-text') ?? '')).map(node => node.textContent),
    ready() { root.classList.add('water-ready'); for (const observer of observers) if (observer.target === root) observer.callback([]); },
    loadModules() { for (const script of appended) script.onload?.(); },
    state: () => nodes.get('entry-screen').getAttribute('data-state'),
    language(value) { documentEvents.get('miao:languagechange')?.({ detail: { language: value } }); },
  };
}

for (const expected of [
  { browser: 'zh-CN', locale: 'zh-Hans', title: '欢迎访问 MIAO 的个人页面', loading: '页面正在加载中...', words: ['在格拉斯哥艺术学院，读过服务设计硕士', '做过 C 端产品，也做过 B 端 SaaS', '让 AI 拆出的书摘，走进岛读 App', '让 Agent 一起工作，也让审核有据可查', '从用户访谈，走到上线后的数据验证', '和 Codex、AirBuild 一起，把想法做出来'] },
  { browser: 'zh-TW', locale: 'zh-Hant', title: '歡迎訪問 MIAO 的個人頁面', loading: '頁面正在載入中...', words: ['在格拉斯哥藝術學院，讀過服務設計碩士', '做過 C 端產品，也做過 B 端 SaaS', '讓 AI 拆出的書摘，走進島讀 App', '讓 Agent 一起工作，也讓審核有據可查', '從使用者訪談，走到上線後的數據驗證', '和 Codex、AirBuild 一起，把想法做出來'] },
  { browser: 'en-GB', locale: 'en', title: 'Welcome to MIAO’s personal page', loading: 'The page is loading...', words: ['A service design master’s from Glasgow', 'Experience in consumer products and SaaS', 'Bringing AI book notes into Daodu', 'Agents working together, reviews you can trace', 'From user interviews to product metrics', 'Building ideas with Codex and AirBuild'] },
]) {
  const app = entrance({ browserLanguage: expected.browser });
  assert.equal(app.node('entry-headline').textContent, expected.title);
  assert.equal(app.node('entry-screen').getAttribute('lang'), expected.locale);
  assert.equal(app.node('entry-status').textContent, expected.loading);
  assert.equal(app.node('entry-loading').disabled, true, 'The status button must not promise a clickable loading action');
  assert.equal(app.node('entry-loading').hidden, false);
  assert.deepEqual([...new Set(app.keywords())], expected.words, 'Rotate concise, factual stories from the resume');
  assert.equal(app.node('entry-note').hidden, true, 'Do not restore the long introduction during normal loading');
  assert.equal(app.node('entry-read').hidden, true);
  assert.equal(app.node('entry-retry').hidden, true);
  app.advance(10000);
  assert.equal(app.state(), 'slow');
  assert.equal(app.node('entry-headline').textContent, expected.title, 'A slow network must keep the minimal welcome screen');
  assert.equal(app.node('entry-status').textContent, expected.loading);
  assert.equal(app.node('entry-retry').hidden, true);
}

{
  const app = entrance({ webgl2: false });
  assert.equal(app.appended.length, 0, 'Unsupported hardware must not fetch the heavyweight modules');
  assert.equal(app.state(), 'unsupported');
  assert.match(app.node('entry-headline').textContent, /Chrome.*Safari/);
  assert.equal(app.node('entry-screen').hidden, false);
  app.advance(10000);
  assert.equal(app.state(), 'unsupported', 'A later timer must not relabel incompatibility as a slow network');
}
{
  const app = entrance();
  assert(app.appended.length >= 2, 'Supported browsers should start both application modules');
  app.loadModules(); app.ready();
  assert.equal(app.node('entry-screen').hidden, true, 'A ready application should reveal the lake');
  assert.equal(app.lake.inert, false);
  assert.equal(app.root.classList.contains('is-arriving'), false, 'A missing arrival helper must not leave the loaded interface invisible');
  app.advance(10000);
  assert.equal(app.node('entry-screen').hidden, true, 'The slow timer must not reopen a ready page');
}
{
  const app = entrance(); app.ready();
  assert.equal(app.node('entry-screen').hidden, false, 'A rendered lake alone is insufficient when UI modules are still loading');
  app.appended[0].onload();
  assert.equal(app.node('entry-screen').hidden, false, 'One module must not substitute for the remaining UI module');
  app.appended[1].onload();
  assert.equal(app.node('entry-screen').hidden, true, 'The final module load should release an already-rendered page');
}
{
  const app = entrance(); app.advance(9999);
  assert.equal(app.state(), 'loading');
  app.advance(1);
  assert.equal(app.state(), 'slow', 'A 10-second wait is a slow load, not proof of incompatibility');
  assert.doesNotMatch(app.node('entry-headline').textContent, /Chrome|Safari/);
  assert.equal(app.node('entry-retry').hidden, true);
  app.loadModules(); app.ready();
  assert.equal(app.node('entry-screen').hidden, true, 'A slow page can recover normally');
}
{
  const app = entrance({ wechat: true });
  assert.equal(app.node('browser-notice').hidden, true, 'Do not expose a background tab stop behind the entrance');
  assert.equal(app.node('entry-browser').hidden, false);
  app.node('entry-browser').click();
  assert.equal(app.node('browser-guide').hidden, false, 'The WeChat CTA must show usable browser instructions');
  assert.match(app.node('browser-guide-title').textContent, /窗口|旅程/);
  assert.deepEqual(app.navigations, [], 'Do not fake a successful external-browser launch');
  assert.equal(app.document.activeElement.id, 'browser-guide-close');
  app.node('browser-guide-close').click();
  assert.equal(app.node('browser-guide').hidden, true);
  assert.equal(app.document.activeElement.id, 'entry-browser');
  app.loadModules(); app.ready();
  assert.equal(app.node('browser-notice').hidden, false, 'The persistent browser CTA appears after leaving the entrance');
  app.node('browser-notice').click();
  assert.equal(app.node('browser-guide').hidden, false);
  app.node('browser-guide-close').click();
  assert.equal(app.document.activeElement.id, 'browser-notice');
  assert.deepEqual(app.navigations, []);
}
{
  const app = entrance({ wechat: true }); app.appended[1].onerror();
  assert.equal(app.state(), 'failed', 'A failed module request needs a readable recovery state');
  assert.equal(app.node('entry-screen').hidden, false);
  assert.equal(app.node('entry-retry').hidden, false);
  assert.equal(app.node('entry-loading').hidden, true, 'A known failure must not leave a perpetual loading status');
  assert.equal(app.node('entry-read').hidden, false, 'Recovery offers a usable reading action');
  app.node('entry-read').click();
  assert.equal(app.node('entry-details').hidden, false);
  assert.equal(app.node('browser-notice').hidden, true, 'Failure screens also hide the covered persistent CTA');
  app.advance(10000);
  assert.equal(app.state(), 'failed', 'A network failure must not be softened into a slow load');
  app.appended[0].onload(); app.ready();
  assert.equal(app.state(), 'failed', 'An unrelated ready signal must not hide a failed application module');
  assert.equal(app.node('entry-screen').hidden, false);
  assert.equal(app.node('entry-details').hidden, false, 'The recovery summary remains readable after unrelated readiness');
  assert.equal(app.lake.inert, true);
}
{
  const app = entrance({ mutation: false });
  assert.equal(app.appended.length, 0, 'Legacy browsers missing required DOM observation must keep the readable entrance');
  assert.equal(app.state(), 'unsupported');
}
for (const clipboard of ['reject', 'missing']) {
  const app = entrance({ wechat: true, clipboard });
  app.node('browser-copy').click();
  await Promise.resolve(); await Promise.resolve();
  assert.equal(app.document.activeElement.id, 'browser-link');
  assert.equal(app.node('browser-link').selected, true, 'Select the actual URL when automatic copying is unavailable');
  assert.equal(app.node('browser-link').value, 'https://miaaavvv.github.io/miao_index/?source=hr');
  assert.match(app.node('browser-copy-status').textContent, /长按/);
}
for (const expected of [
  { browser: 'zh-TW', locale: 'zh-Hant', title: /使用 Chrome 或 Safari 開啟/, read: /先讀專案摘要/, guide: /換一個視窗/, copy: /長按連結複製/ },
  { browser: 'en-GB', locale: 'en', title: /Open in Chrome or Safari/, read: /Read project summaries/, guide: /A new window/, copy: /Press and hold/ },
]) {
  const app = entrance({ browserLanguage: expected.browser, wechat: true, webgl2: false, clipboard: 'missing' });
  assert.equal(app.appended.length, 0, `${expected.locale}: no unsupported heavyweight fetch`);
  assert.equal(app.state(), 'unsupported');
  assert.equal(app.node('entry-screen').getAttribute('lang'), expected.locale);
  assert.equal(app.node('browser-guide').getAttribute('lang'), expected.locale);
  assert.match(app.node('entry-headline').textContent, expected.title);
  assert.match(app.node('entry-read').textContent, expected.read);
  app.node('entry-browser').click();
  assert.match(app.node('browser-guide-title').textContent, expected.guide);
  app.node('browser-copy').click();
  assert.match(app.node('browser-copy-status').textContent, expected.copy);
  assert.deepEqual(app.navigations, []);
}
console.log('Verified minimal three-language welcome and experience ticker, disabled loading status, capability guards, readiness races, recovery reading, WeChat guidance and clipboard fallbacks.');
