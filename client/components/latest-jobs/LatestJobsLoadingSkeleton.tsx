import { LoadingSkeleton } from "@/components/ui";

export default function LatestJobsLoadingSkeleton() {
  return (
    <section
      className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700"
      aria-label="Loading latest job results"
      aria-busy="true"
    >
      <div className="flex items-center gap-4">
        <LoadingSkeleton variant="avatar" />
        <div className="flex-1">
          <LoadingSkeleton className="h-5 w-1/2" />
          <LoadingSkeleton className="mt-3 h-4 w-1/3" />
        </div>
      </div>
      <div className="mt-6 grid gap-4">
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="card" />
      </div>
    </section>
  );
}
