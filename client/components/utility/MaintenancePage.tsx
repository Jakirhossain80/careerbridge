import Link from "next/link";
import { Clock, Home, Mail, Wrench } from "lucide-react";

import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { Button, Card } from "@/components/ui";

type MaintenancePageProps = {
  estimatedReturnAt?: string;
};

export default function MaintenancePage({
  estimatedReturnAt,
}: MaintenancePageProps) {
  return (
    <>
      <PublicNavbar />
      <main className="flex flex-1 items-center justify-center bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl text-center" contentClassName="p-8 sm:p-10">
          <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Wrench className="size-7" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold uppercase text-primary">
            Maintenance
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            CareerBridge is temporarily unavailable
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted sm:text-base">
            We are performing scheduled work to keep the platform reliable.
            Please check back shortly.
          </p>

          {estimatedReturnAt ? (
            <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              <Clock className="size-4 text-primary" aria-hidden="true" />
              Estimated return: {estimatedReturnAt}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/">
              <Button leftIcon={<Home className="size-4" aria-hidden="true" />}>
                Go Home
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                leftIcon={<Mail className="size-4" aria-hidden="true" />}
              >
                Contact Support
              </Button>
            </Link>
          </div>
        </Card>
      </main>
      <PublicFooter />
    </>
  );
}
