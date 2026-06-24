import type { ReactNode } from "react";

import { Card, type CardProps } from "@/components/ui";

type SettingsCardProps = CardProps & {
  title: string;
  description?: string;
  icon?: ReactNode;
};

export default function SettingsCard({
  title,
  description,
  icon,
  children,
  ...props
}: SettingsCardProps) {
  return (
    <Card
      header={
        <div className="flex gap-3">
          {icon ? (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-primary dark:bg-blue-950/40">
              {icon}
            </span>
          ) : null}
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
            ) : null}
          </div>
        </div>
      }
      {...props}
    >
      {children}
    </Card>
  );
}

export type { SettingsCardProps };
