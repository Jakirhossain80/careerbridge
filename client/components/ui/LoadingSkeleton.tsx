type LoadingSkeletonProps = {
  className?: string;
  lines?: number;
};

export default function LoadingSkeleton({
  className = "",
  lines = 1,
}: LoadingSkeletonProps) {
  if (lines <= 1) {
    return (
      <div
        className={`animate-pulse rounded-md bg-slate-200 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className={`space-y-3 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 animate-pulse rounded-md bg-slate-200"
          style={{ width: index === lines - 1 ? "75%" : "100%" }}
        />
      ))}
    </div>
  );
}
