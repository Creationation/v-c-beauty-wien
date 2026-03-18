CREATE TABLE public.team_members (
  id text PRIMARY KEY,
  name text NOT NULL,
  handle text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  experience text NOT NULL DEFAULT '',
  languages text[] NOT NULL DEFAULT '{}',
  bio text NOT NULL DEFAULT '',
  instagram text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  specialties text[] NOT NULL DEFAULT '{}',
  rating numeric NOT NULL DEFAULT 5.0,
  reviews integer NOT NULL DEFAULT 0,
  emoji text NOT NULL DEFAULT '🌟',
  is_fixed boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to team_members"
ON public.team_members
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Seed Victoria and Cindy as fixed members
INSERT INTO public.team_members (id, name, handle, role, experience, languages, bio, instagram, whatsapp, specialties, rating, reviews, emoji, is_fixed, is_active, sort_order)
VALUES
  ('victoria', 'Victoria', '@dr.permanent_v', 'Permanent Makeup Artist', '13+ Jahre Erfahrung', ARRAY['EN','DE','UA','RU'], 'Spezialistin für Permanent Make-up mit modernsten Techniken. Zertifizierte Pigmente, sterile Instrumente, natürliche Ergebnisse.', 'https://instagram.com/dr.permanent_v', '436601234567', ARRAY['Lip Blushing','Powder Brows','Eyeliner','Sugaring'], 4.9, 127, '🌸', true, true, 0),
  ('cindy', 'Cindy', '@cbeautyvienna', 'Pro Hair & Makeup Artist', 'Certified Professional', ARRAY['DE','EN'], 'Zertifizierte Hair & Makeup Artist. Braut Make-up, Events, Film & Werbung, Lash & Brow Lifting, Workshops.', 'https://instagram.com/cbeautyvienna', '436649876543', ARRAY['Bridal','Hairstyling','Lash Lifting','Coaching'], 5.0, 89, '✨', true, true, 1);