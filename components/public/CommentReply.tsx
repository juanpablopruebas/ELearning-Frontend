import { QuestionData } from "@/types";
import { CommentItem } from "./CommentItem";

interface CommentReplyProps {
  answer: string;
  questions: QuestionData[];
  setAnswer: (answer: string) => void;
  handleAnswerSubmit: () => void;
  questionId: string | null;
  setQuestionId: (id: string) => void;
  isSuccess: boolean;
}

export const CommentReply = ({
  answer,
  questions,
  handleAnswerSubmit,
  setAnswer,
  questionId,
  setQuestionId,
  isSuccess,
}: CommentReplyProps) => {
  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <CommentItem
          key={q._id}
          item={q}
          answer={answer}
          setAnswer={setAnswer}
          questionId={questionId}
          setQuestionId={setQuestionId}
          handleAnswerSubmit={handleAnswerSubmit}
          isSuccess={isSuccess}
        />
      ))}
    </div>
  );
};
