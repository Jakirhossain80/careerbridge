"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Archive,
  BriefcaseBusiness,
  Edit,
  Eye,
  MoreHorizontal,
  Power,
  PowerOff,
  Trash2,
} from "lucide-react";

import Button from "@/components/ui/Button";
import type { AdminCategory, AdminCategoryStatus } from "@/types/admin-category";

type CategoryRowActionsProps = {
  category: AdminCategory;
  onEdit: (category: AdminCategory) => void;
  onChangeStatus: (category: AdminCategory, status: AdminCategoryStatus) => void;
  onDelete: (category: AdminCategory) => void;
};

function menuLinkClass() {
  return "flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50";
}

function menuButtonClass(danger = false) {
  return `flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium ${
    danger ? "text-red-700 hover:bg-red-50" : "text-slate-700 hover:bg-slate-50"
  }`;
}

export default function CategoryRowActions({
  category,
  onEdit,
  onChangeStatus,
  onDelete,
}: CategoryRowActionsProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={menuRef} className="relative inline-flex justify-end">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="size-9 p-0"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Open actions for ${category.name}`}
        onClick={() => setOpen((value) => !value)}
      >
        <MoreHorizontal className="size-4" aria-hidden="true" />
      </Button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-10 z-20 w-72 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg shadow-slate-950/10"
        >
          <Link
            role="menuitem"
            href={`/categories/${category.slug}`}
            className={menuLinkClass()}
            onClick={() => setOpen(false)}
          >
            <Eye className="size-4" aria-hidden="true" />
            View Category Details
          </Link>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass()}
            onClick={() => {
              setOpen(false);
              onEdit(category);
            }}
          >
            <Edit className="size-4" aria-hidden="true" />
            Edit Category
          </button>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass()}
            onClick={() => {
              setOpen(false);
              onChangeStatus(category, "active");
            }}
          >
            <Power className="size-4" aria-hidden="true" />
            Activate Category
          </button>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass()}
            onClick={() => {
              setOpen(false);
              onChangeStatus(category, "inactive");
            }}
          >
            <PowerOff className="size-4" aria-hidden="true" />
            Deactivate Category
          </button>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass()}
            onClick={() => {
              setOpen(false);
              onChangeStatus(category, "archived");
            }}
          >
            <Archive className="size-4" aria-hidden="true" />
            Archive Category
          </button>
          <Link
            role="menuitem"
            href={`/admin/jobs?category=${encodeURIComponent(category.name)}`}
            className={menuLinkClass()}
            onClick={() => setOpen(false)}
          >
            <BriefcaseBusiness className="size-4" aria-hidden="true" />
            View Jobs Within Category
          </Link>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass(true)}
            onClick={() => {
              setOpen(false);
              onDelete(category);
            }}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Delete Category
          </button>
        </div>
      ) : null}
    </div>
  );
}
