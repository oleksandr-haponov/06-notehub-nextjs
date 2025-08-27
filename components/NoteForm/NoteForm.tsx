"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { createNote, type CreateNotePayload } from "@/lib/api";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import css from "./NoteForm.module.css";

export interface NoteFormProps {
  onCancel: () => void;
}

const TAGS = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;

const Schema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  content: Yup.string().trim().optional(), // контент по ТЗ не обязателен
  tag: Yup.string()
    .oneOf(TAGS as unknown as string[], "Invalid tag")
    .required("Tag is required"),
});

type FormValues = {
  title: string;
  content: string;
  tag: (typeof TAGS)[number];
};

export default function NoteForm({ onCancel }: NoteFormProps) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: () => {
      // инвалидация списка
      qc.invalidateQueries({ queryKey: ["notes"] });
      // закрываем модалку после успешного создания
      onCancel();
    },
  });

  const initialValues: FormValues = {
    title: "",
    content: "",
    tag: "Todo",
  };

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={Schema}
      onSubmit={(values) => {
        // уже очищенные/валидные значения
        const payload: CreateNotePayload = {
          title: values.title.trim(),
          content: values.content.trim(),
          tag: values.tag,
        };
        mutation.mutate(payload);
      }}
      validateOnBlur
      validateOnChange={false}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className={css.form} noValidate>
          {/* Title */}
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field
              id="title"
              name="title"
              className={css.input}
              placeholder="Enter title"
              aria-invalid={touched.title && !!errors.title}
              autoFocus
            />
            {touched.title && errors.title ? <ErrorMessage message={errors.title} /> : null}
          </div>

          {/* Content (optional) */}
          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              className={css.textarea}
              placeholder="Enter content (optional)"
              aria-invalid={touched.content && !!errors.content}
            />
            {touched.content && errors.content ? <ErrorMessage message={errors.content} /> : null}
          </div>

          {/* Tag */}
          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Field>
            {touched.tag && errors.tag ? <ErrorMessage message={errors.tag} /> : null}
          </div>

          {/* Ошибка сервера (мутатора) */}
          {mutation.isError ? (
            <p className={css.error}>
              {(mutation.error as Error)?.message ?? "Failed to create note"}
            </p>
          ) : null}

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
              disabled={isSubmitting || mutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || mutation.isPending}
            >
              {mutation.isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
