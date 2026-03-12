import { motion } from "framer-motion";
import { Shield, Zap, LayoutGrid, Lock, Download, Command } from "lucide-react";

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
        <div className="mb-16" id="why">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Why Ortu?</h2>
          <p className="text-zinc-400 max-w-2xl">
            A focused clipboard manager with native performance, deterministic keyboard flows, and
            local-first privacy. The product language is built for developers and power users.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-auto md:auto-rows-[160px]"
        >
          <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-2 panel rounded-2xl p-8 flex flex-col justify-between group hover:border-accent/40 transition-colors relative overflow-hidden">
            <div className="absolute top-4 right-4 p-2 bg-primary rounded-lg">
              <LayoutGrid className="w-6 h-6 text-accent" />
            </div>
            <div className="space-y-2 z-10">
              <h3 className="text-2xl font-bold">Smart Groups</h3>
              <p className="text-zinc-500">Automatically organizes your clipboard into useful buckets.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 z-10">
              {["URLs", "Images", "Code", "Text"].map((tag) => (
                <div key={tag} className="bg-primary/70 text-xs px-3 py-2 rounded-md border border-border text-zinc-300">
                  {tag}
                </div>
              ))}
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-olive/10 rounded-full blur-3xl group-hover:bg-olive/20 transition-colors" />
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-2 panel rounded-2xl p-6 flex flex-col justify-between group hover:border-olive/50 transition-colors">
            <div className="p-3 bg-primary w-fit rounded-xl mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Zero Telemetry</h3>
              <p className="text-sm text-zinc-500">
                Your clipboard stays yours.
                <span className="block mt-2 text-white">100% local data storage.</span>
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1 panel rounded-2xl p-6 flex items-center justify-between group hover:border-olive/50 transition-colors">
            <div>
              <h3 className="font-bold text-lg text-olive">Cross-Platform</h3>
              <p className="text-xs text-zinc-500">macOS now, Windows/Linux next.</p>
            </div>
            <Zap className="w-8 h-8 text-olive opacity-80" />
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1 panel rounded-2xl p-6 flex items-center justify-between group hover:border-accent/50 transition-colors">
            <div>
              <h3 className="font-bold text-lg text-accent">MIT</h3>
              <p className="text-xs text-zinc-500">Open Source</p>
            </div>
            <Shield className="w-8 h-8 text-accent opacity-80" />
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-1 panel rounded-2xl p-6 flex items-center justify-between group hover:border-accent/50 transition-colors relative overflow-hidden">
            <div className="z-10">
              <h3 className="text-xl font-bold mb-1">Keyboard First</h3>
              <p className="text-zinc-500 text-sm">Fast access without a mouse.</p>
            </div>
            <div className="flex gap-2 z-10">
              <div className="px-2 py-1 bg-primary border border-border rounded text-xs font-mono text-zinc-300" title="macOS">⌥ + V</div>
              <div className="px-2 py-1 bg-primary border border-border rounded text-xs font-mono text-zinc-300" title="Windows/Linux">Alt + V</div>
            </div>
            <div className="absolute -right-4 -top-4 text-accent/10 rotate-12">
              <Command size={120} />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-1 panel rounded-2xl p-6 flex items-center gap-4 group hover:border-olive/50 transition-colors">
            <div className="p-3 bg-olive/15 rounded-full text-olive">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold bg-clip-text text-transparent bg-linear-to-r from-accent to-olive">Total Control</h3>
              <p className="text-sm text-zinc-500">Backups, import/restore, and text exports.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
