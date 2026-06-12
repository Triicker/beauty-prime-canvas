-- Estrutura dos banners de marketing da home.
-- Rode no DBeaver conectado ao banco do Render.
-- Pode rodar novamente: cria/atualiza a tabela e mantém o banner inicial.

create table if not exists marketing_slides (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  eyebrow text,
  title text not null,
  description text,
  button_label text,
  button_href text,
  image_url text not null,
  alt_text text,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_marketing_slides_visible_order
  on marketing_slides(is_visible, sort_order);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_marketing_slides_updated_at on marketing_slides;
create trigger trg_marketing_slides_updated_at
before update on marketing_slides
for each row execute function set_updated_at();

insert into marketing_slides (
  slug,
  eyebrow,
  title,
  description,
  button_label,
  button_href,
  image_url,
  alt_text,
  is_visible,
  sort_order
)
values (
  'ritual-caracois-e-ondas',
  'Novidade',
  'Ritual de Caracóis e Ondas',
  'Definição, brilho e hidratação profunda para caracóis e ondas perfeitas.',
  'Ver produtos',
  '/loja',
  'https://midiasave-5c064.web.app/marketing1.png',
  'Ritual de Caracóis e Ondas com produtos LOMA',
  true,
  10
)
on conflict (slug) do update
set
  eyebrow = excluded.eyebrow,
  title = excluded.title,
  description = excluded.description,
  button_label = excluded.button_label,
  button_href = excluded.button_href,
  image_url = excluded.image_url,
  alt_text = excluded.alt_text,
  is_visible = excluded.is_visible,
  sort_order = excluded.sort_order;
