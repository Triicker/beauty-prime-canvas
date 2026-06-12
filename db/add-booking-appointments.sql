-- Estrutura da agenda própria LOMA no PostgreSQL.
-- Rode no DBeaver conectado ao banco do Render.
-- Pode rodar novamente: usa if not exists e alter table defensivo.

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

alter table appointments add column if not exists source text not null default 'site';
alter table appointments add column if not exists source_event_id text;
alter table appointments add column if not exists source_booking_id text;
alter table appointments add column if not exists status text not null default 'pending';
alter table appointments add column if not exists service_id uuid references services(id) on delete set null;
alter table appointments add column if not exists professional_id uuid references professionals(id) on delete set null;
alter table appointments add column if not exists service text;
alter table appointments add column if not exists professional text;
alter table appointments add column if not exists customer_name text;
alter table appointments add column if not exists customer_email text;
alter table appointments add column if not exists customer_phone text;
alter table appointments add column if not exists starts_at timestamptz;
alter table appointments add column if not exists ends_at timestamptz;
alter table appointments add column if not exists duration_minutes integer;
alter table appointments add column if not exists timezone text;
alter table appointments add column if not exists notes text;
alter table appointments add column if not exists payload jsonb not null default '{}'::jsonb;
alter table appointments add column if not exists created_at timestamptz not null default now();
alter table appointments add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_appointments_starts_at on appointments(starts_at desc);
create index if not exists idx_appointments_status on appointments(status);
create index if not exists idx_appointments_customer_email on appointments(customer_email);
create unique index if not exists idx_appointments_source_event_id
  on appointments(source_event_id)
  where source_event_id is not null;
create index if not exists idx_appointments_professional_starts_at
  on appointments(professional_id, starts_at)
  where status in ('pending', 'confirmed');

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_appointments_updated_at on appointments;
create trigger trg_appointments_updated_at
before update on appointments
for each row execute function set_updated_at();
