"use client";

import { useId } from "react";
import type { ReactNode, SelectHTMLAttributes } from "react";

import ValidationMessage from "./ValidationMessage";

type SelectOption = {
  label: ReactNode;
  value: string;
  disabled?: boolean;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: ReactNode;
  error?: string;
  helperText?: ReactNode;
  options?: SelectOption[];
  placeholder?: string;
  wrapperClassName?: string;
};

const selectClasses =
  "h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-800";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Select({
  id,
  label,
  error,
  helperText,
  options,
  placeholder,
  required,
  disabled,
  className,
  wrapperClassName,
  children,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const helperId = helperText ? `${selectId}-helper` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("space-y-2", wrapperClassName)}>
      {label ? (
        <label htmlFor={selectId} className="block text-sm font-medium text-foreground">
          {label}
          {required ? <span className="ml-1 text-red-600">*</span> : null}
        </label>
      ) : null}

      <select
        id={selectId}
        className={cn(
          selectClasses,
          error && "border-red-400 focus:border-red-500 focus:ring-red-500/20",
          className,
        )}
        required={required}
        disabled={disabled}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options?.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
        {children}
      </select>

      {helperText ? (
        <p id={helperId} className="text-sm leading-5 text-muted">
          {helperText}
        </p>
      ) : null}

      <ValidationMessage id={errorId}>{error}</ValidationMessage>
    </div>
  );
}

export type { SelectOption, SelectProps };
