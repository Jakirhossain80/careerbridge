import Link from "next/link";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

import Button from "./Button";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
};

export default function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  actionHref,
  onAction,
  className = "",
}: EmptyStateProps) {
  const hasLinkAction = actionLabel && actionHref;
  const hasButtonAction = actionLabel && onAction;

  return (
    <section
      className={`app-surface rounded-lg border border-dashed border-slate-300 px-6 py-10 text-center shadow-sm dark:border-slate-700 ${className}`}
    >
      <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon ?? <Inbox size={24} aria-hidden="true" />}
      </div>

      <h2 className="text-xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
        {description}
      </p>

      {hasLinkAction ? (
        <Link
          href={actionHref}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {actionLabel}
        </Link>
      ) : null}

      {hasButtonAction && !hasLinkAction ? (
        <Button type="button" className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </section>
  );
}

export type { EmptyStateProps };
