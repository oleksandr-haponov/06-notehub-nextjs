"use client";

import type { Note } from "@/types/note";
import css from "./NotePreview.module.css";

export interface NotePreviewProps {
  note?: Note | null;
  onBack?: () => void;
}

export default function NotePreview({ note, onBack }: NotePreviewProps) {
  if (!note) {
    return (
      <div className={css.container}>
        <div className={css.item}>
          {onBack && (
            <button className={css.backBtn} onClick={onBack}>
              ← Back
            </button>
          )}
          <p className={css.content}>No note selected.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={css.container}>
      <div className={css.item}>
        {onBack && (
          <button className={css.backBtn} onClick={onBack}>
            ← Back
          </button>
        )}

        <div className={css.header}>
          <h2>{note.title}</h2>
          <span className={css.tag} title={note.tag}>
            {note.tag}
          </span>
        </div>

        <p className={css.content}>{note.content}</p>

        <p className={css.date}>{new Date(note.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
