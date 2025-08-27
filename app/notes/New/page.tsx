// app/notes/New/page.tsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createNote, type CreateNotePayload } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

export default function NewNotePage() {
  const router = useRouter();
  const qc = useQueryClient();

  const close = () => router.back();

  const create = useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      close();
    },
  });

  return (
    <Modal open onClose={close}>
      <NoteForm
        onSuccess={(payload) => create.mutate(payload)}
        onCancel={close}
        isSubmitting={create.isPending}
        errorMsg={
          create.isError ? ((create.error as Error)?.message ?? "Failed to create note") : undefined
        }
      />
    </Modal>
  );
}
