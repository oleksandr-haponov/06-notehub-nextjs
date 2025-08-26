import api from "@/lib/api/axios";
import type { Note } from "@/types/note";

export interface PaginatedNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface NotesQueryParams {
  q?: string;
  page?: number;
}

export type CreateNotePayload = Pick<Note, "title" | "content" | "tag">;
export type UpdateNotePayload = Partial<Pick<Note, "title" | "content" | "tag">>;

export async function fetchNotes(params: NotesQueryParams = {}): Promise<PaginatedNotesResponse> {
  const { q, page } = params;
  const { data } = await api.get<PaginatedNotesResponse>("/notes", {
    params: { q, page },
  });
  return data;
}

export async function fetchNoteById(id: number): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
}

export async function updateNote(id: number, patch: UpdateNotePayload): Promise<Note> {
  const { data } = await api.patch<Note>(`/notes/${id}`, patch);
  return data;
}

export async function deleteNote(id: number): Promise<void> {
  await api.delete<void>(`/notes/${id}`);
}
