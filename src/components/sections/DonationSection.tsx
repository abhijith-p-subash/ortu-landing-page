import { Coffee } from 'lucide-react';
import { motion } from 'framer-motion';
import BuyMeACoffeeButton from '../ui/BuyMeACoffeeButton';

const DonationSection = () => (
  <section id="donate" className="py-32 px-4 relative content-auto">
    <div className="max-w-4xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="edge-accent grain panel rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-[0_50px_110px_-50px_rgba(0,0,0,1)]"
      >
        <div className="pointer-events-none absolute -top-16 -right-16 w-80 h-80 rounded-full bg-accent/[0.14] blur-[90px]" aria-hidden="true"></div>
        <div className="pointer-events-none absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-sage/[0.10] blur-[100px]" aria-hidden="true"></div>
        
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-b from-[#c3c7a6] to-sage text-bg mb-10 shadow-[0_24px_50px_-18px_rgba(174,178,145,0.55),inset_0_1px_0_0_rgba(255,255,255,0.4)]">
          <Coffee className="w-10 h-10" />
        </div>
        
        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">Support the craft.</h2>
        <p className="text-zinc-400 mb-12 max-w-xl mx-auto text-lg leading-relaxed font-medium">
          Ortu is free and open source. If it makes your digital life better, consider fueling the development with a coffee.
        </p>
        
        <BuyMeACoffeeButton />

        <div className="mt-10 flex flex-col items-center gap-3">
          <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
            Or support it for free
          </p>
          <a
            href="https://www.producthunt.com/products/ortu?utm_source=badge-follow&utm_medium=badge&utm_source=badge-ortu"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-80 hover:opacity-100 transition-opacity"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/follow.svg?product_id=1266640&theme=light"
              alt="Ortu - The clipboard manager for people who copy-paste for a living | Product Hunt"
              width="200"
              height="43"
              loading="lazy"
              className="w-[200px] h-[43px]"
            />
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default DonationSection;
