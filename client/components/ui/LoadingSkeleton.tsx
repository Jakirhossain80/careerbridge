type LoadingSkeletonProps = {
  variant?: "card" | "text" | "table" | "avatar";
  className?: string;
  lines?: number;
  rows?: number;
  columns?: number;
};

export default function LoadingSkeleton({
  variant = "text",
  className = "",
  lines = 1,
  rows = 5,
  columns = 4,
}: LoadingSkeletonProps) {
  if (variant === "avatar") {
    return (
      <div
        className={`size-12 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700 ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`animate-pulse rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700 ${className}`}
        aria-hidden="true"
      >
        <div className="h-5 w-2/5 rounded-md bg-slate-200 dark:bg-slate-700" />
        <div className="mt-4 space-y-3">
          <div className="h-4 rounded-md bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-5/6 rounded-md bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-2/3 rounded-md bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="mt-5 h-10 w-32 rounded-md bg-slate-200 dark:bg-slate-700" />
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={`overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 ${className}`} aria-hidden="true">
        <div className="grid animate-pulse gap-px bg-slate-200 dark:bg-slate-700" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <div key={`head-${index}`} className="bg-slate-50 p-4 dark:bg-slate-800">
              <div className="h-3 rounded-md bg-slate-200 dark:bg-slate-700" />
            </div>
          ))}
          {Array.from({ length: rows * columns }).map((_, index) => (
            <div key={`cell-${index}`} className="bg-surface p-4">
              <div className="h-4 rounded-md bg-slate-200 dark:bg-slate-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (lines <= 1) {
    return (
      <div
        className={`h-4 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className={`space-y-3 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700"
          style={{ width: index === lines - 1 ? "75%" : "100%" }}
        />
      ))}
    </div>
  );
}

export type { LoadingSkeletonProps };
