import { Check, Minus } from "lucide-react";
import type { ReactNode } from "react";
import Eyebrow from "../ui/Eyebrow";

type Cell = ReactNode;

interface Row {
  label: string;
  ortu: Cell;
  electron: Cell;
  native: Cell;
}

const Yes = () => (
  <span className="inline-flex items-center gap-1.5 font-semibold text-sage">
    <Check className="w-4 h-4" aria-hidden="true" />
    <span className="sr-only">Yes</span>
  </span>
);

const No = () => (
  <span className="inline-flex items-center gap-1.5 text-zinc-600">
    <Minus className="w-4 h-4" aria-hidden="true" />
    <span className="sr-only">Not available</span>
  </span>
);

const Label = ({ children }: { children: ReactNode }) => (
  <span className="text-sm text-zinc-300">{children}</span>
);

const rows: Row[] = [
  {
    label: "Idle memory",
    ortu: <Label>Low</Label>,
    electron: <Label>High</Label>,
    native: <Label>Lowest</Label>,
  },
  {
    label: "Install size",
    ortu: <Label>Small</Label>,
    electron: <Label>Large</Label>,
    native: <Label>Small</Label>,
  },
  {
    label: "Cross-platform (macOS · Windows · Linux)",
    ortu: <Yes />,
    electron: <Yes />,
    native: <Label>Often macOS-only</Label>,
  },
  {
    label: "Open source",
    ortu: (
      <span className="inline-flex items-center gap-1.5 font-semibold text-sage">
        <Check className="w-4 h-4" aria-hidden="true" /> MIT
      </span>
    ),
    electron: <Label>Varies</Label>,
    native: <Label>Varies</Label>,
  },
  {
    label: "Local-first / no telemetry",
    ortu: <Yes />,
    electron: <Label>Varies</Label>,
    native: <Label>Usually</Label>,
  },
  {
    label: "Images + files",
    ortu: <Yes />,
    electron: <Label>Varies</Label>,
    native: <Label>Varies</Label>,
  },
  {
    label: "Encryption at rest",
    ortu: <Yes />,
    electron: <No />,
    native: <Label>Rare</Label>,
  },
  {
    label: "Paste stack / multi-paste",
    ortu: <Yes />,
    electron: <Label>Varies</Label>,
    native: <Label>Rare</Label>,
  },
  {
    label: "Full-text search (FTS5)",
    ortu: <Yes />,
    electron: <Label>Varies</Label>,
    native: <Label>Basic</Label>,
  },
  {
    label: "Price",
    ortu: (
      <span className="font-semibold text-sage">Free &amp; open source</span>
    ),
    electron: <Label>Free / paid</Label>,
    native: <Label>Free / paid</Label>,
  },
];

const ComparisonSection = () => {
  return (
    <section id="compare" className="py-24 px-4 bg-bg text-white content-auto">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mb-12">
          <Eyebrow tone="sage">Efficiency &amp; comparison</Eyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-bold tracking-tight leading-[1.15]">
            Tiny footprint, full feature set
          </h2>
          <p className="mt-4 text-zinc-400 leading-relaxed">
            Ortu is built on Tauri + Rust, so it ships as a small native binary
            and stays light on memory — no bundled Chromium runtime like
            Electron-based clipboard tools. Compared with native macOS-only
            utilities, it keeps that efficiency while staying truly
            cross-platform.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-surface/70 shadow-2xl shadow-black/30">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <caption className="sr-only">
                Feature comparison between Ortu, a typical Electron-based
                clipboard app, and native macOS-only tools.
              </caption>
              <thead>
                <tr className="border-b border-border bg-white/[0.03]">
                  <th
                    scope="col"
                    className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-500"
                  >
                    Capability
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-accent"
                  >
                    Ortu
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400"
                  >
                    Electron-based app
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400"
                  >
                    Native macOS-only
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={
                      i % 2 === 0
                        ? "border-b border-border/60"
                        : "border-b border-border/60 bg-white/[0.015]"
                    }
                  >
                    <th
                      scope="row"
                      className="px-5 py-4 align-middle text-sm font-semibold text-white"
                    >
                      {row.label}
                    </th>
                    <td className="px-5 py-4 align-middle bg-accent/[0.06]">
                      {row.ortu}
                    </td>
                    <td className="px-5 py-4 align-middle">{row.electron}</td>
                    <td className="px-5 py-4 align-middle">{row.native}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-6 text-sm text-zinc-500">
          Comparisons are qualitative and shown relative to common alternatives;
          memory and install size are approximate and vary by OS and usage.
          Electron-based and native tools differ widely between products — this
          reflects typical, not universal, behaviour.
        </p>
      </div>
    </section>
  );
};

export default ComparisonSection;
