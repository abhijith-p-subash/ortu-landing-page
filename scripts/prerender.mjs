import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const distDir = path.resolve('dist');
const serverEntry = path.resolve('dist/server/entry-server.js');
const templatePath = path.resolve('index.html');
const manifestPath = path.resolve('dist/manifest.json');

async function main() {
  if (!fs.existsSync(serverEntry)) {
    throw new Error('Server bundle not found. Run vite build --ssr first.');
  }
  if (!fs.existsSync(manifestPath)) {
    throw new Error('Manifest not found. Run vite build with --manifest.');
  }

  const template = fs.readFileSync(templatePath, 'utf-8');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  const { render } = await import(pathToFileURL(serverEntry).href);
  const { html } = render('/');

  const mainChunk = manifest['src/main.tsx'] || manifest['src/main.ts'];
  if (!mainChunk) {
    throw new Error('main chunk not found in manifest');
  }

  const cssLinks = (mainChunk.css || [])
    .map((css) => `<link rel="stylesheet" href="/${css}" />`)
    .join('');

  const jsScript = `<script type="module" src="/${mainChunk.file}"></script>`;

  const rendered = template
    // remove dev script tag
    .replace('<script type="module" src="/src/main.tsx"></script>', '')
    // inject SSR HTML
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
    // ensure critical css from build manifest is in head
    .replace('</head>', `${cssLinks}</head>`)
    // inject built JS
    .replace('</body>', `${jsScript}</body>`);

  fs.writeFileSync(path.join(distDir, 'index.html'), rendered, 'utf-8');
  console.log('SSG: generated dist/index.html');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
