import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "../NoteDetails.client";

export default async function NoteDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const noteId = Number(id);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={noteId} />
    </HydrationBoundary>
  );
}
