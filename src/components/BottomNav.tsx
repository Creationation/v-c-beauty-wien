
import { useNavigate, useLocation } from "react-router-dom";
import { Home, CalendarDays, Sparkles, Star } from "lucide-react";

const TABS = [
  { label: "Home",   icon: Home,         path: "/" },
  { label: "Buchen", icon: CalendarDays, path: "/book" },
  { label: "Team",   icon: Sparkles,     path: "/team" },
  { label: "Top",    icon: Star,         path: "/top" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const active = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <nav className="bottom-nav">
      {TABS.map(({ label, icon: Icon, path }) => (
        <button
          key={path}
          className={`bottom-nav-btn ${active(path) ? "active" : ""}`}
          onClick={() => navigate(path)}
        >
          <Icon size={22} strokeWidth={active(path) ? 2.2 : 1.6} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
