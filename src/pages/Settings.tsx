import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye, EyeOff, LogOut, Shield, User, Pencil,
  ChevronRight, CalendarDays, Check, ChevronDown, Clock, X, AlertTriangle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const ADMIN_EMAIL = "creationation.at@gmail.com";

export default function Settings() {
  const navigate = useNavigate();
  const { user, loading, signIn, signUp, signOut } = useAuth();

  if (loading) {
    return (
      <div className="app-shell flex items-center justify-center min-h-screen">
        <div className="text-sm" style={{ color: "var(--txt3)" }}>Laden...</div>
      </div>
    );
  }

  if (user) {
    return <SettingsMenu user={user} signOut={signOut} navigate={navigate} />;
  }

  return <AuthForm signIn={signIn} signUp={signUp} navigate={navigate} />;
}

/* ── Logged-in menu ── */
function SettingsMenu({
  user,
  signOut,
  navigate,
}: {
  user: any;
  signOut: () => Promise<void>;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const isAdmin = user.email === ADMIN_EMAIL;
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user.user_metadata?.full_name || "");
  const [phone, setPhone] = useState(user.user_metadata?.phone || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await supabase.auth.updateUser({ data: { full_name: name, phone } });
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); setEditMode(false); }, 1200);
  };

  return (
    <div className="app-shell pb-20">
      <div className="px-5 pt-6 pb-4">
        <h1 className="font-display text-[26px] font-medium">Einstellungen</h1>
      </div>

      {/* User info */}
      <div className="mx-5 mb-4 p-4 rounded-2xl" style={{ background: "var(--cream)", boxShadow: "var(--shadow-sm)" }}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: "var(--blush)", color: "var(--rose-deep)" }}>
            <User size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{name || user.email}</div>
            <div className="text-[11px]" style={{ color: "var(--txt3)" }}>{user.email}</div>
          </div>
          <button onClick={() => setEditMode(!editMode)}
            className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer transition-colors"
            style={{ background: "var(--blush)", color: "var(--rose-deep)" }}>
            <Pencil size={14} />
          </button>
        </div>

        {editMode && (
          <div className="mt-4 pt-4 flex flex-col gap-3" style={{ borderTop: "1px solid var(--cream2)" }}>
            <div>
              <label className="block text-[11px] font-semibold tracking-wide uppercase mb-1.5" style={{ color: "var(--txt3)" }}>Name</label>
              <input className="beauty-input" placeholder="Vor- und Nachname" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold tracking-wide uppercase mb-1.5" style={{ color: "var(--txt3)" }}>Telefon</label>
              <input className="beauty-input" type="tel" placeholder="+43..." value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold tracking-wide uppercase mb-1.5" style={{ color: "var(--txt3)" }}>E-Mail</label>
              <input className="beauty-input" type="email" value={user.email || ""} disabled style={{ opacity: 0.5, cursor: "not-allowed" }} />
            </div>
            <button className="btn-rose flex items-center justify-center gap-2" onClick={handleSave} disabled={saving} style={{ opacity: saving ? 0.6 : 1 }}>
              {saved ? <><Check size={16} /> Gespeichert!</> : saving ? "Speichern..." : "Profil speichern"}
            </button>
          </div>
        )}
      </div>

      <MeineTermine userEmail={user.email} />

      <div className="mx-5 mt-3 rounded-2xl overflow-hidden" style={{ background: "var(--cream)", boxShadow: "var(--shadow-sm)" }}>
        {isAdmin && (
          <MenuItem icon={<Shield size={18} />} label="Admin-Bereich" accent onClick={() => navigate("/admin")} />
        )}
        <MenuItem icon={<LogOut size={18} />} label="Abmelden" destructive onClick={() => signOut()} last />
      </div>
    </div>
  );
}

function MenuItem({ icon, label, onClick, accent, destructive, last }: {
  icon: React.ReactNode; label: string; onClick: () => void;
  accent?: boolean; destructive?: boolean; last?: boolean;
}) {
  const color = destructive ? "var(--destructive, #e53e3e)" : accent ? "var(--rose-deep)" : "var(--txt)";
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 bg-transparent border-none cursor-pointer transition-colors hover:opacity-80"
      style={{ color, fontFamily: "var(--font-body)", borderBottom: last ? "none" : "1px solid var(--cream2)" }}>
      {icon}
      <span className="text-[13px] font-medium flex-1 text-left">{label}</span>
      <ChevronRight size={16} style={{ opacity: 0.4 }} />
    </button>
  );
}

/* ── Auth form ── */
function AuthForm({ signIn, signUp, navigate }: {
  signIn: (e: string, p: string) => Promise<{ error: any }>;
  signUp: (e: string, p: string) => Promise<{ error: any }>;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: authError } = mode === "signup" ? await signUp(email, password) : await signIn(email, password);
    setLoading(false);
    if (authError) {
      setError(mode === "signup" ? "Registrierung fehlgeschlagen. Versuche es erneut." : "Login fehlgeschlagen. Überprüfe deine Daten.");
    }
  };

  return (
    <div className="app-shell pb-20">
      <div className="px-6 pt-8 pb-10 anim-fade-up">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🌸</div>
          <h1 className="font-display text-[28px] font-medium mb-1">
            {mode === "login" ? "Willkommen zurück" : "Konto erstellen"}
          </h1>
          <p className="text-[13px]" style={{ color: "var(--txt3)" }}>
            {mode === "login" ? "Melde dich an, um deine Termine zu verwalten" : "Erstelle ein Konto, um Termine zu buchen"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[11px] font-semibold tracking-wide uppercase mb-1.5" style={{ color: "var(--txt3)" }}>E-Mail</label>
            <input className="beauty-input" type="email" placeholder="deine@email.at" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold tracking-wide uppercase mb-1.5" style={{ color: "var(--txt3)" }}>Passwort</label>
            <div className="relative">
              <input className="beauty-input pr-10" type={showPw ? "text" : "password"} placeholder={mode === "signup" ? "Mind. 6 Zeichen" : "Dein Passwort"}
                value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                autoComplete={mode === "signup" ? "new-password" : "current-password"} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer" style={{ color: "var(--txt3)" }}>
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="text-[13px] text-center font-medium" style={{ color: "var(--destructive)" }}>{error}</p>}
          <button type="submit" className="btn-rose mt-2" disabled={loading || !email || !password} style={{ opacity: loading || !email || !password ? 0.6 : 1 }}>
            {loading ? "Bitte warten..." : mode === "login" ? "🔓 Anmelden" : "✨ Konto erstellen"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
            className="bg-transparent border-none text-[13px] cursor-pointer underline"
            style={{ color: "var(--rose-deep)", fontFamily: "var(--font-body)" }}>
            {mode === "login" ? "Noch kein Konto? Jetzt registrieren" : "Bereits ein Konto? Anmelden"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Status config ── */
const APPT_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: "Ausstehend",    color: "#C4727F", bg: "rgba(196,114,127,0.1)" },
  confirmed: { label: "Bestätigt",     color: "#2d8a4e", bg: "rgba(45,138,78,0.1)" },
  completed: { label: "Abgeschlossen", color: "#C9A96E", bg: "rgba(201,169,110,0.1)" },
  cancelled: { label: "Abgesagt",      color: "#999",    bg: "rgba(0,0,0,0.06)" },
};

/* ── Cancel reasons ── */
const CANCEL_REASONS = [
  "Ich habe einen anderen Termin",
  "Ich bin verhindert / krank",
];

/* ── Cancel modal ── */
function CancelModal({ appointment, onClose, onCancelled }: {
  appointment: any; onClose: () => void; onCancelled: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isOther = selected === "__other";
  const reason = isOther ? otherText.trim() : selected;
  const isValid = !!reason && reason.length >= 5;

  const handleCancel = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setError("");

    const { error: updateError } = await supabase
      .from("appointments" as any)
      .update({ status: "cancelled", notes: `Stornierungsgrund: ${reason}` } as any)
      .eq("id", appointment.id);

    if (updateError) {
      setError("Fehler beim Stornieren. Bitte versuche es erneut.");
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    onCancelled();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-md rounded-t-3xl p-6 pb-8 anim-fade-up"
        style={{ background: "var(--bg)", boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(229,62,62,0.1)" }}>
              <AlertTriangle size={17} style={{ color: "var(--destructive, #e53e3e)" }} />
            </div>
            <h3 className="text-[16px] font-semibold" style={{ fontFamily: "var(--font-body)" }}>Termin stornieren</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer"
            style={{ background: "var(--cream2)", color: "var(--txt3)" }}>
            <X size={16} />
          </button>
        </div>

        {/* Appointment summary */}
        <div className="mb-5 p-3 rounded-xl" style={{ background: "var(--cream)", border: "1px solid var(--cream2)" }}>
          <div className="text-[13px] font-medium">{appointment.service}</div>
          <div className="text-[11px] mt-0.5" style={{ color: "var(--txt3)" }}>
            {appointment.artist_name} · {new Date(appointment.appointment_date + "T00:00:00").toLocaleDateString("de-AT", { weekday: "short", day: "numeric", month: "long" })}
            {appointment.appointment_time && ` · ${appointment.appointment_time}`}
          </div>
        </div>

        {/* Reason label */}
        <p className="text-[12px] font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--txt3)" }}>
          Warum möchtest du stornieren?
        </p>

        {/* Predefined reasons */}
        <div className="flex flex-col gap-2 mb-3">
          {CANCEL_REASONS.map((r) => (
            <button key={r} type="button"
              onClick={() => { setSelected(r); setOtherText(""); }}
              className="w-full text-left px-4 py-3 rounded-xl border-none cursor-pointer transition-all text-[13px]"
              style={{
                fontFamily: "var(--font-body)",
                background: selected === r ? "var(--blush)" : "var(--cream)",
                color: selected === r ? "var(--rose-deep)" : "var(--txt)",
                boxShadow: selected === r ? "inset 0 0 0 1.5px var(--rose-deep)" : "inset 0 0 0 1px var(--cream2)",
                fontWeight: selected === r ? 600 : 400,
              }}>
              {r}
            </button>
          ))}

          {/* Other option */}
          <button type="button"
            onClick={() => setSelected("__other")}
            className="w-full text-left px-4 py-3 rounded-xl border-none cursor-pointer transition-all text-[13px]"
            style={{
              fontFamily: "var(--font-body)",
              background: isOther ? "var(--blush)" : "var(--cream)",
              color: isOther ? "var(--rose-deep)" : "var(--txt)",
              boxShadow: isOther ? "inset 0 0 0 1.5px var(--rose-deep)" : "inset 0 0 0 1px var(--cream2)",
              fontWeight: isOther ? 600 : 400,
            }}>
            Anderer Grund
          </button>
        </div>

        {/* Free text for "other" */}
        {isOther && (
          <div className="mb-3">
            <textarea className="beauty-input w-full" rows={2}
              placeholder="Bitte beschreibe den Grund (mind. 5 Zeichen)"
              value={otherText} onChange={(e) => setOtherText(e.target.value)}
              style={{ resize: "none", fontSize: "13px" }} />
            {otherText.length > 0 && otherText.trim().length < 5 && (
              <p className="text-[11px] mt-1" style={{ color: "var(--destructive, #e53e3e)" }}>
                Mindestens 5 Zeichen erforderlich
              </p>
            )}
          </div>
        )}

        {error && <p className="text-[12px] mb-3 font-medium" style={{ color: "var(--destructive, #e53e3e)" }}>{error}</p>}

        {/* Actions */}
        <div className="flex gap-3 mt-2">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border-none cursor-pointer text-[13px] font-medium"
            style={{ background: "var(--cream2)", color: "var(--txt2)", fontFamily: "var(--font-body)" }}>
            Abbrechen
          </button>
          <button onClick={handleCancel} disabled={!isValid || submitting}
            className="flex-1 py-3 rounded-xl border-none cursor-pointer text-[13px] font-medium transition-opacity"
            style={{
              background: "var(--destructive, #e53e3e)", color: "#fff",
              fontFamily: "var(--font-body)", opacity: !isValid || submitting ? 0.5 : 1,
            }}>
            {submitting ? "Wird storniert..." : "Termin stornieren"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Meine Termine ── */
function MeineTermine({ userEmail }: { userEmail: string }) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [cancelTarget, setCancelTarget] = useState<any | null>(null);
  const navigate = useNavigate();

  const fetchAppointments = () => {
    if (!userEmail) return;
    supabase
      .from("appointments" as any)
      .select("*")
      .eq("client_email", userEmail)
      .order("appointment_date", { ascending: false })
      .order("appointment_time", { ascending: false })
      .then(({ data }) => {
        setAppointments((data as any) || []);
        setLoading(false);
      });
  };

  useEffect(() => { fetchAppointments(); }, [userEmail]);

  const canCancel = (a: any) => a.status === "pending" || a.status === "confirmed";

  return (
    <>
      <div className="mx-5 mb-3">
        <button onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-4 rounded-2xl cursor-pointer border-none"
          style={{ background: "var(--cream)", boxShadow: "var(--shadow-sm)", fontFamily: "var(--font-body)" }}>
          <div className="flex items-center gap-3">
            <CalendarDays size={18} style={{ color: "var(--txt2)" }} />
            <span className="text-[14px] font-medium" style={{ color: "var(--txt)" }}>Meine Termine</span>
            {appointments.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                style={{ background: "var(--blush)", color: "var(--rose-deep)" }}>
                {appointments.length}
              </span>
            )}
          </div>
          <ChevronDown size={16} style={{
            color: "var(--txt3)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }} />
        </button>

        {expanded && (
          <div className="mt-2 flex flex-col gap-2">
            {loading ? (
              <div className="text-center py-6 text-[12px]" style={{ color: "var(--txt3)" }}>Laden...</div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">📭</div>
                <p className="text-[12px]" style={{ color: "var(--txt3)" }}>Noch keine Termine</p>
                <button onClick={() => navigate("/book")} className="btn-rose text-[12px] mt-3 px-6 py-2">Jetzt buchen</button>
              </div>
            ) : (
              appointments.map((a: any) => {
                const cfg = APPT_STATUS[a.status] || APPT_STATUS.pending;
                const dateObj = new Date(a.appointment_date + "T00:00:00");
                const isPast = dateObj < new Date(new Date().toISOString().split("T")[0] + "T00:00:00");
                return (
                  <div key={a.id} className="beauty-card p-4" style={{ opacity: isPast && a.status !== "pending" ? 0.7 : 1 }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[13px]">{a.service}</div>
                        <div className="text-[11px] mt-0.5" style={{ color: "var(--txt3)" }}>{a.artist_name}</div>
                        <div className="flex items-center gap-1.5 mt-1.5 text-[11px]" style={{ color: "var(--rose-deep)" }}>
                          <Clock size={11} />
                          {dateObj.toLocaleDateString("de-AT", { weekday: "short", day: "numeric", month: "long" })}
                          {a.appointment_time && ` · ${a.appointment_time}`}
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2"
                        style={{ color: cfg.color, background: cfg.bg }}>
                        {cfg.label}
                      </span>
                    </div>
                    {a.service_price && (
                      <div className="text-[11px] mt-2" style={{ color: "var(--txt3)" }}>Preis: {a.service_price}</div>
                    )}

                    {/* Cancel button — only for pending / confirmed */}
                    {canCancel(a) && (
                      <button onClick={() => setCancelTarget(a)}
                        className="mt-3 w-full py-2 rounded-xl border-none cursor-pointer text-[12px] font-medium transition-opacity hover:opacity-80"
                        style={{ background: "rgba(229,62,62,0.08)", color: "var(--destructive, #e53e3e)", fontFamily: "var(--font-body)" }}>
                        Termin stornieren
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {cancelTarget && (
        <CancelModal
          appointment={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onCancelled={() => { setCancelTarget(null); fetchAppointments(); }}
        />
      )}
    </>
  );
}
