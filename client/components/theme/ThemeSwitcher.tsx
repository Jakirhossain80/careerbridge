"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";

import { useTheme } from "@/providers/ThemeProvider";
import type { ThemePreference } from "@/types/theme.types";

type ThemeSwitcherProps = {
  align?: "left" | "right";
  className?: string;
};

const themeOptions: Array<{
  value: ThemePreference;
  label: string;
  icon: typeof Sun;
}> = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function ThemeSwitcher({
  align = "right",
  className,
}: ThemeSwitcherProps) {
  const { preference, resolvedTheme, setPreference } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = "theme-switcher-menu";
  const ActiveIcon = resolvedTheme === "dark" ? Moon : Sun;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        className="inline-flex size-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
        aria-label={`Theme: ${preference}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((value) => !value)}
      >
        <ActiveIcon className="size-4" aria-hidden="true" />
      </button>

      {isOpen ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Choose theme"
          className={cn(
            "absolute top-full z-40 mt-2 w-44 rounded-md border border-slate-200 bg-white p-1.5 text-slate-900 shadow-lg shadow-slate-950/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = preference === option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary/30",
                  isSelected
                    ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-200"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800",
                )}
                onClick={() => {
                  setPreference(option.value);
                  setIsOpen(false);
                }}
              >
                <Icon className="size-4" aria-hidden="true" />
                <span className="min-w-0 flex-1">{option.label}</span>
                {isSelected ? <Check className="size-4" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
