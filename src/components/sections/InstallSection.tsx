import { useEffect, useState } from "react";
import { Terminal, ShieldAlert, Copy, Check } from "lucide-react";

const INSTALL_COMMANDS = `xattr -dr com.apple.quarantine "/Applications/Ortu.app"
codesign --force --deep --sign - "/Applications/Ortu.app"
open "/Applications/Ortu.app"`;

const InstallSection = () => {
  const [copied, setCopied] = useState(false);
  const [mustRunCommands, setMustRunCommands] = useState(false);
  const [showMandatoryModal, setShowMandatoryModal] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("ortu_requires_mac_steps") === "true") {
      setMustRunCommands(true);
    }
    const onDmgDownload = () => {
      setMustRunCommands(true);
      setShowMandatoryModal(true);
    };
    window.addEventListener("ortu:dmg-download", onDmgDownload);
    return () => window.removeEventListener("ortu:dmg-download", onDmgDownload);
  }, []);

  const copyCommands = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMANDS);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  return (
    <>
      {showMandatoryModal && (
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl panel rounded-2xl border-accent/40 shadow-2xl shadow-black/60 p-6 md:p-8">
            <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-accent mb-3">Important for macOS</p>
            <h3 className="text-2xl font-extrabold text-white leading-tight">
              Before opening Ortu.app, run these commands in Terminal.
            </h3>
            <p className="mt-3 text-zinc-300 text-sm">
              This removes quarantine and re-signs the app bundle so macOS allows it to launch.
            </p>

            <pre className="mt-5 bg-[#0f1012] border border-border rounded-xl p-4 overflow-x-auto text-sm text-zinc-200 font-mono leading-7">
              <code>{INSTALL_COMMANDS}</code>
            </pre>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={copyCommands}
                className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-lg border border-border bg-primary hover:bg-surface transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-olive" /> : <Copy className="w-4 h-4 text-zinc-300" />}
                {copied ? "Copied" : "Copy Commands"}
              </button>
              <button
                type="button"
                onClick={() => setShowMandatoryModal(false)}
                className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors"
              >
                I understand
              </button>
            </div>
          </div>
        </div>
      )}

      <section id="download" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h2 className="text-4xl font-bold tracking-tight mb-3">macOS .dmg Download</h2>
            <p className="text-zinc-400 max-w-2xl">
              Drag <span className="text-white font-semibold">Ortu.app</span> into your Applications
              folder. If Gatekeeper blocks launch, run these commands in Terminal.
            </p>
          </div>

          {mustRunCommands && (
            <div className="mb-4 rounded-xl border border-accent/45 bg-accent/10 px-4 py-3 text-sm text-zinc-100">
              You downloaded the <span className="font-bold">.dmg</span>. Run these Terminal commands before first launch if macOS blocks the app.
            </div>
          )}

          <div className={`panel rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/30 ${mustRunCommands ? "ring-2 ring-accent/35" : ""}`}>
            <div className="flex items-center justify-between gap-3 mb-4 text-zinc-300">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-accent" />
                <span className="text-sm uppercase tracking-wider font-bold">Terminal Commands</span>
              </div>
              <button
                type="button"
                onClick={copyCommands}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg border border-border bg-primary hover:bg-surface transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-olive" /> : <Copy className="w-4 h-4 text-zinc-300" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <pre className="bg-[#0f1012] border border-border rounded-xl p-4 overflow-x-auto text-sm text-zinc-200 font-mono leading-7">
              <code>{INSTALL_COMMANDS}</code>
            </pre>

            <div className="mt-5 inline-flex items-start gap-2 text-xs text-zinc-400 bg-[#ff8a3d]/10 border border-[#ff8a3d]/30 rounded-lg px-3 py-2">
              <ShieldAlert className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <p>Required only when macOS shows an unsigned app warning.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InstallSection;
