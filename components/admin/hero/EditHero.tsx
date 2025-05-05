"use client";

/* eslint-disable @next/next/no-img-element */
import { Loader } from "@/components/layout/Loader";
import { Button } from "@/components/ui/button";
import {
  useEditLayoutMutation,
  useGetLayoutQuery,
} from "@/redux/features/api/layoutApi";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export const EditHero = () => {
  const [image, setImage] = useState<string>();
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data,
    refetch,
    isLoading: isLayoutLoading,
  } = useGetLayoutQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();

  useEffect(() => {
    if (data?.layout?.banner) {
      setTitle(data.layout?.banner?.title || "");
      setSubTitle(data.layout?.banner?.subTitle || "");
      setImage(data.layout?.banner?.image?.url);
    }
  }, [data?.layout?.banner]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Banner updated successfully");
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
  }, [isSuccess, error, refetch]);

  const handleUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.readyState === 2) {
          setImage(fileReader.result as string);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    if (
      data.layout?.banner?.title !== title ||
      data.layout?.banner?.subTitle !== subTitle ||
      data.layout?.banner?.image?.url !== image
    ) {
      if (!isLoading) {
        editLayout({ type: "Banner", image, title, subTitle });
      }
    }
  };

  return (
    <>
      {isLayoutLoading ? (
        <Loader />
      ) : (
        <div className="w-full flex flex-col-reverse xl:flex-row items-center justify-evenly p-6 bg-gray-100 dark:bg-zinc-800 transition-all">
          <div className="text-center flex flex-col items-center xl:w-3/6 w-3/4 gap-4">
            <textarea
              value={title}
              placeholder="Enhance Your Online Learning Experience"
              onChange={(e) => setTitle(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
            />
            <textarea
              value={subTitle}
              placeholder="Join 2K+ online courses with over 30K+ registered students. Find the courses that suit you best."
              onChange={(e) => setSubTitle(e.target.value)}
              rows={5}
              className="w-full p-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
            />
            <Button onClick={handleEdit} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <div className="lg:w-1/2 flex flex-col items-center gap-4 mb-8">
            <img
              width={470}
              height={470}
              src={image}
              alt="Banner Image"
              className="object-contain max-w-xs md:max-w-md lg:max-w-lg"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              Upload Image
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleUpdate}
              className="hidden"
            />
          </div>
        </div>
      )}
    </>
  );
};
