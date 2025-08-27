import { NextRequest, NextResponse } from "next/server";
import { notes } from "@/lib/api/mockData";

type Note = (typeof notes)[number];
type PatchBody = Partial<Pick<Note, "title" | "content" | "tag">>;

function isValidId(id: string): boolean {
  return typeof id === "string" && id.trim().length > 0;
}

// GET /api/notes/[id]
export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  const note = notes.find((n) => n.id === id);
  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  return NextResponse.json(note);
}

// PATCH /api/notes/[id]
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  const body = (await req.json()) as PatchBody;
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  notes[idx] = {
    ...notes[idx],
    ...body,
    updatedAt: new Date().toISOString(),
  } as Note;

  return NextResponse.json(notes[idx]);
}

// DELETE /api/notes/[id]
export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  const [deleted] = notes.splice(idx, 1);
  return NextResponse.json(deleted);
}
