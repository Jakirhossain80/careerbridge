import { Building2, Clock, Mail, MapPin, Phone } from "lucide-react";

import { headquarters } from "@/lib/contact-data";

import SectionHeader from "@/components/home/SectionHeader";

export default function ContactMapSection() {
  return (
    <section className="bg-surface px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          align="center"
          eyebrow="Office location"
          title="CareerBridge headquarters"
          description="Our product and support teams operate from Dhaka with digital support for candidates and employers."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-stretch">
          <div className="rounded-lg border border-slate-200 bg-background p-6 shadow-sm dark:border-slate-700 md:p-8">
            <div className="flex size-12 items-center justify-center rounded-lg bg-blue-50 text-primary dark:bg-blue-950">
              <Building2 className="size-6" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
              {headquarters.name}
            </h3>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-muted">
              <li className="flex gap-3">
                <MapPin className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{headquarters.address}</span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{headquarters.hours}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                <a href={`tel:${headquarters.phone}`} className="hover:text-primary">
                  {headquarters.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                <a href={`mailto:${headquarters.email}`} className="hover:text-primary">
                  {headquarters.email}
                </a>
              </li>
            </ul>
          </div>

          <div
            className="relative min-h-80 overflow-hidden rounded-lg border border-slate-200 bg-blue-50 shadow-sm dark:border-slate-700 dark:bg-blue-950/30"
            aria-label="Map preview for CareerBridge headquarters in Dhaka"
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(37,99,235,0.12)_1px,transparent_1px),linear-gradient(rgba(37,99,235,0.12)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute inset-x-8 top-1/2 h-3 -translate-y-1/2 rounded-full bg-white shadow-sm dark:bg-slate-800" />
            <div className="absolute inset-y-8 left-1/2 w-3 -translate-x-1/2 rounded-full bg-white shadow-sm dark:bg-slate-800" />
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-blue-900/20">
                <MapPin className="size-7" aria-hidden="true" />
              </div>
              <div className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm dark:bg-slate-900">
                Dhaka, Bangladesh
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
