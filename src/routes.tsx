import type { ReactElement } from 'react';
import App from './App';
import PlatformPage from './pages/PlatformPage';
import OpenSourcePage from './pages/OpenSourcePage';
import { openSourceFaqs, platforms } from './pages/pageData';

const ORIGIN = 'https://ortu.abhijithpsubash.com';

export interface RouteDef {
  /** Absolute path, no trailing slash except for the homepage. */
  path: string;
  element: ReactElement;
  /**
   * Per-route <head>. The homepage leaves these undefined so its hand-tuned
   * head in index.html is used verbatim; every other route overrides them.
   */
  title?: string;
  description?: string;
  /** Serialized into a <script type="application/ld+json"> block by the prerender step. */
  jsonLd?: unknown;
}

const faqSchema = (faqs: { q: string; a: string }[]) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

const pageGraph = (path: string, name: string, faqs?: { q: string; a: string }[]) => {
  const url = `${ORIGIN}${path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name,
        inLanguage: 'en',
        // Points back at the SoftwareApplication and WebSite nodes declared on
        // the homepage, so the whole site resolves as one entity graph.
        isPartOf: { '@id': `${ORIGIN}/#website` },
        about: { '@id': `${ORIGIN}/#app` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name, item: url },
        ],
      },
      ...(faqs ? [faqSchema(faqs)] : []),
    ],
  };
};

const platformRoutes: RouteDef[] = platforms.map((p) => {
  const path = `/${p.slug}`;
  const title = `Ortu — Free Open-Source Clipboard Manager for ${p.os}`;
  return {
    path,
    element: <PlatformPage content={p} />,
    title,
    description:
      `Ortu is a free, open-source clipboard manager for ${p.os}. Local-first history of text, ` +
      `images and files with instant search, a paste stack and encryption — no cloud, no telemetry. ` +
      `Install steps and ${p.os} shortcuts.`,
    jsonLd: pageGraph(path, title, p.faqs),
  };
});

const openSourcePath = '/free-open-source-clipboard-manager';
const openSourceTitle = 'Free & Open-Source Clipboard Manager — Ortu (MIT Licensed)';

export const routes: RouteDef[] = [
  { path: '/', element: <App /> },
  ...platformRoutes,
  {
    path: openSourcePath,
    element: <OpenSourcePage />,
    title: openSourceTitle,
    description:
      'Ortu is a free, MIT-licensed, open-source clipboard manager for macOS, Windows and Linux. ' +
      'No paid tier, no account, no telemetry — and a public source tree and build pipeline you can audit.',
    jsonLd: pageGraph(openSourcePath, openSourceTitle, openSourceFaqs),
  },
];

/** Normalizes a URL path so `/foo`, `/foo/` and `/foo/index.html` all resolve. */
export function resolveRoute(pathname: string): RouteDef | undefined {
  const clean = pathname.replace(/\/index\.html$/, '').replace(/\/+$/, '') || '/';
  return routes.find((r) => r.path === clean);
}
