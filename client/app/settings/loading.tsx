import { FormSkeleton } from "@/components/skeletons";

export default function SettingsLoading() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FormSkeleton sections={2} fieldsPerSection={4} />
      </div>
    </main>
  );
}
