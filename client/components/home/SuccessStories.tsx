import { testimonials } from "@/lib/home-data";

import SectionHeader from "./SectionHeader";
import TestimonialCard from "./TestimonialCard";

export default function SuccessStories() {
  return (
    <section className="bg-surface px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          eyebrow="Success stories"
          title="Career moves with clearer direction"
          description="Candidates and employers use CareerBridge to make the hiring process more focused and less noisy."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
