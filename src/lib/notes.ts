import { z } from "zod";
import { randomUUID } from "node:crypto";

export const noteSchema = z.object({
  id: z.string().min(1),
  text: z.string().trim().min(1, "text").max(500, "text"),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Note = z.infer<typeof noteSchema>;

export const noteInputSchema = noteSchema.pick({ text: true });

export type NotesStore = {
  read: () => Promise<unknown>;
  write: (notes: Note[]) => Promise<void>;
};

/** Filters a stored list down to valid notes so one bad record cannot break the API. */
export function parseNotes(raw: unknown): Note[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is Note => noteSchema.safeParse(item).success);
}

const MAX_BODY_BYTES = 24_000;

async function readBody(request: Request): Promise<string> {
  const reader = request.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) { await reader.cancel(); throw new Error("body_too_large"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(bytes);
}

/**
 * Handles every /api/notes operation (GET, POST, PUT, PATCH, DELETE) against a
 * pluggable store, with validation, status codes and server logs for each step.
 * Exported so tests exercise the same code path as the deployed Route Handlers.
 */
export async function processNotesRequest(request: Request, store: NotesStore, noteId?: string): Promise<Response> {
  const start = Date.now();
  const path = noteId ? `/api/notes/${noteId}` : "/api/notes";
  const method = request.method.toUpperCase();
  const json = (body: object, status: number, extraHeaders: Record<string, string> = {}) => {
    console.info(`[notes-api] ${method} ${path} -> ${status} (${Date.now() - start}ms)`);
    return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extraHeaders } });
  };

  let notes: Note[];
  try {
    notes = parseNotes(await store.read());
  } catch (error) {
    console.error(`[notes-api] ${method} ${path} storage read failed`, error);
    return json({ ok: false, error: "storage_unavailable" }, 503);
  }

  if (method === "GET") {
    if (!noteId) {
      console.info(`[notes-api] listed ${notes.length} note(s)`);
      return json({ ok: true, notes }, 200);
    }
    const note = notes.find(item => item.id === noteId);
    return note ? json({ ok: true, note }, 200) : json({ ok: false, error: "note_not_found" }, 404);
  }

  if (method === "POST" || method === "PUT" || method === "PATCH") {
    if (method === "POST" ? !!noteId : !noteId) return json({ ok: false, error: "method_not_allowed" }, 405);
    let payload: unknown;
    try { payload = JSON.parse(await readBody(request)); }
    catch (error) {
      return json({ ok: false, error: error instanceof Error && error.message === "body_too_large" ? "body_too_large" : "invalid_json" }, error instanceof Error && error.message === "body_too_large" ? 413 : 400);
    }
    const parsed = noteInputSchema.safeParse(payload);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) errors[String(issue.path[0] ?? "form")] ??= "text_length";
      return json({ ok: false, error: "validation_failed", errors }, 400);
    }
    const now = new Date().toISOString();
    if (method === "POST") {
      const note: Note = { id: randomUUID(), text: parsed.data.text, createdAt: now, updatedAt: now };
      try { await store.write([...notes, note]); }
      catch (error) { console.error(`[notes-api] ${method} ${path} storage write failed`, error); return json({ ok: false, error: "storage_unavailable" }, 503); }
      console.info(`[notes-api] created note ${note.id} (${notes.length + 1} total)`);
      return json({ ok: true, note }, 201, { Location: `/api/notes/${note.id}` });
    }
    const index = notes.findIndex(item => item.id === noteId);
    if (index === -1) return json({ ok: false, error: "note_not_found" }, 404);
    const note: Note = { ...notes[index], text: parsed.data.text, updatedAt: now };
    try { await store.write(notes.map((item, position) => (position === index ? note : item))); }
    catch (error) { console.error(`[notes-api] ${method} ${path} storage write failed`, error); return json({ ok: false, error: "storage_unavailable" }, 503); }
    console.info(`[notes-api] updated note ${note.id}`);
    return json({ ok: true, note }, 200);
  }

  if (method === "DELETE") {
    if (!noteId) return json({ ok: false, error: "method_not_allowed" }, 405);
    if (!notes.some(item => item.id === noteId)) return json({ ok: false, error: "note_not_found" }, 404);
    try { await store.write(notes.filter(item => item.id !== noteId)); }
    catch (error) { console.error(`[notes-api] ${method} ${path} storage write failed`, error); return json({ ok: false, error: "storage_unavailable" }, 503); }
    console.info(`[notes-api] deleted note ${noteId} (${notes.length - 1} remaining)`);
    return json({ ok: true, id: noteId, deleted: true }, 200);
  }

  return json({ ok: false, error: "method_not_allowed" }, 405);
}
