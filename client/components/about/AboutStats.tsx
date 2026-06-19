import { aboutStats } from "@/lib/about-data";

export default function AboutStats() {
  return (
    <section className="bg-primary px-6 py-14 text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {aboutStats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-lg border border-white/15 bg-white/10 p-5 shadow-sm"
          >
            <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
            <h2 className="mt-3 text-base font-semibold">{stat.label}</h2>
            <p className="mt-2 text-sm leading-6 text-blue-50">
              {stat.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
