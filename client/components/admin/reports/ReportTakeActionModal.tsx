"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import {
  adminReportActionSchema,
  type AdminReportActionValues,
} from "@/lib/validations/admin-report.schema";
import type { AdminReport, AdminReportAction } from "@/types/admin-report";
import {
  formatReportLabel,
  getReportEntityLabel,
  getReportEntityType,
  getReporterEmail,
  getReporterName,
  normalizeReportStatus,
} from "./report-formatters";

type ReportTakeActionModalProps = {
  open: boolean;
  report: AdminReport | null;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (values: AdminReportActionValues) => void;
};

const actionOptions: Array<{ label: string; value: AdminReportAction; disabled?: boolean }> = [
  { label: "Mark under review", value: "under_review" },
  { label: "Mark resolved", value: "resolved" },
  { label: "Dismiss report", value: "dismissed" },
  { label: "Escalate report", value: "escalated" },
  { label: "Suspend account (not connected)", value: "suspend_account", disabled: true },
  { label: "Remove content (not connected)", value: "remove_content", disabled: true },
];

export default function ReportTakeActionModal({
  open,
  report,
  isLoading = false,
  onClose,
  onSubmit,
}: ReportTakeActionModalProps) {
  const form = useForm<AdminReportActionValues>({
    resolver: zodResolver(adminReportActionSchema),
    defaultValues: {
      action: "under_review",
      moderatorNote: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        action: "under_review",
        moderatorNote: report?.moderatorNote ?? "",
      });
    }
  }, [form, open, report?.moderatorNote]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Take moderation action"
      description="Review the report summary, choose a supported action, and add an internal note."
      className="max-w-2xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" form="report-action-form" isLoading={isLoading}>
            Confirm Action
          </Button>
        </>
      }
    >
      {report ? (
        <form id="report-action-form" className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{getReportEntityLabel(report)}</p>
                <p className="mt-1 text-sm text-muted capitalize">
                  {getReportEntityType(report)} report from {getReporterName(report)}
                </p>
              </div>
              <AdminStatusBadge status={normalizeReportStatus(report.status)} />
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted">Reporter</dt>
                <dd className="font-medium text-foreground">{getReporterEmail(report)}</dd>
              </div>
              <div>
                <dt className="text-muted">Reason</dt>
                <dd className="font-medium capitalize text-foreground">{formatReportLabel(report.reason)}</dd>
              </div>
            </dl>
            {report.description ? (
              <p className="mt-4 text-sm leading-6 text-muted">{report.description}</p>
            ) : null}
          </div>

          <Select
            label="Moderator action"
            error={form.formState.errors.action?.message}
            {...form.register("action")}
          >
            {actionOptions.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </Select>
          <Textarea
            label="Internal admin note"
            rows={4}
            placeholder="Add investigation details, evidence reviewed, or resolution context."
            error={form.formState.errors.moderatorNote?.message}
            {...form.register("moderatorNote")}
          />
        </form>
      ) : null}
    </Modal>
  );
}
