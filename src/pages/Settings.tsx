import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Eye, EyeOff, LogOut, Shield, User, Pencil,
  ChevronRight, CalendarDays, Check, ChevronDown, Clock
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
    await supabase.auth.updateUser({
      data: { full_name: name, phone },
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); setEditMode(false); }, 1200);
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="app-shell pb-20">
      <div className="px-5 pt-6 pb-4">
        <h1 className="font-display text-[26px] font-medium">Einstellungen</h1>
      </div>

      {/* User info */}
      <div className="mx-5 mb-4 p-4 rounded-2xl" style={{ background: "var(--cream)", boxShadow: "var(--shadow-sm)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: "var(--blush)", color: "var(--rose-deep)" }}
          >
            <User size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{name || user.email}</div>
            <div className="text-[11px]" style={{ color: "var(--txt3)" }}>{user.email}</div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer transition-colors"
            style={{ background: "var(--blush)", color: "var(--rose-deep)" }}
          >
            <Pencil size={14} />
          </button>
        </div>

        {/* Edit Profile */}
        {editMode && (
          <div className="mt-4 pt-4 flex flex-col gap-3" style={{ borderTop: "1px solid var(--cream2)" }}>
            <div>
              <label className="block text-[11px] font-semibold tracking-wide uppercase mb-1.5" style={{ color: "var(--txt3)" }}>Name</label>
              <input
                className="beauty-input"
                placeholder="Vor- und Nachname"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold tracking-wide uppercase mb-1.5" style={{ color: "var(--txt3)" }}>Telefon</label>
              <input
                className="beauty-input"
                type="tel"
                placeholder="+43..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold tracking-wide uppercase mb-1.5" style={{ color: "var(--txt3)" }}>E-Mail</label>
              <input
                className="beauty-input"
                type="email"
                value={user.email || ""}
                disabled
                style={{ opacity: 0.5, cursor: "not-allowed" }}
              />
            </div>
            <button
              className="btn-rose flex items-center justify-center gap-2"
              onClick={handleSave}
              disabled={saving}
              style={{ opacity: saving ? 0.6 : 1 }}
            >
              {saved ? <><Check size={16} /> Gespeichert!</> : saving ? "Speichern..." : "Profil speichern"}
            </button>
          </div>
        )}
      </div>

      {/* Menu items */}
      <MeineTermine userEmail={user.email} />

      <div className="mx-5 mt-3 rounded-2xl overflow-hidden" style={{ background: "var(--cream)", boxShadow: "var(--shadow-sm)" }}>
        {isAdmin && (
          <MenuItem
            icon={<Shield size={18} />}
            label="Admin-Bereich"
            accent
            onClick={() => navigate("/admin")}
          />
        )}

        <MenuItem
          icon={<LogOut size={18} />}
          label="Abmelden"
          destructive
          onClick={handleLogout}
          last
        />
      </div>

    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  accent,
  destructive,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  accent?: boolean;
  destructive?: boolean;
  last?: boolean;
}) {
  const color = destructive
    ? "var(--destructive, #e53e3e)"
    : accent
      ? "var(--rose-deep)"
      : "var(--txt)";

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 bg-transparent border-none cursor-pointer transition-colors hover:opacity-80"
      style={{
        color,
        fontFamily: "var(--font-body)",
        borderBottom: last ? "none" : "1px solid var(--cream2)",
      }}
    >
      {icon}
      <span className="text-[13px] font-medium flex-1 text-left">{label}</span>
      <ChevronRight size={16} style={{ opacity: 0.4 }} />
    </button>
  );
}

/* ── Auth form (not logged in) ── */
function AuthForm({
  signIn,
  signUp,
  navigate,
}: {
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

    const { error: authError } =
      mode === "signup"
        ? await signUp(email, password)
        : await signIn(email, password);

    setLoading(false);

    if (authError) {
      setError(
        mode === "signup"
          ? "Registrierung fehlgeschlagen. Versuche es erneut."
          : "Login fehlgeschlagen. Überprüfe deine Daten."
      );
      return;
    }
    // Stays on same page, useAuth will update → shows menu
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
            {mode === "login"
              ? "Melde dich an, um deine Termine zu verwalten"
              : "Erstelle ein Konto, um Termine zu buchen"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              className="block text-[11px] font-semibold tracking-wide uppercase mb-1.5"
              style={{ color: "var(--txt3)" }}
            >
              E-Mail
            </label>
            <input
              className="beauty-input"
              type="email"
              placeholder="deine@email.at"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label
              className="block text-[11px] font-semibold tracking-wide uppercase mb-1.5"
              style={{ color: "var(--txt3)" }}
            >
              Passwort
            </label>
            <div className="relative">
              <input
                className="beauty-input pr-10"
                type={showPw ? "text" : "password"}
                placeholder={mode === "signup" ? "Mind. 6 Zeichen" : "Dein Passwort"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer"
                style={{ color: "var(--txt3)" }}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[13px] text-center font-medium" style={{ color: "var(--destructive)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-rose mt-2"
            disabled={loading || !email || !password}
            style={{ opacity: loading || !email || !password ? 0.6 : 1 }}
          >
            {loading
              ? "Bitte warten..."
              : mode === "login"
                ? "🔓 Anmelden"
                : "✨ Konto erstellen"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
            className="bg-transparent border-none text-[13px] cursor-pointer underline"
            style={{ color: "var(--rose-deep)", fontFamily: "var(--font-body)" }}
          >
            {mode === "login"
              ? "Noch kein Konto? Jetzt registrieren"
              : "Bereits ein Konto? Anmelden"}
          </button>
        </div>
      </div>

      
    </div>
  );
}
