import { Download, Github } from 'lucide-react';
import PageShell from './PageShell';
import { openSourceFaqs, platforms } from './pageData';

const REPO = 'https://github.com/abhijith-p-subash/ortu';
const RELEASES = `${REPO}/releases/latest`;

/**
 * Targets "free / open source clipboard manager". Deliberately not a second
 * feature tour — the homepage already does that, and a near-copy would just
 * compete with it. This page argues the licensing and verifiability angle,
 * which is the thing people searching "open source" actually want to know.
 */
const OpenSourcePage = () => (
  <PageShell>
    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-sage">
      Free &amp; open source
    </p>
    <h1 className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.15] text-white">
      A free, open-source clipboard manager you can actually audit
    </h1>
    <p className="mt-5 leading-relaxed text-zinc-400">
      Ortu is released under the MIT licence and costs nothing — no paid tier, no subscription, no
      account, and no features held back behind an upgrade. It runs on macOS, Windows and Linux, and
      keeps your clipboard history in a local database on your own machine.
    </p>
    <p className="mt-4 leading-relaxed text-zinc-400">
      &ldquo;Free&rdquo; is easy to claim. What matters for something that watches everything you
      copy is whether you can check what it does — so here is exactly what you can verify.
    </p>

    <div className="mt-8 flex flex-wrap gap-3">
      <a
        href={RELEASES}
        className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-bg transition-colors hover:bg-accent-hover"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Download Ortu
      </a>
      <a
        href={REPO}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
      >
        <Github className="h-4 w-4" aria-hidden="true" />
        Read the source
      </a>
    </div>

    <section className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight text-white">What the MIT licence gives you</h2>
      <ul className="mt-6 space-y-3">
        {[
          'Use Ortu for anything, including commercial work, at no cost.',
          'Read every line of the source, including how clips are captured, stored and encrypted.',
          'Modify it and run your own build — nothing checks a licence key.',
          'Redistribute it, as long as the copyright notice and licence text come along.',
        ].map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-zinc-400">
            <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sage" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>

    <section className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight text-white">How to check the privacy claim</h2>
      <p className="mt-4 text-sm leading-relaxed text-zinc-400">
        Ortu is local-first: clipboard history is written to a SQLite database on your device, there
        is no account or sync, and there is no analytics or telemetry dependency anywhere in the
        project. The only outbound request the app makes is an update check against the GitHub
        releases API.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-zinc-400">
        You do not have to take that on trust. The clipboard listener, the database schema and the
        encryption used for detected secrets are all public, and every release is built by a GitHub
        Actions workflow you can read — so you can compare what ships against how it was made. Each
        artifact is also published with a minisign signature you can verify yourself.
      </p>
    </section>

    <section className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight text-white">Questions</h2>
      <div className="mt-6 space-y-5">
        {openSourceFaqs.map((faq) => (
          <div key={faq.q} className="rounded-2xl border border-border bg-surface/70 p-5">
            <h3 className="text-base font-semibold text-white">{faq.q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>

    <nav aria-label="Ortu by platform" className="mt-16 border-t border-border pt-8">
      <h2 className="text-sm font-semibold text-white">Install Ortu</h2>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {platforms.map((p) => (
          <li key={p.slug}>
            <a href={`/${p.slug}`} className="text-sm text-zinc-400 transition-colors hover:text-white">
              Clipboard manager for {p.os}
            </a>
          </li>
        ))}
        <li>
          <a href="/" className="text-sm text-zinc-400 transition-colors hover:text-white">
            All features
          </a>
        </li>
      </ul>
    </nav>
  </PageShell>
);

export default OpenSourcePage;
