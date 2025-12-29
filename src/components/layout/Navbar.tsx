import { Github } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => (
  <nav className="fixed top-8 w-full z-50 px-4">
    <div className="max-w-4xl mx-auto glass rounded-full px-6 py-3 flex justify-between items-center shadow-2xl shadow-black/50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center ">
           <img className="w-full h-full object-contain" src="/app-icon.svg" alt="Ortu Logo" />
        </div>
        <span className="text-lg font-black text-white tracking-tighter">ORTU</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        {/* <a href="#features" className="text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">Features</a> */}
        <a href="#why" className="text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">Why?</a>
        <a 
          href="https://github.com/abhijith-p-subash/ortu" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-xs font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest"
        >
          <Github className="w-3.5 h-3.5" />
          Repo
        </a>
      </div>

      <motion.a 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href="#donate" 
        className="px-6 py-2 bg-white text-black rounded-full text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all duration-300 shadow-lg shadow-white/5 hover:shadow-accent/20"
      >
        Donate
      </motion.a>
    </div>
  </nav>
);

export default Navbar;
