import { CourseAccess } from "@/components/public/CourseAccess";

interface CourseAccessPageProps {
  params: Promise<{ id: string }>;
}

const CourseAccessPage = async ({ params }: CourseAccessPageProps) => {
  const { id } = await params;

  return <CourseAccess id={id} />;
};

export default CourseAccessPage;
