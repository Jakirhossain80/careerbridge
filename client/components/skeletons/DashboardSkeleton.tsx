import { LoadingSkeleton } from "@/components/ui";
import PageHeaderSkeleton from "./PageHeaderSkeleton";
import StatsCardSkeleton from "./StatsCardSkeleton";
import TableSkeleton from "./TableSkeleton";

type DashboardSkeletonProps = {
  metrics?: number;
};

export default function DashboardSkeleton({ metrics = 4 }: DashboardSkeletonProps) {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8" aria-hidden="true">
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeaderSkeleton />
        <StatsCardSkeleton count={metrics} />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
          <TableSkeleton rows={5} columns={4} />
          <LoadingSkeleton variant="card" className="min-h-72" />
        </div>
      </div>
    </main>
  );
}
