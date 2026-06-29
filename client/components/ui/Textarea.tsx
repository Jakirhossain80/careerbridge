"use client";

import { useId } from "react";
import type { ReactNode, TextareaHTMLAttributes } from "react";

import ValidationMessage from "./ValidationMessage";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: ReactNode;
  error?: string;
  helperText?: ReactNode;
  wrapperClassName?: string;
};

const textareaClasses =
  "min-h-32 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:disabled:bg-slate-800";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Textarea({
  id,
  label,
  error,
  helperText,
  required,
  disabled,
  className,
  wrapperClassName,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const helperId = helperText ? `${textareaId}-helper` : undefined;
  const errorId = error ? `${textareaId}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("space-y-2", wrapperClassName)}>
      {label ? (
        <label htmlFor={textareaId} className="block text-sm font-medium text-foreground">
          {label}
          {required ? <span className="ml-1 text-red-600">*</span> : null}
        </label>
      ) : null}

      <textarea
        id={textareaId}
        className={cn(
          textareaClasses,
          error && "border-red-400 focus:border-red-500 focus:ring-red-500/20",
          className,
        )}
        required={required}
        disabled={disabled}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy}
        {...props}
      />

      {helperText ? (
        <p id={helperId} className="text-sm leading-5 text-muted">
          {helperText}
        </p>
      ) : null}

      <ValidationMessage id={errorId}>{error}</ValidationMessage>
    </div>
  );
}

export type { TextareaProps };
