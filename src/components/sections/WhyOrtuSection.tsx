import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const reasons = [
  {
    title: 'Performance King',
    description: 'Built with Rust + Tauri. Lower memory than your browser tab.',
  },
  {
    title: 'Developer Core',
    description: 'Prefix-based search and smart groups made for engineers.',
  },
  {
    title: 'Zero Bloat',
    description: 'No cloud sync, no tracking, just your clipboard history.',
  },
];

const WhyOrtuSection = () => (
  <section id="why" className="py-32 px-4 relative">
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-accent font-mono text-xs uppercase tracking-[0.4em] block mb-6">Why Ortu?</span>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[0.9]">
            The tool you<br />
            <span className="text-zinc-800 italic">actually need.</span>
          </h2>
          <p className="text-zinc-500 text-lg mb-12 max-w-md font-medium">
            Stop sacrificing your RAM for a simple clipboard manager. Switch to a native, high-performance solution.
          </p>
        </motion.div>

        <div className="space-y-6">
          {reasons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 glass rounded-[2rem] flex items-start gap-6 hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 border-white/20">
                <Check className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-2">{item.title}</h3>
                <p className="text-zinc-500 text-sm font-medium">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WhyOrtuSection;
