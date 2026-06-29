"use client";

import Link from "next/link";
import { Compass, Home, LayoutDashboard, Search } from "lucide-react";

import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { Button, Card } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";

export default function NotFoundPage() {
  const { user, loading } = useAuth();

  return (
    <>
      <PublicNavbar />
      <main className="flex flex-1 items-center justify-center bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl text-center" contentClassName="p-8 sm:p-10">
          <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Compass className="size-7" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold uppercase text-primary">
            Page not found
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            We could not find that page
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted sm:text-base">
            The page may have moved, the link may be outdated, or the address
            may be typed incorrectly.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/">
              <Button leftIcon={<Home className="size-4" aria-hidden="true" />}>
                Go Home
              </Button>
            </Link>
            {!loading && user ? (
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  leftIcon={<LayoutDashboard className="size-4" aria-hidden="true" />}
                >
                  Dashboard
                </Button>
              </Link>
            ) : null}
            <Link href="/jobs">
              <Button
                variant="ghost"
                leftIcon={<Search className="size-4" aria-hidden="true" />}
              >
                Search Jobs
              </Button>
            </Link>
          </div>
        </Card>
      </main>
      <PublicFooter />
    </>
  );
}
