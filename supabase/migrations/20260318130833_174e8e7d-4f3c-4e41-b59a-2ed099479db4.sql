CREATE TABLE public.artist_vacations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id text NOT NULL,
  vacation_date date NOT NULL,
  reason text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(artist_id, vacation_date)
);

ALTER TABLE public.artist_vacations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to artist_vacations"
ON public.artist_vacations
FOR ALL
TO public
USING (true)
WITH CHECK (true);