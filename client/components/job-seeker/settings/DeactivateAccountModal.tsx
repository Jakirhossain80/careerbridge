"use client";

import { Button, Modal } from "@/components/ui";

type DeactivateAccountModalProps = {
  open: boolean;
  isDeactivating: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeactivateAccountModal({
  open,
  isDeactivating,
  onClose,
  onConfirm,
}: DeactivateAccountModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Deactivate account?"
      description="This will call the prepared account deactivation endpoint."
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            isLoading={isDeactivating}
            onClick={onConfirm}
          >
            Confirm Deactivation
          </Button>
        </>
      }
    >
      <p className="text-sm leading-6 text-muted">
        Your profile, resumes, applications, alerts, and recommendations may become unavailable
        after deactivation. Continue only if this is intentional.
      </p>
    </Modal>
  );
}
