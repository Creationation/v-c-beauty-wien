import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/* ── Date formatting helpers ── */
const DAYS_DE = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const MONTHS_DE = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

function formatDateDE(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${DAYS_DE[d.getDay()]} ${d.getDate()} ${MONTHS_DE[d.getMonth()]} ${d.getFullYear()}`;
}

/* ── Email template builder ── */
function buildEmail(opts: {
  title: string;
  subtitle: string;
  greeting: string;
  artistName: string;
  service: string;
  servicePrice: string;
  date: string;
  time: string;
  closingText: string;
  whatsappNumber: string;
  studioEmail: string;
}) {
  const rose = "#C97A7A";
  const cream = "#FDF8F4";
  const creamDark = "#F0E8E0";
  const textDark = "#2D2926";
  const textMuted = "#8A8380";
  const font = "'Helvetica Neue', Helvetica, Arial, sans-serif";

  const whatsappUrl = `https://wa.me/${opts.whatsappNumber}?text=${encodeURIComponent("Hallo, ich habe eine Frage zu meinem Termin bei Vego Beauty.")}`;

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${cream};font-family:${font};-webkit-font-smoothing:antialiased">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${cream}">
<tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">

  <!-- HEADER -->
  <tr><td style="background:${rose};padding:28px 32px;text-align:center;border-radius:16px 16px 0 0">
    <p style="margin:0;color:rgba(255,255,255,0.9);font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:400">Wien</p>
    <h1 style="margin:6px 0 0;color:#fff;font-size:24px;font-weight:600;letter-spacing:3px">VEGO BEAUTY</h1>
  </td></tr>

  <!-- BODY -->
  <tr><td style="background:#ffffff;padding:36px 32px 28px;border-left:1px solid ${creamDark};border-right:1px solid ${creamDark}">

    <!-- Title -->
    <h2 style="margin:0 0 6px;font-size:22px;font-weight:600;color:${textDark}">${opts.title}</h2>
    <p style="margin:0 0 24px;font-size:14px;color:${textMuted};line-height:1.5">${opts.greeting}</p>

    <!-- Appointment card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${cream};border-radius:12px;border:1px solid ${creamDark}">
      <tr><td style="padding:20px 24px">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <!-- Service -->
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid ${creamDark};font-size:12px;color:${textMuted};text-transform:uppercase;letter-spacing:0.5px">Service</td>
            <td style="padding:8px 0;border-bottom:1px solid ${creamDark};font-size:14px;font-weight:600;color:${textDark};text-align:right">${opts.service}</td>
          </tr>
          <!-- Expertin -->
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid ${creamDark};font-size:12px;color:${textMuted};text-transform:uppercase;letter-spacing:0.5px">Expertin</td>
            <td style="padding:8px 0;border-bottom:1px solid ${creamDark};font-size:14px;font-weight:600;color:${textDark};text-align:right">${opts.artistName}</td>
          </tr>
          <!-- Datum -->
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid ${creamDark};font-size:12px;color:${textMuted};text-transform:uppercase;letter-spacing:0.5px">Datum</td>
            <td style="padding:8px 0;border-bottom:1px solid ${creamDark};font-size:14px;font-weight:600;color:${textDark};text-align:right">${opts.date}</td>
          </tr>
          <!-- Uhrzeit -->
          <tr>
            <td style="padding:8px 0;font-size:12px;color:${textMuted};text-transform:uppercase;letter-spacing:0.5px">Uhrzeit</td>
            <td style="padding:8px 0;font-size:14px;font-weight:600;color:${textDark};text-align:right">${opts.time} Uhr</td>
          </tr>
        </table>

        <!-- Price -->
        ${opts.servicePrice ? `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;border-top:2px solid ${creamDark}">
          <tr>
            <td style="padding:12px 0 0;font-size:13px;font-weight:700;color:${textDark}">Gesamt</td>
            <td style="padding:12px 0 0;font-size:18px;font-weight:700;color:${rose};text-align:right">${opts.servicePrice}</td>
          </tr>
        </table>` : ""}

      </td></tr>
    </table>

    <!-- Closing text -->
    <p style="margin:24px 0 0;font-size:13px;color:${textMuted};line-height:1.6;text-align:center">${opts.closingText}</p>

  </td></tr>

  <!-- CONTACT BUTTONS -->
  <tr><td style="background:#ffffff;padding:0 32px 32px;border-left:1px solid ${creamDark};border-right:1px solid ${creamDark}">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding-right:6px" width="50%">
          <a href="${whatsappUrl}" target="_blank" style="display:block;text-align:center;background:#25D366;color:#ffffff;font-size:13px;font-weight:600;padding:12px 8px;border-radius:10px;text-decoration:none">
            💬&nbsp; WhatsApp
          </a>
        </td>
        <td style="padding-left:6px" width="50%">
          <a href="mailto:${opts.studioEmail}?subject=Frage%20zu%20meinem%20Termin" style="display:block;text-align:center;background:${rose};color:#ffffff;font-size:13px;font-weight:600;padding:12px 8px;border-radius:10px;text-decoration:none">
            ✉️&nbsp; E-Mail
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:12px 0 0;font-size:11px;color:${textMuted};text-align:center">Bei Fragen erreichst du uns jederzeit</p>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:${cream};padding:20px 32px;text-align:center;border-radius:0 0 16px 16px;border:1px solid ${creamDark};border-top:0">
    <p style="margin:0;font-size:11px;color:${textMuted}">Vego Beauty Wien &middot; Mit Liebe für dich ♡</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

/* ── WhatsApp number lookup by artist ── */
const ARTIST_WHATSAPP: Record<string, string> = {
  victoria: "436601234567",
  cindy: "436649876543",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { type, appointment_id } = await req.json();

    const { data: appt } = await sb.from("appointments").select("*").eq("id", appointment_id).single();
    if (!appt) return new Response(JSON.stringify({ error: "not found" }), { status: 404, headers: { ...cors, "Content-Type": "application/json" } });

    const { data: cfg } = await sb.from("notification_settings").select("*").eq("id", 1).single();
    const apiKey = cfg?.resend_api_key || Deno.env.get("RESEND_API_KEY") || "";
    if (!apiKey) return new Response(JSON.stringify({ error: "no key" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });

    if (type === "confirmation" && cfg?.email_confirmation_enabled === false) return new Response(JSON.stringify({ skipped: true }), { headers: { ...cors, "Content-Type": "application/json" } });
    if (type === "reminder_24h" && cfg?.email_24h_enabled === false) return new Response(JSON.stringify({ skipped: true }), { headers: { ...cors, "Content-Type": "application/json" } });
    if (type === "reminder_2h" && cfg?.email_2h_enabled === false) return new Response(JSON.stringify({ skipped: true }), { headers: { ...cors, "Content-Type": "application/json" } });
    if (!appt.client_email) return new Response(JSON.stringify({ error: "no email" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });

    const whatsappNumber = ARTIST_WHATSAPP[appt.artist_id] || "436601234567";
    const studioEmail = cfg?.studio_email || "Info@ugcpanel.app";
    const formattedDate = formatDateDE(appt.appointment_date);

    let subject: string;
    let title: string;
    let greeting: string;
    let closingText: string;

    if (type === "confirmation") {
      subject = "Terminbestätigung – Vego Beauty Wien";
      title = "Dein Termin ist bestätigt ✓";
      greeting = `Hallo ${appt.client_name}, wir freuen uns auf deinen Besuch!`;
      closingText = "Bitte sei 5 Minuten vor deinem Termin da. Bei Verhinderung sag uns bitte rechtzeitig Bescheid.";
    } else if (type === "reminder_24h") {
      subject = "Erinnerung: Morgen ist dein Termin – Vego Beauty";
      title = "Morgen ist es soweit!";
      greeting = `Hallo ${appt.client_name}, dein Termin ist morgen.`;
      closingText = "Wir freuen uns auf dich! Falls du nicht kommen kannst, gib uns bitte Bescheid.";
    } else if (type === "reminder_2h") {
      subject = "In 2 Stunden: Dein Termin bei Vego Beauty";
      title = "Gleich geht es los!";
      greeting = `Hallo ${appt.client_name}, in 2 Stunden ist dein Termin.`;
      closingText = "Bis gleich! Wir freuen uns schon.";
    } else {
      return new Response(JSON.stringify({ error: "unknown type" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }

    const html = buildEmail({
      title,
      subtitle: subject,
      greeting,
      artistName: appt.artist_name,
      service: appt.service,
      servicePrice: appt.service_price || "",
      date: formattedDate,
      time: appt.appointment_time,
      closingText,
      whatsappNumber,
      studioEmail,
    });

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "Vego Beauty <Info@ugcpanel.app>", to: [appt.client_email], subject, html }),
    });

    const rd = await resendRes.json();
    if (!resendRes.ok) return new Response(JSON.stringify({ error: rd }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });

    const upd = type === "confirmation" ? { confirmation_sent: true } : type === "reminder_24h" ? { reminder_24h_sent: true } : { reminder_2h_sent: true };
    await sb.from("appointments").update(upd).eq("id", appointment_id);

    return new Response(JSON.stringify({ success: true, id: rd.id }), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
