import type { Metadata } from "next";

import ServerErrorPage from "@/components/utility/ServerErrorPage";

export const metadata: Metadata = {
  title: "Server Error | CareerBridge",
  description: "A friendly CareerBridge server error page.",
};

export default function ServerErrorRoute() {
  return <ServerErrorPage />;
}
