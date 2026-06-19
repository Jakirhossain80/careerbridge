import type { Metadata } from "next";

import ContactFAQ from "@/components/contact/ContactFAQ";
import ContactForm from "@/components/contact/ContactForm";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfoCards from "@/components/contact/ContactInfoCards";
import ContactMapSection from "@/components/contact/ContactMapSection";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";

export const metadata: Metadata = {
  title: "Contact CareerBridge",
  description:
    "Contact CareerBridge for job seeker support, employer support, recruiter partnerships, billing questions, and technical help.",
};

export default function ContactPage() {
  return (
    <>
      <PublicNavbar />
      <main>
        <ContactHero />
        <ContactForm />
        <ContactInfoCards />
        <ContactFAQ />
        <ContactMapSection />
      </main>
      <PublicFooter />
    </>
  );
}
