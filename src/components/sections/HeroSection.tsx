import { useState, useEffect } from "react";
import { Download, Github, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/abhijith-p-subash/ortu")
      .then((res) => res.json())
      .then((data) => {
        if (data.stargazers_count !== undefined) {
          setStars(data.stargazers_count);
        }
      })
      .catch((err) => console.error("Error fetching GitHub stars:", err));
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 px-4 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10 bg-[#020202]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_farthest-side_at_50%_0%,rgba(239,68,68,0.08),transparent)]"></div>
        <div className="absolute top-[20%] left-[10%] w-[40rem] h-[40rem] bg-accent/5 blur-[120px] rounded-full animate-pulse transition-all duration-1000"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[35rem] h-[35rem] bg-accent/5 blur-[120px] rounded-full animate-pulse transition-all duration-700"></div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Accent Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-10 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-accent text-[11px] font-bold uppercase tracking-[0.2em]">
              V1.0 is officially out
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-accent" />
          </motion.div>

          <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
            The CLI tool<br />
            <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-white/40 italic">
              for UI lovers.
            </span>
          </h1>

          <p className="text-zinc-500 text-xl md:text-2xl max-w-2xl mx-auto mb-16 leading-relaxed font-medium">
            A high-performance clipboard manager built with <span className="text-white hover:text-accent transition-colors">Rust</span> and <span className="text-white hover:text-accent transition-colors">Tauri</span>. 
            Fast, secure, and purely local.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-10 py-5 bg-white text-black rounded-full font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl shadow-white/10"
            >
              <Download className="w-5 h-5 group-hover:animate-bounce" />
              Download Ortu
              <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="https://github.com/abhijith-p-subash/ortu"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-10 py-5 bg-transparent border border-white/10 hover:border-white/30 text-white rounded-full font-bold flex items-center justify-center gap-3 transition-all duration-300"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
              <div className="w-px h-4 bg-white/10 group-hover:bg-white/30 mx-1"></div>
              <span className="font-mono text-zinc-400 group-hover:text-white transition-colors">
                {stars !== null ? stars : "..."} stars
              </span>
            </motion.a>
          </div>
        </motion.div>
      </div>
      
      {/* Floating Elements (Unique Touch) */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-20 opacity-20 hidden lg:flex">
        <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-white">SecurityFirst</span>
        <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-white">PerformanceNative</span>
        <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-white">ZeroTelemetry</span>
      </div>
    </section>
  );
};

export default HeroSection;
