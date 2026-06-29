import { Card, LoadingSkeleton } from "@/components/ui";

type ChartSkeletonProps = {
  className?: string;
};

export default function ChartSkeleton({
  className = "min-h-80",
}: ChartSkeletonProps) {
  return (
    <Card className={className} aria-hidden="true">
      <LoadingSkeleton className="h-5 w-44" />
      <div className="mt-6 flex h-56 items-end gap-3">
        {[45, 70, 52, 88, 64, 78, 58].map((height, index) => (
          <div
            key={index}
            className="flex-1 animate-pulse rounded-t-md bg-slate-200 dark:bg-slate-700"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </Card>
  );
}
