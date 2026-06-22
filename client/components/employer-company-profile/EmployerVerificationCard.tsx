import { BadgeCheck, ShieldCheck } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import type { CompanyProfile } from "@/lib/employer-company-profile-data";

type EmployerVerificationCardProps = {
  company: CompanyProfile;
};

export default function EmployerVerificationCard({
  company,
}: EmployerVerificationCardProps) {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          <ShieldCheck className="size-6" aria-hidden="true" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-foreground">Verified Employer</h2>
            {company.verified ? (
              <Badge variant="success" className="gap-1">
                <BadgeCheck className="size-3.5" aria-hidden="true" />
                Active
              </Badge>
            ) : (
              <Badge variant="warning">Pending</Badge>
            )}
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">
            CareerBridge has validated this employer profile so candidates can
            apply with confidence.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Profile completion</span>
          <span className="text-muted">{company.profileCompletionPercentage}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${company.profileCompletionPercentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
