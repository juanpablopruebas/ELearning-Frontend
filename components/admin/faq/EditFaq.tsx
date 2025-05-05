"use client";

import { Loader } from "@/components/layout/Loader";
import { Button } from "@/components/ui/button";
import {
  useEditLayoutMutation,
  useGetLayoutQuery,
} from "@/redux/features/api/layoutApi";
import { FaqData } from "@/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { MdAddCircleOutline } from "react-icons/md";

export type QuestionsType = {
  _id?: string;
  question: string;
  answer: string;
  active?: boolean;
};

export const Faq = () => {
  const {
    data,
    refetch,
    isLoading: isLayoutLoading,
  } = useGetLayoutQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();

  const [questions, setQuestions] = useState<QuestionsType[]>([]);

  useEffect(() => {
    if (data?.layout?.faq) {
      setQuestions(
        data.layout.faq.map((q: FaqData) => ({
          _id: q._id,
          question: q?.question ? q.question : "",
          answer: q?.answer ? q.answer : "",
          active: false,
        }))
      );
    }
  }, [data?.layout?.faq]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Faq updated successfully");
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

  const toggleQuestion = (id?: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q._id === id ? { ...q, active: !q.active } : q))
    );
  };

  const handleQuestionChange = (id: string | undefined, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q._id === id ? { ...q, question: value } : q))
    );
  };

  const handleAnswerChange = (id: string | undefined, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q._id === id ? { ...q, answer: value } : q))
    );
  };

  const newFaqHandler = () => {
    const newId = Date.now().toString() + Math.random().toString();
    setQuestions([
      ...questions,
      { _id: newId, question: "", answer: "", active: true },
    ]);
  };

  const isAnyQuestionEmpty = (qs: QuestionsType[]) =>
    qs.some((q) => !q.question.trim() || !q.answer.trim());

  const handleEdit = () => {
    if (isAnyQuestionEmpty(questions)) {
      toast.error("Some fields are still to be filled");
      return;
    }

    if (!isLoading) {
      editLayout({
        type: "FAQ",
        faq: questions.map(({ question, answer }) => ({ question, answer })),
      });
    }
  };

  return isLayoutLoading ? (
    <Loader />
  ) : (
    <div className="w-full min-h-screen p-6 text-zinc-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-6">Edit FAQs</h2>
      <div className="space-y-6">
        {questions.map((q) => (
          <div
            key={q._id}
            className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-300 dark:border-zinc-700"
          >
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(q._id, e.target.value)}
                placeholder="Enter question"
                className="w-full p-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
              />
              <button
                onClick={() => toggleQuestion(q._id)}
                className="ml-3 text-lg"
              >
                {q.active ? <HiChevronUp /> : <HiChevronDown />}
              </button>
            </div>

            {q.active && (
              <div className="mt-4 flex items-start gap-3">
                <input
                  type="text"
                  value={q.answer}
                  onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                  placeholder="Enter answer"
                  className="w-full p-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
                />
                <button
                  onClick={() =>
                    setQuestions((prev) =>
                      prev.filter((item) => item._id !== q._id)
                    )
                  }
                  className="text-red-500 text-xl"
                  title="Delete FAQ"
                >
                  <AiOutlineDelete />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <Button onClick={newFaqHandler} variant="outline">
          <MdAddCircleOutline className="mr-2 text-lg" />
          Add FAQ
        </Button>
        <Button
          onClick={handleEdit}
          disabled={isLoading || isAnyQuestionEmpty(questions)}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
