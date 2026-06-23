import JobSeekerShell from "@/components/job-seeker/JobSeekerShell";
import ResumeManager from "@/components/job-seeker/ResumeManager";

export default function ResumesPage() {
  return (
    <JobSeekerShell>
      <ResumeManager />
    </JobSeekerShell>
  );
}
