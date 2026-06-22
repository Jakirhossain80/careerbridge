"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button, Card, Textarea } from "@/components/ui";
import {
  applicationNoteSchema,
  type ApplicationNoteFormValues,
} from "@/lib/validations/application.schema";
import type { ApplicationNote } from "@/types/application.types";

type InternalNotesCardProps = {
  notes?: ApplicationNote[];
  isSubmitting?: boolean;
  onSubmit: (note: string) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function InternalNotesCard({
  notes = [],
  isSubmitting = false,
  onSubmit,
}: InternalNotesCardProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationNoteFormValues>({
    resolver: zodResolver(applicationNoteSchema),
    defaultValues: {
      note: "",
    },
  });

  function submit(values: ApplicationNoteFormValues) {
    onSubmit(values.note);
    reset();
  }

  return (
    <Card
      header={<h2 className="text-lg font-bold text-foreground">Internal Notes</h2>}
      contentClassName="space-y-5 p-5"
    >
      <div className="space-y-3">
        {notes.length > 0 ? (
          notes.map((note) => (
            <article
              key={note._id}
              className="rounded-lg border border-slate-200 bg-background p-3 dark:border-slate-700"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">
                  {note.authorName}
                </p>
                <time className="shrink-0 text-xs text-muted">
                  {formatDate(note.createdAt)}
                </time>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{note.message}</p>
            </article>
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 bg-background p-4 text-sm text-muted dark:border-slate-700">
            No private notes have been added yet.
          </p>
        )}
      </div>

      <form className="space-y-3" onSubmit={handleSubmit(submit)}>
        <Textarea
          label="Add a private note"
          placeholder="Share screening context, next steps, or recruiter feedback."
          error={errors.note?.message}
          disabled={isSubmitting}
          {...register("note")}
        />
        <Button type="submit" isLoading={isSubmitting}>
          Post Note
        </Button>
      </form>
    </Card>
  );
}
