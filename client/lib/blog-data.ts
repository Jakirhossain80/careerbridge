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

export type BlogContentBlock =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "heading";
      id: string;
      title: string;
    }
  | {
      type: "list";
      items: string[];
    }
  | {
      type: "quote";
      quote: string;
      attribution?: string;
    }
  | {
      type: "proTip";
      title: string;
      text: string;
    };

export type BlogArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: BlogContentBlock[];
  featuredImage: string;
  author: string;
  authorTitle: string;
  authorAvatar: string;
  authorBio: string;
  category: Exclude<BlogCategory, "All Articles">;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  likes: number;
  reads: string;
  featuredStatus: FeaturedStatus;
  relatedPostIds: string[];
  previousSlug?: string;
  nextSlug?: string;
};

export type BlogTableOfContentsItem = {
  id: string;
  title: string;
};

const defaultContent: BlogContentBlock[] = [
  {
    type: "paragraph",
    text: "A stronger job search starts with clarity. Before sending another application, define the exact role, team environment, and business problems where your experience is most relevant.",
  },
  {
    type: "heading",
    id: "positioning",
    title: "Start with sharper positioning",
  },
  {
    type: "paragraph",
    text: "Recruiters are scanning for fit, not reading every line. Make your target role obvious across your resume summary, LinkedIn headline, portfolio, and outreach messages.",
  },
  {
    type: "list",
    items: [
      "Name the role family you are targeting.",
      "Lead with outcomes that match the job description.",
      "Remove details that dilute your strongest signal.",
    ],
  },
  {
    type: "heading",
    id: "proof",
    title: "Use proof instead of claims",
  },
  {
    type: "paragraph",
    text: "Hiring teams trust evidence. Replace broad claims like collaborative, strategic, or hard-working with metrics, scope, before-and-after examples, and decisions you influenced.",
  },
  {
    type: "quote",
    quote:
      "The candidates who stand out make it easy for hiring teams to see the business result behind the work.",
    attribution: "CareerBridge editorial team",
  },
  {
    type: "heading",
    id: "routine",
    title: "Build a repeatable search routine",
  },
  {
    type: "paragraph",
    text: "A weekly system keeps momentum high without turning the search into a full-time distraction. Reserve time for research, tailored applications, follow-ups, and interview practice.",
  },
  {
    type: "proTip",
    title: "Pro tip",
    text: "Keep a simple application tracker with role priorities, recruiter names, next actions, and notes from each conversation. It prevents missed follow-ups and improves interview prep.",
  },
  {
    type: "heading",
    id: "signals",
    title: "Send stronger hiring signals",
  },
  {
    type: "paragraph",
    text: "Every touchpoint should reinforce the same story: the problem you solve, the evidence that you solve it well, and why this company is a credible next step.",
  },
];

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
    content: defaultContent,
    featuredImage:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1400&q=80",
    author: "Maya Rahman",
    authorTitle: "Senior Career Strategist",
    authorAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    authorBio:
      "Maya helps early and mid-career professionals clarify their story, improve hiring signals, and build practical search systems.",
    category: "Career Tips",
    tags: ["job search", "career growth", "applications"],
    publishedAt: "Jun 18, 2026",
    updatedAt: "Jun 18, 2026",
    readingTime: "7 min read",
    likes: 428,
    reads: "12.4K",
    featuredStatus: "featured",
    relatedPostIds: ["blog-002", "blog-003", "blog-004"],
    nextSlug: "resume-bullets-that-show-impact",
  },
  {
    id: "blog-002",
    slug: "resume-bullets-that-show-impact",
    title: "Write resume bullets that prove business impact",
    excerpt:
      "Use a simple evidence-first format to turn responsibilities into outcomes recruiters can quickly understand.",
    content: [
      {
        type: "paragraph",
        text: "Strong resume bullets are not job descriptions. They are compact proof points that connect your work to business outcomes.",
      },
      { type: "heading", id: "formula", title: "Use a clear evidence formula" },
      {
        type: "paragraph",
        text: "Start with the action, add the scope, then close with the measurable result. This structure helps recruiters understand why the work mattered.",
      },
      {
        type: "list",
        items: [
          "Lead with a strong verb.",
          "Include the business context.",
          "Quantify the outcome whenever possible.",
        ],
      },
      {
        type: "quote",
        quote:
          "A resume bullet earns attention when it explains the result, not just the responsibility.",
      },
      { type: "heading", id: "editing", title: "Edit for fast scanning" },
      {
        type: "paragraph",
        text: "Keep bullets direct, remove filler, and prioritize the examples that match your target roles most closely.",
      },
      {
        type: "proTip",
        title: "Pro tip",
        text: "If a bullet starts with responsible for, rewrite it around the change you created or the decision you influenced.",
      },
    ],
    featuredImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
    author: "Daniel Kim",
    authorTitle: "Resume Coach",
    authorAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    authorBio:
      "Daniel writes practical resume guidance for candidates who want clearer, evidence-led career documents.",
    category: "Resume Writing",
    tags: ["resume", "impact", "career documents"],
    publishedAt: "Jun 15, 2026",
    updatedAt: "Jun 16, 2026",
    readingTime: "6 min read",
    likes: 316,
    reads: "8.9K",
    featuredStatus: "standard",
    relatedPostIds: ["blog-001", "blog-003", "blog-007"],
    previousSlug: "stand-out-in-a-competitive-job-market",
    nextSlug: "answer-behavioral-interview-questions",
  },
  {
    id: "blog-003",
    slug: "answer-behavioral-interview-questions",
    title: "A practical framework for behavioral interviews",
    excerpt:
      "Prepare concise stories that show judgment, collaboration, ownership, and clear results under pressure.",
    content: defaultContent,
    featuredImage:
      "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?auto=format&fit=crop&w=1200&q=80",
    author: "Priya Shah",
    authorTitle: "Interview Coach",
    authorAvatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80",
    authorBio:
      "Priya coaches candidates on structured storytelling, interview confidence, and role-specific preparation.",
    category: "Interview Prep",
    tags: ["interviews", "STAR method", "communication"],
    publishedAt: "Jun 12, 2026",
    updatedAt: "Jun 12, 2026",
    readingTime: "8 min read",
    likes: 379,
    reads: "10.1K",
    featuredStatus: "standard",
    relatedPostIds: ["blog-001", "blog-002", "blog-005"],
    previousSlug: "resume-bullets-that-show-impact",
    nextSlug: "networking-without-cold-message-spam",
  },
  {
    id: "blog-004",
    slug: "networking-without-cold-message-spam",
    title: "Networking without sounding transactional",
    excerpt:
      "Build useful professional relationships with targeted outreach, better context, and meaningful follow-up.",
    content: defaultContent,
    featuredImage:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    author: "Omar Castillo",
    authorTitle: "Community Lead",
    authorAvatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80",
    authorBio:
      "Omar writes about professional relationships, community-led career growth, and better outreach habits.",
    category: "Networking",
    tags: ["networking", "outreach", "relationships"],
    publishedAt: "Jun 9, 2026",
    updatedAt: "Jun 9, 2026",
    readingTime: "5 min read",
    likes: 244,
    reads: "6.7K",
    featuredStatus: "standard",
    relatedPostIds: ["blog-001", "blog-006", "blog-008"],
    previousSlug: "answer-behavioral-interview-questions",
    nextSlug: "evaluate-workplace-culture-before-accepting",
  },
  {
    id: "blog-005",
    slug: "evaluate-workplace-culture-before-accepting",
    title: "How to evaluate workplace culture before accepting an offer",
    excerpt:
      "Ask sharper questions, read hiring signals, and identify whether a company's operating style fits how you work best.",
    content: defaultContent,
    featuredImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    author: "Lena Morris",
    authorTitle: "Workplace Researcher",
    authorAvatar:
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=160&q=80",
    authorBio:
      "Lena studies workplace systems and helps candidates evaluate team fit before accepting offers.",
    category: "Workplace Culture",
    tags: ["culture", "offers", "team fit"],
    publishedAt: "Jun 5, 2026",
    updatedAt: "Jun 5, 2026",
    readingTime: "6 min read",
    likes: 221,
    reads: "5.3K",
    featuredStatus: "standard",
    relatedPostIds: ["blog-003", "blog-006", "blog-007"],
    previousSlug: "networking-without-cold-message-spam",
    nextSlug: "remote-work-routine-for-new-hires",
  },
  {
    id: "blog-006",
    slug: "remote-work-routine-for-new-hires",
    title: "Build a remote work routine that earns trust fast",
    excerpt:
      "Use better async updates, visible priorities, and healthy boundaries to ramp up confidently from anywhere.",
    content: defaultContent,
    featuredImage:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
    author: "Noah Bennett",
    authorTitle: "Remote Work Advisor",
    authorAvatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
    authorBio:
      "Noah advises distributed teams and new hires on async communication, trust, and sustainable routines.",
    category: "Remote Work",
    tags: ["remote", "productivity", "onboarding"],
    publishedAt: "Jun 1, 2026",
    updatedAt: "Jun 2, 2026",
    readingTime: "7 min read",
    likes: 286,
    reads: "7.8K",
    featuredStatus: "standard",
    relatedPostIds: ["blog-004", "blog-005", "blog-009"],
    previousSlug: "evaluate-workplace-culture-before-accepting",
    nextSlug: "hiring-trends-shaping-2026",
  },
  {
    id: "blog-007",
    slug: "hiring-trends-shaping-2026",
    title: "Hiring trends shaping candidate decisions in 2026",
    excerpt:
      "Understand how skills-based screening, salary transparency, and faster interview loops are changing the search.",
    content: defaultContent,
    featuredImage:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    author: "Ayesha Karim",
    authorTitle: "Labor Market Analyst",
    authorAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
    authorBio:
      "Ayesha tracks hiring trends and translates labor market shifts into practical guidance for candidates.",
    category: "Hiring Trends",
    tags: ["hiring", "market trends", "talent"],
    publishedAt: "May 28, 2026",
    updatedAt: "May 29, 2026",
    readingTime: "9 min read",
    likes: 401,
    reads: "11.6K",
    featuredStatus: "standard",
    relatedPostIds: ["blog-001", "blog-002", "blog-009"],
    previousSlug: "remote-work-routine-for-new-hires",
    nextSlug: "employer-branding-for-growing-teams",
  },
  {
    id: "blog-008",
    slug: "employer-branding-for-growing-teams",
    title: "Employer branding moves growing teams can make now",
    excerpt:
      "Clarify your candidate promise with authentic stories, transparent process notes, and stronger role pages.",
    content: defaultContent,
    featuredImage:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80",
    author: "Marcus Lee",
    authorTitle: "Employer Brand Consultant",
    authorAvatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=160&q=80",
    authorBio:
      "Marcus helps growing teams communicate their hiring promise through clearer candidate-facing content.",
    category: "Employer Branding",
    tags: ["employer brand", "candidate experience", "teams"],
    publishedAt: "May 24, 2026",
    updatedAt: "May 24, 2026",
    readingTime: "6 min read",
    likes: 198,
    reads: "4.9K",
    featuredStatus: "standard",
    relatedPostIds: ["blog-004", "blog-007", "blog-009"],
    previousSlug: "hiring-trends-shaping-2026",
    nextSlug: "recruitment-insights-for-better-shortlists",
  },
  {
    id: "blog-009",
    slug: "recruitment-insights-for-better-shortlists",
    title: "Recruitment insights that create better shortlists",
    excerpt:
      "Improve role calibration, screening signals, and structured evaluation without slowing down the hiring team.",
    content: defaultContent,
    featuredImage:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    author: "Sophia Grant",
    authorTitle: "Recruitment Operations Lead",
    authorAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
    authorBio:
      "Sophia writes for hiring teams that want stronger calibration, fairer evaluation, and faster shortlists.",
    category: "Recruitment Insights",
    tags: ["recruiting", "screening", "shortlists"],
    publishedAt: "May 20, 2026",
    updatedAt: "May 21, 2026",
    readingTime: "8 min read",
    likes: 267,
    reads: "6.1K",
    featuredStatus: "standard",
    relatedPostIds: ["blog-006", "blog-007", "blog-008"],
    previousSlug: "employer-branding-for-growing-teams",
  },
];

export const popularBlogArticles = [...blogArticles]
  .filter((article) => article.featuredStatus !== "featured")
  .slice(0, 5);

export function getBlogArticleBySlug(slug: string) {
  return blogArticles.find((article) => article.slug === slug);
}

export function getBlogArticleById(id: string) {
  return blogArticles.find((article) => article.id === id);
}

export function getRelatedBlogArticles(article: BlogArticle) {
  return article.relatedPostIds
    .map((id) => getBlogArticleById(id))
    .filter((relatedArticle): relatedArticle is BlogArticle => Boolean(relatedArticle));
}

export function getBlogTableOfContents(article: BlogArticle): BlogTableOfContentsItem[] {
  return article.content
    .filter(
      (block): block is Extract<BlogContentBlock, { type: "heading" }> =>
        block.type === "heading",
    )
    .map((block) => ({
      id: block.id,
      title: block.title,
    }));
}
