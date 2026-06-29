import { Card, LoadingSkeleton } from "@/components/ui";

type DetailPageSkeletonProps = {
  sidebar?: boolean;
  className?: string;
};

export default function DetailPageSkeleton({
  sidebar = true,
  className,
}: DetailPageSkeletonProps) {
  return (
    <div
      className={
        className ??
        (sidebar ? "grid gap-6 lg:grid-cols-[1fr_320px]" : "space-y-6")
      }
      aria-hidden="true"
    >
      <Card
        header={
          <div>
            <LoadingSkeleton className="h-6 w-64 max-w-full" />
            <LoadingSkeleton className="mt-3 h-4 w-44" />
          </div>
        }
      >
        <div className="space-y-6">
          <section>
            <LoadingSkeleton className="h-5 w-32" />
            <LoadingSkeleton className="mt-3" lines={4} />
          </section>
          <section>
            <LoadingSkeleton className="h-5 w-32" />
            <LoadingSkeleton className="mt-3 h-4 w-48" />
          </section>
          <section>
            <LoadingSkeleton className="h-5 w-24" />
            <div className="mt-3 space-y-3">
              <LoadingSkeleton variant="card" />
              <LoadingSkeleton variant="card" />
            </div>
          </section>
        </div>
      </Card>

      {sidebar ? (
        <aside>
          <LoadingSkeleton variant="card" />
        </aside>
      ) : null}
    </div>
  );
}
