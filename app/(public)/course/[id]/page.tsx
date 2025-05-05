import { CourseDetailsPage } from "@/components/public/CourseDetailsPage";

interface CourseByIdPageProps {
  params: Promise<{ id: string }>;
}

const CourseByIdPage = async ({ params }: CourseByIdPageProps) => {
  const { id } = await params;

  return <CourseDetailsPage id={id} />;
};

export default CourseByIdPage;
