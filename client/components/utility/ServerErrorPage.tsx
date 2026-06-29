import Link from "next/link";
import { AlertTriangle, Home, Mail } from "lucide-react";

import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { Button, Card } from "@/components/ui";
import TryAgainButton from "@/components/utility/TryAgainButton";

export default function ServerErrorPage() {
  return (
    <>
      <PublicNavbar />
      <main className="flex flex-1 items-center justify-center bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl text-center" contentClassName="p-8 sm:p-10">
          <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-lg bg-red-50 text-red-700">
            <AlertTriangle className="size-7" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold uppercase text-red-700">
            Server error
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Something went wrong
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted sm:text-base">
            We could not complete the request right now. Please try again, or
            contact support if the issue continues.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/">
              <Button leftIcon={<Home className="size-4" aria-hidden="true" />}>
                Go Home
              </Button>
            </Link>
            <TryAgainButton />
            <Link href="/contact">
              <Button
                variant="ghost"
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
