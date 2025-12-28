import { motion } from 'framer-motion';

const WhyOrtuSection = () => (
  <section id="why" className="py-32 px-4 border-t border-[#333]">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How we differ</h2>
        <p className="text-zinc-400">What makes Ortu unique</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Ultra Lightweight',
            description: 'Most managers are Electron-based and consume hundreds of MBs. Ortu is built with Rust and Tauri, staying under 50MB.',
          },
          {
            title: 'Developer Focused',
            description: 'Smart groups for Shell, Docker, and Code snippets out of the box. Search with prefixes like `group:Dev`.',
          },
          {
            title: '100% Open Source',
            description: 'No hidden tracking, no telemetry. Audit the code, build it yourself, or contribute to the community.',
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative p-8 bg-gradient-to-br from-secondary/50 to-transparent border border-[#333] hover:border-accent/30 rounded-3xl transition-all duration-300 hover:bg-secondary/30"
          >
            <div className="absolute -top-3 -left-3 w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center backdrop-blur-sm border border-green-500/20">
              <span className="text-green-500 font-bold text-xl">✓</span>
            </div>
            <h4 className="text-white font-bold text-xl mb-3 mt-4 group-hover:text-accent/90 transition-colors">{item.title}</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">{item.description}</p>
          </motion.div>
        ))
}
      </div>
    </div>
  </section>
);

export default WhyOrtuSection;
