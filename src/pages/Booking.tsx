import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Clock, ChevronDown, Star } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { ARTISTS } from "@/data/artists";
import { SERVICES } from "@/data/services";
import {
  MONTHS,
  DAYS,
  TIMES,
  daysInMonth,
  firstDayOfMonth,
  formatDateLong,
} from "@/utils/dates";
import { buildWhatsAppUrl } from "@/utils/whatsapp";

type Step = "artist" | "service" | "date" | "time" | "form";
const POPULAR_TIMES = ["10:00", "14:00", "16:00"];
const STEP_LABELS: Record<Step, string> = {
  artist: "Expertin",
  service: "Service",
  date: "Datum",
  time: "Uhrzeit",
  form: "Details",
};

export default function Booking() {
  const navigate = useNavigate();
  const { artistId } = useParams();
  const booking = useBooking();
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [expandedCats, setExpandedCats] = useState<Record<number, boolean>>({ 0: true });
  const today = new Date();
  const { artist, services, date, time, form } = booking;

  const steps: Step[] = (() => {
    if (!artistId) return ["artist", "service", "date", "time", "form"];
    if (services.length > 0) return ["service", "date", "time", "form"];
    return ["service", "date", "time", "form"];
  })();

  const [step, setStep] = useState<Step>(steps[0]);

  useEffect(() => {
    if (artistId && !artist) {
      const found = ARTISTS.find((a) => a.id === artistId);
      if (found) booking.setArtist(found);
    }
  }, [artistId]);

  const currentIdx = steps.indexOf(step);
  const currentArtist = artist || (artistId ? ARTISTS.find((a) => a.id === artistId) : null);
  const services = SERVICES[currentArtist?.id || ""] || [];
  const dim = daysInMonth(year, month);
  const fd = firstDayOfMonth(year, month);

  const goBack = () => {
    if (currentIdx > 0) setStep(steps[currentIdx - 1]);
    else if (artistId) navigate(`/artist/${artistId}`);
    else navigate("/");
  };

  const goNext = () => {
    if (currentIdx < steps.length - 1) setStep(steps[currentIdx + 1]);
  };

  const handleWhatsApp = () => {
    const url = buildWhatsAppUrl({
      artist: currentArtist || null,
      services,
      date,
      time,
      name: form.name,
      phone: form.phone,
      email: form.email,
      notes: form.notes,
    });
    window.open(url, "_blank");
    navigate("/confirm");
  };

  return (
    <div className="app-shell">
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
        <div className="mb-5 anim-fade-up">
          <h2 className="font-display text-[26px] font-medium">Termin buchen</h2>
          <p className="text-[13px]" style={{ color: "var(--txt3)" }}>
            Schritt {currentIdx + 1} von {steps.length}
          </p>
        </div>

        <div className="flex items-center gap-0 mb-6 px-1 anim-fade-up delay-1">
          {steps.map((s, i) => (
            <div key={s} className="contents">
              <div
                className={`step-dot ${currentIdx > i ? "step-done" : ""} ${currentIdx === i ? "step-active" : ""}`}
                title={STEP_LABELS[s]}
              >
                {currentIdx > i ? <Check size={14} /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`step-line ${currentIdx > i ? "step-line-done" : ""}`} />
              )}
            </div>
          ))}
        </div>

        {step !== "artist" && (currentArtist || services.length > 0) && (
          <div
            className="bg-white rounded-2xl p-4 mb-5 anim-fade-up"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            {services.length > 0 ? (
              <div className="flex flex-col gap-2">
                {services.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[22px]">{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[14px] font-medium truncate">{s.name}</h4>
                      <p className="text-[11px]" style={{ color: "var(--txt3)" }}>
                        {s.duration} · {s.price}
                      </p>
                    </div>
                  </div>
                ))}
                {currentArtist && (
                  <p className="text-[11px] mt-1" style={{ color: "var(--txt3)" }}>
                    mit {currentArtist.name}
                  </p>
                )}
              </div>
            ) : currentArtist ? (
              <div className="flex items-center gap-3.5">
                <span className="text-[28px]">{currentArtist.emoji}</span>
                <div>
                  <h4 className="text-[15px] font-medium mb-0.5">{currentArtist.name}</h4>
                  <p className="text-xs" style={{ color: "var(--txt3)" }}>{currentArtist.role}</p>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Artist Selection */}
        {step === "artist" && (
          <div className="anim-fade-up delay-2">
            <div className="section-label">🌸 Wähle deine Expertin</div>
            <div className="flex flex-col gap-3">
              {ARTISTS.map((a, i) => (
                <div
                  key={a.id}
                  className="beauty-card p-5 cursor-pointer anim-fade-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                  onClick={() => {
                    booking.setArtist(a);
                    booking.setService(null);
                    goNext();
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-[28px] border-[2px] border-white flex-shrink-0"
                      style={{ background: "var(--blush)", boxShadow: "var(--shadow-sm)" }}
                    >
                      {a.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg font-medium">{a.name}</h3>
                      <p className="text-[12px]" style={{ color: "var(--txt2)" }}>{a.role}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs font-medium" style={{ color: "var(--gold)" }}>
                        <Star size={12} fill="currentColor" strokeWidth={0} />
                        {a.rating}
                        <span className="text-[11px] font-normal ml-0.5" style={{ color: "var(--txt3)" }}>
                          ({a.reviews} Bewertungen)
                        </span>
                      </div>
                    </div>
                    <span className="text-lg font-light flex-shrink-0" style={{ color: "var(--txt3)" }}>&rsaquo;</span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap mt-3">
                    {a.specialties.map((spec) => (
                      <span key={spec} className="pill-badge">{spec}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Service Selection — multi-select */}
        {step === "service" && (
          <div className="anim-fade-up delay-2">
            <div className="section-label">✨ Wähle deine Services</div>
            <p className="text-[12px] mb-4 -mt-1" style={{ color: "var(--txt3)" }}>
              Du kannst einen oder mehrere Services auswählen
            </p>
            {artistServices.map((cat, ci) => (
              <div key={ci} className="mb-4">
                <div
                  className="flex items-center gap-2.5 p-3 px-4 bg-white rounded-2xl cursor-pointer transition-all duration-300 border-[1.5px] border-transparent hover:border-[var(--blush)] mb-2"
                  style={{ boxShadow: "var(--shadow-sm)" }}
                  onClick={() =>
                    setExpandedCats((prev) => ({ ...prev, [ci]: prev[ci] === false ? true : false }))
                  }
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <span className="flex-1 font-display text-lg font-medium">{cat.category}</span>
                  <span
                    className="text-[10px] font-medium px-2.5 py-0.5 rounded-full"
                    style={{ color: "var(--txt3)", background: "var(--cream2)" }}
                  >
                    {cat.items.length}
                  </span>
                  <ChevronDown
                    size={16}
                    style={{
                      color: "var(--txt3)",
                      transform: expandedCats[ci] === false ? "rotate(0deg)" : "rotate(180deg)",
                      transition: "transform 0.3s",
                    }}
                  />
                </div>
                {expandedCats[ci] !== false && (
                  <div className="flex flex-col gap-2">
                    {cat.items.map((item, ii) => {
                      const isSelected = services.some((s) => s.name === item.name);
                      return (
                        <div
                          key={ii}
                          className="service-item cursor-pointer anim-fade-up"
                          style={{
                            animationDelay: `${ii * 0.04}s`,
                            borderColor: isSelected ? "var(--rose-deep)" : undefined,
                            background: isSelected ? "var(--blush)" : undefined,
                          }}
                          onClick={() => booking.toggleService(item)}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="text-sm font-medium flex items-center gap-1.5 flex-1">
                              {isSelected && (
                                <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--rose-deep)" }}>
                                  <Check size={12} color="white" />
                                </span>
                              )}
                              <span className="text-lg mr-1">{item.icon}</span>
                              {item.name}
                              {item.popular && <span className="popular-badge">Beliebt</span>}
                            </div>
                            <div className="font-display text-[17px] font-semibold whitespace-nowrap">
                              {item.price}
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5 mt-1">
                            <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--txt3)" }}>
                              <Clock size={12} /> {item.duration}
                            </span>
                            {item.desc && (
                              <span className="text-xs font-light" style={{ color: "var(--txt2)" }}>
                                {item.desc}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            {/* Continue button */}
            {services.length > 0 && (
              <button
                className="btn-rose mt-2 anim-fade-up"
                onClick={goNext}
              >
                Weiter mit {services.length} {services.length === 1 ? "Service" : "Services"} →
              </button>
            )}
          </div>
        )}

        {/* Date */}
        {step === "date" && (
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
                  &lsaquo;
                </button>
                <button
                  onClick={() => {
                    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
                    else setMonth((m) => m + 1);
                  }}
                  className="w-[34px] h-[34px] flex items-center justify-center rounded-full border-[1.5px] bg-white cursor-pointer transition-all text-[15px] hover:bg-[var(--cream2)]"
                  style={{ borderColor: "var(--cream2)", color: "var(--txt2)", fontFamily: "var(--font-body)" }}
                >
                  &rsaquo;
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
                        goNext();
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

        {/* Time */}
        {step === "time" && (
          <div className="anim-fade-up">
            <div className="section-label">🕐 Wähle deine Uhrzeit</div>
            {date && (
              <p className="text-[13px] mb-4" style={{ color: "var(--txt2)" }}>
                {formatDateLong(date)}
              </p>
            )}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {TIMES.map((t) => (
                <div
                  key={t}
                  className={`time-slot relative ${time === t ? "time-selected" : ""}`}
                  onClick={() => { booking.setTime(t); goNext(); }}
                >
                  {t}
                  {POPULAR_TIMES.includes(t) && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: "var(--rose-deep)" }} />
                  )}
                </div>
              ))}
            </div>
            <p className="text-[11px] flex items-center gap-1.5" style={{ color: "var(--txt3)" }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: "var(--rose-deep)" }} /> Beliebt
            </p>
          </div>
        )}

        {/* Form */}
        {step === "form" && (
          <div className="anim-fade-up">
            <div className="section-label">📝 Deine Angaben</div>
            <div className="mb-4">
              <label className="block text-[11px] font-semibold tracking-wide uppercase mb-1.5" style={{ color: "var(--txt3)" }}>Name *</label>
              <input className="beauty-input" placeholder="Vor- und Nachname" value={form.name} onChange={(e) => booking.setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="mb-4">
              <label className="block text-[11px] font-semibold tracking-wide uppercase mb-1.5" style={{ color: "var(--txt3)" }}>Telefon *</label>
              <input className="beauty-input" type="tel" placeholder="+43..." value={form.phone} onChange={(e) => booking.setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="mb-4">
              <label className="block text-[11px] font-semibold tracking-wide uppercase mb-1.5" style={{ color: "var(--txt3)" }}>E-Mail</label>
              <input className="beauty-input" type="email" placeholder="deine@email.at" value={form.email} onChange={(e) => booking.setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="mb-6">
              <label className="block text-[11px] font-semibold tracking-wide uppercase mb-1.5" style={{ color: "var(--txt3)" }}>Anmerkungen</label>
              <textarea className="beauty-input resize-none" style={{ minHeight: 80 }} placeholder="Wünsche, Allergien, besondere Hinweise..." value={form.notes} onChange={(e) => booking.setForm({ ...form, notes: e.target.value })} />
            </div>
            <button
              className="btn-whatsapp"
              disabled={!form.name || !form.phone}
              onClick={handleWhatsApp}
              style={{ opacity: !form.name || !form.phone ? 0.5 : 1 }}
            >
              <WhatsAppIcon size={20} /> Termin via WhatsApp buchen
            </button>
            <p className="text-center text-[11px] mt-3" style={{ color: "var(--txt3)" }}>
              Du wirst direkt zu WhatsApp weitergeleitet 💬
            </p>
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
