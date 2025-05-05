/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { File, Trash } from "lucide-react";
import type { ChangeEvent, DragEvent } from "react";
import { useRef, useState } from "react";

type CustomFileInputProps = {
  artifactFileName?: string;
  hasArtifactText: boolean;
  setArtifactFileName: (value: string) => void;
  error?: string[] | string;
};

const ACCEPTED_FILE_EXTENSIONS = [`.pdf`, `.txt`];
const ACCEPTED_MIME_TYPES = [`application/pdf`, `text/plain`];

export const CustomFileInput = ({
  artifactFileName,
  hasArtifactText,
  setArtifactFileName,
  error,
}: CustomFileInputProps) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isFileValid = (file: File): boolean =>
    ACCEPTED_MIME_TYPES.includes(file.type);

  const resetFileInput = (): void => {
    setArtifactFileName(``);
    if (fileInputRef.current) {
      fileInputRef.current.value = ``;
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file && isFileValid(file)) {
      setArtifactFileName(file.name);
    } else {
      resetFileInput();
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragging(false);
    if (hasArtifactText) return;

    const file = event.dataTransfer.files?.[0];
    if (file && isFileValid(file)) {
      setArtifactFileName(file.name);
      if (fileInputRef.current) {
        fileInputRef.current.files = event.dataTransfer.files;
      }
    } else {
      resetFileInput();
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (): void => {
    setIsDragging(false);
  };

  const triggerFileInput = (): void => {
    if (hasArtifactText) return;
    resetFileInput();
    fileInputRef.current?.click();
  };

  return (
    <>
      <Input
        ref={fileInputRef}
        id="hiddenFileInput"
        type="file"
        name="file"
        className="hidden"
        onChange={handleFileChange}
        accept={ACCEPTED_FILE_EXTENSIONS.join(`,`)}
      />
      {artifactFileName ? (
        <input type="hidden" name="fileName" value={artifactFileName} />
      ) : null}
      {!artifactFileName ? (
        <div>
          <div
            className={cn(
              `border border-dashed border-neutral-200 rounded-sm flex gap-x-4 p-6 justify-center items-center my-2 select-none`,
              { "bg-blue-200 dark:bg-slate-600": isDragging },
              { "opacity-30": hasArtifactText },
              { "border-accent-red": error }
            )}
            onClick={triggerFileInput}
            onKeyDown={triggerFileInput}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <img src="/images/file-uploader.svg" alt="File uploader icon" />
            <span
              className={cn(
                `text-xs text-secondary-50 dark:text-neutral-coffee w-36`,
                { "text-accent-red": error }
              )}
            >
              Drag & drop or click here to upload file
            </span>
          </div>
          <span
            className={cn(
              `text-xs text-gray-150 dark:text-neutral-coffee ml-2`,
              { "text-accent-red": error }
            )}
          >
            Supported formats: {ACCEPTED_FILE_EXTENSIONS.join(` `)}
          </span>
        </div>
      ) : (
        <div className="border border-neutral-200 rounded-sm h-10 dark:bg-neutral-500 flex gap-x-5 items-center my-2">
          <div className="flex items-center ml-3">
            <File name="file" size="md" />
          </div>
          <p className="flex-grow text-xs font-bold">{artifactFileName}</p>
          <Button
            variant="link"
            type="button"
            className="hover:text-red-600 dark:hover:text-red-600 text-foreground mr-3"
            size="sm"
            onClick={resetFileInput}
          >
            <Trash name="trash" size="md" />
          </Button>
        </div>
      )}
    </>
  );
};
