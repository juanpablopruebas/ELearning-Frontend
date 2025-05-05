"use client";

import { useEffect } from "react";
import { Loader } from "../layout/Loader";
import { CourseContent } from "./CourseContent";
import { useLoadUserQuery } from "@/redux/features/api/indexApi";
import { useRouter } from "next/navigation";

export const CourseAccess = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data, isLoading, error } = useLoadUserQuery({});

  useEffect(() => {
    if (!isLoading) {
      const purchased = data?.user?.courses.some(
        ({ courseId }: { courseId: string }) => courseId === id
      );
      if (error || !purchased) {
        router.push("/");
      }
    }
  }, [isLoading, error, data?.user?.courses, id, router]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <main className="min-h-screen pt-16 pb-8">
      <CourseContent id={id} user={data?.user} />
    </main>
  );
};
