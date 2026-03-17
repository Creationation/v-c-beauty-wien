export interface Review {
  name: string;
  rating: number;
  text: string;
  artist: string;
  service: string;
}

export const REVIEWS: Review[] = [
  { name: "Sophie M.", rating: 5, text: "Victoria ist eine Künstlerin! Meine Lippen sehen so natürlich aus 🌸", artist: "victoria", service: "Lip Blushing" },
  { name: "Anna K.", rating: 5, text: "Endlich perfekte Augenbrauen! Kein tägliches Schminken mehr nötig.", artist: "victoria", service: "Powder Brows" },
  { name: "Maria L.", rating: 5, text: "Cindy hat mein Braut-Makeup perfekt gemacht. Alle Gäste waren begeistert!", artist: "cindy", service: "Braut Make-up" },
  { name: "Julia W.", rating: 5, text: "Super sanftes Sugaring! Endlich jemand, der wirklich vorsichtig arbeitet 💕", artist: "victoria", service: "Sugaring" },
  { name: "Lisa R.", rating: 5, text: "Das Lash Lifting hält ewig! Meine Wimpern sehen umwerfend aus ✨", artist: "cindy", service: "Lash Lifting" },
  { name: "Nina H.", rating: 5, text: "Der Workshop war mega! Jetzt schminke ich mich selbst professionell.", artist: "cindy", service: "Einzelcoaching" },
];
