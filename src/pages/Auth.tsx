import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/";
  const { signUp, signIn } = useAuth();

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

    navigate(returnTo);
  };

  return (
    <div className="app-shell">
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 bg-transparent border-none text-[13px] cursor-pointer transition-colors"
          style={{ color: "var(--txt2)", fontFamily: "var(--font-body)" }}
        >
          <ArrowLeft size={18} /> Zurück
        </button>
      </div>

      <div className="px-6 pt-6 pb-10 anim-fade-up">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🌸</div>
          <h1 className="font-display text-[28px] font-medium mb-1">
            {mode === "login" ? "Willkommen zurück" : "Konto erstellen"}
          </h1>
          <p className="text-[13px]" style={{ color: "var(--txt3)" }}>
            {mode === "login"
              ? "Melde dich an, um deinen Termin abzuschließen"
              : "Erstelle ein Konto, um deinen Termin zu buchen"}
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
