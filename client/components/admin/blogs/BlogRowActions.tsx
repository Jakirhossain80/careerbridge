"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Archive,
  Edit,
  Eye,
  FolderTree,
  MoreHorizontal,
  Send,
  Star,
  Tags,
  Trash2,
} from "lucide-react";

import Button from "@/components/ui/Button";
import type { AdminBlog, AdminBlogStatus } from "@/types/admin-blog";

type BlogRowActionsProps = {
  blog: AdminBlog;
  onEdit: (blog: AdminBlog) => void;
  onChangeStatus: (blog: AdminBlog, status: AdminBlogStatus) => void;
  onToggleFeatured: (blog: AdminBlog, featured: boolean) => void;
  onDelete: (blog: AdminBlog) => void;
};

function menuLinkClass() {
  return "flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50";
}

function menuButtonClass(danger = false) {
  return `flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium ${
    danger ? "text-red-700 hover:bg-red-50" : "text-slate-700 hover:bg-slate-50"
  }`;
}

export default function BlogRowActions({
  blog,
  onEdit,
  onChangeStatus,
  onToggleFeatured,
  onDelete,
}: BlogRowActionsProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={menuRef} className="relative inline-flex justify-end">
      <Button type="button" variant="ghost" size="sm" className="size-9 p-0" aria-haspopup="menu" aria-expanded={open} aria-label={`Open actions for ${blog.title}`} onClick={() => setOpen((value) => !value)}>
        <MoreHorizontal className="size-4" aria-hidden="true" />
      </Button>

      {open ? (
        <div role="menu" className="absolute right-0 top-10 z-20 w-72 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg shadow-slate-950/10">
          <Link role="menuitem" href={`/blog/${blog.slug}`} className={menuLinkClass()} onClick={() => setOpen(false)}>
            <Eye className="size-4" aria-hidden="true" />
            View Blog Details
          </Link>
          <button type="button" role="menuitem" className={menuButtonClass()} onClick={() => { setOpen(false); onEdit(blog); }}>
            <Edit className="size-4" aria-hidden="true" />
            Edit Blog
          </button>
          <Link role="menuitem" href={`/blog/${blog.slug}?preview=1`} className={menuLinkClass()} onClick={() => setOpen(false)}>
            <Eye className="size-4" aria-hidden="true" />
            Preview Blog
          </Link>
          <button type="button" role="menuitem" className={menuButtonClass()} onClick={() => { setOpen(false); onChangeStatus(blog, "published"); }}>
            <Send className="size-4" aria-hidden="true" />
            Publish Blog
          </button>
          <button type="button" role="menuitem" className={menuButtonClass()} onClick={() => { setOpen(false); onChangeStatus(blog, "unpublished"); }}>
            <Archive className="size-4" aria-hidden="true" />
            Unpublish Blog
          </button>
          <button type="button" role="menuitem" className={menuButtonClass(true)} onClick={() => { setOpen(false); onChangeStatus(blog, "archived"); }}>
            <Archive className="size-4" aria-hidden="true" />
            Archive Blog
          </button>
          <button type="button" role="menuitem" className={menuButtonClass()} onClick={() => { setOpen(false); onToggleFeatured(blog, !blog.featured); }}>
            <Star className="size-4" aria-hidden="true" />
            {blog.featured ? "Remove Featured Status" : "Mark as Featured"}
          </button>
          <Link role="menuitem" href="/admin/categories" className={menuLinkClass()} onClick={() => setOpen(false)}>
            <FolderTree className="size-4" aria-hidden="true" />
            Manage Blog Categories
          </Link>
          <button type="button" role="menuitem" disabled title="Blog tags manager will be enabled when tag endpoints are available." className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-slate-400 disabled:cursor-not-allowed">
            <Tags className="size-4" aria-hidden="true" />
            Manage Blog Tags
          </button>
          <button type="button" role="menuitem" className={menuButtonClass(true)} onClick={() => { setOpen(false); onDelete(blog); }}>
            <Trash2 className="size-4" aria-hidden="true" />
            Delete Blog
          </button>
        </div>
      ) : null}
    </div>
  );
}
