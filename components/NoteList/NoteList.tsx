"use client";

import Link from "next/link";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";

export interface NoteListProps {
  notes: Note[];
  onDelete: (id: number) => void;
  isDeleting?: boolean;
  deletingId?: number;
}

export default function NoteList({ notes, onDelete, isDeleting, deletingId }: NoteListProps) {
  return (
    <ul className={css.list}>
      {notes.map((n) => (
        <li key={n.id} className={css.item}>
          <div className={css.header}>
            <h3 className={css.title}>{n.title}</h3>
          </div>
          <p className={css.content}>{n.content}</p>
          <p className={css.date}>{new Date(n.createdAt).toLocaleDateString()}</p>
          <div className={css.actions}>
            <Link className={css.link} href={`/notes/${n.id}`}>
              View details
            </Link>
            <button
              className={css.delete}
              onClick={() => onDelete(n.id)}
              disabled={isDeleting && deletingId === n.id}
            >
              {isDeleting && deletingId === n.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
