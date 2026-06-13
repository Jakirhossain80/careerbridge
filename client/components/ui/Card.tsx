import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  header?: ReactNode;
  footer?: ReactNode;
  contentClassName?: string;
};

type CardSectionProps = HTMLAttributes<HTMLDivElement>;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Card({
  header,
  footer,
  children,
  className,
  contentClassName,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-slate-200 bg-surface text-foreground shadow-sm dark:border-slate-700",
        className,
      )}
      {...props}
    >
      {header ? <CardHeader>{header}</CardHeader> : null}
      <CardContent className={contentClassName}>{children}</CardContent>
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </div>
  );
}

function CardHeader({ className, ...props }: CardSectionProps) {
  return (
    <div
      className={cn("border-b border-slate-200 px-5 py-4 dark:border-slate-700", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: CardSectionProps) {
  return <div className={cn("px-5 py-5", className)} {...props} />;
}

function CardFooter({ className, ...props }: CardSectionProps) {
  return (
    <div
      className={cn("border-t border-slate-200 px-5 py-4 dark:border-slate-700", className)}
      {...props}
    />
  );
}

export default Card;
export { Card, CardContent, CardFooter, CardHeader };
export type { CardProps, CardSectionProps };
