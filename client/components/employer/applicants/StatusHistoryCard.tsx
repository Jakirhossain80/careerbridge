"use client";

import { Card } from "@/components/ui";
import type { ApplicationStatusHistory } from "@/types/application.types";

type StatusHistoryCardProps = {
  history?: ApplicationStatusHistory[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function StatusHistoryCard({ history = [] }: StatusHistoryCardProps) {
  return (
    <Card
      header={<h2 className="text-lg font-bold text-foreground">Status History</h2>}
      contentClassName="p-5"
    >
      {history.length > 0 ? (
        <ol className="space-y-4">
          {history.map((item, index) => (
            <li key={`${item.status}-${item.createdAt}-${index}`} className="flex gap-3">
              <span className="mt-1 flex size-3 shrink-0 rounded-full bg-primary ring-4 ring-blue-100" />
              <div>
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="mt-1 text-xs text-muted">{formatDate(item.createdAt)}</p>
                {item.note ? (
                  <p className="mt-2 text-sm leading-6 text-muted">{item.note}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-muted">No status changes have been recorded.</p>
      )}
    </Card>
  );
}
