"use client";

import { useEffect, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNote, deleteNote, fetchNotes, type CreateNotePayload } from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./Notes.module.css";

export default function NotesClient({
  initialQ,
  initialPage,
}: {
  initialQ?: string;
  initialPage: number;
}) {
  const qc = useQueryClient();

  const [isModalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState<string>(initialQ ?? "");
  const [debouncedQ, setDebouncedQ] = useState<string>(initialQ ?? "");
  const [page, setPage] = useState<number>(initialPage || 1);

  // debounce поиска
  useEffect(() => {
    const t = setTimeout(() => {
      const next = search.trim();
      setDebouncedQ(next);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["notes", { q: debouncedQ, page }],
    queryFn: () => fetchNotes({ q: debouncedQ, page }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  const totalPages = data?.totalPages ?? 1;
  const notes = data?.notes ?? [];

  const del = useMutation({
    mutationFn: (id: number) => deleteNote(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });

  const create = useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: () => {
      setModalOpen(false);
      qc.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        {/* инпут слева, кнопка Create справа */}
        <div style={{ flex: "1 1 520px", maxWidth: 520 }}>
          <SearchBox value={search} onChange={setSearch} placeholder="Search notes..." />
        </div>
        <button type="button" className={css.button} onClick={() => setModalOpen(true)}>
          Create note
        </button>
      </div>

      {isLoading ? (
        <p>Loading, please wait...</p>
      ) : error ? (
        <p>Could not fetch the list of notes. {(error as Error).message}</p>
      ) : notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <>
          <NoteList
            notes={notes}
            onDelete={(id) => del.mutate(id)}
            isDeleting={del.isPending}
            deletingId={(del.variables as number | undefined) ?? undefined}
          />
          {totalPages > 1 && (
            <div className={css.paginationWrap}>
              <Pagination
                pageCount={totalPages}
                currentPage={page}
                onPageChange={(p) => setPage(p)}
                isFetchingPage={isFetching}
              />
            </div>
          )}
        </>
      )}

      <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
        <NoteForm
          onCancel={() => setModalOpen(false)}
          onSuccess={(payload) => create.mutate(payload)}
          isSubmitting={create.isPending}
          errorMsg={
            create.isError
              ? ((create.error as Error)?.message ?? "Failed to create note")
              : undefined
          }
        />
      </Modal>
    </div>
  );
}
