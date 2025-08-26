"use client";

import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

export default function NotesError({ error }: { error: Error }) {
  return <ErrorMessage message={`Could not fetch the list of notes. ${error.message}`} />;
}
