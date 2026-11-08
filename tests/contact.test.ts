import test from "node:test";
import assert from "node:assert/strict";
import { contactSchema, processContactRequest } from "../src/lib/contact.ts";

const valid = { name: "Portfolio test", email: "test@example.com", message: "Testing the contact validation workflow.", website: "" };
const request = (body: unknown, extra: Record<string, string> = {}) => new Request("https://portfolio.example/api/contact", { method: "POST", headers: { "Content-Type": "application/json", ...extra }, body: JSON.stringify(body) });
const endpoint = "https://formspree.io/f/independenttest";

test("server trims input and rejects whitespace, wrong types, invalid email and oversized fields", () => {
  const parsed = contactSchema.parse({ ...valid, name: "  Mutian He  ", email: " test@example.com " });
  assert.equal(parsed.name, "Mutian He"); assert.equal(parsed.email, "test@example.com");
  for (const bad of [{ ...valid, name: "  " }, { ...valid, name: 123 }, { ...valid, email: "invalid" }, { ...valid, message: "          " }, { ...valid, message: "a".repeat(5001) }, { ...valid, name: "a".repeat(81) }, { ...valid, website: "spam" }, null]) assert.equal(contactSchema.safeParse(bad).success, false);
});
test("invalid inputs are rejected before any delivery attempt", async () => {
  let deliveries = 0;
  const response = await processContactRequest(request({ name: " ", email: "bad", message: "short" }), endpoint, async () => { deliveries++; return Response.json({}); });
  assert.equal(response.status, 400); assert.equal(deliveries, 0);
  assert.deepEqual((await response.json()).errors, { name: "name_length", email: "email_invalid", message: "message_length" });
});
test("valid input without delivery configuration never reports success", async () => {
  const response = await processContactRequest(request(valid));
  assert.equal(response.status, 503); assert.equal((await response.json()).ok, false);
});
test("delivery accepts only validated data and reports success after provider acceptance", async () => {
  let delivered: unknown;
  const response = await processContactRequest(request({ ...valid, name: "  Mutian He  ", injected: "discard" }), endpoint, async (url, options) => {
    assert.equal(url, endpoint); delivered = JSON.parse(String(options?.body));
    return Response.json({ ok: true });
  });
  assert.equal(response.status, 200); assert.equal((await response.json()).ok, true);
  assert.deepEqual(delivered, { name: "Mutian He", email: valid.email, message: valid.message, _subject: "New portfolio-nextjs contact message" });
});
test("upstream rejection and network failure never produce false success", async () => {
  for (const fetcher of [async () => new Response("failed", { status: 422 }), async () => { throw new Error("offline"); }]) {
    const response = await processContactRequest(request(valid), endpoint, fetcher);
    assert.equal(response.status, 502); assert.equal((await response.json()).ok, false);
  }
});
test("malformed, oversized, cross-origin and unexpected content requests are rejected", async () => {
  const malformed = new Request("https://portfolio.example/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" });
  assert.equal((await processContactRequest(malformed)).status, 400);
  assert.equal((await processContactRequest(request({ ...valid, message: "a".repeat(25_000) }))).status, 413);
  assert.equal((await processContactRequest(request(valid, { Origin: "https://other.example" }))).status, 403);
  assert.equal((await processContactRequest(request(valid, { "Content-Type": "text/plain" }))).status, 415);
  assert.equal((await processContactRequest(new Request("https://portfolio.example/api/contact"))).status, 405);
});
