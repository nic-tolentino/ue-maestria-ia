import { CalendarApp } from "@/components/CalendarApp";
import { listComments } from "@/lib/comments-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialComments = await listComments();
  return <CalendarApp initialComments={initialComments} />;
}
