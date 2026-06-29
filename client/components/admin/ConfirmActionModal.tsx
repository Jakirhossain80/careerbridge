"use client";

import ConfirmationModal from "@/components/ui/ConfirmationModal";

type ConfirmActionModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isLoading?: boolean;
  destructive?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmActionModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  isLoading = false,
  destructive = false,
  onClose,
  onConfirm,
}: ConfirmActionModalProps) {
  return (
    <ConfirmationModal
      open={open}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      variant={destructive ? "destructive" : "default"}
      isLoading={isLoading}
      onCancel={onClose}
      onConfirm={onConfirm}
    />
  );
}
