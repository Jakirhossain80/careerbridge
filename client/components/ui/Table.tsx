import type { ReactNode } from "react";

import TableEmptyState from "@/components/empty-states/TableEmptyState";
import LoadingSkeleton from "./LoadingSkeleton";

type TableColumn<T> = {
  key: string;
  header: ReactNode;
  accessor?: keyof T;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
};

type TableProps<T> = {
  columns: Array<TableColumn<T>>;
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T, index: number) => void;
  getRowKey?: (item: T, index: number) => string | number;
  className?: string;
  tableClassName?: string;
  scrollLabel?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Table<T>({
  columns,
  data,
  loading = false,
  emptyMessage = "No records found.",
  onRowClick,
  getRowKey,
  className,
  tableClassName,
  scrollLabel = "Table data",
}: TableProps<T>) {
  const hasRows = data.length > 0;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-slate-200 bg-surface shadow-sm dark:border-slate-700",
        className,
      )}
    >
      <div
        className="overflow-x-auto overscroll-x-contain"
        tabIndex={0}
        aria-label={scrollLabel}
      >
        <table
          className={cn(
            "min-w-full w-max divide-y divide-slate-200 dark:divide-slate-700",
            tableClassName,
          )}
        >
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold uppercase text-muted",
                    column.headerClassName,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <LoadingSkeleton
                    variant="table"
                    rows={4}
                    columns={Math.max(columns.length, 1)}
                    className="border-0"
                  />
                </td>
              </tr>
            ) : null}

            {!loading && hasRows
              ? data.map((item, rowIndex) => {
                  const clickable = Boolean(onRowClick);

                  return (
                    <tr
                      key={getRowKey?.(item, rowIndex) ?? rowIndex}
                      className={cn(
                        "transition",
                        clickable &&
                          "cursor-pointer hover:bg-blue-50/60 focus-within:bg-blue-50/60 dark:hover:bg-slate-800",
                      )}
                      onClick={() => onRowClick?.(item, rowIndex)}
                      tabIndex={clickable ? 0 : undefined}
                      onKeyDown={(event) => {
                        if (
                          clickable &&
                          (event.key === "Enter" || event.key === " ")
                        ) {
                          event.preventDefault();
                          onRowClick?.(item, rowIndex);
                        }
                      }}
                    >
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={cn(
                            "whitespace-nowrap px-4 py-4 text-sm text-foreground",
                            column.className,
                          )}
                        >
                          {column.render
                            ? column.render(item, rowIndex)
                            : String(item[column.accessor as keyof T] ?? "")}
                        </td>
                      ))}
                    </tr>
                  );
                })
              : null}

            {!loading && !hasRows ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6"
                >
                  <TableEmptyState message={emptyMessage} />
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export type { TableColumn, TableProps };
