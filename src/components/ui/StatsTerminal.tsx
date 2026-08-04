import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import type { DownloadStats } from "../../hooks/useLatestRelease";
import Kbd from "./Kbd";

const COMMAND = "ortu stats --all-time";
const TYPE_SPEED = 26; // ms per character
const LINE_SPEED = 55; // ms between output lines
const BAR_WIDTH = 18;
const ALL_LINES = Number.MAX_SAFE_INTEGER;
// Keep the request line on screen long enough to read even on a fast network.
const MIN_FETCH_MS = 650;

/** Renders an ASCII meter, never showing an empty bar for a non-zero value. */
const bar = (value: number, max: number) => {
  if (!max || value <= 0) return "░".repeat(BAR_WIDTH);
  const filled = Math.max(1, Math.round((value / max) * BAR_WIDTH));
  return "█".repeat(filled) + "░".repeat(BAR_WIDTH - filled);
};

const share = (value: number, total: number) =>
  total ? `${((value / total) * 100).toFixed(1)}%` : "0.0%";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Counts from 0 up to `target` once the line holding it is revealed. */
const useCountUp = (target: number, active: boolean, reduced: boolean) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active || reduced) return;

    const duration = 700;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      // Ease-out so the number lands softly instead of stopping dead.
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, reduced]);

  if (!active) return 0;
  return reduced ? target : value;
};

interface TerminalProps {
  onClose: () => void;
  stats: DownloadStats;
  version: string;
  releasesUrl: string;
  /** Re-fetches from GitHub so the numbers on screen are genuinely live. */
  refresh: () => void | Promise<void>;
}

/**
 * The terminal body. Mounted only while open so every run starts from a clean
 * slate — no effect has to reset the typing or streaming state.
 */
const TerminalWindow = ({
  onClose,
  stats,
  version,
  releasesUrl,
  refresh
}: TerminalProps) => {
  const [reduced] = useState(prefersReducedMotion);
  const [typed, setTyped] = useState(() => (reduced ? COMMAND.length : 0));
  const [revealed, setRevealed] = useState(() => (reduced ? ALL_LINES : 0));
  const [isFetching, setIsFetching] = useState(true);
  const dialogRef = useRef<HTMLDivElement>(null);

  const typingDone = typed >= COMMAND.length;

  // Ask GitHub for fresh numbers every time the terminal is opened.
  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();

    Promise.resolve(refresh()).finally(() => {
      const elapsed = Date.now() - startedAt;
      const settle = setTimeout(() => {
        if (!cancelled) setIsFetching(false);
      }, Math.max(0, MIN_FETCH_MS - elapsed));
      if (cancelled) clearTimeout(settle);
    });

    return () => {
      cancelled = true;
    };
  }, [refresh]);

  // Type the command out one character at a time.
  useEffect(() => {
    if (reduced) return;
    const typer = setInterval(() => {
      setTyped((n) => {
        if (n >= COMMAND.length) {
          clearInterval(typer);
          return n;
        }
        return n + 1;
      });
    }, TYPE_SPEED);

    return () => clearInterval(typer);
  }, [reduced]);

  // Then stream the output lines in.
  useEffect(() => {
    if (reduced || !typingDone) return;
    // Runs past the last line; the render clamps, so overshoot is harmless.
    const streamer = setInterval(() => setRevealed((n) => n + 1), LINE_SPEED);
    return () => clearInterval(streamer);
  }, [reduced, typingDone]);

  const skipAhead = () => {
    setTyped(COMMAND.length);
    setRevealed(ALL_LINES);
  };

  // Escape closes, Enter opens the releases page, anything else skips ahead.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "Enter") {
        window.open(releasesUrl, "_blank", "noopener,noreferrer");
        return;
      }
      setTyped(COMMAND.length);
      setRevealed(ALL_LINES);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, releasesUrl]);

  // Keep the page behind the overlay still while it is up.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const topReleases = useMemo(
    () => stats.releases.filter((r) => r.downloads > 0).slice(0, 6),
    [stats.releases]
  );

  const maxPlatform = Math.max(1, ...stats.platforms.map((p) => p.downloads));
  const maxRelease = Math.max(1, ...topReleases.map((r) => r.downloads));

  // Line indices, so each block streams in at the right moment.
  const TOTAL_LINE = 3;
  const PLATFORM_START = 4;
  const releaseStart = PLATFORM_START + stats.platforms.length + 2;
  const footerLine = releaseStart + topReleases.length + 1;

  const total = useCountUp(stats.total, revealed >= TOTAL_LINE, reduced);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Ortu download statistics"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        onClick={(event) => {
          event.stopPropagation();
          skipAhead();
        }}
        className="w-full max-w-2xl rounded-2xl border border-border bg-[#0b0d11] shadow-2xl shadow-black/60 overflow-hidden outline-none"
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface/80">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="flex-1 text-center font-mono text-[11px] text-zinc-500 tracking-wider">
            ortu — download stats
          </span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
            aria-label="Close stats"
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Output */}
        <div className="p-5 sm:p-6 font-mono text-[11px] sm:text-xs leading-relaxed overflow-x-auto custom-scrollbar">
          <div className="min-w-[19rem]">
            <div className="text-zinc-300">
              <span className="text-sage">➜</span>{" "}
              <span className="text-accent">~</span> {COMMAND.slice(0, typed)}
              {!typingDone && (
                <span className="inline-block w-2 h-3.5 -mb-0.5 bg-accent animate-pulse" />
              )}
            </div>

            {revealed >= 1 && (
              <div className="mt-2 text-zinc-600">
                GET api.github.com/repos/…/releases{" "}
                {isFetching ? (
                  <span className="text-zinc-500">· fetching…</span>
                ) : (
                  <span className="text-sage">
                    · 200 OK · {stats.releaseCount} releases
                  </span>
                )}
              </div>
            )}

            {revealed >= TOTAL_LINE && (
              <div className="mt-5 flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
                  {total.toLocaleString()}
                </span>
                <span className="text-zinc-500 uppercase tracking-widest text-[10px]">
                  all-time installs
                </span>
              </div>
            )}

            {revealed >= PLATFORM_START && (
              <div className="mt-5 text-zinc-600 uppercase tracking-widest text-[10px]">
                by platform
              </div>
            )}

            <div className="mt-1.5 space-y-0.5">
              {stats.platforms.map((platform, index) =>
                revealed >= PLATFORM_START + index + 1 ? (
                  <div
                    key={platform.key}
                    className="flex items-center gap-3 text-zinc-400"
                  >
                    <span className="w-16 shrink-0 text-zinc-300">
                      {platform.label}
                    </span>
                    <span className="text-accent tracking-[-0.05em]">
                      {bar(platform.downloads, maxPlatform)}
                    </span>
                    <span className="w-12 shrink-0 text-right text-white tabular-nums">
                      {platform.downloads.toLocaleString()}
                    </span>
                    <span className="w-12 shrink-0 text-right text-zinc-600 tabular-nums">
                      {share(platform.downloads, stats.total)}
                    </span>
                  </div>
                ) : null
              )}
            </div>

            {revealed >= releaseStart && (
              <div className="mt-5 text-zinc-600 uppercase tracking-widest text-[10px]">
                by release
              </div>
            )}

            <div className="mt-1.5 space-y-0.5">
              {topReleases.map((release, index) =>
                revealed >= releaseStart + index + 1 ? (
                  <div
                    key={release.tag}
                    className="flex items-center gap-3 text-zinc-400"
                  >
                    <span className="w-16 shrink-0 text-zinc-300">
                      {release.tag}
                    </span>
                    <span className="text-sage tracking-[-0.05em]">
                      {bar(release.downloads, maxRelease)}
                    </span>
                    <span className="w-12 shrink-0 text-right text-white tabular-nums">
                      {release.downloads.toLocaleString()}
                    </span>
                    <span className="w-12 shrink-0 text-right text-zinc-600">
                      {release.tag === version ? "latest" : ""}
                    </span>
                  </div>
                ) : null
              )}
            </div>

            {revealed >= footerLine && (
              <p className="mt-5 text-zinc-600 leading-relaxed">
                # counts .dmg .msi .exe .AppImage .deb .rpm only —
                <br /># update checks and signature files are not installs.
              </p>
            )}

            {revealed >= footerLine + 1 && (
              <a
                href={releasesUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="mt-4 inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors group"
              >
                <span className="text-sage">➜</span>
                <span className="underline decoration-dotted underline-offset-4">
                  open releases on github
                </span>
                <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
              </a>
            )}
          </div>
        </div>

        {/* Hint bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-3 border-t border-border bg-surface/60 text-[10px] uppercase tracking-widest text-zinc-500">
          <span className="flex items-center gap-1.5">
            <Kbd className="!h-5 !min-w-[1.25rem] !text-[9px]">↵</Kbd>
            releases
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd className="!h-5 !min-w-[1.25rem] !text-[9px]">esc</Kbd>
            close
          </span>
          <span className="hidden sm:inline text-zinc-600">
            live from the github api
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const StatsTerminal = ({
  open,
  ...props
}: TerminalProps & { open: boolean }) => (
  <AnimatePresence>{open && <TerminalWindow {...props} />}</AnimatePresence>
);

export default StatsTerminal;
