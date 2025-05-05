"use client";

import { useSocket } from "@/app/utils/SocketProvider";
import { useCreateOrderMutation } from "@/redux/features/api/ordersApi";
import { SingleCourse, User } from "@/types";
import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { redirect } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface CheckoutFormProps {
  course: SingleCourse;
  user: User | null;
}

export const CheckoutForm = ({ course, user }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const socket = useSocket();

  const [createOrder, { data: orderData, error, isSuccess }] =
    useCreateOrderMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/course-access/${course._id}`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent?.status === "succeeded") {
      await createOrder({ courseId: course._id, payment_info: paymentIntent });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isSuccess && orderData?.order && socket) {
      socket.emit("notification", {
        title: "New Order",
        message: `You have a new order from ${course.name}`,
        userId: user?._id,
      });
      redirect(`/course-access/${course._id}`);
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
  }, [
    course._id,
    orderData?.order,
    error,
    course.name,
    user?._id,
    isSuccess,
    socket,
  ]);

  return (
    <form onSubmit={handleSubmit}>
      <LinkAuthenticationElement />
      <PaymentElement className="mt-4" />
      {message && <p className="mt-2 text-red-500">{message}</p>}
      <button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        className="mt-6 w-full py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};
