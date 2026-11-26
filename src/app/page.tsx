import { CalendarApp } from "@/components/CalendarApp";
import { getStorageMode, listComments } from "@/lib/comments-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [initialComments, storageMode] = await Promise.all([
    listComments(),
    Promise.resolve(getStorageMode()),
  ]);
  return (
    <CalendarApp
      initialComments={initialComments}
      storageMode={storageMode}
    />
  );
}
