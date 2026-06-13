import { Quote } from "lucide-react";

import type { Testimonial } from "@/lib/home-data";

type TestimonialCardProps = {
  testimonial: Testimonial;
};

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-surface p-6 shadow-sm dark:border-slate-700">
      <Quote className="size-7 text-primary" aria-hidden="true" />
      <blockquote className="mt-5 text-base leading-7 text-foreground">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div className="mt-6 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-primary dark:bg-blue-950">
          {testimonial.initials}
        </div>
        <div>
          <p className="font-semibold text-foreground">{testimonial.name}</p>
          <p className="text-sm text-muted">{testimonial.role}</p>
        </div>
      </div>
    </article>
  );
}

export type { TestimonialCardProps };
