"use client";

import * as Yup from "yup";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useModalStore } from "../../app/hooks/modalStore";
import toast from "react-hot-toast";
import { useLoginMutation } from "@/redux/features/api/authApi";
import { signIn } from "next-auth/react";

const loginSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required().min(6),
});

export const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setOpenModal } = useModalStore();
  const [login, { isSuccess, error }] = useLoginMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Login successfully");
      setOpenModal(null);
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
  }, [isSuccess, error, setOpenModal]);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async ({ email, password }) => {
      await login({ email, password });
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-64 xs:w-96 flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          Sign In to LMS
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              id="email"
              placeholder="you@example.com"
              className={`w-full px-4 py-2 rounded border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-gray-50 dark:bg-zinc-800 ${
                errors.email && touched.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-zinc-700"
              } text-gray-900 dark:text-white`}
            />
            {errors.email && touched.email && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.email}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={values.password}
                onChange={handleChange}
                id="password"
                placeholder="Your password"
                className={`w-full px-4 py-2 rounded border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-gray-50 dark:bg-zinc-800 ${
                  errors.password && touched.password
                    ? "border-red-500"
                    : "border-gray-300 dark:border-zinc-700"
                } text-gray-900 dark:text-white`}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                {showPassword ? (
                  <AiOutlineEye
                    size={20}
                    onClick={() => setShowPassword(false)}
                    className="text-gray-500 dark:text-gray-300"
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    size={20}
                    onClick={() => setShowPassword(true)}
                    className="text-gray-500 dark:text-gray-300"
                  />
                )}
              </div>
            </div>
            {errors.password && touched.password && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.password}
              </span>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold rounded transition duration-150 ease-in-out"
            >
              Sign In
            </button>
          </div>

          <div className="flex items-center justify-center">
            <span className="border-b w-1/5 lg:w-1/4"></span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mx-2">
              or join with
            </span>
            <span className="border-b w-1/5 lg:w-1/4"></span>
          </div>

          <div className="flex justify-center space-x-4">
            <FcGoogle
              size={30}
              className="cursor-pointer"
              onClick={() => {
                // toast.error("Temporarily disabled. Try email method instead.");
                signIn("google");
              }}
            />
            <AiFillGithub
              size={30}
              className="cursor-pointer text-gray-800 dark:text-gray-200"
              onClick={() => {
                // toast.error("Temporarily disabled. Try email method instead.");
                signIn("github");
              }}
            />
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Not have an account?{" "}
              <span
                onClick={() => setOpenModal("signup")}
                className="text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer"
              >
                Sign Up
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
