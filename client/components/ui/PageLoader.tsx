import LoadingSpinner from "@/components/ui/LoadingSpinner";

type PageLoaderProps = {
  title?: string;
  message?: string;
};

export default function PageLoader({
  title = "Loading CareerBridge",
  message = "Preparing your page...",
}: PageLoaderProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <section className="app-surface w-full max-w-sm rounded-lg border border-slate-200 p-8 text-center shadow-sm">
        <div className="mb-5 flex justify-center">
          <LoadingSpinner size="lg" label={title} />
        </div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted">{message}</p>
      </section>
    </main>
  );
}
