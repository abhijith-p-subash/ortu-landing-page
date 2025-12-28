import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string; // For bento grid flexibility
}

const FeatureCard = ({ icon: Icon, title, description, className = "" }: FeatureCardProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    transition={{ duration: 0.4 }}
    className={`group p-8 glass rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5 ${className}`}
  >
    <div className="w-16 h-16 rounded-[1.5rem] bg-white text-black flex items-center justify-center mb-8 shadow-xl shadow-black/20 group-hover:scale-110 transition-transform duration-500">
      <Icon className="w-8 h-8 group-hover:text-accent transition-colors duration-500" />
    </div>
    <h3 className="text-2xl font-black text-white mb-4 leading-tight">{title}</h3>
    <p className="text-zinc-500 text-base leading-relaxed font-medium">{description}</p>
  </motion.div>
);

export default FeatureCard;
