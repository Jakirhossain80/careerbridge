export default function MyJobsLoadingState() {
  return (
    <div className="space-y-3 p-4" aria-label="Loading posted jobs">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="grid animate-pulse gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700 md:grid-cols-[minmax(220px,1fr)_120px_120px_100px_120px_220px]"
        >
          <div>
            <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-2 h-3 w-64 max-w-full rounded bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-6 w-20 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-7 w-12 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-8 w-44 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      ))}
    </div>
  );
}
