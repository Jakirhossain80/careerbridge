import { Card, LoadingSkeleton } from "@/components/ui";

type FormSkeletonProps = {
  sections?: number;
  fieldsPerSection?: number;
  className?: string;
};

export default function FormSkeleton({
  sections = 2,
  fieldsPerSection = 4,
  className = "space-y-6",
}: FormSkeletonProps) {
  return (
    <div className={className} aria-hidden="true">
      <Card contentClassName="p-5 sm:p-6">
        <LoadingSkeleton className="h-7 w-56" />
        <LoadingSkeleton className="mt-3 h-4 w-full max-w-2xl" />
        <div className="mt-5 flex flex-wrap gap-2">
          <LoadingSkeleton className="h-10 w-24" />
          <LoadingSkeleton className="h-10 w-28" />
          <LoadingSkeleton className="h-10 w-32" />
        </div>
      </Card>

      {Array.from({ length: sections }).map((_, sectionIndex) => (
        <Card key={sectionIndex} contentClassName="p-5 sm:p-6">
          <LoadingSkeleton className="h-5 w-48" />
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {Array.from({ length: fieldsPerSection }).map((_, fieldIndex) => (
              <div key={fieldIndex}>
                <LoadingSkeleton className="h-4 w-28" />
                <LoadingSkeleton className="mt-2 h-11 w-full" />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
