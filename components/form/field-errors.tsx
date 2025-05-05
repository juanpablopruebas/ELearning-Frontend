import { AnyFieldMeta } from "@tanstack/react-form";
import { ZodError } from "zod";

type FieldErrorsProps = {
  meta?: AnyFieldMeta;
  errors?: string;
};

export const FieldErrors = ({ meta, errors }: FieldErrorsProps) => {
  if (errors)
    return (
      <p className="text-sm font-medium text-destructive my-1">{errors}</p>
    );

  if (!meta?.isTouched) return null;

  return meta.errors.map(({ message }: ZodError, index) => (
    <p key={index} className="text-sm font-medium text-destructive my-1">
      {message}
    </p>
  ));
};
