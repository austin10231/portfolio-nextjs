import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { get } from "@vercel/blob";

// Owner-only CLI verification, never a public website endpoint.
// Supply a second argument to re-read an existing record without sending another message.
const base = new URL(process.argv[2] || "http://localhost:3000");
let submissionId = process.argv[3];
let expected;
let notification;
if (!submissionId) {
  expected = { name: "Assignment 2 storage QA", email: "assignment-test@example.com", message: `Authorized Part 1 JSON persistence test. Synthetic data only. Verification ${randomUUID()}`, website: "" };
  const response = await fetch(new URL("/api/contact", base), { method: "POST", headers: { "Content-Type": "application/json", Origin: base.origin }, body: JSON.stringify(expected) });
  const ack = await response.json();
  assert.equal(response.status, 200, `Contact request failed: ${ack.error}`);
  assert.equal(ack.ok, true);
  assert.deepEqual(Object.keys(ack).sort(), ["message", "ok", "submissionId"]);
  submissionId = ack.submissionId;
  notification = ack.message;
}
assert.match(submissionId, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
const result = await get(`contact-submissions/${submissionId}.json`, { access: "private", useCache: false });
assert.equal(result?.statusCode, 200, "Saved JSON must be retrievable with owner credentials");
assert.ok(result.blob.contentType.startsWith("application/json"));
const record = await new Response(result.stream).json();
assert.equal(record.schemaVersion, 1); assert.equal(record.id, submissionId);
assert.ok(Number.isFinite(Date.parse(record.createdAt)));
assert.deepEqual(Object.keys(record).sort(), ["createdAt", "email", "id", "message", "name", "schemaVersion"]);
for (const field of ["name", "email", "message"]) {
  assert.equal(typeof record[field], "string");
  if (expected) assert.equal(record[field], expected[field]);
}
const anonymous = await fetch(result.blob.url);
assert.ok([401, 403, 404].includes(anonymous.status), "Private blob URL must reject unauthenticated access");
assert.ok(!(await anonymous.text()).includes(record.message), "Anonymous response must not reveal the message");
const publicCopies = [`/contact-submissions/${submissionId}.json`, "/submissions.json", "/data/submissions.json", `/api/contact/${submissionId}`];
for (const path of publicCopies) assert.equal((await fetch(new URL(path, base))).status, 404, `No public submission copy at ${path}`);
const pages = await Promise.all(["/", "/contact-me-server-form", "/contact-me"].map(async path => (await fetch(new URL(path, base))).text()));
for (const page of pages) {
  assert.ok(!page.includes(record.message));
  if (process.env.BLOB_READ_WRITE_TOKEN) assert.ok(!page.includes(process.env.BLOB_READ_WRITE_TOKEN));
}
const bundles = new Set(pages.flatMap(page => Array.from(page.matchAll(/<script[^>]+src="([^\"]+)"/g), match => match[1])).filter(path => path.startsWith("/_next/static/")));
for (const path of bundles) {
  const source = await (await fetch(new URL(path, base))).text();
  assert.ok(!source.includes(record.message));
  if (process.env.BLOB_READ_WRITE_TOKEN) assert.ok(!source.includes(process.env.BLOB_READ_WRITE_TOKEN), "Storage credential must not appear in browser JavaScript");
}
console.log(JSON.stringify({ checkedAtUTC: new Date().toISOString(), origin: base.origin, submissionId, savedAsJSON: true, privateStorage: "Vercel Blob", authenticatedRead: 200, anonymousRead: anonymous.status, publicSubmissionCopies: false, checkedClientBundles: bundles.size, notification, fields: Object.keys(record) }, null, 2));
