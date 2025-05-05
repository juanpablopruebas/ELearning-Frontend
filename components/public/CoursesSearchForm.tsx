"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BiSearch } from "react-icons/bi";
import debounce from "lodash.debounce";

export const CourseSearchFormInput = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim() === "") return;
    router.push(`/courses?title=${search}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-md mt-6">
      <input
        type="search"
        placeholder="Search Courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 p-3 rounded-l-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 border border-gray-300 dark:border-gray-600 outline-none"
      />
      <button
        type="submit"
        className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg"
      >
        <BiSearch size={24} />
      </button>
    </form>
  );
};

export const CourseSearchFormDebounce = ({
  initialValue = "",
}: {
  initialValue?: string;
}) => {
  const [search, setSearch] = useState(initialValue);
  const router = useRouter();

  const updateSearchQuery = debounce((value: string) => {
    const query = value.trim();
    if (query) {
      router.push(`/courses?title=${encodeURIComponent(query)}`);
    } else {
      router.push("/courses");
    }
  }, 500);

  useEffect(() => {
    updateSearchQuery(search);
    return () => updateSearchQuery.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="flex w-full max-w-md mt-6">
      <input
        type="search"
        placeholder="Search Courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 border border-gray-300 dark:border-gray-600 outline-none"
      />
    </div>
  );
};
