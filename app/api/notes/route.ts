import { NextRequest, NextResponse } from "next/server";
import { notes } from "@/lib/api/mockData";

type Note = (typeof notes)[number];
const PAGE_SIZE = 10;

function filterNotes(all: Note[], q?: string) {
  if (!q) return all;
  const s = q.toLowerCase();
  return all.filter(
    (n) =>
      n.title.toLowerCase().includes(s) ||
      n.content.toLowerCase().includes(s) ||
      String(n.tag ?? "")
        .toLowerCase()
        .includes(s),
  );
}

function paginate(all: Note[], page: number) {
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const p = Math.min(Math.max(1, page || 1), totalPages);
  const start = (p - 1) * PAGE_SIZE;
  const items = all.slice(start, start + PAGE_SIZE);
  return { items, totalPages };
}

// GET /api/notes?q=&page=
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");

  const filtered = filterNotes(notes, q);
  const { items, totalPages } = paginate(filtered, page);

  return NextResponse.json({ notes: items, totalPages });
}

// POST /api/notes
export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Pick<Note, "title" | "content" | "tag">>;

  if (!body?.title || !body?.content || !body?.tag) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const maxId = notes.reduce((m, n) => (n.id > m ? n.id : m), 0);

  const newNote = {
    id: maxId + 1,
    title: body.title,
    content: body.content,
    tag: body.tag,
    createdAt: now,
    updatedAt: now,
  } as Note;

  notes.unshift(newNote);
  return NextResponse.json(newNote, { status: 201 });
}
