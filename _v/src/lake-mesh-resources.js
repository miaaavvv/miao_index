// These are transport variants of the existing meshes, not simplified geometry.
// Resource lifetime and request deduplication belong to the renderer's cache.
export const lakeMeshSources = [
  { rawUrl: '/_p/data-gz-4ef07b75669881b76babec714bc0', gzipUrl: '/_p/lake-startup/fjord-depth.gz', bytes: 7099460 },
  { rawUrl: '/_p/data-gz-351f19f21e791f9e941da6cc0642', gzipUrl: '/_p/lake-startup/disola-depth.gz', bytes: 5585188 },
  { rawUrl: '/_p/data-gz-0667a7d2ff600d18ab45932b45e6', gzipUrl: '/_p/lake-startup/lakeside-depth.gz', bytes: 5944664 },
];

async function fetchMesh(url) {
  const response = await fetch(url, { priority: 'high' });
  if (!response.ok) throw new Error('Landscape mesh unavailable');
  return response.arrayBuffer();
}

function validate(buffer, source) {
  if (source && buffer.byteLength !== source.bytes) throw new Error('Landscape mesh has invalid dimensions');
  return buffer;
}

export async function loadLakeMesh(rawUrl) {
  const source = lakeMeshSources.find(mesh => mesh.rawUrl === rawUrl);
  if (source && typeof DecompressionStream === 'function') {
    try {
      const compressed = await fetchMesh(source.gzipUrl);
      const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
      return validate(await new Response(stream).arrayBuffer(), source);
    } catch {
      // Missing, damaged or unsupported gzip must not block a usable landscape.
      // The original file remains the compatibility and recovery path.
    }
  }
  // Keep the original failure visible if both transport paths are unavailable.
  return validate(await fetchMesh(rawUrl), source);
}
