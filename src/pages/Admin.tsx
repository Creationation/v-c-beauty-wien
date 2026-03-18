
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, CalendarDays, Sparkles, Settings,
  LogOut, Check, X, Clock, ChevronRight, Phone, MessageSquare,
  Edit3, Save, Trash2, AlertCircle, TrendingUp, Users, Euro,
  Menu, Home, ArrowLeft
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { MOCK_APPOINTMENTS, type Appointment, type AppointmentStatus } from "@/data/appointments";
import { SERVICES } from "@/data/services";
import type { ServiceItem } from "@/data/services";

const ADMIN_EMAIL = "creationation.at@gmail.com";

type AdminTab = "dashboard" | "termine" | "services" | "einstellungen";

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; color: string; bg: string }> = {
  pending:   { label: "Ausstehend", color: "#C4727F",  bg: "rgba(196,114,127,0.1)" },
  confirmed: { label: "Best\u00e4tigt",  color: "#2d8a4e",  bg: "rgba(45,138,78,0.1)" },
  completed: { label: "Abgeschlossen", color: "#C9A96E", bg: "rgba(201,169,110,0.1)" },
  cancelled: { label: "Abgesagt",   color: "#999",      bg: "rgba(0,0,0,0.06)" },
};

function useAppointments() {
  const [data, setData] = useState<Appointment[]>(() => {
    try {
      const s = localStorage.getItem("admin_appointments");
      return s ? JSON.parse(s) : MOCK_APPOINTMENTS;
    } catch { return MOCK_APPOINTMENTS; }
  });
  const save = (next: Appointment[]) => {
    setData(next);
    localStorage.setItem("admin_appointments", JSON.stringify(next));
  };
  const updateStatus = (id: string, status: AppointmentStatus) =>
    save(data.map((a) => (a.id === id ? { ...a, status } : a)));
  const remove = (id: string) => save(data.filter((a) => a.id !== id));
  const clearAll = () => { setData([]); localStorage.removeItem("admin_appointments"); };
  return { data, updateStatus, remove, clearAll };
}

export default function Admin() {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: appointments, updateStatus, remove, clearAll } = useAppointments();

  // Redirect non-admin users
  useEffect(() => {
    if (!loading && (!user || user.email?.toLowerCase() !== ADMIN_EMAIL)) {
      navigate("/settings", { replace: true });
    }
  }, [user, loading, navigate]);

  const logout = async () => {
    await signOut();
    navigate("/settings");
  };

  if (loading || !user || user.email?.toLowerCase() !== ADMIN_EMAIL) {
    return (
      <div className="app-shell flex items-center justify-center min-h-screen">
        <div className="text-sm" style={{ color: "var(--txt3)" }}>Laden...</div>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const todayAppts = appointments.filter((a) => a.date === today);
  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const confirmedCount = appointments.filter((a) => a.status === "confirmed").length;
  const totalThisWeek = appointments.filter((a) => {
    const d = new Date(a.date);
    const now = new Date();
    const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay() + 1);
    const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);
    return d >= weekStart && d <= weekEnd;
  }).length;

  const TABS: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "dashboard",    label: "Dashboard",    icon: LayoutDashboard },
    { id: "termine",      label: "Termine",      icon: CalendarDays },
    { id: "services",     label: "Services",     icon: Sparkles },
    { id: "einstellungen",label: "Settings",     icon: Settings },
  ];

  return (
    <div className="app-shell">
      {/* Burger Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="relative w-[280px] h-full flex flex-col py-6 px-5 anim-fade-up"
            style={{ background: "var(--cream)", boxShadow: "var(--shadow-lg)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-display text-lg font-semibold">Menü</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="bg-transparent border-none cursor-pointer"
                style={{ color: "var(--txt2)" }}
              >
                <X size={22} />
              </button>
            </div>

            <nav className="flex flex-col gap-1 flex-1">
              {[
                { icon: Home, label: "Startseite", action: () => navigate("/") },
                { icon: CalendarDays, label: "Buchungen", action: () => navigate("/book") },
                { icon: Users, label: "Team", action: () => navigate("/team") },
                { icon: Settings, label: "Einstellungen", action: () => navigate("/settings") },
              ].map(({ icon: Icon, label, action }) => (
                <button
                  key={label}
                  onClick={() => { action(); setMenuOpen(false); }}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl bg-transparent border-none cursor-pointer text-left transition-colors hover:opacity-80"
                  style={{ color: "var(--txt)", fontFamily: "var(--font-body)" }}
                >
                  <Icon size={18} style={{ color: "var(--rose-deep)" }} />
                  <span className="text-[14px] font-medium">{label}</span>
                </button>
              ))}
            </nav>

            <button
              onClick={() => { logout(); setMenuOpen(false); }}
              className="flex items-center gap-3 px-3 py-3 rounded-xl bg-transparent border-none cursor-pointer"
              style={{ color: "var(--destructive, #e53e3e)", fontFamily: "var(--font-body)" }}
            >
              <LogOut size={18} />
              <span className="text-[14px] font-medium">Abmelden</span>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div
        className="flex items-center justify-between px-5 pt-4 pb-4 sticky top-0 z-30"
        style={{ background: "var(--cream)", borderBottom: "1px solid var(--cream2)" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="bg-transparent border-none cursor-pointer p-1"
            style={{ color: "var(--txt)" }}
          >
            <Menu size={22} />
          </button>
          <div>
            <div className="font-display text-xl font-semibold">Admin Panel</div>
            <div className="text-[11px]" style={{ color: "var(--txt3)" }}>Vego Beauty Studio</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-full border-[1.5px] bg-transparent cursor-pointer"
          style={{ borderColor: "var(--cream2)", color: "var(--txt3)", fontFamily: "var(--font-body)" }}
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto px-5 gap-2 pb-4 pt-2" style={{ scrollbarWidth: "none" }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-medium whitespace-nowrap border-[1.5px] cursor-pointer transition-all"
            style={{
              fontFamily: "var(--font-body)",
              background: tab === id ? "var(--rose-deep)" : "white",
              color: tab === id ? "white" : "var(--txt2)",
              borderColor: tab === id ? "var(--rose-deep)" : "var(--cream2)",
              boxShadow: tab === id ? "var(--shadow-sm)" : "none",
            }}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      <div className="px-5 pb-24">

        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { icon: CalendarDays, label: "Heute",         value: todayAppts.length,  color: "var(--rose-deep)", bg: "rgba(196,114,127,0.1)" },
                { icon: Clock,        label: "Ausstehend",    value: pendingCount,        color: "#C9A96E",          bg: "rgba(201,169,110,0.1)" },
                { icon: TrendingUp,   label: "Diese Woche",   value: totalThisWeek,       color: "#2d8a4e",          bg: "rgba(45,138,78,0.1)" },
                { icon: Users,        label: "Best\u00e4tigt", value: confirmedCount,     color: "var(--mauve)",     bg: "rgba(184,135,155,0.1)" },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className="bg-white rounded-2xl p-4" style={{ boxShadow: "var(--shadow-sm)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--txt3)" }}>{label}</div>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: bg, color }}>
                      <Icon size={15} />
                    </div>
                  </div>
                  <div className="font-display text-[32px] font-semibold leading-none" style={{ color }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Today's appointments */}
            <div className="section-label">Heute \u2014 {new Date().toLocaleDateString("de-AT", { weekday: "long", day: "numeric", month: "long" })}</div>
            {todayAppts.length === 0 ? (
              <div className="text-center py-8" style={{ color: "var(--txt3)" }}>
                <CalendarDays size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Keine Termine heute</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {todayAppts.map((a) => (
                  <AppointmentCard key={a.id} appt={a} onStatus={updateStatus} onDelete={remove} compact />
                ))}
              </div>
            )}

            {/* Pending notice */}
            {pendingCount > 0 && (
              <div
                className="mt-4 flex items-center gap-3 p-4 rounded-2xl cursor-pointer"
                style={{ background: "rgba(196,114,127,0.08)", border: "1.5px solid rgba(196,114,127,0.2)" }}
                onClick={() => setTab("termine")}
              >
                <AlertCircle size={18} style={{ color: "var(--rose-deep)" }} />
                <div className="flex-1">
                  <div className="text-[13px] font-medium">{pendingCount} ausstehende Termine</div>
                  <div className="text-[11px]" style={{ color: "var(--txt3)" }}>Bitte best\u00e4tigen oder absagen</div>
                </div>
                <ChevronRight size={16} style={{ color: "var(--txt3)" }} />
              </div>
            )}
          </div>
        )}

        {/* ── TERMINE ── */}
        {tab === "termine" && (
          <TermineTab appointments={appointments} onStatus={updateStatus} onDelete={remove} />
        )}

        {/* ── SERVICES ── */}
        {tab === "services" && <ServicesTab />}

        {/* ── SETTINGS ── */}
        {tab === "einstellungen" && <SettingsTab />}
      </div>
    </div>
  );
}

/* ── Appointment Card ── */
function AppointmentCard({
  appt, onStatus, onDelete, compact = false
}: {
  appt: Appointment;
  onStatus: (id: string, s: AppointmentStatus) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[appt.status];

  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-sm)" }}>
      <div className="p-4 cursor-pointer" onClick={() => setOpen((o) => !o)}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="text-sm font-semibold truncate">{appt.clientName}</div>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ color: cfg.color, background: cfg.bg }}
              >
                {cfg.label}
              </span>
            </div>
            <div className="text-[12px]" style={{ color: "var(--txt2)" }}>{appt.service}</div>
            <div className="flex items-center gap-3 mt-1.5 text-[11px]" style={{ color: "var(--txt3)" }}>
              <span>🌸 {appt.artist === "victoria" ? "Victoria" : "✨ Cindy"}</span>
              <span>🕐 {appt.time}</span>
              <span>💰 {appt.price}</span>
            </div>
          </div>
          <ChevronRight size={16} style={{ color: "var(--txt3)", transform: open ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.2s" }} />
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: "var(--cream2)" }}>
          <div className="pt-3 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[12px]" style={{ color: "var(--txt2)" }}>
              <Phone size={13} /> {appt.clientPhone}
            </div>
            {appt.notes && (
              <div className="flex items-start gap-2 text-[12px]" style={{ color: "var(--txt2)" }}>
                <MessageSquare size={13} className="mt-0.5 flex-shrink-0" /> {appt.notes}
              </div>
            )}
            <div className="flex gap-2 mt-2 flex-wrap">
              {appt.status !== "confirmed" && (
                <button
                  onClick={() => onStatus(appt.id, "confirmed")}
                  className="flex items-center gap-1 text-[11px] font-medium px-3 py-1.5 rounded-full border-none cursor-pointer"
                  style={{ background: "rgba(45,138,78,0.12)", color: "#2d8a4e", fontFamily: "var(--font-body)" }}
                >
                  <Check size={12} /> Best\u00e4tigen
                </button>
              )}
              {appt.status !== "completed" && (
                <button
                  onClick={() => onStatus(appt.id, "completed")}
                  className="flex items-center gap-1 text-[11px] font-medium px-3 py-1.5 rounded-full border-none cursor-pointer"
                  style={{ background: "rgba(201,169,110,0.12)", color: "#a07820", fontFamily: "var(--font-body)" }}
                >
                  <Check size={12} /> Abgeschlossen
                </button>
              )}
              {appt.status !== "cancelled" && (
                <button
                  onClick={() => onStatus(appt.id, "cancelled")}
                  className="flex items-center gap-1 text-[11px] font-medium px-3 py-1.5 rounded-full border-none cursor-pointer"
                  style={{ background: "rgba(0,0,0,0.06)", color: "#999", fontFamily: "var(--font-body)" }}
                >
                  <X size={12} /> Absagen
                </button>
              )}
              <button
                onClick={() => onDelete(appt.id)}
                className="flex items-center gap-1 text-[11px] font-medium px-3 py-1.5 rounded-full border-none cursor-pointer ml-auto"
                style={{ background: "rgba(196,114,127,0.1)", color: "var(--rose-deep)", fontFamily: "var(--font-body)" }}
              >
                <Trash2 size={12} /> L\u00f6schen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Termine Tab ── */
function TermineTab({
  appointments, onStatus, onDelete
}: {
  appointments: Appointment[];
  onStatus: (id: string, s: AppointmentStatus) => void;
  onDelete: (id: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | AppointmentStatus>("all");
  const [artistFilter, setArtistFilter] = useState<"all" | "victoria" | "cindy">("all");

  const filtered = appointments.filter((a) => {
    if (filter !== "all" && a.status !== filter) return false;
    if (artistFilter !== "all" && a.artist !== artistFilter) return false;
    return true;
  }).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const counts: Record<string, number> = { all: appointments.length };
  appointments.forEach((a) => { counts[a.status] = (counts[a.status] || 0) + 1; });

  return (
    <div>
      {/* Artist filter */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {(["all", "victoria", "cindy"] as const).map((a) => (
          <button
            key={a}
            onClick={() => setArtistFilter(a)}
            className="px-3 py-1.5 rounded-full text-[11px] font-medium border-[1.5px] whitespace-nowrap cursor-pointer"
            style={{
              fontFamily: "var(--font-body)",
              background: artistFilter === a ? "var(--txt)" : "white",
              color: artistFilter === a ? "white" : "var(--txt3)",
              borderColor: artistFilter === a ? "var(--txt)" : "var(--cream2)",
            }}
          >
            {a === "all" ? "Alle" : a === "victoria" ? "🌸 Victoria" : "✨ Cindy"}
          </button>
        ))}
      </div>
      {/* Status filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {(["all", "pending", "confirmed", "completed", "cancelled"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-3 py-1.5 rounded-full text-[11px] font-medium border-[1.5px] whitespace-nowrap cursor-pointer"
            style={{
              fontFamily: "var(--font-body)",
              background: filter === s ? (s === "all" ? "var(--rose-deep)" : STATUS_CONFIG[s]?.color || "var(--rose-deep)") : "white",
              color: filter === s ? "white" : "var(--txt3)",
              borderColor: filter === s ? "transparent" : "var(--cream2)",
            }}
          >
            {s === "all" ? `Alle (${counts.all || 0})` : `${STATUS_CONFIG[s].label} (${counts[s] || 0})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-10" style={{ color: "var(--txt3)" }}>
          <CalendarDays size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">Keine Termine gefunden</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((a) => (
            <div key={a.id}>
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-1.5 mt-3 first:mt-0" style={{ color: "var(--txt3)" }}>
                {new Date(a.date).toLocaleDateString("de-AT", { weekday: "long", day: "numeric", month: "long" })}
              </div>
              <AppointmentCard appt={a} onStatus={onStatus} onDelete={onDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Services Tab ── */
function ServicesTab() {
  type EditMap = Record<string, string>;
  const [edits, setEdits] = useState<EditMap>({});
  const [saved, setSaved] = useState<EditMap>(() => {
    try { return JSON.parse(localStorage.getItem("admin_prices") || "{}"); } catch { return {}; }
  });

  const getPrice = (artistId: string, ci: number, ii: number) => {
    const key = `${artistId}-${ci}-${ii}`;
    return saved[key] ?? SERVICES[artistId]?.[ci]?.items[ii]?.price ?? "";
  };

  const handleSave = (artistId: string, ci: number, ii: number) => {
    const key = `${artistId}-${ci}-${ii}`;
    if (!edits[key]) return;
    const next = { ...saved, [key]: edits[key] };
    setSaved(next);
    localStorage.setItem("admin_prices", JSON.stringify(next));
    setEdits((e) => { const n = { ...e }; delete n[key]; return n; });
  };

  return (
    <div>
      {(["victoria", "cindy"] as const).map((artistId) => (
        <div key={artistId} className="mb-6">
          <div className="section-label">{artistId === "victoria" ? "\ud83c\udf38 Victoria" : "\u2728 Cindy"}</div>
          {SERVICES[artistId].map((cat, ci) => (
            <div key={ci} className="mb-4">
              <div className="text-[12px] font-semibold mb-2 flex items-center gap-2" style={{ color: "var(--txt2)" }}>
                {cat.emoji} {cat.category}
              </div>
              <div className="flex flex-col gap-2">
                {cat.items.map((item, ii) => {
                  const key = `${artistId}-${ci}-${ii}`;
                  const editing = key in edits;
                  const currentPrice = getPrice(artistId, ci, ii);
                  return (
                    <div key={ii} className="bg-white rounded-2xl p-3 flex items-center gap-3" style={{ boxShadow: "var(--shadow-sm)" }}>
                      <span className="text-lg flex-shrink-0">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium truncate">{item.name}</div>
                        <div className="text-[11px]" style={{ color: "var(--txt3)" }}>{item.duration}</div>
                      </div>
                      {editing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            className="beauty-input text-[12px] py-1.5 px-2.5 w-24"
                            value={edits[key]}
                            onChange={(e) => setEdits((prev) => ({ ...prev, [key]: e.target.value }))}
                            onKeyDown={(e) => e.key === "Enter" && handleSave(artistId, ci, ii)}
                            autoFocus
                          />
                          <button
                            onClick={() => handleSave(artistId, ci, ii)}
                            className="w-8 h-8 rounded-xl flex items-center justify-center border-none cursor-pointer"
                            style={{ background: "rgba(45,138,78,0.12)", color: "#2d8a4e" }}
                          >
                            <Save size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold" style={{ color: "var(--rose-deep)" }}>{currentPrice}</span>
                          <button
                            onClick={() => setEdits((prev) => ({ ...prev, [key]: currentPrice }))}
                            className="w-7 h-7 rounded-xl flex items-center justify-center border-none cursor-pointer"
                            style={{ background: "var(--cream2)", color: "var(--txt2)" }}
                          >
                            <Edit3 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Settings Tab ── */
function SettingsTab() {
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem("admin_settings") || "{}"); } catch { return {}; }
  });
  const [saved, setSaved] = useState(false);

  const update = (key: string, val: string) => setSettings((s: Record<string,string>) => ({ ...s, [key]: val }));

  const handleSave = () => {
    localStorage.setItem("admin_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fields = [
    { key: "studioName",  label: "Studio Name",        placeholder: "Vego Beauty Wien" },
    { key: "phone1",      label: "WhatsApp Victoria",   placeholder: "+43 660 123 4567" },
    { key: "phone2",      label: "WhatsApp Cindy",      placeholder: "+43 664 987 6543" },
    { key: "address",     label: "Adresse",             placeholder: "Wien, \u00d6sterreich" },
    { key: "hours",       label: "\u00d6ffnungszeiten", placeholder: "Mo-Sa 09:00-18:00" },
    { key: "instagram1",  label: "Instagram Victoria",  placeholder: "@dr.permanent_v" },
    { key: "instagram2",  label: "Instagram Cindy",     placeholder: "@cbeautyvienna" },
  ];

  return (
    <div>
      <div className="flex flex-col gap-4">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-[11px] font-semibold tracking-wide uppercase mb-1.5" style={{ color: "var(--txt3)" }}>
              {label}
            </label>
            <input
              className="beauty-input"
              placeholder={placeholder}
              value={settings[key] || ""}
              onChange={(e) => update(key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button
        className="btn-rose mt-6 w-full flex items-center justify-center gap-2"
        onClick={handleSave}
        style={{ background: saved ? "linear-gradient(135deg, #2d8a4e, #1a5c30)" : undefined }}
      >
        {saved ? <><Check size={18} /> Gespeichert!</> : <><Save size={18} /> Einstellungen speichern</>}
      </button>

      <div className="mt-6 pt-6" style={{ borderTop: "1px solid var(--cream2)" }}>
        <div className="section-label">Danger Zone</div>
        <button
          className="w-full py-3 rounded-2xl text-[13px] font-medium border-[1.5px] cursor-pointer"
          style={{ borderColor: "rgba(196,114,127,0.3)", color: "var(--rose-deep)", background: "rgba(196,114,127,0.05)", fontFamily: "var(--font-body)" }}
          onClick={() => {
            if (confirm("Alle Termine l\u00f6schen?")) {
              localStorage.removeItem("admin_appointments");
              window.location.reload();
            }
          }}
        >
          Alle Termine zur\u00fccksetzen
        </button>
      </div>
    </div>
  );
}
