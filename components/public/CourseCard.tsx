/* eslint-disable @next/next/no-img-element */
import { Course } from "@/types";
import Link from "next/link";
import { Ratings } from "../admin/create-course/CoursePreview";
import { AiOutlineUnorderedList } from "react-icons/ai";

interface CourseCardProps {
  course: Course;
  isProfile?: boolean;
}

export const CourseCard = ({ course, isProfile }: CourseCardProps) => {
  return (
    <Link
      href={
        !isProfile ? `/course/${course._id}` : `/course-access/${course._id}`
      }
      className="block bg-white dark:bg-zinc-900 rounded-lg shadow hover:shadow-md overflow-hidden transition"
    >
      <img
        src={course.thumbnail?.url ?? '/assets/course-default.png'}
        alt={course.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{course.name}</h3>
        <div className="flex items-center justify-between">
          <Ratings rating={course.ratings} />
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {course.purchased} Students
          </span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-xl font-bold">
              {course.price === 0 ? "Free" : `$${course.price}`}
            </span>
            <span className="text-sm line-through text-zinc-500 ml-2">
              ${course.estimatedPrice}
            </span>
          </div>
          <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
            <AiOutlineUnorderedList />
            <span className="ml-1">{course.courseData.length} Lectures</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
