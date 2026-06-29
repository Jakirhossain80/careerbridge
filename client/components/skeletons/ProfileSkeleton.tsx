import { Card, LoadingSkeleton } from "@/components/ui";

export default function ProfileSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]" aria-hidden="true">
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <LoadingSkeleton className="h-6 w-56" />
            <LoadingSkeleton className="mt-3 h-4 w-72 max-w-full" />
          </div>
          <LoadingSkeleton className="h-10 w-28" />
        </div>
        <div className="mt-6 space-y-6">
          <section>
            <LoadingSkeleton className="h-4 w-20" />
            <LoadingSkeleton className="mt-3" lines={3} />
          </section>
          <section>
            <LoadingSkeleton className="h-4 w-20" />
            <div className="mt-3 flex flex-wrap gap-2">
              <LoadingSkeleton className="h-7 w-20 rounded-full" />
              <LoadingSkeleton className="h-7 w-24 rounded-full" />
              <LoadingSkeleton className="h-7 w-16 rounded-full" />
            </div>
          </section>
          <section className="grid gap-4 md:grid-cols-2">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </section>
        </div>
      </Card>
      <aside className="space-y-4">
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="card" />
      </aside>
    </div>
  );
}
