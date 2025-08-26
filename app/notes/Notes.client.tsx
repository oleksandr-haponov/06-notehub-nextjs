"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { fetchNotes, type PaginatedNotesResponse } from "@/lib/api";

export default function NotesClient({
  initialQ,
  initialPage,
}: {
  initialQ?: string;
  initialPage: number;
}) {
  const q = initialQ ?? "";
  const page = initialPage || 1;

  const { data, isLoading, error } = useQuery<PaginatedNotesResponse>({
    queryKey: ["notes", { q, page }],
    queryFn: () => fetchNotes({ q, page }),
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error) {
    const msg = (error as Error).message || "Unknown error";
    return <p>Could not fetch the list of notes. {msg}</p>;
  }

  const notes = data?.notes ?? [];
  if (notes.length === 0) return <p>No notes found.</p>;

  return (
    <ul>
      {notes.map((n) => (
        <li key={n.id}>
          <Link href={`/notes/${n.id}`}>View details</Link> <span>{n.title}</span>
        </li>
      ))}
    </ul>
  );
}
