import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button, Card } from "@/components/ui";

export default function NotificationPromoBanner() {
  return (
    <Card contentClassName="p-5 sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Get better job alerts
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
              Keep your profile, skills, and alert preferences current to receive
              more relevant application updates and job recommendations.
            </p>
          </div>
        </div>

        <Link href="/profile/job-alerts">
          <Button type="button" variant="outline" className="w-full sm:w-fit">
            Manage Alerts
          </Button>
        </Link>
      </div>
    </Card>
  );
}
