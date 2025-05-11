"use client";

import { SingleCourse } from "@/types";
import { CoursePlayer, Ratings } from "../admin/create-course/CoursePreview";
import { format } from "timeago.js";
import Link from "next/link";
import { CourseContentList } from "./CourseContentList";
import { Button } from "../ui/button";
import { useEffect, useMemo, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "./CheckoutForm";
import {
  useCreateOrderMutation,
  useCreatePaymentIntentMutation,
  useGetStripePublishableKeyQuery,
} from "@/redux/features/api/ordersApi";
import toast from "react-hot-toast";
import { useModalStore } from "@/app/hooks/modalStore";
import { redirect } from "next/navigation";
import { useSocket } from "@/app/utils/SocketProvider";
import { useSelector } from "react-redux";
import { IRootState } from "@/redux/store";

interface CourseDetailsProps {
  course: SingleCourse;
}

export const CourseDetails = ({ course }: CourseDetailsProps) => {
  const { user: userData } = useSelector((state: IRootState) => state.auth);

  const { setOpenModal } = useModalStore();
  const socket = useSocket();

  const [openCheckout, setOpenCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");

  const { data: keyData } = useGetStripePublishableKeyQuery({});

  const stripePromise: Promise<Stripe | null> | null = useMemo(() => {
    return keyData?.publishableKey ? loadStripe(keyData.publishableKey) : null;
  }, [keyData]);

  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [createOrder, { error }] = useCreateOrderMutation();

  const discount =
    ((course.estimatedPrice - course.price) / course.estimatedPrice) * 100;
  const discountPct = discount > 0 ? `${discount.toFixed(0)}% Off` : null;
  const isPurchased = userData?.courses.find(
    (c: { courseId: string }) => c.courseId === course._id
  );

  const handleBuyNow = async () => {
    if (!userData) {
      setOpenModal("signin");
      return;
    }

    if (course.price === 0) {
      const responseOrder = await createOrder({ courseId: course._id });
      if (responseOrder.data.success) {
        socket?.emit("notification", {
          title: "New Order",
          message: `You have a new order from ${course.name}`,
          userId: userData?._id,
        });
        toast.success("Course purchased successfully.");
        redirect(`/course-access/${course._id}`);
      }
      return;
    }

    if (!keyData) {
      toast.error("Payment service unavailable.");
      return;
    }

    const amount = Math.round(course.price * 100);

    try {
      const resp = await createPaymentIntent(amount);
      setClientSecret(resp.data.client_secret);
      setOpenCheckout(true);
    } catch (err) {
      const errorMessage =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to initiate payment.";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
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
  }, [error]);

  return (
    <div className="container mx-auto px-6 py-32">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
        <div className="flex items-center space-x-4">
          <Ratings rating={course.ratings} />
          <span className="text-sm">{course.reviews.length} Reviews</span>
          <span className="text-sm">· {course.purchased} Students</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              What You&apos;ll Learn
            </h2>
            <ul className="space-y-2">
              {course.benefits.map((b) => (
                <li key={b._id} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{b.title}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Prerequisites</h2>
            <ul className="space-y-2">
              {course.prerequisites.map((p) => (
                <li key={p._id} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{p.title}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Course Overview</h2>
            <CourseContentList contentData={course.courseData} isDemo />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Course Details</h2>
            <p className="leading-relaxed">{course.description}</p>
          </section>

          {course.reviews.length ? (
            <section>
              <h2 className="text-2xl font-semibold mb-6">Student Reviews</h2>
              <div className="space-y-6">
                {[...course.reviews].reverse().map((r) => (
                  <div
                    key={r._id}
                    className="flex space-x-4 bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex-shrink-0 bg-blue-500 text-white rounded-full h-10 w-10 flex items-center justify-center">
                      {r.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{r.user.name}</span>
                        <Ratings rating={r.rating} />
                      </div>
                      <p className="mb-2">{r.comment}</p>
                      <small className="text-xs text-zinc-500 dark:text-zinc-400">
                        {format(r.createdAt)}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-6">
          <div className="">
            <CoursePlayer videoUrl={course.demoUrl} />
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md">
            <div className="space-y-4">
              <div>
                <span className="text-4xl font-bold">
                  {course.price === 0 ? "Free" : `$${course.price}`}
                </span>
                {discountPct && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm line-through text-zinc-500">
                      ${course.estimatedPrice}
                    </span>
                    <span className="text-sm text-green-600 font-semibold">
                      {discountPct}
                    </span>
                  </div>
                )}
              </div>

              {isPurchased ? (
                <Button asChild size="lg" className="w-full" variant="outline">
                  <Link href={`/course-access/${course._id}`}>
                    Go to Course
                  </Link>
                </Button>
              ) : (
                <Button
                  onClick={handleBuyNow}
                  size="lg"
                  className="w-full"
                  variant="default"
                >
                  Buy Now
                </Button>
              )}

              <ul className="text-sm space-y-1">
                <li>• Source code included</li>
                <li>• Full lifetime access</li>
                <li>• Certificate of completion</li>
                <li>• Premium support</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
      <>
        {openCheckout && stripePromise && clientSecret && (
          <div className="fixed inset-0 text-white bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-scroll py-2">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg w-full max-w-md mt-2">
              <div className="flex justify-end">
                <IoMdCloseCircleOutline
                  size={24}
                  className="cursor-pointer text-black dark:text-white"
                  onClick={() => setOpenCheckout(false)}
                />
              </div>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm course={course} user={userData} />
              </Elements>
            </div>
          </div>
        )}
      </>
    </div>
  );
};
