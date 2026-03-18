import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Clock, ChevronDown, Star } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
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


type Step = "artist" | "service" | "date" | "time" | "form";
const POPULAR_TIMES = ["10:00", "14:00", "16:00"];

function useBookedSlots(artistId: string | undefined, dateStr: string | null) {
  const [booked, setBooked] = useState<string[]>([]);
  useEffect(() => {
    if (!artistId || !dateStr) { setBooked([]); return; }
    supabase
      .from("appointments" as any)
      .select("appointment_time")
      .eq("artist_id", artistId)
      .eq("appointment_date", dateStr)
      .neq("status", "cancelled")
      .then(({ data }) => {
        setBooked((data || []).map((d: any) => d.appointment_time).filter(Boolean));
      });
  }, [artistId, dateStr]);
  return booked;
}

function useVacationDates(artistId: string | undefined) {
  const [dates, setDates] = useState<string[]>([]);
  useEffect(() => {
    if (!artistId) { setDates([]); return; }
    supabase
      .from("artist_vacations" as any)
      .select("vacation_date")
      .eq("artist_id", artistId)
      .then(({ data }) => {
        setDates((data || []).map((d: any) => d.vacation_date));
      });
  }, [artistId]);
  return dates;
}
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
  const { user } = useAuth();
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [expandedCats, setExpandedCats] = useState<Record<number, boolean>>({ 0: true });
  const [saving, setSaving] = useState(false);
  const { activeArtists } = useTeamMembers();
  const displayArtists = activeArtists.length > 0 ? activeArtists : ARTISTS;
  const today = new Date();
  const { artist, services, date, time, form } = booking;
  const currentArtist = artist || (artistId ? displayArtists.find((a) => a.id === artistId) : null);
  const dateStr = date ? date.toISOString().split("T")[0] : null;
  const bookedSlots = useBookedSlots(currentArtist?.id, dateStr);
  const vacationDates = useVacationDates(currentArtist?.id);

  // Pre-fill form with user data when available
  useEffect(() => {
    if (user && !form.email) {
      booking.setForm({
        ...form,
        email: user.email || "",
        name: user.user_metadata?.full_name || user.user_metadata?.name || form.name,
        phone: user.user_metadata?.phone || form.phone,
      });
    }
  }, [user]);

  // Restore pending booking after login
  useEffect(() => {
    if (user) {
      const pending = localStorage.getItem("pendingBooking");
      if (pending) {
        try {
          const data = JSON.parse(pending);
          if (data.artistId) {
            const a = ARTISTS.find((x) => x.id === data.artistId);
            if (a) booking.setArtist(a);
          }
          if (data.services) data.services.forEach((s: any) => booking.toggleService(s));
          if (data.date) booking.setDate(new Date(data.date));
          if (data.time) booking.setTime(data.time);
          if (data.form) booking.setForm(data.form);
          localStorage.removeItem("pendingBooking");
        } catch {}
      }
    }
  }, [user]);

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
  
  const artistServices = SERVICES[currentArtist?.id || ""] || [];
  const dim = daysInMonth(year, month);
  const fd = firstDayOfMonth(year, month);

  const goBack = () => {
    if (currentIdx > 0) setStep(steps[currentIdx - 1]);
    else if (artistId) navigate(`/artist/${artistId}`);
    else navigate("/");
  };

  // When entering "form" step, require auth
  const goNext = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < steps.length) {
      const nextStep = steps[nextIdx];
      if (nextStep === "form" && !user) {
        // Save booking state to localStorage before redirecting
        const pending = {
          artistId: currentArtist?.id,
          services,
          date: date?.toISOString(),
          time,
          form,
        };
        localStorage.setItem("pendingBooking", JSON.stringify(pending));
        const returnPath = artistId ? `/book/${artistId}` : "/book";
        navigate(`/auth?returnTo=${encodeURIComponent(returnPath)}`);
        return;
      }
      setStep(nextStep);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    // Save booking to database (authenticated users)
    if (user) {
      await supabase.from("bookings").insert({
        user_id: user.id,
        artist_id: currentArtist?.id || "",
        services: services as any,
        booking_date: date?.toISOString().split("T")[0] || null,
        booking_time: time,
        customer_name: form.name,
        customer_phone: form.phone,
        customer_email: form.email || user.email,
        notes: form.notes,
        status: "pending",
      });
    }

    // Save to appointments table (for notification system)
    const serviceNames = services.map((s: any) => s.name).join(", ");
    const servicePrices = services.map((s: any) => s.price).join(", ");
    const { data: appt } = await supabase.from("appointments" as any).insert({
      client_name: form.name,
      client_email: form.email || "",
      client_phone: form.phone,
      artist_id: currentArtist?.id || "unknown",
      artist_name: currentArtist?.name || "Vego Beauty",
      service: serviceNames,
      service_price: servicePrices,
      appointment_date: date?.toISOString().split("T")[0] || "",
      appointment_time: time,
      status: "pending",
      notes: form.notes,
    } as any).select().single();

    // Send confirmation email if email provided
    if (form.email && appt) {
      supabase.functions.invoke("send-email", {
        body: { type: "confirmation", appointment_id: (appt as any).id },
      }).catch(() => {});
    }

    setSaving(false);
    navigate("/confirm");
  };

  return (
    <div className="app-shell pb-20">
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
            {/* Summary + Continue */}
            {services.length > 0 && (
              <div className="mt-4 anim-fade-up">
                <div
                  className="rounded-2xl p-4 mb-3"
                  style={{ background: "var(--blush)", boxShadow: "var(--shadow-sm)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: "var(--txt3)" }}>
                      Zusammenfassung
                    </span>
                    <span className="text-[12px] font-medium" style={{ color: "var(--txt2)" }}>
                      {services.length} {services.length === 1 ? "Service" : "Services"}
                    </span>
                  </div>
                  {services.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-1.5"
                      style={{ borderBottom: i < services.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}
                    >
                      <span className="text-[13px] flex items-center gap-1.5">
                        <span>{s.icon}</span> {s.name}
                      </span>
                      <span className="text-[13px] font-semibold">{s.price}</span>
                    </div>
                  ))}
                  {(() => {
                    const numericPrices = services
                      .map((s) => {
                        const match = s.price.match(/(\d+)/);
                        return match ? parseInt(match[1], 10) : null;
                      })
                      .filter((p): p is number => p !== null);
                    const hasAllPrices = numericPrices.length === services.length;
                    const hasAbPrefix = services.some((s) => s.price.toLowerCase().startsWith("ab"));
                    if (hasAllPrices && services.length > 1) {
                      const total = numericPrices.reduce((a, b) => a + b, 0);
                      return (
                        <div
                          className="flex items-center justify-between pt-2.5 mt-1.5"
                          style={{ borderTop: "1.5px solid var(--rose-deep)" }}
                        >
                          <span className="text-[14px] font-semibold">Geschätzt gesamt</span>
                          <span className="font-display text-[18px] font-bold" style={{ color: "var(--rose-deep)" }}>
                            {hasAbPrefix ? "ab " : ""}
                            {total}€
                          </span>
                        </div>
                      );
                    }
                    if (!hasAllPrices && services.length > 1) {
                      return (
                        <div className="pt-2 mt-1.5 text-[12px]" style={{ color: "var(--txt3)", borderTop: "1.5px solid var(--rose-deep)" }}>
                          Gesamtpreis auf Anfrage
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
                <button
                  className="btn-rose"
                  onClick={goNext}
                >
                  Weiter mit {services.length} {services.length === 1 ? "Service" : "Services"} →
                </button>
              </div>
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
                const dStr = d.toISOString().split("T")[0];
                const past = d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                const sun = d.getDay() === 0;
                const isVacation = vacationDates.includes(dStr);
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const selected = date && day === date.getDate() && month === date.getMonth() && year === date.getFullYear();
                const disabled = past || sun || isVacation;
                return (
                  <div
                    key={day}
                    className={`cal-day ${disabled ? "cal-off" : ""} ${selected ? "cal-selected" : ""} ${isToday && !selected ? "cal-today" : ""}`}
                    onClick={() => {
                      if (!disabled) {
                        booking.setDate(new Date(year, month, day));
                        goNext();
                      }
                    }}
                    title={isVacation ? "Urlaub" : undefined}
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
              {TIMES.map((t) => {
                const isBooked = bookedSlots.includes(t);
                return (
                  <div
                    key={t}
                    className={`time-slot relative ${time === t ? "time-selected" : ""} ${isBooked ? "cal-off" : ""}`}
                    onClick={() => { if (!isBooked) { booking.setTime(t); goNext(); } }}
                    style={isBooked ? { opacity: 0.4, textDecoration: "line-through", cursor: "not-allowed" } : {}}
                    title={isBooked ? "Bereits gebucht" : undefined}
                  >
                    {t}
                    {!isBooked && POPULAR_TIMES.includes(t) && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: "var(--rose-deep)" }} />
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] flex items-center gap-1.5" style={{ color: "var(--txt3)" }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: "var(--rose-deep)" }} /> Beliebt
              <span className="ml-3" style={{ textDecoration: "line-through" }}>00:00</span> = Belegt
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
              className="btn-rose"
              disabled={!form.name || !form.phone || saving}
              onClick={handleSubmit}
              style={{ opacity: !form.name || !form.phone || saving ? 0.5 : 1 }}
            >
              {saving ? "Wird gespeichert..." : "✨ Termin verbindlich buchen"}
            </button>
            <p className="text-center text-[11px] mt-3" style={{ color: "var(--txt3)" }}>
              Dein Termin wird direkt in der App verwaltet 📅
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

