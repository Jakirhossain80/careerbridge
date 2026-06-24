"use client";

import { AlertTriangle } from "lucide-react";

import DeactivateAccountModal from "@/components/job-seeker/settings/DeactivateAccountModal";
import SettingsCard from "@/components/settings/SettingsCard";
import { Button } from "@/components/ui";

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
      <SettingsCard
        title="Danger Zone"
        description="Deactivate your job seeker account only after confirming this action."
        icon={<AlertTriangle className="size-5" aria-hidden="true" />}
        className="border-red-200 dark:border-red-900"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Deactivate Account
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted">
              This action is prepared for backend integration and requires confirmation.
            </p>
          </div>
          <Button type="button" variant="danger" onClick={() => onOpenChange(true)}>
            Deactivate Account
          </Button>
        </div>
      </SettingsCard>

      <DeactivateAccountModal
        open={isOpen}
        isDeactivating={isDeactivating}
        onClose={() => onOpenChange(false)}
        onConfirm={onDeactivate}
      />
    </>
  );
}
