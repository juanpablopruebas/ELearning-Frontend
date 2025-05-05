import { useGetCourseContentQuery } from "@/redux/features/api/courseApi";
import { Loader } from "../layout/Loader";
import { useState } from "react";
import { CourseContentMedia } from "./CourseContentMedia";
import { Header } from "../layout/Header";
import { CourseContentList } from "./CourseContentList";
import { User } from "@/types";
import { Footer } from "./Footer";

interface CourseContentProps {
  id: string;
  user?: User;
}

export const CourseContent = ({ id, user }: CourseContentProps) => {
  const { data, isLoading, refetch } = useGetCourseContentQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const [activeVideo, setActiveVideo] = useState(0);

  if (isLoading) {
    return (
      <div className="mt-[-4rem]">
        <Loader />
      </div>
    );
  }

  if (!data?.course) {
    return (
      <>
        <Header />
        <div className="flex h-screen justify-center items-center">
          Course not found.
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
          <section>
            <CourseContentMedia
              data={data.course}
              id={id}
              user={user}
              activeVideo={activeVideo}
              setActiveVideo={setActiveVideo}
              refetch={refetch}
            />
          </section>

          <aside className="sticky top-20">
            <CourseContentList
              contentData={data.course.courseData}
              activeVideo={activeVideo}
              setActiveVideo={setActiveVideo}
            />
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
};
