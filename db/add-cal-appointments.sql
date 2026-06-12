-- Estrutura para integrar agendamentos do Cal.com ao PostgreSQL.
-- Rode no DBeaver conectado ao banco do Render.
-- Pode rodar novamente: usa if not exists.

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'site',
  source_event_id text unique,
  source_booking_id text,
  status text not null default 'pending',
  service text,
  professional text,
  customer_name text,
  customer_email text,
  customer_phone text,
  starts_at timestamptz,
  ends_at timestamptz,
  timezone text,
  notes text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_appointments_starts_at on appointments(starts_at desc);
create index if not exists idx_appointments_status on appointments(status);
create index if not exists idx_appointments_customer_email on appointments(customer_email);

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
