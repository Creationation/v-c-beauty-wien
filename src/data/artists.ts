export interface Artist {
  id: string;
  name: string;
  handle: string;
  role: string;
  experience: string;
  languages: string[];
  bio: string;
  instagram: string;
  specialties: string[];
  rating: number;
  reviews: number;
  emoji: string;
}

export const ARTISTS: Artist[] = [
  {
    id: "victoria",
    name: "Victoria",
    handle: "@dr.permanent_v",
    role: "Permanent Makeup Artist",
    experience: "13+ Jahre Erfahrung",
    languages: ["EN", "DE", "UA", "RU"],
    bio: "Spezialistin für Permanent Make-up mit modernsten Techniken. Zertifizierte Pigmente, sterile Instrumente, natürliche Ergebnisse.",
    instagram: "https://instagram.com/dr.permanent_v",
    specialties: ["Lip Blushing", "Powder Brows", "Eyeliner", "Sugaring"],
    rating: 4.9,
    reviews: 127,
    emoji: "🌸",
  },
  {
    id: "cindy",
    name: "Cindy",
    handle: "@cbeautyvienna",
    role: "Pro Hair & Makeup Artist",
    experience: "Certified Professional",
    languages: ["DE", "EN"],
    bio: "Zertifizierte Hair & Makeup Artist. Braut Make-up, Events, Film & Werbung, Lash & Brow Lifting, Workshops.",
    instagram: "https://instagram.com/cbeautyvienna",
    specialties: ["Bridal", "Hairstyling", "Lash Lifting", "Coaching"],
    rating: 5.0,
    reviews: 89,
    emoji: "✨",
  },
];
