import type { ReactNode } from "react";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicNavbar />
      <div className="flex-1">{children}</div>
      <PublicFooter />
    </>
  );
}
