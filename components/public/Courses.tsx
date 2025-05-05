"use client";

import { useGetCoursesQuery } from "@/redux/features/api/courseApi";
import { Course } from "@/types";
import { useEffect, useState } from "react";
import { CourseCard } from "./CourseCard";
import { Loader } from "../layout/Loader";

export const Courses = () => {
  const { data, isLoading } = useGetCoursesQuery({});
  const [courses, setCourses] = useState<Course[]>(data?.courses ?? []);

  useEffect(() => {
    if (data?.courses) setCourses(data.courses);
  }, [data?.courses]);

  return (
    <section className="container mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Expand Your Career Opportunities
      </h2>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard course={course} key={course._id} />
          ))}
        </div>
      )}
    </section>
  );
};
