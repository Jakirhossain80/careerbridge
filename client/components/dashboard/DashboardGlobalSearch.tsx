"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { SearchBar } from "@/components/ui";
import { useDashboardSearch } from "@/hooks/useDashboardSearch";
import { getApiErrorMessage } from "@/lib/api";
import { normalizeDashboardSearchQuery } from "@/services/dashboard-search.service";

type DashboardGlobalSearchProps = {
  placeholder: string;
  variant?: "compact" | "full";
  className?: string;
};

const DEBOUNCE_MS = 250;

export default function DashboardGlobalSearch({
  placeholder,
  variant = "compact",
  className,
}: DashboardGlobalSearchProps) {
  const [value, setValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeQuery = submittedQuery || debouncedQuery;
  const search = useDashboardSearch(activeQuery);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(normalizeDashboardSearchQuery(value));
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(timeout);
  }, [value]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      if (event.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const handleChange = (nextValue: string) => {
    setValue(nextValue.slice(0, 80));
    setSubmittedQuery("");
    setIsOpen(Boolean(nextValue));
  };

  const handleSubmit = (nextValue: string) => {
    const normalized = normalizeDashboardSearchQuery(nextValue);
    setSubmittedQuery(normalized);
    setIsOpen(Boolean(normalized));
  };

  const showResults = isOpen && normalizeDashboardSearchQuery(value).length >= 2;

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      {variant === "full" ? (
        <SearchBar
          value={value}
          onChange={handleChange}
          onSubmit={handleSubmit}
          placeholder={placeholder}
          label="Search dashboard"
          inputRef={inputRef}
          className="w-full"
        />
      ) : (
        <form
          role="search"
          className="flex h-10 w-full items-center gap-2 rounded-md border border-slate-200 bg-background px-3 text-muted dark:border-slate-700"
          onSubmit={(event: FormEvent) => {
            event.preventDefault();
            handleSubmit(value);
          }}
        >
          <Search size={17} aria-hidden="true" />
          <label className="sr-only" htmlFor="dashboard-global-search">
            Search dashboard
          </label>
          <input
            ref={inputRef}
            id="dashboard-global-search"
            type="search"
            value={value}
            maxLength={80}
            onFocus={() => setIsOpen(Boolean(value))}
            onChange={(event) => handleChange(event.target.value)}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
          />
          {value ? (
            <button
              type="button"
              onClick={() => handleChange("")}
              className="rounded p-0.5 text-muted hover:text-foreground"
              aria-label="Clear dashboard search"
            >
              <X size={14} aria-hidden="true" />
            </button>
          ) : (
            <kbd className="rounded border border-slate-200 bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-muted dark:border-slate-700">
              Ctrl K
            </kbd>
          )}
        </form>
      )}

      {showResults ? (
        <div
          className="absolute right-0 top-full z-50 mt-2 max-h-[min(28rem,70vh)] w-full min-w-72 overflow-y-auto rounded-md border border-slate-200 bg-surface p-2 shadow-xl dark:border-slate-700"
          aria-live="polite"
        >
          {search.isPending ? (
            <p className="px-3 py-4 text-sm text-muted">Searching…</p>
          ) : search.isError ? (
            <p role="alert" className="px-3 py-4 text-sm text-red-600 dark:text-red-400">
              {getApiErrorMessage(search.error)}
            </p>
          ) : search.data?.total === 0 ? (
            <p className="px-3 py-4 text-sm text-muted">No matching results found.</p>
          ) : (
            search.data?.groups.map((group) =>
              group.results.length > 0 ? (
                <section key={group.category} className="py-1" aria-labelledby={`dashboard-search-${group.category}`}>
                  <h2 id={`dashboard-search-${group.category}`} className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted">
                    {group.label}
                  </h2>
                  {group.results.map((result) => (
                    <Link
                      key={`${result.category}-${result.id}`}
                      href={result.href}
                      onClick={() => setIsOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm transition hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <span className="block font-medium text-foreground">{result.title}</span>
                      {result.subtitle ? <span className="block truncate text-xs text-muted">{result.subtitle}</span> : null}
                    </Link>
                  ))}
                </section>
              ) : null,
            )
          )}
        </div>
      ) : null}
    </div>
  );
}
