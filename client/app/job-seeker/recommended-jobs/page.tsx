import RecommendedJobsContent from "@/components/job-seeker/recommended-jobs/RecommendedJobsContent";
import JobSeekerDashboardLayout from "@/components/layouts/JobSeekerDashboardLayout";

export default function RecommendedJobsPage() {
  return (
    <JobSeekerDashboardLayout>
      <RecommendedJobsContent />
    </JobSeekerDashboardLayout>
  );
}
