"use client";

import { useMemo, useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import { useFeatureCandidateJobs } from "@/hooks/admin/useAdminFeaturedJobs";
import type {
  FeaturedPromotionPriority,
  FeatureJobPayload,
} from "@/types/admin-featured-job";

type FeatureJobModalProps = {
  open: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (payload: FeatureJobPayload) => void;
};

const priorityOptions: Array<{ label: string; value: FeaturedPromotionPriority }> = [
  { label: "Standard", value: "standard" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Ultra", value: "ultra" },
];

const priorityMultiplier: Record<FeaturedPromotionPriority, number> = {
  standard: 1,
  medium: 1.5,
  high: 2.2,
  ultra: 3,
};

export default function FeatureJobModal({
  open,
  isLoading = false,
  onClose,
  onSubmit,
}: FeatureJobModalProps) {
  const [search, setSearch] = useState("");
  const [jobId, setJobId] = useState("");
  const [durationDays, setDurationDays] = useState(14);
  const [priority, setPriority] = useState<FeaturedPromotionPriority>("standard");
  const jobsQuery = useFeatureCandidateJobs({
    search: search.trim() || undefined,
    page: 1,
    limit: 25,
  });

  const estimatedImpressions = useMemo(
    () => Math.round(durationDays * 450 * priorityMultiplier[priority]),
    [durationDays, priority],
  );
  const promotionCost = useMemo(
    () => Math.round(durationDays * 12 * priorityMultiplier[priority]),
    [durationDays, priority],
  );

  function resetAndClose() {
    setSearch("");
    setJobId("");
    setDurationDays(14);
    setPriority("standard");
    onClose();
  }

  function submit() {
    if (!jobId) return;

    onSubmit({
      jobId,
      durationDays,
      priority,
      estimatedImpressions,
      promotionCost,
    });
  }

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      title="Feature New Job"
      description="Select an existing job listing and prepare a promotion package."
      className="max-w-2xl"
      footer={
        <>
          <Button variant="outline" onClick={resetAndClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={submit} isLoading={isLoading} disabled={!jobId}>
            Submit Promotion
          </Button>
        </>
      }
    >
      <div className="grid gap-4">
        <Input
          label="Search job listing"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setJobId("");
          }}
          placeholder="Search by title, company, category, or location"
        />
        <Select
          label="Job listing"
          value={jobId}
          onChange={(event) => setJobId(event.target.value)}
          disabled={jobsQuery.isLoading}
          helperText={
            jobsQuery.isLoading
              ? "Loading available jobs..."
              : "Only non-featured jobs from the current search are shown."
          }
        >
          <option value="">Select a job</option>
          {(jobsQuery.data?.jobs ?? []).map((job) => (
            <option key={job._id} value={job._id}>
              {job.title} {job.companyName ? `- ${job.companyName}` : ""}
            </option>
          ))}
        </Select>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Promotion duration"
            type="number"
            min={1}
            max={120}
            value={durationDays}
            onChange={(event) =>
              setDurationDays(Math.max(1, Number(event.target.value) || 1))
            }
          />
          <Select
            label="Priority level"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as FeaturedPromotionPriority)
            }
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-muted">
              Estimated impressions
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-950">
              {estimatedImpressions.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-muted">
              Promotion cost
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-950">
              ${promotionCost.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
