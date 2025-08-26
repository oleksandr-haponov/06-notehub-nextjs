import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const page = sp.page ? Number(sp.page) : 1;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", { q: q ?? "", page }],
    queryFn: () => fetchNotes({ q, page }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialQ={q} initialPage={page} />
    </HydrationBoundary>
  );
}
