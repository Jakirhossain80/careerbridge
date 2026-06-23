import JobSeekerShell from "@/components/job-seeker/JobSeekerShell";
import SavedJobsList from "@/components/job-seeker/SavedJobsList";

export default function SavedJobsPage() {
  return (
    <JobSeekerShell>
      <SavedJobsList />
    </JobSeekerShell>
  );
}
