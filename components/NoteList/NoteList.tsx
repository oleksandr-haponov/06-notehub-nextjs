"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";

export interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const qc = useQueryClient();

  const { mutate, isPending, variables, isError, error } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  if (!notes?.length) return null;

  return (
    <ul className={css.list}>
      {notes.map((n) => {
        const pending = isPending && variables === n.id;

        return (
          <li key={n.id} className={css.listItem}>
            <h3 className={css.title}>{n.title}</h3>
            <p className={css.content}>{n.content}</p>

            <div className={css.footer}>
              <span className={css.tag} title={n.tag}>
                {n.tag}
              </span>

              <div style={{ display: "flex", gap: 8 }}>
                <Link className={css.link} href={`/notes/${n.id}`}>
                  View details
                </Link>

                <button
                  className={css.button}
                  onClick={() => mutate(n.id)}
                  disabled={pending}
                  aria-busy={pending}
                >
                  {pending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>

            {isError && variables === n.id && (
              <p className={css.error}>{(error as Error)?.message ?? "Failed to delete note"}</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
