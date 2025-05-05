/* eslint-disable @next/next/no-img-element */

import { Ratings } from "../admin/create-course/CoursePreview";
import { ReviewType } from "./Reviews";

interface ReviewCardProps {
  review: ReviewType;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow hover:shadow-md transition">
      <div className="flex items-center mb-4">
        <img
          src={review.avatar}
          alt={review.name}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h4 className="font-semibold">{review.name}</h4>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {review.profession}
          </p>
        </div>
      </div>
      <Ratings rating={review.rating} />
      <p className="mt-4 text-zinc-700 dark:text-zinc-300">{review.comment}</p>
    </div>
  );
};
