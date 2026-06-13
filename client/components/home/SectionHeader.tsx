import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div
      className={
        centered
          ? "mx-auto max-w-3xl text-center"
          : "flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
      }
    >
      <div className={centered ? "" : "max-w-2xl"}>
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-base leading-7 text-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export type { SectionHeaderProps };
