create extension if not exists pgcrypto;
create extension if not exists btree_gist;

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admin_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references admin_users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_pt text not null,
  name_en text,
  name_fr text,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references service_categories(id) on delete set null,
  slug text unique not null,
  name_pt text not null,
  name_en text,
  name_fr text,
  description_pt text,
  description_en text,
  description_fr text,
  price_label text,
  duration_label text,
  image_url text,
  is_featured boolean not null default false,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_pt text not null,
  name_en text,
  name_fr text,
  description_pt text,
  description_en text,
  description_fr text,
  price numeric(10, 2),
  category text,
  categories text[] not null default '{}',
  image_url text,
  is_featured boolean not null default false,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists professionals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_pt text,
  role_en text,
  role_fr text,
  bio_pt text,
  bio_en text,
  bio_fr text,
  image_url text,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists professional_spaces (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_pt text not null,
  name_en text,
  name_fr text,
  description_pt text,
  description_en text,
  description_fr text,
  benefits_pt jsonb not null default '[]'::jsonb,
  benefits_en jsonb not null default '[]'::jsonb,
  benefits_fr jsonb not null default '[]'::jsonb,
  image_url text,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  title_pt text,
  title_en text,
  title_fr text,
  image_url text not null,
  category text,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

create table if not exists form_submissions (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  name text,
  email text,
  phone text,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public_rate_limits (
  key text primary key,
  route text not null,
  identifier_hash text not null,
  window_start timestamptz not null,
  count integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'site',
  source_event_id text,
  source_booking_id text,
  status text not null default 'pending',
  service_id uuid references services(id) on delete set null,
  professional_id uuid references professionals(id) on delete set null,
  service text,
  professional text,
  customer_name text,
  customer_email text,
  customer_phone text,
  starts_at timestamptz,
  ends_at timestamptz,
  duration_minutes integer,
  timezone text,
  notes text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists appointment_events (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references appointments(id) on delete cascade,
  type text not null,
  actor text not null default 'system',
  message text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_admin_sessions_user_id on admin_sessions(user_id);
create index if not exists idx_admin_sessions_expires_at on admin_sessions(expires_at);
create index if not exists idx_services_category_id on services(category_id);
create index if not exists idx_services_visible_order on services(is_visible, sort_order);
create index if not exists idx_products_visible_order on products(is_visible, sort_order);
create index if not exists idx_professionals_visible_order on professionals(is_visible, sort_order);
create index if not exists idx_professional_spaces_visible_order on professional_spaces(is_visible, sort_order);
create index if not exists idx_gallery_images_visible_order on gallery_images(is_visible, sort_order);
create index if not exists idx_marketing_slides_visible_order on marketing_slides(is_visible, sort_order);
create index if not exists idx_form_submissions_type_created_at on form_submissions(type, created_at desc);
create index if not exists idx_public_rate_limits_updated_at on public_rate_limits(updated_at);
create index if not exists idx_public_rate_limits_route_identifier
  on public_rate_limits(route, identifier_hash);
create index if not exists idx_appointments_starts_at on appointments(starts_at desc);
create index if not exists idx_appointments_status on appointments(status);
create index if not exists idx_appointments_customer_email on appointments(customer_email);
create unique index if not exists idx_appointments_source_event_id
  on appointments(source_event_id)
  where source_event_id is not null;
create index if not exists idx_appointments_professional_starts_at
  on appointments(professional_id, starts_at)
  where status in ('pending', 'confirmed');
create index if not exists idx_appointment_events_appointment_created_at
  on appointment_events(appointment_id, created_at desc);

alter table appointments
  drop constraint if exists chk_appointments_status;
alter table appointments
  add constraint chk_appointments_status
  check (status in ('pending', 'confirmed', 'reschedule', 'cancelled', 'completed'));

alter table appointments
  drop constraint if exists chk_appointments_duration;
alter table appointments
  add constraint chk_appointments_duration
  check (duration_minutes is null or duration_minutes between 15 and 480);

alter table appointments
  drop constraint if exists chk_appointments_timezone;
alter table appointments
  add constraint chk_appointments_timezone
  check (timezone is null or timezone = 'Europe/Lisbon');

alter table appointments
  drop constraint if exists chk_appointments_time_order;
alter table appointments
  add constraint chk_appointments_time_order
  check (starts_at is null or ends_at is null or starts_at < ends_at);

alter table appointments
  drop constraint if exists appointments_no_professional_overlap;
alter table appointments
  add constraint appointments_no_professional_overlap
  exclude using gist (
    professional_id with =,
    tstzrange(starts_at, ends_at, '[)') with &&
  )
  where (
    professional_id is not null
    and starts_at is not null
    and ends_at is not null
    and status in ('pending', 'confirmed')
  );

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_admin_users_updated_at on admin_users;
create trigger trg_admin_users_updated_at
before update on admin_users
for each row execute function set_updated_at();

drop trigger if exists trg_service_categories_updated_at on service_categories;
create trigger trg_service_categories_updated_at
before update on service_categories
for each row execute function set_updated_at();

drop trigger if exists trg_services_updated_at on services;
create trigger trg_services_updated_at
before update on services
for each row execute function set_updated_at();

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at
before update on products
for each row execute function set_updated_at();

drop trigger if exists trg_professionals_updated_at on professionals;
create trigger trg_professionals_updated_at
before update on professionals
for each row execute function set_updated_at();

drop trigger if exists trg_professional_spaces_updated_at on professional_spaces;
create trigger trg_professional_spaces_updated_at
before update on professional_spaces
for each row execute function set_updated_at();

drop trigger if exists trg_gallery_images_updated_at on gallery_images;
create trigger trg_gallery_images_updated_at
before update on gallery_images
for each row execute function set_updated_at();

drop trigger if exists trg_marketing_slides_updated_at on marketing_slides;
create trigger trg_marketing_slides_updated_at
before update on marketing_slides
for each row execute function set_updated_at();

drop trigger if exists trg_appointments_updated_at on appointments;
create trigger trg_appointments_updated_at
before update on appointments
for each row execute function set_updated_at();
