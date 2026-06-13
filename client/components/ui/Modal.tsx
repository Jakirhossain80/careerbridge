"use client";

import { useEffect, useId, type MouseEvent, type ReactNode } from "react";
import { X } from "lucide-react";

import Button from "./Button";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  closeOnOverlayClick?: boolean;
  className?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  closeOnOverlayClick = true,
  className,
}: ModalProps) {
  const generatedId = useId();
  const titleId = `${generatedId}-title`;
  const descriptionId = description ? `${generatedId}-description` : undefined;

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center bg-slate-950/60 px-4 py-6"
      role="presentation"
      onMouseDown={handleOverlayClick}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={cn(
          "w-full max-w-lg overflow-hidden rounded-lg border border-slate-200 bg-surface text-foreground shadow-xl shadow-slate-950/20 dark:border-slate-700",
          className,
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <div>
            <h2 id={titleId} className="text-lg font-semibold tracking-tight">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-1 text-sm leading-6 text-muted">
                {description}
              </p>
            ) : null}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-mr-2 -mt-1 size-9 p-0"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        </header>

        {children ? <div className="px-5 py-5">{children}</div> : null}

        {footer ? (
          <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end dark:border-slate-700">
            {footer}
          </footer>
        ) : null}
      </section>
    </div>
  );
}

export type { ModalProps };
