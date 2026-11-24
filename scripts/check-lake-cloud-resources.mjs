import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { loadLakeClouds, startupClouds } from '../_v/src/lake-cloud-resources.js';

const root = new URL('../', import.meta.url);
const bytesFor = field => field.size.reduce((total, dimension) => total * dimension, field.channels);
const startupBuffers = new Map();
for (const field of Object.values(startupClouds)) {
  const bytes = await readFile(new URL(field.url.slice(1), root));
  assert.equal(bytes.byteLength, 131072, 'Each real startup field must remain 128 KiB');
  assert.equal(bytes.byteLength, bytesFor(field));
  startupBuffers.set(field.url, bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
}
execFileSync(process.execPath, [fileURLToPath(new URL('generate-lake-startup.mjs', import.meta.url)), '--check'], { stdio: 'pipe' });

function gpu({ failCreate = 0, loseAfterUpload = 0, loseAfterMipmap = 0, failUpload = 0, failMipmap = 0, failParameter = 0, initialErrors = [], persistentError = false } = {}) {
  const calls = { creates: 0, textures: [], uploads: [], deleted: [], parameters: [], mipmaps: [], errorReads: 0 };
  const errors = [...initialErrors];
  const gl = {
    NO_ERROR: 0, INVALID_OPERATION: 0x0502, OUT_OF_MEMORY: 0x0505,
    TEXTURE_3D: 0x806f, RG8: 0x822b, RGBA8: 0x8058, RG: 0x8227, RGBA: 0x1908,
    UNSIGNED_BYTE: 0x1401, TEXTURE_MIN_FILTER: 0x2801, TEXTURE_MAG_FILTER: 0x2800,
    TEXTURE_WRAP_S: 0x2802, TEXTURE_WRAP_T: 0x2803, TEXTURE_WRAP_R: 0x8072,
    LINEAR_MIPMAP_LINEAR: 0x2703, LINEAR: 0x2601, REPEAT: 0x2901, CLAMP_TO_EDGE: 0x812f,
    lost: false, bound: null,
    isContextLost() { return this.lost; },
    getError() {
      if (++calls.errorReads > 64) throw new Error('Unbounded error drain');
      return persistentError ? this.INVALID_OPERATION : errors.shift() ?? this.NO_ERROR;
    },
    createTexture() {
      if (++calls.creates === failCreate) return null;
      const texture = { id: calls.creates };
      calls.textures.push(texture);
      return texture;
    },
    bindTexture(target, texture) { assert.equal(target, this.TEXTURE_3D); this.bound = texture; },
    texImage3D(...args) {
      calls.uploads.push({ texture: this.bound, args });
      if (calls.uploads.length === failUpload) errors.push(this.OUT_OF_MEMORY);
      if (loseAfterUpload && calls.uploads.length >= loseAfterUpload) this.lost = true;
    },
    generateMipmap(target) {
      calls.mipmaps.push({ texture: this.bound, target });
      if (calls.mipmaps.length === failMipmap) errors.push(this.OUT_OF_MEMORY);
      if (loseAfterMipmap && calls.mipmaps.length >= loseAfterMipmap) this.lost = true;
    },
    texParameteri(target, key, value) {
      calls.parameters.push({ texture: this.bound, target, key, value });
      if (this.bound.id === failParameter) errors.push(this.INVALID_OPERATION);
    },
    deleteTexture(texture) { calls.deleted.push(texture); },
  };
  return { gl, calls };
}

async function withFetch(routes, run) {
  const original = globalThis.fetch;
  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    assert(routes.has(url), `Unexpected cloud request: ${url}`);
    const route = routes.get(url);
    if (route instanceof Error) throw route;
    if (typeof route === 'function') return route();
    return { ok: route !== null, arrayBuffer: async () => route };
  };
  try { return await run(requests); }
  finally { globalThis.fetch = original; }
}

function checkUpload({ gl, calls }, result, fields) {
  assert.deepEqual(result, { density: calls.textures[0], volume: calls.textures[1] });
  assert.equal(calls.uploads.length, 2);
  assert.deepEqual(calls.deleted, [], 'A successful pair must remain available to the renderer');
  fields.forEach((field, index) => {
    const { texture, args } = calls.uploads[index];
    assert.equal(texture, result[index === 0 ? 'density' : 'volume']);
    assert.deepEqual(args.slice(0, 9), [gl.TEXTURE_3D, 0, field.channels === 2 ? gl.RG8 : gl.RGBA8,
      ...field.size, 0, field.channels === 2 ? gl.RG : gl.RGBA, gl.UNSIGNED_BYTE]);
    assert(args[9] instanceof Uint8Array, 'Upload the fetched field as bytes');
    assert.equal(args[9].byteLength, bytesFor(field));
    assert(calls.mipmaps.some(call => call.texture === texture && call.target === gl.TEXTURE_3D));
    const parameters = new Map(calls.parameters.filter(call => call.texture === texture).map(call => [call.key, call.value]));
    assert.equal(parameters.get(gl.TEXTURE_MIN_FILTER), gl.LINEAR_MIPMAP_LINEAR);
    assert.equal(parameters.get(gl.TEXTURE_MAG_FILTER), gl.LINEAR);
    assert.equal(parameters.get(gl.TEXTURE_WRAP_S), gl.REPEAT);
    assert.equal(parameters.get(gl.TEXTURE_WRAP_T), gl.REPEAT);
    assert.equal(parameters.get(gl.TEXTURE_WRAP_R), index === 0 ? gl.CLAMP_TO_EDGE : gl.REPEAT);
  });
}

{
  const device = gpu();
  await withFetch(startupBuffers, async requests => {
    const result = await loadLakeClouds(device.gl);
    checkUpload(device, result, Object.values(startupClouds));
    assert.deepEqual(requests.map(({ url, options }) => [url, options.priority]),
      Object.values(startupClouds).map(field => [field.url, 'high']));
  });
}
for (const mobile of [false, true]) {
  const fields = [
    { url: '/detailed-density', size: mobile ? [256, 256, 64] : [480, 480, 80], channels: 2 },
    { url: '/detailed-volume', size: [128, 128, 128], channels: 4 },
  ];
  const device = gpu();
  const routes = new Map(fields.map(field => [field.url, new ArrayBuffer(bytesFor(field))]));
  await withFetch(routes, async requests => {
    const result = await loadLakeClouds(device.gl, { densityUrl: fields[0].url, volumeUrl: fields[1].url, detailed: true, mobile });
    checkUpload(device, result, fields);
    assert.deepEqual(requests.map(({ url, options }) => [url, options.priority]), fields.map(field => [field.url, 'low']));
  });
}

// Validate the entire pair before creating or uploading either replacement.
for (const field of Object.values(startupClouds)) {
  for (const failure of ['network', 'http', 'short', 'long']) {
    const routes = new Map(startupBuffers);
    routes.set(field.url, failure === 'network' ? new Error('Offline') : failure === 'http' ? null
      : new ArrayBuffer(bytesFor(field) + (failure === 'short' ? -1 : 1)));
    const { gl, calls } = gpu();
    await withFetch(routes, async () => assert.rejects(loadLakeClouds(gl), failure === 'network' ? /Offline/ : failure === 'http' ? /unavailable/ : /dimensions/));
    assert.equal(calls.creates, 0, `${field.url}: ${failure} must not allocate a partial replacement`);
    assert.equal(calls.uploads.length, 0);
    assert.equal(calls.deleted.length, 0);
  }
}
{
  const { gl, calls } = gpu({ failCreate: 2 });
  await withFetch(startupBuffers, async () => assert.rejects(loadLakeClouds(gl), /texture unavailable/));
  assert.equal(calls.textures.length, 1);
  assert.equal(calls.uploads.length, 1);
  assert.deepEqual(calls.deleted, calls.textures, 'Failure to create the second texture must release the first');
}
{
  const { gl, calls } = gpu();
  gl.lost = true;
  await withFetch(startupBuffers, async () => assert.rejects(loadLakeClouds(gl), /interrupted/));
  assert.equal(calls.creates, 0, 'A lost context must not start uploading downloaded fields');
  assert.equal(calls.uploads.length, 0);
}
{
  const { gl, calls } = gpu({ loseAfterUpload: 1 });
  await withFetch(startupBuffers, async () => assert.rejects(loadLakeClouds(gl), /interrupted/));
  assert.equal(calls.uploads.length, 1, 'Do not upload the next field after context loss');
  assert.deepEqual(calls.deleted, calls.textures, 'Context loss must release any newly allocated textures');
}
{
  const device = gpu({ initialErrors: [0x0502, 0x0505] });
  await withFetch(startupBuffers, async () => {
    const result = await loadLakeClouds(device.gl);
    checkUpload(device, result, Object.values(startupClouds));
  });
  assert(device.calls.errorReads > 2, 'Isolate earlier rendering errors before validating the new cloud pair');
}
{
  const { gl, calls } = gpu({ persistentError: true });
  await withFetch(startupBuffers, async () => assert.rejects(loadLakeClouds(gl), /error state unavailable/));
  assert(calls.errorReads <= 32, 'A persistent WebGL error must not cause an unbounded drain loop');
  assert.equal(calls.creates, 0, 'Preserve the working cloud pair when the GPU error state cannot be isolated');
}
{
  const fields = [
    { url: '/detailed-density', size: [480, 480, 80], channels: 2 },
    { url: '/detailed-volume', size: [128, 128, 128], channels: 4 },
  ];
  const routes = new Map(fields.map(field => [field.url, new ArrayBuffer(bytesFor(field))]));
  for (const stage of ['failUpload', 'failMipmap', 'failParameter']) {
    for (const fieldIndex of [1, 2]) {
      const { gl, calls } = gpu({ [stage]: fieldIndex });
      await withFetch(routes, async () => assert.rejects(loadLakeClouds(gl, {
        detailed: true, densityUrl: fields[0].url, volumeUrl: fields[1].url,
      }), /texture upload failed/));
      assert.equal(calls.creates, fieldIndex, `${stage}: stop allocating after the first invalid field`);
      assert.deepEqual(calls.deleted, calls.textures, `${stage}: release the entire replacement pair on a GPU error`);
      if (stage === 'failUpload') {
        assert.equal(calls.mipmaps.length, fieldIndex - 1, 'Do not generate mipmaps for a failed 3D allocation');
      }
    }
  }
}
{
  const { gl, calls } = gpu({ loseAfterMipmap: 2 });
  await withFetch(startupBuffers, async () => assert.rejects(loadLakeClouds(gl), /interrupted/));
  assert.equal(calls.textures.length, 2);
  assert.deepEqual(calls.deleted, calls.textures, 'Context loss while completing the second field releases both replacements');
}

console.log('Verified reproducible startup fields, cloud upload formats/priorities, atomic validation, GPU error isolation, allocation/mipmap cleanup and context-loss recovery.');
