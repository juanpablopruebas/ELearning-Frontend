import { SocketProvider } from "@/app/utils/SocketProvider";
import { CourseAccess } from "@/components/public/CourseAccess";

interface CourseAccessPageProps {
  params: Promise<{ id: string }>;
}

const CourseAccessPage = async ({ params }: CourseAccessPageProps) => {
  const { id } = await params;

  return (
    <SocketProvider>
      <CourseAccess id={id} />
    </SocketProvider>
  );
};

export default CourseAccessPage;
