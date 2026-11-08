import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "name_length").max(80, "name_length"),
  email: z.string().trim().max(254, "email_invalid").email("email_invalid"),
  message: z.string().trim().min(10, "message_length").max(5000, "message_length"),
  website: z.string().max(0, "invalid_submission").optional(),
});
export type ContactInput = z.infer<typeof contactSchema>;
type Fetch = typeof fetch;
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

/** Exported so tests exercise the same request path used by the deployed Route Handler. */
export async function processContactRequest(request: Request, endpoint = "", fetcher: Fetch = fetch): Promise<Response> {
  const json = (body: object, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
  if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return json({ ok: false, error: "invalid_origin" }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) return json({ ok: false, error: "invalid_content_type" }, 415);
  let payload: unknown;
  try { payload = JSON.parse(await readBody(request)); }
  catch (error) { return json({ ok: false, error: error instanceof Error && error.message === "body_too_large" ? "body_too_large" : "invalid_json" }, error instanceof Error && error.message === "body_too_large" ? 413 : 400); }
  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      errors[field] ??= field === "email" ? "email_invalid" : field === "name" ? "name_length" : field === "message" ? "message_length" : "invalid_submission";
    }
    return json({ ok: false, error: "validation_failed", errors }, 400);
  }
  // Credentials/configuration are server-only. The original website's endpoint is not embedded.
  if (!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)) return json({ ok: false, error: "service_unavailable" }, 503);
  try {
    const { name, email, message } = parsed.data;
    const response = await fetcher(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name, email, message, _subject: "New portfolio-nextjs contact message" }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return json({ ok: false, error: "delivery_failed" }, 502);
    return json({ ok: true, message: "sent" }, 200);
  } catch { return json({ ok: false, error: "delivery_failed" }, 502); }
}
