
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard, CalendarDays, Sparkles, Settings, Bell,
  LogOut, Check, Phone, Mail, Trash2, Send,
  Eye, EyeOff, Save, RefreshCw, AlertCircle, Menu, ArrowLeft
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SERVICES } from "@/data/services";
import type { Appointment, AppointmentStatus, NotificationSettings } from "@/data/appointments";

const ADMIN_EMAIL = "creationation.at@gmail.com";

type AdminTab = "dashboard" | "termine" | "services" | "notifications" | "settings";

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; color: string; bg: string }> = {
  pending:   { label: "Ausstehend",    color: "#C4727F", bg: "rgba(196,114,127,0.1)" },
  confirmed: { label: "Bestätigt",     color: "#2d8a4e", bg: "rgba(45,138,78,0.1)" },
  completed: { label: "Abgeschlossen", color: "#C9A96E", bg: "rgba(201,169,110,0.1)" },
  cancelled: { label: "Abgesagt",      color: "#999",    bg: "rgba(0,0,0,0.06)" },
};

function useAppointments() {
  const qc = useQueryClient();
  const { data = [], isLoading, refetch } = useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments" as any)
        .select("*")
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true });
      if (error) throw error;
      return (data as unknown) as Appointment[];
    },
  });
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AppointmentStatus }) => {
      await supabase.from("appointments" as any).update({ status }).eq("id", id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => { await supabase.from("appointments" as any).delete().eq("id", id); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
  const resetAll = useMutation({
    mutationFn: async () => { await supabase.from("appointments" as any).delete().neq("id", "00000000-0000-0000-0000-000000000000"); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
  return { data, isLoading, refetch, updateStatus, remove, resetAll };
}

function useNotificationSettings() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<NotificationSettings>({
    queryKey: ["notification_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("notification_settings" as any).select("*").eq("id", 1 as any).single();
      if (error) throw error;
      return (data as unknown) as NotificationSettings;
    },
  });
  const save = useMutation({
    mutationFn: async (settings: Partial<NotificationSettings>) => {
      await supabase.from("notification_settings" as any).update(settings as any).eq("id", 1 as any);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notification_settings"] }),
  });
  return { data, isLoading, save };
}

async function sendReminderNow(appt: Appointment, type: "confirmation" | "reminder_24h" | "reminder_2h"): Promise<string> {
  if (!appt.client_email) return "Keine E-Mail Adresse";
  const subjects: Record<string, string> = {
    confirmation: `Terminbest\u00e4tigung \u2014 ${appt.service} mit ${appt.artist_name}`,
    reminder_24h: `\u23f0 Terminnerung morgen \u2014 ${appt.service} mit ${appt.artist_name}`,
    reminder_2h:  `\u23f0 Dein Termin in 2 Stunden \u2014 ${appt.service} mit ${appt.artist_name}`,
  };
  const apptDate = new Date(appt.appointment_date).toLocaleDateString("de-AT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const accentColor = type === "reminder_2h" ? "#E8954A" : "#C97A7A";
  const greeting = type === "confirmation" ? "Dein Termin wurde erfolgreich angefragt! Bitte best\u00e4tige via WhatsApp." : type === "reminder_24h" ? "dein Termin ist <strong>morgen</strong>! Wir freuen uns auf dich. \ud83c\udf38" : "dein Termin ist <strong>in 2 Stunden</strong>! Wir freuen uns auf dich. \ud83c\udf38";
  const html = `<!DOCTYPE html><html lang="de"><body style="margin:0;padding:0;background:#f9f5f2;font-family:Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;"><table width="100%" style="max-width:520px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);"><tr><td style="background:linear-gradient(135deg,${accentColor},#f0b090);padding:32px 36px;text-align:center;"><p style="margin:0 0 4px;color:rgba(255,255,255,0.8);font-size:13px;letter-spacing:2px;text-transform:uppercase;">Vego Beauty</p><h1 style="margin:0;color:#fff;font-size:24px;font-weight:400;">${subjects[type]}</h1></td></tr><tr><td style="padding:32px 36px;"><p style="color:#5c4a46;font-size:15px;line-height:1.6;margin:0 0 20px;">Hallo <strong>${appt.client_name}</strong> \ud83d\udc95,<br/>${greeting}</p><table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;"><tr><td style="padding:10px 0;border-bottom:1px solid #f5eeea;"><span style="font-size:18px;margin-right:10px;">\ud83c\udf38</span><span style="color:#8c7b77;font-size:13px;">Expertin</span></td><td style="padding:10px 0;border-bottom:1px solid #f5eeea;text-align:right;"><strong style="color:#3d2b27;font-size:14px;">${appt.artist_name}</strong></td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #f5eeea;"><span style="font-size:18px;margin-right:10px;">\u2728</span><span style="color:#8c7b77;font-size:13px;">Service</span></td><td style="padding:10px 0;border-bottom:1px solid #f5eeea;text-align:right;"><strong style="color:#3d2b27;font-size:14px;">${appt.service}</strong></td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #f5eeea;"><span style="font-size:18px;margin-right:10px;">\ud83d\udcc5</span><span style="color:#8c7b77;font-size:13px;">Datum</span></td><td style="padding:10px 0;border-bottom:1px solid #f5eeea;text-align:right;"><strong style="color:#3d2b27;font-size:14px;">${apptDate}</strong></td></tr><tr><td style="padding:10px 0;"><span style="font-size:18px;margin-right:10px;">\ud83d\udd50</span><span style="color:#8c7b77;font-size:13px;">Uhrzeit</span></td><td style="padding:10px 0;text-align:right;"><strong style="color:#3d2b27;font-size:14px;">${appt.appointment_time} Uhr</strong></td></tr></table></td></tr><tr><td style="padding:20px 36px 32px;text-align:center;border-top:1px solid #f0eae5;"><p style="margin:0;color:#b8a09a;font-size:12px;">Vego Beauty Wien \u00b7 <a href="https://beautyv.lovable.app" style="color:#C97A7A;text-decoration:none;">beautyv.lovable.app</a></p></td></tr></table></td></tr></table></body></html>`;
  const { error } = await supabase.functions.invoke("send-email", {
    body: { to: appt.client_email, subject: subjects[type], html, appointmentId: appt.id, type },
  });
  if (error) return `Fehler: ${error.message}`;
  return "Gesendet \u2713";
}

export default function Admin() {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: appointments, isLoading, refetch, updateStatus, remove, resetAll } = useAppointments();
  const { data: notifSettings, save: saveNotif } = useNotificationSettings();

  useEffect(() => {
    if (!loading && (!user || user.email !== ADMIN_EMAIL)) {
      navigate("/");
    }
  }, [user, loading]);

  if (loading || !user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="app-shell flex items-center justify-center min-h-screen">
        <div className="text-sm" style={{ color: "var(--txt3)" }}>Laden...</div>
      </div>
    );
  }

  const logout = async () => { await signOut(); navigate("/"); };

  const today = new Date().toISOString().slice(0, 10);
  const todayAppts = appointments.filter((a) => a.appointment_date === today);
  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const confirmedCount = appointments.filter((a) => a.status === "confirmed").length;
  const weekAppts = appointments.filter((a) => {
    const d = new Date(a.appointment_date);
    const now = new Date();
    const ws = new Date(now); ws.setDate(now.getDate() - now.getDay() + 1);
    const we = new Date(ws); we.setDate(ws.getDate() + 6);
    return d >= ws && d <= we;
  });

  const TABS: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "dashboard",     label: "Dashboard",   icon: LayoutDashboard },
    { id: "termine",       label: "Termine",      icon: CalendarDays },
    { id: "services",      label: "Services",     icon: Sparkles },
    { id: "notifications", label: "Emails",       icon: Bell },
    { id: "settings",      label: "Settings",     icon: Settings },
  ];

  const currentTab = TABS.find((t) => t.id === tab);

  return (
    <div className="app-shell">
      <div className="flex items-center justify-between px-5 pt-4 pb-4 sticky top-0 z-30"
        style={{ background: "var(--cream)", borderBottom: "1px solid var(--cream2)" }}>
        <button onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
          style={{ fontFamily: "var(--font-body)" }}>
          <Menu size={20} style={{ color: "var(--txt1)" }} />
          <div>
            <div className="font-display text-xl font-semibold">Admin Panel</div>
            <div className="text-[11px]" style={{ color: "var(--txt3)" }}>
              {currentTab && <span style={{ color: "var(--rose-deep)" }}>{currentTab.label}</span>}
            </div>
          </div>
        </button>
        <button onClick={logout} className="flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded-full border cursor-pointer bg-transparent"
          style={{ borderColor: "var(--cream2)", color: "var(--txt3)", fontFamily: "var(--font-body)" }}>
          <LogOut size={14} />
        </button>
      </div>

      {/* Burger menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.3)" }} />
          <div className="absolute left-0 top-0 bottom-0 w-64 flex flex-col py-6 px-4 shadow-xl"
            style={{ background: "var(--cream)" }}
            onClick={(e) => e.stopPropagation()}>
            <div className="font-display text-lg font-semibold mb-1 px-2">Admin Panel</div>
            <div className="text-[11px] mb-6 px-2" style={{ color: "var(--txt3)" }}>Vego Beauty Wien</div>

            <div className="flex flex-col gap-1 flex-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => { setTab(id); setMenuOpen(false); }}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] font-medium cursor-pointer bg-transparent border-none text-left"
                  style={{
                    background: tab === id ? "rgba(196,114,127,0.08)" : "transparent",
                    color: tab === id ? "var(--rose-deep)" : "var(--txt2)",
                    fontFamily: "var(--font-body)",
                  }}>
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>

            <div style={{ borderTop: "1px solid var(--cream2)", paddingTop: "16px", marginTop: "16px" }}>
              <button onClick={() => { setMenuOpen(false); navigate("/"); }}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] font-medium cursor-pointer bg-transparent border-none text-left w-full"
                style={{ color: "var(--txt2)", fontFamily: "var(--font-body)" }}>
                <ArrowLeft size={16} /> Zurück zur App
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-5 py-5 pb-24">
        {tab === "dashboard" && (
          <div>
            <div className="section-label">Heute, {new Date().toLocaleDateString("de-AT", { day: "numeric", month: "long" })}</div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: "Heute",       value: todayAppts.length,  icon: "📅", color: "var(--rose-deep)" },
                { label: "Ausstehend",  value: pendingCount,       icon: "⏳",       color: "#C4727F" },
                { label: "Diese Woche", value: weekAppts.length,   icon: "📊", color: "var(--gold)" },
                { label: "Bestätigt",   value: confirmedCount,     icon: "✅",       color: "#2d8a4e" },
              ].map(({ label, value, icon, color }) => (
                <div key={label} className="beauty-card p-4 anim-fade-up">
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="font-display text-3xl font-medium mb-0.5" style={{ color }}>{value}</div>
                  <div className="text-[11px]" style={{ color: "var(--txt3)" }}>{label}</div>
                </div>
              ))}
            </div>
            {todayAppts.length > 0 ? (
              <>
                <div className="section-label">Heutige Termine</div>
                <div className="flex flex-col gap-3">
                  {todayAppts.map((a) => (
                    <div key={a.id} className="beauty-card p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-sm">{a.client_name}</div>
                          <div className="text-[11px]" style={{ color: "var(--txt3)" }}>{a.service} · {a.artist_name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-display font-medium text-sm" style={{ color: "var(--rose-deep)" }}>{a.appointment_time}</div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                            style={{ color: STATUS_CONFIG[a.status as AppointmentStatus]?.color, background: STATUS_CONFIG[a.status as AppointmentStatus]?.bg }}>
                            {STATUS_CONFIG[a.status as AppointmentStatus]?.label}
                          </span>
                        </div>
                      </div>
                      {a.client_phone && <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--txt3)" }}><Phone size={11} /> {a.client_phone}</div>}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-10" style={{ color: "var(--txt3)" }}>
                <div className="text-4xl mb-3">🌙</div>
                <p className="text-sm">Keine Termine heute</p>
              </div>
            )}
          </div>
        )}

        {tab === "termine" && (
          <TermineTab appointments={appointments} isLoading={isLoading} refetch={refetch}
            updateStatus={updateStatus} remove={remove} />
        )}

        {tab === "services" && <ServicesTab />}
        {tab === "notifications" && <NotificationsTab settings={notifSettings} onSave={saveNotif.mutate} appointments={appointments} />}

        {tab === "settings" && (
          <div>
            <div className="section-label">Studio Info</div>
            <div className="beauty-card p-5 mb-4">
              <div className="text-[13px]" style={{ color: "var(--txt3)" }}>
                <div className="mb-1">📍 Wien, Österreich</div>
                <div className="mb-1">🌐 beautyv.lovable.app</div>
              </div>
            </div>

            {/* Vacation Management */}
            <VacationManager />

            <div className="section-label mt-4">Danger Zone</div>
            <div className="beauty-card p-5 border-[1.5px]" style={{ borderColor: "rgba(196,114,127,0.3)" }}>
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle size={18} style={{ color: "#C4727F", flexShrink: 0, marginTop: 2 }} />
                <p className="text-[12px]" style={{ color: "var(--txt2)" }}>Alle Termine löschen. Diese Aktion kann nicht rückgängig gemacht werden.</p>
              </div>
              <button onClick={() => { if (confirm("Wirklich ALLE Termine löschen?")) resetAll.mutate(); }}
                className="btn-rose w-full" style={{ background: "#C4727F" }}>
                🗑 Alle Termine löschen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TermineTab({ appointments, isLoading, refetch, updateStatus, remove }: {
  appointments: Appointment[];
  isLoading: boolean;
  refetch: () => void;
  updateStatus: any;
  remove: any;
}) {
  const [artistFilter, setArtistFilter] = useState<string>("all");
  const filtered = artistFilter === "all" ? appointments : appointments.filter((a) => a.artist_id === artistFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="section-label mb-0">Termine ({filtered.length})</div>
        <button onClick={() => refetch()} className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-full border cursor-pointer bg-transparent"
          style={{ borderColor: "var(--cream2)", color: "var(--txt3)", fontFamily: "var(--font-body)" }}>
          <RefreshCw size={11} /> Sync
        </button>
      </div>

      {/* Artist filter */}
      <div className="flex gap-2 mb-4">
        {[
          { id: "all", label: "Alle" },
          { id: "victoria", label: "🌸 Victoria" },
          { id: "cindy", label: "✨ Cindy" },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => setArtistFilter(id)}
            className="text-[11px] px-3 py-1.5 rounded-full border cursor-pointer bg-transparent"
            style={{
              borderColor: artistFilter === id ? "var(--rose-deep)" : "var(--cream2)",
              color: artistFilter === id ? "var(--rose-deep)" : "var(--txt3)",
              fontFamily: "var(--font-body)",
              fontWeight: artistFilter === id ? 600 : 400,
            }}>{label}</button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-10" style={{ color: "var(--txt3)" }}>Laden…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10" style={{ color: "var(--txt3)" }}>
          <div className="text-4xl mb-3">📭</div>
          <p className="text-sm">Keine Termine</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((a) => (
            <AppointmentCard key={a.id} appt={a}
              onStatus={(s) => updateStatus.mutate({ id: a.id, status: s })}
              onDelete={() => remove.mutate(a.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AppointmentCard({ appt, onStatus, onDelete }: {
  appt: Appointment;
  onStatus: (s: AppointmentStatus) => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const cfg = STATUS_CONFIG[appt.status as AppointmentStatus] || STATUS_CONFIG.pending;
  const isPending = appt.status === "pending";

  const handleSend = async (type: "confirmation" | "reminder_24h" | "reminder_2h") => {
    setSending(type);
    const result = await sendReminderNow(appt, type);
    setSending(null);
    alert(result);
  };

  return (
    <div className="beauty-card p-4">
      <div className="flex items-start justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{appt.client_name}</div>
          <div className="text-[11px] truncate" style={{ color: "var(--txt3)" }}>{appt.service} · {appt.artist_name}</div>
          <div className="text-[11px] mt-0.5" style={{ color: "var(--rose-deep)" }}>
            {new Date(appt.appointment_date).toLocaleDateString("de-AT", { day: "numeric", month: "short" })} · {appt.appointment_time}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
          <button onClick={(e) => { e.stopPropagation(); if (confirm("Termin löschen?")) onDelete(); }}
            className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer border-none"
            style={{ background: "rgba(196,114,127,0.1)", color: "#C4727F" }}>
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Quick accept/reject for pending */}
      {isPending && !expanded && (
        <div className="flex gap-2 mt-3">
          <button onClick={(e) => { e.stopPropagation(); onStatus("confirmed"); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-medium cursor-pointer border-none text-white"
            style={{ background: "#2d8a4e" }}>
            <Check size={13} /> Annehmen
          </button>
          <button onClick={(e) => { e.stopPropagation(); onStatus("cancelled"); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-medium cursor-pointer border-[1.5px] bg-transparent"
            style={{ borderColor: "#C4727F", color: "#C4727F" }}>
            ✕ Ablehnen
          </button>
        </div>
      )}

      {expanded && (
        <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--cream2)" }}>
          {(appt.client_email || appt.client_phone) && (
            <div className="flex flex-col gap-1.5 mb-4">
              {appt.client_email && <div className="flex items-center gap-2 text-[12px]" style={{ color: "var(--txt2)" }}><Mail size={12} /> {appt.client_email}</div>}
              {appt.client_phone && <div className="flex items-center gap-2 text-[12px]" style={{ color: "var(--txt2)" }}><Phone size={12} /> {appt.client_phone}</div>}
            </div>
          )}
          {appt.notes && <div className="text-[12px] px-3 py-2 rounded-xl mb-4" style={{ background: "var(--cream2)", color: "var(--txt2)" }}>📝 {appt.notes}</div>}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(["pending", "confirmed", "completed", "cancelled"] as AppointmentStatus[]).map((s) => (
              <button key={s} onClick={() => onStatus(s)}
                className="text-[11px] px-2.5 py-1 rounded-full border cursor-pointer bg-transparent"
                style={{
                  borderColor: appt.status === s ? STATUS_CONFIG[s].color : "var(--cream2)",
                  color: appt.status === s ? STATUS_CONFIG[s].color : "var(--txt3)",
                  fontFamily: "var(--font-body)", fontWeight: appt.status === s ? 600 : 400,
                }}>{STATUS_CONFIG[s].label}</button>
            ))}
          </div>
          {appt.client_email && (
            <div className="flex flex-col gap-2 mb-4">
              <div className="text-[11px] font-medium mb-1" style={{ color: "var(--txt3)" }}>E-Mail senden:</div>
              {[
                { type: "confirmation" as const, label: "Bestätigung", icon: "💌" },
                { type: "reminder_24h" as const, label: "Erinnerung 24h", icon: "📅" },
                { type: "reminder_2h"  as const, label: "Erinnerung 2h",  icon: "⏰" },
              ].map(({ type, label, icon }) => (
                <button key={type} onClick={() => handleSend(type)} disabled={!!sending}
                  className="flex items-center gap-2 text-[12px] px-3 py-2 rounded-xl border cursor-pointer bg-transparent"
                  style={{ borderColor: "var(--cream2)", color: "var(--txt2)", fontFamily: "var(--font-body)" }}>
                  {sending === type ? <RefreshCw size={12} /> : <Send size={12} />} {icon} {label}
                </button>
              ))}
            </div>
          )}
          <button onClick={() => { if (confirm("Termin löschen?")) onDelete(); }}
            className="flex items-center gap-1.5 text-[12px] cursor-pointer bg-transparent border-none"
            style={{ color: "#C4727F", fontFamily: "var(--font-body)" }}>
            <Trash2 size={13} /> Termin löschen
          </button>
        </div>
      )}
    </div>
  );
}

function ServicesTab() {
  const [prices, setPrices] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem("admin_prices") || "{}"); } catch { return {}; }
  });
  const [editing, setEditing] = useState<string | null>(null);
  const save = (key: string, val: string) => {
    const next = { ...prices, [key]: val };
    setPrices(next);
    localStorage.setItem("admin_prices", JSON.stringify(next));
    setEditing(null);
  };
  return (
    <div>
      {Object.entries(SERVICES).map(([artistId, cats]) => (
        <div key={artistId} className="mb-6">
          <div className="section-label">{artistId === "victoria" ? "\ud83c\udf38 Victoria" : "\u2728 Cindy"}</div>
          {cats.map((cat, ci) => (
            <div key={ci} className="mb-4">
              <div className="text-[12px] font-medium px-1 mb-2" style={{ color: "var(--txt3)" }}>{cat.emoji} {cat.category}</div>
              <div className="flex flex-col gap-2">
                {cat.items.map((item, ii) => {
                  const key = `${artistId}-${ci}-${ii}`;
                  const price = prices[key] ?? item.price;
                  return (
                    <div key={ii} className="beauty-card p-3.5 flex items-center gap-3">
                      <span className="text-lg flex-shrink-0">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium truncate">{item.name}</div>
                        <div className="text-[11px]" style={{ color: "var(--txt3)" }}>{item.duration}</div>
                      </div>
                      {editing === key ? (
                        <div className="flex items-center gap-1.5">
                          <input defaultValue={price} onKeyDown={(e) => { if (e.key === "Enter") save(key, (e.target as HTMLInputElement).value); }}
                            autoFocus className="beauty-input text-right w-24 py-1 px-2 text-sm" style={{ height: "auto" }} id={`inp-${key}`} />
                          <button onClick={() => save(key, (document.getElementById(`inp-${key}`) as HTMLInputElement)?.value || price)}
                            className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer border-none"
                            style={{ background: "var(--rose-deep)", color: "white" }}>
                            <Check size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-display font-semibold text-sm" style={{ color: "var(--rose-deep)" }}>{price}</span>
                          <button onClick={() => setEditing(key)}
                            className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer border-none"
                            style={{ background: "var(--blush)", color: "var(--rose-deep)" }}>\u270f\ufe0f</button>
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

function NotificationsTab({ settings, onSave, appointments }: {
  settings?: NotificationSettings;
  onSave: (s: Partial<NotificationSettings>) => void;
  appointments: Appointment[];
}) {
  const [form, setForm] = useState<Partial<NotificationSettings>>({});
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState("");

  useEffect(() => { if (settings) setForm(settings); }, [settings]);

  const merged = { ...settings, ...form } as NotificationSettings;
  const set = (k: keyof NotificationSettings, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handleTest = async () => {
    if (!merged.studio_email) { setTestResult("Bitte Studio-E-Mail eingeben"); return; }
    setTesting(true);
    const { error } = await supabase.functions.invoke("send-email", {
      body: {
        to: merged.studio_email,
        subject: "\u2705 Vego Beauty \u2014 Resend Verbindungstest",
        html: `<div style="font-family:Arial;padding:32px;background:#fdf5f2;border-radius:16px;max-width:480px;margin:auto;"><h2 style="color:#C97A7A;font-weight:400;margin:0 0 16px;">Verbindungstest \u2713</h2><p style="color:#5c4a46;">Resend ist korrekt konfiguriert! E-Mail-Benachrichtigungen sind aktiv.</p></div>`,
      },
    });
    setTesting(false);
    setTestResult(error ? `Fehler: ${error.message}` : "\u2713 Test-E-Mail gesendet!");
  };

  const total = appointments.length;
  const c24h = appointments.filter((a) => a.reminder_24h_sent).length;
  const c2h  = appointments.filter((a) => a.reminder_2h_sent).length;
  const cConf = appointments.filter((a) => a.confirmation_sent).length;

  return (
    <div>
      <div className="section-label">Statistik</div>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { label: "Best\u00e4tigung", value: cConf, icon: "\ud83d\udc8c", color: "var(--rose-deep)" },
          { label: "24h Reminder",  value: c24h,  icon: "\ud83d\udcc5",   color: "var(--gold)" },
          { label: "2h Reminder",   value: c2h,   icon: "\u23f0",         color: "#E8954A" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="beauty-card p-3 text-center">
            <div className="text-xl mb-1">{icon}</div>
            <div className="font-display text-2xl font-medium" style={{ color }}>{value}/{total}</div>
            <div className="text-[10px]" style={{ color: "var(--txt3)" }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="section-label">Resend Konfiguration</div>
      <div className="beauty-card p-5 mb-5">
        <div className="mb-4">
          <label className="text-[12px] font-medium block mb-1.5" style={{ color: "var(--txt2)" }}>Resend API Key</label>
          <div className="flex gap-2">
            <input type={showKey ? "text" : "password"} value={merged.resend_api_key || ""}
              onChange={(e) => set("resend_api_key", e.target.value)}
              placeholder="re_xxxxxxxxxxxxxxxx" className="beauty-input flex-1 text-sm" />
            <button onClick={() => setShowKey(!showKey)} className="w-10 h-10 rounded-xl border flex items-center justify-center cursor-pointer bg-transparent"
              style={{ borderColor: "var(--cream2)", color: "var(--txt3)" }}>
              {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <p className="text-[11px] mt-1.5" style={{ color: "var(--txt3)" }}>
            Von <a href="https://resend.com" target="_blank" rel="noreferrer" style={{ color: "var(--rose-deep)" }}>resend.com</a> \u2014 kostenlos bis 3.000 E-Mails/Monat
          </p>
        </div>
        <div className="mb-4">
          <label className="text-[12px] font-medium block mb-1.5" style={{ color: "var(--txt2)" }}>Studio E-Mail</label>
          <input type="email" value={merged.studio_email || ""} onChange={(e) => set("studio_email", e.target.value)}
            placeholder="studio@vegobeauty.at" className="beauty-input w-full text-sm" />
        </div>
        <div className="mb-4">
          <label className="text-[12px] font-medium block mb-1.5" style={{ color: "var(--txt2)" }}>Victoria\u2019s E-Mail</label>
          <input type="email" value={merged.artist_victoria_email || ""} onChange={(e) => set("artist_victoria_email", e.target.value)}
            placeholder="victoria@vegobeauty.at" className="beauty-input w-full text-sm" />
        </div>
        <div className="mb-5">
          <label className="text-[12px] font-medium block mb-1.5" style={{ color: "var(--txt2)" }}>Cindy\u2019s E-Mail</label>
          <input type="email" value={merged.artist_cindy_email || ""} onChange={(e) => set("artist_cindy_email", e.target.value)}
            placeholder="cindy@vegobeauty.at" className="beauty-input w-full text-sm" />
        </div>

        <div className="section-label mb-3">Automatische Benachrichtigungen</div>
        {[
          { key: "email_confirmation_enabled" as const, label: "Buchungsbest\u00e4tigung", desc: "Sofort nach Terminanfrage", icon: "\ud83d\udc8c" },
          { key: "email_24h_enabled"           as const, label: "Erinnerung 24h vorher",   desc: "Automatisch via pg_cron",   icon: "\ud83d\udcc5" },
          { key: "email_2h_enabled"            as const, label: "Erinnerung 2h vorher",    desc: "Automatisch via pg_cron",   icon: "\u23f0" },
        ].map(({ key, label, desc, icon }) => (
          <div key={key} className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid var(--cream2)" }}>
            <div className="flex items-center gap-2.5">
              <span className="text-lg">{icon}</span>
              <div>
                <div className="text-[13px] font-medium">{label}</div>
                <div className="text-[11px]" style={{ color: "var(--txt3)" }}>{desc}</div>
              </div>
            </div>
            <button onClick={() => set(key, !merged[key])}
              className="relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer border-none flex-shrink-0"
              style={{ background: merged[key] ? "var(--rose-deep)" : "var(--cream2)" }}>
              <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300"
                style={{ left: merged[key] ? "calc(100% - 22px)" : "2px" }} />
            </button>
          </div>
        ))}

        <div className="flex gap-2 mt-5">
          <button onClick={() => onSave(form)} className="btn-rose flex-1 flex items-center justify-center gap-1.5">
            <Save size={14} /> Speichern
          </button>
          <button onClick={handleTest} disabled={testing}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl border cursor-pointer bg-transparent text-sm font-medium"
            style={{ borderColor: "var(--cream2)", color: "var(--txt2)", fontFamily: "var(--font-body)" }}>
            {testing ? <RefreshCw size={14} /> : <Send size={14} />} Test E-Mail
          </button>
        </div>
        {testResult && (
          <div className="mt-3 text-center text-[12px] py-2 rounded-xl"
            style={{ background: testResult.startsWith("\u2713") ? "rgba(45,138,78,0.1)" : "rgba(196,114,127,0.1)", color: testResult.startsWith("\u2713") ? "#2d8a4e" : "#C4727F" }}>
            {testResult}
          </div>
        )}
      </div>

      <div className="beauty-card p-4" style={{ background: "rgba(201,169,110,0.08)" }}>
        <div className="text-[12px] font-medium mb-2" style={{ color: "var(--gold)" }}>\u2699\ufe0f Automatische Erinnerungen</div>
        <p className="text-[11px] leading-relaxed" style={{ color: "var(--txt2)" }}>
          F\u00fcr automatische 24h/2h-Reminder, aktiviere pg_cron in deinem Supabase-Dashboard:<br/>
          <strong>Database \u2192 Extensions \u2192 pg_cron \u2192 Enable</strong><br/>
          Dann f\u00fchre den SQL-Befehl aus der Migration-Datei aus.
        </p>
      </div>
    </div>
  );
}

function VacationManager() {
  const [artistId, setArtistId] = useState("victoria");
  const [vacations, setVacations] = useState<{ id: string; vacation_date: string; reason: string }[]>([]);
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");

  const loadVacations = () => {
    supabase
      .from("artist_vacations" as any)
      .select("*")
      .eq("artist_id", artistId)
      .order("vacation_date", { ascending: true })
      .then(({ data }) => setVacations((data as any) || []));
  };

  useEffect(() => { loadVacations(); }, [artistId]);

  const addVacation = async () => {
    if (!newDate) return;
    await supabase.from("artist_vacations" as any).insert({
      artist_id: artistId,
      vacation_date: newDate,
      reason: newReason,
    } as any);
    setNewDate("");
    setNewReason("");
    loadVacations();
  };

  const removeVacation = async (id: string) => {
    await supabase.from("artist_vacations" as any).delete().eq("id", id);
    loadVacations();
  };

  return (
    <div>
      <div className="section-label">🏖 Urlaub / Congés</div>
      <div className="flex gap-2 mb-4">
        {[
          { id: "victoria", label: "🌸 Victoria" },
          { id: "cindy", label: "✨ Cindy" },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => setArtistId(id)}
            className="text-[11px] px-3 py-1.5 rounded-full border cursor-pointer bg-transparent"
            style={{
              borderColor: artistId === id ? "var(--rose-deep)" : "var(--cream2)",
              color: artistId === id ? "var(--rose-deep)" : "var(--txt3)",
              fontFamily: "var(--font-body)",
              fontWeight: artistId === id ? 600 : 400,
            }}>{label}</button>
        ))}
      </div>

      {/* Add vacation */}
      <div className="beauty-card p-4 mb-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}
              className="beauty-input flex-1 text-sm" style={{ height: "auto", padding: "8px 12px" }} />
          </div>
          <input value={newReason} onChange={(e) => setNewReason(e.target.value)}
            placeholder="Grund (optional)" className="beauty-input text-sm" style={{ height: "auto", padding: "8px 12px" }} />
          <button onClick={addVacation} className="btn-rose text-[12px] py-2">
            + Urlaub hinzufügen
          </button>
        </div>
      </div>

      {/* Vacation list */}
      {vacations.length === 0 ? (
        <div className="text-center py-6" style={{ color: "var(--txt3)" }}>
          <p className="text-[12px]">Keine Urlaubstage eingetragen</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mb-6">
          {vacations.map((v) => (
            <div key={v.id} className="beauty-card p-3 flex items-center justify-between">
              <div>
                <div className="text-[13px] font-medium">
                  {new Date(v.vacation_date + "T00:00:00").toLocaleDateString("de-AT", { weekday: "short", day: "numeric", month: "long" })}
                </div>
                {v.reason && <div className="text-[11px]" style={{ color: "var(--txt3)" }}>{v.reason}</div>}
              </div>
              <button onClick={() => removeVacation(v.id)}
                className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer border-none"
                style={{ background: "rgba(196,114,127,0.1)", color: "#C4727F" }}>
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
