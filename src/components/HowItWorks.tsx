
const STEPS = [
  { emoji: "\ud83d\udcf2", title: "Online buchen",  desc: "W\u00e4hle Service, Datum & Uhrzeit direkt in der App" },
  { emoji: "\u2728",       title: "Dein Ergebnis",   desc: "Strahle mit einem professionellen, langlebigen Ergebnis" },
];

export default function HowItWorks() {
  return (
    <div className="px-5 pb-6">
      <div className="section-label">So funktioniert es</div>
      <div className="flex flex-col gap-3">
        {STEPS.map((step, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
                style={{ background: "var(--blush)", boxShadow: "var(--shadow-sm)" }}
              >
                {step.emoji}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 w-0.5 h-3 mt-1"
                  style={{ background: "var(--cream2)", top: "100%" }}
                />
              )}
            </div>
            <div className="pt-1">
              <div className="text-sm font-semibold mb-0.5">{step.title}</div>
              <div className="text-[12px] leading-relaxed" style={{ color: "var(--txt2)" }}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
