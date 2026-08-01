"use client";

import { useId, type FormEvent, type Ref } from "react";
import { Search, X } from "lucide-react";

import Button from "./Button";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  inputRef?: Ref<HTMLInputElement>;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
  label = "Search",
  className,
  disabled = false,
  inputRef,
}: SearchBarProps) {
  const searchId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(value);
  }

  return (
    <form
      role="search"
      className={cn("flex w-full items-center gap-2", className)}
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor={searchId}>
        {label}
      </label>
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id={searchId}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 pl-10 pr-10 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
        />
        {value ? (
          <button
            type="button"
            className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
            onClick={() => onChange("")}
            disabled={disabled}
            aria-label="Clear search"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <Button type="submit" disabled={disabled}>
        Search
      </Button>
    </form>
  );
}

export type { SearchBarProps };
