import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

// Exercise the shipped readiness decision, with only the GPU boundary stubbed.
// A late or broken detailed material must never destroy a working water preview.
const source = await readFile(new URL('../_v/src/alt-main.e37b8660abd26238.js', import.meta.url), 'utf8');
const subclass = source.indexOf('var ln=class extends hi{');
assert(subclass >= 0, 'Locate the detailed lake renderer');
function rendererMethod(name, inline = false) {
  const header = name === 'constructor' ? 'constructor(e,t){\n' : `${name}(){${inline ? '' : '\n'}`;
  const start = source.indexOf(header, subclass);
  assert(start >= 0, `Locate the actual ${name} method`);
  const end = inline ? source.indexOf('\n', start) : source.indexOf('\n}', start) + 2;
  assert(end > start, `Find the complete ${name} method boundary`);
  return source.slice(start, end);
}
const method = rendererMethod('finishProgramCompilation');

function lake({ baseReady = true, bedReady = true, worldReady = true, parallel = true } = {}) {
  const deleted = [], detached = [], shaderDeletes = [], quality = [], warnings = [], stops = [], events = [];
  class Base { finishProgramCompilation() { return this.baseReady; } }
  const Renderer = vm.runInNewContext(`(class extends Base { ${method} })`, {
    Base,
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options?.detail; } },
    sn: (gl, program) => gl.deleteProgram(program),
    console: { warn: (...args) => warnings.push(args) },
    document: { documentElement: { setAttribute: (name, value) => quality.push([name, value]) } },
  }, { filename: 'progressive-lake-method.js', timeout: 1000 });
  const program = name => ({ name, complete: true, linked: true, shaders: [`${name}-vertex`, `${name}-fragment`] });
  const base = { water: program('preview-water'), composite: program('preview-composite'), simulation: program('simulation') };
  const physical = { water: program('detailed-water'), composite: program('detailed-composite') };
  const renderer = Object.assign(new Renderer(), {
    baseReady, lakeBedReady: bedReady, worldRenderer: { ready: worldReady },
    enhancementStarted: true, physicalInstalled: false, physicalDisabled: false,
    stop: () => stops.push(true),
    canvas: { dispatchEvent: event => events.push(event) },
    programs: { ...base }, physicalPrograms: physical,
    parallelCompile: parallel ? { COMPLETION_STATUS_KHR: 'complete' } : null,
    gl: {
      LINK_STATUS: 'linked',
      getProgramParameter: (value, parameter) => value[parameter],
      getProgramInfoLog: value => `Could not link ${value.name}`,
      getAttachedShaders: value => value.shaders,
      detachShader: (value, shader) => detached.push([value, shader]),
      deleteShader: shader => shaderDeletes.push(shader),
      deleteProgram: value => deleted.push(value),
    },
  });
  function keepsPreview() {
    assert.deepEqual(renderer.programs, base, 'Keep every working preview program until the replacement is entirely ready');
    assert.deepEqual(deleted, [], 'No preview program may be deleted early');
    assert.deepEqual(detached, [], 'Do not install a partial detailed program set');
    assert.deepEqual(quality, []);
    assert.equal(renderer.physicalInstalled, false);
  }
  return { renderer, base, physical, deleted, detached, shaderDeletes, quality, warnings, stops, events, keepsPreview };
}

// Run the real constructor and delayed-init methods against a deterministic
// browser scheduling boundary. GPU allocations and network starts are observed.
function deferredLake({ idleSupport = true } = {}) {
  const allocations = [], frames = new Map(), idles = new Map(), timers = new Map(), observers = [];
  let taskId = 0, contextLost = false, basePrograms = 0, baseSimulation = 0;
  function target() {
    const listeners = new Map();
    return {
      addEventListener(type, callback, options) {
        const list = listeners.get(type) ?? []; list.push({ callback, once: options?.once }); listeners.set(type, list);
      },
      removeEventListener(type, callback) { listeners.set(type, (listeners.get(type) ?? []).filter(item => item.callback !== callback)); },
      dispatchEvent(event) {
        for (const item of [...listeners.get(event.type) ?? []]) {
          item.callback(event);
          if (item.once) this.removeEventListener(event.type, item.callback);
        }
      },
      fire(type) { this.dispatchEvent({ type }); },
    };
  }
  function mutation(element, name) {
    for (const observer of observers) if (observer.active && observer.targets.some(record => record.element === element && record.options.attributeFilter.includes(name))) observer.callback();
  }
  const entry = { hidden: false }, rootAttributes = new Map();
  const root = {
    getAttribute: name => rootAttributes.get(name) ?? null,
    setAttribute(name, value) { rootAttributes.set(name, value); mutation(root, name); },
  };
  const document = Object.assign(target(), { hidden: false, documentElement: root, getElementById: id => id === 'entry-screen' ? entry : null });
  const window = target(), canvas = target();
  const gl = { isContextLost: () => contextLost, deleteTexture() {} };
  class Base {
    constructor(element) {
      Object.assign(this, { canvas: element, gl, celestial: { hour: 12 }, floatTargets: true, hasPresented: false });
      this.createPrograms(); this.createSimulation();
    }
    createPrograms() { basePrograms++; this.programs = { water: 'preview-water', composite: 'preview-composite' }; }
    createSimulation() { baseSimulation++; }
    setTimeHours(hour) { this.environmentHour = hour; }
    loadEnvironment() {}
    loadLakeBedTexture() { allocations.push('bed-request'); }
    bindTideInteractions() { allocations.push('tide-interactions'); }
    isWaterAt() { return true; }
  }
  const allocation = name => class { constructor() { allocations.push(name); } };
  const context = {
    Base, document, window,
    MutationObserver: class {
      constructor(callback) { this.callback = callback; this.targets = []; this.active = true; observers.push(this); }
      observe(element, options) { this.targets.push({ element, options }); }
      disconnect() { this.active = false; }
    },
    m0: () => ({ environment: 'mountains', breeze: 0 }), Va: value => value, ga: () => 0,
    Ta: () => { allocations.push('detailed-program'); return {}; }, Eo: () => '', $a: () => '', Y: () => false, ko: '',
    Fo: allocation('fft'), _o: allocation('spray'), zo: allocation('environment-clock'), Qo: allocation('landscape'), nn: allocation('stars'),
    kt: () => { allocations.push('placeholder-texture'); return {}; },
    d0: () => { allocations.push('texture-request'); return new Promise(() => {}); },
    u0: { moon: 'moon', milkyWay: 'milky-way' }, performance: { now: () => 0 }, console: { warn() {} },
    requestAnimationFrame(callback) { const id = ++taskId; frames.set(id, callback); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
    setTimeout(callback, delay) { const id = ++taskId; timers.set(id, { callback, delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
  };
  if (idleSupport) {
    context.requestIdleCallback = callback => { const id = ++taskId; idles.set(id, callback); return id; };
    context.cancelIdleCallback = id => idles.delete(id);
  }
  const methods = ['constructor', 'createPrograms', 'createSimulation', 'canStartEnhancement', 'scheduleEnhancement', 'cancelEnhancementSchedule', 'stopEnhancementWatch', 'initEnhancement']
    .map(name => rendererMethod(name, name === 'createPrograms' || name === 'createSimulation')).join('\n');
  const Renderer = vm.runInNewContext(`(class extends Base { ${methods} })`, context, { filename: 'delayed-lake-methods.js', timeout: 1000 });
  const renderer = new Renderer(canvas, {});
  const flush = queue => { const batch = [...queue.values()]; queue.clear(); for (const callback of batch) callback(); };
  return {
    renderer, allocations, frames, idles, timers, entry, root, document, window, canvas,
    baseSetup: () => [basePrograms, baseSimulation],
    observesEntry: () => observers.some(observer => observer.targets.some(record => record.element === entry)),
    frame: () => flush(frames), idle: () => flush(idles),
    timer() { const batch = [...timers.values()]; timers.clear(); for (const item of batch) item.callback(); },
    hideEntry() { entry.hidden = true; mutation(entry, 'hidden'); },
    visible(value) { document.hidden = !value; document.fire('visibilitychange'); },
    contextLost(value) { contextLost = value; },
    ready() { renderer.hasPresented = true; canvas.fire('waterready'); root.setAttribute('data-miao-ui-ready', 'true'); },
  };
}

// Presentation readiness belongs to the completed draw, rather than shader
// installation or the earlier preview frame. Run the real post-processing hook
// and readiness method with GPU calls recording their completion order.
function presentedLake({ installed = false, disabled = false, running = true } = {}) {
  const attributes = new Map(), events = [], frames = [], trace = [], upgrades = [], bedUpgrades = [];
  let contextLost = false;
  const start = source.indexOf('renderPostProcessing(e){', subclass);
  const classEnd = source.indexOf('function cn(', start);
  assert(start >= 0 && classEnd > start, 'Locate the shipped post-processing method');
  const tail = source.slice(start, classEnd).trimEnd();
  assert(tail.endsWith('}};'), 'Locate the post-processing and renderer class boundaries');
  const postProcessing = tail.slice(0, -2);
  class Base { renderPostProcessing() { trace.push('base-complete'); } }
  const gl = {
    isContextLost: () => contextLost,
    useProgram() {}, bindVertexArray() {}, bindFramebuffer() {}, viewport() {},
    activeTexture() {}, bindTexture() {}, uniform1i() {}, uniform2f() {}, uniform1f() {},
    getUniformLocation: (program, name) => name,
    drawArrays() { trace.push('composite-draw'); },
    blitFramebuffer() { trace.push('present-blit'); },
    flush() { trace.push('gpu-flush'); },
  };
  const Renderer = vm.runInNewContext(`(class extends Base { ${rendererMethod('markPresented')} ${postProcessing} })`, {
    Base,
    va: () => ({ night: 0 }),
    document: {
      documentElement: { setAttribute(name, value) { attributes.set(name, value); trace.push(`attribute:${name}`); } },
      dispatchEvent(event) { events.push(event); trace.push(`event:${event.type}`); },
    },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options?.detail; } },
    requestAnimationFrame: callback => { frames.push(callback); return frames.length; },
  }, { filename: 'presented-lake-methods.js', timeout: 1000 });
  const renderer = Object.assign(new Renderer(), {
    running, gl, physicalInstalled: installed, physicalDisabled: disabled,
    programs: { composite: {} }, screenVao: {},
    canvas: { width: 800, height: 600 }, sceneTarget: { texture: {}, width: 400, height: 300 },
    presentTarget: { framebuffer: {}, width: 800, height: 600 }, isAndroid: true,
    altSettings: { exposure: 100 }, celestial: {}, activeEnvironment: 'mountains',
    worldRenderer: { bindDetail() {}, upgradeClouds() { upgrades.push(true); } },
    upgradeLakeBed() { bedUpgrades.push(true); },
    setCameraUniforms() {},
  });
  return {
    renderer, attributes, events, frames, trace, upgrades, bedUpgrades,
    contextLost(value) { contextLost = value; },
    frame() { const batch = frames.splice(0); for (const callback of batch) callback(); },
  };
}

{
  const app = presentedLake();
  app.renderer.renderPostProcessing(0);
  assert.deepEqual(app.trace, ['base-complete']);
  assert.equal(app.attributes.has('data-lake-presented'), false, 'An ordinary preview is not the final scene');
  assert.equal(app.events.length, 0, 'Do not dismiss the entrance for the early preview');
  assert.equal(app.frames.length, 0);
  assert.equal(app.bedUpgrades.length, 0);
}
{
  const app = presentedLake({ installed: true });
  app.renderer.renderPostProcessing(0);
  assert.equal(app.attributes.get('data-lake-presented'), 'full');
  assert.equal(app.events.length, 1);
  assert.equal(app.events[0].type, 'miao:lakeready');
  assert.equal(app.events[0].detail.quality, 'full');
  assert(app.trace.indexOf('attribute:data-lake-presented') > app.trace.indexOf('gpu-flush'), 'Mark readiness after the composite, presentation blit and flush complete');
  assert(app.trace.indexOf('event:miao:lakeready') > app.trace.indexOf('attribute:data-lake-presented'));
  assert.equal(app.upgrades.length, 0, 'Do not start high-resolution clouds inside the first complete draw');
  assert.equal(app.bedUpgrades.length, 0, 'Do not start high-resolution lake-bed textures inside the first complete draw');
  assert.equal(app.frames.length, 1, 'Queue both resource upgrades after the first complete scene');
  app.renderer.renderPostProcessing(1);
  assert.equal(app.events.length, 1, 'A second complete frame must not repeat readiness');
  assert.equal(app.frames.length, 1, 'Do not queue the cloud upgrade twice');
  app.frame();
  assert.equal(app.upgrades.length, 1);
  assert.equal(app.bedUpgrades.length, 1);
  app.renderer.markPresented(); app.frame();
  assert.equal(app.upgrades.length, 1);
  assert.equal(app.bedUpgrades.length, 1, 'The lake-bed upgrade also starts at most once');
  app.renderer.physicalInstalled = false; app.renderer.physicalDisabled = true;
  app.renderer.renderPostProcessing(2);
  assert.equal(app.attributes.get('data-lake-presented'), 'full', 'A full presentation marker never regresses to fallback');
  assert.equal(app.events.length, 1);
}
{
  const app = presentedLake({ disabled: true });
  app.renderer.renderPostProcessing(0);
  assert.deepEqual(app.trace.slice(0, 2), ['base-complete', 'attribute:data-lake-presented']);
  assert.equal(app.attributes.get('data-lake-presented'), 'fallback', 'An exhausted upgrade can release the usable fallback after it draws');
  assert.equal(app.events[0].detail.quality, 'fallback');
  app.renderer.renderPostProcessing(1);
  assert.equal(app.events.length, 1, 'The fallback notification is also emitted only once');
  assert.equal(app.frames.length, 0, 'A fallback must not trigger detailed cloud downloads');
  assert.equal(app.bedUpgrades.length, 0, 'A fallback must not trigger detailed lake-bed downloads');
  app.renderer.physicalDisabled = false; app.renderer.physicalInstalled = true;
  app.renderer.renderPostProcessing(2);
  assert.equal(app.attributes.get('data-lake-presented'), 'full', 'A later genuine full draw can supersede fallback');
  assert.equal(app.events.length, 2);
  assert.equal(app.events[1].detail.quality, 'full');
}
for (const installed of [true, false]) for (const blocked of ['stopped', 'context-lost']) {
  const app = presentedLake({ installed, disabled: !installed, running: blocked !== 'stopped' });
  if (blocked === 'context-lost') app.contextLost(true);
  app.renderer.renderPostProcessing(0);
  assert.equal(app.attributes.has('data-lake-presented'), false, 'An invalid renderer cannot announce presentation');
  assert.equal(app.events.length, 0);
  assert.equal(app.frames.length, 0);
  assert.equal(app.bedUpgrades.length, 0);
}
for (const interruption of ['stopped', 'context-lost']) {
  const app = presentedLake({ installed: true });
  app.renderer.renderPostProcessing(0);
  if (interruption === 'stopped') app.renderer.running = false; else app.contextLost(true);
  app.frame();
  assert.equal(app.upgrades.length, 0, 'Recheck rendering and context before starting the deferred cloud upgrade');
  assert.equal(app.bedUpgrades.length, 0, 'Recheck rendering and context before starting the deferred lake-bed upgrade');
}

{
  const app = deferredLake();
  assert.deepEqual(app.baseSetup(), [1, 1], 'The constructor still prepares the lightweight water');
  assert.deepEqual(app.allocations, [], 'Do not create detailed shaders, FFT, landscape or textures during construction');
  assert.equal(app.observesEntry(), false, 'Enhancement readiness must not depend on entrance visibility');
  app.renderer.initEnhancement(); app.renderer.scheduleEnhancement();
  assert.equal(app.frames.size, 0, 'First-frame readiness is required before scheduling enhancement');
  app.renderer.hasPresented = true; app.canvas.fire('waterready');
  assert.equal(app.frames.size, 0, 'The first frame alone does not make the interface ready');
  app.root.setAttribute('data-miao-ui-ready', 'true');
  assert.equal(app.entry.hidden, false, 'Keep the entrance visible while the final scene prepares');
  assert.equal(app.frames.size, 1, 'Prepare the detailed scene underneath the visible entrance');
  app.renderer.scheduleEnhancement();
  assert.equal(app.frames.size, 1, 'Duplicate readiness notifications schedule only once');
  app.frame();
  assert.equal(app.frames.size, 1); assert.equal(app.idles.size, 0); assert.deepEqual(app.allocations, []);
  app.frame();
  assert.equal(app.frames.size, 0); assert.equal(app.idles.size, 1); assert.deepEqual(app.allocations, []);
  app.idle();
  assert.equal(app.renderer.enhancementStarted, true);
  assert.equal(app.entry.hidden, false, 'Starting the enhancement must not dismiss the entrance');
  assert.equal(app.allocations.filter(name => name === 'detailed-program').length, 2);
  for (const name of ['fft', 'spray', 'landscape', 'stars', 'bed-request']) assert.equal(app.allocations.filter(value => value === name).length, 1);
  const allocations = app.allocations.length;
  app.renderer.scheduleEnhancement(); app.renderer.initEnhancement(); app.window.fire('pageshow');
  app.frame(); app.idle();
  assert.equal(app.allocations.length, allocations, 'Enhancement initialization runs at most once');
}
for (const interruption of ['second-paint', 'idle']) {
  const app = deferredLake(); app.ready(); app.frame();
  if (interruption === 'idle') app.frame();
  app.visible(false);
  if (interruption === 'second-paint') app.frame(); else app.idle();
  assert.deepEqual(app.allocations, [], 'A hidden page must not begin the expensive upgrade');
  app.visible(true); app.frame(); app.frame(); app.idle();
  assert.equal(app.renderer.enhancementStarted, true, 'Returning to the visible page resumes the deferred upgrade');
}
{
  const app = deferredLake(); app.ready(); app.frame(); app.frame();
  assert.equal(app.idles.size, 1);
  app.contextLost(true); app.canvas.fire('webglcontextlost');
  assert.equal(app.idles.size, 0, 'Context loss cancels queued enhancement work');
  app.contextLost(false); app.visible(true); app.window.fire('pageshow'); app.renderer.scheduleEnhancement();
  app.frame(); app.idle();
  assert.deepEqual(app.allocations, [], 'Do not restart enhancement after the renderer has handed off to context-loss recovery');
}
{
  const app = deferredLake(); app.contextLost(true); app.ready();
  assert.equal(app.frames.size, 0, 'An already-lost GPU context cannot schedule initialization');
  app.contextLost(false); app.window.fire('pageshow'); app.frame(); app.frame(); app.idle();
  assert.equal(app.renderer.enhancementStarted, true);
}
{
  const app = deferredLake({ idleSupport: false }); app.ready(); app.frame(); app.frame();
  assert.equal(app.timers.size, 1, 'Browsers without idle callbacks use a bounded timer');
  assert.equal([...app.timers.values()][0].delay, 80);
  assert.deepEqual(app.allocations, []);
  app.visible(false); app.timer();
  assert.deepEqual(app.allocations, []);
  app.visible(true); app.frame(); app.frame(); app.timer();
  assert.equal(app.renderer.enhancementStarted, true);
}

{
  const app = lake({ baseReady: false });
  assert.equal(app.renderer.finishProgramCompilation(), false, 'Do not render before the base programs compile');
  app.keepsPreview();
}
for (const pending of [{ bedReady: false }, { worldReady: false }, { bedReady: false, worldReady: false }]) {
  const app = lake(pending);
  assert.equal(app.renderer.finishProgramCompilation(), true, 'A pending texture or landscape must not block the water preview');
  app.keepsPreview();
}
{
  const app = lake();
  app.physical.composite.complete = false;
  assert.equal(app.renderer.finishProgramCompilation(), true, 'Keep rendering while a detailed shader compiles');
  app.keepsPreview();
  app.physical.composite.complete = true;
  assert.equal(app.renderer.finishProgramCompilation(), true);
  assert.equal(app.renderer.physicalInstalled, true);
  assert.equal(app.renderer.programs.water, app.physical.water);
  assert.equal(app.renderer.programs.composite, app.physical.composite);
  assert.equal(app.renderer.programs.simulation, app.base.simulation, 'Retain the unrelated simulation program');
  assert.deepEqual(app.deleted, [app.base.water, app.base.composite]);
  assert.equal(app.detached.length, 4);
  assert.equal(app.shaderDeletes.length, 4);
  assert.deepEqual(app.quality, [['data-lake-quality', 'full']]);
  assert.equal(app.renderer.finishProgramCompilation(), true);
  assert.equal(app.deleted.length, 2, 'A completed installation must not delete its programs again');
  app.renderer.worldRenderer.ready = false;
  assert.equal(app.renderer.finishProgramCompilation(), false, 'After installation, retain the detailed renderer’s resource gate');
  app.renderer.worldRenderer.ready = true; app.renderer.lakeBedReady = false;
  assert.equal(app.renderer.finishProgramCompilation(), false);
  app.renderer.lakeBedReady = true;
  assert.equal(app.renderer.finishProgramCompilation(), true);
}
for (const parallel of [true, false]) for (const failed of ['water', 'composite']) {
  const app = lake({ parallel });
  app.physical[failed].linked = false;
  assert.equal(app.renderer.finishProgramCompilation(), true, 'A failed detailed shader must leave the preview renderable');
  assert.equal(app.renderer.physicalDisabled, true);
  app.keepsPreview();
  app.physical[failed].linked = true;
  assert.equal(app.renderer.finishProgramCompilation(), true);
  app.keepsPreview();
}
{
  const app = lake({ bedReady: false });
  app.renderer.worldRenderer.error = new Error('Landscape request failed');
  assert.equal(app.renderer.finishProgramCompilation(), true);
  assert.equal(app.renderer.physicalDisabled, true);
  app.keepsPreview();
  assert.equal(app.stops.length, 0, 'A failed upgrade must not stop the working preview');
  assert.equal(app.events.length, 0);
}
{
  const app = lake();
  assert.equal(app.renderer.finishProgramCompilation(), true);
  assert.equal(app.renderer.physicalInstalled, true);
  const error = new Error('Installed landscape became unavailable');
  app.renderer.worldRenderer.error = error;
  assert.equal(app.renderer.finishProgramCompilation(), false, 'An installed detailed renderer cannot keep rendering invalid landscape resources');
  assert.equal(app.renderer.programCompilationFailed, true);
  assert.equal(app.stops.length, 1);
  assert.equal(app.events.length, 1);
  assert.equal(app.events[0].type, 'waterfatal');
  assert.equal(app.events[0].detail, error, 'Propagate the original failure to the entrance recovery handler');
  assert.equal(app.deleted.length, 2, 'A later failure must not delete any installed programs');
}
{
  const app = lake({ bedReady: false });
  // The bed loader sets this flag after exhausting its retries.
  app.renderer.physicalDisabled = true;
  assert.equal(app.renderer.finishProgramCompilation(), true);
  app.keepsPreview();
  app.renderer.lakeBedReady = true;
  assert.equal(app.renderer.finishProgramCompilation(), true, 'A disabled upgrade stays on the usable preview');
  app.keepsPreview();
}
{
  const app = lake({ parallel: false });
  assert.equal(app.renderer.finishProgramCompilation(), true, 'Browsers without parallel shader compilation can still upgrade');
  assert.equal(app.renderer.physicalInstalled, true);
}
console.log('Verified enhancement prepares beneath the entrance after two paints and idle time, swaps ready programs atomically, announces only completed full/fallback draws, and defers cloud and lake-bed upgrades once.');
