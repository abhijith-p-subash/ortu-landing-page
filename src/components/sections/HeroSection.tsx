import { Download, Github } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => (
  <section className="relative pt-40 pb-32 px-4 overflow-hidden">
    {/* Background gradients */}
    <div className="absolute inset-0 -z-10">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 blur-[120px] rounded-full"></div>
    </div>

    <div className="max-w-5xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center px-4 py-1.5 bg-accent/5 text-accent text-xs font-semibold uppercase tracking-wider rounded-full mb-8 border border-accent/10 backdrop-blur-sm"
        >
          Open Source • Minimalist • Rust-Powered
        </motion.span>

        <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight mb-10 leading-[1.1]">
          Your clipboard,
          <br />
          <span className="bg-gradient-to-r from-accent via-red-400 to-accent bg-clip-text text-transparent">
            reimagined.
          </span>
        </h1>

        <p className="text-zinc-400 text-xl md:text-2xl max-w-3xl mx-auto mb-14 leading-relaxed font-light">
          A lightweight clipboard manager built for developers.
          <br className="hidden md:block" />
          Fast. Local. Distraction-free.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group w-full sm:w-auto px-10 py-5 bg-accent hover:bg-accent-hover text-white rounded-2xl font-semibold flex items-center justify-center gap-3 shadow-lg shadow-accent/25 transition-all duration-300 hover:shadow-accent/40"
          >
            <Download className="w-5 h-5 group-hover:animate-bounce" />
            Download for macOS
          </motion.button>

          <motion.a
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href="https://github.com/abhijithpsubash/ortu"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-[#333] hover:border-accent/30 hover:bg-accent/5 text-white rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300"
          >
            <Github className="w-5 h-5" />
            View on GitHub
          </motion.a>
        </motion.div>

        {/* Floating feature badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-20 text-sm text-zinc-500"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Rust Backend</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-zinc-700"></div>
          <div className="flex items-center gap-2">
            <span>⌥ + V Hotkey</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-zinc-700"></div>
          <div className="flex items-center gap-2">
            <span>Privacy First</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
