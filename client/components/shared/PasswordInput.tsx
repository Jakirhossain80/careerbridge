"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input, type InputProps } from "@/components/ui";

type PasswordInputProps = Omit<InputProps, "type"> & {
  toggleLabel?: string;
};

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, toggleLabel, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={isVisible ? "text" : "password"}
          className={["pr-12", className].filter(Boolean).join(" ")}
          {...props}
        />
        <button
          type="button"
          className="absolute right-0 top-8 flex h-12 w-12 items-center justify-center rounded-r-md text-slate-500 transition hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:text-slate-300 dark:hover:text-white"
          onClick={() => setIsVisible((value) => !value)}
          aria-label={
            toggleLabel ?? (isVisible ? "Hide password" : "Show password")
          }
        >
          {isVisible ? (
            <EyeOff className="size-5" aria-hidden="true" />
          ) : (
            <Eye className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
export type { PasswordInputProps };
