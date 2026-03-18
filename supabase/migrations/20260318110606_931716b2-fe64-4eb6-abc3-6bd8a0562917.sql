
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL DEFAULT '',
  client_email TEXT DEFAULT '',
  client_phone TEXT DEFAULT '',
  artist_id TEXT NOT NULL DEFAULT '',
  artist_name TEXT NOT NULL DEFAULT '',
  service TEXT NOT NULL DEFAULT '',
  service_price TEXT DEFAULT '',
  appointment_date TEXT NOT NULL DEFAULT '',
  appointment_time TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT DEFAULT '',
  notify_24h BOOLEAN DEFAULT true,
  notify_2h BOOLEAN DEFAULT true,
  reminder_24h_sent BOOLEAN DEFAULT false,
  reminder_2h_sent BOOLEAN DEFAULT false,
  confirmation_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to appointments" ON public.appointments
  FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.notification_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  resend_api_key TEXT DEFAULT '',
  studio_email TEXT DEFAULT '',
  artist_victoria_email TEXT DEFAULT '',
  artist_cindy_email TEXT DEFAULT '',
  email_confirmation_enabled BOOLEAN DEFAULT true,
  email_24h_enabled BOOLEAN DEFAULT true,
  email_2h_enabled BOOLEAN DEFAULT true
);

ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to notification_settings" ON public.notification_settings
  FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.notification_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
