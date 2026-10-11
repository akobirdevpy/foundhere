UPDATE public.items SET class_name = NULL WHERE class_name IS NOT NULL AND class_name !~ '^(5|6|7|8|9|10|11)-(A|B|D|E)$';
ALTER TABLE public.items ADD CONSTRAINT items_class_name_check CHECK (class_name IS NULL OR class_name ~ '^(5|6|7|8|9|10|11)-(A|B|D|E)$');
ALTER TABLE public.items ADD CONSTRAINT items_kind_fields_check CHECK (category <> '' AND location <> '');