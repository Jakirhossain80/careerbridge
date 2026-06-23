import ApplicationDetails from "@/components/job-seeker/ApplicationDetails";
import JobSeekerShell from "@/components/job-seeker/JobSeekerShell";

type ApplicationDetailsPageProps = {
  params: Promise<{ applicationId: string }>;
};

export default async function ApplicationDetailsPage({
  params,
}: ApplicationDetailsPageProps) {
  const { applicationId } = await params;

  return (
    <JobSeekerShell>
      <ApplicationDetails applicationId={applicationId} />
    </JobSeekerShell>
  );
}
