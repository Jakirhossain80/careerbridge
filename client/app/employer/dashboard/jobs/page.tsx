import MyPostedJobsPage from "@/components/employer-jobs/my-jobs/MyPostedJobsPage";
import { employerPostedJobs } from "@/lib/employer-jobs-data";

export default function EmployerJobsPage() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <MyPostedJobsPage initialJobs={employerPostedJobs} />
    </main>
  );
}
