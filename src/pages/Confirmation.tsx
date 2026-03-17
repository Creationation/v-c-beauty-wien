import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { buildWhatsAppUrl } from "@/utils/whatsapp";
import { formatDateShort } from "@/utils/dates";

export default function Confirmation() {
  const navigate = useNavigate();
  const booking = useBooking();
  const { artist, services, date, time, form } = booking;

  if (!artist || services.length === 0) {
    navigate("/");
    return null;
  }

  const handleWhatsApp = () => {
    const url = buildWhatsAppUrl({
      artist,
      services,
      date,
      time,
      name: form.name,
      phone: form.phone,
      email: form.email,
      notes: form.notes,
    });
    window.open(url, "_blank");
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
    <div className="app-shell">
      <div className="text-center px-6 pt-12 pb-8">
        <div className="confirm-icon anim-bounce-in">
          <Check size={28} />
        </div>
        <h2 className="font-display text-[30px] font-medium mb-2">Anfrage gesendet! 🌸</h2>
        <p className="text-sm font-light leading-relaxed mb-2" style={{ color: "var(--txt2)" }}>
          Deine Anfrage wurde gespeichert.
        </p>
        <p className="text-sm font-light leading-relaxed mb-7" style={{ color: "var(--txt2)" }}>
          Bestätige jetzt via WhatsApp und {artist.name} meldet sich bald bei dir!
        </p>

        {/* Summary */}
        <div className="bg-white rounded-3xl p-5 text-left mb-6" style={{ boxShadow: "var(--shadow-sm)" }}>
          {[
            { label: "Expertin", value: artist.name },
            { label: "Service", value: service.name },
            { label: "Datum", value: date ? formatDateShort(date) : "—" },
            { label: "Uhrzeit", value: time || "—" },
            { label: "Preis", value: service.price },
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

        <button className="btn-whatsapp mb-3" onClick={handleWhatsApp}>
          <WhatsAppIcon size={20} /> Via WhatsApp bestätigen
        </button>
        <button className="btn-rose mb-2.5" onClick={handleNewBooking}>
          📅 Neuen Termin buchen
        </button>
        <button className="btn-outline" onClick={handleGoHome}>
          🏠 Zurück zum Start
        </button>
      </div>
    </div>
  );
}

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
