import { CheckCircle2, Download } from "lucide-react";

import Button from "@/components/ui/Button";

export default function TermsActions() {
  return (
    <section
      aria-labelledby="terms-actions-heading"
      className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Ready to continue?</p>
          <h2
            id="terms-actions-heading"
            className="mt-1 text-xl font-bold tracking-tight text-foreground"
          >
            Review and accept the CareerBridge Terms.
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            PDF download is shown as a future action. Real PDF generation is not
            connected yet.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          <Button
            type="button"
            size="lg"
            leftIcon={<CheckCircle2 className="size-5" aria-hidden="true" />}
          >
            Accept Terms
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            leftIcon={<Download className="size-5" aria-hidden="true" />}
            aria-label="Download PDF coming soon"
          >
            Download PDF
          </Button>
        </div>
      </div>
    </section>
  );
}
