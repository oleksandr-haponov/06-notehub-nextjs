import { NextRequest, NextResponse } from "next/server";
import { notes } from "@/lib/api/mockData";

type Note = (typeof notes)[number];
type PatchBody = Partial<Pick<Note, "title" | "content" | "tag">>;

function parseId(idStr: string): number | null {
  const idNum = Number(idStr);
  return Number.isFinite(idNum) ? idNum : null;
}

// GET /api/notes/[id]
export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const noteId = parseId(id);
  if (noteId === null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const note = notes.find((n) => n.id === noteId);
  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  return NextResponse.json(note);
}

// PATCH /api/notes/[id]
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const noteId = parseId(id);
  if (noteId === null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = (await req.json()) as PatchBody;
  const idx = notes.findIndex((n) => n.id === noteId);
  if (idx === -1) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  const now = new Date().toISOString();
  notes[idx] = { ...notes[idx], ...body, updatedAt: now } as Note;
  return NextResponse.json(notes[idx]);
}

// DELETE /api/notes/[id]
export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const noteId = parseId(id);
  if (noteId === null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const idx = notes.findIndex((n) => n.id === noteId);
  if (idx === -1) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  const [deleted] = notes.splice(idx, 1);
  return NextResponse.json(deleted);
}
