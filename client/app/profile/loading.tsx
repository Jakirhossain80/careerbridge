import { ProfileSkeleton } from "@/components/skeletons";

export default function ProfileLoading() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <ProfileSkeleton />
      </div>
    </main>
  );
}
