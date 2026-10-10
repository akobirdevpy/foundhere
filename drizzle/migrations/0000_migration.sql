CREATE TABLE public.items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('lost','found')),
  title text NOT NULL CHECK (char_length(title) BETWEEN 2 AND 120),
  description text CHECK (char_length(description) <= 1000),
  category text NOT NULL,
  location text NOT NULL,
  class_name text,
  kept_at text,
  contact_name text NOT NULL CHECK (char_length(contact_name) BETWEEN 2 AND 80),
  contact_info text CHECK (char_length(contact_info) <= 120),
  photo_url text,
  item_date date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.items TO anon, authenticated;
GRANT ALL ON public.items TO service_role;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view items" ON public.items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can post items" ON public.items FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Public read item photos" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'item-photos');
CREATE POLICY "Anyone upload item photos" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'item-photos');

INSERT INTO public.items (kind,title,description,category,location,class_name,kept_at,contact_name,contact_info) VALUES
('found','Ko''k suv idishi','Plastik, ustida yulduzcha stikeri bor','bottle','canteen','7-B','teachers_room','Dilnoza opa','Navbatchi xona'),
('lost','Qora sumka','Ichida matematika daftari bor','bag','sports_hall','9-A',NULL,'Jasur','+998 90 000 00 00'),
('found','Kalkulyator Casio','Kompyuter xonasida qoldirilgan','electronics','computer_room','10-V','deputy_room','Aziz aka',NULL);