import Link from "next/link";

import ActiveNavLink from "./ActiveNavLink";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Jobs", href: "/jobs" },
  { label: "Companies", href: "/companies" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function PublicNavbar() {
  return (
    <header className="border-b border-slate-200 bg-surface">
      <nav
        className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
        aria-label="Public navigation"
      >
        <Link
          href="/"
          className="font-heading text-xl font-bold tracking-tight text-foreground"
        >
          CareerBridge
        </Link>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium text-muted">
          {navigationLinks.map((link) => (
            <ActiveNavLink key={link.href} href={link.href}>
              {link.label}
            </ActiveNavLink>
          ))}
          <Link
            href="/login"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
