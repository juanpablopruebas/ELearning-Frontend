import { useAppForm } from "@/components/form";
import { FieldErrors } from "@/components/form/field-errors";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { FC } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

interface CourseDataProps {
  currentStep: number;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  setCurrentStep: (currentStep: number) => void;
  setBenefits: (benefits: { title: string }[]) => void;
  setPrerequisites: (prerequisites: { title: string }[]) => void;
}

const CourseDataSchema = z.object({
  benefits: z
    .array(
      z.object({
        title: z.string().min(1, "Benefit name is required"),
      })
    )
    .min(1, "At least one benefit is required"),
  prerequisites: z
    .array(
      z.object({
        title: z.string().min(1, "Prerequisite name is required"),
      })
    )
    .min(1, "At least one prerequisite is required"),
});

type CourseDataType = z.infer<typeof CourseDataSchema>;

export const CourseData: FC<CourseDataProps> = ({
  currentStep,
  benefits,
  prerequisites,
  setCurrentStep,
  setBenefits,
  setPrerequisites,
}) => {
  const form = useAppForm({
    defaultValues: {
      benefits,
      prerequisites,
    } as CourseDataType,
    validators: {
      onChange: CourseDataSchema,
    },
    onSubmit: ({ value }) => {
      setCurrentStep(currentStep + 1);
      setBenefits(value.benefits);
      setPrerequisites(value.prerequisites);
    },
  });

  const handlePrev = () => setCurrentStep(currentStep - 1);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md"
    >
      <form.AppField name="benefits" mode="array">
        {(field) => (
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Benefits for Students
            </Label>
            {field.state.value.map((_, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex gap-2 items-center mt-4">
                  <form.Field
                    name={`benefits[${index}].title`}
                    key={`benefits[${index}].title`}
                  >
                    {(subfield) => (
                      <input
                        key={index}
                        type="text"
                        placeholder="Enter benefit"
                        value={subfield.state.value}
                        onChange={(e) => subfield.handleChange(e.target.value)}
                        className="w-full px-4 py-2 rounded border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      />
                    )}
                  </form.Field>
                  <div className="flex items-center">
                    <Button
                      variant={"destructive"}
                      onClick={() => field.removeValue(index)}
                      className="h-10"
                    >
                      <X />
                    </Button>
                  </div>
                </div>
                <form.Subscribe
                  selector={(state) =>
                    state.errors?.[0]?.[`content[${index}].links`]?.[0].message
                  }
                >
                  {(fieldErrorMessage) => (
                    <FieldErrors errors={fieldErrorMessage} />
                  )}
                </form.Subscribe>
                <form.Subscribe
                  selector={(state) =>
                    state.errors?.[0]?.[`benefits[${index}].title`]?.[0].message
                  }
                >
                  {(fieldErrorMessage) => (
                    <FieldErrors errors={fieldErrorMessage} />
                  )}
                </form.Subscribe>
              </div>
            ))}
            <FieldErrors meta={field.state.meta} />
            <Button
              type="button"
              variant={"outline"}
              onClick={() => field.pushValue({ title: "" })}
              className="bg-gray-200 text-gray-800 hover:bg-gray-500 mt-4"
            >
              Add New
            </Button>
          </div>
        )}
      </form.AppField>
      <form.AppField name="prerequisites" mode="array">
        {(field) => (
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Prerequisites
            </Label>
            {field.state.value.map((_, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex gap-2 items-center mt-4">
                  <form.Field
                    name={`prerequisites[${index}].title`}
                    key={`prerequisites[${index}].title`}
                  >
                    {(subfield) => (
                      <input
                        key={index}
                        type="text"
                        placeholder="Enter prerequisite"
                        value={subfield.state.value}
                        onChange={(e) => subfield.handleChange(e.target.value)}
                        className="w-full px-4 py-2 rounded border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      />
                    )}
                  </form.Field>
                  <Button
                    variant={"destructive"}
                    onClick={() => field.removeValue(index)}
                    className="h-10"
                  >
                    <X />
                  </Button>
                </div>
                <form.Subscribe
                  selector={(state) =>
                    state.errors?.[0]?.[`prerequisites[${index}].title`]?.[0]
                      .message
                  }
                >
                  {(fieldErrorMessage) => (
                    <FieldErrors errors={fieldErrorMessage} />
                  )}
                </form.Subscribe>
              </div>
            ))}
            <FieldErrors meta={field.state.meta} />
            <Button
              type="button"
              variant={"outline"}
              onClick={() => field.pushValue({ title: "" })}
              className="bg-gray-200 text-gray-800 hover:bg-gray-500 mt-4"
            >
              Add New
            </Button>
          </div>
        )}
      </form.AppField>
      <div className="flex space-x-4">
        <Button
          onClick={handlePrev}
          className="px-4 py-2 bg-gray-500 text-white rounded-md"
        >
          Prev
        </Button>
        <form.AppForm>
          <form.SubmitButton
            buttonClassName="px-4 py-2 bg-blue-600 text-white rounded-md"
            handleOnClick={async () => {
              form.handleSubmit();
              await form.validateAllFields("submit");
              if (!form.state.isValid) {
                return toast.error("Please fill in the required fields");
              }
            }}
          >
            Next
          </form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
};
