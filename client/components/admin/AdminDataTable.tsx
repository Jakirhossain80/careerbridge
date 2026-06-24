"use client";

import Pagination from "@/components/ui/Pagination";
import Table, { type TableColumn } from "@/components/ui/Table";
import type { AdminMeta } from "@/types/admin.types";

type AdminDataTableProps<T> = {
  columns: Array<TableColumn<T>>;
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  meta?: AdminMeta;
  onPageChange?: (page: number) => void;
  getRowKey?: (item: T, index: number) => string | number;
};

export default function AdminDataTable<T>({
  columns,
  data,
  loading,
  emptyMessage,
  meta,
  onPageChange,
  getRowKey,
}: AdminDataTableProps<T>) {
  return (
    <div className="space-y-4">
      <Table
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage={emptyMessage}
        getRowKey={getRowKey}
      />
      {meta && onPageChange ? (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          onPageChange={onPageChange}
        />
      ) : null}
    </div>
  );
}
