export type BlogCategory =
  | "All Articles"
  | "Career Tips"
  | "Resume Writing"
  | "Interview Prep"
  | "Networking"
  | "Workplace Culture"
  | "Remote Work"
  | "Hiring Trends"
  | "Employer Branding"
  | "Recruitment Insights";

export type FeaturedStatus = "featured" | "standard";

export type BlogArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  authorAvatar: string;
  category: Exclude<BlogCategory, "All Articles">;
  tags: string[];
  publishedAt: string;
  readingTime: string;
  reads: string;
  featuredStatus: FeaturedStatus;
};

export const blogCategories: BlogCategory[] = [
  "All Articles",
  "Career Tips",
  "Resume Writing",
  "Interview Prep",
  "Networking",
  "Workplace Culture",
  "Remote Work",
  "Hiring Trends",
  "Employer Branding",
  "Recruitment Insights",
];

export const blogArticles: BlogArticle[] = [
  {
    id: "blog-001",
    slug: "stand-out-in-a-competitive-job-market",
    title: "How to stand out in a competitive job market",
    excerpt:
      "Learn how to sharpen your positioning, show measurable impact, and build a search routine that gets noticed by hiring teams.",
    featuredImage:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
    author: "Maya Rahman",
    authorAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    category: "Career Tips",
    tags: ["job search", "career growth", "applications"],
    publishedAt: "Jun 18, 2026",
    readingTime: "7 min read",
    reads: "12.4K",
    featuredStatus: "featured",
  },
  {
    id: "blog-002",
    slug: "resume-bullets-that-show-impact",
    title: "Write resume bullets that prove business impact",
    excerpt:
      "Use a simple evidence-first format to turn responsibilities into outcomes recruiters can quickly understand.",
    featuredImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80",
    author: "Daniel Kim",
    authorAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    category: "Resume Writing",
    tags: ["resume", "impact", "career documents"],
    publishedAt: "Jun 15, 2026",
    readingTime: "6 min read",
    reads: "8.9K",
    featuredStatus: "standard",
  },
  {
    id: "blog-003",
    slug: "answer-behavioral-interview-questions",
    title: "A practical framework for behavioral interviews",
    excerpt:
      "Prepare concise stories that show judgment, collaboration, ownership, and clear results under pressure.",
    featuredImage:
      "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?auto=format&fit=crop&w=900&q=80",
    author: "Priya Shah",
    authorAvatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80",
    category: "Interview Prep",
    tags: ["interviews", "STAR method", "communication"],
    publishedAt: "Jun 12, 2026",
    readingTime: "8 min read",
    reads: "10.1K",
    featuredStatus: "standard",
  },
  {
    id: "blog-004",
    slug: "networking-without-cold-message-spam",
    title: "Networking without sounding transactional",
    excerpt:
      "Build useful professional relationships with targeted outreach, better context, and meaningful follow-up.",
    featuredImage:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
    author: "Omar Castillo",
    authorAvatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80",
    category: "Networking",
    tags: ["networking", "outreach", "relationships"],
    publishedAt: "Jun 9, 2026",
    readingTime: "5 min read",
    reads: "6.7K",
    featuredStatus: "standard",
  },
  {
    id: "blog-005",
    slug: "evaluate-workplace-culture-before-accepting",
    title: "How to evaluate workplace culture before accepting an offer",
    excerpt:
      "Ask sharper questions, read hiring signals, and identify whether a company's operating style fits how you work best.",
    featuredImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
    author: "Lena Morris",
    authorAvatar:
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=160&q=80",
    category: "Workplace Culture",
    tags: ["culture", "offers", "team fit"],
    publishedAt: "Jun 5, 2026",
    readingTime: "6 min read",
    reads: "5.3K",
    featuredStatus: "standard",
  },
  {
    id: "blog-006",
    slug: "remote-work-routine-for-new-hires",
    title: "Build a remote work routine that earns trust fast",
    excerpt:
      "Use better async updates, visible priorities, and healthy boundaries to ramp up confidently from anywhere.",
    featuredImage:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80",
    author: "Noah Bennett",
    authorAvatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
    category: "Remote Work",
    tags: ["remote", "productivity", "onboarding"],
    publishedAt: "Jun 1, 2026",
    readingTime: "7 min read",
    reads: "7.8K",
    featuredStatus: "standard",
  },
  {
    id: "blog-007",
    slug: "hiring-trends-shaping-2026",
    title: "Hiring trends shaping candidate decisions in 2026",
    excerpt:
      "Understand how skills-based screening, salary transparency, and faster interview loops are changing the search.",
    featuredImage:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80",
    author: "Ayesha Karim",
    authorAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
    category: "Hiring Trends",
    tags: ["hiring", "market trends", "talent"],
    publishedAt: "May 28, 2026",
    readingTime: "9 min read",
    reads: "11.6K",
    featuredStatus: "standard",
  },
  {
    id: "blog-008",
    slug: "employer-branding-for-growing-teams",
    title: "Employer branding moves growing teams can make now",
    excerpt:
      "Clarify your candidate promise with authentic stories, transparent process notes, and stronger role pages.",
    featuredImage:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=900&q=80",
    author: "Marcus Lee",
    authorAvatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=160&q=80",
    category: "Employer Branding",
    tags: ["employer brand", "candidate experience", "teams"],
    publishedAt: "May 24, 2026",
    readingTime: "6 min read",
    reads: "4.9K",
    featuredStatus: "standard",
  },
  {
    id: "blog-009",
    slug: "recruitment-insights-for-better-shortlists",
    title: "Recruitment insights that create better shortlists",
    excerpt:
      "Improve role calibration, screening signals, and structured evaluation without slowing down the hiring team.",
    featuredImage:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
    author: "Sophia Grant",
    authorAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
    category: "Recruitment Insights",
    tags: ["recruiting", "screening", "shortlists"],
    publishedAt: "May 20, 2026",
    readingTime: "8 min read",
    reads: "6.1K",
    featuredStatus: "standard",
  },
];

export const popularBlogArticles = [...blogArticles]
  .filter((article) => article.featuredStatus !== "featured")
  .slice(0, 5);
