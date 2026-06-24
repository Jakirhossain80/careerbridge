import JobSeekerDashboardLayout from "@/components/layouts/JobSeekerDashboardLayout";
import ResumeManagerContent from "@/components/job-seeker/resume/ResumeManagerContent";

export default function ResumeManagerPage() {
  return (
    <JobSeekerDashboardLayout>
      <ResumeManagerContent />
    </JobSeekerDashboardLayout>
  );
}
