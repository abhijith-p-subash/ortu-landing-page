import { motion } from "framer-motion";
import { Zap, Shield, Cpu, Database } from "lucide-react";

const TechStackSection = () => {
  const techs = [
    {
      icon: <Cpu className="w-6 h-6" />,
      name: "Rust",
      description: "Blazingly fast backend with memory safety guaranteed at compile time.",
      color: "text-orange-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      name: "Tauri",
      description: "Native OS integration with a tiny footprint, leaving Electron in the dust.",
      color: "text-blue-400"
    },
    {
      icon: <Database className="w-6 h-6" />,
      name: "SQLite",
      description: "Local-first storage ensures your data never leaves your machine.",
      color: "text-sky-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      name: "SvelteKit",
      description: "Reactive UI with minimal overhead, providing a smooth user experience.",
      color: "text-red-500"
    }
  ];

  return (
    <section className="py-32 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Built for <span className="text-accent italic">Peak</span> Performance
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-lg max-w-2xl mx-auto"
          >
            Leveraging the modern system-level technologies to provide a clipboard experience that is both powerful and lightweight.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {techs.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 bg-[#0a0a0a] border border-zinc-900 rounded-3xl hover:border-accent/30 transition-all duration-500"
            >
              <div className={`mb-6 p-3 rounded-2xl bg-[#0f0f0f] w-fit ${tech.color} group-hover:scale-110 transition-transform duration-500`}>
                {tech.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{tech.name}</h3>
              <p className="text-zinc-500 leading-relaxed text-sm">
                {tech.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
