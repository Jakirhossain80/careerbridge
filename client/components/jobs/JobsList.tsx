import JobCard from "@/components/jobs/JobCard";
import { jobs, type Job } from "@/lib/jobs-data";

type JobsListProps = {
  jobs?: Job[];
  view?: "grid" | "list";
};

export default function JobsList({
  jobs: jobResults = jobs,
  view = "grid",
}: JobsListProps) {
  return (
    <section aria-labelledby="jobs-results-heading">
      <h2 id="jobs-results-heading" className="sr-only">
        Job results
      </h2>
      <div
        className={
          view === "grid"
            ? "grid gap-5 xl:grid-cols-2"
            : "grid gap-5"
        }
      >
        {jobResults.map((job) => (
          <JobCard key={job.id} job={job} view={view} />
        ))}
      </div>
    </section>
  );
}
