const faqs = [
  {
    question: "Is Ortu clipboard manager free and open source?",
    answer:
      "Yes. Ortu is MIT licensed and free to use. You can inspect the source code and contribute through GitHub."
  },
  {
    question: "Does Ortu send clipboard data to cloud servers?",
    answer:
      "No. Ortu is local-first and stores clipboard history on your device using local storage."
  },
  {
    question: "How do installation steps differ across macOS, Windows, and Linux?",
    answer:
      "Windows and Linux use the standard installer flow for their builds. On macOS, if Gatekeeper blocks the .dmg version, run the Terminal commands shown in the download section to remove quarantine and open the app."
  },
  {
    question: "Is Ortu available on Windows and Linux?",
    answer:
      "Yes. Ortu is a cross-platform clipboard manager available on macOS, Windows, and Linux."
  }
];

const FaqSection = () => {
  return (
    <section id="faq" className="py-24 px-4 content-auto">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
        <p className="text-zinc-400 max-w-2xl mb-10">
          Quick answers about installation, privacy, platform support, and licensing.
        </p>
        <div className="space-y-3">
          {faqs.map((item) => (
            <details key={item.question} className="panel rounded-xl p-5 group">
              <summary className="cursor-pointer list-none font-semibold text-white pr-4">
                {item.question}
              </summary>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
