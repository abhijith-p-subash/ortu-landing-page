import { motion } from "framer-motion";
import { ArrowDown, Download, Github, Loader2 } from "lucide-react";
import { useLatestRelease } from "../../hooks/useLatestRelease";

const HeroSection = () => {
  const { downloadUrl, version, os, isLoading, totalDownloads } = useLatestRelease();
  const repoUrl = `https://github.com/${import.meta.env.VITE_GITHUB_REPO}`;

  const getButtonText = () => {
    if (isLoading) return "Loading...";
    if (os === "windows") return `Download for Windows (${version})`;
    if (os === "linux") return `Download for Linux (${version})`;
    return `Download for macOS (${version})`;
  };

  const handleDownloadClick = () => {
    if (os !== "mac") return;
    sessionStorage.setItem("ortu_requires_mac_steps", "true");
    window.dispatchEvent(new Event("ortu:dmg-download"));
    document.getElementById("download")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center z-10 w-full max-w-5xl mx-auto"
      >
        <h1 className="text-[20vw] md:text-[10rem] leading-none font-black tracking-tighter text-white/55 select-none">
          ORTU
        </h1>
        <div className="text-3xl md:text-6xl font-bold tracking-tight text-white -mt-4 md:-mt-16">
          Clipboard memory for people who move fast.
        </div>
        <p className="mt-7 text-base md:text-lg text-zinc-400 max-w-2xl mx-auto font-medium px-4 leading-relaxed">
          Native, local-first clipboard history with keyboard-first recall.
          Built with Rust + Tauri for fast startup and zero telemetry.
          <span className="text-xs text-zinc-500 mt-3 block uppercase tracking-widest">Available on macOS, Windows, and Linux</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5 mt-10 w-full px-4 mb-6">
           <a
              href={downloadUrl}
              rel="noopener noreferrer"
              onClick={handleDownloadClick}
              className="w-full sm:w-auto px-8 py-4 bg-accent text-white rounded-xl font-bold uppercase tracking-widest hover:bg-accent-hover transition-all flex items-center justify-center gap-3 text-sm min-w-[240px] shadow-lg shadow-accent/25"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {getButtonText()}
            </a>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer" 
              className="w-full sm:w-auto px-8 py-4 bg-secondary border border-border text-white rounded-xl font-bold uppercase tracking-widest hover:bg-surface transition-all flex items-center justify-center gap-3 text-sm"
            >
              <Github className="w-4 h-4" />
              Source Code
            </a>
            <a
              href="#download"
              className="w-full sm:w-auto px-6 py-4 bg-olive/15 border border-olive/40 text-olive rounded-xl font-bold uppercase tracking-widest hover:bg-olive/20 transition-all flex items-center justify-center gap-2 text-sm"
            >
              Install Steps
              <ArrowDown className="w-4 h-4" />
            </a>
        </div>

        <div className="flex items-center justify-center flex-wrap gap-2 mt-2">
          {["macOS + Windows + Linux", "Local SQLite", "No Cloud Sync", "Option + V"].map((tag) => (
            <span key={tag} className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-300 rounded-full bg-[#202328]/70 border border-border">
              {tag}
            </span>
          ))}
        </div>

        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-2 my-8"
        >
             {!isLoading && new URLSearchParams(window.location.search).get('stats') === 'true' && (
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    <span className="flex h-2 w-2 relative">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="font-medium text-zinc-300">{totalDownloads}+ Downloads</span>
                </div>
            )}
        </motion.div>

      </motion.div>

      <div className="absolute -top-24 -right-24 w-72 h-72 bg-olive/15 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-14 left-0 right-0 h-72 bg-gradient-to-t from-primary via-primary/70 to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
