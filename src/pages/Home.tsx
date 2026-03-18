import { useState, useEffect } from "react";
import { Star, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ARTISTS } from "@/data/artists";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { REVIEWS } from "@/data/reviews";
import { openGutscheinWhatsApp } from "@/utils/whatsapp";

import StatsBar from "@/components/StatsBar";
import HowItWorks from "@/components/HowItWorks";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import TrendingServices from "@/components/TrendingServices";

export default function Home() {
  const navigate = useNavigate();
  const [showInstaDialog, setShowInstaDialog] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const { activeArtists, loading: teamLoading } = useTeamMembers();

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="app-shell pb-20">
      {/* Instagram Dialog */}
      {showInstaDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5" onClick={() => setShowInstaDialog(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-3xl p-6 w-full max-w-[360px] anim-fade-up"
            style={{ boxShadow: "var(--shadow-lg)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-xl font-medium text-center mb-1">Instagram öffnen</h3>
            <p className="text-xs text-center mb-5" style={{ color: "var(--txt3)" }}>Welches Profil möchtest du besuchen?</p>
            <div className="flex flex-col gap-2.5">
              {ARTISTS.map((artist) => (
                <button
                  key={artist.id}
                  className="flex items-center gap-3.5 p-4 rounded-2xl border-[1.5px] border-transparent bg-[var(--cream)] cursor-pointer transition-all duration-300 hover:border-[var(--blush-deep)] hover:-translate-y-0.5"
                  style={{ boxShadow: "var(--shadow-sm)" }}
                  onClick={() => { window.open(artist.instagram, "_blank"); setShowInstaDialog(false); }}
                >
                  <span className="text-3xl anim-float">{artist.emoji}</span>
                  <div className="text-left flex-1">
                    <div className="font-display text-base font-medium">{artist.name}</div>
                    <div className="text-[11px]" style={{ color: "var(--txt3)" }}>{artist.handle}</div>
                  </div>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(225, 48, 108, 0.08)", color: "#E1306C" }}>
                    <InstagramIcon size={16} />
                  </div>
                </button>
              ))}
            </div>
            <button
              className="mt-4 w-full text-xs font-medium py-2.5 rounded-full border-none bg-transparent cursor-pointer"
              style={{ color: "var(--txt3)" }}
              onClick={() => setShowInstaDialog(false)}
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="hero-section relative overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ opacity: 0.32, pointerEvents: "none" }}
          src="/videos/hero-bg.mp4"
          preload="none"
        />
        <div className="absolute inset-0 z-[1]" style={{ background: "linear-gradient(to bottom, rgba(253,248,244,0.5) 0%, rgba(253,248,244,0.3) 50%, rgba(253,248,244,0.95) 100%)" }} />
        <div className="flex items-center justify-between mb-7 relative z-[2] anim-fade-up">
          <div className="font-display text-[22px] font-semibold tracking-tight" style={{ color: "var(--txt)" }}>
            Vego <span style={{ color: "var(--rose-deep)" }}>Beauty</span>
          </div>
          <button
            onClick={() => navigate("/book")}
            className="px-[18px] py-2 bg-white border-[1.5px] rounded-full text-xs font-medium cursor-pointer transition-all duration-300 hover:bg-[var(--blush)]"
            style={{ borderColor: "var(--blush)", color: "var(--rose-deep)" }}
          >
            Termin buchen
          </button>
        </div>
        <h1 className="font-display text-[38px] font-normal leading-[1.1] mb-3 anim-fade-up delay-1 relative z-[2]">
          Deine Schönheit,
          <br />
          <em className="italic font-medium" style={{ color: "var(--rose-deep)" }}>perfektioniert</em>
        </h1>
        <p className="text-sm leading-relaxed max-w-[320px] mb-5 anim-fade-up delay-2 relative z-[2]" style={{ color: "var(--txt2)" }}>
          Permanent Make-up, Hairstyling, Braut Make-up &amp; mehr. Zwei Expertinnen, ein Ziel: dich strahlen lassen.
        </p>
        <div className="flex flex-wrap gap-2 anim-fade-up delay-3 relative z-[2]">
          {["🌸 Permanent Makeup", "💄 Pro Makeup", "💇‍♀️ Hairstyling", "✨ Lash Lifting"].map((tag) => (
            <span
              key={tag}
              className="px-3.5 py-1.5 bg-white border rounded-full text-[11px] font-medium flex items-center gap-1.5"
              style={{ borderColor: "var(--cream2)", color: "var(--txt2)", boxShadow: "var(--shadow-sm)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <StatsBar />

      {/* Trending Services */}
      <TrendingServices />

      {/* Artists */}
      <div className="px-5 pb-6">
        <div className="section-label anim-fade-up delay-3">Unsere Expertinnen</div>
        <div className="flex gap-3">
          {ARTISTS.map((artist, i) => (
            <div
              key={artist.id}
              className={`beauty-card flex-1 p-5 pt-0 relative overflow-hidden anim-fade-up delay-${i + 4}`}
              onClick={() => navigate(`/artist/${artist.id}`)}
            >
              <div
                className="h-1 rounded-t-3xl -mx-[calc(1.25rem+1.5px)] -mt-px mb-5"
                style={{
                  background: artist.id === "victoria"
                    ? "linear-gradient(90deg, var(--blush-deep), var(--blush))"
                    : "linear-gradient(90deg, var(--gold), var(--gold-soft))",
                }}
              />
              <span className="text-4xl block mb-3 anim-float">{artist.emoji}</span>
              <h3 className="font-display text-xl font-medium mb-0.5">{artist.name}</h3>
              <p className="text-[11px] leading-snug" style={{ color: "var(--txt2)" }}>{artist.role}</p>
              <div className="flex items-center gap-1 mt-2.5 text-xs font-medium" style={{ color: "var(--gold)" }}>
                <Star size={13} fill="currentColor" strokeWidth={0} />
                {artist.rating}
                <span className="text-[11px] font-normal" style={{ color: "var(--txt3)" }}>({artist.reviews})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2.5 px-5 pb-6 anim-fade-up delay-5">
        <div className="quick-action" onClick={() => navigate("/book")}>
          <span className="text-2xl mb-2 block">📅</span>
          <span className="text-[11px] font-medium" style={{ color: "var(--txt2)" }}>Termin buchen</span>
        </div>
        <div className="quick-action" onClick={() => navigate("/artist/victoria")}>
          <span className="text-2xl mb-2 block">💋</span>
          <span className="text-[11px] font-medium" style={{ color: "var(--txt2)" }}>Preisliste</span>
        </div>
        <div className="quick-action" onClick={() => openGutscheinWhatsApp()}>
          <span className="text-2xl mb-2 block">🎁</span>
          <span className="text-[11px] font-medium" style={{ color: "var(--txt2)" }}>Gutschein</span>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="promo-banner anim-fade-up delay-6" onClick={() => openGutscheinWhatsApp()}>
        <h3 className="font-display text-xl font-medium mb-1">Geschenkgutschein 🎀</h3>
        <p className="text-xs opacity-90 font-light">Das perfekte Geschenk. Schenke Schönheit &amp; Wohlbefinden</p>
      </div>

      {/* Before/After Gallery */}
      <BeforeAfterGallery />

      {/* How It Works */}
      <HowItWorks />

      {/* Reviews */}
      <div className="px-5 pb-2">
        <div className="section-label">Was unsere Kundinnen sagen</div>
      </div>
      <div className="reviews-scroll anim-fade-up delay-7 mb-6">
        {REVIEWS.map((review, i) => (
          <div key={i} className="review-card">
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

      <div className="h-px mx-5 mb-6" style={{ background: "var(--cream2)" }} />

      {/* Contact */}
      <div className="px-5 pb-10">
        <div className="section-label">Kontakt</div>
        <div className="contact-card anim-fade-up delay-7" onClick={() => navigate("/book")}>
          <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(37, 211, 102, 0.1)", color: "var(--whatsapp)" }}>
            <WhatsAppIcon size={22} />
          </div>
          <div>
            <h4 className="text-sm font-medium">Termin buchen</h4>
            <p className="text-xs" style={{ color: "var(--txt3)" }}>Via WhatsApp, schnell &amp; direkt 💬</p>
          </div>
        </div>
        <div className="contact-card anim-fade-up delay-8" onClick={() => setShowInstaDialog(true)}>
          <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(225, 48, 108, 0.08)", color: "#E1306C" }}>
            <InstagramIcon size={20} />
          </div>
          <div>
            <h4 className="text-sm font-medium">Instagram</h4>
            <p className="text-xs" style={{ color: "var(--txt3)" }}>@dr.permanent_v · @cbeautyvienna</p>
          </div>
        </div>
      </div>

      <div className="text-center pb-8 text-[11px] flex items-center justify-center gap-1" style={{ color: "var(--txt3)" }}>
        <MapPin size={12} /> Wien, Österreich
      </div>

      {/* Sticky Booking CTA */}
      {showSticky && (
        <div
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 anim-fade-up"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <button
            onClick={() => navigate("/book")}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-full text-[14px] font-medium text-white border-none cursor-pointer transition-transform hover:scale-105 whitespace-nowrap"
            style={{
              background: "linear-gradient(135deg, var(--rose-deep), #e07090)",
              boxShadow: "0 8px 24px rgba(196, 114, 127, 0.4)",
              fontFamily: "var(--font-body)",
            }}
          >
            📅 Jetzt Termin buchen
          </button>
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
