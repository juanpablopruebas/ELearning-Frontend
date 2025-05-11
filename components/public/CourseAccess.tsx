"use client";

import { useEffect } from "react";
import { CourseContent } from "./CourseContent";
import { useRouter } from "next/navigation";
import { IRootState } from "@/redux/store";
import { useSelector } from "react-redux";

export const CourseAccess = ({ id }: { id: string }) => {
  const router = useRouter();
  const { user } = useSelector((state: IRootState) => state.auth);

  useEffect(() => {
    if (user) {
      const purchased = user?.courses.some(
        ({ courseId }: { courseId: string }) => courseId === id
      );
      if (!purchased) {
        router.push("/");
      }
    }
  }, [id, router, user]);

  return (
    <main className="min-h-screen pt-16 pb-8">
      <CourseContent id={id} user={user} />
    </main>
  );
};
