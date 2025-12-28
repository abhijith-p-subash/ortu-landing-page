import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -8, scale: 1.02 }}
    transition={{ duration: 0.3 }}
    className="group p-8 bg-secondary/50 backdrop-blur-sm border border-[#333] rounded-3xl hover:border-accent/30 hover:bg-secondary/80 transition-all duration-300"
  >
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 group-hover:from-accent/30 group-hover:to-accent/10 flex items-center justify-center mb-6 transition-all duration-300">
      <Icon className="w-7 h-7 text-accent group-hover:scale-110 transition-transform duration-300" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent/90 transition-colors">{title}</h3>
    <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

export default FeatureCard;
