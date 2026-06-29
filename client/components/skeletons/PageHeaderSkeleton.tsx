import { Card, LoadingSkeleton } from "@/components/ui";

export default function PageHeaderSkeleton() {
  return (
    <Card contentClassName="p-5 sm:p-6" aria-hidden="true">
      <LoadingSkeleton className="h-4 w-28" />
      <LoadingSkeleton className="mt-3 h-8 w-72 max-w-full" />
      <LoadingSkeleton className="mt-3 h-4 w-full max-w-2xl" />
    </Card>
  );
}
