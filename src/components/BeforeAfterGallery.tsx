
const GALLERY = [
  {
    service: "Lip Blushing",
    artist: "Victoria",
    beforeBg: "linear-gradient(135deg, #e8d5c4 0%, #c9a98a 100%)",
    afterBg:  "linear-gradient(135deg, #E8A0B4 0%, #C4727F 100%)",
    beforeLabel: "Natürliche Lippen",
    afterLabel:  "Lip Blushing ✨",
    icon: "👄",
  },
  {
    service: "Powder Brows",
    artist: "Victoria",
    beforeBg: "linear-gradient(135deg, #e0d4c8 0%, #b8a090 100%)",
    afterBg:  "linear-gradient(135deg, #C9A96E 0%, #8B6914 100%)",
    beforeLabel: "Helle Brauen",
    afterLabel:  "Powder Brows 🌟",
    icon: "👁️",
  },
  {
    service: "Lash Lifting",
    artist: "Cindy",
    beforeBg: "linear-gradient(135deg, #ddd0c8 0%, #a89080 100%)",
    afterBg:  "linear-gradient(135deg, #B8879B 0%, #7a4060 100%)",
    beforeLabel: "Normale Wimpern",
    afterLabel:  "Lash Lifting 🪢",
    icon: "✨",
  },
  {
    service: "Braut Make-up",
    artist: "Cindy",
    beforeBg: "linear-gradient(135deg, #f0e8e0 0%, #c8b0a0 100%)",
    afterBg:  "linear-gradient(135deg, #f9c5d1 0%, #e07090 100%)",
    beforeLabel: "Ohne Make-up",
    afterLabel:  "Braut Look 👰",
    icon: "💍",
  },
];

export default function BeforeAfterGallery() {
  return (
    <div className="pb-6">
      <div className="section-label px-5">Vorher / Nachher</div>
      <div className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-none" style={{ scrollSnapType: "x mandatory" }}>
        {GALLERY.map((item, i) => (
          <div
            key={i}
            className="flex-shrink-0 rounded-2xl overflow-hidden anim-fade-up"
            style={{ width: 260, scrollSnapAlign: "start", boxShadow: "var(--shadow-md)", animationDelay: `${i * 0.08}s` }}
          >
            {/* Split card */}
            <div className="flex h-36">
              <div className="flex-1 flex flex-col items-center justify-center gap-1 relative" style={{ background: item.beforeBg }}>
                <span className="text-3xl grayscale opacity-70">{item.icon}</span>
                <span
                  className="absolute bottom-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(0,0,0,0.25)", color: "white" }}
                >
                  Vorher
                </span>
                <p className="text-[10px] font-medium text-center px-2 opacity-70" style={{ color: "white" }}>
                  {item.beforeLabel}
                </p>
              </div>
              <div className="w-0.5" style={{ background: "white" }} />
              <div className="flex-1 flex flex-col items-center justify-center gap-1 relative" style={{ background: item.afterBg }}>
                <span className="text-3xl">{item.icon}</span>
                <span
                  className="absolute bottom-2 right-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.3)", color: "white" }}
                >
                  Nachher
                </span>
                <p className="text-[10px] font-medium text-center px-2" style={{ color: "white" }}>
                  {item.afterLabel}
                </p>
              </div>
            </div>
            {/* Info */}
            <div className="bg-white px-4 py-3">
              <div className="text-sm font-semibold">{item.service}</div>
              <div className="text-[11px]" style={{ color: "var(--txt3)" }}>by {item.artist}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
