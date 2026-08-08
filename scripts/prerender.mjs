import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const ORIGIN = 'https://ortu.abhijithpsubash.com';
const distDir = path.resolve('dist');
const serverEntry = path.resolve('dist/server/entry-server.js');
const templatePath = path.resolve('index.html');
// Vite 5+ emits the manifest under dist/.vite/; keep the legacy path as a fallback.
const manifestCandidates = [
  path.resolve('dist/.vite/manifest.json'),
  path.resolve('dist/manifest.json'),
];

/** Escapes a string for safe use inside a String.replace replacement. */
const literal = (value) => value.replace(/\$/g, '$$$$');

/**
 * Swaps in a route's own title/description/canonical/social tags.
 *
 * The homepage's head in index.html is hand-tuned, so it is reused as the shell
 * for every page and only the fields that must differ per URL are rewritten.
 * Each replacement is asserted, because a silently-skipped one would ship two
 * pages with identical titles — which is precisely the duplicate-content problem
 * these pages exist to avoid.
 */
function applyHead(html, { title, description, canonical }) {
  const edits = [
    { label: '<title>', pattern: /<title>[\s\S]*?<\/title>/, value: `<title>${title}</title>` },
    {
      label: 'meta description',
      pattern: /(<meta\s+name="description"\s+content=")[\s\S]*?(")/,
      value: `$1${literal(description)}$2`,
    },
    {
      label: 'canonical',
      pattern: /(<link rel="canonical" href=")[^"]*(")/,
      value: `$1${canonical}$2`,
    },
    {
      label: 'og:title',
      pattern: /(<meta\s+property="og:title"\s+content=")[\s\S]*?(")/,
      value: `$1${literal(title)}$2`,
    },
    {
      label: 'og:description',
      pattern: /(<meta\s+property="og:description"\s+content=")[\s\S]*?(")/,
      value: `$1${literal(description)}$2`,
    },
    {
      label: 'og:url',
      pattern: /(<meta property="og:url" content=")[^"]*(")/,
      value: `$1${canonical}$2`,
    },
    {
      label: 'twitter:title',
      pattern: /(<meta\s+name="twitter:title"\s+content=")[\s\S]*?(")/,
      value: `$1${literal(title)}$2`,
    },
    {
      label: 'twitter:description',
      pattern: /(<meta\s+name="twitter:description"\s+content=")[\s\S]*?(")/,
      value: `$1${literal(description)}$2`,
    },
    {
      label: 'twitter:url',
      pattern: /(<meta name="twitter:url" content=")[^"]*(")/,
      value: `$1${canonical}$2`,
    },
  ];

  for (const { label, pattern, value } of edits) {
    const next = html.replace(pattern, value);
    if (next === html) {
      throw new Error(`prerender: no match for ${label} in index.html — pattern needs updating.`);
    }
    html = next;
  }

  // hreflang on the shell points at the homepage; drop it rather than have every
  // sub-page declare the homepage as its own alternate.
  return html.replace(/\s*<link rel="alternate"[^>]*>/g, '');
}

/** Replaces the homepage's JSON-LD with the route's own. Structural, so it survives content edits. */
function applyJsonLd(html, jsonLd) {
  const stripped = html.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  if (stripped === html) {
    throw new Error('prerender: expected JSON-LD blocks in index.html to replace.');
  }
  const block = `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n</script>`;
  return stripped.replace('</head>', `${block}</head>`);
}

async function main() {
  if (!fs.existsSync(serverEntry)) {
    throw new Error('Server bundle not found. Run vite build --ssr first.');
  }
  const manifestPath = manifestCandidates.find((p) => fs.existsSync(p));
  if (!manifestPath) {
    throw new Error('Manifest not found. Run vite build with --manifest.');
  }

  const template = fs.readFileSync(templatePath, 'utf-8');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  const { render, getRoutes } = await import(pathToFileURL(serverEntry).href);

  const mainChunk = manifest['src/main.tsx'] || manifest['src/main.ts'];
  if (!mainChunk) {
    throw new Error('main chunk not found in manifest');
  }

  const cssLinks = (mainChunk.css || [])
    .map((css) => `<link rel="stylesheet" href="/${css}" />`)
    .join('');
  const jsScript = `<script type="module" src="/${mainChunk.file}"></script>`;

  for (const route of getRoutes()) {
    const { html, title, description, jsonLd } = render(route.path);

    let page = template;

    // The homepage keeps index.html's head verbatim; sub-pages override it.
    if (title && description) {
      const canonical = `${ORIGIN}${route.path === '/' ? '/' : route.path}`;
      page = applyHead(page, { title, description, canonical });
    }
    if (jsonLd) {
      page = applyJsonLd(page, jsonLd);
    }

    page = page
      .replace('<script type="module" src="/src/main.tsx"></script>', '')
      .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
      .replace('</head>', `${cssLinks}</head>`)
      .replace('</body>', `${jsScript}</body>`);

    // "/" -> dist/index.html; "/foo" -> dist/foo/index.html, so Netlify serves
    // it at the clean URL without a redirect rule.
    const outPath =
      route.path === '/'
        ? path.join(distDir, 'index.html')
        : path.join(distDir, route.path, 'index.html');

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, page, 'utf-8');
    console.log(`SSG: ${route.path} -> ${path.relative(distDir, outPath)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
