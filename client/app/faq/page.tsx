import type { Metadata } from "next";

import FAQAdditionalHelp from "@/components/faq/FAQAdditionalHelp";
import FAQExplorer from "@/components/faq/FAQExplorer";
import FAQHero from "@/components/faq/FAQHero";
import FAQSupportCTA from "@/components/faq/FAQSupportCTA";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { faqItems } from "@/lib/faq-data";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | CareerBridge",
  description:
    "Find answers to common CareerBridge questions for job seekers, employers, recruiters, account management, applications, and platform support.",
};

export default function FAQPage() {
  return (
    <>
      <PublicNavbar />
      <main>
        <FAQHero />
        <FAQExplorer items={faqItems} />
        <FAQSupportCTA />
        <FAQAdditionalHelp />
      </main>
      <PublicFooter />
    </>
  );
}
