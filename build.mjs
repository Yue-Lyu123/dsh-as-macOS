import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, 'macos-desktop');
const out = join(root, 'build', 'macos-desktop-build');

const css = readFileSync(join(src, 'macos.css'), 'utf8');
const jpg = readFileSync(join(src, 'assets', 'sonoma.jpg'));
const wallpaper = `data:image/jpeg;base64,${jpg.toString('base64')}`;

let js = readFileSync(join(src, 'client.js'), 'utf8');
if (!js.includes("const CSS = '__MACOS_CSS__';")) throw new Error('CSS placeholder missing');
if (!js.includes("const WALLPAPER = '__WALLPAPER__';")) throw new Error('WALLPAPER placeholder missing');
js = js.replace("const CSS = '__MACOS_CSS__';", () => `const CSS = ${JSON.stringify(css)};`);
js = js.replace("const WALLPAPER = '__WALLPAPER__';", () => `const WALLPAPER = ${JSON.stringify(wallpaper)};`);

// shrink asset again a notch: no need for 1100px inside a base64 blob
const pkg = JSON.parse(readFileSync(join(src, 'package.json'), 'utf8'));
pkg.files = ['index.js', 'client.js', 'cordis.patch.yml', 'locale/*.json', 'icon.svg',
  'README.md', 'README.zh.md', 'LICENSE', 'docs/*.jpg'];

writeFileSync(join(out, 'client.js'), js, 'utf8');
writeFileSync(join(out, 'index.js'), readFileSync(join(src, 'index.js'), 'utf8'));
writeFileSync(join(out, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
writeFileSync(join(out, 'cordis.patch.yml'), readFileSync(join(src, 'cordis.patch.yml'), 'utf8'));
for (const f of ['locale/en.json', 'icon.svg']) {
  try { writeFileSync(join(out, f), readFileSync(join(src, f), 'utf8')); } catch { /* optional */ }
}
// publish-time extras: the two READMEs, the licence and the screenshots they link to
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
copyFileSync(join(root, 'README.md'), join(out, 'README.md'));
copyFileSync(join(root, 'README.zh.md'), join(out, 'README.zh.md'));
copyFileSync(join(root, 'LICENSE'), join(out, 'LICENSE'));
mkdirSync(join(out, 'docs'), { recursive: true });
for (const f of ['01-desktop.jpg', '02-windows.jpg', '03-apps.jpg', '04-launchpad.jpg']) {
  const from = join(root, 'docs', f);
  if (existsSync(from)) copyFileSync(from, join(out, 'docs', f));
}

console.log('built', out, 'client.js bytes', js.length);
