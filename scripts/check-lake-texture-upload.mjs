import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../_v/src/alt-main.e37b8660abd26238.js', import.meta.url), 'utf8');
const start = source.indexOf('function d0(');
const end = source.indexOf('var ln=', start);
assert(start >= 0 && end > start, 'Locate the shipped image texture loader');
const loaderSource = source.slice(start, end).trim();

function device({ failCreate = false, failAt, lost = false, initialErrors = [], persistentError = false } = {}) {
  const calls = { created: [], deleted: [], images: [], uploads: [], mipmaps: [], parameters: [], pixels: [], errorReads: 0, creates: 0 };
  const errors = [...initialErrors];
  const gl = {
    NO_ERROR: 0, INVALID_OPERATION: 0x0502, OUT_OF_MEMORY: 0x0505,
    TEXTURE_2D: 0x0de1, RGBA: 0x1908, UNSIGNED_BYTE: 0x1401,
    UNPACK_FLIP_Y_WEBGL: 0x9240, UNPACK_PREMULTIPLY_ALPHA_WEBGL: 0x9241,
    UNPACK_COLORSPACE_CONVERSION_WEBGL: 0x9243, NONE: 0,
    TEXTURE_WRAP_S: 0x2802, TEXTURE_WRAP_T: 0x2803, REPEAT: 0x2901, CLAMP_TO_EDGE: 0x812f,
    TEXTURE_MIN_FILTER: 0x2801, TEXTURE_MAG_FILTER: 0x2800,
    LINEAR_MIPMAP_LINEAR: 0x2703, LINEAR: 0x2601,
    lost, bound: null,
    isContextLost() { return this.lost; },
    getError() {
      if (++calls.errorReads > 64) throw new Error('Unbounded WebGL error drain');
      return persistentError ? this.INVALID_OPERATION : errors.shift() ?? this.NO_ERROR;
    },
    createTexture() {
      calls.creates++;
      if (failCreate) return null;
      const texture = { id: calls.creates };
      calls.created.push(texture);
      return texture;
    },
    bindTexture(target, texture) { assert.equal(target, this.TEXTURE_2D); this.bound = texture; },
    pixelStorei(key, value) { calls.pixels.push([key, value]); },
    texImage2D(...args) {
      calls.uploads.push({ texture: this.bound, args });
      if (failAt === 'upload') errors.push(this.OUT_OF_MEMORY);
      if (failAt === 'upload-context') this.lost = true;
    },
    texParameteri(target, key, value) {
      calls.parameters.push([target, key, value]);
      if (failAt === 'parameters') errors.push(this.INVALID_OPERATION);
    },
    generateMipmap(target) {
      calls.mipmaps.push(target);
      if (failAt === 'mipmap') errors.push(this.OUT_OF_MEMORY);
      if (failAt === 'mipmap-context') this.lost = true;
    },
    getExtension() { return null; },
    deleteTexture(texture) { calls.deleted.push(texture); },
  };
  class ImageMock {
    constructor() { calls.images.push(this); this.width = 2048; this.height = 2048; }
    set src(value) { this.url = value; this.onload(); }
  }
  // Deliberately omit createImageBitmap: exercise the browser Image path with
  // the real upload callback and no network, GPU or asynchronous image decode.
  const load = vm.runInNewContext(`(${loaderSource})`, { Image: ImageMock, Promise }, {
    filename: 'shipped-lake-image-loader.js', timeout: 1000,
  });
  return { gl, calls, load: options => load(gl, '/lake-bed.jpg', options) };
}

for (const environment of [false, true]) {
  const { gl, calls, load } = device();
  const texture = await load({ validateUpload: true, environment, priority: 'low' });
  assert.equal(texture, calls.created[0]);
  assert.equal(calls.images.length, 1);
  assert.equal(calls.images[0].url, '/lake-bed.jpg');
  assert.equal(calls.images[0].fetchPriority, 'low');
  assert.equal(calls.images[0].decoding, 'async');
  assert.equal(calls.uploads.length, 1);
  assert.deepEqual(calls.uploads[0].args.slice(0, 5), [gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE]);
  assert.equal(calls.uploads[0].args[5], calls.images[0]);
  assert(calls.mipmaps.includes(gl.TEXTURE_2D));
  const parameters = new Map(calls.parameters.map(([, key, value]) => [key, value]));
  assert.equal(parameters.get(gl.TEXTURE_WRAP_T), environment ? gl.CLAMP_TO_EDGE : gl.REPEAT);
  assert.equal(parameters.get(gl.TEXTURE_MIN_FILTER), gl.LINEAR_MIPMAP_LINEAR);
  assert.equal(gl.bound, null, 'A successful upload releases its temporary texture binding');
  assert.deepEqual(calls.deleted, []);
  assert(calls.errorReads > 0, 'Validated lake-bed textures must check GPU allocation errors');
}
for (const failAt of ['upload', 'mipmap', 'parameters', 'upload-context', 'mipmap-context']) {
  const { calls, load } = device({ failAt });
  await assert.rejects(load({ validateUpload: true }), /./);
  assert.equal(calls.created.length, 1, `${failAt}: create only the replacement texture`);
  assert.deepEqual(calls.deleted, calls.created, `${failAt}: release the invalid replacement before rejecting`);
}
{
  const { calls, load } = device({ failCreate: true });
  await assert.rejects(load({ validateUpload: true }), /./);
  assert.equal(calls.creates, 1);
  assert.equal(calls.uploads.length, 0, 'Never upload into a null texture handle');
  assert.deepEqual(calls.deleted, []);
}
{
  const { calls, load } = device({ lost: true });
  await assert.rejects(load({ validateUpload: true }), /context/i);
  assert.equal(calls.creates, 0, 'An already-lost context must not allocate a replacement');
  assert.equal(calls.uploads.length, 0);
}
{
  const { calls, load } = device({ initialErrors: [0x0502, 0x0505] });
  assert.equal(await load({ validateUpload: true }), calls.created[0], 'Earlier rendering errors must not reject a valid new texture');
  assert(calls.errorReads > 2);
  assert.deepEqual(calls.deleted, []);
}
{
  const { calls, load } = device({ persistentError: true });
  await assert.rejects(load({ validateUpload: true }), error => !/Unbounded/.test(error.message));
  assert(calls.errorReads <= 32, 'Persistent old errors must terminate within a bounded number of checks');
  assert.equal(calls.creates, 0, 'Do not allocate when the previous GPU error state cannot be isolated');
}
{
  const { calls, load } = device();
  assert.equal(await load(), calls.created[0]);
  assert.equal(calls.errorReads, 0, 'Unrelated legacy material uploads retain their existing opt-out behavior');
}

console.log('Verified the shipped lake image loader, validated 2D uploads, bounded GPU error isolation, allocation/mipmap failure cleanup and context loss.');
