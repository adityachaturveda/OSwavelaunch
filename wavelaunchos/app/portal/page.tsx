import { requireClient } from "@/lib/auth/guards";

export default async function PortalHome() {
  const session = await requireClient({ callbackUrl: "/portal" });

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-3xl space-y-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Welcome back, {session.user.name ?? "client"}.
        </h1>
        <p className="text-base text-muted-foreground">
          The client workspace is under active development. You&apos;ll soon be able to review plans, deliverables,
          files, and notes shared with your team here.
        </p>
      </div>
    </div>
  );
}

