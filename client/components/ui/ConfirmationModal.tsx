"use client";

import type { ReactNode } from "react";

import Button from "./Button";
import Modal from "./Modal";
import type { ButtonVariant } from "./Button";

type ConfirmationVariant = "default" | "warning" | "destructive" | "success";

type ConfirmationModalProps = {
  open: boolean;
  title: ReactNode;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmationVariant;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
};

const confirmButtonVariants: Record<ConfirmationVariant, ButtonVariant> = {
  default: "primary",
  warning: "primary",
  destructive: "danger",
  success: "secondary",
};

export default function ConfirmationModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  isLoading = false,
  onConfirm,
  onCancel,
  children,
}: ConfirmationModalProps) {
  function handleCancel() {
    if (!isLoading) {
      onCancel();
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      title={title}
      description={description}
      closeOnOverlayClick={!isLoading}
      closeOnEscape={!isLoading}
      closeButtonDisabled={isLoading}
      footer={
        <>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={confirmButtonVariants[variant]}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
}

export type { ConfirmationModalProps, ConfirmationVariant };
