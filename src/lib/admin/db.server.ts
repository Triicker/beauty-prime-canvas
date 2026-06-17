import "@tanstack/react-start/server-only";

import pg from "pg";

const { Pool } = pg;

type QueryParams = readonly unknown[];

let pool: pg.Pool | undefined;

function getEnv(name: string) {
  return process.env[name] ?? (import.meta.env as Record<string, string | undefined>)[name];
}

function getDatabaseUrl() {
  return getEnv("DATABASE_URL");
}

function getPositiveIntegerEnv(name: string, fallback: number) {
  const value = getEnv(name);
  if (!value) return fallback;

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function shouldUseSsl(databaseUrl: string) {
  if (process.env.DATABASE_SSL === "false") return false;
  return !databaseUrl.includes("localhost") && !databaseUrl.includes("127.0.0.1");
}

export function isDatabaseConfigured() {
  return Boolean(getDatabaseUrl());
}

export function getPool() {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: databaseUrl,
      max: getPositiveIntegerEnv("DATABASE_POOL_MAX", 5),
      idleTimeoutMillis: getPositiveIntegerEnv("DATABASE_IDLE_TIMEOUT_MS", 30_000),
      connectionTimeoutMillis: getPositiveIntegerEnv("DATABASE_CONNECTION_TIMEOUT_MS", 5_000),
      ssl: shouldUseSsl(databaseUrl) ? { rejectUnauthorized: false } : false,
    });
  }

  return pool;
}

export async function query<T>(text: string, params: QueryParams = []) {
  const result = await getPool().query<T>(text, [...params]);
  return result.rows;
}

export async function queryOne<T>(text: string, params: QueryParams = []) {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
