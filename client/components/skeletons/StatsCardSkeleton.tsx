import { Card, LoadingSkeleton } from "@/components/ui";

type StatsCardSkeletonProps = {
  count?: number;
  className?: string;
};

export default function StatsCardSkeleton({
  count = 4,
  className = "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
}: StatsCardSkeletonProps) {
  return (
    <section className={className} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="h-full">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <LoadingSkeleton className="h-4 w-32" />
              <LoadingSkeleton className="mt-3 h-8 w-20" />
              <LoadingSkeleton className="mt-3 h-3 w-36" />
            </div>
            <LoadingSkeleton className="size-11 rounded-lg" />
          </div>
        </Card>
      ))}
    </section>
  );
}
