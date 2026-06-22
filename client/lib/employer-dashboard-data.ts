export type EmployerProfile = {
  companyName: string;
  contactName: string;
  email: string;
};

export type EmployerStats = {
  totalPostedJobs: number;
  activeJobs: number;
  expiredJobs: number;
  totalApplicants: number;
  shortlisted: number;
};

export type RecentApplication = {
  id: string;
  candidateName: string;
  role: string;
  appliedAt: string;
  status: "New" | "Reviewed" | "Shortlisted" | "Interview";
};

export type ActiveJob = {
  id: string;
  title: string;
  location: string;
  type: string;
  applicants: number;
  postedAt: string;
};

export type PerformancePoint = {
  label: string;
  applicants: number;
  views: number;
};

export type UpcomingInterview = {
  id: string;
  candidateName: string;
  role: string;
  date: string;
  time: string;
  mode: "Video" | "On-site" | "Phone";
};

export type EmployerDashboardData = {
  employerProfile: EmployerProfile;
  stats: EmployerStats;
  recentApplications: RecentApplication[];
  activeJobs: ActiveJob[];
  performanceData: PerformancePoint[];
  upcomingInterviews: UpcomingInterview[];
};

export const employerDashboardData: EmployerDashboardData = {
  employerProfile: {
    companyName: "NovaTech Solutions",
    contactName: "Ariana Carter",
    email: "ariana@novatech.example",
  },
  stats: {
    totalPostedJobs: 48,
    activeJobs: 12,
    expiredJobs: 7,
    totalApplicants: 1248,
    shortlisted: 86,
  },
  performanceData: [
    { label: "Jan", applicants: 88, views: 340 },
    { label: "Feb", applicants: 124, views: 410 },
    { label: "Mar", applicants: 156, views: 520 },
    { label: "Apr", applicants: 132, views: 470 },
    { label: "May", applicants: 198, views: 690 },
    { label: "Jun", applicants: 236, views: 760 },
  ],
  recentApplications: [
    {
      id: "app-001",
      candidateName: "Maya Johnson",
      role: "Product Designer",
      appliedAt: "Today",
      status: "New",
    },
    {
      id: "app-002",
      candidateName: "Ethan Williams",
      role: "Frontend Engineer",
      appliedAt: "Yesterday",
      status: "Shortlisted",
    },
    {
      id: "app-003",
      candidateName: "Priya Shah",
      role: "Data Analyst",
      appliedAt: "Jun 19, 2026",
      status: "Reviewed",
    },
    {
      id: "app-004",
      candidateName: "Lucas Brown",
      role: "Customer Success Manager",
      appliedAt: "Jun 18, 2026",
      status: "Interview",
    },
  ],
  activeJobs: [
    {
      id: "job-001",
      title: "Senior Full Stack Engineer",
      location: "Remote",
      type: "Full-time",
      applicants: 142,
      postedAt: "Posted 4 days ago",
    },
    {
      id: "job-002",
      title: "Product Designer",
      location: "New York, NY",
      type: "Full-time",
      applicants: 87,
      postedAt: "Posted 1 week ago",
    },
    {
      id: "job-003",
      title: "Marketing Specialist",
      location: "Austin, TX",
      type: "Contract",
      applicants: 53,
      postedAt: "Posted 2 weeks ago",
    },
  ],
  upcomingInterviews: [
    {
      id: "int-001",
      candidateName: "Ethan Williams",
      role: "Frontend Engineer",
      date: "Jun 24, 2026",
      time: "10:30 AM",
      mode: "Video",
    },
    {
      id: "int-002",
      candidateName: "Lucas Brown",
      role: "Customer Success Manager",
      date: "Jun 25, 2026",
      time: "2:00 PM",
      mode: "Phone",
    },
    {
      id: "int-003",
      candidateName: "Nora Lee",
      role: "People Operations Lead",
      date: "Jun 27, 2026",
      time: "11:00 AM",
      mode: "On-site",
    },
  ],
};
