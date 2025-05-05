import { FC } from "react";
import { MdCheck } from "react-icons/md";

type CourseOptionsProps = {
  currentStep: number;
};

export const CourseOptions: FC<CourseOptionsProps> = ({ currentStep }) => {
  const options = [
    "Course Information",
    "Course Options",
    "Course Content",
    "Course Preview",
  ];

  return (
    <div className="space-y-4">
      {options.map((option, index) => (
        <button
          key={option}
          className={`w-full text-left p-3 rounded-md transition-colors 
              ${
                currentStep === index
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
        >
          <div className="flex items-center space-x-2">
            {currentStep > index ? (
              <MdCheck className="text-green-500" />
            ) : (
              <span>{index + 1}</span>
            )}
            <span className="text-sm font-medium">{option}</span>
          </div>
        </button>
      ))}
    </div>
  );
};
