import { CoursesPage } from "@/components/public/CoursesPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ title?: string }>;
}) {
  const { title } = await searchParams;
  return <CoursesPage title={title} />;
}
