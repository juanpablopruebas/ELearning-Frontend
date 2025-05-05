"use client";

import { Loader } from "@/components/layout/Loader";
import { Button } from "@/components/ui/button";
import {
  useEditLayoutMutation,
  useGetLayoutQuery,
} from "@/redux/features/api/layoutApi";
import { CategoriesData } from "@/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { MdAddCircleOutline } from "react-icons/md";

type CategoryType = {
  _id: string;
  title: string;
};

export const Categories = () => {
  const {
    data,
    refetch,
    isLoading: isLayoutLoading,
  } = useGetLayoutQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    if (data?.layout?.categories) {
      setCategories(
        data.layout.categories.map((cat: CategoriesData) => ({
          _id: cat._id ?? Date.now().toString() + Math.random().toString(),
          title: cat?.title ? cat.title : "",
        }))
      );
    }
  }, [data?.layout?.categories]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Categories updated successfully");
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

  const handleTitleChange = (id: string, value: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat._id === id ? { ...cat, title: value } : cat))
    );
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat._id !== id));
  };

  const newCategoriesHandler = () => {
    if (
      categories.length > 0 &&
      categories[categories.length - 1].title.trim() === ""
    ) {
      toast.error(
        "Category title must not be empty before adding another category"
      );
      return;
    }
    const newId = Date.now().toString() + Math.random().toString();
    setCategories([...categories, { _id: newId, title: "" }]);
  };

  const isAnyCategoryEmpty = (categories: CategoryType[]) =>
    categories.some((cat) => cat.title.trim() === "");

  const handleEdit = () => {
    if (!categories.length) {
      toast.error("There must be at least one category");
      return;
    }
    if (isAnyCategoryEmpty(categories)) {
      toast.error("Some fields are still to be filled");
      return;
    }
    if (!isLoading && categories.length > 0) {
      editLayout({
        type: "Categories",
        categories: categories.map(({ title }) => ({ title })),
      });
    }
  };

  return isLayoutLoading ? (
    <Loader />
  ) : (
    <div className="w-full min-h-screen p-6 text-zinc-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-6">Edit Categories</h2>
      <div className="space-y-6">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-300 dark:border-zinc-700"
          >
            <input
              type="text"
              value={cat.title}
              onChange={(e) => handleTitleChange(cat._id, e.target.value)}
              placeholder="Enter category title"
              className="flex-1 p-2 border rounded-md border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800"
            />
            <button
              onClick={() => handleDelete(cat._id)}
              className="text-red-500 text-xl"
              title="Delete Category"
            >
              <AiOutlineDelete />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <Button onClick={newCategoriesHandler} variant="outline">
          <MdAddCircleOutline className="mr-2 text-lg" />
          Add Category
        </Button>
        <Button
          onClick={handleEdit}
          disabled={isLoading || isAnyCategoryEmpty(categories)}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
