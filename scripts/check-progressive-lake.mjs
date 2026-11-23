import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

// Exercise the shipped readiness decision, with only the GPU boundary stubbed.
// A late or broken detailed material must never destroy a working water preview.
const source = await readFile(new URL('../_v/src/alt-main.e37b8660abd26238.js', import.meta.url), 'utf8');
const subclass = source.indexOf('var ln=class extends hi{');
assert(subclass >= 0, 'Locate the detailed lake renderer');
const start = source.indexOf('finishProgramCompilation(){\n', subclass);
assert(start >= 0, 'Locate the readable progressive compilation method');
const end = source.indexOf('\n}', start);
assert(end > start, 'Find the complete method boundary');
const method = source.slice(start, end + 2);

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
    physicalInstalled: false, physicalDisabled: false,
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
console.log('Verified progressive water survives pending or failed resources and only replaces preview programs after every detailed shader is ready.');
