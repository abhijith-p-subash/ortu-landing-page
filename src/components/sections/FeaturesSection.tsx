import { Clipboard, Layers, Zap, Share2, Shield, Keyboard } from 'lucide-react';
import { motion } from 'framer-motion';
import FeatureCard from '../ui/FeatureCard';

const FeaturesSection = () => (
  <section id="features" className="py-32 px-4">
    <div className="max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          Everything you need,<br />
          nothing you don't.
        </h2>
        <p className="text-zinc-400 text-lg">Fast, local, and incredibly simple.</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard 
          icon={Clipboard} 
          title="History Tracking" 
          description="Automatically tracks text and image copies securely in a local SQLite database."
        />
        <FeatureCard 
          icon={Layers} 
          title="Smart Grouping" 
          description="Organize snippets into custom categories. Use groups like 'Work', 'Snippets', or 'Cloud'."
        />
        <FeatureCard 
          icon={Zap} 
          title="Direct Paste" 
          description="Paste items instantly into your active window with a single click or keypress."
        />
        <FeatureCard 
          icon={Share2} 
          title="Data Portability" 
          description="Easily backup and restore your data via JSON or export groups as TXT files."
        />
        <FeatureCard 
          icon={Shield} 
          title="Privacy First" 
          description="Your data never leaves your machine. Local-only storage ensures maximum security."
        />
        <FeatureCard 
          icon={Keyboard} 
          title="Hotkey Driven" 
          description="Toggle the stealth popup with custom shortcuts. Designed for a keyboard-first workflow."
        />
      </div>
    </div>
  </section>
);

export default FeaturesSection;
