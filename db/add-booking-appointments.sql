-- Estrutura da agenda própria LOMA no PostgreSQL.
-- Rode no DBeaver conectado ao banco do Render.
-- Pode rodar novamente: usa if not exists e alter table defensivo.

create extension if not exists btree_gist;

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

drop trigger if exists trg_appointments_updated_at on appointments;
create trigger trg_appointments_updated_at
before update on appointments
for each row execute function set_updated_at();
