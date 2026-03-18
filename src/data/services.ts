export interface ServiceItem {
  name: string;
  duration: string;
  price: string;
  desc?: string;
  popular?: boolean;
  icon: string;
}

export interface ServiceCategory {
  category: string;
  emoji: string;
  items: ServiceItem[];
}

export const SERVICES: Record<string, ServiceCategory[]> = {
  victoria: [
    {
      category: "Permanent Make-up",
      emoji: "\u{1F48B}",
      items: [
        { name: "Lip Blushing", duration: "2\u20133 Std.", price: "ab 280 \u20AC", desc: "Nat\u00FCrliche Lippenfarbe, sanft & langanhaltend", popular: true, icon: "\u{1F444}" },
        { name: "Powder Brows", duration: "2\u20133 Std.", price: "ab 250 \u20AC", desc: "Pudrige, nat\u00FCrlich wirkende Augenbrauen", popular: true, icon: "\u2728" },
        { name: "Eyeliner", duration: "1,5\u20132 Std.", price: "ab 200 \u20AC", desc: "Dezenter oder intensiver permanenter Eyeliner", icon: "\u{1F441}\uFE0F" },
        { name: "Lip Auffrischung", duration: "1,5 Std.", price: "ab 150 \u20AC", desc: "Touch-up f\u00FCr bestehende Behandlung", icon: "\u{1F495}" },
        { name: "Brows Auffrischung", duration: "1,5 Std.", price: "ab 130 \u20AC", desc: "Touch-up f\u00FCr bestehende Augenbrauen", icon: "\u{1F31F}" },
      ],
    },
    {
      category: "Sugaring & Waxing",
      emoji: "\u{1F36F}",
      items: [
        { name: "Full Face", duration: "20 Min.", price: "25 \u20AC", icon: "\u{1F338}" },
        { name: "Deep Bikini", duration: "30 Min.", price: "30 \u20AC", icon: "\u{1F33F}" },
        { name: "Bikini Area", duration: "20 Min.", price: "20 \u20AC", icon: "\u{1F33F}" },
        { name: "Full Legs", duration: "45 Min.", price: "40 \u20AC", icon: "\u2728" },
        { name: "Legs bis Knie", duration: "30 Min.", price: "30 \u20AC", icon: "\u2728" },
        { name: "Full Arms", duration: "30 Min.", price: "30 \u20AC", icon: "\u{1F4AB}" },
        { name: "Arms bis Ellbogen", duration: "20 Min.", price: "25 \u20AC", icon: "\u{1F4AB}" },
        { name: "Achseln", duration: "15 Min.", price: "15 \u20AC", icon: "\u{1F338}" },
        { name: "Bauch", duration: "20 Min.", price: "20 \u20AC", icon: "\u{1F338}" },
        { name: "Po", duration: "20 Min.", price: "20 \u20AC", icon: "\u{1F338}" },
        { name: "Lendenbereich", duration: "20 Min.", price: "25 \u20AC", icon: "\u{1F338}" },
        { name: "R\u00FCcken", duration: "40 Min.", price: "40 \u20AC", icon: "\u{1F338}" },
      ],
    },
  ],
  cindy: [
    {
      category: "Make-up",
      emoji: "\u{1F484}",
      items: [
        { name: "Braut Make-up", duration: "1,5\u20132 Std.", price: "auf Anfrage", desc: "Individuell f\u00FCr deinen gro\u00DFen Tag", popular: true, icon: "\u{1F470}" },
        { name: "Tages Make-up", duration: "45\u201360 Min.", price: "auf Anfrage", desc: "Nat\u00FCrlich & elegant, f\u00FCr Alltag & Anl\u00E4sse", icon: "\u{1F31E}" },
        { name: "Abend Make-up", duration: "60 Min.", price: "auf Anfrage", desc: "Glamour\u00F6s f\u00FCr Events und Partys", icon: "\u{1F319}" },
        { name: "Film & Werbung", duration: "variabel", price: "auf Anfrage", desc: "Professionell f\u00FCr Kamera und Licht", icon: "\u{1F3AC}" },
        { name: "Event Make-up", duration: "60 Min.", price: "auf Anfrage", desc: "Kreative Looks f\u00FCr besondere Anl\u00E4sse", icon: "\u{1F389}" },
        { name: "SFX & Bodypainting", duration: "variabel", price: "auf Anfrage", desc: "K\u00FCnstlerische Face- & Bodypaintings", icon: "\u{1F3A8}" },
      ],
    },
    {
      category: "Hairstyling",
      emoji: "\u{1F487}\u200D\u2640\uFE0F",
      items: [
        { name: "Braut Hairstyling", duration: "1\u20131,5 Std.", price: "auf Anfrage", desc: "Hochsteckfrisuren, Hollywood Waves", popular: true, icon: "\u{1F451}" },
        { name: "Event Hairstyling", duration: "45\u201360 Min.", price: "auf Anfrage", desc: "Elegant abgestimmt auf dein Make-up", icon: "\u{1F4AB}" },
      ],
    },
    {
      category: "Lash & Brow Lifting",
      emoji: "\u{1F441}\uFE0F",
      items: [
        { name: "Lash Lifting", duration: "45\u201360 Min.", price: "auf Anfrage", desc: "Mehr Ausdruck, ohne t\u00E4gliches Styling", popular: true, icon: "\u2728" },
        { name: "Brow Lifting", duration: "30\u201345 Min.", price: "auf Anfrage", desc: "Nat\u00FCrlich angehobene Brauen", icon: "\u{1F31F}" },
        { name: "Lash & Brow Kombi", duration: "1\u20131,5 Std.", price: "auf Anfrage", desc: "Beides zum Vorteilspreis", icon: "\u{1F496}" },
      ],
    },
    {
      category: "Workshops",
      emoji: "\u{1F393}",
      items: [
        { name: "Einzelcoaching", duration: "2\u20133 Std.", price: "auf Anfrage", desc: "Lerne typgerechtes Schminken", icon: "\u{1F49D}" },
        { name: "Gruppencoaching", duration: "3\u20134 Std.", price: "auf Anfrage", desc: "Perfekt mit Freundinnen", icon: "\u{1F46F}" },
        { name: "MUA Coaching", duration: "variabel", price: "auf Anfrage", desc: "Skills f\u00FCr Makeup Artists", icon: "\u{1F393}" },
      ],
    },
  ],
};
