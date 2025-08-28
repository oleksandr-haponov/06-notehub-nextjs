import { NextRequest, NextResponse } from "next/server";
import { notes } from "@/lib/api/mockData";

type Note = (typeof notes)[number];

// ↓ Зробимо менше, щоб на демо-проєкті завжди було 2+ сторінок
const PAGE_SIZE = 2;

function filter(all: Note[], q?: string) {
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
  const p = Math.min(Math.max(1, Number.isFinite(page) && page > 0 ? page : 1), totalPages);
  const start = (p - 1) * PAGE_SIZE;
  return { items: all.slice(start, start + PAGE_SIZE), totalPages };
}

// GET /api/notes?q=&page=
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");

  const filtered = filter(notes, q);
  const { items, totalPages } = paginate(filtered, page);

  return NextResponse.json({ notes: items, totalPages });
}

// POST /api/notes
export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Pick<Note, "title" | "content" | "tag">>;

  if (!body?.title || !body?.tag) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const now = new Date().toISOString();
  // генерируем строковый id
  const id = (globalThis.crypto?.randomUUID?.() ?? Date.now().toString()) as string;

  const newNote: Note = {
    id,
    title: body.title,
    content: body.content ?? "", // content необязателен
    tag: body.tag,
    createdAt: now,
    updatedAt: now,
  };

  notes.unshift(newNote);
  return NextResponse.json(newNote, { status: 201 });
}
