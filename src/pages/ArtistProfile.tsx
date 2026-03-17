import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star, ArrowLeft, ChevronDown, Clock, Heart, Mail } from "lucide-react";
import { ARTISTS } from "@/data/artists";
import { SERVICES } from "@/data/services";
import { REVIEWS } from "@/data/reviews";
import { useBooking } from "@/hooks/useBooking";

export default function ArtistProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const booking = useBooking();
  const [tab, setTab] = useState<"services" | "reviews" | "contact">("services");
  const [expandedCats, setExpandedCats] = useState<Record<number, boolean>>({ 0: true });

  const artist = ARTISTS.find((a) => a.id === id);
  const services = SERVICES[id || ""] || [];
  const artistReviews = REVIEWS.filter((r) => r.artist === id);

  if (!artist) return null;

  const toggleCategory = (i: number) =>
    setExpandedCats((prev) => ({ ...prev, [i]: !prev[i] }));

  const handleServiceClick = (service: typeof SERVICES.victoria[0]["items"][0]) => {
    booking.setArtist(artist);
    booking.setService(service);
    navigate(`/book/${artist.id}`);
  };

  const handleBookNow = () => {
    booking.setArtist(artist);
    booking.setService(null);
    navigate(`/book/${artist.id}`);
  };

  return (
    <div className="app-shell">
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 bg-transparent border-none text-[13px] cursor-pointer transition-colors"
          style={{ color: "var(--txt2)", fontFamily: "var(--font-body)" }}
        >
          <ArrowLeft size={18} /> Zurück
        </button>
      </div>

      <div className="px-6 pb-5 anim-fade-up">
        <div className="flex items-center gap-4 mb-3.5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-[32px] border-[3px] border-white"
            style={{ background: "var(--blush)", boxShadow: "var(--shadow-md)" }}
          >
            {artist.emoji}
          </div>
          <div>
            <h2 className="font-display text-[28px] font-medium">{artist.name}</h2>
            <div className="text-[13px]" style={{ color: "var(--txt2)" }}>{artist.role}</div>
            <div className="flex items-center gap-1 mt-1 text-xs font-medium" style={{ color: "var(--gold)" }}>
              <Star size={13} fill="currentColor" strokeWidth={0} />
              {artist.rating}
              <span className="text-[11px] font-normal" style={{ color: "var(--txt3)" }}>
                ({artist.reviews} Bewertungen)
              </span>
            </div>
          </div>
        </div>
        <p className="text-[13px] font-light leading-relaxed mb-3" style={{ color: "var(--txt2)" }}>
          {artist.bio}
        </p>
        <div className="flex gap-1.5 flex-wrap mt-2.5">
          {artist.specialties.map((s) => (
            <span key={s} className="pill-badge">{s}</span>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap mt-2">
          {artist.languages.map((l) => (
            <span key={l} className="lang-badge">{l}</span>
          ))}
        </div>
        <button className="btn-rose mt-4" onClick={handleBookNow}>
          📅 Termin buchen
        </button>
      </div>

      <div className="beauty-tabs">
        {(["services", "reviews", "contact"] as const).map((t) => (
          <button
            key={t}
            className={`beauty-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "services" ? "✨ Services" : t === "reviews" ? "💬 Bewertungen" : "📱 Kontakt"}
          </button>
        ))}
      </div>

      {/* Services */}
      {tab === "services" && (
        <div className="px-5 pb-24">
          {services.map((cat, ci) => (
            <div key={ci} className="mb-5 anim-fade-up" style={{ animationDelay: `${ci * 0.07}s` }}>
              <div
                className="flex items-center gap-2.5 p-3 px-4 bg-white rounded-2xl cursor-pointer transition-all duration-300 border-[1.5px] border-transparent hover:border-[var(--blush)]"
                style={{ boxShadow: "var(--shadow-sm)" }}
                onClick={() => toggleCategory(ci)}
              >
                <span className="text-xl">{cat.emoji}</span>
                <span className="flex-1 font-display text-lg font-medium">{cat.category}</span>
                <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full" style={{ color: "var(--txt3)", background: "var(--cream2)" }}>
                  {cat.items.length}
                </span>
                <span
                  className="transition-transform duration-300 flex"
                  style={{ color: "var(--txt3)", transform: expandedCats[ci] ? "rotate(180deg)" : "rotate(0)" }}
                >
                  <ChevronDown size={16} />
                </span>
              </div>
              {expandedCats[ci] && (
                <div className="flex flex-col gap-2 pt-2.5">
                  {cat.items.map((item, ii) => (
                    <div
                      key={ii}
                      className="service-item anim-fade-up"
                      style={{ animationDelay: `${ii * 0.04}s` }}
                      onClick={() => handleServiceClick(item)}
                    >
                      <button
                        className={`fav-btn ${booking.favorites.includes(item.name) ? "fav-active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          booking.toggleFavorite(item.name);
                        }}
                      >
                        <Heart size={16} fill={booking.favorites.includes(item.name) ? "currentColor" : "none"} />
                      </button>
                      <div className="flex justify-between items-start gap-2">
                        <div className="text-sm font-medium flex items-center gap-1.5 flex-1">
                          <span className="text-lg mr-1">{item.icon}</span>
                          {item.name}
                          {item.popular && <span className="popular-badge">Beliebt</span>}
                        </div>
                        <div className="font-display text-[17px] font-semibold whitespace-nowrap">{item.price}</div>
                      </div>
                      <div className="flex items-center gap-2.5 mt-1">
                        <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--txt3)" }}>
                          <Clock size={12} /> {item.duration}
                        </span>
                        {item.desc && (
                          <span className="text-xs font-light" style={{ color: "var(--txt2)" }}>{item.desc}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reviews */}
      {tab === "reviews" && (
        <div className="px-5 pb-10">
          {artistReviews.map((review, i) => (
            <div
              key={i}
              className="review-card anim-fade-up mb-2.5"
              style={{ animationDelay: `${i * 0.08}s`, minWidth: "auto", maxWidth: "none" }}
            >
              <div className="flex gap-0.5 mb-2" style={{ color: "var(--gold)" }}>
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <div className="text-[13px] italic leading-relaxed mb-2.5" style={{ color: "var(--txt2)" }}>
                &ldquo;{review.text}&rdquo;
              </div>
              <div className="text-xs font-semibold">{review.name}</div>
              <div className="text-[11px]" style={{ color: "var(--txt3)" }}>{review.service}</div>
            </div>
          ))}
        </div>
      )}

      {/* Contact */}
      {tab === "contact" && (
        <div className="px-5 pb-10">
          <div
            className="contact-card anim-fade-up delay-1"
            onClick={() => window.open(`https://wa.me/${artist.whatsapp}`, "_blank")}
          >
            <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(37, 211, 102, 0.1)", color: "var(--whatsapp)" }}>
              <WhatsAppIcon size={22} />
            </div>
            <div>
              <h4 className="text-sm font-medium">WhatsApp</h4>
              <p className="text-xs" style={{ color: "var(--txt3)" }}>Schnell &amp; direkt für Termine</p>
            </div>
          </div>
          <div
            className="contact-card anim-fade-up delay-2"
            onClick={() => window.open(artist.instagram, "_blank")}
          >
            <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(225, 48, 108, 0.08)", color: "#E1306C" }}>
              <InstagramIcon size={20} />
            </div>
            <div>
              <h4 className="text-sm font-medium">Instagram</h4>
              <p className="text-xs" style={{ color: "var(--txt3)" }}>{artist.handle}</p>
            </div>
          </div>
          {id === "cindy" && (
            <div className="contact-card anim-fade-up delay-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(201, 169, 110, 0.12)", color: "var(--gold)" }}>
                <Mail size={20} />
              </div>
              <div>
                <h4 className="text-sm font-medium">E-Mail</h4>
                <p className="text-xs" style={{ color: "var(--txt3)" }}>cbeautyvienna@gmail.com</p>
              </div>
            </div>
          )}
          <div className="mt-5">
            <button className="btn-whatsapp" onClick={handleBookNow}>
              <WhatsAppIcon size={18} /> Termin buchen
            </button>
          </div>
        </div>
      )}
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

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
