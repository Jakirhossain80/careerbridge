import {
  BlogPreview,
  FeaturedJobs,
  HomeHero,
  HomeStats,
  HowItWorks,
  LatestJobs,
  NewsletterSection,
  PopularCategories,
  RemoteJobs,
  SuccessStories,
  TopCompanies,
} from "@/components/home";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";

export default function HomePage() {
  return (
    <>
      <PublicNavbar />
      <main>
        <HomeHero />
        <PopularCategories />
        <FeaturedJobs />
        <TopCompanies />
        <RemoteJobs />
        <LatestJobs />
        <HomeStats />
        <HowItWorks />
        <SuccessStories />
        <BlogPreview />
        <NewsletterSection />
      </main>
      <PublicFooter />
    </>
  );
}
