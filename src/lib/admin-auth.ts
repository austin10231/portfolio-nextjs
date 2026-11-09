import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const PASSWORD_MAX_LENGTH = 200;

export type AdminSecrets = { password: string; sessionSecret: string };

/** Reads server-only configuration; the /admin page stays disabled when unset. */
export function adminSecrets(): AdminSecrets | null {
  const password = process.env.ADMIN_PASSWORD?.trim() ?? "";
  const sessionSecret = process.env.ADMIN_SESSION_SECRET?.trim() || password;
  return password && sessionSecret ? { password, sessionSecret } : null;
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createSessionToken(secrets: AdminSecrets, now: number = Date.now()): string {
  const expiresAt = String(now + SESSION_TTL_MS);
  return `${expiresAt}.${sign(expiresAt, secrets.sessionSecret)}`;
}

export function verifySessionToken(token: string | undefined, secrets: AdminSecrets, now: number = Date.now()): boolean {
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const expiresAt = token.slice(0, dot);
  if (!/^\d+$/.test(expiresAt) || Number(expiresAt) <= now) return false;
  const expected = Buffer.from(sign(expiresAt, secrets.sessionSecret));
  const provided = Buffer.from(token.slice(dot + 1));
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}

/** Hashes both values first so comparison length never depends on the stored secret. */
export function verifyAdminPassword(candidate: string, secrets: AdminSecrets): boolean {
  if (candidate.length > PASSWORD_MAX_LENGTH) return false;
  const stored = createHash("sha256").update(secrets.password, "utf8").digest();
  const attempt = createHash("sha256").update(candidate, "utf8").digest();
  return timingSafeEqual(stored, attempt);
}

export type LoginGuard = {
  isLocked: (now?: number) => boolean;
  registerFailure: (now?: number) => void;
  reset: () => void;
};

/** Best-effort brute-force slowdown; each serverless instance keeps its own counter. */
export function createLoginGuard({ maxFailures = 5, windowMs = 15 * 60 * 1000 }: { maxFailures?: number; windowMs?: number } = {}): LoginGuard {
  let failures = 0;
  let blockedUntil = 0;
  return {
    isLocked: (now: number = Date.now()) => now < blockedUntil,
    registerFailure: (now: number = Date.now()) => {
      failures += 1;
      if (failures >= maxFailures) blockedUntil = now + windowMs;
    },
    reset: () => { failures = 0; blockedUntil = 0; },
  };
}
