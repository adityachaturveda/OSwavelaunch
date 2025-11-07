import type { Metadata } from "next";

import { requireAdmin } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "Client Workspace – WaveLaunch OS",
};

export default async function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin({ callbackUrl: "/clients" });

  return children;
}
