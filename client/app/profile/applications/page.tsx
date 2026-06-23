import AppliedJobsList from "@/components/job-seeker/AppliedJobsList";
import JobSeekerShell from "@/components/job-seeker/JobSeekerShell";

export default function ApplicationsPage() {
  return (
    <JobSeekerShell>
      <AppliedJobsList />
    </JobSeekerShell>
  );
}
