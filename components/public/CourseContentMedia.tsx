/* eslint-disable @next/next/no-img-element */
import { Course, User } from "@/types";
import { CoursePlayer, Ratings } from "../admin/create-course/CoursePreview";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useAddAnswerMutation,
  useAddQuestionMutation,
  useAddReplyToReviewMutation,
  useAddReviewMutation,
} from "@/redux/features/api/courseApi";
import { CommentReply } from "./CommentReply";
import { format } from "timeago.js";
import { VscVerifiedFilled } from "react-icons/vsc";
import { Button } from "../ui/button";
import { useSocket } from "@/app/utils/SocketProvider";

interface CourseContentMediaProps {
  data: Course;
  id: string;
  user?: User;
  activeVideo: number;
  setActiveVideo: (video: number) => void;
  refetch: () => void;
}

export const CourseContentMedia = ({
  data,
  id,
  user,
  activeVideo,
  setActiveVideo,
  refetch,
}: CourseContentMediaProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [replyText, setReplyText] = useState("");
  const [replyReviewId, setReplyReviewId] = useState<string | null>(null);
  const [questionId, setQuestionId] = useState<string | null>(null);

  const socket = useSocket();

  const [
    addQuestion,
    { isSuccess: qSuccess, error: qError, isLoading: qIsLoading },
  ] = useAddQuestionMutation();
  const [
    addAnswer,
    { isSuccess: aSuccess, error: aError, isLoading: aIsLoading },
  ] = useAddAnswerMutation();
  const [
    addReview,
    { isSuccess: rSuccess, error: rError, isLoading: rIsLoading },
  ] = useAddReviewMutation();
  const [
    addReply,
    { isSuccess: rpSuccess, error: rpError, isLoading: rpIsLoading },
  ] = useAddReplyToReviewMutation();

  const activeCourseData = data.courseData[activeVideo];
  const hasReviewed = data.reviews.some((r) => r.user._id === user?._id);

  useEffect(() => {
    if (qSuccess) {
      toast.success("Question added");
      setQuestionText("");
      refetch();
      socket?.emit("notification", {
        title: "New Question Received",
        message: `You have a new question in ${activeCourseData.sectionTitle}`,
        userId: user?._id,
      });
    }
    if (qError) {
      if (qError) {
        if ("data" in qError) {
          const errorMessage = (qError.data as { message?: string }).message;
          toast.error(errorMessage);
        } else if ("error" in qError) {
          toast.error(qError.error);
        } else {
          toast.error("Something went wrong.");
        }
      }
    }
  }, [
    qSuccess,
    qError,
    refetch,
    user?._id,
    activeCourseData.sectionTitle,
    socket,
  ]);

  useEffect(() => {
    if (aSuccess) {
      toast.success("Answer added");
      setAnswerText("");
      refetch();
    }
    if (aError) {
      if ("data" in aError) {
        const errorMessage = (aError.data as { message?: string }).message;
        toast.error(errorMessage);
      } else if ("error" in aError) {
        toast.error(aError.error);
      } else {
        toast.error("Something went wrong.");
      }
    }
  }, [aSuccess, aError, refetch]);

  useEffect(() => {
    if (rSuccess) {
      toast.success("Review added");
      setReviewText("");
      setRating(0);
      refetch();
      socket?.emit("notification", {
        title: "New Review Received",
        message: `You have a new review in ${activeCourseData.sectionTitle}`,
        userId: user?._id,
      });
    }
    if (rError) {
      if ("data" in rError) {
        const errorMessage = (rError.data as { message?: string }).message;
        toast.error(errorMessage);
      } else if ("error" in rError) {
        toast.error(rError.error);
      } else {
        toast.error("Something went wrong.");
      }
    }
  }, [rSuccess, rError, refetch, activeCourseData, user?._id, socket]);

  useEffect(() => {
    if (rpSuccess) {
      toast.success("Reply added");
      setReplyText("");
      setReplyReviewId(null);
      refetch();
    }
    if (rpError) {
      if ("data" in rpError) {
        const errorMessage = (rpError.data as { message?: string }).message;
        toast.error(errorMessage);
      } else if ("error" in rpError) {
        toast.error(rpError.error);
      } else {
        toast.error("Something went wrong.");
      }
    }
  }, [rpSuccess, rpError, refetch]);

  const handleAnswerSubmit = () => {
    if (aIsLoading) return;
    if (!answerText.length) {
      toast.error(`Answer can't be empty`);
      return;
    }
    addAnswer({
      answer: answerText,
      contentId: activeCourseData._id,
      courseId: id,
      questionId,
    });
  };

  const handlePrev = () => setActiveVideo(Math.max(activeVideo - 1, 0));
  const handleNext = () =>
    setActiveVideo(Math.min(activeVideo + 1, data.courseData.length - 1));

  return (
    <div className="space-y-6">
      <CoursePlayer videoUrl={activeCourseData.videoUrl} />
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          className="cursor-pointer"
          disabled={activeVideo === 0}
        >
          Prev Lesson
        </Button>
        <Button
          variant="outline"
          onClick={handleNext}
          className="cursor-pointer"
          disabled={activeVideo === data.courseData.length - 1}
        >
          Next Lesson
        </Button>
      </div>
      <h2 className="text-xl font-semibold">{activeCourseData.videoTitle}</h2>
      <nav className="flex space-x-4 border-b">
        {["Overview", "Resources", "Q&A", "Reviews"].map((tab, idx) => (
          <button
            key={tab}
            className={`pb-2 ${
              activeTab === idx
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-zinc-500"
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
          </button>
        ))}
      </nav>
      {activeTab === 0 && (
        <p className="mt-4">{activeCourseData.description}</p>
      )}
      {activeTab === 1 && (
        <div className="mt-4 space-y-2">
          {activeCourseData.links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              className="block text-blue-600 hover:underline"
            >
              {l.title}
            </a>
          ))}
        </div>
      )}
      {activeTab === 2 && (
        <div className="space-y-4">
          {user && (
            <div>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full p-2 border rounded-md mb-2"
                placeholder="Your question"
              />
              <Button
                onClick={() =>
                  addQuestion({
                    question: questionText,
                    courseId: id,
                    contentId: activeCourseData._id,
                  })
                }
                disabled={!questionText || qIsLoading}
              >
                Submit Question
              </Button>
            </div>
          )}
          <CommentReply
            answer={answerText}
            questions={activeCourseData.questions}
            setAnswer={setAnswerText}
            handleAnswerSubmit={handleAnswerSubmit}
            questionId={questionId}
            setQuestionId={setQuestionId}
            isSuccess={aSuccess}
          />
        </div>
      )}
      {activeTab === 3 && (
        <div className="space-y-6">
          {!hasReviewed && user && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((i) =>
                  i <= rating ? (
                    <AiFillStar
                      key={i}
                      onClick={() => setRating(i)}
                      className="cursor-pointer text-yellow-400"
                    />
                  ) : (
                    <AiOutlineStar
                      key={i}
                      onClick={() => setRating(i)}
                      className="cursor-pointer"
                    />
                  )
                )}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Your review"
              />
              <Button
                onClick={() =>
                  addReview({ courseId: id, rating, review: reviewText })
                }
                disabled={!reviewText || rIsLoading}
              >
                Submit Review
              </Button>
            </div>
          )}
          {[...data.reviews].reverse().map((r) => (
            <div
              key={r._id}
              className="p-4 bg-white dark:bg-zinc-900 rounded space-y-2"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={r.user.avatar?.url || "/assets/avatar-default.png"}
                  className="w-10 h-10 rounded-full"
                  alt="User avatar"
                />
                <div>
                  <p className="font-semibold">
                    {r.user.name}{" "}
                    {r.user.role === "admin" && (
                      <VscVerifiedFilled className="inline text-blue-500" />
                    )}
                  </p>
                  <Ratings rating={r.rating} />
                </div>
              </div>
              <p>{r.comment}</p>
              <small className="text-xs text-zinc-500">
                {format(r.createdAt)}
              </small>
              {user?.role === "admin" && (
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReplyReviewId(r._id)}
                  >
                    Reply
                  </Button>
                  {replyReviewId === r._id && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                        placeholder="Your reply"
                      />
                      <Button
                        onClick={() =>
                          addReply({
                            comment: replyText,
                            courseId: id,
                            reviewId: r._id,
                          })
                        }
                        disabled={!replyText || rpIsLoading}
                      >
                        Submit Reply
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {r.commentReplies.map((rep) => (
                <div
                  key={rep._id}
                  className="ml-8 mt-2 p-2 bg-zinc-100 dark:bg-zinc-800 rounded"
                >
                  <p className="font-semibold">
                    {rep.user.name}{" "}
                    {rep.user.role === "admin" && (
                      <VscVerifiedFilled className="inline text-blue-500" />
                    )}
                  </p>
                  <p>{rep.comment}</p>
                  <small className="text-xs text-zinc-500">
                    {format(rep.createdAt)}
                  </small>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
