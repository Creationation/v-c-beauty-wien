import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ADMIN_EMAIL = "creationation.at@gmail.com";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (user?.email === ADMIN_EMAIL) {
      navigate("/admin");
    } else {
      navigate("/settings");
    }
  }, [user, loading]);

  return (
    <div className="app-shell flex items-center justify-center min-h-screen">
      <div className="text-sm" style={{ color: "var(--txt3)" }}>Weiterleitung...</div>
    </div>
  );
}
