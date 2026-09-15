import { useEffect, useState } from "react";
import { Download, Github, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useRepoStats } from "../../hooks/useRepoStats";
import { useDownload } from "../../hooks/useDownload";

// Only surface the star count once it reads as a strength, not a weakness.
// Below this, the pill stays a plain "Star on GitHub" call to action.
const STAR_THRESHOLD = 100;

// Root-relative rather than bare fragments, so the nav still works from the
// platform pages. On the homepage the browser treats "/#why" as a same-document
// jump, so smooth scrolling is unaffected.
const links = [
  { href: "/#different", label: "Why Ortu" },
  { href: "/#why", label: "Features" },
  { href: "/#shortcuts", label: "Shortcuts" },
  { href: "/#compare", label: "Compare" },
  { href: "/#faq", label: "FAQ" },
];

const Navbar = () => {
  const { stars } = useRepoStats();
  const { downloadUrl, onDownloadClick } = useDownload();
  // The bar floats over the hero's light, so it earns its contrast by
  // condensing and deepening once you have scrolled past it rather than
  // sitting at full weight over the headline.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Primary"
      className={`fixed w-full z-50 px-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled ? "top-2.5" : "top-5"
      }`}
    >
      <div
        className={`max-w-5xl mx-auto glass rounded-2xl px-4 sm:px-5 flex justify-between items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? "py-2 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.85)]"
            : "py-3"
        }`}
      >
        <a href="/" className="group flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
            <img
              className="w-full h-full object-contain"
              src="/app-icon.svg"
              alt="Ortu logo"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <span className="text-lg font-black text-white tracking-tighter">
            ORTU
          </span>
        </a>

        <div className="hidden md:flex items-center gap-7">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://buymeacoffee.com/abhijithpsubash"
            target="_blank"
            rel="noopener noreferrer"
            title="Buy me a coffee"
            aria-label="Support Ortu on Buy Me a Coffee"
            className="inline-flex shrink-0 items-center justify-center rounded-full transition-transform duration-200 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <img
              src="/bmc-coffee.webp"
              alt=""
              width={32}
              height={32}
              loading="lazy"
              decoding="async"
              className="h-8 w-8 rounded-full"
            />
          </a>
          <a
            href="https://github.com/abhijith-p-subash/ortu"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-white/[0.02] text-zinc-400 hover:text-white hover:border-accent/40 hover:bg-white/[0.05] transition-colors text-[11px] font-bold"
            aria-label="Star Ortu on GitHub"
          >
            {stars >= STAR_THRESHOLD ? (
              <>
                <Github className="w-3 h-3" />
                <span className="flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 text-accent fill-accent" /> {stars}
                </span>
              </>
            ) : (
              <>
                <Star className="w-3 h-3" />
                Star
              </>
            )}
          </a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={downloadUrl}
            rel="noopener noreferrer"
            onClick={onDownloadClick}
            data-bird-orbit="nav"
            className="sheen inline-flex items-center gap-2 px-4 sm:px-5 py-2 bg-accent text-bg rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent-hover transition-all duration-300 shadow-[0_10px_26px_-8px_rgba(255,138,61,0.55)]"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </motion.a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
