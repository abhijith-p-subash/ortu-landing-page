import { Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

const DonationSection = () => (
  <section className="py-32 px-4 border-t border-[#333]">
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-[#FFDD00]/20 to-[#FFDD00]/5 mb-8">
          <Coffee className="w-8 h-8 text-[#FFDD00]" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">Support Independent Development</h2>
        <p className="text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Ortu is free and open source. If it saves you time, consider buying me a coffee to keep the project alive.
        </p>
        
        <motion.a 
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          href="https://www.buymeacoffee.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-3 px-10 py-5 bg-[#FFDD00] hover:bg-[#FFCC00] text-black rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-[#FFDD00]/20 hover:shadow-[#FFDD00]/40"
        >
          <Coffee className="w-5 h-5" />
          Buy me a coffee
        </motion.a>
      </motion.div>
    </div>
  </section>
);

export default DonationSection;
