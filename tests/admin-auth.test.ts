import test from "node:test";
import assert from "node:assert/strict";
import { createLoginGuard, createSessionToken, verifyAdminPassword, verifySessionToken } from "../src/lib/admin-auth.ts";

const secrets = { password: "correct horse battery staple", sessionSecret: "session-signing-secret" };

test("session token round-trips and rejects tampering, expiry and wrong secrets", () => {
  const now = 1_700_000_000_000;
  const token = createSessionToken(secrets, now);
  assert.ok(verifySessionToken(token, secrets, now + 1000));
  assert.equal(verifySessionToken(token, secrets, now + 8 * 60 * 60 * 1000), false, "expired token");
  const tampered = `${token.slice(0, -2)}xY`;
  assert.equal(verifySessionToken(tampered, secrets, now + 1000), false);
  assert.equal(verifySessionToken(token, { password: "x", sessionSecret: "other-secret" }, now + 1000), false);
  for (const bad of [undefined, "", "garbage", ".abc", "abc.def", `${now + 1000}.`]) assert.equal(verifySessionToken(bad as never, secrets, now + 1000), false, String(bad));
});

test("password check accepts only the exact configured password", () => {
  assert.equal(verifyAdminPassword("correct horse battery staple", secrets), true);
  for (const bad of ["", "Correct horse battery staple", "correct horse battery stapl", "x".repeat(201)]) assert.equal(verifyAdminPassword(bad, secrets), false, bad.slice(0, 12));
});

test("login guard locks after repeated failures and unlocks after the window", () => {
  const guard = createLoginGuard({ maxFailures: 3, windowMs: 1000 });
  const start = 1_700_000_000_000;
  guard.registerFailure(start); guard.registerFailure(start + 1);
  assert.equal(guard.isLocked(start + 2), false);
  guard.registerFailure(start + 2);
  assert.equal(guard.isLocked(start + 3), true);
  assert.equal(guard.isLocked(start + 1001), true, "still locked near the end of the window");
  assert.equal(guard.isLocked(start + 1002), false, "lock expires once the window passes");
  guard.reset();
  assert.equal(guard.isLocked(start + 1002), false);
});
