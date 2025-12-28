import { Github, Coffee, Clipboard } from 'lucide-react';

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 bg-primary/80 backdrop-blur-md border-b border-[#333]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
             <Clipboard className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Ortu</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm font-medium hover:text-white transition-colors">Features</a>
          <a href="#why" className="text-sm font-medium hover:text-white transition-colors">Why Ortu?</a>
          <a href="https://github.com/abhijithpsubash/ortu" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-white transition-colors flex items-center gap-2">
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <a href="https://www.buymeacoffee.com" target="_blank" rel="noopener noreferrer" className="bg-secondary border border-[#333] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#333] transition-all flex items-center gap-2">
            <Coffee className="w-4 h-4 text-accent" />
            Donate
          </a>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
