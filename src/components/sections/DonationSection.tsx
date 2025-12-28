import { Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

const DonationSection = () => (
  <section id="donate" className="py-32 px-4 relative">
    <div className="max-w-4xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
      >
        {/* Accent Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFDD00]/10 blur-3xl -z-10"></div>
        
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-[#FFDD00] text-black mb-10 shadow-2xl shadow-[#FFDD00]/20">
          <Coffee className="w-10 h-10" />
        </div>
        
        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">Support the craft.</h2>
        <p className="text-zinc-500 mb-12 max-w-xl mx-auto text-lg leading-relaxed font-medium">
          Ortu is free and open source. If it makes your digital life better, consider fueling the development with a coffee.
        </p>
        
        <motion.a 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          href="https://www.buymeacoffee.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-accent hover:text-white text-black rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 shadow-lg shadow-black/20"
        >
          <Coffee className="w-5 h-5" />
          Buy me a coffee
        </motion.a>
      </motion.div>
    </div>
  </section>
);

export default DonationSection;
