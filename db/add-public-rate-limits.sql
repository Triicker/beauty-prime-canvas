-- Estrutura de rate limit para endpoints publicos.
-- Rode no DBeaver conectado ao banco do Render.
-- O backend tambem cria esta tabela automaticamente, mas este script deixa o banco preparado.

create table if not exists public_rate_limits (
  key text primary key,
  route text not null,
  identifier_hash text not null,
  window_start timestamptz not null,
  count integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists idx_public_rate_limits_updated_at
  on public_rate_limits(updated_at);

create index if not exists idx_public_rate_limits_route_identifier
  on public_rate_limits(route, identifier_hash);
