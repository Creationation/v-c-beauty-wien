import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};
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
    const rose = "#C97A7A";
    const hdr = `<div style="background:${rose};padding:32px;text-align:center"><h1 style="color:white;margin:0;font-weight:300;letter-spacing:2px;font-size:26px">VEGO BEAUTY</h1></div>`;
    const ftr = `<div style="background:#F5EDE5;padding:14px;text-align:center"><p style="color:#aaa;font-size:11px;margin:0">Vego Beauty Wien</p></div>`;
    const makeRow = (l: string, v: string) => `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #F0E8E0"><span style="color:#999;font-size:13px">${l}</span><span style="font-weight:600;font-size:13px">${v}</span></div>`;
    const box = `<div style="background:white;border-radius:12px;padding:20px;border:1px solid #F0E8E0;margin:20px 0">${makeRow("Expertin", appt.artist_name)}${makeRow("Service", appt.service)}${makeRow("Datum", appt.appointment_date)}${makeRow("Uhrzeit", appt.appointment_time + " Uhr")}</div>`;
    let subject: string; let html: string;
    if (type === "confirmation") {
      subject = "Terminbestaetigung - Vego Beauty Wien";
      html = hdr + `<div style="padding:28px;font-family:Georgia,serif;max-width:500px;margin:0 auto"><h2 style="color:${rose};font-weight:400">Dein Termin ist bestaetigt!</h2><p style="color:#555;font-size:14px;line-height:1.6">Hallo ${appt.client_name}, wir freuen uns auf deinen Besuch!</p>${box}<p style="color:${rose};text-align:center;font-size:13px">Mit Liebe, dein Vego Beauty Team</p></div>` + ftr;
    } else if (type === "reminder_24h") {
      subject = "Morgen ist dein Termin - Vego Beauty Wien";
      html = hdr + `<div style="padding:28px;font-family:Georgia,serif;max-width:500px;margin:0 auto"><h2 style="color:${rose};font-weight:400">Morgen ist dein Termin!</h2><p style="color:#555;font-size:14px">Hallo ${appt.client_name},</p>${box}<p style="color:${rose};text-align:center;font-size:13px">Wir freuen uns auf dich!</p></div>` + ftr;
    } else if (type === "reminder_2h") {
      subject = "In 2 Stunden - dein Termin bei Vego Beauty";
      html = hdr + `<div style="padding:28px;font-family:Georgia,serif;max-width:500px;margin:0 auto"><h2 style="color:${rose};font-weight:400">In 2 Stunden!</h2><p style="color:#555;font-size:14px">Hallo ${appt.client_name}, gleich geht es los!</p>${box}<p style="color:${rose};text-align:center;font-size:13px">Bis gleich!</p></div>` + ftr;
    } else {
      return new Response(JSON.stringify({ error: "unknown type" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }
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
