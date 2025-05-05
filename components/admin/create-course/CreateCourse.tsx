"use client";

import { FC, useEffect, useState } from "react";
import { CourseInfo, CourseInfoStateType } from "./CourseInfo";
import { CourseContent, CourseContentDataStateType } from "./CourseContent";
import { CourseDataStateType, CoursePreview } from "./CoursePreview";
import { CourseOptions } from "./CourseOptions";
import { CourseData } from "./CourseData";
import { useCreateCourseMutation } from "@/redux/features/api/courseApi";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

export const CreateCourse: FC = () => {
  const [createCourse, { isLoading, isSuccess, error }] =
    useCreateCourseMutation();
  const [currentStep, setCurrentStep] = useState(0);
  const [courseInfo, setCourseInfo] = useState<CourseInfoStateType>({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "",
    demoUrl: "",
    thumbnail: "",
    categories: "",
  });
  const [benefits, setBenefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
  const [courseContentData, setCourseContentData] = useState<
    CourseContentDataStateType[]
  >([
    {
      videoUrl: "",
      videoTitle: "",
      videoLength: 0,
      description: "",
      sectionTitle: "Untitled Section",
      links: [{ title: "", url: "" }],
      suggestion: "",
    },
  ]);
  const [courseData, setCourseData] = useState<CourseDataStateType>();

  const formatCourseData = () => {
    const formattedBenefits = benefits.map((benefit) => ({
      title: benefit.title,
    }));
    const formattedPrerequisites = prerequisites.map((prerequisite) => ({
      title: prerequisite.title,
    }));
    const formattedCourseContentData = courseContentData.map((data) => ({
      videoUrl: data.videoUrl,
      videoTitle: data.videoTitle,
      videoLength: data.videoLength,
      description: data.description,
      sectionTitle: data.sectionTitle,
      links: data.links.map((link) => ({ title: link.title, url: link.url })),
      suggestion: data.suggestion,
    }));

    const data = {
      name: courseInfo.name,
      description: courseInfo.description,
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice,
      tags: courseInfo.tags,
      thumbnail: courseInfo.thumbnail,
      categories: courseInfo.categories,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseData: formattedCourseContentData,
    };
    setCourseData(data);
  };

  useEffect(() => {
    if (currentStep === 3) {
      formatCourseData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course created successfully");
      redirect("/admin/courses");
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = (error.data as { message?: string }).message;
        toast.error(errorMessage);
      } else if ("error" in error) {
        toast.error(error.error);
      } else {
        toast.error("Something went wrong.");
      }
    }
  }, [isSuccess, error]);

  const handleCourseCreate = async () => {
    if (!isLoading) {
      createCourse(courseData);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full p-6">
      <div className="flex-1">
        {currentStep === 0 && (
          <CourseInfo
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        )}
        {currentStep === 1 && (
          <CourseData
            benefits={benefits}
            setBenefits={setBenefits}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        )}
        {currentStep === 2 && (
          <CourseContent
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        )}
        {currentStep === 3 && (
          <CoursePreview
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            courseData={courseData}
            handleSubmit={handleCourseCreate}
          />
        )}
      </div>
      <div className="w-full lg:w-1/4">
        <CourseOptions currentStep={currentStep} />
      </div>
    </div>
  );
};
