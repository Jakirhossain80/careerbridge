import { DetailPageSkeleton } from "@/components/skeletons";

export default function NotificationDetailsLoading() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <DetailPageSkeleton sidebar={false} />
      </div>
    </main>
  );
}
