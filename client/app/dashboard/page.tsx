import { Bell, BriefcaseBusiness, FileText } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            CareerBridge Dashboard
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            This placeholder dashboard will hold role-specific tools,
            applications, notifications, and settings later.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="app-surface rounded-lg border border-slate-200 p-5 shadow-sm">
            <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <BriefcaseBusiness size={20} aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-muted">Saved jobs</p>
            <p className="mt-2 text-2xl font-bold text-foreground">0</p>
          </div>
          <div className="app-surface rounded-lg border border-slate-200 p-5 shadow-sm">
            <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-accent/10 text-accent">
              <FileText size={20} aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-muted">Applications</p>
            <p className="mt-2 text-2xl font-bold text-foreground">0</p>
          </div>
          <div className="app-surface rounded-lg border border-slate-200 p-5 shadow-sm">
            <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-slate-100 text-muted">
              <Bell size={20} aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-muted">Notifications</p>
            <p className="mt-2 text-2xl font-bold text-foreground">0</p>
          </div>
        </div>

        <div className="app-surface mt-6 rounded-lg border border-dashed border-slate-300 p-6">
          <p className="text-sm font-semibold text-foreground">
            Dashboard layout placeholder
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Real dashboard content, role-based navigation, and backend data will
            be added in later steps.
          </p>
        </div>
      </section>
    </main>
  );
}
