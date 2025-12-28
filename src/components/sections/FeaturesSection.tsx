import { motion } from 'framer-motion';
import { Shield, Zap, LayoutGrid, Lock, Download, Command } from 'lucide-react';

const FeaturesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-24 px-4 bg-primary text-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Why Ortu?</h2>
          <p className="text-zinc-500 max-w-xl">
            A complete rethink of how a clipboard manager should work. 
            Native performance on Windows, macOS, and Linux. Developer-focused features and zero fluff.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-auto md:auto-rows-[160px]"
        >
          {/* 1. Smart Groups - Large */}
          <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-2 bg-secondary border border-border rounded-2xl p-8 flex flex-col justify-between group hover:border-accent/40 transition-colors relative overflow-hidden">
             <div className="absolute top-4 right-4 p-2 bg-primary rounded-lg">
                <LayoutGrid className="w-6 h-6 text-accent" />
             </div>
             <div className="space-y-2 z-10">
               <h3 className="text-2xl font-bold">Smart Groups</h3>
               <p className="text-zinc-500">Automatically categorizes your clipboard.</p>
             </div>
             <div className="grid grid-cols-2 gap-2 mt-4 z-10">
                {['URLs', 'Images', 'Code', 'Text'].map(tag => (
                  <div key={tag} className="bg-primary/50 text-xs px-3 py-2 rounded-md border border-white/5 text-zinc-300">
                    {tag}
                  </div>
                ))}
             </div>
             {/* Abstract bg decoration */}
             <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors" />
          </motion.div>

          {/* 2. Privacy - Medium */}
          <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-2 bg-secondary border border-border rounded-2xl p-6 flex flex-col justify-between group hover:border-zinc-600 transition-colors">
            <div className="p-3 bg-primary w-fit rounded-xl mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Zero Telemetry</h3>
              <p className="text-sm text-zinc-500 text-balance">
                Your clipboard is personal. Ortu keeps it that way. 
                <span className="block mt-2 text-white">100% Local Storage.</span>
              </p>
            </div>
          </motion.div>

          {/* 3. Performance - Wide */}
          <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1 bg-secondary border border-border rounded-2xl p-6 flex items-center justify-between group hover:border-yellow-500/50 transition-colors">
            <div>
               <h3 className="font-bold text-lg text-yellow-500">Cross-Platform</h3>
               <p className="text-xs text-zinc-500">Works on everything.</p>
            </div>
            <Zap className="w-8 h-8 text-yellow-500 opacity-80" />
          </motion.div>

           {/* 4. Open Source - Wide */}
          <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1 bg-secondary border border-border rounded-2xl p-6 flex items-center justify-between group hover:border-green-500/50 transition-colors">
            <div>
               <h3 className="font-bold text-lg text-green-500">MIT</h3>
               <p className="text-xs text-zinc-500">Open Source</p>
            </div>
             <Shield className="w-8 h-8 text-green-500 opacity-80" />
          </motion.div>

          {/* 5. Shortcuts - Wide */}
           <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-1 bg-secondary border border-border rounded-2xl p-6 flex items-center justify-between group hover:border-purple-500/50 transition-colors relative overflow-hidden">
             <div className="z-10">
               <h3 className="text-xl font-bold mb-1">Keyboard First</h3>
               <p className="text-zinc-500 text-sm">Navigate without a mouse.</p>
             </div>
             <div className="flex gap-2 z-10">
                <div className="px-2 py-1 bg-primary border border-border rounded text-xs font-mono text-zinc-400">⌘+V</div>
                <div className="px-2 py-1 bg-primary border border-border rounded text-xs font-mono text-zinc-400">⌘+C</div>
             </div>
              <div className="absolute -right-4 -top-4 text-purple-500/10 rotate-12">
                 <Command size={120} />
              </div>
          </motion.div>

           {/* 6. Export/Backup */}
          <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-1 bg-secondary border border-border rounded-2xl p-6 flex items-center gap-4 group hover:border-blue-500/50 transition-colors">
            <div className="p-3 bg-blue-500/10 rounded-full text-blue-500">
               <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-blue-600">Total Control</h3>
              <p className="text-sm text-zinc-500">Full JSON Backups & TXT Export.</p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
