import { get, put, BlobNotFoundError, type GetBlobResult } from "@vercel/blob";
import type { Note, NotesStore } from "./notes";
import { parseNotes } from "./notes";

const STORE_PATH = "notes/notes-store.json";

type PrivateJsonWriter = (path: string, body: string, options: {
  access: "private";
  contentType: "application/json";
  addRandomSuffix: false;
  allowOverwrite: true;
  abortSignal: AbortSignal;
}) => Promise<unknown>;
type PrivateJsonReader = (path: string, options: { access: "private"; useCache: false }) => Promise<GetBlobResult | null>;

/** Server adapter: never imported by a Client Component; credentials stay on the server. */
export function createBlobNotesStore(write: PrivateJsonWriter = put, read: PrivateJsonReader = get): NotesStore {
  return {
    async read() {
      try {
        const result = await read(STORE_PATH, { access: "private", useCache: false });
        if (!result || result.statusCode !== 200 || !result.stream) return [];
        return JSON.parse(await new Response(result.stream).text());
      } catch (error) {
        if (error instanceof BlobNotFoundError) return [];
        throw error;
      }
    },
    async write(notes: Note[]) {
      await write(STORE_PATH, `${JSON.stringify(notes, null, 2)}\n`, {
        access: "private",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
        abortSignal: AbortSignal.timeout(10_000),
      });
    },
  };
}

export async function listNotes(): Promise<{ notes: Note[]; error: boolean }> {
  try {
    return { notes: parseNotes(await createBlobNotesStore().read()), error: false };
  } catch {
    return { notes: [], error: true };
  }
}

export const blobNotesStore = createBlobNotesStore();
