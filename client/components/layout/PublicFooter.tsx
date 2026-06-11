import Link from "next/link";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Jobs", href: "/jobs" },
  { label: "Companies", href: "/companies" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-heading text-lg font-semibold text-foreground">
            CareerBridge
          </p>
          <p className="mt-1 text-sm text-muted">
            Connecting skills, goals, and career opportunities.
          </p>
        </div>

        <nav
          className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-muted"
          aria-label="Footer navigation"
        >
          {footerLinks.map((link) => (
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
    </footer>
  );
}
