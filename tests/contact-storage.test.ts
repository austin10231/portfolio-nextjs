import test from "node:test";
import assert from "node:assert/strict";
import { createContactStore } from "../src/lib/contact-storage.ts";
import type { ContactSubmission } from "../src/lib/contact.ts";

const record: ContactSubmission = { schemaVersion: 1, id: "24b295dc-44d7-40c5-8d2b-5c41e93d790a", createdAt: "2026-11-08T04:00:00.000Z", name: "Storage test", email: "test@example.com", message: "A test message with Unicode: 你好。" };

test("storage writes real JSON as a private, non-overwriting blob", async () => {
  let writes = 0;
  const save = createContactStore(async (path, body, options) => {
    writes++;
    assert.equal(path, `contact-submissions/${record.id}.json`);
    assert.deepEqual(JSON.parse(body), record);
    assert.equal(options.access, "private"); assert.equal(options.contentType, "application/json");
    assert.equal(options.allowOverwrite, false); assert.equal(options.addRandomSuffix, false);
    assert.ok(options.abortSignal instanceof AbortSignal);
    return { url: "private metadata is not returned to the browser" };
  });
  assert.equal(await save(record), undefined); assert.equal(writes, 1);
});

test("storage failure propagates so the API cannot silently acknowledge an unsaved record", async () => {
  const save = createContactStore(async () => { throw new Error("write failed"); });
  await assert.rejects(save(record), /write failed/);
});
