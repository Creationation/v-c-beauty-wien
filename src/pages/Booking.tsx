import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Clock } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { MONTHS, DAYS, TIMES, daysInMonth, firstDayOfMonth, formatDateLong } from "@/utils/dates";
import { buildWhatsAppUrl } from "@/utils/whatsapp";

export default function Booking() {
  const navigate = useNavigate();
  const { artistId } = useParams();
  const booking = useBooking();
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const today = new Date();

  const { artist, service, step, date, time, form } = booking;

  if (!service || !artist) {
    navigate("/");
    return null;
  }

  const dim = daysInMonth(year, month);
  const fd = firstDayOfMonth(year, month);

  const goBack = () => {
    if (step > 0) {
      booking.setStep(step - 1);
    } else {
      navigate(`/artist/${artistId}`);
    }
  };

  const handleSubmit = () => {
    navigate("/confirm");
  };

  const handleWhatsApp = () => {
    const url = buildWhatsAppUrl({
      artist,
      service,
      date,
      time,
      name: form.name,
      phone: form.phone,
      notes: form.notes,
    });
    window.open(url, "_blank");
  };

  return (
    <div className="app-shell">
      {/* Back */}
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 bg-transparent border-none text-[13px] cursor-pointer transition-colors"
          style={{ color: "var(--txt2)", fontFamily: "var(--font-body)" }}
        >
          <ArrowLeft size={18} /> Zurück
        </button>
      </div>

      <div className="px-5 pb-28">
        {/* Summary */}
        <div
          className="bg-white rounded-2xl p-4 mb-5 flex items-center gap-3.5 anim-fade-up"
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <span className="text-[28px]">{service.icon}</span>
          <div>
            <h4 className="text-[15px] font-medium mb-0.5">{service.name}</h4>
            <p className="text-xs" style={{ color: "var(--txt3)" }}>
              {service.duration} · {service.price}
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-0 mb-6 px-1 anim-fade-up delay-1">
          {["Datum", "Uhrzeit", "Details"].map((label, i) => (
            <div key={i} className="contents">
              <div className={`step-dot ${step > i ? "step-done" : ""} ${step === i ? "step-active" : ""}`}>
                {step > i ? <Check size={14} /> : i + 1}
              </div>
              {i < 2 && <div className={`step-line ${step > i ? "step-line-done" : ""}`} />}
            </div>
          ))}
        </div>

        {/* Step 0: Calendar */}
        {step === 0 && (
          <div className="anim-fade-up delay-2">
            <div className="section-label">📅 Wähle dein Datum</div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="font-display text-xl font-medium">
                {MONTHS[month]} {year}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
                    else setMonth((m) => m - 1);
                  }}
                  className="w-[34px] h-[34px] flex items-center justify-center rounded-full border-[1.5px] bg-white cursor-pointer transition-all text-[15px] hover:bg-[var(--cream2)]"
                  style={{ borderColor: "var(--cream2)", color: "var(--txt2)", fontFamily: "var(--font-body)" }}
                >
                  ‹
                </button>
                <button
                  onClick={() => {
                    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
                    else setMonth((m) => m + 1);
                  }}
                  className="w-[34px] h-[34px] flex items-center justify-center rounded-full border-[1.5px] bg-white cursor-pointer transition-all text-[15px] hover:bg-[var(--cream2)]"
                  style={{ borderColor: "var(--cream2)", color: "var(--txt2)", fontFamily: "var(--font-body)" }}
                >
                  ›
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-6">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[10px] font-semibold pb-2 tracking-wide" style={{ color: "var(--txt3)" }}>
                  {d}
                </div>
              ))}
              {Array.from({ length: fd }).map((_, i) => (
                <div key={`e${i}`} className="cal-day cal-empty" />
              ))}
              {Array.from({ length: dim }).map((_, i) => {
                const day = i + 1;
                const d = new Date(year, month, day);
                const past = d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                const sun = d.getDay() === 0;
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const selected = date && day === date.getDate() && month === date.getMonth() && year === date.getFullYear();

                return (
                  <div
                    key={day}
                    className={`cal-day ${past || sun ? "cal-off" : ""} ${selected ? "cal-selected" : ""} ${isToday && !selected ? "cal-today" : ""}`}
                    onClick={() => {
                      if (!past && !sun) {
                        booking.setDate(new Date(year, month, day));
                        booking.setStep(1);
                      }
                    }}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 1: Time */}
        {step === 1 && (
          <div className="anim-fade-up">
            <div className="section-label">🕐 Wähle deine Uhrzeit</div>
            {date && (
              <p className="text-[13px] mb-4" style={{ color: "var(--txt2)" }}>
                {formatDateLong(date)}
              </p>
            )}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {TIMES.map((t) => (
                <div
                  key={t}
                  className={`time-slot ${time === t ? "time-selected" : ""}`}
                  onClick={() => {
                    booking.setTime(t);
                    booking.setStep(2);
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Contact Form */}
        {step === 2 && (
          <div className="anim-fade-up">
            <div className="section-label">📝 Deine Angaben</div>
            <div className="mb-4">
              <label className="block text-[11px] font-semibold tracking-wide uppercase mb-1.5" style={{ color: "var(--txt3)" }}>
                Name *
              </label>
              <input
                className="beauty-input"
                placeholder="Vor- und Nachname"
                value={form.name}
                onChange={(e) => booking.setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-[11px] font-semibold tracking-wide uppercase mb-1.5" style={{ color: "var(--txt3)" }}>
                Telefon *
              </label>
              <input
                className="beauty-input"
                type="tel"
                placeholder="+43..."
                value={form.phone}
                onChange={(e) => booking.setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-[11px] font-semibold tracking-wide uppercase mb-1.5" style={{ color: "var(--txt3)" }}>
                Anmerkungen
              </label>
              <textarea
                className="beauty-input resize-none"
                style={{ minHeight: 80 }}
                placeholder="Wünsche, Allergien, besondere Hinweise..."
                value={form.notes}
                onChange={(e) => booking.setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <button
              className="btn-rose"
              disabled={!form.name || !form.phone}
              onClick={handleSubmit}
            >
              ✨ Termin anfragen
            </button>
            <div className="text-center my-3.5 text-xs" style={{ color: "var(--txt3)" }}>
              oder direkt via
            </div>
            <button className="btn-whatsapp" onClick={handleWhatsApp}>
              <WhatsAppIcon size={20} /> WhatsApp buchen
            </button>
          </div>
        )}
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
