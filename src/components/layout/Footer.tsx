import { Github } from 'lucide-react';

const Footer = () => (
  <footer className="py-12 px-4 border-t border-border">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <p className="text-zinc-500 text-sm">
        © 2026 Ortu Project. Local-first clipboard manager.
      </p>
      <div className="flex items-center gap-6">
        <a href="https://github.com/abhijith-p-subash/ortu" className="text-zinc-500 hover:text-accent transition-colors">
          <Github className="w-5 h-5" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
