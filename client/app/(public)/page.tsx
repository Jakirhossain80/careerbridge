export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-9rem)] items-center justify-center bg-background px-6 py-16">
      <section className="max-w-2xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">
          CareerBridge
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Build your path from learning to work.
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted">
          A simple platform for connecting career goals, practical skills, and
          meaningful opportunities.
        </p>
      </section>
    </main>
  );
}
