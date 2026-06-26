"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import ErrorState from "@/components/ui/ErrorState";
import Input from "@/components/ui/Input";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { adminBlogSchema, type AdminBlogValues } from "@/lib/validations/admin.schema";
import {
  adminQueryKeys,
  createAdminBlog,
  getAdminBlog,
  updateAdminBlog,
} from "@/services/admin.service";

type AdminBlogFormProps = {
  blogId?: string;
};

export default function AdminBlogForm({ blogId }: AdminBlogFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const blogQuery = useQuery({
    queryKey: blogId ? adminQueryKeys.blog(blogId) : ["admin-blog", "new"],
    queryFn: () => getAdminBlog(blogId ?? ""),
    enabled: Boolean(blogId),
  });

  const form = useForm<AdminBlogValues>({
    resolver: zodResolver(adminBlogSchema),
    defaultValues: {
      title: "",
      slug: "",
      category: "",
      content: "",
      status: "draft",
    },
  });

  useEffect(() => {
    if (blogQuery.data) {
      form.reset({
        title: blogQuery.data.title,
        slug: blogQuery.data.slug,
        category: blogQuery.data.category ?? "",
        content: blogQuery.data.content ?? "",
        status: blogQuery.data.status,
      });
    }
  }, [blogQuery.data, form]);

  const mutation = useMutation({
    mutationFn: (values: AdminBlogValues) =>
      blogId ? updateAdminBlog(blogId, values) : createAdminBlog(values),
    onSuccess: async (blog) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      router.push(`/admin/blogs/${blog._id}/edit`);
    },
  });

  if (blogId && blogQuery.isLoading) {
    return (
      <main className="p-4 sm:p-6">
        <LoadingSkeleton rows={4} />
      </main>
    );
  }

  if (blogId && blogQuery.isError) {
    return (
      <main className="p-4 sm:p-6">
        <ErrorState title="Blog unavailable" message="This blog could not be loaded." />
      </main>
    );
  }

  return (
    <main className="p-4 sm:p-6">
      <form
        className="mx-auto max-w-3xl space-y-5 rounded-lg border border-slate-200 bg-surface p-5 shadow-sm"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {blogId ? "Edit Blog" : "New Blog"}
          </h1>
          <p className="mt-1 text-sm text-muted">Manage blog content and publication status.</p>
        </div>
        <Input label="Title" error={form.formState.errors.title?.message} {...form.register("title")} />
        <Input label="Slug" error={form.formState.errors.slug?.message} {...form.register("slug")} />
        <Input label="Category" error={form.formState.errors.category?.message} {...form.register("category")} />
        <Select label="Status" {...form.register("status")}>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
          <option value="archived">Archived</option>
        </Select>
        <Textarea
          label="Content"
          rows={12}
          error={form.formState.errors.content?.message}
          {...form.register("content")}
        />
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.push("/admin/blogs")}>
            Cancel
          </Button>
          <Button type="submit" isLoading={mutation.isPending}>
            Save Blog
          </Button>
        </div>
      </form>
    </main>
  );
}
