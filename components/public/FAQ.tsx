"use client";

import { useGetLayoutQuery } from "@/redux/features/api/layoutApi";
import { useEffect, useState } from "react";
import { QuestionsType } from "../admin/faq/EditFaq";
import { FaqData } from "@/types";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { Loader } from "../layout/Loader";

export const FAQ = () => {
  const { data, isLoading } = useGetLayoutQuery("FAQ");
  const [questions, setQuestions] = useState<QuestionsType[]>([]);

  useEffect(() => {
    if (data?.layout?.faq) {
      setQuestions(
        data.layout.faq.map((q: FaqData) => ({ ...q, active: false }))
      );
    }
  }, [data?.layout?.faq]);

  if (isLoading) return <Loader />;

  return (
    <main className="container mx-auto pt-16 pb-8">
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {questions.map((q) => (
            <div
              key={q._id}
              className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4"
            >
              <button
                className="w-full flex justify-between items-center text-left"
                onClick={() =>
                  setQuestions((prev) =>
                    prev.map((item) =>
                      item._id === q._id
                        ? { ...item, active: !item.active }
                        : item
                    )
                  )
                }
              >
                <span className="font-medium">{q.question}</span>
                {q.active ? <HiChevronUp /> : <HiChevronDown />}
              </button>
              {q.active && (
                <p className="mt-2 text-zinc-700 dark:text-zinc-300">
                  {q.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
