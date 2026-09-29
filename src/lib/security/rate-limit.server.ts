import "@tanstack/react-start/server-only";

import { createHash } from "node:crypto";

import { query, queryOne } from "@/lib/admin/db.server";

type RateLimitRule = {
  route: string;
  max: number;
  windowSeconds: number;
};

type RateLimitRow = {
  count: number;
};

let setupPromise: Promise<void> | undefined;
let cleanupStarted = false;
let warnedMissingSalt = false;

export const publicFormRateLimits = {
  contact: { route: "/api/contact", max: 5, windowSeconds: 10 * 60 },
  newsletter: { route: "/api/newsletter", max: 3, windowSeconds: 60 * 60 },
  cartRequest: { route: "/api/cart-request", max: 5, windowSeconds: 15 * 60 },
  bookingAvailability: { route: "/api/booking/availability", max: 80, windowSeconds: 5 * 60 },
  booking: { route: "/api/booking", max: 8, windowSeconds: 15 * 60 },
  professionalInquiry: { route: "/api/professional-inquiry", max: 3, windowSeconds: 60 * 60 },
} satisfies Record<string, RateLimitRule>;

function getEnv(name: string) {
  return process.env[name] ?? (import.meta.env as Record<string, string | undefined>)[name];
}

function isProduction() {
  return getEnv("NODE_ENV") === "production";
}

function getClientSignal(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    forwardedFor ||
    "unknown";
  const userAgent = request.headers.get("user-agent")?.slice(0, 160) || "unknown";

  return `${ip}|${userAgent}`;
}

function hashIdentifier(value: string) {
  const salt = getEnv("RATE_LIMIT_SALT");

  if (salt) {
    return createHash("sha256").update(`${salt}:${value}`).digest("hex");
  }

  if (isProduction() && !warnedMissingSalt) {
    warnedMissingSalt = true;
    console.warn("RATE_LIMIT_SALT is not configured. Using development fallback salt.");
  }

  const fallbackSalt = "loma-rate-limit-development-fallback";
  return createHash("sha256").update(`${fallbackSalt}:${value}`).digest("hex");
}

async function ensureRateLimitTable() {
  setupPromise ??= query(`
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
  `).then(() => undefined);

  await setupPromise;
  startRateLimitCleanup();
}

async function cleanupOldWindows() {
  await query(
    `
      delete from public_rate_limits
      where updated_at < now() - interval '2 days'
    `,
  );
}

function startRateLimitCleanup() {
  if (cleanupStarted) return;
  cleanupStarted = true;

  cleanupOldWindows().catch((error) => {
    console.warn("Failed to clean old rate limit windows.", error);
  });

  const timer = setInterval(
    () => {
      cleanupOldWindows().catch((error) => {
        console.warn("Failed to clean old rate limit windows.", error);
      });
    },
    60 * 60 * 1000,
  );

  timer.unref?.();
}

export async function enforceRateLimit(request: Request, rule: RateLimitRule) {
  await ensureRateLimitTable();

  const now = Date.now();
  const windowMs = rule.windowSeconds * 1000;
  const windowStartMs = Math.floor(now / windowMs) * windowMs;
  const identifierHash = hashIdentifier(getClientSignal(request));
  const key = `${rule.route}:${identifierHash}:${windowStartMs}`;

  const row = await queryOne<RateLimitRow>(
    `
      insert into public_rate_limits (
        key,
        route,
        identifier_hash,
        window_start,
        count,
        updated_at
      )
      values ($1, $2, $3, to_timestamp($4 / 1000.0), 1, now())
      on conflict (key) do update
      set count = public_rate_limits.count + 1,
          updated_at = now()
      returning count
    `,
    [key, rule.route, identifierHash, windowStartMs],
  );

  const count = row?.count ?? 1;
  const remaining = Math.max(rule.max - count, 0);
  const resetInSeconds = Math.max(Math.ceil((windowStartMs + windowMs - now) / 1000), 1);

  const headers = {
    "Retry-After": String(resetInSeconds),
    "X-RateLimit-Limit": String(rule.max),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.ceil((windowStartMs + windowMs) / 1000)),
  };

  if (count <= rule.max) return null;

  return Response.json(
    {
      message: "Muitos envios em pouco tempo. Aguarde alguns minutos antes de tentar novamente.",
    },
    { status: 429, headers },
  );
}
