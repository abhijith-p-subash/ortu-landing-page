import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Download, Github, Loader2, Star, TerminalSquare } from "lucide-react";
import { useDownload } from "../../hooks/useDownload";
import StatsTerminal from "../ui/StatsTerminal";

// Only surface the counter once it reads as social proof rather than as a
// warning sign. Below this the hero simply stays quiet about it.
const DOWNLOAD_THRESHOLD = 100;

/** 597 -> "597", 1890 -> "1.8k", 12400 -> "12k". */
const formatDownloads = (count: number) => {
  if (count < 1000) return String(count);
  const thousands = count / 1000;
  return `${thousands < 10 ? thousands.toFixed(1) : Math.floor(thousands)}k`;
};

const HeroSection = () => {
  const {
    downloadUrl,
    version,
    os,
    isLoading,
    totalDownloads,
    stats,
    refresh,
    onDownloadClick
  } = useDownload();
  const [statsOpen, setStatsOpen] = useState(false);
  const repoUrl = `https://github.com/${import.meta.env.VITE_GITHUB_REPO}`;

  const getButtonText = () => {
    if (isLoading) return "Loading...";
    if (os === "windows") return `Download for Windows (${version})`;
    if (os === "linux") return `Download for Linux (${version})`;
    if (os === "mobile" || os === "unknown") return `Download (${version})`;
    return `Download for macOS (${version})`;
  };

  return (
    <section data-bird-zone="hero" className="grain relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 overflow-hidden">
      <div className="mesh pointer-events-none absolute inset-0 z-0" aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center z-10 w-full max-w-5xl mx-auto"
      >
        <h1 className="text-[20vw] md:text-[10rem] leading-none font-black tracking-tighter select-none bg-gradient-to-b from-white/75 via-white/45 to-white/[0.07] bg-clip-text text-transparent">
          <span aria-hidden="true">ORTU</span>
          <span className="sr-only">
            Ortu — free open-source clipboard manager for macOS, Windows and Linux
          </span>
        </h1>
        <div className="text-3xl md:text-6xl font-bold tracking-tight text-white -mt-4 md:-mt-16">
          Clipboard memory for people who move fast.
        </div>
        <p className="mt-7 text-base md:text-lg text-zinc-400 max-w-2xl mx-auto font-medium px-4 leading-relaxed">
          Native, local-first clipboard history with keyboard-first recall.
          Built with Rust + Tauri for fast startup and zero telemetry.
          <span className="text-xs text-zinc-500 mt-3 block uppercase tracking-widest">
            Available on macOS, Windows, and Linux
          </span>
        </p>

        <div className="flex flex-col items-center gap-5 mt-10 w-full px-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <a
              href={downloadUrl}
              rel="noopener noreferrer"
              onClick={onDownloadClick}
              data-bird-perch="primary"
              className="sheen w-full sm:w-auto px-8 py-4 bg-accent text-bg rounded-xl font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors flex items-center justify-center gap-3 text-sm min-w-[240px] shadow-[0_22px_48px_-14px_rgba(255,138,61,0.55)]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {getButtonText()}
            </a>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass w-full sm:w-auto px-8 py-4 text-white rounded-xl font-bold uppercase tracking-widest hover:border-white/15 transition-colors flex items-center justify-center gap-3 text-sm"
            >
              <Github className="w-4 h-4" />
              Source Code
            </a>
          </div>

          {/* Kept, but no longer a peer of Download — pointing at install
              friction before anyone has committed argued against the button
              right next to it. */}
          <a
            href="#download"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sage/80 hover:text-sage transition-colors"
          >
            Install steps
            <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
          </a>
        </div>

        {/* Star nudge.
            Deliberately placed under the buttons rather than made a button of
            its own: the download is the primary action and shouldn't have to
            share weight. The wording does the work — it states what the reader
            gets for free first (reciprocity), then gives an actual reason for
            the ask rather than just asking (people comply far more readily when
            a request carries a "because"), and names the cost so it reads as
            trivial. No star count: at this stage the number would argue against
            us, which is why the navbar pill hides it too. */}
        <p className="mt-1 mb-8 text-sm text-zinc-500 px-4">
          Free forever, no account, no telemetry. If Ortu earns a place in your setup,{' '}
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-zinc-300 underline decoration-zinc-700 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent/50"
          >
            <Star className="h-3.5 w-3.5" aria-hidden="true" />
            star it on GitHub
          </a>{' '}
          — it takes a second, and it&rsquo;s how other developers find it.
        </p>

        <div className="flex items-center justify-center flex-wrap gap-2 mt-2">
          {["macOS + Windows + Linux", "Local SQLite", "No Cloud Sync", "Option + V"].map(
            (tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-300 rounded-full border border-white/[0.07] bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
              >
                {tag}
              </span>
            )
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-2 my-8"
        >
          {!isLoading && totalDownloads >= DOWNLOAD_THRESHOLD && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setStatsOpen(true)}
              aria-haspopup="dialog"
              className="glass group flex items-center gap-2.5 px-4 py-2 rounded-full text-sm text-zinc-400 hover:text-zinc-200 hover:border-sage/40 transition-colors"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sage"></span>
              </span>
              <span className="font-medium text-zinc-200">
                {formatDownloads(totalDownloads)}+ installs
              </span>
              <span className="hidden sm:inline text-zinc-600">and counting</span>
              <span className="flex items-center gap-1.5 pl-2.5 border-l border-border text-[11px] font-mono uppercase tracking-widest text-zinc-500 group-hover:text-sage transition-colors">
                <TerminalSquare className="w-3.5 h-3.5" />
                stats
              </span>
            </motion.button>
          )}
        </motion.div>
      </motion.div>

      <div className="absolute -top-32 -right-32 w-96 h-96 bg-sage/[0.18] blur-[110px] rounded-full pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-14 left-0 right-0 h-72 bg-gradient-to-t from-bg via-bg/70 to-transparent pointer-events-none" />

      <StatsTerminal
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        stats={stats}
        version={version}
        releasesUrl={`${repoUrl}/releases`}
        refresh={refresh}
      />
    </section>
  );
};

export default HeroSection;
