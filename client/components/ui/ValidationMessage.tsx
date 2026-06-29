import type { ReactNode } from "react";

type ValidationMessageProps = {
  id?: string;
  children?: ReactNode;
  className?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function ValidationMessage({
  id,
  children,
  className,
}: ValidationMessageProps) {
  if (!children) {
    return null;
  }

  return (
    <p
      id={id}
      className={cn("text-sm leading-5 text-red-600", className)}
      role="alert"
    >
      {children}
    </p>
  );
}

export type { ValidationMessageProps };
