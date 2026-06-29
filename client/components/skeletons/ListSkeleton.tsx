import { Card, LoadingSkeleton } from "@/components/ui";

type ListSkeletonProps = {
  count?: number;
  showIcon?: boolean;
  className?: string;
};

export default function ListSkeleton({
  count = 3,
  showIcon = true,
  className = "grid gap-4",
}: ListSkeletonProps) {
  return (
    <div className={className} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-1 gap-3">
              {showIcon ? (
                <LoadingSkeleton className="size-11 shrink-0 rounded-md" />
              ) : null}
              <div className="min-w-0 flex-1">
                <LoadingSkeleton className="h-5 w-2/3 max-w-72" />
                <LoadingSkeleton className="mt-3 h-4 w-1/2 max-w-56" />
              </div>
            </div>
            <div className="flex gap-2">
              <LoadingSkeleton className="h-10 w-24" />
              <LoadingSkeleton className="h-10 w-24" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
