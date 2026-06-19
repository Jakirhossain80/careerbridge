"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type ActiveFooterLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function ActiveFooterLink({
  href,
  className = "",
  children,
}: ActiveFooterLinkProps) {
  const pathname = usePathname();
  const isActive = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      className={`${className} transition hover:text-primary ${
        isActive
          ? "text-primary font-semibold underline underline-offset-4"
          : "text-muted"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
