import { EditCourse } from "@/components/admin/edit-course/EditCourse";

interface EditCoursePageProps {
  params: Promise<{ id: string }>;
}

const EditCoursePage = async ({ params }: EditCoursePageProps) => {
  const { id } = await params;
  return <EditCourse id={id} />;
};

export default EditCoursePage;
