import { get, list } from "@vercel/blob";
import type { ContactSubmission } from "./contact";

export type SubmissionPage = { blobs: { pathname: string }[]; cursor?: string; hasMore: boolean };
export type BlobLister = (options: { prefix: string; cursor?: string }) => Promise<SubmissionPage>;
export type BlobTextGetter = (pathname: string) => Promise<string | null>;

export const blobLister: BlobLister = async ({ prefix, cursor }) => {
  const result = await list({ prefix, cursor });
  return { blobs: result.blobs.map(({ pathname }) => ({ pathname })), cursor: result.cursor, hasMore: result.hasMore };
};

export const blobTextGetter: BlobTextGetter = async pathname => {
  const result = await get(pathname, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) return null;
  return new Response(result.stream).text();
};

function parseSubmission(raw: string): ContactSubmission | null {
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    const record = data as Record<string, unknown>;
    if (record.schemaVersion !== 1 || typeof record.id !== "string" || !record.id) return null;
    if (typeof record.createdAt !== "string" || Number.isNaN(Date.parse(record.createdAt))) return null;
    const { name, email, message } = record;
    if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") return null;
    return { schemaVersion: 1, id: record.id, createdAt: record.createdAt, name, email, message };
  } catch { return null; }
}

export type SubmissionListing = { submissions: ContactSubmission[]; unreadable: number };
export type ListSubmissionsServices = { lister?: BlobLister; getter?: BlobTextGetter; prefix?: string };

/** Server-only: reads every private JSON record from the shared Part 1 blob store. */
export async function listContactSubmissions({ lister = blobLister, getter = blobTextGetter, prefix = "contact-submissions/" }: ListSubmissionsServices = {}): Promise<SubmissionListing> {
  const submissions: ContactSubmission[] = [];
  let unreadable = 0;
  let cursor: string | undefined;
  do {
    const page = await lister({ prefix, cursor });
    for (const { pathname } of page.blobs) {
      const raw = await getter(pathname).catch(() => null);
      const parsed = raw === null ? null : parseSubmission(raw);
      if (parsed) submissions.push(parsed); else unreadable++;
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  submissions.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  return { submissions, unreadable };
}
