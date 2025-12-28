import { motion } from 'framer-motion';
import { Zap, Shield, Search, Layers, Cpu, CloudOff } from 'lucide-react';
import FeatureCard from '../ui/FeatureCard';

const features = [
  {
    icon: Zap,
    title: 'Instant Sync',
    description: 'Lightning-fast clipboard synchronization with native OS hooks in Rust.',
    className: 'md:col-span-2'
  },
  {
    icon: Shield,
    title: 'Local Privacy',
    description: 'Your data stays on your metal. Always. No cloud, no tracking.',
    className: 'md:col-span-1'
  },
  {
    icon: Search,
    title: 'Pro Search',
    description: 'Advanced prefix-based search to find anything in milliseconds.',
    className: 'md:col-span-1'
  },
  {
    icon: Layers,
    title: 'Smart Groups',
    description: 'Automatically categorize your snippets by type: code, colors, or links.',
    className: 'md:col-span-2'
  }
];

const FeaturesSection = () => (
  <section id="features" className="py-32 px-4 bg-primary relative overflow-hidden">
    <div className="max-w-6xl mx-auto relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-xl"
        >
          <span className="text-accent font-mono text-xs uppercase tracking-[0.4em] block mb-4">Capabilities</span>
          <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9]">
            Engineered for<br />
            <span className="text-zinc-800">Productivity.</span>
          </h2>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-zinc-500 text-lg max-w-xs font-medium"
        >
          Everything you need in a modern clipboard manager, stripped of the bloat.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
