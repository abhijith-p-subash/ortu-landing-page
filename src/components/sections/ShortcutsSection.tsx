import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import Eyebrow from "../ui/Eyebrow";
import Kbd from "../ui/Kbd";

interface Shortcut {
  action: string;
  mac: string[];
  win: string[];
}

const shortcuts: Shortcut[] = [
  { action: "Open quick popup", mac: ["⌥", "V"], win: ["Alt", "V"] },
  { action: "Copy selection to stack", mac: ["⌘", "⇧", "C"], win: ["Ctrl", "Shift", "C"] },
  { action: "Paste next from stack", mac: ["⌥", "⇧", "V"], win: ["Alt", "Shift", "V"] },
  { action: "Quick copy by position", mac: ["⌘", "1–9"], win: ["Ctrl", "1–9"] },
  { action: "Pin / unpin", mac: ["⌘", "P"], win: ["Ctrl", "P"] },
  { action: "Add to group", mac: ["⌘", "C"], win: ["Ctrl", "C"] },
  { action: "Add item to stack", mac: ["⌘", "S"], win: ["Ctrl", "S"] },
];

const ShortcutsSection = () => {
  const [platform, setPlatform] = useState<"mac" | "win">("mac");

  return (
    <section id="shortcuts" className="py-24 px-4 content-auto">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.3fr] gap-12 items-start">
        <div className="lg:sticky lg:top-28">
          <Eyebrow>Keyboard-first</Eyebrow>
          <h2 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
            Built for hands that
            <br /> never leave the keys
          </h2>
          <p className="mt-4 text-zinc-400 leading-relaxed max-w-md">
            Every core action has a global shortcut that works over any app —
            and you can rebind all of them in Settings, with one-click
            restore-to-defaults.
          </p>

          <div className="mt-7 inline-flex items-center rounded-xl border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => setPlatform("mac")}
              aria-pressed={platform === "mac"}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${
                platform === "mac"
                  ? "bg-accent text-bg"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              macOS
            </button>
            <button
              type="button"
              onClick={() => setPlatform("win")}
              aria-pressed={platform === "win"}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${
                platform === "win"
                  ? "bg-accent text-bg"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Win / Linux
            </button>
          </div>

          <p className="mt-5 inline-flex items-center gap-2 text-xs text-zinc-500">
            <RotateCcw className="w-3.5 h-3.5 text-sage" /> Fully rebindable ·
            restore defaults anytime
          </p>
        </div>

        <div className="panel rounded-2xl divide-y divide-border overflow-hidden">
          {shortcuts.map((s, i) => {
            const keys = platform === "mac" ? s.mac : s.win;
            return (
              <motion.div
                key={s.action}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-sm font-medium text-zinc-200">
                  {s.action}
                </span>
                <span className="flex items-center gap-1.5 shrink-0">
                  {keys.map((k, ki) => (
                    <span key={k} className="flex items-center gap-1.5">
                      {ki > 0 && (
                        <span className="text-zinc-600 text-xs">+</span>
                      )}
                      <Kbd>{k}</Kbd>
                    </span>
                  ))}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ShortcutsSection;
