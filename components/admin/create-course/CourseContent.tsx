import { useAppForm } from "@/components/form";
import { FieldErrors } from "@/components/form/field-errors";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import toast from "react-hot-toast";
import { z } from "zod";

const MAX_SECTIONS = 15;

export type CourseContentDataStateType = {
  sectionTitle: string;
  videoTitle: string;
  videoUrl: string;
  videoLength: number;
  description: string;
  links: { title: string; url: string }[];
  suggestion?: string;
};

interface CourseContentProps {
  currentStep: number;
  courseContentData: CourseContentDataStateType[];
  setCurrentStep: (active: number) => void;
  setCourseContentData: (content: CourseContentDataStateType[]) => void;
}

const CourseContentSchema = z.object({
  content: z
    .array(
      z.object({
        sectionTitle: z
          .string()
          .min(3, "Section title must be at least 3 characters"),
        videoTitle: z
          .string()
          .min(3, "Video title must be at least 3 characters"),
        videoUrl: z
          .string()
          .url()
          .refine((url) => url.includes("youtube.com"), {
            message: "The URL must be a YouTube link",
          }),
        videoLength: z.coerce
          .number()
          .min(1, "Video length must be at least 1 minute")
          .int(),
        description: z
          .string()
          .min(3, "Description must be at least 3 characters"),
        links: z
          .array(
            z.object({
              title: z.string().min(1, "Link title is required"),
              url: z.string().url(),
            })
          )
          .min(1, "At least one link is required"),
        suggestion: z.string().optional(),
      })
    )
    .min(1, "At least one course content is required")
    .max(MAX_SECTIONS, "Maximum of 3 sections"),
});

type CourseContentType = z.infer<typeof CourseContentSchema>;

export const CourseContent = ({
  currentStep,
  courseContentData,
  setCurrentStep,
  setCourseContentData,
}: CourseContentProps) => {
  const form = useAppForm({
    defaultValues: { content: [...courseContentData] } as CourseContentType,
    validators: {
      onChange: CourseContentSchema,
    },
    onSubmit: ({ value }) => {
      setCurrentStep(currentStep + 1);
      setCourseContentData(value.content);
    },
  });

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md"
    >
      <form.AppField name="content">
        {(field) => {
          return (
            <>
              {field.state.value.map((_, index) => (
                <div
                  key={index}
                  className="relative border border-gray-300 dark:border-gray-600 p-6 rounded-lg shadow-sm space-y-6"
                >
                  <Button
                    type="button"
                    onClick={() => field.removeValue(index)}
                    className="absolute top-3 right-3 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Remove Section
                  </Button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <form.Subscribe
                      selector={(state) =>
                        state.errors?.[0]?.[
                          `content[${index}].sectionTitle`
                        ]?.[0].message
                      }
                    >
                      {(fieldErrorMessage) => (
                        <form.AppField name={`content[${index}].sectionTitle`}>
                          {(field) => (
                            <field.TextField
                              label="Video Section"
                              errors={fieldErrorMessage}
                            />
                          )}
                        </form.AppField>
                      )}
                    </form.Subscribe>
                    <form.Subscribe
                      selector={(state) =>
                        state.errors?.[0]?.[`content[${index}].videoTitle`]?.[0]
                          .message
                      }
                    >
                      {(fieldErrorMessage) => (
                        <form.AppField name={`content[${index}].videoTitle`}>
                          {(field) => (
                            <field.TextField
                              label="Video Title"
                              errors={fieldErrorMessage}
                            />
                          )}
                        </form.AppField>
                      )}
                    </form.Subscribe>
                  </div>
                  <form.Subscribe
                    selector={(state) =>
                      state.errors?.[0]?.[`content[${index}].videoUrl`]?.[0]
                        .message
                    }
                  >
                    {(fieldErrorMessage) => (
                      <form.AppField name={`content[${index}].videoUrl`}>
                        {(field) => (
                          <field.TextField
                            label="Video Url"
                            errors={fieldErrorMessage}
                          />
                        )}
                      </form.AppField>
                    )}
                  </form.Subscribe>
                  <form.Subscribe
                    selector={(state) =>
                      state.errors?.[0]?.[`content[${index}].videoLength`]?.[0]
                        .message
                    }
                  >
                    {(fieldErrorMessage) => (
                      <form.AppField name={`content[${index}].videoLength`}>
                        {(field) => (
                          <field.TextField
                            type="number"
                            label="Video Length (in minutes)"
                            errors={fieldErrorMessage}
                          />
                        )}
                      </form.AppField>
                    )}
                  </form.Subscribe>
                  <form.Subscribe
                    selector={(state) =>
                      state.errors?.[0]?.[`content[${index}].description`]?.[0]
                        .message
                    }
                  >
                    {(fieldErrorMessage) => (
                      <form.AppField name={`content[${index}].description`}>
                        {(field) => (
                          <field.TextAreaField
                            label="Video Description"
                            rows={4}
                            errors={fieldErrorMessage}
                          />
                        )}
                      </form.AppField>
                    )}
                  </form.Subscribe>

                  <form.AppField name={`content[${index}].links`} mode="array">
                    {(field) => {
                      return (
                        <div className="space-y-2">
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Links
                          </Label>
                          {field.state.value.map((_, fieldIndex) => (
                            <div
                              key={fieldIndex}
                              className="flex flex-col gap-2"
                            >
                              <form.Field
                                name={`content[${index}].links[${fieldIndex}].title`}
                                key={`content[${index}].links[${fieldIndex}].title`}
                              >
                                {(subfield) => (
                                  <input
                                    type="text"
                                    placeholder="Enter link title"
                                    value={subfield.state.value}
                                    onChange={(e) =>
                                      subfield.handleChange(e.target.value)
                                    }
                                    onBlur={subfield.handleBlur}
                                    className="flex-1 border border-gray-300 dark:border-gray-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100"
                                  />
                                )}
                              </form.Field>
                              <form.Subscribe
                                selector={(state) =>
                                  state.errors?.[0]?.[
                                    `content[${index}].links[${fieldIndex}].title`
                                  ]?.[0].message
                                }
                              >
                                {(fieldErrorMessage) => (
                                  <FieldErrors errors={fieldErrorMessage} />
                                )}
                              </form.Subscribe>
                              <form.Field
                                name={`content[${index}].links[${fieldIndex}].url`}
                                key={`content[${index}].links[${fieldIndex}].url`}
                              >
                                {(subfield) => (
                                  <input
                                    type="text"
                                    placeholder="Enter link url"
                                    value={subfield.state.value}
                                    onChange={(e) =>
                                      subfield.handleChange(e.target.value)
                                    }
                                    onBlur={subfield.handleBlur}
                                    className="flex-1 border border-gray-300 dark:border-gray-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100"
                                  />
                                )}
                              </form.Field>
                              <form.Subscribe
                                selector={(state) =>
                                  state.errors?.[0]?.[
                                    `content[${index}].links[${fieldIndex}].url`
                                  ]?.[0].message
                                }
                              >
                                {(fieldErrorMessage) => (
                                  <FieldErrors errors={fieldErrorMessage} />
                                )}
                              </form.Subscribe>
                              <div>
                                <Button
                                  variant={"destructive"}
                                  onClick={() => field.removeValue(fieldIndex)}
                                >
                                  Remove Link
                                </Button>
                              </div>
                            </div>
                          ))}
                          <form.Subscribe
                            selector={(state) =>
                              state.errors?.[0]?.[
                                `content[${index}].links`
                              ]?.[0].message
                            }
                          >
                            {(fieldErrorMessage) => (
                              <FieldErrors errors={fieldErrorMessage} />
                            )}
                          </form.Subscribe>
                          <div className="mt-2 text-end">
                            <Button
                              type="button"
                              variant={"outline"}
                              onClick={() =>
                                field.pushValue({ title: "", url: "" })
                              }
                              className="bg-gray-200 text-gray-800 hover:bg-gray-500"
                            >
                              Add New Link
                            </Button>
                          </div>
                        </div>
                      );
                    }}
                  </form.AppField>
                </div>
              ))}
            </>
          );
        }}
      </form.AppField>
      <form.Subscribe
        selector={(state) => state.errors?.[0]?.[`content`]?.[0].message}
      >
        {(fieldErrorMessage) => <FieldErrors errors={fieldErrorMessage} />}
      </form.Subscribe>
      <div className="flex justify-end">
        <form.AppField name="content">
          {(field) => {
            return (
              <Button
                type="button"
                onClick={async () => {
                  if (form.state.values.content.length >= MAX_SECTIONS) {
                    return toast.error(
                      `Maximum of ${MAX_SECTIONS} sections are allowed`
                    );
                  }
                  form.handleSubmit();
                  await form.validateAllFields("submit");
                  if (!form.state.isValid) {
                    return toast.error(
                      "Please fill in the fields before creating another section"
                    );
                  }
                  field.pushValue({
                    sectionTitle: "",
                    videoTitle: "",
                    description: "",
                    videoUrl: "",
                    videoLength: 0,
                    links: [{ title: "", url: "" }],
                  });
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Add new content
              </Button>
            );
          }}
        </form.AppField>
      </div>
      <div className="flex justify-between">
        <Button
          onClick={handlePrev}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Prev
        </Button>
        <form.AppForm>
          <form.SubmitButton
            buttonClassName="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
