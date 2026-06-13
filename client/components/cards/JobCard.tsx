import Image from "next/image";
import Link from "next/link";
import { Bookmark, BriefcaseBusiness, Clock3, MapPin } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";

type JobCardProps = {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  jobType: string;
  workMode: string;
  salary?: string;
  skills?: string[];
  postedAt?: string;
  featured?: boolean;
  href: string;
  showSaveButton?: boolean;
  saved?: boolean;
  onSave?: (id: string) => void;
  className?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function JobCard({
  id,
  title,
  companyName,
  companyLogo,
  location,
  jobType,
  workMode,
  salary,
  skills = [],
  postedAt,
  featured = false,
  href,
  showSaveButton = false,
  saved = false,
  onSave,
  className,
}: JobCardProps) {
  return (
    <Card
      className={cn(
        "transition hover:border-primary/40 hover:shadow-md",
        featured && "border-primary/40 shadow-blue-900/10",
        className,
      )}
      contentClassName="p-5"
    >
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50 text-primary dark:border-slate-700 dark:bg-slate-800">
          {companyLogo ? (
            <Image
              src={companyLogo}
              alt={`${companyName} logo`}
              width={48}
              height={48}
              className="size-full object-cover"
            />
          ) : (
            <BriefcaseBusiness className="size-6" aria-hidden="true" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <Link
                href={href}
                className="text-base font-semibold text-foreground transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {title}
              </Link>
              <p className="mt-1 text-sm text-muted">{companyName}</p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {featured ? <Badge variant="primary">Featured</Badge> : null}
              {showSaveButton ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="size-9 p-0"
                  onClick={() => onSave?.(id)}
                  aria-label={saved ? `Unsave ${title}` : `Save ${title}`}
                  aria-pressed={saved}
                >
                  <Bookmark
                    className={cn("size-4", saved && "fill-current")}
                    aria-hidden="true"
                  />
                </Button>
              ) : null}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden="true" />
              {location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BriefcaseBusiness className="size-4" aria-hidden="true" />
              {jobType}
            </span>
            <span>{workMode}</span>
            {postedAt ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-4" aria-hidden="true" />
                {postedAt}
              </span>
            ) : null}
          </div>

          {salary ? (
            <p className="mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              {salary}
            </p>
          ) : null}

          {skills.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.slice(0, 6).map((skill) => (
                <Badge key={skill} variant="neutral">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export type { JobCardProps };
