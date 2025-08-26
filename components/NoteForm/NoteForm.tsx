"use client";

import { useState } from "react";
import type { CreateNotePayload } from "@/lib/api";
import css from "./NoteForm.module.css";

export interface NoteFormProps {
  onSuccess: (payload: CreateNotePayload) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  errorMsg?: string;
}

const TAGS = ["Todo", "Work", "Personal", "Idea", "Other"];

export default function NoteForm({ onSuccess, onCancel, isSubmitting, errorMsg }: NoteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("Todo");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSuccess({ title: title.trim(), content: content.trim(), tag });
  }

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.field}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter title"
        />
      </div>

      <div className={css.field}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="Enter content"
        />
      </div>

      <div className={css.field}>
        <label htmlFor="tag">Tag</label>
        <select id="tag" value={tag} onChange={(e) => setTag(e.target.value)}>
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {errorMsg && <p className={css.error}>{errorMsg}</p>}

      <div className={css.actions}>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
}
