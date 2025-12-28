import { Github, Clipboard } from 'lucide-react';

const Footer = () => (
  <footer className="py-12 px-4 border-t border-[#333]">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-2 opacity-50">
         <Clipboard className="w-5 h-5 text-white" />
         <span className="font-bold text-white">Ortu</span>
      </div>
      <p className="text-zinc-600 text-sm">
        © 2025 Ortu Project. Built with Rust & Passion.
      </p>
      <div className="flex items-center gap-6">
        <a href="https://github.com/abhijithpsubash/ortu" className="text-zinc-500 hover:text-white transition-colors">
          <Github className="w-5 h-5" />
        </a>
        <a href="#" className="text-zinc-500 hover:text-white transition-colors">
          <span className="text-sm font-medium">Twitter</span>
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
