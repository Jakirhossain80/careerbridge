import { LoadingSkeleton } from "@/components/ui";

type TableSkeletonProps = {
  rows?: number;
  columns?: number;
  className?: string;
};

export default function TableSkeleton({
  rows = 6,
  columns = 5,
  className,
}: TableSkeletonProps) {
  return (
    <LoadingSkeleton
      variant="table"
      rows={rows}
      columns={columns}
      className={className}
    />
  );
}
