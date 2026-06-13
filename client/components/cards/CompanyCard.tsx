import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Building2, MapPin } from "lucide-react";

import { Badge, Card } from "@/components/ui";

type CompanyCardProps = {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  location?: string;
  openJobs?: number;
  verified?: boolean;
  href: string;
  className?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function CompanyCard({
  name,
  logo,
  industry,
  location,
  openJobs,
  verified = false,
  href,
  className,
}: CompanyCardProps) {
  return (
    <Card
      className={cn("transition hover:border-primary/40 hover:shadow-md", className)}
      contentClassName="p-5"
    >
      <div className="flex items-start gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50 text-primary dark:border-slate-700 dark:bg-slate-800">
          {logo ? (
            <Image
              src={logo}
              alt={`${name} logo`}
              width={56}
              height={56}
              className="size-full object-cover"
            />
          ) : (
            <Building2 className="size-7" aria-hidden="true" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={href}
                className="font-semibold text-foreground transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {name}
              </Link>
              <p className="mt-1 text-sm text-muted">{industry}</p>
            </div>

            {verified ? (
              <Badge variant="success" className="gap-1">
                <BadgeCheck className="size-3.5" aria-hidden="true" />
                Verified
              </Badge>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            {location ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" aria-hidden="true" />
                {location}
              </span>
            ) : null}
            {typeof openJobs === "number" ? (
              <span className="font-medium text-foreground">
                {openJobs} {openJobs === 1 ? "open job" : "open jobs"}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}

export type { CompanyCardProps };
