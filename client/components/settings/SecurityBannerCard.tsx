import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";

import { Card } from "@/components/ui";

export default function SecurityBannerCard() {
  return (
    <Card className="border-blue-200 bg-blue-50 text-blue-950 shadow-sm dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100">
      <div className="flex gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-white">
          <LockKeyhole className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-sm font-semibold">Keep your account recovery ready</h2>
          <p className="mt-2 text-sm leading-6 text-blue-800 dark:text-blue-200">
            Make sure your profile email is current so password reset and security
            notifications reach you.
          </p>
          <Link
            href="/job-seeker/profile"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-blue-700 dark:text-blue-200 dark:hover:text-white"
          >
            Review profile
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
