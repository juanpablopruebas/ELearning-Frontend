"use client";

import { Loader } from "@/components/layout/Loader";
import { CourseCard } from "@/components/public/CourseCard";
import { CourseSearchFormDebounce } from "@/components/public/CoursesSearchForm";
import { useGetCoursesQuery } from "@/redux/features/api/courseApi";
import { useGetLayoutQuery } from "@/redux/features/api/layoutApi";
import { CategoriesData, Course } from "@/types";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const CoursesPage = () => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("title")?.toLowerCase() || "";

  const { data: coursesData, isLoading } = useGetCoursesQuery({});
  const { data: layoutData } = useGetLayoutQuery("Categories");

  const [category, setCategory] = useState<string>("All");

  const categories = useMemo<string[]>(
    () => [
      "All",
      ...(layoutData?.layout.categories.map((c: CategoriesData) => c.title) ||
        []),
    ],
    [layoutData]
  );

  const filteredCourses = useMemo(() => {
    const allCourses = coursesData?.courses || [];

    return allCourses.filter((course: Course) => {
      const matchesSearch = search
        ? course.name.toLowerCase().includes(search)
        : true;

      const matchesCategory =
        category === "All" || course.categories === category;

      return matchesSearch && matchesCategory;
    });
  }, [coursesData?.courses, search, category]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <main className="container mx-auto py-16">
        <section className="pt-16">
          <h2 className="text-2xl font-semibold mb-4">Filter by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full border transition-all whitespace-nowrap
                ${
                  category === cat
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800"
                }
              `}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex justify-center mb-10">
            <CourseSearchFormDebounce initialValue={search} />
          </div>
        </section>

        <section className="mt-12">
          {filteredCourses.length === 0 ? (
            <p className="text-center text-zinc-600 dark:text-zinc-400 mb-4">
              {search
                ? "No courses found."
                : "No courses in this category. Please try another one."}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course: Course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default CoursesPage;
