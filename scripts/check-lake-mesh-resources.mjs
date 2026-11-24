import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { loadLakeMesh, lakeMeshSources } from '../_v/src/lake-mesh-resources.js';
import { assertLosslessMeshGzip } from './generate-lake-meshes.mjs';

const root = new URL('../', import.meta.url);
const originalFetch = globalThis.fetch;
const originalDecompression = globalThis.DecompressionStream;
assert.equal(typeof originalDecompression, 'function', 'Mesh checks require Node.js 20+ DecompressionStream');
const asArrayBuffer = bytes => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
const files = new Map();
for (const source of lakeMeshSources) {
  const raw = await readFile(new URL(source.rawUrl.slice(1), root));
  const gzip = await readFile(new URL(source.gzipUrl.slice(1), root));
  assert.equal(raw.byteLength, source.bytes);
  assertLosslessMeshGzip(raw, gzip, source.rawUrl);
  assert(gzip.byteLength < raw.byteLength * .6, 'The transport variant should materially reduce mesh transfer');
  files.set(source.rawUrl, asArrayBuffer(raw));
  files.set(source.gzipUrl, asArrayBuffer(gzip));
}
execFileSync(process.execPath, [fileURLToPath(new URL('generate-lake-meshes.mjs', import.meta.url)), '--check'], { stdio: 'pipe' });

// Portable checks accept different valid encoder output, but still reject
// corruption and any change to the original decoded bytes.
{
  const raw = Buffer.from(Array.from({ length: 65536 }, (_, index) => index % 251));
  const fast = gzipSync(raw, { level: 1 });
  const dense = gzipSync(raw, { level: 9 });
  assert(!fast.equals(dense), 'Exercise distinct valid gzip encodings');
  assertLosslessMeshGzip(raw, fast);
  assertLosslessMeshGzip(raw, dense);
  const corrupt = Buffer.from(dense);
  corrupt[corrupt.length - 8] ^= 1;
  assert.throws(() => assertLosslessMeshGzip(raw, corrupt), 'Check gzip integrity, including its checksum');
  const changed = Buffer.from(raw); changed[100] ^= 1;
  assert.throws(() => assertLosslessMeshGzip(raw, gzipSync(changed)), /changed mesh bytes/);
  assert.throws(() => assertLosslessMeshGzip(raw, raw), /Invalid gzip/);
}

async function fixture(routes, run, decompress = originalDecompression) {
  const requests = [];
  globalThis.DecompressionStream = decompress;
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    assert(routes.has(url), `Unexpected mesh request: ${url}`);
    const value = routes.get(url);
    if (value instanceof Error) throw value;
    return { ok: value !== null, arrayBuffer: async () => value };
  };
  try { return await run(requests); }
  finally { globalThis.fetch = originalFetch; globalThis.DecompressionStream = originalDecompression; }
}

for (const source of lakeMeshSources) {
  await fixture(files, async requests => {
    const decoded = await loadLakeMesh(source.rawUrl);
    assert(Buffer.from(decoded).equals(Buffer.from(files.get(source.rawUrl))), 'The real browser decompression path must return the exact original mesh');
    assert.deepEqual(requests, [{ url: source.gzipUrl, options: { priority: 'high' } }]);
  });
  await fixture(files, async requests => {
    const decoded = await loadLakeMesh(source.rawUrl);
    assert(Buffer.from(decoded).equals(Buffer.from(files.get(source.rawUrl))));
    assert.deepEqual(requests.map(request => request.url), [source.rawUrl], 'A browser without decompression must fetch only the original file');
  }, null);
}

const source = lakeMeshSources[0];
for (const failure of ['network', 'http', 'decode', 'short', 'long', 'unsupported-format']) {
  const routes = new Map(files);
  routes.set(source.gzipUrl, failure === 'network' ? new Error('Gzip offline') : failure === 'http' ? null
    : failure === 'decode' ? new Uint8Array([0, 1, 2, 3]).buffer
      : failure === 'short' || failure === 'long' ? asArrayBuffer(gzipSync(new Uint8Array(source.bytes + (failure === 'short' ? -1 : 1))))
        : files.get(source.gzipUrl));
  const decompressor = failure === 'unsupported-format'
    ? class { constructor() { throw new Error('Unsupported gzip'); } }
    : originalDecompression;
  await fixture(routes, async requests => {
    const decoded = await loadLakeMesh(source.rawUrl);
    assert(Buffer.from(decoded).equals(Buffer.from(files.get(source.rawUrl))), `${failure}: recover with the unchanged raw mesh`);
    assert.deepEqual(requests.map(request => request.url), [source.gzipUrl, source.rawUrl]);
  }, decompressor);
}
{
  const error = new Error('Original mesh offline');
  const routes = new Map([[source.gzipUrl, new Error('Gzip offline')], [source.rawUrl, error]]);
  await fixture(routes, async () => assert.rejects(loadLakeMesh(source.rawUrl), actual => actual === error, 'Expose the original transport error if recovery also fails'));
}
{
  const routes = new Map([[source.rawUrl, null]]);
  await fixture(routes, async () => assert.rejects(loadLakeMesh(source.rawUrl), /Landscape mesh unavailable/), null);
}
{
  const routes = new Map([[source.rawUrl, new ArrayBuffer(source.bytes - 1)]]);
  await fixture(routes, async () => assert.rejects(loadLakeMesh(source.rawUrl), /invalid dimensions/), null);
}
{
  const arbitrary = new Uint8Array([1, 2, 3]).buffer;
  await fixture(new Map([['/other-mesh', arbitrary]]), async requests => {
    assert.equal(await loadLakeMesh('/other-mesh'), arbitrary, 'Unknown original meshes retain their normal fetch path');
    assert.deepEqual(requests.map(request => request.url), ['/other-mesh']);
  });
}

console.log('Verified lossless mesh transport, exact browser decompression, API compatibility, gzip network/decode/size recovery and explicit original-path failures.');
