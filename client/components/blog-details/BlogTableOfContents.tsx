import type { BlogTableOfContentsItem } from "@/lib/blog-data";

type BlogTableOfContentsProps = {
  items: BlogTableOfContentsItem[];
};

export default function BlogTableOfContents({ items }: BlogTableOfContentsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-labelledby="table-of-contents-heading"
      className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700"
    >
      <h2 id="table-of-contents-heading" className="text-lg font-semibold">
        Table of contents
      </h2>
      <ol className="mt-4 grid gap-3">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block border-l-2 border-slate-200 pl-3 text-sm font-medium leading-6 text-muted transition hover:border-primary hover:text-primary dark:border-slate-700"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export type { BlogTableOfContentsProps };
