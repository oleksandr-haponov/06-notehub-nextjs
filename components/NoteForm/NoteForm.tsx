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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSuccess({ title: title.trim(), content: content.trim(), tag });
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          className={css.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter title"
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          className={css.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="Enter content"
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          className={css.select}
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        >
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {errorMsg && <p className={css.error}>{errorMsg}</p>}

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
}
