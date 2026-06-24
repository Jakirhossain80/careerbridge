"use client";

import type { InputHTMLAttributes } from "react";

type ToggleSwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  description?: string;
};

export default function ToggleSwitch({
  label,
  description,
  checked,
  disabled,
  className,
  ...props
}: ToggleSwitchProps) {
  return (
    <label
      className={`flex cursor-pointer flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
        disabled ? "opacity-70" : ""
      } ${className ?? ""}`}
    >
      <span>
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        {description ? (
          <span className="mt-1 block text-sm leading-6 text-muted">{description}</span>
        ) : null}
      </span>
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          disabled={disabled}
          {...props}
        />
        <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30 peer-disabled:cursor-not-allowed dark:bg-slate-700" />
        <span className="absolute left-1 size-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

export type { ToggleSwitchProps };
