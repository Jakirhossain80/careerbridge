import { aboutTestimonials } from "@/lib/about-data";

import SectionHeader from "@/components/home/SectionHeader";
import TestimonialCard from "@/components/home/TestimonialCard";

export default function AboutTestimonials() {
  return (
    <section className="bg-surface px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          eyebrow="Testimonials"
          title="Trusted by candidates and hiring teams"
          description="CareerBridge helps both sides make faster, clearer decisions with practical career and hiring context."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {aboutTestimonials.map((testimonial) => (
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
