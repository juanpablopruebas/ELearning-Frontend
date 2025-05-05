import { ReviewCard } from "./ReviewCard";

export type ReviewType = {
  name: string;
  avatar: string;
  profession: string;
  comment: string;
  rating: number;
};

export const Reviews = () => {
  const reviews = [
    {
      name: "User 1",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      profession: "Student",
      comment: "Great course!",
      rating: 4.5,
    },
    {
      name: "User 2",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      profession: "Student",
      comment: "Loved it!",
      rating: 5,
    },
    {
      name: "User 3",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      profession: "Student",
      comment: "Very helpful!",
      rating: 4,
    },
  ];

  return (
    <section className="container mx-auto px-6 py-16 bg-white dark:bg-zinc-900 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Our Students Are Our Strength
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((r) => (
          <ReviewCard review={r} key={r.name} />
        ))}
      </div>
    </section>
  );
};
