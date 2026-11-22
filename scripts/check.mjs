import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { layoutProjectCoordinates } from '../_v/src/project-water-layout.js';
import { gallerySwipeStep } from '../_v/src/project-gallery.js';
import { screenshotThemeForMinutes, screenshotForTheme } from '../_v/src/project-image-theme.js';
import { portfolio } from '../_v/src/portfolio-content.js';
import { projectDetailMarkup } from '../_v/src/portfolio.js';
import { renderDimensions, backgroundFrameRate } from '../_v/src/local-render-quality.js';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('assets-manifest.json', root)));
for (const asset of manifest.assets) {
  assert(asset.ok, `Asset collection failed: ${asset.path}`);
  const info = await stat(new URL(asset.path.slice(1), root));
  assert.equal(info.size, asset.bytes, `Asset size mismatch: ${asset.path}`);
}
const sources = ['_v/entry-experience.css', '_v/src/entry-experience.js', '_v/src/social-sharing.js', '_v/src/social-sharing-init.js', 'index.html', '_v/local-ui.css', '_v/src/local-ui.js', '_v/src/local-i18n.js', '_v/src/language-utils.js', '_v/src/portfolio.js', '_v/src/portfolio-content.js', '_v/src/project-water.js', '_v/src/project-gallery.js', '_v/src/project-water-layout.js', '_v/src/local-render-quality.js', '_v/src/local-performance.js', '_v/styles.cb6b238f72177f1a.css', '_v/alt.c7b141401fcc6ce2.css',
  '_v/src/alt-main.e37b8660abd26238.js', '_v/src/lake-prelude.18109bbad9a6df8e.js',
  '_v/src/scene-cycle.77d0cc14a6dc8426.js'];
for (const source of sources) {
  const text = await readFile(new URL(source, root), 'utf8');
  const paths = text.matchAll(/["'`(](\/(?:_p|_v|_media)\/[^"'`)\s<>?]+)/g);
  for (const [, path] of paths) await stat(new URL(path.slice(1), root));
  assert(!text.includes('/cdn-cgi/'), 'Cloudflare injection must not be included');
}
console.log(`Verified ${manifest.assets.length} local assets and all page dependencies.`);

// The public site may show supplied images, but must not expose internal work links.
async function publicTextFiles(directory) {
  const entries = await readdir(new URL(directory, root), { withFileTypes: true });
  const files = await Promise.all(entries.map(entry => {
    const path = `${directory}${entry.name}`;
    return entry.isDirectory() ? publicTextFiles(`${path}/`) : /\.(?:html|css|m?js|json)$/i.test(entry.name) ? [path] : [];
  }));
  return files.flat();
}
const internalHost = /\b(?:[\w-]+\.)*(?:figma\.com|linear\.(?:app|com))\b/i;
for (const path of ['index.html', ...await publicTextFiles('_v/'), ...await publicTextFiles('_p/'), ...await publicTextFiles('_media/')]) {
  const text = (await readFile(new URL(path, root), 'utf8')).replaceAll('\\/', '/');
  assert(!internalHost.test(text), `Internal work link exposed in ${path}`);
  assert(!/(?:mailto:|tel:|[\w.+-]+@[\w-]+\.[a-z]{2,}|(?<![\w.])(?:\+?86[ -]?)?1[3-9](?:[ -]?\d){9}(?![\w.]))/i.test(text), `Personal identity or contact exposed in ${path}`);
}
for (const path of ['_v/src/portfolio-content.js', '_p/projects/ai-mixing/sources.json']) {
  const text = await readFile(new URL(path, root), 'utf8');
  assert(!/\b(?:fileKey|sectionNode|nodeId|designSource)\b/.test(text), `Internal design identifier exposed in ${path}`);
}
assert.deepEqual(Object.values(portfolio.name), ['MIAO', 'MIAO', 'MIAO']);
assert(!(await readdir(new URL('_p/', root))).includes('miao-portrait.jpeg'), 'Original portrait must remain outside public assets');
console.log('Verified public files contain no personal contact details, real name, original portrait, internal work links or design identifiers.');

// Regression check: project hit targets must not overlap the dock/player or each other.
const viewports = [[1280,720],[1440,900],[1000,720],[1280,480],[844,390],[768,1024],[690,954],[390,844],[390,640],[375,667],[320,568],[320,480],[320,390],[320,360],[667,375],[932,430],[360,640]];
for (const [width,height] of viewports) {
  for (const detailLeft of [null, ...(width >= 1000 ? [width - 568] : [])]) {
    const layout = layoutProjectCoordinates({width,height,detailLeft});
    const boxes = layout.points.map(point => ({
      left:point.x-layout.anchorX, right:point.x-layout.anchorX+layout.nodeWidth,
      top:point.y-40, bottom:point.y-40+layout.nodeHeight,
    }));
    assert(layout.nodeHeight >= 44);
    for (const box of boxes) {
      assert(box.left >= 0 && box.right <= width-(width < 1000 ? 16 : 80), `Coordinate leaves horizontal bounds at ${width}x${height}`);
      const readingBoundary = width < 1000 ? height - (height < 540 ? 68 : 174) : height - 72;
      assert(box.top >= 90 && box.bottom <= readingBoundary, `Coordinate overlaps header/player at ${width}x${height}`);
    }
    for (let i=0;i<boxes.length;i++) for (let j=i+1;j<boxes.length;j++) {
      const a=boxes[i],b=boxes[j];
      assert(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top, `Coordinate hit targets overlap at ${width}x${height}: ${i}/${j}`);
    }
  }
}
console.log(`Verified coordinate bounds and separation for ${viewports.length} viewport sizes.`);

// Check GPU budgets at normal, Retina and large desktop sizes, including dynamic scaling.
for (const [width, height] of [...viewports, [2560,1440], [3840,2160]]) {
  for (const dpr of [1,2,3]) for (const mobile of [false,true]) for (const lowPower of [false,true]) {
    const full = renderDimensions({width,height,dpr,mobile,lowPower});
    const reduced = renderDimensions({width,height,dpr,mobile,lowPower,scale:.66});
    const sceneBudget = lowPower ? 450000 : mobile ? 650000 : 900000;
    const outputBudget = lowPower ? 900000 : mobile ? 1400000 : 2200000;
    for (const result of [full,reduced]) {
      for (const key of ['sceneWidth','sceneHeight','outputWidth','outputHeight']) assert(Number.isInteger(result[key]) && result[key] > 0);
      assert(result.sceneWidth * result.sceneHeight <= sceneBudget * 1.005);
      assert(result.outputWidth * result.outputHeight <= outputBudget * 1.005);
      assert(Math.abs(result.outputWidth / result.outputHeight - width / height) < .015);
    }
    assert(reduced.sceneWidth <= full.sceneWidth && reduced.outputWidth <= full.outputWidth);
    assert(reduced.sceneHeight <= full.sceneHeight && reduced.outputHeight <= full.outputHeight);
  }
}
const retina = renderDimensions({width:1280,height:720,dpr:2});
assert.deepEqual([retina.outputWidth,retina.outputHeight], [1600,900]);
assert.equal(backgroundFrameRate(),60);
assert.equal(backgroundFrameRate({reading:true}),30);
assert.equal(backgroundFrameRate({reducedMotion:true}),30);
const html = await readFile(new URL('index.html',root),'utf8');
const ui = await readFile(new URL('_v/src/local-ui.js',root),'utf8');
assert.equal(html.match(/src="\/_v\/src\/(alt-main\.[^"]+)"/)[1], ui.match(/from '\.\/(alt-main\.[^']+)'/)[1], 'Core module URLs must match to avoid duplicate WebGL instances');
console.log('Verified adaptive render budgets, reading frame rate and core module URL consistency.');

// A tap or mostly vertical drag must never turn into an image change.
assert.equal(gallerySwipeStep(0, 0), 0);
assert.equal(gallerySwipeStep(-47, 0), 0);
assert.equal(gallerySwipeStep(-80, 60), 0);
assert.equal(gallerySwipeStep(-80, 20), 1);
assert.equal(gallerySwipeStep(80, -20), -1);
assert.equal(gallerySwipeStep(48, 0), -1);
console.log('Verified gallery swipe direction and tap/vertical-drag rejection.');

// Day/night boundaries and the product gallery's selected variants must agree.
for (const [minutes, theme] of [[0,'dark'],[359,'dark'],[360,'light'],[1079,'light'],[1080,'dark'],[1439,'dark'],[1440,'dark']]) {
  assert.equal(screenshotThemeForMinutes(minutes), theme);
}
const agent = portfolio.projects.find(project => project.id === 'agent-workflow');
assert.equal(agent.designScreens.length, 2);
for (const theme of ['light','dark']) {
  for (const screen of agent.designScreens) {
    const image = screenshotForTheme(screen, theme);
    for (const path of [image.src, image.thumbnail]) assert((await stat(new URL(path.slice(1),root))).size > 0);
    const png = await readFile(new URL(image.src.slice(1),root));
    assert.equal(png.readUInt32BE(16), image.width);
    assert.equal(png.readUInt32BE(20), image.height);
  }
  for (const language of ['zh-Hans','zh-Hant','en']) {
    const markup = projectDetailMarkup(agent, language, theme);
    assert.equal((markup.match(/data-design-index=/g) || []).length, 2);
    for (const screen of agent.designScreens) {
      assert(markup.includes(screenshotForTheme(screen, theme).thumbnail));
      assert(!markup.includes(screenshotForTheme(screen, theme === 'light' ? 'dark' : 'light').thumbnail));
    }
    assert(markup.indexOf('project-design-gallery') > markup.indexOf('resume-case'));
  }
}
const mixingScreen = portfolio.projects[0].designScreens[0];
assert.equal(screenshotForTheme(mixingScreen,'dark'), mixingScreen);
console.log('Verified scene-clock screenshot boundaries, paired assets, three-language galleries and unchanged static screens.');
