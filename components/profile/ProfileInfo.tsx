/* eslint-disable @next/next/no-img-element */

import {
  useEditProfileMutation,
  useUpdateAvatarMutation,
} from "@/redux/features/api/userApi";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";
import { User } from "@/types";

type ProfileInfoType = {
  avatar?: string;
  setAvatar: (avatar?: string) => void;
  user: User | null;
};

export const ProfileInfo = ({ avatar, setAvatar, user }: ProfileInfoType) => {
  const [name, setName] = useState(user?.name || "");
  const [
    updateAvatar,
    {
      isSuccess: isSuccessUpdateAvatar,
      error: errorUpdateAvatar,
      data,
      isLoading,
    },
  ] = useUpdateAvatarMutation();
  const [
    editProfile,
    { isSuccess: isSuccessUpdateProfile, error: errorUpdateProfile },
  ] = useEditProfileMutation();

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        updateAvatar({
          avatar: fileReader.result,
        });
      }
    };
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (isSuccessUpdateAvatar) {
      setAvatar(data?.avatar.url);
      toast.success("Avatar updated successfully");
    }
    if (errorUpdateAvatar) {
      if ("data" in errorUpdateAvatar) {
        const errorMessage = (errorUpdateAvatar.data as { message?: string })
          .message;
        toast.error(errorMessage);
      } else if ("error" in errorUpdateAvatar) {
        toast.error(errorUpdateAvatar.error);
      } else {
        toast.error("Something went wrong.");
      }
    }
  }, [isSuccessUpdateAvatar, errorUpdateAvatar, setAvatar, data?.avatar.url]);

  useEffect(() => {
    if (isSuccessUpdateProfile) {
      toast.success("Profile updated successfully");
    }
    if (errorUpdateProfile) {
      if ("data" in errorUpdateProfile) {
        const errorMessage = (errorUpdateProfile.data as { message?: string })
          .message;
        toast.error(errorMessage);
      } else if ("error" in errorUpdateProfile) {
        toast.error(errorUpdateProfile.error);
      } else {
        toast.error("Something went wrong.");
      }
    }
  }, [isSuccessUpdateProfile, errorUpdateProfile]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim() !== "") {
      editProfile({ name });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <div className="relative">
          {isLoading ? (
            <div className="w-32 h-32 border-4 !border-t-indigo-600 border-gray-200 dark:border-zinc-600 rounded-full animate-spin" />
          ) : (
            <img
              src={avatar ?? "/assets/avatar-default.png"}
              alt="User profile avatar"
              className="w-32 h-32 rounded-full object-cover"
            />
          )}
          <input
            type="file"
            id="avatar"
            className="hidden"
            onChange={handleChangeImage}
            accept="image/png,image/jpg,image/jpeg,image/webp"
          />
          <label
            htmlFor="avatar"
            className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer"
          >
            <AiOutlineCamera size={20} className="text-white" />
          </label>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
          {user?.name}
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 mt-1 rounded border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email Address
          </label>
          <input
            type="text"
            name="email"
            readOnly
            disabled
            value={user?.email}
            className="w-full px-4 py-2 mt-1 rounded border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white cursor-not-allowed"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold rounded transition duration-150 ease-in-out"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};
