"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, type CreateNotePayload } from "@/lib/api";
import NoteEditor from "@/components/NoteEditor/NoteEditor";
import { useRouter } from "next/navigation";

// NoteEditor, судя по проекту, вызывает onSave({ title, content })
// поэтому здесь добавляем обязательный tag
type EditorPayload = { title: string; content: string };

export default function NewNotePage() {
  const qc = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: () => {
      // Обновляем список и уходим на /notes
      qc.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes");
    },
  });

  return (
    <main style={{ padding: "2rem", display: "grid", gap: "1rem" }}>
      <h1>Create New Note</h1>

      <NoteEditor
        onSave={(data: EditorPayload) => {
          const payload: CreateNotePayload = {
            title: data.title.trim(),
            content: data.content.trim(),
            tag: "Todo", // дефолтный тег, чтобы пройти типы и API
          };
          mutation.mutate(payload);
        }}
      />

      {mutation.isPending && <p>Creating...</p>}
      {mutation.isError && (
        <p style={{ color: "crimson" }}>
          {(mutation.error as Error)?.message ?? "Failed to create note"}
        </p>
      )}
    </main>
  );
}
