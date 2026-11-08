import test from "node:test";
import assert from "node:assert/strict";
import { contactSchema, processContactRequest, type ContactSubmission } from "../src/lib/contact.ts";

const valid = { name: "Portfolio test", email: "test@example.com", message: "Testing the contact validation workflow.", website: "" };
const request = (body: unknown, extra: Record<string, string> = {}) => new Request("https://portfolio.example/api/contact", { method: "POST", headers: { "Content-Type": "application/json", ...extra }, body: JSON.stringify(body) });
const endpoint = "https://formspree.io/f/independenttest";
const save = async () => {};

test("server trims input and rejects whitespace, wrong types, invalid email and oversized fields", () => {
  const parsed = contactSchema.parse({ ...valid, name: "  Mutian He  ", email: " test@example.com " });
  assert.equal(parsed.name, "Mutian He"); assert.equal(parsed.email, "test@example.com");
  for (const bad of [{ ...valid, name: "  " }, { ...valid, name: 123 }, { ...valid, email: "invalid" }, { ...valid, message: "          " }, { ...valid, message: "a".repeat(5001) }, { ...valid, name: "a".repeat(81) }, { ...valid, website: "spam" }, null]) assert.equal(contactSchema.safeParse(bad).success, false);
});

test("invalid input never reaches storage or email", async () => {
  let writes = 0, deliveries = 0;
  const response = await processContactRequest(request({ name: " ", email: "bad", message: "short" }), {
    endpoint, saveSubmission: async () => { writes++; }, fetcher: async () => { deliveries++; return Response.json({}); },
  });
  assert.equal(response.status, 400); assert.equal(writes, 0); assert.equal(deliveries, 0);
  assert.deepEqual((await response.json()).errors, { name: "name_length", email: "email_invalid", message: "message_length" });
});

test("missing storage never reports success or sends email", async () => {
  let delivered = false;
  const response = await processContactRequest(request(valid), { endpoint, fetcher: async () => { delivered = true; return Response.json({}); } });
  assert.equal(response.status, 503); assert.equal((await response.json()).error, "storage_unavailable"); assert.equal(delivered, false);
});

test("failed persistence never acknowledges success or attempts email", async () => {
  let delivered = false;
  const response = await processContactRequest(request(valid), {
    endpoint, saveSubmission: async () => { throw new Error("storage offline"); },
    fetcher: async () => { delivered = true; return Response.json({}); },
  });
  assert.equal(response.status, 503); assert.equal((await response.json()).ok, false); assert.equal(delivered, false);
});

test("validated JSON is persisted before email and acknowledgements reveal no private fields", async () => {
  const events: string[] = [];
  let stored: ContactSubmission | undefined;
  let delivered: unknown;
  const response = await processContactRequest(request({ ...valid, name: "  Mutian He  ", injected: "discard" }), {
    endpoint,
    saveSubmission: async record => { stored = record; events.push("saved"); },
    fetcher: async (url, options) => { assert.equal(url, endpoint); events.push("notified"); delivered = JSON.parse(String(options?.body)); return Response.json({ ok: true }); },
  });
  assert.deepEqual(events, ["saved", "notified"]);
  assert.ok(stored); assert.equal(stored.name, "Mutian He"); assert.equal(stored.schemaVersion, 1);
  assert.ok(Number.isFinite(Date.parse(stored.createdAt)));
  assert.deepEqual(Object.keys(stored).sort(), ["createdAt", "email", "id", "message", "name", "schemaVersion"]);
  assert.match(stored.id, /^[0-9a-f-]{36}$/);
  const ack = await response.json();
  assert.equal(response.status, 200); assert.equal(ack.message, "sent"); assert.equal(ack.submissionId, stored.id);
  assert.deepEqual(Object.keys(ack).sort(), ["message", "ok", "submissionId"]);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(delivered, { name: "Mutian He", email: valid.email, message: valid.message, _subject: "New portfolio-nextjs contact message" });
});

test("saved messages remain successful when email is unconfigured, rejected or offline", async () => {
  const noEmail = await processContactRequest(request(valid), { saveSubmission: save });
  assert.equal(noEmail.status, 200); assert.equal((await noEmail.json()).message, "saved");
  for (const fetcher of [async () => new Response("failed", { status: 422 }), async () => { throw new Error("offline"); }]) {
    let persisted = false;
    const response = await processContactRequest(request(valid), { endpoint, saveSubmission: async () => { persisted = true; }, fetcher });
    const result = await response.json();
    assert.equal(persisted, true); assert.equal(response.status, 200); assert.equal(result.ok, true); assert.equal(result.message, "saved");
  }
});

test("concurrent submissions receive separate immutable record IDs", async () => {
  const records: ContactSubmission[] = [];
  await Promise.all(["First test", "Second test"].map(name => processContactRequest(request({ ...valid, name }), { saveSubmission: async record => { records.push(record); } })));
  assert.equal(records.length, 2); assert.notEqual(records[0].id, records[1].id);
  assert.deepEqual(new Set(records.map(record => record.name)), new Set(["First test", "Second test"]));
});

test("malformed, oversized, cross-origin and unexpected content requests are rejected", async () => {
  const malformed = new Request("https://portfolio.example/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" });
  assert.equal((await processContactRequest(malformed)).status, 400);
  assert.equal((await processContactRequest(request({ ...valid, message: "a".repeat(25_000) }))).status, 413);
  assert.equal((await processContactRequest(request(valid, { Origin: "https://other.example" }))).status, 403);
  assert.equal((await processContactRequest(request(valid, { "Content-Type": "text/plain" }))).status, 415);
  assert.equal((await processContactRequest(new Request("https://portfolio.example/api/contact"))).status, 405);
});
