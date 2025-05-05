"use client";

/* eslint-disable @next/next/no-img-element */
import { Loader } from "@/components/layout/Loader";
import { CourseSearchFormInput } from "@/components/public/CoursesSearchForm";
import { useGetLayoutQuery } from "@/redux/features/api/layoutApi";
import Link from "next/link";

export const Hero = () => {
  const { data, isLoading } = useGetLayoutQuery("Banner");

  if (isLoading) return <Loader />;

  return (
    <div className="w-full flex flex-col-reverse lg:flex-row items-center justify-around px-6 md:px-12 pt-16 min-h-screen bg-gray-100 dark:bg-zinc-800 transition-all">
      <div className="lg:w-1/2 text-center lg:text-left flex flex-col items-center lg:items-start lg:ml-8">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
          {data.layout?.banner?.title}
        </h2>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          {data.layout?.banner?.subTitle}
        </p>
        <CourseSearchFormInput />
        <div className="mt-6 flex items-center">
          <img
            width={40}
            height={40}
            src="/assets/prof1.png"
            alt="User 1"
            className="rounded-full"
          />
          <img
            width={40}
            height={40}
            src="/assets/prof2.png"
            alt="User 2"
            className="rounded-full -ml-2"
          />
          <img
            width={40}
            height={40}
            src="/assets/prof3.png"
            alt="User 3"
            className="rounded-full -ml-2"
          />
          <p className="ml-4 text-gray-900 dark:text-gray-300 font-medium">
            30K+ students trust us.{" "}
            <Link href="/courses" className="text-blue-500 hover:text-blue-400">
              View Courses
            </Link>
          </p>
        </div>
      </div>
      <div className="lg:w-1/2 flex justify-center">
        <img
          width={512}
          height={512}
          src={data.layout?.banner?.image?.url}
          alt="Banner Image"
          className="object-contain max-w-xs md:max-w-md lg:max-w-lg"
        />
      </div>
    </div>
  );
};
