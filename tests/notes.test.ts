import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { processNotesRequest, type Note, type NotesStore } from "../src/lib/notes.ts";

function memoryNotesStore({ failRead = false, failWrite = false } = {}): NotesStore & { saved: Note[] } {
  let saved: Note[] = [];
  return {
    get saved() { return saved; },
    async read() {
      if (failRead) throw new Error("storage down");
      return saved.map(note => ({ ...note }));
    },
    async write(notes: Note[]) {
      if (failWrite) throw new Error("storage down");
      saved = notes.map(note => ({ ...note }));
    },
  };
}

const jsonRequest = (url: string, method: string, body?: unknown) =>
  new Request(url, { method, headers: body === undefined ? undefined : { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });

const post = (store: NotesStore, body: unknown) => processNotesRequest(jsonRequest("http://localhost/api/notes", "POST", body), store);
const put = (store: NotesStore, id: string, body: unknown) => processNotesRequest(jsonRequest(`http://localhost/api/notes/${id}`, "PUT", body), store, id);

describe("notes API", () => {
  it("creates a note with POST and returns 201 Created with the stored note", async () => {
    const store = memoryNotesStore();
    const response = await post(store, { text: " Prepare the demo recording " });
    assert.equal(response.status, 201);
    assert.equal(response.headers.get("location"), `/api/notes/${store.saved[0].id}`);
    const body = await response.json();
    assert.equal(body.ok, true);
    assert.match(body.note.id, /^[0-9a-f-]{36}$/);
    assert.equal(body.note.text, "Prepare the demo recording");
    assert.equal(body.note.createdAt, body.note.updatedAt);
    assert.equal(store.saved.length, 1);
  });

  it("rejects malformed JSON with 400", async () => {
    const response = await processNotesRequest(new Request("http://localhost/api/notes", { method: "POST", body: "{bad", headers: { "Content-Type": "application/json" } }), memoryNotesStore());
    assert.equal(response.status, 400);
    assert.equal((await response.json()).error, "invalid_json");
  });

  it("rejects blank or oversized text with 400 and field errors", async () => {
    for (const text of ["   ", "x".repeat(501)]) {
      const response = await post(memoryNotesStore(), { text });
      assert.equal(response.status, 400);
      const body = await response.json();
      assert.equal(body.error, "validation_failed");
      assert.equal(body.errors.text, "text_length");
    }
  });

  it("lists notes with GET and returns no-store", async () => {
    const store = memoryNotesStore();
    await post(store, { text: "first" });
    await post(store, { text: "second" });
    const response = await processNotesRequest(new Request("http://localhost/api/notes"), store);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    const body = await response.json();
    assert.equal(body.ok, true);
    assert.deepEqual(body.notes.map((note: Note) => note.text), ["first", "second"]);
  });

  it("returns a single note with GET /:id and 404 for unknown ids", async () => {
    const store = memoryNotesStore();
    await post(store, { text: "find me" });
    const id = store.saved[0].id;
    const found = await processNotesRequest(new Request(`http://localhost/api/notes/${id}`), store, id);
    assert.equal(found.status, 200);
    assert.equal((await found.json()).note.text, "find me");
    const missing = await processNotesRequest(new Request("http://localhost/api/notes/nope"), store, "nope");
    assert.equal(missing.status, 404);
    assert.equal((await missing.json()).error, "note_not_found");
  });

  it("replaces a note with PUT /:id and stamps updatedAt", async () => {
    const store = memoryNotesStore();
    await post(store, { text: "before" });
    const id = store.saved[0].id;
    await new Promise(resolve => setTimeout(resolve, 5));
    const response = await put(store, id, { text: "after" });
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.note.text, "after");
    assert.equal(body.note.createdAt, store.saved[0].createdAt);
    assert.notEqual(body.note.updatedAt, body.note.createdAt);
  });

  it("supports PATCH /:id as a partial update and returns 404 when the note is missing", async () => {
    const store = memoryNotesStore();
    await post(store, { text: "patch me" });
    const id = store.saved[0].id;
    const response = await processNotesRequest(jsonRequest(`http://localhost/api/notes/${id}`, "PATCH", { text: "patched" }), store, id);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).note.text, "patched");
    assert.equal((await put(store, "missing", { text: "x" })).status, 404);
  });

  it("deletes a note with DELETE /:id, then 404 on repeat reads or deletes", async () => {
    const store = memoryNotesStore();
    await post(store, { text: "delete me" });
    const id = store.saved[0].id;
    const deleted = await processNotesRequest(jsonRequest(`http://localhost/api/notes/${id}`, "DELETE"), store, id);
    assert.equal(deleted.status, 200);
    assert.deepEqual(await deleted.json(), { ok: true, id, deleted: true });
    assert.equal(store.saved.length, 0);
    assert.equal((await processNotesRequest(new Request(`http://localhost/api/notes/${id}`), store, id)).status, 404);
    assert.equal((await processNotesRequest(jsonRequest(`http://localhost/api/notes/${id}`, "DELETE"), store, id)).status, 404);
  });

  it("returns 405 for methods on the wrong resource shape", async () => {
    const store = memoryNotesStore();
    assert.equal((await processNotesRequest(jsonRequest("http://localhost/api/notes", "PATCH", { text: "x" }), store)).status, 405);
    assert.equal((await processNotesRequest(jsonRequest("http://localhost/api/notes/some-id", "POST", { text: "x" }), store, "some-id")).status, 405);
    assert.equal((await processNotesRequest(jsonRequest("http://localhost/api/notes", "PUT", { text: "x" }), store)).status, 405);
    assert.equal((await processNotesRequest(jsonRequest("http://localhost/api/notes", "DELETE"), store)).status, 405);
    assert.equal((await processNotesRequest(new Request("http://localhost/api/notes", { method: "OPTIONS" }), store)).status, 405);
  });

  it("returns 503 when storage is unavailable instead of losing data silently", async () => {
    assert.equal((await post(memoryNotesStore({ failWrite: true }), { text: "save me" })).status, 503);
    assert.equal((await processNotesRequest(new Request("http://localhost/api/notes"), memoryNotesStore({ failRead: true }))).status, 503);
  });
});
