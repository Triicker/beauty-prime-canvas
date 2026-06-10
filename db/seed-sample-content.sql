-- Optional seed to make the admin dashboard useful during the first test.

insert into service_categories (slug, name_pt, name_en, name_fr, sort_order)
values
  ('featured', 'Em Destaque', 'Featured', 'En vedette', 1),
  ('wellness', 'Wellness Spa', 'Wellness Spa', 'Wellness Spa', 2)
on conflict (slug) do update
set
  name_pt = excluded.name_pt,
  name_en = excluded.name_en,
  name_fr = excluded.name_fr,
  sort_order = excluded.sort_order;

insert into services (
  category_id,
  slug,
  name_pt,
  name_en,
  name_fr,
  description_pt,
  price_label,
  duration_label,
  is_featured,
  sort_order
)
select
  c.id,
  'balayage',
  'Balayage',
  'Balayage',
  'Balayage',
  'Mechas iluminadas com resultado natural e duradouro.',
  'a partir de EUR 120',
  '4 h',
  true,
  1
from service_categories c
where c.slug = 'featured'
on conflict (slug) do update
set
  category_id = excluded.category_id,
  name_pt = excluded.name_pt,
  name_en = excluded.name_en,
  name_fr = excluded.name_fr,
  description_pt = excluded.description_pt,
  price_label = excluded.price_label,
  duration_label = excluded.duration_label,
  is_featured = excluded.is_featured,
  sort_order = excluded.sort_order;

insert into products (
  slug,
  name_pt,
  name_en,
  name_fr,
  description_pt,
  price,
  category,
  is_featured,
  sort_order
)
values (
  'shampoo-hidratante',
  'Shampoo Hidratante',
  'Hydrating Shampoo',
  'Shampooing hydratant',
  'Limpeza suave com hidratacao profunda para fios secos e quebradicos.',
  28.00,
  'cuidado',
  true,
  1
)
on conflict (slug) do update
set
  name_pt = excluded.name_pt,
  name_en = excluded.name_en,
  name_fr = excluded.name_fr,
  description_pt = excluded.description_pt,
  price = excluded.price,
  category = excluded.category,
  is_featured = excluded.is_featured,
  sort_order = excluded.sort_order;

insert into professionals (name, role_pt, role_en, role_fr, sort_order)
values ('Marina Loreti', 'Fundadora', 'Founder', 'Fondatrice', 1)
on conflict do nothing;

insert into professional_spaces (
  slug,
  name_pt,
  name_en,
  name_fr,
  description_pt,
  benefits_pt,
  sort_order
)
values (
  'cadeira-individual',
  'Cadeira Individual',
  'Individual Chair',
  'Chaise individuelle',
  'Estacao privada para profissionais da beleza.',
  '["Aluguer flexivel", "Wifi premium", "Ambiente LOMA"]'::jsonb,
  1
)
on conflict (slug) do update
set
  name_pt = excluded.name_pt,
  name_en = excluded.name_en,
  name_fr = excluded.name_fr,
  description_pt = excluded.description_pt,
  benefits_pt = excluded.benefits_pt,
  sort_order = excluded.sort_order;

insert into gallery_images (title_pt, category, image_url, sort_order)
values (
  'Imagem de teste',
  'salon',
  'https://placehold.co/900x1200?text=LOMA',
  1
)
on conflict do nothing;
