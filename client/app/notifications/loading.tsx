import { ListSkeleton, PageHeaderSkeleton } from "@/components/skeletons";

export default function NotificationsLoading() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeaderSkeleton />
        <ListSkeleton count={5} />
      </div>
    </main>
  );
}
