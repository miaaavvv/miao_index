import assert from 'node:assert/strict';
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { basename, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const base = process.argv.find(value => value.startsWith('--base='))?.slice(7) ?? '/miao_index/';
assert(/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(base), 'Use a root-relative base ending in /');
const output = resolve(root, '.local/pages-dist');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
// Publish only the page and its assets, never Git, credentials or handoff files.
for (const name of ['index.html', '_p', '_v', '_media']) {
  await cp(resolve(root, name), resolve(output, name), {
    recursive: true,
    filter: path => !basename(path).startsWith('.'),
  });
}

async function filesAt(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? filesAt(resolve(directory, entry.name))
    : [resolve(directory, entry.name)]))).flat();
}
let references = 0;
for (const file of await filesAt(output)) {
  if (!['.html', '.js', '.css', '.json'].includes(extname(file))) continue;
  let text = await readFile(file, 'utf8');
  text = text.replace(/(?<![\w/])\/(_p|_v|_media)\//g, `${base}$1/`);
  text = text.replaceAll('href="/"', `href="${base}"`);
  // Static hosting keeps the existing browser language/timezone fallback.
  text = text.replaceAll("'/api/region'", `'${base}api/region.json'`);
  await writeFile(file, text);
  if (base !== '/') assert(!/(?<![\w/])\/(?:_p|_v|_media)\//.test(text), `Unprefixed asset in ${file}`);
  const prefix = base.replaceAll('/', '\\/');
  const paths = new RegExp(`["'\x60(](${prefix}(?:_p|_v|_media)/[^"'\x60)\\s<>?]+)`, 'g');
  for (const [, path] of text.matchAll(paths)) {
    await stat(resolve(output, path.slice(base.length)));
    references++;
  }
}
await mkdir(resolve(output, 'api'), { recursive: true });
await writeFile(resolve(output, 'api/region.json'), '{"country":null}\n');
await writeFile(resolve(output, '.nojekyll'), '');
const html = await readFile(resolve(output, 'index.html'), 'utf8');
const ui = await readFile(resolve(output, '_v/src/local-ui.js'), 'utf8');
const core = html.match(/src="([^"]+\/alt-main\.[^"]+)"/)[1];
const importedCore = ui.match(/from '(\.\/alt-main\.[^']+)'/)[1];
assert.equal(core, `${base}_v/src/${importedCore.slice(2)}`, 'Core module must execute only once');
assert(html.includes(`href="${base}"`), 'Home link must stay inside the project site');
console.log(`Built ${output} for ${base}; verified ${references} asset references and matching core module URLs.`);
