import type { ServiceItem } from "@/data/services";
import type { Artist } from "@/data/artists";

interface BookingData {
  artist: Artist | null;
  service: ServiceItem | null;
  date: Date | null;
  time: string | null;
  name: string;
  phone: string;
  email?: string;
  notes: string;
}

export function buildWhatsAppUrl(data: BookingData): string {
  const lines = [
    `Hallo ${data.artist?.name || ""}! 💕`,
    "",
    "Termin-Anfrage:",
    `✨ ${data.service?.name || ""}`,
    data.date
      ? `📅 ${data.date.toLocaleDateString("de-AT", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`
      : "",
    data.time ? `🕐 ${data.time}` : "",
    data.name ? `👤 ${data.name}` : "",
    data.phone ? `📱 ${data.phone}` : "",
    data.email ? `📧 ${data.email}` : "",
    data.notes ? `📝 ${data.notes}` : "",
    "",
    "Danke! 🌸",
  ].filter(Boolean);

  const message = lines.join("\n");
  const number = data.artist?.whatsapp || "436601234567";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message?: string): void {
  const text = message || "Hallo! Ich möchte einen Termin buchen. 💕";
  window.open(`https://wa.me/436601234567?text=${encodeURIComponent(text)}`, "_blank");
}

export function openGutscheinWhatsApp(): void {
  const text =
    "Hallo! Ich interessiere mich für einen Geschenkgutschein 🎀 Könntet ihr mir mehr Infos geben? Danke! 🌸";
  window.open(
    `https://wa.me/436601234567?text=${encodeURIComponent(text)}`,
    "_blank"
  );
}
