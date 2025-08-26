"use client";

import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

export default function NoteDetailsError({ error }: { error: Error }) {
  return <ErrorMessage message={`Could not fetch note details. ${error.message}`} />;
}
