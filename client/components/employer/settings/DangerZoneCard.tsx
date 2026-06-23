"use client";

import { AlertTriangle } from "lucide-react";

import { Button, Card, Modal } from "@/components/ui";

type DangerZoneCardProps = {
  isOpen: boolean;
  isDeactivating: boolean;
  onOpenChange: (open: boolean) => void;
  onDeactivate: () => void;
};

export default function DangerZoneCard({
  isOpen,
  isDeactivating,
  onOpenChange,
  onDeactivate,
}: DangerZoneCardProps) {
  return (
    <>
      <Card
        className="border-red-200 dark:border-red-900"
        header={
          <div className="flex gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300">
              <AlertTriangle className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">
                Danger Zone
              </h2>
              <p className="mt-1 text-sm text-muted">
                Deactivate this employer account only after confirming with the workspace owner.
              </p>
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold">Deactivate Employer Account</h3>
            <p className="mt-1 text-sm leading-6 text-muted">
              This action is prepared for backend integration and requires confirmation.
            </p>
          </div>
          <Button type="button" variant="danger" onClick={() => onOpenChange(true)}>
            Deactivate Account
          </Button>
        </div>
      </Card>

      <Modal
        open={isOpen}
        onClose={() => onOpenChange(false)}
        title="Deactivate employer account?"
        description="This will call the prepared deactivation endpoint when backend support is available."
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              isLoading={isDeactivating}
              onClick={onDeactivate}
            >
              Confirm Deactivation
            </Button>
          </>
        }
      >
        <p className="text-sm leading-6 text-muted">
          Your jobs, applicants, team access, and company profile may become unavailable after
          deactivation. Continue only if this is intentional.
        </p>
      </Modal>
    </>
  );
}

