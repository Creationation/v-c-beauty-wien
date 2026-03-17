import type { ServiceItem } from "@/data/services";
import type { Artist } from "@/data/artists";

interface BookingData {
  artist: Artist | null;
  service: ServiceItem | null;
  date: Date | null;
  time: string | null;
  name: string;
  phone: string;
  notes: string;
}

export function buildWhatsAppUrl(data: BookingData): string {
  const message = [
    `Hallo ${data.artist?.name || ""}! 💕`,
    "",
    "Termin-Anfrage:",
    `✨ ${data.service?.name || ""}`,
    data.date ? `📅 ${data.date.toLocaleDateString("de-AT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}` : "",
    data.time ? `🕐 ${data.time}` : "",
    data.name ? `👤 ${data.name}` : "",
    data.phone ? `📱 ${data.phone}` : "",
    data.notes ? `📝 ${data.notes}` : "",
    "",
    "Danke! 🌸",
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(data?: Partial<BookingData>): void {
  if (data?.artist && data?.service) {
    window.open(buildWhatsAppUrl(data as BookingData), "_blank");
  } else {
    window.open("https://wa.me/", "_blank");
  }
}
