import JobsEmptyState from "@/components/jobs/JobsEmptyState";
import JobsFilters from "@/components/jobs/JobsFilters";
import JobsList from "@/components/jobs/JobsList";
import JobsLoadingSkeleton from "@/components/jobs/JobsLoadingSkeleton";
import JobsPagination from "@/components/jobs/JobsPagination";
import JobsToolbar from "@/components/jobs/JobsToolbar";
import type { CategoryJobsData } from "@/lib/category-jobs-data";

type CategoryJobsPageContentProps = {
  data: CategoryJobsData;
  isLoading?: boolean;
};

export default function CategoryJobsPageContent({
  data,
  isLoading = false,
}: CategoryJobsPageContentProps) {
  const hasJobs = data.jobs.length > 0;

  return (
    <section className="bg-background px-6 py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
        <JobsFilters
          groups={data.filterGroups}
          defaultSalary={80000}
          salaryRangeLabel="Showing development jobs from $80K and above"
        />

        <div>
          <JobsToolbar
            count={data.jobs.length}
            summary={data.toolbarSummary}
            view="grid"
          />

          {isLoading ? (
            <JobsLoadingSkeleton />
          ) : hasJobs ? (
            <>
              <JobsList jobs={data.jobs} view="grid" />
              <JobsPagination
                currentPage={data.pagination.currentPage}
                totalPages={data.pagination.totalPages}
                shownCount={data.pagination.shownCount}
              />
            </>
          ) : (
            <JobsEmptyState />
          )}
        </div>
      </div>
    </section>
  );
}
