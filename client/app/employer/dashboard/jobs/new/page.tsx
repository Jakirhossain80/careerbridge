import PostJobForm from "@/components/employer-jobs/job-form/PostJobForm";
import {
  initialEmployerJobFormData,
  mockEmployerCompany,
} from "@/lib/employer-job-form-data";

export default function NewEmployerJobPage() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <PostJobForm
        initialJob={initialEmployerJobFormData}
        company={mockEmployerCompany}
      />
    </main>
  );
}
