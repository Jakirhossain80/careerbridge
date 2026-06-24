"use client";

import { Button, Modal } from "@/components/ui";
import type { CareerBridgeNotification } from "@/types/notification.types";

type DeleteNotificationConfirmModalProps = {
  notification: CareerBridgeNotification | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteNotificationConfirmModal({
  notification,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteNotificationConfirmModalProps) {
  return (
    <Modal
      open={Boolean(notification)}
      onClose={onClose}
      title="Delete notification"
      description="This notification will be removed from your inbox."
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            isLoading={isDeleting}
            onClick={onConfirm}
          >
            Delete Notification
          </Button>
        </>
      }
    >
      {notification ? (
        <div className="rounded-lg border border-slate-200 bg-background p-4 dark:border-slate-700">
          <h3 className="font-semibold text-foreground">{notification.title}</h3>
          <p className="mt-1 text-sm leading-6 text-muted">{notification.message}</p>
        </div>
      ) : null}
    </Modal>
  );
}
