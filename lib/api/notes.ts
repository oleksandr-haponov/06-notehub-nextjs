import api from "./axios";
import { Note } from "@/types/note";

export const fetchNotes = async (): Promise<Note[]> => {
  const { data } = await api.get("/notes");
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get(`/notes/${id}`);
  return data;
};

export const createNote = async (note: Omit<Note, "id" | "createdAt">): Promise<Note> => {
  const { data } = await api.post("/notes", note);
  return data;
};

export const updateNote = async (id: string, note: Partial<Note>): Promise<Note> => {
  const { data } = await api.put(`/notes/${id}`, note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete(`/notes/${id}`);
  return data;
};
