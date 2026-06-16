import JobCard from "@/components/jobs/JobCard";
import { jobs } from "@/lib/jobs-data";

type JobsListProps = {
  view?: "grid" | "list";
};

export default function JobsList({ view = "grid" }: JobsListProps) {
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
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} view={view} />
        ))}
      </div>
    </section>
  );
}
