import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-lg bg-zinc-950 text-white">
            <LayoutDashboard size={21} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-zinc-950">
              CareerBridge Dashboard
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Your dashboard will appear here after role-specific pages are
              added.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8">
          <p className="text-sm font-medium text-zinc-950">
            Protected dashboard placeholder
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            This page is only available to signed-in users with verified email
            addresses.
          </p>
        </div>
      </section>
    </main>
  );
}
