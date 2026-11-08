import { processContactRequest } from "@/lib/contact";

export const runtime = "nodejs";
export async function POST(request: Request) {
  return processContactRequest(request, process.env.CONTACT_FORM_ENDPOINT);
}
