import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Eyebrow from "../ui/Eyebrow";
import {
  Files,
  Boxes,
  Layers,
  Search,
  ShieldCheck,
  Keyboard,
  History,
  Wand2,
  Palette,
  RefreshCw,
  Feather,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Bento span classes for md+ screens. */
  span?: string;
  accent?: "accent" | "sage";
  tags?: string[];
}

const features: Feature[] = [
  {
    icon: Boxes,
    title: "Smart auto-grouping",
    description:
      "A rule-based classifier sorts every clip automatically — URLs, code, JSON, shell commands, secrets, file paths and more.",
    span: "md:col-span-2 md:row-span-2",
    accent: "accent",
    tags: ["URLs", "Code", "JSON", "Shell", "Secrets", "Paths"],
  },
  {
    icon: Files,
    title: "Multi-format capture",
    description:
      "Keep text, images and files — complete with thumbnails — not just plain strings.",
    accent: "sage",
  },
  {
    icon: Layers,
    title: "Paste stack",
    description:
      "Queue several clips and paste them in order into any app with global hotkeys.",
    accent: "accent",
  },
  {
    icon: Search,
    title: "Lightning-fast search",
    description:
      "SQLite FTS5 full-text search with fuzzy ranking, scaling to tens of thousands of items.",
    span: "md:col-span-2",
    accent: "accent",
  },
  {
    icon: ShieldCheck,
    title: "Privacy & encryption",
    description:
      "Detected secrets are masked and encrypted at rest (AES-256-GCM); reveal on demand. Local-only, no cloud, no telemetry.",
    span: "md:col-span-2 md:row-span-2",
    accent: "sage",
    tags: ["AES-256-GCM", "Masked secrets", "No cloud", "No telemetry"],
  },
  {
    icon: Keyboard,
    title: "Customizable shortcuts",
    description:
      "Rebind every global hotkey in-app, with one-click restore to defaults.",
    accent: "accent",
  },
  {
    icon: History,
    title: "Flexible retention",
    description:
      "Clear on reboot, keep forever, or set age/count limits — pinned & grouped items are always kept.",
    accent: "sage",
  },
  {
    icon: Wand2,
    title: "Snippets & transforms",
    description:
      "Reusable snippets with variables, plus “Copy as” — JSON, Base64, URL-encode, case, slugify and more.",
    span: "md:col-span-2",
    accent: "accent",
  },
  {
    icon: Palette,
    title: "Themes",
    description: "Light, dark, or follow the system appearance.",
    accent: "sage",
  },
  {
    icon: RefreshCw,
    title: "Auto-update",
    description: "Signed updates delivered straight from GitHub Releases.",
    accent: "accent",
  },
  {
    icon: Feather,
    title: "Native & lightweight",
    description:
      "Built with Tauri + Rust — no bundled browser, a tiny install and low memory use.",
    span: "md:col-span-2",
    accent: "sage",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FeaturesSection = () => {
  return (
    <section className="py-24 px-4 bg-bg text-white content-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16" id="why">
          <Eyebrow>Everything in v2.0.0</Eyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-[1.15]">
            The full toolkit, one tiny app
          </h2>
          <p className="text-zinc-400 max-w-2xl">
            A focused, local-first clipboard manager with native performance,
            deterministic keyboard flows, and privacy built in. Designed for
            developers and power users.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-auto md:auto-rows-[180px]"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            const accentClass =
              feature.accent === "sage" ? "text-sage" : "text-accent";
            const hoverBorder =
              feature.accent === "sage"
                ? "hover:border-sage/50"
                : "hover:border-accent/40";
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className={`panel rounded-2xl p-6 flex flex-col justify-between group transition-colors ${hoverBorder} ${feature.span ?? ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className="shrink-0 p-2.5 bg-bg rounded-xl border border-border">
                    <Icon className={`w-5 h-5 ${accentClass}`} aria-hidden="true" />
                  </div>
                </div>

                {feature.tags && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {feature.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-bg/70 text-xs px-3 py-1.5 rounded-md border border-border text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
