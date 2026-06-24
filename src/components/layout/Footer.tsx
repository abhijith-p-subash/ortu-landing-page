import { Github } from "lucide-react";

const links = [
  { href: "https://github.com/abhijith-p-subash/ortu/releases/latest", label: "Releases" },
  { href: "https://github.com/abhijith-p-subash/ortu/blob/main/CHANGELOG.md", label: "Changelog" },
  { href: "https://buymeacoffee.com/abhijithpsubash", label: "Support" },
];

const Footer = () => (
  <footer className="py-12 px-4 border-t border-border">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <p className="text-zinc-500 text-sm text-center md:text-left">
        © 2026 Ortu · Local-first clipboard manager · MIT licensed
      </p>
      <div className="flex items-center gap-6">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-white transition-colors text-sm"
          >
            {link.label}
          </a>
        ))}
        <a
          href="https://github.com/abhijith-p-subash/ortu"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ortu on GitHub"
          className="text-zinc-500 hover:text-white transition-colors"
        >
          <Github className="w-5 h-5" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
