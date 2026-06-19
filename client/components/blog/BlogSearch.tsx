"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import SearchBar from "@/components/ui/SearchBar";

type BlogSearchProps = {
  initialQuery?: string;
};

export default function BlogSearch({ initialQuery = "" }: BlogSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const nextValue = value.trim();

    if (nextValue) {
      params.set("q", nextValue);
    } else {
      params.delete("q");
    }

    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <SearchBar
      value={query}
      onChange={setQuery}
      onSubmit={updateSearch}
      placeholder="Search articles, topics, or keywords"
      label="Search blog articles"
      className="rounded-lg border border-slate-200 bg-surface p-3 shadow-sm dark:border-slate-700"
    />
  );
}

export type { BlogSearchProps };
