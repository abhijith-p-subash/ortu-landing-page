const competitors = [
  {
    name: "ORTU",
    tagline: "Cross-platform, local-first, open source",
    platforms: "macOS, Windows, Linux",
    privacy: "100% local storage, zero telemetry",
    workflow: "Keyboard-first recall, smart groups",
    automation: "Focused core workflow",
    bestFor: "Developers and privacy-conscious power users",
    score: "4.6/5",
    featured: true
  },
  {
    name: "CopyQ",
    tagline: "Deep scripting and customization",
    platforms: "macOS, Windows, Linux",
    privacy: "Local-first with extensive controls",
    workflow: "Tabs, commands, automation",
    automation: "Advanced scripting and command hooks",
    bestFor: "Technical users who want maximum control",
    score: "4.5/5"
  },
  {
    name: "Paste",
    tagline: "Premium Apple-first experience",
    platforms: "macOS, iPhone, iPad",
    privacy: "Cloud sync available",
    workflow: "Visual timeline, polished search",
    automation: "Light productivity features",
    bestFor: "Apple users who want polish and sync",
    score: "4.2/5"
  },
  {
    name: "Ditto",
    tagline: "Classic Windows clipboard manager",
    platforms: "Windows",
    privacy: "Local history with optional sync",
    workflow: "Searchable history and shortcuts",
    automation: "Basic customization",
    bestFor: "Windows users who want a proven utility",
    score: "3.9/5"
  },
  {
    name: "Maccy",
    tagline: "Minimal and fast on Mac",
    platforms: "macOS",
    privacy: "Local-first and open source",
    workflow: "Lightweight keyboard access",
    automation: "Minimal",
    bestFor: "Mac users who want simplicity",
    score: "3.8/5"
  }
];

const featureRows = [
  { label: "Cross-platform desktop support", ortu: "5/5", competitors: "CopyQ 5/5 · Paste 2/5 · Ditto 1/5 · Maccy 1/5" },
  { label: "Privacy and local-first design", ortu: "5/5", competitors: "CopyQ 4/5 · Paste 4/5 · Ditto 4/5 · Maccy 5/5" },
  { label: "Keyboard-first speed", ortu: "5/5", competitors: "CopyQ 5/5 · Paste 4/5 · Ditto 4/5 · Maccy 5/5" },
  { label: "Smart organization", ortu: "4/5", competitors: "CopyQ 5/5 · Paste 5/5 · Ditto 3/5 · Maccy 2/5" },
  { label: "Automation depth", ortu: "3/5", competitors: "CopyQ 5/5 · Paste 2/5 · Ditto 3/5 · Maccy 1/5" },
  { label: "Open-source trust", ortu: "5/5", competitors: "CopyQ 5/5 · Paste 0/5 · Ditto 5/5 · Maccy 5/5" }
];

const ComparisonSection = () => {
  return (
    <section id="compare" className="py-24 px-4 bg-primary text-white content-auto">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mb-12">
          <span className="inline-flex items-center rounded-full border border-olive/30 bg-olive/10 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-olive">
            Competitive Snapshot
          </span>
          <h2 className="mt-5 text-4xl font-bold tracking-tight">How ORTU stacks up</h2>
          <p className="mt-4 text-zinc-400 leading-relaxed">
            ORTU is built as a real cross-platform clipboard manager for macOS, Windows, and Linux.
            Compared with the most recognizable clipboard tools in the market, it aims to combine
            local-first privacy, fast keyboard recall, and a cleaner modern workflow.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-secondary/70 shadow-2xl shadow-black/30">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-border bg-white/[0.03]">
                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-500">Product</th>
                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-500">Platforms</th>
                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-500">Privacy</th>
                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-500">Workflow</th>
                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-500">Best For</th>
                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-500">Rating</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((competitor) => (
                  <tr
                    key={competitor.name}
                    className={competitor.featured ? "border-b border-border/80 bg-accent/8" : "border-b border-border/60"}
                  >
                    <td className="px-5 py-5 align-top">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-bold text-white">{competitor.name}</div>
                          <div className="text-sm text-zinc-400">{competitor.tagline}</div>
                        </div>
                        {competitor.featured && (
                          <span className="rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                            ORTU
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-5 align-top text-sm text-zinc-300">{competitor.platforms}</td>
                    <td className="px-5 py-5 align-top text-sm text-zinc-300">{competitor.privacy}</td>
                    <td className="px-5 py-5 align-top text-sm text-zinc-300">
                      <div>{competitor.workflow}</div>
                      <div className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-500">{competitor.automation}</div>
                    </td>
                    <td className="px-5 py-5 align-top text-sm text-zinc-300">{competitor.bestFor}</td>
                    <td className="px-5 py-5 align-top">
                      <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm font-bold text-white">
                        {competitor.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {featureRows.map((row) => (
            <div key={row.label} className="panel rounded-2xl p-5">
              <div className="text-sm font-bold text-white">{row.label}</div>
              <div className="mt-3 flex items-center gap-3">
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white">
                  ORTU {row.ortu}
                </span>
                <span className="text-sm text-zinc-400">{row.competitors}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-zinc-500">
          Ratings are directional product-positioning scores designed for fast comparison, not exhaustive certification.
        </p>
      </div>
    </section>
  );
};

export default ComparisonSection;
