import { useStore } from "@tanstack/react-form";
import { useFormContext } from ".";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type SubmitButtonProps = {
  children: React.ReactNode;
  buttonClassName?: string;
  handleOnClick?: () => void;
};

export const SubmitButton = ({
  children,
  buttonClassName,
  handleOnClick,
}: SubmitButtonProps) => {
  const form = useFormContext();

  const [isSubmitting] = useStore(form.store, (state) => [state.isSubmitting]);

  return (
    <Button
      type="submit"
      onClick={handleOnClick}
      disabled={isSubmitting}
      className={cn(
        "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",
        buttonClassName
      )}
    >
      {children}
    </Button>
  );
};
