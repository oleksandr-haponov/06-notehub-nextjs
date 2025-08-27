"use client";

import { useEffect, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { deleteNote, fetchNotes, type PaginatedNotesResponse } from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import css from "./NotesPage.module.css";

export default function NotesClient({
  initialQ,
  initialPage,
}: {
  initialQ?: string;
  initialPage: number;
}) {
  const qc = useQueryClient();

  const [search, setSearch] = useState<string>(initialQ ?? "");
  const [debouncedQ, setDebouncedQ] = useState<string>(initialQ ?? "");
  const [page, setPage] = useState<number>(initialPage || 1);

  // debounce поиска
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQ(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, error, isFetching } = useQuery<PaginatedNotesResponse>({
    queryKey: ["notes", { q: debouncedQ, page }],
    queryFn: () => fetchNotes({ q: debouncedQ, page }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  const del = useMutation({
    mutationFn: (id: number) => deleteNote(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <div style={{ flex: "1 1 520px", maxWidth: 520 }}>
          <SearchBox value={search} onChange={setSearch} placeholder="Search notes..." />
        </div>
        <Link href="/notes/New" className={css.button}>
          Create note
        </Link>
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
    </div>
  );
}
