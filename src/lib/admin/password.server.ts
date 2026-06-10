import "@tanstack/react-start/server-only";

import { scryptSync, timingSafeEqual } from "node:crypto";

export function verifyPassword(password: string, passwordHash: string) {
  const [algorithm, salt, key] = passwordHash.split(":");

  if (algorithm !== "scrypt" || !salt || !key) {
    return false;
  }

  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(key, "hex");

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
