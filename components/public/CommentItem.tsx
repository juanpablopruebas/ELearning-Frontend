/* eslint-disable @next/next/no-img-element */
import { QuestionData } from "@/types";
import { useEffect, useState } from "react";
import { BiMessage } from "react-icons/bi";
import { VscVerifiedFilled } from "react-icons/vsc";
import { format } from "timeago.js";
import { Button } from "../ui/button";

interface CommentItemProps {
  item: QuestionData;
  answer: string;
  setAnswer: (answer: string) => void;
  handleAnswerSubmit: () => void;
  questionId: string | null;
  setQuestionId: (id: string) => void;
  isSuccess: boolean;
}

export const CommentItem = ({
  answer,
  handleAnswerSubmit,
  item,
  setAnswer,
  questionId,
  setQuestionId,
  isSuccess,
}: CommentItemProps) => {
  const [showReplies, setShowReplies] = useState(false);

  const toggleReplies = () => setShowReplies(!showReplies);

  useEffect(() => {
    if (isSuccess && questionId === item._id) {
      setShowReplies(true);
    }
  }, [isSuccess, item._id, questionId]);

  return (
    <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
      <div className="flex items-start space-x-4">
        <img
          src={item.user.avatar?.url || "/assets/avatar-default.png"}
          alt="User avatar"
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-x-2">
            <h5 className="font-semibold text-zinc-800 dark:text-zinc-100">
              {item.user.name}
            </h5>
            {item.user.role === "admin" && (
              <VscVerifiedFilled className="text-blue-500" />
            )}
          </div>
          <p className="mt-1 text-zinc-700 dark:text-zinc-300">
            {item.question}
          </p>
          <small className="text-xs text-zinc-500 dark:text-zinc-400">
            {format(item.createdAt)}
          </small>
        </div>
      </div>

      <div className="mt-3 flex items-center space-x-2">
        {item.questionReplies.length > 0 && (
          <Button size="sm" onClick={toggleReplies} className="text-sm">
            {showReplies ? "Hide Replies" : "Show Replies"}
          </Button>
        )}
        <Button
          size="sm"
          onClick={() => setQuestionId(item._id)}
          className="text-sm"
        >
          Reply
        </Button>
        <BiMessage
          className="text-zinc-600 dark:text-zinc-400 cursor-pointer"
          size={18}
        />
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {item.questionReplies.length}
        </span>
      </div>

      {questionId === item._id && (
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Enter your reply"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="flex-1 p-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900"
          />
          <Button
            onClick={handleAnswerSubmit}
            disabled={!answer.trim()}
            className={answer.trim() ? "" : "opacity-50 cursor-not-allowed"}
          >
            Submit
          </Button>
        </div>
      )}

      {showReplies && (
        <div className="mt-4 space-y-4">
          {item.questionReplies.map((reply) => (
            <div
              key={reply.answer}
              className="flex items-start space-x-3 p-3 bg-zinc-100 dark:bg-zinc-800 rounded"
            >
              <img
                src={reply.user.avatar?.url || "/assets/avatar-default.png"}
                alt="User avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-x-2">
                  <h5 className="font-medium text-zinc-800 dark:text-zinc-100">
                    {reply.user.name}
                  </h5>
                  {reply.user.role === "admin" && (
                    <VscVerifiedFilled className="text-blue-500" />
                  )}
                </div>
                <p className="mt-1 text-zinc-700 dark:text-zinc-300">
                  {reply.answer}
                </p>
                <small className="text-xs text-zinc-500 dark:text-zinc-400">
                  {format(reply.createdAt)}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
