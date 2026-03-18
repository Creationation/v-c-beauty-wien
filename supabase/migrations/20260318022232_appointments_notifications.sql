-- Appointments table for notification system
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_email TEXT DEFAULT '',
  client_phone TEXT DEFAULT '',
  artist_id TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  service TEXT NOT NULL,
  service_price TEXT DEFAULT '',
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT DEFAULT '',
  notify_24h BOOLEAN DEFAULT true,
  notify_2h BOOLEAN DEFAULT true,
  reminder_24h_sent BOOLEAN DEFAULT false,
  reminder_2h_sent BOOLEAN DEFAULT false,
  confirmation_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_appointments" ON public.appointments FOR ALL USING (true) WITH CHECK (true);

-- Notification settings table
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  resend_api_key TEXT DEFAULT 're_DJQj7qZc_PBuqmFyi3XhM5i1u3TzM5x2D',
  studio_email TEXT DEFAULT '',
  artist_victoria_email TEXT DEFAULT '',
  artist_cindy_email TEXT DEFAULT '',
  email_confirmation_enabled BOOLEAN DEFAULT true,
  email_24h_enabled BOOLEAN DEFAULT true,
  email_2h_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_settings" ON public.notification_settings FOR ALL USING (true) WITH CHECK (true);

-- Seed default settings row
INSERT INTO public.notification_settings (id, resend_api_key)
VALUES (1, 're_DJQj7qZc_PBuqmFyi3XhM5i1u3TzM5x2D')
ON CONFLICT (id) DO NOTHING;

-- Seed 3 test appointments
INSERT INTO public.appointments (client_name, client_email, client_phone, artist_id, artist_name, service, service_price, appointment_date, appointment_time, status, notes)
VALUES
  ('Maria Huber', 'maria.huber@gmail.com', '+43 664 1234567', 'victoria', 'Victoria', 'Microblading Augenbrauen', 'ab 280€', CURRENT_DATE, '10:00', 'confirmed', 'Ersttermin'),
  ('Sophie Mueller', 'sophie.mueller@gmail.com', '+43 676 2345678', 'cindy', 'Cindy', 'Wimpernverlaengerung Classic', 'ab 120€', CURRENT_DATE + 1, '14:00', 'pending', ''),
  ('Anna Weber', 'anna.weber@gmail.com', '+43 650 3456789', 'victoria', 'Victoria', 'Powder Brows', 'ab 320€', CURRENT_DATE + 2, '11:30', 'pending', 'Allergisch gegen Latex')
ON CONFLICT DO NOTHING;

-- pg_cron for automatic reminders (run in Supabase SQL editor after enabling pg_cron extension):
-- SELECT cron.schedule('check-reminders-hourly', '0 * * * *', $$
--   SELECT net.http_post(
--     url := 'https://tsjmuemyerrhtebyrkrb.supabase.co/functions/v1/check-reminders',
--     headers := '{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
--   );
-- $$);
