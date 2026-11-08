import { put } from "@vercel/blob";
import type { ContactSubmission, SaveSubmission } from "./contact";

type PrivateJsonWriter = (path: string, body: string, options: {
  access: "private";
  contentType: "application/json";
  addRandomSuffix: false;
  allowOverwrite: false;
  abortSignal: AbortSignal;
}) => Promise<unknown>;

/** Server adapter: never imported by a Client Component; credentials stay on the server. */
export function createContactStore(write: PrivateJsonWriter = put): SaveSubmission {
  return async (submission: ContactSubmission) => {
    await write(`contact-submissions/${submission.id}.json`, `${JSON.stringify(submission, null, 2)}\n`, {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: false,
      abortSignal: AbortSignal.timeout(10_000),
    });
  };
}

export const saveContactSubmission = createContactStore();
