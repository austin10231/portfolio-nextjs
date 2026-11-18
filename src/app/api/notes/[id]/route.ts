import { processNotesRequest } from "@/lib/notes";
import { blobNotesStore } from "@/lib/notes-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
  const { id } = await context.params;
  return processNotesRequest(request, blobNotesStore, id);
}

export async function PUT(request: Request, context: Context) {
  const { id } = await context.params;
  return processNotesRequest(request, blobNotesStore, id);
}

export async function PATCH(request: Request, context: Context) {
  const { id } = await context.params;
  return processNotesRequest(request, blobNotesStore, id);
}

export async function DELETE(request: Request, context: Context) {
  const { id } = await context.params;
  return processNotesRequest(request, blobNotesStore, id);
}

export async function POST(request: Request, context: Context) {
  const { id } = await context.params;
  return processNotesRequest(request, blobNotesStore, id);
}
