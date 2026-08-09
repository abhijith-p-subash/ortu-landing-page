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
        className="panel rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-3xl -z-10"></div>
        
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-sage text-bg mb-10 shadow-2xl shadow-sage/20">
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
