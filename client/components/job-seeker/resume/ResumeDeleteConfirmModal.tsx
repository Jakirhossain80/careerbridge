"use client";

import { AlertTriangle } from "lucide-react";

import { Button, Modal } from "@/components/ui";
import type { ResumeFile } from "@/types/resume.types";

type ResumeDeleteConfirmModalProps = {
  resume?: ResumeFile;
  open: boolean;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ResumeDeleteConfirmModal({
  resume,
  open,
  isDeleting = false,
  onClose,
  onConfirm,
}: ResumeDeleteConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete resume?"
      description="This removes the resume from your CareerBridge profile."
      closeOnOverlayClick={!isDeleting}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isDeleting}
            leftIcon={<AlertTriangle className="size-4" aria-hidden="true" />}
          >
            Delete Resume
          </Button>
        </>
      }
    >
      <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-900">
        <p className="font-semibold">{resume?.fileName ?? "Selected resume"}</p>
        <p className="mt-1 text-red-800">
          You can upload a replacement later, but this version will no longer be
          available for applications.
        </p>
      </div>
    </Modal>
  );
}
