"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

export default function NewNotePage() {
  const router = useRouter();
  const close = () => router.back();

  return (
    <Modal open onClose={close}>
      <NoteForm onCancel={close} />
    </Modal>
  );
}
