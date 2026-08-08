import { Github } from "lucide-react";

const links = [
  { href: "https://github.com/abhijith-p-subash/ortu/releases/latest", label: "Releases" },
  { href: "https://github.com/abhijith-p-subash/ortu/blob/main/CHANGELOG.md", label: "Changelog" },
  { href: "https://buymeacoffee.com/abhijithpsubash", label: "Support" },
];

const policyLinks = [
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/code-signing-policy", label: "Code signing" },
];

// Site-wide links to the platform pages. Beyond being useful, this is how
// crawlers reach them from every page rather than only via the sitemap.
const platformLinks = [
  { href: "/clipboard-manager-for-mac", label: "Clipboard manager for macOS" },
  { href: "/clipboard-manager-for-windows", label: "Clipboard manager for Windows" },
  { href: "/clipboard-manager-for-linux", label: "Clipboard manager for Linux" },
  { href: "/free-open-source-clipboard-manager", label: "Free & open source" },
];

const Footer = () => (
  <footer className="py-12 px-4 border-t border-border">
    <nav
      aria-label="Ortu by platform"
      className="max-w-5xl mx-auto mb-10 flex flex-wrap justify-center gap-x-6 gap-y-3 md:justify-start"
    >
      {platformLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="text-zinc-500 hover:text-white transition-colors text-sm"
        >
          {link.label}
        </a>
      ))}
    </nav>
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <p className="text-zinc-500 text-sm text-center md:text-left">
        © 2026 Ortu · Local-first clipboard manager · MIT licensed
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        {policyLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-zinc-500 hover:text-white transition-colors text-sm"
          >
            {link.label}
          </a>
        ))}
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
