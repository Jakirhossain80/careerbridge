"use client";

import { Card } from "@/components/ui";

type CoverLetterCardProps = {
  coverLetter?: string;
};

export default function CoverLetterCard({ coverLetter }: CoverLetterCardProps) {
  return (
    <Card
      header={<h2 className="text-lg font-bold text-foreground">Cover Letter</h2>}
      contentClassName="p-5"
    >
      {coverLetter ? (
        <p className="whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-200">
          {coverLetter}
        </p>
      ) : (
        <p className="rounded-lg border border-dashed border-slate-300 bg-background p-5 text-sm text-muted dark:border-slate-700">
          No cover letter was included with this application.
        </p>
      )}
    </Card>
  );
}
