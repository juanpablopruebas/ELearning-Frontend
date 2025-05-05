import React from "react";
import { useFieldContext } from ".";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FieldErrors } from "./field-errors";

type TextFieldProps = {
  label: string;
  errors?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const TextField = ({
  label,
  errors,
  ...inputProps
}: TextFieldProps) => {
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
        <Input
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
