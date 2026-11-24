import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

// Rebuild the small, real cloud fields used by the first complete lake frame.
// No image or numerical packages are needed. The source assets stay unchanged.
// Run with --check to verify the committed bytes without writing anything.
const root = new URL('../', import.meta.url);
const check = process.argv.includes('--check');
assert(process.argv.slice(2).every(argument => argument === '--check'), 'Usage: node scripts/generate-lake-startup.mjs [--check]');
const jobs = [
  {
    source: '_p/data-gz-ca39cbca18cdd338259f3eb29187',
    sourceSize: [256, 256, 64],
    destination: '_p/lake-startup/cloud-density-64x64x16.rg8',
    size: [64, 64, 16], channels: 2, reduction: 'rms',
  },
  {
    source: '_p/data-gz-5da63c9db5bd74e69dd285211337',
    sourceSize: [128, 128, 128],
    destination: '_p/lake-startup/cloud-volume-32x32x32.rgba8',
    size: [32, 32, 32], channels: 4, reduction: 'mean',
  },
];

function downsample(source, job) {
  const [width, height, depth] = job.sourceSize;
  const [nextWidth, nextHeight, nextDepth] = job.size;
  assert.equal(source.byteLength, width * height * depth * job.channels, `Unexpected source size: ${job.source}`);
  const factors = job.sourceSize.map((size, axis) => size / job.size[axis]);
  assert(factors.every(factor => Number.isInteger(factor) && factor > 0), 'Voxel blocks must have integer dimensions');
  const [stepX, stepY, stepZ] = factors;
  const samples = stepX * stepY * stepZ;
  const output = Buffer.alloc(nextWidth * nextHeight * nextDepth * job.channels);
  const rms = job.reduction === 'rms';
  for (let z = 0; z < nextDepth; z++) {
    for (let y = 0; y < nextHeight; y++) {
      for (let x = 0; x < nextWidth; x++) {
        const target = ((z * nextHeight + y) * nextWidth + x) * job.channels;
        for (let channel = 0; channel < job.channels; channel++) {
          let sum = 0;
          for (let dz = 0; dz < stepZ; dz++) {
            for (let dy = 0; dy < stepY; dy++) {
              for (let dx = 0; dx < stepX; dx++) {
                const index = (((z * stepZ + dz) * height + y * stepY + dy) * width + x * stepX + dx) * job.channels + channel;
                const value = source[index];
                sum += rms ? value * value : value;
              }
            }
          }
          // The cloud medium squares both density channels in its shader.
          // RMS therefore retains the block's mean optical density rather
          // than thinning the cloud edges by averaging before that square.
          // Volume noise stays linear: a box mean removes unresolved detail
          // while preserving the field's large-scale spatial alignment.
          output[target + channel] = Math.round(rms ? Math.sqrt(sum / samples) : sum / samples);
        }
      }
    }
  }
  return output;
}

if (!check) await mkdir(new URL('_p/lake-startup/', root), { recursive: true });
for (const job of jobs) {
  const source = await readFile(new URL(job.source, root));
  const output = downsample(source, job);
  assert.equal(output.byteLength, 131072, 'Each startup field must be 128 KiB');
  const destination = new URL(job.destination, root);
  if (check) assert(output.equals(await readFile(destination)), `Regenerate stale startup data: ${job.destination}`);
  else await writeFile(destination, output);
  console.log(`${check ? 'Verified' : 'Generated'} ${job.destination}: ${output.byteLength} bytes, SHA-256 ${createHash('sha256').update(output).digest('hex')}`);
}
