/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, DragEvent, FC, useEffect, useState } from "react";
import { z } from "zod";
import { useAppForm } from "@/components/form";
import { FieldErrors } from "@/components/form/field-errors";
import toast from "react-hot-toast";
import { useGetLayoutQuery } from "@/redux/features/api/layoutApi";

export type CourseInfoStateType = {
  name: string;
  description: string;
  price: string;
  estimatedPrice?: string;
  tags: string;
  level: string;
  demoUrl: string;
  thumbnail?: string;
  categories?: string;
};

interface CourseInfoProps {
  courseInfo: CourseInfoStateType;
  setCourseInfo: (info: CourseInfoStateType) => void;
  currentStep: number;
  setCurrentStep: (currentStep: number) => void;
}

const CourseInfoSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  price: z
    .string()
    .min(1, "Price must be at least 0")
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 0;
      },
      {
        message: "Please enter a valid positive number",
      }
    ),
  estimatedPrice: z
    .string()
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 0;
      },
      {
        message: "Please enter a valid positive number",
      }
    )
    .optional(),
  tags: z.string().min(3, "Tags must be at least 3 characters"),
  level: z.string().min(3, "Level must be at least 3 characters"),
  demoUrl: z
    .string()
    .url()
    .refine((url) => url.includes("youtube.com"), {
      message: "The URL must be a YouTube link",
    }),
  thumbnail: z.string().optional(),
  categories: z.string().min(1, { message: "Please select a category" }),
});

type CourseInfoType = z.infer<typeof CourseInfoSchema>;

export const CourseInfo: FC<CourseInfoProps> = ({
  courseInfo,
  setCourseInfo,
  currentStep,
  setCurrentStep,
}) => {
  const [refreshCategory, setRefreshCategory] = useState(false);
  const { data } = useGetLayoutQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });

  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);

  const [dragging, setDragging] = useState(false);

  const form = useAppForm({
    defaultValues: {
      ...(courseInfo as CourseInfoType),
    },
    validators: {
      onChange: CourseInfoSchema,
    },
    onSubmit: ({ value }) => {
      setCurrentStep(currentStep + 1);
      setCourseInfo(value);
    },
  });

  useEffect(() => {
    if (data?.layout?.categories.length > 0) {
      const formatted = data.layout.categories.map(
        (item: { title: string }) => ({
          value: item.title,
          label: item.title,
        })
      );
      setCategories(formatted);
    }
  }, [data?.layout?.categories]);

  useEffect(() => {
    if (courseInfo.name) {
      setRefreshCategory(true);
    }
  }, [courseInfo.name]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md"
    >
      <form.Subscribe
        selector={(state) => state.errors?.[0]?.name?.[0].message}
      >
        {(fieldErrorMessage) => (
          <form.AppField name="name">
            {(field) => (
              <field.TextField
                label="Course name"
                placeholder="LMS platform"
                errors={fieldErrorMessage}
              />
            )}
          </form.AppField>
        )}
      </form.Subscribe>
      <form.Subscribe
        selector={(state) => state.errors?.[0]?.description?.[0].message}
      >
        {(fieldErrorMessage) => (
          <form.AppField name="description">
            {(field) => (
              <field.TextAreaField
                label="Course Description"
                rows={4}
                errors={fieldErrorMessage}
              />
            )}
          </form.AppField>
        )}
      </form.Subscribe>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form.Subscribe
          selector={(state) => state.errors?.[0]?.price?.[0].message}
        >
          {(fieldErrorMessage) => (
            <form.AppField name="price">
              {(field) => (
                <field.TextField
                  label="Course Price"
                  type="number"
                  errors={fieldErrorMessage}
                />
              )}
            </form.AppField>
          )}
        </form.Subscribe>
        <form.Subscribe
          selector={(state) => state.errors?.[0]?.estimatedPrice?.[0].message}
        >
          {(fieldErrorMessage) => (
            <form.AppField name="estimatedPrice">
              {(field) => (
                <field.TextField
                  label="Estimated Price (optional)"
                  type="number"
                  errors={fieldErrorMessage}
                />
              )}
            </form.AppField>
          )}
        </form.Subscribe>
      </div>
      <form.Subscribe
        selector={(state) => state.errors?.[0]?.tags?.[0].message}
      >
        {(fieldErrorMessage) => (
          <form.AppField name="tags">
            {(field) => (
              <field.TextField
                label="Course Tags (separate them with commas)"
                errors={fieldErrorMessage}
              />
            )}
          </form.AppField>
        )}
      </form.Subscribe>
      {refreshCategory && (
        <form.Subscribe
          selector={(state) => state.errors?.[0]?.categories?.[0].message}
        >
          {(fieldErrorMessage) => (
            <form.AppField name="categories">
              {(field) => (
                <field.SelectField
                  options={categories}
                  label="Course Categories"
                  placeholder="Select a Category"
                  errors={fieldErrorMessage}
                />
              )}
            </form.AppField>
          )}
        </form.Subscribe>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form.Subscribe
          selector={(state) => state.errors?.[0]?.level?.[0].message}
        >
          {(fieldErrorMessage) => (
            <form.AppField name="level">
              {(field) => (
                <field.TextField
                  label="Course Level"
                  errors={fieldErrorMessage}
                />
              )}
            </form.AppField>
          )}
        </form.Subscribe>
        <form.Subscribe
          selector={(state) => state.errors?.[0]?.demoUrl?.[0].message}
        >
          {(fieldErrorMessage) => (
            <form.AppField name="demoUrl">
              {(field) => (
                <field.TextField
                  label="Demo Url (Youtube URL)"
                  errors={fieldErrorMessage}
                />
              )}
            </form.AppField>
          )}
        </form.Subscribe>
      </div>
      <form.AppField name="thumbnail">
        {(field) => {
          const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
              const fileReader = new FileReader();
              fileReader.onload = () => {
                if (fileReader.readyState === 2) {
                  field.handleChange(fileReader.result as string);
                }
              };
              fileReader.readAsDataURL(file);
            }
          };

          const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
            e.preventDefault();
            setDragging(true);
          };

          const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
            e.preventDefault();
            setDragging(false);
          };

          const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) {
              const fileReader = new FileReader();
              fileReader.onload = () => {
                if (fileReader.readyState === 2) {
                  field.handleChange(fileReader.result as string);
                }
              };
              fileReader.readAsDataURL(file);
            }
          };
          return (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                Thumbnail
              </label>
              <input
                type="file"
                accept="image/*"
                id="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file"
                className={`block border-2 border-dashed p-4 text-center cursor-pointer rounded-md ${
                  dragging ? "border-blue-500" : "border-gray-300"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {field.state.value ? (
                  <img
                    src={
                      typeof field.state.value === "string"
                        ? field.state.value
                        : undefined
                    }
                    alt="Thumbnail"
                    className="w-full h-48 object-cover rounded-md"
                  />
                ) : (
                  <span className="text-gray-700 dark:text-gray-300">
                    Drag and drop your thumbnail here or click to browse.
                  </span>
                )}
              </label>
              <form.Subscribe
                selector={(state) => state.errors?.[0]?.thumbnail?.[0].message}
              >
                {(fieldErrorMessage) => (
                  <FieldErrors errors={fieldErrorMessage} />
                )}
              </form.Subscribe>
            </div>
          );
        }}
      </form.AppField>
      <div className="pt-4">
        <form.AppForm>
          <form.SubmitButton
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
