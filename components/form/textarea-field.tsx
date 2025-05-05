import React from "react";
import { useFieldContext } from ".";
import { Label } from "../ui/label";
import { FieldErrors } from "./field-errors";
import { Textarea } from "../ui/textarea";

type TextAreaFieldProps = {
  label: string;
  errors?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextAreaField = ({ label, errors,...inputProps }: TextAreaFieldProps) => {
  const field = useFieldContext<string>();

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label
          htmlFor={field.name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </Label>
        <Textarea
          id={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          className="w-full px-4 py-2 mt-1 rounded border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          {...inputProps}
        />
      </div>
      <FieldErrors meta={field.state.meta} errors={errors} />
    </div>
  );
};
