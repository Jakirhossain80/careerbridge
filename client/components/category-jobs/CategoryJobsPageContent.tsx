import JobsSearchResults from "@/components/jobs/JobsSearchResults";

type CategoryJobsPageContentProps = { category: string };

export default function CategoryJobsPageContent({ category }: CategoryJobsPageContentProps) {
  return <JobsSearchResults fixedParams={{ category }} showSearchBar={false} />;
}
