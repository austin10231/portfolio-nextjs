import { processNotesRequest } from "@/lib/notes";
import { blobNotesStore } from "@/lib/notes-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return processNotesRequest(request, blobNotesStore);
}

export async function POST(request: Request) {
  return processNotesRequest(request, blobNotesStore);
}
