import type { Metadata } from "next";

import NotFoundPage from "@/components/utility/NotFoundPage";

export const metadata: Metadata = {
  title: "Page Not Found | CareerBridge",
  description: "The requested CareerBridge page could not be found.",
};

export default function NotFound() {
  return <NotFoundPage />;
}
