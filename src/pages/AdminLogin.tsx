
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";

const ADMIN_PASSWORD = "beauty2024";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) {
      localStorage.setItem("admin_auth", "1");
      navigate("/admin");
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="app-shell flex flex-col items-center justify-center min-h-screen px-6">
      <div className={`w-full max-w-[340px] ${shake ? "anim-shake" : ""}`}>
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, var(--rose-deep), var(--mauve))", boxShadow: "var(--shadow-md)" }}
          >
            <Lock size={28} />
          </div>
          <h2 className="font-display text-[28px] font-medium mb-1">Admin</h2>
          <p className="text-sm" style={{ color: "var(--txt3)" }}>Vego Beauty Studio</p>
        </div>

        <div className="relative mb-4">
          <input
            type={show ? "text" : "password"}
            className="beauty-input pr-12"
            placeholder="Passwort eingeben..."
            value={pw}
            onChange={(e) => { setPw(e.target.value); setError(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{ borderColor: error ? "var(--rose-deep)" : undefined }}
          />
          <button
            onClick={() => setShow((s) => !s)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--txt3)] bg-transparent border-none cursor-pointer"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && (
          <p className="text-[12px] text-center mb-3" style={{ color: "var(--rose-deep)" }}>
            Falsches Passwort. Versuche es erneut.
          </p>
        )}

        <button className="btn-rose w-full" onClick={handleLogin}>
          Einloggen
        </button>

        <button
          className="w-full mt-3 text-[12px] bg-transparent border-none cursor-pointer"
          style={{ color: "var(--txt3)" }}
          onClick={() => navigate("/")}
        >
          \u2190 Zur\u00fcck zur App
        </button>
      </div>
    </div>
  );
}
