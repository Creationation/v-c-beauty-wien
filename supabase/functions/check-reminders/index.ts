import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const now = new Date();
  const results: any[] = [];
  const { data: appointments } = await sb.from("appointments").select("*").in("status", ["pending", "confirmed"]).or("reminder_24h_sent.eq.false,reminder_2h_sent.eq.false");
  if (!appointments) return new Response(JSON.stringify({ checked: 0 }), { headers: { ...cors, "Content-Type": "application/json" } });
  for (const appt of appointments) {
    if (!appt.client_email) continue;
    const apptTime = new Date(appt.appointment_date + "T" + appt.appointment_time);
    const diffMin = (apptTime.getTime() - now.getTime()) / 60000;
    if (!appt.reminder_24h_sent && appt.notify_24h && diffMin > 22 * 60 && diffMin < 26 * 60) {
      const r = await sb.functions.invoke("send-email", { body: { type: "reminder_24h", appointment_id: appt.id } });
      results.push({ id: appt.id, type: "24h", ok: !r.error });
    }
    if (!appt.reminder_2h_sent && appt.notify_2h && diffMin > 100 && diffMin < 140) {
      const r = await sb.functions.invoke("send-email", { body: { type: "reminder_2h", appointment_id: appt.id } });
      results.push({ id: appt.id, type: "2h", ok: !r.error });
    }
  }
  return new Response(JSON.stringify({ checked: appointments.length, sent: results.length, results }), { headers: { ...cors, "Content-Type": "application/json" } });
});
