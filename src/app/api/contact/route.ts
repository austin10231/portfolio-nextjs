import { processContactRequest } from "@/lib/contact";
import { saveContactSubmission } from "@/lib/contact-storage";

export const runtime = "nodejs";
export async function POST(request: Request) {
  return processContactRequest(request, { saveSubmission: saveContactSubmission, endpoint: process.env.CONTACT_FORM_ENDPOINT });
}
