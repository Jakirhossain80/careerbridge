import { Menu, Search } from "lucide-react";

type DashboardTopbarProps = {
  onMenuClick: () => void;
};

export default function DashboardTopbar({ onMenuClick }: DashboardTopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-surface/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-md p-2 text-muted transition hover:bg-background hover:text-foreground lg:hidden"
            aria-label="Open dashboard menu"
            onClick={onMenuClick}
          >
            <Menu size={21} aria-hidden="true" />
          </button>
          <div>
            <p className="text-sm text-muted">Dashboard</p>
            <h1 className="text-lg font-semibold text-foreground">Overview</h1>
          </div>
        </div>

        <div className="hidden h-10 w-full max-w-xs items-center gap-2 rounded-md border border-slate-200 bg-background px-3 text-muted sm:flex">
          <Search size={17} aria-hidden="true" />
          <span className="text-sm">Search placeholder</span>
        </div>
      </div>
    </header>
  );
}
