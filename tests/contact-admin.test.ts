import test from "node:test";
import assert from "node:assert/strict";
import { listContactSubmissions } from "../src/lib/contact-admin.ts";
import type { BlobLister, BlobTextGetter } from "../src/lib/contact-admin.ts";
import type { ContactSubmission } from "../src/lib/contact.ts";

const record = (id: string, createdAt: string, name = "Part 2 tester"): ContactSubmission =>
  ({ schemaVersion: 1, id, createdAt, name, email: "test@example.com", message: `Stored message ${id}.` });

const jsonl = (records: ContactSubmission[]) => new Map(records.map(record => [`contact-submissions/${record.id}.json`, `${JSON.stringify(record, null, 2)}\n`]));

function fakeServices(store: Map<string, string>, order: string[] = [...store.keys()], unreadablePaths: string[] = []) {
  const lister: BlobLister = async ({ cursor }) => {
    const start = cursor ? Number(cursor) : 0;
    const slice = order.slice(start, start + 2);
    return { blobs: slice.map(pathname => ({ pathname })), hasMore: start + 2 < order.length, cursor: String(start + 2) };
  };
  const getter: BlobTextGetter = async pathname => unreadablePaths.includes(pathname) ? null : store.get(pathname) ?? null;
  return { lister, getter };
}

test("lists, parses and sorts submissions from both parts, newest first", async () => {
  const records = [
    record("11111111-1111-4111-8111-111111111111", "2026-11-01T10:00:00.000Z", "Part 1 visitor"),
    record("22222222-2222-4222-8222-222222222222", "2026-11-03T09:30:00.000Z", "Part 2 visitor"),
    record("33333333-3333-4333-8333-333333333333", "2026-11-02T22:15:00.000Z"),
  ];
  const services = fakeServices(jsonl(records));
  const { submissions, unreadable } = await listContactSubmissions({ ...services });
  assert.equal(unreadable, 0);
  assert.deepEqual(submissions.map(s => s.createdAt), ["2026-11-03T09:30:00.000Z", "2026-11-02T22:15:00.000Z", "2026-11-01T10:00:00.000Z"]);
  assert.deepEqual(submissions.map(s => s.name), ["Part 2 visitor", "Part 2 tester", "Part 1 visitor"]);
});

test("paginates with the cursor until every page has been read", async () => {
  const records = Array.from({ length: 5 }, (_, index) => record(`aaaaaaaa-000${index}-4aaa-8aaa-aaaaaaaaaaa0`, `2026-01-0${index + 1}T00:00:00.000Z`));
  let pages = 0;
  const services = fakeServices(jsonl(records));
  const countingLister: BlobLister = async options => { pages++; return services.lister(options); };
  const { submissions } = await listContactSubmissions({ lister: countingLister, getter: services.getter });
  assert.equal(pages, 3);
  assert.equal(submissions.length, 5);
});

test("malformed, foreign-schema and unreadable records are skipped and counted, never crashing the page", async () => {
  const good = record("44444444-4444-4444-8444-444444444444", "2026-11-05T08:00:00.000Z");
  const store = jsonl([good]);
  store.set("contact-submissions/broken.json", "{not json");
  store.set("contact-submissions/foreign.json", JSON.stringify({ hello: "world" }));
  const goodPath = `contact-submissions/${good.id}.json`;
  const { submissions, unreadable } = await listContactSubmissions({
    ...fakeServices(store, ["contact-submissions/broken.json", "contact-submissions/missing.json", goodPath, "contact-submissions/foreign.json"], ["contact-submissions/missing.json"]),
  });
  assert.deepEqual(submissions, [good]);
  assert.equal(unreadable, 3);
});

test("a store error surfaces instead of rendering an empty dashboard", async () => {
  await assert.rejects(listContactSubmissions({ lister: async () => { throw new Error("blob list failed"); } }), /blob list failed/);
});
