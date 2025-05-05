"use client";

import { useGetCourseDetailsQuery } from "@/redux/features/api/courseApi";
import { Loader } from "../layout/Loader";
import { CourseDetails } from "./CourseDetails";
import { SocketProvider } from "@/app/utils/SocketProvider";

interface CourseDetailsPageProps {
  id: string;
}

export const CourseDetailsPage = ({ id }: CourseDetailsPageProps) => {
  const { data, isLoading } = useGetCourseDetailsQuery(id);

  if (isLoading) return <Loader />;
  if (!data?.course)
    return (
      <div className="pt-60 pb-48">
        <p className="text-center">Courses not found.</p>
      </div>
    );

  return (
    <SocketProvider>
      <CourseDetails course={data.course} />
    </SocketProvider>
  );
};
