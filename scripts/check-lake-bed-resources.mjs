import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../_v/src/alt-main.e37b8660abd26238.js', import.meta.url), 'utf8');
const subclass = source.indexOf('var ln=class extends hi{');
function method(name) {
  const start = source.indexOf(`${name}(){\n`, subclass);
  const end = source.indexOf('\n}', start) + 2;
  assert(start >= subclass && end > start, `Locate the shipped ${name} method`);
  return source.slice(start, end);
}
const methods = ['loadLakeBedTexture', 'upgradeLakeBed'].map(method).join('\n');
const settle = () => new Promise(resolve => setImmediate(resolve));

function lake({ mobile = false, vast = false } = {}) {
  const requests = [], deleted = [], timers = [], warnings = [];
  let lost = false;
  const names = ['albedo', 'geometry', 'sand', 'sandGeometry', 'salt', 'saltGeometry'];
  const u0 = Object.fromEntries(names.flatMap(name => [[name, name], [`${name}Mobile`, `${name}Mobile`]]));
  const Renderer = vm.runInNewContext(`(class { ${methods} })`, {
    Y: () => vast,
    u0,
    d0(gl, url, options) {
      return new Promise((resolve, reject) => requests.push({ url, priority: options.priority, resolve, reject }));
    },
    setTimeout(callback, delay) { timers.push({ callback, delay }); },
    console: { warn: (...args) => warnings.push(args) },
  }, { filename: 'lake-bed-methods.js', timeout: 1000 });
  const placeholders = [{ id: 'placeholder-color' }, { id: 'placeholder-geometry' }];
  const renderer = Object.assign(new Renderer(), {
    gl: { isContextLost: () => lost, deleteTexture: texture => deleted.push(texture) },
    running: true, isMobile: mobile, physicalInstalled: false, physicalDisabled: false,
    altSettings: { environment: 'mountains' }, environmentReady: true,
    bedCache: new Map(), bedRequest: 0, lakeBedReady: false,
    lakeBedTexture: placeholders[0], bedGeometryTexture: placeholders[1],
    loadEnvironment() { this.environmentReady = true; },
  });
  const activePair = () => [renderer.lakeBedTexture, renderer.bedGeometryTexture];
  const pair = label => [{ id: `${label}-color` }, { id: `${label}-geometry` }];
  async function resolvePair(offset, values = pair(`pair-${offset}`)) {
    requests[offset].resolve(values[0]); requests[offset + 1].resolve(values[1]); await settle(); return values;
  }
  async function initial() { renderer.loadLakeBedTexture(); return resolvePair(0, pair('mobile')); }
  function full() { renderer.physicalInstalled = true; renderer.presentedQuality = 'full'; }
  return {
    renderer, requests, deleted, timers, warnings, placeholders, activePair, pair, resolvePair, initial, full,
    lost(value) { lost = value; },
    timer() { const batch = timers.splice(0); for (const item of batch) item.callback(); },
  };
}

for (const [environment, vast, expected, material] of [
  ['mountains', false, ['albedoMobile', 'geometryMobile'], 'stone'],
  ['lakeside', false, ['albedoMobile', 'geometryMobile'], 'stone'],
  ['clouds', false, ['sandMobile', 'sandGeometryMobile'], 'sand'],
  ['clouds', true, ['saltMobile', 'saltGeometryMobile'], 'salt'],
]) {
  const app = lake({ vast }); app.renderer.altSettings.environment = environment;
  app.renderer.loadLakeBedTexture();
  assert.deepEqual(app.requests.map(request => request.url), expected, 'The first complete scene uses existing smaller assets on desktop');
  assert(app.requests.every(request => request.priority === 'high'));
  assert(app.renderer.bedCache.has(`${material}:Mobile`), 'Cache keys include material and asset resolution');
}
{
  const app = lake(); app.renderer.loadLakeBedTexture();
  const smaller = app.pair('smaller');
  app.requests[0].resolve(smaller[0]); await settle();
  assert.deepEqual(app.activePair(), app.placeholders, 'One loaded texture must not partially replace the active pair');
  assert.equal(app.renderer.lakeBedReady, false);
  app.requests[1].resolve(smaller[1]); await settle();
  assert.deepEqual(app.activePair(), smaller);
  assert.deepEqual(app.deleted, app.placeholders, 'Release only the original renderer-owned placeholders');
  assert.equal(app.requests.length, 2, 'Do not download desktop detail before a full scene is presented');
  app.full();
  const upgrade = app.renderer.upgradeLakeBed();
  assert.equal(app.renderer.upgradeLakeBed(), upgrade, 'Deduplicate an in-flight upgrade');
  assert.deepEqual(app.requests.slice(2).map(request => request.url), ['albedo', 'geometry']);
  assert(app.requests.slice(2).every(request => request.priority === 'low'));
  const detailed = app.pair('detailed');
  app.requests[2].resolve(detailed[0]); await settle();
  assert.deepEqual(app.activePair(), smaller, 'Retain both smaller textures while only half of the upgrade is ready');
  app.requests[3].resolve(detailed[1]); await upgrade;
  assert.deepEqual(app.activePair(), detailed);
  assert.deepEqual(app.deleted, app.placeholders, 'The smaller pair belongs to the cache and must remain alive');
  assert(app.renderer.bedCache.has('stone:Mobile') && app.renderer.bedCache.has('stone:Desktop'));
  app.renderer.loadLakeBedTexture(); await settle();
  assert.deepEqual(app.activePair(), detailed, 'Reloading the same material must not downgrade an installed desktop pair');
  assert.equal(app.requests.length, 4);
}
for (const gate of ['mobile', 'not-installed', 'not-presented', 'stopped', 'lost']) {
  const app = lake({ mobile: gate === 'mobile' }); await app.initial(); app.full();
  if (gate === 'not-installed') app.renderer.physicalInstalled = false;
  if (gate === 'not-presented') app.renderer.presentedQuality = undefined;
  if (gate === 'stopped') app.renderer.running = false;
  if (gate === 'lost') app.lost(true);
  app.renderer.upgradeLakeBed();
  assert.equal(app.requests.length, 2, `Do not start desktop downloads when ${gate}`);
}
{
  const app = lake(); app.renderer.loadLakeBedTexture();
  app.renderer.altSettings.environment = 'clouds'; app.renderer.loadLakeBedTexture();
  const stale = await app.resolvePair(0, app.pair('stale-stone'));
  assert.deepEqual(app.activePair(), app.placeholders, 'An old environment completion cannot replace the current request');
  const current = await app.resolvePair(2, app.pair('sand'));
  assert.deepEqual(app.activePair(), current);
  app.renderer.altSettings.environment = 'mountains'; app.renderer.loadLakeBedTexture(); await settle();
  assert.deepEqual(app.activePair(), stale, 'A cancelled completion remains reusable through the cache');
  assert.equal(app.requests.length, 4, 'Switching back must reuse both cached textures');
  assert.deepEqual(app.deleted, app.placeholders, 'Never delete successful cached pairs during environment changes');
}
{
  const app = lake(); const smaller = await app.initial(); app.full();
  const pending = app.renderer.upgradeLakeBed();
  app.renderer.altSettings.environment = 'clouds'; app.renderer.loadLakeBedTexture();
  const detailed = await app.resolvePair(2, app.pair('stale-desktop')); await pending;
  assert.deepEqual(app.activePair(), smaller, 'An environment switch also invalidates an old desktop upgrade');
  const sand = await app.resolvePair(4, app.pair('sand-mobile'));
  assert.deepEqual(app.activePair(), sand);
  assert.deepEqual(app.requests.slice(6).map(request => request.url), ['sand', 'sandGeometry'], 'After the first full presentation, a new material can upgrade too');
  app.renderer.altSettings.environment = 'mountains'; app.renderer.loadLakeBedTexture(); await settle();
  assert.deepEqual(app.activePair(), detailed, 'Switching back reuses the cached high-resolution pair without deleting it');
  assert.deepEqual(app.deleted, app.placeholders);
}
for (const earlyFailure of [false, true]) {
  const app = lake(); const smaller = await app.initial(); app.full();
  const pending = app.renderer.upgradeLakeBed(), orphan = { id: 'uncommitted-color' };
  if (earlyFailure) {
    app.requests[3].reject(new Error('Geometry failed first')); await settle();
    app.requests[2].resolve(orphan);
  } else {
    app.requests[2].resolve(orphan); await settle();
    app.requests[3].reject(new Error('Geometry failed after color'));
  }
  await pending; await settle();
  assert.deepEqual(app.activePair(), smaller, 'A failed upgrade must retain the complete initial pair');
  assert(app.deleted.includes(orphan), 'Clean up a failed pair even when its other texture resolves later');
  assert(!app.deleted.includes(smaller[0]) && !app.deleted.includes(smaller[1]));
  assert.equal(app.renderer.bedCache.has('stone:Desktop'), false, 'Failed cache entries must not poison later requests');
  assert.equal(app.renderer.physicalDisabled, false);
  assert.equal(app.timers.length, 0, 'An optional upgrade failure does not retry or disable the usable renderer');
}
{
  const app = lake(); const smaller = await app.initial();
  app.renderer.altSettings.environment = 'clouds'; app.renderer.loadLakeBedTexture();
  app.requests[2].reject(new Error('New environment failed')); app.requests[3].reject(new Error('New geometry failed')); await settle();
  assert.deepEqual(app.activePair(), smaller, 'Keep an older valid pair if a new material cannot load');
  assert.equal(app.renderer.physicalDisabled, false);
  assert.equal(app.timers.length, 0);
  assert.deepEqual(app.deleted, app.placeholders);
}
{
  const app = lake(); app.renderer.loadLakeBedTexture();
  for (let attempt = 0; attempt < 3; attempt++) {
    app.requests[attempt * 2].reject(new Error('Initial color unavailable'));
    app.requests[attempt * 2 + 1].reject(new Error('Initial geometry unavailable')); await settle();
    assert.equal(app.renderer.bedLoadFailures, attempt + 1);
    if (attempt < 2) {
      assert.equal(app.renderer.physicalDisabled, false);
      assert.equal(app.timers[0].delay, 500 * (attempt + 1));
      app.timer();
    }
  }
  assert.equal(app.renderer.physicalDisabled, true, 'Disable detailed enhancement after three initial failures without any valid bed');
  assert.equal(app.renderer.lakeBedReady, false);
  assert.equal(app.timers.length, 0);
  assert.deepEqual(app.activePair(), app.placeholders);
  assert.deepEqual(app.deleted, []);
}
{
  const app = lake(); app.renderer.loadLakeBedTexture();
  app.requests[0].reject(new Error('Initial request failed')); app.requests[1].reject(new Error('Initial request failed')); await settle();
  app.renderer.altSettings.environment = 'clouds'; app.renderer.loadLakeBedTexture(); app.timer();
  assert.equal(app.requests.length, 4, 'An environment change cancels a previously scheduled retry');
  assert.equal(app.renderer.bedLoadFailures, 0, 'Each material starts with its own initial retry budget');
}
{
  const app = lake(); app.renderer.loadLakeBedTexture(); app.lost(true);
  await app.resolvePair(0);
  assert.deepEqual(app.activePair(), app.placeholders, 'A lost GPU context cannot install a late pair');
  assert.equal(app.renderer.lakeBedReady, false);
}

console.log('Verified smaller initial lake-bed pairs, full-frame desktop upgrades, atomic GPU ownership, resolution-aware caching, stale-request isolation and bounded initial retries.');
