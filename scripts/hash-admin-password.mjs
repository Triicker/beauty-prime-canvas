import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run admin:hash -- "your-password"');
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const key = scryptSync(password, salt, 64).toString("hex");
const hash = `scrypt:${salt}:${key}`;

const [, storedSalt, storedKey] = hash.split(":");
const check = scryptSync(password, storedSalt, 64);
const expected = Buffer.from(storedKey, "hex");

if (check.length !== expected.length || !timingSafeEqual(check, expected)) {
  console.error("Hash verification failed");
  process.exit(1);
}

console.log(hash);
