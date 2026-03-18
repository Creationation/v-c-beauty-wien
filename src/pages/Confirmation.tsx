import { useNavigate } from "react-router-dom";
import { Check, MessageCircle } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { openWhatsApp } from "@/utils/whatsapp";
import { formatDateShort } from "@/utils/dates";

export default function Confirmation() {
  const navigate = useNavigate();
  const booking = useBooking();
  const { artist, services, date, time, form } = booking;

  if (!artist || services.length === 0) {
    navigate("/");
    return null;
  }

  const handleContact = () => {
    openWhatsApp(`Hallo ${artist.name}! Ich habe gerade einen Termin über die App gebucht und hätte noch eine Frage. 💕`);
  };

  const handleNewBooking = () => {
    booking.reset();
    navigate("/book");
  };

  const handleGoHome = () => {
    booking.reset();
    navigate("/");
  };

  return (
    <div className="app-shell pb-20">
      <div className="text-center px-6 pt-12 pb-8">
        <div className="confirm-icon anim-bounce-in">
          <Check size={28} />
        </div>
        <h2 className="font-display text-[30px] font-medium mb-2">Termin gebucht! 🌸</h2>
        <p className="text-sm font-light leading-relaxed mb-2" style={{ color: "var(--txt2)" }}>
          Dein Termin wurde erfolgreich gespeichert.
        </p>
        <p className="text-sm font-light leading-relaxed mb-7" style={{ color: "var(--txt2)" }}>
          {artist.name} wird sich bald bei dir melden!
        </p>

        {/* Summary */}
        <div className="bg-white rounded-3xl p-5 text-left mb-6" style={{ boxShadow: "var(--shadow-sm)" }}>
          {[
            { label: "Expertin", value: artist.name },
            { label: "Services", value: services.map((s) => s.name).join(", ") },
            { label: "Datum", value: date ? formatDateShort(date) : "—" },
            { label: "Uhrzeit", value: time || "—" },
            { label: "Preis", value: services.map((s) => s.price).join(" + ") },
            ...(form.name ? [{ label: "Name", value: form.name }] : []),
          ].map((row, i, arr) => (
            <div
              key={row.label}
              className="flex justify-between py-2.5"
              style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--cream2)" : "none" }}
            >
              <span className="text-[13px]" style={{ color: "var(--txt3)" }}>{row.label}</span>
              <span className="text-[13px] font-semibold text-right">{row.value}</span>
            </div>
          ))}
        </div>

        <button className="btn-rose mb-2.5" onClick={handleNewBooking}>
          📅 Neuen Termin buchen
        </button>
        <button className="btn-outline mb-2.5" onClick={handleGoHome}>
          🏠 Zurück zum Start
        </button>
        <button
          className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-[13px] font-medium cursor-pointer border-none bg-transparent transition-colors"
          style={{ color: "var(--txt3)" }}
          onClick={handleContact}
        >
          <MessageCircle size={16} /> Frage? Via WhatsApp kontaktieren
        </button>
      </div>
    </div>
  );
}
