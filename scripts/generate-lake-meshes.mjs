import assert from 'node:assert/strict';
import { gzipSync, gunzipSync } from 'node:zlib';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lakeMeshSources } from '../_v/src/lake-mesh-resources.js';

const root = new URL('../', import.meta.url);

export function assertLosslessMeshGzip(raw, gzip, label = 'mesh') {
  assert(gzip[0] === 0x1f && gzip[1] === 0x8b && gzip[2] === 8, `Invalid gzip: ${label}`);
  assert(gzip.byteLength < raw.byteLength, `Compression did not reduce mesh transfer: ${label}`);
  assert(gunzipSync(gzip).equals(raw), `Compression changed mesh bytes: ${label}`);
}

async function main() {
  const check = process.argv.includes('--check');
  assert(process.argv.slice(2).every(argument => argument === '--check'), 'Usage: node scripts/generate-lake-meshes.mjs [--check]');
  if (!check) await mkdir(new URL('_p/lake-startup/', root), { recursive: true });
  for (const source of lakeMeshSources) {
    const raw = await readFile(new URL(source.rawUrl.slice(1), root));
    assert.equal(raw.byteLength, source.bytes, `Unexpected original size: ${source.rawUrl}`);
    const destination = new URL(source.gzipUrl.slice(1), root);
    // Different zlib versions can emit different valid gzip streams. Check
    // the committed transport's decoded geometry, not a fresh encoder's bytes.
    const gzip = check ? await readFile(destination) : gzipSync(raw, { level: 6 });
    assertLosslessMeshGzip(raw, gzip, source.rawUrl);
    if (!check) await writeFile(destination, gzip);
    console.log(`${check ? 'Verified' : 'Generated'} ${source.gzipUrl}: ${raw.byteLength} → ${gzip.byteLength} bytes, lossless gzip${check ? '' : ' level 6'}`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
