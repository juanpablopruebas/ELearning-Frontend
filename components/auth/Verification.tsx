"use client";

import { IRootState } from "@/redux/store";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useModalStore } from "../../app/hooks/modalStore";
import { useActivationMutation } from "@/redux/features/api/authApi";

export const Verification = () => {
  const { token } = useSelector((state: IRootState) => state.auth);
  const [activation, { isSuccess, error }] = useActivationMutation();
  const [invalidError, setInvalidError] = useState(false);
  const { setOpenModal } = useModalStore();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account activated successfully");
      setOpenModal("signin");
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
      setInvalidError(true);
    }
  }, [isSuccess, error, setOpenModal]);

  const [otp, setOtp] = useState(["", "", "", ""]);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;

    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];

    if (value.length > 1) {
      const digits = value.split("").filter((char) => /\d/.test(char));
      for (let i = 0; i < digits.length && index + i < otp.length; i++) {
        newOtp[index + i] = digits[i];
      }
      setOtp(newOtp);

      const nextIndex = index + digits.length;
      if (nextIndex < inputRefs.length) {
        inputRefs[nextIndex].current?.focus();
      }
    } else {
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < inputRefs.length - 1) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text");
    if (!/^\d+$/.test(pasteData)) return;
    const digits = pasteData.split("").filter((char) => /\d/.test(char));
    const newOtp = [...otp];
    for (let i = 0; i < digits.length && index + i < otp.length; i++) {
      newOtp[index + i] = digits[i];
    }
    setOtp(newOtp);
    const nextIndex = index + digits.length;
    if (nextIndex < inputRefs.length) {
      inputRefs[nextIndex].current?.focus();
    }
  };

  const verificationHandler = async () => {
    const verificationNumber = otp.join("");
    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }
    await activation({
      activation_token: token,
      activation_code: verificationNumber,
    });
  };

  return (
    <div className="w-64 xs:w-96 flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          Verify Your Account
        </h1>

        <div className="flex justify-center my-4">
          <VscWorkspaceTrusted
            size={40}
            className="text-indigo-600 dark:text-indigo-400"
          />
        </div>

        <div className="flex justify-center space-x-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="number"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={(e) => handlePaste(e, index)}
              className={`w-12 h-12 text-center text-xl rounded border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 ${
                invalidError
                  ? "border-red-500 shake"
                  : "border-gray-300 dark:border-zinc-700"
              } bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white`}
            />
          ))}
        </div>

        {invalidError && (
          <p className="text-red-500 text-sm text-center mt-2">
            Please enter a valid 4-digit code
          </p>
        )}

        <div className="mt-6">
          <button
            onClick={verificationHandler}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold rounded transition duration-150 ease-in-out"
          >
            Verify OTP
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Go back to sign in?{" "}
            <span
              onClick={() => setOpenModal("signin")}
              className="text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
