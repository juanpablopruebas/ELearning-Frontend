import { FC } from "react";
import { CourseContentDataStateType } from "./CourseContent";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BiSolidStarHalf } from "react-icons/bi";
import { MdCheck, MdRadioButtonChecked } from "react-icons/md";

export type CourseDataStateType = {
  name: string;
  description: string;
  price: string;
  estimatedPrice?: string;
  tags: string;
  thumbnail?: string;
  level: string;
  demoUrl: string;
  totalVideos: number;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  courseData: CourseContentDataStateType[];
};

type CoursePreviewType = {
  currentStep: number;
  courseData?: CourseDataStateType;
  isEdit?: boolean;
  handleSubmit: () => void;
  setCurrentStep: (active: number) => void;
};

export const CoursePreview = ({
  currentStep,
  courseData,
  isEdit = false,
  handleSubmit,
  setCurrentStep,
}: CoursePreviewType) => {
  const discountPercentage =
    ((Number(courseData?.estimatedPrice) - Number(courseData?.price)) /
      Number(courseData?.estimatedPrice)) *
    100;
  const discountPercentagePrice = discountPercentage.toFixed(0);

  const prevButton = () => setCurrentStep(currentStep - 1);

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md">
      <div className="mb-4">
        <CoursePlayer videoUrl={courseData?.demoUrl} />
      </div>
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-300">
          {courseData?.price === "0" ? "Free" : "$ " + courseData?.price}
        </h1>
        {courseData?.estimatedPrice ? (
          <>
            <h5 className="text-lg line-through text-gray-500">
              $ {courseData?.estimatedPrice}
            </h5>
            <h4 className="text-lg font-semibold text-green-600">
              {discountPercentagePrice}% Off
            </h4>
          </>
        ) : null}
      </div>
      <div className="mt-4">
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Buy Now $ {courseData?.price}
        </button>
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Promo code"
          className="flex-1 border border-gray-300 rounded-md p-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Apply
        </button>
      </div>
      <div className="mt-6 space-y-2 text-gray-900 dark:text-gray-300">
        <p>* Source code included</p>
        <p>* Full lifetime access</p>
        <p>* Certificate of completion</p>
        <p>* Premium support</p>
      </div>
      <div className="mt-8 text-gray-900 dark:text-gray-300">
        <h1 className="text-3xl font-bold">{courseData?.name}</h1>
        <div className="flex items-center space-x-4 mt-2">
          <Ratings rating={0} />
          <h5 className="text-lg">0 Reviews</h5>
          <h5 className="text-lg">0 Students</h5>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">
            What you will learn from this course?
          </h2>
          {courseData?.benefits.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 mt-2">
              <MdCheck size={20} className="text-green-600" />
              <p className="text-gray-900 dark:text-gray-300">{item.title}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Prerequisites</h2>
          {courseData?.prerequisites.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 mt-2">
              <MdRadioButtonChecked size={20} className="text-blue-600" />
              <p className="text-gray-900 dark:text-gray-300">{item.title}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Course Details</h2>
          <p className="text-gray-900 dark:text-gray-300">
            {courseData?.description}
          </p>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button
          onClick={prevButton}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Prev
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {isEdit ? "Update" : "Create"}
        </button>
      </div>
    </div>
  );
};

export const CoursePlayer = ({ videoUrl }: { videoUrl?: string }) => {
  const getYouTubeEmbedUrl = (url?: string): string | null => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div className="relative w-full pb-[56.25%] bg-black rounded-lg overflow-hidden shadow-lg">
      {embedUrl ? (
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={embedUrl}
          title="YouTube Video Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-gray-200">No Demo Video Available</p>
        </div>
      )}
    </div>
  );
};

export const Ratings: FC<{ rating: number }> = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<AiFillStar key={i} size={20} className="text-yellow-400" />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(
        <BiSolidStarHalf key={i} size={20} className="text-yellow-400" />
      );
    } else {
      stars.push(<AiOutlineStar key={i} size={20} className="text-gray-400" />);
    }
  }
  return <div className="flex">{stars}</div>;
};
