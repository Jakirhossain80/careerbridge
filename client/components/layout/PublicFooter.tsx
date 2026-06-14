import Link from "next/link";

const linkColumns = [
  {
    title: "For Job Seekers",
    links: [
      { label: "Find Jobs", href: "/jobs" },
      { label: "Browse Companies", href: "/companies" },
      { label: "Career Advice", href: "/blog" },
      { label: "Contact Support", href: "/contact" },
    ],
  },
  {
    title: "For Employers",
    links: [
      { label: "Post a Job", href: "/register/employer" },
      { label: "Find Candidates", href: "/companies" },
      { label: "Employer Login", href: "/login" },
      { label: "Pricing", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Help Center", href: "/contact" },
      { label: "Contact Us", href: "/contact" },
      { label: "Home", href: "/" },
    ],
  },
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
        <path d="M6.94 8.94H3.69v10.37h3.25V8.94ZM5.31 4.06a1.88 1.88 0 1 0 0 3.75 1.88 1.88 0 0 0 0-3.75Zm13.5 9.42c0-3.13-1.67-4.58-3.9-4.58a3.36 3.36 0 0 0-3.03 1.67h-.05V8.94H8.72v10.37h3.25v-5.13c0-1.35.26-2.66 1.94-2.66 1.65 0 1.67 1.55 1.67 2.75v5.04h3.25v-5.83Z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
        <path d="M14.25 8.5V6.88c0-.78.52-.96.89-.96h2.27V2.1L14.28 2.08c-3.48 0-4.27 2.61-4.27 4.28V8.5H7.27v3.94h2.74V22h4.24v-9.56h2.86l.38-3.94h-3.24Z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
        <path d="M13.91 10.47 21.36 2h-1.77l-6.46 7.35L7.96 2H2l7.82 11.13L2 22h1.77l6.84-7.77L16.08 22h5.96l-8.13-11.53Zm-2.42 2.75-.79-1.1L4.4 3.3h2.71l5.08 7.1.79 1.1 6.61 9.25h-2.71l-5.39-7.53Z" />
      </svg>
    ),
  },
];

const bottomLinks = [
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Privacy", href: "/privacy" },
];

export default function PublicFooter() {
  return (
    <footer className="border-t border-[#e4e1ee] bg-[#f7f5fb] text-[#1f2937]">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.45fr_1fr_1fr_1fr] lg:gap-12">
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-3 font-heading text-xl font-bold tracking-tight text-[#111827]"
              aria-label="CareerBridge home"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white shadow-sm">
                CB
              </span>
              <span>CareerBridge</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#6b7280]">
              Connecting skills, goals, and career opportunities for job seekers
              and employers.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex size-9 items-center justify-center rounded-full border border-[#d8d3e6] bg-white text-[#6b7280] transition hover:border-primary hover:text-primary"
                  aria-label={link.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {linkColumns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="font-heading text-sm font-semibold text-[#111827]">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm leading-6 text-[#6b7280] transition hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-[#e4e1ee] pt-6 text-sm text-[#6b7280] sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 CareerBridge</p>

          <nav
            className="flex flex-wrap items-center gap-x-6 gap-y-3"
            aria-label="Footer secondary navigation"
          >
            {bottomLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
