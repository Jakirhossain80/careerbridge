import { Menu } from "lucide-react";

import DashboardGlobalSearch from "@/components/dashboard/DashboardGlobalSearch";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";

type DashboardTopbarProps = {
  onMenuClick: () => void;
  isMenuOpen?: boolean;
  menuControlsId?: string;
  title?: string;
  searchPlaceholder?: string;
};

export default function DashboardTopbar({
  onMenuClick,
  isMenuOpen = false,
  menuControlsId,
  title = "Overview",
  searchPlaceholder = "Search placeholder",
}: DashboardTopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-surface/95 backdrop-blur dark:border-slate-700">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-md p-2 text-muted transition hover:bg-background hover:text-foreground lg:hidden"
            aria-label="Open dashboard menu"
            aria-expanded={isMenuOpen}
            aria-controls={menuControlsId}
            onClick={onMenuClick}
          >
            <Menu size={21} aria-hidden="true" />
          </button>
          <div>
            <p className="text-sm text-muted">Dashboard</p>
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <DashboardGlobalSearch
            placeholder={searchPlaceholder}
            className="hidden w-80 max-w-xs sm:block"
          />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
