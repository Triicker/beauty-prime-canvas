import "@tanstack/react-start/server-only";

import { createHash, randomBytes } from "node:crypto";

import { isDatabaseConfigured, query, queryOne } from "./db.server";
import { verifyPassword } from "./password.server";

const COOKIE_NAME = "loma_admin_session";
const SESSION_DAYS = 7;

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AdminUserRow = AdminUser & {
  password_hash: string;
  is_active: boolean;
};

function sessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ??
    (import.meta.env as Record<string, string | undefined>).ADMIN_SESSION_SECRET ??
    "local-dev-admin-session-secret"
  );
}

function hashToken(token: string) {
  return createHash("sha256").update(`${sessionSecret()}:${token}`).digest("hex");
}

function cookieOptions() {
  return {
    httpOnly: "HttpOnly",
    sameSite: "SameSite=Lax",
    secure: process.env.NODE_ENV === "production" ? "Secure" : "",
    path: "Path=/",
    maxAge: `Max-Age=${SESSION_DAYS * 24 * 60 * 60}`,
  };
}

function serializeCookie(name: string, value: string, options = cookieOptions()) {
  return [
    `${name}=${value}`,
    options.path,
    options.maxAge,
    options.httpOnly,
    options.sameSite,
    options.secure,
  ]
    .filter(Boolean)
    .join("; ");
}

function parseCookies(request: Request) {
  const header = request.headers.get("cookie") ?? "";

  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        if (index === -1) return [part, ""];
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      }),
  );
}

export function expiredAdminCookie() {
  return serializeCookie(COOKIE_NAME, "", {
    ...cookieOptions(),
    maxAge: "Max-Age=0",
  });
}

export async function loginAdmin(email: string, password: string) {
  if (!isDatabaseConfigured()) {
    return { ok: false, message: "DATABASE_URL ainda não está configurada." };
  }

  const user = await queryOne<AdminUserRow>(
    `
      select id, name, email, role, password_hash, is_active
      from admin_users
      where lower(email) = lower($1)
      limit 1
    `,
    [email],
  );

  if (!user?.is_active || !verifyPassword(password, user.password_hash)) {
    return { ok: false, message: "Email ou senha inválidos." };
  }

  await query("delete from admin_sessions where expires_at < now()");

  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);

  await query(
    `
      insert into admin_sessions (user_id, token_hash, expires_at)
      values ($1, $2, now() + interval '7 days')
    `,
    [user.id, tokenHash],
  );

  return { ok: true, message: "Login realizado.", cookie: serializeCookie(COOKIE_NAME, token) };
}

export async function logoutAdmin(request: Request) {
  const token = parseCookies(request)[COOKIE_NAME];

  if (token && isDatabaseConfigured()) {
    await query("delete from admin_sessions where token_hash = $1", [hashToken(token)]);
  }

  return { ok: true };
}

export async function getCurrentAdmin(request: Request) {
  const token = parseCookies(request)[COOKIE_NAME];

  if (!token || !isDatabaseConfigured()) {
    return null;
  }

  const user = await queryOne<AdminUser>(
    `
      select u.id, u.name, u.email, u.role
      from admin_sessions s
      join admin_users u on u.id = s.user_id
      where s.token_hash = $1
        and s.expires_at > now()
        and u.is_active = true
      limit 1
    `,
    [hashToken(token)],
  );

  return user;
}

export async function requireAdmin(request: Request) {
  const user = await getCurrentAdmin(request);

  if (!user) {
    return null;
  }

  return user;
}
