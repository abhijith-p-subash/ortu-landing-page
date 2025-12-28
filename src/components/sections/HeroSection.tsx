import { motion } from "framer-motion";
import { Download, Github } from "lucide-react";

const HeroSection = () => {
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
          <span className="text-zinc-400">The missing piece of your macOS workflow.</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mt-12 w-full px-4">
           <a
              href="#" // Replace with actual download link if available
              className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 text-sm"
            >
              <Download className="w-4 h-4" />
              Download v1.0
            </a>
            <a
              href="https://github.com/abhijith-p-subash/ortu"
              target="_blank"
              rel="noopener noreferrer" 
              className="w-full sm:w-auto px-8 py-4 bg-secondary border border-border text-white rounded-full font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 text-sm"
            >
              <Github className="w-4 h-4" />
              Source Code
            </a>
        </div>
      </motion.div>

      {/* Abstract Minimal Visual */}
      <div className="absolute inset-x-0 bottom-0 h-96 bg-linear-to-t from-primary to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
