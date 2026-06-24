import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Layers,
  ShieldCheck,
  Feather,
  Brain,
  Search,
  HardDriveDownload,
} from "lucide-react";
import Eyebrow from "../ui/Eyebrow";

interface Diff {
  icon: LucideIcon;
  title: string;
  body: string;
}

const diffs: Diff[] = [
  {
    icon: Layers,
    title: "Paste stack, not just history",
    body: "Queue several clips and paste them one-by-one, in order, into any app. Most managers only give you back the last thing you clicked.",
  },
  {
    icon: ShieldCheck,
    title: "Secrets stay secret",
    body: "Ortu detects keys and tokens, masks them on sight, and encrypts them at rest with AES-256-GCM — revealed only when you ask.",
  },
  {
    icon: Feather,
    title: "Native, not a browser in disguise",
    body: "Built with Tauri + Rust: a small binary with low idle memory and no bundled Chromium like Electron-based tools.",
  },
  {
    icon: Brain,
    title: "Organizes itself",
    body: "A rule-based classifier sorts clips into URLs, code, JSON, shell and paths automatically, so your history never becomes a junk drawer.",
  },
  {
    icon: Search,
    title: "Search that scales",
    body: "SQLite FTS5 full-text search with fuzzy ranking stays instant across tens of thousands of clips — not a slow substring filter.",
  },
  {
    icon: HardDriveDownload,
    title: "Yours, and open",
    body: "Everything lives in a local database. No account, no cloud sync, no telemetry — and it's MIT licensed, so you can read every line.",
  },
];

const DifferentiatorsSection = () => {
  return (
    <section id="different" className="py-24 px-4 content-auto">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl">
          <Eyebrow tone="sage">What makes Ortu different</Eyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-bold tracking-tight leading-[1.15]">
            Cross-platform, lightweight, and private — without the trade-off.
          </h2>
          <p className="mt-4 text-zinc-400 leading-relaxed">
            Most clipboard tools make you choose two of the three. Ortu keeps all
            three, then adds the power-user features the rest leave out.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
          }}
          className="mt-12 grid gap-px bg-border rounded-2xl overflow-hidden border border-border sm:grid-cols-2 lg:grid-cols-3"
        >
          {diffs.map((d) => {
            const Icon = d.icon;
            return (
              <motion.article
                key={d.title}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="bg-bg p-7"
              >
                <Icon className="w-6 h-6 text-accent" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-bold text-white leading-snug">
                  {d.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                  {d.body}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default DifferentiatorsSection;
