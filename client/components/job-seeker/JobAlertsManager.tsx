"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import JobAlertForm from "@/components/job-seeker/JobAlertForm";
import { ListSkeleton } from "@/components/skeletons";
import { Badge, Button, Card, ConfirmationModal, EmptyState, Modal } from "@/components/ui";
import { appToast } from "@/lib/toast";
import {
  createJobAlert,
  deleteJobAlert,
  getJobAlerts,
  toggleJobAlert,
  updateJobAlert,
} from "@/services/job-alerts.service";
import type { JobAlert } from "@/types/job-alert.types";
import type { JobAlertFormValues } from "@/lib/validations/job-alert.schema";

export default function JobAlertsManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<JobAlert | undefined>();
  const [alertToDelete, setAlertToDelete] = useState<JobAlert | null>(null);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["job-alerts"],
    queryFn: getJobAlerts,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["job-alerts"] });
  const createMutation = useMutation({
    mutationFn: createJobAlert,
    onSuccess: () => {
      invalidate();
      appToast.success("Job alert created successfully.");
    },
    onError: () => appToast.error("Unable to create job alert."),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<JobAlertFormValues> }) =>
      updateJobAlert(id, values),
    onSuccess: () => {
      invalidate();
      appToast.success("Job alert updated successfully.");
    },
    onError: () => appToast.error("Unable to update job alert."),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteJobAlert,
    onSuccess: () => {
      invalidate();
      setAlertToDelete(null);
      appToast.success("Job alert deleted successfully.");
    },
    onError: () => appToast.error("Unable to delete job alert."),
  });
  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      toggleJobAlert(id, active),
    onSuccess: () => {
      invalidate();
      appToast.success("Job alert status updated.");
    },
    onError: () => appToast.error("Unable to update job alert status."),
  });

  const alerts = data?.jobAlerts ?? [];

  const handleSubmit = (values: JobAlertFormValues) => {
    if (editingAlert) {
      updateMutation.mutate({ id: editingAlert._id, values });
    } else {
      createMutation.mutate(values);
    }
    setIsOpen(false);
    setEditingAlert(undefined);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Job alerts</h2>
            <p className="mt-1 text-sm text-slate-600">Create alerts for roles that match your search.</p>
          </div>
          <Button onClick={() => setIsOpen(true)} leftIcon={<Bell className="size-4" />}>
            New alert
          </Button>
        </div>
      </Card>

      {isLoading ? <ListSkeleton count={3} /> : null}
      {!isLoading && !alerts.length ? (
        <EmptyState
          title="No job alerts created yet."
          description="Create an alert to track matching job opportunities."
          actionLabel="Create alert"
          onAction={() => setIsOpen(true)}
        />
      ) : null}
      <div className="grid gap-4">
        {alerts.map((alert) => (
          <Card key={alert._id}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{alert.title}</h3>
                  <Badge variant={alert.isActive ? "success" : "neutral"}>
                    {alert.isActive ? "Active" : "Paused"}
                  </Badge>
                  <Badge variant="primary">{alert.frequency}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {[alert.keyword, alert.location, alert.category, alert.jobType, alert.workMode]
                    .filter(Boolean)
                    .join(" · ") || "Any matching job"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => toggleMutation.mutate({ id: alert._id, active: !alert.isActive })}
                >
                  {alert.isActive ? "Pause" : "Enable"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingAlert(alert);
                    setIsOpen(true);
                  }}
                  leftIcon={<Pencil className="size-4" />}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setAlertToDelete(alert)}
                  leftIcon={<Trash2 className="size-4" />}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingAlert(undefined);
        }}
        title={editingAlert ? "Edit job alert" : "Create job alert"}
      >
        <JobAlertForm
          initialValue={editingAlert}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onSubmit={handleSubmit}
        />
      </Modal>
      <ConfirmationModal
        open={Boolean(alertToDelete)}
        title="Delete job alert?"
        description={`The ${alertToDelete?.title ?? "selected"} alert will be removed and matching job notifications will stop.`}
        confirmLabel="Delete Alert"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onCancel={() => setAlertToDelete(null)}
        onConfirm={() => {
          if (alertToDelete) {
            deleteMutation.mutate(alertToDelete._id);
          }
        }}
      />
    </div>
  );
}
