"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import ValidationMessage from "@/components/ui/ValidationMessage";
import {
  rejectEmployerSchema,
  type RejectEmployerFormValues,
} from "@/lib/validations/admin-employer-verification.schema";
import type { PendingEmployer } from "@/types/admin-employer-verification";

type RejectEmployerModalProps = {
  employer?: PendingEmployer | null;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (values: RejectEmployerFormValues) => void;
};

const categoryOptions = [
  { label: "Select category", value: "" },
  { label: "Incomplete business documentation", value: "business_documentation" },
  { label: "Company identity mismatch", value: "company_identity" },
  { label: "Suspicious or unverifiable company", value: "verification_risk" },
  { label: "Policy or platform violation", value: "policy_violation" },
  { label: "Other", value: "other" },
];

export default function RejectEmployerModal({
  employer,
  isLoading = false,
  onClose,
  onSubmit,
}: RejectEmployerModalProps) {
  const form = useForm<RejectEmployerFormValues>({
    resolver: zodResolver(rejectEmployerSchema),
    defaultValues: {
      reasonCategory: "",
      reason: "",
    },
  });

  useEffect(() => {
    if (employer) {
      form.reset({ reasonCategory: "", reason: "" });
    }
  }, [employer, form]);

  const reasonCategoryError = form.formState.errors.reasonCategory?.message;
  const reasonError = form.formState.errors.reason?.message;

  return (
    <Modal
      open={Boolean(employer)}
      onClose={onClose}
      title="Reject employer"
      description={
        employer
          ? `Record the rejection reason for ${employer.companyName ?? employer.name}.`
          : undefined
      }
      closeOnOverlayClick={!isLoading}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            isLoading={isLoading}
            onClick={form.handleSubmit(onSubmit)}
          >
            Reject Employer
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-slate-900">
            Rejection category
          </span>
          <Select
            className="mt-2"
            aria-invalid={Boolean(reasonCategoryError)}
            aria-describedby={
              reasonCategoryError ? "reject-employer-category-error" : undefined
            }
            {...form.register("reasonCategory")}
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <ValidationMessage
            id="reject-employer-category-error"
            className="mt-1 block"
          >
            {reasonCategoryError}
          </ValidationMessage>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-900">
            Detailed explanation
          </span>
          <Textarea
            rows={5}
            className="mt-2"
            placeholder="Explain what the employer must fix before resubmitting."
            aria-invalid={Boolean(reasonError)}
            aria-describedby={reasonError ? "reject-employer-reason-error" : undefined}
            {...form.register("reason")}
          />
          <ValidationMessage
            id="reject-employer-reason-error"
            className="mt-1 block"
          >
            {reasonError}
          </ValidationMessage>
        </label>
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
          The backend currently stores this as a moderation reason on the reject
          endpoint. Notification and resubmission workflows are prepared for a
          future request-info API.
        </p>
      </div>
    </Modal>
  );
}
