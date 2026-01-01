import { motion } from "framer-motion";
import { Download, Github, Loader2 } from "lucide-react";
import { useLatestRelease } from "../../hooks/useLatestRelease";

const HeroSection = () => {
  const { downloadUrl, version, os, isLoading } = useLatestRelease();
  const repoUrl = `https://github.com/${import.meta.env.VITE_GITHUB_REPO}`;

  const getButtonText = () => {
    if (isLoading) return "Loading...";
    if (os === "mac") return `Download for macOS (${version})`;
    
    // For other platforms, we show they can download the Mac version, 
    // but we can also just say "Download for macOS" to be explicit about what they are getting.
    // Or if we want to be "cool", just "Download App" and the message explains the rest.
    // User request: "alow users to download mac file evern if windows and linux"
    return `Download for macOS (${version})`;
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center z-10 w-full max-w-4xl mx-auto"
      >
        <h1 className="text-[20vw] md:text-[12rem] leading-none font-black tracking-tighter text-white select-none mix-blend-overlay opacity-50">
          ORTU
        </h1>
        <div className="text-3xl md:text-6xl font-bold tracking-tight text-white -mt-4 md:-mt-20 mix-blend-normal">
          The Clipboard <span className="text-accent">Manager</span>
        </div>
        <p className="mt-8 text-lg md:text-xl text-zinc-500 max-w-lg mx-auto font-medium px-4">
          Native. Private. Keyboard-centric. <br className="hidden md:block" />
          <span className="text-zinc-400">The missing piece of your workflow.</span>
          <br className="hidden md:block" />
          <span className="text-sm text-zinc-600 mt-2 block uppercase tracking-widest">macOS · Windows & Linux (Coming Soon)</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mt-12 w-full px-4 mb-8">
           <a
              href={downloadUrl}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 text-sm min-w-[200px]"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {getButtonText()}
            </a>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer" 
              className="w-full sm:w-auto px-8 py-4 bg-secondary border border-border text-white rounded-full font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 text-sm"
            >
              <Github className="w-4 h-4" />
              Source Code
            </a>
        </div>

        {os !== 'mac' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Cooking up Windows & Linux versions. Let us cook!
          </motion.div>
        )}

      </motion.div>

      {/* Abstract Minimal Visual */}
      <div className="absolute inset-x-0 bottom-0 h-96 bg-linear-to-t from-primary to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
