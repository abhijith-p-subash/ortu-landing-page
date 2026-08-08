import { Download, Github } from 'lucide-react';
import PageShell from './PageShell';
import type { PlatformContent } from './pageData';
import { platforms } from './pageData';

const RELEASES = 'https://github.com/abhijith-p-subash/ortu/releases/latest';

const PlatformPage = ({ content }: { content: PlatformContent }) => {
  const others = platforms.filter((p) => p.slug !== content.slug);

  return (
    <PageShell>
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent">
        Ortu for {content.os}
      </p>
      <h1 className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.15] text-white">
        {content.headline}
      </h1>
      <p className="mt-5 text-zinc-400 leading-relaxed">{content.intro}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={RELEASES}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-bg transition-colors hover:bg-accent-hover"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {content.downloadLabel}
        </a>
        <a
          href="https://github.com/abhijith-p-subash/ortu"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
        >
          <Github className="h-4 w-4" aria-hidden="true" />
          View source
        </a>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight text-white">{content.installTitle}</h2>
        <ol className="mt-6 space-y-6">
          {content.installSteps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-raised font-mono text-xs text-accent"
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-white">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{step.body}</p>
                {step.code && (
                  <pre className="mt-3 overflow-x-auto rounded-xl border border-border bg-raised px-4 py-3 font-mono text-[13px] leading-relaxed text-zinc-200">
                    <code>{step.code}</code>
                  </pre>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          {content.os} keyboard shortcuts
        </h2>
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface/70">
          <table className="min-w-full text-left">
            <caption className="sr-only">Default Ortu shortcuts on {content.os}</caption>
            <tbody>
              {content.shortcuts.map((s, i) => (
                <tr key={s.action} className={i % 2 ? 'bg-white/[0.015]' : undefined}>
                  <th scope="row" className="px-5 py-3 text-sm font-medium text-zinc-300">
                    {s.action}
                  </th>
                  <td className="px-5 py-3 text-right">
                    <span className="keycap px-2 py-1 text-xs">{s.keys}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-zinc-500">
          The three global hotkeys are rebindable in Settings → Global Shortcuts.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight text-white">{content.notesTitle}</h2>
        <ul className="mt-6 space-y-3">
          {content.notes.map((note) => (
            <li key={note} className="flex gap-3 text-sm leading-relaxed text-zinc-400">
              <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Questions about Ortu on {content.os}
        </h2>
        <div className="mt-6 space-y-5">
          {content.faqs.map((faq) => (
            <div key={faq.q} className="rounded-2xl border border-border bg-surface/70 p-5">
              <h3 className="text-base font-semibold text-white">{faq.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <nav aria-label="Ortu on other platforms" className="mt-16 border-t border-border pt-8">
        <h2 className="text-sm font-semibold text-white">Ortu on other platforms</h2>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {others.map((p) => (
            <li key={p.slug}>
              <a href={`/${p.slug}`} className="text-sm text-zinc-400 transition-colors hover:text-white">
                Clipboard manager for {p.os}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/free-open-source-clipboard-manager"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Free &amp; open source
            </a>
          </li>
          <li>
            <a href="/" className="text-sm text-zinc-400 transition-colors hover:text-white">
              All features
            </a>
          </li>
        </ul>
      </nav>
    </PageShell>
  );
};

export default PlatformPage;
