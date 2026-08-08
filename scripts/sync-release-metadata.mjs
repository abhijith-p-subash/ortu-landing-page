/**
 * Stamps the current Ortu release into the built site.
 *
 * The version and release date appear in structured data (`softwareVersion`,
 * `dateModified`), in llms.txt, and in the sitemap's `lastmod`. Those were
 * hand-written, so they drifted the moment a release shipped — telling Google
 * and every LLM crawler that the latest Ortu was a version old.
 *
 * This resolves the real latest release at build time and rewrites the copies in
 * `dist/`. Source files under `public/` and `index.html` keep their committed
 * values, so they stay valid and readable on their own; only the build output is
 * stamped.
 *
 * The network call is best-effort. If GitHub is unreachable or rate-limited the
 * build still succeeds and the committed values ship unchanged — stale is bad,
 * but a failed deploy is worse.
 */
import fs from 'fs';
import path from 'path';

const REPO = 'abhijith-p-subash/ortu';
const distDir = path.resolve('dist');

/** Strips the tag prefix CI uses (`v2.1.0`, and older `app-v2.0.2`). */
function versionFromTag(tag) {
  return String(tag ?? '').replace(/^app-v/, '').replace(/^v/, '');
}

async function resolveLatestRelease() {
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'ortu-landing-build' },
  });
  if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);

  const data = await res.json();
  const version = versionFromTag(data.tag_name);
  if (!/^\d+\.\d+\.\d+/.test(version)) {
    throw new Error(`Unexpected tag format: ${JSON.stringify(data.tag_name)}`);
  }

  // `published_at` is when users could actually get it, which is what
  // `dateModified` and `lastmod` are claiming.
  const date = String(data.published_at ?? '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Unexpected published_at: ${JSON.stringify(data.published_at)}`);
  }

  return { version, date };
}

/**
 * Applies `edits` to a file in dist/. Every edit must match, because a silent
 * no-op here is precisely the drift this script exists to prevent — a refactor
 * that renames a field would otherwise ship stale metadata forever.
 */
function rewrite(file, edits) {
  const filePath = path.join(distDir, file);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Expected ${file} in dist/ — did the build run first?`);
  }

  let text = fs.readFileSync(filePath, 'utf-8');
  for (const { label, pattern, replacement } of edits) {
    const next = text.replace(pattern, replacement);
    if (next === text) {
      throw new Error(`${file}: no match for "${label}" — the pattern needs updating.`);
    }
    text = next;
  }

  fs.writeFileSync(filePath, text, 'utf-8');
}

async function main() {
  let release;
  try {
    release = await resolveLatestRelease();
  } catch (err) {
    console.warn(`release-metadata: could not resolve latest release (${err.message}).`);
    console.warn('release-metadata: keeping the committed values. Build continues.');
    return;
  }

  const { version, date } = release;

  rewrite('index.html', [
    {
      label: 'softwareVersion',
      pattern: /("softwareVersion":\s*")[^"]*(")/,
      replacement: `$1${version}$2`,
    },
    {
      label: 'dateModified',
      pattern: /("dateModified":\s*")[^"]*(")/,
      replacement: `$1${date}$2`,
    },
  ]);

  rewrite('llms.txt', [
    {
      label: 'latest stable version',
      pattern: /^(- Latest stable version: ).*$/m,
      replacement: `$1${version}`,
    },
  ]);

  rewrite('sitemap.xml', [
    {
      // Only the homepage entry: the policy pages did not change just because
      // the app did, and claiming otherwise teaches crawlers to distrust lastmod.
      label: 'homepage lastmod',
      pattern: /(<loc>https:\/\/ortu\.abhijithpsubash\.com\/<\/loc>\s*<lastmod>)[^<]*(<\/lastmod>)/,
      replacement: `$1${date}$2`,
    },
  ]);

  console.log(`release-metadata: stamped v${version} (${date}) into index.html, llms.txt, sitemap.xml`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
