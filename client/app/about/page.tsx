import type { Metadata } from "next";

import {
  AboutCTA,
  AboutHero,
  AboutIntroduction,
  AboutStats,
  AboutTeam,
  AboutTestimonials,
  CoreValues,
  HowCareerBridgeWorks,
  MissionVision,
  PlatformOverview,
  WhyChooseCareerBridge,
} from "@/components/about";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";

export const metadata: Metadata = {
  title: "About CareerBridge",
  description:
    "Learn how CareerBridge connects job seekers and employers through clearer skills-first hiring.",
};

export default function AboutPage() {
  return (
    <>
      <PublicNavbar />
      <main>
        <AboutHero />
        <AboutIntroduction />
        <MissionVision />
        <CoreValues />
        <PlatformOverview />
        <AboutStats />
        <WhyChooseCareerBridge />
        <HowCareerBridgeWorks />
        <AboutTeam />
        <AboutTestimonials />
        <AboutCTA />
      </main>
      <PublicFooter />
    </>
  );
}
