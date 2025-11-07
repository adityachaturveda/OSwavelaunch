import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wavelaunch Studio Application Form",
  description: "Apply to Wavelaunch Studio to collaborate on launching your next brand venture.",
};

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
