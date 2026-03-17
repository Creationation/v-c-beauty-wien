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
      emoji: "💋",
      items: [
        { name: "Lip Blushing", duration: "2–3 Std.", price: "ab 280€", desc: "Natürliche Lippenfarbe, sanft & langanhaltend", popular: true, icon: "👄" },
        { name: "Powder Brows", duration: "2–3 Std.", price: "ab 250€", desc: "Pudrige, natürlich wirkende Augenbrauen", popular: true, icon: "✨" },
        { name: "Eyeliner", duration: "1,5–2 Std.", price: "ab 200€", desc: "Dezenter oder intensiver permanenter Eyeliner", icon: "👁️" },
        { name: "Lip Auffrischung", duration: "1,5 Std.", price: "ab 150€", desc: "Touch-up für bestehende Behandlung", icon: "💕" },
        { name: "Brows Auffrischung", duration: "1,5 Std.", price: "ab 130€", desc: "Touch-up für bestehende Augenbrauen", icon: "🌟" },
      ],
    },
    {
      category: "Sugaring & Waxing",
      emoji: "🍯",
      items: [
        { name: "Full Face", duration: "20 Min.", price: "25€", icon: "🌸" },
        { name: "Deep Bikini", duration: "30 Min.", price: "30€", icon: "🌿" },
        { name: "Bikini Area", duration: "20 Min.", price: "20€", icon: "🌿" },
        { name: "Full Legs", duration: "45 Min.", price: "40€", icon: "✨" },
        { name: "Legs bis Knie", duration: "30 Min.", price: "30€", icon: "✨" },
        { name: "Full Arms", duration: "30 Min.", price: "30€", icon: "💫" },
        { name: "Arms bis Ellbogen", duration: "20 Min.", price: "25€", icon: "💫" },
        { name: "Achseln", duration: "15 Min.", price: "15€", icon: "🌸" },
        { name: "Bauch", duration: "20 Min.", price: "20€", icon: "🌸" },
        { name: "Po", duration: "20 Min.", price: "20€", icon: "🌸" },
        { name: "Lendenbereich", duration: "20 Min.", price: "25€", icon: "🌸" },
        { name: "Rücken", duration: "40 Min.", price: "40€", icon: "🌸" },
      ],
    },
  ],
  cindy: [
    {
      category: "Make-up",
      emoji: "💄",
      items: [
        { name: "Braut Make-up", duration: "1,5–2 Std.", price: "auf Anfrage", desc: "Individuell für deinen großen Tag", popular: true, icon: "👰" },
        { name: "Tages Make-up", duration: "45–60 Min.", price: "auf Anfrage", desc: "Natürlich & elegant, für Alltag & Anlässe", icon: "🌞" },
        { name: "Abend Make-up", duration: "60 Min.", price: "auf Anfrage", desc: "Glamourös für Events und Partys", icon: "🌙" },
        { name: "Film & Werbung", duration: "variabel", price: "auf Anfrage", desc: "Professionell für Kamera und Licht", icon: "🎬" },
        { name: "Event Make-up", duration: "60 Min.", price: "auf Anfrage", desc: "Kreative Looks für besondere Anlässe", icon: "🎉" },
        { name: "SFX & Bodypainting", duration: "variabel", price: "auf Anfrage", desc: "Künstlerische Face- & Bodypaintings", icon: "🎨" },
      ],
    },
    {
      category: "Hairstyling",
      emoji: "💇‍♀️",
      items: [
        { name: "Braut Hairstyling", duration: "1–1,5 Std.", price: "auf Anfrage", desc: "Hochsteckfrisuren, Hollywood Waves", popular: true, icon: "👑" },
        { name: "Event Hairstyling", duration: "45–60 Min.", price: "auf Anfrage", desc: "Elegant abgestimmt auf dein Make-up", icon: "💫" },
      ],
    },
    {
      category: "Lash & Brow Lifting",
      emoji: "👁️",
      items: [
        { name: "Lash Lifting", duration: "45–60 Min.", price: "auf Anfrage", desc: "Mehr Ausdruck, ohne tägliches Styling", popular: true, icon: "✨" },
        { name: "Brow Lifting", duration: "30–45 Min.", price: "auf Anfrage", desc: "Natürlich angehobene Brauen", icon: "🌟" },
        { name: "Lash & Brow Kombi", duration: "1–1,5 Std.", price: "auf Anfrage", desc: "Beides zum Vorteilspreis", icon: "💖" },
      ],
    },
    {
      category: "Workshops",
      emoji: "🎓",
      items: [
        { name: "Einzelcoaching", duration: "2–3 Std.", price: "auf Anfrage", desc: "Lerne typgerechtes Schminken", icon: "💝" },
        { name: "Gruppencoaching", duration: "3–4 Std.", price: "auf Anfrage", desc: "Perfekt mit Freundinnen", icon: "👯" },
        { name: "MUA Coaching", duration: "variabel", price: "auf Anfrage", desc: "Skills für Makeup Artists", icon: "🎓" },
      ],
    },
  ],
};
