import { LoadingSkeleton } from "@/components/ui";

type JobCardSkeletonProps = {
  count?: number;
};

export default function JobCardSkeleton({ count = 3 }: JobCardSkeletonProps) {
  return (
    <div className="grid gap-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <LoadingSkeleton key={index} variant="card" />
      ))}
    </div>
  );
}
